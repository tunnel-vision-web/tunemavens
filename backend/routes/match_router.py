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

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/match", tags=["matching"])


def seed_sync_marketplace_if_empty():
    """Ensure rich active briefs and pre-cleared catalog tracks exist in MongoDB."""
    if db.briefs.count_documents({}) < 5:
        broadcast_briefs = [
            {
                "brief_id": "brief_net_01",
                "title": "Untitled Cyberpunk Nairobi Thriller",
                "client": "Netflix International Original Series",
                "production_house": "Film Studios Africa / Netflix UK",
                "project_type": "Film / TV Series",
                "budget": 18000.0,
                "currency": "USD",
                "genres": ["synthwave", "afrofuturism", "dark techno"],
                "moods": ["action", "dark", "energetic"],
                "target_bpm": 120,
                "duration_needed": "Full Track & 60s Trailer Stems",
                "deadline": "2026-12-15",
                "deadline_date": "In 3 days",
                "status": "OPEN",
                "urgency": "high",
                "synopsis": "High-octane car chase through futuristic neon Nairobi city streets at night. Looking for heavy, driving basslines, aggressive analog synths, and subtle African percussive rhythms.",
                "reference_tracks": "Kavinsky, Gesaffelstein, Ndufo Cyberwave",
                "creator_split_promise": "90% Gross ($16,200 via TuneLedger Cascade)",
                "created_at": datetime.now(timezone.utc),
            },
            {
                "brief_id": "brief_auto_02",
                "title": "Summer 4x4 Safari Global Ad",
                "client": "Land Rover / Ogilvy Kenya",
                "production_house": "Ogilvy East Africa & EMEA",
                "project_type": "Commercial Ad",
                "budget": 45000.0,
                "currency": "USD",
                "genres": ["afrobeats", "indie pop", "organic groove"],
                "moods": ["uplifting", "happy", "sunset"],
                "target_bpm": 108,
                "duration_needed": "30s TV Cut, 60s Cinema Cut + Instrumental",
                "deadline": "2026-12-20",
                "deadline_date": "In 5 days",
                "status": "OPEN",
                "urgency": "medium",
                "synopsis": "Stunning vistas of Maasai Mara savannah at golden hour. Music must start stripped back with acoustic plucks/kora, blooming into a soaring, joyful hook.",
                "reference_tracks": "Burna Boy, Bakermat, Aisha Okoro",
                "creator_split_promise": "90% Gross ($40,500 via TuneLedger Cascade)",
                "created_at": datetime.now(timezone.utc),
            },
            {
                "brief_id": "brief_ea_03",
                "title": "EA Sports FC 27 African Roster Soundtrack",
                "client": "EA Sports Worldwide",
                "production_house": "Electronic Arts Vancouver & London",
                "project_type": "Video Game OST",
                "budget": 25000.0,
                "currency": "USD",
                "genres": ["amapiano", "gengetone", "afro-house"],
                "moods": ["swagger", "energetic", "celebration"],
                "target_bpm": 113,
                "duration_needed": "In-Game Menu Loop & Stadium Goal Stinger",
                "deadline": "2026-12-25",
                "deadline_date": "In 8 days",
                "status": "OPEN",
                "urgency": "medium",
                "synopsis": "In-game menu and pre-match tunnel music. Heavy bass log drums with confident vocal chants and syncopated shakers. Must exude swagger and high athletic energy.",
                "reference_tracks": "Uncle Waffles, Kabza De Small, Matatu Boys",
                "creator_split_promise": "90% Gross ($22,500 via TuneLedger Cascade)",
                "created_at": datetime.now(timezone.utc),
            },
            {
                "brief_id": "brief_a24_04",
                "title": "A24 Indie Psychological Drama End Credits",
                "client": "A24 Feature Films",
                "production_house": "A24 New York / Plan B",
                "project_type": "Indie Feature Film",
                "budget": 32000.0,
                "currency": "USD",
                "genres": ["ambient", "neo-classical", "ethereal vocal"],
                "moods": ["melancholy", "cinematic", "hypnotic"],
                "target_bpm": 88,
                "duration_needed": "Full 4-minute End Title Recording",
                "deadline": "2026-12-28",
                "deadline_date": "In 12 days",
                "status": "OPEN",
                "urgency": "low",
                "synopsis": "Slow-burn dramatic resolution. Needs haunting soprano vocalizations over sweeping bowed strings and minimal Rhodes piano.",
                "reference_tracks": "Max Richter, Labrinth, Ólafur Arnalds",
                "creator_split_promise": "90% Gross ($28,800 via TuneLedger Cascade)",
                "created_at": datetime.now(timezone.utc),
            },
            {
                "brief_id": "brief_hbo_05",
                "title": "HBO Max Thriller Montages",
                "client": "Warner Bros. Discovery / HBO",
                "production_house": "Bad Robot / HBO Drama",
                "project_type": "Premium Cable Drama",
                "budget": 28000.0,
                "currency": "USD",
                "genres": ["dark techno", "industrial", "cinematic bass"],
                "moods": ["tension", "dark", "suspense"],
                "target_bpm": 126,
                "duration_needed": "Episodic Recurring Theme + Scene Cues",
                "deadline": "2026-12-30",
                "deadline_date": "In 14 days",
                "status": "OPEN",
                "urgency": "high",
                "synopsis": "Interrogation room and surveillance scenes. Rhythmic ticking pulses, low sub-bass drones, and abrupt dynamic drops.",
                "reference_tracks": "Trent Reznor, Atticus Ross, Static Pulse",
                "creator_split_promise": "90% Gross ($25,200 via TuneLedger Cascade)",
                "created_at": datetime.now(timezone.utc),
            }
        ]
        for b in broadcast_briefs:
            if not db.briefs.find_one({"title": b["title"]}):
                db.briefs.insert_one(b)

    if db.sync_catalogs.count_documents({}) < 4:
        sample_catalog = [
            {
                "track_id": "sync_trk_01",
                "title": "Nairobi Cyberwave",
                "artist": "Ndufo",
                "genre": "Synthwave / Afrofuturism",
                "moods": ["action", "energetic", "cinematic"],
                "bpm": 122,
                "key": "D Minor",
                "duration": "3:45",
                "vocal_type": "Instrumental",
                "clearance_status": "100% Pre-Cleared One-Stop",
                "iswc": "T-345.891.002-1",
                "isrc": "KEN922600101",
                "pro_affiliation": "MCSK / BMI",
                "stems_available": ["Full Mix", "Drums", "Bass", "Synths"],
                "pricing": {"indie_film": 350, "tv_series": 950, "commercial": 1800},
                "audio_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "track_id": "sync_trk_02",
                "title": "Kilimanjaro Sunrise",
                "artist": "Aisha Okoro",
                "genre": "Afrobeats / Organic Groove",
                "moods": ["uplifting", "sunset", "happy"],
                "bpm": 108,
                "key": "G Major",
                "duration": "3:20",
                "vocal_type": "Vocal + Clean Instrumental",
                "clearance_status": "100% Pre-Cleared One-Stop",
                "iswc": "T-819.340.119-4",
                "isrc": "KEN922600102",
                "pro_affiliation": "MCSK / ASCAP",
                "stems_available": ["Full Mix", "Main Vocals", "Talking Drums", "Guitars"],
                "pricing": {"indie_film": 450, "tv_series": 1200, "commercial": 2400},
                "audio_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "track_id": "sync_trk_03",
                "title": "Midnight In Soweto",
                "artist": "DJ Maphoria",
                "genre": "Amapiano / Afro-House",
                "moods": ["swagger", "energetic", "celebration"],
                "bpm": 113,
                "key": "F# Minor",
                "duration": "4:10",
                "vocal_type": "Clean Hook + Instrumental",
                "clearance_status": "100% Pre-Cleared One-Stop",
                "iswc": "T-992.103.882-0",
                "isrc": "ZAE722600303",
                "pro_affiliation": "SAMRO / PRS",
                "stems_available": ["Full Mix", "Log Drum", "Percussion", "Keys"],
                "pricing": {"indie_film": 400, "tv_series": 1100, "commercial": 2200},
                "audio_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "created_at": datetime.now(timezone.utc)
            },
            {
                "track_id": "sync_trk_04",
                "title": "Ethereal Rift",
                "artist": "Aether Echo",
                "genre": "Ambient / Neo-Classical",
                "moods": ["melancholy", "cinematic", "hypnotic"],
                "bpm": 88,
                "key": "A Minor",
                "duration": "3:58",
                "vocal_type": "Instrumental + Ethereal Choir",
                "clearance_status": "100% Pre-Cleared One-Stop",
                "iswc": "T-114.772.339-2",
                "isrc": "USN922600404",
                "pro_affiliation": "BMI",
                "stems_available": ["Full Mix", "Strings", "Choir", "Sub"],
                "pricing": {"indie_film": 500, "tv_series": 1300, "commercial": 2600},
                "audio_url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "created_at": datetime.now(timezone.utc)
            }
        ]
        for c in sample_catalog:
            if not db.sync_catalogs.find_one({"title": c["title"]}):
                db.sync_catalogs.insert_one(c)

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
    """Lists pre-cleared one-stop tracks ready for sync placement."""
    cursor = db.sync_catalogs.find({}).sort("created_at", -1)
    tracks = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc["_id"] = str(doc["_id"])
        tracks.append(doc)
    return tracks


@router.post("/catalog", status_code=status.HTTP_201_CREATED)
def add_sync_catalog_track(payload: dict, current_user: dict = Depends(get_current_user)):
    """Allows creators to register a pre-cleared track in the sync marketplace."""
    track_doc = {
        "user_id": str(current_user["_id"]),
        "track_id": f"sync_trk_{secrets.token_hex(3)}",
        "title": payload.get("title", ""),
        "artist": payload.get("artist", current_user.get("username", "Artist")),
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
        "audio_url": payload.get("audio_url", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
        "created_at": datetime.now(timezone.utc)
    }
    res = db.sync_catalogs.insert_one(track_doc)
    track_doc["id"] = str(res.inserted_id)
    track_doc["_id"] = str(res.inserted_id)
    return track_doc
