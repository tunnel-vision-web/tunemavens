"""Social AI Router.

Handles text-to-image (cover art) and text-to-video (short clip promos) generation prompts,
with persistent Asset Manager capabilities (list, edit, delete).
"""
from __future__ import annotations

import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from bson import ObjectId

from auth import get_current_user
from config import db
from models import GeneratedAsset, AssetUpdateRequest

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/social-ai", tags=["social-ai"])


class ArtGenerateRequest(BaseModel):
    prompt: str
    aspect_ratio: Optional[str] = "1:1"


class VideoGenerateRequest(BaseModel):
    prompt: str
    duration_seconds: Optional[int] = 5


@router.post("/generate-art")
def generate_art(payload: ArtGenerateRequest, current_user: dict = Depends(get_current_user)):
    """Simulate creative text-to-image artwork generation and save it to the asset manager."""
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    seed_str = "".join(c for c in payload.prompt if c.isalnum())[:25] or "artwork"
    mock_art_url = f"https://picsum.photos/seed/{seed_str}/600"
    
    asset = GeneratedAsset(
        user_id=str(current_user["_id"]),
        media_type="image",
        media_url=mock_art_url,
        prompt=payload.prompt,
        aspect_ratio=payload.aspect_ratio
    )
    
    asset_doc = asset.to_mongo()
    result = db.assets.insert_one(asset_doc)
    asset_doc["id"] = str(result.inserted_id)
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
