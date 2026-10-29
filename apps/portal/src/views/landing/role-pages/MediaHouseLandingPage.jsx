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
  RiFileLine,
  RiCloseFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_apps.png'
import publishingMockupImg from '../../../assets/images/publishing_dashboard_mockup.png'
import tunestreamHeader3Img from '../../../assets/images/tunestream_header_3.png'
import tourDashboardMockupImg from '../../../assets/images/tour_dashboard_mockup.png'
import managementLogo from '../../../assets/logos/tunemanagement-logo.png'

const FALLBACK_MEDIA_RATES = [
  {
    slug: 'media-station',
    name: 'Single Station Load',
    tier_badge: 'Compliance Starter',
    price_usd: 199.0,
    billing_period: 'one-time credit reload',
    credits: 2000,
    key_metric: 'Up to 2 Broadcast Channels · 5,000 Playlogs Load',
    features: [
      'Direct ingestion from broadcast software (RCS Zetta, Dalet, WideOrbit, Selector)',
      'Automated track recognition matching playlogs to verified ISRC & CAE metadata',
      'Flag missing publishing shares and unregistered works before reporting',
      'Standard statutory royalty report exports ready for local collection societies',
      '2,000 unified credits load for catalog audio matching queries with zero monthly fees'
    ],
    is_popular: false,
    cta: 'Connect Station'
  },
  {
    slug: 'media-network',
    name: 'Broadcaster Network Suite Load',
    tier_badge: 'Most Popular',
    price_usd: 599.0,
    billing_period: 'one-time credit reload',
    credits: 7500,
    key_metric: 'Up to 10 Stations · 50,000 Playlogs Load',
    features: [
      'Manage up to 10 radio and television broadcast channels in a unified console',
      'AI discrepancy detection resolving 99% of unrecognized broadcast cue entries',
      '1-click export formatted for ASCAP, BMI, SESAC, PRS, and MCSK compliance',
      'Integration with Intermaven Corporate Ad network for native commercial insertion',
      'Automated station affidavit logs and reconciliation audit trails',
      '7,500 unified credits load & dedicated broadcast compliance engineer with zero monthly fees'
    ],
    is_popular: true,
    cta: 'Upgrade to Network Suite'
  },
  {
    slug: 'media-conglomerate',
    name: 'Enterprise Media Conglomerate Load',
    tier_badge: 'Statutory Fortress',
    price_usd: 1499.0,
    billing_period: 'one-time credit reload',
    credits: 20000,
    key_metric: 'Unlimited Stations · Real-Time Audio Fingerprinting',
    features: [
      'Unlimited radio, TV, and digital streaming broadcast channels',
      'Continuous 24/7 acoustic fingerprinting and broadcast stream monitoring',
      'Real-time metadata repair with automated direct songwriter outreach',
      'Ironclad statutory audit compliance defense against copyright fines',
      'Custom ERP integration into station billing and traffic scheduling systems',
      '20,000 unified credits load, custom SLA & 24/7 technical hotline with zero monthly fees'
    ],
    is_popular: false,
    cta: 'Consult Compliance Team'
  }
];

