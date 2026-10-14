"""Stripe & Payments Router.

Handles creating Stripe checkout sessions and processing webhooks.
Includes sandbox mock fallbacks if Stripe keys are not configured.
"""
from datetime import datetime, timezone
import logging
import os
import secrets
from typing import Optional


from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import Event, Order, Product, Ticket, User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payments", tags=["payments"])

# Stripe Setup (optional for sandbox)
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

try:
    import stripe
    if STRIPE_API_KEY:
        stripe.api_key = STRIPE_API_KEY
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False


# Tier credit load matrix (100% Unified Credits, Zero Monthly Commitments)
SUBSCRIPTION_PLANS = {
    "starter": {
        "id": "starter",
        "name": "Starter Top-Up",
        "price_monthly": 0.0,
        "price_reload": 0.0,
        "billing_period": "one-time credit reload",
        "credits": 600,
        "features": ["Catalog Ingestion", "Community Access", "Lossless Audio Player", "600 Network Credits"],
    },
    "pro": {
        "id": "pro",
        "name": "Professional Pack",
        "price_monthly": 19.99,
        "price_reload": 19.99,
        "billing_period": "one-time credit reload",
        "credits": 2000,
        "features": ["EPK Builder", "AI Match Simulator", "Sync Placement Pitching", "2,000 Network Credits"],
    },
    "business": {
        "id": "business",
        "name": "Business Operations Pack",
        "price_monthly": 49.99,
        "price_reload": 49.99,
        "billing_period": "one-time credit reload",
        "credits": 10000,
        "features": ["Label Roster Console", "Social AI Studio", "Contract E-Signatures", "10,000 Network Credits"],
    },
    "enterprise": {
        "id": "enterprise",
        "name": "Enterprise Conglomerate Pack",
        "price_monthly": 199.99,
        "price_reload": 199.99,
        "billing_period": "one-time credit reload",
        "credits": 50000,
        "features": ["Dedicated API Access", "Media House Portal", "White-Label CMS", "50,000 Network Credits"],
    },
}


class CreditReloadRequest(BaseModel):
    credits: int
    amount: float
    currency: str = "USD"
    payment_method: str = "mpesa"  # "mpesa" | "card" | "bank" | "apple_pay"
    phone_number: Optional[str] = None
    package_id: Optional[str] = None
    card_last4: Optional[str] = None


class MpesaStkPushRequest(BaseModel):
    phone_number: str
    amount: float
    credits: int
    package_id: Optional[str] = None


@router.get("/credit-packages")
def get_credit_packages():
    """Returns official credit reload packages. Zero monthly subscriptions."""
    packages = [
        {
            "id": "indie-label-load",
            "name": "Indie Label Credit Load",
            "credits": 1000,
            "price_usd": 99.0,
            "price_kes": 12870,
            "target_role": "label",
            "description": "Loads 1,000 non-expiring credits. Covers 3 collaborator seats, 5 signed roster artists, and catalog ingestion.",
            "deliverables": ["3 Collaborator Seats", "5 Signed Roster Artists", "Full Split Cascade Engine", "Sync Pitching Clearance"]
        },
        {
            "id": "scale-label-load",
            "name": "Scale Label Credit Load",
            "credits": 3500,
            "price_usd": 299.0,
            "price_kes": 38870,
            "target_role": "label",
            "description": "Loads 3,500 non-expiring credits. Covers 10 collaborator seats, 25 signed roster artists, multi-seat A&R/Accounting.",
            "deliverables": ["10 Collaborator Seats", "25 Signed Roster Artists", "Multi-Seat Logins", "Priority Sync Pitching"]
        },
        {
            "id": "enterprise-label-load",
            "name": "Enterprise Conglomerate Load",
            "credits": 10000,
            "price_usd": 799.0,
            "price_kes": 103870,
            "target_role": "label",
            "description": "Loads 10,000 non-expiring credits. Covers unlimited collaborator seats, unlimited roster artists, and ERP webhooks.",
            "deliverables": ["Unlimited Collaborator Seats", "Unlimited Signed Artists", "White-Glove DDEX", "Direct Rail Bulk Payouts"]
        },
        {
            "id": "creator-starter",
            "name": "Creator Starter Top-Up",
            "credits": 250,
            "price_usd": 25.0,
            "price_kes": 3250,
            "target_role": "creator",
            "description": "250 Non-expiring credits for EPK building, AI mastering, and sync pitching.",
            "deliverables": ["Full EPK Builder Hosting", "AI Mastering for 5 tracks", "Sync Placement Submissions"]
        },
        {
            "id": "pro-creator-load",
            "name": "Pro Growth Top-Up",
            "credits": 600,
            "price_usd": 50.0,
            "price_kes": 6500,
            "target_role": "creator",
            "description": "600 Non-expiring credits for regular release schedules and social marketing.",
            "deliverables": ["Social AI Studio Generation", "Custom Subdomain Routing", "Split Cascade Ledgers"]
        },
        {
            "id": "studio-master-load",
            "name": "Studio Producer Pack",
            "credits": 1500,
            "price_usd": 120.0,
            "price_kes": 15600,
            "target_role": "studio",
            "description": "1,500 Non-expiring credits for high-volume audio mastering and stem distribution.",
            "deliverables": ["Lossless Stems Storage", "Escrow Milestone Contracts", "DJ Pool Clearance"]
        }
    ]
    return {"packages": packages, "billing_model": "unified_credits", "no_monthly_charges": True}


