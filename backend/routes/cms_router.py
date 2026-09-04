"""Mother-CMS Layouts and Version Rollback Router.

Manages page layout schema grids, tracking history snapshots
and executing rollbacks to historic version points.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import CmsLayout, CmsLayoutHistory

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/cms", tags=["cms"])


class LayoutUpdateRequest(BaseModel):
    layout_id: str
    data: dict


@router.get("/layouts/{layout_id}", response_model=CmsLayout)
def get_layout(layout_id: str):
    """Retrieve current active state of a layout."""
    doc = db.cms_layouts.find_one({"layout_id": layout_id})
    if not doc:
        # Return default mock structure to prevent dashboard crashes
        return CmsLayout(
            layout_id=layout_id,
            data={
                "hero_title": "TuneMavens Network",
                "hero_subtitle": "The Premier Music Ecosystem",
                "primary_accent": "var(--cyan)"
            },
            version=1
        )
    return CmsLayout.from_mongo(doc)


@router.post("/layouts", response_model=CmsLayout)
def update_layout(payload: LayoutUpdateRequest, current_user: dict = Depends(get_current_user)):
    """Update layout config and save snapshot version to history ledger."""
    layout_id = payload.layout_id
    data = payload.data
    
    existing = db.cms_layouts.find_one({"layout_id": layout_id})
    
    if existing:
        current_layout = CmsLayout.from_mongo(existing)
        new_version = current_layout.version + 1
        
        db.cms_layouts.update_one(
            {"layout_id": layout_id},
            {"$set": {
                "data": data,
                "version": new_version,
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        current_layout.data = data
        current_layout.version = new_version
        layout_res = current_layout
    else:
        new_version = 1
        layout_res = CmsLayout(
            layout_id=layout_id,
            data=data,
            version=new_version
        )
        db.cms_layouts.insert_one(layout_res.to_mongo())
        
    # Write history snapshot
    history = CmsLayoutHistory(
        layout_id=layout_id,
        data=data,
        version=new_version,
        updated_by=str(current_user.get("_id", "admin"))
    )
    db.cms_layout_history.insert_one(history.to_mongo())
    
    logger.info(f"Updated CMS layout {layout_id} to version {new_version}")
    return layout_res


@router.get("/layouts/{layout_id}/history", response_model=List[CmsLayoutHistory])
def get_layout_history(layout_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve audit history version snapshots of a layout."""
    cursor = db.cms_layout_history.find({"layout_id": layout_id}).sort("version", -1)
    history_list = []
    for doc in cursor:
        history_list.append(CmsLayoutHistory.from_mongo(doc))
    return history_list


@router.post("/layouts/{layout_id}/rollback/{version}", response_model=CmsLayout)
def rollback_layout(layout_id: str, version: int, current_user: dict = Depends(get_current_user)):
    """Revert the layout config state to a specific history version snapshot."""
    # Find snapshot
    snapshot_doc = db.cms_layout_history.find_one({
        "layout_id": layout_id,
        "version": version
    })
    if not snapshot_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version snapshot {version} for layout {layout_id} not found"
        )
        
    snapshot = CmsLayoutHistory.from_mongo(snapshot_doc)
    
    # Get current active layout version
    current_doc = db.cms_layouts.find_one({"layout_id": layout_id})
    if current_doc:
        current_layout = CmsLayout.from_mongo(current_doc)
        next_version = current_layout.version + 1
    else:
        next_version = 1
        
    # Update active layout with rollback contents
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "data": snapshot.data,
            "version": next_version,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )
    
    # Write a new history log entry representing the rollback action
    new_history = CmsLayoutHistory(
        layout_id=layout_id,
        data=snapshot.data,
        version=next_version,
        updated_by=f"rollback-v{version} by {current_user.get('_id', 'admin')}"
    )
    db.cms_layout_history.insert_one(new_history.to_mongo())
    
    result_layout = CmsLayout(
        layout_id=layout_id,
        data=snapshot.data,
        version=next_version
    )
    
    logger.info(f"Rolled back CMS layout {layout_id} to snapshot version {version} (New version: {next_version})")
    return result_layout


# ── Mother-CMS EPK Management Subsystem ──────────────────────────────────────

class EpkBioGenerateRequest(BaseModel):
    artist_name: str
    focus: Optional[str] = "sync"
    custom_prompt: Optional[str] = None
    genre: Optional[str] = "Afro-Electronic"


