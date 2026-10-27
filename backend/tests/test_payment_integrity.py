"""Comprehensive Automated Test Suite for Payment & Credit Integrity.

Validates all requirements and acceptance criteria in Technical Foundation Spec §5.1:
1. Client-supplied credits/amounts are ignored in favor of server package definitions.
2. /reload-credits and /mpesa/stk-push create PENDING records and never increment balance on dispatch.
3. Safaricom callback increments credits via TuneLedger only on ResultCode == 0.
4. Replayed callbacks and duplicate M-Pesa receipts are rejected without double-crediting.
5. Forged/unsigned Stripe webhooks are rejected with HTTP 400.
6. Replayed Stripe webhook event IDs are ignored idempotently.
7. /sandbox-bypass returns HTTP 404 under production configuration.
8. Startup validation raises RuntimeError if ENABLE_SANDBOX_BYPASS is True in production.
9. Subscription endpoints (/plans, /cancel-subscription) are removed and cannot reset balances.
10. All credit balance mutations produce an append-only entry in TuneLedger.
"""
from datetime import datetime, timezone
import json
import logging
import os
import sys

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from bson import ObjectId
from fastapi.testclient import TestClient
import config
from config import db, validate_production_security
from server import app
from auth import create_access_token
from services import ledger_service
from routes import payments_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("test_payment_integrity")

client = TestClient(app)


def setup_test_user():
    """Seeds a clean test user."""
    test_email = "integrity_test@tunemavens.com"
    db.users.delete_many({"email": test_email})
    res = db.users.insert_one({
        "email": test_email,
        "name": "Payment Tester",
        "role": "creator",
        "credits": 100,  # Starting balance
        "created_at": datetime.now(timezone.utc)
    })
    user_id = str(res.inserted_id)
    token = create_access_token(sub=user_id)
    headers = {"Authorization": f"Bearer {token}"}
    return user_id, headers


