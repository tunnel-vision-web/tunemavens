import React, { useState, useRef } from 'react';
import {
  RiDiscFill, RiMusic2Fill, RiFileTextFill, RiUploadFill,
  RiDeleteBin6Line, RiAddLine, RiCheckFill, RiSparklingFill,
  RiArrowRightLine, RiArrowLeftLine, RiShieldCheckFill,
  RiCoinsFill, RiGlobalFill, RiUserVoiceFill, RiEqualizerFill,
  RiCheckboxCircleFill, RiAlertFill, RiFolderUploadFill, RiSettings3Fill,
  RiImageAddFill, RiMagicFill, RiPaletteFill, RiCloseLine, RiRefreshLine
} from 'react-icons/ri';

const GENRES = [
  'Afro-House', 'Amapiano', 'Deep-House', 'Afrobeats',
  'Electronic', 'Synthwave', 'Hip-Hop', 'R&B / Soul',
  'Pop', 'Ambient', 'Dancehall', 'Jazz Fusion'
];

const PRO_LIST = [
  'BMI', 'ASCAP', 'SESAC', 'PRS for Music',
  'SAMRO', 'MCSK', 'SACEM', 'SOCAN', 'GEMA', 'Direct / None'
];

const PRODUCER_ROLES = [
  'Primary Producer', 'Co-Producer', 'Additional Production',
  'Mixing Engineer', 'Mastering Engineer', 'Executive Producer'
];