export default function MediaHouseLandingPage({ switcher }) {
  const accent = '#3b82f6';

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_MEDIA_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'media-network',
    channel_count: '3-10 Broadcast Channels',
    automation_software: 'RCS Zetta / WideOrbit',
    estimated_budget: '$599 one-time credit reload (7,500 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/media_house/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback media rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'Automated Broadcast Compliance',
      dot: '#3b82f6',
      hLine1: 'Automate Broadcast Logs.',
      hLine2: '100% PRO Compliance.',
      hLine2Color: '#3b82f6',
      s: 'Convert station audio playlogs into standardized ASCAP, BMI, and PRS cue sheet reports. Eliminate manual logging and avoid regulatory fines.',
      b1: 'Review Broadcaster Tiers',
      b1link: '#media-rates',
      b2: 'Explore Playlog Formatter',
      b2link: '#compliance',
      image: headerImg
    },
    {
      badge: 'Licensing Discrepancy Auditing',
      dot: '#3b82f6',
      hLine1: 'Detect Licensing Conflicts.',
      hLine2: 'Real-Time Verification.',
      hLine2Color: '#3b82f6',
      s: 'Our neural audit engine parses on-air music logs against multi-label databases, flagging missing mechanical licenses and uncredited songwriters before airtime.',
      b1: 'Run Playlog Audit',
      b1link: '/register?role=media',
      b2: 'Audit Engine Specs',
      b2link: '#audit-engine',
      image: publishingMockupImg
    },
    {
      badge: 'Statutory PRO Exports',
      dot: '#3b82f6',
      hLine1: '1-Click Society Reports.',
      hLine2: 'Full Metadata Precision.',
      hLine2Color: '#3b82f6',
      s: 'Export certified playlogs ready for ASCAP, BMI, SESAC, PRS, and MCSK with verified duration seconds, CAE/IPI numbers, and composer splits.',
      b1: 'Try Formatter Demo',
      b1link: '/tools',
      b2: 'Supported PRO Formats',
      b2link: '#pro-formats',
      image: tunestreamHeader3Img
    },
    {
      badge: 'Unified Cross-Station Billing',
      dot: '#3b82f6',
      hLine1: 'Manage Multiple Channels.',
      hLine2: 'Consolidated Ledgers.',
      hLine2Color: '#3b82f6',
      s: 'Centralize compliance across television, FM radio, and digital simulcast streams in a single dashboard with unified Intermaven Network Credits.',
      b1: 'Set Up Media Network',
      b1link: '/register?role=media',
      b2: 'Network Credit Pools',
      b2link: '#credit-pools',
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
    const el = document.getElementById('media-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#media-rates');
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
        role: 'media_house',
        organization_name: bookingForm.organization_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        catalog_or_audience_size: bookingForm.channel_count,
        notes: `Automation Software: ${bookingForm.automation_software}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/media_house/inquiries', {
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
        aria-label="Media Houses & Broadcasters Hero Carousel"
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
                src={managementLogo} 
                alt="TuneManagement Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Media Houses &amp; Broadcasters</span>
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
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">Statutory PRO Audit Compliance</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">99.2%</span>
            <span className="role-stat-label">Playlog Acoustic Fingerprint Accuracy</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">1-Click</span>
            <span className="role-stat-label">Automated Society Cue Sheet Exports</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Zero</span>
            <span className="role-stat-label">Copyright Infringement Penalty Exposure</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="compliance" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Station Software</span>
            <h3 className="role-section-title">Automate Playlogs, Verify Shares &amp; Export Cues</h3>
            <p className="role-section-desc">
              From local radio stations to national broadcast networks, eliminate manual log reconciliations and ensure complete legal protection.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBroadcastFill size={24} /></div>
              <h4 className="role-pillar-title">Playlog Automation Parser</h4>
              <p className="role-pillar-desc">
                Directly parse playlog exports from RCS Zetta, Dalet, WideOrbit, and Selector. Extract timestamps, track durations, and artist metadata automatically.
              </p>
            </div>

            <div className="role-pillar-card" id="audit-engine" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiShieldCheckFill size={24} /></div>
              <h4 className="role-pillar-title">Discrepancy Detection Engine</h4>
              <p className="role-pillar-desc">
                Flag uncredited songwriters, unregistered publishing shares, and missing mechanical clearance licenses before statutory reporting deadlines.
              </p>
            </div>

            <div className="role-pillar-card" id="pro-formats" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiFilePaperFill size={24} /></div>
              <h4 className="role-pillar-title">1-Click PRO Formatted Exports</h4>
              <p className="role-pillar-desc">
                Generate formatted submission reports pre-configured for collection societies including ASCAP, BMI, SESAC, PRS, and MCSK with verified CAE numbers.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiRadio2Fill size={24} /></div>
              <h4 className="role-pillar-title">Multi-Station Network Management</h4>
              <p className="role-pillar-desc">
                Monitor compliance across regional FM stations, digital streaming channels, and broadcast TV feeds in a centralized executive control panel.
              </p>
            </div>

            <div className="role-pillar-card" id="credit-pools" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiEqualizerFill size={24} /></div>
              <h4 className="role-pillar-title">Unified Ad Ingress &amp; Credits</h4>
              <p className="role-pillar-desc">
                Seamlessly insert verified audio interstitial spots from the Intermaven Corporate Ad network into commercial pods with automated affidavits.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiTv2Fill size={24} /></div>
              <h4 className="role-pillar-title">Statutory Audit Fortress</h4>
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
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=media" className="role-btn-primary">
                Set Up Broadcaster Network <RiArrowRightLine size={14} />
              </Link>
              <a href="#media-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Broadcaster Plans
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={publishingMockupImg} alt="TuneMavens Broadcast Compliance and Publishing Dashboard" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
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

        {/* ================= 6. COMMERCIAL MEDIA HOUSE RATES & PLANS ================= */}
        <section id="media-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Zero Monthly Charges · Unified Credits</span>
            <h3 className="role-section-title">Broadcaster Compliance Loads &amp; Network Packages</h3>
            <p className="role-section-desc">
              From single regional radio stations automating playlog cue sheets to multinational media conglomerates. 100% usage-based unified credits with zero recurring monthly fees. Load credits relevant to your compliance needs and reload anytime.
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

                <span className="role-rate-badge">{rate.tier_badge || 'Media Tier'}</span>
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
                    {rate.key_metric || 'Broadcaster Plan'}
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
              <RiShieldCheckFill size={20} color={accent} /> Statutory Compliance Specs &amp; Supported Broadcast Standards
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Automation Ingestion</span>
                <div className="role-spec-value">
                  Compatible with RCS Zetta, Dalet Radio Suite, WideOrbit Automation for Radio, and Enco DAD file formats.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Statutory Formats</span>
                <div className="role-spec-value">
                  Pre-configured export structures for ASCAP, BMI, SESAC, PRS for Music, MCSK, KAMP, and PRISK submission requirements.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Fingerprint Recognition</span>
                <div className="role-spec-value">
                  Acoustic fingerprint matching against 50M+ tracks with sub-second cue boundary detection and ISRC/ISWC resolution.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Audit Defensibility</span>
                <div className="role-spec-value">
                  Tamper-evident cryptographic log generation providing full statutory defense against audit penalties and licensing disputes.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Simplify Your Station's Music Compliance Today</h3>
          <p>
            Save hundreds of hours in manual reporting. Ensure full statutory compliance and protect your broadcast licensing.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=media" className="role-btn-primary">
              Register as a Media House <RiArrowRightLine size={15} />
            </Link>
            <a href="#media-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review Broadcaster Plans
            </a>
          </div>
          <span className="role-trust-note">
            Multi-station network licensing · Enterprise SLAs available · Zero data lock-in
          </span>
        </section>
      </div>

      {/* ================= 8. MEDIA HOUSE PLAN BOOKING & ONBOARDING MODAL ================= */}
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
                  Broadcaster Plan Reserved
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
                  {inquirySuccess.msg} Our broadcast engineering desk will contact you to coordinate playlog software ingestion.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=media" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Complete Station Setup
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Broadcaster Plan Reservation
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Broadcaster Compliance Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Automate playlog ingestion, discrepancy detection, and 1-click PRO statutory cue sheet exports.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Station / Network Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Capital FM Network"
                        value={bookingForm.organization_name}
                        onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Contact Officer *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Grace Wanjiku"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Business Email *</label>
                      <input 
                        type="email" 
                        required
                        placeholder="traffic@capitalfm.co.ke"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Direct Phone / Mobile</label>
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
                            estimated_budget: found ? `$${found.price_usd?.toLocaleString()} one-time credit reload` : '$599 one-time credit reload'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="media-station">Single Station Load — $199 one-time (2,000 Credits) · 2 Channels</option>
                        <option value="media-network">Broadcaster Network Suite Load — $599 one-time (7,500 Credits) · 10 Stations</option>
                        <option value="media-conglomerate">Enterprise Media Conglomerate Load — $1,499 one-time (20,000 Credits) · Unlimited Channels</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Channel Count</label>
                      <select
                        value={bookingForm.channel_count}
                        onChange={e => setBookingForm({ ...bookingForm, channel_count: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="1-2 Stations">1-2 Stations / Feeds</option>
                        <option value="3-10 Broadcast Channels">3-10 Broadcast Channels</option>
                        <option value="10-25 Regional Stations">10-25 Regional Stations</option>
                        <option value="25+ Enterprise Network">25+ Enterprise Network</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Station Automation Software</label>
                    <input 
                      type="text" 
                      placeholder="e.g. RCS Zetta, Dalet, WideOrbit, Selector, Enco DAD"
                      value={bookingForm.automation_software}
                      onChange={e => setBookingForm({ ...bookingForm, automation_software: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Compliance Notes / PRO Reporting Requirements</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Need quarterly ASCAP & MCSK playlog exports and real-time discrepancy detection..."
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
                    {inquirySubmitting ? 'Registering Broadcaster Plan…' : 'Lock In Rate & Configure Compliance Suite'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Non-binding reservation · Engineer assigned within 24 hours · SOC-2 compliant data handling
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
