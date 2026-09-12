"""Catalogue & Ingestion Router for TuneMavens & Intermaven Network.

Handles persistent track management, wizard-based album/EP/mixtape ingestions,
metadata editing, track deletion, and synchronization across db.epks and db.cms_layouts.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import logging
import re
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from config import db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/catalog", tags=["Catalogue"])


def get_default_catalog_tracks(artist_name: str = "Ndufo") -> List[Dict[str, Any]]:
    return [
        {
            "id": 1,
            "isrc": "KE-TM1-26-00042",
            "title": "Nairobi Cyberwave (Master)",
            "artist": artist_name,
            "release": "Neon Safari EP",
            "releaseType": "EP",
            "year": "2026",
            "genre": "Afro-House",
            "duration": "3:45",
            "streams": "3.4M",
            "priceCredits": 50,
            "coverArt": "https://picsum.photos/seed/cyberwave_cover/600/600",
            "coverText": "Cyberwave",
            "coverBg": "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
            "status": "valid",
            "isFeatured": True,
            "writers": [{"name": artist_name, "pro": "BMI", "share": 100}],
            "producers": [{"name": artist_name, "role": "Primary Producer"}],
            "publishingSplit": "Writer (50%) / Publisher (50%)",
            "distributionSplit": "Artist (60%) / Producer (25%) / Label (15%)",
            "split": "Artist (60%) / Producer (25%) / Label (15%)",
            "syncCleared": True
        },
        {
            "id": 2,
            "isrc": "KE-TM1-26-00043",
            "title": "Sunset over Rift Valley",
            "artist": artist_name,
            "release": "Singles 2026",
            "releaseType": "Single",
            "year": "2026",
            "genre": "Amapiano",
            "duration": "4:12",
            "streams": "1.8M",
            "priceCredits": 50,
            "coverArt": "https://picsum.photos/seed/riftvalley_cover/600/600",
            "coverText": "Sunset",
            "coverBg": "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            "status": "valid",
            "isFeatured": True,
            "writers": [{"name": artist_name, "pro": "ASCAP", "share": 100}],
            "producers": [{"name": artist_name, "role": "Primary Producer"}],
            "publishingSplit": "Writer (50%) / Publisher (50%)",
            "distributionSplit": "Artist (50%) / Producer (30%) / Label (20%)",
            "split": "Artist (50%) / Producer (30%) / Label (20%)",
            "syncCleared": True
        },
        {
            "id": 3,
            "isrc": "KE-TM1-26-00044",
            "title": "Afro-Synth Cascade",
            "artist": artist_name,
            "release": "Mainstage Dubs",
            "releaseType": "Album",
            "year": "2026",
            "genre": "Deep-House",
            "duration": "3:18",
            "streams": "940K",
            "priceCredits": 40,
            "coverArt": "https://picsum.photos/seed/afrosynth_cover/600/600",
            "coverText": "Cascade",
            "coverBg": "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
            "status": "valid",
            "isFeatured": False,
            "writers": [{"name": artist_name, "pro": "BMI", "share": 100}],
            "producers": [{"name": artist_name, "role": "Primary Producer"}],
            "publishingSplit": "Writer (50%) / Publisher (50%)",
            "distributionSplit": "Artist (50%) / Producer (50%)",
            "split": "Artist (50%) / Producer (50%)",
            "syncCleared": True
        },
        {
            "id": 4,
            "isrc": "KE-TM1-26-00045",
            "title": "Midnight Mara Starlight",
            "artist": artist_name,
            "release": "EP 2025",
            "releaseType": "EP",
            "year": "2025",
            "genre": "Afrobeats",
            "duration": "5:02",
            "streams": "2.1M",
            "priceCredits": 60,
            "coverArt": "https://picsum.photos/seed/mara_cover/600/600",
            "coverText": "Mara",
            "coverBg": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            "status": "valid",
            "isFeatured": False,
            "writers": [{"name": artist_name, "pro": "PRS", "share": 100}],
            "producers": [{"name": artist_name, "role": "Primary Producer"}],
            "publishingSplit": "Writer (50%) / Publisher (50%)",
            "distributionSplit": "Artist (50%) / Producer (30%) / Label (20%)",
            "split": "Artist (50%) / Producer (30%) / Label (20%)",
            "syncCleared": True
        }
    ]


class TrackModel(BaseModel):
    id: Optional[Any] = None
    isrc: str
    title: str
    artist: Optional[str] = "Ndufo"
    release: Optional[str] = "Singles"
    releaseType: Optional[str] = "Single"
    year: Optional[str] = "2026"
    genre: Optional[str] = "Afro-House"
    duration: Optional[str] = "3:30"
    streams: Optional[str] = "0"
    priceCredits: Optional[int] = 50
    coverArt: Optional[str] = None
    coverBg: Optional[str] = None
    coverText: Optional[str] = None
    audioUrl: Optional[str] = None
    fileUrl: Optional[str] = None
    status: Optional[str] = "valid"
    isFeatured: Optional[bool] = False
    writers: Optional[List[Dict[str, Any]]] = None
    producers: Optional[List[Dict[str, Any]]] = None
    publishingSplit: Optional[str] = None
    distributionSplit: Optional[str] = None
    split: Optional[str] = None
    syncCleared: Optional[bool] = True


class WizardIngestPayload(BaseModel):
    subdomain: Optional[str] = "ndufo"
    project: Optional[Dict[str, Any]] = None
    release: Optional[Dict[str, Any]] = None
    tracks: List[Dict[str, Any]] = Field(default_factory=list)
    globalRights: Optional[Dict[str, Any]] = None


DEFAULT_ALBUMS = [
    {
        "id": 401,
        "title": "Nairobi Cyberwave (Deluxe LP)",
        "year": "2026",
        "type": "Album",
        "genre": "Afro-House",
        "tracksCount": 12,
        "cover": "https://picsum.photos/seed/album1_epk/400",
        "streams": "3.4M",
        "isrc": "KE-TM1-26-00042",
        "priceCredits": 50,
        "artist": "Ndufo"
    },
    {
        "id": 402,
        "title": "Rift Valley Soundscapes",
        "year": "2026",
        "type": "Album",
        "genre": "Amapiano",
        "tracksCount": 10,
        "cover": "https://picsum.photos/seed/album2_epk/400",
        "streams": "1.8M",
        "isrc": "KE-TM1-26-00043",
        "priceCredits": 50,
        "artist": "Ndufo"
    },
    {
        "id": 403,
        "title": "Afro-Synth Cascade",
        "year": "2025",
        "type": "Single",
        "genre": "Deep-House",
        "tracksCount": 2,
        "cover": "https://picsum.photos/seed/album3_epk/400",
        "streams": "940K",
        "isrc": "KE-TM1-26-00044",
        "priceCredits": 40,
        "artist": "Ndufo"
    },
    {
        "id": 404,
        "title": "Midnight Mara Starlight",
        "year": "2025",
        "type": "EP",
        "genre": "Afrobeats",
        "tracksCount": 5,
        "cover": "https://picsum.photos/seed/album4_epk/400",
        "streams": "2.1M",
        "isrc": "KE-TM1-26-00045",
        "priceCredits": 45,
        "artist": "Ndufo"
    }
]


def build_creator_albums(subdomain: str, tracks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Builds a unified list of albums from db.releases and tracks for a creator."""
    clean = subdomain.lower().strip().replace(" ", "")
    if not tracks:
        try:
            cat_doc = db.catalog_tracks.find_one({"subdomain": clean})
            tracks = cat_doc.get("tracks", []) if cat_doc else []
        except Exception:
            tracks = []
    albums_map = {}

    # 1. Fetch from db.releases (e.g. newly ingested albums like 'Carbon Dating Pt 1')
    try:
        releases_cursor = db.releases.find({"subdomain": clean}).sort("created_at", -1)
        for r in releases_cursor:
            title = r.get("title")
            if not title:
                continue
            key = title.lower().strip()
            if key in albums_map:
                continue
            matching = [t for t in tracks if (t.get("release") or "").lower().strip() == key]
            track_count = r.get("trackCount") or len(matching) or (len(r.get("isrcs", [])) if r.get("isrcs") else 1)
            cover = r.get("coverArt") or (matching[0].get("coverArt") if matching else None) or f"https://picsum.photos/seed/{abs(hash(title))}/400"
            first_isrc = (r.get("isrcs") or [matching[0].get("isrc") if matching else "KE-TM1-26-00001"])[0]

            albums_map[key] = {
                "id": str(r.get("_id")) if "_id" in r else f"rel-{abs(hash(title))}",
                "title": title,
                "year": str(r.get("year") or datetime.now().year),
                "type": r.get("type") or "Album",
                "genre": r.get("genre") or (matching[0].get("genre") if matching else "Afro-House"),
                "tracksCount": track_count,
                "cover": cover,
                "streams": r.get("streams") or "Master Audio",
                "isrc": first_isrc,
                "isrcs": r.get("isrcs") or [t.get("isrc") for t in matching if t.get("isrc")],
                "tracks": matching,
                "priceCredits": int(r.get("priceCredits") or 50),
                "artist": r.get("artist") or clean.capitalize()
            }
    except Exception as e:
        logger.warning(f"Error fetching releases in build_creator_albums: {e}")

    # 2. Derive from tracks if not in db.releases
    for t in tracks:
        rel_title = (t.get("release") or "").strip()
        if not rel_title or rel_title.lower() in ("singles", "single", "unknown", "untitled"):
            continue
        key = rel_title.lower()
        if key not in albums_map:
            matching = [tr for tr in tracks if (tr.get("release") or "").lower().strip() == key]
            cover = t.get("coverArt") or f"https://picsum.photos/seed/{abs(hash(rel_title))}/400"
            albums_map[key] = {
                "id": f"trk-rel-{abs(hash(rel_title))}",
                "title": rel_title,
                "year": str(t.get("year") or datetime.now().year),
                "type": t.get("releaseType") or ("Album" if len(matching) >= 8 else ("EP" if len(matching) >= 3 else "Single")),
                "genre": t.get("genre") or "Afro-House",
                "tracksCount": len(matching),
                "cover": cover,
                "streams": t.get("streams") or "100K",
                "isrc": t.get("isrc") or "KE-TM1-26-00001",
                "isrcs": [tr.get("isrc") for tr in matching if tr.get("isrc")],
                "tracks": matching,
                "priceCredits": int(t.get("priceCredits") or 50),
                "artist": t.get("artist") or clean.capitalize()
            }

    # 3. Append default canonical albums if not colliding
    for def_alb in DEFAULT_ALBUMS:
        key = def_alb["title"].lower().strip()
        if key not in albums_map:
            albums_map[key] = dict(def_alb)

    return list(albums_map.values())


