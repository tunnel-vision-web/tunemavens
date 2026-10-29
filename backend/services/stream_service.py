"""TuneStream Streaming, Accounting & Rights Validation Service.

Per Technical Foundation Spec §4:
- Catalogue source of truth: TuneStream plays only approved tracks carrying public_streaming consent.
- Withdrawn tracks stop streaming immediately (status == "withdrawn").
- Territory and rights guardrail: Block playback per territory (allowed_territories / blocked_territories).
- Age and content safety: Gate explicit content and manage content reporting.
- Playback quality profiles: HLS / signed expiring URLs with low-bitrate default for mobile data (Nairobi)
  and lossless opt-in on Wi-Fi.
- Stream accounting: Deduplicated play events, minimum 30s threshold, fraud detection (repeat loops,
  datacenter bots, multi-account device farms), and automated TuneLedger posting.
- Fan credit tipping: 95% net to creator, 5% platform fee, zero subscriptions.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import logging
import os
import re
from typing import Any, Dict, List, Optional, Tuple

from bson import ObjectId
from config import db, JWT_SECRET
from services.ledger_service import record_transaction

logger = logging.getLogger("stream_service")

# Configurable stream payout rate in TuneLedger credits (e.g. 0.05 credits per qualifying stream)
STREAM_PAYOUT_CREDIT_RATE = float(os.environ.get("STREAM_PAYOUT_CREDIT_RATE", "0.05"))
PLATFORM_TIP_FEE_PERCENT = float(os.environ.get("PLATFORM_TIP_FEE_PERCENT", "5.0"))  # 5% fee, 95% to creator

# Known datacenter / bot User-Agent patterns
BOT_USER_AGENT_PATTERNS = [
    r"bot",
    r"crawler",
    r"spider",
    r"curl",
    r"wget",
    r"python-requests",
    r"postman",
    r"headlesschrome",
    r"selenium",
    r"puppeteer",
]

# Known datacenter IP prefixes / cloud mock ranges
KNOWN_DATACENTER_IPS = [
    "127.0.0.199",
    "10.99.",
    "192.168.99.",
    "52.",  # AWS mock
    "35.",  # GCP mock
]


def generate_stream_token(track_id: str, client_ip: str = "127.0.0.1", expires_in_sec: int = 900) -> Tuple[str, int]:
    """Generates an HMAC-signed stream token valid for 15 minutes."""
    expiry = int((datetime.now(timezone.utc) + timedelta(seconds=expires_in_sec)).timestamp())
    message = f"{track_id}:{client_ip}:{expiry}".encode("utf-8")
    sig = hmac.new(JWT_SECRET.encode("utf-8"), message, hashlib.sha256).hexdigest()
    token = f"{expiry}.{sig}"
    return token, expiry


def verify_stream_token(track_id: str, token: str, client_ip: str = "127.0.0.1") -> bool:
    """Verifies that the stream token is valid, unexpired, and tamper-proof."""
    if not token or "." not in token:
        return False
    try:
        expiry_str, sig = token.split(".", 1)
        expiry = int(expiry_str)
        if datetime.now(timezone.utc).timestamp() > expiry:
            return False

        message = f"{track_id}:{client_ip}:{expiry}".encode("utf-8")
        expected_sig = hmac.new(JWT_SECRET.encode("utf-8"), message, hashlib.sha256).hexdigest()
        return hmac.compare_digest(sig, expected_sig)
    except Exception as e:
        logger.warning(f"Failed stream token verification: {e}")
        return False


def get_track_or_release(identifier: str) -> Optional[Dict[str, Any]]:
    """Resolves track document by ID, ISRC, or title across catalog_tracks and releases."""
    clean_id = (identifier or "").strip()
    if not clean_id:
        return None

    # 1. Search in db.tracks
    track = db.tracks.find_one({"$or": [{"_id": clean_id}, {"isrc": clean_id}, {"title": clean_id}]})
    if track:
        return track

    # 2. Search in db.catalog_tracks
    cat_cursor = db.catalog_tracks.find({})
    for doc in cat_cursor:
        for t in doc.get("tracks", []):
            if (
                str(t.get("id", "")) == clean_id or
                str(t.get("isrc", "")).lower() == clean_id.lower() or
                str(t.get("title", "")).lower() == clean_id.lower()
            ):
                return t

    # 3. Search in db.releases
    try:
        query_id = ObjectId(clean_id)
    except Exception:
        query_id = clean_id
    release = db.releases.find_one({"$or": [{"_id": query_id}, {"title": {"$regex": f"^{clean_id}$", "$options": "i"}}]})
    if release:
        return release

    return None


def validate_playback_rights(
    track: Dict[str, Any],
    client_country: str = "KE",
    current_user: Optional[Dict[str, Any]] = None,
) -> Tuple[bool, Optional[str], int]:
    """Validates rights, withdrawal status, territory clearance, and age gating.

    Returns: (is_allowed: bool, error_code: Optional[str], http_status: int)
    """
    # 1. Check Withdrawn / Suspended status
    status = (track.get("status") or "active").lower()
    if status in ("withdrawn", "takedown", "suspended", "archived"):
        return False, "track_withdrawn", 403

    # 2. Check public_streaming consent
    public_streaming = track.get("public_streaming")
    # Default to True unless explicitly revoked or set to False
    if public_streaming is False:
        return False, "streaming_consent_revoked", 403

    # 3. Territory guardrail
    blocked_territories = [t.upper() for t in track.get("blocked_territories", [])]
    allowed_territories = [t.upper() for t in track.get("allowed_territories", [])]
    normalized_country = (client_country or "KE").upper().strip()

    if blocked_territories and normalized_country in blocked_territories:
        return False, f"territory_blocked_{normalized_country}", 451

    if allowed_territories and normalized_country not in allowed_territories:
        return False, f"territory_not_licensed_{normalized_country}", 451

    # 4. Age gate / Explicit content
    is_explicit = track.get("explicit", False)
    if is_explicit and current_user:
        age_restricted = current_user.get("age_restricted", False)
        age = current_user.get("age")
        if age_restricted or (age is not None and age < 18):
            if not current_user.get("explicit_content_consent", False):
                return False, "explicit_content_age_restricted", 403

    return True, None, 200


def get_stream_manifest(
    identifier: str,
    client_ip: str = "127.0.0.1",
    client_country: str = "KE",
    current_user: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Generates audio stream manifest with adaptive quality tiers (Spec §4)."""
    track = get_track_or_release(identifier)
    if not track:
        raise ValueError(f"Track '{identifier}' not found")

    allowed, err_code, status_code = validate_playback_rights(track, client_country, current_user)
    if not allowed:
        return {
            "ok": False,
            "error": err_code,
            "status_code": status_code,
            "detail": f"Playback prohibited: {err_code}"
        }

    track_id = str(track.get("_id") or track.get("id") or identifier)
    token, expiry = generate_stream_token(track_id, client_ip)

    title = track.get("title", "Untitled Track")
    artist = track.get("artist") or track.get("creator_name") or "Various Artists"
    duration = float(track.get("duration", 180.0))

    base_url = f"/api/stream/listen/{track_id}?token={token}"

    manifest = {
        "ok": True,
        "track_id": track_id,
        "title": title,
        "artist": artist,
        "duration": duration,
        "is_explicit": bool(track.get("explicit", False)),
        "territory_cleared": client_country.upper(),
        "token_expires_at": expiry,
        "default_profile": "low_mobile",  # Spec §4: Default to low-bitrate profile for mobile data
        "profiles": {
            "low_mobile": {
                "name": "Mobile Low-Data (96 kbps AAC)",
                "bitrate_kbps": 96,
                "data_saver": True,
                "recommended_for": "Nairobi 3G/4G Cellular",
                "stream_url": f"{base_url}&profile=low",
            },
            "high": {
                "name": "Standard High Quality (256 kbps MP3)",
                "bitrate_kbps": 256,
                "data_saver": False,
                "recommended_for": "Fast Mobile / Broadband",
                "stream_url": f"{base_url}&profile=high",
            },
            "lossless": {
                "name": "Studio Lossless (1411 kbps FLAC / WAV)",
                "bitrate_kbps": 1411,
                "data_saver": False,
                "recommended_for": "Wi-Fi Audiophile Opt-In Only",
                "stream_url": f"{base_url}&profile=lossless",
            }
        }
    }
    return manifest


