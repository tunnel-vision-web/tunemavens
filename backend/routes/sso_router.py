"""SSO Router for OIDC/PKCE cross-portal authentication.

Handles OIDC-like authorization and token exchange endpoints for
tunemavens.com, tunestream.co, and syncmavens.com clients.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
import secrets
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr

from auth import create_access_token, get_current_user
from config import db
from models import UserPublic

router = APIRouter(prefix="/api/sso", tags=["sso"])

import base64
import hashlib

# Allowed clients registry mapping to domain eTLD+1 configurations
ALLOWED_CLIENTS: Dict[str, Dict] = {
    "intermaven": {
        "client_id": "intermaven",
        "name": "Intermaven Parent Platform",
        "redirect_uris": [
            "http://localhost:3000/callback",
            "https://intermaven.io/callback",
            "https://www.intermaven.io/callback",
        ],
    },
    "tunemavens": {
        "client_id": "tunemavens",
        "name": "TuneMavens Marketplace Hub",
        "redirect_uris": [
            "http://localhost:3000/callback",
            "https://tunemavens.com/callback",
            "https://www.tunemavens.com/callback",
        ],
    },
    "tunestream": {
        "client_id": "tunestream",
        "name": "TuneStream Lossless Player",
        "redirect_uris": [
            "http://localhost:3001/callback",
            "https://tunestream.co/callback",
        ],
    },
    "syncmavens": {
        "client_id": "syncmavens",
        "name": "SyncMavens Sync Licensing Hub",
        "redirect_uris": [
            "http://localhost:3002/callback",
            "https://syncmavens.com/callback",
        ],
    },
}

# Temporary in-memory store for authorization codes
_auth_codes_store: Dict[str, Dict] = {}


class TokenExchangeRequest(BaseModel):
    grant_type: str
    client_id: str
    code: str
    redirect_uri: str
    code_verifier: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    expires_in: int = 10080 * 60


def _verify_pkce_challenge(code_verifier: str, code_challenge: str, method: str) -> bool:
    if method == "plain":
        return code_verifier == code_challenge
    elif method == "S256":
        digest = hashlib.sha256(code_verifier.encode("utf-8")).digest()
        calculated_challenge = base64.urlsafe_b64encode(digest).decode("utf-8").rstrip("=")
        return calculated_challenge == code_challenge.rstrip("=")
    return False


@router.get("/clients")
def get_sso_clients():
    """Returns registered ecosystem OIDC/PKCE clients."""
    return {"clients": list(ALLOWED_CLIENTS.values())}


@router.get("/authorize")
def authorize(
    client_id: str = Query(...),
    redirect_uri: str = Query(...),
    response_type: str = Query("code"),
    scope: str = Query("openid profile email"),
    code_challenge: Optional[str] = Query(None),
    code_challenge_method: Optional[str] = Query("S256"),
    current_user: dict = Depends(get_current_user),
):
    """OIDC Authorization Code endpoint.

    Validates client registration and issues an authorization code
    for authenticated users.
    """
    client = ALLOWED_CLIENTS.get(client_id)
    if not client:
        raise HTTPException(status_code=400, detail="Invalid client_id")

    if redirect_uri not in client["redirect_uris"]:
        raise HTTPException(status_code=400, detail="Invalid redirect_uri")

    if response_type != "code":
        raise HTTPException(status_code=400, detail="Unsupported response_type")

    # Generate authorization code valid for 5 minutes
    auth_code = f"code_{secrets.token_urlsafe(32)}"
    _auth_codes_store[auth_code] = {
        "user_id": str(current_user["_id"]),
        "client_id": client_id,
        "code_challenge": code_challenge,
        "code_challenge_method": code_challenge_method or "S256",
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5),
    }

    return {"code": auth_code, "redirect_uri": redirect_uri}


@router.post("/token", response_model=TokenResponse)
def token_exchange(payload: TokenExchangeRequest):
    """OIDC Token exchange endpoint.

    Exchanges authorization code for a standard JWT access token.
    """
    if payload.grant_type != "authorization_code":
        raise HTTPException(status_code=400, detail="Unsupported grant_type")

    code_data = _auth_codes_store.get(payload.code)
    if not code_data:
        raise HTTPException(status_code=400, detail="Invalid or expired authorization code")

    # Check expiration
    if datetime.now(timezone.utc) > code_data["expires_at"]:
        _auth_codes_store.pop(payload.code, None)
        raise HTTPException(status_code=400, detail="Authorization code expired")

    # Validate client constraints
    if code_data["client_id"] != payload.client_id:
        raise HTTPException(status_code=400, detail="Client mismatch")

    # PKCE verification if challenge was provided during /authorize
    expected_challenge = code_data.get("code_challenge")
    if expected_challenge:
        if not payload.code_verifier:
            raise HTTPException(status_code=400, detail="PKCE code_verifier is required")
        method = code_data.get("code_challenge_method", "S256")
        if not _verify_pkce_challenge(payload.code_verifier, expected_challenge, method):
            raise HTTPException(status_code=400, detail="PKCE code_verifier verification failed")

    # Remove code to prevent reuse
    _auth_codes_store.pop(payload.code, None)

    # Validate user exists
    from bson import ObjectId
    user = db.users.find_one({"_id": ObjectId(code_data["user_id"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Mint JWT access token
    access_token = create_access_token(sub=str(user["_id"]))
    return TokenResponse(access_token=access_token)

