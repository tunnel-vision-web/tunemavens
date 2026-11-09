"""Phase 4: Distribution Path C Negotiation Wizard & Catalogue Acquisition Ledger Tests.

Verifies:
1. Path C AI Negotiation: intelligent counter-offers, round tracking, deal acceptance.
2. DistributionDeal persistence with path='label_negotiated', splits, and audit trail.
3. Catalogue Acquisition Ledger: creation, recoupment velocity, and passport verification (TM-ACQ-YYYY-XXXX).
4. Auto-liquidation / unencumbered clearance when remaining balance hits $0.
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


class TestPathCAndCatalogueAcquisitions(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Create test label user
        cls.label_id = ObjectId()
        cls.label_email = f"label_{os.urandom(4).hex()}@tunemavens.com"
        cls.label_user = {
            "_id": cls.label_id,
            "name": "BOCM Record Label",
            "email": cls.label_email,
            "role": "label",
            "credits": 2000,
            "created_at": datetime.now(timezone.utc),
        }
        db.users.insert_one(cls.label_user)
        cls.label_token = create_access_token(sub=str(cls.label_id))
        cls.label_headers = {"Authorization": f"Bearer {cls.label_token}"}

    @classmethod
    def tearDownClass(cls):
        db.users.delete_many({"_id": cls.label_id})
        db.distribution_deals.delete_many({"creator_id": str(cls.label_id)})
        db.catalogue_acquisitions.delete_many({"creator_id": str(cls.label_id)})

    def test_01_path_c_counter_offer_small_catalogue(self):
        """Demanding 90/10 with only 8 tracks triggers AI counter-offer."""
        res = self.client.post(
            "/api/deals/distribution/negotiate",
            json={
                "label_name": "Indie Imprint Records",
                "roster_size": 2,
                "catalogue_track_count": 8,
                "proposed_creator_split": 90.0,
                "proposed_tunemavens_split": 10.0,
                "advance_requested": 0.0,
                "round_number": 1
            },
            headers=self.label_headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("status"), "counter_offer")
        self.assertIn("counter_creator_split", data)
        self.assertLessEqual(data.get("counter_creator_split"), 75.0)
        self.assertIn("TuneMavens infrastructure requires", data.get("message"))

    def test_02_path_c_accept_large_catalogue(self):
        """Proposing 80/20 with 60 tracks and $0 advance is accepted immediately."""
        res = self.client.post(
            "/api/deals/distribution/negotiate",
            json={
                "label_name": "BOCM Flagship Catalog",
                "roster_size": 18,
                "catalogue_track_count": 60,
                "proposed_creator_split": 80.0,
                "proposed_tunemavens_split": 20.0,
                "advance_requested": 0.0,
                "territory": "Worldwide",
                "term_years": 3,
                "round_number": 1
            },
            headers=self.label_headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("status"), "accepted")
        self.assertEqual(data.get("final_creator_split"), 80.0)
        self.assertEqual(data.get("final_tunemavens_split"), 20.0)
        self.assertIn("deal_id", data)

        # Verify persisted distribution deal in MongoDB
        deal = db.distribution_deals.find_one({"_id": ObjectId(data["deal_id"])})
        self.assertIsNotNone(deal)
        self.assertEqual(deal.get("path"), "label_negotiated")
        self.assertEqual(deal.get("creator_split_pct"), 80.0)
        self.assertEqual(deal.get("tunemavens_split_pct"), 20.0)
        self.assertEqual(deal.get("status"), "active")

    def test_03_path_c_with_advance_registers_acquisition(self):
        """Negotiating with a $15,000 advance registers deal and catalogue acquisition."""
        res = self.client.post(
            "/api/deals/distribution/negotiate",
            json={
                "label_name": "AfroTech Imprint",
                "roster_size": 10,
                "catalogue_track_count": 55,
                "proposed_creator_split": 75.0,
                "proposed_tunemavens_split": 25.0,
                "advance_requested": 15000.0,
                "round_number": 2
            },
            headers=self.label_headers
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("ok"))
        self.assertEqual(data.get("status"), "accepted")

        # Verify in catalogue_acquisitions collection
        acq = db.catalogue_acquisitions.find_one({
            "creator_id": str(self.label_id),
            "original_amount": 15000.0
        })
        self.assertIsNotNone(acq)
        self.assertEqual(acq.get("deal_type"), "distribution_advance")
        self.assertEqual(acq.get("remaining_balance"), 15000.0)
        self.assertTrue(acq.get("passport_id").startswith("TM-ACQ-2026-"))

    def test_04_catalogue_acquisitions_list(self):
        """GET /api/deals/catalogue-acquisitions returns facilities."""
        res = self.client.get("/api/deals/catalogue-acquisitions", headers=self.label_headers)
        self.assertEqual(res.status_code, 200)
        items = res.json()
        self.assertIsInstance(items, list)
        self.assertGreaterEqual(len(items), 1)

    def test_05_create_catalogue_acquisition(self):
        """POST /api/deals/catalogue-acquisitions records a new facility."""
        res = self.client.post(
            "/api/deals/catalogue-acquisitions",
            json={
                "deal_type": "publishing_advance",
                "original_amount": 20000.0,
                "recouped_to_date": 0.0,
                "remaining_balance": 20000.0,
                "artist_name": "Test Star Act",
                "catalogue_title": "Star Hits Vol 1 (14 Masters)",
                "track_count": 14,
                "recoupment_rate_pct": 50.0
            },
            headers=self.label_headers
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data.get("original_amount"), 20000.0)
        self.assertEqual(data.get("status"), "active")
        self.assertTrue(data.get("passport_id").startswith("TM-ACQ-2026-"))
        return data.get("id") or data.get("_id")

    def test_06_recoupment_application_and_clearance(self):
        """POST /api/deals/catalogue-acquisitions/{id}/recoup updates balance and clears title."""
        # Create a small facility to test full recoupment
        acq_doc = {
            "creator_id": str(self.label_id),
            "deal_type": "catalogue_purchase",
            "original_amount": 5000.0,
            "recouped_to_date": 3000.0,
            "remaining_balance": 2000.0,
            "artist_name": "Clearance Test Artist",
            "catalogue_title": "Mini EP Rights",
            "passport_id": "TM-ACQ-2026-TEST",
            "status": "active",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        ins = db.catalogue_acquisitions.insert_one(acq_doc)
        acq_id = str(ins.inserted_id)

        # 1. Partial recoupment ($1,000)
        res1 = self.client.post(
            f"/api/deals/catalogue-acquisitions/{acq_id}/recoup",
            json={
                "amount": 1000.0,
                "source": "Apple Music Master Royalty Statement"
            },
            headers=self.label_headers
        )
        self.assertEqual(res1.status_code, 200)
        d1 = res1.json()
        self.assertTrue(d1.get("ok"))
        self.assertEqual(d1["acquisition"]["remaining_balance"], 1000.0)
        self.assertFalse(d1.get("is_fully_recouped"))

        # 2. Final recoupment ($1,000) -> should clear title
        res2 = self.client.post(
            f"/api/deals/catalogue-acquisitions/{acq_id}/recoup",
            json={
                "amount": 1000.0,
                "source": "Spotify Split Cascade Settlement"
            },
            headers=self.label_headers
        )
        self.assertEqual(res2.status_code, 200)
        d2 = res2.json()
        self.assertTrue(d2.get("ok"))
        self.assertEqual(d2["acquisition"]["remaining_balance"], 0.0)
        self.assertEqual(d2["acquisition"]["status"], "recouped")
        self.assertTrue(d2.get("is_fully_recouped"))


if __name__ == "__main__":
    unittest.main()
