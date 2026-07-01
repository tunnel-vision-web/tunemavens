"""User self-service endpoints — App Marketplace activation, onboarding
questionnaire, activity log, and the AI Recommendation Agent (Phase 3).

Tracks which dashboard apps the signed-in user has activated (`users.apps[]`)
and hosts the machinery that powers the App Marketplace's "Recommended for
you" hero + Your-Path roadmap. See DOCUMENTATION.md §9.8.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import ActivityEvent, OnboardingResponse, Recommendation
from services.recommendation_engine import recommend

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
    # Intermaven Network — the 3 flagship native apps. Slugs mirror
    # src/lib/nativeApps.js so the dashboard's "Native Apps" tab in the
    # App Marketplace persists activations cleanly.
    "intermaven-tunemavens",
    "intermaven-creator-companion",
    "intermaven-mpesa-pos",
    # Intermaven Platform — tools from intermaven.io. Slugs mirror
    # src/lib/intermavenPlatformApps.js. "Open" routes to the canonical
    # app on intermaven.io; the shared Intermaven JWT cookie carries the
    # session across the subdomain boundary.
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


# ======================================================================
# §9.8 — Onboarding questionnaire (persists user's stated goals)
# ======================================================================
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


# ======================================================================
# §9.8 — Activity log (light behaviour signal capture)
# ======================================================================
@router.post("/me/activity", response_model=dict)
def log_activity(event: ActivityEvent, current_user: dict = Depends(get_current_user)):
    """Append-only log. Kept intentionally minimal — the recommendation
    engine consumes an aggregated summary, not raw events."""
    data = event.model_dump()
    data["user_id"] = str(current_user["_id"])
    db.activity_events.insert_one(data)
    return {"ok": True}


def _activity_summary(user_id: str) -> dict:
    """Reduce the raw activity_events collection into the compact shape the
    recommendation engine expects."""
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


# ======================================================================
# §9.8 — Recommendations (LLM-first with rules fallback)
# ======================================================================
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