@router.post("/epk/bio/generate")
def generate_epk_bio(payload: EpkBioGenerateRequest):
    """Backend AI Rich-Media Narrative Generator for EPKs."""
    artist = payload.artist_name.strip() or "The Creator"
    focus = (payload.focus or "sync").lower()
    prompt = (payload.custom_prompt or "").strip()

    if "tour" in focus or "live" in prompt.lower():
        sub_focus = "World Tour Dates & VIP Concert Experiences"
        metrics = "Over 28,000+ tickets sold across global arenas and festival mainstages"
        quote = f"A high-octane stage presence that electrifies crowds worldwide."
    elif "stem" in focus or "lossless" in prompt.lower():
        sub_focus = "24-Bit / 96kHz Lossless Stems & Multitrack Ownership"
        metrics = "Direct-to-producer multitrack stems streaming in studio fidelity on TuneStream"
        quote = f"Uncompromising audio fidelity engineered for purist mastering rigs."
    elif "dj" in focus or "club" in prompt.lower():
        sub_focus = "Global DJ Pool Drops & Peak-Hour VIP Edits"
        metrics = "Certified floor-filling dubplates downloaded by verified club and festival selectors"
        quote = f"Peak-hour festival energy with relentless bass architecture."
    else:
        sub_focus = "One-Stop Sync Clearance & Broadcast Catalog"
        metrics = "14 Pre-Cleared Sync Placements across streaming television, gaming, and feature films"
        quote = f"A singular sonic architect redefining modern sync placement and master rights ownership."

    custom_text = f"<p><em>Note from Management:</em> {prompt}</p>" if prompt else ""

    html_bio = f"""<h2>About {artist}</h2>
<p>{artist} is an acclaimed recording artist, music producer, and composer pioneering sound design across the global music business ecosystem. Known for genre-blurring productions, {artist} merges hypnotic sonic textures with cutting-edge studio production.</p>
<blockquote>"{quote}" — <em>Billboard & SyncMavens Review</em></blockquote>
<h3>{sub_focus}</h3>
<p>Holding 100% master rights ownership with lossless multitrack stems distributed through <strong>TuneStream</strong>. All commercial recordings and cues are pre-cleared for one-stop television, gaming, and film sync licensing with automated split distribution managed via Intermaven.</p>
{custom_text}
<ul>
  <li>Over 8.4M+ Global Catalog Streams</li>
  <li>{metrics}</li>
  <li>Direct VIP Fan Vault & 180g Limited Vinyl Pressings</li>
</ul>"""

    return {
        "status": "success",
        "artist_name": artist,
        "focus": focus,
        "html_bio": html_bio
    }


@router.get("/epk/{subdomain}")
def get_epk_cms(subdomain: str):
    """Retrieve complete Mother-CMS layout and state for an EPK."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"

    doc = db.cms_layouts.find_one({"layout_id": layout_id})
    if not doc:
        # Fallback to db.epks
        epk_doc = db.epks.find_one({"subdomain": clean_subdomain})
        if epk_doc:
            epk_data = {k: v for k, v in epk_doc.items() if k != "_id"}
            return {
                "layout_id": layout_id,
                "subdomain": clean_subdomain,
                "version": epk_doc.get("version", 1),
                "status": "published",
                "data": epk_data,
                "updated_at": epk_doc.get("updated_at", datetime.now(timezone.utc))
            }
        # Return fallback default structure
        return {
            "layout_id": layout_id,
            "subdomain": clean_subdomain,
            "version": 1,
            "status": "draft",
            "data": {
                "artist_name": clean_subdomain.capitalize(),
                "headline": "Official Intermaven Creator Web World",
                "subdomain": clean_subdomain,
                "themeBg": "linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)",
                "accentColor": "#00f0ff",
                "secondaryColor": "#ff007f",
                "layoutWidth": "wide",
                "layoutVariant": "logo-left",
                "heroAnimStyle": "synergy",
                "heroTitle1": f"{clean_subdomain.capitalize()} — Broadcast Sync & Master Catalog",
                "heroTitle2": "100% Pre-Cleared One-Stop Sync Licensing on SyncMavens",
                "heroTitle3": "Instrumental Cues, 24-Bit WAV Stems & Automated PRO Splits",
                "bio": f"<h2>About {clean_subdomain.capitalize()}</h2><p>Welcome to the official Electronic Press Kit for {clean_subdomain.capitalize()}.</p>"
            }
        }

    return {
        "layout_id": layout_id,
        "subdomain": clean_subdomain,
        "version": doc.get("version", 1),
        "status": "published",
        "data": doc.get("data", {}),
        "updated_at": doc.get("updated_at")
    }


@router.post("/epk/{subdomain}")
def save_epk_cms(subdomain: str, payload: Dict[str, Any]):
    """Save full EPK layout from Mother-CMS Studio, updating layout history snapshot."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"
    data = payload.get("data", payload)

    data["subdomain"] = clean_subdomain
    data["updated_at"] = datetime.now(timezone.utc)

    # Get current version
    existing = db.cms_layouts.find_one({"layout_id": layout_id})
    if existing:
        new_version = existing.get("version", 1) + 1
    else:
        new_version = 1

    # 1. Update Mother-CMS Layout
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "layout_id": layout_id,
            "data": data,
            "version": new_version,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    # 2. Write Mother-CMS History Snapshot
    history = CmsLayoutHistory(
        layout_id=layout_id,
        data=data,
        version=new_version,
        updated_by=f"mother-cms-{clean_subdomain}"
    )
    db.cms_layout_history.insert_one(history.to_mongo())

    # 3. Synchronize to public EPKs collection
    data["version"] = new_version
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": data},
        upsert=True
    )

    logger.info(f"Mother-CMS updated EPK layout {layout_id} to v{new_version}")
    return {
        "status": "success",
        "layout_id": layout_id,
        "subdomain": clean_subdomain,
        "version": new_version,
        "data": data,
        "message": f"Successfully published Mother-CMS snapshot v{new_version}"
    }


