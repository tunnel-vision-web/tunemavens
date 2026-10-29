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
  RiEqualizerFill,
  RiCloseFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_tools.png'
import appsLedgerImg from '../../../assets/images/apps_ledger.png'
import heroMusic4Img from '../../../assets/images/hero_music_4.png'
import heroMusic3Img from '../../../assets/images/hero_music_3.png'
import bookingLogo from '../../../assets/logos/tunebooking-logo.png'

const FALLBACK_DJ_RATES = [
  {
    slug: 'dj-resident',
    name: 'Club Resident Load',
    tier_badge: 'Essential Pool',
    price_usd: 19.0,
    billing_period: 'one-time credit reload',
    credits: 200,
    key_metric: '50 Lossless Downloads · Clean & Dirty Edits',
    features: [
      'Access curated record pools across Afrobeat, Amapiano, Hip Hop, and Dance',
      'Pre-analyzed tracks with verified BPM, musical key, and Rekordbox cue markers',
      '50 high-speed track downloads with intro/outro extended edits (non-expiring)',
      'Compatible with Pioneer Rekordbox, Serato DJ Pro, and Traktor Pro',
      'Verified DJ identity badge on TuneStream and community forums'
    ],
    is_popular: false,
    cta: 'Join DJ Pool'
  },
  {
    slug: 'dj-touring',
    name: 'Touring Pro DJ Load',
    tier_badge: 'Most Popular',
    price_usd: 49.0,
    billing_period: 'one-time credit reload',
    credits: 600,
    key_metric: 'Unlimited Downloads · Stems & Exclusive Dubplates',
    features: [
      'Lossless WAV masters and separated remix stems download pack',
      'Exclusive unreleased artist dubplates & early club test pressings before public release',
      'Digital proof clearance hashes protecting your venue and live streams from DMCA strikes',
      'Direct feedback loop: rate unreleased tracks to send data straight to record label A&Rs',
      '600 unified credits load for high-priority dubplate requests (zero monthly fees)',
      'Priority download queue bandwidth for weekend set preparation'
    ],
    is_popular: true,
    cta: 'Go Touring Pro'
  },
  {
    slug: 'dj-headliner',
    name: 'Headline & Festival Curator Load',
    tier_badge: 'Taste-Maker',
    price_usd: 129.0,
    billing_period: 'one-time credit reload',
    credits: 1800,
    key_metric: 'Direct Label Drop Inbox & Radio Mix Distribution',
    features: [
      'Personalized promo inbox where top labels send unreleased tracks directly for your sets',
      'Host verified syndicated mix series & live DJ sessions on TuneStream Web Radio',
      'Monetize live DJ sets with direct listener tipping and listener tip splits',
      'VIP access to artist tour soundchecks and festival press rooms',
      '1,800 unified credits load & personal artist liaison support (zero monthly fees)'
    ],
    is_popular: false,
    cta: 'Apply for Headliner Tier'
  }
];

