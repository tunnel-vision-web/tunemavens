"""Auth routes — register / login / me / logout.

Mints JWTs that intermaven.io will recognise (shared JWT_SECRET / algorithm).
Cookies are set with COOKIE_DOMAIN so cross-subdomain SSO works in production.
"""
from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Response, status

from auth import create_access_token, get_current_user, hash_password, verify_password
from config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    COOKIE_DOMAIN,
    COOKIE_SAMESITE,
    COOKIE_SECURE,
    db,
)
from models import AuthResponse, LoginRequest, RegisterRequest, User, UserPublic

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_public(user: dict) -> UserPublic:
    return UserPublic(
        id=str(user["_id"]),
        email=user["email"],
        name=user.get("name"),
        role=user.get("role", "creator"),
        roles=user.get("roles", ["creator"]),
        pro_verified=user.get("pro_verified", False),
        plan=user.get("plan", "starter"),
        credits=user.get("credits", 0),
        brand_name=user.get("brand_name"),
        country=user.get("country"),
        bio=user.get("bio"),
        apps=user.get("apps", []),
        dashboard_layout=user.get("dashboard_layout"),
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
def register(payload: RegisterRequest, response: Response):
    if db.users.find_one({"email": payload.email}):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # Mappings to 7 canonical roles
    def normalize_role(r: str) -> str:
        r_lower = r.lower().strip()
        if r_lower in ("artist", "producer", "creator"):
            return "creator"
        if r_lower in ("record label", "label"):
            return "label"
        if r_lower == "dj":
            return "dj"
        if r_lower in ("media house", "media_house", "media"):
            return "media_house"
        if r_lower in ("manager", "publisher", "supervisor", "exec"):
            return "exec"
        if r_lower in ("fan", "consumer"):
            return "consumer"
        if r_lower in ("business", "organization", "corporate"):
            return "corporate"
        return r_lower

    roles_list = []
    if payload.roles:
        roles_list = [normalize_role(r) for r in payload.roles]
    elif payload.role:
        roles_list = [normalize_role(payload.role)]
    
    if not roles_list:
        roles_list = ["creator"]

    primary_role = roles_list[0]

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
        credits=600,  # default sandbox credit grant
    ).to_mongo()

    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

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
def logout(response: Response):
    response.delete_cookie(key="access_token", domain=COOKIE_DOMAIN, path="/")
    return {"ok": True}
