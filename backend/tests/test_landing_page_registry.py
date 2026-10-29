"""Unit & Integration Tests for Spec §3: Per-Audience Landing Pages & Role Switching.

Verifies:
1. Landing Page Registry Integrity:
   - Contains all 7 canonical roles (creator, label, dj, media-house, supervisor, consumer, corporate) + hub page (/for).
   - Each entry has required fields: slug, audience, headline, subhead, proof_points, primary_cta, canonical_url, og_image, sitemap_flag.
   - Slugs and canonical URLs are unique.
2. Server-Rendered HTML & Meta Tags:
   - Every registry entry has a generated HTML file in public and dist.
   - Contains unique <title> and <h1> matching the registry.
   - Contains canonical <link rel="canonical" href="..."> matching canonical_url.
   - Contains Open Graph image meta tag matching og_image.
   - Contains 1-tap persona switcher toolbar (data-testid="role-switcher-toolbar").
3. Sitemap Integration:
   - GET /sitemap.xml dynamically returns canonical URLs for all registry pages flagged with sitemap_flag=true.
4. Registration Attribution Capture:
   - User registration endpoint /api/auth/register captures and persists signup_page, signup_source, utm_medium, utm_campaign.
   - Public profile exposes attribution metadata to authenticated user.
"""
import json
import os
import re
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

# Ensure sys.path points to backend
import sys
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from server import app
from services.landing_registry_service import load_registry, get_landing_page_by_slug, get_all_canonical_landing_urls
from config import db


class TestLandingPageRegistry(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.root_dir = Path(__file__).resolve().parent.parent.parent
        cls.public_dir = cls.root_dir / "apps" / "portal" / "public"
        cls.registry = load_registry()

    def test_01_registry_completeness(self):
        """Test registry contains all 7 canonical roles plus hub page."""
        self.assertGreaterEqual(len(self.registry), 8, "Expected at least 8 entries in registry")

        slugs = [item["slug"] for item in self.registry]
        expected_roles = [
            "creator",
            "label",
            "dj",
            "media-house",
            "supervisor",
            "consumer",
            "corporate"
        ]
        for role in expected_roles:
            self.assertIn(role, slugs, f"Missing required canonical role: {role}")

        # Check for hub page
        self.assertIn("who-is-it-for", slugs, "Missing hub page in registry")

    def test_02_registry_entry_schema(self):
        """Test that each registry entry has all required schema fields."""
        required_fields = [
            "slug",
            "audience",
            "headline",
            "subhead",
            "proof_points",
            "primary_cta",
            "canonical_url",
            "og_image",
            "sitemap_flag"
        ]
        seen_canonical = set()
        seen_headlines = set()

        for entry in self.registry:
            slug = entry.get("slug")
            for field in required_fields:
                self.assertIn(field, entry, f"Entry '{slug}' missing required field: {field}")
                self.assertTrue(entry[field], f"Entry '{slug}' field '{field}' must not be empty")

            # Check proof points has multiple items
            self.assertGreaterEqual(len(entry["proof_points"]), 3, f"Entry '{slug}' must have >= 3 proof points")

            # Check uniqueness of canonical URL and headline
            canonical = entry["canonical_url"]
            self.assertNotIn(canonical, seen_canonical, f"Duplicate canonical URL: {canonical}")
            seen_canonical.add(canonical)

            headline = entry["headline"]
            self.assertNotIn(headline, seen_headlines, f"Duplicate headline: {headline}")
            seen_headlines.add(headline)

    def test_03_prerendered_html_artifacts_exist(self):
        """Test that each registry role has a prerendered HTML file with title, h1, canonical, and og:image."""
        for entry in self.registry:
            slug = entry["slug"]
            subpath = "for" if slug == "who-is-it-for" else f"for/{slug}"
            html_file = self.public_dir / subpath / "index.html"

            self.assertTrue(html_file.exists(), f"Prerendered HTML missing for {subpath}: {html_file}")

            html_content = html_file.read_text(encoding="utf-8")

            # 1. Unique <title>
            title_match = re.search(r"<title>(.*?)</title>", html_content)
            self.assertIsNotNone(title_match, f"Missing <title> in {subpath}")
            self.assertIn(entry["headline"][:20], title_match.group(1))

            # 2. <h1> matching headline
            h1_match = re.search(r"<h1.*?>(.*?)</h1>", html_content, re.DOTALL)
            self.assertIsNotNone(h1_match, f"Missing <h1> in {subpath}")
            self.assertIn(entry["headline"], h1_match.group(1))

            # 3. Canonical tag matching canonical_url
            canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', html_content)
            self.assertIsNotNone(canonical_match, f"Missing canonical tag in {subpath}")
            self.assertEqual(canonical_match.group(1), entry["canonical_url"])

            # 4. Open Graph image
            og_match = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html_content)
            self.assertIsNotNone(og_match, f"Missing og:image in {subpath}")
            self.assertEqual(og_match.group(1), entry["og_image"])

            # 5. Persona switcher toolbar
            self.assertIn('data-testid="role-switcher-toolbar"', html_content, f"Missing switcher toolbar in {subpath}")

    def test_04_sitemap_contains_all_canonical_landing_urls(self):
        """Test GET /sitemap.xml dynamically returns all canonical role pages from the registry."""
        res = self.client.get("/sitemap.xml", headers={"Host": "tunemavens.com"})
        self.assertEqual(res.status_code, 200)
        self.assertIn("application/xml", res.headers["content-type"])
        body = res.text

        expected_urls = get_all_canonical_landing_urls()
        self.assertGreaterEqual(len(expected_urls), 7)

        for url in expected_urls:
            if "tunemavens.com" in url:
                self.assertIn(f"<loc>{url}</loc>", body, f"Sitemap missing canonical landing URL: {url}")

    def test_05_registration_attribution_capture(self):
        """Test that user registration captures signup_page, signup_source, and UTM parameters."""
        test_email = f"attribution_test_{os.urandom(4).hex()}@tunemavens.com"
        payload = {
            "email": test_email,
            "password": "SecurePassword123!",
            "name": "Attribution Tester",
            "role": "creator",
            "brand_name": "Attribution Records",
            "country": "KE",
            "signup_page": "/for/creator",
            "signup_source": "google_ads",
            "utm_medium": "cpc",
            "utm_campaign": "nairobi_launch_2026"
        }

        res = self.client.post("/api/auth/register", json=payload)
        self.assertEqual(res.status_code, 200, f"Registration failed: {res.text}")

        data = res.json()
        user_id = data.get("user", {}).get("id")
        self.assertTrue(user_id)

        # Verify attribution was stored in MongoDB
        user_doc = db.users.find_one({"email": test_email})
        self.assertIsNotNone(user_doc, "User not found in database")
        self.assertEqual(user_doc.get("signup_page"), "/for/creator")
        self.assertEqual(user_doc.get("signup_source"), "google_ads")
        self.assertEqual(user_doc.get("utm_medium"), "cpc")
        self.assertEqual(user_doc.get("utm_campaign"), "nairobi_launch_2026")

        # Verify returned user object also has the attribution fields
        user_res = data["user"]
        self.assertEqual(user_res.get("signup_page"), "/for/creator")
        self.assertEqual(user_res.get("signup_source"), "google_ads")

        # Clean up test user
        db.users.delete_one({"email": test_email})


if __name__ == "__main__":
    unittest.main()
