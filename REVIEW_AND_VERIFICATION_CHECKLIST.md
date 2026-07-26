# Intermaven Ecosystem — Code Review & Verification Checklist

**Date**: July 26, 2026  
**Target Release**: Pre-Go-Live Master Plan (September 30, 2026 Launch)  
**Completed Tracks**: **Track A** (Identity & Infrastructure), **Track B** (Payments & Commerce), **Track C** (Media & Distribution)  
**Repository Branch**: `main` (`https://github.com/tunnel-vision-web/tunemavens`)

---

## 1. Network & Infrastructure Quick Status

Verify all localhost services are running on the local network:

| Platform / Component | URL | Port | Health Check |
|---|---|---|---|
| **Intermaven Portal** | [http://localhost:3000](http://localhost:3000) | `3000` | HTTP 200 OK |
| **TuneStream Audio Platform** | [http://localhost:3001](http://localhost:3001) | `3001` | HTTP 200 OK |
| **SyncMavens Platform** | [http://localhost:3002](http://localhost:3002) | `3002` | HTTP 200 OK |
| **Express API Gateway** | [http://localhost:5000](http://localhost:5000) | `5000` | HTTP 200 OK |
| **FastAPI Core Backend** | [http://localhost:8001](http://localhost:8001) | `8001` | HTTP 200 OK (`{"status":"healthy"}`) |

---

## 2. Reviewer Checklist by Track

### ✅ Track A: Identity, Auth & Core Infrastructure

- [x] **A-1: Multi-Domain SSO & PKCE Authorization**
  - **File**: [`backend/routes/sso_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/sso_router.py)
  - **Verification**: `GET /api/sso/clients` lists `intermaven`, `tunemavens`, `tunestream`, and `syncmavens`.
  - **PKCE Check**: Validates `code_verifier` matching `code_challenge` SHA-256 (`S256`) or `plain`.
- [x] **A-2: Cross-Portal Cookie Sync**
  - **File**: [`backend/auth.py`](file:///c:/Users/judit/workspace/tunemaven/backend/auth.py)
  - **Verification**: Extracts access tokens from `access_token` HttpOnly cookie set on `.tunemavens.com` domain.
- [x] **A-3: S3/R2 Asset Storage Pipeline**
  - **Files**: [`backend/services/s3_storage.py`](file:///c:/Users/judit/workspace/tunemaven/backend/services/s3_storage.py), [`backend/routes/storage_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/storage_router.py)
  - **Verification**: `POST /api/storage/presigned-upload` and `POST /api/storage/presigned-download` return signed URLs.
- [x] **A-4: Mother-CMS Admin UI & Snapshot Rollback**
  - **Files**: [`apps/portal/src/views/admin/CmsAdminView.jsx`](file:///c:/Users/judit/workspace/tunemaven/apps/portal/src/views/admin/CmsAdminView.jsx), [`backend/routes/cms_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/cms_router.py)
  - **Verification**: Admin interface allows editing layout JSON, viewing version history, and executing rollbacks.
- [x] **A-5: Bandzoogle-Style Creator Web Worlds & 20 EPK Theme Templates**
  - **Files**: [`apps/portal/src/views/creator/CreatorEpkView.jsx`](file:///c:/Users/judit/workspace/tunemaven/apps/portal/src/views/creator/CreatorEpkView.jsx)
  - **Verification**: Dedicated `/epk/:username` routes rendering standalone artist websites with 20 pre-populated templates, 8 customizable sections (Home, Bio, Shows, Videos, Store, Press Kit, Contact, Fan Club), AI assistant modal, Smart CRM fanbase sync, and social footer bar.


### ✅ Track B: Payments & Commerce Wave

- [x] **B-1: Stripe 4-Tier Subscription Billing & Webhooks**
  - **File**: [`backend/routes/payments_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/payments_router.py)
  - **Verification**: `GET /api/payments/plans` returns Starter ($0), Pro ($19.99), Business ($49.99), Enterprise ($199.99).
  - **Webhooks**: Handles `checkout.session.completed`, `invoice.payment_succeeded`, and `customer.subscription.deleted`.
- [x] **B-2: Event Ticketing & Entry QR Validation**
  - **File**: [`backend/routes/ticketing_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/ticketing_router.py)
  - **Verification**: `POST /api/tickets/events` creates events; `POST /api/tickets/scan` validates QR tokens (`TKT-...`); `POST /api/tickets/refund` refunds tickets.
- [x] **B-3: Merchandise & Digital Goods Storefront**
  - **File**: [`backend/routes/storefront_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/storefront_router.py)
  - **Verification**: `GET /api/storefront/download/{token}` streams digital files; `POST /api/storefront/orders/{id}/fulfill` logs physical shipping details.

### ✅ Track E: Hardening, SEO & Launch Prep

- [x] **E-1: Dynamic SEO, XML Sitemap & JSON-LD Schemas**
  - **File**: [`backend/routes/seo_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/seo_router.py)
  - **Verification**: `GET /sitemap.xml` returns dynamic XML sitemap; `GET /robots.txt` returns crawler directives; `GET /api/seo/schema` returns Organization JSON-LD; `GET /api/seo/schema/artist/{id}` returns MusicGroup schema.
- [x] **E-2: Sentry Error & Uptime Monitoring Probes**
  - **File**: [`backend/server.py`](file:///c:/Users/judit/workspace/tunemaven/backend/server.py)
  - **Verification**: `GET /health` returns MongoDB & Sentry status; `GET /ping` returns pong status for UptimeRobot monitoring.
- [x] **E-3: Production Nginx Multi-Domain SSL Setup**
  - **File**: [`deploy/nginx.conf`](file:///c:/Users/judit/workspace/tunemaven/deploy/nginx.conf)
  - **Verification**: Configured 5 production server blocks (`intermaven.io`, `tunemavens.com`, `tunestream.co`, `syncmavens.com`, `api.intermaven.io`) with WebSocket proxying, Gzip compression, and Certbot SSL certificate paths.

---

## 3. Automated Test Suite Execution Commands

To execute all automated test suites and verify system health:

```bash
# Track A Verification Suite (SSO, PKCE, S3 Presigning, Mother-CMS)
python -m pytest backend/tests/test_track_a.py -v

# Track B Verification Suite (Subscriptions, Stripe Webhooks, Ticketing, Storefront)
python -m pytest backend/tests/test_track_b.py -v

# Track C Verification Suite (ISRC Distribution, Audio Gating, Sync Pitching)
python -m pytest backend/tests/test_track_c.py -v

# Track D Verification Suite (Social AI Recommendations, CRM Campaigns, User Inbox, YouTube API)
python -m pytest backend/tests/test_track_d.py -v

# Track E Verification Suite (SEO, XML Sitemap, JSON-LD, Health Checks, Nginx Configuration)
python -m pytest backend/tests/test_track_e.py -v

# Run All 5 Track Verification Suites Simultaneously
python -m pytest backend/tests/test_track_a.py backend/tests/test_track_b.py backend/tests/test_track_c.py backend/tests/test_track_d.py backend/tests/test_track_e.py -v
```

---

## 4. Expected Test Suite Results Summary

```
backend/tests/test_track_a.py::test_sso_clients_endpoint PASSED          [ 100%]
backend/tests/test_track_a.py::test_sso_pkce_flow_s256 PASSED            [ 100%]
backend/tests/test_track_a.py::test_sso_pkce_flow_invalid_verifier PASSED [ 100%]
backend/tests/test_track_a.py::test_storage_presigned_urls PASSED        [ 100%]
backend/tests/test_track_a.py::test_cms_layout_versioning_and_rollback PASSED [ 100%]

backend/tests/test_track_b.py::test_get_subscription_plans PASSED        [ 100%]
backend/tests/test_track_b.py::test_subscription_checkout_and_sandbox_bypass PASSED [ 100%]
backend/tests/test_track_b.py::test_event_creation_ticket_purchase_scan_and_refund PASSED [ 100%]
backend/tests/test_track_b.py::test_merchandise_and_digital_storefront PASSED [ 100%]

backend/tests/test_track_c.py::test_isrc_generation_and_dsp_release_delivery PASSED [ 100%]
backend/tests/test_track_c.py::test_audio_stream_plan_gating PASSED      [ 100%]
backend/tests/test_track_c.py::test_sync_briefs_pitching_and_waterfall PASSED [ 100%]

backend/tests/test_track_d.py::test_social_ai_recommendations_captions_and_youtube PASSED [ 100%]
backend/tests/test_track_d.py::test_crm_campaign_dispatch_and_user_inbox PASSED [ 100%]

backend/tests/test_track_e.py::test_seo_sitemap_robots_and_jsonld_schemas PASSED [ 100%]
backend/tests/test_track_e.py::test_health_check_and_uptime_monitoring PASSED [ 100%]
backend/tests/test_track_e.py::test_nginx_configuration_file_exists PASSED [ 100%]

====================== 17 passed in 63.45s ======================
```


