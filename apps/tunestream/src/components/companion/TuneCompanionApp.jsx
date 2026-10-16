import React, { useState, useEffect } from 'react';
import { 
  RiLineChartFill, RiCoinsFill, RiCompass3Line, RiSparklingLine, 
  RiDatabase2Line, RiPlayFill, RiShieldCheckFill, RiSendPlaneFill, 
  RiFlashlightFill, RiSmartphoneLine, RiComputerLine, RiArrowRightLine,
  RiCheckDoubleLine, RiTimeLine, RiGlobalLine, RiExchangeDollarLine,
  RiMusicLine, RiUserStarFill, RiMoneyDollarCircleFill, RiArrowUpLine
} from 'react-icons/ri';
import tcLogo from '../../assets/tunecompanion-logo.png';
import { getUnifiedCatalog } from '../../data/authoritativeCatalog';

export default function TuneCompanionApp({ sessionUser, onPlayTrack, setActiveTab }) {
  const [tracks, setTracks] = useState(getUnifiedCatalog);
  const [selectedTrack, setSelectedTrack] = useState(tracks[0] || null);
  const [activeSubTab, setActiveSubTab] = useState('splits'); // 'splits' | 'payouts' | 'sync' | 'playbook' | 'telemetry'
  const [viewMode, setViewMode] = useState('full'); // 'full' | 'phone'
  const [cashoutSuccess, setCashoutSuccess] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState('2500');
  const [cashoutRail, setCashoutRail] = useState('mpesa'); // 'mpesa' | 'stripe'
  const [pitchedBriefId, setPitchedBriefId] = useState(null);

  // Sync with unified catalog updates
  useEffect(() => {
    const handleCatalogUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTracks(e.detail);
        if (!selectedTrack && e.detail.length > 0) {
          setSelectedTrack(e.detail[0]);
        }
      }
    };
    window.addEventListener('tunemavens:catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('tunemavens:catalog_updated', handleCatalogUpdate);
  }, [selectedTrack]);

  // Live tip feed
  const [tipsFeed, setTipsFeed] = useState([
    { id: 'tip_1', listener: 'Anonymous Fan (Nairobi)', track: 'Nairobi Cyberwave (Master)', amount: 5.00, time: '2m ago', splitNote: 'Artist: $3.00 (60%) · Producer: $1.25 (25%) · Label: $0.75 (15%)' },
    { id: 'tip_2', listener: 'Sarah M. (London)', track: 'Kilimanjaro Sunrise', amount: 10.00, time: '14m ago', splitNote: 'Artist: $7.00 (70%) · Producer: $2.00 (20%) · Label: $1.00 (10%)' },
    { id: 'tip_3', listener: 'David K. (New York)', track: 'Sunset over Rift Valley', amount: 5.00, time: '38m ago', splitNote: 'Artist: $3.00 (60%) · Producer: $1.25 (25%) · Label: $0.75 (15%)' },
    { id: 'tip_4', listener: 'Amani_Groove (Lagos)', track: 'Savanna Groove', amount: 5.00, time: '1h ago', splitNote: 'Artist: $2.75 (55%) · Producer: $1.50 (30%) · Label: $0.75 (15%)' },
  ]);

  // Active sync briefs radar
  const syncBriefs = [
    {
      id: 'brief_1',
      title: 'High-Tech Urban Chase Sequence',
      client: 'Netflix Sci-Fi Series',
      budget: '$18,500',
      matchScore: 98,
      matchedTrack: tracks[0] || { title: 'Nairobi Cyberwave (Master)' },
      deadline: '24 hours left',
      genre: 'Synthwave / Afrofuturism',
      description: 'Needs relentless driving 122 BPM bassline, sharp synth stabs, and cinematic tension for a high-speed electric car chase in neo-Nairobi.'
    },
    {
      id: 'brief_2',
      title: 'Summer Adventure Commercial Campaign',
      client: 'Automotive Global Brand',
      budget: '$45,000',
      matchScore: 94,
      matchedTrack: tracks[1] || { title: 'Kilimanjaro Sunrise' },
      deadline: '3 days left',
      genre: 'Afrobeats / Organic Groove',
      description: 'Warm, uplifting organic acoustic guitars and percussion. Conveying freedom, sunrise landscapes, and cross-continent exploration.'
    },
    {
      id: 'brief_3',
      title: 'Ethereal Drama Main Title & End Credits',
      client: 'A24 Independent Feature',
      budget: '$8,500',
      matchScore: 89,
      matchedTrack: tracks[6] || { title: 'Serengeti Dawn' },
      deadline: '5 days left',
      genre: 'Neo-Classical / Cinematic',
      description: 'Sublime atmospheric strings, soft kalimba accents, and emotional resonance. Must evoke natural beauty and poignant human connection.'
    }
  ];

  const handleCashout = (e) => {
    e.preventDefault();
    setCashoutSuccess(true);
    setTimeout(() => setCashoutSuccess(false), 4000);
  };

  const handlePitchTrack = (briefId) => {
    setPitchedBriefId(briefId);
    setTimeout(() => setPitchedBriefId(null), 3000);
  };

  return (
    <div className="tunecompanion-container" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Companion App Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '3px',
        padding: '24px 28px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={tcLogo} alt="TuneCompanion Logo" style={{ height: '42px', width: 'auto', display: 'block' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>TuneCompanion</h2>
              <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                LIVE ECOSYSTEM NODE
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0', maxWidth: '600px' }}>
              Your split ledger in your pocket. Real-time TuneLedger waterfall cascades, instant M-Pesa / Stripe cashout, live listener tips, and 1-tap sync pitching.
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Full Width vs Phone Shell Simulator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setViewMode('full')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: viewMode === 'full' ? '#a855f7' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RiComputerLine size={14} /> Expansive View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('phone')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: viewMode === 'phone' ? '#a855f7' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RiSmartphoneLine size={14} /> Pocket Phone Frame
          </button>
        </div>
      </div>

      {/* KPI Live Telemetry Ticker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Accrued Balance</span>
            <RiCoinsFill size={16} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>$12,450.00</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>≈ KSh 1,618,500 · Ready for Cashout</div>
        </div>

        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Fan Tips This Month</span>
            <RiMoneyDollarCircleFill size={16} style={{ color: '#ff007f' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>$840.00</div>
          <div style={{ fontSize: '11px', color: '#ff007f', marginTop: '4px' }}>168 direct listener tips on TuneStream</div>
        </div>

        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Sync Matches</span>
            <RiSparklingLine size={16} style={{ color: '#00f2fe' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#00f2fe' }}>3 Briefs &gt;90%</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>$72,000 Total sync placements pool</div>
        </div>

        <div style={{ background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Catalog</span>
            <RiDatabase2Line size={16} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#c084fc' }}>{tracks.length} Releases</div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>✓ 100% Lossless FLAC Transcoded</div>
        </div>
      </div>

      {/* Main Companion Body */}
      <div style={{
        maxWidth: viewMode === 'phone' ? '460px' : '100%',
        margin: viewMode === 'phone' ? '0 auto 40px' : '0 0 40px',
        border: viewMode === 'phone' ? '12px solid #1e293b' : 'none',
        borderRadius: viewMode === 'phone' ? '28px' : '0',
        boxShadow: viewMode === 'phone' ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)' : 'none',
        overflow: 'hidden',
        background: '#060813',
        transition: 'all 0.3s ease'
      }}>
        {/* Navigation Tabs Pill Bar */}
        <div style={{
          background: '#090c16',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 12px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'splits', label: 'Split Ledger', icon: RiLineChartFill, color: '#a855f7' },
            { id: 'payouts', label: 'Payouts & Tips', icon: RiCoinsFill, color: '#10b981' },
            { id: 'sync', label: 'Sync Radar', icon: RiCompass3Line, color: '#00f2fe' },
            { id: 'playbook', label: 'AI Playbook', icon: RiSparklingLine, color: '#f59e0b' },
            { id: 'telemetry', label: 'Catalog Telemetry', icon: RiDatabase2Line, color: '#ec4899' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '3px',
                border: 'none',
                background: activeSubTab === tab.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: activeSubTab === tab.id ? '#c084fc' : '#94a3b8',
                fontSize: '12px',
                fontWeight: activeSubTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={14} style={{ color: tab.color }} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Live Split Ledger */}
        {activeSubTab === 'splits' && (
          <div style={{ padding: '24px', background: '#090c16' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>TuneLedger 7-Tier Cascade Waterfall</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>Real-time micro-split calculations locked to verified ISRC split contracts.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Select Release:</span>
                <select
                  value={selectedTrack?.id || ''}
                  onChange={(e) => {
                    const found = tracks.find(t => t.id === Number(e.target.value));
                    if (found) setSelectedTrack(found);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '3px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  {tracks.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.artist})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedTrack && (
              <div>
                {/* Active Release Card */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <img src={selectedTrack.cover} alt={selectedTrack.title} style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{selectedTrack.title}</span>
                      <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                        {selectedTrack.isrc}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {selectedTrack.artist} · {selectedTrack.album} ({selectedTrack.year || '2026'}) · {selectedTrack.genre}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPlayTrack && onPlayTrack(selectedTrack)}
                    style={{
                      background: '#00f2fe',
                      color: '#000',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '8px 16px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RiPlayFill size={14} /> Listen
                  </button>
                </div>

                {/* 7-Tier Waterfall Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>GROSS STREAM INTAKE (All DSPs + TuneStream)</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>100% Gross Royalty Accumulator</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>$1,420.00</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>≈ KSh 184,600</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700 }}>TIER 1: PLATFORM ADMINISTRATION (10%)</span>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Intermaven Network Infrastructure &amp; Edge CDN</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#ef4444' }}>-$142.00</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Fixed statutory fee</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: 'rgba(168, 85, 247, 0.04)', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700 }}>TIER 2: MASTER / LABEL SHARE (Contractual 15%)</span>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ndufo Recordings Ltd Imprint Allocation</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc' }}>-$191.70</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>15% of Net Master</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: 'rgba(245, 158, 11, 0.04)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>TIER 3: ISOLATED RECOUPABLE PRODUCTION OFFSETS</span>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Zero cross-collateralization · Studio recording recoupment</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>$0.00 RECOUPED</span>
                      <div style={{ fontSize: '10px', color: '#10b981' }}>100% Recouped release</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>TIER 5: DYNAMIC COLLABORATOR DISTRIBUTIONS (Dynamic 100%)</span>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                        Split Cascade Agreement: <strong>{selectedTrack.splits}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#10b981' }}>$1,086.30</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Disbursed automatically to wallets</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Payouts & Tips Stream */}
        {activeSubTab === 'payouts' && (
          <div style={{ padding: '24px', background: '#090c16' }}>
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'phone' ? '1fr' : '1fr 1fr', gap: '20px' }}>
              {/* Instant Cashout Panel */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiExchangeDollarLine style={{ color: '#10b981' }} /> Instant Dual-Rail Cashout
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
                  Disburse your accrued royalties and tip earnings immediately to Safaricom M-Pesa or global bank account.
                </p>

                {cashoutSuccess && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '3px', color: '#10b981', fontSize: '12px', marginBottom: '14px' }}>
                    ✓ Disbursement initiated! Funds dispatched via {cashoutRail === 'mpesa' ? 'M-Pesa B2C instant wallet deposit' : 'Stripe Express direct bank transfer'}.
                  </div>
                )}

                <form onSubmit={handleCashout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Disbursement Rail</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setCashoutRail('mpesa')}
                        style={{
                          padding: '10px',
                          border: cashoutRail === 'mpesa' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                          background: cashoutRail === 'mpesa' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)',
                          color: '#fff',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        📱 M-Pesa (Kenya)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCashoutRail('stripe')}
                        style={{
                          padding: '10px',
                          border: cashoutRail === 'stripe' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                          background: cashoutRail === 'stripe' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(0,0,0,0.3)',
                          color: '#fff',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        🌐 Stripe Express (Global)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>Amount (USD)</label>
                    <input
                      type="number"
                      value={cashoutAmount}
                      onChange={(e) => setCashoutAmount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Available for cashout: <strong>$12,450.00</strong> · Zero transaction fee
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      marginTop: '6px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm &amp; Disburse ${Number(cashoutAmount).toLocaleString()}
                  </button>
                </form>
              </div>

              {/* Live Fan Tip Feed */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiMoneyDollarCircleFill style={{ color: '#ff007f' }} /> Real-Time Fan Tip Stream
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
                  Live micro-tipping direct from listeners streaming on TuneStream.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tipsFeed.map(tip => (
                    <div key={tip.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{tip.listener}</span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>+${tip.amount.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#00f2fe', marginTop: '2px' }}>{tip.track} · <span style={{ color: '#64748b' }}>{tip.time}</span></div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>{tip.splitNote}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sync Radar (SyncMavens Live) */}
        {activeSubTab === 'sync' && (
          <div style={{ padding: '24px', background: '#090c16' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>Sync Briefs Pitch Radar</h3>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>Live pre-cleared briefs posted by TV, film, and commercial supervisors on SyncMavens.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('sync-marketplace')}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: '3px',
                  color: '#00f2fe',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                Open Full Marketplace &rarr;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {syncBriefs.map(brief => (
                <div key={brief.id} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  padding: '18px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{brief.title}</span>
                        <span style={{ background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                          {brief.matchScore}% AI MATCH
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: 600, marginTop: '2px' }}>
                        Client: {brief.client} · Deadline: <span style={{ color: '#f59e0b' }}>{brief.deadline}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{brief.budget}</span>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>One-Stop Clearance</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5', margin: '12px 0 14px' }}>
                    {brief.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Recommended Pitch: <strong style={{ color: '#fff' }}>{brief.matchedTrack.title}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePitchTrack(brief.id)}
                      disabled={pitchedBriefId === brief.id}
                      style={{
                        background: pitchedBriefId === brief.id ? '#10b981' : '#00f2fe',
                        color: '#000',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '6px 14px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {pitchedBriefId === brief.id ? <><RiCheckDoubleLine size={14} /> Brief Pitched!</> : <><RiSendPlaneFill size={14} /> 1-Tap Pitch Track</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI Release Strategy Playbook */}
        {activeSubTab === 'playbook' && (
          <div style={{ padding: '24px', background: '#090c16' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>AI Release Strategy &amp; Rollout Playbook</h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 20px' }}>Algorithmic timing, editorial pitch generation, and cross-platform campaign strategy.</p>

            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'phone' ? '1fr' : '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase' }}>Optimal Release Window</span>
                <h4 style={{ fontSize: '15px', color: '#fff', margin: '6px 0 8px' }}>Friday, 00:00 GMT+3 (Nairobi Node)</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                  Maximizes first-24h algorithm triggers across East African edge nodes, synchronizing with UK (21:00 Thu) and US East Coast (16:00 Thu) weekend listening playlists.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
                <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 800, textTransform: 'uppercase' }}>Editorial DSP Pitch Blurb</span>
                <h4 style={{ fontSize: '15px', color: '#fff', margin: '6px 0 8px' }}>Curator Ready Pitch</h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: 0 }}>
                  "Nairobi Cyberwave merges underground East African Afro-House rhythms with futuristic synthwave aesthetics, certified 100% lossless FLAC."
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px', gridColumn: viewMode === 'phone' ? '1' : '1 / -1' }}>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>Social Audio Drop Milestones</span>
                <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'phone' ? '1fr' : 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                  <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>T-7 Days: Teaser Clip</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>15s TikTok hook preview with mother EPK link.</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>Day 0: Premiere Stream</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>TuneStream lossless live radio feature + fan tipping drive.</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px' }}>
                    <div style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>T+3 Days: Stems Drop</div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Pre-cleared sync brief dispatch on SyncMavens.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Catalog Telemetry */}
        {activeSubTab === 'telemetry' && (
          <div style={{ padding: '24px', background: '#090c16' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Unified Music &amp; Content Repository ({tracks.length} Releases)</h3>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 16px' }}>Shared across TuneMavens, TuneStream, and SyncMavens backends in real time.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tracks.map((t, idx) => (
                <div key={t.id} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', width: '16px' }}>{idx + 1}</span>
                    <img src={t.cover} alt={t.title} style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.artist} · {t.album} · {t.genre}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '11px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)', padding: '2px 8px', borderRadius: '3px' }}>
                      {t.splits}
                    </span>
                    <span style={{ fontSize: '11px', color: '#00f2fe' }}>{t.plays} streams</span>
                    <button
                      type="button"
                      onClick={() => onPlayTrack && onPlayTrack(t)}
                      style={{
                        background: '#00f2fe',
                        color: '#000',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <RiPlayFill size={13} /> Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
