"""Phase 2: TuneStream Consumer Audio System & Library Persistence Tests.

Verifies:
1. Listener Library Persistence: liked tracks, custom playlist crates, listening history.
2. 8GB Smart Offline Cache Metadata: 24-bit FLAC manifest, -12 LUFS calibration, 30-day cryptographic lease.
3. 1-Tap Direct Creator Tipping: 95-100% net split, receipts, tipping history.
4. Domain Routing: tunestream.co and tunestream.tunemavens.com registered.
"""
import os
import unittest
from datetime import datetime, timezone
from pathlib import Path
from bson import ObjectId
from fastapi.testclient import TestClient

import sys
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from server import app
from config import db
from auth import create_access_token


class TestStreamConsumer(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Create test fan user
        cls.fan_id = ObjectId()
        cls.fan_email = f"fan_{os.urandom(4).hex()}@tunemavens.com"
        cls.fan_user = {
            "_id": cls.fan_id,
            "name": "Jane Listener",
            "email": cls.fan_email,
            "role": "consumer",
            "credits": 500,
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.fan_user)
        cls.fan_token = create_access_token(sub=str(cls.fan_id))
        cls.fan_headers = {"Authorization": f"Bearer {cls.fan_token}"}

        # Create test creator user
        cls.creator_id = ObjectId()
        cls.creator_email = f"creator_{os.urandom(4).hex()}@tunemavens.com"
        cls.creator_user = {
            "_id": cls.creator_id,
            "name": "Ndufo Producer",
            "email": cls.creator_email,
            "role": "creator",
            "credits": 50,
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.creator_user)
        cls.creator_token = create_access_token(sub=str(cls.creator_id))
        cls.creator_headers = {"Authorization": f"Bearer {cls.creator_token}"}

    @classmethod
    def tearDownClass(cls):
        db.users.delete_many({"_id": {"$in": [cls.fan_id, cls.creator_id]}})
        db.user_libraries.delete_many({"user_id": str(cls.fan_id)})
        db.playback_history.delete_many({"user_id": str(cls.fan_id)})
        db.fan_tips.delete_many({"fan_id": str(cls.fan_id)})

    def test_01_library_fetch_and_seed(self):
        """GET /api/stream/library returns persisted crates and liked tracks."""
        res = self.client.get("/api/stream/library", headers=self.fan_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertIn("library", data)
        self.assertGreaterEqual(len(data["library"]["crates"]), 3)
        self.assertIn("liked_tracks", data["library"])

    def test_02_like_and_unlike_tracks(self):
        """POST /api/stream/library/liked toggles track like status."""
        test_track_id = "trk_consumer_test_99"
        # 1. Like track
        res1 = self.client.post(
            "/api/stream/library/liked",
            json={
                "track_id": test_track_id,
                "track_data": {"id": test_track_id, "title": "Lossless Master Test", "artist": "Ndufo"}
            },
            headers=self.fan_headers
        )
        self.assertEqual(res1.status_code, 200)
        d1 = res1.json()
        self.assertTrue(d1.get("ok"))
        self.assertTrue(d1.get("liked"))

        # Verify in GET /api/stream/library/liked
        get_res = self.client.get("/api/stream/library/liked", headers=self.fan_headers)
        self.assertEqual(get_res.status_code, 200)
        liked_tracks = get_res.json().get("liked_tracks", [])
        self.assertTrue(any(t.get("id") == test_track_id for t in liked_tracks))

        # 2. Toggle again (unlike)
        res2 = self.client.post(
            "/api/stream/library/liked",
            json={"track_id": test_track_id},
            headers=self.fan_headers
        )
        self.assertEqual(res2.status_code, 200)
        d2 = res2.json()
        self.assertFalse(d2.get("liked"))

    def test_03_custom_crates_management(self):
        """Creates, modifies, and deletes a custom music crate."""
        # Create crate
        create_res = self.client.post(
            "/api/stream/library/crates",
            json={
                "name": "Accra Midnights",
                "genre": "Afro-Fusion",
                "description": "Late night drive through Airport Residential"
            },
            headers=self.fan_headers
        )
        self.assertEqual(create_res.status_code, 200)
        crate = create_res.json().get("crate")
        crate_id = crate["id"]
        self.assertEqual(crate["name"], "Accra Midnights")

        # Add track to crate
        add_res = self.client.post(
            f"/api/stream/library/crates/{crate_id}/tracks",
            json={
                "track_id": "trk_accra_01",
                "track_data": {"id": "trk_accra_01", "title": "Golden Hour", "artist": "Black Sherif"}
            },
            headers=self.fan_headers
        )
        self.assertEqual(add_res.status_code, 200)
        updated_crate = add_res.json().get("crate")
        self.assertEqual(updated_crate["count"], 1)

        # Remove track from crate
        rem_res = self.client.delete(
            f"/api/stream/library/crates/{crate_id}/tracks/trk_accra_01",
            headers=self.fan_headers
        )
        self.assertEqual(rem_res.status_code, 200)
        self.assertEqual(rem_res.json()["crate"]["count"], 0)

        # Delete crate
        del_res = self.client.delete(f"/api/stream/library/crates/{crate_id}", headers=self.fan_headers)
        self.assertEqual(del_res.status_code, 200)
        self.assertEqual(del_res.json().get("deleted_id"), crate_id)

    def test_04_playback_history(self):
        """Records and retrieves playback history."""
        rec_res = self.client.post(
            "/api/stream/library/history",
            json={
                "track_id": "trk_hist_01",
                "title": "Nairobi Horizon",
                "artist": "Khalid Waves",
                "duration_sec": 195.5
            },
            headers=self.fan_headers
        )
        self.assertEqual(rec_res.status_code, 200)
        self.assertTrue(rec_res.json().get("ok"))

        hist_res = self.client.get("/api/stream/library/history", headers=self.fan_headers)
        self.assertEqual(hist_res.status_code, 200)
        history = hist_res.json().get("history", [])
        self.assertTrue(any(h.get("track_id") == "trk_hist_01" for h in history))

    def test_05_offline_cache_metadata(self):
        """GET /api/stream/offline-cache returns 8GB allocation and paired device sync metadata."""
        res = self.client.get("/api/stream/offline-cache", headers=self.fan_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("total_allocation_human"), "8.0 GB")
        self.assertTrue(data.get("lossless_flac_enabled"))
        self.assertEqual(data.get("target_lufs"), -12.0)
        self.assertGreaterEqual(len(data.get("devices", [])), 2)

    def test_06_offline_track_manifest_and_lease(self):
        """GET /api/stream/offline-cache/{identifier} returns 24-bit FLAC manifest with 30-day lease."""
        res = self.client.get("/api/stream/offline-cache/KE-TM1-24-00013", headers=self.fan_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("audio_format"), "audio/flac")
        self.assertEqual(data.get("bit_depth"), 24)
        self.assertEqual(data.get("sample_rate"), 96000)
        self.assertEqual(data.get("target_lufs"), -12.0)
        self.assertEqual(data.get("lease_duration_days"), 30)
        self.assertTrue(data.get("license_lease_token").startswith("TM-LEASE-"))
        self.assertTrue(data.get("etag_hash").startswith("TM-CACHE-"))

    def test_07_direct_creator_tip_flow(self):
        """POST /api/stream/tip and GET /api/stream/tips/history."""
        tip_res = self.client.post(
            "/api/stream/tip",
            json={
                "creator_id": str(self.creator_id),
                "amount_credits": 100,
                "track_id": "trk_feat_01",
                "message": "Amazing production on ENENDA!"
            },
            headers=self.fan_headers
        )
        self.assertEqual(tip_res.status_code, 200)
        data = tip_res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("gross_credits"), 100)
        self.assertEqual(data.get("creator_net_credits"), 95.0)
        self.assertEqual(data.get("platform_fee_credits"), 5.0)
        self.assertTrue(data.get("receipt_token").startswith("TM-TIP-2026-"))

        # Verify tips history
        hist_res = self.client.get("/api/stream/tips/history", headers=self.fan_headers)
        self.assertEqual(hist_res.status_code, 200)
        tips = hist_res.json().get("tips", [])
        self.assertGreaterEqual(len(tips), 1)

    def test_08_domain_mappings_registration(self):
        """Verifies tunestream.co and tunestream.tunemavens.com are in DEFAULT_MAPPINGS."""
        from routes.admin_router import DEFAULT_MAPPINGS
        keys = [m["key"] for m in DEFAULT_MAPPINGS]
        self.assertIn("tunestream-co", keys)
        self.assertIn("tunestream-subdomain", keys)


if __name__ == "__main__":
    unittest.main()
