// ================= Phase 3 Dashboard Components =================
// Extracted from App.jsx to keep that file under control.
// Contains: OnboardingStripe, OnboardingWizardModal, RecommendationHero,
// PublishingElectionPanel, DistributionElectionPanel, ContractDrawer,
// AppMarketplacePanel  -  plus the PanelHeader helper they share.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiCloseFill, RiCheckboxCircleFill, RiArrowDownSFill, RiArrowLeftFill, RiArrowRightFill, RiResetLeftFill, RiSendPlaneFill, RiPenBrushFill, RiLinksFill, RiMailFill, RiLockFill, RiBookOpenFill, RiGlobalFill, RiRadioFill, RiShieldFill, RiMusicFill, RiSmartphoneFill, RiDatabase2Fill, RiCoinsFill, RiUsersFill as UsersIcon } from 'react-icons/ri'
import { dealsApi, usersApi, contractsApi } from '../lib/api.js'
import { INTERMAVEN_NATIVE_APPS } from '../lib/nativeApps.js'
import { INTERMAVEN_PLATFORM_APPS } from '../lib/intermavenPlatformApps.js'
import { lookupApp } from '../lib/appCatalog.js'

// Small shared helper  -  a plain title + description block used by every
// Phase 3 panel. Kept next to the panels that use it.
export function PanelHeader({ title, desc }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{title}</h3>
      <p style={{ fontSize: '12px', color: 'var(--mu)', margin: 0 }}>{desc}</p>
    </div>
  );
}

