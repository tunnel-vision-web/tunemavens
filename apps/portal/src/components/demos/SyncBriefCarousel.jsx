import React from 'react'
import SyncBriefDemo from './SyncBriefDemo.jsx'

export default function SyncBriefCarousel({ step, setStep }) {
  const steps = [
    {
      title: "Step 1: Input Narrative Description or Scene Brief",
      desc: "Input raw movie scene storyboards, narrative directions, or visual descriptors directly. The parser handles complex screenplays.",
      icon: "🎬",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', fontSize: '11px', color: 'var(--mu)', textAlign: 'left' }}>
          <strong>Scene Descriptor:</strong> "High-energy cyberpunk motorcycle chase, driving industrial synthesizer chords, aggressive heavy electronic beats..."
        </div>
      )
    },
    {
      title: "Step 2: Generate Sync Metadata Tags",
      desc: "Our AI translates descriptors into standard music metadata tags (BPM, Mood, Instrumentation) instantly.",
      icon: "🏷️",
      visual: <SyncBriefDemo />
    },
    {
      title: "Step 3: Match Search Criteria of Supervisors",
      desc: "Instantly compare generated keywords with specifications requested by global music supervisors.",
      icon: "🔍",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span>Netflix Cyberpunk Brief</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>98% Match</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span>EA Games Racing Brief</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>94% Match</span>
          </div>
        </div>
      )
    },
    {
      title: "Step 4: Deliver Direct Brief Submissions",
      desc: "Package and transmit your tagged audio directly to TV & Film briefs with zero middleman publisher fees.",
      icon: "📬",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--green)', fontSize: '11px', fontWeight: '700' }}>✓ Brief Submission Transmitted</div>
          <div style={{ color: 'var(--mu)', fontSize: '10px', marginTop: '4px' }}>Metadata and WAV master delivered to buyer inbox.</div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="split-cascade-carousel-widget glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r)', width: '100%', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{current.icon}</span>
        <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: '700' }}>{current.title}</h4>
      </div>
      
      <p style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45', margin: '0 0 12px' }}>{current.desc}</p>
      
      <div className="step-visualization" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {current.visual}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setStep(idx)}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === step ? 'var(--cyan)' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0 }}
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
