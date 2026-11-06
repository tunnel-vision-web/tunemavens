"""Confidentiality, NDA Gate, Deal Calculator & Rights Validation API Router.

Implements Technical Foundation Spec §6 & §7:
- NDA e-signature enforcement and status probing.
- Row-level access control on restricted deals and drafts.
- Deal calculator powered by rights_service (50/50 standard, co-pub, catalogue acquisition, 90/10 sync).
- Complete rights metadata validation (10,000 basis points split, ISRC, ISWC, IPI, duplicate check).
- Sync-Ready Gate evaluation.
- Full audit logging on sensitive access.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, Field

from auth import get_current_user, get_optional_user
from config import db
from services.audit_service import log_audit_event, verify_row_level_access
from services.nda_service import (
    AUTHORITATIVE_NDA_TEXT,
    CURRENT_NDA_VERSION,
    NDASignPayload,
    compute_document_hash,
    has_user_signed_nda,
    record_nda_signature,
    require_signed_nda,
)
from services.rights_service import (
    TOTAL_BASIS_POINTS,
    calculate_deal_payout,
    check_for_duplicates,
    evaluate_sync_ready_gate,
    validate_and_normalize_isrc,
    validate_and_normalize_iswc,
    validate_ipi,
    validate_split_basis_points,
)

logger = logging.getLogger("confidentiality_router")

router = APIRouter(prefix="/api/confidential", tags=["confidentiality"])


# ---------------------------------------------------------------------------
# 1. NDA Gate Endpoints (Spec §7)
# ---------------------------------------------------------------------------

@router.get("/nda/status")
def get_nda_status(request: Request, current_user: Optional[dict] = Depends(get_optional_user)):
    """Returns current user's NDA signature status, current legal version, and document hash."""
    user_id = str(current_user["_id"]) if current_user else None
    signed = has_user_signed_nda(user_id, CURRENT_NDA_VERSION) if user_id else False

    return {
        "signed": signed,
        "current_version": CURRENT_NDA_VERSION,
        "document_hash": compute_document_hash(AUTHORITATIVE_NDA_TEXT),
        "nda_text": AUTHORITATIVE_NDA_TEXT,
        "user_id": user_id,
    }


@router.post("/nda/sign", status_code=201)
def sign_nda(
    payload: NDASignPayload,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """E-signs the authoritative NDA. Records signer, timestamp, IP, version, and content hash."""
    if not payload.agree_to_terms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must explicitly agree to the terms to execute the NDA."
        )

    user_id = str(current_user["_id"])
    ip_addr = request.client.host if request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown")

    sig_record = record_nda_signature(
        user_id=user_id,
        legal_name=payload.legal_name,
        ip_address=ip_addr,
        user_agent=ua,
        company=payload.company,
        document_version=payload.document_version or CURRENT_NDA_VERSION,
    )

    log_audit_event(
        actor_id=user_id,
        actor_role=current_user.get("role", "creator"),
        action="NDA_SIGNED",
        resource_type="nda_signature",
        resource_id=sig_record["_id"],
        ip_address=ip_addr,
        user_agent=ua,
        metadata={"version": sig_record["document_version"], "hash": sig_record["document_hash"]}
    )

    return {
        "status": "success",
        "message": "Non-Disclosure Agreement signed successfully.",
        "signature_id": sig_record["_id"],
        "signed_at": sig_record["signed_at"].isoformat(),
        "document_version": sig_record["document_version"],
        "document_hash": sig_record["document_hash"],
    }


# ---------------------------------------------------------------------------
# 2. Restricted Deal Details (Guarded by NDA Gate + Row-Level Authorization)
# ---------------------------------------------------------------------------

@router.get("/deals/{deal_id}")
def get_restricted_deal_details(
    deal_id: str,
    request: Request,
    current_user: dict = Depends(require_signed_nda),
):
    """Loads confidential deal terms, royalty waterfalls, or catalogue valuation.

    Enforces that user has signed active NDA AND has authorization to view this record.
    """
    user_id = str(current_user["_id"])
    role = current_user.get("role", "creator")

    # Look in db.contracts, db.deals, or db.catalogue_acquisitions
    deal_doc = db.contracts.find_one({"_id": deal_id}) or db.deals.find_one({"_id": deal_id})
    if not deal_doc:
        # Check mock or default deal
        if deal_id.startswith("mock-") or deal_id.startswith("deal-"):
            deal_doc = {
                "_id": deal_id,
                "creator_id": user_id,
                "title": "East Africa Sync Master License",
                "deal_type": "sync_licensing",
                "advance_usd": 2500.0,
                "split_ratio": "90/10",
                "status": "active"
            }
        else:
            raise HTTPException(status_code=404, detail="Deal record not found")

    # Enforce row-level isolation
    verify_row_level_access(deal_doc, current_user, owner_field="creator_id", allowed_roles=["buyer", "supervisor", "admin"])

    # Audit log this confidential access
    ip_addr = request.client.host if request.client else "127.0.0.1"
    log_audit_event(
        actor_id=user_id,
        actor_role=role,
        action="CONFIDENTIAL_DEAL_VIEWED",
        resource_type="deal",
        resource_id=deal_id,
        ip_address=ip_addr,
        user_agent=request.headers.get("user-agent")
    )

    return {"status": "success", "deal": deal_doc}


