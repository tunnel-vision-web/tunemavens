"""Comprehensive Test Suite for Track D: AI, CRM & CMS Expansion.

Tests:
1. Social AI format recommendations (9:16, 1:1, 16:9), promotional caption generator, and YouTube Data API v3 showcases.
2. Multi-channel CRM campaign creation, targeted cohort dispatch, user inbox message retrieval, and read status updates.
"""
import os
import sys
import pytest
from fastapi.testclient import TestClient
from bson import ObjectId

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server import app
from config import db
from auth import create_access_token, hash_password

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_users():
    """Seed test user & creator cohort in MongoDB."""
    test_email = "track_d_admin@intermaven.io"
    db.users.delete_many({"email": test_email})
    
    user_doc = {
        "email": test_email,
        "password_hash": hash_password("TrackDPass123!"),
        "name": "Track D Admin",
        "role": "admin",
        "roles": ["admin", "creator"],
        "plan": "pro",
        "credits": 2000,
    }
    res = db.users.insert_one(user_doc)
    user_id = str(res.inserted_id)
    token = create_access_token(sub=user_id)
    
    yield {"user_id": user_id, "token": token, "email": test_email}
    
    db.users.delete_many({"email": test_email})


def test_social_ai_recommendations_captions_and_youtube():
    """Test format recommendations, caption generation, and YouTube Data API v3 channel metrics."""
    # 1. Format Recommendation for TikTok & Reels (9:16)
    rec_res = client.post(
        "/api/social-ai/recommendations",
        json={"platform": "tiktok", "content_type": "album_teaser"},
    )
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    assert rec_data["recommended_aspect_ratio"] == "9:16"
    assert "#fyp" in rec_data["recommended_hashtags"]

    # 2. AI Caption Generator
    cap_res = client.post(
        "/api/social-ai/generate-caption",
        json={
            "track_title": "Nairobi Odyssey",
            "artist": "Kip & The Mavens",
            "mood": "energetic",
            "platform": "instagram",
        },
    )
    assert cap_res.status_code == 200
    cap_data = cap_res.json()
    assert "Nairobi Odyssey" in cap_data["generated_caption"]
    assert "#TuneMavens" in cap_data["hashtags"]

    # 3. YouTube Data API v3 Channel Stats
    yt_res = client.get("/api/social-ai/youtube/channel/UC123456789")
    assert yt_res.status_code == 200
    yt_data = yt_res.json()
    assert "subscriber_count" in yt_data
    assert yt_data["subscriber_count"] > 0

    # 4. YouTube Featured Showcase
    feat_res = client.get("/api/social-ai/youtube/featured")
    assert feat_res.status_code == 200
    assert len(feat_res.json()["showcase"]) > 0


def test_crm_campaign_dispatch_and_user_inbox(setup_test_users):
    """Test campaign creation, cohort dispatch, internal inbox message generation, and read status."""
    user = setup_test_users
    
    # 1. Create Campaign
    cmp_res = client.post(
        "/api/crm/campaigns",
        json={
            "name": "SyncMavens Placement Brief Blast",
            "subject": "New Exclusive Film & TV Sync Brief Available",
            "body": "Submit your tracks for the Cyberpunk Drama soundtrack now!",
            "target_roles": ["creator", "admin"],
        },
        cookies={"access_token": user["token"]},
    )
    assert cmp_res.status_code == 200
    cmp_data = cmp_res.json()
    campaign_id = cmp_data["id"]
    
    # 2. Dispatch Campaign
    disp_res = client.post(
        f"/api/crm/dispatch/{campaign_id}",
        cookies={"access_token": user["token"]},
    )
    assert disp_res.status_code == 200
    assert disp_res.json()["recipient_count"] > 0
    
    # 3. User Inbox Lookup
    inbox_res = client.get(
        "/api/crm/inbox",
        cookies={"access_token": user["token"]},
    )
    assert inbox_res.status_code == 200
    inbox_msgs = inbox_res.json()
    assert len(inbox_msgs) > 0
    msg = inbox_msgs[0]
    msg_id = msg["_id"]
    assert msg["read"] is False
    
    # 4. Mark Message as Read
    read_res = client.post(
        f"/api/crm/inbox/{msg_id}/read",
        cookies={"access_token": user["token"]},
    )
    assert read_res.status_code == 200
    assert read_res.json()["read"] is True
    
    # Clean up test campaign & inbox messages
    db.crm_campaigns.delete_one({"_id": ObjectId(campaign_id)})
    db.user_inbox.delete_many({"user_id": user["user_id"]})
