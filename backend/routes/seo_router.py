"""SEO, Sitemaps, Robots.txt & Open Graph Router.

Per Technical Foundation Spec §2 (R2.1 - R2.6):
- Host-specific sitemap.xml: tunemavens.com, tunestream.co, syncmavens.com, and role subdomains.
- XML sitemaps strictly served as application/xml with canonical 200 URLs and lastmod ISO timestamps.
- Host-specific robots.txt: allows public routes, disallows /app/ and /api/, references host sitemap.
- Structured JSON-LD schema for Organization, WebSite, and consent-gated MusicGroup/MusicRecording.
- Fallback server-side HTML rendering for social preview bots and link unfurlers (WhatsApp, Twitterbot).
"""
from datetime import datetime, timezone
import logging
from typing import Optional
from fastapi import APIRouter, Header, HTTPException, Request, Response
from config import db

logger = logging.getLogger("seo_router")

router = APIRouter(tags=["SEO"])


def _get_host_and_scheme(request: Request) -> tuple[str, str]:
    """Extracts normalized hostname and canonical scheme (strictly https)."""
    forwarded_host = request.headers.get("x-forwarded-host")
    host = forwarded_host or request.headers.get("host") or "tunemavens.com"
    host = host.split(":")[0].lower()
    return host, "https"


# Public canonical routes per platform host
HOST_ROUTES = {
    "tunemavens.com": [
        {"path": "", "changefreq": "daily", "priority": "1.0"},
        {"path": "/for-creators", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-labels", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-djs", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-mediahouses", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-producers", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-supervisors", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/for-corporate", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/pricing", "changefreq": "weekly", "priority": "0.9"},
        {"path": "/about", "changefreq": "monthly", "priority": "0.7"},
        {"path": "/publishing", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/distribution", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/sync-placement", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/help", "changefreq": "monthly", "priority": "0.6"},
    ],
    "tunestream.co": [
        {"path": "", "changefreq": "daily", "priority": "1.0"},
        {"path": "/browse", "changefreq": "daily", "priority": "0.9"},
        {"path": "/charts", "changefreq": "daily", "priority": "0.8"},
        {"path": "/artists", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/about", "changefreq": "monthly", "priority": "0.7"},
        {"path": "/help", "changefreq": "monthly", "priority": "0.6"},
    ],
    "syncmavens.com": [
        {"path": "", "changefreq": "daily", "priority": "1.0"},
        {"path": "/briefs", "changefreq": "daily", "priority": "0.9"},
        {"path": "/catalog", "changefreq": "daily", "priority": "0.9"},
        {"path": "/licensing", "changefreq": "weekly", "priority": "0.8"},
        {"path": "/about", "changefreq": "monthly", "priority": "0.7"},
        {"path": "/help", "changefreq": "monthly", "priority": "0.6"},
    ]
}


@router.get("/sitemap.xml")
def get_sitemap(request: Request):
    """Generates host-aware XML sitemap conforming to Sitemaps.org standard.

    Per Spec §2 (R2.3):
    - Served as application/xml.
    - Lists only canonical 200 URLs with lastmod dates.
    - Adapts dynamically to tunemavens.com, tunestream.co, syncmavens.com, and role subdomains.
    """
    host, scheme = _get_host_and_scheme(request)
    now_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Match platform or fallback to tunemavens.com
    target_host_key = "tunemavens.com"
    if "tunestream.co" in host:
        target_host_key = "tunestream.co"
    elif "syncmavens.com" in host:
        target_host_key = "syncmavens.com"

    base_url = f"{scheme}://{host}"
    routes = HOST_ROUTES.get(target_host_key, HOST_ROUTES["tunemavens.com"])

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    for item in routes:
        path = item["path"]
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{base_url}{path}</loc>")
        xml_lines.append(f"    <lastmod>{now_date}</lastmod>")
        xml_lines.append(f"    <changefreq>{item['changefreq']}</changefreq>")
        xml_lines.append(f"    <priority>{item['priority']}</priority>")
        xml_lines.append("  </url>")

    # On tunemavens.com, include public creator EPKs and public events
    if target_host_key == "tunemavens.com":
        try:
            creators = list(db.users.find(
                {"role": "creator", "public_listing": {"$ne": False}},
                {"username": 1, "name": 1, "updated_at": 1}
            ).limit(200))

            for c in creators:
                slug = c.get("username") or c.get("name", "creator").lower().replace(" ", "")
                c_date = c.get("updated_at")
                lastmod = c_date.strftime("%Y-%m-%d") if isinstance(c_date, datetime) else now_date
                xml_lines.append("  <url>")
                xml_lines.append(f"    <loc>{base_url}/epk/{slug}</loc>")
                xml_lines.append(f"    <lastmod>{lastmod}</lastmod>")
                xml_lines.append("    <changefreq>weekly</changefreq>")
                xml_lines.append("    <priority>0.8</priority>")
                xml_lines.append("  </url>")
        except Exception as e:
            logger.warning(f"Failed to append creators to sitemap: {e}")

        try:
            events = list(db.events.find({}, {"_id": 1, "date": 1}).limit(100))
            for ev in events:
                xml_lines.append("  <url>")
                xml_lines.append(f"    <loc>{base_url}/events/{str(ev['_id'])}</loc>")
                xml_lines.append(f"    <lastmod>{now_date}</lastmod>")
                xml_lines.append("    <changefreq>weekly</changefreq>")
                xml_lines.append("    <priority>0.7</priority>")
                xml_lines.append("  </url>")
        except Exception as e:
            logger.warning(f"Failed to append events to sitemap: {e}")

    # On tunestream.co, include consented public streaming tracks
    elif target_host_key == "tunestream.co":
        try:
            tracks = list(db.tracks.find(
                {"public_streaming": True},
                {"_id": 1, "isrc": 1, "updated_at": 1}
            ).limit(200))
            for tr in tracks:
                xml_lines.append("  <url>")
                xml_lines.append(f"    <loc>{base_url}/track/{str(tr['_id'])}</loc>")
                xml_lines.append(f"    <lastmod>{now_date}</lastmod>")
                xml_lines.append("    <changefreq>monthly</changefreq>")
                xml_lines.append("    <priority>0.7</priority>")
                xml_lines.append("  </url>")
        except Exception as e:
            logger.warning(f"Failed to append tracks to tunestream sitemap: {e}")

    xml_lines.append("</urlset>")
    xml_content = "\n".join(xml_lines) + "\n"

    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={"Content-Type": "application/xml; charset=utf-8"}
    )


@router.get("/robots.txt")
def get_robots_txt(request: Request):
    """Generates host-specific robots.txt guidelines.

    Per Spec §2 (R2.4):
    - Allow public marketing and platform pages.
    - Disallow /app, /api, /admin.
    - Explicitly references the host's canonical sitemap.xml.
    """
    host, scheme = _get_host_and_scheme(request)
    sitemap_url = f"{scheme}://{host}/sitemap.xml"

    robots_content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /app/\n"
        "Disallow: /api/\n"
        "Disallow: /admin/\n"
        "Disallow: /dashboard/\n"
        "Disallow: /settings/\n"
        f"Sitemap: {sitemap_url}\n"
    )
    return Response(
        content=robots_content,
        media_type="text/plain",
        headers={"Content-Type": "text/plain; charset=utf-8"}
    )


@router.get("/api/seo/schema")
def get_organization_schema(request: Request):
    """Returns baseline JSON-LD schema for Intermaven Network & TuneMavens."""
    host, scheme = _get_host_and_scheme(request)
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://intermaven.io/#organization",
                "name": "Intermaven Network Inc.",
                "url": "https://intermaven.io",
                "logo": "https://tunemavens.com/logo.png",
                "sameAs": [
                    "https://tunemavens.com",
                    "https://tunestream.co",
                    "https://syncmavens.com"
                ],
                "description": "Next-generation African and diaspora music operating system, copyright registry, and sync marketplace."
            },
            {
                "@type": "WebSite",
                "@id": f"{scheme}://{host}/#website",
                "url": f"{scheme}://{host}/",
                "name": "TuneMavens" if "tunemavens" in host else ("TuneStream" if "tunestream" in host else "SyncMavens"),
                "publisher": {"@id": "https://intermaven.io/#organization"}
            }
        ]
    }


