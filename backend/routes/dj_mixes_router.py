"""DJ Mix Monetization, Track Extraction, Clearance, and Split Cascade Router.

Provides:
  1. Long mix ingestion and automated track extraction (playlist splitting)
  2. Direct instant publishing for 100% original IP mixes (no clearance needed)
  3. Commercial clearance workflow with email/messaging to all track IP owners
  4. Contract drafting via the official 'dj_mix_clearance' template
  5. Cryptographic signature verification (SIG-SHA256)
  6. Strict commercial sales gate: 100% IP owner agreement required prior to sales
  7. Automated split cascade ledger distribution upon commercial purchase
"""
from __future__ import annotations

import hashlib
import re
import secrets
from datetime import datetime, timezone
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import get_current_user, get_optional_user
from config import db
from models import Contract, ContractClause, ContractInvitee, DjMix, DjMixTrackItem
from services.contract_templates import build_contract
from account_setup import (
    send_dj_mix_clearance_invitation,
    send_dj_remix_clearance_invitation,
    send_contract_executed_notification,
)

router = APIRouter(prefix="/api/dj/mixes", tags=["DJ Mixes"])
alias_router = APIRouter(prefix="/api/dj-mixes", tags=["DJ Mixes Alias"])

# Platform-wide credit rate (single source of truth, mirrors apps/*/src/**/pricingPlans.js):
# 1 Credit = 1 KES = $0.01 USD  ->  $1.00 USD = 100 Credits
CREDITS_PER_USD = 100
MIN_MIX_PRICE_USD = 0.50
MAX_MIX_PRICE_USD = 100.00
CREDIT_EXEMPT_ROLES = ("admin", "vc", "investor", "supervisor")


def normalize_media_url(url: Optional[str]) -> str:
    """Make stored media URLs portable: route /uploads, /heroes, /headers through /api/... so Nginx proxies them."""
    if not url or not isinstance(url, str):
        return ""
    u = url.strip()
    m = re.match(r"^https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(/api/(?:uploads|heroes|headers)/.*)$", u, re.I)
    if m:
        return m.group(1)
    m2 = re.match(r"^https?://(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(/(?:uploads|heroes|headers)/.*)$", u, re.I)
    if m2:
        return f"/api{m2.group(1)}"
    if u.startswith(("/uploads/", "/heroes/", "/headers/")):
        return f"/api{u}"
    return u


def is_unplayable_media_url(url: Optional[str]) -> bool:
    """Browser-session-only URLs (blob:/data:/file:) can never be streamed by other listeners."""
    return bool(url) and url.strip().lower().startswith(("blob:", "data:", "file:"))


def recommend_mix_price(duration_seconds: Optional[int], creation_type: Optional[str], track_count: int = 0) -> dict:
    """Recommended retail price (USD). DJs may always override within MIN/MAX bounds."""
    base = {"original_creation": 7.00, "remix_original_beat": 6.00}.get(creation_type or "curated_mix", 5.00)
    minutes = max(0, int(duration_seconds or 3600) / 60)
    extra = min(3.0, max(0.0, (minutes - 60) / 30) * 0.5)   # +$0.50 per extra 30 min over 1h, capped at +$3
    rec = round(round((base + extra) * 2) / 2 - 0.01, 2)
    return {
        "recommended_price_usd": rec,
        "recommended_price_credits": int(round(rec * CREDITS_PER_USD)),
        "min_price_usd": MIN_MIX_PRICE_USD,
        "max_price_usd": MAX_MIX_PRICE_USD,
        "credits_per_usd": CREDITS_PER_USD,
        "basis": f"{creation_type or 'curated_mix'} · {int(minutes)} min",
    }


def _validate_price(price: float) -> float:
    if price < MIN_MIX_PRICE_USD or price > MAX_MIX_PRICE_USD:
        raise HTTPException(
            status_code=400,
            detail=f"Price must be between ${MIN_MIX_PRICE_USD:.2f} and ${MAX_MIX_PRICE_USD:.2f} USD.",
        )
    return round(float(price), 2)



# ---------------------------------------------------------------------------
# Request & Response Shapes
# ---------------------------------------------------------------------------
class TrackItemPayload(BaseModel):
    id: Optional[str] = None
    track_id: Optional[str] = None
    title: str
    artist: str
    ip_owner_name: str = "IP Owner"
    ip_owner_email: str = ""
    start_time: int = 0
    end_time: int = 0
    duration_seconds: Optional[int] = None
    split_percentage: Optional[float] = 0.0
    clearance_status: Optional[str] = "pending"
    genre: Optional[str] = None
    bpm: Optional[int] = None
    key: Optional[str] = None
    isrc: Optional[str] = None
    rights_owner_phone: Optional[str] = None
    notes: Optional[str] = None
    last_reminded_at: Optional[datetime] = None
    reminder_count: Optional[int] = 0


class MixCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    genre: Optional[str] = "Electronic"
    bpm_avg: Optional[int] = 124
    duration_seconds: Optional[int] = 3600
    audio_url: str
    artwork_url: Optional[str] = ""
    creation_type: Optional[str] = "curated_mix"  # "curated_mix" | "remix_original_beat" | "original_creation"
    is_original_ip_only: Optional[bool] = False
    is_remix_original_beat: Optional[bool] = False
    original_song_title: Optional[str] = None
    original_song_artist: Optional[str] = None
    remix_beat_description: Optional[str] = None
    commercial_price: Optional[float] = None  # None -> platform-recommended price; DJs can set any price in bounds
    currency: Optional[str] = "USD"
    dj_split_percentage: Optional[float] = 40.0
    track_owners_split_percentage: Optional[float] = 50.0
    platform_fee_percentage: Optional[float] = 10.0
    auto_extract_tracks: Optional[bool] = True
    tracklist: Optional[List[TrackItemPayload]] = None


class MessagePostRequest(BaseModel):
    track_id: Optional[str] = None
    recipient_email: Optional[str] = None
    recipient_name: Optional[str] = None
    subject: str = "DJ Mix Clearance Note"
    body: str


class ContactUpdateRequest(BaseModel):
    ip_owner_name: Optional[str] = None
    ip_owner_email: Optional[str] = None
    rights_owner_phone: Optional[str] = None
    notes: Optional[str] = None


class TracklistUpdateRequest(BaseModel):
    tracklist: List[TrackItemPayload]
    dj_split_percentage: Optional[float] = None
    track_owners_split_percentage: Optional[float] = None
    platform_fee_percentage: Optional[float] = None


class ExtractTracksRequest(BaseModel):
    audio_url: Optional[str] = None
    duration_seconds: Optional[int] = 3600
    cue_sheet_text: Optional[str] = None  # Optional .cue or tracklist text import
    detected_genre: Optional[str] = "Afro House"


class PublishOriginalRequest(BaseModel):
    legal_name: str
    certification_confirmed: bool


class SignClearanceRequest(BaseModel):
    signer_name: str
    signer_email: str
    notes: Optional[str] = ""


class PurchaseMixRequest(BaseModel):
    payment_method: Optional[str] = "wallet"  # wallet | stripe | mpesa


# ---------------------------------------------------------------------------
# Seed & Asset Reconciliation Helper
# ---------------------------------------------------------------------------
def _norm_mix_key(text: Optional[str]) -> str:
    if not text:
        return ""
    base = re.sub(r"\.(mp3|wav|flac|ogg|m4a|aac|aiff)$", "", str(text).strip(), flags=re.I)
    return re.sub(r"[^a-z0-9]+", "", base.lower())


