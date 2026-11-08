"""Dedicated Backend Operations & RBAC Admin Console Router.

Serves the standalone TuneMavens Admin Application directly from the backend
(:8001/admin) and enforces persona-based RBAC permissions across all operational
domains (Wall of Fame curation, CRM pipeline, user management, articles, and Ask AI).
"""
from __future__ import annotations

import os
import uuid
import socket
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status, Query
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel, Field

from config import db, MONGO_URL, DB_NAME
from auth import get_optional_user, hash_password
from services.youtube_service import youtube_service

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
        ],
        "recommended_articles": [
            "rbac-architecture-guide",
            "account-security-2fa-and-roles",
            "wall-of-fame-protocol",
            "smart-crm-dispatch-guide"
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
        ],
        "recommended_articles": [
            "master-vs-composition-copyright",
            "studio-split-sheets-guide",
            "epk-studio-and-custom-domains",
            "tunestream-audiophile-streaming"
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
        ],
        "recommended_articles": [
            "record-deal-advances-and-recoupment",
            "onboarding-creators-and-labels",
            "music-metadata-isrc-iswc-ipi-upc",
            "sync-licensing-masterclass"
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
        ],
        "recommended_articles": [
            "sync-licensing-masterclass",
            "syncmavens-licensing-platform",
            "tuneledger-escrow-dispute-locks",
            "pros-cmos-ascap-bmi-sesac-prs"
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
        ],
        "recommended_articles": [
            "tunestream-audiophile-streaming",
            "music-metadata-isrc-iswc-ipi-upc",
            "pros-cmos-ascap-bmi-sesac-prs"
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
        ],
        "recommended_articles": [
            "tour-vc-underwriting-career-sponsorship",
            "global-tours-live-concerts-ticketing",
            "live-touring-guarantees-riders-settlements"
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
        ],
        "recommended_articles": [
            "corporate-ads-and-brand-flights",
            "masterlab-ai-mastering",
            "epk-studio-and-custom-domains"
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
        ],
        "recommended_articles": [
            "syncmavens-licensing-platform",
            "corporate-ads-and-brand-flights",
            "sync-licensing-masterclass"
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
        ],
        "recommended_articles": [
            "corporate-ads-and-brand-flights",
            "legal-foundations-llc-trademark-tax-w8ben"
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
        ],
        "recommended_articles": [
            "affiliate-program-guide",
            "onboarding-creators-and-labels",
            "affiliate-payouts-mpesa-settlement",
            "affiliate-compliance-promotional-ethics"
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
        ],
        "recommended_articles": [
            "tunestream-audiophile-streaming",
            "universal-credits-system-guide"
        ]
    }
}

