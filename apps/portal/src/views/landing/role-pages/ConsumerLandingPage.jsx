import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiHeadphoneFill, 
  RiHeartFill, 
  RiCoinsFill, 
  RiFolderMusicFill, 
  RiQrCodeFill, 
  RiCompass3Fill, 
  RiArrowRightLine, 
  RiCheckFill, 
  RiExternalLinkLine,
  RiPlayFill,
  RiDiscFill,
  RiEqualizerFill,
  RiCloseFill,
  RiCheckboxCircleFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { getServiceUrl } from '../../../components/PerfectForSidebar.jsx'
import listenHeroImg from '../../../assets/images/listen_hero.png'
import consumerAppImg from '../../../assets/images/consumer_app.png'
import tunestreamHeaderImg from '../../../assets/images/tunestream_header.png'
import tunestreamHeader2Img from '../../../assets/images/tunestream_header_2.png'
import listenLogo from '../../../assets/logos/tunestream-logo.png'

const FALLBACK_CONSUMER_RATES = [
  {
    slug: 'listener-free',
    name: 'Listener Free',
    tier_badge: 'Ad-Supported',
    price_usd: 0.0,
    billing_period: 'month',
    credits: 0,
    key_metric: 'High-Fidelity Audio Streaming',
    features: [
      'Stream thousands of independent music tracks across East Africa and global scenes',
      'Full-featured 60fps waveform player with live playlist queueing',
      'Follow favorite artists and receive real-time release notifications',
      '1-tap direct tipping to support creators with M-Pesa or card',
      'Create and share unlimited public and private music playlists'
    ],
    is_popular: false,
    cta: 'Listen Free'
  },
  {
    slug: 'listener-vip',
    name: 'TuneStream VIP Audiophile',
    tier_badge: 'Most Popular',
    price_usd: 4.99,
    billing_period: 'month',
    credits: 50,
    key_metric: 'Ad-Free Lossless Audio · 50 Credits/mo',
    features: [
      '100% ad-free playback with zero audio interstitial interruptions',
      'Studio-quality 24-bit uncompressed FLAC audio streaming',
      '50 monthly TM credits to tip artists, unlock singles, or purchase stems',
      'Offline cache playback support across mobile and desktop browsers',
      'Dynamic track lyrics, producer liner notes, and synthesizer gear specs',
      'Support creators with higher royalty payouts per stream'
    ],
    is_popular: true,
    cta: 'Get TuneStream VIP'
  },
  {
    slug: 'listener-patron',
    name: 'Patron of the Arts',
    tier_badge: 'Culture Builder',
    price_usd: 14.99,
    billing_period: 'month',
    credits: 200,
    key_metric: '200 Credits/mo · VIP Concert Passes',
    features: [
      'Exclusive verified Patron badge displayed on creator chats and live drops',
      'Early listening access to unreleased album cuts 7 days before general public',
      '200 monthly TM credits for concert tickets, vinyl merch, and digital passes',
      'Priority booking on artist live world tours with digital QR passes',
      'Direct patron Q&A channels with favorite producers and vocalists',
      'Direct contribution to independent creator development funds'
    ],
    is_popular: false,
    cta: 'Become a Patron'
  }
];

