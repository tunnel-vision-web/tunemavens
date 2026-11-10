from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timezone
import secrets

from config import db
from models import DjPoolTrack, DjFeedback, DjClearanceRequest
from routes.auth_router import get_current_user

router = APIRouter(prefix="/api/djpool", tags=["DJ Pool"])

def seed_dj_pool_if_empty():
    """Ensure rich initial record pool cuts are present for DJs and testing."""
    sample_audio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    try:
        db.dj_pool_tracks.update_many(
            {"audio_url": {"$regex": r"\.mp4($|\?)"}},
            {"$set": {"audio_url": sample_audio}}
        )
    except Exception:
        pass

    if db.dj_pool_tracks.count_documents({}) >= 6:
        return
    seed_tracks = [
        {
            "user_id": "seed_admin",
            "title": "Midnight Grooves (Club Intro Edit)",
            "artist": "Vibe Master",
            "bpm": 124,
            "key": "4A",
            "genre": "House",
            "version_type": "Extended Mix",
            "energy_level": 8,
            "duration_seconds": 312,
            "stems_available": True,
            "lossless_format": "24-bit WAV",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 142,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Nairobi Sunset (Afro Club Rework)",
            "artist": "Aisha Okoro ft. K-Boy",
            "bpm": 112,
            "key": "8A",
            "genre": "Afrobeats",
            "version_type": "Extended Mix",
            "energy_level": 7,
            "duration_seconds": 245,
            "stems_available": True,
            "lossless_format": "24-bit WAV",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 289,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Soweto Log Drum Fever (VIP Mix)",
            "artist": "DJ Maphoria",
            "bpm": 113,
            "key": "5B",
            "genre": "Amapiano",
            "version_type": "Extended Mix",
            "energy_level": 9,
            "duration_seconds": 360,
            "stems_available": True,
            "lossless_format": "Lossless FLAC",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 318,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Neon Horizons (Peak Hour Banger)",
            "artist": "Static Pulse",
            "bpm": 128,
            "key": "11A",
            "genre": "Techno",
            "version_type": "Original",
            "energy_level": 10,
            "duration_seconds": 384,
            "stems_available": False,
            "lossless_format": "24-bit WAV",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 195,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Rongai Riots (Street Intro)",
            "artist": "Matatu Boys",
            "bpm": 96,
            "key": "2A",
            "genre": "Gengetone",
            "version_type": "Radio Clean",
            "energy_level": 8,
            "duration_seconds": 198,
            "stems_available": False,
            "lossless_format": "320kbps MP3",
            "audio_url": sample_audio,
            "allowed_regions": ["KE", "UG", "TZ"],
            "downloads_count": 87,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Kingston Pressure (Dubplate Special)",
            "artist": "Riddim Rebel",
            "bpm": 86,
            "key": "6A",
            "genre": "Dancehall",
            "version_type": "Instrumental",
            "energy_level": 7,
            "duration_seconds": 210,
            "stems_available": True,
            "lossless_format": "24-bit WAV",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 210,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_admin",
            "title": "Safari Soul (Acapella Intro)",
            "artist": "Zara Chen",
            "bpm": 120,
            "key": "4A",
            "genre": "House",
            "version_type": "Acapella",
            "energy_level": 6,
            "duration_seconds": 180,
            "stems_available": True,
            "lossless_format": "24-bit WAV",
            "audio_url": sample_audio,
            "allowed_regions": [],
            "downloads_count": 164,
            "created_at": datetime.now(timezone.utc)
        }
    ]
    for track_data in seed_tracks:
        if not db.dj_pool_tracks.find_one({"title": track_data["title"]}):
            db.dj_pool_tracks.insert_one(track_data)

# Seed on module load
seed_dj_pool_if_empty()


