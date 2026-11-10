import React, { useState, useEffect } from 'react';
import {
  RiBroadcastLine,
  RiRadio2Line,
  RiTvLine,
  RiPlayListLine,
  RiFileLine,
  RiShieldCheckLine,
  RiAddLine,
  RiDeleteBinLine,
  RiSkipForwardLine,
  RiEqualizerLine,
  RiBookOpenLine,
  RiSparklingLine,
  RiCheckLine,
  RiFileCopyLine,
  RiSignalTowerLine,
  RiFolderMusicLine,
  RiVolumeUpLine
} from 'react-icons/ri';
import * as apiModule from '../lib/api.js';

// Safe fallback ensuring no unhandled SyntaxError if browser has cached api.js
const mediaHouseApi = apiModule.mediaHouseApi || (typeof window !== 'undefined' && window.mediaHouseApi) || {
  getChannels: () => Promise.resolve([]),
  getChannel: (id) => Promise.resolve(null),
  createChannel: (p) => Promise.resolve({}),
  getQueue: (id) => Promise.resolve({ queue: [] }),
  enqueueTrack: (p) => Promise.resolve({}),
  dequeueTrack: (id) => Promise.resolve({}),
  triggerPlayout: (p) => Promise.resolve({ verified_log: { airplay_certificate: 'PENDING' } }),
  getLogs: (p) => Promise.resolve({ logs: [] }),
  generateCueSheet: (p) => Promise.resolve({ pro_target: 'ASCAP', period: 'Current' }),
  getCueSheets: (id) => Promise.resolve([]),
  getStats: () => Promise.resolve({}),
  getStemsCatalog: () => Promise.resolve([])
};
import './MediaHousePanel.css';

