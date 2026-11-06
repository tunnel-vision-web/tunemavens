import React, { useState, useEffect, useRef } from 'react';
import {
  RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill,
  RiVolumeUpFill, RiVolumeMuteFill, RiShuffleFill, RiRepeat2Fill,
  RiHeart3Fill, RiHeart3Line, RiCoinsFill, RiDownload2Fill,
  RiDownload2Line, RiCompass3Line, RiHomeFill, RiFolderMusicLine,
  RiEqualizerFill, RiSmartphoneFill, RiComputerLine, RiCloseFill,
  RiSearchLine, RiCheckFill, RiShieldCheckFill, RiQrCodeLine,
  RiRadio2Fill, RiFlashlightFill, RiArrowRightSFill, RiHeadphoneFill,
  RiMusic2Fill, RiUserStarFill, RiExchangeDollarLine, RiTicket2Fill,
  RiWifiFill, RiBattery2ChargeFill, RiSignalTowerFill, RiExternalLinkLine,
  RiFileLine, RiCarLine, RiBroadcastFill, RiTimeLine
} from 'react-icons/ri';

import tsLogo from '../../assets/tunestream-logo.png';
import {
  getUnifiedCatalog,
  AUTHORITATIVE_CATALOG_TRACKS,
  AUTHORITATIVE_CATALOG_ARTISTS
} from '../../data/authoritativeCatalog';
import { AUTHORITATIVE_EVENTS } from '../../data/authoritativeEvents';
import { initPlaybackSync, broadcastPlaybackStart, broadcastPlaybackStop } from '../../lib/playbackSync';
import { useRegion } from '../../RegionContext';
import { streamApi } from '../../lib/api';
import {
  triggerHaptic,
  updateNativeMediaSession,
  saveTrackToOfflineCache,
  removeTrackFromOfflineCache,
  calculateCacheUsage,
  queueOfflineTip,
  flushQueuedTips
} from '../../services/nativeBridge';
import CreditReloadModal from '../common/CreditReloadModal.jsx';
import './TuneStreamNativeApp.css';

