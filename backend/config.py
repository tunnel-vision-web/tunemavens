"""Configuration & Mongo connection for the TuneMavens backend.

Per DOCUMENTATION.md §9.1, this service shares its MongoDB and JWT_SECRET with
intermaven.io. Any user record created here is the same record intermaven.io sees,
and any JWT minted here is valid on intermaven.io (and vice versa).
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient

# Explicitly load .env from backend directory first, then current working directory
backend_env = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=backend_env)
load_dotenv()

# --- Environment & Security Guards (Technical Foundation Spec §5.1) ---
ENV = os.environ.get("ENV", "development").lower()
ENABLE_SANDBOX_BYPASS = os.environ.get("ENABLE_SANDBOX_BYPASS", "false").lower() == "true"
ALLOW_SANDBOX_WEBHOOKS = os.environ.get("ALLOW_SANDBOX_WEBHOOKS", "false").lower() == "true"

# --- Mongo (shared with intermaven.io) ---
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "intermaven")
DATABASE_MODE = "mongodb"

if not MONGO_URL:
    if ENV == "production":
        raise RuntimeError(
            "FATAL CONFIGURATION ERROR: MONGO_URL is missing in production! "
            "Production systems must connect to a persistent MongoDB instance and must never fall back to an in-memory mock database."
        )
    import mongomock
    _client = mongomock.MongoClient()
    db = _client[DB_NAME]
    DATABASE_MODE = "mock"
else:
    try:
        _client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
        _client.admin.command('ping')
        db = _client[DB_NAME]
        DATABASE_MODE = "mongodb"
    except Exception as e:
        if ENV == "production":
            raise RuntimeError(
                f"FATAL CONFIGURATION ERROR: Failed to connect to MongoDB in production: {e}. "
                "Production systems must not fall back to an in-memory mock database."
            )
        import mongomock
        _client = mongomock.MongoClient()
        db = _client[DB_NAME]
        DATABASE_MODE = "mock"

# --- JWT (shared with intermaven.io) ---
JWT_SECRET = os.environ.get("JWT_SECRET", "intermaven_secret_key")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

# --- Cookies (cross-subdomain capable) ---
COOKIE_DOMAIN = os.environ.get("COOKIE_DOMAIN") or None
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")

# --- CORS ---
_default_trusted_origins = [
    "https://tunemavens.com",
    "https://www.tunemavens.com",
    "https://syncmavens.com",
    "https://www.syncmavens.com",
    "https://tunestream.co",
    "https://www.tunestream.co",
    "https://intermaven.io",
    "https://www.intermaven.io",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]
_cors = os.environ.get("CORS_ORIGINS")
if _cors and _cors != "*":
    # Parse explicit env origins and ensure all ecosystem trusted domains are present
    env_origins = [o.strip() for o in _cors.split(",") if o.strip()]
    merged = list(env_origins)
    for origin in _default_trusted_origins:
        if origin not in merged:
            merged.append(origin)
    CORS_ORIGINS = merged
elif _cors == "*":
    CORS_ORIGINS = ["*"]
else:
    CORS_ORIGINS = _default_trusted_origins


def validate_production_security():
    """Startup verification: ensures insecure sandbox endpoints, bypasses,
    default JWT secrets, wildcard CORS, insecure cookies, and mock databases
    cannot run under production configuration (Technical Foundation Spec §5.1, Rows 8 & 9).
    """
    if ENV == "production":
        if ENABLE_SANDBOX_BYPASS:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: ENABLE_SANDBOX_BYPASS is set to True in production! "
                "Production systems must not allow unverified checkout bypass."
            )
        if ALLOW_SANDBOX_WEBHOOKS:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: ALLOW_SANDBOX_WEBHOOKS is set to True in production! "
                "Production webhooks must strictly require cryptographic signature validation."
            )
        if DATABASE_MODE != "mongodb" or not MONGO_URL:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: In-memory mock database is active in production! "
                "Production systems must connect to a verified MongoDB instance."
            )
        INSECURE_SECRETS = {"intermaven_secret_key", "secret", "changeme", "default_secret", ""}
        if not JWT_SECRET or JWT_SECRET in INSECURE_SECRETS or len(JWT_SECRET) < 32:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: Production JWT_SECRET is unset, weak, or matches the public default! "
                "Production must use a high-entropy secret of at least 32 characters."
            )
        if not CORS_ORIGINS or "*" in CORS_ORIGINS:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: CORS_ORIGINS contains wildcard '*' or is empty in production! "
                "Production systems must specify explicit trusted domain origins."
            )
        if not COOKIE_SECURE:
            raise RuntimeError(
                "FATAL CONFIGURATION ERROR: COOKIE_SECURE is False in production! "
                "Production cookies must be served over HTTPS with Secure=True."
            )


# Execute security check on configuration import
validate_production_security()
