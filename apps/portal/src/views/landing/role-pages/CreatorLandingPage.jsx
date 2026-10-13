import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiMusic2Fill, 
  RiCoinsFill, 
  RiEqualizerFill, 
  RiGlobalFill, 
  RiShieldCheckFill, 
  RiSparklingFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiCompass3Fill,
  RiDatabase2Fill,
  RiFolderDownloadFill,
  RiExternalLinkLine
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import creatorDashboardImg from '../../../assets/images/creator_dashboard.png'
import userProducerImg from '../../../assets/images/user_producer.png'
import appsMasteringImg from '../../../assets/images/apps_mastering.png'
import appsSyncImg from '../../../assets/images/apps_sync.png'
import createLogo from '../../../assets/logos/tunecreators-logo.png'

export default function CreatorLandingPage() {
  const accent = '#22d3ee';
  const syncMavensUrl = getServiceUrl('syncmavens');

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
      badge: 'Automated Split Engine',
      dot: '#22d3ee',
      hLine1: 'You Make the Art.',
      hLine2: 'We Handle the Rest.',
      hLine2Color: '#22d3ee',
      s: 'Set collaborative shares between writers, producers, and vocalists once. Ingest statement CSVs and calculate cascading digital payouts automatically.',
      b1: 'Create Creator Account',
      b1link: '/register?role=creator',
      b2: 'Explore Split Ledgers',
      b2link: '#split-ledgers',
      image: creatorDashboardImg
    },
    {
      badge: 'Mother-CMS Web Worlds',
      dot: '#22d3ee',
      hLine1: 'Deploy Standalone EPKs.',
      hLine2: 'Zero Platform Lock-In.',
      hLine2Color: '#22d3ee',
      s: 'Launch high-performance EPK sites across tunemavens.com, tunestream.co, and syncmavens.com with uncapped 60fps audio scrubbing and immutable version rollbacks.',
      b1: 'Build Your EPK Free',
      b1link: '/register?role=creator',
      b2: 'Preview Live EPKs',
      b2link: '/epk',
      image: userProducerImg
    },
    {
      badge: 'Mastering Brief AI',
      dot: '#22d3ee',
      hLine1: 'Studio Loudness Compliance.',
      hLine2: 'Target LUFS in Seconds.',
      hLine2Color: '#22d3ee',
      s: 'Set target streaming loudness targets for Spotify, Apple Music, and TIDAL. Upload reference mixes and let our engine calibrate uncompressed audio without studio fees.',
      b1: 'Master Unreleased Tracks',
      b1link: '/tools',
      b2: 'Review Audio Formats',
      b2link: '#pillars',
      image: appsMasteringImg
    },
    {
      badge: 'Direct Sync Pitching',
      dot: '#22d3ee',
      hLine1: 'Pitches That Hit.',
      hLine2: 'Get Licensed for Screen.',
      hLine2Color: '#22d3ee',
      s: 'Translate creative scene descriptors into search-friendly tags for TV, Film, and Game music supervisors. Put your catalog directly before active media buyers.',
      b1: 'Submit Sync Briefs',
      b1link: '/register?role=creator',
      b2: 'Launch SyncMavens Platform',
      b2link: syncMavensUrl,
      image: appsSyncImg
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
        aria-label="Creator Hero Carousel"
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
                src={createLogo} 
                alt="TuneCreators Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Creators</span>
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
              {currentSlideData.b1link.startsWith('http') ? (
                <a 
                  href={currentSlideData.b1link} 
                  className="hbp"
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ background: currentSlideData.dot }}
                >
                  {currentSlideData.b1} <RiExternalLinkLine size={15} style={{ marginLeft: '6px' }} />
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
              {currentSlideData.b2link.startsWith('http') ? (
                <a href={currentSlideData.b2link} className="hbg" target="_blank" rel="noopener noreferrer">
                  {currentSlideData.b2} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
              ) : currentSlideData.b2link.startsWith('#') ? (
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
            <span className="role-stat-label">Direct Split Resolution Precision</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">60 FPS</span>
            <span className="role-stat-label">Uncapped Fluid Audio Time Scrubber</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">5-Step</span>
            <span className="role-stat-label">Fast Catalog &amp; Stems Ingestion Wizard</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">50 Credits</span>
            <span className="role-stat-label">Free Onboarding Balance Granted</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="pillars" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Complete Creator Suite</span>
            <h3 className="role-section-title">Everything Needed to Run Your Music Operations</h3>
            <p className="role-section-desc">
              Every tool communicates with your unified Intermaven credits pool, MongoDB catalog vault, and multi-domain ingress.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card" id="split-ledgers" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Split Cascade Ledger</h4>
              <p className="role-pillar-desc">
                Set collaborative shares between writers, producers, and vocalists once. Ingest distributor statement CSVs and calculate cascading payouts in seconds.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiGlobalFill size={24} /></div>
              <h4 className="role-pillar-title">Standalone Creator EPKs</h4>
              <p className="role-pillar-desc">
                Deploy your dedicated web world across tunemavens.com, tunestream.co, and syncmavens.com with Mother-CMS layouts, immutable version rollbacks, and dynamic SEO.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiEqualizerFill size={24} /></div>
              <h4 className="role-pillar-title">Mastering Brief AI</h4>
              <p className="role-pillar-desc">
                Run reference-level loudness matching (LUFS targets) and peak compliance for Spotify, Apple Music, and TIDAL without costly studio mastering fees.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiMusic2Fill size={24} /></div>
              <h4 className="role-pillar-title">Sync Brief AI Matching</h4>
              <p className="role-pillar-desc">
                Automatically translate creative scripts and director notes into searchable sync tags (BPM, mood, instrumentation), putting your catalog directly before supervisors on SyncMavens.
              </p>
              <a href={syncMavensUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--role-accent)', fontSize: '12.5px', marginTop: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Launch SyncMavens Platform <RiExternalLinkLine size={13} />
              </a>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiDatabase2Fill size={24} /></div>
              <h4 className="role-pillar-title">Discography &amp; Stems Ingestion</h4>
              <p className="role-pillar-desc">
                Full-screen 5-step modal wizard supporting lossless WAV, MP3-320, separated stem archives, AI cover generation, and multi-track album editing.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Direct Fan Tipping &amp; Merch</h4>
              <p className="role-pillar-desc">
                Fans tip directly via M-Pesa mobile money, cards, and digital wallets. Funds route straight into your balance with transparent payout ledgers.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Studio In Action</span>
            <h3>Creator Analytics &amp; Live Catalog Console</h3>
            <p>
              Inspect live performance metrics, balance payouts, active sync matches, and incoming CRM fan inquiries in real-time under a unified dark dashboard.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Real-time split balance and withdrawal ledgers</li>
              <li><RiCheckFill size={18} /> Inline audio preview with 60fps continuous scrubber</li>
              <li><RiCheckFill size={18} /> Live EPK data preselection with 0% data loss across reloads</li>
              <li><RiCheckFill size={18} /> Multi-network social URL validation (Spotify, Apple, TikTok, YouTube)</li>
            </ul>
            <Link to="/register?role=creator" className="role-btn-primary">
              Launch Your Creator Console <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={creatorDashboardImg} alt="TuneMavens Creator Dashboard Console" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Your Path Forward</span>
            <h3 className="role-section-title">How Creators Launch in 3 Simple Steps</h3>
            <p className="role-section-desc">From initial sign-up to monetized catalog and sync-ready live world.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiDatabase2Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Ingestion</span>
              <h4 className="role-step-title">Ingest Your Discography &amp; Stems</h4>
              <p className="role-step-desc">
                Upload your master audio files, assign ISRC tags, upload high-res artwork, and package multi-track stems with our 5-step modal wizard.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiCoinsFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Configuration</span>
              <h4 className="role-step-title">Set Split Cascade Percentages</h4>
              <p className="role-step-desc">
                Lock in split rights for writers, producers, and vocalists. Our automated engine enforces agreement compliance across all downstream sales.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiGlobalFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Monetization</span>
              <h4 className="role-step-title">Deploy EPK World &amp; Receive Payouts</h4>
              <p className="role-step-desc">
                Launch your public web world, sell digital stem packs ($9.99), accept mobile money tips, and watch earnings deposit straight into your payout account.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Ready to Take Ownership of Your Music Career?</h3>
          <p>
            Join thousands of independent artists and producers using TuneMavens to eliminate split disputes and pitch directly to global supervisors.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=creator" className="role-btn-primary">
              Get Started as a Creator <RiArrowRightLine size={15} />
            </Link>
            <Link to="/tools" className="role-btn-secondary">
              Explore AI Tools Suite
            </Link>
          </div>
          <span className="role-trust-note">
            Free Starter plan available · 50 free credits on sign up · No credit card required
          </span>
        </section>
      </div>
    </div>
  );
}
