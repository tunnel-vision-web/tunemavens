import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiFilmFill, 
  RiRadioFill, 
  RiSearchEyeFill, 
  RiFilePaper2Fill, 
  RiShieldCheckFill, 
  RiScales3Fill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiExternalLinkLine,
  RiCompass3Fill,
  RiSoundModuleFill,
  RiFileList3Line
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import syncHeaderImg from '../../../assets/images/sync_header.png'
import userSupervisorImg from '../../../assets/images/user_supervisor.png'
import appsSyncImg from '../../../assets/images/apps_sync.png'
import heroMusic4Img from '../../../assets/images/hero_music_4.png'
import syncLogo from '../../../assets/logos/syncmavens-logo.png'

export default function SupervisorLandingPage() {
  const accent = '#f59e0b';
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
      badge: 'AI Scene Script Tagging',
      dot: '#f59e0b',
      hLine1: 'Pitches That Hit.',
      hLine2: 'Get Licensed for Screen.',
      hLine2Color: '#f59e0b',
      s: 'Translate natural language script notes and director cues into precise sonic tags: BPM, mood, era, and instrumentation. Discover the right sound in seconds.',
      b1: 'Create Supervisor Account',
      b1link: '/register?role=studio',
      b2: 'Launch SyncMavens Platform',
      b2link: syncMavensUrl,
      image: syncHeaderImg
    },
    {
      badge: '100% Pre-Cleared Catalogs',
      dot: '#f59e0b',
      hLine1: 'Zero Legal Red Tape.',
      hLine2: 'Instant Escrow Contracting.',
      hLine2Color: '#f59e0b',
      s: 'Every catalog release carries verified master and publishing rights certificates. Secure one-stop sync clearance without stalled production deadlines.',
      b1: 'Browse Pre-Cleared Vault',
      b1link: '/register?role=studio',
      b2: 'Review Clearance Engine',
      b2link: '#pre-cleared',
      image: userSupervisorImg
    },
    {
      badge: 'Multi-Stem Audition Console',
      dot: '#f59e0b',
      hLine1: 'Audition Isolated Stems.',
      hLine2: '60 FPS Fluid Waveforms.',
      hLine2Color: '#f59e0b',
      s: 'Preview isolated drums, bass, vocals, and instrumental stems with dynamic watermarking and zero latency. Verify scene fit before locking edit cuts.',
      b1: 'Try Interactive Auditions',
      b1link: '/tools',
      b2: 'Inspect Audio Formats',
      b2link: '#stems',
      image: appsSyncImg
    },
    {
      badge: 'Broadcast Cue Sheet Logger',
      dot: '#f59e0b',
      hLine1: 'Automated Cue Sheets.',
      hLine2: 'PRO Regulatory Reports.',
      hLine2Color: '#f59e0b',
      s: 'Export formatted cue sheets compliant with ASCAP, BMI, and PRS directly from project timelines. Ensure artists and publishers receive accurate performance royalties.',
      b1: 'Join Supervisor Roster',
      b1link: '/register?role=studio',
      b2: 'Launch SyncMavens Platform',
      b2link: syncMavensUrl,
      image: heroMusic4Img
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
        aria-label="Music Supervisor Hero Carousel"
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
                src={syncLogo} 
                alt="SyncMavens Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Music Supervisors</span>
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
            <span className="role-stat-value">100% Cleared</span>
            <span className="role-stat-label">Master &amp; Publishing Escrow Guarantee</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">94.8%</span>
            <span className="role-stat-label">AI Scene Prompt Match Relevance</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">0ms</span>
            <span className="role-stat-label">Real-Time Fluid Audio Stem Auditions</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">PRO Ready</span>
            <span className="role-stat-label">Automated Cue Sheets with CAE/ISWC</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="sync-features" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Sync Studio</span>
            <h3 className="role-section-title">Built for High-Stakes Screen &amp; Game Production</h3>
            <p className="role-section-desc">
              From natural language scene prompts to automated cue sheets, SyncMavens speeds up post-production music delivery.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiSearchEyeFill size={24} /></div>
              <h4 className="role-pillar-title">Natural Language Scene Parser</h4>
              <p className="role-pillar-desc">
                Paste creative scene briefs, director mood boards, or screenplay excerpts. Our AI parses tempo, emotional arcs, instrumentation, and genre references to match catalogs instantly.
              </p>
            </div>

            <div className="role-pillar-card" id="pre-cleared" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">100% Pre-Cleared Catalog</h4>
              <p className="role-pillar-desc">
                Every track in our Sync Marketplace is legally pre-cleared with writers and master owners agreeing to standardized terms, eliminating clearance gridlock.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiScales3Fill size={24} /></div>
              <h4 className="role-pillar-title">Escrow Contracts &amp; Clearances</h4>
              <p className="role-pillar-desc">
                Fund sync licensing budgets safely through escrow contracts. Release payments only when final cue sheets, high-res masters, and stem deliveries are signed off.
              </p>
            </div>

            <div className="role-pillar-card" id="stems" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiRadioFill size={24} /></div>
              <h4 className="role-pillar-title">Audition Watermarking</h4>
              <p className="role-pillar-desc">
                Share secure, watermarked preview streams with directors, showrunners, and editors directly in cutting rooms without risk of unauthorized leaks.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFilePaper2Fill size={24} /></div>
              <h4 className="role-pillar-title">Automated Cue Sheet Generation</h4>
              <p className="role-pillar-desc">
                Export standard cue sheet templates populated with verified ISRC, ISWC, songwriter CAE/IPI numbers, and duration timestamps ready for PRO submission.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiCompass3Fill size={24} /></div>
              <h4 className="role-pillar-title">Sync Licensing Supervisor Console</h4>
              <p className="role-pillar-desc">
                Monitor sync licensing budgets, active project briefs (films, commercials, video games), and licensed track counts under your dedicated supervisor console.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Licensing Studio</span>
            <h3>SyncMavens Licensing &amp; Brief Marketplace</h3>
            <p>
              Collaborate directly with our global creative network. Test AI brief matching on actual scene queries and review sync match scores (94%+ match precision) in real time.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Natural language scene query search ("Energetic Afrobeat for car chase")</li>
              <li><RiCheckFill size={18} /> Instant access to full multi-track stems (drums, bass, melodies, vocals)</li>
              <li><RiCheckFill size={18} /> Multi-territory, worldwide media buyout and festival licensing options</li>
              <li><RiCheckFill size={18} /> Direct line to verified songwriters and label A&amp;Rs</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/register?role=studio" className="role-btn-primary">
                Join Supervisor Network <RiArrowRightLine size={14} />
              </Link>
              <a href={syncMavensUrl} className="role-btn-secondary" target="_blank" rel="noopener noreferrer">
                Launch SyncMavens <RiExternalLinkLine size={14} />
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={appsSyncImg} alt="TuneMavens Sync Licensing and Brief Search" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Licensing Flow</span>
            <h3 className="role-section-title">How Supervisors License Music in 3 Steps</h3>
            <p className="role-section-desc">From brief description to broadcast-ready cue sheet delivery.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiSearchEyeFill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Query</span>
              <h4 className="role-step-title">Submit Scene Brief or Script Prompt</h4>
              <p className="role-step-desc">
                Type or paste your creative requirements. Sync Brief AI analyzes the mood, scene pacing, and instrumentation to filter the catalog.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiSoundModuleFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Audition</span>
              <h4 className="role-step-title">Audition Watermarked Masters &amp; Stems</h4>
              <p className="role-step-desc">
                Review high-matching candidates, test stems against dialogue, and generate a shared private reel for the director and producer team.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiFileList3Line size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Clearance</span>
              <h4 className="role-step-title">Execute Instant Escrow Clearance</h4>
              <p className="role-step-desc">
                Confirm your budget tier, sign standardized digital agreements, release escrow funds, and receive lossless master WAVs and cue sheets.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Never Miss a Production Music Clearance Deadline</h3>
          <p>
            Join music supervisors from Netflix, HBO, indie film houses, and game studios using TuneMavens to discover authentic, pre-cleared music.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=studio" className="role-btn-primary">
              Register Free as a Music Supervisor <RiArrowRightLine size={15} />
            </Link>
            <a href={syncMavensUrl} className="role-btn-secondary" target="_blank" rel="noopener noreferrer">
              Browse SyncMavens Catalog <RiExternalLinkLine size={14} />
            </a>
          </div>
          <span className="role-trust-note">
            Pre-cleared worldwide indemnification · Non-exclusive &amp; buyout options · Dedicated supervisor concierge
          </span>
        </section>
      </div>
    </div>
  );
}
