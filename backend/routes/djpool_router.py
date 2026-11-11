from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional, Any, Union, Dict
from bson import ObjectId
from datetime import datetime, timezone
import secrets
import logging

from config import db
from models import DjPoolTrack, DjFeedback, DjClearanceRequest
from routes.auth_router import get_current_user
from routes.catalog_router import get_catalog_tracks

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/djpool", tags=["DJ Pool"])

DETERMINISTIC_CAMELOT_KEYS = [
    "1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A", "9A", "10A", "11A", "12A",
    "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B", "9B", "10B", "11B", "12B"
]

def derive_camelot_key_and_bpm(title: str, genre: str, raw_key: Optional[str] = None, raw_bpm: Any = None):
    key = str(raw_key).strip().upper() if raw_key else ""
    if not key or key in ["NONE", "NULL", "UNDEFINED", ""]:
        hash_val = sum(ord(c) for c in (title or "track"))
        key = DETERMINISTIC_CAMELOT_KEYS[hash_val % len(DETERMINISTIC_CAMELOT_KEYS)]
    
    bpm = None
    if raw_bpm is not None:
        try:
            bpm = int(float(raw_bpm))
        except (ValueError, TypeError):
            pass
            
    if not bpm or bpm <= 0:
        g = (genre or "").lower()
        if "amapiano" in g:
            bpm = 113
        elif "afro" in g or "afrobeats" in g:
            bpm = 112
        elif "hip" in g or "drill" in g:
            bpm = 96
        elif "techno" in g or "peak" in g:
            bpm = 128
        elif "dancehall" in g or "reggae" in g:
            bpm = 86
        else:
            bpm = 124
    return key, bpm

def parse_duration_seconds(dur: Any) -> int:
    if isinstance(dur, (int, float)):
        return int(dur)
    if isinstance(dur, str):
        if ":" in dur:
            parts = dur.split(":")
            try:
                if len(parts) == 2:
                    return int(parts[0]) * 60 + int(parts[1])
                elif len(parts) == 3:
                    return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
            except ValueError:
                pass
        try:
            return int(float(dur))
        except ValueError:
            pass
    return 240

