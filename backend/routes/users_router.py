"""User self-service endpoints — App Marketplace activation, onboarding
questionnaire, activity log, and the AI Recommendation Agent (Phase 3).

Tracks which dashboard apps the signed-in user has activated (`users.apps[]`)
and hosts the machinery that powers the App Marketplace's "Recommended for
you" hero + Your-Path roadmap. See DOCUMENTATION.md §9.8.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import ActivityEvent, OnboardingResponse, Recommendation, UserPublic
from services.recommendation_engine import recommend

router = APIRouter(prefix="/api/users", tags=["users"])


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    brand_name: Optional[str] = None
    country: Optional[str] = None
    bio: Optional[str] = None
    artist_name: Optional[str] = None


ALLOWED_APP_SLUGS = {
    "catalog-porting",
    "split-cascade",
    "publishing-election",
    "distribution-election",
    "djpool",
    "dj-mixes",
    "corporate-ads",
    "sync-marketplace",
    "escrow-contracts",
    "tunemavens-library",
    "tunemavens-tips",
    "mpesa-pos-inventory",
    "mpesa-pos-settlement",
    "mpesa-pos-devices",
    "tunepay-inventory",
    "tunepay-settlement",
    "tunepay-devices",
    "epk-builder",
    "intermaven-tunemavens",
    "intermaven-creator-companion",
    "intermaven-mpesa-pos",
    "intermaven-tunepay",
    "intermaven-social-ai",
    "intermaven-brandkit-ai",
    "intermaven-smart-crm",
    "intermaven-pitch-deck-ai",
    "intermaven-pos-system",
    "intermaven-invoicing-payments",
    "intermaven-contracts",
}


class AppActivationRequest(BaseModel):
    slug: str


class AppSyncRequest(BaseModel):
    apps: List[str]


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


@router.put("/me/apps", response_model=List[str])
def sync_my_apps(payload: AppSyncRequest, current_user: dict = Depends(get_current_user)):
    valid_slugs = [s for s in payload.apps if s in ALLOWED_APP_SLUGS]
    db.users.update_one(
        {"_id": ObjectId(str(current_user["_id"]))},
        {"$addToSet": {"apps": {"$each": valid_slugs}}},
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


@router.get("/me/onboarding", response_model=Optional[OnboardingResponse])
def get_my_onboarding(current_user: dict = Depends(get_current_user)):
    doc = db.onboarding_responses.find_one({"user_id": str(current_user["_id"])})
    if not doc:
        return None
    doc.pop("_id", None)
    doc.pop("user_id", None)
    return OnboardingResponse(**doc)


@router.post("/me/onboarding", response_model=OnboardingResponse)
def save_my_onboarding(payload: OnboardingResponse, current_user: dict = Depends(get_current_user)):
    payload.updated_at = datetime.now(timezone.utc)
    data = payload.model_dump()
    data["user_id"] = str(current_user["_id"])
    db.onboarding_responses.update_one(
        {"user_id": str(current_user["_id"])},
        {"$set": data},
        upsert=True,
    )
    return payload


@router.post("/me/activity", response_model=dict)
def log_activity(event: ActivityEvent, current_user: dict = Depends(get_current_user)):
    data = event.model_dump()
    data["user_id"] = str(current_user["_id"])
    db.activity_events.insert_one(data)
    return {"ok": True}


def _activity_summary(user_id: str) -> dict:
    cursor = db.activity_events.find({"user_id": user_id}).sort("at", -1).limit(500)
    tab_visits: dict[str, int] = {}
    recent_deactivations: list[str] = []
    deals_created: list[str] = []
    for ev in cursor:
        kind = ev.get("kind")
        ref = ev.get("ref")
        if kind == "tab_visit" and ref:
            tab_visits[ref] = tab_visits.get(ref, 0) + 1
        elif kind == "app_deactivated" and ref:
            recent_deactivations.append(ref)
        elif kind == "deal_created" and ref:
            deals_created.append(ref)
    return {
        "tab_visits": tab_visits,
        "recent_deactivations": recent_deactivations[:10],
        "deals_created": deals_created[:20],
    }


@router.get("/me/recommendations", response_model=List[Recommendation])
async def get_my_recommendations(
    limit: int = 6,
    current_user: dict = Depends(get_current_user),
):
    onboarding_doc = db.onboarding_responses.find_one({"user_id": str(current_user["_id"])})
    onboarding: OnboardingResponse | None = None
    if onboarding_doc:
        onboarding_doc.pop("_id", None)
        onboarding_doc.pop("user_id", None)
        onboarding = OnboardingResponse(**onboarding_doc)

    return await recommend(
        role=current_user.get("role", "creator"),
        onboarding=onboarding,
        activity_summary=_activity_summary(str(current_user["_id"])),
        already_activated=current_user.get("apps", []) or [],
        limit=max(1, min(limit, 12)),
    )


@router.get("/me", response_model=UserPublic)
def get_my_profile(current_user: dict = Depends(get_current_user)):
    from routes.auth_router import _to_public
    return _to_public(current_user)


@router.put("/me", response_model=UserPublic)
def update_my_profile(
    payload: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    old_email = (current_user.get("email") or "").strip().lower()
    user_oid = ObjectId(str(current_user["_id"]))

    if updates:
        if "email" in updates and updates["email"]:
            clean_email = updates["email"].strip().lower()
            updates["email"] = clean_email
            if clean_email != old_email:
                existing = db.users.find_one({
                    "email": {"$regex": f"^{re.escape(clean_email)}$", "$options": "i"},
                    "_id": {"$ne": user_oid},
                })
                if existing:
                    raise HTTPException(status_code=409, detail="Email already registered to another account")

        if "name" in updates and updates["name"]:
            clean_name = updates["name"].strip()
            updates["name"] = clean_name
            parts = clean_name.split()
            updates["first_name"] = parts[0]
            updates["last_name"] = " ".join(parts[1:]) if len(parts) > 1 else ""

        if "brand_name" in updates and updates["brand_name"] is not None:
            updates["brand_name"] = updates["brand_name"].strip()
            updates["company"] = updates["brand_name"]

        updates["updated_at"] = datetime.now(timezone.utc)

        mongo_ops: dict = {"$set": updates}
        if "email" in updates and old_email and updates["email"] != old_email:
            mongo_ops["$addToSet"] = {"previous_emails": old_email}

        db.users.update_one({"_id": user_oid}, mongo_ops)

        try:
            aff_updates = {}
            if "name" in updates and updates["name"]:
                aff_updates["name"] = updates["name"]
            if "email" in updates and updates["email"]:
                aff_updates["email"] = updates["email"]
            if aff_updates:
                db.affiliates.update_many(
                    {"$or": [{"user_id": str(user_oid)}, {"email": old_email}]},
                    {"$set": aff_updates},
                )
        except Exception:
            pass

        updated = db.users.find_one({"_id": user_oid})
    else:
        updated = current_user

    from routes.auth_router import _to_public
    return _to_public(updated)