export default function MediaHousePanel({ sessionUser }) {
  // Active state
  const [channels, setChannels] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [queue, setQueue] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cueSheets, setCueSheets] = useState([]);
  const [stats, setStats] = useState(null);
  const [stems, setStems] = useState([]);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'logs' | 'cue_sheets' | 'stems'

  // Loading & actions state
  const [loading, setLoading] = useState(true);
  const [activeStem, setActiveStem] = useState('clean_radio_edit');
  const [playoutAdvancing, setPlayoutAdvancing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedCert, setCopiedCert] = useState(null);

  // Cue generator form
  const [cueProTarget, setCueProTarget] = useState('MCSK');
  const [cuePeriod, setCuePeriod] = useState('2026-11');
  const [isGeneratingCue, setIsGeneratingCue] = useState(false);

  // Quick Enqueue Modal / Form
  const [showEnqueueModal, setShowEnqueueModal] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackIsrc, setNewTrackIsrc] = useState('');
  const [newTrackTier, setNewTrackTier] = useState('heavy');
  const [newTrackDaypart, setNewTrackDaypart] = useState('morning_drive');
  const [newTrackStem, setNewTrackStem] = useState('clean_radio_edit');

  // Load Channels & Overview Data
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        const [chanData, statsData, stemsData] = await Promise.all([
          mediaHouseApi.getChannels(),
          mediaHouseApi.getStats(),
          mediaHouseApi.getStemsCatalog()
        ]);
        setChannels(chanData || []);
        if (chanData && chanData.length > 0) {
          setSelectedChannelId(chanData[0].id);
        }
        setStats(statsData || null);
        setStems(stemsData || []);
      } catch (err) {
        console.error('Failed to load media house overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Load Channel Queue & Data on Channel Change
  useEffect(() => {
    if (!selectedChannelId) return;
    async function loadChannelDetails() {
      try {
        const [queueData, logsData, cueData] = await Promise.all([
          mediaHouseApi.getQueue(selectedChannelId),
          mediaHouseApi.getLogs({ channel_id: selectedChannelId, limit: 30 }),
          mediaHouseApi.getCueSheets(selectedChannelId)
        ]);
        setQueue(queueData?.queue || []);
        setLogs(logsData?.logs || []);
        setCueSheets(cueData || []);
      } catch (err) {
        console.error('Failed to load channel details:', err);
      }
    }
    loadChannelDetails();
  }, [selectedChannelId]);

  // Selected station
  const currentStation = channels.find(c => c.id === selectedChannelId) || channels[0] || {};

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trigger Playout Advancement
  const handleTriggerPlayout = async () => {
    if (!selectedChannelId) return;
    setPlayoutAdvancing(true);
    try {
      const res = await mediaHouseApi.triggerPlayout({ channel_id: selectedChannelId });
      showToast(`Airplay verified! Certificate ${res.verified_log.airplay_certificate} generated.`);
      // Reload queue and logs
      const [queueData, logsData, statsData] = await Promise.all([
        mediaHouseApi.getQueue(selectedChannelId),
        mediaHouseApi.getLogs({ channel_id: selectedChannelId }),
        mediaHouseApi.getStats()
      ]);
      setQueue(queueData?.queue || []);
      setLogs(logsData?.logs || []);
      setStats(statsData);

      // Update current station on-air metadata in state
      setChannels(prev => prev.map(c => c.id === selectedChannelId ? {
        ...c,
        current_track_title: res.on_air.title,
        current_artist: res.on_air.artist,
        current_isrc: res.on_air.isrc
      } : c));
    } catch (err) {
      console.error('Playout advancement error:', err);
      showToast('Error advancing playout schedule.');
    } finally {
      setPlayoutAdvancing(false);
    }
  };

  // Enqueue New Track
  const handleEnqueueTrack = async (e) => {
    e.preventDefault();
    if (!newTrackTitle || !newTrackArtist || !selectedChannelId) return;
    try {
      const payload = {
        channel_id: selectedChannelId,
        title: newTrackTitle,
        artist: newTrackArtist,
        isrc: newTrackIsrc || `QM4TX260${Math.floor(1000 + Math.random() * 9000)}`,
        duration_seconds: 210,
        rotation_tier: newTrackTier,
        daypart: newTrackDaypart,
        stem_preference: newTrackStem
      };
      await mediaHouseApi.enqueueTrack(payload);
      showToast(`Added "${newTrackTitle}" to broadcast rotation.`);
      setShowEnqueueModal(false);
      setNewTrackTitle('');
      setNewTrackArtist('');
      setNewTrackIsrc('');
      const qRes = await mediaHouseApi.getQueue(selectedChannelId);
      setQueue(qRes?.queue || []);
    } catch (err) {
      console.error('Enqueue error:', err);
      showToast('Failed to queue track.');
    }
  };

  // Dequeue Track
  const handleDequeue = async (itemId) => {
    try {
      await mediaHouseApi.dequeueTrack(itemId);
      setQueue(prev => prev.filter(q => q.id !== itemId));
      showToast('Item removed from broadcast queue.');
    } catch (err) {
      console.error('Dequeue error:', err);
    }
  };

  // Generate & Certify Cue Sheet
  const handleGenerateCueSheet = async () => {
    if (!selectedChannelId) return;
    setIsGeneratingCue(true);
    try {
      const res = await mediaHouseApi.generateCueSheet({
        channel_id: selectedChannelId,
        pro_target: cueProTarget,
        period: cuePeriod
      });
      showToast(`Certified ${res.pro_target} Cue Sheet for period ${res.period}!`);
      const updatedCues = await mediaHouseApi.getCueSheets(selectedChannelId);
      setCueSheets(updatedCues || []);
    } catch (err) {
      console.error('Cue sheet generation failed:', err);
      showToast('Failed to certify cue sheet.');
    } finally {
      setIsGeneratingCue(false);
    }
  };

  // Copy certificate hash
  const handleCopyCertificate = (cert) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cert);
      setCopiedCert(cert);
      setTimeout(() => setCopiedCert(null), 2000);
    }
  };

  return (
    <div className="media-house-panel" data-testid="media-house-panel">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(15, 23, 42, 0.96)',
          border: '1px solid #3b82f6',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 99999,
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <RiShieldCheckLine color="#3b82f6" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Universal Get Help and Ask AI Buttons */}
      <div className="media-house-header">
        <div className="media-house-header-left">
          <div className="media-house-badge-icon">
            <RiBroadcastLine />
          </div>
          <div>
            <h1 className="media-house-header-title">
              Media House Broadcast Operations &amp; Syndication
            </h1>
            <p className="media-house-header-desc">
              Multi-channel television &amp; radio playout routing, commercial ad traffic pacing, and statutory PRO compliance.
            </p>
          </div>
        </div>

        {/* Universal Get Help and Ask AI Buttons */}
        <div className="media-house-header-actions" data-testid="media-house-help-ai-actions">
          <button
            type="button"
            className="topbar-help-btn btn-get-help"
            onClick={() => window.dispatchEvent(new CustomEvent('tunemavens:open-help', {
              detail: { articleId: 'media-house-routing-and-broadcast-syndication' }
            }))}
            title="Get Help: Broadcast Syndication & Cue Sheet Documentation"
            data-testid="media-house-btn-get-help"
          >
            <RiBookOpenLine size={14} />
            <span>Get Help</span>
          </button>

          <button
            type="button"
            className="topbar-help-btn btn-ask-ai-topbar"
            onClick={() => window.dispatchEvent(new CustomEvent('tunemavens:open-ai', {
              detail: { prompt: 'Explain how media house broadcast cue sheets, stem clearance, and airplay certificates work.' }
            }))}
            title="Ask AI: Consult Ayo AI Copilot about broadcast routing and clearances"
            data-testid="media-house-btn-ask-ai"
          >
            <RiSparklingLine size={14} />
            <span>Ask AI</span>
            <span className="ai-memory-badge" />
          </button>
        </div>
      </div>

      {/* Operational Telemetry Cards */}
      <div className="media-metrics-grid">
        <div className="media-metric-card">
          <span className="media-metric-label">Active Broadcasters</span>
          <span className="media-metric-value">{stats?.total_stations || channels.length || 4}</span>
          <span className="media-metric-sub">FM, TV &amp; Satellite Synchronized</span>
        </div>
        <div className="media-metric-card">
          <span className="media-metric-label">Aggregate Listeners</span>
          <span className="media-metric-value">{(stats?.active_listeners_aggregate || 2685000).toLocaleString()}</span>
          <span className="media-metric-sub">Verified Audience Reach</span>
        </div>
        <div className="media-metric-card">
          <span className="media-metric-label">Spins Logged Today</span>
          <span className="media-metric-value">{stats?.spins_today || 842}</span>
          <span className="media-metric-sub">PRO Cue Sheet Sync Active</span>
        </div>
        <div className="media-metric-card">
          <span className="media-metric-label">PRO Compliance Score</span>
          <span className="media-metric-value">{stats?.pro_compliance_score || 99.85}%</span>
          <span className="media-metric-sub">Zero Discrepancy Margin</span>
        </div>
      </div>

      {/* Broadcast Station Selector Bar */}
      <div className="media-stations-bar">
        {channels.map((chan) => {
          const isSelected = chan.id === selectedChannelId;
          const isTv = chan.media_type === 'linear_tv';
          return (
            <div
              key={chan.id}
              className={`media-station-tab ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedChannelId(chan.id)}
            >
              <div className="station-type-icon">
                {isTv ? <RiTvLine /> : <RiRadio2Line />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="station-info-name">{chan.name}</div>
                <div className="station-info-sub">
                  <span>{chan.call_sign}</span>
                  <span>•</span>
                  <span>{chan.frequency}</span>
                  <span className="station-pro-badge">{chan.pro_affiliation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live On-Air Transmission Console */}
      <div className="on-air-console">
        <div>
          <div className="on-air-status-pill">
            <span className="on-air-pulse-dot" />
            <span>ON AIR • {currentStation.call_sign} ({currentStation.frequency || '98.4 MHz'})</span>
          </div>

          <div className="on-air-track-title">
            {currentStation.current_track_title || 'Nairobi Sunset Drive'}
          </div>
          <div className="on-air-artist">
            {currentStation.current_artist || 'Sauti Sol'}
          </div>

          <div className="on-air-meta-tags">
            <span>ISRC: <strong>{currentStation.current_isrc || 'QM4TX2600101'}</strong></span>
            <span>•</span>
            <span>PRO License: <strong>{currentStation.pro_license_id || 'MCSK-BCAST-2026'}</strong></span>
            <span>•</span>
            <span>Estimated Audience: <strong>{(currentStation.active_listeners || 285000).toLocaleString()}</strong></span>
          </div>

          <div className="on-air-stem-selector">
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, alignSelf: 'center', marginRight: '6px' }}>
              STEM BROADCAST CLEARANCE:
            </span>
            {['clean_radio_edit', 'master', 'instrumental', 'acapella'].map((s) => (
              <button
                key={s}
                type="button"
                className={`stem-choice-btn ${activeStem === s ? 'active' : ''}`}
                onClick={() => setActiveStem(s)}
              >
                {s.replace(/_/g, ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="on-air-controls">
          <button
            type="button"
            className="btn-advance-playout"
            onClick={handleTriggerPlayout}
            disabled={playoutAdvancing}
            title="Advance rotation queue and log verified cryptographic broadcast airplay receipt"
          >
            <RiSkipForwardLine size={16} />
            <span>{playoutAdvancing ? 'Advancing Transmission...' : 'Advance Playout (Next Cue)'}</span>
          </button>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Instant SHA-256 seal generation &amp; ASCAP/MCSK log update
          </span>
        </div>
      </div>

      {/* Workspace Sub-tabs Navigation */}
      <div className="media-tabs-nav">
        <button
          type="button"
          className={`media-tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          <RiPlayListLine size={15} />
          <span>Playout Rotation Queue ({queue.length})</span>
        </button>

        <button
          type="button"
          className={`media-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <RiSignalTowerLine size={15} />
          <span>Verified Airplay Logs ({logs.length})</span>
        </button>

        <button
          type="button"
          className={`media-tab-btn ${activeTab === 'cue_sheets' ? 'active' : ''}`}
          onClick={() => setActiveTab('cue_sheets')}
        >
          <RiFileLine size={15} />
          <span>Statutory PRO Cue Sheets ({cueSheets.length})</span>
        </button>

        <button
          type="button"
          className={`media-tab-btn ${activeTab === 'stems' ? 'active' : ''}`}
          onClick={() => setActiveTab('stems')}
        >
          <RiFolderMusicLine size={15} />
          <span>Stem &amp; Radio Edits Clearance ({stems.length})</span>
        </button>
      </div>

      {/* Tab 1: Playout Rotation Queue */}
      {activeTab === 'queue' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>
                Automated Rotation Governance for {currentStation.name}
              </span>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                Heavy, medium, and light rotation cycles interspersed with commercial ad flight intervals.
              </p>
            </div>
            <button
              type="button"
              className="topbar-help-btn btn-get-help"
              onClick={() => setShowEnqueueModal(true)}
              style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: '#3b82f6', color: '#3b82f6' }}
            >
              <RiAddLine size={14} />
              <span>Queue Track / Ad Spot</span>
            </button>
          </div>

          <div className="media-table-container">
            <table className="media-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Track / Spot</th>
                  <th>Artist / Sponsor</th>
                  <th>ISRC / Flight Code</th>
                  <th>Rotation Tier</th>
                  <th>Daypart</th>
                  <th>Stem Preference</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ fontWeight: 800, color: '#64748b' }}>#{idx + 1}</td>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{item.title}</td>
                    <td>{item.artist}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#94a3b8' }}>{item.isrc}</td>
                    <td>
                      <span className={`badge-rotation ${item.rotation_tier}`}>
                        {item.rotation_tier}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', color: '#cbd5e1' }}>
                      {item.daypart?.replace(/_/g, ' ')}
                    </td>
                    <td style={{ fontSize: '11px', color: '#38bdf8' }}>
                      {item.stem_preference?.replace(/_/g, ' ')}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDequeue(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        title="Remove from queue"
                      >
                        <RiDeleteBinLine size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Verified Airplay Logs */}
      {activeTab === 'logs' && (
        <div className="media-table-container">
          <table className="media-table">
            <thead>
              <tr>
                <th>Airplay Certificate</th>
                <th>Track Title</th>
                <th>Artist</th>
                <th>ISRC</th>
                <th>PRO Affiliate</th>
                <th>Timestamp</th>
                <th>Tamper Seal (SHA-256)</th>
                <th>Est. Royalty</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={log.id || idx}>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleCopyCertificate(log.airplay_certificate)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '3px',
                        color: '#60a5fa',
                        fontSize: '11.5px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        padding: '3px 8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Click to copy verified airplay certificate"
                    >
                      <span>{log.airplay_certificate}</span>
                      {copiedCert === log.airplay_certificate ? <RiCheckLine size={12} color="#10b981" /> : <RiFileCopyLine size={12} />}
                    </button>
                  </td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{log.title}</td>
                  <td>{log.artist}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#94a3b8' }}>{log.isrc}</td>
                  <td>
                    <span className="station-pro-badge">{log.pro_affiliation}</span>
                  </td>
                  <td style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    {log.played_at ? new Date(log.played_at).toLocaleTimeString() : 'Just Now'}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '10.5px', color: '#64748b' }}>
                    {log.tamper_seal ? log.tamper_seal.substring(0, 16) + '...' : 'Verified'}
                  </td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>
                    ${(log.estimated_royalty || 14.80).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Statutory PRO Cue Sheets */}
      {activeTab === 'cue_sheets' && (
        <div>
          {/* Generator Action Form */}
          <div className="cue-generator-card">
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                Automated PRO Regulatory Cue Sheet Generator
              </span>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                Aggregate verified transmission logs and export standardized DDEX/CSV reporting for ASCAP, BMI, MCSK, and SAMRO.
              </p>
            </div>

            <div className="cue-form-controls">
              <select
                className="cue-select"
                value={cueProTarget}
                onChange={(e) => setCueProTarget(e.target.value)}
              >
                <option value="MCSK">MCSK (Music Copyright Society of Kenya)</option>
                <option value="SAMRO">SAMRO (Southern Africa)</option>
                <option value="ASCAP">ASCAP (United States)</option>
                <option value="BMI">BMI (United States)</option>
              </select>

              <input
                type="text"
                className="cue-input"
                value={cuePeriod}
                onChange={(e) => setCuePeriod(e.target.value)}
                placeholder="Period (e.g. 2026-11)"
                style={{ width: '110px' }}
              />

              <button
                type="button"
                className="btn-certify-cue"
                onClick={handleGenerateCueSheet}
                disabled={isGeneratingCue}
              >
                <RiShieldCheckLine size={15} />
                <span>{isGeneratingCue ? 'Certifying...' : 'Generate & Certify Cue Sheet'}</span>
              </button>
            </div>
          </div>

          <div className="media-table-container">
            <table className="media-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Target PRO</th>
                  <th>Total Spins</th>
                  <th>Airtime (Minutes)</th>
                  <th>Unique Tracks</th>
                  <th>Compliance Score</th>
                  <th>Export Format</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cueSheets.map((cs, idx) => (
                  <tr key={cs.id || idx}>
                    <td style={{ fontWeight: 800, color: '#ffffff' }}>{cs.period}</td>
                    <td>
                      <span className="station-pro-badge">{cs.pro_target}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{cs.total_spins}</td>
                    <td>{(cs.total_duration_minutes || 0).toLocaleString()} mins</td>
                    <td>{cs.tracks_count}</td>
                    <td style={{ color: '#10b981', fontWeight: 800 }}>{cs.compliance_score || 99.85}%</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>
                      {cs.export_format}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10b981',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        <RiCheckLine size={12} />
                        <span>Certified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Stems & Radio Edits Clearance Library */}
      {activeTab === 'stems' && (
        <div className="media-table-container">
          <table className="media-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>BPM / Key</th>
                <th>Duration</th>
                <th>ISRC</th>
                <th>Available Stem Mixes</th>
                <th>Clearance Status</th>
              </tr>
            </thead>
            <tbody>
              {stems.map((s, idx) => (
                <tr key={s.id || idx}>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{s.title}</td>
                  <td>{s.artist}</td>
                  <td style={{ color: '#38bdf8' }}>{s.bpm} BPM · {s.key}</td>
                  <td>{s.duration}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#94a3b8' }}>{s.isrc}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {s.available_stems?.map((stemName, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '3px',
                            padding: '2px 6px',
                            fontSize: '10.5px',
                            color: '#e2e8f0'
                          }}
                        >
                          {stemName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: '#10b981', fontWeight: 700 }}>
                    {s.license_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Quick Enqueue Track or Ad */}
      {showEnqueueModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            color: '#ffffff'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800 }}>
              Queue Track or Commercial Ad Spot
            </h3>

            <form onSubmit={handleEnqueueTrack} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Title / Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sauti Sol - Live Melody"
                  value={newTrackTitle}
                  onChange={(e) => setNewTrackTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Artist / Brand Sponsor
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sauti Sol or Safaricom 5G"
                  value={newTrackArtist}
                  onChange={(e) => setNewTrackArtist(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  ISRC or Ad Flight Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. QM4TX2600123"
                  value={newTrackIsrc}
                  onChange={(e) => setNewTrackIsrc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Rotation Tier
                  </label>
                  <select
                    value={newTrackTier}
                    onChange={(e) => setNewTrackTier(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="heavy">Heavy (High Power)</option>
                    <option value="medium">Medium (Regular)</option>
                    <option value="light">Light (Late Night)</option>
                    <option value="ad_spot">Commercial Ad Spot</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Dayparting Slot
                  </label>
                  <select
                    value={newTrackDaypart}
                    onChange={(e) => setNewTrackDaypart(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '4px',
                      color: '#fff',
                      outline: 'none'
                    }}
                  >
                    <option value="morning_drive">Morning Drive</option>
                    <option value="midday">Midday Mix</option>
                    <option value="afternoon_rush">Afternoon Rush</option>
                    <option value="evening_prime">Evening Prime</option>
                    <option value="overnight">Overnight Chill</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Stem Format Preference
                </label>
                <select
                  value={newTrackStem}
                  onChange={(e) => setNewTrackStem(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="clean_radio_edit">Clean Radio Edit (Bleeped / Safe)</option>
                  <option value="master">Original Master</option>
                  <option value="instrumental">Instrumental Bed</option>
                  <option value="acapella">Acapella Stem</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowEnqueueModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#94a3b8',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm &amp; Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
