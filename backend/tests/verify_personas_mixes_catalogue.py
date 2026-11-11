import sys
import os
import uuid
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from server import app
from config import db
from auth import create_access_token

client = TestClient(app)

def test_all_10_personas_registration():
    print("\n--- 1. Testing Registration for All Personas ---")
    personas = [
        ("consumer", "consumer"),
        ("creator", "creator"),
        ("label", "label"),
        ("dj", "dj"),
        ("podcaster", "podcaster"),
        ("vc", "vc"),
        ("supervisor", "supervisor"),
        ("studio", "supervisor"),
        ("media_house", "media_house"),
        ("media", "media_house"),
        ("corporate", "corporate"),
        ("affiliate", "affiliate")
    ]
    
    for input_role, expected_role in personas:
        uid = uuid.uuid4().hex[:6]
        payload = {
            "email": f"test_{input_role}_{uid}@example.com",
            "password": "Password123!",
            "name": f"Test {input_role.capitalize()}",
            "role": input_role,
            "brand_name": f"{input_role} Brand",
            "country": "KE"
        }
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 200, f"Registration failed for {input_role}: {res.text}"
        data = res.json()
        assert "token" in data or "access_token" in data
        user_info = data.get("user", {})
        norm_role = user_info.get("role")
        assert norm_role == expected_role, f"Expected role {expected_role}, got {norm_role}"
        print(f"  [OK] {input_role} registered successfully -> normalized role: {norm_role}")

def test_dj_mix_creation_with_tracklist():
    print("\n--- 2. Testing DJ Mix Upload with Tracklist & Clearances ---")
    # Simulate a DJ uploading a mix with tracks
    mix_payload = {
        "title": "Nairobi Sunset Afro-House Session Vol. 1",
        "description": "High-octane afro-house mix featuring verified local producers",
        "audio_url": "https://storage.tunemavens.com/mixes/nairobi_sunset.mp3",
        "artwork_url": "https://storage.tunemavens.com/art/nairobi_sunset.jpg",
        "genre": "Afro-House",
        "bpm": 124,
        "duration_seconds": 3600,
        "is_original_ip": False,
        "commercial_use_allowed": True,
        "price": 4.99,
        "currency": "USD",
        "tracklist": [
            {
                "title": "Kilifi Groove",
                "artist": "Ayrosh",
                "start_time": 0,
                "end_time": 300,
                "duration_seconds": 300,
                "ip_owner_email": "ayrosh@gmail.com",
                "split_percentage": 50.0
            },
            {
                "title": "Savannah Beat",
                "artist": "Blinky Bill",
                "start_time": 300,
                "end_time": 600,
                "duration_seconds": 300,
                "ip_owner_email": "blinky@gmail.com",
                "split_percentage": 50.0
            }
        ],
        "auto_extract_tracks": False
    }

    # Test without auth (sandbox fallback)
    res_no_auth = client.post("/api/dj/mixes", json=mix_payload)
    assert res_no_auth.status_code == 200, f"Mix creation without auth failed: {res_no_auth.text}"
    mix_data = res_no_auth.json()
    mix_id = mix_data.get("id") or mix_data.get("_id")
    tracklist = mix_data.get("tracklist", [])
    assert len(tracklist) == 2, f"Expected 2 tracks, got {len(tracklist)}"
    assert tracklist[0]["title"] == "Kilifi Groove"
    assert tracklist[0]["clearance_status"] == "pending"
    print(f"  [OK] Mix created via fallback auth (Mix ID: {mix_id}) with {len(tracklist)} tracks retained!")

    # Test clearance request trigger
    req_res = client.post(f"/api/dj/mixes/{mix_id}/request-clearance")
    assert req_res.status_code == 200, f"Request clearances failed: {req_res.text}"
    req_data = req_res.json()
    assert req_data["status"] == "success"
    print(f"  [OK] Clearance requests dispatched to track rights-holders!")

def test_catalogue_machine_ingestion():
    print("\n--- 3. Testing Catalogue Machine Wizard Ingest ---")
    artist_uid = uuid.uuid4().hex[:6]
    subdomain = f"testartist_{artist_uid}"
    ingest_payload = {
        "subdomain": subdomain,
        "project": {
            "title": "Rift Valley Echoes EP",
            "type": "EP",
            "genre": "Afro-Electronic",
            "year": "2026",
            "coverArt": "https://storage.tunemavens.com/covers/rift_valley.jpg",
            "artist": f"Kenia Sonics {artist_uid}"
        },
        "tracks": [
            {
                "title": "Geothermal Pulse",
                "audioUrl": "https://storage.tunemavens.com/audio/geothermal_pulse.flac",
                "trackNumber": 1,
                "duration": "3:35",
                "isrc": f"KE-TM1-26-{artist_uid[:5]}1",
                "genre": "Afro-Electronic",
                "writers": [
                    {"name": f"Kenia Sonics {artist_uid}", "role": "Composer / Lyricist", "split": 70, "email": "artist@example.com"}
                ],
                "producers": [
                    {"name": "Studio Master", "role": "Producer", "split": 30, "email": "producer@example.com"}
                ]
            },
            {
                "title": "Lake Naivasha Breeze",
                "audioUrl": "https://storage.tunemavens.com/audio/lake_naivasha.flac",
                "trackNumber": 2,
                "duration": "4:08",
                "isrc": f"KE-TM1-26-{artist_uid[:5]}2",
                "genre": "Afro-Electronic",
                "writers": [
                    {"name": f"Kenia Sonics {artist_uid}", "role": "Composer / Lyricist", "split": 70, "email": "artist@example.com"}
                ],
                "producers": [
                    {"name": "Studio Master", "role": "Producer", "split": 30, "email": "producer@example.com"}
                ]
            }
        ]
    }

    res = client.post("/api/catalog/wizard-ingest", json=ingest_payload)
    assert res.status_code == 200, f"Catalogue wizard ingest failed: {res.text}"
    data = res.json()
    assert data["status"] == "success"
    assert data["ingestedCount"] == 2
    print(f"  [OK] Catalogue wizard ingest successful: Release '{data['release']}', {data['ingestedCount']} tracks ingested!")

    # Verify tracks in database
    db_catalog = db.catalog_tracks.find_one({"subdomain": subdomain})
    assert db_catalog is not None, "Catalog tracks record not found in MongoDB"
    assert len(db_catalog.get("tracks", [])) >= 2, "Expected at least 2 tracks in MongoDB catalog record"
    print(f"  [OK] Verified tracks persisted in db.catalog_tracks for subdomain '{subdomain}' with synchronized metadata!")

if __name__ == "__main__":
    test_all_10_personas_registration()
    test_dj_mix_creation_with_tracklist()
    test_catalogue_machine_ingestion()
    print("\n==========================================")
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!")
    print("==========================================")
