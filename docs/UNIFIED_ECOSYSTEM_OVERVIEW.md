# Unified Ecosystem Overview Document

<div align="center">
  <img src="file:///C:/Users/judit/.gemini/antigravity/brain/cd276e08-5db4-4a17-b41f-7a1bd4f0686b/intermaven_logo.png" alt="Intermaven Parent Platform Logo" width="320" />
</div>

---

## 1. High-Level Vision & Mission

The **Intermaven Network Ecosystem** is a unified, next-generation music-business operational platform and consumer marketplace. Rather than forcing creators, record labels, music supervisors, and fans to fragment their workflows across multiple disconnected third-party tools, our ecosystem combines **AI business tools, direct catalog monetization, sync placement, and consumer streaming** into a single, self-reinforcing network powered by a unified Single Sign-On (SSO) and shared credit engine.

The ecosystem comprises **4 primary interconnected platforms**:

1. **[Intermaven](file:///C:/Users/judit/workspace/tunemaven/docs/DOCUMENTATION.md#917-track-d-social-ai-studio-recommendations--mother-epk-integration)** (`intermaven.io`): The parent ("Mother") platform housing the core AI Business Suite, Mother-CMS, Mother-EPK Builder, and Social AI Studio for automated campaign dispatching and asset generation.
2. **[TuneMavens](file:///C:/Users/judit/workspace/tunemaven/docs/DEVELOPMENT_PLAN.md#marketplace-phases-110)** (`tunemavens.com`): The primary music business community & marketplace hub. Handles creator distribution elections, record label catalog management, contract negotiations, split cascade ledgers, community Wall of Fame, and CRM target marketing.
3. **[TuneStream](file:///C:/Users/judit/workspace/tunemaven/docs/DEVELOPMENT_PLAN.md#phase-2-consumer-audio-system-tunestream-p1-backlog)** (`tunestream.co`): The direct-to-consumer lossless audio streaming and discovery platform. Enables fans to stream catalog tracks, tip artists, and build offline music libraries while feeding streaming metrics back into creator analytics.
4. **[SyncMavens](file:///C:/Users/judit/workspace/tunemaven/docs/DEVELOPMENT_PLAN.md#phase-6-sync-marketplace-syncmavens-p2)** (`syncmavens.com`): The Ditto-inspired sync licensing marketplace connecting independent creators directly with film, TV, gaming, and commercial music supervisors through two transparent licensing options with zero upfront catalog lockups.

---

## 2. Targeted User Personas & Customer Matrix

Our unified ecosystem caters to 7 canonical user roles across the music industry value chain:

| User Persona | Key Motivations & Needs | Primary Platform Ingress | Key Ecosystem Features Used |
|---|---|---|---|
| **Creators** *(Artists, Producers, Songwriters)* | Catalog distribution, contract safety, sync licensing, AI marketing automation, direct fan monetization | `tunemavens.com` / `intermaven.io` | Split Cascade Engine, AI Recommendation Agent, Mother-EPK Builder, Sync Placement |
| **Record Labels & A&R** | Roster ingestion, multi-file track management, catalog split tracking, automated royalty distribution | `tunemavens.com` (Label Console) | Catalogue Machine CSV Ingestion, Advance Recoupment Ledger, Multi-brand Subdomain Pages |
| **Music Supervisors** *(Film, TV, Gaming)* | Rapid access to cleared, high-quality audio stems, transparent licensing splits, zero-friction brief matching | `syncmavens.com` | AI Sync Match Simulator, Interactive Brief Index, Stems Licensing Vault |
| **DJs & Studio Engineers** | High-bitrate audio pools, studio mastering previews, track stems access | `djs.tunemavens.com` | DJ Pool Engine, Mastering Preview Testbed, Lossless Audio Ingestion |
| **Media Houses & Agencies** | Programmatic content acquisition, bulk sync licensing, customized sub-brand portals | `media.tunemavens.com` | Media House Routing, Bulk Contract Subsystem, Corporate Billing |
| **Everyday Listeners & Fans** | High-fidelity audio streaming, direct artist discovery, tipping, offline playback | `tunestream.co` | Lossless Stream Player, Direct Artist Tipping, Social Graph Activity Feed |
| **Corporate & Enterprise** | White-label branding, customized workflow permissions, API integrations | `corporate.tunemavens.com` | 4-Tier Entitlement Gating, Multi-Tenant CMS Overlays, Dedicated API |

---

## 3. Unique Market Positioning & Competitive Advantage

Existing industry solutions operate in silos: DistroKid handles distribution, Spotify controls consumer streaming, Sync agencies take massive cuts with upfront catalog locks, and Mailchimp handles CRM. 

The **Intermaven Ecosystem** disrupts this model through **5 core competitive advantages**:

### 1. Closed-Loop Creator-to-Consumer Pipeline
Tracks ingested via **TuneMavens** flow instantly into **SyncMavens** for licensing pitches, **TuneStream** for consumer streaming, and **Intermaven** for AI social marketing—eliminating multi-platform friction and third-party aggregation delays.

### 2. Dual Licensing Frameworks & Exact Waterfall Breakdown (Option 1 & Option 2)
Unlike traditional sync publishers that lock up catalogs with advances and seize publishing rights, **SyncMavens** offers **two transparent, artist-friendly licensing frameworks with exact waterfall payouts**:
* **Option 1: Guaranteed Placements (Agency Partner Network)**  
  * **30% Agency Fee (Off the Top)**: Paid to agency partners who secure the television, film, or commercial contract.
  * **25% SyncMavens Admin Fee**: Taken from the remaining 70% balance (equaling 17.5% gross).
  * **52.5% Net Creator Royalty Pool**: Paid directly to creator team (split dynamically between Writer & Producer).
  * **100% Writer & Composer Publishing Share Retained**: Creator retains 100% of their publishing copyrights.
* **Option 2: Sync Brief AI & 'Sync Ready' Gallery (Direct Marketplace Model)**  
  * **15% Agency Fee Paid to SyncMavens**: Flat 15% agency fee retained by SyncMavens for direct AI brief matching, indexing, and supervisor clearance.
  * **85% Direct Net Creator Payout**: 85% of buyout fees flow directly to creator split ledgers.
  * **Automated AI Indexing**: Metadata tagging, 45-second audio previews, and secure stem vault indexing.
* **$0 Upfront Catalog Sign Advances**: We do not offer advances, keeping our interests 100% aligned with creators—we only make money when we secure placements.

### 3. Mother-CMS & Shared Token Architecture
**Intermaven** acts as the mother platform driving shared design tokens, multi-tenant UI grids, and localized key overlays across all sub-applications. Updates to the core design system flow seamlessly across all 4 platforms.

### 4. Native AI Business & Social Studio
Creators gain access to built-in AI tools (Claude Sonnet 4.6 Recommendation Agent, Gemini/Sora Social AI Studio) that generate platform-specific creative assets (1:1 square, 9:16 vertical video) tailored to recommended channel paths.

### 5. Bandzoogle-Style Creator Web Worlds & 20 Pre-Populated EPK Templates
EPKs in the Intermaven Network are not simple modal popups or static card previews—they function as **fully functional, standalone independent Creator Web Worlds** (`/epk/:username` or `username.tunemavens.com`).
* **Immersive Navigation**: Clicking "View EPK" anywhere in the network transitions fans directly into the artist's dedicated visual universe.
* **20 Pre-Populated Theme Templates**: 20 sleek, tech-forward design templates (ranging from *Cyberpunk Neon* and *Afrobeat Gold* to *Ambient Glass* and *Lo-Fi Chill*) pre-configured with creator assets.
* **8 Standard Customizable Sections**: Home, Bio, Shows (Ticketing), Videos (YouTube v3), Store (Merch/Digital Downloads), Press Kit (Stems/Tech Rider/One-Sheet PDF), Contact, and Fan Club.
* **DOM Layout Flexibility & AI Assistance**: Dynamic DOM layouts (Full-Screen Parallax, Split Column, Floating Glassmorphism) with built-in AI assistance for bio writing, palette generation, and promo clips.
* **Smart CRM Fanbase Data Retention**: All fan sign-ups, ticket purchases, and merch orders captured on creator Web Worlds automatically populate the creator's cohort in the **Intermaven Smart CRM** for direct multi-channel communication.
* **Sleek Social Footer**: Styled social icon bar linking to Instagram, TikTok, YouTube, Spotify, Apple Music, and Discord.

### 6. Shared Single Sign-On (SSO) & Unified Credits Engine (Zero Monthly Subscription Fees)
Users authenticate once and navigate frictionlessly across `intermaven.io`, `tunemavens.com`, `tunestream.co`, and `syncmavens.com`.
* **Zero Monthly Subscriptions:** The entire ecosystem rejects monthly recurring fees. Every application, seat package, and operational tool runs on non-expiring **Unified Network Credits**.
* **Usage-Based Consumption:** Users load credits calibrated to each package or tool requirement. Automatic reload triggers prompt creators and labels when balances approach replenishment thresholds.
* **Universal Gateway Interoperability:** Complete reload payment protocols are integrated across all platforms, accepting instant M-Pesa mobile money (KES) and Stripe credit/debit card checkout (USD/EUR/GBP).
* **Earn & Burn Utility:** Credits earned from TuneStream listener tips, sync licensing placements, or digital catalog sales can be instantly spent on AI generative runs, Mother-EPK hosting, CRM ad campaigns, or team seat expansions.

### 7. Sovereign TuneLedger & Split Cascade Waterfall Engine
Replacing fragmented spreadsheets and opaque distributor statements, **TuneLedger** is the platform's flagship 7-tier revenue waterfall and micro-royalty settlement engine:
* **7-Tier Mathematical Waterfall:** Gross Revenue Intake & Track Linkage → Tier 1: Platform & DSP Collection Administration (10%) → Tier 2: Master & Label Share (Contractual Imprint %) → Tier 3: Isolated Recoupable Production Offsets → Tier 4: Management & Legal Rep Commission (0-15%) → Tier 5: Multi-Collaborator Split Distribution (Dynamic 100% Artist Pool) → Tier 6: Multi-Currency Settlement Routing.
* **Zero Cross-Collateralization:** Production debts and recording advances are strictly isolated to individual releases, protecting creators from having catalog earnings cannibalized by separate project debt.
* **Real-Time Multi-Currency Engine:** Live mathematical conversion between **USD ($)**, **KES (KSh)**, **EUR (€)**, and **GBP (£)** across all calculations, tables, vouchers, and balances.
* **Instant Dual-Rail Payout Routing:** Instant disbursement via **M-Pesa B2C Mobile Money** (instant Safaricom wallet deposit in Kenya) and **Stripe Express** (global ACH, SEPA, and Faster Payments).
* **Digital Split Sheets Vault & Signature Locking:** Permanent catalog linkage with verified ISRC/ISWC codes, tamper-resistant collaborator percentage locking, and digital contract signature verification.
* **Distributor Statement Ingestion & CSV Auto-Matching Desk:** Drag-and-drop parsing of raw CSV/TSV statements from DistroKid, TuneCore, Spotify for Artists, Apple Music, and FUGA with automated ISRC matching and 1-click batch cascade settlement.
* **5-Step Bidirectional Wizard & Click-to-Jump Companion:** The waterfall builder organizes configuration into 5 focused, uncluttered steps with bidirectional navigation footers (`← Back` / `Continue →`), an interactive top stepper progress bar, and a synchronized live breakdown panel with two-way click-to-jump navigation.
* **Built-in Royalty University:** Complete interactive education on Master vs. Publishing copyrights, ethical recoupment, statutory compliance with African CMOs (MCSK, PRISK, KAMP) and international PROs (ASCAP, BMI, SESAC, PRS), and in-studio split protocol.

### 8. Institutional Team Roster & Multi-Seat Governance Engine
Both the **Site Admin** operations desk and **Record Label** workspace incorporate institutional team governance:
* **Platform-Specific Operational Job Roles:** 9 dedicated site admin roles (Network Operations Director, DDEX QA Head, Statutory Royalty Auditor, Escrow Settlement Officer, Sync Curator, Corporate Ads Traffic Manager, InfoSec & Compliance Lead, Ecosystem Onboarding Director, Infrastructure Telemetry Engineer) and label collaborator roles (A&R Director, Royalty Accountant, Marketing Specialist, Legal Representative).
* **4-Tier Security Clearance Model:** Clear hierarchy ranging from Tier 1 (Super Admin - root killswitches, `#a855f7`), Tier 2 (Operational Director - department write & payouts, `#0ea5e9`), Tier 3 (Platform Specialist - workflows & scheduling, `#10b981`), to Tier 4 (Read-Only Auditor - compliance exports, `#f59e0b`).
* **36 Granular Permission Scopes:** Fine-grained authorization governing infrastructure clusters, DDEX QA, statutory mechanical ledgers, payout releases, sync brief approvals, and audio CDN telemetry.
* **Full Member Lifecycle Management:** Authorized administrators and label owners can provision seats, modify operator assignments, suspend active access instantly without destroying audit records, and revoke seats to free capacity.
* **Integrated Signed Artist Subdomains:** Labels manage signed talent directly linked to Bandzoogle-style creator Web Worlds (e.g. `ndufo.tunemavens.com`, `aisha.tunemavens.com`), facilitating frictionless A&R catalog oversight.

### 9. MyContracts Smart Legal Vault, Engagement Auto-Generator & E-Signature Protocol
Branded across all three applications as **MyContracts**, this subsystem provides frictionless, institutional-grade legal deal-making, execution, and escrow settlement:
* **6 Authoritative Legal Templates:** Sourced directly from `COMPENSATION_AND_CONTRACTS.md`, including §2.1 Standard Publishing Administration (50/50 Pub Admin, 100% Writer Retained), §2.2 Co-Publishing & Exclusive Sync Representation, §2.3 Catalog Acquisition & Master Buyout, §3.1 Flat-Fee DSP Distribution (100% Net DSP Retained), §3.2 Native Rev-Share Distribution (55/45), §3.3 Commercial Sync Licensing, Digital Split Sheets, and Live Performance Escrow agreements.
* **4-Step Engagement Auto-Generator:** Intuitive wizard guiding creators and business partners through Template Selection, Parties & Roles, Commercial Terms & Zero Cross-Collateralization guarantees, and Dynamic Contract Generation.
* **In-App E-Signature & Tamper-Evident Seals:** Dual-mode signing via calligraphic script formatting or HTML5 touchscreen/mouse stylus canvas drawing, paired with `SIG-SHA256` digital cryptographic sealing, exact timestamps, and statutory ESIGN/UETA consent.
* **Milestone Escrow Integration:** Financial considerations and performance advances are held safely in escrow and disbursed into the creator's payout balance (`payoutBalance`) with 1-click settlement upon verified milestone completion.
* **Ecosystem-Wide Deployment:** Natively embedded across TuneMavens Portal, TuneStream (`/contracts` sidebar with active badge), and SyncMavens (`/escrow` sidebar), with reactive DOM cross-tab event synchronization and print-optimized PDF export.

---

## 4. Ecosystem Platform Structure Summary

> [!NOTE]
> All four platforms are built on a shared FastAPI backend monorepo architecture, powered by a single MongoDB data cluster, and unified by the Zero-Monthly-Fee Network Credits Engine.

```
+-----------------------------------------------------------------------------------+
|                              INTERMAVEN NETWORK ECOSYSTEM                         |
+-----------------------------------------------------------------------------------+
|  INTERMAVEN (intermaven.io)       |  TUNEMAVENS (tunemavens.com)                  |
|  - Mother-CMS & EPK Builder       |  - Music Marketplace & Roster Portal          |
|  - Social AI Studio (Gemini/Sora) |  - TuneLedger & Split Cascade Studio (7-Tier) |
|  - AI Business Suite Catalog      |  - Site Admin & Label Multi-Seat Rosters      |
|  - Universal Credit Reload Bank   |  - MyContracts Smart Legal Vault & Escrow     |
+-----------------------------------+-----------------------------------------------+
|  SYNCMAVENS (syncmavens.com)      |  TUNESTREAM (tunestream.co)                   |
|  - Ditto Sync Portal & Brief AI   |  - Consumer Audio Streaming Platform          |
|  - Option 1: Agency (30/25/52.5)  |  - High-Fidelity Audio Player & Offline Cache |
|  - Option 2: Direct (15% Agency)  |  - Direct Fan Tipping & Payout Wallets        |
|  - MyContracts & Sync Escrow Hub  |  - MyContracts Artist Deal Portal & E-Sign    |
+-----------------------------------------------------------------------------------+
```


