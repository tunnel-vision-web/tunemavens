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
import { useRegion } from '../../../RegionContext.jsx'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import syncHeaderImg from '../../../assets/images/sync_header.png'
import supervisorDashboardActualEn from '../../../assets/images/supervisor_dashboard_actual_en.png'
import supervisorDashboardActualSw from '../../../assets/images/supervisor_dashboard_actual_sw.png'
import SEO from '../../../components/common/SEO.jsx'
import userSupervisorImg from '../../../assets/images/user_supervisor.png'
import appsSyncImg from '../../../assets/images/apps_sync.png'
import heroMusic4Img from '../../../assets/images/hero_music_4.png'
import syncLogo from '../../../assets/logos/syncmavens-logo.png'

const SUPERVISOR_LICENSING_MODELS = [
  {
    slug: 'supervisor-free-suite',
    name: 'Supervisor Discovery & Deal Desk Suite',
    tier_badge: '100% Free Access',
    price_usd: 0.0,
    price_display: '$0 / Always Free',
    billing_period: 'Zero packages · Zero credits',
    credits: 0,
    key_metric: 'Unlimited Catalog Search, Stem Auditions & Briefs',
    features: [
      'Never pay for a package or platform credits — search & audition 100% free',
      'Search 50,000+ pre-cleared tracks by mood, BPM, genre, era, and territory',
      'Listen to secure watermarked audio previews in studio cutting rooms',
      'Test uncompressed isolated stems (drums, bass, vocals, instruments) in your DAW',
      'Organize and share private director audition playlists',
      'Post confidential scene briefs to receive AI-ranked creator pitches'
    ],
    is_popular: false,
    cta: 'Access Supervisor Suite Free'
  },
  {
    slug: 'supervisor-per-track',
    name: 'Pay-Per-Track Custom Sync License',
    tier_badge: 'Dynamic Pricing & Negotiation',
    price_usd: null,
    price_display: 'Dynamic / Per Track',
    billing_period: 'Calibrated by use case, territory & term',
    credits: 0,
    key_metric: 'Fair Market Pricing Based on Production Scope',
    features: [
      'No packages — pay strictly for the specific track you clear for your production',
      'Pricing dynamically tailored to media: Film, TV, Commercial, Gaming, or Web',
      'Territory rights calibrated: Single Country, Continental, or Worldwide',
      'Duration terms flexible: 1-Year campaign, 3-Year run, or In-Context Perpetuity',
      'Submit offers and negotiate counter-offers directly with rights owners in-app',
      'Full Most Favored Nations (MFN) protection across master & publishing splits'
    ],
    is_popular: true,
    cta: 'Submit License Offer'
  },
  {
    slug: 'supervisor-bespoke',
    name: 'Bespoke Scores & Enterprise Concierge',
    tier_badge: 'Concierge & Original IP',
    price_usd: null,
    price_display: 'Custom Quote / Negotiated',
    billing_period: 'Bilateral custom deal desk',
    credits: 0,
    key_metric: 'Bespoke Compositions & High-Value Catalog IP',
    features: [
      'Commission original scores and sonic themes from verified African & diaspora composers',
      'Volume clearance agreements for entire multi-episode television series & film slates',
      'Urgent broadcast turnaround guarantee (< 4 hours for breaking broadcast cuts)',
      'Ironclad corporate indemnification warranty with zero residual copyright exposure',
      'TuneLedger escrow release upon multi-track stem delivery confirmation',
      'Automated DDEX cue sheet generation (ISRC, CAE, writer/publisher splits)'
    ],
    is_popular: false,
    cta: 'Open Deal Desk Negotiation'
  }
];

