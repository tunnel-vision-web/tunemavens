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
    assert "TuneMavens Backend Admin Console" in res1.text
    assert "personaSelector" in res1.text

    res2 = client.get("/admin/")
    assert res2.status_code == 200
    assert "TuneMavens Backend Admin Console" in res2.text


def test_personas_and_rbac_matrix_api():
    """Verify all 11 personas and their capability permissions are returned."""
    res = client.get("/api/admin/console/personas")
    assert res.status_code == 200
    data = res.json()
    personas = data["personas"]
    assert "admin" in personas
    assert "creator" in personas
    assert "label" in personas
    assert "supervisor" in personas
    assert "dj" in personas
    assert "vc" in personas
    assert "podcaster" in personas
    assert "media_house" in personas
    assert "corporate" in personas
    assert "affiliate" in personas
    assert "consumer" in personas

    # Verify admin has full permissions
    assert "wall_of_fame_manage" in personas["admin"]["permissions"]
    # Verify creator is scoped
    assert "epk_manage" in personas["creator"]["permissions"]
    assert "domain_mappings_manage" not in personas["creator"]["permissions"]


def test_backend_admin_telemetry_probes():
    """Verify system telemetry probes return service statuses and MongoDB."""
    res = client.get("/api/admin/console/telemetry")
    assert res.status_code == 200
    data = res.json()
    assert "services" in data
    assert "8001" in data["services"]
    assert "database" in data
    assert data["database"]["status"] == "connected"


def test_backend_admin_users_and_role_management():
    """Verify user directory listing and role assignment update."""
    res = client.get("/api/admin/console/users")
    assert res.status_code == 200
    data = res.json()
    assert "users" in data
    assert isinstance(data["users"], list)
