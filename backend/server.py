"""Intermaven Network FastAPI Server — Core Production Entrypoint.

Handles multi-domain API routing, Sentry monitoring, CORS policies,
health check probes, and SEO sitemap routing.
"""
import os
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import HTMLResponse, JSONResponse

from config import CORS_ORIGINS, DB_NAME, MONGO_URL, db, validate_production_security, DATABASE_MODE
from routes import (
    admin_router, auth_router, contracts_router, dashboard_router,
    deals_router, users_router, sso_router, payments_router,
    ticketing_router, storefront_router, distro_router, stream_router,
    match_router, social_ai_router, crm_router, cms_router, seo_router,
    djpool_router, storage_router, epk_router, catalog_router,
    corporate_ads_router, role_tiers_router, support_router, blog_router,
    affiliate_router, tours_router, vc_router, events_router, podcasts_router,
    publishing_router, confidentiality_router, social_graph_router,
    community_router, backend_admin_router, media_house_router, dj_mixes_router, dj_mixes_alias_router
)
from routes.communications_router import router as communications_router
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

# Security verification: abort startup if invalid environment configurations detected
validate_production_security()

# Mount static uploads directory for media fallbacks
uploads_dir = os.environ.get("LOCAL_UPLOADS_DIR")
if not uploads_dir:
    if os.path.exists("backend/uploads"):
        uploads_dir = "backend/uploads"
    elif os.path.exists("uploads"):
        uploads_dir = "uploads"
    else:
        uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# Audio streaming route: serves static audio file from local disk or S3/R2, else delegates to stream router (returns 404 if missing)
@app.api_route("/uploads/audio/{filename:path}", methods=["GET", "HEAD"])
@app.api_route("/api/uploads/audio/{filename:path}", methods=["GET", "HEAD"])
def stream_upload_audio_file(filename: str, request: Request):
    """Serves static audio file if on disk or S3/R2, else delegates to stream router."""
    import re as _re
    from routes.stream_router import stream_catalog_track
    from fastapi.responses import FileResponse, RedirectResponse
    from pathlib import Path
    safe_name = os.path.basename(filename)
    for sdir in [uploads_dir, os.path.join(uploads_dir, "audio"), "uploads/audio", "backend/uploads/audio"]:
        p = os.path.join(sdir, safe_name)
        if os.path.exists(p) and os.path.isfile(p) and os.path.getsize(p) > 1024:
            ext = Path(p).suffix.lower()
            media_type = "audio/wav" if ext == ".wav" else ("audio/flac" if ext == ".flac" else "audio/mpeg")
            return FileResponse(p, media_type=media_type)
    try:
        from services.s3_storage import storage as _s3_storage
        s3_url = _s3_storage.get_stream_url(f"audio/{safe_name}")
        if s3_url:
            return RedirectResponse(url=s3_url)
    except Exception:
        pass
    clean_name = _re.sub(r"\.(wav|mp3|flac|ogg|m4a|aac|aiff)$", "", filename, flags=_re.IGNORECASE)
    return stream_catalog_track(clean_name, request=request)


@app.api_route("/uploads/artwork/{filename:path}", methods=["GET", "HEAD"])
@app.api_route("/api/uploads/artwork/{filename:path}", methods=["GET", "HEAD"])
def serve_upload_artwork_file(filename: str):
    """Serves uploaded artwork if on disk, else falls back to a bundled high-res retina cover."""
    from fastapi.responses import FileResponse, RedirectResponse
    safe_name = os.path.basename(filename)
    candidate_paths = [
        os.path.join(uploads_dir, "artwork", safe_name),
        os.path.join("uploads", "artwork", safe_name),
        os.path.join("backend", "uploads", "artwork", safe_name),
    ]
    for p in candidate_paths:
        if os.path.exists(p) and os.path.isfile(p):
            return FileResponse(p)
    # Fallback to bundled retina artwork if file was uploaded on an older ephemeral container
    fallback_dirs = [
        os.path.join(uploads_dir, "ai_assets"),
        os.path.join(uploads_dir, "headers"),
        os.path.join(uploads_dir, "heroes"),
    ]
    for fdir in fallback_dirs:
        if os.path.exists(fdir):
            imgs = sorted([f for f in os.listdir(fdir) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))])
            if imgs:
                pick = imgs[abs(hash(safe_name)) % len(imgs)]
                return FileResponse(os.path.join(fdir, pick))
    return RedirectResponse(url="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80")


