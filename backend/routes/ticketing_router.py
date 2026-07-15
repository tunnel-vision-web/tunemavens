"""Event Ticketing Router.

Handles event creation, listing, retrieval of purchased tickets,
and QR code ticket scanning validation.
"""
from __future__ import annotations

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
    price: float
    date: datetime
    location: str
    capacity: int


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

    event_doc = Event(
        creator_id=str(current_user["_id"]),
        title=payload.title,
        description=payload.description,
        price=payload.price,
        date=payload.date,
        location=payload.location,
        capacity=payload.capacity,
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
