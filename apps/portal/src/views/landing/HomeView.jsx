import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RiStackFill, RiCpuFill, RiGlobalFill, RiExternalLinkLine, RiArrowRightLine, RiCheckFill } from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'

// Local assets
import heroMusic1Img from '../../assets/images/hero_music_1.png'
import heroMusic2Img from '../../assets/images/hero_music_2.png'
import heroMusic3Img from '../../assets/images/hero_music_3.png'
import heroMusic4Img from '../../assets/images/hero_music_4.png'
import heroMusic1WesternImg from '../../assets/images/hero_music_1_western.png'
import heroMusic2WesternImg from '../../assets/images/hero_music_2_western.png'
import heroMusic3WesternImg from '../../assets/images/hero_music_3_western.png'
import distributeHeroImg from '../../assets/images/distribute_hero.png'
import listenHeroImg from '../../assets/images/listen_hero.png'

import consumerAppImg from '../../assets/images/consumer_app.png'
import consumerAppWesternImg from '../../assets/images/consumer_app_western.png'
import userProducerImg from '../../assets/images/user_producer.png'
import userProducerWesternImg from '../../assets/images/user_producer_western.png'
import userManagerImg from '../../assets/images/user_manager.png'
import appsSyncImg from '../../assets/images/apps_sync.png'
import creatorDashboardActualSw from '../../assets/images/creator_dashboard_actual_sw.png'
import creatorDashboardActualEn from '../../assets/images/creator_dashboard_actual_en.png'

import { PerfectForSidebar, getServiceUrl } from '../../components/PerfectForSidebar.jsx'
import HomeFeatureCarousel from '../../components/demos/HomeFeatureCarousel.jsx'
import UserPersonaCarousel from '../../components/demos/UserPersonaCarousel.jsx'
import SEO from '../../components/common/SEO.jsx'