const DEFAULT_COVER_PRESETS = [
  { name: 'Neon Cyber', bg: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)', text: 'CYBER' },
  { name: 'Rift Sunset', bg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', text: 'SUNSET' },
  { name: 'Emerald Vibe', bg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', text: 'EMERALD' },
  { name: 'Deep Amethyst', bg: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', text: 'AMETHYST' },
  { name: 'Midnight Onyx', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: 'MIDNIGHT' }
];

export default function CatalogueWizard({
  onSwitchToManager,
  onIngestComplete,
  sessionUser,
  creatorEpk,
  existingTracksCount = 0
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [ingestedResult, setIngestedResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // STEP 1: Release Details
  const [releaseType, setReleaseType] = useState('EP'); // Album, EP, Mixtape, Single
  const [releaseTitle, setReleaseTitle] = useState('');
  const [primaryArtist, setPrimaryArtist] = useState(
    sessionUser?.artist_name || sessionUser?.name || 'Ndufo'
  );
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
  const [genre, setGenre] = useState('Afro-House');
  const [coverArtUrl, setCoverArtUrl] = useState('');
  const [selectedPresetCover, setSelectedPresetCover] = useState(DEFAULT_COVER_PRESETS[0]);
  const [labelName, setLabelName] = useState('TuneMavens Roster');
  const [catalogNumber, setCatalogNumber] = useState(`TM-${new Date().getFullYear()}-001`);

  // Artwork Studio State: 'gradient' (EPK Subtle Gradient) | 'upload' | 'ai'
  const [artworkMode, setArtworkMode] = useState('gradient');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [isArtworkDragOver, setIsArtworkDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const artworkFileInputRef = useRef(null);

  // Creator EPK Colors & Subtle Ambient Gradient Matching
  const effectiveAccent = creatorEpk?.accentColor || '#00f0ff';
  const effectiveSecondary = creatorEpk?.secondaryColor || '#ff007f';
  const subtleEpkGradient = `linear-gradient(135deg, ${effectiveAccent}25 0%, #0a0e1c 50%, ${effectiveSecondary}25 100%)`;

  const generateEpkGradientCover = (title, artist, accent, secondary) => {
    const cleanTitle = (title || 'Master Release').replace(/[<>&"]/g, '');
    const cleanArtist = (artist || 'Creator').replace(/[<>&"]/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="epkBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.25"/>
          <stop offset="45%" stop-color="#090d1b" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="${secondary}" stop-opacity="0.25"/>
        </linearGradient>
        <radialGradient id="epkGlow" cx="80%" cy="20%" r="65%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="#070a14"/>
      <rect width="800" height="800" fill="url(#epkBg)"/>
      <rect width="800" height="800" fill="url(#epkGlow)"/>
      <!-- Subtle Circular Vinyl Grooves -->
      <circle cx="400" cy="400" r="340" fill="none" stroke="${accent}" stroke-opacity="0.1" stroke-width="2"/>
      <circle cx="400" cy="400" r="290" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1.5"/>
      <circle cx="400" cy="400" r="230" fill="none" stroke="${secondary}" stroke-opacity="0.08" stroke-width="1.5"/>
      <circle cx="400" cy="400" r="170" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
      <!-- Center Label Core -->
      <circle cx="400" cy="400" r="115" fill="#04060d" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>
      <circle cx="400" cy="400" r="26" fill="${accent}" fill-opacity="0.25" stroke="${accent}" stroke-width="1.5"/>
      <circle cx="400" cy="400" r="6" fill="#ffffff"/>
      <!-- Elegant Typography -->
      <text x="400" y="380" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="900" letter-spacing="2">${cleanTitle.toUpperCase()}</text>
      <text x="400" y="420" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-size="15" font-weight="700" letter-spacing="3">${cleanArtist.toUpperCase()}</text>
      <text x="400" y="730" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="12" font-weight="600" letter-spacing="4">TUNEMAVENS • CREATOR EPK RELEASE</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const handleArtworkFileUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (.jpg, .png, .webp).');
      return;
    }
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverArtUrl(e.target.result);
      setArtworkMode('upload');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAiCover = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError(null);
    setErrorMsg(null);
    try {
      const resp = await fetch('http://localhost:8001/api/social-ai/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          aspect_ratio: '1:1'
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        const url = data.media_url ? (data.media_url.startsWith('http') ? data.media_url : `http://localhost:8001${data.media_url}`) : null;
        if (url) {
          setCoverArtUrl(url);
          setArtworkMode('ai');
        } else {
          throw new Error('No artwork URL returned');
        }
      } else {
        const seed = Date.now() % 1000000;
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt.trim())}?width=1024&height=1024&nologo=true&seed=${seed}`;
        setCoverArtUrl(fallbackUrl);
        setArtworkMode('ai');
      }
    } catch (err) {
      console.warn('AI cover generation fallback to square generator:', err);
      const seed = Date.now() % 1000000;
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt.trim())}?width=1024&height=1024&nologo=true&seed=${seed}`;
      setCoverArtUrl(fallbackUrl);
      setArtworkMode('ai');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleInspirePrompt = () => {
    const title = releaseTitle.trim() || 'Solar Resonance';
    const artist = primaryArtist.trim() || 'Ndufo';
    const suggested = `Afro-futuristic ${genre} album cover for "${title}" by ${artist}, neon holographic lighting in ${effectiveAccent} and ${effectiveSecondary}, cinematic vinyl aesthetic, 8k ultra-detailed studio photography`;
    setAiPrompt(suggested);
  };

  // STEP 2: Ingest Audio Tracks
  const [tracks, setTracks] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Manual single-track helper in step 2
  const [manualTitle, setManualTitle] = useState('');
  const [manualDuration, setManualDuration] = useState('3:30');

  // STEP 3: Writers, Producers & Splits
  // Option to bulk apply step 3 rules to all tracks
  const [applyToAllTracks, setApplyToAllTracks] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  // Global / default splits & contributors template
  const [sharedWriters, setSharedWriters] = useState([
    { name: sessionUser?.artist_name || sessionUser?.name || 'Ndufo', pro: 'BMI', share: 100 }
  ]);
  const [sharedProducers, setSharedProducers] = useState([
    { name: sessionUser?.artist_name || sessionUser?.name || 'Ndufo', role: 'Primary Producer' }
  ]);

  // Publishing splits
  const [writerPublishingShare, setWriterPublishingShare] = useState(50);
  const [publisherPublishingShare, setPublisherPublishingShare] = useState(50);

  // Distribution (Master) splits
  const [distroArtistSplit, setDistroArtistSplit] = useState(60);
  const [distroProducerSplit, setDistroProducerSplit] = useState(25);
  const [distroLabelSplit, setDistroLabelSplit] = useState(15);

  // Sync Licensing info
  const [syncCleared, setSyncCleared] = useState(true);
  const [instrumentalAvailable, setInstrumentalAvailable] = useState(true);
  const [contentAdvisory, setContentAdvisory] = useState('Clean');
  const [syncNotes, setSyncNotes] = useState('100% One-Stop Pre-cleared for TV, Film, Ads & Gaming.');

  // Handle Drag & Drop in Step 2
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAudioFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processAudioFiles(Array.from(e.target.files));
    }
  };

  const processAudioFiles = (files) => {
    const audioFiles = files.filter(f =>
      f.name.match(/\.(mp3|wav|flac|aac|m4a|ogg|aiff)$/i) || f.type.startsWith('audio/')
    );

    const targetFiles = audioFiles.length > 0 ? audioFiles : files;

    const newTracks = targetFiles.map((file, idx) => {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/^\d+\s*[-.]*\s*/, '');
      const formattedTitle = cleanName
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') || `Track ${tracks.length + idx + 1}`;

      const sequence = existingTracksCount + tracks.length + idx + 1;
      const isrcSeq = String(sequence).padStart(5, '0');
      const generatedIsrc = `KE-TM1-${releaseYear.slice(-2)}-${isrcSeq}`;

      return {
        id: Date.now() + idx,
        trackNumber: tracks.length + idx + 1,
        title: formattedTitle,
        isrc: generatedIsrc,
        duration: '3:35',
        fileSize: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '12.4 MB',
        fileName: file.name,
        file: file,
        writers: [...sharedWriters],
        producers: [...sharedProducers],
        publishingSplit: `Writer (${writerPublishingShare}%) / Publisher (${publisherPublishingShare}%)`,
        distributionSplit: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
        syncCleared: syncCleared,
        instrumentalAvailable: instrumentalAvailable,
        contentAdvisory: contentAdvisory
      };
    });

    setTracks(prev => [...prev, ...newTracks]);
  };

  const handleAddManualTrack = (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    const sequence = existingTracksCount + tracks.length + 1;
    const isrcSeq = String(sequence).padStart(5, '0');
    const generatedIsrc = `KE-TM1-${releaseYear.slice(-2)}-${isrcSeq}`;

    const newTrack = {
      id: Date.now(),
      trackNumber: tracks.length + 1,
      title: manualTitle.trim(),
      isrc: generatedIsrc,
      duration: manualDuration.trim() || '3:30',
      fileSize: 'Manual Cue',
      fileName: `${manualTitle.trim().toLowerCase().replace(/\s+/g, '_')}.wav`,
      writers: [...sharedWriters],
      producers: [...sharedProducers],
      publishingSplit: `Writer (${writerPublishingShare}%) / Publisher (${publisherPublishingShare}%)`,
      distributionSplit: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
      syncCleared: syncCleared,
      instrumentalAvailable: instrumentalAvailable,
      contentAdvisory: contentAdvisory
    };

    setTracks(prev => [...prev, newTrack]);
    setManualTitle('');
  };

  const handleRemoveTrack = (indexToRemove) => {
    setTracks(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleUpdateTrackField = (index, field, value) => {
    setTracks(prev => prev.map((t, i) => i === index ? { ...t, [field]: value } : t));
  };

  // Step 3 Writers Management
  const handleAddWriter = () => {
    setSharedWriters(prev => [...prev, { name: '', pro: 'BMI', share: 0 }]);
  };

  const handleUpdateWriter = (index, field, value) => {
    setSharedWriters(prev => prev.map((w, i) => i === index ? { ...w, [field]: value } : w));
  };

  const handleRemoveWriter = (index) => {
    if (sharedWriters.length <= 1) return;
    setSharedWriters(prev => prev.filter((_, i) => i !== index));
  };

  // Step 3 Producers Management
  const handleAddProducer = () => {
    setSharedProducers(prev => [...prev, { name: '', role: 'Co-Producer' }]);
  };

  const handleUpdateProducer = (index, field, value) => {
    setSharedProducers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const handleRemoveProducer = (index) => {
    if (sharedProducers.length <= 1) return;
    setSharedProducers(prev => prev.filter((_, i) => i !== index));
  };

  // Total split calculations
  const totalWritersShare = sharedWriters.reduce((acc, w) => acc + (Number(w.share) || 0), 0);
  const totalDistroSplit = Number(distroArtistSplit) + Number(distroProducerSplit) + Number(distroLabelSplit);

  // Validation before going to next step
  const validateStep = (step) => {
    setErrorMsg(null);
    if (step === 1) {
      if (!releaseTitle.trim()) {
        setErrorMsg('Please enter an Album, EP, Mixtape, or Single title.');
        return false;
      }
      if (!primaryArtist.trim()) {
        setErrorMsg('Please specify the primary artist name.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (tracks.length === 0) {
        setErrorMsg('Please upload or add at least one audio track to this release.');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (totalWritersShare !== 100) {
        setErrorMsg(`Songwriter shares must total exactly 100%. Currently: ${totalWritersShare}%.`);
        return false;
      }
      if (totalDistroSplit !== 100) {
        setErrorMsg(`Distribution royalty splits must total exactly 100%. Currently: ${totalDistroSplit}%.`);
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      // Sync shared step 3 data to tracks if applyToAllTracks is enabled
      if (currentStep === 2 || currentStep === 3) {
        setTracks(prev => prev.map(t => ({
          ...t,
          writers: [...sharedWriters],
          producers: [...sharedProducers],
          publishingSplit: `Writer (${writerPublishingShare}%) / Publisher (${publisherPublishingShare}%)`,
          distributionSplit: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
          split: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
          syncCleared,
          instrumentalAvailable,
          contentAdvisory
        })));
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // SUBMIT WIZARD PAYLOAD TO BACKEND
  const handleFinalIngest = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    // Upload any audio files that have not yet been stored in creator storage
    const resolvedTracks = await Promise.all(tracks.map(async (t) => {
      let audioUrl = t.audioUrl || t.fileUrl || '';
      if (!audioUrl && t.file) {
        try {
          const formData = new FormData();
          formData.append('file', t.file);
          formData.append('folder', 'audio');
          formData.append('title', t.title);
          formData.append('subdomain', sessionUser?.username || 'ndufo');

          const uploadRes = await fetch('http://localhost:8001/api/storage/upload', {
            method: 'POST',
            body: formData
          });
          if (uploadRes.ok) {
            const data = await uploadRes.json();
            audioUrl = data.url || data.asset?.media_url || '';
          }
        } catch (err) {
          console.warn('Audio upload warning for track:', t.title, err);
        }
      }
      return { ...t, audioUrl, fileUrl: audioUrl };
    }));

    const effectiveCover = coverArtUrl.trim() || generateEpkGradientCover(releaseTitle, primaryArtist, effectiveAccent, effectiveSecondary);
    const finalTracksPayload = resolvedTracks.map((t, idx) => ({
      id: t.id || Date.now() + idx,
      isrc: t.isrc,
      title: t.title,
      artist: primaryArtist,
      release: releaseTitle,
      releaseType: releaseType,
      year: releaseYear,
      genre: genre,
      duration: t.duration || '3:30',
      streams: '0',
      priceCredits: 50,
      audioUrl: t.audioUrl || '',
      fileUrl: t.fileUrl || t.audioUrl || '',
      coverArt: effectiveCover,
      coverText: releaseTitle.slice(0, 8) || 'Release',
      coverBg: subtleEpkGradient,
      status: 'valid',
      isFeatured: idx === 0,
      writers: sharedWriters,
      producers: sharedProducers,
      publishingSplit: `Writer (${writerPublishingShare}%) / Publisher (${publisherPublishingShare}%)`,
      distributionSplit: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
      split: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
      syncCleared,
      instrumentalAvailable,
      contentAdvisory
    }));

    const payload = {
      subdomain: sessionUser?.username || 'ndufo',
      release: {
        title: releaseTitle,
        type: releaseType,
        primaryArtist: primaryArtist,
        year: releaseYear,
        genre: genre,
        coverArt: effectiveCover,
        coverBg: subtleEpkGradient,
        coverText: releaseTitle.slice(0, 8) || 'Release',
        labelName: labelName,
        catalogNumber: catalogNumber
      },
      tracks: finalTracksPayload,
      globalRights: {
        writers: sharedWriters,
        producers: sharedProducers,
        publishingSplit: `Writer (${writerPublishingShare}%) / Publisher (${publisherPublishingShare}%)`,
        distributionSplit: `Artist (${distroArtistSplit}%) / Producer (${distroProducerSplit}%) / Label (${distroLabelSplit}%)`,
        syncCleared,
        instrumentalAvailable,
        contentAdvisory,
        syncNotes
      }
    };

    try {
      const resp = await fetch('http://localhost:8001/api/catalog/wizard-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with status ${resp.status}`);
      }

      const resData = await resp.json();
      setIngestedResult(resData);
      setIngestSuccess(true);

      // Local fallback sync
      try {
        const existingLocal = JSON.parse(localStorage.getItem('catalog_tracks') || '[]');
        const updatedLocal = [...finalTracksPayload, ...existingLocal];
        localStorage.setItem('catalog_tracks', JSON.stringify(updatedLocal));
      } catch (_) {}

      if (typeof onIngestComplete === 'function') {
        onIngestComplete(resData.tracks || finalTracksPayload);
      }
    } catch (err) {
      console.error('Wizard Ingestion Error:', err);
      setErrorMsg(`Ingestion failed: ${err.message}. Changes were saved locally.`);
      // Fallback local ingestion anyway so the user never loses tracks
      try {
        const existingLocal = JSON.parse(localStorage.getItem('catalog_tracks') || '[]');
        const updatedLocal = [...finalTracksPayload, ...existingLocal];
        localStorage.setItem('catalog_tracks', JSON.stringify(updatedLocal));
        if (typeof onIngestComplete === 'function') {
          onIngestComplete(updatedLocal);
        }
        setIngestSuccess(true);
      } catch (localErr) {
        console.error('Local fallback failed:', localErr);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (ingestSuccess) {
    return (
      <div style={{
        background: '#090d1a',
        border: '1px solid rgba(0, 240, 255, 0.25)',
        borderRadius: '8px',
        padding: '40px 24px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#22c55e',
          fontSize: '36px'
        }}>
          <RiCheckboxCircleFill />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
          Catalogue Ingestion Complete!
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          <strong>{releaseTitle}</strong> ({releaseType}) by <strong>{primaryArtist}</strong> with {tracks.length} audio master track(s) has been successfully synchronized across the TuneMavens Database, Mother-CMS, and EPK engine.
        </p>

        {/* Action switch buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onSwitchToManager}
            style={{
              background: '#00f0ff',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(0,240,255,0.35)'
            }}
          >
            <RiDiscFill size={18} /> Open Catalogue Manager
          </button>

          <button
            type="button"
            onClick={() => {
              setIngestSuccess(false);
              setCurrentStep(1);
              setTracks([]);
              setReleaseTitle('');
            }}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '12px 20px',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            + Ingest Another Release
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1040px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* TOP BAR WITH SWITCH BUTTONS */}
      <div style={{
        background: '#0a0f1d',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontSize: '18px'
          }}>
            <RiDiscFill />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '0.02em' }}>
              Catalogue Ingestion Wizard
            </h2>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Step-by-step master audio ingestion, metadata rights & 3-way royalty split definitions
            </span>
          </div>
        </div>

        {/* Prominent Quick-Switch Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={onSwitchToManager}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              padding: '8px 14px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Switch to Track Management Table"
          >
            <RiSettings3Fill size={14} /> Catalogue Manager
          </button>
        </div>
      </div>

      {/* STEP INDICATOR HEADER */}
      <div style={{
        background: '#0d1326',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '6px',
        padding: '16px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          position: 'relative'
        }}>
          {[
            { num: 1, title: 'Release Info', desc: 'Album / EP / Mixtape' },
            { num: 2, title: 'Audio Tracks', desc: 'Masters & ISRCs' },
            { num: 3, title: 'Writers & Splits', desc: 'Publishing, Distro & Sync' },
            { num: 4, title: 'Review & Ingest', desc: 'Deploy to Catalogue' }
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isDone = currentStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isDone) setCurrentStep(s.num);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: isActive ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: isActive
                    ? '1.5px solid #00f0ff'
                    : isDone
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid rgba(255,255,255,0.05)',
                  cursor: isDone ? 'pointer' : 'default',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isDone ? '#22c55e' : isActive ? '#00f0ff' : 'rgba(255,255,255,0.1)',
                  color: isActive || isDone ? '#000' : '#94a3b8',
                  fontWeight: 900,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone ? '✓' : s.num}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: isActive ? '#fff' : isDone ? '#22c55e' : '#94a3b8',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ERROR ALERT BANNER */}
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          padding: '12px 16px',
          color: '#fca5a5',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <RiAlertFill size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ================= STEP 1: RELEASE DETAILS ================= */}
      {currentStep === 1 && (
        <div style={{
          background: '#0a0f1d',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
              Step 1: Release & Project Information
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Specify the release type, title, and metadata for your upcoming music package.
            </p>
          </div>

          {/* Project Type Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
              Release Format / Project Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { id: 'Album', label: 'Album (LP)', desc: '8+ Master Tracks', icon: '💿' },
                { id: 'EP', label: 'EP (Extended Play)', desc: '3 - 7 Tracks', icon: '🎵' },
                { id: 'Mixtape', label: 'Mixtape / Street Tape', desc: 'Promotional / Street', icon: '📼' },
                { id: 'Single', label: 'Single / Standalone', desc: '1 - 2 Tracks', icon: '⚡' }
              ].map(opt => {
                const isSelected = releaseType === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setReleaseType(opt.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{opt.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#00f0ff' : '#fff' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{opt.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inputs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                {releaseType} Title *
              </label>
              <input
                type="text"
                value={releaseTitle}
                onChange={e => setReleaseTitle(e.target.value)}
                placeholder="e.g. Neon Safari, Nairobi Cyberwave"
                className="form-control"
                style={{
                  width: '100%',
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 12px',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Primary Artist Name *
              </label>
              <input
                type="text"
                value={primaryArtist}
                onChange={e => setPrimaryArtist(e.target.value)}
                placeholder="e.g. Ndufo"
                className="form-control"
                style={{
                  width: '100%',
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 12px',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Primary Genre
              </label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 12px',
                  borderRadius: '4px'
                }}
              >
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Release Year
              </label>
              <input
                type="text"
                value={releaseYear}
                onChange={e => setReleaseYear(e.target.value)}
                className="form-control"
                style={{
                  width: '100%',
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 12px',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* ================= RELEASE ARTWORK STUDIO (Upload, AI, or EPK Subtle Gradient) ================= */}
          <div style={{
            background: '#070c18',
            border: `1px solid ${effectiveAccent}33`,
            borderRadius: '6px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🎨</span>
                  <label style={{ fontSize: '13px', fontWeight: 900, color: '#fff', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Release Artwork & Graphic Studio
                  </label>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: artworkMode === 'gradient' ? 'rgba(0, 240, 255, 0.15)' : (artworkMode === 'ai' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(34, 197, 94, 0.2)'),
                    color: artworkMode === 'gradient' ? effectiveAccent : (artworkMode === 'ai' ? '#c084fc' : '#4ade80'),
                    border: `1px solid ${artworkMode === 'gradient' ? effectiveAccent : (artworkMode === 'ai' ? '#c084fc' : '#4ade80')}44`
                  }}>
                    {artworkMode === 'gradient' ? 'EPK Gradient Active' : (artworkMode === 'ai' ? 'AI Art Active' : 'Custom Upload Active')}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
                  Upload master artwork, generate with AI prompt, or utilize a subtle ambient gradient matching your EPK theme.
                </p>
              </div>

              {/* Artwork Mode Selector Buttons */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setArtworkMode('gradient');
                    setCoverArtUrl('');
                  }}
                  style={{
                    background: artworkMode === 'gradient' ? effectiveAccent : 'transparent',
                    color: artworkMode === 'gradient' ? '#000' : '#cbd5e1',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiPaletteFill size={13} /> EPK Gradient
                </button>
                <button
                  type="button"
                  onClick={() => setArtworkMode('upload')}
                  style={{
                    background: artworkMode === 'upload' ? effectiveAccent : 'transparent',
                    color: artworkMode === 'upload' ? '#000' : '#cbd5e1',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiUploadFill size={13} /> Upload Artwork
                </button>
                <button
                  type="button"
                  onClick={() => setArtworkMode('ai')}
                  style={{
                    background: artworkMode === 'ai' ? effectiveAccent : 'transparent',
                    color: artworkMode === 'ai' ? '#000' : '#cbd5e1',
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiMagicFill size={13} /> AI Generator
                </button>
              </div>
            </div>

            {/* Main Studio Body: Left Preview, Right Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Square 1:1 Live Preview */}
              <div style={{
                width: '170px',
                height: '170px',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative',
                border: `1.5px solid ${effectiveAccent}44`,
                boxShadow: `0 8px 30px rgba(0,0,0,0.6)`,
                background: '#04060d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {coverArtUrl.trim() ? (
                  <>
                    <img
                      src={coverArtUrl}
                      alt={releaseTitle || 'Release Artwork'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(4px)',
                      color: effectiveAccent,
                      border: `1px solid ${effectiveAccent}44`,
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontWeight: 900
                    }}>
                      {artworkMode === 'ai' ? 'AI MASTER ART' : 'CUSTOM ARTWORK'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCoverArtUrl('');
                        setArtworkMode('gradient');
                      }}
                      title="Reset to EPK Gradient"
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#f87171',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontWeight: 900
                      }}
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  /* Subtle Ambient Gradient matching Creator's EPK Colors */
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: subtleEpkGradient,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    textAlign: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* Vinyl grooves background lines */}
                    <div style={{
                      position: 'absolute',
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      border: `1px solid ${effectiveAccent}20`,
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      border: `1px solid ${effectiveSecondary}20`,
                      pointerEvents: 'none'
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.4)',
                      border: `1px solid ${effectiveAccent}40`,
                      pointerEvents: 'none'
                    }} />

                    {/* Typography matching EPK */}
                    <div style={{
                      zIndex: 2,
                      fontSize: '12px',
                      fontWeight: 900,
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: 1.2,
                      maxWidth: '140px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {releaseTitle || 'Release Title'}
                    </div>
                    <div style={{
                      zIndex: 2,
                      fontSize: '10px',
                      fontWeight: 800,
                      color: effectiveAccent,
                      marginTop: '4px',
                      letterSpacing: '0.04em'
                    }}>
                      {primaryArtist || 'Artist'}
                    </div>
                    <span style={{
                      position: 'absolute',
                      bottom: '6px',
                      fontSize: '8px',
                      fontWeight: 800,
                      color: '#64748b',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}>
                      EPK MATCHED GRADIENT
                    </span>
                  </div>
                )}
              </div>

              {/* Right Mode-Specific Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* MODE 1: EPK Subtle Gradient Controls */}
                {artworkMode === 'gradient' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '4px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>EPK Theme Palette:</span>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: effectiveAccent, border: '1px solid #fff' }} title={`Accent: ${effectiveAccent}`} />
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: effectiveSecondary, border: '1px solid #fff' }} title={`Secondary: ${effectiveSecondary}`} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                        Matched to <strong>{creatorEpk?.siteName || primaryArtist}</strong>'s official press world.
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                      When no custom image is uploaded or generated, the system renders this refined ambient gradient with high-contrast release typography and vinyl groove aesthetics.
                    </p>

                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        Alternative Theme Presets:
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {DEFAULT_COVER_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedPresetCover(preset);
                              setCoverArtUrl('');
                            }}
                            style={{
                              background: preset.bg,
                              border: selectedPresetCover.name === preset.name && !coverArtUrl ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
                              padding: '4px 10px',
                              borderRadius: '3px',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: File Upload Controls */}
                {artworkMode === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsArtworkDragOver(true); }}
                      onDragLeave={() => setIsArtworkDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsArtworkDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleArtworkFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => artworkFileInputRef.current?.click()}
                      style={{
                        border: `1.5px dashed ${isArtworkDragOver ? effectiveAccent : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: '6px',
                        background: isArtworkDragOver ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                        padding: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="file"
                        ref={artworkFileInputRef}
                        accept="image/png,image/jpeg,image/webp"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleArtworkFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                      <RiFolderUploadFill size={24} style={{ color: effectiveAccent, marginBottom: '4px' }} />
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>
                        {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Click to Browse Artwork or Drag & Drop File'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        High-resolution .PNG, .JPG, or .WEBP (Recommended: 3000 x 3000px square)
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Or direct image URL:</span>
                      <input
                        type="url"
                        placeholder="https://.../cover.jpg"
                        value={coverArtUrl}
                        onChange={e => {
                          setCoverArtUrl(e.target.value);
                          if (e.target.value) setArtworkMode('upload');
                        }}
                        style={{
                          flex: 1,
                          background: '#0d1326',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '6px 10px',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* MODE 3: AI Prompt Generator Controls */}
                {artworkMode === 'ai' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#cbd5e1' }}>
                        AI Artwork Prompt (1:1 Aspect Ratio)
                      </label>
                      <button
                        type="button"
                        onClick={handleInspirePrompt}
                        style={{
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          color: '#c084fc',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiSparklingFill size={11} /> Inspire Prompt
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder={`e.g. Afro-futuristic ${genre} album cover for "${releaseTitle || 'Release'}", neon highlights, atmospheric cinematic photography, 8k ultra-detailed`}
                      style={{
                        width: '100%',
                        background: '#0d1326',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '8px 10px',
                        borderRadius: '4px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        disabled={isGeneratingAi || !aiPrompt.trim()}
                        onClick={handleGenerateAiCover}
                        style={{
                          background: isGeneratingAi ? 'rgba(0, 240, 255, 0.3)' : effectiveAccent,
                          color: '#000',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          fontWeight: 900,
                          fontSize: '12px',
                          cursor: isGeneratingAi ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiMagicFill size={14} />
                        {isGeneratingAi ? 'Generating High-Res Cover...' : 'Generate Artwork with AI'}
                      </button>

                      {coverArtUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setCoverArtUrl('');
                            setArtworkMode('gradient');
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#94a3b8',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Clear Artwork
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Label & Catalog Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Record Label / Imprint
              </label>
              <input
                type="text"
                value={labelName}
                onChange={e => setLabelName(e.target.value)}
                className="form-control"
                style={{
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Catalog ID
              </label>
              <input
                type="text"
                value={catalogNumber}
                onChange={e => setCatalogNumber(e.target.value)}
                className="form-control"
                style={{
                  background: '#0d1326',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: AUDIO TRACKS & METADATA ================= */}
      {currentStep === 2 && (
        <div style={{
          background: '#0a0f1d',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
              Step 2: Master Audio Ingestion & ISRCs
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Drag and drop WAV, MP3, or FLAC master files. We will auto-parse track names and provision compliant ISRC codes.
            </p>
          </div>

          {/* DRAG & DROP ZONE */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: isDragOver ? '2px dashed #00f0ff' : '2px dashed rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '36px 20px',
              textAlign: 'center',
              background: isDragOver ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="audio/*,.wav,.mp3,.flac,.aiff,.m4a"
              style={{ display: 'none' }}
            />
            <RiFolderUploadFill size={40} style={{ color: isDragOver ? '#00f0ff' : '#94a3b8', marginBottom: '8px' }} />
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>
              Drag & Drop Master Audio Files Here
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Supports .WAV, .MP3, .FLAC, .AIFF • Multiple files supported
            </div>
          </div>

          {/* Quick Manual Track Add Option */}
          <form
            onSubmit={handleAddManualTrack}
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, flexShrink: 0 }}>
              Or add manually:
            </span>
            <input
              type="text"
              placeholder="Track Title (e.g. Serengeti Sunrise)"
              value={manualTitle}
              onChange={e => setManualTitle(e.target.value)}
              className="form-control"
              style={{
                flex: 2,
                background: '#0d1326',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: '4px'
              }}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 3:45)"
              value={manualDuration}
              onChange={e => setManualDuration(e.target.value)}
              className="form-control"
              style={{
                width: '110px',
                background: '#0d1326',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#00f0ff',
                color: '#000',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '4px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RiAddLine /> Add Track
            </button>
          </form>

          {/* INGESTED TRACKS LIST */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                Ingested Tracks ({tracks.length})
              </span>
              {tracks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTracks([])}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Clear All Tracks
                </button>
              )}
            </div>

            {tracks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '6px',
                color: '#64748b'
              }}>
                <RiMusic2Fill size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <div style={{ fontSize: '13px' }}>No tracks ingested yet. Drag files above or add manually.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tracks.map((track, idx) => (
                  <div
                    key={track.id || idx}
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#00f0ff',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>

                    <div style={{ flex: 2 }}>
                      <input
                        type="text"
                        value={track.title}
                        onChange={e => handleUpdateTrackField(idx, 'title', e.target.value)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '13px',
                          width: '100%',
                          padding: '2px 0'
                        }}
                      />
                    </div>

                    <div style={{ width: '150px' }}>
                      <input
                        type="text"
                        value={track.isrc}
                        onChange={e => handleUpdateTrackField(idx, 'isrc', e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#00f0ff',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          padding: '4px 6px',
                          borderRadius: '3px',
                          width: '100%'
                        }}
                      />
                    </div>

                    <div style={{ width: '70px' }}>
                      <input
                        type="text"
                        value={track.duration}
                        onChange={e => handleUpdateTrackField(idx, 'duration', e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#cbd5e1',
                          fontSize: '11px',
                          padding: '4px 6px',
                          borderRadius: '3px',
                          width: '100%',
                          textAlign: 'center'
                        }}
                      />
                    </div>

                    <span style={{ fontSize: '11px', color: '#64748b', width: '80px', textAlign: 'right' }}>
                      {track.fileSize}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Remove Track"
                    >
                      <RiDeleteBin6Line size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STEP 3: WRITERS, PRODUCERS & SPLITS ================= */}
      {currentStep === 3 && (
        <div style={{
          background: '#0a0f1d',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
              Step 3: Writers, Producers & 3-Way Royalty Splits
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Accurately define publishing rights, master streaming distribution splits, and sync licensing clearance status.
            </p>
          </div>

          {/* Apply to all tracks toggle banner */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.06)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong style={{ fontSize: '13px', color: '#00f0ff' }}>Apply to All Tracks in Release</strong>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                All {tracks.length} track(s) in "{releaseTitle || 'this release'}" will adopt these writer and split definitions.
              </div>
            </div>
            <input
              type="checkbox"
              checked={applyToAllTracks}
              onChange={e => setApplyToAllTracks(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#00f0ff', cursor: 'pointer' }}
            />
          </div>

          {/* 1. SONGWRITERS & LYRICISTS */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiUserVoiceFill style={{ color: '#00f0ff' }} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Songwriters & Lyricists</span>
              </div>
              <button
                type="button"
                onClick={handleAddWriter}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#00f0ff',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Add Songwriter
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sharedWriters.map((writer, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 30px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Full Legal Name"
                    value={writer.name}
                    onChange={e => handleUpdateWriter(idx, 'name', e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  />

                  <select
                    value={writer.pro}
                    onChange={e => handleUpdateWriter(idx, 'pro', e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  >
                    {PRO_LIST.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={writer.share}
                      onChange={e => handleUpdateWriter(idx, 'share', e.target.value)}
                      className="form-control"
                      style={{
                        background: '#0d1326',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '12px',
                        padding: '8px',
                        borderRadius: '4px',
                        textAlign: 'right'
                      }}
                    />
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveWriter(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove writer"
                  >
                    <RiDeleteBin6Line size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: totalWritersShare === 100 ? '#22c55e' : '#ef4444' }}>
              Total Writer Shares: <strong>{totalWritersShare}%</strong> {totalWritersShare === 100 ? '(Balanced)' : '(Must equal 100%)'}
            </div>
          </div>

          {/* 2. PRODUCERS & SOUND ENGINEERS */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiEqualizerFill style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Producers & Sound Engineers</span>
              </div>
              <button
                type="button"
                onClick={handleAddProducer}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Add Producer
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sharedProducers.map((producer, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 30px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Producer / Sound Engineer Name"
                    value={producer.name}
                    onChange={e => handleUpdateProducer(idx, 'name', e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  />

                  <select
                    value={producer.role}
                    onChange={e => handleUpdateProducer(idx, 'role', e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '8px',
                      borderRadius: '4px'
                    }}
                  >
                    {PRODUCER_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveProducer(idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove producer"
                  >
                    <RiDeleteBin6Line size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. THREE-WAY REVENUE SPLIT PIPELINES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            {/* A. Publishing Split */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <RiCoinsFill style={{ color: '#a855f7' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Publishing Allocation</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 12px' }}>
                Performance & Mechanical royalties (PRO collection: Writer vs. Publisher shares).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Writer's Share (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={writerPublishingShare}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setWriterPublishingShare(val);
                      setPublisherPublishingShare(100 - val);
                    }}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Publisher's Share (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={publisherPublishingShare}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setPublisherPublishingShare(val);
                      setWriterPublishingShare(100 - val);
                    }}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* B. Distribution (Master) Split */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <RiGlobalFill style={{ color: '#22c55e' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Distribution (Master) Split</span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 12px' }}>
                Streaming DSP payouts (Spotify, Apple Music, YouTube) automated payout breakdown.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>
                    Artist (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={distroArtistSplit}
                    onChange={e => setDistroArtistSplit(e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '6px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>
                    Producer (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={distroProducerSplit}
                    onChange={e => setDistroProducerSplit(e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '6px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginBottom: '2px' }}>
                    Label (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={distroLabelSplit}
                    onChange={e => setDistroLabelSplit(e.target.value)}
                    className="form-control"
                    style={{
                      background: '#0d1326',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '6px',
                      borderRadius: '4px',
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '8px', fontSize: '10px', color: totalDistroSplit === 100 ? '#22c55e' : '#ef4444', textAlign: 'right' }}>
                Total: <strong>{totalDistroSplit}%</strong>
              </div>
            </div>
          </div>

          {/* 4. SYNC LICENSING CLEARANCE STATUS */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <RiShieldCheckFill style={{ color: '#00f0ff' }} />
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Sync Licensing & Film Placement Metadata</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', alignItems: 'center' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: '#0d1326',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <input
                  type="checkbox"
                  checked={syncCleared}
                  onChange={e => setSyncCleared(e.target.checked)}
                  style={{ accentColor: '#00f0ff' }}
                />
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>100% Pre-cleared (One-Stop)</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                background: '#0d1326',
                padding: '10px 12px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <input
                  type="checkbox"
                  checked={instrumentalAvailable}
                  onChange={e => setInstrumentalAvailable(e.target.checked)}
                  style={{ accentColor: '#00f0ff' }}
                />
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>Instrumentals & Stems Ready</span>
              </label>

              <div style={{
                background: '#0d1326',
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Advisory</label>
                <select
                  value={contentAdvisory}
                  onChange={e => setContentAdvisory(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    width: '100%',
                    fontWeight: 700
                  }}
                >
                  <option value="Clean">Clean / Radio Friendly</option>
                  <option value="Explicit">Explicit Lyrics</option>
                  <option value="Instrumental">Instrumental Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: REVIEW & INGESTION ================= */}
      {currentStep === 4 && (
        <div style={{
          background: '#0a0f1d',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
              Step 4: Final Review & Database Deployment
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Verify all release metadata and split allocations before publishing permanently into your catalogue.
            </p>
          </div>

          {/* RELEASE CARD SUMMARY */}
          <div style={{
            background: '#0d1326',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '6px',
              background: coverArtUrl.trim() ? `url(${coverArtUrl}) center/cover no-repeat` : selectedPresetCover.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '12px',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              textAlign: 'center',
              padding: '6px'
            }}>
              {!coverArtUrl.trim() && (releaseTitle || selectedPresetCover.text)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: 'rgba(0, 240, 255, 0.15)',
                  color: '#00f0ff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '3px'
                }}>
                  {releaseType}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{genre} • {releaseYear}</span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>
                {releaseTitle}
              </h2>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                by <strong>{primaryArtist}</strong> • {labelName} ({catalogNumber})
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                {tracks.length} Master Track(s) • Sync Pre-cleared: {syncCleared ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* PER-TRACK REVIEW BREAKDOWN */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
              Tracklist & Rights Allocations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {tracks.map((t, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#00f0ff', fontWeight: 800 }}>#{i + 1}</span>
                    <strong style={{ color: '#fff' }}>{t.title}</strong>
                    <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '11px' }}>{t.isrc}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#cbd5e1', fontSize: '11px' }}>
                    <span>Duration: {t.duration}</span>
                    <span style={{ color: '#22c55e' }}>Artist {distroArtistSplit}% / Prod {distroProducerSplit}% / Label {distroLabelSplit}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM WIZARD CONTROLS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0'
      }}>
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={isSubmitting}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiArrowLeftLine /> Previous Step
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            style={{
              background: '#00f0ff',
              color: '#000',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0, 240, 255, 0.35)'
            }}
          >
            Continue to Next Step <RiArrowRightLine />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalIngest}
            disabled={isSubmitting}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
              color: '#000',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '4px',
              fontWeight: 900,
              fontSize: '14px',
              cursor: isSubmitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(0, 240, 255, 0.45)',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            <RiSparklingFill />
            {isSubmitting ? 'Ingesting into Catalogue...' : 'Ingest & Deploy to Catalogue'}
          </button>
        )}
      </div>
    </div>
  );
}
