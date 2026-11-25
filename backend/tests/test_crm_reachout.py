"""Comprehensive tests for Smart CRM Email-Only Target Groups, Event/Product Reachouts,
Direct RSVP & Ticket Email CTAs, Affiliate Attribution Funnel, and Dual Notifications
(In-App Inbox + Registered Email on File).
"""
from __future__ import annotations

import os
import sys
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app
from config import db

client = TestClient(app)


def test_target_group_crud_and_email_only_policy():
    """Requirement 1: Email-only Target Groups CRUD (add/edit/delete entries) and rejection of phone/WhatsApp."""
    # 1. Reject phone number in target group entry
    bad_res = client.post(
        "/api/crm/target-groups",
        json={
            "name": "Invalid Phone Group",
            "entries": [{"name": "Test User", "email": "test@example.com", "phone": "+254700000000"}],
        },
    )
    assert bad_res.status_code == 400
    assert "not permitted" in bad_res.json()["detail"].lower()

    # 2. Reject SMS / WhatsApp channels on campaign creation
    bad_chan = client.post(
        "/api/crm/campaigns",
        json={
            "title": "Blocked WhatsApp Blast",
            "subject": "Hello",
            "body": "Body",
            "channels": ["whatsapp"],
        },
    )
    assert bad_chan.status_code == 400
    assert "email only" in bad_chan.json()["detail"].lower()

    # 3. Create valid email-only target group
    create_res = client.post(
        "/api/crm/target-groups",
        json={
            "name": "Nairobi Afrobeats VIP List",
            "description": "Email-only fan & curator group",
            "entries": [
                {"name": "Wanjiku Mwangi", "email": "wanjiku.vip@example.com"},
                {"name": "Brian Otieno", "email": "brian.vip@example.com"},
            ],
        },
    )
    assert create_res.status_code == 201
    group = create_res.json()
    group_id = group["id"]
    assert group["channel_policy"] == "email_only"
    assert group["member_count"] == 2

    # 4. Add a new entry
    add_res = client.post(
        f"/api/crm/target-groups/{group_id}/entries",
        json={"name": "Aisha Kamau", "email": "aisha.vip@example.com"},
    )
    assert add_res.status_code == 201
    assert add_res.json()["group"]["member_count"] == 3
    aisha_entry_id = add_res.json()["added"][0]["id"]

    # 5. Edit an entry
    edit_res = client.put(
        f"/api/crm/target-groups/{group_id}/entries/{aisha_entry_id}",
        json={"name": "Aisha Kamau-Updated", "email": "aisha.updated@example.com"},
    )
    assert edit_res.status_code == 200
    assert edit_res.json()["entry"]["name"] == "Aisha Kamau-Updated"
    assert edit_res.json()["entry"]["email"] == "aisha.updated@example.com"

    # 6. Delete an entry
    del_ent_res = client.delete(f"/api/crm/target-groups/{group_id}/entries/{aisha_entry_id}")
    assert del_ent_res.status_code == 200
    assert del_ent_res.json()["group"]["member_count"] == 2

    # 7. Edit group metadata & delete group
    upd_res = client.put(f"/api/crm/target-groups/{group_id}", json={"name": "Nairobi VIP Updated"})
    assert upd_res.status_code == 200
    assert upd_res.json()["name"] == "Nairobi VIP Updated"

    del_grp = client.delete(f"/api/crm/target-groups/{group_id}")
    assert del_grp.status_code == 200


