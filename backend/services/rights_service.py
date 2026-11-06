"""Rights Data Model, Validation Rules & Sync-Ready Gate Engine.

Implements Technical Foundation Spec §6:
- Integer basis point writer share validation (exactly 10,000 bps).
- Strict ISRC format validation (^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$).
- Strict ISWC format normalization (T-123.456.789-0).
- IPI digits-only validation.
- Audio asset validation (WAV, FLAC, MP3, content hash, corruption detection).
- Duplicate detection (ISRC collision, content hash, fuzzy title + writer).
- Sync-Ready Gate & weighted completeness scoring (master audio, signed split sheet,
  ISRC / unreleased declaration, sample clearance, lyrics, language, explicit flag, AI consent).
- Unified deal calculator & contract engine (50/50 standard, co-pub, catalogue acquisition, 90/10 sync).
"""
from __future__ import annotations

import difflib
import hashlib
import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple, Union

from bson import ObjectId
from config import db

logger = logging.getLogger("rights_service")

# Regex standards per Spec §6
ISRC_PATTERN = re.compile(r"^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$")
ISWC_PATTERN = re.compile(r"^T-[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]$")
IPI_PATTERN = re.compile(r"^\d{9,11}$")

TOTAL_BASIS_POINTS = 10_000  # 100.00%


class RightsValidationError(Exception):
    """Custom exception raised when rights or metadata validation fails."""
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.field = field


def validate_split_basis_points(splits: List[Dict[str, Any]]) -> Tuple[bool, int, Optional[str]]:
    """Validates writer shares per work are integers in basis points and total exactly 10,000.

    Reject otherwise (Spec §6 Rule 1).
    """
    if not splits:
        return False, 0, "At least one split entry is required"

    total = 0
    for idx, s in enumerate(splits):
        bps = s.get("share_bps")
        if bps is None:
            # If provided as percentage or fraction, reject float imprecision
            if "share_pct" in s:
                return False, 0, f"Split index {idx} uses share_pct; share_bps integer required"
            return False, 0, f"Split index {idx} missing integer share_bps"

        if not isinstance(bps, int):
            return False, 0, f"Split index {idx} share_bps must be integer, got {type(bps).__name__}"

        if bps <= 0 or bps > TOTAL_BASIS_POINTS:
            return False, 0, f"Split index {idx} share_bps ({bps}) out of bounds (1..10000)"

        total += bps

    if total != TOTAL_BASIS_POINTS:
        return False, total, f"Split total is {total} bps; must equal exactly {TOTAL_BASIS_POINTS} bps (100.00%)"

    return True, total, None


def validate_and_normalize_isrc(raw_isrc: Optional[str]) -> Tuple[bool, Optional[str], Optional[str]]:
    """Strips hyphens, uppercases, and validates against ^[A-Z]{2}[A-Z0-9]{3}[0-9]{2}[0-9]{5}$ (Spec §6 Rule 2)."""
    if not raw_isrc:
        return False, None, "ISRC is required"

    clean = raw_isrc.replace("-", "").replace(" ", "").strip().upper()
    if not ISRC_PATTERN.match(clean):
        return False, clean, f"Invalid ISRC '{raw_isrc}'. Must match 12-character format (e.g. KETM12600001)"

    return True, clean, None


def validate_and_normalize_iswc(raw_iswc: Optional[str]) -> Tuple[bool, Optional[str], Optional[str]]:
    r"""Normalises to T-123.456.789-0 and validates against ^T-[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]$ (Spec §6 Rule 3)."""
    if not raw_iswc:
        return False, None, "ISWC is required"

    s = raw_iswc.strip().upper().replace(" ", "")
    # Remove existing punctuation
    digits_and_prefix = re.sub(r"[^T0-9]", "", s)
    if not digits_and_prefix.startswith("T"):
        digits_and_prefix = "T" + digits_and_prefix

    digits = digits_and_prefix[1:]
    if len(digits) != 10:
        return False, raw_iswc, f"Invalid ISWC '{raw_iswc}'. Expected 'T' followed by 10 digits"

    normalized = f"T-{digits[0:3]}.{digits[3:6]}.{digits[6:9]}-{digits[9]}"
    if not ISWC_PATTERN.match(normalized):
        return False, normalized, f"Normalized ISWC '{normalized}' does not match standard pattern"

    return True, normalized, None


def validate_ipi(raw_ipi: Optional[str]) -> Tuple[bool, Optional[str], Optional[str]]:
    """Confirms IPI is digits only and between 9 and 11 digits (Spec §6 Rule 4)."""
    if not raw_ipi:
        return False, None, "IPI number is required"

    clean = re.sub(r"\D", "", raw_ipi.strip())
    if not IPI_PATTERN.match(clean):
        return False, clean, f"Invalid IPI '{raw_ipi}'. Must consist of 9 to 11 digits"

    return True, clean, None


