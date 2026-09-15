import React, { useState, useEffect, useRef } from 'react';
import {
  RiUserVoiceFill, RiArrowDownSLine, RiAddLine, RiCheckLine,
  RiEditLine, RiDeleteBin6Line, RiCloseLine, RiSearchLine,
  RiDiscFill, RiSparklingFill
} from 'react-icons/ri';

export default function ArtistRosterSelector({
  activeSubdomain = 'ndufo',
  onSelectArtist,
  compact = false
}) {
  const [artists, setArtists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [targetArtist, setTargetArtist] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSubdomain, setFormSubdomain] = useState('');
  const [formRole, setFormRole] = useState('Primary Artist');
  const [formGenre, setFormGenre] = useState('Afro-fusion');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    loadArtists();
    const handleUpdate = () => loadArtists();
    window.addEventListener('tunemavens-artists-updated', handleUpdate);
    return () => window.removeEventListener('tunemavens-artists-updated', handleUpdate);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadArtists = async () => {
    try {
      const res = await fetch('/api/catalog/artists');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.artists)) {
          setArtists(data.artists);
        }
      }
    } catch (err) {
      console.warn('Failed to load roster artists:', err);
    }
  };

  const activeArtist = (activeSubdomain === 'all') ? {
    name: 'All Artists (Entire Catalogue)',
    subdomain: 'all',
    role: 'Entire Platform Catalogue',
    genre: 'All Genres',
    avatar: ''
  } : (artists.find(
    a => (a.subdomain || '').toLowerCase() === (activeSubdomain || '').toLowerCase()
  ) || artists[0] || {
    name: 'Ndufo',
    subdomain: 'ndufo',
    role: 'Primary Artist',
    genre: 'Afro-House',
    avatar: '/heroes/ndufo_hero_slide1_retina.jpg'
  });

  const handleOpenAdd = () => {
    setFormName('');
    setFormSubdomain('');
    setFormRole('Primary Artist');
    setFormGenre('Afro-fusion');
    setFormBio('');
    setFormAvatar('');
    setErrorMsg(null);
    setModalMode('add');
    setIsOpen(false);
  };

  const handleOpenEdit = (artist, e) => {
    e.stopPropagation();
    setTargetArtist(artist);
    setFormName(artist.name || '');
    setFormSubdomain(artist.subdomain || '');
    setFormRole(artist.role || 'Primary Artist');
    setFormGenre(artist.genre || 'Afro-fusion');
    setFormBio(artist.bio || '');
    setFormAvatar(artist.avatar || '');
    setErrorMsg(null);
    setModalMode('edit');
    setIsOpen(false);
  };

  const handleSaveArtist = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('Artist name is required');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name: formName.trim(),
      subdomain: formSubdomain.trim() || formName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      role: formRole,
      genre: formGenre,
      bio: formBio,
      avatar: formAvatar || `https://picsum.photos/seed/${formName}/400/400`
    };

    try {
      const url = modalMode === 'edit' && targetArtist
        ? `/api/catalog/artists/${targetArtist.id || targetArtist.subdomain}`
        : '/api/catalog/artists';
      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.artists)) {
          setArtists(data.artists);
        }
        window.dispatchEvent(new CustomEvent('tunemavens-artists-updated'));
        setModalMode(null);
        if (typeof onSelectArtist === 'function') {
          onSelectArtist(data.artist || payload);
        }
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Failed to save artist profile');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtist = async (artist, e) => {
    e.stopPropagation();
    if (artist.subdomain === 'ndufo') {
      alert('Cannot delete default system artist Ndufo.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove artist "${artist.name}" from your roster?`)) return;

    try {
      const res = await fetch(`/api/catalog/artists/${artist.id || artist.subdomain}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadArtists();
        window.dispatchEvent(new CustomEvent('tunemavens-artists-updated'));
        if (activeArtist.subdomain === artist.subdomain) {
          const fallback = artists.find(a => a.subdomain !== artist.subdomain) || { subdomain: 'ndufo', name: 'Ndufo' };
          if (typeof onSelectArtist === 'function') {
            onSelectArtist(fallback);
          }
        }
      }
    } catch (err) {
      alert(`Error deleting artist: ${err.message}`);
    }
  };

  const filteredArtists = artists.filter(a =>
    (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.genre || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Active Artist Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(34, 211, 238, 0.35)',
          borderRadius: '4px',
          padding: compact ? '4px 10px' : '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'all 0.2s ease'
        }}
        title="Switch active artist roster profile"
      >
        {/* Avatar */}
        <div style={{
          width: compact ? '20px' : '26px',
          height: compact ? '20px' : '26px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1.5px solid #22d3ee',
          flexShrink: 0,
          background: '#04060d'
        }}>
          <img
            src={activeArtist.avatar || '/heroes/ndufo_hero_slide1_retina.jpg'}
            alt={activeArtist.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
          />
        </div>

        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: compact ? '11.5px' : '13px', fontWeight: 800, color: '#fff' }}>
              {activeArtist.name || 'Ndufo'}
            </span>
            <span style={{
              fontSize: '9px',
              fontWeight: 700,
              color: '#22d3ee',
              background: 'rgba(34, 211, 238, 0.12)',
              padding: '1px 5px',
              borderRadius: '2px',
              textTransform: 'uppercase'
            }}>
              {activeArtist.genre || 'Afro-fusion'}
            </span>
          </div>
          {!compact && (
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              {activeArtist.role || 'Roster Artist'} • {activeArtist.subdomain}.tunemavens.com
            </span>
          )}
        </div>

        <RiArrowDownSLine size={16} color="#22d3ee" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          minWidth: '320px',
          background: '#0c101d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          boxShadow: '0 16px 36px rgba(0,0,0,0.85)',
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search Header */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ position: 'relative' }}>
              <RiSearchLine size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search artists by name or genre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '5px 8px 5px 28px',
                  background: '#04060d',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '3px',
                  color: '#fff',
                  fontSize: '11.5px'
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Artists List */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '6px' }}>
            {/* All Artists Option */}
            <div
              onClick={() => {
                if (typeof onSelectArtist === 'function') {
                  onSelectArtist({
                    subdomain: 'all',
                    name: 'All Artists (Entire Catalogue)',
                    role: 'Full Platform Catalogue',
                    genre: 'All Genres',
                    avatar: ''
                  });
                }
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '3px',
                cursor: 'pointer',
                background: activeSubdomain === 'all' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.03)',
                border: activeSubdomain === 'all' ? '1px solid #00f0ff' : '1px solid transparent',
                marginBottom: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '3px',
                  background: '#00f0ff',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '10px'
                }}>
                  ALL
                </div>
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: activeSubdomain === 'all' ? '#00f0ff' : '#fff' }}>
                    All Artists (Entire Catalogue)
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>
                    Full platform discography across all creators
                  </div>
                </div>
              </div>
              {activeSubdomain === 'all' && <RiCheckLine size={15} color="#00f0ff" />}
            </div>

            {filteredArtists.map(artist => {
              const isSelected = (artist.subdomain || '').toLowerCase() === (activeArtist.subdomain || '').toLowerCase();
              return (
                <div
                  key={artist.id || artist.subdomain}
                  onClick={() => {
                    if (typeof onSelectArtist === 'function') {
                      onSelectArtist(artist);
                    }
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                    marginBottom: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', overflow: 'hidden', background: '#1e293b', flexShrink: 0 }}>
                      <img
                        src={artist.avatar || '/heroes/ndufo_hero_slide1_retina.jpg'}
                        alt={artist.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#22d3ee' : '#fff' }}>
                          {artist.name}
                        </span>
                        {isSelected && <RiCheckLine size={13} color="#22d3ee" />}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {artist.role || 'Artist'} • <span style={{ color: '#cbd5e1' }}>{artist.genre || 'Afro-fusion'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      title="Edit artist metadata"
                      onClick={(e) => handleOpenEdit(artist, e)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    >
                      <RiEditLine size={13} />
                    </button>
                    {artist.subdomain !== 'ndufo' && (
                      <button
                        type="button"
                        title="Remove artist"
                        onClick={(e) => handleDeleteArtist(artist, e)}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                      >
                        <RiDeleteBin6Line size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Artist Footer Action */}
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '10.5px', color: '#64748b' }}>
              {artists.length} Artist(s) on Roster
            </span>
            <button
              type="button"
              onClick={handleOpenAdd}
              style={{
                background: '#22d3ee',
                color: '#0f172a',
                border: 'none',
                borderRadius: '3px',
                padding: '5px 10px',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RiAddLine size={14} /> Add Artist
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Artist Modal */}
      {modalMode && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
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
            maxWidth: '520px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiUserVoiceFill color="#22d3ee" size={16} />
                <h4 style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 800 }}>
                  {modalMode === 'add' ? 'Add New Artist to Roster' : `Edit Artist: ${targetArtist?.name}`}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}
              >
                <RiCloseLine />
              </button>
            </div>

            {errorMsg && (
              <div style={{ padding: '8px 18px', background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '11.5px', fontWeight: 700 }}>
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveArtist} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                  Artist / Act Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aisha Wanjiku, Sauti Soul, Brian Omondi"
                  value={formName}
                  onChange={e => {
                    setFormName(e.target.value);
                    if (modalMode === 'add') {
                      setFormSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  required
                  style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    EPK Subdomain Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. aisha"
                    value={formSubdomain}
                    onChange={e => setFormSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    required
                    style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                  />
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>.tunemavens.com</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Primary Genre
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Afro-fusion, Amapiano"
                    value={formGenre}
                    onChange={e => setFormGenre(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Role / Category
                  </label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="Primary Artist">Primary Artist</option>
                    <option value="Singer-Songwriter">Singer-Songwriter</option>
                    <option value="Producer / Composer">Producer / Composer</option>
                    <option value="Band / Group">Band / Group</option>
                    <option value="DJ / Remixer">DJ / Remixer</option>
                    <option value="Executive / Label Act">Executive / Label Act</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://... or /heroes/..."
                    value={formAvatar}
                    onChange={e => setFormAvatar(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
                  Artist Bio / Synopsis
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief synopsis of artist's sound, origins, and focus..."
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', resize: 'vertical' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={{ padding: '7px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '7px 16px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '3px', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}
                >
                  {loading ? 'Saving...' : modalMode === 'add' ? 'Add to Roster' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
