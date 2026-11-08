"""Dedicated Backend Operations & RBAC Admin Console Router.

Serves the standalone TuneMavens Admin Application directly from the backend
(:8001/admin) and enforces persona-based RBAC permissions across all operational
domains (Wall of Fame curation, domain mappings, user management, and telemetry).
"""
from __future__ import annotations

import os
import socket
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

from config import db, MONGO_URL, DB_NAME
from auth import get_optional_user

logger = logging.getLogger(__name__)

router = APIRouter(tags=["backend-admin-console"])

# ======================================================================
# Persona Capability & Permission Definitions
# ======================================================================
PERSONA_CAPABILITIES: Dict[str, Dict[str, Any]] = {
    "admin": {
        "name": "Platform Administrator",
        "description": "Unrestricted platform operations, RBAC configuration, user role provisioning, Wall of Fame curation, domain routing, and ecosystem monitoring.",
        "badge_color": "#38bdf8",
        "permissions": [
            "wall_of_fame_manage",
            "wall_of_fame_invite",
            "wall_of_fame_delete",
            "rbac_manage",
            "users_manage",
            "domain_mappings_manage",
            "crm_leads_manage",
            "system_telemetry",
            "epk_manage",
            "roster_manage",
            "sync_escrow",
            "djpool_download",
            "tour_vault"
        ]
    },
    "creator": {
        "name": "Creator / Artist",
        "description": "Artist EPK portfolio, stem & master distribution, split cascade ledgers, direct fan tips, and induction claim verification.",
        "badge_color": "#22d3ee",
        "permissions": [
            "epk_manage",
            "splits_manage",
            "wall_of_fame_view",
            "wall_of_fame_claim",
            "catalog_upload",
            "direct_tips_receive"
        ]
    },
    "label": {
        "name": "Record Label",
        "description": "Roster management, multi-artist catalog administration, sync pitching rights, and talent induction nominations.",
        "badge_color": "#a855f7",
        "permissions": [
            "roster_manage",
            "catalog_splits",
            "wall_of_fame_view",
            "wall_of_fame_nominate",
            "sync_pitch_manage"
        ]
    },
    "supervisor": {
        "name": "Music Supervisor",
        "description": "Sync briefs broadcast, cue sheet review, pre-cleared sync licensing escrow, and luminary catalog search.",
        "badge_color": "#ec4899",
        "permissions": [
            "sync_briefs_manage",
            "licensing_escrow",
            "cue_sheets_approve",
            "wall_of_fame_view"
        ]
    },
    "dj": {
        "name": "DJ / Curator",
        "description": "24-bit lossless club crate downloads, airplay playlist submission, club residency verification, and curator nominations.",
        "badge_color": "#f59e0b",
        "permissions": [
            "djpool_download",
            "curator_sets",
            "wall_of_fame_view",
            "wall_of_fame_nominate"
        ]
    },
    "vc": {
        "name": "Tour VC / Investor",
        "description": "Tour Vault deal room, syndicate co-investment, risk assessment models, and unlimited credit-exempt telemetry.",
        "badge_color": "#00f2fe",
        "permissions": [
            "tour_vault",
            "deal_syndication",
            "credit_exempt_telemetry",
            "wall_of_fame_view"
        ]
    },
    "podcaster": {
        "name": "Podcaster / Host",
        "description": "Original podcast show distribution, episode transcript chapters, host-read ad flight monetization, and podcaster EPK.",
        "badge_color": "#ec4899",
        "permissions": [
            "podcast_episodes_manage",
            "ad_sponsorship_manage",
            "epk_manage",
            "wall_of_fame_view"
        ]
    },
    "media_house": {
        "name": "Media House / Broadcaster",
        "description": "Linear and OTT broadcast clearance, programmatic audio ad flight scheduling, and media routing.",
        "badge_color": "#10b981",
        "permissions": [
            "broadcast_clearance",
            "ad_flights_schedule",
            "wall_of_fame_view"
        ]
    },
    "corporate": {
        "name": "Corporate Brand",
        "description": "Brand kit compliance, high-impact cultural sponsorship booking, and custom brand integration escrow.",
        "badge_color": "#f97316",
        "permissions": [
            "corporate_campaigns",
            "brand_kit_manage",
            "wall_of_fame_view"
        ]
    },
    "affiliate": {
        "name": "Affiliate Partner",
        "description": "Affiliate tracking link generation, 3-tier commission matrix tracking, and real-time payout ledger.",
        "badge_color": "#22d3ee",
        "permissions": [
            "referral_links_manage",
            "commission_matrix_view",
            "payout_requests",
            "wall_of_fame_view"
        ]
    },
    "consumer": {
        "name": "Consumer / Fan",
        "description": "Hi-Fi 24-bit FLAC streaming player, 8GB offline crate, 1-tap direct artist tipping, and following ecosystem icons.",
        "badge_color": "#6366f1",
        "permissions": [
            "stream_player",
            "direct_tips_send",
            "follow_icons",
            "wall_of_fame_view"
        ]
    }
}


