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
  RiShieldCheckFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import distributeHeroImg from '../../../assets/images/distribute_hero.png'
import appsLedgerImg from '../../../assets/images/apps_ledger.png'
import publishingMockupImg from '../../../assets/images/publishing_dashboard_mockup.png'
import tourDashboardMockupImg from '../../../assets/images/tour_dashboard_mockup.png'
import distributeLogo from '../../../assets/logos/tuneexecs-logo.png'

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

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  const slides = [
    {
      badge: 'Roster Ownership Isolation',
      dot: '#8b5cf6',
      hLine1: 'Scale Your Label Roster.',
      hLine2: 'Total Catalog Ownership.',
      hLine2Color: '#8b5cf6',
      s: 'Assign isolated roster seats for A&R managers and accountants. Ingest 50+ artists across disparate distributor statements with zero cross-contamination.',
      b1: 'Set Up Label Workspace',
      b1link: '/register?role=label',
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

  // rAF progress bar and slide advancement triggering cascade on every slide
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

  return (
    <div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      {/* ================= 1. Interactive HERO Slide Carousel ================= */}
      <section 
        className="hw role-hero-wrapper"
        aria-label="Record Label Hero Carousel"
      >
        {/* Background cross-fade layers */}
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

        {/* Hero Stage Content (Constricted to 1240px) */}
        <div className="hs role-hero-stage">
          <div 
            className="hcont"
            key={currentSlide}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            {/* Brand Logo Display */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img 
                src={distributeLogo} 
                alt="TuneExecs Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Record Labels</span>
            </div>

            {/* Pulsing Pill Badge */}
            <div className={`he hbadge ${slideState}`}>
              <span 
                className="bdot" 
                style={{ 
                  background: currentSlideData.dot,
                  animation: 'pulseGlow 2s infinite'
                }} 
              />
              <span>{currentSlideData.badge}</span>
            </div>
            
            {/* Staggered 2-Line Headline — Slides In One At A Time */}
            <h1 className="ht htitle">
              <span className={`ht-line ht-line-1 ${slideState}`}>{currentSlideData.hLine1}</span>
              <span 
                className={`ht-line ht-line-2 ${slideState}`}
                style={{ color: currentSlideData.hLine2Color }}
              >
                {currentSlideData.hLine2}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`hp hsub ${slideState}`}>
              {currentSlideData.s}
            </p>

            {/* Dual CTA Buttons (Strict Flat Colors Standard) */}
            <div className={`hb hbtns ${slideState}`}>
              <Link 
                to={currentSlideData.b1link} 
                className="hbp"
                style={{ background: currentSlideData.dot }}
              >
                {currentSlideData.b1} <RiArrowRightLine size={15} style={{ marginLeft: '6px' }} />
              </Link>
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

        {/* Side Arrows Navigation (Constricted to 1240px container) */}
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

        {/* Bottom Timer Progress Bar & Pagination Dots (Constricted to 1240px container) */}
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

      {/* ================= 2. Main Content (Strictly Constricted to 1240px) ================= */}
      <div className="role-container">
        {/* Stats Ribbon - Centered */}
        <section className="role-stats-ribbon" style={{ marginTop: '40px' }}>
          <div className="role-stat-item">
            <span className="role-stat-value">Bulk CSV</span>
            <span className="role-stat-label">4-Step Guided Ingestion &amp; Stem Auditing</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100% Isolated</span>
            <span className="role-stat-label">Roster Ownership &amp; Data Security</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">90/10 to 50/50</span>
            <span className="role-stat-label">Configurable Master Recoupment Splits</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Multi-Protocol</span>
            <span className="role-stat-label">Direct Deposit, M-Pesa &amp; Stripe Card Payouts</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="roster-isolation" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Label Operations</span>
            <h3 className="role-section-title">Built to Handle Entire Release Catalogs at Scale</h3>
            <p className="role-section-desc">
              From signing contracts to multi-artist festival merch settlements, every tool is linked directly to your master label ledger.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiGroupFill size={24} /></div>
              <h4 className="role-pillar-title">Roster Ownership Isolation</h4>
              <p className="role-pillar-desc">
                Label managers and A&amp;R teams only see their assigned artists. Switch seamlessly between individual creator views and the global master catalogue with dedicated pagination controls.
              </p>
            </div>

            <div className="role-pillar-card" id="ingestion" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiUploadCloud2Fill size={24} /></div>
              <h4 className="role-pillar-title">Catalogue Machine Studio</h4>
              <p className="role-pillar-desc">
                Upload CSV catalogues containing hundreds of tracks. Our Catalogue Machine validates ISRC numbers, audio stem previews, primary and featured artists, and publishing shares automatically.
              </p>
            </div>

            <div className="role-pillar-card" id="recoupment" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Waterfall Split Cascade</h4>
              <p className="role-pillar-desc">
                Define advance recoupment thresholds and waterfall splits. Streamline net payouts across label vaults, distributors, and artist sub-wallets without calculation errors.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBarChartGroupedFill size={24} /></div>
              <h4 className="role-pillar-title">Label Analytics Console</h4>
              <p className="role-pillar-desc">
                Real-time visibility into gross roster revenue, track playcount trends across TuneStream and public web worlds, and download statistics per signed act.
              </p>
            </div>

            <div className="role-pillar-card" id="merch-pos" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiBankCardFill size={24} /></div>
              <h4 className="role-pillar-title">TunePay POS Live Settlement</h4>
              <p className="role-pillar-desc">
                Equip tour managers and merch booths with on-site POS terminals. Process contactless cards and M-Pesa STK push with overnight automated roster split reconciliations.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Omnichannel CRM Broadcasts</h4>
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
            <Link to="/register?role=label" className="role-btn-primary">
              Access Label Operations Studio <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={distributeHeroImg} alt="TuneMavens Label Console and Distribution" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
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

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Elevate Your Label’s Royalty Operations</h3>
          <p>
            Eliminate hours of manual reconciliation. Provide your signed artists with transparent, real-time ledgers they can trust.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=label" className="role-btn-primary">
              Register as a Record Label <RiArrowRightLine size={15} />
            </Link>
            <Link to="/pricing" className="role-btn-secondary">
              View Label &amp; Business Pricing
            </Link>
          </div>
          <span className="role-trust-note">
            Dedicated onboarding support for catalogs with 50+ tracks · SOC-2 compliant data handling
          </span>
        </section>
      </div>
    </div>
  );
}
