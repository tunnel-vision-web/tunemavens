"""Role Tier Packages, Commercial Plans & Inbound Inquiries Router.

Provides unified rate cards, commercial subscription tiers, and inbound RFP/inquiry
registration for all 6 core personas:
  - Creator / Artist (/for/creator)
  - Record Label (/for/labels)
  - Music Supervisor / Studio (/for/supervisors)
  - DJ / Curator (/for/djs)
  - Media House / Broadcaster (/for/media)
  - Music Enthusiast / Consumer (/for/listeners)

Enforces strict user scoping: non-admin users only view their own inquiries
and workspace telemetry.
"""
import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Request, status, Query
from pydantic import BaseModel, EmailStr, Field

from auth import get_current_user, get_optional_user
from config import db
from models import RoleTierPackage, RoleInquiry

logger = logging.getLogger(__name__)

router = APIRouter(tags=["role-tiers-and-plans"])


# ======================================================================
# Seed Data: Commercial Packages for Every Persona
# ======================================================================
DEFAULT_ROLE_TIERS: Dict[str, List[Dict[str, Any]]] = {
    "creator": [
        {
            "role": "creator",
            "slug": "creator-starter",
            "name": "Spark / Indie Starter",
            "tier_badge": "Free Forever",
            "price_usd": 0.0,
            "billing_period": "one-time credit reload",
            "credits": 0,
            "key_metric": "85/15 Net Splits · 3 Master Tracks",
            "deliverables": [
                "Uncapped lossless stream hosting on TuneStream",
                "Creator Web World basic bio & links"
            ],
            "features": [
                "Lossless streaming playback & 60fps waveform player",
                "Direct fan tips via M-Pesa, card & mobile wallets (100% to creator)",
                "Standard Split Cascade math engine (up to 3 collaborators)",
                "Public EPK portfolio link on tunemavens.com",
                "Community Discord & knowledge base access"
            ],
            "is_popular": False,
            "cta": "Start for Free"
        },
        {
            "role": "creator",
            "slug": "creator-pro",
            "name": "Pro Creator Growth",
            "tier_badge": "Most Popular",
            "price_usd": 29.0,
            "billing_period": "one-time credit reload",
            "credits": 300,
            "key_metric": "90/10 Net Splits · Unlimited Catalog",
            "deliverables": [
                "Custom Subdomain (artist.tunemavens.com)",
                "Sync Brief AI Match Submission"
            ],
            "features": [
                "Unlimited master track & stem upload storage (WAV & stems)",
                "90% artist royalty retention on catalog sales & streams",
                "SyncMavens AI sync brief automatic pitch routing",
                "Custom branded subdomain with customizable layout sections",
                "Intermaven Smart CRM fan lead capture (WhatsApp, SMS, Email)",
                "Social AI Studio content generator & 300 unified credits load with zero monthly fees"
            ],
            "is_popular": True,
            "cta": "Get Pro Creator"
        },
        {
            "role": "creator",
            "slug": "creator-studio",
            "name": "Studio Master & Touring",
            "tier_badge": "Full Independence",
            "price_usd": 99.0,
            "billing_period": "one-time credit reload",
            "credits": 1200,
            "key_metric": "100% Splits · TunePay POS Merch & Tour Ticketing",
            "deliverables": [
                "0% Platform Commission",
                "TunePay Event Box-Office POS App"
            ],
            "features": [
                "100% royalty take — zero commission on downloads & merchandise",
                "TunePay portable event POS ticketing & instant QR gate validation",
                "Priority Sync Brief matching for TV commercials & Hollywood films",
                "Automated Publishing & Distribution Election contract generation",
                "Multi-tiered recoupment cascade for investor & producer advances",
                "1,200 unified credits load for mastering, ads & stem distribution with zero monthly fees"
            ],
            "is_popular": False,
            "cta": "Launch Studio Plan"
        },
        {
            "role": "creator",
            "slug": "creator-enterprise",
            "name": "Label-Ready Enterprise",
            "tier_badge": "Managed Artist",
            "price_usd": 299.0,
            "billing_period": "one-time credit reload",
            "credits": 4000,
            "key_metric": "White-Glove Ingestion & Dedicated Sync Rep",
            "deliverables": [
                "Direct Sync Licensing Representation",
                "Custom Apex Domain & Mother-CMS"
            ],
            "features": [
                "Dedicated sync licensing agent pitching directly to agency music supervisors",
                "White-glove legacy catalog migration from DistroKid/TuneCore",
                "Custom apex domain SSL mapping (yourname.com)",
                "Automated PRO cue sheet registration (ASCAP, BMI, SESAC, MCSK)",
                "Co-branded sponsor banners on artist concert tour passes",
                "4,000 unified credits load & 24/7 priority executive phone support with zero monthly fees"
            ],
            "is_popular": False,
            "cta": "Book Artist Consultation"
        }
    ],
    "label": [
        {
            "role": "label",
            "slug": "label-team-starter",
            "name": "Label & Teams Starter",
            "tier_badge": "Label Floor",
            "price_usd": 75.0,
            "billing_period": "one-time credit reload",
            "credits": 7500,
            "key_metric": "7,500 Credits · Up to 10 Signed Artists · 100 Tracks",
            "deliverables": [
                "Isolated Roster Account Ledgers",
                "Distributor Statement CSV Parser"
            ],
            "features": [
                "Universal label floor: 7,500 TM Credits loaded to your label ledger (7,500 KES / $75.00 USD)",
                "Manage up to 10 signed creator profiles with isolated roster seats and catalog analytics",
                "Automated CSV statement parser (DistroKid, TuneCore, FUGA, Orchard)",
                "Split Cascade net calculations with advance balance tracking and recoupment",
                "Pre-cleared label roster sync pitching on SyncMavens network",
                "Standard email & dedicated chat label operations support"
            ],
            "is_popular": False,
            "cta": "Start Label Starter"
        },
        {
            "role": "label",
            "slug": "label-growth",
            "name": "Scale Label Operations",
            "tier_badge": "Most Popular",
            "price_usd": 150.0,
            "billing_period": "one-time credit reload",
            "credits": 15000,
            "key_metric": "15,000 Credits · Up to 50 Signed Artists · 1,000 Tracks",
            "deliverables": [
                "Automated Master Recoupment Cascades",
                "Multi-Seat A&R & Accounting Logins"
            ],
            "features": [
                "15,000 TM Credits load (15,000 KES / $150.00 USD) with zero monthly subscriptions",
                "Up to 50 active artists & 1,000 master tracks with multi-stem cloud archives",
                "Automated master advance recoupment cascades (90/10 down to 50/50)",
                "Role-based staff permissions (A&R, Legal Counsel, Head of Accounting)",
                "TunePay live tour merch & festival ticket box-office settlement",
                "Intermaven Smart CRM automated roster fan broadcasts (WhatsApp/SMS)"
            ],
            "is_popular": True,
            "cta": "Scale Label Operations"
        },
        {
            "role": "label",
            "slug": "label-enterprise",
            "name": "Major / Conglomerate Enterprise",
            "tier_badge": "Unlimited Scale",
            "price_usd": 500.0,
            "billing_period": "one-time credit reload",
            "credits": 50000,
            "key_metric": "50,000 Credits · Unlimited Artists & Masters · Custom White-Label",
            "deliverables": [
                "Custom Dedicated Subdomain / Domain",
                "Enterprise ERP API Data Webhooks"
            ],
            "features": [
                "50,000 TM Credits load (50,000 KES / $500.00 USD) for massive catalog throughput",
                "Unlimited roster size and unlimited catalog ingestion with custom white-labeled portal",
                "Direct bank rail & mobile money bulk payouts (M-Pesa B2C, ACH, SWIFT)",
                "Full ERP & accounting API webhooks for QuickBooks / NetSuite sync",
                "Priority Sync Brief placement exclusivity across SyncMavens network",
                "Custom enterprise SLA & 24/7 dedicated engineering support"
            ],
            "is_popular": False,
            "cta": "Request Enterprise Agreement"
        }
    ],
    "supervisor": [
        {
            "role": "supervisor",
            "slug": "supervisor-discovery",
            "name": "Indie Supervisor Discovery",
            "tier_badge": "Free Search",
            "price_usd": 0.0,
            "billing_period": "one-time credit reload",
            "credits": 0,
            "key_metric": "Search 50,000+ Pre-Cleared Masters",
            "deliverables": [
                "Full Catalog Natural Language Search",
                "Watermarked Audition Preview Streams"
            ],
            "features": [
                "Search 50k+ tracks by mood, tempo (BPM), instrumentation, and territory",
                "Listen to secure, watermarked preview streams in studio cutting rooms",
                "Direct contact access to rights owners and verified master holders",
                "Create and share private audition playlists with directors and editors",
                "Standard sync inquiry submission"
            ],
            "is_popular": False,
            "cta": "Explore Catalog Free"
        },
        {
            "role": "supervisor",
            "slug": "supervisor-production",
            "name": "Production Studio Pro",
            "tier_badge": "Most Popular",
            "price_usd": 149.0,
            "billing_period": "one-time credit reload",
            "credits": 1500,
            "key_metric": "Unlimited Brief Submissions · 94%+ AI Match",
            "deliverables": [
                "Multi-Track Lossless Stems Ingress",
                "1-Click Certified PRO Cue Sheet Generator"
            ],
            "features": [
                "Unlimited scene brief uploads with 94%+ AI match scoring against master audio",
                "Instant download of separated stems (drums, bass, melodies, vocals) for sync edits",
                "1-click export of industry-standard cue sheets (ISRC, CAE, duration timestamps)",
                "100% pre-cleared, indemnity-backed licensing terms for indie films & web series",
                "Direct in-app escrow contract execution with split guarantee",
                "1,500 unified credits load for custom composer queries with zero monthly fees"
            ],
            "is_popular": True,
            "cta": "Activate Studio Pro"
        },
        {
            "role": "supervisor",
            "slug": "supervisor-broadcast",
            "name": "Network & Studio Enterprise",
            "tier_badge": "Worldwide Clearance",
            "price_usd": 499.0,
            "billing_period": "one-time credit reload",
            "credits": 6000,
            "key_metric": "Full Worldwide Indemnification & Urgent Turnaround",
            "deliverables": [
                "Dedicated Rights Clearing Liaison",
                "Original Sonic Score Production"
            ],
            "features": [
                "Full worldwide theatrical, national broadcast, and streaming SVOD clearances",
                "Ironclad legal indemnification with zero residual union royalty exposure",
                "Custom original composition & sonic branding commissions with verified composers",
                "Urgent sync turnaround guarantee (< 4 hours for breaking broadcast cuts)",
                "Custom volume rate cards for television series & multi-territory ad campaigns",
                "6,000 unified credits load & dedicated senior music rights supervisor with zero monthly fees"
            ],
            "is_popular": False,
            "cta": "Contact Sync Director"
        }
    ],
    "dj": [
        {
            "role": "dj",
            "slug": "dj-resident",
            "name": "Club Resident",
            "tier_badge": "Essential Pool",
            "price_usd": 19.0,
            "billing_period": "one-time credit reload",
            "credits": 200,
            "key_metric": "50 Lossless Downloads · Clean & Dirty Edits",
            "deliverables": [
                "Lossless WAV & 320kbps MP3s",
                "Verified Club Cue Point Metadata"
            ],
            "features": [
                "Access curated record pools across Afrobeat, Amapiano, Hip Hop, and Dance",
                "Pre-analyzed tracks with verified BPM, musical key, and Rekordbox cue markers",
                "50 high-speed track downloads with intro/outro extended edits (non-expiring)",
                "Compatible with Pioneer Rekordbox, Serato DJ Pro, and Traktor Pro",
                "Verified DJ identity badge on TuneStream and community forums"
            ],
            "is_popular": False,
            "cta": "Join DJ Pool"
        },
        {
            "role": "dj",
            "slug": "dj-touring",
            "name": "Touring Pro DJ",
            "tier_badge": "Most Popular",
            "price_usd": 49.0,
            "billing_period": "one-time credit reload",
            "credits": 600,
            "key_metric": "Unlimited Downloads · Stems & Exclusive Dubplates",
            "deliverables": [
                "Unlimited Lossless WAV Downloads",
                "DMCA-Safe Performance Clearance Hashes"
            ],
            "features": [
                "Lossless WAV masters and separated remix stems download pack",
                "Exclusive unreleased artist dubplates & early club test pressings before public release",
                "Digital proof clearance hashes protecting your venue and live streams from DMCA strikes",
                "Direct feedback loop: rate unreleased tracks to send data straight to record label A&Rs",
                "600 unified credits load for high-priority dubplate requests (zero monthly fees)",
                "Priority download queue bandwidth for weekend set preparation"
            ],
            "is_popular": True,
            "cta": "Go Touring Pro"
        },
        {
            "role": "dj",
            "slug": "dj-headliner",
            "name": "Headline & Festival Curator",
            "tier_badge": "Taste-Maker",
            "price_usd": 129.0,
            "billing_period": "one-time credit reload",
            "credits": 1800,
            "key_metric": "Direct Label Drop Inbox & Radio Mix Distribution",
            "deliverables": [
                "Curated Resident Channel on TuneStream",
                "Artist Collaborative Dubplate Rights"
            ],
            "features": [
                "Personalized promo inbox where top labels send unreleased tracks directly for your sets",
                "Host verified syndicated mix series & live DJ sessions on TuneStream Web Radio",
                "Monetize live DJ sets with direct listener tipping and listener tip splits",
                "VIP access to artist tour soundchecks and festival press rooms",
                "1,800 unified credits load & personal artist liaison support (zero monthly fees)"
            ],
            "is_popular": False,
            "cta": "Apply for Headliner Tier"
        }
    ],
    "media_house": [
        {
            "role": "media_house",
            "slug": "media-station",
            "name": "Single Station / Regional",
            "tier_badge": "Compliance Starter",
            "price_usd": 199.0,
            "billing_period": "one-time credit reload",
            "credits": 2000,
            "key_metric": "Up to 2 Broadcast Channels · 5,000 Playlogs Load",
            "deliverables": [
                "Automation Playlog CSV/XML Ingestion",
                "Basic PRO Discrepancy Detection"
            ],
            "features": [
                "Direct ingestion from broadcast software (RCS Zetta, Dalet, WideOrbit, Selector)",
                "Automated track recognition matching playlogs to verified ISRC & CAE metadata",
                "Flag missing publishing shares and unregistered works before reporting",
                "Standard statutory royalty report exports ready for local collection societies",
                "2,000 unified credits load for catalog audio matching queries with zero monthly fees"
            ],
            "is_popular": False,
            "cta": "Connect Station"
        },
        {
            "role": "media_house",
            "slug": "media-network",
            "name": "Broadcaster Network Suite",
            "tier_badge": "Most Popular",
            "price_usd": 599.0,
            "billing_period": "one-time credit reload",
            "credits": 7500,
            "key_metric": "Up to 10 Stations · 50,000 Playlogs Load",
            "deliverables": [
                "1-Click PRO Formatted Exports (ASCAP, BMI, MCSK)",
                "TuneStream Native Audio Ad Sync"
            ],
            "features": [
                "Manage up to 10 radio and television broadcast channels in a unified console",
                "AI discrepancy detection resolving 99% of unrecognized broadcast cue entries",
                "1-click export formatted for ASCAP, BMI, SESAC, PRS, and MCSK compliance",
                "Integration with Intermaven Corporate Ad network for native commercial insertion",
                "Automated station affidavit logs and reconciliation audit trails",
                "7,500 unified credits load & dedicated broadcast compliance engineer with zero monthly fees"
            ],
            "is_popular": True,
            "cta": "Upgrade to Network Suite"
        },
        {
            "role": "media_house",
            "slug": "media-conglomerate",
            "name": "Enterprise Media Conglomerate",
            "tier_badge": "Statutory Fortress",
            "price_usd": 1499.0,
            "billing_period": "one-time credit reload",
            "credits": 20000,
            "key_metric": "Unlimited Stations · Real-Time Audio Fingerprinting",
            "deliverables": [
                "Automated Statutory Auditing",
                "Custom Regulatory SLA & Legal Counsel"
            ],
            "features": [
                "Unlimited radio, TV, and digital streaming broadcast channels",
                "Continuous 24/7 acoustic fingerprinting and broadcast stream monitoring",
                "Real-time metadata repair with automated direct songwriter outreach",
                "Ironclad statutory audit compliance defense against copyright fines",
                "Custom ERP integration into station billing and traffic scheduling systems",
                "20,000 unified credits load, custom SLA & 24/7 technical hotline with zero monthly fees"
            ],
            "is_popular": False,
            "cta": "Consult Compliance Team"
        }
    ],
    "consumer": [
        {
            "role": "consumer",
            "slug": "listener-free",
            "name": "Listener Free",
            "tier_badge": "Ad-Supported",
            "price_usd": 0.0,
            "billing_period": "one-time credit reload",
            "credits": 0,
            "key_metric": "High-Fidelity Audio Streaming",
            "deliverables": [
                "TuneStream Web Player Access",
                "Curated Regional & Subculture Feeds"
            ],
            "features": [
                "Stream thousands of independent music tracks across East Africa and global scenes",
                "Full-featured 60fps waveform player with live playlist queueing",
                "Follow favorite artists and receive real-time release notifications",
                "1-tap direct tipping to support creators with M-Pesa or card",
                "Create and share unlimited public and private music playlists"
            ],
            "is_popular": False,
            "cta": "Listen Free"
        },
        {
            "role": "consumer",
            "slug": "listener-starter",
            "name": "Listener Fan Starter",
            "tier_badge": "Starter Floor",
            "price_usd": 2.50,
            "billing_period": "one-time credit reload",
            "credits": 250,
            "key_metric": "250 Credits Load · Direct Artist Tipping",
            "deliverables": [
                "Universal 250 TM Credits Floor Pack",
                "Lossless FLAC Stream Access"
            ],
            "features": [
                "Universal floor pack: 250 TM Credits loaded to your account balance (250 KES / $2.50 USD)",
                "Tip your favorite artists and vocalists directly with 1 tap",
                "Unlock exclusive single stems, lossless track downloads, and secret drops",
                "Full lossless FLAC web streaming across mobile and desktop",
                "Support independent creators with direct M-Pesa or card reload"
            ],
            "is_popular": False,
            "cta": "Get Starter Pack"
        },
        {
            "role": "consumer",
            "slug": "listener-vip",
            "name": "TuneStream VIP Audiophile",
            "tier_badge": "Most Popular",
            "price_usd": 5.00,
            "billing_period": "one-time credit reload",
            "credits": 500,
            "key_metric": "Ad-Free Lossless Audio · 500 Credits Load",
            "deliverables": [
                "Zero Interstitial Ads",
                "Uncompressed FLAC / Studio Playback"
            ],
            "features": [
                "100% ad-free playback with zero audio interstitial interruptions",
                "Studio-quality 24-bit uncompressed FLAC audio streaming",
                "500 unified credits load to tip artists, unlock singles, or purchase stems",
                "Offline cache playback support across mobile and desktop browsers",
                "Dynamic track lyrics, producer liner notes, and synthesizer gear specs",
                "Support creators with higher royalty payouts per stream"
            ],
            "is_popular": True,
            "cta": "Get TuneStream VIP"
        },
        {
            "role": "consumer",
            "slug": "listener-patron",
            "name": "Patron of the Arts",
            "tier_badge": "Culture Builder",
            "price_usd": 10.00,
            "billing_period": "one-time credit reload",
            "credits": 1000,
            "key_metric": "1,000 Credits Load · VIP Concert Passes",
            "deliverables": [
                "Creator Live World Exclusive Drops",
                "Early Album Stream Access"
            ],
            "features": [
                "Exclusive verified Patron badge displayed on creator chats and live drops",
                "Early listening access to unreleased album cuts 7 days before general public",
                "1,000 unified credits load for concert tickets, vinyl merch, and digital passes",
                "Priority booking on artist live world tours with digital QR passes",
                "Direct patron Q&A channels with favorite producers and vocalists",
                "Direct contribution to independent creator development funds"
            ],
            "is_popular": False,
            "cta": "Become a Patron"
        }
    ],
    "podcaster": [
        {
            "role": "podcaster",
            "slug": "podcaster-starter",
            "name": "Starter Cast Pool",
            "tier_badge": "Free Forever",
            "price_usd": 0.0,
            "billing_period": "forever free starter credits",
            "credits": 50,
            "key_metric": "5 Hours Audio Hosting · Fast RSS Feed",
            "deliverables": [
                "Fast RSS 2.0 Global Feed Syndication",
                "TuneStream Web Player Embed Code"
            ],
            "features": [
                "Automatic feed delivery to Apple Podcasts, Spotify, and TuneStream",
                "5 hours of high-quality episode audio storage with fast global playback",
                "Clear listener stats: total downloads, listener countries, and popular devices",
                "Simple episode upload with automatic cover art and episode tags",
                "Ready-to-use web player embed for your personal website or blog",
                "50 free starter credits for automated audio voice cleanup"
            ],
            "is_popular": False,
            "cta": "Start Free Podcast"
        },
        {
            "role": "podcaster",
            "slug": "podcaster-studio",
            "name": "Studio Pro Host",
            "tier_badge": "Most Popular",
            "price_usd": 19.0,
            "billing_period": "one-time credit reload",
            "credits": 250,
            "key_metric": "25 Hours Studio Sound · Built-In Sponsor Ads",
            "deliverables": [
                "Server-Side Dynamic Ad Insertion (DAI)",
                "Cryptographically Certified Show Media Kit"
            ],
            "features": [
                "Studio-grade sound leveling: voices sound crisp, loud, and balanced everywhere",
                "Earn from sponsors: automatically play relevant ads to your listeners",
                "Live Media Kit: share your verified download stats with brands in one link",
                "Automatic team payouts: send co-hosts and producers their share via M-Pesa or bank",
                "Instant voice-to-text transcripts and clickable episode chapter markers",
                "250 credits reload with zero monthly fees — only pay when you need credits"
            ],
            "is_popular": True,
            "cta": "Go Studio Pro"
        },
        {
            "role": "podcaster",
            "slug": "podcaster-network",
            "name": "Network & Syndicate",
            "tier_badge": "Multi-Show Suite",
            "price_usd": 59.0,
            "billing_period": "one-time credit reload",
            "credits": 850,
            "key_metric": "Unlimited Shows · Priority Sponsor Matching",
            "deliverables": [
                "Multi-Show Network Management Dashboard",
                "Corporate Sponsor Ad Flight Bidding Access"
            ],
            "features": [
                "Manage multiple podcasts and channels all in one simple account",
                "Priority access to corporate brand sponsors looking to book ad campaigns",
                "Branded web player with your own links and sponsor promotional banners",
                "Easy guest booking calendar and remote recording connections",
                "Direct listener tipping: fans can tip you via M-Pesa or card with 0% platform take",
                "850 credits reload and dedicated audio engineering support (no expiry)"
            ],
            "is_popular": False,
            "cta": "Launch Network Suite"
        }
    ],
    "vc": [
        {
            "role": "vc",
            "slug": "vc-syndicate",
            "name": "Angel Syndicate Pool",
            "tier_badge": "Co-Investment",
            "price_usd": 10000.0,
            "billing_period": "minimum allocation",
            "credits": 0,
            "key_metric": "20% - 22% Expected Return · Single Tour Projects",
            "deliverables": [
                "Senior Secured First-Dollar Recoupment Rights",
                "Full Audience & Box-Office Telemetry Access"
            ],
            "features": [
                "Invest in vetted single-tour and multi-city concert projects",
                "Paid back first from every ticket sold before artist profits are released",
                "Direct access to live ticket sales, Spotify streaming numbers, and tour budgets",
                "Backed by standardized, legally binding contracts with zero speculation",
                "TuneMavens acts as secure technology and escrow intermediary (3.0% fee)",
                "0 platform credits charged — permanent fee exemption for investors"
            ],
            "is_popular": False,
            "cta": "Join Syndicate Pool"
        },
        {
            "role": "vc",
            "slug": "vc-growth",
            "name": "Cultural Growth Fund",
            "tier_badge": "Most Popular",
            "price_usd": 50000.0,
            "billing_period": "recommended deployment",
            "credits": 0,
            "key_metric": "22% - 25% Expected Return · Multi-Artist Tour Portfolio",
            "deliverables": [
                "Multi-Creator Tour Portfolio Facility",
                "Priority Deal Flow Stream Telemetry Alerts"
            ],
            "features": [
                "Spread capital across top-performing recording artists and headline festival DJs",
                "Automated deal alerts whenever an artist experiences a surge in streaming fans",
                "Senior claim on ticket sales plus streaming royalties for downside protection",
                "Dedicated portfolio manager with quarterly audit and tax-ready reporting packs",
                "Optional tool to sponsor artist production equipment with 1.25x fixed returns",
                "Zero annual management fees and zero platform subscription charges"
            ],
            "is_popular": True,
            "cta": "Deploy Growth Facility"
        },
        {
            "role": "vc",
            "slug": "vc-institutional",
            "name": "Institutional Tour Desk",
            "tier_badge": "Enterprise Facility",
            "price_usd": 250000.0,
            "billing_period": "custom credit line",
            "credits": 0,
            "key_metric": "24% - 26% Expected Return · Global Tour Corridors",
            "deliverables": [
                "Bespoke Cross-Border SPV Legal Structuring",
                "Real-Time Telemetry REST & WebSocket API"
            ],
            "features": [
                "Bespoke legal structures (SPVs) tailored to your fund’s exact criteria",
                "Cross-border tour financing covering 48+ live corridors (Africa, UK, US, EU, UAE)",
                "Direct data API connecting to your fund’s internal analytics models",
                "Priority repayment waterfall locked directly into ticketing payment gateways",
                "Lead investor syndication rights: bring your own co-investors into larger deals",
                "VIP artist tour hospitality access and direct relationships with top artist teams"
            ],
            "is_popular": False,
            "cta": "Inquire Institutional Desk"
        }
    ]
}


