"""Integration Test Suite for Phase 10: Media House Routing & Broadcast Syndication.

Verifies:
1. Multi-station broadcast channel registration (FM Radio, Linear TV, Satellite).
2. Playout rotation queues with Dayparting governance (Morning Drive, Midday, Afternoon Rush, Evening Prime, Overnight).
3. Commercial ad insertion queueing and stem format preferences (Clean Radio Edit, Instrumental Bed, Acapella).
4. Playout triggering with cryptographic airplay verification seals and certificates (TM-BCAST-YYYY-XXXX).
5. Verified broadcast log querying and filtering by PRO affiliation (MCSK, ASCAP, BMI, SAMRO).
6. Automated statutory PRO cue sheet generation and compliance score certification.
7. Media House operational telemetry statistics and stem clearance catalog.
"""
import os
import sys
import unittest
from pathlib import Path
from bson import ObjectId

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from starlette.testclient import TestClient
from server import app
from config import db
from auth import create_access_token


class TestMediaHouseRouting(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Create test media house user
        cls.user_id = ObjectId()
        cls.user_email = f"media_{os.urandom(4).hex()}@broadcaster.com"
        cls.user_doc = {
            "_id": cls.user_id,
            "email": cls.user_email,
            "name": "Pulse Broadcast Group",
            "role": "media_house",
            "roles": ["media_house", "admin"],
            "created_at": "2026-11-09T00:00:00Z"
        }
        db.users.insert_one(cls.user_doc)
        cls.token = create_access_token(sub=str(cls.user_id))
        cls.auth_headers = {"Authorization": f"Bearer {cls.token}"}

    @classmethod
    def tearDownClass(cls):
        db.users.delete_one({"_id": cls.user_id})

    def test_01_list_broadcast_channels(self):
        """Test listing broadcast channels and verify canonical seed data."""
        resp = self.client.get("/api/media-house/channels")
        self.assertEqual(resp.status_code, 200)
        channels = resp.json()
        self.assertGreaterEqual(len(channels), 4)

        call_signs = [c["call_sign"] for c in channels]
        self.assertIn("KPLS-FM", call_signs)
        self.assertIn("TRC-EA", call_signs)
        self.assertIn("AFRO-SAT", call_signs)

        pulse = next(c for c in channels if c["call_sign"] == "KPLS-FM")
        self.assertEqual(pulse["media_type"], "fm_radio")
        self.assertEqual(pulse["pro_affiliation"], "MCSK")
        self.assertTrue(pulse["is_on_air"])

    def test_02_create_broadcast_channel(self):
        """Test registering a new station with regulatory PRO license."""
        payload = {
            "name": "Capital Sounds TV 4K",
            "call_sign": "CAP-4K",
            "media_type": "linear_tv",
            "frequency": "Ch. 510 DStv",
            "stream_url": "https://stream.tunemavens.com/cap4k.m3u8",
            "region": "KE",
            "pro_affiliation": "MCSK",
            "active_listeners": 350000
        }
        resp = self.client.post("/api/media-house/channels", json=payload, headers=self.auth_headers)
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertEqual(data["name"], "Capital Sounds TV 4K")
        self.assertEqual(data["call_sign"], "CAP-4K")
        self.assertIn("MCSK", data["pro_license_id"])

    def test_03_get_broadcast_queue(self):
        """Test fetching scheduled playout rotation queue."""
        resp = self.client.get("/api/media-house/queue")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("queue", data)
        self.assertGreaterEqual(len(data["queue"]), 3)

        tiers = [q["rotation_tier"] for q in data["queue"]]
        self.assertIn("heavy", tiers)
        self.assertIn("ad_spot", tiers)

    def test_04_enqueue_track_and_ad_spot(self):
        """Test scheduling a music track and commercial ad flight into queue."""
        chan_resp = self.client.get("/api/media-house/channels")
        channel_id = chan_resp.json()[0]["id"]

        track_payload = {
            "channel_id": channel_id,
            "title": "Midnight In Nairobi",
            "artist": "Bien ft. Ayra Starr",
            "isrc": "QM4TX2600888",
            "duration_seconds": 204,
            "rotation_tier": "heavy",
            "daypart": "afternoon_rush",
            "stem_preference": "clean_radio_edit"
        }
        resp = self.client.post("/api/media-house/queue", json=track_payload)
        self.assertEqual(resp.status_code, 201)
        track_item = resp.json()
        self.assertEqual(track_item["title"], "Midnight In Nairobi")
        self.assertEqual(track_item["stem_preference"], "clean_radio_edit")

        # Enqueue commercial ad flight
        ad_payload = {
            "channel_id": channel_id,
            "title": "Red Bull Music Flight Spot",
            "artist": "Red Bull Brand Audio",
            "isrc": "AD-SPOT-RB-001",
            "duration_seconds": 30,
            "rotation_tier": "ad_spot",
            "daypart": "afternoon_rush",
            "stem_preference": "master",
            "ad_flight_id": "flight-rb-2026"
        }
        ad_resp = self.client.post("/api/media-house/queue", json=ad_payload)
        self.assertEqual(ad_resp.status_code, 201)
        self.assertEqual(ad_resp.json()["rotation_tier"], "ad_spot")

    def test_05_trigger_playout_advancement(self):
        """Test on-air transition with cryptographic verification seal and certificate."""
        chan_resp = self.client.get("/api/media-house/channels")
        channel_id = chan_resp.json()[0]["id"]

        payload = {"channel_id": channel_id}
        resp = self.client.post("/api/media-house/trigger-playout", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "on_air_advanced")
        self.assertIn("on_air", data)
        self.assertIn("verified_log", data)

        log = data["verified_log"]
        self.assertTrue(log["verified"])
        self.assertTrue(log["airplay_certificate"].startswith("TM-BCAST-"))
        self.assertEqual(len(log["tamper_seal"]), 64)  # SHA-256 length
        self.assertGreater(log["estimated_royalty"], 0)

    def test_06_list_broadcast_logs(self):
        """Test retrieving verified airplay logs with PRO affiliation and filters."""
        resp = self.client.get("/api/media-house/logs")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertGreater(data["total_logs"], 0)
        first_log = data["logs"][0]
        self.assertIn("airplay_certificate", first_log)
        self.assertIn("isrc", first_log)
        self.assertIn("pro_affiliation", first_log)

    def test_07_generate_and_certify_cue_sheet(self):
        """Test 1-click automated PRO cue sheet export certification."""
        chan_resp = self.client.get("/api/media-house/channels")
        channel_id = chan_resp.json()[0]["id"]

        payload = {
            "channel_id": channel_id,
            "pro_target": "MCSK",
            "period": "2026-11"
        }
        resp = self.client.post("/api/media-house/cue-sheets/generate", json=payload)
        self.assertEqual(resp.status_code, 201)
        data = resp.json()
        self.assertEqual(data["pro_target"], "MCSK")
        self.assertGreaterEqual(data["compliance_score"], 99.0)
        self.assertEqual(data["status"], "certified")
        self.assertIn("DDEX-BCAST-CUE", data["export_format"])

        # List cue sheets
        list_resp = self.client.get(f"/api/media-house/cue-sheets?channel_id={channel_id}")
        self.assertEqual(list_resp.status_code, 200)
        self.assertGreaterEqual(len(list_resp.json()), 1)

    def test_08_media_house_stats_and_stems(self):
        """Test telemetry summary statistics and stems availability catalog."""
        stats_resp = self.client.get("/api/media-house/stats")
        self.assertEqual(stats_resp.status_code, 200)
        stats = stats_resp.json()
        self.assertGreaterEqual(stats["total_stations"], 4)
        self.assertGreaterEqual(stats["pro_compliance_score"], 99.0)
        self.assertGreater(stats["active_listeners_aggregate"], 100000)

        stems_resp = self.client.get("/api/media-house/stems-catalog")
        self.assertEqual(stems_resp.status_code, 200)
        stems = stems_resp.json()
        self.assertGreaterEqual(len(stems), 4)
        self.assertIn("Clean Radio Edit", stems[0]["available_stems"])
