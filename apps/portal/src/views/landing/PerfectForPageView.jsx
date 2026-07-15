import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROLE_LOGOS, getServiceUrl } from '../../components/PerfectForSidebar.jsx'
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
      sub: 'Artists & Producers',
      href: '/for/creator',
      logo: ROLE_LOGOS['creator'],
      accent: 'var(--cyan)',
      desc: 'Designed for artists and producers. Calculate split sheets, manage your music library, and pitch your tracks under a single console.',
      preview: creatorDashboardImg
    },
    {
      key: 'label',
      label: 'Record Labels',
      sub: 'Catalog Management',
      href: '/for/label',
      logo: ROLE_LOGOS['label'],
      accent: 'var(--purple)',
      desc: 'For record labels, A&R managers, and industry leaders. Manage your entire artist catalog, track splits, and coordinate roster-wide releases.',
      preview: distributeHeroImg
    },
    {
      key: 'dj',
      label: 'DJs',
      sub: 'DJ Pool Engine',
      href: '/for/dj',
      logo: ROLE_LOGOS['dj'],
      accent: 'var(--cyan)',
      desc: 'The next-generation pool engine. Access lossless audio files, queue pools, and secure stem clearances for live sets.',
      preview: appsLedgerImg
    },
    {
      key: 'media_house',
      label: 'Media Houses',
      sub: 'Broadcast & Playlisting',
      href: '/for/media-house',
      logo: ROLE_LOGOS['media_house'],
      accent: 'var(--blue)',
      desc: 'Broadcasting and queue routing tools. Access authorized compliance directories and manage music scheduling for broadcast channels.',
      preview: appsLedgerImg
    },
    {
      key: 'supervisor',
      label: 'Music Supervisors',
      sub: 'SyncMavens Licensing',
      href: getServiceUrl('syncmavens'),
      isExternal: true,
      logo: ROLE_LOGOS['supervisor'],
      accent: 'var(--am)',
      desc: 'Sync licensing and AI scene-tagging made simple. Search our curated catalog of watermarked tracks and find the perfect vibe for your film or TV project.',
      preview: appsSyncImg
    },
    {
      key: 'consumer',
      label: 'tunestream',
      sub: 'Everyday Listeners',
      href: '/native-apps/tunestream',
      logo: ROLE_LOGOS['consumer'],
      accent: '#10b981',
      desc: 'Our consumer streaming app. Listen to your favorite tracks, support creators directly with direct-tipping, and sync your music offline.',
      preview: consumerAppImg
    },
    {
      key: 'corporate',
      label: 'Corporate',
      sub: 'Sponsorships & Ads',
      href: '/for/corporate',
      logo: ROLE_LOGOS['corporate'],
      accent: '#ef4444',
      desc: 'Connect brands with target audiences. Run campaigns, sponsor curators, and manage native audio ad placements.',
      preview: userManagerImg
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
                {role.isExternal ? (
                  <a href={role.href} className="btn pf-card-cta" style={{ '--pf-accent': role.accent }}>
                    Explore Seat
                  </a>
                ) : (
                  <Link to={role.href} className="btn pf-card-cta" style={{ '--pf-accent': role.accent }}>
                    Explore Seat
                  </Link>
                )}
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
