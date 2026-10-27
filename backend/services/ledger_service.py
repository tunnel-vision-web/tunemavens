"""TuneLedger — Unified Double-Entry & Immutable Credit Ledger Service.

Per Technical Foundation Spec §5.1 & §5.2:
- Route every credit balance change through one ledger service.
- Append-only entry per change with balance_after and provider reference.
- Atomic balance operations against MongoDB.
- Daily / on-demand reconciliation between cached user balance and ledger sum.
- Idempotency guarantees to prevent replay attacks and duplicate payouts/credits.
"""
from datetime import datetime, timezone
import logging
import secrets
from typing import Any, Dict, Optional
from bson import ObjectId

from config import db

logger = logging.getLogger("tune_ledger")


def _normalize_user_id(user_id: Any) -> ObjectId:
    if isinstance(user_id, ObjectId):
        return user_id
    try:
        return ObjectId(str(user_id))
    except Exception:
        # Fallback if custom string ID is used in mock environments
        return user_id


def record_transaction(
    user_id: Any,
    amount: int,
    entry_type: str,
    provider: str,
    provider_ref: str,
    idempotency_key: Optional[str] = None,
    description: str = "",
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Records an append-only transaction in the credit ledger and atomically

    updates the user's cached balance.

    :param user_id: ID of the user.
    :param amount: Signed integer (positive for reload/grant/refund, negative for spend).
    :param entry_type: E.g. 'CREDIT_RELOAD', 'CREDIT_SPEND', 'PROMO_GRANT', 'DISPUTE_REFUND'.
    :param provider: Payment rail or authority: 'stripe', 'mpesa_daraja', 'system', 'admin'.
    :param provider_ref: External transaction ID, receipt number, or order ID.
    :param idempotency_key: Unique string to prevent duplicate postings.
    :param description: Human-readable narrative.
    :param metadata: Contextual key-values.
    :return: The created ledger entry and updated user balance.
    """
    if amount == 0:
        raise ValueError("Ledger transaction amount cannot be zero.")

    if not idempotency_key:
        idempotency_key = f"LEDGER-{secrets.token_hex(12)}"

    # Idempotency check: if an entry with this idempotency key already exists, return it
    existing_entry = db.credit_ledger.find_one({"idempotency_key": idempotency_key})
    if existing_entry:
        logger.warning(f"Idempotent ledger request detected for key {idempotency_key}. Returning existing record.")
        user_doc = db.users.find_one({"_id": _normalize_user_id(user_id)})
        return {
            "status": "already_processed",
            "ledger_entry": existing_entry,
            "current_balance": user_doc.get("credits", 0) if user_doc else 0,
            "idempotent": True
        }

    now = datetime.now(timezone.utc)
    norm_id = _normalize_user_id(user_id)

    # Atomic increment on user document
    # If deducting credits, ensure balance doesn't drop below zero unless explicitly allowed
    if amount < 0:
        updated_user = db.users.find_one_and_update(
            {"_id": norm_id, "credits": {"$gte": abs(amount)}},
            {"$inc": {"credits": amount}, "$set": {"updated_at": now}},
            return_document=True
        )
        if not updated_user:
            # Check current balance to supply descriptive error
            curr_user = db.users.find_one({"_id": norm_id})
            curr_credits = curr_user.get("credits", 0) if curr_user else 0
            raise ValueError(f"Insufficient credit balance: required {abs(amount)}, current {curr_credits}.")
    else:
        updated_user = db.users.find_one_and_update(
            {"_id": norm_id},
            {"$inc": {"credits": amount}, "$set": {"updated_at": now}},
            return_document=True
        )

    if not updated_user:
        raise ValueError(f"User {user_id} not found when applying ledger transaction.")

    new_balance = updated_user.get("credits", 0)

    ledger_entry = {
        "user_id": str(norm_id),
        "amount": int(amount),
        "balance_after": int(new_balance),
        "currency": "CREDITS",
        "entry_type": entry_type,
        "provider": provider,
        "provider_ref": provider_ref,
        "idempotency_key": idempotency_key,
        "description": description,
        "metadata": metadata or {},
        "created_at": now
    }

    db.credit_ledger.insert_one(ledger_entry)

    logger.info(
        f"[TuneLedger] Recorded {amount:+d} credits for user {norm_id} "
        f"({entry_type} via {provider}, ref: {provider_ref}). New balance: {new_balance}"
    )

    return {
        "status": "success",
        "ledger_entry": ledger_entry,
        "current_balance": new_balance,
        "idempotent": False
    }


def get_ledger_balance(user_id: Any) -> int:
    """Calculates the absolute sum of all ledger entries for a user."""
    norm_id_str = str(_normalize_user_id(user_id))
    pipeline = [
        {"$match": {"user_id": norm_id_str}},
        {"$group": {"_id": "$user_id", "total": {"$sum": "$amount"}}}
    ]
    res = list(db.credit_ledger.aggregate(pipeline))
    if not res:
        return 0
    return int(res[0].get("total", 0))


def reconcile_user_balance(user_id: Any, auto_repair: bool = False) -> Dict[str, Any]:
    """Reconciles the user's cached balance with the immutable ledger sum."""
    norm_id = _normalize_user_id(user_id)
    user_doc = db.users.find_one({"_id": norm_id})
    if not user_doc:
        return {"error": f"User {user_id} not found"}

    cached_balance = int(user_doc.get("credits", 0))
    ledger_sum = get_ledger_balance(norm_id)
    matches = (cached_balance == ledger_sum)

    repaired = False
    if not matches and auto_repair:
        db.users.update_one(
            {"_id": norm_id},
            {"$set": {"credits": ledger_sum, "reconciled_at": datetime.now(timezone.utc)}}
        )
        repaired = True
        logger.warning(f"[TuneLedger] Auto-repaired user {norm_id}: cached {cached_balance} -> ledger {ledger_sum}")

    return {
        "user_id": str(norm_id),
        "cached_balance": cached_balance,
        "ledger_balance": ledger_sum,
        "matches": matches,
        "auto_repaired": repaired,
        "discrepancy": cached_balance - ledger_sum
    }


def reconcile_all_users(auto_repair: bool = False) -> Dict[str, Any]:
    """Scans all users and validates cached balances against ledger totals."""
    users = list(db.users.find({}, {"_id": 1, "email": 1, "credits": 1}))
    discrepancies = []
    total_checked = len(users)

    for u in users:
        res = reconcile_user_balance(u["_id"], auto_repair=auto_repair)
        if not res.get("matches", True):
            res["email"] = u.get("email")
            discrepancies.append(res)

    return {
        "total_users_checked": total_checked,
        "discrepancies_found": len(discrepancies),
        "discrepancies": discrepancies,
        "healthy": len(discrepancies) == 0
    }