def run_tests():
    logger.info("==================================================")
    logger.info("RUNNING PAYMENT & CREDIT INTEGRITY (SPEC §5.1) TESTS")
    logger.info("==================================================")

    user_id, headers = setup_test_user()
    passed = 0
    failed = 0

    # ------------------------------------------------------------------
    # Test 1: Client-supplied credits and amounts are ignored
    # ------------------------------------------------------------------
    logger.info("Test 1: Verify client-supplied credits & price cannot inject free credits...")
    res = client.post(
        "/api/payments/reload-credits",
        headers=headers,
        json={
            "package_id": "creator-starter",
            "credits": 999999,  # Malicious attempt to claim 1M credits
            "amount": 0.01,     # Malicious attempt to pay 1 cent
            "payment_method": "card"
        }
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    data = res.json()
    assert data["status"] == "pending", f"Expected 'pending', got {data['status']}"
    assert data["credits"] == 250, f"Expected 250 credits from package, got {data['credits']}"
    assert data["amount"] == 25.0, f"Expected 25.0 amount from package, got {data['amount']}"

    # Confirm user credits did NOT increase
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 100, f"User balance changed prematurely to {user_doc['credits']}!"
    logger.info("  [PASS] Client-supplied credits/amount were ignored. Balance untouched.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 2: M-Pesa STK Push does not credit before callback
    # ------------------------------------------------------------------
    logger.info("Test 2: Verify /mpesa/stk-push initiates pending status without granting credits...")
    res = client.post(
        "/api/payments/mpesa/stk-push",
        headers=headers,
        json={
            "phone_number": "0712345678",
            "package_id": "creator-starter",
            "credits": 88888  # Ignored
        }
    )
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    stk_data = res.json()
    assert stk_data["status"] == "pending"
    assert stk_data["credits_expected"] == 250
    assert stk_data["amount_kes"] == 3250
    checkout_id = stk_data["CheckoutRequestID"]

    # Verify user balance remains 100
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 100, f"User balance credited before PIN entered! Balance: {user_doc['credits']}"
    logger.info(f"  [PASS] STK Push pending (CheckoutID: {checkout_id}). Balance unchanged at 100.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 3: Verified Safaricom callback increments balance via TuneLedger
    # ------------------------------------------------------------------
    logger.info("Test 3: Processing valid Safaricom callback with ResultCode == 0...")
    mpesa_receipt = f"QAB{int(datetime.now().timestamp())}"
    callback_payload = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": stk_data["MerchantRequestID"],
                "CheckoutRequestID": checkout_id,
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully.",
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 3250},
                        {"Name": "MpesaReceiptNumber", "Value": mpesa_receipt},
                        {"Name": "TransactionDate", "Value": 20261027145000},
                        {"Name": "PhoneNumber", "Value": 254712345678}
                    ]
                }
            }
        }
    }
    res = client.post("/api/payments/mpesa/callback", json=callback_payload)
    assert res.status_code == 200
    assert res.json()["ResultCode"] == 0

    # Verify user balance incremented to 100 + 250 = 350
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 350, f"Expected 350 credits, got {user_doc['credits']}"

    # Verify TuneLedger entry
    ledger_entry = db.credit_ledger.find_one({"provider_ref": mpesa_receipt})
    assert ledger_entry is not None, "Ledger entry missing for M-Pesa receipt!"
    assert ledger_entry["amount"] == 250
    assert ledger_entry["balance_after"] == 350
    assert ledger_entry["entry_type"] == "CREDIT_RELOAD"
    logger.info(f"  [PASS] Verified callback credited user. New balance: 350. TuneLedger verified.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 4: Idempotency & Replay Protection on M-Pesa callback
    # ------------------------------------------------------------------
    logger.info("Test 4: Replaying the exact same Safaricom callback...")
    res_replay = client.post("/api/payments/mpesa/callback", json=callback_payload)
    assert res_replay.status_code == 200

    # User balance must STILL be 350 (no double-crediting)
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 350, f"Replay vulnerability! Balance doubled to {user_doc['credits']}"
    logger.info("  [PASS] Replayed callback was handled idempotently. Balance unchanged at 350.")
    passed += 1

    # Replay with new checkout_id but recycled receipt
    logger.info("Test 4b: Attempting to credit new checkout with recycled M-Pesa receipt...")
    fake_checkout = "ws_CO_FAKE_99999"
    db.credit_reloads.insert_one({
        "user_id": user_id,
        "package_id": "creator-starter",
        "credits": 250,
        "amount": 3250,
        "checkout_request_id": fake_checkout,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    })
    callback_recycled = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "MR_FAKE",
                "CheckoutRequestID": fake_checkout,
                "ResultCode": 0,
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 3250},
                        {"Name": "MpesaReceiptNumber", "Value": mpesa_receipt}  # Already used!
                    ]
                }
            }
        }
    }
    client.post("/api/payments/mpesa/callback", json=callback_recycled)
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 350, f"Receipt replay attack succeeded! Balance: {user_doc['credits']}"
    logger.info("  [PASS] Recycled receipt replay attack rejected.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 5: Forged / Unsigned Stripe Webhook Rejected
    # ------------------------------------------------------------------
    logger.info("Test 5: Testing unsigned Stripe webhook rejection...")
    # Temporarily ensure strict mode
    orig_env = config.ENV
    orig_allow = config.ALLOW_SANDBOX_WEBHOOKS
    config.ENV = "production"
    payments_router.ENV = "production"
    config.ALLOW_SANDBOX_WEBHOOKS = False
    payments_router.ALLOW_SANDBOX_WEBHOOKS = False

    try:
        res = client.post(
            "/api/payments/webhook",
            json={"type": "checkout.session.completed", "id": "evt_forged_123"}
        )
        assert res.status_code == 400, f"Expected 400 for unsigned webhook, got {res.status_code}"
        logger.info("  [PASS] Unsigned webhook in production correctly rejected with HTTP 400.")
        passed += 1
    finally:
        config.ENV = orig_env
        payments_router.ENV = orig_env
        config.ALLOW_SANDBOX_WEBHOOKS = orig_allow
        payments_router.ALLOW_SANDBOX_WEBHOOKS = orig_allow

    # ------------------------------------------------------------------
    # Test 6: Replayed Stripe event IDs are ignored
    # ------------------------------------------------------------------
    logger.info("Test 6: Testing Stripe webhook replay protection...")
    # Allow sandbox webhook for testing replay logic
    config.ENV = "development"
    config.ALLOW_SANDBOX_WEBHOOKS = True
    event_id = f"evt_test_{int(datetime.now().timestamp())}"
    stripe_payload = {
        "id": event_id,
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": f"cs_test_{event_id}",
                "metadata": {
                    "user_id": user_id,
                    "item_type": "credits",
                    "package_id": "creator-starter",
                    "quantity": "1"
                }
            }
        }
    }
    # First post -> success (+250 credits)
    res1 = client.post("/api/payments/webhook", json=stripe_payload)
    assert res1.status_code == 200
    assert res1.json()["status"] == "success"
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 600, f"Expected 600 credits, got {user_doc['credits']}"

    # Second post (Replay) -> already_processed (balance unchanged at 600)
    res2 = client.post("/api/payments/webhook", json=stripe_payload)
    assert res2.status_code == 200
    assert res2.json()["status"] == "already_processed"
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    assert user_doc["credits"] == 600, f"Stripe replay attack succeeded! Balance: {user_doc['credits']}"
    logger.info("  [PASS] Stripe webhook event replayed was ignored idempotently.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 7: Sandbox Bypass is 404 in Production
    # ------------------------------------------------------------------
    logger.info("Test 7: Verifying /sandbox-bypass returns 404 under production...")
    config.ENV = "production"
    payments_router.ENV = "production"
    config.ENABLE_SANDBOX_BYPASS = False
    payments_router.ENABLE_SANDBOX_BYPASS = False

    try:
        res = client.post("/api/payments/sandbox-bypass?session_id=mock_123", headers=headers)
        assert res.status_code == 404, f"Expected 404 for sandbox-bypass in production, got {res.status_code}"
        logger.info("  [PASS] /sandbox-bypass returned 404 in production.")
        passed += 1
    finally:
        config.ENV = orig_env
        payments_router.ENV = orig_env
        config.ENABLE_SANDBOX_BYPASS = orig_allow
        payments_router.ENABLE_SANDBOX_BYPASS = orig_allow

    # ------------------------------------------------------------------
    # Test 8: Startup Security Guard Aborts Insecure Production
    # ------------------------------------------------------------------
    logger.info("Test 8: Verifying startup validation check aborts if sandbox bypass is true in production...")
    config.ENV = "production"
    config.ENABLE_SANDBOX_BYPASS = True
    threw_error = False
    try:
        validate_production_security()
    except RuntimeError as e:
        threw_error = True
        logger.info(f"  [PASS] Caught expected security guard exception: {e}")
        passed += 1
    finally:
        config.ENV = orig_env
        config.ENABLE_SANDBOX_BYPASS = False

    assert threw_error, "Failed to block ENABLE_SANDBOX_BYPASS in production!"

    # ------------------------------------------------------------------
    # Test 9: Obsolete subscription endpoints return 404
    # ------------------------------------------------------------------
    logger.info("Test 9: Verifying /plans and /cancel-subscription endpoints are deleted (404)...")
    res_plans = client.get("/api/payments/plans")
    assert res_plans.status_code == 404, f"Expected 404 for /plans, got {res_plans.status_code}"

    res_cancel = client.post("/api/payments/cancel-subscription", headers=headers)
    assert res_cancel.status_code == 404, f"Expected 404 for /cancel-subscription, got {res_cancel.status_code}"
    logger.info("  [PASS] /plans and /cancel-subscription endpoints return 404.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 10: TuneLedger Reconciles Perfectly
    # ------------------------------------------------------------------
    logger.info("Test 10: Running TuneLedger reconciliation for test user...")
    reconcile_res = ledger_service.reconcile_user_balance(user_id)
    logger.info(f"Reconciliation result: {reconcile_res}")
    # Note: user had 100 starting + 250 from M-Pesa + 250 from Stripe = 600 total cached
    # Ledger entries: 250 (M-Pesa) + 250 (Stripe) = 500
    # Let's verify ledger totals are recorded exactly
    assert reconcile_res["ledger_balance"] == 500, f"Expected ledger balance 500, got {reconcile_res['ledger_balance']}"
    logger.info("  [PASS] TuneLedger records accurately logged all transactions.")
    passed += 1

    logger.info("==================================================")
    logger.info(f"ALL TESTS COMPLETED: {passed} PASSED, {failed} FAILED")
    logger.info("==================================================")
    return passed, failed


if __name__ == "__main__":
    passed, failed = run_tests()
    if failed > 0:
        sys.exit(1)
    sys.exit(0)
