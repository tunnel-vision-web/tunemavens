"""CRM Campaigns & User Inbox Router.

Handles creating, listing, and dispatching targeted campaign outreach
to cohorts matching specific canonical roles and managing user inbox notifications.
"""
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
    """Simulate dispatching emails and internal inbox messages to all targeted users."""
    try:
        oid = ObjectId(campaign_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid campaign ID format")
        
    campaign_doc = db.crm_campaigns.find_one({"_id": oid})
    if not campaign_doc:
        raise HTTPException(status_code=404, detail="Campaign not found")
        
    campaign = CrmCampaign.from_mongo(campaign_doc)
    
    matched_users = list(db.users.find({"roles": {"$in": campaign.target_roles}}))
    matched_user_ids = [str(u["_id"]) for u in matched_users]
    
    # Generate internal inbox messages for all matched recipients
    inbox_docs = []
    dispatch_time = datetime.now(timezone.utc)
    for u_id in matched_user_ids:
        inbox_docs.append({
            "user_id": u_id,
            "campaign_id": campaign_id,
            "sender": "Intermaven Growth Console",
            "subject": campaign.subject,
            "body": campaign.body,
            "read": False,
            "created_at": dispatch_time,
        })
        
    if inbox_docs:
        db.user_inbox.insert_many(inbox_docs)
    
    db.crm_campaigns.update_one(
        {"_id": oid},
        {"$set": {
            "status": "dispatched",
            "dispatched_at": dispatch_time,
            "recipient_count": len(matched_user_ids),
        }}
    )
    
    logger.info(f"Dispatched campaign {campaign_id} to {len(matched_user_ids)} users via Resend & Inbox.")
    
    return {
        "status": "success",
        "campaign_id": campaign_id,
        "recipient_count": len(matched_user_ids),
        "recipients": matched_user_ids
    }


@router.get("/inbox")
def list_user_inbox(current_user: dict = Depends(get_current_user)):
    """Retrieves personal inbox campaign messages for the authenticated user."""
    cursor = db.user_inbox.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    messages = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        messages.append(doc)
    return messages


@router.post("/inbox/{message_id}/read")
def mark_inbox_message_read(message_id: str, current_user: dict = Depends(get_current_user)):
    """Marks a user inbox message as read."""
    try:
        oid = ObjectId(message_id)
    except Exception:
        oid = message_id

    res = db.user_inbox.update_one(
        {"$or": [{"_id": oid}, {"_id": message_id}], "user_id": str(current_user["_id"])},
        {"$set": {"read": True}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inbox message not found")

    return {"status": "success", "message_id": message_id, "read": True}


class CrmLeadCreateRequest(BaseModel):
    name: str
    email: str
    inquiry_type: Optional[str] = "booking"
    message: str
    creator_username: Optional[str] = None
    creator_name: Optional[str] = None
    phone: Optional[str] = None
    budget: Optional[str] = None
    event_date: Optional[str] = None


@router.post("/leads")
def submit_lead(payload: CrmLeadCreateRequest):
    """Submit a creator EPK inquiry as a lead directly to Intermaven Smart CRM."""
    if not payload.name.strip() or not payload.email.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name and email are required"
        )
    
    lead_doc = {
        "name": payload.name.strip(),
        "email": payload.email.strip().lower(),
        "inquiry_type": payload.inquiry_type or "booking",
        "message": payload.message.strip(),
        "creator_username": payload.creator_username,
        "creator_name": payload.creator_name,
        "phone": payload.phone,
        "budget": payload.budget,
        "event_date": payload.event_date,
        "status": "new",
        "source": "creator_epk_contact",
        "created_at": datetime.now(timezone.utc)
    }
    
    result = db.crm_leads.insert_one(lead_doc)
    lead_id = str(result.inserted_id)
    
    # Optionally notify creator's personal inbox if registered
    try:
        if payload.creator_username:
            user = db.users.find_one({"username": payload.creator_username})
            if user:
                inbox_msg = {
                    "user_id": str(user["_id"]),
                    "campaign_id": "direct_lead",
                    "campaign_name": "Inbound Creator Web World Lead",
                    "subject": f"New Inbound Lead from {payload.name} ({payload.inquiry_type})",
                    "body": f"Contact: {payload.name} ({payload.email})\nInquiry: {payload.message}\nDate: {payload.event_date or 'N/A'}\nBudget: {payload.budget or 'N/A'}",
                    "read": False,
                    "created_at": datetime.now(timezone.utc),
                    "lead_id": lead_id
                }
                db.user_inbox.insert_one(inbox_msg)
    except Exception as e:
        logger.warning(f"Failed to create inbox notification for lead: {e}")

    return {
        "status": "success",
        "message": "Lead received and registered in Intermaven Smart CRM",
        "lead_id": lead_id
    }


@router.get("/leads")
def list_leads(creator_username: Optional[str] = None):
    """Retrieve inbound leads registered in Smart CRM."""
    query = {}
    if creator_username:
        query["creator_username"] = creator_username
    cursor = db.crm_leads.find(query).sort("created_at", -1).limit(100)
    leads = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        leads.append(doc)
    return leads


