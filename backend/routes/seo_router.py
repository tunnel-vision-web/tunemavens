from fastapi import APIRouter, Response
from config import db

router = APIRouter(tags=["SEO"])

@router.get("/sitemap.xml")
def get_sitemap():
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
        
    xml_content += "</urlset>\n"
    
    return Response(content=xml_content, media_type="application/xml")
