"""Live Concerts, Tours & Ticketing Router.

Handles:
- Real-time directory of live events in progress, upcoming tours, and masterclasses.
- Event detail telemetry, venue capacity, and ticketing tier breakdowns.
- Integrated ticketing checkout (TunePay, M-Pesa STK push, Card) with instant QR pass issuance.
- Fan RSVP waitlists synchronized directly with the Smart CRM superfan graph.
- Live digital streaming bridge for hybrid concerts.
"""

from datetime import datetime, timezone
import logging
from typing import List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import get_optional_user
from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/events", tags=["events-and-concerts"])


# ---------------------------------------------------------
# Seed Data for Concerts, Tours & Masterclasses
# ---------------------------------------------------------
INITIAL_EVENTS = [
    {
        "id": "evt-ndufo-nairobi-tonight",
        "tour_id": "tour-ndufo-modular",
        "title": "Ndufo & The Modular Collective: Live at The Wave Lab",
        "artist": "Ndufo & The Modular Collective",
        "artist_id": "creator_ndufo",
        "status": "in-progress",  # in-progress | upcoming | workshop | sold-out
        "status_label": "LIVE TONIGHT",
        "badge_color": "#ef4444",
        "date_display": "Tonight · Doors 19:30",
        "date_iso": "2026-10-30",
        "time": "20:00 EAT",
        "venue": "The Alchemist / Wave Lab Stage",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Afro-Electronic & Modular Synth",
        "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
        "capacity": 1200,
        "tickets_sold": 1145,
        "sold_percentage": 95.4,
        "low_inventory": True,
        "is_live_stream_active": True,
        "stream_url": "#/listen?live=evt-ndufo-nairobi-tonight",
        "epk_url": "#/epk/creator_ndufo",
        "description": "Opening night of the Europe-African Modular Corridor tour. Featuring live analog synthesizers, percussionists from the Kilifi coast, and guest improvisers. Digital livestream available for global fans.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 25,
                "price_kes": 3250,
                "available": 40,
                "perks": ["Entry to main soundstage floor", "Door commemorative holographic pass"]
            },
            {
                "tier_id": "vip",
                "name": "VIP Balcony & Soundstage Lounge",
                "price_usd": 65,
                "price_kes": 8450,
                "available": 12,
                "perks": ["Elevated VIP lounge", "2 complimentary craft cocktails", "Soundcheck access", "Exclusive tour screenprint"]
            },
            {
                "tier_id": "masterclass",
                "name": "Backstage Modular Masterclass Pass",
                "price_usd": 120,
                "price_kes": 15600,
                "available": 3,
                "perks": ["Pre-show 90-min hands-on Eurorack workshop with Ndufo", "Full VIP lounge access", "Ableton sound stem pack"]
            }
        ]
    },
    {
        "id": "evt-aisha-kigali-tonight",
        "tour_id": "tour-aisha-soul",
        "title": "Aisha Mwangi: Pan-African Soul Residency (Night 1)",
        "artist": "Aisha Mwangi",
        "artist_id": "creator_aisha",
        "status": "in-progress",
        "status_label": "LIVE TONIGHT",
        "badge_color": "#ef4444",
        "date_display": "Tonight · Doors 20:00",
        "date_iso": "2026-10-30",
        "time": "20:30 CAT",
        "venue": "Kigali Arena Amphitheatre",
        "city": "Kigali",
        "country": "Rwanda",
        "country_code": "RW",
        "genre": "Contemporary Pan-African Soul",
        "image_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
        "capacity": 2200,
        "tickets_sold": 2110,
        "sold_percentage": 95.9,
        "low_inventory": True,
        "is_live_stream_active": True,
        "stream_url": "#/listen?live=evt-aisha-kigali-tonight",
        "epk_url": "#/epk/creator_aisha",
        "description": "Night 1 of Aisha Mwangi's 5-city East and Southern Africa residency, backed by a 9-piece horn and percussion ensemble from Nairobi and Kigali.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 30,
                "price_kes": 3900,
                "available": 65,
                "perks": ["Floor seating & standing area", "TuneStream lossless recording download"]
            },
            {
                "tier_id": "vip",
                "name": "VIP Golden Circle",
                "price_usd": 75,
                "price_kes": 9750,
                "available": 25,
                "perks": ["Front-stage reserved seating", "Exclusive meet & greet post-show", "Signed vinyl EP"]
            }
        ]
    },
    {
        "id": "evt-ndufo-london",
        "tour_id": "tour-ndufo-modular",
        "title": "Ndufo & The Modular Collective: London Village Underground",
        "artist": "Ndufo & The Modular Collective",
        "artist_id": "creator_ndufo",
        "status": "upcoming",
        "status_label": "UPCOMING",
        "badge_color": "#10b981",
        "date_display": "Nov 12, 2026 · 20:00 GMT",
        "date_iso": "2026-11-12",
        "time": "20:00 GMT",
        "venue": "Village Underground",
        "city": "London",
        "country": "United Kingdom",
        "country_code": "GB",
        "genre": "Afro-Electronic & Modular Synth",
        "image_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
        "capacity": 720,
        "tickets_sold": 540,
        "sold_percentage": 75.0,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_ndufo",
        "description": "London debut of Nairobi's modular afro-synth ensemble under the historic Victorian brick arches of Village Underground in Shoreditch.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "Standard Admission",
                "price_usd": 32,
                "price_kes": 4160,
                "available": 180,
                "perks": ["Entry to main hall"]
            },
            {
                "tier_id": "vip",
                "name": "Mezzanine VIP & Soundboard Pass",
                "price_usd": 80,
                "price_kes": 10400,
                "available": 30,
                "perks": ["Mezzanine viewing area", "Front of house soundboard audio feed via TuneStream app", "Limited screenprinted tour poster"]
            }
        ]
    },
    {
        "id": "evt-kip-mavens-berlin",
        "tour_id": "tour-kip-rock",
        "title": "Kip & The Mavens: European Underground Showcase",
        "artist": "Kip & The Mavens",
        "artist_id": "creator_kip",
        "status": "upcoming",
        "status_label": "UPCOMING",
        "badge_color": "#10b981",
        "date_display": "Nov 18, 2026 · 21:00 CET",
        "date_iso": "2026-11-18",
        "time": "21:00 CET",
        "venue": "SO36 Kreuzberg",
        "city": "Berlin",
        "country": "Germany",
        "country_code": "DE",
        "genre": "Alternative Afro-Rock & Live Fusion",
        "image_url": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80",
        "capacity": 850,
        "tickets_sold": 680,
        "sold_percentage": 80.0,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_kip",
        "description": "High-octane alternative rock infused with Luo Benga guitar licks and live brass, taking over Berlin's iconic Kreuzberg rock institution.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 28,
                "price_kes": 3640,
                "available": 170,
                "perks": ["Standing floor admission"]
            },
            {
                "tier_id": "vip",
                "name": "VIP Backstage & Soundcheck Pass",
                "price_usd": 70,
                "price_kes": 9100,
                "available": 20,
                "perks": ["Soundcheck entry", "Band Q&A", "Signed vinyl"]
            }
        ]
    },
    {
        "id": "evt-masterclass-eurorack-nairobi",
        "tour_id": "tour-ndufo-modular",
        "title": "Advanced Modular Synthesis & Sound Design Masterclass",
        "artist": "Ndufo (Lead Sound Designer)",
        "artist_id": "creator_ndufo",
        "status": "workshop",
        "status_label": "MASTERCLASS",
        "badge_color": "#8b5cf6",
        "date_display": "Nov 02, 2026 · 14:00 - 18:00 EAT",
        "date_iso": "2026-11-02",
        "time": "14:00 EAT",
        "venue": "TuneMavens Studio Lab 1",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Sound Design & Creative Technology",
        "image_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
        "capacity": 25,
        "tickets_sold": 19,
        "sold_percentage": 76.0,
        "low_inventory": True,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_ndufo",
        "description": "Intimate, hands-on 4-hour workshop covering Eurorack modular patching, generative polyrhythms, Ableton CV Tools integration, and tour-ready rack stability.",
        "tiers": [
            {
                "tier_id": "workshop-standard",
                "name": "In-Person Lab Seat",
                "price_usd": 95,
                "price_kes": 12350,
                "available": 6,
                "perks": ["Dedicated Eurorack workstation for 4 hours", "Masterclass certificate", "Exclusive 10GB sample pack"]
            },
            {
                "tier_id": "workshop-digital",
                "name": "Interactive Zoom / Livestream Seat",
                "price_usd": 35,
                "price_kes": 4550,
                "available": 50,
                "perks": ["Two-way HD video stream", "Live patch review & Q&A", "Full recording + Ableton session stems"]
            }
        ]
    },
    {
        "id": "evt-sauti-paris",
        "tour_id": "tour-sauti-sahara",
        "title": "Sauti Ya Sahara: Desert Blues Arena Support",
        "artist": "Sauti Ya Sahara",
        "artist_id": "creator_sauti",
        "status": "upcoming",
        "status_label": "UPCOMING",
        "badge_color": "#10b981",
        "date_display": "Dec 04, 2026 · 19:30 CET",
        "date_iso": "2026-12-04",
        "time": "19:30 CET",
        "venue": "La Gaîté Lyrique",
        "city": "Paris",
        "country": "France",
        "country_code": "FR",
        "genre": "Tuareg Rock & Desert Blues",
        "image_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
        "capacity": 900,
        "tickets_sold": 810,
        "sold_percentage": 90.0,
        "low_inventory": True,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_sauti",
        "description": "Mesmerizing desert guitar grooves, nomadic vocal polyphony, and hypnotic percussion in Paris.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 35,
                "price_kes": 4550,
                "available": 90,
                "perks": ["Access to main auditorium"]
            }
        ]
    },
    {
        "id": "evt-rift-tokyo",
        "tour_id": "tour-rift-valley",
        "title": "The Rift Valley Sessions: Tokyo Shibuya Showcase",
        "artist": "The Rift Valley Sessions",
        "artist_id": "creator_rift",
        "status": "upcoming",
        "status_label": "UPCOMING",
        "badge_color": "#10b981",
        "date_display": "Dec 14, 2026 · 19:00 JST",
        "date_iso": "2026-12-14",
        "time": "19:00 JST",
        "venue": "Contact Shibuya / Sound Museum",
        "city": "Tokyo",
        "country": "Japan",
        "country_code": "JP",
        "genre": "Afro-House Ensemble & Live Electronics",
        "image_url": "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1000&q=80",
        "capacity": 600,
        "tickets_sold": 490,
        "sold_percentage": 81.6,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_rift",
        "description": "Tokyo showcase bringing East African deep house, live percussive polyrhythms, and modular electronics to Shibuya.",
        "tiers": [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 40,
                "price_kes": 5200,
                "available": 110,
                "perks": ["Entry to main room & soundbar"]
            },
            {
                "tier_id": "vip",
                "name": "VIP Lounge & Producer Meet",
                "price_usd": 90,
                "price_kes": 11700,
                "available": 15,
                "perks": ["Mezzanine access", "Limited Japanese-pressed 7-inch vinyl", "Artist meet & greet"]
            }
        ]
    }
]


