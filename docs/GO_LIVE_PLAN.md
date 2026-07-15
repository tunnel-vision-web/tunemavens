# Intermaven Network Aggressive Go-Live Plan (Beta Launch: End of September)

This plan consolidates the pre-launch requirements and roadmaps for both the `intermaven` and `tunemaven` repositories into a single, cohesive, and aggressive 11-week go-live schedule targeting **September 30, 2026**. 

The priority is to onboard creators, labels, execs, and music supervisors first. The beta launch will deliver the core portals (**Intermaven, TuneMavens, TuneStream, and SyncMavens**) as well as **Social AI, CRM, and CMS** capabilities, powered by a unified single sign-on (SSO) and Stripe payment gateway.

---

## Resolved Architecture Decisions

### 1. Canonical Account-Type Mapping
The website's 8 entry paths and internal database schemas will be normalized into **7 canonical roles**. The user signup wizard and database profiles will utilize these definitions:
- **Creator** (covers Artist, Producer)
- **Record Label** (covers Record Label)
- **DJ** (covers DJ)
- **Media House** (covers Media House)
- **Exec / Supervisor** (covers Manager, Publisher)
- **Consumer** (covers Fan)
- **Corporate** (covers Business, Organization)

### 2. 4-Tier Pricing & Credits Gating
Mother-CMS, the pricing configuration files, and portal entitlement gates will be extended from 2 tiers to natively support **4 tiers**:
- **Starter**
- **Professional**
- **Business**
- **Enterprise**

Credit quotas (e.g. AI runs, CRM sends, uploads) and pricing rates will be matched identically across the Intermaven and TuneMavens databases.

### 3. Deployment & Domain Routing
Portals will run online as independent, standalone applications sharing a single MongoDB database cluster. Domain routing maps custom root domains and role-specific subdomains to ensure that each platform, page, action, and CTA is tailored exactly to the active user context:
- **Custom Root Domains**:
  - `intermaven.io` -> Main Creator Suite / AI business tools portal
  - `tunemavens.com` -> Music marketplace and main hub
  - `tunestream.co` -> Consumer audio streaming platform
  - `syncmavens.com` -> Sync licensing marketplace
- **Role-Specific Subdomains of `tunemavens.com`**:
  - `djs.tunemavens.com` -> DJ pool engine
  - `corporate.tunemavens.com` -> Corporate portal
  - `media.tunemavens.com` -> Media house portals and routing
  - *(other roles default to respective subdomains within the `tunemavens.com` namespace)*

All platforms, actions, pages, and CTAs must be dynamically customized to the context of the user, based on the resolved domain header/roles.

### 4. Developer App Provisioning
OAuth setup for Google, Meta, TikTok, X, and LinkedIn is initiated in parallel to unblock Track A (SSO) and Track D (Social AI).

---

## Proposed Changes

To achieve the end of September target, we will structure the remaining work into **5 parallel tracks**. Each track will have dedicated developer resources and assigned reviewers.

| Track | Focus | Deliverables | Target Timeline |
|---|---|---|---|
| **Track A** | Core & Auth | SSO (OIDC/PKCE), 4-Tier / 7-Role Migration, S3/R2 Asset Storage, Resend Email, Mother-CMS Grid & Localized Key Overlays | Weeks 1-3 |
| **Track B** | Payments & Commerce | Stripe integration, Event Ticketing service (QR receipts), Merch/Digital Goods storefront | Weeks 1-6 |
| **Track C** | Media Ecosystem | Distribution Tracker (ISRC generator, metadata verification), TuneStream player, SyncMavens matching simulator | Weeks 2-8 |
| **Track D** | AI, CRM & CMS | Social AI (Gemini Nano Banana + Sora 2), CRM Campaigns engine, Mother-CMS versioning & rollback | Weeks 3-9 |
| **Track E** | Hardening & SEO | SEO module, Sentry/Uptime monitoring, CORS/SSL configuration, final regression testing | Weeks 10-11 |

---

## Technical Tasks & Milestones

### Track A: Identity, Auth & Core Infrastructure (Weeks 1–3)
- **SSO Integration**: Expand authorization endpoint configs in `sso.py` to allow `client_id` client configurations for `tunemavens.com`, `tunestream.co`, and `syncmavens.com`.
- **Cross-portal Auth**: Update `auth.py` in `tunemaven` backend to validate tokens minted by the unified provider.
- **R2/S3 Integration**: Create `s3_storage.py` utility in `intermaven` backend and replace base64 upload pipelines.
- **DB Migration**: Write migration scripts to seed the new canonical roles and set up 4-tier entitlement properties in the user tables.
- **Mother-CMS Grid & Localization**: Build the admin editor UI with localized key overlays (`portal[region] -> portal[default] -> region -> default`) to ensure localized language support is fully operational before payments and onboarding are initiated.

### Track B: Payments & Commerce Wave (Weeks 1–6)
- **Stripe Engine**: Register and test Stripe checkout endpoints for the 4 pricing tiers. Soften payout descriptions to "fast, automated settlements".
- **Event Ticketing**: Build a custom ticketing router (`ticketing.py`) to sell online event entries, deliver PDF/QR codes, and scan tickets.
- **Merch Checkout**: Write a checkout service (`storefront.py`) for physical apparel (brief generation integrations) and digital download delivery.

### Track C: Media Ecosystem — TuneStream, SyncMavens & Distribution (Weeks 2–8)
- **Distribution Tracker**: Build the unbuilt `distro.py` module to log and export release sheets to music distributors (DSP validation).
- **TuneStream Player**: Implement audio file streaming, watermarked previews, and subscription access checks.
- **Sync Match Simulator**: Port the Ditto-inspired matching engine (90/10 split waterfall, matching brief simulator) to the backend router.

### Track D: AI, CRM & CMS Expansion (Weeks 3–9)
- **Social AI**: Connect image generation (Gemini Nano Banana) and video clips (Sora 2) into the creative automation dashboard.
- **CRM campaigns**: Support custom campaign builders targeting user roles, dispatching via Resend or in-app inbox.
- **Mother-CMS Rollback**: Implement revision histories and rollback systems for the CMS content grid.

### Track E: Hardening, SEO & Launch Prep (Weeks 10–11)
- **SEO Optimization**: Embed JSON-LD schemas per page, configure dynamic sitemap routing.
- **Monitoring**: Configure UptimeRobot and Sentry. Rotate JWT keys, restrict CORS settings to production URLs.

---

## Verification Plan

### Automated Tests
- Run unit test suites for authentication and session tokens:
  ```bash
  pytest backend/tests/test_auth.py
  pytest backend/tests/test_sso.py
  ```
- Run payment and webhook callback mocks:
  ```bash
  pytest backend/tests/test_payments.py
  ```
- Run CMS content lookup resolution tests:
  ```bash
  pytest backend/tests/test_cms.py
  ```

### Manual Verification
1. **SSO Flow**: Verify that logging in on `intermaven.io` auto-authenticates the user when navigating to `tunemavens.com` or `syncmavens.com`.
2. **Stripe Checkout**: Execute sandbox purchases for a ticket, a digital track download, and a subscription to verify ledger splits.
3. **Distribution Feed**: Validate metadata ingestion and verify the ISRC is generated and registered correctly on upload.
4. **Lighthouse Audit**: Run Google Lighthouse checks on all main public landing pages. Ensure score exceeds 90 on performance and accessibility.