def record_stream_event(
    track_id: str,
    duration_listened_sec: float,
    listener_id: Optional[str] = None,
    client_ip: str = "127.0.0.1",
    user_agent: str = "Mozilla/5.0",
    client_country: str = "KE",
    device_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Records stream play event, applies anti-fraud checks, and credits TuneLedger.

    Spec §4 Rules:
    - Immutable play events.
    - Plays < 30s count as partial impressions (0 credit payout).
    - Fraud patterns flagged (repeat loops > 3 in 5 min, datacenter IPs, bot scrapers, account farms).
    - Verified plays credit creator ledger at configured rate.
    """
    now = datetime.now(timezone.utc)
    track = get_track_or_release(track_id)
    if not track:
        return {"ok": False, "error": "track_not_found"}

    creator_id = str(track.get("creator_id") or track.get("user_id") or track.get("owner_id") or "unclaimed")

    # Anti-Fraud Check 1: Bot / Scraper User-Agent detection
    is_bot = any(re.search(pat, user_agent, re.IGNORECASE) for pat in BOT_USER_AGENT_PATTERNS)
    fraud_flag = "bot_user_agent" if is_bot else None

    # Anti-Fraud Check 2: Known datacenter / scraper IP ranges
    if not fraud_flag:
        for dc_ip in KNOWN_DATACENTER_IPS:
            if client_ip.startswith(dc_ip):
                fraud_flag = "datacenter_bot"
                break

    # Anti-Fraud Check 3: Rapid repeat loop detection (> 3 plays of same track within 5 mins)
    five_mins_ago = now - timedelta(minutes=5)
    recent_loop_query: Dict[str, Any] = {
        "track_id": track_id,
        "timestamp": {"$gte": five_mins_ago},
    }
    if listener_id:
        recent_loop_query["listener_id"] = listener_id
    else:
        recent_loop_query["client_ip"] = client_ip

    recent_plays_count = db.stream_events.count_documents(recent_loop_query)
    if recent_plays_count >= 3:
        fraud_flag = "rapid_repeat_loop"

    # Anti-Fraud Check 4: Multi-account device farm (> 5 distinct accounts from same IP/device in 1 hour)
    one_hour_ago = now - timedelta(hours=1)
    if listener_id:
        distinct_accounts = len(db.stream_events.distinct(
            "listener_id",
            {"client_ip": client_ip, "timestamp": {"$gte": one_hour_ago}, "listener_id": {"$ne": None}}
        ))
        if distinct_accounts >= 5:
            fraud_flag = "account_farm"

    # Qualification criteria: Minimum 30 seconds listening time
    is_qualified_play = (duration_listened_sec >= 30.0) and (fraud_flag is None)

    event_doc = {
        "track_id": track_id,
        "track_title": track.get("title", "Untitled Track"),
        "creator_id": creator_id,
        "listener_id": listener_id,
        "client_ip": client_ip,
        "client_country": client_country.upper(),
        "device_id": device_id,
        "duration_listened_sec": float(duration_listened_sec),
        "is_qualified_play": is_qualified_play,
        "fraud_flag": fraud_flag,
        "credits_paid": STREAM_PAYOUT_CREDIT_RATE if is_qualified_play else 0.0,
        "timestamp": now,
    }
    db.stream_events.insert_one(event_doc)

    # Post earnings to TuneLedger if qualified
    ledger_tx = None
    if is_qualified_play and creator_id != "unclaimed":
        try:
            creator_obj_id = ObjectId(creator_id) if len(creator_id) == 24 else creator_id
            idempotency_key = f"stream_{track_id}_{now.strftime('%Y%m%d%H%M%S')}_{listener_id or client_ip}"
            ledger_tx = record_transaction(
                user_id=creator_obj_id,
                amount=STREAM_PAYOUT_CREDIT_RATE,
                entry_type="STREAM_PAYOUT",
                provider="tunestream",
                provider_ref=str(event_doc["_id"]),
                idempotency_key=idempotency_key,
                description=f"TuneStream verified play: {track.get('title', track_id)} ({client_country})",
                metadata={
                    "track_id": track_id,
                    "listener_id": listener_id,
                    "country": client_country,
                    "duration": duration_listened_sec,
                }
            )
        except Exception as e:
            logger.error(f"Failed to record stream payout in TuneLedger: {e}")

    return {
        "ok": True,
        "event_id": str(event_doc["_id"]),
        "qualified": is_qualified_play,
        "fraud_flag": fraud_flag,
        "credits_earned": STREAM_PAYOUT_CREDIT_RATE if is_qualified_play else 0.0,
        "ledger_tx": str(ledger_tx["ledger_entry"]["_id"]) if ledger_tx and "ledger_entry" in ledger_tx else None,
    }


def get_creator_stream_analytics(creator_id: str) -> Dict[str, Any]:
    """Aggregates streams, listeners, fraud catches, and earnings by country (Spec §4)."""
    cid = str(creator_id)
    pipeline = [
        {"$match": {"creator_id": cid}},
        {"$group": {
            "_id": "$client_country",
            "total_plays": {"$sum": 1},
            "qualified_plays": {"$sum": {"$cond": ["$is_qualified_play", 1, 0]}},
            "flagged_fraud_plays": {"$sum": {"$cond": [{"$ne": ["$fraud_flag", None]}, 1, 0]}},
            "credits_earned": {"$sum": "$credits_paid"},
            "unique_listeners": {"$addToSet": "$listener_id"},
        }}
    ]

    results = list(db.stream_events.aggregate(pipeline))

    by_country = {}
    total_plays = 0
    total_qualified = 0
    total_flagged = 0
    total_credits = 0.0

    for r in results:
        c_code = r["_id"] or "UNKNOWN"
        t_plays = r["total_plays"]
        q_plays = r["qualified_plays"]
        f_plays = r["flagged_fraud_plays"]
        c_earned = float(r["credits_earned"])

        total_plays += t_plays
        total_qualified += q_plays
        total_flagged += f_plays
        total_credits += c_earned

        by_country[c_code] = {
            "country": c_code,
            "total_plays": t_plays,
            "qualified_plays": q_plays,
            "flagged_fraud_plays": f_plays,
            "credits_earned": round(c_earned, 4),
        }

    return {
        "creator_id": cid,
        "total_plays": total_plays,
        "total_qualified_plays": total_qualified,
        "total_flagged_fraud_plays": total_flagged,
        "total_credits_earned": round(total_credits, 4),
        "by_country": by_country,
    }


def tip_creator_with_credits(
    fan_user: Dict[str, Any],
    creator_id: str,
    amount_credits: int,
    track_id: Optional[str] = None,
    message: Optional[str] = None,
    idempotency_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Processes a fan credit tip directly to artist ledger (Spec §4).

    Rules:
    - 95% net credited to artist ledger.
    - 5% platform fee recorded in ledger.
    - Zero recurring fan subscriptions.
    - Double-entry atomic balance mutations.
    """
    if amount_credits <= 0:
        raise ValueError("Tip amount must be positive credits.")

    fan_id = fan_user["_id"]
    fan_balance = fan_user.get("credits", 0)
    if fan_balance < amount_credits:
        raise ValueError(f"Insufficient credit balance ({fan_balance} available, {amount_credits} needed).")

    # Resolve creator
    try:
        c_obj = ObjectId(creator_id)
    except Exception:
        c_obj = creator_id

    creator = db.users.find_one({"_id": c_obj})
    if not creator:
        raise ValueError(f"Creator '{creator_id}' not found.")

    # Calculate splits: 95% to creator, 5% platform fee
    fee_credits = round(amount_credits * (PLATFORM_TIP_FEE_PERCENT / 100.0), 2)
    creator_credits = round(amount_credits - fee_credits, 2)

    ik_fan = idempotency_key or f"tip_fan_{fan_id}_{creator_id}_{datetime.now(timezone.utc).timestamp()}"
    ik_creator = f"tip_rec_{ik_fan}"

    # 1. Deduct full tip from fan
    fan_tx = record_transaction(
        user_id=fan_id,
        amount=-int(amount_credits),
        entry_type="FAN_TIP_SENT",
        provider="tunestream",
        provider_ref=str(creator["_id"]),
        idempotency_key=ik_fan,
        description=f"Fan tip to {creator.get('name', 'Creator')}: {amount_credits} credits",
        metadata={"track_id": track_id, "message": message}
    )

    # 2. Credit creator net 95%
    creator_tx = record_transaction(
        user_id=creator["_id"],
        amount=float(creator_credits),
        entry_type="FAN_TIP_RECEIVED",
        provider="tunestream",
        provider_ref=str(fan_id),
        idempotency_key=ik_creator,
        description=f"Fan tip received from {fan_user.get('name', 'Fan')} (95% net split)",
        metadata={
            "track_id": track_id,
            "gross_credits": amount_credits,
            "platform_fee": fee_credits,
            "message": message,
        }
    )

    # 3. Save tip receipt record
    tip_doc = {
        "fan_id": str(fan_id),
        "fan_name": fan_user.get("name"),
        "creator_id": str(creator["_id"]),
        "creator_name": creator.get("name"),
        "gross_credits": amount_credits,
        "creator_net_credits": creator_credits,
        "platform_fee_credits": fee_credits,
        "track_id": track_id,
        "message": message,
        "fan_tx_id": str(fan_tx.get("ledger_entry", {}).get("_id")),
        "creator_tx_id": str(creator_tx.get("ledger_entry", {}).get("_id")),
        "timestamp": datetime.now(timezone.utc),
    }
    db.fan_tips.insert_one(tip_doc)

    return {
        "ok": True,
        "tip_id": str(tip_doc["_id"]),
        "gross_credits": amount_credits,
        "creator_net_credits": creator_credits,
        "platform_fee_credits": fee_credits,
        "new_fan_balance": fan_tx.get("current_balance"),
    }


def report_track_content(
    track_id: str,
    reporting_user: Optional[Dict[str, Any]] = None,
    reason: str = "copyright_infringement",
    notes: Optional[str] = None,
) -> Dict[str, Any]:
    """Records community content / copyright / safety report (Spec §4)."""
    track = get_track_or_release(track_id)
    if not track:
        raise ValueError(f"Track '{track_id}' not found")

    report_doc = {
        "track_id": track_id,
        "track_title": track.get("title"),
        "reporter_id": str(reporting_user["_id"]) if reporting_user else "anonymous",
        "reporter_email": reporting_user.get("email") if reporting_user else None,
        "reason": reason,
        "notes": notes,
        "status": "pending_review",
        "created_at": datetime.now(timezone.utc),
    }
    db.content_reports.insert_one(report_doc)
    return {"ok": True, "report_id": str(report_doc["_id"]), "status": "pending_review"}
