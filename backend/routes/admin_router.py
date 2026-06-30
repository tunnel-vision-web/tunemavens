"""Admin-only routes.

Currently scoped to domain-mapping CRUD and a sandbox "become admin" helper
so the UI can be exercised without a separate role-provisioning flow.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, status

from auth import get_current_user, require_admin
from config import db
from models import DomainMapping, DomainMappingCreate, DomainMappingUpdate

router = APIRouter(prefix="/api/admin", tags=["admin"])


# Default seed — one row per public route the platform exposes today.
# Keys are stable; subdomains are the editable column from the admin UI.
DEFAULT_MAPPINGS = [
    # Native apps
    {"key": "native-app-tunemavens", "label": "TuneMavens (Listener App)", "category": "native-app", "path": "/native-apps/tunemavens", "subdomain": "app"},
    {"key": "native-app-creator-companion", "label": "Creator Companion", "category": "native-app", "path": "/native-apps/creator-companion", "subdomain": "companion"},
    {"key": "native-app-mpesa-pos", "label": "M-Pesa POS", "category": "native-app", "path": "/native-apps/mpesa-pos", "subdomain": "pos"},
    # Branded portal subdomains (per DEVELOPMENT_PLAN.md Phase 1)
    {"key": "portal-djs", "label": "DJ Pool Engine", "category": "subdomain-portal", "path": "/dashboard?role=dj", "subdomain": "djs"},
    {"key": "portal-labels", "label": "Record Label Console", "category": "subdomain-portal", "path": "/dashboard?role=label", "subdomain": "labels"},
    {"key": "portal-producers", "label": "Producer Pipeline", "category": "subdomain-portal", "path": "/dashboard?role=creator", "subdomain": "producers"},
    {"key": "portal-mediahouses", "label": "Media House Routing", "category": "subdomain-portal", "path": "/dashboard?role=media_house", "subdomain": "mediahouses"},
    # Dashboard apps (the in-product app marketplace surface)
    {"key": "dashboard-apps-index", "label": "Dashboard Apps Index", "category": "dashboard-app", "path": "/apps", "subdomain": "apps"},
    {"key": "dashboard-app-brand-kit", "label": "Brand Kit AI", "category": "dashboard-app", "path": "/apps#brand-kit", "subdomain": "brand"},
    {"key": "dashboard-app-sync-pitch", "label": "Sync Pitch AI", "category": "dashboard-app", "path": "/apps#sync-pitch", "subdomain": "sync"},
    {"key": "dashboard-app-pitch-deck", "label": "Pitch Deck AI", "category": "dashboard-app", "path": "/apps#pitch-deck", "subdomain": "deck"},
    {"key": "dashboard-app-epk-builder", "label": "EPK Builder", "category": "dashboard-app", "path": "/apps#epk", "subdomain": "epk"},
    # AI Tools index
    {"key": "tools-index", "label": "AI Tools Suite", "category": "ai-tool", "path": "/tools", "subdomain": "tools"},
    # Streaming
    {"key": "consumer-stream", "label": "Web Player (Consumer Stream)", "category": "ai-tool", "path": "/stream", "subdomain": "stream"},
]


def seed_domain_mappings_if_empty() -> None:
    """Idempotent seed — only writes if the collection is empty."""
    if db.domain_mappings.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc)
    docs = [
        {
            "key": m["key"],
            "label": m["label"],
            "category": m["category"],
            "path": m["path"],
            "subdomain": m["subdomain"],
            "enabled": True,
            "created_at": now,
            "updated_at": now,
            "updated_by": "system-seed",
        }
        for m in DEFAULT_MAPPINGS
    ]
    db.domain_mappings.insert_many(docs)


@router.get("/domain-mappings", response_model=List[DomainMapping])
def list_domain_mappings(_admin: dict = Depends(require_admin)):
    seed_domain_mappings_if_empty()
    cursor = db.domain_mappings.find().sort([("category", 1), ("label", 1)])
    return [DomainMapping.from_mongo(d) for d in cursor]


@router.post("/domain-mappings", response_model=DomainMapping, status_code=201)
def create_domain_mapping(payload: DomainMappingCreate, admin: dict = Depends(require_admin)):
    if db.domain_mappings.find_one({"key": payload.key}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="key already exists")
    now = datetime.now(timezone.utc)
    doc = {
        "key": payload.key,
        "label": payload.label,
        "category": payload.category,
        "path": payload.path,
        "subdomain": payload.subdomain,
        "enabled": payload.enabled,
        "created_at": now,
        "updated_at": now,
        "updated_by": admin.get("email"),
    }
    result = db.domain_mappings.insert_one(doc)
    doc["_id"] = result.inserted_id
    return DomainMapping.from_mongo(doc)


@router.put("/domain-mappings/{mapping_id}", response_model=DomainMapping)
def update_domain_mapping(
    mapping_id: str,
    payload: DomainMappingUpdate,
    admin: dict = Depends(require_admin),
):
    try:
        oid = ObjectId(mapping_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="invalid mapping_id") from exc
    update = {k: v for k, v in payload.model_dump(exclude_none=True).items()}
    if not update:
        raise HTTPException(status_code=422, detail="no updatable fields supplied")
    update["updated_at"] = datetime.now(timezone.utc)
    update["updated_by"] = admin.get("email")
    db.domain_mappings.update_one({"_id": oid}, {"$set": update})
    doc = db.domain_mappings.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="mapping not found")
    return DomainMapping.from_mongo(doc)


@router.delete("/domain-mappings/{mapping_id}")
def delete_domain_mapping(mapping_id: str, _admin: dict = Depends(require_admin)):
    try:
        oid = ObjectId(mapping_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="invalid mapping_id") from exc
    result = db.domain_mappings.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="mapping not found")
    return {"ok": True}


# ----------------------------------------------------------------------
# SANDBOX HELPER — flip current user to admin so the UI can be exercised.
# Remove or gate behind an env flag in production.
# ----------------------------------------------------------------------
@router.post("/become-admin")
def become_admin(current_user: dict = Depends(get_current_user)):
    db.users.update_one({"_id": ObjectId(str(current_user["_id"]))}, {"$set": {"role": "admin"}})
    return {"ok": True, "role": "admin"}
