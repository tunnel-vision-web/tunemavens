import React, { useState, useEffect } from 'react';
import {
  RiCloseLine, RiAddLine, RiEditLine, RiDeleteBin6Line,
  RiCheckLine, RiSearchLine, RiPriceTag3Fill, RiRefreshLine
} from 'react-icons/ri';
import { fetchGenres, addGenre, updateGenre, deleteGenre, getCachedGenres } from '../lib/genres.js';

export default function GenreManagerModal({ isOpen, onClose }) {
  const [genres, setGenres] = useState(getCachedGenres());
  const [search, setSearch] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreCategory, setNewGenreCategory] = useState('African & World');
  const [editingGenre, setEditingGenre] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadLatest();
    }
  }, [isOpen]);

  const loadLatest = async () => {
    setLoading(true);
    const list = await fetchGenres();
    setGenres(list);
    setLoading(false);
  };

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    setLoading(true);
    const res = await addGenre(newGenreName.trim(), newGenreCategory);
    setLoading(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: `Added genre "${newGenreName}"` });
      setNewGenreName('');
      loadLatest();
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleUpdate = async (oldName) => {
    if (!editName.trim()) return;
    setLoading(true);
    const res = await updateGenre(oldName, editName.trim());
    setLoading(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: `Updated genre to "${editName}"` });
      setEditingGenre(null);
      loadLatest();
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to remove genre "${name}" from the catalogue?`)) return;
    setLoading(true);
    const res = await deleteGenre(name);
    setLoading(false);
    if (res.error) {
      setMsg({ type: 'error', text: res.error });
    } else {
      setMsg({ type: 'success', text: `Deleted genre "${name}"` });
      loadLatest();
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const filteredGenres = genres.filter(g =>
    g.toLowerCase().includes(search.toLowerCase())
  );

  return (
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
        maxWidth: '680px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
        overflow: 'hidden'
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
              <RiPriceTag3Fill size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                System Genre Registry &amp; Manager
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#94a3b8' }}>
                Manage authoritative African, World, and Global genres recognized across TuneMavens.
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

        {/* Message Banner */}
        {msg && (
          <div style={{
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            background: msg.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
            color: msg.type === 'error' ? '#ef4444' : '#10b981',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            {msg.text}
          </div>
        )}

        {/* Add Genre Form */}
        <form onSubmit={handleAdd} style={{
          padding: '14px 20px',
          background: 'rgba(34,211,238,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Add new genre (e.g. Afro-fusion, Amapiano, Benga)..."
            value={newGenreName}
            onChange={e => setNewGenreName(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '7px 12px',
              background: '#04060d',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12px'
            }}
          />
          <select
            value={newGenreCategory}
            onChange={e => setNewGenreCategory(e.target.value)}
            style={{
              padding: '7px 10px',
              background: '#04060d',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '3px',
              color: '#cbd5e1',
              fontSize: '12px'
            }}
          >
            <option value="African & World">African &amp; World</option>
            <option value="Global / Modern">Global / Modern</option>
            <option value="Electronic / Dance">Electronic / Dance</option>
            <option value="Acoustic / Traditional">Acoustic / Traditional</option>
          </select>
          <button
            type="submit"
            disabled={loading || !newGenreName.trim()}
            style={{
              padding: '7px 14px',
              background: '#22d3ee',
              color: '#0f172a',
              border: 'none',
              borderRadius: '3px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RiAddLine size={14} /> Add Genre
          </button>
        </form>

        {/* Search Bar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <RiSearchLine size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder={`Search ${genres.length} genres...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 32px',
                background: '#060a14',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
            {filteredGenres.length} of {genres.length} active
          </span>
        </div>

        {/* Genre List Grid */}
        <div style={{
          padding: '16px 20px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '8px'
        }}>
          {filteredGenres.map(g => (
            <div
              key={g}
              style={{
                background: g === 'Afro-fusion' ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)',
                border: g === 'Afro-fusion' ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '3px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px'
              }}
            >
              {editingGenre === g ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    style={{ flex: 1, padding: '3px 6px', background: '#04060d', border: '1px solid #22d3ee', borderRadius: '2px', color: '#fff', fontSize: '11px' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdate(g)}
                    style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '2px', padding: '3px 5px', cursor: 'pointer' }}
                  >
                    <RiCheckLine size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingGenre(null)}
                    style={{ background: 'transparent', color: '#94a3b8', border: 'none', padding: '3px', cursor: 'pointer' }}
                  >
                    <RiCloseLine size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <span style={{ color: g === 'Afro-fusion' ? '#22d3ee' : '#cbd5e1', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      title={`Edit ${g}`}
                      onClick={() => { setEditingGenre(g); setEditName(g); }}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                    >
                      <RiEditLine size={12} />
                    </button>
                    <button
                      type="button"
                      title={`Delete ${g}`}
                      onClick={() => handleDelete(g)}
                      style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                    >
                      <RiDeleteBin6Line size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Changes synchronize automatically to all EPK, Catalogue, and Ingestion dropdowns.
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