// Pre-configured 10-band EQ presets
const EQ_PRESETS = {
  'afrobeat': { name: 'Afrobeat Punch & Sub', bands: [6, 5, 3, 1, 0, 2, 3, 4, 3, 2] },
  'amapiano': { name: 'Amapiano Log Drum Sub', bands: [8, 7, 4, 1, -1, 0, 2, 4, 5, 3] },
  'flat': { name: 'Studio Reference (Flat)', bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  'vocal': { name: 'Acoustic & Vocal Air', bands: [-1, 0, 1, 3, 5, 4, 3, 2, 3, 4] },
  'club': { name: 'Club System Highs', bands: [5, 4, 2, 0, 1, 2, 4, 6, 5, 4] }
};

const FREQ_LABELS = ['32Hz', '64Hz', '125Hz', '250Hz', '500Hz', '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'];

export default function TuneStreamNativeApp({
  sessionUser,
  onLogout,
  onClose,
  initialTrack = null
}) {
  const { country, currencyInfo, convertPrice, language } = useRegion();
  const isSwahili = language === 'sw';

  // Layout View Mode: 'phone' (mobile bezel) | 'fullscreen' (tablet/desktop)
  const [viewMode, setViewMode] = useState('phone');
  
  // Navigation Tabs: 'home' | 'explore' | 'offline' | 'wallet' | 'eq'
  const [activeTab, setActiveTab] = useState('home');

  // Unified Catalog Tracks & Artists
  const [tracks, setTracks] = useState(getUnifiedCatalog);
  const [artists] = useState(AUTHORITATIVE_CATALOG_ARTISTS);
  const [currentTrack, setCurrentTrack] = useState(() => initialTrack || tracks[0] || AUTHORITATIVE_CATALOG_TRACKS[0]);
  
  // Audio Playback Engine
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  // 30s Free Preview Protocol
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [hasUnlockedMaster, setHasUnlockedMaster] = useState(false);

  // Likes & Offline Cache
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_native_likes');
      return saved ? JSON.parse(saved) : [1789418313563, 1789167248705];
    } catch {
      return [1789418313563];
    }
  });

  const [cacheUsage, setCacheUsage] = useState(calculateCacheUsage);
  const [isOfflineOnly, setIsOfflineOnly] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState(false); // 128k vs Lossless FLAC

  // Credits Balance
  const [userCredits, setUserCredits] = useState(() => {
    try {
      const saved = localStorage.getItem('tunemavens_user_credits');
      return saved ? parseInt(saved, 10) : 650;
    } catch {
      return 650;
    }
  });

  // Equalizer & DAC State
  const [activePresetKey, setActivePresetKey] = useState('afrobeat');
  const [eqBands, setEqBands] = useState(EQ_PRESETS['afrobeat'].bands);
  const [isDacHardwareActive, setIsDacHardwareActive] = useState(true);
  const [audioOutputDevice, setAudioOutputDevice] = useState('speaker'); // 'speaker' | 'airpods' | 'carplay' | 'dac'

  // Modals & Drawers
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipSuccessToast, setTipSuccessToast] = useState(null);
  const [isReloadModalOpen, setIsReloadModalOpen] = useState(false);
  const [activeQrPass, setActiveQrPass] = useState(null);
  const [isLyricsDrawerOpen, setIsLyricsDrawerOpen] = useState(false);
  const [isLinerNotesOpen, setIsLinerNotesOpen] = useState(false);

  // Explore Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  // DOM Refs
  const audioRef = useRef(null);
  const phoneClock = '09:41';
  const [showIosPrompt, setShowIosPrompt] = useState(() => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
    return isIOS && !isStandalone;
  });

  // Synchronize playback across tabs
  useEffect(() => {
    const cleanup = initPlaybackSync({
      onStopRemotePlayback: () => {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    });
    return cleanup;
  }, []);

  // Sync Audio element
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Catalog update listener
  useEffect(() => {
    const handleCatalogUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setTracks(e.detail);
      }
    };
    window.addEventListener('tunemavens:catalog_updated', handleCatalogUpdate);
    return () => window.removeEventListener('tunemavens:catalog_updated', handleCatalogUpdate);
  }, []);

  // Flush queued tips on reconnect
  useEffect(() => {
    const handleOnline = async () => {
      const flushed = await flushQueuedTips();
      if (flushed.length > 0) {
        setTipSuccessToast(`Synced ${flushed.length} offline tips to creator ledgers!`);
        setTimeout(() => setTipSuccessToast(null), 4000);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Update MediaSession
  useEffect(() => {
    if (currentTrack) {
      updateNativeMediaSession({
        track: currentTrack,
        isPlaying,
        onPlay: handlePlayPause,
        onPause: handlePlayPause,
        onNext: handleNextTrack,
        onPrev: handlePrevTrack,
        onSeek: (seconds) => {
          if (audioRef.current) {
            audioRef.current.currentTime = seconds;
            setCurrentTime(seconds);
          }
        }
      });
    }
  }, [currentTrack, isPlaying]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    triggerHaptic('light');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      broadcastPlaybackStop();
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        broadcastPlaybackStart(null, currentTrack);
      }).catch(err => {
        console.debug('Playback resume notice:', err);
      });
    }
  };

  // Play a specific track
  const handleSelectTrack = (track) => {
    triggerHaptic('medium');
    setCurrentTrack(track);
    setIsPreviewMode(true);
    setHasUnlockedMaster(false);
    setCurrentTime(0);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          broadcastPlaybackStart(null, track);
        }).catch(() => {});
      }
    }, 50);
  };

  // Next / Prev
  const handleNextTrack = () => {
    triggerHaptic('light');
    const available = isOfflineOnly ? cacheUsage.tracks : tracks;
    if (available.length === 0) return;
    const currentIndex = available.findIndex(t => t.id === currentTrack?.id);
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * available.length);
    } else if (nextIndex >= available.length) {
      nextIndex = 0;
    }
    handleSelectTrack(available[nextIndex]);
  };

  const handlePrevTrack = () => {
    triggerHaptic('light');
    const available = isOfflineOnly ? cacheUsage.tracks : tracks;
    if (available.length === 0) return;
    const currentIndex = available.findIndex(t => t.id === currentTrack?.id);
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = available.length - 1;
    handleSelectTrack(available[prevIndex]);
  };

  // 30s preview countdown and time updates
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const curr = audioRef.current.currentTime;
    setCurrentTime(curr);
    setDuration(audioRef.current.duration || 210);

    // 30-Second Free Preview Gating Protocol
    if (isPreviewMode && !hasUnlockedMaster && curr >= 30) {
      audioRef.current.pause();
      setIsPlaying(false);
      triggerHaptic('heavy');
    }
  };

  // Unlock full master using 1 TM Credit
  const handleUnlockMaster = () => {
    if (userCredits < 1) {
      setIsReloadModalOpen(true);
      return;
    }
    triggerHaptic('success');
    const newBal = userCredits - 1;
    setUserCredits(newBal);
    localStorage.setItem('tunemavens_user_credits', newBal.toString());
    setHasUnlockedMaster(true);
    setIsPreviewMode(false);
    
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
    setTipSuccessToast('Master unlocked for 1 TM Credit (Lossless 24-Bit FLAC)');
    setTimeout(() => setTipSuccessToast(null), 3500);
  };

  // Toggle Like
  const handleToggleLike = (trackId) => {
    triggerHaptic('light');
    setLikes(prev => {
      const exists = prev.includes(trackId);
      const updated = exists ? prev.filter(id => id !== trackId) : [...prev, trackId];
      localStorage.setItem('tunestream_native_likes', JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle Offline Cache
  const handleToggleOfflineCache = (track) => {
    const isCached = cacheUsage.tracks.some(t => t.id === track.id);
    if (isCached) {
      removeTrackFromOfflineCache(track.id);
    } else {
      saveTrackToOfflineCache(track);
    }
    setCacheUsage(calculateCacheUsage());
  };

  // Direct 1-Tap Tipping Protocol
  const handleExecuteTip = async (amountCredits, rail = 'mpesa') => {
    if (userCredits < amountCredits) {
      setIsReloadModalOpen(true);
      return;
    }
    triggerHaptic('success');
    const newBal = userCredits - amountCredits;
    setUserCredits(newBal);
    localStorage.setItem('tunemavens_user_credits', newBal.toString());
    setIsTipModalOpen(false);

    const tipData = {
      creator: currentTrack.artist,
      trackTitle: currentTrack.title,
      credits: amountCredits,
      rail,
      timestamp: Date.now()
    };

    if (navigator.onLine) {
      try {
        await streamApi.tipArtist({
          creator_id: currentTrack.artist,
          amount_credits: amountCredits,
          track_id: currentTrack.id,
          message: 'Native App mid-track listener tip'
        });
      } catch (err) {
        console.debug('Direct streamApi tip logged locally:', err);
      }
    } else {
      queueOfflineTip(tipData);
    }

    setTipSuccessToast(
      isSwahili
        ? `Asante! Tip ya ${amountCredits} Credits imetumwa kwa ${currentTrack.artist} (95% moja kwa moja)`
        : `Sent ${amountCredits} Credits tip to ${currentTrack.artist} (95% direct to artist ledger)`
    );
    setTimeout(() => setTipSuccessToast(null), 4500);
  };

  // Format MM:SS
  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Filtered tracks for explore tab
  const filteredTracks = tracks.filter(t => {
    const matchesSearch = searchQuery === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || 
      (t.genre && t.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="tunestream-native-wrapper">
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl || '/uploads/audio/pray_tell.wav'}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNextTrack}
      />

      {/* iOS Safari Home Screen Installation Tip Banner */}
      {showIosPrompt && (
        <div style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(0, 242, 254, 0.2))",
          border: "1px solid rgba(16, 185, 129, 0.5)",
          borderRadius: "4px",
          padding: "12px 16px",
          margin: "0 auto 16px",
          maxWidth: "560px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px", flexShrink: 0 }}>📲</span>
            <div style={{ fontSize: "12px", lineHeight: 1.45 }}>
              <div style={{ fontWeight: 800, color: "#10b981" }}>Install TuneStream App to iPhone:</div>
              <div style={{ color: "#cbd5e1" }}>
                Tap Safari's Share button <span style={{ color: "#00f2fe", fontWeight: 900 }}>[↑]</span> below, then select <strong>"Add to Home Screen"</strong>.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowIosPrompt(false)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px"
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Outer Shell Mode Toggle Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        background: '#070c18',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={tsLogo} alt="TuneStream Native Logo" style={{ height: '28px', width: 'auto' }} />
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>
            TuneStream Native App
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '3px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            iOS &amp; Android (Capacitor)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { triggerHaptic('light'); setViewMode('phone'); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: viewMode === 'phone' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
              background: viewMode === 'phone' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
              color: viewMode === 'phone' ? '#10b981' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiSmartphoneFill size={15} /> Phone Chassis
          </button>

          <button
            type="button"
            onClick={() => { triggerHaptic('light'); setViewMode('fullscreen'); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: viewMode === 'fullscreen' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
              background: viewMode === 'fullscreen' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
              color: viewMode === 'fullscreen' ? '#00f2fe' : '#94a3b8',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiComputerLine size={15} /> Expanded Canvas
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                marginLeft: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RiCloseFill size={16} /> Close
            </button>
          )}
        </div>
      </div>

      {/* Main Container Chassis */}
      <div className={viewMode === 'phone' ? 'tunestream-phone-chassis' : 'tunestream-fullscreen-chassis'}>
        
        {/* Dynamic Island & Status Bar (in Phone mode) */}
        {viewMode === 'phone' && (
          <div className="phone-status-bar">
            <span>{phoneClock}</span>
            <div className="dynamic-island">
              <div className="island-camera" />
              {isPlaying ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div className="island-audio-indicator" />
                  <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 800 }}>FLAC</span>
                </div>
              ) : (
                <span style={{ fontSize: '9px', color: '#64748b' }}>TuneStream</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RiSignalTowerFill size={12} />
              <RiWifiFill size={12} />
              <RiBattery2ChargeFill size={14} color="#10b981" />
            </div>
          </div>
        )}

        {/* In-App Top Bar Header */}
        <header className="app-shell-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={tsLogo} alt="TuneStream" style={{ height: '24px', width: 'auto' }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              background: '#091328',
              color: '#00f2fe',
              padding: '2px 6px',
              borderRadius: '3px',
              border: '1px solid rgba(0, 242, 254, 0.3)'
            }}>
              {country}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Shared TM Credits Balance Pill */}
            <div
              onClick={() => setIsReloadModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '4px 8px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
              title="Shared Intermaven Credits Vault"
            >
              <RiCoinsFill color="#10b981" size={13} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                {userCredits} TM
              </span>
              <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 900 }}>+</span>
            </div>

            {/* Offline status dot */}
            <div
              onClick={() => setActiveTab('offline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '4px 8px',
                borderRadius: '3px',
                fontSize: '10px',
                color: isOfflineOnly ? '#f59e0b' : '#10b981',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isOfflineOnly ? '#f59e0b' : '#10b981'
              }} />
              <span>{isOfflineOnly ? '8GB Crate' : 'Lossless DAC'}</span>
            </div>
          </div>
        </header>

        {/* Toast Alert */}
        {tipSuccessToast && (
          <div style={{
            background: 'linear-gradient(90deg, #10b981, #059669)',
            color: '#fff',
            padding: '8px 16px',
            fontSize: '11px',
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <RiCheckFill size={14} /> {tipSuccessToast}
          </div>
        )}

        {/* Scrollable Main Content Body */}
        <main className="app-shell-body">
          {/* TAB 1: HOME (For You & Mixes) */}
          {activeTab === 'home' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Hero Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(9, 14, 28, 0.95) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '3px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>
                  24-Bit Studio FLAC Streaming
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '4px 0 6px' }}>
                  {isSwahili ? 'Sikiliza Bila Kikomo' : 'Feel The Crowd. Off-Grid.'}
                </h3>
                <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '0 0 12px', lineHeight: 1.45 }}>
                  {isSwahili
                    ? 'Pakua hadi 8GB ya muziki wa hali ya juu. Tuma tip moja kwa moja kwa msanii bila wapatanishi.'
                    : 'Cache 8GB of studio FLAC locally. Direct 1-tap tipping flows into the creator split ledger within 24 hours.'}
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => handleSelectTrack(tracks[0])}
                    style={{
                      background: '#10b981',
                      color: '#060813',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '8px 14px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RiPlayFill size={14} /> Play Quick Mix
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('wallet')}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '3px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Tour Passes
                  </button>
                </div>
              </div>

              {/* Quick Utility Tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { label: 'Live Radio', icon: RiRadio2Fill, color: '#ec4899', action: () => handleSelectTrack(tracks[1] || tracks[0]) },
                  { label: '8GB Crate', icon: RiDownload2Fill, color: '#00f2fe', action: () => setActiveTab('offline') },
                  { label: 'Studio EQ', icon: RiEqualizerFill, color: '#10b981', action: () => setActiveTab('eq') },
                  { label: 'Reload TM', icon: RiCoinsFill, color: '#f59e0b', action: () => setIsReloadModalOpen(true) }
                ].map((tile, idx) => {
                  const Icon = tile.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { triggerHaptic('light'); tile.action(); }}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        padding: '10px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: '#fff'
                      }}
                    >
                      <Icon size={18} color={tile.color} />
                      <span style={{ fontSize: '10px', fontWeight: 700 }}>{tile.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Trending in Your Region */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: 0 }}>
                    Trending in {country} ({country === 'KE' ? 'East Africa' : country === 'NG' ? 'West Africa' : 'Global'})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab('explore')}
                    style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    See all &rarr;
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tracks.slice(0, 5).map((t, idx) => {
                    const isSelected = currentTrack?.id === t.id;
                    const isCached = cacheUsage.tracks.some(c => c.id === t.id);
                    return (
                      <div
                        key={t.id || idx}
                        onClick={() => handleSelectTrack(t)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={t.coverArt || t.cover || '/heroes/ndufo_hero_slide1_retina.jpg'}
                            alt={t.title}
                            style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }}
                            onError={(e) => { e.currentTarget.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
                          />
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#10b981' : '#fff' }}>
                              {t.title}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                              {t.artist} &bull; {t.duration || '3:30'}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isCached && (
                            <span style={{ fontSize: '9px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 4px', borderRadius: '2px' }}>
                              8GB
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleOfflineCache(t);
                            }}
                            style={{ background: 'transparent', border: 'none', color: isCached ? '#00f2fe' : '#64748b', cursor: 'pointer', padding: '4px' }}
                            title={isCached ? 'Saved in 8GB Crate' : 'Cache Offline'}
                          >
                            <RiDownload2Fill size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLike(t.id);
                            }}
                            style={{ background: 'transparent', border: 'none', color: likes.includes(t.id) ? '#ec4899' : '#64748b', cursor: 'pointer', padding: '4px' }}
                          >
                            {likes.includes(t.id) ? <RiHeart3Fill size={15} /> : <RiHeart3Line size={15} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Featured Creators to Follow */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
                  Roster Creators &amp; EPKs
                </h4>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {artists.slice(0, 4).map((art, idx) => (
                    <div
                      key={art.id || idx}
                      style={{
                        minWidth: '110px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        padding: '10px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src={art.avatar || '/heroes/ndufo_hero_slide1_retina.jpg'}
                        alt={art.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginBottom: '6px', border: '1px solid #10b981' }}
                        onError={(e) => { e.currentTarget.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
                      />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                        {art.name}
                      </span>
                      <span style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '8px' }}>
                        {art.genre || 'Afro-House'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const artTrack = tracks.find(t => t.artist.toLowerCase() === art.name.toLowerCase());
                          if (artTrack) handleSelectTrack(artTrack);
                        }}
                        style={{
                          width: '100%',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '3px',
                          padding: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Play Catalog
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE (Search & Genres) */}
          {activeTab === 'explore' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <RiSearchLine size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="text"
                  placeholder="Search tracks, artists, ISRC, lyrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '3px',
                    padding: '10px 12px 10px 36px',
                    color: '#fff',
                    fontSize: '12px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Genre Pills */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['all', 'afro-house', 'afrobeats', 'amapiano', 'gengetone', 'r&b', 'hip-hop'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { triggerHaptic('light'); setSelectedGenre(g); }}
                    style={{
                      background: selectedGenre === g ? '#10b981' : 'rgba(255,255,255,0.04)',
                      color: selectedGenre === g ? '#060813' : '#cbd5e1',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      padding: '5px 10px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      textTransform: 'capitalize'
                    }}
                  >
                    {g === 'all' ? 'All Genres' : g}
                  </button>
                ))}
              </div>

              {/* Filtered Tracks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredTracks.map((t, idx) => {
                  const isSelected = currentTrack?.id === t.id;
                  const isCached = cacheUsage.tracks.some(c => c.id === t.id);
                  return (
                    <div
                      key={t.id || idx}
                      onClick={() => handleSelectTrack(t)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={t.coverArt || t.cover || '/heroes/ndufo_hero_slide1_retina.jpg'}
                          alt={t.title}
                          style={{ width: '42px', height: '42px', borderRadius: '3px', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
                        />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#10b981' : '#fff' }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                            {t.artist} &bull; <span style={{ color: '#00f2fe' }}>{t.isrc || 'KE-TM1-26-0001'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '9px',
                          color: '#10b981',
                          background: 'rgba(16, 185, 129, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          fontWeight: 700
                        }}>
                          30s Free
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleOfflineCache(t);
                          }}
                          style={{ background: 'transparent', border: 'none', color: isCached ? '#00f2fe' : '#64748b', cursor: 'pointer', padding: '4px' }}
                        >
                          <RiDownload2Fill size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: 8GB OFFLINE CRATE */}
          {activeTab === 'offline' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Storage Gauge */}
              <div style={{
                background: '#090d1a',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '3px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RiSmartphoneFill size={16} color="#00f2fe" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>8GB Offline Smart Cache</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#00f2fe' }}>
                    {cacheUsage.usedGb} GB / {cacheUsage.totalGb} GB ({cacheUsage.percent}%)
                  </span>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ width: `${cacheUsage.percent}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #10b981)' }} />
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setIsOfflineOnly(!isOfflineOnly); }}
                    style={{
                      padding: '8px',
                      background: isOfflineOnly ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: isOfflineOnly ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      color: isOfflineOnly ? '#f59e0b' : '#94a3b8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isOfflineOnly ? '✓ Offline-Only Mode' : 'Offline-Only: OFF'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setIsDataSaver(!isDataSaver); }}
                    style={{
                      padding: '8px',
                      background: isDataSaver ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                      border: isDataSaver ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '3px',
                      color: isDataSaver ? '#10b981' : '#94a3b8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isDataSaver ? '128k Data-Saver' : '24-Bit FLAC Studio'}
                  </button>
                </div>
              </div>

              {/* Cached Tracks Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                  Cached Local Tracks ({cacheUsage.trackCount})
                </span>
                {cacheUsage.trackCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('tunestream_native_offline_tracks_v1');
                      setCacheUsage(calculateCacheUsage());
                      triggerHaptic('heavy');
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Clear All Cache
                  </button>
                )}
              </div>

              {/* Cached List */}
              {cacheUsage.trackCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <RiDownload2Line size={32} color="#64748b" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Your 8GB Crate is Empty</div>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 12px' }}>
                    Tap the download icon on any song to store uncompressed 24-bit FLAC audio for off-grid listening.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('explore')}
                    style={{ background: '#10b981', color: '#060813', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Browse Catalogue
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cacheUsage.tracks.map((t, idx) => (
                    <div
                      key={t.id || idx}
                      onClick={() => handleSelectTrack(t)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        background: currentTrack?.id === t.id ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255,255,255,0.02)',
                        border: currentTrack?.id === t.id ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={t.coverArt || t.cover || '/heroes/ndufo_hero_slide1_retina.jpg'}
                          alt={t.title}
                          style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{t.title}</div>
                          <div style={{ fontSize: '10px', color: '#94a3b8' }}>{t.artist} &bull; ~45MB Lossless</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiCheckFill size={16} color="#10b981" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTrackFromOfflineCache(t.id);
                            setCacheUsage(calculateCacheUsage());
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        >
                          <RiCloseFill size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WALLET & CONCERT PASSES */}
          {activeTab === 'wallet' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Wallet Credits Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(9, 14, 28, 0.95) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '3px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                    Shared Credits Vault
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>intermaven.io unified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>{userCredits}</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>TM Credits</span>
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 12px' }}>
                  Credits work across TuneStream, TuneMavens Split Sheets, and SyncMavens pitch boosts.
                </p>
                <button
                  type="button"
                  onClick={() => setIsReloadModalOpen(true)}
                  style={{
                    background: '#f59e0b',
                    color: '#060813',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '8px 16px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Reload Credits (M-Pesa / Card)
                </button>
              </div>

              {/* Concert Passes Directory */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
                  Concert VIP Passes &amp; Live Shows
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {AUTHORITATIVE_EVENTS.slice(0, 3).map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        padding: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            color: evt.badge_color || '#10b981',
                            background: 'rgba(239, 68, 68, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '2px'
                          }}>
                            {evt.status_label || 'LIVE TOUR'}
                          </span>
                          <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', margin: '4px 0 2px' }}>
                            {evt.title}
                          </h5>
                          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                            {evt.venue} &bull; {evt.city}, {evt.country}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800 }}>
                          VIP Tier &bull; From KSh 2,500 / $25
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            triggerHaptic('medium');
                            setActiveQrPass(evt);
                          }}
                          style={{
                            background: '#10b981',
                            color: '#060813',
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
                          <RiQrCodeLine size={14} /> View VIP Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STUDIO EQ & DAC */}
          {activeTab === 'eq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Presets Header */}
              <div style={{ background: '#090e1f', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '3px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                    10-Band Parametric EQ
                  </span>
                  <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 800 }}>
                    24-Bit / 96kHz Lossless DAC
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {Object.keys(EQ_PRESETS).map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setActivePresetKey(key);
                        setEqBands(EQ_PRESETS[key].bands);
                      }}
                      style={{
                        padding: '6px 10px',
                        background: activePresetKey === key ? '#10b981' : 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        color: activePresetKey === key ? '#060813' : '#cbd5e1',
                        fontSize: '10.5px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {EQ_PRESETS[key].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 10 EQ Sliders */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '3px',
                padding: '16px 10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: '160px'
              }}>
                {eqBands.map((val, idx) => {
                  const normalizedH = ((val + 10) / 20) * 100; // -10 to +10 dB
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', flex: 1 }}>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>{val > 0 ? `+${val}` : val}</span>
                      <div style={{ flex: 1, width: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${normalizedH}%`, background: '#10b981', borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '8.5px', color: '#94a3b8' }}>{FREQ_LABELS[idx]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Audio Hardware Routing Output */}
              <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', padding: '14px' }}>
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: 800, marginBottom: '8px', display: 'block' }}>
                  Audio Output Routing &amp; Bridge
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'speaker', label: 'Device Speaker', icon: RiSmartphoneFill },
                    { id: 'airpods', label: 'AirPods Max / BT', icon: RiHeadphoneFill },
                    { id: 'carplay', label: 'Apple CarPlay', icon: RiCarLine },
                    { id: 'dac', label: 'Studio USB DAC', icon: RiEqualizerFill }
                  ].map(dev => {
                    const Icon = dev.icon;
                    const isDevActive = audioOutputDevice === dev.id;
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => { triggerHaptic('light'); setAudioOutputDevice(dev.id); }}
                        style={{
                          padding: '10px 8px',
                          background: isDevActive ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
                          border: isDevActive ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '3px',
                          color: isDevActive ? '#00f2fe' : '#94a3b8',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Icon size={14} /> {dev.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Floating Mini Player Dock (always anchored above tab bar) */}
        {currentTrack && (
          <div className="mini-player-dock" onClick={() => setIsFullPlayerOpen(true)}>
            <div
              className="mini-player-progress-bar"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
            <img
              src={currentTrack.coverArt || currentTrack.cover || '/heroes/ndufo_hero_slide1_retina.jpg'}
              alt={currentTrack.title}
              style={{ width: '38px', height: '38px', borderRadius: '3px', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentTrack.title}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                {currentTrack.artist} &bull; {formatTime(currentTime)} / {formatTime(duration || 210)}
              </div>
            </div>

            {/* EQ visualizer */}
            {isPlaying && (
              <div className="eq-visualizer-bars">
                <div className="eq-bar active" />
                <div className="eq-bar active" />
                <div className="eq-bar active" />
                <div className="eq-bar active" />
              </div>
            )}

            {/* 1-Tap Tip shortcut */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                setIsTipModalOpen(true);
              }}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                padding: '6px 8px',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: 800
              }}
              title="1-Tap Direct Creator Tipping"
            >
              <RiCoinsFill size={13} /> Tip
            </button>

            {/* Play/Pause */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              style={{
                background: '#10b981',
                color: '#060813',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <RiPauseFill size={16} /> : <RiPlayFill size={16} />}
            </button>
          </div>
        )}

        {/* Bottom Tab Navigation Bar */}
        <nav className="app-shell-tabbar">
          {[
            { id: 'home', label: 'Home', icon: RiHomeFill },
            { id: 'explore', label: 'Explore', icon: RiCompass3Line },
            { id: 'offline', label: '8GB Crate', icon: RiDownload2Fill, badge: cacheUsage.trackCount > 0 ? `${cacheUsage.trackCount}` : null },
            { id: 'wallet', label: 'VIP Passes', icon: RiTicket2Fill },
            { id: 'eq', label: 'Studio EQ', icon: RiEqualizerFill }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { triggerHaptic('light'); setActiveTab(tab.id); }}
                className={`tabbar-item ${isActive ? 'active' : ''}`}
              >
                {tab.badge && <span className="tabbar-badge">{tab.badge}</span>}
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Phone Gesture Bar */}
        {viewMode === 'phone' && <div className="phone-home-indicator" />}

        {/* FULLSCREEN NOW PLAYING MODAL OVERLAY */}
        {isFullPlayerOpen && currentTrack && (
          <div className="full-player-overlay">
            {/* Header with dismiss */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setIsFullPlayerOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <RiCloseFill size={24} />
              </button>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                  Playing From Catalogue
                </span>
                <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700 }}>
                  {currentTrack.release || 'Lossless Single'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinerNotesOpen(true)}
                style={{ background: 'transparent', border: 'none', color: '#00f2fe', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                Credits
              </button>
            </div>

            {/* Spinning Vinyl Cover Art */}
            <div className={`vinyl-disc ${isPlaying ? 'playing' : ''}`}>
              <img
                src={currentTrack.coverArt || currentTrack.cover || '/heroes/ndufo_hero_slide1_retina.jpg'}
                alt={currentTrack.title}
                className="vinyl-center-art"
                onError={(e) => { e.currentTarget.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
              />
            </div>

            {/* Track Info & Like */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '16px 0 10px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>
                  {currentTrack.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  {currentTrack.artist} &bull; <span style={{ color: '#10b981' }}>24-Bit / 96kHz FLAC</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggleLike(currentTrack.id)}
                style={{ background: 'transparent', border: 'none', color: likes.includes(currentTrack.id) ? '#ec4899' : '#64748b', cursor: 'pointer', padding: '6px' }}
              >
                {likes.includes(currentTrack.id) ? <RiHeart3Fill size={22} /> : <RiHeart3Line size={22} />}
              </button>
            </div>

            {/* 30s Free Preview Notice & Unlock Button */}
            {isPreviewMode && !hasUnlockedMaster && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '3px',
                padding: '8px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>30s Free Preview</span>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                    {currentTime >= 30 ? 'Preview reached limit' : `${Math.max(0, 30 - Math.floor(currentTime))}s remaining`}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleUnlockMaster}
                  style={{
                    background: '#10b981',
                    color: '#060813',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Unlock Full Track (1 TM)
                </button>
              </div>
            )}

            {/* Scrubber Progress Bar */}
            <div>
              <input
                type="range"
                min="0"
                max={duration || 210}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentTime(val);
                  if (audioRef.current) audioRef.current.currentTime = val;
                }}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 210)}</span>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '16px 0' }}>
              <button
                type="button"
                onClick={() => { triggerHaptic('light'); setIsShuffle(!isShuffle); }}
                style={{ background: 'transparent', border: 'none', color: isShuffle ? '#10b981' : '#64748b', cursor: 'pointer' }}
              >
                <RiShuffleFill size={18} />
              </button>

              <button
                type="button"
                onClick={handlePrevTrack}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <RiSkipBackFill size={26} />
              </button>

              <button
                type="button"
                onClick={handlePlayPause}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                }}
              >
                {isPlaying ? <RiPauseFill size={26} /> : <RiPlayFill size={26} />}
              </button>

              <button
                type="button"
                onClick={handleNextTrack}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <RiSkipForwardFill size={26} />
              </button>

              <button
                type="button"
                onClick={() => { triggerHaptic('light'); setIsRepeat(!isRepeat); }}
                style={{ background: 'transparent', border: 'none', color: isRepeat ? '#10b981' : '#64748b', cursor: 'pointer' }}
              >
                <RiRepeat2Fill size={18} />
              </button>
            </div>

            {/* Action Tools Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: 'auto' }}>
              <button
                type="button"
                onClick={() => { triggerHaptic('medium'); setIsTipModalOpen(true); }}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  borderRadius: '3px',
                  padding: '10px 4px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RiCoinsFill size={15} /> 1-Tap Tip
              </button>

              <button
                type="button"
                onClick={() => setIsLyricsDrawerOpen(!isLyricsDrawerOpen)}
                style={{
                  background: isLyricsDrawerOpen ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: isLyricsDrawerOpen ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  color: isLyricsDrawerOpen ? '#00f2fe' : '#cbd5e1',
                  borderRadius: '3px',
                  padding: '10px 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RiFileLine size={15} /> Lyrics
              </button>

              <button
                type="button"
                onClick={() => handleToggleOfflineCache(currentTrack)}
                style={{
                  background: cacheUsage.tracks.some(c => c.id === currentTrack.id) ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: cacheUsage.tracks.some(c => c.id === currentTrack.id) ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  color: cacheUsage.tracks.some(c => c.id === currentTrack.id) ? '#00f2fe' : '#cbd5e1',
                  borderRadius: '3px',
                  padding: '10px 4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <RiDownload2Fill size={15} /> {cacheUsage.tracks.some(c => c.id === currentTrack.id) ? 'Cached' : '8GB Cache'}
              </button>
            </div>

            {/* Synchronized Lyrics Drawer */}
            {isLyricsDrawerOpen && (
              <div style={{
                marginTop: '16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3px',
                padding: '14px',
                maxHeight: '130px',
                overflowY: 'auto'
              }}>
                <span style={{ fontSize: '10px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase' }}>
                  Synchronized Studio Lyrics
                </span>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '6px 0', lineHeight: 1.6 }}>
                  [Verse 1]<br />
                  Sunrise over Nairobi city lights,<br />
                  Electronic rhythms carrying the night.<br />
                  Sovereign soundscapes in 24-bit sound,<br />
                  Direct to creator, on sacred ground.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 1-TAP CREATOR TIPPING MODAL */}
        {isTipModalOpen && currentTrack && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#090e1f',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '3px',
              padding: '20px',
              maxWidth: '360px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RiCoinsFill size={18} color="#10b981" />
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>1-Tap Creator Tipping</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTipModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <RiCloseFill size={18} />
                </button>
              </div>

              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.45 }}>
                Every tip routes through the <strong>Compensation Engine</strong> (95% directly to creator wallet, 5% protocol fee). Zero monthly subscriptions.
              </p>

              <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '8px' }}>
                Recipient: <strong>{currentTrack.artist}</strong> &bull; {currentTrack.title}
              </div>

              {/* Quick tip amounts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {[25, 50, 100, 250].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleExecuteTip(amt)}
                    style={{
                      padding: '10px 4px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {amt} TM
                  </button>
                ))}
              </div>

              {/* Split Breakdown */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '3px', fontSize: '10px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>
                <div>• Artist Primary Share: <strong>60%</strong></div>
                <div>• Producer Mechanical: <strong>25%</strong></div>
                <div>• Record Label Distro: <strong>15%</strong></div>
                <div>• Settlement Rails: <strong>M-Pesa STK Push / Stripe</strong></div>
              </div>

              <button
                type="button"
                onClick={() => handleExecuteTip(50)}
                style={{
                  width: '100%',
                  background: '#10b981',
                  color: '#060813',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Send 50 TM Credits Tip Now
              </button>
            </div>
          </div>
        )}

        {/* QR VIP ACCESS PASS MODAL */}
        {activeQrPass && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#090d19',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              borderRadius: '3px',
              padding: '24px 20px',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '10px', color: '#00f2fe', fontWeight: 800, textTransform: 'uppercase' }}>
                Cryptographic Tour Pass
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: '6px 0 2px' }}>
                {activeQrPass.title}
              </h4>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px' }}>
                {activeQrPass.venue} &bull; {activeQrPass.time}
              </div>

              {/* Dynamic QR Code Simulator */}
              <div style={{
                width: '160px',
                height: '160px',
                background: '#fff',
                borderRadius: '3px',
                margin: '0 auto 16px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid #10b981'
              }}>
                <RiQrCodeLine size={120} color="#060813" />
                <span style={{ fontSize: '8px', color: '#060813', fontWeight: 900, fontFamily: 'monospace' }}>
                  SIG-SHA256: 8F2A9B
                </span>
              </div>

              <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, marginBottom: '16px' }}>
                ✓ Validated for Instant Door Check-In via TunePay POS
              </div>

              <button
                type="button"
                onClick={() => setActiveQrPass(null)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: '3px',
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Pass
              </button>
            </div>
          </div>
        )}

        {/* LINER NOTES MODAL */}
        {isLinerNotesOpen && currentTrack && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <div style={{
              background: '#090d19',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              padding: '20px',
              maxWidth: '360px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Studio Sonic Credentials</span>
                <button
                  type="button"
                  onClick={() => setIsLinerNotesOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <RiCloseFill size={18} />
                </button>
              </div>

              <div style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>• Master Quality: <strong>24-Bit / 96kHz Lossless FLAC</strong></div>
                <div>• ISRC Code: <strong>{currentTrack.isrc || 'KE-TM1-26-00013'}</strong></div>
                <div>• Synthesizers: <strong>Moog One, Prophet-6, Modular Eurorack</strong></div>
                <div>• Mixing &amp; Mastering: <strong>Nairobi Wave Lab Studio</strong></div>
                <div>• Publishing: <strong>{currentTrack.publishingSplit || 'Writer (50%) / Publisher (50%)'}</strong></div>
                <div>• Distribution Split: <strong>{currentTrack.distributionSplit || 'Artist (60%) / Producer (25%) / Label (15%)'}</strong></div>
                <div>• Sync Cleared: <strong>100% Pre-Cleared One-Stop Sync</strong></div>
              </div>

              <button
                type="button"
                onClick={() => setIsLinerNotesOpen(false)}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  background: '#10b981',
                  color: '#060813',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Close Credentials
              </button>
            </div>
          </div>
        )}

        {/* CREDIT RELOAD MODAL */}
        <CreditReloadModal
          isOpen={isReloadModalOpen}
          onClose={() => setIsReloadModalOpen(false)}
          sessionUser={sessionUser}
          onUpdateUser={() => {
            const saved = localStorage.getItem('tunemavens_user_credits');
            if (saved) setUserCredits(parseInt(saved, 10));
          }}
          onSuccess={() => {
            const saved = localStorage.getItem('tunemavens_user_credits');
            if (saved) setUserCredits(parseInt(saved, 10));
            setTipSuccessToast('Credits successfully reloaded!');
            setTimeout(() => setTipSuccessToast(null), 3500);
          }}
        />

      </div>
    </div>
  );
}
