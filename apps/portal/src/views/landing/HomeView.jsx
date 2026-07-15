import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { RiStackFill, RiCpuFill, RiGlobalFill } from 'react-icons/ri'
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
import creatorDashboardImg from '../../assets/images/creator_dashboard.png'
import appsMasteringImg from '../../assets/images/apps_mastering.png'

import ledgerStep1Img from '../../assets/images/ledger_step_1.png'
import ledgerStep2Img from '../../assets/images/ledger_step_2.png'
import ledgerStep3Img from '../../assets/images/ledger_step_3.png'
import ledgerStep4Img from '../../assets/images/ledger_step_4.png'

import syncStep1Img from '../../assets/images/sync_step_1.png'
import syncStep2Img from '../../assets/images/sync_step_2.png'
import syncStep3Img from '../../assets/images/sync_step_3.png'
import syncStep4Img from '../../assets/images/sync_step_4.png'

import { PerfectForSidebar } from '../../components/PerfectForSidebar.jsx'
import SyncBriefCarousel from '../../components/demos/SyncBriefCarousel.jsx'
import MasteringDemo from '../../components/demos/MasteringDemo.jsx'
import SplitCascadeCarousel from '../../components/demos/SplitCascadeCarousel.jsx'
import UserPersonaCarousel from '../../components/demos/UserPersonaCarousel.jsx'

export default function HomeView({ sessionUser }) {
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
  const [ledgerStep, setLedgerStep] = useState(0);
  const ledgerImages = [ledgerStep1Img, ledgerStep2Img, ledgerStep3Img, ledgerStep4Img];
  const [syncStep, setSyncStep] = useState(0);
  const syncImages = [syncStep1Img, syncStep2Img, syncStep3Img, syncStep4Img];

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
      b1: 'Optimize Sync Briefs',
      b1link: '/tools',
      b2: 'Submit Ticket',
      b2link: '/help'
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
      b1: 'Start Free Streaming',
      b1link: '/stream',
      b2: 'Browse Music Store',
      b2link: '/tools'
    },
    {
      dot: '#f59e0b',
      badge: 'Catalog Operations & Ingest',
      hLine1: 'Scale your catalog.',
      hLine2: 'Ingest bulk releases.',
      hLine2Color: '#f59e0b',
      s: "Upload bulk statements, parse CSV roster ledgers instantly, and optimize catalog splits seamlessly.",
      b1: 'Start Bulk Ingest',
      b1link: '/register',
      b2: 'Roster Operations',
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

  return (
    <>
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
              <Link to={resolveLink(currentSlideData.b1link)} className="hbp">
                {currentSlideData.b1}
              </Link>
              <Link to={resolveLink(currentSlideData.b2link)} className="hbg">
                {currentSlideData.b2}
              </Link>
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
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={consumerAppImg} alt="TuneMavens Consumer Streaming App" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Consumer Experience</div>
                <h3 className="flagship-title">Music Streaming & Purchase Marketplace</h3>
                <p className="flagship-text">
                  <strong>Ad-Free High-Fidelity Playback & Digital Store.</strong> Fans stream catalog releases and purchase vinyl, merchandise, and digital collectibles directly from independent artists. Powered by non-expiring Unified Network Credits shared across tunemavens.com, watchtube.tv, and intermaven.io.
                </p>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Start Free Streaming</Link>
              </div>
            </div>

            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={creatorDashboardImg} alt="Backend Creator Dashboard and Analytics AI" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Creator Analytics</div>
                <h3 className="flagship-title">Backend Unified Dashboard & Real-Time Analytics AI</h3>
                <p className="flagship-text">
                  <strong>Data-Rich Console with a Self-Learning Neural Engine.</strong> Monitor live listening metrics, track cross-platform network credits earnings, and coordinate metadata. Our AI learns from directory trends and reference parameters in real-time, refining splits and tag recommendations every single second.
                </p>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Explore Creator Console</Link>
              </div>
            </div>

            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={syncImages[syncStep]} alt="Sync Brief AI workflow" className="flagship-image fade-in-animation" key={syncStep} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Sync Licensing</div>
                <h3 className="flagship-title">Sync Brief AI</h3>
                <p className="flagship-text">
                  <strong>Ideal for Independent Songwriters & Sync Composers.</strong> Stop wasting hours trying to guess how a music supervisor will search for your track. Our AI parses script notes and video briefs to output tags like BPM, mood, and genre instantly. Catalog your songs so media buyers find them first.
                </p>
                <SyncBriefCarousel step={syncStep} setStep={setSyncStep} />
                <Link to="/tools" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Try Sync Pitch Tool &rarr;</Link>
              </div>
            </div>

            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={appsMasteringImg} alt="Mastering Brief AI" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Audio Engineering</div>
                <h3 className="flagship-title">Mastering Brief AI</h3>
                <p className="flagship-text">
                  <strong>Ideal for Bedroom Producers & DIY Recording Artists.</strong> Skip the expensive mastering sessions just to hear your mix in the car. Set target loudness targets (LUFS) for streaming networks, upload references, and let the engine optimize your audio for immediate playback in seconds.
                </p>
                <MasteringDemo />
                <Link to="/tools" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Try Mastering Tool &rarr;</Link>
              </div>
            </div>

            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={ledgerImages[ledgerStep]} alt="Split Cascade Ledger workflow" className="flagship-image fade-in-animation" key={ledgerStep} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Accounting & Revenue</div>
                <h3 className="flagship-title">Split Cascade Ledger</h3>
                <p className="flagship-text" style={{ fontSize: '17px', lineHeight: '1.6' }}>
                  <strong>Ideal for Indie Label Managers & Music Collectives.</strong> Stop fighting with Excel sheets and manual payouts. Set clean percentages for authors, producers, and labels once. Load your distributor's statement CSV, and let the cascade engine calculate everyone's share in seconds.
                </p>
                <SplitCascadeCarousel step={ledgerStep} setStep={setLedgerStep} />
                <Link to="/apps" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Manage Roster Splits &rarr;</Link>
              </div>
            </div>
          </div>
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
