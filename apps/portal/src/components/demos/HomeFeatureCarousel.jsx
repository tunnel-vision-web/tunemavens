import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiCheckFill, 
  RiArrowRightLine, 
  RiExternalLinkLine
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
      tabLabel: 'Creator Analytics',
      badge: 'Creator Insights',
      title: 'Simple Overview & Real-Time Music Analytics',
      accent: '#22d3ee',
      desc: 'A clean, easy dashboard that shows how your music is performing. Track listeners across web and mobile, see your earnings in real time, and receive smart suggestions for release dates and audio balance.',
      highlights: [
        'Live streaming metrics and visual listener maps',
        'Helpful tips for song tags, release windows, and loudness',
        'Unified credit balances and straightforward royalty tracking'
      ],
      primaryCta: {
        label: 'Explore Creator Dashboard',
        to: sessionUser ? '/dashboard' : '/register?role=creator',
        isExternal: false
      },
      secondaryCta: {
        label: 'See Creator Tools',
        to: '/for/creator',
        isExternal: false
      },
      image: creatorDashboardImg,
      alt: 'TuneMavens Unified Dashboard & Real-Time Analytics'
    },
    {
      id: 'sync-ai',
      tabLabel: 'Sync Licensing',
      badge: 'TV & Film Placements',
      title: 'Sync Placement Engine & Easy Music Pitching',
      accent: '#f59e0b',
      desc: 'Turn everyday song descriptions into clear tags for TV and film music supervisors. Whether a director is looking for an upbeat indie track or an atmospheric acoustic cue, our system puts your songs right where buyers look.',
      highlights: [
        'Simple song descriptions matched directly to buyer search cues',
        'Direct access to pre-cleared TV and film opportunities on SyncMavens',
        'Automated cue sheets to guarantee proper broadcast credits'
      ],
      primaryCta: {
        label: 'Visit SyncMavens',
        href: syncMavensUrl,
        isExternal: true
      },
      secondaryCta: {
        label: 'Try Song Pitching',
        to: '/tools',
        isExternal: false
      },
      image: appsSyncImg,
      alt: 'Sync Brief and Placement Engine Console'
    },
    {
      id: 'mastering-ai',
      tabLabel: 'Audio Mastering',
      badge: 'Sound Polish',
      title: 'Audio Mastering & Streaming Loudness Check',
      accent: '#10b981',
      desc: 'Get your songs sounding full, clear, and radio-ready without expensive studio bills. Ensure your audio meets the target loudness requirements for Spotify and Apple Music in just a few clicks.',
      highlights: [
        'Automatic loudness calibration for Spotify and Apple Music',
        'Quick A/B comparisons with your favorite reference tracks',
        'Export broadcast-ready masters in crystal-clear quality'
      ],
      primaryCta: {
        label: 'Try Mastering Tool',
        to: '/tools',
        isExternal: false
      },
      secondaryCta: {
        label: 'Check Loudness Guidelines',
        to: '/for/creator#pillars',
        isExternal: false
      },
      image: appsMasteringImg,
      alt: 'Mastering Audio Engineering Console'
    },
    {
      id: 'split-ledger',
      tabLabel: 'Royalty Splits',
      badge: 'Simple Payouts',
      title: 'Automatic Split Sheets & Collaborator Payouts',
      accent: '#a855f7',
      desc: 'No more arguments or confusing spreadsheet formulas. Set each contributor’s percentage once, upload your earnings report from DistroKid or TuneCore, and send each person their share automatically.',
      highlights: [
        'One-click statement uploads from DistroKid, TuneCore, and CD Baby',
        'Automatic payouts straight to M-Pesa, bank accounts, or cards',
        'Clear, easy-to-read payout summaries for everyone involved'
      ],
      primaryCta: {
        label: 'Manage Your Splits',
        to: '/apps',
        isExternal: false
      },
      secondaryCta: {
        label: 'See How Splits Work',
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
      aria-label="Core Tools and Features Suite"
    >
      <div className="hfc-header">
        <span className="hfc-eyebrow">Integrated Operations</span>
        <h2 className="hfc-section-title">Essential Tools for Modern Musicians</h2>
        <p className="hfc-section-desc">
          Four dedicated modules designed to simplify release management, music licensing, sound quality, and collaborator payouts.
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
            style={{ '--hfc-accent': m.accent, borderRadius: '3px' }}
          >
            {m.tabLabel}
          </button>
        ))}
      </div>

      {/* Main Slide Card */}
      <div className="hfc-card glass-panel" key={currentIndex} style={{ borderRadius: '3px' }}>
        <div className="hfc-card-content">
          <div className="hfc-badge-row">
            <span className="hfc-badge" style={{ borderRadius: '3px' }}>{current.badge}</span>
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
                style={{ borderRadius: '3px' }}
              >
                {current.primaryCta.label} <RiExternalLinkLine size={14} />
              </a>
            ) : (
              <Link to={current.primaryCta.to} className="hfc-btn-primary" style={{ borderRadius: '3px' }}>
                {current.primaryCta.label} <RiArrowRightLine size={14} />
              </Link>
            )}

            {current.secondaryCta.isExternal ? (
              <a 
                href={current.secondaryCta.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hfc-btn-secondary"
                style={{ borderRadius: '3px' }}
              >
                {current.secondaryCta.label} <RiExternalLinkLine size={14} />
              </a>
            ) : (
              <Link to={current.secondaryCta.to} className="hfc-btn-secondary" style={{ borderRadius: '3px' }}>
                {current.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        <div className="hfc-card-visual" style={{ borderRadius: '3px' }}>
          <img 
            src={current.image} 
            alt={current.alt} 
            className="hfc-image" 
            style={{ borderRadius: '3px' }}
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
            style={{ borderRadius: '3px' }}
          >
            ‹
          </button>
          <button 
            type="button" 
            onClick={nextSlide} 
            className="hfc-nav-btn" 
            aria-label="Next module"
            style={{ borderRadius: '3px' }}
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
