"""Social AI Router.

Handles text-to-image (cover art) and text-to-video (short clip promos) generation prompts.
"""
from __future__ import annotations

import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user

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
    """Simulate creative text-to-image artwork generation."""
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    # Return a high-quality mockup cover artwork using a real CDN seed url
    seed_str = "".join(c for c in payload.prompt if c.isalnum())[:25] or "artwork"
    mock_art_url = f"https://picsum.photos/seed/{seed_str}/600"
    
    return {
        "status": "success",
        "media_type": "image",
        "media_url": mock_art_url,
        "prompt": payload.prompt,
        "aspect_ratio": payload.aspect_ratio
    }


@router.post("/generate-video")
def generate_video(payload: VideoGenerateRequest, current_user: dict = Depends(get_current_user)):
    """Simulate text-to-video promotional teaser clip generation."""
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )
    
    # Return a real, playable high-end mock stock video clip
    mock_video_url = "https://assets.mixkit.co/videos/preview/mixkit-spinning-vinyl-record-with-glowing-neon-lines-51203-large.mp4"
    
    return {
        "status": "success",
        "media_type": "video",
        "media_url": mock_video_url,
        "prompt": payload.prompt,
        "duration_seconds": payload.duration_seconds
    }
