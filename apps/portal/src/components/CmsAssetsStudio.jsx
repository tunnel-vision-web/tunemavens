import React, { useState, useEffect, useRef } from 'react';
import {
  RiFolderUploadFill, RiImageFill, RiMusic2Fill, RiMovieFill,
  RiSparklingFill, RiDeleteBin6Line, RiUploadCloud2Line, RiSearchLine,
  RiCheckLine, RiFileCopyLine, RiRefreshLine, RiArrowUpDownLine,
  RiEyeLine, RiPlayFill, RiExternalLinkLine, RiShieldCheckFill, RiInformationLine,
  RiHardDrive2Fill, RiCoinsLine, RiAddCircleLine, RiCloseLine
} from 'react-icons/ri';

export default function CmsAssetsStudio({
  subdomain = 'ndufo',
  sessionUser,
  onSelectAsset = null,
  pickerMode = false
}) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'in-use' | 'image' | 'audio' | 'video' | 'ai'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name' | 'size'
  const [copiedId, setCopiedId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [replacingAssetId, setReplacingAssetId] = useState(null);

  // Storage Quota & Top-Up States
  const [quota, setQuota] = useState(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpMsg, setTopUpMsg] = useState(null);

  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);

  useEffect(() => {
    loadAssets();
    loadQuota();
  }, [subdomain]);

  const loadQuota = async () => {
    try {
      const token = localStorage.getItem('tunemavens_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/storage/quota?subdomain=${encodeURIComponent(subdomain)}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch (err) {
      console.warn('Failed to load storage quota:', err);
    }
  };

  const loadAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/storage/assets?subdomain=${encodeURIComponent(subdomain)}`);
      if (res.ok) {
        const data = await res.json();
        setAssets(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn('Failed to load storage assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpStorage = async (packageId) => {
    setTopUpLoading(true);
    setTopUpMsg(null);
    try {
      const token = localStorage.getItem('tunemavens_token');
      const res = await fetch('/api/storage/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ package_id: packageId, subdomain })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTopUpMsg({ type: 'success', text: `Success! Added ${data.added_mb} MB storage. New quota: ${data.new_quota_mb} MB.` });
        await loadQuota();
        setTimeout(() => {
          setShowTopUpModal(false);
          setTopUpMsg(null);
        }, 2000);
      } else {
        setTopUpMsg({ type: 'error', text: data.detail || data.message || 'Failed to top up storage. Check your credits balance.' });
      }
    } catch (err) {
      setTopUpMsg({ type: 'error', text: err.message || 'Network error topping up storage.' });
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleFileUpload = async (file, replaceId = null) => {
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
        if (replaceId) {
          // Update the original asset with new URL
          await fetch(`/api/storage/assets/${replaceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              media_url: data.url,
              filename: file.name
            })
          });
          setReplacingAssetId(null);
        }
        await loadAssets();
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset from the media library?')) return;
    try {
      const res = await fetch(`/api/storage/assets/${assetId}`, { method: 'DELETE' });
      if (res.ok) {
        setAssets(prev => prev.filter(a => a.id !== assetId));
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleCopyUrl = (asset) => {
    if (!asset?.media_url) return;
    const fullUrl = asset.media_url.startsWith('http') ? asset.media_url : `${window.location.origin}${asset.media_url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Filter and Sort Logic
  const filtered = assets.filter(asset => {
    const term = search.toLowerCase();
    const matchesSearch =
      (asset.title || '').toLowerCase().includes(term) ||
      (asset.filename || '').toLowerCase().includes(term) ||
      (asset.prompt || '').toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (typeFilter === 'in-use') return asset.in_use_on_epk;
    if (typeFilter === 'ai') return asset.is_ai || (asset.prompt && asset.prompt.toLowerCase().includes('ai'));
    if (typeFilter === 'image') return asset.media_type === 'image';
    if (typeFilter === 'audio') return asset.media_type === 'audio';
    if (typeFilter === 'video') return asset.media_type === 'video';
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
    if (sortBy === 'oldest') {
      return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    }
    if (sortBy === 'name') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'size') {
      return (b.size_bytes || 0) - (a.size_bytes || 0);
    }
    return 0;
  });

  const formatBytes = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalInUse = assets.filter(a => a.in_use_on_epk).length;
  const totalAi = assets.filter(a => a.is_ai || (a.prompt && a.prompt.toLowerCase().includes('ai'))).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,audio/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
          }
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*,audio/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0 && replacingAssetId) {
            handleFileUpload(e.target.files[0], replacingAssetId);
          }
        }}
      />

      {/* Top Header & Stats Strip */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', padding: '10px', borderRadius: '4px' }}>
            <RiFolderUploadFill size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>
              Mother CMS Assets &amp; Media Library
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Central repository for all high-resolution images, video reels, stems, MP3 masters, and AI-generated assets for <strong style={{ color: '#22d3ee' }}>{subdomain}</strong>.
            </p>
          </div>
        </div>

        {/* Storage Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Storage Quota Bar */}
          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '8px 14px',
            minWidth: '220px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RiHardDrive2Fill size={13} color="#00f0ff" /> Storage Quota
              </span>
              <span style={{ fontWeight: 800, color: (quota?.pct_used || 0) > 90 ? '#ef4444' : '#fff' }}>
                {quota ? `${quota.used_mb} MB / ${quota.quota_mb} MB` : '0 MB / 500 MB'}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, quota?.pct_used || 0)}%`,
                height: '100%',
                background: (quota?.pct_used || 0) > 90 ? '#ef4444' : (quota?.pct_used || 0) > 75 ? '#f59e0b' : '#00f0ff',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px', fontSize: '10px' }}>
              <span style={{ color: '#64748b' }}>
                {quota ? `${quota.pct_used}% used` : 'Starter (500 MB base)'}
              </span>
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                style={{
                  background: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '2px 8px',
                  fontWeight: 800,
                  fontSize: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <RiCoinsLine size={11} /> Top-Up Space
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            style={{
              background: uploading ? '#64748b' : '#00f0ff',
              color: '#000',
              border: 'none',
              borderRadius: '3px',
              padding: '8px 16px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: uploading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiUploadCloud2Line size={16} />
            {uploading ? 'Uploading Asset...' : 'Upload from Computer'}
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: isDragOver ? '2px dashed #22d3ee' : '1px dashed rgba(255,255,255,0.18)',
          borderRadius: '6px',
          padding: '24px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragOver ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.015)',
          transition: 'all 0.2s ease'
        }}
      >
        <RiUploadCloud2Line size={28} color={isDragOver ? '#22d3ee' : '#94a3b8'} style={{ margin: '0 auto 8px auto' }} />
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
          Drag &amp; Drop Images, MP3s, or Video files here
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          Or click to browse from your device • Files automatically terminate and persist in this Media Library
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.5)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '6px',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
          <RiSearchLine size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search assets by filename, prompt, or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 10px 6px 30px',
              background: '#04060d',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Assets (${assets.length})` },
            { id: 'in-use', label: `✨ In Use on EPK (${totalInUse})` },
            { id: 'image', label: `Images (${assets.filter(a => a.media_type === 'image').length})` },
            { id: 'audio', label: `Audio (${assets.filter(a => a.media_type === 'audio').length})` },
            { id: 'video', label: `Video (${assets.filter(a => a.media_type === 'video').length})` },
            { id: 'ai', label: `AI Created (${totalAi})` }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              style={{
                padding: '5px 10px',
                borderRadius: '3px',
                border: 'none',
                background: typeFilter === tab.id ? '#22d3ee' : 'rgba(255,255,255,0.06)',
                color: typeFilter === tab.id ? '#0f172a' : '#cbd5e1',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RiArrowUpDownLine size={13} color="#94a3b8" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '5px 8px',
              background: '#04060d',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '3px',
              color: '#cbd5e1',
              fontSize: '11.5px'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
            <option value="size">Size (Largest)</option>
          </select>
        </div>
      </div>

      {/* Asset Grid */}
      {sorted.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '6px'
        }}>
          <RiImageFill size={36} color="#64748b" style={{ margin: '0 auto 10px auto' }} />
          <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>No media assets match your filter</h4>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>
            Upload files or generate new artwork using the Social AI Studio.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {sorted.map(asset => {
            const isAudio = asset.media_type === 'audio';
            const isVideo = asset.media_type === 'video';

            return (
              <div
                key={asset.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: asset.in_use_on_epk ? '1px solid rgba(34,211,238,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
              >
                {/* Media Preview Stage */}
                <div style={{
                  height: '140px',
                  background: '#04060d',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isAudio ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#22d3ee' }}>
                      <RiMusic2Fill size={36} />
                      <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700 }}>Audio File (MP3 / WAV)</span>
                    </div>
                  ) : isVideo ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <img
                        src={asset.thumbnail || 'https://picsum.photos/seed/vid_asset/400/225'}
                        alt={asset.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RiPlayFill size={28} color="#fff" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={asset.media_url}
                      alt={asset.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://picsum.photos/seed/asset_placeholder/400/300'; }}
                    />
                  )}

                  {/* EPK In-Use Badge */}
                  {asset.in_use_on_epk && (
                    <div
                      title={`Currently active in EPK: ${(asset.used_in || []).join(', ')}`}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        background: 'rgba(34, 211, 238, 0.92)',
                        color: '#0f172a',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                      }}
                    >
                      <RiCheckLine size={11} /> In Use on EPK
                    </div>
                  )}

                  {/* AI Badge */}
                  {asset.is_ai && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: 'rgba(168, 85, 247, 0.88)',
                      color: '#fff',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <RiSparklingFill size={10} /> 96 DPI AI
                    </div>
                  )}
                </div>

                {/* Metadata & Details */}
                <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={asset.title}>
                      {asset.title || asset.filename || 'Untitled Asset'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{formatBytes(asset.size_bytes)}</span>
                      <span>{asset.media_type ? asset.media_type.toUpperCase() : 'MEDIA'}</span>
                    </div>
                    {asset.used_in && asset.used_in.length > 0 && (
                      <div style={{ fontSize: '9.5px', color: '#22d3ee', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Used: {asset.used_in.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {pickerMode && typeof onSelectAsset === 'function' ? (
                      <button
                        type="button"
                        onClick={() => onSelectAsset(asset.media_url, asset)}
                        style={{
                          width: '100%',
                          padding: '5px',
                          background: '#22d3ee',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '2px',
                          fontWeight: 800,
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        Select This Asset
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(asset)}
                          title="Copy Public Asset URL"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === asset.id ? '#10b981' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {copiedId === asset.id ? <RiCheckLine size={13} /> : <RiFileCopyLine size={13} />}
                          <span>{copiedId === asset.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setReplacingAssetId(asset.id);
                              if (replaceInputRef.current) replaceInputRef.current.click();
                            }}
                            title="Replace this asset with new file"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            Replace
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(asset.id)}
                            title="Delete Asset"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '2px'
                            }}
                          >
                            <RiDeleteBin6Line size={13} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top-Up Storage Quota Modal */}
      {showTopUpModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0c101d',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#8b5cf6', padding: '6px', borderRadius: '3px', color: '#fff' }}>
                  <RiHardDrive2Fill size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                    Top-Up Storage Quota
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                    Expand storage capacity using your account credits
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowTopUpModal(false); setTopUpMsg(null); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                <RiCloseLine />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Credit Balance Badge */}
              <div style={{
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                borderRadius: '4px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00f0ff', fontSize: '13px', fontWeight: 800 }}>
                  <RiCoinsLine size={18} />
                  <span>Available Balance: {quota?.credits ?? (sessionUser?.credits || 0)} Credits</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Current Quota: <strong>{quota?.quota_mb || 500} MB</strong>
                </div>
              </div>

              {topUpMsg && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: topUpMsg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  border: topUpMsg.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
                  color: topUpMsg.type === 'success' ? '#10b981' : '#ef4444'
                }}>
                  {topUpMsg.text}
                </div>
              )}

              {/* Storage Packages List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'starter_topup', title: '+500 MB Storage Pack', credits: 50, desc: 'Adds 500 MB to your storage allotment permanently' },
                  { id: 'pro_topup', title: '+1 GB (1,000 MB) Pro Pack', credits: 90, desc: 'Best Value • Great for high-res WAV stems & 4K video clips', popular: true },
                  { id: 'enterprise_topup', title: '+5 GB (5,000 MB) Studio Pack', credits: 350, desc: 'Heavy catalog capacity for complete label discographies' }
                ].map(pkg => (
                  <div
                    key={pkg.id}
                    style={{
                      background: pkg.popular ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: pkg.popular ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{pkg.title}</span>
                        {pkg.popular && (
                          <span style={{ fontSize: '10px', background: '#8b5cf6', color: '#fff', padding: '1px 6px', borderRadius: '2px', fontWeight: 800 }}>
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                        {pkg.desc}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={topUpLoading}
                      onClick={() => handleTopUpStorage(pkg.id)}
                      style={{
                        background: pkg.popular ? '#00f0ff' : '#8b5cf6',
                        color: pkg.popular ? '#000' : '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '7px 14px',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: topUpLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <RiAddCircleLine size={14} />
                      {pkg.credits} Credits
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => { setShowTopUpModal(false); setTopUpMsg(null); }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8',
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
