"""EPK Builder Router — Management & Public Web World Endpoints.

Allows creators to persist their EPK configurations to MongoDB (`db.epks`),
and serves public artist web worlds by subdomain or username.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, Field, ConfigDict
from jose import jwt

from config import db, JWT_SECRET, JWT_ALGORITHM
from auth import get_current_user, _extract_token

router = APIRouter(prefix="/api/epk", tags=["epk"])


class EPKProfileModel(BaseModel):
    model_config = ConfigDict(extra="allow")

    subdomain: str = "kip"
    artist_name: Optional[str] = None
    headline: Optional[str] = None
    themeBg: Optional[str] = None
    themeMode: Optional[str] = "dark"
    logoUrl: Optional[str] = None
    accentColor: Optional[str] = "#00f0ff"
    secondaryColor: Optional[str] = "#ff007f"
    fontFamily: Optional[str] = "Sansation, sans-serif"
    layoutWidth: Optional[str] = "wide"
    layoutVariant: Optional[str] = "logo-left"
    heroImageUrl: Optional[str] = None
    heroImages: Optional[List[str]] = None
    heroSlides: Optional[List[Dict[str, Any]]] = None
    pageHeaders: Optional[Dict[str, str]] = None
    headerImageUrl: Optional[str] = None
    headerImages: Optional[List[str]] = None
    menuItems: Optional[List[Dict[str, Any]]] = None
    domainMode: Optional[str] = "subdomain"
    customDomain: Optional[str] = None
    youtubeVideoUrl: Optional[str] = "https://www.youtube.com/embed/dQw4w9WgXcQ"
    featuredTrackIsrc: Optional[str] = None
    spotify: Optional[str] = None
    instagram: Optional[str] = None
    soundcloud: Optional[str] = None
    bookingEmail: Optional[str] = None
    pressOutlet: Optional[str] = None
    pressQuote: Optional[str] = None
    bio: Optional[str] = None
    customSections: Optional[List[Dict[str, Any]]] = None
    videos: Optional[List[Dict[str, Any]]] = None


def get_default_videos(artist_name: str = "Ndufo") -> List[Dict[str, Any]]:
    return [
        {
            "id": 301,
            "type": "video",
            "title": f"{artist_name} — Nairobi Cyberwave (Official 4K Music Video)",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "thumbnail": "https://picsum.photos/seed/yt_vid1/600/340",
            "views": "1.2M views",
            "category": "Official Video"
        },
        {
            "id": 303,
            "type": "video",
            "title": "Live at SyncMavens Vault (Full Concert 4K)",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "thumbnail": "https://picsum.photos/seed/yt_vid2/600/340",
            "views": "840K views",
            "category": "Live Concert"
        },
        {
            "id": 305,
            "type": "video",
            "title": "Inside the Synthesizer Soundscapes",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "thumbnail": "https://picsum.photos/seed/yt_vid3/600/340",
            "views": "320K views",
            "category": "Behind the Scenes"
        },
        {
            "id": 307,
            "type": "video",
            "title": f"{artist_name} — Rift Valley Sunset (Acoustic Session 4K)",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "thumbnail": "https://picsum.photos/seed/yt_vid4/600/340",
            "views": "620K views",
            "category": "Studio Session"
        },
        {
            "id": 309,
            "type": "video",
            "title": f"{artist_name} — Afro-Synth Cascade (Live at O2)",
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "youtubeUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "thumbnail": "https://picsum.photos/seed/yt_vid5/600/340",
            "views": "490K views",
            "category": "Live Concert"
        }
    ]


@router.get("/me", response_model=Dict[str, Any])
def get_my_epk(current_user: dict = Depends(get_current_user)):
    """Retrieve authenticated creator's EPK profile."""
    user_id = str(current_user["_id"])
    epk_doc = db.epks.find_one({"user_id": user_id})
    if not epk_doc:
        default_subdomain = (current_user.get("name") or "artist").lower().replace(" ", "")
        return {
            "subdomain": default_subdomain,
            "headline": "Afro-Synth Pioneer",
            "bio": current_user.get("bio") or "Independent creator on the TuneMavens & Intermaven network.",
            "accentColor": "#00f0ff",
            "secondaryColor": "#ff007f",
        }
    epk_doc["_id"] = str(epk_doc["_id"])
    return epk_doc


