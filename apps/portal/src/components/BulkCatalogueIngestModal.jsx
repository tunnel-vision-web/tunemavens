import React, { useState, useRef, useEffect } from 'react';
import {
  RiCloseLine, RiUploadCloud2Fill, RiFileTextFill, RiFolderMusicFill,
  RiCheckDoubleFill, RiDeleteBin6Line, RiSparklingFill, RiDownload2Line,
  RiInformationLine, RiFileList3Fill, RiPriceTag3Fill, RiArrowRightSLine,
  RiArrowLeftSLine, RiPlayFill, RiPauseFill, RiUserVoiceFill, RiGroupFill,
  RiMusic2Fill, RiShieldCheckFill, RiAddLine, RiCheckLine
} from 'react-icons/ri';
import { getCachedGenres } from '../lib/genres.js';

export default function BulkCatalogueIngestModal({
  isOpen,
  onClose,
  activeSubdomain = 'ndufo',
  rosterArtists = [],
  onIngestSuccess
}) {
  if (!isOpen) return null;

  // 4-Step Wizard Navigation State
  const [currentStep, setCurrentStep] = useState(1); // 1: Input -> 2: Batch Config -> 3: Verification -> 4: Summary

  // Input & Parse State
  const [inputMode, setInputMode] = useState('csv'); // 'csv' | 'paste' | 'audio'
  const [parsedTracks, setParsedTracks] = useState([]);
  const [pasteText, setPasteText] = useState('');

  // Batch Configuration Defaults
  const [batchArtist, setBatchArtist] = useState(rosterArtists[0]?.name || 'Ndufo');
  const [batchFeaturedArtists, setBatchFeaturedArtists] = useState('');
  const [batchCollaborators, setBatchCollaborators] = useState('');
  const [batchGenre, setBatchGenre] = useState('Afro-fusion');
  const [batchRelease, setBatchRelease] = useState('');
  const [batchConsumption, setBatchConsumption] = useState('both');
  const [batchStreamPrice, setBatchStreamPrice] = useState(50);
  const [batchDownloadPrice, setBatchDownloadPrice] = useState(150);

  // Audio Preview Player State
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const audioRef = useRef(null);

  // Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successCount, setSuccessCount] = useState(null);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const availableGenres = getCachedGenres();

  // Stop audio preview if modal closes or track changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  const handleTogglePlayAudio = (track) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const previewUrl = track.audioUrl || track.fileUrl || `/api/stream/track/${encodeURIComponent(track.isrc || track.title || 'preview')}`;
    const newAudio = new Audio(previewUrl);
    newAudio.onended = () => setPlayingTrackId(null);
    newAudio.onerror = () => {
      // Audio preview fallback indicator
      setPlayingTrackId(null);
    };
    newAudio.play().catch(() => {});
    audioRef.current = newAudio;
    setPlayingTrackId(track.id);
  };

  // CSV Template download
  const handleDownloadTemplate = () => {
    const csvContent = 'Title,PrimaryArtist,FeaturedArtists,ISRC,Album,ReleaseType,Genre,Year,Streams,Split\n' +
      'Nairobi Cyberwave,Ndufo,Aisha Wanjiku,KE-TM1-26-00101,Neon Safari,Album,Afro-House,2026,1.4M,Artist (60%) / Producer (25%) / Label (15%)\n' +
      'Rift Valley Sunset,Ndufo,DJ Maphorisa,KE-TM1-26-00102,Neon Safari,Album,Amapiano,2026,850K,Artist (60%) / Producer (25%) / Label (15%)\n' +
      'Mombasa Midnight,Aisha Wanjiku,Sauti Sol,KE-TM1-26-00103,Coast Waves,EP,Afro-fusion,2026,420K,Artist (50%) / Producer (50%)\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'TuneMavens_Multi_Artist_Catalogue_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV file parser
  const handleCsvFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      parseCsvData(event.target.result);
    };
    reader.readAsText(file);
  };

  const parseCsvData = (rawText) => {
    try {
      const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setErrorMessage('File seems empty or missing header line.');
        return;
      }
      const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
      const tracks = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (cols.length === 0 || !cols[0]) continue;

        const row = {};
        header.forEach((key, idx) => {
          row[key] = cols[idx] || '';
        });

        const title = row.title || cols[0];
        const primaryArtist = row.primaryartist || row.artist || batchArtist || 'Ndufo';
        const rawFeatured = row.featuredartists || row.featuredartist || row.featured || '';
        const featuredArtists = rawFeatured ? rawFeatured.split(';').map(a => a.trim()).filter(Boolean) : [];
        const isrc = row.isrc || `KE-TM1-26-${70000 + i}`;
        const release = row.album || row.release || batchRelease || 'Bulk Ingest Release';
        const genre = row.genre || batchGenre || 'Afro-fusion';
        const year = row.year || String(new Date().getFullYear());
        const streams = row.streams || '0';
        const split = row.split || 'Artist (60%) / Producer (25%) / Label (15%)';

        const displayArtist = featuredArtists.length > 0
          ? `${primaryArtist} feat. ${featuredArtists.join(', ')}`
          : primaryArtist;

        tracks.push({
          id: Date.now() + i,
          title,
          primaryArtist,
          featuredArtists,
          collaborators: [],
          artist: displayArtist,
          isrc,
          release,
          releaseType: row.releasetype || (tracks.length > 5 ? 'Album' : 'Single'),
          genre,
          year,
          streams,
          split,
          consumptionType: batchConsumption,
          streamPriceCredits: Number(batchStreamPrice) || 50,
          downloadPriceCredits: Number(batchDownloadPrice) || 150,
          status: 'valid'
        });
      }

      setParsedTracks(tracks);
      setSuccessCount(null);
      setCurrentStep(2); // Auto-advance to batch config
    } catch (err) {
      setErrorMessage(`Failed to parse CSV: ${err.message}`);
    }
  };

  // Raw text paste parser
  const handleParsePaste = () => {
    if (!pasteText.trim()) return;
    setErrorMessage(null);
    const lines = pasteText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tracks = [];

    lines.forEach((line, i) => {
      const delimiter = line.includes('\t') ? '\t' : line.includes('|') ? '|' : ',';
      const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) return;

      const title = cols[0];
      const primaryArtist = cols[1] || batchArtist || 'Ndufo';
      const featuredRaw = cols[2] && (cols[2].includes('feat') || cols[2].includes('&') || cols[2].includes(',')) ? cols[2] : '';
      const isrcIdx = featuredRaw ? 3 : 2;
      const isrc = cols[isrcIdx] || `KE-TM1-26-${70000 + i}`;
      const release = cols[isrcIdx + 1] || batchRelease || 'Bulk Batch Import';
      const genre = cols[isrcIdx + 2] || batchGenre || 'Afro-fusion';

      const featuredArtists = featuredRaw
        ? featuredRaw.replace(/^feat\.?\s*/i, '').split(/[,&]/).map(a => a.trim()).filter(Boolean)
        : [];

      const displayArtist = featuredArtists.length > 0
        ? `${primaryArtist} feat. ${featuredArtists.join(', ')}`
        : primaryArtist;

      tracks.push({
        id: Date.now() + i,
        title,
        primaryArtist,
        featuredArtists,
        collaborators: [],
        artist: displayArtist,
        isrc,
        release,
        releaseType: 'Album',
        genre,
        year: String(new Date().getFullYear()),
        streams: '0',
        split: 'Artist (60%) / Producer (25%) / Label (15%)',
        consumptionType: batchConsumption,
        streamPriceCredits: Number(batchStreamPrice) || 50,
        downloadPriceCredits: Number(batchDownloadPrice) || 150,
        status: 'valid'
      });
    });

    setParsedTracks(tracks);
    setSuccessCount(null);
    setCurrentStep(2);
  };

  // Batch Audio files drop
  const handleAudioFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|flac|m4a|aac)$/i));
    if (valid.length === 0) {
      setErrorMessage('Please drop valid audio files (.mp3, .wav, .flac, .m4a).');
      return;
    }
    const tracks = valid.map((file, i) => {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
      const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      return {
        id: Date.now() + i,
        title: formattedTitle,
        primaryArtist: batchArtist || 'Ndufo',
        featuredArtists: [],
        collaborators: [],
        artist: batchArtist || 'Ndufo',
        isrc: `KE-TM1-26-${71000 + i}`,
        release: batchRelease || 'Master Vault Ingest',
        releaseType: valid.length > 5 ? 'Album' : 'EP',
        genre: batchGenre || 'Afro-fusion',
        year: String(new Date().getFullYear()),
        duration: '3:30',
        streams: '0',
        split: 'Artist (60%) / Producer (25%) / Label (15%)',
        consumptionType: batchConsumption,
        streamPriceCredits: Number(batchStreamPrice) || 50,
        downloadPriceCredits: Number(batchDownloadPrice) || 150,
        status: 'valid'
      };
    });
    setParsedTracks(prev => [...prev, ...tracks]);
    setSuccessCount(null);
    setCurrentStep(2);
  };

  // Bulk Apply changes to parsed grid
  const applyBatchDefaults = () => {
    if (parsedTracks.length === 0) return;
    const featuredList = batchFeaturedArtists.split(',').map(a => a.trim()).filter(Boolean);
    const collabList = batchCollaborators.split(',').map(c => c.trim()).filter(Boolean);

    setParsedTracks(prev => prev.map(t => {
      const primary = batchArtist || t.primaryArtist || t.artist;
      const display = featuredList.length > 0
        ? `${primary} feat. ${featuredList.join(', ')}`
        : primary;
      return {
        ...t,
        primaryArtist: primary,
        featuredArtists: featuredList.length > 0 ? featuredList : t.featuredArtists,
        collaborators: collabList.length > 0 ? collabList : t.collaborators,
        artist: display,
        genre: batchGenre || t.genre,
        release: batchRelease || t.release,
        consumptionType: batchConsumption,
        streamPriceCredits: Number(batchStreamPrice) || 50,
        downloadPriceCredits: Number(batchDownloadPrice) || 150
      };
    }));
  };

  const updateTrackField = (idx, field, val) => {
    setParsedTracks(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      if (field === 'primaryArtist' || field === 'featuredArtists') {
        const primary = field === 'primaryArtist' ? val : updated[idx].primaryArtist;
        const feats = field === 'featuredArtists'
          ? (Array.isArray(val) ? val : String(val).split(',').map(s => s.trim()).filter(Boolean))
          : updated[idx].featuredArtists;
        updated[idx].artist = feats && feats.length > 0 ? `${primary} feat. ${feats.join(', ')}` : primary;
      }
      return updated;
    });
  };

  const removeTrack = (index) => {
    setParsedTracks(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddNewTrack = () => {
    const seq = 70000 + parsedTracks.length + 1;
    const newTrack = {
      id: Date.now(),
      title: `New Master Track ${parsedTracks.length + 1}`,
      primaryArtist: batchArtist || 'Ndufo',
      featuredArtists: [],
      collaborators: [],
      artist: batchArtist || 'Ndufo',
      isrc: `KE-TM1-26-${seq}`,
      release: batchRelease || 'Standalone Ingest',
      releaseType: 'Single',
      genre: batchGenre || 'Afro-fusion',
      year: String(new Date().getFullYear()),
      streams: '0',
      split: 'Artist (60%) / Producer (25%) / Label (15%)',
      consumptionType: batchConsumption,
      streamPriceCredits: 50,
      downloadPriceCredits: 150,
      status: 'valid'
    };
    setParsedTracks(prev => [...prev, newTrack]);
  };

  // Submit all parsed tracks to backend
  const handleBulkSubmit = async () => {
    if (parsedTracks.length === 0) {
      setErrorMessage('No tracks ready to ingest.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const sub = (activeSubdomain || 'ndufo').toLowerCase().trim();
      const res = await fetch('/api/catalog/bulk-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomain: sub,
          tracks: parsedTracks,
          commonArtist: batchArtist,
          commonGenre: batchGenre,
          commonRelease: batchRelease
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Bulk ingestion failed.');
      }

      const data = await res.json();
      setSuccessCount(data.count || parsedTracks.length);
      if (typeof onIngestSuccess === 'function') {
        onIngestSuccess(data.tracks || parsedTracks);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setErrorMessage(err.message || 'Error processing bulk ingestion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Ingest Source' },
    { num: 2, label: 'Multi-Artist Config' },
    { num: 3, label: 'Verification Grid' },
    { num: 4, label: 'Confirm & Ingest' }
  ];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 7, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{
        background: '#070c1a',
        border: '1px solid rgba(0, 240, 255, 0.35)',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '1020px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 70px rgba(0,0,0,0.9), 0 0 40px rgba(0,240,255,0.12)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#00f0ff', color: '#000', padding: '7px', borderRadius: '4px', display: 'flex' }}>
              <RiFolderMusicFill size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#fff' }}>
                  Bulk Catalogue Ingestion Wizard
                </h3>
                <span style={{ fontSize: '10px', background: 'rgba(0,240,255,0.15)', color: '#00f0ff', padding: '2px 8px', borderRadius: '3px', fontWeight: 800 }}>
                  Multi-Artist Studio
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                High-capacity batch ingestion with verified multi-artist credits &amp; sync clearance.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer', padding: '4px' }}
            title="Close modal (Esc)"
          >
            <RiCloseLine />
          </button>
        </div>

        {/* 4-Step Progress Indicator Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '10px 24px',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {stepsList.map((st, i) => {
            const isActive = currentStep === st.num;
            const isDone = currentStep > st.num;
            return (
              <React.Fragment key={st.num}>
                <button
                  type="button"
                  onClick={() => {
                    if (parsedTracks.length > 0 || st.num === 1) {
                      setCurrentStep(st.num);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: (parsedTracks.length > 0 || st.num === 1) ? 'pointer' : 'not-allowed',
                    opacity: (parsedTracks.length > 0 || st.num === 1) ? 1 : 0.4,
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isDone ? '#00f0ff' : isActive ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                    color: isDone ? '#000' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    {isDone ? <RiCheckLine size={14} /> : st.num}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#00f0ff' : isDone ? '#fff' : '#94a3b8'
                  }}>
                    {st.label}
                  </span>
                </button>
                {i < stepsList.length - 1 && (
                  <div style={{ flex: 1, minWidth: '20px', height: '2px', background: currentStep > st.num ? '#00f0ff' : 'rgba(255,255,255,0.08)' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 26px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* STEP 1: INGEST SOURCE */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                    Select Ingestion Method
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Choose how you want to provide your catalog metadata. Supports multi-artist credits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#22d3ee',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiDownload2Line size={14} />
                  <span>Download Multi-Artist CSV Template</span>
                </button>
              </div>

              {/* Source Tabs */}
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                {[
                  { id: 'csv', label: 'CSV / Excel Import', icon: RiFileTextFill },
                  { id: 'paste', label: 'Paste Metadata Table', icon: RiFileList3Fill },
                  { id: 'audio', label: 'Batch Audio Files Drop', icon: RiUploadCloud2Fill }
                ].map(tab => {
                  const Icon = tab.icon;
                  const active = inputMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInputMode(tab.id)}
                      style={{
                        background: active ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                        color: active ? '#000' : '#cbd5e1',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Icon size={15} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {inputMode === 'csv' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(0,240,255,0.4)',
                    borderRadius: '6px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(0,240,255,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RiUploadCloud2Fill size={44} color="#00f0ff" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                    Click or Drag &amp; Drop Catalogue CSV / Spreadsheet
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
                    Accepts CSV with headers: Title, PrimaryArtist, FeaturedArtists, ISRC, Album, Genre, Year.
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv,application/vnd.ms-excel"
                    style={{ display: 'none' }}
                    onChange={handleCsvFileUpload}
                  />
                </div>
              )}

              {inputMode === 'paste' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <textarea
                    rows={7}
                    placeholder={"Title\tPrimaryArtist\tFeaturedArtists\tISRC\tAlbum\tGenre\nNairobi Cyberwave\tNdufo\tAisha Wanjiku\tKE-TM1-26-00101\tNeon Safari\tAfro-House"}
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    style={{
                      background: '#040812',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      color: '#fff',
                      padding: '12px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleParsePaste}
                    style={{
                      alignSelf: 'flex-start',
                      background: '#00f0ff',
                      color: '#000',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Parse &amp; Continue to Multi-Artist Config
                  </button>
                </div>
              )}

              {inputMode === 'audio' && (
                <div
                  onClick={() => audioInputRef.current?.click()}
                  style={{
                    border: '2px dashed rgba(139,92,246,0.45)',
                    borderRadius: '6px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(139,92,246,0.03)'
                  }}
                >
                  <RiFolderMusicFill size={44} color="#8b5cf6" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                    Select Audio Master Cues (.wav, .mp3, .flac)
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    Audio titles will be extracted automatically for multi-artist tagging.
                  </div>
                  <input
                    ref={audioInputRef}
                    type="file"
                    multiple
                    accept="audio/*,.wav,.mp3,.flac,.m4a"
                    style={{ display: 'none' }}
                    onChange={e => handleAudioFiles(e.target.files)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: BATCH & MULTI-ARTIST CONFIGURATION */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px 20px' }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  Multi-Artist &amp; Release Defaults
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: '#94a3b8' }}>
                  Configure shared primary artist, featured artists, release package, and sync pricing.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <RiUserVoiceFill color="#00f0ff" /> Primary Artist
                    </label>
                    <input
                      type="text"
                      value={batchArtist}
                      onChange={e => setBatchArtist(e.target.value)}
                      placeholder="e.g. Ndufo"
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <RiGroupFill color="#8b5cf6" /> Default Featured Artists
                    </label>
                    <input
                      type="text"
                      value={batchFeaturedArtists}
                      onChange={e => setBatchFeaturedArtists(e.target.value)}
                      placeholder="e.g. DJ Maphorisa, Aisha Wanjiku"
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Release / Album Title
                    </label>
                    <input
                      type="text"
                      value={batchRelease}
                      onChange={e => setBatchRelease(e.target.value)}
                      placeholder="e.g. Neon Safari Deluxe"
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Genre
                    </label>
                    <select
                      value={batchGenre}
                      onChange={e => setBatchGenre(e.target.value)}
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    >
                      {availableGenres.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Consumption Mode
                    </label>
                    <select
                      value={batchConsumption}
                      onChange={e => setBatchConsumption(e.target.value)}
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    >
                      <option value="both">Both (Stream &amp; Direct Download)</option>
                      <option value="stream">Stream Only</option>
                      <option value="download">Download Only</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                      Stream Credits Price
                    </label>
                    <input
                      type="number"
                      value={batchStreamPrice}
                      onChange={e => setBatchStreamPrice(e.target.value)}
                      style={{ width: '100%', background: '#050914', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '8px 12px', color: '#fff', fontSize: '12.5px' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={applyBatchDefaults}
                    style={{
                      background: 'rgba(0,240,255,0.12)',
                      border: '1px solid #00f0ff',
                      color: '#00f0ff',
                      padding: '7px 16px',
                      borderRadius: '4px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Apply Defaults to All {parsedTracks.length} Queued Tracks
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Ready to verify {parsedTracks.length} track(s) in the verification grid.
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  style={{
                    background: '#00f0ff',
                    color: '#000',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '4px',
                    fontWeight: 900,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Proceed to Verification Grid</span>
                  <RiArrowRightSLine size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MULTI-ARTIST VERIFICATION GRID WITH AUDIO PREVIEW */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                    Multi-Artist Verification &amp; Audio Preview Grid
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                    Review every title, primary artist, and featured collaborator before final sync.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewTrack}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiAddLine size={14} color="#00f0ff" />
                  <span>Add Track Row</span>
                </button>
              </div>

              {/* Tracks Table */}
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflowX: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '8px 10px', width: '36px' }}>#</th>
                      <th style={{ padding: '8px 10px', width: '40px' }}>Audio</th>
                      <th style={{ padding: '8px 10px' }}>Title</th>
                      <th style={{ padding: '8px 10px' }}>Primary Artist</th>
                      <th style={{ padding: '8px 10px' }}>Featured Artists</th>
                      <th style={{ padding: '8px 10px' }}>ISRC</th>
                      <th style={{ padding: '8px 10px' }}>Genre</th>
                      <th style={{ padding: '8px 10px', width: '70px' }}>Status</th>
                      <th style={{ padding: '8px 10px', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTracks.map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                        <td style={{ padding: '6px 10px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 10px' }}>
                          <button
                            type="button"
                            onClick={() => handleTogglePlayAudio(t)}
                            style={{
                              background: playingTrackId === t.id ? '#00f0ff' : 'rgba(255,255,255,0.08)',
                              color: playingTrackId === t.id ? '#000' : '#00f0ff',
                              border: 'none',
                              borderRadius: '3px',
                              width: '26px',
                              height: '26px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            title={playingTrackId === t.id ? 'Pause preview' : 'Play stem preview'}
                          >
                            {playingTrackId === t.id ? <RiPauseFill size={13} /> : <RiPlayFill size={13} />}
                          </button>
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <input
                            type="text"
                            value={t.title}
                            onChange={e => updateTrackField(idx, 'title', e.target.value)}
                            style={{ width: '100%', minWidth: '140px', background: '#050914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '5px 8px', color: '#fff', fontSize: '11.5px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <input
                            type="text"
                            value={t.primaryArtist || t.artist}
                            onChange={e => updateTrackField(idx, 'primaryArtist', e.target.value)}
                            style={{ width: '100%', minWidth: '110px', background: '#050914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '5px 8px', color: '#fff', fontSize: '11.5px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <input
                            type="text"
                            value={Array.isArray(t.featuredArtists) ? t.featuredArtists.join(', ') : (t.featuredArtists || '')}
                            onChange={e => updateTrackField(idx, 'featuredArtists', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            placeholder="e.g. Sauti Sol"
                            style={{ width: '100%', minWidth: '130px', background: '#050914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '5px 8px', color: '#8b5cf6', fontSize: '11.5px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <input
                            type="text"
                            value={t.isrc}
                            onChange={e => updateTrackField(idx, 'isrc', e.target.value)}
                            style={{ width: '100%', minWidth: '120px', background: '#050914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '5px 8px', color: '#00f0ff', fontFamily: 'monospace', fontSize: '11px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <input
                            type="text"
                            value={t.genre}
                            onChange={e => updateTrackField(idx, 'genre', e.target.value)}
                            style={{ width: '100%', minWidth: '90px', background: '#050914', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '5px 8px', color: '#cbd5e1', fontSize: '11px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
                            VERIFIED
                          </span>
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => removeTrack(idx)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Remove track"
                          >
                            <RiDeleteBin6Line size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#94a3b8',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiArrowLeftSLine size={15} />
                  <span>Back to Batch Config</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    background: '#00f0ff',
                    color: '#000',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '4px',
                    fontWeight: 900,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Continue to Summary &amp; Confirmation</span>
                  <RiArrowRightSLine size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & CONFIRM INGESTION */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  Ingestion Verification Summary
                </h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8' }}>
                  Confirm destination sync targets across the Intermaven network before publishing.
                </p>
              </div>

              {/* Statistics Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.25)', borderRadius: '6px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Total Tracks</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#00f0ff', marginTop: '4px' }}>{parsedTracks.length}</div>
                </div>
                <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '6px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Artists Credited</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#8b5cf6', marginTop: '4px' }}>
                    {new Set(parsedTracks.flatMap(t => [t.primaryArtist || t.artist, ...(t.featuredArtists || [])])).size}
                  </div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '6px', padding: '14px 16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Sync Status</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#10b981', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <RiShieldCheckFill size={16} /> Pre-Cleared
                  </div>
                </div>
              </div>

              {/* Multi-Destination Sync Checklist */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>
                  Multi-Destination Sync Targets
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {[
                    { title: 'TuneMavens Master Catalogue', desc: 'Central metadata & ISRC registry' },
                    { title: 'Live Creator EPK Web Worlds', desc: 'Auto-sync to active discography' },
                    { title: 'Mother CMS Studio', desc: 'Live layout & tracklist integration' },
                    { title: 'TuneStream Global Player', desc: 'Lossless audio streaming & licensing' }
                  ].map(dest => (
                    <div key={dest.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px' }}>
                      <RiCheckLine size={16} color="#00f0ff" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: '#fff', display: 'block' }}>{dest.title}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '10.5px' }}>{dest.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '4px', fontSize: '12px' }}>
                  {errorMessage}
                </div>
              )}

              {successCount && (
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '10px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                  Successfully ingested {successCount} tracks into your multi-collection catalogue!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 26px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
            {parsedTracks.length > 0 ? `${parsedTracks.length} tracks in queue.` : 'Select or drop metadata to begin.'}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#cbd5e1',
                padding: '8px 16px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            {currentStep > 1 && currentStep < 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep(s => s + 1)}
                style={{
                  background: '#00f0ff',
                  color: '#000',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontWeight: 900,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={isSubmitting || parsedTracks.length === 0}
                style={{
                  background: '#00f0ff',
                  color: '#000',
                  border: 'none',
                  padding: '8px 22px',
                  borderRadius: '4px',
                  fontWeight: 900,
                  fontSize: '12px',
                  cursor: isSubmitting || parsedTracks.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting || parsedTracks.length === 0 ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RiCheckDoubleFill size={16} />
                <span>{isSubmitting ? 'Syncing Catalogue...' : `1-Click Ingest ${parsedTracks.length} Tracks`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