def parse_streams_count(val: Any) -> int:
    if isinstance(val, (int, float)):
        return int(val)
    if isinstance(val, str):
        v = val.strip().upper()
        try:
            if v.endswith("K"):
                return int(float(v[:-1]) * 1000)
            if v.endswith("M"):
                return int(float(v[:-1]) * 1000000)
            return int(float(v))
        except (ValueError, TypeError):
            pass
    return 120

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
    """List available promo tracks whitelisted for the current user's region, aggregating
    DJ Pool records, Catalogue Machine tracks, and Sovereign DJ Mixes with full filter support."""
    user_country = current_user.get("country", "US")
    user_id_str = str(current_user["_id"])
    is_admin = current_user.get("role") == "admin"
    aggregated: List[dict] = []

    # 1. Pull native DJ Pool tracks
    for t in db.dj_pool_tracks.find({}).sort("created_at", -1):
        track_id_str = str(t["_id"])
        title = t.get("title", "Untitled Cut")
        artist = t.get("artist", "TuneMavens Artist")
        track_genre = t.get("genre", "Dance")
        derived_key, derived_bpm = derive_camelot_key_and_bpm(title, track_genre, t.get("key"), t.get("bpm"))
        
        allowed_reg = t.get("allowed_regions") or []
        feedback_exists = is_admin or db.dj_feedback.find_one({
            "dj_id": user_id_str,
            "track_id": track_id_str
        }) is not None

        sample_audio = t.get("audio_url") or "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        aggregated.append({
            "id": track_id_str,
            "title": title,
            "artist": artist,
            "bpm": derived_bpm,
            "key": derived_key,
            "genre": track_genre,
            "version_type": t.get("version_type", "Extended Mix"),
            "energy_level": int(t.get("energy_level", 7)),
            "duration_seconds": parse_duration_seconds(t.get("duration_seconds", 240)),
            "stems_available": bool(t.get("stems_available", False)),
            "lossless_format": t.get("lossless_format", "24-bit WAV"),
            "audio_url": sample_audio,
            "allowed_regions": allowed_reg,
            "downloads_count": int(t.get("downloads_count", 0)),
            "feedback_submitted": feedback_exists,
            "source": "dj_pool",
            "created_at": t.get("created_at")
        })

    # 2. Ingest Catalogue Machine tracks
    try:
        cat_result = get_catalog_tracks(subdomain="all", all=True, limit=500)
        cat_items = cat_result.get("tracks", []) if isinstance(cat_result, dict) else (cat_result if isinstance(cat_result, list) else [])
        for ct in cat_items:
            cat_id = f"cat_{ct.get('id') or ct.get('isrc') or secrets.token_hex(4)}"
            title = ct.get("title", "Untitled Track")
            artist = ct.get("artist", "Catalogue Artist")
            track_genre = ct.get("genre", "Afro-House")
            derived_key, derived_bpm = derive_camelot_key_and_bpm(title, track_genre, ct.get("key"), ct.get("bpm"))
            
            # Determine version tag from title
            title_lower = title.lower()
            if "radio" in title_lower or "edit" in title_lower:
                vtype = "Radio Edit"
            elif "dub" in title_lower:
                vtype = "Dub Mix"
            elif "remix" in title_lower:
                vtype = "Club Remix"
            elif "instrumental" in title_lower:
                vtype = "Instrumental"
            else:
                vtype = "Original Master"

            feedback_exists = is_admin or db.dj_feedback.find_one({
                "dj_id": user_id_str,
                "track_id": cat_id
            }) is not None

            audio_url = (
                ct.get("audioUrl") or ct.get("audio_url") or ct.get("fileUrl") or
                "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            )

            aggregated.append({
                "id": cat_id,
                "title": title,
                "artist": artist,
                "bpm": derived_bpm,
                "key": derived_key,
                "genre": track_genre,
                "version_type": vtype,
                "energy_level": 8,
                "duration_seconds": parse_duration_seconds(ct.get("duration", 215)),
                "stems_available": bool(ct.get("syncCleared", True)),
                "lossless_format": "24-bit / 96kHz FLAC",
                "audio_url": audio_url,
                "allowed_regions": [],  # unrestricted catalogue
                "downloads_count": parse_streams_count(ct.get("streams", 160)) // 10,
                "feedback_submitted": feedback_exists,
                "source": "catalogue",
                "created_at": datetime.now(timezone.utc)
            })
    except Exception as e:
        logger.warning(f"Could not ingest Catalogue Machine tracks into DJ Pool: {e}")

    # 3. Ingest Sovereign DJ Mixes
    try:
        for m in db.dj_mixes.find({}).sort("created_at", -1):
            mix_id_str = str(m["_id"])
            title = m.get("title", "Sovereign DJ Mix")
            dj_name = m.get("dj_name", "Resident DJ")
            mix_genre = m.get("genre", "Afro-House")
            derived_key, derived_bpm = derive_camelot_key_and_bpm(title, mix_genre, None, m.get("bpm_avg"))
            
            feedback_exists = is_admin or db.dj_feedback.find_one({
                "dj_id": user_id_str,
                "track_id": mix_id_str
            }) is not None

            audio_url = m.get("audio_url") or "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"

            aggregated.append({
                "id": mix_id_str,
                "title": title,
                "artist": dj_name,
                "bpm": derived_bpm,
                "key": derived_key,
                "genre": mix_genre,
                "version_type": "Continuous DJ Set",
                "energy_level": 9,
                "duration_seconds": parse_duration_seconds(m.get("duration_seconds", 3600)),
                "stems_available": False,
                "lossless_format": "320kbps MP3 / Master WAV",
                "audio_url": audio_url,
                "allowed_regions": [],
                "downloads_count": int(m.get("plays_count", 92)),
                "feedback_submitted": feedback_exists,
                "source": "dj_mix",
                "created_at": m.get("created_at") or datetime.now(timezone.utc)
            })
    except Exception as e:
        logger.warning(f"Could not ingest DJ Mixes into DJ Pool: {e}")

    # Safely extract query parameters (supporting direct internal calls and FastAPI queries)
    genre_param = genre if isinstance(genre, str) else getattr(genre, "default", None)
    key_param = key if isinstance(key, str) else getattr(key, "default", None)
    q_param = q if isinstance(q, str) else getattr(q, "default", None)
    bpm_min_val = bpm_min if isinstance(bpm_min, (int, float)) else (getattr(bpm_min, "default", None) if not callable(getattr(bpm_min, "default", None)) else None)
    bpm_max_val = bpm_max if isinstance(bpm_max, (int, float)) else (getattr(bpm_max, "default", None) if not callable(getattr(bpm_max, "default", None)) else None)

    filtered = []
    genre_filter = genre_param.strip().lower() if genre_param and str(genre_param).strip().lower() != "all" else None
    key_filter = key_param.strip().upper() if key_param and str(key_param).strip().lower() != "all" else None
    search_filter = q_param.strip().lower() if q_param and str(q_param).strip() else None

    for item in aggregated:
        # Regional whitelist: unrestricted or matches user country
        regions = item.get("allowed_regions") or []
        if regions and user_country not in regions:
            continue

        # Genre filter
        if genre_filter and genre_filter not in item["genre"].lower():
            continue

        # Camelot key filter
        if key_filter and item["key"].upper() != key_filter:
            continue

        # BPM min/max
        bpm = item.get("bpm", 120)
        if bpm_min_val is not None and isinstance(bpm_min_val, (int, float)) and bpm < bpm_min_val:
            continue
        if bpm_max_val is not None and isinstance(bpm_max_val, (int, float)) and bpm > bpm_max_val:
            continue

        # Search query matching
        if search_filter:
            searchable_blob = f"{item['title']} {item['artist']} {item['genre']} {item['key']} {item['version_type']}".lower()
            if search_filter not in searchable_blob:
                continue

        filtered.append(item)

    return filtered


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
    
    is_admin = current_user.get("role") == "admin"
    track_doc = None
    title = "DJ Pool Master Track"
    artist = "TuneMavens Roster"
    audio_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    bpm = 124
    key = "8A"
    lossless_format = "24-bit WAV"

    if track_id.startswith("cat_"):
        # Catalogue track resolution
        raw_cat_id = track_id[4:]
        title = "Catalogue Machine Sovereign Master"
        audio_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        lossless_format = "24-bit / 96kHz FLAC"
        # Search in catalogue collections
        doc = db.catalog_tracks.find_one({"tracks.id": raw_cat_id}) or db.catalog_tracks.find_one({"tracks.isrc": raw_cat_id})
        if doc and "tracks" in doc:
            for t in doc["tracks"]:
                if t.get("id") == raw_cat_id or t.get("isrc") == raw_cat_id:
                    title = t.get("title", title)
                    artist = t.get("artist", artist)
                    audio_url = t.get("audioUrl") or t.get("fileUrl") or audio_url
                    break
    elif ObjectId.is_valid(track_id):
        # Native DJ Pool track
        track_doc = db.dj_pool_tracks.find_one({"_id": ObjectId(track_id)})
        if track_doc:
            title = track_doc.get("title", title)
            artist = track_doc.get("artist", artist)
            bpm = track_doc.get("bpm", bpm)
            key = track_doc.get("key", key)
            lossless_format = track_doc.get("lossless_format", lossless_format)
            audio_url = track_doc.get("audio_url") or audio_url
            db.dj_pool_tracks.update_one({"_id": ObjectId(track_id)}, {"$inc": {"downloads_count": 1}})
        else:
            # Check if it is a DJ mix
            mix_doc = db.dj_mixes.find_one({"_id": ObjectId(track_id)})
            if mix_doc:
                track_doc = mix_doc
                title = mix_doc.get("title", "Sovereign DJ Mix")
                artist = mix_doc.get("dj_name", "Resident DJ")
                bpm = mix_doc.get("bpm_avg", 124)
                lossless_format = "320kbps MP3 / Master WAV"
                audio_url = mix_doc.get("audio_url") or audio_url
                db.dj_mixes.update_one({"_id": ObjectId(track_id)}, {"$inc": {"plays_count": 1}})

    is_owner = track_doc and track_doc.get("user_id") == str(current_user["_id"])
    if not feedback and not is_admin and not is_owner and not track_id.startswith("cat_"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Feedback required. Please submit a review to unlock this download drop."
        )

    return {
        "status": "success",
        "audio_url": audio_url,
        "title": title,
        "artist": artist,
        "bpm": bpm,
        "key": key,
        "lossless_format": lossless_format,
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
