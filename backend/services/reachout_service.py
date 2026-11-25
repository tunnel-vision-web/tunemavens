"""Smart CRM Campaign Reachout, Affiliate Attribution & Dual-Notification Service.

Implements:
1. Email-only target group validation (strictly no phone numbers, SMS, or WhatsApp).
2. Tracked per-recipient reachout links tied to the initiating affiliate account.
3. Event email rendering with direct RSVP and/or Buy Ticket CTAs + new-user onboarding CTA.
4. Full-funnel affiliate attribution (clicks -> RSVPs -> user onboarding -> platform spend).
5. Dual notifications to the initiating affiliate: In-App Inbox (`db.user_inbox`) AND
   their registered email address on file (`account_setup.send_email`).
"""
from __future__ import annotations

import logging
import os
import re
import secrets
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote

from config import db

logger = logging.getLogger("tunemavens.reachout")

EMAIL_REGEX = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")
FORBIDDEN_CHANNELS = {"sms", "text", "whatsapp", "phone", "call"}
PUBLIC_APP_URL = os.environ.get("PUBLIC_APP_URL", "http://localhost:5173").rstrip("/")


def validate_email_address(email: str) -> str:
    """Validate and normalize an email address."""
    clean = (email or "").strip().lower()
    if not clean or not EMAIL_REGEX.match(clean):
        raise ValueError(f"Invalid email address: '{email}'")
    return clean


def assert_email_only_channels(channels: Optional[List[str]]) -> List[str]:
    """Ensure no SMS/text/WhatsApp channels are requested for Smart CRM reachouts."""
    requested = [c.strip().lower() for c in (channels or ["email"]) if c and c.strip()]
    blocked = [c for c in requested if c in FORBIDDEN_CHANNELS]
    if blocked:
        raise ValueError(
            f"Unsupported reachout channel(s): {', '.join(blocked)}. "
            "Smart CRM reachouts use email only (no SMS/text or WhatsApp to avoid messaging costs and WhatsApp flagging)."
        )
    if not requested:
        return ["email"]
    return requested


