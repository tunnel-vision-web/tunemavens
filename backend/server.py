"""TuneMavens FastAPI app — Phase 1 (Foundation & Subdomains).

What lives here (and only here in Phase 1):
  - Health check
  - Auth (register / login / me / logout) — shares JWT_SECRET with intermaven.io
  - Dashboard layout persistence (§9.6)
  - Stubs for the §9.7 deal collections (no business logic yet)

Phases 2-10 layer on top of this foundation.
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, DB_NAME, MONGO_URL, db
from routes import admin_router, auth_router, dashboard_router, deals_router
from routes.admin_router import seed_domain_mappings_if_empty

app = FastAPI(title="TuneMavens API", version="0.1.0 (Phase 1)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(deals_router)
app.include_router(admin_router)

# Seed default domain mappings on first boot (idempotent).
seed_domain_mappings_if_empty()


@app.get("/api/health")
def health():
    """Liveness + Mongo sanity probe."""
    try:
        db.command("ping")
        mongo_ok = True
    except Exception as e:  # noqa: BLE001
        mongo_ok = False
        return {"status": "degraded", "mongo": False, "error": str(e), "db": DB_NAME}
    return {
        "status": "ok",
        "service": "tunemavens-api",
        "phase": 1,
        "mongo": mongo_ok,
        "db": DB_NAME,
        # mask credentials
        "mongo_host_set": bool(MONGO_URL),
    }


@app.get("/api/")
def root():
    return {"service": "tunemavens-api", "phase": 1, "ok": True}
