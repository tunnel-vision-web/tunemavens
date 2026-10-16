import React, { useState, useEffect, useRef } from 'react'
import {
  RiMusic2Fill,
  RiPlayFill,
  RiPauseFill,
  RiShieldCheckFill,
  RiShoppingCartLine,
  RiFolderMusicLine,
  RiDownload2Line,
  RiInformationLine,
  RiSearchLine,
  RiFilter3Line,
  RiAddLine,
  RiFireFill,
  RiSparklingLine,
  RiExchangeDollarLine,
  RiTimerLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiFileTextLine,
  RiExternalLinkLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine
} from 'react-icons/ri'
import {
  SYNC_CATALOG_TRACKS,
  SYNC_ACTIVE_BRIEFS,
  SYNC_RATE_TIERS
} from './SyncMarketplaceData.js'
import { syncAudioEngine } from './SyncAudioEngine.js'
import SyncLicensingAcquisitionWizard from './SyncLicensingAcquisitionWizard.jsx'
import SyncBriefPitchWizard from './SyncBriefPitchWizard.jsx'
import SyncBriefCreationWizard from './SyncBriefCreationWizard.jsx'
import SyncProjectBinsModal from './SyncProjectBinsModal.jsx'
import './SyncMarketplace.css'

export default function SyncMarketplacePanel({ sessionUser }) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'briefs' | 'bins' | 'waterfall'

  // Data Collections
  const [catalogTracks, setCatalogTracks] = useState(SYNC_CATALOG_TRACKS);
  const [activeBriefs, setActiveBriefs] = useState(SYNC_ACTIVE_BRIEFS);
  const [projectBins, setProjectBins] = useState([
    {
      id: 'bin_default',
      name: 'Nairobi Feature Film Shortlist',
      project: 'Main Commercial Flight',
      tracks: [SYNC_CATALOG_TRACKS[0], SYNC_CATALOG_TRACKS[2]]
    }
  ]);
  const [currentBinId, setCurrentBinId] = useState('bin_default');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [selectedVocal, setSelectedVocal] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Modals & Wizards State
  const [licensingTrack, setLicensingTrack] = useState(null);
  const [isLicensingOpen, setIsLicensingOpen] = useState(false);

  const [pitchingBrief, setPitchingBrief] = useState(null);
  const [isPitchingOpen, setIsPitchingOpen] = useState(false);

  const [isCreateBriefOpen, setIsCreateBriefOpen] = useState(false);
  const [isBinsModalOpen, setIsBinsModalOpen] = useState(false);

  // Audio Player State
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [playbackProgress, setPlaybackProgress] = useState({}); // { trackId: { currentTime, duration, percent } }
  const [expandedDetailsId, setExpandedDetailsId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      syncAudioEngine.stop();
    };
  }, []);

  // Audio Play / Pause handler
  const handleTogglePlay = (track) => {
    if (playingTrackId === track.id) {
      syncAudioEngine.pause();
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(track.id);
      syncAudioEngine.play(
        track,
        (progress) => {
          setPlaybackProgress(prev => ({
            ...prev,
            [track.id]: progress
          }));
        },
        () => {
          // Playback ended (30s reached)
          setPlayingTrackId(null);
        }
      );
    }
  };

  // Project Bin Track Toggle
  const handleToggleTrackInBin = (track) => {
    setProjectBins(prevBins => {
      return prevBins.map(b => {
        if (b.id === currentBinId) {
          const exists = b.tracks.some(t => t.id === track.id);
          const updatedTracks = exists
            ? b.tracks.filter(t => t.id !== track.id)
            : [...b.tracks, track];
          showToast(exists ? `Removed "${track.title}" from project bin` : `Added "${track.title}" to project bin`);
          return { ...b, tracks: updatedTracks };
        }
        return b;
      });
    });
  };

  const isTrackInCurrentBin = (trackId) => {
    const cur = projectBins.find(b => b.id === currentBinId);
    return cur ? cur.tracks.some(t => t.id === trackId) : false;
  };

  const totalBinTracksCount = projectBins.reduce((acc, b) => acc + (b.tracks?.length || 0), 0);

  // Filter Catalog Tracks
  const filteredTracks = catalogTracks.filter(track => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.genre.toLowerCase().includes(q) ||
      (track.moods || []).some(m => m.toLowerCase().includes(q));

    const matchGenre = selectedGenre === 'all' ||
      track.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    const matchMood = selectedMood === 'all' ||
      (track.moods || []).some(m => m.toLowerCase() === selectedMood.toLowerCase());

    const matchVocal = selectedVocal === 'all' ||
      (selectedVocal === 'instrumental' && track.vocal_type.toLowerCase().includes('instrumental')) ||
      (selectedVocal === 'vocal' && track.vocal_type.toLowerCase().includes('vocal'));

    return matchQuery && matchGenre && matchMood && matchVocal;
  }).sort((a, b) => {
    if (sortBy === 'rate-low') return (a.pricing?.indie_film || 0) - (b.pricing?.indie_film || 0);
    if (sortBy === 'rate-high') return (b.pricing?.indie_film || 0) - (a.pricing?.indie_film || 0);
    if (sortBy === 'bpm-high') return (b.bpm || 0) - (a.bpm || 0);
    if (sortBy === 'bpm-low') return (a.bpm || 0) - (b.bpm || 0);
    return 0; // Default order
  });

  // Stems download mock
  const handleDownloadStems = (track) => {
    showToast(`Downloading broadcast package & stems zip for "${track.title}"...`);
  };

  // =====================================================================
  // Pagination Engine (Guarantees no more than 4 rows showing at any time)
  // =====================================================================
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsLimit, setRowsLimit] = useState(4); // Default & strict maximum allowed rows: 4
  const [gridColumns, setGridColumns] = useState(2);
  const gridContainerRef = useRef(null);

  // Auto-detect responsive column count to calculate exact row math
  useEffect(() => {
    if (!gridContainerRef.current) return;
    const updateColumns = () => {
      if (!gridContainerRef.current) return;
      const width = gridContainerRef.current.offsetWidth;
      // .sync-titles-grid has minmax(360px, 1fr) with gap 20px
      // width >= 360 * col + 20 * (col - 1) = 380 * col - 20 => col = floor((width + 20) / 380)
      const computedCols = Math.max(1, Math.min(4, Math.floor((width + 20) / 380)));
      setGridColumns(computedCols);
    };

    updateColumns();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateColumns());
      resizeObserver.observe(gridContainerRef.current);
    } else {
      window.addEventListener('resize', updateColumns);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', updateColumns);
    };
  }, [activeTab]);

  // Reset to page 1 whenever any search, filter, or row parameter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedMood, selectedVocal, sortBy, rowsLimit]);

  // Enforce strictly no more than 4 rows showing
  const safeRowsLimit = Math.min(4, Math.max(1, rowsLimit));
  const itemsPerPage = Math.max(1, gridColumns * safeRowsLimit);
  const totalPages = Math.max(1, Math.ceil(filteredTracks.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTracks.length);
  const paginatedTracks = filteredTracks.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);
    if (gridContainerRef.current) {
      gridContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (safeCurrentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (safeCurrentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const MOOD_TAGS = ['all', 'action', 'cinematic', 'afrobeats', 'uplifting', 'sunset', 'chill', 'tension', 'club'];

  return (
    <div className="sync-marketplace-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#090e1f',
          border: '1px solid #22d3ee',
          boxShadow: '0 10px 25px rgba(0,0,0,0.8), 0 0 15px rgba(34, 211, 238, 0.3)',
          color: '#ffffff',
          borderRadius: '3px',
          padding: '12px 18px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease'
        }}>
          <RiCheckboxCircleFill style={{ color: '#22d3ee', fontSize: '18px' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="sync-hero-banner">
        <div>
          <div className="sync-hero-eyebrow">
            <RiSparklingLine /> 100% PRE-CLEARED ONE-STOP SYNC MARKETPLACE
          </div>
          <h1 className="sync-hero-title">TuneMavens Sync Licensing Hub</h1>
          <p className="sync-hero-desc">
            Link creators with global film, TV, and gaming placements — and provide music supervisors with pre-cleared East African IP and transparent 90/10 royalty splits.
          </p>
        </div>

        <div className="sync-hero-stats-row">
          <div className="sync-hero-stat-pill">
            <strong>{catalogTracks.length} Titles</strong>
            <span>One-Stop Cleared</span>
          </div>
          <div className="sync-hero-stat-pill">
            <strong style={{ color: '#22d3ee' }}>{activeBriefs.length} Active Briefs</strong>
            <span>$125,000 Pool</span>
          </div>
          <div className="sync-hero-stat-pill">
            <strong style={{ color: '#10b981' }}>90% / 10%</strong>
            <span>Direct Creator Split</span>
          </div>
        </div>
      </div>

      {/* Dual-Mode Navigation Tabs & Header Actions */}
      <div className="sync-nav-tabs-bar">
        <div className="sync-nav-tabs-group">
          <button
            type="button"
            className={`sync-nav-tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <RiMusic2Fill /> Browse Sync Titles
            <span className="sync-nav-badge">{catalogTracks.length}</span>
          </button>

          <button
            type="button"
            className={`sync-nav-tab-btn ${activeTab === 'briefs' ? 'active' : ''}`}
            onClick={() => setActiveTab('briefs')}
          >
            <RiFireFill style={{ color: '#eab308' }} /> Active Briefs & Pitches
            <span className="sync-nav-badge" style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}>
              {activeBriefs.length}
            </span>
          </button>

          <button
            type="button"
            className={`sync-nav-tab-btn ${activeTab === 'bins' ? 'active' : ''}`}
            onClick={() => setIsBinsModalOpen(true)}
          >
            <RiFolderMusicLine /> Project Bins & Cue Sheet
            <span className="sync-nav-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
              {totalBinTracksCount}
            </span>
          </button>

          <button
            type="button"
            className={`sync-nav-tab-btn ${activeTab === 'waterfall' ? 'active' : ''}`}
            onClick={() => setActiveTab('waterfall')}
          >
            <RiExchangeDollarLine /> 90/10 Split & Royalties
          </button>
        </div>

        <div className="sync-header-actions">
          <button
            type="button"
            className="sync-secondary-btn"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            onClick={() => setIsBinsModalOpen(true)}
          >
            <RiFolderMusicLine /> View Bins ({totalBinTracksCount})
          </button>

          <button
            type="button"
            className="sync-primary-btn"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            onClick={() => setIsCreateBriefOpen(true)}
          >
            <RiAddLine /> + Post Sync Brief
          </button>
        </div>
      </div>

      {/* ========================================================
          TAB 1: BROWSE SYNC TITLES (GRID VIEW FOR SUPERVISORS)
          ======================================================== */}
      {activeTab === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Toolbar */}
          <div className="sync-filter-toolbar">
            <div className="sync-search-row">
              <div className="sync-search-input-box">
                <RiSearchLine className="sync-search-icon" />
                <input
                  type="text"
                  className="sync-search-input"
                  placeholder="Search by track title, artist, genre, mood, or BPM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="sync-select-filter"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="all">All Genres</option>
                <option value="synthwave">Synthwave / Cyberpunk</option>
                <option value="afrobeats">Afrobeats</option>
                <option value="amapiano">Amapiano</option>
                <option value="cinematic">Cinematic Orchestral</option>
                <option value="trap">East African Trap</option>
                <option value="gqom">Gqom / Techno</option>
                <option value="indie">Indie Pop / Folk</option>
                <option value="taarab">Taarab Chillhop</option>
              </select>

              <select
                className="sync-select-filter"
                value={selectedVocal}
                onChange={(e) => setSelectedVocal(e.target.value)}
              >
                <option value="all">All Vocals</option>
                <option value="instrumental">Instrumental Only</option>
                <option value="vocal">Vocal / Songs</option>
              </select>

              <select
                className="sync-select-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Sort: Featured</option>
                <option value="rate-low">Starting Rate: Low to High</option>
                <option value="rate-high">Starting Rate: High to Low</option>
                <option value="bpm-high">Tempo: Fast (High BPM)</option>
                <option value="bpm-low">Tempo: Slow (Low BPM)</option>
              </select>
            </div>

            {/* Mood Chips Row */}
            <div className="sync-mood-chips-row">
              <span style={{ fontSize: '11px', color: '#64748b', marginRight: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Moods:
              </span>
              {MOOD_TAGS.map(mood => (
                <button
                  key={mood}
                  type="button"
                  className={`sync-mood-chip ${selectedMood === mood ? 'active' : ''}`}
                  onClick={() => setSelectedMood(mood)}
                >
                  {mood === 'all' ? 'All Moods' : `#${mood}`}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count & Quick Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap', gap: '8px' }}>
            <span>
              Showing <strong style={{ color: '#22d3ee' }}>{filteredTracks.length > 0 ? `${startIndex + 1}–${endIndex}` : 0}</strong> of <strong style={{ color: '#fff' }}>{filteredTracks.length}</strong> sync-ready titles (Page {safeCurrentPage} of {totalPages})
            </span>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RiShieldCheckFill /> All stems & master WAVs verified · 100% Pre-cleared
            </span>
          </div>

          {/* Titles Grid (No more than 4 rows showing) */}
          <div className="sync-titles-grid" ref={gridContainerRef}>
            {paginatedTracks.map(track => {
              const isPlaying = playingTrackId === track.id;
              const progress = playbackProgress[track.id] || { currentTime: 0, duration: 30, percent: 0 };
              const inBin = isTrackInCurrentBin(track.id);
              const isDetailsExpanded = expandedDetailsId === track.id;

              return (
                <div
                  key={track.id}
                  className={`sync-track-card ${isPlaying ? 'playing' : ''}`}
                >
                  {/* Card Header (Artwork & Meta) */}
                  <div className="sync-card-header">
                    <div className="sync-card-art-box">
                      <img src={track.cover} alt={track.title} className="sync-card-art" />
                      <div
                        className="sync-card-art-overlay"
                        onClick={() => handleTogglePlay(track)}
                        title={isPlaying ? 'Pause 30s Preview' : 'Play 30s Audio Preview'}
                      >
                        <button type="button" className="sync-art-play-btn">
                          {isPlaying ? <RiPauseFill /> : <RiPlayFill style={{ marginLeft: '2px' }} />}
                        </button>
                      </div>
                    </div>

                    <div className="sync-card-meta">
                      <div className="sync-card-title-row">
                        <h3 className="sync-card-title" title={track.title}>{track.title}</h3>
                      </div>
                      <div className="sync-card-artist">{track.artist}</div>

                      <div className="sync-card-badges-row">
                        <span className="sync-badge-genre">{track.genre}</span>
                        <span className="sync-badge-bpm">{track.bpm} BPM</span>
                        <span className="sync-badge-key">{track.key}</span>
                      </div>
                    </div>
                  </div>

                  {/* 100% Clearance & Starting Rate Pill */}
                  <div className="sync-card-clearance-bar">
                    <span className="sync-clearance-text">
                      <RiShieldCheckFill /> 100% One-Stop
                    </span>
                    <span className="sync-rate-indicator">
                      From <strong>${track.pricing?.indie_film || 350}</strong> USD
                    </span>
                  </div>

                  {/* Interactive 30-Second Audio Player & Animated Waveform */}
                  <div className="sync-card-player-box">
                    <div className="sync-player-controls-row">
                      <button
                        type="button"
                        className={`sync-player-play-btn ${isPlaying ? 'pause' : ''}`}
                        onClick={() => handleTogglePlay(track)}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <RiPauseFill /> : <RiPlayFill style={{ marginLeft: '1px' }} />}
                      </button>

                      {/* Waveform Visualizer */}
                      <div
                        className="sync-waveform-container"
                        onClick={() => handleTogglePlay(track)}
                        title="Click to preview 30s clip"
                      >
                        {[16, 28, 42, 65, 80, 50, 35, 75, 90, 60, 40, 85, 95, 70, 55, 30, 65, 80, 45, 25].map((h, i) => {
                          const isActive = (i / 20) <= (progress.percent / 100);
                          return (
                            <div
                              key={i}
                              className={`sync-wave-bar ${isActive ? 'active' : ''} ${isPlaying ? 'animating' : ''}`}
                              style={{
                                height: `${h}%`,
                                animationDelay: `${i * 0.05}s`
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="sync-player-time">
                        {isPlaying
                          ? `00:${String(Math.floor(progress.currentTime)).padStart(2, '0')}`
                          : '00:30'}
                      </div>
                    </div>

                    {/* 30s Scrub Track */}
                    <div
                      className="sync-scrub-track"
                      onClick={() => handleTogglePlay(track)}
                    >
                      <div
                        className="sync-scrub-bar"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Mood Tags & Stems Count */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(track.moods || []).slice(0, 3).map(m => (
                        <span key={m} style={{ background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '2px', color: '#cbd5e1' }}>
                          #{m}
                        </span>
                      ))}
                    </div>
                    <span style={{ color: '#22d3ee' }}>
                      {track.stems_available?.length || 4} Stems Included
                    </span>
                  </div>

                  {/* Card Action Buttons (Direct Acquisition & Shortlisting) */}
                  <div className="sync-card-actions">
                    <button
                      type="button"
                      className="sync-primary-btn"
                      onClick={() => {
                        setLicensingTrack(track);
                        setIsLicensingOpen(true);
                      }}
                      title="Open intuitive 5-step licensing wizard"
                    >
                      <RiShoppingCartLine /> License Track
                    </button>

                    <button
                      type="button"
                      className={`sync-secondary-btn ${inBin ? 'active-bin' : ''}`}
                      onClick={() => handleToggleTrackInBin(track)}
                      style={{
                        background: inBin ? 'rgba(16, 185, 129, 0.15)' : undefined,
                        borderColor: inBin ? '#10b981' : undefined,
                        color: inBin ? '#10b981' : undefined
                      }}
                      title={inBin ? 'In Project Bin' : 'Add to Project Bin'}
                    >
                      {inBin ? <RiCheckLine /> : <RiFolderMusicLine />} {inBin ? 'In Bin' : '+ Bin'}
                    </button>
                  </div>

                  {/* Secondary Actions (Stems Download & Clearance Drawer Toggle) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                      type="button"
                      onClick={() => handleDownloadStems(track)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      <RiDownload2Line /> Stems / Master WAV
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedDetailsId(isDetailsExpanded ? null : track.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: isDetailsExpanded ? '#22d3ee' : '#64748b',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                    >
                      <RiInformationLine /> {isDetailsExpanded ? 'Hide Specs' : 'Clearance Specs'}
                    </button>
                  </div>

                  {/* Expandable Clearance & Rights Metadata Drawer */}
                  {isDetailsExpanded && (
                    <div style={{
                      background: '#060813',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      padding: '10px 12px',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      color: '#94a3b8'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>ISWC: <strong style={{ color: '#fff' }}>{track.iswc}</strong></span>
                        <span>ISRC: <strong style={{ color: '#22d3ee' }}>{track.isrc}</strong></span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>PRO Affiliation: <strong style={{ color: '#fff' }}>{track.pro_affiliation}</strong></span>
                        <span>Master: <strong style={{ color: '#10b981' }}>100% Owned</strong></span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '2px' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 'bold', marginBottom: '2px' }}>Rate Card Matrix:</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#64748b' }}>
                          <span>• Indie Film: ${track.pricing?.indie_film}</span>
                          <span>• TV Series: ${track.pricing?.tv_series}</span>
                          <span>• Commercial: ${track.pricing?.commercial}</span>
                          <span>• Worldwide: ${track.pricing?.broadcast_worldwide}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTracks.length === 0 && (
            <div className="sync-empty-catalog">
              <RiMusic2Fill style={{ fontSize: '36px', color: '#64748b', marginBottom: '8px' }} />
              <h4 style={{ color: '#f8fafc', margin: '0 0 6px 0', fontSize: '15px' }}>No Sync Titles Found</h4>
              <p style={{ color: '#94a3b8', margin: '0 0 16px 0', fontSize: '13px' }}>
                No pre-cleared tracks match your current search and filter settings.
              </p>
              <button
                type="button"
                className="sync-secondary-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('all');
                  setSelectedMood('all');
                  setSelectedVocal('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination Controls Bar (Guarantees max 4 rows showing) */}
          {filteredTracks.length > 0 && (
            <div className="sync-pagination-bar">
              <div className="sync-pagination-info">
                <span>
                  Showing <strong style={{ color: '#22d3ee' }}>{startIndex + 1}–{endIndex}</strong> of <strong style={{ color: '#fff' }}>{filteredTracks.length}</strong> titles
                </span>
                <span className="sync-pagination-badge">
                  Max 4 Rows ({gridColumns} {gridColumns === 1 ? 'column' : 'columns'} × {safeRowsLimit} rows = {itemsPerPage}/page)
                </span>
              </div>

              <div className="sync-pagination-controls">
                <button
                  type="button"
                  className="sync-page-btn nav-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={safeCurrentPage === 1}
                  title="First Page"
                  aria-label="First Page"
                >
                  <RiArrowLeftDoubleLine />
                </button>
                <button
                  type="button"
                  className="sync-page-btn nav-btn"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage === 1}
                  title="Previous Page"
                  aria-label="Previous Page"
                >
                  <RiArrowLeftSLine />
                </button>

                <div className="sync-page-numbers">
                  {getPageNumbers().map((p, idx) => {
                    if (p === '...') {
                      return <span key={`dots-${idx}`} className="sync-page-ellipsis">…</span>;
                    }
                    return (
                      <button
                        key={`page-${p}`}
                        type="button"
                        className={`sync-page-btn page-num ${safeCurrentPage === p ? 'active' : ''}`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="sync-page-btn nav-btn"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage === totalPages}
                  title="Next Page"
                  aria-label="Next Page"
                >
                  <RiArrowRightSLine />
                </button>
                <button
                  type="button"
                  className="sync-page-btn nav-btn"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  title="Last Page"
                  aria-label="Last Page"
                >
                  <RiArrowRightDoubleLine />
                </button>
              </div>

              <div className="sync-pagination-meta">
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Page <strong style={{ color: '#fff' }}>{safeCurrentPage}</strong> of <strong style={{ color: '#fff' }}>{totalPages}</strong>
                </span>
                <div className="sync-rows-selector-group">
                  <label htmlFor="sync-rows-select" style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                    Rows:
                  </label>
                  <select
                    id="sync-rows-select"
                    className="sync-rows-select"
                    value={rowsLimit}
                    onChange={(e) => {
                      setRowsLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={2}>2 rows</option>
                    <option value={3}>3 rows</option>
                    <option value={4}>4 rows (Max)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 2: ACTIVE BRIEFS & CREATOR PITCHING
          ======================================================== */}
      {activeTab === 'briefs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: 'rgba(234, 179, 8, 0.05)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            borderRadius: '3px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RiFireFill /> DIRECT CREATOR SYNC PLACEMENT PORTAL
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                Pitch your pre-cleared tracks directly to film & TV music supervisors. <strong>0 Platform Credits Deducted</strong> for pitching.
              </p>
            </div>
            <button
              type="button"
              className="sync-primary-btn"
              onClick={() => setIsCreateBriefOpen(true)}
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              <RiAddLine /> Post a Brief as Supervisor
            </button>
          </div>

          {/* Active Briefs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {activeBriefs.map(brief => {
              const isUrgent = brief.urgency === 'critical';

              return (
                <div
                  key={brief.id}
                  style={{
                    background: '#090e1f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  {/* Top Client & Urgency Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {brief.client}
                      </span>
                      <h3 style={{ margin: '2px 0 0 0', fontSize: '17px', color: '#fff', fontWeight: '800' }}>
                        {brief.title}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        Production: {brief.production_house}
                      </div>
                    </div>

                    <span style={{
                      background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: isUrgent ? '#ef4444' : '#eab308',
                      border: `1px solid ${isUrgent ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      <RiTimerLine /> {brief.deadline_date}
                    </span>
                  </div>

                  {/* Synopsis Box */}
                  <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {brief.synopsis}
                  </p>

                  {/* Genres & Mood Tags */}
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Required Sonic Direction:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(brief.required_genres || []).map(g => (
                        <span key={g} style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', fontSize: '11px', padding: '2px 8px', borderRadius: '3px' }}>
                          {g}
                        </span>
                      ))}
                      {(brief.required_moods || []).map(m => (
                        <span key={m} style={{ background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontSize: '11px', padding: '2px 8px', borderRadius: '3px' }}>
                          #{m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Placement Fee & 90/10 Split Box */}
                  <div style={{
                    background: '#060813',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Gross Placement Fee
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981' }}>
                        ${brief.budget_fee?.toLocaleString()} USD
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Creator Split (90%)
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#22d3ee' }}>
                        ${Math.round(brief.budget_fee * 0.90).toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  {/* Card Pitch Button (Direct Pitch Wizard) */}
                  <button
                    type="button"
                    className="sync-primary-btn"
                    onClick={() => {
                      setPitchingBrief(brief);
                      setIsPitchingOpen(true);
                    }}
                    style={{ padding: '10px', fontSize: '13px' }}
                  >
                    <RiSparklingLine /> Pitch Track to Brief (0 Credits)
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>Target: <strong>{brief.target_bpm} BPM</strong></span>
                    <span>{brief.pitches_count || 0} tracks submitted</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: 90/10 SPLIT & WATERFALL TRANSPARENCY
          ======================================================== */}
      {activeTab === 'waterfall' && (
        <div style={{
          background: '#090e1f',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '3px',
          padding: '30px'
        }}>
          <div style={{ maxWidth: '720px' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
              ROYALTY INTEGRITY · ZERO MIDDLEMAN DEDUCTIONS
            </span>
            <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: '800', margin: '4px 0 12px 0' }}>
              TuneLedger 90/10 Sync Revenue Cascade
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Traditional music libraries keep 50% to 70% of sync licensing fees. TuneMavens operates on a transparent 90/10 waterfall model designed to enrich Kenyan and African music creators while providing music supervisors with guaranteed 100% legal indemnity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '3px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#10b981' }}>90%</div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: '8px 0 4px 0', fontWeight: '700' }}>
                Net Placement to Songwriter & Master Owner
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                Paid automatically via M-Pesa Express, Kenyan bank wire, or USD ACH within 48 hours of license execution. Zero hidden recoupments.
              </p>
            </div>

            <div style={{
              background: 'rgba(34, 211, 238, 0.08)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '3px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#22d3ee' }}>10%</div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: '8px 0 4px 0', fontWeight: '700' }}>
                TuneMavens Legal & Escrow Facilitation
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                Covers master clearance verification, cue sheet filing with PROs (MCSK, BMI, ASCAP, SAMRO), high-res stem delivery, and full buyer indemnity.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '3px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#f1f5f9' }}>100%</div>
              <h3 style={{ fontSize: '16px', color: '#fff', margin: '8px 0 4px 0', fontWeight: '700' }}>
                Back-End Performance Royalties Retained
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
                TuneMavens takes 0% of your performance royalties. Every TV broadcast or cinema screening pays 100% of composer shares directly to your PRO.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          WIZARDS & MODALS INTEGRATION
          ======================================================== */}

      {/* 1. Licensing Acquisition Wizard (Supervisor 5-step Checkout) */}
      <SyncLicensingAcquisitionWizard
        isOpen={isLicensingOpen}
        onClose={() => {
          setIsLicensingOpen(false);
          setLicensingTrack(null);
        }}
        track={licensingTrack}
        sessionUser={sessionUser}
        onLicenseCompleted={(receipt) => {
          showToast(`License issued successfully! Certificate ID: ${receipt.certificateId}`);
        }}
      />

      {/* 2. Creator Brief Pitch Wizard (Creator 4-step AI Scene Matching) */}
      <SyncBriefPitchWizard
        isOpen={isPitchingOpen}
        onClose={() => {
          setIsPitchingOpen(false);
          setPitchingBrief(null);
        }}
        brief={pitchingBrief}
        catalogTracks={catalogTracks}
        sessionUser={sessionUser}
        onPitchSubmitted={(pitch) => {
          showToast(`Pitch submitted for "${pitchingBrief?.title}"! 0 credits deducted.`);
          // Increment pitch counter
          setActiveBriefs(prev => prev.map(b => b.id === pitchingBrief?.id ? { ...b, pitches_count: (b.pitches_count || 0) + 1 } : b));
        }}
      />

      {/* 3. Supervisor Post Brief Wizard (Supervisor 4-step Creator Brief) */}
      <SyncBriefCreationWizard
        isOpen={isCreateBriefOpen}
        onClose={() => setIsCreateBriefOpen(false)}
        sessionUser={sessionUser}
        onBriefCreated={(newBrief) => {
          setActiveBriefs(prev => [newBrief, ...prev]);
          showToast(`New brief "${newBrief.title}" published to creators!`);
        }}
      />

      {/* 4. Project Bins & Cue Sheet Modal (Supervisor Shortlist & PRO Cue Export) */}
      <SyncProjectBinsModal
        isOpen={isBinsModalOpen}
        onClose={() => setIsBinsModalOpen(false)}
        bins={projectBins}
        currentBinId={currentBinId}
        onSelectBin={(binId) => setCurrentBinId(binId)}
        onCreateBin={(newBin) => {
          setProjectBins(prev => [...prev, newBin]);
          setCurrentBinId(newBin.id);
          showToast(`Created new project bin "${newBin.name}"`);
        }}
        onRemoveTrackFromBin={(binId, trackId) => {
          setProjectBins(prev => prev.map(b => {
            if (b.id === binId) {
              return { ...b, tracks: b.tracks.filter(t => t.id !== trackId) };
            }
            return b;
          }));
        }}
        onOpenLicensingWizard={(track) => {
          setIsBinsModalOpen(false);
          setLicensingTrack(track);
          setIsLicensingOpen(true);
        }}
        playingTrackId={playingTrackId}
        onTogglePlay={handleTogglePlay}
      />
    </div>
  );
}
