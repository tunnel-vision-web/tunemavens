"""Sync Match & Waterfall Router.

Provides SyncMavens matching simulation algorithms against active briefs
and computes the 90/10 compensation split waterfall.
"""
from datetime import datetime, timezone
import logging
import secrets
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/match", tags=["matching"])

# In-memory mock briefs for sandbox matching
MOCK_BRIEFS: Dict[str, Dict] = {
    "brief_1": {
        "id": "brief_1",
        "title": "Untitled Cyberpunk Drama",
        "genres": ["synthwave", "techno", "dark synth"],
        "moods": ["action", "retro", "dark"],
        "target_bpm": 110,
    },
    "brief_2": {
        "id": "brief_2",
        "title": "Summer Adventure Campaign",
        "genres": ["indie pop", "pop", "acoustic"],
        "moods": ["uplifting", "happy", "energetic"],
        "target_bpm": 125,
    },
}


class BriefCreateRequest(BaseModel):
    title: str
    project_type: Optional[str] = "Film / TV"
    budget: float
    genres: List[str]
    moods: List[str]
    target_bpm: Optional[int] = 120
    deadline: Optional[str] = None


class PitchSubmitRequest(BaseModel):
    brief_id: str
    track_id: str
    track_title: str
    artist: str
    audio_url: str
    genre: str
    mood: str
    bpm: int


