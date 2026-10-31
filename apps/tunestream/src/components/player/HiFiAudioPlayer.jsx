import { initPlaybackSync, broadcastPlaybackStart, broadcastPlaybackStop } from '../../lib/playbackSync.js';
import React, { useState, useEffect, useRef } from 'react';
import {
  RiMusic2Fill, RiPlayFill, RiPauseFill, RiStopFill,
  RiSkipBackFill, RiSkipForwardFill, RiShuffleLine,
  RiRepeatLine, RiRepeatOneLine, RiVolumeUpFill,
  RiVolumeMuteFill, RiDragMove2Fill, RiSubtractFill,
  RiAddFill, RiCloseFill, RiDiscFill, RiPlayList2Fill,
  RiArrowUpSLine, RiArrowDownSLine, RiHeadphoneFill
} from 'react-icons/ri';
import { normalizeMediaUrl } from '../../lib/api.js';

export default function HiFiAudioPlayer({
  track,
  tracks = [],
  isPlaying = false,
  onTogglePlay,
  onTrackSelect,
  playlistName = '',
  accentColor = '#00f2fe',
  sessionUser = null,
  onClose
}) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isTracklistExpanded, setIsTracklistExpanded] = useState(false);
  const [isPlayerMuted, setIsPlayerMuted] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(0.85);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState('playlist'); // 'off' | 'track' | 'playlist'
  const [playbackProgress, setPlaybackProgress] = useState(0); // in seconds
  const [trackDuration, setTrackDuration] = useState(210); // in seconds
  const [previewLimitReached, setPreviewLimitReached] = useState(false);
  const [autoplayUnlocked, setAutoplayUnlocked] = useState(false);

  // Determine user credit status (defaulting to 150 free listener credits so playback works smoothly)
  const effectiveUser = sessionUser || (() => {
    try {
      const s = sessionStorage.getItem('tunestream_session') || sessionStorage.getItem('tunemavens_session') || localStorage.getItem('tunemavens_saved_user');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  const savedCredits = (() => {
    try {
      const c = localStorage.getItem('tunemavens_user_credits');
      return c ? parseInt(c, 10) : 150;
    } catch {
      return 150;
    }
  })();

    // Cross-Tab & Cross-Origin Playback Intelligence Synchronization
  useEffect(() => {
    const isBackend = Boolean(
      window.location.hash.includes('/dashboard') ||
      window.location.pathname.includes('/dashboard') ||
      window.location.hash.includes('/tour-capital') ||
      window.location.pathname.includes('/tour-capital')
    );
    const cleanup = initPlaybackSync({
      isBackend,
      onStopRemotePlayback: () => {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        }
        if (typeof onTogglePlay === 'function') {
          onTogglePlay(false);
        }
      }
    });
    return cleanup;
  }, [onTogglePlay]);

  const [simulateZeroCredits, setSimulateZeroCredits] = useState(false);
  const [tracksPlayedSinceAd, setTracksPlayedSinceAd] = useState(0);
  const [activeCorporateAd, setActiveCorporateAd] = useState(null);
  const [adCountdown, setAdCountdown] = useState(0);

  const rawUserCredits = effectiveUser?.credits ?? savedCredits ?? 150;
  const userCredits = simulateZeroCredits ? 0 : rawUserCredits;
  const hasCredits = userCredits > 0;
  // Always-Free accounts & 0-credit transitioned accounts get full track streaming supported by Corporate Ad intervals
  const PREVIEW_LIMIT = 999999;

  const triggerCorporateAdSpot = () => {
    fetch('/api/corporate/next-audio-ad')
      .then(r => r.ok ? r.json() : null)
      .then(ad => {
        const spot = ad || {
          id: 'corp-spot-safaricom',
          brand_name: 'Safaricom Neon Beats',
          company_name: 'Safaricom PLC',
          headline: 'Stream Music & Podcasts Anywhere with Safaricom 5G Bundles',
          spot_duration_seconds: 15,
          promo_code: 'SAFARITUNE25',
          destination_url: 'https://safaricom.co.ke/neon'
        };
        setActiveCorporateAd(spot);
        setAdCountdown(spot.spot_duration_seconds || 15);
      })
      .catch(() => {
        setActiveCorporateAd({
          id: 'corp-spot-safaricom',
          brand_name: 'Safaricom Neon Beats',
          company_name: 'Safaricom PLC',
          headline: 'Stream Music & Podcasts Anywhere with Safaricom 5G Bundles',
          spot_duration_seconds: 15,
          promo_code: 'SAFARITUNE25',
          destination_url: 'https://safaricom.co.ke/neon'
        });
        setAdCountdown(15);
      });
  };

  useEffect(() => {
    if (!activeCorporateAd || adCountdown <= 0) {
      if (activeCorporateAd && adCountdown <= 0) {
        setActiveCorporateAd(null);
      }
      return;
    }
    const t = setTimeout(() => setAdCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(t);
  }, [activeCorporateAd, adCountdown]);

  const [playerPos, setPlayerPos] = useState(() => ({
    x: Math.max(20, (typeof window !== 'undefined' ? window.innerWidth - 470 : 800)),
    y: Math.max(70, (typeof window !== 'undefined' ? window.innerHeight - 430 : 420))
  }));

  const audioRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Current playing track fallback
  const currentTrack = track || tracks[0] || {
    id: 'sample',
    title: 'Nairobi Sunset',
    artist: 'Ndufo',
    cover: '/uploads/artwork/ndufo_cover.jpg',
    isrc: 'KE-TM1-26-00042',
    duration: '3:45',
    genre: 'Afro-House'
  };

  // Active playlist name resolution
  const resolvedPlaylistName = playlistName || (() => {
    if (currentTrack?.isIntro) return 'Welcome Intro • Curated Background Audio';
    try {
      const saved = JSON.parse(localStorage.getItem('tunestream_listener_onboarding') || localStorage.getItem('tunestream_user_interests') || 'null');
      if (saved?.genres?.length) {
        return `Personalized Mix: ${saved.genres.slice(0, 2).join(' & ')}`;
      }
    } catch (_) {}
    return 'Featured Playlist: Global Afrobeat & Amapiano Masters';
  })();

  const currentIndex = tracks.findIndex(t => t.id === currentTrack.id || t.isrc === currentTrack.isrc || t.title === currentTrack.title);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  // Keep player on screen when tracklist is expanded
  useEffect(() => {
    if (isTracklistExpanded && typeof window !== 'undefined') {
      const maxTop = Math.max(60, window.innerHeight - 650);
      if (playerPos.y > maxTop) {
        setPlayerPos(prev => ({ ...prev, y: maxTop }));
      }
    }
  }, [isTracklistExpanded]);

  // Sync Audio source and play state + Autoplay unlock handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const rawAudio = currentTrack.audioUrl || currentTrack.audio_url || currentTrack.fileUrl;
    const streamSrc = rawAudio
      ? normalizeMediaUrl(rawAudio)
      : `/api/stream/track/${encodeURIComponent(currentTrack.isrc || currentTrack.id || currentTrack.title)}`;

    if (audio.src !== streamSrc && !audio.src.endsWith(streamSrc)) {
      audio.src = streamSrc;
      audio.load();
      setPlaybackProgress(0);
      setPreviewLimitReached(false);
    }

    if (isPlaying) {
      if (!hasCredits && audio.currentTime >= PREVIEW_LIMIT) {
        audio.pause();
        setPreviewLimitReached(true);
        if (onTogglePlay) onTogglePlay(false);
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setAutoplayUnlocked(true);
              const isBackend = Boolean(
                window.location.hash.includes('/dashboard') ||
                window.location.pathname.includes('/dashboard') ||
                window.location.hash.includes('/tour-capital')
              );
              broadcastPlaybackStart(isBackend ? 'backend' : 'frontend', currentTrack);
            })
            .catch(() => {
              // Browser autoplay policy blocked initial unmuted play before gesture:
              // Unlock automatically on the very first user gesture anywhere on the page
              const unlockAudio = () => {
                if (audioRef.current && isPlaying) {
                  audioRef.current.play().then(() => setAutoplayUnlocked(true)).catch(() => {});
                }
                window.removeEventListener('pointerdown', unlockAudio, true);
                window.removeEventListener('keydown', unlockAudio, true);
                window.removeEventListener('touchstart', unlockAudio, true);
              };
              window.addEventListener('pointerdown', unlockAudio, true);
              window.addEventListener('keydown', unlockAudio, true);
              window.addEventListener('touchstart', unlockAudio, true);
            });
        }
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, hasCredits]);

  // Fallback visual progress ticker if isPlaying is true while browser waits for first gesture or stream buffer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      const audio = audioRef.current;
      if (!audio || audio.paused) {
        setPlaybackProgress(prev => {
          const maxDur = hasCredits ? (trackDuration || 210) : PREVIEW_LIMIT;
          if (prev + 1 >= maxDur) return 0;
          return prev + 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, hasCredits, trackDuration]);

  // Sync volume & mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isPlayerMuted ? 0 : playerVolume;
  }, [playerVolume, isPlayerMuted]);

  // Time update with 30s limit
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const current = audio.currentTime;
    setPlaybackProgress(Math.floor(current));

    if (!hasCredits && current >= PREVIEW_LIMIT) {
      audio.pause();
      audio.currentTime = PREVIEW_LIMIT;
      setPlaybackProgress(PREVIEW_LIMIT);
      setPreviewLimitReached(true);
      if (onTogglePlay) onTogglePlay(false);
    }
  };

  // Track advance handler (inserts Corporate Ad Spot at intervals when on Free / 0-Credit tier)
  const handleTrackAdvance = () => {
    if (!tracks || tracks.length === 0) return;
    setPreviewLimitReached(false);
    if (!hasCredits) {
      const nextCount = tracksPlayedSinceAd + 1;
      if (nextCount >= 2) {
        setTracksPlayedSinceAd(0);
        triggerCorporateAdSpot();
      } else {
        setTracksPlayedSinceAd(nextCount);
      }
    }
    if (repeatMode === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setPlaybackProgress(0);
      return;
    }
    if (shuffleMode && tracks.length > 1) {
      let nextIdx = Math.floor(Math.random() * tracks.length);
      if (nextIdx === safeIndex) nextIdx = (nextIdx + 1) % tracks.length;
      if (onTrackSelect) onTrackSelect(tracks[nextIdx]);
      return;
    }
    if (safeIndex < tracks.length - 1) {
      if (onTrackSelect) onTrackSelect(tracks[safeIndex + 1]);
    } else if (repeatMode === 'playlist') {
      if (onTrackSelect) onTrackSelect(tracks[0]);
    } else {
      if (onTogglePlay) onTogglePlay(false);
    }
  };

  const handleTrackPrevious = () => {
    if (!tracks || tracks.length === 0) return;
    setPreviewLimitReached(false);
    if (playbackProgress > 4 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setPlaybackProgress(0);
      return;
    }
    if (shuffleMode && tracks.length > 1) {
      const nextIdx = Math.floor(Math.random() * tracks.length);
      if (onTrackSelect) onTrackSelect(tracks[nextIdx]);
      return;
    }
    const prevIdx = safeIndex === 0 ? tracks.length - 1 : safeIndex - 1;
    if (onTrackSelect) onTrackSelect(tracks[prevIdx]);
  };

  const handleSeek = (newSec) => {
    const targetSec = !hasCredits ? Math.min(newSec, PREVIEW_LIMIT) : newSec;
    setPlaybackProgress(targetSec);
    if (audioRef.current) {
      audioRef.current.currentTime = targetSec;
      if (!hasCredits && targetSec < PREVIEW_LIMIT) {
        setPreviewLimitReached(false);
      }
    }
  };

  const handleTogglePlay = () => {
    if (!isPlaying && !hasCredits && playbackProgress >= PREVIEW_LIMIT) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setPlaybackProgress(0);
        setPreviewLimitReached(false);
      }
    }
    if (onTogglePlay) onTogglePlay(!isPlaying);
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayerVisible(false);
    if (onTogglePlay) onTogglePlay(false);
    if (onClose) onClose();
  };

  const handleMouseDownDrag = (e) => {
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: playerPos.x,
      posY: playerPos.y
    };

    const handleMouseMove = (moveEvt) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvt.clientX - dragStartRef.current.mouseX;
      const dy = moveEvt.clientY - dragStartRef.current.mouseY;
      const newX = Math.max(10, Math.min(window.innerWidth - 340, dragStartRef.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, dragStartRef.current.posY + dy));
      setPlayerPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const effectiveMaxDuration = hasCredits ? (trackDuration || 210) : PREVIEW_LIMIT;

  return (
    <>
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        autoPlay={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setTrackDuration(Math.floor(audioRef.current.duration));
          }
        }}
        onEnded={handleTrackAdvance}
        style={{ display: 'none' }}
      />

      {/* Floating Minimized Pill when player closed/minimized */}
      {!isPlayerVisible && (
        <div
          data-testid="hifi-player-pill-wrapper"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsPlayerVisible(true);
              setIsPlayerMinimized(false);
            }}
            title="Open TuneStream Hi-Fi Player"
            data-testid="hifi-player-pill"
            style={{
              background: isPlaying ? 'rgba(12, 18, 34, 0.96)' : 'rgba(15, 23, 42, 0.94)',
              border: `1.5px solid ${isPlaying ? '#22c55e' : accentColor}`,
              borderRadius: '3px',
              padding: '8px 14px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.65)',
              backdropFilter: 'blur(12px)',
              fontSize: '0.8rem',
              fontWeight: 800
            }}
          >
            <span style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: isPlaying ? '#22c55e' : accentColor,
              boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none',
              display: 'inline-block'
            }} />
            <RiMusic2Fill style={{ color: accentColor, fontSize: '1.05rem' }} />
            <span>{resolvedPlaylistName} • {currentTrack.title}</span>
          </button>
          <button
            type="button"
            data-testid="close-hifi-pill-btn"
            onClick={handleClosePlayer}
            title="Close Web Player"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1.5px solid rgba(255,255,255,0.2)',
              borderRadius: '3px',
              color: '#94a3b8',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RiCloseFill size={16} />
          </button>
        </div>
      )}

      {/* Floating Draggable Overlay Card */}
      {isPlayerVisible && (
        <div
          data-testid="hifi-player-card"
          style={{
            position: 'fixed',
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
            zIndex: 9000,
            width: isPlayerMinimized ? '340px' : '450px',
            maxWidth: 'calc(100vw - 24px)',
            background: 'rgba(10, 14, 28, 0.97)',
            backdropFilter: 'blur(22px)',
            border: `1.5px solid ${accentColor}66`,
            borderRadius: '3px',
            boxShadow: `0 20px 56px rgba(0,0,0,0.85), 0 0 28px ${accentColor}33`,
            color: '#fff',
            userSelect: 'none',
            transition: 'box-shadow 0.2s ease, width 0.2s ease'
          }}
        >
          {/* Draggable Header */}
          <div
            onMouseDown={handleMouseDownDrag}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: `1px solid ${accentColor}33`,
              background: 'rgba(0,0,0,0.35)',
              cursor: 'grab',
              borderRadius: '3px 3px 0 0'
            }}
            title="Click and drag anywhere on this header to move player"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <RiDragMove2Fill style={{ color: accentColor, fontSize: '1.05rem', flexShrink: 0 }} />
              <span style={{ fontWeight: 900, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                TuneStream Hi-Fi Player
              </span>
              <span style={{
                background: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}55`,
                padding: '1px 6px',
                borderRadius: '3px',
                fontSize: '0.62rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                flexShrink: 0
              }}>
                24-BIT FLAC
              </span>
            </div>

            {/* Window Controls: Expand Tracklist, Minimize & Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              {!isPlayerMinimized && (
                <button
                  type="button"
                  onClick={() => setIsTracklistExpanded(!isTracklistExpanded)}
                  title={isTracklistExpanded ? "Collapse Playlist Tracklist" : "Expand Playlist Tracklist"}
                  data-testid="toggle-tracklist-header-btn"
                  style={{
                    background: isTracklistExpanded ? `${accentColor}25` : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isTracklistExpanded ? accentColor : 'rgba(255,255,255,0.14)'}`,
                    color: isTracklistExpanded ? accentColor : '#cbd5e1',
                    padding: '3px 8px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 800
                  }}
                >
                  <RiPlayList2Fill size={13} />
                  <span>{isTracklistExpanded ? 'Hide List' : `Tracks (${tracks.length || 1})`}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
                title={isPlayerMinimized ? "Expand Player" : "Minimize Player"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}
              >
                {isPlayerMinimized ? <RiAddFill size={15} /> : <RiSubtractFill size={15} />}
              </button>
              <button
                type="button"
                data-testid="close-hifi-player-btn"
                onClick={handleClosePlayer}
                title="Close Web Player"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
              >
                <RiCloseFill size={18} />
              </button>
            </div>
          </div>

          {/* Minimized Compact View */}
          {isPlayerMinimized ? (
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.65rem', color: accentColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                ● Playing Playlist: {resolvedPlaylistName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={normalizeMediaUrl(currentTrack.cover || currentTrack.coverArt)}
                  alt={currentTrack.title}
                  onError={(e) => { if (e.currentTarget.dataset.fallback) return; e.currentTarget.dataset.fallback = 'true'; e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                  style={{ width: '36px', height: '36px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${accentColor}44` }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentTrack.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>
                    {currentTrack.artist} • {formatSec(playbackProgress)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '3px',
                    background: accentColor,
                    color: '#000',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                </button>
                <button
                  type="button"
                  onClick={handleTrackAdvance}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <RiSkipForwardFill />
                </button>
              </div>
            </div>
          ) : (
            /* Full Player Controls */
            <div style={{ padding: '12px 16px 14px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {/* Active Playlist Banner + Expand Tracklist Toggle */}
              <div
                data-testid="active-playlist-banner"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '8px 11px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, rgba(0, 242, 254, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
                  border: '1px solid rgba(0, 242, 254, 0.28)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '3px',
                    background: 'rgba(0, 242, 254, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accentColor,
                    flexShrink: 0
                  }}>
                    <RiDiscFill size={15} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isPlaying ? '#22c55e' : '#f59e0b',
                        boxShadow: isPlaying ? '0 0 6px #22c55e' : 'none',
                        display: 'inline-block'
                      }} />
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {isPlaying ? 'Now Playing Playlist' : 'Active Playlist'}
                      </span>
                    </div>
                    <div
                      data-testid="current-playlist-title"
                      style={{
                        fontSize: '0.79rem',
                        fontWeight: 800,
                        color: '#fff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px'
                      }}
                      title={resolvedPlaylistName}
                    >
                      {resolvedPlaylistName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-testid="expand-playlist-tracks-btn"
                  onClick={() => setIsTracklistExpanded(!isTracklistExpanded)}
                  style={{
                    background: isTracklistExpanded ? accentColor : 'rgba(255,255,255,0.08)',
                    color: isTracklistExpanded ? '#060813' : '#fff',
                    border: `1px solid ${isTracklistExpanded ? accentColor : 'rgba(255,255,255,0.18)'}`,
                    borderRadius: '3px',
                    padding: '5px 10px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{isTracklistExpanded ? 'Hide Tracks' : `Expand (${tracks.length || 1})`}</span>
                  {isTracklistExpanded ? <RiArrowUpSLine size={15} /> : <RiArrowDownSLine size={15} />}
                </button>
              </div>

              {/* Track Metadata Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '10px 12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={normalizeMediaUrl(currentTrack.cover || currentTrack.coverArt)}
                    alt={currentTrack.title}
                    onError={(e) => { if (e.currentTarget.dataset.fallback) return; e.currentTarget.dataset.fallback = 'true'; e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '3px',
                      objectFit: 'cover',
                      border: isPlaying ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: isPlaying ? `0 0 14px ${accentColor}66` : 'none',
                      transition: 'border 0.2s ease, box-shadow 0.2s ease'
                    }}
                  />
                  {isPlaying && (
                    <div style={{ position: 'absolute', bottom: '3px', right: '3px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: '0.92rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentTrack.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: accentColor, marginTop: '2px', fontWeight: 700, display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span>{currentTrack.artist}</span>
                    <span>•</span>
                    <span>{currentTrack.genre || '24-Bit Studio FLAC'}</span>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span data-no-i18n="true" data-testid="hifi-credit-badge" style={{
                      background: hasCredits ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.16)',
                      color: hasCredits ? '#22c55e' : '#fbbf24',
                      border: hasCredits ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(245,158,11,0.4)',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      fontSize: '0.61rem',
                      fontWeight: 800
                    }}>
                      {hasCredits ? `Ad-Free 24-Bit FLAC (${userCredits} Credits)` : 'Always-Free Tier • Ad-Supported'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextZero = !simulateZeroCredits;
                        setSimulateZeroCredits(nextZero);
                        if (nextZero) triggerCorporateAdSpot();
                        else setActiveCorporateAd(null);
                      }}
                      title="Toggle between Active Credits (Ad-Free) and 0 Credits (Auto-Transition to Always-Free Ad-Supported Tier)"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        color: '#cbd5e1',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        fontSize: '0.59rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {simulateZeroCredits ? 'Restore Credits' : 'Test 0-Credit Ad Mode'}
                    </button>
                    <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                      • {safeIndex + 1}/{tracks.length || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Playlist Tracklist Drawer (Makes Player Taller) */}
              {isTracklistExpanded && (
                <div
                  data-testid="expanded-playlist-tracklist"
                  style={{
                    background: 'rgba(5, 8, 18, 0.9)',
                    border: '1px solid rgba(0, 242, 254, 0.22)',
                    borderRadius: '3px',
                    maxHeight: '230px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{
                    padding: '7px 10px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    background: '#080c1a',
                    zIndex: 2
                  }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Playlist Queue ({tracks.length} Tracks)
                    </span>
                    <span style={{ fontSize: '0.64rem', color: '#64748b' }}>
                      Click any track to play
                    </span>
                  </div>

                  {tracks.map((t, idx) => {
                    const isCurrent = idx === safeIndex;
                    return (
                      <div
                        key={t.id || t.isrc || idx}
                        onClick={() => {
                          setPreviewLimitReached(false);
                          if (onTrackSelect) onTrackSelect(t);
                          if (!isPlaying && onTogglePlay) onTogglePlay(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: isCurrent ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ width: '18px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 800, color: isCurrent ? accentColor : '#64748b', flexShrink: 0 }}>
                          {isCurrent ? (isPlaying ? '▶' : '⏸') : idx + 1}
                        </div>
                        <img
                          src={normalizeMediaUrl(t.cover || t.coverArt)}
                          alt={t.title}
                          onError={(e) => { if (e.currentTarget.dataset.fallback) return; e.currentTarget.dataset.fallback = 'true'; e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '3px',
                            objectFit: 'cover',
                            flexShrink: 0,
                            border: isCurrent ? `1px solid ${accentColor}` : '1px solid rgba(255,255,255,0.1)'
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '0.78rem',
                            fontWeight: isCurrent ? 800 : 600,
                            color: isCurrent ? accentColor : '#f1f5f9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {t.title}
                          </div>
                          <div style={{
                            fontSize: '0.67rem',
                            color: '#94a3b8',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {t.artist} {t.genre ? `• ${t.genre}` : ''}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.65rem',
                          color: isCurrent ? accentColor : '#64748b',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {t.duration || '3:30'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Corporate Ad Services Audio Interstitial Banner (Plays at intervals on Always-Free / 0-Credit Tier) */}
              {activeCorporateAd && (
                <div
                  data-testid="corporate-ad-interstitial"
                  style={{
                    padding: '10px 12px',
                    borderRadius: '3px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(15, 23, 42, 0.96) 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.55)',
                    color: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      📢 Corporate Ad Services Spot • Resumes in {adCountdown}s
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700 }}>
                      Code: <strong style={{ color: '#00f2fe' }}>{activeCorporateAd.promo_code || 'SAFARITUNE25'}</strong>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>
                    {activeCorporateAd.brand_name}: {activeCorporateAd.headline}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <a
                      href={activeCorporateAd.destination_url || 'https://safaricom.co.ke'}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.68rem', color: '#00f2fe', fontWeight: 800, textDecoration: 'underline' }}
                    >
                      Visit Sponsor &rarr;
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCorporateAd(null);
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(new CustomEvent('tunestreamOpenReload'));
                          window.dispatchEvent(new CustomEvent('tunemavens-prompt-credit-reload', {
                            detail: { reason: 'Remove Ads & Unlock 24-Bit Lossless with Non-Expiring Credits' }
                          }));
                        }
                      }}
                      style={{
                        background: '#00f2fe',
                        color: '#060813',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '4px 9px',
                        fontSize: '0.66rem',
                        fontWeight: 900,
                        cursor: 'pointer'
                      }}
                    >
                      Remove Ads — Top Up Credits
                    </button>
                  </div>
                </div>
              )}

              {/* Scrubber & Timers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', minWidth: '32px' }}>
                    {formatSec(playbackProgress)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={effectiveMaxDuration}
                    value={playbackProgress}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    style={{ flex: 1, accentColor, cursor: 'pointer', height: '4px' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: !hasCredits ? '#f59e0b' : '#94a3b8', fontFamily: 'monospace', minWidth: '32px', textAlign: 'right' }}>
                    {formatSec(trackDuration)}
                  </span>
                </div>
              </div>

              {/* Playback Controls & Mode Switches */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '2px' }}>
                <button
                  type="button"
                  onClick={() => setShuffleMode(!shuffleMode)}
                  title={shuffleMode ? "Shuffle: Random On" : "Shuffle: Sequenced"}
                  style={{
                    background: shuffleMode ? `${accentColor}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${shuffleMode ? accentColor : 'rgba(255,255,255,0.15)'}`,
                    color: shuffleMode ? accentColor : '#94a3b8',
                    padding: '8px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    fontWeight: 800
                  }}
                >
                  <RiShuffleLine size={15} />
                  <span>{shuffleMode ? 'Random' : 'Order'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={handleTrackPrevious}
                    title="Previous Track"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '3px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}
                  >
                    <RiSkipBackFill />
                  </button>

                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    title={isPlaying ? "Pause" : "Play"}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '3px',
                      background: accentColor,
                      border: 'none',
                      color: '#000',
                      fontSize: '1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 14px ${accentColor}66`
                    }}
                  >
                    {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                      if (onTogglePlay) onTogglePlay(false);
                      setPlaybackProgress(0);
                    }}
                    title="Stop Track"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '3px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.95rem'
                    }}
                  >
                    <RiStopFill />
                  </button>

                  <button
                    type="button"
                    onClick={handleTrackAdvance}
                    title="Next Track"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '3px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}
                  >
                    <RiSkipForwardFill />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nextMode = repeatMode === 'off' ? 'playlist' : repeatMode === 'playlist' ? 'track' : 'off';
                    setRepeatMode(nextMode);
                  }}
                  title="Toggle Repeat Mode"
                  style={{
                    background: repeatMode !== 'off' ? `${accentColor}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${repeatMode !== 'off' ? accentColor : 'rgba(255,255,255,0.15)'}`,
                    color: repeatMode !== 'off' ? accentColor : '#94a3b8',
                    padding: '8px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.76rem',
                    fontWeight: 800
                  }}
                >
                  {repeatMode === 'track' ? <RiRepeatOneLine size={15} /> : <RiRepeatLine size={15} />}
                  <span>{repeatMode === 'track' ? 'Track' : repeatMode === 'playlist' ? 'Loop' : 'Off'}</span>
                </button>
              </div>

              {/* Volume & TuneStream Engine Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPlayerMuted(!isPlayerMuted)}
                    title={isPlayerMuted ? "Unmute" : "Mute"}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isPlayerMuted ? '#f43f5e' : '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isPlayerMuted ? <RiVolumeMuteFill size={17} /> : <RiVolumeUpFill size={17} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isPlayerMuted ? 0 : playerVolume}
                    onChange={(e) => {
                      setPlayerVolume(Number(e.target.value));
                      if (isPlayerMuted) setIsPlayerMuted(false);
                    }}
                    style={{ width: '80px', accentColor, cursor: 'pointer', height: '4px' }}
                  />
                </div>

                <div style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <RiHeadphoneFill size={12} color={accentColor} />
                  <span>TuneStream 24-Bit Engine</span>
                  <span style={{ color: '#22c55e' }}>●</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
