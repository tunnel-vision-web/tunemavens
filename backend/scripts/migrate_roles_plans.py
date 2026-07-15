#!/usr/bin/env python
"""Database migration script for user roles and pricing plans.

Normalizes legacy roles and plans to the 7 canonical roles and 4 pricing tiers.
Can be run standalone: python scripts/migrate_roles_plans.py
"""
import os
import sys

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import db


def normalize_role(r: str) -> str:
    if not r:
        return "creator"
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


def normalize_plan(p: str) -> str:
    if not p:
        return "starter"
    p_lower = p.lower().strip()
    if p_lower in ("creator", "consumer", "starter"):
        return "starter"
    if p_lower in ("professional", "pro"):
        return "professional"
    if p_lower == "business":
        return "business"
    if p_lower == "enterprise":
        return "enterprise"
    return p_lower


def migrate():
    print("Starting database migration for user roles & plans...")
    users = list(db.users.find({}))
    print(f"Found {len(users)} users to migrate.")

    updated_count = 0
    for user in users:
        user_id = user["_id"]
        current_role = user.get("role", "creator")
        current_plan = user.get("plan", "starter")
        
        # 1. Normalize primary role
        new_role = normalize_role(current_role)
        
        # 2. Populate roles list
        existing_roles = user.get("roles", [])
        if not existing_roles:
            new_roles = [new_role]
        else:
            new_roles = list(set([normalize_role(r) for r in existing_roles]))
        
        # Ensure primary role is first
        if new_role not in new_roles:
            new_roles.insert(0, new_role)
            
        # 3. Normalize plan
        new_plan = normalize_plan(current_plan)
        
        # 4. Set pro_verified default
        pro_verified = user.get("pro_verified", False)

        # Update document
        db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "role": new_role,
                    "roles": new_roles,
                    "plan": new_plan,
                    "pro_verified": pro_verified,
                }
            }
        )
        updated_count += 1

    print(f"Migration completed. Successfully updated {updated_count} user profiles.")


if __name__ == "__main__":
    migrate()
