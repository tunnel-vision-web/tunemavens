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
4. **[SyncMavens](file:///C:/Users/judit/workspace/tunemaven/docs/DEVELOPMENT_PLAN.md#phase-6-sync-marketplace-syncmavens-p2)** (`syncmavens.com`): The Ditto-inspired sync licensing marketplace connecting independent creators directly with film, TV, gaming, and commercial music supervisors through AI brief matching and a transparent 90/10 split waterfall.

---

## 2. Targeted User Personas & Customer Matrix

Our unified ecosystem caters to 7 canonical user roles across the music industry value chain:

| User Persona | Key Motivations & Needs | Primary Platform Ingress | Key Ecosystem Features Used |
|---|---|---|---|
| **Creators** *(Artists, Producers, Songwriters)* | Catalog distribution, contract safety, sync licensing, AI marketing automation, direct fan monetization | `tunemavens.com` / `intermaven.io` | Split Cascade Engine, AI Recommendation Agent, Mother-EPK Builder, Sync Placement |
| **Record Labels & A&R** | Roster ingestion, multi-file track management, catalog split tracking, automated royalty distribution | `tunemavens.com` (Label Console) | Catalogue Roster CSV Ingestion, Advance Recoupment Ledger, Multi-brand Subdomain Pages |
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

### 2. 90/10 Placement Split & $0 Catalog Advance Model
Unlike traditional sync publishers that demand ownership rights or charge heavy catalog sign-up fees, **SyncMavens** operates on a **pure 90/10 waterfall model** (90% to creators, 10% facilitation fee). Creators maintain 100% ownership control of their copyrights without predatory catalog buyouts.

### 3. Mother-CMS & Shared Token Architecture
**Intermaven** acts as the mother platform driving shared design tokens, multi-tenant UI grids, and localized key overlays across all sub-applications. Updates to the core design system flow seamlessly across all 4 platforms.

### 4. Native AI Business & Social Studio
Creators gain access to built-in AI tools (Claude Sonnet 4.6 Recommendation Agent, Gemini/Sora Social AI Studio) that generate platform-specific creative assets (1:1 square, 9:16 vertical video) tailored to recommended channel paths.

### 5. Shared Single Sign-On (SSO) & Unified Credit Bank
Users sign up once and navigate frictionlessly across `intermaven.io`, `tunemavens.com`, `tunestream.co`, and `syncmavens.com`. Unified Network Credits can be earned from TuneStream listener tips or marketplace sales and spent on AI runs or CRM marketing campaigns across the entire network.

---

## 4. Ecosystem Platform Structure Summary

> [!NOTE]
> All four platforms are built on a shared FastAPI backend monorepo architecture and share a single MongoDB data cluster.

```
+-----------------------------------------------------------------------------------+
|                              INTERMAVEN NETWORK ECOSYSTEM                         |
+-----------------------------------------------------------------------------------+
|  INTERMAVEN (intermaven.io)       |  TUNEMAVENS (tunemavens.com)                  |
|  - Mother-CMS & EPK Builder       |  - Music Marketplace & Roster Portal          |
|  - Social AI Studio (Gemini/Sora) |  - Contract Negotiation & Escrow Subsystem     |
|  - AI Business Suite Catalog      |  - Split Cascade & Advance Ledgers            |
+-----------------------------------+-----------------------------------------------+
|  SYNCMAVENS (syncmavens.com)      |  TUNESTREAM (tunestream.co)                   |
|  - Ditto-inspired Sync Portal     |  - Consumer Audio Streaming Platform          |
|  - 90/10 Placement Split Engine   |  - High-Fidelity Audio Player                 |
|  - AI Sync Match Simulator        |  - Direct Fan Tipping & Offline Library       |
+-----------------------------------------------------------------------------------+
```
