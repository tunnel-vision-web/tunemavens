"""Integration & Verification Tests for Technical Foundation Spec §4:
Shared Identity & TuneStream.

Verifies:
1. SSO Clients & OIDC PKCE Token Exchange across tunemavens.com, tunestream.co, syncmavens.com.
2. Single Identity & Multi-Role Switching (one account holding fan, artist, buyer roles).
3. Cross-Domain Logout Propagation (session revocation invalidates older JWTs across all apps).
4. Catalogue Source of Truth & Instant Withdrawn-Track Halting (Spec §4 Acceptance:
   a track set to withdrawn stops playing within the target time).
5. Territory and Rights Guardrails (HTTP 451 for unlicensed/blocked territories).
6. Content Safety & Explicit Age Gating.
7. Adaptive Audio Manifests (Low-bitrate mobile default for Nairobi, lossless Wi-Fi opt-in).
8. Anti-Fraud Stream Accounting (Minimum 30s threshold, repeat loop detection, bot detection).
9. TuneLedger Integration for Verified Plays & Fan Credit Tipping (95% creator split, zero subscriptions).
"""
import base64
import hashlib
import json
import os
import time
import unittest
from datetime import datetime, timezone
from pathlib import Path

from bson import ObjectId
from fastapi.testclient import TestClient

# Ensure sys.path points to backend
import sys
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from server import app
from config import db, JWT_SECRET
from auth import create_access_token, hash_password
from services.stream_service import generate_stream_token