def test_event_reachout_full_affiliate_funnel_and_dual_notifications():
    """Requirements 2, 3, 4, 5:
    - Affiliate initiates Event Reachout to an Email-Only Target Group.
    - Dispatched email contains direct RSVP & Buy Ticket CTAs + New User Onboarding CTA.
    - Recipient clicks link -> click tracked + 90-day cookies + platform intro returned.
    - Recipient RSVPs -> affiliate gets In-App Inbox + Registered Email notification.
    - Recipient onboards with saved preferences -> user linked + affiliate gets In-App Inbox + Registered Email.
    - Onboarded user later buys a ticket (without passing ref_code!) -> commission attributed + affiliate gets
      In-App Inbox + Registered Email notification.
    """
    uid = uuid.uuid4().hex[:6]
    aff_ref = f"AFFTEST-{uid.upper()}"
    aff_email = f"affiliate.{uid}@example.com"
    recipient_email = f"fan.{uid}@example.com"
    recipient_name = f"Kendi Fan {uid}"

    # 0. Seed a clean affiliate account
    db.affiliates.insert_one({
        "id": f"aff_{uid}",
        "name": f"Zawadi Partner {uid}",
        "email": aff_email,
        "handle": f"@zawadi_{uid}",
        "ref_code": aff_ref,
        "tier": "partner",
        "status": "active",
        "payout_method": "mpesa",
        "clicks_count": 0,
        "conversions_count": 0,
        "onboardings_count": 0,
        "rsvps_count": 0,
        "total_gmv": 0.0,
        "total_earnings": 0.0,
        "pending_payout": 0.0,
        "paid_payout": 0.0,
    })

    # Find an existing paid event and a free_rsvp event from /api/events
    ev_res = client.get("/api/events")
    assert ev_res.status_code == 200
    ev_payload = ev_res.json()
    events = ev_payload if isinstance(ev_payload, list) else ev_payload.get("events", [])
    assert len(events) > 0
    paid_event = next((e for e in events if e.get("payment_mode") != "free_rsvp" and e.get("tiers")), events[0])
    rsvp_event = next((e for e in events if e.get("payment_mode") == "free_rsvp"), events[0])

    # 1. Create Email-Only Target Group owned by this affiliate
    tg_res = client.post(
        "/api/crm/target-groups",
        json={
            "name": f"Event VIP Group {uid}",
            "affiliate_ref_code": aff_ref,
            "entries": [{"name": recipient_name, "email": recipient_email}],
        },
    )
    assert tg_res.status_code == 201
    group_id = tg_res.json()["id"]

    # 2. Create & dispatch an Event Reachout with direct RSVP & Buy Ticket CTAs
    camp_res = client.post(
        "/api/crm/campaigns",
        json={
            "title": f"Live Event Reachout {uid}",
            "target_group_id": group_id,
            "affiliate_ref_code": aff_ref,
            "promotion_type": "event",
            "event_id": rsvp_event["id"],
            "event_ctas": ["rsvp", "ticket"],
            "subject": "You're Invited {{name}} to {{event_title}}!",
            "body": "Hi {{name}}, join us live at {{event_venue}} on {{event_date}}!",
            "channels": ["email"],
            "dispatch_now": True,
        },
    )
    assert camp_res.status_code == 200
    camp_data = camp_res.json()
    assert camp_data["status"] == "dispatched"
    assert camp_data["affiliate_ref_code"] == aff_ref
    assert camp_data["recipient_count"] == 1
    assert len(camp_data["reachout_tokens"]) == 1

    token_info = camp_data["reachout_tokens"][0]
    token = token_info["token"]
    assert "action=rsvp" in token_info["urls"]["rsvp"]
    assert "action=ticket" in token_info["urls"]["ticket"]
    assert "action=onboard" in token_info["urls"]["onboard"]

    # Verify dispatched email HTML in outbox has direct RSVP, Buy Ticket, and Onboarding CTAs
    outbox_doc = db.email_outbox.find_one({"to": recipient_email, "metadata.reachout_token": token})
    assert outbox_doc is not None
    assert "RSVP Now" in outbox_doc["html"]
    assert "Buy Ticket Now" in outbox_doc["html"]
    assert "New to TuneMavens?" in outbox_doc["html"]

    # 3. Recipient clicks tracked link -> click tracked + cookies + platform intro
    resolve_res = client.get(f"/api/crm/reachout/resolve/{token}")
    assert resolve_res.status_code == 200
    resolved = resolve_res.json()
    assert resolved["recipient"]["email"] == recipient_email
    assert resolved["affiliate"]["ref_code"] == aff_ref
    assert "platform_intro" in resolved
    assert resolved["clicks"] >= 1
    assert resolve_res.cookies.get("tm_aff_ref") == aff_ref
    assert resolve_res.cookies.get("tm_reachout_token") == token

    # 4. Recipient RSVPs via the reachout link
    rsvp_res = client.post(
        f"/api/events/{rsvp_event['id']}/rsvp",
        json={
            "event_id": rsvp_event["id"],
            "fan_name": recipient_name,
            "fan_email": recipient_email,
            "attendance_type": "seating",
            "additional_guests": 0,
            "reachout_token": token,
            "ref_code": aff_ref,
        },
    )
    assert rsvp_res.status_code == 200

    # 5. Recipient onboards as a new user with saved preferences
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": recipient_email,
            "password": "Password123!",
            "name": recipient_name,
            "role": "consumer",
            "ref_code": aff_ref,
            "reachout_token": token,
            "preferences": {
                "favorite_genres": ["Afrobeats", "Amapiano"],
                "preferred_city": "Nairobi",
                "fast_access_enabled": True,
            },
            "sandbox": True,
        },
    )
    assert reg_res.status_code == 200
    reg_user = reg_res.json()["user"]
    assert reg_user["referred_by_ref_code"] == aff_ref
    assert reg_user["preferences"]["favorite_genres"] == ["Afrobeats", "Amapiano"]

    # 6. Later, onboarded user buys a ticket WITHOUT passing ref_code or reachout_token
    #    (automatically resolved from stored user attribution!)
    tier_id = paid_event["tiers"][0]["tier_id"]
    book_res = client.post(
        "/api/events/tickets/book",
        json={
            "event_id": paid_event["id"],
            "tier_id": tier_id,
            "quantity": 2,
            "customer_name": recipient_name,
            "customer_email": recipient_email,
            "payment_method": "tunepay",
        },
    )
    assert book_res.status_code == 200

    # Clear consumer session cookie before querying admin telemetry endpoints
    client.cookies.clear()

    # 7. Verify Affiliate Account Telemetry & Conversions
    aff_after = db.affiliates.find_one({"ref_code": aff_ref})
    assert aff_after["clicks_count"] >= 1
    assert aff_after["rsvps_count"] >= 1
    assert aff_after["onboardings_count"] >= 1
    assert aff_after["conversions_count"] >= 1
    assert aff_after["total_gmv"] > 0
    assert aff_after["total_earnings"] > 0

    # 8. Verify Affiliate received BOTH In-App Inbox notifications AND Registered Email notifications
    inbox_res = client.get(f"/api/inbox?affiliate_ref_code={aff_ref}")
    assert inbox_res.status_code == 200
    inbox_msgs = inbox_res.json()["messages"]
    action_types_in_inbox = {m.get("action_type") for m in inbox_msgs}
    assert "rsvp" in action_types_in_inbox
    assert "onboarding" in action_types_in_inbox
    assert "spend" in action_types_in_inbox

    # Verify registered email notifications logged in db.communications / db.email_outbox
    aff_emails = list(db.communications.find({"to": aff_email}))
    email_event_types = {e.get("event_type") for e in aff_emails}
    assert "affiliate_reachout_rsvp" in email_event_types
    assert "affiliate_reachout_onboarding" in email_event_types
    assert "affiliate_reachout_spend" in email_event_types

    # 9. Verify Smart CRM Reachout Activity Telemetry endpoint
    act_res = client.get(f"/api/crm/reachout/activity?affiliate_ref_code={aff_ref}")
    assert act_res.status_code == 200
    act_data = act_res.json()
    assert act_data["summary"]["clicks"] >= 1
    assert act_data["summary"]["rsvps"] >= 1
    assert act_data["summary"]["onboardings"] >= 1
    assert act_data["summary"]["purchases"] >= 1
    assert act_data["summary"]["total_commission_usd"] > 0

    # Cleanup test records
    client.delete(f"/api/crm/campaigns/{camp_data['id']}")
    client.delete(f"/api/crm/target-groups/{group_id}")
    db.users.delete_one({"email": recipient_email})
    db.affiliates.delete_one({"ref_code": aff_ref})
    db.affiliate_linked_users.delete_many({"ref_code": aff_ref})
    db.affiliate_conversions.delete_many({"ref_code": aff_ref})
    db.user_inbox.delete_many({"affiliate_ref_code": aff_ref})
    db.crm_reachout_links.delete_many({"affiliate_ref_code": aff_ref})
    db.crm_reachout_activity.delete_many({"affiliate_ref_code": aff_ref})


