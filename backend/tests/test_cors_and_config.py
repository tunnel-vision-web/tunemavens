"""Tests for FastAPI CORS preflight, CORS_ORIGINS merging, and split MONGO_* env var assembly."""
import importlib
import os
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient  # noqa: E402
from server import app  # noqa: E402


def test_cors_preflight_production_and_dev_origins():
    client = TestClient(app)
    origins = [
        "https://tunemavens.com",
        "https://www.tunemavens.com",
        "https://tunestream.co",
        "https://www.tunestream.co",
        "https://syncmavens.com",
        "https://www.syncmavens.com",
        "https://intermaven.io",
        "https://www.intermaven.io",
        "http://localhost:3000",
        "http://localhost:3005",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:9999",
    ]
    for origin in origins:
        res = client.options(
            "/api/auth/login",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "content-type",
            },
        )
        assert res.status_code == 200, f"Preflight failed for {origin}: {res.status_code} {res.text}"
        assert res.headers.get("access-control-allow-origin") == origin, (
            f"Expected access-control-allow-origin={origin}, got {res.headers.get('access-control-allow-origin')}"
        )
        assert res.headers.get("access-control-allow-credentials") == "true"


def test_cors_origins_env_merge_and_dedup():
    orig = os.environ.get("CORS_ORIGINS")
    try:
        os.environ["CORS_ORIGINS"] = "https://custom.tunemavens.com, https://tunemavens.com, https://preview.example.com"
        import config
        importlib.reload(config)
        assert "https://custom.tunemavens.com" in config.CORS_ORIGINS
        assert "https://preview.example.com" in config.CORS_ORIGINS
        assert "https://intermaven.io" in config.CORS_ORIGINS
        assert config.CORS_ORIGINS.count("https://tunemavens.com") == 1
    finally:
        if orig is None:
            os.environ.pop("CORS_ORIGINS", None)
        else:
            os.environ["CORS_ORIGINS"] = orig
        import config
        importlib.reload(config)


def test_split_mongo_env_assembly():
    saved = {k: os.environ.get(k) for k in ("ENV", "MONGO_URL", "MONGO_USER", "MONGO_PASSWORD", "MONGO_HOST", "MONGO_SCHEME", "MONGO_OPTIONS", "DB_NAME")}
    try:
        os.environ["ENV"] = "development"
        os.environ["MONGO_URL"] = "mongodb://fallback.invalid:27017"
        os.environ["MONGO_USER"] = "user@name"
        os.environ["MONGO_PASSWORD"] = "p@ss:word/123"
        os.environ["MONGO_HOST"] = "cluster0.example.mongodb.net"
        os.environ["DB_NAME"] = "intermaven"
        os.environ.pop("MONGO_SCHEME", None)
        os.environ.pop("MONGO_OPTIONS", None)

        import config
        importlib.reload(config)
        expected = "mongodb+srv://user%40name:p%40ss%3Aword%2F123@cluster0.example.mongodb.net/intermaven?retryWrites=true&w=majority"
        assert config.MONGO_URL == expected, f"Got {config.MONGO_URL}"
    finally:
        for k, v in saved.items():
            if v is None:
                os.environ.pop(k, None)
            else:
                os.environ[k] = v
        import config
        importlib.reload(config)


if __name__ == "__main__":
    test_cors_preflight_production_and_dev_origins()
    test_cors_origins_env_merge_and_dedup()
    test_split_mongo_env_assembly()
    print("All CORS & config tests passed!")
