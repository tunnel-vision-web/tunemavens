# Master Development Plan & Tech Stack Specification

<div align="center">
  <img src="file:///C:/Users/judit/.gemini/antigravity/brain/cd276e08-5db4-4a17-b41f-7a1bd4f0686b/intermaven_logo.png" alt="Intermaven Mother Platform Logo" width="340" />
  <br/><br/>
  <table border="0" style="border: none; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 10px; border: none;"><img src="file:///C:/Users/judit/.gemini/antigravity/brain/cd276e08-5db4-4a17-b41f-7a1bd4f0686b/tunemavens_logo.png" alt="TuneMavens Logo" width="180" /></td>
      <td align="center" style="padding: 10px; border: none;"><img src="file:///C:/Users/judit/.gemini/antigravity/brain/cd276e08-5db4-4a17-b41f-7a1bd4f0686b/tunestream_logo.png" alt="TuneStream Logo" width="180" /></td>
      <td align="center" style="padding: 10px; border: none;"><img src="file:///C:/Users/judit/.gemini/antigravity/brain/cd276e08-5db4-4a17-b41f-7a1bd4f0686b/syncmavens_logo.png" alt="SyncMavens Logo" width="180" /></td>
    </tr>
  </table>
</div>

---

> [!IMPORTANT]
> **Unified Go-Live Mandate:** All 4 platforms (**Intermaven, TuneMavens, TuneStream, and SyncMavens**) operate as a single unified ecosystem and **MUST GO LIVE TOGETHER SIMULTANEOUSLY** targeting **September 30, 2026**.

---

## 1. Unified Tech Stack Specification

The entire ecosystem is powered by a standardized, battle-tested modern technology stack designed for high throughput, seamless cross-domain cookie authentication, and instant reactivity:

