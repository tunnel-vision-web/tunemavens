"""Integration tests for Track D: AI, CRM & CMS Expansion."""
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


def test_social_ai_endpoints():
    """Verify mock Image and Video promo generation pathways."""
    # Seed a test user
    user_email = "ai_tester@tunemavens.com"
    db.users.delete_many({"email": user_email})
    res = db.users.insert_one({
        "email": user_email,
        "name": "AI Tester",
        "roles": ["creator"],
        "plan": "professional",
    })
    user_id = str(res.inserted_id)
    auth_token = create_access_token(sub=user_id)
    cookies = {"access_token": auth_token}

    # 1. Generate Art (Success)
    art_res = client.post(
        "/api/social-ai/generate-art",
        json={"prompt": "Retro sunset synthwave cover", "aspect_ratio": "1:1"},
        cookies=cookies
    )
    assert art_res.status_code == 200
    art_data = art_res.json()
    assert art_data["status"] == "success"
    assert "media_url" in art_data["asset"]
    assert "seed/Retrosunsetsynth" in art_data["asset"]["media_url"]

    # 2. Generate Art (Validation Error)
    art_fail = client.post(
        "/api/social-ai/generate-art",
        json={"prompt": "   ", "aspect_ratio": "1:1"},
        cookies=cookies
    )
    assert art_fail.status_code == 400

    # 3. Generate Video (Success)
    video_res = client.post(
        "/api/social-ai/generate-video",
        json={"prompt": "Moody vinyl spinning close up", "duration_seconds": 5},
        cookies=cookies
    )
    assert video_res.status_code == 200
    video_data = video_res.json()
    assert video_data["status"] == "success"
    assert "media_url" in video_data["asset"]
    assert video_data["asset"]["media_url"].endswith(".mp4")

    # 4. List Assets
    list_res = client.get("/api/social-ai/assets", cookies=cookies)
    assert list_res.status_code == 200
    assets = list_res.json()
    assert len(assets) == 2
    art_asset = next(a for a in assets if a["media_type"] == "image")
    asset_id = art_asset["id"]

    # 5. Update Asset
    up_res = client.put(
        f"/api/social-ai/assets/{asset_id}",
        json={"prompt": "Updated Art Prompt"},
        cookies=cookies
    )
    assert up_res.status_code == 200
    assert up_res.json()["prompt"] == "Updated Art Prompt"

    # 6. Delete Asset
    del_res = client.delete(f"/api/social-ai/assets/{asset_id}", cookies=cookies)
    assert del_res.status_code == 200
    
    # 7. List Assets again (should be 1 remaining)
    list_res2 = client.get("/api/social-ai/assets", cookies=cookies)
    assert len(list_res2.json()) == 1


def test_crm_campaign_targeting_and_dispatch():
    """Verify CRM campaigns setup, list, and role cohort filters."""
    # Seed test users: one DJ, one Creator
    db.users.delete_many({"email": {"$in": ["dj_member@tunemavens.com", "creator_member@tunemavens.com"]}})
    
    dj_res = db.users.insert_one({
        "email": "dj_member@tunemavens.com",
        "name": "DJ Roster Member",
        "roles": ["dj"],
        "plan": "starter"
    })
    dj_id = str(dj_res.inserted_id)
    
    creator_res = db.users.insert_one({
        "email": "creator_member@tunemavens.com",
        "name": "Creator Roster Member",
        "roles": ["creator"],
        "plan": "starter"
    })
    creator_id = str(creator_res.inserted_id)

    # Auth token for the admin user who dispatches
    auth_token = create_access_token(sub=dj_id)
    cookies = {"access_token": auth_token}

    # 1. Create campaign targeting DJs only
    camp_res = client.post(
        "/api/crm/campaigns",
        json={
            "name": "DJ Pool Launch Announcement",
            "subject": "Exclusive DJ Pool Access Inside",
            "body": "Hi DJ, check out our new high-fidelity direct splits pool.",
            "target_roles": ["dj"]
        },
        cookies=cookies
    )
    assert camp_res.status_code == 200
    campaign = camp_res.json()
    campaign_id = campaign["id"]
    assert campaign["name"] == "DJ Pool Launch Announcement"

    # 2. List campaigns
    list_res = client.get("/api/crm/campaigns", cookies=cookies)
    assert list_res.status_code == 200
    campaigns = list_res.json()
    assert len(campaigns) > 0
    assert campaigns[0]["id"] == campaign_id

    # 3. Dispatch and check recipient matching logic
    dispatch_res = client.post(
        f"/api/crm/dispatch/{campaign_id}",
        cookies=cookies
    )
    assert dispatch_res.status_code == 200
    disp_data = dispatch_res.json()
    assert disp_data["status"] == "success"
    # Should target the DJ user only (1 recipient)
    assert disp_data["recipient_count"] == 1
    assert dj_id in disp_data["recipients"]
    assert creator_id not in disp_data["recipients"]


def test_cms_layout_versioning_and_rollbacks():
    """Verify CMS layouts configuration edits, version ticks, and rollback snaps."""
    # Seed a test user
    user_email = "cms_admin@tunemavens.com"
    db.users.delete_many({"email": user_email})
    res = db.users.insert_one({
        "email": user_email,
        "name": "CMS Admin",
        "roles": ["creator"],
        "plan": "enterprise",
    })
    user_id = str(res.inserted_id)
    auth_token = create_access_token(sub=user_id)
    cookies = {"access_token": auth_token}

    layout_id = "landing-hero-config"
    db.cms_layouts.delete_many({"layout_id": layout_id})
    db.cms_layout_history.delete_many({"layout_id": layout_id})

    # 1. Fetch layout (should return default placeholders if unconfigured)
    get_res = client.get(f"/api/cms/layouts/{layout_id}", cookies=cookies)
    assert get_res.status_code == 200
    assert get_res.json()["version"] == 1
    assert get_res.json()["data"]["hero_title"] == "TuneMavens Network"

    # 2. Update to Version 1 (Explicit data)
    v1_data = {"hero_title": "First Version Title", "accent": "cyan"}
    update_res = client.post(
        "/api/cms/layouts",
        json={"layout_id": layout_id, "data": v1_data},
        cookies=cookies
    )
    assert update_res.status_code == 200
    assert update_res.json()["version"] == 1
    assert update_res.json()["data"]["hero_title"] == "First Version Title"

    # 3. Update to Version 2 (Explicit data)
    v2_data = {"hero_title": "Second Version Title", "accent": "violet"}
    update_res_2 = client.post(
        "/api/cms/layouts",
        json={"layout_id": layout_id, "data": v2_data},
        cookies=cookies
    )
    assert update_res_2.status_code == 200
    assert update_res_2.json()["version"] == 2
    assert update_res_2.json()["data"]["hero_title"] == "Second Version Title"

    # 4. Get History ledger (Should see both versions)
    hist_res = client.get(f"/api/cms/layouts/{layout_id}/history", cookies=cookies)
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) == 2
    assert history[0]["version"] == 2
    assert history[1]["version"] == 1

    # 5. Rollback to Version 1 (Reverts active to Version 1 data, increments active to Version 3)
    rollback_res = client.post(
        f"/api/cms/layouts/{layout_id}/rollback/1",
        cookies=cookies
    )
    assert rollback_res.status_code == 200
    rollback_data = rollback_res.json()
    assert rollback_data["version"] == 3
    assert rollback_data["data"]["hero_title"] == "First Version Title"
