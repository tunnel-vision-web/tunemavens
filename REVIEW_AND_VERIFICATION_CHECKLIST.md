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

### ✅ Track C: Media Ecosystem (TuneStream, SyncMavens & Distribution)

- [x] **C-1: DSP Distribution Tracker & ISRC Sequence**
  - **File**: [`backend/routes/distro_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/distro_router.py)
  - **Verification**: `POST /api/distro/generate-isrc` outputs `KE-TM1-26-XXXXX`; `GET /api/distro/releases/{id}/sheet` generates DDEX-XML-3.8 metadata sheets; `POST /api/distro/releases/{id}/deliver` triggers Spotify/Apple Music delivery.
- [x] **C-2: TuneStream Audio Preview Gating**
  - **File**: [`backend/routes/stream_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/stream_router.py)
  - **Verification**: `GET /api/stream/{id}` serves 45-second preview chunks to Starter users and full audio stream to Pro/Business/Enterprise subscribers.
- [x] **C-3: Sync Brief Ingestion & Real Pitching Pipeline**
  - **File**: [`backend/routes/match_router.py`](file:///c:/Users/judit/workspace/tunemaven/backend/routes/match_router.py)
  - **Verification**: `POST /api/match/briefs` ingests supervisor briefs; `POST /api/match/pitch` submits track pitches with AI match scoring; `GET /api/match/waterfall` verifies 90/10 payout calculations.

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

# Run All Track Verification Suites Simultaneously
python -m pytest backend/tests/test_track_a.py backend/tests/test_track_b.py backend/tests/test_track_c.py -v
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

====================== 12 passed in 48.74s ======================
```