def _sync_tracks_to_all_collections(subdomain: str, tracks: List[Dict[str, Any]]):
    """Synchronizes track catalog and derived albums to db.catalog_tracks, db.epks, and db.cms_layouts."""
    clean = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean}"
    now = datetime.now(timezone.utc)
    albums = build_creator_albums(clean, tracks)

    # 1. Update/Upsert in db.catalog_tracks
    db.catalog_tracks.update_one(
        {"subdomain": clean},
        {"$set": {"subdomain": clean, "tracks": tracks, "albums": albums, "updated_at": now}},
        upsert=True
    )

    # 2. Update in db.epks
    db.epks.update_one(
        {"subdomain": clean},
        {"$set": {"tracks": tracks, "albums": albums, "updated_at": now}},
        upsert=True
    )

    # 3. Update in db.cms_layouts
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {"data.tracks": tracks, "data.albums": albums, "updated_at": now}},
        upsert=True
    )


@router.get("/tracks", response_model=Dict[str, Any])
def get_catalog_tracks(subdomain: str = Query("ndufo")):
    """Retrieve full catalog tracks for an artist, ensuring persistent storage."""
    clean = subdomain.lower().strip().replace(" ", "")

    # Check dedicated catalog_tracks collection
    doc = db.catalog_tracks.find_one({"subdomain": clean})
    if doc and doc.get("tracks") and len(doc["tracks"]) > 0:
        if not doc.get("albums") or len(doc.get("albums")) == 0:
            _sync_tracks_to_all_collections(clean, doc["tracks"])
        return {"subdomain": clean, "count": len(doc["tracks"]), "tracks": doc["tracks"]}

    # Fallback to db.epks
    epk_doc = db.epks.find_one({"subdomain": clean})
    if epk_doc and epk_doc.get("tracks") and len(epk_doc["tracks"]) > 0:
        tracks = epk_doc["tracks"]
        _sync_tracks_to_all_collections(clean, tracks)
        return {"subdomain": clean, "count": len(tracks), "tracks": tracks}

    # Fallback to db.cms_layouts
    cms_doc = db.cms_layouts.find_one({"layout_id": f"epk_{clean}"})
    if cms_doc and (cms_doc.get("data") or {}).get("tracks"):
        tracks = cms_doc["data"]["tracks"]
        _sync_tracks_to_all_collections(clean, tracks)
        return {"subdomain": clean, "count": len(tracks), "tracks": tracks}

    # Fallback to default canonical tracks
    artist_name = (epk_doc.get("artist_name") if epk_doc else None) or clean.capitalize()
    default_tracks = get_default_catalog_tracks(artist_name)
    _sync_tracks_to_all_collections(clean, default_tracks)
    return {"subdomain": clean, "count": len(default_tracks), "tracks": default_tracks}


