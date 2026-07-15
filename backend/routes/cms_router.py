"""Mother-CMS Layouts and Version Rollback Router.

Manages page layout schema grids, tracking history snapshots
and executing rollbacks to historic version points.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Optional

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
