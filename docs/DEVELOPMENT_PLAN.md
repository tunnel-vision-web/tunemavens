# DEVELOPMENT_PLAN.md — TuneMavens

## Phase 1 · Foundation & Subdomains ✅ SHIPPED
FastAPI backend, Vite React frontend, shared JWT auth, Mongo persistence,
admin console with role-gated tabs, domain-mapping registry.

## Phase 2 · Consumer Audio System 🔵 P1 Backlog
`/stream` player, library persistence, tip flow, offline cache metadata.

## Phase 3 · Creator Pipeline ✅ SHIPPED
- Publishing Election (3 tiers, audit-trail)
- Distribution Election (3 paths, audit-trail)
- OnboardingStripe (top-of-dashboard progress bar)
- App Marketplace with three tabs — TuneMavens Apps / Native Apps / Intermaven Platform
- **§9.8 AI Recommendation Agent** (NEW)
  - 6-step onboarding wizard modal
  - Activity signal capture (tab_visits, deal creations, app activations)
  - Two-layer recommendation engine (LLM primary, rules fallback)
  - "Your Path" tab as the default landing surface of the App Marketplace, with the "Recommended for you" hero

**Deliverables shipped in §9.8:**
| Artifact | File |
|---|---|
| Onboarding + activity + recommendation models | `backend/models.py` |
| Rules + LLM recommendation engine | `backend/services/recommendation_engine.py` |
| Users router (apps, onboarding, activity, recs) | `backend/routes/users_router.py` |
| Unified app lookup | `src/lib/appCatalog.js` |
| Wizard modal + hero + Your Path tab | `src/App.jsx` |

**Immediate follow-ups (P1) inside Phase 3:**
- Split `App.jsx` (>7500 lines) into `/src/components/{dashboard, landing, marketplace}` modules — quality/velocity win before Phase 4.
- Improve LLM budget: current Emergent key hits `$0.001` cap after a couple of calls, so the app runs on the rules layer in practice. Increase budget or swap to `gpt-5.4-mini` for cheaper recs.

## Phase 4 · Record Label Console 🔵 P1
Roster CSV upload, distribution Path C negotiation wizard, catalogue
acquisition ledger.

## Phase 5 · DJ Pool Engine 🟡 P2
## Phase 6 · Sync Marketplace 🟡 P2
## Phase 7 · Split Cascade Engine 🟡 P2 — Compensation math from `COMPENSATION_AND_CONTRACTS.md`
## Phase 8 · Escrow & Contract Module 🟡 P2 — Contract creation from `COMPENSATION_AND_CONTRACTS.md`
## Phase 9 · Ad Injection Platform 🟡 P2
## Phase 10 · Media House Routing 🟡 P2

---

## Recommendation Agent — design principles (Phase 3 §9.8)

1. **Never block the user.** The endpoint has a 15s LLM budget and falls
   back to the rules layer on any failure. Users always see picks.

2. **Same output shape regardless of layer.** The frontend can't tell
   whether the picks came from Claude or the deterministic scorer, aside
   from a `source: 'llm' | 'rules'` label in the eyebrow.

3. **Signals grow over time.** Onboarding is the seed, but every tab
   visit, every deal created, every activation refines the picks.

4. **Full-network vision.** The agent recommends across the entire
   Intermaven ecosystem, not just TuneMavens dashboard panels — a
   creator might get Social AI + Brand Kit AI + Distribution Election
   as a single starter pack.

5. **Easy to retake.** The wizard is idempotent (upsert on user_id) and
   the hero always shows a "Retake wizard" button. Users are encouraged
   to revisit as their business evolves.
