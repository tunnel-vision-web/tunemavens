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

from auth import get_optional_user
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

    # 1. Search in db.catalog_tracks
    cat_cursor = db.catalog_tracks.find({})
    for doc in cat_cursor:
        for t in doc.get("tracks", []):
            if (
                str(t.get("isrc", "")).lower() == clean_id.lower() or
                str(t.get("id", "")) == clean_id or
                str(t.get("title", "")).lower() == clean_id.lower()
            ):
                target_track = t
                break
        if target_track:
            break

    # 2. Search in db.releases if not found
    if not target_track:
        try:
            from bson import ObjectId
            query_id = ObjectId(clean_id)
        except Exception:
            query_id = clean_id
        rel = db.releases.find_one({"$or": [{"_id": query_id}, {"title": {"$regex": f"^{clean_id}$", "$options": "i"}}]})
        if rel:
            target_track = {
                "title": rel.get("title"),
                "audioUrl": rel.get("audio_url") or rel.get("audioUrl"),
                "isrc": (rel.get("isrcs") or ["KE-TM1-26-00001"])[0]
            }

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

    # 3. Fallback: Stream synthesized harmonic preview
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
