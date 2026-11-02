"""Transactional email (Resend) and one-time "set your password" links.

- Sends through the Resend REST API when RESEND_API_KEY is set.
- Without a key nothing leaves the server: the message is saved in `email_outbox`
  and logged, so development still works and nothing is silently lost.
- Setup tokens are random, single use and stored only as a SHA-256 hash.
"""
from __future__ import annotations

import hashlib
import logging
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import requests

from config import db

logger = logging.getLogger("tunemavens.email")

RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
RESEND_FROM = os.environ.get("RESEND_FROM", "TuneMavens <hello@tunemavens.com>")
PUBLIC_APP_URL = os.environ.get("PUBLIC_APP_URL", "https://tunemavens.com").rstrip("/")
SETUP_TOKEN_HOURS = int(os.environ.get("SETUP_TOKEN_HOURS", "72"))


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_setup_token(user_id: str, purpose: str = "setup") -> str:
    """Create a one-time token (valid SETUP_TOKEN_HOURS) and return the raw value.

    purpose: 'setup' (choose/reset a password) or 'verify' (confirm the email address).
    """
    token = secrets.token_urlsafe(32)
    db.password_resets.insert_one({
        "purpose": purpose,
        "user_id": str(user_id),
        "token_hash": _hash(token),
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=SETUP_TOKEN_HOURS),
        "used": False,
        "created_at": datetime.now(timezone.utc),
    })
    return token


def consume_setup_token(token: str, purpose: str = "setup") -> Optional[str]:
    """Validate a token and mark it used. Returns the user_id, or None if invalid/expired/used."""
    purposes = ["setup", None] if purpose == "setup" else [purpose]  # older tokens have no purpose
    doc = db.password_resets.find_one({"token_hash": _hash(token or ""), "used": False, "purpose": {"$in": purposes}})
    if not doc:
        return None
    expires = doc.get("expires_at")
    if expires is not None:
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        if expires < datetime.now(timezone.utc):
            return None
    db.password_resets.update_one({"_id": doc["_id"]}, {"$set": {"used": True, "used_at": datetime.now(timezone.utc)}})
    return doc["user_id"]


def verify_link(token: str) -> str:
    return f"{PUBLIC_APP_URL}/#/verify-email?token={token}"


def setup_link(token: str) -> str:
    # The portal uses hash routing, so the route lives after '#'.
    return f"{PUBLIC_APP_URL}/#/set-password?token={token}"


def send_email(to: str, subject: str, html: str, text: str = "") -> str:
    """Send an email. Returns 'sent', 'not_configured' or 'failed'. Never raises."""
    record = {"to": to, "subject": subject, "created_at": datetime.now(timezone.utc)}
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set - email to %s not sent (saved to email_outbox)", to)
        try:
            db.email_outbox.insert_one({**record, "status": "not_configured", "html": html})
        except Exception:
            pass
        return "not_configured"
    try:
        r = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
            json={"from": RESEND_FROM, "to": [to], "subject": subject, "html": html, "text": text or subject},
            timeout=10,
        )
        ok = r.status_code in (200, 201)
        if not ok:
            logger.error("Resend rejected email to %s: %s %s", to, r.status_code, r.text[:300])
        try:
            db.email_outbox.insert_one({**record, "status": "sent" if ok else "failed", "provider_status": r.status_code})
        except Exception:
            pass
        return "sent" if ok else "failed"
    except Exception as exc:  # network error etc.
        logger.error("Email to %s failed: %s", to, exc)
        return "failed"


def _button(url: str, label: str) -> str:
    return (
        f'<a href="{url}" style="display:inline-block;background:#22d3ee;color:#04141a;'
        f'text-decoration:none;font-weight:700;padding:14px 26px;border-radius:3px;">{label}</a>'
    )


