import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiBuilding4Fill, 
  RiFolderMusicFill, 
  RiCoinsFill, 
  RiGroupFill, 
  RiBarChartGroupedFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiUploadCloud2Fill,
  RiBankCardFill,
  RiShieldCheckFill,
  RiCloseFill,
  RiCheckboxCircleFill,
  RiSpeedUpFill,
  RiGlobalFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import distributeHeroImg from '../../../assets/images/distribute_hero.png'
import appsLedgerImg from '../../../assets/images/apps_ledger.png'
import publishingMockupImg from '../../../assets/images/publishing_dashboard_mockup.png'
import tourDashboardMockupImg from '../../../assets/images/tour_dashboard_mockup.png'
import distributeLogo from '../../../assets/logos/tuneexecs-logo.png'

const FALLBACK_LABEL_RATES = [
  {
    slug: 'label-indie',
    name: 'Indie Imprint',
    tier_badge: 'Starter Roster',
    price_usd: 99.0,
    billing_period: 'month',
    credits: 1000,
    key_metric: 'Up to 10 Signed Artists · 100 Tracks',
    features: [
      'Manage up to 10 signed creator profiles with isolated roster seats',
      'Automated CSV statement parser (DistroKid, TuneCore, FUGA, Orchard)',
      'Split Cascade net calculations with advance balance tracking',
      'Pre-cleared label roster sync pitching on SyncMavens',
      '1,000 monthly shared Network Credits for mastering & promotions',
      'Standard email & chat label support'
    ],
    is_popular: false,
    cta: 'Start Indie Imprint'
  },
  {
    slug: 'label-growth',
    name: 'Scale Label Operations',
    tier_badge: 'Most Popular',
    price_usd: 299.0,
    billing_period: 'month',
    credits: 3500,
    key_metric: 'Up to 50 Signed Artists · 1,000 Tracks',
    features: [
      'Up to 50 active artists & 1,000 master tracks with stem archives',
      'Automated master advance recoupment cascades (90/10 down to 50/50)',
      'Role-based staff permissions (A&R, Legal, Head of Accounting)',
      'TunePay live tour merch & festival ticket box-office settlement',
      'Intermaven Smart CRM automated roster fan broadcasts (WhatsApp/SMS)',
      '3,500 monthly TM credits & dedicated label success manager'
    ],
    is_popular: true,
    cta: 'Scale Label Operations'
  },
  {
    slug: 'label-enterprise',
    name: 'Major / Conglomerate Enterprise',
    tier_badge: 'Unlimited Scale',
    price_usd: 799.0,
    billing_period: 'month',
    credits: 10000,
    key_metric: 'Unlimited Artists & Masters · Custom White-Label',
    features: [
      'Unlimited roster size and unlimited catalog ingestion',
      'Custom white-labeled artist portal for signing and monthly payouts',
      'Direct bank rail & mobile money bulk payouts (M-Pesa B2C, ACH, SWIFT)',
      'Full ERP & accounting API webhooks for QuickBooks / NetSuite sync',
      'Priority Sync Brief placement exclusivity across SyncMavens network',
      '10,000 monthly TM credits, custom SLA & 24/7 dedicated engineering support'
    ],
    is_popular: false,
    cta: 'Request Enterprise Agreement'
  }
];

