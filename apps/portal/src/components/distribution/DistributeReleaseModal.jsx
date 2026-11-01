import React, { useState, useEffect } from 'react';
import {
  RiCloseLine,
  RiCheckLine,
  RiMusic2Fill,
  RiDiscFill,
  RiUploadCloud2Line,
  RiGlobalLine,
  RiShieldCheckFill,
  RiTimeLine,
  RiSparklingFill,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiFileCopyLine,
  RiEqualizerFill,
} from 'react-icons/ri';
import {
  SiSpotify,
  SiApplemusic,
  SiYoutube,
  SiTiktok,
  SiTidal,
  SiDeezer,
} from 'react-icons/si';
import { FaAmazon } from 'react-icons/fa';
import tunestreamLogo from '../../assets/logos/tunestream-logo.png';
import { distroApi } from '../../lib/api.js';
import { AUTHORITATIVE_CATALOG_TRACKS } from '../../data/authoritativeCatalog.js';

export default function DistributeReleaseModal({
  isOpen,
  onClose,
  onSuccess,
  supportedOutlets = [],
  initialArtist = '',
  persona = 'creator',
}) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(initialArtist || (persona === 'label' ? 'Ndufo' : 'Ndufo'));
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [album, setAlbum] = useState('');
  const [version, setVersion] = useState('Original Mix');
  const [genre, setGenre] = useState('Afro-House');
  const [releaseType, setReleaseType] = useState('Single');
  const [releaseDate, setReleaseDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [dropType, setDropType] = useState('scheduled'); // 'instant' | 'scheduled'
  const [audioUrl, setAudioUrl] = useState('/uploads/tracks/midnight_drifter.mp3');
  const [artworkUrl, setArtworkUrl] = useState('/heroes/ndufo_hero_slide1_retina.jpg');
  const [isrc, setIsrc] = useState('');
  const [upc, setUpc] = useState('');
  const [explicit, setExplicit] = useState('CLEAN');
  const [territories, setTerritories] = useState('Worldwide');
  const [splitBreakdown, setSplitBreakdown] = useState('Artist (60%) / Producer (25%) / Label (15%)');
  const [enableContentId, setEnableContentId] = useState(true);
  const [enableTikTokSound, setEnableTikTokSound] = useState(true);
  const [dolbyAtmos, setDolbyAtmos] = useState(true);

  // Selected Outlets - default all supported
  const [selectedOutlets, setSelectedOutlets] = useState([]);

  useEffect(() => {
    if (supportedOutlets && supportedOutlets.length > 0) {
      setSelectedOutlets(supportedOutlets.map((o) => o.id));
    }
  }, [supportedOutlets]);

  useEffect(() => {
    if (initialArtist) {
      setArtist(initialArtist);
    }
  }, [initialArtist]);

  if (!isOpen) return null;

  // Generate ISRC helper
  const handleGenerateIsrc = async () => {
    try {
      const res = await distroApi.generateIsrc();
      if (res?.isrc) setIsrc(res.isrc);
    } catch {
      setIsrc(`KE-TM1-26-${Math.floor(10000 + Math.random() * 90000)}`);
    }
  };

  // Generate UPC helper
  const handleGenerateUpc = async () => {
    try {
      const res = await distroApi.generateUpc();
      if (res?.upc) setUpc(res.upc);
    } catch {
      setUpc(`19827${Math.floor(1000000 + Math.random() * 9000000)}`);
    }
  };

  // Pick track from existing catalog
  const handleSelectCatalogTrack = (trk) => {
    setTitle(trk.title || '');
    setArtist(trk.artist || 'Ndufo');
    setGenre(trk.genre || 'Afro-House');
    if (trk.audioUrl) setAudioUrl(trk.audioUrl);
    if (trk.cover || trk.coverArt) setArtworkUrl(trk.cover || trk.coverArt);
    if (trk.isrc) setIsrc(trk.isrc);
    if (trk.distributionSplit) setSplitBreakdown(trk.distributionSplit);
  };

  // Toggle outlet selection
  const toggleOutlet = (oid) => {
    setSelectedOutlets((prev) =>
      prev.includes(oid) ? prev.filter((id) => id !== oid) : [...prev, oid]
    );
  };

  const selectAllOutlets = () => {
    setSelectedOutlets(supportedOutlets.map((o) => o.id));
  };

  const deselectAllOutlets = () => {
    setSelectedOutlets([]);
  };

  const applyOutletFilter = (type) => {
    if (type === 'streaming') {
      setSelectedOutlets(['spotify', 'apple_music', 'youtube_music', 'amazon_music', 'tidal', 'deezer']);
    } else if (type === 'social') {
      setSelectedOutlets(['tiktok', 'youtube_music', 'tunestream']);
    } else if (type === 'african') {
      setSelectedOutlets(['boomplay', 'audiomack', 'tunestream', 'spotify', 'apple_music']);
    } else if (type === 'lossless') {
      setSelectedOutlets(['apple_music', 'tidal', 'amazon_music', 'tunestream']);
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    setError('');
    if (!title.trim()) {
      setError('Release title is required.');
      setStep(1);
      return;
    }
    if (!artist.trim()) {
      setError('Primary artist is required.');
      setStep(1);
      return;
    }
    if (selectedOutlets.length === 0) {
      setError('Please select at least one distribution outlet.');
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        artist,
        featured_artists: featuredArtists,
        album: album || title,
        version,
        genre,
        release_type: releaseType,
        release_date: dropType === 'instant' ? new Date().toISOString().split('T')[0] : releaseDate,
        audio_url: audioUrl,
        artwork_url: artworkUrl,
        upc: upc || undefined,
        isrc: isrc || undefined,
        outlets: selectedOutlets,
        explicit,
        territories,
        split_breakdown: splitBreakdown,
        notes: `Dolby Atmos: ${dolbyAtmos ? 'Enabled' : 'Disabled'}, YouTube Content ID: ${enableContentId ? 'Yes' : 'No'}, TikTok Sound: ${enableTikTokSound ? 'Yes' : 'No'}`,
      };

      const result = await distroApi.createRelease(payload);
      setSubmitting(false);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Failed to submit release. Please verify metadata.');
    }
  };

  const renderOutletIcon = (iconKey) => {
    if (String(iconKey).toLowerCase().includes('tunestream')) {
      return <img src={tunestreamLogo} alt="TuneStream" style={{ width: 20, height: 20, objectFit: 'contain', borderRadius: '3px' }} />;
    }
    switch (iconKey) {
      case 'spotify':
        return <SiSpotify size={20} color="#1db954" />;
      case 'apple':
        return <SiApplemusic size={20} color="#fc3c44" />;
      case 'youtube':
        return <SiYoutube size={20} color="#ff0000" />;
      case 'amazon':
        return <FaAmazon size={20} color="#ff9900" />;
      case 'tiktok':
        return <SiTiktok size={18} color="#00f2fe" />;
      case 'tidal':
        return <SiTidal size={18} color="#fff" />;
      case 'deezer':
        return <SiDeezer size={20} color="#ff007f" />;
      default:
        return <RiMusic2Fill size={20} color="var(--cyan)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0b0f1e',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          borderRadius: '3px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(0,242,254,0.08) 0%, rgba(139,92,246,0.05) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '3px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
              }}
            >
              <RiUploadCloud2Line size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                Send Your Song to Music Stores
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Fill in your song details, pick your stores, and we'll deliver your music worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {[
            { num: 1, label: '1. Song Details' },
            { num: 2, label: `2. Choose Stores (${selectedOutlets.length})` },
            { num: 3, label: '3. Release Date & Codes' },
            { num: 4, label: '4. Earnings & Submit' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: step === s.num ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: step === s.num ? '2px solid var(--cyan)' : '2px solid transparent',
                color: step === s.num ? 'var(--cyan)' : '#94a3b8',
                fontSize: '13px',
                fontWeight: step === s.num ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: step === s.num ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                  color: step === s.num ? '#000' : '#fff',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                }}
              >
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '3px',
                color: '#fca5a5',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          {/* STEP 1: Track Details & Audio */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Quick Pick from Authoritative Catalog */}
              <div
                style={{
                  padding: '14px 18px',
                  backgroundColor: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid rgba(0, 242, 254, 0.15)',
                  borderRadius: '3px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Pick from Verified Catalog
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Auto-fills audio, art & ISRC</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {(AUTHORITATIVE_CATALOG_TRACKS || []).slice(0, 5).map((trk) => (
                    <button
                      key={trk.id || trk.isrc}
                      type="button"
                      onClick={() => handleSelectCatalogTrack(trk)}
                      style={{
                        padding: '6px 12px',
                        background: title === trk.title ? 'rgba(0,242,254,0.2)' : 'rgba(255,255,255,0.06)',
                        border: title === trk.title ? '1px solid var(--cyan)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '3px',
                        color: title === trk.title ? '#fff' : '#cbd5e1',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <strong>{trk.title}</strong>
                      <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8' }}>{trk.artist}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Release / Track Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Midnight Drifter"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Primary Artist *
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g. Ndufo"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Featured Artists
                  </label>
                  <input
                    type="text"
                    value={featuredArtists}
                    onChange={(e) => setFeaturedArtists(e.target.value)}
                    placeholder="e.g. Sarah Jensen, Khalid"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Version / Mix
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="e.g. Extended Club Mix"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Afro-House">Afro-House</option>
                    <option value="Amapiano">Amapiano</option>
                    <option value="Afro-Pop">Afro-Pop</option>
                    <option value="Afrobeats">Afrobeats</option>
                    <option value="Deep-House">Deep-House</option>
                    <option value="Tech-House">Tech-House</option>
                    <option value="Synthwave">Synthwave</option>
                    <option value="Electronic">Electronic</option>
                  </select>
                </div>
              </div>

              {/* Audio URL & Artwork preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Master Audio File Path / URL *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="/uploads/tracks/master_track.wav"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Supports 24-bit/48kHz WAV, 96kHz FLAC, ALAC, or 320k MP3
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Cover Artwork URL (3000x3000px recommended)
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {artworkUrl && (
                      <img
                        src={artworkUrl}
                        alt="Cover"
                        style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/headers/discography_retina_header.jpg';
                        }}
                      />
                    )}
                    <input
                      type="text"
                      value={artworkUrl}
                      onChange={(e) => setArtworkUrl(e.target.value)}
                      placeholder="/heroes/ndufo_hero_slide1_retina.jpg"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Outlet Selection */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff', fontWeight: 700 }}>
                    Target Outlets ({selectedOutlets.length} of {supportedOutlets.length} selected)
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Select any or all outlets. TuneMavens packages release via direct DDEX 3.8 XML feeds.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={selectAllOutlets}
                    style={{
                      padding: '5px 12px',
                      background: 'rgba(0,242,254,0.15)',
                      border: '1px solid var(--cyan)',
                      borderRadius: '3px',
                      color: 'var(--cyan)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Select All (11)
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllOutlets}
                    style={{
                      padding: '5px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Preset buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>Presets:</span>
                {[
                  { id: 'streaming', label: 'Core Streaming' },
                  { id: 'social', label: 'Social & Viral UGC' },
                  { id: 'african', label: 'African Dominant' },
                  { id: 'lossless', label: 'Lossless Audiophile' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyOutletFilter(p.id)}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '3px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Outlet Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '12px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {supportedOutlets.map((o) => {
                  const isChecked = selectedOutlets.includes(o.id);
                  return (
                    <div
                      key={o.id}
                      onClick={() => toggleOutlet(o.id)}
                      style={{
                        padding: '14px',
                        backgroundColor: isChecked ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        border: isChecked ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {renderOutletIcon(o.iconKey)}
                            <strong style={{ fontSize: '13px', color: '#fff' }}>{o.name}</strong>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            style={{ accentColor: 'var(--cyan)', cursor: 'pointer' }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            background: 'rgba(255,255,255,0.06)',
                            color: o.color || '#fff',
                            fontWeight: 700,
                            display: 'inline-block',
                            marginBottom: '6px',
                          }}
                        >
                          {o.tag}
                        </span>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#94a3b8', lineHeight: '1.4' }}>
                          {o.description}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '10.5px',
                          color: '#64748b',
                        }}
                      >
                        <span>SLA: {o.deliverySla}</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>~${o.payoutEst}/stream</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Rights, Metadata & Formats */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    ISRC Code (International Standard Recording Code)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={isrc}
                      onChange={(e) => setIsrc(e.target.value)}
                      placeholder="KE-TM1-26-XXXXX"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateIsrc}
                      style={{
                        padding: '0 14px',
                        background: 'rgba(0,242,254,0.15)',
                        border: '1px solid var(--cyan)',
                        borderRadius: '3px',
                        color: 'var(--cyan)',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Generate ISRC
                    </button>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    TuneMavens Official Kenya Registrant: KE-TM1-26
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    UPC / EAN Barcode
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={upc}
                      onChange={(e) => setUpc(e.target.value)}
                      placeholder="198273641029"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateUpc}
                      style={{
                        padding: '0 14px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#cbd5e1',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Generate UPC
                    </button>
                  </div>
                </div>
              </div>

              {/* Release Timing */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                }}
              >
                <label style={{ display: 'block', fontSize: '13px', color: '#fff', marginBottom: '10px', fontWeight: 700 }}>
                  Release Timing & Drops
                </label>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="dropType"
                      checked={dropType === 'scheduled'}
                      onChange={() => setDropType('scheduled')}
                      style={{ accentColor: 'var(--cyan)' }}
                    />
                    Scheduled Drop (with Pre-Save & Pitching Window)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}>
                    <input
                      type="radio"
                      name="dropType"
                      checked={dropType === 'instant'}
                      onChange={() => setDropType('instant')}
                      style={{ accentColor: 'var(--cyan)' }}
                    />
                    Instant Drop (Distribute immediately)
                  </label>
                </div>

                {dropType === 'scheduled' && (
                  <div style={{ maxWidth: '240px' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                      Target Release Date (UTC 00:00)
                    </label>
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        background: '#131b2e',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '3px',
                        color: '#fff',
                        fontSize: '13px',
                        width: '100%',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Territory & Explicit Flag */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Territory Scope
                  </label>
                  <select
                    value={territories}
                    onChange={(e) => setTerritories(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  >
                    <option value="Worldwide">Worldwide (195 Countries)</option>
                    <option value="Africa Only">Africa Only (Sub-Saharan)</option>
                    <option value="North America & Europe">North America & Europe</option>
                    <option value="Worldwide Excluding Certain Regions">Worldwide Excluding Certain Regions</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                    Explicit Content Advisory
                  </label>
                  <select
                    value={explicit}
                    onChange={(e) => setExplicit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: '#131b2e',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '3px',
                      color: '#fff',
                      fontSize: '14px',
                    }}
                  >
                    <option value="CLEAN">CLEAN (No profanity)</option>
                    <option value="EXPLICIT">EXPLICIT (Contains parental advisory)</option>
                  </select>
                </div>
              </div>

              {/* Advanced Flags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#cbd5e1',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enableContentId}
                    onChange={(e) => setEnableContentId(e.target.checked)}
                    style={{ accentColor: 'var(--cyan)' }}
                  />
                  <span>
                    <strong style={{ display: 'block', color: '#fff' }}>YouTube Content ID</strong>
                    Monetize re-uploads & Shorts
                  </span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#cbd5e1',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={enableTikTokSound}
                    onChange={(e) => setEnableTikTokSound(e.target.checked)}
                    style={{ accentColor: 'var(--cyan)' }}
                  />
                  <span>
                    <strong style={{ display: 'block', color: '#fff' }}>TikTok Sound Hook</strong>
                    Inject 60s viral sound hook
                  </span>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#cbd5e1',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={dolbyAtmos}
                    onChange={(e) => setDolbyAtmos(e.target.checked)}
                    style={{ accentColor: 'var(--cyan)' }}
                  />
                  <span>
                    <strong style={{ display: 'block', color: '#fff' }}>Dolby Atmos Spatial</strong>
                    Apple Music Spatial Lossless
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Splits & DDEX Manifest Review */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Royalty Split Cascade Instructions
                </label>
                <input
                  type="text"
                  value={splitBreakdown}
                  onChange={(e) => setSplitBreakdown(e.target.value)}
                  placeholder="Artist (60%) / Producer (25%) / Label (15%)"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Smart contract automated split payouts will follow this distribution waterfall.
                </span>
              </div>

              {/* Release Summary Box */}
              <div
                style={{
                  padding: '18px',
                  backgroundColor: 'rgba(0, 242, 254, 0.04)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '3px',
                }}
              >
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#fff', fontWeight: 700 }}>
                  Package Verification & DDEX 3.8 XML Manifest
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Release</span>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>{title || 'Untitled'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Primary Artist</span>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>{artist || 'Unknown'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>ISRC</span>
                    <strong style={{ fontSize: '13px', color: 'var(--cyan)', fontFamily: 'monospace' }}>
                      {isrc || 'Auto-generated on drop'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Target Stores</span>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>{selectedOutlets.length} Outlets</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Drop Timing</span>
                    <strong style={{ fontSize: '13px', color: '#fff' }}>
                      {dropType === 'instant' ? 'Instant Drop' : releaseDate}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>SmartLink</span>
                    <strong style={{ fontSize: '12px', color: '#cbd5e1' }}>tunemavens.com/link/...</strong>
                  </div>
                </div>

                {/* Code Preview Box */}
                <div
                  style={{
                    backgroundColor: '#050811',
                    padding: '12px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#94a3b8',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div>&lt;NewReleaseMessage ReleaseProfileVersionId="CommonReleaseTypes/14/AudioAlbumMusicOnly"&gt;</div>
                  <div style={{ paddingLeft: '12px' }}>&lt;ReleaseId&gt;&lt;ISRC&gt;{isrc || 'KE-TM1-26-XXXXX'}&lt;/ISRC&gt;&lt;/ReleaseId&gt;</div>
                  <div style={{ paddingLeft: '12px' }}>&lt;ReferenceTitle&gt;&lt;TitleText&gt;{title}&lt;/TitleText&gt;&lt;/ReferenceTitle&gt;</div>
                  <div style={{ paddingLeft: '12px' }}>&lt;DisplayArtistName&gt;{artist}&lt;/DisplayArtistName&gt;</div>
                  <div style={{ paddingLeft: '12px' }}>&lt;TargetDSPs&gt;{selectedOutlets.join(', ')}&lt;/TargetDSPs&gt;</div>
                  <div>&lt;/NewReleaseMessage&gt;</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RiArrowLeftLine /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
                border: 'none',
                borderRadius: '3px',
                color: '#000',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Continue <RiArrowRightLine />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '10px 26px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #10b981 100%)',
                border: 'none',
                borderRadius: '3px',
                color: '#000',
                fontSize: '13px',
                fontWeight: 800,
                cursor: submitting ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,242,254,0.3)',
              }}
            >
              {submitting ? (
                <>Transcoding & Delivering...</>
              ) : (
                <>
                  <RiUploadCloud2Line size={16} /> Submit to {selectedOutlets.length} Outlets
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