@router.post("/me", response_model=Dict[str, Any])
def save_my_epk(payload: EPKProfileModel, current_user: dict = Depends(get_current_user)):
    """Save or publish current creator's EPK configuration."""
    user_id = str(current_user["_id"])
    clean_subdomain = payload.subdomain.lower().strip().replace(" ", "")
    
    data = payload.model_dump()
    data["user_id"] = user_id
    data["subdomain"] = clean_subdomain
    data["updated_at"] = datetime.now(timezone.utc)
    data["artist_name"] = payload.artist_name or current_user.get("name") or clean_subdomain.capitalize()
    data.pop("_id", None)

    # 1. Update db.epks
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": data},
        upsert=True
    )
    
    # 2. Also keep Mother-CMS db.cms_layouts synchronized
    layout_id = f"epk_{clean_subdomain}"
    existing_cms = db.cms_layouts.find_one({"layout_id": layout_id})
    new_ver = (existing_cms.get("version", 1) + 1) if existing_cms else 1
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "layout_id": layout_id,
            "data": data,
            "version": new_ver,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    saved = db.epks.find_one({"user_id": user_id})
    if saved:
        saved["_id"] = str(saved["_id"])
    return saved or data


@router.get("/{subdomain}", response_model=Dict[str, Any])
@router.get("/public/{subdomain}", response_model=Dict[str, Any])
def get_public_epk(subdomain: str, response: Response):
    """Public endpoint to fetch published EPK profile by subdomain or artist username.
    
    Seamlessly synchronizes and merges with Mother-CMS layouts (db.cms_layouts) so
    AI-generated hero images, hero slides, and page header banners are immediately reflected.
    """
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"

    # 1. Fetch from db.epks
    epk_doc = db.epks.find_one({"subdomain": clean_subdomain})
    if not epk_doc:
        epk_doc = db.epks.find_one({"artist_name": {"$regex": f"^{clean_subdomain}$", "$options": "i"}})

    # 2. Fetch from db.cms_layouts
    cms_doc = db.cms_layouts.find_one({"layout_id": layout_id})
    cms_data = dict(cms_doc.get("data", {})) if cms_doc else {}
    cms_data.pop("_id", None)

    default_hero_url = "/heroes/ndufo_hero_slide1_retina.jpg"
    default_hero_url_2 = "/heroes/ndufo_hero_slide2_retina.jpg"
    default_hero_url_3 = "/heroes/ndufo_hero_slide3_retina.jpg"

    if not epk_doc and not cms_data:
        # Return fallback template shape with full hero presentation
        return {
            "subdomain": clean_subdomain,
            "artist_name": clean_subdomain.capitalize(),
            "headline": "Official Intermaven Creator Web World",
            "bio": f"Welcome to the official Electronic Press Kit for {clean_subdomain.capitalize()}.",
            "accentColor": "#00f0ff",
            "secondaryColor": "#ff007f",
            "fontFamily": "Sansation, sans-serif",
            "themeBg": "linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)",
            "heroImageUrl": default_hero_url,
            "heroImages": [default_hero_url, default_hero_url_2, default_hero_url_3],
            "heroSlides": [
                {
                    "id": 1,
                    "img": default_hero_url,
                    "title1": clean_subdomain.capitalize(),
                    "title2": "Soulful Afro-fusion Musician",
                    "title3": "High-Quality Digital Singles • Collector Vinyl & CDs • Direct Fan Ticketing"
                },
                {
                    "id": 2,
                    "img": default_hero_url_2,
                    "title1": "World Tour 2026 Live Showcase",
                    "title2": "Headline Dates: Tokyo, London & Nairobi",
                    "title3": "VIP Fan Pass & Direct Ticketing via TuneBooking"
                },
                {
                    "id": 3,
                    "img": default_hero_url_3,
                    "title1": f"{clean_subdomain.capitalize()} — Master Audio",
                    "title2": "Lossless Audio & Direct Fan Passes",
                    "title3": "Exclusive VIP Vault Access"
                }
            ],
            "videos": get_default_videos(clean_subdomain.capitalize()),
            "is_default": True
        }

    merged = {}
    if epk_doc:
        merged = {k: v for k, v in epk_doc.items() if k != "_id"}
        merged["_id"] = str(epk_doc["_id"])
    else:
        merged = dict(cms_data)
        merged["subdomain"] = clean_subdomain

    if cms_data:
        cms_ver = cms_doc.get("version", 1)
        epk_ver = epk_doc.get("version", 1) if epk_doc else 0
        cms_updated = cms_doc.get("updated_at") or cms_data.get("updated_at")
        epk_updated = epk_doc.get("updated_at") if epk_doc else None

        cms_is_newer = (cms_ver >= epk_ver) or (cms_updated and epk_updated and cms_updated >= epk_updated)

        # High-priority visual and layout keys that AI or CMS updates
        priority_keys = [
            "heroImageUrl", "heroImages", "heroSlides", "heroImage", "hero_image",
            "pageHeaders", "headerImageUrl", "headerImages",
            "heroAnimStyle", "heroTitle1", "heroTitle2", "heroTitle3",
            "videos", "albums", "releases"
        ]
        for pk in priority_keys:
            if pk in cms_data and cms_data[pk]:
                if cms_is_newer or pk not in merged or not merged[pk]:
                    merged[pk] = cms_data[pk]

        if cms_is_newer:
            for k, v in cms_data.items():
                if v is not None and v != "":
                    merged[k] = v

        # Synchronize db.epks with the merged state so both collections are always coherent
        sync_payload = {k: v for k, v in merged.items() if k != "_id"}
        try:
            db.epks.update_one(
                {"subdomain": clean_subdomain},
                {"$set": sync_payload},
                upsert=True
            )
        except Exception:
            pass

    # Ensure hero presentation fields are never empty
    if not merged.get("heroImageUrl"):
        merged["heroImageUrl"] = default_hero_url
    if not merged.get("heroImages") or not len(merged["heroImages"]):
        merged["heroImages"] = [default_hero_url, default_hero_url_2, default_hero_url_3]
    if not merged.get("heroSlides") or not len(merged["heroSlides"]):
        merged["heroSlides"] = [
            {
                "id": 1,
                "img": default_hero_url,
                "title1": merged.get("artist_name") or clean_subdomain.capitalize(),
                "title2": merged.get("headline") or "Official Intermaven Creator Web World",
                "title3": "High-Quality Digital Singles • Collector Vinyl & CDs • Direct Fan Ticketing"
            },
            {
                "id": 2,
                "img": default_hero_url_2,
                "title1": "World Tour 2026 Live Showcase",
                "title2": "Headline Dates: Tokyo, London & Nairobi",
                "title3": "VIP Fan Pass & Direct Ticketing via TuneBooking"
            },
            {
                "id": 3,
                "img": default_hero_url_3,
                "title1": f"{merged.get('artist_name') or clean_subdomain.capitalize()} — Master Audio",
                "title2": "Lossless Audio & Direct Fan Passes",
                "title3": "Exclusive VIP Vault Access"
            }
        ]

    # Ensure videos are never empty and reflect full EPK media collection
    if not merged.get("videos") or not len(merged["videos"]):
        merged["videos"] = get_default_videos(merged.get("artist_name") or clean_subdomain.capitalize())

    # Ensure tracks and albums are synchronized from catalogue
    if not merged.get("albums") or not len(merged["albums"]):
        try:
            from routes.catalog_router import build_creator_albums
            tracks = merged.get("tracks") or []
            if not tracks:
                cat_doc = db.catalog_tracks.find_one({"subdomain": clean_subdomain})
                tracks = cat_doc.get("tracks", []) if cat_doc else []
                if tracks:
                    merged["tracks"] = tracks
            merged["albums"] = build_creator_albums(clean_subdomain, tracks)
        except Exception:
            pass

    if "_id" not in merged:
        merged["_id"] = clean_subdomain
    return merged


