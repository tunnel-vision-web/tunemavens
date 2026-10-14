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
  RiFileList3Line,
  RiCloseFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import syncHeaderImg from '../../../assets/images/sync_header.png'
import userSupervisorImg from '../../../assets/images/user_supervisor.png'
import appsSyncImg from '../../../assets/images/apps_sync.png'
import heroMusic4Img from '../../../assets/images/hero_music_4.png'
import syncLogo from '../../../assets/logos/syncmavens-logo.png'

const FALLBACK_SUPERVISOR_RATES = [
  {
    slug: 'supervisor-discovery',
    name: 'Indie Supervisor Discovery',
    tier_badge: 'Free Search',
    price_usd: 0.0,
    billing_period: 'free access',
    credits: 0,
    key_metric: 'Search 50,000+ Pre-Cleared Masters',
    features: [
      'Search 50k+ tracks by mood, tempo (BPM), instrumentation, and territory',
      'Listen to secure, watermarked preview streams in studio cutting rooms',
      'Direct contact access to rights owners and verified master holders',
      'Create and share private audition playlists with directors and editors',
      'Standard sync inquiry submission'
    ],
    is_popular: false,
    cta: 'Explore Catalog Free'
  },
  {
    slug: 'supervisor-production',
    name: 'Production Studio Pro Load',
    tier_badge: 'Most Popular',
    price_usd: 149.0,
    billing_period: 'one-time credit reload',
    credits: 1500,
    key_metric: 'Unlimited Brief Submissions · 94%+ AI Match',
    features: [
      'Unlimited scene brief uploads with 94%+ AI match scoring against master audio',
      'Instant download of separated stems (drums, bass, melodies, vocals) for sync edits',
      '1-click export of industry-standard cue sheets (ISRC, CAE, duration timestamps)',
      '100% pre-cleared, indemnity-backed licensing terms for indie films & web series',
      'Direct in-app escrow contract execution with split guarantee',
      '1,500 unified credits load for custom composer queries with zero monthly fees'
    ],
    is_popular: true,
    cta: 'Activate Studio Pro'
  },
  {
    slug: 'supervisor-broadcast',
    name: 'Network & Studio Enterprise Load',
    tier_badge: 'Worldwide Clearance',
    price_usd: 499.0,
    billing_period: 'one-time credit reload',
    credits: 6000,
    key_metric: 'Full Worldwide Indemnification & Urgent Turnaround',
    features: [
      'Full worldwide theatrical, national broadcast, and streaming SVOD clearances',
      'Ironclad legal indemnification with zero residual union royalty exposure',
      'Custom original composition & sonic branding commissions with verified composers',
      'Urgent sync turnaround guarantee (< 4 hours for breaking broadcast cuts)',
      'Custom volume rate cards for television series & multi-territory ad campaigns',
      '6,000 unified credits load & dedicated senior music rights supervisor with zero monthly fees'
    ],
    is_popular: false,
    cta: 'Contact Sync Director'
  }
];

