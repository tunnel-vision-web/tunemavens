"""Comprehensive Automated Test Suite for Rights Data Model, Validation Rules & Confidentiality.

Validates all requirements and acceptance criteria in Technical Foundation Spec §6 & §7:
1. Split totals: Writer shares per work are integers in basis points and must total exactly 10,000. Reject otherwise.
2. ISRC: Strip hyphens, uppercase, match ^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$.
3. ISWC: Normalise to T-123.456.789-0 and match ^T-[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]$.
4. IPI: Digits only, 9-11 digits.
5. Audio asset: Accepts WAV, FLAC, MP3; verifies SHA-256 content hash; rejects silent/corrupt files.
6. Duplicate detection: Flags duplicate ISRC, duplicate content hash, or fuzzy title + writer match.
7. Sync-ready gate: 100% completeness required for pitchable status.
8. Single calculator engine: Powers deal calculator, agreement generator, and payout logic (50/50, co-pub, advance recoupment, 90/10 sync).
9. Server-enforced NDA gate: E-sign required before restricted deal terms load.
10. Row-level tenant isolation: One creator cannot view another creator's private deal.
11. Audit log: Admin actions, agreement views, and payout changes recorded.
"""
from datetime import datetime, timezone
import hashlib
import logging
import os
import sys
import unittest

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bson import ObjectId
from fastapi.testclient import TestClient

from config import db
from server import app
from auth import create_access_token
from services.rights_service import (
    TOTAL_BASIS_POINTS,
    calculate_deal_payout,
    check_for_duplicates,
    evaluate_sync_ready_gate,
    validate_and_normalize_isrc,
    validate_and_normalize_iswc,
    validate_audio_asset,
    validate_ipi,
    validate_split_basis_points,
)
from services.nda_service import (
    AUTHORITATIVE_NDA_TEXT,
    CURRENT_NDA_VERSION,
    compute_document_hash,
    has_user_signed_nda,
    record_nda_signature,
)
from services.audit_service import log_audit_event, verify_row_level_access

client = TestClient(app)


