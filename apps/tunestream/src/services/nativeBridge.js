/**
 * TuneStream Native Bridge & Hardware Integration Service
 * 
 * Provides unified interfaces for Capacitor native mobile runtimes (iOS & Android)
 * as well as standards-compliant Web Audio and MediaSession fallbacks.
 */

// Detect Capacitor native container
export const isNativePlatform = () => {
  return typeof window !== 'undefined' && 
         window.Capacitor && 
         typeof window.Capacitor.isNativePlatform === 'function' && 
         window.Capacitor.isNativePlatform();
};

// Haptic feedback triggers
export const triggerHaptic = (type = 'light') => {
  if (typeof window === 'undefined') return;

  // 1. Capacitor Haptics plugin if available
  if (window.Capacitor?.Plugins?.Haptics) {
    try {
      if (type === 'heavy') {
        window.Capacitor.Plugins.Haptics.impact({ style: 'Heavy' });
      } else if (type === 'medium') {
        window.Capacitor.Plugins.Haptics.impact({ style: 'Medium' });
      } else if (type === 'success') {
        window.Capacitor.Plugins.Haptics.notification({ type: 'SUCCESS' });
      } else {
        window.Capacitor.Plugins.Haptics.impact({ style: 'Light' });
      }
      return;
    } catch (_) {}
  }

  // 2. Browser standard Navigator.vibrate fallback
  if (navigator.vibrate) {
    try {
      if (type === 'heavy') navigator.vibrate([30, 20, 30]);
      else if (type === 'success') navigator.vibrate([15, 40, 20]);
      else navigator.vibrate(12);
    } catch (_) {}
  }
};

// OS-Level MediaSession synchronization (Lockscreen, Notification Center, Apple Watch, CarPlay)
export const updateNativeMediaSession = ({
  track,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek
}) => {
  if (typeof window === 'undefined' || !('mediaSession' in navigator) || !track) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || 'Unknown Track',
      artist: track.artist || 'TuneStream Creator',
      album: track.release || track.album || 'TuneStream Lossless Crate',
      artwork: [
        { src: track.coverArt || track.cover || '/heroes/ndufo_hero_slide1_retina.jpg', sizes: '512x512', type: 'image/jpeg' },
        { src: track.coverArt || track.cover || '/heroes/ndufo_hero_slide1_retina.jpg', sizes: '256x256', type: 'image/jpeg' }
      ]
    });

    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

    if (onPlay) navigator.mediaSession.setActionHandler('play', onPlay);
    if (onPause) navigator.mediaSession.setActionHandler('pause', onPause);
    if (onNext) navigator.mediaSession.setActionHandler('nexttrack', onNext);
    if (onPrev) navigator.mediaSession.setActionHandler('previoustrack', onPrev);
    if (onSeek) {
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) onSeek(details.seekTime);
      });
    }
  } catch (err) {
    console.debug('MediaSession registration notice:', err);
  }
};

// 8GB Smart Offline Cache Storage Manager
const OFFLINE_STORAGE_KEY = 'tunestream_native_offline_tracks_v1';
const MAX_OFFLINE_CACHE_BYTES = 8 * 1024 * 1024 * 1024; // 8.0 GB

export const getOfflineTracks = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

export const saveTrackToOfflineCache = (track) => {
  if (typeof window === 'undefined' || !track) return false;
  try {
    const current = getOfflineTracks();
    if (current.some(t => (t.id === track.id || (t.isrc && t.isrc === track.isrc)))) {
      return true; // Already cached
    }
    // Estimated file size: 24-bit 96kHz FLAC ~ 45MB, or AAC 128k ~ 4.2MB
    const simulatedBytes = 45 * 1024 * 1024;
    const cachedEntry = {
      ...track,
      cachedAt: new Date().toISOString(),
      sizeBytes: simulatedBytes,
      isLosslessFlac: true
    };
    const updated = [cachedEntry, ...current];
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    triggerHaptic('success');
    return true;
  } catch (_) {
    return false;
  }
};

export const removeTrackFromOfflineCache = (trackId) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getOfflineTracks();
    const updated = current.filter(t => t.id !== trackId && t.isrc !== trackId);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
    triggerHaptic('light');
  } catch (_) {}
};

export const calculateCacheUsage = () => {
  const tracks = getOfflineTracks();
  // Base OS container + cached tracks
  const baseAppBytes = 350 * 1024 * 1024; // 350MB baseline
  const tracksBytes = tracks.reduce((sum, t) => sum + (t.sizeBytes || 45 * 1024 * 1024), 0);
  const totalUsedBytes = baseAppBytes + tracksBytes;
  const pct = Math.min(100, (totalUsedBytes / MAX_OFFLINE_CACHE_BYTES) * 100);
  const usedGb = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
  return {
    usedGb,
    totalGb: '8.00',
    percent: pct.toFixed(1),
    trackCount: tracks.length,
    tracks
  };
};

// Queued Offline Tipping Protocol
const QUEUED_TIPS_KEY = 'tunestream_queued_tips_v1';

export const queueOfflineTip = (tipData) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(QUEUED_TIPS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ ...tipData, queuedAt: Date.now() });
    localStorage.setItem(QUEUED_TIPS_KEY, JSON.stringify(list));
  } catch (_) {}
};

export const flushQueuedTips = async () => {
  if (typeof window === 'undefined' || !navigator.onLine) return [];
  try {
    const raw = localStorage.getItem(QUEUED_TIPS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (list.length === 0) return [];
    
    // Clear queue
    localStorage.removeItem(QUEUED_TIPS_KEY);
    return list;
  } catch (_) {
    return [];
  }
};
