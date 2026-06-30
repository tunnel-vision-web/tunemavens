# TuneMavens Backend — Phase 1 (Foundation & Subdomains)

This is the Phase 1 deliverable for `tunemavens.com` per
**`DEVELOPMENT_PLAN.md` Phase 1** in the intermaven repo.

> **Phase 1 only ships the foundation.** No business logic, no cascade math, no
> contract generation. Phase 7 (Compensation Engine) and Phase 8 (Contract
> Creation System) build on top of this.

---

## What's in this Phase 1 build

| Layer | Status |
|------|--------|
| FastAPI app skeleton | ✅ |
| Shared `JWT_SECRET` with `intermaven.io` (cross-portal SSO) | ✅ |
| Shared MongoDB (`DOCUMENTATION.md §9.1`) | ✅ |
| Auth routes (`/api/auth/register`, `/login`, `/me`, `/logout`) | ✅ |
| HttpOnly cookie + `Authorization: Bearer` token paths | ✅ |
| `users.dashboard_layout` field + persistence (`§9.6`) | ✅ |
| `publishing_deals`, `distribution_deals`, `catalogue_acquisitions` models + CRUD stubs (`§9.7`) | ✅ — models only, no cascade |
| Frontend `LoginView` / `RegisterView` wired to real endpoints | ✅ |
| `Compensation Engine` cascade math | ❌ Phase 7 |
| `Contract Creation System` | ❌ Phase 8 |
| Subdomain DNS & reverse proxy deployment | 📄 documented below — not deployed |

---

## Environment

Copy `.env.example` → `.env` and fill in. The two values that **must** match
intermaven.io for cross-portal SSO to work:

- `MONGO_URL` — must point to the same Mongo cluster.
- `JWT_SECRET` — must be byte-identical to intermaven.io's `JWT_SECRET`.

`COOKIE_DOMAIN` is optional. Leave it empty in dev. In production, since
`tunemavens.com` and `intermaven.io` are different eTLD+1 domains, a single
cookie cannot span both — use the `/api/sso/*` bridge endpoints on intermaven.io
(already present per the intermaven backend's `sso_router`) for cross-domain
session handoff. Within the `tunemavens.com` family of subdomains, set
`COOKIE_DOMAIN=.tunemavens.com` to share the cookie across `djs.`, `labels.`,
`producers.`, `mediahouses.` (see below).

---

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then edit
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Health check: `GET http://localhost:8001/api/health`.

---

## Subdomain routing (Phase 1 — documented, not deployed)

The development plan calls for four branded subdomains:

| Subdomain | Audience |
|-----------|----------|
| `djs.tunemavens.com` | DJ Pool Engine (Phase 5) |
| `labels.tunemavens.com` | Record Label Console (Phase 4) |
| `producers.tunemavens.com` | Producer-focused creator pipeline (Phase 3) |
| `mediahouses.tunemavens.com` | Media House Routing (Phase 10) |

### DNS

Each subdomain is a `CNAME` to the same edge (Cloudflare / Vercel / Netlify /
Render edge — pick one once hosting is settled in Phase 5+ per `§5.3` of the
plan).

```
djs           CNAME  edge.tunemavens.com.
labels        CNAME  edge.tunemavens.com.
producers     CNAME  edge.tunemavens.com.
mediahouses   CNAME  edge.tunemavens.com.
```

### Reverse-proxy / ingress (nginx example)

The same FastAPI service answers all subdomains. The frontend reads
`window.location.hostname` and routes to the relevant dashboard variant. Until
Phase 4–10 ship those variants, every subdomain serves the same SPA.

```nginx
server {
    server_name  tunemavens.com  www.tunemavens.com
                 djs.tunemavens.com
                 labels.tunemavens.com
                 producers.tunemavens.com
                 mediahouses.tunemavens.com;

    location /api/ {
        proxy_pass         http://tunemavens-backend:8001;
        proxy_set_header   Host                $host;
        proxy_set_header   X-Forwarded-Proto   $scheme;
        proxy_set_header   X-Forwarded-Host    $host;
    }

    location / {
        proxy_pass         http://tunemavens-frontend:3000;
    }
}
```

### Cross-subdomain cookies

Set `COOKIE_DOMAIN=.tunemavens.com` in production. The HttpOnly `access_token`
cookie set by `/api/auth/login` will then be sent on every subdomain request,
so a DJ who logs in on `djs.tunemavens.com` stays logged in when they click
through to `labels.tunemavens.com`.

### Cross-portal handoff (intermaven.io ↔ tunemavens.com)

These two portals are different eTLD+1 domains; a single cookie cannot cover
both. Use the **`/api/sso/handoff`** mechanism already present in the
intermaven backend (`backend/routes/sso.py`) — short-lived signed token in URL
on cross-portal navigation, exchanged for a session cookie on arrival.
Wiring this into the tunemavens UI is a follow-up task (tracked as
Phase 1.1 in the backlog).

---

## Endpoints (Phase 1)

| Method | Path | Purpose |
|--------|------|---------|
| GET    | `/api/health` | Liveness + Mongo ping |
| POST   | `/api/auth/register` | Create user + mint shared JWT |
| POST   | `/api/auth/login`    | Authenticate + mint shared JWT |
| GET    | `/api/auth/me`       | Cross-portal session recognition |
| POST   | `/api/auth/logout`   | Clear cookie |
| GET    | `/api/dashboard/layout` | Read `users.dashboard_layout` |
| PUT    | `/api/dashboard/layout` | Write `users.dashboard_layout` |
| GET    | `/api/deals/publishing` | List user's publishing deals |
| POST   | `/api/deals/publishing` | Create publishing deal (no cascade — Phase 7) |
| GET    | `/api/deals/distribution` | List user's distribution deals |
| POST   | `/api/deals/distribution` | Create distribution deal (no cascade — Phase 7) |
| GET    | `/api/deals/catalogue-acquisitions` | List recoupment ledger entries |
| POST   | `/api/deals/catalogue-acquisitions` | Create ledger entry (no recoupment math — Phase 7) |
