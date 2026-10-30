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
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiInformationFill,
  RiPulseFill
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import AppHelpAiControls from '../../components/common/AppHelpAiControls.jsx'
import SEO from '../../components/common/SEO.jsx'
import { useRegion } from '../../RegionContext.jsx'

import headerAppsImg from '../../assets/images/header_apps.png'
import headerAppsWesternImg from '../../assets/images/header_apps_western.png'
import tourDashboardMockup from '../../assets/images/tour_dashboard_mockup.png'

import './ToursView.css'
import './AppsView.css'

export default function ToursView({ sessionUser }) {
  const { country, currencyInfo } = useRegion();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabQuery = searchParams.get('tab');
  
  // Navigation tabs: 'incubation' | 'vc-backing' | 'workshops' | 'tech-stack'
  const [activeTab, setActiveTab] = useState(tabQuery || 'vc-backing');

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && t !== activeTab) {
      setActiveTab(t);
    }
  }, [location.search]);

  // Opportunities State from Backend API
  const [opportunities, setOpportunities] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingOpps, setLoadingOpps] = useState(true);

  // Modals
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [vcOnboardModalOpen, setVcOnboardModalOpen] = useState(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);

  const [selectedOpp, setSelectedOpp] = useState(null);
  const [docsTab, setDocsTab] = useState('vc'); // 'vc' | 'artist'

  // Onboarded VC state (persisted locally and synced with backend)
  const [onboardedInvestor, setOnboardedInvestor] = useState(() => {
    try {
      const saved = localStorage.getItem('tunemavens_tour_vc_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  // VC Onboarding Form
  const [vcStep, setVcStep] = useState(1);
  const [vcForm, setVcForm] = useState({
    name: onboardedInvestor?.name || (sessionUser?.displayName || ''),
    email: onboardedInvestor?.email || (sessionUser?.email || ''),
    entity_name: onboardedInvestor?.entity_name || 'Creative Capital Syndicate',
    investor_type: 'venture_fund',
    accreditation_status: 'verified_accredited',
    check_size_range: '$25,000 - $100,000',
    target_corridors: ['Europe', 'North America', 'Pan-African'],
    payout_preference: 'split_cascade_wallet',
    wallet_or_account: 'tm_split_cascade_0x9a84',
    regulatory_attestation: true
  });
  const [vcSubmitting, setVcSubmitting] = useState(false);

  // Capital Commitment Form
  const [commitAmount, setCommitAmount] = useState(10000);
  const [commitSubmitting, setCommitSubmitting] = useState(false);
  const [commitSuccessReceipt, setCommitSuccessReceipt] = useState(null);

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

  // Fetch opportunities from Backend API
  const fetchOpportunities = async () => {
    setLoadingOpps(true);
    try {
      const res = await fetch('/api/tours/vault/opportunities');
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.warn('Could not load opportunities from API, using fallback', err);
    } finally {
      setLoadingOpps(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Carousel Controls
  const maxIndex = Math.max(0, opportunities.length - 1);
  const handlePrevSlide = () => {
    setCarouselIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
  };
  const handleNextSlide = () => {
    setCarouselIndex(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  // Handle VC Onboarding Submit
  const handleVcOnboardSubmit = async (e) => {
    e.preventDefault();
    setVcSubmitting(true);
    try {
      const res = await fetch('/api/tours/investors/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vcForm)
      });
      const data = await res.json();
      if (res.ok && data.investor) {
        setOnboardedInvestor(data.investor);
        localStorage.setItem('tunemavens_tour_vc_profile', JSON.stringify(data.investor));
        setTimeout(() => {
          setVcOnboardModalOpen(false);
          setVcSubmitting(false);
          setVcStep(1);
        }, 1200);
      } else {
        throw new Error(data.detail || 'Onboarding failed');
      }
    } catch (err) {
      console.error(err);
      // Fallback local save for seamless offline development
      const fallbackInvestor = {
        ...vcForm,
        investor_id: 'inv-local-' + Date.now().toString(16),
        accreditation_tier: 'Tier-1 Accredited LP',
        data_room_access_granted: true
      };
      setOnboardedInvestor(fallbackInvestor);
      localStorage.setItem('tunemavens_tour_vc_profile', JSON.stringify(fallbackInvestor));
      setVcSubmitting(false);
      setVcOnboardModalOpen(false);
      setVcStep(1);
    }
  };

  // Handle Capital Commitment Submit
  const handleCommitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setCommitSubmitting(true);
    try {
      const payload = {
        opportunity_id: selectedOpp.id,
        amount: Number(commitAmount),
        currency: 'USD',
        investor_name: onboardedInvestor?.name || 'Accredited LP Backer',
        investor_email: onboardedInvestor?.email || 'lp@tunemavens.vc',
        split_payout_address: onboardedInvestor?.wallet_or_account || 'tm_split_cascade_wallet'
      };

      const res = await fetch('/api/tours/vault/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setCommitSuccessReceipt(data);
        // Refresh opportunities to show updated progress bar
        fetchOpportunities();
      } else {
        throw new Error(data.detail || 'Commitment failed');
      }
    } catch (err) {
      console.error(err);
      // Fallback update
      const updatedOpps = opportunities.map(o => {
        if (o.id === selectedOpp.id) {
          const newFunded = (o.funded_amount || 0) + Number(commitAmount);
          return { ...o, funded_amount: newFunded };
        }
        return o;
      });
      setOpportunities(updatedOpps);
      setCommitSuccessReceipt({
        status: 'success',
        message: `Committed USD ${commitAmount.toLocaleString()} to ${selectedOpp.artist}`,
        commitment: {
          commitment_id: 'commit-local-' + Math.random().toString(36).substring(7),
          artist: selectedOpp.artist,
          amount: Number(commitAmount)
        }
      });
    } finally {
      setCommitSubmitting(false);
    }
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
        setPitchModalOpen(false);
        setPitchSuccessMessage(null);
      }, 2500);
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Global Tours, Masterclasses & Tour Venture Capital",
    "description": "End-to-end artist tour incubation, PR marketing rollout, non-dilutive tour venture financing backed by real fan data, masterclass workshops, and integrated live ticketing.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  return (
    <>
      <SEO 
        title="Global Tours, Masterclasses & Tour Venture Capital | TuneMavens"
        description="Taking artists from anywhere in the world to everywhere. Data-underwritten tour venture capital, 6-phase artist incubation, and integrated ticketing & splits."
        schema={schema}
      />

      <PageHeader 
        title="Tours, ticketing, VC Capital & Masterclasses"
        bgImage={headerAppsImg}
        bgImageWestern={headerAppsWesternImg}
        breadcrumb="Tours"
        titleStyle={{ fontSize: 'clamp(21px, 2.8vw, 31px)', fontWeight: 800, letterSpacing: '-0.3px' }}
        subtitle="Taking Artists from Anywhere in the World to Everywhere — Backed by Data, Industry Relationships & Automated Settlement"
      />

      <div className="landing-body tours-container">
        {/* Strategic Metrics Bar */}
        <div className="tours-metrics-bar">
          <div className="tours-metric-card">
            <span className="metric-val">48+</span>
            <span className="metric-lbl">International Corridors</span>
          </div>
          <div className="tours-metric-card">
            <span className="metric-val" style={{ color: '#10b981' }}>{formatMoney(14200000)}+</span>
            <span className="metric-lbl">Tour VC Deployed</span>
          </div>
          <div className="tours-metric-card">
            <span className="metric-val" style={{ color: 'var(--cyan)' }}>150+</span>
            <span className="metric-lbl">Masterclasses &amp; Clinics</span>
          </div>
          <div className="tours-metric-card">
            <span className="metric-val" style={{ color: 'var(--purple)' }}>100%</span>
            <span className="metric-lbl">Split Cascade Settlement</span>
          </div>
        </div>

        {/* DUAL-TRACK AUDIENCE SEGMENTER: Artists vs Venture Capitalists */}
        <div className="tours-audience-segmenter">
          {/* TRACK 1: FOR ARTISTS & MANAGERS */}
          <div className="tours-audience-track-card artist-track">
            <div>
              <span className="tours-track-badge">
                <RiUserVoiceFill size={14} /> For Artists, Bands &amp; Managers
              </span>
              <h3 className="tours-track-title">Cross-Border Tour Incubation &amp; Production</h3>
              <p className="tours-track-desc">
                We develop full international PR rollouts, route venue and festival dates worldwide, secure non-dilutive tour advance financing, and run masterclasses without taking any artist IP.
              </p>
              <ul className="tours-track-perks">
                <li><RiCheckboxCircleLine color="#8b5cf6" size={16} /> 6-Phase Kenya-to-the-World execution blueprint</li>
                <li><RiCheckboxCircleLine color="#8b5cf6" size={16} /> Non-dilutive production advances (flights, crew, backline)</li>
                <li><RiCheckboxCircleLine color="#8b5cf6" size={16} /> Integrated TunePay Merch POS &amp; Split Cascade Ledger</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setActiveTab('incubation'); setPitchModalOpen(true); }}
                className="btn-primary" 
                style={{ padding: '10px 18px', fontSize: '13px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
              >
                Submit Tour Pitch <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </button>
              <button 
                onClick={() => { setActiveTab('incubation'); }}
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '12.5px' }}
              >
                Explore Incubation Flow
              </button>
            </div>
          </div>

          {/* TRACK 2: FOR VENTURE CAPITALISTS & LPs */}
          <div className="tours-audience-track-card vc-track">
            <div>
              <span className="tours-track-badge">
                <RiFundsBoxFill size={14} /> For Venture Capitalists &amp; Syndicates
              </span>
              <h3 className="tours-track-title">Data-Underwritten Live Tour Capital Vault</h3>
              <p className="tours-track-desc">
                Underwrite live tour advances backed by verifiable streaming velocity, CRM ticket pre-sale indexes, and senior-secured first-dollar recoupment through the Split Cascade Ledger.
              </p>
              <ul className="tours-track-perks">
                <li><RiCheckboxCircleLine color="#10b981" size={16} /> Senior-secured first-dollar recoupment with 18% - 24% target IRR</li>
                <li><RiCheckboxCircleLine color="#10b981" size={16} /> Verifiable real-time audience telemetry and city-by-city density</li>
                <li><RiCheckboxCircleLine color="#10b981" size={16} /> Programmatic night-by-night settlement to your distribution wallet</li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setActiveTab('vc-backing'); setVcOnboardModalOpen(true); }}
                className="btn-primary" 
                style={{ padding: '10px 18px', fontSize: '13px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
              >
                {onboardedInvestor ? 'Manage LP Profile' : 'VC Fast-Track Onboarding'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </button>
              <button 
                onClick={() => { setActiveTab('vc-backing'); }}
                className="btn-secondary" 
                style={{ padding: '10px 16px', fontSize: '12.5px' }}
              >
                Browse Vault Opportunities
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="tours-mode-tabs">
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'vc-backing' ? 'active-vc' : ''}`}
            onClick={() => setActiveTab('vc-backing')}
          >
            <RiFundsBoxFill size={16} /> Tour Venture Capital &amp; Underwriting Vault
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
            <RiStackFill size={16} /> Integrated Ecosystem Tech Stack
          </button>
          <button 
            className="tours-mode-tab-btn"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setDocsModalOpen(true)}
          >
            <RiBookOpenFill size={16} /> VC &amp; Artist Handbook / Docs
          </button>
        </div>

        {/* -------------------------------------------------------------
            TAB 1: TOUR VENTURE CAPITAL & VAULT CAROUSEL
            ------------------------------------------------------------- */}
        {activeTab === 'vc-backing' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid #10b981' }}>
            <span className="tours-section-tag" style={{ color: '#10b981' }}>Alternative Music Assets A Senior Secured Underwriting</span>
            <h3 className="tours-section-title">Tour Venture Capital: Data-Backed Live Underwriting</h3>
            <p className="tours-section-p">
              We empower venture funds, music syndicates, and accredited angel investors to participate in high-yield, short-cycle tour advance financing. Every tour opportunity is underwritten against verified audience telemetry from TuneStream DSP Radar and Smart CRM superfan density, ensuring transparent, first-dollar recoupment through the Split Cascade Ledger.
            </p>

            {/* Investor Status Banner */}
            <div className="tours-vc-status-banner">
              <div className="tours-vc-status-left">
                <div className="tours-vc-status-icon">
                  <RiShieldCheckFill />
                </div>
                <div className="tours-vc-status-info">
                  {onboardedInvestor ? (
                    <>
                      <h4>{onboardedInvestor.entity_name} A {onboardedInvestor.accreditation_tier || 'Tier-1 Accredited LP'}</h4>
                      <p>
                        Data Room Pass Active A Payout Destination: <code style={{ color: '#10b981' }}>{onboardedInvestor.wallet_or_account || 'Split Cascade Wallet'}</code>
                      </p>
                    </>
                  ) : (
                    <>
                      <h4>Venture Capitalist &amp; Syndicate LP Portal</h4>
                      <p>Complete fast-track accreditation onboarding to view comprehensive telemetry data rooms and underwrite live tours.</p>
                    </>
                  )}
                </div>
              </div>
              <div className="tours-vc-status-actions">
                <button 
                  onClick={() => setVcOnboardModalOpen(true)}
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '12px', background: '#10b981', color: '#fff', borderColor: '#10b981' }}
                >
                  {onboardedInvestor ? 'Update LP Profile' : 'Start VC Onboarding'}
                </button>
                <button 
                  onClick={() => { setDocsTab('vc'); setDocsModalOpen(true); }}
                  className="btn-secondary" 
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  Underwriting FAQ
                </button>
              </div>
            </div>

            {/* UNDERWRITING OPPORTUNITIES CAROUSEL WITH SIDE ARROWS */}
            <div className="tours-carousel-container">
              <div className="tours-carousel-header">
                <div>
                  <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0', fontFamily: 'Sansation, sans-serif' }}>
                    Current Tour Underwriting Opportunities in the Vault
                  </h4>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                    Active syndicated tour deals open for capital allocation and LP underwriting.
                  </span>
                </div>
                <div className="tours-carousel-counter">
                  <span>Opportunity</span>
                  <span className="active-num">{carouselIndex + 1}</span>
                  <span>of {opportunities.length || 5}</span>
                </div>
              </div>

              {/* Viewport with Side Arrows */}
              <div className="tours-carousel-viewport">
                <button 
                  className="tours-carousel-side-arrow prev"
                  onClick={handlePrevSlide}
                  title="Previous Tour Opportunity"
                  aria-label="Previous Slide"
                >
                  <RiArrowLeftSLine size={24} />
                </button>

                <div className="tours-carousel-track-wrapper">
                  <div 
                    className="tours-carousel-track"
                    style={{ transform: `translateX(-${carouselIndex * 50}%)` }}
                  >
                    {opportunities.map((deal, idx) => {
                      const goal = deal.underwriting_goal || 50000;
                      const funded = deal.funded_amount || 0;
                      const pct = Math.min(100, Math.round((funded / goal) * 100));

                      return (
                        <div key={deal.id || idx} className="tours-carousel-card">
                          <div className="tours-carousel-card-top">
                            <div className="tours-card-head-row">
                              <div>
                                <h4 className="tours-card-artist-title">{deal.artist}</h4>
                                <div className="tours-card-origin-route">
                                  <RiCompass3Fill size={14} />
                                  <span>{deal.route}</span>
                                </div>
                              </div>
                              <span className="tours-card-genre-pill">{deal.genre}</span>
                            </div>

                            {/* Route Stops Badges */}
                            {deal.route_stops && (
                              <div className="tours-card-stops-row">
                                {deal.route_stops.slice(0, 4).map((s, sIdx) => (
                                  <span key={sIdx} className="tours-card-stop-pill">
                                    {s.city.split(',')[0]} ({s.date})
                                  </span>
                                ))}
                                {deal.route_stops.length > 4 && (
                                  <span className="tours-card-stop-pill" style={{ color: '#10b981' }}>
                                    +{deal.route_stops.length - 4} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Funding Progress Bar */}
                            <div className="tours-funding-progress-box">
                              <div className="tours-funding-stat-row">
                                <span className="tours-funding-raised">
                                  {formatMoney(funded)} <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: 500 }}>of {formatMoney(goal)}</span>
                                </span>
                                <span className="tours-funding-pct">{pct}% Allocated</span>
                              </div>
                              <div className="tours-progress-track">
                                <div className="tours-progress-fill" style={{ width: `${pct}%` }}></div>
                              </div>
                            </div>

                            {/* Underwriting Metrics Grid */}
                            <div className="tours-deal-metrics-row">
                              <div className="tours-deal-metric-item">
                                <span className="val" style={{ color: '#10b981' }}>{deal.investor_irr}</span>
                                <span className="lbl">Target Return</span>
                              </div>
                              <div className="tours-deal-metric-item">
                                <span className="val" style={{ color: 'var(--cyan)' }}>{deal.pre_sale_velocity}</span>
                                <span className="lbl">Pre-Sale Velocity</span>
                              </div>
                              <div className="tours-deal-metric-item">
                                <span className="val">{deal.recoupment_cap || '1.35x Cap'}</span>
                                <span className="lbl">Recoupment Cap</span>
                              </div>
                            </div>

                            {/* Telemetry Strip */}
                            <div className="tours-card-telemetry-strip">
                              <span><strong>Telemetry:</strong> {deal.telemetry?.tunestream_monthly_listeners ? `${(deal.telemetry.tunestream_monthly_listeners / 1000).toFixed(0)}k DSP Listeners` : deal.fan_density}</span>
                              <span><strong>Waitlist:</strong> {deal.telemetry?.crm_waitlist_fans ? `${deal.telemetry.crm_waitlist_fans.toLocaleString()} Verified Fans` : '14,200 Fans'}</span>
                            </div>

                            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                              {deal.highlights}
                            </p>
                          </div>

                          {/* Card Action Buttons */}
                          <div className="tours-card-action-btns">
                            <button 
                              onClick={() => { setSelectedOpp(deal); setTelemetryModalOpen(true); }}
                              className="tours-btn-telemetry"
                            >
                              <RiRadarFill size={14} /> Telemetry Data Room
                            </button>
                            <button 
                              onClick={() => { 
                                setSelectedOpp(deal); 
                                if (!onboardedInvestor) {
                                  setVcOnboardModalOpen(true);
                                } else {
                                  setCommitModalOpen(true); 
                                }
                              }}
                              className="tours-btn-commit"
                            >
                              <RiMoneyDollarCircleLine size={15} /> Underwrite Advance
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  className="tours-carousel-side-arrow next"
                  onClick={handleNextSlide}
                  title="Next Tour Opportunity"
                  aria-label="Next Slide"
                >
                  <RiArrowRightSLine size={24} />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="tours-carousel-dots">
                {opportunities.map((_, idx) => (
                  <button 
                    key={idx} 
                    className={`tours-carousel-dot ${carouselIndex === idx ? 'active' : ''}`}
                    onClick={() => setCarouselIndex(idx)}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Recoupment Waterfall Blueprint */}
            <div style={{ marginTop: '48px', background: '#060914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <RiStackFill size={20} color="#10b981" />
                <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                  The Split Cascade Recoupment Architecture
                </h4>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '20px' }}>
                TuneMavens eliminates traditional music industry collection delays. All digital and box office ticket revenue collected via our integrated ticketing system and TunePay POS terminals flows programmatically through pre-compiled smart contract waterfall rules.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', borderLeft: '3px solid #10b981' }}>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>TIER 1 (SENIOR SECURED)</span>
                  <h5 style={{ color: '#fff', fontSize: '14px', margin: '4px 0 6px 0' }}>100% First-Dollar Recoupment</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Investor advance principal + preferred return is recouped first from all ticket and merch gross.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', borderLeft: '3px solid var(--cyan)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800 }}>TIER 2 (DIRECT PRODUCTION)</span>
                  <h5 style={{ color: '#fff', fontSize: '14px', margin: '4px 0 6px 0' }}>Promoter &amp; Venue Settle</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Direct hall rentals, backline sound reinforcement, and lighting engineers settled programmatically.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', borderLeft: '3px solid #8b5cf6' }}>
                  <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 800 }}>TIER 3 (CREATOR NET PROFIT)</span>
                  <h5 style={{ color: '#fff', fontSize: '14px', margin: '4px 0 6px 0' }}>Artist &amp; Band Profit Split</h5>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                    Net profit split distributed instantly to the artist, session musicians, and touring road crew.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: ARTIST TOUR INCUBATION (Kenya-to-the-World Blueprint)
            ------------------------------------------------------------- */}
        {activeTab === 'incubation' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid #8b5cf6' }}>
            <span className="tours-section-tag" style={{ color: '#8b5cf6' }}>Kenya to the World A Complete Incubation &amp; Production</span>
            <h3 className="tours-section-title">The 6-Phase Artist Tour Incubation Framework</h3>
            <p className="tours-section-p">
              Whether you are an emerging electronic producer from Nairobi, a live Afro-rock ensemble from the Rift Valley, or a soul singer from Mombasa, TuneMavens provides the comprehensive operational, PR, and non-dilutive capital infrastructure to take your sound across global stages.
            </p>

            <div className="tours-timeline-grid">
              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 01</span>
                <h4>Audience &amp; Fan Geo-Mapping</h4>
                <p>
                  We analyze streaming density, playlist listener concentration, and social conversion signals to design commercially viable tour corridors rather than speculative routes.
                </p>
              </div>

              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 02</span>
                <h4>Targeted PR &amp; Media Rollout</h4>
                <p>
                  Eight weeks prior to the first downbeat, our international publicists deploy targeted media campaigns across local radio plugging, music blogs, and cultural tastemaker press.
                </p>
              </div>

              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 03</span>
                <h4>Non-Dilutive Tour Underwriting</h4>
                <p>
                  We connect artists with our institutional tour venture capital network to secure upfront production advances without requiring artists to surrender master or publishing rights.
                </p>
              </div>

              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 04</span>
                <h4>Promoter &amp; Festival Booking Network</h4>
                <p>
                  We leverage deep booking relationships across North America, Europe, the UK, and Pan-Africa to secure premium venue holds, festival showcases, and co-headline slots.
                </p>
              </div>

              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 05</span>
                <h4>Workshops &amp; Studio Residencies</h4>
                <p>
                  Every tour itinerary embeds daytime creative masterclasses, modular synthesis clinics, and cross-pollinating recording sessions with top local producers and songwriters.
                </p>
              </div>

              <div className="tours-timeline-card">
                <span className="tours-timeline-number">Phase 06</span>
                <h4>Night-by-Night Automated Settle</h4>
                <p>
                  Door receipts and merch desk sales via TunePay POS flow automatically through the Split Cascade Ledger, settling promoter advances, backline, and band splits in real-time.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '36px', textAlign: 'center' }}>
              <button 
                onClick={() => setPitchModalOpen(true)}
                className="btn-primary" 
                style={{ padding: '12px 28px', fontSize: '13.5px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
              >
                Submit Artist Tour Proposal <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: MASTERCLASSES & CREATIVE RESIDENCIES
            ------------------------------------------------------------- */}
        {activeTab === 'workshops' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid #f59e0b' }}>
            <span className="tours-section-tag" style={{ color: '#f59e0b' }}>Community Enrichment A Creative Residencies</span>
            <h3 className="tours-section-title">Masterclasses, Production Clinics &amp; Songwriting Residencies</h3>
            <p className="tours-section-p">
              A tour is more than just evening concerts. TuneMavens embeds structured creative sessions, youth masterclasses, and cross-pollinating recording camps into every tour itinerary. Touring artists generate supplementary high-margin revenue while building deep, lasting artistic roots with local music ecosystems.
            </p>

            <div className="tours-workshops-grid">
              <div className="tours-workshop-card">
                <span className="tag">Hardware &amp; DAW Production</span>
                <h4>Modular Synthesis &amp; Electronic Sound Design Clinics</h4>
                <p>
                  Conducted in local creative maker spaces and studios. Touring electronic artists demo patch architecture, hybrid analog-digital workflows, and live stem improvisation for local producers.
                </p>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                  <RiTicket2Fill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Integrated Masterclass Ticket Tiers via TunePay
                </div>
              </div>

              <div className="tours-workshop-card">
                <span className="tag">Collaborative Songwriting</span>
                <h4>Cross-Continental Co-Writing &amp; Stem Camps</h4>
                <p>
                  Connecting touring acts with top-tier local songwriters, topliners, and traditional acoustic instrumentalists. All stems recorded during tour layovers are logged instantly into the Catalogue Machine.
                </p>
                <div style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 700 }}>
                  <RiBarChartFill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Direct Catalogue Ingestion &amp; Split Attribution
                </div>
              </div>

              <div className="tours-workshop-card">
                <span className="tag">Music Business &amp; Rights</span>
                <h4>Music IP, Publishing &amp; Sync Seminars</h4>
                <p>
                  Educating emerging artists in each tour stop city on song split hygiene, PRO/CMO registration, neighbour rights, and sync placement strategies across television and film.
                </p>
                <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 700 }}>
                  <RiAwardFill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Certified Education Modules
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: INTEGRATED ECOSYSTEM TECH STACK
            ------------------------------------------------------------- */}
        {activeTab === 'tech-stack' && (
          <div className="tours-feature-section" style={{ borderLeft: '3px solid var(--cyan)' }}>
            <span className="tours-section-tag">Seamless Infrastructure A Single Source of Truth</span>
            <h3 className="tours-section-title">The Integrated Live Touring Tech Stack</h3>
            <p className="tours-section-p">
              Every dimension of a TuneMavens tour connects natively into the core standalone dashboard applications. From merchandise checkout to programmatic investor waterfall distribution, no external spreadsheets or reconciliation delays are required.
            </p>

            <div className="tours-tech-grid">
              <div className="tours-tech-card">
                <div>
                  <div className="tours-tech-card-icon"><RiBankCardFill /></div>
                  <h4>TunePay Mobile POS Terminal</h4>
                  <p>
                    Full point-of-sale terminal at every merch table. Accepts M-Pesa QR, contactless credit cards, and cash, with real-time inventory decrementing and live settlement.
                  </p>
                </div>
                <Link to="/dashboard?tab=pos-terminal&role=label" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  Open POS Terminal <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="tours-tech-card-icon" style={{ color: '#10b981' }}><RiTicket2Fill /></div>
                  <h4>Dynamic Event Ticketing</h4>
                  <p>
                    Multi-tier ticketing engine supporting General Admission, VIP Soundcheck, and Masterclass passes with dynamic price tiers and millisecond door scanner validation.
                  </p>
                </div>
                <Link to="/dashboard?tab=pos-inventory&role=label" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  Manage Event Tickets <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="tours-tech-card-icon" style={{ color: '#8b5cf6' }}><RiStackFill /></div>
                  <h4>Split Cascade Ledger</h4>
                  <p>
                    Programmatic smart contracts governing box office recoupment, investor preferred returns, booking agent commissions, and touring musician per-diems.
                  </p>
                </div>
                <Link to="/dashboard?tab=splits&role=creator" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  View Split Waterfall <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="tours-tech-card-icon" style={{ color: 'var(--cyan)' }}><RiRadarFill /></div>
                  <h4>Smart CRM Geo-Alerts</h4>
                  <p>
                    Audience intelligence engine that triggers automated SMS, WhatsApp, and email announcements to fans located within a 50-mile radius of tour venues.
                  </p>
                </div>
                <Link to="/dashboard?tab=crm&role=creator" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  Open Smart CRM <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Relationships & Network Grid */}
        <div className="tours-feature-section" style={{ background: '#060914' }}>
          <span className="tours-section-tag" style={{ color: '#94a3b8' }}>Industry Relationships &amp; Rolodex</span>
          <h3 className="tours-section-title">Worldwide Promoters, Venues &amp; Institutional Network</h3>
          <p className="tours-section-p">
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

        {/* Visual Live Tour Dashboard Mockup Preview */}
        <div style={{ textAlign: 'center', marginTop: '48px', marginBottom: '40px' }}>
          <img 
            src={tourDashboardMockup} 
            alt="TuneMavens Global Tour Command Center" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '3px', 
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
            }} 
          />
        </div>
      </div>

      {/* -------------------------------------------------------------
          MODAL 1: VC FAST-TRACK ONBOARDING & LP ACCREDITATION WIZARD
          ------------------------------------------------------------- */}
      {vcOnboardModalOpen && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card">
            <button className="tours-modal-close-btn" onClick={() => setVcOnboardModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <RiFundsBoxFill size={24} color="#10b981" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                Tour Venture Capital LP Onboarding &amp; Accreditation
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '22px' }}>
              Gain privileged access to our Tour Underwriting Vault, real-time fan telemetry data rooms, and senior-secured split allocations.
            </p>

            {/* 4-Step Wizard Indicator */}
            <div className="tours-wizard-steps">
              <div className={`tours-wizard-step ${vcStep === 1 ? 'active' : vcStep > 1 ? 'done' : ''}`}>
                <span className="tours-wizard-step-circle">{vcStep > 1 ? '✓' : '1'}</span>
                <span>LP Entity</span>
              </div>
              <div className={`tours-wizard-step ${vcStep === 2 ? 'active' : vcStep > 2 ? 'done' : ''}`}>
                <span className="tours-wizard-step-circle">{vcStep > 2 ? '✓' : '2'}</span>
                <span>Accreditation</span>
              </div>
              <div className={`tours-wizard-step ${vcStep === 3 ? 'active' : vcStep > 3 ? 'done' : ''}`}>
                <span className="tours-wizard-step-circle">{vcStep > 3 ? '✓' : '3'}</span>
                <span>Mandate</span>
              </div>
              <div className={`tours-wizard-step ${vcStep === 4 ? 'active' : ''}`}>
                <span className="tours-wizard-step-circle">4</span>
                <span>Payout Wallet</span>
              </div>
            </div>

            <form onSubmit={handleVcOnboardSubmit}>
              {vcStep === 1 && (
                <div>
                  <div className="tours-form-group">
                    <label>Full Name / Principal Lead *</label>
                    <input 
                      type="text" 
                      required
                      value={vcForm.name} 
                      onChange={e => setVcForm({...vcForm, name: e.target.value})}
                      placeholder="e.g. Elena Vance"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Institutional Work Email *</label>
                    <input 
                      type="email" 
                      required
                      value={vcForm.email} 
                      onChange={e => setVcForm({...vcForm, email: e.target.value})}
                      placeholder="e.g. elena@africacreativefund.vc"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Entity Name / Syndicate *</label>
                    <input 
                      type="text" 
                      required
                      value={vcForm.entity_name} 
                      onChange={e => setVcForm({...vcForm, entity_name: e.target.value})}
                      placeholder="e.g. Africa Creative Capital Syndicate"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Investor Type</label>
                    <select 
                      value={vcForm.investor_type} 
                      onChange={e => setVcForm({...vcForm, investor_type: e.target.value})}
                    >
                      <option value="venture_fund">Venture Capital / Growth Equity Fund</option>
                      <option value="accredited_angel">Individual Accredited Angel</option>
                      <option value="family_office">Single / Multi-Family Office</option>
                      <option value="music_syndicate">Music Investment Syndicate</option>
                      <option value="corporate">Corporate Brand Sponsor</option>
                    </select>
                  </div>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '10px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                    onClick={() => setVcStep(2)}
                  >
                    Next: Accreditation Verification <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              )}

              {vcStep === 2 && (
                <div>
                  <div className="tours-form-group">
                    <label>Accredited Investor Attestation</label>
                    <select 
                      value={vcForm.accreditation_status} 
                      onChange={e => setVcForm({...vcForm, accreditation_status: e.target.value})}
                    >
                      <option value="verified_accredited">Accredited Investor (Rule 506(c) / $1M+ Net Worth)</option>
                      <option value="qualified_purchaser">Qualified Purchaser ($5M+ Investable Assets)</option>
                      <option value="institutional_fund">Registered Institutional / Regulated Fund</option>
                      <option value="international_hnw">International High-Net-Worth / Professional Client</option>
                    </select>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
                    <RiShieldCheckFill color="#10b981" size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    By proceeding, you attest that you meet the regulatory criteria for alternative tour asset participation. TuneMavens conducts KYC/AML verification prior to capital deployment.
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setVcStep(1)}>Back</button>
                    <button type="button" className="btn-primary" style={{ flex: 2, background: '#10b981', borderColor: '#10b981', color: '#fff' }} onClick={() => setVcStep(3)}>
                      Next: Allocation Mandate
                    </button>
                  </div>
                </div>
              )}

              {vcStep === 3 && (
                <div>
                  <div className="tours-form-group">
                    <label>Typical Advance Allocation Check Size</label>
                    <select 
                      value={vcForm.check_size_range} 
                      onChange={e => setVcForm({...vcForm, check_size_range: e.target.value})}
                    >
                      <option value="$5,000 - $25,000">$5,000 - $25,000 (Micro Syndicate Allocation)</option>
                      <option value="$25,000 - $100,000">$25,000 - $100,000 (Standard Tour Co-Underwriting)</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000 (Lead Syndicate Underwriter)</option>
                      <option value="$500,000+">$500,000+ (Institutional Tour Portfolio Facility)</option>
                    </select>
                  </div>
                  <div className="tours-form-group">
                    <label>Target Tour Geographic Corridors</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 400 }}>
                        <input type="checkbox" defaultChecked /> Pan-African Highway
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 400 }}>
                        <input type="checkbox" defaultChecked /> Western Europe &amp; UK
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 400 }}>
                        <input type="checkbox" defaultChecked /> North American Circuit
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 400 }}>
                        <input type="checkbox" defaultChecked /> East Asia &amp; Japan
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setVcStep(2)}>Back</button>
                    <button type="button" className="btn-primary" style={{ flex: 2, background: '#10b981', borderColor: '#10b981', color: '#fff' }} onClick={() => setVcStep(4)}>
                      Next: Recoupment Destination
                    </button>
                  </div>
                </div>
              )}

              {vcStep === 4 && (
                <div>
                  <div className="tours-form-group">
                    <label>Preferred Recoupment Settlement Mechanism</label>
                    <select 
                      value={vcForm.payout_preference} 
                      onChange={e => setVcForm({...vcForm, payout_preference: e.target.value})}
                    >
                      <option value="split_cascade_wallet">Split Cascade Smart Contract Wallet (Instant Payouts)</option>
                      <option value="wire_swift">Institutional Bank Wire (USD / EUR / GBP)</option>
                      <option value="mpesa_till">M-Pesa Business Till / Paybill (East Africa)</option>
                    </select>
                  </div>
                  <div className="tours-form-group">
                    <label>Wallet Address or Bank Routing</label>
                    <input 
                      type="text" 
                      value={vcForm.wallet_or_account} 
                      onChange={e => setVcForm({...vcForm, wallet_or_account: e.target.value})}
                      placeholder="e.g. tm_split_0x9a84... or Bank Account IBAN"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setVcStep(3)}>Back</button>
                    <button 
                      type="submit" 
                      disabled={vcSubmitting}
                      className="btn-primary" 
                      style={{ flex: 2, background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                    >
                      {vcSubmitting ? 'Verifying & Onboarding...' : 'Complete Onboarding & Unlock Vault'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 2: TELEMETRY DUE DILIGENCE DATA ROOM
          ------------------------------------------------------------- */}
      {telemetryModalOpen && selectedOpp && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card" style={{ maxWidth: '780px' }}>
            <button className="tours-modal-close-btn" onClick={() => setTelemetryModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  VERIFIED AUDIENCE TELEMETRY &amp; DATA ROOM
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0', fontFamily: 'Sansation, sans-serif' }}>
                  {selectedOpp.artist}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--cyan)' }}>{selectedOpp.route}</span>
              </div>
              <span className="tours-card-genre-pill">{selectedOpp.genre}</span>
            </div>

            {/* Financial Telemetry Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Monthly Listeners</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                  {selectedOpp.telemetry?.tunestream_monthly_listeners ? `${(selectedOpp.telemetry.tunestream_monthly_listeners / 1000).toFixed(0)}k` : '480k'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>CRM Pre-Sale Waitlist</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--cyan)' }}>
                  {selectedOpp.telemetry?.crm_waitlist_fans ? selectedOpp.telemetry.crm_waitlist_fans.toLocaleString() : '14,250'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Target Return (IRR)</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{selectedOpp.investor_irr}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Recoupment Horizon</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                  {selectedOpp.telemetry?.recoupment_timeline_days ? `${selectedOpp.telemetry.recoupment_timeline_days} Days` : '45 Days'}
                </span>
              </div>
            </div>

            {/* Confirmed Tour Stops Table */}
            <h5 style={{ fontSize: '14.5px', color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Confirmed Itinerary &amp; Venue Capacity
            </h5>
            <table className="tours-telemetry-table">
              <thead>
                <tr>
                  <th>City &amp; Country</th>
                  <th>Venue Partner</th>
                  <th>Capacity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedOpp.route_stops?.map((stop, sIdx) => (
                  <tr key={sIdx}>
                    <td><strong style={{ color: '#fff' }}>{stop.city}</strong></td>
                    <td>{stop.venue}</td>
                    <td><span style={{ color: 'var(--cyan)' }}>{stop.capacity.toLocaleString()} cap</span></td>
                    <td>{stop.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Projected Waterfall & Downside Protection */}
            <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '3px', marginTop: '16px', marginBottom: '22px' }}>
              <h5 style={{ color: '#10b981', fontSize: '13.5px', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RiShieldCheckFill /> Senior Secured Split Cascade Terms
              </h5>
              <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {selectedOpp.telemetry?.waterfall_priority || 'Tier 1: Senior Advance Recoupment. 100% of door and merch receipts flow directly to LP investors until 1.35x advance cap is met.'} All dates insured against non-appearance and force majeure with syndicate named as sole loss payee.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setTelemetryModalOpen(false)}
                className="btn-secondary" 
                style={{ flex: 1, padding: '10px' }}
              >
                Close Data Room
              </button>
              <button 
                onClick={() => {
                  setTelemetryModalOpen(false);
                  if (!onboardedInvestor) {
                    setVcOnboardModalOpen(true);
                  } else {
                    setCommitModalOpen(true);
                  }
                }}
                className="btn-primary" 
                style={{ flex: 2, background: '#10b981', borderColor: '#10b981', color: '#fff', padding: '10px' }}
              >
                Proceed to Underwriting Allocation <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 3: CAPITAL COMMITMENT & ALLOCATION
          ------------------------------------------------------------- */}
      {commitModalOpen && selectedOpp && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card">
            <button className="tours-modal-close-btn" onClick={() => { setCommitModalOpen(false); setCommitSuccessReceipt(null); }}>
              <RiCloseLine size={20} />
            </button>

            {commitSuccessReceipt ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '28px' }}>
                  <RiCheckDoubleFill />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px', fontFamily: 'Sansation, sans-serif' }}>
                  Commitment Successfully Allocated!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px auto' }}>
                  {commitSuccessReceipt.message}
                </p>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', fontSize: '12px', color: '#cbd5e1', textAlign: 'left', marginBottom: '24px' }}>
                  <div><strong>Commitment Ref:</strong> {commitSuccessReceipt.commitment?.commitment_id}</div>
                  <div><strong>Artist / Tour:</strong> {selectedOpp.artist}</div>
                  <div><strong>Recoupment Waterfall:</strong> Senior Secured Tier 1 (Split Cascade)</div>
                </div>
                <button 
                  onClick={() => { setCommitModalOpen(false); setCommitSuccessReceipt(null); }}
                  className="btn-primary" 
                  style={{ width: '100%', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
                >
                  Return to Underwriting Vault
                </button>
              </div>
            ) : (
              <div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                  CAPITAL ALLOCATION ORDER
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '4px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
                  Underwrite: {selectedOpp.artist}
                </h3>

                <form onSubmit={handleCommitSubmit}>
                  {/* Preset Check Size Buttons */}
                  <div className="tours-form-group">
                    <label>Select Allocation Amount (USD)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '10px' }}>
                      {[2500, 5000, 10000, 25000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCommitAmount(val)}
                          style={{
                            background: commitAmount === val ? '#10b981' : 'rgba(255,255,255,0.04)',
                            color: commitAmount === val ? '#fff' : '#cbd5e1',
                            border: `1px solid ${commitAmount === val ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                            padding: '8px',
                            borderRadius: '3px',
                            fontWeight: 700,
                            fontSize: '12.5px',
                            cursor: 'pointer'
                          }}
                        >
                          ${val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="number" 
                      min="1000"
                      step="500"
                      value={commitAmount} 
                      onChange={e => setCommitAmount(Number(e.target.value))}
                      placeholder="Custom Amount"
                    />
                  </div>

                  {/* Dynamic Projected Return Calculation */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '3px', margin: '16px 0', fontSize: '12.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#94a3b8' }}>Target Return (IRR):</span>
                      <strong style={{ color: '#10b981' }}>{selectedOpp.investor_irr}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#94a3b8' }}>Projected Recoupment Cap (1.35x):</span>
                      <strong style={{ color: '#fff' }}>${(commitAmount * 1.35).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>Net Yield Gain:</span>
                      <strong style={{ color: 'var(--cyan)' }}>+${(commitAmount * 0.35).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="tours-form-group">
                    <label>Settlement Recoupment Wallet / Address</label>
                    <input 
                      type="text" 
                      readOnly
                      value={onboardedInvestor?.wallet_or_account || 'tm_split_cascade_wallet_0x9a84'} 
                      style={{ opacity: 0.8 }}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={commitSubmitting}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '12px', background: '#10b981', borderColor: '#10b981', color: '#fff', fontSize: '13px' }}
                  >
                    {commitSubmitting ? 'Confirming Ledger Allocation...' : `Confirm Commitment of $${commitAmount.toLocaleString()}`}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 4: ARTIST TOUR PITCH SUBMISSION
          ------------------------------------------------------------- */}
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
                    <label>Genre / Style</label>
                    <input 
                      type="text" 
                      value={pitchForm.genre} 
                      onChange={e => setPitchForm({...pitchForm, genre: e.target.value})}
                      placeholder="e.g. Afro-Electronic"
                    />
                  </div>
                  <div className="tours-form-group">
                    <label>Target Tour Corridor</label>
                    <input 
                      type="text" 
                      value={pitchForm.target_regions} 
                      onChange={e => setPitchForm({...pitchForm, target_regions: e.target.value})}
                      placeholder="e.g. UK & Europe (London, Berlin, Paris)"
                    />
                  </div>
                </div>

                <div className="tours-form-group">
                  <label>Estimated Production Advance Needed (USD)</label>
                  <input 
                    type="number" 
                    value={pitchForm.budget_request} 
                    onChange={e => setPitchForm({...pitchForm, budget_request: Number(e.target.value)})}
                    placeholder="e.g. 45000"
                  />
                </div>

                <div className="tours-form-group">
                  <label>EPK or Live Video Link</label>
                  <input 
                    type="url" 
                    value={pitchForm.epk_url} 
                    onChange={e => setPitchForm({...pitchForm, epk_url: e.target.value})}
                    placeholder="e.g. https://tunemavens.com/epk/ndufo"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={pitchSubmitting}
                  className="btn-primary" 
                  style={{ width: '100%', padding: '12px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
                >
                  {pitchSubmitting ? 'Submitting Pitch...' : 'Submit Tour Proposal for Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL 5: VC & ARTIST HANDBOOK / DOCUMENTATION MODAL
          ------------------------------------------------------------- */}
      {docsModalOpen && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card" style={{ maxWidth: '820px' }}>
            <button className="tours-modal-close-btn" onClick={() => setDocsModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <RiBookOpenFill size={24} color="var(--cyan)" />
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
                TuneMavens Global Tours &amp; Venture Underwriting Handbook
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <button 
                onClick={() => setDocsTab('vc')}
                style={{
                  background: docsTab === 'vc' ? '#10b981' : 'transparent',
                  color: docsTab === 'vc' ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '3px',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Venture Underwriting Guide &amp; FAQ
              </button>
              <button 
                onClick={() => setDocsTab('artist')}
                style={{
                  background: docsTab === 'artist' ? '#8b5cf6' : 'transparent',
                  color: docsTab === 'artist' ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '3px',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Artist Incubation Blueprint
              </button>
            </div>

            {docsTab === 'vc' ? (
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7, maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                <h4 style={{ color: '#fff', fontSize: '15px' }}>1. The Tour Venture Underwriting Thesis</h4>
                <p>
                  Live performance accounts for over 70% of artist gross earnings. TuneMavens transforms tour advances from speculative promoter promises into an evidence-underwritten asset class. Investors receive Senior Secured First-Dollar Recoupment on all ticket and merch revenue.
                </p>

                <h4 style={{ color: '#fff', fontSize: '15px', marginTop: '16px' }}>2. Recoupment Waterfall Mechanics</h4>
                <p>
                  Funds collected through TunePay and integrated ticketing do not sit in third-party escrow accounts for weeks. They settle within 24 hours into the Split Cascade Ledger, routing directly to the investor distribution wallet until the advance principal plus agreed preferred IRR return is satisfied.
                </p>

                <h4 style={{ color: '#fff', fontSize: '15px', marginTop: '16px' }}>3. Downside Protection</h4>
                <p>
                  All underwritten tours require cancellation and non-appearance insurance underwritten by accredited carriers. The LP syndicate is designated as primary loss payee in the event of force majeure or illness.
                </p>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.7, maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                <h4 style={{ color: '#fff', fontSize: '15px' }}>1. 100% Non-Dilutive Tour Advances</h4>
                <p>
                  Traditional 360-deals force artists to surrender their master recording or publishing copyrights in exchange for tour support. With TuneMavens Tour Incubation, you retain 100% ownership of your music. Advances are repaid exclusively from live box office receipts.
                </p>

                <h4 style={{ color: '#fff', fontSize: '15px', marginTop: '16px' }}>2. Masterclasses as Revenue Multipliers</h4>
                <p>
                  Every tour stop integrates daytime creative sessions, youth masterclasses, and songwriter camps. These generate high-margin auxiliary ticketing revenue while establishing deep artistic roots with local communities.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent Viewport Sticky Bottom Action Bar */}
      <div className="tours-sticky-cta-bar">
        <div className="tours-sticky-cta-inner">
          <div className="tours-sticky-cta-left">
            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>
              <RiGlobalFill size={15} style={{ display: 'inline', marginRight: '6px', color: 'var(--cyan)' }} />
              Taking Artists Anywhere to Everywhere
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Data-Underwritten VC • Integrated POS &amp; Split Cascade Settlement
            </span>
          </div>
          <div className="tours-sticky-cta-right">
            <button 
              onClick={() => setPitchModalOpen(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
            >
              <RiUserVoiceFill size={14} style={{ marginRight: '4px' }} /> Submit Tour Pitch
            </button>
            <button 
              onClick={() => {
                setActiveTab('vc-backing');
                if (!onboardedInvestor) {
                  setVcOnboardModalOpen(true);
                } else {
                  setCarouselIndex(0);
                }
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '12px', background: '#10b981', borderColor: '#10b981', color: '#fff' }}
            >
              <RiFundsBoxFill size={14} style={{ marginRight: '4px' }} />
              {onboardedInvestor ? 'View Vault Deals' : 'VC Onboarding & Vault'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