def seed_default_role_tiers_if_empty():
    """Ensure standard commercial tiers exist and are synchronized in db.role_tiers for all roles."""
    try:
        updated = 0
        for role_name, tiers in DEFAULT_ROLE_TIERS.items():
            for t in tiers:
                existing = db.role_tiers.find_one({"slug": t["slug"]})
                if not existing:
                    doc = {**t, "created_at": datetime.now(timezone.utc)}
                    db.role_tiers.insert_one(doc)
                    updated += 1
                else:
                    db.role_tiers.update_one(
                        {"slug": t["slug"]},
                        {"$set": {
                            "price_usd": t["price_usd"],
                            "credits": t["credits"],
                            "name": t["name"],
                            "tier_badge": t["tier_badge"],
                            "key_metric": t["key_metric"],
                            "features": t["features"]
                        }}
                    )
                    updated += 1
        logger.info("Synchronized commercial packages in db.role_tiers")
    except Exception as e:
        logger.warning(f"Role tiers seed warning: {e}")


# Initialize seeds on import
seed_default_role_tiers_if_empty()


# ======================================================================
# Request / Response Schemas
# ======================================================================
class RoleInquiryRequest(BaseModel):
    role: str
    tier_slug: str
    contact_name: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    organization_name: Optional[str] = None
    tier_name: Optional[str] = None
    estimated_budget: Optional[str] = None
    target_region: Optional[str] = "East Africa / Global"
    target_genre: Optional[str] = None
    catalog_or_audience_size: Optional[str] = None
    notes: Optional[str] = None


