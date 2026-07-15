"""Sync Match & Waterfall Router.

Provides SyncMavens matching simulation algorithms against active briefs
and computes the 90/10 compensation split waterfall.
"""
from __future__ import annotations

import logging
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
