"""Community & Wall of Fame Router (Phase 5.5).

Implements Wall of Fame curated figures, YouTube Data API v3 live metrics,
admin nomination & invite dispatching, and consent-gated claim verification.
"""
import logging
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr, Field

from auth import get_current_user, get_optional_user
from config import db
from models import ActivityEvent, FeaturedProfile
from services.youtube_service import youtube_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["community-wall-of-fame"])


# ======================================================================
# Request / Response Models
# ======================================================================
class CreateFeaturedProfileRequest(BaseModel):
    subject_name: str
    role: str = "creator"  # 'creator' | 'producer' | 'supervisor' | 'label' | 'dj' | 'exec' | 'vc'
    subject_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    media_type: str = "video"  # 'video' | 'image'
    image_url: Optional[str] = None
    youtube_channel_handle: Optional[str] = None
    youtube_video_id: Optional[str] = None
    bio: str
    social_links: Dict[str, str] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    has_epk: bool = False
    epk_slug: Optional[str] = None
    pre_claim: bool = False  # If true (for seed figures), immediately sets state to claimed and visible


class InviteRequest(BaseModel):
    subject_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    custom_note: Optional[str] = None
    send_email_invite: bool = True
    send_whatsapp_invite: bool = True
    sync_crm: bool = True


class InviteEpkRequest(BaseModel):
    subject_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    custom_note: Optional[str] = None
    send_email: bool = True
    send_inbox: bool = True
    send_whatsapp: bool = True


class UpdateFeaturedProfileRequest(BaseModel):
    subject_name: Optional[str] = None
    role: Optional[str] = None
    subject_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    media_type: Optional[str] = None
    image_url: Optional[str] = None
    bio: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    tags: Optional[List[str]] = None
    visible: Optional[bool] = None
    has_epk: Optional[bool] = None
    epk_slug: Optional[str] = None
    youtube_channel_handle: Optional[str] = None
    youtube_video_id: Optional[str] = None


class ClaimProfileRequest(BaseModel):
    password: Optional[str] = None
    interests: List[str] = Field(default_factory=list)
    display_name: Optional[str] = None
    bio: Optional[str] = None


