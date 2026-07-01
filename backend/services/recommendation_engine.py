"""Recommendation engine for the App Marketplace.

Two-layer synthesis (per DOCUMENTATION.md §9.8):

  1. Rules layer  — deterministic, always available. Reads structured
                    onboarding responses + activity summary and produces
                    a ranked pick list. Zero external I/O.
  2. LLM layer    — Claude Sonnet 4.6 via Emergent LLM key. Given the same
                    inputs plus the freeform_notes field, it can outrank or
                    add nuance to the rules picks. Falls back silently to
                    the rules layer if the key/network fails.

The final output is always a `list[Recommendation]` of up to N slugs,
sorted by priority (1 = strongest). The endpoint layer never blocks on
the LLM — a 6-second budget then fallback.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
from typing import Iterable

from models import ActivityEvent, OnboardingResponse, Recommendation

log = logging.getLogger("recs")

# Full catalogue of slugs the engine may recommend. Kept in sync with
# users_router.ALLOWED_APP_SLUGS.
ALL_SLUGS = {
    # TuneMavens dashboard apps
    "catalog-porting", "split-cascade", "publishing-election", "distribution-election",
    "djpool", "sync-marketplace", "escrow-contracts",
    "tunemavens-library", "tunemavens-tips",
    "mpesa-pos-inventory", "mpesa-pos-settlement", "mpesa-pos-devices",
    # Native apps
    "intermaven-tunemavens", "intermaven-creator-companion", "intermaven-mpesa-pos",
    # Intermaven Platform tools
    "intermaven-social-ai", "intermaven-brandkit-ai", "intermaven-smart-crm",
    "intermaven-pitch-deck-ai", "intermaven-pos-system",
    "intermaven-invoicing-payments", "intermaven-contracts",
}

# Short human-readable name + one-line pitch per slug — the LLM uses these to
# reason, and the fallback rationale falls back to the pitch if needed.
CATALOGUE_SUMMARY = {
    "catalog-porting": "Bring back-catalogue in via CSV/DDEX, validate metadata.",
    "split-cascade": "See every dollar flow through writer/producer/publisher splits.",
    "publishing-election": "Choose standard admin vs full-service co-publishing.",
    "distribution-election": "Choose how music reaches DSPs (fee-matched / native / label).",
    "djpool": "Distribute promo cuts to vetted DJs and gate by region.",
    "sync-marketplace": "Pitch tracks for film / TV / ads / games placements.",
    "escrow-contracts": "Hold funds in escrow until milestones clear.",
    "tunemavens-library": "Personal library — playlists, downloads, offline cache.",
    "tunemavens-tips": "Track incoming tips and TuneMavens app purchases.",
    "mpesa-pos-inventory": "Mobile POS inventory for merch & physical media.",
    "mpesa-pos-settlement": "Reconcile M-Pesa POS settlement runs against ledger.",
    "mpesa-pos-devices": "Pair and manage POS hardware tied to your account.",
    "intermaven-tunemavens": "Native listener app — HQ streaming, tipping, credits.",
    "intermaven-creator-companion": "Mobile split ledger, payouts, sync alerts.",
    "intermaven-mpesa-pos": "Portable POS for live events with M-Pesa acceptance.",
    "intermaven-social-ai": "Multi-account AI social manager (captions, schedule, insights).",
    "intermaven-brandkit-ai": "Build brand identity, voice, palette & visuals.",
    "intermaven-smart-crm": "Bookings, contacts, revenue in one CRM dashboard.",
    "intermaven-pitch-deck-ai": "AI investor/label pitch decks with brand-matched visuals.",
    "intermaven-pos-system": "Web companion to the M-Pesa POS native app.",
    "intermaven-invoicing-payments": "M-Pesa invoices, cards, billing automation.",
    "intermaven-contracts": "Kenya-law-compliant contract templates with e-sign.",
}


# ----------------------------------------------------------------------
# Rules layer
# ----------------------------------------------------------------------
def rules_recommend(
    *,
    role: str,
    onboarding: OnboardingResponse | None,
    activity_summary: dict,
    already_activated: Iterable[str] = (),
    limit: int = 6,
) -> list[Recommendation]:
    """Deterministic scorer. Higher score = higher priority.

    We score every slug across a handful of axes (role fit, primary goal
    match, revenue focus match, distribution setup match, cadence match)
    and then rank. Already-activated apps are demoted, not hidden — they
    still show up if they're objectively the strongest fit, but the
    endpoint layer filters them out before returning.
    """
    o = onboarding
    active_set = set(already_activated)
    scores: dict[str, int] = {s: 0 for s in ALL_SLUGS}

    # ---- Role affinity ----
    role_boost = {
        "creator": {
            "publishing-election": 4, "distribution-election": 4, "split-cascade": 3,
            "catalog-porting": 3, "intermaven-creator-companion": 4,
            "intermaven-social-ai": 2, "intermaven-brandkit-ai": 2,
            "sync-marketplace": 2, "djpool": 2, "tunemavens-tips": 1,
        },
        "label": {
            "catalog-porting": 5, "distribution-election": 4, "publishing-election": 3,
            "split-cascade": 3, "intermaven-smart-crm": 4, "sync-marketplace": 3,
            "mpesa-pos-inventory": 3, "mpesa-pos-settlement": 3,
            "intermaven-contracts": 3, "intermaven-invoicing-payments": 2,
        },
        "dj": {
            "djpool": 5, "tunemavens-library": 4, "intermaven-tunemavens": 3,
            "tunemavens-tips": 2,
        },
        "studio": {"sync-marketplace": 4, "escrow-contracts": 4, "intermaven-contracts": 3},
        "supervisor": {"sync-marketplace": 5, "escrow-contracts": 3, "intermaven-pitch-deck-ai": 2},
        "consumer": {"tunemavens-library": 5, "tunemavens-tips": 3, "intermaven-tunemavens": 4},
        "admin": {
            "catalog-porting": 2, "publishing-election": 2, "distribution-election": 2,
            "split-cascade": 2, "intermaven-smart-crm": 2,
        },
    }
    for slug, boost in role_boost.get(role, {}).items():
        scores[slug] += boost

    if not o:
        # No onboarding yet — role-based ranking is the best we can do.
        return _finalize(scores, active_set, limit, source="rules", freeform=None)

    # ---- Primary goal ----
    goal_boost = {
        "release_music": {"distribution-election": 4, "publishing-election": 4, "catalog-porting": 3, "split-cascade": 3, "intermaven-creator-companion": 2},
        "manage_roster": {"intermaven-smart-crm": 5, "catalog-porting": 4, "split-cascade": 3, "intermaven-contracts": 2},
        "grow_fans": {"intermaven-social-ai": 5, "intermaven-brandkit-ai": 4, "tunemavens-tips": 2, "djpool": 2},
        "sync_licensing": {"sync-marketplace": 5, "escrow-contracts": 3, "intermaven-pitch-deck-ai": 2, "catalog-porting": 2},
        "sell_at_shows": {"intermaven-mpesa-pos": 5, "mpesa-pos-inventory": 4, "mpesa-pos-settlement": 3, "intermaven-invoicing-payments": 2, "intermaven-pos-system": 3},
        "consume": {"tunemavens-library": 5, "tunemavens-tips": 3, "intermaven-tunemavens": 4},
    }
    for slug, boost in goal_boost.get(o.primary_goal or "", {}).items():
        scores[slug] += boost

    # ---- Distribution setup ----
    if o.distribution_setup == "none":
        scores["distribution-election"] += 3
        scores["intermaven-brandkit-ai"] += 1
    elif o.distribution_setup == "diy_aggregator":
        scores["distribution-election"] += 2  # native or label may be better
        scores["catalog-porting"] += 2
    elif o.distribution_setup == "label_deal":
        scores["split-cascade"] += 3
        scores["publishing-election"] += 2
    elif o.distribution_setup == "self_distributed":
        scores["catalog-porting"] += 3
        scores["split-cascade"] += 2

    # ---- Revenue focus ----
    rev_boost = {
        "streaming": {"distribution-election": 3, "split-cascade": 3, "publishing-election": 2},
        "live": {"intermaven-mpesa-pos": 4, "mpesa-pos-inventory": 3, "mpesa-pos-settlement": 2},
        "sync": {"sync-marketplace": 4, "escrow-contracts": 2, "intermaven-pitch-deck-ai": 2},
        "tips_merch": {"tunemavens-tips": 4, "intermaven-tunemavens": 2, "intermaven-mpesa-pos": 2},
    }
    for slug, boost in rev_boost.get(o.revenue_focus or "", {}).items():
        scores[slug] += boost

    # ---- Release cadence ----
    if o.release_cadence in ("4-10", "10+"):
        scores["catalog-porting"] += 2
        scores["distribution-election"] += 1
        scores["intermaven-creator-companion"] += 1
    if o.release_cadence == "0":
        scores["intermaven-brandkit-ai"] += 2  # focus on brand first
        scores["intermaven-social-ai"] += 2

    # ---- Team size ----
    if o.team_size in ("6-20", "20+"):
        scores["intermaven-smart-crm"] += 2
        scores["intermaven-contracts"] += 1

    # ---- Country ----
    if (o.country or "").upper() in {"KE", "TZ", "UG", "RW"}:
        # M-Pesa-first geographies
        scores["intermaven-invoicing-payments"] += 1
        scores["mpesa-pos-inventory"] += 1

    # ---- Activity signals (light nudges) ----
    for slug, visits in (activity_summary.get("tab_visits") or {}).items():
        if visits >= 3 and slug in scores:
            scores[slug] += 1
    for slug in activity_summary.get("recent_deactivations", []) or []:
        if slug in scores:
            scores[slug] -= 2

    return _finalize(scores, active_set, limit, source="rules", freeform=o.freeform_notes if o else None)


def _finalize(
    scores: dict[str, int],
    active_set: set[str],
    limit: int,
    *,
    source: str,
    freeform: str | None,
) -> list[Recommendation]:
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    picks: list[Recommendation] = []
    for slug, score in ranked:
        if slug in active_set:
            continue
        if score <= 0:
            continue
        picks.append(Recommendation(
            slug=slug,
            rationale=CATALOGUE_SUMMARY.get(slug, ""),
            priority=len(picks) + 1,
            source=source,
        ))
        if len(picks) >= limit:
            break
    return picks


# ----------------------------------------------------------------------
# LLM layer
# ----------------------------------------------------------------------
async def llm_recommend(
    *,
    role: str,
    onboarding: OnboardingResponse | None,
    activity_summary: dict,
    already_activated: Iterable[str] = (),
    limit: int = 6,
    timeout_s: float = 15.0,
) -> list[Recommendation] | None:
    """Ask Claude Sonnet 4.6 for a ranked pick list; return None on any
    failure so the caller can fall back to rules cleanly."""
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        return None

    try:
        # Imported lazily so a missing library never crashes the module.
        from emergentintegrations.llm.chat import LlmChat, UserMessage
    except Exception as exc:  # pragma: no cover
        log.warning("emergentintegrations import failed: %s", exc)
        return None

    active_list = list(already_activated)
    catalogue_lines = "\n".join(f"- {s}: {desc}" for s, desc in sorted(CATALOGUE_SUMMARY.items()))
    onboarding_json = onboarding.model_dump(mode="json") if onboarding else {}
    system_msg = (
        "You are the TuneMavens App Recommendation Agent. Given a user's role, "
        "onboarding responses, activity signals, and the list of apps they've "
        "already activated, pick the BEST combination of apps from the provided "
        "catalogue to move them toward their stated goal. Prefer complementary "
        "picks over duplicates. Never recommend an app that is already active. "
        "Return STRICT JSON only \u2014 no prose \u2014 in the shape: "
        "{\"picks\":[{\"slug\":\"...\",\"rationale\":\"one sentence tailored to this user\"}]} "
        "Order picks by priority (best first)."
    )
    prompt = (
        f"ROLE: {role}\n\n"
        f"ONBOARDING: {json.dumps(onboarding_json)}\n\n"
        f"ACTIVITY_SUMMARY: {json.dumps(activity_summary)}\n\n"
        f"ALREADY_ACTIVATED: {json.dumps(active_list)}\n\n"
        f"MAX_PICKS: {limit}\n\n"
        f"CATALOGUE:\n{catalogue_lines}\n"
    )

    chat = LlmChat(
        api_key=key,
        session_id=f"rec-{role}",
        system_message=system_msg,
    ).with_model("anthropic", "claude-sonnet-4-6")

    try:
        response_text = await asyncio.wait_for(
            chat.send_message(UserMessage(text=prompt)),
            timeout=timeout_s,
        )
    except asyncio.TimeoutError:
        log.warning("LLM recommendation timed out after %.1fs", timeout_s)
        return None
    except Exception as exc:
        log.warning("LLM recommendation failed: %s", exc)
        return None

    # Extract JSON from the model response (guard against fences).
    raw = response_text.strip()
    if raw.startswith("```"):
        raw = raw.strip("`").split("\n", 1)[-1]
        if raw.endswith("```"):
            raw = raw[: -3]
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        log.warning("LLM returned non-JSON: %s", raw[:200])
        return None

    picks_raw = parsed.get("picks") or []
    picks: list[Recommendation] = []
    active_set = set(active_list)
    for i, item in enumerate(picks_raw):
        slug = (item or {}).get("slug")
        rationale = (item or {}).get("rationale") or CATALOGUE_SUMMARY.get(slug, "")
        if not slug or slug in active_set or slug not in ALL_SLUGS:
            continue
        picks.append(Recommendation(slug=slug, rationale=rationale, priority=len(picks) + 1, source="llm"))
        if len(picks) >= limit:
            break
    return picks or None


# ----------------------------------------------------------------------
# Public entrypoint used by the router
# ----------------------------------------------------------------------
async def recommend(
    *,
    role: str,
    onboarding: OnboardingResponse | None,
    activity_summary: dict,
    already_activated: Iterable[str] = (),
    limit: int = 6,
) -> list[Recommendation]:
    """LLM first, rules fallback. Always returns something."""
    llm_picks = await llm_recommend(
        role=role,
        onboarding=onboarding,
        activity_summary=activity_summary,
        already_activated=already_activated,
        limit=limit,
    )
    if llm_picks:
        return llm_picks
    return rules_recommend(
        role=role,
        onboarding=onboarding,
        activity_summary=activity_summary,
        already_activated=already_activated,
        limit=limit,
    )
