import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiBarChartFill, 
  RiRadioFill, 
  RiCpuFill, 
  RiStackFill, 
  RiCheckFill, 
  RiArrowRightLine, 
  RiExternalLinkLine,
  RiArrowLeftLine
} from 'react-icons/ri'
import { getServiceUrl } from '../PerfectForSidebar.jsx'
import './HomeFeatureCarousel.css'

import creatorDashboardImg from '../../assets/images/creator_dashboard.png'
import appsSyncImg from '../../assets/images/apps_sync.png'
import appsMasteringImg from '../../assets/images/apps_mastering.png'
import appsLedgerImg from '../../assets/images/apps_ledger.png'

export default function HomeFeatureCarousel({ sessionUser }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const syncMavensUrl = getServiceUrl('syncmavens');

  const SLIDE_DURATION = 9000; // 9 seconds per slide

  const modules = [
    {
      id: 'analytics',
      tabLabel: 'Creator Analytics AI',
      badge: 'Creator Intelligence',
      title: 'Backend Unified Dashboard & Real-Time Analytics AI',
      accent: '#22d3ee',
      desc: 'Data-rich operations console backed by a self-learning neural engine. Monitor live stream telemetry across web and mobile, track cross-platform network credits earnings, coordinate metadata, and let our engine refine splits and tag recommendations dynamically.',
      highlights: [
        'Real-time listening metrics and territorial listener heatmaps',
        'Neural suggestions for genre tags, optimal release windows, and target LUFS',
        'Cross-subdomain session persistence with zero credit balance drift'
      ],
      primaryCta: {
        label: 'Explore Creator Console',
        to: sessionUser ? '/dashboard' : '/register?role=creator',
        isExternal: false
      },
      secondaryCta: {
        label: 'Learn Analytics Suite',
        to: '/for/creator',
        isExternal: false
      },
      image: creatorDashboardImg,
      alt: 'TuneMavens Backend Unified Dashboard & Real-Time Analytics AI'
    },
    {
      id: 'sync-ai',
      tabLabel: 'Sync Brief AI',
      badge: 'Sync Licensing',
      title: 'Sync Brief AI & Placement Engine',
      accent: '#f59e0b',
      desc: 'Translates natural-language script notes, director cues, and creative briefs into precise search tags including BPM, instrumentation, mood, and era. Put your catalog directly in front of television, feature film, and game music supervisors on SyncMavens.',
      highlights: [
        'Natural-language script parsing directly to catalog search tags',
        'Direct pipeline to 100% pre-cleared SyncMavens placement queues',
        'Automated ASCAP, BMI, and PRS broadcast cue sheet logger'
      ],
      primaryCta: {
        label: 'Launch SyncMavens Platform',
        href: syncMavensUrl,
        isExternal: true
      },
      secondaryCta: {
        label: 'Try Sync Pitch Tool',
        to: '/tools',
        isExternal: false
      },
      image: appsSyncImg,
      alt: 'Sync Brief AI and Placement Engine Console'
    },
    {
      id: 'mastering-ai',
      tabLabel: 'Mastering Brief AI',
      badge: 'Audio Engineering',
      title: 'Mastering Brief AI & Loudness Compliance',
      accent: '#10b981',
      desc: 'Studio-grade loudness matching and compliance checks without expensive mastering fees. Calibrate target loudness (LUFS) for Spotify (-14 LUFS), Apple Music (-16 LUFS), and TIDAL (-14 LUFS). Upload mixes, compare against reference tracks, and export broadcast-compliant masters in seconds.',
      highlights: [
        'Target streaming LUFS optimization with peak limiter compliance',
        'Reference mix A/B comparison with dynamic frequency analysis',
        'Full compatibility with 24-bit/96kHz lossless uncompressed master audio'
      ],
      primaryCta: {
        label: 'Try Mastering Tool',
        to: '/tools',
        isExternal: false
      },
      secondaryCta: {
        label: 'Review Loudness Standards',
        to: '/for/creator#pillars',
        isExternal: false
      },
      image: appsMasteringImg,
      alt: 'Mastering Brief AI Audio Engineering Console'
    },
    {
      id: 'split-ledger',
      tabLabel: 'Split Cascade Ledger',
      badge: 'Accounting & Revenue',
      title: 'Split Cascade Ledger & Royalty Disbursement',
      accent: '#a855f7',
      desc: 'Eliminate spreadsheet disputes and manual payout calculations. Define collaborative shares between writers, producers, session musicians, and labels once. Load your distributor statement CSV files, and let our waterfall cascade engine route automated digital payouts in seconds.',
      highlights: [
        '1-click CSV statement ingestion (DistroKid, TuneCore, CD Baby, Believe)',
        'Automated waterfall payout disbursements to mobile money (M-Pesa) and cards',
        'Audit-ready financial disbursement statements and clear PDF export'
      ],
      primaryCta: {
        label: 'Manage Roster Splits',
        to: '/apps',
        isExternal: false
      },
      secondaryCta: {
        label: 'Explore Split Engine',
        to: '/for/label',
        isExternal: false
      },
      image: appsLedgerImg,
      alt: 'Split Cascade Ledger and Royalty Disbursement Workflow'
    }
  ];

  const total = modules.length;
  const current = modules[currentIndex];

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  };

  useEffect(() => {
    if (isPaused) {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
      setProgress(0);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, total]);

  return (
    <section 
      className="hfc-wrapper" 
      style={{ '--hfc-accent': current.accent }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Core Intelligence and Production Suite"
    >
      <div className="hfc-header">
        <span className="hfc-eyebrow">Integrated Operations Suite</span>
        <h2 className="hfc-section-title">Core Intelligence &amp; Automation Engines</h2>
        <p className="hfc-section-desc">
          Four specialized modules powering modern music careers, catalog operations, sync licensing, and financial transparency.
        </p>
      </div>

      {/* Tab Switcher Pills */}
      <div className="hfc-tab-bar" role="tablist">
        {modules.map((m, idx) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={currentIndex === idx}
            onClick={() => goToSlide(idx)}
            className={`hfc-tab-btn ${currentIndex === idx ? 'active' : ''}`}
            style={{ '--hfc-accent': m.accent }}
          >
            {m.tabLabel}
          </button>
        ))}
      </div>

      {/* Main Slide Card */}
      <div className="hfc-card glass-panel" key={currentIndex}>
        <div className="hfc-card-content">
          <div className="hfc-badge-row">
            <span className="hfc-badge">{current.badge}</span>
            <span className="hfc-slide-index">0{currentIndex + 1} / 0{total}</span>
          </div>

          <h3 className="hfc-title">{current.title}</h3>
          <p className="hfc-desc">{current.desc}</p>

          <ul className="hfc-checklist">
            {current.highlights.map((h, i) => (
              <li key={i}>
                <RiCheckFill size={17} color={current.accent} style={{ flexShrink: 0 }} />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="hfc-actions">
            {current.primaryCta.isExternal ? (
              <a 
                href={current.primaryCta.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hfc-btn-primary"
              >
                {current.primaryCta.label} <RiExternalLinkLine size={14} />
              </a>
            ) : (
              <Link to={current.primaryCta.to} className="hfc-btn-primary">
                {current.primaryCta.label} <RiArrowRightLine size={14} />
              </Link>
            )}

            {current.secondaryCta.isExternal ? (
              <a 
                href={current.secondaryCta.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hfc-btn-secondary"
              >
                {current.secondaryCta.label} <RiExternalLinkLine size={14} />
              </a>
            ) : (
              <Link to={current.secondaryCta.to} className="hfc-btn-secondary">
                {current.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        <div className="hfc-card-visual">
          <img 
            src={current.image} 
            alt={current.alt} 
            className="hfc-image" 
          />
        </div>
      </div>

      {/* Controls: Arrows, Progress, Dots */}
      <div className="hfc-controls">
        <div className="hfc-nav-arrows">
          <button 
            type="button" 
            onClick={prevSlide} 
            className="hfc-nav-btn" 
            aria-label="Previous module"
          >
            ‹
          </button>
          <button 
            type="button" 
            onClick={nextSlide} 
            className="hfc-nav-btn" 
            aria-label="Next module"
          >
            ›
          </button>
        </div>

        <div className="hfc-progress-wrap">
          <div 
            className="hfc-progress-fill" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="hfc-dots">
          {modules.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`hfc-dot ${currentIndex === idx ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
