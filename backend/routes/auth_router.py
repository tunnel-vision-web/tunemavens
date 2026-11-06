"""Auth routes — register / login / me / logout.

Mints JWTs that intermaven.io will recognise (shared JWT_SECRET / algorithm).
Cookies are set with COOKIE_DOMAIN so cross-subdomain SSO works in production.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Response, status

from auth import create_access_token, get_optional_user, get_current_user, hash_password, verify_password
from config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    COOKIE_DOMAIN,
    COOKIE_SAMESITE,
    COOKIE_SECURE,
    db,
)
from models import AuthResponse, LoginRequest, RegisterRequest, User, UserPublic
from account_setup import (
    consume_setup_token, create_setup_token, send_affiliate_welcome,
    send_password_changed_notification, send_password_reset_email, send_welcome_email,
)
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

DEFAULT_APPS_BY_ROLE = {
    "creator": ["epk-builder", "catalog-porting", "split-cascade"],
    "podcaster": ["podcaster-studio", "podcaster-episodes", "podcaster-epk", "split-cascade", "corporate-ads"],
    "label": ["catalog-porting", "split-cascade", "publishing-election", "distribution-election", "sync-marketplace", "label-team"],
    "dj": ["djpool", "tunemavens-library"],
    "supervisor": ["sync-marketplace", "escrow-contracts"],
    "studio": ["sync-marketplace", "escrow-contracts"],
    "media_house": ["sync-marketplace", "corporate-ads"],
    "media": ["sync-marketplace", "corporate-ads"],
    "corporate": ["sync-marketplace", "corporate-ads"],
    "consumer": ["tunemavens-library", "tunemavens-tips"],
    "affiliate": ["affiliates", "split-cascade", "tunemavens-library"],
    "vc": ["vc-discover", "vc-portfolio", "vc-sponsorship", "tours-vault", "split-cascade", "escrow-contracts", "crm"],
    "investor": ["vc-discover", "vc-portfolio", "vc-sponsorship", "tours-vault", "split-cascade", "escrow-contracts", "crm"],
    "admin": [
        "epk-builder", "catalog-porting", "split-cascade", "publishing-election",
        "distribution-election", "djpool", "sync-marketplace", "escrow-contracts",
        "tunemavens-library", "tunemavens-tips", "tunepay-inventory", "tunepay-settlement",
        "tunepay-devices", "corporate-ads", "label-team"
    ]
}

ROLE_DEMO_PROFILES = {
    "creator": {
        "email": "creator_member@tunemavens.com",
        "name": "Aisha Okoro",
        "brand_name": "Okoro Sounds",
    },
    "podcaster": {
        "email": "podcaster_demo@tunemavens.com",
        "name": "Zawadi Kiprop",
        "brand_name": "AfroBeats Uncut Podcast",
    },
    "label": {
        "email": "label_demo@tunemavens.com",
        "name": "Kofi Mensah",
        "brand_name": "Nairobi Horizon Records",
    },
    "dj": {
        "email": "dj_demo@tunemavens.com",
        "name": "DJ Kalonje",
        "brand_name": "Street Mix Sound System",
    },
    "supervisor": {
        "email": "supervisor_demo@tunemavens.com",
        "name": "Marcus Adebayo",
        "brand_name": "AfroSync Media Group",
    },
    "media_house": {
        "email": "media_demo@tunemavens.com",
        "name": "Capital FM Broadcast",
        "brand_name": "Capital FM Media",
    },
    "corporate": {
        "email": "corporate_demo@tunemavens.com",
        "name": "Safaricom Brand Partnership",
        "brand_name": "Safaricom PLC",
    },
    "consumer": {
        "email": "consumer_demo@tunemavens.com",
        "name": "Wanjiku Njeri",
        "brand_name": "TuneStream Hi-Fi Listener",
    },
    "affiliate": {
        "email": "affiliate_demo@tunemavens.com",
        "name": "Zawadi Kiprop",
        "brand_name": "Kenya Music Influencer & Curator Network",
    },
    "vc": {
        "email": "vc_demo@tunemavens.com",
        "name": "Kariuki Venture Partners",
        "brand_name": "Atlas Tour Capital",
    },
}


def normalize_role(r: str) -> str:
    if not r:
        return "creator"
    r_lower = r.lower().strip()
    if r_lower in ("artist", "producer", "creator", "creators"):
        return "creator"
    if r_lower in ("record label", "label", "labels"):
        return "label"
    if r_lower in ("dj", "djs"):
        return "dj"
    if r_lower in ("media house", "media_house", "media", "media-house", "broadcaster"):
        return "media_house"
    if r_lower in ("manager", "publisher", "supervisor", "supervisors", "studio", "exec", "music supervisor"):
        return "supervisor"
    if r_lower in ("fan", "consumer", "listener", "listeners"):
        return "consumer"
    if r_lower in ("business", "organization", "corporate", "brand", "brands"):
        return "corporate"
    if r_lower in ("podcaster", "podcasters", "podcast", "podcasts", "host"):
        return "podcaster"
    if r_lower in ("affiliate", "affiliates", "referrer"):
        return "affiliate"
    if r_lower in ("vc", "investor", "investors", "venture capital", "private equity"):
        return "vc"
    return r_lower


def _to_public(user: dict) -> UserPublic:
    role = user.get("role", "creator")
    apps = user.get("apps")
    if not apps:
        apps = DEFAULT_APPS_BY_ROLE.get(role, DEFAULT_APPS_BY_ROLE["creator"])
    
    # Safe name resolution across legacy and Intermaven accounts
    resolved_name = user.get("name")
    if not resolved_name:
        fn = user.get("first_name", "")
        ln = user.get("last_name", "")
        combo = f"{fn} {ln}".strip()
        resolved_name = combo or user.get("username")

    resolved_brand = user.get("brand_name") or user.get("brandName") or user.get("company")
    resolved_country = user.get("country") or "KE"
    resolved_bio = user.get("bio")

    return UserPublic(
        id=str(user["_id"]),
        email=user["email"],
        name=resolved_name,
        role=role,
        roles=user.get("roles", [role]),
        pro_verified=user.get("pro_verified", False),
        plan=user.get("plan", "starter"),
        credits=user.get("credits", 0),
        brand_name=resolved_brand,
        country=resolved_country,
        bio=resolved_bio,
        apps=apps,
        dashboard_layout=user.get("dashboard_layout"),
        signup_page=user.get("signup_page"),
        signup_source=user.get("signup_source"),
    )


def _set_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        domain=COOKIE_DOMAIN,
        path="/",
    )


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, response: Response, background_tasks: BackgroundTasks):
    if db.users.find_one({"email": payload.email}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    roles_list = []
    if payload.roles:
        roles_list = [normalize_role(r) for r in payload.roles]
    elif payload.role:
        roles_list = [normalize_role(payload.role)]
    
    # Block public registration from granting admin role
    roles_list = [r for r in roles_list if r != "admin"]
    if not roles_list:
        roles_list = ["creator"]

    primary_role = roles_list[0]
    default_apps = DEFAULT_APPS_BY_ROLE.get(primary_role, DEFAULT_APPS_BY_ROLE["creator"])

    user_doc = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        role=primary_role,
        roles=roles_list,
        pro_verified=False,
        plan="starter",
        brand_name=payload.brand_name,
        country=payload.country,
        signup_page=payload.signup_page,
        signup_source=payload.signup_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        credits=600,  # default sandbox credit grant
        apps=default_apps,
    ).to_mongo()

    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    # Welcome + confirm-email message (skipped for sandbox/test sign-ups). Sent in the background.
    if not payload.sandbox:
        verify_token = create_setup_token(str(result.inserted_id), purpose="verify")
        background_tasks.add_task(send_welcome_email, payload.email, payload.name or "", primary_role, verify_token)

    token = create_access_token(sub=str(result.inserted_id))
    _set_cookie(response, token)
    return AuthResponse(user=_to_public(user_doc), access_token=token)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response):
    user = db.users.find_one({"email": payload.email})
    if not user or not user.get("password_hash"):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(sub=str(user["_id"]))
    _set_cookie(response, token)
    return AuthResponse(user=_to_public(user), access_token=token)


@router.get("/me", response_model=UserPublic)
def me(current_user: dict = Depends(get_current_user)):
    """Used by the frontend on mount for unified-session recognition (§9.1)."""
    return _to_public(current_user)


@router.post("/logout")
def logout(response: Response, current_user: Optional[dict] = Depends(get_optional_user)):
    if current_user and current_user.get("_id"):
        db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": {"logged_out_at": datetime.now(timezone.utc)}}
        )
    response.delete_cookie(key="access_token", domain=COOKIE_DOMAIN, path="/")
    return {"ok": True, "logged_out": True}


@router.post("/demo", response_model=AuthResponse)
def demo_login(response: Response, role: Optional[str] = Query(None)):
    """Sandbox/demo login helper to issue a valid JWT for testing any persona."""
    norm_role = normalize_role(role) if role else "creator"
    profile = ROLE_DEMO_PROFILES.get(norm_role, ROLE_DEMO_PROFILES["creator"])
    target_email = profile["email"]
    target_apps = DEFAULT_APPS_BY_ROLE.get(norm_role, DEFAULT_APPS_BY_ROLE["creator"])

    user = db.users.find_one({"email": target_email})
    if not user:
        doc = User(
            email=target_email,
            password_hash=hash_password("DemoSandboxPass123!"),
            name=profile["name"],
            role=norm_role,
            roles=[norm_role],
            brand_name=profile["brand_name"],
            country="KE",
            credits=600,
            apps=target_apps
        ).to_mongo()
        res = db.users.insert_one(doc)
        doc["_id"] = res.inserted_id
        user = doc
    else:
        # Update user with active apps and role
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"role": norm_role, "apps": target_apps}}
        )
        user["role"] = norm_role
        user["apps"] = target_apps

    token = create_access_token(sub=str(user["_id"]))
    _set_cookie(response, token)
    return AuthResponse(user=_to_public(user), access_token=token)


class SetPasswordRequest(BaseModel):
    token: str
    password: str


class SetupLinkRequest(BaseModel):
    email: str


@router.post("/set-password", response_model=AuthResponse)
def set_password(payload: SetPasswordRequest, response: Response):
    """Finish account setup from the emailed one-time link, then sign the user in."""
    if len(payload.password or "") < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")
    user_id = consume_setup_token(payload.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="This link has expired or was already used. Please request a new one.")
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="This link is not valid.")
    user = db.users.find_one({"_id": oid})
    if not user:
        raise HTTPException(status_code=400, detail="This link is not valid.")
    db.users.update_one({"_id": oid}, {"$set": {"password_hash": hash_password(payload.password), "email_verified": True}})
    user["password_hash"] = "set"
    
    # Send security notification of password change
    if user.get("email"):
        try:
            send_password_changed_notification(
                to=user["email"],
                name=user.get("name") or "",
                role=user.get("role") or "creator"
            )
        except Exception as e:
            pass

    token = create_access_token(sub=str(oid))
    _set_cookie(response, token)
    return AuthResponse(user=_to_public(user), access_token=token)


@router.post("/request-setup-link")
def request_setup_link(payload: SetupLinkRequest):
    """Re-send the password-setup email. Always answers the same way so emails cannot be probed."""
    email = (payload.email or "").strip().lower()
    user = db.users.find_one({"email": email})
    if user:
        aff = db.affiliates.find_one({"email": email}) or {}
        token = create_setup_token(str(user["_id"]))
        if aff and not user.get("password_hash"):
            send_affiliate_welcome(
                email, user.get("name") or "", aff.get("ref_code", ""),
                f"https://tunemavens.com?ref={aff['ref_code']}" if aff.get("ref_code") else "https://tunemavens.com", token,
            )
        else:
            send_password_reset_email(email, user.get("name") or "", token)
    return {"ok": True, "message": "If that email has an account, we have sent a link to set your password."}


class VerifyEmailRequest(BaseModel):
    token: str


@router.post("/verify-email")
def verify_email(payload: VerifyEmailRequest):
    """Confirm an email address from the one-time link in the welcome email."""
    user_id = consume_setup_token(payload.token, purpose="verify")
    if not user_id:
        raise HTTPException(status_code=400, detail="This confirmation link has expired or was already used.")
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="This link is not valid.")
    db.users.update_one({"_id": oid}, {"$set": {"email_verified": True}})
    return {"ok": True, "message": "Your email is confirmed."}