def test_admin_vs_affiliate_rbac_and_csv_import():
    """Verify:
    - Admin sees all registered affiliates (including role='affiliate' users synced from db.users)
      and can filter target groups by any affiliate.
    - Non-admin Affiliates ONLY see and access their own Target Groups (403 on other affiliates' groups).
    - Target Group CSV/JSON Import strips phone columns automatically while importing valid Name+Email rows.
    """
    uid = uuid.uuid4().hex[:6]
    aff_a_email = f"aff.alpha.{uid}@example.com"
    aff_b_email = f"aff.beta.{uid}@example.com"

    # Register two distinct affiliate accounts via /api/auth/register
    res_a = client.post(
        "/api/auth/register",
        json={"email": aff_a_email, "password": "Password123!", "name": f"Alpha Partner {uid}", "role": "affiliate", "sandbox": True},
    )
    res_b = client.post(
        "/api/auth/register",
        json={"email": aff_b_email, "password": "Password123!", "name": f"Beta Partner {uid}", "role": "affiliate", "sandbox": True},
    )
    assert res_a.status_code == 200
    assert res_b.status_code == 200
    tok_a = res_a.json()["access_token"]
    tok_b = res_b.json()["access_token"]
    client.cookies.clear()

    # 1. Admin calls /api/affiliates/admin/roster (unauthenticated test client acts as internal admin console)
    roster_res = client.get("/api/affiliates/admin/roster")
    assert roster_res.status_code == 200
    roster_emails = {a.get("email") for a in roster_res.json()["affiliates"]}
    assert aff_a_email in roster_emails
    assert aff_b_email in roster_emails

    # Non-admin Affiliate A calling /api/affiliates/admin/roster only sees their own record
    aff_a_roster = client.get("/api/affiliates/admin/roster", headers={"Authorization": f"Bearer {tok_a}"})
    assert aff_a_roster.status_code == 200
    assert len(aff_a_roster.json()["affiliates"]) == 1
    assert aff_a_roster.json()["affiliates"][0]["email"] == aff_a_email
    ref_a = aff_a_roster.json()["affiliates"][0]["ref_code"]

    # 2. Affiliate A imports a CSV containing a Phone column -> phone stripped, Name+Email imported
    csv_payload = "Name,Email,Phone,Notes\nNairobi Creator,creator1@example.com,+254711223344,Artist\nLagos DJ,dj1@example.com,+234800000000,Curator\n"
    imp_res = client.post(
        "/api/crm/target-groups/import",
        headers={"Authorization": f"Bearer {tok_a}"},
        json={"name": f"Alpha Imported List {uid}", "raw_content": csv_payload},
    )
    assert imp_res.status_code == 201
    imp_data = imp_res.json()
    assert imp_data["report"]["imported"] == 2
    assert imp_data["report"]["stripped_phone_fields"] == 2
    group_a_id = imp_data["group"]["id"]
    assert imp_data["group"]["affiliate_ref_code"] == ref_a

    # 3. Affiliate B cannot view or delete Affiliate A's target group (403 Forbidden)
    b_list = client.get("/api/crm/target-groups", headers={"Authorization": f"Bearer {tok_b}"})
    assert b_list.status_code == 200
    assert all(g["id"] != group_a_id for g in b_list.json()["groups"])

    b_get = client.get(f"/api/crm/target-groups/{group_a_id}", headers={"Authorization": f"Bearer {tok_b}"})
    assert b_get.status_code == 403

    b_del = client.delete(f"/api/crm/target-groups/{group_a_id}", headers={"Authorization": f"Bearer {tok_b}"})
    assert b_del.status_code == 403

    # 4. Admin CAN filter and access Affiliate A's target group
    adm_list = client.get(f"/api/crm/target-groups?affiliate_ref_code={ref_a}")
    assert adm_list.status_code == 200
    assert any(g["id"] == group_a_id for g in adm_list.json()["groups"])

    # Cleanup
    client.delete(f"/api/crm/target-groups/{group_a_id}")
    db.users.delete_many({"email": {"$in": [aff_a_email, aff_b_email]}})
    db.affiliates.delete_many({"email": {"$in": [aff_a_email, aff_b_email]}})


