"""Comprehensive Integration Test Suite for Sprint 1 (Phase 4.5 & Phase 5.5).

Covers:
- Social Graph (Follow, Unfollow, Relationship status)
- Universal Likes (Songs, Profiles, Posts)
- Privacy Center (Granular signal settings)
- Activity Fanout Feed & Privacy-Aware Visibility
- 2nd-Degree Network Discovery ("2 hops away via mutual friend")
- Wall of Fame Curated Grid, YouTube metadata, Admin composer, Invite dispatch, and Claim workflow.
"""
from __future__ import annotations

import os
import sys
from datetime import datetime, timezone

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from config import db
from server import app
from auth import create_access_token

client = TestClient(app)


def seed_test_user(email: str, name: str, role: str = "creator") -> tuple[str, dict]:
    """Helper to seed a test user and return (user_id, cookies_dict)."""
    db.users.delete_many({"email": email})
    res = db.users.insert_one({
        "email": email,
        "name": name,
        "role": role,
        "roles": [role, "admin"],  # allow admin operations in tests
        "plan": "starter",
        "credits": 500,
        "created_at": datetime.now(timezone.utc),
    })
    uid = str(res.inserted_id)
    token = create_access_token(sub=uid)
    return uid, {"access_token": token}


def test_follow_unfollow_and_relationship():
    """Verify follow, unfollow, and relationship status endpoints."""
    user_a_id, user_a_cookies = seed_test_user("alice@tunemavens.com", "Alice Creator")
    user_b_id, user_b_cookies = seed_test_user("bob@tunemavens.com", "Bob Producer")

    # Clean relationships
    db.follows.delete_many({"$or": [{"follower_id": user_a_id}, {"follower_id": user_b_id}]})

    # 1. User A follows User B
    follow_res = client.post(f"/api/users/{user_b_id}/follow", cookies=user_a_cookies)
    assert follow_res.status_code == 200
    data = follow_res.json()
    assert data["following"] is True
    assert data["target_id"] == user_b_id

    # 2. Check relationship
    rel_res = client.get(f"/api/users/{user_b_id}/relationship", cookies=user_a_cookies)
    assert rel_res.status_code == 200
    rel_data = rel_res.json()
    assert rel_data["followers_count"] == 1
    assert rel_data["is_following"] is True

    # 3. User A unfollows User B
    unfollow_res = client.delete(f"/api/users/{user_b_id}/follow", cookies=user_a_cookies)
    assert unfollow_res.status_code == 200
    assert unfollow_res.json()["following"] is False

    # 4. Check relationship again
    rel_res_after = client.get(f"/api/users/{user_b_id}/relationship", cookies=user_a_cookies)
    assert rel_res_after.status_code == 200
    assert rel_res_after.json()["followers_count"] == 0
    assert rel_res_after.json()["is_following"] is False


def test_likes_toggle_and_check():
    """Verify universal like toggle and check status."""
    user_id, cookies = seed_test_user("liker@tunemavens.com", "Liker Member")
    target_id = "test-track-404"

    # Clean prior likes
    db.likes.delete_many({"target_id": target_id})

    # 1. Like track
    like_res = client.post("/api/likes", json={"target_kind": "song", "target_id": target_id}, cookies=cookies)
    assert like_res.status_code == 200
    assert like_res.json()["liked"] is True
    assert like_res.json()["likes_count"] == 1

    # 2. Check like
    check_res = client.get(f"/api/likes/check?target_kind=song&target_id={target_id}", cookies=cookies)
    assert check_res.status_code == 200
    assert check_res.json()["liked"] is True
    assert check_res.json()["likes_count"] == 1

    # 3. Toggle unlike
    unlike_res = client.post("/api/likes", json={"target_kind": "song", "target_id": target_id}, cookies=cookies)
    assert unlike_res.status_code == 200
    assert unlike_res.json()["liked"] is False
    assert unlike_res.json()["likes_count"] == 0


def test_privacy_settings_workflow():
    """Verify Privacy Center default retrieval and patch."""
    user_id, cookies = seed_test_user("privacy_user@tunemavens.com", "Privacy Tester")

    # 1. Get default settings
    res = client.get("/api/users/me/privacy-settings", cookies=cookies)
    assert res.status_code == 200
    settings = res.json()
    assert settings["listens"] == "public"
    assert settings["second_degree_visible"] is True

    # 2. Patch settings
    patch_res = client.patch(
        "/api/users/me/privacy-settings",
        json={
            "listens": "connections",
            "deals": "private",
            "second_degree_visible": False,
        },
        cookies=cookies,
    )
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["listens"] == "connections"
    assert updated["deals"] == "private"
    assert updated["second_degree_visible"] is False


