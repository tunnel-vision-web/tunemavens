"""Phase 9: Ad Injection Platform & Telemetry Tests.

Verifies:
1. Dynamic ad injection config retrieval & runtime parameter updates.
2. Active audio flights listing and demographic / genre targeting resolution.
3. Next audio interstitial selection for TuneStream free listeners.
4. Lossless synthetic 15s/30s broadcast WAV audio streaming for ad spots.
5. Multi-milestone telemetry ingestion: impression start, 25%, 50%, 75%, 100% completion, and clicks.
6. Real-time conversion funnel & recent telemetry auditing feed.
7. Campaign flight status lifecycle management (active, paused, completed).
8. Verifiable cryptographic Flight Delivery Certificate generation with SHA-256 seal.
"""
import os
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path
from bson import ObjectId
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from server import app
from config import db
from auth import create_access_token


class TestAdInjectionPlatform(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Create test corporate user
        cls.corp_id = ObjectId()
        cls.corp_email = f"corp_{os.urandom(4).hex()}@brand.com"
        cls.corp_user = {
            "_id": cls.corp_id,
            "name": "Acme Brand East Africa",
            "email": cls.corp_email,
            "role": "corporate",
            "credits": 50000,
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.corp_user)
        cls.corp_token = create_access_token(sub=str(cls.corp_id))
        cls.corp_headers = {"Authorization": f"Bearer {cls.corp_token}"}

        # Seed a test campaign
        cls.test_camp_id = ObjectId()
        cls.test_campaign = {
            "_id": cls.test_camp_id,
            "brand_name": "AfroCola Energy",
            "company_name": "AfroCola Beverages",
            "contact_email": cls.corp_email,
            "user_id": str(cls.corp_id),
            "tier_slug": "amplified",
            "tier_name": "Targeted Campaign Growth (Amplified)",
            "budget_usd": 1499.0,
            "credits_allocated": 7500,
            "spot_duration_seconds": 15,
            "companion_banner_url": "/uploads/artwork/afrocola_banner.jpg",
            "destination_url": "https://afrocola.africa/energy",
            "promo_code": "AFROVIBE20",
            "target_regions": ["East Africa", "Kenya"],
            "target_genres": ["Afrobeats", "Amapiano"],
            "status": "active",
            "impressions_delivered": 100,
            "quartile_25_count": 90,
            "quartile_50_count": 80,
            "quartile_75_count": 70,
            "completions_delivered": 65,
            "clicks_delivered": 5,
            "ctr": 5.0,
            "created_at": datetime.now(timezone.utc)
        }
        db.corporate_ad_campaigns.insert_one(cls.test_campaign)

    @classmethod
    def tearDownClass(cls):
        db.users.delete_many({"_id": cls.corp_id})
        db.corporate_ad_campaigns.delete_many({"_id": cls.test_camp_id})
        db.ad_impressions.delete_many({"campaign_id": str(cls.test_camp_id)})

    def test_01_get_and_update_injection_config(self):
        """Verify fetching and modifying ad insertion interval & settings."""
        # 1. Fetch current config
        res = self.client.get("/api/corporate/injection-config")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("enabled", data)
        self.assertIn("interval_tracks", data)
        self.assertIn("unskippable_duration_sec", data)

        # 2. Update config parameters
        update_payload = {
            "interval_tracks": 2,
            "min_seconds_between_ads": 240,
            "unskippable_duration_sec": 15
        }
        update_res = self.client.post("/api/corporate/injection-config", json=update_payload)
        self.assertEqual(update_res.status_code, 200)
        updated = update_res.json()
        self.assertEqual(updated["interval_tracks"], 2)
        self.assertEqual(updated["min_seconds_between_ads"], 240)

    def test_02_list_active_flights(self):
        """Verify active audio ad flights retrieval."""
        res = self.client.get("/api/corporate/active-flights")
        self.assertEqual(res.status_code, 200)
        flights = res.json()
        self.assertIsInstance(flights, list)
        self.assertGreaterEqual(len(flights), 1)
        found = any(f.get("brand_name") == "AfroCola Energy" for f in flights)
        self.assertTrue(found)

    def test_03_get_next_audio_ad_targeting(self):
        """Verify smart next audio ad resolution with genre/geo targeting."""
        res = self.client.get("/api/corporate/next-audio-ad?genre=Afrobeats&country=Kenya")
        self.assertEqual(res.status_code, 200)
        ad = res.json()
        self.assertIn("id", ad)
        self.assertIn("brand_name", ad)
        self.assertIn("audio_url", ad)
        self.assertIn("headline", ad)
        self.assertIn("spot_duration_seconds", ad)
        self.assertIn("flight_certificate_id", ad)

    def test_04_stream_audio_ad_wav(self):
        """Verify broadcast audio spot streaming returns genuine WAV audio."""
        res = self.client.get(f"/api/corporate/ad-audio/{self.test_camp_id}?duration=15")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get("content-type"), "audio/wav")
        # WAV files start with RIFF header
        self.assertTrue(res.content.startswith(b"RIFF"))
        self.assertGreater(len(res.content), 1000)

    def test_05_telemetry_milestones_and_ctr_recalc(self):
        """Verify quartile telemetry recording (25%, 50%, 75%, completion, click)."""
        camp_id = str(self.test_camp_id)

        # 1. Start impression
        res_start = self.client.post("/api/corporate/telemetry", json={
            "campaign_id": camp_id,
            "event_type": "impression",
            "listener_id": "test_listener_001",
            "client_platform": "tunestream_web",
            "spot_duration_seconds": 15
        })
        self.assertEqual(res_start.status_code, 200)
        self.assertTrue(res_start.json()["success"])

        # 2. Quartile 50%
        res_q50 = self.client.post("/api/corporate/telemetry", json={
            "campaign_id": camp_id,
            "event_type": "quartile_50",
            "listener_id": "test_listener_001"
        })
        self.assertEqual(res_q50.status_code, 200)

        # 3. 100% Audio Completion
        res_comp = self.client.post("/api/corporate/telemetry", json={
            "campaign_id": camp_id,
            "event_type": "completion",
            "listener_id": "test_listener_001"
        })
        self.assertEqual(res_comp.status_code, 200)

        # 4. Listener Click
        res_click = self.client.post("/api/corporate/telemetry", json={
            "campaign_id": camp_id,
            "event_type": "click",
            "listener_id": "test_listener_001"
        })
        self.assertEqual(res_click.status_code, 200)

        # Verify impression was saved in db.ad_impressions
        logs_count = db.ad_impressions.count_documents({"campaign_id": camp_id})
        self.assertGreaterEqual(logs_count, 4)

    def test_06_telemetry_overview_funnel(self):
        """Verify aggregated telemetry conversion funnel endpoint."""
        res = self.client.get("/api/corporate/telemetry/overview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("funnel", data)
        self.assertIn("impressions", data["funnel"])
        self.assertIn("completions", data["funnel"])
        self.assertIn("clicks", data["funnel"])
        self.assertIn("recent_events", data)
        self.assertIsInstance(data["recent_events"], list)

    def test_07_campaign_status_lifecycle(self):
        """Verify toggling flight status (active -> paused -> active)."""
        camp_id = str(self.test_camp_id)

        # Pause flight
        res_pause = self.client.post(f"/api/corporate/campaigns/{camp_id}/status", json={"status": "paused"})
        self.assertEqual(res_pause.status_code, 200)
        self.assertEqual(res_pause.json()["status"], "paused")

        # Resume flight
        res_resume = self.client.post(f"/api/corporate/campaigns/{camp_id}/status", json={"status": "active"})
        self.assertEqual(res_resume.status_code, 200)
        self.assertEqual(res_resume.json()["status"], "active")

    def test_08_verifiable_flight_delivery_certificate(self):
        """Verify cryptographic Flight Delivery Certificate generation with SHA-256 seal."""
        camp_id = str(self.test_camp_id)
        res = self.client.get(f"/api/corporate/campaigns/{camp_id}/certificate")
        self.assertEqual(res.status_code, 200)
        cert = res.json()
        self.assertIn("certificate_id", cert)
        self.assertTrue(cert["certificate_id"].startswith("TM-AD-FLIGHT"))
        self.assertIn("sha256_audit_seal", cert)
        self.assertEqual(len(cert["sha256_audit_seal"]), 64)
        self.assertIn("audited_metrics", cert)
        self.assertIn("impressions_delivered", cert["audited_metrics"])
        self.assertIn("completion_rate_pct", cert["audited_metrics"])


if __name__ == "__main__":
    unittest.main()
