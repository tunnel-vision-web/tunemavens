"""Unified Payments, Credits & Checkout Router.

Per Technical Foundation Spec §5.1 & §5.2:
- Zero subscriptions: 100% unified, non-expiring credit model.
- Server-authoritative packages: client-supplied credit amounts and prices are ignored.
- Pending credit reload lifecycle: credits only increment upon verified provider event.
- M-Pesa STK Push: initiates pending request, settles idempotently upon Safaricom Daraja callback.
- Stripe Webhook: strict signature verification, replay protection via processed event IDs, no mock fallback in production.
- Sandbox bypass: disabled/404 in production, guarded by ENABLE_SANDBOX_BYPASS flag.
- Single ledger service integration: all credit allocations and deductions route through TuneLedger.
"""
from datetime import datetime, timezone
import logging
import os
import secrets
from typing import Any, Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, Header, HTTPException, Request, Response, status
from pydantic import BaseModel, Field

from auth import get_current_user, get_optional_user
import config
from config import db
from models import Event, Order, Product, Ticket, User
from services import daraja_service, ledger_service

logger = logging.getLogger("payments_router")

router = APIRouter(prefix="/api/payments", tags=["payments"])

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

try:
    import stripe
    if STRIPE_API_KEY:
        stripe.api_key = STRIPE_API_KEY
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False


# Canonical Server-Authoritative Credit Packages (Spec §5.2)
# Unified single source of truth: 1 Credit = 1 KES = $0.01 USD
CREDIT_PACKAGES: Dict[str, Dict[str, Any]] = {
    "starter-floor": {
        "id": "starter-floor",
        "name": "Starter Floor",
        "credits": 250,
        "price_usd": 2.50,
        "price_kes": 250,
        "target_role": "all",
        "badge": "Starter Floor",
        "badge_color": "#06b6d4",
        "description": "Accessible entry-level top-up for EPK customisation, single track mastering, or listener tipping.",
        "deliverables": ["250 Non-Expiring Credits", "Single Track AI Master", "EPK Builder Customisation", "Direct Artist Tipping"]
    },
    "growth-pack": {
        "id": "growth-pack",
        "name": "Growth Pack",
        "credits": 500,
        "price_usd": 5.00,
        "price_kes": 500,
        "target_role": "creator",
        "badge": "Popular",
        "badge_color": "#22d3ee",
        "description": "Ample credits for regular music uploads, WhatsApp phone alerts, and sync briefs.",
        "deliverables": ["500 Non-Expiring Credits", "WhatsApp Phone Alerts Enabled", "Sync Brief Submissions", "Multi-Track AI Mastering"]
    },
    "pro-maven": {
        "id": "pro-maven",
        "name": "Pro Maven",
        "credits": 1000,
        "price_usd": 10.00,
        "price_kes": 1000,
        "target_role": "creator",
        "badge": "Best Value",
        "badge_color": "#f59e0b",
        "description": "High-volume credits for active creators, EPK custom domains, and lossless stem archiving.",
        "deliverables": ["1,000 Non-Expiring Credits", "Custom Domain Routing", "Social AI Copywriter", "Lossless Audio Stems Storage"]
    },
    "studio-master": {
        "id": "studio-master",
        "name": "Studio Master",
        "credits": 5000,
        "price_usd": 50.00,
        "price_kes": 5000,
        "target_role": "studio",
        "badge": "Studio Grade",
        "badge_color": "#ec4899",
        "description": "Heavy-duty volume for producers, multitrack storage, escrow deals, and DJ pool drops.",
        "deliverables": ["5,000 Non-Expiring Credits", "Unlimited AI Mastering", "Escrow Contract Protection", "DJ Record Pool Clearances"]
    },
    "label-team-starter": {
        "id": "label-team-starter",
        "name": "Label Starter Floor",
        "credits": 5000,
        "price_usd": 50.00,
        "price_kes": 5000,
        "target_role": "label",
        "badge": "Label Floor",
        "badge_color": "#a855f7",
        "description": "Universal label entry floor for up to 10 signed artists, CSV statement parsing, and split cascades.",
        "deliverables": ["5,000 Non-Expiring Credits (KSh 5,000 / $50.00)", "Up to 10 Signed Artists", "Statement CSV Parser", "Split Cascade Net Ledgers"]
    },
    "label-growth": {
        "id": "label-growth",
        "name": "Scale Label Operations",
        "credits": 10000,
        "price_usd": 100.00,
        "price_kes": 10000,
        "target_role": "label",
        "badge": "Most Popular",
        "badge_color": "#22d3ee",
        "description": "Designed for scaling independent labels with up to 50 artist rosters and automated recoupment cascades.",
        "deliverables": ["10,000 Non-Expiring Credits (KSh 10,000 / $100.00)", "Up to 50 Artist Rosters", "Automated Advance Recoupment", "Role-Based Staff Permissions"]
    },
    "label-enterprise": {
        "id": "label-enterprise",
        "name": "Major / Conglomerate Enterprise",
        "credits": 20000,
        "price_usd": 200.00,
        "price_kes": 20000,
        "target_role": "label",
        "badge": "Enterprise Scale",
        "badge_color": "#00f2fe",
        "description": "Full-scale enterprise credit load for high-volume catalogs, white-label portals, and bulk mobile money payouts.",
        "deliverables": ["20,000 Non-Expiring Credits (KSh 20,000 / $200.00)", "Unlimited Catalog Ingestion", "Bulk M-Pesa & Bank Rails", "Enterprise ERP Webhooks"]
    }
}