@router.get("/check-availability/{subdomain}")
def check_subdomain_availability(subdomain: str, request: Request):
    """Check whether a subdomain/username is available across the Intermaven network."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    existing_epk = db.epks.find_one({"subdomain": clean_subdomain})
    existing_user = db.users.find_one({"username": {"$regex": f"^{clean_subdomain}$", "$options": "i"}})

    token = _extract_token(request)
    current_user_id = None
    if token:
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user_id = payload.get("sub")
        except Exception:
            pass

    # If already claimed by current user, it is available for them to use
    if current_user_id:
        if existing_epk and (existing_epk.get("user_id") == current_user_id or str(existing_epk.get("_id")) == current_user_id):
            return {"available": True, "subdomain": clean_subdomain, "reason": "owned_by_you"}
        if existing_user and str(existing_user.get("_id")) == current_user_id:
            return {"available": True, "subdomain": clean_subdomain, "reason": "owned_by_you"}

    # If claimed by someone else
    if existing_epk or existing_user:
        return {
            "available": False,
            "subdomain": clean_subdomain,
            "reason": "taken",
            "suggestions": [
                f"{clean_subdomain}-official",
                f"{clean_subdomain}-music",
                f"{clean_subdomain}-live"
            ]
        }

    return {"available": True, "subdomain": clean_subdomain, "reason": "available"}


@router.put("/public/{subdomain}", response_model=Dict[str, Any])
def update_public_epk(subdomain: str, payload: Dict[str, Any]):
    """Update published EPK configuration directly from the Live CMS Editor."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    payload["updated_at"] = datetime.now(timezone.utc)
    payload["subdomain"] = clean_subdomain
    payload["artist_name"] = payload.get("artist_name") or clean_subdomain.capitalize()
    
    # Snapshot into layout history for rollback capability like Mother-CMS
    try:
        history_entry = {
            "subdomain": clean_subdomain,
            "data": payload,
            "saved_at": datetime.now(timezone.utc),
            "version": int(datetime.now(timezone.utc).timestamp())
        }
        db.epk_history.insert_one(history_entry)
    except Exception:
        pass

    clean_payload = {k: v for k, v in payload.items() if k != "_id"}
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": clean_payload},
        upsert=True
    )

    # Synchronize to Mother-CMS layouts
    layout_id = f"epk_{clean_subdomain}"
    existing_cms = db.cms_layouts.find_one({"layout_id": layout_id})
    new_cms_ver = (existing_cms.get("version", 1) + 1) if existing_cms else 1
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "layout_id": layout_id,
            "data": clean_payload,
            "version": new_cms_ver,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    saved = db.epks.find_one({"subdomain": clean_subdomain})
    if saved:
        saved["_id"] = str(saved["_id"])
    return saved or payload


