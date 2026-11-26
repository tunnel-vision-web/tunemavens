from __future__ import annotations

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app
from config import db

client = TestClient(app)


def test_admin_console_serves_events_rsvp_manager():
    res = client.get("/admin")
    assert res.status_code == 200
    assert "Events &amp; RSVP Manager" in res.text
    assert "view-events-rsvp" in res.text
    assert "evInputPaymentMode" in res.text
    assert "evInputSeating" in res.text
    assert "evInputStanding" in res.text
    assert "evInputGuestLimit" in res.text


def test_list_events_includes_paid_and_free_rsvp():
    res = client.get("/api/events")
    assert res.status_code == 200
    data = res.json()
    events = data["events"]
    modes = {e["payment_mode"] for e in events}
    assert "paid" in modes
    assert "free_rsvp" in modes
    assert data["macro_telemetry"]["free_rsvp_count"] >= 2

    res_free = client.get("/api/events?payment_mode=free_rsvp")
    assert res_free.status_code == 200
    free_events = res_free.json()["events"]
    assert len(free_events) >= 2
    assert all(e["payment_mode"] == "free_rsvp" for e in free_events)


def test_free_rsvp_strict_plus_1_and_capacity_enforcement():
    # Create a Free RSVP event with strict +1 limit and small seating/standing capacities
    create_res = client.post("/api/events", json={
        "title": "Strict +1 Studio Premiere",
        "artist": "Ndufo",
        "payment_mode": "free_rsvp",
        "seating_capacity": 4,
        "standing_capacity": 2,
        "guest_limit_policy": "strict_plus_1",
        "venue": "Wave Lab",
        "city": "Nairobi",
    })
    assert create_res.status_code == 201
    event = create_res.json()["event"]
    event_id = event["id"]
    assert event["payment_mode"] == "free_rsvp"
    assert event["seating_capacity"] == 4
    assert event["standing_capacity"] == 2
    assert event["capacity"] == 6
    assert event["guest_limit_policy"] == "strict_plus_1"
    assert event["max_additional_guests"] == 1

    # Paid ticket booking on free_rsvp event should be blocked
    book_res = client.post("/api/events/tickets/book", json={
        "event_id": event_id,
        "tier_id": "ga",
        "quantity": 1,
        "customer_name": "Test Fan",
        "customer_email": "fan@test.com",
    })
    assert book_res.status_code == 400

    # Strict +1 rejects +2 guests
    bad_rsvp = client.post("/api/events/rsvp", json={
        "event_id": event_id,
        "fan_name": "Over Limit Guest",
        "fan_email": "overlimit@test.com",
        "additional_guests": 2,
        "attendance_type": "seating",
    })
    assert bad_rsvp.status_code == 400
    assert "strict +1" in bad_rsvp.json()["detail"].lower()

    # Valid +1 seated RSVP (party of 2 -> seating 2/4)
    ok_rsvp = client.post("/api/events/rsvp", json={
        "event_id": event_id,
        "fan_name": "Jane Doe",
        "fan_email": "jane.doe@test.com",
        "additional_guests": 1,
        "attendance_type": "seating",
    })
    assert ok_rsvp.status_code == 200
    body = ok_rsvp.json()
    assert body["party_size"] == 2
    assert body["crm_synced"] is True
    assert body["rsvp_summary"]["seating_confirmed"] == 2
    assert body["rsvp_summary"]["seating_remaining"] == 2

    # Valid standing +1 RSVP (party of 2 -> standing 2/2)
    stand_rsvp = client.post("/api/events/rsvp", json={
        "event_id": event_id,
        "fan_name": "Sam Standing",
        "fan_email": "sam.standing@test.com",
        "additional_guests": 1,
        "attendance_type": "standing",
    })
    assert stand_rsvp.status_code == 200
    assert stand_rsvp.json()["rsvp_summary"]["standing_remaining"] == 0

    # Exceeding standing capacity should fail with 400
    stand_overflow = client.post("/api/events/rsvp", json={
        "event_id": event_id,
        "fan_name": "Late Standing",
        "fan_email": "late.standing@test.com",
        "additional_guests": 0,
        "attendance_type": "standing",
    })
    assert stand_overflow.status_code == 400
    assert "standing capacity" in stand_overflow.json()["detail"].lower()