def test_persona_intro_epk_catalog_and_self_learning_crm():
    """Verify Persona Introductory playbooks (EPK + Catalogue CTAs) and adaptive CRM learning engine."""
    uid = uuid.uuid4().hex[:6]

    # 1. Verify all 10 persona playbooks exist
    pb_res = client.get("/api/crm/smart-playbooks")
    assert pb_res.status_code == 200
    personas = pb_res.json()["personas"]
    for expected in ("creator", "dj", "label", "podcaster", "supervisor", "corporate", "media_house", "vc", "affiliate", "consumer"):
        assert expected in personas

    # 2. Create group & dispatch Creator Persona Introductory Reachout with EPK & Catalogue CTAs
    tg_res = client.post(
        "/api/crm/target-groups",
        json={
            "name": f"Creator Onboarding Cohort {uid}",
            "affiliate_ref_code": "TM-ADMIN",
            "entries": [{"name": "Zuri Producer", "email": f"zuri.{uid}@example.com"}],
        },
    )
    assert tg_res.status_code == 201
    gid = tg_res.json()["id"]

    rec_res = client.post("/api/crm/smart-recommend", json={"promotion_type": "persona_intro", "persona": "creator"})
    assert rec_res.status_code == 200
    rec = rec_res.json()

    camp_res = client.post(
        "/api/crm/campaigns",
        json={
            "title": f"Creator EPK & Catalogue Invite {uid}",
            "target_group_id": gid,
            "affiliate_ref_code": "TM-ADMIN",
            "promotion_type": "persona_intro",
            "target_persona": "creator",
            "include_epk_cta": True,
            "include_catalog_cta": True,
            "subject": rec["subject"],
            "body": rec["body"],
            "cta_label": rec["cta_label"],
            "channels": ["email"],
            "dispatch_now": True,
        },
    )
    assert camp_res.status_code == 200
    camp = camp_res.json()
    token = camp["reachout_tokens"][0]["token"]

    # Verify email HTML includes direct EPK & Catalogue Ingestion buttons
    outbox = db.email_outbox.find_one({"metadata.reachout_token": token})
    assert outbox is not None
    assert "Launch Official EPK" in outbox["html"]
    assert "Ingest Catalogue" in outbox["html"]

    # 3. Click link -> verify resolve returns persona_playbook + intelligence registers warm clicker & learned weights
    res_click = client.get(f"/api/crm/reachout/resolve/{token}")
    assert res_click.status_code == 200
    assert res_click.json()["target_persona"] == "creator"
    assert res_click.json()["persona_playbook"]["supports_epk"] is True
    assert res_click.json()["persona_playbook"]["supports_catalog"] is True

    intel_res = client.get("/api/crm/intelligence?persona=creator&affiliate_ref_code=TM-ADMIN")
    assert intel_res.status_code == 200
    intel = intel_res.json()
    assert intel["metrics"]["unique_clicked"] >= 1
    assert len(intel["top_learned_patterns"]) >= 1

    # Cleanup
    client.delete(f"/api/crm/campaigns/{camp['id']}")
    client.delete(f"/api/crm/target-groups/{gid}")
    db.crm_reachout_links.delete_one({"token": token})