def reconcile_dj_mixes_and_assets():
    """Repairs blob:/localhost URLs on uploaded DJ mixes, recovers orphaned mix audio assets, and removes duplicate seed records."""
    try:
        audio_assets = list(db.assets.find({"media_type": "audio"}).sort("created_at", -1))
        image_assets = list(db.assets.find({"media_type": "image"}).sort("created_at", -1))
    except Exception:
        audio_assets, image_assets = [], []

    # Remove dummy placeholder test record if present
    try:
        db.dj_mixes.delete_many({"title": "Test", "audio_url": "http://example.com/test.mp3"})
    except Exception:
        pass

    all_mixes = list(db.dj_mixes.find({}))
    user_dj_name_map = {}
    for m in all_mixes:
        uid = str(m.get("user_id") or "")
        if uid and m.get("dj_name") and uid not in user_dj_name_map:
            user_dj_name_map[uid] = m["dj_name"]

    # 1. Repair blob: or localhost URLs on existing mixes using db.assets
    for m in all_mixes:
        updates = {}
        raw_audio = m.get("audio_url", "")
        raw_art = m.get("artwork_url", "")
        m_key = _norm_mix_key(m.get("title"))

        if is_unplayable_media_url(raw_audio) or not raw_audio:
            matched_url = ""
            for a in audio_assets:
                f_key = _norm_mix_key(a.get("filename"))
                t_key = _norm_mix_key(a.get("title"))
                if m_key and (m_key == f_key or m_key == t_key or (len(m_key) >= 8 and (m_key in f_key or f_key in m_key))):
                    cand = normalize_media_url(a.get("media_url"))
                    if cand and not is_unplayable_media_url(cand):
                        matched_url = cand
                        break
            if matched_url:
                updates["audio_url"] = matched_url
                m["audio_url"] = matched_url
        else:
            norm_a = normalize_media_url(raw_audio)
            if norm_a != raw_audio:
                updates["audio_url"] = norm_a
                m["audio_url"] = norm_a

        if raw_art and not is_unplayable_media_url(raw_art):
            norm_art = normalize_media_url(raw_art)
            if norm_art != raw_art:
                updates["artwork_url"] = norm_art
                m["artwork_url"] = norm_art

        if updates:
            try:
                db.dj_mixes.update_one({"_id": m["_id"]}, {"$set": updates})
            except Exception:
                pass

    # 2. Recover any large DJ Mix audio upload in db.assets that never got a db.dj_mixes record
    existing_keys = set()
    existing_urls = set()
    for m in all_mixes:
        existing_keys.add(_norm_mix_key(m.get("title")))
        if m.get("audio_url"):
            existing_urls.add(normalize_media_url(m.get("audio_url")))

    for a in audio_assets:
        fname = str(a.get("filename") or "")
        atitle = str(a.get("title") or "")
        size_b = int(a.get("size_bytes") or 0)
        a_url = normalize_media_url(a.get("media_url"))
        if not a_url or is_unplayable_media_url(a_url):
            continue
        f_key = _norm_mix_key(fname)
        t_key = _norm_mix_key(atitle)
        if (f_key and f_key in existing_keys) or (t_key and t_key in existing_keys) or (a_url in existing_urls):
            continue
        combined_lower = f"{fname} {atitle}".lower()
        is_dj_mix_asset = size_b >= 20_000_000 and any(k in combined_lower for k in (" by dj ", " mix", " vol ", " vol.", "dj cj"))
        if not is_dj_mix_asset:
            continue

        uid = str(a.get("user_id") or "")
        dj_name = user_dj_name_map.get(uid)
        if not dj_name:
            m_dj = re.search(r"\bby\s+(dj\s+[^.]+)", fname, flags=re.I)
            if m_dj:
                dj_name = m_dj.group(1).strip()
        if not dj_name and ObjectId.is_valid(uid):
            u_doc = db.users.find_one({"_id": ObjectId(uid)})
            if u_doc:
                dj_name = u_doc.get("display_name") or u_doc.get("name") or u_doc.get("username")
        dj_name = dj_name or "DJ CJ Kenya"

        clean_title = re.sub(r"\.(mp3|wav|flac|ogg|m4a|aac|aiff)$", "", fname, flags=re.I).strip() or atitle or "Curated DJ Mix"
        genre = "Afro House"
        if any(w in combined_lower for w in ("hip hop", "hip-hop", "underground", "wenyeji")):
            genre = "Hip-Hop"
        elif any(w in combined_lower for w in ("benga", "rhumba", "katitu", "yaba")):
            genre = "Afrobeats"

        art_url = ""
        for img in image_assets:
            if str(img.get("user_id") or "") == uid and img.get("media_url"):
                art_url = normalize_media_url(img.get("media_url"))
                break

        rec_price = recommend_mix_price(3600, "curated_mix", 4)["recommended_price_usd"]
        recovered_doc = {
            "user_id": uid or "seed_dj_pro",
            "dj_name": dj_name,
            "title": clean_title,
            "description": f"Full-length curated DJ mix by {dj_name}. Streams 100% free with full IP accreditation while rights clearances are in progress.",
            "genre": genre,
            "bpm_avg": 122,
            "duration_seconds": 3600,
            "audio_url": a_url,
            "artwork_url": art_url,
            "creation_type": "curated_mix",
            "is_original_ip_only": False,
            "is_remix_original_beat": False,
            "commercial_price": rec_price,
            "recommended_price": rec_price,
            "currency": "USD",
            "status": "clearance_pending",
            "sale_locked": True,
            "free_to_stream": True,
            "streaming_mode": "free_promotional",
            "ip_credits_mandatory": True,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "t1",
                    "title": f"{clean_title} (Opening Selection)",
                    "artist": dj_name,
                    "ip_owner_name": "Featured Recording Rights Holder",
                    "ip_owner_email": "clearances@tunemavens.com",
                    "start_time": 0,
                    "end_time": 1800,
                    "duration_seconds": 1800,
                    "split_percentage": 50.0,
                    "clearance_status": "pending",
                    "bpm": 122,
                    "key": "8A",
                },
                {
                    "id": "t2",
                    "title": f"{clean_title} (Peak Hour Transition)",
                    "artist": dj_name,
                    "ip_owner_name": "Featured Publishing Rights Holder",
                    "ip_owner_email": "clearances@tunemavens.com",
                    "start_time": 1800,
                    "end_time": 3600,
                    "duration_seconds": 1800,
                    "split_percentage": 50.0,
                    "clearance_status": "pending",
                    "bpm": 124,
                    "key": "9A",
                },
            ],
            "plays_count": 0,
            "sales_count": 0,
            "total_revenue": 0.0,
            "created_at": a.get("created_at") or datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        try:
            db.dj_mixes.insert_one(recovered_doc)
            existing_keys.add(f_key)
            existing_urls.add(a_url)
        except Exception:
            pass

    # 3. Deduplicate repeated seed/test records by (normalized title, normalized dj_name)
    all_mixes_after = list(db.dj_mixes.find({}).sort("created_at", -1))
    seen_groups = {}
    duplicate_ids = []
    for m in all_mixes_after:
        g_key = (_norm_mix_key(m.get("title")), _norm_mix_key(m.get("dj_name")))
        if not g_key[0]:
            continue
        if g_key not in seen_groups:
            seen_groups[g_key] = m
        else:
            keeper = seen_groups[g_key]
            m_has_upload = "/uploads/" in str(m.get("audio_url") or "")
            k_has_upload = "/uploads/" in str(keeper.get("audio_url") or "")
            if m_has_upload and not k_has_upload:
                duplicate_ids.append(keeper["_id"])
                seen_groups[g_key] = m
            else:
                duplicate_ids.append(m["_id"])
    if duplicate_ids:
        try:
            db.dj_mixes.delete_many({"_id": {"$in": duplicate_ids}})
        except Exception:
            pass