def validate_audio_asset(
    file_bytes: bytes,
    filename: str,
    min_bytes: int = 10_000
) -> Tuple[bool, Optional[str], Optional[str]]:
    """Validates audio format (WAV, FLAC, MP3), minimum length, and computes SHA-256 hash.

    Rejects silent or corrupt files (Spec §6 Rule 6).
    """
    if not file_bytes or len(file_bytes) < min_bytes:
        return False, None, "Audio file is empty, corrupt, or below minimum size threshold (10 KB)"

    lower_name = filename.lower()
    valid_exts = (".wav", ".flac", ".mp3")
    if not any(lower_name.endswith(ext) for ext in valid_exts):
        return False, None, f"Unsupported audio format. Allowed: WAV, FLAC, MP3 (got {filename})"

    # Check magic bytes
    is_wav = file_bytes.startswith(b"RIFF") and b"WAVE" in file_bytes[:16]
    is_flac = file_bytes.startswith(b"fLaC")
    is_mp3 = file_bytes.startswith(b"ID3") or file_bytes.startswith(b"\xff\xfb") or file_bytes.startswith(b"\xff\xf3")

    if not (is_wav or is_flac or is_mp3):
        return False, None, "Audio header corrupted or mismatched format signature"

    # Reject silent byte arrays (all zeros)
    if file_bytes.count(b"\x00") > len(file_bytes) * 0.98:
        return False, None, "Audio asset appears silent or corrupted (excessive zero-byte padding)"

    content_hash = hashlib.sha256(file_bytes).hexdigest()
    return True, content_hash, None


def check_for_duplicates(
    isrc: Optional[str] = None,
    content_hash: Optional[str] = None,
    title: Optional[str] = None,
    primary_writer: Optional[str] = None,
    exclude_track_id: Optional[str] = None,
) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """Flags duplicate tracks on same ISRC, audio content hash, or fuzzy title + writer match.

    Hold for review (Spec §6 Rule 5).
    """
    # 1. Match on exact ISRC
    if isrc:
        clean_isrc = isrc.replace("-", "").strip().upper()
        query = {"isrc": clean_isrc}
        if exclude_track_id:
            query["_id"] = {"$ne": ObjectId(exclude_track_id) if ObjectId.is_valid(exclude_track_id) else exclude_track_id}
        existing = db.tracks.find_one(query) or db.catalog_tracks.find_one({"tracks.isrc": clean_isrc})
        if existing:
            return True, f"Duplicate ISRC collision: {clean_isrc} already registered", existing

    # 2. Match on audio content hash
    if content_hash:
        query = {"content_hash": content_hash}
        if exclude_track_id:
            query["_id"] = {"$ne": ObjectId(exclude_track_id) if ObjectId.is_valid(exclude_track_id) else exclude_track_id}
        existing = db.tracks.find_one(query)
        if existing:
            return True, f"Duplicate audio fingerprint: content hash {content_hash[:12]} already uploaded", existing

    # 3. Fuzzy title + writer match
    if title and primary_writer:
        norm_title = title.strip().lower()
        norm_writer = primary_writer.strip().lower()
        candidates = list(db.tracks.find({}, {"title": 1, "artist": 1, "writers": 1}).limit(200))
        for cand in candidates:
            if exclude_track_id and str(cand.get("_id")) == str(exclude_track_id):
                continue
            cand_title = str(cand.get("title", "")).strip().lower()
            cand_artist = str(cand.get("artist", "")).strip().lower()

            ratio_title = difflib.SequenceMatcher(None, norm_title, cand_title).ratio()
            ratio_writer = difflib.SequenceMatcher(None, norm_writer, cand_artist).ratio()

            if ratio_title >= 0.85 and ratio_writer >= 0.85:
                return True, f"Fuzzy metadata match with existing track '{cand.get('title')}' by '{cand.get('artist')}'", cand

    return False, None, None


# ---------------------------------------------------------------------------
# Sync-Ready Gate & Completeness Scorer (Spec §6 Rule 7)
# ---------------------------------------------------------------------------

GATE_WEIGHTS = {
    "master_audio": 20,
    "signed_split_sheet": 25,
    "isrc_or_unreleased": 15,
    "sample_clearance": 10,
    "lyrics": 10,
    "language": 5,
    "explicit_flag": 5,
    "ai_consent": 10,
}


