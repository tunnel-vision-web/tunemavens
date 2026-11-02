# DEVELOPMENT_PLAN.md — TuneMavens

TuneMavens is a **music-business community + marketplace**. Marketplace
phases (1–10) handle transactions; interleaved community phases (2.5,
4.5, 5.5, 6.5) handle the social layer that makes the marketplace
self-reinforcing.

---

## Marketplace phases (1–10)

### Phase 1 · Foundation & Subdomains ✅ SHIPPED
FastAPI backend, Vite React frontend, shared JWT auth, Mongo persistence,
admin console with role-gated tabs, domain-mapping registry.

### Phase 2 · Consumer Audio System (TuneStream) 🔵 P1 Backlog
- `/stream` player, library persistence, tip flow, offline cache metadata.
- Domain Routing: Automatic deployment pipeline to `tunestream.co` and `tunestream.tunemavens.com` from isolated build directory.

### Phase 3 · Creator Pipeline ✅ SHIPPED
- Publishing Election, Distribution Election, OnboardingStripe
- App Marketplace (Your Path / TuneMavens / Native / Intermaven)
- §9.8 AI Recommendation Agent (LLM primary + rules fallback)
- Contract Negotiation subsystem (locked vs negotiable clauses, invite,
  edit proposals, e-sign)

**Immediate follow-ups (P1) inside Phase 3:**
- Split `App.jsx` (~6,447 lines) into `/src/components/{dashboard, landing}`
  modules — marketplace already extracted to `phase3.jsx`.
- Raise the Emergent LLM key budget or swap to `gpt-5.4-mini` so the LLM
  layer actually serves traffic (currently rules layer answers 100%).

### Phase 4 · Record Label Console 🔵 P1
- Roster CSV upload & Multi-file drag and drop audio file ingestion. ✅ SHIPPED
- Manual single-track catalogue uploader UI with validation checks. ✅ SHIPPED
- Catalogue list display showing splits, ISRCs, artist, and action shortcuts linking directly to Splits cascade, Sync licensing, and Domain hosting. ✅ SHIPPED
- Dashboard-wide utility panels search filtering and pagination navigation controls. ✅ SHIPPED
- Sub-brand Landing Pages: Customized dark-theme background colors, custom navigation menus, subdomain mapping alerts, Tidal-inspired sections for TuneStream, and admin configurator panel for promoted acts. ✅ SHIPPED
- Distribution Path C negotiation wizard, catalogue acquisition ledger.

### Phase 5 · DJ Pool Engine 🟡 P2
### Phase 6 · Sync Marketplace (SyncMavens) 🟡 P2
- Sync licensing marketplace (formerly SyncMaster), interactive brief matching, catalog integration.
- Domain Routing: Automatic deployment pipeline to `syncmavens.com` from isolated build directory.
### Phase 7 · Split Cascade Engine ✅ SHIPPED
- Sovereign TuneLedger 7-tier revenue waterfall and micro-royalty settlement engine (§9.32/§9.36).
- Real-time multi-currency conversion (USD, KES, EUR, GBP), M-Pesa B2C and Stripe Express dual-rail routing.
- Drag-and-drop distributor statement CSV parser and 1-click batch cascade settlement.

### Phase 8 · Escrow & Contract Module (MyContracts) ✅ SHIPPED
- Universal MyContracts Smart Legal Vault and Engagement Auto-Generator (§9.39) across Portal, TuneStream, and SyncMavens.
- 6 canonical templates from `COMPENSATION_AND_CONTRACTS.md` (§2 Publishing, §3 Distribution, Sync Licensing, Split Sheets, Live Escrow).
- In-app e-signature execution (elegance script + HTML5 touchscreen/mouse canvas) with `SIG-SHA256` tamper-evident seals and statutory consent.
- Milestone smart escrow management linked directly into creator payout balances (`payoutBalance`).
- Cross-portal state synchronization via custom DOM events and 1-click printable PDF legal export.