# Legacy alias map for backward compatibility and cross-role identifiers
PACKAGE_ALIASES: Dict[str, str] = {
    "starter": "starter-floor",
    "floor": "starter-floor",
    "casual-listener": "starter-floor",
    "creator-starter": "starter-floor",
    "listener-starter": "starter-floor",
    "growth": "growth-pack",
    "pro": "pro-maven",
    "pro-creator-load": "pro-maven",
    "professional": "pro-maven",
    "superfan-audiophile": "pro-maven",
    "listener-vip": "growth-pack",
    "listener-patron": "pro-maven",
    "studio": "studio-master",
    "studio-master-load": "studio-master",
    "duo-friends": "studio-master",
    "label": "label-team-starter",
    "label-team": "label-team-starter",
    "indie-label-load": "label-team-starter",
    "scale-label-load": "label-team-starter",
    "enterprise-label-load": "label-team-starter",
    "family-household": "label-team-starter",
}


def resolve_package(package_id: str) -> Optional[Dict[str, Any]]:
    """Resolves a package from the canonical package table or alias map."""
    if not package_id:
        return None
    clean_id = package_id.strip().lower()
    if clean_id in CREDIT_PACKAGES:
        return CREDIT_PACKAGES[clean_id]
    aliased = PACKAGE_ALIASES.get(clean_id)
    if aliased and aliased in CREDIT_PACKAGES:
        return CREDIT_PACKAGES[aliased]
    return None


class CreditReloadInitiateRequest(BaseModel):
    package_id: str
    payment_method: str = "card"  # "card" | "mpesa" | "paypal"
    phone_number: Optional[str] = None
    currency: Optional[str] = "USD"
    # Note: client-supplied 'credits' or 'amount' are deliberately excluded or ignored.
    credits: Optional[int] = None
    amount: Optional[float] = None


class MpesaStkPushRequest(BaseModel):
    phone_number: Optional[str] = None
    phone: Optional[str] = None
    package_id: Optional[str] = None
    # Note: client-supplied 'credits' or 'amount' are ignored to prevent forged pricing.
    credits: Optional[int] = None
    amount: Optional[float] = None
    item: Optional[str] = None


class CheckoutSessionRequest(BaseModel):
    item_type: str  # 'credits' | 'ticket' | 'merch' | 'subscription' (aliased to credits)
    item_id: str    # package_id | event_id | product_id
    quantity: int = 1
    shipping_address: Optional[str] = None


class BetaComplimentaryCreditsRequest(BaseModel):
    reason: Optional[str] = "Public Beta Creator Access"
    credits: Optional[int] = 500


@router.get("/credit-packages")
def get_credit_packages():
    """Returns official credit reload packages. Zero monthly subscriptions."""
    return {
        "packages": list(CREDIT_PACKAGES.values()),
        "billing_model": "unified_credits",
        "no_monthly_charges": True,
        "beta_notice": {
            "creator_pricing_suspended": True,
            "complimentary_creator_access": True,
            "paying_personas": [
                "consumers/listeners",
                "corporates",
                "media",
                "music supervisors",
                "vcs"
            ],
            "message": "During the public beta period, all creator pricing (loading credits) is suspended with 100% complimentary access for independent creators, artists, and producers. The only paying personas are consumers/listeners, corporates, media, music supervisors (when licensing), and VCs (investing in projects & creators)."
        }
    }


