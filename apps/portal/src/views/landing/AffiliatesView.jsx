import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  RiSparklingLine,
  RiGlobalLine,
  RiCoinsFill,
  RiDiscFill,
  RiEqualizerFill,
  RiHeadphoneFill,
  RiTicket2Fill,
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiFileCopyLine,
  RiCloseLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiArrowDownSLine,
  RiUserStarLine,
  RiCustomerService2Fill,
  RiMoneyDollarCircleLine,
  RiExternalLinkLine,
  RiBarChartFill,
  RiSearchLine,
  RiShareLine,
  RiSmartphoneFill,
  RiBankCardFill
} from 'react-icons/ri'

import SEO from '../../components/common/SEO.jsx'
import { useRegion } from '../../RegionContext.jsx'
import { affiliatesApi } from '../../lib/api.js'

// Dedicated Affiliate Hero Images (Authentic East African / Kenyan principle subjects)
import affiliateHero1Img from '../../assets/images/affiliate_hero_1.png'
import affiliateHero2Img from '../../assets/images/affiliate_hero_2.png'
import affiliateHero3Img from '../../assets/images/affiliate_hero_3.png'
import affiliateHero4Img from '../../assets/images/affiliate_hero_4.png'
import affiliateHero5Img from '../../assets/images/affiliate_hero_5.png'

import './AffiliatesView.css'