@router.post("/briefs", status_code=status.HTTP_201_CREATED)
def create_brief(
    payload: BriefCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Ingests a new sync supervisor brief."""
    doc = {
        "supervisor_id": str(current_user["_id"]),
        "title": payload.title,
        "project_type": payload.project_type or "Film / TV",
        "budget": payload.budget,
        "genres": [g.lower() for g in payload.genres],
        "moods": [m.lower() for m in payload.moods],
        "target_bpm": payload.target_bpm or 120,
        "deadline": payload.deadline or "2026-12-31",
        "status": "OPEN",
        "created_at": datetime.now(timezone.utc),
    }
    res = db.briefs.insert_one(doc)
    doc["_id"] = str(res.inserted_id)
    return doc


@router.get("/briefs")
def list_briefs():
    """Lists all active sync supervisor briefs."""
    cursor = db.briefs.find({})
    briefs_list = []
    for b in cursor:
        b["_id"] = str(b["_id"])
        briefs_list.append(b)
    
    # If no DB briefs exist yet, include mock sandbox briefs
    if not briefs_list:
        for key, mb in MOCK_BRIEFS.items():
            mb["_id"] = key
            briefs_list.append(mb)
            
    return briefs_list


@router.post("/pitch", status_code=status.HTTP_201_CREATED)
def submit_pitch(
    payload: PitchSubmitRequest,
    current_user: dict = Depends(get_current_user),
):
    """Submits a track pitch against an active brief with AI match scoring."""
    # Compute match score
    from bson import ObjectId
    try:
        brief = db.briefs.find_one({"_id": ObjectId(payload.brief_id)})
    except Exception:
        brief = db.briefs.find_one({"_id": payload.brief_id})

    if not brief:
        brief = MOCK_BRIEFS.get(payload.brief_id)

    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")

    target_genres = brief.get("genres", [])
    target_moods = brief.get("moods", [])
    target_bpm = brief.get("target_bpm", 120)

    genre_score = 1.0 if any(g in payload.genre.lower() for g in target_genres) else 0.0
    mood_score = 1.0 if any(m in payload.mood.lower() for m in target_moods) else 0.0
    bpm_diff = abs(target_bpm - payload.bpm)
    bpm_score = max(0.0, 1.0 - (bpm_diff / 30.0))

    compatibility = (genre_score * 0.4) + (mood_score * 0.4) + (bpm_score * 0.2)
    match_score = int(max(0, min(100, compatibility * 100)))

    pitch_doc = {
        "pitch_id": f"PITCH-{secrets.token_hex(6).upper()}",
        "brief_id": payload.brief_id,
        "user_id": str(current_user["_id"]),
        "track_id": payload.track_id,
        "track_title": payload.track_title,
        "artist": payload.artist,
        "audio_url": payload.audio_url,
        "match_score": match_score,
        "status": "UNDER_REVIEW",
        "created_at": datetime.now(timezone.utc),
    }

    res = db.sync_pitches.insert_one(pitch_doc)
    pitch_doc["_id"] = str(res.inserted_id)
    return pitch_doc


@router.get("/pitches")
def list_my_pitches(current_user: dict = Depends(get_current_user)):
    """Lists track pitches submitted by the current user."""
    cursor = db.sync_pitches.find({"user_id": str(current_user["_id"])})
    pitches = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        pitches.append(doc)
    return pitches


class TrackMetadata(BaseModel):
    genre: str
    mood: str
    bpm: int


class MatchRequest(BaseModel):
    brief_id: str
    track_metadata: TrackMetadata


@router.post("/simulate")
def simulate_matching(payload: MatchRequest):
    """Compares track metadata against a brief to compute a match score."""
    from bson import ObjectId
    try:
        brief = db.briefs.find_one({"_id": ObjectId(payload.brief_id)})
    except Exception:
        brief = db.briefs.find_one({"_id": payload.brief_id})

    if not brief:
        # Fall back to mock briefs for sandbox testing
        brief = MOCK_BRIEFS.get(payload.brief_id)
        
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")

    target_genres = brief.get("genres", [brief.get("required_genre", "").lower()])
    target_moods = brief.get("moods", [brief.get("required_mood", "").lower()])
    target_bpm = brief.get("target_bpm", 120)

    track_genre = payload.track_metadata.genre.lower()
    track_mood = payload.track_metadata.mood.lower()
    track_bpm = payload.track_metadata.bpm

    # Simple match calculator
    genre_score = 0.0
    for tg in target_genres:
        if tg in track_genre or track_genre in tg:
            genre_score = 1.0
            break

    mood_score = 0.0
    for tm in target_moods:
        if tm in track_mood or track_mood in tm:
            mood_score = 1.0
            break

    # BPM closeness (up to 30 BPM difference range)
    bpm_diff = abs(target_bpm - track_bpm)
    bpm_score = max(0.0, 1.0 - (bpm_diff / 30.0))

    # Weighted calculation: 40% genre, 40% mood, 20% bpm
    compatibility = (genre_score * 0.4) + (mood_score * 0.4) + (bpm_score * 0.2)
    match_percentage = int(compatibility * 100)

    # Bound matches
    match_percentage = max(0, min(100, match_percentage))

    return {
        "brief_id": payload.brief_id,
        "brief_title": brief.get("title", brief.get("project_title", "Unknown Brief")),
        "match_score": match_percentage,
        "breakdown": {
            "genre_match": bool(genre_score),
            "mood_match": bool(mood_score),
            "bpm_accuracy": round(bpm_score * 100, 1),
        }
    }


@router.get("/waterfall")
def calculate_waterfall_split(sync_fee: float, mode: str = "administrator"):
    """Computes the placement split waterfall.

    Supported modes:
    - 'administrator': charges a 10% administration fee of all money collected.
    - 'publishing_house': retains the 50% publisher share per standard music publishing law.
    """
    if sync_fee < 0:
        raise HTTPException(status_code=400, detail="Sync fee cannot be negative")

    if mode == "publishing_house":
        # Retains 50% publisher share as is law
        creator_share = round(sync_fee * 0.50, 2)
        platform_fee = round(sync_fee * 0.50, 2)
        ratio = "50/50"
        notes = "Publishing House Mode: TuneMavens retains 100% of the 50% Publisher Share per standard publishing law."
    else:
        # Administrator mode: charges a 10% fee of all money collected
        creator_share = round(sync_fee * 0.90, 2)
        platform_fee = round(sync_fee * 0.10, 2)
        ratio = "90/10"
        notes = "Administrator Mode: 10% admin fee charged on all money collected; 90% paid to creator."

    advance = 0.0  # $0 catalog advance policy

    return {
        "sync_fee": sync_fee,
        "mode": mode,
        "split_ratio": ratio,
        "creator_payout": creator_share,
        "platform_administration_fee": platform_fee,
        "advance_payout": advance,
        "notes": notes
    }

