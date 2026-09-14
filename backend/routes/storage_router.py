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
    """List all assets (audio, images, videos, AI art) and cross-reference with EPK active usage."""
    clean_sub = (subdomain or "ndufo").lower().strip()
    
    # 1. Gather all media currently referenced on the EPK and CMS layout
    in_use_map = {}  # url -> list of contexts where used
    
    def register_in_use(url: Optional[str], context: str):
        if not url or not isinstance(url, str):
            return
        u = url.strip()
        if not u:
            return
        if u not in in_use_map:
            in_use_map[u] = []
        if context not in in_use_map[u]:
            in_use_map[u].append(context)

    epk = db.epks.find_one({"subdomain": clean_sub}) or {}
    cms = db.cms_layouts.find_one({"layout_id": f"epk_{clean_sub}"}) or {}
    cms_data = cms.get("data") or {}

    # Hero slides
    for slide in epk.get("heroSlides", []) + (cms_data.get("hero") or {}).get("slides", []):
        if isinstance(slide, dict):
            register_in_use(slide.get("image") or slide.get("url"), "Hero Slide")
        elif isinstance(slide, str):
            register_in_use(slide, "Hero Slide")

    # Page headers
    for page_key, header_url in {**epk.get("pageHeaders", {}), **(cms_data.get("pageHeaders") or {})}.items():
        register_in_use(header_url, f"Page Header ({page_key.capitalize()})")

    # Tracks audio and covers
    for t in epk.get("tracks", []) + cms_data.get("tracks", []):
        if isinstance(t, dict):
            register_in_use(t.get("audioUrl") or t.get("fileUrl"), f"Audio: {t.get('title', 'Track')}")
            register_in_use(t.get("coverArt"), f"Cover: {t.get('title', 'Track')}")

    # Media gallery & videos
    for m in epk.get("media", []) + cms_data.get("media", []):
        if isinstance(m, dict):
            register_in_use(m.get("url"), f"Media: {m.get('title', 'Gallery')}")
            register_in_use(m.get("thumbnail"), f"Thumbnail: {m.get('title', 'Gallery')}")

    # Profile & logo
    register_in_use(epk.get("logoUrl") or cms_data.get("logoUrl"), "Logo / Branding")
    register_in_use(epk.get("profileImage") or cms_data.get("profileImage"), "Profile Avatar")

    # 2. Query stored assets from db.assets
    query = {}
    if media_type and media_type != "all":
        query["media_type"] = media_type

    if current_user and "_id" in current_user:
        query["$or"] = [{"user_id": str(current_user["_id"])}, {"subdomain": clean_sub}]
    elif clean_sub:
        query["subdomain"] = clean_sub

    cursor = db.assets.find(query).sort("created_at", -1)
    results = []
    seen_urls = set()

    for doc in cursor:
        doc["id"] = str(doc.get("id") or doc.get("_id"))
        doc.pop("_id", None)
        url = doc.get("media_url", "")
        seen_urls.add(url)
        
        # Check in-use status
        if url in in_use_map:
            doc["in_use_on_epk"] = True
            doc["used_in"] = in_use_map[url]
        else:
            doc["in_use_on_epk"] = False
            doc["used_in"] = []
            
        results.append(doc)

    # 3. For any in-use EPK assets that were not in db.assets, synthesize asset records
    for in_use_url, contexts in in_use_map.items():
        if in_use_url not in seen_urls:
            m_type = detect_media_type(in_use_url)
            if media_type and media_type != "all" and m_type != media_type:
                continue
            synth_title = " / ".join(contexts[:2])
            synth_doc = {
                "id": f"epk_{abs(hash(in_use_url))}",
                "user_id": clean_sub,
                "subdomain": clean_sub,
                "filename": Path(in_use_url.split("?")[0]).name or "epk_asset.jpg",
                "title": synth_title,
                "media_type": m_type,
                "media_url": in_use_url,
                "prompt": f"Active EPK asset: {synth_title}",
                "size_bytes": 450000 if m_type == "image" else 4500000,
                "content_type": "image/jpeg" if m_type == "image" else "audio/mpeg",
                "in_use_on_epk": True,
                "used_in": contexts,
                "created_at": datetime.now(timezone.utc)
            }
            results.append(synth_doc)
            seen_urls.add(in_use_url)

    return results


class AssetUpdatePayload(BaseModel):
    title: Optional[str] = None
    media_url: Optional[str] = None
    filename: Optional[str] = None


