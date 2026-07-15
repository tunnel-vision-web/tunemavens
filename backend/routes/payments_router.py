"""Stripe & Payments Router.

Handles creating Stripe checkout sessions and processing webhooks.
Includes sandbox mock fallbacks if Stripe keys are not configured.
"""
from __future__ import annotations

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
        plans = {
            "starter": 0.0,
            "professional": 29.99,
            "business": 99.99,
            "enterprise": 299.99,
        }
        if payload.item_id not in plans:
            raise HTTPException(status_code=400, detail="Invalid subscription plan")
        price = plans[payload.item_id]
        title = f"TuneMavens {payload.item_id.capitalize()} Subscription"
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
    """Processes Stripe checkout success events.

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
            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]
                _process_successful_checkout(session.get("metadata", {}))
            return {"status": "success"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")

    # Sandbox / Mock Webhook parsing (direct POST payload fallback)
    try:
        data = await request.json()
        # Direct webhook simulations or sandbox bypass checks
        if data.get("type") == "checkout.session.completed":
            metadata = data.get("data", {}).get("object", {}).get("metadata", {})
            _process_successful_checkout(metadata)
            return {"status": "success", "mocked": True}
    except Exception:
        pass

    raise HTTPException(status_code=400, detail="Invalid webhook structure")


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