export default function DjLandingPage({ switcher }) {
  const accent = '#14b8a6';

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_DJ_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'dj-touring',
    dj_software: 'Pioneer Rekordbox',
    resident_city: 'Nairobi / Global Touring',
    estimated_budget: '$49 one-time credit reload (600 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/dj/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback DJ rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'HQ Lossless Record Pool',
      dot: '#14b8a6',
      hLine1: 'Spin in Pure Fidelity.',
      hLine2: 'Zero Compression Loss.',
      hLine2Color: '#14b8a6',
      s: 'Pristine 24-bit WAV, FLAC, and 320kbps MP3 batch downloads packaged with verified Rekordbox ID3 tags, BPM detection, and high-res cover art.',
      b1: 'Review DJ Pool Plans',
      b1link: '#dj-rates',
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
      b1: 'Clear Stems Live',
      b1link: '/register?role=dj',
      b2: 'Stem Clearance Protocol',
      b2link: '#stem-clearance',
      image: appsLedgerImg
    },
    {
      badge: 'Curated Extended DJ Edits',
      dot: '#14b8a6',
      hLine1: 'Club-Tested Intros.',
      hLine2: 'Quick Transition Outros.',
      hLine2Color: '#14b8a6',
      s: 'Every track includes 8-bar drum intros, vocal-up cuts, and transition tools optimized for fast-paced club, festival, and radio broadcast performances.',
      b1: 'Preview Club Edits',
      b1link: '/tools',
      b2: 'Edit Structure Specs',
      b2link: '#edit-specs',
      image: heroMusic4Img
    },
    {
      badge: 'Early Access Artist Drops',
      dot: '#14b8a6',
      hLine1: 'Exclusive Unreleased Cuts.',
      hLine2: 'Test Track Reactions.',
      hLine2Color: '#14b8a6',
      s: 'Receive private pre-release dubplates from verified producers. Provide dancefloor feedback and rate crowd response directly back to artists and labels.',
      b1: 'Join Promo Roster',
      b1link: '/register?role=dj',
      b2: 'Label Feedback Engine',
      b2link: '#feedback-loop',
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
    const el = document.getElementById('dj-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#dj-rates');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      estimated_budget: `$${tier.price_usd?.toLocaleString()} one-time credit reload (${tier.credits?.toLocaleString()} Credits)`
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
        role: 'dj',
        organization_name: bookingForm.organization_name || bookingForm.contact_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        notes: `Software: ${bookingForm.dj_software} | Location: ${bookingForm.resident_city}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/dj/inquiries', {
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
        aria-label="DJs & Curators Hero Carousel"
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
                src={bookingLogo} 
                alt="TuneBooking Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>DJs &amp; Curators</span>
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

      {switcher}

      {/* ================= 2. Main Content ================= */}
      <div className="role-container">
        <section className="role-stats-ribbon" style={{ marginTop: '40px' }}>
          <div className="role-stat-item">
            <span className="role-stat-value">320k / WAV</span>
            <span className="role-stat-label">Lossless Audio Downloads</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">DMCA-Safe Performance Rights</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">8-Bar</span>
            <span className="role-stat-label">Curated Extended DJ Intro Edits</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">VIP</span>
            <span className="role-stat-label">Direct Label Promo Drop Inbox</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="pool-capabilities" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">The Performance Pool</span>
            <h3 className="role-section-title">Engineered for Club, Festival &amp; Radio Sets</h3>
            <p className="role-section-desc">
              From uncompressed audio downloads to verifiable stem clearance certificates, take your mixing to the next level.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiSoundModuleFill size={24} /></div>
              <h4 className="role-pillar-title">Verified Rekordbox &amp; Serato Cues</h4>
              <p className="role-pillar-desc">
                Every track comes pre-analyzed with accurate musical key (Camelot Wheel), BPM detection, and beat grid markers ready to drop onto your flash drive.
              </p>
            </div>

            <div className="role-pillar-card" id="stem-clearance" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Stem Performance Clearance</h4>
              <p className="role-pillar-desc">
                Download isolated acapellas and instrumentals backed by legal stem clearance licenses, protecting live stream sets from copyright mutes.
              </p>
            </div>

            <div className="role-pillar-card" id="edit-specs" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiDiscFill size={24} /></div>
              <h4 className="role-pillar-title">Club Extended &amp; Transition Edits</h4>
              <p className="role-pillar-desc">
                Extended clean, dirty, instrumental, and transition edits (e.g. 100 to 128 BPM) created by seasoned resident DJs for seamless mixing.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFolderDownloadFill size={24} /></div>
              <h4 className="role-pillar-title">Batch Queue Downloads</h4>
              <p className="role-pillar-desc">
                Build your weekend setlist and batch download 50+ lossless files in a single high-speed zip archive directly from our global CDN.
              </p>
            </div>

            <div className="role-pillar-card" id="feedback-loop" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiRadioFill size={24} /></div>
              <h4 className="role-pillar-title">Taste-Maker Feedback Loop</h4>
              <p className="role-pillar-desc">
                Rate unreleased test pressings and provide dancefloor reactions directly back to label A&amp;Rs, unlocking exclusive promotional crates.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiHeadphoneFill size={24} /></div>
              <h4 className="role-pillar-title">Direct Artist Drops &amp; Dubplates</h4>
              <p className="role-pillar-desc">
                Connect directly with trending producers to receive exclusive promotional dubplates and unreleased club mixes before global commercial releases.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
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
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=dj" className="role-btn-primary">
                Join the Verified DJ Roster <RiArrowRightLine size={14} />
              </Link>
              <a href="#dj-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review DJ Pool Plans
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={appsLedgerImg} alt="TuneMavens DJ Pool and Stem Clearance Engine" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
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

        {/* ================= 6. COMMERCIAL DJ RATES & TIERS ================= */}
        <section id="dj-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Transparent DJ Pool Subscriptions</span>
            <h3 className="role-section-title">Record Pool Tiers &amp; Curator Memberships</h3>
            <p className="role-section-desc">
              From resident club DJs needing high-speed batch downloads to headline festival taste-makers premiering exclusive unreleased dubplates.
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

                <span className="role-rate-badge">{rate.tier_badge || 'DJ Tier'}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price">${rate.price_usd?.toLocaleString()}</span>
                  <span className="role-rate-period">one-time credit reload</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {rate.credits?.toLocaleString()} Non-Expiring TM Credits
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric || 'DJ Pool Access'}
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
                  {rate.cta || 'Join Pool'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Technical Specs & Compliance Panel */}
          <div className="role-specs-panel">
            <h4 className="role-specs-title">
              <RiShieldCheckFill size={20} color={accent} /> DJ Pool Technical Standards &amp; Clearance Verification
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Audio Formats</span>
                <div className="role-spec-value">
                  Pristine 24-bit WAV &amp; 320kbps CBR MP3 with pre-analyzed Rekordbox ID3 cues, musical key, and BPM metadata.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Edit Formats</span>
                <div className="role-spec-value">
                  Extended Club Mix (8-bar intro/outro), Radio Edit, Instrumental, and Vocal Acapella stem packages.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Performance Indemnity</span>
                <div className="role-spec-value">
                  Authorized promotional performance licenses protecting resident venues, clubs, and live streams from DMCA strikes.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Software Compatibility</span>
                <div className="role-spec-value">
                  Fully certified for Pioneer Rekordbox (Export &amp; Performance mode), Serato DJ Pro, Traktor Pro 3, and VirtualDJ.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Upgrade Your DJ Record Pool Today</h3>
          <p>
            Equip your live sets with uncompressed master audio, certified stem clearances, and exclusive producer dubplates.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=dj" className="role-btn-primary">
              Register Free as a DJ <RiArrowRightLine size={15} />
            </Link>
            <a href="#dj-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review DJ Pool Plans
            </a>
          </div>
          <span className="role-trust-note">
            Free onboarding tier · Rekordbox &amp; Serato ready · High-speed global CDN downloads
          </span>
        </section>
      </div>

      {/* ================= 8. DJ PLAN BOOKING & ONBOARDING MODAL ================= */}
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
                  DJ Pool Membership Logged
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
                  {inquirySuccess.msg} Your pool profile has been registered and credentials routed to Intermaven Smart CRM.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=dj" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Complete DJ Profile
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    DJ Pool Plan Reservation
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'DJ Record Pool Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Lock in your DJ pool membership and get instant access to lossless WAV downloads and stem clearances.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>DJ / Stage Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. DJ Joe Mfalme"
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
                        placeholder="e.g. Joseph Mwangi"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Email Address *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="dj@club.com"
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
                            estimated_budget: found ? `$${found.price_usd?.toLocaleString()} one-time credit reload` : '$49 one-time credit reload'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="dj-resident">Club Resident Load — $19 one-time (200 Credits) · 50 Downloads</option>
                        <option value="dj-touring">Touring Pro DJ Load — $49 one-time (600 Credits) · Unlimited WAV &amp; Stems</option>
                        <option value="dj-headliner">Headliner &amp; Festival Curator Load — $129 one-time (1,800 Credits) · Dubplates</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Primary DJ Software</label>
                      <select
                        value={bookingForm.dj_software}
                        onChange={e => setBookingForm({ ...bookingForm, dj_software: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="Pioneer Rekordbox">Pioneer Rekordbox</option>
                        <option value="Serato DJ Pro">Serato DJ Pro</option>
                        <option value="Traktor Pro">Native Instruments Traktor</option>
                        <option value="Engine DJ">Denon Engine DJ</option>
                        <option value="VirtualDJ">VirtualDJ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Resident Clubs / City / Touring Territories</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Alchemist Bar (Nairobi), Konka (Johannesburg), London Club Circuit"
                      value={bookingForm.resident_city}
                      onChange={e => setBookingForm({ ...bookingForm, resident_city: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Preferred Genres &amp; Dubplate Notes</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Focus on 3-step Afro-House, private school Amapiano, and unreleased club bootlegs..."
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
                    {inquirySubmitting ? 'Registering DJ Plan…' : 'Lock In DJ Rate & Unlock Performance Pool'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Instant activation · 100% legal performance clearances · Global high-speed CDN
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
