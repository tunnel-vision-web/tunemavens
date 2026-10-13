import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiBarChartFill, 
  RiGlobalFill, 
  RiStackFill, 
  RiBankCardFill, 
  RiLayoutMasonryFill, 
  RiGroupFill, 
  RiDatabase2Fill,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiExternalLinkLine,
  RiCheckLine,
  RiPlayFill,
  RiUploadCloud2Line,
  RiMailSendFill,
  RiMusic2Fill,
  RiShieldCheckFill
} from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import MpesaPosTerminal from '../../components/demos/MpesaPosTerminal.jsx'
import SplitCascadeLedgerApp from '../../components/demos/SplitCascadeLedgerApp.jsx'
import DistributionTrackerApp from '../../components/demos/DistributionTrackerApp.jsx'
import HostingManagerApp from '../../components/demos/HostingManagerApp.jsx'
import ComingSoonApp from '../../components/demos/ComingSoonApp.jsx'
import { getIntermavenUrl } from '../../components/PerfectForSidebar.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'
import userManagerImg from '../../assets/images/user_manager.png'
import publishingMockupImg from '../../assets/images/publishing_dashboard_mockup.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'
import headerPricingImg from '../../assets/images/header_pricing.png'
import headerPricingWesternImg from '../../assets/images/header_pricing_western.png'
import heroMusic4Img from '../../assets/images/hero_music_4.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'

