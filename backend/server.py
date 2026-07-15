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
from fastapi.staticfiles import StaticFiles
import os

from config import CORS_ORIGINS, DB_NAME, MONGO_URL, db
from routes import admin_router, auth_router, contracts_router, dashboard_router, deals_router, users_router, sso_router, payments_router, ticketing_router, storefront_router, distro_router, stream_router, match_router, social_ai_router, crm_router, cms_router
from routes.admin_router import seed_domain_mappings_if_empty

app = FastAPI(title="TuneMavens API", version="0.1.0 (Phase 1)")

# Mount static files folder for local upload fallbacks
uploads_dir = os.environ.get("LOCAL_UPLOADS_DIR", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sso_router)
app.include_router(payments_router)
app.include_router(ticketing_router)
app.include_router(storefront_router)
app.include_router(distro_router)
app.include_router(stream_router)
app.include_router(match_router)
app.include_router(social_ai_router)
app.include_router(crm_router)
app.include_router(cms_router)
app.include_router(dashboard_router)
app.include_router(deals_router)
app.include_router(admin_router)
app.include_router(users_router)
app.include_router(contracts_router)

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
