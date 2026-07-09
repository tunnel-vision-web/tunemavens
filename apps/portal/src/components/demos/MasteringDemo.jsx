import React, { useState } from 'react'

export default function MasteringDemo() {
  const [fileChosen, setFileChosen] = useState(false);
  const [target, setTarget] = useState('Spotify');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        lufs: target === 'Spotify' ? '-14.1 LUFS' : target === 'Apple' ? '-16.2 LUFS' : '-23.0 LUFS',
        peak: '-1.0 dBFS',
        status: 'Optimal dynamic range matched successfully'
      });
    }, 900);
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setFileChosen(true)} 
          className="plan-btn outline" 
          style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
        >
          📁 {fileChosen ? 'reference_mix.wav loaded' : 'Load Audio File'}
        </button>
        <select 
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ padding: '6px', fontSize: '11px', height: '32px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          <option value="Spotify">Spotify Target (-14 LUFS)</option>
          <option value="Apple">Apple Music Target (-16 LUFS)</option>
          <option value="Broadcast">Broadcast TV Target (-23 LUFS)</option>
        </select>
        <button 
          onClick={handleRun} 
          disabled={!fileChosen}
          className="btn-primary" 
          style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', opacity: fileChosen ? 1 : 0.5, cursor: 'pointer' }}
        >
          {loading ? 'Measuring LUFS...' : 'Analyze Audio'}
        </button>
      </div>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--purple)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>Measured Loudness:</strong> {result.lufs} | <strong>True Peak:</strong> {result.peak}</div>
          <div style={{ color: 'var(--purple)' }}><strong>Status:</strong> {result.status}</div>
        </div>
      )}
    </div>
  );
}