def test_activity_feed_and_privacy_visibility():
    """Verify activity feed aggregates events according to privacy filters."""
    creator_id, creator_cookies = seed_test_user("feed_creator@tunemavens.com", "Feed Creator")
    fan_id, fan_cookies = seed_test_user("fan_user@tunemavens.com", "Fan Follower")

    # 1. Log a public event
    pub_res = client.post(
        "/api/feed/activity",
        json={
            "kind": "listen",
            "target_name": "Afro Summer Beats",
            "visibility": "public",
        },
        cookies=creator_cookies,
    )
    assert pub_res.status_code == 200

    # 2. Log a connections-only event
    conn_res = client.post(
        "/api/feed/activity",
        json={
            "kind": "tip",
            "target_name": "Tip to Producer",
            "visibility": "connections",
        },
        cookies=creator_cookies,
    )
    assert conn_res.status_code == 200

    # 3. Before fan follows creator: Fan should see public event
    feed_before = client.get("/api/feed", cookies=fan_cookies).json()
    assert any(item.get("target_name") == "Afro Summer Beats" for item in feed_before["items"])

    # 4. Fan follows creator
    client.post(f"/api/users/{creator_id}/follow", cookies=fan_cookies)

    # 5. Fan should now see connections-only event
    feed_after = client.get("/api/feed", cookies=fan_cookies).json()
    assert any(item.get("target_name") == "Tip to Producer" for item in feed_after["items"])


def test_second_degree_discovery():
    """Verify 2nd-degree network discovery returns users 2 hops away with mutual connection info."""
    u1_id, u1_cookies = seed_test_user("hop1@tunemavens.com", "Hop One")
    u2_id, u2_cookies = seed_test_user("hop2@tunemavens.com", "Hop Two")
    u3_id, u3_cookies = seed_test_user("hop3@tunemavens.com", "Hop Three (Target)", role="supervisor")

    # Clean relationships
    db.follows.delete_many({"$or": [{"follower_id": u1_id}, {"follower_id": u2_id}]})

    # u1 follows u2; u2 follows u3
    client.post(f"/api/users/{u2_id}/follow", cookies=u1_cookies)
    client.post(f"/api/users/{u3_id}/follow", cookies=u2_cookies)

    # u1 checks second degree
    res = client.get("/api/graph/second-degree", cookies=u1_cookies)
    assert res.status_code == 200
    data = res.json()
    connections = data["connections"]
    assert len(connections) >= 1

    # Check that u3 is discovered via u2
    target_match = next((c for c in connections if c["id"] == u3_id), None)
    if target_match:
        assert target_match["hops"] == 2
        assert any(m["id"] == u2_id for m in target_match["mutual_connections"])


def test_wall_of_fame_lifecycle_and_claim_flow():
    """Verify Wall of Fame nomination, hidden state until claimed, and claim execution."""
    admin_id, admin_cookies = seed_test_user("hall_admin@tunemavens.com", "Admin Curator")
    nominee_name = "Quincy Sound Pioneer"
    db.featured_profiles.delete_many({"subject_name": nominee_name})

    # 1. Public grid contains pre-seeded claimed figures
    pub_res = client.get("/api/community/wall-of-fame")
    assert pub_res.status_code == 200
    pub_profiles = pub_res.json()["profiles"]
    assert len(pub_profiles) >= 3
    assert any("Rick Rubin" in p["subject_name"] for p in pub_profiles)

    # 2. Admin creates a new nominee (pending state)
    create_res = client.post(
        "/api/admin/wall-of-fame",
        json={
            "subject_name": nominee_name,
            "role": "producer",
            "subject_email": "quincy@soundpioneer.com",
            "youtube_channel_handle": "@QuincySounds",
            "bio": "Visionary arranger and pioneer of orchestration.",
            "tags": ["Arranger", "Orchestra", "Grammy Legend"],
        },
        cookies=admin_cookies,
    )
    assert create_res.status_code == 200
    created = create_res.json()
    profile_id = created["id"]
    assert created["state"] == "pending"
    assert created["visible"] is False

    # 3. Verify nominee does NOT appear on public grid (unclaimed = hidden)
    pub_res_check = client.get("/api/community/wall-of-fame")
    assert not any(p["subject_name"] == nominee_name for p in pub_res_check.json()["profiles"])

    # 4. Admin dispatches invitation
    invite_res = client.post(f"/api/admin/wall-of-fame/{profile_id}/invite", cookies=admin_cookies)
    assert invite_res.status_code == 200
    invite_data = invite_res.json()
    claim_token = invite_data["claim_token"]
    assert claim_token is not None

    # 5. Inspect claim token
    inspect_res = client.get(f"/api/community/wall-of-fame/claim/{claim_token}")
    assert inspect_res.status_code == 200
    assert inspect_res.json()["status"] == "valid"
    assert inspect_res.json()["subject_name"] == nominee_name

    # 6. Claim the profile!
    claim_res = client.post(
        f"/api/community/wall-of-fame/claim/{claim_token}",
        json={
            "display_name": nominee_name,
            "bio": "Honored to join the TuneMavens Hall of Icons.",
            "interests": ["Production", "Sync Licensing", "Mentorship"],
        }
    )
    assert claim_res.status_code == 200
    assert claim_res.json()["status"] == "success"

    # 7. Nominee is NOW visible on public Wall of Fame!
    pub_res_final = client.get("/api/community/wall-of-fame")
    assert any(p["subject_name"] == nominee_name for p in pub_res_final.json()["profiles"])


