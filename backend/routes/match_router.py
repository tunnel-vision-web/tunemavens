"""Sync Match & Waterfall Router (Phase 6 · SyncMavens Sync Marketplace).

Provides SyncMavens matching simulation algorithms against active briefs,
90/10 compensation split waterfall calculations, pitch queues, and catalog sync.
"""
from datetime import datetime, timezone
import logging
import secrets
from typing import Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import get_current_user
from config import db
from routes.sync_data import AUTHORITATIVE_SYNC_CATALOG, AUTHORITATIVE_SYNC_BRIEFS, DEFAULT_SYNC_COVERS

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/match", tags=["matching"])


def seed_sync_marketplace_if_empty():
    """Synchronizes authoritative briefs and all 24 pre-cleared catalog tracks with valid covers in MongoDB."""
    # 1. Sync Authoritative Briefs
    for b in AUTHORITATIVE_SYNC_BRIEFS:
        existing = db.briefs.find_one({
            "$or": [
                {"brief_id": b.get("brief_id")},
                {"title": b.get("title")}
            ]
        })
        brief_doc = {
            "brief_id": b["brief_id"],
            "title": b["title"],
            "client": b.get("client", "Commercial / Film Client"),
            "production_house": b.get("production_house", ""),
            "project_type": b.get("project_type", "Film / TV"),
            "budget": float(b.get("budget", 15000.0)),
            "budget_fee": float(b.get("budget", 15000.0)),
            "currency": b.get("currency", "USD"),
            "genres": b.get("genres", []),
            "required_genres": b.get("genres", []),
            "moods": b.get("moods", []),
            "required_moods": b.get("moods", []),
            "target_bpm": int(b.get("target_bpm", 120)),
            "duration_needed": b.get("duration_needed", "Full Track"),
            "deadline": b.get("deadline", "2026-12-25"),
            "deadline_date": b.get("deadline_date", "In 5 days"),
            "status": b.get("status", "OPEN"),
            "urgency": b.get("urgency", "medium"),
            "synopsis": b.get("synopsis", ""),
            "reference_tracks": b.get("reference_tracks", ""),
            "creator_split_promise": b.get("creator_split_promise", "90% Gross via TuneLedger Cascade")
        }
        if not existing:
            brief_doc["created_at"] = datetime.now(timezone.utc)
            db.briefs.insert_one(brief_doc)
        else:
            db.briefs.update_one({"_id": existing["_id"]}, {"$set": brief_doc})

    # 2. Sync Authoritative Catalog (24 Tracks with covers)
    for t in AUTHORITATIVE_SYNC_CATALOG:
        existing = db.sync_catalogs.find_one({
            "$or": [
                {"track_id": t["track_id"]},
                {"title": t["title"]}
            ]
        })
        track_doc = dict(t)
        if not existing:
            track_doc["created_at"] = datetime.now(timezone.utc)
            db.sync_catalogs.insert_one(track_doc)
        else:
            # Strictly synchronize authoritative fields ensuring cover, pricing, audio_url, etc. are 100% matched
            db.sync_catalogs.update_one({"_id": existing["_id"]}, {"$set": track_doc})

    # 3. Clean up broken test tracks that lack title or track_id
    db.sync_catalogs.delete_many({
        "$or": [
            {"title": {"$exists": False}},
            {"title": None},
            {"title": ""}
        ]
    })

    # 4. Ensure any remaining custom/user tracks in database have valid non-empty cover
    db.sync_catalogs.update_many(
        {"$or": [{"cover": {"$exists": False}}, {"cover": None}, {"cover": ""}]},
        {"$set": {"cover": DEFAULT_SYNC_COVERS[0]}}
    )


# Seed on load
seed_sync_marketplace_if_empty()


class BriefCreateRequest(BaseModel):
    title: str
    client: Optional[str] = "Independent Film / Production"
    project_type: Optional[str] = "Film / TV"
    budget: float = 15000.0
    genres: List[str] = Field(default_factory=list)
    moods: List[str] = Field(default_factory=list)
    target_bpm: Optional[int] = 120
    deadline: Optional[str] = None
    synopsis: Optional[str] = ""
    duration_needed: Optional[str] = "Full Track"


class PitchSubmitRequest(BaseModel):
    brief_id: str
    track_id: str
    track_title: str
    artist: str
    audio_url: Optional[str] = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    genre: str = "Synthwave"
    mood: str = "Action"
    bpm: int = 120
    pitch_note: Optional[str] = ""


class PitchStatusUpdateRequest(BaseModel):
    status: str  # 'SHORTLISTED', 'APPROVED', 'DECLINED', 'UNDER_REVIEW'
    note: Optional[str] = None


