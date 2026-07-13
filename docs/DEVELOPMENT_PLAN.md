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
### Phase 7 · Split Cascade Engine 🟡 P2 — compensation math from `COMPENSATION_AND_CONTRACTS.md`
### Phase 8 · Escrow & Contract Module 🟡 P2 — expands the Phase 3 contract subsystem with escrow + funds movement
### Phase 9 · Ad Injection Platform 🟡 P2
### Phase 10 · Media House Routing 🟡 P2

---

## Community phases (NEW — cross-cutting)

### Phase 2.5 · Identity & Roles 🟠 P1
Ships alongside Phase 2. Turns the current single-role `users.role` field
into a first-class identity layer.

**Deliverables**
- Role picker on signup — full list (creator, supervisor, label, booking
  agent, manager, exec, DJ, studio, consumer)
- Role-specific landing pages (each role's public marketing surface)
- Verified pro badge system (admin-verified toggle on the user record)
- Role-based nav / feature gating in the dashboard
- Backend: extend `users` model with `roles: string[]` (multi-role allowed)
  and `pro_verified: bool`

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
| Resend | Email delivery for CRM invites | 6.5 | ⏳ Pending (needs Resend API key + verified sending domain) |
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