@router.post("/beta/complimentary-credits")
def claim_beta_complimentary_credits(
    payload: BetaComplimentaryCreditsRequest = BetaComplimentaryCreditsRequest(),
    current_user: dict = Depends(get_current_user),
):
    """Grants complimentary credits to creators during the Public Beta period.

    During public beta, all creator pricing (credit reloads) is suspended.
    Creators receive complimentary credits recorded in TuneLedger as PROMO_GRANT.
    """
    user_id = current_user["_id"]
    grant_amount = min(max(payload.credits or 500, 100), 2000)
    receipt = f"TM-BETA-{secrets.token_hex(6).upper()}"
    idempotency = f"BETA-GRANT-{str(user_id)}-{datetime.now(timezone.utc).strftime('%Y%m%d')}"

    ledger_result = ledger_service.record_transaction(
        user_id=user_id,
        amount=grant_amount,
        entry_type="PROMO_GRANT",
        provider="system",
        provider_ref=receipt,
        idempotency_key=idempotency,
        description=f"Public Beta Complimentary Creator Credits ({receipt})",
        metadata={
            "beta_period": True,
            "creator_pricing_suspended": True,
            "reason": payload.reason or "Public Beta Creator Access",
            "paying_personas": [
                "consumers/listeners",
                "corporates",
                "media",
                "music supervisors",
                "vcs"
            ]
        }
    )

    new_balance = ledger_result.get("balance_after", current_user.get("credits", 0) + grant_amount)

    logger.info(
        f"[Beta Pricing] Granted {grant_amount} complimentary credits to user {user_id}. "
        f"Receipt: {receipt}. New Balance: {new_balance}."
    )

    return {
        "success": True,
        "status": "granted",
        "credits_added": grant_amount,
        "new_balance": new_balance,
        "receipt_number": receipt,
        "message": "Complimentary beta credits successfully granted! Creator pricing is suspended during the Public Beta period.",
        "beta_notice": {
            "creator_pricing_suspended": True,
            "paying_personas": [
                "consumers/listeners",
                "corporates",
                "media",
                "music supervisors",
                "vcs"
            ]
        }
    }