export default function ConsumerLandingPage() {
  const accent = '#ec4899';
  const tuneStreamUrl = getServiceUrl('tunestream');

  // ================= HERO Slide Carousel State =================
  const [currentSlide, setCurrentSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  // Live Rates & Booking Modal State
  const [tierPackages, setTierPackages] = useState(FALLBACK_CONSUMER_RATES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    organization_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    tier_slug: 'listener-vip',
    favorite_genres: 'Afrobeats, Amapiano & Deep House',
    estimated_budget: '$4.99 / month (50 Credits)',
    notes: ''
  });

  const SLIDE_DURATION = 12000; // 12s per slide
  const TRANSITION_OUT_MS = 240;

  useEffect(() => {
    fetch('/api/roles/consumer/packages')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTierPackages(data);
        }
      })
      .catch(err => {
        console.warn('Using fallback consumer rates:', err);
      });
  }, []);

  const slides = [
    {
      badge: 'High-Fidelity Lossless Playback',
      dot: '#ec4899',
      hLine1: 'Listen in Pure Fidelity.',
      hLine2: 'Uncompressed 24-bit Audio.',
      hLine2Color: '#ec4899',
      s: 'Stream studio master audio ad-free. Experience crystal-clear dynamic range, spatial separation, and offline caching powered by TuneStream.',
      b1: 'Review Listener Plans',
      b1link: '#listener-rates',
      b2: 'Explore Music Features',
      b2link: '#playback-features',
      image: listenHeroImg
    },
    {
      badge: 'Direct Creator Tipping',
      dot: '#ec4899',
      hLine1: 'Support Artists Directly.',
      hLine2: 'Zero Middleman Margins.',
      hLine2Color: '#ec4899',
      s: 'Tip musicians with 1-tap M-Pesa, card, or Apple/Google Pay. 100% of your tips cascade directly into the artist\'s verified payout wallet.',
      b1: 'Sign Up to Tip Artists',
      b1link: '/register?role=consumer',
      b2: 'How Direct Tipping Works',
      b2link: '#direct-tipping',
      image: consumerAppImg
    },
    {
      badge: 'Permanent Digital Merch Vault',
      dot: '#ec4899',
      hLine1: 'Own Your Collection.',
      hLine2: 'Exclusive Album Stems.',
      hLine2Color: '#ec4899',
      s: 'Buy lossless digital albums and isolated track stems directly from creator EPKs ($9.99 / 50 credits). Your collection stays permanently in your account.',
      b1: 'Browse Music Vault',
      b1link: tuneStreamUrl,
      b2: 'Stem Purchase Specs',
      b2link: '#merch-vault',
      image: tunestreamHeaderImg
    },
    {
      badge: 'Frictionless Live Tour Passes',
      dot: '#ec4899',
      hLine1: 'Concert Tickets on Mobile.',
      hLine2: 'Instant QR Venue Entry.',
      hLine2Color: '#ec4899',
      s: 'Discover local tour dates and buy tickets in seconds with mobile money. Stored QR codes enable effortless gate check-ins at live shows.',
      b1: 'Explore Live Tours',
      b1link: tuneStreamUrl,
      b2: 'Ticketing Protocol',
      b2link: '#tour-ticketing',
      image: tunestreamHeader2Img
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
    const el = document.getElementById('listener-rates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#listener-rates');
    }
  };

  const handleOpenBooking = (tier) => {
    setSelectedTier(tier);
    setBookingForm(prev => ({
      ...prev,
      tier_slug: tier.slug,
      estimated_budget: tier.price_usd === 0 
        ? 'Free Forever' 
        : `$${tier.price_usd?.toLocaleString()} / ${tier.billing_period || 'month'} (${tier.credits?.toLocaleString()} Credits)`
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
        role: 'consumer',
        organization_name: bookingForm.organization_name || bookingForm.contact_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || undefined,
        tier_slug: bookingForm.tier_slug,
        tier_name: selectedTier?.name,
        estimated_budget: bookingForm.estimated_budget,
        target_genre: bookingForm.favorite_genres,
        notes: bookingForm.notes
      };

      const res = await fetch('/api/roles/consumer/inquiries', {
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
        aria-label="Listeners & Consumers Hero Carousel"
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
                src={listenLogo} 
                alt="TuneStream Logo" 
                style={{ height: '34px', width: 'auto', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }} 
              />
            </div>

            <div className="role-breadcrumb" style={{ justifyContent: 'center', marginBottom: '14px' }}>
              <Link to="/">Home</Link> <span>/</span> <Link to="/for">Made For</Link> <span>/</span> <span>Music Enthusiasts</span>
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
                <a 
                  href={currentSlideData.b1link} 
                  className="hbp"
                  style={{ background: currentSlideData.dot }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentSlideData.b1} <RiArrowRightLine size={15} style={{ marginLeft: '6px' }} />
                </a>
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

      {/* ================= 2. Main Content ================= */}
      <div className="role-container">
        <section className="role-stats-ribbon" style={{ marginTop: '40px' }}>
          <div className="role-stat-item">
            <span className="role-stat-value">24-Bit</span>
            <span className="role-stat-label">Lossless FLAC Audio Streaming</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">100%</span>
            <span className="role-stat-label">Direct Creator Tip Cascade</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Zero</span>
            <span className="role-stat-label">Audio Interstitial Ads on VIP</span>
          </div>
          <div className="role-stat-item">
            <span className="role-stat-value">Instant</span>
            <span className="role-stat-label">M-Pesa Concert QR Ticket Passes</span>
          </div>
        </section>

        {/* 3. Core Feature Pillars Grid */}
        <section id="playback-features" style={{ scrollMarginTop: '100px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">The Listener Experience</span>
            <h3 className="role-section-title">Pure Sound, Fair Creator Support</h3>
            <p className="role-section-desc">
              Discover raw underground talent, stream uncompressed studio audio, and support creators with direct tipping and event ticketing.
            </p>
          </div>

          <div className="role-pillars-grid">
            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiHeadphoneFill size={24} /></div>
              <h4 className="role-pillar-title">Studio Master Playback</h4>
              <p className="role-pillar-desc">
                Hear music exactly as the producer mastered it in the studio. Uncapped high-resolution playback with 60fps waveform scrubbers and zero compression artifacts.
              </p>
            </div>

            <div className="role-pillar-card" id="direct-tipping" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiHeartFill size={24} /></div>
              <h4 className="role-pillar-title">1-Tap Direct Tipping</h4>
              <p className="role-pillar-desc">
                Tip artists directly through M-Pesa STK push, Apple Pay, Google Pay, or debit cards. 100% of fan tips cascade straight into the creator's payout split.
              </p>
            </div>

            <div className="role-pillar-card" id="merch-vault" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiFolderMusicFill size={24} /></div>
              <h4 className="role-pillar-title">Personal Vault &amp; Playlists</h4>
              <p className="role-pillar-desc">
                Create and curate custom playlists. Download purchased singles, albums ($9.99 / 50 credits), and isolated stems into your permanent personal collection.
              </p>
            </div>

            <div className="role-pillar-card" id="tour-ticketing" style={{ scrollMarginTop: '100px' }}>
              <div className="role-pillar-icon"><RiQrCodeFill size={24} /></div>
              <h4 className="role-pillar-title">Live Concert QR Passes</h4>
              <p className="role-pillar-desc">
                Buy event tickets directly through artist EPK web worlds with instant M-Pesa push. Store digital QR codes in your account for frictionless venue entry.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiCoinsFill size={24} /></div>
              <h4 className="role-pillar-title">Unified Network Credits</h4>
              <p className="role-pillar-desc">
                One wallet balance shared across TuneMavens, TuneStream, and the entire Intermaven network. Use credits for stream tokens, stem packs, and digital merch.
              </p>
            </div>

            <div className="role-pillar-card">
              <div className="role-pillar-icon"><RiCompass3Fill size={24} /></div>
              <h4 className="role-pillar-title">Region-Aware Curation</h4>
              <p className="role-pillar-desc">
                Switch regions seamlessly between East Africa (Nairobi, Kampala, Dar es Salaam) and Global scenes to discover trending grassroots sounds first.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Showcase Section */}
        <section className="role-showcase-panel">
          <div className="role-showcase-content">
            <span className="role-section-eyebrow">The App In Action</span>
            <h3>TuneStream Player &amp; Fan Analytics Console</h3>
            <p>
              Listen on any device. Track your listening playtime hours, favorite genres (Afrobeat, Amapiano, Hip-Hop), and support streaks in your personalized listener console.
            </p>
            <ul className="role-showcase-checklist">
              <li><RiCheckFill size={18} /> Butter-smooth 60fps player with real-time waveform scrubbers</li>
              <li><RiCheckFill size={18} /> Support creators directly without 30% platform cuts</li>
              <li><RiCheckFill size={18} /> Multi-device session pickup across web and mobile browsers</li>
              <li><RiCheckFill size={18} /> Full album showcases with analog synthesizer and liner notes</li>
            </ul>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
              <a href={tuneStreamUrl} className="role-btn-primary" target="_blank" rel="noopener noreferrer">
                Open TuneStream Web Player <RiPlayFill size={14} style={{ marginLeft: '6px' }} />
              </a>
              <a href="#listener-rates" className="role-btn-secondary" onClick={scrollToRates}>
                Review Listener Plans
              </a>
            </div>
          </div>
          <div className="role-showcase-image-wrap">
            <img src={consumerAppImg} alt="TuneStream Listener App and Music Player" />
          </div>
        </section>

        {/* 5. 3-Step Guided Workflow Path */}
        <section style={{ marginBottom: '64px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Listener Journey</span>
            <h3 className="role-section-title">How to Get Started on TuneStream</h3>
            <p className="role-section-desc">Experience genuine independent music discovery in 3 quick steps.</p>
          </div>

          <div className="role-workflow-grid">
            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiCompass3Fill size={24} /></div>
              <span className="role-step-number">01</span>
              <span className="role-step-badge">Step 1 · Preferences</span>
              <h4 className="role-step-title">Select Favorite Genres &amp; Creators</h4>
              <p className="role-step-desc">
                Pick the sounds you love (Afro-House, Deep House, Amapiano, R&amp;B) and follow verified creators to personalize your daily feed.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiHeadphoneFill size={24} /></div>
              <span className="role-step-number">02</span>
              <span className="role-step-badge">Step 2 · Discovery</span>
              <h4 className="role-step-title">Stream Lossless Audio Ad-Free</h4>
              <p className="role-step-desc">
                Enjoy continuous, uncapped playback with butter-smooth scrubbers, dynamic track liner notes, and curated editorial selections.
              </p>
            </div>

            <div className="role-workflow-step">
              <div className="role-workflow-icon"><RiHeartFill size={24} /></div>
              <span className="role-step-number">03</span>
              <span className="role-step-badge">Step 3 · Connection</span>
              <h4 className="role-step-title">Tip Directly &amp; Grab Live Passes</h4>
              <p className="role-step-desc">
                Send direct tips using mobile money, buy stems or digital albums, and purchase digital QR passes to upcoming creator tour dates.
              </p>
            </div>
          </div>
        </section>

        {/* ================= 6. COMMERCIAL LISTENER TIERS & PLANS ================= */}
        <section id="listener-rates" style={{ scrollMarginTop: '100px', marginBottom: '72px' }}>
          <div className="role-section-header">
            <span className="role-section-eyebrow">Fair Audio Subscriptions</span>
            <h3 className="role-section-title">TuneStream Listener Plans &amp; Patron Memberships</h3>
            <p className="role-section-desc">
              From free high-fidelity web streaming to audiophile VIP ad-free listening and cultural Patron packages that support independent creators directly.
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

                <span className="role-rate-badge">{rate.tier_badge || 'Listener Tier'}</span>
                <h4 className="role-rate-title">{rate.name}</h4>

                <div className="role-rate-price-box">
                  <span className="role-rate-price">
                    {rate.price_usd === 0 ? '$0' : `$${rate.price_usd?.toLocaleString()}`}
                  </span>
                  <span className="role-rate-period">/ {rate.billing_period || 'month'}</span>
                </div>

                <div className="role-rate-submeta">
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {rate.credits > 0 ? `${rate.credits?.toLocaleString()} TM Credits/mo` : 'Ad-Supported Playback'}
                  </span>
                  <span style={{ color: '#64748b' }}>·</span>
                  <span style={{ color: accent, fontWeight: 600 }}>
                    {rate.key_metric || 'TuneStream Access'}
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
              <RiShieldCheckFill size={20} color={accent} /> Audiophile Specifications &amp; Direct Creator Royalty Guarantees
            </h4>
            <div className="role-specs-grid">
              <div className="role-spec-box">
                <span className="role-spec-label">Audio Stream Fidelity</span>
                <div className="role-spec-value">
                  Uncompressed 24-bit/96kHz studio FLAC audio streaming with zero perceptual compression or dynamic range squashing.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Direct Creator Tipping</span>
                <div className="role-spec-value">
                  M-Pesa STK push, mobile wallets, and Apple/Google Pay. 100% of fan tip value transfers directly into creator balances.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Permanent Music Vault</span>
                <div className="role-spec-value">
                  Purchased digital albums ($9.99) and stems are permanently stored in your account vault with unlimited re-downloads.
                </div>
              </div>

              <div className="role-spec-box">
                <span className="role-spec-label">Offline Playback</span>
                <div className="role-spec-value">
                  Client-side encrypted progressive caching allowing offline playback on mobile and desktop browsers with zero buffering.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Conversion CTA Banner */}
        <section className="role-conversion-banner">
          <h3>Step Into High-Definition Sound</h3>
          <p>
            Join music enthusiasts supporting their favorite artists directly with fair splits and uncompressed audio fidelity.
          </p>
          <div className="role-conversion-actions">
            <Link to="/register?role=consumer" className="role-btn-primary">
              Create Free Listener Account <RiArrowRightLine size={15} />
            </Link>
            <a href="#listener-rates" className="role-btn-secondary" onClick={scrollToRates}>
              Review Listener Plans
            </a>
          </div>
          <span className="role-trust-note">
            Free forever tier · 150 free credits on sign up · No credit card required to listen
          </span>
        </section>
      </div>

      {/* ================= 8. LISTENER PLAN BOOKING & ONBOARDING MODAL ================= */}
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
                  Listener Plan Reserved
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
                  {inquirySuccess.msg} Your membership selection has been reserved and credited to your profile.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setModalOpen(false)} 
                    className="role-btn-primary"
                  >
                    Done
                  </button>
                  <Link 
                    to="/register?role=consumer" 
                    className="role-btn-secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Complete Account Creation
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    TuneStream Listener Membership
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '4px 0 6px', fontFamily: 'Sansation, sans-serif' }}>
                    {selectedTier?.name || 'Listener Plan'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                    Experience uncompressed studio sound, direct tipping, and ad-free offline playback.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Your Name *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Alex Kamau"
                        value={bookingForm.contact_name}
                        onChange={e => setBookingForm({ ...bookingForm, contact_name: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Listener Handle / Nickname</label>
                      <input 
                        type="text" 
                        placeholder="e.g. @audiophile_kamau"
                        value={bookingForm.organization_name}
                        onChange={e => setBookingForm({ ...bookingForm, organization_name: e.target.value })}
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
                        placeholder="alex@gmail.com"
                        value={bookingForm.contact_email}
                        onChange={e => setBookingForm({ ...bookingForm, contact_email: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Mobile Number (for M-Pesa Tipping)</label>
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
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Selected Membership</label>
                      <select
                        value={bookingForm.tier_slug}
                        onChange={e => {
                          const slug = e.target.value;
                          const found = tierPackages.find(r => r.slug === slug);
                          setBookingForm({
                            ...bookingForm,
                            tier_slug: slug,
                            estimated_budget: found ? (found.price_usd === 0 ? 'Free Forever' : `$${found.price_usd?.toLocaleString()} / ${found.billing_period || 'month'}`) : '$4.99 / month'
                          });
                        }}
                        style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff' }}
                      >
                        <option value="listener-free">Listener Free — $0 / Free · High-Fidelity Web Stream</option>
                        <option value="listener-vip">TuneStream VIP Audiophile — $4.99/mo (50 Credits) · Ad-Free FLAC</option>
                        <option value="listener-patron">Patron of the Arts — $14.99/mo (200 Credits) · VIP Tour Passes</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Favorite Music Genres</label>
                      <input 
                        type="text" 
                        value={bookingForm.favorite_genres}
                        onChange={e => setBookingForm({ ...bookingForm, favorite_genres: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Favorite Artists / Additional Preferences</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Love Sauti Sol, Burna Boy, and underground Amapiano live sessions..."
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
                    {inquirySubmitting ? 'Registering Listener Plan…' : 'Activate Listener Membership'}
                  </button>

                  <p style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0 0' }}>
                    Instant activation · 150 free starter credits · Cancel anytime with 1 click
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