# ======================================================================
# Seed Data: Iconic Figures to Inaugurate the Wall of Fame
# ======================================================================
SEED_WALL_OF_FAME = [
    {
        "subject_name": "Rick Rubin",
        "role": "producer",
        "subject_email": "rubin@shangrila.com",
        "youtube_channel_handle": "@TetragrammatonWithRickRubin",
        "youtube_video_id": "v=dQw4w9WgXcQ",
        "youtube_video_title": "The Creative Act: A Way of Being — Studio Reflections",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "3.4M views",
        "bio": "Legendary producer, Def Jam co-founder, and author. Inducted for redefining modern minimalism across hip-hop, metal, and acoustic realms.",
        "social_links": {"website": "https://tetragrammaton.com", "instagram": "rickrubin", "youtube": "@TetragrammatonWithRickRubin"},
        "has_epk": False,
        "state": "claimed",
        "visible": True,
        "tags": ["Production", "Legend", "Def Jam", "Creative Act"],
    },
    {
        "subject_name": "Sarz",
        "role": "producer",
        "subject_email": "sarz@1789ent.com",
        "youtube_channel_handle": "@SarzOnTheBeat",
        "youtube_video_id": "v=ForBiggerBlazes",
        "youtube_video_title": "Afrobeats to the World: Masterclass on Rhythmic Alchemy",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "1.8M views",
        "bio": "Pioneer of contemporary Nigerian Afrobeats and Amapiano fusions. Architect behind global anthems with Wizkid, Drake, and Burna Boy.",
        "social_links": {"twitter": "only1sarz", "instagram": "only1sarz", "spotify": "https://open.spotify.com/artist/sarz"},
        "has_epk": True,
        "epk_slug": "sarz",
        "state": "claimed",
        "visible": True,
        "tags": ["Afrobeats", "Amapiano", "Masterclass", "1789"],
    },
    {
        "subject_name": "Sarah Jenkins",
        "role": "supervisor",
        "subject_email": "sarah.jenkins@a24films.com",
        "youtube_channel_handle": "@SarahJenkinsSync",
        "youtube_video_id": "v=showcase_2",
        "youtube_video_title": "How We Cleared Sync Tracks for HBO & A24 Features",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "420K views",
        "bio": "Lead Music Supervisor for international award-winning cinema and streaming series. Fierce advocate for direct, transparent 90/10 sync licensing splits.",
        "social_links": {"linkedin": "sarah-jenkins-sync", "website": "https://syncmavens.com"},
        "has_epk": False,
        "state": "claimed",
        "visible": True,
        "tags": ["Sync Licensing", "Music Supervisor", "Film & TV", "A24"],
    },
    {
        "subject_name": "Mutoriah",
        "role": "creator",
        "subject_email": "mutoriah@nairobibass.ke",
        "youtube_channel_handle": "@MutoriahOfficial",
        "youtube_video_id": "v=showcase_1",
        "youtube_video_title": "Nairobi Sunset Odyssey — Live Analog Session",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "910K views",
        "bio": "Kenyan multi-instrumentalist, electronic visionary, and sound designer melding Benga heritage with modular synthesis.",
        "social_links": {"youtube": "@MutoriahOfficial", "instagram": "mutoriah_music", "spotify": "https://open.spotify.com/artist/mutoriah"},
        "has_epk": True,
        "epk_slug": "mutoriah",
        "state": "claimed",
        "visible": True,
        "tags": ["Kenyan Sound", "Electronic", "Benga", "Modular"],
    },
    {
        "subject_name": "Black Coffee",
        "role": "dj",
        "subject_email": "mgmt@soulistic.co.za",
        "media_type": "image",
        "image_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        "youtube_channel_handle": "@RealBlackCoffee",
        "youtube_video_id": "v=bc_showcase_1",
        "youtube_video_title": "Deep Afro-House Masterclass: The Architecture of Resonance",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        "youtube_views_formatted": "5.2M views",
        "bio": "Grammy-winning pioneer of contemporary African deep house. Headline resident across Ibiza, Brooklyn Mirage, and global festival circuits.",
        "social_links": {"instagram": "realblackcoffee", "twitter": "RealBlackCoffee", "spotify": "https://open.spotify.com/artist/blackcoffee"},
        "has_epk": True,
        "epk_slug": "black-coffee",
        "state": "claimed",
        "visible": True,
        "tags": ["Afro-House", "Grammy Winner", "DJ Pool", "Soulistic"],
    },
    {
        "subject_name": "Don Jazzy",
        "role": "label",
        "subject_email": "jazzy@mavinrecords.com",
        "youtube_channel_handle": "@MavinRecordsOfficial",
        "youtube_video_id": "v=mavin_all_stars",
        "youtube_video_title": "Building a Global Music Dynasty: The Mavin Blueprint",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "7.8M views",
        "bio": "Founder & CEO of Mavin Records. Architect of modern West African pop commercialization and premier global talent incubator.",
        "social_links": {"twitter": "donjazzy", "instagram": "donjazzy", "website": "https://mavinrecords.com"},
        "has_epk": True,
        "epk_slug": "don-jazzy",
        "state": "claimed",
        "visible": True,
        "tags": ["Record Label", "Mavin", "Talent Incubator", "A&R"],
    },
    {
        "subject_name": "Tems",
        "role": "creator",
        "subject_email": "tems@leadingvibe.com",
        "media_type": "image",
        "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "youtube_channel_handle": "@TemsBaby",
        "youtube_video_id": "v=tems_live_acoustic",
        "youtube_video_title": "Vocal Dynamics & Sonic Autonomy — Live Session",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "youtube_views_formatted": "14.5M views",
        "bio": "Oscar-nominated and Grammy-winning songwriter and sonic auteur. Master of self-produced melodic hooks and global sync placement power.",
        "social_links": {"instagram": "temsbaby", "twitter": "temsbaby", "spotify": "https://open.spotify.com/artist/tems"},
        "has_epk": True,
        "epk_slug": "tems",
        "state": "claimed",
        "visible": True,
        "tags": ["Vocalist", "Songwriter", "Grammy", "Self-Produced"],
    },
    {
        "subject_name": "Kel-P",
        "role": "producer",
        "subject_email": "kelp@vibesway.com",
        "youtube_channel_handle": "@KelPVibes",
        "youtube_video_id": "v=kelp_studio",
        "youtube_video_title": "Deconstructing the African Giant Rhythmic Foundation",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "2.1M views",
        "bio": "Multi-platinum Grammy-nominated producer. Signature sonic architect behind historic international crossover projects.",
        "social_links": {"instagram": "kelpvibes", "twitter": "kelp_vibes"},
        "state": "claimed",
        "visible": True,
        "tags": ["Afro-Fusion", "Multi-Platinum", "Master Producer"],
    },
    {
        "subject_name": "DJ Maphorisa",
        "role": "dj",
        "subject_email": "maphorisa@newmoneysteeze.co.za",
        "youtube_channel_handle": "@MadumaneOfficial",
        "youtube_video_id": "v=maphorisa_set",
        "youtube_video_title": "The Evolution of Amapiano: From Pretoria to the World",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "4.9M views",
        "bio": "The heavyweight champion of southern African dance culture and visionary architect behind the worldwide Amapiano movement.",
        "social_links": {"twitter": "DjMaphorisa", "instagram": "djmaphorisa"},
        "state": "claimed",
        "visible": True,
        "tags": ["Amapiano", "Pretoria", "DJ Icon", "Scorpion Kings"],
    },
    {
        "subject_name": "Sauti Sol",
        "role": "creator",
        "subject_email": "mgmt@sautisol.com",
        "youtube_channel_handle": "@SautiSol",
        "youtube_video_id": "v=sautisol_live",
        "youtube_video_title": "Midnight Train Orchestral Session — Nairobi Stage",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "8.7M views",
        "bio": "Iconic East African polyphonic afro-pop group, songwriters, and tour trailblazers. Pioneered sovereign East African live performance touring models.",
        "social_links": {"youtube": "SautiSol", "instagram": "sautisol", "spotify": "https://open.spotify.com/artist/4DA7Zz1H0Q1b9vBvL0mP4T"},
        "has_epk": True,
        "epk_slug": "sauti-sol",
        "state": "claimed",
        "visible": True,
        "tags": ["Afro-Pop", "Live Touring", "Harmony", "East Africa"],
    },
    {
        "subject_name": "Audrey Chon",
        "role": "supervisor",
        "subject_email": "audrey@apexsync.com",
        "media_type": "image",
        "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        "youtube_channel_handle": "@AudreyChonSync",
        "youtube_video_id": "v=sync_master_briefs",
        "youtube_video_title": "Licensing World Percussion for Global Triple-A Gaming",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        "youtube_views_formatted": "380K views",
        "bio": "Lead sync music coordinator for cinematic game scores and interactive experiences. Avid commissioner of pre-cleared indigenous rhythms.",
        "social_links": {"linkedin": "audreychon", "website": "https://syncmavens.com"},
        "state": "claimed",
        "visible": True,
        "tags": ["Gaming Sync", "Triple-A", "Pre-Cleared Stems"],
    },
    {
        "subject_name": "Major League DJz",
        "role": "dj",
        "subject_email": "twins@balconyrecords.com",
        "youtube_channel_handle": "@MajorLeagueDJz",
        "youtube_video_id": "v=balcony_mix_live",
        "youtube_video_title": "Amapiano Balcony Mix Live (London Edition)",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "6.3M views",
        "bio": "Twin DJ dynamos and cultural ambassadors whose live Balcony Mix series transformed diaspora dancefloors across five continents.",
        "social_links": {"instagram": "majorleaguedjz", "youtube": "MajorLeagueDJz"},
        "state": "claimed",
        "visible": True,
        "tags": ["Balcony Mix", "DJ Duo", "Amapiano", "Diaspora"],
    },
    {
        "subject_name": "Mick Schultz",
        "role": "producer",
        "subject_email": "mick@schultzsound.com",
        "youtube_channel_handle": "@MickSchultzAudio",
        "youtube_video_id": "v=mick_sync_breakdown",
        "youtube_video_title": "Hybrid Drum Layering for Commercial Television & Radio",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "510K views",
        "bio": "Billboard-charting producer and arranger. Known for tight punchy drum design and multi-platinum sync compositions.",
        "social_links": {"twitter": "mick_schultz", "instagram": "mickschultz"},
        "state": "claimed",
        "visible": True,
        "tags": ["Drums", "Billboard", "Commercial Sync", "Mastering"],
    },
    {
        "subject_name": "David Ochieng",
        "role": "vc",
        "subject_email": "david@safarisoundcapital.com",
        "youtube_channel_handle": "@SafariSoundCapital",
        "youtube_video_id": "v=tour_vc_underwriting",
        "youtube_video_title": "Tour Venture Capital & Non-Dilutive Artist Financing",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "290K views",
        "bio": "Managing Partner at Safari Sound Capital. Underwrites stadium tours, live masterclasses, and advance catalog recoupment facilities.",
        "social_links": {"linkedin": "davidochieng-vc", "website": "https://tunemavens.com/tour-capital"},
        "state": "claimed",
        "visible": True,
        "tags": ["Tour Financing", "Venture Capital", "Recoupment", "Stadiums"],
    },
    {
        "subject_name": "Blitz Bazawule",
        "role": "creator",
        "subject_email": "blitz@thecolorpurple.com",
        "media_type": "image",
        "image_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
        "youtube_channel_handle": "@BlitzAmbassador",
        "youtube_video_id": "v=blitz_creative_odyssey",
        "youtube_video_title": "Directing Sound: From Hip-Hop MC to Hollywood Director",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
        "youtube_views_formatted": "1.4M views",
        "bio": "Ghanaian polymath, filmmaker, composer, and author. Director of The Color Purple and Black Is King. Pioneer of modern African magic realism.",
        "social_links": {"instagram": "blitzambassador", "twitter": "BlitzAmbassador"},
        "state": "claimed",
        "visible": True,
        "tags": ["Director", "Composer", "Magic Realism", "Hollywood"],
    }
]