export default function LabelLandingPage() {
  const accent = '#8b5cf6';

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_LABEL_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'label-growth',
    roster_size: '10-50 Signed Artists',
    current_distributor: 'DistroKid / TuneCore',
    estimated_budget: '$299 / month (3,500 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/label/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback label rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'Roster Ownership Isolation',
      dot: '#8b5cf6',
      hLine1: 'Scale Your Label Roster.',
      hLine2: 'Total Catalog Ownership.',
      hLine2Color: '#8b5cf6',
      s: 'Assign isolated roster seats for A&R managers and accountants. Ingest 50+ artists across disparate distributor statements with zero cross-contamination.',
      b1: 'Review Label Plans',
      b1link: '#label-rates',
      b2: 'Explore Roster Ledgers',
      b2link: '#roster-isolation',
      image: distributeHeroImg
    },
    {
      badge: 'Automated Recoupment Ledgers',
      dot: '#8b5cf6',
      hLine1: 'Recoup Advance Budgets.',
      hLine2: 'Precision Cascade Math.',
      hLine2Color: '#8b5cf6',
      s: 'Automate complex master recoupment cascades (90/10 to 50/50 net splits). Direct statements flow straight from CSV imports to compliant payouts.',
      b1: 'Try Split Cascade Demo',
      b1link: '/tools',
      b2: 'Review Payout Methods',
      b2link: '#recoupment',
      image: appsLedgerImg
    },
    {
      badge: 'Bulk Ingestion & Stem Audits',
      dot: '#8b5cf6',
      hLine1: 'High-Throughput Ingest.',
      hLine2: 'Audit Stems in Batches.',
      hLine2Color: '#8b5cf6',
      s: '4-step guided CSV ingestion wizard for multi-artist catalogs, lossless WAV master archives, separated stem packages, and verified ISRC metadata.',
      b1: 'Start Bulk Ingestion',
      b1link: '/register?role=label',
      b2: 'Explore Ingest Wizard',
      b2link: '#ingestion',
      image: publishingMockupImg
    },
    {
      badge: 'Omnichannel Ticketing & Merch',
      dot: '#8b5cf6',
      hLine1: 'Live Tour Settlements.',
      hLine2: 'Instant Reconciliations.',
      hLine2Color: '#8b5cf6',
      s: 'Portable event POS ticketing, merchandise sales tracking, and live festival settlements that feed directly into multi-artist split cascade balances.',
      b1: 'Access Label Apps',
      b1link: '/apps',
      b2: 'Tour Settlement Engine',
      b2link: '#merch-pos',
      image: tourDashboardMockupImg
    }
  ];

  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide];

  const goToSlide = (index) => {
    if (index === currentSlide || isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 400);
    }, TRANSITION_OUT_MS);
  };

  const goToPrevSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  const goToNextSlide = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    goToSlide((currentSlide + 1) % slideCount);
  };

  useEffect(() => {
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      setSlideState('out');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setProgress(0);
        setSlideState('in');
      }, TRANSITION_OUT_MS);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, slideCount]);

  const scrollToRates = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('label-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#label-rates');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      estimated_budget: `$${tier.price_usd?.toLocaleString()} / ${tier.billing_period || 'month'} (${tier.credits?.toLocaleString()} Credits)`
    }));
    setInquirySuccess(null);
    setModalOpen(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquirySuccess(null);

    try {
      const payload = {
        role: 'label',
        organization_name: bookingForm.organization_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        catalog_or_audience_size: bookingForm.roster_size,
        notes: `Distributor: ${bookingForm.current_distributor}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/label/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInquirySuccess({
          ref: data.reference_code,
          msg: data.message
        });
      } else {
        alert(data.detail || 'Unable to submit reservation. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please verify your connection.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      {/* ================= 1. Interactive HERO Slide Carousel ================= */}
      <section 
        className="hw role-hero-wrapper"
        aria-label="Record Labels Hero Carousel"
      >
        <div className="bgs">
          {slides.map((s, index) => (
            <div 
              key={index}
              className={`bg ${index === currentSlide ? 'on' : ''}`}
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentSlide === index 
                  ? (titleHovered ? 'brightness(1.55) blur(0px)' : 'brightness(1.4) blur(1px)')
                  : 'none',
                transform: currentSlide === index && titleHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease'
              }}
            />
          ))}
          <div 
            className="bgo"
            style={{
              opacity: titleHovered ? 0.4 : 0.82,
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </div>

        <div className="hs role-hero-stage">
          <div 
            className="hcont"
            key={currentSlide}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img 
                src={distributeLogo} 
                alt="TuneExecs Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Record Labels</span>
            </div>

            <div className="he hbadge in">
              <span 
                className="bdot" 
                style={{ 
                  background: currentSlideData.dot,
                  animation: 'pulseGlow 2s infinite'
                }} 
              />
              <span>{currentSlideData.badge}</span>
            </div>
            
            <h1 className="ht htitle">
              <span className={`ht-line ht-line-1 ${slideState}`}>{currentSlideData.hLine1}</span>
              <span 
                className={`ht-line ht-line-2 ${slideState}`}
                style={{ color: currentSlideData.hLine2Color }}
              >
                {currentSlideData.hLine2}
              </span>
            </h1>
            
            <p className={`hp hsub ${slideState}`}>
              {currentSlideData.s}
            </p>

            <div className={`hb hbtns ${slideState}`}>
              {currentSlideData.b1link.startsWith('#') ? (
                <a 
                  href={currentSlideData.b1link} 
                  className="hbp"
                  style={{ background: currentSlideData.dot }}
                  onClick={scrollToRates}
                >
                  {currentSlideData.b1} <RiArrowRightLine size={15} style={{ marginLeft: '6px' }} />
                </a>
              ) : (
                <Link 
                  to={currentSlideData.b1link} 
                  className="hbp"
                  style={{ background: currentSlideData.dot }}
                >
                  {currentSlideData.b1} <RiArrowRightLine size={15} style={{ marginLeft: '6px' }} />
                </Link>
              )}

              {currentSlideData.b2link.startsWith('#') ? (
                <a 
                  href={currentSlideData.b2link} 
                  className="hbg"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.querySelector(currentSlideData.b2link);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', currentSlideData.b2link);
                    }
                  }}
                >
                  {currentSlideData.b2}
                </a>
              ) : (
                <Link to={currentSlideData.b2link} className="hbg">
                  {currentSlideData.b2}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={`sui-arrows ${slideState}`}>
          <button 
            type="button" 
            className="slide-nav prev" 
            onClick={goToPrevSlide} 
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button 
            type="button" 
            className="slide-nav next" 
            onClick={goToNextSlide} 
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <div className={`sui-bottom ${slideState}`}>
          <div className="spr">
            <div 
              className="spb" 
              style={{ 
                width: `${progress}%`,
                background: currentSlideData.dot,
                boxShadow: `0 0 10px ${currentSlideData.dot}`
              }} 
            />
          </div>
          <div className="sdots">
            {slides.map((s, index) => (
              <button
                key={index}
                type="button"
                className={`sd ${index === currentSlide ? 'on' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(index); }}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  background: index === currentSlide ? s.dot : undefined,
                  boxShadow: index === currentSlide ? `0 0 8px ${s.dot}` : undefined
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. Main Content ================= */}
      <div className="role-container">
        <section className="role-stats-ribbon" style={{ marginTop: '40px' }}>
          <div className="role-stat-item">
            <span className="role-stat-value">50+</span>
            <span className="role-stat-label">Artists per Roster Pod</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">Automated Recoupment Auditing</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">1-Click</span>
            <span className="role-stat-label">Multi-Distributor CSV Ingestion</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Zero</span>
            <span className="role-stat-label">Roster Cross-Contamination Risk</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="roster-isolation" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Label Infrastructure</span>
            <h3 className="role-section-title">Built for Multi-Artist Catalog Scale</h3>
            <p className="role-section-desc">
              Manage multi-tiered artist rosters, automate recoupment waterfalls, and distribute transparent statements with audit-proof compliance.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiGroupFill size={24} /></div>
              <h4 className="role-pillar-title">Roster Account Isolation</h4>
              <p className="role-pillar-desc">
                Give signed artists isolated portals to view their own monthly earnings and balance advances without exposing private label margins or peer catalogs.
              </p>
            </div>

            <div className="role-pillar-card" id="recoupment" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Dynamic Recoupment Cascades</h4>
              <p className="role-pillar-desc">
                Set recording fund advances and marketing spend. The system retains 90% net until recouped, then automatically cascades into 50/50 profit splits.
              </p>
            </div>

            <div className="role-pillar-card" id="ingestion" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiUploadCloud2Fill size={24} /></div>
              <h4 className="role-pillar-title">Batch Catalog Ingestion</h4>
              <p className="role-pillar-desc">
                Import complete discographies with lossless audio, multi-track stems, and ISRC tags in bulk. Automatic deduplication and metadata cleanup.
              </p>
            </div>

            <div className="role-pillar-card" id="merch-pos" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiBankCardFill size={24} /></div>
              <h4 className="role-pillar-title">Live Tour &amp; POS Settlements</h4>
              <p className="role-pillar-desc">
                Equip road managers with TunePay event terminals. Merchandise sales and ticket box-office revenue feed straight into artist recoupment ledgers.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Tamper-Proof Split Contracts</h4>
              <p className="role-pillar-desc">
                Deploy cryptographically signed Publishing Election and Distribution Election agreements with immutable audit trails.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBuilding4Fill size={24} /></div>
              <h4 className="role-pillar-title">Unified Fan Outreach (CRM)</h4>
              <p className="role-pillar-desc">
                Dispatch WhatsApp, SMS, and email announcements to fans across all roster artists with verified 98% open rates and live delivery logs.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Executive Console</span>
            <h3>Streamlined Multi-Artist Operations</h3>
            <p>
              Consolidate publishing election agreements, global store distribution trackers, and label banking preferences into a single high-contrast interface.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Automated statement CSV parsing from DistroKid, TuneCore, and FUGA</li>
              <li><RiCheckFill size={18} /> Custom default split sliders (Artist Friendly vs. Label Recoupment)</li>
              <li><RiCheckFill size={18} /> Unified Network Credits shared across all roster acts</li>
              <li><RiCheckFill size={18} /> Instant digital contracting with tamper-evident audit trails</li>
            </ul>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=label" className="role-btn-primary">
                Access Label Operations Studio <RiArrowRightLine size={14} />
              </Link>
              <a href="#label-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Label Pricing Tiers
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={distributeHeroImg} alt="TuneMavens Label Console and Distribution" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Label Onboarding Journey</span>
            <h3 className="role-section-title">How Labels Scale on TuneMavens</h3>
            <p className="role-section-desc">Get your entire roster migrated and receiving transparent statements in 3 steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiUploadCloud2Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Ingestion</span>
              <h4 className="role-step-title">Batch Import Roster &amp; Catalog</h4>
              <p className="role-step-desc">
                Drag-and-drop your master roster CSV. Our parser validates ISRCs, release dates, and collaborating artist profiles in under 30 seconds.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiCoinsFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Configuration</span>
              <h4 className="role-step-title">Configure Recoupment &amp; Splits</h4>
              <p className="role-step-desc">
                Set master label recoupment terms, advance balances, and net royalty percentages per artist contract.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiShieldCheckFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Settlement</span>
              <h4 className="role-step-title">Automate Payouts &amp; Sync Licensing</h4>
              <p className="role-step-desc">
                Distribute net revenue directly to creators while pitching pre-cleared roster tracks into SyncMavens film &amp; commercial briefs.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. COMMERCIAL RATES & SPONSORSHIP PACKAGES ================= */}
        <section id="label-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Transparent Label Subscriptions</span>
            <h3 className="role-section-title">Commercial Label Tiers &amp; Operations Plans</h3>
            <p className="role-section-desc">
              From boutique indie imprints to enterprise label conglomerates. Transparent monthly or annual billing with unified TM credit flexibility and isolated roster accounting.
            </p>
          </div>

          <div className="role-rates-grid">
            {tierPackages.map((rate) => (
              <div 
                key={rate.slug} 
                className={`role-rate-card ${rate.is_popular ? 'featured' : ''}`}
              >
                {rate.is_popular && (
                  <span className="role-featured-tag">
                    Most Popular
                  </span>
                )}

                <span className="role-rate-badge">{rate.tier_badge || 'Label Tier'}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price">${rate.price_usd?.toLocaleString()}</span>
                  <span className="role-rate-period">/ {rate.billing_period || 'month'}</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {rate.credits?.toLocaleString()} TM Credits/mo
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric || 'Multi-Artist Pod'}
                  </span>
                </div>

                <div className="role-rate-reach">
                  <strong style={{ color: '#fff' }}>{rate.key_metric}</strong>
                </div>

                <ul className="role-rate-features">
                  {(rate.features || []).map((feature, i) => (
                    <li key={i} className="role-rate-feature-item">
                      <RiCheckFill size={16} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="role-btn-primary"
                  onClick={() => handleOpenBooking(rate)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: 'auto'
                  }}
                >
                  {rate.cta || 'Select Plan'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Technical Specs & Compliance Panel */}
          <div className="role-specs-panel">
            <h4 className="role-specs-title">
              <RiShieldCheckFill size={20} color={accent} /> Record Label Operations &amp; Recoupment Guarantees
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Catalog Ingestion</span>
                <div className="role-spec-value">
                  Automated CSV import parsers compatible with DistroKid, TuneCore, FUGA, and The Orchard with ISRC validation.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Recoupment Math</span>
                <div className="role-spec-value">
                  Dynamic split waterfalls (e.g. 90/10 net until advance is recovered, cascading automatically to standard 50/50 splits).
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Banking &amp; Payout Rails</span>
                <div className="role-spec-value">
                  Automated disbursement via M-Pesa B2C mobile money, ACH, SEPA, and SWIFT wires with zero manual check cutting.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Roster Privacy</span>
                <div className="role-spec-value">
                  Strict cryptographic tenant isolation: individual artists can never see label-wide ledger balances or peer earnings.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Elevate Your Label’s Royalty Operations</h3>
          <p>
            Eliminate hours of manual reconciliation. Provide your signed artists with transparent, real-time ledgers they can trust.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=label" className="role-btn-primary">
              Register as a Record Label <RiArrowRightLine size={15} />
            </Link>
            <a href="#label-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review Label Pricing Tiers
            </a>
          </div>
          <span className="role-trust-note">
            Dedicated onboarding support for catalogs with 50+ tracks · SOC-2 compliant data handling
          </span>
        </section>
      </div>

      {/* ================= 8. LABEL PLAN BOOKING & ONBOARDING MODAL ================= */}
      {modalOpen && (
        <div 
          className="auth-modal-overlay-wrapper" 
          onClick={(e) => { if (e.target.className === 'auth-modal-overlay-wrapper') setModalOpen(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3,7,18,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="auth-modal-card glass-panel" 
            style={{ 
              maxWidth: '560px', 
              width: '100%', 
              padding: '32px', 
              borderRadius: '8px', 
              border: `1px solid ${accent}`,
              position: 'relative',
              maxHeight: '92vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setModalOpen(false)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <RiCloseFill size={22} />
            </button>

            {inquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <RiCheckboxCircleFill size={56} color="#22c55e" style={{ margin: '0 auto 16px', display: 'block' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
                  Label Plan Reservation Logged
                </h3>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '14px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Tracking Reference Code
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e', fontFamily: 'Space Grotesk, sans-serif', marginTop: '4px' }}>
                    {inquirySuccess.ref}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
                  {inquirySuccess.msg} Our label engineering and onboarding desk will coordinate catalog migration and roster setup.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=label" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Complete Label Registration
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Record Label Plan Reservation
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Label Operations Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Lock in your tier package and schedule your white-glove roster migration and statement setup.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Label / Imprint Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. AfroVibe Records"
                        value={bookingForm.organization_name}
                        onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Contact Person *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Business Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="ar@afroviberecords.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Phone / WhatsApp</label>
                      <input 
                        type="text" 
                        placeholder="+254 700 000000"
                        value={bookingForm.contact_phone}
                        onChange={e => setBookingForm({ ...bookingForm, contact_phone: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Selected Tier</label>
                      <select
                        value={bookingForm.tier_slug}
                        onChange={e => {
                          const slug = e.target.value;
                          const found = tierPackages.find(r => r.slug === slug);
                          setBookingForm({
                            ...bookingForm,
                            tier_slug: slug,
                            estimated_budget: found ? `$${found.price_usd?.toLocaleString()} / ${found.billing_period || 'month'}` : '$299 / month'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="label-indie">Indie Imprint — $99/mo (1,000 Credits) · 10 Artists</option>
                        <option value="label-growth">Scale Label — $299/mo (3,500 Credits) · 50 Artists</option>
                        <option value="label-enterprise">Major Enterprise — $799/mo (10,000 Credits) · Unlimited</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Roster Size</label>
                      <select
                        value={bookingForm.roster_size}
                        onChange={e => setBookingForm({ ...bookingForm, roster_size: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="1-5 Signed Artists">1-5 Signed Artists</option>
                        <option value="5-15 Signed Artists">5-15 Signed Artists</option>
                        <option value="15-50 Signed Artists">15-50 Signed Artists</option>
                        <option value="50+ Enterprise Roster">50+ Enterprise Roster</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Current Digital Distributor(s)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DistroKid, TuneCore, The Orchard, FUGA, Empire"
                      value={bookingForm.current_distributor}
                      onChange={e => setBookingForm({ ...bookingForm, current_distributor: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Catalog Ingestion Notes / Recoupment Needs</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Need help parsing historic DistroKid CSVs and setting up 70/30 recoupment cascades..."
                      value={bookingForm.notes}
                      onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="role-btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      justifyContent: 'center',
                      marginTop: '6px'
                    }}
                  >
                    {inquirySubmitting ? 'Registering Label Plan…' : 'Lock In Rate & Schedule Onboarding'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Non-binding reservation · Roster migration specialist assigned within 24 hours · SOC-2 compliant
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
