import React from 'react'
import SplitCalculatorDemo from './SplitCalculatorDemo.jsx'

export default function SplitCascadeCarousel({ step, setStep }) {
  const steps = [
    {
      title: "Step 1: Set Your Roster Shares",
      desc: "Define split allocations for artists, producers, and labels once. The ledger stores these rules permanently.",
      icon: "📋",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
            <span>Artist Share</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>50%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
            <span>Producer Share</span> <span style={{ color: 'var(--cyan)', fontWeight: '700' }}>30%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Label Share</span> <span style={{ color: 'var(--purple)', fontWeight: '700' }}>20%</span>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: Upload Sales Statements",
      desc: "Drop raw transaction CSV exports from DistroKid or Spotify directly. The engine parses them instantly.",
      icon: "📁",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
          <div style={{ fontSize: '13px', color: 'var(--mu)' }}>raw_sales_report.csv</div>
          <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px', fontWeight: '500' }}>✓ 15,240 rows parsed successfully</div>
        </div>
      )
    },
    {
      title: "Step 3: Run the Split Cascade",
      desc: "The cascade engine divides the bulk receipts into respective collaborator balances.",
      icon: "⚡",
      visual: <SplitCalculatorDemo />
    },
    {
      title: "Step 4: Dispatch Digital Payouts",
      desc: "Direct wallet payouts map to digital currencies and local mobile payment terminals (such as M-Pesa).",
      icon: "💸",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Artist Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$500.00 (M-Pesa)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Producer Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$300.00 (Paypal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Label Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$200.00 (Wire)</span>
          </div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="split-cascade-carousel-widget glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r)', width: '100%', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{current.icon}</span>
        <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: '700' }}>{current.title}</h4>
      </div>
      
      <p style={{ fontSize: '14.5px', color: 'var(--mu)', lineHeight: '1.45', margin: '0 0 12px' }}>{current.desc}</p>
      
      <div className="step-visualization" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {current.visual}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setStep(idx)}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === step ? 'var(--green)' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}
            className="plan-btn outline"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            Prev
          </button>
          <button 
            onClick={() => setStep((s) => (s + 1) % steps.length)}
            className="btn-primary"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