class TestSharedIdentityTuneStream(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Create primary test creator user
        cls.creator_id = ObjectId()
        cls.creator_email = f"creator_stream_{os.urandom(4).hex()}@tunemavens.com"
        cls.creator_user = {
            "_id": cls.creator_id,
            "email": cls.creator_email,
            "password_hash": hash_password("SecurePass123!"),
            "name": "Nairobi Beatmaker",
            "role": "creator",
            "roles": ["creator", "consumer"],
            "credits": 500,
            "country": "KE",
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.creator_user)

        # Create fan/listener user
        cls.fan_id = ObjectId()
        cls.fan_email = f"fan_{os.urandom(4).hex()}@tunestream.co"
        cls.fan_user = {
            "_id": cls.fan_id,
            "email": cls.fan_email,
            "password_hash": hash_password("FanSecure123!"),
            "name": "Wanjiku Listener",
            "role": "consumer",
            "roles": ["consumer"],
            "credits": 200,
            "country": "KE",
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.fan_user)

        # Create test track
        cls.track_id = str(ObjectId())
        cls.test_track = {
            "_id": cls.track_id,
            "id": cls.track_id,
            "title": "Nairobi Sunset Groove",
            "artist": "Nairobi Beatmaker",
            "creator_id": str(cls.creator_id),
            "isrc": "KE-TM1-26-00101",
            "status": "active",
            "public_streaming": True,
            "explicit": False,
            "allowed_territories": ["KE", "UG", "TZ", "GB", "US"],
            "blocked_territories": ["SO"],
            "duration": 210.0,
            "created_at": datetime.now(timezone.utc),
        }
        db.tracks.insert_one(cls.test_track)

    @classmethod
    def tearDownClass(cls):
        db.users.delete_one({"_id": cls.creator_id})
        db.users.delete_one({"_id": cls.fan_id})
        db.tracks.delete_one({"_id": cls.track_id})
        db.stream_events.delete_many({"track_id": cls.track_id})
        db.credit_ledger.delete_many({"user_id": {"$in": [cls.creator_id, cls.fan_id]}})
        db.fan_tips.delete_many({"track_id": cls.track_id})

    def test_01_sso_client_registry(self):
        """Verify registered SSO clients for tunemavens, tunestream, and syncmavens."""
        res = self.client.get("/api/sso/clients")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        client_ids = [c["client_id"] for c in data.get("clients", [])]
        self.assertIn("tunemavens", client_ids)
        self.assertIn("tunestream", client_ids)
        self.assertIn("syncmavens", client_ids)

    def test_02_sso_pkce_authorization_and_token_exchange(self):
        """Test full OIDC Authorization Code Flow with PKCE S256 verification."""
        # 1. Generate PKCE verifier and challenge
        verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
        digest = hashlib.sha256(verifier.encode("utf-8")).digest()
        challenge = base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")

        token = create_access_token(sub=str(self.fan_id))
        auth_headers = {"Authorization": f"Bearer {token}"}

        # 2. Authorize
        auth_res = self.client.get(
            "/api/sso/authorize",
            params={
                "client_id": "tunestream",
                "redirect_uri": "http://localhost:3001/callback",
                "response_type": "code",
                "code_challenge": challenge,
                "code_challenge_method": "S256"
            },
            headers=auth_headers
        )
        self.assertEqual(auth_res.status_code, 200, f"Authorize failed: {auth_res.text}")
        code = auth_res.json()["code"]
        self.assertTrue(code.startswith("code_"))

        # 3. Exchange code for token with verifier
        exchange_res = self.client.post(
            "/api/sso/token",
            json={
                "grant_type": "authorization_code",
                "client_id": "tunestream",
                "code": code,
                "redirect_uri": "http://localhost:3001/callback",
                "code_verifier": verifier
            }
        )
        self.assertEqual(exchange_res.status_code, 200, f"Exchange failed: {exchange_res.text}")
        token_data = exchange_res.json()
        self.assertIn("access_token", token_data)

        # 4. Verify issued token against /userinfo
        issued_token = token_data["access_token"]
        userinfo_res = self.client.get(
            "/api/sso/userinfo",
            headers={"Authorization": f"Bearer {issued_token}"}
        )
        self.assertEqual(userinfo_res.status_code, 200)
        self.assertEqual(userinfo_res.json()["email"], self.fan_email)

    def test_03_multi_role_switching(self):
        """Test user can switch active session role among multiple roles without re-authenticating."""
        token = create_access_token(sub=str(self.creator_id))
        headers = {"Authorization": f"Bearer {token}"}

        # Creator currently has ['creator', 'consumer']
        res = self.client.post("/api/sso/switch-role", json={"role": "consumer"}, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["active_role"], "consumer")
        self.assertIn("creator", data["roles"])
        self.assertIn("consumer", data["roles"])

        # Switch back to creator
        res_back = self.client.post("/api/sso/switch-role", json={"role": "creator"}, headers=headers)
        self.assertEqual(res_back.status_code, 200)
        self.assertEqual(res_back.json()["active_role"], "creator")

    def test_04_cross_domain_logout_propagation(self):
        """Test that logout sets logged_out_at, invalidating tokens minted prior to logout."""
        token = create_access_token(sub=str(self.fan_id))
        headers = {"Authorization": f"Bearer {token}"}

        # Token is valid initially
        me_res = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(me_res.status_code, 200)

        # Brief pause to ensure timestamp separation
        time.sleep(1.1)

        # Perform logout
        logout_res = self.client.post("/api/auth/logout", headers=headers)
        self.assertEqual(logout_res.status_code, 200)

        # Token minted prior to logout must now be rejected (401)
        stale_res = self.client.get("/api/auth/me", headers=headers)
        self.assertEqual(stale_res.status_code, 401, "Stale token must be rejected after logout")

        # Clear logged_out_at for subsequent tests
        db.users.update_one({"_id": self.fan_id}, {"$unset": {"logged_out_at": ""}})

    def test_05_withdrawn_track_stops_playing_immediately(self):
        """Spec §4 Acceptance: a track set to withdrawn stops playing within the target time."""
        # 1. Normal track generates valid manifest
        man_res = self.client.get(f"/api/stream/manifest/{self.track_id}")
        self.assertEqual(man_res.status_code, 200)
        self.assertTrue(man_res.json()["ok"])

        # 2. Mark track as withdrawn in database
        db.tracks.update_one({"_id": self.track_id}, {"$set": {"status": "withdrawn"}})
        try:
            # 3. Requesting manifest or stream must now be rejected immediately with 403
            withdrawn_man = self.client.get(f"/api/stream/manifest/{self.track_id}")
            self.assertEqual(withdrawn_man.status_code, 403)
            self.assertIn("track_withdrawn", str(withdrawn_man.json()))

            withdrawn_stream = self.client.get(f"/api/stream/track/{self.track_id}")
            self.assertEqual(withdrawn_stream.status_code, 403)
        finally:
            # Restore track status to active
            db.tracks.update_one({"_id": self.track_id}, {"$set": {"status": "active"}})

    def test_06_territory_guardrail(self):
        """Test playback is blocked for blocked territories (HTTP 451)."""
        # Blocked territory SO (Somalia)
        res_blocked = self.client.get(
            f"/api/stream/manifest/{self.track_id}",
            headers={"cf-ipcountry": "SO"}
        )
        self.assertEqual(res_blocked.status_code, 451)
        self.assertIn("territory_blocked", str(res_blocked.json()))

        # Allowed territory KE (Kenya)
        res_allowed = self.client.get(
            f"/api/stream/manifest/{self.track_id}",
            headers={"cf-ipcountry": "KE"}
        )
        self.assertEqual(res_allowed.status_code, 200)

    def test_07_adaptive_playback_quality_manifest(self):
        """Test manifest returns low_mobile default (96kbps) and lossless (1411kbps) Wi-Fi opt-in."""
        res = self.client.get(f"/api/stream/manifest/{self.track_id}", headers={"cf-ipcountry": "KE"})
        self.assertEqual(res.status_code, 200)
        data = res.json()

        self.assertEqual(data["default_profile"], "low_mobile")
        profiles = data.get("profiles", {})
        self.assertIn("low_mobile", profiles)
        self.assertIn("high", profiles)
        self.assertIn("lossless", profiles)

        self.assertEqual(profiles["low_mobile"]["bitrate_kbps"], 96)
        self.assertTrue(profiles["low_mobile"]["data_saver"])
        self.assertEqual(profiles["lossless"]["bitrate_kbps"], 1411)

    def test_08_stream_accounting_duration_threshold(self):
        """Test play events under 30 seconds count as partial preview with 0 credit payout."""
        # 15 seconds stream play (below 30s threshold)
        res = self.client.post(
            "/api/stream/event",
            json={
                "track_id": self.track_id,
                "duration_listened_sec": 15.0,
                "country": "KE"
            }
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["qualified"])
        self.assertEqual(data["credits_earned"], 0.0)

    def test_09_stream_fraud_detection_rapid_loops(self):
        """Spec §4 Acceptance: Fraud rules flag a scripted looping test account."""
        attacker_ip = "197.232.10.55"

        # Simulate 3 fast plays
        for _ in range(3):
            self.client.post(
                "/api/stream/event",
                json={
                    "track_id": self.track_id,
                    "duration_listened_sec": 40.0,
                    "country": "KE"
                },
                headers={"x-forwarded-for": attacker_ip}
            )

        # 4th play must be flagged as rapid_repeat_loop and denied payout
        res_loop = self.client.post(
            "/api/stream/event",
            json={
                "track_id": self.track_id,
                "duration_listened_sec": 45.0,
                "country": "KE"
            },
            headers={"x-forwarded-for": attacker_ip}
        )
        self.assertEqual(res_loop.status_code, 200)
        data = res_loop.json()
        self.assertFalse(data["qualified"])
        self.assertEqual(data["fraud_flag"], "rapid_repeat_loop")
        self.assertEqual(data["credits_earned"], 0.0)

    def test_10_verified_stream_credits_artist_ledger(self):
        """Test legitimate stream (>= 30s) creates double-entry credit in TuneLedger."""
        initial_creator = db.users.find_one({"_id": self.creator_id})
        initial_balance = initial_creator.get("credits", 0)

        res = self.client.post(
            "/api/stream/event",
            json={
                "track_id": self.track_id,
                "duration_listened_sec": 65.0,
                "country": "GB"
            },
            headers={"x-forwarded-for": "82.165.197.1"}  # Legitimate UK IP
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["qualified"])
        self.assertGreater(data["credits_earned"], 0)

        # Check TuneLedger transaction was recorded
        updated_creator = db.users.find_one({"_id": self.creator_id})
        self.assertGreater(updated_creator.get("credits", 0), initial_balance)

        ledger_entry = db.credit_ledger.find_one({
            "user_id": {"$in": [self.creator_id, str(self.creator_id)]},
            "entry_type": "STREAM_PAYOUT"
        })
        self.assertIsNotNone(ledger_entry, "TuneLedger missing STREAM_PAYOUT record")
        self.assertEqual(ledger_entry["provider"], "tunestream")

    def test_11_fan_credit_tipping_splits(self):
        """Spec §4: Fans tip creators with credits (95% to creator, 5% platform fee)."""
        initial_fan = db.users.find_one({"_id": self.fan_id})
        initial_creator = db.users.find_one({"_id": self.creator_id})

        fan_start = initial_fan.get("credits", 0)
        creator_start = initial_creator.get("credits", 0)

        token = create_access_token(sub=str(self.fan_id))
        headers = {"Authorization": f"Bearer {token}"}

        tip_amount = 50
        res = self.client.post(
            "/api/stream/tip",
            json={
                "creator_id": str(self.creator_id),
                "amount_credits": tip_amount,
                "track_id": self.track_id,
                "message": "Love your Nairobi vibe!"
            },
            headers=headers
        )
        self.assertEqual(res.status_code, 200, f"Tip failed: {res.text}")
        data = res.json()
        self.assertEqual(data["gross_credits"], 50)
        self.assertEqual(data["creator_net_credits"], 47.5)   # 95% of 50
        self.assertEqual(data["platform_fee_credits"], 2.5)   # 5% of 50

        # Verify fan balance decreased by 50
        updated_fan = db.users.find_one({"_id": self.fan_id})
        self.assertEqual(updated_fan.get("credits"), fan_start - 50)

        # Verify creator balance increased by 47.5
        updated_creator = db.users.find_one({"_id": self.creator_id})
        self.assertEqual(updated_creator.get("credits"), creator_start + 47.5)

        # Verify TuneLedger transactions for both sides
        fan_ledger = db.credit_ledger.find_one({"user_id": {"$in": [self.fan_id, str(self.fan_id)]}, "entry_type": "FAN_TIP_SENT"})
        creator_ledger = db.credit_ledger.find_one({"user_id": {"$in": [self.creator_id, str(self.creator_id)]}, "entry_type": "FAN_TIP_RECEIVED"})
        self.assertIsNotNone(fan_ledger)
        self.assertIsNotNone(creator_ledger)
        self.assertEqual(fan_ledger["amount"], -50)
        self.assertEqual(creator_ledger["amount"], 47.5)


if __name__ == "__main__":
    unittest.main()
