"""Social AI Router.

Handles text-to-image (cover art) and text-to-video (short clip promos) generation prompts,
format recommendations, AI captions, and YouTube API integrations.
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from bson import ObjectId

import os
import io
import time
import urllib.parse
import urllib.request
from PIL import Image, ImageFilter, ImageEnhance
from auth import get_current_user, get_optional_user
from config import db
from models import GeneratedAsset, AssetUpdateRequest
from services.youtube_service import youtube_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/social-ai", tags=["social-ai"])

RETINA_DIMENSIONS = {
    "16:9": (2560, 1440),
    "3:1": (2560, 854),
    "banner": (2560, 854),
    "header": (2560, 854),
    "1:1": (2048, 2048),
    "4:5": (1600, 2000),
    "portrait": (1600, 2000),
    "9:16": (1440, 2560),
}


class ArtGenerateRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "16:9"


class VideoGenerateRequest(BaseModel):
    prompt: str
    duration_seconds: Optional[int] = 5


@router.post("/generate-art")
def generate_art(payload: ArtGenerateRequest, current_user: Optional[dict] = Depends(get_optional_user)):
    """Creative text-to-image artwork generation responding to user prompts with Retina-ready crispness."""
    raw_prompt = payload.prompt.strip()
    if not raw_prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    aspect_ratio = payload.aspect_ratio or "16:9"
    target_w, target_h = RETINA_DIMENSIONS.get(aspect_ratio, (2560, 1440))
    
    # Enrich prompt with professional photography & high-fidelity tokens for crisp realism
    enriched_prompt = f"{raw_prompt}, photorealistic, 8k ultra detailed, crisp focus, studio lighting, masterpiece"
    clean_prompt = urllib.parse.quote(enriched_prompt)
    
    seed = int(time.time() * 1000) % 10000000
    generator_url = f"https://image.pollinations.ai/prompt/{clean_prompt}?width={target_w}&height={target_h}&nologo=true&seed={seed}"
    
    media_url = generator_url
    
    # Retina Enhancement Pipeline: Download, Lanczos upscale to true Retina 2K, and apply unsharp mask
    try:
        req = urllib.request.Request(
            generator_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=14) as resp:
            data = resp.read()
            if data and len(data) > 2048:
                img = Image.open(io.BytesIO(data))
                # Ensure true Retina dimensions with Lanczos resampling
                if img.size != (target_w, target_h):
                    img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
                
                # Apply crisp micro-contrast and unsharp masking for Retina screens
                enhancer = ImageEnhance.Sharpness(img)
                crisp = enhancer.enhance(1.20)
                crisp = crisp.filter(ImageFilter.UnsharpMask(radius=1.6, percent=120, threshold=2))
                
                # Save locally to static uploads directory
                uploads_dir = os.environ.get("LOCAL_UPLOADS_DIR", "uploads")
                ai_dir = os.path.join(uploads_dir, "ai_assets")
                os.makedirs(ai_dir, exist_ok=True)
                
                filename = f"retina_art_{seed}_{target_w}x{target_h}.jpg"
                filepath = os.path.join(ai_dir, filename)
                crisp.save(filepath, format="JPEG", quality=95, optimize=True, dpi=(96, 96))
                
                media_url = f"/uploads/ai_assets/{filename}"
                logger.info(f"Generated 96 DPI Retina-ready crisp artwork ({target_w}x{target_h}) saved to {media_url}")
    except Exception as exc:
        logger.warning(f"Retina local upscaling fallback (serving upstream URL): {exc}")
    
    user_id = str(current_user["_id"]) if current_user else "anonymous_cms"
    subdomain = current_user.get("brand_name") or current_user.get("name") or "ndufo" if current_user else "ndufo"
    
    asset = GeneratedAsset(
        user_id=user_id,
        media_type="image",
        media_url=media_url,
        prompt=payload.prompt,
        aspect_ratio=payload.aspect_ratio
    )
    
    asset_doc = asset.to_mongo()
    asset_doc["subdomain"] = str(subdomain).lower()
    asset_doc["title"] = f"AI Artwork: {payload.prompt[:32]}"
    asset_doc["filename"] = filename if 'filename' in locals() else f"ai_{seed}.jpg"
    asset_doc["content_type"] = "image/jpeg"
    asset_doc["is_ai"] = True
    asset_doc["dpi"] = 96
    
    try:
        result = db.assets.insert_one(asset_doc)
        asset_doc["id"] = str(result.inserted_id)
        asset_doc.pop("_id", None)
    except Exception:
        asset_doc["id"] = str(seed)
        asset_doc.pop("_id", None)
    
    return {
        "status": "success",
        "asset": asset_doc
    }


@router.post("/generate-video")
def generate_video(payload: VideoGenerateRequest, current_user: dict = Depends(get_current_user)):
    """Simulate text-to-video promotional teaser clip generation and save it to the asset manager."""
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    mock_video_url = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    
    asset = GeneratedAsset(
        user_id=str(current_user["_id"]),
        media_type="video",
        media_url=mock_video_url,
        prompt=payload.prompt,
        duration_seconds=payload.duration_seconds
    )
    
    asset_doc = asset.to_mongo()
    result = db.assets.insert_one(asset_doc)
    asset_doc["id"] = str(result.inserted_id)
    asset_doc.pop("_id", None)
    
    return {
        "status": "success",
        "asset": asset_doc
    }


@router.get("/assets")
def list_assets(current_user: dict = Depends(get_current_user)):
    """List all previously generated assets for the current user."""
    cursor = db.assets.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    assets = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        assets.append(doc)
    return assets


@router.put("/assets/{asset_id}")
def update_asset(asset_id: str, payload: AssetUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update metadata (like prompt caption) of a previously generated asset."""
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    res = db.assets.update_one(
        {"_id": ObjectId(asset_id), "user_id": str(current_user["_id"])},
        {"$set": {"prompt": payload.prompt}}
    )
    
    if res.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
        
    updated = db.assets.find_one({"_id": ObjectId(asset_id)})
    updated["id"] = str(updated["_id"])
    updated.pop("_id", None)
    return updated


