"""Contract lifecycle endpoints — draft, invite, propose, sign.

The workflow, in plain English:
  1. Owner (creator/label/etc.) drafts a contract of a given kind
     (publishing / distribution / catalogue_acquisition). We hydrate it
     with the industry-standard clauses baked into contract_templates.py.
  2. Owner invites one or more counterparties by email. Every invite also
     produces a shareable link (with a signed token) they can send via
     WhatsApp, SMS, or any other channel.
  3. Invitees view the contract, propose edits on any clause flagged
     `negotiable`. Locked (non-negotiable) clauses cannot be modified.
  4. Owner accepts or rejects each proposal. Accepted proposals rewrite
     the clause body.
  5. Every party signs when they're happy — signature is a timestamped
     click. The contract's status flows draft \u2192 negotiating \u2192 signed.
"""
from __future__ import annotations

import secrets
from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import Contract, ContractClause, ContractInvitee, ContractProposal
from services.contract_templates import build_contract

router = APIRouter(prefix="/api/contracts", tags=["contracts"])


# ---------------------------------------------------------------------------
# Request shapes
# ---------------------------------------------------------------------------
class ContractDraftRequest(BaseModel):
    kind: str                          # publishing | distribution | catalogue_acquisition
    linked_deal_id: Optional[str] = None
    context: dict = {}


class InviteRequest(BaseModel):
    email: str
    role: Optional[str] = "counterparty"
    channel: Optional[str] = "email"


class ProposalRequest(BaseModel):
    clause_id: str
    new_body: str
    note: Optional[str] = None


class ResolveProposalRequest(BaseModel):
    clause_id: str
    proposal_index: int
    accept: bool


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _serialise(contract: Contract) -> dict:
    """Serialise a Contract model with datetime -> ISO for JSON transport."""
    return contract.model_dump(mode="json")


def _to_update(contract: Contract) -> dict:
    """Prepare a mongo `$set` payload — strip the immutable `_id` field."""
    data = contract.to_mongo()
    data.pop("_id", None)
    return data


