"""Storage Router for AWS S3 / Cloudflare R2 presigned URL generation."""
from typing import Optional


from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from services.s3_storage import storage

router = APIRouter(prefix="/api/storage", tags=["storage"])


class PresignedUploadRequest(BaseModel):
    filename: str
    content_type: str
    folder: Optional[str] = "stems"
    expires_in: Optional[int] = 3600


class PresignedDownloadRequest(BaseModel):
    file_key: str
    expires_in: Optional[int] = 3600


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
