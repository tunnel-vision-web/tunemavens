"""Configuration & Mongo connection for the TuneMavens backend.

Per DOCUMENTATION.md §9.1, this service shares its MongoDB and JWT_SECRET with
intermaven.io. Any user record created here is the same record intermaven.io sees,
and any JWT minted here is valid on intermaven.io (and vice versa).
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# --- Mongo (shared with intermaven.io) ---
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "intermaven")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL environment variable is not set")

_client = MongoClient(MONGO_URL)
db = _client[DB_NAME]

# --- JWT (shared with intermaven.io) ---
JWT_SECRET = os.environ.get("JWT_SECRET", "intermaven_secret_key")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

# --- Cookies (cross-subdomain capable) ---
COOKIE_DOMAIN = os.environ.get("COOKIE_DOMAIN") or None
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")

# --- CORS ---
_cors = os.environ.get("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in _cors.split(",")] if _cors != "*" else ["*"]
