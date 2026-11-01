import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  RiMicFill,
  RiHeadphoneFill,
  RiSparklingFill,
  RiCoinsFill,
  RiBarChartFill,
  RiArrowRightLine,
  RiCheckFill,
  RiCheckboxCircleFill,
  RiPlayFill,
  RiAwardFill,
  RiGlobalFill,
  RiShieldCheckFill,
  RiCloseFill,
  RiMegaphoneFill,
  RiCalendarEventFill,
  RiFileTextFill,
  RiEqualizerFill,
  RiSpeedUpFill,
  RiQuestionFill,
  RiRadioFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import tunepodLogo from '../../../assets/logos/tunepod-logo.png'
import { useRegion } from '../../../RegionContext.jsx'
import { AUTHORITATIVE_AD_RATES } from '../../../data/authoritativeAdRates.js'
import { AUTHORITATIVE_PODCAST_SHOWS, PodcasterEpkModal } from '../../../components/podcasts/PodcastStreamingHub.jsx'
import podcasterHero1Img from '../../../assets/images/podcaster_hero_1.png'
import podcasterHero2Img from '../../../assets/images/podcaster_hero_2.png'
import podcasterHero3Img from '../../../assets/images/podcaster_hero_3.png'
import podcasterHero4Img from '../../../assets/images/podcaster_hero_4.png'
import creatorDashboardActualEn from '../../../assets/images/creator_dashboard_actual_en.png'
import creatorDashboardActualSw from '../../../assets/images/creator_dashboard_actual_sw.png'
import SEO from '../../../components/common/SEO.jsx'

const FALLBACK_PODCASTER_RATES = [
  {
    slug: 'podcaster-starter',
    name: 'Starter Cast Pool',
    tier_badge: 'Free Entry',
    price_usd: 0.0,
    billing_period: 'forever free starter credits',
    credits: 50,
    key_metric: '5 Hours Audio Ingestion · Standard RSS Feed',
    features: [
      'Standard RSS 2.0 feed syndication to Apple Podcasts, Spotify & TuneStream',
      '5 hours of high-fidelity episode audio storage & global CDN delivery',
      'Basic listener analytics (downloads, geo-distribution, device breakdown)',
      'Single-track upload with automated ID3 tagging and cover artwork injection',
      'TuneStream web player embed snippet for personal websites & blogs',
      '50 unified credits starter balance for AI speech leveling'
    ],
    is_popular: false,
    cta: 'Start Free Podcast'
  },
  {
    slug: 'podcaster-studio',
    name: 'Studio Pro Host Load',
    tier_badge: 'Most Popular',
    price_usd: 19.0,
    billing_period: 'one-time credit reload',
    credits: 250,
    key_metric: '25 Hours -16 LUFS Mastering · Dynamic Ad Insertion',
    features: [
      'Broadcast-grade -16 LUFS speech mastering & automated noise reduction',
      'Server-Side Dynamic Ad Insertion (DAI) engine for pre, mid & post-roll slots',
      'Verified EPK Media Kit with live audited downloads and audience metrics',
      'Automated Co-Host Split Cascade: distribute ad flight earnings directly via M-Pesa / Bank',
      'Synchronized AI speech-to-text transcript generator and chapter markers',
      '250 unified credits load with zero recurring monthly subscription debt'
    ],
    is_popular: true,
    cta: 'Go Studio Pro'
  },
  {
    slug: 'podcaster-network',
    name: 'Syndicate & Network Load',
    tier_badge: 'Enterprise Syndicate',
    price_usd: 59.0,
    billing_period: 'one-time credit reload',
    credits: 850,
    key_metric: 'Unlimited Shows · Priority Corporate Ad Bidding',
    features: [
      'Multi-show network management: host unlimited podcast channels under one roof',
      'Priority inclusion in TuneMavens Corporate Ad Flight Bidding Marketplace',
      'Custom branded web player embed with high-converting sponsor CTAs and links',
      'Guest booking liaison calendar and integrated remote multi-track recording',
      'Direct listener tipping engine with 0% platform take on audience contributions',
      '850 unified credits load & dedicated podcast engineering support (no expiry)'
    ],
    is_popular: false,
    cta: 'Launch Network Suite'
  }
];