def _load_owned(user_id: str, contract_id: str) -> Contract:
    # owner_id is stored as a string (PyObjectId serialises to str).
    doc = db.contracts.find_one({"_id": ObjectId(contract_id), "owner_id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Contract not found")
    return Contract.from_mongo(doc)


def _load_readable(user: dict, contract_id: str) -> Contract:
    """Owner OR an invitee (by user_id or matching email) can read."""
    email = user.get("email", "")
    uid = str(user["_id"])
    doc = db.contracts.find_one({
        "_id": ObjectId(contract_id),
        "$or": [
            {"owner_id": uid},
            {"invitees.user_id": uid},
            {"invitees.email": email},
        ],
    })
    if not doc:
        raise HTTPException(status_code=404, detail="Contract not found")
    return Contract.from_mongo(doc)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("", response_model=dict)
def create_contract(payload: ContractDraftRequest, current_user: dict = Depends(get_current_user)):
    if payload.kind not in {"publishing", "distribution", "catalogue_acquisition"}:
        raise HTTPException(status_code=422, detail=f"Unknown contract kind: {payload.kind}")
    title, raw_clauses = build_contract(payload.kind, payload.context or {})

    now = datetime.now(timezone.utc)
    clauses = [ContractClause(**c) for c in raw_clauses]
    contract = Contract(
        owner_id=str(current_user["_id"]),
        kind=payload.kind,
        linked_deal_id=payload.linked_deal_id,
        title=title,
        status="draft",
        clauses=clauses,
        invitees=[],
        share_token=secrets.token_urlsafe(16),
        created_at=now,
        updated_at=now,
    )
    doc = contract.to_mongo()
    result = db.contracts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialise(Contract.from_mongo(doc))


@router.get("", response_model=List[dict])
def list_my_contracts(current_user: dict = Depends(get_current_user)):
    """Every contract where the caller is owner OR an invitee."""
    email = current_user.get("email", "")
    uid = str(current_user["_id"])
    cursor = db.contracts.find({
        "$or": [
            {"owner_id": uid},
            {"invitees.user_id": uid},
            {"invitees.email": email},
        ],
    }).sort("updated_at", -1)
    return [_serialise(Contract.from_mongo(d)) for d in cursor]


@router.get("/{contract_id}", response_model=dict)
def get_contract(contract_id: str, current_user: dict = Depends(get_current_user)):
    contract = _load_readable(current_user, contract_id)
    return _serialise(contract)


@router.post("/{contract_id}/invite", response_model=dict)
def invite_party(contract_id: str, payload: InviteRequest, current_user: dict = Depends(get_current_user)):
    contract = _load_owned(str(current_user["_id"]), contract_id)
    # Idempotent: skip if this email is already invited.
    if any(i.email.lower() == payload.email.lower() for i in contract.invitees):
        return _serialise(contract)
    # If the invitee already has a TuneMavens account, link the user_id
    # so the contract shows up in their "Contracts to review" list.
    existing_user = db.users.find_one({"email": payload.email.lower()})
    invitee = ContractInvitee(
        email=payload.email.lower(),
        role=payload.role or "counterparty",
        channel=payload.channel or "email",
        user_id=str(existing_user["_id"]) if existing_user else None,
    )
    contract.invitees.append(invitee)
    contract.status = "negotiating" if contract.status == "draft" else contract.status
    contract.updated_at = datetime.now(timezone.utc)
    db.contracts.update_one(
        {"_id": ObjectId(contract_id)},
        {"$set": _to_update(contract)},
    )
    return _serialise(contract)


@router.post("/{contract_id}/propose", response_model=dict)
def propose_edit(contract_id: str, payload: ProposalRequest, current_user: dict = Depends(get_current_user)):
    contract = _load_readable(current_user, contract_id)
    target: Optional[ContractClause] = next((c for c in contract.clauses if c.id == payload.clause_id), None)
    if not target:
        raise HTTPException(status_code=404, detail=f"Clause {payload.clause_id} not found")
    if not target.negotiable:
        raise HTTPException(
            status_code=409,
            detail=(target.non_negotiable_reason or "This clause is locked by industry-standard music-business protections and cannot be modified."),
        )
    proposal = ContractProposal(
        proposed_by=str(current_user["_id"]),
        new_body=payload.new_body,
        note=payload.note,
    )
    target.proposals.append(proposal)
    contract.status = "negotiating"
    contract.updated_at = datetime.now(timezone.utc)
    db.contracts.update_one({"_id": ObjectId(contract_id)}, {"$set": _to_update(contract)})
    return _serialise(contract)


@router.post("/{contract_id}/resolve-proposal", response_model=dict)
def resolve_proposal(contract_id: str, payload: ResolveProposalRequest, current_user: dict = Depends(get_current_user)):
    contract = _load_owned(str(current_user["_id"]), contract_id)
    target: Optional[ContractClause] = next((c for c in contract.clauses if c.id == payload.clause_id), None)
    if not target:
        raise HTTPException(status_code=404, detail=f"Clause {payload.clause_id} not found")
    if payload.proposal_index < 0 or payload.proposal_index >= len(target.proposals):
        raise HTTPException(status_code=404, detail="Proposal not found")
    prop = target.proposals[payload.proposal_index]
    prop.status = "accepted" if payload.accept else "rejected"
    prop.resolved_by = str(current_user["_id"])
    prop.resolved_at = datetime.now(timezone.utc)
    if payload.accept:
        target.body = prop.new_body
    contract.updated_at = datetime.now(timezone.utc)
    db.contracts.update_one({"_id": ObjectId(contract_id)}, {"$set": _to_update(contract)})
    return _serialise(contract)


@router.post("/{contract_id}/sign", response_model=dict)
def sign_contract(contract_id: str, current_user: dict = Depends(get_current_user)):
    contract = _load_readable(current_user, contract_id)
    now = datetime.now(timezone.utc)
    is_owner = str(contract.owner_id) == str(current_user["_id"])
    if is_owner:
        contract.owner_signed_at = now
    email = current_user.get("email", "").lower()
    for inv in contract.invitees:
        if inv.email == email or inv.user_id == str(current_user["_id"]):
            inv.signed_at = now
    if contract.owner_signed_at and all(i.signed_at for i in contract.invitees):
        contract.status = "signed"
    contract.updated_at = now
    db.contracts.update_one({"_id": ObjectId(contract_id)}, {"$set": _to_update(contract)})
    return _serialise(contract)


@router.post("/{contract_id}/cancel", response_model=dict)
def cancel_contract(contract_id: str, current_user: dict = Depends(get_current_user)):
    contract = _load_owned(str(current_user["_id"]), contract_id)
    contract.status = "cancelled"
    contract.updated_at = datetime.now(timezone.utc)
    db.contracts.update_one({"_id": ObjectId(contract_id)}, {"$set": _to_update(contract)})
    return _serialise(contract)
