"""TuneLedger — Unified Double-Entry & Immutable Credit Ledger Service.

Per Technical Foundation Spec §5.1 & §5.2:
- Route every credit balance change through one ledger service.
- Append-only entry per change with balance_after and provider reference.
- Atomic balance operations against MongoDB.
- Daily / on-demand reconciliation between cached user balance and ledger sum.
- Idempotency guarantees to prevent replay attacks and duplicate payouts/credits.
- Safe reconciliation: Opening-balance entries for legacy users to prevent credit erasure (Row 11).
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
    :param entry_type: E.g. 'CREDIT_RELOAD', 'CREDIT_SPEND', 'PROMO_GRANT', 'DISPUTE_REFUND', 'OPENING_BALANCE'.
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
        "amount": float(amount) if isinstance(amount, float) else int(amount),
        "balance_after": float(new_balance) if isinstance(new_balance, float) else int(new_balance),
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

    fmt_amount = f"{amount:+.4f}".rstrip('0').rstrip('.') if isinstance(amount, float) else f"{amount:+d}"
    logger.info(
        f"[TuneLedger] Recorded {fmt_amount} credits for user {norm_id} "
        f"({entry_type} via {provider}, ref: {provider_ref}). New balance: {new_balance}"
    )

    # Dispatch communication notification for credit adjustments
    if entry_type != "OPENING_BALANCE" and updated_user and updated_user.get("email"):
        try:
            from account_setup import send_credit_balance_notification
            send_credit_balance_notification(
                to=updated_user["email"],
                name=updated_user.get("name") or "",
                delta=amount,
                new_balance=new_balance,
                reason=description or f"{entry_type} via {provider}",
                role=updated_user.get("role") or "creator",
                tx_id=provider_ref or idempotency_key
            )
        except Exception as e:
            logger.warning(f"[TuneLedger] Failed to dispatch credit notification email: {e}")

    return {
        "status": "success",
        "ledger_entry": ledger_entry,
        "current_balance": new_balance,
        "idempotent": False
    }


def initialize_user_opening_balance(
    user_id: Any,
    initial_credits: Optional[int] = None,
    description: str = "Opening balance initialization",
    force: bool = False,
) -> Dict[str, Any]:
    """Writes an immutable opening-balance ledger entry for a user (Spec §5.1 Row 11).

    Ensures that existing users who held credits before the ledger existed do not suffer
    reconciliation mismatches or accidental balance erasure when reconciliation runs.
    """
    norm_id = _normalize_user_id(user_id)
    norm_id_str = str(norm_id)
    user_doc = db.users.find_one({"_id": norm_id})
    if not user_doc:
        raise ValueError(f"User {user_id} not found when initializing opening balance.")

    credits_to_record = initial_credits if initial_credits is not None else int(user_doc.get("credits", 0))
    if credits_to_record <= 0:
        return {"status": "skipped", "reason": "No positive starting balance to record", "amount": 0}

    # Check if user already has an opening balance entry
    existing_opening = db.credit_ledger.find_one({"user_id": norm_id_str, "entry_type": "OPENING_BALANCE"})
    if existing_opening and not force:
        return {"status": "already_initialized", "ledger_entry": existing_opening}

    # Check if user already has ledger activity
    existing_count = db.credit_ledger.count_documents({"user_id": norm_id_str})
    if existing_count > 0 and not force:
        logger.info(f"[TuneLedger] User {norm_id} already has {existing_count} ledger entries. Skipping opening balance.")
        return {"status": "already_active", "existing_entries": existing_count}

    now = datetime.now(timezone.utc)
    idempotency_key = f"OPENING-BAL-{norm_id_str}"
    ledger_entry = {
        "user_id": norm_id_str,
        "amount": int(credits_to_record),
        "balance_after": int(credits_to_record),
        "currency": "CREDITS",
        "entry_type": "OPENING_BALANCE",
        "provider": "system_migration",
        "provider_ref": idempotency_key,
        "idempotency_key": idempotency_key,
        "description": description,
        "metadata": {"initial_cached_balance": int(user_doc.get("credits", 0))},
        "created_at": now
    }
    db.credit_ledger.insert_one(ledger_entry)
    logger.info(f"[TuneLedger] Recorded opening balance of +{credits_to_record} credits for user {norm_id_str}.")
    return {"status": "success", "ledger_entry": ledger_entry}


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


def reconcile_user_balance(
    user_id: Any,
    auto_repair: bool = False,
    allow_destructive_zero: bool = False
) -> Dict[str, Any]:
    """Reconciles the user's cached balance with the immutable ledger sum.

    Per Technical Foundation Spec §5.1 Row 11:
    - Runs in report-only mode by default (auto_repair=False).
    - If auto_repair is invoked and a pre-existing user had cached credits with zero ledger records,
      creates an opening-balance ledger entry instead of destroying their balance.
    """
    norm_id = _normalize_user_id(user_id)
    user_doc = db.users.find_one({"_id": norm_id})
    if not user_doc:
        return {"error": f"User {user_id} not found"}

    cached_balance = int(user_doc.get("credits", 0))
    ledger_sum = get_ledger_balance(norm_id)
    matches = (cached_balance == ledger_sum)

    repaired = False
    discrepancy = cached_balance - ledger_sum

    if not matches and auto_repair:
        ledger_count = db.credit_ledger.count_documents({"user_id": str(norm_id)})
        if ledger_count == 0 and cached_balance > 0 and not allow_destructive_zero:
            # Prevent destructive zeroing of pre-existing user balances (Spec §5.1 Row 11)
            logger.warning(
                f"[TuneLedger SAFETY GUARD] User {norm_id} has cached balance {cached_balance} "
                f"but zero ledger entries. Auto-initializing opening balance instead of erasing credits."
            )
            initialize_user_opening_balance(
                user_id=norm_id,
                initial_credits=cached_balance,
                description="Auto-reconciliation opening balance recovery"
            )
            ledger_sum = get_ledger_balance(norm_id)
            matches = (cached_balance == ledger_sum)
            repaired = True
            discrepancy = 0
        else:
            db.users.update_one(
                {"_id": norm_id},
                {"$set": {"credits": ledger_sum, "reconciled_at": datetime.now(timezone.utc)}}
            )
            repaired = True
            logger.warning(f"[TuneLedger] Auto-repaired user {norm_id}: cached {cached_balance} -> ledger {ledger_sum}")
            discrepancy = 0

    return {
        "user_id": str(norm_id),
        "cached_balance": cached_balance,
        "ledger_balance": ledger_sum,
        "matches": matches,
        "auto_repaired": repaired,
        "discrepancy": discrepancy
    }


def reconcile_all_users(auto_repair: bool = False, allow_destructive_zero: bool = False) -> Dict[str, Any]:
    """Scans all users and validates cached balances against ledger totals.
    Runs in report-only mode by default.
    """
    users = list(db.users.find({}, {"_id": 1, "email": 1, "credits": 1}))
    discrepancies = []
    total_checked = len(users)

    for u in users:
        res = reconcile_user_balance(u["_id"], auto_repair=auto_repair, allow_destructive_zero=allow_destructive_zero)
        if not res.get("matches", True):
            res["email"] = u.get("email")
            discrepancies.append(res)

    return {
        "total_users_checked": total_checked,
        "discrepancies_found": len(discrepancies),
        "discrepancies": discrepancies,
        "healthy": len(discrepancies) == 0
    }
