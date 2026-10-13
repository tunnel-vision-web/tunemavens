import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiDiscFill, 
  RiHeadphoneFill, 
  RiFolderDownloadFill, 
  RiRadioFill, 
  RiShieldCheckFill, 
  RiSoundModuleFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiPlayListFill,
  RiCompass3Fill,
  RiSpeedUpFill,
  RiEqualizerFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_tools.png'
import appsLedgerImg from '../../../assets/images/apps_ledger.png'
import heroMusic4Img from '../../../assets/images/hero_music_4.png'
import heroMusic3Img from '../../../assets/images/hero_music_3.png'
import bookingLogo from '../../../assets/logos/tunebooking-logo.png'

export default function DjLandingPage() {
  const accent = '#14b8a6';

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
      badge: 'HQ Lossless Record Pool',
      dot: '#14b8a6',
      hLine1: 'Spin in Pure Fidelity.',
      hLine2: 'Zero Compression Loss.',
      hLine2Color: '#14b8a6',
      s: 'Pristine 24-bit WAV, FLAC, and 320kbps MP3 batch downloads packaged with verified Rekordbox ID3 tags, BPM detection, and high-res cover art.',
      b1: 'Access DJ Record Pool',
      b1link: '/register?role=dj',
      b2: 'Explore Lossless Vault',
      b2link: '#pool-capabilities',
      image: headerImg
    },
    {
      badge: 'Stem Clearance & Dubplate Engine',
      dot: '#14b8a6',
      hLine1: 'Remix with Confidence.',
      hLine2: '100% Legal Clearances.',
      hLine2Color: '#14b8a6',
      s: 'Secure verifiable digital drop hashes and stem clearance licenses directly from copyright holders. Spin live and stream sets without DMCA strikes.',
      b1: 'Clear Stem Permissions',
      b1link: '/register?role=dj',
      b2: 'Review IP Engine',
      b2link: '#stem-engine',
      image: appsLedgerImg
    },
    {
      badge: 'Club & Festival Set Logging',
      dot: '#14b8a6',
      hLine1: 'Resident Venues to Mainstage.',
      hLine2: 'Automated Set Cue Sheets.',
      hLine2Color: '#14b8a6',
      s: 'Export verified set cue sheets and playlist logs for club promoters, festival organizers, and radio broadcasters to ensure artists receive performance royalties.',
      b1: 'Join Verified DJ Roster',
      b1link: '/register?role=dj',
      b2: 'Explore DJ Apps',
      b2link: '/apps',
      image: heroMusic4Img
    },
    {
      badge: 'Curated Dubplates & Extended Edits',
      dot: '#14b8a6',
      hLine1: 'Intro, Quick-Hit & Acapellas.',
      hLine2: 'Built for Performance.',
      hLine2Color: '#14b8a6',
      s: '8-bar intro edits, quick-hit transition drops, clean radio cuts, and isolated vocal dubplates delivered straight from verified independent labels and producers.',
      b1: 'Get Started Free',
      b1link: '/register?role=dj',
      b2: 'View Audio Formats',
      b2link: '#formats',
      image: heroMusic3Img
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
        aria-label="DJ Hero Carousel"
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
                src={bookingLogo} 
                alt="TuneBooking Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>DJs</span>
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
            <span className="role-stat-value">FLAC / WAV</span>
            <span className="role-stat-label">Lossless 24-bit Uncompressed Masters</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100% Cleared</span>
            <span className="role-stat-label">Stem Remix IP Permissions with Proof Hashes</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Instant</span>
            <span className="role-stat-label">BPM, Key &amp; Waveform Transient Detection</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Direct Link</span>
            <span className="role-stat-label">BPM Supreme, Franchise &amp; TuneMavens Pools</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid (All Icons Horizontally Centered in Content Box) */}
        <section id="pool-capabilities" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">DJ Pool Capabilities</span>
            <h3 className="role-section-title">Engineered for Seamless Performance &amp; Track Curation</h3>
            <p className="role-section-desc">
              Get the cleanest versions of trending club anthems, intro edits, instrumentals, and acapellas directly from verified creators.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFolderDownloadFill size={24} /></div>
              <h4 className="role-pillar-title">TuneMavens Lossless Pool</h4>
              <p className="role-pillar-desc">
                Download pristine WAV and 320kbps MP3s directly into your USB flash drives or Rekordbox library with clean ID3 tags, album art, and accurate BPM markers.
              </p>
            </div>

            <div className="role-pillar-card" id="stem-engine" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiSoundModuleFill size={24} /></div>
              <h4 className="role-pillar-title">Stem Clearance Engine</h4>
              <p className="role-pillar-desc">
                Clear remix permissions directly with copyright holders. Secure digital drop hashes and perform remixes at festivals without risking copyright strikes.
              </p>
            </div>

            <div className="role-pillar-card" id="formats" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiRadioFill size={24} /></div>
              <h4 className="role-pillar-title">Intro, Quick-Hit &amp; Acapella Edits</h4>
              <p className="role-pillar-desc">
                Every release includes performance-ready DJ edits: 8-bar intro edits, quick-hit transitions, clean radio versions, and raw isolated acapellas.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiPlayListFill size={24} /></div>
              <h4 className="role-pillar-title">Automated Cue Sheet Logger</h4>
              <p className="role-pillar-desc">
                Export verified tracklists and set logs for radio broadcasters and festival compliance to ensure original creators receive proper performance royalties.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiHeadphoneFill size={24} /></div>
              <h4 className="role-pillar-title">DJ Ingest &amp; Download Console</h4>
              <p className="role-pillar-desc">
                Track your mix download stats, downloaded stem clearances, and format distribution (MP3 vs WAV) in your personalized DJ dashboard.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Direct Artist Drops &amp; Dubplates</h4>
              <p className="role-pillar-desc">
                Connect directly with trending producers to receive exclusive promotional dubplates and unreleased club mixes before global commercial releases.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section (Constricted to 1240px) */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Performance Studio</span>
            <h3>DJ Ingest &amp; Download Analytics</h3>
            <p>
              Manage your personal record collection, review stem clearance requests, and sync your resident venue gig profile with zero latency.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> 100% legal rights clearance certificates for every download</li>
              <li><RiCheckFill size={18} /> High-speed batch download queues for weekend set preparation</li>
              <li><RiCheckFill size={18} /> Synchronized feedback ratings direct to record labels and artists</li>
              <li><RiCheckFill size={18} /> Compatible with Pioneer Rekordbox, Serato DJ Pro, and Traktor</li>
            </ul>
            <Link to="/register?role=dj" className="role-btn-primary">
              Join the Verified DJ Roster <RiArrowRightLine size={14} />
            </Link>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={appsLedgerImg} alt="TuneMavens DJ Pool and Stem Clearance Engine" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path (All Icons Horizontally Centered in Content Box) */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">DJ Fast-Track</span>
            <h3 className="role-section-title">From Resident Venue to Global Club Sets</h3>
            <p className="role-section-desc">Get prepped for your next live set in 3 simple steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiCompass3Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Setup</span>
              <h4 className="role-step-title">Build Your DJ Identity Profile</h4>
              <p className="role-step-desc">
                Select your primary mixing genres (Afro-House, Amapiano, Techno, Hip-Hop), resident venues, and club territories during onboarding.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiSpeedUpFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Curation</span>
              <h4 className="role-step-title">Queue &amp; Download Lossless Tracks</h4>
              <p className="role-step-desc">
                Browse curated record pools, preview uncompressed masters, select intro edits, and batch download directly into your performance library.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiEqualizerFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Performance</span>
              <h4 className="role-step-title">Play With Certified Stem Clearance</h4>
              <p className="role-step-desc">
                Spin pre-cleared remix stems live with automated digital proof hashes, protecting your venue and live streams from DMCA takedowns.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner (Constricted to 1240px) */}
        <section className="role-conversion-banner">
          <h3>Upgrade Your DJ Record Pool Today</h3>
          <p>
            Equip your live sets with uncompressed master audio, certified stem clearances, and exclusive producer dubplates.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=dj" className="role-btn-primary">
              Register Free as a DJ <RiArrowRightLine size={15} />
            </Link>
            <Link to="/tools" className="role-btn-secondary">
              Explore Music Operations Engine
            </Link>
          </div>
          <span className="role-trust-note">
            Free onboarding tier · Rekordbox &amp; Serato ready · High-speed global CDN downloads
          </span>
        </section>
      </div>
    </div>
  );
}
