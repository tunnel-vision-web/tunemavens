import React, { useState } from 'react'
import {
  RiShieldCheckFill,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSendPlaneFill,
  RiCheckboxCircleFill,
  RiFlashlightLine,
  RiSparklingLine,
  RiMusicFill
} from 'react-icons/ri'
import { SYNC_CATALOG_TRACKS } from './SyncMarketplaceData.js'
import './SyncMarketplace.css'

export default function SyncBriefPitchWizard({
  isOpen,
  onClose,
  brief,
  catalogTracks,
  sessionUser,
  onPitchSubmitted
}) {
  if (!isOpen || !brief) return null;

  const availableTracks = Array.isArray(catalogTracks) && catalogTracks.length > 0 
    ? catalogTracks 
    : SYNC_CATALOG_TRACKS;

  const [step, setStep] = useState(1);
  const [selectedTrackId, setSelectedTrackId] = useState(availableTracks[0]?.id || 'sync_trk_01');
  const [pitchNote, setPitchNote] = useState('');
  const [oneStopConfirmed, setOneStopConfirmed] = useState(true);
  const [stemsReadyConfirmed, setStemsReadyConfirmed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pitchResult, setPitchResult] = useState(null);

  const selectedTrack = availableTracks.find(t => t.id === selectedTrackId) || availableTracks[0];

  // Calculate AI Match Score
  const computeMatchScore = () => {
    let score = 70;
    const reqGenres = (brief.required_genres || []).map(g => g.toLowerCase());
    const trkGenre = (selectedTrack?.genre || '').toLowerCase();
    if (reqGenres.some(rg => trkGenre.includes(rg) || rg.includes(trkGenre))) {
      score += 15;
    }

    const reqMoods = (brief.required_moods || []).map(m => m.toLowerCase());
    const trkMoods = (selectedTrack?.moods || []).map(m => m.toLowerCase());
    if (reqMoods.some(rm => trkMoods.includes(rm))) {
      score += 10;
    }

    const bpmDiff = Math.abs((brief.target_bpm || 120) - (selectedTrack?.bpm || 120));
    if (bpmDiff <= 10) score += 5;

    return Math.min(98, score);
  };

  const matchScore = computeMatchScore();

  const handleSubmitPitch = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const submission = {
        pitch_id: `PITCH-${Date.now().toString().slice(-6)}`,
        brief_id: brief.id,
        brief_title: brief.title,
        client: brief.client,
        track_id: selectedTrack.id,
        track_title: selectedTrack.title,
        artist: selectedTrack.artist,
        match_score: matchScore,
        pitch_note: pitchNote,
        status: 'UNDER_REVIEW',
        submitted_at: new Date().toISOString()
      };
      setPitchResult(submission);
      setStep(4);

      if (typeof onPitchSubmitted === 'function') {
        onPitchSubmitted(submission);
      }
    }, 1200);
  };

  return (
    <div className="sync-wizard-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sync-wizard-card" data-testid="sync-brief-pitch-wizard">
        {/* Header */}
        <div className="sync-wizard-header">
          <div>
            <span className="sync-wizard-eyebrow">Creator Sync Placement Pitch</span>
            <h3 className="sync-wizard-title">
              <RiSendPlaneFill color="#22d3ee" /> Pitch to: "{brief.title}"
            </h3>
          </div>
          <button className="sync-wizard-close-btn" onClick={onClose} aria-label="Close wizard">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="sync-wizard-stepper">
          {[
            { num: 1, label: '1. Select Track' },
            { num: 2, label: '2. AI Compatibility' },
            { num: 3, label: '3. Clearance & Note' },
            { num: 4, label: '4. Dispatched' },
          ].map((st, idx) => (
            <React.Fragment key={st.num}>
              {idx > 0 && <div className="sync-stepper-divider" />}
              <div className={`sync-stepper-step ${step === st.num ? 'active' : ''} ${step > st.num ? 'done' : ''}`}>
                <div className="sync-step-num">
                  {step > st.num ? '✓' : st.num}
                </div>
                <span>{st.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div className="sync-wizard-body">
          {/* STEP 1: SELECT TRACK */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Supervisor Brief Criteria</span>
                <h4 style={{ margin: '4px 0', fontSize: '15px', color: '#fff' }}>{brief.title} ({brief.client})</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span className="sync-badge-bpm">${brief.budget_fee?.toLocaleString()} USD Budget</span>
                  <span className="sync-badge-genre">{brief.required_genres?.join(' / ')}</span>
                  <span className="sync-badge-genre">Target {brief.target_bpm} BPM</span>
                </div>
              </div>

              <div className="aff-modal-form-group">
                <label>Choose a Track from Your Roster / Sync Vault *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                  {availableTracks.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTrackId(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        background: selectedTrackId === t.id ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        border: selectedTrackId === t.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img src={t.cover} alt="" style={{ width: '44px', height: '44px', borderRadius: '3px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '13.5px', color: '#fff', display: 'block' }}>{t.title}</strong>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>{t.artist} · {t.genre} · {t.bpm} BPM</span>
                      </div>
                      {selectedTrackId === t.id && (
                        <span style={{ color: '#22d3ee', fontSize: '12px', fontWeight: 800 }}>Selected ✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: AI SCENE COMPATIBILITY */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '20px', borderRadius: '3px' }}>
                <div style={{ textAlign: 'center', minWidth: '90px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: '#22d3ee', display: 'block', lineHeight: 1 }}>{matchScore}%</span>
                  <span style={{ fontSize: '10.5px', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase' }}>AI Match Score</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fff' }}>Strong Placement Potential</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.45 }}>
                    "{selectedTrack?.title}" matches the client's genre specifications ({selectedTrack?.genre}) with tempo aligned to within {Math.abs((brief.target_bpm || 120) - (selectedTrack?.bpm || 120))} BPM of target.
                  </p>
                </div>
              </div>

              {/* Match Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>GENRE FIT</span>
                  <strong style={{ fontSize: '13px', color: '#34d399', display: 'block', marginTop: '2px' }}>High (95%)</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>MOOD ALIGNMENT</span>
                  <strong style={{ fontSize: '13px', color: '#34d399', display: 'block', marginTop: '2px' }}>Strong (92%)</strong>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>TEMPO ACCURACY</span>
                  <strong style={{ fontSize: '13px', color: '#22d3ee', display: 'block', marginTop: '2px' }}>{selectedTrack?.bpm} BPM (96%)</strong>
                </div>
              </div>

              <div className="aff-action-notice-box">
                <RiSparklingLine size={20} color="#22d3ee" />
                <span>
                  Music supervisors on SyncMavens review AI-prioritized tracks first. Pitching deducts <strong>0 platform credits</strong>.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CLEARANCE CONFIRMATION & NOTE */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="aff-modal-form-group">
                <label>Personal Rationale Note to Music Supervisor</label>
                <textarea 
                  rows={3}
                  value={pitchNote}
                  onChange={e => setPitchNote(e.target.value)}
                  placeholder="e.g. Hi! Here is our lead track with authentic East African instruments and driving synths. Instrumental mix and clean broadcast stems are ready for immediate drop-in."
                  className="aff-modal-input"
                  style={{ resize: 'none', height: '80px' }}
                />
              </div>

              {/* Clearance Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <label style={{ fontSize: '12px', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={oneStopConfirmed} 
                    onChange={e => setOneStopConfirmed(e.target.checked)} 
                  />
                  <span>
                    <strong>100% One-Stop Master &amp; Composition:</strong> I confirm full copyright ownership or verified TuneLedger split clearance for this recording.
                  </span>
                </label>

                <label style={{ fontSize: '12px', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    checked={stemsReadyConfirmed} 
                    onChange={e => setStemsReadyConfirmed(e.target.checked)} 
                  />
                  <span>
                    <strong>Production Stems Ready:</strong> Full 24-bit WAV master and instrumental stems are prepared for instant broadcast delivery.
                  </span>
                </label>
              </div>

              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                If placed, 90.0% of the gross sync placement fee (${Math.round(brief.budget_fee * 0.9).toLocaleString()} USD) will disburse directly to your payout rail via TuneLedger.
              </div>
            </div>
          )}

          {/* STEP 4: DISPATCHED CONFIRMATION */}
          {step === 4 && pitchResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="aff-success-inner-card">
                <RiCheckboxCircleFill size={52} color="#10b981" />
                <h4 style={{ margin: '10px 0 4px', fontSize: '22px' }}>Track Successfully Pitched!</h4>
                <p>
                  "{selectedTrack?.title}" has been submitted to the music supervision team for <strong>{brief.title}</strong>. Reference ID: <strong>{pitchResult.pitch_id}</strong>.
                </p>
                <div className="aff-action-notice-box" style={{ width: '100%', marginTop: '10px' }}>
                  <RiShieldCheckFill size={20} color="#22d3ee" />
                  <span>
                    Pitch logged to your Sync Pitches Ledger. You will receive an immediate SMS/Email alert when the supervisor listens or requests a cue hold.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sync-wizard-footer">
          {step > 1 && step < 4 ? (
            <button type="button" className="aff-btn-secondary" onClick={() => setStep(s => s - 1)}>
              <RiArrowLeftLine /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <button type="button" className="aff-btn-submit-primary" onClick={() => setStep(s => s + 1)}>
              Continue <RiArrowRightLine />
            </button>
          )}

          {step === 3 && (
            <button 
              type="button" 
              className="aff-btn-submit-primary" 
              onClick={handleSubmitPitch}
              disabled={submitting || !oneStopConfirmed}
              style={{ background: '#10b981', color: '#fff' }}
            >
              <RiSendPlaneFill /> {submitting ? 'Dispatching Pitch...' : 'Submit Pitch (0 Credits)'}
            </button>
          )}

          {step === 4 && (
            <button type="button" className="aff-btn-submit-primary" onClick={onClose}>
              Done &amp; Return to Briefs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
