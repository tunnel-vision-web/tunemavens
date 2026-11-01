import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  RiFundsBoxFill,
  RiSparklingFill,
  RiCompass3Fill,
  RiShieldCheckFill,
  RiCoinsFill,
  RiBarChartFill,
  RiArrowRightLine,
  RiCheckFill,
  RiCheckboxCircleFill,
  RiGlobalFill,
  RiRadarFill,
  RiBankCardFill,
  RiCloseFill,
  RiMicFill,
  RiDiscFill,
  RiMusic2Fill,
  RiFileTextFill,
  RiEqualizerFill,
  RiSpeedUpFill,
  RiQuestionFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import tuneCapitalLogo from '../../../assets/logos/tunecapital-logo.png'
import { useRegion } from '../../../RegionContext.jsx'
import vcHero1Img from '../../../assets/images/vc_hero_1.png'
import vcHero2Img from '../../../assets/images/vc_hero_2.png'
import vcHero3Img from '../../../assets/images/vc_hero_3.png'
import vcHero4Img from '../../../assets/images/vc_hero_4.png'
import vcDashboardActualEn from '../../../assets/images/vc_dashboard_actual_en.png'
import vcDashboardActualSw from '../../../assets/images/vc_dashboard_actual_sw.png'
import SEO from '../../../components/common/SEO.jsx'

const DISCOVERY_OPPORTUNITIES = [
  {
    creator_id: 'art_ndufo',
    creator_type: 'artist',
    type_label: 'Recording Artist & Producer',
    name: 'Ndufo',
    handle: '@ndufo',
    origin: 'Nairobi, Kenya',
    genre: 'Afro-House & Live Modular',
    avatar: '/heroes/ndufo_hero_slide1_retina.jpg',
    listeners_label: '620k monthly listeners',
    historical_gross_box_office: 527250.00,
    retention: '84.2%',
    recommended_advance: 50000.00,
    target_irr: '23.6%',
    recoupment_months: '3.8 mos',
    risk: 'Senior Secured (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Tour Advance Underwriting'
  },
  {
    creator_id: 'pod_afrotech',
    creator_type: 'podcaster',
    type_label: 'Technology & VC Audio Show',
    name: 'AfroTech Disruption',
    handle: '@afrotech_disrupt',
    origin: 'Nairobi, Kenya',
    genre: 'Tech, VC & Startup Podcast',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '185k episode downloads/mo',
    historical_gross_box_office: 180000.00,
    retention: '89.2%',
    recommended_advance: 20000.00,
    target_irr: '21.8%',
    recoupment_months: '3.4 mos',
    risk: 'High CPM Ad Flights (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Live Tour & Ad Facility'
  },
  {
    creator_id: 'dj_kalonje',
    creator_type: 'dj',
    type_label: 'Street Anthem & Arena Club DJ',
    name: 'DJ Kalonje (Cyberwave Live)',
    handle: '@djkalonjelive',
    origin: 'Nairobi & Eastlands',
    genre: 'Afro-Fusion & Arena Club Mix',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '740k mix listeners/mo',
    historical_gross_box_office: 760000.00,
    retention: '86.8%',
    recommended_advance: 35000.00,
    target_irr: '24.5%',
    recoupment_months: '2.9 mos',
    risk: 'Highest Live Frequency (Low)',
    tunemavens_fee: '3.0%',
    status: 'Open for Arena Tour Advance'
  },
  {
    creator_id: 'art_amina',
    creator_type: 'artist',
    type_label: 'Recording Artist & Singer',
    name: 'Amina Mwangi',
    handle: '@aminasounds',
    origin: 'Nairobi, Kenya',
    genre: 'Afro-Soul & R&B Vocals',
    avatar: '/heroes/hero_music_1.png',
    listeners_label: '480k monthly listeners',
    historical_gross_box_office: 384000.00,
    retention: '82.5%',
    recommended_advance: 30000.00,
    target_irr: '22.0%',
    recoupment_months: '4.1 mos',
    risk: 'Senior Secured (Low)',
    tunemavens_fee: '3.0%',
    status: 'Acoustic Residency Open'
  },
  {
    creator_id: 'pod_nairobi_beats',
    creator_type: 'podcaster',
    type_label: 'Music Culture & Hip-Hop Show',
    name: 'Nairobi Beats Weekly',
    handle: '@nairobibeatsweekly',
    origin: 'Nairobi & Mombasa',
    genre: 'Culture, Hip-Hop & Gengetone',
    avatar: '/heroes/hero_music_4.png',
    listeners_label: '140k listeners/mo',
    historical_gross_box_office: 127600.00,
    retention: '88.5%',
    recommended_advance: 15000.00,
    target_irr: '22.4%',
    recoupment_months: '3.6 mos',
    risk: 'Low-Moderate',
    tunemavens_fee: '3.0%',
    status: 'Mobile Studio Advance Open'
  },
  {
    creator_id: 'dj_sola',
    creator_type: 'dj',
    type_label: 'International Touring DJ',
    name: 'DJ Sola (Global Afro-Tech)',
    handle: '@djsolaglobal',
    origin: 'London & Nairobi',
    genre: 'Deep Afro-Tech & Electronic',
    avatar: '/heroes/hero_music_2.png',
    listeners_label: '490k stream listeners/mo',
    historical_gross_box_office: 832000.00,
    retention: '85.0%',
    recommended_advance: 45000.00,
    target_irr: '23.5%',
    recoupment_months: '3.9 mos',
    risk: 'International Hard Currency (Low)',
    tunemavens_fee: '3.0%',
    status: 'European Showcase Advance'
  }
];