export default function AffiliatesView({ sessionUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { country } = useRegion() || {};
  const isWestern = ['US', 'GB'].includes(country);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const SLIDE_DURATION = 36000;

  const slides = [
    {
      dot: '#22d3ee',
      badge: '🇰🇪 Kenya Launch · East Africa & Global Affiliate Program',
      hLine1: 'Turn your music network into',
      hLine2: 'recurring monthly income.',
      hLine2Color: '#22d3ee',
      s: 'Partner with TuneMavens. Earn 3% to 12% revenue share on every stream, lossless album sale, sync placement, and creator onboarded. Direct local M-Pesa STK payouts and global rails.',
      b1: 'Become an Affiliate',
      b1action: 'apply',
      b2: 'Calculate Earnings',
      b2action: 'scroll',
      b2target: 'aff-calculator'
    },
    {
      dot: '#8b5cf6',
      badge: '90-Day Cookie Attribution · 3 Full Months of Sales',
      hLine1: 'One shared referral link.',
      hLine2: '90 days of commission.',
      hLine2Color: '#a78bfa',
      s: 'Share artist EPKs, singles, or stems kits across Nairobi, Mombasa, Kampala, or worldwide. Even if your audience purchases weeks later, every checkout is credited to your ledger.',
      b1: 'View Commission Matrix',
      b1action: 'scroll',
      b1target: 'aff-matrix',
      b2: 'Check Affiliate Stats',
      b2action: 'stats'
    },
    {
      dot: '#10b981',
      badge: 'Instant M-Pesa & Global Rails · Low $20 / KES 2,600 Floor',
      hLine1: 'Fast local payouts.',
      hLine2: 'Zero payment gatekeeping.',
      hLine2Color: '#34d399',
      s: 'Cash out automatically via Safaricom M-Pesa STK push or global bank transfers (Stripe, PayPal, wire) with an ultra-accessible $20 (KES 2,600) minimum withdrawal.',
      b1: 'Apply in 2 Minutes',
      b1action: 'apply',
      b2: 'How It Works',
      b2action: 'scroll',
      b2target: 'aff-journey'
    },
    {
      dot: '#f59e0b',
      badge: 'High-Yield Commercial Sync · SyncMavens Integration',
      hLine1: 'Place African sound in TV & film.',
      hLine2: 'Earn up to $300 per placement.',
      hLine2Color: '#fbbf24',
      s: 'Connect brand sync supervisors and commercial briefs to sync-cleared Kenyan and global music. Collect top-tier 12% affiliate commission on commercial clearances and show placements.',
      b1: 'Explore Sync Platform',
      b1link: '/for/supervisor',
      b2: 'Read Affiliate FAQs',
      b2action: 'scroll',
      b2target: 'aff-faq'
    },
    {
      dot: '#c084fc',
      badge: 'Curators, DJs, Producers & Bloggers · Multicultural Network',
      hLine1: 'From Nairobi to the world.',
      hLine2: 'Monetize your ear for music.',
      hLine2Color: '#c084fc',
      s: 'Whether you run Gengetone/Afrobeats playlists, DJ club sets in Nairobi, produce multitrack stems, or host music podcasts, monetize your creative influence seamlessly.',
      b1: 'Join the Partner Network',
      b1action: 'apply',
      b2: 'Check My Stats',
      b2action: 'stats'
    }
  ];

  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide];

  const backgrounds = [
    `url(${affiliateHero1Img})`,
    `url(${affiliateHero2Img})`,
    `url(${affiliateHero3Img})`,
    `url(${affiliateHero4Img})`,
    `url(${affiliateHero5Img})`
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

  const handleCtaClick = (btn) => {
    if (btn.action === 'apply') {
      setShowApplyModal(true);
    } else if (btn.action === 'stats') {
      setShowCheckStatsModal(true);
    } else if (btn.action === 'scroll' && btn.target) {
      const el = document.getElementById(btn.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (btn.link) {
      if (btn.link.startsWith('http')) {
        window.open(btn.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(btn.link);
      }
    }
  };

  const renderHeroCta = (slide, which) => {
    const label = which === 'b1' ? slide.b1 : slide.b2;
    const action = which === 'b1' ? slide.b1action : slide.b2action;
    const target = which === 'b1' ? slide.b1target : slide.b2target;
    const link = which === 'b1' ? slide.b1link : slide.b2link;
    const cls = which === 'b1' ? 'hbp' : 'hbg';

    if (action || !link) {
      return (
        <button
          type="button"
          className={cls}
          onClick={() => handleCtaClick({ action, target, link })}
          style={{ cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {label}
        </button>
      );
    }

    if (link.startsWith('http')) {
      return (
        <a href={link} className={cls} target="_blank" rel="noopener noreferrer">
          {label} <RiExternalLinkLine size={14} style={{ marginLeft: '4px' }} />
        </a>
      );
    }

    return (
      <Link to={link} className={cls}>
        {label}
      </Link>
    );
  };

  // Matrix and config state
  const [matrixData, setMatrixData] = useState([]);
  const [cookieDays, setCookieDays] = useState(90);
  const [minPayoutUsd, setMinPayoutUsd] = useState(20);
  const [loadingMatrix, setLoadingMatrix] = useState(true);

  // Application Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showCheckStatsModal, setShowCheckStatsModal] = useState(false);
  const [lookupRefCode, setLookupRefCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Application Form State
  const [applyForm, setApplyForm] = useState({
    name: sessionUser?.name || '',
    email: sessionUser?.email || '',
    handle: '',
    custom_ref: '',
    website_or_social: '',
    audience_category: 'curator',
    target_region: 'global',
    payout_method: 'mpesa',
    payout_account: ''
  });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccessData, setApplySuccessData] = useState(null);
  const [applyError, setApplyError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Calculator State
  const [calcStreams, setCalcStreams] = useState(75000); // 75k streams
  const [calcAlbums, setCalcAlbums] = useState(40);      // 40 albums
  const [calcStems, setCalcStems] = useState(8);         // 8 stems kits
  const [calcSync, setCalcSync] = useState(1);           // 1 sync deal
  const [calcOnboarding, setCalcOnboarding] = useState(5);// 5 creators

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Fetch Compensation Matrix on mount
  useEffect(() => {
    affiliatesApi.getMatrix()
      .then(res => {
        if (res && Array.isArray(res.matrix)) {
          setMatrixData(res.matrix);
          if (res.cookie_days) setCookieDays(res.cookie_days);
          if (res.min_payout_usd) setMinPayoutUsd(res.min_payout_usd);
        }
      })
      .catch(err => {
        console.warn('Affiliate matrix fallback to defaults:', err);
      })
      .finally(() => setLoadingMatrix(false));
  }, []);

  // Check URL query parameters for auto-opening modal or ref code
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'apply' || params.get('join') === 'true') {
      setShowApplyModal(true);
    }
    const refParam = params.get('ref');
    if (refParam) {
      // Record click tracking silently
      affiliatesApi.track(refParam).catch(() => {});
    }
  }, [location.search]);

  // Dynamic Calculator Computation
  const calculatedEarnings = useMemo(() => {
    // 1. Streaming (assuming $0.004 gross per stream, 3% commission on creator net pool)
    const streamEarnings = calcStreams * 0.004 * 0.03;
    // 2. Full Albums ($9.99 sale * 7% commission)
    const albumEarnings = calcAlbums * 9.99 * 0.07;
    // 3. Stems Kits ($49.00 average sale * 8.5% commission)
    const stemsEarnings = calcStems * 49.00 * 0.085;
    // 4. Sync Deal ($2,500 average sync fee * 12% capped at $300)
    const syncEarnings = calcSync * Math.min(2500 * 0.12, 300);
    // 5. Creator Onboarding ($100 credit reload * 12% commission)
    const onboardingEarnings = calcOnboarding * 100 * 0.12;

    const totalUsd = streamEarnings + albumEarnings + stemsEarnings + syncEarnings + onboardingEarnings;
    const totalKes = totalUsd * 130; // Approx KES conversion

    return {
      streamEarnings: Math.round(streamEarnings * 100) / 100,
      albumEarnings: Math.round(albumEarnings * 100) / 100,
      stemsEarnings: Math.round(stemsEarnings * 100) / 100,
      syncEarnings: Math.round(syncEarnings * 100) / 100,
      onboardingEarnings: Math.round(onboardingEarnings * 100) / 100,
      totalUsd: Math.round(totalUsd * 100) / 100,
      totalKes: Math.round(totalKes)
    };
  }, [calcStreams, calcAlbums, calcStems, calcSync, calcOnboarding]);

  // Handle Application Submission
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplySubmitting(true);
    setApplyError('');

    try {
      const payload = {
        name: applyForm.name,
        email: applyForm.email,
        handle: applyForm.handle,
        custom_ref: applyForm.custom_ref,
        website_or_social: applyForm.website_or_social,
        audience_category: applyForm.audience_category,
        target_region: applyForm.target_region,
        payout_method: applyForm.payout_method,
        payout_details: {
          account: applyForm.payout_account || applyForm.email
        },
        accept_terms: true
      };

      const res = await affiliatesApi.apply(payload);
      if (res.status === 'success' || res.status === 'already_registered') {
        setApplySuccessData(res.affiliate);
      } else {
        setApplyError(res.message || 'Registration encountered an issue. Please try again.');
      }
    } catch (err) {
      setApplyError(err.message || 'Failed to submit affiliate application.');
    } finally {
      setApplySubmitting(false);
    }
  };

  // Handle Lookup Affiliate Stats
  const handleLookupStats = async (e) => {
    e.preventDefault();
    if (!lookupRefCode.trim()) return;
    setLookupLoading(true);
    setLookupResult(null);

    try {
      const res = await affiliatesApi.getMe(lookupRefCode.trim());
      if (res.has_affiliate_account) {
        setLookupResult(res);
      } else {
        setLookupResult({ not_found: true });
      }
    } catch (err) {
      setLookupResult({ error: err.message || 'Unable to retrieve affiliate stats' });
    } finally {
      setLookupLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const FAQS = [
    {
      q: "Do I need platform credits to use the Affiliate Dashboard or onboard creators?",
      a: "No. The Affiliate Dashboard, referral link generator, conversion analytics, and direct creator onboarding are 100% free and require zero credits. Platform Unified Credits only apply should you voluntarily choose to use creator production tools or services (such as MasterLab AI audio mastering, SyncMavens sync pitching, or custom domain hosting)."
    },
    {
      q: "How does the 90-day tracking cookie work?",
      a: "When anyone clicks your unique affiliate link (e.g., tunemavens.com?ref=YOURNAME), a high-durability first-party cookie is stored in their browser for 90 days. Even if they browse around, leave, and return weeks later to stream, purchase an album, buy tickets, or election a distribution plan, the transaction is automatically credited to your affiliate ledger."
    },
    {
      q: "How does the 3% to 12% compensation matrix work?",
      a: "Unlike legacy distribution services that only pay a flat one-time bounty, TuneMavens shares revenue across the entire music lifecycle. You earn 3% on stream pools and tips, 5% on single lossless downloads, 7% on full album sales, 8.5% on stems kits, 10% on live event passes, and 12% on commercial sync deals and creator onboarding reloads."
    },
    {
      q: "How and when do I get paid?",
      a: "Commissions enter a brief 7-day clearing window to verify payment finality, then become instantly available. Payouts can be disbursed automatically once you reach the $20 minimum threshold (or 100 Unified Credits). We support instant M-Pesa STK push for East Africa, Stripe and PayPal for international affiliates, and 1-click platform credit reloads."
    },
    {
      q: "Can I refer creators as well as music fans?",
      a: "Yes! Your referral code works platform-wide. If you refer a music listener who streams songs or buys an album on an EPK, you earn on their consumption. If you refer a recording artist, producer, or record label who elections distribution or buys Unified Credits, you earn 12% on their top-up."
    },
    {
      q: "Are self-referrals or fraud prevention locks applied?",
      a: "Yes. Self-referrals using the same email or payment account are automatically filtered by TuneLedger. All attributions are immutably logged with cryptographic timestamps to protect creators and genuine affiliates."
    },
    {
      q: "Do I need a huge audience to qualify?",
      a: "No! The TuneMavens Affiliate Scheme is open to anyone in the music community — playlist curators, music bloggers, Discord community mods, recording engineers, podcast hosts, and independent artists sharing their peers' music."
    },
    {
      q: "Is there any mandatory training or required reading before I can start?",
      a: "No. All affiliate tools, link generators, and direct onboarding features are available immediately upon registration with zero required gates. We provide an Affiliate Academy with recommended reading playbooks on the 3%–12% matrix, M-Pesa STK settlements, and CAK/FTC compliance to help you maximize your income, but reading is 100% optional."
    }
  ];

  return (
    <div className="affiliates-landing-page">
      <SEO 
        title="Music Affiliate Programme — Earn up to 12% Revenue Share | TuneMavens"
        description="Join the TuneMavens Affiliate Scheme modeled around Ditto Music. Earn 3% to 12% lifetime commissions on music streaming, lossless album sales, stems, and sync licensing."
      />

      {/* ================= HERO Carousel (Kenyan & Multicultural Principle Subjects) ================= */}
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
              {renderHeroCta(currentSlideData, 'b1')}
              {renderHeroCta(currentSlideData, 'b2')}
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

      <div className="container affiliates-container">
        
        {/* ================= Quick Metrics & Attribution Strip ================= */}
        <div className="affiliates-badges-strip">
          <div className="aff-metric-pill">
            <span className="pill-metric">3% – 12%</span>
            <span className="pill-label">Commission Matrix</span>
          </div>
          <div className="aff-metric-pill">
            <span className="pill-metric">90 Days</span>
            <span className="pill-label">Cookie Attribution</span>
          </div>
          <div className="aff-metric-pill">
            <span className="pill-metric">$20 / KES 2,600</span>
            <span className="pill-label">Low Payout Floor</span>
          </div>
          <div className="aff-metric-pill">
            <span className="pill-metric">M-Pesa & Stripe</span>
            <span className="pill-label">Global & Local Rails</span>
          </div>
        </div>


        {/* ================= Interactive Calculator ================= */}
        <section className="affiliates-calc-section" id="aff-calculator">
          <div className="section-header-center">
            <span className="eyebrow-tag">Interactive Simulator</span>
            <h2 className="section-title">Calculate Your Projected Earnings</h2>
            <p className="section-subtitle">
              Drag the sliders below to estimate your monthly affiliate commission across our multi-channel revenue streams.
            </p>
          </div>

          <div className="calc-card-container">
            <div className="calc-sliders-column">
              
              {/* Slider 1: Streams */}
              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">
                    <RiHeadphoneFill className="calc-icon cyan" /> Monthly Referred Streams
                  </span>
                  <span className="slider-val">{calcStreams.toLocaleString()} streams</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="1000000" 
                  step="5000" 
                  value={calcStreams} 
                  onChange={(e) => setCalcStreams(Number(e.target.value))}
                  className="calc-range"
                />
                <div className="slider-hint">Earn 3% on creator net streaming payouts (~$0.004/stream pool)</div>
              </div>

              {/* Slider 2: Full Album Sales */}
              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">
                    <RiDiscFill className="calc-icon purple" /> Full Album Purchases ($9.99)
                  </span>
                  <span className="slider-val">{calcAlbums} albums</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="300" 
                  step="5" 
                  value={calcAlbums} 
                  onChange={(e) => setCalcAlbums(Number(e.target.value))}
                  className="calc-range"
                />
                <div className="slider-hint">Earn 7% gross commission ($0.70 per album)</div>
              </div>

              {/* Slider 3: Stems Packs */}
              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">
                    <RiEqualizerFill className="calc-icon green" /> Producer Stems Kits ($49.00)
                  </span>
                  <span className="slider-val">{calcStems} kits</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1" 
                  value={calcStems} 
                  onChange={(e) => setCalcStems(Number(e.target.value))}
                  className="calc-range"
                />
                <div className="slider-hint">Earn 8.5% commission ($4.17 per multitrack kit)</div>
              </div>

              {/* Slider 4: Sync Clearances */}
              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">
                    <RiGlobalLine className="calc-icon amber" /> Sync Licensing Placements
                  </span>
                  <span className="slider-val">{calcSync} placement(s)</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="1" 
                  value={calcSync} 
                  onChange={(e) => setCalcSync(Number(e.target.value))}
                  className="calc-range"
                />
                <div className="slider-hint">Earn 12% placement fee (capped at $300 max per clearance)</div>
              </div>

              {/* Slider 5: Creator Onboarding */}
              <div className="calc-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">
                    <RiCoinsFill className="calc-icon cyan" /> New Creators Onboarded ($100 pack)
                  </span>
                  <span className="slider-val">{calcOnboarding} creators</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="1" 
                  value={calcOnboarding} 
                  onChange={(e) => setCalcOnboarding(Number(e.target.value))}
                  className="calc-range"
                />
                <div className="slider-hint">Earn 12% on first credit reload or distribution setup</div>
              </div>

            </div>

            {/* Projected Readout Column */}
            <div className="calc-result-column">
              <div className="calc-result-card">
                <span className="result-kicker">Estimated Monthly Commission</span>
                <div className="result-amount-usd">
                  ${calculatedEarnings.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="result-amount-kes">
                  ≈ KES {calculatedEarnings.totalKes.toLocaleString()} (East Africa M-Pesa)
                </div>

                <div className="calc-breakdown-ledger">
                  <div className="ledger-item">
                    <span>Streaming Ad/Pool Pool (3%)</span>
                    <strong>${calculatedEarnings.streamEarnings.toFixed(2)}</strong>
                  </div>
                  <div className="ledger-item">
                    <span>Direct Album Purchases (7%)</span>
                    <strong>${calculatedEarnings.albumEarnings.toFixed(2)}</strong>
                  </div>
                  <div className="ledger-item">
                    <span>Multitrack Stems Kits (8.5%)</span>
                    <strong>${calculatedEarnings.stemsEarnings.toFixed(2)}</strong>
                  </div>
                  <div className="ledger-item">
                    <span>Sync Placements (12%)</span>
                    <strong>${calculatedEarnings.syncEarnings.toFixed(2)}</strong>
                  </div>
                  <div className="ledger-item">
                    <span>Creator Onboarding (12%)</span>
                    <strong>${calculatedEarnings.onboardingEarnings.toFixed(2)}</strong>
                  </div>
                </div>

                <button 
                  className="btn-primary calc-cta-btn"
                  onClick={() => setShowApplyModal(true)}
                >
                  Start Earning These Rates <RiArrowRightLine size={16} />
                </button>
                <div className="calc-disclaimer">
                  *Projections are illustrative estimates based on standard catalog sales metrics and current tier rules.
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= 3-Step Journey (Ditto Music Style) ================= */}
        <section className="affiliates-journey-section" id="aff-journey">
          <div className="section-header-center">
            <span className="eyebrow-tag">Simple &amp; Transparent</span>
            <h2 className="section-title">From Signup to First Payout</h2>
            <p className="section-subtitle">
              Engineered for seamless affiliate onboarding, zero code requirements, and 100% auditable attribution.
            </p>
          </div>

          <div className="journey-grid">
            <div className="journey-card">
              <div className="journey-step-num">01</div>
              <h3 className="journey-step-title">Join the Programme</h3>
              <p className="journey-step-desc">
                Sign up in under 60 seconds. Receive your instant personalized referral link (<code className="aff-code-badge">?ref=YOURNAME</code>), custom vanity slug, and high-res media promo pack.
              </p>
              <div className="journey-highlight">
                <RiCheckboxCircleFill className="check-ico" /> Instant automatic approval
              </div>
            </div>

            <div className="journey-card">
              <div className="journey-step-num">02</div>
              <h3 className="journey-step-title">Promote &amp; Track</h3>
              <p className="journey-step-desc">
                Share your links across YouTube reviews, playlist bios, newsletters, or producer forums. Our 90-day cookie attributes all downstream sales, streams, and upgrades back to you.
              </p>
              <div className="journey-highlight">
                <RiCheckboxCircleFill className="check-ico" /> 90-Day attribution window
              </div>
            </div>

            <div className="journey-card">
              <div className="journey-step-num">03</div>
              <h3 className="journey-step-title">Get Paid Fast</h3>
              <p className="journey-step-desc">
                Track your clicks, conversions, and pending royalties in real-time. Cash out automatically once you hit $20 via M-Pesa STK, Stripe, PayPal, or instant Unified Credits.
              </p>
              <div className="journey-highlight">
                <RiCheckboxCircleFill className="check-ico" /> Multi-rail fast disbursement
              </div>
            </div>
          </div>
        </section>


        {/* ================= Compensation Matrix Table ================= */}
        <section className="affiliates-matrix-section" id="aff-matrix">
          <div className="section-header-center">
            <span className="eyebrow-tag">Ecosystem Revenue Share</span>
            <h2 className="section-title">Official 3% to 12% Compensation Matrix</h2>
            <p className="section-subtitle">
              Transparent, multi-channel commission breakdown across all digital content consumption and rights sales.
            </p>
          </div>

          <div className="matrix-table-card">
            <div className="matrix-table-responsive">
              <table className="aff-matrix-table">
                <thead>
                  <tr>
                    <th>Content &amp; Purchase Type</th>
                    <th>Platform Channel</th>
                    <th>Rate %</th>
                    <th>Calculation Basis</th>
                    <th>Example Payout</th>
                  </tr>
                </thead>
                <tbody>
                  {(matrixData.length > 0 ? matrixData : [
                    { id: '1', category: 'Streaming & Micro-Tipping', channel: 'TuneStream Web World', rate_percent: 3.0, calculation_basis: 'Creator Net Stream Payout', example_calc: '100K Streams ($400 net royalty) → $12.00 Commission' },
                    { id: '2', category: 'Lossless Track Downloads', channel: 'Creator Web Worlds (EPK)', rate_percent: 5.0, calculation_basis: 'Gross Single Track Sale', example_calc: 'Single track sale ($1.99) → $0.10 Commission' },
                    { id: '3', category: 'Full Album Showcase', channel: 'TuneStream & EPK Store', rate_percent: 7.0, calculation_basis: 'Gross Full Album Sale', example_calc: 'Full album purchase ($9.99) → $0.70 Commission' },
                    { id: '4', category: 'Multitrack Stems & Kits', channel: 'SyncMavens & Industry Hub', rate_percent: 8.5, calculation_basis: 'Gross Stems Package Sale', example_calc: 'Producer stems pack ($49.00) → $4.17 Commission' },
                    { id: '5', category: 'Digital QR Passes & Tours', channel: 'TuneTours & M-Pesa STK', rate_percent: 10.0, calculation_basis: 'Net Ticket Sale Proceeds', example_calc: 'VIP Tour Pass ($50.00) → $5.00 Commission' },
                    { id: '6', category: 'Commercial Sync Licensing', channel: 'SyncMavens Brief Matching', rate_percent: 12.0, calculation_basis: 'Net Sync Fee (Capped $300)', example_calc: 'Netflix commercial sync ($5,000) → $300.00 Commission' },
                    { id: '7', category: 'Creator Onboarding Top-Ups', channel: 'Intermaven Unified Network', rate_percent: 12.0, calculation_basis: 'First Unified Credits Top-Up', example_calc: '1,000 Credits Pack ($100) → $12.00 Commission' },
                  ]).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        <div className="table-cat-cell">
                          <strong>{item.category}</strong>
                          <span className="table-cat-desc">{item.description}</span>
                        </div>
                      </td>
                      <td>
                        <span className="table-channel-pill">{item.channel}</span>
                      </td>
                      <td>
                        <span className="table-rate-badge">{item.rate_percent.toFixed(1)}%</span>
                      </td>
                      <td className="table-basis-cell">{item.calculation_basis}</td>
                      <td className="table-example-cell">{item.example_calc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="matrix-tier-footer">
              <div className="tier-pill-group">
                <span className="tier-tag scout">Scout Tier: 3% – 10%</span>
                <span className="tier-tag partner">Partner Tier ($1k+ Volume): +1.5% Bonus</span>
                <span className="tier-tag ambassador">Ambassador Tier ($5k+ Volume): Up to 12% Uncapped</span>
              </div>
              <div className="matrix-escrow-note">
                <RiShieldCheckLine size={16} /> All commissions are verified and locked via TuneLedger Split Cascade escrow before settlement.
              </div>
            </div>
          </div>
        </section>


        {/* ================= Audience Archetypes ("Are We a Match?") ================= */}
        <section className="affiliates-audience-section">
          <div className="section-header-center">
            <span className="eyebrow-tag">Partnership Profiles</span>
            <h2 className="section-title">Are We a Match?</h2>
            <p className="section-subtitle">
              The TuneMavens Affiliate Scheme is built for music industry practitioners with engaged creative networks.
            </p>
          </div>

          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon-box">
                <RiHeadphoneFill />
              </div>
              <h4>Playlist Curators</h4>
              <p>
                Monetize your Spotify, Apple Music, and TuneStream playlists. Earn streaming residuals and album download revenue every time your listeners support artists.
              </p>
            </div>

            <div className="audience-card">
              <div className="audience-icon-box">
                <RiEqualizerFill />
              </div>
              <h4>Producers &amp; Engineers</h4>
              <p>
                Recommend mastering tools, studio split ledgers, and stem sales to artists you work with. Earn on stem kits and creator credits reloads.
              </p>
            </div>

            <div className="audience-card">
              <div className="audience-icon-box">
                <RiGlobalLine />
              </div>
              <h4>Music Bloggers &amp; Media</h4>
              <p>
                Embed EPK artist profiles and sync placement stories into your editorial articles. Earn high-ticket sync placement commissions.
              </p>
            </div>

            <div className="audience-card">
              <div className="audience-icon-box">
                <RiUserStarLine />
              </div>
              <h4>Artist Managers &amp; Labels</h4>
              <p>
                Onboard secondary roster acts or distribute catalog releases. Earn recurring commissions on team credit top-ups and tour ticket sales.
              </p>
            </div>
          </div>
        </section>


        {/* ================= FAQ Accordion ================= */}
        <section className="affiliates-faq-section" id="aff-faq">
          <div className="section-header-center">
            <span className="eyebrow-tag">Common Inquiries</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="aff-accordion-wrapper">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`aff-faq-item ${isOpen ? 'open' : ''}`}>
                  <button 
                    type="button"
                    className="aff-faq-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <RiArrowDownSLine className="aff-faq-icon" size={20} />
                  </button>
                  {isOpen && (
                    <div className="aff-faq-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>


        {/* ================= Bottom CTA ================= */}
        <section className="affiliates-bottom-banner">
          <div className="bottom-banner-content">
            <span className="bottom-badge">Get Started Today</span>
            <h2>Ready to Monetize Your Music Influence?</h2>
            <p>
              Join hundreds of curators, managers, and creators already earning up to 12% revenue share with 90-day tracking cookies.
            </p>
            <div className="banner-btn-row">
              <button 
                className="btn-primary banner-cta"
                onClick={() => setShowApplyModal(true)}
              >
                Join the Affiliate Scheme <RiArrowRightLine size={16} />
              </button>
              <button 
                className="btn-secondary banner-cta-alt"
                onClick={() => setShowCheckStatsModal(true)}
              >
                Existing Affiliate Login
              </button>
            </div>
          </div>
        </section>

      </div>


      {/* ================= Application & Link Generator Modal ================= */}
      {showApplyModal && (
        <div className="aff-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowApplyModal(false); }}>
          <div className="aff-modal-card">
            <div className="aff-modal-header">
              <div className="aff-modal-title-box">
                <span className="modal-eyebrow">Instant Registration</span>
                <h3>Join the TuneMavens Affiliate Scheme</h3>
              </div>
              <button className="aff-modal-close" onClick={() => setShowApplyModal(false)}>
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="aff-modal-body">
              {applySuccessData ? (
                <div className="apply-success-box">
                  <div className="success-icon-wrap">
                    <RiCheckboxCircleFill size={48} color="var(--cyan)" />
                  </div>
                  <h4>Congratulations! Your Affiliate Link is Live</h4>
                  <p>
                    You are registered as a <strong>{applySuccessData.tier.toUpperCase()}</strong> affiliate with 90-day tracking cookies enabled.
                  </p>

                  <div className="generated-link-box">
                    <span className="link-label">Your Unique Referral Link:</span>
                    <div className="link-input-row">
                      <input 
                        type="text" 
                        readOnly 
                        value={applySuccessData.referral_url} 
                        className="aff-readonly-link"
                      />
                      <button 
                        type="button" 
                        className="btn-primary copy-btn"
                        onClick={() => copyToClipboard(applySuccessData.referral_url)}
                      >
                        {copiedLink ? <><RiCheckLine /> Copied!</> : <><RiFileCopyLine /> Copy Link</>}
                      </button>
                    </div>
                  </div>

                  <div className="success-stats-preview">
                    <div className="stat-pill">
                      <span>Referral Code:</span>
                      <strong>{applySuccessData.ref_code}</strong>
                    </div>
                    <div className="stat-pill">
                      <span>Cookie Window:</span>
                      <strong>90 Days</strong>
                    </div>
                    <div className="stat-pill">
                      <span>Commission Range:</span>
                      <strong>3% – 12%</strong>
                    </div>
                  </div>

                  <div className="modal-actions-success">
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setShowApplyModal(false);
                        setApplySuccessData(null);
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="aff-apply-form">
                  {applyError && (
                    <div className="aff-form-error">{applyError}</div>
                  )}

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Marcus Vance"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        className="aff-form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. marcus@musicpulse.com"
                        value={applyForm.email}
                        onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        className="aff-form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Social Handle or Channel</label>
                      <input 
                        type="text" 
                        placeholder="e.g. @afrobeatsdaily or YouTube channel"
                        value={applyForm.handle}
                        onChange={(e) => setApplyForm({ ...applyForm, handle: e.target.value })}
                        className="aff-form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Custom Referral Code (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. VIBES26 (auto-assigned if blank)"
                        value={applyForm.custom_ref}
                        onChange={(e) => setApplyForm({ ...applyForm, custom_ref: e.target.value })}
                        className="aff-form-input"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Website, Playlist, or Social Link *</label>
                    <input 
                      type="url" 
                      required 
                      placeholder="https://open.spotify.com/playlist/... or instagram.com/..."
                      value={applyForm.website_or_social}
                      onChange={(e) => setApplyForm({ ...applyForm, website_or_social: e.target.value })}
                      className="aff-form-input"
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Your Role / Audience Category</label>
                      <select 
                        value={applyForm.audience_category}
                        onChange={(e) => setApplyForm({ ...applyForm, audience_category: e.target.value })}
                        className="aff-form-select"
                      >
                        <option value="curator">Playlist Curator</option>
                        <option value="creator">Independent Artist / Creator</option>
                        <option value="producer">Producer / Sound Engineer</option>
                        <option value="blogger">Music Blogger / Journalist</option>
                        <option value="label">Record Label / Manager</option>
                        <option value="podcaster">Podcaster / Content Creator</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Preferred Payout Rail</label>
                      <select 
                        value={applyForm.payout_method}
                        onChange={(e) => setApplyForm({ ...applyForm, payout_method: e.target.value })}
                        className="aff-form-select"
                      >
                        <option value="mpesa">M-Pesa STK (Kenya &amp; East Africa)</option>
                        <option value="stripe">Stripe Card / Direct Deposit (Global)</option>
                        <option value="paypal">PayPal (International)</option>
                        <option value="credits">1-Click Unified Credits (+5% Bonus)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Payout Account Details (Phone / Account Email)</label>
                    <input 
                      type="text" 
                      placeholder={applyForm.payout_method === 'mpesa' ? 'e.g. +254 712 345 678' : 'e.g. billing@yourdomain.com'}
                      value={applyForm.payout_account}
                      onChange={(e) => setApplyForm({ ...applyForm, payout_account: e.target.value })}
                      className="aff-form-input"
                    />
                  </div>

                  <div className="form-terms-check">
                    <RiShieldCheckLine size={16} color="var(--cyan)" />
                    <span>I agree to the TuneMavens Affiliate Scheme terms, 90-day cookie policy, and anti-fraud rules.</span>
                  </div>

                  <div className="modal-form-actions">
                    <button 
                      type="submit" 
                      className="btn-primary submit-app-btn"
                      disabled={applySubmitting}
                    >
                      {applySubmitting ? 'Generating Tracked Link...' : 'Generate My Affiliate Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ================= Check Stats Modal ================= */}
      {showCheckStatsModal && (
        <div className="aff-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowCheckStatsModal(false); }}>
          <div className="aff-modal-card">
            <div className="aff-modal-header">
              <div className="aff-modal-title-box">
                <span className="modal-eyebrow">Affiliate Telemetry</span>
                <h3>Check Affiliate Stats &amp; Balance</h3>
              </div>
              <button className="aff-modal-close" onClick={() => setShowCheckStatsModal(false)}>
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="aff-modal-body">
              <form onSubmit={handleLookupStats} className="aff-lookup-form">
                <div className="form-group">
                  <label>Enter Your Referral Code or Registered Email</label>
                  <div className="lookup-input-row">
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. AFROVIBE or your email"
                      value={lookupRefCode}
                      onChange={(e) => setLookupRefCode(e.target.value)}
                      className="aff-form-input"
                    />
                    <button type="submit" className="btn-primary" disabled={lookupLoading}>
                      {lookupLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </div>
              </form>

              {lookupResult && (
                <div className="lookup-result-box">
                  {lookupResult.not_found ? (
                    <div className="lookup-empty">
                      No affiliate account found for "{lookupRefCode}". <a href="#apply" onClick={(e) => { e.preventDefault(); setShowCheckStatsModal(false); setShowApplyModal(true); }}>Apply now</a> to get your link.
                    </div>
                  ) : lookupResult.affiliate ? (
                    <div className="lookup-details-card">
                      <div className="aff-profile-summary">
                        <div>
                          <h4>{lookupResult.affiliate.name}</h4>
                          <span className="aff-code-pill">Ref Code: {lookupResult.affiliate.ref_code}</span>
                          <span className={`aff-tier-badge ${lookupResult.affiliate.tier}`}>
                            {lookupResult.affiliate.tier.toUpperCase()} TIER
                          </span>
                        </div>
                        <div className="aff-link-copy">
                          <button 
                            type="button" 
                            className="btn-secondary aff-small-btn"
                            onClick={() => copyToClipboard(lookupResult.referral_url)}
                          >
                            {copiedLink ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </div>

                      <div className="lookup-metrics-grid">
                        <div className="stat-card">
                          <span className="stat-num">{lookupResult.affiliate.clicks_count || 0}</span>
                          <span className="stat-label">Total Clicks</span>
                        </div>
                        <div className="stat-card">
                          <span className="stat-num">{lookupResult.affiliate.conversions_count || 0}</span>
                          <span className="stat-label">Conversions</span>
                        </div>
                        <div className="stat-card">
                          <span className="stat-num">${(lookupResult.affiliate.pending_payout || 0).toFixed(2)}</span>
                          <span className="stat-label">Pending Payout</span>
                        </div>
                        <div className="stat-card">
                          <span className="stat-num">${(lookupResult.affiliate.total_earnings || 0).toFixed(2)}</span>
                          <span className="stat-label">All-Time Earnings</span>
                        </div>
                      </div>

                      {Array.isArray(lookupResult.recent_conversions) && lookupResult.recent_conversions.length > 0 && (
                        <div className="recent-conversions-list">
                          <h5>Recent Referred Transactions</h5>
                          {lookupResult.recent_conversions.map((conv, i) => (
                            <div key={conv.id || i} className="conv-row">
                              <div>
                                <strong>{conv.item_title}</strong>
                                <span className="conv-type">{conv.type_label}</span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span className="conv-comm">+${conv.commission_amount.toFixed(2)}</span>
                                <span className={`conv-status ${conv.status}`}>{conv.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
