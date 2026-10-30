import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROLE_LOGOS, getServiceUrl } from '../../components/PerfectForSidebar.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import creatorDashActualImg from '../../assets/images/creator_dashboard_actual.png'
import labelDashActualImg from '../../assets/images/label_dashboard_actual.png'
import djDashActualImg from '../../assets/images/dj_dashboard_actual.png'
import mediahouseDashActualImg from '../../assets/images/mediahouse_dashboard_actual.png'
import supervisorDashActualImg from '../../assets/images/supervisor_dashboard_actual.png'
import consumerDashActualImg from '../../assets/images/consumer_dashboard_actual.png'
import corporateDashActualImg from '../../assets/images/corporate_dashboard_actual.png'
import perfectForHeaderImg from '../../assets/images/perfect_for_header.png'

export default function PerfectForPageView() {
  const [previewModal, setPreviewModal] = useState(null);

  const metaRoles = [
    {
      key: 'creator',
      label: 'Creators',
      sub: 'Artists & Producers',
      href: '/for/creator',
      logo: ROLE_LOGOS['creator'],
      accent: 'var(--cyan)',
      desc: 'Designed for artists and producers. Calculate split sheets, manage your music library, and pitch your tracks under a single console.',
      preview: creatorDashActualImg,
      previewTitle: 'Creator Studio Dashboard & Split Sheets'
    },
    {
      key: 'label',
      label: 'Record Labels',
      sub: 'Catalog Management',
      href: '/for/label',
      logo: ROLE_LOGOS['label'],
      accent: 'var(--purple)',
      desc: 'For record labels, A&R managers, and industry leaders. Manage your entire artist catalog, track splits, and coordinate roster-wide releases.',
      preview: labelDashActualImg,
      previewTitle: 'Record Label Catalog & Ingestion Console'
    },
    {
      key: 'dj',
      label: 'DJs',
      sub: 'DJ Pool Engine',
      href: '/for/dj',
      logo: ROLE_LOGOS['dj'],
      accent: '#14b8a6',
      desc: 'The next-generation pool engine. Access lossless audio files, queue pools, and secure stem clearances for live sets.',
      preview: djDashActualImg,
      previewTitle: 'DJ Pool & Dancefloor Drop Clearances Hub'
    },
    {
      key: 'media_house',
      label: 'Media Houses',
      sub: 'Broadcast & Playlisting',
      href: '/for/media-house',
      logo: ROLE_LOGOS['media_house'],
      accent: 'var(--blue)',
      desc: 'Broadcasting and queue routing tools. Access authorized compliance directories and manage music scheduling for broadcast channels.',
      preview: mediahouseDashActualImg,
      previewTitle: 'Media House Broadcast & Compliance Queue'
    },
    {
      key: 'supervisor',
      label: 'Music Supervisors',
      sub: 'SyncMavens Licensing',
      href: '/for/supervisor',
      externalUrl: getServiceUrl('syncmavens'),
      externalLabel: 'Launch SyncMavens',
      logo: ROLE_LOGOS['supervisor'],
      accent: 'var(--am)',
      desc: 'Sync licensing and AI scene-tagging made simple. Search our curated catalog of watermarked tracks and find the perfect vibe for your film or TV project.',
      preview: supervisorDashActualImg,
      previewTitle: 'SyncMavens Sync Licensing & AI Scene Search'
    },
    {
      key: 'consumer',
      label: 'tunestream',
      sub: 'Everyday Listeners',
      href: '/for/consumer',
      externalUrl: getServiceUrl('tunestream'),
      externalLabel: 'Launch TuneStream',
      logo: ROLE_LOGOS['consumer'],
      accent: '#10b981',
      desc: 'Our consumer streaming app. Listen to your favorite tracks, support creators directly with direct-tipping, and sync your music offline.',
      preview: consumerDashActualImg,
      previewTitle: 'TuneStream Hi-Fi Music Streaming Application'
    },
    {
      key: 'corporate',
      label: 'Corporate',
      sub: 'Sponsorships & Ads',
      href: '/for/corporate',
      logo: ROLE_LOGOS['corporate'],
      accent: '#ef4444',
      desc: 'Connect brands with target audiences. Run campaigns, sponsor curators, and manage native audio ad placements.',
      preview: corporateDashActualImg,
      previewTitle: 'Corporate Advertising & Sponsorships Console'
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
                {role.externalUrl && (
                  <a 
                    href={role.externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn pf-card-cta" 
                    style={{ '--pf-accent': role.accent, background: 'rgba(255,255,255,0.06)', border: `1px solid ${role.accent}`, color: role.accent }}
                  >
                    {role.externalLabel || 'Open Portal'} &rarr;
                  </a>
                )}
                <button 
                  onClick={() => setPreviewModal({ 
                    image: role.preview, 
                    title: role.previewTitle, 
                    roleName: role.label, 
                    accent: role.accent 
                  })} 
                  className="btn pf-card-cta outline"
                  style={{ '--pf-accent': role.accent, cursor: 'pointer', background: 'transparent' }}
                  data-testid={`dash-preview-btn-${role.key}`}
                >
                  Dash Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewModal && (
        <div className="pf-modal-overlay" onClick={() => setPreviewModal(null)}>
          <div className="pf-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="pf-modal-live-tag">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Live System Capture
                </span>
                <span className="pf-modal-title">
                  {previewModal.roleName}  -  {previewModal.title}
                </span>
              </div>
              <button 
                className="pf-modal-close" 
                onClick={() => setPreviewModal(null)}
                aria-label="Close dashboard preview modal"
              >
                ×
              </button>
            </div>
            <div className="pf-modal-scroll-body">
              <img 
                src={previewModal.image} 
                alt={`${previewModal.roleName} Dashboard Preview`} 
                className="pf-modal-img" 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
