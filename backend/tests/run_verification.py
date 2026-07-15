"""Verification runner script for the TuneMavens backend.

Imports the FastAPI app, initializes a TestClient, and verifies the response structures
of all requested endpoints by simulating local mock requests.
"""
from __future__ import annotations

import os
import sys
import logging
from datetime import datetime, timezone

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app
from auth import create_access_token
from config import db

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("run_verification")

client = TestClient(app)

def run_tests():
    logger.info("Starting verification runner...")
    errors = 0

    # 1. Seed Mock Data
    logger.info("Seeding database mock data for testing...")
    test_user_email = "verifier@tunemavens.com"
    db.users.delete_many({"email": test_user_email})
    user_res = db.users.insert_one({
        "email": test_user_email,
        "name": "Route Verifier",
        "role": "creator",
        "roles": ["creator", "admin"],  # Grant admin role to pass scan checks
        "plan": "starter",
        "credits": 600,
    })
    user_id = str(user_res.inserted_id)
    auth_token = create_access_token(sub=user_id)
    cookies = {"access_token": auth_token}
    logger.info(f"Seeded user: {test_user_email} (ID: {user_id})")

    # 2. Test /api/health
    logger.info("Testing /api/health...")
    try:
        response = client.get("/api/health")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "status" in data, "Missing 'status' in health check response"
        assert "mongo" in data, "Missing 'mongo' in health check response"
        logger.info(f"  [OK] /api/health -> status: {data['status']}, mongo: {data['mongo']}")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/health: {e}")
        errors += 1

    # 3. Test /api/sso/authorize
    logger.info("Testing /api/sso/authorize...")
    try:
        response = client.get(
            "/api/sso/authorize",
            params={
                "client_id": "syncmavens",
                "redirect_uri": "http://localhost:3002/callback",
                "response_type": "code",
            },
            cookies=cookies,
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "code" in data, "Missing 'code' in authorize response"
        assert "redirect_uri" in data, "Missing 'redirect_uri' in authorize response"
        logger.info(f"  [OK] /api/sso/authorize -> code: {data['code'][:10]}...")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/sso/authorize: {e}")
        errors += 1

    # 4. Test /api/payments/checkout-session
    logger.info("Testing /api/payments/checkout-session...")
    try:
        response = client.post(
            "/api/payments/checkout-session",
            json={
                "item_type": "subscription",
                "item_id": "professional",
                "quantity": 1,
            },
            cookies=cookies,
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "session_id" in data, "Missing 'session_id' in checkout response"
        assert "checkout_url" in data, "Missing 'checkout_url' in checkout response"
        logger.info(f"  [OK] /api/payments/checkout-session -> session_id: {data['session_id']}")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/payments/checkout-session: {e}")
        errors += 1

    # 5. Test /api/tickets/events (Create & List)
    logger.info("Testing /api/tickets/events...")
    event_id = None
    try:
        # Create event
        response = client.post(
            "/api/tickets/events",
            json={
                "title": "Verification Gala",
                "price": 25.0,
                "date": datetime.now(timezone.utc).isoformat(),
                "location": "Virtual Studio",
                "capacity": 200,
            },
            cookies=cookies,
        )
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        data = response.json()
        assert "_id" in data, "Missing '_id' in created event"
        event_id = data["_id"]
        logger.info(f"  [OK] POST /api/tickets/events -> Event ID: {event_id}")

        # List events
        response = client.get("/api/tickets/events")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        events = response.json()
        assert isinstance(events, list), "Expected list of events"
        logger.info(f"  [OK] GET /api/tickets/events -> Found {len(events)} events")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/tickets/events: {e}")
        errors += 1

    # 6. Test /api/tickets/scan
    logger.info("Testing /api/tickets/scan...")
    try:
        # Seed a mock ticket first
        qr_token = "TKT-VERIFY12345"
        db.tickets.delete_many({"qr_token": qr_token})
        db.tickets.insert_one({
            "event_id": event_id or "mock_event",
            "user_id": user_id,
            "qr_token": qr_token,
            "scanned": False,
            "scanned_at": None,
            "purchased_at": datetime.now(timezone.utc),
        })

        response = client.post(
            "/api/tickets/scan",
            json={"qr_token": qr_token},
            cookies=cookies,
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["status"] == "validated", "Expected status to be validated"
        assert "buyer_name" in data, "Missing 'buyer_name' in scan response"
        logger.info(f"  [OK] /api/tickets/scan -> status: {data['status']}, buyer: {data['buyer_name']}")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/tickets/scan: {e}")
        errors += 1

    # 7. Test /api/distro/generate-isrc
    logger.info("Testing /api/distro/generate-isrc...")
    try:
        response = client.post("/api/distro/generate-isrc", cookies=cookies)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "isrc" in data, "Missing 'isrc' in generator response"
        assert data["isrc"].startswith("KE-TM1-26-"), f"Invalid ISRC format: {data['isrc']}"
        logger.info(f"  [OK] /api/distro/generate-isrc -> isrc: {data['isrc']}")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/distro/generate-isrc: {e}")
        errors += 1

    # 8. Test /api/stream/{release_id}
    logger.info("Testing /api/stream/1...")
    try:
        # Seed a mock release with ID "1" in the database
        db.releases.delete_many({"_id": "1"})
        db.releases.insert_one({
            "_id": "1",
            "user_id": user_id,
            "title": "Verification Track",
            "artist": "Verifier",
            "genre": "Synthwave",
            "audio_url": "http://localhost:8001/uploads/verify.mp3",
            "status": "DRAFT",
            "created_at": datetime.now(timezone.utc),
        })

        response = client.get("/api/stream/1", cookies=cookies)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        logger.info("  [OK] /api/stream/1 -> Audio preview stream successfully initiated")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/stream/1: {e}")
        errors += 1

    # 9. Test /api/match/simulate
    logger.info("Testing /api/match/simulate...")
    try:
        response = client.post(
            "/api/match/simulate",
            json={
                "brief_id": "brief_1",
                "track_metadata": {
                    "genre": "Synthwave",
                    "mood": "Action",
                    "bpm": 110,
                },
            },
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "match_score" in data, "Missing 'match_score' in simulation response"
        assert "breakdown" in data, "Missing 'breakdown' in simulation response"
        logger.info(f"  [OK] /api/match/simulate -> score: {data['match_score']}%")
    except AssertionError as e:
        logger.error(f"  [FAIL] /api/match/simulate: {e}")
        errors += 1

    # Clean up seeded mock data
    logger.info("Cleaning up seeded database mock data...")
    db.users.delete_many({"email": test_user_email})
    db.tickets.delete_many({"qr_token": "TKT-VERIFY12345"})
    db.releases.delete_many({"_id": "1"})
    db.events.delete_many({"title": "Verification Gala"})

    if errors == 0:
        logger.info("Verification runner completed successfully. All routes operational!")
        sys.exit(0)
    else:
        logger.error(f"Verification runner completed with {errors} failures.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
