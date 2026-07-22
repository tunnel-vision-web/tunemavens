# Ecosystem Architecture & Flowchart Diagram Document

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

## 1. System Architecture Overview

The Intermaven Ecosystem is architected as a **Unified Monorepo with Multi-Target Frontend Bundles** backed by a centralized **FastAPI Python Backend** and a high-availability **MongoDB Data Cluster**.

### Architecture Blueprint

```
                                  +---------------------------------------+
                                  |    DNS & NGINX DOMAIN ROUTING SLI     |
                                  +---------------------------------------+
                                      |            |           |        |
           +--------------------------+            |           |        +--------------------------+
           |                                       |           |                                   |
           v                                       v           v                                   v
+-----------------------+               +-----------------------+               +-----------------------+               +-----------------------+
|  INTERMAVEN PORTAL    |               |  TUNEMAVENS PORTAL    |               |   TUNESTREAM APP      |               |   SYNCMAVENS PORTAL   |
|  (intermaven.io)      |               |  (tunemavens.com)     |               |   (tunestream.co)     |               |   (syncmavens.com)    |
|                       |               |                       |               |                       |               |                       |
| - Mother-CMS Grid     |               | - Music Marketplace   |               | - Lossless Player     |               | - Ditto Sync Portal   |
| - Mother-EPK Builder  |               | - Record Label Hub    |               | - Fan Tipping Engine  |               | - Option 1 (30/25/52)|
| - Social AI Studio    |               | - Contract Negotiation|               | - Offline Cache       |               | - Option 2 (15% Agency)|
+-----------------------+               +-----------------------+               +-----------------------+               +-----------------------+
           |                                       |           |                                   |
           +--------------------------+            |           |        +--------------------------+
                                      |            |           |        |
                                      v            v           v        v
                                  +---------------------------------------+
                                  |    SHARED FRONTEND PACKAGES           |
                                  |  - packages/shared-ui                 |
                                  |  - packages/shared-auth               |
                                  +---------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |    UNIFIED FASTAPI BACKEND SERVER     |
                                  |  - OIDC/PKCE SSO & Session Cookies    |
                                  |  - Stripe Payments & Escrow Ledger    |
                                  |  - AI Recommendation Agent (Claude)   |
                                  +---------------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |    MONGODB DATA CLUSTER & AWS S3      |
                                  |  - Shared Users & Entitlements        |
                                  |  - Catalogs, Briefs, Pitches, Feeds   |
                                  +---------------------------------------+
```

---

## 2. High-Impact Ecosystem Flowchart Diagrams

### Flowchart 1: Platform Connectivity & Brand-Coded Domain Routing

```mermaid
flowchart TD
    %% Custom Styling Definitions using Brand Palette
    classDef ingressNode fill:#1e1b4b,stroke:#863bff,stroke-width:2px,color:#fff;
    classDef intermavenBrand fill:#31103f,stroke:#863bff,stroke-width:3px,color:#fff;
    classDef tunemavensBrand fill:#092537,stroke:#00c2ff,stroke-width:3px,color:#fff;
    classDef tunestreamBrand fill:#062e24,stroke:#10b981,stroke-width:3px,color:#fff;
    classDef syncmavensBrand fill:#1a233a,stroke:#60a5fa,stroke-width:3px,color:#fff;
    classDef coreEngine fill:#2e1065,stroke:#a855f7,stroke-width:2px,color:#fff;
    classDef dbLayer fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff;

    %% Ingress Point
    GlobalUsers[Global User Traffic / DNS Request]:::ingressNode --> Router{Domain & Subdomain Ingress Router}

    %% Platform Ingress Routes
    Router -->|intermaven.io| IM["INTERMAVEN (Mother Platform)<br/>• Mother-CMS Grid<br/>• Mother-EPK Builder<br/>• Social AI Studio"]:::intermavenBrand
    Router -->|tunemavens.com| TM["TUNEMAVENS (Marketplace Hub)<br/>• Music Marketplace<br/>• Record Label Roster<br/>• Contract Negotiation"]:::tunemavensBrand
    Router -->|tunestream.co| TS["TUNESTREAM (Streaming App)<br/>• Lossless Audio Player<br/>• Fan Direct Tipping<br/>• Offline Metadata"]:::tunestreamBrand
    Router -->|syncmavens.com| SM["SYNCMAVENS (Sync Portal)<br/>• Option 1: Agency (30/25/52.5)<br/>• Option 2: Direct (15% Agency Fee)<br/>• 0 Dollar Catalog Advances"]:::syncmavensBrand

    %% Role Subdomain Ingress
    Router -->|djs.tunemavens.com| DJSub["DJ Pool Portal"]:::tunemavensBrand
    Router -->|corporate.tunemavens.com| CorpSub["Corporate Portal"]:::tunemavensBrand
    Router -->|media.tunemavens.com| MediaSub["Media House Portal"]:::tunemavensBrand

    %% Interconnection to Unified Core
    IM --> AuthGate[Unified SSO / OIDC Session Token Manager]:::coreEngine
    TM --> AuthGate
    TS --> AuthGate
    SM --> AuthGate
    DJSub --> AuthGate
    CorpSub --> AuthGate
    MediaSub --> AuthGate

    %% Unified Core Backend Services
    AuthGate --> FastAPI[Unified FastAPI Server Core]:::coreEngine
    FastAPI --> AIRecommendation[Claude 4.6 Recommendation Engine]:::coreEngine
    FastAPI --> StripeEngine[Stripe Payments & Escrow Ledger]:::coreEngine
    FastAPI --> SocialAIEngine[Social AI Studio Asset Generator]:::coreEngine
    FastAPI --> DistroTracker[DSP Distribution Tracker]:::coreEngine

    %% Database & Asset Storage
    FastAPI --> MongoCluster[(MongoDB Shared Cluster)]:::dbLayer
    FastAPI --> S3Storage[(AWS S3 / Cloudflare R2 Storage)]:::dbLayer

    class GlobalUsers ingressNode;
    class IM intermavenBrand;
    class TM,DJSub,CorpSub,MediaSub tunemavensBrand;
    class TS tunestreamBrand;
    class SM syncmavensBrand;
    class AuthGate,FastAPI,AIRecommendation,StripeEngine,SocialAIEngine,DistroTracker coreEngine;
    class MongoCluster,S3Storage dbLayer;
```

