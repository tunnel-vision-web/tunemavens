import React, { useState } from 'react'

export default function SplitCalculatorDemo() {
  const [amount, setAmount] = useState('1000');
  const [artist, setArtist] = useState('50');
  const [producer, setProducer] = useState('30');
  const [label, setLabel] = useState('20');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 0;
    const art = (parseFloat(artist) / 100) * amt;
    const prod = (parseFloat(producer) / 100) * amt;
    const lbl = (parseFloat(label) / 100) * amt;
    setResult({ art, prod, lbl });
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '80px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Bulk Amount ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Artist %</label>
            <input 
              type="number" 
              value={artist} 
              onChange={(e) => setArtist(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Producer %</label>
            <input 
              type="number" 
              value={producer} 
              onChange={(e) => setProducer(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Label %</label>
            <input 
              type="number" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '11px', height: '28px', borderRadius: '4px', alignSelf: 'flex-end', cursor: 'pointer' }}>
          Run Cascade Allocation
        </button>
      </form>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--green)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '2px' }}><strong>Artist Payout:</strong> ${result.art.toFixed(2)}</div>
          <div style={{ color: 'var(--mu)', marginBottom: '2px' }}><strong>Producer Payout:</strong> ${result.prod.toFixed(2)}</div>
          <div style={{ color: 'var(--green)' }}><strong>Label Payout:</strong> ${result.lbl.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
