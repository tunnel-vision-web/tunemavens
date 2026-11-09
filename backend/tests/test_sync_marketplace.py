import pytest
from bson import ObjectId
from datetime import datetime, timezone
from fastapi.testclient import TestClient

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server import app
from config import db
from auth import create_access_token

client = TestClient(app)

@pytest.fixture
def supervisor_user():
    user = db.users.find_one({"role": "supervisor"})
    if not user:
        user_doc = {
            "email": "supervisor_test@syncmavens.com",
            "username": "supervisor_pro",
            "display_name": "Studio Supervisor",
            "password": "hashed_secret_test",
            "role": "supervisor",
            "country": "US",
            "created_at": datetime.now(timezone.utc)
        }
        res = db.users.insert_one(user_doc)
        user = db.users.find_one({"_id": res.inserted_id})
    return user

@pytest.fixture
def creator_user():
    user = db.users.find_one({"role": "creator"})
    if not user:
        user_doc = {
            "email": "creator_test@syncmavens.com",
            "username": "creator_sync_pro",
            "display_name": "Creator Sync Pro",
            "password": "hashed_secret_test",
            "role": "creator",
            "country": "KE",
            "created_at": datetime.now(timezone.utc)
        }
        res = db.users.insert_one(user_doc)
        user = db.users.find_one({"_id": res.inserted_id})
    return user

@pytest.fixture
def supervisor_headers(supervisor_user):
    token = create_access_token(sub=str(supervisor_user["_id"]))
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def creator_headers(creator_user):
    token = create_access_token(sub=str(creator_user["_id"]))
    return {"Authorization": f"Bearer {token}"}


def test_list_sync_briefs_and_filtering():
    # 1. Base listing
    res = client.get("/api/match/briefs")
    assert res.status_code == 200
    briefs = res.json()
    assert isinstance(briefs, list)
    assert len(briefs) >= 4

    # 2. Filter by genre
    res_genre = client.get("/api/match/briefs?genre=synthwave")
    assert res_genre.status_code == 200
    assert len(res_genre.json()) > 0
    for b in res_genre.json():
        genres = [g.lower() for g in b.get("genres", b.get("required_genres", []))]
        assert any("synthwave" in g for g in genres)

    # 3. Filter by min_budget
    res_budget = client.get("/api/match/briefs?min_budget=30000")
    assert res_budget.status_code == 200
    for b in res_budget.json():
        assert (b.get("budget") or b.get("budget_fee")) >= 30000


def test_create_brief_and_pitch_flow(supervisor_headers, creator_headers):
    # 1. Supervisor posts new brief
    brief_payload = {
        "title": "Hollywood Sci-Fi Blockbuster Trailer",
        "client": "Universal Pictures",
        "project_type": "Theatrical Trailer",
        "budget": 50000.0,
        "genres": ["Dark Techno", "Industrial", "Cinematic"],
        "moods": ["Action", "Tension", "Dark"],
        "target_bpm": 124,
        "synopsis": "Looking for heavy distorted industrial basslines and explosive percussion.",
        "duration_needed": "60s Trailer Cue"
    }
    create_res = client.post("/api/match/briefs", json=brief_payload, headers=supervisor_headers)
    assert create_res.status_code == 201
    brief_data = create_res.json()
    brief_id = brief_data["id"]
    assert brief_data["title"] == brief_payload["title"]
    assert brief_data["budget"] == 50000.0

    # 2. Creator submits pitch against the brief
    pitch_payload = {
        "brief_id": brief_id,
        "track_id": "sync_trk_test_01",
        "track_title": "Industrial Cybernetic Stomp",
        "artist": "Creator Sync Pro",
        "genre": "Dark Techno",
        "mood": "Action",
        "bpm": 124,
        "pitch_note": "Perfect fit for the high-intensity trailer drop at 0:45 mark."
    }
    pitch_res = client.post("/api/match/pitch", json=pitch_payload, headers=creator_headers)
    assert pitch_res.status_code == 201
    pitch_data = pitch_res.json()
    assert "pitch_id" in pitch_data
    assert pitch_data["match_score"] >= 80  # Genre, mood, and BPM all align
    assert pitch_data["status"] == "UNDER_REVIEW"
    assert pitch_data["creator_payout"] == 45000.0  # 90% of $50,000

    # 3. Supervisor moderates pitch (Approve & Lock Escrow)
    pitch_id = pitch_data["pitch_id"]
    status_res = client.post(
        f"/api/match/pitches/{pitch_id}/status",
        json={"status": "APPROVED", "note": "Cue locked for trailer cut."},
        headers=supervisor_headers
    )
    assert status_res.status_code == 200
    updated_pitch = status_res.json()["pitch"]
    assert updated_pitch["status"] == "APPROVED"
    assert "license_certificate" in updated_pitch
    assert updated_pitch["disbursal_status"] == "ESCROW_LOCKED"


def test_ai_sync_match_simulator():
    # Test guest-accessible match simulation against first available brief
    briefs = client.get("/api/match/briefs").json()
    target_brief = briefs[0]
    brief_id = target_brief["id"]

    sim_payload = {
        "brief_id": brief_id,
        "track_metadata": {
            "genre": target_brief.get("genres", ["synthwave"])[0],
            "mood": target_brief.get("moods", ["action"])[0],
            "bpm": target_brief.get("target_bpm", 120)
        }
    }
    sim_res = client.post("/api/match/simulate", json=sim_payload)
    assert sim_res.status_code == 200
    sim_data = sim_res.json()
    assert "match_score" in sim_data
    assert sim_data["match_score"] >= 85
    assert "waterfall" in sim_data
    assert sim_data["waterfall"]["advance_payout"] == 0.0
    assert "100% Master & Publishing Retained" in sim_data["waterfall"]["retained_rights"]


def test_waterfall_split_calculation():
    # Test 90/10 administrator waterfall calculation with $0 advances
    res = client.get("/api/match/waterfall?sync_fee=20000&mode=administrator")
    assert res.status_code == 200
    data = res.json()
    assert data["sync_fee"] == 20000
    assert data["split_ratio"] == "90/10"
    assert data["creator_payout"] == 18000.0
    assert data["platform_administration_fee"] == 2000.0
    assert data["advance_payout"] == 0.0
    assert data["writer_producer_breakdown"]["writer_share"] == 10800.0  # 60% of creator payout
    assert data["writer_producer_breakdown"]["producer_share"] == 7200.0  # 40% of creator payout


def test_sync_catalog_listing_and_add(creator_headers):
    # 1. List catalog
    cat_res = client.get("/api/match/catalog")
    assert cat_res.status_code == 200
    catalog = cat_res.json()
    assert isinstance(catalog, list)
    assert len(catalog) >= 4

    # 2. Add track to catalog
    new_track_payload = {
        "title": "Serengeti Golden Pulse",
        "artist": "Creator Sync Pro",
        "genre": "Afrobeats",
        "moods": ["uplifting", "cinematic"],
        "bpm": 115,
        "key": "A Major",
        "duration": "3:15",
        "vocal_type": "Instrumental & Chants",
        "pricing": {"indie_film": 400, "tv_series": 1000, "commercial": 2000}
    }
    add_res = client.post("/api/match/catalog", json=new_track_payload, headers=creator_headers)
    assert add_res.status_code == 201
    assert add_res.json()["title"] == new_track_payload["title"]
    assert add_res.json()["clearance_status"] == "100% Pre-Cleared One-Stop"
