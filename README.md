# TuneMavens — Music Operations & Creator Ecosystem Suite

TuneMavens is a unified music business operating platform and creator web world ecosystem. It bridges independent creators, record labels, music supervisors, and everyday listeners through automated split calculations, LUFS mastering, sync curation, streaming distribution, and standalone creator web worlds with Mother-CMS integration.

Part of the **Intermaven Network**, TuneMavens shares unified authentication (SSO), non-expiring network credits, and cross-platform CRM leads with **tunestream.co**, **syncmavens.com**, and **intermaven.io**.

---

## 🚀 Microservices Architecture

The monorepo coordinates five interdependent microservices:

| Service | Directory / Package | Port | Purpose | Command |
|---|---|---|---|---|
| **Portal (TuneMavens)** | `apps/portal` | `3000` | Main TuneMavens portal, dashboard, and Creator EPK Web Worlds | `npm run dev:portal` |
| **TuneStream** | `apps/tunestream` | `3001` | Consumer streaming and lossless audio purchase portal | `npm run dev:tunestream` |
| **SyncMavens** | `apps/syncmavens` | `3002` | Music supervisor sync licensing and brief matching hub | `npm run dev:syncmavens` |
| **API Gateway** | `api-gateway` | `5000` | Express reverse proxy & legacy endpoints | `npm run dev:api` |
| **FastAPI Backend** | `backend` | `8001` | Core REST API, MongoDB data layer, Mother-CMS, CRM & AI engine | `python -m uvicorn server:app --port 8001 --reload` |

To start all services concurrently:
```bash
npm run dev
```

---

## 📦 Key Capabilities & Feature Suites

### 1. Standalone Creator Web Worlds (EPK)
- **Tri-Domain Ingress:** Creators can deploy their live web world across `tunemavens.com`, `tunestream.co`, and `syncmavens.com` under their custom subdomain or verified domain.
- **Dynamic SEO:** Dedicated Site Name and Tagline configuration dynamically controls `<title>`, meta tags, and open-graph previews.
- **Contextual Hero Carousel:** Multi-slide hero banners with 3-line music business hierarchy and AI prompts tuned to creator persona and genre paths.
- **Animation Modes:** Supports both dynamic multi-phase stagger (`anim-synergy`) and sequential fade (`anim-fade-seq`).
- **Social Account Sync:** Multi-network URL validation and live sync checks across Spotify, Apple Music, YouTube, Instagram, and TikTok.
- **Smart CRM Lead Routing:** Booking requests and fan inquiries route straight into Intermaven Smart CRM (`/api/crm/leads`).

### 2. Mother-CMS Live Studio & Versioned Rollbacks
- **Backend-Native CMS:** Powered by `backend/routes/cms_router.py` with layouts persisted in MongoDB (`cms_layouts`).
- **Immutable Snapshot History:** Every save writes an immutable snapshot to `cms_layout_history` with complete rollback capabilities (`/api/cms/epk/{subdomain}/rollback/{version}`).
- **Rich AI Narrative Bio:** AI-assisted bio generator producing rich-media HTML narrative highlighting master rights ownership and 24-bit stems.
- **Floating Live Studio:** In-page WYSIWYG editor drawer (`LiveEpkCmsStudio.jsx`) with live preview, color tokens, and history logs.

### 3. Music Business Tools & Operations
- **Split Cascade Ledger:** Ingest statement CSVs and calculate cascading splits for writers, producers, and labels.
- **Sync Brief AI:** Parse creative scripts into supervisor-friendly tags (BPM, mood, instrumentation, vocal type).
- **Mastering Brief AI:** Target loudness matching (LUFS) and peak reference compliance.
- **Unified Network Credits:** Single balance shared across TuneMavens, TuneStream, and the Intermaven network.

### 4. Layout & Design Standards
- **Strict 1280px Content Constraint:** All page content below the hero section across TuneMavens (`.container`, `.landing-content-split`, interior pages, and EPK views) is strictly bound to `max-width: 1280px; margin: 0 auto;`.
- **Typography & Theme:** Sansation typeface with flat dark ink backgrounds and neon accents (`--cyan: #22d3ee`, `--purple: #8b5cf6`, `--amber: #f59e0b`).

---

## 🛠️ Build & Verification

```bash
# Build all workspaces
npm run build

# Build portal specifically
npm run build --workspace=portal

# Run tests
npm test
```

---

## 📚 Documentation Reference

- **[docs/DOCUMENTATION.md](file:///c:/Users/judit/workspace/tunemaven/docs/DOCUMENTATION.md)** — Canonical technical reference (§9.1 to §9.20).
- **[docs/DESIGN_STANDARDS.md](file:///c:/Users/judit/workspace/tunemaven/docs/DESIGN_STANDARDS.md)** — Design tokens, component specs, and styling protocols.
- **[docs/ECOSYSTEM_ARCHITECTURE_AND_FLOWCHART.md](file:///c:/Users/judit/workspace/tunemaven/docs/ECOSYSTEM_ARCHITECTURE_AND_FLOWCHART.md)** — Complete ecosystem flow and microservices diagram.
