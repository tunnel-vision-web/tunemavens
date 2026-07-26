from typing import Optional
from fastapi import APIRouter, Response, HTTPException
from config import db

router = APIRouter(tags=["SEO"])


@router.get("/sitemap.xml")
def get_sitemap():
    """Generates dynamic XML sitemap for search engines."""
    base_url = "https://tunemavens.com"
    urls = [
        "",
        "/publishing",
        "/tours",
        "/distribution",
        "/sync-placement",
        "/pricing",
        "/about",
        "/help"
    ]
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for path in urls:
        xml_content += "  <url>\n"
        xml_content += f"    <loc>{base_url}{path}</loc>\n"
        xml_content += "    <changefreq>daily</changefreq>\n"
        xml_content += "    <priority>1.0</priority>\n"
        xml_content += "  </url>\n"
        
    try:
        events = list(db.events.find({}, {"_id": 1}))
        for event in events:
            xml_content += "  <url>\n"
            xml_content += f"    <loc>{base_url}/events/{str(event['_id'])}</loc>\n"
            xml_content += "    <changefreq>weekly</changefreq>\n"
            xml_content += "    <priority>0.8</priority>\n"
            xml_content += "  </url>\n"
    except Exception:
        pass

    try:
        products = list(db.products.find({}, {"_id": 1}))
        for prod in products:
            xml_content += "  <url>\n"
            xml_content += f"    <loc>{base_url}/storefront/product/{str(prod['_id'])}</loc>\n"
            xml_content += "    <changefreq>weekly</changefreq>\n"
            xml_content += "    <priority>0.8</priority>\n"
            xml_content += "  </url>\n"
    except Exception:
        pass

    try:
        users = list(db.users.find({"role": "creator"}, {"email": 1, "name": 1}))
        for u in users:
            username = u.get("name", "creator").lower().replace(" ", "")
            xml_content += "  <url>\n"
            xml_content += f"    <loc>{base_url}/epk/{username}</loc>\n"
            xml_content += "    <changefreq>daily</changefreq>\n"
            xml_content += "    <priority>0.9</priority>\n"
            xml_content += "  </url>\n"
    except Exception:
        pass
        
    xml_content += "</urlset>\n"
    
    return Response(content=xml_content, media_type="application/xml")


@router.get("/robots.txt")
def get_robots_txt():
    """Generates robots.txt crawler guidelines."""
    robots_content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin/\n"
        "Disallow: /api/sso/\n"
        "Sitemap: https://tunemavens.com/sitemap.xml\n"
    )
    return Response(content=robots_content, media_type="text/plain")


@router.get("/api/seo/schema")
def get_organization_schema():
    """Returns baseline JSON-LD schema for Intermaven Network Inc."""
    schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Intermaven Network Inc.",
        "url": "https://intermaven.io",
        "logo": "https://intermaven.io/assets/intermaven_logo.png",
        "sameAs": [
            "https://tunemavens.com",
            "https://tunestream.co",
            "https://syncmavens.com"
        ],
        "description": "Unified music-business operational platform, catalog distribution, and sync marketplace."
    }
    return schema


@router.get("/api/seo/schema/{schema_type}/{item_id}")
def get_item_schema(schema_type: str, item_id: str):
    """Generates structured JSON-LD data for MusicGroup, MusicEvent, or Product."""
    schema_type = schema_type.lower()
    from bson import ObjectId
    try:
        oid = ObjectId(item_id)
    except Exception:
        oid = item_id

    if schema_type in ("artist", "musicgroup"):
        user = db.users.find_one({"$or": [{"_id": oid}, {"_id": item_id}]})
        if not user:
            raise HTTPException(status_code=404, detail="Artist not found")
        return {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": user.get("name", "Artist"),
            "url": f"https://tunemavens.com/epk/{user.get('name', 'artist').lower().replace(' ', '')}",
            "genre": "Music Industry / Intermaven Creator",
        }

    elif schema_type in ("event", "musicevent"):
        event = db.events.find_one({"$or": [{"_id": oid}, {"_id": item_id}]})
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return {
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            "name": event.get("title"),
            "startDate": str(event.get("date")),
            "location": {
                "@type": "Place",
                "name": event.get("location"),
            },
            "offers": {
                "@type": "Offer",
                "price": event.get("price"),
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
            }
        }

    elif schema_type in ("product", "store"):
        prod = db.products.find_one({"$or": [{"_id": oid}, {"_id": item_id}]})
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")
        return {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": prod.get("title"),
            "description": prod.get("description", ""),
            "offers": {
                "@type": "Offer",
                "price": prod.get("price"),
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock" if prod.get("stock", 1) > 0 else "https://schema.org/OutOfStock",
            }
        }

    raise HTTPException(status_code=400, detail="Unsupported schema type")

