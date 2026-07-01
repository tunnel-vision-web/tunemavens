# DOCUMENTATION.md — TuneMavens Platform Reference

Section §9.8 (App Marketplace + Recommendation Agent) is the current focus.
Sections §9.1–§9.7 are covered in the earlier documentation revisions pushed
to the `intermaven` repository. This file re-states the sections that are
canonical for the TuneMavens build.

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
  role: 'creator' | 'label' | 'dj' | 'studio' | 'supervisor' | 'consumer' | 'admin',
  country: string?,                       // ISO 3166-1 alpha-2
  plan: 'free' | 'starter' | 'pro' | 'enterprise',
  credits: number,                        // Unified Network Credits
  apps: string[],                         // Activated app slugs (§9.8)
  dashboard_layout: dict?,                // Persistent panel arrangement
  created_at: datetime,
  updated_at: datetime
}
```

`apps[]` is the single source of truth for **every activation surface**:
TuneMavens dashboard panels, Intermaven Network native apps, and
Intermaven.io platform tools. See §9.8 for the allow-list.

## §9.7 — Deal Collections

- `publishing_deals` — Publishing tier election with audit trail
  (`status: active | superseded | terminated`, `superseded_at`)
- `distribution_deals` — DSP distribution path with same audit-trail
  semantics
- `catalogue_acquisitions` — advance / recoupment ledger stub

## §9.8 — App Marketplace + AI Recommendation Agent

### 9.8.1 App catalogue

Three distinct app groups, all persisted through the shared
`users.apps[]` array:

| Group | Where it lives | "Open" behaviour |
|---|---|---|
| **TuneMavens dashboard apps** | Internal panels of the dashboard | Sets the active dashboard tab |
| **Native Apps** | Marketing landing pages (`/native-apps/...`) | Routes to the landing page (Capacitor deep-link in mobile) |
| **Intermaven Platform** | Tools hosted on intermaven.io | `window.open(launchUrl, _blank)` — session carried across sub-domain via the shared JWT cookie |

Slugs live in three catalogues:
- `src/lib/appCatalog.js` (TuneMavens apps, and a unified `lookupApp()`)
- `src/lib/nativeApps.js` (3 flagship native apps)
- `src/lib/intermavenPlatformApps.js` (7 platform tools)

The backend allow-list mirrors these files in
`backend/routes/users_router.py::ALLOWED_APP_SLUGS`. Any slug not in the
allow-list is rejected with a `422`.

### 9.8.2 Onboarding questionnaire

`onboarding_responses` collection (keyed by `user_id`, upserted):

```
{
  primary_goal: 'release_music' | 'manage_roster' | 'grow_fans'
              | 'sync_licensing' | 'sell_at_shows' | 'consume',
  release_cadence: '0' | '1-3' | '4-10' | '10+',
  distribution_setup: 'none' | 'diy_aggregator' | 'label_deal' | 'self_distributed',
  revenue_focus: 'streaming' | 'live' | 'sync' | 'tips_merch',
  team_size: 'solo' | '2-5' | '6-20' | '20+',
  country: string?,                       // ISO 3166-1 alpha-2
  freeform_notes: string?,                // free-form context for the LLM
  updated_at: datetime
}
```

Rendered as a 6-step modal wizard triggered from the OnboardingStripe's
`Tell us about your goals` step, from the App Marketplace's "Get my picks"
hero CTA, or from the "Retake wizard" button on an existing hero.

### 9.8.3 Activity signals

`activity_events` collection (append-only):

```
{ user_id, kind, ref?, meta?, at }
```

`kind ∈ { tab_visit, deal_created, app_activated, app_deactivated, stripe_progress }`.

The dashboard automatically emits `tab_visit` on every panel switch. Other
event kinds are emitted from the panels that mutate state (deals router,
users router). The reducer `_activity_summary(user_id)` aggregates these
into a compact `{ tab_visits, recent_deactivations, deals_created }` shape
that the Recommendation Agent consumes.

### 9.8.4 Recommendation Agent

**Two-layer synthesis** — the endpoint always returns something usable:

1. **LLM layer** (primary)
   - Provider: Anthropic Claude Sonnet 4.6 via Emergent LLM key
   - Timeout: 15s hard cap
   - Prompt shape: `role + onboarding_json + activity_summary + already_activated + catalogue_summary + max_picks`
   - Return format enforced: `{"picks":[{"slug","rationale"}]}` (strict JSON)
   - On timeout, non-JSON output, or key-budget/network failure → falls back silently to the rules layer

2. **Rules layer** (fallback + always available)
   - Deterministic scorer: role-affinity + primary-goal + distribution-setup + revenue-focus + release-cadence + team-size + country + activity nudges
   - Zero external I/O — always returns picks, even without onboarding

Output shape (always the same regardless of layer):

```
[
  { slug: string, rationale: string, priority: 1..N, source: 'llm' | 'rules' }
]
```

### 9.8.5 UX surfaces

- **OnboardingStripe** — top-of-dashboard checklist. New "Tell us about your goals" step opens the wizard.
- **App Marketplace › Your Path tab** (default) — hosts the "Recommended for you" hero. Pre-wizard, shows a CTA to run the wizard; post-wizard, shows 4 ranked picks with rationales and Activate / Open / Launch buttons.
- **App Marketplace › TuneMavens Apps / Native Apps / Intermaven Platform tabs** — browse the full catalogue when the user wants to explore beyond the recommended combination.

### 9.8.6 API surface

```
GET    /api/users/me/apps                      → string[]
POST   /api/users/me/apps                      → string[]    body: { slug }
DELETE /api/users/me/apps/{slug}               → string[]

GET    /api/users/me/onboarding                → OnboardingResponse | null
POST   /api/users/me/onboarding                → OnboardingResponse   body: OnboardingResponse

POST   /api/users/me/activity                  → { ok: true }         body: ActivityEvent

GET    /api/users/me/recommendations?limit=N   → Recommendation[]
```