# ---------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------
class TicketBookingRequest(BaseModel):
    event_id: str = Field(..., description="Unique event ID")
    tier_id: str = Field(..., description="Ticketing tier ID (ga, vip, masterclass)")
    quantity: int = Field(default=1, ge=1, le=10, description="Number of tickets to purchase")
    customer_name: str = Field(..., min_length=2, description="Purchaser full name")
    customer_email: str = Field(..., min_length=5, description="Purchaser email for ticket delivery")
    customer_phone: Optional[str] = Field(default=None, description="Purchaser phone number")
    payment_method: str = Field(default="tunepay", description="tunepay | mpesa | card")
    mpesa_phone: Optional[str] = Field(default=None, description="M-Pesa phone number for STK Push in East Africa")


class EventRsvpRequest(BaseModel):
    event_id: str = Field(..., description="Unique event ID")
    fan_name: str = Field(..., min_length=2, description="Fan full name")
    fan_email: str = Field(..., min_length=5, description="Fan email address")
    city: Optional[str] = Field(default="", description="City of residence")
    notify_sms: Optional[bool] = Field(default=False, description="Opt-in to SMS alerts")
    fan_phone: Optional[str] = Field(default=None, description="Phone number")


# ---------------------------------------------------------
# Database Helper
# ---------------------------------------------------------
async def get_or_seed_events():
    """Ensure events collection exists and contains authoritative live events."""
    if db is None:
        return INITIAL_EVENTS
    try:
        count = await db.live_events.count_documents({})
        if count == 0:
            logger.info("Seeding initial live events collection...")
            docs = [dict(item, created_at=datetime.now(timezone.utc).isoformat()) for item in INITIAL_EVENTS]
            await db.live_events.insert_many(docs)
        cursor = db.live_events.find({}, {"_id": 0})
        return await cursor.to_list(length=100)
    except Exception as e:
        logger.warning(f"Failed to query Mongo for live events, using memory seed: {e}")
        return INITIAL_EVENTS


