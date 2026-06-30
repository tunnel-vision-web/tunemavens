"""Dashboard layout persistence (DOCUMENTATION.md §9.6).

Each user's dashboard panel arrangement is per-user, decoupled from
`users.apps[]` (which only tracks activation). Phase 1 wires the persistence
endpoint; the UI consumes it in a later phase.
"""
from __future__ import annotations

from bson import ObjectId
from fastapi import APIRouter, Depends

from auth import get_current_user
from config import db
from models import DashboardLayoutUpdate

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/layout")
def get_layout(current_user: dict = Depends(get_current_user)):
    return {"dashboard_layout": current_user.get("dashboard_layout") or {}}


@router.put("/layout")
def put_layout(payload: DashboardLayoutUpdate, current_user: dict = Depends(get_current_user)):
    db.users.update_one(
        {"_id": ObjectId(str(current_user["_id"]))},
        {"$set": {"dashboard_layout": payload.dashboard_layout}},
    )
    return {"ok": True, "dashboard_layout": payload.dashboard_layout}
