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

### ✅ Track D: AI, CRM & CMS Expansion

- [x] **D-1: Social AI Studio Channel Format Recommendations & AI Captions**
  - **File**: [`backend/routes/social_ai_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/social_ai_router.py)
  - **Verification**: `POST /api/social-ai/recommendations` returns path-based ratios (`9:16`, `1:1`, `16:9`) and platform prompts; `POST /api/social-ai/generate-caption` generates promo social copy.
- [x] **D-2: Multi-Channel CRM Growth Engine & User Inbox**
  - **File**: [`backend/routes/crm_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/crm_router.py)
  - **Verification**: `POST /api/crm/campaigns` creates campaigns; `POST /api/crm/dispatch/{id}` dispatches emails/inbox messages; `GET /api/crm/inbox` lists notifications; `POST /api/crm/inbox/{id}/read` marks as read.
- [x] **D-3: YouTube Data API v3 Integration**
  - **Files**: [`backend/services/youtube_service.py`](file:///c:/Users/judit/workspace/tunemaven/backend/services/youtube_service.py), [`backend/routes/social_ai_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/social_ai_router.py)
  - **Verification**: `GET /api/social-ai/youtube/channel/{channel_id}` returns subscriber metrics; `GET /api/social-ai/youtube/featured` returns Wall of Fame video showcases.

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

# Run All Track Verification Suites Simultaneously
python -m pytest backend/tests/test_track_a.py backend/tests/test_track_b.py backend/tests/test_track_c.py backend/tests/test_track_d.py -v
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

====================== 14 passed in 57.89s ======================
```