@router.get("/albums", response_model=Dict[str, Any])
def get_catalog_albums(subdomain: str = Query("ndufo")):
    """Retrieve full album discography collection for an artist."""
    clean = subdomain.lower().strip().replace(" ", "")
    tracks_res = get_catalog_tracks(subdomain=clean)
    tracks = tracks_res.get("tracks", [])
    albums = build_creator_albums(clean, tracks)
    return {
        "subdomain": clean,
        "count": len(albums),
        "albums": albums
    }


@router.post("/tracks", response_model=Dict[str, Any])
def add_catalog_track(payload: Dict[str, Any], subdomain: str = Query("ndufo")):
    """Add or append single or multiple tracks into the catalog."""
    clean = subdomain.lower().strip().replace(" ", "")
    existing_res = get_catalog_tracks(subdomain=clean)
    existing_tracks = existing_res.get("tracks", [])

    new_items = payload.get("tracks", [payload] if "isrc" in payload or "title" in payload else [])
    if not new_items:
        raise HTTPException(status_code=400, detail="No track data provided.")

    merged_tracks = list(existing_tracks)
    existing_isrcs = {t.get("isrc") for t in existing_tracks if t.get("isrc")}

    for item in new_items:
        isrc = item.get("isrc") or f"KE-TM1-26-{45700 + len(merged_tracks)}"
        item["isrc"] = isrc
        item["status"] = item.get("status", "valid")
        if not item.get("coverArt"):
            item["coverArt"] = f"https://picsum.photos/seed/{abs(hash(item.get('title', 'track')))}/600/600"
        
        # Replace if ISRC exists, otherwise prepend
        if isrc in existing_isrcs:
            merged_tracks = [item if t.get("isrc") == isrc else t for t in merged_tracks]
        else:
            merged_tracks.insert(0, item)
            existing_isrcs.add(isrc)

    _sync_tracks_to_all_collections(clean, merged_tracks)
    logger.info(f"Updated catalogue for {clean}: total {len(merged_tracks)} tracks.")
    return {
        "status": "success",
        "subdomain": clean,
        "count": len(merged_tracks),
        "tracks": merged_tracks,
        "message": f"Successfully ingested {len(new_items)} track(s) into catalogue."
    }


