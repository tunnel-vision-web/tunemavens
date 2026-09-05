"""EPK Builder Router — Management & Public Web World Endpoints.

Allows creators to persist their EPK configurations to MongoDB (`db.epks`),
and serves public artist web worlds by subdomain or username.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Request, status
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

    # Update or upsert by subdomain so creators can manage their EPKs seamlessly
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": data},
        upsert=True
    )
    
    saved = db.epks.find_one({"user_id": user_id})
    saved["_id"] = str(saved["_id"])
    return saved


@router.get("/public/{subdomain}", response_model=Dict[str, Any])
def get_public_epk(subdomain: str):
    """Public endpoint to fetch published EPK profile by subdomain or artist username."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    epk_doc = db.epks.find_one({"subdomain": clean_subdomain})
    
    if not epk_doc:
        # Fallback search by artist name or user_id
        epk_doc = db.epks.find_one({"artist_name": {"$regex": f"^{clean_subdomain}$", "$options": "i"}})
        
    if not epk_doc:
        # Return fallback template shape
        return {
            "subdomain": clean_subdomain,
            "artist_name": clean_subdomain.capitalize(),
            "headline": "Official Intermaven Creator Web World",
            "bio": f"Welcome to the official Electronic Press Kit for {clean_subdomain.capitalize()}.",
            "accentColor": "#00f0ff",
            "secondaryColor": "#ff007f",
            "fontFamily": "Sansation, sans-serif",
            "themeBg": "linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)",
            "is_default": True
        }
        
    epk_doc["_id"] = str(epk_doc["_id"])
    return epk_doc


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

    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": payload},
        upsert=True
    )
    saved = db.epks.find_one({"subdomain": clean_subdomain})
    saved["_id"] = str(saved["_id"])
    return saved


@router.post("/public/{subdomain}/rollback/{version}", response_model=Dict[str, Any])
def rollback_public_epk(subdomain: str, version: int):
    """Roll back EPK to a previous CMS snapshot."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    entry = db.epk_history.find_one({"subdomain": clean_subdomain, "version": version})
    if not entry:
        raise HTTPException(status_code=404, detail="Snapshot version not found")
    data = entry["data"]
    data["updated_at"] = datetime.now(timezone.utc)
    db.epks.update_one({"subdomain": clean_subdomain}, {"$set": data})
    saved = db.epks.find_one({"subdomain": clean_subdomain})
    saved["_id"] = str(saved["_id"])
    return saved


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
def update_public_epk(subdomain: str, payload: Dict[str, Any]):
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    payload["subdomain"] = clean_subdomain
    payload["updated_at"] = datetime.now(timezone.utc)
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": payload},
        upsert=True
    )
    saved = db.epks.find_one({"subdomain": clean_subdomain})
    if saved:
        saved["_id"] = str(saved["_id"])
    return saved or payload