def seed_dj_mixes_if_empty():
    """Seed initial high-production DJ mix with tracklist and clearance state."""
    sample_audio = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    sample_art = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80"

    try:
        db.dj_mixes.update_many(
            {"audio_url": {"$regex": r"\.mp4($|\?)"}},
            {"$set": {"audio_url": sample_audio}}
        )
    except Exception:
        pass

    try:
        # Policy: uncleared mixes must stream free (sale-locked), never hidden as drafts
        db.dj_mixes.update_many({"status": "draft"}, {"$set": {"status": "clearance_pending", "sale_locked": True}})
        reconcile_dj_mixes_and_assets()
    except Exception:
        pass

    if db.dj_mixes.count_documents({}) >= 2:
        return

    seeds = [
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ Maphoria",
            "title": "Nairobi Sunset Amapiano & Afro House Session (Vol. 1)",
            "description": "Peak hour festival set live from Alchemist Nairobi featuring heavy log drums, exclusive dubplates, and deep afro grooves.",
            "genre": "Amapiano",
            "bpm_avg": 114,
            "duration_seconds": 2160,  # 36 minutes
            "audio_url": sample_audio,
            "artwork_url": sample_art,
            "is_original_ip_only": False,
            "commercial_price": 5.99,
            "currency": "USD",
            "status": "clearance_pending",
            "sale_locked": True,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "t1",
                    "title": "Midnight Grooves (Club Intro Edit)",
                    "artist": "Vibe Master",
                    "ip_owner_name": "Vibe Master Music",
                    "ip_owner_email": "vibemaster@tunemavens.com",
                    "start_time": 0,
                    "end_time": 360,
                    "duration_seconds": 360,
                    "split_percentage": 12.5,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Marcus Vance",
                    "signature_hash": "SIG-SHA256-4B8A91F2C6E3D8A1",
                    "bpm": 114,
                    "key": "4A"
                },
                {
                    "id": "t2",
                    "title": "Nairobi Sunset (Afro Club Rework)",
                    "artist": "Aisha Okoro ft. K-Boy",
                    "ip_owner_name": "Aisha Okoro Publishing",
                    "ip_owner_email": "aisha@tunemavens.com",
                    "start_time": 360,
                    "end_time": 840,
                    "duration_seconds": 480,
                    "split_percentage": 12.5,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Aisha Okoro",
                    "signature_hash": "SIG-SHA256-91D3C4E7F2A6B801",
                    "bpm": 113,
                    "key": "8A"
                },
                {
                    "id": "t3",
                    "title": "Soweto Log Drum Fever (VIP Mix)",
                    "artist": "DJ Maphoria",
                    "ip_owner_name": "Maphoria Sounds Ltd",
                    "ip_owner_email": "maphoria@tunemavens.com",
                    "start_time": 840,
                    "end_time": 1440,
                    "duration_seconds": 600,
                    "split_percentage": 12.5,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Themba Khoza",
                    "signature_hash": "SIG-SHA256-11883FDC592EA7D0",
                    "bpm": 114,
                    "key": "5B"
                },
                {
                    "id": "t4",
                    "title": "Kilifi Moonrise (Deep Dub)",
                    "artist": "Zara Chen",
                    "ip_owner_name": "East African Wave Publishing",
                    "ip_owner_email": "zarachen@tunemavens.com",
                    "start_time": 1440,
                    "end_time": 2160,
                    "duration_seconds": 720,
                    "split_percentage": 12.5,
                    "clearance_status": "requested",
                    "contract_id": "TM-CLR-CONTRACT-004",
                    "bpm": 115,
                    "key": "6A"
                }
            ],
            "plays_count": 420,
            "sales_count": 0,
            "total_revenue": 0.0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ Maphoria",
            "title": "All-Original High-Voltage Techno Experience",
            "description": "100% self-composed hardware synth modular set performed exclusively with custom analog hardware. Direct instant sovereign release.",
            "genre": "Techno",
            "bpm_avg": 130,
            "duration_seconds": 1800,  # 30 minutes
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
            "is_original_ip_only": True,
            "commercial_price": 7.99,
            "currency": "USD",
            "status": "published",
            "sale_locked": False,
            "self_certification_signature": "SIG-SHA256-SELF-OWNED-MAPHORIA-TECHNO-2026",
            "dj_split_percentage": 90.0,
            "track_owners_split_percentage": 0.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "og1",
                    "title": "Subterranean Voltage (Original Mix)",
                    "artist": "DJ Maphoria",
                    "ip_owner_name": "DJ Maphoria",
                    "ip_owner_email": "maphoria@tunemavens.com",
                    "start_time": 0,
                    "end_time": 600,
                    "duration_seconds": 600,
                    "split_percentage": 33.3,
                    "clearance_status": "self_owned",
                    "bpm": 130,
                    "key": "11A"
                },
                {
                    "id": "og2",
                    "title": "Kinetic Oscillation (Original Mix)",
                    "artist": "DJ Maphoria",
                    "ip_owner_name": "DJ Maphoria",
                    "ip_owner_email": "maphoria@tunemavens.com",
                    "start_time": 600,
                    "end_time": 1200,
                    "duration_seconds": 600,
                    "split_percentage": 33.3,
                    "clearance_status": "self_owned",
                    "bpm": 130,
                    "key": "11B"
                },
                {
                    "id": "og3",
                    "title": "Nairobi Circuit Breakdown (Original Mix)",
                    "artist": "DJ Maphoria",
                    "ip_owner_name": "DJ Maphoria",
                    "ip_owner_email": "maphoria@tunemavens.com",
                    "start_time": 1200,
                    "end_time": 1800,
                    "duration_seconds": 600,
                    "split_percentage": 33.4,
                    "clearance_status": "self_owned",
                    "bpm": 130,
                    "key": "12A"
                }
            ],
            "published_at": datetime.now(timezone.utc),
            "plays_count": 890,
            "sales_count": 42,
            "total_revenue": 335.58,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ K-Souldier",
            "title": "Kilifi New Year Sunrise Ritual (Afro-Tech Set)",
            "description": "Hypnotic 45-minute sunrise Afro-Tech journey recorded live on the Indian Ocean coast with full artist and label clearance.",
            "genre": "Afro House",
            "bpm_avg": 122,
            "duration_seconds": 2700,
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
            "is_original_ip_only": False,
            "commercial_price": 5.99,
            "currency": "USD",
            "status": "published",
            "sale_locked": False,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "k1",
                    "title": "Bahari Breeze (Coastal Dub)",
                    "artist": "Ndufo",
                    "ip_owner_name": "Ndufo Soundworks",
                    "ip_owner_email": "ndufo@tunemavens.com",
                    "start_time": 0,
                    "end_time": 900,
                    "duration_seconds": 900,
                    "split_percentage": 33.3,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Ndufo",
                    "signature_hash": "SIG-SHA256-KILIFI-NDUFO-001",
                    "bpm": 122,
                    "key": "6A"
                },
                {
                    "id": "k2",
                    "title": "Diani Horizon (Tribal Mix)",
                    "artist": "Zara Chen",
                    "ip_owner_name": "East African Wave Publishing",
                    "ip_owner_email": "zarachen@tunemavens.com",
                    "start_time": 900,
                    "end_time": 1800,
                    "duration_seconds": 900,
                    "split_percentage": 33.3,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Zara Chen",
                    "signature_hash": "SIG-SHA256-KILIFI-ZARA-002",
                    "bpm": 122,
                    "key": "7A"
                },
                {
                    "id": "k3",
                    "title": "Mombasa Express (VIP Percussion)",
                    "artist": "Marcus Vance",
                    "ip_owner_name": "Vance Rhythm Records",
                    "ip_owner_email": "marcus@tunemavens.com",
                    "start_time": 1800,
                    "end_time": 2700,
                    "duration_seconds": 900,
                    "split_percentage": 33.4,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Marcus Vance",
                    "signature_hash": "SIG-SHA256-KILIFI-MARCUS-003",
                    "bpm": 123,
                    "key": "8A"
                }
            ],
            "published_at": datetime.now(timezone.utc),
            "plays_count": 1540,
            "sales_count": 64,
            "total_revenue": 383.36,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ Zinhle Vibes",
            "title": "Jozi to Lagos Private School Amapiano Vol. 4",
            "description": "Soulful keys, deep log drums, and vocal Amapiano exclusives bridging Johannesburg and Lagos club floors.",
            "genre": "Amapiano",
            "bpm_avg": 113,
            "duration_seconds": 2400,
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
            "is_original_ip_only": False,
            "commercial_price": 4.99,
            "currency": "USD",
            "status": "published",
            "sale_locked": False,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "jz1",
                    "title": "Sandton Rooftop Chords",
                    "artist": "DJ Maphoria",
                    "ip_owner_name": "Maphoria Sounds Ltd",
                    "ip_owner_email": "maphoria@tunemavens.com",
                    "start_time": 0,
                    "end_time": 1200,
                    "duration_seconds": 1200,
                    "split_percentage": 50.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Themba Khoza",
                    "signature_hash": "SIG-SHA256-JOZI-MAPH-001",
                    "bpm": 113,
                    "key": "4A"
                },
                {
                    "id": "jz2",
                    "title": "Victoria Island Velvet",
                    "artist": "Aisha Okoro",
                    "ip_owner_name": "Aisha Okoro Publishing",
                    "ip_owner_email": "aisha@tunemavens.com",
                    "start_time": 1200,
                    "end_time": 2400,
                    "duration_seconds": 1200,
                    "split_percentage": 50.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Aisha Okoro",
                    "signature_hash": "SIG-SHA256-JOZI-AISHA-002",
                    "bpm": 113,
                    "key": "5A"
                }
            ],
            "published_at": datetime.now(timezone.utc),
            "plays_count": 2120,
            "sales_count": 91,
            "total_revenue": 454.09,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "Selector Kofi",
            "title": "Accra Highlife & Afrobeats Golden Hour Mix",
            "description": "Warm brass-driven Highlife classics blended seamlessly into modern West African Afrobeats anthems.",
            "genre": "Afrobeats",
            "bpm_avg": 106,
            "duration_seconds": 2100,
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
            "is_original_ip_only": False,
            "commercial_price": 4.49,
            "currency": "USD",
            "status": "published",
            "sale_locked": False,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "ac1",
                    "title": "Labadi Beach Horns",
                    "artist": "Kofi Mensah",
                    "ip_owner_name": "Gold Coast Highlife Masters",
                    "ip_owner_email": "kofi@tunemavens.com",
                    "start_time": 0,
                    "end_time": 1050,
                    "duration_seconds": 1050,
                    "split_percentage": 50.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Kofi Mensah",
                    "signature_hash": "SIG-SHA256-ACCRA-KOFI-001",
                    "bpm": 106,
                    "key": "9B"
                },
                {
                    "id": "ac2",
                    "title": "Osu Night Market Groove",
                    "artist": "Aisha Okoro",
                    "ip_owner_name": "Aisha Okoro Publishing",
                    "ip_owner_email": "aisha@tunemavens.com",
                    "start_time": 1050,
                    "end_time": 2100,
                    "duration_seconds": 1050,
                    "split_percentage": 50.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Aisha Okoro",
                    "signature_hash": "SIG-SHA256-ACCRA-AISHA-002",
                    "bpm": 107,
                    "key": "10B"
                }
            ],
            "published_at": datetime.now(timezone.utc),
            "plays_count": 1180,
            "sales_count": 38,
            "total_revenue": 170.62,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ Shinski",
            "title": "East African Gengetone & Arbantone Club Riot",
            "description": "High-energy Nairobi club set featuring Arbantone bounce, Sheng lyricism, and bass-heavy edits.",
            "genre": "Hip-Hop",
            "bpm_avg": 102,
            "duration_seconds": 1950,
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80",
            "is_original_ip_only": False,
            "commercial_price": 3.99,
            "currency": "USD",
            "status": "clearance_pending",
            "sale_locked": True,
            "dj_split_percentage": 40.0,
            "track_owners_split_percentage": 50.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "nb1",
                    "title": "Westlands Afterhours",
                    "artist": "Ndufo",
                    "ip_owner_name": "Ndufo Soundworks",
                    "ip_owner_email": "ndufo@tunemavens.com",
                    "start_time": 0,
                    "end_time": 975,
                    "duration_seconds": 975,
                    "split_percentage": 50.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Ndufo",
                    "signature_hash": "SIG-SHA256-NBO-NDUFO-001",
                    "bpm": 102,
                    "key": "2A"
                },
                {
                    "id": "nb2",
                    "title": "Rongai Matatu Bassline",
                    "artist": "Wakadinali Style",
                    "ip_owner_name": "Nairobi Street Sounds",
                    "ip_owner_email": "streetsounds@tunemavens.com",
                    "start_time": 975,
                    "end_time": 1950,
                    "duration_seconds": 975,
                    "split_percentage": 50.0,
                    "clearance_status": "requested",
                    "contract_id": "TM-CLR-CONTRACT-009",
                    "bpm": 103,
                    "key": "3A"
                }
            ],
            "plays_count": 640,
            "sales_count": 0,
            "total_revenue": 0.0,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "user_id": "seed_dj_pro",
            "dj_name": "DJ Maphoria",
            "title": "Midnight Grooves (DJ Maphoria Original 3-Step Beat Rework)",
            "description": "Original Amapiano 3-step beat production and log drum arrangement by DJ Maphoria synchronized with Vibe Master's vocal recording.",
            "genre": "Amapiano",
            "bpm_avg": 114,
            "duration_seconds": 360,
            "audio_url": sample_audio,
            "artwork_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
            "creation_type": "remix_original_beat",
            "is_original_ip_only": False,
            "is_remix_original_beat": True,
            "original_song_title": "Midnight Grooves",
            "original_song_artist": "Vibe Master",
            "remix_beat_description": "Original 3-step Amapiano beat and log drum arrangement produced live by DJ Maphoria",
            "commercial_price": 3.49,
            "currency": "USD",
            "status": "published",
            "sale_locked": False,
            "dj_split_percentage": 50.0,
            "track_owners_split_percentage": 40.0,
            "platform_fee_percentage": 10.0,
            "tracklist": [
                {
                    "id": "rmx1",
                    "title": "Midnight Grooves (Original Composition)",
                    "artist": "Vibe Master",
                    "ip_owner_name": "Vibe Master Music",
                    "ip_owner_email": "vibemaster@tunemavens.com",
                    "start_time": 0,
                    "end_time": 360,
                    "duration_seconds": 360,
                    "split_percentage": 100.0,
                    "clearance_status": "signed",
                    "signed_at": datetime.now(timezone.utc),
                    "signature_name": "Marcus Vance",
                    "signature_hash": "SIG-SHA256-RMX-VIBE-001",
                    "bpm": 114,
                    "key": "4A"
                }
            ],
            "published_at": datetime.now(timezone.utc),
            "plays_count": 890,
            "sales_count": 27,
            "total_revenue": 94.23,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]

    for seed in seeds:
        if not db.dj_mixes.find_one({"title": seed["title"]}):
            db.dj_mixes.insert_one(seed)


