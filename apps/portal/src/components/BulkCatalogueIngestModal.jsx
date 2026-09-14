import React, { useState, useRef } from 'react';
import {
  RiCloseLine, RiUploadCloud2Fill, RiFileTextFill, RiFolderMusicFill,
  RiCheckDoubleFill, RiDeleteBin6Line, RiSparklingFill, RiDownload2Line,
  RiInformationLine, RiFileList3Fill, RiPriceTag3Fill
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

  const [inputMode, setInputMode] = useState('csv'); // 'csv' | 'paste' | 'audio'
  const [parsedTracks, setParsedTracks] = useState([]);
  const [batchArtist, setBatchArtist] = useState(rosterArtists[0]?.name || 'Ndufo');
  const [batchGenre, setBatchGenre] = useState('Afro-fusion');
  const [batchRelease, setBatchRelease] = useState('');
  const [batchConsumption, setBatchConsumption] = useState('both');
  const [batchStreamPrice, setBatchStreamPrice] = useState(50);
  const [batchDownloadPrice, setBatchDownloadPrice] = useState(150);

  const [pasteText, setPasteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successCount, setSuccessCount] = useState(null);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const availableGenres = getCachedGenres();

  // CSV Template generation
  const handleDownloadTemplate = () => {
    const csvContent = 'Title,Artist,ISRC,Album,ReleaseType,Genre,Year,Streams,Split\n' +
      'Nairobi Cyberwave,Ndufo,KE-TM1-26-00101,Neon Safari,Album,Afro-House,2026,1.4M,Artist (60%) / Producer (25%) / Label (15%)\n' +
      'Rift Valley Sunset,Ndufo,KE-TM1-26-00102,Neon Safari,Album,Amapiano,2026,850K,Artist (60%) / Producer (25%) / Label (15%)\n' +
      'Mombasa Midnight,Aisha Wanjiku,,Coast Waves,EP,Afro-fusion,2026,420K,Artist (50%) / Producer (50%)\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'TuneMavens_Bulk_Catalogue_Template.csv');
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
      const text = event.target.result;
      parseCsvData(text);
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
        const artist = row.artist || batchArtist || 'Ndufo';
        const isrc = row.isrc || `KE-TM1-26-${70000 + i}`;
        const release = row.album || row.release || batchRelease || 'Bulk Ingest Release';
        const genre = row.genre || batchGenre || 'Afro-fusion';
        const year = row.year || String(new Date().getFullYear());
        const streams = row.streams || '0';
        const split = row.split || 'Artist (60%) / Producer (25%) / Label (15%)';

        tracks.push({
          id: Date.now() + i,
          title,
          artist,
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
      // Split by tab, comma, or pipe
      const delimiter = line.includes('\t') ? '\t' : line.includes('|') ? '|' : ',';
      const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length === 0 || !cols[0]) return;

      const title = cols[0];
      const artist = cols[1] || batchArtist || 'Ndufo';
      const isrc = cols[2] || `KE-TM1-26-${70000 + i}`;
      const release = cols[3] || batchRelease || 'Bulk Batch Import';
      const genre = cols[4] || batchGenre || 'Afro-fusion';

      tracks.push({
        id: Date.now() + i,
        title,
        artist,
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
  };

  // Bulk Apply changes to parsed grid
  const applyBatchDefaults = () => {
    if (parsedTracks.length === 0) return;
    setParsedTracks(prev => prev.map(t => ({
      ...t,
      artist: batchArtist || t.artist,
      genre: batchGenre || t.genre,
      release: batchRelease || t.release,
      consumptionType: batchConsumption,
      streamPriceCredits: Number(batchStreamPrice) || 50,
      downloadPriceCredits: Number(batchDownloadPrice) || 150
    })));
  };

  const removeTrack = (index) => {
    setParsedTracks(prev => prev.filter((_, idx) => idx !== index));
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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 18, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#070c1a',
        border: '1px solid rgba(0, 240, 255, 0.35)',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 70px rgba(0,0,0,0.9), 0 0 40px rgba(0,240,255,0.12)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#00f0ff', color: '#000', padding: '6px', borderRadius: '3px', display: 'flex' }}>
              <RiFolderMusicFill size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#fff' }}>
                Bulk Catalogue Ingestion Studio
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                High-capacity batch ingestion for labels, publishers, managers &amp; large legacy catalogues.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Method Selection Tabs */}
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
                    padding: '8px 14px',
                    borderRadius: '3px',
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

            <button
              type="button"
              onClick={handleDownloadTemplate}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#22d3ee',
                padding: '6px 12px',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Download clean CSV catalogue template"
            >
              <RiDownload2Line size={14} />
              <span>Download CSV Template</span>
            </button>
          </div>

          {/* Input Method Panel */}
          {inputMode === 'csv' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed rgba(0,240,255,0.4)',
                borderRadius: '4px',
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(0,240,255,0.03)'
              }}
            >
              <RiUploadCloud2Fill size={36} color="#00f0ff" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                Upload Catalogue CSV or Spreadsheet
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Click to browse or drop your CSV file here. Compliant headers: Title, Artist, ISRC, Album, Genre, Year, Streams.
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>
                Paste Tab-Separated or Comma-Separated Track Rows:
              </label>
              <textarea
                rows={4}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
                placeholder={`Nairobi Cyberwave\tNdufo\tKE-TM1-26-00042\tNeon Safari\tAfro-House\nSunset Over Rift Valley\tNdufo\tKE-TM1-26-00043\tSingles 2026\tAmapiano`}
                className="form-control"
                style={{
                  background: '#04060d',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  padding: '10px 12px',
                  borderRadius: '3px'
                }}
              />
              <button
                type="button"
                onClick={handleParsePaste}
                style={{
                  alignSelf: 'flex-start',
                  background: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '3px',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Parse &amp; Populate Tracks ({pasteText.split('\n').filter(Boolean).length} rows)
              </button>
            </div>
          )}

          {inputMode === 'audio' && (
            <div
              onClick={() => audioInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files) handleAudioFiles(e.dataTransfer.files);
              }}
              style={{
                border: '2px dashed rgba(139,92,246,0.5)',
                borderRadius: '4px',
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(139,92,246,0.03)'
              }}
            >
              <RiFolderMusicFill size={36} color="#c084fc" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                Drop Multiple Master Audio Files (.mp3, .wav, .flac)
              </div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Audio file names will be automatically normalized into clean track titles with sequential ISRC assignments.
              </div>
              <input
                ref={audioInputRef}
                type="file"
                multiple
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files) handleAudioFiles(e.target.files);
                }}
              />
            </div>
          )}

          {/* Batch Default Assignment Bar */}
          <div style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            padding: '14px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            alignItems: 'flex-end'
          }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Batch Artist
              </label>
              <input
                type="text"
                list="bulk-artist-options"
                value={batchArtist}
                onChange={e => setBatchArtist(e.target.value)}
                placeholder="Roster Artist"
                className="form-control"
                style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', padding: '7px 10px', borderRadius: '3px' }}
              />
              <datalist id="bulk-artist-options">
                {rosterArtists.map(a => <option key={a.id || a.subdomain} value={a.name} />)}
              </datalist>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Batch Genre
              </label>
              <select
                value={batchGenre}
                onChange={e => setBatchGenre(e.target.value)}
                style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', padding: '7px 10px', borderRadius: '3px' }}
              >
                {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Release / Album Name
              </label>
              <input
                type="text"
                value={batchRelease}
                onChange={e => setBatchRelease(e.target.value)}
                placeholder="e.g. Master Vault 2026"
                className="form-control"
                style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '12px', padding: '7px 10px', borderRadius: '3px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                Consumption Mode
              </label>
              <select
                value={batchConsumption}
                onChange={e => setBatchConsumption(e.target.value)}
                style={{ width: '100%', background: '#0d1326', border: '1px solid rgba(255,255,255,0.12)', color: '#00f0ff', fontSize: '12px', padding: '7px 10px', borderRadius: '3px', fontWeight: 700 }}
              >
                <option value="both">Both (Stream &amp; Download)</option>
                <option value="stream_only">Stream Only</option>
                <option value="download_only">Download Only</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={applyBatchDefaults}
                disabled={parsedTracks.length === 0}
                style={{
                  width: '100%',
                  background: 'rgba(0,240,255,0.15)',
                  border: '1px solid #00f0ff',
                  color: '#00f0ff',
                  padding: '7px 10px',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: parsedTracks.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: parsedTracks.length > 0 ? 1 : 0.5
                }}
              >
                Apply to All ({parsedTracks.length})
              </button>
            </div>
          </div>

          {/* Pricing Controls with Recommended Baseline */}
          <div style={{
            background: 'rgba(0,240,255,0.03)',
            border: '1px solid rgba(0,240,255,0.15)',
            borderRadius: '4px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RiPriceTag3Fill color="#00f0ff" />
              <span>Creator Pricing Rates:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Stream Price:</span>
              <input
                type="number"
                value={batchStreamPrice}
                onChange={e => setBatchStreamPrice(Number(e.target.value))}
                style={{ width: '70px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontSize: '11.5px' }}
              />
              <span style={{ fontSize: '10.5px', color: '#00f0ff' }}>Credits (Baseline: 50)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Download Price:</span>
              <input
                type="number"
                value={batchDownloadPrice}
                onChange={e => setBatchDownloadPrice(Number(e.target.value))}
                style={{ width: '70px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 8px', borderRadius: '3px', fontSize: '11.5px' }}
              />
              <span style={{ fontSize: '10.5px', color: '#00f0ff' }}>Credits (Baseline: 150)</span>
            </div>
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '3px', fontSize: '12px', fontWeight: 700 }}>
              {errorMessage}
            </div>
          )}

          {successCount !== null && (
            <div style={{ padding: '8px 14px', background: 'rgba(34,197,94,0.2)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '3px', fontSize: '12px', fontWeight: 800 }}>
              ✓ Ingestion Complete! Successfully stored {successCount} tracks into your catalogue.
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedTracks.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#fff' }}>
                  Parsed Ingestion Queue ({parsedTracks.length} tracks ready)
                </div>
                <button
                  type="button"
                  onClick={() => setParsedTracks([])}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Clear Queue
                </button>
              </div>

              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', maxHeight: '220px', overflowY: 'auto', background: '#050811' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '8px 10px' }}>#</th>
                      <th style={{ padding: '8px 10px' }}>Track Title</th>
                      <th style={{ padding: '8px 10px' }}>Artist</th>
                      <th style={{ padding: '8px 10px' }}>ISRC Code</th>
                      <th style={{ padding: '8px 10px' }}>Album / Release</th>
                      <th style={{ padding: '8px 10px' }}>Genre</th>
                      <th style={{ padding: '8px 10px' }}>Consumption</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTracks.map((t, idx) => (
                      <tr key={t.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                        <td style={{ padding: '7px 10px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '7px 10px', fontWeight: 700, color: '#fff' }}>{t.title}</td>
                        <td style={{ padding: '7px 10px' }}>{t.artist}</td>
                        <td style={{ padding: '7px 10px', fontFamily: 'monospace', color: '#00f0ff' }}>{t.isrc}</td>
                        <td style={{ padding: '7px 10px' }}>{t.release}</td>
                        <td style={{ padding: '7px 10px' }}>{t.genre}</td>
                        <td style={{ padding: '7px 10px', textTransform: 'capitalize' }}>{t.consumptionType?.replace('_', ' ')}</td>
                        <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => removeTrack(idx)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Remove track"
                          >
                            <RiDeleteBin6Line size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
            {parsedTracks.length > 0 ? `${parsedTracks.length} tracks queued for multi-collection sync.` : 'Select or paste metadata to begin.'}
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
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={isSubmitting || parsedTracks.length === 0}
              style={{
                background: '#00f0ff',
                color: '#000',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '3px',
                fontWeight: 900,
                fontSize: '12px',
                cursor: isSubmitting || parsedTracks.length === 0 ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || parsedTracks.length === 0 ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiCheckDoubleFill size={15} />
              <span>{isSubmitting ? 'Ingesting Catalogue...' : `Ingest ${parsedTracks.length} Tracks`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
