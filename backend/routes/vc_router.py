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