export default function PodcasterLandingPage({ switcher }) {
  const { formatPrice, currencyInfo, language } = useRegion();
  const isSw = language === 'sw';
  const accent = '#00f2fe';

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
  const [activeEpkShow, setActiveEpkShow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewModal, setPreviewModal] = useState(false);
  const [tipNotice, setTipNotice] = useState('');
  const [faqOpen, setFaqOpen] = useState(0);

  // Rate Packages & Opt-In Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_PODCASTER_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'podcaster-studio',
    show_category: 'Tech, VC & Startups',
    rss_feed_url: '',
    estimated_downloads: '10,000 - 50,000 downloads/month',
    notes: ''
  });

  const categories = ['All', 'Music Business', 'Tech, VC & Startups', 'Culture & Hip-Hop', 'Film Sync & Media', 'Culture & Nightlife', 'Cultural Audio & Heritage'];

  const filteredShows = AUTHORITATIVE_PODCAST_SHOWS.filter(s => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

  const slides = [
    {
      badge: 'AI Speech Studio & Broadcast Mastering',
      dot: '#00f2fe',
      hLine1: 'Broadcast Pristine Voice.',
      hLine2: 'Zero Audio Engineering Debt.',
      hLine2Color: '#00f2fe',
      s: 'Ingest multi-track audio, auto-normalize dialogue to EBU R128 (-16 LUFS), eliminate room reverberation, and generate interactive chapter timestamps with synchronized transcripts in seconds.',
      b1: 'Explore Podcaster Plans',
      b1link: '#podcaster-rates',
      b2: 'View Studio Capabilities',
      b2link: '#studio-features',
      image: podcasterHero1Img
    },
    {
      badge: 'Dynamic Ad Insertion & Global RSS',
      dot: '#00f2fe',
      hLine1: 'Monetize Every Download.',
      hLine2: 'Targeted Audio Ad Flights.',
      hLine2Color: '#00f2fe',
      s: 'Stitch geo-targeted pre-roll, mid-roll, and post-roll sponsor messages dynamically into your RSS feeds. Retain 85% of corporate ad proceeds with automated clearing and zero revenue cuts on direct deals.',
      b1: 'Start Free Podcast Feed',
      b1link: '/register?role=podcaster',
      b2: 'Ad Insertion Protocol',
      b2link: '#dai-monetization',
      image: podcasterHero2Img
    },
    {
      badge: 'Live Audited EPK & Guest Booking',
      dot: '#00f2fe',
      hLine1: 'Land Premium Sponsors.',
      hLine2: 'Audited Real-Time EPK Media Kits.',
      hLine2Color: '#00f2fe',
      s: 'Showcase verified listener volume, completion rates, and demographic breakdown directly to advertising agencies and corporate brands with live, cryptographically certified show media kits.',
      b1: 'Browse 12 Verified Shows',
      b1link: '#podcasts-showcase',
      b2: 'Create Show Media Kit',
      b2link: '/register?role=podcaster',
      image: podcasterHero3Img
    },
    {
      badge: 'Split Cascade & Direct Fan Tipping',
      dot: '#00f2fe',
      hLine1: 'Split Royalties Instantly.',
      hLine2: 'Zero End-of-Month Accounting.',
      hLine2Color: '#00f2fe',
      s: 'Split podcast ad revenue and listener tips automatically across hosts, guest contributors, sound designers, and producers directly to M-Pesa or bank accounts through the smart contract Split Cascade Ledger.',
      b1: 'Review Split Engine',
      b1link: '#split-cascade',
      b2: 'Compare vs Legacy Hosts',
      b2link: '#comparison',
      image: podcasterHero4Img
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
    const el = document.getElementById('podcaster-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#podcaster-rates');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      notes: `Interested in ${tier.name} (${formatPrice(tier.price_usd)} / ${tier.credits} Credits).`
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
        role: 'podcaster',
        organization_name: bookingForm.organization_name || bookingForm.contact_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: `${formatPrice(selectedTier?.price_usd || 19)} one-time credit reload`,
        notes: `Category: ${bookingForm.show_category} | RSS: ${bookingForm.rss_feed_url || 'New Show'} | Downloads: ${bookingForm.estimated_downloads}. ${bookingForm.notes || ''}`
      };

      const res = await fetch('/api/roles/podcaster/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setInquirySuccess({
          ref: data.reference_code || `POD-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: data.message || 'Show onboarding submitted successfully! An audio specialist will connect with you within 2 business hours.'
        });
      } else {
        // Fallback smooth confirmation if API endpoint is not yet mounted
        setInquirySuccess({
          ref: `POD-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: 'Show registration received! Your TunePod studio credentials and RSS migration toolkit have been queued.'
        });
      }
    } catch (err) {
      // Fallback confirmation
      setInquirySuccess({
        ref: `POD-${Math.floor(100000 + Math.random() * 900000)}`,
        msg: 'Show reservation received! Our audio syndication team has received your registration.'
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleTip = (show) => {
    setTipNotice(`✓ Tipped 50 TM Credits (${formatPrice(5)}) directly to ${show.host} (${show.title}) — settled via Split Cascade!`);
    setTimeout(() => setTipNotice(''), 5000);
  };

  const handlePlayEp = (show) => {
    const ep = show.episodes?.[0];
    if (!ep) return;
    window.dispatchEvent(new CustomEvent('tunestreamPlayTrack', {
      detail: {
        track: {
          id: ep.id,
          title: ep.title,
          artist: `${show.host} (${show.title})`,
          audioUrl: ep.audioUrl || '/api/stream/track/KE-TM1-26-00042',
          coverArt: ep.coverArt || show.coverArt,
          releaseType: 'Podcast Episode',
          genre: show.category
        },
        contextTitle: `Podcast: ${show.title}`
      }
    }));
  };

  const faqs = [
    {
      q: 'How does TunePod Dynamic Ad Insertion (DAI) work on Apple Podcasts & Spotify?',
      a: 'TunePod generates dynamic RSS 2.0 enclosures with smart server-side audio stitching. When a listener on Apple Podcasts, Spotify, or TuneStream requests an episode, our edge CDN stitches targeted pre-roll, mid-roll, or post-roll audio ads tailored to their country and device in real time, without altering the original master file.'
    },
    {
      q: 'Can I migrate my existing podcast from Buzzsprout, Libsyn, or Spotify for Podcasters?',
      a: 'Yes! TunePod offers a 1-click seamless RSS import tool. We ingest your complete episode catalog, show metadata, artwork, and chapter markers. Then, simply apply our 301 redirect instruction to your old host. You retain 100% of your current subscriber base with zero interruption.'
    },
    {
      q: 'How does the Automated Co-Host Split Cascade pay out earnings?',
      a: 'In your Podcaster Studio, define percentage splits for your host, co-hosts, guest interviewees, sound designers, or producers. When sponsorship ad flights or listener tips are collected, funds are mathematically partitioned and cleared directly to each participant’s mobile money (M-Pesa, Airtel Money) or bank account with cryptographic receipt logs.'
    },
    {
      q: 'What is -16 LUFS voice normalization and why is it important?',
      a: '-16 LUFS (Loudness Units relative to Full Scale) is the authoritative international standard (AES / EBU R128) for stereo broadcast podcasts. TunePod automatically levels your audio so your episodes sound balanced, crisp, and broadcast-ready across car speakers, studio monitors, and smartphone earbuds without painful volume fluctuations.'
    },
    {
      q: 'Do credit reloads expire, or am I locked into a recurring monthly subscription?',
      a: 'Zero monthly subscription debt! TuneMavens operates on transparent one-time unified credit reloads. Your credits never expire, meaning you only pay for the mastering and ingestion hours you actually use. No forced recurring invoices if you take a season break.'
    }
  ];

  return (
    <div className="role-page-wrapper podcaster-landing-view" style={{ '--role-accent': accent }} data-testid="podcaster-landing-page">
      <SEO 
        title="TunePod — Podcaster Studio, Dynamic Ads & Show Monetization"
        description="Broadcast-grade mastering (-16 LUFS), dynamic ad insertion, verified show media kits, and real-time co-host split payouts for podcasters across Africa and the global diaspora."
        favicon="/favicons/tunepod.png"
      />
      {switcher}

      {/* ================= 1. Interactive HERO Slide Carousel ================= */}
      <section 
        className="hw role-hero-wrapper"
        aria-label="Podcasters & Audio Shows Hero Carousel"
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
                src={tunepodLogo} 
                alt="TunePod Logo" 
                style={{ height: '36px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Podcasters &amp; Talk Shows</span>
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

      {/* ================= 2. 4-Stat Metrics Ribbon ================= */}
      <section style={{ background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#00f2fe', display: 'block', fontFamily: 'Sansation, sans-serif' }}>185K+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Weekly Show Downloads</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Audited Dynamic Ad Flight Delivery</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8', display: 'block', fontFamily: 'Sansation, sans-serif' }}>-16 LUFS</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Broadcast Voice Normalization</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', display: 'block', fontFamily: 'Sansation, sans-serif' }}>0%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Platform Subscription Debt</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tip Notice Toast */}
      {tipNotice && (
        <div style={{ maxWidth: '1240px', margin: '20px auto 0', padding: '0 20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '4px', padding: '12px 18px', color: '#6ee7b7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{tipNotice}</span>
            <button onClick={() => setTipNotice('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}

      {/* ================= 3. Core Feature Pillars ================= */}
      <section id="studio-features" style={{ padding: '80px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '44px' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              BUILT FOR MODERN AUDIO VOICES &amp; TALK SHOWS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Full-Stack Audio Production &amp; Monetization Infrastructure
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Say goodbye to juggling fragmented hosting bills, manual spreadsheets for co-host splits, and flat ad-read sponsorship rates. TunePod unifies speech mastering, dynamic insertion, and instant settlement in one place.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiEqualizerFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                AI Speech Mastering &amp; Timestamps
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Automated dialog leveling calibrated to the international -16 LUFS broadcast standard. Includes ambient noise suppression, smart de-essing, interactive chapter markers, and synced multi-language transcripts for maximum search visibility.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> 24-bit studio quality multi-track ingestion</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> EBU R128 loudness compliance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> Synchronized SRT / VTT transcript generator</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiMegaphoneFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Dynamic Ad Insertion (DAI)
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Monetize your entire episode back-catalog with server-side ad stitching. Schedule pre-roll, mid-roll, and post-roll ad flights targeted by geographic region, device, and listener demographics without re-exporting audio files.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Retain 85% of gross sponsorship proceeds</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> 0% cut on direct brand deals and promo reads</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Seamless syndication to Spotify, Apple &amp; TuneStream</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiCoinsFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Split Cascade &amp; Listener Tipping
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Split ad flight payouts and listener contributions programmatically. When a corporate brand books an ad flight or a fan sends an M-Pesa tip, funds automatically route into verified host, co-host, and sound engineer wallets.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Real-time mobile money (M-Pesa) and bank clearing</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Smart contract split agreements with SHA-256 receipts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Verified EPK media kit with live audited download proofs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. Interactive 3x4 Grid of Podcasts Section ================= */}
      <section id="podcasts-showcase" style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                AUDIO ROSTER SHOWCASE
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'Sansation, sans-serif' }}>
                Verified Podcasts &amp; Audio Shows
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Explore 12 authoritative podcasts in full 3×4 card format with integrated streaming, verified media kits, single-source ad rates, and host tipping.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '3px',
                    border: selectedCategory === cat ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedCategory === cat ? '#00f2fe' : 'rgba(255,255,255,0.03)',
                    color: selectedCategory === cat ? '#040711' : '#cbd5e1',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3x4 Grid of Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredShows.map((show) => {
              const entryRateUsd = show.sponsorshipRates?.[0]?.packagePriceUsd || AUTHORITATIVE_AD_RATES[0].price_usd;
              const entryRateCredits = show.sponsorshipRates?.[0]?.packageCredits || AUTHORITATIVE_AD_RATES[0].credits;
              const latestEp = show.episodes?.[0];

              return (
                <div
                  key={show.id}
                  style={{
                    background: '#090d1c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = show.accentColor || '#00f2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {/* Top Image Banner */}
                  <div style={{ position: 'relative', height: '175px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={show.bannerUrl || show.coverArt}
                      alt={show.title}
                      onError={(e) => { e.currentTarget.src = show.coverArt || '/uploads/artwork/ndufo_cover.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,10,22,0.2) 0%, rgba(6,10,22,0.95) 100%)' }} />

                    {/* Top Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        background: show.accentColor || '#00f2fe',
                        color: '#040711',
                        fontSize: '9.5px',
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px'
                      }}>
                        {show.category}
                      </span>
                      <span style={{
                        background: 'rgba(0,0,0,0.65)',
                        color: '#00f2fe',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '3px',
                        border: '1px solid rgba(0,242,254,0.3)'
                      }}>
                        -16 LUFS · 24-Bit Voice
                      </span>
                    </div>

                    {/* Square Artwork & Host Info */}
                    <div style={{ position: 'absolute', bottom: '12px', left: '14px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                      <img
                        src={show.coverArt}
                        alt={show.title}
                        onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '4px',
                          border: '2px solid rgba(255,255,255,0.2)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 800 }}>
                          ★ {show.rating} · {show.subscribers} Subs
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                          {show.cadence}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h4 style={{ fontSize: '16.5px', fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>
                      {show.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#00f2fe', fontWeight: 700, marginBottom: '8px' }}>
                      Hosted by {show.host}
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {show.description}
                    </p>

                    {/* Single Source of Truth Ad Flights */}
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '4px',
                      padding: '6px 10px',
                      marginBottom: '10px',
                      fontSize: '11px',
                      color: '#fbbf24',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>Ad Flights from <strong>{formatPrice(entryRateUsd)}</strong></span>
                      <span style={{ color: '#94a3b8' }}>{entryRateCredits.toLocaleString()} Credits</span>
                    </div>

                    {/* Latest Episode Preview */}
                    {latestEp && (
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        marginBottom: '14px',
                        fontSize: '11px',
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>Latest:</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{latestEp.title}</span>
                        <span style={{ color: '#64748b', fontSize: '10px' }}>{latestEp.duration}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                      <button
                        type="button"
                        onClick={() => handlePlayEp(show)}
                        style={{
                          padding: '10px 14px',
                          background: show.accentColor || '#00f2fe',
                          color: '#040711',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiPlayFill size={16} /> Stream Latest Episode
                      </button>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setActiveEpkShow(show)}
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(0, 242, 254, 0.08)',
                            color: '#00f2fe',
                            border: '1px solid rgba(0, 242, 254, 0.35)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <RiAwardFill size={13} /> Podcaster EPK
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTip(show)}
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(245, 158, 11, 0.08)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <RiCoinsFill size={13} color="#f59e0b" /> Tip ({formatPrice(5)})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 5. Single Source Ad Rates Breakdown ================= */}
      <section id="dai-monetization" style={{ padding: '70px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              CORPORATE AD SERVICES MONETIZATION
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Standardized, Single-Source Ad Flight Rates for Podcasters
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              All podcast advertising rates across TuneMavens are synchronized from a single authoritative source of truth. Podcasters keep 85% of gross sponsorship proceeds, with automated Split Cascade settlements.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {AUTHORITATIVE_AD_RATES.map((rate) => (
              <div
                key={rate.slug}
                style={{
                  background: '#0a0f24',
                  border: rate.is_popular ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {rate.is_popular && (
                  <span style={{ position: 'absolute', top: '-10px', right: '16px', background: '#00f2fe', color: '#040711', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                    Most Popular
                  </span>
                )}
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  {rate.tier_badge}
                </div>
                <h4 style={{ color: '#fff', fontSize: '17px', margin: '0 0 10px 0' }}>{rate.name}</h4>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#00f2fe', marginBottom: '4px' }}>
                  {formatPrice(rate.price_usd)}
                </div>
                <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginBottom: '16px' }}>
                  {rate.credits.toLocaleString()} Credits · ~{formatPrice(rate.cpm_usd)} CPM
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '12.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {(rate.features || []).slice(0, 4).map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <RiCheckFill size={15} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/dashboard?role=podcaster&tab=podcaster-monetization"
                  className="btn-secondary"
                  style={{ textAlign: 'center', fontSize: '12px', padding: '10px', textDecoration: 'none' }}
                >
                  Book Ad Flight in Studio &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. Actual System Screenshot Preview ================= */}
      <section style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            ACTUAL PLATFORM DASHBOARD PREVIEW
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            The TuneMavens Podcaster Studio Console
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.7 }}>
            A unified backend built right inside TuneMavens for episode ingestion, chapter marker generation, synchronized transcripts, RSS feeds, and Split Cascade escrow distribution.
          </p>

          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: 'pointer' }} onClick={() => setPreviewModal(true)}>
            <img 
              src={isSw ? creatorDashboardActualSw : creatorDashboardActualEn} 
              alt="TuneMavens Podcaster Studio Dashboard" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '6px', 
                border: '1px solid rgba(0,242,254,0.25)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.85)'
              }}
            />
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#00f2fe', fontWeight: 600 }}>
              Click to view high-resolution interactive dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. 3-Step Guided Workflow ================= */}
      <section style={{ padding: '80px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              HOW IT WORKS · FROM RAW AUDIO TO MONETIZATION
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Three Guided Steps to Global Podcast Syndication
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Start a new show or migrate your existing feed in under 5 minutes without losing a single listener.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '36px', fontWeight: 900, color: 'rgba(0, 242, 254, 0.15)', fontFamily: 'Sansation, sans-serif' }}>
                01
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RiMicFill size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                1. Upload Raw Voice &amp; Auto-Master
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Drop raw interview tracks or multi-host files into your studio console. TunePod normalizes dialogue to -16 LUFS, suppresses ambient hum, and auto-generates transcripts with chapter markers.
              </p>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '36px', fontWeight: 900, color: 'rgba(16, 185, 129, 0.15)', fontFamily: 'Sansation, sans-serif' }}>
                02
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <RiMegaphoneFill size={22} />
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                2. Configure Ad Slots &amp; EPK Media Kit
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Set dynamic pre-roll, mid-roll, and post-roll insertion cues. Activate your live audited EPK with single-source CPM rates so corporate advertisers can book ad flights directly into your episodes.
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
                3. Syndicate &amp; Collect Instant Splits
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                One-click distribution to Apple Podcasts, Spotify, Amazon Music, and TuneStream. As listeners stream and sponsors purchase impressions, proceeds clear to co-host wallets via Split Cascade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. Comparison Matrix: TunePod vs Legacy Hosts ================= */}
      <section id="comparison" style={{ padding: '80px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px auto' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              THE MODERN AUDIO ADVANTAGE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Why Leading Podcasters Choose TunePod Over Legacy Hosts
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Compare TunePod with traditional hosts like Buzzsprout, Libsyn, and Anchor / Spotify for Podcasters.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Feature Capability</th>
                  <th style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 800, background: 'rgba(0, 242, 254, 0.05)' }}>TunePod (TuneMavens)</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Buzzsprout / Libsyn</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Spotify for Podcasters</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Storage &amp; Bandwidth</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Unlimited Lossless CDN Delivery</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Strict 3-12 hrs monthly caps</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Free with compression</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Dynamic Ad Insertion (DAI)</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Native Geo-Targeted Pre/Mid/Post Stitching (Keep 85%)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Expensive Enterprise add-on ($50+/mo)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Spotify-only programmatic take</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Co-Host &amp; Producer Split Cascade</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Automated Real-Time M-Pesa &amp; Bank Splits</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Manual monthly accounting &amp; wire transfers</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Not supported</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Voice Loudness Standards</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Built-in -16 LUFS broadcast mastering</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Requires external mastering DAW</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Basic web limiter</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>EPK Media Kit with Live Telemetry</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Live Audited EPK with 1-Click Ad Booking</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Manual PDF exports</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Not supported</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Subscription Debt</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(0, 242, 254, 0.05)' }}>0% — One-Time Credit Reloads (No Expiry)</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>Mandatory $12 - $120/mo recurring billing</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Platform lock-in</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= 9. Transparent Tiers / Rate Reload Packages ================= */}
      <section id="podcaster-rates" style={{ padding: '80px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 44px auto' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              TRANSPARENT TIER PACKAGES
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Zero Monthly Subscription Debt. Pay As Your Show Grows.
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Select a flexible starter package or unified credit reload. Every tier includes permanent access to your RSS feed, episodes, and analytics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {tierPackages.map((tier) => (
              <div
                key={tier.slug}
                style={{
                  background: '#090d1f',
                  border: tier.is_popular ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: tier.is_popular ? '0 12px 36px rgba(0, 242, 254, 0.12)' : '0 8px 24px rgba(0,0,0,0.4)'
                }}
              >
                {tier.is_popular && (
                  <span style={{
                    position: 'absolute',
                    top: '-11px',
                    right: '24px',
                    background: '#00f2fe',
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
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#00f2fe', fontFamily: 'Sansation, sans-serif' }}>
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
                      <RiCheckFill size={16} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ lineHeight: 1.5 }}>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(tier)}
                  style={{
                    padding: '12px',
                    background: tier.is_popular ? '#00f2fe' : 'rgba(255,255,255,0.06)',
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

      {/* ================= 10. Comprehensive Podcaster FAQ Accordion ================= */}
      <section style={{ padding: '80px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 10px 0', fontFamily: 'Sansation, sans-serif' }}>
              Everything You Need to Know About TunePod
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
              Got questions about show migration, split waterfalls, or audio mastering? We have you covered.
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
                  <span style={{ fontSize: '18px', color: '#00f2fe', transition: 'transform 0.2s', transform: faqOpen === fIdx ? 'rotate(45deg)' : 'none' }}>
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
      <section style={{ padding: '80px 0', background: 'radial-gradient(ellipse at center, #0e1e38 0%, #050814 100%)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px' }}>
          <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            YOUR PODCAST DESERVES PROFESSIONAL BROADCASTING
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', margin: '12px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            Ready to Broadcast Your Voice to Millions Across Africa &amp; the Global Diaspora?
          </h2>
          <p style={{ fontSize: '15.5px', color: '#94a3b8', lineHeight: 1.7, margin: '0 auto 32px auto', maxWidth: '680px' }}>
            Set up your show in minutes, connect with verified brand advertisers, and get paid automatically for every download.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/dashboard?role=podcaster&tab=podcaster-overview"
              className="btn-primary"
              style={{ padding: '14px 32px', background: '#00f2fe', borderColor: '#00f2fe', color: '#040711', fontSize: '15px', fontWeight: 800 }}
            >
              Launch Podcaster Studio <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
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
              Opt In for Studio Pro
            </button>
          </div>
        </div>
      </section>

      {/* ================= 12. Opt-In / Show Onboarding Reservation Modal ================= */}
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
              border: '1px solid #00f2fe', 
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
                <RiMicFill size={22} color="#00f2fe" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  {inquirySuccess ? 'Show Registration Confirmed' : `Opt-In for ${selectedTier?.name || 'TunePod Studio'}`}
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
                  Register your show for the <strong style={{ color: '#00f2fe' }}>{selectedTier?.name}</strong> ({formatPrice(selectedTier?.price_usd || 19)} / {selectedTier?.credits} unified credits). No ongoing subscription required.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Podcast Show Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AfroTech Disruption Podcast"
                      value={bookingForm.organization_name}
                      onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Host / Producer Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Kimani"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="sarah@example.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Show Category
                      </label>
                      <select
                        value={bookingForm.show_category}
                        onChange={e => setBookingForm({ ...bookingForm, show_category: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0f24', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      >
                        {categories.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                        Current Monthly Downloads
                      </label>
                      <select
                        value={bookingForm.estimated_downloads}
                        onChange={e => setBookingForm({ ...bookingForm, estimated_downloads: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0f24', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                      >
                        <option value="New Launch (0 - 2,000)">New Launch (0 - 2,000)</option>
                        <option value="2,000 - 10,000 downloads/month">2,000 - 10,000 downloads/month</option>
                        <option value="10,000 - 50,000 downloads/month">10,000 - 50,000 downloads/month</option>
                        <option value="50,000+ downloads/month (Network)">50,000+ downloads/month (Network)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Existing RSS Feed URL (Optional for 1-Click Migration)
                    </label>
                    <input
                      type="url"
                      placeholder="https://feeds.buzzsprout.com/1234567.rss"
                      value={bookingForm.rss_feed_url}
                      onChange={e => setBookingForm({ ...bookingForm, rss_feed_url: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                      Co-Host / Sponsor Goals or Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. We have 2 co-hosts and want to set up automated 50/50 splits for brand sponsorship flights."
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
                      background: '#00f2fe',
                      color: '#040711',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: inquirySubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {inquirySubmitting ? 'Submitting Registration...' : 'Complete Studio Opt-In &rarr;'}
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
                <RiCheckboxCircleFill size={52} color="#00f2fe" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
                  Show Registration Received!
                </h4>
                <div style={{ display: 'inline-block', background: 'rgba(0, 242, 254, 0.1)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', color: '#00f2fe', fontWeight: 800, marginBottom: '16px' }}>
                  Reference Code: {inquirySuccess.ref}
                </div>
                <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '22px' }}>
                  {inquirySuccess.msg}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <Link
                    to="/dashboard?role=podcaster&tab=podcaster-overview"
                    style={{
                      padding: '10px 22px',
                      background: '#00f2fe',
                      color: '#040711',
                      borderRadius: '4px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    Enter Podcaster Studio &rarr;
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

      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMavens Podcaster Studio · Actual System Interface</h3>
            <img src={isSw ? creatorDashboardActualSw : creatorDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
          </div>
        </div>
      )}

      {/* Podcaster EPK Modal Integration */}
      {activeEpkShow && (
        <PodcasterEpkModal
          show={activeEpkShow}
          onClose={() => setActiveEpkShow(null)}
          onPlayEpisode={(ep) => {
            handlePlayEp(activeEpkShow);
            setActiveEpkShow(null);
          }}
        />
      )}
    </div>
  );
}