def seed_wall_of_fame_if_empty():
    """Seed initial Wall of Fame luminaries if empty or below standard roster and ensure EPK and media_type sync."""
    now = datetime.now(timezone.utc)
    for item in SEED_WALL_OF_FAME:
        existing = db.featured_profiles.find_one({"subject_name": item["subject_name"]})
        if not existing:
            doc = item.copy()
            doc["created_at"] = now
            doc["updated_at"] = now
            db.featured_profiles.insert_one(doc)
        else:
            set_fields = {}
            if "media_type" in item:
                set_fields["media_type"] = item["media_type"]
            if "image_url" in item:
                set_fields["image_url"] = item["image_url"]
            if item.get("has_epk") and not existing.get("has_epk"):
                set_fields["has_epk"] = item.get("has_epk", False)
                set_fields["epk_slug"] = item.get("epk_slug")
            if "social_links" in item and not existing.get("social_links"):
                set_fields["social_links"] = item["social_links"]
            if set_fields:
                db.featured_profiles.update_one(
                    {"_id": existing["_id"]},
                    {"$set": set_fields}
                )


# ======================================================================
# Public Endpoints (§9.11.4 & §9.11.5)
# ======================================================================
@router.get("/community/wall-of-fame")
def get_wall_of_fame(
    role: Optional[str] = Query(None, description="Filter by role: creator, producer, supervisor, label, dj"),
    search: Optional[str] = Query(None, description="Search by name or bio keyword")
):
    """Returns curated grid of featured figures with visible == True (claimed)."""
    seed_wall_of_fame_if_empty()

    query = {"visible": True}
    if role:
        query["role"] = role
    if search:
        query["$or"] = [
            {"subject_name": {"$regex": search, "$options": "i"}},
            {"bio": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]

    cursor = db.featured_profiles.find(query).sort("created_at", -1)
    results = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        # Ensure likes count is attached
        doc["likes_count"] = db.likes.count_documents({
            "target_kind": "featured_profile",
            "target_id": doc["id"]
        })
        results.append(doc)

    return {
        "profiles": results,
        "count": len(results),
    }


# ======================================================================
# Claim Flow Endpoints (§9.11.3)
# ======================================================================
@router.get("/community/wall-of-fame/claim/{token}")
def inspect_claim_token(token: str):
    """Verify claim token validity and retrieve invited profile details."""
    profile = db.featured_profiles.find_one({"claim_token": token})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired Wall of Fame invitation token."
        )

    if profile.get("state") == "claimed":
        return {
            "status": "already_claimed",
            "message": "This Wall of Fame profile has already been claimed.",
            "subject_name": profile.get("subject_name"),
            "role": profile.get("role"),
        }

    return {
        "status": "valid",
        "id": str(profile["_id"]),
        "subject_name": profile.get("subject_name"),
        "role": profile.get("role"),
        "bio": profile.get("bio"),
        "subject_email": profile.get("subject_email"),
        "channel_handle": profile.get("youtube_channel_handle"),
        "youtube_video_title": profile.get("youtube_video_title"),
        "youtube_thumbnail_url": profile.get("youtube_thumbnail_url"),
    }