# Helper to normalize role aliases
def normalize_role(role_raw: str) -> str:
    r = (role_raw or "").strip().lower()
    if r in ("studio", "supervisors", "supervisor"):
        return "supervisor"
    if r in ("labels", "label"):
        return "label"
    if r in ("media", "media_house", "broadcaster"):
        return "media_house"
    if r in ("djs", "dj"):
        return "dj"
    if r in ("listeners", "listener", "consumer"):
        return "consumer"
    if r in ("creators", "creator", "artist"):
        return "creator"
    if r in ("corporate", "brands", "brand"):
        return "corporate"
    if r in ("podcaster", "podcasters", "podcast", "podcasts"):
        return "podcaster"
    if r in ("vc", "vcs", "investor", "investors", "capital"):
        return "vc"
    return r


# ======================================================================
# API Endpoints
# ======================================================================
@router.get("/api/roles/packages")
def get_all_role_packages(role: Optional[str] = None):
    """Retrieve commercial plans and packages for one or all personas."""
    norm = normalize_role(role) if role else None
    query = {"role": norm} if norm else {}
    
    docs = list(db.role_tiers.find(query).sort("price_usd", 1))
    if not docs:
        seed_default_role_tiers_if_empty()
        docs = list(db.role_tiers.find(query).sort("price_usd", 1))

    # If mongo returns empty or fallback needed
    if not docs and norm in DEFAULT_ROLE_TIERS:
        return DEFAULT_ROLE_TIERS[norm]

    res = []
    for d in docs:
        d["_id"] = str(d["_id"])
        res.append(d)
    return res