@router.post("/wizard-ingest", response_model=Dict[str, Any])
def wizard_ingest_release(payload: WizardIngestPayload):
    """Complete multi-step wizard ingestion: Project/Album + Audio Tracks + Writers + Splits."""
    clean = (payload.subdomain or "ndufo").lower().strip().replace(" ", "")
    project = payload.project or payload.release or {}
    tracks_input = payload.tracks

    if not tracks_input:
        raise HTTPException(status_code=400, detail="Wizard payload must contain at least one track.")

    existing_res = get_catalog_tracks(subdomain=clean)
    merged_tracks = list(existing_res.get("tracks", []))
    existing_isrcs = {t.get("isrc") for t in merged_tracks if t.get("isrc")}

    album_title = project.get("title") or "New Release"
    album_type = project.get("type") or "Album"
    album_genre = project.get("genre") or "Afro-House"
    album_year = project.get("year") or str(datetime.now().year)
    album_cover = project.get("coverArt") or f"https://picsum.photos/seed/{abs(hash(album_title))}/600/600"
    album_artist = project.get("artist") or clean.capitalize()

    ingested_tracks = []
    for idx, t in enumerate(tracks_input):
        isrc = t.get("isrc") or f"KE-TM1-26-{45800 + len(merged_tracks) + idx}"
        title = t.get("title") or f"Track #{idx + 1}"
        track_obj = {
            "id": t.get("id") or int(datetime.now().timestamp() * 1000) + idx,
            "isrc": isrc,
            "title": title,
            "artist": t.get("artist") or album_artist,
            "release": album_title,
            "releaseType": album_type,
            "year": album_year,
            "genre": t.get("genre") or album_genre,
            "duration": t.get("duration") or "3:30",
            "streams": t.get("streams") or "100K",
            "priceCredits": int(t.get("priceCredits") or 50),
            "coverArt": t.get("coverArt") or album_cover,
            "coverText": title.split(" ")[0] or "Track",
            "coverBg": t.get("coverBg") or "linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)",
            "audioUrl": t.get("audioUrl") or t.get("fileUrl"),
            "fileUrl": t.get("fileUrl") or t.get("audioUrl"),
            "status": "valid",
            "isFeatured": t.get("isFeatured", idx == 0),
            "writers": t.get("writers") or [{"name": album_artist, "pro": "BMI", "share": 100}],
            "producers": t.get("producers") or [{"name": album_artist, "role": "Primary Producer"}],
            "publishingSplit": t.get("publishingSplit") or "Writer (50%) / Publisher (50%)",
            "distributionSplit": t.get("distributionSplit") or "Artist (60%) / Producer (25%) / Label (15%)",
            "split": t.get("split") or t.get("distributionSplit") or "Artist (60%) / Producer (25%) / Label (15%)",
            "syncCleared": t.get("syncCleared", True)
        }

        if isrc in existing_isrcs:
            merged_tracks = [track_obj if old.get("isrc") == isrc else old for old in merged_tracks]
        else:
            merged_tracks.insert(0, track_obj)
            existing_isrcs.add(isrc)

        ingested_tracks.append(track_obj)

    # 1. Upsert into db.releases first so build_creator_albums incorporates it immediately
    release_doc = {
        "subdomain": clean,
        "title": album_title,
        "type": album_type,
        "genre": album_genre,
        "year": album_year,
        "coverArt": album_cover,
        "artist": album_artist,
        "trackCount": len(ingested_tracks),
        "isrcs": [t["isrc"] for t in ingested_tracks],
        "created_at": datetime.now(timezone.utc)
    }
    db.releases.update_one(
        {"subdomain": clean, "title": album_title},
        {"$set": release_doc},
        upsert=True
    )

    # 2. Sync tracks and albums across db.catalog_tracks, db.epks, and db.cms_layouts
    _sync_tracks_to_all_collections(clean, merged_tracks)
    synced_albums = build_creator_albums(clean, merged_tracks)

    return {
        "status": "success",
        "message": f"Successfully ingested {album_type} '{album_title}' with {len(ingested_tracks)} tracks!",
        "release": album_title,
        "releaseType": album_type,
        "count": len(merged_tracks),
        "ingestedCount": len(ingested_tracks),
        "tracks": merged_tracks,
        "albums": synced_albums
    }


