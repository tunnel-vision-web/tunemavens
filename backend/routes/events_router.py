"""Live Concerts, Tours, Ticketing & Free RSVP Router.

Handles:
- Real-time directory of live events in progress, upcoming tours, masterclasses, and Free RSVP events.
- Dual payment modes for all events:
    * 'paid'      — Ticketed checkout (TunePay, M-Pesa STK Push, Card) with instant QR pass issuance.
    * 'free_rsvp' — Free RSVP with seating & standing capacity tracking, guest count indication,
                    optional strict +1 / +2 guest limits, and Smart CRM-routed Invited & Confirmed Guest Lists.
- Backend configuration endpoints to create/update event payment mode, seating/standing capacities,
  guest limit policies, and Smart CRM guest invitations.
"""

from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, Field

from auth import get_optional_user
from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/events", tags=["events-and-concerts"])


# ---------------------------------------------------------
# Seed Data for Concerts, Tours, Masterclasses & Free RSVP Events
# ---------------------------------------------------------
INITIAL_EVENTS = [
    {
        "id": "evt-ndufo-nairobi-tonight",
        "tour_id": "tour-ndufo-modular",
        "is_featured": True,
        "title": "Ndufo & The Modular Collective: Live at The Wave Lab",
        "artist": "Ndufo & The Modular Collective",
        "hosts": "TuneMavens Live & The Wave Lab",
        "mc": "MC Jayden (Nairobi Soundstage)",
        "entertainers": "Ndufo & The Modular Collective, Kilifi Percussionists & DJ Kalonje",
        "artist_id": "creator_ndufo",
        "status": "in-progress",
        "status_label": "LIVE TONIGHT",
        "badge_color": "#ef4444",
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 400,
        "standing_capacity": 800,
        "capacity": 1200,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Tonight · Doors 19:30",
        "date_iso": "2026-10-30",
        "time": "20:00 EAT",
        "venue": "The Alchemist / Wave Lab Stage",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Afro-Electronic & Modular Synth",
        "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
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
        "id": "evt-ndufo-album-listening-nairobi",
        "tour_id": "tour-ndufo-modular",
        "title": "Ndufo: Private Modular Album Listening & Industry Showcase",
        "artist": "Ndufo & The Modular Collective",
        "artist_id": "creator_ndufo",
        "status": "upcoming",
        "status_label": "FREE · RSVP",
        "badge_color": "#00f2fe",
        "payment_mode": "free_rsvp",
        "rsvp_enabled": True,
        "seating_capacity": 60,
        "standing_capacity": 40,
        "capacity": 100,
        "guest_limit_policy": "strict_plus_1",
        "max_additional_guests": 1,
        "crm_routed": True,
        "date_display": "Nov 08, 2026 · Doors 18:30 EAT",
        "date_iso": "2026-11-08",
        "time": "19:00 EAT",
        "venue": "TuneMavens Spatial Listening Room",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Afro-Electronic & Modular Synth",
        "image_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
        "tickets_sold": 9,
        "sold_percentage": 9.0,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_ndufo",
        "description": "Complimentary invite & RSVP-only spatial audio premiere of Ndufo's upcoming album. Strictly enforced +1 guest policy with dedicated seated listening tiers and standing mixer floor, routed directly through Smart CRM.",
        "tiers": []
    },
    {
        "id": "evt-aisha-acoustic-salon-nairobi",
        "tour_id": "tour-aisha-soul",
        "title": "Aisha Mwangi: Candlelight Acoustic Salon & Fan Appreciation",
        "artist": "Aisha Mwangi",
        "artist_id": "creator_aisha",
        "status": "upcoming",
        "status_label": "FREE · RSVP",
        "badge_color": "#10b981",
        "payment_mode": "free_rsvp",
        "rsvp_enabled": True,
        "seating_capacity": 80,
        "standing_capacity": 120,
        "capacity": 200,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Nov 15, 2026 · Doors 17:30 EAT",
        "date_iso": "2026-11-15",
        "time": "18:00 EAT",
        "venue": "Karen Courtyard Amphitheatre",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Contemporary Pan-African Soul",
        "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80",
        "tickets_sold": 12,
        "sold_percentage": 6.0,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": "#/epk/creator_aisha",
        "description": "Free community acoustic sunset session celebrating East African soul superfans. Bring your friends and indicate your party size on RSVP — seated garden tables and standing lawn capacity managed live via Smart CRM.",
        "tiers": []
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 1200,
        "standing_capacity": 1000,
        "capacity": 2200,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Tonight · Doors 20:00",
        "date_iso": "2026-10-30",
        "time": "20:30 CAT",
        "venue": "Kigali Arena Amphitheatre",
        "city": "Kigali",
        "country": "Rwanda",
        "country_code": "RW",
        "genre": "Contemporary Pan-African Soul",
        "image_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 120,
        "standing_capacity": 600,
        "capacity": 720,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Nov 12, 2026 · 20:00 GMT",
        "date_iso": "2026-11-12",
        "time": "20:00 GMT",
        "venue": "Village Underground",
        "city": "London",
        "country": "United Kingdom",
        "country_code": "GB",
        "genre": "Afro-Electronic & Modular Synth",
        "image_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=80",
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 150,
        "standing_capacity": 700,
        "capacity": 850,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Nov 18, 2026 · 21:00 CET",
        "date_iso": "2026-11-18",
        "time": "21:00 CET",
        "venue": "SO36 Kreuzberg",
        "city": "Berlin",
        "country": "Germany",
        "country_code": "DE",
        "genre": "Alternative Afro-Rock & Live Fusion",
        "image_url": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1000&q=80",
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 25,
        "standing_capacity": 0,
        "capacity": 25,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Nov 02, 2026 · 14:00 - 18:00 EAT",
        "date_iso": "2026-11-02",
        "time": "14:00 EAT",
        "venue": "TuneMavens Studio Lab 1",
        "city": "Nairobi",
        "country": "Kenya",
        "country_code": "KE",
        "genre": "Sound Design & Creative Technology",
        "image_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80",
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 300,
        "standing_capacity": 600,
        "capacity": 900,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Dec 04, 2026 · 19:30 CET",
        "date_iso": "2026-12-04",
        "time": "19:30 CET",
        "venue": "La Gaîté Lyrique",
        "city": "Paris",
        "country": "France",
        "country_code": "FR",
        "genre": "Tuareg Rock & Desert Blues",
        "image_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
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
        "payment_mode": "paid",
        "rsvp_enabled": False,
        "seating_capacity": 150,
        "standing_capacity": 450,
        "capacity": 600,
        "guest_limit_policy": "open",
        "max_additional_guests": None,
        "crm_routed": True,
        "date_display": "Dec 14, 2026 · 19:00 JST",
        "date_iso": "2026-12-14",
        "time": "19:00 JST",
        "venue": "Contact Shibuya / Sound Museum",
        "city": "Tokyo",
        "country": "Japan",
        "country_code": "JP",
        "genre": "Afro-House Ensemble & Live Electronics",
        "image_url": "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=1000&q=80",
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


INITIAL_EVENT_INVITATIONS = [
    # Ndufo Private Listening (strict +1)
    {
        "invitation_id": "inv-nd-001",
        "event_id": "evt-ndufo-album-listening-nairobi",
        "guest_name": "Alex Chen",
        "guest_email": "alex.chen@cyberdome.io",
        "guest_phone": "+254 712 345 678",
        "role_tag": "VIP Fan Club",
        "crm_contact_id": "CRM-ND-1",
        "crm_channel": "whatsapp",
        "status": "confirmed",
        "attendance_type": "seating",
        "additional_guests": 1,
        "party_size": 2,
        "invited_at": "2026-10-20T09:00:00+00:00",
        "confirmed_at": "2026-10-21T14:22:00+00:00",
    },
    {
        "invitation_id": "inv-nd-002",
        "event_id": "evt-ndufo-album-listening-nairobi",
        "guest_name": "Elena Richter",
        "guest_email": "elena.richter@berlinsync.de",
        "guest_phone": "+49 171 8920192",
        "role_tag": "Music Supervisor",
        "crm_contact_id": "CRM-ND-2",
        "crm_channel": "email",
        "status": "confirmed",
        "attendance_type": "seating",
        "additional_guests": 1,
        "party_size": 2,
        "invited_at": "2026-10-20T09:05:00+00:00",
        "confirmed_at": "2026-10-22T10:15:00+00:00",
    },
    {
        "invitation_id": "inv-nd-003",
        "event_id": "evt-ndufo-album-listening-nairobi",
        "guest_name": "Tariq Al-Mansoor",
        "guest_email": "tariq@dubaimusicweek.ae",
        "guest_phone": "+971 50 829 1042",
        "role_tag": "Promoter / Booking",
        "crm_contact_id": "CRM-ND-3",
        "crm_channel": "sms",
        "status": "invited",
        "attendance_type": "seating",
        "additional_guests": 0,
        "party_size": 1,
        "invited_at": "2026-10-20T09:10:00+00:00",
        "confirmed_at": None,
    },
    {
        "invitation_id": "inv-nd-004",
        "event_id": "evt-ndufo-album-listening-nairobi",
        "guest_name": "Maya Lin",
        "guest_email": "maya@modularsound.org",
        "guest_phone": "+1 (415) 890-2341",
        "role_tag": "VIP Vault Pass",
        "crm_contact_id": "CRM-ND-4",
        "crm_channel": "in_app",
        "status": "confirmed",
        "attendance_type": "standing",
        "additional_guests": 0,
        "party_size": 1,
        "invited_at": "2026-10-20T09:15:00+00:00",
        "confirmed_at": "2026-10-23T18:40:00+00:00",
    },
    {
        "invitation_id": "inv-nd-005",
        "event_id": "evt-ndufo-album-listening-nairobi",
        "guest_name": "Kwame Osei",
        "guest_email": "kwame@accramavens.com",
        "guest_phone": "+233 24 519 2831",
        "role_tag": "Press & Media",
        "crm_contact_id": "CRM-ND-5",
        "crm_channel": "email",
        "status": "invited",
        "attendance_type": "seating",
        "additional_guests": 0,
        "party_size": 1,
        "invited_at": "2026-10-20T09:20:00+00:00",
        "confirmed_at": None,
    },
    # Aisha Acoustic Salon (open guest count)
    {
        "invitation_id": "inv-ai-001",
        "event_id": "evt-aisha-acoustic-salon-nairobi",
        "guest_name": "Fatima Zahra",
        "guest_email": "fatima.z@casablancavibes.ma",
        "guest_phone": "+212 661 294810",
        "role_tag": "Superfan VIP",
        "crm_contact_id": "CRM-AI-1",
        "crm_channel": "whatsapp",
        "status": "confirmed",
        "attendance_type": "seating",
        "additional_guests": 3,
        "party_size": 4,
        "invited_at": "2026-10-21T08:00:00+00:00",
        "confirmed_at": "2026-10-22T12:00:00+00:00",
    },
    {
        "invitation_id": "inv-ai-002",
        "event_id": "evt-aisha-acoustic-salon-nairobi",
        "guest_name": "Brenda Wanjiru",
        "guest_email": "brenda.w@nairobilive.ke",
        "guest_phone": "+254 722 901 823",
        "role_tag": "Nairobi VIP Circle",
        "crm_contact_id": "CRM-AI-3",
        "crm_channel": "sms",
        "status": "confirmed",
        "attendance_type": "standing",
        "additional_guests": 4,
        "party_size": 5,
        "invited_at": "2026-10-21T08:05:00+00:00",
        "confirmed_at": "2026-10-23T09:30:00+00:00",
    },
    {
        "invitation_id": "inv-ai-003",
        "event_id": "evt-aisha-acoustic-salon-nairobi",
        "guest_name": "Marcus Sterling",
        "guest_email": "m.sterling@uktouring.co.uk",
        "guest_phone": "+44 7911 204918",
        "role_tag": "Tour Promoter",
        "crm_contact_id": "CRM-AI-2",
        "crm_channel": "email",
        "status": "invited",
        "attendance_type": "seating",
        "additional_guests": 0,
        "party_size": 1,
        "invited_at": "2026-10-21T08:10:00+00:00",
        "confirmed_at": None,
    },
    {
        "invitation_id": "inv-ai-004",
        "event_id": "evt-aisha-acoustic-salon-nairobi",
        "guest_name": "Chloe Dupont",
        "guest_email": "chloe@parissoul.fr",
        "guest_phone": "+33 6 12 34 56 78",
        "role_tag": "Sync Supervisor",
        "crm_contact_id": "CRM-AI-5",
        "crm_channel": "in_app",
        "status": "invited",
        "attendance_type": "seating",
        "additional_guests": 0,
        "party_size": 1,
        "invited_at": "2026-10-21T08:15:00+00:00",
        "confirmed_at": None,
    },
]


# ---------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------
class EventCreateRequest(BaseModel):
    title: str = Field(..., min_length=2)
    artist: str = Field(..., min_length=2)
    artist_id: Optional[str] = Field(default="creator_custom")
    tour_id: Optional[str] = Field(default=None)
    status: str = Field(default="upcoming", description="in-progress | upcoming | workshop")
    payment_mode: str = Field(default="paid", description="paid | free_rsvp")
    seating_capacity: int = Field(default=100, ge=0)
    standing_capacity: int = Field(default=100, ge=0)
    guest_limit_policy: str = Field(
        default="open",
        description="open | strict_plus_1 | strict_plus_2"
    )
    max_additional_guests: Optional[int] = Field(default=None, ge=0)
    date_display: str = Field(default="TBD")
    date_iso: Optional[str] = Field(default=None)
    time: Optional[str] = Field(default="19:00 EAT")
    venue: str = Field(..., min_length=2)
    city: str = Field(..., min_length=2)
    country: str = Field(default="Kenya")
    country_code: str = Field(default="KE")
    genre: str = Field(default="Live Showcase")
    image_url: Optional[str] = Field(
        default="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
    )
    description: Optional[str] = Field(default="")
    hosts: Optional[str] = Field(default=None)
    mc: Optional[str] = Field(default=None)
    entertainers: Optional[str] = Field(default=None)
    is_featured: bool = Field(default=False)
    tiers: Optional[List[Dict[str, Any]]] = Field(default_factory=list)


class EventConfigUpdateRequest(BaseModel):
    payment_mode: Optional[str] = Field(default=None, description="paid | free_rsvp")
    seating_capacity: Optional[int] = Field(default=None, ge=0)
    standing_capacity: Optional[int] = Field(default=None, ge=0)
    guest_limit_policy: Optional[str] = Field(
        default=None,
        description="open | strict_plus_1 | strict_plus_2"
    )
    max_additional_guests: Optional[int] = Field(default=None, ge=0)
    title: Optional[str] = None
    venue: Optional[str] = None
    city: Optional[str] = None
    date_display: Optional[str] = None
    description: Optional[str] = None
    hosts: Optional[str] = None
    mc: Optional[str] = None
    entertainers: Optional[str] = None
    is_featured: Optional[bool] = None


class GuestInviteItem(BaseModel):
    guest_name: str = Field(..., min_length=2)
    guest_email: str = Field(..., min_length=5)
    guest_phone: Optional[str] = None
    role_tag: Optional[str] = Field(default="Invited Guest")
    crm_contact_id: Optional[str] = None
    crm_channel: Optional[str] = Field(default="email", description="email | whatsapp | sms | in_app")


class EventInvitationsRequest(BaseModel):
    guests: List[GuestInviteItem] = Field(..., min_length=1)


class TicketBookingRequest(BaseModel):
    event_id: str = Field(..., description="Unique event ID")
    tier_id: str = Field(..., description="Ticketing tier ID (ga, vip, masterclass)")
    quantity: int = Field(default=1, ge=1, le=10, description="Number of tickets to purchase")
    customer_name: str = Field(..., min_length=2, description="Purchaser full name")
    customer_email: str = Field(..., min_length=5, description="Purchaser email for ticket delivery")
    customer_phone: Optional[str] = Field(default=None, description="Purchaser phone number")
    payment_method: str = Field(default="tunepay", description="tunepay | mpesa | card")
    mpesa_phone: Optional[str] = Field(default=None, description="M-Pesa phone number for STK Push in East Africa")
    reachout_token: Optional[str] = Field(default=None, description="Smart CRM reachout attribution token")
    ref_code: Optional[str] = Field(default=None, description="Affiliate referral code")


class EventRsvpRequest(BaseModel):
    event_id: str = Field(..., description="Unique event ID")
    fan_name: str = Field(..., min_length=2, description="Attendee full name")
    fan_email: str = Field(..., min_length=5, description="Attendee email address")
    city: Optional[str] = Field(default="", description="City of residence")
    notify_sms: Optional[bool] = Field(default=False, description="Opt-in to SMS alerts")
    fan_phone: Optional[str] = Field(default=None, description="Phone number")
    additional_guests: int = Field(
        default=0,
        ge=0,
        description="Number of additional guests coming with the attendee (0 = attending solo)"
    )
    guest_names: Optional[List[str]] = Field(default_factory=list, description="Optional names of accompanying guests")
    attendance_type: str = Field(default="seating", description="seating | standing")
    notes: Optional[str] = Field(default=None, description="Optional dietary/accessibility notes")
    reachout_token: Optional[str] = Field(default=None, description="Smart CRM reachout attribution token")
    ref_code: Optional[str] = Field(default=None, description="Affiliate referral code")


# ---------------------------------------------------------
# Helpers: Policy Normalization, Seeding & Smart CRM Sync
# ---------------------------------------------------------
def _normalize_policy(policy: Optional[str], max_additional: Optional[int] = None):
    p = (policy or "open").strip().lower()
    if p not in ("open", "strict_plus_1", "strict_plus_2"):
        p = "open"
    if p == "strict_plus_1":
        return p, 1
    if p == "strict_plus_2":
        return p, 2
    return p, max_additional


def _normalize_event_fields(event: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure every event document carries the unified payment_mode, capacity & RSVP policy fields."""
    doc = dict(event)
    payment_mode = "free_rsvp" if doc.get("payment_mode") == "free_rsvp" else "paid"
    doc["payment_mode"] = payment_mode
    doc["rsvp_enabled"] = payment_mode == "free_rsvp"
    doc["crm_routed"] = True

    seating_cap = doc.get("seating_capacity")
    standing_cap = doc.get("standing_capacity")
    raw_cap = int(doc.get("capacity") or 0)
    if seating_cap is None and standing_cap is None:
        seating_cap = raw_cap
        standing_cap = 0
    else:
        seating_cap = int(seating_cap or 0)
        standing_cap = int(standing_cap or 0)
        raw_cap = seating_cap + standing_cap

    doc["seating_capacity"] = seating_cap
    doc["standing_capacity"] = standing_cap
    doc["capacity"] = raw_cap

    policy, max_add = _normalize_policy(doc.get("guest_limit_policy"), doc.get("max_additional_guests"))
    doc["guest_limit_policy"] = policy
    doc["max_additional_guests"] = max_add
    doc["is_featured"] = bool(doc.get("is_featured", False))
    doc["hosts"] = (doc.get("hosts") or doc.get("artist") or "TuneMavens Live").strip()
    doc["mc"] = (doc.get("mc") or "TuneMavens Live Host").strip()
    doc["entertainers"] = (doc.get("entertainers") or doc.get("artist") or "Featured Live Talent").strip()
    return doc


def seed_event_guest_lists_if_empty():
    """Seed initial Smart CRM invitations & confirmed RSVPs for seeded free_rsvp events."""
    if db is None:
        return
    try:
        if db.event_invitations.count_documents({}) == 0:
            db.event_invitations.insert_many([dict(inv) for inv in INITIAL_EVENT_INVITATIONS])
            # Also seed corresponding confirmed RSVP records for already-confirmed invites
            for inv in INITIAL_EVENT_INVITATIONS:
                if inv["status"] == "confirmed":
                    exists = db.event_rsvps.find_one({
                        "event_id": inv["event_id"],
                        "fan_email": inv["guest_email"].lower(),
                    })
                    if not exists:
                        db.event_rsvps.insert_one({
                            "rsvp_id": f"rsvp-{inv['invitation_id']}",
                            "event_id": inv["event_id"],
                            "fan_name": inv["guest_name"],
                            "fan_email": inv["guest_email"].lower(),
                            "fan_phone": inv.get("guest_phone"),
                            "city": "Nairobi",
                            "role_tag": inv.get("role_tag", "Invited Guest"),
                            "additional_guests": inv.get("additional_guests", 0),
                            "party_size": inv.get("party_size", 1),
                            "attendance_type": inv.get("attendance_type", "seating"),
                            "guest_names": [],
                            "was_invited": True,
                            "invitation_id": inv["invitation_id"],
                            "crm_contact_id": inv.get("crm_contact_id"),
                            "synced_to_crm": True,
                            "qr_code_hash": f"tm_rsvp_{inv['invitation_id']}",
                            "created_at": inv.get("confirmed_at") or datetime.now(timezone.utc).isoformat(),
                        })
    except Exception as e:
        logger.warning(f"Failed to seed event invitations/RSVPs: {e}")


def get_or_seed_events() -> List[Dict[str, Any]]:
    """Ensure live_events collection exists, contains all authoritative events, and has unified RSVP fields."""
    if db is None:
        return [_normalize_event_fields(e) for e in INITIAL_EVENTS]
    try:
        seed_event_guest_lists_if_empty()
        existing_ids = {
            doc["id"] for doc in db.live_events.find({}, {"_id": 0, "id": 1}) if doc.get("id")
        }
        now_iso = datetime.now(timezone.utc).isoformat()
        missing = [
            dict(_normalize_event_fields(item), created_at=now_iso)
            for item in INITIAL_EVENTS
            if item["id"] not in existing_ids
        ]
        if missing:
            db.live_events.insert_many(missing)

        docs = list(db.live_events.find({}, {"_id": 0}))
        if docs and not any(d.get("is_featured") for d in docs):
            first_id = docs[0].get("id")
            if first_id:
                db.live_events.update_one({"id": first_id}, {"$set": {"is_featured": True}})
                docs[0]["is_featured"] = True
        return [_normalize_event_fields(d) for d in docs]
    except Exception as e:
        logger.warning(f"Failed to query Mongo for live events, using memory seed: {e}")
        return [_normalize_event_fields(e) for e in INITIAL_EVENTS]


def build_event_guest_list_and_telemetry(event: Dict[str, Any]) -> Dict[str, Any]:
    """Compute live seating/standing capacity telemetry and Smart CRM invited + confirmed guest lists."""
    event_id = event["id"]
    seating_cap = int(event.get("seating_capacity", event.get("capacity", 0)))
    standing_cap = int(event.get("standing_capacity", 0))
    total_cap = seating_cap + standing_cap

    invitations = []
    rsvps = []
    reachout_invites = []
    if db is not None:
        try:
            invitations = list(db.event_invitations.find({"event_id": event_id}, {"_id": 0}))
            rsvps = list(db.event_rsvps.find({"event_id": event_id}, {"_id": 0}))
            reachout_invites = list(db.crm_reachout_links.find({"event_id": event_id}, {"_id": 0}))
        except Exception as e:
            logger.warning(f"Error reading guest list for {event_id}: {e}")

    rsvp_by_email: Dict[str, Dict[str, Any]] = {}
    for r in rsvps:
        em = (r.get("fan_email") or "").strip().lower()
        if em:
            rsvp_by_email[em] = r

    invited_guests: List[Dict[str, Any]] = []
    invited_emails = set()
    for inv in invitations:
        em = (inv.get("guest_email") or "").strip().lower()
        invited_emails.add(em)
        matched_rsvp = rsvp_by_email.get(em)
        is_confirmed = bool(matched_rsvp) or inv.get("status") == "confirmed"
        add_guests = int(
            matched_rsvp.get("additional_guests", 0)
            if matched_rsvp
            else inv.get("additional_guests", 0)
        )
        zone = (
            matched_rsvp.get("attendance_type")
            if matched_rsvp
            else inv.get("attendance_type")
        ) or "seating"
        invited_guests.append({
            "invitation_id": inv.get("invitation_id"),
            "name": inv.get("guest_name"),
            "email": inv.get("guest_email"),
            "phone": inv.get("guest_phone"),
            "role_tag": inv.get("role_tag", "Invited Guest"),
            "crm_contact_id": inv.get("crm_contact_id"),
            "crm_channel": inv.get("crm_channel", "email"),
            "crm_synced": True,
            "status": "confirmed" if is_confirmed else "invited",
            "attendance_type": zone if is_confirmed else None,
            "additional_guests": add_guests if is_confirmed else 0,
            "party_size": (1 + add_guests) if is_confirmed else 0,
            "invited_at": inv.get("invited_at"),
            "confirmed_at": (matched_rsvp.get("created_at") if matched_rsvp else inv.get("confirmed_at")),
        })

    # Reconcile Smart CRM reachout recipients invited to this event into invited_guests
    for rl in reachout_invites:
        em = (rl.get("recipient_email") or "").strip().lower()
        if not em or em in invited_emails:
            continue
        invited_emails.add(em)
        matched_rsvp = rsvp_by_email.get(em)
        is_confirmed = bool(matched_rsvp) or bool(rl.get("rsvped"))
        add_guests = int(matched_rsvp.get("additional_guests", 0)) if matched_rsvp else 0
        zone = (matched_rsvp.get("attendance_type") if matched_rsvp else "seating") or "seating"
        created_val = rl.get("created_at")
        invited_at_str = created_val.isoformat() if isinstance(created_val, datetime) else created_val
        invited_guests.append({
            "invitation_id": rl.get("token"),
            "name": rl.get("recipient_name") or em,
            "email": em,
            "phone": None,
            "role_tag": "Smart CRM Reachout",
            "crm_contact_id": rl.get("token"),
            "crm_channel": "email",
            "crm_synced": True,
            "status": "confirmed" if is_confirmed else "invited",
            "attendance_type": zone if is_confirmed else None,
            "additional_guests": add_guests if is_confirmed else 0,
            "party_size": (1 + add_guests) if is_confirmed else 0,
            "invited_at": invited_at_str,
            "confirmed_at": (matched_rsvp.get("created_at") if matched_rsvp else None),
        })

    confirmed_guests: List[Dict[str, Any]] = []
    seating_confirmed = 0
    standing_confirmed = 0

    for r in rsvps:
        em = (r.get("fan_email") or "").strip().lower()
        add_guests = int(r.get("additional_guests") or 0)
        party_size = int(r.get("party_size") or (1 + add_guests))
        zone = (r.get("attendance_type") or "seating").lower()
        if zone == "standing":
            standing_confirmed += party_size
        else:
            zone = "seating"
            seating_confirmed += party_size

        confirmed_guests.append({
            "rsvp_id": r.get("rsvp_id"),
            "name": r.get("fan_name"),
            "email": r.get("fan_email"),
            "phone": r.get("fan_phone"),
            "city": r.get("city", ""),
            "role_tag": r.get("role_tag") or ("Invited VIP" if em in invited_emails else "Confirmed RSVP"),
            "was_invited": em in invited_emails or bool(r.get("was_invited")),
            "additional_guests": add_guests,
            "party_size": party_size,
            "guest_names": r.get("guest_names", []),
            "attendance_type": zone,
            "crm_contact_id": r.get("crm_contact_id"),
            "crm_synced": bool(r.get("synced_to_crm", True)),
            "qr_code_hash": r.get("qr_code_hash"),
            "confirmed_at": r.get("created_at"),
        })

    total_confirmed_headcount = seating_confirmed + standing_confirmed
    seating_remaining = max(0, seating_cap - seating_confirmed)
    standing_remaining = max(0, standing_cap - standing_confirmed)
    total_remaining = max(0, total_cap - total_confirmed_headcount)
    occupancy_pct = round((total_confirmed_headcount / max(total_cap, 1)) * 100, 1)

    pending_invites = len([g for g in invited_guests if g["status"] != "confirmed"])

    return {
        "rsvp_summary": {
            "payment_mode": event.get("payment_mode", "paid"),
            "guest_limit_policy": event.get("guest_limit_policy", "open"),
            "max_additional_guests": event.get("max_additional_guests"),
            "seating_capacity": seating_cap,
            "standing_capacity": standing_cap,
            "total_capacity": total_cap,
            "seating_confirmed": seating_confirmed,
            "standing_confirmed": standing_confirmed,
            "total_confirmed_headcount": total_confirmed_headcount,
            "seating_remaining": seating_remaining,
            "standing_remaining": standing_remaining,
            "total_remaining": total_remaining,
            "occupancy_percentage": occupancy_pct,
            "invited_count": len(invited_guests),
            "confirmed_rsvp_count": len(confirmed_guests),
            "pending_invites_count": pending_invites,
            "crm_routed": True,
        },
        "invited_guests": invited_guests,
        "confirmed_guests": confirmed_guests,
    }


def _enrich_event_with_rsvp(event: Dict[str, Any], include_lists: bool = False) -> Dict[str, Any]:
    """Attach live RSVP telemetry (and optionally full guest lists) to an event dict."""
    enriched = _normalize_event_fields(event)
    if enriched["payment_mode"] == "free_rsvp" or include_lists:
        bundle = build_event_guest_list_and_telemetry(enriched)
        summary = bundle["rsvp_summary"]
        enriched["rsvp_summary"] = summary
        if enriched["payment_mode"] == "free_rsvp":
            enriched["tickets_sold"] = summary["total_confirmed_headcount"]
            enriched["sold_percentage"] = summary["occupancy_percentage"]
            enriched["low_inventory"] = summary["occupancy_percentage"] >= 85.0
        if include_lists:
            enriched["invited_guests"] = bundle["invited_guests"]
            enriched["confirmed_guests"] = bundle["confirmed_guests"]
    return enriched


def _route_guest_through_smart_crm(
    *,
    event: Dict[str, Any],
    name: str,
    email: str,
    phone: Optional[str] = None,
    city: str = "",
    action: str = "rsvp_confirmed",
    party_size: int = 1,
    attendance_type: str = "seating",
    extra_meta: Optional[Dict[str, Any]] = None,
) -> str:
    """Route an event invitation or RSVP confirmation through Smart CRM collections."""
    now_dt = datetime.now(timezone.utc)
    now_iso = now_dt.isoformat()
    clean_email = email.strip().lower()
    crm_contact_id = f"CRM-EVT-{uuid.uuid4().hex[:6].upper()}"

    if db is None:
        return crm_contact_id

    try:
        existing_fan = db.crm_fans.find_one({"email": clean_email})
        if existing_fan and existing_fan.get("crm_contact_id"):
            crm_contact_id = existing_fan["crm_contact_id"]

        db.crm_fans.update_one(
            {"email": clean_email},
            {
                "$set": {
                    "name": name,
                    "email": clean_email,
                    "phone": phone,
                    "city": city,
                    "crm_contact_id": crm_contact_id,
                    "last_active": now_iso,
                },
                "$addToSet": {
                    "tour_waitlists": event.get("title"),
                    "event_ids": event.get("id"),
                },
                "$inc": {"engagement_score": 20 if action == "rsvp_confirmed" else 5},
            },
            upsert=True,
        )

        # Log in Smart CRM Leads pipeline so Backend Admin CRM Queue sees it
        lead_doc = {
            "name": name,
            "email": clean_email,
            "phone": phone,
            "crm_contact_id": crm_contact_id,
            "inquiry_type": "event_rsvp" if action == "rsvp_confirmed" else "event_invitation",
            "event_id": event.get("id"),
            "event_title": event.get("title"),
            "artist": event.get("artist"),
            "party_size": party_size,
            "attendance_type": attendance_type,
            "message": (
                f"Confirmed RSVP for {event.get('title')} (Party of {party_size}, {attendance_type.title()})"
                if action == "rsvp_confirmed"
                else f"Invited via Smart CRM to {event.get('title')}"
            ),
            "status": "confirmed" if action == "rsvp_confirmed" else "invited",
            "source": "event_smart_crm_rsvp",
            "metadata": extra_meta or {},
            "created_at": now_dt,
        }
        db.crm_leads.update_one(
            {"email": clean_email, "event_id": event.get("id"), "source": "event_smart_crm_rsvp"},
            {"$set": lead_doc},
            upsert=True,
        )

        # Dispatch in-app notification to user_inbox
        user_doc = db.users.find_one({"email": clean_email})
        target_user_id = str(user_doc["_id"]) if user_doc else clean_email
        inbox_subject = (
            f"RSVP Confirmed: {event.get('title')}"
            if action == "rsvp_confirmed"
            else f"You're Invited: {event.get('title')}"
        )
        inbox_body = (
            f"Hi {name}, your RSVP for {event.get('title')} at {event.get('venue')} ({event.get('date_display')}) is confirmed "
            f"for {party_size} guest(s) in the {attendance_type.title()} section."
            if action == "rsvp_confirmed"
            else f"Hi {name}, you've been invited via Smart CRM to {event.get('title')} at {event.get('venue')} ({event.get('date_display')}). "
                 f"Confirm your attendance on the event page."
        )
        db.user_inbox.insert_one({
            "user_id": target_user_id,
            "recipient_email": clean_email,
            "sender": f"{event.get('artist')} · Smart CRM",
            "subject": inbox_subject,
            "body": inbox_body,
            "cta_label": "View Event Page",
            "cta_url": f"/tours?event={event.get('id')}",
            "category": "event_rsvp",
            "event_id": event.get("id"),
            "read": False,
            "created_at": now_dt,
        })
    except Exception as e:
        logger.warning(f"Smart CRM routing warning for {clean_email}: {e}")

    return crm_contact_id


# ---------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------
@router.get("", summary="Get all concerts, live tours, masterclasses & Free RSVP events")
def list_events(
    status_filter: Optional[str] = Query(None, description="in-progress | upcoming | workshop | all"),
    payment_mode: Optional[str] = Query(None, description="paid | free_rsvp | all"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    country_code: Optional[str] = Query(None, description="Filter by country code (KE, RW, GB, DE, FR, JP)"),
    genre: Optional[str] = Query(None, description="Filter by musical genre"),
    search: Optional[str] = Query(None, description="Search by artist, venue, or title")
):
    """List all events with dynamic filters and live RSVP/ticketing telemetry."""
    events = [_enrich_event_with_rsvp(e, include_lists=False) for e in get_or_seed_events()]
    filtered = events

    if status_filter and status_filter != "all":
        filtered = [e for e in filtered if e.get("status") == status_filter]

    if payment_mode and payment_mode != "all":
        filtered = [e for e in filtered if e.get("payment_mode") == payment_mode]

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

    in_progress_count = len([e for e in events if e.get("status") == "in-progress"])
    upcoming_count = len([e for e in events if e.get("status") == "upcoming"])
    workshops_count = len([e for e in events if e.get("status") == "workshop"])
    free_rsvp_count = len([e for e in events if e.get("payment_mode") == "free_rsvp"])
    total_capacity = sum(e.get("capacity", 0) for e in events)
    total_sold = sum(e.get("tickets_sold", 0) for e in events)

    featured_ev = next((e for e in events if e.get("is_featured")), None) or (events[0] if events else None)

    return {
        "status": "success",
        "count": len(filtered),
        "featured_event": featured_ev,
        "macro_telemetry": {
            "in_progress_count": in_progress_count,
            "upcoming_count": upcoming_count,
            "workshops_count": workshops_count,
            "free_rsvp_count": free_rsvp_count,
            "total_capacity": total_capacity,
            "total_tickets_sold": total_sold,
            "overall_occupancy_rate": f"{round((total_sold / max(total_capacity, 1)) * 100, 1)}%"
        },
        "events": filtered
    }


def _assert_admin_user(user: Optional[dict]):
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required.")
    role = (user.get("role") or "").strip().lower()
    is_admin = bool(user.get("is_admin")) or role == "admin" or ("admin" in [str(r).lower() for r in (user.get("roles") or [])])
    if not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators can set the Featured Event.")


@router.get("/featured", summary="Get the single Admin-featured event for Home & Event pages")
def get_featured_event():
    """Return the single event marked as featured (or the first active event)."""
    events = [_enrich_event_with_rsvp(e, include_lists=False) for e in get_or_seed_events()]
    featured_ev = next((e for e in events if e.get("is_featured")), None) or (events[0] if events else None)
    return {"status": "success", "featured_event": featured_ev}


@router.post("/{event_id}/feature", summary="Admin-only: Set an event as the single Featured Event")
def set_featured_event(event_id: str, user=Depends(get_optional_user)):
    """Set `event_id` as the sole featured event across the Home landing page and all Event pages (Admin-only)."""
    _assert_admin_user(user)
    events = get_or_seed_events()
    target = next((e for e in events if e.get("id") == event_id), None)
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event '{event_id}' not found.")

    if db is not None:
        db.live_events.update_many({}, {"$set": {"is_featured": False}})
        db.live_events.update_one({"id": event_id}, {"$set": {"is_featured": True, "updated_at": datetime.now(timezone.utc).isoformat()}})

    updated = dict(target, is_featured=True)
    return {
        "status": "success",
        "message": f"'{updated.get('title')}' is now the single Featured Event across Home & Events pages.",
        "featured_event": _enrich_event_with_rsvp(updated, include_lists=False),
    }


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create a Paid or Free-RSVP event")
def create_live_event(payload: EventCreateRequest, user=Depends(get_optional_user)):
    """Create a new event with explicit payment_mode ('paid' | 'free_rsvp'),
    seating & standing capacities, and guest limit policy ('open' | 'strict_plus_1' | 'strict_plus_2')."""
    payment_mode = "free_rsvp" if payload.payment_mode == "free_rsvp" else "paid"
    policy, max_add = _normalize_policy(payload.guest_limit_policy, payload.max_additional_guests)
    total_cap = payload.seating_capacity + payload.standing_capacity
    if total_cap <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Combined seating_capacity + standing_capacity must be greater than 0."
        )

    event_id = f"evt-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()
    status_label = "FREE · RSVP" if payment_mode == "free_rsvp" else (
        "LIVE TONIGHT" if payload.status == "in-progress" else (
            "MASTERCLASS" if payload.status == "workshop" else "UPCOMING"
        )
    )
    badge_color = "#00f2fe" if payment_mode == "free_rsvp" else (
        "#ef4444" if payload.status == "in-progress" else "#10b981"
    )

    tiers = [] if payment_mode == "free_rsvp" else (
        payload.tiers or [
            {
                "tier_id": "ga",
                "name": "General Admission",
                "price_usd": 25,
                "price_kes": 3250,
                "available": total_cap,
                "perks": ["Event floor access", "Cryptographic QR pass"]
            }
        ]
    )

    doc = {
        "id": event_id,
        "tour_id": payload.tour_id or f"tour-{event_id}",
        "title": payload.title.strip(),
        "artist": payload.artist.strip(),
        "artist_id": payload.artist_id or "creator_custom",
        "status": payload.status,
        "status_label": status_label,
        "badge_color": badge_color,
        "payment_mode": payment_mode,
        "rsvp_enabled": payment_mode == "free_rsvp",
        "seating_capacity": payload.seating_capacity,
        "standing_capacity": payload.standing_capacity,
        "capacity": total_cap,
        "guest_limit_policy": policy,
        "max_additional_guests": max_add,
        "crm_routed": True,
        "date_display": payload.date_display,
        "date_iso": payload.date_iso or datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "time": payload.time or "19:00 EAT",
        "venue": payload.venue.strip(),
        "city": payload.city.strip(),
        "country": payload.country.strip(),
        "country_code": payload.country_code.strip().upper(),
        "genre": payload.genre.strip(),
        "image_url": payload.image_url,
        "tickets_sold": 0,
        "sold_percentage": 0.0,
        "low_inventory": False,
        "is_live_stream_active": False,
        "stream_url": None,
        "epk_url": f"#/epk/{payload.artist_id or 'creator_custom'}",
        "description": payload.description or "",
        "tiers": tiers,
        "created_at": now_iso,
    }

    if db is not None:
        db.live_events.insert_one(dict(doc))

    return {
        "status": "success",
        "event": _enrich_event_with_rsvp(doc, include_lists=(payment_mode == "free_rsvp"))
    }


@router.get("/{event_id}", summary="Get single concert, masterclass, or Free RSVP event details")
def get_event_detail(event_id: str):
    """Retrieve full event specification, seating/standing capacity, ticket tiers, and Smart CRM guest list."""
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == event_id), None)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event '{event_id}' not found."
        )
    return _enrich_event_with_rsvp(event, include_lists=True)


@router.patch("/{event_id}", summary="Update event payment mode, seating/standing capacity & guest limit policy")
@router.put("/{event_id}/config", summary="Configure event payment mode, seating/standing capacity & guest limit policy")
def update_event_config(event_id: str, payload: EventConfigUpdateRequest, user=Depends(get_optional_user)):
    """Backend configuration endpoint to toggle Paid vs Free-RSVP, set seating/standing capacities,
    and enforce strict +1 / +2 or open guest count limits."""
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event '{event_id}' not found.")

    updates: Dict[str, Any] = {}
    if payload.payment_mode is not None:
        pm = "free_rsvp" if payload.payment_mode == "free_rsvp" else "paid"
        updates["payment_mode"] = pm
        updates["rsvp_enabled"] = pm == "free_rsvp"
        if pm == "free_rsvp":
            updates["status_label"] = "FREE · RSVP"
            updates["badge_color"] = "#00f2fe"

    seating_cap = payload.seating_capacity if payload.seating_capacity is not None else event.get("seating_capacity", 0)
    standing_cap = payload.standing_capacity if payload.standing_capacity is not None else event.get("standing_capacity", 0)
    if payload.seating_capacity is not None or payload.standing_capacity is not None:
        if seating_cap + standing_cap <= 0:
            raise HTTPException(status_code=400, detail="Combined seating + standing capacity must be > 0.")
        updates["seating_capacity"] = seating_cap
        updates["standing_capacity"] = standing_cap
        updates["capacity"] = seating_cap + standing_cap

    if payload.guest_limit_policy is not None or payload.max_additional_guests is not None:
        policy, max_add = _normalize_policy(
            payload.guest_limit_policy or event.get("guest_limit_policy"),
            payload.max_additional_guests if payload.guest_limit_policy is None else payload.max_additional_guests
        )
        updates["guest_limit_policy"] = policy
        updates["max_additional_guests"] = max_add

    for field in ("title", "venue", "city", "date_display", "description", "hosts", "mc", "entertainers"):
        val = getattr(payload, field, None)
        if val is not None:
            updates[field] = val

    if payload.is_featured is True:
        _assert_admin_user(user)
        if db is not None:
            db.live_events.update_many({}, {"$set": {"is_featured": False}})
        updates["is_featured"] = True
    elif payload.is_featured is False:
        _assert_admin_user(user)
        updates["is_featured"] = False

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    if db is not None and updates:
        db.live_events.update_one({"id": event_id}, {"$set": updates})

    merged = dict(event, **updates)
    return {
        "status": "success",
        "event": _enrich_event_with_rsvp(merged, include_lists=True)
    }


@router.get("/{event_id}/guest-list", summary="Get Smart CRM-routed Invited & Confirmed RSVP Guest List")
def get_event_guest_list(event_id: str):
    """Returns invited guests, confirmed RSVP attendees, seating/standing capacity telemetry, and guest limit policy."""
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event '{event_id}' not found.")

    bundle = build_event_guest_list_and_telemetry(event)
    return {
        "status": "success",
        "event_id": event_id,
        "event_title": event.get("title"),
        "payment_mode": event.get("payment_mode"),
        **bundle
    }


@router.post("/{event_id}/invitations", status_code=status.HTTP_201_CREATED, summary="Invite guests to an event via Smart CRM")
def invite_event_guests(event_id: str, payload: EventInvitationsRequest, user=Depends(get_optional_user)):
    """Add invited guests to an event and route each invitation through Smart CRM."""
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Event '{event_id}' not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    created_invitations = []

    for g in payload.guests:
        clean_email = g.guest_email.strip().lower()
        crm_contact_id = g.crm_contact_id or _route_guest_through_smart_crm(
            event=event,
            name=g.guest_name.strip(),
            email=clean_email,
            phone=g.guest_phone,
            action="invited",
            party_size=1,
            attendance_type="seating",
            extra_meta={"role_tag": g.role_tag, "crm_channel": g.crm_channel},
        )
        inv_id = f"inv-{uuid.uuid4().hex[:8]}"
        inv_doc = {
            "invitation_id": inv_id,
            "event_id": event_id,
            "guest_name": g.guest_name.strip(),
            "guest_email": clean_email,
            "guest_phone": g.guest_phone,
            "role_tag": g.role_tag or "Invited Guest",
            "crm_contact_id": crm_contact_id,
            "crm_channel": g.crm_channel or "email",
            "status": "invited",
            "attendance_type": "seating",
            "additional_guests": 0,
            "party_size": 1,
            "invited_at": now_iso,
            "confirmed_at": None,
        }
        if db is not None:
            existing = db.event_invitations.find_one({"event_id": event_id, "guest_email": clean_email})
            if existing:
                db.event_invitations.update_one(
                    {"event_id": event_id, "guest_email": clean_email},
                    {"$set": {
                        "guest_name": inv_doc["guest_name"],
                        "guest_phone": inv_doc["guest_phone"],
                        "role_tag": inv_doc["role_tag"],
                        "crm_channel": inv_doc["crm_channel"],
                        "crm_contact_id": crm_contact_id,
                    }}
                )
                inv_doc["invitation_id"] = existing.get("invitation_id", inv_id)
                inv_doc["status"] = existing.get("status", "invited")
            else:
                db.event_invitations.insert_one(dict(inv_doc))
        created_invitations.append(inv_doc)

    bundle = build_event_guest_list_and_telemetry(event)
    return {
        "status": "success",
        "invited_added": len(created_invitations),
        "invitations": created_invitations,
        **bundle
    }


@router.post("/tickets/book", summary="Book tickets via TunePay, M-Pesa STK Push, or Card")
def book_event_tickets(booking: TicketBookingRequest, request: Request, user=Depends(get_optional_user)):
    """Process ticket reservation, create booking ledger entry, and issue secure digital QR ticket pass."""
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == booking.event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")

    if event.get("payment_mode") == "free_rsvp":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event is FREE with RSVP. Please use the RSVP flow instead of paid ticket checkout."
        )

    tier = next((t for t in event.get("tiers", []) if t.get("tier_id") == booking.tier_id), None)
    if not tier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tier '{booking.tier_id}' does not exist for this event."
        )

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

    if db is not None:
        try:
            db.ticket_bookings.insert_one(dict(booking_record))
            db.live_events.update_one(
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

    # Attribute ticket purchase to Smart CRM reachout / initiating affiliate (and notify inbox + email)
    try:
        from services.reachout_service import record_reachout_spend
        record_reachout_spend(
            conversion_type="ticket_pass",
            item_title=f"{event.get('title')} ({tier.get('name')})",
            gross_amount_usd=float(total_usd),
            user_id=str(user["_id"]) if user else None,
            buyer_email=booking.customer_email,
            buyer_name=booking.customer_name,
            reachout_token=booking.reachout_token or request.cookies.get("tm_reachout_token"),
            ref_code=booking.ref_code or request.cookies.get("tm_aff_ref"),
            tx_id=ticket_id,
        )
    except Exception as e:
        logger.warning(f"Affiliate ticket attribution error: {e}")

    message = f"Tickets confirmed for {event.get('title')}! Your digital pass has been sent to {booking.customer_email}."
    if booking.payment_method == "mpesa":
        message = (
            f"M-Pesa STK Push prompt initiated to {booking.mpesa_phone or booking.customer_phone} "
            f"for KSh {total_kes:,}. Enter your M-Pesa PIN on your phone to complete your booking."
        )

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


def _process_rsvp(rsvp: EventRsvpRequest):
    events = get_or_seed_events()
    event = next((e for e in events if e.get("id") == rsvp.event_id), None)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found.")

    policy = event.get("guest_limit_policy", "open")
    max_add = event.get("max_additional_guests")
    additional = int(rsvp.additional_guests or 0)

    # Enforce strict +1 / +2 or explicit max guest limit
    if policy == "strict_plus_1" and additional > 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event enforces a strict +1 guest limit (maximum 1 additional guest per RSVP)."
        )
    if policy == "strict_plus_2" and additional > 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event enforces a strict +2 guest limit (maximum 2 additional guests per RSVP)."
        )
    if max_add is not None and additional > max_add:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {max_add} additional guest(s) allowed per RSVP for this event."
        )

    zone = (rsvp.attendance_type or "seating").strip().lower()
    if zone not in ("seating", "standing"):
        zone = "seating"

    party_size = 1 + additional
    clean_email = rsvp.fan_email.strip().lower()

    # Check seating / standing capacity for free_rsvp events (accounting for updating an existing RSVP)
    if event.get("payment_mode") == "free_rsvp":
        bundle = build_event_guest_list_and_telemetry(event)
        summary = bundle["rsvp_summary"]
        existing_rsvp = db.event_rsvps.find_one({"event_id": rsvp.event_id, "fan_email": clean_email}) if db is not None else None
        prev_party = int(existing_rsvp.get("party_size", 0)) if existing_rsvp else 0
        prev_zone = (existing_rsvp.get("attendance_type") or "seating") if existing_rsvp else None

        if zone == "seating":
            effective_remaining = summary["seating_remaining"] + (prev_party if prev_zone == "seating" else 0)
            if party_size > effective_remaining:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Not enough seating capacity remaining. Only {effective_remaining} seated spot(s) left."
                )
        else:
            effective_remaining = summary["standing_remaining"] + (prev_party if prev_zone == "standing" else 0)
            if party_size > effective_remaining:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Not enough standing capacity remaining. Only {effective_remaining} standing spot(s) left."
                )

    rsvp_id = f"RSVP-{uuid.uuid4().hex[:8].upper()}"
    qr_hash = f"tm_rsvp_{uuid.uuid4().hex[:16]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    crm_contact_id = _route_guest_through_smart_crm(
        event=event,
        name=rsvp.fan_name.strip(),
        email=clean_email,
        phone=rsvp.fan_phone,
        city=rsvp.city or "",
        action="rsvp_confirmed",
        party_size=party_size,
        attendance_type=zone,
        extra_meta={
            "rsvp_id": rsvp_id,
            "additional_guests": additional,
            "guest_names": rsvp.guest_names or [],
            "notify_sms": rsvp.notify_sms,
            "notes": rsvp.notes,
        },
    )

    was_invited = False
    invitation_id = None
    if db is not None:
        try:
            inv = db.event_invitations.find_one({"event_id": rsvp.event_id, "guest_email": clean_email})
            if inv:
                was_invited = True
                invitation_id = inv.get("invitation_id")
                db.event_invitations.update_one(
                    {"event_id": rsvp.event_id, "guest_email": clean_email},
                    {"$set": {
                        "status": "confirmed",
                        "attendance_type": zone,
                        "additional_guests": additional,
                        "party_size": party_size,
                        "confirmed_at": now_iso,
                        "crm_contact_id": crm_contact_id,
                    }}
                )

            record = {
                "rsvp_id": rsvp_id,
                "event_id": rsvp.event_id,
                "event_title": event.get("title"),
                "artist": event.get("artist"),
                "fan_name": rsvp.fan_name.strip(),
                "fan_email": clean_email,
                "city": rsvp.city or "",
                "notify_sms": bool(rsvp.notify_sms),
                "fan_phone": rsvp.fan_phone,
                "additional_guests": additional,
                "party_size": party_size,
                "guest_names": rsvp.guest_names or [],
                "attendance_type": zone,
                "notes": rsvp.notes,
                "was_invited": was_invited,
                "invitation_id": invitation_id,
                "role_tag": (inv.get("role_tag") if inv else "Confirmed RSVP"),
                "crm_contact_id": crm_contact_id,
                "synced_to_crm": True,
                "qr_code_hash": qr_hash,
                "created_at": now_iso,
            }
            db.event_rsvps.update_one(
                {"event_id": rsvp.event_id, "fan_email": clean_email},
                {"$set": record},
                upsert=True,
            )
        except Exception as e:
            logger.error(f"Error persisting RSVP: {e}")

    # Attribute RSVP to Smart CRM reachout / initiating affiliate (and notify inbox + email)
    try:
        from services.reachout_service import record_reachout_rsvp
        record_reachout_rsvp(
            event=event,
            fan_name=rsvp.fan_name.strip(),
            fan_email=clean_email,
            rsvp_id=rsvp_id,
            reachout_token=rsvp.reachout_token,
            ref_code=rsvp.ref_code,
        )
    except Exception as e:
        logger.warning(f"Affiliate RSVP attribution error: {e}")

    updated_bundle = build_event_guest_list_and_telemetry(event)

    party_desc = f"1 attendee + {additional} guest(s)" if additional > 0 else "1 attendee (solo)"
    return {
        "status": "success",
        "message": (
            f"RSVP confirmed for {event.get('title')} ({party_desc}, {zone.title()})! "
            f"Your attendance has been routed through {event.get('artist')}'s Smart CRM."
        ),
        "rsvp_id": rsvp_id,
        "qr_code_hash": qr_hash,
        "crm_contact_id": crm_contact_id,
        "crm_synced": True,
        "was_invited": was_invited,
        "party_size": party_size,
        "additional_guests": additional,
        "attendance_type": zone,
        "artist": event.get("artist"),
        "venue": event.get("venue"),
        "date": event.get("date_display"),
        **updated_bundle
    }


@router.post("/rsvp", summary="Confirm Free RSVP or join event waitlist (routed through Smart CRM)")
def rsvp_to_event(rsvp: EventRsvpRequest, request: Request):
    """Confirm attendance via RSVP with seating/standing selection, guest count, and Smart CRM routing."""
    if not rsvp.reachout_token:
        rsvp.reachout_token = request.cookies.get("tm_reachout_token")
    if not rsvp.ref_code:
        rsvp.ref_code = request.cookies.get("tm_aff_ref")
    return _process_rsvp(rsvp)


@router.post("/{event_id}/rsvp", summary="Confirm Free RSVP for a specific event")
def rsvp_to_specific_event(event_id: str, rsvp: EventRsvpRequest, request: Request):
    """Event-scoped RSVP endpoint delegating to unified Smart CRM RSVP processor."""
    rsvp.event_id = event_id
    if not rsvp.reachout_token:
        rsvp.reachout_token = request.cookies.get("tm_reachout_token")
    if not rsvp.ref_code:
        rsvp.ref_code = request.cookies.get("tm_aff_ref")
    return _process_rsvp(rsvp)