const FALLBACK_VC_RATES = [
  {
    slug: 'vc-syndicate',
    name: 'Angel Syndicate Facility',
    tier_badge: 'Co-Investment Pool',
    price_usd: 10000.0,
    billing_period: 'minimum capital allocation',
    credits: 0,
    key_metric: '20% - 22% Target IRR · Single Tour Facilities',
    features: [
      'Participate in vetted single-tour and multi-city creator performance facilities',
      'Senior secured first-dollar recoupment via the Split Cascade smart ledger',
      'Direct access to live audience telemetry, box-office receipts, and ticket audits',
      'SHA-256 stamped tripartite legal contracts protecting principal capital',
      'TuneMavens acts as technology intermediary & escrow clearinghouse (3.0% fee)',
      '0 platform credits charged — permanent LP fee exemption'
    ],
    is_popular: false,
    cta: 'Join Syndicate Pool'
  },
  {
    slug: 'vc-growth',
    name: 'Cultural Growth Fund',
    tier_badge: 'Most Popular',
    price_usd: 50000.0,
    billing_period: 'recommended deployment facility',
    credits: 0,
    key_metric: '22% - 25% Target IRR · Multi-Creator Tour Portfolio',
    features: [
      'Multi-creator portfolio deployment across Top 20 recording artists and festival DJs',
      'Automated priority deal flow alerts based on real-time streaming velocity spikes',
      'Comprehensive risk mitigation: escrow lien on ticketing proceeds and DSP royalties',
      'Dedicated institutional portfolio liaison and quarterly legal/tax reporting packs',
      'Integrated tool to sponsor creator platform costs with programmatic 1.25x recoupment',
      'Zero management or platform subscription fees (3.0% protocol clearinghouse only)'
    ],
    is_popular: true,
    cta: 'Deploy Growth Facility'
  },
  {
    slug: 'vc-institutional',
    name: 'Institutional LP Tour Desk',
    tier_badge: 'Enterprise Facility',
    price_usd: 250000.0,
    billing_period: 'bespoke credit facility',
    credits: 0,
    key_metric: '24% - 26% Target IRR · Global Tour Corridors',
    features: [
      'Bespoke Special Purpose Vehicle (SPV) structuring with custom legal covenants',
      'Cross-border underwriting covering 48+ live corridors (Africa, UK, US, EU, UAE)',
      'Direct REST & WebSocket telemetry API integration with internal fund risk models',
      'First-dollar priority recoupment waterfall locked directly into ticketing gateways',
      'Private syndication rights to lead and carve out facilities for downstream LPs',
      'VIP artist tour hospitality access and direct relationships with top artist teams'
    ],
    is_popular: false,
    cta: 'Inquire Institutional Desk'
  }
];