@router.put("/tracks/{isrc}", response_model=Dict[str, Any])
def update_catalog_track(isrc: str, payload: Dict[str, Any], subdomain: str = Query("ndufo")):
    """Update track metadata, writers, producers, and revenue split allocations."""
    clean = subdomain.lower().strip().replace(" ", "")
    existing_res = get_catalog_tracks(subdomain=clean)
    existing_tracks = existing_res.get("tracks", [])

    found = False
    updated_tracks = []
    updated_track_obj = None

    for t in existing_tracks:
        if t.get("isrc") == isrc:
            found = True
            merged = {**t, **payload}
            merged["isrc"] = isrc  # maintain identity
            updated_tracks.append(merged)
            updated_track_obj = merged
        else:
            updated_tracks.append(t)

    if not found:
        raise HTTPException(status_code=404, detail=f"Track with ISRC '{isrc}' not found in catalogue.")

    _sync_tracks_to_all_collections(clean, updated_tracks)
    return {
        "status": "success",
        "message": f"Track '{updated_track_obj.get('title')}' updated successfully.",
        "track": updated_track_obj,
        "tracks": updated_tracks
    }


@router.delete("/tracks/{isrc}", response_model=Dict[str, Any])
def delete_catalog_track(isrc: str, subdomain: str = Query("ndufo")):
    """Permanently delete a track from the catalogue across all collections."""
    clean = subdomain.lower().strip().replace(" ", "")
    existing_res = get_catalog_tracks(subdomain=clean)
    existing_tracks = existing_res.get("tracks", [])

    initial_len = len(existing_tracks)
    filtered = [t for t in existing_tracks if t.get("isrc") != isrc]

    if len(filtered) == initial_len:
        raise HTTPException(status_code=404, detail=f"Track with ISRC '{isrc}' not found.")

    _sync_tracks_to_all_collections(clean, filtered)
    logger.info(f"Deleted track {isrc} for {clean}. Remaining: {len(filtered)}")
    return {
        "status": "success",
        "message": f"Track with ISRC '{isrc}' permanently deleted.",
        "subdomain": clean,
        "remainingCount": len(filtered),
        "tracks": filtered
    }


