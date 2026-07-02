# DOCUMENTATION.md — TuneMavens Platform Reference

Canonical technical reference for the TuneMavens build. Sections §9.1–§9.7
are inherited from the shared `intermaven` platform documentation.
Sections §9.8+ are TuneMavens-specific.

Current focus: §9.8 (App Marketplace + Recommendation Agent — SHIPPED)
plus §9.9–§9.12 (Identity, Social Graph, Community, CRM — IN PLAN).

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
