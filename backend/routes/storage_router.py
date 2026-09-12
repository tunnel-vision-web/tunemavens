"""Storage Router for AWS S3 / Cloudflare R2 / Local Storage and Asset Manager Media."""
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from pathlib import Path
import uuid
import base64
import logging

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from pydantic import BaseModel
from bson import ObjectId

from auth import get_current_user, get_optional_user
from services.s3_storage import storage
from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/storage", tags=["storage"])


class PresignedUploadRequest(BaseModel):
    filename: str
    content_type: str
    folder: Optional[str] = "stems"
    expires_in: Optional[int] = 3600


class PresignedDownloadRequest(BaseModel):
    file_key: str
    expires_in: Optional[int] = 3600


class Base64UploadRequest(BaseModel):
    filename: str
    data_base64: str
    content_type: Optional[str] = None
    folder: Optional[str] = "media"
    subdomain: Optional[str] = "ndufo"
    title: Optional[str] = None


@router.post("/presigned-upload")
def request_presigned_upload(
    payload: PresignedUploadRequest,
    current_user: dict = Depends(get_current_user),
):
    """Requests a presigned upload URL for direct browser-to-S3/R2 upload."""
    if not payload.filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    result = storage.generate_presigned_upload_url(
        filename=payload.filename,
        content_type=payload.content_type,
        folder=payload.folder or "stems",
        expires_in=payload.expires_in or 3600,
    )
    return result


@router.post("/presigned-download")
def request_presigned_download(
    payload: PresignedDownloadRequest,
    current_user: dict = Depends(get_current_user),
):
    """Requests a temporary presigned URL for downloading protected stem assets."""
    if not payload.file_key:
        raise HTTPException(status_code=400, detail="file_key is required")

    url = storage.generate_presigned_download_url(
        file_key=payload.file_key,
        expires_in=payload.expires_in or 3600,
    )
    return {"download_url": url, "file_key": payload.file_key}


def detect_media_type(filename: str, content_type: Optional[str] = None) -> str:
    ext = Path(filename).suffix.lower()
    ct = (content_type or "").lower()
    if ct.startswith("audio") or ext in [".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".aiff"]:
        return "audio"
    elif ct.startswith("video") or ext in [".mp4", ".mov", ".webm", ".mkv"]:
        return "video"
    else:
        return "image"


@router.post("/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    folder: str = Form("audio"),
    subdomain: str = Form("ndufo"),
    title: Optional[str] = Form(None),
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Uploads an audio, image, or video file into creator storage and indexes it in the Asset Manager."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file filename provided")

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    content_type = file.content_type or "application/octet-stream"
    media_type = detect_media_type(file.filename, content_type)
    
    # Force audio folder for audio files
    effective_folder = "audio" if media_type == "audio" else folder

    public_url = storage.upload_file(
        file_bytes=file_bytes,
        original_filename=file.filename,
        content_type=content_type,
        folder=effective_folder
    )

    clean_title = title or Path(file.filename).stem.replace("_", " ").replace("-", " ").title()
    user_id = str(current_user["_id"]) if current_user and "_id" in current_user else subdomain.lower()

    asset_doc = {
        "user_id": user_id,
        "subdomain": subdomain.lower(),
        "filename": file.filename,
        "title": clean_title,
        "media_type": media_type,
        "media_url": public_url,
        "prompt": f"Uploaded {media_type}: {clean_title}",
        "size_bytes": len(file_bytes),
        "content_type": content_type,
        "created_at": datetime.now(timezone.utc)
    }

    res = db.assets.insert_one(asset_doc)
    asset_doc["id"] = str(res.inserted_id)
    if "_id" in asset_doc:
        asset_doc.pop("_id")

    return {
        "status": "success",
        "url": public_url,
        "asset": asset_doc,
        "media_type": media_type
    }


@router.post("/upload-base64")
def upload_base64_media(
    payload: Base64UploadRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Accepts base64 encoded media (e.g. edited artwork, audio export) and stores it."""
    raw_data = payload.data_base64
    if "," in raw_data:
        raw_data = raw_data.split(",", 1)[1]

    try:
        file_bytes = base64.b64decode(raw_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 payload: {e}")

    content_type = payload.content_type or "image/png"
    media_type = detect_media_type(payload.filename, content_type)
    effective_folder = payload.folder or ("audio" if media_type == "audio" else "artwork")

    public_url = storage.upload_file(
        file_bytes=file_bytes,
        original_filename=payload.filename,
        content_type=content_type,
        folder=effective_folder
    )

    clean_title = payload.title or Path(payload.filename).stem.replace("_", " ").replace("-", " ").title()
    user_id = str(current_user["_id"]) if current_user and "_id" in current_user else payload.subdomain.lower()

    asset_doc = {
        "user_id": user_id,
        "subdomain": payload.subdomain.lower(),
        "filename": payload.filename,
        "title": clean_title,
        "media_type": media_type,
        "media_url": public_url,
        "prompt": f"Uploaded {media_type}: {clean_title}",
        "size_bytes": len(file_bytes),
        "content_type": content_type,
        "created_at": datetime.now(timezone.utc)
    }

    res = db.assets.insert_one(asset_doc)
    asset_doc["id"] = str(res.inserted_id)
    if "_id" in asset_doc:
        asset_doc.pop("_id")

    return {
        "status": "success",
        "url": public_url,
        "asset": asset_doc,
        "media_type": media_type
    }


@router.get("/assets")
def list_storage_assets(
    media_type: Optional[str] = None,
    subdomain: Optional[str] = "ndufo",
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """List all assets (audio, images, videos) from the Asset Manager."""
    query = {}
    if media_type and media_type != "all":
        query["media_type"] = media_type

    if current_user and "_id" in current_user:
        query["$or"] = [{"user_id": str(current_user["_id"])}, {"subdomain": subdomain.lower()}]
    elif subdomain:
        query["subdomain"] = subdomain.lower()

    cursor = db.assets.find(query).sort("created_at", -1)
    results = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        results.append(doc)

    return results


@router.delete("/assets/{asset_id}")
def delete_storage_asset(
    asset_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Deletes an asset from the asset manager."""
    try:
        oid = ObjectId(asset_id)
        db.assets.delete_one({"_id": oid})
    except Exception:
        db.assets.delete_one({"id": asset_id})
    return {"status": "success", "deleted_id": asset_id}