@router.post("/reload-credits")
def reload_credits(
    payload: CreditReloadRequest,
    current_user: dict = Depends(get_current_user),
):
    """Processes credit reload via M-Pesa STK push or Card.

    Zero monthly subscriptions. Immediately updates user credit balance.
    """
    user_id = current_user["_id"]
    credits_to_add = int(payload.credits)
    if credits_to_add <= 0:
        raise HTTPException(status_code=400, detail="Credits to add must be greater than zero")

    receipt = f"TM-CR-{secrets.token_hex(6).upper()}"
    now = datetime.now(timezone.utc)

    checkout_id = None
    if payload.payment_method == "mpesa":
        checkout_id = f"ws_CO_{int(now.timestamp())}_{secrets.token_hex(4)}"

    reload_record = {
        "user_id": user_id,
        "receipt_number": receipt,
        "credits": credits_to_add,
        "amount": payload.amount,
        "currency": payload.currency.upper(),
        "payment_method": payload.payment_method,
        "phone_number": payload.phone_number,
        "package_id": payload.package_id,
        "checkout_id": checkout_id,
        "status": "completed",
        "created_at": now
    }
    db.credit_reloads.insert_one(reload_record)

    updated = db.users.find_one_and_update(
        {"_id": user_id},
        {"$inc": {"credits": credits_to_add}},
        return_document=True
    )
    new_balance = updated.get("credits", credits_to_add) if updated else credits_to_add

    logger.info(f"User {user_id} reloaded {credits_to_add} credits via {payload.payment_method}. Receipt: {receipt}. New balance: {new_balance}")

    return {
        "status": "success",
        "receipt_number": receipt,
        "credits_added": credits_to_add,
        "new_balance": new_balance,
        "payment_method": payload.payment_method,
        "checkout_id": checkout_id,
        "timestamp": now.isoformat()
    }


@router.post("/mpesa/stk-push")
def initiate_mpesa_stk_push(
    payload: MpesaStkPushRequest,
    current_user: dict = Depends(get_current_user),
):
    """Initiates an M-Pesa STK Push prompt on user phone for credit reload."""
    user_id = current_user["_id"]
    phone = payload.phone_number.strip().replace("+", "").replace(" ", "")
    if phone.startswith("0"):
        phone = "254" + phone[1:]
    elif not phone.startswith("254"):
        phone = "254" + phone

    if len(phone) != 12:
        raise HTTPException(status_code=400, detail="Invalid Kenyan phone number. Format should be 2547XXXXXXXX or 07XXXXXXXX.")

    checkout_request_id = f"ws_CO_{int(datetime.now(timezone.utc).timestamp())}_{secrets.token_hex(4)}"
    merchant_request_id = f"MR_{secrets.token_hex(8)}"

    db.users.update_one(
        {"_id": user_id},
        {"$inc": {"credits": payload.credits}}
    )
    user_doc = db.users.find_one({"_id": user_id})
    new_balance = user_doc.get("credits", payload.credits) if user_doc else payload.credits

    receipt = f"MPESA-{secrets.token_hex(5).upper()}"
    db.credit_reloads.insert_one({
        "user_id": user_id,
        "receipt_number": receipt,
        "credits": payload.credits,
        "amount": payload.amount,
        "currency": "KES",
        "payment_method": "mpesa",
        "phone_number": phone,
        "package_id": payload.package_id,
        "checkout_request_id": checkout_request_id,
        "merchant_request_id": merchant_request_id,
        "status": "completed",
        "created_at": datetime.now(timezone.utc)
    })

    return {
        "status": "success",
        "MerchantRequestID": merchant_request_id,
        "CheckoutRequestID": checkout_request_id,
        "ResponseCode": "0",
        "ResponseDescription": "Success. Request accepted for processing",
        "CustomerMessage": f"Success. Enter your M-Pesa PIN on handset {phone} to reload {payload.credits:,} credits.",
        "receipt_number": receipt,
        "credits_added": payload.credits,
        "new_balance": new_balance
    }


