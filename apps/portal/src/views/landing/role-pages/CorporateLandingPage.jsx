import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiBuilding2Fill, 
  RiMegaphoneFill, 
  RiCoinsFill, 
  RiFundsBoxFill, 
  RiBarChartBoxFill, 
  RiUserSharedFill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiTargetFill,
  RiShieldCheckFill,
  RiCloseFill,
  RiHeadphoneFill,
  RiRadioFill,
  RiCheckboxCircleFill,
  RiGlobalFill,
  RiTimerFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import headerImg from '../../../assets/images/header_pricing.png'
import headerAppsImg from '../../../assets/images/header_apps.png'
import userManagerImg from '../../../assets/images/user_manager.png'
import headerAboutImg from '../../../assets/images/header_about.png'
import tunepayLogo from '../../../assets/logos/tunepay-logo.png'

const FALLBACK_RATES = [
  {
    slug: 'pulse',
    name: 'Audio Interstitial Starter (Pulse)',
    tier_badge: 'Essential Reach',
    price_usd: 499.0,
    credits: 2500,
    cpm_usd: 19.96,
    guaranteed_impressions: 25000,
    duration_days: 30,
    formats: [
      '15s Studio Audio Interstitial on TuneStream',
      '300x250 Display Companion Banner'
    ],
    features: [
      '25,000 Guaranteed Stream Impressions (~$19.96 CPM)',
      '15s Unskippable Audio Interstitial between playlist queues',
      'Single-genre subculture targeting (Afrobeats, Amapiano, Hip Hop, Indie)',
      'Frequency capping (max 1x per hour per listener)',
      'Verified audio completion auditing (75% & 100% completions)',
      'Intermaven Smart CRM lead capture routing'
    ],
    is_popular: false,
    cta: 'Book Pulse Spot'
  },
  {
    slug: 'amplified',
    name: 'Targeted Campaign Growth (Amplified)',
    tier_badge: 'Most Popular',
    price_usd: 1499.0,
    credits: 7500,
    cpm_usd: 14.99,
    guaranteed_impressions: 100000,
    duration_days: 30,
    formats: [
      '15s & 30s High-Fidelity Audio Spots',
      'In-Player Interactive Vinyl Badge',
      'Creator EPK Banner Takeovers'
    ],
    features: [
      '100,000 Guaranteed Stream Impressions (~$14.99 CPM)',
      '15s & 30s High-Fidelity Audio Spots on TuneStream',
      'Subculture & territory geo-targeting (East Africa, West Africa, UK Diaspora, US Urban)',
      'Interactive click-through voucher / instant discount code redemption',
      '100% indemnified sync rights on commercial background audio',
      'Live attribution dashboard with conversion heatmaps & CTR reporting'
    ],
    is_popular: true,
    cta: 'Launch Amplified Spot'
  },
  {
    slug: 'culture-lead',
    name: 'Artist EPK & Tour Co-Sponsorship (Culture Lead)',
    tier_badge: 'Cultural Alignment',
    price_usd: 3999.0,
    credits: 20000,
    cpm_usd: 13.33,
    guaranteed_impressions: 300000,
    duration_days: 60,
    formats: [
      'Co-Branded Digital QR Ticket Passes',
      '3-Line Hero Carousel Banner on Creator EPKs',
      '30s Premium Audio Spots'
    ],
    features: [
      '300,000+ Multichannel Fan Impressions across live tours & digital EPKs',
      'Co-branded Digital QR Ticket Passes on verified artist concert tours',
      'Custom Subdomain Hero Carousel slot on Creator Web Worlds',
      'Experiential on-site sampling booth integration & M-Pesa STK sampling push',
      'Smart CRM automated omnichannel lead routing (WhatsApp, SMS, Email)',
      'Dedicated creator social co-mention & promotional protocol'
    ],
    is_popular: false,
    cta: 'Sponsor Creator Tour'
  },
  {
    slug: 'titan',
    name: 'Enterprise Omnichannel Takeover (Titan)',
    tier_badge: 'Category Exclusive',
    price_usd: 9999.0,
    credits: 50000,
    cpm_usd: 9.99,
    guaranteed_impressions: 1000000,
    duration_days: 90,
    formats: [
      '100% Station Share of Voice',
      'SyncMavens Sync Brief Commercial Ingress',
      'Custom Mother-CMS Brand Hub'
    ],
    features: [
      '1,000,000+ Omnichannel Impressions across TuneMavens, TuneStream & SyncMavens',
      '100% Category Exclusivity (zero competing brand ads in your industry vertical)',
      'Custom Sonic Branding & Audio Logo production by verified audio engineers',
      'Priority Sync Brief matching for national TV spots on SyncMavens',
      'Direct CRM API Webhook stream for real-time customer data sync',
      'Dedicated Senior Agency Media Director & quarterly audit reporting'
    ],
    is_popular: false,
    cta: 'Request Enterprise RFP'
  }
]