@router.post("/briefs", status_code=status.HTTP_201_CREATED)
def create_brief(
    payload: BriefCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Ingests a new sync supervisor brief."""
    doc = {
        "supervisor_id": str(current_user["_id"]),
        "brief_id": f"brief_{secrets.token_hex(4)}",
        "title": payload.title,
        "client": payload.client or "Commercial / Film Client",
        "project_type": payload.project_type or "Film / TV",
        "budget": payload.budget,
        "budget_fee": payload.budget,
        "currency": "USD",
        "genres": [g.lower() for g in payload.genres],
        "required_genres": payload.genres,
        "moods": [m.lower() for m in payload.moods],
        "required_moods": payload.moods,
        "target_bpm": payload.target_bpm or 120,
        "duration_needed": payload.duration_needed or "Full Track",
        "deadline": payload.deadline or "2026-12-31",
        "deadline_date": "Active Brief",
        "status": "OPEN",
        "urgency": "medium",
        "synopsis": payload.synopsis or "",
        "creator_split_promise": f"90% Gross (${round(payload.budget * 0.90):,} via TuneLedger Cascade)",
        "created_at": datetime.now(timezone.utc),
    }
    res = db.briefs.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc["_id"] = str(res.inserted_id)
    return doc


@router.get("/briefs")
def list_briefs(
    genre: Optional[str] = Query(None),
    mood: Optional[str] = Query(None),
    min_budget: Optional[float] = Query(None),
    q: Optional[str] = Query(None)
):
    """Lists all active sync supervisor briefs with optional criteria filters."""
    query = {}
    and_conditions = []

    if genre and genre.lower() != "all":
        and_conditions.append({
            "$or": [
                {"genres": {"$regex": genre.strip(), "$options": "i"}},
                {"required_genres": {"$regex": genre.strip(), "$options": "i"}}
            ]
        })

    if mood and mood.lower() != "all":
        and_conditions.append({
            "$or": [
                {"moods": {"$regex": mood.strip(), "$options": "i"}},
                {"required_moods": {"$regex": mood.strip(), "$options": "i"}}
            ]
        })

    if min_budget is not None:
        and_conditions.append({"budget": {"$gte": min_budget}})

    if q and q.strip():
        search_rgx = {"$regex": q.strip(), "$options": "i"}
        and_conditions.append({
            "$or": [
                {"title": search_rgx},
                {"client": search_rgx},
                {"synopsis": search_rgx}
            ]
        })

    if and_conditions:
        query["$and"] = and_conditions

    cursor = db.briefs.find(query).sort("created_at", -1)
    briefs_list = []
    for b in cursor:
        b["id"] = str(b["_id"])
        b["_id"] = str(b["_id"])
        briefs_list.append(b)
            
    return briefs_list


@router.post("/pitch", status_code=status.HTTP_201_CREATED)
def submit_pitch(
    payload: PitchSubmitRequest,
    current_user: dict = Depends(get_current_user),
):
    """Submits a track pitch against an active brief with AI match scoring."""
    brief = None
    if ObjectId.is_valid(payload.brief_id):
        brief = db.briefs.find_one({"_id": ObjectId(payload.brief_id)})
    if not brief:
        brief = db.briefs.find_one({"brief_id": payload.brief_id}) or db.briefs.find_one({"id": payload.brief_id})

    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")

    target_genres = [g.lower() for g in brief.get("genres", brief.get("required_genres", []))]
    target_moods = [m.lower() for m in brief.get("moods", brief.get("required_moods", []))]
    target_bpm = brief.get("target_bpm", 120)

    p_genre = payload.genre.lower()
    p_mood = payload.mood.lower()

    genre_score = 1.0 if any(g in p_genre or p_genre in g for g in target_genres) else 0.4
    mood_score = 1.0 if any(m in p_mood or p_mood in m for m in target_moods) else 0.4
    bpm_diff = abs(target_bpm - payload.bpm)
    bpm_score = max(0.2, 1.0 - (bpm_diff / 40.0))

    compatibility = (genre_score * 0.45) + (mood_score * 0.35) + (bpm_score * 0.20)
    match_score = int(max(60, min(99, compatibility * 100)))

    budget_val = brief.get("budget", brief.get("budget_fee", 15000.0))
    creator_split = round(budget_val * 0.90, 2)
    admin_fee = round(budget_val * 0.10, 2)

    pitch_id = f"PITCH-{secrets.token_hex(4).upper()}"
    pitch_doc = {
        "pitch_id": pitch_id,
        "brief_id": str(brief["_id"]),
        "brief_title": brief.get("title", "Commercial Brief"),
        "client": brief.get("client", "Sync Client"),
        "user_id": str(current_user["_id"]),
        "user_email": current_user.get("email"),
        "track_id": payload.track_id,
        "track_title": payload.track_title,
        "artist": payload.artist,
        "audio_url": payload.audio_url,
        "genre": payload.genre,
        "mood": payload.mood,
        "bpm": payload.bpm,
        "match_score": match_score,
        "pitch_note": payload.pitch_note or "",
        "status": "UNDER_REVIEW",
        "budget": budget_val,
        "creator_payout": creator_split,
        "platform_admin_fee": admin_fee,
        "advance_payout": 0.0,
        "created_at": datetime.now(timezone.utc),
    }

    res = db.sync_pitches.insert_one(pitch_doc)
    pitch_doc["id"] = str(res.inserted_id)
    pitch_doc["_id"] = str(res.inserted_id)
    return pitch_doc


@router.get("/pitches")
def list_pitches(
    all_pitches: bool = Query(False, alias="all"),
    current_user: dict = Depends(get_current_user)
):
    """Lists submitted or received pitches based on permissions."""
    user_id = str(current_user["_id"])
    is_supervisor = current_user.get("role") in ["supervisor", "admin"]

    if all_pitches and is_supervisor:
        cursor = db.sync_pitches.find({}).sort("created_at", -1)
    else:
        cursor = db.sync_pitches.find({"user_id": user_id}).sort("created_at", -1)

    pitches = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc["_id"] = str(doc["_id"])
        pitches.append(doc)
    return pitches


@router.post("/pitches/{pitch_id}/status")
def update_pitch_status(
    pitch_id: str,
    payload: PitchStatusUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Allows supervisors or administrators to moderate pitch status and lock escrow."""
    query = {"$or": [{"pitch_id": pitch_id}]}
    if ObjectId.is_valid(pitch_id):
        query["$or"].append({"_id": ObjectId(pitch_id)})

    pitch = db.sync_pitches.find_one(query)
    if not pitch:
        raise HTTPException(status_code=404, detail="Pitch not found")

    new_status = payload.status.upper()
    update_data = {
        "status": new_status,
        "updated_at": datetime.now(timezone.utc)
    }
    if payload.note:
        update_data["supervisor_note"] = payload.note

    if new_status == "APPROVED":
        lic_cert = f"TM-SYNC-LIC-{datetime.now(timezone.utc).year}-{secrets.token_hex(3).upper()}"
        update_data["license_certificate"] = lic_cert
        update_data["disbursal_status"] = "ESCROW_LOCKED"
        update_data["approved_at"] = datetime.now(timezone.utc)

    db.sync_pitches.update_one(query, {"$set": update_data})
    
    updated_doc = db.sync_pitches.find_one(query)
    updated_doc["id"] = str(updated_doc["_id"])
    updated_doc["_id"] = str(updated_doc["_id"])
    return {
        "status": "success",
        "pitch": updated_doc,
        "message": f"Pitch status updated to {new_status}"
    }


class TrackMetadata(BaseModel):
    genre: str
    mood: str
    bpm: int


class MatchRequest(BaseModel):
    brief_id: str
    track_metadata: TrackMetadata


@router.post("/simulate")
def simulate_matching(payload: MatchRequest):
    """Compares track metadata against a brief to compute a match score and breakdown."""
    brief = None
    if ObjectId.is_valid(payload.brief_id):
        brief = db.briefs.find_one({"_id": ObjectId(payload.brief_id)})
    if not brief:
        brief = db.briefs.find_one({"brief_id": payload.brief_id}) or db.briefs.find_one({"id": payload.brief_id})

    if not brief:
        # Fallback to first available brief
        brief = db.briefs.find_one({})

    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")

    target_genres = [g.lower() for g in brief.get("genres", brief.get("required_genres", []))]
    target_moods = [m.lower() for m in brief.get("moods", brief.get("required_moods", []))]
    target_bpm = brief.get("target_bpm", 120)

    track_genre = payload.track_metadata.genre.lower()
    track_mood = payload.track_metadata.mood.lower()
    track_bpm = payload.track_metadata.bpm

    genre_score = 1.0 if any(g in track_genre or track_genre in g for g in target_genres) else 0.4
    mood_score = 1.0 if any(m in track_mood or track_mood in m for m in target_moods) else 0.4

    bpm_diff = abs(target_bpm - track_bpm)
    bpm_score = max(0.2, 1.0 - (bpm_diff / 40.0))

    compatibility = (genre_score * 0.45) + (mood_score * 0.35) + (bpm_score * 0.20)
    match_percentage = int(max(60, min(99, compatibility * 100)))

    budget_val = brief.get("budget", brief.get("budget_fee", 15000.0))

    return {
        "brief_id": payload.brief_id,
        "brief_title": brief.get("title", "Sync Placement Brief"),
        "client": brief.get("client", "Commercial Client"),
        "budget": budget_val,
        "match_score": match_percentage,
        "breakdown": {
            "genre_match": bool(genre_score >= 0.9),
            "mood_match": bool(mood_score >= 0.9),
            "bpm_accuracy": round(bpm_score * 100, 1),
        },
        "waterfall": {
            "gross_placement_fee": budget_val,
            "creator_payout_90pct": round(budget_val * 0.90, 2),
            "tunemavens_admin_fee_10pct": round(budget_val * 0.10, 2),
            "advance_payout": 0.0,
            "retained_rights": "100% Master & Publishing Retained"
        }
    }


@router.get("/waterfall")
def calculate_waterfall_split(sync_fee: float = 10000.0, mode: str = "administrator"):
    """Computes the 90/10 placement split waterfall with $0 catalog advances."""
    if sync_fee < 0:
        raise HTTPException(status_code=400, detail="Sync fee cannot be negative")

    if mode == "publishing_house":
        creator_share = round(sync_fee * 0.50, 2)
        platform_fee = round(sync_fee * 0.50, 2)
        ratio = "50/50"
        notes = "Publishing House Mode: 50% retained for publisher share per standard co-publishing practice."
    else:
        # Default: 90% direct to creator, 10% platform administration
        creator_share = round(sync_fee * 0.90, 2)
        platform_fee = round(sync_fee * 0.10, 2)
        ratio = "90/10"
        notes = "Pure Placement Waterfall: 90% paid directly to creator, 10% platform administration fee. 100% rights retained."

    return {
        "sync_fee": sync_fee,
        "mode": mode,
        "split_ratio": ratio,
        "creator_payout": creator_share,
        "platform_administration_fee": platform_fee,
        "advance_payout": 0.0,
        "writer_producer_breakdown": {
            "writer_share": round(creator_share * 0.60, 2),
            "producer_share": round(creator_share * 0.40, 2)
        },
        "notes": notes
    }


@router.get("/catalog")
def list_sync_catalog():
    """Lists pre-cleared one-stop tracks ready for sync placement, ensuring full sync with authoritative catalog."""
    seed_sync_marketplace_if_empty()
    cursor = db.sync_catalogs.find({}).sort("track_id", 1)
    tracks = []
    auth_map = {t["track_id"]: t for t in AUTHORITATIVE_SYNC_CATALOG}
    auth_title_map = {t["title"]: t for t in AUTHORITATIVE_SYNC_CATALOG}

    for idx, doc in enumerate(cursor):
        doc["id"] = str(doc["_id"])
        doc["_id"] = str(doc["_id"])
        tid = doc.get("track_id")
        title = doc.get("title")
        auth_match = auth_map.get(tid) or auth_title_map.get(title)

        if not doc.get("cover"):
            if auth_match and auth_match.get("cover"):
                doc["cover"] = auth_match["cover"]
            else:
                doc["cover"] = DEFAULT_SYNC_COVERS[idx % len(DEFAULT_SYNC_COVERS)]
        if not doc.get("audio_url") and auth_match:
            doc["audio_url"] = auth_match.get("audio_url")
        if not doc.get("pricing") and auth_match:
            doc["pricing"] = auth_match.get("pricing")
        tracks.append(doc)
    return tracks


@router.post("/catalog", status_code=status.HTTP_201_CREATED)
def add_sync_catalog_track(payload: dict, current_user: dict = Depends(get_current_user)):
    """Allows creators to register a pre-cleared track in the sync marketplace."""
    default_cover = DEFAULT_SYNC_COVERS[0]
    track_doc = {
        "user_id": str(current_user["_id"]),
        "track_id": f"sync_trk_{secrets.token_hex(3)}",
        "title": payload.get("title", ""),
        "artist": payload.get("artist", current_user.get("full_name") or current_user.get("username", "Artist")),
        "genre": payload.get("genre", "Afrobeats"),
        "moods": payload.get("moods", ["energetic", "cinematic"]),
        "bpm": int(payload.get("bpm", 120)),
        "key": payload.get("key", "C Major"),
        "duration": payload.get("duration", "3:30"),
        "vocal_type": payload.get("vocal_type", "Instrumental"),
        "clearance_status": "100% Pre-Cleared One-Stop",
        "iswc": payload.get("iswc", f"T-{secrets.token_hex(3).upper()}-1"),
        "isrc": payload.get("isrc", f"KEN9226{secrets.token_hex(2).upper()}"),
        "pro_affiliation": payload.get("pro_affiliation", "MCSK / ASCAP"),
        "stems_available": payload.get("stems_available", ["Full Mix", "Drums", "Bass", "Synths"]),
        "pricing": payload.get("pricing", {"indie_film": 350, "tv_series": 950, "commercial": 1800}),
        "cover": payload.get("cover") or default_cover,
        "audio_url": payload.get("audio_url", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
        "created_at": datetime.now(timezone.utc)
    }
    res = db.sync_catalogs.insert_one(track_doc)
    track_doc["id"] = str(res.inserted_id)
    track_doc["_id"] = str(res.inserted_id)
    return track_doc