class UpdateAlbumArtworkPayload(BaseModel):
    subdomain: Optional[str] = "ndufo"
    albumTitle: Optional[str] = None
    release_title: Optional[str] = None
    album_title: Optional[str] = None
    artworkUrl: Optional[str] = None
    artwork_url: Optional[str] = None
    bg_gradient: Optional[str] = None
    bgGradient: Optional[str] = None
    cover_text: Optional[str] = None
    coverText: Optional[str] = None


class UpdateTrackAudioPayload(BaseModel):
    subdomain: Optional[str] = "ndufo"
    audioUrl: str


@router.post("/albums/artwork", response_model=Dict[str, Any])
def update_album_artwork(payload: UpdateAlbumArtworkPayload):
    """Updates the cover artwork of an existing ingested album across db.releases, catalog tracks, EPK, and CMS."""
    subdomain = (payload.subdomain or "ndufo").lower().strip().replace(" ", "")
    album_title = (payload.albumTitle or payload.release_title or payload.album_title or "").strip()
    artwork_url = (payload.artworkUrl or payload.artwork_url or "").strip()
    bg_gradient = (payload.bg_gradient or payload.bgGradient or "").strip()
    cover_text = (payload.cover_text or payload.coverText or "").strip()

    if not album_title:
        raise HTTPException(status_code=400, detail="albumTitle or release_title is required")

    # 1. Update in db.releases
    update_doc = {"updated_at": datetime.now(timezone.utc)}
    if artwork_url:
        update_doc["coverArt"] = artwork_url
    if bg_gradient:
        update_doc["coverBg"] = bg_gradient
    if cover_text:
        update_doc["coverText"] = cover_text

    try:
        db.releases.update_many(
            {"subdomain": subdomain, "title": {"$regex": f"^{re.escape(album_title)}$", "$options": "i"}},
            {"$set": update_doc}
        )
    except Exception as e:
        logger.warning(f"Error updating db.releases artwork: {e}")

    # 2. Update matching tracks in db.catalog_tracks
    existing_res = get_catalog_tracks(subdomain=subdomain)
    existing_tracks = existing_res.get("tracks", [])

    matched_tracks = 0
    updated_tracks = []
    for t in existing_tracks:
        rel_name = (t.get("release") or "").strip().lower()
        if rel_name == album_title.lower():
            if artwork_url:
                t["coverArt"] = artwork_url
                t["album_art_url"] = artwork_url
            if bg_gradient:
                t["coverBg"] = bg_gradient
            if cover_text:
                t["coverText"] = cover_text
            matched_tracks += 1
        updated_tracks.append(t)

    _sync_tracks_to_all_collections(subdomain, updated_tracks)

    # 3. Re-fetch creator albums
    updated_albums = build_creator_albums(subdomain, updated_tracks)

    return {
        "status": "success",
        "message": f"Updated artwork for album '{album_title}'. Updated {matched_tracks} track(s).",
        "albumTitle": album_title,
        "artworkUrl": artwork_url,
        "matchedTracks": matched_tracks,
        "albums": updated_albums,
        "tracks": updated_tracks
    }


@router.put("/tracks/{identifier}/audio", response_model=Dict[str, Any])
def update_track_audio(identifier: str, payload: UpdateTrackAudioPayload):
    """Attaches an audio URL / storage link to a catalog track."""
    clean = (payload.subdomain or "ndufo").lower().strip().replace(" ", "")
    existing_res = get_catalog_tracks(subdomain=clean)
    existing_tracks = existing_res.get("tracks", [])

    found = False
    updated_tracks = []
    target_track = None

    for t in existing_tracks:
        if (
            str(t.get("isrc", "")).lower() == identifier.lower() or
            str(t.get("id", "")) == identifier or
            str(t.get("title", "")).lower() == identifier.lower()
        ):
            found = True
            t["audioUrl"] = payload.audioUrl
            t["fileUrl"] = payload.audioUrl
            target_track = t
        updated_tracks.append(t)

    if not found:
        raise HTTPException(status_code=404, detail=f"Track '{identifier}' not found.")

    _sync_tracks_to_all_collections(clean, updated_tracks)
    return {
        "status": "success",
        "message": f"Attached audio to track '{target_track.get('title')}'.",
        "track": target_track,
        "tracks": updated_tracks
    }