export default function AppsView({ sessionUser }) {
  const [activeApp, setActiveApp] = useState(null); // null, 'epk-builder', 'crm', 'catalogue-machine', 'tracker', 'hosting', 'ledger', 'pos'
  const { country } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const posName = country === 'KE' ? 'M-Pesa POS Terminal' 
                 : (country === 'NG' ? 'Flutterwave POS Terminal' 
                 : (isEastAfrica ? 'Mobile Money POS Terminal' : 'Stripe POS Terminal'));
                 
  const posDesc = isEastAfrica 
    ? 'Collect on-site merchant card, cardless, and mobile money payments during venues and tours.'
    : 'Collect on-site merchant card, contactless, and digital wallet payments during venues and tours.';

  const apps = [
    { 
      id: 'epk-builder', 
      name: 'EPK Builder', 
      icon: RiLayoutMasonryFill, 
      accent: 'var(--cyan)',
      desc: 'Interactive Electronic Press Kit studio, theme visualizer, bio editor, and standalone web world publisher.', 
      live: true 
    },
    { 
      id: 'crm', 
      name: 'Smart CRM', 
      icon: RiGroupFill, 
      accent: '#10b981',
      desc: 'Fan relationship management, VIP subscriber lists, direct email messaging, and booking inquiries.', 
      live: true 
    },
    { 
      id: 'catalogue-machine', 
      name: 'Catalogue Machine', 
      icon: RiDatabase2Fill, 
      accent: '#a855f7',
      desc: 'Central discography & release management, stem archives, bulk CSV roster ingestion, and metadata synchronization.', 
      live: true 
    },
    { 
      id: 'ledger', 
      name: 'Split Cascade Ledger', 
      icon: RiStackFill, 
      accent: 'var(--cyan)',
      desc: 'Configure collaborators splits, load bulk statement spreadsheets, and automate payout accounting.', 
      live: true 
    },
    { 
      id: 'pos', 
      name: posName, 
      icon: RiBankCardFill, 
      accent: '#10b981',
      desc: posDesc, 
      live: true 
    },
    { 
      id: 'tracker', 
      name: 'Distribution Tracker', 
      icon: RiBarChartFill, 
      accent: '#f59e0b',
      desc: 'Monitor ingest status and scheduled releases across Spotify, Apple, and Amazon Music.', 
      live: true 
    },
    { 
      id: 'hosting', 
      name: 'Hosting Manager', 
      icon: RiGlobalFill, 
      accent: '#3b82f6',
      desc: 'Register custom domain names, configure DNS zone settings, and deploy modular web containers.', 
      live: true 
    },
  ];

  // 1. Interactive EPK Builder Studio Sub-View
  if (activeApp === 'epk-builder') {
    return (
      <>
        <PageHeader title="EPK Builder Studio" bgImage={perfectForHeaderImg} breadcrumb="EPK Builder" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '36px 32px', borderRadius: '12px', border: '1px solid rgba(34,211,238,0.2)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
              <div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--cyan)', display: 'block', marginBottom: '8px' }}>
                  Standalone Creator App
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
                  Interactive Electronic Press Kit Studio
                </h2>
                <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
                  Design and deploy your artist press kit with responsive media blocks, live audio scrubbers, tour schedules, and booking forms.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/epk" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>
                  Launch EPK Studio <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Creator Hub
                </Link>
              </div>
            </div>

            {/* Feature Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: 'var(--cyan)', marginBottom: '10px' }}><RiLayoutMasonryFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Visual Theme Studio</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Customize typography, color palettes, dark-mode themes, and custom banner layouts with real-time preview.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}><RiMusic2Fill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lossless Player Embed</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Embed 60fps audio waveform scrubbers with stem auditioning, unreleased single pre-saves, and liner notes.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#f59e0b', marginBottom: '10px' }}><RiGlobalFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Custom Domain Routing</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Deploy to your own custom domain or tunemavens.com subdomains with SSL, DNS sync, and 0% data loss across reloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 2. Interactive Smart CRM Sub-View
  if (activeApp === 'crm') {
    return (
      <>
        <PageHeader title="Smart CRM" bgImage={userManagerImg} breadcrumb="Smart CRM" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '36px 32px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
              <div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#10b981', display: 'block', marginBottom: '8px' }}>
                  Audience Intelligence
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
                  Smart CRM &amp; Fan Relationship Engine
                </h2>
                <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
                  Direct-to-fan subscriber databases, tour ticket pre-sale alerts, VIP tier segmentation, and unified contact synchronization across Intermaven.io.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a 
                  href={getIntermavenUrl('intermaven-smart-crm')} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ padding: '10px 22px', fontSize: '13px', background: '#10b981' }}
                >
                  Open Smart CRM <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
                <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Label Audiences
                </Link>
              </div>
            </div>

            {/* KPI Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Total Fan Contacts</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>2,840</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>VIP Tippers &amp; Buyers</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>418</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Email Open Rate</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan)' }}>74.2%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Direct Revenue Flow</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7' }}>100% Direct</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 3. Interactive Catalogue Machine Sub-View
  if (activeApp === 'catalogue-machine') {
    return (
      <>
        <PageHeader title="Catalogue Machine" bgImage={publishingMockupImg} breadcrumb="Catalogue Machine" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={() => setActiveApp(null)} 
              className="btn-secondary" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
            >
              <RiArrowLeftLine size={16} /> Back to Dashboard Apps
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '36px 32px', borderRadius: '12px', border: '1px solid rgba(168,85,247,0.2)', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
              <div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#a855f7', display: 'block', marginBottom: '8px' }}>
                  Catalog Operations &amp; Ingestion
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
                  EPK Catalogue Machine &amp; Release Engine
                </h2>
                <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
                  Ingest multi-artist discographies, validate ISRC codes, package lossless stem archives, and synchronize metadata across TuneMavens, TuneStream, and SyncMavens.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to={sessionUser ? "/dashboard" : "/register?role=label"} className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', background: '#a855f7' }}>
                  Open Ingestion Console <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </Link>
                <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Label Ingest Specs
                </Link>
              </div>
            </div>

            {/* Ingestion Highlights */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#a855f7', marginBottom: '10px' }}><RiUploadCloud2Line size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Bulk CSV Roster Ingest</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Parse master distributor statement spreadsheets and catalog CSV files in seconds with zero loss of track credits.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: 'var(--cyan)', marginBottom: '10px' }}><RiDatabase2Fill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>ISRC &amp; Metadata Registry</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Automated generation and verification of unique ISRC codes, PRO registrations, and acoustic genre tags.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#10b981', marginBottom: '10px' }}><RiShieldCheckFill size={24} /></div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lossless Master &amp; Stem Vault</h4>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.5 }}>
                  Secure, encrypted storage for uncompressed 24-bit studio masters, separated stem packs, and high-res cover art.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 4. POS Terminal Sub-View
  if (activeApp === 'pos') {
    return (
      <>
        <PageHeader title={posName} bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="POS Terminal" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <MpesaPosTerminal goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  // 5. Split Cascade Ledger Sub-View
  if (activeApp === 'ledger') {
    return (
      <>
        <PageHeader title="Split Cascade Ledger" bgImage={appsLedgerImg} breadcrumb="Ledger App" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <SplitCascadeLedgerApp goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  // 6. Distribution Tracker Sub-View
  if (activeApp === 'tracker') {
    return (
      <>
        <PageHeader title="Distribution Tracker" bgImage={heroMusic4Img} breadcrumb="Distribution Tracker" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <DistributionTrackerApp goBack={() => setActiveApp(null)} sessionUser={sessionUser} />
        </div>
      </>
    );
  }

  // 7. Hosting Manager Sub-View
  if (activeApp === 'hosting') {
    return (
      <>
        <PageHeader title="Hosting Manager" bgImage={distributeHeroImg} breadcrumb="Hosting Manager" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <HostingManagerApp goBack={() => setActiveApp(null)} sessionUser={sessionUser} />
        </div>
      </>
    );
  }

  // 8. Generic Coming Soon Sub-View Fallback
  if (activeApp) {
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
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '720px', margin: '0 auto 40px', fontSize: '15px', color: 'var(--mu)', lineHeight: 1.6 }}>
          Integrated dashboard managers that communicate directly with your unified Intermaven profile, catalog database, and credits vault.
        </p>
        <div className="apps-grid">
          {apps.map((a, idx) => {
            const Icon = a.icon;
            const accent = a.accent || 'var(--purple)';
            return (
              <div 
                key={idx} 
                className="app-card glass-panel glass-panel-hover"
                onClick={() => setActiveApp(a.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="app-icon-box" style={{ background: `rgba(255,255,255,0.06)`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{a.name}</h3>
                <p className="app-desc">{a.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', width: '100%' }}>
                  <span className="app-tag" style={{ color: 'var(--gr)' }}>● Live App</span>
                  <span style={{ fontSize: '12px', color: accent, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Open App <RiArrowRightLine size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