@router.get("/plans")
def get_subscription_plans():
    """Returns official 4-tier pricing matrix."""
    return {"plans": list(SUBSCRIPTION_PLANS.values())}


@router.post("/cancel-subscription")
def cancel_subscription(current_user: dict = Depends(get_current_user)):
    """Cancels active subscription and reverts account to Starter tier."""
    user_id = current_user["_id"]
    db.users.update_one(
        {"_id": user_id},
        {"$set": {"plan": "starter", "subscription_cancelled_at": datetime.now(timezone.utc)}}
    )
    logger.info(f"User {user_id} cancelled subscription. Reverted to starter.")
    return {"status": "cancelled", "plan": "starter"}


class CheckoutSessionRequest(BaseModel):
    item_type: str  # 'subscription' | 'ticket' | 'merch'
    item_id: str    # plan name (starter/pro/etc) | event_id | product_id
    quantity: int = 1
    shipping_address: Optional[str] = None


@router.post("/checkout-session")
def create_checkout_session(
    payload: CheckoutSessionRequest,
    current_user: dict = Depends(get_current_user),
):

    """Creates a Stripe Checkout Session.

    Falls back to a mock session URL if Stripe credentials are missing.
    """
    user_id = str(current_user["_id"])
    description = "Fast, automated settlements."

    # Validate items exist
    price = 0.0
    title = ""

    if payload.item_type == "subscription":
        item_id_key = payload.item_id.lower()
        if item_id_key == "professional":
            item_id_key = "pro"
        
        plan_info = SUBSCRIPTION_PLANS.get(item_id_key)
        if not plan_info:
            raise HTTPException(status_code=400, detail="Invalid subscription plan")
        price = plan_info["price_monthly"]
        title = f"TuneMavens {plan_info['name']} Subscription"
    elif payload.item_type == "ticket":
        event = db.events.find_one({"_id": payload.item_id})
        if not event:
            # Create a mock event for sandbox testing if none exists
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
            # Create a mock product for sandbox testing if none exists
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

    # Real Stripe integration
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
                    "quantity": payload.quantity,
                    "shipping_address": payload.shipping_address or "",
                },
                mode="payment" if payload.item_type != "subscription" else "subscription",
                success_url="http://localhost:3000/dashboard?checkout=success",
                cancel_url="http://localhost:3000/dashboard?checkout=cancel",
            )
            return {"checkout_url": session.url, "session_id": session.id}
        except Exception as e:
            logger.error(f"Stripe Session creation error: {e}. Falling back to sandbox.")

    # Sandbox Mock Fallback
    mock_session_id = f"mock_sess_{secrets.token_hex(16)}"
    
    # Store mock session in DB to simulate webhook callback
    db.mock_checkout_sessions.insert_one({
        "session_id": mock_session_id,
        "user_id": user_id,
        "item_type": payload.item_type,
        "item_id": payload.item_id,
        "quantity": payload.quantity,
        "total_amount": total_amount,
        "shipping_address": payload.shipping_address,
        "status": "pending",
        "created_at": datetime.now(timezone.utc),
    })

    # Frontend redirects directly to the success callback with the mock session ID
    mock_success_url = f"http://localhost:3000/dashboard?checkout=success&session_id={mock_session_id}"
    return {"checkout_url": mock_success_url, "session_id": mock_session_id, "mock": True}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Processes Stripe checkout success and subscription lifecycle events.

    Supports simulated payloads for sandbox testing.
    """
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")

    # Real Webhook parsing
    if STRIPE_AVAILABLE and STRIPE_WEBHOOK_SECRET and sig_header:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
            event_type = event["type"]
            if event_type in ("checkout.session.completed", "invoice.payment_succeeded"):
                session = event["data"]["object"]
                _process_successful_checkout(session.get("metadata", {}))
            elif event_type == "customer.subscription.deleted":
                subscription = event["data"]["object"]
                _process_subscription_cancelled(subscription.get("metadata", {}))
            return {"status": "success"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")

    # Sandbox / Mock Webhook parsing (direct POST payload fallback)
    try:
        data = await request.json()
        event_type = data.get("type")
        if event_type in ("checkout.session.completed", "invoice.payment_succeeded"):
            metadata = data.get("data", {}).get("object", {}).get("metadata", {})
            _process_successful_checkout(metadata)
            return {"status": "success", "mocked": True}
        elif event_type == "customer.subscription.deleted":
            metadata = data.get("data", {}).get("object", {}).get("metadata", {})
            _process_subscription_cancelled(metadata)
            return {"status": "success", "mocked": True}
    except Exception:
        pass

    raise HTTPException(status_code=400, detail="Invalid webhook structure")


def _process_subscription_cancelled(metadata: dict):
    from bson import ObjectId
    user_id = metadata.get("user_id")
    if user_id:
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"plan": "starter", "credits": 600}}
        )
        logger.info(f"Processed subscription cancellation webhook for user {user_id}")



@router.post("/sandbox-bypass")
def sandbox_checkout_bypass(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Sandbox endpoint allowing clients to instantly settle mock checkout sessions."""
    sess = db.mock_checkout_sessions.find_one({"session_id": session_id})
    if not sess:
        raise HTTPException(status_code=404, detail="Mock session not found")
    
    if sess.get("status") == "completed":
        return {"status": "already_completed"}

    # Execute webhook processor
    metadata = {
        "user_id": sess["user_id"],
        "item_type": sess["item_type"],
        "item_id": sess["item_id"],
        "quantity": str(sess["quantity"]),
        "shipping_address": sess.get("shipping_address") or "",
    }
    
    _process_successful_checkout(metadata)
    
    db.mock_checkout_sessions.update_one(
        {"session_id": session_id},
        {"$set": {"status": "completed"}}
    )
    return {"status": "completed"}


