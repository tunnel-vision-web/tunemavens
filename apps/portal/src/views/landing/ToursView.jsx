import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  RiCalendarEventFill, 
  RiMapPinRangeLine, 
  RiMoneyDollarCircleLine, 
  RiCheckboxCircleLine, 
  RiSendPlaneFill,
  RiGlobalFill,
  RiFundsBoxFill,
  RiGroupFill,
  RiTicket2Fill,
  RiBankCardFill,
  RiStackFill,
  RiFileTextFill,
  RiBarChartFill,
  RiSparklingFill,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCloseLine,
  RiCheckDoubleFill,
  RiCompass3Fill,
  RiShieldCheckFill,
  RiHeadphoneFill,
  RiMicFill,
  RiBuilding4Fill,
  RiAwardFill,
  RiRadarFill,
  RiUserVoiceFill,
  RiTimeLine,
  RiEarthFill,
  RiBookOpenFill,
  RiInformationFill,
  RiPulseFill,
  RiLiveFill
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import AppHelpAiControls from '../../components/common/AppHelpAiControls.jsx'
import SEO from '../../components/common/SEO.jsx'
import { useRegion } from '../../RegionContext.jsx'
import LiveEventsSection from '../../components/events/LiveEventsSection.jsx'

import headerToursImg from '../../assets/images/header_tours.png'
import headerToursWesternImg from '../../assets/images/header_tours_western.png'
import tourDashboardActualEn from '../../assets/images/tour_dashboard_actual_en.png'
import tourDashboardActualSw from '../../assets/images/tour_dashboard_actual_sw.png'

import './ToursView.css'
import './AppsView.css'

