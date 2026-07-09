import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROLE_LOGOS } from '../../components/PerfectForSidebar.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import creatorDashboardImg from '../../assets/images/creator_dashboard.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'
import userSupervisorImg from '../../assets/images/user_supervisor.png'
import consumerAppImg from '../../assets/images/consumer_app.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'
import userManagerImg from '../../assets/images/user_manager.png'
import appsSyncImg from '../../assets/images/apps_sync.png'
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'

export default function PerfectForPageView() {
  const [previewImage, setPreviewImage] = useState(null);

  const metaRoles = [
    {
      key: 'creator',
      label: 'Creators',
      sub: 'Artists · Podcasters · DJs',
      href: '/for/creator',
      logo: ROLE_LOGOS['creator'],
      accent: 'var(--cyan)',
      desc: 'Designed for artists, DJs, and podcasters. Effortlessly calculate split sheets, manage your music library, and pitch your tracks to filmmakers and sync agents - all from one single console.',
      preview: creatorDashboardImg
    },
    {
      key: 'exec',
      label: 'Execs',
      sub: 'Label · A&R · Industry',
      href: '/for/exec',
      logo: ROLE_LOGOS['exec'],
      accent: 'var(--purple)',
      desc: 'For record labels, A&R managers, and industry leaders. Manage your entire artist catalog, track royalty splits, ingest statement CSV files, and automate payouts to artists and managers.',
      preview: distributeHeroImg
    },
    {
      key: 'supervisor',
      label: 'Music Supervisors',
      sub: 'Sync licensing for film & TV',
      href: '/for/supervisor',
      logo: ROLE_LOGOS['supervisor'],
      accent: 'var(--am)',
      desc: 'Sync licensing and AI scene-tagging made simple. Search our curated catalog of watermarked tracks, find the perfect vibe for your film or TV project, and secure sync rights instantly.',
      preview: appsSyncImg
    },
    {
      key: 'consumer',
      label: 'tunestream',
      sub: 'Everyday listeners',
      href: '/native-apps/tunestream',
      logo: ROLE_LOGOS['consumer'],
      accent: '#10b981',
      desc: 'Our consumer streaming app. Listen to your favorite tracks, support creators directly with direct-tipping, and sync your music collection offline across all your mobile devices.',
      preview: consumerAppImg
    },
    {
      key: 'booking-agent',
      label: 'Booking Agents',
      sub: 'Book & represent live acts',
      href: '/for/booking-agent',
      logo: ROLE_LOGOS['booking-agent'],
      accent: 'var(--blue)',
      desc: 'Represent and book your live acts. Route gig contracts, coordinate agent commission payouts, and view tour routing maps all integrated with local payment rails.',
      preview: appsLedgerImg
    },
    {
      key: 'manager',
      label: 'Managers',
      sub: 'Day-to-day artist teams',
      href: '/for/manager',
      logo: ROLE_LOGOS['manager'],
      accent: '#ef4444',
      desc: 'Manage the day-to-day operations of your artist roster. Real-time split visibility, contract drafting tools, and automated payouts to keep your management business running smoothly.',
      preview: userManagerImg
    },
    {
      key: 'companion',
      label: 'tunecompanion',
      sub: 'Artists & Managers',
      href: '/native-apps/creator-companion',
      logo: ROLE_LOGOS['companion'],
      accent: 'var(--purple)',
      desc: 'The essential mobile companion app for artists and managers. Monitor splits on the fly, track live earnings, and receive real-time sync brief alerts right on your phone.',
      preview: appsSyncImg
    }
  ];

  return (
    <>
      <PageHeader 
        title="Perfect For Every Seat in the Industry" 
        bgImage={perfectForHeaderImg} 
        bgImageWestern={perfectForHeaderImg} 
        breadcrumb="Perfect For" 
      />
      <div className="container" style={{ padding: '60px 20px 80px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px', fontSize: '16px', color: 'var(--mu)', lineHeight: 1.6 }}>
          TuneMavens coordinates the entire music ecosystem. Choose your role below to explore the custom dashboard and tools we build for your seat.
        </p>

        <div className="pf-grid-page">
          {metaRoles.map((role) => (
            <div key={role.key} className="pf-card-page glass-panel" style={{ '--pf-accent': role.accent }}>
              <div className="pf-card-logo-container">
                <img src={role.logo} alt={role.label} className="pf-card-logo-img" />
              </div>
              <h3 className="pf-card-title">{role.label}</h3>
              <span className="pf-card-eyebrow" style={{ color: role.accent }}>{role.sub}</span>
              <p className="pf-card-desc">{role.desc}</p>
              
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={role.href} className="btn pf-card-cta" style={{ '--pf-accent': role.accent }}>
                  Explore Seat
                </Link>
                <button 
                  onClick={() => setPreviewImage(role.preview)} 
                  className="btn pf-card-cta outline"
                  style={{ '--pf-accent': role.accent, cursor: 'pointer', background: 'transparent' }}
                >
                  Dash Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewImage && (
        <div className="pf-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="pf-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="pf-modal-close" onClick={() => setPreviewImage(null)}>×</button>
            <img src={previewImage} alt="Dashboard Preview" className="pf-modal-img" />
          </div>
        </div>
      )}
    </>
  );
}