export default function CorporateLandingPage() {
  const accent = '#ef4444';

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [adRates, setAdRates] = useState(FALLBACK_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    brand_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'amplified',
    target_region: 'East Africa / Global Diaspora',
    target_genre: 'Afrobeats, Amapiano & Electronic',
    estimated_budget: '$1,499 (7,500 Credits)',
    spot_duration: '30s',
    preferred_start_date: '',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  // Fetch live ad rates from backend API
  useEffect(() => {
    fetch('/api/corporate/ad-rates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAdRates(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback ad rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'Omnichannel Sonic Branding',
      dot: '#ef4444',
      hLine1: 'Own Your Sonic Identity.',
      hLine2: 'Targeted Native Placements.',
      hLine2Color: '#ef4444',
      s: 'Connect consumer brands directly to high-intent music listeners and cultural creators through immersive native audio placements and verified creator sponsorships.',
      b1: 'Launch Brand Campaign',
      b1link: '#business-ad-rates',
      b2: 'Explore Sonic Branding',
      b2link: '#sonic-branding',
      image: headerImg
    },
    {
      badge: '100% Indemnified Sync Clearances',
      dot: '#ef4444',
      hLine1: 'Zero Legal Ambiguity.',
      hLine2: 'Pre-Cleared Commercials.',
      hLine2Color: '#ef4444',
      s: 'License original music for national TV commercials, social digital spots, and global retail activations with ironclad worldwide indemnification and zero residual risk.',
      b1: 'Browse Commercial Vault',
      b1link: '/register?role=corporate',
      b2: 'Review Indemnification',
      b2link: '#commercial-rights',
      image: headerAppsImg
    },
    {
      badge: 'Direct Creator Tour Sponsorships',
      dot: '#ef4444',
      hLine1: 'Sponsor Verified Tours.',
      hLine2: 'Omnichannel Activations.',
      hLine2Color: '#ef4444',
      s: 'Integrate brand experiential booths, on-site POS sampling, and sponsored digital QR tickets directly into sold-out artist tours and music festival stages.',
      b1: 'Explore Creator Roster',
      b1link: '/for/creator',
      b2: 'Tour Sponsorship Specs',
      b2link: '#tour-sponsorship',
      image: userManagerImg
    },
    {
      badge: 'Unified Campaign Ledgers',
      dot: '#ef4444',
      hLine1: 'Transparent ROI Analytics.',
      hLine2: 'Real-Time Engagement.',
      hLine2Color: '#ef4444',
      s: 'Monitor audio ad completion rates, fan click-throughs, and promotional voucher redemptions in real time under your corporate marketing dashboard.',
      b1: 'Create Corporate Account',
      b1link: '/register?role=corporate',
      b2: 'Campaign Budget Options',
      b2link: '#business-ad-rates',
      image: headerAboutImg
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

  // Smooth scroll helper
  const scrollToRates = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('business-ad-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#business-ad-rates');
    }
  };

  // Open booking modal
  const handleOpenBooking = (rate) => {
    setSelectedTier(rate);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: rate.slug,
      estimated_budget: `$${rate.price_usd?.toLocaleString()} (${rate.credits?.toLocaleString()} Credits)`
    }));
    setInquirySuccess(null);
    setModalOpen(true);
  };

  // Submit inquiry to backend
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquirySuccess(null);

    try {
      const payload = {
        brand_name: bookingForm.brand_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        target_region: bookingForm.target_region,
        target_genre: bookingForm.target_genre,
        estimated_budget: bookingForm.estimated_budget,
        preferred_start_date: bookingForm.preferred_start_date || undefined,
        notes: `${bookingForm.spot_duration ? `Spot Length: ${bookingForm.spot_duration}. ` : ''}${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/corporate/inquiries', {
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
        alert(data.detail || 'Unable to submit inquiry. Please try again.');
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
        aria-label="Corporate & Brands Hero Carousel"
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
                src={tunepayLogo} 
                alt="TunePay Brand Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            {/* Breadcrumb indicator */}
            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Corporate &amp; Brands</span>
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
              {currentSlideData.b1link.startsWith('#') ? (
                <a 
                  href={currentSlideData.b1link} 
                  className="hbp"
                  style={{ background: currentSlideData.dot }}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.querySelector(currentSlideData.b1link);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.pushState(null, '', currentSlideData.b1link);
                    }
                  }}
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
            <span className="role-stat-label">Legally Indemnified Commercial Rights</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">3.4x</span>
            <span className="role-stat-label">Higher Engagement vs. Programmatic Banners</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Omnichannel</span>
            <span className="role-stat-label">Native Audio Spots, Live Passes &amp; CRM Drops</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Unified</span>
            <span className="role-stat-label">Intermaven Cross-Platform Ad Credit Pool</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="sonic-branding" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Enterprise Brand Advertising</span>
            <h3 className="role-section-title">Built for Cultural Impact &amp; Measurable Conversion</h3>
            <p className="role-section-desc">
              From immersive audio interstitial spots to direct creator sponsorships, engage active music audiences where attention is highest.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiMegaphoneFill size={24} /></div>
              <h4 className="role-pillar-title">Native Audio Interstitial Spots</h4>
              <p className="role-pillar-desc">
                Broadcast studio-grade 15s and 30s audio spots between streaming tracks on TuneStream with unskippable fidelity and companion visual banners.
              </p>
            </div>

            <div className="role-pillar-card" id="tour-sponsorship" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiUserSharedFill size={24} /></div>
              <h4 className="role-pillar-title">Artist Tour &amp; EPK Sponsorships</h4>
              <p className="role-pillar-desc">
                Sponsor top-performing creator web worlds, live album drops, and concert tours with co-branded digital ticket passes and interactive hero carousel banners.
              </p>
            </div>

            <div className="role-pillar-card" id="commercial-rights" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiTargetFill size={24} /></div>
              <h4 className="role-pillar-title">Hyper-Targeted Fan Demographics</h4>
              <p className="role-pillar-desc">
                Target listeners by musical subculture, geographic territory (East Africa, West Africa, Diaspora), device ecosystem, and high-frequency stream habits.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiFundsBoxFill size={24} /></div>
              <h4 className="role-pillar-title">Unified Intermaven Network Credits</h4>
              <p className="role-pillar-desc">
                Deposit ad spend once into the Intermaven credits vault. Allocate credits flexibly across TuneMavens audio ads, SyncMavens briefs, and partner network activations.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBarChartBoxFill size={24} /></div>
              <h4 className="role-pillar-title">Live Attribution &amp; Conversion Analytics</h4>
              <p className="role-pillar-desc">
                Monitor live audio impressions, click-through actions, coupon redemptions, and real-time fan engagement metrics on your dedicated brand analytics dashboard.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiBuilding2Fill size={24} /></div>
              <h4 className="role-pillar-title">Omnichannel Lead Generation</h4>
              <p className="role-pillar-desc">
                Collect opt-in leads directly through creator live world activations, routing seamlessly into Intermaven Smart CRM for automated WhatsApp, SMS, and email follow-ups.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">Enterprise Brand Studio</span>
            <h3>Campaign Management &amp; CRM Console</h3>
            <p>
              Launch, monitor, and optimize your brand sponsorships with granular budget pacing, demographic filtering, and live conversion attribution.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Direct partnerships with verified indie artists and major curators</li>
              <li><RiCheckFill size={18} /> Transparent cost-per-listen and cost-per-acquisition reporting</li>
              <li><RiCheckFill size={18} /> Custom brand playlists curated by influential taste-makers</li>
              <li><RiCheckFill size={18} /> Dedicated agency account manager and campaign strategy support</li>
            </ul>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <Link to="/register?role=corporate" className="role-btn-primary">
                Launch Brand Account <RiArrowRightLine size={14} />
              </Link>
              <a href="#business-ad-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Business Ad Rates
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={userManagerImg} alt="TuneMavens Corporate Campaign and CRM Management" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Campaign Launch</span>
            <h3 className="role-section-title">How Brands Run Campaigns on TuneMavens</h3>
            <p className="role-section-desc">From brief submission to measurable listener reach in 3 steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiTargetFill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Strategy</span>
              <h4 className="role-step-title">Select Objective &amp; Audience</h4>
              <p className="role-step-desc">
                Define your brand campaign goals: audio brand awareness, live event tour sponsorship, or direct-response digital coupon activations.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiMegaphoneFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Placement</span>
              <h4 className="role-step-title">Upload Assets &amp; Allocate Credits</h4>
              <p className="role-step-desc">
                Upload your studio audio spots, select creator web world banner slots, and set your weekly credit budget using our unified balance pool.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiBarChartBoxFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Optimization</span>
              <h4 className="role-step-title">Track Real-Time Conversion &amp; Leads</h4>
              <p className="role-step-desc">
                Analyze live verified listens, audience demographic heatmaps, and route generated customer leads directly into your Intermaven CRM workflows.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. BUSINESS AD RATES & SPONSORSHIP PACKAGES ================= */}
        <section id="business-ad-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Transparent Rate Card &amp; Media Specifications</span>
            <h3 className="role-section-title">Established Business Ad Rates &amp; Sponsorship Tiers</h3>
            <p className="role-section-desc">
              Predictable CPM advertising and high-impact cultural sponsorships. Reach high-intent music listeners on TuneStream and concertgoers across Creator Web Worlds with unified TM credit flexibility or direct billing.
            </p>
          </div>

          {/* Rate Cards Grid */}
          <div className="corporate-rates-grid">
            {adRates.map((rate) => (
              <div 
                key={rate.slug} 
                className={`corporate-rate-card ${rate.is_popular ? 'featured' : ''}`}
              >
                {rate.is_popular && (
                  <span className="corporate-featured-tag">
                    Most Popular
                  </span>
                )}

                <span className="corporate-rate-badge">{rate.tier_badge || 'Media Flight'}</span>
                <h4 className="corporate-rate-title">{rate.name}</h4>

                <div className="corporate-rate-price-box">
                  <span className="corporate-rate-price">${rate.price_usd?.toLocaleString()}</span>
                  <span className="corporate-rate-period">/ {rate.duration_days} days</span>
                </div>

                <div className="corporate-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    or {rate.credits?.toLocaleString()} TM Credits
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: '#00f0ff', fontWeight: 600 }}>
                    ${rate.cpm_usd} CPM
                  </span>
                </div>

                <div className="corporate-rate-reach">
                  <strong style={{ color: '#fff' }}>{rate.guaranteed_impressions?.toLocaleString()}</strong> Guaranteed Audio Listens
                </div>

                <ul className="corporate-rate-features">
                  {(rate.features || []).map((feature, i) => (
                    <li key={i} className="corporate-rate-feature-item">
                      <RiCheckFill size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
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
                  {rate.cta || 'Book Ad Spot'} <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
                </button>
              </div>
            ))}
          </div>

          {/* Technical Specs & Compliance Panel */}
          <div className="corporate-specs-panel">
            <h4 className="corporate-specs-title">
              <RiShieldCheckFill size={20} color="#ef4444" /> Media Specifications &amp; Commercial Indemnification
            </h4>
            <div className="corporate-specs-grid">
              <div className="corporate-spec-box">
                <span className="corporate-spec-label">Audio Formats</span>
                <div className="corporate-spec-value">
                  15s &amp; 30s studio-grade MP3/WAV (320kbps stereo). Mastered to industry standards (max -14 LUFS integrated).
                </div>
              </div>

              <div className="corporate-spec-box">
                <span className="corporate-spec-label">Companion Display</span>
                <div className="corporate-spec-value">
                  300x250 Medium Rectangle, 728x90 Leaderboard &amp; 1920x640 Retina Creator EPK Carousel Banners (PNG/JPG &lt; 5MB).
                </div>
              </div>

              <div className="corporate-spec-box">
                <span className="corporate-spec-label">Delivery &amp; Audit</span>
                <div className="corporate-spec-value">
                  Certified audio impression auditing. First-party completion telemetry (25%, 50%, 75%, 100%) and frequency-capped delivery.
                </div>
              </div>

              <div className="corporate-spec-box">
                <span className="corporate-spec-label">Legal Indemnity</span>
                <div className="corporate-spec-value">
                  100% pre-cleared commercial indemnification through the Intermaven legal framework with zero residual union royalty exposure.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Elevate Your Brand's Cultural Relevance</h3>
          <p>
            Align your marketing with the fastest-growing music ecosystems in the world. Reach fans where they listen.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=corporate" className="role-btn-primary">
              Register Brand Workspace <RiArrowRightLine size={15} />
            </Link>
            <a 
              href="#business-ad-rates" 
              className="role-btn-secondary"
              onClick={scrollToRates}
            >
              Review Business Ad Rates
            </a>
          </div>
          <span className="role-trust-note">
            Self-serve and managed agency plans · Certified impression auditing · Dedicated media rep
          </span>
        </section>
      </div>

      {/* ================= 8. CORPORATE AD BOOKING & RFP MODAL ================= */}
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
              border: '1px solid #ef4444',
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
                  Ad Inquiry Registered
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
                  {inquirySuccess.msg} Your brand brief has been routed to the Intermaven Corporate Media desk and Smart CRM.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=corporate" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Create Brand Account
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Corporate Rate Booking &amp; RFP
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Business Ad Campaign'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Lock in your flight rates. An Intermaven Media Director will confirm placement inventory and audio delivery within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Brand / Organization *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Nike Africa"
                        value={bookingForm.brand_name}
                        onChange={e => setBookingForm({ ...bookingForm, brand_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Contact Person *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Kofi Mensah"
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
                        placeholder="media@brand.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>WhatsApp / Phone</label>
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
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Rate Tier</label>
                      <select
                        value={bookingForm.tier_slug}
                        onChange={e => {
                          const slug = e.target.value;
                          const found = adRates.find(r => r.slug === slug);
                          setBookingForm({
                            ...bookingForm,
                            tier_slug: slug,
                            estimated_budget: found ? `$${found.price_usd?.toLocaleString()} (${found.credits?.toLocaleString()} Credits)` : '$1,499'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="pulse">Pulse — $499 (2,500 Credits) · 25k Listens</option>
                        <option value="amplified">Amplified — $1,499 (7,500 Credits) · 100k Listens</option>
                        <option value="culture-lead">Culture Lead — $3,999 (20,000 Credits) · 300k Fans</option>
                        <option value="titan">Titan — $9,999+ (50,000 Credits) · 1M+ Reach</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Audio Spot Format</label>
                      <select
                        value={bookingForm.spot_duration}
                        onChange={e => setBookingForm({ ...bookingForm, spot_duration: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="15s">15-Second Audio Spot</option>
                        <option value="30s">30-Second Audio Spot</option>
                        <option value="tour_sponsor">Tour Pass &amp; EPK Takeover</option>
                        <option value="production_needed">Need Studio Sonic Production</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Target Territories</label>
                      <input 
                        type="text" 
                        value={bookingForm.target_region}
                        onChange={e => setBookingForm({ ...bookingForm, target_region: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Target Genres / Subcultures</label>
                      <input 
                        type="text" 
                        value={bookingForm.target_genre}
                        onChange={e => setBookingForm({ ...bookingForm, target_genre: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Additional Campaign Notes / Desired Launch Date</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Flight dates: Nov 1 - Dec 15. Link to audio file or creative brief..."
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
                    {inquirySubmitting ? 'Registering Brief…' : 'Lock In Rate & Request Placement Inventory'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Non-binding reservation · Inventory confirmed within 24 hours · Intermaven Smart CRM routing
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