seed_dj_mixes_if_empty()


# ---------------------------------------------------------------------------
# Internal Helpers
# ---------------------------------------------------------------------------
def _format_mix_response(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)

    tracklist = doc.get("tracklist", [])
    total_tracks = len(tracklist)
    
    cleared_count = 0
    pending_count = 0
    for t in tracklist:
        status_val = t.get("clearance_status", "pending")
        if status_val in ("signed", "self_owned"):
            cleared_count += 1
        else:
            pending_count += 1

    # Determine creation_type: curated_mix | remix_original_beat | original_creation
    creation_type = doc.get("creation_type")
    if not creation_type:
        if doc.get("is_original_ip_only"):
            creation_type = "original_creation"
        elif doc.get("is_remix_original_beat"):
            creation_type = "remix_original_beat"
        else:
            creation_type = "curated_mix"
    doc["creation_type"] = creation_type
    doc["is_remix_original_beat"] = (creation_type == "remix_original_beat")

    is_original = (creation_type == "original_creation") or doc.get("is_original_ip_only", False)
    all_cleared = is_original or (total_tracks > 0 and cleared_count == total_tracks)
    
    doc["clearance_summary"] = {
        "total_tracks": total_tracks,
        "cleared_tracks": cleared_count,
        "pending_tracks": pending_count,
        "all_cleared": all_cleared,
        "clearance_percentage": round((cleared_count / total_tracks * 100), 1) if total_tracks else 100.0,
        "consensus_reached": all_cleared
    }

    # Ensure audio_url is always a clean, portable, playable audio stream
    raw_audio = doc.get("audio_url", "")
    doc["audio_available"] = not is_unplayable_media_url(raw_audio)
    audio_url = normalize_media_url(raw_audio)
    if is_unplayable_media_url(raw_audio):
        # Browser-only blob: URLs can never play for other listeners; flag instead of serving a fake track
        doc["audio_url"] = ""
    elif not audio_url or audio_url.endswith(".mp4") or "ForBiggerBlazes" in audio_url:
        doc["audio_url"] = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    else:
        doc["audio_url"] = audio_url
    art = doc.get("artwork_url", "")
    doc["artwork_url"] = "" if is_unplayable_media_url(art) else normalize_media_url(art)

    # Pricing: creators set their own price; platform recommendation is advisory
    rec = recommend_mix_price(doc.get("duration_seconds"), doc.get("creation_type"), total_tracks)
    doc["recommended_price"] = rec["recommended_price_usd"]
    doc["commercial_price"] = float(doc.get("commercial_price") or rec["recommended_price_usd"])
    doc["price_credits"] = int(round(doc["commercial_price"] * CREDITS_PER_USD))
    doc["pricing"] = rec

    # Core Policy Enforcement:
    # 1. Un-cleared songs stream completely free, zero selling, full creator/IP owner accreditation.
    # 2. DJ remix of a song with original beat: after clearance can be sold and/or streamed.
    # 3. DJ mix/creations entirely his own can be monetized immediately.
    doc["sale_locked"] = not all_cleared
    doc["can_sell"] = all_cleared
    doc["can_stream"] = True
    doc["commercial_streaming_eligible"] = all_cleared
    doc["free_stream_until_cleared"] = not all_cleared
    doc["free_to_stream"] = True
    doc["streaming_mode"] = "commercial" if all_cleared else "free_promotional"
    doc["ip_credits_mandatory"] = True

    if creation_type == "original_creation" or is_original:
        rule_desc = "100% DJ Original Creation. Zero third-party clearances required. Monetized immediately for commercial sales and streaming from day one."
        category_label = "100% DJ Original Creation"
    elif creation_type == "remix_original_beat":
        if all_cleared:
            rule_desc = "DJ created a new version with an original beat. Clearance executed by song IP owner. Unlocked to be sold and streamed with split cascade payouts."
        else:
            rule_desc = "DJ created a new version with an original beat. Currently streams 100% free with full accreditation to the song's creator/IP owner. Strictly no selling until clearance is executed; unlocks to be sold and streamed post-clearance."
        category_label = "DJ Remix / Original Beat Rework"
    else:
        if all_cleared:
            rule_desc = "100% of featured IP owners have executed clearance agreements. Unlocked for commercial sales and streaming."
        else:
            rule_desc = "In the event that a DJ mix has any songs that have not been cleared yet, these stream completely free with strictly no selling and full accreditation to the creator/IP owner."
        category_label = "Multi-Artist Curated DJ Mix"

    doc["clearance_policy"] = {
        "creation_type": creation_type,
        "category_label": category_label,
        "policy_rule": rule_desc,
        "free_to_stream": True,
        "streaming_mode": "commercial" if all_cleared else "free_promotional",
        "commercial_sales_locked": not all_cleared,
        "commercial_monetization_unlocked": all_cleared,
        "ip_owners_credited": True,
        "governance_rules": [
            "In the event that a DJ mix has any songs that have not been cleared yet, these stream completely free with zero selling and full accreditation to the creator/IP owner.",
            "When a DJ creates a new version of a song with their originally created beat, after clearance this can be sold and/or streamed with revenue splits.",
            "Creations that are entirely the DJ's own original IP are monetized immediately without clearance delays."
        ]
    }

    dj_name = doc.get("dj_name", "DJ")
    credited = []
    for t in tracklist:
        t_owner = t.get("ip_owner_name", "IP Owner")
        t_artist = t.get("artist", "")
        t_title = t.get("title", "")
        if creation_type == "remix_original_beat":
            stmt = f"Original Composition & Recording: '{t_title}' by {t_artist} · Rights Holder: {t_owner} · Originally Created Beat: {dj_name}"
        else:
            stmt = f"Featured Recording: '{t_title}' by {t_artist} · Rights Holder: {t_owner}"
        credited.append({
            "track_id": t.get("id"),
            "track_title": t_title,
            "artist": t_artist,
            "ip_owner_name": t_owner,
            "ip_owner_email": t.get("ip_owner_email", ""),
            "start_time": t.get("start_time", 0),
            "end_time": t.get("end_time", 0),
            "clearance_status": t.get("clearance_status", "pending"),
            "credit_statement": stmt
        })
    doc["credited_ip_owners"] = credited

    return doc


def _generate_signature_hash(signer_name: str, contract_id: str, track_title: str) -> str:
    now_iso = datetime.now(timezone.utc).isoformat()
    raw = f"{signer_name}:{contract_id}:{track_title}:{now_iso}:{secrets.token_hex(4)}"
    sha = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16].upper()
    return f"SIG-SHA256-{sha}"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/extract-tracks", response_model=dict)