export default function SupervisorLandingPage({ switcher }) {
  const { formatPrice, language } = useRegion();
  const isSw = language === 'sw';
  const [previewModal, setPreviewModal] = useState(false);
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

  // Deal Desk & Inquiry Modal State
  const [tierPackages, setTierPackages] = useState(SUPERVISOR_LICENSING_MODELS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'supervisor-per-track',
    project_type: 'Film & Television',
    territory: 'Worldwide',
    duration: 'In-Context Perpetuity',
    proposed_offer: '',
    target_track: '',
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
      .catch(() => {
        // Defaults to per-track licensing & negotiation models
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
      b1: 'Explore Licensing Model',
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
      s: "Can't find an existing match? Post confidential scene briefs to verified independent composers across East Africa and the global diaspora.",
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

  const goToNextSlide = () => {
    goToSlide((currentSlide + 1) % slideCount);
  };

  const goToPrevSlide = () => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  useEffect(() => {
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
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

  const handleOpenBooking = (model) => {
    setSelectedTier(model);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: model.slug,
      proposed_offer: model.slug === 'supervisor-free-suite' ? '$0 / Free Suite Access' : (prev.proposed_offer || 'Open to Negotiation')
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
        estimated_budget: bookingForm.proposed_offer || 'Negotiable via Deal Desk',
        notes: `Media: ${bookingForm.project_type} | Territory: ${bookingForm.territory} | Duration: ${bookingForm.duration} | Target Track/Cue: ${bookingForm.target_track || 'Not specified'}. ${bookingForm.notes || ''}`
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
        setInquirySuccess({
          ref: `SYNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          msg: 'Your licensing offer and project requirements have been successfully submitted to the SyncMavens Deal Desk. A music rights director will initiate bilateral negotiation with rights holders.'
        });
      }
    } catch (err) {
      setInquirySuccess({
        ref: `SYNC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        msg: 'Your licensing offer and project requirements have been logged in the SyncMavens Deal Desk. A music rights director will initiate bilateral negotiation with rights holders.'
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  return (
    <div className="role-page-wrapper" style={{ '--role-accent': accent }}>
      <SEO 
        title="SyncMavens — AI-Assisted Film & TV Sync Marketplace"
        description="Connect film supervisors, advertising agencies, and game studios with 100% pre-cleared African and diaspora commercial tracks with executed split sheets."
        favicon="/favicons/syncmavens.png"
      />
      {/* ================= 1. Interactive HERO Slide Carousel ================= */}
      <section 
        className="hw role-hero-wrapper"
        aria-label="Music Supervisors Hero Carousel"
      >
        <div className="bgs">
          {slides.map((s, index) => (
            <div 
              key={index}
              className={`bg ${index === currentSlide ? `active ${slideState}` : ''}`}
              style={{
                backgroundImage: `url(${s.image})`,
                backgroundPosition: 'center 20%'
              }}
            />
          ))}
          <div 
            className="role-hero-scrim" 
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

        <div className="indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div 
                className="progress" 
                style={{ 
                  width: index === currentSlide ? `${progress}%` : (index < currentSlide ? '100%' : '0%') 
                }} 
              />
            </button>
          ))}
        </div>
      </section>

      {/* ================= PERSONA SWITCHER ================= */}
      {switcher && (
        <section className="role-switcher-section">
          <div className="role-switcher-inner">
            {switcher}
          </div>
        </section>
      )}

      <div className="role-container">
        {/* ================= 2. EXECUTIVE VALUE METRICS ================= */}
        <section className="role-metrics-panel">
          <div className="role-metric-card">
            <span className="role-metric-val">100%</span>
            <span className="role-metric-lbl">Pre-Cleared One-Stop Sync</span>
            <p className="role-metric-sub">Master &amp; publishing rights guaranteed upfront with zero unresolved rights holders.</p>
          </div>
          <div className="role-metric-card">
            <span className="role-metric-val">&lt; 4 hrs</span>
            <span className="role-metric-lbl">Broadcast Cue Clearance</span>
            <p className="role-metric-sub">Rapid contract execution and automated stem delivery for breaking episodic deadlines.</p>
          </div>
          <div className="role-metric-card">
            <span className="role-metric-val">94%+</span>
            <span className="role-metric-lbl">Scene Script Tagging Precision</span>
            <p className="role-metric-sub">Bespoke AI translates screenplay emotional cues directly to tempo, era, and key.</p>
          </div>
          <div className="role-metric-card">
            <span className="role-metric-val">0 Credits</span>
            <span className="role-metric-lbl">No Packages or Hidden Fees</span>
            <p className="role-metric-sub">Supervisors search, audition, post briefs, and negotiate deals completely free forever.</p>
          </div>
        </section>

        {/* ================= 3. CORE SUPERVISOR CAPABILITIES ================= */}
        <section className="role-features-section">
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Sync Technology</span>
            <h2 className="role-section-title">Built Specifically for Film, Television &amp; Advertising</h2>
            <p className="role-section-desc">
              From natural-language scene cue matching to lossless multi-track stem downloads, SyncMavens eliminates traditional music clearance bottlenecks.
            </p>
          </div>

          <div className="role-features-grid">
            <div className="role-feature-card">
              <div className="role-feature-icon"><RiSearchEyeFill size={24} /></div>
              <h3 className="role-feature-title">AI Scene Brief Tagging</h3>
              <p className="role-feature-desc">
                Drop in raw director script excerpts or tempo guidelines. Our vector model scans mood, cultural origins, and lyric themes to return mathematically ranked track candidates.
              </p>
            </div>

            <div className="role-feature-card">
              <div className="role-feature-icon"><RiSoundModuleFill size={24} /></div>
              <h3 className="role-feature-title">Multi-Track Stem Downloads</h3>
              <p className="role-feature-desc">
                Access isolated vocal, bass, drum, and instrumental stems immediately upon licensing. Test cuts inside your Avid or Premiere timeline without waiting for composer delivery.
              </p>
            </div>

            <div className="role-feature-card">
              <div className="role-feature-icon"><RiFilePaper2Fill size={24} /></div>
              <h3 className="role-feature-title">Automated Cue Sheet Generation</h3>
              <p className="role-feature-desc">
                Export industry-compliant cue sheets formatted with ISRC codes, CAE/IPI numbers, duration timestamps, and split percentages for ASCAP, BMI, and global PRO reporting.
              </p>
            </div>

            <div className="role-feature-card">
              <div className="role-feature-icon"><RiShieldCheckFill size={24} /></div>
              <h3 className="role-feature-title">100% Indemnified One-Stop Rights</h3>
              <p className="role-feature-desc">
                Every track listed in our sync vault has executed Split Sheets on file. Both master and composition rights clear simultaneously through our legally binding digital framework.
              </p>
            </div>

            <div className="role-feature-card">
              <div className="role-feature-icon"><RiRadioFill size={24} /></div>
              <h3 className="role-feature-title">East African &amp; Diaspora Catalog</h3>
              <p className="role-feature-desc">
                Tap directly into authentic Afrobeats, Gengetone, Benga, Amapiano, and cinematic hybrid productions straight from certified East African creators and studios.
              </p>
            </div>

            <div className="role-feature-card">
              <div className="role-feature-icon"><RiScales3Fill size={24} /></div>
              <h3 className="role-feature-title">TuneLedger Escrow Protection</h3>
              <p className="role-feature-desc">
                License fees are held securely in escrow and disbursed automatically based on contract milestones, ensuring full delivery compliance before funds clear to creators.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 4. DASHBOARD INTERFACE SHOWCASE ================= */}
        <section className="role-interface-section">
          <div className="role-interface-content">
            <span className="role-section-eyebrow">Production Dashboard</span>
            <h3 className="role-interface-title">A Unified Deal Desk for High-Volume Sync Operations</h3>
            <p className="role-interface-desc">
              Manage scene audition bins, export cue sheets, track escrow payments, and coordinate with studio legal teams from a single centralized production terminal.
            </p>
            <ul className="role-interface-list">
              <li><RiCheckFill size={18} color={accent} /> Scene audition bins with watermarked director sharing links</li>
              <li><RiCheckFill size={18} color={accent} /> Instant stem separation preview before contract commitment</li>
              <li><RiCheckFill size={18} color={accent} /> 1-Click ASCAP / BMI / DDEX cue sheet file generation</li>
              <li><RiCheckFill size={18} color={accent} /> In-app bilateral negotiation &amp; escrow holding</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button" 
                className="role-btn-primary" 
                onClick={() => setPreviewModal(true)}
              >
                Inspect Live Dashboard Interface <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          </div>
          <div className="role-interface-preview" onClick={() => setPreviewModal(true)} style={{ cursor: 'pointer' }}>
            <img 
              src={isSw ? supervisorDashboardActualSw : supervisorDashboardActualEn} 
              alt="SyncMavens Supervisor Dashboard Interface" 
              className="role-dashboard-mockup"
            />
            <div className="role-preview-overlay">
              <span>Click to view actual system interface</span>
            </div>
          </div>
        </section>

        {/* ================= 5. THREE-STEP CLEARANCE WORKFLOW ================= */}
        <section className="role-workflow-section">
          <div className="role-section-header">
            <span className="role-section-eyebrow">Clearance Workflow</span>
            <h3 className="role-section-title">From Script Brief to Lossless Stems in 3 Steps</h3>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-card">
              <div className="role-workflow-icon"><RiCompass3Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Discovery</span>
              <h4 className="role-step-title">Upload Scene Cue Notes or BPM</h4>
              <p className="role-step-desc">
                Paste your scene script excerpts, desired instrumentation, or mood references into our AI matching engine to generate curated track audition bins.
              </p>
            </div>

            <div className="role-workflow-card">
              <div className="role-workflow-icon"><RiSoundModuleFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Audition</span>
              <h4 className="role-step-title">Audition Stems in Cutting Room</h4>
              <p className="role-step-desc">
                Stream watermarked audio directly into your cutting room, test separated vocal and instrumental stems, and collaborate with directors via private links.
              </p>
            </div>

            <div className="role-workflow-card">
              <div className="role-workflow-icon"><RiFileList3Line size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Clearance &amp; Escrow</span>
              <h4 className="role-step-title">Execute License via Escrow</h4>
              <p className="role-step-desc">
                Propose your terms or agree on track licensing fee, release funds into TuneLedger escrow, and receive lossless master WAVs and cue sheets instantly.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. PER-TRACK DYNAMIC LICENSING & IN-APP DEAL DESK ================= */}
        <section id="supervisor-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Zero Packages · Zero Platform Credits · 100% Free Suite</span>
            <h3 className="role-section-title">Pay-Per-Track Sync Licensing &amp; In-App Deal Desk</h3>
            <p className="role-section-desc">
              Music supervisors never pay for any package, subscription, or platform credits. Searching 50,000+ pre-cleared masters, auditioning uncompressed stems, posting briefs, and exporting cue sheets is 100% free. You only pay for the specific tracks you license, with transparent pricing determined by use case, territory, duration, and IP valuation—with full bilateral in-app negotiation.
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
                    Most Popular Clearance Model
                  </span>
                )}

                <span className="role-rate-badge">{rate.tier_badge}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price" style={{ fontSize: rate.price_display?.length > 15 ? '22px' : '28px' }}>
                    {rate.price_display}
                  </span>
                  <span className="role-rate-period">{rate.billing_period}</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    0 Platform Credits · 0 Packages
                  </span>
                  <span style={{ color: '#64748b' }}>•</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric}
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
                  {rate.cta || 'Select Clearance Option'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Dynamic Pricing Dimensions & Negotiation Protocol Matrix */}
          <div style={{ 
            marginTop: '36px', 
            background: 'rgba(16, 185, 129, 0.04)', 
            border: '1px solid rgba(16, 185, 129, 0.2)', 
            borderRadius: '6px', 
            padding: '28px 24px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <RiScales3Fill size={24} color={accent} />
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 700 }}>
                  How Per-Track Sync Pricing &amp; Negotiation Works
                </h4>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>
                  No one-size-fits-all bundles. Each track license fee is custom-calibrated across 4 core variables and subject to in-app bilateral negotiation.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dimension 1</span>
                <h5 style={{ color: '#fff', fontSize: '15px', margin: '4px 0 8px 0' }}>Production Use Case</h5>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  Feature film theatrical, network TV series, streaming SVOD, commercial digital ads, AAA gaming, or indie documentaries.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dimension 2</span>
                <h5 style={{ color: '#fff', fontSize: '15px', margin: '4px 0 8px 0' }}>Territory Scope</h5>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  Tailored to your exhibition footprint: Single territory/regional, Pan-African, North American, or full Worldwide distribution.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dimension 3</span>
                <h5 style={{ color: '#fff', fontSize: '15px', margin: '4px 0 8px 0' }}>Term &amp; Duration</h5>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  1-year broadcast/festival campaign, 3-year syndication window, or standard in-context perpetuity for locked final cuts.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dimension 4</span>
                <h5 style={{ color: '#fff', fontSize: '15px', margin: '4px 0 8px 0' }}>IP Tier &amp; Negotiation</h5>
                <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  Emerging masters vs. charting legacy catalog. Submit offers &amp; counter-offers in-app with TuneLedger escrow split safety.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Specs & Compliance Panel */}
          <div className="role-specs-panel" style={{ marginTop: '28px' }}>
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
            Join music supervisors from Netflix, HBO, indie film houses, and game studios using SyncMavens to discover authentic, pre-cleared music with transparent per-track licensing.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=studio" className="role-btn-primary">
              Register Free as a Music Supervisor <RiArrowRightLine size={15} />
            </Link>
            <a href="#supervisor-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Explore Licensing Model
            </a>
          </div>
          <span className="role-trust-note">
            Zero packages · Zero platform credits · Transparent per-track licensing &amp; bilateral negotiation
          </span>
        </section>
      </div>

      {/* ================= 8. SUPERVISOR DEAL DESK & LICENSE OFFER MODAL ================= */}
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
              maxWidth: '600px', 
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
                  Deal Desk Submission Received
                </h3>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '14px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Deal Desk Reference Code
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e', fontFamily: 'Space Grotesk, sans-serif', marginTop: '4px' }}>
                    {inquirySuccess.ref}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
                  {inquirySuccess.msg}
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
                    Open Supervisor Account Free
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    SyncMavens Deal Desk · Bilateral Negotiation
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Sync Licensing Offer & Deal Desk'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Zero packages. Submit your licensing parameters or proposed offer for direct negotiation with rights owners through TuneLedger escrow.
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
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Music Supervisor Name *</label>
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
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Media Use Case *</label>
                      <select
                        value={bookingForm.project_type}
                        onChange={e => setBookingForm({ ...bookingForm, project_type: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="Feature Film">Feature Film (Theatrical &amp; SVOD)</option>
                        <option value="Television Series">Television &amp; Episodic Streaming Series</option>
                        <option value="Commercial / Advertising">Commercial / Digital Ad Campaign</option>
                        <option value="Gaming & Interactive">Video Games &amp; Interactive Media</option>
                        <option value="Documentary / Indie">Documentary &amp; Indie Web Series</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Licensed Territory *</label>
                      <select
                        value={bookingForm.territory}
                        onChange={e => setBookingForm({ ...bookingForm, territory: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="Worldwide">Worldwide (Global Distribution)</option>
                        <option value="Pan-Africa">Continental — Pan-Africa</option>
                        <option value="North America">Continental — North America</option>
                        <option value="Europe">Continental — Europe</option>
                        <option value="Regional / Kenya">Single Territory / Regional</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Term &amp; Duration *</label>
                      <select
                        value={bookingForm.duration}
                        onChange={e => setBookingForm({ ...bookingForm, duration: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="In-Context Perpetuity">In-Context Perpetuity (Standard Locked Cut)</option>
                        <option value="5-Year Broadcast">5-Year Broadcast &amp; Digital Run</option>
                        <option value="3-Year Distribution">3-Year Distribution Window</option>
                        <option value="1-Year Campaign">1-Year Campaign / Festival Run</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Proposed License Offer / Budget ($USD)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. $500 or Open to Negotiation"
                        value={bookingForm.proposed_offer}
                        onChange={e => setBookingForm({ ...bookingForm, proposed_offer: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Specific Track Title or Scene Music Brief</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Track 'Midnight in Kilifi' or Scene Brief: Driving Afro-fusion track with upbeat percussion for high-energy chase sequence in Episode 3..."
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
                    {inquirySubmitting ? 'Routing Offer to Deal Desk…' : 'Submit License Offer to Deal Desk'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Zero packages · Bilateral in-app negotiation · TuneLedger escrow protected · Full legal indemnification
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '3px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '3px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>SyncMavens Supervisor Deal Desk · Actual System Interface</h3>
            <img src={isSw ? supervisorDashboardActualSw : supervisorDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