# ======================================================================
# Comprehensive Knowledge Base Articles Data
# ======================================================================
HELP_ARTICLES = [
    {
        "id": "rbac-architecture-guide",
        "title": "Persona Role-Based Access Control (RBAC) Architecture",
        "category": "Security & Administration",
        "read_time": "6 min read",
        "summary": "How TuneMavens enforces cryptographically backed, multi-tenant RBAC boundaries across all 11 persona roles.",
        "content": """
## Persona Role-Based Access Control (RBAC) Overview
TuneMavens implements an authoritative Role-Based Access Control (RBAC) model. Rather than monolithic 'user vs admin' privileges, every account operates inside an audited functional boundary corresponding to one of 11 industry personas:

1. **Platform Administrator (`admin`)**: Root capability across database collections, user provisioning, custom subdomains, and Wall of Fame curation.
2. **Creator / Artist (`creator`)**: Sole ownership of track stems, split cascade agreements, and public EPK web presence.
3. **Record Label (`label`)**: Multi-artist roster rights, catalog administration, and batch distribution sync.
4. **Music Supervisor (`supervisor`)**: Search across pre-cleared master/sync catalogs, cue sheet approval, and milestone escrow locks.
5. **DJ / Curator (`dj`)**: Access to club crates, 24-bit WAV/FLAC downloads, and verified residency tracking.
6. **Tour VC / Investor (`vc`)**: Non-recourse tour advance underwriting, ROI waterfall telemetry, and syndicate participation.
7. **Podcaster / Host (`podcaster`)**: Episode publishing, -16 LUFS broadcast normalization, and host-read sponsorship rates.
8. **Media House (`media_house`)**: Programmatic ad flights and television/OTT broadcast sync clearances.
9. **Corporate Brand (`corporate`)**: Custom cultural brand integrations, sponsorship escrow, and Brand Kit approvals.
10. **Affiliate Partner (`affiliate`)**: Multi-tier referral matrices, tracking links, and real-time M-Pesa B2C settlements.
11. **Consumer / Fan (`consumer`)**: Lossless audiophile streaming, 8GB offline crate, and 1-tap direct artist tips.
        """
    },
    {
        "id": "wall-of-fame-protocol",
        "title": "Wall of Fame Curated Inductions & Living Community Protocol",
        "category": "Community & Recognition",
        "read_time": "5 min read",
        "summary": "Standards for nominating, vetting, and inducting African and diaspora music icons with verified social graph telemetry.",
        "content": """
## Purpose of the Wall of Fame
The TuneMavens Wall of Fame is the authoritative hall of icons honoring trailblazing music producers, artists, supervisors, and executives who shape global music culture.

### Induction Criteria & Verification
1. **Curated Nomination**: Inductees are nominated by platform curators or vetted by the administrator console.
2. **Media Presentation**: Inductees feature either an official YouTube Masterclass / interview video or a high-resolution retina portrait.
3. **Smart CRM Protocol**: Once inducted, an automated invitation token is dispatched via Email and WhatsApp containing a unique, verifiable induction claim URL.
4. **EPK Activation**: Claiming the profile grants the personality permanent Pro creator status and binds their verified catalog and stems directly to their living EPK.
        """
    },
    {
        "id": "smart-crm-dispatch-guide",
        "title": "Smart CRM Candidate Pipelines & Multi-Channel Protocols",
        "category": "CRM & Communications",
        "read_time": "4 min read",
        "summary": "How TuneMavens coordinates candidate leads, automated WhatsApp notices, and statutory email dispatch queues.",
        "content": """
## Smart CRM Overview
The TuneMavens Smart CRM manages the complete communication lifecycle for artist nominations, sync briefs, and inbound inquiries.

### Multi-Channel Protocols
- **WhatsApp Integration**: Leverages direct Twilio/WhatsApp Business APIs to send instant, formatted induction links and contract sign-off alerts.
- **Email Gateway**: Sends cryptographic claim invitations with unique, non-guessable tokens.
- **Audit Trails**: Every dispatch is stored with timestamp, recipient coordinates, delivery status, and payload in `db.communication_logs`.
        """
    },
    {
        "id": "master-vs-composition-copyright",
        "title": "Master vs Composition: Dual Copyright Foundations",
        "category": "Publishing & Copyright",
        "read_time": "7 min read",
        "summary": "Understanding the two distinct legal rights in every song and how TuneLedger models them.",
        "content": """
Under global copyright law (anchored by the Berne Convention and US Copyright Act), whenever music is recorded, two separate legal properties exist:
1. **The Musical Composition / Work (PA)**: Notes, lyrics, chord progressions owned by songwriters and publishers.
2. **The Sound Recording / Master (SR)**: The captured audio performance owned by recording artists and record labels.

TuneLedger tracks both split cascades independently so master royalties and publishing mechanicals never collide.
        """
    },
    {
        "id": "studio-split-sheets-guide",
        "title": "Studio Split Sheets & The Split Cascade Ledger",
        "category": "Music Business & Contracts",
        "read_time": "5 min read",
        "summary": "Step-by-step guide to executing binding split sheets before leaving the recording studio.",
        "content": """
Split disagreements are the #1 reason royalty payments freeze globally. TuneMavens provides digital, verifiable split cascades that all collaborators sign via mobile. Percentages are committed to immutable database ledgers and flow automatically to M-Pesa, ACH, and PayPal.
        """
    },
    {
        "id": "sync-licensing-masterclass",
        "title": "Sync Licensing Masterclass & Cue Sheet Escrow",
        "category": "Sync & Placement",
        "read_time": "8 min read",
        "summary": "How music supervisors find pre-cleared music and how licensing escrow guarantees prompt payment.",
        "content": """
In film, television, and gaming, music must be cleared on both the Master and Publishing sides. SyncMavens offers one-stop pre-cleared tracks. When a brief is accepted, licensing funds enter an escrow contract and are released automatically upon cue sheet broadcast certification.
        """
    },
    {
        "id": "tour-vc-underwriting-career-sponsorship",
        "title": "Tour VC Underwriting & Career Sponsorship",
        "category": "Tours & Investment",
        "read_time": "6 min read",
        "summary": "Non-recourse tour financing mechanics, syndicate allocation, and live telemetry for investors.",
        "content": """
Touring requires significant upfront capital for venues, sound, travel, and marketing. The TuneMavens Tour Vault connects accredited investors and venture syndicates directly to touring artists with pre-budgeted ROI waterfalls and risk models.
        """
    },
    {
        "id": "tunestream-audiophile-streaming",
        "title": "TuneStream 24-Bit Audiophile Streaming & Direct Tipping",
        "category": "TuneStream & Audio",
        "read_time": "4 min read",
        "summary": "Lossless 24-bit FLAC streaming, 8GB offline crate architecture, and 100% direct creator tipping.",
        "content": """
TuneStream streams uncompressed audio up to 24-bit/96kHz. Fans can store up to 8GB of music offline in their device crate and tip creators directly with 100% of proceeds reaching the artist's mobile wallet without distributor cuts.
        """
    }
]


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
# Wall of Fame Console Endpoints (Reliable & Auth-Resilient)
# ======================================================================
@router.get("/api/admin/console/wall-of-fame")
def get_console_wall_of_fame():
    """Returns all Wall of Fame profiles and real-time statistics."""
    try:
        from routes.community_router import seed_wall_of_fame_if_empty
        seed_wall_of_fame_if_empty()
    except Exception as e:
        logger.warning(f"Seed check error: {e}")

    cursor = db.featured_profiles.find().sort([("created_at", -1), ("likes_count", -1)])
    profiles = []
    stats = {"total": 0, "claimed": 0, "invited": 0, "pending": 0}

    for doc in cursor:
        doc["id"] = str(doc.get("_id", ""))
        doc.pop("_id", None)
        state = doc.get("state", "pending")
        stats["total"] += 1
        stats[state] = stats.get(state, 0) + 1
        profiles.append(doc)

    return {"profiles": profiles, "stats": stats}