def test_strict_plus_2_and_open_policy_plus_smart_crm_invitations():
    # Create strict +2 event
    create_res = client.post("/api/events", json={
        "title": "Strict +2 VIP Showcase",
        "artist": "Aisha Mwangi",
        "payment_mode": "free_rsvp",
        "seating_capacity": 10,
        "standing_capacity": 10,
        "guest_limit_policy": "strict_plus_2",
        "venue": "Karen Courtyard",
        "city": "Nairobi",
    })
    assert create_res.status_code == 201
    event_id = create_res.json()["event"]["id"]

    # Invite guest via Smart CRM
    inv_res = client.post(f"/api/events/{event_id}/invitations", json={
        "guests": [
            {
                "guest_name": "Invited VIP",
                "guest_email": "vip.invited@test.com",
                "role_tag": "Music Supervisor",
                "crm_channel": "email",
            }
        ]
    })
    assert inv_res.status_code == 201
    gl = inv_res.json()
    assert len(gl["invited_guests"]) == 1
    assert gl["invited_guests"][0]["status"] == "invited"

    # Reject +3 under strict_plus_2
    too_many = client.post(f"/api/events/{event_id}/rsvp", json={
        "event_id": event_id,
        "fan_name": "Invited VIP",
        "fan_email": "vip.invited@test.com",
        "additional_guests": 3,
        "attendance_type": "seating",
    })
    assert too_many.status_code == 400

    # Confirm invited guest with +2 (party of 3)
    confirm = client.post(f"/api/events/{event_id}/rsvp", json={
        "event_id": event_id,
        "fan_name": "Invited VIP",
        "fan_email": "vip.invited@test.com",
        "additional_guests": 2,
        "attendance_type": "seating",
    })
    assert confirm.status_code == 200
    assert confirm.json()["was_invited"] is True
    assert confirm.json()["party_size"] == 3

    # Verify Smart CRM guest list shows invited guest now confirmed
    gl_res = client.get(f"/api/events/{event_id}/guest-list")
    assert gl_res.status_code == 200
    gl_data = gl_res.json()
    assert gl_data["invited_guests"][0]["status"] == "confirmed"
    assert gl_data["confirmed_guests"][0]["party_size"] == 3
    assert gl_data["rsvp_summary"]["seating_confirmed"] == 3

    # Verify routed into Smart CRM collections (crm_fans & crm_leads)
    assert db.crm_fans.find_one({"email": "vip.invited@test.com"}) is not None
    lead = db.crm_leads.find_one({"email": "vip.invited@test.com", "event_id": event_id})
    assert lead is not None
    assert lead["status"] == "confirmed"
    assert lead["party_size"] == 3

    # Switch event policy to open via PATCH and allow +4 guests
    patch_res = client.patch(f"/api/events/{event_id}", json={
        "guest_limit_policy": "open",
        "seating_capacity": 20,
        "standing_capacity": 15,
    })
    assert patch_res.status_code == 200
    assert patch_res.json()["event"]["guest_limit_policy"] == "open"
    assert patch_res.json()["event"]["capacity"] == 35

    open_rsvp = client.post(f"/api/events/{event_id}/rsvp", json={
        "event_id": event_id,
        "fan_name": "Group Attendee",
        "fan_email": "group.fan@test.com",
        "additional_guests": 4,
        "attendance_type": "standing",
    })
    assert open_rsvp.status_code == 200
    assert open_rsvp.json()["party_size"] == 5
    assert open_rsvp.json()["rsvp_summary"]["standing_confirmed"] == 5


def test_featured_event_admin_only_and_guest_reconciliation():
    """Verify Admin-only single Featured Event across Home & Events + live guest list reconciliation + direct confirmation link."""
    # 1. Non-admin (anonymous or creator) cannot set featured event
    unauth = client.post("/api/events/evt-ndufo-album-listening-nairobi/feature")
    assert unauth.status_code == 403

    creator_client = TestClient(app)
    creator_client.post("/api/auth/demo?role=creator")
    creator_res = creator_client.post("/api/events/evt-ndufo-album-listening-nairobi/feature")
    assert creator_res.status_code == 403

    # 2. Admin can set a specific featured event
    admin_client = TestClient(app)
    admin_login = admin_client.post("/api/auth/demo?role=admin")
    assert admin_login.status_code == 200

    feat_set = admin_client.post("/api/events/evt-ndufo-album-listening-nairobi/feature")
    assert feat_set.status_code == 200
    assert feat_set.json()["featured_event"]["id"] == "evt-ndufo-album-listening-nairobi"
    assert feat_set.json()["featured_event"]["is_featured"] is True

    # Verify ONLY ONE event is featured across /api/events and /api/events/featured
    all_ev = client.get("/api/events").json()["events"]
    featured_list = [e for e in all_ev if e.get("is_featured")]
    assert len(featured_list) == 1
    assert featured_list[0]["id"] == "evt-ndufo-album-listening-nairobi"

    feat_get = client.get("/api/events/featured")
    assert feat_get.status_code == 200
    fe = feat_get.json()["featured_event"]
    assert fe["id"] == "evt-ndufo-album-listening-nairobi"
    assert fe.get("hosts")
    assert fe.get("mc")
    assert fe.get("entertainers")

    # 3. Direct confirmation page resolution works
    direct_res = client.get("/api/crm/reachout/resolve/direct?event_id=evt-ndufo-album-listening-nairobi&promo=event")
    assert direct_res.status_code == 200
    assert direct_res.json()["event"]["id"] == "evt-ndufo-album-listening-nairobi"
    assert direct_res.json()["is_preview"] is False

    # Restore default featured event so seeded state stays tidy
    admin_client.post("/api/events/evt-ndufo-nairobi-tonight/feature")
