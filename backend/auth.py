"""Shared-JWT auth utilities for the TuneMavens backend.

Tokens minted here use the same JWT_SECRET / algorithm as intermaven.io, so a
session created on either portal is recognised on the other (DOCUMENTATION.md §9.1).
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional

from bson import ObjectId
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
import bcrypt

from config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    JWT_ALGORITHM,
    JWT_SECRET,
    db,
)


def hash_password(password: str) -> str:
    pw_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pw_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    try:
        plain_bytes = plain.encode('utf-8')
        hashed_bytes = hashed.encode('utf-8')
        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception:
        return False


def create_access_token(sub: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {"sub": sub, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _extract_token(request: Request) -> Optional[str]:
    # 1) HttpOnly cookie (preferred — matches intermaven.io's cross-subdomain cookie strategy)
    token = request.cookies.get("access_token")
    if token:
        return token
    # 2) Authorization: Bearer <token>
    header = request.headers.get("Authorization")
    if header and header.startswith("Bearer "):
        return header.split(" ", 1)[1]
    return None


def get_current_user(request: Request) -> dict:
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    try:
        user = db.users.find_one({"_id": ObjectId(sub)})
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_optional_user(request: Request) -> Optional[dict]:
    """Same as get_current_user but returns None instead of raising."""
    try:
        return get_current_user(request)
    except HTTPException:
        return None


def require_admin(request: Request) -> dict:
    """Dependency: only allow users whose role == 'admin'.

    Until full RBAC ships, a user becomes admin simply by having
    ``role: 'admin'`` on their MongoDB ``users`` record. The admin
    bootstrap helper (``POST /api/admin/become-admin`` — sandbox only)
    flips a user's role for testing.
    """
    user = get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin role required")
    return user
