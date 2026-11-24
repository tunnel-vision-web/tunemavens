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


def test_free_promotional_streaming_until_cleared_with_ip_credits(auth_headers):
    # Create mix with pending clearance
    create_payload = {
        "title": "Mombasa Sunset Showcase (Pending Clearances)",
        "description": "Showcase afro-tech set with external recordings.",
        "genre": "Afro-House",
        "bpm_avg": 122,
        "duration_seconds": 1800,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "is_original_ip_only": False,
        "commercial_price": 5.99,
        "auto_extract_tracks": False
    }
    create_res = client.post("/api/dj/mixes", json=create_payload, headers=auth_headers)
    assert create_res.status_code == 200
    mix = create_res.json()
    mix_id = mix["id"]

    # Add tracklist with 2 external IP owners
    tracklist_payload = {
        "tracklist": [
            {
                "id": "trk_promo_1",
                "title": "Kilifi Dub",
                "artist": "Coastal Pioneer",
                "ip_owner_name": "Coastline Music Ltd",
                "ip_owner_email": "coast@tunemavens.com",
                "start_time": 0,
                "end_time": 900,
                "clearance_status": "pending"
            },
            {
                "id": "trk_promo_2",
                "title": "Zanzibar Echoes",
                "artist": "Taarab Collective",
                "ip_owner_name": "Indian Ocean Records",
                "ip_owner_email": "ocean@tunemavens.com",
                "start_time": 900,
                "end_time": 1800,
                "clearance_status": "pending"
            }
        ]
    }
    client.put(f"/api/dj/mixes/{mix_id}/tracklist", json=tracklist_payload, headers=auth_headers)

    # 1. Fetch mix: verify free promotional streaming is active and IP owners are credited
    get_res = client.get(f"/api/dj/mixes/{mix_id}")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["free_to_stream"] is True
    assert data["streaming_mode"] == "free_promotional"
    assert data["free_stream_until_cleared"] is True
    assert data["sale_locked"] is True
    assert data["ip_credits_mandatory"] is True
    assert len(data["credited_ip_owners"]) == 2
    assert "Coastline Music Ltd" in data["credited_ip_owners"][0]["ip_owner_name"]
    assert "Featured Recording" in data["credited_ip_owners"][0]["credit_statement"]

    # 2. Call explicit /stream endpoint
    stream_res = client.get(f"/api/dj/mixes/{mix_id}/stream")
    assert stream_res.status_code == 200
    stream_data = stream_res.json()
    assert stream_data["free_to_stream"] is True
    assert stream_data["streaming_mode"] == "free_promotional"
    assert len(stream_data["credited_ip_owners"]) == 2

    # 3. Attempting commercial purchase returns 403 explaining promotional free streaming
    buy_res = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert buy_res.status_code == 403
    detail = buy_res.json()["detail"]
    assert detail["free_to_stream"] is True
    assert detail["streaming_mode"] == "free_promotional"
    assert "free to stream" in detail["message"].lower()

    # 4. Sign both clearances -> streaming_mode transitions to commercial
    client.post(f"/api/dj/mixes/{mix_id}/sign-clearance/trk_promo_1", json={"signer_name": "Coast Rep", "signer_email": "coast@tunemavens.com"})
    sign2 = client.post(f"/api/dj/mixes/{mix_id}/sign-clearance/trk_promo_2", json={"signer_name": "Ocean Rep", "signer_email": "ocean@tunemavens.com"})
    assert sign2.status_code == 200
    cleared_mix = sign2.json()["mix"]
    assert cleared_mix["streaming_mode"] == "commercial"
    assert cleared_mix["sale_locked"] is False
    assert cleared_mix["free_stream_until_cleared"] is False


