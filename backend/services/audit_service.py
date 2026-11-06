"""Audit Logging & Row-Level Authorization Service.

Implements Technical Foundation Spec §7:
- Audit log: Records admin actions, stem downloads, agreement views, and payout changes.
- Row-level tenant isolation: Verifies that creators can only access their own drafts,
  splits, earnings, and agreements (preventing cross-tenant leakage).
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from bson import ObjectId
from fastapi import HTTPException, Request, status

from config import db

logger = logging.getLogger("audit_service")


def log_audit_event(
    actor_id: str,
    actor_role: str,
    action: str,
    resource_type: str,
    resource_id: str,
    ip_address: str = "127.0.0.1",
    user_agent: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Records an immutable audit event in db.audit_logs (Spec §7).

    Covered actions: admin actions, audio stem downloads, agreement views, payout changes.
    """
    event = {
        "actor_id": str(actor_id),
        "actor_role": actor_role,
        "action": action,
        "resource_type": resource_type,
        "resource_id": str(resource_id),
        "ip_address": ip_address,
        "user_agent": user_agent or "Unknown",
        "metadata": metadata or {},
        "timestamp": datetime.now(timezone.utc),
    }

    try:
        res = db.audit_logs.insert_one(event)
        event["_id"] = str(res.inserted_id)
    except Exception as e:
        logger.warning(f"Failed to record audit event to DB: {e}")

    logger.info(f"[Audit Log] {actor_role}:{actor_id} performed '{action}' on {resource_type}:{resource_id}")
    return event


def verify_row_level_access(
    resource_doc: Dict[str, Any],
    current_user: Dict[str, Any],
    owner_field: str = "creator_id",
    allowed_roles: Optional[list] = None,
) -> bool:
    """Enforces row-level isolation so one creator can never read another's drafts, splits, or earnings (Spec §7).

    Raises HTTP 403 Forbidden on violation.
    """
    user_id = str(current_user.get("_id", ""))
    user_role = current_user.get("role", "")
    is_admin = user_role == "admin" or current_user.get("is_admin") is True

    if is_admin:
        return True

    if allowed_roles and user_role in allowed_roles:
        return True

    # Owner comparison
    owner_id = str(
        resource_doc.get(owner_field)
        or resource_doc.get("user_id")
        or resource_doc.get("owner_id")
        or ""
    )

    if not owner_id or owner_id != user_id:
        # Also check invitees/collaborators list if present
        collaborators = [str(c.get("user_id") or c.get("email") or "") for c in resource_doc.get("collaborators", [])]
        user_email = current_user.get("email", "")
        if user_id in collaborators or user_email in collaborators:
            return True

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have permission to view or mutate this private creator record."
        )

    return True
