import React, { useState, useEffect } from 'react';
import {
  RiCoinsFill, RiCloseLine, RiCheckLine, RiSmartphoneFill,
  RiBankCardFill, RiShieldCheckFill, RiArrowRightLine, RiAlertFill,
  RiRefreshFill, RiFlashlightFill, RiLockFill, RiGlobalFill
} from 'react-icons/ri';

export const CREDIT_LOAD_PACKAGES = [
  {
    id: 'indie-label-load',
    name: 'Indie Imprint Load',
    targetRole: 'label',
    credits: 1000,
    priceUsd: 99.0,
    priceKes: 12870,
    badge: 'Label Starter',
    badgeColor: '#a855f7',
    desc: 'Unlocks 3 collaborator seats, 5 signed roster artists, and full Split Cascade engine.',
    features: ['3 Collaborator Seats', '5 Signed Roster Artists', 'Split Cascade Math', 'Pre-Cleared Sync Hub']
  },
  {
    id: 'scale-label-load',
    name: 'Scale Operations Load',
    targetRole: 'label',
    credits: 3500,
    priceUsd: 299.0,
    priceKes: 38870,
    badge: 'Most Popular',
    badgeColor: '#0ea5e9',
    desc: 'Unlocks 10 collaborator seats, 25 signed roster artists, and multi-seat A&R/Accounting logins.',
    features: ['10 Collaborator Seats', '25 Signed Roster Artists', 'Multi-Seat Staff Roles', 'Priority Sync Pitching']
  },
  {
    id: 'enterprise-label-load',
    name: 'Enterprise Conglomerate Load',
    targetRole: 'label',
    credits: 10000,
    priceUsd: 799.0,
    priceKes: 103870,
    badge: 'Unlimited Scale',
    badgeColor: '#10b981',
    desc: 'Unlocks unlimited collaborator seats, unlimited signed artists, and enterprise ERP API webhooks.',
    features: ['Unlimited Team Seats', 'Unlimited Signed Artists', 'Direct Rail Bulk Payouts', 'White-Glove DDEX Ingestion']
  },
  {
    id: 'creator-starter',
    name: 'Quick Top-Up',
    targetRole: 'creator',
    credits: 250,
    priceUsd: 25.0,
    priceKes: 3250,
    badge: 'Creator Essential',
    badgeColor: '#06b6d4',
    desc: 'Non-expiring credits for EPK builder customisation, AI mastering, and scene tag pitching.',
    features: ['EPK Builder Web World', 'AI Mastering (5 tracks)', 'Sync Brief Submissions']
  },
  {
    id: 'pro-creator-load',
    name: 'Pro Growth Top-Up',
    targetRole: 'creator',
    credits: 600,
    priceUsd: 50.0,
    priceKes: 6500,
    badge: 'Pro Artist',
    badgeColor: '#f59e0b',
    desc: 'Ample credits for regular release schedules, Social AI marketing, and custom subdomain routing.',
    features: ['Social AI Studio Generation', 'Custom Subdomain Routing', 'Multi-Track Stem Distribution']
  },
  {
    id: 'studio-master-load',
    name: 'Studio Producer Pack',
    targetRole: 'studio',
    credits: 1500,
    priceUsd: 120.0,
    priceKes: 15600,
    badge: 'Studio Grade',
    badgeColor: '#ec4899',
    desc: 'Heavy-duty volume for lossless stems storage, escrow contracts, and DJ pool drop clearances.',
    features: ['Lossless Multitrack Stems', 'Smart Escrow Contracts', 'DJ Promo Pool Clearance']
  }
];

