"""Event Ticketing Router.

Handles event creation, listing, retrieval of purchased tickets,
and QR code ticket scanning validation.
"""
from datetime import datetime, timezone
import logging
from typing import List, Optional


from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import Event, Ticket

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/tickets", tags=["ticketing"])


class EventCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    payment_mode: str = "paid"  # 'paid' | 'free_rsvp'
    price: float = 0.0
    date: datetime
    location: str
    capacity: int
    seating_capacity: Optional[int] = None
    standing_capacity: Optional[int] = None
    guest_limit_policy: str = "open"  # 'open' | 'strict_plus_1' | 'strict_plus_2'
    max_additional_guests: Optional[int] = None


class ScanRequest(BaseModel):
    qr_token: str


@router.post("/events", status_code=status.HTTP_201_CREATED)
def create_event(
    payload: EventCreateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Creates a new event. Restricted to creators / admins."""
    # Ensure role is creator/admin/exec
    user_roles = current_user.get("roles", [current_user.get("role", "creator")])
    if not any(r in ("creator", "admin", "exec", "label") for r in user_roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Restricted to Creators and Execs"
        )

    seating_cap = payload.seating_capacity if payload.seating_capacity is not None else payload.capacity
    standing_cap = payload.standing_capacity if payload.standing_capacity is not None else 0
    total_cap = (
        seating_cap + standing_cap
        if (payload.seating_capacity is not None or payload.standing_capacity is not None)
        else payload.capacity
    )
    policy = payload.guest_limit_policy or "open"
    max_guests = payload.max_additional_guests
    if policy == "strict_plus_1":
        max_guests = 1
    elif policy == "strict_plus_2":
        max_guests = 2

    event_doc = Event(
        creator_id=str(current_user["_id"]),
        title=payload.title,
        description=payload.description,
        payment_mode="free_rsvp" if payload.payment_mode == "free_rsvp" else "paid",
        price=0.0 if payload.payment_mode == "free_rsvp" else payload.price,
        date=payload.date,
        location=payload.location,
        capacity=total_cap,
        seating_capacity=seating_cap,
        standing_capacity=standing_cap,
        guest_limit_policy=policy,
        max_additional_guests=max_guests,
        tickets_sold=0,
    ).to_mongo()

    result = db.events.insert_one(event_doc)
    event_doc["_id"] = str(result.inserted_id)
    return event_doc


@router.get("/events")
def list_events():
    """Lists all active events."""
    cursor = db.events.find({})
    events_list = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        events_list.append(doc)
    return events_list


@router.get("/my-tickets")
def list_my_tickets(current_user: dict = Depends(get_current_user)):
    """Retrieves tickets purchased by the current user with details."""
    cursor = db.tickets.find({"user_id": str(current_user["_id"])})
    tickets_list = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        
        # Attach event details
        event_doc = db.events.find_one({"_id": doc["event_id"]})
        if event_doc:
            event_doc["_id"] = str(event_doc["_id"])
            doc["event"] = event_doc
        else:
            doc["event"] = None
            
        tickets_list.append(doc)
    return tickets_list


@router.get("/events/{event_id}")
def get_event(event_id: str):
    """Retrieves detailed information for a specific event."""
    from bson import ObjectId
    try:
        doc = db.events.find_one({"_id": ObjectId(event_id)})
    except Exception:
        doc = db.events.find_one({"_id": event_id})

    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    
    doc["_id"] = str(doc["_id"])
    return doc


class RefundRequest(BaseModel):
    ticket_id: str


@router.post("/refund")
def refund_ticket(
    payload: RefundRequest,
    current_user: dict = Depends(get_current_user),
):
    """Refunds a purchased ticket and frees event capacity."""
    from bson import ObjectId
    try:
        ticket = db.tickets.find_one({"_id": ObjectId(payload.ticket_id)})
    except Exception:
        ticket = db.tickets.find_one({"_id": payload.ticket_id})

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to refund this ticket")

    if ticket.get("scanned", False):
        raise HTTPException(status_code=400, detail="Cannot refund a ticket that has already been scanned")

    db.tickets.delete_one({"_id": ticket["_id"]})
    db.events.update_one({"_id": ticket["event_id"]}, {"$inc": {"tickets_sold": -1}})

    return {"status": "refunded", "ticket_id": payload.ticket_id}


@router.post("/scan")
def scan_ticket(
    payload: ScanRequest,
    current_user: dict = Depends(get_current_user),
):
    """Validates and processes a scanned QR ticket code.

    Restricted to creators, managers, and admins.
    """
    user_roles = current_user.get("roles", [current_user.get("role", "creator")])
    if not any(r in ("creator", "admin", "exec", "label") for r in user_roles):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Restricted to Creators and Execs"
        )

    ticket = db.tickets.find_one({"qr_token": payload.qr_token})
    if not ticket:
        raise HTTPException(status_code=404, detail="Invalid ticket QR code")

    if ticket.get("scanned", False):
        raise HTTPException(
            status_code=400,
            detail=f"Ticket already scanned at {ticket.get('scanned_at')}"
        )

    # Mark as scanned
    scan_time = datetime.now(timezone.utc)
    db.tickets.update_one(
        {"_id": ticket["_id"]},
        {
            "$set": {
                "scanned": True,
                "scanned_at": scan_time,
            }
        }
    )

    # Fetch buyer details
    buyer = db.users.find_one({"_id": ticket["user_id"]})
    buyer_name = buyer.get("name", "Unknown Buyer") if buyer else "Unknown Buyer"

    return {
        "status": "validated",
        "scanned_at": scan_time,
        "buyer_name": buyer_name,
        "ticket_id": str(ticket["_id"]),
    }