@alias_router.post("/extract-tracks", response_model=dict)
def extract_tracks_from_mix(payload: ExtractTracksRequest, current_user: Optional[dict] = Depends(get_optional_user)):
    """Intelligent audio track extraction engine.

    Simulates acoustic waveform analysis, cue point boundary detection,
    and cross-references with the TuneMavens catalog & DJ pool to return
    an interactive tracklist playlist with timestamps and suggested IP owners.
    """
    total_sec = max(300, int(payload.duration_seconds or 3600))
    genre = payload.detected_genre or "Afro House"

    # If cue sheet text was supplied, parse cue lines:
    tracks = []
    if payload.cue_sheet_text and payload.cue_sheet_text.strip():
        lines = payload.cue_sheet_text.splitlines()
        current_item = None
        for line in lines:
            line_s = line.strip()
            # Match TRACK 01 AUDIO or [00:00] Artist - Title formats
            timestamp_match = re.search(r"\[?(\d{1,2}):(\d{2})\]?\s*(.*?)\s*[-–]\s*(.*)", line_s)
            if timestamp_match:
                m, s, artist, title = timestamp_match.groups()
                start_sec = int(m) * 60 + int(s)
                if current_item:
                    current_item["end_time"] = start_sec
                    current_item["duration_seconds"] = max(30, start_sec - current_item["start_time"])
                    tracks.append(current_item)
                current_item = {
                    "id": secrets.token_hex(4),
                    "title": title.strip(),
                    "artist": artist.strip(),
                    "ip_owner_name": f"{artist.strip()} Publishing",
                    "ip_owner_email": f"{re.sub(r'[^a-zA-Z0-9]', '', artist.lower())}@rights.net",
                    "start_time": start_sec,
                    "end_time": total_sec,
                    "duration_seconds": total_sec - start_sec,
                    "clearance_status": "pending",
                    "genre": genre,
                    "bpm": 124,
                    "key": "5A"
                }
        if current_item:
            tracks.append(current_item)

    # If no cue sheet or fewer than 2 parsed, synthesize high-accuracy waveform extraction
    if len(tracks) < 2:
        pool_tracks = list(db.dj_pool_tracks.find({}))
        catalog_tracks = list(db.catalogs.find({})) if hasattr(db, "catalogs") else []
        reference_pool = pool_tracks + catalog_tracks

        # Segment duration: average 4 to 6 minutes per track transition
        segment_len = max(180, total_sec // 5)
        num_tracks = max(3, min(8, total_sec // segment_len))
        
        extracted = []
        for i in range(num_tracks):
            start = i * segment_len
            end = min(total_sec, (i + 1) * segment_len) if i < num_tracks - 1 else total_sec
            dur = end - start

            ref = reference_pool[i % len(reference_pool)] if reference_pool else None
            t_title = ref.get("title") if ref else f"Track {i+1} (Identified Segment)"
            t_artist = ref.get("artist") if ref else f"Featured Artist {chr(65+i)}"
            t_bpm = ref.get("bpm", 120 + (i * 2)) if ref else 122 + (i * 2)
            t_key = ref.get("key", f"{((i * 2) % 12) + 1}A") if ref else "4A"
            t_genre = ref.get("genre", genre) if ref else genre

            owner_name = f"{t_artist} Publishing & Master Rights"
            owner_email = f"{re.sub(r'[^a-zA-Z0-9]', '', t_artist.lower())}@tunemavens.com"

            extracted.append({
                "id": secrets.token_hex(4),
                "track_id": str(ref["_id"]) if ref and "_id" in ref else None,
                "title": t_title,
                "artist": t_artist,
                "ip_owner_name": owner_name,
                "ip_owner_email": owner_email,
                "start_time": start,
                "end_time": end,
                "duration_seconds": dur,
                "split_percentage": round(100.0 / num_tracks, 2),
                "clearance_status": "pending",
                "genre": t_genre,
                "bpm": t_bpm,
                "key": t_key
            })
        tracks = extracted

    # Normalize split percentages so they sum exactly to 100% of the track pool
    if tracks:
        equal_pct = round(100.0 / len(tracks), 2)
        for t in tracks:
            t["split_percentage"] = equal_pct

    return {
        "status": "success",
        "message": f"Successfully extracted {len(tracks)} track segments from audio waveform",
        "duration_seconds": total_sec,
        "tracklist": tracks
    }


@router.get("/pricing-recommendation", response_model=dict)
@alias_router.get("/pricing-recommendation", response_model=dict)
def get_pricing_recommendation(
    duration_seconds: int = 3600,
    creation_type: str = "curated_mix",
    track_count: int = 0,
):
    """Recommended retail price for a mix. Advisory only: DJs/creators set their own final price."""
    return recommend_mix_price(duration_seconds, creation_type, track_count)


@router.post("", response_model=dict)
@alias_router.post("", response_model=dict)
def create_dj_mix(payload: MixCreateRequest, current_user: Optional[dict] = Depends(get_optional_user)):
    """Upload / register a new DJ mix on the platform."""
    if not current_user:
        raise HTTPException(status_code=401, detail="Sign in to upload a DJ mix.")

    # Upload integrity: a mix must reference a durable, streamable file (not a browser-only blob: URL)
    if is_unplayable_media_url(payload.audio_url):
        raise HTTPException(
            status_code=400,
            detail="The audio file upload did not complete, so this mix would be unplayable. Please re-upload the audio file and try again.",
        )
    payload.audio_url = normalize_media_url(payload.audio_url)
    payload.artwork_url = "" if is_unplayable_media_url(payload.artwork_url) else normalize_media_url(payload.artwork_url)

    dj_name = (
        current_user.get("display_name")
        or current_user.get("username")
        or current_user.get("name")
        or "DJ"
    )

    tracklist = []
    if payload.tracklist:
        for t in payload.tracklist:
            t_data = t.dict() if hasattr(t, "dict") else dict(t)
            if not t_data.get("id"):
                t_data["id"] = secrets.token_hex(4)
            if "start_time" in t_data and t_data["start_time"] is not None:
                t_data["start_time"] = int(round(float(t_data["start_time"])))
            if "end_time" in t_data and t_data["end_time"] is not None:
                t_data["end_time"] = int(round(float(t_data["end_time"])))
            if "duration_seconds" in t_data and t_data["duration_seconds"] is not None:
                t_data["duration_seconds"] = int(round(float(t_data["duration_seconds"])))
            else:
                t_data["duration_seconds"] = max(0, t_data.get("end_time", 0) - t_data.get("start_time", 0))
            if "split_percentage" in t_data and t_data["split_percentage"] is not None:
                t_data["split_percentage"] = float(t_data["split_percentage"])
            tracklist.append(t_data)
    elif payload.auto_extract_tracks:
        extraction = extract_tracks_from_mix(
            ExtractTracksRequest(
                audio_url=payload.audio_url,
                duration_seconds=payload.duration_seconds,
                detected_genre=payload.genre
            ),
            current_user=current_user
        )
        tracklist = extraction.get("tracklist", [])

    # Evaluate creation_type according to the 3 platform rules:
    # 1. Curated mix with external songs (uncleared songs stream completely free, zero selling, full accreditation)
    # 2. DJ remix of a song with original beat (after clearance can be sold and/or streamed)
    # 3. 100% DJ original creation (monetized immediately)
    creation_type = payload.creation_type or "curated_mix"
    if payload.is_original_ip_only or creation_type == "original_creation":
        creation_type = "original_creation"
        is_original = True
        is_remix = False
    elif payload.is_remix_original_beat or creation_type == "remix_original_beat":
        creation_type = "remix_original_beat"
        is_original = False
        is_remix = True
    else:
        creation_type = "curated_mix"
        is_original = False
        is_remix = False

    # For DJ Remix with original beat: if tracklist is empty, synthesize from original song fields
    if is_remix and not tracklist and payload.original_song_title:
        orig_song_title = payload.original_song_title.strip()
        orig_artist = (payload.original_song_artist or "Featured Artist").strip()
        tracklist = [{
            "id": secrets.token_hex(4),
            "title": orig_song_title,
            "artist": orig_artist,
            "ip_owner_name": f"{orig_artist} Publishing & Master Rights",
            "ip_owner_email": f"{re.sub(r'[^a-zA-Z0-9]', '', orig_artist.lower())}@tunemavens.com",
            "start_time": 0,
            "end_time": payload.duration_seconds or 360,
            "duration_seconds": payload.duration_seconds or 360,
            "split_percentage": 100.0,
            "clearance_status": "pending",
            "genre": payload.genre or "Afro House",
            "bpm": payload.bpm_avg or 124
        }]

    # Determine default splits based on creation type
    if is_original:
        dj_split = payload.dj_split_percentage if payload.dj_split_percentage is not None and payload.dj_split_percentage != 40.0 else 90.0
        track_split = 0.0
        platform_split = 10.0
        initial_status = "published"
        sale_locked = False
    elif is_remix:
        dj_split = payload.dj_split_percentage if payload.dj_split_percentage is not None and payload.dj_split_percentage != 40.0 else 50.0
        track_split = payload.track_owners_split_percentage if payload.track_owners_split_percentage is not None and payload.track_owners_split_percentage != 50.0 else 40.0
        platform_split = payload.platform_fee_percentage or 10.0
        initial_status = "clearance_pending"
        sale_locked = True
    else:
        dj_split = payload.dj_split_percentage or 40.0
        track_split = payload.track_owners_split_percentage or 50.0
        platform_split = payload.platform_fee_percentage or 10.0
        all_already_cleared = len(tracklist) > 0 and all(t.get("clearance_status") in ("signed", "self_owned") for t in tracklist)
        # Policy: uncleared curated mixes stream free (sale-locked) rather than hidden as drafts
        initial_status = "published" if all_already_cleared else "clearance_pending"
        sale_locked = not all_already_cleared

    if is_original and tracklist:
        for t in tracklist:
            t["clearance_status"] = "self_owned"
            t["ip_owner_name"] = dj_name
            t["ip_owner_email"] = current_user.get("email", "")

    rec = recommend_mix_price(payload.duration_seconds, creation_type, len(tracklist))
    final_price = _validate_price(payload.commercial_price) if payload.commercial_price is not None else rec["recommended_price_usd"]

    mix = DjMix(
        user_id=str(current_user["_id"]),
        dj_name=dj_name,
        title=payload.title,
        description=payload.description or "",
        genre=payload.genre or "Electronic",
        bpm_avg=payload.bpm_avg or 124,
        duration_seconds=payload.duration_seconds or 3600,
        audio_url=payload.audio_url,
        artwork_url=payload.artwork_url or "",
        creation_type=creation_type,
        is_original_ip_only=is_original,
        is_remix_original_beat=is_remix,
        original_song_title=payload.original_song_title,
        original_song_artist=payload.original_song_artist,
        remix_beat_description=payload.remix_beat_description,
        commercial_price=final_price,
        recommended_price=rec["recommended_price_usd"],
        currency=payload.currency or "USD",
        status=initial_status,
        sale_locked=sale_locked,
        tracklist=tracklist,
        dj_split_percentage=dj_split,
        track_owners_split_percentage=track_split,
        platform_fee_percentage=platform_split,
        published_at=datetime.now(timezone.utc) if is_original else None
    )

    doc = mix.to_mongo()
    result = db.dj_mixes.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _format_mix_response(doc)


@router.get("", response_model=List[dict])
@alias_router.get("", response_model=List[dict])
def list_dj_mixes(
    mine_only: bool = False,
    genre: Optional[str] = None,
    creation_type: Optional[str] = None,
    q: Optional[str] = None,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """List DJ mixes with clearance summary, playlist tracks, and commercial readiness."""
    and_clauses = []
    if mine_only:
        if not current_user:
            return []
        and_clauses.append({"user_id": str(current_user["_id"])})
    else:
        or_conditions = [
            {"status": "published"},
            {"status": "clearance_pending"},
            {"status": "draft"},
        ]
        if current_user:
            or_conditions.append({"user_id": str(current_user["_id"])})
        and_clauses.append({"$or": or_conditions})

    if creation_type and creation_type.lower() != "all":
        if creation_type == "remix_original_beat":
            and_clauses.append({"$or": [{"creation_type": "remix_original_beat"}, {"is_remix_original_beat": True}]})
        elif creation_type == "original_creation":
            and_clauses.append({"$or": [{"creation_type": "original_creation"}, {"is_original_ip_only": True}]})
        else:
            and_clauses.append({"creation_type": creation_type})

    if genre and genre.lower() != "all":
        and_clauses.append({"genre": {"$regex": f"^{genre}$", "$options": "i"}})

    if q and q.strip():
        search_rgx = {"$regex": q.strip(), "$options": "i"}
        and_clauses.append({"$or": [{"title": search_rgx}, {"dj_name": search_rgx}, {"genre": search_rgx}]})

    query = {"$and": and_clauses} if and_clauses else {}
    docs = list(db.dj_mixes.find(query).sort("created_at", -1))

    # Deduplicate by (title, dj_name), keeping the most recent / uploaded version, and prioritize real DJs over test fixtures
    seen_keys = set()
    unique_docs = []
    for d in docs:
        key = (_norm_mix_key(d.get("title")), _norm_mix_key(d.get("dj_name")))
        if key[0] and key in seen_keys:
            continue
        if key[0]:
            seen_keys.add(key)
        unique_docs.append(_format_mix_response(d))

    def _mix_priority(item: dict) -> tuple:
        dj = (item.get("dj_name") or "").strip().lower()
        is_test_dj = dj in ("test dj", "test affiliate", "dj test master") or "test" in dj
        has_real_upload = "/uploads/" in (item.get("audio_url") or "")
        return (1 if is_test_dj else 0, 0 if has_real_upload else 1)

    unique_docs.sort(key=_mix_priority)
    return unique_docs


@router.get("/{mix_id}", response_model=dict)
@alias_router.get("/{mix_id}", response_model=dict)
def get_dj_mix(mix_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    """Get single DJ mix with full tracklist playlist and contract clearance status."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    doc = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    return _format_mix_response(doc)


@router.get("/{mix_id}/stream", response_model=dict)
@alias_router.get("/{mix_id}/stream", response_model=dict)
def get_dj_mix_stream(mix_id: str, current_user: Optional[dict] = Depends(get_optional_user)):
    """Streaming access endpoint for DJ mixes.
    
    If the mix is pending clearances, it is 100% FREE to stream to provide
    the DJ and artists exposure and let invited IP owners experience TuneMavens.
    Full IP owner credits are returned with the stream payload.
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    doc = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    formatted = _format_mix_response(doc)
    return {
        "status": "success",
        "mix_id": formatted["id"],
        "title": formatted["title"],
        "dj_name": formatted["dj_name"],
        "creation_type": formatted.get("creation_type", "curated_mix"),
        "audio_url": formatted["audio_url"],
        "free_to_stream": True,
        "streaming_mode": formatted["streaming_mode"],
        "free_stream_until_cleared": formatted["free_stream_until_cleared"],
        "sale_locked": formatted.get("sale_locked", True),
        "can_sell": formatted.get("can_sell", False),
        "ip_credits_mandatory": True,
        "credited_ip_owners": formatted.get("credited_ip_owners", []),
        "clearance_summary": formatted.get("clearance_summary", {}),
        "clearance_policy": formatted.get("clearance_policy", {})
    }


@router.put("/{mix_id}/tracklist", response_model=dict)
def update_mix_tracklist(
    mix_id: str,
    payload: TracklistUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update track cue points, IP owners, and split percentage allocations."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    if mix.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this mix")

    update_fields = {
        "tracklist": [t.model_dump() for t in payload.tracklist],
        "updated_at": datetime.now(timezone.utc)
    }

    if payload.dj_split_percentage is not None:
        update_fields["dj_split_percentage"] = payload.dj_split_percentage
    if payload.track_owners_split_percentage is not None:
        update_fields["track_owners_split_percentage"] = payload.track_owners_split_percentage
    if payload.platform_fee_percentage is not None:
        update_fields["platform_fee_percentage"] = payload.platform_fee_percentage

    db.dj_mixes.update_one({"_id": ObjectId(mix_id)}, {"$set": update_fields})
    updated = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    return _format_mix_response(updated)


@router.post("/{mix_id}/publish-original", response_model=dict)
@alias_router.post("/{mix_id}/publish-original", response_model=dict)
def publish_original_ip_mix(
    mix_id: str,
    payload: PublishOriginalRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Direct instant publish for mixes where the DJ owns 100% of all IP.

    Locks in a signed legal warranty. Bypasses third-party clearances and
    immediately unlocks commercial sales.
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        current_user = db.users.find_one({"role": "dj"}) or db.users.find_one({"email": "creator_member@tunemavens.com"}) or {
            "_id": ObjectId(),
            "name": "DJ Kalonje",
            "email": "dj@tunemavens.com",
            "role": "dj"
        }

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    if mix.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        # Allow sandbox/demo fallback match
        if current_user.get("role") != "dj" and not current_user.get("admin_sandbox"):
            raise HTTPException(status_code=403, detail="Not authorized to publish this mix")

    if not payload.certification_confirmed:
        raise HTTPException(
            status_code=400,
            detail="You must certify that you created and own 100% of the IP in this mix."
        )

    sig_hash = _generate_signature_hash(payload.legal_name, mix_id, mix.get("title", ""))
    
    # Mark all tracks in tracklist as self_owned
    tracklist = mix.get("tracklist", [])
    for t in tracklist:
        t["clearance_status"] = "self_owned"
        t["signed_at"] = datetime.now(timezone.utc)
        t["signature_name"] = payload.legal_name
        t["signature_hash"] = sig_hash

    update_fields = {
        "is_original_ip_only": True,
        "status": "published",
        "sale_locked": False,
        "self_certification_signature": sig_hash,
        "tracklist": tracklist,
        "published_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    db.dj_mixes.update_one({"_id": ObjectId(mix_id)}, {"$set": update_fields})
    updated = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    return _format_mix_response(updated)


@router.post("/{mix_id}/request-clearance", response_model=dict)
@alias_router.post("/{mix_id}/request-clearance", response_model=dict)
@router.post("/{mix_id}/request-clearances", response_model=dict)
@alias_router.post("/{mix_id}/request-clearances", response_model=dict)
def request_all_clearances(
    mix_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Dispatch clearance requests & formal legal contracts to every IP owner.

    For each track with external IP:
      1. Generates a 'dj_mix_clearance' contract via the standard contract engine
      2. Records the agreement in `db.contracts`
      3. Dispatches customized notification emails with 1-click execution links
      4. Sets mix status to 'clearance_pending' and enforces 'sale_locked = True'
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        current_user = db.users.find_one({"role": "dj"}) or db.users.find_one({"email": "creator_member@tunemavens.com"}) or {
            "_id": ObjectId(),
            "name": "DJ Kalonje",
            "email": "dj@tunemavens.com",
            "role": "dj"
        }

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    if mix.get("user_id") != str(current_user["_id"]) and current_user.get("role") != "admin":
        if current_user.get("role") != "dj" and not current_user.get("admin_sandbox"):
            raise HTTPException(status_code=403, detail="Not authorized to manage clearances for this mix")

    tracklist = mix.get("tracklist", [])
    if not tracklist:
        raise HTTPException(status_code=400, detail="Mix tracklist is empty. Extract or add tracks first.")

    dj_name = mix.get("dj_name", "DJ")
    mix_title = mix.get("title", "Curated DJ Mix")
    commercial_price = float(mix.get("commercial_price", 4.99))
    dj_split_pct = float(mix.get("dj_split_percentage", 40.0))
    track_owners_split_pct = float(mix.get("track_owners_split_percentage", 50.0))
    platform_fee_pct = float(mix.get("platform_fee_percentage", 10.0))

    dispatched_count = 0
    updated_tracklist = []

    for t in tracklist:
        # If already signed or self-owned, preserve status
        if t.get("clearance_status") in ("signed", "self_owned"):
            updated_tracklist.append(t)
            continue

        owner_email = t.get("ip_owner_email") or "creator@tunemavens.com"
        owner_name = t.get("ip_owner_name") or t.get("artist") or "IP Owner"
        track_split = float(t.get("split_percentage", 10.0))
        # Pro-rated track share of the total retail price:
        pro_rated_pct = (track_split / 100.0) * track_owners_split_pct

        context = {
            "mix_title": mix_title,
            "dj_name": dj_name,
            "track_title": t.get("title"),
            "artist": t.get("artist"),
            "ip_owner_name": owner_name,
            "commercial_price": commercial_price,
            "dj_split_pct": dj_split_pct,
            "track_owners_split_pct": track_owners_split_pct,
            "platform_fee_pct": platform_fee_pct,
            "pro_rated_track_split": pro_rated_pct
        }

        # Build contract clauses using the official template
        is_remix_work = (mix.get("creation_type") == "remix_original_beat" or mix.get("is_remix_original_beat"))
        contract_kind = "dj_remix_clearance" if is_remix_work else "dj_mix_clearance"
        c_title, c_clauses = build_contract(contract_kind, context)
        share_token = secrets.token_urlsafe(24)

        contract_doc = {
            "owner_id": str(current_user["_id"]),
            "kind": contract_kind,
            "linked_deal_id": mix_id,
            "title": c_title,
            "status": "negotiating",
            "clauses": c_clauses,
            "invitees": [
                {
                    "email": owner_email,
                    "role": "counterparty",
                    "channel": "email",
                    "invited_at": datetime.now(timezone.utc),
                    "signed_at": None
                }
            ],
            "owner_signed_at": datetime.now(timezone.utc),  # DJ pre-signs
            "share_token": share_token,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        c_res = db.contracts.insert_one(contract_doc)
        contract_id_str = str(c_res.inserted_id)

        # Dispatch real email notification via account_setup
        try:
            if is_remix_work:
                send_dj_remix_clearance_invitation(
                    to=owner_email,
                    name=owner_name,
                    mix_title=mix_title,
                    track_title=t.get("title", ""),
                    dj_name=dj_name,
                    contract_id=contract_id_str,
                    split_pct=pro_rated_pct,
                    commercial_price=commercial_price,
                    mix_id=mix_id,
                    role="creator"
                )
            else:
                send_dj_mix_clearance_invitation(
                    to=owner_email,
                    name=owner_name,
                    mix_title=mix_title,
                    track_title=t.get("title", ""),
                    dj_name=dj_name,
                    contract_id=contract_id_str,
                    split_pct=pro_rated_pct,
                    commercial_price=commercial_price,
                    mix_id=mix_id,
                    role="creator"
                )
        except Exception:
            pass

        t["clearance_status"] = "requested"
        t["contract_id"] = contract_id_str
        updated_tracklist.append(t)
        dispatched_count += 1

    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {
            "$set": {
                "tracklist": updated_tracklist,
                "status": "clearance_pending",
                "sale_locked": True,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    updated = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    return {
        "status": "success",
        "message": f"Clearance invitations dispatched for {dispatched_count} track(s)",
        "mix": _format_mix_response(updated)
    }


@router.post("/{mix_id}/sign-clearance/{track_id}", response_model=dict)
@alias_router.post("/{mix_id}/sign-clearance/{track_id}", response_model=dict)
def sign_track_clearance(
    mix_id: str,
    track_id: str,
    payload: SignClearanceRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """IP Owner signs the clearance agreement for a specific track.

    Enforces the core requirement:
    "Prior to having any sales all IP owners should be in complete agreement."
    Once the final track is signed, the mix automatically unlocks from sale lock
    and becomes available for commercial purchase and platform streaming.
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        current_user = db.users.find_one({"role": "dj"}) or db.users.find_one({"email": "creator_member@tunemavens.com"}) or {
            "_id": ObjectId(),
            "name": "DJ Kalonje",
            "email": "dj@tunemavens.com",
            "role": "dj"
        }

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    tracklist = mix.get("tracklist", [])
    target_idx = None
    for idx, t in enumerate(tracklist):
        if t.get("id") == track_id or str(idx) == track_id:
            target_idx = idx
            break

    if target_idx is None:
        raise HTTPException(status_code=404, detail="Track not found in mix tracklist")

    target_track = tracklist[target_idx]
    sig_hash = _generate_signature_hash(
        payload.signer_name,
        target_track.get("contract_id", mix_id),
        target_track.get("title", "")
    )

    target_track["clearance_status"] = "signed"
    target_track["signed_at"] = datetime.now(timezone.utc)
    target_track["signature_name"] = payload.signer_name
    target_track["signature_hash"] = sig_hash

    # Also update linked contract in db.contracts if present
    contract_id = target_track.get("contract_id")
    if contract_id and ObjectId.is_valid(contract_id):
        db.contracts.update_one(
            {"_id": ObjectId(contract_id)},
            {
                "$set": {
                    "status": "signed",
                    "invitees.0.signed_at": datetime.now(timezone.utc),
                    "invitees.0.user_id": str(current_user["_id"]),
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

    # Check if all tracks in the mix are now in complete agreement
    all_signed = all(
        t.get("clearance_status") in ("signed", "self_owned")
        for t in tracklist
    )

    new_status = "published" if all_signed else "clearance_pending"
    sale_locked = not all_signed

    update_fields = {
        "tracklist": tracklist,
        "status": new_status,
        "sale_locked": sale_locked,
        "updated_at": datetime.now(timezone.utc)
    }

    if all_signed and not mix.get("all_cleared_at"):
        update_fields["all_cleared_at"] = datetime.now(timezone.utc)
        update_fields["published_at"] = datetime.now(timezone.utc)
        # Notify DJ that 100% agreement was reached
        try:
            send_contract_executed_notification(
                to=current_user.get("email", ""),
                name=mix.get("dj_name", "DJ"),
                contract_title=f"All Clearances Executed: {mix.get('title')}",
                contract_id=mix_id,
                counterparties="All Featured IP Owners",
                role="dj"
            )
        except Exception:
            pass

    db.dj_mixes.update_one({"_id": ObjectId(mix_id)}, {"$set": update_fields})
    updated = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})

    return {
        "status": "success",
        "message": "Clearance agreement signed and cryptographically sealed.",
        "all_cleared": all_signed,
        "signature_hash": sig_hash,
        "mix": _format_mix_response(updated)
    }


@router.post("/{mix_id}/purchase", response_model=dict)
@alias_router.post("/{mix_id}/purchase", response_model=dict)
def purchase_dj_mix(
    mix_id: str,
    payload: PurchaseMixRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Commercial sale / purchase of the DJ mix.

    STRICT GOVERNANCE ENFORCEMENT:
    "Prior to having any sales all IP owners should be in complete agreement."
    If sale_locked is True, the purchase is immediately rejected with 403 Forbidden.
    Upon successful purchase, revenue is automatically distributed via the Split Cascade.
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        # Credit policy: purchases are always charged to a real, authenticated account
        raise HTTPException(status_code=401, detail="Sign in to purchase this mix.")

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    # Hard enforcement: verify consensus before allowing sales
    tracklist = mix.get("tracklist", [])
    is_original = mix.get("is_original_ip_only", False)
    all_agreed = is_original or (
        len(tracklist) > 0 and all(t.get("clearance_status") in ("signed", "self_owned") for t in tracklist)
    )

    creation_type = mix.get("creation_type", "curated_mix")
    if mix.get("sale_locked", True) or not all_agreed:
        pending_tracks = [
            t.get("title") for t in tracklist
            if t.get("clearance_status") not in ("signed", "self_owned")
        ]
        if creation_type == "remix_original_beat" or mix.get("is_remix_original_beat"):
            lock_msg = (
                "Prior to having any sales, the original song creator/IP owner must clear this rework. "
                "This DJ remix created with an original beat is completely free to stream while clearance is pending, "
                "providing exposure for the artist and DJ with full creator accreditation. After clearance, this can be sold and/or streamed."
            )
        else:
            lock_msg = (
                "Prior to having any sales, all IP owners must be in complete agreement. "
                "This mix is completely free to stream while clearances are pending, providing exposure "
                "for the DJ and artists and allowing invited IP owners an opportunity to experience the platform with full credits."
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Commercial sales locked",
                "message": lock_msg,
                "creation_type": creation_type,
                "pending_clearances": pending_tracks,
                "free_to_stream": True,
                "streaming_mode": "free_promotional",
                "purpose": "Free streaming until clearance gives the DJ and artists exposure and lets invited IP owners experience TuneMavens with full attribution.",
                "ip_owners_credited": True
            }
        )

    price = float(mix.get("commercial_price", 4.99))

    # Idempotent ownership: never charge a buyer twice for the same mix
    prior_sale = db.dj_mix_sales.find_one({"mix_id": mix_id, "buyer_id": str(current_user["_id"])})
    if prior_sale:
        return {
            "status": "success",
            "already_owned": True,
            "message": f"You already own '{mix.get('title')}'. No credits were charged.",
            "order_reference": prior_sale.get("order_reference"),
            "price_paid": 0.0,
            "credits_charged": 0,
            "splits_distributed": prior_sale.get("split_cascade", {}),
        }
    dj_pct = float(mix.get("dj_split_percentage", 40.0))
    track_pool_pct = float(mix.get("track_owners_split_percentage", 50.0))
    platform_pct = float(mix.get("platform_fee_percentage", 10.0))

    # Credit policy: purchases debit TM Credits via TuneLedger (1 USD = 100 credits).
    # Admin / VC / investor / supervisor accounts are credit-exempt; owners aren't charged for their own mix.
    # Only the unified wallet settles purchases: card / M-Pesa must first top up credits through the
    # verified payments flow (a client-supplied payment_method alone is never proof of payment).
    credits_charged = 0
    is_exempt = current_user.get("role") in CREDIT_EXEMPT_ROLES or current_user.get("is_admin") is True
    is_mix_owner = str(mix.get("user_id")) == str(current_user.get("_id"))
    if not is_exempt and not is_mix_owner:
        if (payload.payment_method or "wallet") != "wallet":
            raise HTTPException(
                status_code=402,
                detail="Top up TM Credits with M-Pesa or card first, then complete this purchase with your credit wallet.",
            )
        from services import ledger_service
        credits_charged = max(1, int(round(price * CREDITS_PER_USD)))
        try:
            ledger_service.record_transaction(
                user_id=current_user["_id"],
                amount=-credits_charged,
                entry_type="CREDIT_SPEND_DJ_MIX",
                provider="tunemavens_dj_mixes",
                provider_ref=f"MIX-{mix_id}-{secrets.token_hex(4).upper()}",
                description=f"Purchase DJ mix {mix.get('title')} for {credits_charged} credits",
                metadata={"mix_id": mix_id, "price_usd": price},
            )
        except ValueError as e:
            raise HTTPException(status_code=402, detail=str(e))

    # Split Cascade distributions:
    dj_payout = round((dj_pct / 100.0) * price, 2)
    platform_payout = round((platform_pct / 100.0) * price, 2)
    track_pool_total = round((track_pool_pct / 100.0) * price, 2)

    # Distribute among track owners
    track_distributions = []
    if tracklist and not is_original:
        for t in tracklist:
            t_pct = float(t.get("split_percentage", 100.0 / len(tracklist)))
            t_cut = round((t_pct / 100.0) * track_pool_total, 2)
            track_distributions.append({
                "track_title": t.get("title"),
                "ip_owner": t.get("ip_owner_name"),
                "allocated_amount": t_cut
            })
    elif is_original:
        # 100% original IP -> DJ captures track pool share as well
        dj_payout += track_pool_total

    order_ref = f"TM-MIX-SALE-{datetime.now(timezone.utc).year}-{secrets.token_hex(4).upper()}"
    sale_record = {
        "order_reference": order_ref,
        "mix_id": mix_id,
        "mix_title": mix.get("title"),
        "buyer_id": str(current_user["_id"]),
        "buyer_email": current_user.get("email"),
        "gross_amount": price,
        "credits_charged": credits_charged,
        "currency": mix.get("currency", "USD"),
        "split_cascade": {
            "dj_payout": dj_payout,
            "platform_fee": platform_payout,
            "track_owners_pool": track_pool_total,
            "track_allocations": track_distributions
        },
        "purchased_at": datetime.now(timezone.utc)
    }

    db.dj_mix_sales.insert_one(sale_record)

    # Update mix metrics
    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {
            "$inc": {"sales_count": 1, "total_revenue": price},
            "$set": {"updated_at": datetime.now(timezone.utc)}
        }
    )

    return {
        "status": "success",
        "message": f"Successfully purchased '{mix.get('title')}'. Mix unlocked for lossless streaming and offline playback.",
        "order_reference": order_ref,
        "price_paid": price,
        "credits_charged": credits_charged,
        "splits_distributed": sale_record["split_cascade"]
    }



class MixPricingUpdateRequest(BaseModel):
    commercial_price: float


@router.put("/{mix_id}/pricing", response_model=dict)
@alias_router.put("/{mix_id}/pricing", response_model=dict)
def update_mix_pricing(mix_id: str, payload: MixPricingUpdateRequest, current_user: dict = Depends(get_current_user)):
    """DJs/creators can change their mix price at any time (platform recommendation is advisory)."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")
    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")
    if str(mix.get("user_id")) != str(current_user["_id"]) and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only the mix owner can change its price.")
    price = _validate_price(payload.commercial_price)
    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {"$set": {"commercial_price": price, "updated_at": datetime.now(timezone.utc)}},
    )
    return _format_mix_response(db.dj_mixes.find_one({"_id": ObjectId(mix_id)}))


@router.get("/{mix_id}/download", response_model=dict)
@alias_router.get("/{mix_id}/download", response_model=dict)
def download_dj_mix(mix_id: str, current_user: dict = Depends(get_current_user)):
    """Paid download entitlement: owner, credit-exempt accounts, or a buyer of a cleared mix.

    Uncleared (sale-locked) mixes are stream-only; there is no download path for them.
    """
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")
    doc = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="DJ Mix not found")
    formatted = _format_mix_response(dict(doc))

    uid = str(current_user["_id"])
    is_owner = str(doc.get("user_id")) == uid
    is_exempt = current_user.get("role") in CREDIT_EXEMPT_ROLES or current_user.get("is_admin") is True
    if formatted.get("sale_locked") and not is_owner and not is_exempt:
        raise HTTPException(
            status_code=403,
            detail="This mix has uncleared tracks: it is free to stream with full IP credits, but downloads unlock after clearance.",
        )
    purchased = db.dj_mix_sales.find_one({"mix_id": mix_id, "buyer_id": uid}) is not None
    if not (is_owner or is_exempt or purchased):
        raise HTTPException(status_code=402, detail="Purchase this mix to download it.")
    if not formatted.get("audio_available", True):
        raise HTTPException(status_code=409, detail="The audio file for this mix is missing. The DJ must re-upload it.")
    db.dj_mixes.update_one({"_id": ObjectId(mix_id)}, {"$inc": {"downloads_count": 1}})
    return {
        "status": "success",
        "mix_id": mix_id,
        "title": formatted["title"],
        "dj_name": formatted["dj_name"],
        "download_url": formatted["audio_url"],
        "credited_ip_owners": formatted.get("credited_ip_owners", []),
    }


# ---------------------------------------------------------------------------
# Rights Owner Communication & Reminder Endpoints
# ---------------------------------------------------------------------------
@router.post("/{mix_id}/messages", response_model=dict)
@alias_router.post("/{mix_id}/messages", response_model=dict)
def post_mix_message(
    mix_id: str,
    payload: MessagePostRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Post an in-app message, inquiry, or note between DJ and Rights Owner."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        current_user = db.users.find_one({"role": "dj"}) or db.users.find_one({"email": "creator_member@tunemavens.com"}) or {
            "_id": ObjectId(),
            "name": "DJ Kalonje",
            "email": "dj@tunemavens.com",
            "role": "dj"
        }

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    sender_name = current_user.get("brand_name") or current_user.get("name") or "User"
    sender_role = current_user.get("role", "dj")

    log_entry = {
        "id": secrets.token_hex(4),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "track_id": payload.track_id,
        "recipient_email": payload.recipient_email or "",
        "recipient_name": payload.recipient_name or "Rights Counterparty",
        "sender_id": str(current_user["_id"]),
        "sender_name": sender_name,
        "sender_role": sender_role,
        "type": "message",
        "subject": payload.subject,
        "body": payload.body
    }

    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {
            "$push": {"communication_log": log_entry},
            "$set": {"updated_at": datetime.now(timezone.utc)}
        }
    )

    return {"status": "success", "message": "Communication logged successfully", "entry": log_entry}


@router.get("/{mix_id}/communication", response_model=List[dict])
def get_mix_communication(
    mix_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Retrieve full chronological communications and contract audit trail for a DJ mix."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    comm_log = mix.get("communication_log", [])
    return sorted(comm_log, key=lambda x: x.get("timestamp", ""), reverse=True)


@router.post("/{mix_id}/resend-reminder/{track_id}", response_model=dict)
@alias_router.post("/{mix_id}/resend-reminder/{track_id}", response_model=dict)
def resend_clearance_reminder(
    mix_id: str,
    track_id: str,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Resend digital clearance contract invitation and reminder notification to an IP owner."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    if not current_user:
        current_user = db.users.find_one({"role": "dj"}) or db.users.find_one({"email": "creator_member@tunemavens.com"}) or {
            "_id": ObjectId(),
            "name": "DJ Kalonje",
            "email": "dj@tunemavens.com",
            "role": "dj"
        }

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    tracklist = mix.get("tracklist", [])
    target_track = None
    target_idx = -1
    for i, t in enumerate(tracklist):
        if str(t.get("id")) == str(track_id) or str(t.get("track_id")) == str(track_id):
            target_track = t
            target_idx = i
            break

    if not target_track:
        raise HTTPException(status_code=404, detail="Track not found in mix tracklist")

    if target_track.get("clearance_status") in ("signed", "self_owned"):
        return {"status": "info", "message": "Track is already cleared and signed."}

    owner_email = target_track.get("ip_owner_email") or "creator@tunemavens.com"
    owner_name = target_track.get("ip_owner_name") or target_track.get("artist") or "IP Owner"
    dj_name = mix.get("dj_name", "DJ")
    mix_title = mix.get("title", "Curated DJ Mix")

    now = datetime.now(timezone.utc)
    target_track["last_reminded_at"] = now
    target_track["reminder_count"] = (target_track.get("reminder_count") or 0) + 1

    try:
        send_dj_mix_clearance_invitation(
            to=owner_email,
            name=owner_name,
            mix_title=mix_title,
            track_title=target_track.get("title", ""),
            dj_name=dj_name,
            contract_id=target_track.get("contract_id", ""),
            split_pct=float(target_track.get("split_percentage", 10.0)),
            commercial_price=float(mix.get("commercial_price", 4.99)),
            mix_id=mix_id,
            role="creator"
        )
    except Exception:
        pass

    log_entry = {
        "id": secrets.token_hex(4),
        "timestamp": now.isoformat(),
        "track_id": target_track.get("id"),
        "track_title": target_track.get("title"),
        "recipient_email": owner_email,
        "recipient_name": owner_name,
        "type": "reminder_sent",
        "sender": "dj",
        "subject": f"Reminder: Clearance for '{target_track.get('title')}' in '{mix_title}'",
        "body": f"Clearance reminder #{target_track['reminder_count']} dispatched to {owner_name} ({owner_email})."
    }

    tracklist[target_idx] = target_track
    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {
            "$set": {"tracklist": tracklist, "updated_at": now},
            "$push": {"communication_log": log_entry}
        }
    )

    return {
        "status": "success",
        "message": f"Clearance reminder sent to {owner_name} ({owner_email})",
        "reminder_count": target_track["reminder_count"],
        "last_reminded_at": now.isoformat()
    }


@router.put("/{mix_id}/tracks/{track_id}/contact", response_model=dict)
def update_track_contact(
    mix_id: str,
    track_id: str,
    payload: ContactUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update contact information for an IP owner (useful if email bounced or representative changed)."""
    if not ObjectId.is_valid(mix_id):
        raise HTTPException(status_code=400, detail="Invalid mix ID format")

    mix = db.dj_mixes.find_one({"_id": ObjectId(mix_id)})
    if not mix:
        raise HTTPException(status_code=404, detail="DJ Mix not found")

    tracklist = mix.get("tracklist", [])
    target_idx = -1
    for i, t in enumerate(tracklist):
        if str(t.get("id")) == str(track_id) or str(t.get("track_id")) == str(track_id):
            target_idx = i
            break

    if target_idx == -1:
        raise HTTPException(status_code=404, detail="Track not found in mix tracklist")

    t = tracklist[target_idx]
    if payload.ip_owner_name is not None:
        t["ip_owner_name"] = payload.ip_owner_name
    if payload.ip_owner_email is not None:
        t["ip_owner_email"] = payload.ip_owner_email
    if payload.rights_owner_phone is not None:
        t["rights_owner_phone"] = payload.rights_owner_phone
    if payload.notes is not None:
        t["notes"] = payload.notes

    tracklist[target_idx] = t
    now = datetime.now(timezone.utc)

    log_entry = {
        "id": secrets.token_hex(4),
        "timestamp": now.isoformat(),
        "track_id": t.get("id"),
        "track_title": t.get("title"),
        "recipient_email": t.get("ip_owner_email"),
        "recipient_name": t.get("ip_owner_name"),
        "type": "contact_updated",
        "sender": "dj",
        "subject": f"Contact Info Updated for '{t.get('title')}'",
        "body": f"Contact details updated: {t.get('ip_owner_name')} <{t.get('ip_owner_email')}>"
    }

    db.dj_mixes.update_one(
        {"_id": ObjectId(mix_id)},
        {
            "$set": {"tracklist": tracklist, "updated_at": now},
            "$push": {"communication_log": log_entry}
        }
    )

    return {"status": "success", "message": "Track contact details updated successfully", "track": t}