export function OnboardingStripe({ sessionUser, setActiveTab, onOpenWizard, wizardAnswers }) {
  const [pubDeals, setPubDeals] = useState([]);
  const [distDeals, setDistDeals] = useState([]);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('onboarding_dismissed') === 'true');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let cancelled = false;
    Promise.all([
      dealsApi.publishing.list({ active_only: true }).catch(() => []),
      dealsApi.distribution.list({ active_only: true }).catch(() => []),
    ]).then(([p, d]) => {
      if (cancelled) return;
      setPubDeals(Array.isArray(p) ? p : []);
      setDistDeals(Array.isArray(d) ? d : []);
    });
    return () => { cancelled = true; };
  }, [dismissed]);

  if (dismissed) return null;
  if (sessionUser?.role === 'consumer' || sessionUser?.role === 'admin') return null;

  const profileDone = !!(sessionUser?.name && sessionUser?.brand_name && sessionUser?.country);
  const wizardDone = !!(
    wizardAnswers && (
      (Array.isArray(wizardAnswers.primary_goal) && wizardAnswers.primary_goal.length > 0) ||
      (typeof wizardAnswers.primary_goal === 'string' && wizardAnswers.primary_goal) ||
      (wizardAnswers.primary_goal_other && wizardAnswers.primary_goal_other.trim())
    )
  );
  const publishingDone = pubDeals.length > 0;
  const distributionDone = distDeals.length > 0;
  const appActivated = (sessionUser?.apps || []).length > 0;
  const catalogStarted = false; // wired in Phase 4

  const steps = [
    { id: 'profile', label: 'Complete your profile', done: profileDone, tab: 'profile', cta: 'Open Profile' },
    { id: 'wizard', label: 'Tell us about your goals', done: wizardDone, cta: 'Start Wizard', onClick: onOpenWizard },
    { id: 'publishing', label: 'Elect your publishing tier', done: publishingDone, tab: 'publishing-election', cta: 'Choose Tier' },
    { id: 'distribution', label: 'Elect your distribution path', done: distributionDone, tab: 'distribution-election', cta: 'Choose Path' },
    { id: 'apps', label: 'Activate a Dashboard App', done: appActivated, tab: 'app-marketplace', cta: 'Browse Apps' },
    { id: 'catalog', label: 'Port your first track', done: catalogStarted, tab: 'catalog', cta: 'Start Catalog' },
  ];

  const completed = steps.filter(s => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);
  const allDone = completed === steps.length;
  if (allDone) return null;

  const nextStep = steps.find(s => !s.done);

  const dismiss = () => {
    sessionStorage.setItem('onboarding_dismissed', 'true');
    setDismissed(true);
  };

  return (
    <div className="onboarding-stripe" data-testid="onboarding-stripe">
      <div className="onboarding-stripe-header">
        <div>
          <div className="onboarding-stripe-eyebrow">
            <span className="onboarding-stripe-pulse" />
            <span>Welcome aboard · {completed}/{steps.length} steps complete · {percent}%</span>
          </div>
          <h3 className="onboarding-stripe-title">
            {nextStep ? `Next: ${nextStep.label.toLowerCase()}` : 'You\u2019re all set'}
          </h3>
        </div>
        <div className="onboarding-stripe-controls">
          {onOpenWizard && (
            <button
              type="button"
              className="onboarding-reeval-btn"
              onClick={onOpenWizard}
              data-testid="onboarding-reeval"
            >
              <RiResetLeftFill size={12} /> Re-evaluate goals
            </button>
          )}
          <button
            type="button"
            className="onboarding-collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            data-testid="onboarding-collapse"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            <RiArrowDownSFill size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>
          <button
            type="button"
            className="onboarding-dismiss-btn"
            onClick={dismiss}
            title="Hide until next session"
            data-testid="onboarding-dismiss"
          >
            <RiCloseFill size={14} />
          </button>
        </div>
      </div>

      <div className="onboarding-progress-track">
        <div className="onboarding-progress-bar" style={{ width: `${percent}%` }} />
      </div>

      {!collapsed && (
        <ul className="onboarding-steps">
          {steps.map(s => (
            <li
              key={s.id}
              className={`onboarding-step ${s.done ? 'done' : ''}`}
              data-testid={`onboarding-step-${s.id}`}
            >
              <div className="onboarding-step-status" aria-hidden="true">
                {s.done ? <RiCheckboxCircleFill size={16} /> : <span className="onboarding-step-bullet" />}
              </div>
              <div className="onboarding-step-body">
                <span className="onboarding-step-label">{s.label}</span>
              </div>
              {!s.done && (
                <button
                  type="button"
                  className="onboarding-step-cta"
                  onClick={() => {
                    if (s.onClick) s.onClick();
                    else if (s.external) window.location.hash = s.external;
                    else if (setActiveTab) setActiveTab(s.tab);
                  }}
                  data-testid={`onboarding-cta-${s.id}`}
                >
                  {s.cta} <RiArrowRightFill size={12} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ================= Onboarding Wizard Modal (Phase 3, §9.8) =================
// A short 6-question wizard that captures the user's stated goals. Questions
// flagged `multi: true` allow multiple picks. Every question also exposes an
// "Other" option with an inline free-text input so the AI Recommendation
// Agent can search for the closest best solution when none of the preset
// answers fit.
const WIZARD_QUESTIONS = [
  {
    key: 'primary_goal',
    label: 'What\u2019s your primary goal right now?',
    helper: 'Pick every goal that applies  -  the agent optimises across all of them.',
    multi: true,
    allowOther: true,
    options: [
      { value: 'release_music', label: 'Release my own music' },
      { value: 'manage_roster', label: 'Manage a roster / label' },
      { value: 'grow_fans', label: 'Grow my fanbase' },
      { value: 'sync_licensing', label: 'License my music for sync' },
      { value: 'sell_at_shows', label: 'Sell at shows & merch' },
      { value: 'consume', label: 'Just listen & discover' },
    ],
  },
  {
    key: 'release_cadence',
    label: 'How often do you (or your roster) release new music?',
    multi: false,
    allowOther: true,
    options: [
      { value: '0', label: 'Not yet releasing' },
      { value: '1-3', label: '1\u20133 tracks a year' },
      { value: '4-10', label: '4\u201310 tracks a year' },
      { value: '10+', label: '10+ tracks a year' },
    ],
  },
  {
    key: 'distribution_setup',
    label: 'What\u2019s your current distribution setup?',
    multi: false,
    allowOther: true,
    options: [
      { value: 'none', label: 'None yet' },
      { value: 'diy_aggregator', label: 'DIY aggregator (DistroKid, TuneCore, etc.)' },
      { value: 'label_deal', label: 'Signed to a label' },
      { value: 'self_distributed', label: 'Self-distributed via my own imprint' },
    ],
  },
  {
    key: 'revenue_focus',
    label: 'Where do you make (or want to make) most of your revenue?',
    helper: 'Pick every stream that matters  -  the agent balances the mix.',
    multi: true,
    allowOther: true,
    options: [
      { value: 'streaming', label: 'Streaming royalties' },
      { value: 'live', label: 'Live shows / physical sales' },
      { value: 'sync', label: 'Sync placements' },
      { value: 'tips_merch', label: 'Tips & merch from fans' },
    ],
  },
  {
    key: 'team_size',
    label: 'How big is your team?',
    multi: false,
    allowOther: true,
    options: [
      { value: 'solo', label: 'Just me' },
      { value: '2-5', label: '2\u20135 people' },
      { value: '6-20', label: '6\u201320 people' },
      { value: '20+', label: '20+ people' },
    ],
  },
];

export function OnboardingWizardModal({ open, onClose, onSaved, initial }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => ({
    primary_goal: Array.isArray(initial?.primary_goal) ? initial.primary_goal : [],
    release_cadence: initial?.release_cadence || '',
    distribution_setup: initial?.distribution_setup || '',
    revenue_focus: Array.isArray(initial?.revenue_focus) ? initial.revenue_focus : [],
    team_size: initial?.team_size || '',
    country: initial?.country || '',
    primary_goal_other: initial?.primary_goal_other || '',
    release_cadence_other: initial?.release_cadence_other || '',
    distribution_setup_other: initial?.distribution_setup_other || '',
    revenue_focus_other: initial?.revenue_focus_other || '',
    team_size_other: initial?.team_size_other || '',
    freeform_notes: initial?.freeform_notes || '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setStep(0);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const totalSteps = WIZARD_QUESTIONS.length + 1;
  const isLast = step === totalSteps - 1;
  const current = step < WIZARD_QUESTIONS.length ? WIZARD_QUESTIONS[step] : null;
  const otherKey = current ? `${current.key}_other` : null;
  // A step is answered if the user picked at least one option OR filled the
  // "Other" input.
  const currentValue = current ? answers[current.key] : null;
  const currentOther = current ? (answers[otherKey] || '').trim() : '';
  const hasSelection = current
    ? (current.multi ? Array.isArray(currentValue) && currentValue.length > 0 : !!currentValue)
    : true;
  const canProceed = current ? (hasSelection || !!currentOther) : true;

  const toggleOption = (key, value, multi) => {
    setAnswers((a) => {
      if (multi) {
        const arr = Array.isArray(a[key]) ? a[key] : [];
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        return { ...a, [key]: next };
      }
      return { ...a, [key]: a[key] === value ? '' : value };
    });
  };

  const isSelected = (key, value, multi) => {
    const v = answers[key];
    return multi ? (Array.isArray(v) && v.includes(value)) : v === value;
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const saved = await usersApi.saveOnboarding(answers);
      if (onSaved) onSaved(saved || answers);
      onClose();
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not save your responses');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      data-testid="onboarding-wizard-modal"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(3, 7, 18, 0.78)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'linear-gradient(180deg, rgba(11,15,30,0.98), rgba(11,15,30,0.94))', border: '1px solid rgba(34,211,238,0.24)', borderRadius: '3px', padding: '32px 32px 28px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>
              Step {step + 1} of {totalSteps}
            </div>
            <h3 style={{ fontSize: '20px', color: '#f1f5f9', margin: 0, fontWeight: 800, letterSpacing: '-0.3px' }}>Tell us about you</h3>
          </div>
          <button type="button" onClick={onClose} data-testid="wizard-close" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            <RiCloseFill size={18} />
          </button>
        </div>

        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.round(((step + 1) / totalSteps) * 100)}%`, background: 'linear-gradient(90deg, var(--cyan), var(--purple))', transition: 'width 0.3s ease' }} />
        </div>

        {current && (
          <>
            <p style={{ fontSize: '15px', color: '#e2e8f0', marginBottom: current.helper ? '6px' : '18px', fontWeight: 600 }} data-testid={`wizard-question-${current.key}`}>{current.label}</p>
            {current.helper && (
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 0, marginBottom: '14px' }} data-testid={`wizard-helper-${current.key}`}>{current.helper}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {current.options.map((opt) => {
                const selected = isSelected(current.key, opt.value, current.multi);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleOption(current.key, opt.value, current.multi)}
                    data-testid={`wizard-option-${current.key}-${opt.value}`}
                    aria-pressed={selected}
                    style={{ padding: '12px 14px', textAlign: 'left', background: selected ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)', border: selected ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: selected ? '#f1f5f9' : '#cbd5e1', fontSize: '13px', fontWeight: selected ? 700 : 500, cursor: 'pointer', transition: 'border-color 0.15s ease, background 0.15s ease', display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <span style={{ width: current.multi ? '14px' : '10px', height: current.multi ? '14px' : '10px', borderRadius: current.multi ? '2px' : '50%', border: `1px solid ${selected ? 'var(--cyan)' : 'rgba(255,255,255,0.25)'}`, background: selected ? 'var(--cyan)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected && current.multi && <RiCheckboxCircleFill size={10} color="#0b0f1e" strokeWidth={4} />}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {current.allowOther && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1.2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                  Other {current.multi ? '(add your own  -  optional)' : '(describe if none of the above fit)'}
                </label>
                <input
                  type="text"
                  value={answers[otherKey] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [otherKey]: e.target.value }))}
                  data-testid={`wizard-other-${current.key}`}
                  placeholder={"Type here  -  the AI will find the closest matching apps"}
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#f1f5f9', fontSize: '13px' }}
                />
              </div>
            )}
          </>
        )}

        {step === WIZARD_QUESTIONS.length && (
          <>
            <p style={{ fontSize: '15px', color: '#e2e8f0', marginBottom: '10px', fontWeight: 600 }} data-testid="wizard-question-freeform">Anything else the recommendation agent should know?</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>Optional. Free-form context  -  sound, market, goals, constraints. The AI reads this too.</p>
            <textarea value={answers.freeform_notes} onChange={(e) => setAnswers((a) => ({ ...a, freeform_notes: e.target.value }))} rows={5} data-testid="wizard-freeform" placeholder="e.g. Afrobeats artist based in Nairobi, mostly live income right now, want to break into sync in the next 12 months."
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#f1f5f9', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', marginBottom: '24px' }}
            />
          </>
        )}

        {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }} data-testid="wizard-error">{error}</p>}

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} data-testid="wizard-back"
            style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: step === 0 ? '#475569' : '#cbd5e1', borderRadius: '3px', fontWeight: 700, fontSize: '12px', cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
            <RiArrowLeftFill size={12} style={{ display: 'inline', marginRight: 4 }} /> Back
          </button>
          {isLast ? (
            <button type="button" onClick={save} disabled={saving} data-testid="wizard-submit"
              style={{ padding: '10px 20px', background: 'linear-gradient(90deg, var(--cyan), var(--purple))', border: 'none', color: '#0b0f1e', borderRadius: '3px', fontWeight: 800, fontSize: '13px', cursor: saving ? 'wait' : 'pointer', letterSpacing: '0.3px' }}>
              {saving ? 'Saving\u2026' : 'Get my picks'} <RiArrowRightFill size={12} style={{ display: 'inline', marginLeft: 4 }} />
            </button>
          ) : (
            <button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canProceed} data-testid="wizard-next"
              style={{ padding: '10px 20px', background: canProceed ? 'var(--cyan)' : 'rgba(255,255,255,0.08)', border: 'none', color: canProceed ? '#0b0f1e' : '#64748b', borderRadius: '3px', fontWeight: 800, fontSize: '13px', cursor: canProceed ? 'pointer' : 'not-allowed', letterSpacing: '0.3px' }}>
              Next <RiArrowRightFill size={12} style={{ display: 'inline', marginLeft: 4 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= Recommendation Hero (Phase 3, §9.8) =================
// Displayed at the top of the App Marketplace. When no onboarding responses
// exist we show a CTA to run the wizard; once responses exist we show the
// ranked picks from /api/users/me/recommendations (LLM-first, rules fallback).
export function RecommendationHero({ activatedSlugs, onActivate, onOpen, onOpenWizard, hasAnswers, refreshKey }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('rules');

  useEffect(() => {
    let cancelled = false;
    if (!hasAnswers) {
      setRecs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    usersApi.getRecommendations(4)
      .then((list) => {
        if (cancelled) return;
        const arr = Array.isArray(list) ? list : [];
        setRecs(arr);
        if (arr[0]) setSource(arr[0].source || 'rules');
      })
      .catch(() => setRecs([]))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [hasAnswers, activatedSlugs.join(','), refreshKey]);

  if (!hasAnswers) {
    return (
      <div data-testid="recommendation-hero-cta"
        style={{ padding: '18px 22px', background: 'linear-gradient(90deg, rgba(34,211,238,0.10), rgba(139,92,246,0.08)), rgba(11,15,30,0.65)', border: '1px solid rgba(34,211,238,0.24)', borderRadius: '3px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>Not sure where to start?</div>
          <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 700 }}>Answer 5 quick questions and the AI Recommendation Agent will pick the best combination of apps for you.</div>
        </div>
        <button type="button" onClick={onOpenWizard} data-testid="recommendation-hero-open-wizard"
          style={{ padding: '10px 18px', background: 'linear-gradient(90deg, var(--cyan), var(--purple))', border: 'none', color: '#0b0f1e', borderRadius: '3px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', letterSpacing: '0.3px' }}>
          Get my picks <RiArrowRightFill size={12} style={{ display: 'inline', marginLeft: 4 }} />
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div data-testid="recommendation-hero-loading" style={{ padding: '18px', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '3px', marginBottom: '24px', color: '#94a3b8', fontSize: '12px' }}>
        Consulting the recommendation agent&hellip;
      </div>
    );
  }

  if (!recs.length) return null;

  return (
    <div data-testid="recommendation-hero"
      style={{ padding: '18px 22px', background: 'linear-gradient(90deg, rgba(34,211,238,0.08), rgba(139,92,246,0.06)), rgba(11,15,30,0.5)', border: '1px solid rgba(34,211,238,0.24)', borderRadius: '3px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '2px' }}>
            {`Recommended for you \u00b7 ${source === 'llm' ? 'AI-generated' : 'Rule-based'}`}
          </div>
          <div style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 700 }}>Your best-fit combination</div>
        </div>
        <button type="button" onClick={onOpenWizard} data-testid="recommendation-hero-retake"
          style={{ padding: '6px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Retake wizard
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {recs.map((r) => {
          const app = lookupApp(r.slug);
          if (!app) return null;
          const Icon = app.icon;
          const isActive = activatedSlugs.includes(r.slug);
          return (
            <div key={r.slug} data-testid={`recommendation-card-${r.slug}`}
              style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: isActive ? `1px solid ${app.accent}` : '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '3px', background: `${app.accent}1f`, color: app.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f1f5f9', flex: 1, minWidth: 0 }}>{app.name}</div>
                <div style={{ fontSize: '9px', color: 'var(--cyan)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800 }}>#{r.priority}</div>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', margin: 0, flex: 1 }}>{r.rationale}</p>
              {isActive ? (
                <button type="button" onClick={() => onOpen(app)} data-testid={`recommendation-open-${r.slug}`}
                  style={{ padding: '6px 10px', background: app.accent, color: '#0b0f1e', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.3px' }}>
                  {app.launchUrl ? 'Launch \u2197' : app.landingPath ? 'View App' : 'Open'}
                </button>
              ) : (
                <button type="button" onClick={() => onActivate(r.slug)} data-testid={`recommendation-activate-${r.slug}`}
                  style={{ padding: '6px 10px', background: app.accent, color: '#0b0f1e', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.3px' }}>
                  Activate
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}



// ================= Publishing Election Panel (Phase 3) =================
// Lets a creator pick one of the 3 publishing tiers and save it.
export function PublishingElectionPanel({ sessionUser }) {
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState('standard_admin');
  const [partner, setPartner] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [recoupmentRate, setRecoupmentRate] = useState('70');
  const [acquirer, setAcquirer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [contractDraft, setContractDraft] = useState(null); // opened after save

  const loadDeals = () => {
    setLoading(true);
    dealsApi.publishing
      .list()
      .then((list) => setExisting(Array.isArray(list) ? list : []))
      .catch(() => setExisting([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const current = existing.find((d) => d.status === 'active') || null;
  const history = existing.filter((d) => d.status !== 'active');

  const tiers = [
    {
      key: 'standard_admin',
      title: 'Standard Administration',
      headline: '50/50 publisher\u2019s share',
      desc: 'We register your works with PROs, collect publishing royalties, and pay you out. No pitching service  -  admin only.',
      badge: 'Self-publisher friendly',
    },
    {
      key: 'full_service_copub',
      title: 'Full-Service Co-Publishing',
      headline: 'Co-publishing with active pitching',
      desc: 'A named publishing partner pitches your catalogue for sync + placement. Optional writer/production credit captured per work.',
      badge: 'Most popular for sync-led artists',
    },
    {
      key: 'catalogue_acquisition',
      title: 'Catalogue Acquisition / Advance',
      headline: 'Recoupable advance against your earnings',
      desc: 'Take an upfront advance or sell your catalogue outright. Standard recoupment applies until cleared.',
      badge: 'Capital-forward path',
    },
  ];

  const submit = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      let dealResp = null;
      let contractContext = { tier };
      if (tier === 'catalogue_acquisition') {
        const amount = parseFloat(advanceAmount);
        const rate = parseFloat(recoupmentRate);
        if (!amount || amount <= 0) {
          throw new Error('Enter an advance amount greater than zero');
        }
        // Persist to the catalogue-acquisitions ledger instead of publishing_deals.
        dealResp = await dealsApi.catalogueAcquisitions.create({
          creator_id: sessionUser?.id || 'self',
          deal_type: 'publishing_advance',
          original_amount: amount,
          remaining_balance: amount,
          recouped_to_date: 0,
        });
        contractContext = {
          tier,
          advance_amount: amount,
          recoupment_rate: rate,
          acquirer: acquirer || 'TuneMavens Catalogue Partners',
        };
        setSuccess(`Advance captured: USD ${amount.toLocaleString()} at ${rate}% recoupment. Draft a contract to lock the terms with your acquirer.`);
      } else {
        const payload = {
          creator_id: sessionUser?.id || 'self',
          tier,
          ...(tier === 'full_service_copub' && partner ? { copublisher_partner_id: partner } : {}),
        };
        dealResp = await dealsApi.publishing.create(payload);
        contractContext = { tier, ...(partner ? { copublisher_partner_id: partner } : {}) };
        setSuccess(`Publishing tier locked in: ${tiers.find(t => t.key === tier).title}`);
      }
      loadDeals();
      // Auto-draft the contract so users can invite counterparties immediately.
      const contractKind = tier === 'catalogue_acquisition' ? 'catalogue_acquisition' : 'publishing';
      const draft = await contractsApi.create({
        kind: contractKind,
        linked_deal_id: dealResp?.id || dealResp?._id,
        context: contractContext,
      });
      setContractDraft(draft);
      return dealResp;
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not save election');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card" data-testid="publishing-election-panel">
      <PanelHeader
        title="Publishing Election"
        desc="Choose how TuneMavens administers your publishing rights. Three configurations  -  you sign a contract afterwards to lock the terms."
      />

      {current && (
        <div style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '3px', marginBottom: '18px' }} data-testid="publishing-current-election">
          <div style={{ color: '#10b981', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Current Election</div>
          <div style={{ color: '#f1f5f9', fontSize: '13px' }}>
            <strong>{current.tier === 'standard_admin' ? 'Standard Administration' : 'Full-Service Co-Publishing'}</strong>
            {current.copublisher_partner_id ? ` · partner: ${current.copublisher_partner_id}` : ''}
            {' · '}contract id: <code style={{ color: '#94a3b8' }}>{current.contract_id || 'pending e-sign'}</code>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(h => !h)}
              data-testid="publishing-history-toggle"
              style={{ marginTop: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {showHistory ? 'Hide' : 'Show'} history ({history.length})
            </button>
          )}
          {showHistory && history.length > 0 && (
            <ul data-testid="publishing-history-list" style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {history.map((h) => (
                <li key={h.id} style={{ padding: '8px 0', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', fontWeight: 800 }}>{h.status}</span>
                  {' · '}{h.tier === 'standard_admin' ? 'Standard Administration' : 'Full-Service Co-Publishing'}
                  {h.created_at ? ` · ${new Date(h.created_at).toLocaleDateString()}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading current election…</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            {tiers.map(t => (
              <button
                key={t.key}
                type="button"
                disabled={t.disabled}
                onClick={() => setTier(t.key)}
                className="election-card"
                data-testid={`publishing-tier-${t.key}`}
                style={{
                  textAlign: 'left',
                  padding: '18px',
                  border: tier === t.key ? '2px solid var(--cyan)' : '1px solid rgba(255,255,255,0.08)',
                  background: tier === t.key ? 'rgba(34, 211, 238, 0.06)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '3px',
                  cursor: t.disabled ? 'not-allowed' : 'pointer',
                  opacity: t.disabled ? 0.45 : 1,
                  color: 'inherit', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: '9px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>{t.badge}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>{t.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 700, marginBottom: '10px' }}>{t.headline}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.55' }}>{t.desc}</div>
                {t.disabled && <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b' }}>Coming soon</div>}
              </button>
            ))}
          </div>

          {tier === 'full_service_copub' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Co-publishing partner (optional)</label>
              <input
                type="text"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Sony ATV, Warner Chappell, etc."
                className="form-control"
                style={{ width: '100%', maxWidth: '360px', background: 'rgba(11, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', padding: '10px', fontSize: '13px' }}
                data-testid="publishing-partner-input"
              />
            </div>
          )}

          {tier === 'catalogue_acquisition' && (
            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }} data-testid="catalogue-acquisition-fields">
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Advance amount (USD)</label>
                <input
                  type="number"
                  min="0"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="form-control"
                  style={{ width: '100%', background: 'rgba(11, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', padding: '10px', fontSize: '13px' }}
                  data-testid="catalogue-advance-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Recoupment rate (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={recoupmentRate}
                  onChange={(e) => setRecoupmentRate(e.target.value)}
                  placeholder="70"
                  className="form-control"
                  style={{ width: '100%', background: 'rgba(11, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', padding: '10px', fontSize: '13px' }}
                  data-testid="catalogue-recoup-input"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Acquirer / advancer (optional)</label>
                <input
                  type="text"
                  value={acquirer}
                  onChange={(e) => setAcquirer(e.target.value)}
                  placeholder="Blue Note Music, TuneMavens Catalogue Partners, etc."
                  className="form-control"
                  style={{ width: '100%', background: 'rgba(11, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', padding: '10px', fontSize: '13px' }}
                  data-testid="catalogue-acquirer-input"
                />
              </div>
              <p style={{ gridColumn: '1 / -1', fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                The advance is repaid from your future publisher share at the recoupment rate above. Your writer credit share is protected and cannot be reduced.
              </p>
            </div>
          )}

          {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '10px' }} data-testid="publishing-error">{error}</p>}
          {success && <p style={{ color: '#10b981', fontSize: '12px', marginBottom: '10px' }} data-testid="publishing-success">{success}</p>}

          <button
            type="button"
            className="btn-primary"
            disabled={submitting}
            onClick={submit}
            style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800 }}
            data-testid="publishing-submit"
          >
            {submitting ? 'Saving…' : (tier === 'catalogue_acquisition' ? 'Save advance & draft contract' : 'Lock in publishing election')}
          </button>
        </>
      )}

      {contractDraft && (
        <ContractDrawer
          contract={contractDraft}
          onClose={() => setContractDraft(null)}
          onUpdated={(next) => setContractDraft(next)}
          sessionUser={sessionUser}
        />
      )}
    </div>
  );
}

// ================= Distribution Election Panel (Phase 3) =================
export function DistributionElectionPanel({ sessionUser }) {
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = useState('tunemavens_native');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [contractDraft, setContractDraft] = useState(null);

  const loadDeals = () => {
    setLoading(true);
    dealsApi.distribution
      .list()
      .then((list) => setExisting(Array.isArray(list) ? list : []))
      .catch(() => setExisting([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const current = existing.find((d) => d.status === 'active') || null;
  const history = existing.filter((d) => d.status !== 'active');

  const paths = [
    {
      key: 'standard_fee_matched',
      fee_structure: 'flat_fee',
      title: 'Standard (Fee-Matched)',
      headline: 'Flat fee · you keep 100% of DSP royalties',
      desc: 'Mirrors DistroKid-style pricing. Pay an annual or per-release flat fee; we ship your music to 150+ DSPs and you keep every cent of royalties.',
      badge: 'Familiar pricing',
    },
    {
      key: 'tunemavens_native',
      fee_structure: 'rev_share',
      title: 'TuneMavens Native',
      headline: '45 / 55 revenue share',
      desc: 'Distribute through tunemavens.com\u2019s native network. We take 45%, you keep 55%  -  admin-editable per release.',
      badge: 'Best for our network',
    },
    {
      key: 'label_negotiated',
      fee_structure: 'rev_share',
      title: 'Label / Catalogue Negotiation',
      headline: 'AI-wizard negotiated split',
      desc: 'For labels with existing catalogue. AI opens at 50/50 and iterates counter-offers until both parties lock terms.',
      badge: 'For labels & catalogue owners',
      disabled: sessionUser?.role !== 'label',
    },
  ];

  const submit = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const p = paths.find(x => x.key === path);
      const payload = {
        creator_id: sessionUser?.id || 'self',
        path,
        fee_structure: p.fee_structure,
        ...(path === 'tunemavens_native' ? { tunemavens_split_pct: 45, creator_split_pct: 55 } : {}),
      };
      const deal = await dealsApi.distribution.create(payload);
      setSuccess(`Distribution path locked in: ${p.title}`);
      loadDeals();
      // Auto-draft a contract so users can invite counterparties immediately.
      const draft = await contractsApi.create({
        kind: 'distribution',
        linked_deal_id: deal?.id || deal?._id,
        context: payload,
      });
      setContractDraft(draft);
      return deal;
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not save election');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card" data-testid="distribution-election-panel">
      <PanelHeader
        title="Distribution Election"
        desc="Choose how your music reaches DSPs and how revenue splits. Three paths, each with its own trade-offs."
      />

      {current && (
        <div style={{ padding: '12px 14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '3px', marginBottom: '18px' }} data-testid="distribution-current-election">
          <div style={{ color: '#10b981', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Current Path</div>
          <div style={{ color: '#f1f5f9', fontSize: '13px' }}>
            <strong>{current.path === 'standard_fee_matched' ? 'Standard (Fee-Matched)' : current.path === 'tunemavens_native' ? 'TuneMavens Native' : 'Label / Catalogue Negotiation'}</strong>
            {' · '}{current.fee_structure === 'flat_fee' ? 'Flat fee' : 'Revenue share'}
            {current.path === 'tunemavens_native' && current.tunemavens_split_pct != null ? ` · ${current.tunemavens_split_pct}/${current.creator_split_pct}` : ''}
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(h => !h)}
              data-testid="distribution-history-toggle"
              style={{ marginTop: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 700 }}
            >
              {showHistory ? 'Hide' : 'Show'} history ({history.length})
            </button>
          )}
          {showHistory && history.length > 0 && (
            <ul data-testid="distribution-history-list" style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {history.map((h) => (
                <li key={h.id} style={{ padding: '8px 0', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', fontWeight: 800 }}>{h.status}</span>
                  {' · '}{h.path}
                  {h.created_at ? ` · ${new Date(h.created_at).toLocaleDateString()}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading current path…</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            {paths.map(p => (
              <button
                key={p.key}
                type="button"
                disabled={p.disabled}
                onClick={() => setPath(p.key)}
                className="election-card"
                data-testid={`distribution-path-${p.key}`}
                style={{
                  textAlign: 'left',
                  padding: '18px',
                  border: path === p.key ? '2px solid var(--purple)' : '1px solid rgba(255,255,255,0.08)',
                  background: path === p.key ? 'rgba(139, 92, 246, 0.06)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '3px',
                  cursor: p.disabled ? 'not-allowed' : 'pointer',
                  opacity: p.disabled ? 0.45 : 1,
                  color: 'inherit', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: '9px', color: 'var(--purple)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '8px' }}>{p.badge}</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>{p.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--purple)', fontWeight: 700, marginBottom: '10px' }}>{p.headline}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.55' }}>{p.desc}</div>
                {p.disabled && <div style={{ marginTop: '8px', fontSize: '10px', color: '#64748b' }}>Available for label-role accounts</div>}
              </button>
            ))}
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '10px' }} data-testid="distribution-error">{error}</p>}
          {success && <p style={{ color: '#10b981', fontSize: '12px', marginBottom: '10px' }} data-testid="distribution-success">{success}</p>}

          <button
            type="button"
            className="btn-primary"
            disabled={submitting}
            onClick={submit}
            style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 800 }}
            data-testid="distribution-submit"
          >
            {submitting ? 'Saving…' : 'Lock in distribution path'}
          </button>
        </>
      )}

      {contractDraft && (
        <ContractDrawer
          contract={contractDraft}
          onClose={() => setContractDraft(null)}
          onUpdated={(next) => setContractDraft(next)}
          sessionUser={sessionUser}
        />
      )}
    </div>
  );
}

// ================= Contract Drawer =================
// Full-height side panel that opens after a deal is saved. Shows every
// clause, marks locked clauses clearly, lets the owner invite
// counterparties (email + shareable link over email/WhatsApp/SMS),
// review incoming proposals, accept or reject them, and sign.
export function ContractDrawer({ contract, onClose, onUpdated, sessionUser }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteChannel, setInviteChannel] = useState('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [proposingClause, setProposingClause] = useState(null);
  const [proposalBody, setProposalBody] = useState('');
  const [proposalNote, setProposalNote] = useState('');

  if (!contract) return null;

  const isOwner = String(contract.owner_id) === String(sessionUser?.id);
  const cid = contract.id || contract._id;
  const shareUrl = contract.share_token
    ? `${window.location.origin}/#/contracts/${cid}?t=${contract.share_token}`
    : null;

  const invite = async () => {
    if (!inviteEmail.trim()) return;
    setBusy(true); setError('');
    try {
      const next = await contractsApi.invite(cid, { email: inviteEmail.trim(), channel: inviteChannel });
      onUpdated && onUpdated(next);
      setInviteEmail('');
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not send invite');
    } finally {
      setBusy(false);
    }
  };

  const submitProposal = async () => {
    if (!proposingClause || !proposalBody.trim()) return;
    setBusy(true); setError('');
    try {
      const next = await contractsApi.propose(cid, {
        clause_id: proposingClause,
        new_body: proposalBody,
        note: proposalNote || undefined,
      });
      onUpdated && onUpdated(next);
      setProposingClause(null); setProposalBody(''); setProposalNote('');
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not submit proposal');
    } finally {
      setBusy(false);
    }
  };

  const resolveProposal = async (clauseId, idx, accept) => {
    setBusy(true); setError('');
    try {
      const next = await contractsApi.resolveProposal(cid, { clause_id: clauseId, proposal_index: idx, accept });
      onUpdated && onUpdated(next);
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not resolve');
    } finally {
      setBusy(false);
    }
  };

  const sign = async () => {
    setBusy(true); setError('');
    try {
      const next = await contractsApi.sign(cid);
      onUpdated && onUpdated(next);
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not sign');
    } finally {
      setBusy(false);
    }
  };

  const copyShare = () => {
    if (!shareUrl) return;
    navigator.clipboard?.writeText(shareUrl);
  };

  const channelHref = (channel, email) => {
    if (!shareUrl) return null;
    const msg = encodeURIComponent(`You have been invited to view and negotiate a music-business contract: ${shareUrl}`);
    if (channel === 'whatsapp') return `https://wa.me/?text=${msg}`;
    if (channel === 'sms') return `sms:?body=${msg}`;
    return `mailto:${encodeURIComponent(email || '')}?subject=${encodeURIComponent(contract.title)}&body=${msg}`;
  };

  const statusColor = { draft: '#64748b', negotiating: '#F4D35E', signed: '#10b981', cancelled: '#94a3b8' }[contract.status] || '#94a3b8';

  return (
    <div
      data-testid="contract-drawer"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(3,7,18,0.7)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'flex-end', zIndex: 1050 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 'min(720px, 100%)', height: '100%', background: '#0b0f1e', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}
      >
        <header style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', color: statusColor, letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }} data-testid="contract-status">{contract.status}</div>
            <h3 style={{ fontSize: '18px', color: '#f1f5f9', margin: 0, fontWeight: 800, letterSpacing: '-0.3px' }} data-testid="contract-title">{contract.title}</h3>
          </div>
          <button type="button" onClick={onClose} data-testid="contract-drawer-close" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            <RiCloseFill size={18} />
          </button>
        </header>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {error && <p style={{ color: '#f87171', fontSize: '12px' }} data-testid="contract-error">{error}</p>}

          {isOwner && (
            <section style={{ marginBottom: '24px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px' }}>Invite counterparties</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com" data-testid="contract-invite-email"
                  style={{ flex: '1 1 200px', padding: '10px 12px', background: 'rgba(11,15,30,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', borderRadius: '3px' }} />
                <select value={inviteChannel} onChange={(e) => setInviteChannel(e.target.value)} data-testid="contract-invite-channel"
                  style={{ padding: '10px 12px', background: 'rgba(11,15,30,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '13px', borderRadius: '3px' }}>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="in_app">In-app only</option>
                </select>
                <button type="button" onClick={invite} disabled={busy || !inviteEmail.trim()} data-testid="contract-invite-submit"
                  style={{ padding: '10px 16px', background: 'var(--cyan)', color: '#0b0f1e', border: 'none', borderRadius: '3px', fontWeight: 800, fontSize: '12px', cursor: busy ? 'wait' : 'pointer', letterSpacing: '0.3px' }}>
                  <RiSendPlaneFill size={12} style={{ display: 'inline', marginRight: 4 }} /> Invite
                </button>
              </div>
              {shareUrl && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <button type="button" onClick={copyShare} data-testid="contract-copy-share-link"
                    style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    <RiLinksFill size={11} style={{ display: 'inline', marginRight: 4 }} /> Copy share link
                  </button>
                  {['email', 'whatsapp', 'sms'].map((ch) => (
                    <a key={ch} href={channelHref(ch, inviteEmail) || '#'} target="_blank" rel="noopener noreferrer" data-testid={`contract-share-${ch}`}
                      style={{ padding: '6px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: '3px', fontSize: '11px', fontWeight: 700, textDecoration: 'none', textTransform: 'capitalize' }}>
                      Share via {ch}
                    </a>
                  ))}
                </div>
              )}
              {(contract.invitees || []).length > 0 && (
                <ul data-testid="contract-invitees-list" style={{ listStyle: 'none', padding: 0, margin: '12px 0 0' }}>
                  {contract.invitees.map((inv, i) => (
                    <li key={i} style={{ fontSize: '12px', color: '#cbd5e1', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <RiUsersFill size={11} style={{ display: 'inline', marginRight: 6, color: '#64748b' }} />
                      <strong>{inv.email}</strong>
                      <span style={{ color: '#64748b' }}> \u00b7 {inv.role} \u00b7 via {inv.channel}</span>
                      {inv.signed_at && <span style={{ color: '#10b981', marginLeft: 6 }}>signed</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section data-testid="contract-clauses">
            <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px' }}>Clauses ({(contract.clauses || []).length})</div>
            {(contract.clauses || []).map((c) => (
              <div key={c.id} data-testid={`contract-clause-${c.id}`} style={{ padding: '12px 14px', border: `1px solid ${c.negotiable ? 'rgba(255,255,255,0.08)' : 'rgba(244, 211, 94, 0.35)'}`, borderRadius: '3px', marginBottom: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                  <strong style={{ color: '#f1f5f9', fontSize: '13px' }}>{c.title}</strong>
                  {!c.negotiable ? (
                    <span data-testid={`clause-locked-${c.id}`} style={{ fontSize: '9px', color: '#F4D35E', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      <RiLockFill size={10} style={{ display: 'inline', marginRight: 2, verticalAlign: '-1px' }} /> Locked
                    </span>
                  ) : (
                    <span style={{ fontSize: '9px', color: '#10b981', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800 }}>Negotiable</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.55, margin: '0 0 8px' }}>{c.body}</p>
                {!c.negotiable && c.non_negotiable_reason && (
                  <p style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 6px' }}>Why it\u2019s locked: {c.non_negotiable_reason}</p>
                )}
                {(c.proposals || []).map((p, idx) => (
                  <div key={idx} style={{ marginTop: '8px', padding: '8px 10px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', background: 'rgba(255,255,255,0.02)' }} data-testid={`clause-proposal-${c.id}-${idx}`}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Proposal \u00b7 {p.status}</div>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 6px' }}>{p.new_body}</p>
                    {p.note && <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 6px', fontStyle: 'italic' }}>Note: {p.note}</p>}
                    {isOwner && p.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button type="button" onClick={() => resolveProposal(c.id, idx, true)} data-testid={`proposal-accept-${c.id}-${idx}`}
                          style={{ padding: '4px 10px', background: '#10b981', color: '#0b0f1e', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Accept</button>
                        <button type="button" onClick={() => resolveProposal(c.id, idx, false)} data-testid={`proposal-reject-${c.id}-${idx}`}
                          style={{ padding: '4px 10px', background: 'transparent', color: '#f87171', border: '1px solid #f87171', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Reject</button>
                      </div>
                    )}
                  </div>
                ))}
                {c.negotiable && proposingClause !== c.id && (
                  <button type="button" onClick={() => { setProposingClause(c.id); setProposalBody(c.body); }} data-testid={`clause-propose-btn-${c.id}`}
                    style={{ marginTop: '6px', padding: '4px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <RiPenBrushFill size={11} style={{ display: 'inline', marginRight: 4 }} /> Propose an edit
                  </button>
                )}
                {proposingClause === c.id && (
                  <div style={{ marginTop: '8px' }}>
                    <textarea rows={4} value={proposalBody} onChange={(e) => setProposalBody(e.target.value)} data-testid={`clause-propose-body-${c.id}`}
                      style={{ width: '100%', padding: '8px 10px', background: 'rgba(11,15,30,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '12px', borderRadius: '3px', fontFamily: 'inherit' }} />
                    <input type="text" placeholder="Note (optional)" value={proposalNote} onChange={(e) => setProposalNote(e.target.value)} data-testid={`clause-propose-note-${c.id}`}
                      style={{ width: '100%', padding: '8px 10px', marginTop: '6px', background: 'rgba(11,15,30,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: '12px', borderRadius: '3px' }} />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <button type="button" onClick={submitProposal} disabled={busy} data-testid={`clause-propose-submit-${c.id}`}
                        style={{ padding: '5px 10px', background: 'var(--cyan)', color: '#0b0f1e', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: busy ? 'wait' : 'pointer' }}>Send proposal</button>
                      <button type="button" onClick={() => setProposingClause(null)} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </div>

        <footer style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            {contract.owner_signed_at && isOwner && 'You signed \u2713'}
            {!contract.owner_signed_at && isOwner && 'Sign when you\u2019re happy with the clauses'}
          </div>
          {contract.status !== 'signed' && contract.status !== 'cancelled' && (
            <button type="button" onClick={sign} disabled={busy} data-testid="contract-sign"
              style={{ padding: '10px 20px', background: '#10b981', color: '#0b0f1e', border: 'none', borderRadius: '3px', fontWeight: 800, fontSize: '13px', cursor: busy ? 'wait' : 'pointer', letterSpacing: '0.3px' }}>
              Sign contract
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}


// ================= App Marketplace (Phase 3) =================
// Two tabs:
//   1. "TuneMavens Apps"  -  dashboard panels native to this console (Phase 1+)
//   2. "Intermaven Network"  -  the 3 flagship native apps from the shared
//      Intermaven catalogue (NativeAppsView source-of-truth in nativeApps.js).
// Activation persists to `users.apps[]` via POST /api/users/me/apps and ticks
// off the "Activate a Dashboard App" step in the OnboardingStripe.
export function AppMarketplacePanel({ sessionUser, onUpdateUser, setActiveTab, onOpenWizard, wizardAnswers }) {
  const [activated, setActivated] = useState(sessionUser?.apps || []);
  const [busySlug, setBusySlug] = useState(null);
  const [error, setError] = useState('');
  const [activeMarketTab, setActiveMarketTab] = useState('recommended');
  const navigate = useNavigate();

  useEffect(() => {
    usersApi.listMyApps()
      .then((apps) => setActivated(Array.isArray(apps) ? apps : []))
      .catch(() => {});
  }, []);

  // Role-aware recommendations. Each slug matches the backend allow-list and
  // is paired with the dashboard tab it unlocks so we can route directly.
  const role = sessionUser?.role || 'creator';
  const catalogue = [
    { slug: 'catalog-porting', name: 'Catalog Porting', desc: 'Bring your back-catalogue in via CSV or DDEX, validate metadata, and stage releases.', icon: RiDatabase2Fill, accent: 'var(--cyan)', tab: 'catalog', roles: ['creator', 'label', 'admin'] },
    { slug: 'split-cascade', name: 'Split Cascade', desc: 'See exactly how every dollar flows through writer / producer / publisher splits.', icon: RiCoinsFill, accent: 'var(--purple)', tab: 'splits', roles: ['creator', 'label', 'admin'] },
    { slug: 'publishing-election', name: 'Publishing Election', desc: 'Lock in your publishing tier  -  standard admin or full-service co-pub.', icon: RiBookOpenFill, accent: 'var(--cyan)', tab: 'publishing-election', roles: ['creator', 'label', 'admin'] },
    { slug: 'distribution-election', name: 'Distribution Election', desc: 'Choose how your music reaches DSPs and how revenue splits.', icon: RiGlobalFill, accent: 'var(--purple)', tab: 'distribution-election', roles: ['creator', 'label', 'admin'] },
    { slug: 'djpool', name: 'DJ Pool MVP', desc: 'Distribute promo cuts to vetted DJs, gate by region, track plays.', icon: RiRadioFill, accent: '#10b981', tab: 'djpool', roles: ['creator', 'dj', 'admin'] },
    { slug: 'sync-marketplace', name: 'Sync Marketplace', desc: 'Pitch and license tracks for film, TV, ads, and game placements.', icon: RiGlobalFill, accent: 'var(--cyan)', tab: 'sync', roles: ['creator', 'label', 'studio', 'supervisor', 'admin'] },
    { slug: 'escrow-contracts', name: 'Escrow Contracts', desc: 'Hold funds in escrow until contractual milestones clear.', icon: RiShieldFill, accent: 'var(--purple)', tab: 'escrow', roles: ['creator', 'studio', 'supervisor', 'admin'] },
    { slug: 'tunemavens-library', name: 'My Library', desc: 'Personal media library  -  playlists, downloads, and offline cache.', icon: RiMusicFill, accent: 'var(--cyan)', tab: 'library', roles: ['creator', 'consumer', 'dj', 'admin'] },
    { slug: 'tunemavens-tips', name: 'Tips & Purchases', desc: 'See incoming tips and your TuneMavens app purchases.', icon: RiCoinsFill, accent: '#10b981', tab: 'tips', roles: ['creator', 'consumer', 'dj', 'admin'] },
    { slug: 'tunepay-inventory', name: 'POS Inventory', desc: 'Mobile point-of-sale inventory for merch & physical media.', icon: RiDatabase2Fill, accent: '#10b981', tab: 'pos-inventory', roles: ['creator', 'label', 'admin'] },
    { slug: 'tunepay-settlement', name: 'POS Settlement', desc: 'Reconcile tunepay settlement runs against your ledger.', icon: RiCoinsFill, accent: '#10b981', tab: 'pos-settlement', roles: ['creator', 'label', 'admin'] },
    { slug: 'tunepay-devices', name: 'POS Devices', desc: 'Pair and manage tunepay hardware tied to your account.', icon: RiSmartphoneFill, accent: '#10b981', tab: 'pos-devices', roles: ['label', 'admin'] },
  ];

  const visible = catalogue.filter((a) => a.roles.includes(role));
  const recommendedSlugs = role === 'label'
    ? ['catalog-porting', 'distribution-election', 'tunepay-inventory']
    : role === 'dj'
      ? ['djpool', 'tunemavens-library']
      : role === 'studio' || role === 'supervisor'
        ? ['sync-marketplace', 'escrow-contracts']
        : role === 'consumer'
          ? ['tunemavens-library', 'tunemavens-tips']
          : ['publishing-election', 'distribution-election', 'split-cascade'];

  const recommended = visible.filter((a) => recommendedSlugs.includes(a.slug));
  const other = visible.filter((a) => !recommendedSlugs.includes(a.slug));

  const activate = async (slug) => {
    setError('');
    setBusySlug(slug);
    try {
      const apps = await usersApi.activateApp(slug);
      setActivated(apps);
      if (onUpdateUser && sessionUser) {
        onUpdateUser({ ...sessionUser, apps });
      }
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not activate app');
    } finally {
      setBusySlug(null);
    }
  };

  const deactivate = async (slug) => {
    setError('');
    setBusySlug(slug);
    try {
      const apps = await usersApi.deactivateApp(slug);
      setActivated(apps);
      if (onUpdateUser && sessionUser) {
        onUpdateUser({ ...sessionUser, apps });
      }
    } catch (e) {
      setError(e.data?.detail || e.message || 'Could not deactivate app');
    } finally {
      setBusySlug(null);
    }
  };

  const renderCard = (a) => {
    const isActive = activated.includes(a.slug);
    const isBusy = busySlug === a.slug;
    const Icon = a.icon;
    return (
      <div
        key={a.slug}
        className="app-marketplace-card"
        data-testid={`app-marketplace-card-${a.slug}`}
        style={{
          padding: '18px',
          background: 'rgba(255,255,255,0.02)',
          border: isActive ? `1px solid ${a.accent}` : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '3px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${a.accent}1f`, color: a.accent, flexShrink: 0 }}>
            <Icon size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f1f5f9' }}>{a.name}</div>
            {isActive && (
              <div style={{ fontSize: '9px', color: '#10b981', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginTop: '2px' }} data-testid={`app-marketplace-status-${a.slug}`}>
                <RiCheckboxCircleFill size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} /> Activated
              </div>
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.55', margin: 0, flex: 1 }}>{a.desc}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isActive ? (
            <>
              <button
                type="button"
                onClick={() => {
                  if (a.launchUrl) {
                    window.open(a.launchUrl, '_blank', 'noopener,noreferrer');
                  } else if (a.landingPath) {
                    navigate(a.landingPath);
                  } else if (setActiveTab) {
                    setActiveTab(a.tab);
                  }
                }}
                data-testid={`app-marketplace-open-${a.slug}`}
                style={{ flex: 1, padding: '8px 12px', background: a.accent, color: '#0b0f1e', fontWeight: 800, fontSize: '12px', border: 'none', borderRadius: '3px', cursor: 'pointer', letterSpacing: '0.3px' }}
              >
                {a.launchUrl ? 'Launch \u2197' : a.landingPath ? 'View App' : 'Open'}
              </button>
              <button
                type="button"
                onClick={() => deactivate(a.slug)}
                disabled={isBusy}
                data-testid={`app-marketplace-deactivate-${a.slug}`}
                style={{ padding: '8px 12px', background: 'transparent', color: '#94a3b8', fontWeight: 700, fontSize: '12px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', cursor: 'pointer' }}
              >
                {isBusy ? '…' : 'Remove'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => activate(a.slug)}
              disabled={isBusy}
              data-testid={`app-marketplace-activate-${a.slug}`}
              style={{ flex: 1, padding: '8px 12px', background: a.accent, color: '#0b0f1e', fontWeight: 800, fontSize: '12px', border: 'none', borderRadius: '3px', cursor: isBusy ? 'wait' : 'pointer', opacity: isBusy ? 0.6 : 1, letterSpacing: '0.3px' }}
            >
              {isBusy ? 'Activating…' : 'Activate'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // The Intermaven Network apps share the exact same shape as the dashboard
  // catalogue (slug + name + icon + desc + accent) plus a `landingPath` that
  // routes to the matching native-app marketing page.
  const intermavenCards = INTERMAVEN_NATIVE_APPS.map((a) => ({
    slug: a.slug,
    name: a.name,
    desc: a.desc,
    icon: a.icon,
    accent: a.accent,
    landingPath: a.landingPath,
  }));

  return (
    <div className="dashboard-card" data-testid="app-marketplace-panel">
      <PanelHeader
        title="App Marketplace"
        desc={"Start with 'Your Path'  -  the AI Recommendation Agent picks the best combination of apps for your goals. Or browse the full catalogue in the other tabs."}
      />

      {/* Top-level tab switcher */}
      <div
        role="tablist"
        data-testid="app-marketplace-tabs"
        style={{
          display: 'flex',
          gap: '0',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {[
          { key: 'recommended', label: 'Your Path', testid: 'app-marketplace-tab-recommended' },
          { key: 'tunemavens', label: 'TuneMavens Apps', testid: 'app-marketplace-tab-tunemavens' },
          { key: 'native', label: 'Native Apps', testid: 'app-marketplace-tab-native' },
          { key: 'intermaven', label: 'Intermaven Platform', testid: 'app-marketplace-tab-intermaven' },
        ].map((t) => {
          const isActive = activeMarketTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveMarketTab(t.key)}
              data-testid={t.testid}
              style={{
                padding: '12px 18px',
                background: 'transparent',
                color: isActive ? '#f1f5f9' : '#94a3b8',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
                fontWeight: 800,
                fontSize: '13px',
                letterSpacing: '0.3px',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '10px' }} data-testid="app-marketplace-error">{error}</p>}

      {activeMarketTab === 'recommended' && (
        <div data-testid="app-marketplace-your-path">
          <RecommendationHero
            activatedSlugs={activated}
            hasAnswers={!!(
              wizardAnswers && (
                (Array.isArray(wizardAnswers.primary_goal) && wizardAnswers.primary_goal.length > 0) ||
                (typeof wizardAnswers.primary_goal === 'string' && wizardAnswers.primary_goal) ||
                (wizardAnswers.primary_goal_other && wizardAnswers.primary_goal_other.trim())
              )
            )}
            onOpenWizard={() => onOpenWizard && onOpenWizard()}
            onActivate={activate}
            onOpen={(app) => {
              if (app.launchUrl) {
                window.open(app.launchUrl, '_blank', 'noopener,noreferrer');
              } else if (app.landingPath) {
                navigate(app.landingPath);
              } else if (setActiveTab && app.tab) {
                setActiveTab(app.tab);
              }
            }}
            refreshKey={activated.length}
          />
          {!(wizardAnswers && (
            (Array.isArray(wizardAnswers.primary_goal) && wizardAnswers.primary_goal.length > 0) ||
            (typeof wizardAnswers.primary_goal === 'string' && wizardAnswers.primary_goal) ||
            (wizardAnswers.primary_goal_other && wizardAnswers.primary_goal_other.trim())
          )) && (
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: 0, marginBottom: 0, lineHeight: '1.55' }}>
              You can still browse the full catalogue from the other tabs, but the wizard makes the recommendations far more accurate. It takes about 30 seconds.
            </p>
          )}
        </div>
      )}

      {activeMarketTab === 'tunemavens' && (
        <>
          {recommended.length > 0 && (
            <div style={{ marginBottom: '24px' }} data-testid="app-marketplace-recommended">
              <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px' }}>
                Popular for {role}s
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {recommended.map(renderCard)}
              </div>
            </div>
          )}

          {other.length > 0 && (
            <div data-testid="app-marketplace-all">
              <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '10px' }}>
                All available apps
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {other.map(renderCard)}
              </div>
            </div>
          )}
        </>
      )}

      {activeMarketTab === 'native' && (
        <div data-testid="app-marketplace-native">
          <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>
            Native Apps
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: 0, marginBottom: '16px', lineHeight: '1.55' }}>
            The 3 flagship mobile experiences shipped through the Intermaven Network. Activate to add a quick-launch entry to your dashboard, then tap <em>View App</em> to open the full app surface.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {intermavenCards.map(renderCard)}
          </div>
        </div>
      )}

      {activeMarketTab === 'intermaven' && (
        <div data-testid="app-marketplace-intermaven">
          <div style={{ fontSize: '10px', color: 'var(--cyan)', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '6px' }}>
            Intermaven Platform
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: 0, marginBottom: '16px', lineHeight: '1.55' }}>
            Operational and AI tools hosted on intermaven.io. Activation pins each tool to your dashboard, and <em>Launch &#8599;</em> opens it on the Intermaven platform with your shared session.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {INTERMAVEN_PLATFORM_APPS.map(renderCard)}
          </div>
        </div>
      )}
    </div>
  );
}
