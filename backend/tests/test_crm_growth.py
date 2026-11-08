from __future__ import annotations

import os
import sys

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from server import app
from config import db

client = TestClient(app)

def test_admin_app_serves_crm_growth_engine():
    """Verify backend admin console contains CRM & Growth Engine UI components."""
    res = client.get("/admin")
    assert res.status_code == 200
    assert "CRM &amp; Growth Engine" in res.text
    assert "view-crm-growth" in res.text
    assert "modalCreateCampaign" in res.text
    assert "loadCrmGrowth" in res.text


def test_crm_segments_endpoint():
    """Verify 12 cohort audience segments with MongoDB aggregation counts."""
    res = client.get("/api/crm/segments")
    assert res.status_code == 200
    data = res.json()
    assert "segments" in data
    assert "total_users" in data
    assert len(data["segments"]) == 12

    keys = [s["key"] for s in data["segments"]]
    assert "creator" in keys
    assert "dj" in keys
    assert "supervisor" in keys
    assert "vc" in keys
    assert "affiliate" in keys
    assert "unclaimed_inductees" in keys
    assert "luminaries" in keys


def test_crm_campaign_lifecycle_and_dispatch():
    """Verify creating, dispatching, and tracking a multi-channel growth campaign."""
    # 1. Create and dispatch immediately
    payload = {
        "title": "Automated Test Growth Blitz",
        "segment": "all_creators",
        "subject": "Exclusive Master Access for {{name}}",
        "body": "Hey {{name}}, check out our sync licensing opportunities!",
        "channels": ["email", "in_app", "social_dm"],
        "cta_label": "Claim Sync Deal",
        "cta_url": "/#/sync",
        "dispatch_now": True
    }
    create_res = client.post("/api/crm/campaigns", json=payload)
    assert create_res.status_code == 200
    camp = create_res.json()
    assert "id" in camp
    camp_id = camp["id"]
    assert camp["status"] == "dispatched"
    assert camp["recipient_count"] >= 0

    # 2. Verify campaign in list
    list_res = client.get("/api/crm/campaigns")
    assert list_res.status_code == 200
    campaigns = list_res.json()["campaigns"]
    found = [c for c in campaigns if c["id"] == camp_id]
    assert len(found) == 1

    # 3. Check sends tracker
    sends_res = client.get("/api/crm/sends")
    assert sends_res.status_code == 200
    sends_data = sends_res.json()
    assert "sends" in sends_data
    assert len(sends_data["sends"]) > 0

    # 4. Mark a social send as sent
    first_send = sends_data["sends"][0]
    send_id = first_send["id"]
    mark_res = client.post(f"/api/crm/sends/{send_id}/mark-social-sent")
    assert mark_res.status_code == 200
    assert mark_res.json()["marked"] == "sent"

    # 5. Delete test campaign
    del_res = client.delete(f"/api/crm/campaigns/{camp_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deleted_id"] == camp_id


def test_user_inbox_lifecycle():
    """Verify user in-app inbox message fetching, read state, and threaded reply."""
    # 1. Fetch inbox
    inbox_res = client.get("/api/inbox")
    assert inbox_res.status_code == 200
    inbox_data = inbox_res.json()
    assert "messages" in inbox_data
    assert "unread_count" in inbox_data
    messages = inbox_data["messages"]
    assert len(messages) > 0

    msg = messages[0]
    msg_id = msg["id"]

    # 2. Mark as read
    read_res = client.post(f"/api/inbox/{msg_id}/read")
    assert read_res.status_code == 200
    assert read_res.json()["status"] == "read"

    # 3. Threaded reply
    reply_payload = {"reply_text": "Thank you for the update! We are reviewing the sync brief."}
    reply_res = client.post(f"/api/inbox/{msg_id}/reply", json=reply_payload)
    assert reply_res.status_code == 200
    updated_msg = reply_res.json()["message"]
    assert "replies" in updated_msg
    assert len(updated_msg["replies"]) > 0
    assert updated_msg["replies"][-1]["text"] == reply_payload["reply_text"]
