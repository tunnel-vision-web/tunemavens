"""User self-service endpoints — App Marketplace activation (Phase 3).

Tracks which dashboard apps the signed-in user has activated. Single source
of truth is `users.apps[]` (already on the User model from Phase 1). The
onboarding stripe's "Activate a Dashboard App" step ticks off as soon as this
list is non-empty.
"""
from __future__ import annotations

from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from config import db

router = APIRouter(prefix="/api/users", tags=["users"])


# Curated allow-list of dashboard apps a creator can activate. Kept here so the
# backend is the authority on what's installable — the frontend uses the same
# slugs but pulls richer copy (icons, descriptions) from its own catalogue.
ALLOWED_APP_SLUGS = {
    "catalog-porting",
    "split-cascade",
    "publishing-election",
    "distribution-election",
    "djpool",
    "sync-marketplace",
    "escrow-contracts",
    "tunemavens-library",
    "tunemavens-tips",
    "mpesa-pos-inventory",
    "mpesa-pos-settlement",
    "mpesa-pos-devices",
}


class AppActivationRequest(BaseModel):
    slug: str


@router.get("/me/apps", response_model=List[str])
def list_my_apps(current_user: dict = Depends(get_current_user)):
    return current_user.get("apps", [])


@router.post("/me/apps", response_model=List[str])
def activate_app(payload: AppActivationRequest, current_user: dict = Depends(get_current_user)):
    if payload.slug not in ALLOWED_APP_SLUGS:
        raise HTTPException(status_code=422, detail=f"Unknown app slug: {payload.slug}")
    db.users.update_one(
        {"_id": ObjectId(str(current_user["_id"]))},
        {"$addToSet": {"apps": payload.slug}},
    )
    updated = db.users.find_one({"_id": ObjectId(str(current_user["_id"]))})
    return updated.get("apps", []) if updated else []


@router.delete("/me/apps/{slug}", response_model=List[str])
def deactivate_app(slug: str, current_user: dict = Depends(get_current_user)):
    db.users.update_one(
        {"_id": ObjectId(str(current_user["_id"]))},
        {"$pull": {"apps": slug}},
    )
    updated = db.users.find_one({"_id": ObjectId(str(current_user["_id"]))})
    return updated.get("apps", []) if updated else []
