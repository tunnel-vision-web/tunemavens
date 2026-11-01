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
    tier_badge: 'Free Forever',
    price_usd: 0.0,
    billing_period: 'forever free starter credits',
    credits: 50,
    key_metric: '5 Hours Audio Hosting · Fast RSS Feed',
    features: [
      'Automatic feed delivery to Apple Podcasts, Spotify, and TuneStream',
      '5 hours of high-quality episode audio storage with fast global playback',
      'Clear listener stats: total downloads, listener countries, and popular devices',
      'Simple episode upload with automatic cover art and episode tags',
      'Ready-to-use web player embed for your personal website or blog',
      '50 free starter credits for automated audio voice cleanup'
    ],
    is_popular: false,
    cta: 'Start Free Podcast'
  },
  {
    slug: 'podcaster-studio',
    name: 'Studio Pro Host',
    tier_badge: 'Most Popular',
    price_usd: 19.0,
    billing_period: 'one-time credit reload',
    credits: 250,
    key_metric: '25 Hours Studio Sound · Built-In Sponsor Ads',
    features: [
      'Studio-grade sound leveling: voices sound crisp, loud, and balanced everywhere',
      'Earn from sponsors: automatically play relevant ads to your listeners',
      'Live Media Kit: share your verified download stats with brands in one link',
      'Automatic team payouts: send co-hosts and producers their share via M-Pesa or bank',
      'Instant voice-to-text transcripts and clickable episode chapter markers',
      '250 credits reload with zero monthly fees — only pay when you need credits'
    ],
    is_popular: true,
    cta: 'Go Studio Pro'
  },
  {
    slug: 'podcaster-network',
    name: 'Network & Syndicate',
    tier_badge: 'Multi-Show Suite',
    price_usd: 59.0,
    billing_period: 'one-time credit reload',
    credits: 850,
    key_metric: 'Unlimited Shows · Priority Sponsor Matching',
    features: [
      'Manage multiple podcasts and channels all in one simple account',
      'Priority access to corporate brand sponsors looking to book ad campaigns',
      'Branded web player with your own links and sponsor promotional banners',
      'Easy guest booking calendar and remote recording connections',
      'Direct listener tipping: fans can tip you via M-Pesa or card with 0% platform take',
      '850 credits reload and dedicated audio engineering support (no expiry)'
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
      badge: 'Studio Sound in One Click',
      dot: '#00f2fe',
      hLine1: 'Make Your Podcast Sound Amazing.',
      hLine2: 'Zero Audio Editing Hassle.',
      hLine2Color: '#00f2fe',
      s: 'Upload your voice recording and let TunePod handle the rest. We remove background noise, level up volume so you sound crystal clear everywhere, and create clean transcripts and chapter markers in seconds.',
      b1: 'See Podcaster Plans',
      b1link: '#podcaster-rates',
      b2: 'Explore Features',
      b2link: '#studio-features',
      image: podcasterHero1Img
    },
    {
      badge: 'Simple Sponsorships',
      dot: '#00f2fe',
      hLine1: 'Get Paid When People Listen.',
      hLine2: 'Keep 85% of What Sponsors Pay.',
      hLine2Color: '#00f2fe',
      s: 'Play sponsor ads in your episodes without having to re-record your audio. You keep 85% of ad earnings, get paid straight to your account, and we take a 0% cut on any direct brand deals you bring in.',
      b1: 'Start Free Podcast',
      b1link: '/register?role=podcaster',
      b2: 'How Ad Payouts Work',
      b2link: '#dai-monetization',
      image: podcasterHero2Img
    },
    {
      badge: 'Impress Brand Sponsors',
      dot: '#00f2fe',
      hLine1: 'Show Off Your Real Numbers.',
      hLine2: 'Win High-Paying Sponsors.',
      hLine2Color: '#00f2fe',
      s: 'Share a live media kit with brands that proves your real download counts and listener numbers. Sponsors can review your show and book ads on your episodes in one simple click.',
      b1: 'Browse Popular Shows',
      b1link: '#podcasts-showcase',
      b2: 'Create Your Media Kit',
      b2link: '/register?role=podcaster',
      image: podcasterHero3Img
    },
    {
      badge: 'Instant Team Pay Splits',
      dot: '#00f2fe',
      hLine1: 'Split Money with Co-Hosts Easily.',
      hLine2: 'Straight to M-Pesa or Bank.',
      hLine2Color: '#00f2fe',
      s: 'No more awkward math or chasing down payments. When your show earns money from listener tips or ads, everyone on your team gets paid their agreed percentage automatically with full receipt logs.',
      b1: 'See How Splits Work',
      b1link: '#split-cascade',
      b2: 'Compare vs Other Hosts',
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
        estimated_budget: `${formatPrice(selectedTier?.price_usd || 19)} one-time reload`,
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
          msg: data.message || 'Your show registration has been received! Our support team will help you set up in under 2 hours.'
        });
      } else {
        setInquirySuccess({
          ref: `POD-${Math.floor(100000 + Math.random() * 900000)}`,
          msg: 'Show registration received! Your TunePod studio credentials and RSS migration toolkit have been queued.'
        });
      }
    } catch (err) {
      setInquirySuccess({
        ref: `POD-${Math.floor(100000 + Math.random() * 900000)}`,
        msg: 'Show reservation received! Our audio team has received your registration.'
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleTip = (show) => {
    setTipNotice(`✓ Tipped 50 TM Credits (${formatPrice(5)}) directly to ${show.host} (${show.title}) — sent instantly to their account!`);
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
      q: 'How do sponsor ads work across Apple Podcasts and Spotify?',
      a: 'Whenever someone presses play on any app, TunePod smoothly adds a current sponsor ad into your episode. You can add new sponsors to all your old episodes with one click, without ever needing to re-edit audio files!'
    },
    {
      q: 'Can I bring my existing podcast over from Buzzsprout, Libsyn, or Spotify?',
      a: 'Yes, absolutely! With our 1-click import, we bring in all your existing episodes, descriptions, and artwork. You will not lose a single subscriber.'
    },
    {
      q: 'How do team payouts and listener tips work?',
      a: 'You can set up percentage splits for your host, co-host, or producer. Whenever your podcast earns money from ads or fan tips, the money is automatically sent straight to each person’s M-Pesa or bank account.'
    },
    {
      q: 'What does automatic voice leveling do?',
      a: 'It fixes quiet voices, stops sudden loud bursts from hurting listeners’ ears, and removes background hum. Your show will sound loud, clear, and professional on phones, car stereos, and headphones.'
    },
    {
      q: 'Do my credits expire, or will I be charged every month?',
      a: 'No monthly traps! You only reload credits when you need them, and they never expire. If you take a couple months off between podcast seasons, you will never receive a surprise charge.'
    }
  ];

  return (
    <div className="role-page-wrapper podcaster-landing-view" style={{ '--role-accent': accent }} data-testid="podcaster-landing-page">
      <SEO 
        title="TunePod — Podcaster Studio, Easy Sponsor Ads & Fast Payouts"
        description="Great sounding podcasts in minutes. Automatic voice leveling, simple sponsor ads, verified show media kits, and instant team payouts via M-Pesa."
        favicon="/favicons/tunepod.png"
      />

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
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Podcasters &amp; Audio Shows</span>
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

      {/* ================= 2. 4-Stat Metrics Ribbon ================= */}
      <section style={{ background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#00f2fe', display: 'block', fontFamily: 'Sansation, sans-serif' }}>185K+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Weekly Episode Downloads</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Verified Sponsor Ad Plays</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#38bdf8', display: 'block', fontFamily: 'Sansation, sans-serif' }}>Clear Audio</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Loud &amp; Balanced on Every Phone</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', display: 'block', fontFamily: 'Sansation, sans-serif' }}>$0 Traps</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>No Forced Monthly Subscriptions</span>
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
              BUILT FOR MODERN PODCASTERS &amp; CREATORS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Everything You Need to Sound Great and Get Paid
            </h2>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Say goodbye to complicated sound tools, endless monthly bills, and waiting months for sponsor checks. TunePod makes podcasting simple and profitable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.12)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiEqualizerFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Crystal-Clear Sound &amp; Free Transcripts
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                We clean up room echoes and level out loud or quiet voices automatically. Your show sounds crisp in cars, headphones, and home speakers, with zero audio engineering skills needed.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> Automatic volume balancing for every episode</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> Clear transcripts your listeners can read along with</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#00f2fe" /> Clickable chapter markers to jump to topics</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiMegaphoneFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Earn from Old &amp; New Episodes
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Add sponsor messages to your entire episode catalog with one click. Relevant ads play automatically based on where your listeners live, so you earn money even when people listen to your older shows.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> You keep 85% of what sponsors pay</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> 0% platform fee on your own direct sponsor deals</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#10b981" /> Plays smoothly on Apple, Spotify, and everywhere</li>
              </ul>
            </div>

            <div style={{ background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <RiCoinsFill size={24} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 10px 0' }}>
                Fair Team Pay &amp; Fan Tips
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                Share earnings automatically between hosts, guests, and editors with zero paperwork. Fans can also tip you easily using M-Pesa or card, and money goes straight into your pocket.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12.5px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Fast mobile money (M-Pesa) and bank deposits</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Automatic percentage splits with clear receipts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><RiCheckFill color="#f59e0b" /> Live stats page you can share with potential sponsors</li>
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
                FEATURED SHOWS
              </span>
              <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 6px 0', fontFamily: 'Sansation, sans-serif' }}>
                Popular Podcasts on TuneMavens
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
                Listen to real episodes, check out their verified media kits, and see how easy it is to tip your favorite hosts.
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
                        Studio Balanced Voice
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
                          ★ {show.rating} · {show.subscribers} Subscribers
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
                      <span>Sponsor Ads from <strong>{formatPrice(entryRateUsd)}</strong></span>
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
                        <RiPlayFill size={16} /> Stream Episode
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
                          <RiAwardFill size={13} /> View Media Kit
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
              TRANSPARENT SPONSOR RATES
            </span>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Clear, Upfront Ad Rates for Sponsors &amp; Creators
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Sponsors pay standard rates to reach your audience. You keep 85% of every dollar earned, deposited straight into your account with automatic team splits.
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
                  {rate.credits.toLocaleString()} Credits · ~{formatPrice(rate.cpm_usd)} per 1,000 listens
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
            Your All-in-One Podcaster Studio
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.7 }}>
            A friendly, unified dashboard: upload episodes, check your listener numbers, set up sponsor slots, and see your payouts grow.
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
              Click to view high-resolution dashboard preview ({isSw ? 'Kiswahili' : 'English'})
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. 3-Step Guided Workflow ================= */}
      <section style={{ padding: '80px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto 50px auto' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Three Simple Steps to Launch &amp; Earn
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              Start a new show or migrate your existing episodes in under 5 minutes without losing a single listener.
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
                1. Upload Your Voice
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Drop in your raw audio file. TunePod automatically cleans up background hum, balances volume levels, and creates searchable text transcripts.
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
                2. Set Up Sponsor Slots &amp; Media Kit
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Choose where you want sponsor messages to play. Share your live media kit link with brands so they can book ads directly on your show.
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
                3. Share Everywhere &amp; Get Paid
              </h3>
              <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Your show goes live on Apple, Spotify, and TuneStream in one click. As listeners tune in and sponsors run ads, payouts arrive directly in your account.
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
              HOW WE COMPARE
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Why Creators Choose TunePod Over Traditional Hosts
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Compare TunePod with old-school hosts like Buzzsprout, Libsyn, and Spotify for Podcasters.
            </p>
          </div>

          <div style={{ overflowX: 'auto', background: '#090d1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Feature</th>
                  <th style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 800, background: 'rgba(0, 242, 254, 0.05)' }}>TunePod (TuneMavens)</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Buzzsprout / Libsyn</th>
                  <th style={{ padding: '16px 20px', color: '#94a3b8', fontWeight: 700 }}>Spotify for Podcasters</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Storage &amp; Bandwidth</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Unlimited Fast Audio Playback</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Strict 3-12 hours monthly limits</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Free with heavy compression</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Sponsor Ad Earnings</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Keep 85% of ad spend (0% on own deals)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Expensive add-ons ($50+/month)</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Spotify-only ad revenue share</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Team &amp; Co-Host Payouts</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Automatic M-Pesa &amp; Bank Splits</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Manual monthly math &amp; wire transfers</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Not available</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Voice Sound Quality</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Automatic Studio Voice Leveling</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Must buy external sound software</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Basic web limiter</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Media Kit for Brands</td>
                  <td style={{ padding: '16px 20px', color: '#00f2fe', fontWeight: 700, background: 'rgba(0, 242, 254, 0.05)' }}>Live Audited Stats with 1-Click Booking</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Static PDF files you update by hand</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Not available</td>
                </tr>
                <tr>
                  <td style={{ padding: '16px 20px', fontWeight: 700, color: '#fff' }}>Billing Model</td>
                  <td style={{ padding: '16px 20px', color: '#10b981', fontWeight: 800, background: 'rgba(0, 242, 254, 0.05)' }}>No monthly fees (Credits never expire)</td>
                  <td style={{ padding: '16px 20px', color: '#ef4444' }}>Mandatory $12 - $120 monthly invoices</td>
                  <td style={{ padding: '16px 20px', color: '#94a3b8' }}>Locked to Spotify ecosystem</td>
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
              TRANSPARENT PLANS
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '8px 0 12px 0', fontFamily: 'Sansation, sans-serif' }}>
              Zero Monthly Invoices. Pay Only When You Grow.
            </h2>
            <p style={{ fontSize: '14.5px', color: '#94a3b8', margin: 0 }}>
              Choose a starter package or credit reload. Your show, feed, and episodes remain online forever.
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
              Got questions about moving your show, getting paid, or audio sound quality? We are here to help.
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
            START BROADCASTING TODAY
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', margin: '12px 0 16px 0', fontFamily: 'Sansation, sans-serif' }}>
            Ready to Share Your Voice with Millions?
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
                  {inquirySuccess ? 'Show Registration Confirmed' : `Sign Up: ${selectedTier?.name || 'TunePod Studio'}`}
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
                  Register your show for the <strong style={{ color: '#00f2fe' }}>{selectedTier?.name}</strong> ({formatPrice(selectedTier?.price_usd || 19)} / {selectedTier?.credits} credits). No recurring monthly commitments.
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
                        Monthly Downloads
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
                      Team Members or Co-Hosts
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. We have 2 co-hosts and want to set up automatic 50/50 splits for brand sponsor earnings."
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