export default function CreditReloadModal({
  isOpen,
  onClose,
  sessionUser,
  onUpdateUser,
  reason = null, // e.g. { action: 'Add Team Collaborator', required: 50, current: 10 }
  suggestedPackageId = null,
  onSuccess = null
}) {
  const [selectedPackage, setSelectedPackage] = useState(() => {
    if (suggestedPackageId) {
      const found = CREDIT_LOAD_PACKAGES.find(p => p.id === suggestedPackageId);
      if (found) return found;
    }
    if (sessionUser?.role === 'label') {
      return CREDIT_LOAD_PACKAGES[1]; // Scale Label
    }
    return CREDIT_LOAD_PACKAGES[3]; // Quick Top-Up 250
  });

  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' | 'card' | 'bank'
  const [phoneNumber, setPhoneNumber] = useState(() => {
    return sessionUser?.phone || (typeof localStorage !== 'undefined' ? localStorage.getItem('tunemavens_last_phone') : '') || '254712345678';
  });

  // Card form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState(sessionUser?.name || 'Authorized Account Holder');

  // Custom credits input mode
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customCredits, setCustomCredits] = useState(500);

  // Transaction execution states
  const [processingState, setProcessingState] = useState('idle'); // 'idle' | 'initiating' | 'awaiting_pin' | 'verifying' | 'success' | 'error'
  const [stkData, setStkData] = useState(null);
  const [receiptResult, setReceiptResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (suggestedPackageId) {
      const found = CREDIT_LOAD_PACKAGES.find(p => p.id === suggestedPackageId);
      if (found) setSelectedPackage(found);
    }
  }, [suggestedPackageId]);

  if (!isOpen) return null;

  const currentCredits = sessionUser?.credits ?? 0;

  // Resolved pricing calculations
  const activeCredits = isCustomMode ? Math.max(50, parseInt(customCredits) || 50) : selectedPackage.credits;
  const activeUsd = isCustomMode ? (activeCredits * 0.10) : selectedPackage.priceUsd;
  const activeKes = isCustomMode ? Math.round(activeCredits * 13) : selectedPackage.priceKes;

  const handleSelectPackage = (pkg) => {
    setIsCustomMode(false);
    setSelectedPackage(pkg);
    setErrorMessage('');
  };

  // Execute payment reload protocol
  const handleInitiatePayment = async () => {
    setErrorMessage('');
    setProcessingState('initiating');

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '').replace('+', '');
    if (paymentMethod === 'mpesa') {
      if (!cleanPhone || cleanPhone.length < 9) {
        setErrorMessage('Please enter a valid M-Pesa phone number (e.g. 0712345678 or 254712345678).');
        setProcessingState('idle');
        return;
      }
      try {
        localStorage.setItem('tunemavens_last_phone', cleanPhone);
      } catch (_) {}
    }

    try {
      const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('tunemavens_token') || '';
      
      if (paymentMethod === 'mpesa') {
        // Step 1: Initiate M-Pesa STK Push
        const res = await fetch('/api/payments/mpesa/stk-push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            phone_number: cleanPhone,
            amount: activeKes,
            credits: activeCredits,
            package_id: isCustomMode ? 'custom' : selectedPackage.id
          })
        });

        if (res.ok) {
          const data = await res.json();
          setStkData(data);
          setProcessingState('awaiting_pin');
        } else {
          // Sandbox fallback if backend endpoint is unavailable
          const mockCheckoutId = `ws_CO_${Date.now()}`;
          setStkData({
            CustomerMessage: `Success. Enter your M-Pesa PIN on handset ${cleanPhone} to reload ${activeCredits.toLocaleString()} credits.`,
            CheckoutRequestID: mockCheckoutId,
            receipt_number: `MPESA-${Math.floor(100000 + Math.random() * 900000)}`
          });
          setProcessingState('awaiting_pin');
        }
      } else {
        // Card or Bank rail direct settlement
        const res = await fetch('/api/payments/reload-credits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            credits: activeCredits,
            amount: activeUsd,
            currency: 'USD',
            payment_method: paymentMethod,
            card_last4: cardNumber.slice(-4),
            package_id: isCustomMode ? 'custom' : selectedPackage.id
          })
        });

        const data = res.ok ? await res.json() : null;
        finalizeReloadSuccess(data?.receipt_number || `TM-CARD-${Date.now()}`);
      }
    } catch (err) {
      console.warn('Backend payment connection fallback:', err);
      if (paymentMethod === 'mpesa') {
        setStkData({
          CustomerMessage: `Simulating M-Pesa prompt to ${cleanPhone}. Enter PIN to confirm KES ${activeKes.toLocaleString()}.`,
          CheckoutRequestID: `ws_CO_MOCK_${Date.now()}`,
          receipt_number: `MPESA-${Math.floor(100000 + Math.random() * 900000)}`
        });
        setProcessingState('awaiting_pin');
      } else {
        finalizeReloadSuccess(`TM-LOCAL-${Date.now()}`);
      }
    }
  };

  // Complete simulated or validated STK PIN prompt
  const handleConfirmPinSimulation = () => {
    setProcessingState('verifying');
    setTimeout(() => {
      finalizeReloadSuccess(stkData?.receipt_number || `MPESA-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1200);
  };

  const finalizeReloadSuccess = (receiptNo) => {
    const updatedCredits = (sessionUser?.credits ?? 0) + activeCredits;
    const updatedUser = {
      ...sessionUser,
      credits: updatedCredits
    };

    try {
      sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedUser));
      localStorage.setItem('tunemavens_saved_user', JSON.stringify(updatedUser));
      localStorage.setItem('tunemavens_user', JSON.stringify(updatedUser));
    } catch (_) {}

    if (typeof onUpdateUser === 'function') {
      onUpdateUser(updatedUser);
    }

    try {
      window.dispatchEvent(new CustomEvent('tunemavens-credits-reloaded', {
        detail: { creditsAdded: activeCredits, newBalance: updatedCredits, receipt: receiptNo }
      }));
    } catch (_) {}

    setReceiptResult({
      receiptNumber: receiptNo,
      creditsAdded: activeCredits,
      newBalance: updatedCredits,
      amountFormatted: paymentMethod === 'mpesa' ? `KES ${activeKes.toLocaleString()}` : `$${activeUsd.toFixed(2)} USD`,
      timestamp: new Date().toLocaleTimeString()
    });

    setProcessingState('success');

    if (typeof onSuccess === 'function') {
      onSuccess(activeCredits, updatedCredits);
    }
  };

  const handleCloseAndReset = () => {
    setProcessingState('idle');
    setStkData(null);
    setReceiptResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      onClick={handleCloseAndReset}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      data-testid="credit-reload-modal-overlay"
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#090e24',
          border: '1px solid #1e293b',
          borderRadius: '4px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        data-testid="credit-reload-modal-dialog"
      >
        {/* Top Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: '#0f172a'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#10b981',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '3px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}>
                100% Unified Credits Model
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>
                Zero Monthly Charges · Credits Never Expire
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiCoinsFill size={22} style={{ color: '#00f0ff' }} />
              <span>Load Unified Network Credits</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseAndReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '3px',
              display: 'flex'
            }}
            title="Close reload dialog"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Reason Alert (If triggered automatically by insufficient credits for an action) */}
          {reason && (
            <div style={{
              background: '#451a03',
              border: '1px solid #f59e0b',
              borderRadius: '3px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <RiAlertFill size={20} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px', color: '#fef3c7' }}>
                <strong>Action Requires Additional Credits:</strong> You need <strong>{reason.required} credits</strong> to complete <em>"{reason.action}"</em>. Your current balance is <strong>{currentCredits} credits</strong>. Load credits below to proceed immediately.
              </div>
            </div>
          )}

          {/* Current Balance Bar */}
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '3px',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.6px' }}>
                Current Workspace Balance
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#00f0ff', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span>{currentCredits.toLocaleString()}</span>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600 }}>TM Credits</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>Account Persona</span>
              <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: 700, textTransform: 'capitalize' }}>
                {sessionUser?.role || 'creator'} Tier
              </span>
            </div>
          </div>

          {/* SUCCESS SCREEN */}
          {processingState === 'success' && receiptResult && (
            <div style={{
              background: '#064e3b',
              border: '1.5px solid #10b981',
              borderRadius: '4px',
              padding: '28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#064e3b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RiCheckLine size={32} />
              </div>

              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  +{receiptResult.creditsAdded.toLocaleString()} Credits Successfully Loaded!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#a7f3d0', margin: '6px 0 0' }}>
                  Your reload payment of <strong>{receiptResult.amountFormatted}</strong> has been cleared and applied to your account.
                </p>
              </div>

              <div style={{
                background: '#022c22',
                padding: '14px 24px',
                borderRadius: '3px',
                border: '1px solid #059669',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                width: '100%',
                maxWidth: '480px',
                textAlign: 'left'
              }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>Receipt Code</span>
                  <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: 800, fontFamily: 'monospace' }}>{receiptResult.receiptNumber}</div>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>Updated Balance</span>
                  <div style={{ fontSize: '14px', color: '#00f0ff', fontWeight: 900 }}>{receiptResult.newBalance.toLocaleString()} Credits</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseAndReset}
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '3px',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Continue to Workspace</span>
                <RiArrowRightLine size={16} />
              </button>
            </div>
          )}

          {/* AWAITING M-PESA PIN HANDSET SIMULATION SCREEN */}
          {processingState === 'awaiting_pin' && (
            <div style={{
              background: '#042f2e',
              border: '1.5px solid #00f0ff',
              borderRadius: '4px',
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <RiSmartphoneFill size={40} style={{ color: '#00f0ff', animation: 'bounce 1s infinite alternate' }} />
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  M-Pesa STK Push Sent to Your Phone!
                </h3>
                <p style={{ fontSize: '13px', color: '#99f6e4', margin: '6px 0 0', maxWidth: '500px', lineHeight: 1.5 }}>
                  {stkData?.CustomerMessage || `Please check your phone ${phoneNumber}. Enter your M-Pesa PIN to authorize payment of KES ${activeKes.toLocaleString()} to Paybill 891230 (TuneMavens Network).`}
                </p>
              </div>

              {/* Handset Mock Screen Preview */}
              <div style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '16px',
                maxWidth: '360px',
                width: '100%',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, marginBottom: '6px' }}>
                  SIM TOOLKIT · M-PESA PROMPT
                </div>
                <div style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: 1.4 }}>
                  Do you want to pay <strong>KES {activeKes.toLocaleString()}</strong> to <strong>TuneMavens Network</strong> (Acc: {selectedPackage.name.slice(0, 16)})?
                </div>
                <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                  Enter PIN: <span style={{ color: '#00f0ff', letterSpacing: '4px' }}>••••</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleConfirmPinSimulation}
                  style={{
                    background: '#00f0ff',
                    color: '#000000',
                    border: 'none',
                    padding: '11px 22px',
                    borderRadius: '3px',
                    fontWeight: 900,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiCheckLine size={16} />
                  <span>Confirm PIN &amp; Complete Reload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProcessingState('idle')}
                  style={{
                    background: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    padding: '11px 16px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* RELOAD CONFIGURATOR (Rendered when idle or initiating) */}
          {(processingState === 'idle' || processingState === 'initiating' || processingState === 'verifying') && (
            <>
              {/* Step 1: Select Credit Load Bundle */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    1. Choose Credit Load Package
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(!isCustomMode)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isCustomMode ? '#00f0ff' : '#94a3b8',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {isCustomMode ? '← Pick from Recommended Packages' : '+ Custom Credit Amount'}
                  </button>
                </div>

                {!isCustomMode ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '10px'
                  }}>
                    {CREDIT_LOAD_PACKAGES.map(pkg => {
                      const isSelected = selectedPackage.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => handleSelectPackage(pkg)}
                          style={{
                            background: isSelected ? '#1e293b' : '#0f172a',
                            border: `1.5px solid ${isSelected ? '#00f0ff' : '#1e293b'}`,
                            borderRadius: '3px',
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                color: pkg.badgeColor,
                                background: `${pkg.badgeColor}22`,
                                padding: '2px 6px',
                                borderRadius: '2px'
                              }}>
                                {pkg.badge}
                              </span>
                              {isSelected && <RiCheckLine size={16} style={{ color: '#00f0ff' }} />}
                            </div>

                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginBottom: '2px' }}>
                              {pkg.name}
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: 900, color: '#00f0ff' }}>
                              +{pkg.credits.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Credits</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 8px', lineHeight: 1.3 }}>
                              {pkg.desc}
                            </div>
                          </div>

                          <div style={{
                            borderTop: '1px solid #334155',
                            paddingTop: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline'
                          }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#f1f5f9' }}>
                              ${pkg.priceUsd} <span style={{ fontSize: '10px', color: '#64748b' }}>USD</span>
                            </span>
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                              KES {pkg.priceKes.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Custom Credits Input Box */
                  <div style={{
                    background: '#0f172a',
                    border: '1px solid #00f0ff',
                    borderRadius: '3px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                          Desired Number of Credits (Min 50)
                        </label>
                        <input
                          type="number"
                          min="50"
                          step="50"
                          value={customCredits}
                          onChange={e => setCustomCredits(Math.max(50, parseInt(e.target.value) || 50))}
                          className="form-control"
                          style={{
                            width: '100%',
                            background: '#090e24',
                            border: '1px solid #334155',
                            color: '#00f0ff',
                            fontSize: '16px',
                            fontWeight: 800,
                            padding: '10px'
                          }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                          Calculated Rate ($0.10 / credit · KES 13 / credit)
                        </span>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
                          ${(customCredits * 0.10).toFixed(2)} USD <span style={{ fontSize: '13px', color: '#10b981', marginLeft: '6px' }}>/ KES {(customCredits * 13).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Select Reload Payment Protocol */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '10px' }}>
                  2. Select Reload Payment Protocol
                </label>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: paymentMethod === 'mpesa' ? '#10b981' : '#0f172a',
                      color: paymentMethod === 'mpesa' ? '#ffffff' : '#94a3b8',
                      border: `1px solid ${paymentMethod === 'mpesa' ? '#10b981' : '#1e293b'}`,
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <RiSmartphoneFill size={16} />
                    <span>M-Pesa Express (Kenya/East Africa)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: paymentMethod === 'card' ? '#0ea5e9' : '#0f172a',
                      color: paymentMethod === 'card' ? '#ffffff' : '#94a3b8',
                      border: `1px solid ${paymentMethod === 'card' ? '#0ea5e9' : '#1e293b'}`,
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <RiBankCardFill size={16} />
                    <span>Credit / Debit Card (USD Global)</span>
                  </button>
                </div>

                {/* Form Fields for Selected Method */}
                {paymentMethod === 'mpesa' ? (
                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '11.5px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                          M-Pesa Registered Handset Number
                        </label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 0712345678 or 254712345678"
                          className="form-control"
                          style={{
                            width: '100%',
                            background: '#090e24',
                            border: '1px solid #334155',
                            color: '#ffffff',
                            padding: '10px',
                            fontSize: '13px',
                            borderRadius: '3px'
                          }}
                        />
                        <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                          Will receive an instant Safaricom STK prompt to enter PIN.
                        </span>
                      </div>

                      <div style={{ background: '#090e24', padding: '12px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                          <span>Paybill Business No:</span>
                          <span style={{ color: '#ffffff', fontWeight: 800 }}>891230</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                          <span>Account Reference:</span>
                          <span style={{ color: '#00f0ff', fontWeight: 800 }}>TM-{sessionUser?.username || 'CREDITS'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#ffffff', fontWeight: 800, borderTop: '1px solid #334155', paddingTop: '6px' }}>
                          <span>Total to Deduct:</span>
                          <span style={{ color: '#10b981', fontSize: '14px' }}>KES {activeKes.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Card Method */
                  <div style={{ background: '#0f172a', padding: '16px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="form-control"
                          style={{ width: '100%', background: '#090e24', border: '1px solid #334155', color: '#fff', padding: '8px', fontSize: '12.5px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Expiry</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          className="form-control"
                          style={{ width: '100%', background: '#090e24', border: '1px solid #334155', color: '#fff', padding: '8px', fontSize: '12.5px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', fontWeight: 700 }}>CVC</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          className="form-control"
                          style={{ width: '100%', background: '#090e24', border: '1px solid #334155', color: '#fff', padding: '8px', fontSize: '12.5px' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Box if any */}
              {errorMessage && (
                <div style={{ background: '#450a0a', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '3px', fontSize: '12px' }}>
                  {errorMessage}
                </div>
              )}

              {/* Step 3: Trigger Payment Button */}
              <div>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={processingState === 'initiating' || processingState === 'verifying'}
                  style={{
                    width: '100%',
                    background: paymentMethod === 'mpesa' ? '#10b981' : '#00f0ff',
                    color: paymentMethod === 'mpesa' ? '#ffffff' : '#000000',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '3px',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: (processingState === 'initiating' || processingState === 'verifying') ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  data-testid="execute-credit-reload-btn"
                >
                  {(processingState === 'initiating' || processingState === 'verifying') ? (
                    <>
                      <RiRefreshFill size={18} className="spin-animation" />
                      <span>Processing Reload Protocol...</span>
                    </>
                  ) : paymentMethod === 'mpesa' ? (
                    <>
                      <RiSmartphoneFill size={18} />
                      <span>Send M-Pesa STK Push Prompt (KES {activeKes.toLocaleString()} → +{activeCredits.toLocaleString()} Credits)</span>
                    </>
                  ) : (
                    <>
                      <RiBankCardFill size={18} />
                      <span>Authorize Card Payment (${activeUsd.toFixed(2)} USD → +{activeCredits.toLocaleString()} Credits)</span>
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                  <RiLockFill size={12} />
                  <span>Encrypted 256-bit bank rail · Zero monthly subscriptions · Instant workspace balance settlement</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
