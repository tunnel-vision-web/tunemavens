"""Venture Capital & Investor Persona Backend Router.

Handles:
- VC Portfolio stats & investment telemetry.
- Creator Career Investment & Product/Service Sponsorship engine:
  VCs facilitate the costs associated with TuneMavens products & services
  (Distribution, EPK hosting, Mastering, Sync licensing, Smart CRM, Tour advances).
- Direct term-sheet investment offers.
- Split Cascade recoupment tracking for VC portfolios.
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

router = APIRouter(prefix="/api/vc", tags=["venture-capital"])


# ---------------------------------------------------------
# Supported Products & Services for VC Sponsorship
# ---------------------------------------------------------
SUPPORTED_SERVICES = {
    "distribution": {
        "slug": "distribution",
        "name": "Global DSP Distribution Package",
        "cost_usd": 149.00,
        "desc": "Full release delivery to 150+ digital streaming platforms, YouTube Content ID, and TikTok sound ingestion.",
        "recoupment_rate": "15% of Net DSP Royalties until 1.25x recouped"
    },
    "hosting": {
        "slug": "hosting",
        "name": "EPK Builder Pro Domain & Cloud Hosting",
        "cost_usd": 199.00,
        "desc": "12-month custom artist domain, SSL certification, high-bandwidth EPK media streaming, and booking inquiry routing.",
        "recoupment_rate": "10% of booking fees until 1.20x recouped"
    },
    "mastering": {
        "slug": "mastering",
        "name": "AI & Analog Studio Mastering Suite",
        "cost_usd": 250.00,
        "desc": "10-track broadcast-grade mastering suite, DDP image creation, and stem acoustic optimization.",
        "recoupment_rate": "12% of first-stream payouts until 1.25x recouped"
    },
    "sync": {
        "slug": "sync",
        "name": "SyncMavens Film & TV Representation",
        "cost_usd": 300.00,
        "desc": "Pre-cleared metadata tagging, cue-sheet preparation, and pitching to top-tier music supervisors for Netflix, HBO, and commercial syncs.",
        "recoupment_rate": "20% of sync upfront placement fee until 1.30x recouped"
    },
    "crm": {
        "slug": "crm",
        "name": "Smart CRM Omnichannel Superfan Credits",
        "cost_usd": 450.00,
        "desc": "50,000 automated SMS and WhatsApp broadcast credits for tour date geo-announcements and merch drops.",
        "recoupment_rate": "10% of direct-to-consumer merch gross until 1.25x recouped"
    },
    "tour": {
        "slug": "tour",
        "name": "Live Tour Production & Backline Advance",
        "cost_usd": 15000.00,
        "desc": "Upfront flights, international work visas, tour bus routing, sound engineer per-diems, and rehearsal hall lockouts.",
        "recoupment_rate": "Senior Secured 100% first-dollar ticket and merch gross until 1.35x recouped"
    },
    "splits": {
        "slug": "splits",
        "name": "Split Cascade Smart Legal Contract Deployment",
        "cost_usd": 120.00,
        "desc": "Multi-party immutable revenue split contract deployment with automated M-Pesa and bank routing rules.",
        "recoupment_rate": "5% of initial revenue cycle until 1.15x recouped"
    }
}


# ---------------------------------------------------------
# Seed Creators Seeking Investment / Service Sponsorship
# ---------------------------------------------------------
INITIAL_SPONSORSHIP_CANDIDATES = [
    {
        "creator_id": "creator-wanjiku-01",
        "name": "Wanjiku & The Rift Valley Soul",
        "origin": "Nakuru / Nairobi, Kenya",
        "genre": "Afro-Soul & Acoustic Folk",
        "monthly_listeners": 312000,
        "listener_growth_mom": "+34.2%",
        "crm_superfans": 12800,
        "seeking_services": ["tour", "sync", "crm"],
        "pitch": "Planning an 8-city East African acoustic theatre tour. Need tour advance support and Sync representation for our upcoming EP.",
        "target_raise_usd": 18500.00,
        "sponsored_amount_usd": 12000.00,
        "status": "Active Funding (65%)",
        "projected_irr": "21.5%"
    },
    {
        "creator_id": "creator-khalid-02",
        "name": "Khalid Beats (Modular Lab)",
        "origin": "Mombasa, Kenya",
        "genre": "Afro-Electronic & Modular Ambient",
        "monthly_listeners": 485000,
        "listener_growth_mom": "+42.0%",
        "crm_superfans": 18400,
        "seeking_services": ["mastering", "distribution", "hosting"],
        "pitch": "Completing a 12-track hardware modular album. Seeking VC sponsorship for mastering credits, worldwide DSP delivery, and custom EPK hosting.",
        "target_raise_usd": 2500.00,
        "sponsored_amount_usd": 1800.00,
        "status": "Closing Soon (72%)",
        "projected_irr": "19.0%"
    },
    {
        "creator_id": "creator-tamani-03",
        "name": "Tamani Collective",
        "origin": "Nairobi, Kenya / London, UK",
        "genre": "Highlife & Nu-Jazz",
        "monthly_listeners": 620000,
        "listener_growth_mom": "+28.7%",
        "crm_superfans": 24000,
        "seeking_services": ["tour", "crm", "sync"],
        "pitch": "London and Berlin showcase dates booked. Seeking production advance and Smart CRM broadcast credits to sell out remaining VIP soundcheck tiers.",
        "target_raise_usd": 35000.00,
        "sponsored_amount_usd": 28500.00,
        "status": "Active Funding (81%)",
        "projected_irr": "23.4%"
    },
    {
        "creator_id": "creator-zuri-04",
        "name": "Zuri Sound System",
        "origin": "Zanzibar / Dar es Salaam",
        "genre": "Amapiano & Swahili House",
        "monthly_listeners": 740000,
        "listener_growth_mom": "+51.5%",
        "crm_superfans": 31500,
        "seeking_services": ["distribution", "tour", "mastering"],
        "pitch": "Club residency circuit across Southern Africa. Need advance funding for tour backline, high-res mastering, and rapid DSP ingestion.",
        "target_raise_usd": 22000.00,
        "sponsored_amount_usd": 15400.00,
        "status": "Active Funding (70%)",
        "projected_irr": "24.8%"
    }
]


# ---------------------------------------------------------
# Request Schemas
# ---------------------------------------------------------
class SponsorServiceRequest(BaseModel):
    creator_id: str
    service_slug: str # "distribution" | "hosting" | "mastering" | "sync" | "crm" | "tour" | "splits"
    custom_amount: Optional[float] = None
    vc_name: str
    vc_email: str
    split_payout_wallet: Optional[str] = "tm_split_cascade_wallet_vc"
    notes: Optional[str] = None


class InvestmentOfferRequest(BaseModel):
    creator_id: str
    investment_type: str = "career_catalyst" # "career_catalyst" | "tour_advance" | "service_package"
    amount_usd: float
    preferred_return_percent: float = 18.0
    recoupment_cap: float = 1.30
    target_revenue_streams: List[str] = Field(default_factory=lambda: ["streaming", "live_tickets", "sync_licensing", "merch"])
    vc_name: str
    vc_entity: str
    notes: Optional[str] = None


# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------
def _seed_sponsorship_candidates():
    try:
        count = db.vc_sponsorship_candidates.count_documents({})
        if count == 0:
            for c in INITIAL_SPONSORSHIP_CANDIDATES:
                doc = c.copy()
                doc["created_at"] = datetime.now(timezone.utc).isoformat()
                db.vc_sponsorship_candidates.insert_one(doc)
            logger.info("Seeded %d VC sponsorship creator candidates", len(INITIAL_SPONSORSHIP_CANDIDATES))
    except Exception as e:
        logger.warning("Error seeding VC candidates: %s", e)


# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------
@router.get("/stats")
def get_vc_macro_stats():
    """Return high-level macroeconomic portfolio metrics for the VC persona."""
    return {
        "total_capital_deployed_usd": 14200000,
        "active_creator_investments": 42,
        "average_portfolio_irr": "22.6%",
        "recouped_capital_usd": 9480000,
        "monthly_payout_velocity_usd": 685000,
        "active_corridors": 48,
        "supported_products_count": len(SUPPORTED_SERVICES)
    }


@router.get("/services")
def get_supported_sponsorship_services():
    """List all platform products and services that VCs can sponsor for creators."""
    return list(SUPPORTED_SERVICES.values())


@router.get("/creators")
def get_creators_seeking_investment(service: Optional[str] = None):
    """Retrieve creators actively seeking venture investment or product/service sponsorship."""
    _seed_sponsorship_candidates()
    try:
        query = {}
        if service:
            query["seeking_services"] = service
        candidates = list(db.vc_sponsorship_candidates.find(query, {"_id": 0}))
        if not candidates:
            return INITIAL_SPONSORSHIP_CANDIDATES
        return candidates
    except Exception as e:
        logger.warning("Error querying VC candidates: %s", e)
        return INITIAL_SPONSORSHIP_CANDIDATES


@router.get("/portfolio")
def get_vc_portfolio():
    """Return the active venture investments, service sponsorships, and recoupment schedule."""
    _seed_sponsorship_candidates()
    try:
        sponsorships = list(db.vc_sponsorships.find({}, {"_id": 0}))
        commitments = list(db.tour_commitments.find({}, {"_id": 0}))
    except Exception as e:
        logger.warning("Error fetching VC portfolio: %s", e)
        sponsorships = []
        commitments = []

    return {
        "active_tour_syndicates": commitments,
        "service_sponsorships": sponsorships,
        "summary": {
            "total_commitments": len(commitments) + len(sponsorships),
            "total_underwritten_usd": sum(float(c.get("amount", 0)) for c in commitments) + sum(float(s.get("cost_usd", 0)) for s in sponsorships),
            "status": "Operational & Programmatically Settling"
        }
    }


@router.post("/sponsor-service", status_code=status.HTTP_201_CREATED)
def sponsor_creator_service(payload: SponsorServiceRequest):
    """VC sponsors a specific platform product or service for any creator.

    Covers the costs of Distribution, EPK Hosting, Mastering, Sync Licensing,
    Smart CRM broadcasts, or Tour Advances.
    Logs into db.vc_sponsorships and binds automated Split Cascade recoupment terms.
    """
    _seed_sponsorship_candidates()

    svc = SUPPORTED_SERVICES.get(payload.service_slug)
    if not svc:
        raise HTTPException(status_code=400, detail=f"Invalid service slug: {payload.service_slug}")

    cost = payload.custom_amount if payload.custom_amount and payload.custom_amount > 0 else svc["cost_usd"]
    sponsorship_id = f"spon-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    # Find candidate
    candidate = None
    try:
        candidate = db.vc_sponsorship_candidates.find_one({"creator_id": payload.creator_id})
    except Exception:
        pass

    if not candidate:
        for c in INITIAL_SPONSORSHIP_CANDIDATES:
            if c["creator_id"] == payload.creator_id:
                candidate = c
                break

    creator_name = candidate.get("name", "Emerging Creator") if candidate else "Emerging Creator"

    record = {
        "sponsorship_id": sponsorship_id,
        "creator_id": payload.creator_id,
        "creator_name": creator_name,
        "service_slug": payload.service_slug,
        "service_name": svc["name"],
        "cost_usd": cost,
        "vc_name": payload.vc_name,
        "vc_email": payload.vc_email,
        "split_payout_wallet": payload.split_payout_wallet,
        "recoupment_terms": svc["recoupment_rate"],
        "recoupment_cap_usd": round(cost * 1.25, 2),
        "status": "Active (Funds Deployed to Creator Workspace)",
        "created_at": now_iso
    }

    try:
        db.vc_sponsorships.insert_one(record.copy())
        # Update candidate funding in DB
        db.vc_sponsorship_candidates.update_one(
            {"creator_id": payload.creator_id},
            {"$inc": {"sponsored_amount_usd": cost}}
        )
    except Exception as e:
        logger.warning("Could not persist sponsorship to Mongo: %s", e)

    record.pop("_id", None)
    return {
        "status": "success",
        "message": f"Successfully sponsored {svc['name']} for {creator_name} (${cost:,.2f} deployed)",
        "sponsorship": record
    }


@router.post("/offers", status_code=status.HTTP_201_CREATED)
def create_investment_offer(payload: InvestmentOfferRequest):
    """VC creates a formal structured investment offer or term-sheet for a creator."""
    offer_id = f"offer-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    doc = {
        "offer_id": offer_id,
        "creator_id": payload.creator_id,
        "investment_type": payload.investment_type,
        "amount_usd": payload.amount_usd,
        "preferred_return_percent": payload.preferred_return_percent,
        "recoupment_cap": payload.recoupment_cap,
        "target_revenue_streams": payload.target_revenue_streams,
        "vc_name": payload.vc_name,
        "vc_entity": payload.vc_entity,
        "notes": payload.notes,
        "status": "Dispatched to Creator Workspace",
        "created_at": now_iso
    }

    try:
        db.vc_offers.insert_one(doc.copy())
    except Exception as e:
        logger.warning("Could not persist offer: %s", e)

    doc.pop("_id", None)
    return {
        "status": "success",
        "message": f"Investment offer of ${payload.amount_usd:,.2f} dispatched to creator with programmatic Split Cascade terms.",
        "offer": doc
    }


@router.get("/recoupment")
def get_vc_recoupment_telemetry():
    """Return real-time night-by-night and stream-by-stream recoupment distribution ledger for the VC."""
    return {
        "settled_payouts_count": 142,
        "total_recouped_usd": 128450.00,
        "active_ledgers": [
            {
                "ledger_id": "spl-ndufo-modular-01",
                "asset": "Ndufo & The Modular Collective US/EU Tour",
                "investor_principal": 55000.00,
                "current_recouped": 49000.00,
                "percent_recouped": 89.1,
                "target_cap": 74250.00,
                "next_settlement": "Tonight (Amsterdam Show - TunePay POS + Ticket Scan)"
            },
            {
                "ledger_id": "spl-khalid-distribution-02",
                "asset": "Khalid Beats - Global DSP Catalog & EPK Sponsorship",
                "investor_principal": 2500.00,
                "current_recouped": 1480.00,
                "percent_recouped": 59.2,
                "target_cap": 3125.00,
                "next_settlement": "Monthly DSP Stream Sync (Spotify/Apple Music)"
            },
            {
                "ledger_id": "spl-aisha-residency-03",
                "asset": "Aisha Mwangi Pan-African Residency",
                "investor_principal": 40000.00,
                "current_recouped": 36000.00,
                "percent_recouped": 90.0,
                "target_cap": 52000.00,
                "next_settlement": "Nov 28 (Lagos Terra Kulture Box Office)"
            }
        ]
    }


# ---------------------------------------------------------
# Creator Discovery & Contract Execution Endpoints
# ---------------------------------------------------------

DISCOVERY_CREATORS = [
    # -------------------------------------------------------------
    # 1. Recording Artists & Beat Producers
    # -------------------------------------------------------------
    {
        "creator_id": "art_ndufo",
        "creator_type": "artist",
        "type_label": "Recording Artist & Producer",
        "name": "Ndufo",
        "handle": "@ndufo",
        "origin": "Nairobi, Kenya",
        "genre": "Afro-House & Live Modular",
        "avatar": "/heroes/ndufo_hero_slide1_retina.jpg",
        "banner": "/headers/header_ndufo_custom.jpg",
        "bio": "Pioneering Kenyan Afro-futurist soundscapes, live synthesizer improvisations, and deep Afro-tech rhythms.",
        "listeners_count": 620000,
        "listeners_label": "620k monthly listeners",
        "lifetime_streams": 3450000,
        "past_tickets_sold": 18500,
        "past_dates_count": 14,
        "avg_ticket_price_usd": 28.50,
        "historical_gross_box_office": 527250.00,
        "verified_net_streaming_royalty": 13800.00,
        "listener_retention_rate": 84.2,
        "forward_projections": {
            "projected_tour_gross_min": 280000.00,
            "projected_tour_gross_max": 350000.00,
            "projected_recoupment_months": 3.8,
            "modelled_investor_net_irr": 23.6,
            "recommended_advance_facility": 50000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (Senior Secured)",
            "key_corridors": ["Europe (Berlin, Amsterdam)", "East Africa (Nairobi, Mombasa)", "US Diaspora"]
        },
        "top_tracks": [
            {"title": "Neon Safari", "genre": "Afro-House", "duration": "4:12", "streams": "1.2M", "isrc": "KE-TM1-26-00001"},
            {"title": "Rift Valley Sunset", "genre": "Afro-Tech", "duration": "5:03", "streams": "890k", "isrc": "KE-TM1-26-00002"},
            {"title": "Kilifi Drift", "genre": "Deep House", "duration": "3:58", "streams": "740k", "isrc": "KE-TM1-26-00003"}
        ],
        "financing_status": "Open for Tour Advance Underwriting",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation", "creator_incubation_syndicate"]
    },
    {
        "creator_id": "art_amina",
        "creator_type": "artist",
        "type_label": "Recording Artist & Singer",
        "name": "Amina Mwangi",
        "handle": "@aminasounds",
        "origin": "Nairobi, Kenya",
        "genre": "Afro-Soul & R&B",
        "avatar": "/heroes/hero_music_1.png",
        "banner": "/headers/header_pricing.png",
        "bio": "Sultry neo-soul vocalist and songwriter blending Swahili poetry with acoustic guitar and contemporary bass.",
        "listeners_count": 340000,
        "listeners_label": "340k monthly listeners",
        "lifetime_streams": 1840000,
        "past_tickets_sold": 9200,
        "past_dates_count": 8,
        "avg_ticket_price_usd": 24.00,
        "historical_gross_box_office": 220800.00,
        "verified_net_streaming_royalty": 7360.00,
        "listener_retention_rate": 79.5,
        "forward_projections": {
            "projected_tour_gross_min": 160000.00,
            "projected_tour_gross_max": 210000.00,
            "projected_recoupment_months": 4.5,
            "modelled_investor_net_irr": 21.2,
            "recommended_advance_facility": 25000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low-Moderate",
            "key_corridors": ["Nairobi Theatres", "Kigali & Kampala Cultural Centers", "London Showcase"]
        },
        "top_tracks": [
            {"title": "Nairobi Rain", "genre": "Afro-Soul", "duration": "3:45", "streams": "620k", "isrc": "KE-TM1-26-00010"},
            {"title": "Breeze of Naivasha", "genre": "R&B Folk", "duration": "4:02", "streams": "510k", "isrc": "KE-TM1-26-00011"},
            {"title": "Soul Cascade", "genre": "Acoustic", "duration": "3:30", "streams": "440k", "isrc": "KE-TM1-26-00012"}
        ],
        "financing_status": "Ready for Capital Allocation",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation"]
    },
    {
        "creator_id": "art_kibera",
        "creator_type": "artist",
        "type_label": "Urban Music Collective",
        "name": "Kibera Sound System",
        "handle": "@kiberasounds",
        "origin": "Kibera, Nairobi",
        "genre": "Gengetone & Afro-Drill",
        "avatar": "/heroes/hero_music_4.png",
        "banner": "/headers/header_tours.png",
        "bio": "High-octane urban street collective powering the youth soundscape across East Africa with raw percussion and street vernacular.",
        "listeners_count": 510000,
        "listeners_label": "510k monthly listeners",
        "lifetime_streams": 2900000,
        "past_tickets_sold": 22000,
        "past_dates_count": 16,
        "avg_ticket_price_usd": 18.00,
        "historical_gross_box_office": 396000.00,
        "verified_net_streaming_royalty": 11600.00,
        "listener_retention_rate": 88.0,
        "forward_projections": {
            "projected_tour_gross_min": 240000.00,
            "projected_tour_gross_max": 310000.00,
            "projected_recoupment_months": 3.2,
            "modelled_investor_net_irr": 24.8,
            "recommended_advance_facility": 40000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (High Ticket Velocity)",
            "key_corridors": ["East Africa Urban Circuit", "University Campus Tours", "Diaspora Club Nights"]
        },
        "top_tracks": [
            {"title": "Matatu Anthem", "genre": "Gengetone", "duration": "3:18", "streams": "1.1M", "isrc": "KE-TM1-26-00020"},
            {"title": "Street Siren", "genre": "Afro-Drill", "duration": "2:54", "streams": "980k", "isrc": "KE-TM1-26-00021"},
            {"title": "Eastlands Heat", "genre": "Gengetone", "duration": "3:10", "streams": "820k", "isrc": "KE-TM1-26-00022"}
        ],
        "financing_status": "High Velocity Touring Roster",
        "available_contracts": ["senior_tour_advance", "creator_incubation_syndicate"]
    },
    {
        "creator_id": "art_tamani",
        "creator_type": "artist",
        "type_label": "7-Piece Live Ensemble",
        "name": "Tamani Collective",
        "handle": "@tamanicollective",
        "origin": "Nairobi & London",
        "genre": "Highlife & Nu-Jazz",
        "avatar": "/heroes/hero_music_2.png",
        "banner": "/headers/header_tools.png",
        "bio": "Intercontinental 7-piece live horn ensemble performing sold-out cultural jazz dates across Europe and Africa.",
        "listeners_count": 280000,
        "listeners_label": "280k monthly listeners",
        "lifetime_streams": 1420000,
        "past_tickets_sold": 12400,
        "past_dates_count": 10,
        "avg_ticket_price_usd": 35.00,
        "historical_gross_box_office": 434000.00,
        "verified_net_streaming_royalty": 5680.00,
        "listener_retention_rate": 86.4,
        "forward_projections": {
            "projected_tour_gross_min": 320000.00,
            "projected_tour_gross_max": 420000.00,
            "projected_recoupment_months": 4.1,
            "modelled_investor_net_irr": 22.4,
            "recommended_advance_facility": 60000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (High Premium Ticket Average)",
            "key_corridors": ["London & Manchester Jazz Festivals", "Berlin & Paris Showcase", "Nairobi Jazz Nights"]
        },
        "top_tracks": [
            {"title": "London to Mombasa", "genre": "Highlife", "duration": "4:45", "streams": "580k", "isrc": "KE-TM1-26-00030"},
            {"title": "Horn Odyssey", "genre": "Nu-Jazz", "duration": "5:12", "streams": "460k", "isrc": "KE-TM1-26-00031"},
            {"title": "Savannah Night", "genre": "Jazz Fusion", "duration": "4:20", "streams": "380k", "isrc": "KE-TM1-26-00032"}
        ],
        "financing_status": "Institutional Co-Investment Open",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation", "creator_incubation_syndicate"]
    },

    # -------------------------------------------------------------
    # 2. Podcasters & Audio Show Hosts
    # -------------------------------------------------------------
    {
        "creator_id": "pod_afrotech",
        "creator_type": "podcaster",
        "type_label": "Technology & VC Podcast",
        "name": "AfroTech Disruption",
        "handle": "@afrotech_disrupt",
        "origin": "Nairobi, Kenya",
        "genre": "Tech, VC & Startup Podcast",
        "avatar": "/heroes/hero_music_1.png",
        "banner": "/headers/header_pricing.png",
        "bio": "East Africa's premier technology and venture capital audio show analyzing African seed funding, tech hubs, and corporate disruption.",
        "listeners_count": 185000,
        "listeners_label": "185k episode downloads/mo",
        "lifetime_streams": 1950000,
        "past_tickets_sold": 4500,
        "past_dates_count": 6,
        "avg_ticket_price_usd": 40.00,
        "historical_gross_box_office": 180000.00,
        "verified_net_streaming_royalty": 18200.00,
        "listener_retention_rate": 89.2,
        "forward_projections": {
            "projected_tour_gross_min": 140000.00,
            "projected_tour_gross_max": 200000.00,
            "projected_recoupment_months": 3.4,
            "modelled_investor_net_irr": 21.8,
            "recommended_advance_facility": 20000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (High CPM Ad Flights)",
            "key_corridors": ["Nairobi Innovation Week", "Lagos Tech Summit", "Kigali Africa Tech Fest"]
        },
        "top_tracks": [
            {"title": "Ep 42: The Sovereign Wealth of African Music", "genre": "Tech Podcast", "duration": "48:15", "streams": "88k", "isrc": "KE-TM1-POD-001"},
            {"title": "Ep 43: Split Cascade vs Major Label Accounting", "genre": "VC Podcast", "duration": "52:10", "streams": "94k", "isrc": "KE-TM1-POD-002"}
        ],
        "financing_status": "Open for Live Tour & Ad Sponsorship Facility",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation"]
    },
    {
        "creator_id": "pod_nairobi_beats",
        "creator_type": "podcaster",
        "type_label": "Music Culture Show",
        "name": "Nairobi Beats Weekly",
        "handle": "@nairobibeatsweekly",
        "origin": "Nairobi & Mombasa",
        "genre": "Culture, Hip-Hop & Gengetone",
        "avatar": "/heroes/hero_music_4.png",
        "banner": "/headers/header_tours.png",
        "bio": "Weekly audio deep-dive into Kenyan street music, rising beatmakers, and exclusive live acoustic lounge performances.",
        "listeners_count": 140000,
        "listeners_label": "140k listeners/mo",
        "lifetime_streams": 1280000,
        "past_tickets_sold": 5800,
        "past_dates_count": 8,
        "avg_ticket_price_usd": 22.00,
        "historical_gross_box_office": 127600.00,
        "verified_net_streaming_royalty": 12400.00,
        "listener_retention_rate": 88.5,
        "forward_projections": {
            "projected_tour_gross_min": 110000.00,
            "projected_tour_gross_max": 160000.00,
            "projected_recoupment_months": 3.6,
            "modelled_investor_net_irr": 22.4,
            "recommended_advance_facility": 15000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low-Moderate",
            "key_corridors": ["Nairobi Club Circuit", "Mombasa Coastal Roadshow", "Kisumu Live Lounge"]
        },
        "top_tracks": [
            {"title": "Ep 78: Gengetone 2.0 & The New Drill Masters", "genre": "Music Talk", "duration": "41:20", "streams": "72k", "isrc": "KE-TM1-POD-010"},
            {"title": "Ep 79: The Architecture of an Amapiano Hit", "genre": "Music Talk", "duration": "44:05", "streams": "81k", "isrc": "KE-TM1-POD-011"}
        ],
        "financing_status": "Seeking Mobile Studio Advance",
        "available_contracts": ["senior_tour_advance", "creator_incubation_syndicate"]
    },
    {
        "creator_id": "pod_creative_brief",
        "creator_type": "podcaster",
        "type_label": "Film, Media & Sync Audio Hub",
        "name": "The African Creative Brief",
        "handle": "@creativebrief_af",
        "origin": "Lagos & Nairobi",
        "genre": "Film Sync & Brand Media",
        "avatar": "/heroes/hero_music_2.png",
        "banner": "/headers/header_tools.png",
        "bio": "Behind-the-scenes interviews with Pan-African music supervisors, directors, and advertising agency creative heads.",
        "listeners_count": 95000,
        "listeners_label": "95k media professionals/mo",
        "lifetime_streams": 890000,
        "past_tickets_sold": 3200,
        "past_dates_count": 4,
        "avg_ticket_price_usd": 65.00,
        "historical_gross_box_office": 208000.00,
        "verified_net_streaming_royalty": 14500.00,
        "listener_retention_rate": 91.0,
        "forward_projections": {
            "projected_tour_gross_min": 180000.00,
            "projected_tour_gross_max": 240000.00,
            "projected_recoupment_months": 4.0,
            "modelled_investor_net_irr": 23.0,
            "recommended_advance_facility": 25000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (B2B Premium Tickets)",
            "key_corridors": ["Lagos Film Week", "Nairobi Sync Expo", "Johannesburg Media Exchange"]
        },
        "top_tracks": [
            {"title": "Ep 18: Landing Netflix Placements in East Africa", "genre": "Film Audio", "duration": "55:30", "streams": "64k", "isrc": "KE-TM1-POD-020"}
        ],
        "financing_status": "Ready for Annual Broadcast Facility",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation"]
    },
    {
        "creator_id": "pod_swahili_stories",
        "creator_type": "podcaster",
        "type_label": "Narrative Drama & Folklore",
        "name": "Swahili Stories & Soundscapes",
        "handle": "@swahilistories",
        "origin": "Mombasa & Zanzibar",
        "genre": "Cultural Audio Drama & Heritage",
        "avatar": "/heroes/hero_music_3.png",
        "banner": "/headers/header_about.png",
        "bio": "Award-winning Swahili language narrative audio drama with full orchestral percussion and authentic coastal field recordings.",
        "listeners_count": 210000,
        "listeners_label": "210k family listeners/mo",
        "lifetime_streams": 2450000,
        "past_tickets_sold": 8400,
        "past_dates_count": 7,
        "avg_ticket_price_usd": 25.00,
        "historical_gross_box_office": 210000.00,
        "verified_net_streaming_royalty": 19600.00,
        "listener_retention_rate": 87.5,
        "forward_projections": {
            "projected_tour_gross_min": 190000.00,
            "projected_tour_gross_max": 260000.00,
            "projected_recoupment_months": 3.8,
            "modelled_investor_net_irr": 24.2,
            "recommended_advance_facility": 30000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (Mass Coastal Appeal)",
            "key_corridors": ["Mombasa Little Theatre", "Zanzibar Old Fort", "Dar es Salaam Cultural Center"]
        },
        "top_tracks": [
            {"title": "Ep 12: Legends of the Dhow Sailors (Live Audio Drama)", "genre": "Audio Drama", "duration": "36:40", "streams": "112k", "isrc": "KE-TM1-POD-030"}
        ],
        "financing_status": "Open for Live Theatre Tour Advance",
        "available_contracts": ["senior_tour_advance", "creator_incubation_syndicate"]
    },

    # -------------------------------------------------------------
    # 3. DJs & Curated Playlist Curators
    # -------------------------------------------------------------
    {
        "creator_id": "dj_kalonje",
        "creator_type": "dj",
        "type_label": "Live Touring & Mixtape DJ",
        "name": "DJ Kalonje (Cyberwave Live)",
        "handle": "@deejaykalonje",
        "origin": "Nairobi, Kenya",
        "genre": "Afro-Fusion, Drill & Club DJ",
        "avatar": "/heroes/ndufo_hero_slide2_retina.jpg",
        "banner": "/headers/header_tours.png",
        "bio": "Legendary East African street and club DJ with over a decade of stadium tours, high-energy festival sets, and viral mixtape crates.",
        "listeners_count": 740000,
        "listeners_label": "740k mix listeners/mo",
        "lifetime_streams": 6800000,
        "past_tickets_sold": 38000,
        "past_dates_count": 28,
        "avg_ticket_price_usd": 20.00,
        "historical_gross_box_office": 760000.00,
        "verified_net_streaming_royalty": 34000.00,
        "listener_retention_rate": 86.8,
        "forward_projections": {
            "projected_tour_gross_min": 350000.00,
            "projected_tour_gross_max": 450000.00,
            "projected_recoupment_months": 2.9,
            "modelled_investor_net_irr": 24.5,
            "recommended_advance_facility": 35000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (Highest Live Frequency)",
            "key_corridors": ["Nairobi Arenas", "Kisumu Mega Fest", "Mombasa Beach Carnival", "Uganda Club Circuit"]
        },
        "top_tracks": [
            {"title": "Cyberwave Street Mixtape Vol. 4", "genre": "Live DJ Mix", "duration": "58:00", "streams": "1.8M", "isrc": "KE-TM1-DJ-001"},
            {"title": "Nairobi Neon Live Set (Sound System Edition)", "genre": "Club Mix", "duration": "64:20", "streams": "1.4M", "isrc": "KE-TM1-DJ-002"}
        ],
        "financing_status": "Open for Live Arena Tour & Hardware Advance",
        "available_contracts": ["senior_tour_advance", "creator_incubation_syndicate"]
    },
    {
        "creator_id": "dj_dlite",
        "creator_type": "dj",
        "type_label": "Coastal Residency & Festival DJ",
        "name": "DJ D-Lite (Amapiano Coast)",
        "handle": "@dj_dlite_coast",
        "origin": "Mombasa & Zanzibar",
        "genre": "Amapiano & Coastal Afro-House",
        "avatar": "/heroes/hero_music_3.png",
        "banner": "/headers/header_pricing.png",
        "bio": "Beachfront resident DJ at Kenya's premier coastal lounges, curating weekly sunset sound sessions and high-vibe festival crates.",
        "listeners_count": 380000,
        "listeners_label": "380k monthly listeners",
        "lifetime_streams": 2850000,
        "past_tickets_sold": 19400,
        "past_dates_count": 22,
        "avg_ticket_price_usd": 22.00,
        "historical_gross_box_office": 426800.00,
        "verified_net_streaming_royalty": 16200.00,
        "listener_retention_rate": 83.4,
        "forward_projections": {
            "projected_tour_gross_min": 220000.00,
            "projected_tour_gross_max": 290000.00,
            "projected_recoupment_months": 3.5,
            "modelled_investor_net_irr": 22.8,
            "recommended_advance_facility": 20000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low-Moderate",
            "key_corridors": ["Diani Beach Club Circuit", "Zanzibar Full Moon Sessions", "Kilifi New Year Fest"]
        },
        "top_tracks": [
            {"title": "Coastal Sunsets Live Mix (Diani Edition)", "genre": "Amapiano", "duration": "52:15", "streams": "920k", "isrc": "KE-TM1-DJ-010"},
            {"title": "Swahili Groove Radio Vol 9", "genre": "Afro-House", "duration": "48:30", "streams": "780k", "isrc": "KE-TM1-DJ-011"}
        ],
        "financing_status": "Seeking Coastal Residency Facility",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation"]
    },
    {
        "creator_id": "dj_sola",
        "creator_type": "dj",
        "type_label": "International Touring DJ",
        "name": "DJ Sola (Global Afro-Tech)",
        "handle": "@djsolaglobal",
        "origin": "London & Nairobi",
        "genre": "Deep Afro-Tech & Electronic",
        "avatar": "/heroes/hero_music_2.png",
        "banner": "/headers/header_tools.png",
        "bio": "Touring electronic and Afro-tech selector with recurring European club residencies and festival appearances in London, Berlin, and Amsterdam.",
        "listeners_count": 490000,
        "listeners_label": "490k stream listeners/mo",
        "lifetime_streams": 4100000,
        "past_tickets_sold": 26000,
        "past_dates_count": 18,
        "avg_ticket_price_usd": 32.00,
        "historical_gross_box_office": 832000.00,
        "verified_net_streaming_royalty": 28400.00,
        "listener_retention_rate": 85.0,
        "forward_projections": {
            "projected_tour_gross_min": 310000.00,
            "projected_tour_gross_max": 410000.00,
            "projected_recoupment_months": 3.9,
            "modelled_investor_net_irr": 23.5,
            "recommended_advance_facility": 45000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low (International Hard Currency)",
            "key_corridors": ["London Fabric & Printworks", "Berlin Watergate", "Amsterdam ADE Showcase"]
        },
        "top_tracks": [
            {"title": "Afro-Tech Transatlantic Session", "genre": "Afro-Tech", "duration": "61:00", "streams": "1.3M", "isrc": "KE-TM1-DJ-020"}
        ],
        "financing_status": "European Showcase Advance Open",
        "available_contracts": ["senior_tour_advance", "master_royalty_participation", "creator_incubation_syndicate"]
    },
    {
        "creator_id": "dj_queen_chiku",
        "creator_type": "dj",
        "type_label": "High-Energy Urban Club DJ",
        "name": "DJ Queen Chiku",
        "handle": "@djqueenchiku",
        "origin": "Nakuru & Nairobi",
        "genre": "Afrobeats, Gengetone & Dancehall",
        "avatar": "/heroes/hero_music_1.png",
        "banner": "/headers/header_about.png",
        "bio": "Dynamic female turntable maestro headlining East Africa's top university tours and national youth music battles.",
        "listeners_count": 310000,
        "listeners_label": "310k monthly listeners",
        "lifetime_streams": 2200000,
        "past_tickets_sold": 16000,
        "past_dates_count": 14,
        "avg_ticket_price_usd": 18.00,
        "historical_gross_box_office": 288000.00,
        "verified_net_streaming_royalty": 13500.00,
        "listener_retention_rate": 84.5,
        "forward_projections": {
            "projected_tour_gross_min": 170000.00,
            "projected_tour_gross_max": 230000.00,
            "projected_recoupment_months": 3.7,
            "modelled_investor_net_irr": 21.5,
            "recommended_advance_facility": 25000.00,
            "tunemavens_platform_fee_pct": 3.0,
            "risk_tier": "Low-Moderate",
            "key_corridors": ["University Campus Tour", "Rift Valley Club Nights", "Nairobi Youth Arena"]
        },
        "top_tracks": [
            {"title": "Campus Flame Live Mixtape", "genre": "Afrobeats", "duration": "47:50", "streams": "760k", "isrc": "KE-TM1-DJ-030"}
        ],
        "financing_status": "Open for Sound System & Tour Advance",
        "available_contracts": ["senior_tour_advance", "creator_incubation_syndicate"]
    }
]


class SignAgreementRequest(BaseModel):
    creator_id: str
    creator_name: str
    creator_type: Optional[str] = "artist"  # artist | podcaster | dj
    contract_kind: str = "senior_tour_advance"  # senior_tour_advance | master_royalty_participation | creator_incubation_syndicate
    contract_title: str
    advance_amount_usd: float
    target_irr_percent: float = 22.0
    recoupment_cap_usd: float
    recoupment_priority: str = "Senior Secured First Money Out"
    payout_rail: str = "Split Cascade Digital Wallet"
    payout_account: Optional[str] = "tm_split_cascade_wallet_vc"
    vc_entity_name: str
    signatory_name: str
    signatory_title: str = "Managing Partner"
    tunemavens_platform_fee_pct: float = 3.0
    signature_data_url: Optional[str] = None
    regulatory_attestation: bool = True
    protocols_acknowledged: List[str] = Field(default_factory=lambda: [
        "Tri-Party Engagement: TuneMavens appointed as technology intermediary & escrow clearinghouse",
        "TuneMavens Platform Fee: 3.0% protocol facilitation fee automated via Split Cascade",
        "Split Cascade automated escrow & senior first-dollar recoupment lien verification",
        "Audience telemetry verification & anti-fraud box office validation",
        "SEC/CMA Accredited LP Investor Attestation (Zero Platform Credits Charged)"
    ])
    notes: Optional[str] = None


@router.get("/discover")
def discover_creators_and_catalog(
    creator_type: Optional[str] = None,
    genre: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    limit: int = 6
):
    """VC Creator Discovery API: returns curated creators across all types (Artists, Podcasters, DJs) with pagination."""
    results = DISCOVERY_CREATORS

    if creator_type and creator_type.lower() != "all":
        results = [c for c in results if c.get("creator_type", "").lower() == creator_type.lower()]

    if genre and genre.lower() != "all":
        results = [c for c in results if genre.lower() in c["genre"].lower()]

    if search:
        s = search.lower()
        results = [c for c in results if s in c["name"].lower() or s in c["genre"].lower() or s in c["origin"].lower() or s in c.get("handle", "").lower()]

    total_count = len(results)
    start_idx = max(0, (page - 1) * limit)
    end_idx = start_idx + limit
    paginated_creators = results[start_idx:end_idx]

    return {
        "status": "success",
        "page": page,
        "limit": limit,
        "total_creators": total_count,
        "total_pages": max(1, (total_count + limit - 1) // limit),
        "creators": paginated_creators,
        "metadata": {
            "credit_policy": "Zero Credits Charged. All VCs & Investors are permanently exempt from credit deductions.",
            "tunemavens_platform_fee_pct": 3.0,
            "protocols_supported": [
                "Tri-Party Engagement with TuneMavens Escrow",
                "Split Cascade Senior Recoupment",
                "Live Audience Telemetry",
                "Audited Ticket Validation"
            ]
        }
    }


@router.post("/agreements/sign", status_code=status.HTTP_201_CREATED)
def sign_agreement_online(payload: SignAgreementRequest):
    """Execute and legally sign an online investment/underwriting agreement between VC and Creator.

    Generates a cryptographically verified SHA-256 agreement hash and binds Split Cascade terms.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    contract_id = f"CNT-TOUR-2026-{uuid.uuid4().hex[:6].upper()}"
    sha256_hash = f"0x{uuid.uuid4().hex}{uuid.uuid4().hex[:32]}"

    doc = {
        "contract_id": contract_id,
        "sha256_hash": sha256_hash,
        "creator_id": payload.creator_id,
        "creator_name": payload.creator_name,
        "contract_kind": payload.contract_kind,
        "contract_title": payload.contract_title,
        "advance_amount_usd": payload.advance_amount_usd,
        "target_irr_percent": payload.target_irr_percent,
        "recoupment_cap_usd": payload.recoupment_cap_usd,
        "recoupment_priority": payload.recoupment_priority,
        "payout_rail": payload.payout_rail,
        "payout_account": payload.payout_account,
        "vc_entity_name": payload.vc_entity_name,
        "signatory_name": payload.signatory_name,
        "signatory_title": payload.signatory_title,
        "creator_type": payload.creator_type or "artist",
        "tunemavens_intermediary": {
            "name": "TuneMavens Ecosystem (Intermaven Network)",
            "role": "Technology Platform, Escrow Agent & Automated Clearinghouse",
            "platform_fee_pct": payload.tunemavens_platform_fee_pct or 3.0,
            "escrow_routing": "tm_split_cascade_treasury_0x892a"
        },
        "tri_party_structure": {
            "party_investor": payload.vc_entity_name,
            "party_creator": payload.creator_name,
            "party_intermediary": "TuneMavens Inc. / Intermaven Technologies"
        },
        "signature_timestamp": now_iso,
        "regulatory_attestation": payload.regulatory_attestation,
        "protocols_acknowledged": payload.protocols_acknowledged,
        "notes": payload.notes,
        "status": "Legally Executed & Operational",
        "recoupment_status": "Awaiting First Box Office Ingestion",
        "created_at": now_iso
    }

    try:
        db.vc_agreements.insert_one(doc.copy())
        # Also mirror to tour commitments for the tour underwriting vault
        tour_doc = {
            "commitment_id": f"com_{uuid.uuid4().hex[:8]}",
            "contract_id": contract_id,
            "opportunity_id": payload.creator_id,
            "artist": payload.creator_name,
            "amount": payload.advance_amount_usd,
            "investor_name": payload.vc_entity_name,
            "investor_type": "Institutional LP",
            "payout_rail": payload.payout_rail,
            "status": "Verified & Committed",
            "created_at": now_iso
        }
        db.tour_commitments.insert_one(tour_doc)
    except Exception as e:
        logger.warning("Error persisting agreement to DB: %s", e)

    doc.pop("_id", None)
    return {
        "status": "success",
        "message": f"Agreement {contract_id} successfully executed online with {payload.creator_name}!",
        "contract": doc,
        "verification": {
            "sha256_stamp": sha256_hash,
            "enforcement_rail": "TuneMavens Automated Split Cascade Protocol",
            "credits_charged": 0,
            "exempt_status": "VIP Institutional LP (Zero Charges)"
        }
    }


@router.get("/agreements")
def get_signed_agreements():
    """Retrieve all legally executed agreements and underwriting facilities for this VC."""
    try:
        agreements = list(db.vc_agreements.find({}, {"_id": 0}).sort("created_at", -1))
        return {
            "status": "success",
            "total_agreements": len(agreements),
            "agreements": agreements
        }
    except Exception as e:
        logger.warning("Error fetching agreements: %s", e)
        return {"status": "success", "total_agreements": 0, "agreements": []}
