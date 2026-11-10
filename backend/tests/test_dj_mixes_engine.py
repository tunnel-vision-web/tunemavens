import pytest
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
            "email": "dj_curator_test@tunemavens.com",
            "username": "dj_curator_test",
            "display_name": "DJ Test Master",
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


def test_extract_tracks_engine(auth_headers):
    # Test waveform / acoustic track extraction
    payload = {
        "duration_seconds": 2400,
        "detected_genre": "Afrobeats"
    }
    res = client.post("/api/dj/mixes/extract-tracks", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    tracklist = data["tracklist"]
    assert len(tracklist) >= 3
    # Check that timestamps are sequential and valid
    for idx, track in enumerate(tracklist):
        assert track["start_time"] < track["end_time"]
        assert track["duration_seconds"] > 0
        assert "ip_owner_email" in track
        assert "split_percentage" in track


def test_extract_tracks_with_cue_sheet(auth_headers):
    cue_text = """[00:00] Master KG - Jerusalem Rhythm
[05:30] Burna Boy - City Boys Rework
[11:00] Wizkid - Essence Club Tool"""
    payload = {
        "duration_seconds": 1200,
        "cue_sheet_text": cue_text,
        "detected_genre": "Afrobeat"
    }
    res = client.post("/api/dj/mixes/extract-tracks", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    tracklist = data["tracklist"]
    assert len(tracklist) == 3
    assert tracklist[0]["artist"] == "Master KG"
    assert tracklist[0]["title"] == "Jerusalem Rhythm"
    assert tracklist[0]["start_time"] == 0
    assert tracklist[0]["end_time"] == 330
    assert tracklist[1]["artist"] == "Burna Boy"
    assert tracklist[1]["start_time"] == 330


def test_original_ip_instant_publish_flow(auth_headers, dj_user):
    # 1. Create mix flagged as 100% original IP
    create_payload = {
        "title": "Neon Synthesizer Odyssey (100% Original Live Set)",
        "description": "Composed, mixed, and performed live with zero 3rd-party samples.",
        "genre": "Synthwave",
        "bpm_avg": 128,
        "duration_seconds": 1800,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "artwork_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad",
        "is_original_ip_only": True,
        "commercial_price": 6.99,
        "auto_extract_tracks": True
    }
    res = client.post("/api/dj/mixes", json=create_payload, headers=auth_headers)
    assert res.status_code == 200
    mix = res.json()
    mix_id = mix["id"]
    assert mix["is_original_ip_only"] is True
    assert mix["sale_locked"] is False
    assert mix["status"] == "published"

    # 2. Re-certify / publish warranty endpoint
    pub_res = client.post(
        f"/api/dj/mixes/{mix_id}/publish-original",
        json={"legal_name": "Marcus DJ", "certification_confirmed": True},
        headers=auth_headers
    )
    assert pub_res.status_code == 200
    assert pub_res.json()["self_certification_signature"].startswith("SIG-SHA256-")

    # 3. Direct commercial purchase is immediately allowed (no clearances needed!)
    buy_res = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert buy_res.status_code == 200
    buy_data = buy_res.json()
    assert buy_data["status"] == "success"
    assert buy_data["price_paid"] == 6.99
    assert buy_data["order_reference"].startswith("TM-MIX-SALE-")


def test_commercial_clearance_lifecycle_and_sale_gate(auth_headers, dj_user):
    # 1. Create commercial mix containing tracks from 2 external artists
    create_payload = {
        "title": "Nairobi Club Sessions (Commercial Compilation Vol 2)",
        "description": "Curated club mix featuring East African anthems.",
        "genre": "Amapiano",
        "bpm_avg": 113,
        "duration_seconds": 1200,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "is_original_ip_only": False,
        "commercial_price": 5.00,
        "auto_extract_tracks": False
    }
    create_res = client.post("/api/dj/mixes", json=create_payload, headers=auth_headers)
    assert create_res.status_code == 200
    mix = create_res.json()
    mix_id = mix["id"]
    assert mix["sale_locked"] is True

    # 2. Set explicit tracklist with 2 tracks
    tracklist_payload = {
        "tracklist": [
            {
                "id": "trk_alpha",
                "title": "Soweto Sunshine",
                "artist": "DJ Maphoria",
                "ip_owner_name": "Maphoria Music",
                "ip_owner_email": "maphoria@tunemavens.com",
                "start_time": 0,
                "end_time": 600,
                "duration_seconds": 600,
                "split_percentage": 50.0,
                "clearance_status": "pending"
            },
            {
                "id": "trk_beta",
                "title": "Mombasa Breeze",
                "artist": "Aisha Okoro",
                "ip_owner_name": "Aisha Okoro Publishing",
                "ip_owner_email": "aisha@tunemavens.com",
                "start_time": 600,
                "end_time": 1200,
                "duration_seconds": 600,
                "split_percentage": 50.0,
                "clearance_status": "pending"
            }
        ],
        "dj_split_percentage": 40.0,
        "track_owners_split_percentage": 50.0,
        "platform_fee_percentage": 10.0
    }
    update_res = client.put(f"/api/dj/mixes/{mix_id}/tracklist", json=tracklist_payload, headers=auth_headers)
    assert update_res.status_code == 200

    # 3. VERIFY STRICT SALE LOCK: Purchase attempt MUST fail with 403 Forbidden
    premature_buy = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert premature_buy.status_code == 403
    err_body = premature_buy.json()["detail"]
    assert err_body["error"] == "Commercial sales locked"
    assert "Soweto Sunshine" in err_body["pending_clearances"]
    assert "Mombasa Breeze" in err_body["pending_clearances"]

    # 4. Dispatch clearance requests & contract invitations
    dispatch_res = client.post(f"/api/dj/mixes/{mix_id}/request-clearance", headers=auth_headers)
    assert dispatch_res.status_code == 200
    mix_after_dispatch = dispatch_res.json()["mix"]
    assert mix_after_dispatch["status"] == "clearance_pending"
    assert mix_after_dispatch["sale_locked"] is True
    # Verify contracts were registered in db.contracts
    contracts_count = db.contracts.count_documents({"linked_deal_id": mix_id, "kind": "dj_mix_clearance"})
    assert contracts_count == 2

    # 5. IP Owner 1 signs track trk_alpha
    sign_1 = client.post(
        f"/api/dj/mixes/{mix_id}/sign-clearance/trk_alpha",
        json={"signer_name": "Maphoria Rep", "signer_email": "maphoria@tunemavens.com"},
        headers=auth_headers
    )
    assert sign_1.status_code == 200
    assert sign_1.json()["all_cleared"] is False
    assert sign_1.json()["signature_hash"].startswith("SIG-SHA256-")

    # Still locked because trk_beta is pending!
    premature_buy_2 = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert premature_buy_2.status_code == 403

    # 6. IP Owner 2 signs track trk_beta -> 100% COMPLETE CONSENSUS!
    sign_2 = client.post(
        f"/api/dj/mixes/{mix_id}/sign-clearance/trk_beta",
        json={"signer_name": "Aisha Okoro", "signer_email": "aisha@tunemavens.com"},
        headers=auth_headers
    )
    assert sign_2.status_code == 200
    assert sign_2.json()["all_cleared"] is True
    updated_mix = sign_2.json()["mix"]
    assert updated_mix["status"] == "published"
    assert updated_mix["sale_locked"] is False
    assert updated_mix["clearance_summary"]["consensus_reached"] is True

    # 7. Now commercial purchase succeeds with Split Cascade distribution!
    final_buy = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert final_buy.status_code == 200
    buy_result = final_buy.json()
    assert buy_result["status"] == "success"
    assert buy_result["price_paid"] == 5.00
    splits = buy_result["splits_distributed"]
    # DJ 40% of 5.00 = 2.00
    assert splits["dj_payout"] == 2.00
    # Platform 10% of 5.00 = 0.50
    assert splits["platform_fee"] == 0.50
    # Track pool 50% of 5.00 = 2.50
    assert splits["track_owners_pool"] == 2.50
    assert len(splits["track_allocations"]) == 2
    assert splits["track_allocations"][0]["allocated_amount"] == 1.25
    assert splits["track_allocations"][1]["allocated_amount"] == 1.25
