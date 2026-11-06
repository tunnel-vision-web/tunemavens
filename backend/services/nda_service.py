"""Confidentiality & NDA Enforcement Service.

Implements Technical Foundation Spec §7:
- Server-enforced NDA Gate: E-sign required before restricted deal/catalogue content loads.
- Immutable signature records: Signer user ID, legal name, IP address, user agent,
  document version, signed timestamp, and SHA-256 document content hash.
- FastAPI dependencies: require_signed_nda for sensitive endpoints.
"""
from __future__ import annotations

import hashlib
import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from auth import get_current_user
from config import db

logger = logging.getLogger("nda_service")

# Current authoritative NDA version and legal text
CURRENT_NDA_VERSION = "2026.1-EASTAFRICA-SYNC"

AUTHORITATIVE_NDA_TEXT = """INTERMAVEN NETWORK / TUNEMAVENS CONFIDENTIALITY & MUTUAL NDA
Version: 2026.1-EASTAFRICA-SYNC

This Non-Disclosure Agreement governs all confidential trade secrets, master audio stems,
advance recoupment terms, synch placement briefs, and unpublished writer split percentages
disclosed through TuneMavens, SyncMavens, and the Intermaven Network.

1. Confidential Information includes all non-public catalogue items, pricing sheets,
   unreleased compositions, deal waterfall models, and third-party commercial briefs.
2. The Receiving Party agrees to maintain strict confidentiality, not to distribute,
   sample, replicate, or train artificial intelligence models without express written authorization.
3. This agreement is legally binding upon digital submission and cryptographically anchored.
"""


def compute_document_hash(text: str) -> str:
    """Calculates SHA-256 hash of the authoritative NDA text."""
    return hashlib.sha256(text.strip().encode("utf-8")).hexdigest()


class NDASignPayload(BaseModel):
    legal_name: str = Field(..., min_length=2, max_length=120)
    company: Optional[str] = None
    agree_to_terms: bool = Field(..., description="Must be explicitly True")
    document_version: str = Field(default=CURRENT_NDA_VERSION)


def record_nda_signature(
    user_id: str,
    legal_name: str,
    ip_address: str,
    user_agent: str,
    company: Optional[str] = None,
    document_version: str = CURRENT_NDA_VERSION,
) -> Dict[str, Any]:
    """Records an immutable, cryptographically hashed NDA e-signature in db.nda_signatures."""
    doc_hash = compute_document_hash(AUTHORITATIVE_NDA_TEXT)
    now = datetime.now(timezone.utc)

    sig_doc = {
        "user_id": str(user_id),
        "legal_name": legal_name.strip(),
        "company": company.strip() if company else None,
        "document_version": document_version,
        "document_hash": doc_hash,
        "ip_address": ip_address,
        "user_agent": user_agent,
        "signed_at": now,
        "is_active": True,
    }

    res = db.nda_signatures.insert_one(sig_doc)
    sig_doc["_id"] = str(res.inserted_id)

    # Flag user document as having signed active NDA
    try:
        db.users.update_one(
            {"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id},
            {"$set": {"nda_signed": True, "nda_version": document_version, "nda_signed_at": now}}
        )
    except Exception as e:
        logger.warning(f"Could not update user NDA flag: {e}")

    logger.info(f"[NDA Gate] Recorded verified NDA signature for user {user_id} (Version: {document_version}, Hash: {doc_hash[:10]})")
    return sig_doc


def has_user_signed_nda(user_id: str, document_version: str = CURRENT_NDA_VERSION) -> bool:
    """Checks whether the user has a valid signature on file for the current NDA version."""
    if not user_id:
        return False
    doc = db.nda_signatures.find_one({
        "user_id": str(user_id),
        "document_version": document_version,
        "is_active": True
    })
    return bool(doc)


def require_signed_nda(
    request: Request,
    current_user: dict = Depends(get_current_user)
) -> dict:
    """FastAPI route dependency enforcing the server-side NDA gate.

    Raises HTTP 403 Forbidden with structured code if NDA is not signed.
    """
    user_id = str(current_user["_id"])
    role = current_user.get("role", "")

    # Admins bypass NDA requirement for operational review
    if role == "admin" or current_user.get("is_admin") is True:
        return current_user

    if not has_user_signed_nda(user_id, CURRENT_NDA_VERSION):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "NDA_REQUIRED",
                "message": "Access restricted. You must e-sign the TuneMavens Confidentiality Agreement before viewing deal terms or master catalogues.",
                "document_version": CURRENT_NDA_VERSION,
                "document_hash": compute_document_hash(AUTHORITATIVE_NDA_TEXT),
                "signing_endpoint": "/api/confidential/nda/sign"
            }
        )

    return current_user