@router.delete("/assets/{asset_id}")
def delete_asset(asset_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a previously generated asset."""
    res = db.assets.delete_one({"_id": ObjectId(asset_id), "user_id": str(current_user["_id"])})
    if res.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Asset not found")
    return {"status": "success", "message": "Asset deleted"}


class RecommendationRequest(BaseModel):
    platform: str  # 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin'
    content_type: Optional[str] = "music_video"


@router.post("/recommendations")
def get_channel_recommendations(payload: RecommendationRequest):
    """Provides path-based format, aspect ratio, and prompt recommendations per social platform."""
    plat = payload.platform.lower()
    
    aspect_ratio_map = {
        "instagram": "9:16",
        "tiktok": "9:16",
        "youtube": "16:9",
        "youtube_shorts": "9:16",
        "facebook": "1:1",
        "linkedin": "1:1",
    }
    
    recommended_ratio = aspect_ratio_map.get(plat, "9:16" if "short" in plat or plat in ("tiktok", "instagram") else "16:9")
    
    hashtags_map = {
        "instagram": ["#TuneMavens", "#NewMusic", "#ReelsViral", "#SyncLicensing", "#MusicProducer"],
        "tiktok": ["#fyp", "#MusicTok", "#IndieArtist", "#TuneStream", "#ViralSound"],
        "youtube": ["#TuneMavens", "#OfficialMusicVideo", "#4KAudio", "#SyncMavens"],
        "facebook": ["#IntermavenNetwork", "#MusicCatalog", "#TuneMavens"],
        "linkedin": ["#MusicBusiness", "#SyncLicensing", "#EntertainmentIndustry"],
    }
    
    return {
        "platform": plat,
        "content_type": payload.content_type,
        "recommended_aspect_ratio": recommended_ratio,
        "prompt_formula": f"Cinematic {payload.content_type} teaser, cyber neon lighting, 8k resolution, formatted for {plat} [{recommended_ratio}]",
        "recommended_hashtags": hashtags_map.get(plat, ["#TuneMavens", "#IntermavenNetwork"]),
        "optimal_posting_times": ["12:00 PM EST", "6:00 PM EST", "9:00 PM EST"],
    }


class CaptionGenerateRequest(BaseModel):
    track_title: str
    artist: str
    mood: Optional[str] = "energetic"
    platform: Optional[str] = "instagram"


@router.post("/generate-caption")
def generate_caption(payload: CaptionGenerateRequest):
    """Generates promotional social media copy and hashtags."""
    caption = (
        f"🔥 Out Now! Check out '{payload.track_title}' by {payload.artist}! "
        f"Vibe: {payload.mood.capitalize()}. Stream the full loss-less track on TuneStream 🎧 "
        f"For sync licensing inquiries, pitch on SyncMavens. Link in bio! 🚀"
    )
    return {
        "track_title": payload.track_title,
        "artist": payload.artist,
        "platform": payload.platform,
        "generated_caption": caption,
        "hashtags": ["#TuneMavens", "#TuneStream", "#SyncMavens", f"#{payload.artist.replace(' ', '')}"],
    }


@router.get("/youtube/channel/{channel_id}")
def get_youtube_channel(channel_id: str):
    """Fetches YouTube channel statistics and subscriber count via YouTube Data API v3."""
    return youtube_service.get_channel_metrics(channel_id)


@router.get("/youtube/featured")
def get_youtube_featured():
    """Fetches featured creator video showcases for Wall of Fame profiles."""
    return {"showcase": youtube_service.get_featured_showcase()}


@router.get("/video-stats")
@router.get("/youtube/stats")
def get_video_statistics(url: Optional[str] = None, video_id: Optional[str] = None):
    """Fetches live real-time YouTube video view counts and metadata directly from the hosting platform."""
    target = url or video_id
    if not target:
        raise HTTPException(status_code=400, detail="Either 'url' or 'video_id' parameter is required.")
    return youtube_service.get_video_stats(target)