def test_system_user_target_groups_event_flyer_and_email_preview():
    """Pre-created registered-user groups, event flyer embedding and live email preview."""
    client.cookies.clear()
    groups_res = client.get("/api/crm/target-groups")
    # Unauthenticated callers may be rejected; the preview endpoint must work regardless.
    if groups_res.status_code == 200:
        payload = groups_res.json()
        groups = payload if isinstance(payload, list) else payload.get("groups", [])
        names = [g.get("name") for g in groups if g.get("is_system_group")]
        if names:
            assert "All Registered Platform Users" in names

    event = {
        "id": "ev_flyer_test",
        "title": "Flyer Test Live",
        "date": "2026-12-12",
        "venue": "Nairobi Arena",
        "image_url": "/uploads/flyer-test.jpg",
        "price": 20,
    }
    res = client.post(
        "/api/crm/campaigns/preview",
        json={
            "subject": "Join us {{name}}",
            "body": "Hi {{name}}, {{event_title}} is live.",
            "promotion_type": "event",
            "event_doc": event,
            "event_ctas": ["rsvp", "ticket"],
        },
    )
    assert res.status_code == 200, res.text
    data = res.json()
    assert "flyer-test.jpg" in data["html"]
    assert data["event_flyer_url"] == "/uploads/flyer-test.jpg"
    assert "border-radius: 3px" in data["html"] or "border-radius:3px" in data["html"]
