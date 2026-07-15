"""CRM Campaigns Router.

Handles creating, listing, and dispatching targeted campaign outreach
to cohorts matching specific canonical roles.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from auth import get_current_user
from config import db
from models import CrmCampaign

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/crm", tags=["crm"])


class CampaignCreateRequest(BaseModel):
    name: str
    subject: str
    body: str
    target_roles: List[str]


@router.post("/campaigns", response_model=CrmCampaign, response_model_by_alias=False)
def create_campaign(payload: CampaignCreateRequest, current_user: dict = Depends(get_current_user)):
    """Create a new targeted outreach campaign."""
    if not payload.name.strip() or not payload.subject.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign name and subject are required"
        )
    
    campaign = CrmCampaign(
        name=payload.name,
        subject=payload.subject,
        body=payload.body,
        target_roles=payload.target_roles
    )
    
    result = db.crm_campaigns.insert_one(campaign.to_mongo())
    campaign.id = str(result.inserted_id)
    return campaign


@router.get("/campaigns", response_model=List[CrmCampaign], response_model_by_alias=False)
def list_campaigns(current_user: dict = Depends(get_current_user)):
    """Retrieve all outreach campaigns."""
    cursor = db.crm_campaigns.find().sort("created_at", -1)
    campaigns = []
    for doc in cursor:
        campaigns.append(CrmCampaign.from_mongo(doc))
    return campaigns


@router.post("/dispatch/{campaign_id}")
def dispatch_campaign(campaign_id: str, current_user: dict = Depends(get_current_user)):
    """Simulate dispatching SMTP/emails to all users holding targeted roles."""
    try:
        oid = ObjectId(campaign_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid campaign ID format")
        
    campaign_doc = db.crm_campaigns.find_one({"_id": oid})
    if not campaign_doc:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    campaign = CrmCampaign.from_mongo(campaign_doc)
    
    # Query users matching target roles
    # roles field is a list in user document, $in matches if list overlaps
    matched_users = list(db.users.find({"roles": {"$in": campaign.target_roles}}))
    matched_user_ids = [str(u["_id"]) for u in matched_users]
    
    # Mark dispatched
    db.crm_campaigns.update_one(
        {"_id": oid},
        {"$set": {
            "status": "dispatched",
            "dispatched_at": datetime.now(timezone.utc)
        }}
    )
    
    logger.info(f"Dispatched campaign {campaign_id} to {len(matched_user_ids)} users.")
    
    return {
        "status": "success",
        "campaign_id": campaign_id,
        "recipient_count": len(matched_user_ids),
        "recipients": matched_user_ids
    }