def evaluate_sync_ready_gate(track_data: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluates whether a track qualifies for the Sync-Ready Gate.

    A track becomes pitchable ONLY when:
    - Master audio is verified
    - Signed split sheet exists totaling exactly 10,000 bps
    - Valid ISRC or declared unreleased master
    - Sample clearance declaration is confirmed
    - Lyrics are provided
    - Primary language is specified
    - Explicit content flag is set
    - AI consent preferences are declared (ai_training default False)
    """
    checks = {}
    score = 0

    # 1. Master Audio
    has_audio = bool(track_data.get("audio_url") or track_data.get("content_hash") or track_data.get("audio_asset"))
    checks["master_audio"] = {
        "passed": has_audio,
        "weight": GATE_WEIGHTS["master_audio"],
        "detail": "Master audio asset uploaded and verified" if has_audio else "Master audio file missing"
    }
    if has_audio:
        score += GATE_WEIGHTS["master_audio"]

    # 2. Signed split sheet totaling 10,000 basis points
    splits = track_data.get("splits") or []
    split_ok, total_bps, split_err = validate_split_basis_points(splits)
    is_signed = bool(track_data.get("split_sheet_signed", False) or track_data.get("agreement_signed_at"))
    split_passed = split_ok and is_signed
    checks["signed_split_sheet"] = {
        "passed": split_passed,
        "weight": GATE_WEIGHTS["signed_split_sheet"],
        "total_bps": total_bps,
        "detail": "Split sheet signed by all parties totaling 10,000 bps" if split_passed else (split_err or "Split sheet unexecuted")
    }
    if split_passed:
        score += GATE_WEIGHTS["signed_split_sheet"]

    # 3. ISRC or declared unreleased
    isrc = track_data.get("isrc")
    unreleased_declared = track_data.get("unreleased_declaration", False)
    isrc_ok = False
    if isrc:
        isrc_ok, _, _ = validate_and_normalize_isrc(isrc)

    has_isrc_or_decl = isrc_ok or unreleased_declared
    checks["isrc_or_unreleased"] = {
        "passed": has_isrc_or_decl,
        "weight": GATE_WEIGHTS["isrc_or_unreleased"],
        "detail": "Verified ISRC" if isrc_ok else ("Unreleased master declaration confirmed" if unreleased_declared else "ISRC or declaration required")
    }
    if has_isrc_or_decl:
        score += GATE_WEIGHTS["isrc_or_unreleased"]

    # 4. Sample clearance declaration
    sample_clearance = track_data.get("sample_clearance", False)
    checks["sample_clearance"] = {
        "passed": bool(sample_clearance),
        "weight": GATE_WEIGHTS["sample_clearance"],
        "detail": "All samples cleared or 100% original composition affirmed" if sample_clearance else "Sample clearance declaration missing"
    }
    if sample_clearance:
        score += GATE_WEIGHTS["sample_clearance"]

    # 5. Lyrics
    lyrics = track_data.get("lyrics")
    instrumental = track_data.get("is_instrumental", False)
    has_lyrics = bool(lyrics and len(str(lyrics).strip()) > 10) or instrumental
    checks["lyrics"] = {
        "passed": has_lyrics,
        "weight": GATE_WEIGHTS["lyrics"],
        "detail": "Lyrics submitted (or flagged instrumental)" if has_lyrics else "Lyrics required for vocal works"
    }
    if has_lyrics:
        score += GATE_WEIGHTS["lyrics"]

    # 6. Language
    language = track_data.get("language")
    has_language = bool(language and len(str(language).strip()) >= 2)
    checks["language"] = {
        "passed": has_language,
        "weight": GATE_WEIGHTS["language"],
        "detail": f"Language: {language}" if has_language else "Track primary language not specified"
    }
    if has_language:
        score += GATE_WEIGHTS["language"]

    # 7. Explicit flag
    explicit_val = track_data.get("explicit")
    has_explicit = explicit_val is not None and isinstance(explicit_val, bool)
    checks["explicit_flag"] = {
        "passed": has_explicit,
        "weight": GATE_WEIGHTS["explicit_flag"],
        "detail": f"Explicit flag set ({explicit_val})" if has_explicit else "Explicit rating flag must be explicitly set"
    }
    if has_explicit:
        score += GATE_WEIGHTS["explicit_flag"]

    # 8. AI Consent dictionary
    ai_consent = track_data.get("ai_consent")
    valid_consent = False
    if isinstance(ai_consent, dict):
        # Must define ai_training (default False), ai_tagging, public_listing, sync_pitching
        valid_consent = "ai_training" in ai_consent and "sync_pitching" in ai_consent

    checks["ai_consent"] = {
        "passed": valid_consent,
        "weight": GATE_WEIGHTS["ai_consent"],
        "detail": "AI rights consent preferences declared" if valid_consent else "AI consent model missing (ai_training must be specified)"
    }
    if valid_consent:
        score += GATE_WEIGHTS["ai_consent"]

    is_pitchable = score == 100 and all(c["passed"] for c in checks.values())

    return {
        "is_pitchable": is_pitchable,
        "completeness_score": score,
        "max_score": 100,
        "checks": checks,
        "evaluated_at": datetime.now(timezone.utc).isoformat()
    }


# ---------------------------------------------------------------------------
# Contract Engine & Unified Deal Calculator (Spec §6)
# ---------------------------------------------------------------------------

DEAL_TYPES = {
    "standard_50_50": {
        "name": "Standard 50/50 Publishing Split",
        "writer_share_bps": 5000,
        "publisher_share_bps": 5000,
        "recoupment_advance_usd": 0.0,
    },
    "copub_75_25": {
        "name": "Co-Publishing Growth Tier (75/25)",
        "writer_share_bps": 7500,
        "publisher_share_bps": 2500,
        "recoupment_advance_usd": 0.0,
    },
    "copub_85_15": {
        "name": "Co-Publishing Pro Tier (85/15)",
        "writer_share_bps": 8500,
        "publisher_share_bps": 1500,
        "recoupment_advance_usd": 0.0,
    },
    "catalogue_acquisition": {
        "name": "Catalogue Acquisition with Advance Recoupment",
        "writer_share_bps": 5000,
        "publisher_share_bps": 5000,
        "recoupment_advance_usd": 10000.0,
    },
    "sync_licensing": {
        "name": "One-Stop Sync Licensing Standard (90/10)",
        "rights_holder_bps": 9000,  # Settled at 90/10 per Spec §6 & go-live plan
        "platform_fee_bps": 1000,
    }
}


def calculate_deal_payout(
    deal_type_key: str,
    gross_amount: float,
    unrecouped_advance: float = 0.0,
) -> Dict[str, Any]:
    """Powers the public deal calculator, agreement generator, and payout logic.

    Guarantees that all three surfaces use the exact same calculation logic (Spec §6).
    """
    deal = DEAL_TYPES.get(deal_type_key)
    if not deal:
        raise ValueError(f"Unknown deal type: {deal_type_key}")

    gross_cents = int(round(gross_amount * 100))
    advance_cents = int(round(unrecouped_advance * 100))

    if deal_type_key == "sync_licensing":
        # 90/10 sync split
        platform_fee_cents = int(round(gross_cents * (deal["platform_fee_bps"] / TOTAL_BASIS_POINTS)))
        rights_holder_cents = gross_cents - platform_fee_cents
        return {
            "deal_type": deal_type_key,
            "deal_name": deal["name"],
            "gross_usd": round(gross_cents / 100.0, 2),
            "platform_fee_usd": round(platform_fee_cents / 100.0, 2),
            "rights_holder_net_usd": round(rights_holder_cents / 100.0, 2),
            "split_ratio": "90/10",
            "recoupment_deducted_usd": 0.0,
            "remaining_unrecouped_advance_usd": 0.0,
        }

    # Standard / Co-pub / Catalogue Acquisition
    writer_bps = deal["writer_share_bps"]
    publisher_bps = deal["publisher_share_bps"]

    gross_writer_cents = int(round(gross_cents * (writer_bps / TOTAL_BASIS_POINTS)))
    gross_publisher_cents = gross_cents - gross_writer_cents

    # Apply recoupment if advance exists
    recoupment_deducted_cents = 0
    if advance_cents > 0:
        recoupment_deducted_cents = min(advance_cents, gross_writer_cents)
        net_writer_cents = gross_writer_cents - recoupment_deducted_cents
        remaining_advance_cents = advance_cents - recoupment_deducted_cents
    else:
        net_writer_cents = gross_writer_cents
        remaining_advance_cents = 0

    return {
        "deal_type": deal_type_key,
        "deal_name": deal["name"],
        "gross_usd": round(gross_cents / 100.0, 2),
        "gross_writer_usd": round(gross_writer_cents / 100.0, 2),
        "gross_publisher_usd": round(gross_publisher_cents / 100.0, 2),
        "recoupment_deducted_usd": round(recoupment_deducted_cents / 100.0, 2),
        "net_writer_payout_usd": round(net_writer_cents / 100.0, 2),
        "remaining_unrecouped_advance_usd": round(remaining_advance_cents / 100.0, 2),
        "writer_share_bps": writer_bps,
        "publisher_share_bps": publisher_bps,
    }
