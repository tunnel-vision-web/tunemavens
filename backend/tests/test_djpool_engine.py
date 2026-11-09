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
def dj_user():
    user = db.users.find_one({"role": "dj"})
    if not user:
        user_doc = {
            "email": "test_dj_user@tunemavens.com",
            "username": "test_dj_pro",
            "display_name": "DJ Test Pro",
            "password": "hashed_secret_test",
            "role": "dj",
            "country": "KE",
            "created_at": datetime.now(timezone.utc)
        }
        res = db.users.insert_one(user_doc)
        user = db.users.find_one({"_id": res.inserted_id})
    return user

@pytest.fixture
def auth_headers(dj_user):
    token = create_access_token(sub=str(dj_user["_id"]))
    return {"Authorization": f"Bearer {token}"}

def test_list_promo_tracks(auth_headers):
    # Test base listing
    res = client.get("/api/djpool/tracks", headers=auth_headers)
    assert res.status_code == 200
    tracks = res.json()
    assert isinstance(tracks, list)
    assert len(tracks) > 0

    # Test BPM filtering
    res_bpm = client.get("/api/djpool/tracks?bpm_min=120&bpm_max=130", headers=auth_headers)
    assert res_bpm.status_code == 200
    for t in res_bpm.json():
        assert 120 <= t["bpm"] <= 130

    # Test Genre filtering
    res_genre = client.get("/api/djpool/tracks?genre=House", headers=auth_headers)
    assert res_genre.status_code == 200
    for t in res_genre.json():
        assert t["genre"].lower() == "house"

def test_add_promo_track_and_download_flow(auth_headers, dj_user):
    # 1. Add promo track
    payload = {
        "title": "Automated Club Anthem (VIP)",
        "artist": "Test Artist Alpha",
        "bpm": 126,
        "key": "5A",
        "genre": "House",
        "version_type": "Extended Mix",
        "energy_level": 9,
        "duration_seconds": 260,
        "stems_available": True,
        "lossless_format": "24-bit WAV",
        "allowed_regions": []
    }
    create_res = client.post("/api/djpool/tracks", json=payload, headers=auth_headers)
    assert create_res.status_code == 200
    new_track = create_res.json()
    track_id = new_track["id"]
    assert new_track["title"] == payload["title"]

    # 2. Submit Feedback
    feedback_payload = {
        "track_id": track_id,
        "rating": 5,
        "dancefloor_response": "peak_moment",
        "review_text": "Dropped at peak hour, dancefloor went crazy!"
    }
    fb_res = client.post("/api/djpool/feedback", json=feedback_payload, headers=auth_headers)
    assert fb_res.status_code == 200
    assert fb_res.json()["status"] == "success"

    # 3. Download promo track (Unlocked after feedback)
    dl_res = client.post(f"/api/djpool/download/{track_id}", headers=auth_headers)
    assert dl_res.status_code == 200
    assert dl_res.json()["status"] == "success"
    assert "audio_url" in dl_res.json()

def test_clearance_lifecycle(auth_headers, dj_user):
    # 1. Submit clearance request
    clearance_payload = {
        "track_id": "demo_track_id",
        "title": "Midnight Grooves (Afro Bootleg)",
        "dj_name": dj_user.get("username", "test_dj_pro"),
        "venue": "Blankets & Wine Nairobi",
        "event_date": "2026-12-15",
        "remix_type": "bootleg_remix"
    }
    req_res = client.post("/api/djpool/clearance", json=clearance_payload, headers=auth_headers)
    assert req_res.status_code == 200
    req_data = req_res.json()
    req_id = req_data["id"]
    assert "certificate_id" in req_data
    assert req_data["status"] == "pending"

    # 2. List clearances
    list_res = client.get("/api/djpool/clearance", headers=auth_headers)
    assert list_res.status_code == 200
    ids = [c["id"] for c in list_res.json()]
    assert req_id in ids
