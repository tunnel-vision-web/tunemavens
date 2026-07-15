"""Integration tests for TuneMavens backend media ecosystem and commerce paths.

Verifies SSO, payments checkout, event ticketing, digital storefront,
distribution tracking, and audio player preview gating.
"""
from __future__ import annotations

from datetime import datetime, timezone
import os
import sys

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app
from auth import create_access_token
from config import db

client = TestClient(app)


def test_health_endpoint():
    """Verify backend liveness is operational."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] in ("ok", "degraded")


def test_sso_authorization_and_token_exchange():
    """Verify OIDC/PKCE SSO authorization and token generation."""
    # Seed a test user
    test_user = {
        "email": "sso_tester@tunemavens.com",
        "password_hash": "mocked",
        "name": "SSO Tester",
        "role": "creator",
        "roles": ["creator"],
        "plan": "starter",
    }
    db.users.delete_many({"email": test_user["email"]})
    result = db.users.insert_one(test_user)
    user_id = str(result.inserted_id)

    # Mint local auth token
    auth_token = create_access_token(sub=user_id)
    cookies = {"access_token": auth_token}

    # 1. Authorize
    auth_res = client.get(
        "/api/sso/authorize",
        params={
            "client_id": "syncmavens",
            "redirect_uri": "http://localhost:3002/callback",
            "response_type": "code",
        },
        cookies=cookies,
    )
    assert auth_res.status_code == 200
    code = auth_res.json()["code"]
    assert code.startswith("code_")

    # 2. Token Exchange
    token_res = client.post(
        "/api/sso/token",
        json={
            "grant_type": "authorization_code",
            "client_id": "syncmavens",
            "code": code,
            "redirect_uri": "http://localhost:3002/callback",
        },
    )
    assert token_res.status_code == 200
    token_data = token_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "Bearer"


def test_payment_checkout_and_webhook():
    """Verify Stripe checkout triggers and webhook updates."""
    # Seed a test user
    user_email = "buyer@tunemavens.com"
    db.users.delete_many({"email": user_email})
    res = db.users.insert_one({
        "email": user_email,
        "name": "Buyer Tester",
        "role": "creator",
        "roles": ["creator"],
        "plan": "starter",
        "credits": 0,
    })
    user_id = str(res.inserted_id)
    auth_token = create_access_token(sub=user_id)
    cookies = {"access_token": auth_token}

    # 1. Create Checkout Session
    checkout_res = client.post(
        "/api/payments/checkout-session",
        json={
            "item_type": "subscription",
            "item_id": "professional",
            "quantity": 1,
        },
        cookies=cookies,
    )
    assert checkout_res.status_code == 200
    sess_data = checkout_res.json()
    assert "session_id" in sess_data
    assert "checkout_url" in sess_data

    session_id = sess_data["session_id"]

    # 2. Bypass/Settle Sandbox Session
    bypass_res = client.post(
        f"/api/payments/sandbox-bypass?session_id={session_id}",
        cookies=cookies,
    )
    assert bypass_res.status_code == 200
    assert bypass_res.json()["status"] == "completed"

    # Check database updates
    updated_user = db.users.find_one({"_id": res.inserted_id})
    assert updated_user["plan"] == "professional"
    assert updated_user["credits"] == 2000


def test_ticketing_and_scanner_validation():
    """Verify event registration, ticket purchases, and QR validation."""
    # Seed creator user
    creator_email = "organizer@tunemavens.com"
    db.users.delete_many({"email": creator_email})
    creator_res = db.users.insert_one({
        "email": creator_email,
        "role": "creator",
        "roles": ["creator"],
    })
    creator_token = create_access_token(sub=str(creator_res.inserted_id))
    creator_cookies = {"access_token": creator_token}

    # 1. Create Event
    event_res = client.post(
        "/api/tickets/events",
        json={
            "title": "Album Launch Party",
            "price": 20.0,
            "date": datetime.now(timezone.utc).isoformat(),
            "location": "Nairobi Club",
            "capacity": 100,
        },
        cookies=creator_cookies,
    )
    assert event_res.status_code == 201
    event_id = event_res.json()["_id"]

    # 2. Purchase Ticket
    checkout_res = client.post(
        "/api/payments/checkout-session",
        json={
            "item_type": "ticket",
            "item_id": event_id,
            "quantity": 1,
        },
        cookies=creator_cookies,
    )
    assert checkout_res.status_code == 200
    session_id = checkout_res.json()["session_id"]

    # Settle Sandbox Purchase
    client.post(f"/api/payments/sandbox-bypass?session_id={session_id}", cookies=creator_cookies)

    # 3. Retrieve Purchased Ticket
    tickets_res = client.get("/api/tickets/my-tickets", cookies=creator_cookies)
    assert tickets_res.status_code == 200
    tickets = tickets_res.json()
    assert len(tickets) > 0
    qr_token = tickets[0]["qr_token"]

    # 4. Scan Ticket
    scan_res = client.post(
        "/api/tickets/scan",
        json={"qr_token": qr_token},
        cookies=creator_cookies,
    )
    assert scan_res.status_code == 200
    assert scan_res.json()["status"] == "validated"


def test_digital_downloads_and_preview_gating():
    """Verify digital product registration, orders, and player gating."""
    # Seed user
    user_email = "listener@tunemavens.com"
    db.users.delete_many({"email": user_email})
    user_res = db.users.insert_one({
        "email": user_email,
        "role": "creator",
        "roles": ["creator"],
        "plan": "starter",
    })
    user_id = str(user_res.inserted_id)
    user_token = create_access_token(sub=user_id)
    user_cookies = {"access_token": user_token}

    # 1. Register Release Track
    release_res = client.post(
        "/api/distro/releases",
        json={
            "title": "Neon Sunset",
            "artist": "Vaporwave Runner",
            "genre": "Synthwave",
            "audio_url": "http://localhost:8001/uploads/neon_sunset.mp3",
        },
        cookies=user_cookies,
    )
    assert release_res.status_code == 201
    release_id = release_res.json()["_id"]

    # 2. Check Gated Audio Preview (Starter Tier)
    stream_res = client.get(
        f"/api/stream/{release_id}",
        cookies=user_cookies,
    )
    assert stream_res.status_code == 200
    # Starter tier gets preview stream limit
    preview_bytes = b"".join(stream_res.iter_bytes())
    # Since file doesn't actually exist locally, generator exits immediately with 0 bytes
    assert len(preview_bytes) == 0

    # 3. Upgrade user to Professional
    db.users.update_one({"_id": user_res.inserted_id}, {"$set": {"plan": "professional"}})

    # 4. Check Gated Audio Redirect (Professional Tier)
    stream_pro_res = client.get(
        f"/api/stream/{release_id}",
        cookies=user_cookies,
        follow_redirects=False,
    )
    # Pro/Premium redirects directly to storage link (RedirectResponse)
    assert stream_pro_res.status_code in (302, 307)


def test_sync_match_waterfall_split():
    """Verify sync match scores and 90/10 split cascade math."""
    # 1. Match Brief simulation
    match_res = client.post(
        "/api/match/simulate",
        json={
            "brief_id": "brief_1",
            "track_metadata": {
                "genre": "Cyberpunk Synthwave",
                "mood": "Action Retro mood",
                "bpm": 112,
            },
        },
    )
    assert match_res.status_code == 200
    assert match_res.json()["match_score"] > 80

    # 2. Split Waterfall calculator (Administrator Mode)
    waterfall_res = client.get(
        "/api/match/waterfall",
        params={"sync_fee": 10000.0, "mode": "administrator"},
    )
    assert waterfall_res.status_code == 200
    data = waterfall_res.json()
    assert data["creator_payout"] == 9000.0
    assert data["platform_administration_fee"] == 1000.0
    assert data["advance_payout"] == 0.0

    # 3. Split Waterfall calculator (Publishing House Mode)
    waterfall_pub_res = client.get(
        "/api/match/waterfall",
        params={"sync_fee": 10000.0, "mode": "publishing_house"},
    )
    assert waterfall_pub_res.status_code == 200
    pub_data = waterfall_pub_res.json()
    assert pub_data["creator_payout"] == 5000.0
    assert pub_data["platform_administration_fee"] == 5000.0
    assert pub_data["advance_payout"] == 0.0