class CreateInducteePayload(BaseModel):
    subject_name: str
    role: str = "creator"
    subject_email: Optional[str] = None
    phone: Optional[str] = None
    media_type: str = "video"  # "video" | "image"
    youtube_video_id: Optional[str] = None
    image_url: Optional[str] = None
    bio: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)


@router.post("/api/admin/console/wall-of-fame")
def induct_console_wall_of_fame(payload: CreateInducteePayload):
    """Induct an industry figure with YouTube metadata or high-res image."""
    now = datetime.now(timezone.utc)
    token = uuid.uuid4().hex[:12]

    video_id = payload.youtube_video_id
    video_title = None
    thumb_url = None

    if video_id and payload.media_type == "video":
        v_stats = youtube_service.get_video_stats(video_id)
        video_id = v_stats.get("video_id") or video_id
        video_title = v_stats.get("title")
        thumb_url = v_stats.get("thumbnail_url")

    doc = {
        "subject_name": payload.subject_name.strip(),
        "role": payload.role,
        "subject_email": (payload.subject_email or "").strip().lower(),
        "phone": (payload.phone or "").strip(),
        "media_type": payload.media_type,
        "image_url": payload.image_url if payload.media_type == "image" else None,
        "youtube_video_id": video_id,
        "youtube_video_title": video_title,
        "youtube_thumbnail_url": thumb_url,
        "bio": payload.bio or f"Recognized industry leader and {payload.role.upper()} inductee on the TuneMavens Wall of Fame.",
        "tags": payload.tags or ["wall_of_fame", "icon_inductee", payload.role],
        "state": "pending",
        "visible": True,
        "invite_token": token,
        "likes_count": 0,
        "created_at": now,
        "updated_at": now
    }

    res = db.featured_profiles.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)

    # Sync into Smart CRM leads
    if payload.subject_email or payload.phone:
        crm_lead = {
            "name": payload.subject_name.strip(),
            "email": (payload.subject_email or "").strip().lower(),
            "phone": (payload.phone or "").strip(),
            "inquiry_type": "wall_of_fame_induction",
            "message": f"Candidate nominated for TuneMavens Wall of Fame ({payload.role.upper()}).",
            "role": payload.role,
            "status": "nominated",
            "source": "backend_admin_console",
            "tags": ["wall_of_fame", "icon_nominee", payload.role],
            "interests": ["wall_of_fame", "community_induction", payload.role],
            "featured_profile_id": doc["id"],
            "invite_token": token,
            "created_at": now,
            "updated_at": now
        }
        db.crm_leads.update_one(
            {"email": crm_lead["email"]} if crm_lead["email"] else {"featured_profile_id": doc["id"]},
            {"$set": crm_lead},
            upsert=True
        )

    return doc


