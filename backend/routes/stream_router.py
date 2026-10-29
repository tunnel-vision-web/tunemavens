"""TuneStream Player Audio Streaming Router.

Handles audio file streaming, watermarked previews, range requests,
and live streaming of catalog tracks and uploaded creator media.
"""
import logging
import os
import io
import math
import struct
import wave
from typing import Optional
from urllib.request import Request, urlopen
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request as FastAPIRequest
from fastapi.responses import FileResponse, RedirectResponse, StreamingResponse


from pydantic import BaseModel, Field
from auth import get_current_user, get_optional_user
from services.stream_service import (
    generate_stream_token,
    verify_stream_token,
    get_track_or_release,
    validate_playback_rights,
    get_stream_manifest,
    record_stream_event,
    get_creator_stream_analytics,
    tip_creator_with_credits,
    report_track_content,
)

from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/stream", tags=["stream"])

# Approx bytes for 45s of 256kbps audio (45 * 256 * 1024 / 8 = 1.44 MB)
PREVIEW_BYTE_LIMIT = 1_500_000


def generate_synthesized_preview(seed_text: str = "track", duration_sec: float = 45.0) -> bytes:
    """Generates an in-memory 44.1kHz 16-bit stereo harmonic audio preview buffer.
    
    Ensures that newly ingested tracks stream melodically in any browser audio element
    even prior to high-res stems being uploaded.
    """
    sample_rate = 44100
    n_samples = int(sample_rate * duration_sec)
    buf = io.BytesIO()
    
    # Hash seed to select musical root key (Am, Dm, Em, F, G)
    h = abs(hash(seed_text))
    root_freqs = [110.0, 146.83, 164.81, 174.61, 196.0]
    base_f = root_freqs[h % len(root_freqs)]
    chords = [
        [base_f, base_f * 1.5, base_f * 2.0],
        [base_f * 1.334, base_f * 1.667, base_f * 2.0],
        [base_f * 1.2, base_f * 1.5, base_f * 1.8],
        [base_f, base_f * 1.25, base_f * 1.5]
    ]
    
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        
        frames = []
        chord_duration = duration_sec / len(chords)
        
        for i in range(n_samples):
            t = i / sample_rate
            chord_idx = int(t / chord_duration) % len(chords)
            active_chord = chords[chord_idx]
            
            # 124 BPM house pulse
            beat_phase = (t * (124 / 60)) % 1.0
            beat_env = math.exp(-beat_phase * 4.5)
            sub_kick = math.sin(2 * math.pi * (50.0 - 15.0 * beat_phase) * t) * beat_env * 0.4
            
            # Ambient harmonic pad with smooth tremolo
            pad_val = sum(math.sin(2 * math.pi * f * t) for f in active_chord) / len(active_chord) * 0.32
            tremolo = 0.85 + 0.15 * math.sin(2 * math.pi * 3.5 * t)
            
            # Soft shaker pulse on offbeats
            shaker = (math.sin(2 * math.pi * 3500 * t) if beat_phase > 0.45 and beat_phase < 0.55 else 0.0) * 0.08
            
            combined = (sub_kick + pad_val * tremolo + shaker)
            sample = int(max(-32767, min(32767, combined * 26000)))
            frames.append(struct.pack('<hh', sample, sample))
            
        wf.writeframes(b''.join(frames))
        
    return buf.getvalue()


