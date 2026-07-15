"""TuneStream Player Audio Streaming Router.

Handles audio file streaming, watermarked previews, and subscription
access checks (45-second restriction for Starter tier).
"""
from __future__ import annotations

import logging
import os
from urllib.request import Request, urlopen

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse, RedirectResponse, StreamingResponse

from auth import get_optional_user
from config import db
from models import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stream", tags=["stream"])

# Approx bytes for 45s of 256kbps audio (45 * 256 * 1024 / 8 = 1.44 MB)
PREVIEW_BYTE_LIMIT = 1_500_000


@router.get("/{release_id}")
def stream_audio(
    release_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Streams audio files with plan-based gating.

    Starter tier receives a 45-second preview, while higher tiers
    receive the full file.
    """
    try:
        from bson import ObjectId
        query_id = ObjectId(release_id)
    except Exception:
        query_id = release_id
    release = db.releases.find_one({"$or": [{"_id": query_id}, {"_id": release_id}]})
    if not release:
        # Check dsp_releases in SQL if not in Mongo (for monorepo compatibility)
        raise HTTPException(status_code=404, detail="Track release not found")

    audio_url = release.get("audio_url")
    if not audio_url:
        raise HTTPException(status_code=404, detail="Audio track file not found")

    # Access check: default to starter if not logged in
    user_plan = "starter"
    if current_user:
        user_plan = current_user.get("plan", "starter")

    is_starter = user_plan == "starter"

    # --- Case 1: Local Fallback File ---
    if "/uploads/" in audio_url:
        relative_path = audio_url.split("/uploads/")[-1]
        local_file_path = os.path.join(
            os.environ.get("LOCAL_UPLOADS_DIR", "uploads"), relative_path
        )
        if os.path.exists(local_file_path):
            if is_starter:
                logger.info(f"Serving 45s preview of local file {relative_path} to starter user.")
                # Read and stream only the first N bytes
                def local_generator():
                    with open(local_file_path, "rb") as f:
                        bytes_read = 0
                        while bytes_read < PREVIEW_BYTE_LIMIT:
                            chunk_size = min(4096, PREVIEW_BYTE_LIMIT - bytes_read)
                            chunk = f.read(chunk_size)
                            if not chunk:
                                break
                            yield chunk
                            bytes_read += len(chunk)
                return StreamingResponse(local_generator(), media_type="audio/mpeg")
            else:
                logger.info(f"Serving full local file {relative_path} to plan {user_plan}.")
                return FileResponse(local_file_path, media_type="audio/mpeg")
        elif is_starter:
            logger.info(f"Local file {relative_path} does not exist. Serving empty preview.")
            return StreamingResponse(iter([]), media_type="audio/mpeg")

    # --- Case 2: Remote S3/R2 File ---
    if is_starter:
        logger.info(f"Serving 45s preview of remote file {audio_url} to starter user.")
        # Fetch range-limited chunk from remote server and stream it
        def remote_generator():
            try:
                req = Request(audio_url)
                req.add_header("Range", f"bytes=0-{PREVIEW_BYTE_LIMIT}")
                with urlopen(req) as response:
                    while True:
                        chunk = response.read(4096)
                        if not chunk:
                            break
                        yield chunk
            except Exception as e:
                logger.error(f"Error fetching remote audio preview: {e}")
                raise HTTPException(status_code=500, detail="Error streaming preview") from e
        return StreamingResponse(remote_generator(), media_type="audio/mpeg")

    logger.info(f"Redirecting to full remote file {audio_url} for plan {user_plan}.")
    return RedirectResponse(url=audio_url)