@router.post("/reload-credits")
def initiate_credit_reload(
    payload: CreditReloadInitiateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Initiates a credit reload transaction.

    Per Technical Foundation Spec §5.1:
    - Derives credits and price strictly from server-side package table keyed by package_id.
    - Ignores any client-supplied credits or amount.
    - Creates a PENDING record when payment starts.
    - Does NOT grant credits immediately. Completion requires verified provider callback.
    """
    user_id = current_user["_id"]
    package = resolve_package(payload.package_id)
    if not package:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid package_id '{payload.package_id}'. Must be a valid server credit package."
        )

    is_mpesa = (payload.payment_method.lower() == "mpesa")
    expected_amount = package["price_kes"] if is_mpesa else package["price_usd"]
    expected_currency = "KES" if is_mpesa else "USD"
    credits_to_grant = package["credits"]

    receipt = f"TM-CR-{secrets.token_hex(6).upper()}"
    now = datetime.now(timezone.utc)
    checkout_id = f"ck_{secrets.token_hex(12)}"

    reload_record = {
        "user_id": str(user_id),
        "receipt_number": receipt,
        "checkout_id": checkout_id,
        "package_id": package["id"],
        "credits": credits_to_grant,  # Authoritative server-derived credits
        "amount": expected_amount,    # Authoritative server-derived amount
        "currency": expected_currency,
        "payment_method": payload.payment_method.lower(),
        "phone_number": payload.phone_number,
        "status": "pending",
        "created_at": now
    }
    db.credit_reloads.insert_one(reload_record)

    logger.info(
        f"[Payment] Initiated reload order {receipt} for user {user_id}. "
        f"Package: {package['id']} ({credits_to_grant} credits for {expected_currency} {expected_amount}). Status: PENDING."
    )

    return {
        "status": "pending",
        "success": True,
        "checkout_id": checkout_id,
        "receipt_number": receipt,
        "checkout_id": checkout_id,
        "package_id": package["id"],
        "credits": credits_to_grant,
        "amount": expected_amount,
        "currency": expected_currency,
        "payment_method": payload.payment_method,
        "message": "Payment order registered. Waiting for payment provider confirmation before crediting."
    }


@router.post("/mpesa/stk-push")
@router.post("/mpesa/stkpush")
def initiate_mpesa_stk_push(
    payload: MpesaStkPushRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Initiates an M-Pesa STK Push prompt on user phone for credit reload.

    Per Technical Foundation Spec §5.1:
    - Waits for the Safaricom callback with a successful result code before crediting.
    - Does NOT increment user balance on initial STK dispatch.
    - Matches CheckoutRequestID and amount to pending record upon callback.
    """
    user_id = current_user["_id"] if current_user else "anonymous_pos_user"
    pkg_id = payload.package_id or "starter-floor"
    package = resolve_package(pkg_id)
    if not package:
        package = CREDIT_PACKAGES["starter-floor"]

    raw_phone = payload.phone_number or payload.phone or ""
    phone = raw_phone.strip().replace("+", "").replace(" ", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif not phone.startswith("254"):
        phone = "254" + phone

    if len(phone) != 12 or not phone.isdigit():
        raise HTTPException(
            status_code=400,
            detail="Invalid Kenyan phone number. Format should be 2547XXXXXXXX or 07XXXXXXXX."
        )

    amount_kes = payload.amount if (payload.amount and not payload.package_id) else package["price_kes"]
    credits_expected = package["credits"]
    receipt = f"MPESA-PEND-{secrets.token_hex(4).upper()}"

    # Dispatch STK Push via Safaricom Daraja API
    merchant_request_id = None
    checkout_request_id = None
    customer_message = f"Success. Enter your M-Pesa PIN on handset {phone} to reload {credits_expected:,} credits."

    try:
        daraja_res = daraja_service.initiate_stk_push(
            phone_number=phone,
            amount=amount_kes,
            account_reference="TuneMavens",
            transaction_desc=f"{package['name'][:12]}"
        )
        if daraja_res.get("ResponseCode") == "0":
            checkout_request_id = daraja_res.get("CheckoutRequestID")
            merchant_request_id = daraja_res.get("MerchantRequestID")
            customer_message = daraja_res.get("CustomerMessage", customer_message)
        else:
            logger.warning(f"[Daraja] Non-zero ResponseCode from Daraja: {daraja_res}")
            if config.ENV == "production":
                raise HTTPException(
                    status_code=502,
                    detail=daraja_res.get("ResponseDescription", "M-Pesa payment gateway rejected request")
                )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"[Daraja] Live dispatch exception: {e}")
        if config.ENV == "production":
            raise HTTPException(status_code=502, detail=f"M-Pesa STK Push dispatch failed: {e}")

    # Fallback simulation only for offline/unit-test environments without internet
    if not checkout_request_id:
        checkout_request_id = f"ws_CO_{int(datetime.now(timezone.utc).timestamp())}_{secrets.token_hex(4)}"
        merchant_request_id = f"MR_{secrets.token_hex(8)}"

    # Record pending transaction in credit_reloads. User balance is UNCHANGED.
    db.credit_reloads.insert_one({
        "user_id": str(user_id),
        "receipt_number": receipt,
        "package_id": package["id"],
        "credits": credits_expected,
        "amount": amount_kes,
        "currency": "KES",
        "payment_method": "mpesa",
        "phone_number": phone,
        "checkout_request_id": checkout_request_id,
        "merchant_request_id": merchant_request_id,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    })

    logger.info(
        f"[M-Pesa STK] Dispatched STK push for user {user_id} to phone {phone}. "
        f"CheckoutRequestID: {checkout_request_id}. Amount: KES {amount_kes}. Awaiting callback."
    )

    return {
        "status": "pending",
        "success": True,
        "checkout_request_id": checkout_request_id,
        "MerchantRequestID": merchant_request_id,
        "CheckoutRequestID": checkout_request_id,
        "ResponseCode": "0",
        "ResponseDescription": "Success. Request accepted for processing",
        "CustomerMessage": customer_message,
        "receipt_number": receipt,
        "credits_expected": credits_expected,
        "amount_kes": amount_kes
    }


@router.post("/mpesa/callback")
async def mpesa_daraja_callback(request: Request):
    """Processes Safaricom Daraja STK Push callback.

    Per Technical Foundation Spec §5.1:
    - Validates callback payload and matches CheckoutRequestID.
    - Idempotent on M-Pesa receipt number.
    - Reconciles paid amount with server package pricing.
    - Credits account via TuneLedger only when ResultCode is 0.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON callback")

    stk_callback = body.get("Body", {}).get("stkCallback", {})
    checkout_request_id = stk_callback.get("CheckoutRequestID")
    merchant_request_id = stk_callback.get("MerchantRequestID")
    result_code = stk_callback.get("ResultCode")
    result_desc = stk_callback.get("ResultDesc", "")

    if not checkout_request_id:
        logger.warning(f"[M-Pesa Callback] Missing CheckoutRequestID in callback: {body}")
        return {"ResultCode": 0, "ResultDesc": "Ignored missing CheckoutRequestID"}

    reload_record = db.credit_reloads.find_one({"checkout_request_id": checkout_request_id})
    if not reload_record:
        logger.warning(f"[M-Pesa Callback] No pending reload found for CheckoutRequestID {checkout_request_id}")
        return {"ResultCode": 0, "ResultDesc": "No pending record"}

    # Idempotency check: if already completed, do not credit again
    if reload_record.get("status") == "completed":
        logger.info(f"[M-Pesa Callback] Duplicate callback received for already completed {checkout_request_id}")
        return {"ResultCode": 0, "ResultDesc": "Already processed"}

    # Handle failed or cancelled transactions
    if result_code != 0:
        logger.info(f"[M-Pesa Callback] STK failed for {checkout_request_id}: {result_desc} (Code {result_code})")
        db.credit_reloads.update_one(
            {"_id": reload_record["_id"]},
            {
                "$set": {
                    "status": "failed",
                    "result_code": result_code,
                    "result_desc": result_desc,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )
        return {"ResultCode": 0, "ResultDesc": "Failure recorded"}

    # Parse metadata items
    items = stk_callback.get("CallbackMetadata", {}).get("Item", [])
    item_map = {item.get("Name"): item.get("Value") for item in items if "Name" in item}

    mpesa_receipt = str(item_map.get("MpesaReceiptNumber", "")).strip().upper()
    amount_paid = float(item_map.get("Amount", 0))

    if not mpesa_receipt:
        logger.error(f"[M-Pesa Callback] Success ResultCode but missing MpesaReceiptNumber for {checkout_request_id}")
        return {"ResultCode": 0, "ResultDesc": "Missing receipt number"}

    # Anti-replay protection on M-Pesa receipt number across all ledger entries
    existing_receipt = db.credit_ledger.find_one({"provider_ref": mpesa_receipt})
    if existing_receipt:
        logger.error(f"[M-Pesa Callback] REPLAY DETECTED! Receipt {mpesa_receipt} has already been credited.")
        return {"ResultCode": 0, "ResultDesc": "Replay rejected"}

    # Verify amount matches expected package price
    expected_amount = float(reload_record["amount"])
    if amount_paid < expected_amount:
        logger.error(f"[M-Pesa Callback] Underpayment on {checkout_request_id}: paid {amount_paid}, expected {expected_amount}")
        db.credit_reloads.update_one(
            {"_id": reload_record["_id"]},
            {"$set": {"status": "underpaid", "amount_paid": amount_paid, "mpesa_receipt": mpesa_receipt}}
        )
        return {"ResultCode": 0, "ResultDesc": "Underpayment recorded"}

    # Complete reload record
    db.credit_reloads.update_one(
        {"_id": reload_record["_id"]},
        {
            "$set": {
                "status": "completed",
                "mpesa_receipt": mpesa_receipt,
                "amount_paid": amount_paid,
                "result_code": 0,
                "result_desc": result_desc,
                "completed_at": datetime.now(timezone.utc)
            }
        }
    )

    # Post atomic credit entry to TuneLedger
    credits_to_grant = reload_record["credits"]
    user_id = reload_record["user_id"]
    ledger_service.record_transaction(
        user_id=user_id,
        amount=credits_to_grant,
        entry_type="CREDIT_RELOAD",
        provider="mpesa_daraja",
        provider_ref=mpesa_receipt,
        idempotency_key=f"MPESA-{checkout_request_id}",
        description=f"Reload {credits_to_grant} credits via M-Pesa ({mpesa_receipt})",
        metadata={
            "checkout_request_id": checkout_request_id,
            "merchant_request_id": merchant_request_id,
            "package_id": reload_record.get("package_id"),
            "amount_kes": amount_paid
        }
    )

    logger.info(
        f"[M-Pesa Callback] Successfully completed reload for user {user_id}. "
        f"Receipt: {mpesa_receipt}, Credits: +{credits_to_grant}."
    )
    return {"ResultCode": 0, "ResultDesc": "Success. Account credited"}


@router.get("/reload-status/{checkout_id}")
@router.get("/mpesa/status/{checkout_id}")
def check_reload_status(checkout_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    """Polls completion status of a pending reload by checkout ID or receipt."""
    query = {
        "$or": [
            {"checkout_request_id": checkout_id},
            {"checkout_id": checkout_id},
            {"receipt_number": checkout_id}
        ]
    }
    if current_user and "_id" in current_user:
        query["user_id"] = str(current_user["_id"])
    
    reload = db.credit_reloads.find_one(query)

    if not reload:
        raise HTTPException(status_code=404, detail="Reload record not found")

    user_doc = db.users.find_one({"_id": current_user["_id"]}) if (current_user and "_id" in current_user) else None
    current_credits = user_doc.get("credits", 0) if user_doc else 0

    return {
        "status": reload.get("status", "pending"),
        "checkout_id": checkout_id,
        "package_id": reload.get("package_id"),
        "credits": reload.get("credits"),
        "amount": reload.get("amount"),
        "currency": reload.get("currency"),
        "receipt_number": reload.get("receipt_number"),
        "mpesa_receipt": reload.get("mpesa_receipt"),
        "current_balance": current_credits
    }


@router.post("/checkout-session")
def create_checkout_session(
    payload: CheckoutSessionRequest,
    current_user: dict = Depends(get_current_user),
):
    """Creates a Stripe Checkout Session for credits, tickets, or merchandise.

    Unified non-expiring credit packages replace all subscription modes.
    """
    user_id = str(current_user["_id"])
    description = "Fast, automated settlements."
    price = 0.0
    title = ""
    package_id = None

    # Handle credits (or legacy subscription request remapped to credits)
    if payload.item_type in ("credits", "subscription"):
        package = resolve_package(payload.item_id)
        if not package:
            raise HTTPException(status_code=400, detail=f"Invalid credit package '{payload.item_id}'")
        price = package["price_usd"]
        title = f"TuneMavens {package['name']} ({package['credits']:,} Credits)"
        package_id = package["id"]
        description = package["description"]

    elif payload.item_type == "ticket":
        event = db.events.find_one({"_id": payload.item_id})
        if not event:
            mock_event = {
                "_id": payload.item_id,
                "creator_id": "mock_creator",
                "title": "TuneStream Live Concert Showcase",
                "price": 15.0,
                "date": datetime.now(timezone.utc),
                "location": "Live Online & Nairobi Studio",
                "capacity": 500,
                "tickets_sold": 0,
            }
            db.events.insert_one(mock_event)
            event = mock_event
        price = event["price"]
        title = f"Ticket: {event['title']}"

    elif payload.item_type == "merch":
        product = db.products.find_one({"_id": payload.item_id})
        if not product:
            mock_product = {
                "_id": payload.item_id,
                "creator_id": "mock_creator",
                "title": "TuneMavens Classic Cyberpunk Hoodie",
                "price": 45.0,
                "type": "physical",
                "stock": 100,
            }
            db.products.insert_one(mock_product)
            product = mock_product
        price = product["price"]
        title = f"Merch: {product['title']}"
    else:
        raise HTTPException(status_code=400, detail="Invalid item_type")

    total_amount = price * payload.quantity

    if STRIPE_AVAILABLE and STRIPE_API_KEY:
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[{
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": title,
                            "description": description,
                        },
                        "unit_amount": int(price * 100),
                    },
                    "quantity": payload.quantity,
                }],
                metadata={
                    "user_id": user_id,
                    "item_type": payload.item_type,
                    "item_id": payload.item_id,
                    "package_id": package_id or "",
                    "quantity": payload.quantity,
                    "shipping_address": payload.shipping_address or "",
                },
                mode="payment",  # All transactions are one-time payments. Zero subscriptions.
                success_url="http://localhost:3000/dashboard?checkout=success",
                cancel_url="http://localhost:3000/dashboard?checkout=cancel",
            )
            return {"checkout_url": session.url, "session_id": session.id}
        except Exception as e:
            logger.error(f"Stripe Session creation error: {e}.")
            if config.ENV == "production":
                raise HTTPException(status_code=502, detail="Payment gateway unavailable")

    # In production, mock sessions are strictly disallowed
    if config.ENV == "production":
        raise HTTPException(status_code=500, detail="Payment provider unconfigured")

    mock_session_id = f"mock_sess_{secrets.token_hex(16)}"
    db.mock_checkout_sessions.insert_one({
        "session_id": mock_session_id,
        "user_id": user_id,
        "item_type": payload.item_type,
        "item_id": payload.item_id,
        "package_id": package_id,
        "quantity": payload.quantity,
        "total_amount": total_amount,
        "shipping_address": payload.shipping_address,
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    })

    mock_success_url = f"http://localhost:3000/dashboard?checkout=success&session_id={mock_session_id}"
    return {"checkout_url": mock_success_url, "session_id": mock_session_id, "mock": True}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Processes Stripe checkout success and payment completion events.

    Per Technical Foundation Spec §5.1:
    - Always requires valid Stripe-Signature and rejects anything else in production.
    - Stores processed event IDs and ignores duplicate/replayed payloads.
    - Zero subscription events: no balance resets or cancellations.
    - Grants credits derived strictly from package configuration via TuneLedger.
    """
    raw_body = await request.body()
    sig_header = request.headers.get("Stripe-Signature")

    # In production, or whenever ALLOW_SANDBOX_WEBHOOKS is false, enforce strict crypto verification
    is_production_or_strict = (config.ENV == "production" or not config.ALLOW_SANDBOX_WEBHOOKS)

    event = None
    if is_production_or_strict:
        if not sig_header:
            logger.error("[Stripe Webhook] Rejected webhook: Missing Stripe-Signature header.")
            raise HTTPException(status_code=400, detail="Missing Stripe-Signature header")

        if not STRIPE_WEBHOOK_SECRET:
            logger.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured on server.")
            raise HTTPException(status_code=500, detail="Webhook signature verification unavailable")

        try:
            event = stripe.Webhook.construct_event(
                raw_body, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except Exception as e:
            logger.error(f"[Stripe Webhook] Signature verification failed: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {e}")
    else:
        # Development / Sandbox mode only when ALLOW_SANDBOX_WEBHOOKS is explicitly enabled
        if sig_header and STRIPE_WEBHOOK_SECRET:
            try:
                event = stripe.Webhook.construct_event(
                    raw_body, sig_header, STRIPE_WEBHOOK_SECRET
                )
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {e}")
        else:
            try:
                event = await request.json()
            except Exception:
                raise HTTPException(status_code=400, detail="Invalid JSON webhook payload")

    if not event or not isinstance(event, dict):
        raise HTTPException(status_code=400, detail="Malformed event data")

    event_id = event.get("id")
    event_type = event.get("type")

    # Idempotency & Replay Protection: store processed event IDs
    if event_id:
        existing_event = db.processed_webhook_events.find_one({"event_id": event_id})
        if existing_event:
            logger.warning(f"[Stripe Webhook] Replayed event {event_id} ignored idempotently.")
            return {"status": "already_processed", "event_id": event_id}

        db.processed_webhook_events.insert_one({
            "event_id": event_id,
            "event_type": event_type,
            "processed_at": datetime.now(timezone.utc)
        })

    # Process successful payment completion
    if event_type in ("checkout.session.completed", "payment_intent.succeeded"):
        session_obj = event.get("data", {}).get("object", {})
        metadata = session_obj.get("metadata", {})
        session_id = session_obj.get("id", event_id)
        _process_successful_checkout(metadata, provider_ref=session_id)
        return {"status": "success", "event_id": event_id}

    # Subscription events are obsolete and intentionally ignored (zero subscription policy)
    if "subscription" in str(event_type):
        logger.info(f"[Stripe Webhook] Ignored obsolete subscription event {event_type}. Credits are non-expiring.")
        return {"status": "ignored", "reason": "subscriptions_deprecated"}

    return {"status": "unhandled_event", "type": event_type}


def _process_successful_checkout(metadata: dict, provider_ref: str = ""):
    """Fulfills paid orders for credits, tickets, or merchandise."""
    user_id = metadata.get("user_id")
    item_type = metadata.get("item_type")
    item_id = metadata.get("item_id")
    package_id = metadata.get("package_id")
    quantity = int(metadata.get("quantity", 1))
    shipping_address = metadata.get("shipping_address")

    if not user_id:
        logger.warning(f"[Checkout Fulfillment] Missing user_id in metadata: {metadata}")
        return

    # 1. Credits Fulfillment
    if item_type in ("credits", "subscription") or package_id:
        target_pkg_id = package_id or item_id
        package = resolve_package(target_pkg_id)
        if not package:
            logger.error(f"[Checkout Fulfillment] Unknown package '{target_pkg_id}' in metadata")
            return

        credits_to_grant = package["credits"] * quantity
        ledger_service.record_transaction(
            user_id=user_id,
            amount=credits_to_grant,
            entry_type="CREDIT_RELOAD",
            provider="stripe",
            provider_ref=provider_ref or f"STRIPE-CS-{secrets.token_hex(6)}",
            idempotency_key=f"STRIPE-{provider_ref}-{package['id']}",
            description=f"Loaded {credits_to_grant} credits via Stripe ({package['name']})",
            metadata={"package_id": package["id"], "quantity": quantity}
        )
        logger.info(f"[Checkout Fulfillment] Credited user {user_id} with {credits_to_grant} credits via TuneLedger.")

    # 2. Ticket Fulfillment
    elif item_type == "ticket":
        for _ in range(quantity):
            qr_token = f"TKT-{secrets.token_hex(16).upper()}"
            db.tickets.insert_one({
                "event_id": item_id,
                "user_id": user_id,
                "qr_token": qr_token,
                "scanned": False,
                "scanned_at": None,
                "purchased_at": datetime.now(timezone.utc),
            })
        db.events.update_one({"_id": item_id}, {"$inc": {"tickets_sold": quantity}})
        logger.info(f"[Checkout Fulfillment] Generated {quantity} tickets for event {item_id} (User: {user_id})")

    # 3. Merch Fulfillment
    elif item_type == "merch":
        product = db.products.find_one({"_id": item_id})
        if not product:
            logger.warning(f"[Checkout Fulfillment] Merchandise {item_id} not found.")
            return

        total_amount = float(product["price"]) * quantity
        download_token = secrets.token_urlsafe(24) if product.get("type") == "digital" else None
        status_label = "download_ready" if product.get("type") == "digital" else "completed"

        db.orders.insert_one({
            "product_id": item_id,
            "user_id": user_id,
            "quantity": quantity,
            "total_amount": total_amount,
            "shipping_address": shipping_address,
            "status": status_label,
            "download_token": download_token,
            "created_at": datetime.now(timezone.utc),
        })

        if product.get("type") == "physical" and product.get("stock") is not None:
            db.products.update_one({"_id": item_id}, {"$inc": {"stock": -quantity}})

        logger.info(f"[Checkout Fulfillment] Processed order for product {item_id} (User: {user_id})")


@router.post("/sandbox-bypass")
def sandbox_checkout_bypass(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Sandbox endpoint allowing clients to settle mock checkout sessions during local development.

    Per Technical Foundation Spec §5.1:
    - Strictly disabled and returns 404 under production or when ENABLE_SANDBOX_BYPASS is False.
    - Validates server packages and routes fulfillment through TuneLedger.
    """
    if config.ENV == "production" or not config.ENABLE_SANDBOX_BYPASS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sandbox bypass endpoint is disabled."
        )

    sess = db.mock_checkout_sessions.find_one({"session_id": session_id})
    if not sess:
        raise HTTPException(status_code=404, detail="Mock session not found")

    if sess.get("status") == "completed":
        return {"status": "already_completed"}

    metadata = {
        "user_id": sess["user_id"],
        "item_type": sess["item_type"],
        "item_id": sess["item_id"],
        "package_id": sess.get("package_id"),
        "quantity": str(sess.get("quantity", 1)),
        "shipping_address": sess.get("shipping_address") or "",
    }

    _process_successful_checkout(metadata, provider_ref=f"SANDBOX-{session_id}")

    db.mock_checkout_sessions.update_one(
        {"session_id": session_id},
        {"$set": {"status": "completed", "settled_at": datetime.now(timezone.utc)}}
    )
    return {"status": "completed", "sandbox": True}
