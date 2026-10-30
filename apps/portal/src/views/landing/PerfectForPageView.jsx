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
import vcDashActualImg from '../../assets/images/vc_dashboard_actual.png'
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
    },
    {
      key: 'vc',
      label: 'Venture Capitalists',
      sub: 'Tour & Career Financing',
      href: '/for/vc',
      logo: ROLE_LOGOS['exec'] || ROLE_LOGOS['corporate'],
      accent: '#10b981',
      desc: 'Underwrite live tours and directly facilitate creator product and service costs with senior-secured Split Cascade recoupment.',
      preview: vcDashActualImg,
      previewTitle: 'Tour & Creator Venture Capital Command Center'
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
              <p className="pf-card-sub" style={{ color: role.accent }}>{role.sub}</p>
              <p className="pf-card-desc">{role.desc}</p>
              
              <div className="pf-card-preview-wrap" style={{ cursor: 'pointer', margin: '16px 0', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setPreviewModal(role)}>
                <img src={role.preview} alt={`${role.label} preview`} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '6px 10px', fontSize: '11px', color: '#fff', textAlign: 'center' }}>
                  Click to view full {role.label} interface
                </div>
              </div>

              {role.externalUrl ? (
                <a href={role.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-cyan pf-card-btn" style={{ borderColor: role.accent, color: role.accent }}>
                  {role.externalLabel || `Explore ${role.label}`}
                </a>
              ) : (
                <Link to={role.href} className="btn btn-outline-cyan pf-card-btn" style={{ borderColor: role.accent, color: role.accent }}>
                  Explore {role.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Full Size Preview Modal with 40% Larger Size and Vertical Scrolling */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', width: '1350px', maxHeight: '92vh', overflowY: 'auto', background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '24px', position: 'relative' }}>
            <button className="preview-modal-close" onClick={() => setPreviewModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', zIndex: 10 }}>
              &times;
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: previewModal.accent }}></span>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>{previewModal.previewTitle || `${previewModal.label} Workspace`}</h3>
            </div>
            <div style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={previewModal.preview} alt={previewModal.label} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
