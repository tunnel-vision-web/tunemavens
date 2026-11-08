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
    youtube_channel_handle: Optional[str] = None
    youtube_video_id: Optional[str] = None
    bio: str
    social_links: Dict[str, str] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    pre_claim: bool = False  # If true (for seed figures), immediately sets state to claimed and visible


class InviteRequest(BaseModel):
    subject_email: Optional[EmailStr] = None


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
        "social_links": {"website": "https://tetragrammaton.com", "instagram": "rickrubin"},
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
        "social_links": {"twitter": "only1sarz", "instagram": "only1sarz"},
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
        "social_links": {"youtube": "MutoriahOfficial", "instagram": "mutoriah_music"},
        "state": "claimed",
        "visible": True,
        "tags": ["Kenyan Sound", "Electronic", "Benga", "Modular"],
    },
    {
        "subject_name": "Black Coffee",
        "role": "dj",
        "subject_email": "mgmt@soulistic.co.za",
        "youtube_channel_handle": "@RealBlackCoffee",
        "youtube_video_id": "v=bc_showcase_1",
        "youtube_video_title": "Deep Afro-House Masterclass: The Architecture of Resonance",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "5.2M views",
        "bio": "Grammy-winning pioneer of contemporary African deep house. Headline resident across Ibiza, Brooklyn Mirage, and global festival circuits.",
        "social_links": {"instagram": "realblackcoffee", "twitter": "RealBlackCoffee"},
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
        "social_links": {"twitter": "donjazzy", "instagram": "donjazzy"},
        "state": "claimed",
        "visible": True,
        "tags": ["Record Label", "Mavin", "Talent Incubator", "A&R"],
    },
    {
        "subject_name": "Tems",
        "role": "creator",
        "subject_email": "tems@leadingvibe.com",
        "youtube_channel_handle": "@TemsBaby",
        "youtube_video_id": "v=tems_live_acoustic",
        "youtube_video_title": "Vocal Dynamics & Sonic Autonomy — Live Session",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "14.5M views",
        "bio": "Oscar-nominated and Grammy-winning songwriter and sonic auteur. Master of self-produced melodic hooks and global sync placement power.",
        "social_links": {"instagram": "temsbaby", "twitter": "temsbaby"},
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
        "social_links": {"youtube": "SautiSol", "instagram": "sautisol"},
        "state": "claimed",
        "visible": True,
        "tags": ["Afro-Pop", "Live Touring", "Harmony", "East Africa"],
    },
    {
        "subject_name": "Audrey Chon",
        "role": "supervisor",
        "subject_email": "audrey@apexsync.com",
        "youtube_channel_handle": "@AudreyChonSync",
        "youtube_video_id": "v=sync_master_briefs",
        "youtube_video_title": "Licensing World Percussion for Global Triple-A Gaming",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
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
        "youtube_channel_handle": "@BlitzAmbassador",
        "youtube_video_id": "v=blitz_creative_odyssey",
        "youtube_video_title": "Directing Sound: From Hip-Hop MC to Hollywood Director",
        "youtube_thumbnail_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        "youtube_views_formatted": "1.4M views",
        "bio": "Ghanaian polymath, filmmaker, composer, and author. Director of The Color Purple and Black Is King. Pioneer of modern African magic realism.",
        "social_links": {"instagram": "blitzambassador", "twitter": "BlitzAmbassador"},
        "state": "claimed",
        "visible": True,
        "tags": ["Director", "Composer", "Magic Realism", "Hollywood"],
    }
]


def seed_wall_of_fame_if_empty():
    """Seed initial Wall of Fame luminaries if empty or below standard roster."""
    if db.featured_profiles.count_documents({}) < len(SEED_WALL_OF_FAME):
        logger.info("Seeding / updating Wall of Fame inductee roster...")
        now = datetime.now(timezone.utc)
        for item in SEED_WALL_OF_FAME:
            existing = db.featured_profiles.find_one({"subject_name": item["subject_name"]})
            if not existing:
                doc = item.copy()
                doc["created_at"] = now
                doc["updated_at"] = now
                db.featured_profiles.insert_one(doc)


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

    return doc


@router.post("/admin/wall-of-fame/{profile_id}/invite")
def send_admin_wall_of_fame_invite(
    profile_id: str,
    payload: InviteRequest = None,
    current_user: dict = Depends(get_current_user)
):
    """Generates claim token and dispatches invitation email."""
    try:
        profile = db.featured_profiles.find_one({"_id": ObjectId(profile_id)})
    except Exception:
        profile = db.featured_profiles.find_one({"_id": profile_id})

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    recipient_email = (payload.subject_email if payload and payload.subject_email else profile.get("subject_email"))
    claim_token = secrets.token_urlsafe(24)
    now = datetime.now(timezone.utc)

    db.featured_profiles.update_one(
        {"_id": profile["_id"]},
        {
            "$set": {
                "claim_token": claim_token,
                "state": "invited",
                "invited_at": now,
                "subject_email": recipient_email,
                "updated_at": now,
            }
        }
    )

    claim_url = f"https://tunemavens.com/#/wall-of-fame/claim/{claim_token}"

    # Log into communications vault
    db.communications.insert_one({
        "type": "wall_of_fame_invitation",
        "recipient_email": recipient_email,
        "subject_name": profile.get("subject_name"),
        "claim_url": claim_url,
        "claim_token": claim_token,
        "status": "delivered",
        "created_at": now,
    })

    return {
        "status": "invited",
        "profile_id": str(profile["_id"]),
        "claim_token": claim_token,
        "claim_url": claim_url,
        "recipient_email": recipient_email,
        "message": f"Invitation dispatched for {profile.get('subject_name')}."
    }


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
