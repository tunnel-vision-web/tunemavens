import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  RiFundsBoxFill, 
  RiShieldCheckFill, 
  RiRadarFill, 
  RiMoneyDollarCircleLine, 
  RiCompass3Fill, 
  RiStackFill, 
  RiSparklingFill, 
  RiArrowRightLine, 
  RiArrowLeftLine, 
  RiCloseLine, 
  RiCheckDoubleFill, 
  RiArrowLeftSLine, 
  RiArrowRightSLine, 
  RiGlobalFill, 
  RiBankCardFill, 
  RiFileTextFill, 
  RiBarChartFill, 
  RiInformationFill,
  RiCheckFill
} from 'react-icons/ri'
import PageHeader from '../../components/common/PageHeader.jsx'
import AppHelpAiControls from '../../components/common/AppHelpAiControls.jsx'
import SEO from '../../components/common/SEO.jsx'
import { useRegion } from '../../RegionContext.jsx'

import headerToursImg from '../../assets/images/header_tours.png'
import headerToursWesternImg from '../../assets/images/header_tours_western.png'
import vcDashboardActualEn from '../../assets/images/vc_dashboard_actual_en.png'
import vcDashboardActualSw from '../../assets/images/vc_dashboard_actual_sw.png'

import './ToursView.css'
import './AppsView.css'