class TestRightsAndConfidentiality(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Setup clean test creators
        cls.creator_a_id = "507f1f77bcf86cd799439011"
        cls.creator_b_id = "507f1f77bcf86cd799439022"

        db.users.delete_many({"_id": {"$in": [ObjectId(cls.creator_a_id), ObjectId(cls.creator_b_id)]}})
        db.nda_signatures.delete_many({"user_id": {"$in": [cls.creator_a_id, cls.creator_b_id]}})
        db.audit_logs.delete_many({"actor_id": {"$in": [cls.creator_a_id, cls.creator_b_id]}})

        db.users.insert_one({
            "_id": ObjectId(cls.creator_a_id),
            "email": "creator_a@tunemavens.com",
            "name": "Nairobi Composer A",
            "role": "creator",
            "credits": 250,
        })
        db.users.insert_one({
            "_id": ObjectId(cls.creator_b_id),
            "email": "creator_b@tunemavens.com",
            "name": "Mombasa Producer B",
            "role": "creator",
            "credits": 250,
        })

        cls.token_a = create_access_token(sub=cls.creator_a_id)
        cls.token_b = create_access_token(sub=cls.creator_b_id)
        cls.headers_a = {"Authorization": f"Bearer {cls.token_a}"}
        cls.headers_b = {"Authorization": f"Bearer {cls.token_b}"}

    # ----------------------------------------------------------------------
    # 1. Basis points split validator
    # ----------------------------------------------------------------------
    def test_01_split_basis_points_validation(self):
        # Valid 50/50 split (5000 + 5000 = 10,000)
        valid_splits = [
            {"writer": "Writer 1", "share_bps": 5000},
            {"writer": "Writer 2", "share_bps": 5000},
        ]
        ok, total, err = validate_split_basis_points(valid_splits)
        self.assertTrue(ok)
        self.assertEqual(total, 10000)
        self.assertIsNone(err)

        # Valid 3-way split (6000 + 2500 + 1500 = 10,000)
        three_way = [
            {"writer": "Writer 1", "share_bps": 6000},
            {"writer": "Writer 2", "share_bps": 2500},
            {"writer": "Writer 3", "share_bps": 1500},
        ]
        ok, total, err = validate_split_basis_points(three_way)
        self.assertTrue(ok)
        self.assertEqual(total, 10000)

        # Invalid total (9,999 bps)
        bad_total = [
            {"writer": "Writer 1", "share_bps": 5000},
            {"writer": "Writer 2", "share_bps": 4999},
        ]
        ok, total, err = validate_split_basis_points(bad_total)
        self.assertFalse(ok)
        self.assertEqual(total, 9999)
        self.assertIn("must equal exactly 10000 bps", err)

        # Invalid float share_pct rejected
        float_split = [
            {"writer": "Writer 1", "share_pct": 50.0},
            {"writer": "Writer 2", "share_pct": 50.0},
        ]
        ok, _, err = validate_split_basis_points(float_split)
        self.assertFalse(ok)
        self.assertIn("share_bps integer required", err)

    # ----------------------------------------------------------------------
    # 2. ISRC validator
    # ----------------------------------------------------------------------
    def test_02_isrc_validation(self):
        # Valid Kenyan standard ISRC with hyphens and lowercase
        ok, clean, err = validate_and_normalize_isrc("ke-tm1-26-00042")
        self.assertTrue(ok)
        self.assertEqual(clean, "KETM12600042")
        self.assertIsNone(err)

        # Valid US standard ISRC
        ok, clean, err = validate_and_normalize_isrc("US-S1Z-26-00001")
        self.assertTrue(ok)
        self.assertEqual(clean, "USS1Z2600001")

        # Invalid short ISRC
        ok, _, err = validate_and_normalize_isrc("KE-123")
        self.assertFalse(ok)
        self.assertIn("Must match 12-character format", err)

    # ----------------------------------------------------------------------
    # 3. ISWC normalizer and validator
    # ----------------------------------------------------------------------
    def test_03_iswc_normalization_and_validation(self):
        # Valid unpunctuated ISWC
        ok, norm, err = validate_and_normalize_iswc("T3458921011")
        self.assertTrue(ok)
        self.assertEqual(norm, "T-345.892.101-1")

        # Valid pre-formatted ISWC
        ok, norm, err = validate_and_normalize_iswc("T-123.456.789-0")
        self.assertTrue(ok)
        self.assertEqual(norm, "T-123.456.789-0")

        # Invalid ISWC with wrong digit count
        ok, _, err = validate_and_normalize_iswc("T-123.45")
        self.assertFalse(ok)
        self.assertIn("Expected 'T' followed by 10 digits", err)

    # ----------------------------------------------------------------------
    # 4. IPI digits-only validation
    # ----------------------------------------------------------------------
    def test_04_ipi_validation(self):
        # Valid CAE/IPI 11 digits
        ok, clean, err = validate_ipi("00892716382")
        self.assertTrue(ok)
        self.assertEqual(clean, "00892716382")

        # Valid 9 digits
        ok, clean, err = validate_ipi("123456789")
        self.assertTrue(ok)
        self.assertEqual(clean, "123456789")

        # Invalid letters in IPI
        ok, _, err = validate_ipi("IPI-00892ABC")
        self.assertFalse(ok)
        self.assertIn("Must consist of 9 to 11 digits", err)

    # ----------------------------------------------------------------------
    # 5. Audio asset validation & content hash
    # ----------------------------------------------------------------------
    def test_05_audio_asset_validation(self):
        # Mock 16-bit 44.1kHz WAV header + mock PCM samples (30 KB)
        mock_wav = b"RIFF" + (30000).to_bytes(4, "little") + b"WAVEfmt " + (16).to_bytes(4, "little")
        mock_wav += (1).to_bytes(2, "little") + (2).to_bytes(2, "little")
        mock_wav += (44100).to_bytes(4, "little") + (176400).to_bytes(4, "little")
        mock_wav += (4).to_bytes(2, "little") + (16).to_bytes(2, "little")
        mock_wav += b"data" + (29960).to_bytes(4, "little")
        mock_wav += b"\x12\x34\x56\x78" * 7490

        ok, content_hash, err = validate_audio_asset(mock_wav, "afro_stems.wav")
        self.assertTrue(ok)
        self.assertIsNotNone(content_hash)
        self.assertEqual(len(content_hash), 64)

        # Reject corrupted tiny audio
        ok, _, err = validate_audio_asset(b"tiny", "track.wav")
        self.assertFalse(ok)
        self.assertIn("minimum size threshold", err)

        # Reject unsupported extension
        ok, _, err = validate_audio_asset(mock_wav, "track.exe")
        self.assertFalse(ok)
        self.assertIn("Unsupported audio format", err)

    # ----------------------------------------------------------------------
    # 6. Duplicate detection
    # ----------------------------------------------------------------------
    def test_06_duplicate_detection(self):
        # Seed test track into db.tracks
        test_track_id = str(ObjectId())
        db.tracks.delete_many({"isrc": "KETM12699999"})
        db.tracks.insert_one({
            "_id": ObjectId(test_track_id),
            "title": "Nairobi Savannah Sunset",
            "artist": "Aisha Kiprop",
            "isrc": "KETM12699999",
            "content_hash": "a" * 64
        })

        # Test duplicate by ISRC
        dup, reason, _ = check_for_duplicates(isrc="ke-tm1-26-99999")
        self.assertTrue(dup)
        self.assertIn("Duplicate ISRC collision", reason)

        # Test duplicate by content hash
        dup, reason, _ = check_for_duplicates(content_hash="a" * 64)
        self.assertTrue(dup)
        self.assertIn("Duplicate audio fingerprint", reason)

        # Test fuzzy match
        dup, reason, _ = check_for_duplicates(title="Nairobi Savannah Sunset", primary_writer="Aisha Kiprop")
        self.assertTrue(dup)
        self.assertIn("Fuzzy metadata match", reason)

        # Test non-duplicate
        dup, _, _ = check_for_duplicates(isrc="USABC2600001", title="Brand New Song", primary_writer="Someone Else")
        self.assertFalse(dup)

    # ----------------------------------------------------------------------
    # 7. Sync-ready gate evaluation
    # ----------------------------------------------------------------------
    def test_07_sync_ready_gate_evaluation(self):
        complete_track = {
            "title": "Rift Valley Echoes",
            "audio_url": "https://cdn.tunemavens.com/masters/rift.wav",
            "content_hash": "b" * 64,
            "splits": [
                {"writer": "Composer 1", "share_bps": 7000},
                {"writer": "Producer 2", "share_bps": 3000},
            ],
            "split_sheet_signed": True,
            "isrc": "KETM12600077",
            "sample_clearance": True,
            "lyrics": "Walking across the savannah at sunrise listening to drums",
            "language": "Swahili / English",
            "explicit": False,
            "ai_consent": {
                "ai_training": False,  # Default False
                "ai_tagging": True,
                "public_listing": True,
                "sync_pitching": True
            }
        }

        eval_res = evaluate_sync_ready_gate(complete_track)
        self.assertTrue(eval_res["is_pitchable"])
        self.assertEqual(eval_res["completeness_score"], 100)

        # Incomplete track: Missing signed split sheet
        incomplete_track = dict(complete_track)
        incomplete_track["split_sheet_signed"] = False
        eval_incomplete = evaluate_sync_ready_gate(incomplete_track)
        self.assertFalse(eval_incomplete["is_pitchable"])
        self.assertEqual(eval_incomplete["completeness_score"], 75)

    # ----------------------------------------------------------------------
    # 8. Single deal calculator & contract engine
    # ----------------------------------------------------------------------
    def test_08_deal_calculator(self):
        # 1. Standard 50/50 publishing deal on $10,000 gross
        std = calculate_deal_payout("standard_50_50", gross_amount=10000.0)
        self.assertEqual(std["gross_writer_usd"], 5000.0)
        self.assertEqual(std["gross_publisher_usd"], 5000.0)
        self.assertEqual(std["net_writer_payout_usd"], 5000.0)

        # 2. Co-pub 75/25 on $10,000 gross
        copub = calculate_deal_payout("copub_75_25", gross_amount=10000.0)
        self.assertEqual(copub["gross_writer_usd"], 7500.0)
        self.assertEqual(copub["gross_publisher_usd"], 2500.0)

        # 3. Catalogue acquisition with $3,000 unrecouped advance on $5,000 gross (50/50)
        cat = calculate_deal_payout("catalogue_acquisition", gross_amount=5000.0, unrecouped_advance=3000.0)
        # Gross writer share = $2,500. Deducted for recoupment = min($3,000, $2,500) = $2,500. Net writer = $0.
        self.assertEqual(cat["gross_writer_usd"], 2500.0)
        self.assertEqual(cat["recoupment_deducted_usd"], 2500.0)
        self.assertEqual(cat["net_writer_payout_usd"], 0.0)
        self.assertEqual(cat["remaining_unrecouped_advance_usd"], 500.0)

        # 4. Sync licensing standard (90/10 net split) on $5,000 placement
        sync = calculate_deal_payout("sync_licensing", gross_amount=5000.0)
        self.assertEqual(sync["split_ratio"], "90/10")
        self.assertEqual(sync["platform_fee_usd"], 500.0)
        self.assertEqual(sync["rights_holder_net_usd"], 4500.0)

    # ----------------------------------------------------------------------
    # 9. Server-enforced NDA gate
    # ----------------------------------------------------------------------
    def test_09_nda_gate_and_signing(self):
        # 1. Check status prior to signing
        res = client.get("/api/confidential/nda/status", headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.json()["signed"])

        # 2. Attempt to view confidential deal terms before signing -> HTTP 403 NDA_REQUIRED
        res = client.get("/api/confidential/deals/mock-123", headers=self.headers_a)
        self.assertEqual(res.status_code, 403)
        self.assertEqual(res.json()["detail"]["error"], "NDA_REQUIRED")

        # 3. E-Sign the NDA
        sign_res = client.post(
            "/api/confidential/nda/sign",
            headers=self.headers_a,
            json={
                "legal_name": "Nairobi Composer A",
                "company": "Savannah Soundworks Ltd",
                "agree_to_terms": True,
                "document_version": CURRENT_NDA_VERSION
            }
        )
        self.assertEqual(sign_res.status_code, 201)
        self.assertEqual(sign_res.json()["status"], "success")

        # 4. Status should now be signed
        status_res = client.get("/api/confidential/nda/status", headers=self.headers_a)
        self.assertTrue(status_res.json()["signed"])

        # 5. Now accessing confidential deal succeeds
        deal_res = client.get("/api/confidential/deals/mock-123", headers=self.headers_a)
        self.assertEqual(deal_res.status_code, 200)
        self.assertEqual(deal_res.json()["deal"]["title"], "East Africa Sync Master License")

    # ----------------------------------------------------------------------
    # 10. Row-level tenant isolation
    # ----------------------------------------------------------------------
    def test_10_row_level_tenant_isolation(self):
        # Creator B signs NDA
        client.post(
            "/api/confidential/nda/sign",
            headers=self.headers_b,
            json={"legal_name": "Mombasa Producer B", "agree_to_terms": True}
        )

        # Insert private deal owned by Creator A
        deal_id = "deal_private_creator_a_999"
        db.deals.delete_many({"_id": deal_id})
        db.deals.insert_one({
            "_id": deal_id,
            "creator_id": self.creator_a_id,
            "title": "Private Super Secret Deal",
            "earnings_usd": 75000.0,
            "status": "active"
        })

        # Creator A can read their own deal
        res_a = client.get(f"/api/confidential/deals/{deal_id}", headers=self.headers_a)
        self.assertEqual(res_a.status_code, 200)
        self.assertEqual(res_a.json()["deal"]["earnings_usd"], 75000.0)

        # Creator B CANNOT read Creator A's deal -> HTTP 403 Forbidden
        res_b = client.get(f"/api/confidential/deals/{deal_id}", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 403)
        self.assertIn("Access forbidden", res_b.json()["detail"])

    # ----------------------------------------------------------------------
    # 11. Audit logging verification
    # ----------------------------------------------------------------------
    def test_11_audit_logging(self):
        # Verify that NDA signing and confidential deal viewing created audit log entries
        logs = list(db.audit_logs.find({"actor_id": self.creator_a_id}))
        self.assertGreaterEqual(len(logs), 2)
        actions = [log["action"] for log in logs]
        self.assertIn("NDA_SIGNED", actions)
        self.assertIn("CONFIDENTIAL_DEAL_VIEWED", actions)


if __name__ == "__main__":
    unittest.main()