@router.get("/api/seo/schema/{schema_type}/{item_id}")
def get_item_schema(schema_type: str, item_id: str):
    """Generates structured JSON-LD data for MusicGroup, MusicRecording, or Event.

    Per Spec §2 (R2.6): Add MusicGroup or MusicRecording only on public pages where the artist has consented.
    """
    schema_type = schema_type.lower()
    from bson import ObjectId
    try:
        oid = ObjectId(item_id)
    except Exception:
        oid = item_id

    if schema_type in ("artist", "musicgroup"):
        user = db.users.find_one({"$or": [{"_id": oid}, {"username": item_id}]})
        if not user:
            raise HTTPException(status_code=404, detail="Artist not found")

        # Consent check: only list if artist consented to public listing
        if user.get("public_listing") is False:
            raise HTTPException(status_code=403, detail="Artist has not consented to public directory listing")

        return {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": user.get("name", "Artist"),
            "url": f"https://tunemavens.com/epk/{user.get('username') or user.get('name', 'artist').lower().replace(' ', '')}",
            "genre": user.get("genre", "Afrobeats / Contemporary / East African"),
            "description": user.get("bio", "TuneMavens Verified Creator.")
        }

    elif schema_type in ("track", "musicrecording"):
        track = db.tracks.find_one({"$or": [{"_id": oid}, {"isrc": item_id}]})
        if not track:
            raise HTTPException(status_code=404, detail="Track not found")

        # Consent check: must have public_streaming consent
        if not track.get("public_streaming"):
            raise HTTPException(status_code=403, detail="Track is restricted from public listing")

        return {
            "@context": "https://schema.org",
            "@type": "MusicRecording",
            "name": track.get("title"),
            "isrcCode": track.get("isrc"),
            "duration": track.get("duration"),
            "url": f"https://tunestream.co/track/{item_id}",
            "byArtist": {
                "@type": "MusicGroup",
                "name": track.get("artist_name", "Featured Artist")
            }
        }

    raise HTTPException(status_code=400, detail=f"Unsupported schema type '{schema_type}'")