@router.post("/public/{subdomain}/rollback/{version}", response_model=Dict[str, Any])
def rollback_public_epk(subdomain: str, version: int):
    """Roll back EPK to a previous CMS snapshot."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    entry = db.epk_history.find_one({"subdomain": clean_subdomain, "version": version})
    if not entry:
        raise HTTPException(status_code=404, detail="Snapshot version not found")
    data = entry["data"]
    data["updated_at"] = datetime.now(timezone.utc)
    clean_data = {k: v for k, v in data.items() if k != "_id"}
    db.epks.update_one({"subdomain": clean_subdomain}, {"$set": clean_data})

    # Synchronize rollback to db.cms_layouts
    layout_id = f"epk_{clean_subdomain}"
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "layout_id": layout_id,
            "data": clean_data,
            "version": version,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    saved = db.epks.find_one({"subdomain": clean_subdomain})
    if saved:
        saved["_id"] = str(saved["_id"])
    return saved or clean_data


@router.get("/public/{subdomain}/history")
def get_epk_history(subdomain: str):
    """Get history of CMS snapshots for rollback."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    cursor = db.epk_history.find({"subdomain": clean_subdomain}).sort("saved_at", -1).limit(15)
    history = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history


@router.post("/public/{subdomain}")
def update_public_epk_post(subdomain: str, payload: Dict[str, Any]):
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    payload["subdomain"] = clean_subdomain
    payload["updated_at"] = datetime.now(timezone.utc)
    clean_payload = {k: v for k, v in payload.items() if k != "_id"}
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": clean_payload},
        upsert=True
    )

    layout_id = f"epk_{clean_subdomain}"
    existing_cms = db.cms_layouts.find_one({"layout_id": layout_id})
    new_cms_ver = (existing_cms.get("version", 1) + 1) if existing_cms else 1
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "layout_id": layout_id,
            "data": clean_payload,
            "version": new_cms_ver,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    saved = db.epks.find_one({"subdomain": clean_subdomain})
    if saved:
        saved["_id"] = str(saved["_id"])
    return saved or payload
