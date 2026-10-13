import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  RiArrowLeftLine, 
  RiArrowRightLine, 
  RiExternalLinkLine, 
  RiBarChartFill, 
  RiGlobalFill, 
  RiGlobalLine, 
  RiCheckLine, 
  RiCheckDoubleLine, 
  RiShieldCheckFill, 
  RiTimeLine, 
  RiSearchLine, 
  RiMusic2Fill, 
  RiUploadCloud2Line, 
  RiDiscFill, 
  RiFileCopyLine, 
  RiRefreshLine,
  RiCloseLine,
  RiFileTextLine,
  RiCheckFill
} from 'react-icons/ri'
import { SiSpotify, SiApplemusic, SiTiktok, SiTidal, SiDeezer, SiYoutube } from 'react-icons/si'
import { FaAmazon } from 'react-icons/fa'

export default function DistributionTrackerApp({ goBack, sessionUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRelease, setSelectedRelease] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const releases = [
    {
      id: 'rel-1',
      title: 'Midnight Drifter',
      version: 'Extended Club Mix',
      artist: 'Ndufo ft. Sarah Jensen',
      album: 'Subway Sessions Vol. 1',
      isrc: 'US-TM8-24-00192',
      upc: '198273641029',
      releaseDate: 'Nov 14, 2024',
      status: 'live',
      statusLabel: 'Live Worldwide',
      progress: 100,
      audioFormat: '24-bit / 48kHz WAV',
      lufs: '-14.1 LUFS',
      stores: [
        { name: 'Spotify', status: 'Live', time: '18m ago' },
        { name: 'Apple Music', status: 'Live', time: '22m ago' },
        { name: 'Amazon Music', status: 'Live', time: '35m ago' },
        { name: 'TikTok', status: 'Synced', time: '1h ago' },
        { name: 'Boomplay', status: 'Live', time: '40m ago' },
      ],
      streams: '142,850 streams',
      smartLink: 'https://tunemavens.com/link/midnight-drifter',
      ddexBatch: 'DDEX-BATCH-2024-11-TM-99481',
      ddexAck: 'DSP-ACK-ALL-STORES-PASSED'
    },
    {
      id: 'rel-2',
      title: 'Starlight Anthem',
      version: 'Radio Edit',
      artist: 'Elena Vance',
      album: 'Constellations',
      isrc: 'GB-TM8-24-00481',
      upc: '198273641036',
      releaseDate: 'Nov 21, 2024',
      status: 'scheduled',
      statusLabel: 'Scheduled Drop',
      progress: 95,
      audioFormat: '24-bit / 96kHz Hi-Res FLAC',
      lufs: '-13.9 LUFS',
      stores: [
        { name: 'Spotify', status: 'Scheduled', time: 'Pre-Save Active' },
        { name: 'Apple Music', status: 'Scheduled', time: 'Ready' },
        { name: 'Amazon Music', status: 'Scheduled', time: 'Ready' },
        { name: 'TikTok', status: 'Ready', time: 'Sound Hook Verified' },
        { name: 'Boomplay', status: 'Scheduled', time: 'Ready' },
      ],
      streams: '1,420 Pre-Saves',
      smartLink: 'https://tunemavens.com/link/starlight-anthem',
      ddexBatch: 'DDEX-BATCH-2024-11-TM-99512',
      ddexAck: 'DSP-PRE-RELEASE-EMBARGO-ACTIVE'
    },
    {
      id: 'rel-3',
      title: 'Echoes in Berlin',
      version: 'Dub Techno VIP',
      artist: 'Marcus Sterling',
      album: 'Kreuzberg Nights',
      isrc: 'DE-TM8-24-00712',
      upc: '198273641043',
      releaseDate: 'Nov 28, 2024',
      status: 'processing',
      statusLabel: 'DSP Transcoding',
      progress: 75,
      audioFormat: '24-bit / 44.1kHz WAV',
      lufs: '-14.0 LUFS',
      stores: [
        { name: 'Spotify', status: 'Transcoding', time: 'In Pipeline' },
        { name: 'Apple Music', status: 'Transcoding', time: 'Atmos Verification' },
        { name: 'Amazon Music', status: 'Queued', time: 'Pending Batch' },
        { name: 'TikTok', status: 'Transcoding', time: 'Stem Generation' },
        { name: 'Boomplay', status: 'Queued', time: 'Pending Batch' },
      ],
      streams: 'Pending Ingestion',
      smartLink: 'https://tunemavens.com/link/echoes-in-berlin',
      ddexBatch: 'DDEX-BATCH-2024-11-TM-99604',
      ddexAck: 'DSP-QC-TRANSLATE-IN-PROGRESS'
    },
    {
      id: 'rel-4',
      title: 'Nairobi Sunset',
      version: 'Acoustic Afro-Soul',
      artist: 'Amani Wanjiku',
      album: 'Rift Valley Chords',
      isrc: 'KE-TM8-24-01053',
      upc: '198273641050',
      releaseDate: 'Dec 05, 2024',
      status: 'processing',
      statusLabel: 'Metadata Verification',
      progress: 55,
      audioFormat: '24-bit / 48kHz WAV',
      lufs: '-14.2 LUFS',
      stores: [
        { name: 'Spotify', status: 'Validating', time: 'ISRC Match' },
        { name: 'Apple Music', status: 'Validating', time: 'Lyrics Verification' },
        { name: 'Amazon Music', status: 'Pending', time: 'Awaiting Batch' },
        { name: 'TikTok', status: 'Pending', time: 'Awaiting Batch' },
        { name: 'Boomplay', status: 'Validating', time: 'ISRC Match' },
      ],
      streams: 'Awaiting Verification',
      smartLink: 'https://tunemavens.com/link/nairobi-sunset',
      ddexBatch: 'DDEX-BATCH-2024-11-TM-99720',
      ddexAck: 'DDEX-METADATA-VALIDATING'
    }
  ];

  const filteredReleases = releases.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.isrc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.album.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && r.status === statusFilter;
  });

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const primaryActionUrl = sessionUser 
    ? "/dashboard?tab=distribution-election" 
    : "/register?role=creator";

  return (
    <div style={{ width: '100%' }}>
      {/* Back button */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={goBack} 
          className="btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
        >
          <RiArrowLeftLine size={16} /> Back to Dashboard Apps
        </button>
      </div>

      {/* Hero Glass Panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '36px 32px', 
          borderRadius: '12px', 
          border: '1px solid rgba(245, 158, 11, 0.25)', 
          marginBottom: '32px',
          background: 'radial-gradient(ellipse at top left, rgba(245, 158, 11, 0.08), rgba(6, 8, 19, 0.6) 70%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#f59e0b', display: 'block', marginBottom: '8px' }}>
              GLOBAL DSP INGEST &amp; METRICS
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
              Distribution Tracker &amp; DSP Ingestion Monitor
            </h2>
            <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '720px', margin: 0, lineHeight: 1.6 }}>
              Monitor real-time ingest progression, scheduled drop dates, store status, and daily stream telemetry across 150+ digital service providers including Spotify, Apple Music, TikTok, Amazon Music, and Boomplay.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link 
              to={primaryActionUrl} 
              className="btn-primary" 
              style={{ padding: '10px 22px', fontSize: '13px', background: '#f59e0b', color: '#000', fontWeight: 700 }}
            >
              Launch Distribution Console <RiArrowRightLine size={14} style={{ marginLeft: '4px' }} />
            </Link>
            <Link to="/distribution" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              Explore All 150+ DSPs
            </Link>
            <Link to="/for/label" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
              Label Ingest Specs
            </Link>
          </div>
        </div>

        {/* Real-time Telemetry KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Ingested Tracks</span>
              <RiBarChartFill size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>18,420</div>
            <span style={{ fontSize: '11.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              ▲ +14.2% catalog growth
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Verified Ingest Rate</span>
              <RiCheckDoubleLine size={18} style={{ color: '#10b981' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk, sans-serif' }}>99.98%</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              &lt;24h DSP turnaround SLA
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Connected DSP Stores</span>
              <RiGlobalFill size={18} style={{ color: 'var(--cyan)' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'Space Grotesk, sans-serif' }}>154 Stores</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Direct DDEX 3.3 XML pipes
            </span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--mu)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Metadata Integrity</span>
              <RiShieldCheckFill size={18} style={{ color: '#a855f7' }} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>0.00% Errors</div>
            <span style={{ fontSize: '11.5px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Lossless 24-bit audio &amp; ISRC QC
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Live Ingestion Tracker Table */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Sansation, sans-serif' }}>
              Live Release Pipeline &amp; DSP Verification
            </h3>
            <p style={{ color: 'var(--mu)', fontSize: '13px', margin: 0 }}>
              Search across recent track drops or filter by ingestion lifecycle state. Click any row to inspect the DDEX audit log.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Filter buttons */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { key: 'all', label: 'All Releases' },
                { key: 'live', label: 'Live (1)' },
                { key: 'scheduled', label: 'Scheduled (1)' },
                { key: 'processing', label: 'In Progress (2)' }
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setStatusFilter(f.key)}
                  style={{
                    background: statusFilter === f.key ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: statusFilter === f.key ? '#f59e0b' : 'var(--mu)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '220px' }}>
              <RiSearchLine size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--mu)' }} />
              <input
                type="text"
                placeholder="Search track, ISRC, artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '7px 12px 7px 32px',
                  color: '#fff',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Releases Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--mu)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                <th style={{ padding: '12px 14px' }}>Release &amp; Artist</th>
                <th style={{ padding: '12px 14px' }}>ISRC &amp; Format</th>
                <th style={{ padding: '12px 14px' }}>Release Date</th>
                <th style={{ padding: '12px 14px' }}>Store States</th>
                <th style={{ padding: '12px 14px' }}>Ingest Progress</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Inspection</th>
              </tr>
            </thead>
            <tbody>
              {filteredReleases.map((r) => {
                const isSelected = selectedRelease?.id === r.id;
                const statusBadgeBg = r.status === 'live' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : (r.status === 'scheduled' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(245, 158, 11, 0.15)');
                const statusBadgeColor = r.status === 'live' 
                  ? '#10b981' 
                  : (r.status === 'scheduled' ? 'var(--cyan)' : '#f59e0b');

                return (
                  <tr 
                    key={r.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.04)', 
                      background: isSelected ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                          <RiDiscFill size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{r.title}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{r.artist} · <span style={{ color: '#94a3b8' }}>{r.version}</span></div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--cyan)' }}>{r.isrc}</div>
                      <div style={{ fontSize: '11px', color: 'var(--mu)', marginTop: '2px' }}>{r.audioFormat} ({r.lufs})</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{r.releaseDate}</div>
                      <div style={{ fontSize: '11px', color: 'var(--mu)' }}>{r.streams}</div>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {r.stores.map((s, idx) => (
                          <span 
                            key={idx}
                            title={`${s.name}: ${s.status} (${s.time})`}
                            style={{ 
                              fontSize: '10.5px', 
                              padding: '2px 6px', 
                              borderRadius: '3px', 
                              background: s.status === 'Live' ? 'rgba(16, 185, 129, 0.12)' : (s.status === 'Scheduled' || s.status === 'Ready' ? 'rgba(34, 211, 238, 0.12)' : 'rgba(245, 158, 11, 0.12)'),
                              color: s.status === 'Live' ? '#10b981' : (s.status === 'Scheduled' || s.status === 'Ready' ? 'var(--cyan)' : '#f59e0b'),
                              fontWeight: 600 
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '14px', minWidth: '150px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '2px', background: statusBadgeBg, color: statusBadgeColor, fontWeight: 700 }}>
                          {r.statusLabel}
                        </span>
                        <span style={{ fontSize: '11px', color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                          {r.progress}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${r.progress}%`, 
                            height: '100%', 
                            background: r.progress === 100 ? '#10b981' : '#f59e0b',
                            transition: 'width 0.4s ease'
                          }} 
                        />
                      </div>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedRelease(isSelected ? null : r)}
                        style={{
                          background: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                          color: isSelected ? '#000' : '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '4px',
                          padding: '6px 12px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <RiFileTextLine size={13} /> {isSelected ? 'Close Log' : 'Inspect DDEX'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Release Inspector Drawer */}
        {selectedRelease && (
          <div 
            style={{ 
              marginTop: '20px', 
              padding: '20px', 
              borderRadius: '8px', 
              background: 'rgba(6, 8, 19, 0.7)', 
              border: '1px solid rgba(245, 158, 11, 0.3)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  DDEX 3.3 Electronic Delivery Receipt · {selectedRelease.title}
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '3px' }}>
                  ✓ Ingest Verified
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedRelease(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--mu)', cursor: 'pointer' }}
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px', fontSize: '12px' }}>
              <div>
                <span style={{ color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Batch Identifier:</span>
                <code style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{selectedRelease.ddexBatch}</code>
              </div>
              <div>
                <span style={{ color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>DSP Ingestion Status:</span>
                <code style={{ color: '#10b981', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{selectedRelease.ddexAck}</code>
              </div>
              <div>
                <span style={{ color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>UPC / Barcode:</span>
                <code style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{selectedRelease.upc}</code>
              </div>
              <div>
                <span style={{ color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Spectrogram Compliance:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Passed True Peak -0.1dBTP ({selectedRelease.lufs})</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiGlobalLine size={18} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: '12.5px', color: '#fff' }}>Universal SmartLink:</span>
                <a 
                  href={selectedRelease.smartLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--cyan)', fontSize: '12.5px', textDecoration: 'underline' }}
                >
                  {selectedRelease.smartLink}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyLink(selectedRelease.smartLink)}
                  className="btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedLink ? <RiCheckFill size={14} style={{ color: '#10b981' }} /> : <RiFileCopyLine size={14} />}
                  {copiedLink ? 'Copied!' : 'Copy SmartLink'}
                </button>
                <Link
                  to={primaryActionUrl}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px', background: '#f59e0b', color: '#000', fontWeight: 700 }}
                >
                  Manage Rights in Console
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Core Distribution Capabilities Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#f59e0b', marginBottom: '12px' }}><RiUploadCloud2Line size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>DDEX 3.3 Automated Delivery</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Direct machine-to-machine batch XML/DDEX delivery pipeline straight to DSP ingestion buckets with zero third-party intermediary markup.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'var(--cyan)', marginBottom: '12px' }}><RiBarChartFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Daily Geographic Stream Telemetry</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Ingest daily stream metrics, playlist adds, and country-level listener counts directly mapped to your Split Cascade Ledger.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#10b981', marginBottom: '12px' }}><RiShieldCheckFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Lossless Master &amp; Atmos QC</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Automated bit-depth validation, dynamic range compliance, and peak loudness checks (-14 LUFS standard) ensuring zero rejection rates.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px 22px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#a855f7', marginBottom: '12px' }}><RiGlobalFill size={26} /></div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Pre-Save &amp; SmartLink Engine</h4>
          <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0, lineHeight: 1.6 }}>
            Instant localized pre-save landing pages with automated Spotify, Apple Music, and Amazon Music pre-order triggers.
          </p>
        </div>
      </div>

      {/* Supported DSP Showcase */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            GLOBAL REACH · 150+ DESTINATIONS
          </span>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 8px', fontFamily: 'Sansation, sans-serif' }}>
            Supported Digital Service Providers
          </h3>
          <p style={{ color: 'var(--mu)', fontSize: '13.5px', margin: 0 }}>
            Every release is delivered simultaneously to all global stores with 100% direct royalties retention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
          {[
            { name: 'Spotify', icon: <SiSpotify size={24} style={{ color: '#1db954' }} />, note: '24-48h Delivery' },
            { name: 'Apple Music', icon: <SiApplemusic size={24} style={{ color: '#fc3c44' }} />, note: 'Spatial & Lossless' },
            { name: 'YouTube Music', icon: <SiYoutube size={24} style={{ color: '#ff0000' }} />, note: 'Art Track Sync' },
            { name: 'Amazon Music', icon: <FaAmazon size={24} style={{ color: '#ff9900' }} />, note: 'Alexa Voice Ready' },
            { name: 'TikTok', icon: <SiTiktok size={22} style={{ color: '#fff' }} />, note: 'Social Sound Sync' },
            { name: 'Tidal', icon: <SiTidal size={22} style={{ color: '#fff' }} />, note: 'Hi-Res FLAC' },
            { name: 'Deezer', icon: <SiDeezer size={22} style={{ color: '#ff007f' }} />, note: 'Global Footprint' },
            { name: 'Boomplay', icon: <RiMusic2Fill size={24} style={{ color: '#f59e0b' }} />, note: 'Pan-African Reach' },
          ].map((dsp, idx) => (
            <div 
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px'
              }}
            >
              {dsp.icon}
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{dsp.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{dsp.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '36px 32px', 
          borderRadius: '12px', 
          border: '1px solid rgba(245, 158, 11, 0.2)', 
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.05) 0%, rgba(6, 8, 19, 0.6) 100%)'
        }}
      >
        <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 10px', fontFamily: 'Sansation, sans-serif' }}>
          Ready to Deliver Your Music to 150+ Stores?
        </h3>
        <p style={{ color: 'var(--mu)', fontSize: '14.5px', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Ingest your singles, EPs, and full-length albums with automated DDEX packaging, ISRC registration, and 100% royalty cascades.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link 
            to={primaryActionUrl} 
            className="btn-primary" 
            style={{ padding: '12px 28px', fontSize: '14px', background: '#f59e0b', color: '#000', fontWeight: 700 }}
          >
            Start Distributing Releases <RiArrowRightLine size={16} style={{ marginLeft: '6px' }} />
          </Link>
          <Link to="/pricing" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
            View Distribution Pricing
          </Link>
          <Link to="/help" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '14px' }}>
            Distribution FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
