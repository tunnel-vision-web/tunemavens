import React, { useState, useEffect, useRef } from 'react';
import {
  RiCloseLine, RiFolderUploadFill, RiUploadCloud2Line, RiSparklingFill,
  RiCheckLine, RiSearchLine, RiExternalLinkLine, RiImageFill, RiMusic2Fill
} from 'react-icons/ri';

export default function MediaAssetPickerModal({
  isOpen,
  onClose,
  onSelect,
  subdomain = 'ndufo',
  mediaType = 'image',
  title = 'Select Media Asset',
  onNavigateToCmsAssets = null
}) {
  const [tab, setTab] = useState('library'); // 'library' | 'upload' | 'ai'
  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Upload tab state
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // AI tab state
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAssets();
      setAiResult(null);
      setTab('library');
    }
  }, [isOpen, subdomain]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/storage/assets?subdomain=${encodeURIComponent(subdomain)}`);
      if (res.ok) {
        const data = await res.json();
        setAssets(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleUploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subdomain', subdomain);
    formData.append('title', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

    try {
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof onSelect === 'function') {
          onSelect(data.url, data.asset);
        }
        onClose();
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/social-ai/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          aspect_ratio: mediaType === 'image' ? '1:1' : '16:9'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.asset);
      }
    } catch (err) {
      alert(`AI generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const filtered = assets.filter(a => {
    if (mediaType && mediaType !== 'all' && a.media_type !== mediaType) return false;
    const q = search.toLowerCase();
    return (a.title || '').toLowerCase().includes(q) || (a.filename || '').toLowerCase().includes(q);
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 999999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0c101d',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '740px',
        maxHeight: '85vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', padding: '6px', borderRadius: '3px' }}>
              <RiFolderUploadFill size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                {title}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Pick from Media Library, upload from your computer, or generate with AI.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', padding: '4px' }}
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)'
        }}>
          {[
            { id: 'library', label: `Media Library (${filtered.length})`, icon: RiFolderUploadFill },
            { id: 'upload', label: 'Upload from Computer', icon: RiUploadCloud2Line },
            { id: 'ai', label: 'Generate with AI', icon: RiSparklingFill }
          ].map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '3px',
                  border: active ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  background: active ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: active ? '#22d3ee' : '#94a3b8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}

          {typeof onNavigateToCmsAssets === 'function' && (
            <button
              type="button"
              onClick={() => { onClose(); onNavigateToCmsAssets(); }}
              style={{
                marginLeft: 'auto',
                padding: '6px 12px',
                borderRadius: '3px',
                border: 'none',
                background: 'rgba(255,255,255,0.06)',
                color: '#cbd5e1',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Open Full CMS Assets <RiExternalLinkLine size={12} />
            </button>
          )}
        </div>

        {/* Tab 1: Library */}
        {tab === 'library' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ position: 'relative' }}>
                <RiSearchLine size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search assets by name or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 32px',
                    background: '#04060d',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  autoFocus
                />
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              overflowY: 'auto',
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px'
            }}>
              {filtered.map(asset => (
                <div
                  key={asset.id}
                  onClick={() => {
                    if (typeof onSelect === 'function') {
                      onSelect(asset.media_url, asset);
                    }
                    onClose();
                  }}
                  style={{
                    background: '#04060d',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.15s ease'
                  }}
                >
                  <div style={{ height: '110px', background: '#111827', position: 'relative', overflow: 'hidden' }}>
                    {asset.media_type === 'audio' ? (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                        <RiMusic2Fill size={32} />
                      </div>
                    ) : (
                      <img
                        src={asset.media_url}
                        alt={asset.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                    {asset.in_use_on_epk && (
                      <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: '#22d3ee',
                        color: '#0f172a',
                        fontSize: '8.5px',
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: '2px'
                      }}>
                        EPK
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {asset.title || asset.filename}
                    </div>
                    <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: '2px' }}>
                      {asset.media_type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload */}
        {tab === 'upload' && (
          <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'audio' ? 'audio/*' : mediaType === 'video' ? 'video/*' : 'image/*,audio/*,video/*'}
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUploadFile(e.target.files[0]);
                }
              }}
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleUploadFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={{
                width: '100%',
                maxWidth: '480px',
                border: dragOver ? '2px dashed #22d3ee' : '1px dashed rgba(255,255,255,0.2)',
                borderRadius: '6px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.02)'
              }}
            >
              <RiUploadCloud2Line size={36} color={dragOver ? '#22d3ee' : '#94a3b8'} style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                {uploading ? 'Uploading to Media Library...' : 'Choose file or drag & drop here'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Automatically saved to Mother CMS Assets repository
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: AI Generate */}
        {tab === 'ai' && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>
              Describe what you want to create (96 DPI Retina):
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Afro-futuristic album cover, deep neon colors, synthwave glow, sharp focus..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: '#04060d',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={generating || !aiPrompt.trim()}
              style={{
                padding: '9px 16px',
                background: 'linear-gradient(135deg, #a855f7, #22d3ee)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: generating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RiSparklingFill size={15} />
              {generating ? 'Generating 96 DPI Retina Asset...' : 'Generate with AI'}
            </button>

            {aiResult && (
              <div style={{
                background: '#04060d',
                border: '1px solid rgba(34,211,238,0.3)',
                borderRadius: '4px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <img
                  src={aiResult.media_url}
                  alt="AI Result"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '3px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    Generated &amp; Saved to Media Library
                  </div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '2px' }}>
                    ✓ 96 DPI Retina Master
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof onSelect === 'function') {
                      onSelect(aiResult.media_url, aiResult);
                    }
                    onClose();
                  }}
                  style={{
                    padding: '6px 14px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  Use This
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
