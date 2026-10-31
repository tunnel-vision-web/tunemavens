import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiFundsBoxFill,
  RiSparklingFill,
  RiCompass3Fill,
  RiShieldCheckFill,
  RiCoinsFill,
  RiBarChartFill,
  RiArrowRightLine,
  RiCheckFill,
  RiCheckboxCircleFill,
  RiGlobalFill,
  RiRadarFill,
  RiBankCardFill,
  RiCloseFill,
  RiMicFill,
  RiDiscFill,
  RiMusic2Fill,
  RiFileTextFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { useRegion } from '../../../RegionContext.jsx'
import tourDashboardActualImg from '../../../assets/images/vc_dashboard_actual.png'

const DISCOVERY_OPPORTUNITIES = [
  {
    creator_id: 'art_ndufo',
    creator_type: 'artist',
    type_label: 'Recording Artist & Producer',
    name: 'Ndufo',
    handle: '@ndufo',
    origin: 'Nairobi, Kenya',
    genre: 'Afro-House & Live Modular',
    avatar: '/heroes/ndufo_hero_slide1_retina.jpg',
    listeners_label: '620k monthly listeners',
    historical_gross_box_office: 527250.00,
    retention: '84.2%',
    recommended_advance: 50000.00,
    target_irr: '23.6%',
    recoupment_months: '3.8 mos',
    risk: 'Senior Secured (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Tour Advance Underwriting'
  },
  {
    creator_id: 'pod_afrotech',
    creator_type: 'podcaster',
    type_label: 'Technology & VC Audio Show',
    name: 'AfroTech Disruption',
    handle: '@afrotech_disrupt',
    origin: 'Nairobi, Kenya',
    genre: 'Tech, VC & Startup Podcast',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '185k episode downloads/mo',
    historical_gross_box_office: 180000.00,
    retention: '89.2%',
    recommended_advance: 20000.00,
    target_irr: '21.8%',
    recoupment_months: '3.4 mos',
    risk: 'High CPM Ad Flights (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Live Tour & Ad Facility'
  },
  {
    creator_id: 'dj_kalonje',
    creator_type: 'dj',
    type_label: 'Street Anthem & Arena Club DJ',
    name: 'DJ Kalonje (Cyberwave Live)',
    handle: '@djkalonjelive',
    origin: 'Nairobi & Eastlands',
    genre: 'Afro-Fusion & Arena Club Mix',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '740k mix listeners/mo',
    historical_gross_box_office: 760000.00,
    retention: '86.8%',
    recommended_advance: 35000.00,
    target_irr: '24.5%',
    recoupment_months: '2.9 mos',
    risk: 'Highest Live Frequency (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Arena Tour Advance'
  },
  {
    creator_id: 'art_amina',
    creator_type: 'artist',
    type_label: 'Recording Artist & Singer',
    name: 'Amina Mwangi',
    handle: '@aminasounds',
    origin: 'Nairobi, Kenya',
    genre: 'Afro-Soul & R&B Vocals',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '480k monthly listeners',
    historical_gross_box_office: 384000.00,
    retention: '82.5%',
    recommended_advance: 30000.00,
    target_irr: '22.0%',
    recoupment_months: '4.1 mos',
    risk: 'Senior Secured (Low)',
    tunemavens_fee: '3.0%',
    status: 'Acoustic Residency Open'
  },
  {
    creator_id: 'pod_nairobi_beats',
    creator_type: 'podcaster',
    type_label: 'Music Culture & Hip-Hop Show',
    name: 'Nairobi Beats Weekly',
    handle: '@nairobibeatsweekly',
    origin: 'Nairobi & Mombasa',
    genre: 'Culture, Hip-Hop & Gengetone',
    avatar: '/heroes/hero_music_4.png',
    listeners_label: '140k listeners/mo',
    historical_gross_box_office: 127600.00,
    retention: '88.5%',
    recommended_advance: 15000.00,
    target_irr: '22.4%',
    recoupment_months: '3.6 mos',
    risk: 'Low-Moderate',
    tunemavens_fee: '3.0%',
    status: 'Mobile Studio Advance Open'
  },
  {
    creator_id: 'dj_sola',
    creator_type: 'dj',
    type_label: 'International Touring DJ',
    name: 'DJ Sola (Global Afro-Tech)',
    handle: '@djsolaglobal',
    origin: 'London & Nairobi',
    genre: 'Deep Afro-Tech & Electronic',
    avatar: '/heroes/hero_music_2.png',
    listeners_label: '490k stream listeners/mo',
    historical_gross_box_office: 832000.00,
    retention: '85.0%',
    recommended_advance: 45000.00,
    target_irr: '23.5%',
    recoupment_months: '3.9 mos',
    risk: 'International Hard Currency (Low)',
    tunemavens_fee: '3.0%',
    status: 'European Showcase Advance'
  }
];