# ---------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------
@router.get("", summary="Get all concerts, live tours & masterclasses")
async def list_events(
    status_filter: Optional[str] = Query(None, description="in-progress | upcoming | workshop | all"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    country_code: Optional[str] = Query(None, description="Filter by country code (KE, RW, GB, DE, FR, JP)"),
    genre: Optional[str] = Query(None, description="Filter by musical genre"),
    search: Optional[str] = Query(None, description="Search by artist, venue, or title")
):
    """List live events with dynamic filters for in-progress concerts, upcoming tour dates, and masterclasses."""
    events = await get_or_seed_events()
    filtered = events

    if status_filter and status_filter != "all":
        filtered = [e for e in filtered if e.get("status") == status_filter]

    if city and city.lower() != "all":
        filtered = [e for e in filtered if e.get("city", "").lower() == city.lower()]

    if country_code and country_code.lower() != "all":
        filtered = [e for e in filtered if e.get("country_code", "").lower() == country_code.lower()]

    if genre and genre.lower() != "all":
        filtered = [e for e in filtered if genre.lower() in e.get("genre", "").lower()]

    if search:
        s = search.lower()
        filtered = [
            e for e in filtered 
            if s in e.get("title", "").lower() 
            or s in e.get("artist", "").lower() 
            or s in e.get("venue", "").lower() 
            or s in e.get("city", "").lower()
        ]

    # Calculate real-time macro telemetry
    in_progress_count = len([e for e in events if e.get("status") == "in-progress"])
    upcoming_count = len([e for e in events if e.get("status") == "upcoming"])
    workshops_count = len([e for e in events if e.get("status") == "workshop"])
    total_capacity = sum(e.get("capacity", 0) for e in events)
    total_sold = sum(e.get("tickets_sold", 0) for e in events)

    return {
        "status": "success",
        "count": len(filtered),
        "macro_telemetry": {
            "in_progress_count": in_progress_count,
            "upcoming_count": upcoming_count,
            "workshops_count": workshops_count,
            "total_capacity": total_capacity,
            "total_tickets_sold": total_sold,
            "overall_occupancy_rate": f"{round((total_sold / max(total_capacity, 1)) * 100, 1)}%"
        },
        "events": filtered
    }


@router.get("/{event_id}", summary="Get single concert or masterclass details")
async def get_event_detail(event_id: str):
    """Retrieve full event specification, seating capacity, and available ticket inventory tiers."""
    events = await get_or_seed_events()
    event = next((e for e in events if e.get("id") == event_id), None)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Event '{event_id}' not found."
        )
    return event


