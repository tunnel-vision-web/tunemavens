import React, { useState } from 'react'
import {
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiFileTextLine,
  RiSparklingLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiShieldCheckFill,
  RiAddLine,
  RiBuilding4Line,
  RiFilmLine,
  RiFolderMusicLine
} from 'react-icons/ri'
import './SyncMarketplace.css'

const GENRE_OPTIONS = [
  'Afrobeats',
  'Cinematic Orchestral',
  'Synthwave / Cyberpunk',
  'Amapiano',
  'Indie Pop / Folk',
  'East African Trap',
  'Gqom / Dark Techno',
  'Taarab Chillhop',
  'Neo-Soul / R&B',
  'Ambient / Soundscape'
];

const MOOD_OPTIONS = [
  'Action / High Stakes',
  'Tension / Suspense',
  'Uplifting / Triumphant',
  'Melancholic / Emotional',
  'Sunset / Golden Hour',
  'Euphoric / Club',
  'Dark / Gritty',
  'Chill / Relaxed'
];

export default function SyncBriefCreationWizard({
  isOpen,
  onClose,
  sessionUser,
  onBriefCreated
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    production_house: '',
    initiative_type: 'Feature Film / Theatrical',
    supervisor_name: sessionUser?.name || 'Studio Supervisor',
    required_genres: ['Cinematic Orchestral', 'Afrobeats'],
    required_moods: ['Action / High Stakes', 'Uplifting / Triumphant'],
    target_bpm: 120,
    vocal_preference: 'Instrumental & Vocal Options',
    synopsis: '',
    reference_tracks: '',
    budget_fee: 10000,
    deadline_days: 7,
    deliverables: ['Broadcast Master 24-bit/48kHz WAV', 'Full Multitrack Stems', 'Instrumental Cutdown'],
    is_exclusive: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBrief, setCreatedBrief] = useState(null);

  const toggleGenre = (genre) => {
    setFormData(prev => {
      const exists = prev.required_genres.includes(genre);
      return {
        ...prev,
        required_genres: exists
          ? prev.required_genres.filter(g => g !== genre)
          : [...prev.required_genres, genre]
      };
    });
  };

  const toggleMood = (mood) => {
    setFormData(prev => {
      const exists = prev.required_moods.includes(mood);
      return {
        ...prev,
        required_moods: exists
          ? prev.required_moods.filter(m => m !== mood)
          : [...prev.required_moods, mood]
      };
    });
  };

  const calculateWaterfall = () => {
    const total = Number(formData.budget_fee) || 0;
    const creatorShare = Math.round(total * 0.90);
    const platformShare = total - creatorShare;
    return { total, creatorShare, platformShare };
  };

  const { total, creatorShare, platformShare } = calculateWaterfall();

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBriefId = `brief_custom_${Date.now()}`;
      const now = new Date();
      const deadlineDate = new Date(now.getTime() + formData.deadline_days * 24 * 60 * 60 * 1000);

      const newBrief = {
        id: newBriefId,
        title: formData.title || 'Untitled Commercial Sync Project',
        client: formData.client || 'Independent Production Co',
        production_house: formData.production_house || 'East African Screen Arts',
        budget_fee: total,
        currency: 'USD',
        required_genres: formData.required_genres.length > 0 ? formData.required_genres : ['Afrobeats'],
        required_moods: formData.required_moods.length > 0 ? formData.required_moods : ['Uplifting'],
        target_bpm: Number(formData.target_bpm) || 120,
        duration_needed: 'Full Track + 30s & 60s Cutdowns',
        deadline_date: `In ${formData.deadline_days} days`,
        deadline_iso: deadlineDate.toISOString(),
        status: 'ACTIVE',
        urgency: formData.deadline_days <= 3 ? 'critical' : formData.deadline_days <= 7 ? 'medium' : 'low',
        synopsis: formData.synopsis || 'Original high-energy sync placement required for broadcast media.',
        reference_tracks: formData.reference_tracks || 'East African cinematic reference',
        pitches_count: 0,
        creator_split_promise: `90% Gross ($${creatorShare.toLocaleString()} via TuneLedger Cascade)`
      };

      setCreatedBrief(newBrief);
      setIsSubmitting(false);
      setStep(4);
      if (onBriefCreated) {
        onBriefCreated(newBrief);
      }
    }, 900);
  };

  return (
    <div className="sync-wizard-overlay" onClick={onClose}>
      <div
        className="sync-wizard-modal"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sync-wizard-header">
          <div className="sync-wizard-title-group">
            <span className="sync-wizard-badge" style={{ background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee' }}>
              <RiFilmLine /> MUSIC SUPERVISOR PORTAL
            </span>
            <h2 className="sync-wizard-title">Post New Sync Opportunity / Brief</h2>
            <p className="sync-wizard-subtitle">
              Publish directly to verified Kenyan & East African creators with guaranteed 100% one-stop master clearance.
            </p>
          </div>
          <button className="sync-wizard-close-btn" onClick={onClose} aria-label="Close">
            <RiCloseLine />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="sync-wizard-stepper">
          {[
            { num: 1, label: '1. Production Scope' },
            { num: 2, label: '2. Creative Direction' },
            { num: 3, label: '3. Terms & 90/10 Budget' },
            { num: 4, label: '4. Published Brief' }
          ].map(s => (
            <div
              key={s.num}
              className={`sync-wizard-step-node ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
            >
              <div className="sync-step-circle">
                {step > s.num ? <RiCheckLine /> : s.num}
              </div>
              <span className="sync-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="sync-wizard-body">
          {/* STEP 1: PRODUCTION SCOPE */}
          {step === 1 && (
            <div className="sync-wizard-step-content">
              <div className="sync-section-title">Production & Project Identification</div>
              <p className="sync-section-desc">
                Define the initiative details so creators can immediately gauge the prestige and context of the opportunity.
              </p>

              <div className="sync-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="sync-input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="sync-input-label">Project Title / Initiative Name *</label>
                  <input
                    type="text"
                    className="sync-text-input"
                    placeholder="e.g. Serengeti High - S02 Climax Sequence, Safaricom Brand Anthem 2027"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Client / Brand / Studio *</label>
                  <input
                    type="text"
                    className="sync-text-input"
                    placeholder="e.g. Netflix, Ogilvy Africa, BBC Studios"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Production Company / Agency</label>
                  <input
                    type="text"
                    className="sync-text-input"
                    placeholder="e.g. Silverback Films, Dentsu Creative Nairobi"
                    value={formData.production_house}
                    onChange={(e) => setFormData({ ...formData, production_house: e.target.value })}
                  />
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Initiative Type</label>
                  <select
                    className="sync-text-input"
                    value={formData.initiative_type}
                    onChange={(e) => setFormData({ ...formData, initiative_type: e.target.value })}
                  >
                    <option value="Feature Film / Theatrical">Feature Film / Theatrical</option>
                    <option value="Episodic TV / Streaming Series">Episodic TV / Streaming Series</option>
                    <option value="Commercial / Brand Campaign">Commercial / Brand Campaign</option>
                    <option value="Video Game / Interactive Audio">Video Game / Interactive Audio</option>
                    <option value="Documentary / Natural History">Documentary / Natural History</option>
                    <option value="Podcast / Digital Web Series">Podcast / Digital Web Series</option>
                  </select>
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Music Supervisor / Contact</label>
                  <input
                    type="text"
                    className="sync-text-input"
                    value={formData.supervisor_name}
                    onChange={(e) => setFormData({ ...formData, supervisor_name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CREATIVE DIRECTION */}
          {step === 2 && (
            <div className="sync-wizard-step-content">
              <div className="sync-section-title">Creative & Musical Sonic Direction</div>
              <p className="sync-section-desc">
                Give creators precise sonic guardrails. Our AI matching engine ranks tracks based on these tags.
              </p>

              <div style={{ marginTop: '16px' }}>
                <label className="sync-input-label">Select Required Genres (Choose 1 or more)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {GENRE_OPTIONS.map(g => {
                    const active = formData.required_genres.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        style={{
                          background: active ? '#22d3ee' : 'rgba(255,255,255,0.05)',
                          color: active ? '#090e1f' : '#cbd5e1',
                          border: active ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '3px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: active ? '700' : '500',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {active && '✓ '} {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: '18px' }}>
                <label className="sync-input-label">Select Mood & Emotion Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {MOOD_OPTIONS.map(m => {
                    const active = formData.required_moods.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMood(m)}
                        style={{
                          background: active ? '#a855f7' : 'rgba(255,255,255,0.05)',
                          color: active ? '#ffffff' : '#cbd5e1',
                          border: active ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '3px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: active ? '700' : '500',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {active && '✓ '} {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sync-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '18px' }}>
                <div className="sync-input-group">
                  <label className="sync-input-label">Target Tempo (BPM): {formData.target_bpm} BPM</label>
                  <input
                    type="range"
                    min="60"
                    max="175"
                    step="1"
                    className="sync-slider"
                    style={{ width: '100%', marginTop: '8px', accentColor: '#22d3ee' }}
                    value={formData.target_bpm}
                    onChange={(e) => setFormData({ ...formData, target_bpm: e.target.value })}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <span>60 BPM (Slow Ballad)</span>
                    <span>120 BPM (Dance / Groove)</span>
                    <span>175 BPM (Fast Action)</span>
                  </div>
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Vocal Preference</label>
                  <select
                    className="sync-text-input"
                    value={formData.vocal_preference}
                    onChange={(e) => setFormData({ ...formData, vocal_preference: e.target.value })}
                  >
                    <option value="Instrumental Only (No Vocals)">Instrumental Only (No Vocals)</option>
                    <option value="Lead Vocal + Clean Instrumental Delivery">Lead Vocal + Clean Instrumental Delivery</option>
                    <option value="Female Vocals Preferred">Female Vocals Preferred</option>
                    <option value="Male Vocals Preferred">Male Vocals Preferred</option>
                    <option value="Vocal Chants / Swahili / Traditional Phrases">Vocal Chants / Swahili / Traditional</option>
                    <option value="Any / Open to Suggestions">Any / Open to Suggestions</option>
                  </select>
                </div>

                <div className="sync-input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="sync-input-label">Scene Synopsis & Story Context</label>
                  <textarea
                    className="sync-text-input"
                    rows="3"
                    placeholder="Describe the scene: pacing, emotional inflection point, dialogue presence, in/out beat cues..."
                    value={formData.synopsis}
                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  />
                </div>

                <div className="sync-input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="sync-input-label">Reference Tracks & Sonic Influences</label>
                  <input
                    type="text"
                    className="sync-text-input"
                    placeholder="e.g. Kendrick Lamar, Black Panther Soundtrack, Burna Boy, Hans Zimmer"
                    value={formData.reference_tracks}
                    onChange={(e) => setFormData({ ...formData, reference_tracks: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TERMS & 90/10 WATERFALL BUDGET */}
          {step === 3 && (
            <div className="sync-wizard-step-content">
              <div className="sync-section-title">Compensation & Waterfall Terms</div>
              <p className="sync-section-desc">
                TuneMavens protects both supervisor clearance integrity and creator royalty fairness with our transparent 90/10 model.
              </p>

              <div className="sync-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="sync-input-group">
                  <label className="sync-input-label">Total Sync Placement Budget (USD) *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#22d3ee', fontWeight: 'bold' }}>$</span>
                    <input
                      type="number"
                      min="500"
                      step="250"
                      className="sync-text-input"
                      style={{ paddingLeft: '28px' }}
                      value={formData.budget_fee}
                      onChange={(e) => setFormData({ ...formData, budget_fee: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sync-input-group">
                  <label className="sync-input-label">Pitch Submission Window</label>
                  <select
                    className="sync-text-input"
                    value={formData.deadline_days}
                    onChange={(e) => setFormData({ ...formData, deadline_days: Number(e.target.value) })}
                  >
                    <option value={2}>48 Hours (Urgent Rush Cue)</option>
                    <option value={5}>5 Days (Fast Commercial Turnaround)</option>
                    <option value={7}>7 Days (Standard Broadcast Week)</option>
                    <option value={14}>14 Days (Feature / Episodic Arc)</option>
                    <option value={30}>30 Days (Open Call Season)</option>
                  </select>
                </div>
              </div>

              {/* 90/10 Waterfall Visual Breakdown */}
              <div style={{
                marginTop: '20px',
                padding: '16px 20px',
                background: 'rgba(34, 211, 238, 0.05)',
                border: '1px solid rgba(34, 211, 238, 0.25)',
                borderRadius: '3px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>
                  <RiMoneyDollarCircleLine style={{ fontSize: '18px' }} />
                  <span>TRANSPARENT TUNELEDGER WATERFALL SPLIT</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Creator Placement Payout (90%)
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                      ${creatorShare.toLocaleString()} USD
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      Dispatched instantly via M-Pesa / Bank Wire upon license signing.
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      TuneMavens Clearance Escrow (10%)
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#cbd5e1', marginTop: '4px' }}>
                      ${platformShare.toLocaleString()} USD
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                      Covers 100% legal indemnity, cue sheet registration, & stems delivery.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', fontSize: '12px', color: '#10b981' }}>
                  <RiShieldCheckFill />
                  <span>Zero upfront posting fee. Funds are only placed into escrow once you approve a track.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS / PUBLISHED BRIEF */}
          {step === 4 && createdBrief && (
            <div className="sync-wizard-step-content" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 16px auto'
              }}>
                <RiCheckLine />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                Sync Brief Live in Marketplace!
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '520px', margin: '0 auto 24px auto' }}>
                Your brief <strong>"{createdBrief.title}"</strong> is now live to all verified Kenyan and international producers. Track submissions will appear in your Project Bins in real time.
              </p>

              {/* Brief Summary Box */}
              <div style={{
                background: '#090e1f',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '3px',
                padding: '20px',
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto 24px auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 'bold' }}>BRIEF ID: {createdBrief.id}</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '2px 0 0 0' }}>{createdBrief.title}</h4>
                  </div>
                  <span style={{ background: '#10b981', color: '#090e1f', fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '3px' }}>
                    ACTIVE BRIEF
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Client:</span> <strong style={{ color: '#cbd5e1' }}>{createdBrief.client}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Placement Fee:</span> <strong style={{ color: '#22d3ee' }}>${createdBrief.budget_fee.toLocaleString()} USD</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Target BPM:</span> <strong style={{ color: '#cbd5e1' }}>{createdBrief.target_bpm} BPM</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Deadline:</span> <strong style={{ color: '#eab308' }}>{createdBrief.deadline_date}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Required Genres:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {createdBrief.required_genres.map(g => (
                      <span key={g} style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', color: '#cbd5e1' }}>
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="sync-primary-btn"
                style={{ padding: '12px 28px', fontSize: '14px' }}
                onClick={onClose}
              >
                Done / Return to Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        {step < 4 && (
          <div className="sync-wizard-footer">
            {step > 1 ? (
              <button
                type="button"
                className="sync-secondary-btn"
                onClick={() => setStep(step - 1)}
              >
                <RiArrowLeftLine /> Back
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="sync-secondary-btn"
                onClick={onClose}
              >
                Cancel
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  className="sync-primary-btn"
                  disabled={step === 1 && !formData.title.trim()}
                  onClick={() => setStep(step + 1)}
                >
                  Continue <RiArrowRightLine />
                </button>
              ) : (
                <button
                  type="button"
                  className="sync-primary-btn"
                  disabled={isSubmitting || !formData.budget_fee}
                  onClick={handlePublish}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Brief to Creators'} <RiSparklingLine />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