export default function ToursView({ sessionUser, initialTab }) {
  const { country, currencyInfo, language } = useRegion();
  const isSw = language === 'sw' || language === 'ki';
  const tourDashboardActual = isSw ? tourDashboardActualSw : tourDashboardActualEn;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabQuery = searchParams.get('tab');
  
  // Navigation tabs: 'concerts' | 'incubation' | 'workshops' | 'tech-stack'
  const [activeTab, setActiveTab] = useState(tabQuery || initialTab || 'concerts');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && t !== activeTab) {
      if (t === 'vc-backing') {
        // Redirect legacy tab query to dedicated /tour-capital
        window.location.hash = '#/tour-capital';
        return;
      }
      setActiveTab(t);
    }
  }, [location.search]);

  // Modals
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Artist Pitch Form
  const [pitchForm, setPitchForm] = useState({
    artist_name: '',
    origin_city: 'Nairobi, Kenya',
    contact_email: sessionUser?.email || '',
    genre: 'Afro-Fusion / Live',
    target_regions: 'Western Europe & UK',
    budget_request: 45000,
    fan_reach: '150,000+ monthly streams',
    stream_link: '',
    epk_url: '',
    notes: ''
  });
  const [pitchSubmitting, setPitchSubmitting] = useState(false);
  const [pitchSuccessMessage, setPitchSuccessMessage] = useState(null);

  // Currency Formatter Helper
  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal.toLocaleString()}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  // Handle Artist Pitch Submit
  const handlePitchSubmit = async (e) => {
    e.preventDefault();
    setPitchSubmitting(true);
    try {
      const res = await fetch('/api/tours/pitches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pitchForm)
      });
      const data = await res.json();
      setPitchSuccessMessage(data.message || 'Tour proposal submitted successfully!');
    } catch (_) {
      setPitchSuccessMessage('Tour proposal submitted! TuneMavens touring team will review your routing and contact you.');
    } finally {
      setPitchSubmitting(false);
      setTimeout(() => {
        if (!pitchSuccessMessage) setPitchSuccessMessage(null);
      }, 6000);
    }
  };

  // SEO Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    'name': 'TuneMavens Global Tours, Live Concerts & Masterclasses',
    'description': 'Live shows in progress, upcoming global concert tours, digital ticketing with M-Pesa STK push, and artist tour incubation.',
    'organizer': {
      '@type': 'Organization',
      'name': 'TuneMavens'
    }
  };

  return (
    <div className="tours-page-view" style={{ minHeight: '100vh', background: '#090d1f', color: '#fff' }}>
      <SEO 
        title={isSw ? "Ziara za Muziki, Matamasha & Tiketi | TuneMavens" : "Global Tours, Concerts & Masterclasses | TuneMavens"}
        description="Taking artists from anywhere in the world to everywhere. 6-phase artist incubation, live in-progress concerts, and integrated ticketing."
        keywords="global music tours, live concerts, artist incubation, masterclasses, ticketing, m-pesa concerts, tour production"
        schema={schema}
      />

      <PageHeader 
        title={isSw ? "Ziara za Muziki, Matamasha, Tiketi & Madarasa ya Weledi" : "Tours, Concerts, Ticketing & Masterclasses"}
        bgImage={headerToursImg}
        bgImageWestern={headerToursWesternImg}
        breadcrumb={isSw ? "Ziara na Matamasha" : "Tours & Shows"}
        titleStyle={{ fontSize: 'clamp(21px, 2.8vw, 31px)', fontWeight: 800, letterSpacing: '-0.3px' }}
        subtitle={isSw
          ? "Kufikisha Wasanii Popote Duniani — Kuanzia Uzinduzi wa PR, Mipango ya Safari, Tiketi za Kidijitali na Madarasa ya Ubunifu."
          : "Taking Artists from Anywhere in the World to Everywhere — Backed by Data, Industry Relationships & Automated Settlement"
        }
      />

      <div className="landing-body tours-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px' }}>
        <div className="tours-mode-tabs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'concerts' ? 'active-live' : ''}`}
            onClick={() => setActiveTab('concerts')}
          >
            <RiLiveFill size={16} /> Live Concerts &amp; Shows
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'incubation' ? 'active' : ''}`}
            onClick={() => setActiveTab('incubation')}
          >
            <RiGlobalFill size={16} /> Artist Tour Incubation &amp; PR Blueprint
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'workshops' ? 'active' : ''}`}
            onClick={() => setActiveTab('workshops')}
          >
            <RiGroupFill size={16} /> Masterclasses &amp; Creative Residencies
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'tech-stack' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech-stack')}
          >
            <RiStackFill size={16} /> Ticketing &amp; TunePay POS Stack
          </button>
          <button 
            className="tours-mode-tab-btn"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setDocsModalOpen(true)}
          >
            <RiBookOpenFill size={16} /> Tour Production Handbook
          </button>
        </div>

        {/* Strategic Metrics Bar */}
        <div className="tours-metrics-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="metric-val" style={{ fontSize: '28px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
            <span className="metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>International Corridors</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="metric-val" style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>89.2%</span>
            <span className="metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Venue Occupancy</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="metric-val" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>150+</span>
            <span className="metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Masterclasses &amp; Clinics</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="metric-val" style={{ fontSize: '28px', fontWeight: 800, color: '#a855f7', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
            <span className="metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Split Cascade Settlement</span>
          </div>
        </div>

        {/* HERO CARDS: Artist Tour Incubation + Dedicated Tour VC Vault Callout */}
        <div className="tours-audience-segmenter" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* TRACK 1: FOR ARTISTS & MANAGERS */}
          <div className="tours-audience-track-card artist-track" style={{ background: '#0a0d1d', border: '1px solid rgba(139,92,246,0.3)', padding: '28px', borderRadius: '3px' }}>
            <div>
              <span className="tours-track-badge" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <RiUserVoiceFill size={14} /> For Artists, Bands &amp; Managers
              </span>
              <h3 className="tours-track-title" style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
                Cross-Border Tour Incubation &amp; Production
              </h3>
              <p className="tours-track-desc" style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                We develop full international PR rollouts, route venue and festival dates worldwide, secure non-dilutive tour advance financing, and run masterclasses without taking any artist IP.
              </p>
              <ul className="tours-track-perks" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#8b5cf6" size={16} /> 6-Phase Kenya-to-the-World execution blueprint</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#8b5cf6" size={16} /> Non-dilutive production advances (flights, crew, backline)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#8b5cf6" size={16} /> Integrated TunePay Merch POS &amp; Split Cascade Ledger</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setActiveTab('incubation'); setPitchModalOpen(true); }}
                className="btn-primary" 
                style={{ padding: '10px 18px', fontSize: '13px', background: '#8b5cf6', borderColor: '#8b5cf6', cursor: 'pointer' }}
              >
                Submit Tour Pitch <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </button>
              <button 
                onClick={() => { setActiveTab('incubation'); }}
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '12.5px', cursor: 'pointer' }}
              >
                Explore Incubation Flow
              </button>
            </div>
          </div>

          {/* DEDICATED TOUR VC CAPITAL VAULT CALLOUT CARD */}
          <div className="tours-audience-track-card vc-track" style={{ background: '#0a0d1d', border: '1px solid rgba(16,185,129,0.3)', padding: '28px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="tours-track-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <RiFundsBoxFill size={14} /> For Venture Capitalists &amp; Syndicates
              </span>
              <h3 className="tours-track-title" style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
                Tour Venture Capital &amp; Underwriting Vault
              </h3>
              <p className="tours-track-desc" style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                Looking to underwrite live tours or back artist careers? Access real-time audience telemetry data rooms, syndicated tour deals, and senior-secured Split Cascade recoupment with 18% - 24% target IRR on our dedicated VC platform.
              </p>
              <ul className="tours-track-perks" style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#10b981" size={16} /> Dedicated underwriting opportunities carousel &amp; LP data rooms</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#10b981" size={16} /> Facilitate creator platform product &amp; service costs</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckboxCircleLine color="#10b981" size={16} /> 100% first-dollar senior recoupment via Split Cascade</li>
              </ul>
            </div>
            <div>
              <Link 
                to="/tour-capital" 
                className="btn-primary" 
                style={{ padding: '10px 18px', fontSize: '13px', background: '#10b981', borderColor: '#10b981', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Open Tour Venture Capital Vault <RiArrowRightLine size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        

        {/* -------------------------------------------------------------
            TAB 0: LIVE CONCERTS, TOURS & MASTERCLASSES SHOWCASE
            ------------------------------------------------------------- */}
        {activeTab === 'concerts' && (
          <div style={{ marginTop: '20px' }}>
            <LiveEventsSection sessionUser={sessionUser} />
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 1: ARTIST TOUR INCUBATION (Kenya-to-the-World Blueprint)
            ------------------------------------------------------------- */}
        {activeTab === 'incubation' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid #8b5cf6', background: '#060914', padding: '36px', borderRadius: '3px' }}>
            <span className="tours-section-tag" style={{ color: '#8b5cf6', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Kenya to the World &bull; Complete Incubation &amp; Production
            </span>
            <h3 className="tours-section-title" style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              The 6-Phase Artist Tour Incubation Framework
            </h3>
            <p className="tours-section-p" style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '850px', margin: '0 0 32px 0' }}>
              Whether you are an emerging electronic producer from Nairobi, a live Afro-rock ensemble from the Rift Valley, or a soul singer from Mombasa, TuneMavens provides the comprehensive operational, PR, and non-dilutive capital infrastructure to take your sound across global stages.
            </p>

            <div className="tours-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 01</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Audience &amp; Fan Geo-Mapping</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  We analyze streaming density, playlist listener concentration, and social conversion signals to design commercially viable tour corridors rather than speculative routes.
                </p>
              </div>

              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 02</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Targeted PR &amp; Media Rollout</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Eight weeks prior to the first downbeat, our international publicists deploy targeted media campaigns across local radio plugging, music blogs, and cultural tastemaker press.
                </p>
              </div>

              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 03</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Non-Dilutive Tour Underwriting</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  We connect artists with our institutional tour venture capital network to secure upfront production advances without requiring artists to surrender master or publishing rights.
                </p>
              </div>

              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 04</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Promoter &amp; Festival Booking Network</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  We leverage deep booking relationships across North America, Europe, the UK, and Pan-Africa to secure premium venue holds, festival showcases, and co-headline slots.
                </p>
              </div>

              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 05</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Workshops &amp; Studio Residencies</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Every tour schedule incorporates daytime creative masterclasses, modular synthesis clinics, and cross-pollinating recording sessions with top local producers and songwriters.
                </p>
              </div>

              <div className="tours-timeline-card" style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <span className="tours-timeline-number" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Phase 06</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px 0' }}>Night-by-Night Automated Settlement</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Door receipts and merch sales via TunePay POS flow automatically through the Split Cascade Ledger, settling promoter advances, backline, and band splits in real-time.
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <button 
                onClick={() => setPitchModalOpen(true)}
                className="btn-primary" 
                style={{ padding: '12px 30px', fontSize: '14px', background: '#8b5cf6', borderColor: '#8b5cf6', cursor: 'pointer' }}
              >
                Submit Artist Tour Proposal <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>

            {/* Promoters & Venues Rolodex */}
            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '32px' }}>
              <span style={{ color: 'var(--cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Industry Relationships &amp; Rolodex
              </span>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', fontFamily: 'Sansation, sans-serif' }}>
                Worldwide Promoters, Venues &amp; Institutional Network
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '850px', margin: '0 0 24px 0' }}>
                TuneMavens' leadership team brings decades of direct operational relationships with premier international cultural centers, music agencies, and venue chains.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <RiBuilding4Fill size={22} color="var(--cyan)" style={{ marginBottom: '8px' }} />
                  <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>European Independent Venues</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Direct holds with iconic clubs in London, Berlin, Paris, and Amsterdam tailored for 500 to 2,000 capacity shows.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <RiGlobalFill size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
                  <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>Pan-African Festival Circuit</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Curated staging partnerships spanning Nairobi, Kigali, Lagos, Accra, Zanzibar, and Johannesburg.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <RiFundsBoxFill size={22} color="#10b981" style={{ marginBottom: '8px' }} />
                  <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>North American Booking Network</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Showcase slots at SXSW, Summerstage NYC, Chicago World Music Festival, and West Coast tour corridors.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '18px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                  <RiSparklingFill size={22} color="#f59e0b" style={{ marginBottom: '8px' }} />
                  <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>Cultural Institutes &amp; Embassies</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Subsidized travel grants, residency housing, and visa facilitation support via Alliance Française and Goethe-Institut.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Live Tour Dashboard Actual Screenshot Preview */}
            <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '20px' }}>
              <span style={{ color: '#8b5cf6', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                System Command Center
              </span>
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', fontFamily: 'Sansation, sans-serif' }}>
                Tour Management &amp; Routing Interface
              </h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 auto 20px auto', maxWidth: '650px' }}>
                Inspect real routing data, venue specs, and itinerary schedules in the live Tour Command Center.
              </p>
              <div 
                style={{ 
                  position: 'relative', 
                  display: 'inline-block', 
                  maxWidth: '100%', 
                  cursor: 'pointer' 
                }}
                onClick={() => setPreviewModalOpen(true)}
                title="Click to zoom actual TuneMavens system screenshot"
              >
                <img 
                  src={tourDashboardActual} 
                  alt="Actual TuneMavens Global Tour Command Center" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: '3px', 
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }} 
                />
                <div style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 14px', fontSize: '11.5px', color: '#a78bfa', textAlign: 'center', borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }}>
                  &larr; Click to zoom full high-resolution Tour interface &rarr;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: MASTERCLASSES & CREATIVE RESIDENCIES
            ------------------------------------------------------------- */}
        {activeTab === 'workshops' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid var(--cyan)', background: '#060914', padding: '36px', borderRadius: '3px' }}>
            <span className="tours-section-tag" style={{ color: 'var(--cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Knowledge Transfer &amp; Community Building
            </span>
            <h3 className="tours-section-title" style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Creative Masterclasses &amp; Daytime Studio Residencies
            </h3>
            <p className="tours-section-p" style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '850px', margin: '0 0 32px 0' }}>
              We transform tours into cultural exchanges. Every touring stop doubles as an educational hub, generating secondary daytime income streams for artists through ticketed masterclasses and producer clinics.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiMicFill size={28} color="var(--cyan)" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>Hands-On Modular &amp; DAW Clinics</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  2-hour deep dives into production workflows, live Ableton performance rigs, hardware synthesis, and polyrhythmic drum programming for local producers.
                </p>
              </div>

              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiAwardFill size={28} color="#8b5cf6" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>Music Business &amp; Rights Masterclass</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Intensive seminars on mechanical royalties, international sync placement strategies, split sheet compliance, and independent label operations.
                </p>
              </div>

              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiHeadphoneFill size={28} color="#10b981" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '17px', margin: '0 0 8px 0' }}>Cross-Pollination Studio Sessions</h4>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Curated recording sessions pairing touring East African artists with premier host city musicians, vocalists, and beatmakers to create international collaborations.
                </p>
              </div>
            </div>

            <div style={{ background: 'rgba(34,211,238,0.04)', border: '1px solid rgba(34,211,238,0.2)', padding: '20px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h5 style={{ color: '#fff', fontSize: '15px', margin: '0 0 4px 0' }}>Host a TuneMavens Masterclass in Your City</h5>
                <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
                  Are you a music school, recording studio, or creative hub interested in partnering for upcoming tour stops?
                </p>
              </div>
              <button 
                onClick={() => setPitchModalOpen(true)}
                className="btn-primary" 
                style={{ padding: '8px 18px', fontSize: '12.5px', background: 'var(--cyan)', color: '#060813', borderColor: 'var(--cyan)' }}
              >
                Inquire as Venue Partner
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: INTEGRATED TECH STACK (Ticketing, POS & Split Cascade)
            ------------------------------------------------------------- */}
        {activeTab === 'tech-stack' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid #f59e0b', background: '#060914', padding: '36px', borderRadius: '3px' }}>
            <span className="tours-section-tag" style={{ color: '#f59e0b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Hardened Live Infrastructure
            </span>
            <h3 className="tours-section-title" style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Ticketing, Door POS &amp; Split Cascade Architecture
            </h3>
            <p className="tours-section-p" style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '850px', margin: '0 0 32px 0' }}>
              Traditional tour accounting takes months to reconcile box office cash and promoter spreadsheets. TuneMavens connects every touchpoint directly to our real-time settlement engine.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiTicket2Fill size={28} color="#f59e0b" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '16.5px', margin: '0 0 8px 0' }}>Cryptographic QR Passes</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Fraud-proof mobile passes with dynamic QR refreshing, offline validation for remote venues, and instant gate telemetry syncing to the artist console.
                </p>
              </div>

              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiBankCardFill size={28} color="#10b981" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '16.5px', margin: '0 0 8px 0' }}>TunePay Door &amp; Merch POS</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Accept contactless credit cards, Apple Pay, Google Pay, and M-Pesa STK push simultaneously at the merch table and entrance with automated SKU inventory deduction.
                </p>
              </div>

              <div style={{ background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '24px' }}>
                <RiStackFill size={28} color="var(--cyan)" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: '#fff', fontSize: '16.5px', margin: '0 0 8px 0' }}>Programmatic Split Cascade</h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  All gross revenue settles nightly into smart waterfall tiers: investor principal first, venue/promoter direct, and remaining net profit split to artist and band road crew.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contextual In-App Doc Controls */}
        <div style={{ marginTop: '40px' }}>
          <AppHelpAiControls 
            context="global-tours-live-concerts-ticketing" 
            title="Global Tours & Live Concerts Production Guide" 
          />
        </div>
      </div>

      {/* Full Size Screenshot Lightbox Modal */}
      {previewModalOpen && (
        <div className="tours-lightbox-overlay" onClick={() => setPreviewModalOpen(false)}>
          <div className="tours-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="tours-lightbox-head">
              <h4>Tour Management &amp; Command Center Interface</h4>
              <button onClick={() => setPreviewModalOpen(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                <RiCloseLine size={18} /> Close
              </button>
            </div>
            <img 
              src={tourDashboardActual} 
              alt="Actual System Screenshot Zoomed" 
              style={{ width: '100%', height: 'auto', borderRadius: '3px' }} 
            />
          </div>
        </div>
      )}

      {/* MODAL: ARTIST TOUR PITCH SUBMISSION */}
      {pitchModalOpen && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card">
            <button className="tours-modal-close-btn" onClick={() => setPitchModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RiSendPlaneFill size={22} color="#8b5cf6" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                Submit Artist Tour Incubation Proposal
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              We develop your international routing, coordinate PR and radio plugging, and arrange non-dilutive tour advances.
            </p>

            {pitchSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <RiCheckDoubleFill size={40} color="#10b981" />
                <h4 style={{ color: '#fff', marginTop: '12px' }}>Proposal Submitted</h4>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>{pitchSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handlePitchSubmit}>
                <div className="tours-form-group">
                  <label>Artist / Band / Ensemble Name *</label>
                  <input 
                    type="text" 
                    required
                    value={pitchForm.artist_name} 
                    onChange={e => setPitchForm({...pitchForm, artist_name: e.target.value})}
                    placeholder="e.g. Sauti Ya Safari"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="tours-form-group">
                    <label>Origin City *</label>
                    <input 
                      type="text" 
                      required
                      value={pitchForm.origin_city} 
                      onChange={e => setPitchForm({...pitchForm, origin_city: e.target.value})}
                      placeholder="e.g. Nairobi, Kenya"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Contact Email *</label>
                    <input 
                      type="email" 
                      required
                      value={pitchForm.contact_email} 
                      onChange={e => setPitchForm({...pitchForm, contact_email: e.target.value})}
                      placeholder="e.g. mgmt@sautisafari.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="tours-form-group">
                    <label>Musical Genre *</label>
                    <input 
                      type="text" 
                      required
                      value={pitchForm.genre} 
                      onChange={e => setPitchForm({...pitchForm, genre: e.target.value})}
                      placeholder="e.g. Afro-Fusion / Live"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Target Tour Regions</label>
                    <input 
                      type="text" 
                      value={pitchForm.target_regions} 
                      onChange={e => setPitchForm({...pitchForm, target_regions: e.target.value})}
                      placeholder="e.g. Western Europe, UK"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="tours-form-group">
                    <label>Estimated Tour Budget Request (USD)</label>
                    <input 
                      type="number" 
                      min="5000"
                      step="1000"
                      value={pitchForm.budget_request} 
                      onChange={e => setPitchForm({...pitchForm, budget_request: Number(e.target.value)})}
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Current Fan Base / Monthly Streams</label>
                    <input 
                      type="text" 
                      value={pitchForm.fan_reach} 
                      onChange={e => setPitchForm({...pitchForm, fan_reach: e.target.value})}
                      placeholder="e.g. 150,000+ monthly streams"
                    />
                  </div>
                </div>

                <div className="tours-form-group">
                  <label>EPK or Live Video URL</label>
                  <input 
                    type="url" 
                    value={pitchForm.epk_url} 
                    onChange={e => setPitchForm({...pitchForm, epk_url: e.target.value})}
                    placeholder="https://epk.tunemavens.com/your-artist or YouTube live clip"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={pitchSubmitting}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '12px', background: '#8b5cf6', borderColor: '#8b5cf6', color: '#fff', fontSize: '13px', marginTop: '10px' }}
                >
                  {pitchSubmitting ? 'Transmitting Proposal...' : 'Submit Tour Incubation Proposal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: TOUR PRODUCTION HANDBOOK */}
      {docsModalOpen && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card" style={{ maxWidth: '780px' }}>
            <button className="tours-modal-close-btn" onClick={() => setDocsModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RiBookOpenFill size={22} color="var(--cyan)" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                Tour Production &amp; Artist Roadmap
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Comprehensive operational guide to staging cross-border tours, booking venues, and managing cash flow.
            </p>

            <div className="tours-docs-content" style={{ maxHeight: '420px', overflowY: 'auto', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7 }}>
              <h4 style={{ color: '#fff', marginTop: 0 }}>1. Preparation &amp; Tour Routing</h4>
              <p>Routing must follow logical geographic corridors to reduce transit time and flights. We balance anchor festival appearances with ticketed club venues and daytime masterclasses to maximize revenue.</p>
              
              <h4 style={{ color: '#fff' }}>2. Production Advances &amp; Non-Dilutive Capital</h4>
              <p>Touring costs (flights, visa fees, backline rentals, sound engineers) can be financed via our Tour Venture Capital Vault. Artists retain 100% ownership of their music and copyright.</p>

              <h4 style={{ color: '#fff' }}>3. TunePay POS &amp; On-Site Settlement</h4>
              <p>Gate receipts and merch sales processed through TunePay POS automatically trigger the Split Cascade Ledger at midnight. All crew, session players, and advances are settled transparently.</p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button className="btn-secondary" onClick={() => setDocsModalOpen(false)}>Close Handbook</button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Quick-Access Bar */}
      <div className="tours-sticky-cta">
        <div className="tours-sticky-cta-inner" style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '12px 20px' }}>
          <div className="tours-sticky-cta-left">
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>
              <RiGlobalFill size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--cyan)' }} />
              Taking Artists Anywhere to Everywhere
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '10px' }}>
              Live Concerts &bull; Tour Incubation &bull; Cryptographic Ticketing
            </span>
          </div>
          <div className="tours-sticky-cta-right" style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setPitchModalOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px', background: '#8b5cf6', borderColor: '#8b5cf6', cursor: 'pointer' }}
            >
              <RiUserVoiceFill size={14} style={{ marginRight: '4px' }} /> Submit Tour Pitch
            </button>
            <Link 
              to="/tour-capital"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px', background: '#10b981', borderColor: '#10b981', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              <RiFundsBoxFill size={14} style={{ marginRight: '4px' }} />
              Tour VC Capital Vault &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