```
+-----------------------------------------------------------------------------------+
|                                  UNIFIED TECH STACK                               |
+-----------------------------------------------------------------------------------+
|  FRONTEND LAYER        | React 18, Vite Monorepo (`apps/*`), Vanilla CSS Tokens,  |
|                        | Lucide React Icons, Capacitor (Native Mobile Packaging)  |
+------------------------+----------------------------------------------------------+
|  BACKEND LAYER         | FastAPI (Python 3.11), Uvicorn ASGI, Motor / PyMongo,     |
|                        | Pydantic v2 validation models                            |
+------------------------+----------------------------------------------------------+
|  AUTH & SECURITY       | OIDC / PKCE Single Sign-On (SSO), PyJWT Cookie Sharing,  |
|                        | Sentry Monitoring, Strict CORS & Rate Limiting           |
+------------------------+----------------------------------------------------------+
|  OBJECT STORAGE        | AWS S3 / Cloudflare R2 for Lossless Stems & Audio Files  |
+------------------------+----------------------------------------------------------+
|  PAYMENTS & ESCROW     | Stripe Connect / Checkout Gateway, 90/10 Split Cascade,   |
|                        | Event Ticketing QR Scanner Router                        |
+------------------------+----------------------------------------------------------+
|  AI & AUTOMATION       | Claude Sonnet 4.6 (App Recommendations), Gemini Nano &   |
|                        | Sora 2 (Social AI Studio), YouTube Data API v3, Resend   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Audit of Completed Progress Across All 4 Platforms

A comprehensive progress audit shows significant engineering milestones already delivered across the codebase:

### 1. Intermaven Platform (`intermaven.io`)
- ✅ **Mother-CMS Grid:** Baseline Mother-CMS grid architecture initialized with localized key overlay fallback (`portal[region] -> portal[default] -> region -> default`).
- ✅ **Mother-EPK Builder Engine:** Standardized EPK template structure implemented in backend, synchronized across Intermaven and TuneMavens.
- ✅ **Social AI Backend Router (`social_ai_router.py`):** Verified image generation (`/generate-art`) and video rendering (`/generate-video`) endpoints with prompt seed slice constraints.
- ✅ **AI Tools Catalogue:** Public `/tools` and `/apps` directory catalogs shipped with horizontal centering design rules (§9.13).

### 2. TuneMavens Marketplace Hub (`tunemavens.com`)
- ✅ **Phase 1 Foundation:** FastAPI backend, Vite React frontend, shared JWT auth, MongoDB persistence, and role-gated admin console.
- ✅ **Phase 3 Creator Pipeline:** Publishing election, distribution election, Stripe onboarding, Contract Negotiation subsystem (locked vs negotiable clauses, e-signatures).
- ✅ **Phase 4 Record Label Console:** Roster CSV bulk upload, multi-file drag-and-drop audio file ingestion, catalogue list showing ISRCs, splits, and action shortcuts.
- ✅ **Phase 3 Recommendation Agent (§9.8):** Dual-layer AI recommendation system (Claude Sonnet 4.6 primary + rules fallback).
- ✅ **Canonical 7-Role & 4-Tier Schema:** Database schemas extended for 7 canonical roles (Creator, Label, DJ, Media House, Exec/Supervisor, Consumer, Corporate) and 4 pricing tiers (Starter, Pro, Business, Enterprise).

### 3. TuneStream Consumer Streaming (`tunestream.co`)
- ✅ **Lossless Player & Stream Router (`stream_router.py`):** Consumer audio streaming endpoint, watermarked preview gating, and offline cache metadata stubs.
- ✅ **Sub-brand Landing Pages & Dark Theme:** Custom dark-theme navigation, Tidal-inspired audio sections, and region switcher context (`RegionContext.jsx`).
- ✅ **Standalone Target Build Target:** Vite build target configured for isolated deployment to `tunestream.co` and `tunestream.tunemavens.com`.

### 4. SyncMavens Licensing Hub (`syncmavens.com`)
- ✅ **Ditto-Inspired Public Portal:** Ditto Music-modeled "Get Signed" landing page pitching sync licensing to independent artists with client logos (Netflix, HBO, FIFA, A24).
- ✅ **AI Sync Match Simulator:** Form-based utility scoring track metadata against active supervisor briefs with match score outputs.
- ✅ **Waterfall Splits Calculator:** Interactive slider tool visualizing the 90/10 sync fee distribution waterfall and $0 catalog advance model.
- ✅ **Backend Sync Router (`match_router.py`):** Verified score simulation and 90/10 waterfall payout backend calculations.

---

## 3. Pre-Go-Live Outstanding Development Roadmap

To achieve our simultaneous launch target (**September 30, 2026**), the remaining unbuilt modules are structured into **5 Parallel Tracks**. 

> [!WARNING]
> All tasks listed in the table below MUST be completed, tested, and verified prior to go-live.

### Track A: Identity, Auth & Core Infrastructure (Target: Weeks 1–3)

| Task ID | Component / Description | Target File(s) | Status | Priority |
|---|---|---|---|---|
| **A-1** | **Multi-Domain SSO Authorization:** Expand `sso_router.py` to support `client_id` configurations for `tunemavens.com`, `tunestream.co`, and `syncmavens.com`. | `backend/routes/sso_router.py` | ⏳ In Progress | High |
| **A-2** | **Cross-Portal Auth Cookie Sync:** Validate JWT tokens minted by unified provider across root domain and subdomains (`COOKIE_DOMAIN=.tunemavens.com`). | `backend/auth.py` | ⏳ In Progress | High |
| **A-3** | **S3/R2 Asset Storage Pipeline:** Replace base64 upload pipelines with direct AWS S3 / Cloudflare R2 presigned upload URLs for stems and audio. | `backend/services/s3_storage.py` | ⏳ In Progress | High |
| **A-4** | **Mother-CMS Admin Editor UI:** Build admin editor interface with localized key overlays and CMS version rollback UI. | `backend/routes/cms_router.py`, `apps/portal/src/views/admin/` | 🔴 Pending | Medium |

### Track B: Payments & Commerce Wave (Target: Weeks 1–6)

| Task ID | Component / Description | Target File(s) | Status | Priority |
|---|---|---|---|---|
| **B-1** | **Stripe 4-Tier Subscription Billing:** Register production Stripe price IDs for Starter, Pro, Business, and Enterprise tiers and link webhook updates. | `backend/routes/payments_router.py` | ⏳ In Progress | High |
| **B-2** | **Event Ticketing Service:** Build custom ticketing router to sell event tickets, generate PDF/QR receipts, and validate entries at check-in. | `backend/routes/ticketing_router.py` | ⏳ In Progress | Medium |
| **B-3** | **Merchandise & Digital Goods Storefront:** Complete checkout service for apparel purchases and instant digital audio downloads. | `backend/routes/storefront_router.py` | 🔴 Pending | Medium |

### Track C: Media Ecosystem — TuneStream, SyncMavens & Distribution (Target: Weeks 2–8)

| Task ID | Component / Description | Target File(s) | Status | Priority |
|---|---|---|---|---|
| **C-1** | **DSP Distribution Tracker:** Build the unbuilt `distro_router.py` module to log, generate, and export ISRC release sheets to DSP distributors. | `backend/routes/distro_router.py` | 🔴 Pending | High |
| **C-2** | **TuneStream Audio Preview Gating:** Complete full-length audio stream authorization vs 30-second watermarked preview gating for unsubscribed users. | `backend/routes/stream_router.py` | ⏳ In Progress | High |
| **C-3** | **Sync Brief Ingestion & Real Pitching:** Connect real supervisor brief submission forms to the MongoDB `briefs` collection and pitch delivery pipeline. | `backend/routes/match_router.py`, `apps/syncmavens/src/App.jsx` | ⏳ In Progress | High |

### Track D: AI, CRM & CMS Expansion (Target: Weeks 3–9)

| Task ID | Component / Description | Target File(s) | Status | Priority |
|---|---|---|---|---|
| **D-1** | **Social AI Studio Channel Recommendations:** Implement path-based format recommendations (e.g. 1:1 square for FB, 9:16 vertical for IG/TikTok) in Social AI Studio. | `backend/routes/social_ai_router.py` | ⏳ In Progress | High |
| **D-2** | **Multi-Channel CRM Growth Engine:** Build admin campaign composer with Resend email delivery adapter and user `/inbox` route. | `backend/routes/crm_router.py`, `apps/portal/src/views/inbox/` | ⏳ In Progress | High |
| **D-3** | **YouTube Data API v3 Integration:** Connect YouTube API key to fetch top channel videos for Wall of Fame profiles (`featured_profiles`). | `backend/services/youtube_service.py` | 🔴 Pending | Medium |

### Track E: Hardening, SEO & Launch Prep (Target: Weeks 10–11)

| Task ID | Component / Description | Target File(s) | Status | Priority |
|---|---|---|---|---|
| **E-1** | **Dynamic SEO & JSON-LD Schemas:** Inject structured JSON-LD schemas and dynamic sitemap routing across all marketing routes. | `backend/routes/seo_router.py` | 🔴 Pending | High |
| **E-2** | **Sentry Error & Uptime Monitoring:** Integrate Sentry SDK on frontend and backend; configure UptimeRobot health check ping endpoints. | `backend/server.py` | 🔴 Pending | Medium |
| **E-3** | **Production Nginx & SSL Deployment:** Finalize Hostinger VPS Nginx multi-domain server blocks (`tunemavens.com`, `tunestream.co`, `syncmavens.com`, `intermaven.io`) with Certbot SSL. | `deploy/nginx.conf` | 🔴 Pending | High |

---

## 4. Why All 4 Platforms MUST Launch Simultaneously

Launching all 4 platforms together is a **strict operational requirement** driven by ecosystem network effects:

1. **Interdependent Monetization Waterfall:** A creator ingests a track on **TuneMavens**, uses **Intermaven**'s Social AI Studio to promote it, licenses it to a supervisor via **SyncMavens**, and streams it to fans on **TuneStream**. Omitting any platform breaks the monetization loop.
2. **Unified Single Sign-On (SSO):** Users expect a single account identity across all domains. A fragmented rollout would cause credential sync errors and duplicate profile records.
3. **Shared Network Credit Economy:** Credits earned from TuneStream listener tips or marketplace activities are spent on Intermaven AI runs and SyncMavens pitch boosts.
4. **Cross-Platform Social Graph:** Direct follows, 2nd-degree deal-maker discovery, and Wall of Fame community features span all 4 platforms simultaneously.
