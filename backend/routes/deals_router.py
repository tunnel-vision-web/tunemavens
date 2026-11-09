"""Phase 3 endpoints for the three §9.7 deal collections.

Phase 3 wires the Creator Pipeline elections (publishing tier + distribution
path) end-to-end. Audit-trail semantics: every new election INSERTS a fresh
document and supersedes any prior active record for that creator, so we keep
the full history while still exposing a single "current" record. Cascade math
& contract generation remain in Phase 7 / Phase 8.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
import time
import secrets

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from auth import get_current_user
from config import db
from models import (
    CatalogueAcquisition,
    DistributionDeal,
    PublishingDeal,
)

router = APIRouter(prefix="/api/deals", tags=["deals"])


def _supersede_active(collection, creator_id: str) -> None:
    """Mark every active deal in `collection` for this creator as superseded.

    Called immediately before inserting a new active election, so the
    "Current" record on the frontend is always unambiguous while the
    history list grows.
    """
    collection.update_many(
        {"creator_id": creator_id, "status": "active"},
        {"$set": {"status": "superseded", "superseded_at": datetime.now(timezone.utc)}},
    )


# ----------------------------------------------------------------------
# Publishing deals
# ----------------------------------------------------------------------
@router.get("/publishing", response_model=List[PublishingDeal])
def list_publishing_deals(
    active_only: bool = False,
    current_user: dict = Depends(get_current_user),
):
    query: dict = {"creator_id": str(current_user["_id"])}
    if active_only:
        query["status"] = "active"
    cursor = db.publishing_deals.find(query).sort("created_at", -1)
    return [PublishingDeal.from_mongo(d) for d in cursor]


@router.post("/publishing", response_model=PublishingDeal, status_code=201)
def create_publishing_deal(payload: PublishingDeal, current_user: dict = Depends(get_current_user)):
    payload.creator_id = str(current_user["_id"])
    if payload.tier not in {"standard_admin", "full_service_copub"}:
        raise HTTPException(status_code=422, detail="tier must be 'standard_admin' or 'full_service_copub'")
    # Audit trail: supersede any active election before inserting the new one.
    _supersede_active(db.publishing_deals, str(current_user["_id"]))
    payload.status = "active"
    doc = payload.to_mongo()
    result = db.publishing_deals.insert_one(doc)
    doc["_id"] = result.inserted_id
    return PublishingDeal.from_mongo(doc)


# ----------------------------------------------------------------------
# Distribution deals
# ----------------------------------------------------------------------
@router.get("/distribution", response_model=List[DistributionDeal])
def list_distribution_deals(
    active_only: bool = False,
    current_user: dict = Depends(get_current_user),
):
    query: dict = {"creator_id": str(current_user["_id"])}
    if active_only:
        query["status"] = "active"
    cursor = db.distribution_deals.find(query).sort("created_at", -1)
    return [DistributionDeal.from_mongo(d) for d in cursor]


@router.post("/distribution", response_model=DistributionDeal, status_code=201)
def create_distribution_deal(payload: DistributionDeal, current_user: dict = Depends(get_current_user)):
    payload.creator_id = str(current_user["_id"])
    valid_paths = {"standard_fee_matched", "tunemavens_native", "label_negotiated"}
    if payload.path not in valid_paths:
        raise HTTPException(status_code=422, detail=f"path must be one of {valid_paths}")
    if payload.fee_structure not in {"flat_fee", "rev_share"}:
        raise HTTPException(status_code=422, detail="fee_structure must be 'flat_fee' or 'rev_share'")
    _supersede_active(db.distribution_deals, str(current_user["_id"]))
    payload.status = "active"
    doc = payload.to_mongo()
    result = db.distribution_deals.insert_one(doc)
    doc["_id"] = result.inserted_id
    return DistributionDeal.from_mongo(doc)


# ----------------------------------------------------------------------
# Catalogue acquisitions / advances (recoupment ledger)
# ----------------------------------------------------------------------
@router.get("/catalogue-acquisitions", response_model=List[CatalogueAcquisition])
def list_catalogue_acquisitions(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    query = {"$or": [{"creator_id": user_id}, {"artist_name": {"$exists": True}}]}
    count = db.catalogue_acquisitions.count_documents(query)
    if count == 0:
        # Seed realistic demonstration acquisitions for label console
        seed_docs = [
            {
                "creator_id": user_id,
                "deal_type": "publishing_advance",
                "original_amount": 15000.0,
                "recouped_to_date": 9200.0,
                "remaining_balance": 5800.0,
                "cross_collateralized": True,
                "artist_name": "Ndufo Victoria",
                "catalogue_title": "Ndufo Afrobeats Publishing & Sync Advance",
                "track_count": 18,
                "recoupment_rate_pct": 50.0,
                "status": "active",
                "passport_id": "TM-ACQ-2026-8812",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            },
            {
                "creator_id": user_id,
                "deal_type": "catalogue_purchase",
                "original_amount": 28000.0,
                "recouped_to_date": 28000.0,
                "remaining_balance": 0.0,
                "cross_collateralized": False,
                "artist_name": "Khalid Waves",
                "catalogue_title": "Khalid Waves Deep-House Master Rights Buyout",
                "track_count": 24,
                "recoupment_rate_pct": 100.0,
                "status": "recouped",
                "passport_id": "TM-ACQ-2026-8813",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
        ]
        db.catalogue_acquisitions.insert_many(seed_docs)

    cursor = db.catalogue_acquisitions.find(query).sort("created_at", -1)
    return [CatalogueAcquisition.from_mongo(d) for d in cursor]


@router.post("/catalogue-acquisitions", response_model=CatalogueAcquisition, status_code=201)
def create_catalogue_acquisition(
    payload: CatalogueAcquisition, current_user: dict = Depends(get_current_user)
):
    payload.creator_id = str(current_user["_id"])
    valid_types = {
        "catalogue_purchase",
        "publishing_advance",
        "distribution_advance",
        "sync_advance",
    }
    if payload.deal_type not in valid_types:
        raise HTTPException(status_code=422, detail=f"deal_type must be one of {valid_types}")
    # remaining_balance defaults to original_amount on creation if client didn't set it
    if payload.remaining_balance == 0 and payload.recouped_to_date == 0:
        payload.remaining_balance = payload.original_amount
    if not payload.passport_id:
        payload.passport_id = f"TM-ACQ-2026-{secrets.token_hex(2).upper()}"
    if payload.remaining_balance <= 0:
        payload.status = "recouped"
    else:
        payload.status = "active"

    doc = payload.to_mongo()
    result = db.catalogue_acquisitions.insert_one(doc)
    doc["_id"] = result.inserted_id
    return CatalogueAcquisition.from_mongo(doc)


# ======================================================================
# Phase 4: Distribution Path C Negotiation Wizard & Catalogue Recoupment
# ======================================================================

class PathCNegotiationRequest(BaseModel):
    label_name: Optional[str] = "Independent Record Label"
    roster_size: int = 15
    catalogue_track_count: int = 45
    proposed_creator_split: float = 75.0
    proposed_tunemavens_split: float = 25.0
    advance_requested: float = 0.0
    territory: str = "Worldwide"
    term_years: int = 3
    marketing_commitment: Optional[str] = "Standard DSP Pitching"
    notes: Optional[str] = None
    round_number: int = 1


class RecoupmentApplyRequest(BaseModel):
    amount: float
    source: Optional[str] = "Split Cascade DSP Settlement"
    notes: Optional[str] = None


@router.post("/distribution/negotiate")
def negotiate_distribution_path_c(
    payload: PathCNegotiationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Interactive AI negotiation wizard for Distribution Path C (Label / Catalogue Terms)."""
    user_id = str(current_user["_id"])
    track_count = payload.catalogue_track_count
    advance = payload.advance_requested
    creator_split = payload.proposed_creator_split
    round_no = payload.round_number

    # AI negotiation decision matrix
    # Floor: TuneMavens must retain at least 15% for massive catalogues (>=50), 20% for mid (>=20), 25% for small (<20)
    # If advance is requested, minimum TuneMavens split increases by 5%
    advance_surcharge = 5.0 if advance > 5000 else 0.0
    
    if track_count >= 50:
        acceptable_creator_max = 85.0 - advance_surcharge
        suggested_tm_split = max(15.0 + advance_surcharge, 100.0 - creator_split)
    elif track_count >= 20:
        acceptable_creator_max = 80.0 - advance_surcharge
        suggested_tm_split = max(20.0 + advance_surcharge, 100.0 - creator_split)
    else:
        acceptable_creator_max = 75.0 - advance_surcharge
        suggested_tm_split = max(25.0 + advance_surcharge, 100.0 - creator_split)

    suggested_creator_split = 100.0 - suggested_tm_split

    is_accepted = creator_split <= acceptable_creator_max or round_no >= 3

    if is_accepted:
        final_creator = min(creator_split, acceptable_creator_max) if round_no < 3 else creator_split
        final_tm = 100.0 - final_creator

        # Lock in DistributionDeal with Path C
        _supersede_active(db.distribution_deals, user_id)
        deal_doc = {
            "creator_id": user_id,
            "path": "label_negotiated",
            "fee_structure": "rev_share",
            "tunemavens_split_pct": final_tm,
            "creator_split_pct": final_creator,
            "label_name": payload.label_name,
            "roster_size": payload.roster_size,
            "territory": payload.territory,
            "term_years": payload.term_years,
            "advance_amount": advance,
            "dsp_priority": "Tier-1 Direct DSP Pitching",
            "negotiation_history": [
                {
                    "round": round_no,
                    "proposed_creator": creator_split,
                    "accepted_creator": final_creator,
                    "accepted_tm": final_tm,
                    "advance": advance,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            ],
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }
        res = db.distribution_deals.insert_one(deal_doc)
        deal_doc["_id"] = str(res.inserted_id)

        # If advance was granted, register in catalogue acquisitions
        if advance > 0:
            acq_doc = {
                "creator_id": user_id,
                "deal_type": "distribution_advance",
                "original_amount": advance,
                "recouped_to_date": 0.0,
                "remaining_balance": advance,
                "cross_collateralized": True,
                "artist_name": payload.label_name,
                "catalogue_title": f"{payload.label_name} Master Catalogue ({track_count} Tracks)",
                "track_count": track_count,
                "recoupment_rate_pct": 50.0,
                "status": "active",
                "passport_id": f"TM-ACQ-2026-{secrets.token_hex(2).upper()}",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            db.catalogue_acquisitions.insert_one(acq_doc)

        return {
            "ok": True,
            "status": "accepted",
            "message": f"Congratulations! Your Path C terms ({final_creator:.0f}% Label / {final_tm:.0f}% Platform) have been locked into the distribution ledger.",
            "final_creator_split": final_creator,
            "final_tunemavens_split": final_tm,
            "deal_id": deal_doc["_id"],
            "round_number": round_no,
            "deal": deal_doc
        }

    # Otherwise return counter-offer
    counter_tm = suggested_tm_split
    counter_creator = 100.0 - counter_tm

    rationale = (
        f"For a catalogue of {track_count} tracks with an advance request of ${advance:,.0f}, "
        f"TuneMavens infrastructure requires {counter_tm:.0f}% platform allocation for global Tier-1 DSP encoding and metadata ingest. "
        f"Counter-offer: {counter_creator:.0f}% to Label / {counter_tm:.0f}% to TuneMavens."
    )

    return {
        "ok": True,
        "status": "counter_offer",
        "message": rationale,
        "counter_creator_split": counter_creator,
        "counter_tunemavens_split": counter_tm,
        "round_number": round_no + 1,
        "max_acceptable_creator_split": acceptable_creator_max
    }


@router.post("/catalogue-acquisitions/{acquisition_id}/recoup")
def apply_catalogue_recoupment(
    acquisition_id: str,
    payload: RecoupmentApplyRequest,
    current_user: dict = Depends(get_current_user)
):
    """Applies royalty revenue against a catalogue advance, updating remaining unrecouped balance."""
    user_id = str(current_user["_id"])
    query_id = None
    try:
        query_id = ObjectId(acquisition_id)
    except Exception:
        query_id = acquisition_id

    acq = db.catalogue_acquisitions.find_one({"$or": [{"_id": query_id}, {"_id": acquisition_id}, {"passport_id": acquisition_id}]})
    if not acq:
        raise HTTPException(status_code=404, detail="Catalogue acquisition not found")

    amount = float(payload.amount)
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Recoupment amount must be positive")

    orig = acq.get("original_amount", 0.0)
    current_recouped = acq.get("recouped_to_date", 0.0)
    new_recouped = current_recouped + amount
    new_balance = max(0.0, orig - new_recouped)
    new_status = "recouped" if new_balance <= 0.001 else "active"

    update_fields = {
        "recouped_to_date": round(new_recouped, 2),
        "remaining_balance": round(new_balance, 2),
        "status": new_status,
        "updated_at": datetime.now(timezone.utc)
    }

    db.catalogue_acquisitions.update_one(
        {"_id": acq["_id"]},
        {"$set": update_fields}
    )

    acq.update(update_fields)
    acq["_id"] = str(acq["_id"])
    return {
        "ok": True,
        "message": f"Successfully applied ${amount:,.2f} recoupment from {payload.source}.",
        "acquisition": acq,
        "is_fully_recouped": new_status == "recouped"
    }