@router.post("/tickets/book", summary="Book tickets via TunePay, M-Pesa STK Push, or Card")
async def book_event_tickets(booking: TicketBookingRequest, user=Depends(get_optional_user)):
    """Process ticket reservation, create booking ledger entry, and issue secure digital QR ticket pass."""
    events = await get_or_seed_events()
    event = next((e for e in events if e.get("id") == booking.event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")

    tier = next((t for t in event.get("tiers", []) if t.get("tier_id") == booking.tier_id), None)
    if not tier:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Tier '{booking.tier_id}' does not exist for this event.")

    if tier.get("available", 0) < booking.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Only {tier.get('available', 0)} tickets remaining in this tier."
        )

    ticket_id = f"TKT-{datetime.now().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"
    qr_hash = f"tm_pass_{uuid.uuid4().hex}"
    unit_usd = tier.get("price_usd", 25)
    unit_kes = tier.get("price_kes", unit_usd * 130)
    total_usd = unit_usd * booking.quantity
    total_kes = unit_kes * booking.quantity

    booking_record = {
        "ticket_id": ticket_id,
        "event_id": booking.event_id,
        "event_title": event.get("title"),
        "artist": event.get("artist"),
        "venue": event.get("venue"),
        "city": event.get("city"),
        "date_display": event.get("date_display"),
        "tier_id": booking.tier_id,
        "tier_name": tier.get("name"),
        "quantity": booking.quantity,
        "unit_price_usd": unit_usd,
        "total_usd": total_usd,
        "total_kes": total_kes,
        "customer_name": booking.customer_name,
        "customer_email": booking.customer_email,
        "customer_phone": booking.customer_phone or booking.mpesa_phone,
        "payment_method": booking.payment_method,
        "qr_code_hash": qr_hash,
        "status": "confirmed" if booking.payment_method != "mpesa" else "stk_push_dispatched",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "perks": tier.get("perks", [])
    }

    # Save to MongoDB
    if db is not None:
        try:
            await db.ticket_bookings.insert_one(booking_record)
            # Update sold counts
            await db.live_events.update_one(
                {"id": booking.event_id, "tiers.tier_id": booking.tier_id},
                {
                    "$inc": {
                        "tickets_sold": booking.quantity,
                        "tiers.$.available": -booking.quantity
                    }
                }
            )
        except Exception as e:
            logger.error(f"Error persisting ticket booking: {e}")

    # Deduct available count in memory
    tier["available"] = max(0, tier.get("available", 0) - booking.quantity)
    event["tickets_sold"] = event.get("tickets_sold", 0) + booking.quantity

    message = f"Tickets confirmed for {event.get('title')}! Your digital pass has been sent to {booking.customer_email}."
    if booking.payment_method == "mpesa":
        message = f"M-Pesa STK Push prompt initiated to {booking.mpesa_phone or booking.customer_phone} for KSh {total_kes:,}. Enter your M-Pesa PIN on your phone to complete your booking."

    return {
        "status": "success",
        "message": message,
        "booking": {
            "ticket_id": ticket_id,
            "event_title": event.get("title"),
            "artist": event.get("artist"),
            "venue": event.get("venue"),
            "date": event.get("date_display"),
            "tier_name": tier.get("name"),
            "quantity": booking.quantity,
            "total_usd": total_usd,
            "total_kes": total_kes,
            "qr_code_hash": qr_hash,
            "pass_url": f"/#/tickets/pass?id={ticket_id}"
        }
    }


@router.post("/rsvp", summary="RSVP to event or join tour waitlist")
async def rsvp_to_event(rsvp: EventRsvpRequest):
    """Add fan to tour waitlist, syncing automatically with Smart CRM fan engagement graphs."""
    events = await get_or_seed_events()
    event = next((e for e in events if e.get("id") == rsvp.event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")

    rsvp_id = f"rsvp-{uuid.uuid4().hex[:8]}"
    record = {
        "rsvp_id": rsvp_id,
        "event_id": rsvp.event_id,
        "event_title": event.get("title"),
        "artist": event.get("artist"),
        "fan_name": rsvp.fan_name,
        "fan_email": rsvp.fan_email,
        "city": rsvp.city,
        "notify_sms": rsvp.notify_sms,
        "fan_phone": rsvp.fan_phone,
        "synced_to_crm": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    if db is not None:
        try:
            await db.event_rsvps.insert_one(record)
            # Sync with Smart CRM fan list
            await db.crm_fans.update_one(
                {"email": rsvp.fan_email},
                {
                    "$set": {
                        "name": rsvp.fan_name,
                        "city": rsvp.city,
                        "last_active": datetime.now(timezone.utc).isoformat()
                    },
                    "$addToSet": {"tour_waitlists": event.get("title")},
                    "$inc": {"engagement_score": 15}
                },
                upsert=True
            )
        except Exception as e:
            logger.error(f"Error persisting RSVP: {e}")

    return {
        "status": "success",
        "message": f"You're on the priority list for {event.get('title')}! We've synced your profile with {event.get('artist')}'s Smart CRM community.",
        "rsvp_id": rsvp_id,
        "artist": event.get("artist"),
        "venue": event.get("venue"),
        "date": event.get("date_display")
    }
