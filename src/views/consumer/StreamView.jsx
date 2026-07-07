import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Smartphone } from 'lucide-react'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerHelpImg from '../../assets/images/header_help.png'
import headerHelpWesternImg from '../../assets/images/header_help_western.png'

export default function StreamView() {
  const { country, formatPrice } = useRegion();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(12); // start at 12s
  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress(prev => (prev >= 180 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isWestern = ['US', 'GB'].includes(country);

  return (
    <>
      <PageHeader 
        title="TuneMavens Stream" 
        bgImage={headerHelpImg} 
        bgImageWestern={headerHelpWesternImg} 
        breadcrumb="Stream & Listen" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Welcome to the next-generation consumer music app. Stream ad-free, download high-quality files, and support creators directly using your shared credits vault.
        </p>

        {/* Web ⇄ native parity banner */}
        <div className="stream-app-banner" data-testid="stream-app-banner">
          <div className="stream-app-banner-text">
            <span className="stream-app-banner-eyebrow">Prefer mobile?</span>
            <span className="stream-app-banner-title">This is the web build of the TuneStream listener app.</span>
            <span className="stream-app-banner-sub">Same library, same tips, same account  -  just sized for your pocket.</span>
          </div>
          <Link to="/native-apps/tunestream" className="stream-app-banner-cta" data-testid="stream-app-banner-cta">
            <Smartphone size={14} /> Get the native app
          </Link>
        </div>

        {/* Dynamic Music Player Widget Mockup */}
        <div className="arch-card glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center', maxWidth: '850px', margin: '0 auto 60px', padding: '30px' }}>
          
          {/* Cover Art Visual */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '64px', marginBottom: '12px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>💿</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>Midnight Cruise</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Alex Rivera</p>
            </div>
            {isPlaying && (
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '16px' }}>
                {[1, 2, 3, 4, 5].map(bar => (
                  <div 
                    key={bar} 
                    style={{ 
                      width: '3px', 
                      background: 'var(--cyan)', 
                      borderRadius: '1px',
                      animation: `bounce 1s ease-in-out infinite alternate`,
                      animationDelay: `${bar * 0.15}s`,
                      height: '100%'
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Player controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div>
              <span className="app-tag" style={{ color: 'var(--cyan)', background: 'rgba(34,211,238,0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Lossless FLAC • 24-bit / 96kHz
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginTop: '10px', marginBottom: '4px' }}>Midnight Cruise</h2>
              <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0 }}>Alex Rivera • Afrobeat Mix</p>
            </div>

            {/* Slider bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--mu)', marginBottom: '6px' }}>
                <span>{formatTime(playerProgress)}</span>
                <span>3:00</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }} onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                setPlayerProgress(Math.floor(percentage * 180));
              }}>
                <div style={{ width: `${(playerProgress / 180) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px', boxShadow: '0 0 6px var(--cyan)' }} />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary"
                style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', outline: 'none' }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                  {isPlaying ? 'Now Streaming Lossless' : 'Stream Preview'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--mu)' }}>
                  {isWestern ? '1 credit per full listen' : '0.1 credits per listen'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Value Proposition Cards */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h2 className="section-title">Why Stream on TuneMavens?</h2>
          <p className="section-desc">Designed to solve streaming royalty inequalities for creators while delivering premium listening features.</p>
        </div>

        <div className="apps-grid" style={{ marginBottom: '60px' }}>
          
          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(34,211,238,0.08)', color: 'var(--cyan)' }}>🎛️</div>
            <h3 className="app-title">Lossless Studio Masters</h3>
            <p className="app-desc">Stream direct 24-bit FLAC audio. No lossy compression, no degraded soundstages. Experience music the way the producer intended.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)' }}>🛡️</div>
            <h3 className="app-title">100% Ad-Free Experience</h3>
            <p className="app-desc">Zero audio ads, zero pop-up banners. We protect your attention. Your subscription credits route payments entirely to songs you play.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(139,92,246,0.08)', color: 'var(--purple)' }}>🤝</div>
            <h3 className="app-title">Direct Creator Support</h3>
            <p className="app-desc">TuneMavens routes 90% of listen credits straight to the artist's wallet. Zero middleman distribution delays, direct payments via M-Pesa or Stripe.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--orange)' }}>🛍️</div>
            <h3 className="app-title">Linked Artist Stores</h3>
            <p className="app-desc">Buy downloads, exclusive vinyl, digital stems, and merch directly inside the player console. One unified credits vault across all platforms.</p>
          </div>

        </div>

        {/* CTA Onboard Area */}
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--r)', maxWidth: '700px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Start Listening Today</h3>
          <p style={{ fontSize: '13px', color: 'var(--mu)', marginBottom: '24px' }}>
            Register as a Consumer to configure your genre settings and follow your first creators. Sign up grants 150 free credits!
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register?role=consumer')} className="btn-primary" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
              Create Listener Account
            </button>
            <button onClick={() => navigate('/register')} className="plan-btn outline" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
              Select Other Role
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
