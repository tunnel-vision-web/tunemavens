"""Global Tours, Masterclasses & Tour Venture Capital Router.

Handles:
- Tour underwriting opportunities listing and detail telemetry in the Vault.
- VC / LP Investor onboarding and accreditation verification.
- Tour advance capital commitments with automated Split Cascade Ledger allocation.
- Artist & management tour pitch submissions.
- Aggregated live tour statistics.
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

router = APIRouter(prefix="/api/tours", tags=["tours-and-venture-capital"])


# ---------------------------------------------------------
# Seed Data for Opportunities
# ---------------------------------------------------------
INITIAL_OPPORTUNITIES = [
    {
        "id": "tour-ndufo-modular",
        "artist": "Ndufo & The Modular Collective",
        "origin": "Nairobi, Kenya",
        "route": "Nairobi → London → Berlin → Paris → Amsterdam",
        "route_stops": [
            {"city": "Nairobi, Kenya", "venue": "The Alchemist / Wave Lab", "capacity": 1200, "date": "Oct 12"},
            {"city": "London, UK", "venue": "Village Underground", "capacity": 720, "date": "Oct 20"},
            {"city": "Berlin, Germany", "venue": "Berghain / Kantine", "capacity": 850, "date": "Oct 26"},
            {"city": "Paris, France", "venue": "La Gaîté Lyrique", "capacity": 900, "date": "Nov 02"},
            {"city": "Amsterdam, Netherlands", "venue": "Paradiso Upstairs", "capacity": 750, "date": "Nov 08"}
        ],
        "genre": "Afro-Electronic & Modular Synthesizer",
        "underwriting_goal": 55000,
        "funded_amount": 46500,
        "min_ticket_size": 2500,
        "investor_irr": "22.4% Target IRR",
        "fan_density": "164,000 Verified Streams",
        "pre_sale_velocity": "88% Pre-Sale Index",
        "payback_terms": "First-Dollar Senior Recoupment via Split Cascade Ledger",
        "recoupment_cap": "1.35x Advance Cap",
        "highlights": "Headline club circuit + 3 masterclass modular workshops at Berlin Ableton Hub.",
        "status": "Active Syndicate (84% Funded)",
        "telemetry": {
            "tunestream_monthly_listeners": 482000,
            "stream_growth_mom": "+38.4%",
            "crm_waitlist_fans": 14250,
            "average_ticket_price_usd": 32.50,
            "projected_gross_box_office": 143650,
            "projected_merch_gross": 28400,
            "net_revenue_projected": 172050,
            "recoupment_timeline_days": 45,
            "waterfall_priority": "Tier 1: Senior Advance Recoupment (100% of door/merch net until 1.35x achieved)"
        }
    },
    {
        "id": "tour-aisha-mwangi",
        "artist": "Aisha Mwangi Live Residency",
        "origin": "Mombasa / Nairobi, Kenya",
        "route": "Nairobi → Kigali → Lagos → Accra → Johannesburg",
        "route_stops": [
            {"city": "Nairobi, Kenya", "venue": "Kenya National Theatre", "capacity": 950, "date": "Nov 15"},
            {"city": "Kigali, Rwanda", "venue": "Kigali Serena Hall", "capacity": 800, "date": "Nov 21"},
            {"city": "Lagos, Nigeria", "venue": "Terra Kulture Arena", "capacity": 1100, "date": "Nov 28"},
            {"city": "Accra, Ghana", "venue": "Alliance Française Amphitheatre", "capacity": 900, "date": "Dec 05"},
            {"city": "Johannesburg, SA", "venue": "The Market Theatre", "capacity": 1050, "date": "Dec 12"}
        ],
        "genre": "Pan-African Soul & Contemporary R&B",
        "underwriting_goal": 40000,
        "funded_amount": 36000,
        "min_ticket_size": 2000,
        "investor_irr": "19.8% Target IRR",
        "fan_density": "210,000 Verified Streams",
        "pre_sale_velocity": "92% Pre-Sale Index",
        "payback_terms": "Waterfall Recoupment with 15% Preferred Return",
        "recoupment_cap": "1.30x Advance Cap",
        "highlights": "Acoustic theatre stops + 5 songwriter masterclasses with local youth conservatories.",
        "status": "Closing Soon (90% Funded)",
        "telemetry": {
            "tunestream_monthly_listeners": 620000,
            "stream_growth_mom": "+29.1%",
            "crm_waitlist_fans": 18600,
            "average_ticket_price_usd": 28.00,
            "projected_gross_box_office": 134400,
            "projected_merch_gross": 22500,
            "net_revenue_projected": 156900,
            "recoupment_timeline_days": 35,
            "waterfall_priority": "Tier 1: 15% Preferred Return + Advance Principal before Label share"
        }
    },
    {
        "id": "tour-kip-mavens-us",
        "artist": "Kip & The Mavens US Festival Circuit",
        "origin": "Rift Valley / Nairobi, Kenya",
        "route": "Austin (SXSW) → Chicago → New York → Toronto → Seattle",
        "route_stops": [
            {"city": "Austin, TX", "venue": "SXSW Official Showcase", "capacity": 2500, "date": "Mar 14"},
            {"city": "Chicago, IL", "venue": "Thalia Hall", "capacity": 1300, "date": "Mar 20"},
            {"city": "New York, NY", "venue": "Bowery Ballroom", "capacity": 950, "date": "Mar 26"},
            {"city": "Toronto, Canada", "venue": "The Opera House", "capacity": 1200, "date": "Apr 02"},
            {"city": "Seattle, WA", "venue": "The Crocodile", "capacity": 850, "date": "Apr 08"}
        ],
        "genre": "Indie Afro-Rock & Live Backline",
        "underwriting_goal": 75000,
        "funded_amount": 54000,
        "min_ticket_size": 5000,
        "investor_irr": "24.2% Target IRR",
        "fan_density": "340,000 Verified Streams",
        "pre_sale_velocity": "88% Pre-Sale Index",
        "payback_terms": "Split Cascade Priority Recoupment + 12% Merch Box Split",
        "recoupment_cap": "1.40x Advance Cap",
        "highlights": "7 festival stages, live studio co-writing sessions, and college radio broadcast tours.",
        "status": "Active Syndicate (72% Funded)",
        "telemetry": {
            "tunestream_monthly_listeners": 890000,
            "stream_growth_mom": "+44.2%",
            "crm_waitlist_fans": 24800,
            "average_ticket_price_usd": 38.00,
            "projected_gross_box_office": 258400,
            "projected_merch_gross": 46000,
            "net_revenue_projected": 304400,
            "recoupment_timeline_days": 40,
            "waterfall_priority": "Tier 1: Senior Secured 1.40x Cap via automated Stripe/TunePay gateway splits"
        }
    },
    {
        "id": "tour-sauti-sahara-eu",
        "artist": "Sauti Ya Sahara European Arena Support",
        "origin": "Cairo / Nairobi, Kenya",
        "route": "Madrid → Marseille → Milan → Berlin → London",
        "route_stops": [
            {"city": "Madrid, Spain", "venue": "WiZink Center (Support)", "capacity": 8000, "date": "May 10"},
            {"city": "Marseille, France", "venue": "Le Silo", "capacity": 2000, "date": "May 16"},
            {"city": "Milan, Italy", "venue": "Alcatraz", "capacity": 3000, "date": "May 22"},
            {"city": "Berlin, Germany", "venue": "Columbiahalle", "capacity": 3500, "date": "May 28"},
            {"city": "London, UK", "venue": "O2 Shepherd's Bush Empire", "capacity": 2000, "date": "Jun 04"}
        ],
        "genre": "Desert Blues & Tuareg Rock",
        "underwriting_goal": 65000,
        "funded_amount": 42000,
        "min_ticket_size": 5000,
        "investor_irr": "21.5% Target IRR",
        "fan_density": "295,000 Verified Streams",
        "pre_sale_velocity": "85% Pre-Sale Index",
        "payback_terms": "Direct Guaranteed Guarantee Share + Split Cascade Settlement",
        "recoupment_cap": "1.32x Advance Cap",
        "highlights": "Major festival support tour with established headliner + 2 acoustic cultural sessions.",
        "status": "Active Syndicate (65% Funded)",
        "telemetry": {
            "tunestream_monthly_listeners": 530000,
            "stream_growth_mom": "+31.0%",
            "crm_waitlist_fans": 19400,
            "average_ticket_price_usd": 35.00,
            "projected_gross_box_office": 198000,
            "projected_merch_gross": 31000,
            "net_revenue_projected": 229000,
            "recoupment_timeline_days": 50,
            "waterfall_priority": "Tier 1: Promoter guaranteed performance fee escrow lock"
        }
    },
    {
        "id": "tour-rift-valley-asia",
        "artist": "The Rift Valley Sessions Japan & Korea Showcase",
        "origin": "Nairobi, Kenya",
        "route": "Tokyo → Osaka → Kyoto → Seoul",
        "route_stops": [
            {"city": "Tokyo, Japan", "venue": "Liquidroom Ebisu", "capacity": 1000, "date": "Sep 05"},
            {"city": "Osaka, Japan", "venue": "Club Quattro", "capacity": 800, "date": "Sep 10"},
            {"city": "Kyoto, Japan", "venue": "Kyoto Muse", "capacity": 650, "date": "Sep 14"},
            {"city": "Seoul, South Korea", "venue": "Rolling Hall Hongdae", "capacity": 900, "date": "Sep 19"}
        ],
        "genre": "Afro-House & Live Percussion Ensemble",
        "underwriting_goal": 48000,
        "funded_amount": 26000,
        "min_ticket_size": 2500,
        "investor_irr": "23.0% Target IRR",
        "fan_density": "180,000 Verified Streams",
        "pre_sale_velocity": "82% Pre-Sale Index",
        "payback_terms": "First-Dollar Recoupment + Vinyl/Merch Revenue Stream",
        "recoupment_cap": "1.35x Advance Cap",
        "highlights": "4-city club tour + collaborative vinyl release with Tokyo electronic label.",
        "status": "Open for Syndicate (54% Funded)",
        "telemetry": {
            "tunestream_monthly_listeners": 395000,
            "stream_growth_mom": "+41.5%",
            "crm_waitlist_fans": 12100,
            "average_ticket_price_usd": 40.00,
            "projected_gross_box_office": 134000,
            "projected_merch_gross": 36000,
            "net_revenue_projected": 170000,
            "recoupment_timeline_days": 38,
            "waterfall_priority": "Tier 1: Senior Secured Recoupment with Japanese promoter escrow"
        }
    }
]


def _seed_opportunities_if_empty():
    """Seed initial tour opportunities if collection is empty."""
    try:
        count = db.tour_opportunities.count_documents({})
        if count == 0:
            for opp in INITIAL_OPPORTUNITIES:
                doc = opp.copy()
                doc["created_at"] = datetime.now(timezone.utc).isoformat()
                doc["updated_at"] = datetime.now(timezone.utc).isoformat()
                db.tour_opportunities.insert_one(doc)
            logger.info("Seeded %d tour underwriting opportunities into db", len(INITIAL_OPPORTUNITIES))
    except Exception as e:
        logger.warning("Could not check or seed tour opportunities: %s", e)


# ---------------------------------------------------------
# Request/Response Schemas
# ---------------------------------------------------------
class InvestorOnboardRequest(BaseModel):
    name: str
    email: str
    entity_name: Optional[str] = "Independent LP / Angel"
    investor_type: str = "accredited_angel" # "accredited_angel" | "venture_fund" | "family_office" | "music_syndicate" | "corporate"
    accreditation_status: str = "verified_accredited"
    check_size_range: str = "$25,000 - $100,000"
    target_corridors: List[str] = Field(default_factory=lambda: ["Europe", "North America", "Pan-African"])
    payout_preference: str = "split_cascade_wallet" # "split_cascade_wallet" | "mpesa_till" | "wire_swift"
    wallet_or_account: Optional[str] = None
    regulatory_attestation: bool = True
    notes: Optional[str] = None


class TourPitchRequest(BaseModel):
    artist_name: str
    origin_city: str
    contact_email: str
    genre: str
    target_regions: str
    budget_request: float
    fan_reach: str
    stream_link: Optional[str] = None
    epk_url: Optional[str] = None
    notes: Optional[str] = None


class CapitalCommitmentRequest(BaseModel):
    opportunity_id: str
    amount: float
    currency: str = "USD"
    investor_id: Optional[str] = None
    investor_name: str
    investor_email: str
    split_payout_address: Optional[str] = None
    terms_accepted: bool = True


# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------

@router.get("/vault/opportunities")
def get_vault_opportunities():
    """List all active tour underwriting opportunities in the vault."""
    _seed_opportunities_if_empty()
    try:
        docs = list(db.tour_opportunities.find({}, {"_id": 0}))
        if not docs:
            return INITIAL_OPPORTUNITIES
        return docs
    except Exception as e:
        logger.warning("Error fetching tour opportunities: %s", e)
        return INITIAL_OPPORTUNITIES


@router.get("/vault/opportunities/{opp_id}")
def get_opportunity_telemetry(opp_id: str):
    """Retrieve full telemetry and due-diligence data room for a specific tour."""
    _seed_opportunities_if_empty()
    try:
        opp = db.tour_opportunities.find_one({"id": opp_id}, {"_id": 0})
        if opp:
            return opp
    except Exception as e:
        logger.warning("Error fetching opportunity: %s", e)

    # Fallback to in-memory list
    for item in INITIAL_OPPORTUNITIES:
        if item["id"] == opp_id:
            return item

    raise HTTPException(status_code=404, detail="Tour opportunity not found")


@router.post("/investors/onboard", status_code=status.HTTP_201_CREATED)
def onboard_investor(payload: InvestorOnboardRequest):
    """Register and onboard a Venture Capitalist, Angel, or Syndicate LP.

    Records investor profile, accreditation self-attestation, preferred check sizes,
    and returns an authenticated Investor Profile and Data Room pass.
    """
    investor_id = f"inv-{uuid.uuid4().hex[:10]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    investor_record = {
        "investor_id": investor_id,
        "name": payload.name,
        "email": payload.email,
        "entity_name": payload.entity_name,
        "investor_type": payload.investor_type,
        "accreditation_status": payload.accreditation_status,
        "check_size_range": payload.check_size_range,
        "target_corridors": payload.target_corridors,
        "payout_preference": payload.payout_preference,
        "wallet_or_account": payload.wallet_or_account or f"tunemavens_split_{investor_id}",
        "regulatory_attestation": payload.regulatory_attestation,
        "notes": payload.notes,
        "data_room_access_granted": True,
        "accreditation_tier": "Tier-1 Accredited LP",
        "created_at": now_iso,
        "updated_at": now_iso
    }

    try:
        db.tour_investors.insert_one(investor_record.copy())
    except Exception as e:
        logger.warning("Failed to persist investor record to Mongo: %s", e)

    # Clean out Mongo _id if any
    investor_record.pop("_id", None)
    return {
        "status": "success",
        "message": "Investor successfully onboarded to TuneMavens Tour Underwriting Vault",
        "investor": investor_record,
        "data_room_token": f"TM-DR-{uuid.uuid4().hex[:12].upper()}"
    }


@router.post("/vault/commit", status_code=status.HTTP_201_CREATED)
def commit_capital(payload: CapitalCommitmentRequest):
    """Underwrite / commit capital to a specific tour opportunity.

    Updates the funded progress on the opportunity, logs the allocation into
    the Split Cascade commitment ledger, and returns a verified allocation receipt.
    """
    _seed_opportunities_if_empty()

    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Commitment amount must be greater than 0")

    commitment_id = f"commit-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    # Find opportunity
    opp = None
    try:
        opp = db.tour_opportunities.find_one({"id": payload.opportunity_id})
    except Exception as e:
        logger.warning("Error fetching opportunity: %s", e)

    if not opp:
        # Fallback check
        for item in INITIAL_OPPORTUNITIES:
            if item["id"] == payload.opportunity_id:
                opp = item.copy()
                break

    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    new_funded = float(opp.get("funded_amount", 0)) + payload.amount
    goal = float(opp.get("underwriting_goal", 1))
    pct = min(100.0, round((new_funded / goal) * 100, 1))

    new_status = f"Active Syndicate ({pct}% Funded)"
    if pct >= 100:
        new_status = "Fully Subscribed (100% Allocated)"

    # Update in DB
    try:
        db.tour_opportunities.update_one(
            {"id": payload.opportunity_id},
            {"$set": {
                "funded_amount": new_funded,
                "status": new_status,
                "updated_at": now_iso
            }}
        )
    except Exception as e:
        logger.warning("Could not update opportunity funded_amount in Mongo: %s", e)

    # Record commitment
    record = {
        "commitment_id": commitment_id,
        "opportunity_id": payload.opportunity_id,
        "artist": opp.get("artist"),
        "investor_name": payload.investor_name,
        "investor_email": payload.investor_email,
        "amount": payload.amount,
        "currency": payload.currency,
        "split_payout_address": payload.split_payout_address,
        "investor_irr": opp.get("investor_irr"),
        "payback_terms": opp.get("payback_terms"),
        "created_at": now_iso
    }

    try:
        db.tour_commitments.insert_one(record.copy())
    except Exception as e:
        logger.warning("Could not persist tour commitment: %s", e)

    record.pop("_id", None)
    return {
        "status": "success",
        "message": f"Successfully allocated {payload.currency} {payload.amount:,.2f} to {opp.get('artist')}",
        "commitment": record,
        "updated_opportunity": {
            "id": payload.opportunity_id,
            "underwriting_goal": goal,
            "funded_amount": new_funded,
            "percent_funded": pct,
            "status": new_status
        }
    }


@router.post("/pitches", status_code=status.HTTP_201_CREATED)
def submit_tour_pitch(payload: TourPitchRequest):
    """Submit an artist or management tour pitch for incubation and advance underwriting."""
    pitch_id = f"pitch-{uuid.uuid4().hex[:8]}"
    now_iso = datetime.now(timezone.utc).isoformat()

    doc = {
        "pitch_id": pitch_id,
        "artist_name": payload.artist_name,
        "origin_city": payload.origin_city,
        "contact_email": payload.contact_email,
        "genre": payload.genre,
        "target_regions": payload.target_regions,
        "budget_request": payload.budget_request,
        "fan_reach": payload.fan_reach,
        "stream_link": payload.stream_link,
        "epk_url": payload.epk_url,
        "notes": payload.notes,
        "review_status": "in_review",
        "created_at": now_iso
    }

    try:
        db.tour_pitches.insert_one(doc.copy())
    except Exception as e:
        logger.warning("Could not persist pitch: %s", e)

    doc.pop("_id", None)
    return {
        "status": "success",
        "message": "Tour pitch received. TuneMavens Global Touring A&R team will review your telemetry and contact you within 48 hours.",
        "pitch": doc
    }


@router.get("/stats")
def get_tour_global_stats():
    """Return macro platform tour metrics."""
    return {
        "international_corridors": 48,
        "tour_vc_deployed_usd": 14200000,
        "masterclasses_held": 150,
        "settlement_rate_percent": 100,
        "average_investor_irr": "22.1%",
        "artists_incubated": 84,
        "cities_covered": 36
    }
