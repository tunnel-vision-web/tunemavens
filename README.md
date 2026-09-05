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

### 2. Mother-CMS Live Studio & Setup Wizard Modals
- **Backend-Native CMS:** Powered by `backend/routes/cms_router.py` with layouts persisted in MongoDB (`cms_layouts`).
- **Immutable Snapshot History:** Every save writes an immutable snapshot to `cms_layout_history` with complete rollback capabilities (`/api/cms/epk/{subdomain}/rollback/{version}`).
- **Discography Hub & Ingestion:** Unified single/album/stems management with 1-click AI Cover Generation, direct audio master links, and a Bulk CSV Catalog Ingestion tool for labels and publishers.
- **Modal Setup Wizards:** Four comprehensive, full-screen modal onboarding workflows with backdrop blur:
  - *Discography Setup Wizard* (5 steps: Metadata, Audio/Stems, Artwork, Publishing/Credits, Review & Ingest)
  - *Store & Merch Setup Wizard* (4 steps: Basics, Multi-Image Carousel, Specs, Pricing/Stock)
  - *Press & EPK Setup Wizard* (4 steps: Headline Hook, Quotes, Tech Rider Specs, PDF Export)
  - *Tours & Shows Setup Wizard* (4 steps: Venue, Dates/Doors, Multi-Tier Tickets, Flyer/Lineup)
- **Rich AI Narrative Bio:** AI-assisted bio generator with rich text image and video embedder (`handleInsertMediaToBio`).

### 3. Dedicated Event & Album Pages with Commercial Protocols
- **Full Event Showcase:** Dedicated page (`activeTab === 'event-detail'`) featuring high-res flyers, venue metadata, multi-tier ticketing (GA, VIP, Meet & Greet), comprehensive card fields, M-Pesa STK push, and digital QR ticket passes.
- **Full Album Showcase & TuneStream Player:** Detailed liner notes, analog synth specs, and an embedded TuneStream player with a 30-second free preview countdown; continuing playback consumes 1 TM Credit.
- **Commercial Tiering:** "Buy Full Album ($9.99 / 50 Credits)" open to all fans; "Buy Stems" restricted to industry practitioners with 1-click role verification.
- **Universal In-Context Top-Up:** Immediate modal top-up with quick packs and a custom amount slot enforcing minimum $5.00 USD (USA/Global) and minimum KES 200 (Kenya/East Africa).
- **Fan Playlists & Vault:** Fans create and manage custom playlists and access purchased songs in "My Library & Playlists".

### 4. Native Intermaven Smart CRM Studio
- **Native Studio Panel:** Replaces blocked external iframes with a high-performance native component (`SmartCrmStudioPanel.jsx`) connected directly to `/api/crm/contacts`, `/api/crm/campaigns`, and `/api/crm/leads`.
- **Audience & Fan Leads Table:** Filter by channel (WhatsApp, SMS, Email) with direct simulated STK/SMS push and email dispatch.
- **Omnichannel Broadcast Dispatcher:** Send targeted broadcasts via WhatsApp (98% open rate), SMS/STK, or rich email with live dispatch logs.
- **Fan Playlists Analytics:** Monitor fan-curated playlists created via the public EPK.

### 5. Design Standards & Visual Identity
- **Analogous High-Contrast Notifications:** Deep midnight navy base (`#071d2c`) with vibrant 1.5px cyan/emerald borders (`#00f0ff`), left 5px solid highlight indicator strip, and high-contrast tag pills.
- **Strict Flat Colors Standard:** Buttons across the ecosystem strictly use solid flat colors; all gradients on `<button>` elements are eliminated for visual clarity.
- **Strict 1280px Grid:** All content below the hero section across TuneMavens is locked to `max-width: 1280px; margin: 0 auto;`.
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
