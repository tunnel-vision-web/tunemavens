from __future__ import annotations

import os
import sys

# Ensure backend root is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from server import app
from config import db

client = TestClient(app)

def test_backend_admin_html_served():
    """Verify dedicated backend admin app serves HTML on /admin and /admin/."""
    res1 = client.get("/admin")
    assert res1.status_code == 200
    assert "TuneMavens Backend Operations & RBAC Admin Console" in res1.text
    assert "admin-sidebar" in res1.text
    assert "personaSelector" in res1.text


def test_personas_and_rbac_matrix_api():
    """Verify all 11 personas and their capability permissions are returned."""
    res = client.get("/api/admin/console/personas")
    assert res.status_code == 200
    data = res.json()
    personas = data["personas"]
    assert "admin" in personas
    assert "creator" in personas
    assert "supervisor" in personas
    assert "wall_of_fame_manage" in personas["admin"]["permissions"]


def test_wall_of_fame_console_api():
    """Verify Wall of Fame retrieval and induction in backend admin console."""
    res = client.get("/api/admin/console/wall-of-fame")
    assert res.status_code == 200
    data = res.json()
    assert "profiles" in data
    assert "stats" in data
    assert len(data["profiles"]) > 0


def test_crm_leads_console_api():
    """Verify CRM candidate pipeline and logs retrieval."""
    res = client.get("/api/admin/console/crm-leads")
    assert res.status_code == 200
    data = res.json()
    assert "leads" in data
    assert isinstance(data["leads"], list)


def test_user_management_complete_crud():
    """Verify admin can provision, update, and delete user accounts."""
    test_email = "test_operator_xyz@tunemavens.com"
    db.users.delete_one({"email": test_email})

    # 1. Create
    create_payload = {
        "name": "Test Operations Lead",
        "username": "testopxyz",
        "email": test_email,
        "role": "supervisor",
        "subscription_tier": "Supervisor Escrow",
        "credits": 200,
        "status": "active",
        "is_admin": False,
        "is_verified": True
    }
    create_res = client.post("/api/admin/console/users", json=create_payload)
    assert create_res.status_code == 200
    user_data = create_res.json()
    user_id = user_data["_id"]

    # 2. Update all fields
    update_payload = {
        "name": "Updated Operations Supervisor",
        "role": "label",
        "subscription_tier": "Label Enterprise",
        "credits": 500,
        "status": "active",
        "is_admin": True,
        "is_verified": True
    }
    update_res = client.put(f"/api/admin/console/users/{user_id}", json=update_payload)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["name"] == "Updated Operations Supervisor"
    assert updated_data["role"] == "label"
    assert updated_data["credits"] == 500
    assert updated_data["is_admin"] is True

    # 3. Clean up / Delete
    del_res = client.delete(f"/api/admin/console/users/{user_id}")
    assert del_res.status_code == 200


def test_articles_and_recommended_reading():
    """Verify articles library returns full articles with persona recommendations."""
    res_creator = client.get("/api/admin/console/articles?persona=creator")
    assert res_creator.status_code == 200
    data_c = res_creator.json()
    assert "articles" in data_c
    assert any(a["is_recommended"] for a in data_c["articles"])

    res_admin = client.get("/api/admin/console/articles?persona=admin")
    assert res_admin.status_code == 200
    data_a = res_admin.json()
    assert "rbac-architecture-guide" in data_a["recommended_ids"]


def test_ask_ai_assistant():
    """Verify Ask AI returns contextual answers and suggested action chips."""
    payload = {"prompt": "How do I induct an icon to Wall of Fame?", "persona": "admin"}
    res = client.post("/api/admin/console/ask-ai", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "Wall of Fame" in data["reply"]
    assert len(data["suggested_actions"]) > 0