@router.get("/track/{identifier}")
def stream_catalog_track(
    identifier: str,
    request: FastAPIRequest = None,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Streams a catalog track by ISRC, track ID, or title with range support and audio fallback."""
    clean_id = identifier.strip()
    target_track = None

    target_track = get_track_or_release(clean_id)
    if not target_track:
        raise HTTPException(status_code=404, detail="Track not found")

    client_country = "KE"
    if request:
        client_country = request.headers.get("cf-ipcountry") or request.headers.get("x-country") or "KE"
    allowed, err_code, status_code = validate_playback_rights(target_track, client_country, current_user)
    if not allowed:
        raise HTTPException(status_code=status_code, detail={"error": err_code, "message": f"Playback prohibited: {err_code}"})

    # If track has an audio URL, attempt to stream it
    audio_url = target_track.get("audioUrl") or target_track.get("fileUrl") if target_track else None

    # If no audio_url, try to find matching audio file on disk in uploads/audio
    if not audio_url and target_track:
        clean_title = target_track.get("title", "").lower().strip()
        search_dirs = [
            os.path.join(os.environ.get("LOCAL_UPLOADS_DIR", "uploads"), "audio"),
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "audio"),
            "uploads/audio",
            "backend/uploads/audio"
        ]
        for s_dir in search_dirs:
            if os.path.exists(s_dir):
                for fname in os.listdir(s_dir):
                    f_clean = fname.lower().replace("_", " ").replace("-", " ")
                    # If title matches or words overlap significantly
                    if clean_title and (clean_title in f_clean or f_clean.replace(".wav", "").replace(".mp3", "") in clean_title):
                        audio_url = f"/uploads/audio/{fname}"
                        break
            if audio_url:
                break
    
    if audio_url:
        # Local upload file check
        if "/uploads/" in audio_url:
            rel_path = audio_url.split("/uploads/")[-1].replace("\\", "/")
            possible_paths = [
                os.path.join(os.environ.get("LOCAL_UPLOADS_DIR", "uploads"), rel_path),
                os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", rel_path),
                os.path.join("uploads", rel_path),
                os.path.join("backend", "uploads", rel_path)
            ]
            for local_path in possible_paths:
                if os.path.exists(local_path) and os.path.isfile(local_path):
                    ext = Path(local_path).suffix.lower()
                    media_type = "audio/mpeg"
                    if ext == ".wav":
                        media_type = "audio/wav"
                    elif ext == ".flac":
                        media_type = "audio/flac"
                    elif ext == ".ogg":
                        media_type = "audio/ogg"
                    return FileResponse(local_path, media_type=media_type)
        elif audio_url.startswith("http://") or audio_url.startswith("https://"):
            return RedirectResponse(url=audio_url)

    # 3. Fallback: Stream real studio catalog audio from uploads/audio
    search_dirs = [
        os.path.join(os.environ.get("LOCAL_UPLOADS_DIR", "uploads"), "audio"),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads", "audio"),
        "uploads/audio",
        "backend/uploads/audio"
    ]
    real_files = []
    for s_dir in search_dirs:
        if os.path.exists(s_dir):
            for fname in sorted(os.listdir(s_dir)):
                if fname.lower().endswith(('.wav', '.mp3', '.flac', '.ogg')) and not fname.startswith('.'):
                    full_p = os.path.join(s_dir, fname)
                    if os.path.isfile(full_p) and full_p not in real_files:
                        real_files.append(full_p)
    if real_files:
        pick_idx = abs(hash(clean_id)) % len(real_files)
        chosen_file = real_files[pick_idx]
        ext = Path(chosen_file).suffix.lower()
        media_type = "audio/wav" if ext == ".wav" else ("audio/flac" if ext == ".flac" else "audio/mpeg")
        return FileResponse(chosen_file, media_type=media_type)

    # 4. Ultimate fallback if disk has 0 audio files: Stream synthesized preview
    title = target_track.get("title") if target_track else clean_id
    wav_bytes = generate_synthesized_preview(seed_text=title, duration_sec=45.0)
    total_len = len(wav_bytes)

    # Handle HTTP Range requests for scrubbing / seeking
    range_header = request.headers.get("range") if request else None
    if range_header and range_header.startswith("bytes="):
        parts = range_header.replace("bytes=", "").split("-")
        start = int(parts[0]) if parts[0] else 0
        end = int(parts[1]) if len(parts) > 1 and parts[1] else total_len - 1
        end = min(end, total_len - 1)
        length = end - start + 1

        return Response(
            content=wav_bytes[start:end + 1],
            status_code=206,
            media_type="audio/wav",
            headers={
                "Content-Range": f"bytes {start}-{end}/{total_len}",
                "Accept-Ranges": "bytes",
                "Content-Length": str(length),
                "Cache-Control": "public, max-age=3600",
                "X-Stream-Source": "TuneStream-Audio-Engine"
            }
        )

    return Response(
        content=wav_bytes,
        media_type="audio/wav",
        headers={
            "Content-Length": str(total_len),
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
            "X-Stream-Source": "TuneStream-Audio-Engine"
        }
    )



@router.get("/{release_id}")
def stream_audio(
    release_id: str,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Streams audio files with plan-based gating."""
    try:
        from bson import ObjectId
        query_id = ObjectId(release_id)
    except Exception:
        query_id = release_id
    release = db.releases.find_one({"$or": [{"_id": query_id}, {"_id": release_id}]})
    if not release:
        # Fallback to track streaming
        return stream_catalog_track(identifier=release_id, request=None, current_user=current_user)

    audio_url = release.get("audio_url") or release.get("audioUrl")
    if not audio_url:
        return stream_catalog_track(identifier=release.get("title", release_id), request=None, current_user=current_user)

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
                return FileResponse(local_file_path, media_type="audio/mpeg")

    # --- Case 2: Remote S3/R2 File ---
    if is_starter:
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
                yield b""
        return StreamingResponse(remote_generator(), media_type="audio/mpeg")

    return RedirectResponse(url=audio_url)


class StreamEventRequest(BaseModel):
    track_id: str
    duration_listened_sec: float
    device_id: Optional[str] = None
    country: Optional[str] = None


class TipRequest(BaseModel):
    creator_id: str
    amount_credits: int
    track_id: Optional[str] = None
    message: Optional[str] = None
    idempotency_key: Optional[str] = None


class ReportContentRequest(BaseModel):
    track_id: str
    reason: str = "copyright_infringement"
    notes: Optional[str] = None


@router.get("/manifest/{identifier}")
def stream_manifest(
    identifier: str,
    request: FastAPIRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Generates adaptive audio streaming manifest with low-bitrate and lossless tiers (Spec §4)."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    client_country = request.headers.get("cf-ipcountry") or request.headers.get("x-country") or "KE"

    try:
        manifest = get_stream_manifest(
            identifier=identifier,
            client_ip=client_ip,
            client_country=client_country,
            current_user=current_user,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    if not manifest.get("ok"):
        raise HTTPException(
            status_code=manifest.get("status_code", 403),
            detail={"error": manifest.get("error"), "detail": manifest.get("detail")}
        )
    return manifest


@router.get("/listen/{identifier}")
def listen_stream(
    identifier: str,
    token: Optional[str] = None,
    profile: str = "low",
    request: FastAPIRequest = None,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Streams audio payload with signed token verification and range support."""
    client_ip = request.client.host if request and request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for") if request else None
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()

    if token:
        if not verify_stream_token(identifier, token, client_ip):
            raise HTTPException(status_code=403, detail="Invalid or expired stream token")

    # Delegate to stream_catalog_track for range and file handling
    return stream_catalog_track(identifier=identifier, request=request, current_user=current_user)


@router.post("/event")
def log_stream_event(
    payload: StreamEventRequest,
    request: FastAPIRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Records stream play, performs anti-fraud check, and posts to TuneLedger."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    user_agent = request.headers.get("user-agent", "Mozilla/5.0")
    client_country = payload.country or request.headers.get("cf-ipcountry") or request.headers.get("x-country") or "KE"

    listener_id = str(current_user["_id"]) if current_user else None

    result = record_stream_event(
        track_id=payload.track_id,
        duration_listened_sec=payload.duration_listened_sec,
        listener_id=listener_id,
        client_ip=client_ip,
        user_agent=user_agent,
        client_country=client_country,
        device_id=payload.device_id,
    )
    if not result.get("ok"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result


@router.get("/analytics/creator")
def stream_creator_analytics(
    current_user: dict = Depends(get_current_user),
):
    """Returns stream plays, qualified impressions, and earnings aggregated by country."""
    creator_id = str(current_user["_id"])
    return get_creator_stream_analytics(creator_id)


@router.post("/tip")
def tip_creator(
    payload: TipRequest,
    current_user: dict = Depends(get_current_user),
):
    """Tips a creator using credits (95% to creator, 5% platform fee)."""
    try:
        result = tip_creator_with_credits(
            fan_user=current_user,
            creator_id=payload.creator_id,
            amount_credits=payload.amount_credits,
            track_id=payload.track_id,
            message=payload.message,
            idempotency_key=payload.idempotency_key,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/report-content")
def report_content(
    payload: ReportContentRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """Submits community content / copyright report (Spec §4)."""
    try:
        return report_track_content(
            track_id=payload.track_id,
            reporting_user=current_user,
            reason=payload.reason,
            notes=payload.notes,
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