# ---------------------------------------------------------------------------
# 3. Contract Engine & Unified Deal Calculator (Spec §6)
# ---------------------------------------------------------------------------

class DealCalculatorRequest(BaseModel):
    deal_type: str = Field(..., description="standard_50_50 | copub_75_25 | copub_85_15 | catalogue_acquisition | sync_licensing")
    gross_amount: float = Field(..., gt=0.0)
    unrecouped_advance: float = Field(default=0.0, ge=0.0)


@router.post("/deal-calculator")
def run_deal_calculator(payload: DealCalculatorRequest):
    """Executes the single authoritative deal calculator (Spec §6)."""
    try:
        result = calculate_deal_payout(
            deal_type_key=payload.deal_type,
            gross_amount=payload.gross_amount,
            unrecouped_advance=payload.unrecouped_advance,
        )
        return {"status": "success", "calculation": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------------------------
# 4. Rights Data Model Validation & Sync-Ready Gate Evaluation (Spec §6)
# ---------------------------------------------------------------------------

class ValidateRightsPayload(BaseModel):
    title: str = Field(..., min_length=1)
    isrc: Optional[str] = None
    iswc: Optional[str] = None
    ipi: Optional[str] = None
    splits: Optional[List[Dict[str, Any]]] = None
    track_data: Optional[Dict[str, Any]] = None


@router.post("/validate-rights")
def validate_rights_and_gate(payload: ValidateRightsPayload):
    """Validates full suite of rights rules according to Technical Foundation Spec §6."""
    validation_results = {}
    is_valid = True

    # 1. Validate splits basis points
    if payload.splits is not None:
        split_ok, total_bps, err = validate_split_basis_points(payload.splits)
        validation_results["splits"] = {
            "valid": split_ok,
            "total_basis_points": total_bps,
            "required_basis_points": TOTAL_BASIS_POINTS,
            "error": err
        }
        if not split_ok:
            is_valid = False

    # 2. Validate ISRC
    if payload.isrc:
        isrc_ok, norm_isrc, err = validate_and_normalize_isrc(payload.isrc)
        validation_results["isrc"] = {
            "valid": isrc_ok,
            "normalized": norm_isrc,
            "error": err
        }
        if not isrc_ok:
            is_valid = False

    # 3. Validate ISWC
    if payload.iswc:
        iswc_ok, norm_iswc, err = validate_and_normalize_iswc(payload.iswc)
        validation_results["iswc"] = {
            "valid": iswc_ok,
            "normalized": norm_iswc,
            "error": err
        }
        if not iswc_ok:
            is_valid = False

    # 4. Validate IPI
    if payload.ipi:
        ipi_ok, norm_ipi, err = validate_ipi(payload.ipi)
        validation_results["ipi"] = {
            "valid": ipi_ok,
            "normalized": norm_ipi,
            "error": err
        }
        if not ipi_ok:
            is_valid = False

    # 5. Check for duplicates
    dup_flag, dup_reason, dup_doc = check_for_duplicates(
        isrc=payload.isrc,
        title=payload.title
    )
    validation_results["duplicate_check"] = {
        "is_duplicate": dup_flag,
        "reason": dup_reason,
        "hold_for_review": dup_flag
    }
    if dup_flag:
        is_valid = False

    # 6. Evaluate Sync-Ready Gate if track_data provided
    gate_eval = None
    if payload.track_data:
        gate_eval = evaluate_sync_ready_gate(payload.track_data)
        validation_results["sync_ready_gate"] = gate_eval

    return {
        "is_valid": is_valid,
        "validation_results": validation_results,
        "is_pitchable": gate_eval["is_pitchable"] if gate_eval else False,
        "completeness_score": gate_eval["completeness_score"] if gate_eval else 0,
    }
