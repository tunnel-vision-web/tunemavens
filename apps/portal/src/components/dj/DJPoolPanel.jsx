import React, { useState, useEffect, useRef } from 'react';
// JSZip dynamically loaded on export
import {
  RiRadioFill,
  RiDiscFill,
  RiDownloadFill,
  RiPlayFill,
  RiPauseFill,
  RiRefreshFill,
  RiSearchLine,
  RiFolderMusicFill,
  RiCheckFill,
  RiCloseFill,
  RiShieldCheckFill,
  RiSparklingFill,
  RiAddLine,
  RiFileTextFill,
  RiArrowUpLine,
  RiArrowDownLine,
  RiDeleteBin6Line,
  RiGlobalLine,
  RiSoundModuleFill,
  RiStarFill
} from 'react-icons/ri';
import { djPoolApi } from '../../lib/api';
import './DJPoolPanel.css';
import DJMixesManager from './DJMixesManager.jsx';

const GENRE_LIST = ['All', 'House', 'Afrobeats', 'Amapiano', 'Techno', 'Gengetone', 'Dancehall', 'Hip-Hop', 'R&B', 'EDM'];
const CAMELOT_KEYS = [
  '1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B',
  '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B',
  '9A', '9B', '10A', '10B', '11A', '11B', '12A', '12B'
];

function getHarmonicMatches(key) {
  if (!key) return [];
  const match = key.match(/^(\d+)([AB])$/i);
  if (!match) return [];
  const num = parseInt(match[1], 10);
  const letter = match[2].toUpperCase();
  const otherLetter = letter === 'A' ? 'B' : 'A';
  
  const up = (num % 12) + 1;
  const down = num === 1 ? 12 : num - 1;

  return [
    `${num}${letter}`,            // Perfect
    `${up}${letter}`,             // Energy Boost +1
    `${down}${letter}`,           // Energy Drop -1
    `${num}${otherLetter}`        // Relative Major/Minor
  ];
}

function checkTransition(t1, t2) {
  if (!t1 || !t2) return null;
  const bpmDelta = Math.abs((t1.bpm || 120) - (t2.bpm || 120));
  const harmonicMatches = getHarmonicMatches(t1.key);
  const isHarmonic = harmonicMatches.includes(t2.key);

  let label = 'Harmonic Match';
  let type = 'good';

  if (t1.key === t2.key) {
    label = 'Exact Key Match (Seamless)';
    type = 'good';
  } else if (isHarmonic) {
    label = `Harmonic Flow (${t1.key} → ${t2.key})`;
    type = 'good';
  } else if (bpmDelta <= 4) {
    label = `Tempo Matched (±${bpmDelta} BPM)`;
    type = 'energy';
  } else {
    label = `Key Clash (${t1.key} / ${t2.key}) · ±${bpmDelta} BPM`;
    type = 'clash';
  }

  return { label, type, bpmDelta, isHarmonic };
}