@router.get("/api/roles/{role}/packages")
def get_role_packages(role: str):
    """Retrieve established commercial packages for a specific role."""
    norm = normalize_role(role)
    docs = list(db.role_tiers.find({"role": norm}).sort("price_usd", 1))
    if not docs:
        seed_default_role_tiers_if_empty()
        docs = list(db.role_tiers.find({"role": norm}).sort("price_usd", 1))
    
    if not docs and norm in DEFAULT_ROLE_TIERS:
        return DEFAULT_ROLE_TIERS[norm]

    res = []
    for d in docs:
        d["_id"] = str(d["_id"])
        res.append(d)
    return res


# Persona-specific alias GET endpoints
@router.get("/api/creator/packages")
def get_creator_packages():
    return get_role_packages("creator")


@router.get("/api/label/packages")
def get_label_packages():
    return get_role_packages("label")


@router.get("/api/supervisor/packages")
def get_supervisor_packages():
    return get_role_packages("supervisor")


@router.get("/api/dj/packages")
def get_dj_packages():
    return get_role_packages("dj")


@router.get("/api/media/packages")
def get_media_packages():
    return get_role_packages("media_house")


@router.get("/api/consumer/packages")
def get_consumer_packages():
    return get_role_packages("consumer")


@router.get("/api/podcaster/packages")
def get_podcaster_packages():
    return get_role_packages("podcaster")