@router.post("/community/wall-of-fame/claim/{token}")
def execute_claim_profile(
    token: str,
    payload: ClaimProfileRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Claim a Wall of Fame profile, linking it to an account and making it public."""
    profile = db.featured_profiles.find_one({"claim_token": token})
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid or expired Wall of Fame invitation token."
        )

    if profile.get("state") == "claimed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This profile has already been claimed."
        )

    # Determine user identity
    user_id = None
    if current_user:
        user_id = str(current_user["_id"])
    else:
        # Check if an existing account matches invited email or create free account
        invited_email = profile.get("subject_email")
        if invited_email:
            existing_user = db.users.find_one({"email": invited_email})
            if existing_user:
                user_id = str(existing_user["_id"])

        if not user_id:
            # Create a free creator profile for the claimed legend
            new_user = {
                "email": invited_email or f"{token[:8]}@claim.tunemavens.com",
                "name": payload.display_name or profile.get("subject_name"),
                "role": profile.get("role", "creator"),
                "roles": [profile.get("role", "creator")],
                "pro_verified": True,  # Wall of Fame honorees receive verified status automatically!
                "bio": payload.bio or profile.get("bio"),
                "plan": "starter",
                "credits": 1000,
                "created_at": datetime.now(timezone.utc),
            }
            res = db.users.insert_one(new_user)
            user_id = str(res.inserted_id)

    # Transition state to claimed and visible
    now = datetime.now(timezone.utc)
    update_data = {
        "state": "claimed",
        "visible": True,
        "claimed_user_id": user_id,
        "claimed_at": now,
        "updated_at": now,
    }
    if payload.bio:
        update_data["bio"] = payload.bio

    db.featured_profiles.update_one({"_id": profile["_id"]}, {"$set": update_data})

    # Sync Smart CRM lead status to inducted
    try:
        db.crm_leads.update_one(
            {"$or": [{"claim_token": token}, {"email": profile.get("subject_email")}]},
            {"$set": {
                "status": "inducted",
                "claimed_user_id": str(user_id),
                "claimed_at": now,
                "updated_at": now,
            }}
        )
    except Exception as crm_err:
        logger.warning(f"Error updating CRM lead on claim: {crm_err}")

    # Deliver onboarding welcome to User Personal Inbox
    try:
        db.user_inbox.insert_one({
            "user_id": str(user_id),
            "campaign_id": "wall_of_fame_induction",
            "campaign_name": "TuneMavens Official Induction",
            "subject": f"Welcome to the Wall of Fame & Creator Community, {profile.get('subject_name')}!",
            "body": f"Congratulations! Your profile is now live on the TuneMavens Wall of Fame. Your verified badge, collaborative feeds, and direct ecosystem opportunities are now active.",
            "read": False,
            "created_at": now,
        })
    except Exception as inbox_err:
        logger.warning(f"Error inserting user inbox welcome: {inbox_err}")

    # Log milestone activity event into social graph
    event = ActivityEvent(
        user_id=str(user_id),
        kind="wall_of_fame_featured",
        target_id=str(profile["_id"]),
        target_name=f"{profile.get('subject_name')} inducted to Wall of Fame",
        actor_name=profile.get("subject_name"),
        actor_role=profile.get("role", "creator"),
        metadata={"role": profile.get("role"), "icon": "trophy"},
        visibility="public",
        created_at=now,
    )
    db.activity_events.insert_one(event.to_mongo())

    return {
        "status": "success",
        "message": f"Congratulations! {profile.get('subject_name')} is now publicly inducted onto the Wall of Fame.",
        "user_id": user_id,
        "redirect": "/community",
    }


# ======================================================================
# Admin Management Endpoints (§9.11.5)
# ======================================================================
@router.get("/admin/wall-of-fame")
def list_admin_wall_of_fame(current_user: dict = Depends(get_current_user)):
    """Admin endpoint returning all featured profiles across all states."""
    seed_wall_of_fame_if_empty()

    cursor = db.featured_profiles.find().sort("created_at", -1)
    profiles = []
    stats = {"total": 0, "claimed": 0, "invited": 0, "pending": 0}

    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        state = doc.get("state", "pending")
        stats["total"] += 1
        stats[state] = stats.get(state, 0) + 1
        profiles.append(doc)

    return {
        "profiles": profiles,
        "stats": stats,
    }


@router.post("/admin/wall-of-fame")
def create_admin_wall_of_fame(
    payload: CreateFeaturedProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    """Admin composer: nominate an industry figure, auto-fetching YouTube metadata."""
    now = datetime.now(timezone.utc)
    admin_id = str(current_user["_id"])

    # Auto-fetch YouTube metadata if handle or video ID is supplied
    video_id = payload.youtube_video_id
    video_title = None
    thumb_url = None
    views_formatted = None

    if video_id:
        v_stats = youtube_service.get_video_stats(video_id)
        video_id = v_stats.get("video_id")
        video_title = v_stats.get("title")
        thumb_url = v_stats.get("thumbnail_url")
        views_formatted = v_stats.get("views_formatted")
    elif payload.youtube_channel_handle:
        c_stats = youtube_service.get_channel_metrics(payload.youtube_channel_handle.replace("@", ""))
        thumb_url = c_stats.get("thumbnail_url")
        feat = c_stats.get("featured_videos", [])
        if feat:
            video_id = feat[0].get("video_id")
            video_title = feat[0].get("title")
            views_formatted = feat[0].get("views")

    state = "claimed" if payload.pre_claim else "pending"
    visible = True if payload.pre_claim else False

    profile = FeaturedProfile(
        subject_name=payload.subject_name,
        role=payload.role,
        subject_email=payload.subject_email,
        phone=payload.phone,
        media_type=payload.media_type or "video",
        image_url=payload.image_url,
        youtube_channel_handle=payload.youtube_channel_handle,
        youtube_video_id=video_id,
        youtube_video_title=video_title,
        youtube_thumbnail_url=thumb_url,
        youtube_views_formatted=views_formatted,
        bio=payload.bio,
        social_links=payload.social_links,
        tags=payload.tags,
        state=state,
        visible=visible,
        created_by_admin_id=admin_id,
        created_at=now,
        updated_at=now,
    )

    doc = profile.to_mongo()
    res = db.featured_profiles.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)

    # Automatically register into Smart CRM as a new Wall of Fame candidate lead
    if payload.subject_email or payload.phone:
        try:
            lead_doc = {
                "name": payload.subject_name.strip(),
                "email": (payload.subject_email or "").strip().lower(),
                "phone": payload.phone,
                "inquiry_type": "wall_of_fame_induction",
                "message": f"Candidate nominated for TuneMavens Wall of Fame ({payload.role.upper()}).",
                "role": payload.role,
                "status": "nominated" if not payload.pre_claim else "inducted",
                "source": "wall_of_fame_curator",
                "tags": ["wall_of_fame", "icon_nominee", payload.role],
                "interests": ["wall_of_fame", "community_member", payload.role],
                "featured_profile_id": doc["id"],
                "created_at": now,
                "updated_at": now,
            }
            db.crm_leads.update_one(
                {"email": lead_doc["email"]} if lead_doc["email"] else {"featured_profile_id": doc["id"]},
                {"$set": lead_doc},
                upsert=True
            )
        except Exception as crm_err:
            logger.warning(f"Error registering lead in Smart CRM: {crm_err}")

    return doc


@router.post("/admin/wall-of-fame/{profile_id}/invite")
def send_admin_wall_of_fame_invite(
    profile_id: str,
    payload: InviteRequest = None,
    current_user: dict = Depends(get_current_user)
):
    """Dispatches official Wall of Fame induction invitation across Communication Protocols & Smart CRM."""
    from account_setup import send_email, _email_wrapper
    from services.whatsapp_service import send_whatsapp

    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    recipient_email = (payload.subject_email if payload and payload.subject_email else profile.get("subject_email"))
    recipient_phone = (payload.phone if payload and payload.phone else profile.get("phone"))
    custom_note = (payload.custom_note if payload and payload.custom_note else "")
    send_email_flag = payload.send_email_invite if payload else True
    send_whatsapp_flag = payload.send_whatsapp_invite if payload else True
    sync_crm_flag = payload.sync_crm if payload else True

    claim_token = secrets.token_urlsafe(24)
    now = datetime.now(timezone.utc)

    # Update featured profile record
    update_fields = {
        "claim_token": claim_token,
        "state": "invited",
        "invited_at": now,
        "updated_at": now,
    }
    if recipient_email:
        update_fields["subject_email"] = recipient_email
    if recipient_phone:
        update_fields["phone"] = recipient_phone

    db.featured_profiles.update_one({"_id": profile["_id"]}, {"$set": update_fields})

    claim_url = f"https://tunemavens.com/#/wall-of-fame/claim/{claim_token}"
    role_display = profile.get("role", "creator").upper()
    subject_name = profile.get("subject_name", "Featured Personality")

    email_status = "skipped"
    comm_id = None

    # 1. Dispatch via Ecosystem Communication Protocols (Email / Resend + Communications Vault)
    if recipient_email and send_email_flag:
        email_subject = f"🏆 Official TuneMavens Wall of Fame Induction: {subject_name}"
        note_markup = f"""
        <div style="background: rgba(134, 59, 255, 0.08); border-left: 3px solid #863bff; padding: 12px 16px; margin: 16px 0; border-radius: 2px;">
            <p style="margin: 0; font-size: 13px; color: #e2e8f0; font-style: italic;">"{custom_note}"</p>
            <span style="display:block; margin-top: 6px; font-size: 11px; color: #94a3b8; font-weight: 600;">— TuneMavens Curatorial Committee</span>
        </div>
        """ if custom_note else ""

        inner_html = f"""
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 4px 12px; background: rgba(134, 59, 255, 0.15); border: 1px solid rgba(134, 59, 255, 0.4); color: #c084fc; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 3px; margin-bottom: 12px;">Official TuneMavens Induction</div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.02em;">You Have Been Inducted to the Wall of Fame</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Celebrating elite craft, leadership, and cultural impact across music.</p>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 3px; padding: 22px; margin-bottom: 24px;">
            <p style="color: #f8fafc; font-size: 15px; margin: 0 0 12px 0;">Dear <strong>{subject_name}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 14px 0;">
                The TuneMavens editorial and curatorial board has officially recognized your distinction in the role of <strong>{role_display}</strong>. A premier profile has been reserved in your honor on the official <strong>Wall of Fame</strong>.
            </p>
            {note_markup}
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
                Claiming your induction verifies your presence across our 5-app ecosystem, provides your direct verified badge, and connects you to our high-level sync licensing and publishing networks.
            </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{claim_url}" style="display: inline-block; background: #863bff; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 3px; box-shadow: 0 4px 16px rgba(134, 59, 255, 0.35);">Accept Induction &amp; Claim Profile &rarr;</a>
        </div>
        <div style="text-align: center; color: #64748b; font-size: 11px; line-height: 1.5;">
            Direct claim verification URL:<br/>
            <a href="{claim_url}" style="color: #863bff; text-decoration: underline; word-break: break-all;">{claim_url}</a>
        </div>
        """
        full_html = _email_wrapper(inner_html, f"🏆 Official Induction: {subject_name}", profile.get("role", "creator"))
        email_status = send_email(
            to=recipient_email,
            subject=email_subject,
            html=full_html,
            text=f"Congratulations {subject_name}! You have been nominated to the TuneMavens Wall of Fame. Claim your induction here: {claim_url}",
            event_type="wall_of_fame_invitation",
            role=profile.get("role", "creator"),
            recipient_name=subject_name,
            metadata={"profile_id": str(profile["_id"]), "claim_token": claim_token, "custom_note": custom_note}
        )

    # 2. Dispatch via WhatsApp Protocol
    whatsapp_status = "skipped"
    if recipient_phone and send_whatsapp_flag:
        try:
            note_str = f"{custom_note}\n\n" if custom_note else ""
            wa_body = (
                f"🏆 *TuneMavens Wall of Fame Official Induction*\n\n"
                f"Congratulations *{subject_name}*!\n\n"
                f"The TuneMavens curatorial board has officially nominated you for induction as a recognized *{role_display}*.\n\n"
                f"{note_str}"
                f"Accept your induction & claim your verified creator credentials here:\n"
                f"{claim_url}"
            )
            send_whatsapp(
                to=recipient_phone,
                message=wa_body,
                recipient_name=subject_name,
                role=profile.get("role", "creator"),
                event_type="wall_of_fame_invitation",
                metadata={"profile_id": str(profile["_id"]), "claim_token": claim_token}
            )
            whatsapp_status = "dispatched"
        except Exception as wa_err:
            logger.warning(f"Error sending WhatsApp invitation: {wa_err}")
            whatsapp_status = f"failed: {wa_err}"

    # 3. Synchronize with Intermaven Smart CRM
    crm_lead_id = None
    if sync_crm_flag:
        try:
            lead_record = {
                "name": subject_name,
                "email": (recipient_email or "").strip().lower(),
                "phone": recipient_phone,
                "inquiry_type": "wall_of_fame_induction",
                "message": custom_note or f"Wall of Fame invite dispatched to {subject_name} ({role_display})",
                "role": profile.get("role", "creator"),
                "status": "invited",
                "source": "wall_of_fame_invitation",
                "tags": ["wall_of_fame", "icon_nominee", profile.get("role", "creator"), "invited"],
                "interests": ["wall_of_fame", "community_induction", profile.get("role", "creator")],
                "preferred_comm_method": "email" if recipient_email else "whatsapp",
                "claim_token": claim_token,
                "claim_url": claim_url,
                "featured_profile_id": str(profile["_id"]),
                "last_outreach_at": now,
                "updated_at": now,
            }
            lead_query = {"email": lead_record["email"]} if lead_record["email"] else {"featured_profile_id": str(profile["_id"])}
            crm_res = db.crm_leads.update_one(lead_query, {"$set": lead_record, "$setOnInsert": {"created_at": now}}, upsert=True)
            if crm_res.upserted_id:
                crm_lead_id = str(crm_res.upserted_id)
            else:
                existing_crm = db.crm_leads.find_one(lead_query)
                if existing_crm:
                    crm_lead_id = str(existing_crm["_id"])
        except Exception as crm_err:
            logger.warning(f"Error syncing Wall of Fame lead into Smart CRM: {crm_err}")

    # 4. Audit Log in Communications Vault
    db.communications.insert_one({
        "type": "wall_of_fame_invitation",
        "recipient_email": recipient_email,
        "recipient_phone": recipient_phone,
        "subject_name": subject_name,
        "claim_url": claim_url,
        "claim_token": claim_token,
        "status": email_status if email_status != "skipped" else "delivered",
        "channel": "email+whatsapp" if (recipient_email and recipient_phone) else ("whatsapp" if recipient_phone else "email"),
        "crm_lead_id": crm_lead_id,
        "created_at": now,
    })

    return {
        "status": "invited",
        "profile_id": str(profile["_id"]),
        "claim_token": claim_token,
        "claim_url": claim_url,
        "recipient_email": recipient_email,
        "recipient_phone": recipient_phone,
        "email_delivery": email_status,
        "whatsapp_delivery": whatsapp_status,
        "crm_lead_id": crm_lead_id,
        "message": f"Invitation protocol executed for {subject_name} across Smart CRM and Communications Vault."
    }


@router.patch("/admin/wall-of-fame/{profile_id}")
def update_admin_wall_of_fame_profile(
    profile_id: str,
    payload: UpdateFeaturedProfileRequest,
    current_user: dict = Depends(get_current_user)
):
    """Updates profile properties, role, tags, bio, or toggles visibility."""
    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    updates = {"updated_at": datetime.now(timezone.utc)}
    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            updates[field] = val

    db.featured_profiles.update_one({"_id": profile["_id"]}, {"$set": updates})

    # Sync to CRM if name/email changed
    if payload.subject_name or payload.subject_email or payload.phone:
        crm_updates = {}
        if payload.subject_name:
            crm_updates["name"] = payload.subject_name
        if payload.subject_email:
            crm_updates["email"] = payload.subject_email.strip().lower()
        if payload.phone:
            crm_updates["phone"] = payload.phone
        db.crm_leads.update_many({"featured_profile_id": str(profile["_id"])}, {"$set": crm_updates})

    refreshed = db.featured_profiles.find_one({"_id": profile["_id"]})
    refreshed["id"] = str(refreshed["_id"])
    refreshed.pop("_id", None)
    return refreshed


@router.delete("/admin/wall-of-fame/{profile_id}")
def delete_admin_wall_of_fame_profile(
    profile_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Removes a Wall of Fame profile and related metadata."""
    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db.featured_profiles.delete_one({"_id": profile["_id"]})
    db.likes.delete_many({"target_kind": "featured_profile", "target_id": str(profile["_id"])})

    return {
        "status": "deleted",
        "profile_id": str(profile["_id"]),
        "subject_name": profile.get("subject_name"),
        "message": f"Profile for {profile.get('subject_name')} successfully removed."
    }


@router.post("/admin/wall-of-fame/{profile_id}/revoke-invite")
def revoke_admin_wall_of_fame_invite(
    profile_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Revokes an outstanding invitation token and returns profile to pending state."""
    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    db.featured_profiles.update_one(
        {"_id": profile["_id"]},
        {"$set": {"claim_token": None, "state": "pending", "updated_at": datetime.now(timezone.utc)}}
    )
    db.crm_leads.update_many(
        {"featured_profile_id": str(profile["_id"])},
        {"$set": {"status": "revoked", "claim_token": None, "updated_at": datetime.now(timezone.utc)}}
    )

    return {
        "status": "revoked",
        "profile_id": str(profile["_id"]),
        "subject_name": profile.get("subject_name"),
        "message": f"Invitation token revoked for {profile.get('subject_name')}."
    }


@router.get("/admin/wall-of-fame/crm-leads")
def get_admin_wall_of_fame_crm_leads(current_user: dict = Depends(get_current_user)):
    """Returns all Smart CRM leads associated with the Wall of Fame."""
    cursor = db.crm_leads.find(
        {"$or": [{"inquiry_type": "wall_of_fame_induction"}, {"tags": "wall_of_fame"}]}
    ).sort("created_at", -1)

    leads = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        leads.append(doc)

    return {"leads": leads, "count": len(leads)}


@router.post("/admin/wall-of-fame/{profile_id}/refresh-youtube")
def refresh_admin_youtube_stats(
    profile_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Refetches YouTube metrics for a profile."""
    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    vid = profile.get("youtube_video_id")
    handle = profile.get("youtube_channel_handle")

    update_fields = {"updated_at": datetime.now(timezone.utc)}
    if vid:
        stats = youtube_service.get_video_stats(vid)
        update_fields["youtube_views_formatted"] = stats.get("views_formatted")
        if stats.get("title"):
            update_fields["youtube_video_title"] = stats.get("title")
        if stats.get("thumbnail_url"):
            update_fields["youtube_thumbnail_url"] = stats.get("thumbnail_url")
    elif handle:
        c_stats = youtube_service.get_channel_metrics(handle.replace("@", ""))
        if c_stats.get("thumbnail_url"):
            update_fields["youtube_thumbnail_url"] = c_stats.get("thumbnail_url")

    db.featured_profiles.update_one({"_id": profile["_id"]}, {"$set": update_fields})
    refreshed = db.featured_profiles.find_one({"_id": profile["_id"]})
    refreshed["id"] = str(refreshed["_id"])
    refreshed.pop("_id", None)
    return refreshed


@router.post("/community/wall-of-fame/{profile_id}/invite-epk")
def invite_luminary_to_activate_epk(
    profile_id: str,
    payload: Optional[InviteEpkRequest] = None,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Dispatches an official invitation nudging an inducted luminary to activate their TuneMavens EPK."""
    from account_setup import send_email, _email_wrapper
    from services.whatsapp_service import send_whatsapp

    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    subject_name = profile.get("subject_name", "Featured Personality")
    role_display = profile.get("role", "creator").upper()
    recipient_email = (payload.subject_email if payload and payload.subject_email else profile.get("subject_email"))
    recipient_phone = (payload.phone if payload and payload.phone else profile.get("phone"))
    custom_note = (payload.custom_note if payload and payload.custom_note else "")
    send_email_flag = payload.send_email if payload else True
    send_inbox_flag = payload.send_inbox if payload else True
    send_whatsapp_flag = payload.send_whatsapp if payload else True

    now = datetime.now(timezone.utc)
    epk_slug = profile.get("epk_slug") or profile.get("subject_name", "artist").lower().replace(" ", "")
    epk_builder_url = "https://tunemavens.com/#/epk"

    email_status = "skipped"
    inbox_status = "skipped"
    whatsapp_status = "skipped"

    # 1. User Personal Inbox Notification
    user_id = profile.get("claimed_user_id")
    if not user_id and recipient_email:
        user_match = db.users.find_one({"email": recipient_email})
        if user_match:
            user_id = str(user_match["_id"])

    if user_id and send_inbox_flag:
        try:
            inbox_note = custom_note or f"Your Wall of Fame spotlight is active! Activate your interactive EPK to showcase your discography, stems, and sync riders directly to music supervisors."
            db.user_inbox.insert_one({
                "user_id": str(user_id),
                "campaign_id": "epk_activation_invite",
                "campaign_name": "Wall of Fame EPK Activation",
                "subject": f"✨ Activate Your Official TuneMavens EPK Web World",
                "body": f"Dear {subject_name},\n\n{inbox_note}\n\nLaunch EPK Studio: {epk_builder_url}",
                "cta_url": "/epk",
                "read": False,
                "created_at": now,
            })
            inbox_status = "delivered"
        except Exception as inbox_err:
            logger.warning(f"Error inserting EPK activation user inbox note: {inbox_err}")

    # 2. Outbound Branded Email Protocol
    if recipient_email and send_email_flag:
        email_subject = f"✨ Activate Your Official TuneMavens EPK: {subject_name}"
        note_markup = f"""
        <div style="background: rgba(34, 211, 238, 0.08); border-left: 3px solid #22d3ee; padding: 12px 16px; margin: 16px 0; border-radius: 2px;">
            <p style="margin: 0; font-size: 13px; color: #e2e8f0; font-style: italic;">"{custom_note}"</p>
            <span style="display:block; margin-top: 6px; font-size: 11px; color: #94a3b8; font-weight: 600;">— TuneMavens Curation &amp; Sync Network</span>
        </div>
        """ if custom_note else ""

        inner_html = f"""
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 4px 12px; background: rgba(34, 211, 238, 0.15); border: 1px solid rgba(34, 211, 238, 0.4); color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 3px; margin-bottom: 12px;">Electronic Press Kit Activation</div>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.02em;">Activate Your Official EPK Web World</h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Your Wall of Fame induction is live. Elevate your presence with a verified 24-bit EPK.</p>
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 3px; padding: 22px; margin-bottom: 24px;">
            <p style="color: #f8fafc; font-size: 15px; margin: 0 0 12px 0;">Dear <strong>{subject_name}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 14px 0;">
                Now that you have accepted your Wall of Fame induction as a distinguished <strong>{role_display}</strong>, music supervisors, labels, and collaborators across the network can discover your work.
            </p>
            {note_markup}
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 14px 0;">
                Activating your interactive EPK grants you:
            </p>
            <ul style="color: #94a3b8; font-size: 13px; line-height: 1.6; padding-left: 20px; margin: 0 0 16px 0;">
                <li>Verified master catalog with high-fidelity streaming &amp; stems packages</li>
                <li>Pre-cleared 90/10 sync licensing rates and split metadata</li>
                <li>Live performance tech riders, press clippings, and tour booking calendar</li>
                <li>Custom vanity domain (e.g. <code>tunemavens.com/#/epk/{epk_slug}</code>)</li>
            </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{epk_builder_url}" style="display: inline-block; background: #22d3ee; color: #090d16; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 3px; box-shadow: 0 4px 16px rgba(34, 211, 238, 0.35);">Activate My EPK Now &rarr;</a>
        </div>
        """
        full_html = _email_wrapper(inner_html, f"✨ Activate Your EPK: {subject_name}", profile.get("role", "creator"))
        email_status = send_email(
            to=recipient_email,
            subject=email_subject,
            html=full_html,
            text=f"Activate your official TuneMavens EPK for {subject_name} here: {epk_builder_url}",
            event_type="epk_activation_invite",
            role=profile.get("role", "creator"),
            recipient_name=subject_name,
            metadata={"profile_id": str(profile["_id"]), "epk_slug": epk_slug}
        )

    # 3. WhatsApp Protocol
    if recipient_phone and send_whatsapp_flag:
        try:
            wa_body = (
                f"✨ *TuneMavens Official EPK Activation*\n\n"
                f"Hi *{subject_name}*!\n\n"
                f"Your Wall of Fame induction is live on TuneMavens.\n\n"
                f"You can now activate your official Electronic Press Kit (EPK) to showcase your master recordings, stems, and sync rights to music supervisors globally:\n"
                f"{epk_builder_url}"
            )
            send_whatsapp(
                to=recipient_phone,
                message=wa_body,
                recipient_name=subject_name,
                role=profile.get("role", "creator"),
                event_type="epk_activation_invite",
                metadata={"profile_id": str(profile["_id"]), "epk_slug": epk_slug}
            )
            whatsapp_status = "dispatched"
        except Exception as wa_err:
            logger.warning(f"Error sending WhatsApp EPK invite: {wa_err}")

    # 4. Smart CRM Synchronization
    try:
        db.crm_leads.update_many(
            {"$or": [{"featured_profile_id": str(profile["_id"])}, {"email": recipient_email}]},
            {
                "$addToSet": {"tags": "epk_invite_dispatched"},
                "$set": {"last_epk_outreach_at": now, "updated_at": now}
            }
        )
    except Exception as crm_err:
        logger.warning(f"Error updating CRM for EPK invite: {crm_err}")

    # 5. Profile Update & Communications Audit
    db.featured_profiles.update_one(
        {"_id": profile["_id"]},
        {
            "$set": {"epk_invite_sent_at": now},
            "$inc": {"epk_invite_count": 1}
        }
    )

    db.communications.insert_one({
        "type": "epk_activation_invite",
        "recipient_email": recipient_email,
        "recipient_phone": recipient_phone,
        "subject_name": subject_name,
        "epk_slug": epk_slug,
        "status": email_status if email_status != "skipped" else "delivered",
        "channel": "email+whatsapp" if (recipient_email and recipient_phone) else ("whatsapp" if recipient_phone else "email"),
        "created_at": now,
    })

    return {
        "status": "success",
        "profile_id": str(profile["_id"]),
        "subject_name": subject_name,
        "epk_slug": epk_slug,
        "email_delivery": email_status,
        "inbox_delivery": inbox_status,
        "whatsapp_delivery": whatsapp_status,
        "message": f"EPK activation invitation dispatched to {subject_name} across Communication Protocols & Smart CRM."
    }
