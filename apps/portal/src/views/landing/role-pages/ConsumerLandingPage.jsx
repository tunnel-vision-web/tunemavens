import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiHeadphoneFill, 
  RiHeartFill, 
  RiCoinsFill, 
  RiFolderMusicFill, 
  RiQrCodeFill, 
  RiCompass3Fill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiExternalLinkLine,
  RiPlayFill,
  RiDiscFill,
  RiEqualizerFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import listenHeroImg from '../../../assets/images/listen_hero.png'
import consumerAppImg from '../../../assets/images/consumer_app.png'
import tunestreamHeaderImg from '../../../assets/images/tunestream_header.png'
import tunestreamHeader2Img from '../../../assets/images/tunestream_header_2.png'
import listenLogo from '../../../assets/logos/tunestream-logo.png'

export default function ConsumerLandingPage() {
  const accent = '#10b981';
  const tuneStreamUrl = getServiceUrl('tunestream');

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
      badge: 'High-Fidelity Lossless Playback',
      dot: '#10b981',
      hLine1: 'Listen in Pure Fidelity.',
      hLine2: 'Uncompressed 24-bit Audio.',
      hLine2Color: '#10b981',
      s: 'Stream studio master audio ad-free. Experience crystal-clear dynamic range, spatial separation, and offline caching powered by TuneStream.',
      b1: 'Start Free Streaming',
      b1link: tuneStreamUrl,
      b2: 'Explore Music Features',
      b2link: '#playback-features',
      image: listenHeroImg
    },
    {
      badge: 'Direct Creator Tipping',
      dot: '#10b981',
      hLine1: 'Support Artists Directly.',
      hLine2: 'Zero Middleman Margins.',
      hLine2Color: '#10b981',
      s: 'Tip creators with one tap via M-Pesa mobile money, cards, and digital wallets. 100% of your contributions route straight into verified artist balances.',
      b1: 'Join as a Listener',
      b1link: '/register?role=consumer',
      b2: 'View Payout Model',
      b2link: '#direct-tipping',
      image: consumerAppImg
    },
    {
      badge: 'Digital Vinyl & Merch Vault',
      dot: '#10b981',
      hLine1: 'Own the Art.',
      hLine2: 'Limited Collectibles.',
      hLine2Color: '#10b981',
      s: 'Collect uncompressed stem drops, limited-edition vinyl, verified concert tickets, and exclusive EPK merchandise straight from independent creators.',
      b1: 'Browse Music Store',
      b1link: tuneStreamUrl,
      b2: 'Discover Merch Drops',
      b2link: '#merch-vault',
      image: tunestreamHeaderImg
    },
    {
      badge: 'Offline Vault & Sync Pass',
      dot: '#10b981',
      hLine1: 'Music Wherever You Go.',
      hLine2: 'Offline Encrypted Playback.',
      hLine2Color: '#10b981',
      s: 'Download playlists for planes, underground commutes, and rural road trips. Sync seamlessly across desktop, tablet, and mobile devices.',
      b1: 'Open TuneStream Web',
      b1link: tuneStreamUrl,
      b2: 'Explore Audio Formats',
      b2link: '#vault',
      image: tunestreamHeader2Img
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
        aria-label="Everyday Listener Hero Carousel"
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
                src={listenLogo} 
                alt="TuneStream Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Everyday Listeners</span>
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
            <span className="role-stat-value">24-bit / 96kHz</span>
            <span className="role-stat-label">Lossless Master Audio Quality</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100% Direct</span>
            <span className="role-stat-label">Mobile Money Creator Tipping (M-Pesa, Cards)</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">0 Ads</span>
            <span className="role-stat-label">Uninterrupted Continuous Playback</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">150 Credits</span>
            <span className="role-stat-label">Free Welcome Stream Token Grant</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="playback-features" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Pristine Consumer Listening</span>
            <h3 className="role-section-title">Engineered for Pure Audio Immersion</h3>
            <p className="role-section-desc">
              Experience dynamic studio masters, zero corporate ad interruptions, and direct connection to your favorite artists.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiHeadphoneFill size={24} /></div>
              <h4 className="role-pillar-title">Lossless Studio Quality</h4>
              <p className="role-pillar-desc">
                Hear music exactly as the producer mastered it in the studio. Uncapped high-resolution playback with 60fps waveform scrubbers and zero compression artifacts.
              </p>
            </div>

            <div className="role-pillar-card" id="direct-tipping" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiHeartFill size={24} /></div>
              <h4 className="role-pillar-title">1-Tap Direct Tipping</h4>
              <p className="role-pillar-desc">
                Tip artists directly through M-Pesa STK push, Apple Pay, Google Pay, or debit cards. 100% of fan tips cascade straight into the creator's payout split.
              </p>
            </div>

            <div className="role-pillar-card" id="merch-vault" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiFolderMusicFill size={24} /></div>
              <h4 className="role-pillar-title">Personal Vault &amp; Playlists</h4>
              <p className="role-pillar-desc">
                Create and curate custom playlists. Download purchased singles, albums ($9.99 / 50 credits), and isolated stems into your permanent personal collection.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiQrCodeFill size={24} /></div>
              <h4 className="role-pillar-title">Live Concert QR Passes</h4>
              <p className="role-pillar-desc">
                Buy event tickets directly through artist EPK web worlds with instant M-Pesa push. Store digital QR codes in your account for frictionless venue entry.
              </p>
            </div>

            <div className="role-pillar-card" id="vault" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Unified Network Credits</h4>
              <p className="role-pillar-desc">
                One wallet balance shared across TuneMavens, TuneStream, and the entire Intermaven network. Use credits for stream tokens, stem packs, and digital merch.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiCompass3Fill size={24} /></div>
              <h4 className="role-pillar-title">Region-Aware Curation</h4>
              <p className="role-pillar-desc">
                Switch regions seamlessly between East Africa (Nairobi, Kampala, Dar es Salaam) and Global scenes to discover trending grassroots sounds first.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">The App In Action</span>
            <h3>TuneStream Player &amp; Fan Analytics Console</h3>
            <p>
              Listen on any device. Track your listening playtime hours, favorite genres (Afrobeat, Amapiano, Hip-Hop), and support streaks in your personalized listener console.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Butter-smooth 60fps player with real-time waveform scrubbers</li>
              <li><RiCheckFill size={18} /> Support creators directly without 30% platform cuts</li>
              <li><RiCheckFill size={18} /> Multi-device session pickup across web and mobile browsers</li>
              <li><RiCheckFill size={18} /> Full album showcases with analog synthesizer and liner notes</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href={tuneStreamUrl} className="role-btn-primary" target="_blank" rel="noopener noreferrer">
                Open TuneStream Web Player <RiPlayFill size={14} style={{ marginLeft: '6px' }} />
              </a>
              <Link to="/register?role=consumer" className="role-btn-secondary">
                Sign Up for Free
              </Link>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={consumerAppImg} alt="TuneStream Listener App and Music Player" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Listener Journey</span>
            <h3 className="role-section-title">How to Get Started on TuneStream</h3>
            <p className="role-section-desc">Experience genuine independent music discovery in 3 quick steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiCompass3Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Preferences</span>
              <h4 className="role-step-title">Select Favorite Genres &amp; Creators</h4>
              <p className="role-step-desc">
                Pick the sounds you love (Afro-House, Deep House, Amapiano, R&amp;B) and follow verified creators to personalize your daily feed.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiHeadphoneFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Discovery</span>
              <h4 className="role-step-title">Stream Lossless Audio Ad-Free</h4>
              <p className="role-step-desc">
                Enjoy continuous, uncapped playback with butter-smooth scrubbers, dynamic track liner notes, and curated editorial selections.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiHeartFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Connection</span>
              <h4 className="role-step-title">Tip Directly &amp; Grab Live Passes</h4>
              <p className="role-step-desc">
                Send direct tips using mobile money, buy stems or digital albums, and purchase digital QR passes to upcoming creator tour dates.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Step Into High-Definition Sound</h3>
          <p>
            Join music enthusiasts supporting their favorite artists directly with fair splits and uncompressed audio fidelity.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=consumer" className="role-btn-primary">
              Create Free Listener Account <RiArrowRightLine size={15} />
            </Link>
            <a href={tuneStreamUrl} className="role-btn-secondary" target="_blank" rel="noopener noreferrer">
              Launch TuneStream Portal <RiExternalLinkLine size={14} style={{ marginLeft: '6px' }} />
            </a>
          </div>
          <span className="role-trust-note">
            Free forever tier · 150 free credits on sign up · No credit card required to listen
          </span>
        </section>
      </div>
    </div>
  );
}
