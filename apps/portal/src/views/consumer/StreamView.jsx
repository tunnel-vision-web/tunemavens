import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiSmartphoneFill } from 'react-icons/ri'
import { useRegion } from '../../RegionContext.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'

import headerHelpImg from '../../assets/images/header_help.png'
import headerHelpWesternImg from '../../assets/images/header_help_western.png'

export default function StreamView({ 
  catalogTracks = [], 
  sessionUser, 
  deductCredits, 
  addLedgerRow,
  globalTrack,
  setGlobalTrack,
  globalPlaying,
  setGlobalPlaying,
  globalProgress,
  setGlobalProgress
}) {
  const { country } = useRegion();
  const navigate = useNavigate();

  // Tipping states
  const [tipVal, setTipVal] = useState(50);
  const [tipSuccess, setTipSuccess] = useState(null);
  const [tipError, setTipError] = useState('');

  // Reset tipping status when active track changes
  useEffect(() => {
    setTipSuccess(null);
    setTipError('');
  }, [globalTrack]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendTip = (e) => {
    e.preventDefault();
    setTipSuccess(null);
    setTipError('');

    if (!sessionUser) {
      setTipError('Please login or register to support creators with your credits wallet.');
      return;
    }

    if (!globalTrack) {
      setTipError('No track selected to tip.');
      return;
    }

    const amount = Number(tipVal);
    if (isNaN(amount) || amount <= 0) {
      setTipError('Please enter a valid positive credits amount.');
      return;
    }

    const currentBal = sessionUser.credits || 0;
    if (currentBal < amount) {
      setTipError(`Insufficient credit balance. You have ${currentBal} credits (needed ${amount}).`);
      return;
    }

    // Call global credit helper
    const ok = deductCredits(amount);
    if (!ok) {
      setTipError('Failed to process wallet transaction. Insufficient credits.');
      return;
    }

    // Parse splits percentages from globalTrack.split string
    const artistMatch = globalTrack.split.match(/Artist\s*\((\d+)%\)/i);
    const producerMatch = globalTrack.split.match(/(?:Producer|Manager)\s*\((\d+)%\)/i);
    const labelMatch = globalTrack.split.match(/Label\s*\((\d+)%\)/i);

    const artistPct = artistMatch ? Number(artistMatch[1]) : 50;
    const producerPct = producerMatch ? Number(producerMatch[1]) : 30;
    const labelPct = labelMatch ? Number(labelMatch[1]) : 20;

    // Platform Fee commission (10%)
    const platformComm = amount * 0.10;
    const cascadeTotal = amount - platformComm;

    // Calculate splits allocations
    const artistAlloc = cascadeTotal * (artistPct / 100);
    const producerAlloc = cascadeTotal * (producerPct / 100);
    const labelAlloc = cascadeTotal * (labelPct / 100);

    // Call global ledger row builder
    addLedgerRow({
      id: `tx_tip_${Date.now().toString().slice(-4)}`,
      title: `Tip: ${globalTrack.title}`,
      gross: amount,
      comm: platformComm,
      label: labelAlloc,
      artist: artistAlloc,
      manager: producerAlloc,
      net: cascadeTotal,
      status: 'processed'
    });

    setTipSuccess({
      amount,
      comm: platformComm,
      artist: artistAlloc,
      producer: producerAlloc,
      label: labelAlloc,
      artistPct,
      producerPct,
      labelPct,
      creatorName: globalTrack.artist
    });
  };

  const isWestern = ['US', 'GB'].includes(country);
  const currentCredits = sessionUser?.credits ?? 0;

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
            <RiSmartphoneFill size={14} /> Get the native app
          </Link>
        </div>

        {/* Main Columns layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto 60px' }}>
          
          {/* Left Column: Player & Tipping */}
          <div>
            {globalTrack ? (
              <div className="arch-card glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Cover Art Visual */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  paddingBottom: '100%', 
                  background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', 
                  borderRadius: 'var(--r)', 
                  overflow: 'hidden', 
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                  transition: 'background 0.5s ease'
                }}>
                  {/* Vinyl Groove Rings Overlay */}
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', border: '6px double rgba(255,255,255,0.05)', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '9px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', padding: '4px 8px', borderRadius: '3px', backdropFilter: 'blur(4px)' }}>
                        Studio Master
                      </span>
                      <span style={{ fontSize: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>💿</span>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '48px', fontWeight: '900', display: 'block', lineHeight: '1', fontFamily: '"Outfit", sans-serif', letterSpacing: '-1px', opacity: 0.15, marginBottom: '-8px' }}>
                        {globalTrack.coverText || 'ALBUM'}
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 4px', letterSpacing: '-0.3px', lineHeight: '1.2' }}>{globalTrack.title}</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: '500' }}>{globalTrack.artist}</p>
                    </div>
                  </div>

                  {globalPlaying && (
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

                {/* Player Controls */}
                <div style={{ textAlign: 'left' }}>
                  <span className="app-tag" style={{ color: 'var(--cyan)', background: 'rgba(34,211,238,0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Lossless FLAC • 24-bit / 96kHz
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '10px', marginBottom: '4px' }}>{globalTrack.title}</h2>
                  <p style={{ fontSize: '12px', color: 'var(--mu)', margin: 0 }}>{globalTrack.artist} • {globalTrack.genre}</p>
                </div>

                {/* Slider Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--mu)', marginBottom: '6px' }}>
                    <span>{formatTime(globalProgress)}</span>
                    <span>3:00</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }} onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    setGlobalProgress(Math.floor(percentage * 180));
                  }}>
                    <div style={{ width: `${(globalProgress / 180) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px', boxShadow: '0 0 6px var(--cyan)' }} />
                  </div>
                </div>

                {/* Play/Pause Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left' }}>
                  <button 
                    onClick={() => setGlobalPlaying(!globalPlaying)}
                    className="btn-primary"
                    style={{ width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', outline: 'none', border: 'none' }}
                  >
                    {globalPlaying ? '⏸' : '▶'}
                  </button>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                      {globalPlaying ? 'Now Streaming Lossless' : 'Stream Preview'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--mu)' }}>
                      {isWestern ? '1 credit per full listen' : '0.1 credits per listen'}
                    </div>
                  </div>
                </div>

                {/* Splits breakdown notice */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', textAlign: 'left' }}>
                  <span style={{ display: 'block', color: 'var(--mu)', marginBottom: '4px', fontWeight: 'bold' }}>Associated Split cascade structures:</span>
                  <span style={{ color: '#fff', fontFamily: 'monospace' }}>{globalTrack.split}</span>
                </div>

              </div>
            ) : (
              <div className="arch-card glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--mu)' }}>
                No songs available to stream. Add tracks inside the dashboard catalog.
              </div>
            )}
          </div>

          {/* Right Column: Ingested Catalogue Selector & Tipping Cascade Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Catalogue Selector */}
            <div className="dashboard-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff', textAlign: 'left' }}>Ingested Catalogue Select</h3>
              {catalogTracks.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', fontSize: '12px', color: 'var(--mu)' }}>
                  No catalogue tracks found.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {catalogTracks.map((tr) => (
                    <div 
                      key={tr.isrc}
                      onClick={() => setGlobalTrack(tr)}
                      style={{
                        padding: '10px 14px',
                        background: globalTrack?.isrc === tr.isrc ? 'rgba(34, 211, 238, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: globalTrack?.isrc === tr.isrc ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '3px',
                        background: tr.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '7px',
                        color: '#fff',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                        overflow: 'hidden',
                        padding: '2px',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {tr.coverText || 'Art'}
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '12px' }}>{tr.title}</strong>
                        <span style={{ fontSize: '10.5px', color: 'var(--mu)' }}>{tr.artist} • {tr.isrc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support Cascade tip uploader */}
            {globalTrack && (
              <div className="dashboard-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff', textAlign: 'left' }}>⚡ Support Creator (Split Cascade Tip)</h3>
                
                {sessionUser ? (
                  <form onSubmit={handleSendTip} style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--mu)', marginBottom: '8px' }}>
                      <span>Sender Vault balance:</span>
                      <strong style={{ color: 'var(--cyan)' }}>{currentCredits} credits</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input 
                        type="number" 
                        min="1"
                        value={tipVal}
                        onChange={(e) => setTipVal(e.target.value)}
                        className="form-control"
                        placeholder="Tip amount"
                        style={{ flex: 1, padding: '8px', fontSize: '13px' }}
                        required
                      />
                      <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ padding: '0 16px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Send Tip
                      </button>
                    </div>

                    {tipError && (
                      <div style={{ color: '#ef4444', fontSize: '11px', marginBottom: '10px' }}>
                        ⚠️ {tipError}
                      </div>
                    )}

                    {tipSuccess && (
                      <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', padding: '12px', borderRadius: '4px', fontSize: '11.5px' }}>
                        <span style={{ display: 'block', color: 'var(--green)', fontWeight: 'bold', marginBottom: '6px' }}>✓ Transaction Cascade Successful!</span>
                        <p style={{ margin: '0 0 6px 0', color: '#cbd5e1' }}>
                          Tipped <strong>{tipSuccess.amount} credits</strong> to <strong>{tipSuccess.creatorName}</strong>. Platform commission fee (10%) deducted.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', fontFamily: 'monospace', fontSize: '10.5px', color: '#94a3b8' }}>
                          <div>Commission (10%): {tipSuccess.comm.toFixed(1)} cr</div>
                          {tipSuccess.artistPct > 0 && <div>Artist ({tipSuccess.artistPct}%): {tipSuccess.artist.toFixed(1)} cr</div>}
                          {tipSuccess.producerPct > 0 && <div>Producer ({tipSuccess.producerPct}%): {tipSuccess.producer.toFixed(1)} cr</div>}
                          {tipSuccess.labelPct > 0 && <div>Label ({tipSuccess.labelPct}%): {tipSuccess.label.toFixed(1)} cr</div>}
                        </div>
                        <span style={{ display: 'block', color: 'var(--cyan)', marginTop: '8px', fontSize: '10.5px' }}>
                          ℹ️ Checked logs added to Split Cascade ledger tab.
                        </span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px 0', fontSize: '12px', color: 'var(--mu)' }}>
                    <p style={{ margin: '0 0 10px 0' }}>Please log in to support creators with your credits wallet.</p>
                    <button 
                      onClick={() => navigate('/login')} 
                      className="plan-btn outline"
                      style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Log In
                    </button>
                  </div>
                )}

              </div>
            )}
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
