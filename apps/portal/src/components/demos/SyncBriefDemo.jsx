import React, { useState } from 'react'

export default function SyncBriefDemo() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        bpm: '118',
        mood: 'Driving, Late-Night, Confident',
        genre: 'Electro-Pop / Synthwave',
        tags: 'Automobile Commercial, Urban Night, Retro-Futuristic'
      });
    }, 800);
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Energetic urban skate video in Atlanta" 
          className="form-control" 
          style={{ padding: '6px 12px', fontSize: '11px', flex: '1', height: '32px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
          required
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
          {loading ? 'Analyzing...' : 'Generate Sync Brief'}
        </button>
      </form>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--cyan)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>BPM:</strong> {result.bpm} | <strong>Genre:</strong> {result.genre}</div>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>Mood:</strong> {result.mood}</div>
          <div style={{ color: 'var(--cyan)' }}><strong>Generated Placements:</strong> {result.tags}</div>
        </div>
      )}
    </div>
  );
}