export default function SupervisorLandingPage() {
  const accent = '#10b981';
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
  const [tierPackages, setTierPackages] = useState(FALLBACK_SUPERVISOR_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'supervisor-production',
    project_type: 'Film & Television',
    estimated_budget: '$149 one-time credit reload (1,500 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/supervisor/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback supervisor rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'AI Scene Script Tagging',
      dot: '#10b981',
      hLine1: 'Pitches That Hit.',
      hLine2: 'Get Licensed for Screen.',
      hLine2Color: '#10b981',
      s: 'Translate natural language script notes and director cues into precise sonic tags: BPM, mood, era, and instrumentation. Discover the right sound in seconds.',
      b1: 'Review Licensing Tiers',
      b1link: '#supervisor-rates',
      b2: 'Launch SyncMavens Platform',
      b2link: syncMavensUrl,
      image: syncHeaderImg
    },
    {
      badge: '100% Pre-Cleared Catalogs',
      dot: '#10b981',
      hLine1: 'Zero Legal Red Tape.',
      hLine2: 'Instant Escrow Contracting.',
      hLine2Color: '#10b981',
      s: 'Both master and publishing shares are 100% verified and indemnified upfront. Execute sync agreements and escrow payouts in a single click.',
      b1: 'Browse Pre-Cleared Vault',
      b1link: '/register?role=studio',
      b2: 'How Escrow Protects You',
      b2link: '#escrow-safety',
      image: userSupervisorImg
    },
    {
      badge: 'Multi-Track Stems Ingress',
      dot: '#10b981',
      hLine1: 'Cut and Edit With Ease.',
      hLine2: 'Isolated Multi-Track Stems.',
      hLine2Color: '#10b981',
      s: 'Download isolated drums, bass, vocals, and instrumental cues in uncompressed WAV formats, making scene fitting and dialogue mixing effortless.',
      b1: 'Test Stem Player',
      b1link: '/tools',
      b2: 'Stem Specs',
      b2link: '#stems',
      image: appsSyncImg
    },
    {
      badge: 'Bespoke Sonic Scoring',
      dot: '#10b981',
      hLine1: 'Original Scores on Demand.',
      hLine2: 'Curated Composer Network.',
      hLine2Color: '#10b981',
      s: 'Can\'t find an existing match? Post confidential scene briefs to verified independent composers across East Africa and the global diaspora.',
      b1: 'Post Private Brief',
      b1link: '/register?role=studio',
      b2: 'Review Composer Roster',
      b2link: '#composers',
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
    const el = document.getElementById('supervisor-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#supervisor-rates');
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
        role: 'supervisor',
        organization_name: bookingForm.organization_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        notes: `Project Type: ${bookingForm.project_type}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/supervisor/inquiries', {
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
        aria-label="Music Supervisors Hero Carousel"
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
                src={syncLogo} 
                alt="SyncMavens Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Music Supervisors &amp; Studios</span>
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

              {currentSlideData.b2link.startsWith('http') ? (
                <a 
                  href={currentSlideData.b2link} 
                  className="hbg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentSlideData.b2} <RiExternalLinkLine size={13} style={{ marginLeft: '4px' }} />
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
            <span className="role-stat-value">50,000+</span>
            <span className="role-stat-label">Pre-Cleared Master Sync Tracks</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">94%+</span>
            <span className="role-stat-label">AI Brief Match Precision</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">1-Click</span>
            <span className="role-stat-label">Automated Cue Sheet Generation</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">Worldwide Legal Indemnification</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="escrow-safety" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Production-Grade Sync Tools</span>
            <h3 className="role-section-title">Speed, Precision &amp; 100% Legal Certainty</h3>
            <p className="role-section-desc">
              Source authentic, high-impact music from emerging cultural epicenters with ironclad pre-cleared sync warranties.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiSearchEyeFill size={24} /></div>
              <h4 className="role-pillar-title">Natural Language Script Search</h4>
              <p className="role-pillar-desc">
                Paste creative scene cues or emotional arcs directly into our AI search engine to retrieve tracks calibrated for pacing and mood.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiScales3Fill size={24} /></div>
              <h4 className="role-pillar-title">100% Pre-Cleared One-Stop Sync</h4>
              <p className="role-pillar-desc">
                Every track features pre-agreed master and sync splits. Clear music in hours rather than chasing multiple international publishing houses.
              </p>
            </div>

            <div className="role-pillar-card" id="stems" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiSoundModuleFill size={24} /></div>
              <h4 className="role-pillar-title">Multi-Track Lossless Stems</h4>
              <p className="role-pillar-desc">
                Instant access to isolated drums, bass, synth pads, and vocal tracks in 24-bit WAV format for seamless cutting against screen dialogue.
              </p>
            </div>

            <div className="role-pillar-card">
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

            <div className="role-pillar-card" id="composers" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiCompass3Fill size={24} /></div>
              <h4 className="role-pillar-title">Bespoke Scoring Commissions</h4>
              <p className="role-pillar-desc">
                Commission custom score pieces from verified composers across Afrobeats, Amapiano, and cinematic electronic textures under standard escrow contracts.
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
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=studio" className="role-btn-primary">
                Join Supervisor Network <RiArrowRightLine size={14} />
              </Link>
              <a href="#supervisor-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Supervisor Plans
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={appsSyncImg} alt="TuneMavens Sync Licensing and Brief Search" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
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

        {/* ================= 6. COMMERCIAL SUPERVISOR & STUDIO RATES ================= */}
        <section id="supervisor-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Zero Monthly Charges · Unified Credits</span>
            <h3 className="role-section-title">Music Supervisor &amp; Studio Credit Packages</h3>
            <p className="role-section-desc">
              From free catalog auditioning for indie supervisors to enterprise broadcaster packages. 100% usage-based unified credits with zero recurring monthly fees. Load credits relevant to your sync briefs and licenses with instant M-Pesa or Card reload.
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

                <span className="role-rate-badge">{rate.tier_badge || 'Supervisor Plan'}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price">
                    {rate.price_usd === 0 ? '$0' : `$${rate.price_usd?.toLocaleString()}`}
                  </span>
                  <span className="role-rate-period">{rate.price_usd === 0 ? 'free access' : 'one-time credit reload'}</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {rate.credits > 0 ? `${rate.credits?.toLocaleString()} Non-Expiring TM Credits` : 'Free Discovery'}
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric || 'Sync Studio'}
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
              <RiShieldCheckFill size={20} color={accent} /> Sync Licensing Legal Indemnification &amp; Deliverable Specs
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Rights Clearance</span>
                <div className="role-spec-value">
                  100% pre-cleared one-stop licensing: both master recording and underlying publishing rights are confirmed prior to catalog listing.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Cue Sheet Data</span>
                <div className="role-spec-value">
                  Instant export populated with verified ISRC, ISWC, CAE/IPI numbers, writer/publisher splits, and track duration timestamps.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Multi-Track Delivery</span>
                <div className="role-spec-value">
                  Uncompressed 24-bit/48kHz or 96kHz broadcast WAV files with stems (drums, bass, melodies, vocals) for dialogue editing.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Worldwide Indemnity</span>
                <div className="role-spec-value">
                  Full corporate legal indemnification through the Intermaven legal warranty framework, protecting productions worldwide.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Never Miss a Production Music Clearance Deadline</h3>
          <p>
            Join music supervisors from Netflix, HBO, indie film houses, and game studios using TuneMavens to discover authentic, pre-cleared music.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=studio" className="role-btn-primary">
              Register Free as a Music Supervisor <RiArrowRightLine size={15} />
            </Link>
            <a href="#supervisor-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review Supervisor Plans
            </a>
          </div>
          <span className="role-trust-note">
            Pre-cleared worldwide indemnification · Non-exclusive &amp; buyout options · Dedicated supervisor concierge
          </span>
        </section>
      </div>

      {/* ================= 8. SUPERVISOR PLAN BOOKING & ONBOARDING MODAL ================= */}
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
                  Supervisor Plan Reserved
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
                  {inquirySuccess.msg} A dedicated music rights supervisor will assist with brief routing and stem clearance access.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=studio" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Create Supervisor Account
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Music Supervisor Plan Reservation
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Production Studio Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Access pre-cleared music briefs, full multi-track stems, and 1-click cue sheet generation.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Production House / Studio *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. BlueSky Film Studios"
                        value={bookingForm.organization_name}
                        onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Contact Supervisor *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. David Mutiso"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Work Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="supervisor@studio.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Phone / Mobile</label>
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
                            estimated_budget: found ? (found.price_usd === 0 ? 'Free Forever' : `$${found.price_usd?.toLocaleString()} one-time credit reload`) : '$149 one-time credit reload'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="supervisor-discovery">Indie Discovery — $0 / Free · 50k+ Search</option>
                        <option value="supervisor-production">Production Studio Pro Load — $149 one-time (1,500 Credits) · Stems &amp; Cues</option>
                        <option value="supervisor-broadcast">Network Enterprise Load — $499 one-time (6,000 Credits) · Worldwide Indemnity</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Primary Project Format</label>
                      <select
                        value={bookingForm.project_type}
                        onChange={e => setBookingForm({ ...bookingForm, project_type: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="Film & Television">Feature Film / TV Series</option>
                        <option value="Commercial / Advertising">Commercial / Digital Ad Campaign</option>
                        <option value="Gaming & Interactive">Video Games &amp; Interactive Media</option>
                        <option value="Documentary / Indie">Documentary &amp; Indie Web Series</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Scene Brief or Music Requirements</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Looking for authentic Nairobi gengetone & modern Amapiano tracks for an 8-part TV series..."
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
                    {inquirySubmitting ? 'Registering Supervisor Plan…' : 'Lock In Rate & Access Stems Vault'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Non-binding reservation · Escrow protected · Full legal indemnification
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
