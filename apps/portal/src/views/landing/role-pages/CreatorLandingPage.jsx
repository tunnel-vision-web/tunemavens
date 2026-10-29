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
  RiExternalLinkLine,
  RiCloseFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import creatorDashboardImg from '../../../assets/images/creator_dashboard.png'
import userProducerImg from '../../../assets/images/user_producer.png'
import appsMasteringImg from '../../../assets/images/apps_mastering.png'
import appsSyncImg from '../../../assets/images/apps_sync.png'
import createLogo from '../../../assets/logos/tunecreators-logo.png'

const FALLBACK_CREATOR_RATES = [
  {
    slug: 'creator-starter',
    name: 'Spark / Indie Starter',
    tier_badge: 'Free Forever',
    price_usd: 0.0,
    billing_period: 'free access',
    credits: 0,
    key_metric: '85/15 Net Splits · 3 Master Tracks',
    features: [
      'Lossless streaming playback & 60fps waveform player',
      'Direct fan tips via M-Pesa, card & mobile wallets (100% to creator)',
      'Standard Split Cascade math engine (up to 3 collaborators)',
      'Public EPK portfolio link on tunemavens.com',
      'Community Discord & knowledge base access'
    ],
    is_popular: false,
    cta: 'Start for Free'
  },
  {
    slug: 'creator-pro',
    name: 'Pro Creator Load',
    tier_badge: 'Most Popular',
    price_usd: 29.0,
    billing_period: 'one-time credit reload',
    credits: 300,
    key_metric: '90/10 Net Splits · Unlimited Catalog',
    features: [
      'Unlimited master track & stem upload storage (WAV & stems)',
      '90% artist royalty retention on catalog sales & streams',
      'SyncMavens AI sync brief automatic pitch routing',
      'Custom branded subdomain with customizable layout sections',
      'Intermaven Smart CRM fan lead capture (WhatsApp, SMS, Email)',
      'Social AI Studio content generator & 300 unified credits load with zero monthly fees'
    ],
    is_popular: true,
    cta: 'Get Pro Creator'
  },
  {
    slug: 'creator-studio',
    name: 'Studio Master Load',
    tier_badge: 'Full Independence',
    price_usd: 99.0,
    billing_period: 'one-time credit reload',
    credits: 1200,
    key_metric: '100% Splits · TunePay POS Merch & Tour Ticketing',
    features: [
      '100% royalty take — zero commission on downloads & merchandise',
      'TunePay portable event POS ticketing & instant QR gate validation',
      'Priority Sync Brief matching for TV commercials & Hollywood films',
      'Automated Publishing & Distribution Election contract generation',
      'Multi-tiered recoupment cascade for investor & producer advances',
      '1,200 unified credits load for mastering, ads & stem distribution with zero monthly fees'
    ],
    is_popular: false,
    cta: 'Launch Studio Plan'
  },
  {
    slug: 'creator-enterprise',
    name: 'Label-Ready Enterprise Load',
    tier_badge: 'Managed Artist',
    price_usd: 299.0,
    billing_period: 'one-time credit reload',
    credits: 4000,
    key_metric: 'White-Glove Ingestion & Dedicated Sync Rep',
    features: [
      'Dedicated sync licensing agent pitching directly to agency music supervisors',
      'White-glove legacy catalog migration from DistroKid/TuneCore',
      'Custom apex domain SSL mapping (yourname.com)',
      'Automated PRO cue sheet registration (ASCAP, BMI, SESAC, MCSK)',
      'Co-branded sponsor banners on artist concert tour passes',
      '4,000 unified credits load & 24/7 priority executive phone support with zero monthly fees'
    ],
    is_popular: false,
    cta: 'Book Artist Consultation'
  }
];