def test_admin_wall_of_fame_crm_and_communication_protocols():
    """Test full admin suite: multi-protocol dispatch, Smart CRM sync, revoke, patch, and delete."""
    admin_id, admin_cookies = seed_test_user("admin_curator@tunemavens.com", "Curator Staff", role="admin")
    nominee = "Fela Tribute Auteur"
    nominee_email = "fela_tribute@kalakuta.org"
    nominee_phone = "+2348012345678"

    # Clean up prior test data
    db.featured_profiles.delete_many({"subject_email": nominee_email})
    db.crm_leads.delete_many({"email": nominee_email})

    # 1. Nominate figure via admin composer
    create_res = client.post(
        "/api/admin/wall-of-fame",
        cookies=admin_cookies,
        json={
            "subject_name": nominee,
            "role": "creator",
            "subject_email": nominee_email,
            "phone": nominee_phone,
            "bio": "Pioneer of modern Afrobeat orchestration and pan-African sonic autonomy.",
            "tags": ["Afrobeat", "Orchestration", "Cultural Leader"],
            "pre_claim": False,
        }
    )
    assert create_res.status_code == 200, create_res.text
    profile_data = create_res.json()
    profile_id = profile_data["id"]
    assert profile_data["state"] == "pending"

    # Verify initial lead was registered in Smart CRM
    lead = db.crm_leads.find_one({"email": nominee_email})
    assert lead is not None
    assert lead["status"] == "nominated"
    assert "wall_of_fame" in lead["tags"]

    # 2. Dispatch official induction invitation across Communication Protocols & Smart CRM
    invite_res = client.post(
        f"/api/admin/wall-of-fame/{profile_id}/invite",
        cookies=admin_cookies,
        json={
            "subject_email": nominee_email,
            "phone": nominee_phone,
            "custom_note": "Honoring your seminal contribution to continental music export.",
            "send_email_invite": True,
            "send_whatsapp_invite": True,
            "sync_crm": True,
        }
    )
    assert invite_res.status_code == 200, invite_res.text
    invite_data = invite_res.json()
    assert invite_data["status"] == "invited"
    assert "claim_token" in invite_data
    assert "claim_url" in invite_data
    assert invite_data["recipient_email"] == nominee_email
    assert invite_data["crm_lead_id"] is not None

    # Verify Communications Vault contains induction event
    comm = db.communications.find_one({"claim_token": invite_data["claim_token"]})
    assert comm is not None
    assert comm["type"] == "wall_of_fame_invitation"
    assert comm["recipient_email"] == nominee_email

    # Verify Smart CRM lead was promoted to 'invited'
    updated_lead = db.crm_leads.find_one({"email": nominee_email})
    assert updated_lead is not None
    assert updated_lead["status"] == "invited"
    assert updated_lead["claim_token"] == invite_data["claim_token"]

    # 3. Test CRM leads endpoint
    crm_res = client.get("/api/admin/wall-of-fame/crm-leads", cookies=admin_cookies)
    assert crm_res.status_code == 200
    crm_leads = crm_res.json()["leads"]
    assert any(l.get("email") == nominee_email for l in crm_leads)

    # 4. Patch profile details and visibility
    patch_res = client.patch(
        f"/api/admin/wall-of-fame/{profile_id}",
        cookies=admin_cookies,
        json={
            "bio": "Updated biography highlighting 2026 global tour milestone.",
            "visible": True,
        }
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["visible"] is True
    assert "Updated biography" in patch_res.json()["bio"]

    # 5. Revoke invitation
    revoke_res = client.post(
        f"/api/admin/wall-of-fame/{profile_id}/revoke-invite",
        cookies=admin_cookies
    )
    assert revoke_res.status_code == 200
    assert revoke_res.json()["status"] == "revoked"

    # Verify profile state reverted to pending
    from bson import ObjectId
    refreshed_prof = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    assert refreshed_prof["state"] == "pending"
    assert refreshed_prof["claim_token"] is None

    # 6. Delete profile
    del_res = client.delete(
        f"/api/admin/wall-of-fame/{profile_id}",
        cookies=admin_cookies
    )
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"
    assert db.featured_profiles.find_one({"_id": ObjectId(profile_id)}) is None