### Phase 8.5 · Ecosystem Localization & Multi-Currency Adaptation (Kenya Launch) ✅ SHIPPED
- Synergy Client-Side DOM Localization Engine (`window.SynergyLocalization`, `v=47`) deployed across `apps/portal`, `apps/tunestream`, and `apps/syncmavens` (§9.40 & `docs/LOCALIZATION_ARCHITECTURE_GUIDE.md`).
- Default Kenya (`KE`) market and Kenyan Shilling (`KES` / `KSh`) currency with instant switching across 8 global markets and 8 currencies (`KES`, `TZS`, `UGX`, `NGN`, `ZAR`, `USD`, `GBP`, `EUR`).
- 100% bidirectional English (`EN`) ↔ Kiswahili (`SW`) switching across all landing pages, 5-slide hero carousels, sidebar menu items, collapsed-sidebar tooltips, dashboard apps, and the entirety of all Blog, Help Center, In-App Documentation Modal, and Royalty Guide articles.

### Phase 8.6 · Affiliate System & Instant Onboarding ✅ SHIPPED
- Universal affiliate onboarding flow (`/affiliates`) with vanity referral codes (`?ref=YOURNAME`) and 90-day tracking cookies (`tm_aff_ref`).
- 3% to 12% revenue compensation waterfall calculator and payout rail options (M-Pesa STK, Stripe, PayPal, Unified Credits).
- Automatic login creation upon affiliate registration with role `affiliate` and single-use setup link dispatch.

### Phase 8.7 · Omnichannel Resend Transactional Communication Architecture ✅ SHIPPED
- Production Resend API integration (`re_9rng9mzj_...`) with automated test domain fallback (`TuneMavens <onboarding@resend.dev>`) for immediate verification.
- Persona-tailored welcome emails across all 9 canonical roles with deep dashboard links and one-time SHA-256 confirmation URLs (`/#/verify-email?token=...`).
- Cryptographic password recovery ingress on `LoginView.jsx` (`/#/set-password?token=...`) with single-use 72-hour tokens.
- Diagnostic outbox staging in MongoDB `email_outbox` capturing status, provider HTTP response, and sender telemetry.

### Phase 9 · Ad Injection Platform 🟡 P2
### Phase 10 · Media House Routing 🟡 P2

---

## Community phases (NEW — cross-cutting)

### Phase 2.5 · Identity & Roles ✅ SHIPPED
Ships alongside Phase 2. Turns the current single-role `users.role` field
into a first-class identity layer.

**Deliverables**
- Role picker on signup — full canonical 9 personas + affiliate (`creator`, `podcaster`, `label`, `dj`, `supervisor`, `media_house`, `corporate`, `consumer`, `vc`, `affiliate`) with interactive AI onboarding assistant (`Ayo`).
- Role-specific landing pages for all 9 personas (`/for/creator`, `/for/label`, `/for/dj`, `/for/media-house`, `/for/supervisor`, `/for/consumer`, `/for/corporate`, `/for/podcaster`, `/for/vc`, `/affiliates`).
- Verified pro badge system (admin-verified toggle on the user record).
- Role-based nav / feature gating in the dashboard with `roleAllowed` matrix.
- Single-use cryptographic email verification (`/#/verify-email?token=...`) with SHA-256 tokens and MongoDB `email_verified` tracking.
- One-time password setup links (`/#/set-password?token=...`) and forgot-password recovery.
- Backend: extend `users` model with `roles: string[]` (multi-role allowed), `pro_verified: bool`, and `email_verified: bool`.

### Phase 4.5 · Social Graph Foundation 🟠 P1
Ships alongside Phase 4. The connectivity substrate everything else
plugs into.

**Deliverables**
- `follows` collection (`follower_id`, `followee_id`, `created_at`)
- `likes` / `subscribes` for creator/exec pages
- Activity event fanout: **listens, downloads, tips, deals** feed into
  each connection's home feed (respecting privacy)
- **2nd-degree discovery**: "You're 2 hops from Rick Rubin via Sarah"
- **Privacy Center** — per-signal toggles (listens, downloads, deals,
  follows, 2nd-degree visibility). Default: all public.
