import React, { useState, useEffect } from 'react';
import {
  RiSparklingFill,
  RiCheckFill,
  RiCloseFill,
  RiUserFill,
  RiMicFill,
  RiDiscFill,
  RiMusic2Fill,
  RiEqualizerFill,
  RiHeart3Fill,
  RiCompass3Fill
} from 'react-icons/ri';

export const AUTHORITATIVE_CREATORS_FOR_TASTE = [
  { id: 'ndufo', name: 'Ndufo', role: 'Artist / Producer', genre: 'Afro-House & Live Modular', avatar: '/heroes/ndufo_hero_slide1_retina.jpg' },
  { id: 'zawadi_kofi', name: 'Zawadi Kiprop & Kofi Mensah', role: 'Podcaster', genre: 'Music Business & Creator Tech', avatar: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg' },
  { id: 'dj_kalonje', name: 'DJ Kalonje', role: 'DJ / Turntablist', genre: 'Afro-Fusion & Arena Club Mix', avatar: '/heroes/hero_music_1.png' },
  { id: 'amina_mwangi', name: 'Amina Mwangi', role: 'Artist / Vocalist', genre: 'Afro-Soul & R&B Vocals', avatar: '/heroes/hero_music_1.png' },
  { id: 'dj_dlite', name: 'DJ D-Lite', role: 'DJ / Producer', genre: 'Amapiano & Swahili Coast', avatar: '/heroes/hero_music_3.png' },
  { id: 'alex_rivera', name: 'Alex Rivera', role: 'Producer / Engineer', genre: 'Mastering & Studio Tech', avatar: '/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg' },
  { id: 'steve_biko', name: 'Steve Biko & Dr. Chen', role: 'Podcaster', genre: 'AfroTech & Venture Capital', avatar: '/heroes/hero_music_2.png' },
  { id: 'brian_omondi', name: 'Brian Omondi & Faith Waweru', role: 'Podcaster', genre: 'Nairobi Beats Weekly', avatar: '/heroes/hero_music_1.png' },
  { id: 'kibera_sound', name: 'Kibera Sound System', role: 'Artist / Collective', genre: 'Gengetone & Sheng Drill', avatar: '/heroes/hero_music_3.png' },
  { id: 'sauti_juma', name: 'Sauti Juma', role: 'Artist / Songwriter', genre: 'Acoustic Neo-Soul', avatar: '/heroes/hero_music_2.png' },
  { id: 'elena_richter', name: 'Elena Richter', role: 'Sync Supervisor / Composer', genre: 'Film & TV Cues', avatar: '/heroes/hero_music_2.png' },
  { id: 'dj_sola', name: 'DJ Sola', role: 'DJ / Selector', genre: 'Cyberwave & Night Sessions', avatar: '/heroes/hero_music_1.png' }
];

export const GENRES_LIST = [
  'Afrobeat', 'Amapiano', 'Sheng Drill', 'Gengetone', 'Bongo Flava',
  'Afro-House', 'R&B / Soul', 'Neo-Soul', 'Music Business Podcasts',
  'Hip-Hop', 'Electronic Club', 'Audio Engineering'
];

export const VIBES_LIST = [
  { id: 'dance', label: 'Party & Dancefloor Energy', desc: 'High-BPM club transitions, log-drums, and upbeat afro-fusion.' },
  { id: 'chill', label: 'Chill & Relaxed Soul', desc: 'Intimate acoustics, neo-R&B vocals, and laid-back ambient pads.' },
  { id: 'focus', label: 'Late Night Focus & Flow', desc: 'Instrumental modular rhythms, lo-fi beats, and lossless clarity.' },
  { id: 'masterclass', label: 'Deep Audio Masterclass', desc: 'Music industry podcasts, stem breakdowns, and engineering roundtables.' }
];

export default function OnboardingTasteModal({
  isOpen,
  onClose,
  onSavePreferences,
  initialPreferences
}) {
  const [selectedCreators, setSelectedCreators] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunestream_user_interests') || '{}');
      return saved.creators || ['ndufo', 'zawadi_kofi', 'dj_kalonje'];
    } catch {
      return ['ndufo', 'zawadi_kofi', 'dj_kalonje'];
    }
  });

  const [selectedGenres, setSelectedGenres] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunestream_user_interests') || '{}');
      return saved.genres || ['Afrobeat', 'Amapiano'];
    } catch {
      return ['Afrobeat', 'Amapiano'];
    }
  });

  const [selectedVibe, setSelectedVibe] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunestream_user_interests') || '{}');
      return saved.vibe || 'chill';
    } catch {
      return 'chill';
    }
  });

  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const toggleCreator = (creatorId) => {
    setSelectedCreators(prev => {
      if (prev.includes(creatorId)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(id => id !== creatorId);
      } else {
        return [...prev, creatorId];
      }
    });
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        if (prev.length <= 1) return prev;
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  const handleSave = () => {
    const preferences = {
      creators: selectedCreators,
      genres: selectedGenres,
      vibe: selectedVibe,
      updated_at: new Date().toISOString()
    };
    try {
      localStorage.setItem('tunestream_user_interests', JSON.stringify(preferences));
      localStorage.setItem('tunestream_listener_onboarding', JSON.stringify(preferences));
    } catch (_) {}

    if (typeof onSavePreferences === 'function') {
      onSavePreferences(preferences);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2, 6, 18, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: '#070c1a',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(7, 12, 26, 0.98) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#00f2fe', background: 'rgba(0,242,254,0.12)', border: '1px solid rgba(0,242,254,0.3)', padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                <RiSparklingFill style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Taste Personalization
              </span>
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                ● 24-Bit / 96kHz Lossless Daily Mix Generator
              </span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>
              Tailor Your Daily Stream &amp; Crate Recommendations
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>

        {/* Step Navigation Pills */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#050914' }}>
          {[
            { step: 1, label: `1. Preferred Creators (${selectedCreators.length})`, icon: RiUserFill },
            { step: 2, label: `2. Favorite Genres (${selectedGenres.length})`, icon: RiMusic2Fill },
            { step: 3, label: '3. Listening Vibe', icon: RiCompass3Fill }
          ].map(s => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              style={{
                flex: 1,
                padding: '12px 14px',
                background: activeStep === s.step ? 'rgba(0,240,255,0.12)' : 'transparent',
                border: 'none',
                borderBottom: activeStep === s.step ? '2px solid #00f2fe' : '2px solid transparent',
                color: activeStep === s.step ? '#00f2fe' : '#94a3b8',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <s.icon size={14} /> {s.label}
            </button>
          ))}
        </div>

        {/* Modal Scroll Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* STEP 1: PREFERRED CREATORS */}
          {activeStep === 1 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  Select the Creators, Artists, Podcasters &amp; DJs You Prefer
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                  TuneStream seeds your daily personalized crate, offline sync queue, and creator tips from these selections.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '12px'
              }}>
                {AUTHORITATIVE_CREATORS_FOR_TASTE.map(creator => {
                  const isSelected = selectedCreators.includes(creator.id);
                  return (
                    <div
                      key={creator.id}
                      onClick={() => toggleCreator(creator.id)}
                      style={{
                        padding: '12px 14px',
                        background: isSelected ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        onError={(e) => { e.currentTarget.src = '/heroes/hero_music_1.png'; }}
                        style={{ width: '42px', height: '42px', borderRadius: '3px', objectFit: 'cover', border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {creator.name}
                          </span>
                          <span style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '3px',
                            background: isSelected ? '#00f2fe' : 'rgba(255,255,255,0.08)',
                            color: '#060813',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 900
                          }}>
                            {isSelected ? '✓' : '+'}
                          </span>
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#00f2fe', fontWeight: 700, marginTop: '2px' }}>
                          {creator.role}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {creator.genre}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: FAVORITE GENRES */}
          {activeStep === 2 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  Choose Your Preferred Rhythms &amp; Audio Categories
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                  We prioritize lossless stems, uncompressed masters, and fresh releases in these genres.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {GENRES_LIST.map(g => {
                  const isSelected = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '3px',
                        fontSize: '13px',
                        fontWeight: isSelected ? 800 : 600,
                        background: isSelected ? '#00f2fe' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                        color: isSelected ? '#060813' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '}{g}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: LISTENING VIBE */}
          {activeStep === 3 && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                  Select Your Dominant Listening Vibe
                </h4>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0 }}>
                  Controls the tempo curvature and audio EQ balance of your background streams.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                {VIBES_LIST.map(v => {
                  const isSelected = selectedVibe === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVibe(v.id)}
                      style={{
                        padding: '16px',
                        background: isSelected ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                        border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isSelected ? '#10b981' : '#fff' }}>
                          {v.label}
                        </span>
                        <span style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: isSelected ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
                          background: isSelected ? '#fff' : 'transparent'
                        }} />
                      </div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
                        {v.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: '#050914',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <span>{selectedCreators.length} Creators</span> • <span>{selectedGenres.length} Genres</span> • <span style={{ textTransform: 'capitalize' }}>{selectedVibe} Vibe</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev - 1)}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '3px',
                  color: '#cbd5e1',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                &larr; Back
              </button>
            )}

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => prev + 1)}
                style={{
                  padding: '10px 20px',
                  background: '#00f2fe',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#060813',
                  fontSize: '12.5px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Next Step &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '10px 24px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#040711',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.3)'
                }}
              >
                <RiCheckFill size={16} /> Save Taste Profile &amp; Generate Mix
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