def resolve_initiator_affiliate(
    current_user: Optional[dict] = None,
    affiliate_ref_code: Optional[str] = None,
    initiator_email: Optional[str] = None,
    initiator_name: Optional[str] = None,
) -> Dict[str, Any]:
    """Resolve the affiliate account initiating a Smart CRM reachout.

    Lookup priority:
    1. Explicit `affiliate_ref_code` in `db.affiliates`
    2. Authenticated `current_user`'s email in `db.affiliates`
    3. Explicit `initiator_email` in `db.affiliates`
    4. If a user/email is provided without an existing affiliate row, auto-provision
       an active affiliate tracking record so their reachouts are always attributed.
    """
    aff = None
    if affiliate_ref_code:
        clean_ref = affiliate_ref_code.strip().upper()
        aff = db.affiliates.find_one({"ref_code": clean_ref})

    user_email = None
    user_name = None
    user_id = None
    if current_user:
        user_id = str(current_user.get("_id", "")) or current_user.get("id")
        user_email = (current_user.get("email") or "").strip().lower() or None
        user_name = current_user.get("name") or current_user.get("username")

    resolved_email = (initiator_email or user_email or "").strip().lower() or None
    resolved_name = (initiator_name or user_name or "").strip() or None

    if not aff and resolved_email:
        aff = db.affiliates.find_one({"email": resolved_email})

    # If still not found, check if we have a ref_code or email to auto-create an affiliate record
    if not aff and (affiliate_ref_code or resolved_email):
        ref_code = (
            affiliate_ref_code.strip().upper()
            if affiliate_ref_code
            else f"TM-{secrets.token_hex(3).upper()}"
        )
        aff_email = resolved_email or f"{ref_code.lower()}@tunemavens.com"
        aff_name = resolved_name or (aff_email.split("@")[0].replace(".", " ").title())
        aff_id = f"aff_{uuid.uuid4().hex[:8]}"
        new_aff = {
            "id": aff_id,
            "user_id": user_id,
            "name": aff_name,
            "email": aff_email,
            "handle": f"@{re.sub(r'[^a-z0-9]', '', aff_name.lower())[:16] or 'affiliate'}",
            "ref_code": ref_code,
            "website_or_social": f"{PUBLIC_APP_URL}/?ref={ref_code}",
            "tier": "scout",
            "status": "active",
            "payout_method": "credits",
            "payout_details": {},
            "clicks_count": 0,
            "conversions_count": 0,
            "onboardings_count": 0,
            "rsvps_count": 0,
            "total_gmv": 0.0,
            "total_earnings": 0.0,
            "pending_payout": 0.0,
            "paid_payout": 0.0,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        db.affiliates.insert_one(new_aff)
        aff = db.affiliates.find_one({"id": aff_id})

    # Fallback: resolve user_id from db.users if affiliate exists
    if aff and not user_id and aff.get("email"):
        u = db.users.find_one({"email": aff["email"].strip().lower()})
        if u:
            user_id = str(u["_id"])

    if not aff:
        return {
            "affiliate_id": None,
            "ref_code": None,
            "name": resolved_name or "TuneMavens Growth Team",
            "email": resolved_email,
            "user_id": user_id,
        }

    return {
        "affiliate_id": aff.get("id") or str(aff.get("_id")),
        "ref_code": aff.get("ref_code"),
        "name": aff.get("name") or resolved_name or "Affiliate Partner",
        "email": (aff.get("email") or resolved_email or "").strip().lower() or None,
        "user_id": user_id or aff.get("user_id"),
    }


def notify_affiliate_of_action(
    affiliate_ref_code: Optional[str],
    action_type: str,
    subject: str,
    body_text: str,
    cta_label: str = "Open Affiliate Dashboard",
    cta_url: str = "/dashboard",
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Notify the initiating affiliate in BOTH their In-App Inbox AND their registered email on file.

    Returns a summary dict with `inbox_id`, `email_status`, and `affiliate_email`.
    """
    if not affiliate_ref_code:
        return {"notified": False, "reason": "no_affiliate_ref"}

    clean_ref = affiliate_ref_code.strip().upper()
    aff = db.affiliates.find_one({"ref_code": clean_ref})
    if not aff:
        return {"notified": False, "reason": "affiliate_not_found"}

    aff_email = (aff.get("email") or "").strip().lower()
    aff_name = aff.get("name") or "Affiliate Partner"
    aff_id = aff.get("id") or str(aff.get("_id"))

    # Find linked platform user_id so it appears in their authenticated In-App Inbox
    target_user_id = aff.get("user_id")
    if not target_user_id and aff_email:
        u = db.users.find_one({"email": aff_email})
        if u:
            target_user_id = str(u["_id"])

    now = datetime.now(timezone.utc)
    inbox_doc = {
        "user_id": target_user_id or aff_id,
        "affiliate_id": aff_id,
        "affiliate_ref_code": clean_ref,
        "user_email": aff_email,
        "sender": "TuneMavens Smart CRM Affiliate Tracker",
        "subject": subject,
        "body": body_text,
        "cta_label": cta_label,
        "cta_url": cta_url,
        "category": "affiliate_reachout",
        "action_type": action_type,
        "metadata": metadata or {},
        "read": False,
        "replies": [],
        "created_at": now,
    }
    res = db.user_inbox.insert_one(inbox_doc)
    inbox_id = str(res.inserted_id)

    email_status = "skipped_no_email"
    if aff_email:
        try:
            from account_setup import send_email, _email_wrapper, _button

            inner_html = f"""
            <div style="font-size: 18px; font-weight: 800; color: #22d3ee; margin-bottom: 12px;">{subject}</div>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin-bottom: 18px;">
              Hi {aff_name},<br><br>{body_text.replace(chr(10), '<br>')}
            </p>
            <div style="background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.22); border-radius: 3px; padding: 12px 14px; margin-bottom: 18px; font-size: 12px; color: #94a3b8;">
              <strong style="color: #22d3ee;">Affiliate Ref Code:</strong> {clean_ref} &nbsp;|&nbsp;
              <strong style="color: #22d3ee;">Event Type:</strong> {action_type.replace('_', ' ').title()}
            </div>
            <div>{_button(f"{PUBLIC_APP_URL}{cta_url}", cta_label, variant="primary")}</div>
            """
            wrapped = _email_wrapper(inner_html, subject, "affiliate")
            email_status = send_email(
                to=aff_email,
                subject=subject,
                html=wrapped,
                text=f"Hi {aff_name},\n\n{body_text}\n\nAffiliate Ref: {clean_ref}",
                event_type=f"affiliate_reachout_{action_type}",
                role="affiliate",
                recipient_name=aff_name,
                metadata={
                    "affiliate_id": aff_id,
                    "ref_code": clean_ref,
                    "action_type": action_type,
                    "inbox_id": inbox_id,
                    **(metadata or {}),
                },
            )
        except Exception as exc:
            logger.warning("Failed to email affiliate %s: %s", aff_email, exc)
            email_status = "failed"

    return {
        "notified": True,
        "inbox_id": inbox_id,
        "email_status": email_status,
        "affiliate_email": aff_email,
        "affiliate_ref_code": clean_ref,
    }


def build_reachout_email_html(
    recipient_name: str,
    subject: str,
    rendered_body: str,
    reachout_token: str,
    promotion_type: str = "product_service",
    event_doc: Optional[Dict[str, Any]] = None,
    event_ctas: Optional[List[str]] = None,
    cta_label: str = "Explore Now",
    affiliate_name: Optional[str] = None,
    affiliate_ref_code: Optional[str] = None,
) -> Tuple[str, Dict[str, str]]:
    """Build rich email HTML and tracked CTA URLs for a Smart CRM reachout.

    For events, embeds direct RSVP and/or Buy Ticket CTA buttons right inside the email,
    plus a friendly new-user onboarding CTA so recipients can save their preferences.
    """
    from account_setup import _email_wrapper, _button

    base_reachout = f"{PUBLIC_APP_URL}/#/reachout/{reachout_token}"
    ref_qs = f"&ref={quote(affiliate_ref_code)}" if affiliate_ref_code else ""

    urls: Dict[str, str] = {
        "primary": f"{base_reachout}?action=explore{ref_qs}",
        "rsvp": f"{base_reachout}?action=rsvp{ref_qs}",
        "ticket": f"{base_reachout}?action=ticket{ref_qs}",
        "onboard": f"{base_reachout}?action=onboard{ref_qs}",
    }

    promo_block = ""
    cta_buttons_html = ""

    if promotion_type == "event" and event_doc:
        ev_title = event_doc.get("title", "TuneMavens Live Event")
        ev_artist = event_doc.get("artist", "TuneMavens Featured Artist")
        ev_date = event_doc.get("date_display") or event_doc.get("date", "Upcoming")
        ev_venue = event_doc.get("venue", "")
        ev_city = event_doc.get("city", "")
        ev_mode = event_doc.get("payment_mode", "paid")

        # Determine which direct CTAs to display
        chosen_ctas = [c.lower() for c in (event_ctas or [])]
        if not chosen_ctas:
            if ev_mode == "free_rsvp":
                chosen_ctas = ["rsvp"]
            elif ev_mode == "both":
                chosen_ctas = ["rsvp", "ticket"]
            else:
                chosen_ctas = ["ticket", "rsvp"]

        promo_block = f"""
        <div style="background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.25); border-radius: 3px; padding: 16px 18px; margin: 18px 0;">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #22d3ee; margin-bottom: 6px;">
            LIVE EVENT INVITATION
          </div>
          <div style="font-size: 17px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">{ev_title}</div>
          <div style="font-size: 13px; color: #94a3b8;">
            Featuring <strong style="color: #e2e8f0;">{ev_artist}</strong><br>
            {ev_date} &bull; {ev_venue}{f', {ev_city}' if ev_city else ''}
          </div>
        </div>
        """

        btns = []
        if "rsvp" in chosen_ctas:
            btns.append(_button(urls["rsvp"], "RSVP Now (Reserve Spot)", variant="emerald"))
        if "ticket" in chosen_ctas:
            btns.append(_button(urls["ticket"], "Buy Ticket Now", variant="primary"))
        cta_buttons_html = f'<div style="margin: 20px 0; display: flex; flex-wrap: wrap; gap: 10px;">{" &nbsp; ".join(btns)}</div>'
    else:
        cta_buttons_html = f'<div style="margin: 20px 0;">{_button(urls["primary"], cta_label or "Explore Now", variant="primary")}</div>'

    onboard_callout = f"""
    <div style="margin-top: 22px; padding: 14px 16px; background: #0f172a; border: 1px solid #1e293b; border-radius: 3px;">
      <div style="font-size: 13px; font-weight: 700; color: #f8fafc; margin-bottom: 4px;">
        New to TuneMavens?
      </div>
      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">
        Create your free TuneMavens account in seconds to save your music preferences, event passes, and tickets for faster access next time.
      </div>
      <a href="{urls['onboard']}" style="color: #22d3ee; font-size: 12px; font-weight: 700; text-decoration: none;">
        Save Your Preferences &amp; Join TuneMavens &rarr;
      </a>
    </div>
    """

    sender_note = (
        f'<div style="font-size: 11px; color: #64748b; margin-top: 14px;">Shared by {affiliate_name} via TuneMavens Partner Network</div>'
        if affiliate_name
        else ""
    )

    inner_html = f"""
    <div style="font-size: 18px; font-weight: 800; color: #22d3ee; margin-bottom: 14px;">{subject}</div>
    <p style="color: #cbd5e1; font-size: 14px; line-height: 1.65; margin-bottom: 16px;">
      {rendered_body.replace(chr(10), '<br>')}
    </p>
    {promo_block}
    {cta_buttons_html}
    {onboard_callout}
    {sender_note}
    """

    wrapped_html = _email_wrapper(inner_html, subject, "reachout")
    return wrapped_html, urls


def _log_reachout_activity(
    action_type: str,
    affiliate_ref_code: Optional[str],
    affiliate_id: Optional[str],
    campaign_id: Optional[str],
    reachout_token: Optional[str],
    actor_name: Optional[str],
    actor_email: Optional[str],
    amount_usd: float = 0.0,
    commission_usd: float = 0.0,
    details: Optional[Dict[str, Any]] = None,
) -> None:
    """Persist a structured funnel activity event for Smart CRM affiliate reporting."""
    db.crm_reachout_activity.insert_one({
        "id": f"act_{uuid.uuid4().hex[:10]}",
        "action_type": action_type,
        "affiliate_ref_code": affiliate_ref_code,
        "affiliate_id": affiliate_id,
        "campaign_id": campaign_id,
        "reachout_token": reachout_token,
        "actor_name": actor_name,
        "actor_email": (actor_email or "").strip().lower() or None,
        "amount_usd": round(float(amount_usd or 0.0), 2),
        "commission_usd": round(float(commission_usd or 0.0), 2),
        "details": details or {},
        "created_at": datetime.now(timezone.utc),
    })


def record_reachout_click(token: str) -> Optional[Dict[str, Any]]:
    """Record a recipient click on a tracked reachout link."""
    link = db.crm_reachout_links.find_one({"token": token})
    if not link:
        return None

    now = datetime.now(timezone.utc)
    update_ops: Dict[str, Any] = {
        "$inc": {"clicks": 1},
        "$set": {"last_clicked_at": now},
    }
    if not link.get("first_clicked_at"):
        update_ops["$set"]["first_clicked_at"] = now

    db.crm_reachout_links.update_one({"_id": link["_id"]}, update_ops)

    # Update campaign stats
    campaign_id = link.get("campaign_id")
    if campaign_id:
        try:
            from bson import ObjectId
            db.crm_campaigns.update_one(
                {"_id": ObjectId(campaign_id)},
                {"$inc": {"stats.clicked": 1}},
            )
        except Exception:
            pass

    # Increment affiliate clicks
    ref_code = link.get("affiliate_ref_code")
    if ref_code:
        db.affiliates.update_one(
            {"ref_code": ref_code},
            {"$inc": {"clicks_count": 1}},
        )

    _log_reachout_activity(
        action_type="click",
        affiliate_ref_code=ref_code,
        affiliate_id=link.get("affiliate_id"),
        campaign_id=campaign_id,
        reachout_token=token,
        actor_name=link.get("recipient_name"),
        actor_email=link.get("recipient_email"),
        details={"promotion_type": link.get("promotion_type"), "event_id": link.get("event_id")},
    )

    return db.crm_reachout_links.find_one({"_id": link["_id"]})


def record_reachout_rsvp(
    event: Dict[str, Any],
    fan_name: str,
    fan_email: str,
    rsvp_id: str,
    reachout_token: Optional[str] = None,
    ref_code: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Attribute an event RSVP to a Smart CRM reachout and notify the initiating affiliate."""
    link = db.crm_reachout_links.find_one({"token": reachout_token}) if reachout_token else None
    resolved_ref = (
        (link.get("affiliate_ref_code") if link else None)
        or (ref_code.strip().upper() if ref_code else None)
    )

    if not resolved_ref and fan_email:
        # Check if this user was previously onboarded under an affiliate
        u = db.users.find_one({"email": fan_email.strip().lower()})
        if u and u.get("referred_by_ref_code"):
            resolved_ref = u["referred_by_ref_code"]

    if not resolved_ref and not link:
        return None

    now = datetime.now(timezone.utc)
    if link:
        db.crm_reachout_links.update_one(
            {"_id": link["_id"]},
            {"$set": {"rsvped": True, "rsvp_id": rsvp_id, "rsvped_at": now}},
        )
        if link.get("campaign_id"):
            try:
                from bson import ObjectId
                db.crm_campaigns.update_one(
                    {"_id": ObjectId(link["campaign_id"])},
                    {"$inc": {"stats.rsvps": 1}},
                )
            except Exception:
                pass

    if resolved_ref:
        db.affiliates.update_one(
            {"ref_code": resolved_ref},
            {"$inc": {"rsvps_count": 1}},
        )

    _log_reachout_activity(
        action_type="rsvp",
        affiliate_ref_code=resolved_ref,
        affiliate_id=link.get("affiliate_id") if link else None,
        campaign_id=link.get("campaign_id") if link else None,
        reachout_token=reachout_token,
        actor_name=fan_name,
        actor_email=fan_email,
        details={"event_id": event.get("id"), "event_title": event.get("title"), "rsvp_id": rsvp_id},
    )

    return notify_affiliate_of_action(
        affiliate_ref_code=resolved_ref,
        action_type="rsvp",
        subject=f"New Event RSVP from Your Reachout: {fan_name} → {event.get('title')}",
        body_text=(
            f"{fan_name} ({fan_email}) just confirmed an RSVP for '{event.get('title')}' "
            f"via your Smart CRM reachout campaign (RSVP ID: {rsvp_id}).\n\n"
            "Any future onboarding or platform spending by this guest will continue to be tracked under your affiliate account."
        ),
        cta_label="View Affiliate Telemetry",
        cta_url="/dashboard",
        metadata={"event_id": event.get("id"), "rsvp_id": rsvp_id, "guest_email": fan_email},
    )


def record_reachout_onboarding(
    user_doc: Dict[str, Any],
    reachout_token: Optional[str] = None,
    ref_code: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Attribute a new user onboarding to the initiating affiliate and notify them."""
    link = db.crm_reachout_links.find_one({"token": reachout_token}) if reachout_token else None
    resolved_ref = (
        (link.get("affiliate_ref_code") if link else None)
        or (ref_code.strip().upper() if ref_code else None)
    )
    if not resolved_ref:
        return None

    aff = db.affiliates.find_one({"ref_code": resolved_ref})
    aff_id = (aff.get("id") if aff else None) or (link.get("affiliate_id") if link else None)
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    user_email = (user_doc.get("email") or "").strip().lower()
    user_name = user_doc.get("name") or user_email.split("@")[0]
    user_role = user_doc.get("role") or "consumer"

    # Stamp attribution on the user record so future spending is automatically tracked
    if user_doc.get("_id"):
        db.users.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {
                "referred_by_ref_code": resolved_ref,
                "referred_by_affiliate_id": aff_id,
                "reachout_token": reachout_token,
                "reachout_campaign_id": link.get("campaign_id") if link else None,
            }},
        )

    if link:
        db.crm_reachout_links.update_one(
            {"_id": link["_id"]},
            {"$set": {
                "onboarded": True,
                "onboarded_user_id": str(user_doc.get("_id", "")),
                "onboarded_at": now,
            }},
        )
        if link.get("campaign_id"):
            try:
                from bson import ObjectId
                db.crm_campaigns.update_one(
                    {"_id": ObjectId(link["campaign_id"])},
                    {"$inc": {"stats.onboarded": 1}},
                )
            except Exception:
                pass

    # Record in affiliate_linked_users so it shows up in the Affiliate Network dashboard
    db.affiliate_linked_users.update_one(
        {"ref_code": resolved_ref, "email": user_email},
        {"$set": {
            "id": f"usr_ref_{uuid.uuid4().hex[:6]}",
            "ref_code": resolved_ref,
            "name": user_name,
            "email": user_email,
            "handle": f"@{re.sub(r'[^a-z0-9]', '', user_name.lower())[:16] or 'member'}",
            "role": user_role,
            "role_label": user_role.title(),
            "status": "active",
            "region": user_doc.get("country") or "Global",
            "linked_at": now_iso,
            "source": "smart_crm_reachout",
            "reachout_token": reachout_token,
            "releases_count": 0,
            "streams_count": 0,
            "gross_revenue": 0.0,
            "commission_generated": 0.0,
            "last_active": "Just onboarded",
        }},
        upsert=True,
    )

    if aff:
        db.affiliates.update_one(
            {"_id": aff["_id"]},
            {"$inc": {"onboardings_count": 1}},
        )

    _log_reachout_activity(
        action_type="onboarding",
        affiliate_ref_code=resolved_ref,
        affiliate_id=aff_id,
        campaign_id=link.get("campaign_id") if link else None,
        reachout_token=reachout_token,
        actor_name=user_name,
        actor_email=user_email,
        details={"role": user_role, "preferences": user_doc.get("preferences") or {}},
    )

    return notify_affiliate_of_action(
        affiliate_ref_code=resolved_ref,
        action_type="onboarding",
        subject=f"New User Onboarded via Your Reachout: {user_name}",
        body_text=(
            f"Great news! {user_name} ({user_email}) just completed onboarding as a {user_role.title()} "
            f"through your Smart CRM reachout.\n\n"
            "Their account is now permanently linked to your affiliate code, so you will automatically earn commissions "
            "and receive notifications whenever they purchase tickets, reload credits, or spend on TuneMavens."
        ),
        cta_label="View Your Affiliate Network",
        cta_url="/dashboard",
        metadata={"user_email": user_email, "role": user_role, "reachout_token": reachout_token},
    )


def record_reachout_spend(
    conversion_type: str,
    item_title: str,
    gross_amount_usd: float,
    user_id: Optional[str] = None,
    buyer_email: Optional[str] = None,
    buyer_name: Optional[str] = None,
    reachout_token: Optional[str] = None,
    ref_code: Optional[str] = None,
    tx_id: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Attribute a platform spend (ticket, credit reload, purchase) to the initiating affiliate.

    Resolves attribution from:
    1. Explicit `reachout_token` -> `crm_reachout_links`
    2. Explicit `ref_code`
    3. The buyer's `db.users` document (`referred_by_ref_code` / `reachout_token`)
    """
    if gross_amount_usd <= 0:
        return None

    link = db.crm_reachout_links.find_one({"token": reachout_token}) if reachout_token else None
    resolved_ref = (
        (link.get("affiliate_ref_code") if link else None)
        or (ref_code.strip().upper() if ref_code else None)
    )
    resolved_token = reachout_token

    # Fallback: check user record by user_id or buyer_email
    if not resolved_ref:
        user_doc = None
        if user_id:
            try:
                from bson import ObjectId
                user_doc = db.users.find_one({"_id": ObjectId(user_id)})
            except Exception:
                user_doc = db.users.find_one({"id": user_id})
        if not user_doc and buyer_email:
            user_doc = db.users.find_one({"email": buyer_email.strip().lower()})
        if user_doc:
            resolved_ref = user_doc.get("referred_by_ref_code")
            if not resolved_token and user_doc.get("reachout_token"):
                resolved_token = user_doc.get("reachout_token")
                link = db.crm_reachout_links.find_one({"token": resolved_token})

    if not resolved_ref:
        return None

    aff = db.affiliates.find_one({"ref_code": resolved_ref})
    if not aff:
        return None

    # Determine commission rate from active matrix
    from routes.affiliate_router import DEFAULT_COMPENSATION_MATRIX

    matrix_doc = db.affiliate_matrix_config.find_one({"active": True}, {"_id": 0})
    matrix_list = matrix_doc.get("matrix", DEFAULT_COMPENSATION_MATRIX) if matrix_doc else DEFAULT_COMPENSATION_MATRIX
    matrix_item = next((m for m in matrix_list if m["id"] == conversion_type), None)
    if not matrix_item:
        matrix_item = next((m for m in matrix_list if m["id"] == "ticket_pass"), matrix_list[0])

    base_rate = float(matrix_item.get("rate_percent", 10.0))
    tier = aff.get("tier", "scout")
    tier_bonuses = matrix_item.get("tier_bonuses", {})
    if isinstance(tier_bonuses, dict) and tier in tier_bonuses:
        effective_rate = float(tier_bonuses[tier])
    else:
        tier_add = 0.0 if tier == "scout" else (1.0 if tier == "partner" else 2.0)
        effective_rate = min(12.0, base_rate + tier_add)

    commission = round(float(gross_amount_usd) * (effective_rate / 100.0), 2)
    if matrix_item["id"] == "sync_placement" and commission > 300.0:
        commission = 300.00

    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    conv_id = f"conv_{uuid.uuid4().hex[:8]}"
    final_tx = tx_id or f"TX-CRM-{uuid.uuid4().hex[:6].upper()}"

    conv_doc = {
        "id": conv_id,
        "affiliate_id": aff.get("id") or str(aff.get("_id")),
        "ref_code": resolved_ref,
        "tx_id": final_tx,
        "type": matrix_item["id"],
        "type_label": matrix_item["category"],
        "item_title": item_title,
        "buyer_info": buyer_email or buyer_name or "Platform Member",
        "creator_name": aff.get("name"),
        "gross_amount": round(float(gross_amount_usd), 2),
        "commission_rate": effective_rate,
        "commission_amount": commission,
        "status": "cleared",
        "source": "smart_crm_reachout",
        "reachout_token": resolved_token,
        "campaign_id": link.get("campaign_id") if link else None,
        "created_at": now_iso,
    }
    db.affiliate_conversions.insert_one(dict(conv_doc))

    db.affiliates.update_one(
        {"_id": aff["_id"]},
        {"$inc": {
            "conversions_count": 1,
            "total_gmv": round(float(gross_amount_usd), 2),
            "total_earnings": commission,
            "pending_payout": commission,
        }},
    )

    if buyer_email:
        db.affiliate_linked_users.update_one(
            {"ref_code": resolved_ref, "email": buyer_email.strip().lower()},
            {"$inc": {
                "gross_revenue": round(float(gross_amount_usd), 2),
                "commission_generated": commission,
            }, "$set": {"last_active": "Just purchased"}},
        )

    if link:
        db.crm_reachout_links.update_one(
            {"_id": link["_id"]},
            {
                "$set": {"ticket_purchased": conversion_type == "ticket_pass" or bool(link.get("ticket_purchased"))},
                "$inc": {
                    "total_spend_usd": round(float(gross_amount_usd), 2),
                    "commission_earned_usd": commission,
                },
            },
        )
        if link.get("campaign_id"):
            try:
                from bson import ObjectId
                db.crm_campaigns.update_one(
                    {"_id": ObjectId(link["campaign_id"])},
                    {"$inc": {
                        "stats.conversions": 1,
                        "stats.total_spend_usd": round(float(gross_amount_usd), 2),
                        "stats.commission_earned_usd": commission,
                    }},
                )
            except Exception:
                pass

    _log_reachout_activity(
        action_type="spend",
        affiliate_ref_code=resolved_ref,
        affiliate_id=aff.get("id") or str(aff.get("_id")),
        campaign_id=link.get("campaign_id") if link else None,
        reachout_token=resolved_token,
        actor_name=buyer_name,
        actor_email=buyer_email,
        amount_usd=gross_amount_usd,
        commission_usd=commission,
        details={"tx_id": final_tx, "item_title": item_title, "conversion_type": conversion_type},
    )

    buyer_label = buyer_name or buyer_email or "A referred user"
    notif = notify_affiliate_of_action(
        affiliate_ref_code=resolved_ref,
        action_type="spend",
        subject=f"Commission Earned (${commission:.2f}): {buyer_label} purchased {item_title}",
        body_text=(
            f"{buyer_label} spent ${float(gross_amount_usd):.2f} on '{item_title}' (Ref TX: {final_tx}).\n\n"
            f"Your Affiliate Commission ({effective_rate:.1f}%): ${commission:.2f} has been credited to your pending payout balance."
        ),
        cta_label="View Earnings & Ledger",
        cta_url="/dashboard",
        metadata={
            "conversion_id": conv_id,
            "tx_id": final_tx,
            "gross_amount": round(float(gross_amount_usd), 2),
            "commission_amount": commission,
            "item_title": item_title,
        },
    )

    return {
        "attributed": True,
        "conversion": conv_doc,
        "notification": notif,
    }
