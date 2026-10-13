import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiBuilding2Fill, 
  RiMegaphoneFill, 
  RiCoinsFill, 
  RiFundsBoxFill, 
  RiBarChartBoxFill, 
  RiUserSharedFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiTargetFill,
  RiShieldCheckFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_pricing.png'
import headerAppsImg from '../../../assets/images/header_apps.png'
import userManagerImg from '../../../assets/images/user_manager.png'
import headerAboutImg from '../../../assets/images/header_about.png'
import tunepayLogo from '../../../assets/logos/tunepay-logo.png'

export default function CorporateLandingPage() {
  const accent = '#ef4444';

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
      badge: 'Omnichannel Sonic Branding',
      dot: '#ef4444',
      hLine1: 'Own Your Sonic Identity.',
      hLine2: 'Targeted Native Placements.',
      hLine2Color: '#ef4444',
      s: 'Connect consumer brands directly to high-intent music listeners and cultural creators through immersive native audio placements and verified creator sponsorships.',
      b1: 'Launch Brand Campaign',
      b1link: '/register?role=corporate',
      b2: 'Explore Sonic Branding',
      b2link: '#sonic-branding',
      image: headerImg
    },
    {
      badge: '100% Indemnified Sync Clearances',
      dot: '#ef4444',
      hLine1: 'Zero Legal Ambiguity.',
      hLine2: 'Pre-Cleared Commercials.',
      hLine2Color: '#ef4444',
      s: 'License original music for national TV commercials, social digital spots, and global retail activations with ironclad worldwide indemnification and zero residual risk.',
      b1: 'Browse Commercial Vault',
      b1link: '/register?role=corporate',
      b2: 'Review Indemnification',
      b2link: '#commercial-rights',
      image: headerAppsImg
    },
    {
      badge: 'Direct Creator Tour Sponsorships',
      dot: '#ef4444',
      hLine1: 'Sponsor Verified Tours.',
      hLine2: 'Omnichannel Activations.',
      hLine2Color: '#ef4444',
      s: 'Integrate brand experiential booths, on-site POS sampling, and sponsored digital QR tickets directly into sold-out artist tours and music festival stages.',
      b1: 'Explore Creator Roster',
      b1link: '/for/creator',
      b2: 'Tour Sponsorship Specs',
      b2link: '#tour-sponsorship',
      image: userManagerImg
    },
    {
      badge: 'Unified Campaign Ledgers',
      dot: '#ef4444',
      hLine1: 'Transparent ROI Analytics.',
      hLine2: 'Real-Time Engagement.',
      hLine2Color: '#ef4444',
      s: 'Monitor audio ad completion rates, fan click-throughs, and promotional voucher redemptions in real time under your corporate marketing dashboard.',
      b1: 'Create Corporate Account',
      b1link: '/register?role=corporate',
      b2: 'Campaign Budget Options',
      b2link: '/pricing',
      image: headerAboutImg
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
        aria-label="Corporate & Brands Hero Carousel"
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
                src={tunepayLogo} 
                alt="TunePay Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Corporate &amp; Brands</span>
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
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">Legally Indemnified Commercial Rights</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">3.4x</span>
            <span className="role-stat-label">Higher Engagement vs. Programmatic Banners</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Omnichannel</span>
            <span className="role-stat-label">Native Audio Spots, Live Passes &amp; CRM Drops</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Unified</span>
            <span className="role-stat-label">Intermaven Cross-Platform Ad Credit Pool</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="sonic-branding" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Brand Advertising</span>
            <h3 className="role-section-title">Built for Cultural Impact &amp; Measurable Conversion</h3>
            <p className="role-section-desc">
              From immersive audio interstitial spots to direct creator sponsorships, engage active music audiences where attention is highest.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiMegaphoneFill size={24} /></div>
              <h4 className="role-pillar-title">Native Audio Interstitial Spots</h4>
              <p className="role-pillar-desc">
                Broadcast studio-grade 15s and 30s audio spots between streaming tracks on TuneStream with unskippable fidelity and companion visual banners.
              </p>
            </div>

            <div className="role-pillar-card" id="tour-sponsorship" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiUserSharedFill size={24} /></div>
              <h4 className="role-pillar-title">Artist Tour &amp; EPK Sponsorships</h4>
              <p className="role-pillar-desc">
                Sponsor top-performing creator web worlds, live album drops, and concert tours with co-branded digital ticket passes and interactive hero carousel banners.
              </p>
            </div>

            <div className="role-pillar-card" id="commercial-rights" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiTargetFill size={24} /></div>
              <h4 className="role-pillar-title">Hyper-Targeted Fan Demographics</h4>
              <p className="role-pillar-desc">
                Target listeners by musical subculture, geographic territory (East Africa, West Africa, Diaspora), device ecosystem, and high-frequency stream habits.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFundsBoxFill size={24} /></div>
              <h4 className="role-pillar-title">Unified Intermaven Network Credits</h4>
              <p className="role-pillar-desc">
                Deposit ad spend once into the Intermaven credits vault. Allocate credits flexibly across TuneMavens audio ads, SyncMavens briefs, and partner network activations.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBarChartBoxFill size={24} /></div>
              <h4 className="role-pillar-title">Live Attribution &amp; Conversion Analytics</h4>
              <p className="role-pillar-desc">
                Monitor live audio impressions, click-through actions, coupon redemptions, and real-time fan engagement metrics on your dedicated brand analytics dashboard.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBuilding2Fill size={24} /></div>
              <h4 className="role-pillar-title">Omnichannel Lead Generation</h4>
              <p className="role-pillar-desc">
                Collect opt-in leads directly through creator live world activations, routing seamlessly into Intermaven Smart CRM for automated WhatsApp, SMS, and email follow-ups.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Enterprise Brand Studio</span>
            <h3>Campaign Management &amp; CRM Console</h3>
            <p>
              Launch, monitor, and optimize your brand sponsorships with granular budget pacing, demographic filtering, and live conversion attribution.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Direct partnerships with verified indie artists and major curators</li>
              <li><RiCheckFill size={18} /> Transparent cost-per-listen and cost-per-acquisition reporting</li>
              <li><RiCheckFill size={18} /> Custom brand playlists curated by influential taste-makers</li>
              <li><RiCheckFill size={18} /> Dedicated agency account manager and campaign strategy support</li>
            </ul>
            <Link to="/register?role=corporate" className="role-btn-primary">
              Launch Brand Account <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={userManagerImg} alt="TuneMavens Corporate Campaign and CRM Management" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Campaign Launch</span>
            <h3 className="role-section-title">How Brands Run Campaigns on TuneMavens</h3>
            <p className="role-section-desc">From brief submission to measurable listener reach in 3 steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiTargetFill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Strategy</span>
              <h4 className="role-step-title">Select Objective &amp; Audience</h4>
              <p className="role-step-desc">
                Define your brand campaign goals: audio brand awareness, live event tour sponsorship, or direct-response digital coupon activations.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiMegaphoneFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Placement</span>
              <h4 className="role-step-title">Upload Assets &amp; Allocate Credits</h4>
              <p className="role-step-desc">
                Upload your studio audio spots, select creator web world banner slots, and set your weekly credit budget using our unified balance pool.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiBarChartBoxFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Optimization</span>
              <h4 className="role-step-title">Track Real-Time Conversion &amp; Leads</h4>
              <p className="role-step-desc">
                Analyze live verified listens, audience demographic heatmaps, and route generated customer leads directly into your Intermaven CRM workflows.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Elevate Your Brand's Cultural Relevance</h3>
          <p>
            Align your marketing with the fastest-growing music ecosystems in the world. Reach fans where they listen.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=corporate" className="role-btn-primary">
              Register Brand Workspace <RiArrowRightLine size={15} />
            </Link>
            <Link to="/pricing" className="role-btn-secondary">
              Review Business Ad Rates
            </Link>
          </div>
          <span className="role-trust-note">
            Self-serve and managed agency plans · Certified impression auditing · Dedicated media rep
          </span>
        </section>
      </div>
    </div>
  );
}
