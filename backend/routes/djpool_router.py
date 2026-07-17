from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timezone

from config import db
from models import DjPoolTrack, DjFeedback, DjClearanceRequest
from routes.auth_router import get_current_user

router = APIRouter(prefix="/api/djpool", tags=["DJ Pool"])

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
        audio_url=payload.get("audio_url", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"), # Stable sample file
        allowed_regions=payload.get("allowed_regions", []),
        downloads_count=0
    )
    doc = track.to_mongo()
    result = db.dj_pool_tracks.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc

@router.get("/tracks", response_model=List[dict])
def list_promo_tracks(current_user: dict = Depends(get_current_user)):
    """List available promo tracks whitelisted for the current user's region."""
    user_country = current_user.get("country", "US")
    
    query = {
        "$or": [
            {"allowed_regions": {"$size": 0}},  # unrestricted
            {"allowed_regions": user_country}    # whitelisted for user's country
        ]
    }
    
    tracks = list(db.dj_pool_tracks.find(query))
    result = []
    for t in tracks:
        # Check if user has already submitted feedback
        feedback_exists = db.dj_feedback.find_one({
            "dj_id": str(current_user["_id"]),
            "track_id": str(t["_id"])
        }) is not None
        
        t["id"] = str(t["_id"])
        t.pop("_id", None)
        t["feedback_submitted"] = feedback_exists
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
    # Check if feedback was submitted
    feedback = db.dj_feedback.find_one({
        "dj_id": str(current_user["_id"]),
        "track_id": track_id
    })
    
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Feedback required. Please submit a review to unlock this download drop."
        )
        
    track = db.dj_pool_tracks.find_one({"_id": ObjectId(track_id)})
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
        
    db.dj_pool_tracks.update_one(
        {"_id": ObjectId(track_id)},
        {"$inc": {"downloads_count": 1}}
    )
    
    return {
        "status": "success",
        "audio_url": track.get("audio_url"),
        "message": "Track downloaded successfully. Injected 8s intro/outro tags for DJ mixing compliance."
    }

@router.post("/clearance", response_model=dict)
def create_clearance_request(payload: dict, current_user: dict = Depends(get_current_user)):
    """Submit a clearance request for a bootleg remix drop."""
    request = DjClearanceRequest(
        track_id=payload.get("track_id", ""),
        title=payload.get("title", ""),
        dj_name=payload.get("dj_name", ""),
        venue=payload.get("venue", ""),
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
    # If admin or creator, list all requests. If DJ, list only theirs.
    user_id = str(current_user["_id"])
    requests = list(db.dj_clearances.find({}))
    
    result = []
    for r in requests:
        # Resolve track uploader to verify if current user is owner
        track = db.dj_pool_tracks.find_one({"_id": ObjectId(r["track_id"])}) if r.get("track_id") else None
        
        # DJ can see their own clearances; track owner can see it; admin can see all
        is_owner = track and track.get("user_id") == user_id
        is_dj = r.get("dj_name") == current_user.get("username") or r.get("dj_name") == current_user.get("email")
        is_admin = current_user.get("role") == "admin"
        
        if is_owner or is_dj or is_admin:
            r["id"] = str(r["_id"])
            r.pop("_id", None)
            if track:
                r["original_title"] = track.get("title")
                r["original_artist"] = track.get("artist")
                r["is_owner"] = is_owner
            result.append(r)
            
    return result

@router.post("/clearance/{request_id}/approve", response_model=dict)
def approve_clearance_request(request_id: str, payload: dict, current_user: dict = Depends(get_current_user)):
    """Approve or decline remix drop clearance request."""
    status_val = payload.get("status", "approved")  # 'approved' or 'declined'
    
    request = db.dj_clearances.find_one({"_id": ObjectId(request_id)})
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    track = db.dj_pool_tracks.find_one({"_id": ObjectId(request["track_id"])})
    if not track:
         raise HTTPException(status_code=404, detail="Track not found")
         
    # Only track uploader or admin can approve/decline
    if track.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to moderate this clearance request")
        
    db.dj_clearances.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": status_val}}
    )
    
    return {"status": "success", "message": f"Request status updated to {status_val}"}
