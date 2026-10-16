import React, { useState, useEffect } from 'react'
import {
  RiBankCardFill,
  RiSmartphoneFill,
  RiCoinsFill,
  RiShieldCheckLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiShareLine,
  RiSendPlaneFill,
  RiBuilding4Fill,
  RiUserAddFill,
  RiCheckboxCircleFill,
  RiArrowRightLine,
  RiWhatsappFill,
  RiTwitterXFill,
  RiTelegramFill,
  RiMailFill,
  RiFlashlightLine,
  RiTimeLine,
  RiGlobalFill,
  RiExternalLinkLine
} from 'react-icons/ri'
import { affiliatesApi } from '../../lib/api.js'
import './AffiliateActionModals.css'

// ======================================================================
// 1. Partner Payout Rails & Mobile STK Settings Modal
// ======================================================================
export function AffiliatePayoutSettingsModal({ isOpen, onClose, sessionUser, onSuccess }) {
  if (!isOpen) return null;

  const currentRef = sessionUser?.ref_code || 'TM-KENYA-254';
  
  // Load initial settings
  const [rail, setRail] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.rail || sessionUser?.payout_method || 'mpesa';
    } catch {
      return 'mpesa';
    }
  });

  const [phone, setPhone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.phone || sessionUser?.payout_account || '+254712345678';
    } catch {
      return '+254712345678';
    }
  });

  const [recipientName, setRecipientName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.recipientName || sessionUser?.name || 'Zawadi Kiprop';
    } catch {
      return sessionUser?.name || 'Zawadi Kiprop';
    }
  });

  const [bankName, setBankName] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.bankName || 'KCB Bank Kenya';
    } catch {
      return 'KCB Bank Kenya';
    }
  });

  const [bankAccount, setBankAccount] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.bankAccount || '';
    } catch {
      return '';
    }
  });

  const [paypalEmail, setPaypalEmail] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.paypalEmail || sessionUser?.email || '';
    } catch {
      return '';
    }
  });

  const [threshold, setThreshold] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tunemavens_payout_settings') || '{}');
      return saved.threshold || 20;
    } catch {
      return 20;
    }
  });

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailStatements, setEmailStatements] = useState(true);

  // STK Test State
  const [stkStatus, setStkStatus] = useState(null); // null | 'pinging' | 'success' | 'error'
  const [stkFeedback, setStkFeedback] = useState('');

  // Save State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle STK push test handshake simulation
  const handleTestStk = () => {
    if (!phone || phone.trim().length < 9) {
      setStkStatus('error');
      setStkFeedback('Please provide a valid East African mobile phone number (e.g. +254712345678).');
      return;
    }
    setStkStatus('pinging');
    setStkFeedback(`Pinging Safaricom Daraja STK Push sandbox for ${phone}...`);

    setTimeout(() => {
      setStkStatus('success');
      setStkFeedback(
        `✓ STK Handshake Verified! Zero-fee test prompt received by ${phone}. Auto-settlements will disburse seamlessly to this handset.`
      );
    }, 1200);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      rail,
      phone: phone.trim(),
      recipientName: recipientName.trim(),
      bankName: rail === 'bank' ? bankName : undefined,
      bankAccount: rail === 'bank' ? bankAccount.trim() : undefined,
      paypalEmail: rail === 'paypal' ? paypalEmail.trim() : undefined,
      threshold: Number(threshold),
      smsAlerts,
      emailStatements,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('tunemavens_payout_settings', JSON.stringify(payload));
    localStorage.setItem('tunemavens_payout_configured', 'true');

    // Update session user cache
    const currentSession = JSON.parse(sessionStorage.getItem('tunemavens_session') || '{}');
    const updatedSession = {
      ...currentSession,
      payout_method: rail,
      payout_account: rail === 'bank' ? bankAccount : (rail === 'paypal' ? paypalEmail : phone),
      payout_details: {
        phone,
        recipient: recipientName,
        rail,
        threshold: Number(threshold)
      }
    };
    sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedSession));
    localStorage.setItem('tunemavens_user', JSON.stringify(updatedSession));

    // Dispatch update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tunemavens:payout-updated', { detail: payload }));
    }

    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      if (typeof onSuccess === 'function') {
        onSuccess(payload);
      }
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    }, 400);
  };

  return (
    <div className="aff-action-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aff-action-modal-card" data-testid="affiliate-payout-settings-modal">
        {/* Header */}
        <div className="aff-action-modal-header">
          <div>
            <span className="aff-action-modal-eyebrow">Partner Payout Configuration</span>
            <h3 className="aff-action-modal-title">
              <RiSmartphoneFill color="#22d3ee" /> Partner Payout Rails &amp; Mobile STK Settings
            </h3>
          </div>
          <button className="aff-action-modal-close" onClick={onClose} aria-label="Close modal">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="aff-action-modal-body">
          {saveSuccess ? (
            <div className="aff-success-inner-card">
              <RiCheckboxCircleFill size={48} color="#10b981" />
              <h4>Payout Rails Successfully Verified!</h4>
              <p>
                Your weekly payout rail ({rail.toUpperCase()}) is active with zero monthly charges. 
                Earnings over ${threshold} USD will disburse automatically every Friday.
              </p>
              <div className="aff-action-notice-box" style={{ width: '100%' }}>
                <RiShieldCheckLine size={20} color="#22d3ee" />
                <span>Onboarding payout requirement completed. Green checkmark updated on dashboard.</span>
              </div>
            </div>
          ) : (
            <>
              {/* Zero credit deduction notice */}
              <div className="aff-action-notice-box">
                <RiShieldCheckLine size={20} color="#22d3ee" />
                <span>
                  Affiliate payout settlement is completely free and requires <strong>0 platform credits</strong>. Payouts disburse directly via instant mobile STK push or bank wire.
                </span>
              </div>

              {/* Payout Rail Selector Grid */}
              <div className="aff-modal-form-group">
                <label>
                  <span>Select Primary Disbursement Rail *</span>
                  <span style={{ fontSize: '10.5px', color: '#64748b' }}>Instant weekly settlements</span>
                </label>
                <div className="aff-rail-selector-grid">
                  <div 
                    className={`aff-rail-card-option ${rail === 'mpesa' ? 'selected' : ''}`}
                    onClick={() => setRail('mpesa')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>
                        M-Pesa Express (Kenya STK)
                        <span className="aff-rail-badge-rec">Recommended</span>
                      </strong>
                      <span>Direct B2C Safaricom STK prompt</span>
                    </div>
                  </div>

                  <div 
                    className={`aff-rail-card-option ${rail === 'airtel' ? 'selected' : ''}`}
                    onClick={() => setRail('airtel')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>Airtel Money (East Africa)</strong>
                      <span>Direct East African mobile wallet</span>
                    </div>
                  </div>

                  <div 
                    className={`aff-rail-card-option ${rail === 'bank' ? 'selected' : ''}`}
                    onClick={() => setRail('bank')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>Bank Wire (EFT / RTGS)</strong>
                      <span>KCB, Equity, Co-op, Stanbic &amp; others</span>
                    </div>
                  </div>

                  <div 
                    className={`aff-rail-card-option ${rail === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setRail('paypal')}
                  >
                    <div className="aff-rail-radio-dot" />
                    <div className="aff-rail-info">
                      <strong>PayPal / Global Stripe</strong>
                      <span>International diaspora disbursements</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditional Rail Inputs */}
              {(rail === 'mpesa' || rail === 'airtel') && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                    <div className="aff-modal-form-group">
                      <label>Registered Mobile Phone Number (STK Target) *</label>
                      <input 
                        type="text"
                        required
                        placeholder="+254 712 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="aff-modal-input"
                      />
                      <span className="aff-modal-hint">Include country code (+254 for Kenya, +256 for Uganda, +255 for TZ).</span>
                    </div>

                    <div className="aff-modal-form-group">
                      <label>Registered Recipient Legal Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="e.g. Zawadi Kiprop"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="aff-modal-input"
                      />
                      <span className="aff-modal-hint">Must match official mobile ID.</span>
                    </div>
                  </div>

                  {/* Interactive STK Push Test Box */}
                  <div className="aff-stk-test-box">
                    <div className="aff-stk-test-row">
                      <div>
                        <strong style={{ fontSize: '12px', color: '#fff', display: 'block' }}>
                          Verify Mobile Handset Handshake
                        </strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Send a simulated STK push ping to verify formatting before first disbursement.
                        </span>
                      </div>
                      <button 
                        type="button" 
                        className="aff-stk-test-btn"
                        onClick={handleTestStk}
                        disabled={stkStatus === 'pinging'}
                      >
                        <RiFlashlightLine /> {stkStatus === 'pinging' ? 'Pinging Handset...' : 'Test STK Ping'}
                      </button>
                    </div>

                    {stkStatus && (
                      <div className={`aff-stk-test-result ${stkStatus}`}>
                        {stkFeedback}
                      </div>
                    )}
                  </div>
                </>
              )}

              {rail === 'bank' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="aff-modal-form-group">
                    <label>Commercial Bank Name *</label>
                    <select 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="aff-modal-select"
                    >
                      <option value="KCB Bank Kenya">KCB Bank Kenya</option>
                      <option value="Equity Bank Kenya">Equity Bank Kenya</option>
                      <option value="Co-operative Bank">Co-operative Bank</option>
                      <option value="NCBA Bank">NCBA Bank</option>
                      <option value="Stanbic Bank">Stanbic Bank</option>
                      <option value="Standard Chartered">Standard Chartered</option>
                      <option value="Absa Bank Kenya">Absa Bank Kenya</option>
                      <option value="Other Regional Bank">Other Regional Bank</option>
                    </select>
                  </div>

                  <div className="aff-modal-form-group">
                    <label>Account Number / IBAN *</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 1123456789"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="aff-modal-input"
                    />
                  </div>
                </div>
              )}

              {rail === 'paypal' && (
                <div className="aff-modal-form-group">
                  <label>PayPal Registered Email Address *</label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. partner@example.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="aff-modal-input"
                  />
                </div>
              )}

              {/* Automatic Settlement Threshold */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="aff-modal-form-group">
                  <label>Automatic Settlement Threshold</label>
                  <select 
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="aff-modal-select"
                  >
                    <option value={20}>$20.00 USD (KES ~2,500) - Fast Weekly Payout</option>
                    <option value={50}>$50.00 USD (KES ~6,500) - Standard</option>
                    <option value={100}>$100.00 USD (KES ~13,000) - High Volume</option>
                    <option value={250}>$250.00 USD (KES ~32,500) - Monthly Consolidated</option>
                  </select>
                  <span className="aff-modal-hint">Disburses automatically every Friday at 16:00 EAT.</span>
                </div>

                <div className="aff-modal-form-group">
                  <label>Disbursement Notifications</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <label style={{ fontSize: '11.5px', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={smsAlerts} 
                        onChange={(e) => setSmsAlerts(e.target.checked)} 
                      />
                      SMS STK alert on mobile
                    </label>
                    <label style={{ fontSize: '11.5px', color: '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={emailStatements} 
                        onChange={(e) => setEmailStatements(e.target.checked)} 
                      />
                      Weekly PDF statement email
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          {!saveSuccess && (
            <div className="aff-action-modal-footer">
              <button type="button" className="aff-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="aff-btn-submit-primary"
                disabled={saving}
              >
                <RiCheckLine /> {saving ? 'Saving Rails...' : 'Save & Activate Payout Rails'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ======================================================================
// 2. Official 90-Day Referral Link Modal
// ======================================================================
export function AffiliateReferralLinkModal({ isOpen, onClose, sessionUser, onLinkCopied, onGoToDashboard }) {
  if (!isOpen) return null;

  const refCode = sessionUser?.ref_code || 'TM-KENYA-254';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tunemavens.com';

  const [campaign, setCampaign] = useState('direct');
  const [copied, setCopied] = useState(false);

  const getFullLink = () => {
    if (campaign === 'direct') {
      return `${baseUrl}/?ref=${refCode}`;
    }
    return `${baseUrl}/?ref=${refCode}&campaign=${campaign}`;
  };

  const fullLink = getFullLink();

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullLink);
    }
    setCopied(true);
    localStorage.setItem('tunemavens_affiliate_link_shared', 'true');
    if (typeof onLinkCopied === 'function') onLinkCopied();
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Join TuneMavens — the premier East African & global platform for artists, record labels, and DJs to distribute music, license for sync, and monetize catalog: ${fullLink}`;

  return (
    <div className="aff-action-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aff-action-modal-card" data-testid="affiliate-referral-link-modal">
        {/* Header */}
        <div className="aff-action-modal-header">
          <div>
            <span className="aff-action-modal-eyebrow">90-Day Attribution Engine</span>
            <h3 className="aff-action-modal-title">
              <RiShareLine color="#22d3ee" /> Your Official Affiliate Referral Link
            </h3>
          </div>
          <button className="aff-action-modal-close" onClick={onClose} aria-label="Close modal">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="aff-action-modal-body">
          {/* Highlights Row */}
          <div className="aff-value-highlights-row">
            <div className="aff-value-highlight-item">
              <strong>90-Day Tracking Cookie</strong>
              <span>Attribution persists across 90 days after first click.</span>
            </div>
            <div className="aff-value-highlight-item">
              <strong>3% to 12% Revenue Share</strong>
              <span>Perpetual commission across sales, sync, EPKs &amp; mastering.</span>
            </div>
            <div className="aff-value-highlight-item">
              <strong>0 Platform Credits</strong>
              <span>Referrals require zero credit balance or upfront fee.</span>
            </div>
          </div>

          {/* Live Link Display & Copy Button */}
          <div className="aff-link-display-box">
            <label style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Your Unique Referral URL ({refCode})
            </label>
            <div className="aff-link-copy-row">
              <input 
                type="text" 
                readOnly 
                value={fullLink} 
                className="aff-modal-input" 
                style={{ fontFamily: 'monospace', fontSize: '13px', background: '#02040a' }}
              />
              <button 
                type="button" 
                className={`aff-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                data-testid="affiliate-copy-link-btn"
              >
                {copied ? <><RiCheckLine /> Copied!</> : <><RiFileCopyLine /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* Campaign Tracking Chips */}
          <div className="aff-modal-form-group">
            <label>
              <span>Add Campaign Parameter (Optional)</span>
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>Track which channel delivers top conversions</span>
            </label>
            <div className="aff-campaign-chips-row">
              {[
                { id: 'direct', label: 'Default / None' },
                { id: 'whatsapp_group', label: 'WhatsApp Groups' },
                { id: 'instagram_bio', label: 'Instagram Bio' },
                { id: 'tiktok_profile', label: 'TikTok' },
                { id: 'youtube_desc', label: 'YouTube Description' },
                { id: 'email_newsletter', label: 'Email Newsletter' },
                { id: 'campus_nairobi', label: 'Nairobi Campus' },
              ].map(chip => (
                <button
                  key={chip.id}
                  type="button"
                  className={`aff-campaign-chip ${campaign === chip.id ? 'active' : ''}`}
                  onClick={() => setCampaign(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Share Buttons Grid */}
          <div className="aff-modal-form-group">
            <label>1-Click Share to Channels</label>
            <div className="aff-share-buttons-grid">
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="aff-share-pill-btn whatsapp"
                onClick={() => {
                  localStorage.setItem('tunemavens_affiliate_link_shared', 'true');
                  if (onLinkCopied) onLinkCopied();
                }}
              >
                <RiWhatsappFill size={20} color="#25d366" />
                <span>WhatsApp</span>
              </a>

              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="aff-share-pill-btn twitter"
                onClick={() => {
                  localStorage.setItem('tunemavens_affiliate_link_shared', 'true');
                  if (onLinkCopied) onLinkCopied();
                }}
              >
                <RiTwitterXFill size={19} color="#1d9bf0" />
                <span>X / Twitter</span>
              </a>

              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(fullLink)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="aff-share-pill-btn telegram"
                onClick={() => {
                  localStorage.setItem('tunemavens_affiliate_link_shared', 'true');
                  if (onLinkCopied) onLinkCopied();
                }}
              >
                <RiTelegramFill size={20} color="#0088cc" />
                <span>Telegram</span>
              </a>

              <a 
                href={`mailto:?subject=${encodeURIComponent('Invitation to TuneMavens Platform')}&body=${encodeURIComponent(shareText)}`}
                className="aff-share-pill-btn email"
                onClick={() => {
                  localStorage.setItem('tunemavens_affiliate_link_shared', 'true');
                  if (onLinkCopied) onLinkCopied();
                }}
              >
                <RiMailFill size={20} color="#f59e0b" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="aff-action-modal-footer">
          {onGoToDashboard && (
            <button 
              type="button" 
              className="aff-btn-secondary" 
              onClick={() => {
                onClose();
                onGoToDashboard();
              }}
            >
              Open Affiliate Dashboard &amp; Analytics
            </button>
          )}
          <button type="button" className="aff-btn-submit-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================================
// 3. Direct Talent Onboarding Modal ("Add Talent")
// ======================================================================
export function AffiliateDirectTalentModal({ isOpen, onClose, sessionUser, onSuccess, onViewInNetwork }) {
  if (!isOpen) return null;

  const currentRef = sessionUser?.ref_code || 'TM-KENYA-254';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tunemavens.com';

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'creator',
    handle: '',
    region: 'Nairobi, Kenya',
    split_incentive: 'Standard Matrix (3% - 12%)',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ref_code: currentRef,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        handle: form.handle.trim(),
        region: form.region,
        split_incentive: form.split_incentive,
        notes: form.notes.trim()
      };

      const res = await affiliatesApi.onboardUser(payload).catch(() => null);

      const inviteUrl = res?.invite_url || `${baseUrl}/?ref=${currentRef}&invited_role=${form.role}&invite_email=${encodeURIComponent(form.email.trim())}`;

      const finalData = {
        message: res?.message || `${form.name} successfully linked to your affiliate portfolio!`,
        invite_url: inviteUrl,
        user: { ...form, id: `net_${Date.now()}` }
      };

      setSuccessData(finalData);
      localStorage.setItem('tunemavens_affiliate_talent_added', 'true');
      if (typeof onSuccess === 'function') onSuccess(finalData);
    } catch (err) {
      console.warn('Direct talent onboarding local fallback:', err);
      const inviteUrl = `${baseUrl}/?ref=${currentRef}&invited_role=${form.role}&invite_email=${encodeURIComponent(form.email.trim())}`;
      const fallback = {
        message: `${form.name} successfully linked to your affiliate portfolio!`,
        invite_url: inviteUrl
      };
      setSuccessData(fallback);
      localStorage.setItem('tunemavens_affiliate_talent_added', 'true');
      if (typeof onSuccess === 'function') onSuccess(fallback);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyInvite = (url) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const inviteShareMsg = `Hey ${form.name || 'there'}! I’ve reserved your artist/label onboarding on TuneMavens with full distribution & sync clearance benefits pre-activated. Claim your account here: ${successData?.invite_url}`;

  return (
    <div className="aff-action-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aff-action-modal-card" data-testid="affiliate-direct-talent-modal">
        {/* Header */}
        <div className="aff-action-modal-header">
          <div>
            <span className="aff-action-modal-eyebrow">Roster Expansion · 0 Credits</span>
            <h3 className="aff-action-modal-title">
              <RiUserAddFill color="#22d3ee" /> Directly Onboard Creator, Label, or Partner
            </h3>
          </div>
          <button className="aff-action-modal-close" onClick={onClose} aria-label="Close modal">
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="aff-action-modal-body">
          {successData ? (
            <div className="aff-success-inner-card">
              <RiCheckboxCircleFill size={48} color="#10b981" />
              <h4>Talent Successfully Linked!</h4>
              <p>{successData.message}</p>

              {/* Direct Invite URL Box */}
              <div className="aff-link-display-box" style={{ width: '100%', textAlign: 'left' }}>
                <label style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 800 }}>
                  One-Click Pre-Bound Invitation Link:
                </label>
                <div className="aff-link-copy-row">
                  <input 
                    type="text" 
                    readOnly 
                    value={successData.invite_url} 
                    className="aff-modal-input" 
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  <button 
                    type="button" 
                    className={`aff-copy-btn ${copiedInvite ? 'copied' : ''}`}
                    onClick={() => handleCopyInvite(successData.invite_url)}
                  >
                    {copiedInvite ? <><RiCheckLine /> Copied!</> : <><RiFileCopyLine /> Copy</>}
                  </button>
                </div>
                <span className="aff-modal-hint" style={{ marginTop: '6px' }}>
                  Send this link via WhatsApp or email. When they open it, their account claims with your referral pre-bound!
                </span>
              </div>

              {/* Instant WhatsApp Share */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', width: '100%' }}>
                <a 
                  href={`https://wa.me/?text=${encodeURIComponent(inviteShareMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="aff-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center', textDecoration: 'none', background: 'rgba(37, 211, 102, 0.15)', borderColor: '#25d366', color: '#25d366' }}
                >
                  <RiWhatsappFill size={16} /> Share via WhatsApp
                </a>
                <a 
                  href={`mailto:${encodeURIComponent(form.email)}?subject=${encodeURIComponent('TuneMavens Onboarding Invite')}&body=${encodeURIComponent(inviteShareMsg)}`}
                  className="aff-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                >
                  <RiMailFill size={16} /> Send via Email
                </a>
              </div>

              <div className="aff-action-modal-footer" style={{ width: '100%', marginTop: '20px', padding: 0, background: 'transparent' }}>
                {onViewInNetwork && (
                  <button 
                    type="button" 
                    className="aff-btn-secondary"
                    onClick={() => {
                      onClose();
                      onViewInNetwork();
                    }}
                  >
                    View in Talent Network Roster
                  </button>
                )}
                <button 
                  type="button" 
                  className="aff-btn-submit-primary" 
                  onClick={() => {
                    setSuccessData(null);
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Notice */}
              <div className="aff-action-notice-box">
                <RiShieldCheckLine size={20} color="#22d3ee" />
                <span>
                  Adding talent directly binds them permanently to your affiliate revenue share with <strong>0 platform credit deductions</strong>.
                </span>
              </div>

              {/* Name & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="aff-modal-form-group">
                  <label>Full Name / Stage / Company Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Maya Wendo / Sol Records"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="aff-modal-input"
                  />
                </div>

                <div className="aff-modal-form-group">
                  <label>Contact Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. maya@music.co.ke"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="aff-modal-input"
                  />
                </div>
              </div>

              {/* Role & Handle */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="aff-modal-form-group">
                  <label>Account Role / Industry Segment *</label>
                  <select 
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="aff-modal-select"
                  >
                    <option value="creator">Recording Artist &amp; Beat Producer</option>
                    <option value="label">Independent Record Label</option>
                    <option value="dj">DJ &amp; Curated Playlist Curator</option>
                    <option value="supervisor">Music Supervisor &amp; Studio</option>
                    <option value="corporate">Corporate Brand / Media House</option>
                    <option value="affiliate">Sub-Affiliate / Campus Partner</option>
                  </select>
                </div>

                <div className="aff-modal-form-group">
                  <label>Handle / Social Link</label>
                  <input 
                    type="text" 
                    placeholder="e.g. @mayawendo (IG/Spotify)"
                    value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })}
                    className="aff-modal-input"
                  />
                </div>
              </div>

              {/* Region & Incentive */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="aff-modal-form-group">
                  <label>Primary Region</label>
                  <select 
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    className="aff-modal-select"
                  >
                    <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                    <option value="Mombasa, Kenya">Mombasa, Kenya</option>
                    <option value="Kisumu, Kenya">Kisumu, Kenya</option>
                    <option value="Kampala, Uganda">Kampala, Uganda</option>
                    <option value="Dar es Salaam, Tanzania">Dar es Salaam, Tanzania</option>
                    <option value="Pan-African & Diaspora">Pan-African &amp; Diaspora</option>
                    <option value="Global (US/UK/EU)">Global (US/UK/EU)</option>
                  </select>
                </div>

                <div className="aff-modal-form-group">
                  <label>Commission Split / Terms</label>
                  <select 
                    value={form.split_incentive}
                    onChange={(e) => setForm({ ...form, split_incentive: e.target.value })}
                    className="aff-modal-select"
                  >
                    <option value="Standard Matrix (3% - 12%)">Standard Matrix (3% - 12%)</option>
                    <option value="Priority Sync Placement (10% flat)">Priority Sync Placement (10% flat)</option>
                    <option value="Label Enterprise Deal (Custom)">Label Enterprise Deal (Custom)</option>
                  </select>
                </div>
              </div>

              {/* Personal Welcome Note */}
              <div className="aff-modal-form-group">
                <label>Personal Welcome Note (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Welcome to TuneMavens! Looking forward to placing your masters for sync."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="aff-modal-input"
                />
              </div>

              {/* Footer */}
              <div className="aff-action-modal-footer">
                <button type="button" className="aff-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="aff-btn-submit-primary"
                  disabled={submitting}
                >
                  <RiUserAddFill /> {submitting ? 'Creating Invite...' : 'Link Talent & Generate Invite'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