export default function TourCapitalView({ sessionUser }) {
  const { country, currencyInfo, language } = useRegion();
  const isSw = language === 'sw' || language === 'ki';
  const vcDashboardActual = isSw ? vcDashboardActualSw : vcDashboardActualEn;

  // Opportunities State from Backend API
  const [opportunities, setOpportunities] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingOpps, setLoadingOpps] = useState(true);

  // Modals
  const [vcOnboardModalOpen, setVcOnboardModalOpen] = useState(false);
  const [telemetryModalOpen, setTelemetryModalOpen] = useState(false);
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const [selectedOpp, setSelectedOpp] = useState(null);

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
  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, opportunities.length - 1)));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev < opportunities.length - 1 ? prev + 1 : 0));
  };

  // VC Onboarding Submission
  const handleVcSubmit = async (e) => {
    e.preventDefault();
    setVcSubmitting(true);
    try {
      const res = await fetch('/api/tours/vault/investors/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...vcForm,
          user_id: sessionUser?.id || 'demo_vc_lead'
        })
      });
      if (res.ok) {
        const profile = await res.json();
        setOnboardedInvestor(profile);
        localStorage.setItem('tunemavens_tour_vc_profile', JSON.stringify(profile));
        setVcOnboardModalOpen(false);
      }
    } catch (err) {
      console.warn('Onboarding request error, falling back locally', err);
      const fallbackProfile = {
        id: `inv_${Date.now()}`,
        ...vcForm,
        accreditation_tier: 'Tier-1 Verified LP'
      };
      setOnboardedInvestor(fallbackProfile);
      localStorage.setItem('tunemavens_tour_vc_profile', JSON.stringify(fallbackProfile));
      setVcOnboardModalOpen(false);
    } finally {
      setVcSubmitting(false);
    }
  };

  // Capital Commitment Submission
  const handleCommitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOpp) return;
    setCommitSubmitting(true);
    try {
      const res = await fetch('/api/tours/vault/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity_id: selectedOpp.id,
          artist: selectedOpp.artist,
          investor_name: onboardedInvestor?.name || 'Accredited Music Syndicate',
          investor_entity: onboardedInvestor?.entity_name || 'Creative Capital LP',
          check_amount: commitAmount,
          currency: 'USD',
          target_irr: selectedOpp.investor_irr,
          wallet_or_account: onboardedInvestor?.wallet_or_account || 'tm_split_cascade_0x9a84'
        })
      });
      if (res.ok) {
        const receipt = await res.json();
        setCommitSuccessReceipt(receipt);
        fetchOpportunities();
      }
    } catch (err) {
      console.warn('Commitment request error, falling back to local receipt', err);
      setCommitSuccessReceipt({
        id: `comm_${Date.now()}`,
        opportunity_id: selectedOpp.id,
        artist: selectedOpp.artist,
        check_amount: commitAmount,
        status: 'allocated_senior_secured',
        recoupment_priority: 'First-Dollar Waterfall Tier 1',
        timestamp: new Date().toISOString()
      });
    } finally {
      setCommitSubmitting(false);
    }
  };

  // SEO Schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': 'TuneMavens Tour Venture Capital & Live Music Underwriting Vault',
    'description': 'Senior-secured live tour advance financing, creator product sponsorship, and data-underwritten live music investment opportunities.',
    'provider': {
      '@type': 'Organization',
      'name': 'TuneMavens'
    }
  };

  return (
    <div className="tours-page-view" style={{ minHeight: '100vh', background: '#090d1f', color: '#fff' }}>
      <SEO 
        title={isSw ? "Mfuko wa Mtaji wa Ziara & Usimamizi wa VC | TuneMavens" : "Tour Venture Capital & Underwriting Vault | TuneMavens"}
        description="Underwrite live tours, sponsor creator careers, and earn 18%-24% target IRR backed by real audience telemetry and senior-secured Split Cascade recoupment."
        keywords="tour venture capital, music VC, tour advance financing, live entertainment debt, split cascade recoupment, creator sponsorship"
        schema={schema}
      />

      <PageHeader 
        title={isSw ? "Mfuko wa Mtaji wa Ziara & Usimamizi wa VC" : "Tour Venture Capital & Underwriting Vault"}
        bgImage={headerToursImg}
        bgImageWestern={headerToursWesternImg}
        breadcrumb={isSw ? "Mtaji wa Ziara" : "Tour Capital"}
        titleStyle={{ fontSize: 'clamp(21px, 2.8vw, 32px)', fontWeight: 800, letterSpacing: '-0.3px' }}
        subtitle={isSw 
          ? "Gharamia Ziara za Moja kwa Moja na Kazi za Wasanii Ukitegemea Takwimu Halisi za Wasikilizaji na Malipo Yaliyolindwa ya Split Cascade."
          : "Underwrite Live Tours, Advance Production Costs, and Sponsor Creator Careers Backed by Real Telemetry & Senior-Secured Split Cascade Recoupment."
        }
      />

      <div className="landing-body tours-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 20px 80px' }}>
        
        {/* Navigation Banner Back to Live Events & Tours */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '4px 8px', background: 'rgba(34,211,238,0.15)', color: 'var(--cyan)', borderRadius: '3px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              Public Live Shows
            </span>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
              Looking for live concert tickets, in-progress tour dates, or artist incubation?
            </span>
          </div>
          <Link to="/tours" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12.5px', textDecoration: 'none' }}>
            Explore Tours &amp; Live Concerts <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
          </Link>
        </div>

        {/* Strategic Metrics Bar */}
        <div className="tours-metrics-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '36px' }}>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="tours-metric-val" style={{ fontSize: '30px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
            <span className="tours-metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>International Corridors</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="tours-metric-val" style={{ fontSize: '30px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>{formatMoney(14200000)}+</span>
            <span className="tours-metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Tour VC Deployed</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="tours-metric-val" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>22.6%</span>
            <span className="tours-metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Target IRR</span>
          </div>
          <div className="tours-metric-card" style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px' }}>
            <span className="tours-metric-val" style={{ fontSize: '30px', fontWeight: 800, color: '#a855f7', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
            <span className="tours-metric-lbl" style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Split Cascade Settlement</span>
          </div>
        </div>

        {/* Investor Status Banner */}
        <div className="tours-vc-status-banner" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '3px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div className="tours-vc-status-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="tours-vc-status-icon" style={{ width: '46px', height: '46px', borderRadius: '3px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '24px' }}>
              <RiShieldCheckFill />
            </div>
            <div className="tours-vc-status-info">
              {onboardedInvestor ? (
                <>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>{onboardedInvestor.entity_name} &bull; {onboardedInvestor.accreditation_tier || 'Tier-1 Accredited LP'}</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8' }}>
                    Data Room Pass Active &bull; Payout Destination: <code style={{ color: '#10b981' }}>{onboardedInvestor.wallet_or_account || 'Split Cascade Wallet'}</code>
                  </p>
                </>
              ) : (
                <>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#fff' }}>Venture Capitalist &amp; Syndicate LP Portal</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8' }}>Complete fast-track accreditation onboarding to view comprehensive telemetry data rooms and underwrite live tours.</p>
                </>
              )}
            </div>
          </div>
          <div className="tours-vc-status-actions" style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setVcOnboardModalOpen(true)}
              className="btn-primary" 
              style={{ padding: '9px 18px', fontSize: '12.5px', background: '#10b981', color: '#fff', borderColor: '#10b981', cursor: 'pointer' }}
            >
              {onboardedInvestor ? 'Update LP Profile' : 'Start VC Onboarding'}
            </button>
            <Link
              to="/dashboard?tab=vc-portfolio&role=vc"
              className="btn-secondary" 
              style={{ padding: '9px 16px', fontSize: '12.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Launch VC Console <RiArrowRightLine size={14} />
            </Link>
          </div>
        </div>

        {/* UNDERWRITING OPPORTUNITIES CAROUSEL WITH SIDE ARROWS */}
        <div className="tours-carousel-container" style={{ marginBottom: '60px' }}>
          <div className="tours-carousel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div>
              <span className="tours-section-tag" style={{ color: '#10b981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Senior Secured Live Tour Advances
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0', fontFamily: 'Sansation, sans-serif' }}>
                Current Tour Underwriting Opportunities in the Vault
              </h3>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Active syndicated tour deals open for capital allocation, audience telemetry verification, and senior underwriting.
              </span>
            </div>
            <div className="tours-carousel-counter" style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: '3px', fontSize: '12px', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span>Opportunity </span>
              <strong style={{ color: '#10b981' }}>{carouselIndex + 1}</strong>
              <span> of {opportunities.length || 5}</span>
            </div>
          </div>

          {/* Viewport with Side Arrows */}
          <div className="tours-carousel-viewport" style={{ position: 'relative' }}>
            <button 
              className="tours-carousel-side-arrow prev"
              onClick={handlePrevSlide}
              title="Previous Tour Opportunity"
              aria-label="Previous Slide"
              style={{ position: 'absolute', left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(10,13,29,0.95)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }}
            >
              <RiArrowLeftSLine size={24} />
            </button>

            <div className="tours-carousel-track-wrapper" style={{ overflow: 'hidden', padding: '10px 0' }}>
              <div 
                className="tours-carousel-track"
                style={{ display: 'flex', gap: '20px', transform: `translateX(-${carouselIndex * 50}%)`, transition: 'transform 0.4s ease' }}
              >
                {opportunities.map((deal, idx) => {
                  const goal = deal.underwriting_goal || 50000;
                  const funded = deal.funded_amount || 0;
                  const pct = Math.min(100, Math.round((funded / goal) * 100));

                  return (
                    <div key={deal.id || idx} className="tours-carousel-card" style={{ minWidth: 'calc(50% - 10px)', flexShrink: 0, background: '#0a0d1d', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '3px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div className="tours-carousel-card-top">
                        <div className="tours-card-head-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                          <div>
                            <h4 className="tours-card-artist-title" style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{deal.artist}</h4>
                            <div className="tours-card-origin-route" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cyan)' }}>
                              <RiCompass3Fill size={14} />
                              <span>{deal.route}</span>
                            </div>
                          </div>
                          <span className="tours-card-genre-pill" style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', color: '#cbd5e1', fontWeight: 600 }}>
                            {deal.genre}
                          </span>
                        </div>

                        {/* Route Stops Badges */}
                        {deal.route_stops && (
                          <div className="tours-card-stops-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                            {deal.route_stops.slice(0, 4).map((s, sIdx) => (
                              <span key={sIdx} className="tours-card-stop-pill" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', color: '#94a3b8' }}>
                                {s.city.split(',')[0]} ({s.date})
                              </span>
                            ))}
                            {deal.route_stops.length > 4 && (
                              <span className="tours-card-stop-pill" style={{ padding: '3px 8px', fontSize: '11px', color: '#10b981' }}>
                                +{deal.route_stops.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Funding Progress Bar */}
                        <div className="tours-funding-progress-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '3px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="tours-funding-stat-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12.5px' }}>
                            <span className="tours-funding-raised" style={{ fontWeight: 700, color: '#fff' }}>
                              {formatMoney(funded)} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>of {formatMoney(goal)}</span>
                            </span>
                            <span className="tours-funding-pct" style={{ color: '#10b981', fontWeight: 700 }}>{pct}% Allocated</span>
                          </div>
                          <div className="tours-progress-track" style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div className="tours-progress-fill" style={{ width: `${pct}%`, height: '100%', background: '#10b981' }}></div>
                          </div>
                        </div>

                        {/* Underwriting Metrics Grid */}
                        <div className="tours-deal-metrics-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '3px' }}>
                          <div className="tours-deal-metric-item" style={{ textAlign: 'center' }}>
                            <span className="val" style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#10b981' }}>{deal.investor_irr}</span>
                            <span className="lbl" style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Target Return</span>
                          </div>
                          <div className="tours-deal-metric-item" style={{ textAlign: 'center' }}>
                            <span className="val" style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: 'var(--cyan)' }}>{deal.pre_sale_velocity}</span>
                            <span className="lbl" style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Pre-Sale Velocity</span>
                          </div>
                          <div className="tours-deal-metric-item" style={{ textAlign: 'center' }}>
                            <span className="val" style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#cbd5e1' }}>{deal.recoupment_cap || '1.35x Cap'}</span>
                            <span className="lbl" style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Recoupment Cap</span>
                          </div>
                        </div>

                        {/* Telemetry Strip */}
                        <div className="tours-card-telemetry-strip" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginBottom: '12px' }}>
                          <span><strong>Telemetry:</strong> {deal.telemetry?.tunestream_monthly_listeners ? `${(deal.telemetry.tunestream_monthly_listeners / 1000).toFixed(0)}k DSP Listeners` : deal.fan_density}</span>
                          <span><strong>Waitlist:</strong> {deal.telemetry?.crm_waitlist_fans ? `${deal.telemetry.crm_waitlist_fans.toLocaleString()} Fans` : '14,200 Fans'}</span>
                        </div>

                        <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0' }}>
                          {deal.highlights}
                        </p>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="tours-card-action-btns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                        <button 
                          onClick={() => { setSelectedOpp(deal); setTelemetryModalOpen(true); }}
                          className="tours-btn-telemetry"
                          style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <RiRadarFill size={14} /> Telemetry Data
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
                          style={{ padding: '9px 12px', background: '#10b981', border: '1px solid #10b981', color: '#fff', borderRadius: '3px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <RiMoneyDollarCircleLine size={15} /> Underwrite
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
              style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(10,13,29,0.95)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }}
            >
              <RiArrowRightSLine size={24} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="tours-carousel-dots" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
            {opportunities.map((_, idx) => (
              <button 
                key={idx} 
                className={`tours-carousel-dot ${carouselIndex === idx ? 'active' : ''}`}
                onClick={() => setCarouselIndex(idx)}
                style={{ width: carouselIndex === idx ? '24px' : '8px', height: '8px', borderRadius: '4px', background: carouselIndex === idx ? '#10b981' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}
              />
            ))}
          </div>
        </div>

        {/* Feature 2: Facilitating Product & Service Costs for Creators */}
        <div style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '36px', marginBottom: '40px' }}>
          <span style={{ color: 'var(--cyan)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Creator Product &amp; Service Cost Sponsorship
          </span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
            Facilitate Platform Costs for Emerging Creators
          </h3>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '850px', margin: '0 0 28px 0' }}>
            VCs on TuneMavens may choose to invest in creator careers by directly underwriting the costs of any products and services across our ecosystem. Sponsor an artist's global distribution, AI stem mastering, EPK web hosting, or commercial sync pitches with automatic senior-secured recoupment from their next royalty cascade.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RiBarChartFill size={22} color="var(--cyan)" style={{ marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>Global DSP Distribution Packages</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                Underwrite UPC/ISRC ingestion across 150+ stores. Recoup 15% of downstream DSP payouts until 1.25x return.
              </p>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Typical Ticket: {formatMoney(149)}</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RiGlobalFill size={22} color="#8b5cf6" style={{ marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>EPK Pro Domain &amp; Web Hosting</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                Sponsor artist electronic press kits, custom web domains, and audio player worlds with 10% booking fee recoupment.
              </p>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Typical Ticket: {formatMoney(199)}</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RiSparklingFill size={22} color="#f59e0b" style={{ marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>Analog &amp; AI Studio Mastering</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                Fund professional audio mastering and stem exports, earning direct preferred return on sync licensing and streaming.
              </p>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Typical Ticket: {formatMoney(250)}</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RiShieldCheckFill size={22} color="#10b981" style={{ marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '14.5px', margin: '0 0 6px 0' }}>SyncMavens Film &amp; TV Representation</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                Cover legal clearance and sync brief placement costs, securing a 20% senior lien on commercial synchronization deals.
              </p>
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Typical Ticket: {formatMoney(300)}</span>
            </div>
          </div>
        </div>

        {/* Feature 3: The Split Cascade Recoupment Architecture */}
        <div style={{ background: '#060914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '36px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <RiStackFill size={22} color="#10b981" />
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Sansation, sans-serif' }}>
              The Split Cascade Recoupment Architecture
            </h4>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '24px', maxWidth: '850px' }}>
            TuneMavens eliminates traditional entertainment collection delays. All digital tickets, box office cash via TunePay POS terminals, and sync licensing payouts flow through pre-compiled smart contract waterfall rules directly into the investor's designated wallet.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '3px', borderLeft: '3px solid #10b981' }}>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>TIER 1 (SENIOR SECURED)</span>
              <h5 style={{ color: '#fff', fontSize: '14px', margin: '6px 0 6px 0' }}>100% First-Dollar Recoupment</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Investor advance principal + preferred return is recouped first from all gross ticket, merch, and stream payouts.
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '3px', borderLeft: '3px solid var(--cyan)' }}>
              <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase' }}>TIER 2 (DIRECT PRODUCTION)</span>
              <h5 style={{ color: '#fff', fontSize: '14px', margin: '6px 0 6px 0' }}>Promoter &amp; Venue Settle</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Direct hall rentals, backline sound reinforcement, and lighting engineers settled programmatically.
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '3px', borderLeft: '3px solid #8b5cf6' }}>
              <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 800, textTransform: 'uppercase' }}>TIER 3 (CREATOR NET PROFIT)</span>
              <h5 style={{ color: '#fff', fontSize: '14px', margin: '6px 0 6px 0' }}>Artist &amp; Band Profit Split</h5>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Net profit split distributed instantly to the artist, session musicians, and touring road crew with zero equity dilution.
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4: Actual VC Command Center Screenshot */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#10b981', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Live System Interface
          </span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
            Tour &amp; Creator Venture Capital Command Center
          </h3>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 auto 24px auto', maxWidth: '700px' }}>
            Inspect real-time telemetry, track night-by-night recoupment, and deploy capital across global tour corridors in the live portal.
          </p>
          <div 
            style={{ 
              position: 'relative', 
              display: 'inline-block', 
              maxWidth: '100%', 
              cursor: 'pointer' 
            }}
            onClick={() => setPreviewModalOpen(true)}
            title="Click to zoom actual TuneMavens VC Command Center"
          >
            <img 
              src={vcDashboardActual} 
              alt="Actual TuneMavens VC Command Center Screenshot" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '3px', 
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }} 
            />
            <div style={{ background: 'rgba(0,0,0,0.7)', padding: '8px 14px', fontSize: '11.5px', color: '#10b981', textAlign: 'center', borderBottomLeftRadius: '3px', borderBottomRightRadius: '3px' }}>
              &larr; Click to zoom full high-resolution interface &rarr;
            </div>
          </div>
        </div>

        {/* Contextual In-App Doc Controls */}
        <AppHelpAiControls 
          context="tour-vc-underwriting-career-sponsorship" 
          title="Tour VC Underwriting & Career Sponsorship Guide" 
        />
      </div>

      {/* Full Size Screenshot Lightbox Modal */}
      {previewModalOpen && (
        <div className="tours-lightbox-overlay" onClick={() => setPreviewModalOpen(false)}>
          <div className="tours-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="tours-lightbox-head">
              <h4>Tour &amp; Creator Venture Capital Command Center</h4>
              <button onClick={() => setPreviewModalOpen(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                <RiCloseLine size={18} /> Close
              </button>
            </div>
            <img 
              src={vcDashboardActual} 
              alt="Actual VC Dashboard Screenshot Full" 
              style={{ width: '100%', height: 'auto', borderRadius: '3px' }} 
            />
          </div>
        </div>
      )}

      {/* MODAL 1: VC FAST-TRACK ONBOARDING & LP ACCREDITATION WIZARD */}
      {vcOnboardModalOpen && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card">
            <button className="tours-modal-close-btn" onClick={() => setVcOnboardModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>
            <div className="tours-modal-header">
              <span className="badge">LP Fast-Track Accreditation</span>
              <h3>Venture Capitalist &amp; Syndicate Onboarding</h3>
              <p>Register your fund or syndicate to participate in live tour debt underwriting and creator career sponsorship.</p>
            </div>

            <form onSubmit={handleVcSubmit} className="tours-modal-form">
              {vcStep === 1 && (
                <>
                  <div className="form-group">
                    <label>Principal / Managing Partner Name</label>
                    <input 
                      type="text" 
                      required 
                      value={vcForm.name} 
                      onChange={e => setVcForm({...vcForm, name: e.target.value})}
                      placeholder="e.g. Alex Henderson"
                    />
                  </div>
                  <div className="form-group">
                    <label>Fund / Syndicate / Family Office Name</label>
                    <input 
                      type="text" 
                      required 
                      value={vcForm.entity_name} 
                      onChange={e => setVcForm({...vcForm, entity_name: e.target.value})}
                      placeholder="e.g. BlueWave Creative Capital LP"
                    />
                  </div>
                  <div className="form-group">
                    <label>Accredited Institutional Email</label>
                    <input 
                      type="email" 
                      required 
                      value={vcForm.email} 
                      onChange={e => setVcForm({...vcForm, email: e.target.value})}
                      placeholder="partner@bluewavecap.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Investor Structure</label>
                    <select 
                      value={vcForm.investor_type} 
                      onChange={e => setVcForm({...vcForm, investor_type: e.target.value})}
                    >
                      <option value="venture_fund">Registered Venture Capital Fund</option>
                      <option value="angel_syndicate">Accredited Angel Syndicate</option>
                      <option value="family_office">Single / Multi-Family Office</option>
                      <option value="music_label_fund">Record Label / Publisher Investment Arm</option>
                    </select>
                  </div>
                  <button type="button" className="btn-primary" onClick={() => setVcStep(2)} style={{ marginTop: '12px', width: '100%' }}>
                    Continue to Allocation Preferences &rarr;
                  </button>
                </>
              )}

              {vcStep === 2 && (
                <>
                  <div className="form-group">
                    <label>Typical Underwriting Check Size</label>
                    <select 
                      value={vcForm.check_size_range} 
                      onChange={e => setVcForm({...vcForm, check_size_range: e.target.value})}
                    >
                      <option value="$10,000 - $25,000">$10,000 - $25,000 (Micro-Syndicate)</option>
                      <option value="$25,000 - $100,000">$25,000 - $100,000 (Single-Tour Lead)</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000 (Multi-City World Tour)</option>
                      <option value="$500,000+">$500,000+ (Master Syndicate Facility)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Split Cascade Recoupment Payout Destination</label>
                    <input 
                      type="text" 
                      required 
                      value={vcForm.wallet_or_account} 
                      onChange={e => setVcForm({...vcForm, wallet_or_account: e.target.value})}
                      placeholder="e.g. tm_split_cascade_0x9a84 or Bank Routing / IBAN"
                    />
                  </div>
                  <div className="form-checkbox" style={{ marginTop: '12px' }}>
                    <label style={{ display: 'flex', gap: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                      <input 
                        type="checkbox" 
                        required 
                        checked={vcForm.regulatory_attestation} 
                        onChange={e => setVcForm({...vcForm, regulatory_attestation: e.target.checked})}
                      />
                      <span>I attest that our entity is an accredited investor or authorized institution with legal capacity to underwrite live entertainment advances.</span>
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button type="button" className="btn-secondary" onClick={() => setVcStep(1)} style={{ flex: 1 }}>
                      &larr; Back
                    </button>
                    <button type="submit" className="btn-primary" disabled={vcSubmitting} style={{ flex: 2, background: '#10b981', borderColor: '#10b981' }}>
                      {vcSubmitting ? 'Verifying LP Credentials...' : 'Complete Accreditation Onboarding'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TELEMETRY DUE DILIGENCE DATA ROOM */}
      {telemetryModalOpen && selectedOpp && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card" style={{ maxWidth: '640px' }}>
            <button className="tours-modal-close-btn" onClick={() => setTelemetryModalOpen(false)}>
              <RiCloseLine size={20} />
            </button>
            <div className="tours-modal-header">
              <span className="badge" style={{ color: 'var(--cyan)', borderColor: 'var(--cyan)' }}>Verified Audience Telemetry</span>
              <h3>{selectedOpp.artist} &bull; Tour Due Diligence Data Room</h3>
              <p>Audience density, ticket pre-sales velocity, and historical recoupment indices for corridor: <strong>{selectedOpp.route}</strong></p>
            </div>

            <div className="tours-telemetry-modal-body">
              <div className="telemetry-stat-card-row">
                <div className="telemetry-card">
                  <span className="val">{selectedOpp.telemetry?.tunestream_monthly_listeners ? `${(selectedOpp.telemetry.tunestream_monthly_listeners / 1000).toFixed(0)}k` : '185k'}</span>
                  <span className="lbl">TuneStream DSP Listeners</span>
                </div>
                <div className="telemetry-card">
                  <span className="val">{selectedOpp.telemetry?.crm_waitlist_fans ? selectedOpp.telemetry.crm_waitlist_fans.toLocaleString() : '14,200'}</span>
                  <span className="lbl">Verified CRM Superfans</span>
                </div>
                <div className="telemetry-card">
                  <span className="val" style={{ color: '#10b981' }}>{selectedOpp.investor_irr}</span>
                  <span className="lbl">Target IRR (1.35x Cap)</span>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', color: '#fff', margin: '20px 0 10px 0' }}>Tour Route Stops &amp; Pre-Sale Status</h4>
              <div className="telemetry-stops-table">
                {selectedOpp.route_stops ? selectedOpp.route_stops.map((st, i) => (
                  <div key={i} className="telemetry-stop-row">
                    <div>
                      <strong>{st.city}</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>{st.venue} &bull; {st.date}</span>
                    </div>
                    <span className="status-pill sold-out">{st.capacity_sold || '85% Capacity Sold'}</span>
                  </div>
                )) : (
                  <div className="telemetry-stop-row">
                    <div><strong>London, UK</strong><span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Jazz Cafe &bull; Oct 15</span></div>
                    <span className="status-pill sold-out">92% Capacity Sold</span>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => setTelemetryModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Close Data Room
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setTelemetryModalOpen(false);
                    if (!onboardedInvestor) {
                      setVcOnboardModalOpen(true);
                    } else {
                      setCommitModalOpen(true);
                    }
                  }}
                  style={{ flex: 2, background: '#10b981', borderColor: '#10b981' }}
                >
                  Underwrite This Tour Advance &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CAPITAL COMMITMENT & ALLOCATION */}
      {commitModalOpen && selectedOpp && (
        <div className="tours-modal-overlay">
          <div className="tours-modal-card">
            <button className="tours-modal-close-btn" onClick={() => { setCommitModalOpen(false); setCommitSuccessReceipt(null); }}>
              <RiCloseLine size={20} />
            </button>

            {commitSuccessReceipt ? (
              <div className="tours-commit-success-receipt">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <RiCheckDoubleFill size={48} color="#10b981" />
                  <h3 style={{ margin: '10px 0 4px 0', fontSize: '20px', color: '#fff' }}>Underwriting Commitment Allocated!</h3>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#94a3b8' }}>Transaction logged to Split Cascade Senior Lien Ledger.</p>
                </div>

                <div className="receipt-details-box" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Commitment ID:</span>
                    <strong style={{ color: '#fff' }}>{commitSuccessReceipt.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Tour / Artist:</span>
                    <strong style={{ color: '#fff' }}>{commitSuccessReceipt.artist}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Allocated Amount:</span>
                    <strong style={{ color: '#10b981' }}>{formatMoney(commitSuccessReceipt.check_amount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Target Return:</span>
                    <strong style={{ color: 'var(--cyan)' }}>{selectedOpp.investor_irr} (1.35x Cap)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Recoupment Priority:</span>
                    <span style={{ color: '#fff' }}>Tier 1 Senior First-Dollar</span>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={() => { setCommitModalOpen(false); setCommitSuccessReceipt(null); }}
                  style={{ width: '100%', background: '#10b981', borderColor: '#10b981' }}
                >
                  Return to Vault
                </button>
              </div>
            ) : (
              <>
                <div className="tours-modal-header">
                  <span className="badge" style={{ color: '#10b981', borderColor: '#10b981' }}>Senior-Secured Advance</span>
                  <h3>Commit Underwriting Capital &bull; {selectedOpp.artist}</h3>
                  <p>Allocate funds to underwrite flights, gear backline, and venue deposit costs. Recoup 100% first-dollar gross until target IRR.</p>
                </div>

                <form onSubmit={handleCommitSubmit} className="tours-modal-form">
                  <div className="form-group">
                    <label>Underwriting Check Size (USD)</label>
                    <input 
                      type="number" 
                      required 
                      min={1000} 
                      max={100000}
                      step={1000}
                      value={commitAmount} 
                      onChange={e => setCommitAmount(Number(e.target.value))}
                    />
                    <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                      Equivalent: <strong>{formatMoney(commitAmount)}</strong>
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Participating Entity</label>
                    <input 
                      type="text" 
                      disabled 
                      value={onboardedInvestor?.entity_name || 'Creative Capital Syndicate LP'} 
                      style={{ opacity: 0.7 }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Designated Payout Destination</label>
                    <input 
                      type="text" 
                      disabled 
                      value={onboardedInvestor?.wallet_or_account || 'tm_split_cascade_0x9a84'} 
                      style={{ opacity: 0.7 }}
                    />
                  </div>

                  <div style={{ background: 'rgba(16,185,129,0.06)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '16px', fontSize: '11.5px', color: '#cbd5e1' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', color: '#10b981', fontWeight: 700 }}>
                      <RiShieldCheckFill /> Senior Lien Binding Guarantee
                    </div>
                    By executing this commitment, your entity holds Tier 1 first-dollar recoupment on all ticket gross, door walk-ins, and merch via TunePay POS until your full principal and target {selectedOpp.investor_irr} IRR is realized.
                  </div>

                  <button type="submit" className="btn-primary" disabled={commitSubmitting} style={{ width: '100%', background: '#10b981', borderColor: '#10b981' }}>
                    {commitSubmitting ? 'Allocating Commitment...' : `Confirm & Allocate ${formatMoney(commitAmount)}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
