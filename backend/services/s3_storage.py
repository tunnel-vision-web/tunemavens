"""S3/R2 Storage Service for TuneMavens backend.

Handles uploading files to Cloudflare R2 or AWS S3.
Falls back to local file storage if S3 credentials are not configured.
"""
from __future__ import annotations

import logging
import os
from pathlib import Path
import uuid
from typing import Optional

try:
    import boto3
    from botocore.exceptions import ClientError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

logger = logging.getLogger(__name__)

# --- Environment Configuration ---
S3_ENDPOINT_URL = os.environ.get("S3_ENDPOINT_URL")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "tunemaven-assets")
S3_PUBLIC_URL_PREFIX = os.environ.get("S3_PUBLIC_URL_PREFIX")  # Optional Custom CDN/Domain prefix

# Local fallback settings
LOCAL_UPLOADS_DIR = Path(os.environ.get("LOCAL_UPLOADS_DIR", "uploads"))
LOCAL_UPLOADS_URL_PREFIX = os.environ.get("LOCAL_UPLOADS_URL_PREFIX", "http://localhost:8001/uploads")


class StorageManager:
    def __init__(self) -> None:
        self.use_s3 = BOTO3_AVAILABLE and bool(AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)
        self.s3_client = None

        if self.use_s3:
            try:
                session = boto3.session.Session()
                self.s3_client = session.client(
                    service_name="s3",
                    aws_access_key_id=AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                    endpoint_url=S3_ENDPOINT_URL,
                )
                logger.info("S3/R2 storage client initialized successfully.")
            except Exception as e:
                logger.warning(
                    f"Failed to initialize S3 client: {e}. Falling back to local storage."
                )
                self.use_s3 = False
        else:
            if not BOTO3_AVAILABLE:
                logger.warning("boto3 package not installed. Using local storage fallback.")
            else:
                logger.warning("S3 credentials not fully configured. Using local storage fallback.")
            
            # Ensure local uploads dir exists
            LOCAL_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

    def upload_file(
        self,
        file_bytes: bytes,
        original_filename: str,
        content_type: str,
        folder: str = "general",
    ) -> str:
        """Uploads file data and returns a public URL.

        Args:
            file_bytes: Raw binary content of the file.
            original_filename: Original filename (e.g. 'track.mp3').
            content_type: MIME type (e.g. 'audio/mpeg').
            folder: Bucket folder / path prefix.
        """
        # Generate a unique filename to prevent collisions
        extension = Path(original_filename).suffix
        unique_filename = f"{folder}/{uuid.uuid4()}{extension}"

        if self.use_s3:
            try:
                self.s3_client.put_object(
                    Bucket=S3_BUCKET_NAME,
                    Key=unique_filename,
                    Body=file_bytes,
                    ContentType=content_type,
                )
                
                # Resolve public URL
                if S3_PUBLIC_URL_PREFIX:
                    return f"{S3_PUBLIC_URL_PREFIX.rstrip('/')}/{unique_filename}"
                elif S3_ENDPOINT_URL:
                    # R2 / Localstack Endpoint syntax
                    return f"{S3_ENDPOINT_URL.rstrip('/')}/{S3_BUCKET_NAME}/{unique_filename}"
                else:
                    # AWS standard bucket URL
                    return f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{unique_filename}"
            except ClientError as e:
                logger.error(f"S3 upload failed: {e}. Attempting local fallback.")
                # Fall through to local fallback if S3 upload fails unexpectedly

        # Local fallback execution
        local_path = LOCAL_UPLOADS_DIR / unique_filename
        local_path.parent.mkdir(parents=True, exist_ok=True)
        local_path.write_bytes(file_bytes)
        
        # Return local dev URL
        safe_filename = unique_filename.replace('\\', '/')
        return f"{LOCAL_UPLOADS_URL_PREFIX.rstrip('/')}/{safe_filename}"

    def generate_presigned_upload_url(
        self,
        filename: str,
        content_type: str,
        folder: str = "stems",
        expires_in: int = 3600,
    ) -> dict:
        """Generates a presigned URL for direct browser-to-S3/R2 uploads.

        Returns a dictionary with 'upload_url', 'file_key', 'public_url', and 'is_s3'.
        """
        extension = Path(filename).suffix
        file_key = f"{folder}/{uuid.uuid4()}{extension}"

        if self.use_s3:
            try:
                upload_url = self.s3_client.generate_presigned_url(
                    ClientMethod="put_object",
                    Params={
                        "Bucket": S3_BUCKET_NAME,
                        "Key": file_key,
                        "ContentType": content_type,
                    },
                    ExpiresIn=expires_in,
                )
                if S3_PUBLIC_URL_PREFIX:
                    public_url = f"{S3_PUBLIC_URL_PREFIX.rstrip('/')}/{file_key}"
                else:
                    public_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file_key}"

                return {
                    "upload_url": upload_url,
                    "file_key": file_key,
                    "public_url": public_url,
                    "is_s3": True,
                    "expires_in": expires_in,
                }
            except Exception as e:
                logger.error(f"Failed to generate S3 presigned upload URL: {e}")

        # Local fallback simulation URL
        safe_key = file_key.replace("\\", "/")
        fallback_upload_url = f"{LOCAL_UPLOADS_URL_PREFIX.rstrip('/')}/upload-fallback?key={safe_key}"
        public_url = f"{LOCAL_UPLOADS_URL_PREFIX.rstrip('/')}/{safe_key}"
        return {
            "upload_url": fallback_upload_url,
            "file_key": file_key,
            "public_url": public_url,
            "is_s3": False,
            "expires_in": expires_in,
        }

    def generate_presigned_download_url(
        self,
        file_key: str,
        expires_in: int = 3600,
    ) -> str:
        """Generates a temporary presigned URL for accessing protected stem assets."""
        if self.use_s3:
            try:
                return self.s3_client.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={
                        "Bucket": S3_BUCKET_NAME,
                        "Key": file_key,
                    },
                    ExpiresIn=expires_in,
                )
            except Exception as e:
                logger.error(f"Failed to generate S3 presigned download URL: {e}")

        safe_key = file_key.replace("\\", "/")
        return f"{LOCAL_UPLOADS_URL_PREFIX.rstrip('/')}/{safe_key}"


# Global single instance export
storage = StorageManager()