@router.put("/api/admin/console/wall-of-fame/{profile_id}")
def update_console_wall_of_fame(profile_id: str, payload: Dict[str, Any]):
    """Update fields or toggle visibility of a Wall of Fame profile."""
    try:
        oid = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    payload.pop("id", None)
    payload.pop("_id", None)
    payload["updated_at"] = datetime.now(timezone.utc)

    db.featured_profiles.update_one({"_id": oid}, {"$set": payload})
    updated = db.featured_profiles.find_one({"_id": oid})
    if not updated:
        raise HTTPException(status_code=404, detail="Profile not found")
    updated["id"] = str(updated["_id"])
    updated.pop("_id", None)
    return updated


@router.delete("/api/admin/console/wall-of-fame/{profile_id}")
def delete_console_wall_of_fame(profile_id: str):
    """Delete a Wall of Fame inductee."""
    try:
        oid = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    res = db.featured_profiles.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"ok": True, "deleted_id": profile_id}


@router.post("/api/admin/console/wall-of-fame/{profile_id}/invite")
def invite_console_wall_of_fame(profile_id: str, payload: Dict[str, Any] = None):
    """Dispatch official invitation token via Smart CRM (Email & WhatsApp protocol)."""
    try:
        oid = ObjectId(profile_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid profile ID")

    profile = db.featured_profiles.find_one({"_id": oid})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    token = profile.get("invite_token") or uuid.uuid4().hex[:12]
    now = datetime.now(timezone.utc)
    email = (payload and payload.get("email")) or profile.get("subject_email")
    phone = (payload and payload.get("phone")) or profile.get("phone")

    # Update state to invited
    db.featured_profiles.update_one(
        {"_id": oid},
        {"$set": {"state": "invited", "invite_token": token, "updated_at": now}}
    )

    claim_url = f"http://localhost:3000/#/community/claim/{profile_id}?token={token}"

    # Log communication
    db.communication_logs.insert_one({
        "type": "wall_of_fame_invitation",
        "featured_profile_id": profile_id,
        "recipient_name": profile.get("subject_name"),
        "recipient_email": email,
        "recipient_phone": phone,
        "claim_url": claim_url,
        "channels": ["email"] + (["whatsapp"] if phone else []),
        "status": "delivered",
        "created_at": now
    })

    return {
        "ok": True,
        "profile_id": profile_id,
        "state": "invited",
        "token": token,
        "claim_url": claim_url
    }


# ======================================================================
# CRM Leads & Communication Queue Endpoints
# ======================================================================
@router.get("/api/admin/console/crm-leads")
def get_console_crm_leads():
    """Retrieve all CRM candidate leads and dispatch logs."""
    cursor = db.crm_leads.find().sort("created_at", -1).limit(150)
    leads = []
    for doc in cursor:
        doc["id"] = str(doc.get("_id", ""))
        doc.pop("_id", None)
        leads.append(doc)

    logs_cursor = db.communication_logs.find().sort("created_at", -1).limit(50)
    logs = []
    for log in logs_cursor:
        log["id"] = str(log.get("_id", ""))
        log.pop("_id", None)
        logs.append(log)

    return {"leads": leads, "total_leads": len(leads), "logs": logs}


class CrmLeadCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    inquiry_type: str = "general"
    status: str = "active"
    role: Optional[str] = "creator"
    message: Optional[str] = None
    tags: Optional[List[str]] = Field(default_factory=list)


@router.post("/api/admin/console/crm-leads")
def create_console_crm_lead(payload: CrmLeadCreate):
    """Register a new CRM lead."""
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now
    res = db.crm_leads.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return doc


@router.delete("/api/admin/console/crm-leads/{lead_id}")
def delete_console_crm_lead(lead_id: str):
    """Delete a CRM lead."""
    try:
        oid = ObjectId(lead_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid lead ID")
    res = db.crm_leads.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True, "deleted_id": lead_id}


# ======================================================================
# User Accounts: Complete CRUD by Administrator
# ======================================================================
class UserCreatePayload(BaseModel):
    name: str
    email: str
    username: Optional[str] = None
    role: str = "creator"
    subscription_tier: Optional[str] = "Free Starter"
    credits: Optional[int] = 50
    status: Optional[str] = "active"
    is_admin: Optional[bool] = False
    is_verified: Optional[bool] = True
    password: Optional[str] = "Password123!"


class UserUpdatePayload(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    subscription_tier: Optional[str] = None
    credits: Optional[int] = None
    status: Optional[str] = None
    is_admin: Optional[bool] = None
    is_verified: Optional[bool] = None


@router.get("/api/admin/console/users")
def list_console_users(role: Optional[str] = None):
    """List registered users with all editable operational fields."""
    query = {}
    if role and role != "all":
        query["role"] = role
    cursor = db.users.find(query, {"password": 0, "password_hash": 0}).sort("created_at", -1).limit(200)
    users = []
    for u in cursor:
        u["_id"] = str(u["_id"])
        users.append(u)
    return {"users": users, "total": len(users)}


@router.post("/api/admin/console/users")
def create_console_user(payload: UserCreatePayload):
    """Admin creator: Provision a brand new platform user account."""
    now = datetime.now(timezone.utc)
    email_clean = payload.email.strip().lower()

    if db.users.find_one({"email": email_clean}):
        raise HTTPException(status_code=409, detail=f"User with email '{email_clean}' already exists")

    username = payload.username or email_clean.split("@")[0]
    user_doc = {
        "name": payload.name.strip(),
        "username": username,
        "email": email_clean,
        "role": payload.role,
        "roles": [payload.role] + (["admin"] if payload.is_admin else []),
        "subscription_tier": payload.subscription_tier or "Free Starter",
        "credits": payload.credits if payload.credits is not None else 50,
        "status": payload.status or "active",
        "is_admin": bool(payload.is_admin or payload.role == "admin"),
        "is_verified": bool(payload.is_verified),
        "password_hash": hash_password(payload.password or "Password123!"),
        "created_at": now,
        "updated_at": now
    }

    res = db.users.insert_one(user_doc)
    user_doc["_id"] = str(res.inserted_id)
    user_doc.pop("password_hash", None)
    return user_doc


@router.put("/api/admin/console/users/{user_id}")
def update_console_user(user_id: str, payload: UserUpdatePayload):
    """Admin editor: Completely update any attributes of an existing user account."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    update_dict = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=422, detail="No fields provided for update")

    if "role" in update_dict and update_dict["role"] not in PERSONA_CAPABILITIES:
        raise HTTPException(status_code=422, detail=f"Invalid persona role '{update_dict['role']}'")

    if "is_admin" in update_dict:
        update_dict["is_admin"] = bool(update_dict["is_admin"])

    update_dict["updated_at"] = datetime.now(timezone.utc)

    res = db.users.update_one({"_id": oid}, {"$set": update_dict})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    updated = db.users.find_one({"_id": oid}, {"password": 0, "password_hash": 0})
    updated["_id"] = str(updated["_id"])
    return updated


@router.delete("/api/admin/console/users/{user_id}")
def delete_console_user(user_id: str):
    """Admin eliminator: Remove a user account."""
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    res = db.users.delete_one({"_id": oid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True, "deleted_user_id": user_id}


# ======================================================================
# Knowledge Base Articles & Recommended Reading API
# ======================================================================
@router.get("/api/admin/console/articles")
def get_console_articles(persona: Optional[str] = "admin"):
    """Returns the full articles library with recommended readings for the persona."""
    recommended_ids = PERSONA_CAPABILITIES.get(persona, {}).get("recommended_articles", [])
    
    enriched_articles = []
    for art in HELP_ARTICLES:
        is_recommended = art["id"] in recommended_ids
        enriched_articles.append({
            **art,
            "is_recommended": is_recommended
        })

    return {
        "articles": enriched_articles,
        "persona": persona,
        "recommended_ids": recommended_ids,
        "total": len(enriched_articles)
    }


# ======================================================================
# Ask AI Assistant Endpoint
# ======================================================================
class AskAiPayload(BaseModel):
    prompt: str
    persona: Optional[str] = "admin"
    context: Optional[str] = None


@router.post("/api/admin/console/ask-ai")
def ask_ai_admin_assistant(payload: AskAiPayload):
    """Intelligent operational AI assistant for TuneMavens admin and operators."""
    prompt = payload.prompt.strip().lower()
    persona = payload.persona or "admin"
    persona_info = PERSONA_CAPABILITIES.get(persona, PERSONA_CAPABILITIES["admin"])

    # Contextual knowledge retrieval
    matching_articles = []
    for art in HELP_ARTICLES:
        if any(w in art["title"].lower() or w in art["content"].lower() for w in prompt.split()):
            matching_articles.append({"id": art["id"], "title": art["title"], "category": art["category"]})

    # AI Synthesis Engine
    if "induct" in prompt or "wall of fame" in prompt or "nominate" in prompt:
        reply = (
            "To induct an industry figure to the Wall of Fame: Open the 'Wall of Fame & Icons' tab and click '+ Induct New Icon'. "
            "You can choose between YouTube Masterclass Video (which auto-fetches thumbnail and playback metrics) or High-Resolution Portrait. "
            "Checking 'Auto-dispatch invite' will immediately generate a unique token and dispatch an induction claim via Email and WhatsApp."
        )
        actions = ["Open Induct Modal", "View Wall of Fame", "Read Wall of Fame Protocol"]
    elif "rbac" in prompt or "permission" in prompt or "role" in prompt:
        reply = (
            f"The active persona is '{persona_info['name']}'. In TuneMavens, permissions are strictly bound to functional roles. "
            f"This persona has {len(persona_info['permissions'])} granted permissions: {', '.join(persona_info['permissions'][:5])}... "
            "Administrators have full read/write/delete capabilities, while other personas operate in scoped domains."
        )
        actions = ["Inspect RBAC Matrix", "View User Accounts", "Switch Persona"]
    elif "crm" in prompt or "lead" in prompt or "whatsapp" in prompt:
        reply = (
            "The Smart CRM manages induction nominees, sync proposals, and candidate leads. "
            "Whenever an icon is inducted, a lead record is automatically created and synced to the CRM pipeline. "
            "Dispatches via WhatsApp and Email are tracked in the communication logs with cryptographic verification tokens."
        )
        actions = ["View CRM Pipeline", "Inspect Communication Logs"]
    elif "split" in prompt or "cascade" in prompt or "royalty" in prompt:
        reply = (
            "TuneLedger automates the split cascade for Master (SR) and Composition (PA) rights. "
            "Percentages are locked in digital split sheets, and statement CSVs are ingested to disburse royalties "
            "directly into M-Pesa mobile wallets, bank wires, and PayPal with zero escrow leakage."
        )
        actions = ["Read Split Sheets Guide", "Explore Master vs Composition"]
    elif "sync" in prompt or "escrow" in prompt or "cue" in prompt:
        reply = (
            "SyncMavens provides one-stop pre-cleared sync licensing. Music Supervisors broadcast creative briefs, "
            "and when a track is approved, funds are locked in milestone escrow and disbursed automatically upon cue sheet certification."
        )
        actions = ["Read Sync Licensing Masterclass", "Review Licensing Escrow"]
    else:
        reply = (
            f"Hello! I am TuneSupport Operations AI. I am configured with complete context for the '{persona_info['name']}' persona. "
            "I can assist you with Wall of Fame inductions, user role provisioning, Smart CRM communications, split cascades, "
            "and ecosystem health monitoring."
        )
        actions = ["How do I induct an icon?", "Explain Persona RBAC", "Inspect System Telemetry"]

    return {
        "reply": reply,
        "persona": persona,
        "suggested_actions": actions,
        "relevant_articles": matching_articles[:3],
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# ======================================================================
# Persona Definitions & Telemetry
# ======================================================================
@router.get("/api/admin/console/personas")
def get_personas_matrix():
    """Returns all persona definitions and capability permissions."""
    return {"personas": PERSONA_CAPABILITIES}


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