app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
app.mount("/api/uploads", StaticFiles(directory=uploads_dir), name="api_uploads")

headers_dir = os.path.join(uploads_dir, "headers")
os.makedirs(headers_dir, exist_ok=True)
app.mount("/headers", StaticFiles(directory=headers_dir), name="headers")
app.mount("/api/headers", StaticFiles(directory=headers_dir), name="api_headers")

heroes_dir = os.path.join(uploads_dir, "heroes")
os.makedirs(heroes_dir, exist_ok=True)
app.mount("/heroes", StaticFiles(directory=heroes_dir), name="heroes")
app.mount("/api/heroes", StaticFiles(directory=heroes_dir), name="api_heroes")

ENV = os.environ.get("ENV", "development")
default_production_origins = [
    "https://tunemavens.com",
    "https://www.tunemavens.com",
    "https://syncmavens.com",
    "https://www.syncmavens.com",
    "https://tunestream.co",
    "https://www.tunestream.co",
    "https://intermaven.io",
    "https://www.intermaven.io",
]
_base_origins = list(CORS_ORIGINS) if CORS_ORIGINS != ["*"] else []
cors_origins = list(dict.fromkeys(_base_origins + default_production_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.onrender\.com|https://.*\.tunemavens\.com|https://.*\.tunestream\.co|https://.*\.syncmavens\.com|https://.*\.intermaven\.io|http://127\.0\.0\.1(:\d+)?",
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
app.include_router(epk_router)
app.include_router(catalog_router)
app.include_router(corporate_ads_router)
app.include_router(role_tiers_router)
app.include_router(support_router)
app.include_router(blog_router)
app.include_router(affiliate_router)
app.include_router(tours_router)
app.include_router(vc_router)
app.include_router(events_router)
app.include_router(podcasts_router)
app.include_router(publishing_router)
app.include_router(communications_router)
app.include_router(confidentiality_router)
app.include_router(social_graph_router)
app.include_router(community_router)
app.include_router(backend_admin_router)
app.include_router(media_house_router)
app.include_router(dj_mixes_router)
app.include_router(dj_mixes_alias_router)


@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    """Handles HTTP exceptions, rendering helpful HTML 404 pages for browsers and crawlers (Spec §2 R2.5)."""
    if exc.status_code == 404:
        accept_header = request.headers.get("accept", "")
        if "text/html" in accept_header:
            html_content = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>404 — Page Not Found | TuneMavens</title>
  <meta name="robots" content="noindex, follow">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #0b0f19; color: #f1f5f9; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
    .card { max-width: 480px; padding: 40px; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; background: rgba(255,255,255,0.02); }
    h1 { color: #00f0ff; font-size: 56px; margin: 0 0 12px 0; }
    p { color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    a { display: inline-block; background: #00f0ff; color: #0b0f19; padding: 12px 24px; border-radius: 6px; font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The requested route or frequency does not exist. Check the URL or return to the platform homepage.</p>
    <a href="/">Return to TuneMavens</a>
  </div>
</body>
</html>"""
            return HTMLResponse(content=html_content, status_code=404)
        return JSONResponse(status_code=404, content={"detail": "Not Found", "status_code": 404})

    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


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
        return {"status": "degraded", "mongo": False, "database_mode": DATABASE_MODE, "error": str(e), "db": DB_NAME}
    return {
        "status": "ok",
        "service": "intermaven-network-api",
        "mongo": mongo_ok,
        "database_mode": DATABASE_MODE,
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
