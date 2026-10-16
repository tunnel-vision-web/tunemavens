import React, { useState } from 'react'
import {
  RiCloseLine,
  RiFolderMusicLine,
  RiDeleteBinLine,
  RiAddLine,
  RiDownload2Line,
  RiPlayFill,
  RiPauseFill,
  RiShieldCheckFill,
  RiFileTextLine,
  RiTimeLine,
  RiCheckboxCircleFill
} from 'react-icons/ri'
import './SyncMarketplace.css'

export default function SyncProjectBinsModal({
  isOpen,
  onClose,
  bins,
  currentBinId,
  onSelectBin,
  onCreateBin,
  onRemoveTrackFromBin,
  onOpenLicensingWizard,
  playingTrackId,
  onTogglePlay
}) {
  if (!isOpen) return null;

  const [activeBinId, setActiveBinId] = useState(currentBinId || 'bin_default');
  const [newBinName, setNewBinName] = useState('');
  const [showNewBinInput, setShowNewBinInput] = useState(false);
  const [cueData, setCueData] = useState({});
  const [exportSuccess, setExportSuccess] = useState(false);

  const activeBin = (bins || []).find(b => b.id === activeBinId) || (bins && bins[0]) || {
    id: 'bin_default',
    name: 'Primary Project Bin',
    project: 'Commercial / Film Initiative',
    tracks: []
  };

  const handleCreateBin = (e) => {
    e.preventDefault();
    if (!newBinName.trim()) return;
    const newId = `bin_${Date.now()}`;
    if (onCreateBin) {
      onCreateBin({
        id: newId,
        name: newBinName.trim(),
        project: 'New Sync Production',
        tracks: []
      });
    }
    setActiveBinId(newId);
    setNewBinName('');
    setShowNewBinInput(false);
  };

  const handleUpdateCue = (trackId, field, val) => {
    setCueData(prev => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || {
          cueIn: '00:01:30',
          cueOut: '00:02:45',
          usage: 'Background Instrumental',
          scene: 'Opening Sequence'
        }),
        [field]: val
      }
    }));
  };

  const handleExportCueSheet = () => {
    // Generate CSV string conforming to PRO / Broadcast cue sheet standards
    const headers = [
      'Cue #',
      'Track Title',
      'Artist / Performer',
      'ISWC',
      'ISRC',
      'PRO Affiliation',
      'Usage Type',
      'Time In',
      'Time Out',
      'Scene Description',
      'Master Rights Holder',
      'Publishing Rights Holder'
    ];

    const rows = (activeBin.tracks || []).map((t, idx) => {
      const cue = cueData[t.id] || {
        cueIn: `00:0${idx + 1}:00`,
        cueOut: `00:0${idx + 1}:45`,
        usage: 'Background Instrumental',
        scene: 'Scene Cue'
      };
      return [
        idx + 1,
        `"${t.title}"`,
        `"${t.artist}"`,
        `"${t.iswc || 'T-Pending'}"`,
        `"${t.isrc || 'KEN-Pending'}"`,
        `"${t.pro_affiliation || 'MCSK'}"`,
        `"${cue.usage}"`,
        `"${cue.cueIn}"`,
        `"${cue.cueOut}"`,
        `"${cue.scene}"`,
        `"${t.master_owner || '100% Pre-cleared'}"`,
        `"${t.publishing_owner || 'TuneMavens Publishing'}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TuneMavens_CueSheet_${activeBin.name.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);
  };

  return (
    <div className="sync-wizard-overlay" onClick={onClose}>
      <div
        className="sync-wizard-modal"
        style={{ maxWidth: '920px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sync-wizard-header">
          <div className="sync-wizard-title-group">
            <span className="sync-wizard-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <RiFolderMusicLine /> SUPERVISOR WORKSPACE
            </span>
            <h2 className="sync-wizard-title">Project Bins & Cue Sheet Manager</h2>
            <p className="sync-wizard-subtitle">
              Shortlist candidate cues, log in/out timecodes, and export standardized broadcast cue sheets for PRO reporting.
            </p>
          </div>
          <button className="sync-wizard-close-btn" onClick={onClose} aria-label="Close">
            <RiCloseLine />
          </button>
        </div>

        {/* Bin Switcher Bar */}
        <div style={{
          padding: '12px 24px',
          background: '#090e1f',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {(bins || []).map(b => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setActiveBinId(b.id);
                  if (onSelectBin) onSelectBin(b.id);
                }}
                style={{
                  background: activeBinId === b.id ? '#22d3ee' : 'rgba(255,255,255,0.06)',
                  color: activeBinId === b.id ? '#090e1f' : '#cbd5e1',
                  border: activeBinId === b.id ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: activeBinId === b.id ? '700' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <RiFolderMusicLine /> {b.name} ({b.tracks?.length || 0})
              </button>
            ))}

            {!showNewBinInput ? (
              <button
                type="button"
                onClick={() => setShowNewBinInput(true)}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px dashed rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RiAddLine /> + New Project Bin
              </button>
            ) : (
              <form onSubmit={handleCreateBin} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Bin name..."
                  value={newBinName}
                  onChange={(e) => setNewBinName(e.target.value)}
                  style={{
                    background: '#060813',
                    border: '1px solid #22d3ee',
                    color: '#ffffff',
                    borderRadius: '3px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    width: '130px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#22d3ee',
                    color: '#090e1f',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBinInput(false)}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </form>
            )}
          </div>

          {activeBin.tracks?.length > 0 && (
            <button
              type="button"
              className="sync-primary-btn"
              onClick={handleExportCueSheet}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiDownload2Line /> Export Standard Cue Sheet (.CSV)
            </button>
          )}
        </div>

        {/* Success Alert */}
        {exportSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid #10b981',
            padding: '8px 24px',
            color: '#10b981',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <RiCheckboxCircleFill />
            <span>Cue Sheet successfully downloaded! Formatted with MCSK / BMI / ASCAP metadata & timecodes.</span>
          </div>
        )}

        {/* Modal Body / Track Listing */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {(!activeBin.tracks || activeBin.tracks.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
              <RiFolderMusicLine style={{ fontSize: '48px', color: '#334155', marginBottom: '12px' }} />
              <h4 style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '6px' }}>This Project Bin is Empty</h4>
              <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                Browse titles in the Sync Marketplace grid and click the bookmark / "+ Bin" icon on any card to add tracks to <strong>"{activeBin.name}"</strong>.
              </p>
              <button
                type="button"
                className="sync-secondary-btn"
                onClick={onClose}
              >
                Browse Marketplace Tracks
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  {activeBin.tracks.length} track{activeBin.tracks.length > 1 ? 's' : ''} in "{activeBin.name}"
                </span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                  ✓ 100% Pre-Cleared One-Stop Ready
                </span>
              </div>

              {activeBin.tracks.map((track, idx) => {
                const cue = cueData[track.id] || {
                  cueIn: `00:0${idx + 1}:00`,
                  cueOut: `00:0${idx + 1}:45`,
                  usage: 'Background Instrumental',
                  scene: 'Scene Sequence'
                };
                const isPlaying = playingTrackId === track.id;

                return (
                  <div
                    key={track.id}
                    style={{
                      background: '#090e1f',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '3px',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Top Info Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
                          <img
                            src={track.cover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500'}
                            alt={track.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={() => onTogglePlay && onTogglePlay(track)}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'rgba(0,0,0,0.5)',
                              border: 'none',
                              color: isPlaying ? '#22d3ee' : '#ffffff',
                              fontSize: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                          </button>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: '700' }}>{track.title}</h4>
                            <span style={{ fontSize: '10px', background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', padding: '2px 6px', borderRadius: '3px' }}>
                              {track.genre}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                            by <strong style={{ color: '#cbd5e1' }}>{track.artist}</strong> • {track.bpm} BPM • Key: {track.key} • {track.duration}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ textAlign: 'right', marginRight: '6px' }}>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Rate from</div>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: '#22d3ee' }}>
                            ${track.pricing?.indie_film || 350} USD
                          </div>
                        </div>

                        <button
                          type="button"
                          className="sync-primary-btn"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => {
                            if (onOpenLicensingWizard) {
                              onOpenLicensingWizard(track);
                            }
                          }}
                        >
                          License Track
                        </button>

                        <button
                          type="button"
                          onClick={() => onRemoveTrackFromBin && onRemoveTrackFromBin(activeBin.id, track.id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: '3px',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Remove from Bin"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </div>

                    {/* Cue Sheet Metadata Row */}
                    <div style={{
                      background: 'rgba(0,0,0,0.25)',
                      padding: '10px 14px',
                      borderRadius: '3px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '10px',
                      alignItems: 'center',
                      fontSize: '11px'
                    }}>
                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Cue In Timecode</label>
                        <input
                          type="text"
                          value={cue.cueIn}
                          onChange={(e) => handleUpdateCue(track.id, 'cueIn', e.target.value)}
                          style={{
                            background: '#060813',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            color: '#ffffff',
                            padding: '4px 6px',
                            fontSize: '11px',
                            width: '100%'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Cue Out Timecode</label>
                        <input
                          type="text"
                          value={cue.cueOut}
                          onChange={(e) => handleUpdateCue(track.id, 'cueOut', e.target.value)}
                          style={{
                            background: '#060813',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            color: '#ffffff',
                            padding: '4px 6px',
                            fontSize: '11px',
                            width: '100%'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Usage Role</label>
                        <select
                          value={cue.usage}
                          onChange={(e) => handleUpdateCue(track.id, 'usage', e.target.value)}
                          style={{
                            background: '#060813',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            color: '#ffffff',
                            padding: '4px 6px',
                            fontSize: '11px',
                            width: '100%'
                          }}
                        >
                          <option value="Background Instrumental">Background Instrumental</option>
                          <option value="Visual Vocal / Featured">Visual Vocal / Featured</option>
                          <option value="Theme Song / Title Sequence">Theme Song / Title Sequence</option>
                          <option value="Source / In-World Radio">Source / In-World Radio</option>
                          <option value="End Credits">End Credits</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>Scene Note</label>
                        <input
                          type="text"
                          value={cue.scene}
                          onChange={(e) => handleUpdateCue(track.id, 'scene', e.target.value)}
                          placeholder="e.g. Chase scene"
                          style={{
                            background: '#060813',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '3px',
                            color: '#ffffff',
                            padding: '4px 6px',
                            fontSize: '11px',
                            width: '100%'
                          }}
                        />
                      </div>

                      <div style={{ paddingTop: '12px' }}>
                        <span style={{ color: '#94a3b8' }}>PRO / ISRC:</span>{' '}
                        <code style={{ color: '#22d3ee', fontSize: '10px' }}>{track.isrc}</code>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sync-wizard-footer">
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            TuneMavens Sync Licensing Escrow Guarantee • 100% Legal Master Indemnity
          </div>
          <button
            type="button"
            className="sync-secondary-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
