import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiTv2Fill, 
  RiRadio2Fill, 
  RiFilePaperFill, 
  RiShieldCheckFill, 
  RiTimeFill, 
  RiEqualizerFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiBroadcastFill,
  RiFolderDownloadFill,
  RiFileLine
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_apps.png'
import publishingMockupImg from '../../../assets/images/publishing_dashboard_mockup.png'
import tunestreamHeader3Img from '../../../assets/images/tunestream_header_3.png'
import tourDashboardMockupImg from '../../../assets/images/tour_dashboard_mockup.png'
import managementLogo from '../../../assets/logos/tunemanagement-logo.png'

export default function MediaHouseLandingPage() {
  const accent = '#2563eb';

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
      badge: 'Automated Broadcast Compliance',
      dot: '#2563eb',
      hLine1: 'Automate Broadcast Logs.',
      hLine2: '100% PRO Compliance.',
      hLine2Color: '#2563eb',
      s: 'Convert station audio playlogs into standardized ASCAP, BMI, and PRS cue sheet reports. Eliminate manual logging and avoid regulatory fines.',
      b1: 'Set Up Broadcaster Account',
      b1link: '/register?role=media',
      b2: 'Explore Playlog Formatter',
      b2link: '#compliance',
      image: headerImg
    },
    {
      badge: 'Licensing Discrepancy Auditing',
      dot: '#2563eb',
      hLine1: 'Detect Licensing Conflicts.',
      hLine2: 'Real-Time Verification.',
      hLine2Color: '#2563eb',
      s: 'Our neural audit engine parses on-air music logs against multi-label databases, flagging missing mechanical licenses and uncredited songwriters before airtime.',
      b1: 'Run Playlog Audit',
      b1link: '/publishing',
      b2: 'Review Audit Engine',
      b2link: '#discrepancy',
      image: publishingMockupImg
    },
    {
      badge: 'High-Throughput Audio CDN',
      dot: '#2563eb',
      hLine1: 'High-Throughput Ingest.',
      hLine2: 'Broadcast 24-bit Audio.',
      hLine2Color: '#2563eb',
      s: 'Batch ingest high-volume audio packages with clean ID3 tags, BPM, loudness normalization, and verified stems ready for radio station playout systems.',
      b1: 'Access Broadcast Portal',
      b1link: '/register?role=media',
      b2: 'Explore Audio Engine',
      b2link: '#audio-cdn',
      image: tunestreamHeader3Img
    },
    {
      badge: 'Performance Royalty Tracking',
      dot: '#2563eb',
      hLine1: 'Track Station Spin Counts.',
      hLine2: 'Transparent Royalties.',
      hLine2Color: '#2563eb',
      s: 'Provide record labels and artists with verifiable airplay logs, supporting grassroots creator royalty distribution across terrestrial and internet radio.',
      b1: 'Join Broadcaster Network',
      b1link: '/register?role=media',
      b2: 'Tour & Live Engine',
      b2link: '/tours',
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
        aria-label="Media House Hero Carousel"
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
                src={managementLogo} 
                alt="TuneManagement Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Media Houses</span>
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
            <span className="role-stat-value">100% PRO</span>
            <span className="role-stat-label">ASCAP, BMI &amp; PRS Formatted Exports</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">&lt; 30s</span>
            <span className="role-stat-label">Automation Playlog Ingest &amp; Parse Time</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">EBU R128</span>
            <span className="role-stat-label">Automated Loudness Normalization Audits</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Multi-Station</span>
            <span className="role-stat-label">Affiliate Syndication &amp; Sub-Network Routing</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="compliance" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Broadcaster Infrastructure</span>
            <h3 className="role-section-title">Engineered for Terrestrial, Satellite &amp; Digital Airwaves</h3>
            <p className="role-section-desc">
              From automated station rotation playlogs to discrepancy detection, ensure broadcast compliance effortlessly.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card" id="discrepancy" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">AI Discrepancy Detector</h4>
              <p className="role-pillar-desc">
                Drag-and-drop broadcast log dumps. Our AI audits track titles, durations, and ISRC codes against the global database to highlight unverified spins before submission.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiRadio2Fill size={24} /></div>
              <h4 className="role-pillar-title">Station Queue Music Routing</h4>
              <p className="role-pillar-desc">
                Curate verified rotation playlists across multiple station branches, ensuring on-air DJs only broadcast pre-approved master recordings.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiTimeFill size={24} /></div>
              <h4 className="role-pillar-title">Timestamped Transmission Logs</h4>
              <p className="role-pillar-desc">
                Maintain immutable broadcast transmission logs with exact play duration down to the millisecond, safeguarding your broadcast license.
              </p>
            </div>

            <div className="role-pillar-card" id="audio-cdn" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiEqualizerFill size={24} /></div>
              <h4 className="role-pillar-title">Loudness &amp; EQ Compliance</h4>
              <p className="role-pillar-desc">
                Ensure station audio masters comply with EBU R128 and CALM Act television broadcast loudness regulations before going live on air.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiTv2Fill size={24} /></div>
              <h4 className="role-pillar-title">Syndication &amp; Sub-Network Routing</h4>
              <p className="role-pillar-desc">
                Manage syndicated programming schedules and split royalty allocations across affiliate stations under a single master network dashboard.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFilePaperFill size={24} /></div>
              <h4 className="role-pillar-title">Instant PRO Report Formatter</h4>
              <p className="role-pillar-desc">
                Convert station logs into audit-ready reports formatted precisely for statutory collection societies with CAE, ISWC, and duration totals.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Compliance Center</span>
            <h3>Publishing &amp; Broadcast Compliance Suite</h3>
            <p>
              Consolidate your radio and television operations. Ingest playlogs, reconcile metadata discrepancies with songwriters, and export audit-ready reports.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Automated ISRC and cue duration matching</li>
              <li><RiCheckFill size={18} /> Compatible with RCS Zetta, Dalet, WideOrbit, and Selector</li>
              <li><RiCheckFill size={18} /> Direct export for ASCAP, BMI, SESAC, PRS, and MCSK</li>
              <li><RiCheckFill size={18} /> Unlimited monthly playlog audits on Business and Enterprise tiers</li>
            </ul>
            <Link to="/register?role=media" className="role-btn-primary">
              Set Up Broadcaster Network <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={publishingMockupImg} alt="TuneMavens Broadcast Compliance and Publishing Dashboard" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Broadcaster Workflow</span>
            <h3 className="role-section-title">How Media Houses Automate Compliance</h3>
            <p className="role-section-desc">Streamlined reporting in 3 simple steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiBroadcastFill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Ingestion</span>
              <h4 className="role-step-title">Ingest Automation Playlog Files</h4>
              <p className="role-step-desc">
                Upload CSV, XML, or TXT exports directly from your radio/TV broadcast automation software (Zetta, Dalet, WideOrbit).
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiShieldCheckFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · AI Audit</span>
              <h4 className="role-step-title">Run AI Discrepancy Detection</h4>
              <p className="role-step-desc">
                Our detector flags uncredited tracks, missing ISRC codes, or unregistered publishing shares and recommends verified catalog matches.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiFilePaperFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Submission</span>
              <h4 className="role-step-title">Export Certified PRO Reports</h4>
              <p className="role-step-desc">
                Generate formatted, regulatory-compliant playlogs ready for 1-click submission to performing rights organizations and statutory boards.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Simplify Your Station's Music Compliance Today</h3>
          <p>
            Save hundreds of hours in manual reporting. Ensure full statutory compliance and protect your broadcast licensing.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=media" className="role-btn-primary">
              Register as a Media House <RiArrowRightLine size={15} />
            </Link>
            <Link to="/publishing" className="role-btn-secondary">
              View Publishing Standards
            </Link>
          </div>
          <span className="role-trust-note">
            Multi-station network licensing · Enterprise SLAs available · Zero data lock-in
          </span>
        </section>
      </div>
    </div>
  );
}