def test_dj_remix_with_original_beat_lifecycle(auth_headers, dj_user):
    """Test Requirement 2:
    DJ creates a new version of a song with their originally created beat.
    Before clearance: streams completely free, strictly no selling, with full accreditation to creator/IP owner.
    After clearance: can be sold and/or streamed with split cascade revenue payouts.
    """
    create_payload = {
        "title": "Aisha Okoro - Nairobi Sunset (DJ Master Afro-Tech Original Beat Rework)",
        "description": "Original high-energy Afro-Tech drum and synth arrangement composed by DJ Master over Aisha Okoro's vocal track.",
        "genre": "Afro House",
        "bpm_avg": 124,
        "duration_seconds": 360,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "creation_type": "remix_original_beat",
        "is_remix_original_beat": True,
        "original_song_title": "Nairobi Sunset",
        "original_song_artist": "Aisha Okoro",
        "remix_beat_description": "Original Afro-Tech beat production and 3-step percussions composed by DJ Master",
        "commercial_price": 4.00,
        "dj_split_percentage": 50.0,
        "track_owners_split_percentage": 40.0,
        "platform_fee_percentage": 10.0,
        "tracklist": [
            {
                "id": "trk_remix_og",
                "title": "Nairobi Sunset",
                "artist": "Aisha Okoro",
                "ip_owner_name": "Aisha Okoro Publishing Ltd",
                "ip_owner_email": "aisha@tunemavens.com",
                "start_time": 0,
                "end_time": 360,
                "duration_seconds": 360,
                "split_percentage": 100.0,
                "clearance_status": "pending"
            }
        ]
    }
    create_res = client.post("/api/dj/mixes", json=create_payload, headers=auth_headers)
    assert create_res.status_code == 200
    remix = create_res.json()
    remix_id = remix["id"]
    assert remix["creation_type"] == "remix_original_beat"
    assert remix["is_remix_original_beat"] is True

    # 1. PRE-CLEARANCE CHECKS:
    # Streams completely free, strictly no selling, full accreditation to original creator/IP owner
    assert remix["free_to_stream"] is True
    assert remix["streaming_mode"] == "free_promotional"
    assert remix["free_stream_until_cleared"] is True
    assert remix["sale_locked"] is True
    assert remix["can_sell"] is False
    assert remix["can_stream"] is True
    assert remix["ip_credits_mandatory"] is True
    assert len(remix["credited_ip_owners"]) == 1
    # Check that accreditation statement credits both original song creator and DJ's originally created beat
    credit_stmt = remix["credited_ip_owners"][0]["credit_statement"]
    assert "Original Composition & Recording" in credit_stmt
    assert "Aisha Okoro" in credit_stmt
    assert "Originally Created Beat" in credit_stmt

    # Attempting purchase prior to clearance MUST be blocked (403)
    blocked_buy = client.post(f"/api/dj/mixes/{remix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert blocked_buy.status_code == 403
    detail = blocked_buy.json()["detail"]
    assert detail["error"] == "Commercial sales locked"
    assert detail["creation_type"] == "remix_original_beat"
    assert "free to stream" in detail["message"].lower()

    # Streaming endpoint confirms promotional free streaming and accreditation
    stream_res = client.get(f"/api/dj/mixes/{remix_id}/stream")
    assert stream_res.status_code == 200
    stream_data = stream_res.json()
    assert stream_data["free_to_stream"] is True
    assert stream_data["streaming_mode"] == "free_promotional"
    assert stream_data["can_sell"] is False

    # 2. DISPATCH CLEARANCE:
    dispatch_res = client.post(f"/api/dj/mixes/{remix_id}/request-clearance", headers=auth_headers)
    assert dispatch_res.status_code == 200
    # Verify contract created has kind="dj_remix_clearance"
    contract = db.contracts.find_one({"linked_deal_id": remix_id, "kind": "dj_remix_clearance"})
    assert contract is not None
    assert "DJ Remix & Original Beat Production" in contract["title"]

    # 3. SIGN CLEARANCE:
    sign_res = client.post(
        f"/api/dj/mixes/{remix_id}/sign-clearance/trk_remix_og",
        json={"signer_name": "Aisha Okoro", "signer_email": "aisha@tunemavens.com"},
        headers=auth_headers
    )
    assert sign_res.status_code == 200
    sign_data = sign_res.json()
    assert sign_data["all_cleared"] is True
    cleared_remix = sign_data["mix"]

    # 4. POST-CLEARANCE CHECKS:
    # Now unlocked: can be sold AND streamed commercially!
    assert cleared_remix["sale_locked"] is False
    assert cleared_remix["can_sell"] is True
    assert cleared_remix["streaming_mode"] == "commercial"
    assert cleared_remix["status"] == "published"
    assert cleared_remix["clearance_policy"]["commercial_monetization_unlocked"] is True

    # 5. COMMERCIAL PURCHASE SUCCEEDS:
    # Revenue split cascade executes: 50% DJ Beat Producer / 40% Original Song IP Owner / 10% Platform fee
    buy_res = client.post(f"/api/dj/mixes/{remix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert buy_res.status_code == 200
    buy_result = buy_res.json()
    assert buy_result["status"] == "success"
    assert buy_result["price_paid"] == 4.00
    splits = buy_result["splits_distributed"]
    # DJ Beatmaker: 50% of 4.00 = 2.00
    assert splits["dj_payout"] == 2.00
    # Platform: 10% of 4.00 = 0.40
    assert splits["platform_fee"] == 0.40
    # Original Song IP Owner: 40% of 4.00 = 1.60
    assert splits["track_owners_pool"] == 1.60
    assert len(splits["track_allocations"]) == 1
    assert splits["track_allocations"][0]["allocated_amount"] == 1.60


def test_dj_entirely_own_original_creation_monetization(auth_headers, dj_user):
    """Test Requirement 3:
    DJ has a mix/creations that are entirely his own, and these can be monetized.
    Immediately published, sale_locked=False, monetized from day one with 90% sovereign payout.
    """
    create_payload = {
        "title": "Sovereign Modular Analog Beats Live Experience",
        "description": "Entirely original hardware synth and drum machine performance with 100% DJ-owned beats and compositions.",
        "genre": "Techno",
        "bpm_avg": 132,
        "duration_seconds": 1800,
        "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        "creation_type": "original_creation",
        "is_original_ip_only": True,
        "commercial_price": 6.00,
        "auto_extract_tracks": False,
        "tracklist": [
            {
                "id": "trk_self_1",
                "title": "Subharmonic Resonance (Original Beat)",
                "artist": "DJ Test Master",
                "ip_owner_name": "DJ Test Master",
                "ip_owner_email": "dj_curator_test@tunemavens.com",
                "start_time": 0,
                "end_time": 900,
                "duration_seconds": 900,
                "split_percentage": 50.0,
                "clearance_status": "self_owned"
            },
            {
                "id": "trk_self_2",
                "title": "Acid Grid Oscillation (Original Beat)",
                "artist": "DJ Test Master",
                "ip_owner_name": "DJ Test Master",
                "ip_owner_email": "dj_curator_test@tunemavens.com",
                "start_time": 900,
                "end_time": 1800,
                "duration_seconds": 900,
                "split_percentage": 50.0,
                "clearance_status": "self_owned"
            }
        ]
    }
    create_res = client.post("/api/dj/mixes", json=create_payload, headers=auth_headers)
    assert create_res.status_code == 200
    mix = create_res.json()
    mix_id = mix["id"]
    assert mix["creation_type"] == "original_creation"
    assert mix["is_original_ip_only"] is True
    assert mix["sale_locked"] is False
    assert mix["can_sell"] is True
    assert mix["status"] == "published"
    assert mix["clearance_policy"]["commercial_monetization_unlocked"] is True

    # Commercial purchase succeeds immediately without clearance delay
    buy_res = client.post(f"/api/dj/mixes/{mix_id}/purchase", json={"payment_method": "wallet"}, headers=auth_headers)
    assert buy_res.status_code == 200
    buy_data = buy_res.json()
    assert buy_data["status"] == "success"
    assert buy_data["price_paid"] == 6.00
    splits = buy_data["splits_distributed"]
    # 90% goes to DJ ($5.40) and 10% platform ($0.60)
    assert splits["dj_payout"] == 5.40
    assert splits["platform_fee"] == 0.60


def test_flexible_pricing_credit_policy_and_download_gate(auth_headers, dj_user):
    """Verifies recommended pricing, creator price adjustment, credit deduction, and download gating."""
    from routes.dj_mixes_router import reconcile_dj_mixes_and_assets

    # 1. Pricing recommendation endpoint
    rec_res = client.get("/api/dj/mixes/pricing-recommendation?duration_seconds=5400&creation_type=curated_mix")
    assert rec_res.status_code == 200
    rec = rec_res.json()
    assert rec["recommended_price_usd"] == 5.49
    assert rec["recommended_price_credits"] == 549
    assert rec["credits_per_usd"] == 100

    # 2. Create an uncleared mix without specifying price -> receives recommended price
    uncleared_res = client.post(
        "/api/dj/mixes",
        json={
            "title": "NairobiClub Sessions (Commercial Compilation Vol 2)",
            "genre": "Afro House",
            "duration_seconds": 3600,
            "audio_url": "/api/uploads/audio/enenda.wav",
            "creation_type": "curated_mix",
            "auto_extract_tracks": True,
        },
        headers=auth_headers,
    )
    assert uncleared_res.status_code == 200
    u_mix = uncleared_res.json()
    u_id = u_mix["id"]
    assert u_mix["sale_locked"] is True
    assert u_mix["commercial_price"] == 4.99
    assert u_mix["recommended_price"] == 4.99
    assert u_mix["price_credits"] == 499

    # 3. DJ adjusts their price freely via PUT /api/dj/mixes/{id}/pricing
    price_res = client.put(
        f"/api/dj/mixes/{u_id}/pricing",
        json={"commercial_price": 3.50},
        headers=auth_headers,
    )
    assert price_res.status_code == 200
    assert price_res.json()["commercial_price"] == 3.50
    assert price_res.json()["price_credits"] == 350

    # 4. Create a consumer buyer account to test credit policy & download gate
    buyer_email = "test_mix_buyer_policy@tunemavens.com"
    db.users.delete_many({"email": buyer_email})
    buyer_ins = db.users.insert_one({
        "email": buyer_email,
        "username": "test_mix_buyer_policy",
        "name": "Mix Policy Buyer",
        "role": "consumer",
        "credits": 500,
        "created_at": datetime.now(timezone.utc),
    })
    buyer_id = buyer_ins.inserted_id
    buyer_headers = {"Authorization": f"Bearer {create_access_token(sub=str(buyer_id))}"}

    try:
        # Uncleared mix download by non-owner consumer MUST be blocked (403)
        blocked_dl = client.get(f"/api/dj/mixes/{u_id}/download", headers=buyer_headers)
        assert blocked_dl.status_code == 403

        # Create a 100% original mix priced at $3.50 (350 credits)
        orig_res = client.post(
            "/api/dj/mixes",
            json={
                "title": "Neon Synthesizer Odyssey (100% Original Live Set)",
                "genre": "Electronic",
                "duration_seconds": 3600,
                "audio_url": "/api/uploads/audio/enenda.wav",
                "creation_type": "original_creation",
                "is_original_ip_only": True,
                "commercial_price": 3.50,
            },
            headers=auth_headers,
        )
        assert orig_res.status_code == 200
        o_id = orig_res.json()["id"]

        # Unpurchased download by consumer MUST return 402
        unpaid_dl = client.get(f"/api/dj/mixes/{o_id}/download", headers=buyer_headers)
        assert unpaid_dl.status_code == 402

        # Purchase deducts 350 credits from buyer's 500 credit wallet -> 150 remaining
        buy_ok = client.post(f"/api/dj/mixes/{o_id}/purchase", json={"payment_method": "wallet"}, headers=buyer_headers)
        assert buy_ok.status_code == 200
        assert buy_ok.json()["credits_charged"] == 350
        updated_buyer = db.users.find_one({"_id": buyer_id})
        assert updated_buyer["credits"] == 150

        # Idempotent re-purchase charges 0 credits
        rebuy = client.post(f"/api/dj/mixes/{o_id}/purchase", json={"payment_method": "wallet"}, headers=buyer_headers)
        assert rebuy.status_code == 200
        assert rebuy.json()["already_owned"] is True
        assert rebuy.json()["credits_charged"] == 0

        # Download now succeeds (200)
        paid_dl = client.get(f"/api/dj/mixes/{o_id}/download", headers=buyer_headers)
        assert paid_dl.status_code == 200
        assert paid_dl.json()["download_url"]
    finally:
        db.users.delete_many({"_id": buyer_id})
        db.dj_mixes.delete_one({"title": "NairobiClub Sessions (Commercial Compilation Vol 2)"})
        reconcile_dj_mixes_and_assets()