@router.get("/api/vc/packages")
def get_vc_packages():
    return get_role_packages("vc")


@router.post("/api/roles/inquiries")
@router.post("/api/roles/{role}/inquiries")
@router.post("/api/roles/{role}/inquire")
def submit_role_inquiry(
    payload: RoleInquiryRequest, 
    request: Request,
    role: Optional[str] = None
):
    """Register an inbound plan reservation or commercial inquiry."""
    current_user = get_optional_user(request)
    norm_role = normalize_role(role or payload.role)

    if not payload.contact_name.strip() or not payload.contact_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact name and valid email are required"
        )

    # Prefix mapping for reference codes
    prefix_map = {
        "creator": "CR",
        "label": "LB",
        "supervisor": "SV",
        "dj": "DJ",
        "media_house": "MD",
        "consumer": "CS",
        "corporate": "AD"
    }
    pfx = prefix_map.get(norm_role, "TM")
    ref_code = f"TM-{pfx}-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}"

    user_id = str(current_user["_id"]) if current_user else None

    # Fetch tier title if not supplied
    tier_name = payload.tier_name
    if not tier_name:
        t_doc = db.role_tiers.find_one({"role": norm_role, "slug": payload.tier_slug})
        if t_doc:
            tier_name = t_doc.get("name")
        else:
            tier_name = payload.tier_slug.replace("-", " ").title()

    inquiry_doc = {
        "reference_code": ref_code,
        "role": norm_role,
        "organization_name": payload.organization_name.strip() if payload.organization_name else None,
        "contact_name": payload.contact_name.strip(),
        "contact_email": str(payload.contact_email).lower(),
        "contact_phone": payload.contact_phone.strip() if payload.contact_phone else None,
        "user_id": user_id,
        "tier_slug": payload.tier_slug,
        "tier_name": tier_name,
        "estimated_budget": payload.estimated_budget,
        "target_region": payload.target_region,
        "target_genre": payload.target_genre,
        "catalog_or_audience_size": payload.catalog_or_audience_size,
        "notes": payload.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }

    res = db.role_inquiries.insert_one(inquiry_doc)
    inquiry_id = str(res.inserted_id)

    # Automatically route to Intermaven Smart CRM leads collection
    try:
        crm_lead = {
            "name": payload.contact_name.strip(),
            "brand_name": payload.organization_name or payload.contact_name.strip(),
            "email": str(payload.contact_email).lower(),
            "phone": payload.contact_phone or "",
            "channel": f"{norm_role}-plan-inquiry",
            "creator_username": f"{norm_role}_desk",
            "notes": (
                f"Role: {norm_role.upper()} | Plan: {tier_name} ({payload.tier_slug}) | "
                f"Budget: {payload.estimated_budget or 'Standard'} | "
                f"Ref: {ref_code} | Notes: {payload.notes or 'None'}"
            ),
            "status": "new",
            "source": f"tunemavens.com/#/for/{norm_role}",
            "created_at": datetime.now(timezone.utc)
        }
        db.crm_leads.insert_one(crm_lead)
        logger.info(f"Routed {norm_role.upper()} lead {payload.contact_name} ({ref_code}) to Smart CRM")
    except Exception as e:
        logger.warning(f"CRM lead routing warning: {e}")

    return {
        "success": True,
        "reference_code": ref_code,
        "inquiry_id": inquiry_id,
        "message": f"Your {norm_role.replace('_', ' ').title()} reservation has been logged. An Intermaven representative will contact you within 24 hours.",
        "details": {
            "role": norm_role,
            "tier_slug": payload.tier_slug,
            "tier_name": tier_name,
            "reference_code": ref_code
        }
    }