export default function VcLandingPage({ switcher }) {
  const { currencyInfo, formatPrice } = useRegion();
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('all');
  const [selectedUnderwriteTarget, setSelectedUnderwriteTarget] = useState(null);
  const [underwriteExecuted, setUnderwriteExecuted] = useState(false);

  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal.toLocaleString()}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  const servicesList = [
    { name: 'Global DSP Distribution Package', cost: 149, roi: '15% DSP Royalty Share until 1.25x' },
    { name: 'EPK Pro Domain & Cloud Hosting', cost: 199, roi: '10% Booking Fees until 1.20x' },
    { name: 'AI & Analog Studio Mastering Suite', cost: 250, roi: '12% Stream Payouts until 1.25x' },
    { name: 'SyncMavens Film & TV Representation', cost: 300, roi: '20% Sync Placement Fee until 1.30x' },
    { name: 'Smart CRM Superfan Broadcast Credits', cost: 450, roi: '10% Merch Gross until 1.25x' },
    { name: 'Live Tour Production & Backline Advance', cost: 15000, roi: 'Senior Secured 100% Door until 1.35x' },
  ];

  const filteredOpportunities = DISCOVERY_OPPORTUNITIES.filter(op => {
    if (selectedPersonaFilter === 'all') return true;
    return op.creator_type === selectedPersonaFilter;
  });

  return (
    <div className="role-landing-view vc-landing-view" data-testid="vc-landing-page">
      {switcher}

      {/* Hero Section */}
      <section className="role-hero" style={{ background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 20px 70px 20px' }}>
          <div style={{ maxWidth: '860px' }}>
            <span className="role-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <RiFundsBoxFill /> Alternative Music Assets · Institutional Tour &amp; Career Underwriting
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: '#ffffff', fontFamily: 'Sansation, sans-serif', lineHeight: 1.15, margin: '0 0 16px 0' }}>
              Underwrite Live Tours &amp; Sponsor Creator Careers Backed by Real Telemetry.
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, margin: '0 0 32px 0' }}>
              TuneMavens empowers venture capital funds, angel syndicates, and cultural family offices to participate in senior-secured, short-cycle tour advances and direct platform product sponsorships. Programmatic first-dollar recoupment via the Split Cascade Ledger delivers 18% to 25% target IRR with TuneMavens serving as technology intermediary &amp; escrow clearinghouse (3.0% protocol fee). Zero platform credits charged.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/dashboard?tab=vc-portfolio&role=vc" className="btn-primary" style={{ padding: '12px 26px', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '14px', fontWeight: 700 }}>
                Launch VC Command Center <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
              </Link>
              <a href="#underwriting-roster" className="btn-secondary" style={{ padding: '12px 22px', fontSize: '13.5px', color: '#fff', textDecoration: 'none' }}>
                Browse Underwriting Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ background: '#090d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Global Live Corridors</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>{formatMoney(14200000)}+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Tour VC Capital Deployed</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>22.6%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Target IRR</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>3.0%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>TuneMavens Protocol Clearinghouse Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Incorporated Creator Discovery & Underwriting Cards Section */}
      <section id="underwriting-roster" style={{ padding: '70px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                UNDERWRITING RADAR · RECORDING ARTISTS, PODCASTERS &amp; DJS
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'Sansation, sans-serif' }}>
                Active Opportunities &amp; Tour Facilities
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Review real-time telemetry, past gross box-office receipts, forward projections, and execute tri-party financing agreements online.
              </p>
            </div>

            {/* Persona Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Opportunities' },
                { id: 'artist', label: 'Recording Artists' },
                { id: 'podcaster', label: 'Podcasters & Shows' },
                { id: 'dj', label: 'Touring DJs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPersonaFilter(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: selectedPersonaFilter === tab.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPersonaFilter === tab.id ? '#10b981' : 'rgba(255,255,255,0.03)',
                    color: selectedPersonaFilter === tab.id ? '#040711' : '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Underwriting Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {filteredOpportunities.map((op) => (
              <div
                key={op.creator_id}
                style={{
                  background: '#090d1f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                  <img
                    src={op.avatar}
                    alt={op.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        background: op.creator_type === 'artist' ? 'rgba(0, 240, 255, 0.12)' : op.creator_type === 'podcaster' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: op.creator_type === 'artist' ? '#00f0ff' : op.creator_type === 'podcaster' ? '#c084fc' : '#fbbf24',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}>
                        {op.type_label}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 2px' }}>{op.name}</h4>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{op.genre} · {op.origin}</span>
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Audience Volume</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{op.listeners_label}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Historical Box Office</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{formatMoney(op.historical_gross_box_office)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Advance Facility</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>{formatMoney(op.recommended_advance)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Modelled Net IRR</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{op.target_irr} ({op.recoupment_months})</span>
                  </div>
                </div>

                {/* Protocol Info */}
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span>TuneMavens Protocol Fee: <strong style={{ color: '#fff' }}>{op.tunemavens_fee}</strong></span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>Senior Secured Recoupment</span>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedUnderwriteTarget(op)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#10b981',
                      color: '#040711',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiFundsBoxFill size={15} /> Underwrite Facility
                  </button>

                  <Link
                    to="/dashboard?tab=vc-discover&role=vc"
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Full Telemetry &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Facilitating Product & Service Costs for Creators */}
      <section style={{ padding: '70px 0', background: '#090d1f', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              DIRECT CREATOR CAREER SPONSORSHIP
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Invest in Any Creator by Facilitating Their Product &amp; Service Costs
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Rather than traditional equity dilution, VCs can directly sponsor the operational tooling creators need to launch releases, package electronic press kits, and sell out tour stops. Every dollar funded creates a programmatic first-dollar recoupment lien on incoming royalties.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {servicesList.map((svc, sIdx) => (
              <div key={sIdx} style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: 0, fontFamily: 'Sansation, sans-serif' }}>{svc.name}</h4>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{formatMoney(svc.cost)}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--cyan)', marginBottom: '16px' }}>
                  <strong>Recoupment Waterfall:</strong> {svc.roi}
                </div>
                <Link to="/dashboard?tab=vc-sponsorship&role=vc" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px', textDecoration: 'none', display: 'block' }}>
                  Sponsor for Creator <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 2: Actual System Screenshot Preview */}
      <section style={{ padding: '70px 0', background: '#060914' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ACTUAL PLATFORM DASHBOARD PREVIEW
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            The TuneMavens VC Command Center
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.7 }}>
            Explore the authentic, live system interface where venture partners inspect audience telemetry, underwrite tour corridors, and monitor real-time Split Cascade distributions.
          </p>

          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={tourDashboardActualImg} 
              alt="Actual TuneMavens VC Command Center Screenshot" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '6px', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.85)'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 600 }}>
              Click to view high-resolution interactive dashboard preview
            </div>
          </div>
        </div>
      </section>

      {/* Underwriting Quick Modal */}
      {selectedUnderwriteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#090d1f', border: '1px solid #10b981', borderRadius: '8px', maxWidth: '560px', width: '100%', padding: '28px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiShieldCheckFill size={22} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Tri-Party Underwriting Facility</h3>
              </div>
              <button onClick={() => { setSelectedUnderwriteTarget(null); setUnderwriteExecuted(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <RiCloseFill size={20} />
              </button>
            </div>

            {!underwriteExecuted ? (
              <>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
                  Execute a Senior Tour Advance Facility for <strong style={{ color: '#fff' }}>{selectedUnderwriteTarget.name}</strong> under the TuneMavens Tri-Party Protocol:
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', marginBottom: '20px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Principal Advance:</span>
                    <strong style={{ color: '#10b981' }}>{formatMoney(selectedUnderwriteTarget.recommended_advance)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Modelled Target IRR:</span>
                    <strong style={{ color: '#38bdf8' }}>{selectedUnderwriteTarget.target_irr}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>TuneMavens Protocol Fee:</span>
                    <strong style={{ color: '#fff' }}>3.0% automated clearinghouse fee</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Platform Credits Charged:</span>
                    <strong style={{ color: '#10b981' }}>0 Credits (Permanent LP Exemption)</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setUnderwriteExecuted(true)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Execute Tri-Party Agreement Online &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedUnderwriteTarget(null); setUnderwriteExecuted(false); }}
                    style={{
                      padding: '11px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <RiCheckboxCircleFill size={52} color="#10b981" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
                  Facility Executed Successfully!
                </h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                  Agreement sealed with SHA-256 cryptographic stamp. TuneMavens appointed as technology intermediary and escrow clearinghouse (3.0% fee). Telemetry and Split Cascade waterfalls are now unlocked for {selectedUnderwriteTarget.name}.
                </p>
                <Link
                  to="/dashboard?tab=splits&role=vc"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    background: '#10b981',
                    color: '#040711',
                    borderRadius: '4px',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  View in Split Cascade Studio &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMavens VC Command Center · Actual System Interface</h3>
            <img src={tourDashboardActualImg} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