def send_affiliate_welcome(to: str, name: str, ref_code: str, referral_url: str, token: Optional[str]) -> str:
    first = (name or "there").split()[0]
    if token:
        action = (
            "<p>Click the button below to choose your password and open your affiliate dashboard. "
            f"The link works once and expires in {SETUP_TOKEN_HOURS} hours.</p>"
            + _button(setup_link(token), "Set my password")
        )
        action_text = f"Set your password: {setup_link(token)}"
    else:
        action = "<p>You already have an account. Log in to open your affiliate dashboard.</p>" + _button(
            f"{PUBLIC_APP_URL}/#/login", "Log in"
        )
        action_text = f"Log in: {PUBLIC_APP_URL}/#/login"
    html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;color:#111;line-height:1.55">
  <h2 style="margin-bottom:4px">Welcome to TuneMavens, {first}!</h2>
  <p>Your affiliate account is ready.</p>
  <p><strong>Your referral code:</strong> {ref_code}<br>
     <strong>Your referral link:</strong> <a href="{referral_url}">{referral_url}</a></p>
  {action}
  <p style="color:#555;font-size:13px;margin-top:28px">Your login email is this address. We never ask for your password by email.
  If you did not sign up, you can ignore this message.</p>
</div>"""
    text = (
        f"Welcome to TuneMavens, {first}! Your referral code: {ref_code}. Your link: {referral_url}. {action_text}"
    )
    return send_email(to, "Welcome to the TuneMavens Affiliate Program", html, text)


# ---------------------------------------------------------------------------
# Persona welcome / password reset emails
# ---------------------------------------------------------------------------
ROLE_COPY = {
    "creator": ("Creator", "Build your EPK, lock in your split sheets and pitch to sync briefs."),
    "podcaster": ("Podcaster", "Publish episodes, find sponsors and grow your audience."),
    "label": ("Record Label", "Manage your roster, catalogue and split payouts in one place."),
    "dj": ("DJ", "Get lossless record pools and clear stems with confidence."),
    "supervisor": ("Music Supervisor", "Search the catalogue and license music with escrow protection."),
    "media_house": ("Media House", "License music for broadcast and keep playlist reports in order."),
    "corporate": ("Corporate / Brand", "Run audio ads and sponsorships with local artists."),
    "consumer": ("Listener", "Stream in high quality and support the artists you love."),
    "vc": ("Venture Capital & Tour Financier", "Discover creators and fund tours with clear, tracked terms."),
    "affiliate": ("Affiliate", "Share your link and earn on every referral."),
}


def send_welcome_email(to: str, name: str, role: str, verify_token: Optional[str] = None) -> str:
    """Welcome email for any persona, with a button to confirm the email address."""
    label, blurb = ROLE_COPY.get(role, ("Member", "Your account is ready."))
    first = (name or "there").split()[0]
    confirm = ""
    confirm_text = ""
    if verify_token:
        confirm = (
            "<p>Please confirm your email address so we can keep your account safe and reach you about payments.</p>"
            + _button(verify_link(verify_token), "Confirm my email")
            + "<p style='font-size:13px;color:#555'>The link works once and expires in " + str(SETUP_TOKEN_HOURS) + " hours.</p>"
        )
        confirm_text = f" Confirm your email: {verify_link(verify_token)}"
    login_url = f"{PUBLIC_APP_URL}/#/login"
    html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;color:#111;line-height:1.55">
  <h2 style="margin-bottom:4px">Welcome to TuneMavens, {first}!</h2>
  <p>Your <strong>{label}</strong> account is ready. {blurb}</p>
  <p>{_button(login_url, "Open my dashboard")}</p>
  {confirm}
  <p style="color:#555;font-size:13px;margin-top:28px">Your login email is this address. We never ask for your password by email.
  If you did not sign up, you can ignore this message.</p>
</div>"""
    text = f"Welcome to TuneMavens, {first}! Your {label} account is ready. Log in: {login_url}.{confirm_text}"
    return send_email(to, f"Welcome to TuneMavens - your {label} account is ready", html, text)


def send_password_reset_email(to: str, name: str, token: str) -> str:
    first = (name or "there").split()[0]
    link = setup_link(token)
    html = f"""
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;color:#111;line-height:1.55">
  <h2 style="margin-bottom:4px">Choose a new password</h2>
  <p>Hi {first}, click the button to choose a new TuneMavens password.
  The link works once and expires in {SETUP_TOKEN_HOURS} hours.</p>
  <p>{_button(link, "Set my password")}</p>
  <p style="color:#555;font-size:13px;margin-top:28px">If you did not ask for this, you can ignore this message. Your password will not change.</p>
</div>"""
    return send_email(to, "Choose a new TuneMavens password", html, f"Set your password: {link}")