# Persona-specific alias POST endpoints
@router.post("/api/creator/inquiries")
def submit_creator_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="creator")


@router.post("/api/label/inquiries")
def submit_label_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="label")


@router.post("/api/supervisor/inquiries")
def submit_supervisor_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="supervisor")


@router.post("/api/dj/inquiries")
def submit_dj_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="dj")


@router.post("/api/media/inquiries")
def submit_media_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="media_house")


@router.post("/api/consumer/inquiries")
def submit_consumer_inquiry(payload: RoleInquiryRequest, request: Request):
    return submit_role_inquiry(payload, request, role="consumer")


# ======================================================================
# Scoped User Inquiries & Workspace Telemetry
# ======================================================================
@router.get("/api/roles/my-inquiries")
def list_my_inquiries(request: Request, role: Optional[str] = None):
    """Retrieve logged-in user's role plan inquiries.
    Enforces user-specific scoping: non-admins only see their own inquiries.
    """
    current_user = get_optional_user(request)
    query: Dict[str, Any] = {}

    if current_user:
        is_admin = current_user.get("role") == "admin"
        if not is_admin:
            user_id_str = str(current_user["_id"])
            user_email = str(current_user.get("email", "")).lower()
            query["$or"] = [{"user_id": user_id_str}, {"contact_email": user_email}]
        elif role:
            query["role"] = normalize_role(role)
    else:
        # Unauthenticated calls cannot browse global inquiries
        return []

    docs = list(db.role_inquiries.find(query).sort("created_at", -1))
    for d in docs:
        d["_id"] = str(d["_id"])
    return docs


