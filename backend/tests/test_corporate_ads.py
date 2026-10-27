"""Test Corporate Advertising & Sponsorship Router.

Tests:
1. Established business ad rates query (GET /api/corporate/ad-rates)
2. Brand inquiry & RFP submission with automatic Smart CRM lead routing (POST /api/corporate/inquiries)
3. Campaign flight creation & booking (POST /api/corporate/campaigns)
4. Campaign listing and detailed retrieval (GET /api/corporate/campaigns)
5. Ad delivery impression and click event tracking (POST /api/corporate/campaigns/{id}/track)
6. Ecosystem corporate advertising stats (GET /api/corporate/stats)
"""
import os
import sys
from fastapi.testclient import TestClient
from bson import ObjectId

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from server import app
from config import db

client = TestClient(app)


def run_corporate_ads_tests():
    print("\n--- Running Corporate Brand Advertising Tests ---")

    # 1. Test GET /api/corporate/ad-rates
    print("Testing GET /api/corporate/ad-rates...")
    rates_res = client.get("/api/corporate/ad-rates")
    assert rates_res.status_code == 200, f"Expected 200, got {rates_res.status_code}"
    rates = rates_res.json()
    assert len(rates) >= 4, f"Expected at least 4 rate tiers, got {len(rates)}"
    
    slugs = [r["slug"] for r in rates]
    assert "pulse" in slugs
    assert "amplified" in slugs
    assert "culture-lead" in slugs
    assert "titan" in slugs
    print(f"  [OK] Found {len(rates)} established rate tiers: {', '.join(slugs)}")

    # Verify rates specific CPMs and guaranteed impressions
    pulse = next(r for r in rates if r["slug"] == "pulse")
    assert pulse["price_usd"] == 499.0
    assert pulse["guaranteed_impressions"] == 25000
    assert pulse["cpm_usd"] == 19.96
    print(f"  [OK] Pulse Tier Verified: ${pulse['price_usd']} | {pulse['guaranteed_impressions']} Listens | ${pulse['cpm_usd']} CPM")

    amplified = next(r for r in rates if r["slug"] == "amplified")
    assert amplified["price_usd"] == 1499.0
    assert amplified["guaranteed_impressions"] == 100000
    assert amplified["is_popular"] is True
    print(f"  [OK] Amplified Tier Verified: ${amplified['price_usd']} | {amplified['guaranteed_impressions']} Listens | Most Popular: True")

    # 2. Test POST /api/corporate/inquiries
    print("Testing POST /api/corporate/inquiries (Brand RFP)...")
    db.crm_leads.delete_many({"email": "wanjiku.mwangi@coca-cola.com"})
    db.corporate_ad_inquiries.delete_many({"contact_email": "wanjiku.mwangi@coca-cola.com"})
    test_inquiry = {
        "brand_name": "Coca-Cola Refresh Beats",
        "contact_name": "Wanjiku Mwangi",
        "contact_email": "wanjiku.mwangi@coca-cola.com",
        "contact_phone": "+254711998877",
        "tier_slug": "amplified",
        "target_region": "East Africa & Diaspora",
        "target_genre": "Afrobeats, Gengetone",
        "estimated_budget": "$1,499 (7,500 Credits)",
        "preferred_start_date": "2026-11-01",
        "notes": "Flight for holiday campaign, 30s studio master ready."
    }
    inq_res = client.post("/api/corporate/inquiries", json=test_inquiry)
    assert inq_res.status_code == 200, f"Expected 200, got {inq_res.status_code}"
    inq_data = inq_res.json()
    assert inq_data["success"] is True
    assert inq_data["reference_code"].startswith("TM-AD-")
    print(f"  [OK] Brand Inquiry Submitted -> Tracking Code: {inq_data['reference_code']}")

    # Verify lead was routed into Smart CRM db.crm_leads
    lead = db.crm_leads.find_one({"email": "wanjiku.mwangi@coca-cola.com"})
    assert lead is not None, "Lead was not routed to db.crm_leads"
    assert lead["channel"] == "corporate-ad-rfp"
    assert lead["brand_name"] == "Coca-Cola Refresh Beats"
    print(f"  [OK] Automatic Smart CRM Lead Routing Verified -> Lead ID: {lead['_id']}")

    # 3. Test POST /api/corporate/campaigns
    print("Testing POST /api/corporate/campaigns...")
    test_campaign = {
        "brand_name": "Spotify Wrapped Brand Integration",
        "company_name": "Spotify MEA",
        "contact_email": "brand_mea@spotify.com",
        "contact_phone": "+254700000000",
        "tier_slug": "culture-lead",
        "spot_duration_seconds": 30,
        "audio_asset_url": "https://assets.spotify.com/ads/wrapped_30s.mp3",
        "companion_banner_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
        "destination_url": "https://spotify.com/wrapped",
        "promo_code": "WRAPPED2026",
        "target_regions": ["Kenya", "Nigeria", "South Africa"],
        "target_genres": ["Afrobeats", "Amapiano"],
        "payment_method": "invoice"
    }
    camp_res = client.post("/api/corporate/campaigns", json=test_campaign)
    assert camp_res.status_code == 200, f"Expected 200, got {camp_res.status_code}"
    camp_data = camp_res.json()
    assert camp_data["success"] is True
    campaign_id = camp_data["campaign"]["_id"]
    print(f"  [OK] Campaign Created -> Campaign ID: {campaign_id}")

    # 4. Test GET /api/corporate/campaigns
    print("Testing GET /api/corporate/campaigns...")
    list_res = client.get(f"/api/corporate/campaigns?email={test_campaign['contact_email']}")
    assert list_res.status_code == 200
    user_camps = list_res.json()
    assert len(user_camps) >= 1
    print(f"  [OK] Retrieved {len(user_camps)} campaign(s) for brand email {test_campaign['contact_email']}")

    # 5. Test POST /api/corporate/campaigns/{id}/track
    print("Testing Ad Impression & Click Tracking...")
    # Track 1 impression
    impr_res = client.post(f"/api/corporate/campaigns/{campaign_id}/track", json={"event_type": "impression"})
    assert impr_res.status_code == 200
    assert impr_res.json()["impressions"] == 1

    # Track 1 completion
    comp_res = client.post(f"/api/corporate/campaigns/{campaign_id}/track", json={"event_type": "completion"})
    assert comp_res.status_code == 200

    # Track 1 click
    click_res = client.post(f"/api/corporate/campaigns/{campaign_id}/track", json={"event_type": "click"})
    assert click_res.status_code == 200
    assert click_res.json()["clicks"] == 1
    assert click_res.json()["ctr"] == 100.0  # 1 click / 1 impression = 100.0%
    print(f"  [OK] Telemetry Tracking Verified -> Impressions: 1, Completions: 1, Clicks: 1, CTR: 100%")

    # 6. Test GET /api/corporate/stats
    print("Testing GET /api/corporate/stats...")
    stats_res = client.get("/api/corporate/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["status"] == "healthy"
    assert stats["total_campaigns"] >= 1
    assert len(stats["formats_supported"]) >= 3
    print(f"  [OK] Ecosystem Stats Verified -> Total Budget Committed: ${stats['total_budget_committed_usd']:,}")

    # Cleanup test documents
    db.corporate_ad_inquiries.delete_one({"brand_name": "Coca-Cola Refresh Beats"})
    db.crm_leads.delete_one({"email": "wanjiku.mwangi@coca-cola.com"})
    db.corporate_ad_campaigns.delete_one({"_id": ObjectId(campaign_id)})

    print("\n--- ALL CORPORATE BRAND ADVERTISING TESTS PASSED! ---\n")


if __name__ == "__main__":
    run_corporate_ads_tests()
