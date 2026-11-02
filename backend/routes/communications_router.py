"""TuneMavens Ecosystem Communications Vault & Audit Router.

Provides administrative and persona-wide communications audit logging,
message inspection, deliverability analytics, one-click re-sending via Resend,
archiving/unarchiving, and compliance CSV exports.
"""
from __future__ import annotations

import csv
import io
import logging
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from auth import get_optional_user
from config import db

logger = logging.getLogger("tunemavens.communications")

router = APIRouter(prefix="/api/communications", tags=["communications"])


def _serialize_comm(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Serializes Mongo communication document for JSON transport."""
    out = dict(doc)
    if "_id" in out:
        out["mongo_id"] = str(out.pop("_id"))
    for k in ["created_at", "updated_at", "archived_at"]:
        if isinstance(out.get(k), datetime):
            out[k] = out[k].isoformat()
    return out


@router.get("/logs")
def list_communication_logs(
    q: Optional[str] = Query(None, description="Search recipient, subject, or text"),
    role: Optional[str] = Query(None, description="Persona role filter"),
    event_type: Optional[str] = Query(None, description="Event type filter"),
    status: Optional[str] = Query(None, description="Status filter: sent, failed, not_configured"),
    archived: Optional[str] = Query("false", description="Filter archived: 'false', 'true', or 'all'"),
    channel: Optional[str] = Query(None, description="Channel filter: email, etc."),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    user=Depends(get_optional_user)
):
    """Retrieve filtered, paginated communication audit logs."""
    query: Dict[str, Any] = {}

    # Archived filter
    if archived.lower() == "false":
        query["archived"] = {"$ne": True}
    elif archived.lower() == "true":
        query["archived"] = True
    # If "all", we don't constrain the archived field

    # Free text search
    if q and q.strip():
        search_regex = re.compile(re.escape(q.strip()), re.IGNORECASE)
        query["$or"] = [
            {"subject": {"$regex": search_regex}},
            {"to": {"$regex": search_regex}},
            {"recipient_name": {"$regex": search_regex}},
            {"text": {"$regex": search_regex}},
            {"id": {"$regex": search_regex}},
        ]

    # Persona role filter
    if role and role.strip() and role.lower() != "all":
        query["role"] = role.strip().lower()

    # Event type filter
    if event_type and event_type.strip() and event_type.lower() != "all":
        query["event_type"] = event_type.strip().lower()

    # Status filter
    if status and status.strip() and status.lower() != "all":
        query["status"] = status.strip().lower()

    # Channel filter
    if channel and channel.strip() and channel.lower() != "all":
        query["channel"] = channel.strip().lower()

    total_count = db.communications.count_documents(query)
    skip = (page - 1) * limit

    cursor = db.communications.find(query).sort("created_at", -1).skip(skip).limit(limit)
    logs = [_serialize_comm(doc) for doc in cursor]

    # Fallback to sync from email_outbox if db.communications is initially empty
    if total_count == 0 and not query:
        outbox_count = db.email_outbox.count_documents({})
        if outbox_count > 0:
            for item in db.email_outbox.find({}):
                doc_id = item.get("comm_id") or f"comm_{str(item['_id'])}"
                if not db.communications.find_one({"id": doc_id}):
                    db.communications.insert_one({
                        "id": doc_id,
                        "to": item.get("to", ""),
                        "recipient_name": "",
                        "subject": item.get("subject", ""),
                        "html": item.get("html", ""),
                        "text": item.get("text", item.get("subject", "")),
                        "channel": "email",
                        "provider": "resend",
                        "event_type": item.get("event_type", "welcome_onboarding"),
                        "role": item.get("role", "general"),
                        "status": item.get("status", "sent"),
                        "from_addr": item.get("from_addr", ""),
                        "provider_status": item.get("provider_status"),
                        "resend_id": item.get("resend_response", ""),
                        "archived": False,
                        "archived_at": None,
                        "created_at": item.get("created_at", datetime.now(timezone.utc)),
                        "updated_at": item.get("created_at", datetime.now(timezone.utc)),
                    })
            total_count = db.communications.count_documents(query)
            cursor = db.communications.find(query).sort("created_at", -1).skip(skip).limit(limit)
            logs = [_serialize_comm(doc) for doc in cursor]

    total_pages = max(1, (total_count + limit - 1) // limit)

    return {
        "status": "success",
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "logs": logs
    }


@router.get("/stats")
def get_communication_stats(user=Depends(get_optional_user)):
    """Summary metrics of deliverability, activity, and persona distributions."""
    total = db.communications.count_documents({})
    sent_count = db.communications.count_documents({"status": "sent"})
    staged_count = db.communications.count_documents({"status": "not_configured"})
    failed_count = db.communications.count_documents({"status": "failed"})
    archived_count = db.communications.count_documents({"archived": True})
    active_count = db.communications.count_documents({"archived": {"$ne": True}})

    # Calculate deliverability rate (excluding not_configured development mode)
    evaluated_total = sent_count + failed_count
    deliverability_rate = round((sent_count / evaluated_total * 100), 1) if evaluated_total > 0 else 100.0

    # Aggregate by persona role
    role_pipeline = [
        {"$group": {"_id": "$role", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_persona = {doc["_id"] or "unspecified": doc["count"] for doc in db.communications.aggregate(role_pipeline)}

    # Aggregate by event type
    type_pipeline = [
        {"$group": {"_id": "$event_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_event_type = {doc["_id"] or "general": doc["count"] for doc in db.communications.aggregate(type_pipeline)}

    return {
        "status": "success",
        "total_count": total,
        "sent_count": sent_count,
        "staged_count": staged_count,
        "failed_count": failed_count,
        "archived_count": archived_count,
        "active_count": active_count,
        "deliverability_rate": deliverability_rate,
        "by_persona": by_persona,
        "by_event_type": by_event_type
    }


@router.get("/detail/{msg_id}")
def get_communication_detail(msg_id: str, user=Depends(get_optional_user)):
    """Fetch full message content, rendered HTML, headers, and metadata for inspection."""
    doc = db.communications.find_one({"id": msg_id})
    if not doc:
        # Try finding by Mongo ObjectId string
        try:
            doc = db.communications.find_one({"_id": ObjectId(msg_id)})
        except Exception:
            pass
    if not doc:
        raise HTTPException(status_code=404, detail="Communication record not found.")

    return {
        "status": "success",
        "record": _serialize_comm(doc)
    }


@router.post("/archive/{msg_id}")
def archive_communication(msg_id: str, user=Depends(get_optional_user)):
    """Mark a communication record as archived."""
    now = datetime.now(timezone.utc)
    res = db.communications.update_one(
        {"id": msg_id},
        {"$set": {"archived": True, "archived_at": now, "updated_at": now}}
    )
    if res.matched_count == 0:
        try:
            res = db.communications.update_one(
                {"_id": ObjectId(msg_id)},
                {"$set": {"archived": True, "archived_at": now, "updated_at": now}}
            )
        except Exception:
            pass
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found to archive.")

    return {"status": "success", "message": "Communication archived successfully.", "msg_id": msg_id}


@router.post("/unarchive/{msg_id}")
def unarchive_communication(msg_id: str, user=Depends(get_optional_user)):
    """Restore an archived communication record back to active status."""
    now = datetime.now(timezone.utc)
    res = db.communications.update_one(
        {"id": msg_id},
        {"$set": {"archived": False, "archived_at": None, "updated_at": now}}
    )
    if res.matched_count == 0:
        try:
            res = db.communications.update_one(
                {"_id": ObjectId(msg_id)},
                {"$set": {"archived": False, "archived_at": None, "updated_at": now}}
            )
        except Exception:
            pass
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found to unarchive.")

    return {"status": "success", "message": "Communication restored to active vault.", "msg_id": msg_id}


@router.post("/resend/{msg_id}")
def resend_communication(msg_id: str, user=Depends(get_optional_user)):
    """Trigger an immediate re-send attempt of a previous communication through Resend."""
    doc = db.communications.find_one({"id": msg_id})
    if not doc:
        try:
            doc = db.communications.find_one({"_id": ObjectId(msg_id)})
        except Exception:
            pass
    if not doc:
        raise HTTPException(status_code=404, detail="Communication record not found.")

    from account_setup import send_email
    status = send_email(
        to=doc["to"],
        subject=doc["subject"],
        html=doc.get("html", ""),
        text=doc.get("text", ""),
        event_type=doc.get("event_type", "general"),
        role=doc.get("role", "general"),
        recipient_name=doc.get("recipient_name", ""),
        metadata={**doc.get("metadata", {}), "resent_from_id": msg_id}
    )

    return {
        "status": "success",
        "resend_result": status,
        "message": f"Message re-dispatched to {doc['to']}. Delivery status: {status}"
    }


@router.get("/export")
def export_communications_csv(user=Depends(get_optional_user)):
    """Generate and stream a full CSV audit export of all communications."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Communication ID",
        "Timestamp (UTC)",
        "Recipient Email",
        "Recipient Name",
        "Persona Role",
        "Event Type",
        "Channel",
        "Status",
        "Provider Status",
        "Subject",
        "Archived"
    ])

    for doc in db.communications.find({}).sort("created_at", -1):
        created_str = doc.get("created_at").isoformat() if isinstance(doc.get("created_at"), datetime) else str(doc.get("created_at", ""))
        writer.writerow([
            doc.get("id", ""),
            created_str,
            doc.get("to", ""),
            doc.get("recipient_name", ""),
            doc.get("role", ""),
            doc.get("event_type", ""),
            doc.get("channel", "email"),
            doc.get("status", ""),
            doc.get("provider_status", ""),
            doc.get("subject", ""),
            "Yes" if doc.get("archived") else "No"
        ])

    output.seek(0)
    filename = f"tunemavens-communications-audit-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