@router.get("/api/roles/{role}/my-workspace")
def get_user_role_workspace(role: str, request: Request):
    """User-specific workspace state for the requested persona.
    Returns authorized apps, tier subscription status, and active inquiries.
    """
    current_user = get_optional_user(request)
    norm_role = normalize_role(role)

    # Role permission mappings
    ROLE_AUTHORIZED_APPS = {
        "creator": [
            "epk-builder", "catalog-porting", "split-cascade", 
            "publishing-election", "distribution-election", "djpool", 
            "sync-marketplace", "escrow-contracts", "tunemavens-library", 
            "tunemavens-tips", "tunepay-inventory", "tunepay-settlement", 
            "intermaven-social-ai", "intermaven-smart-crm"
        ],
        "label": [
            "catalog-porting", "split-cascade", "publishing-election", 
            "distribution-election", "sync-marketplace", "tunepay-inventory", 
            "tunepay-settlement", "tunepay-devices", "intermaven-smart-crm", 
            "intermaven-social-ai"
        ],
        "supervisor": [
            "sync-marketplace", "escrow-contracts", "intermaven-smart-crm", 
            "intermaven-social-ai"
        ],
        "dj": [
            "djpool", "tunemavens-library", "tunemavens-tips", 
            "intermaven-smart-crm", "intermaven-social-ai"
        ],
        "media_house": [
            "corporate-ads", "sync-marketplace", "intermaven-smart-crm", 
            "intermaven-social-ai"
        ],
        "consumer": [
            "tunemavens-library", "tunemavens-tips"
        ],
        "corporate": [
            "corporate-ads", "sync-marketplace", "intermaven-smart-crm", 
            "intermaven-social-ai"
        ],
        "admin": [
            "all"
        ]
    }

    authorized_apps = ROLE_AUTHORIZED_APPS.get(norm_role, ROLE_AUTHORIZED_APPS["creator"])

    # If authenticated, get user inquiries and active apps
    user_inquiries = []
    user_active_apps = []
    if current_user:
        user_id_str = str(current_user["_id"])
        user_email = str(current_user.get("email", "")).lower()
        user_inquiries = list(db.role_inquiries.find({
            "role": norm_role,
            "$or": [{"user_id": user_id_str}, {"contact_email": user_email}]
        }).sort("created_at", -1))
        for d in user_inquiries:
            d["_id"] = str(d["_id"])
        user_active_apps = current_user.get("apps", [])

    return {
        "role": norm_role,
        "user_authenticated": bool(current_user),
        "user_role": current_user.get("role") if current_user else None,
        "authorized_apps": authorized_apps,
        "user_active_apps": user_active_apps,
        "inquiries_count": len(user_inquiries),
        "recent_inquiries": user_inquiries[:5],
        "status": "ready"
    }