@router.patch("/epk/{subdomain}/sections/{section_id}")
def update_epk_cms_section(subdomain: str, section_id: str, payload: Dict[str, Any]):
    """Update a specific section within the EPK CMS layout."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"

    existing = db.cms_layouts.find_one({"layout_id": layout_id})
    current_data = existing.get("data", {}) if existing else {}
    version = existing.get("version", 1) if existing else 1
    new_version = version + 1

    # Merge section updates
    section_data = payload.get("data", payload)
    current_data[section_id] = section_data
    current_data["updated_at"] = datetime.now(timezone.utc)

    # Update CMS Layout & History
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "data": current_data,
            "version": new_version,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    history = CmsLayoutHistory(
        layout_id=layout_id,
        data=current_data,
        version=new_version,
        updated_by=f"section-patch:{section_id}"
    )
    db.cms_layout_history.insert_one(history.to_mongo())

    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": current_data},
        upsert=True
    )

    return {
        "status": "success",
        "section_id": section_id,
        "version": new_version,
        "data": current_data
    }


@router.get("/epk/{subdomain}/history")
def get_epk_cms_history(subdomain: str):
    """Retrieve audit history snapshots for this EPK from Mother-CMS."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"

    cursor = db.cms_layout_history.find({"layout_id": layout_id}).sort("version", -1).limit(20)
    history_list = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history_list.append(doc)
    return history_list


@router.post("/epk/{subdomain}/rollback/{version}")
def rollback_epk_cms(subdomain: str, version: int):
    """Roll back EPK layout to a previous Mother-CMS version snapshot."""
    clean_subdomain = subdomain.lower().strip().replace(" ", "")
    layout_id = f"epk_{clean_subdomain}"

    snapshot_doc = db.cms_layout_history.find_one({
        "layout_id": layout_id,
        "version": version
    })
    if not snapshot_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Version snapshot {version} for EPK {clean_subdomain} not found"
        )

    snapshot_data = snapshot_doc.get("data", {})

    # Calculate next version
    current_doc = db.cms_layouts.find_one({"layout_id": layout_id})
    next_version = (current_doc.get("version", 1) + 1) if current_doc else 1

    # Update active layout
    db.cms_layouts.update_one(
        {"layout_id": layout_id},
        {"$set": {
            "data": snapshot_data,
            "version": next_version,
            "updated_at": datetime.now(timezone.utc)
        }},
        upsert=True
    )

    # Log rollback audit history
    new_history = CmsLayoutHistory(
        layout_id=layout_id,
        data=snapshot_data,
        version=next_version,
        updated_by=f"rollback-to-v{version}"
    )
    db.cms_layout_history.insert_one(new_history.to_mongo())

    # Sync to epks
    db.epks.update_one(
        {"subdomain": clean_subdomain},
        {"$set": snapshot_data},
        upsert=True
    )

    logger.info(f"Rolled back EPK {clean_subdomain} to snapshot v{version} (New v{next_version})")
    return {
        "status": "success",
        "subdomain": clean_subdomain,
        "restored_version": version,
        "new_version": next_version,
        "data": snapshot_data,
        "message": f"Successfully rolled back to snapshot v{version}"
    }


@router.get("/epk/themes")
def list_epk_themes():
    """Return official Mother-CMS theme templates and palettes for EPKs."""
    return [
        {"id": "cyberpunk", "name": "Cyberpunk Neon Grid", "bg": "linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)", "accent": "#00f0ff", "secondary": "#ff007f"},
        {"id": "afrobeat", "name": "Afrobeat Gold & Bronze", "bg": "linear-gradient(135deg, #1f1406 0%, #2e1d09 100%)", "accent": "#ffb703", "secondary": "#fb8500"},
        {"id": "indie_mono", "name": "Indie Minimalist Mono", "bg": "#121212", "accent": "#ffffff", "secondary": "#a0a0a0"},
        {"id": "dark_synth", "name": "Dark Synthwave Reel", "bg": "linear-gradient(135deg, #080811 0%, #141428 100%)", "accent": "#bd00ff", "secondary": "#00e5ff"},
        {"id": "pop_vibrant", "name": "Pop Vibrant Gradient", "bg": "linear-gradient(135deg, #18002e 0%, #3a0057 100%)", "accent": "#ff00aa", "secondary": "#00fff0"},
        {"id": "acoustic_wood", "name": "Acoustic Studio Wood", "bg": "linear-gradient(135deg, #1a1410 0%, #291c14 100%)", "accent": "#d4a373", "secondary": "#faedcd"}
    ]