export default function VcLandingPage({ switcher }) {
  const { currencyInfo, formatPrice, language } = useRegion();
  const isSw = language === 'sw';
  const accent = '#10b981';

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

  // Modals & Interactivity
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('all');
  const [selectedUnderwriteTarget, setSelectedUnderwriteTarget] = useState(null);
  const [underwriteExecuted, setUnderwriteExecuted] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);

  // Rate Packages & Opt-In Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_VC_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'vc-growth',
    target_capacity: '$50,000 - $250,000 deployment facility',
    geographic_focus: 'East & West Africa + Global Diaspora (UK/US)',
    notes: ''
  });

  const formatMoney = (usdVal) => {
    if (!currencyInfo) return `$${usdVal.toLocaleString()}`;
    const rate = currencyInfo.rate || 1;
    const symbol = currencyInfo.symbol || '$';
    const converted = Math.round(usdVal * rate);
    return `${symbol} ${converted.toLocaleString()}`;
  };

  const servicesList = [
    { name: 'Global DSP Distribution Package', cost: 149, roi: '15% DSP Royalty Share until 1.25x' },
    { name: 'EPK Pro Domain & Cloud Hosting', cost: 199, roi: '10% Booking Fees until 1.20x' },
    { name: 'AI & Analog Studio Mastering Suite', cost: 250, roi: '12% Stream Payouts until 1.25x' },
    { name: 'SyncMavens Film & TV Representation', cost: 300, roi: '20% Sync Placement Fee until 1.30x' },
    { name: 'Smart CRM Superfan Broadcast Credits', cost: 450, roi: '10% Merch Gross until 1.25x' },
    { name: 'Live Tour Production & Backline Advance', cost: 15000, roi: 'Senior Secured 100% Door until 1.35x' },
  ];

  const filteredOpportunities = DISCOVERY_OPPORTUNITIES.filter(op => {
    if (selectedPersonaFilter === 'all') return true;
    return op.creator_type === selectedPersonaFilter;
  });

  const slides = [
    {
      badge: 'Senior Tour Debt & Alternative Music Assets',
      dot: '#10b981',
      hLine1: 'Underwrite Live Tours.',
      hLine2: '18% to 25% Target Net IRR.',
      hLine2Color: '#10b981',
      s: 'Participate in senior-secured, short-cycle live performance facilities and tour advances backed by verified audience density and gross box office receipts across 48+ global corridors.',
      b1: 'Review Capital Facilities',
      b1link: '#vc-facilities',
      b2: 'Explore Underwriting Radar',
      b2link: '#underwriting-roster',
      image: vcHero1Img
    },
    {
      badge: 'Audience Velocity & Box Office Telemetry',
      dot: '#10b981',
      hLine1: 'Data-Driven Underwriting.',
      hLine2: 'Zero Speculative Guesswork.',
      hLine2Color: '#10b981',
      s: 'Inspect cryptographically certified audience density, historical ticket sales, Spotify listener velocity, and multi-track catalog retention before committing private tour credit.',
      b1: 'Underwrite Active Facilities',
      b1link: '#underwriting-roster',
      b2: 'View Command Center',
      b2link: '#vc-dashboard-preview',
      image: vcHero2Img
    },
    {
      badge: 'Tripartite Legal Vault & Protocol Intermediary',
      dot: '#10b981',
      hLine1: 'Institutional Governance.',
      hLine2: 'Programmatic First-Dollar Recoupment.',
      hLine2Color: '#10b981',
      s: 'All facilities execute under legally vetted tripartite agreements between Investor, Creator, and TuneMavens (3.0% clearinghouse fee). Direct Split Cascade recoupment guarantees 0% platform credit lock-in.',
      b1: 'Inspect Tripartite Protocol',
      b1link: '#triparty-protocol',
      b2: 'Compare vs Traditional Equity',
      b2link: '#vc-comparison',
      image: vcHero3Img
    },
    {
      badge: 'Creator Career Tooling & Sponsorship Facility',
      dot: '#10b981',
      hLine1: 'Sponsor Creator Growth.',
      hLine2: 'Zero Equity Dilution for Artists.',
      hLine2Color: '#10b981',
      s: 'Fund essential platform infrastructure for promising creators — from DSP distribution packages to live touring backlines — secured by a programmatic first-dollar recoupment lien on incoming royalties.',
      b1: 'Sponsor Creator Stack',
      b1link: '#career-sponsorship',
      b2: 'Review Investor FAQ',
      b2link: '#vc-faq',
      image: vcHero4Img
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
    const el = document.getElementById('vc-facilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#vc-facilities');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      target_capacity: `${formatPrice(tier.price_usd)} minimum allocation`,
      notes: `Interested in underwrite facility for ${tier.name}.`
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
        role: 'vc',
        organization_name: bookingForm.organization_name || bookingForm.contact_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.target_capacity,
        notes: `Focus Corridors: ${bookingForm.geographic_focus}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/vc/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInquirySuccess({
          ref: data.reference_code || `VC-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: data.message || 'Institutional LP registration received! An underwriting director will schedule an introductory protocol walkthrough.'
        });
      } else {
        setInquirySuccess({
          ref: `VC-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: 'LP underwriting inquiry received! Telemetry dossier and legal protocol terms have been dispatched to your email.'
        });
      }
    } catch (err) {
      setInquirySuccess({
        ref: `VC-${Math.floor(100000 + Math.random() * 900000)}`,
        msg: 'Facility inquiry received! Our capital markets team will connect with your fund within 2 business hours.'
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How does senior-secured first-dollar recoupment work on TuneMavens?',
      a: 'When an advance facility is underwritten, our technology locks a programmatic first-dollar recoupment instruction directly into ticketing processors (e.g., M-Pesa, Stripe, Flutterwave) and DSP distributors. Every ticket sale and streaming payout automatically routes 100% of door proceeds to repay principal and target interest directly into your LP account before creator net proceeds are unlocked.'
    },
    {
      q: 'What is TuneMavens’ legal and regulatory role in the underwriting protocol?',
      a: 'TuneMavens acts strictly as a neutral technology intermediary and escrow clearinghouse. TuneMavens does not take principal risk, lend its own balance sheet, or charge subscription credits to investors. We collect an audited 3.0% protocol clearinghouse fee on gross disbursements, aligning our incentives entirely with seamless settlement.'
    },
    {
      q: 'What protections exist in the event of tour cancellations or force majeure?',
      a: 'All tripartite agreements require creators to maintain event cancellation insurance and grant a senior floating lien over existing catalog DSP streaming royalties and synchronization licensing revenue. If a live tour is interrupted, recoupment waterfalls pivot automatically to sweep digital streaming earnings until principal is made whole.'
    },
    {
      q: 'Are venture funds or angel syndicates charged monthly fees or platform credits?',
      a: 'Zero platform credits or subscription fees! Institutional investors, venture syndicates, and cultural family offices enjoy permanent LP fee exemption. You only deploy capital into verified facilities, with zero platform subscription overhead.'
    },
    {
      q: 'Can syndicates co-invest or split larger tour facilities across multiple creators?',
      a: 'Yes! The Tune Capital Command Center enables fractional co-investment. You can underwrite a $10,000 slice of a $100,000 multi-city stadium tour, or distribute $50,000 across a basket of five diverse recording artists, podcasters, and DJs to optimize risk-adjusted returns.'
    }
  ];

  return (
    <div className="role-page-wrapper vc-landing-view" style={{ '--role-accent': accent }} data-testid="vc-landing-page">
      <SEO 
        title="Alternative Music Assets & Tour Advance Underwriting | Tune Capital"
        description="TuneMavens empowers venture capital funds, angel syndicates, and cultural family offices to participate in senior-secured, short-cycle tour advances backed by real-time audience telemetry."
        favicon="/favicons/tunecapital.png"
      />
      {switcher}

      {/* ================= 1. Interactive HERO Slide Carousel ================= */}
      <section 
        className="hw role-hero-wrapper"
        aria-label="Venture Capital & Alternative Music Assets Hero Carousel"
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
                  ? (titleHovered ? 'brightness(1.55) blur(0px)' : 'brightness(1.35) blur(1px)')
                  : 'none',
                transform: currentSlide === index && titleHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.2s ease'
              }}
            />
          ))}
          <div 
            className="bgo"
            style={{
              opacity: titleHovered ? 0.38 : 0.82,
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
                src={tuneCapitalLogo} 
                alt="Tune Capital Logo" 
                style={{ height: '36px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>VCs &amp; Alternative Capital</span>
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
                  style={{ background: currentSlideData.dot, color: '#040711' }}
                  onClick={scrollToRates}
                >
                  {currentSlideData.b1} <RiArrowRightLine size={15} style={{ marginLeft: '6px' }} />
                </a>
              ) : (
                <Link 
                  to={currentSlideData.b1link} 
                  className="hbp"
                  style={{ background: currentSlideData.dot, color: '#040711' }}
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

        {/* Carousel Slide Arrows */}
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

        {/* Carousel Bottom Progress & Dots */}
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

      {/* ================= 2. Metrics Bar ================= */}
      <section style={{ background: '#090d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Global Corridors</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>{formatMoney(14200000)}+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Tour VC Capital Deployed</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>22.6%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Target Net IRR</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', display: 'block', fontFamily: 'Sansation, sans-serif' }}>0.0%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Historical Principal Default Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. Core Institutional Feature Pillars ================= */}
      <section id="triparty-protocol" style={{ padding: '80px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '44px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              INSTITUTIONAL UNDERWRITING PROTOCOL
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Senior-Secured Alternative Debt for Venture &amp; Family Offices
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Invest in high-velocity cultural IP without equity dilution or speculative exits. Our algorithmic clearinghouse guarantees programmatic first-dollar recoupment on live box office and royalty cash flows.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiShieldCheckFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Senior Secured Recoupment
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Direct API attachment to live event ticketing gateways and DSP royalty distributions sweeps 100% of first-dollar gross receipts directly to capital providers until principal and target IRR are satisfied.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> 3.8 months average capital recoupment cycle</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Floating senior lien over secondary catalog royalties</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Automated M-Pesa, Stripe &amp; Wire settlements</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(0, 240, 255, 0.12)', color: '#00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiRadarFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Predictive Audience Telemetry
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Underwrite with forensic clarity. Real-time telemetry evaluates fan concentration by GPS coordinates, historical box-office sell-through rates, and track completion velocity to price risk accurately.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Cross-platform streaming momentum analysis</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Algorithmic venue capacity matching</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Real-time risk grading (Low, Moderate, Balanced)</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiFileTextFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Tri-Party Smart Escrow Vault
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Every underwriting commitment executes under standardized tri-party legal agreements sealed with cryptographic SHA-256 stamps. TuneMavens acts as technology intermediary &amp; clearinghouse (3.0% fee).
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> 0 LP platform credits charged</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> Legally enforceable cross-border jurisdiction</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> Immutable blockchain-style audit receipt logs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. Incorporated Creator Discovery & Underwriting Cards Section ================= */}
      <section id="underwriting-roster" style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                UNDERWRITING RADAR · RECORDING ARTISTS, PODCASTERS &amp; DJS
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'Sansation, sans-serif' }}>
                Active Opportunities &amp; Tour Facilities
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Review real-time telemetry, past gross box-office receipts, forward projections, and execute tri-party financing agreements online.
              </p>
            </div>

            {/* Persona Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Opportunities' },
                { id: 'artist', label: 'Recording Artists' },
                { id: 'podcaster', label: 'Podcasters & Shows' },
                { id: 'dj', label: 'Touring DJs' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPersonaFilter(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: selectedPersonaFilter === tab.id ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPersonaFilter === tab.id ? '#10b981' : 'rgba(255,255,255,0.03)',
                    color: selectedPersonaFilter === tab.id ? '#040711' : '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Underwriting Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {filteredOpportunities.map((op) => (
              <div
                key={op.creator_id}
                style={{
                  background: '#090d1f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                  <img
                    src={op.avatar}
                    alt={op.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        background: op.creator_type === 'artist' ? 'rgba(0, 240, 255, 0.12)' : op.creator_type === 'podcaster' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: op.creator_type === 'artist' ? '#00f0ff' : op.creator_type === 'podcaster' ? '#c084fc' : '#fbbf24',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}>
                        {op.type_label}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '4px 0 2px' }}>{op.name}</h4>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{op.genre} · {op.origin}</span>
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Audience Volume</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{op.listeners_label}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Historical Box Office</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{formatMoney(op.historical_gross_box_office)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Advance Facility</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>{formatMoney(op.recommended_advance)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Modelled Net IRR</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{op.target_irr} ({op.recoupment_months})</span>
                  </div>
                </div>

                {/* Protocol Info */}
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <span>TuneMavens Protocol Fee: <strong style={{ color: '#fff' }}>{op.tunemavens_fee}</strong></span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>Senior Secured Recoupment</span>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedUnderwriteTarget(op)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#10b981',
                      color: '#040711',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiFundsBoxFill size={15} /> Underwrite Facility
                  </button>

                  <Link
                    to="/dashboard?tab=vc-discover&role=vc"
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '11.5px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Full Telemetry &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. Direct Creator Career Sponsorship Section ================= */}
      <section id="career-sponsorship" style={{ padding: '70px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              DIRECT CREATOR CAREER SPONSORSHIP
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Invest in Any Creator by Facilitating Their Product &amp; Service Costs
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Rather than traditional equity dilution, VCs can directly sponsor the operational tooling creators need to launch releases, package electronic press kits, and sell out tour stops. Every dollar funded creates a programmatic first-dollar recoupment lien on incoming royalties.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {servicesList.map((svc, sIdx) => (
              <div key={sIdx} style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: 0, fontFamily: 'Sansation, sans-serif' }}>{svc.name}</h4>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{formatMoney(svc.cost)}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--cyan)', marginBottom: '16px' }}>
                  <strong>Recoupment Waterfall:</strong> {svc.roi}
                </div>
                <Link to="/dashboard?tab=vc-sponsorship&role=vc" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px', textDecoration: 'none', display: 'block' }}>
                  Sponsor for Creator <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. Actual System Screenshot Preview ================= */}
      <section id="vc-dashboard-preview" style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ACTUAL PLATFORM DASHBOARD PREVIEW
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            The TuneMavens VC Command Center
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.7 }}>
            Explore the authentic, live system interface where venture partners inspect audience telemetry, underwrite tour corridors, and monitor real-time Split Cascade distributions.
          </p>

          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? vcDashboardActualSw : vcDashboardActualEn} 
              alt="Actual TuneMavens VC Command Center Screenshot" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '6px', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.85)'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 600 }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. 3-Step Guided Underwriting Workflow ================= */}
      <section style={{ padding: '80px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              HOW VENTURE UNDERWRITING WORKS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Three Guided Steps to Institutional Music Deployment
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Underwrite verified creators in minutes with bank-grade legal security and automated clearing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '36px', fontWeight: 900, color: 'rgba(16, 185, 129, 0.15)', fontFamily: 'Sansation, sans-serif' }}>
                01
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RiRadarFill size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                1. Inspect Verified Telemetry
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Filter across artists, podcasters, and DJs. Review verified historical gross box-office receipts, streaming listener velocity, and venue capacity matching models.
              </p>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '36px', fontWeight: 900, color: 'rgba(0, 240, 255, 0.15)', fontFamily: 'Sansation, sans-serif' }}>
                02
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(0, 240, 255, 0.12)', color: '#00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RiShieldCheckFill size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                2. Execute Tri-Party Legal Vault
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Deploy principal advance under a SHA-256 stamped tripartite agreement appointing TuneMavens as technology intermediary &amp; escrow clearinghouse (3.0% fee).
              </p>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '36px', fontWeight: 900, color: 'rgba(245, 158, 11, 0.15)', fontFamily: 'Sansation, sans-serif' }}>
                03
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RiCoinsFill size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                3. First-Dollar Recoupment Stream
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                As tickets are sold and live performances execute, 100% of door revenues clear programmatically into your LP account until principal and 18-25% target IRR are repaid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. Detailed Comparison Table ================= */}
      <section id="vc-comparison" style={{ padding: '80px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px auto' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CAPITAL EFFICIENCY &amp; RISK PROFILE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Tune Capital Alternative Debt vs Traditional Venture Equity
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Why modern institutional funds prefer short-cycle, senior-secured tour debt over illiquid equity stakes.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Investment Metric</th>
                  <th style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)' }}>Tune Capital Tour Credit</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Traditional Tech / Media VC</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Legacy Music Royalty Funds</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Recoupment Horizon</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>2.9 to 4.2 Months (Short-Cycle)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>7 to 10 Years (Illiquid Exit)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>10 to 15 Years (Slow Yield)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Target Net IRR</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>18.0% to 25.0% Net Annualized</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Power-law speculative (~15%)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>6.0% to 9.5% Royalty Dividend</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Recoupment Priority</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>Senior Secured First-Dollar Door Lien</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Junior Equity (Last in Line)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Subordinate Catalog Fractions</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Dilution for Creator</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>0% Equity Dilution (IP Kept 100%)</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>20% - 40% Permanent Cap Table Loss</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>Master Copyright Permanent Sale</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Audit &amp; Telemetry Transparency</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>Live Stream Telemetry &amp; SHA-256 Hashes</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Self-reported quarterly decks</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Semi-annual delayed label statements</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>LP Fees &amp; Platform Credits</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)' }}>0 LP Credits (3.0% Protocol Intermediary Fee)</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>2.0% Mgmt Fee + 20% Carry</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>High catalog appraisal fees</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= 9. Transparent Capital Commitment Tiers ================= */}
      <section id="vc-facilities" style={{ padding: '80px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px auto' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CAPITAL COMMITMENT FACILITIES
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Structured Tour Facilities Tailored to Your Deployment Mandate
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Select an allocation facility tier below. All capital commitments deploy under senior-secured tripartite legal covenants with zero platform credits charged.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {tierPackages.map((tier) => (
              <div
                key={tier.slug}
                style={{
                  background: '#090d1f',
                  border: tier.is_popular ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: tier.is_popular ? '0 12px 36px rgba(16, 185, 129, 0.12)' : '0 8px 24px rgba(0,0,0,0.4)'
                }}
              >
                {tier.is_popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '24px',
                    background: '#10b981',
                    color: '#040711',
                    fontSize: '10.5px',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '3px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px'
                  }}>
                    {tier.tier_badge}
                  </span>
                )}

                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  {tier.tier_badge}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                  {tier.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#10b981', fontFamily: 'Sansation, sans-serif' }}>
                    {formatPrice(tier.price_usd)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    / {tier.billing_period}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700, marginBottom: '20px' }}>
                  {tier.key_metric}
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', fontSize: '13px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                  {(tier.features || []).map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                      <RiCheckFill size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: 1.5 }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(tier)}
                  style={{
                    padding: '12px',
                    background: tier.is_popular ? '#10b981' : 'rgba(255,255,255,0.06)',
                    color: tier.is_popular ? '#040711' : '#fff',
                    border: tier.is_popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {tier.cta} <RiArrowRightLine size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 10. Comprehensive Institutional FAQ Accordion ================= */}
      <section id="vc-faq" style={{ padding: '80px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              INSTITUTIONAL INVESTOR FAQ
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Frequently Asked Questions for Limited Partners &amp; Syndicates
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Key governance, legal underwriting covenants, and escrow mechanics detailed for funds.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, fIdx) => (
              <div 
                key={fIdx}
                style={{
                  background: '#090d1f',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === fIdx ? null : fIdx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '18px', color: '#10b981', transition: 'transform 0.2s', transform: faqOpen === fIdx ? 'rotate(45deg)' : 'none' }}>
                    +
                  </span>
                </button>
                {faqOpen === fIdx && (
                  <div style={{ padding: '0 22px 20px', color: '#94a3b8', fontSize: '13.5px', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 11. High-Impact Bottom Call to Action Banner ================= */}
      <section style={{ padding: '80px 0', background: 'radial-gradient(ellipse at center, #062b1e 0%, #060914 100%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ALTERNATIVE ASSET DEPLOYMENT DESK
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', margin: '12px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            Deploy Alternative Capital into High-Yielding Cultural IP
          </h2>
          <p style={{ fontSize: '15.5px', color: '#94a3b8', lineHeight: 1.7, margin: '0 auto 32px auto', maxWidth: '680px' }}>
            Gain direct, senior-secured exposure to live tour cash flows with 18% to 25% target IRR backed by live box-office telemetry.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/dashboard?tab=vc-portfolio&role=vc"
              className="btn-primary"
              style={{ padding: '14px 32px', background: '#10b981', borderColor: '#10b981', color: '#040711', fontSize: '15px', fontWeight: 800 }}
            >
              Launch VC Command Center <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
            </Link>
            <button
              type="button"
              onClick={() => handleOpenBooking(tierPackages[1])}
              style={{
                padding: '14px 28px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '14.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Inquire Growth Facility ($50k+)
            </button>
          </div>
        </div>
      </section>

      {/* ================= 12. Institutional Underwriting Facility Modal ================= */}
      {modalOpen && (
        <div 
          className="preview-modal-backdrop" 
          onClick={() => { setModalOpen(false); setInquirySuccess(null); }} 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(8px)', 
            zIndex: 99999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '24px' 
          }}
        >
          <div 
            style={{ 
              background: '#090d1f', 
              border: '1px solid #10b981', 
              borderRadius: '8px', 
              maxWidth: '560px', 
              width: '100%', 
              padding: '28px', 
              color: '#fff',
              maxHeight: '90vh',
              overflowY: 'auto'
            }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiFundsBoxFill size={22} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  {inquirySuccess ? 'Facility Application Received' : `Inquire: ${selectedTier?.name || 'Tune Capital Facility'}`}
                </h3>
              </div>
              <button 
                onClick={() => { setModalOpen(false); setInquirySuccess(null); }} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseFill size={20} />
              </button>
            </div>

            {!inquirySuccess ? (
              <form onSubmit={handleInquirySubmit}>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '18px' }}>
                  Register institutional interest for <strong style={{ color: '#10b981' }}>{selectedTier?.name}</strong> ({formatPrice(selectedTier?.price_usd || 50000)} minimum allocation). TuneMavens acts as protocol technology intermediary (3.0% fee, 0 platform credits).
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Fund / Syndicate / Family Office Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Serengeti Cultural Growth Fund"
                      value={bookingForm.organization_name}
                      onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Managing Partner / LP Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Ochieng"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Institutional Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david@serengeticapital.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Target Deployment Capacity
                      </label>
                      <select
                        value={bookingForm.target_capacity}
                        onChange={e => setBookingForm({ ...bookingForm, target_capacity: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0f24', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      >
                        <option value="$10,000 - $50,000 (Syndicate slice)">$10,000 - $50,000 (Syndicate slice)</option>
                        <option value="$50,000 - $250,000 (Growth Fund)">$50,000 - $250,000 (Growth Fund)</option>
                        <option value="$250,000 - $1,000,000 (Institutional Tour Desk)">$250,000 - $1,000,000 (Institutional Tour Desk)</option>
                        <option value="$1,000,000+ (Master Tour Facility SPV)">$1,000,000+ (Master Tour Facility SPV)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={bookingForm.contact_phone}
                        onChange={e => setBookingForm({ ...bookingForm, contact_phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Preferred Geographic Focus Corridors
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. East & West Africa + London / European Festivals"
                      value={bookingForm.geographic_focus}
                      onChange={e => setBookingForm({ ...bookingForm, geographic_focus: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Investment Mandate &amp; Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Seeking senior-secured tour debt with 20%+ target IRR and under 4-month recoupment cycles."
                      value={bookingForm.notes}
                      onChange={e => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px', resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#10b981',
                      color: '#040711',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: inquirySubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {inquirySubmitting ? 'Transmitting Mandate...' : 'Submit Facility Mandate &rarr;'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{
                      padding: '12px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <RiCheckboxCircleFill size={52} color="#10b981" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
                  Institutional Application Received!
                </h4>
                <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', color: '#10b981', fontWeight: 800, marginBottom: '16px' }}>
                  Reference Dossier: {inquirySuccess.ref}
                </div>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '22px' }}>
                  {inquirySuccess.msg}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <Link
                    to="/dashboard?tab=vc-portfolio&role=vc"
                    style={{
                      padding: '10px 22px',
                      background: '#10b981',
                      color: '#040711',
                      borderRadius: '4px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    Open VC Portfolio Command &rarr;
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setModalOpen(false); setInquirySuccess(null); }}
                    style={{
                      padding: '10px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Underwriting Quick Modal for Creator Opportunities */}
      {selectedUnderwriteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#090d1f', border: '1px solid #10b981', borderRadius: '8px', maxWidth: '560px', width: '100%', padding: '28px', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiShieldCheckFill size={22} color="#10b981" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Tri-Party Underwriting Facility</h3>
              </div>
              <button onClick={() => { setSelectedUnderwriteTarget(null); setUnderwriteExecuted(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <RiCloseFill size={20} />
              </button>
            </div>

            {!underwriteExecuted ? (
              <>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
                  Execute a Senior Tour Advance Facility for <strong style={{ color: '#fff' }}>{selectedUnderwriteTarget.name}</strong> under the TuneMavens Tri-Party Protocol:
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', marginBottom: '20px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Principal Advance:</span>
                    <strong style={{ color: '#10b981' }}>{formatMoney(selectedUnderwriteTarget.recommended_advance)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Modelled Target IRR:</span>
                    <strong style={{ color: '#38bdf8' }}>{selectedUnderwriteTarget.target_irr}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>TuneMavens Protocol Fee:</span>
                    <strong style={{ color: '#fff' }}>3.0% automated clearinghouse fee</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Platform Credits Charged:</span>
                    <strong style={{ color: '#10b981' }}>0 Credits (Permanent LP Exemption)</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setUnderwriteExecuted(true)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Execute Tri-Party Agreement Online &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedUnderwriteTarget(null); setUnderwriteExecuted(false); }}
                    style={{
                      padding: '11px 18px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <RiCheckboxCircleFill size={52} color="#10b981" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
                  Facility Executed Successfully!
                </h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                  Agreement sealed with SHA-256 cryptographic stamp. TuneMavens appointed as technology intermediary and escrow clearinghouse (3.0% fee). Telemetry and Split Cascade waterfalls are now unlocked for {selectedUnderwriteTarget.name}.
                </p>
                <Link
                  to="/dashboard?tab=splits&role=vc"
                  style={{
                    display: 'inline-block',
                    padding: '10px 24px',
                    background: '#10b981',
                    color: '#040711',
                    borderRadius: '4px',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  View in Split Cascade Studio &rarr;
                </Link>
              </div>
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
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMavens VC Command Center · Actual System Interface</h3>
            <img src={isSw ? vcDashboardActualSw : vcDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '3px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