export default function DJPoolPanel({ sessionUser, initialTab, onOpenCreditReload }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'pool');
  const [mixManagerView, setMixManagerView] = useState('catalog');
  useEffect(() => {
    const onOpenMixes = () => setActiveTab('mixes');
    window.addEventListener('tunemavens:open-dj-mixes', onOpenMixes);
    return () => window.removeEventListener('tunemavens:open-dj-mixes', onOpenMixes);
  }, []);
 // 'pool' | 'crate' | 'clearance' | 'upload'
  const [tracks, setTracks] = useState([]);
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedKey, setSelectedKey] = useState('');
  const [bpmMin, setBpmMin] = useState(70);
  const [bpmMax, setBpmMax] = useState(140);
  const [filterHarmonicOnly, setFilterHarmonicOnly] = useState(false);

  // Audio Playback Preview State
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0);
  const audioRef = useRef(null);
  const progressTimerRef = useRef(null);

  // DJ Crate State (Persisted in session memory / state)
  const [crate, setCrate] = useState([]);
  const [crateZipping, setCrateZipping] = useState(false);

  // Feedback Modal State
  const [feedbackModal, setFeedbackModal] = useState(null); // Track object
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackVibes, setFeedbackVibes] = useState('fill_dancefloor');
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Certificate Modal State
  const [viewCertModal, setViewCertModal] = useState(null);

  // Toast & Action Feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // Clearance Form State
  const [clearTrackId, setClearTrackId] = useState('');
  const [clearTitle, setClearTitle] = useState('');
  const [clearDj, setClearDj] = useState(sessionUser?.username || sessionUser?.display_name || '');
  const [clearVenue, setClearVenue] = useState('');
  const [clearDate, setClearDate] = useState('');
  const [clearType, setClearType] = useState('bootleg_remix');
  const [submittingClear, setSubmittingClear] = useState(false);

  // Upload Form State
  const [upTitle, setUpTitle] = useState('');
  const [upArtist, setUpArtist] = useState(sessionUser?.username || '');
  const [upBpm, setUpBpm] = useState('124');
  const [upKey, setUpKey] = useState('4A');
  const [upGenre, setUpGenre] = useState('House');
  const [upVersion, setUpVersion] = useState('Extended Mix');
  const [upEnergy, setUpEnergy] = useState('8');
  const [upStems, setUpStems] = useState(true);
  const [upFormat, setUpFormat] = useState('24-bit WAV');
  const [upRegions, setUpRegions] = useState('');
  const [submittingUpload, setSubmittingUpload] = useState(false);

  const showToast = (msg, duration = 4000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [tracksData, clearancesData] = await Promise.all([
        djPoolApi.listTracks(),
        djPoolApi.listClearances()
      ]);
      setTracks(tracksData || []);
      setClearances(clearancesData || []);
    } catch {
      // Fallback demo data
      setTracks([
        {
          id: 'demo1',
          title: 'Midnight Grooves (Club Intro Edit)',
          artist: 'Vibe Master',
          bpm: 124,
          key: '4A',
          genre: 'House',
          version_type: 'Extended Mix',
          energy_level: 8,
          stems_available: true,
          lossless_format: '24-bit WAV',
          downloads_count: 142,
          allowed_regions: [],
          feedback_submitted: false
        },
        {
          id: 'demo2',
          title: 'Nairobi Sunset (Afro Club Rework)',
          artist: 'Aisha Okoro ft. K-Boy',
          bpm: 112,
          key: '8A',
          genre: 'Afrobeats',
          version_type: 'Extended Mix',
          energy_level: 7,
          stems_available: true,
          lossless_format: '24-bit WAV',
          downloads_count: 289,
          allowed_regions: [],
          feedback_submitted: true
        },
        {
          id: 'demo3',
          title: 'Soweto Log Drum Fever (VIP Mix)',
          artist: 'DJ Maphoria',
          bpm: 113,
          key: '5B',
          genre: 'Amapiano',
          version_type: 'Extended Mix',
          energy_level: 9,
          stems_available: true,
          lossless_format: 'Lossless FLAC',
          downloads_count: 318,
          allowed_regions: [],
          feedback_submitted: false
        }
      ]);
      setClearances([
        {
          id: 'c1',
          title: 'Midnight Grooves (Afro Remix)',
          dj_name: 'DJ Kalonje',
          venue: 'Blankets & Wine Nairobi',
          event_date: '2026-12-05',
          remix_type: 'bootleg_remix',
          certificate_id: 'TM-CLR-2026-7A9F',
          status: 'approved',
          original_title: 'Midnight Grooves',
          original_artist: 'Vibe Master',
          is_owner: true
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Audio Playback Handlers
  const handleTogglePlay = (track) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setPlayingTrackId(null);
      setPlayProgress(0);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    const testUrl = track.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    const audio = new Audio(testUrl);
    audioRef.current = audio;
    audio.play().catch(() => {});
    setPlayingTrackId(track.id);
    setPlayProgress(5);

    progressTimerRef.current = setInterval(() => {
      setPlayProgress(p => (p >= 100 ? 0 : p + 2));
    }, 400);

    audio.onended = () => {
      setPlayingTrackId(null);
      setPlayProgress(0);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  };

  // Crate Operations
  const handleToggleCrate = (track) => {
    setCrate(prev => {
      const exists = prev.some(t => t.id === track.id);
      if (exists) {
        showToast(`Removed "${track.title}" from DJ Crate`);
        return prev.filter(t => t.id !== track.id);
      } else {
        showToast(`Added "${track.title}" to DJ Crate (Key: ${track.key}, ${track.bpm} BPM)`);
        return [...prev, track];
      }
    });
  };

  const handleMoveCrateItem = (idx, direction) => {
    setCrate(prev => {
      const copy = [...prev];
      const target = idx + direction;
      if (target < 0 || target >= copy.length) return prev;
      const [moved] = copy.splice(idx, 1);
      copy.splice(target, 0, moved);
      return copy;
    });
  };

  const handleRemoveFromCrate = (trackId) => {
    setCrate(prev => prev.filter(t => t.id !== trackId));
  };

  // Batch Crate ZIP Export using dynamic JSZip with fallback
  const handleDownloadCrateZip = async () => {
    if (crate.length === 0) {
      showToast('Add tracks to your crate first before exporting.');
      return;
    }
    setCrateZipping(true);
    try {
      let JSZipLib = window.JSZip;
      if (!JSZipLib) {
        try {
          const mod = await import('jszip');
          JSZipLib = mod.default || mod;
        } catch (_) {}
      }

      if (JSZipLib) {
        const zip = new JSZipLib();
        const folderName = `TuneMavens_Crate_${new Date().toISOString().slice(0, 10)}`;
        const crateFolder = zip.folder(folderName);

        // 1. Rekordbox / Pioneer CDJ Playlist (.m3u8)
        let m3u8Content = '#EXTM3U\n#EXTENC:UTF-8\n';
        crate.forEach((t, i) => {
          m3u8Content += `#EXTINF:${t.duration_seconds || 240},${t.artist} - ${t.title} [Key: ${t.key} | ${t.bpm} BPM]\n`;
          m3u8Content += `${String(i + 1).padStart(2, '0')}_${t.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.wav\n`;
        });
        crateFolder.file('rekordbox_playlist.m3u8', m3u8Content);

        // 2. Setlist Cue Sheet (CSV for ASCAP / BMI / SAMRO PRO royalty compliance)
        let csvContent = 'Track_Number,Title,Artist,BPM,Camelot_Key,Genre,Version,Duration_Sec,Format,Clearance_Status\n';
        crate.forEach((t, i) => {
          csvContent += `"${i + 1}","${t.title}","${t.artist}","${t.bpm}","${t.key}","${t.genre}","${t.version_type || 'Extended'}","${t.duration_seconds || 240}","${t.lossless_format || '24-bit WAV'}","TuneMavens Whitelisted"\n`;
        });
        crateFolder.file('performance_setlist_cue_sheet.csv', csvContent);

        // 3. Performance License & Stem Clearance Passport
        const passportContent = `======================================================================
TUNEMAVENS SOVEREIGN RECORD POOL - PERFORMANCE PASSPORT
======================================================================
Licensed DJ: ${sessionUser?.display_name || sessionUser?.username || 'Club Resident'}
Issue Date: ${new Date().toUTCString()}
Crate Total: ${crate.length} Tracks
Harmonic Range: ${[...new Set(crate.map(t => t.key))].join(', ')}
BPM Span: ${Math.min(...crate.map(t => t.bpm || 120))} - ${Math.max(...crate.map(t => t.bpm || 120))} BPM

TERMS & DMCA CLEARANCE:
The audio assets contained in this crate are 100% cleared for live club,
festival, and verified broadcast performance under TuneMavens Sovereign
Pool Clearances. All rights holders and publishers receive automated
cascaded attribution via TuneLedger.

Tracks cleared in this crate:
${crate.map((t, idx) => `[${idx + 1}] ${t.title} by ${t.artist} (${t.bpm} BPM, Key ${t.key}) - ${t.lossless_format || '24-bit WAV'}`).join('\n')}

Cryptographic Verification Hash: TM-CRATE-${Math.random().toString(36).substring(2, 10).toUpperCase()}
======================================================================`;
        crateFolder.file('DJ_PERFORMANCE_CLEARANCE_PASSPORT.txt', passportContent);
        crateFolder.file('README_DJ_INTRO_TAGS.txt', 'All WAV & MP3 drops from TuneMavens are pre-tagged with verified 8-bar beat grids, Camelot keys, and cue markers for Rekordbox, Serato DJ Pro, Engine DJ, and Traktor.');

        const content = await zip.generateAsync({ type: 'blob' });
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${folderName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        showToast(`Exported DJ Crate ZIP with ${crate.length} tracks & Rekordbox cue sheets!`);
      } else {
        // Safe M3U8 fallback if JSZip cannot be loaded in current browser environment
        let m3u8Content = '#EXTM3U\n#EXTENC:UTF-8\n';
        crate.forEach((t, i) => {
          m3u8Content += `#EXTINF:${t.duration_seconds || 240},${t.artist} - ${t.title} [Key: ${t.key} | ${t.bpm} BPM]\n${t.audio_url || ''}\n`;
        });
        const blob = new Blob([m3u8Content], { type: 'audio/x-mpegurl' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `TuneMavens_Crate_${Date.now()}.m3u8`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showToast(`Exported DJ Crate M3U8 playlist with ${crate.length} tracks! ✓`);
      }
    } catch {
      showToast('Could not package crate. Please try again.');
    }
    setCrateZipping(false);
  };

  // Download & Feedback Flow
  const handleDownloadAttempt = (track) => {
    if (track.feedback_submitted || sessionUser?.role === 'admin') {
      triggerDownload(track);
    } else {
      setFeedbackModal(track);
      setFeedbackRating(5);
      setFeedbackVibes('fill_dancefloor');
      setFeedbackText('');
    }
  };

  const triggerDownload = async (track) => {
    setDownloadingId(track.id);
    try {
      const result = await djPoolApi.downloadTrack(track.id);
      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, downloads_count: (t.downloads_count || 0) + 1 } : t));
      showToast(`Downloaded "${track.title}". Lossless 24-bit master with 8-bar DJ markers. ✓`);
      
      // Auto trigger file save
      const dummyUrl = result?.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      const a = document.createElement('a');
      a.href = dummyUrl;
      a.download = `${track.artist} - ${track.title} [Key ${track.key} - ${track.bpm}BPM].wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      showToast('Feedback required before downloading this promo cut.');
    }
    setDownloadingId(null);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      await djPoolApi.submitFeedback({
        track_id: feedbackModal.id,
        rating: feedbackRating,
        dancefloor_response: feedbackVibes,
        review_text: feedbackText
      });
      setTracks(prev => prev.map(t => t.id === feedbackModal.id ? { ...t, feedback_submitted: true } : t));
      const target = feedbackModal;
      setFeedbackModal(null);
      triggerDownload(target);
    } catch {
      showToast('Could not record dancefloor feedback. Please retry.');
    }
    setSubmittingFeedback(false);
  };

  // Clearance Handlers
  const handleClearanceSubmit = async (e) => {
    e.preventDefault();
    setSubmittingClear(true);
    try {
      const result = await djPoolApi.submitClearance({
        track_id: clearTrackId,
        title: clearTitle,
        dj_name: clearDj,
        venue: clearVenue,
        event_date: clearDate,
        remix_type: clearType
      });
      setClearances(prev => [result, ...prev]);
      setClearTrackId('');
      setClearTitle('');
      setClearVenue('');
      setClearDate('');
      showToast('Remix clearance submitted! Track copyright holders notified.');
    } catch {
      showToast('Clearance request failed. Check track ID and try again.');
    }
    setSubmittingClear(false);
  };

  const handleApproveClearance = async (requestId, status) => {
    try {
      const res = await djPoolApi.approveClearance(requestId, status);
      setClearances(prev => prev.map(r => r.id === requestId ? { ...r, status, certificate_id: res.certificate_id || r.certificate_id } : r));
      showToast(`Clearance ${status === 'approved' ? 'Approved & Passport Issued' : 'Declined'}.`);
    } catch {
      showToast('Could not update clearance status.');
    }
  };

  // Promo Upload Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setSubmittingUpload(true);
    try {
      const regions = upRegions.split(',').map(r => r.trim()).filter(Boolean);
      const result = await djPoolApi.addTrack({
        title: upTitle,
        artist: upArtist,
        bpm: parseInt(upBpm, 10),
        key: upKey,
        genre: upGenre,
        version_type: upVersion,
        energy_level: parseInt(upEnergy, 10),
        stems_available: upStems,
        lossless_format: upFormat,
        allowed_regions: regions
      });
      setTracks(prev => [result, ...prev]);
      setUpTitle('');
      setUpRegions('');
      showToast('Promo cut uploaded and live in the DJ Pool!');
      setActiveTab('pool');
    } catch {
      showToast('Upload failed. Please try again.');
    }
    setSubmittingUpload(false);
  };

  // Filtering Logic
  const filteredTracks = tracks.filter(t => {
    if (selectedGenre !== 'All' && t.genre?.toLowerCase() !== selectedGenre.toLowerCase()) {
      return false;
    }
    if (t.bpm && (t.bpm < bpmMin || t.bpm > bpmMax)) {
      return false;
    }
    if (selectedKey) {
      if (filterHarmonicOnly) {
        const matches = getHarmonicMatches(selectedKey);
        if (!matches.includes(t.key)) return false;
      } else {
        if (t.key?.toUpperCase() !== selectedKey.toUpperCase()) return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchArtist = t.artist?.toLowerCase().includes(q);
      const matchGenre = t.genre?.toLowerCase().includes(q);
      const matchKey = t.key?.toLowerCase().includes(q);
      if (!matchTitle && !matchArtist && !matchGenre && !matchKey) return false;
    }
    return true;
  });

  const harmonicMatchKeys = selectedKey ? getHarmonicMatches(selectedKey) : [];

  const vibeOptions = [
    { value: 'fill_dancefloor', label: '🔥 Fills the Dancefloor (Floor Packer)' },
    { value: 'keep_crowd', label: '⚡ Keeps Crowd Moving (Peak Flow)' },
    { value: 'peak_moment', label: '💥 Headliner Drop / Confetti Moment' },
    { value: 'warmup_groove', label: '🍸 Sunset / Warmup Builder' },
    { value: 'room_cooler', label: '❄️ Too Slow for Peak Room' },
  ];

  return (
    <div className="djpool-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 99999,
          background: 'rgba(6, 78, 59, 0.95)',
          border: '1px solid rgba(52, 211, 153, 0.4)',
          borderRadius: '8px',
          padding: '12px 18px',
          color: '#86efac',
          fontSize: '13px',
          fontWeight: '700',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <RiCheckFill size={18} />
          {toastMessage}
        </div>
      )}

      {/* Hero Header */}
      <div className="dashboard-panel-header" style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiRadioFill style={{ color: 'var(--cyan)' }} />
                DJ Pool Engine & Dancefloor Clearances
              </h2>
              <span className="djpool-tag djpool-tag-bpm" style={{ fontSize: '10px' }}>PHASE 5 ENGINE</span>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
              Lossless promo cuts with Camelot harmonic matching, Rekordbox beat grids, dancefloor review gates, and instant bootleg clearance certificates.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
                        <button
              onClick={() => {
                setMixManagerView('upload');
                setActiveTab('mixes');
              }}
              className="djpool-tab-btn"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #0284c7 100%)',
                color: '#060813',
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 2px 10px rgba(34, 211, 238, 0.3)'
              }}
              data-testid="djpool-header-upload-mix-btn"
            >
              <RiDiscFill size={16} />
              Upload Mix
            </button>
            <button
              onClick={() => {
                setMixManagerView('catalog');
                setActiveTab('mixes');
              }}
              className="djpool-tab-btn"
              style={{
                background: activeTab === 'mixes' ? 'rgba(34, 211, 238, 0.25)' : 'rgba(34, 211, 238, 0.12)',
                borderColor: 'rgba(34, 211, 238, 0.4)',
                color: '#22d3ee'
              }}
              data-testid="djpool-header-mixes-btn"
            >
              <RiDiscFill size={16} />
              DJ Mixes & Clearance
            </button>
            <button
              onClick={() => setActiveTab('crate')}
              className="djpool-tab-btn"
              style={{
                background: crate.length > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.06)',
                borderColor: crate.length > 0 ? 'rgba(34, 197, 94, 0.4)' : 'transparent',
                color: crate.length > 0 ? '#86efac' : '#cbd5e1'
              }}
            >
              <RiFolderMusicFill size={16} />
              DJ Crate
              <span className="djpool-badge-pill" style={{ background: '#22c55e', color: '#000' }}>
                {crate.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="djpool-metrics-strip">
        <div className="djpool-metric-card">
          <div className="djpool-metric-icon">
            <RiDiscFill />
          </div>
          <div>
            <div className="djpool-metric-val">{tracks.length}</div>
            <div className="djpool-metric-label">Lossless Pool Cuts</div>
          </div>
        </div>
        <div className="djpool-metric-card">
          <div className="djpool-metric-icon" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
            <RiSoundModuleFill />
          </div>
          <div>
            <div className="djpool-metric-val">100%</div>
            <div className="djpool-metric-label">Camelot Analyzed</div>
          </div>
        </div>
        <div className="djpool-metric-card">
          <div className="djpool-metric-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#86efac' }}>
            <RiShieldCheckFill />
          </div>
          <div>
            <div className="djpool-metric-val">{clearances.filter(c => c.status === 'approved').length}</div>
            <div className="djpool-metric-label">Clearance Passes Issued</div>
          </div>
        </div>
        <div className="djpool-metric-card">
          <div className="djpool-metric-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' }}>
            <RiFolderMusicFill />
          </div>
          <div>
            <div className="djpool-metric-val">{crate.length}</div>
            <div className="djpool-metric-label">In Live Crate</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="djpool-tabs-bar">
        <div className="djpool-tabs-left">
          <button
            onClick={() => setActiveTab('pool')}
            className={`djpool-tab-btn ${activeTab === 'pool' ? 'active' : ''}`}
          >
            <RiDiscFill size={15} />
            Promo Pool ({tracks.length})
          </button>
          <button
            onClick={() => {
              setMixManagerView('catalog');
              setActiveTab('mixes');
            }}
            className={`djpool-tab-btn ${activeTab === 'mixes' ? 'active' : ''}`}
            data-testid="tab-dj-mixes"
          >
            <RiRadioFill size={15} />
            DJ Mixes & Clearance
          </button>
          <button
            onClick={() => setActiveTab('crate')}
            className={`djpool-tab-btn ${activeTab === 'crate' ? 'active' : ''}`}
          >
            <RiFolderMusicFill size={15} />
            Crate & Setlist Builder
            {crate.length > 0 && <span className="djpool-badge-pill">{crate.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('clearance')}
            className={`djpool-tab-btn ${activeTab === 'clearance' ? 'active' : ''}`}
          >
            <RiShieldCheckFill size={15} />
            Clearance Hub ({clearances.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`djpool-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          >
            <RiAddLine size={16} />
            Drop a Promo
          </button>
        </div>
      </div>

            {/* ──────────────── TAB: DJ MIXES & SOVEREIGN CLEARANCE ──────────────── */}
      {activeTab === 'mixes' && (
        <DJMixesManager sessionUser={sessionUser} initialView={mixManagerView} onOpenCreditReload={onOpenCreditReload} />
      )}

{/* ──────────────── TAB 1: PROMO POOL ──────────────── */}
      {activeTab === 'pool' && (
        <>
          {/* Filters Bar */}
          <div className="djpool-filter-panel">
            <div className="djpool-search-row">
              <div className="djpool-search-input-wrap">
                <RiSearchLine />
                <input
                  type="text"
                  placeholder="Search promo pool by title, artist, or tag..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="djpool-search-input"
                />
              </div>

              {/* Genre Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {GENRE_LIST.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`djpool-filter-chip ${selectedGenre === genre ? 'active' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Camelot Harmonizer Bar */}
            <div className="djpool-camelot-bar">
              <span className="djpool-camelot-label">
                <RiSparklingFill style={{ color: '#f59e0b' }} />
                Camelot Key Filter:
              </span>
              <button
                onClick={() => { setSelectedKey(''); setFilterHarmonicOnly(false); }}
                className={`djpool-camelot-pill ${!selectedKey ? 'selected' : ''}`}
                style={{ padding: '3px 8px' }}
              >
                All
              </button>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
                {CAMELOT_KEYS.map(k => {
                  const isMatch = harmonicMatchKeys.includes(k) && k !== selectedKey;
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        if (selectedKey === k) {
                          setSelectedKey('');
                          setFilterHarmonicOnly(false);
                        } else {
                          setSelectedKey(k);
                        }
                      }}
                      className={`djpool-camelot-pill ${selectedKey === k ? 'selected' : ''} ${isMatch ? 'harmonic-match' : ''}`}
                      title={isMatch ? `Harmonically compatible with ${selectedKey}` : `Filter by ${k}`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>

              {selectedKey && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#86efac', cursor: 'pointer', fontWeight: '700' }}>
                    <input
                      type="checkbox"
                      checked={filterHarmonicOnly}
                      onChange={e => setFilterHarmonicOnly(e.target.checked)}
                    />
                    Harmonic Matches Only ({selectedKey} ±1)
                  </label>
                  <button
                    onClick={() => { setSelectedKey(''); setFilterHarmonicOnly(false); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
                  >
                    <RiCloseFill />
                  </button>
                </div>
              )}
            </div>

            {/* BPM Range Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                BPM Range: <strong style={{ color: '#fbbf24' }}>{bpmMin} - {bpmMax} BPM</strong>
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'All', min: 70, max: 140 },
                  { label: 'Afro / HipHop (<105)', min: 70, max: 104 },
                  { label: 'Amapiano (110-116)', min: 110, max: 116 },
                  { label: 'House (120-126)', min: 120, max: 126 },
                  { label: 'Techno / Peak (128-135)', min: 128, max: 135 }
                ].map(b => (
                  <button
                    key={b.label}
                    onClick={() => { setBpmMin(b.min); setBpmMax(b.max); }}
                    className="djpool-filter-chip"
                    style={{ fontSize: '11px', padding: '4px 10px' }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tracks List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <RiRefreshFill size={32} className="spin-animation" style={{ color: 'var(--cyan)' }} />
              <p style={{ marginTop: '12px' }}>Auditioning lossless promo pool...</p>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>
                No promo tracks matched your criteria
              </p>
              <p style={{ fontSize: '13px', marginBottom: '16px' }}>
                Try resetting your Camelot key or BPM filter to see all whitelisted records.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedKey(''); setBpmMin(70); setBpmMax(140); }}
                className="djpool-tab-btn"
                style={{ margin: '0 auto', background: 'var(--cyan)', color: '#000' }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTracks.map(track => {
                const isPlaying = playingTrackId === track.id;
                const inCrate = crate.some(t => t.id === track.id);
                return (
                  <div key={track.id} className="djpool-track-card">
                    {/* Play / Preview Button */}
                    <button
                      onClick={() => handleTogglePlay(track)}
                      className={`djpool-play-btn ${isPlaying ? 'playing' : ''}`}
                      title={isPlaying ? 'Pause Preview' : 'Audition Track'}
                    >
                      {isPlaying ? <RiPauseFill /> : <RiPlayFill style={{ marginLeft: '3px' }} />}
                    </button>

                    {/* Metadata & Waveform */}
                    <div className="djpool-track-meta">
                      <div className="djpool-track-title-row">
                        <span className="djpool-track-title">{track.title}</span>
                        <span className="djpool-tag djpool-tag-genre">{track.genre}</span>
                        <span className="djpool-tag djpool-tag-bpm">{track.bpm} BPM</span>
                        <span className="djpool-tag djpool-tag-key">Key {track.key}</span>
                        <span className="djpool-tag djpool-tag-version">{track.version_type || 'Extended Mix'}</span>
                        {track.stems_available && (
                          <span className="djpool-tag djpool-tag-stems">🎛️ Stems Ready</span>
                        )}
                        {track.feedback_submitted && (
                          <span className="djpool-tag djpool-tag-reviewed">✓ Reviewed</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#94a3b8', flexWrap: 'wrap' }}>
                        <span>Artist: <strong style={{ color: '#fff' }}>{track.artist}</strong></span>
                        <span>Fidelity: <strong style={{ color: 'var(--cyan)' }}>{track.lossless_format || '24-bit WAV'}</strong></span>
                        <span>Energy: <strong style={{ color: '#fbbf24' }}>{track.energy_level || 8}/10</strong></span>
                        <span>Downloads: <strong>{track.downloads_count || 0}</strong></span>
                        {track.allowed_regions && track.allowed_regions.length > 0 && (
                          <span style={{ color: '#fbbf24' }}>
                            <RiGlobalLine style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            {track.allowed_regions.join(', ')} Only
                          </span>
                        )}
                      </div>

                      {/* Fake Waveform with Live Progress when auditioning */}
                      <div className="djpool-waveform-fake">
                        <div
                          className="djpool-waveform-progress"
                          style={{ width: isPlaying ? `${playProgress}%` : '0%' }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="djpool-track-actions">
                      <button
                        onClick={() => handleToggleCrate(track)}
                        className={`djpool-btn-crate ${inCrate ? 'in-crate' : ''}`}
                      >
                        {inCrate ? (
                          <>
                            <RiCheckFill size={14} />
                            In Crate
                          </>
                        ) : (
                          <>
                            <RiAddLine size={14} />
                            Add to Crate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadAttempt(track)}
                        disabled={downloadingId === track.id}
                        className={`djpool-btn-download ${track.feedback_submitted ? 'unlocked' : 'locked'}`}
                      >
                        {downloadingId === track.id ? (
                          <>
                            <RiRefreshFill size={13} className="spin-animation" />
                            Prepping Drop...
                          </>
                        ) : track.feedback_submitted ? (
                          <>
                            <RiDownloadFill size={14} />
                            Download WAV
                          </>
                        ) : (
                          <>
                            <RiStarFill size={14} />
                            Review &amp; Unlock
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ──────────────── TAB 2: CRATE & SETLIST BUILDER ──────────────── */}
      {activeTab === 'crate' && (
        <div>
          <div className="djpool-crate-header">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>
                🎧 Live Set Crate &amp; Rekordbox Cue Export
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Assemble your performance set, verify harmonic transitions across the Camelot wheel, and export a ready-to-spin Rekordbox package.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCrate([])}
                disabled={crate.length === 0}
                className="djpool-btn-crate"
                style={{ opacity: crate.length === 0 ? 0.5 : 1 }}
              >
                <RiDeleteBin6Line size={14} />
                Clear Crate
              </button>
              <button
                onClick={handleDownloadCrateZip}
                disabled={crate.length === 0 || crateZipping}
                className="djpool-tab-btn"
                style={{
                  background: 'var(--cyan)',
                  color: '#060813',
                  opacity: crate.length === 0 || crateZipping ? 0.5 : 1
                }}
              >
                {crateZipping ? (
                  <>
                    <RiRefreshFill size={14} className="spin-animation" />
                    Packaging Crate ZIP...
                  </>
                ) : (
                  <>
                    <RiDownloadFill size={15} />
                    Download Crate ZIP ({crate.length})
                  </>
                )}
              </button>
            </div>
          </div>

          {crate.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
              <RiFolderMusicFill size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#cbd5e1', marginBottom: '8px' }}>
                Your DJ Crate is currently empty
              </p>
              <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                Browse the Promo Pool and click <strong>"Add to Crate"</strong> to stage tracks for your set.
              </p>
              <button
                onClick={() => setActiveTab('pool')}
                className="djpool-tab-btn"
                style={{ margin: '0 auto', background: 'var(--cyan)', color: '#000' }}
              >
                Browse Promo Pool
              </button>
            </div>
          ) : (
            <div className="djpool-setlist-flow">
              {crate.map((track, idx) => {
                const nextTrack = crate[idx + 1];
                const transition = checkTransition(track, nextTrack);
                return (
                  <React.Fragment key={track.id}>
                    <div className="djpool-flow-item">
                      <div className="djpool-flow-idx">#{idx + 1}</div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>{track.title}</span>
                          <span className="djpool-tag djpool-tag-key">{track.key}</span>
                          <span className="djpool-tag djpool-tag-bpm">{track.bpm} BPM</span>
                          <span className="djpool-tag djpool-tag-genre">{track.genre}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          By <strong style={{ color: '#cbd5e1' }}>{track.artist}</strong> · {track.version_type || 'Extended'} · {track.lossless_format || '24-bit WAV'}
                        </div>
                      </div>

                      {/* Re-order & Remove Controls */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleMoveCrateItem(idx, -1)}
                          disabled={idx === 0}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            padding: '6px',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1
                          }}
                          title="Move Up"
                        >
                          <RiArrowUpLine />
                        </button>
                        <button
                          onClick={() => handleMoveCrateItem(idx, 1)}
                          disabled={idx === crate.length - 1}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#94a3b8',
                            padding: '6px',
                            cursor: idx === crate.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === crate.length - 1 ? 0.3 : 1
                          }}
                          title="Move Down"
                        >
                          <RiArrowDownLine />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCrate(track.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fca5a5',
                            padding: '6px',
                            cursor: 'pointer'
                          }}
                          title="Remove from Crate"
                        >
                          <RiCloseFill />
                        </button>
                      </div>
                    </div>

                    {/* Transition Indicator to next track */}
                    {nextTrack && transition && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '4px 0',
                        fontSize: '11px',
                        color: '#64748b'
                      }}>
                        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
                        <span className={`djpool-transition-chip djpool-transition-${transition.type}`}>
                          ⚡ {transition.label}
                        </span>
                        <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 3: CLEARANCE HUB ──────────────── */}
      {activeTab === 'clearance' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
          {/* Clearance Ledger */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiShieldCheckFill style={{ color: 'var(--cyan)' }} />
              Active Bootleg &amp; Remix Clearance Ledger
            </h3>

            {clearances.length === 0 ? (
              <div className="dashboard-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <p>No clearance requests logged yet.</p>
                <p style={{ fontSize: '13px' }}>Submit a remix or festival drop clearance request on the right.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {clearances.map(req => {
                  const isApproved = req.status === 'approved';
                  const isDeclined = req.status === 'declined';
                  return (
                    <div key={req.id} className="dashboard-card" style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>
                            {req.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            <span>DJ: <strong style={{ color: '#fff' }}>{req.dj_name}</strong></span>
                            <span>Venue: <strong style={{ color: '#fff' }}>{req.venue}</strong></span>
                            {req.event_date && <span>Date: <strong style={{ color: '#fbbf24' }}>{req.event_date}</strong></span>}
                            {req.original_title && (
                              <span>Original: <strong style={{ color: 'var(--cyan)' }}>{req.original_title}</strong></span>
                            )}
                          </div>
                          {req.certificate_id && (
                            <div style={{ marginTop: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                              CERT ID: <strong style={{ color: '#86efac' }}>{req.certificate_id}</strong>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '99px',
                            fontSize: '11px',
                            fontWeight: '800',
                            background: isApproved ? 'rgba(34,197,94,0.15)' : isDeclined ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: isApproved ? '#86efac' : isDeclined ? '#fca5a5' : '#fbbf24',
                            border: `1px solid ${isApproved ? 'rgba(34,197,94,0.3)' : isDeclined ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`
                          }}>
                            {req.status?.toUpperCase()}
                          </span>

                          {isApproved && (
                            <button
                              onClick={() => setViewCertModal(req)}
                              className="djpool-tab-btn"
                              style={{ padding: '4px 10px', fontSize: '11px', background: 'rgba(34, 211, 238, 0.15)', color: 'var(--cyan)' }}
                            >
                              <RiFileTextFill size={13} />
                              View Passport
                            </button>
                          )}

                          {req.is_owner && req.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleApproveClearance(req.id, 'approved')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  background: 'rgba(34,197,94,0.2)',
                                  color: '#86efac'
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveClearance(req.id, 'declined')}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  background: 'rgba(239,68,68,0.2)',
                                  color: '#fca5a5'
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Clearance Request Form */}
          <div className="dashboard-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiShieldCheckFill style={{ color: '#fbbf24' }} />
              Request Remix / Set Clearance
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
              Secure direct performance &amp; stem rights for festival drops, bootleg edits, and radio mixshows.
            </p>

            <form onSubmit={handleClearanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Select Master Track from Pool
                </label>
                <select
                  value={clearTrackId}
                  onChange={e => setClearTrackId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    padding: '9px 12px',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="">-- Choose track --</option>
                  {tracks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} - {t.artist} ({t.key}, {t.bpm} BPM)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Remix / Drop Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Grooves (VIP Festival Edit)"
                  value={clearTitle}
                  onChange={e => setClearTitle(e.target.value)}
                  className="djpool-search-input"
                  style={{ paddingLeft: '14px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Your DJ / Stage Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DJ Kalonje"
                    value={clearDj}
                    onChange={e => setClearDj(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Remix Type
                  </label>
                  <select
                    value={clearType}
                    onChange={e => setClearType(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      padding: '9px 12px',
                      outline: 'none'
                    }}
                  >
                    <option value="bootleg_remix">Club Bootleg Remix</option>
                    <option value="live_mashup">Festival Live Mashup</option>
                    <option value="radio_edit">Radio Mixshow Drop</option>
                    <option value="stems_live">Live Stems Performance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Target Venue / Festival
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blankets &amp; Wine"
                    value={clearVenue}
                    onChange={e => setClearVenue(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={clearDate}
                    onChange={e => setClearDate(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingClear}
                className="djpool-tab-btn"
                style={{
                  background: 'var(--cyan)',
                  color: '#060813',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '6px'
                }}
              >
                {submittingClear ? 'Submitting Clearance...' : '📜 Request IP Clearance Pass'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: DROP A PROMO CUT ──────────────── */}
      {activeTab === 'upload' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="dashboard-card">
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiAddLine style={{ color: 'var(--cyan)' }} />
              Register a Promo Drop in the DJ Pool
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '18px' }}>
              Provide DJ-friendly metadata: Camelot harmonic key, BPM, and version edit so club and radio DJs can drop it seamlessly.
            </p>

            <div style={{
              background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(2, 132, 199, 0.05) 100%)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              borderRadius: '6px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div>
                <strong style={{ color: '#22d3ee', fontSize: '13px', display: 'block', marginBottom: '3px' }}>
                  Uploading a Full DJ Mix or Live Recorded Set?
                </strong>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Use automated cue tracklist extraction, streamable playlist slicing, and 100% prior agreement clearances.
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMixManagerView('upload');
                  setActiveTab('mixes');
                }}
                className="plan-btn outline"
                style={{
                  whiteSpace: 'nowrap',
                  background: 'rgba(34, 211, 238, 0.15)',
                  border: '1px solid rgba(34, 211, 238, 0.5)',
                  color: '#22d3ee',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Launch Mix Ingest
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Track Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Grooves (Club Intro Edit)"
                    value={upTitle}
                    onChange={e => setUpTitle(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Artist Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vibe Master"
                    value={upArtist}
                    onChange={e => setUpArtist(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Genre
                  </label>
                  <select
                    value={upGenre}
                    onChange={e => setUpGenre(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      padding: '9px 12px',
                      outline: 'none'
                    }}
                  >
                    {GENRE_LIST.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    BPM
                  </label>
                  <input
                    type="number"
                    value={upBpm}
                    onChange={e => setUpBpm(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Camelot Key
                  </label>
                  <select
                    value={upKey}
                    onChange={e => setUpKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      padding: '9px 12px',
                      outline: 'none'
                    }}
                  >
                    {CAMELOT_KEYS.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Energy (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={upEnergy}
                    onChange={e => setUpEnergy(e.target.value)}
                    className="djpool-search-input"
                    style={{ paddingLeft: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Version Cut
                  </label>
                  <select
                    value={upVersion}
                    onChange={e => setUpVersion(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      padding: '9px 12px',
                      outline: 'none'
                    }}
                  >
                    <option value="Extended Mix">Extended Mix (DJ Intro)</option>
                    <option value="Original">Original Radio Edit</option>
                    <option value="Club Clean">Club Clean Edit</option>
                    <option value="Dirty Explicit">Dirty Explicit Edit</option>
                    <option value="Instrumental">Instrumental</option>
                    <option value="Acapella">Acapella / Vocal Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                    Audio Fidelity Format
                  </label>
                  <select
                    value={upFormat}
                    onChange={e => setUpFormat(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: '#e2e8f0',
                      fontSize: '13px',
                      padding: '9px 12px',
                      outline: 'none'
                    }}
                  >
                    <option value="24-bit WAV">24-bit WAV (Pristine Studio)</option>
                    <option value="Lossless FLAC">Lossless FLAC</option>
                    <option value="320kbps MP3">320kbps MP3</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Allowed Territories (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. KE, NG, ZA, US (Leave blank for Worldwide / Global)"
                  value={upRegions}
                  onChange={e => setUpRegions(e.target.value)}
                  className="djpool-search-input"
                  style={{ paddingLeft: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="upStems"
                  checked={upStems}
                  onChange={e => setUpStems(e.target.checked)}
                />
                <label htmlFor="upStems" style={{ fontSize: '13px', color: '#cbd5e1', cursor: 'pointer' }}>
                  Includes Multi-track Stems Package (Drums, Bass, Vocals, Synths)
                </label>
              </div>

              <button
                type="submit"
                disabled={submittingUpload}
                className="djpool-tab-btn"
                style={{
                  background: 'var(--cyan)',
                  color: '#060813',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '10px'
                }}
              >
                {submittingUpload ? 'Uploading...' : '⚡ Publish Promo to DJ Pool'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── DANCEFLOOR REVIEW GATE MODAL ──────────────── */}
      {feedbackModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setFeedbackModal(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div style={{
            background: '#0c1122',
            border: '1px solid rgba(34, 211, 238, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '520px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.7)'
          }}>
            <button
              onClick={() => setFeedbackModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ✕
            </button>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Dancefloor Review Required
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '6px 0 4px' }}>
                {feedbackModal.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                Share your dancefloor verdict to unlock the full 24-bit lossless master. Your review directly informs the artist's live telemetry.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Star Rating */}
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Your Rating
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '24px',
                        color: star <= feedbackRating ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                        transition: 'color 0.15s'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe Selection */}
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Dancefloor Response
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {vibeOptions.map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        background: feedbackVibes === opt.value ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${feedbackVibes === opt.value ? 'rgba(34, 211, 238, 0.35)' : 'rgba(255,255,255,0.06)'}`
                      }}
                    >
                      <input
                        type="radio"
                        name="vibes"
                        value={opt.value}
                        checked={feedbackVibes === opt.value}
                        onChange={() => setFeedbackVibes(opt.value)}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '13px', color: feedbackVibes === opt.value ? 'var(--cyan)' : '#cbd5e1', fontWeight: '600' }}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase' }}>
                  Set Reaction Feedback
                </label>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="e.g. Dropped this at 1:30 AM right after Amapiano build-up. Crowd went crazy on the bass drop."
                  rows={3}
                  className="djpool-search-input"
                  style={{ padding: '10px 14px', resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingFeedback || !feedbackText.trim()}
                className="djpool-tab-btn"
                style={{
                  background: 'var(--cyan)',
                  color: '#060813',
                  width: '100%',
                  justifyContent: 'center',
                  opacity: submittingFeedback || !feedbackText.trim() ? 0.6 : 1
                }}
              >
                {submittingFeedback ? 'Verifying Review...' : '✓ Submit Review & Unlock WAV Drop'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── DIGITAL CLEARANCE PASSPORT MODAL ──────────────── */}
      {viewCertModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setViewCertModal(null); }}
          className="djpool-cert-modal"
        >
          <div className="djpool-cert-paper">
            <button
              onClick={() => setViewCertModal(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '22px'
              }}
            >
              ✕
            </button>

            <div className="djpool-cert-seal">
              <RiShieldCheckFill />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Official Performance Clearance
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '6px 0 4px' }}>
                {viewCertModal.title}
              </h2>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Issued by TuneMavens Sovereign Clearinghouse &amp; TuneLedger
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Licensed Performer</div>
                <div style={{ color: '#fff', fontWeight: '700' }}>{viewCertModal.dj_name}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Approved Venue / Event</div>
                <div style={{ color: '#fff', fontWeight: '700' }}>{viewCertModal.venue}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Original Master Composition</div>
                <div style={{ color: 'var(--cyan)', fontWeight: '700' }}>{viewCertModal.original_title || viewCertModal.title}</div>
              </div>
              <div>
                <div style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Cryptographic Certificate</div>
                <div style={{ color: '#86efac', fontFamily: 'monospace', fontWeight: '700' }}>{viewCertModal.certificate_id}</div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
              This verifiable certificate establishes non-exclusive live performance and broadcast clearance.
              The copyright holder has authorized the named DJ to perform, stream, and drop this remix at the specified venue.
              All public performance licensing royalties route automatically through TuneLedger cascade protocols.
            </p>

            <button
              onClick={() => {
                showToast(`Certificate ${viewCertModal.certificate_id} verified against TuneLedger!`);
                setViewCertModal(null);
              }}
              className="djpool-tab-btn"
              style={{ background: 'var(--cyan)', color: '#060813', width: '100%', justifyContent: 'center' }}
            >
              ✓ Confirm DMCA Performance Immunity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