- Feed API + home-feed UI

### Phase 5.5 · Community & Wall of Fame 🟠 P1
Ships alongside Phase 5.

**Deliverables**
- `/community` route with a curated grid of featured figures
- Each tile: profile thumbnail, short bio, social links, **auto-fetched
  featured YouTube video** (thumbnail via YouTube oEmbed, video pulled
  via YouTube Data API v3 `search.list` sorted by viewCount)
- Admin composer: enter subject's name + channel handle → system fetches
  metadata → admin approves → invite sent
- **Unclaimed = hidden.** Tile becomes public only after the subject
  clicks the invite, completes the interests modal, and creates a free
  account
- `featured_profiles` collection with state machine:
  `pending → invited → claimed | declined | expired`

### Phase 6.5 · CRM & Growth Engine 🟠 P1
Ships alongside Phase 6. The outbound growth loop.

**Deliverables**
- Admin composer UI (segment picker + editable template + CTA URL picker
  that defaults to the segment's role-landing page)
- **Channels (swappable adapters)**
  - `email` → Resend (only third party; env-configured)
  - `in_app` → native inbox (`messages` collection + WebSocket/polling)
  - `social_dm` → copy-to-clipboard template + "Mark as sent" tracking
    (admin manually posts to Instagram/X)
  - `sms` → deferred (adapter interface reserved, no implementation)
- Campaign object: `campaigns` collection with `segment`, `channels[]`,
  `template`, `cta_url`, `stats`
- Send tracking: `campaign_sends` (per-recipient state machine)
- **In-app inbox** — user-facing `/inbox` route with read/unread state,
  reply-to-admin, threading

---

## Roadmap dependency map

```
Phase 1  ──►  Phase 2  ──►  Phase 4  ──►  Phase 5..10
                │              │
                ▼              ▼
             Phase 2.5    Phase 4.5 (social graph)
             (roles)         │
                             ▼
                          Phase 5.5 (Wall of Fame)
                             │
                             ▼
                          Phase 6.5 (CRM + inbox)
```

Community phases can technically ship in parallel with their host
marketplace phase — they only depend on Phase 2.5 (roles) being in place.

---

## Design principles

### Recommendation Agent (Phase 3 §9.8)

1. **Never block the user.** 15s LLM timeout, silent fallback to rules.
2. **Same output shape regardless of layer** (`source: 'llm' | 'rules'`).
3. **Signals grow over time.** Onboarding seeds, activity refines.
4. **Full-network vision.** Recommends across TuneMavens + Intermaven.
5. **Easy to retake.** Wizard is idempotent; hero shows "Retake wizard."

### Social graph (Phase 4.5)

1. **Public by default, private by choice.** Growth-first, but Privacy
   Center is one click from every profile.
2. **Activity is a first-class citizen.** Listens, downloads, tips, deals
   all fanout to connections' feeds (respecting privacy).
3. **2nd-degree is the moat.** The killer feature isn't "I follow Sarah,"
   it's "Sarah introduced me to the 3 deal-makers I need."
4. **Symmetric by design.** A supervisor and a fan see the same public
   profile. Pro badge signals authority without gating access.

### Wall of Fame (Phase 5.5)

1. **Curation over algorithm.** Admin elects; no ML ranking.
2. **Consent-gated visibility.** Tiles hidden until claimed.
3. **Zero-friction claim.** Invite click → interests modal → free account.
   The Wall of Fame is a *funnel*, not a Wikipedia.
4. **Real presence, not scraped.** YouTube integration surfaces the
   subject's actual current content, not a stale bio.

### CRM & Growth Engine (Phase 6.5)

1. **Composer once, channels many.** All channels share the same segment
   + template + CTA logic; only the delivery adapter differs.
2. **One third party.** Only email (Resend) touches an external API.
   Everything else is self-hosted or manual.
3. **CTAs route anywhere.** Default is the segment's role landing page,
   but any URL on the platform is a valid target.
4. **Editable everything.** Templates are drafts, not scripts. Admin can
   rewrite before sending.

---

## Third-party integration checklist

| Service | Purpose | Phase | Status |
|---|---|---|---|
| Claude Sonnet 4.6 (Emergent) | Recommendation engine | 3 | ✅ Integrated |
| YouTube Data API v3 | Wall of Fame video fetch | 5.5 | ⏳ Pending (needs Google Cloud API key) |
| Resend | Email delivery for welcome, verification & CRM invites | 6.5 & 8.7 | ✅ Configured & Live Tested (HTTP 200 delivery verified via `delivered@resend.dev`, dynamic test domain fallback) |
| ~~Twilio~~ | ~~SMS~~ | — | ❌ Deferred (out of scope for launch) |
| ~~Instagram/X API~~ | ~~Social DM~~ | — | ❌ Never (copy-to-clipboard replaces API integration) |

---

## Unified Layouts & SyncMavens Frontend (Phase 6 Additions)

### Unified Backend Admin Layouts
1. **Ecosystem Parity:** All sub-utilities (TuneStream, SyncMavens) must utilize the identical collapsible sidebar (`dashboard-sidebar`), topbar (`dashboard-topbar`), profile cards, and copyright footer layout structure as the main dashboard portal.
2. **Contextual Branding:** Sidebar logos update automatically according to the active domain target (`TuneStream` logo for tunestream.co, `SyncMavens` logo for syncmavens.com, `TuneMavens` logo for main portal).
3. **Role-Driven Controls:** Menus and tab panels update dynamically according to the active workspace role (e.g. Creator vs Listener in TuneStream).

### SyncMavens Ditto-inspired Frontend & Backend Support
1. **Ditto Music Role Model:** The public landing page at `syncmavens.com` is comprehensively modeled after Ditto Music's "Get Signed" layout to pitch sync licensing opportunities (Netflix, HBO, FIFA, A24) to independent artists. We act as an easily accessible, barrier-free alternative.
2. **Compensation & Advance Model:**
   *   **Pure Placement Waterfall:** We utilize a 90/10 split cascade model (90% to creators, 10% administration/facilitation fee) instead of standard label/aggregator split shares.
   *   **No Catalog Advances:** To guarantee creators maintain 100% ownership control of their catalog publishing rights, **we do not offer upfront catalog sign advances at this stage**.
3. **Interactive Utilities:**
   *   **AI Sync Match Simulator:** A guest-accessible utility that simulates track metadata compatibility scores against active supervisor briefs and outputs a detailed match report.
   *   **Waterfall Splits Calculator:** A dynamic slider-based tool visualizing the sync fee distribution waterfall (Sync fee inputs, Writer/Producer splits, and showing $0 advances).
4. **Unified Sync Admin:** A prominent CTA button routes validated users into the unified sync dashboard containing operations (Briefs, Catalog) and transactions (Pitches, Ledger) views.
5. **Unified Backend Support:** The backend FastAPI server utilizes unified Mongo collections (`briefs`, `pitches`, `catalogs`) to synchronize licensing statuses and splits across all subdomains.

### Communications Hub & Audit Vault and Affiliate Referral Identifiers
1. **Collision-Free Affiliate Codes:** Every affiliate registration attaches a distinct 4-character alphanumeric unique identifier (e.g., `MARCUS-7K3P`, `AFROVIBE-9B2F`) ensuring immutable tracking across 90-day cookie windows.
2. **Cross-Persona Communication Protocols:** Comprehensive event triggers for key activities:
   - Credit balance reloads, spends, and awards wired directly into `TuneLedger` (`ledger_service.record_transaction`).
   - Security alerts on password modifications and setup.
   - Payout disbursement notices across M-Pesa, Stripe, PayPal, and Credits.
   - Affiliate commission awards on referree conversions.
   - Contract invitations, proposals, and cryptographic execution receipts.
3. **Audit Vault & Telemetry Hub:** Unified `communications` database collection with full message history, HTML rendered sandboxes, Resend API status codes, 1-click re-send capabilities, and compliance archiving.