export default function CreatorLandingPage({ switcher }) {
  const accent = '#06b6d4';
  const syncMavensUrl = getServiceUrl('syncmavens');

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_CREATOR_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'creator-pro',
    genres: 'Afrobeats / Amapiano / Electronic',
    target_region: 'East Africa & Global Diaspora',
    estimated_budget: '$29 one-time credit reload (300 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/creator/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback creator rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'Automated Split Engine',
      dot: '#06b6d4',
      hLine1: 'You Make the Art.',
      hLine2: 'We Handle the Rest.',
      hLine2Color: '#06b6d4',
      s: 'Set collaborative shares between writers, producers, and vocalists once. Ingest statement CSVs and calculate cascading digital payouts automatically.',
      b1: 'Explore Creator Plans',
      b1link: '#creator-rates',
      b2: 'Explore Split Ledgers',
      b2link: '#split-ledgers',
      image: creatorDashboardImg
    },
    {
      badge: 'Mother-CMS Web Worlds',
      dot: '#06b6d4',
      hLine1: 'Deploy Standalone EPKs.',
      hLine2: 'Zero Platform Lock-In.',
      hLine2Color: '#06b6d4',
      s: 'Launch an interactive portfolio on your custom subdomain (artist.tunemavens.com) with 60fps audio waveforms, stems downloads, and digital tickets.',
      b1: 'Build Your EPK World',
      b1link: '/register?role=creator',
      b2: 'View EPK Features',
      b2link: '#epk-worlds',
      image: userProducerImg
    },
    {
      badge: 'Cloud Studio Mastering',
      dot: '#06b6d4',
      hLine1: 'Studio Sound in Seconds.',
      hLine2: 'Engineered for Streaming.',
      hLine2Color: '#06b6d4',
      s: 'Master uncompressed WAV tracks with precision analog DSP targets (-14 LUFS) optimized for TuneStream, Spotify, and club sound systems.',
      b1: 'Master a Track Now',
      b1link: '/tools',
      b2: 'Mastering Specs',
      b2link: '#mastering',
      image: appsMasteringImg
    },
    {
      badge: 'Sync Licensing Opportunities',
      dot: '#06b6d4',
      hLine1: 'Get Placed in Film & TV.',
      hLine2: 'Pre-Cleared Global Sync.',
      hLine2Color: '#06b6d4',
      s: 'Our AI tags your tracks with moods, BPMs, and instrumentation, matching your music directly with Hollywood music supervisors on SyncMavens.',
      b1: 'Pitch Music to Sync',
      b1link: '/register?role=creator',
      b2: 'Review Sync Pipeline',
      b2link: '#sync-pipeline',
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
    const el = document.getElementById('creator-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#creator-rates');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      estimated_budget: tier.price_usd === 0 
        ? 'Free Forever' 
        : `$${tier.price_usd?.toLocaleString()} one-time credit reload (${tier.credits?.toLocaleString()} Credits)`
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
        role: 'creator',
        organization_name: bookingForm.organization_name || bookingForm.contact_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        target_genre: bookingForm.genres,
        target_region: bookingForm.target_region,
        notes: bookingForm.notes
      };

      const res = await fetch('/api/roles/creator/inquiries', {
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
        aria-label="Creators & Artists Hero Carousel"
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
                src={createLogo} 
                alt="TuneCreators Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Creators &amp; Artists</span>
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
            <span className="role-stat-value">0%</span>
            <span className="role-stat-label">Dispute Risk on Split Cascades</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">90–100%</span>
            <span className="role-stat-label">Royalty Retention for Artists</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Instant</span>
            <span className="role-stat-label">Mobile Money Direct Fan Tipping</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Global</span>
            <span className="role-stat-label">Direct Hollywood Sync Matching</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="split-ledgers" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">The Creator Operating System</span>
            <h3 className="role-section-title">Everything You Need to Own Your Music Career</h3>
            <p className="role-section-desc">
              From automated split ledgers to standalone EPK web worlds, monetize your discography without middleman lock-in.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Split Cascade Royalty Ledger</h4>
              <p className="role-pillar-desc">
                Define master and publishing splits for producers, co-writers, and vocalists. Our automated engine enforces agreements on all downstream sync and stream income.
              </p>
            </div>

            <div className="role-pillar-card" id="epk-worlds" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiGlobalFill size={24} /></div>
              <h4 className="role-pillar-title">Mother-CMS Creator Web Worlds</h4>
              <p className="role-pillar-desc">
                Deploy high-converting EPK worlds on your own subdomain with audio streaming, lossless stem downloads ($9.99 / 50 credits), dynamic tour dates, and instant M-Pesa ticketing.
              </p>
            </div>

            <div className="role-pillar-card" id="mastering" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiEqualizerFill size={24} /></div>
              <h4 className="role-pillar-title">Cloud Studio DSP Mastering</h4>
              <p className="role-pillar-desc">
                Target industry-standard loudness profiles (-14 LUFS) with custom analog DSP models. Render streaming and CD-ready masters in seconds with instant A/B waveform previews.
              </p>
            </div>

            <div className="role-pillar-card" id="sync-pipeline" style={{ scrollMarginTop: '100px' }}>
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
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=creator" className="role-btn-primary">
                Launch Your Creator Console <RiArrowRightLine size={14} />
              </Link>
              <a href="#creator-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Creator Pricing Tiers
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={creatorDashboardImg} alt="TuneMavens Creator Dashboard Console" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
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

        {/* ================= 6. COMMERCIAL CREATOR TIERS & PLANS ================= */}
        <section id="creator-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Transparent Creator Plans</span>
            <h3 className="role-section-title">Commercial Creator Tiers &amp; Growth Plans</h3>
            <p className="role-section-desc">
              Whether you're releasing your first bedroom indie single or scaling an international concert tour. Predictable pricing with zero hidden fees and unified TM credits.
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

                <span className="role-rate-badge">{rate.tier_badge || 'Creator Plan'}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price">
                    {rate.price_usd === 0 ? '$0' : `$${rate.price_usd?.toLocaleString()}`}
                  </span>
                  <span className="role-rate-period">{rate.price_usd === 0 ? 'free access' : 'one-time credit reload'}</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {rate.credits > 0 ? `${rate.credits?.toLocaleString()} Non-Expiring TM Credits` : 'Ad-Supported Hosting'}
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric || 'Indie Retainer'}
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
                  {rate.cta || 'Get Started'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Technical Specs & Compliance Panel */}
          <div className="role-specs-panel">
            <h4 className="role-specs-title">
              <RiShieldCheckFill size={20} color={accent} /> Creator Independence &amp; Direct Royalty Settlement Guarantees
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Audio Fidelity</span>
                <div className="role-spec-value">
                  Uncapped 24-bit/96kHz lossless WAV master ingestion with automated stem separation (drums, bass, melodies, vocals).
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Split Cascade Automation</span>
                <div className="role-spec-value">
                  Multi-tier cascading payout waterfall: producer advances recoup first before secondary writer splits disburse automatically.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Direct Fan Tipping</span>
                <div className="role-spec-value">
                  Integrated M-Pesa STK push, mobile wallets, and Apple/Google Pay. 100% of fan contributions route to your balance.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Contract Protection</span>
                <div className="role-spec-value">
                  Tamper-evident Publishing Election and Distribution Election digital agreements backed by SHA-256 integrity hashes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Ready to Take Ownership of Your Music Career?</h3>
          <p>
            Join thousands of independent artists and producers using TuneMavens to eliminate split disputes and pitch directly to global supervisors.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=creator" className="role-btn-primary">
              Get Started as a Creator <RiArrowRightLine size={15} />
            </Link>
            <a href="#creator-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review Creator Pricing Tiers
            </a>
          </div>
          <span className="role-trust-note">
            Free Starter plan available · 50 free credits on sign up · No credit card required
          </span>
        </section>
      </div>

      {/* ================= 8. CREATOR PLAN BOOKING & ONBOARDING MODAL ================= */}
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
                  Creator Plan Reservation Confirmed
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
                  {inquirySuccess.msg} Your creator plan has been logged and routed to Intermaven Smart CRM.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=creator" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Create Creator Account
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Creator Plan Selection
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Creator Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Lock in your creator rate and launch your EPK web world, split ledgers, and sync matching.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Artist / Stage Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. DJ Maphorisa"
                        value={bookingForm.organization_name}
                        onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Full Legal Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Themba Sekowe"
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
                        placeholder="artist@tunemavens.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Phone / WhatsApp (for M-Pesa)</label>
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
                            estimated_budget: found ? (found.price_usd === 0 ? 'Free Forever' : `$${found.price_usd?.toLocaleString()} one-time credit reload`) : '$29 one-time credit reload'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="creator-starter">Spark / Indie — $0 / Free · 85/15 Splits</option>
                        <option value="creator-pro">Pro Creator Load — $29 one-time (300 Credits) · 90/10 Splits</option>
                        <option value="creator-studio">Studio Master Load — $99 one-time (1,200 Credits) · 100% Splits &amp; POS</option>
                        <option value="creator-enterprise">Label-Ready Enterprise Load — $299 one-time (4,000 Credits) · White-Glove Sync</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Primary Musical Genres</label>
                      <input 
                        type="text" 
                        value={bookingForm.genres}
                        onChange={e => setBookingForm({ ...bookingForm, genres: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Target Scene / Release Objectives</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Launching a 5-track EP next month, need custom subdomain and sync pitch tags..."
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
                    {inquirySubmitting ? 'Registering Creator Plan…' : 'Lock In Creator Tier & Launch Workspace'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Non-binding reservation · 50 bonus credits on registration · Direct creator payout setup
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