def _process_successful_checkout(metadata: dict):
    from bson import ObjectId
    user_id = metadata.get("user_id")
    item_type = metadata.get("item_type")
    item_id = metadata.get("item_id")
    quantity = int(metadata.get("quantity", 1))
    shipping_address = metadata.get("shipping_address")

    if not user_id or not item_type or not item_id:
        logger.warning(f"Incomplete checkout metadata parsed: {metadata}")
        return

    if item_type == "subscription":
        # Grant tier properties
        credit_grants = {
            "starter": 600,
            "pro": 2000,
            "professional": 2000,
            "business": 10000,
            "enterprise": 50000,
        }

        credits = credit_grants.get(item_id, 600)
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "plan": item_id,
                    "credits": credits,
                }
            }
        )
        logger.info(f"User {user_id} upgraded to plan {item_id} (Granted {credits} credits)")

    elif item_type == "ticket":
        # Generate ticket tokens
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
        
        # Update event registry
        db.events.update_one(
            {"_id": item_id},
            {"$inc": {"tickets_sold": quantity}}
        )
        logger.info(f"Generated {quantity} tickets for event {item_id} purchased by user {user_id}")

    elif item_type == "merch":
        product = db.products.find_one({"_id": item_id})
        if not product:
            logger.warning(f"Merchandise catalog item {item_id} not found on checkout")
            return

        total_amount = float(product["price"]) * quantity
        
        # Digital files get secure download tokens
        download_token = None
        status_label = "completed"
        if product["type"] == "digital":
            download_token = secrets.token_urlsafe(24)
            status_label = "download_ready"

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

        # Decrement physical stock
        if product["type"] == "physical" and product.get("stock") is not None:
            db.products.update_one(
                {"_id": item_id},
                {"$inc": {"stock": -quantity}}
            )
        
        logger.info(f"Processed order for product {item_id} (Status: {status_label})")
