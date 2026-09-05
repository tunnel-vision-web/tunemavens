# DOCUMENTATION.md — TuneMavens Platform Reference

Canonical technical reference for the TuneMavens build. Sections §9.1–§9.7
are inherited from the shared `intermaven` platform documentation.
Sections §9.8+ are TuneMavens-specific.

Current focus: §9.8 (App Marketplace + Recommendation Agent — SHIPPED)
plus §9.9–§9.12 (Identity, Social Graph, Community, CRM — IN PLAN).

> [!NOTE]
> **Design Standards & Guidelines:** For the canonical reference on styling tokens, typography, buttons, header/sidebar behaviors, card layouts, scrollbars, and animations used across the TuneMavens ecosystem, see [DESIGN_STANDARDS.md](file:///c:/Users/judit/workspace/tunemaven/docs/DESIGN_STANDARDS.md).

---

## §9.5 — Landing Page Map & "Perfect For" Sidebar  ✅ SHIPPED (sidebar) / 🟠 P1 (role pages)

### 9.5.1 Landing page inventory

All public marketing surfaces. Every route in this table shares the
persistent **"Perfect for" sidebar** (§9.5.2) on desktop.

| Route | Purpose | Audience | Status |
|---|---|---|---|
| `/` | Root marketing (Music Operations & AI Suite) | General / Intermaven brand | ✅ Shipped |
| `/native-apps/tunemavens` | **tunestream listeners app landing — THE main consumer landing** | Consumers / fans | ✅ Shipped |
| `/native-apps/creator-companion` | tunecompanion native app | Creators (mobile promo) | ✅ Shipped |
| `/native-apps/tunepay` | tunepay native app | Merchants | ✅ Shipped |
| `/native-apps` | Gallery of all native apps | All | ✅ Shipped |
| `/tools` | AI Tools catalogue | All | ✅ Shipped |
| `/apps` | Dashboard apps catalogue | All | ✅ Shipped |
| `/pricing`, `/about`, `/help` | Supporting pages | All | ✅ Shipped |
| `/for/creator` | Role landing — Creators (Artists / Podcasters / DJs) | Creators | 🟠 Stub (Phase 2.5 = full page) |
| `/for/exec` | Role landing — Execs (Label / A&R / Industry) | Execs | 🟠 Stub |
| `/for/supervisor` | Role landing — Music Supervisors (sync) | Supervisors | 🟠 Stub |
| `/for/consumer` | Redirects to `/native-apps/tunemavens` | Consumers | 🟠 Planned redirect |
| `/for/booking-agent` | Role landing — Booking Agents | Agents | 🟠 Stub |
| `/for/manager` | Role landing — Managers | Managers | 🟠 Stub |

**Rule of thumb:** every `/for/{role}` route eventually gets a hand-crafted
marketing page in **Phase 2.5 · Identity & Roles**. Until then, the
`RoleLandingView` component in `App.jsx` renders a minimal role-tuned
hero so links from the sidebar and CRM invites don't 404.

### 9.5.2 "Perfect for" sidebar — persistent left rail

**Component:** `src/components/PerfectForSidebar.jsx`
**Rendered by:** `App.jsx` (top level, right after `<Navbar/>`; self-guards
via route allow-list)
**Route allow-list:** `/`, `/pricing`, `/about`, `/help`, `/tools`, `/apps`,
`/native-apps`, `/native-apps/*`, `/for/*`. Never renders on the dashboard,
login, or register routes.

**Layout**
- Desktop (≥961px): fixed left rail, **1/4 viewport width** (min 240px,
  max 320px), full remaining viewport height. Main content shifts right
  via `padding-left` on `.app-landing-wrapper` (uses CSS `:has()`).
- Mobile (<961px): hidden. A horizontal picker will replace it in a
  later pass (deliberately out of scope for v1).

**Header** — "PERFECT FOR" (uppercase, 11px, letter-spaced, muted grey).

**Tiles** — one per role, in this order:

| Order | Role | Route | Accent |
|---|---|---|---|
| 1 | Creators (Artists · Podcasters · DJs) | `/for/creator` | `--cyan` `#22d3ee` |
| 2 | Execs (Label · A&R · Industry) | `/for/exec` | `--purple` `#8b5cf6` |
| 3 | Music Supervisors (Sync for film & TV) | `/for/supervisor` | `--am` `#f59e0b` |
| 4 | Consumers (Everyday listeners) | `/native-apps/tunemavens` | `--gr` `#10b981` |
| 5 | Booking Agents (Book & represent live acts) | `/for/booking-agent` | `--blue` `#2563eb` |
| 6 | Managers (Day-to-day artist teams) | `/for/manager` | `#ef4444` |

**Tile spec**
- Square (`aspect-ratio: 1/1`), **3px border-radius**.
- Flat background (`#131a2e`) with subtle border. No gradients.
- Contents (vertically stacked, horizontally centred):
  1. Logo (currently a `lucide-react` icon placeholder; real logos plug
     into `PERFECT_FOR_ROLES[i].Icon` later)
  2. Label (13px, bold Outfit)
  3. Short description (10px, muted)
- Hover: background swaps to `--pf-accent` (flat, no gradient), label +
  sub swap to dark ink for contrast, subtle `translateY(-2px)` lift +
  accent shadow.
- Active (current route): same as hover but persistent — signals "you
  are here."
- Keyboard focus: 2px outlined ring in the tile's accent colour.

**Entrance animation**
- Each tile enters with `pfTileSlideIn` (620ms cubic-bezier easing):
  slides down from `translateY(-28px)`, fades in 0 → 1.
- Staggered by 80ms per tile after a 120ms opening beat — cascades
  top-to-bottom.
- Honours `prefers-reduced-motion: reduce` (falls back to static).

**Data-testids**
- `perfect-for-sidebar` — root `<aside>`
- `perfect-for-header` — the "Perfect for" `<h3>`
- `perfect-for-tile-{key}` — each tile (`creator`, `exec`, `supervisor`,
  `consumer`, `booking-agent`, `manager`)
- `role-landing-{role}` — role landing wrap
- `role-landing-not-found` — 404 fallback when the URL role is unknown

**CRM CTA default**
Any campaign in the CRM composer (§9.12) that targets a role segment
defaults its CTA URL to that segment's landing page from the table
above. Admins can override to any URL on the platform.

---

## §9.6 — User Model

`users` collection:

```
{
  _id: ObjectId,
  email: string,
  password_hash: string,
  name: string,
  brand_name: string?,

  // Multi-role support (Phase 2.5)
  roles: ('creator' | 'label' | 'dj' | 'studio' | 'supervisor'
        | 'booking_agent' | 'manager' | 'executive'
        | 'consumer' | 'admin')[],
  primary_role: string,                   // Which role's landing page they see by default
  pro_verified: bool,                     // Admin-verified pro badge (Phase 2.5)

  country: string?,                       // ISO 3166-1 alpha-2
  plan: 'free' | 'starter' | 'pro' | 'enterprise',
  credits: number,                        // Unified Network Credits
  apps: string[],                         // Activated app slugs (§9.8)
  dashboard_layout: dict?,

  // Social graph (Phase 4.5)
  bio: string?,
  avatar_url: string?,
  cover_url: string?,
  social_links: dict?,                    // { instagram, x, youtube, tiktok, spotify, ... }
  privacy_settings: dict?,                // See §9.10 Privacy Center

  created_at: datetime,
  updated_at: datetime
}
```

`apps[]` is the single source of truth for **every activation surface**:
TuneMavens dashboard panels, Intermaven Network native apps, and
Intermaven.io platform tools.

---

## §9.7 — Deal Collections

- `publishing_deals` — Publishing tier election with audit trail
  (`status: active | superseded | terminated`, `superseded_at`)
- `distribution_deals` — DSP distribution path with same audit-trail semantics
- `catalogue_acquisitions` — advance / recoupment ledger stub
- `contracts` — Contract Negotiation subsystem (locked vs negotiable clauses,
  invitees, proposals, e-signatures) — see §9.8.7

---

## §9.8 — App Marketplace + AI Recommendation Agent  ✅ SHIPPED

*(Unchanged from prior revision — see PR history.)*

### 9.8.1 App catalogue
Three groups, all persisted through `users.apps[]`:
- **TuneMavens dashboard apps** — internal panels
- **Native Apps** — marketing landing pages (`/native-apps/...`)
- **Intermaven Platform** — tools on intermaven.io (`window.open` with
  shared JWT cookie)

Slugs live in `src/lib/appCatalog.js`, `src/lib/nativeApps.js`, and
`src/lib/intermavenPlatformApps.js`. Backend allow-list mirror:
`backend/routes/users_router.py::ALLOWED_APP_SLUGS`.

### 9.8.2 Onboarding questionnaire
`onboarding_responses` — keyed by `user_id`, upserted. Multi-select
`primary_goal` and `revenue_focus` arrays; every question has an
`{key}_other` free-text sibling for the LLM to interpret.

### 9.8.3 Activity signals
`activity_events` — append-only. `kind ∈ { tab_visit, deal_created,
app_activated, app_deactivated, stripe_progress }`. Aggregated by
`_activity_summary(user_id)`.

### 9.8.4 Recommendation Agent
Two-layer synthesis: **LLM primary** (Claude Sonnet 4.6, 15s cap, strict
JSON) with **rules fallback** (deterministic scorer). Always returns
picks. Output: `[{ slug, rationale, priority, source: 'llm' | 'rules' }]`.

### 9.8.5 UX surfaces
- **OnboardingStripe** — top-of-dashboard checklist
- **App Marketplace › Your Path tab** (default) — Recommended for you hero
- **Marketplace tabs**: TuneMavens Apps / Native Apps / Intermaven Platform

### 9.8.6 API surface
```
GET    /api/users/me/apps                      → string[]
POST   /api/users/me/apps                      → string[]    body: { slug }
DELETE /api/users/me/apps/{slug}               → string[]
GET    /api/users/me/onboarding                → OnboardingResponse | null
POST   /api/users/me/onboarding                → OnboardingResponse
POST   /api/users/me/activity                  → { ok: true }
GET    /api/users/me/recommendations?limit=N   → Recommendation[]
```

### 9.8.7 Contract Negotiation subsystem
Industry-standard clause templates for `publishing`, `distribution`,
`catalogue_acquisition`. Locked (non-negotiable) vs negotiable clauses.
Invite counterparties by email + shareable link (WhatsApp / SMS / email).
Propose edits, accept/reject, e-sign. Implemented in
`backend/services/contract_templates.py` and `backend/routes/contracts.py`.

---

## §9.9 — Identity & Roles  🟠 P1 (Phase 2.5)

TuneMavens is a multi-role community, so every user carries a
`roles: string[]` array — a supervisor who also DJs picks both.

### 9.9.1 Role catalogue
```
creator | label | dj | studio | supervisor
| booking_agent | manager | executive | consumer | admin
```

### 9.9.2 Role-specific landing pages
Each role has a public marketing landing page at `/for/{role}` with
role-tuned hero copy, testimonials, and CTAs. CRM invites default their
CTA to the recipient's `primary_role` landing page.

### 9.9.3 Pro-verified badge
Admin-only field (`users.pro_verified`). Shown as a badge on public
profiles. Signals authority but never gates access — every profile is
equally visible unless the owner has enabled industry-only mode in the
Privacy Center (discouraged; §9.10).

### 9.9.4 API surface
```
GET    /api/users/me/roles                     → string[]
PATCH  /api/users/me/roles                     → string[]    body: { roles: string[], primary_role: string }
POST   /api/admin/users/{id}/pro-verify        → { pro_verified: true }
GET    /api/for/{role}                         → LandingPageMeta   (role landing metadata)
```

---

## §9.10 — Social Graph  🟠 P1 (Phase 4.5)

### 9.10.1 Data model
```
follows: { follower_id, followee_id, kind: 'follow' | 'subscribe', created_at }
likes:   { user_id, target_kind: 'post' | 'profile' | 'song', target_id, created_at }

// Fanout stream (append-only, TTL-indexed for the home feed)
activity_events (extended from §9.8.3):
  kind ∈ { tab_visit, deal_created, app_activated, app_deactivated,
           stripe_progress,
           // New in Phase 4.5:
           listen, download, tip, follow, like, subscribe,
           contract_signed, wall_of_fame_featured }
  visibility: 'public' | 'connections' | 'private'   // Derived from Privacy Center
```

### 9.10.2 Privacy Center
Per-signal toggles stored on the user record:
```
users.privacy_settings = {
  listens:      'public' | 'connections' | 'private',
  downloads:    'public' | 'connections' | 'private',
  tips:         'public' | 'connections' | 'private',
  deals:        'public' | 'connections' | 'private',
  follows:      'public' | 'connections' | 'private',
  second_degree_visible: bool,   // Whether OTHERS can see YOU through their friends
  industry_only_profile: bool    // Discouraged toggle — profile visible to pro_verified only
}
```
Defaults: all `public`, `second_degree_visible: true`, `industry_only_profile: false`.

### 9.10.3 2nd-degree discovery
`GET /api/graph/second-degree?target_kind=deal_maker` returns users you
are 2 hops from, filtered by role and by mutual friend. Powers the
"Deal-makers your friends know" panel.

### 9.10.4 Home feed
`GET /api/feed?cursor=...` returns a merged, chronological stream of:
- Direct follows' activity (listens, downloads, tips, deals — filtered by their privacy)
- Subscribed pages' new posts
- Wall of Fame highlights
- Suggested connections (2nd-degree)

### 9.10.5 API surface
```
POST   /api/users/{id}/follow                  → { following: true }
DELETE /api/users/{id}/follow                  → { following: false }
POST   /api/users/{id}/subscribe               → { subscribed: true }
POST   /api/likes                              → { liked: true }        body: { target_kind, target_id }
GET    /api/users/me/privacy-settings          → PrivacySettings
PATCH  /api/users/me/privacy-settings          → PrivacySettings
GET    /api/feed                               → FeedItem[]
GET    /api/graph/second-degree                → User[]                 query: ?role=&limit=
```

---

## §9.11 — Community & Wall of Fame  🟠 P1 (Phase 5.5)

### 9.11.1 Data model
```
featured_profiles: {
  _id,
  subject_name: string,               // "Rick Rubin"
  subject_email: string?,             // Where the invite goes
  youtube_channel_handle: string,     // "@rickrubin" or channel_id
  youtube_video_id: string?,          // Auto-populated by refresh job
  youtube_thumbnail_url: string?,     // Ditto
  bio: string,
  social_links: dict,
  claimed_user_id: ObjectId?,         // Set when subject accepts and creates an account
  state: 'pending' | 'invited' | 'claimed' | 'declined' | 'expired',
  invited_at: datetime?,
  claimed_at: datetime?,
  visible: bool,                      // Derived: true only if state == 'claimed'
  created_by_admin_id: ObjectId,
  created_at: datetime,
  updated_at: datetime
}
```

### 9.11.2 YouTube integration
**Provider:** YouTube Data API v3
**Auth:** Google Cloud API key (server-side; free tier 10,000 units/day)
**Cost per feature:** ~101 units per `search.list` (100 for search + 1
for videos.list). Well under quota for the Wall of Fame use case.

**Fetch flow (server-side job):**
1. `search.list?channelId={id}&order=viewCount&maxResults=1` → top video
2. `videos.list?id={video_id}&part=snippet,statistics` → title, thumbnail,
   view count
3. Cache result on `featured_profiles`. Refresh nightly.

### 9.11.3 Invite claim flow
1. Admin creates a `featured_profiles` entry (state: `pending`)
2. Admin clicks "Send invite" → CRM (§9.12) delivers via preferred channel
3. Invite CTA lands on `/wall-of-fame/claim/{token}`
4. Subject completes interests modal (Phase 3 onboarding wizard, prefilled)
5. Free account created → `featured_profiles.state = claimed`,
   `featured_profiles.visible = true`
6. Tile now renders publicly at `/community/wall-of-fame`

### 9.11.4 UX surfaces
- **`/community/wall-of-fame`** — public grid, only `visible == true` tiles
- **Admin `/admin/community`** — full CRUD of `featured_profiles`,
  including preview of unclaimed tiles

### 9.11.5 API surface
```
GET    /api/community/wall-of-fame                     → FeaturedProfile[]  (visible only)
GET    /api/admin/wall-of-fame                         → FeaturedProfile[]  (all states)
POST   /api/admin/wall-of-fame                         → FeaturedProfile    body: { subject_name, channel_handle, ... }
POST   /api/admin/wall-of-fame/{id}/invite             → { invited: true }
POST   /api/admin/wall-of-fame/{id}/refresh-youtube    → FeaturedProfile
POST   /api/community/wall-of-fame/claim/{token}       → { user_id, redirect: '/dashboard' }
```

---

## §9.12 — CRM & Growth Engine  🟠 P1 (Phase 6.5)

### 9.12.1 Data model
```
campaigns: {
  _id,
  name: string,
  segment: {
    roles: string[]?,               // Filter by role
    country: string?,
    plan: string?,
    pro_verified: bool?,
    custom_query: dict?             // Mongo query for advanced segmentation
  },
  channels: ('email' | 'in_app' | 'social_dm')[],
  template: {
    subject: string,                // For email + in_app
    body_markdown: string,          // Rich text with {{name}} {{role}} tokens
    cta_label: string,
    cta_url: string                 // Defaults to /for/{primary_role}
  },
  stats: { sent, delivered, opened, clicked, replied, failed },
  created_by_admin_id, created_at, updated_at,
  scheduled_at: datetime?,
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused'
}

campaign_sends: {
  campaign_id,
  user_id: ObjectId?,               // null for external prospects
  external_email: string?,          // For invites to non-users (Wall of Fame subjects)
  channel: 'email' | 'in_app' | 'social_dm',
  state: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'failed' | 'marked_sent',
  attempts: int,
  sent_at, delivered_at, opened_at, clicked_at
}

messages (in-app inbox):
{
  _id,
  thread_id,                        // Groups a conversation
  from_user_id,                     // null == system/admin campaign
  to_user_id,
  campaign_id?,
  subject, body_markdown, cta_label?, cta_url?,
  read_at: datetime?,
  created_at
}
```

### 9.12.2 Channel adapters
| Channel | Adapter | Third party |
|---|---|---|
| `email` | Resend (`resend-python`) | ✅ Resend (required) |
| `in_app` | `messages` collection + WebSocket/polling | — |
| `social_dm` | Renders template → clipboard button + "Mark as sent" | — (admin posts manually) |
| `sms` | *(interface reserved, not implemented)* | Deferred |

Adapter interface (Python):
```python
class ChannelAdapter(Protocol):
    def send(self, send: CampaignSend, template: Template) -> SendResult: ...
```

### 9.12.3 Composer UI (admin)
1. **Segment** — role multi-select, country, plan filters (live count).
2. **Channels** — check email, in_app, social_dm.
3. **Template** — rich-text editor with token autocomplete (`{{name}}`,
   `{{role}}`, `{{cta_url}}`).
4. **CTA URL picker** — dropdown of all platform routes; defaults to the
   segment's role landing page (`/for/{primary_role}`).
5. **Preview** — rendered per channel with sample recipient.
6. **Schedule/send** — immediate or scheduled.

### 9.12.4 In-app inbox
User-facing `/inbox` route. Shows all `messages` where the user is
`to_user_id`. Supports:
- Read/unread state
- Reply to system messages (creates a thread)
- Filter by campaign
- CTA button rendered inline

### 9.12.5 API surface
```
# Admin composer
GET    /api/admin/campaigns                    → Campaign[]
POST   /api/admin/campaigns                    → Campaign
PATCH  /api/admin/campaigns/{id}               → Campaign
POST   /api/admin/campaigns/{id}/preview       → { html, text, in_app_preview, social_dm_preview }
POST   /api/admin/campaigns/{id}/send          → { queued: number }
GET    /api/admin/campaigns/{id}/sends         → CampaignSend[]
POST   /api/admin/campaigns/{id}/sends/{sid}/mark-sent  → { marked_sent: true }  # For social_dm

# User inbox
GET    /api/users/me/inbox                     → Message[]      query: ?unread=true&thread_id=
POST   /api/users/me/inbox/{id}/read           → { read: true }
POST   /api/users/me/inbox/{id}/reply          → Message        body: { body_markdown }

# Public webhook (Resend delivery events)
POST   /api/webhooks/resend                    → { ok: true }   # Updates CampaignSend state
```

### 9.12.6 Environment variables
```
RESEND_API_KEY=...
RESEND_FROM_EMAIL="TuneMavens <hello@tunemavens.com>"
RESEND_WEBHOOK_SECRET=...
YOUTUBE_API_KEY=...
```

---

## Third-party integrations summary

| Service | Section | Env vars | Free tier |
|---|---|---|---|
| Claude Sonnet 4.6 (Emergent) | §9.8.4 | `EMERGENT_LLM_KEY` | Prepaid budget |
| YouTube Data API v3 | §9.11.2 | `YOUTUBE_API_KEY` | 10,000 units/day |
| Resend | §9.12.2 | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_WEBHOOK_SECRET` | 3,000 emails/mo |

**Explicitly NOT integrated:**
- SMS providers (Twilio, etc.) — deferred; interface reserved
- Instagram/X APIs — never; social DM is admin copy-to-clipboard by design

---

## §9.13 — Platform UI & Layout Rules

### 9.13.1 App Cards Horizontal Centering Rule
To maintain visual consistency and clean design alignment across all marketing, native, and platform app surfaces:
- **Horizontal Centering:** All content within any app cards (such as `.app-card`, `.native-app-card`, and custom app showcase cards) must be centered horizontally within its box.
- **Card Flex Styling:** Cards should use flex layouts with `flex-direction: column`, `align-items: center`, and `text-align: center`.
- **Inner elements:** Header groupings, target badges, icons/logos, paragraphs, bullet lists (`.native-app-features`), and CTA action store buttons must center align within the card boundaries.
- **Exceptions:** General dashboard admin panel cards that display complex layout tables or form forms may align left where readability demands it, but native marketing cards must adhere strictly to centering.

### 9.13.2 Unified Backend Admin Layout Rules
To ensure all platform sub-applications appear as a unified product ecosystem:
- **Structure Alignment:** The admin layouts for all utilities (TuneStream, SyncMavens) must mirror the main portal dashboard’s collapsible sidebar (`dashboard-sidebar`), topbar (`dashboard-topbar`), scrollable container (`dashboard-main-scroll`), and footer copyright strip (`dashboard-copyright-strip`).
- **Branding Accents:** Sidebar headers must display the respective sub-utility logo relative to the active target domain (TuneStream logo, SyncMavens logo, etc.).
- **Nav Collapsibility:** Sidebars must support collapsible state toggles that transition smoothly between standard (260px) and collapsed (80px) widths, modifying padding and text visibility accordingly.
- **Sandbox Role Switches:** Sidebars or topbars must provide visible sandboxed role/view switcher controls (e.g. switching between Creator and Listener views in TuneStream) to simplify testing.

---

## §9.14 — Codebase Structure & Directory Layout  ✅ SHIPPED (Landing/Auth/Consumer) / 🟠 P1 (Dashboard)

To ensure high modularity and avoid side-effects from monolithic files, the codebase is structured as a component-and-view hierarchy:

```
src/
├── components/
│   ├── common/
│   │   ├── PageHeader.jsx          # Shared title and background headers
│   │   ├── Navbar.jsx              # Unified navigation header
│   │   ├── Footer.jsx              # Global footer menus with region context
│   │   └── FaqItem.jsx             # Self-contained accordion element
│   └── demos/
│       ├── SyncBriefDemo.jsx       # Interactive AI brief mockup generator
│       ├── MasteringDemo.jsx       # Studio quality preview mastering testbed
│       ├── SplitCalculatorDemo.jsx # Mockup splits generator
│       ├── SyncBriefCarousel.jsx   # Horizontal sync showcase
│       ├── SplitCascadeCarousel.jsx# Payout stages slideshow
│       ├── UserPersonaCarousel.jsx # Target industry segment showcase
│       ├── ComingSoonApp.jsx       # Generic dashboard app placeholder
│       ├── SplitCascadeLedgerApp.jsx# Standalone ledger app mockup
│       └── MpesaPosTerminal.jsx    # Standalone terminal pos flow mockup
├── views/
│   ├── landing/
│   │   ├── HomeView.jsx            # Platform home / general landing page
│   │   ├── ToolsView.jsx           # AI Tools catalog landing page
│   │   ├── AppsView.jsx            # Standalone apps list page
│   │   ├── NativeAppsView.jsx      # Standalone native apps catalog page
│   │   ├── NativeAppLandingView.jsx# Rich Capacitor app landing pages
│   │   ├── PerfectForPageView.jsx  # Landing directories of industry roles
│   │   ├── RoleLandingView.jsx     # Minimal target hero route stubs
│   │   ├── PricingView.jsx         # Pay-as-you-go packages pricing table
│   │   ├── AboutView.jsx           # About page with contact submission
│   │   ├── HelpView.jsx            # Help center FAQ and support tickets
│   │   └── TuneStreamViews.jsx     # Consumer app marketing pages
│   ├── auth/
│   │   ├── LoginView.jsx           # Secure SSO + sandbox login form
│   │   └── RegisterView.jsx        # Step-by-step onboarding signup wizard
│   ├── consumer/
│   │   ├── StreamView.jsx          # Lossless consumer player dashboard
│   │   └── TuneStreamViews.jsx     # TuneStream specific info pages
│   └── dashboard/                  # [Planned] Dashboard core & utility panels
│       ├── DashboardView.jsx       # Primary Dashboard layout
│       └── panels/                 # Dashboard feature utility modules
```

### 9.14.1 Root App Routing
The main `src/App.jsx` handles core app state (Unified Auth context & regional context), global CSS initialization, and the client-side router configurations. The modular views are dynamically imported at the top of the file, keeping the central file lightweight, readable, and highly maintainable.

---

## §9.15 — Multi-Domain Architecture & Deployment Plan

### 9.15.1 Architectural Recommendation: Monorepo with Multi-Build Targets
Rather than splitting the TuneMavens ecosystem into entirely separate repositories (which introduces code duplication, auth sync overhead, and database mapping complexity), we recommend utilizing a **Monorepo structure with separate application build targets**.

This layout allows:
- **Shared Authentication & Session State:** Single shared FastAPI backend session, user collections, and common domain cookies (`COOKIE_DOMAIN=.tunemavens.com`).
- **Shared Components & Libraries:** All UI elements (design tokens, layout grids, components) reside in a single repository and can be imported across utilities.
- **Independent Servability:** Each domain serves its own isolated frontend code bundles.

#### Directory Layout
```
tunemavens/
├── apps/
│   ├── portal/           # Main portal & dashboards (tunemavens.com)
│   │   ├── index.html
│   │   └── src/
│   ├── tunestream/       # TuneStream Consumer App (tunestream.co / tunestream.tunemavens.com)
│   │   ├── index.html
│   │   └── src/
│   └── syncmavens/       # SyncMavens Utility (syncmavens.com)
│       ├── index.html
│       └── src/
├── packages/
│   ├── shared-ui/        # Shared components, hooks, design system, styling
│   └── shared-auth/      # Shared authentication state and helpers
├── backend/              # Unified FastAPI backend
└── deploy/               # Multi-domain VPS deployment configs
```

---

### 9.15.2 DNS Mapping & User-Specific Routing Strategy

To ensure that each platform, page, action, and Call-to-Action (CTA) is specific to the authenticated user's role and portal context, we employ a multi-domain routing layout:
1. **Primary Hub Domains**: Major standalone properties use dedicated domains.
2. **Subdomain-based Routing**: Specialized role portals default to subdomains under the main `tunemavens.com` namespace.

| Domain | DNS Target | Maps to | Role/Ecosystem Context |
|---|---|---|---|
| `tunemavens.com` | `A` record pointing to VPS IP | Main Portal & Dashboard | Core Hub, Creators & General Users |
| `www.tunemavens.com` | `CNAME` pointing to `tunemavens.com` | Main Portal & Dashboard | Core Hub, Creators & General Users |
| `tunestream.co` | `A` record pointing to VPS IP | TuneStream Utility | Audio Stream Listeners & Fans |
| `www.tunestream.co` | `CNAME` pointing to `tunestream.co` | TuneStream Utility | Audio Stream Listeners & Fans |
| `tunestream.tunemavens.com` | `CNAME` pointing to `tunestream.co` | TuneStream Utility | Fan Redirect/Alias |
| `syncmavens.com` | `A` record pointing to VPS IP | SyncMavens Utility | Sync Licensing & Music Supervisors |
| `www.syncmavens.com` | `CNAME` pointing to `syncmavens.com` | SyncMavens Utility | Sync Licensing & Music Supervisors |
| `djs.tunemavens.com` | `CNAME` pointing to `tunemavens.com` | DJ Pool Portal | DJs |
| `corporate.tunemavens.com` | `CNAME` pointing to `tunemavens.com` | Corporate Portal | Business & Organization accounts |
| `media.tunemavens.com` | `CNAME` pointing to `tunemavens.com` | Media House Portal | Media House routing |

Each interface dynamically parses the incoming request domain or host header (`Request.headers.get('host')` in FastAPI and `window.location.hostname` in React) to:
- Render role-specific navigation menus and action steps.
- Set platform-specific styling (branding colors and logos).
- Scope payment packages, credits, and CTA behaviors to that specific user context.

---

### 9.15.3 Hostinger VPS Nginx Configuration
On the Hostinger VPS, Nginx is updated to support independent server blocks pointing to the respective build directory targets.

```nginx
# 1. Main Portal (tunemavens.com)
server {
  listen 80;
  server_name tunemavens.com www.tunemavens.com;

  root /opt/tunemavens/dist/portal;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}

# 2. TuneStream (tunestream.co & tunestream.tunemavens.com)
server {
  listen 80;
  server_name tunestream.co www.tunestream.co tunestream.tunemavens.com;

  root /opt/tunemavens/dist/tunestream;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}

# 3. SyncMavens (syncmavens.com)
server {
  listen 80;
  server_name syncmavens.com www.syncmavens.com;

  root /opt/tunemavens/dist/syncmavens;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
  }

  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
```

---

### 9.15.4 Deployment & CI/CD Pipeline (GitHub Actions)
Upon every push to `main`, the deployment workflow builds each app target independently and uploads them to the corresponding directories:

1. **Build Step:**
   ```bash
   npm run build --workspace=portal --dest=dist/portal
   npm run build --workspace=tunestream --dest=dist/tunestream
   npm run build --workspace=syncmavens --dest=dist/syncmavens
   ```
2. **Deploy Step:**
   The `deploy.sh` script copies the respective `dist/` sub-directories to the VPS root:
   - `/opt/tunemavens/dist/portal`
   - `/opt/tunemavens/dist/tunestream`
   - `/opt/tunemavens/dist/syncmavens`

---

## §9.16 — SyncMavens Ditto-inspired Platform & Backend Support

### 9.16.1 Ditto Music Marketing & Compensation Model
- **Public Landing Page:** Located at the root of the `syncmavens.com` domain. It mimics Ditto Music’s "Get Signed" layout with high-impact pitching marketing, client list logos (Netflix, HBO, EA Sports), custom FAQs, and step-by-step sync signing walkthroughs.
- **Easy Accessibility:** A barrier-free, open-access portal for independent creators to upload catalog stems directly to supervisor search indexes.
- **Compensation & Waterfall Model:** Rather than traditional upfront catalog buyouts, SyncMavens works on a placement-led 90/10 split waterfall. Creators receive 90% of sync licensing fees, while SyncMavens retains a 10% administration/facilitation fee.
- **No Catalog Advances:** **We do not offer catalog sign advances at this stage**, ensuring creators maintain 100% ownership control of their catalog publishing rights and mechanical copyrights.
- **CTA Ingress:** Directs creators via a prominent "Access Sync Dashboard" button into the unified Sync Admin Dashboard.

### 9.16.2 Interactive Landing Page Utilities
- **AI Sync Match Simulator:** Form-based utility allowing creators to simulate track metadata match calculations against live briefs. Employs transition loadings ("Transcoding stems...", "Iterating budgets...") and outputs a detailed match score (%), compatible project, fee payout, and pitch claim actions.
- **Splits Cascade Calculator:** Visual waterfall diagram that displays dynamic Writer/Producer payouts relative to a chosen sync buyout fee, reflecting the flat 10% SyncMavens administration fee and $0 catalog advance payouts.

### 9.16.3 Backend Collection Support
- **`briefs` Collection:** Stores incoming film, TV, and video game licensing sync briefs. Schema mirrors standard contract briefs: project name, client, budget, duration format, deadline, required genre style, and description details.
- **`pitches` Collection:** Tracks pitched catalog tracks submitted by creators to active briefs.
- **`catalogs` Collection:** Index of masters and metadata ingested for sync matching, linked with split cascade agreements.

---

## §9.17 — Track D: Social AI Studio Recommendations & Mother-EPK Integration

### 9.17.1 Social AI Studio Path Asset Recommendations
- **Path-Based Suggestions:** The Social AI Studio recommends specific creative assets (such as aspect ratios, file types, and style guidelines) matching the campaign's recommended marketing channel path. For example, if the marketing path recommends **Facebook** and **Instagram**, the Studio automatically suggests creating Square (1:1) and Vertical Short (9:16) assets.
- **Intermaven Integration:** The Social AI Studio is linked to the Intermaven Social AI scheduling and dispatch app, which automates social posting, queue management, and goal metrics tracking.

### 9.17.2 Intermaven EPK Builder Integration
- **Platform Parity:** The EPK Builder in TuneMavens is identical to the one on the Intermaven platform. Intermaven serves as the parent ("mother") platform, ensuring that all templates, metadata fields, and media asset associations are synchronized.
- **Activation Lifecycle:** Creators can activate or deactivate the EPK Builder app dynamically from the **App Marketplace** in the admin panel.

---

## §9.18 — Standalone Creator Web Worlds (EPK) & Multi-Domain Ingress Engine

### 9.18.1 Multi-Domain Subdomain & Custom Ingress
Creators have the flexibility to publish and host their Standalone Creator Web World across multiple high-traffic ecosystem domains:
- **Tri-Domain Availability:** The wizard allows simultaneous deployment to:
  - `{subdomain}.tunemavens.com` (Main Creator Hub)
  - `{subdomain}.tunestream.co` (Consumer Streaming Portal)
  - `{subdomain}.syncmavens.com` (Music Supervisor Sync Licensing Hub)
- **Custom Domains:** Supports mapping a fully custom domain (e.g. `artistname.com`) directly to the creator's EPK container.

### 9.18.2 Site Name, Tagline & Dynamic SEO Indexing
- **First Step Inputs:** The EPK Wizard captures `siteName` and `tagline` during initial onboarding.
- **SEO Title Protocol:** Dynamically sets browser `<title>` and OpenGraph tags to `{siteName} | {tagline}`.
- **Header Display Rules:** If a custom logo image is uploaded, the site name text is hidden to prevent redundancy; if no logo exists, the styled artist/site name appears. Extraneous raw URLs below logos are omitted for clean branding.

### 9.18.3 Multi-Slide Hero Carousel & Contextual AI Generation
- **Hero Carousel:** Supports up to 6 high-definition hero slides with custom or AI-generated artwork.
- **3-Line Music Business Hierarchy:**
  1. `heroTitle1`: Creator / Artist Name.
  2. `heroTitle2`: Dynamic Tagline / Campaign Headline.
  3. `heroTitle3`: Standardized Music Business Context (e.g. *100% Pre-Cleared One-Stop Sync Licensing & Master Stems • TuneStream Lossless*).
- **Context-Aware AI Generation:** AI prompts are tuned to music business roles (Sync Composer, Touring Artist, Indie Label), generating tailored imagery and titles with full upload replacement capabilities.
- **Hero Animation Modes:**
  - `anim-synergy`: Multi-phase dynamic stagger matching modern landing animations.
  - `anim-fade-seq`: Elegant sequential fade-in / fade-out transition between titles and background imagery.

### 9.18.4 Social Account Validation & Sync Check
- **Supported Networks:** Instagram, YouTube, Spotify, SoundCloud, TikTok, Twitter/X, and Apple Music.
- **Sync Engine:** Validates usernames and URLs via regular expression checks, displaying live sync status indicators and link health checks.

### 9.18.5 Intermaven Smart CRM Lead Routing
- **Contact & Booking Forms:** Submissions from the EPK's Booking and Contact modules directly submit to the Intermaven Smart CRM backend (`POST /api/crm/leads`).
- **Lead Segmentation:** Automatically populates lead type (`booking_inquiry`, `sync_request`, `fan_vault`), capturing contact details, event dates, budgets, and messages for direct follow-up in the admin CRM panel.

---

## §9.19 — Mother-CMS Backend EPK Architecture & Live Studio Subsystem

### 9.19.1 Centralized Backend CMS Endpoints (`backend/routes/cms_router.py`)
All Creator Web World CMS operations reside in the FastAPI backend:
- `GET /api/cms/epk/{subdomain}`: Fetches active Mother-CMS layout (`layout_id: epk_{subdomain}`) and version.
- `POST /api/cms/epk/{subdomain}`: Publishes full EPK layout, increments version, and writes immutable snapshots to `db.cms_layout_history`.
- `PATCH /api/cms/epk/{subdomain}/sections/{section_id}`: Performs granular section updates (Bio, Hero, Catalog, Shows, Media, Store).
- `POST /api/cms/epk/bio/generate`: Generates rich HTML narrative content focused on master rights, 24-bit stems, and sonic identity.
- `GET /api/cms/epk/{subdomain}/history`: Returns the version snapshot audit trail.
- `POST /api/cms/epk/{subdomain}/rollback/{version}`: Restores any historical snapshot with 1-click execution.

### 9.19.2 Floating Live Mother-CMS Studio (`LiveEpkCmsStudio.jsx`)
- Provides an overlay drawer for creators to modify any section in real time.
- Integrated rich text canvas, color pickers, animation toggles, and live rollback selector without disrupting the public view.

---

## §9.20 — Layout & 1280px Container Standards

### 9.20.1 Global Container Standard (`index.css`)
- `.container` is strictly defined as:
  ```css
  .container {
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
  }
  ```
- Constrains all content below the hero section across the entire TuneMavens portal, including `PerfectForSidebar` and all interior pages (`Tools`, `Apps`, `Pricing`, `About`, `Help`, `Publishing`, `Distribution`, `Tours`, `Sync`, `Native Apps`).

### 9.20.2 Landing Content Split Grid (`App.css`)
- `.landing-content-split` enforces `max-width: 1280px; width: 100%; margin: 48px auto 0; padding: 0 24px; box-sizing: border-box;`, ensuring that flagship cards, persona carousels, frustration cards, and CTA banners never stretch past 1280px on ultra-wide screens.

### 9.20.3 Hero Controls & Footer Grid Alignment
- Hero side navigation arrows (`.sui-arrows`) and bottom indicators (`.sui-bottom`) are bound to `max-width: min(1280px, 100% - 48px)`.
- Navbar (`.nav-inner-container`) and Footer (`.footer-inner-container`) are locked to `max-width: 1280px; margin: 0 auto; box-sizing: border-box;`.
- Creator EPK footer and bottom branding bar are bound to `maxWidth: maxContentWidth` (1280px in wide layout), maintaining strict grid harmony across all marketing and creator surfaces.

---

## §9.21 — Comprehensive Creator Web World, Mother-CMS Studio & Setup Wizard Modals

### 9.21.1 Dedicated Full Event Showcase & Ticketing Protocol
- **Route / State:** `activeTab === 'event-detail'` in `CreatorEpkView.jsx`.
- **Hero & Venue Architecture:** Displays high-resolution tour flyers, venue name, city, performance date, doors open, and age restrictions (All Ages, 18+, 21+).
- **Multi-Tier Ticketing:** General Admission, VIP Balcony (includes laminate), and VIP Meet & Greet (soundcheck + photo + exclusive merchandise).
- **Multi-Rail Checkout:**
  - Full Credit/Debit Card fields: Cardholder Name, 16-digit Card Number, Expiration Date (`MM/YY`), CVC/CVV, Postal / ZIP Code, and Country selection.
  - Direct TM Credit instant debit.
  - Instant M-Pesa STK Push / PesaPal mobile rails.
- **QR Digital Ticket Pass:** Checkout generates a digital boarding pass with unique QR code, pass ID (`TM-TKT-...`), and wallet integration.

### 9.21.2 Dedicated Full Album Page & TuneStream 30s Free Preview Protocol
- **Route / State:** `activeTab === 'album-detail'`.
- **Liner Notes & Sonic Credentials:** Showcases 280x280 vinyl cover art, master metadata, 24-Bit / 96kHz FLAC badge, studio synthesizer specifications (Moog One, Prophet-6, Eurorack Modular), Executive Producers, and Publisher (e.g. *Intermaven Songs / ASCAP*).
- **TuneStream Audio Player Integration:** Dedicated player positioned directly beneath primary action buttons. Plays the first 30 seconds for free with countdown timer; continuing playback consumes 1 TM Credit matching the canonical TuneStream streaming protocol.

### 9.21.3 Commercial Access Tiering & Practitioner Role Verification
- **Buy Full Album ($9.99 / 50 Credits):** Available to all fans and VIP vault members.
- **Buy Stems:** Restricted to industry practitioners (producers, DJs, labels, music supervisors) via a 1-click Practitioner Role Verification modal.

### 9.21.4 Universal In-Context Quick Top-Up System
- Triggered whenever an action requires credits or via the "+ Top-Up Credits" button on the balance section.
- **Quick Packs:** 50 Credits ($9.99), 150 Credits ($24.99), 350 Credits ($49.99).
- **Custom Amount Slot:** Strictly enforces minimum $5.00 USD (USA / Global) and minimum KES 200 (Kenya / East Africa).
- Multi-rail payment via Card and instant M-Pesa STK push.

### 9.21.5 Mother-CMS Setup Wizard Modals
All four primary configuration workflows launch in dedicated, responsive **Modal Dialogs** with background blur (`backdropFilter: 'blur(10px)'`):
1. **Discography Release Setup Wizard** (`discographyWizardOpen`):
   - Step 1: Release Details & Musical Metadata (Title, Single/EP/Album/Stems, Year, Genre, BPM, Key).
   - Step 2: Master Audio (WAV/FLAC) & Multitrack Stems (ZIP) URLs, ISRC Code, Duration.
   - Step 3: High-Res Cover Artwork + 1-Click AI Cover Generator with custom prompts.
   - Step 4: Songwriters, Producers, Publisher & PRO, Credits & USD Pricing, Practitioner-Only Stems toggle.
   - Step 5: Review & Ingest into Discography.
2. **Store & Merch Setup Wizard** (`storeWizardOpen`):
   - Step 1: Product Basics & Category (Vinyl, Apparel, Stems, Digital, VIP Bundles).
   - Step 2: Multi-Image Carousel (Primary angle + multi-angle carousel shots).
   - Step 3: Product Description, Materials & Delivery Specs.
   - Step 4: Pricing in USD & Credits, Inventory Stock Level.
3. **Press & EPK Setup Wizard** (`pressWizardOpen`):
   - Step 1: EPK Headline Hook & Pitch Angle.
   - Step 2: Lead Editorial Quotes & Publication Outlets.
   - Step 3: Front-of-House Console & Technical Rider Summary.
   - Step 4: High-Res Assets & Direct PDF Press Kit Export.
4. **Tours & Live Shows Setup Wizard** (`showsWizardOpen`):
   - Step 1: Venue Name, City, Country, Capacity.
   - Step 2: Performance Date, Doors Open, Age Restrictions.
   - Step 3: Multi-Tier Tickets (GA, VIP Balcony, VIP Meet & Greet, On-sale status).
   - Step 4: Tour Flyer Artwork URL, Event Description & Special Guest Lineup.

### 9.21.6 Discography Ingestion Hub (`activeTab === 'music'`)
- Renamed from "Singles & Stems" to **"Discography"** (`RiDiscFill`) in CMS Studio.
- **Singles & Master Tracks:** High-resolution cover artwork, title, release, ISRC code, stems credits, direct audio masters, and 1-click AI Cover Generator with custom prompts.
- **Studio Albums & Master Collections:** Tracklists, album artwork, release dates, comprehensive liner notes, and dual USD/credits pricing.
- **Bulk Catalog CSV Ingestion:** Purpose-built for labels and publishers to paste hundreds of tracks (`Title, Year, Type, ISRC, Streams, Duration, Credits`) with instant 1-click batch ingestion into MongoDB.

---

## §9.22 — Native Intermaven Smart CRM Studio & Fan Vault Engine

### 9.22.1 Native Smart CRM Studio Architecture (`SmartCrmStudioPanel.jsx`)
- Replaces blocked external iframes (`X-Frame-Options: SAMEORIGIN`) with a high-performance native component.
- Directly integrated with FastAPI backend endpoints:
  - `GET /api/crm/contacts`: Retrieves contacts formatted specifically for the Smart CRM panel.
  - `POST /api/crm/campaigns` & `POST /api/crm/dispatch/{id}`: Creates and dispatches omnichannel broadcast campaigns.
  - `POST /api/crm/leads`: Registers new fan club and EPK inquiry leads.

### 9.22.2 Audience & Fan Leads Management
- Comprehensive contacts table with search and channel filtering (WhatsApp, SMS, Email).
- Direct actions: Simulated STK/SMS push and direct email dispatch.
- Lead status badges: `Active VIP`, `Qualified Lead`, `Booked`, `Inquiry`.
- "+ Add Fan / Lead" modal and CSV export functionality.

### 9.22.3 Omnichannel Broadcast Dispatcher
- Targeted messaging to specific audience segments (All Verified Fans, VIP Passholders, Ticket Attendees).
- Channels: WhatsApp Direct Broadcast (98% open rate), SMS / STK Push Alert, Rich Email.
- Live dispatch log tracking recipients, delivery status, and open rates.

### 9.22.4 Fan Curated Playlists & Vault Collections
- Integrates with playlists created by fans on the public Creator EPK.
- Displays curator identity, track counts, tracklist inspection, and direct curator messaging.

### 9.22.5 High-Contrast Analogous Notification Styling & Flat Color Button Standard
- **Analogous High-Contrast Notifications:** Deep midnight navy base (`#071d2c`) with vibrant 1.5px cyan/emerald borders (`#00f0ff`), left 5px solid highlight indicator strip, and high-contrast tag pills.
- **Strict Flat Colors Standard:** Buttons across the ecosystem strictly use solid flat colors; all gradients on `<button>` elements are eliminated for visual clarity.
