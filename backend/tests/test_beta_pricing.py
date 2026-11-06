"""Unit Tests for Public Beta Creator Pricing Suspension & Complimentary Credits.

Verifies:
1. GET /api/payments/credit-packages exposes beta notice with suspended creator pricing.
2. The only paying personas are: consumers/listeners, corporates, media, music supervisors, and VCs.
3. POST /api/payments/beta/complimentary-credits grants complimentary credits to creators via TuneLedger.
4. Double-entry ledger balance reconciles with zero discrepancy after beta complimentary grant.
"""
import os
import sys
from bson import ObjectId
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server import app
from auth import create_access_token
from config import db
from services import ledger_service


def test_credit_packages_exposes_beta_notice():
    client = TestClient(app)
    response = client.get("/api/payments/credit-packages")
    assert response.status_code == 200
    data = response.json()
    assert "beta_notice" in data
    beta_notice = data["beta_notice"]
    assert beta_notice["creator_pricing_suspended"] is True
    assert beta_notice["complimentary_creator_access"] is True
    paying_personas = beta_notice["paying_personas"]
    assert "consumers/listeners" in paying_personas
    assert "corporates" in paying_personas
    assert "media" in paying_personas
    assert "music supervisors" in paying_personas
    assert "vcs" in paying_personas


def test_claim_beta_complimentary_credits_and_reconciliation():
    client = TestClient(app)
    test_creator_id = str(ObjectId())
    test_user = {
        "_id": ObjectId(test_creator_id),
        "email": f"beta_creator_{test_creator_id[:6]}@tunemavens.com",
        "name": "Beta Test Creator",
        "role": "creator",
        "credits": 0,
        "region": "KE",
        "created_at": "2026-11-06T00:00:00Z"
    }
    db.users.insert_one(test_user)

    # Initial ledger opening balance of 50
    ledger_service.record_transaction(
        user_id=test_creator_id,
        amount=50,
        entry_type="OPENING_BALANCE",
        provider="system",
        provider_ref="INIT-BETA",
        description="Opening balance"
    )

    token = create_access_token(sub=test_creator_id)
    headers = {"Authorization": f"Bearer {token}"}

    # Claim complimentary beta credits (+500)
    response = client.post(
        "/api/payments/beta/complimentary-credits",
        json={"reason": "Public Beta Testing", "credits": 500},
        headers=headers
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["status"] == "granted"
    assert res_data["credits_added"] == 500
    assert res_data["new_balance"] == 550
    assert res_data["receipt_number"].startswith("TM-BETA-")

    # Verify ledger reconciliation matches perfectly with 0 discrepancy
    recon = ledger_service.reconcile_user_balance(test_creator_id)
    assert recon["matches"] is True
    assert recon["discrepancy"] == 0
    assert recon["cached_balance"] == 550
    assert recon["ledger_balance"] == 550


if __name__ == "__main__":
    test_credit_packages_exposes_beta_notice()
    print("PASS: test_credit_packages_exposes_beta_notice")
    test_claim_beta_complimentary_credits_and_reconciliation()
    print("PASS: test_claim_beta_complimentary_credits_and_reconciliation")
    print("ALL BETA PRICING TESTS PASSED!")
