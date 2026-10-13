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
import userProducerImg from '../../assets/images/user_producer.png'
import userManagerImg from '../../assets/images/user_manager.png'
import tourDashboardMockup from '../../assets/images/tour_dashboard_mockup.png'

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
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  const slides = [
    { 
      dot: '#22d3ee', 
      badge: 'Music Operations & AI Suite',
      hLine1: 'You make the art.',
      hLine2: 'We handle the rest.',
      hLine2Color: '#22d3ee',
      s: "Coordinate splits, mastering LUFS, and sync pitches under a single unified console.",
      b1: 'Explore AI Tools',
      b1link: '/tools',
      b2: 'See Dashboard Apps',
      b2link: '/apps'
    },
    { 
      dot: '#8b5cf6', 
      badge: 'Automated Split Calculations',
      hLine1: 'Spreadsheet split sheets?',
      hLine2: 'Never again.',
      hLine2Color: '#8b5cf6',
      s: isWestern 
        ? "Define percentage rules once, ingest statement CSVs, and route digital payouts automatically via ACH, PayPal, and wire."
        : "Define percentage rules once, ingest statement CSVs, and route digital payouts automatically to local banks and M-Pesa.",
      b1: 'Learn Split Ledgers',
      b1link: '/apps',
      b2: 'Explore Pricing',
      b2link: '/pricing'
    },
    { 
      dot: '#22d3ee', 
      badge: 'Automated Sync Curation',
      hLine1: 'Pitches that hit.',
      hLine2: 'Get licensed.',
      hLine2Color: '#22d3ee',
      s: "Translate creative scene descriptors into search-friendly tags for TV & film music supervisors.",
      b1: 'Launch SyncMavens Platform',
      b1link: syncMavensUrl,
      b2: 'Explore Sync Hub',
      b2link: '/for/supervisor'
    },
    { 
      dot: '#10b981', 
      badge: 'Global Rights & Sync',
      hLine1: 'Distribute, sync, publish.',
      hLine2: 'Own your rights.',
      hLine2Color: '#10b981',
      s: isWestern
        ? "Pitch to TV networks, distribute to 150+ stores, and collect mechanical royalties globally in USD/GBP."
        : "Pitch to TV networks, distribute globally, and collect mechanical royalties into local mobile accounts.",
      b1: 'Start Publishing Now',
      b1link: '/publishing',
      b2: 'Learn Split Ledgers',
      b2link: '/apps'
    },
    {
      dot: '#c084fc',
      badge: 'Consumer Music Experience',
      hLine1: 'Listen and purchase.',
      hLine2: 'Support artists directly.',
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
      badge: 'Catalogue Machine & Ingest',
      hLine1: 'Scale your catalog.',
      hLine2: 'Ingest bulk releases.',
      hLine2Color: '#f59e0b',
      s: "Upload bulk statements, parse CSV roster ledgers instantly, and optimize catalog splits seamlessly.",
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
                <a href={currentSlideData.b1link} className="hbp" target="_blank" rel="noopener noreferrer">
                  {currentSlideData.b1} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
              ) : (
                <Link to={resolveLink(currentSlideData.b1link)} className="hbp">
                  {currentSlideData.b1}
                </Link>
              )}
              {currentSlideData.b2link.startsWith('http') ? (
                <a href={currentSlideData.b2link} className="hbg" target="_blank" rel="noopener noreferrer">
                  {currentSlideData.b2} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
                </a>
              ) : (
                <Link to={resolveLink(currentSlideData.b2link)} className="hbg">
                  {currentSlideData.b2}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className={`sui-arrows ${slideState}`}>
          <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide">‹</button>
          <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide">›</button>
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
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={userProducerImg} alt="TuneMavens EPK Builder Studio" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.25)' }}>
                  EPK Builder Studio
                </div>
                <h3 className="flagship-title">Interactive Electronic Press Kit Studio</h3>
                <p className="flagship-text">
                  Build high-converting, professional press kits that present your music and brand identity to industry decision-makers without technical friction. Designed specifically to captivate festival talent buyers, record labels, and booking agents.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Interactive theme visualizers and customizable dark-mode design presets</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>One-click bio generation with live discography and streaming track embeds</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Direct booking inquiry routing, technical stage riders, and high-res asset downloads</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/epk" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Launch EPK Builder <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Explore Creator OS
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Content row for Smart CRM */}
            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={userManagerImg} alt="Smart CRM and Fan Relationship Management" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                  Smart CRM
                </div>
                <h3 className="flagship-title">Fan Relationship Management &amp; Roster CRM</h3>
                <p className="flagship-text">
                  Take direct ownership of your fanbase and eliminate algorithmic gatekeepers with a centralized contact management engine. Consolidate your core audience across every release, tour stop, and merchandise drop.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Automated contact capture from tour ticket pre-sales, digital vinyl, and EPK inquiries</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>VIP tier segmentation for targeted tour announcements and merchandise drops</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Direct-to-fan messaging with unified delivery tracking via Intermaven.io</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/apps" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', background: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Open Smart CRM <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Audience Insights
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Content row for EPK Catalogue Machine */}
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={distributeHeroImg} alt="EPK Catalogue Machine and Track Ingestion" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
                  EPK Catalogue Machine
                </div>
                <h3 className="flagship-title">Central Track Ingestion &amp; Catalogue Machine</h3>
                <p className="flagship-text">
                  The authoritative central vault engineered to ingest, organize, and protect your releases and multi-track audio stems. Synchronize high-fidelity metadata across streaming, sync licensing, and public press worlds with zero loss.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>High-throughput CSV roster ingestion with automatic metadata validation</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>Verified ISRC code allocation and acoustic genre classification</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#a855f7' }}><RiCheckFill size={15} /></span>
                    <span>Seamless real-time catalog distribution across TuneMavens, TuneStream, and SyncMavens</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/apps" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', background: '#a855f7', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Open Catalogue Machine <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Catalogue Specs
                  </Link>
                </div>
              </div>
            </div>

            {/* 4. Content row for EPK Builder (Public Web Worlds & Live Showcases) */}
            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={tourDashboardMockup} alt="EPK Builder Standalone Web Worlds and Live Showcases" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.25)' }}>
                  EPK Builder · Sovereign Web Worlds
                </div>
                <h3 className="flagship-title">EPK Builder &amp; Public Press Kit Deployments</h3>
                <p className="flagship-text">
                  Deploy your press kit as a high-performance standalone web world hosted on custom domains or branded subdomains. Experience sovereign digital presence built on Mother-CMS architecture with instant global DNS propagation.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Custom domain routing powered by Mother-CMS with instant global DNS propagation</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>Embedded 60fps audio player with stem auditioning and liner notes</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: 'var(--cyan)' }}><RiCheckFill size={15} /></span>
                    <span>1-tap mobile money fan tipping (M-Pesa) and live ticket reservations</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <Link to="/epk" className="btn-primary" style={{ padding: '10px 22px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Deploy Your EPK <RiArrowRightLine size={13} />
                  </Link>
                  <Link to="/register?role=creator" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>

            {/* 5. Content row for Music Streaming & Purchase Marketplace */}
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={consumerAppImg} alt="TuneStream Music Streaming and Purchase Marketplace" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                  Consumer Experience
                </div>
                <h3 className="flagship-title">Music Streaming &amp; Purchase Marketplace</h3>
                <p className="flagship-text">
                  Experience pure master audio playback and direct artist commerce powered by our unified credit network. Stream without corporate ads and purchase vinyl, merchandise, and stem collectibles straight from creators.
                </p>
                <ul className="flagship-bullets">
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>24-bit/96kHz lossless uncompressed streaming with zero corporate ads</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>1-tap direct artist tipping routing 100% of contributions to verified creators</span>
                  </li>
                  <li className="flagship-bullet-item">
                    <span className="flagship-bullet-icon" style={{ color: '#10b981' }}><RiCheckFill size={15} /></span>
                    <span>Digital vinyl store, stem pack downloads, and offline encrypted caching</span>
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  <a href={tuneStreamUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', background: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Launch TuneStream Portal <RiExternalLinkLine size={13} />
                  </a>
                  <Link to="/for/consumer" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    Listener Platform
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Above requested Carousel */}
          <HomeFeatureCarousel sessionUser={sessionUser} />
        </section>

        <UserPersonaCarousel />

        <section className="section-wrapper text-center">
          <div className="section-header">
            <span className="section-label">Frustrations Resolved</span>
            <h2 className="section-title">Built for the Real Realities of Music</h2>
          </div>
          <div className="pain-points-grid">
            <div className="pain-card glass-panel">
              <div className="pain-icon"><RiStackFill size={24} /></div>
              <h4>Spreadsheet Fatigue</h4>
              <p><strong>Ideal for DIY Managers.</strong> We replace complex spreadsheets with automated cascade splitting rules that map directly to payment terminals.</p>
            </div>
            <div className="pain-card glass-panel">
              <div className="pain-icon"><RiCpuFill size={24} /></div>
              <h4>Engineering Costs</h4>
              <p><strong>Ideal for Touring Artists.</strong> Get mastering and compliance checks instantly without having to hire expensive studio engineers for simple reference adjustments.</p>
            </div>
            <div className="pain-card glass-panel">
              <div className="pain-icon"><RiGlobalFill size={24} /></div>
              <h4>Pitching Hurdles</h4>
              <p><strong>Ideal for Sync Catalog Owners.</strong> Translate your tracks into structured metadata briefs so television networks and game publishers can find your songs in catalogs.</p>
              <a href={syncMavensUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12.5px', color: 'var(--cyan)', marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 600 }}>Visit SyncMavens Platform <RiExternalLinkLine size={12} /></a>
            </div>
          </div>
        </section>

        <section className="section-wrapper text-center cta-banner-section" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div className="glass-panel cta-banner-panel" style={{ padding: '32px 24px', borderRadius: 'var(--r)', border: '1px solid rgba(34, 211, 238, 0.15)', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03), rgba(139, 92, 246, 0.03))' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: '12px', fontFamily: 'Sansation, sans-serif' }}>Ready to automate your music business operations?</h2>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 30px', color: 'var(--mu)' }}>
              Get 150 free signup credits instantly. No credit card required. Use credits across TuneMavens and the Intermaven network.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>Start Free</Link>
              <Link to="/pricing" className="btn-secondary" style={{ padding: '12px 28px', fontSize: '15px' }}>See Credit Packages</Link>
            </div>
          </div>
        </section>
        </div>
      </div>
    </>
  );
}
