import React, { useState } from 'react'
import {
  RiShieldCheckFill,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiSmartphoneFill,
  RiBankCardFill,
  RiDownload2Line,
  RiFileList3Line,
  RiCheckboxCircleFill,
  RiFlashlightLine,
  RiBuilding4Fill,
  RiMovieLine,
  RiGlobalLine,
  RiCoinsFill,
  RiMusicFill
} from 'react-icons/ri'
import './SyncMarketplace.css'

export default function SyncLicensingAcquisitionWizard({
  isOpen,
  onClose,
  track,
  sessionUser,
  onLicenseExecuted,
  onAddToBin
}) {
  if (!isOpen || !track) return null;

  const [step, setStep] = useState(1); // 1: Scope, 2: Rights, 3: Quote, 4: Checkout, 5: Deliverables

  // Step 1: Project Scope
  const [projectTitle, setProjectTitle] = useState('Untitled Feature / Commercial');
  const [initiativeType, setInitiativeType] = useState('tv_series');
  const [productionCompany, setProductionCompany] = useState(sessionUser?.brand_name || 'Horizon Studios Africa');
  const [supervisorName, setSupervisorName] = useState(sessionUser?.name || 'Verified Supervisor');
  const [supervisorEmail, setSupervisorEmail] = useState(sessionUser?.email || 'supervisor@studios.com');

  // Step 2: Rights & Scope
  const [mediaRights, setMediaRights] = useState('all_media');
  const [territory, setTerritory] = useState('worldwide');
  const [term, setTerm] = useState('perpetuity');
  const [usageType, setUsageType] = useState('featured_scene');

  // Step 4: Payment
  const [paymentRail, setPaymentRail] = useState('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('+254712345678');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [stkPromptSent, setStkPromptSent] = useState(false);

  // Step 5: Deliverables & Certificate
  const [licenseCert, setLicenseCert] = useState(null);

  // Dynamic fee calculation
  const calculateTotalFee = () => {
    let base = track.pricing?.[initiativeType] || 1200;
    if (territory === 'worldwide') base *= 1.25;
    if (term === 'perpetuity') base *= 1.2;
    if (usageType === 'main_theme') base *= 1.5;
    return Math.round(base);
  };

  const totalFee = calculateTotalFee();
  const platformAdminFee = Math.round(totalFee * 0.10);
  const creatorPayoutShare = totalFee - platformAdminFee;

  const handleNext = () => {
    setStep(s => Math.min(5, s + 1));
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const handleExecuteLicense = () => {
    setProcessingPayment(true);
    setStkPromptSent(true);

    setTimeout(() => {
      setProcessingPayment(false);
      const cert = {
        license_id: `SYNC-LIC-${Date.now().toString().slice(-6)}`,
        track_title: track.title,
        artist: track.artist,
        iswc: track.iswc || 'T-345.891.002-1',
        isrc: track.isrc || 'KEN922600101',
        project: projectTitle,
        licensee: productionCompany,
        supervisor: supervisorName,
        initiative_type: initiativeType,
        media_rights: mediaRights,
        territory,
        term,
        fee_paid: totalFee,
        creator_share: creatorPayoutShare,
        issued_at: new Date().toISOString()
      };
      setLicenseCert(cert);
      setStep(5);

      if (typeof onLicenseExecuted === 'function') {
        onLicenseExecuted(cert);
      }
    }, 1500);
  };

  return (
    <div className="sync-wizard-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sync-wizard-card" data-testid="sync-acquisition-wizard">
        {/* Header */}
        <div className="sync-wizard-header">
          <div>
            <span className="sync-wizard-eyebrow">Instant Sync Acquisition Protocol</span>
            <h3 className="sync-wizard-title">
              <RiMovieLine color="#22d3ee" /> License: "{track.title}" by {track.artist}
            </h3>
          </div>
          <button className="sync-wizard-close-btn" onClick={onClose} aria-label="Close wizard">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="sync-wizard-stepper">
          {[
            { num: 1, label: '1. Project Scope' },
            { num: 2, label: '2. Rights & Territory' },
            { num: 3, label: '3. Quote & Waterfall' },
            { num: 4, label: '4. Checkout & Escrow' },
            { num: 5, label: '5. Deliverables' },
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

        {/* Wizard Body Steps */}
        <div className="sync-wizard-body">
          {/* STEP 1: PROJECT SCOPE */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '3px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <img src={track.cover} alt={track.title} style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>{track.title}</strong>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{track.artist} · {track.genre} · {track.bpm} BPM</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 800 }}>✓ 100% Pre-Cleared One-Stop</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
                <div className="aff-modal-form-group">
                  <label>Project / Production Title *</label>
                  <input 
                    type="text" 
                    required 
                    value={projectTitle} 
                    onChange={e => setProjectTitle(e.target.value)}
                    placeholder="e.g. Shadows of Nairobi (Season 1)"
                    className="aff-modal-input"
                  />
                  <span className="aff-modal-hint">The film, series, commercial, or game title for the cue sheet.</span>
                </div>

                <div className="aff-modal-form-group">
                  <label>Initiative Category *</label>
                  <select 
                    value={initiativeType} 
                    onChange={e => setInitiativeType(e.target.value)}
                    className="aff-modal-select"
                  >
                    <option value="indie_film">Indie Feature / Documentary ($350+)</option>
                    <option value="tv_series">Streaming / TV Series Episode ($950+)</option>
                    <option value="commercial">Commercial Brand Flight ($1,800+)</option>
                    <option value="game_loop">Video Game / Interactive Media ($750+)</option>
                    <option value="broadcast_worldwide">Worldwide Major Studio Campaign ($3,200+)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="aff-modal-form-group">
                  <label>Production Entity / Agency *</label>
                  <input 
                    type="text" 
                    required 
                    value={productionCompany} 
                    onChange={e => setProductionCompany(e.target.value)}
                    placeholder="e.g. Film Studios Africa Ltd"
                    className="aff-modal-input"
                  />
                </div>

                <div className="aff-modal-form-group">
                  <label>Music Supervisor / Signee Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={supervisorName} 
                    onChange={e => setSupervisorName(e.target.value)}
                    placeholder="e.g. Jane Doe, Music Supervisor"
                    className="aff-modal-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RIGHTS & SCOPE */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="aff-modal-form-group">
                  <label>Media Rights Scope</label>
                  <select 
                    value={mediaRights} 
                    onChange={e => setMediaRights(e.target.value)}
                    className="aff-modal-select"
                  >
                    <option value="all_media">All Media (Theatrical, VOD, Streaming, TV, Web)</option>
                    <option value="tv_streaming">TV Broadcast &amp; OTT Streaming Only</option>
                    <option value="digital_social">Online / Social / Digital Web Flights</option>
                    <option value="festival_limited">Film Festival &amp; Limited Screenings</option>
                  </select>
                </div>

                <div className="aff-modal-form-group">
                  <label>Territory</label>
                  <select 
                    value={territory} 
                    onChange={e => setTerritory(e.target.value)}
                    className="aff-modal-select"
                  >
                    <option value="worldwide">Worldwide (Global Distribution)</option>
                    <option value="pan_african">Pan-African &amp; East Africa Regional</option>
                    <option value="domestic_kenya">Domestic Kenya Only</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="aff-modal-form-group">
                  <label>Duration of License (Term)</label>
                  <select 
                    value={term} 
                    onChange={e => setTerm(e.target.value)}
                    className="aff-modal-select"
                  >
                    <option value="perpetuity">In Perpetuity (Life of the Project)</option>
                    <option value="two_years">2 Years Standard</option>
                    <option value="one_year">1 Year Campaign Flight</option>
                  </select>
                </div>

                <div className="aff-modal-form-group">
                  <label>Scene Usage Type</label>
                  <select 
                    value={usageType} 
                    onChange={e => setUsageType(e.target.value)}
                    className="aff-modal-select"
                  >
                    <option value="featured_scene">Featured Scene / Background Source</option>
                    <option value="main_theme">Main Title Theme / Opening Credits</option>
                    <option value="end_credits">End Title Credits</option>
                    <option value="trailer_spot">Trailer / Promotional Cutdown</option>
                  </select>
                </div>
              </div>

              <div className="aff-action-notice-box">
                <RiShieldCheckFill size={20} color="#22d3ee" />
                <span>
                  Includes <strong>Full Master + Synchronization rights</strong> pre-cleared with zero third-party publisher delays. Multi-track WAV stems unlocked upon completion.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: QUOTE & WATERFALL TRANSPARENCY */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="sync-waterfall-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>Sync License Rate &amp; Compensation Waterfall</h4>
                  <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800 }}>Standard 90/10 Split Rule</span>
                </div>

                <div className="sync-waterfall-row">
                  <span style={{ color: '#94a3b8' }}>Base License Tier ({initiativeType.replace('_', ' ').toUpperCase()})</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>${track.pricing?.[initiativeType] || 1200}.00</span>
                </div>

                <div className="sync-waterfall-row">
                  <span style={{ color: '#94a3b8' }}>Territory &amp; Term Multipliers ({territory}, {term})</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>+${totalFee - (track.pricing?.[initiativeType] || 1200)}.00</span>
                </div>

                <div className="sync-waterfall-row total">
                  <span>Gross Synchronization Fee (Master + Sync)</span>
                  <span style={{ color: 'var(--cyan, #22d3ee)' }}>${totalFee.toLocaleString()}.00 USD</span>
                </div>

                <div className="sync-waterfall-row creator-split" style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px', borderRadius: '3px' }}>
                  <div>
                    <strong style={{ display: 'block' }}>Creator &amp; Label Net Disbursement (90.0%)</strong>
                    <span style={{ fontSize: '11px', color: '#6ee7b7' }}>Cascaded immediately to {track.artist} via TuneLedger</span>
                  </div>
                  <strong style={{ fontSize: '15px' }}>${creatorPayoutShare.toLocaleString()}.00</strong>
                </div>

                <div className="sync-waterfall-row" style={{ fontSize: '11.5px', color: '#64748b' }}>
                  <span>TuneMavens Administration &amp; DDEX Vault Fee (10.0%)</span>
                  <span>${platformAdminFee.toLocaleString()}.00</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                ✓ Zero catalog advances deducted. 100% of the mechanical, performance, and master royalties flow directly to the creator roster under our verified compensation-led waterfall.
              </div>
            </div>
          )}

          {/* STEP 4: CHECKOUT & ESCROW RAIL */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(34, 211, 238, 0.08)', padding: '14px', borderRadius: '3px', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase' }}>Amount Due in Escrow</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '2px 0 0' }}>${totalFee.toLocaleString()}.00 USD</h3>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#cbd5e1' }}>
                  <span>Master: <strong>"{track.title}"</strong></span>
                  <span style={{ display: 'block', color: '#94a3b8' }}>Licensee: {productionCompany}</span>
                </div>
              </div>

              {/* Payment Rail Select */}
              <div className="aff-modal-form-group">
                <label>Select Settlement Rail</label>
                <div className="aff-rail-selector-grid">
                  <div 
                    className={`aff-rail-card-option ${paymentRail === 'mpesa' ? 'selected' : ''}`}
                    onClick={() => setPaymentRail('mpesa')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>M-Pesa Express (Kenya STK)</strong>
                      <span>Direct Safaricom mobile prompt (KES equiv)</span>
                    </div>
                  </div>

                  <div 
                    className={`aff-rail-card-option ${paymentRail === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentRail('card')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>Credit / Debit Card (Stripe)</strong>
                      <span>Visa, Mastercard, Amex Global</span>
                    </div>
                  </div>

                  <div 
                    className={`aff-rail-card-option ${paymentRail === 'wire' ? 'selected' : ''}`}
                    onClick={() => setPaymentRail('wire')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>Bank Wire (EFT / RTGS)</strong>
                      <span>Corporate studio procurement invoice</span>
                    </div>
                  </div>
                </div>
              </div>

              {paymentRail === 'mpesa' && (
                <div className="aff-modal-form-group">
                  <label>M-Pesa Mobile Number for STK Push Prompt</label>
                  <input 
                    type="text" 
                    value={mpesaPhone} 
                    onChange={e => setMpesaPhone(e.target.value)}
                    placeholder="+254712345678"
                    className="aff-modal-input"
                  />
                  <span className="aff-modal-hint">A secure STK prompt will appear on this handset to authorize escrow deposit.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: DELIVERABLES & CERTIFICATE */}
          {step === 5 && licenseCert && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="aff-success-inner-card" style={{ padding: '10px 0' }}>
                <RiCheckboxCircleFill size={52} color="#10b981" />
                <h4 style={{ margin: '10px 0 4px', fontSize: '22px' }}>Synchronization License Executed!</h4>
                <p style={{ margin: 0 }}>
                  License <strong>{licenseCert.license_id}</strong> is officially registered. Broadcast WAV master and multitrack stems are unlocked for production download.
                </p>
              </div>

              {/* Certificate Summary */}
              <div style={{ background: '#060813', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '3px', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px' }}>
                <div><span style={{ color: '#64748b' }}>License ID:</span> <strong style={{ color: '#fff' }}>{licenseCert.license_id}</strong></div>
                <div><span style={{ color: '#64748b' }}>Project:</span> <strong style={{ color: '#fff' }}>{licenseCert.project}</strong></div>
                <div><span style={{ color: '#64748b' }}>Track / ISRC:</span> <strong style={{ color: '#22d3ee' }}>{licenseCert.track_title} ({licenseCert.isrc})</strong></div>
                <div><span style={{ color: '#64748b' }}>Licensee:</span> <strong style={{ color: '#fff' }}>{licenseCert.licensee}</strong></div>
                <div><span style={{ color: '#64748b' }}>Territory / Term:</span> <strong style={{ color: '#fff' }}>{licenseCert.territory.toUpperCase()} / {licenseCert.term.toUpperCase()}</strong></div>
                <div><span style={{ color: '#64748b' }}>Fee Settled:</span> <strong style={{ color: '#10b981' }}>${licenseCert.fee_paid.toLocaleString()} USD (100% Escrow Funded)</strong></div>
              </div>

              {/* Master Deliverables Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                <a 
                  href={track.audio_url} 
                  download={`${track.title}_Broadcast_Master_24bit_48kHz.mp3`}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'var(--cyan, #22d3ee)', color: '#060813', fontWeight: 800, textDecoration: 'none', borderRadius: '3px' }}
                >
                  <RiDownload2Line size={18} /> Download Broadcast Master WAV (24-bit / 48kHz)
                </a>

                <button 
                  type="button" 
                  onClick={() => alert(`Multi-Track Stems Archive generated!\nIncludes:\n- ${track.stems_available.join('\n- ')}\nStarting download...`)}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px' }}
                >
                  <RiMusicFill size={16} /> Download Multi-Track Stems Archive (.zip)
                </button>

                <button 
                  type="button" 
                  onClick={() => alert(`Official Sync Clearance Certificate #${licenseCert.license_id}\nCountersigned by: TuneMavens Publishing Administrator & ${licenseCert.supervisor}\nValid for worldwide broadcast.`)}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px' }}
                >
                  <RiFileList3Line size={16} /> Download PDF License Agreement &amp; Receipt
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="sync-wizard-footer">
          {step > 1 && step < 5 ? (
            <button type="button" className="aff-btn-secondary" onClick={handleBack} disabled={processingPayment}>
              <RiArrowLeftLine /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button type="button" className="aff-btn-submit-primary" onClick={handleNext}>
              Continue <RiArrowRightLine />
            </button>
          )}

          {step === 4 && (
            <button 
              type="button" 
              className="aff-btn-submit-primary" 
              onClick={handleExecuteLicense}
              disabled={processingPayment}
              style={{ background: '#10b981', color: '#fff' }}
            >
              <RiCheckLine /> {processingPayment ? 'Authorizing STK Escrow...' : `Pay & Execute License ($${totalFee.toLocaleString()})`}
            </button>
          )}

          {step === 5 && (
            <button type="button" className="aff-btn-submit-primary" onClick={onClose}>
              Done &amp; Return to Marketplace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
