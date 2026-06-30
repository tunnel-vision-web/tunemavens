"""Phase 3 endpoints for the three §9.7 deal collections.

Phase 3 wires the Creator Pipeline elections (publishing tier + distribution
path) end-to-end. Audit-trail semantics: every new election INSERTS a fresh
document and supersedes any prior active record for that creator, so we keep
the full history while still exposing a single "current" record. Cascade math
& contract generation remain in Phase 7 / Phase 8.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

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
    cursor = db.catalogue_acquisitions.find({"creator_id": str(current_user["_id"])})
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
    doc = payload.to_mongo()
    result = db.catalogue_acquisitions.insert_one(doc)
    doc["_id"] = result.inserted_id
    return CatalogueAcquisition.from_mongo(doc)
