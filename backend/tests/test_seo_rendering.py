"""Automated Test Suite for SEO, Sitemaps, Robots.txt & Prerendering.

Validates all requirements and acceptance criteria in Technical Foundation Spec §2 (R2.1 - R2.6):
1. /sitemap.xml returns valid application/xml content-type and valid XML structure.
2. /sitemap.xml adapts to the Host header (tunemavens.com, tunestream.co, syncmavens.com).
3. /robots.txt exists, returns HTTP 200 with text/plain, allows public routes, disallows /app/ and /api/.
4. /robots.txt references the host's own canonical sitemap.xml.
5. Unknown routes return real HTTP 404 with a helpful error page.
6. Structured data JSON-LD endpoint returns Organization and WebSite schema.
7. Consent gate on structured data prevents unapproved catalog exposure.
8. Prerendered HTML files contain real <h1> tags, canonical links, and Open Graph tags.
"""
from datetime import datetime, timezone
import os
import sys
import xml.etree.ElementTree as ET

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from server import app
from config import db

client = TestClient(app)


def run_seo_tests():
    print("==================================================")
    print("RUNNING SEO, SITEMAP & CRAWLABILITY (SPEC §2) TESTS")
    print("==================================================")
    passed = 0
    failed = 0

    # ------------------------------------------------------------------
    # Test 1: /sitemap.xml is valid XML and returns application/xml
    # ------------------------------------------------------------------
    print("Test 1: Verifying /sitemap.xml content-type and XML validity...")
    res = client.get("/sitemap.xml", headers={"Host": "tunemavens.com"})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    content_type = res.headers.get("content-type", "")
    assert "application/xml" in content_type, f"Expected application/xml, got {content_type}"

    # Verify XML can be parsed by ElementTree
    root = ET.fromstring(res.content)
    assert "urlset" in root.tag, f"Expected <urlset> root tag, got {root.tag}"
    urls = root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url")
    assert len(urls) > 0, "No <url> elements found in sitemap"

    # Verify canonical URLs and lastmod
    first_loc = urls[0].find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text
    first_lastmod = urls[0].find("{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod").text
    assert "https://tunemavens.com" in first_loc, f"Expected https://tunemavens.com in loc, got {first_loc}"
    assert len(first_lastmod) == 10, f"Expected YYYY-MM-DD lastmod, got {first_lastmod}"
    print(f"  [PASS] /sitemap.xml valid application/xml with {len(urls)} canonical URLs. First loc: {first_loc}")
    passed += 1

    # ------------------------------------------------------------------
    # Test 2: Host-aware sitemaps (tunestream.co and syncmavens.com)
    # ------------------------------------------------------------------
    print("Test 2: Verifying host-aware sitemap for tunestream.co and syncmavens.com...")
    res_ts = client.get("/sitemap.xml", headers={"Host": "tunestream.co"})
    assert res_ts.status_code == 200
    assert "https://tunestream.co" in res_ts.text
    assert "tunemavens.com/for-creators" not in res_ts.text

    res_sm = client.get("/sitemap.xml", headers={"Host": "syncmavens.com"})
    assert res_sm.status_code == 200
    assert "https://syncmavens.com" in res_sm.text
    print("  [PASS] Multi-host sitemaps dynamically isolate platform routes per domain.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 3: /robots.txt exists, returns 200, and is text/plain
    # ------------------------------------------------------------------
    print("Test 3: Verifying /robots.txt exists and specifies crawler guidelines...")
    res_rob = client.get("/robots.txt", headers={"Host": "tunemavens.com"})
    assert res_rob.status_code == 200
    assert "text/plain" in res_rob.headers.get("content-type", "")
    rob_text = res_rob.text
    assert "Allow: /" in rob_text
    assert "Disallow: /app/" in rob_text
    assert "Disallow: /api/" in rob_text
    assert "Sitemap: https://tunemavens.com/sitemap.xml" in rob_text
    print("  [PASS] /robots.txt exists, allows public pages, disallows /app and /api, references sitemap.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 4: Host-aware robots.txt
    # ------------------------------------------------------------------
    print("Test 4: Verifying host-aware robots.txt for tunestream.co...")
    res_ts_rob = client.get("/robots.txt", headers={"Host": "tunestream.co"})
    assert res_ts_rob.status_code == 200
    assert "Sitemap: https://tunestream.co/sitemap.xml" in res_ts_rob.text
    print("  [PASS] Host-aware robots.txt references correct domain sitemap.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 5: Unknown routes return a real 404 (not a soft 200)
    # ------------------------------------------------------------------
    print("Test 5: Verifying unknown routes return HTTP 404 with helpful page...")
    res_404 = client.get("/no-such-page-xyz", headers={"Accept": "text/html"})
    assert res_404.status_code == 404, f"Expected 404, got {res_404.status_code}"
    assert "404" in res_404.text
    assert "Page Not Found" in res_404.text

    # JSON request to unknown route
    res_404_json = client.get("/no-such-page-xyz", headers={"Accept": "application/json"})
    assert res_404_json.status_code == 404
    assert res_404_json.json()["detail"] == "Not Found"
    print("  [PASS] Unknown routes return HTTP 404 (soft-404 eliminated).")
    passed += 1

    # ------------------------------------------------------------------
    # Test 6: Structured Data JSON-LD Schema
    # ------------------------------------------------------------------
    print("Test 6: Verifying JSON-LD Organization & WebSite schema...")
    res_schema = client.get("/api/seo/schema", headers={"Host": "tunemavens.com"})
    assert res_schema.status_code == 200
    schema_data = res_schema.json()
    assert "@graph" in schema_data
    types = [item["@type"] for item in schema_data["@graph"]]
    assert "Organization" in types
    assert "WebSite" in types
    print("  [PASS] JSON-LD schema correctly defines Organization and WebSite graph.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 7: Consent Gate on Structured Data
    # ------------------------------------------------------------------
    print("Test 7: Verifying consent gate on MusicGroup / MusicRecording schema...")
    # Seed artist without public consent
    test_slug = "private_artist_99"
    db.users.delete_many({"username": test_slug})
    db.users.insert_one({
        "username": test_slug,
        "name": "Secret Artist",
        "role": "creator",
        "public_listing": False
    })
    res_private = client.get(f"/api/seo/schema/artist/{test_slug}")
    assert res_private.status_code == 403, f"Expected 403 for private artist, got {res_private.status_code}"

    # Seed artist with public consent
    test_slug_pub = "public_artist_99"
    db.users.delete_many({"username": test_slug_pub})
    db.users.insert_one({
        "username": test_slug_pub,
        "name": "Public Artist",
        "role": "creator",
        "public_listing": True
    })
    res_pub = client.get(f"/api/seo/schema/artist/{test_slug_pub}")
    assert res_pub.status_code == 200
    assert res_pub.json()["@type"] == "MusicGroup"
    print("  [PASS] Consent gate strictly enforced for MusicGroup schema.")
    passed += 1

    # ------------------------------------------------------------------
    # Test 8: Prerendered Static HTML Files
    # ------------------------------------------------------------------
    print("Test 8: Verifying prerendered HTML contains <h1> and Open Graph tags...")
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    portal_pricing = os.path.join(root_dir, "apps", "portal", "public", "pricing", "index.html")
    assert os.path.exists(portal_pricing), f"Prerendered pricing file missing at {portal_pricing}"

    with open(portal_pricing, "r", encoding="utf-8") as f:
        pricing_html = f.read()

    # Spec Page 3 acceptance: curl -s https://www.tunemavens.com/ | grep -c "<h1"
    h1_count = pricing_html.count("<h1")
    assert h1_count >= 1, f"Expected at least 1 <h1> in prerendered HTML, found {h1_count}"
    assert "og:title" in pricing_html
    assert "og:image" in pricing_html
    assert "twitter:card" in pricing_html
    assert "canonical" in pricing_html
    print(f"  [PASS] Prerendered HTML verified (Found {h1_count} <h1>, complete Open Graph, Twitter cards & canonical).")
    passed += 1

    print("==================================================")
    print(f"ALL SEO & RENDERING TESTS PASSED: {passed}/{passed}")
    print("==================================================")
    return passed, failed


if __name__ == "__main__":
    passed, failed = run_seo_tests()
    if failed > 0:
        sys.exit(1)
    sys.exit(0)
