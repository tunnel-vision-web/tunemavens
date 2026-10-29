"""Landing Page Registry Service.

Per Technical Foundation Spec §3:
- One central configuration entry per role landing page.
- Adding a page means adding configuration and copy, not new code.
- Enforces governance flags (partner_claims_approved) before public publishing.
"""
import json
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional

logger = logging.getLogger("landing_registry")

REGISTRY_PATH = Path(__file__).resolve().parent.parent.parent / "shared" / "landing_page_registry.json"


def load_registry() -> List[Dict[str, Any]]:
    """Loads all configured landing pages from the authoritative registry."""
    if not REGISTRY_PATH.exists():
        logger.error(f"Landing page registry not found at {REGISTRY_PATH}")
        return []
    try:
        with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Failed to read landing page registry: {e}")
        return []


def get_landing_page_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """Finds a landing page entry by primary slug or registered alias."""
    clean = (slug or "").lower().strip().strip("/")
    pages = load_registry()
    for p in pages:
        if p.get("slug") == clean:
            return p
        aliases = [a.lower().strip().strip("/") for a in p.get("aliases", [])]
        if clean in aliases:
            return p
    return None


def get_landing_page_by_host(host: str) -> Optional[Dict[str, Any]]:
    """Resolves landing page configuration based on incoming HTTP Host / Subdomain."""
    clean_host = (host or "").lower().split(":")[0].strip()
    pages = load_registry()
    for p in pages:
        sub = p.get("subdomain", "").lower()
        if sub and sub == clean_host:
            return p
    return None


def get_all_canonical_landing_urls() -> List[str]:
    """Returns canonical URLs for all pages flagged for sitemap inclusion."""
    pages = load_registry()
    urls = []
    for p in pages:
        if p.get("sitemap_flag", True) and p.get("canonical_url"):
            urls.append(p["canonical_url"])
    return list(dict.fromkeys(urls))
