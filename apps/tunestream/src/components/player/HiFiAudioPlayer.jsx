import React, { useState, useEffect, useRef } from 'react';
import {
  RiMusic2Fill, RiPlayFill, RiPauseFill, RiStopFill,
  RiSkipBackFill, RiSkipForwardFill, RiShuffleLine,
  RiRepeatLine, RiRepeatOneLine, RiVolumeUpFill,
  RiVolumeMuteFill, RiDragMove2Fill, RiSubtractFill,
  RiAddFill, RiCloseFill, RiDiscFill
} from 'react-icons/ri';
import { normalizeMediaUrl } from '../../lib/api.js';

export default function HiFiAudioPlayer({
  track,
  tracks = [],
  isPlaying = false,
  onTogglePlay,
  onTrackSelect,
  accentColor = '#00f2fe',
  onClose
}) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isPlayerMuted, setIsPlayerMuted] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(0.85);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState('playlist'); // 'off' | 'track' | 'playlist'
  const [playbackProgress, setPlaybackProgress] = useState(0); // in seconds
  const [trackDuration, setTrackDuration] = useState(210); // in seconds

  const [playerPos, setPlayerPos] = useState({
    x: Math.max(20, (typeof window !== 'undefined' ? window.innerWidth - 480 : 800)),
    y: Math.max(80, (typeof window !== 'undefined' ? window.innerHeight - 380 : 450))
  });

  const audioRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Current playing track fallback
  const currentTrack = track || tracks[0] || {
    id: 'sample',
    title: 'Select a Track',
    artist: 'TuneStream Lossless Catalog',
    cover: '/uploads/artwork/ndufo_cover.jpg',
    isrc: 'KE-TM1-26-00042',
    duration: '3:30'
  };

  const currentIndex = tracks.findIndex(t => t.id === currentTrack.id || t.isrc === currentTrack.isrc);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  // Sync Audio source and play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const streamSrc = currentTrack.audioUrl || currentTrack.audio_url || currentTrack.fileUrl || `/api/stream/track/${encodeURIComponent(currentTrack.isrc || currentTrack.id || currentTrack.title)}`;
    
    if (audio.src !== streamSrc && !audio.src.endsWith(streamSrc)) {
      audio.src = streamSrc;
      audio.load();
      setPlaybackProgress(0);
    }

    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Hi-Fi playback error:', err);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying]);

  // Sync volume & mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isPlayerMuted ? 0 : playerVolume;
  }, [playerVolume, isPlayerMuted]);

  // Track advance handler
  const handleTrackAdvance = () => {
    if (!tracks || tracks.length === 0) return;
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

  // Draggable window handlers
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

  return (
    <>
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setPlaybackProgress(Math.floor(audioRef.current.currentTime));
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setTrackDuration(Math.floor(audioRef.current.duration));
          }
        }}
        onEnded={handleTrackAdvance}
        style={{ display: 'none' }}
      />

      {/* Floating Minimized Pill when player closed/minimized */}
      {!isPlayerVisible && (
        <button
          type="button"
          onClick={() => setIsPlayerVisible(true)}
          title="Open TuneMavens Hi-Fi Player"
          data-testid="hifi-player-pill"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9000,
            background: isPlaying ? 'rgba(34, 197, 94, 0.15)' : 'rgba(15, 23, 42, 0.85)',
            border: `1.5px solid ${isPlaying ? '#22c55e' : accentColor}`,
            borderRadius: '3px',
            padding: '8px 16px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.82rem',
            fontWeight: 800
          }}
        >
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: isPlaying ? '#22c55e' : accentColor,
            boxShadow: isPlaying ? '0 0 10px #22c55e' : 'none',
            display: 'inline-block'
          }} />
          <RiMusic2Fill style={{ color: accentColor, fontSize: '1.1rem' }} />
          <span>TuneMavens Hi-Fi Player {isPlaying ? '• Playing' : '• Paused'}</span>
        </button>
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
            width: isPlayerMinimized ? '320px' : '440px',
            maxWidth: 'calc(100vw - 24px)',
            background: 'rgba(12, 16, 32, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${accentColor}66`,
            borderRadius: '3px',
            boxShadow: `0 16px 48px rgba(0,0,0,0.75), 0 0 24px ${accentColor}33`,
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
              background: 'rgba(0,0,0,0.3)',
              cursor: 'grab',
              borderRadius: '3px 3px 0 0'
            }}
            title="Click and drag anywhere on this header to move player"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <RiDragMove2Fill style={{ color: accentColor, fontSize: '1.05rem', flexShrink: 0 }} />
              <span style={{ fontWeight: 900, fontSize: '0.82rem', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                TuneMavens Hi-Fi Player
              </span>
              <span style={{
                background: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}55`,
                padding: '1px 5px',
                borderRadius: '3px',
                fontSize: '0.6rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                flexShrink: 0
              }}>
                TuneStream
              </span>
            </div>

            {/* Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
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
                onClick={() => {
                  if (onClose) onClose();
                  else setIsPlayerVisible(false);
                }}
                title="Hide to Bottom Floating Pill"
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
                <RiCloseFill size={16} />
              </button>
            </div>
          </div>

          {/* Minimized Compact View */}
          {isPlayerMinimized ? (
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={normalizeMediaUrl(currentTrack.cover || currentTrack.coverArt)}
                alt={currentTrack.title}
                onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
                style={{ width: '36px', height: '36px', borderRadius: '3px', objectFit: 'cover', border: `1px solid ${accentColor}44` }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </div>
                <div style={{ fontSize: '0.7rem', color: accentColor, fontWeight: 700 }}>
                  {formatSec(playbackProgress)} / {formatSec(trackDuration)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onTogglePlay && onTogglePlay(!isPlaying)}
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
          ) : (
            /* Full Player Controls */
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Playlist Selector Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiDiscFill style={{ color: accentColor, fontSize: '1rem', flexShrink: 0 }} />
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>
                  Active Track:
                </label>
                <select
                  value={safeIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (tracks[idx] && onTrackSelect) {
                      onTrackSelect(tracks[idx]);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '3px',
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${accentColor}55`,
                    color: '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {tracks.map((t, idx) => (
                    <option key={t.id || idx} value={idx}>
                      🎵 {t.title} - {t.artist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Track Metadata Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '10px 12px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={normalizeMediaUrl(currentTrack.cover || currentTrack.coverArt)}
                    alt={currentTrack.title}
                    onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }}
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
                    <span>ISRC: {currentTrack.isrc || 'KE-TM1-26-00042'}</span>
                  </div>
                  <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '1px 6px', borderRadius: '3px', fontSize: '0.62rem', fontWeight: 800 }}>
                      Lossless FLAC / MP3 • 320kbps
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      Track {safeIndex + 1} of {tracks.length || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrubber & Timers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', minWidth: '32px' }}>
                    {formatSec(playbackProgress)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={trackDuration || 225}
                    value={playbackProgress}
                    onChange={(e) => {
                      const newTime = Number(e.target.value);
                      setPlaybackProgress(newTime);
                      if (audioRef.current) {
                        audioRef.current.currentTime = newTime;
                      }
                    }}
                    style={{ flex: 1, accentColor, cursor: 'pointer', height: '4px' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace', minWidth: '32px', textAlign: 'right' }}>
                    {formatSec(trackDuration)}
                  </span>
                </div>
              </div>

              {/* Playback Controls & Mode Switches */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingTop: '2px' }}>
                {/* Mode: Shuffle Toggle */}
                <button
                  type="button"
                  onClick={() => setShuffleMode(!shuffleMode)}
                  title={shuffleMode ? "Shuffle: Random On (Click to switch to Sequenced)" : "Shuffle: Sequenced (Click to switch to Random)"}
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

                {/* Center Audio Buttons: Prev, Play/Pause, Stop, Next */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Previous Track */}
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

                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={() => onTogglePlay && onTogglePlay(!isPlaying)}
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

                  {/* Stop */}
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

                  {/* Next Track */}
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

                {/* Mode: Repeat Loop Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = repeatMode === 'off' ? 'playlist' : repeatMode === 'playlist' ? 'track' : 'off';
                    setRepeatMode(nextMode);
                  }}
                  title={repeatMode === 'track' ? "Repeat: Single Track (Click to turn off)" : repeatMode === 'playlist' ? "Repeat: Entire Playlist (Click for single track)" : "Repeat: Off (Click for playlist loop)"}
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
                {/* Volume / Mute Controls */}
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

                <div style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Universal TuneStream Engine</span>
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