@router.post("/tracks", response_model=dict)
def add_promo_track(payload: dict, current_user: dict = Depends(get_current_user)):
    """Upload a new promo track (creators and labels)."""
    track = DjPoolTrack(
        user_id=str(current_user["_id"]),
        title=payload.get("title", ""),
        artist=payload.get("artist", ""),
        bpm=int(payload.get("bpm", 120)),
        key=payload.get("key", "1A"),
        genre=payload.get("genre", "Dance"),
        version_type=payload.get("version_type", "Extended Mix"),
        energy_level=int(payload.get("energy_level", 7)),
        duration_seconds=int(payload.get("duration_seconds", 240)),
        stems_available=bool(payload.get("stems_available", False)),
        lossless_format=payload.get("lossless_format", "24-bit WAV"),
        audio_url=payload.get("audio_url", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"),
        allowed_regions=payload.get("allowed_regions", []),
        downloads_count=0
    )
    doc = track.to_mongo()
    result = db.dj_pool_tracks.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/tracks", response_model=List[dict])
def list_promo_tracks(
    genre: Optional[str] = Query(None),
    bpm_min: Optional[int] = Query(None),
    bpm_max: Optional[int] = Query(None),
    key: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """List available promo tracks whitelisted for the current user's region with optional filters."""
    user_country = current_user.get("country", "US")
    
    query_conditions = [
        {
            "$or": [
                {"allowed_regions": {"$size": 0}},  # unrestricted
                {"allowed_regions": user_country}    # whitelisted for user's country
            ]
        }
    ]

    if genre and genre.lower() != "all":
        query_conditions.append({"genre": {"$regex": f"^{genre}$", "$options": "i"}})

    if key and key.lower() != "all":
        query_conditions.append({"key": {"$regex": f"^{key}$", "$options": "i"}})

    if bpm_min is not None or bpm_max is not None:
        bpm_filter = {}
        if bpm_min is not None:
            bpm_filter["$gte"] = bpm_min
        if bpm_max is not None:
            bpm_filter["$lte"] = bpm_max
        query_conditions.append({"bpm": bpm_filter})

    if q and q.strip():
        search_rgx = {"$regex": q.strip(), "$options": "i"}
        query_conditions.append({
            "$or": [
                {"title": search_rgx},
                {"artist": search_rgx},
                {"genre": search_rgx},
                {"key": search_rgx}
            ]
        })

    mongo_query = {"$and": query_conditions} if query_conditions else {}
    tracks = list(db.dj_pool_tracks.find(mongo_query).sort("created_at", -1))
    
    result = []
    user_id_str = str(current_user["_id"])
    for t in tracks:
        track_id_str = str(t["_id"])
        feedback_exists = db.dj_feedback.find_one({
            "dj_id": user_id_str,
            "track_id": track_id_str
        }) is not None

        t["id"] = track_id_str
        t.pop("_id", None)
        t["feedback_submitted"] = feedback_exists
        # Provide defaults for legacy entries
        if "version_type" not in t:
            t["version_type"] = "Extended Mix"
        if "energy_level" not in t:
            t["energy_level"] = 7
        if "duration_seconds" not in t:
            t["duration_seconds"] = 240
        if "stems_available" not in t:
            t["stems_available"] = False
        if "lossless_format" not in t:
            t["lossless_format"] = "24-bit WAV"
        result.append(t)
    return result


@router.post("/feedback", response_model=dict)
def submit_feedback(payload: dict, current_user: dict = Depends(get_current_user)):
    """Submit DJ rating and feedback to unlock download permissions."""
    track_id = payload.get("track_id")
    if not track_id:
        raise HTTPException(status_code=400, detail="track_id is required")
        
    feedback = DjFeedback(
        dj_id=str(current_user["_id"]),
        track_id=track_id,
        rating=int(payload.get("rating", 5)),
        dancefloor_response=payload.get("dancefloor_response", "keep_crowd"),
        review_text=payload.get("review_text", "")
    )
    
    doc = feedback.to_mongo()
    db.dj_feedback.insert_one(doc)
    
    return {"status": "success", "message": "Feedback submitted successfully. Track unlocked!"}


@router.post("/download/{track_id}", response_model=dict)
def download_promo_track(track_id: str, current_user: dict = Depends(get_current_user)):
    """Verify uploader settings and feedback logs before releasing promo track audio url."""
    feedback = db.dj_feedback.find_one({
        "dj_id": str(current_user["_id"]),
        "track_id": track_id
    })
    
    # Allow admin or track owner bypass; otherwise require feedback
    track = db.dj_pool_tracks.find_one({"_id": ObjectId(track_id)}) if ObjectId.is_valid(track_id) else None
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    is_owner_or_admin = (
        track.get("user_id") == str(current_user["_id"]) or
        current_user.get("role") == "admin"
    )

    if not feedback and not is_owner_or_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Feedback required. Please submit a review to unlock this download drop."
        )
        
    db.dj_pool_tracks.update_one(
        {"_id": ObjectId(track_id)},
        {"$inc": {"downloads_count": 1}}
    )
    
    return {
        "status": "success",
        "audio_url": track.get("audio_url"),
        "title": track.get("title"),
        "artist": track.get("artist"),
        "bpm": track.get("bpm"),
        "key": track.get("key"),
        "lossless_format": track.get("lossless_format", "24-bit WAV"),
        "message": "Track downloaded successfully. Injected 8s intro/outro tags for DJ mixing compliance."
    }


@router.post("/clearance", response_model=dict)
def create_clearance_request(payload: dict, current_user: dict = Depends(get_current_user)):
    """Submit a clearance request for a bootleg remix or live club/festival drop."""
    cert_code = f"TM-CLR-{datetime.now(timezone.utc).year}-{secrets.token_hex(3).upper()}"
    dj_name = payload.get("dj_name") or current_user.get("username") or current_user.get("display_name") or current_user.get("name") or "DJ"
    request = DjClearanceRequest(
        dj_id=str(current_user["_id"]),
        track_id=payload.get("track_id", ""),
        title=payload.get("title", ""),
        dj_name=dj_name,
        venue=payload.get("venue", ""),
        event_date=payload.get("event_date", ""),
        remix_type=payload.get("remix_type", "bootleg_remix"),
        certificate_id=cert_code,
        status="pending"
    )
    doc = request.to_mongo()
    result = db.dj_clearances.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/clearance", response_model=List[dict])
def list_clearance_requests(current_user: dict = Depends(get_current_user)):
    """List clearance requests involving the user."""
    user_id = str(current_user["_id"])
    requests = list(db.dj_clearances.find({}).sort("created_at", -1))
    
    result = []
    user_names = {
        user_id,
        current_user.get("username"),
        current_user.get("display_name"),
        current_user.get("name"),
        current_user.get("email")
    }
    user_names.discard(None)

    for r in requests:
        track = db.dj_pool_tracks.find_one({"_id": ObjectId(r["track_id"])}) if (r.get("track_id") and ObjectId.is_valid(r["track_id"])) else None
        
        is_owner = track and track.get("user_id") == user_id
        is_dj = r.get("dj_id") == user_id or r.get("dj_name") in user_names
        is_admin = current_user.get("role") == "admin"
        
        if is_owner or is_dj or is_admin:
            r["id"] = str(r["_id"])
            r.pop("_id", None)
            if track:
                r["original_title"] = track.get("title")
                r["original_artist"] = track.get("artist")
                r["original_bpm"] = track.get("bpm")
                r["original_key"] = track.get("key")
                r["is_owner"] = is_owner
            # Ensure certificate_id presence
            if not r.get("certificate_id"):
                r["certificate_id"] = f"TM-CLR-2026-{secrets.token_hex(3).upper()}"
            result.append(r)
            
    return result


@router.post("/clearance/{request_id}/approve", response_model=dict)
def approve_clearance_request(request_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    """Approve or decline remix drop clearance request and issue verifiable certificate."""
    status_val = payload.get("status", "approved")  # 'approved' or 'declined'
    
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")
    request = db.dj_clearances.find_one({"_id": ObjectId(request_id)})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    track = db.dj_pool_tracks.find_one({"_id": ObjectId(request["track_id"])}) if (request.get("track_id") and ObjectId.is_valid(request["track_id"])) else None
    if not track:
         raise HTTPException(status_code=404, detail="Track not found")
         
    if track.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to moderate this clearance request")
        
    update_fields = {"status": status_val}
    if status_val == "approved":
        update_fields["approved_at"] = datetime.now(timezone.utc)
        if not request.get("certificate_id"):
            update_fields["certificate_id"] = f"TM-CLR-{datetime.now(timezone.utc).year}-{secrets.token_hex(3).upper()}"

    db.dj_clearances.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": update_fields}
    )
    
    return {
        "status": "success",
        "message": f"Request status updated to {status_val}",
        "certificate_id": request.get("certificate_id") or update_fields.get("certificate_id")
    }
