"""TuneMavens Credit Integrity & Settlement Audit Script.

Per Technical Foundation Spec §5.1:
- Scans user accounts and compares cached balances with TuneLedger immutable entries.
- Flags any credit_reloads records lacking external provider references (M-Pesa receipt, Stripe session/charge).
- Generates an integrity discrepancy report suitable for settlement reconciliation.
"""
from datetime import datetime, timezone
import json
import logging
import os
import sys

# Ensure backend root is on Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db
from services.ledger_service import reconcile_all_users, get_ledger_balance

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("audit_credits")


def audit_credit_reloads():
    """Audits credit_reloads collection for suspicious or unverified reloads."""
    reloads = list(db.credit_reloads.find({}))
    suspicious = []
    verified = []

    for r in reloads:
        r_id = str(r.get("_id"))
        status = r.get("status")
        provider = r.get("payment_method")
        mpesa_receipt = r.get("mpesa_receipt")
        checkout_id = r.get("checkout_id") or r.get("checkout_request_id")
        user_id = str(r.get("user_id"))
        credits = r.get("credits", 0)

        # Flag if completed without provider confirmation
        is_suspicious = False
        reasons = []

        if status == "completed":
            if provider == "mpesa" and not mpesa_receipt:
                is_suspicious = True
                reasons.append("M-Pesa completed reload has no MpesaReceiptNumber from Safaricom callback")
            if not checkout_id:
                is_suspicious = True
                reasons.append("Completed reload missing checkout reference")

        entry = {
            "reload_id": r_id,
            "user_id": user_id,
            "status": status,
            "credits": credits,
            "provider": provider,
            "reasons": reasons
        }

        if is_suspicious:
            suspicious.append(entry)
        else:
            verified.append(entry)

    return {
        "total_reloads": len(reloads),
        "verified_count": len(verified),
        "suspicious_count": len(suspicious),
        "suspicious_entries": suspicious
    }


def run_full_audit(auto_repair: bool = False):
    """Executes full credit integrity audit."""
    logger.info("=== Starting TuneMavens Credit Integrity & Settlement Audit ===")

    # 1. Audit reload records
    reload_audit = audit_credit_reloads()
    logger.info(f"Total credit reload records: {reload_audit['total_reloads']}")
    logger.info(f"Verified reloads: {reload_audit['verified_count']}")
    if reload_audit['suspicious_count'] > 0:
        logger.warning(f"SUSPICIOUS RELOADS FOUND: {reload_audit['suspicious_count']}")
        for s in reload_audit['suspicious_entries']:
            logger.warning(f"  - Reload {s['reload_id']} (User {s['user_id']}): {', '.join(s['reasons'])}")
    else:
        logger.info("No suspicious reload records found.")

    # 2. Reconcile user balances against TuneLedger
    logger.info("Reconciling user balances against TuneLedger entries...")
    user_audit = reconcile_all_users(auto_repair=auto_repair)
    logger.info(f"Total users checked: {user_audit['total_users_checked']}")
    logger.info(f"Discrepancies found: {user_audit['discrepancies_found']}")

    if user_audit['discrepancies_found'] > 0:
        for d in user_audit['discrepancies']:
            logger.warning(
                f"  - User {d['user_id']} ({d.get('email')}): Cached={d['cached_balance']}, "
                f"Ledger={d['ledger_balance']} (Discrepancy: {d['discrepancy']:+d})"
            )
    else:
        logger.info("All user balances perfectly match TuneLedger records.")

    logger.info("=== Credit Integrity Audit Completed ===")
    return {
        "reload_audit": reload_audit,
        "user_audit": user_audit,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    repair_flag = "--repair" in sys.argv
    run_full_audit(auto_repair=repair_flag)
