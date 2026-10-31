"""Corporate Brand Advertising & Sponsorship Router.

Manages business ad rates, campaign bookings, inbound brand inquiries,
audio spot tracking, and performance attribution across the Intermaven
and TuneMavens ecosystem (TuneStream, Creator EPKs, and SyncMavens).
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field

from auth import get_current_user, get_optional_user
from config import db
from models import CorporateAdRate, CorporateAdCampaign, CorporateAdInquiry
from services import ledger_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/corporate", tags=["corporate-advertising"])


# ======================================================================
# Seed Data & Rate Specifications
# ======================================================================
DEFAULT_AD_RATES = [
    {
        "slug": "pulse",
        "name": "Audio Interstitial Starter (Pulse)",
        "tier_badge": "Essential Reach",
        "price_usd": 499.0,
        "credits": 2500,
        "cpm_usd": 19.96,
        "guaranteed_impressions": 25000,
        "duration_days": 30,
        "formats": [
            "15s Studio Audio Interstitial on TuneStream",
            "300x250 Display Companion Banner"
        ],
        "features": [
            "25,000 Guaranteed Stream Impressions (~$19.96 CPM)",
            "15s Unskippable Audio Interstitial between playlist queues",
            "Single-genre subculture targeting (Afrobeats, Amapiano, Hip Hop, Indie)",
            "Frequency capping (max 1x per hour per listener)",
            "Verified audio completion auditing (75% & 100% completions)",
            "Intermaven Smart CRM lead capture routing"
        ],
        "is_popular": False,
        "cta": "Book Pulse Spot"
    },
    {
        "slug": "amplified",
        "name": "Targeted Campaign Growth (Amplified)",
        "tier_badge": "Most Popular",
        "price_usd": 1499.0,
        "credits": 7500,
        "cpm_usd": 14.99,
        "guaranteed_impressions": 100000,
        "duration_days": 30,
        "formats": [
            "15s & 30s High-Fidelity Audio Spots",
            "In-Player Interactive Vinyl Badge",
            "Creator EPK Banner Takeovers"
        ],
        "features": [
            "100,000 Guaranteed Stream Impressions (~$14.99 CPM)",
            "15s & 30s High-Fidelity Audio Spots on TuneStream",
            "Subculture & territory geo-targeting (East Africa, West Africa, UK Diaspora, US Urban)",
            "Interactive click-through voucher / instant discount code redemption",
            "100% indemnified sync rights on commercial background audio",
            "Live attribution dashboard with conversion heatmaps & CTR reporting"
        ],
        "is_popular": True,
        "cta": "Launch Amplified Spot"
    },
    {
        "slug": "culture-lead",
        "name": "Artist EPK & Tour Co-Sponsorship (Culture Lead)",
        "tier_badge": "Cultural Alignment",
        "price_usd": 3999.0,
        "credits": 20000,
        "cpm_usd": 13.33,
        "guaranteed_impressions": 300000,
        "duration_days": 60,
        "formats": [
            "Co-Branded Digital QR Ticket Passes",
            "3-Line Hero Carousel Banner on Creator EPKs",
            "30s Premium Audio Spots"
        ],
        "features": [
            "300,000+ Multichannel Fan Impressions across live tours & digital EPKs",
            "Co-branded Digital QR Ticket Passes on verified artist concert tours",
            "Custom Subdomain Hero Carousel slot on Creator Web Worlds",
            "Experiential on-site sampling booth integration & M-Pesa STK sampling push",
            "Smart CRM automated omnichannel lead routing (WhatsApp, SMS, Email)",
            "Dedicated creator social co-mention & promotional protocol"
        ],
        "is_popular": False,
        "cta": "Sponsor Creator Tour"
    },
    {
        "slug": "titan",
        "name": "Enterprise Omnichannel Takeover (Titan)",
        "tier_badge": "Category Exclusive",
        "price_usd": 9999.0,
        "credits": 50000,
        "cpm_usd": 9.99,
        "guaranteed_impressions": 1000000,
        "duration_days": 90,
        "formats": [
            "100% Station Share of Voice",
            "SyncMavens Sync Brief Commercial Ingress",
            "Custom Mother-CMS Brand Hub"
        ],
        "features": [
            "1,000,000+ Omnichannel Impressions across TuneMavens, TuneStream & SyncMavens",
            "100% Category Exclusivity (zero competing brand ads in your industry vertical)",
            "Custom Sonic Branding & Audio Logo production by verified audio engineers",
            "Priority Sync Brief matching for national TV spots on SyncMavens",
            "Direct CRM API Webhook stream for real-time customer data sync",
            "Dedicated Senior Agency Media Director & quarterly audit reporting"
        ],
        "is_popular": False,
        "cta": "Request Enterprise RFP"
    }
]


def seed_default_ad_rates_if_empty():
    """Ensure standard business ad rates are present in MongoDB."""
    try:
        count = db.corporate_ad_rates.count_documents({})
        if count == 0:
            for rate_data in DEFAULT_AD_RATES:
                rate_doc = {**rate_data, "created_at": datetime.now(timezone.utc)}
                db.corporate_ad_rates.insert_one(rate_doc)
            logger.info("Successfully seeded 4 Corporate Business Ad Rate tiers into db.corporate_ad_rates")
        
        # Also seed sample campaigns if empty
        camp_count = db.corporate_ad_campaigns.count_documents({})
        if camp_count == 0:
            sample_campaigns = [
                {
                    "brand_name": "Safaricom Neon Beats",
                    "company_name": "Safaricom PLC",
                    "contact_email": "brand_media@safaricom.co.ke",
                    "contact_phone": "+254722000000",
                    "user_id": None,
                    "tier_slug": "amplified",
                    "tier_name": "Targeted Campaign Growth (Amplified)",
                    "budget_usd": 1499.0,
                    "credits_allocated": 7500,
                    "spot_duration_seconds": 30,
                    "audio_asset_url": "https://assets.tunemavens.com/demo/safaricom_neon_30s.mp3",
                    "companion_banner_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
                    "destination_url": "https://safaricom.co.ke/neon",
                    "promo_code": "SAFARITUNE25",
                    "target_regions": ["East Africa", "Kenya", "Uganda"],
                    "target_genres": ["Afrobeats", "Gengetone", "Amapiano"],
                    "status": "active",
                    "impressions_delivered": 42180,
                    "completions_delivered": 39820,
                    "clicks_delivered": 1420,
                    "ctr": 3.37,
                    "leads_generated": 184,
                    "start_date": datetime.now(timezone.utc),
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "brand_name": "Red Bull SoundClash",
                    "company_name": "Red Bull East Africa",
                    "contact_email": "partnerships@redbull.com",
                    "contact_phone": "+254711223344",
                    "user_id": None,
                    "tier_slug": "culture-lead",
                    "tier_name": "Artist EPK & Tour Co-Sponsorship (Culture Lead)",
                    "budget_usd": 3999.0,
                    "credits_allocated": 20000,
                    "spot_duration_seconds": 30,
                    "audio_asset_url": "https://assets.tunemavens.com/demo/redbull_soundclash_30s.mp3",
                    "companion_banner_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600",
                    "destination_url": "https://redbull.com/soundclash",
                    "promo_code": "REDBULLVIBE",
                    "target_regions": ["Kenya", "South Africa", "Nigeria"],
                    "target_genres": ["Electronic", "Amapiano", "Hip Hop"],
                    "status": "active",
                    "impressions_delivered": 118400,
                    "completions_delivered": 112000,
                    "clicks_delivered": 4890,
                    "ctr": 4.13,
                    "leads_generated": 512,
                    "start_date": datetime.now(timezone.utc),
                    "created_at": datetime.now(timezone.utc)
                }
            ]
            db.corporate_ad_campaigns.insert_many(sample_campaigns)
            logger.info("Successfully seeded 2 demonstration Corporate Ad Campaigns")
    except Exception as e:
        logger.warning(f"Corporate rates seed note: {e}")


# Initialize seeds on module import
seed_default_ad_rates_if_empty()


# ======================================================================
# Request / Response Schemas
# ======================================================================
class InquiryCreateRequest(BaseModel):
    brand_name: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    tier_slug: str = "amplified"
    target_region: Optional[str] = "East Africa / Global Diaspora"
    target_genre: Optional[str] = "Afrobeats & Electronic"
    estimated_budget: Optional[str] = "$1,499 (7,500 Credits)"
    notes: Optional[str] = None
    preferred_start_date: Optional[str] = None


class CampaignCreateRequest(BaseModel):
    brand_name: str
    company_name: Optional[str] = None
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    tier_slug: str = "amplified"
    budget_usd: Optional[float] = None
    credits_allocated: Optional[int] = None
    spot_duration_seconds: int = 15
    audio_asset_url: Optional[str] = None
    companion_banner_url: Optional[str] = None
    destination_url: Optional[str] = None
    promo_code: Optional[str] = None
    target_regions: List[str] = Field(default_factory=lambda: ["East Africa", "Global"])
    target_genres: List[str] = Field(default_factory=lambda: ["Afrobeats", "Hip Hop", "Amapiano"])
    payment_method: str = "invoice"  # 'credits' | 'stripe' | 'invoice' | 'pesapal'


class EventTrackRequest(BaseModel):
    event_type: str = "impression"  # 'impression' | 'completion' | 'click'
    listener_id: Optional[str] = None
    track_title: Optional[str] = None
    client_platform: Optional[str] = "tunestream_web"


# ======================================================================
# Endpoints
# ======================================================================
@router.get("/ad-rates", response_model=List[CorporateAdRate], response_model_by_alias=False)
@router.get("/rates", response_model=List[CorporateAdRate], response_model_by_alias=False)
def get_ad_rates():
    """Retrieve all established business ad rates and sponsorship packages."""
    docs = list(db.corporate_ad_rates.find().sort("price_usd", 1))
    if not docs:
        seed_default_ad_rates_if_empty()
        docs = list(db.corporate_ad_rates.find().sort("price_usd", 1))
    
    rates = []
    for d in docs:
        rates.append(CorporateAdRate.from_mongo(d))
    return rates


@router.post("/inquiries")
def create_ad_inquiry(payload: InquiryCreateRequest):
    """Submit a corporate advertising inquiry / RFP from /for/corporate."""
    if not payload.brand_name.strip() or not payload.contact_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brand name and contact email are required"
        )
    
    ref_code = f"TM-AD-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"
    
    inquiry_doc = {
        "reference_code": ref_code,
        "brand_name": payload.brand_name.strip(),
        "contact_name": payload.contact_name.strip(),
        "contact_email": str(payload.contact_email).lower(),
        "contact_phone": payload.contact_phone.strip() if payload.contact_phone else None,
        "tier_slug": payload.tier_slug,
        "target_region": payload.target_region,
        "target_genre": payload.target_genre,
        "estimated_budget": payload.estimated_budget,
        "notes": payload.notes,
        "preferred_start_date": payload.preferred_start_date,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    res = db.corporate_ad_inquiries.insert_one(inquiry_doc)
    inquiry_id = str(res.inserted_id)

    # Route automatically to Intermaven Smart CRM Leads Collection
    try:
        crm_lead = {
            "name": payload.contact_name or payload.brand_name,
            "brand_name": payload.brand_name.strip(),
            "email": str(payload.contact_email).lower(),
            "phone": payload.contact_phone or "",
            "channel": "corporate-ad-rfp",
            "creator_username": "corporate_desk",
            "notes": f"Brand: {payload.brand_name} | Tier: {payload.tier_slug} | Budget: {payload.estimated_budget} | Ref: {ref_code} | Notes: {payload.notes or 'None'}",
            "status": "new",
            "source": "tunemavens.com/#/for/corporate",
            "created_at": datetime.now(timezone.utc)
        }
        db.crm_leads.insert_one(crm_lead)
        logger.info(f"Routed Corporate Brand lead {payload.brand_name} ({ref_code}) to Smart CRM")
    except Exception as e:
        logger.warning(f"CRM lead routing warning: {e}")

    return {
        "success": True,
        "reference_code": ref_code,
        "inquiry_id": inquiry_id,
        "message": "Your corporate advertising inquiry has been registered. An Intermaven media representative will contact you within 24 hours.",
        "details": {
            "brand_name": payload.brand_name,
            "tier_slug": payload.tier_slug,
            "estimated_budget": payload.estimated_budget,
            "reference_code": ref_code
        }
    }


@router.post("/campaigns")
def create_campaign(payload: CampaignCreateRequest, request: Request):
    """Book or create a corporate advertising campaign."""
    current_user = get_optional_user(request)
    
    # Match tier details
    rate_doc = db.corporate_ad_rates.find_one({"slug": payload.tier_slug})
    tier_name = rate_doc.get("name") if rate_doc else payload.tier_slug.title()
    budget_usd = payload.budget_usd or (rate_doc.get("price_usd") if rate_doc else 1499.0)
    credits_allocated = payload.credits_allocated or (rate_doc.get("credits") if rate_doc else 7500)

    user_id = str(current_user["_id"]) if current_user else None

    # If paying via credits and authenticated, check balance and deduct via TuneLedger
    if payload.payment_method == "credits" and current_user:
        try:
            ledger_service.record_transaction(
                user_id=current_user["_id"],
                amount=-credits_allocated,
                entry_type="CREDIT_SPEND_ADS",
                provider="tunemavens_ads",
                provider_ref=f"ADS-{uuid.uuid4().hex[:8].upper()}",
                description=f"Ad placement campaign for {payload.brand_name} ({tier_name})",
                metadata={"tier_slug": payload.tier_slug, "brand_name": payload.brand_name}
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    campaign_doc = {
        "brand_name": payload.brand_name.strip(),
        "company_name": payload.company_name or payload.brand_name,
        "contact_email": str(payload.contact_email).lower(),
        "contact_phone": payload.contact_phone,
        "user_id": user_id,
        "tier_slug": payload.tier_slug,
        "tier_name": tier_name,
        "budget_usd": budget_usd,
        "credits_allocated": credits_allocated,
        "spot_duration_seconds": payload.spot_duration_seconds,
        "audio_asset_url": payload.audio_asset_url,
        "companion_banner_url": payload.companion_banner_url,
        "destination_url": payload.destination_url,
        "promo_code": payload.promo_code,
        "target_regions": payload.target_regions,
        "target_genres": payload.target_genres,
        "payment_method": payload.payment_method,
        "status": "active" if payload.payment_method == "credits" else "in_review",
        "impressions_delivered": 0,
        "completions_delivered": 0,
        "clicks_delivered": 0,
        "ctr": 0.0,
        "leads_generated": 0,
        "start_date": datetime.now(timezone.utc),
        "created_at": datetime.now(timezone.utc)
    }

    res = db.corporate_ad_campaigns.insert_one(campaign_doc)
    campaign_doc["_id"] = str(res.inserted_id)

    return {
        "success": True,
        "campaign": campaign_doc,
        "message": "Corporate ad campaign configured successfully and submitted for live delivery."
    }


@router.get("/campaigns")
def list_campaigns(request: Request, email: Optional[str] = None):
    """List corporate ad campaigns."""
    current_user = get_optional_user(request)
    
    query = {}
    if current_user and current_user.get("role") != "admin":
        user_id_str = str(current_user["_id"])
        user_email = str(current_user.get("email", "")).lower()
        query = {"$or": [{"user_id": user_id_str}, {"contact_email": user_email}]}
    elif email:
        query = {"contact_email": email.strip().lower()}

    cursor = db.corporate_ad_campaigns.find(query).sort("created_at", -1)
    campaigns = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        campaigns.append(doc)
    return campaigns


@router.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str):
    """Get single campaign details and delivery attribution."""
    try:
        oid = ObjectId(campaign_id)
        doc = db.corporate_ad_campaigns.find_one({"_id": oid})
    except Exception:
        doc = db.corporate_ad_campaigns.find_one({"_id": campaign_id})

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/campaigns/{campaign_id}/track")
def track_ad_event(campaign_id: str, payload: EventTrackRequest):
    """Log an ad impression, audio completion, or listener click."""
    try:
        oid = ObjectId(campaign_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid campaign ID")

    inc_field = {}
    if payload.event_type == "impression":
        inc_field["impressions_delivered"] = 1
    elif payload.event_type == "completion":
        inc_field["completions_delivered"] = 1
    elif payload.event_type == "click":
        inc_field["clicks_delivered"] = 1
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid event type")

    doc = db.corporate_ad_campaigns.find_one_and_update(
        {"_id": oid},
        {"$inc": inc_field},
        return_document=True
    )

    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    # Recalculate CTR
    impr = doc.get("impressions_delivered", 0)
    clicks = doc.get("clicks_delivered", 0)
    new_ctr = round((clicks / impr * 100), 2) if impr > 0 else 0.0

    db.corporate_ad_campaigns.update_one(
        {"_id": oid},
        {"$set": {"ctr": new_ctr}}
    )

    return {"success": True, "event": payload.event_type, "impressions": impr, "clicks": clicks, "ctr": new_ctr}


@router.get("/stats")
def get_corporate_stats():
    """Retrieve corporate advertising and brand ecosystem stats."""
    rates_count = db.corporate_ad_rates.count_documents({})
    campaigns = list(db.corporate_ad_campaigns.find({}))
    
    total_impressions = sum(c.get("impressions_delivered", 0) for c in campaigns)
    total_clicks = sum(c.get("clicks_delivered", 0) for c in campaigns)
    total_budget = sum(c.get("budget_usd", 0.0) for c in campaigns)
    active_count = sum(1 for c in campaigns if c.get("status") == "active")

    overall_ctr = round((total_clicks / total_impressions * 100), 2) if total_impressions > 0 else 3.8

    return {
        "status": "healthy",
        "service": "TuneMavens Corporate Ad Engine",
        "active_rate_tiers": rates_count,
        "active_campaigns": active_count,
        "total_campaigns": len(campaigns),
        "total_impressions_delivered": total_impressions,
        "total_clicks": total_clicks,
        "average_ctr": overall_ctr,
        "total_budget_committed_usd": total_budget,
        "formats_supported": [
            "15s Unskippable Audio Interstitial (TuneStream)",
            "30s High-Fidelity Audio Spot (TuneStream)",
            "300x250 Companion Visual Banner",
            "Co-branded Live Tour Digital QR Passes",
            "Creator Web World Hero Banner Takeover"
        ],
        "target_territories": ["East Africa", "West Africa", "South Africa", "UK & European Diaspora", "North America"]
    }


@router.get("/next-audio-ad")
def get_next_audio_ad():
    """Return the next active Corporate Ad audio interstitial spot for TuneStream Free / 0-credit listeners."""
    try:
        campaigns = list(db.corporate_ad_campaigns.find({"status": "active"}))
        if not campaigns:
            seed_default_ad_rates_if_empty()
            campaigns = list(db.corporate_ad_campaigns.find({"status": "active"}))
        if campaigns:
            chosen = campaigns[int(datetime.now().timestamp()) % len(campaigns)]
            cid = str(chosen.get("_id", "demo-camp-1"))
            try:
                db.corporate_ad_campaigns.update_one({"_id": chosen["_id"]}, {"$inc": {"impressions_delivered": 1}})
            except Exception:
                pass
            return {
                "id": cid,
                "brand_name": chosen.get("brand_name", "Safaricom Neon Beats"),
                "company_name": chosen.get("company_name", "Safaricom PLC"),
                "headline": f"Sponsored by {chosen.get('brand_name', 'Safaricom Neon Beats')} — Supporting Always-Free Streaming on TuneStream",
                "spot_duration_seconds": 15,
                "audio_url": "/api/stream/track/KE-TM1-24-INTRO",
                "companion_banner_url": chosen.get("companion_banner_url", "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg"),
                "destination_url": chosen.get("destination_url", "https://safaricom.co.ke/neon"),
                "promo_code": chosen.get("promo_code", "SAFARITUNE25"),
                "tier_name": chosen.get("tier_name", "Corporate Ad Services")
            }
    except Exception:
        pass

    return {
        "id": "corp-spot-safaricom",
        "brand_name": "Safaricom Neon Beats",
        "company_name": "Safaricom PLC",
        "headline": "Stream Music & Podcasts Anywhere with Safaricom 5G Data Bundles",
        "spot_duration_seconds": 15,
        "audio_url": "/api/stream/track/KE-TM1-24-INTRO",
        "companion_banner_url": "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
        "destination_url": "https://safaricom.co.ke/neon",
        "promo_code": "SAFARITUNE25",
        "tier_name": "Corporate Ad Services"
    }
