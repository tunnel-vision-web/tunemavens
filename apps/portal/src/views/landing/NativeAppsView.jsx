import React from 'react'
import { Link } from 'react-router-dom'
import { 
  RiAppleFill, 
  RiDownloadFill, 
  RiCheckboxCircleFill, 
  RiArrowRightFill, 
  RiSmartphoneFill,
  RiArrowRightLine,
  RiCheckDoubleFill
} from 'react-icons/ri'
import { INTERMAVEN_NATIVE_APPS } from '../../lib/nativeApps.js'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import './AppsView.css'

export default function NativeAppsView() {
  const apps = INTERMAVEN_NATIVE_APPS;

  const StoreButton = ({ kind, label, sublabel }) => (
    <button
      type="button"
      className="store-cta"
      onClick={() => alert(`${label} listing for the ${kind} build coming soon.`)}
      data-testid={`store-cta-${kind}`}
    >
      <div className="store-cta-icon">
        {kind === 'ios' ? <RiAppleFill size={22} /> : <RiDownloadFill size={22} />}
      </div>
      <div className="store-cta-text">
        <span className="store-cta-sub">{sublabel}</span>
        <span className="store-cta-label">{label}</span>
      </div>
    </button>
  );

  return (
    <>
      <PageHeader
        title="Native Apps"
        bgImage={headerAppsImg}
        bgImageWestern={headerAppsWesternImg}
        breadcrumb="Native Apps"
      />
      <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '12px', maxWidth: '780px', margin: '0 auto 8px', fontSize: '16px', color: '#fff', fontWeight: 600 }}>
          Three flagship native mobile applications. One unified TuneMavens &amp; Intermaven ecosystem.
        </p>
        <p style={{ textAlign: 'center', color: 'var(--mu)', fontSize: '13.5px', marginBottom: '48px', maxWidth: '680px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          Sign in once on the web and every native app automatically synchronizes your session, user credits, royalties, and split ledger. No duplicate accounts, no fragmented data.
        </p>

        <div className="native-apps-grid" data-testid="native-apps-grid">
          {apps.map((a) => {
            const Icon = a.icon;
            return (
              <article
                key={a.id}
                className="native-app-card glass-panel"
                style={{ '--app-accent': a.accent, '--app-accent-glow': a.accentGlow }}
                data-testid={`native-app-card-${a.id}`}
              >
                <div className="native-app-card-header">
                  <div className="native-app-icon" aria-hidden="true">
                    <Icon size={26} />
                  </div>
                  <div>
                    <span className="native-app-target">{a.target}</span>
                    <h3 className="native-app-name">{a.name}</h3>
                  </div>
                </div>

                <p className="native-app-tagline">{a.tagline}</p>
                <p className="native-app-desc" style={{ marginBottom: '16px', lineHeight: 1.65 }}>
                  {a.desc}
                </p>

                <ul className="native-app-features" style={{ marginBottom: '24px' }}>
                  {a.features.map((f, k) => (
                    <li key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.5, marginBottom: '8px' }}>
                      <RiCheckDoubleFill size={15} style={{ color: a.accent, flexShrink: 0, marginTop: '2px' }} /> 
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="native-app-store-row">
                  <StoreButton kind="ios" label="App Store" sublabel="Download on the" />
                  <StoreButton kind="android" label="Google Play" sublabel="Get it on" />
                </div>

                <Link
                  to={a.landingPath}
                  className="native-app-more-info"
                  data-testid={`native-app-more-info-${a.id}`}
                >
                  Explore Features &amp; Tour <RiArrowRightFill size={14} />
                </Link>

                <div className="native-app-meta">
                  <span className="native-app-meta-pill">
                    <RiSmartphoneFill size={11} /> Capacitor-wrapped · iOS &amp; Android
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Sticky CTA Bar for Native Apps */}
        <div className="sticky-app-cta-bar" style={{ marginTop: '56px' }}>
          <div className="cta-meta">
            <div className="cta-pulse-dot" style={{ background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <div>
              <h4 className="cta-title">Stream, monitor splits, and accept payments on iOS &amp; Android</h4>
              <p className="cta-sub">Join early mobile testing cohorts and receive priority release updates.</p>
            </div>
          </div>
          <div className="cta-actions">
            <Link to="/register?role=creator" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>
              Join Mobile Beta <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <Link to="/apps" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
              View Web Apps Pool
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', marginTop: '40px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Phase 5+ rollout · See <Link to="/help" style={{ color: 'var(--cyan)' }}>release roadmap</Link>
        </p>
      </div>
    </>
  );
}
