import React, { useState } from 'react';
import { 
  RiCloseLine, RiBookOpenFill, RiAddLine, RiDeleteBinLine, 
  RiShieldCheckFill, RiSparklingFill, RiGlobalLine 
} from 'react-icons/ri';
import { publishingApi } from '../../lib/api';

const POPULAR_PROS = [
  'ASCAP (USA)', 'BMI (USA)', 'SESAC (USA)', 'The MLC (US Digital)', 
  'MCSK (Kenya)', 'SAMRO (South Africa)', 'CAPASSO (Africa Mech)', 
  'PRS for Music (UK)', 'MCPS (UK Mech)', 'SACEM (France)', 
  'GEMA (Germany)', 'AMRA (Global Direct)', 'SOCAN (Canada)', 
  'APRA AMCOS (Australia)', 'JASRAC (Japan)', 'SACM (Mexico)'
];

export default function RegisterWorkModal({ isOpen, onClose, onWorkRegistered, sessionUser }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Afro-House / Deep Tech');
  const [duration, setDuration] = useState('03:45');
  const [isrcRecording, setIsrcRecording] = useState(`KE-TM1-26-${Math.floor(10000 + Math.random() * 89999)}`);
  const [customIswc, setCustomIswc] = useState('');
  const [electionTier, setElectionTier] = useState('standard_admin');
  const [writers, setWriters] = useState([
    { 
      name: sessionUser?.name || 'Primary Songwriter', 
      role: 'Composer / Author', 
      pro: 'MCSK (Kenya)', 
      share_pct: 60.0, 
      cae_ipi: '00892716382' 
    },
    { 
      name: 'Marcus Vance', 
      role: 'Arranger / Producer', 
      pro: 'BMI (USA)', 
      share_pct: 40.0, 
      cae_ipi: '00984726154' 
    }
  ]);
  const [selectedSocieties, setSelectedSocieties] = useState([
    'ascap', 'bmi', 'the_mlc', 'mcsk', 'samro', 'prs_for_music', 'amra'
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalShare = writers.reduce((acc, w) => acc + (Number(w.share_pct) || 0), 0);

  const handleAddWriter = () => {
    setWriters(prev => [
      ...prev,
      { name: '', role: 'Co-Writer', pro: 'ASCAP (USA)', share_pct: 0, cae_ipi: '' }
    ]);
  };

  const handleRemoveWriter = (index) => {
    if (writers.length <= 1) return;
    setWriters(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateWriter = (index, field, value) => {
    setWriters(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a title for the musical composition.');
      return;
    }

    if (Math.abs(totalShare - 100.0) > 0.05) {
      setError(`Writer shares must total exactly 100.0%. Current total: ${totalShare.toFixed(1)}%`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        iswc: customIswc.trim() || undefined,
        isrc_recording: isrcRecording.trim() || undefined,
        genre,
        duration,
        writers: writers.map(w => ({
          name: w.name.trim() || 'Co-Writer',
          role: w.role,
          pro: w.pro.split(' ')[0],
          share_pct: parseFloat(w.share_pct),
          cae_ipi: w.cae_ipi.trim() || undefined
        })),
        publisher_share_pct: 50.0,
        composer_share_pct: 50.0,
        selected_societies: selectedSocieties,
        election_tier: electionTier
      };

      const res = await publishingApi.registerWork(payload);
      if (res && res.work) {
        if (typeof onWorkRegistered === 'function') {
          onWorkRegistered(res.work);
        }
        onClose();
      }
    } catch (err) {
      setError(err?.message || 'Failed to register work with global collection network.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d111c',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#f8fafc',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.05) 0%, transparent 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '3px',
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan, #22d3ee)'
            }}>
              <RiBookOpenFill size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Register Musical Composition</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Automated ISWC assignment, 50/50 publisher/writer clearance & CWR delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '12px 16px',
              borderRadius: '3px',
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {/* Basic Composition Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Composition Work Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Serengeti Neon Sunrise"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Identifiers & Recording Match */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                ISWC (Leave blank for automated generation)
              </label>
              <input
                type="text"
                placeholder="T-345.987.123-1"
                value={customIswc}
                onChange={(e) => setCustomIswc(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '10px 12px',
                  color: '#22d3ee',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Associated Master ISRC (Recording Match)
              </label>
              <input
                type="text"
                value={isrcRecording}
                onChange={(e) => setIsrcRecording(e.target.value)}
                style={{
                  width: '100%',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '10px 12px',
                  color: '#34d399',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Writers Splits Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid #1e293b',
            borderRadius: '3px',
            padding: '18px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Songwriter & Composer Splits (Composer Share: 50%)</span>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Writers share the 50% Writer's Pool. Total must equal 100.0%.
                </p>
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: Math.abs(totalShare - 100.0) < 0.05 ? '#10b981' : '#f87171',
                background: Math.abs(totalShare - 100.0) < 0.05 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '4px 10px',
                borderRadius: '3px'
              }}>
                Total: {totalShare.toFixed(1)}% / 100%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {writers.map((writer, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr 40px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Writer Legal Name"
                    value={writer.name}
                    onChange={(e) => handleUpdateWriter(idx, 'name', e.target.value)}
                    style={{
                      background: '#161e2e',
                      border: '1px solid #2d3748',
                      borderRadius: '3px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Composer)"
                    value={writer.role}
                    onChange={(e) => handleUpdateWriter(idx, 'role', e.target.value)}
                    style={{
                      background: '#161e2e',
                      border: '1px solid #2d3748',
                      borderRadius: '3px',
                      padding: '8px 10px',
                      color: '#cbd5e1',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <select
                    value={writer.pro}
                    onChange={(e) => handleUpdateWriter(idx, 'pro', e.target.value)}
                    style={{
                      background: '#161e2e',
                      border: '1px solid #2d3748',
                      borderRadius: '3px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  >
                    {POPULAR_PROS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="CAE / IPI #"
                    value={writer.cae_ipi}
                    onChange={(e) => handleUpdateWriter(idx, 'cae_ipi', e.target.value)}
                    style={{
                      background: '#161e2e',
                      border: '1px solid #2d3748',
                      borderRadius: '3px',
                      padding: '8px 10px',
                      color: '#94a3b8',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={writer.share_pct}
                      onChange={(e) => handleUpdateWriter(idx, 'share_pct', e.target.value)}
                      style={{
                        width: '100%',
                        background: '#161e2e',
                        border: '1px solid #2d3748',
                        borderRadius: '3px',
                        padding: '8px 8px',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 700,
                        textAlign: 'right',
                        outline: 'none'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveWriter(idx)}
                    disabled={writers.length <= 1}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: writers.length <= 1 ? '#475569' : '#ef4444',
                      cursor: writers.length <= 1 ? 'not-allowed' : 'pointer',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <RiDeleteBinLine size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddWriter}
              style={{
                marginTop: '12px',
                background: 'rgba(34, 211, 238, 0.08)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                color: 'var(--cyan, #22d3ee)',
                padding: '6px 12px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiAddLine size={14} /> Add Co-Writer
            </button>
          </div>

          {/* Publisher Share & Administration Terms */}
          <div style={{
            background: 'rgba(34, 211, 238, 0.03)',
            border: '1px solid rgba(34, 211, 238, 0.15)',
            borderRadius: '3px',
            padding: '16px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--cyan, #22d3ee)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Administering Publisher
              </span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                TuneMavens Global Publishing (ASCAP 928371)
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                50% Publisher's share administered globally across 155+ PRO societies.
              </p>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--cyan, #22d3ee)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Administration Mode
              </span>
              <select
                value={electionTier}
                onChange={(e) => setElectionTier(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#161e2e',
                  border: '1px solid #2d3748',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              >
                <option value="standard_admin">Standard Admin (10% Admin Fee, You keep 90%)</option>
                <option value="full_service_copub">Full-Service Co-Publishing (Active Pitching & Sync)</option>
                <option value="catalogue_acquisition">Catalogue Advance / Senior Facility</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #334155',
                color: '#94a3b8',
                padding: '10px 20px',
                borderRadius: '3px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                color: '#fff',
                padding: '10px 24px',
                borderRadius: '3px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {submitting ? 'Registering with PROs...' : 'Register Composition & Clear CWR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