@router.put("/assets/{asset_id}")
def update_storage_asset(
    asset_id: str,
    payload: AssetUpdatePayload,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Updates an asset's title or replaces its media URL."""
    update_data = {}
    if payload.title:
        update_data["title"] = payload.title
    if payload.media_url:
        update_data["media_url"] = payload.media_url
        update_data["content_type"] = "audio/mpeg" if detect_media_type(payload.media_url) == "audio" else "image/jpeg"
        update_data["media_type"] = detect_media_type(payload.media_url)
    if payload.filename:
        update_data["filename"] = payload.filename
    update_data["updated_at"] = datetime.now(timezone.utc)

    try:
        oid = ObjectId(asset_id)
        db.assets.update_one({"_id": oid}, {"$set": update_data})
    except Exception:
        db.assets.update_one({"id": asset_id}, {"$set": update_data})

    return {"status": "success", "asset_id": asset_id, "updated": update_data}


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


class StorageTopUpRequest(BaseModel):
    package_id: str  # "storage_500mb" | "storage_1gb" | "storage_5gb"


STORAGE_PACKAGES = {
    "storage_500mb": {"name": "+500 MB Storage", "additional_mb": 500, "credits": 50},
    "storage_1gb": {"name": "+1 GB Storage", "additional_mb": 1024, "credits": 90},
    "storage_5gb": {"name": "+5 GB High-Capacity Storage", "additional_mb": 5120, "credits": 350},
    "starter_topup": {"name": "+500 MB Storage Pack", "additional_mb": 500, "credits": 50},
    "pro_topup": {"name": "+1 GB Pro Storage Pack", "additional_mb": 1024, "credits": 90},
    "enterprise_topup": {"name": "+5 GB Studio Storage Pack", "additional_mb": 5120, "credits": 350},
}


@router.get("/quota", response_model=Dict[str, Any])
def get_storage_quota(
    subdomain: Optional[str] = "ndufo",
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Returns storage used, total allotted quota (starter: 500MB), and available credits."""
    clean_sub = (subdomain or "ndufo").lower().strip()
    user_id = str(current_user["_id"]) if current_user and "_id" in current_user else None
    
    q = {}
    if user_id:
        q = {"$or": [{"user_id": user_id}, {"subdomain": clean_sub}]}
    else:
        q = {"subdomain": clean_sub}
        
    cursor = db.assets.find(q)
    total_bytes = sum(int(doc.get("size_bytes") or 450000) for doc in cursor)
    
    quota_mb = 500  # Default starter quota: 500 MB
    user_credits = 600
    if current_user:
        quota_mb = int(current_user.get("storage_quota_mb") or 500)
        user_credits = int(current_user.get("credits") or 0)
    else:
        u = db.users.find_one({"$or": [{"username": clean_sub}, {"email": f"{clean_sub}@tunemavens.com"}]})
        if u:
            quota_mb = int(u.get("storage_quota_mb") or 500)
            user_credits = int(u.get("credits") or 0)

    used_mb = round(total_bytes / (1024 * 1024), 2)
    pct_used = min(100.0, round((used_mb / max(1, quota_mb)) * 100, 1))

    return {
        "status": "success",
        "subdomain": clean_sub,
        "used_bytes": total_bytes,
        "used_mb": used_mb,
        "quota_mb": quota_mb,
        "pct_used": pct_used,
        "credits": user_credits,
        "packages": [
            {"id": k, **v} for k, v in STORAGE_PACKAGES.items()
        ]
    }


@router.post("/top-up", response_model=Dict[str, Any])
def top_up_storage(
    payload: StorageTopUpRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Top-up storage space using user credits."""
    pkg = STORAGE_PACKAGES.get(payload.package_id)
    if not pkg:
        raise HTTPException(status_code=400, detail=f"Invalid storage package: {payload.package_id}")

    cost = pkg["credits"]
    extra_mb = pkg["additional_mb"]

    user_doc = None
    if current_user and "_id" in current_user:
        user_doc = db.users.find_one({"_id": current_user["_id"]})
    if not user_doc:
        user_doc = db.users.find_one({"role": "creator"}) or db.users.find_one({})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User account not found.")

    current_credits = int(user_doc.get("credits") or 0)
    if current_credits < cost:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient credits. This package requires {cost} credits, but you have {current_credits} credits."
        )

    new_credits = current_credits - cost
    new_quota = int(user_doc.get("storage_quota_mb") or 500) + extra_mb

    db.users.update_one(
        {"_id": user_doc["_id"]},
        {"$set": {"credits": new_credits, "storage_quota_mb": new_quota, "updated_at": datetime.now(timezone.utc)}}
    )

    return {
        "status": "success",
        "success": True,
        "message": f"Successfully topped up storage by +{extra_mb} MB for {cost} credits!",
        "storage_quota_mb": new_quota,
        "new_quota_mb": new_quota,
        "credits": new_credits,
        "remaining_credits": new_credits,
        "added_mb": extra_mb
    }
