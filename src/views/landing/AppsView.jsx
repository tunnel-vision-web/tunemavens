import React, { useState } from 'react'
import { Activity, Globe, Layers, Zap } from 'lucide-react'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import MpesaPosTerminal from '../../components/demos/MpesaPosTerminal.jsx'
import SplitCascadeLedgerApp from '../../components/demos/SplitCascadeLedgerApp.jsx'
import ComingSoonApp from '../../components/demos/ComingSoonApp.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'

export default function AppsView({ sessionUser }) {
  const [activeApp, setActiveApp] = useState(null); // null, 'tracker', 'hosting', 'ledger', 'pos'
  const { country } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const posName = country === 'KE' ? 'M-Pesa POS Terminal' 
                 : (country === 'NG' ? 'Flutterwave POS Terminal' 
                 : (isEastAfrica ? 'Mobile Money POS Terminal' : 'Stripe POS Terminal'));
                 
  const posDesc = isEastAfrica 
    ? 'Collect on-site merchant card, cardless, and mobile money payments during venues and tours.'
    : 'Collect on-site merchant card, contactless, and digital wallet payments during venues and tours.';

  const apps = [
    { id: 'tracker', name: 'Distribution Tracker', icon: Activity, desc: 'Monitor ingest status and scheduled releases across Spotify, Apple, and Amazon Music.', live: true },
    { id: 'hosting', name: 'Hosting Manager', icon: Globe, desc: 'Register custom domain names, configure DNS zone settings, and deploy modular web containers.', live: true },
    { id: 'ledger', name: 'Split Cascade Ledger', icon: Layers, desc: 'Configure collaborators splits, load bulk statement spreadsheets, and automate payout accounting.', live: true },
    { id: 'pos', name: posName, icon: Zap, desc: posDesc, live: true },
  ];

  if (activeApp === 'pos') {
    return (
      <>
        <PageHeader title={posName} bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="POS Terminal" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <MpesaPosTerminal goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  if (activeApp === 'ledger') {
    return (
      <>
        <PageHeader title="Split Cascade Ledger" bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="Ledger App" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <SplitCascadeLedgerApp goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  if (activeApp === 'tracker' || activeApp === 'hosting') {
    const appName = apps.find(a => a.id === activeApp)?.name || 'Application';
    return (
      <>
        <PageHeader title={appName} bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb={appName} />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <ComingSoonApp name={appName} goBack={() => setActiveApp(null)} sessionUser={sessionUser} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Standalone Apps Pool" bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="Dashboard Apps" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Integrated dashboard managers that communicate directly with your unified Intermaven profile and credits vault.
        </p>
        <div className="apps-grid">
          {apps.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div 
                key={idx} 
                className="app-card glass-panel glass-panel-hover"
                onClick={() => setActiveApp(a.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="app-icon-box" style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--purple)' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{a.name}</h3>
                <p className="app-desc">{a.desc}</p>
                <span className="app-tag" style={{ color: 'var(--gr)' }}>● Live App</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
