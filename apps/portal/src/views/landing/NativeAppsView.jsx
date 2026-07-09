import React from 'react'
import { Link } from 'react-router-dom'
import { RiAppleFill, RiDownloadFill, RiCheckboxCircleFill, RiArrowRightFill, RiSmartphoneFill } from 'react-icons/ri'
import { INTERMAVEN_NATIVE_APPS } from '../../lib/nativeApps.js'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'

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
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '12px', maxWidth: '720px', margin: '0 auto 8px' }}>
          Three flagship native experiences. One shared TuneMavens / Intermaven account.
        </p>
        <p style={{ textAlign: 'center', color: 'var(--mu)', fontSize: '12px', marginBottom: '56px', maxWidth: '640px', margin: '0 auto 56px' }}>
          Sign in once on the web and every native app picks up your same session, credits, and split ledger  -  no separate accounts to juggle.
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
                <p className="native-app-desc">{a.desc}</p>

                <ul className="native-app-features">
                  {a.features.map((f, k) => (
                    <li key={k}><RiCheckboxCircleFill size={13} /> {f}</li>
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
                  More info <RiArrowRightFill size={14} />
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

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', marginTop: '56px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Phase 5+ rollout · See <Link to="/help" style={{ color: 'var(--cyan)' }}>release roadmap</Link>
        </p>
      </div>
    </>
  );
}
