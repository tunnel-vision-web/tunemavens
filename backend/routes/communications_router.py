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
import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response
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

    # Aggregate by channel
    channel_pipeline = [
        {"$group": {"_id": "$channel", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    by_channel = {doc["_id"] or "email": doc["count"] for doc in db.communications.aggregate(channel_pipeline)}

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
        "by_event_type": by_event_type,
        "by_channel": by_channel,
    }


@router.get("/whatsapp-status")
def get_whatsapp_status(user=Depends(get_optional_user)):
    """Fetch user's WhatsApp eligibility, opt-in status, and 24h conversation window metrics."""
    from services.whatsapp_service import (
        check_whatsapp_eligibility,
        get_whatsapp_opt_in_url,
        WHATSAPP_DISPLAY_PHONE_NUMBER,
        MIN_RELOAD_KES,
        MIN_RELOAD_USD,
    )

    user_doc = None
    if user and user.get("_id"):
        user_doc = db.users.find_one({"_id": user["_id"]})

    eligibility = check_whatsapp_eligibility(user_doc)

    opted_in = bool(user_doc.get("whatsapp_opted_in")) if user_doc else False
    last_inbound = user_doc.get("last_whatsapp_inbound_at") if user_doc else None
    in_24h_window = False
    window_expires_in_hours = 0.0

    if last_inbound:
        try:
            inbound_dt = last_inbound if last_inbound.tzinfo else last_inbound.replace(tzinfo=timezone.utc)
            diff_secs = (datetime.now(timezone.utc) - inbound_dt).total_seconds()
            if diff_secs < 86400:
                in_24h_window = True
                window_expires_in_hours = max(0.0, round((86400 - diff_secs) / 3600.0, 1))
        except Exception:
            pass

    user_ref = (user_doc.get("username") or user_doc.get("subdomain") or "creator") if user_doc else "creator"
    initiate_url = get_whatsapp_opt_in_url(user_ref)

    return {
        "status": "success",
        "is_eligible": eligibility.get("eligible", False),
        "eligibility": eligibility,
        "tier": eligibility.get("tier"),
        "role": eligibility.get("role", "general"),
        "opted_in": opted_in,
        "in_24h_window": in_24h_window,
        "window_expires_in_hours": window_expires_in_hours,
        "last_inbound_at": last_inbound.isoformat() if last_inbound else None,
        "initiate_url": initiate_url,
        "business_phone": WHATSAPP_DISPLAY_PHONE_NUMBER,
        "monthly_quota_limit": 1000,
        "min_reload_kes": MIN_RELOAD_KES,
        "min_reload_usd": MIN_RELOAD_USD,
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
    """Trigger an immediate re-send attempt of a previous communication through Resend or WhatsApp."""
    doc = db.communications.find_one({"id": msg_id})
    if not doc:
        try:
            doc = db.communications.find_one({"_id": ObjectId(msg_id)})
        except Exception:
            pass
    if not doc:
        raise HTTPException(status_code=404, detail="Communication record not found.")

    channel = (doc.get("channel") or "email").lower()
    if channel == "whatsapp":
        from services.whatsapp_service import send_whatsapp
        res = send_whatsapp(
            to=doc["to"],
            message=doc.get("text") or doc.get("subject", ""),
            recipient_name=doc.get("recipient_name", ""),
            role=doc.get("role", "general"),
            event_type=doc.get("event_type", "notification"),
            metadata={**doc.get("metadata", {}), "resent_from_id": msg_id}
        )
        return {
            "status": "success",
            "channel": "whatsapp",
            "resend_result": res.get("status", "sent"),
            "direct_url": res.get("direct_url", ""),
            "message": f"WhatsApp communication re-dispatched to {doc['to']}."
        }

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
        "channel": "email",
        "resend_result": status,
        "message": f"Message re-dispatched to {doc['to']}. Delivery status: {status}"
    }


class TestEmailRequest(BaseModel):
    to: str
    subject: Optional[str] = "TuneMavens Email Protocol Diagnostic"
    message: Optional[str] = "This is a diagnostic message verifying outbound email deliverability via Resend."
    role: Optional[str] = "general"
    recipient_name: Optional[str] = ""


class TestWhatsappRequest(BaseModel):
    to: str
    message: Optional[str] = "TuneMavens Omnichannel Protocol Alert: WhatsApp communication channel verified successfully."
    role: Optional[str] = "general"
    recipient_name: Optional[str] = ""


class SendCommunicationRequest(BaseModel):
    to: str
    channel: str = "email"
    subject: Optional[str] = ""
    message: str
    role: Optional[str] = "general"
    event_type: Optional[str] = "general"
    recipient_name: Optional[str] = ""


@router.post("/test-email")
def test_email_dispatch(payload: TestEmailRequest, user=Depends(get_optional_user)):
    """Dispatch a direct test email to verify DNS and Resend delivery protocol."""
    from account_setup import send_email, _email_wrapper, _button, PUBLIC_APP_URL
    inner_html = f"""
<div style="background:#131c2d;border:1px solid #1e293b;border-radius:3px;padding:20px;margin:20px 0;">
  <div style="font-size:16px;font-weight:700;color:#22d3ee;margin-bottom:8px;">Protocol Verification: ACTIVE</div>
  <p style="margin:0 0 12px 0;color:#cbd5e1;font-size:14px;">
    {payload.message}
  </p>
  <div style="font-size:12px;color:#64748b;font-family:monospace;">
    Timestamp: {datetime.now(timezone.utc).isoformat()} UTC<br/>
    Sender Identity: TuneMavens &lt;hello@contact.tunemavens.com&gt;<br/>
    DNS Status: Verified (DKIM & SPF Authentication Active)
  </div>
</div>
<div style="margin:20px 0;">
  {_button(f"{PUBLIC_APP_URL}/#/dashboard", "Open TuneMavens Console")}
</div>
"""
    html = _email_wrapper(inner_html, payload.subject, payload.role)
    status_val = send_email(
        to=payload.to,
        subject=payload.subject,
        html=html,
        text=payload.message,
        event_type="protocol_diagnostic_test",
        role=payload.role,
        recipient_name=payload.recipient_name,
        metadata={"diagnostic": True, "initiated_by": "admin_test"}
    )

    return {
        "status": "success" if status_val == "sent" else "failed",
        "delivery_status": status_val,
        "recipient": payload.to,
        "recipient_name": payload.recipient_name,
        "subject": payload.subject,
        "message": payload.message,
        "provider": "resend",
        "provider_status": 200 if status_val == "sent" else 400,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "notice": f"Test email dispatched to {payload.to} with status '{status_val}'."
    }


@router.post("/test-whatsapp")
def test_whatsapp_dispatch(payload: TestWhatsappRequest, user=Depends(get_optional_user)):
    """Dispatch a direct test message to verify WhatsApp communication protocol."""
    from services.whatsapp_service import send_whatsapp
    res = send_whatsapp(
        to=payload.to,
        message=payload.message,
        recipient_name=payload.recipient_name,
        role=payload.role,
        event_type="protocol_diagnostic_test",
        metadata={"diagnostic": True, "initiated_by": "admin_test"}
    )

    delivery_status = res.get("status", "sent")
    return {
        "status": "success" if delivery_status == "sent" else "failed",
        "delivery_status": delivery_status,
        "comm_id": res.get("comm_id"),
        "direct_url": res.get("direct_url"),
        "recipient": payload.to,
        "recipient_name": payload.recipient_name,
        "provider": res.get("provider", "meta_whatsapp_cloud"),
        "provider_status": res.get("provider_status", 200),
        "provider_msg_id": res.get("provider_msg_id", ""),
        "message_status": res.get("message_status", "accepted"),
        "error_details": res.get("error_details"),
        "message": payload.message,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "notice": f"WhatsApp protocol test registered for {payload.to}."
    }


@router.post("/send")
def send_communication(payload: SendCommunicationRequest, user=Depends(get_optional_user)):
    """Universal dispatcher for outbound communications across email and WhatsApp.
    
    Enforces quota & balance policy:
    - Music supervisors, record labels, corporates, and publishers have complimentary access.
    - Creators and consumers require at least KES 500 ($5.00) wallet reload.
    - If ineligible, gracefully downgrades to transactional email (Resend).
    """
    channel = (payload.channel or "email").lower()
    user_doc = None
    if user and user.get("_id"):
        user_doc = db.users.find_one({"_id": user["_id"]})

    if channel == "whatsapp":
        from services.whatsapp_service import send_whatsapp, check_whatsapp_eligibility

        if user_doc:
            eligibility = check_whatsapp_eligibility(user_doc)
            if not eligibility.get("eligible"):
                fallback_email = payload.to if "@" in payload.to else user_doc.get("email")
                if fallback_email:
                    from account_setup import send_email, _email_wrapper
                    html = _email_wrapper(f"<p>{payload.message}</p>", payload.subject or "TuneMavens Notification", payload.role)
                    status_val = send_email(
                        to=fallback_email,
                        subject=payload.subject or "TuneMavens Notification",
                        html=html,
                        text=payload.message,
                        event_type=payload.event_type,
                        role=payload.role,
                        recipient_name=payload.recipient_name,
                        metadata={"origin": "universal_send_api", "downgraded_from_whatsapp": True, "reason": eligibility.get("notice")}
                    )
                    return {
                        "status": "fallback_email",
                        "channel": "email",
                        "delivery_status": status_val,
                        "notice": f"Delivered via Email. {eligibility.get('notice')}",
                        "eligibility": eligibility
                    }
                return {
                    "status": "blocked",
                    "channel": "whatsapp",
                    "delivery_status": "blocked",
                    "notice": eligibility.get("notice"),
                    "eligibility": eligibility
                }

        res = send_whatsapp(
            to=payload.to,
            message=payload.message,
            recipient_name=payload.recipient_name,
            role=payload.role,
            event_type=payload.event_type,
            metadata={"origin": "universal_send_api"},
            user_doc=user_doc,
            enforce_quota=True
        )
        return {
            "status": "success" if res.get("status") in ("sent", "staged") else ("blocked" if res.get("status") == "blocked" else "failed"),
            "channel": "whatsapp",
            "delivery_status": res.get("status"),
            "comm_id": res.get("comm_id"),
            "direct_url": res.get("direct_url"),
            "notice": res.get("notice")
        }
    else:
        from account_setup import send_email, _email_wrapper
        html = _email_wrapper(f"<p>{payload.message}</p>", payload.subject or "Notification", payload.role)
        status_val = send_email(
            to=payload.to,
            subject=payload.subject or "TuneMavens Ecosystem Notification",
            html=html,
            text=payload.message,
            event_type=payload.event_type,
            role=payload.role,
            recipient_name=payload.recipient_name,
            metadata={"origin": "universal_send_api"}
        )
        return {
            "status": "success",
            "channel": "email",
            "delivery_status": status_val
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


# ==============================================================================
# Meta WhatsApp Cloud API Webhook Protocol
# ==============================================================================

@router.get("/webhook")
def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
):
    """Handshake verification endpoint for Meta WhatsApp Cloud API webhooks.
    
    Meta requires:
    1. hub.mode == 'subscribe'
    2. hub.verify_token matching the secret configured in Meta Developer Portal
    3. Response MUST return the raw hub.challenge string as text/plain with HTTP 200.
    """
    expected_token = os.environ.get("WHATSAPP_VERIFY_TOKEN", "tunemavens_whatsapp_verify_token_2026").strip()
    
    if hub_mode == "subscribe" and hub_verify_token == expected_token:
        logger.info("[WhatsApp Webhook] Verification successful for Meta challenge.")
        return Response(content=str(hub_challenge or ""), media_type="text/plain", status_code=200)

    logger.warning(
        "[WhatsApp Webhook] Verification token mismatch. Expected: '%s', Received: '%s', Mode: '%s'",
        expected_token, hub_verify_token, hub_mode
    )
    raise HTTPException(status_code=403, detail="Verification token mismatch")


@router.post("/webhook")
async def receive_whatsapp_webhook(request: Request):
    """Process incoming Meta WhatsApp Cloud API events.
    
    Handles:
    - Outbound delivery status updates: sent, delivered, read, failed (with error logging)
    - Inbound fan / partner messages: records them directly to db.communications ledger
    """
    try:
        payload = await request.json()
    except Exception as exc:
        logger.error("[WhatsApp Webhook] Failed to parse JSON payload: %s", exc)
        return Response(content="Invalid JSON", media_type="text/plain", status_code=400)

    logger.info("[WhatsApp Webhook] Incoming event received: %s", payload)

    entry_list = payload.get("entry", [])
    now = datetime.now(timezone.utc)

    for entry in entry_list:
        for change in entry.get("changes", []):
            val = change.get("value", {})
            
            # 1. Update Outbound Statuses (delivered, read, failed)
            statuses = val.get("statuses", [])
            for st in statuses:
                msg_id = st.get("id")
                status_name = st.get("status")  # sent, delivered, read, failed
                errors = st.get("errors", [])
                
                update_fields: Dict[str, Any] = {
                    "provider_status_text": status_name,
                    "updated_at": now
                }
                if status_name == "delivered":
                    update_fields["status"] = "delivered"
                elif status_name == "read":
                    update_fields["status"] = "read"
                elif status_name == "failed":
                    update_fields["status"] = "failed"
                    if errors:
                        err_msg = errors[0].get("message") or errors[0].get("title") or str(errors)
                        update_fields["error_details"] = err_msg
                        update_fields["provider_status"] = errors[0].get("code", 400)

                if msg_id:
                    db.communications.update_one(
                        {"$or": [{"resend_id": msg_id}, {"metadata.provider_msg_id": msg_id}]},
                        {"$set": update_fields}
                    )

            # 2. Record Inbound Client / Fan Messages
            messages = val.get("messages", [])
            contacts = val.get("contacts", [])
            contact_name = contacts[0].get("profile", {}).get("name", "WhatsApp User") if contacts else "WhatsApp User"

            for msg in messages:
                sender_phone = msg.get("from", "")
                msg_id = msg.get("id", "")
                msg_text = msg.get("text", {}).get("body", "")

                if not msg_text and msg.get("type") != "text":
                    msg_text = f"[{msg.get('type', 'media').upper()} payload received]"

                # Format international phone e.g. +254...
                formatted_phone = f"+{sender_phone}" if not sender_phone.startswith("+") else sender_phone

                # Account matching: by phone number or by TM-<username> tag in message
                matched_user = db.users.find_one({"$or": [
                    {"phone": formatted_phone},
                    {"whatsapp_phone": formatted_phone},
                    {"phone": sender_phone},
                    {"whatsapp_phone": sender_phone}
                ]})

                account_tag_match = re.search(r"TM-([a-zA-Z0-9_\-\.]+)", msg_text, re.IGNORECASE)
                if account_tag_match:
                    user_tag = account_tag_match.group(1).strip()
                    tagged_user = db.users.find_one({"$or": [
                        {"username": user_tag},
                        {"email": user_tag},
                        {"subdomain": user_tag}
                    ]})
                    if tagged_user:
                        matched_user = tagged_user

                is_opt_in = bool("start" in msg_text.lower() or account_tag_match or matched_user)

                if matched_user:
                    db.users.update_one(
                        {"_id": matched_user["_id"]},
                        {
                            "$set": {
                                "whatsapp_opted_in": True,
                                "whatsapp_phone": formatted_phone,
                                "last_whatsapp_inbound_at": now,
                                "updated_at": now
                            }
                        }
                    )

                inbound_doc = {
                    "id": f"comm_wa_in_{secrets.token_hex(8)}",
                    "to": "TuneMavens Omnichannel",
                    "from_phone": sender_phone,
                    "recipient_name": contact_name,
                    "subject": f"Inbound WhatsApp: {contact_name}",
                    "text": msg_text,
                    "html": f"<div style='background:#202c33;color:#e9edef;padding:14px;border-radius:6px;border-left:4px solid #25d366;'><strong>{contact_name} ({sender_phone}):</strong><p style='margin:6px 0 0;'>{msg_text}</p></div>",
                    "channel": "whatsapp",
                    "provider": "meta_whatsapp_cloud",
                    "direction": "inbound",
                    "event_type": "whatsapp_opt_in_handshake" if is_opt_in else "inbound_customer_message",
                    "role": matched_user.get("role", "creator") if matched_user else "fan",
                    "status": "received",
                    "provider_status": 200,
                    "resend_id": msg_id,
                    "metadata": {
                        "inbound": True,
                        "wa_msg_id": msg_id,
                        "raw_sender": sender_phone,
                        "is_opt_in": is_opt_in,
                        "matched_user_id": str(matched_user["_id"]) if matched_user else None
                    },
                    "archived": False,
                    "created_at": now,
                    "updated_at": now,
                }
                db.communications.insert_one(inbound_doc)

                # Send automatic welcome reply to confirm handshake and 24h window
                if is_opt_in:
                    try:
                        from services.whatsapp_service import send_whatsapp
                        welcome_reply = (
                            f"TuneMavens Alerts Active! 🚀\n\n"
                            f"Hi {contact_name}, your WhatsApp notifications are now verified and active. "
                            f"You will receive real-time sync deal notices, royalty updates, and split clearances directly here. "
                            f"(24-Hour customer window is now open)."
                        )
                        send_whatsapp(
                            to=formatted_phone,
                            message=welcome_reply,
                            recipient_name=contact_name,
                            role=matched_user.get("role", "creator") if matched_user else "creator",
                            event_type="whatsapp_opt_in_welcome",
                            metadata={"auto_reply_to_inbound": msg_id}
                        )
                    except Exception as err:
                        logger.warning("Auto welcome reply exception: %s", err)

    return {"status": "ok"}
