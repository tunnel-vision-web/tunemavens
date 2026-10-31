// Cross-Tab and Cross-Origin Playback Intelligence Coordinator
const instanceId = 'player_' + Math.random().toString(36).substring(2, 9);
let currentSource = 'frontend';
let onRemoteStopCallback = null;
let lastKnownRemoteTimestamp = 0;

let syncChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncChannel = new BroadcastChannel('tunemavens_audio_sync');
  }
} catch (_) {}

export function initPlaybackSync({ isBackend = false, onStopRemotePlayback = null } = {}) {
  currentSource = isBackend ? 'backend' : 'frontend';
  onRemoteStopCallback = onStopRemotePlayback;

  const handleMessage = (data) => {
    if (!data) return;
    if (data.type === 'PLAYBACK_STARTED' && data.instanceId !== instanceId) {
      lastKnownRemoteTimestamp = data.timestamp || Date.now();
      // Another instance has started playing! Stop audio in this instance.
      if (typeof onRemoteStopCallback === 'function') {
        onRemoteStopCallback({ callerSource: data.source, track: data.track });
      }
    }
  };

  if (syncChannel) {
    syncChannel.onmessage = (e) => handleMessage(e.data);
  }

  // Fallback via localStorage storage events
  const handleStorage = (e) => {
    if (e.key === 'tunemavens_active_playback' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        handleMessage(parsed);
      } catch (_) {}
    }
  };
  window.addEventListener('storage', handleStorage);

  // Cross-origin heartbeat / active session sync (coordinating across port 3000 and 3001)
  const pollTimer = setInterval(() => {
    fetch('/api/stream/active-playback')
      .then(r => r.ok ? r.json() : null)
      .then(session => {
        if (session && session.status === 'playing' && session.instance_id && session.instance_id !== instanceId) {
          const sessionTs = (session.timestamp || 0) * 1000;
          if (sessionTs > lastKnownRemoteTimestamp) {
            lastKnownRemoteTimestamp = sessionTs;
            if (typeof onRemoteStopCallback === 'function') {
              onRemoteStopCallback({ callerSource: session.source, track: session.track });
            }
          }
        }
      })
      .catch(() => {});
  }, 2000);

  return () => {
    window.removeEventListener('storage', handleStorage);
    clearInterval(pollTimer);
  };
}

export function broadcastPlaybackStart(sourceOverride = null, track = null) {
  const source = sourceOverride || currentSource;
  const payload = {
    type: 'PLAYBACK_STARTED',
    instanceId,
    source,
    track: track ? { id: track.id || track.isrc, title: track.title, artist: track.artist } : null,
    timestamp: Date.now()
  };

  lastKnownRemoteTimestamp = payload.timestamp;

  if (syncChannel) {
    try { syncChannel.postMessage(payload); } catch (_) {}
  }
  try {
    localStorage.setItem('tunemavens_active_playback', JSON.stringify(payload));
  } catch (_) {}

  // Cross-origin API notification
  fetch('/api/stream/active-playback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instance_id: instanceId,
      source,
      track: payload.track,
      status: 'playing',
      timestamp: Date.now() / 1000
    })
  }).catch(() => {});
}

export function broadcastPlaybackStop() {
  const payload = {
    type: 'PLAYBACK_STOPPED',
    instanceId,
    timestamp: Date.now()
  };
  if (syncChannel) {
    try { syncChannel.postMessage(payload); } catch (_) {}
  }
  fetch('/api/stream/active-playback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instance_id: instanceId,
      source: currentSource,
      status: 'stopped',
      timestamp: Date.now() / 1000
    })
  }).catch(() => {});
}
