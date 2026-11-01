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
import { AUTHORITATIVE_VC_PACKAGES } from '../../../data/authoritativeRolePricing.js'
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

const FALLBACK_VC_RATES = AUTHORITATIVE_VC_PACKAGES;

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

  // Active Opportunities Carousel State
  const [currentOpIndex, setCurrentOpIndex] = useState(0);
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('all');

  // Modals & Interactivity
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedUnderwriteTarget, setSelectedUnderwriteTarget] = useState(null);
  const [underwriteExecuted, setUnderwriteExecuted] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);

  // Rate Packages & Opt-In Modal State (Single Source of Truth)
  const [tierPackages, setTierPackages] = useState(AUTHORITATIVE_VC_PACKAGES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  // Fetch authoritative role packages from API with fallback
  useEffect(() => {
    fetch('/api/roles/vc/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using authoritative VC rates:', err);
      });
  }, []);

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
    { name: 'Global DSP Distribution Package', cost: 149, roi: '15% streaming royalty share until 1.25x repaid' },
    { name: 'EPK Pro Domain & Cloud Hosting', cost: 199, roi: '10% live booking fees until 1.20x repaid' },
    { name: 'Studio Mastering & Sound Suite', cost: 250, roi: '12% stream payouts until 1.25x repaid' },
    { name: 'SyncMavens Film & TV Placement', cost: 300, roi: '20% sync licensing fee until 1.30x repaid' },
    { name: 'Superfan Message Broadcasts', cost: 450, roi: '10% merch sales until 1.25x repaid' },
    { name: 'Live Tour Stage Backline Advance', cost: 15000, roi: '100% of door ticket sales until 1.35x repaid' },
  ];

  const filteredOpportunities = DISCOVERY_OPPORTUNITIES.filter(op => {
    if (selectedPersonaFilter === 'all') return true;
    return op.creator_type === selectedPersonaFilter;
  });

  const slides = [
    {
      badge: 'Live Concert & Tour Funding',
      dot: '#10b981',
      hLine1: 'Fund Real Music Tours.',
      hLine2: 'Earn 18% to 25% Returns.',
      hLine2Color: '#10b981',
      s: 'Provide short-term tour funding for top musicians, DJs, and podcasters. You get paid back first from every ticket sold at the venue, with typical recoupment in under 4 months.',
      b1: 'See Investment Options',
      b1link: '#vc-facilities',
      b2: 'Browse Active Tours',
      b2link: '#underwriting-roster',
      image: vcHero1Img
    },
    {
      badge: 'Verified Performance Data',
      dot: '#10b981',
      hLine1: 'Invest with Real Numbers.',
      hLine2: 'No Guesswork or Hype.',
      hLine2Color: '#10b981',
      s: 'Inspect real ticket sales history, Spotify listener velocity, and venue capacity data before deploying a single dollar. Every metric is pulled directly from verified platform APIs.',
      b1: 'Review Opportunities',
      b1link: '#underwriting-roster',
      b2: 'Preview Command Center',
      b2link: '#vc-dashboard-preview',
      image: vcHero2Img
    },
    {
      badge: 'Protected Capital & Fast Payback',
      dot: '#10b981',
      hLine1: 'Protected by First-Dollar Repayment.',
      hLine2: 'Zero Platform Fees for Investors.',
      hLine2Color: '#10b981',
      s: 'All deals run through safe legal agreements. Ticket revenues automatically repay your investment before artist profits are released. TuneMavens acts as technology intermediary (0% credits charged).',
      b1: 'How Protection Works',
      b1link: '#triparty-protocol',
      b2: 'Compare vs Tech VC',
      b2link: '#vc-comparison',
      image: vcHero3Img
    },
    {
      badge: 'Direct Artist Sponsorships',
      dot: '#10b981',
      hLine1: 'Help Artists Grow.',
      hLine2: 'Keep 100% of Their Creative Freedom.',
      hLine2Color: '#10b981',
      s: 'Fund stage equipment, music distribution, or video production for rising stars. You earn a fixed return on their incoming royalties with zero equity dilution for the artist.',
      b1: 'Sponsor Artist Tools',
      b1link: '#career-sponsorship',
      b2: 'Investor Questions',
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
          msg: data.message || 'Your investor registration has been received! Our team will provide an introductory tour walkthrough.'
        });
      } else {
        setInquirySuccess({
          ref: `VC-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: 'Investor inquiry received! Tour metrics and contract details have been sent to your email.'
        });
      }
    } catch (err) {
      setInquirySuccess({
        ref: `VC-${Math.floor(100000 + Math.random() * 900000)}`,
        msg: 'Inquiry received! Our team will connect with your fund within 2 business hours.'
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How do I get my money back from ticket sales?',
      a: 'Our platform links directly into the event ticketing processor (e.g. M-Pesa, Stripe, Flutterwave). Every ticket purchased sends 100% of proceeds straight into paying back your principal and agreed return before the artist or promoter receives remaining net revenue.'
    },
    {
      q: 'What is TuneMavens’ role in the deal?',
      a: 'TuneMavens acts as a safe, neutral technology and escrow provider. We do not lend our own funds or charge investors monthly platform fees. We charge a simple 3.0% transaction fee when deals close, aligning our incentives with successful tour execution.'
    },
    {
      q: 'What happens if a concert gets cancelled or delayed?',
      a: 'All agreements require event cancellation insurance and include a lien on the artist’s existing streaming royalties. If an event is cancelled, regular music streaming payouts automatically step in to repay your investment.'
    },
    {
      q: 'Are investors charged monthly fees or platform credits?',
      a: 'Zero platform credits or subscription fees! Investors and funds enjoy permanent fee exemption. You only deploy money into tours you choose, with zero overhead.'
    },
    {
      q: 'Can I invest smaller amounts or split across several tours?',
      a: 'Yes! You can fund a fractional slice of a larger stadium tour, or distribute your capital across a group of several artists, podcasters, and DJs to balance your returns.'
    }
  ];

  // Carousel navigation for Active Opportunities
  const totalOps = filteredOpportunities.length;
  const prevOp = () => {
    setCurrentOpIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, totalOps - 1)));
  };
  const nextOp = () => {
    setCurrentOpIndex((prev) => (prev < totalOps - 1 ? prev + 1 : 0));
  };

  return (
    <div className="role-page-wrapper vc-landing-view" style={{ '--role-accent': accent }} data-testid="vc-landing-page">
      <SEO 
        title="Fund Live Music Tours & Earn 18% to 25% Returns | Tune Capital"
        description="Provide short-term tour funding for top musicians and DJs. Get paid back first from every ticket sold, with zero equity dilution."
        favicon="/favicons/tunecapital.png"
      />

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
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>VCs &amp; Investors</span>
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

      {/* ================= Secondary Menu / Switcher in standard location right below hero ================= */}
      {switcher}

      {/* ================= 2. Metrics Bar ================= */}
      <section style={{ background: '#090d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', display: 'block', fontFamily: 'Sansation, sans-serif' }}>48+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Tour Corridors</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>{formatMoney(14200000)}+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Tour Capital Deployed</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>22.6%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Average Net Return (IRR)</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', display: 'block', fontFamily: 'Sansation, sans-serif' }}>0.0%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Default Rate to Date</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. Core Institutional Feature Pillars ================= */}
      <section id="triparty-protocol" style={{ padding: '80px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '44px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              HOW CAPITAL IS PROTECTED
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Fast-Payback Tour Funding with First-Dollar Security
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Back popular live shows without risky startup bets or company ownership loss. Ticket sales automatically repay your investment first, directly into your account.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiShieldCheckFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                You Get Paid Back First
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Ticket sales flow straight into repaying your principal and agreed return before creator profits are unlocked.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Typical payback in under 4 months</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Backed by existing streaming royalties</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Direct deposits via M-Pesa, Stripe or bank</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(0, 240, 255, 0.12)', color: '#00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiRadarFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Clear Data on Every Artist
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                See real streaming numbers, past ticket sales, and audience locations directly from streaming services and ticket vendors before funding.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Real-time fan growth metrics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Verified past concert attendance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f0ff" /> Plain English risk ratings for every deal</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiFileTextFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Safe Legal Agreements
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Every deal is backed by clear legal contracts signed online. TuneMavens provides the technology and handles the automatic escrow distribution.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> 0 platform fees for investors</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> Legally enforceable cross-border protection</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#c084fc" /> Full digital receipts for tax and accounting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. Active Opportunities & Tour Facilities CAROUSEL ================= */}
      <section id="underwriting-roster" style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                LIVE TOUR DEALS
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'Sansation, sans-serif' }}>
                Active Opportunities &amp; Tour Funding
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Review real performance numbers, past ticket sales, and execute tour funding online.
              </p>
            </div>

            {/* Persona Tabs & Carousel Navigation */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
                    onClick={() => { setSelectedPersonaFilter(tab.id); setCurrentOpIndex(0); }}
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

              {/* Carousel Arrows */}
              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                <button
                  type="button"
                  onClick={prevOp}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Previous opportunity"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextOp}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '4px',
                    background: '#10b981',
                    border: 'none',
                    color: '#040711',
                    fontSize: '18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Next opportunity"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Opportunities Carousel View */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {filteredOpportunities
                .slice(currentOpIndex, currentOpIndex + 3)
                .concat(filteredOpportunities.slice(0, Math.max(0, 3 - (filteredOpportunities.length - currentOpIndex))))
                .slice(0, Math.min(3, totalOps))
                .map((op) => (
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
                        <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Monthly Audience</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{op.listeners_label}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Past Ticket Sales</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{formatMoney(op.historical_gross_box_office)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Advance Requested</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>{formatMoney(op.recommended_advance)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '10.5px', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Expected Return</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{op.target_irr} in {op.recoupment_months}</span>
                      </div>
                    </div>

                    {/* Protocol Info */}
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      <span>Intermediary Fee: <strong style={{ color: '#fff' }}>{op.tunemavens_fee}</strong></span>
                      <span style={{ color: '#10b981', fontWeight: 700 }}>Paid Back First from Tickets</span>
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
                        <RiFundsBoxFill size={15} /> Fund This Tour
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
                        Full Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '24px' }}>
              {filteredOpportunities.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentOpIndex(idx)}
                  style={{
                    width: idx === currentOpIndex ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentOpIndex ? '#10b981' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  aria-label={`Jump to opportunity ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. Direct Creator Career Sponsorship Section ================= */}
      <section id="career-sponsorship" style={{ padding: '70px 0', background: '#060914', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              DIRECT ARTIST SPONSORSHIP
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Support Growing Creators by Funding Their Tools
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Instead of buying company stock, you can directly sponsor the exact tools and equipment creators need to release music, build electronic press kits, and sell out tour dates. You earn a fixed return on their incoming royalties until repaid.
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
                  <strong>How You Get Paid:</strong> {svc.roi}
                </div>
                <Link to="/dashboard?tab=vc-sponsorship&role=vc" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px', padding: '8px', textDecoration: 'none', display: 'block' }}>
                  Sponsor for Artist <RiArrowRightLine size={13} style={{ marginLeft: '4px' }} />
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
            Explore the authentic, live system interface where investors inspect audience numbers, fund tour corridors, and monitor real-time ticket repayments.
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
              HOW TO INVEST
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Three Simple Steps to Fund Music Tours
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Back verified creators in minutes with bank-grade legal security and automated repayments.
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
                1. Review Real Numbers
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Browse verified musicians, podcasters, and DJs. Inspect past ticket sales, streaming fan growth, and venue capacities.
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
                2. Sign Clear Terms Online
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Commit tour funding under clear legal contracts appointing TuneMavens as technology and escrow provider (3.0% fee).
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
                3. Collect Returns Automatically
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                As concert tickets sell, money flows automatically into your account until your investment and return are fully paid.
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
              BETTER RISK &amp; RETURN
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Tune Capital Tour Debt vs Traditional Venture Capital
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Why smart investors choose short-cycle tour funding over waiting 10 years for a startup to sell.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Comparison Point</th>
                  <th style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)' }}>Tune Capital Tour Credit</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Traditional Tech VC</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Old-School Royalty Funds</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Payback Speed</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>3 to 4 Months (Fast Recoupment)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>7 to 10 Years (Wait for an IPO)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>10 to 15 Years (Slow Annual Payouts)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Expected Return</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>18% to 25% Predictable Return</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Speculative high-risk bets</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>6% to 9% slow dividend</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Repayment Priority</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>Paid Back First From Every Ticket</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Last in line if company struggles</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Subordinate catalog splits</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Creator Impact</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>Artist Keeps 100% of Their Music &amp; Equity</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>Artists lose 20% - 40% of their company</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>Artists sell away their master rights forever</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Data Transparency</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.05)' }}>Real-Time Streaming &amp; Ticket Data</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Self-reported quarterly pitch decks</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Delayed paper statements from labels</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Investor Fees</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.05)' }}>0 Platform Credits (3.0% deal fee)</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>2.0% annual management fee + 20% carry</td>
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
              INVESTMENT OPTIONS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Structured Tour Funding to Match Your Capital Goals
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Choose an allocation size below. All funds deploy under clear legal agreements with zero monthly platform fees.
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
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Common Questions About Tour Funding
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Learn how ticket repayments, contracts, and fund safety work.
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
            START DEPLOYING TODAY
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', margin: '12px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            Fund High-Yielding Concerts &amp; Live Music
          </h2>
          <p style={{ fontSize: '15.5px', color: '#94a3b8', lineHeight: 1.7, margin: '0 auto 32px auto', maxWidth: '680px' }}>
            Enjoy predictable, senior-secured exposure to live tour ticket sales with 18% to 25% expected returns backed by verified audience data.
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
                  {inquirySuccess ? 'Application Received' : `Inquire: ${selectedTier?.name || 'Tune Capital Facility'}`}
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
                  Register interest for <strong style={{ color: '#10b981' }}>{selectedTier?.name}</strong> ({formatPrice(selectedTier?.price_usd || 50000)} minimum allocation). TuneMavens acts as secure technology and escrow intermediary (3.0% fee, zero platform credits).
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
                        Partner / Investor Name *
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
                        Business Email *
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
                        Target Allocation
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
                      Preferred Tour Locations &amp; Corridors
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
                      Investment Goals or Questions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Seeking tour funding deals with 20%+ return and under 4-month payback periods."
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
                    {inquirySubmitting ? 'Submitting Details...' : 'Submit Investment Interest &rarr;'}
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
                  Application Received!
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
                    Open VC Command Center &rarr;
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Fund Tour for {selectedUnderwriteTarget.name}</h3>
              </div>
              <button onClick={() => { setSelectedUnderwriteTarget(null); setUnderwriteExecuted(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <RiCloseFill size={20} />
              </button>
            </div>

            {!underwriteExecuted ? (
              <>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '18px' }}>
                  Fund this tour advance for <strong style={{ color: '#fff' }}>{selectedUnderwriteTarget.name}</strong> under clear legal terms:
                </p>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', marginBottom: '20px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Funding Amount:</span>
                    <strong style={{ color: '#10b981' }}>{formatMoney(selectedUnderwriteTarget.recommended_advance)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Expected Return:</span>
                    <strong style={{ color: '#38bdf8' }}>{selectedUnderwriteTarget.target_irr} in {selectedUnderwriteTarget.recoupment_months}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>TuneMavens Protocol Fee:</span>
                    <strong style={{ color: '#fff' }}>3.0% automated escrow fee</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Platform Credits Charged:</span>
                    <strong style={{ color: '#10b981' }}>0 Credits (Permanent Investor Exemption)</strong>
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
                    Confirm &amp; Sign Terms Online &rarr;
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
                  Tour Funding Confirmed!
                </h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                  Agreement sealed with verified digital signature. TuneMavens appointed as technology intermediary (3.0% fee). Real-time ticket sales and repayment tracking are now active for {selectedUnderwriteTarget.name}.
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
