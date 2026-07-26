"""Intermaven Network FastAPI Server — Core Production Entrypoint.

Handles multi-domain API routing, Sentry monitoring, CORS policies,
health check probes, and SEO sitemap routing.
"""
import os
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from config import CORS_ORIGINS, DB_NAME, MONGO_URL, db
from routes import (
    admin_router, auth_router, contracts_router, dashboard_router,
    deals_router, users_router, sso_router, payments_router,
    ticketing_router, storefront_router, distro_router, stream_router,
    match_router, social_ai_router, crm_router, cms_router, seo_router,
    djpool_router, storage_router
)
from routes.admin_router import seed_domain_mappings_if_empty

logger = logging.getLogger(__name__)

# Sentry SDK Initialization
sentry_dsn = os.environ.get("SENTRY_DSN")
if sentry_dsn:
    try:
        import sentry_sdk
        sentry_sdk.init(
            dsn=sentry_dsn,
            traces_sample_rate=1.0,
        )
        logger.info("Sentry monitoring initialized successfully.")
    except Exception as e:
        logger.warning(f"Failed to initialize Sentry: {e}")

app = FastAPI(title="Intermaven Network Unified API", version="1.0.0")

# Mount static uploads directory for media fallbacks
uploads_dir = os.environ.get("LOCAL_UPLOADS_DIR", "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

ENV = os.environ.get("ENV", "development")
cors_origins = CORS_ORIGINS
if ENV == "production" and "*" in cors_origins:
    cors_origins = [
        "https://tunemavens.com",
        "https://syncmavens.com",
        "https://tunestream.co",
        "https://intermaven.io"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(auth_router)
app.include_router(sso_router)
app.include_router(users_router)
app.include_router(contracts_router)
app.include_router(dashboard_router)
app.include_router(deals_router)
app.include_router(admin_router)
app.include_router(payments_router)
app.include_router(ticketing_router)
app.include_router(storefront_router)
app.include_router(distro_router)
app.include_router(stream_router)
app.include_router(match_router)
app.include_router(social_ai_router)
app.include_router(crm_router)
app.include_router(cms_router)
app.include_router(seo_router)
app.include_router(djpool_router)
app.include_router(storage_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logging.getLogger("uvicorn").error(f"VALIDATION ERROR: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


# Seed default domain mappings on boot
seed_domain_mappings_if_empty()


@app.get("/api/health")
@app.get("/health")
def health():
    """Liveness + Mongo sanity probe + Sentry monitoring check."""
    try:
        db.command("ping")
        mongo_ok = True
    except Exception as e:
        mongo_ok = False
        return {"status": "degraded", "mongo": False, "error": str(e), "db": DB_NAME}
    return {
        "status": "ok",
        "service": "intermaven-network-api",
        "mongo": mongo_ok,
        "db": DB_NAME,
        "sentry_enabled": bool(os.environ.get("SENTRY_DSN")),
        "uptime_monitoring": "active",
        "mongo_host_set": bool(MONGO_URL),
    }


@app.get("/ping")
def ping():
    """Lightweight ping endpoint for UptimeRobot monitoring."""
    return {"status": "pong", "service": "intermaven-api", "network": "online"}


@app.get("/api/")
def root():
    return {"service": "intermaven-network-api", "version": "1.0.0", "ok": True}