---

### Flowchart 2: End-to-End Data & Asset Lifecycle Sequence

This sequence diagram illustrates the lifecycle of track metadata, splits cascade, sync brief pitching, streaming tipping, and automated marketing campaigns across all 4 platforms.

```mermaid
sequenceDiagram
    autonumber
    actor Creator as Creator / Label
    participant TM as TuneMavens Portal
    participant S3 as AWS S3 Storage
    participant DB as MongoDB Cluster
    participant SM as SyncMavens Hub
    participant Supervisor as Film/TV Supervisor
    participant TS as TuneStream App
    participant Fan as Consumer / Listener
    participant IM as Intermaven Social AI

    %% Step 1: Catalog Ingestion
    Creator->>TM: Upload Master Audio & Stems
    TM->>S3: Store Original Lossless Audio Stems
    TM->>DB: Upsert Track to 'catalogs' & Generate ISRC Code
    
    %% Step 2: Split Cascade Contract
    Creator->>TM: Define Royalty Split Cascade (Writer/Producer Shares)
    TM->>DB: Store Agreement in 'publishing_deals' & 'contracts'

    %% Step 3: Sync Brief Matching & Licensing Options
    Supervisor->>SM: Post Sync Brief (Film/TV/Gaming)
    SM->>DB: Save Opportunity to 'briefs' Collection
    SM->>SM: Run AI Match Simulator against Catalog Stems
    SM->>Creator: Present Placement Match Score (%) & Option (Option 1 vs Option 2: 15% Agency Fee)
    Creator->>SM: Submit Pitch Track
    SM->>Supervisor: Deliver Pitch with 45s Watermarked Preview
    Supervisor->>SM: Accept Pitch & Sign Licensing Agreement
    SM->>DB: Record Deal in 'pitches' & Disburse Waterfall (Option 1: 30/25/52.5 vs Option 2: 15% SyncMavens Agency Fee / 85% Creator Pool)

    %% Step 4: Consumer Streaming & Direct Fan Monetization
    TM->>TS: Synchronize Track to Streaming Library
    Fan->>TS: Stream Lossless Track & Direct Tip Artist
    TS->>DB: Record Stream Event & Fan Tipping in 'activity_events'
    TS->>Creator: Payout Dispatched to Unified Network Wallet

    %% Step 5: AI Social Marketing Automation
    Creator->>IM: Trigger Social AI Studio Campaign
    IM->>IM: Render Visual Formats (1:1 & 9:16) via Gemini / Sora
    IM->>Fan: Dispatch Campaign via Resend Email / Social Channels
```

---

## 3. Data Schema & MongoDB Collection Index

The entire ecosystem persists through unified MongoDB collections shared across all 4 applications:

