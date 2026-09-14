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

### 2. Mother-CMS Live Studio, Setup Wizard Modals & Catalogue Management
- **Backend-Native CMS:** Powered by `backend/routes/cms_router.py` with layouts persisted in MongoDB (`cms_layouts`).
- **Immutable Snapshot History:** Every save writes an immutable snapshot to `cms_layout_history` with complete rollback capabilities (`/api/cms/epk/{subdomain}/rollback/{version}`).
- **Dedicated Album & Track Editing Suite (`managerSubView === 'album-edit'`):** Complete album tracklist management, inline audio playback per track, individual title/ISRC/duration editing, track deletion with auto re-indexing, and 1-click artwork editing directly from catalogue rows.
- **Collapsible Ingestion Sidebar:** Left-hand catalogue ingestion sidebar collapses/unfolds with `<RiMenuFoldLine />` / `<RiMenuUnfoldLine />` to maximize data table screen real estate.
- **Discography Hub & Ingestion:** Unified single/album/stems management with 1-click AI Cover Generation, direct audio master links, and a Bulk CSV Catalog Ingestion tool for labels and publishers.
- **Modal Setup Wizards:** Four comprehensive, full-screen modal onboarding workflows with backdrop blur:
  - *Discography Setup Wizard* (5 steps: Metadata, Audio/Stems, Artwork, Publishing/Credits, Review & Ingest)
  - *Store & Merch Setup Wizard* (4 steps: Basics, Multi-Image Carousel, Specs, Pricing/Stock)
  - *Press & EPK Setup Wizard* (4 steps: Headline Hook, Quotes, Tech Rider Specs, PDF Export)
  - *Tours & Shows Setup Wizard* (4 steps: Venue, Dates/Doors, Multi-Tier Tickets, Flyer/Lineup)
- **Rich AI Narrative Bio:** AI-assisted bio generator with rich text image and video embedder (`handleInsertMediaToBio`).

### 3. Dedicated Event & Album Pages with Commercial Protocols
- **Full Event Showcase:** Dedicated page (`activeTab === 'event-detail'`) featuring high-res flyers, venue metadata, multi-tier ticketing (GA, VIP, Meet & Greet), comprehensive card fields, M-Pesa STK push, and digital QR ticket passes.
- **Full Album Showcase & Global Player:** Detailed liner notes, analog synth specs, and uncapped continuous full-length audio streaming with butter-smooth 60fps time scrubber (`requestAnimationFrame` + CSS linear transitions).
- **Commercial Tiering:** "Buy Full Album ($9.99 / 50 Credits)" open to all fans; "Buy Stems" restricted to industry practitioners with 1-click role verification.
- **Universal In-Context Top-Up:** Immediate modal top-up with quick packs and a custom amount slot enforcing minimum $5.00 USD (USA/Global) and minimum KES 200 (Kenya/East Africa).
- **Fan Playlists & Vault:** Fans create and manage custom playlists and access purchased songs in "My Library & Playlists".

### 4. Native Intermaven Smart CRM Studio (Port 8001 Backend)
- **Native Studio Panel:** High-performance native component (`SmartCrmStudioPanel.jsx`) connected directly to `/api/crm/contacts`, `/api/crm/campaigns`, and `/api/crm/leads` on Port 8001.
- **Zero-Error Microservice Connection:** Speculative port 8080 calls made conditional on `VITE_INTERMAVEN_CRM_URL`, preventing browser console connection refused errors.
- **Audience & Fan Leads Table:** Filter by channel (WhatsApp, SMS, Email) with direct simulated STK/SMS push and email dispatch.
- **Omnichannel Broadcast Dispatcher:** Send targeted broadcasts via WhatsApp (98% open rate), SMS/STK, or rich email with live dispatch logs.
- **Fan Playlists Analytics:** Monitor fan-curated playlists created via the public EPK.

### 5. Design Standards & Visual Identity
- **Analogous High-Contrast Notifications:** Deep midnight navy base (`#071d2c`) with vibrant 1.5px cyan/emerald borders (`#00f0ff`), left 5px solid highlight indicator strip, and high-contrast tag pills.
- **Strict Flat Colors Standard:** Buttons across the ecosystem strictly use solid flat colors; all gradients on `<button>` elements are eliminated for visual clarity.
- **AI Hero & Header Image Live Synchronization:** Real-time bi-directional synchronization between Mother-CMS (`db.cms_layouts`) and public EPKs (`db.epks`), cache-busting HTTP headers, and instantaneous frontend event bus updates.
- **40% Header Image Luminance Boost:** Header banners across interior pages and Creator Web Worlds apply `filter: brightness(1.4)` (hover `brightness(1.55)`) with lightened overlays for maximum visual punch and legibility.
- **Strict 1280px Grid:** All content below the hero section across TuneMavens is locked to `max-width: 1280px; margin: 0 auto;`.
- **Split Cascade Ledger:** Ingest statement CSVs and calculate cascading splits for writers, producers, and labels.
- **Sync Brief AI:** Parse creative scripts into supervisor-friendly tags (BPM, mood, instrumentation, vocal type).
- **Mastering Brief AI:** Target loudness matching (LUFS) and peak reference compliance.
- **Unified Network Credits:** Single balance shared across TuneMavens, TuneStream, and the Intermaven network.

### 6. Layout & Design Standards
- **Strict 1280px Content Constraint:** All page content below the hero section across TuneMavens (`.container`, `.landing-content-split`, interior pages, and EPK views) is strictly bound to `max-width: 1280px; margin: 0 auto;`.
- **Typography & Theme:** Sansation typeface with flat dark ink backgrounds and neon accents (`--cyan: #22d3ee`, `--purple: #8b5cf6`, `--amber: #f59e0b`).

### 7. Release Operations, Storage Quotas & Creator Monetization
- **Roster Ownership Isolation & Security:** Non-admin creators/managers only view artists in their roster (`owner_id`/`subdomain`). Platform Admins can toggle between single-artist view and "Entire Platform Catalogue" (`GET /api/catalog/tracks?all=true`) with top sorting (Title, Artist, Streams, Year, Date).
- **Bulk Ingestion Studio (`BulkCatalogueIngestModal.jsx`):** Multi-track tabular import via CSV/Excel, raw text paste, or audio drop with batch artist/genre assignment, sequential ISRC generation, and 1-click batch ingestion (`POST /api/catalog/bulk-ingest`).
- **Media Storage Quotas & Credit Top-Up:** 500 MB base starter quota with dynamic progress tracking (`CmsAssetsStudio.jsx`) and credit top-up packages (+500 MB for 50 credits, +1 GB for 90 credits, +5 GB for 350 credits).
- **Audio Playback 30-Second Limit:** Non-purchased / uncredited tracks are restricted to 30-second previews, pausing automatically and prompting credit unlock.
- **Creator Consumption & Custom Pricing:** Creators choose how music is consumed (`Stream Only`, `Download Only`, `Both`) and define custom stream/download pricing with recommended baselines.
- **Persistent User Settings:** User profile metadata (name, email, brand, country, bio) persists to MongoDB via `PUT /api/users/me` across logins and logouts.

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
