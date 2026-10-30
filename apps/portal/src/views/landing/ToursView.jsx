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
  RiEarthFill
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
  const [activeTab, setActiveTab] = useState(tabQuery || 'incubation'); // 'incubation' | 'vc-backing' | 'workshops' | 'tech-stack'

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t && t !== activeTab) {
      setActiveTab(t);
    }
  }, [location.search]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('artist'); // 'artist' | 'investor'
  const [submittedStatus, setSubmittedStatus] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'artist',
    originCity: 'Nairobi, Kenya',
    targetRegions: 'Europe (UK, DE, FR, NL)',
    budgetRequest: '$45,000',
    fanReach: '120,000+ monthly streams',
    investorTier: '$25,000 - $100,000',
    notes: ''
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedStatus(true);
    try {
      const existing = JSON.parse(localStorage.getItem('tunemavens_tour_proposals') || '[]');
      existing.push({ ...formData, mode: modalMode, timestamp: new Date().toISOString() });
      localStorage.setItem('tunemavens_tour_proposals', JSON.stringify(existing));
    } catch (_) {}
    setTimeout(() => {
      setSubmittedStatus(false);
      setModalOpen(false);
    }, 2800);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "TuneMavens Global Tours, Workshops & Live Venture Financing",
    "description": "End-to-end artist tour development, PR marketing rollout, non-dilutive tour venture financing backed by real fan data, masterclass workshops, and integrated live ticketing.",
    "provider": {
      "@type": "Organization",
      "name": "TuneMavens"
    }
  };

  // Curated Active Tour Underwriting Opportunities for VCs
  const activeTourOpportunities = [
    {
      id: 'tour-1',
      artist: 'Ndufo & The Modular Collective',
      origin: 'Nairobi, Kenya',
      route: 'Nairobi → London → Berlin → Paris → Amsterdam',
      genre: 'Afro-Electronic & Modular Synthesizer',
      underwritingGoal: '$55,000',
      fundedAmount: '$38,500 (70%)',
      investorIrr: '22.4% Target IRR',
      fanDensity: '164,000 Verified Streams',
      preSaleVelocity: '84% Pre-Sale Index',
      paybackTerms: 'First-Dollar Recoupment via Split Cascade Ledger',
      highlights: 'Headline club circuit + 3 masterclass modular workshops at Berlin Ableton Hub.'
    },
    {
      id: 'tour-2',
      artist: 'Aisha Mwangi Live Residency',
      origin: 'Mombasa / Nairobi, Kenya',
      route: 'Nairobi → Kigali → Lagos → Accra → Johannesburg',
      genre: 'Pan-African Soul & Contemporary R&B',
      underwritingGoal: '$40,000',
      fundedAmount: '$32,000 (80%)',
      investorIrr: '19.8% Target IRR',
      fanDensity: '210,000 Verified Streams',
      preSaleVelocity: '91% Pre-Sale Index',
      paybackTerms: 'Waterflow Recoupment with 15% Preferred Return',
      highlights: 'Acoustic theatre stops + 5 songwriter masterclasses with local youth conservatories.'
    },
    {
      id: 'tour-3',
      artist: 'Kip & The Mavens US Festival Circuit',
      origin: 'Rift Valley, Kenya',
      route: 'Austin (SXSW) → Chicago → New York → Toronto → Seattle',
      genre: 'Indie Afro-Rock & Live Backline',
      underwritingGoal: '$75,000',
      fundedAmount: '$52,500 (70%)',
      investorIrr: '24.2% Target IRR',
      fanDensity: '340,000 Verified Streams',
      preSaleVelocity: '88% Pre-Sale Index',
      paybackTerms: 'Split Cascade Priority Recoupment + 12% Merch Box Split',
      highlights: '7 festival stages, live studio co-writing sessions, and college radio broadcast tours.'
    }
  ];

  return (
    <>
      <SEO 
        title="Global Tours, Workshops & Live Venture Finance" 
        description="End-to-end artist tour development, PR marketing rollout, non-dilutive tour venture financing backed by real fan data, masterclass workshops, and integrated live ticketing."
        schema={schema}
      />
      <PageHeader 
        title="Global Tours, Masterclasses & Live Venture Finance" 
        bgImage={headerAppsImg} 
        bgImageWestern={headerAppsWesternImg} 
        breadcrumb="Tours & Live Operations" 
      />
      <AppHelpAiControls activeContext="tours" sessionUser={sessionUser} floating={true} />
      
      <div className="container tours-container">
        {/* Strategic Metric Cards Bar */}
        <div className="tours-metrics-bar">
          <div className="tours-metric-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
            <span className="metric-val">48+</span>
            <span className="metric-lbl">International Tour Corridors</span>
          </div>
          <div className="tours-metric-card" style={{ borderLeft: '3px solid #10b981' }}>
            <span className="metric-val">$14.2M+</span>
            <span className="metric-lbl">Tour Venture Capital Deployed</span>
          </div>
          <div className="tours-metric-card" style={{ borderLeft: '3px solid var(--cyan)' }}>
            <span className="metric-val">150+</span>
            <span className="metric-lbl">Masterclasses & Creative Sessions</span>
          </div>
          <div className="tours-metric-card" style={{ borderLeft: '3px solid #f59e0b' }}>
            <span className="metric-val">100%</span>
            <span className="metric-lbl">Automated Split Cascade Settlement</span>
          </div>
        </div>

        {/* Hero Strategic Overview Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center', marginBottom: '56px' }}>
          <div>
            <span className="tours-section-tag">
              Global Tour Development &amp; Artist Incubation
            </span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, color: '#fff', marginBottom: '18px', lineHeight: 1.2, fontFamily: 'Sansation, sans-serif' }}>
              Taking Artists from Anywhere in the World to Everywhere
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
              Launching an international tour should not be locked behind predatory multi-rights 360 label contracts. Whether you are an innovator from Nairobi, a band from London, a producer from Lagos, or a songwriter from Nashville, TuneMavens builds, finances, and executes end-to-end international tours.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '28px' }}>
              We orchestrate localized PR campaigns, secure non-dilutive underwriting from private venture capital backed by verified listener data, route venues through decades of industry promoter relationships, integrate educational masterclass clinics, and settle night-by-night splits through TunePay and the Split Cascade Ledger.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setModalMode('artist'); setModalOpen(true); }}
                className="btn-primary" 
                style={{ padding: '12px 24px', fontSize: '13px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
              >
                Propose an Artist Tour <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
              </button>
              <button 
                onClick={() => { 
                  setActiveTab('vc-backing');
                  const el = document.getElementById('tours-tabs-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary" 
                style={{ padding: '12px 22px', fontSize: '13px' }}
              >
                Explore Tour VC &amp; Live Backing
              </button>
            </div>
          </div>

          {/* Tour Operations Live Mockup Image */}
          <div className="glass-panel" style={{ padding: '10px', borderRadius: '3px', border: '1px solid rgba(139, 92, 246, 0.25)', overflow: 'hidden' }}>
            <img 
              src={tourDashboardMockup} 
              alt="TuneMavens Tour Dashboard Console" 
              style={{ width: '100%', borderRadius: '3px', display: 'block' }} 
            />
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div id="tours-tabs-anchor" className="tours-mode-tabs">
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'incubation' ? 'active' : ''}`}
            onClick={() => setActiveTab('incubation')}
          >
            <RiGlobalFill size={16} /> Artist Tour Incubation (Anywhere to World)
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'vc-backing' ? 'active' : ''}`}
            onClick={() => setActiveTab('vc-backing')}
          >
            <RiFundsBoxFill size={16} /> Tour Venture Capital (Audience Data Backed)
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'workshops' ? 'active' : ''}`}
            onClick={() => setActiveTab('workshops')}
          >
            <RiMicFill size={16} /> Masterclasses &amp; Creative Sessions
          </button>
          <button 
            className={`tours-mode-tab-btn ${activeTab === 'tech-stack' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech-stack')}
          >
            <RiStackFill size={16} /> Integrated Tech Stack (TunePay &amp; Splits)
          </button>
        </div>

        {/* TAB 1: Artist Tour Incubation Framework */}
        {activeTab === 'incubation' && (
          <div className="tours-feature-section">
            <span className="tours-section-tag">The 360° Tour Development Blueprint</span>
            <h3 className="tours-section-title">End-to-End Tour Incubation: From Kenya to the Global Stage</h3>
            <p className="tours-section-p">
              Consider an artist based in Kenya with surging streams across London, Berlin, and Paris. Traditional distributors leave artists to navigate foreign promoter visas, advance guarantees, venue deposits, and press representation completely unassisted. TuneMavens transforms raw streaming momentum into sold-out international concert corridors.
            </p>

            <div className="tours-workflow-grid">
              <div className="tours-workflow-step">
                <span className="step-number">PHASE 01</span>
                <div className="step-icon"><RiRadarFill size={20} /></div>
                <h4 className="step-title">Fan Geo-Mapping &amp; Route Design</h4>
                <p className="step-desc">
                  We cross-reference real audience density from TuneStream and Smart CRM fan geographic tags to pinpoint cities with proven ticket purchasing intent, optimizing travel routing to minimize road fatigue.
                </p>
              </div>

              <div className="tours-workflow-step">
                <span className="step-number">PHASE 02</span>
                <div className="step-icon"><RiUserVoiceFill size={20} /></div>
                <h4 className="step-title">PR, Media &amp; Local Market Rollout</h4>
                <p className="step-desc">
                  Six weeks prior to arrival, our international PR partners launch tailored radio servicing, editorial press interviews, local cultural podcast features, and geo-targeted social ad flights in tour cities.
                </p>
              </div>

              <div className="tours-workflow-step">
                <span className="step-number">PHASE 03</span>
                <div className="step-icon"><RiFundsBoxFill size={20} /></div>
                <h4 className="step-title">Non-Dilutive Tour Underwriting</h4>
                <p className="step-desc">
                  We secure production advances, airfare, backline rentals, and visa guarantees through our network of music venture capitalists—structured with transparent recoupment rather than copyright forfeiture.
                </p>
              </div>

              <div className="tours-workflow-step">
                <span className="step-number">PHASE 04</span>
                <div className="step-icon"><RiBuilding4Fill size={20} /></div>
                <h4 className="step-title">Promoter &amp; Festival Network</h4>
                <p className="step-desc">
                  We leverage deep, long-standing relationships with independent venue cooperatives, festival talent buyers, and cultural institutes to lock in guaranteed performance fees and ideal time slots.
                </p>
              </div>

              <div className="tours-workflow-step">
                <span className="step-number">PHASE 05</span>
                <div className="step-icon"><RiMicFill size={20} /></div>
                <h4 className="step-title">Workshops &amp; Studio Residencies</h4>
                <p className="step-desc">
                  Between tour dates, we book daytime hardware masterclasses, songwriting clinics with local music conservatories, and evening collaborative sessions with international co-writers and producers.
                </p>
              </div>

              <div className="tours-workflow-step">
                <span className="step-number">PHASE 06</span>
                <div className="step-icon"><RiMoneyDollarCircleLine size={20} /></div>
                <h4 className="step-title">Instant Night-by-Night Settle</h4>
                <p className="step-desc">
                  Merchandise sales via TunePay POS and digital ticket proceeds reconcile in real time. Backing investors, touring session musicians, and crew per-diems are disbursed automatically through the Split Cascade Ledger.
                </p>
              </div>
            </div>

            {/* Case Studies Banner */}
            <div style={{ marginTop: '36px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '17px', margin: '0 0 6px', fontWeight: 800 }}>Ready to plan your next international tour?</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Submit your artist profile, verified streaming links, and target routing to receive an end-to-end feasibility assessment.</p>
                </div>
                <button 
                  onClick={() => { setModalMode('artist'); setModalOpen(true); }}
                  className="btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '12px', background: '#8b5cf6' }}
                >
                  Submit Tour Proposal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Tour Venture Capital & Live Backing */}
        {activeTab === 'vc-backing' && (
          <div className="tours-feature-section">
            <span className="tours-section-tag">Real Audience Data · Predictable Recoupment</span>
            <h3 className="tours-section-title">Tour Venture Capital: Back Live Music Backed by Data, Not Guesswork</h3>
            <p className="tours-section-p">
              For venture capitalists, angel investors, family offices, and private equity music funds, live performance represents the most resilient and liquid revenue stream in the creative economy. However, traditional tour investments suffered from opaque promoter bookkeeping and speculative budgeting. TuneMavens allows investors to underwrite specific artist tours backed by real-time streaming velocity, Smart CRM pre-sale indexes, and cryptographic waterfall settlements.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '20px', borderRadius: '3px' }}>
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Audience Demand Verification</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px' }}>Real Streaming Telemetry</h4>
                <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
                  Every underwriting proposal includes 180-day stream acceleration, repeat listener retention, and city-level listener density from TuneStream and Spotify.
                </p>
              </div>

              <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '20px', borderRadius: '3px' }}>
                <span style={{ color: 'var(--cyan)', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Automated Settlement Priority</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px' }}>First-Dollar Split Recoupment</h4>
                <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
                  Box office ticketing and merch revenues route into the Split Cascade Ledger, executing principal repayment and target IRR return prior to net artist disbursement.
                </p>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '20px', borderRadius: '3px' }}>
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Full Data Room Due Diligence</span>
                <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 8px' }}>Complete Audit Trails</h4>
                <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0, lineHeight: 1.5 }}>
                  Investors receive direct read-only console access to door scans, merch inventory turnover, venue promoter contracts, and verified flight/hotel expense logs.
                </p>
              </div>
            </div>

            {/* Active Tour Opportunities Grid */}
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 16px', fontFamily: 'Sansation, sans-serif' }}>
              Current Tour Underwriting Opportunities in the Vault
            </h4>

            <div className="tours-deals-grid">
              {activeTourOpportunities.map((deal) => (
                <div key={deal.id} className="tours-deal-card">
                  <div>
                    <div className="tours-deal-header">
                      <div>
                        <h4 className="tours-deal-artist">{deal.artist}</h4>
                        <span className="tours-deal-route"><RiCompass3Fill size={13} style={{ display: 'inline', marginRight: '4px' }} />{deal.route}</span>
                      </div>
                      <span className="tours-deal-badge">{deal.genre}</span>
                    </div>

                    <div className="tours-deal-metrics-row">
                      <div className="tours-deal-metric-item">
                        <span className="val">{deal.underwritingGoal}</span>
                        <span className="lbl">Target Raise</span>
                      </div>
                      <div className="tours-deal-metric-item">
                        <span className="val" style={{ color: '#10b981' }}>{deal.investorIrr}</span>
                        <span className="lbl">Target Return</span>
                      </div>
                      <div className="tours-deal-metric-item">
                        <span className="val" style={{ color: 'var(--cyan)' }}>{deal.preSaleVelocity}</span>
                        <span className="lbl">Fan Demand</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {deal.highlights}
                    </p>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '3px', fontSize: '11.5px', color: '#cbd5e1', marginBottom: '20px' }}>
                      <strong style={{ color: '#fff' }}>Recoupment Structure:</strong> {deal.paybackTerms}
                    </div>
                  </div>

                  <button 
                    onClick={() => { setModalMode('investor'); setModalOpen(true); }}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '10px 16px', fontSize: '12.5px', background: '#10b981', color: '#fff' }}
                  >
                    Request Due Diligence Data Room <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Masterclasses & Creative Sessions */}
        {activeTab === 'workshops' && (
          <div className="tours-feature-section">
            <span className="tours-section-tag">Community Enrichment · Creative Residencies</span>
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
                  <RiStackFill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Automated 50/50 Split Sheet Registration
                </div>
              </div>

              <div className="tours-workshop-card">
                <span className="tag">Music Business Masterclasses</span>
                <h4>Independent IP Ownership &amp; Sync Licensing Seminars</h4>
                <p>
                  Empowering independent musicians with masterclasses on global royalty collection, PRO registration, direct EPK packaging, and pitching for international television and film placements on SyncMavens.
                </p>
                <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>
                  <RiAwardFill size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Verified Attendance Certificate &amp; Tool Credits
                </div>
              </div>
            </div>

            <div style={{ marginTop: '36px', padding: '24px', background: 'rgba(139,92,246,0.04)', borderRadius: '3px', border: '1px solid rgba(139,92,246,0.2)' }}>
              <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 8px' }}>
                Host or Attend a Workshop During the Next Tour Stop
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.6 }}>
                Whether you are a touring artist seeking studio booking slots or a local university/conservatory wishing to host our artists, get in touch to schedule creative sessions.
              </p>
              <button 
                onClick={() => { setModalMode('artist'); setModalOpen(true); }}
                className="btn-primary" 
                style={{ padding: '8px 18px', fontSize: '12px', background: '#8b5cf6' }}
              >
                Inquire About Workshops
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Integrated System Architecture (The Live Tech Stack) */}
        {activeTab === 'tech-stack' && (
          <div className="tours-feature-section">
            <span className="tours-section-tag">Fully Unified Operations Architecture</span>
            <h3 className="tours-section-title">Natively Integrated Tour Systems: From Box Office to Split Ledger</h3>
            <p className="tours-section-p">
              TuneMavens eliminates fragmented software. Your tour operations, live ticket sales, on-site merchandise transactions, and financial disbursements connect directly into the core TuneMavens ecosystem.
            </p>

            <div className="tours-tech-grid">
              <div className="tours-tech-card">
                <div>
                  <div className="icon-box" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <RiBankCardFill size={24} />
                  </div>
                  <h4>TunePay Mobile POS Terminal</h4>
                  <p>
                    Turn any phone into a live event commerce terminal. Accept tap-to-pay credit cards, Apple Pay, Google Pay, and localized mobile money (including instant M-Pesa STK push in East Africa) at venue merch booths with offline resilience.
                  </p>
                </div>
                <Link 
                  to="/dashboard?tab=pos-terminal&role=label" 
                  className="btn-secondary" 
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: '12px' }}
                >
                  Open POS Terminal in Dashboard →
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="icon-box" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                    <RiTicket2Fill size={24} />
                  </div>
                  <h4>QR-Code Event Ticketing</h4>
                  <p>
                    Deploy multi-tier concert passes, VIP workshop access, and guestlist credentials. Scan tickets at the door using your camera or paired handheld scanners with zero duplicate fraud.
                  </p>
                </div>
                <Link 
                  to="/dashboard?tab=pos-inventory&role=label" 
                  className="btn-secondary" 
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: '12px' }}
                >
                  Configure Event Tickets →
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="icon-box" style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--cyan)' }}>
                    <RiStackFill size={24} />
                  </div>
                  <h4>Split Cascade Ledger</h4>
                  <p>
                    End-of-night settlements are automated without dispute. Box office proceeds and merchandise revenue automatically cascade to repay upfront tour advances, disburse investor preferred returns, and pay crew members.
                  </p>
                </div>
                <Link 
                  to="/dashboard?tab=splits&role=creator" 
                  className="btn-secondary" 
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: '12px' }}
                >
                  Open Split Ledger in Dashboard →
                </Link>
              </div>

              <div className="tours-tech-card">
                <div>
                  <div className="icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    <RiGroupFill size={24} />
                  </div>
                  <h4>Smart CRM Geo-Alerts</h4>
                  <p>
                    Broadcast localized tour announcements directly to listeners residing within 50km of each tour stop. Send exclusive pre-sale ticket codes via WhatsApp, SMS, and high-deliverability email blasts.
                  </p>
                </div>
                <Link 
                  to="/dashboard?tab=crm&role=creator" 
                  className="btn-secondary" 
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: '12px' }}
                >
                  Open Smart CRM in Dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Relationships & Network Grid */}
        <div style={{ marginTop: '50px', marginBottom: '50px' }}>
          <h3 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '14px', fontFamily: 'Sansation, sans-serif' }}>
            Powered by Deep Global Industry Relationships
          </h3>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14.5px', maxWidth: '720px', margin: '0 auto 36px', lineHeight: 1.6 }}>
            Our touring division builds on decades of frontline venue routing, diplomatic cultural exchange programs, and relationships with the premier live institutions worldwide.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', textAlign: 'center' }}>
              <RiEarthFill size={24} style={{ color: 'var(--cyan)', marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '15px', margin: '0 0 4px' }}>Pan-African Network</h5>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Kenya · Nigeria · South Africa · Ghana · Rwanda</span>
            </div>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', textAlign: 'center' }}>
              <RiBuilding4Fill size={24} style={{ color: '#8b5cf6', marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '15px', margin: '0 0 4px' }}>European Club &amp; Festival Circuit</h5>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>London · Berlin · Paris · Amsterdam · Copenhagen</span>
            </div>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', textAlign: 'center' }}>
              <RiMapPinRangeLine size={24} style={{ color: '#10b981', marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '15px', margin: '0 0 4px' }}>North American Stage Network</h5>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Austin (SXSW) · New York · Chicago · Toronto · LA</span>
            </div>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', textAlign: 'center' }}>
              <RiShieldCheckFill size={24} style={{ color: '#f59e0b', marginBottom: '8px' }} />
              <h5 style={{ color: '#fff', fontSize: '15px', margin: '0 0 4px' }}>Diplomatic &amp; Cultural Centers</h5>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Goethe-Institut · Alliance Française · British Council</span>
            </div>
          </div>
        </div>

        {/* Viewport Persistent Sticky Action Bar */}
        <div className="sticky-app-cta-bar">
          <div className="cta-meta">
            <div className="cta-pulse-dot" style={{ background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6' }} />
            <div>
              <h4 className="cta-title">Take your live sound to the global stage</h4>
              <p className="cta-sub">Propose an artist tour, explore venture financing, or access live event ticketing.</p>
            </div>
          </div>
          <div className="cta-actions">
            <button 
              onClick={() => { setModalMode('artist'); setModalOpen(true); }}
              className="btn-primary" 
              style={{ padding: '10px 22px', fontSize: '13px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
            >
              Propose an Artist Tour <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </button>
            <button 
              onClick={() => { setModalMode('investor'); setModalOpen(true); }}
              className="btn-secondary" 
              style={{ padding: '10px 18px', fontSize: '13px' }}
            >
              Investor Data Room
            </button>
          </div>
        </div>

        {/* Interactive Tour Pitch / VC Inquiry Modal */}
        {modalOpen && (
          <div className="tours-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="tours-modal-container" onClick={e => e.stopPropagation()}>
              <button className="tours-modal-close-btn" onClick={() => setModalOpen(false)}>
                <RiCloseLine size={18} />
              </button>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <button 
                  onClick={() => setModalMode('artist')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    border: '1px solid',
                    borderColor: modalMode === 'artist' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                    background: modalMode === 'artist' ? '#8b5cf6' : 'transparent',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Artist / Manager Tour Pitch
                </button>
                <button 
                  onClick={() => setModalMode('investor')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    border: '1px solid',
                    borderColor: modalMode === 'investor' ? '#10b981' : 'rgba(255,255,255,0.1)',
                    background: modalMode === 'investor' ? '#10b981' : 'transparent',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Venture Capital / Live Backing
                </button>
              </div>

              {submittedStatus ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <RiCheckDoubleFill size={28} />
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '20px', margin: '0 0 8px', fontWeight: 800 }}>
                    {modalMode === 'artist' ? 'Tour Proposal Received!' : 'Data Room Access Requested!'}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '13.5px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
                    Our global tour operations board will evaluate your audience data and contact you within 24 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {modalMode === 'artist' ? 'Submit Your Tour Development Pitch' : 'Request Tour VC Prospectus & Data Room'}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px' }}>
                    {modalMode === 'artist' 
                      ? 'Tell us about your artist, origin city, verified streaming reach, and target tour regions.' 
                      : 'Access cryptographically verified audience stream velocity, pre-sale data, and preferred return term sheets.'}
                  </p>

                  <div className="tours-form-group">
                    <label className="tours-form-label">Contact Name / Representative</label>
                    <input 
                      type="text" 
                      className="tours-form-input" 
                      required 
                      placeholder="e.g. Sarah Jensen, Management"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="tours-form-group">
                    <label className="tours-form-label">Professional Email</label>
                    <input 
                      type="email" 
                      className="tours-form-input" 
                      required 
                      placeholder="e.g. management@sarahjensen.com"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  {modalMode === 'artist' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="tours-form-group">
                          <label className="tours-form-label">Origin City / Hub</label>
                          <input 
                            type="text" 
                            className="tours-form-input" 
                            required 
                            placeholder="e.g. Nairobi, Kenya"
                            value={formData.originCity}
                            onChange={e => handleInputChange('originCity', e.target.value)}
                          />
                        </div>
                        <div className="tours-form-group">
                          <label className="tours-form-label">Target Tour Regions</label>
                          <input 
                            type="text" 
                            className="tours-form-input" 
                            required 
                            placeholder="e.g. Europe (UK, DE, FR)"
                            value={formData.targetRegions}
                            onChange={e => handleInputChange('targetRegions', e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div className="tours-form-group">
                          <label className="tours-form-label">Verified Fan Reach</label>
                          <input 
                            type="text" 
                            className="tours-form-input" 
                            placeholder="e.g. 150k Spotify listeners"
                            value={formData.fanReach}
                            onChange={e => handleInputChange('fanReach', e.target.value)}
                          />
                        </div>
                        <div className="tours-form-group">
                          <label className="tours-form-label">Estimated Budget Request</label>
                          <input 
                            type="text" 
                            className="tours-form-input" 
                            placeholder="e.g. $45,000"
                            value={formData.budgetRequest}
                            onChange={e => handleInputChange('budgetRequest', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="tours-form-group">
                      <label className="tours-form-label">Investment Bracket / Syndicate Range</label>
                      <select 
                        className="tours-form-select"
                        value={formData.investorTier}
                        onChange={e => handleInputChange('investorTier', e.target.value)}
                      >
                        <option value="$10,000 - $25,000">$10,000 - $25,000 (Angel Backer)</option>
                        <option value="$25,000 - $100,000">$25,000 - $100,000 (Lead Tour Underwriter)</option>
                        <option value="$100,000 - $500,000+">$100,000 - $500,000+ (Multi-Tour Institutional Syndicate)</option>
                      </select>
                    </div>
                  )}

                  <div className="tours-form-group">
                    <label className="tours-form-label">Key Tour Objectives / Additional Notes</label>
                    <textarea 
                      className="tours-form-textarea" 
                      rows={3}
                      placeholder={modalMode === 'artist' ? "Describe your workshop requirements, technical stage riders, and preferred timeline..." : "Specify particular target genres, geographical preferences, or portfolio thesis..."}
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      fontSize: '13px', 
                      background: modalMode === 'artist' ? '#8b5cf6' : '#10b981',
                      borderColor: modalMode === 'artist' ? '#8b5cf6' : '#10b981'
                    }}
                  >
                    {modalMode === 'artist' ? 'Submit Tour Incubation Proposal' : 'Request Access to VC Data Room'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
