import React, { useState } from 'react';
import {
  RiShieldCheckFill,
  RiScales3Fill,
  RiSparklingFill,
  RiCheckFill,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCoinsFill,
  RiDiscFill,
  RiFileTextFill,
  RiHandCoinFill,
  RiBuilding4Fill,
  RiTimeLine
} from 'react-icons/ri';
import { dealsApi, contractsApi } from '../../lib/api.js';

export default function PathCNegotiationWizard({ sessionUser, onComplete, onClose }) {
  const [step, setStep] = useState(1); // 1: Catalogue Scope, 2: Split Negotiation, 3: Executed Agreement

  // Step 1: Catalogue Scope inputs
  const [labelName, setLabelName] = useState(sessionUser?.name || 'Sovereign Records');
  const [rosterSize, setRosterSize] = useState(12);
  const [catalogueTracks, setCatalogueTracks] = useState(48);
  const [advanceRequested, setAdvanceRequested] = useState(0);
  const [territory, setTerritory] = useState('Worldwide');
  const [termYears, setTermYears] = useState(3);

  // Step 2: Split proposal
  const [proposedCreatorSplit, setProposedCreatorSplit] = useState(80);
  const [proposedTmSplit, setProposedTmSplit] = useState(20);
  const [marketingCommitment, setMarketingCommitment] = useState('Tier-1 Direct DSP Pitching');
  const [notes, setNotes] = useState('');

  // Negotiation state
  const [negotiationRound, setNegotiationRound] = useState(1);
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockedDeal, setLockedDeal] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSplitChange = (creatorPct) => {
    const valid = Math.max(50, Math.min(95, creatorPct));
    setProposedCreatorSplit(valid);
    setProposedTmSplit(100 - valid);
  };

  const handleSendProposal = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        label_name: labelName,
        roster_size: Number(rosterSize),
        catalogue_track_count: Number(catalogueTracks),
        proposed_creator_split: Number(proposedCreatorSplit),
        proposed_tunemavens_split: Number(proposedTmSplit),
        advance_requested: Number(advanceRequested),
        territory,
        term_years: Number(termYears),
        marketing_commitment: marketingCommitment,
        notes,
        round_number: negotiationRound
      };

      const res = await dealsApi.distribution.negotiate(payload);

      if (res.status === 'accepted') {
        setLockedDeal(res.deal || res);
        setAiFeedback({
          status: 'accepted',
          message: res.message || 'Terms accepted by TuneMavens Executive AI.'
        });
        setNegotiationHistory(prev => [
          ...prev,
          {
            round: negotiationRound,
            type: 'Accepted',
            creatorSplit: res.final_creator_split,
            tmSplit: res.final_tunemavens_split,
            note: res.message
          }
        ]);
        setStep(3);
        if (onComplete) onComplete(res);
      } else {
        // Counter-offer
        setAiFeedback({
          status: 'counter_offer',
          message: res.message,
          counterCreator: res.counter_creator_split,
          counterTm: res.counter_tunemavens_split
        });
        setNegotiationHistory(prev => [
          ...prev,
          {
            round: negotiationRound,
            type: 'Counter-Offer',
            creatorSplit: res.counter_creator_split,
            tmSplit: res.counter_tunemavens_split,
            note: res.message
          }
        ]);
        setNegotiationRound(res.round_number || negotiationRound + 1);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Negotiation request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptCounterOffer = () => {
    if (aiFeedback?.counterCreator) {
      handleSplitChange(aiFeedback.counterCreator);
      // Auto-trigger acceptance on the counter terms
      setTimeout(() => {
        handleSendProposal();
      }, 50);
    }
  };

  return (
    <div style={{
      background: '#090d1a',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '4px',
      padding: '24px',
      color: '#fff',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      maxWidth: '820px',
      margin: '0 auto'
    }}>
      {/* Wizard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '3px', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
            <RiScales3Fill size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#fff' }}>
              Distribution Path C: AI Catalogue Negotiation Wizard
            </h3>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              Bespoke multi-artist catalogue terms, negotiated splits &amp; recoupable advances
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
          >
            <RiCloseLine />
          </button>
        )}
      </div>

      {/* Step Indicator Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { num: 1, label: 'Catalogue Scope' },
          { num: 2, label: 'AI Split Negotiation' },
          { num: 3, label: 'Executed Master Agreement' }
        ].map(s => (
          <div
            key={s.num}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '3px',
              background: step === s.num ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${step === s.num ? '#a855f7' : 'rgba(255,255,255,0.08)'}`,
              color: step === s.num ? '#c084fc' : '#64748b',
              fontSize: '11.5px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: step === s.num ? '#a855f7' : 'rgba(255,255,255,0.1)',
              color: step === s.num ? '#fff' : '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px'
            }}>
              {s.num}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Catalogue Scope */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '800', color: '#c084fc' }}>
              1. Record Label &amp; Catalogue Metadata
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  RECORD LABEL / IMPRINT NAME
                </label>
                <input
                  type="text"
                  value={labelName}
                  onChange={(e) => setLabelName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  SIGNED ARTISTS ON ROSTER
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={rosterSize}
                  onChange={(e) => setRosterSize(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  CATALOGUE TRACK COUNT (MASTERS)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  value={catalogueTracks}
                  onChange={(e) => setCatalogueTracks(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  UPFRONT ADVANCE FINANCING REQUESTED
                </label>
                <select
                  value={advanceRequested}
                  onChange={(e) => setAdvanceRequested(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option value={0}>$0 (Pure Placement / Max Split)</option>
                  <option value={5000}>$5,000 (Micro-Advance)</option>
                  <option value={15000}>$15,000 (Roster Studio Advance)</option>
                  <option value={25000}>$25,000 (Senior Catalogue Advance)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  DISTRIBUTION TERRITORY
                </label>
                <select
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option value="Worldwide">Worldwide (All 181+ DSP Territories)</option>
                  <option value="Africa + Diaspora">Africa + Global Diaspora (Focused)</option>
                  <option value="Europe & North America">Europe &amp; North America Ex-Africa</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                  AGREEMENT TERM DURATION
                </label>
                <select
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option value={1}>1 Year (Short-Term Renewable)</option>
                  <option value={3}>3 Years (Standard Catalogue Term)</option>
                  <option value={5}>5 Years (Long-Term Strategic Imprint)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                background: '#a855f7',
                color: '#fff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Proceed to AI Split Negotiation</span>
              <RiArrowRightLine />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Split Negotiation */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '4px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11.5px', color: '#c084fc', fontWeight: 'bold', textTransform: 'uppercase' }}>
                ROUND {negotiationRound} PROPOSAL
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {catalogueTracks} Masters · {advanceRequested > 0 ? `$${advanceRequested.toLocaleString()} Advance` : 'Zero Advance'}
              </span>
            </div>

            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                  Label Split: <strong style={{ color: '#00f2fe' }}>{proposedCreatorSplit}%</strong>
                </span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#94a3b8' }}>
                  TuneMavens Platform: <strong style={{ color: '#c084fc' }}>{proposedTmSplit}%</strong>
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={proposedCreatorSplit}
                onChange={(e) => handleSplitChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#00f2fe', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                <span>50 / 50 Standard</span>
                <span>70 / 30 Pro</span>
                <span>80 / 20 Preferred</span>
                <span>85 / 15 Volume</span>
                <span>90 / 10 Enterprise</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '6px' }}>
                EXECUTIVE JUSTIFICATION / PITCH NOTE (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. Our catalogue averages 450,000 monthly listeners across Spotify & Apple Music"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* AI Feedback Banner */}
          {aiFeedback && (
            <div style={{
              padding: '14px 16px',
              borderRadius: '3px',
              background: aiFeedback.status === 'accepted' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1px solid ${aiFeedback.status === 'accepted' ? '#10b981' : '#f59e0b'}`,
              color: '#fff',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <RiSparklingFill color={aiFeedback.status === 'accepted' ? '#10b981' : '#f59e0b'} size={16} />
                <strong style={{ color: aiFeedback.status === 'accepted' ? '#10b981' : '#f59e0b' }}>
                  {aiFeedback.status === 'accepted' ? 'PROPOSAL ACCEPTED' : 'AI COUNTER-OFFER'}
                </strong>
              </div>
              <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.5 }}>
                {aiFeedback.message}
              </p>

              {aiFeedback.status === 'counter_offer' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleAcceptCounterOffer}
                    style={{
                      background: '#10b981',
                      color: '#060813',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '3px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Accept Counter-Offer ({aiFeedback.counterCreator}% / {aiFeedback.counterTm}%)
                  </button>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '3px', color: '#ef4444', fontSize: '12px' }}>
              ✕ {errorMsg}
            </div>
          )}

          {/* Negotiation Log */}
          {negotiationHistory.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                Negotiation Audit Trail
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {negotiationHistory.map((h, i) => (
                  <div key={i} style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Round {h.round} ({h.type}): {h.creatorSplit}% Label / {h.tmSplit}% TuneMavens</span>
                    <span style={{ color: '#10b981' }}>Logged</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiArrowLeftLine /> Back to Scope
            </button>

            <button
              type="button"
              onClick={handleSendProposal}
              disabled={isSubmitting}
              style={{
                background: '#a855f7',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '3px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? 'Evaluating Proposal...' : `⚡ Submit ${proposedCreatorSplit}/${proposedTmSplit} Proposal to AI`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Executed Agreement */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center', padding: '16px 0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '2px solid #10b981', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <RiCheckFill size={32} />
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 6px' }}>
              Path C Master Distribution Agreement Executed!
            </h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, maxWidth: '540px', margin: '0 auto' }}>
              Your {proposedCreatorSplit}% / {proposedTmSplit}% negotiated split has been securely recorded on the sovereign distribution ledger with Priority Tier-1 DSP ingest.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '18px', maxWidth: '520px', margin: '0 auto', width: '100%', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>RECORD LABEL</span>
              <strong style={{ fontSize: '12px', color: '#fff' }}>{labelName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>COMMITTED CATALOGUE</span>
              <strong style={{ fontSize: '12px', color: '#fff' }}>{catalogueTracks} Masters ({rosterSize} Artists)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>ROYALTY SPLIT CASCADE</span>
              <strong style={{ fontSize: '12px', color: '#00f2fe' }}>{proposedCreatorSplit}% Label / {proposedTmSplit}% TuneMavens</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>TERRITORY &amp; TERM</span>
              <strong style={{ fontSize: '12px', color: '#fff' }}>{territory} · {termYears} Years</strong>
            </div>
            {advanceRequested > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>RECOUPABLE ADVANCE</span>
                <strong style={{ fontSize: '12px', color: '#10b981' }}>${advanceRequested.toLocaleString()} USD</strong>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>IMMUNITY PASSPORT</span>
              <span style={{ fontSize: '11px', color: '#a855f7', fontFamily: 'monospace', fontWeight: 'bold' }}>
                TM-DIST-PATHC-2026-VERIFIED
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '10px 24px', borderRadius: '3px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
              >
                Return to Distribution Console
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