| Collection Name | Key Fields & Attributes | Primary Consuming Platforms | Business Purpose |
|---|---|---|---|
| `users` | `_id`, `email`, `roles[]`, `primary_role`, `pro_verified`, `plan`, `credits`, `apps[]`, `privacy_settings` | All 4 Platforms | Unified SSO identity, role permissions, and credit balance |
| `catalogs` | `_id`, `user_id`, `isrc`, `title`, `artist`, `stems_s3_url`, `splits[]`, `is_cleared_for_sync` | TuneMavens, SyncMavens, TuneStream | Centralized metadata index for masters, stems, and audio assets |
| `briefs` | `_id`, `supervisor_id`, `title`, `budget`, `deadline`, `genre`, `license_type`, `status` | SyncMavens | Active licensing opportunities submitted by music supervisors |
| `pitches` | `_id`, `brief_id`, `catalog_id`, `creator_id`, `match_score`, `pitch_status`, `waterfall_splits` | SyncMavens, TuneMavens | Pitch submissions and licensing deal ledgers |
| `publishing_deals` | `_id`, `user_id`, `tier`, `splits_cascade`, `superseded_at`, `status` | TuneMavens | Publishing agreement records and split calculation rules |
| `distribution_deals` | `_id`, `user_id`, `dsp_targets[]`, `isrc_range`, `status` | TuneMavens | Distribution tracking and DSP submission state |
| `contracts` | `_id`, `contract_type`, `locked_clauses[]`, `signatures[]` | TuneMavens, SyncMavens | E-signature and legal contract negotiation state machine |
| `campaigns` | `_id`, `name`, `segment`, `channels[]`, `template`, `stats` | Intermaven, TuneMavens | Multi-channel CRM growth marketing campaigns |
| `messages` | `_id`, `thread_id`, `from_user_id`, `to_user_id`, `body_markdown`, `read_at` | All 4 Platforms | In-app user inbox and administrative notification threads |
| `activity_events` | `_id`, `user_id`, `kind`, `visibility`, `metadata`, `created_at` | TuneMavens, TuneStream | Fanout stream powering the social graph and recommendation engine |
| `featured_profiles` | `_id`, `subject_name`, `youtube_channel_handle`, `youtube_video_id`, `state` | TuneMavens, Intermaven | Wall of Fame curated community profile records |

---

## 4. Detailed Technical Stack Specifications & Monorepo Architecture

### 4.1 Monorepo Directory Layout & Application Boundaries

```
tunemaven/
├── apps/
│   ├── portal/           # Main Portal & Dashboard Hub (tunemavens.com)
│   ├── tunestream/       # Consumer Audio Streaming App (tunestream.co)
│   └── syncmavens/       # Sync Licensing Marketplace (syncmavens.com)
├── packages/
│   ├── shared-ui/        # Shared CSS Tokens, UI Components & Modals
│   └── shared-auth/      # Shared OIDC/PKCE Session Helpers
├── backend/
│   ├── server.py         # Primary FastAPI Application Entry
│   ├── auth.py           # PyJWT Cross-Domain Token Validation
│   ├── routes/           # Domain Routers (sso, match, stream, crm, cms)
│   └── models.py         # Pydantic v2 Data Transfer Models
└── deploy/               # Multi-Domain Hostinger VPS Nginx Configs
```

### 4.2 Layer-by-Layer Technical Specification Matrix

| Tech Layer | Platform Standard | Implementation & Package Specification |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Modular Monorepo Monolith with Isolated Build Targets (<code>dist/portal</code>, <code>dist/tunestream</code>, <code>dist/syncmavens</code>). |
| **Styling System** | Vanilla CSS + Tokens | Custom HSL design tokens, glassmorphism, responsive grid layouts, Outfit/Inter fonts. Zero CSS framework bloat. |
| **Native Packaging** | Capacitor | Wraps web frontend applications for iOS & Android native deployment with native audio drivers. |
| **Backend Engine** | FastAPI (Python 3.11) | ASGI asynchronous web server running Uvicorn workers with non-blocking event loops. |
| **Database Layer** | MongoDB + Motor | Multi-tenant MongoDB replica set cluster using Motor for async Python database I/O. |
| **Object Storage** | AWS S3 / Cloudflare R2 | Direct browser presigned URL upload pipeline for lossless audio stems (WAV/AIFF) and preview clips. |
| **Single Sign-On** | OIDC + PKCE | Custom OAuth2/OIDC SSO server (<code>sso_router.py</code>) issuing PyJWT cookies across <code>.tunemavens.com</code>. |
| **Payment Gateway** | Stripe Connect | Direct payouts, 4-tier entitlements, QR event ticketing scanner, Option 1 (30/25/52.5) & Option 2 (15% agency fee) ledgers. |
| **AI Recommendation** | Claude Sonnet 4.6 | 15s capped recommendation synthesis engine (<code>users_router.py</code>) recommending tools and apps. |
| **Social AI Studio** | Gemini Nano + Sora 2 | Multi-format image (<code>/generate-art</code>) and short-form video clip (<code>/generate-video</code>) campaign generator. |
| **CRM Engine** | Resend API + Inbox | Multi-channel messaging engine dispatching emails via Resend and in-app inbox threads (<code>messages</code>). |
