import React, { useState } from 'react'
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
  RiFileTextFill
} from 'react-icons/ri'

import './RoleLandingShared.css'
import { useRegion } from '../../../RegionContext.jsx'
import { AUTHORITATIVE_AD_RATES } from '../../../data/authoritativeAdRates.js'
import { AUTHORITATIVE_PODCAST_SHOWS, PodcasterEpkModal } from '../../../components/podcasts/PodcastStreamingHub.jsx'
import creatorDashboardActualEn from '../../../assets/images/creator_dashboard_actual_en.png'

export default function PodcasterLandingPage({ switcher }) {
  const { formatPrice, currencyInfo } = useRegion();
  const [activeEpkShow, setActiveEpkShow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewModal, setPreviewModal] = useState(false);
  const [tipNotice, setTipNotice] = useState('');

  const categories = ['All', 'Music Business', 'Tech, VC & Startups', 'Culture & Hip-Hop', 'Film Sync & Media', 'Culture & Nightlife', 'Cultural Audio & Heritage'];

  const filteredShows = AUTHORITATIVE_PODCAST_SHOWS.filter(s => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

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

  return (
    <div className="role-landing-view podcaster-landing-view" data-testid="podcaster-landing-page">
      {switcher}

      {/* Hero Section */}
      <section className="role-hero" style={{ background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '64px 20px 76px' }}>
          <div style={{ maxWidth: '880px' }}>
            <span
              className="role-badge"
              style={{
                background: 'rgba(0, 242, 254, 0.12)',
                color: '#00f2fe',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                padding: '5px 12px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px'
              }}
            >
              <RiMicFill /> Podcasting &amp; Narrative Audio Hub · Broadcast Masters &amp; Ad Sponsorships
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.4vw, 50px)', fontWeight: 800, color: '#ffffff', fontFamily: 'Sansation, sans-serif', lineHeight: 1.15, margin: '0 0 16px 0' }}>
              Monetize Your Audio Show with Corporate Ad Flights, Verified EPKs &amp; Split Cascade.
            </h1>
            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, margin: '0 0 32px 0' }}>
              TuneMavens gives podcasters, audio documentary creators, and talk show hosts a broadcast-grade ecosystem: -16 LUFS voice normalization, interactive chapter markers, synchronized transcripts, single-source ad rate cards, verified media kits, and automated host/producer splits.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/dashboard?role=podcaster&tab=podcaster-overview"
                className="btn-primary"
                style={{ padding: '12px 26px', background: '#00f2fe', borderColor: '#00f2fe', color: '#040711', fontSize: '14px', fontWeight: 800 }}
              >
                Launch Podcaster Studio <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
              </Link>
              <a
                href="#podcasts-showcase"
                className="btn-secondary"
                style={{ padding: '12px 22px', fontSize: '13.5px', color: '#fff', textDecoration: 'none' }}
              >
                Browse 12 Verified Shows
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Ribbon */}
      <section style={{ background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '36px 0' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#00f2fe', display: 'block', fontFamily: 'Sansation, sans-serif' }}>142K+</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Weekly Show Downloads</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#10b981', display: 'block', fontFamily: 'Sansation, sans-serif' }}>100%</span>
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Audited Ad Flight Delivery</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)', display: 'block', fontFamily: 'Sansation, sans-serif' }}>-16 LUFS</span>
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
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '4px', padding: '12px 18px', color: '#6ee7b7', display: 'flex', justifyContent: 'space-between' }}>
            <span>{tipNotice}</span>
            <button onClick={() => setTipNotice('')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      )}

      {/* Interactive 3x4 Grid of Podcasts Section */}
      <section id="podcasts-showcase" style={{ padding: '70px 0', background: '#050814', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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

      {/* Feature Section 1: Single Source of Truth Ad Rates */}
      <section style={{ padding: '70px 0', background: '#080c1d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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

      {/* Feature 2: Podcaster Studio Dashboard Preview */}
      <section style={{ padding: '70px 0', background: '#050814' }}>
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
              src={creatorDashboardActualEn} 
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
              Click to view high-resolution interactive dashboard preview
            </div>
          </div>
        </div>
      </section>

      {/* High-Resolution Screenshot Modal */}
      {previewModal && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '95vw', maxHeight: '95vh', overflow: 'auto', position: 'relative', background: '#090d1f', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
            <h3 style={{ color: '#fff', fontSize: '18px', margin: '0 0 14px 0' }}>TuneMavens Podcaster Studio A Actual System Interface</h3>
            <img src={creatorDashboardActualEn} alt="Actual System Screenshot" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
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
