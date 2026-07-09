import React, { useState } from 'react'
import SplitCascadeCarousel from './SplitCascadeCarousel.jsx'

export default function SplitCascadeLedgerApp({ goBack }) {
  const [step, setStep] = useState(0);
  return (
    <div className="ledger-app-widget" style={{ padding: '24px', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>Split Cascade Ledger</h2>
            <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Manage revenue distributions, metadata rules, and statements</p>
          </div>
        </div>
        <button 
          onClick={goBack} 
          className="plan-btn outline"
          style={{ padding: '6px 14px', fontSize: '11px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
        >
          &larr; Back to Apps
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <SplitCascadeCarousel step={step} setStep={setStep} />
      </div>
    </div>
  );
}