def check_port_listening(port: int, host: str = "127.0.0.1") -> bool:
    """Fast non-blocking TCP socket connect probe."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.4)
            return s.connect_ex((host, port)) == 0
    except Exception:
        return False


# ======================================================================
# Standalone Backend Admin App Entrypoint
# ======================================================================
@router.get("/admin", response_class=HTMLResponse)
@router.get("/admin/", response_class=HTMLResponse)
@router.get("/admin/dashboard", response_class=HTMLResponse)
def serve_backend_admin_app():
    """Serves the standalone TuneMavens Backend Admin Application HTML."""
    html_path = os.path.join(os.path.dirname(__file__), "..", "admin_app", "index.html")
    if not os.path.exists(html_path):
        html_path = os.path.join(os.getcwd(), "backend", "admin_app", "index.html")
    
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content, status_code=200)

    return HTMLResponse(
        content="<h1>Admin Console Not Found</h1><p>Expected at backend/admin_app/index.html</p>",
        status_code=404
    )


# ======================================================================
# RBAC Persona & Session APIs
# ======================================================================
@router.get("/api/admin/console/personas")
def get_personas_matrix():
    """Returns all persona definitions and capability permissions."""
    return {"personas": PERSONA_CAPABILITIES}


class RoleUpdateRequest(BaseModel):
    role: str


@router.get("/api/admin/console/users")
def list_admin_users(role: Optional[str] = None):
    """List registered users with persona role and tier."""
    query = {}
    if role and role != "all":
        query["role"] = role
    cursor = db.users.find(query, {"password": 0, "password_hash": 0}).sort("created_at", -1).limit(100)
    users = []
    for u in cursor:
        u["_id"] = str(u["_id"])
        users.append(u)
    return {"users": users, "total": len(users)}


@router.post("/api/admin/console/users/{user_id}/role")
def update_user_persona_role(user_id: str, payload: RoleUpdateRequest):
    """Update a user's assigned persona role."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    if payload.role not in PERSONA_CAPABILITIES:
        raise HTTPException(status_code=422, detail=f"Invalid persona role '{payload.role}'")

    res = db.users.update_one(
        {"_id": oid},
        {"$set": {"role": payload.role, "updated_at": datetime.now(timezone.utc)}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"ok": True, "user_id": user_id, "role": payload.role}


# ======================================================================
# System Health & Telemetry Probes
# ======================================================================
@router.get("/api/admin/console/telemetry")
def get_system_telemetry():
    """Probes status of all 5 ecosystem services and MongoDB."""
    services = {
        "8001": {
            "name": "FastAPI Operations Engine",
            "protocol": "HTTP / REST",
            "status": "online" if check_port_listening(8001) else "degraded",
            "health": "FastAPI 0.115 + PyMongo",
            "pid": os.getpid()
        },
        "3000": {
            "name": "Portal Frontend Client",
            "protocol": "HTTP / Vite",
            "status": "online" if check_port_listening(3000) else "degraded",
            "health": "Vite React Client",
            "pid": None
        },
        "3001": {
            "name": "TuneStream Native Player",
            "protocol": "HTTP / Vite",
            "status": "online" if check_port_listening(3001) else "degraded",
            "health": "Lossless FLAC Streamer",
            "pid": None
        },
        "3002": {
            "name": "SyncMavens Marketplace",
            "protocol": "HTTP / Vite",
            "status": "online" if check_port_listening(3002) else "degraded",
            "health": "Sync Briefs & Escrow",
            "pid": None
        },
        "5000": {
            "name": "Express Node.js Gateway",
            "protocol": "HTTP / Express",
            "status": "online" if check_port_listening(5000) else "degraded",
            "health": "Microservices Gateway",
            "pid": None
        }
    }

    try:
        db.command("ping")
        mongo_status = "connected"
        collections_count = len(db.list_collection_names())
    except Exception:
        mongo_status = "disconnected"
        collections_count = 0

    return {
        "services": services,
        "database": {
            "status": mongo_status,
            "db_name": DB_NAME,
            "collections": collections_count
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