export default function HomeView({ sessionUser }) {
  const tuneStreamUrl = getServiceUrl('tunestream');
  const syncMavensUrl = getServiceUrl('syncmavens');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const { country } = useRegion();

  const resolveLink = (link) => {
    if (sessionUser && (link === '/register' || link === '/login' || link === '/apps')) {
      return '/dashboard';
    }
    return link;
  };

  const isWestern = ['US', 'GB'].includes(country);
  const producerImg = isWestern ? userProducerWesternImg : userProducerImg;
  const localizationDashboardImg = isWestern ? creatorDashboardActualEn : creatorDashboardActualSw;
  const listenerImg = isWestern ? consumerAppWesternImg : consumerAppImg;
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  const slides = [
    { 
      dot: '#22d3ee', 
      badge: 'Music Operations & AI Suite',
      hLine1: 'You make the\u00A0art.',
      hLine2: 'We handle the\u00A0rest.',
      hLine2Color: '#22d3ee',
      s: "Manage split sheets, polish your sound, and pitch for sync placements—all from one simple dashboard.",
      b1: 'Explore AI Tools',
      b1link: '/tools',
      b2: 'See Dashboard Apps',
      b2link: '/apps'
    },
    { 
      dot: '#8b5cf6', 
      badge: 'Simple Royalty Splits',
      hLine1: 'Spreadsheet split\u00A0sheets?',
      hLine2: 'Never\u00A0again.',
      hLine2Color: '#8b5cf6',
      s: isWestern 
        ? "Set your percentage splits once, upload your earnings report, and send payouts automatically via ACH, PayPal, and wire."
        : "Set your percentage splits once, upload your earnings report, and send payouts automatically to local banks and M-Pesa.",
      b1: 'Learn Split Ledgers',
      b1link: '/apps',
      b2: 'Explore Pricing',
      b2link: '/pricing'
    },
    { 
      dot: '#22d3ee', 
      badge: 'Music Sync Placements',
      hLine1: 'Pitches that\u00A0hit.',
      hLine2: 'Get\u00A0licensed.',
      hLine2Color: '#22d3ee',
      s: "Describe your song in your own words, and we'll match your music to TV shows, films, and game placements.",
      b1: 'Launch SyncMavens Platform',
      b1link: syncMavensUrl,
      b2: 'Explore Sync Hub',
      b2link: '/for/supervisor'
    },
    { 
      dot: '#10b981', 
      badge: 'Global Rights & Sync',
      hLine1: 'Distribute, sync,\u00A0publish.',
      hLine2: 'Own your\u00A0rights.',
      hLine2Color: '#10b981',
      s: isWestern
        ? "Deliver your music to 150+ stores, pitch for TV spots, and collect your global royalties in USD or GBP."
        : "Deliver your music to stores worldwide, pitch for TV spots, and collect your royalties straight to your mobile wallet.",
      b1: 'Start Publishing Now',
      b1link: '/publishing',
      b2: 'Learn Split Ledgers',
      b2link: '/apps'
    },
    {
      dot: '#c084fc',
      badge: 'Consumer Music Experience',
      hLine1: 'Listen and\u00A0purchase.',
      hLine2: 'Support artists\u00A0directly.',
      hLine2Color: '#c084fc',
      s: isWestern
        ? "Stream high-fidelity music ad-free, buy vinyl, and purchase merchandise in USD or GBP."
        : "Stream high-fidelity music ad-free, purchase direct downloads, and support creators with mobile money.",
      b1: 'Launch TuneStream Portal',
      b1link: tuneStreamUrl,
      b2: 'Explore Listener Platform',
      b2link: '/for/consumer'
    },
    {
      dot: '#f59e0b',
      badge: 'Organize Your Catalog',
      hLine1: 'Scale your\u00A0catalog.',
      hLine2: 'Without the\u00A0clutter.',
      hLine2Color: '#f59e0b',
      s: "Upload your full song archive, organize release credits, and keep track of everyone's share with ease.",
      b1: 'Start Bulk Ingest',
      b1link: '/register',
      b2: 'Catalogue Machine',
      b2link: '/apps'
    }
  ];

  const SLIDE_DURATION = 36000;
  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide];

  const backgrounds = [
    `url(${isWestern ? heroMusic1WesternImg : heroMusic1Img})`,
    `url(${isWestern ? heroMusic2WesternImg : heroMusic2Img})`,
    `url(${isWestern ? heroMusic3WesternImg : heroMusic3Img})`,
    `url(${distributeHeroImg})`,
    `url(${listenHeroImg})`,
    `url(${isWestern ? heroMusic3WesternImg : heroMusic3Img})`
  ];

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
    }, 400);
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
      }, 400);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, slideCount]);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TuneMavens",
    "url": window.location.origin,
    "description": "Coordinate splits, mastering, and sync licensing briefs under a single unified dashboard."
  };

  return (
    <>
      <SEO 
        title="Music Operations & AI Suite" 
        description="Coordinate splits, mastering, and sync licensing briefs under a single unified dashboard."
        schema={homeSchema}
      />
      <div className="hw">
        <div className="bgs">
          {backgrounds.map((bg, idx) => (
            <div 
              key={idx}
              className={`bg ${currentSlide === idx ? 'on' : ''}`}
              style={{
                backgroundImage: bg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentSlide === idx 
                  ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.7) blur(1.5px)')
                  : 'none',
                transform: currentSlide === idx && titleHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          ))}
          <div 
            className="bgo" 
            style={{
              opacity: titleHovered ? 0.3 : 0.8,
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </div>

        <div className="hs">
          <div 
            className="hcont"
            key={currentSlide}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`he hbadge ${slideState}`} style={{ borderRadius: '3px' }}>
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
              {currentSlideData.b1link.startsWith('http') ? (
                <a href={currentSlideData.b1link} className="hbp" target="_blank" rel="noopener noreferrer" style={{ borderRadius: '3px' }}>
                  {currentSlideData.b1} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
              ) : (
                <Link to={resolveLink(currentSlideData.b1link)} className="hbp" style={{ borderRadius: '3px' }}>
                  {currentSlideData.b1}
                </Link>
              )}
              {currentSlideData.b2link.startsWith('http') ? (
                <a href={currentSlideData.b2link} className="hbg" target="_blank" rel="noopener noreferrer" style={{ borderRadius: '3px' }}>
                  {currentSlideData.b2} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
              ) : (
                <Link to={resolveLink(currentSlideData.b2link)} className="hbg" style={{ borderRadius: '3px' }}>
                  {currentSlideData.b2}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={`sui-arrows ${slideState}`}>
          <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide" style={{ borderRadius: '3px' }}>‹</button>
          <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide" style={{ borderRadius: '3px' }}>›</button>
        </div>

        <div className={`sui-bottom ${slideState}`}>
          <div className="spr">
            <div className="spb" style={{ width: `${progress}%` }} />
          </div>
          <div className="sdots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`sd ${index === currentSlide ? 'on' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <PerfectForSidebar />

      <div className="landing-content-split">
        <div className="landing-content-main container">
        <section className="section-wrapper">
          <div className="flagship-previews">
            {/* 1. Content row for EPK Builder */}
            <div className="flagship-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={producerImg} alt="TuneMavens EPK Builder Studio" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.25)', borderRadius: '3px' }}>
                  Artist EPK Builder
                </div>
                <h3 className="flagship-title">Your Music, Bio, and Tour Dates on One Clean&nbsp;Page</h3>
                <p className="flagship-text">
                  Share a professional electronic press kit that introduces your sound and story to festival curators, record labels, and booking agents—with zero coding required.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Clean, responsive design themes tailored for independent creators</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Easy bio updates, built-in song players, and streaming track embeds</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Direct booking inquiry forms, tech riders, and high-res photo downloads</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/epk" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Launch EPK Builder <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Explore Creator Suite
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Content row for Smart CRM */}
            <div className="flagship-card glass-panel reverse" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={userManagerImg} alt="Smart CRM and Fan Relationship Management" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.25)', borderRadius: '3px' }}>
                  Fan Relationship Manager
                </div>
                <h3 className="flagship-title">Keep in Touch with Your Most Dedicated&nbsp;Listeners</h3>
                <p className="flagship-text">
                  Build a lasting connection with your fanbase without depending on unpredictable social media algorithms. Collect fan contacts directly from ticket sales, new releases, and merch drops.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Effortless contact capture from tour pre-sales, song downloads, and EPK visits</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Group your top listeners by city for upcoming tour stops and special announcements</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Send friendly updates with simple delivery tracking via Intermaven.io</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/apps" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', background: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Open Smart CRM <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Audience Insights
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Content row for EPK Catalogue Machine */}
            <div className="flagship-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={distributeHeroImg} alt="EPK Catalogue Machine and Track Ingestion" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.25)', borderRadius: '3px' }}>
                  Central Song Library
                </div>
                <h3 className="flagship-title">A Safe, Organized Home for All Your Music&nbsp;Files</h3>
                <p className="flagship-text">
                  Keep all your original songs, instrumental stems, and artwork organized in one safe place. Your song credits and audio metadata stay accurate whether releasing to stores or pitching for TV sync.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>Quick bulk file uploads with automatic credit and metadata validation</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>Accurate ISRC tracking and intuitive musical genre classification</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>Seamless catalog distribution across TuneMavens, TuneStream, and SyncMavens</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/apps" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', background: '#a855f7', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Open Catalogue Machine <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Catalogue Specs
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. Content row for Complete Localization (Understandable English & Local Payouts) */}
            <div className="flagship-card glass-panel reverse" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={localizationDashboardImg} alt="TuneMavens Complete Localization and Mobile Payouts" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.25)', borderRadius: '3px' }}>
                  Complete Localization
                </div>
                <h3 className="flagship-title">Built for Local Realities &amp; Direct Mobile&nbsp;Payouts</h3>
                <p className="flagship-text">
                  Skip the international banking hurdles and confusing foreign exchange surprises. TuneMavens is fully adapted for African and global creators—supporting local mobile money like M-Pesa, regional bank deposits, and everyday, understandable English.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#f59e0b' }}><RiCheckFill size={15} /></span>
                    <span>Direct split payouts straight to M-Pesa, Airtel Money, and local African banks</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#f59e0b' }}><RiCheckFill size={15} /></span>
                    <span>Multi-currency support: earn and view balances in KES, NGN, ZAR, USD, or GBP</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#f59e0b' }}><RiCheckFill size={15} /></span>
                    <span>Clear, friendly language options with instant Kiswahili and regional language switcher</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/about" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', background: '#f59e0b', color: '#030712', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Explore Local Features <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/pricing" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    View Regional Rates
                  </Link>
                </div>
              </div>
            </div>

            {/* 5. Content row for Sync Placement & Music Licensing */}
            <div className="flagship-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={appsSyncImg} alt="SyncMavens TV and Film Music Placement Engine" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.25)', borderRadius: '3px' }}>
                  Sync Placement Engine
                </div>
                <h3 className="flagship-title">Get Your Music into TV Shows, Films &amp; Video&nbsp;Games</h3>
                <p className="flagship-text">
                  Pitch your catalog directly to music supervisors and creative directors looking for fresh sounds. Describe your tracks in simple words, and our system matches them to active sync briefs with clear, pre-cleared licensing rights.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Direct placement opportunities with television networks, streaming series, and gaming studios</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Automated brief matching by scene mood, tempo, instrumentation, and vocal style</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Keep 100% of your upfront sync fees with clear, pre-cleared licensing terms</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <a href={syncMavensUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Launch SyncMavens <RiExternalLinkLine size={13} />
                  </a>
                  <Link to="/for/supervisor" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Explore Sync Hub
                  </Link>
                </div>
              </div>
            </div>

            {/* 6. Content row for Music Streaming & Purchase Marketplace */}
            <div className="flagship-card glass-panel reverse" style={{ borderRadius: '3px' }}>
              <div className="flagship-visual-container" style={{ borderRadius: '3px' }}>
                <img src={listenerImg} alt="TuneStream Music Streaming and Purchase Marketplace" className="flagship-image" style={{ borderRadius: '3px' }} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.25)', borderRadius: '3px' }}>
                  Listener Experience
                </div>
                <h3 className="flagship-title">Listen Ad-Free &amp; Support Independent&nbsp;Artists</h3>
                <p className="flagship-text">
                  Enjoy studio-quality music without annoying ads while directly supporting the musicians you love. Buy direct song downloads, digital vinyl, and merchandise straight from verified creators.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>High-resolution audio streaming with zero corporate commercial interruptions</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>1-tap direct artist tipping where 100% of your gift goes directly to the creator</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Digital vinyl store, stem pack downloads, and offline encrypted caching</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <a href={tuneStreamUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', background: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Launch TuneStream Portal <RiExternalLinkLine size={13} />
                  </a>
                  <Link to="/for/consumer" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '3px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Listener Platform
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Above requested Carousel */}
          <HomeFeatureCarousel sessionUser={sessionUser} />
        </section>

        <UserPersonaCarousel />

        <section className="section-wrapper text-center">
          <div className="section-header">
            <span className="section-label">Everyday Challenges</span>
            <h2 className="section-title">Built for Real-World Music&nbsp;Headaches</h2>
          </div>
          <div className="pain-points-grid">
            <div className="pain-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="pain-icon" style={{ borderRadius: '3px' }}><RiStackFill size={24} /></div>
              <h4>Messy Spreadsheets</h4>
              <p><strong>Ideal for busy managers.</strong> We replace complex spreadsheets with automatic split rules that pay everyone their share without math errors.</p>
            </div>
            <div className="pain-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="pain-icon" style={{ borderRadius: '3px' }}><RiCpuFill size={24} /></div>
              <h4>High Studio Costs</h4>
              <p><strong>Ideal for indie creators.</strong> Test your loudness and audio balance instantly so your tracks sound great on Spotify and Apple Music without steep mastering fees.</p>
            </div>
            <div className="pain-card glass-panel" style={{ borderRadius: '3px' }}>
              <div className="pain-icon" style={{ borderRadius: '3px' }}><RiGlobalFill size={24} /></div>
              <h4>Pitching Roadblocks</h4>
              <p><strong>Ideal for catalog owners.</strong> Put your songs into clear, searchable terms so music supervisors for TV shows and games can quickly find and license your music.</p>
              <a href={syncMavensUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: 'var(--cyan)', marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Visit SyncMavens Platform <RiExternalLinkLine size={12} /></a>
            </div>
          </div>
        </section>

        <section className="section-wrapper text-center cta-banner-section" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div className="glass-panel cta-banner-panel" style={{ padding: '32px 24px', borderRadius: '3px', border: '1px solid rgba(34, 211, 238, 0.15)', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03), rgba(139, 92, 246, 0.03))' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: '12px', fontFamily: 'Sansation, sans-serif' }}>Ready to simplify your music&nbsp;business?</h2>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 30px', color: 'var(--mu)' }}>
              Get 150 free starter credits right away. No credit card required. Use credits across TuneMavens and the entire Intermaven network.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px', borderRadius: '3px' }}>Start Free</Link>
              <Link to="/pricing" className="btn-secondary" style={{ padding: '12px 28px', fontSize: '15px', borderRadius: '3px' }}>See Credit Packages</Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
