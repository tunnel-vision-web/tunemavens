import React, { useState, useEffect } from 'react'
import {
  RiUserSharedFill,
  RiCoinsFill,
  RiBarChartFill,
  RiTimeLine,
  RiShieldCheckLine,
  RiShieldCheckFill,
  RiFilter3Line,
  RiSearchLine,
  RiRefreshLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiBankCardFill,
  RiSmartphoneFill,
  RiSettings4Line,
  RiFileList3Line,
  RiTeamFill,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiFileCopyLine,
  RiShareLine,
  RiFlashlightLine,
  RiEqualizerFill,
  RiMusicFill,
  RiDiscFill,
  RiTicket2Fill,
  RiGlobalFill,
  RiHeadphoneFill,
  RiArrowRightSLine,
  RiGraduationCapFill,
  RiUserAddFill,
  RiSendPlaneFill,
  RiBuilding4Fill,
  RiMicFill,
  RiMegaphoneFill,
  RiStarFill,
  RiBookOpenLine,
  RiBookOpenFill
} from 'react-icons/ri'
import { affiliatesApi } from '../../lib/api.js'
import InAppDocModal from '../common/InAppDocModal.jsx'
import './AffiliateAdminPanel.css'

export default function AffiliateAdminPanel({ sessionUser, setActiveTab }) {
  const isAffiliateRole = sessionUser?.role === 'affiliate';
  const isAdminUser = Boolean(
    sessionUser?.role === 'admin' ||
    sessionUser?.is_admin === true ||
    sessionUser?.original_role === 'admin' ||
    sessionUser?.admin_sandbox === true ||
    (typeof window !== 'undefined' && localStorage.getItem('tunemavens_admin_verified') === 'true')
  );

  // SubTab Navigation: 'portal' | 'network' | 'academy' | 'roster' | 'ledger' | 'matrix'
  const [activeSubTab, setActiveSubTab] = useState(isAffiliateRole ? 'portal' : 'roster');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Global Overview Metrics
  const [metrics, setMetrics] = useState({
    total_affiliates: 0,
    active_affiliates: 0,
    total_conversions: 0,
    total_gmv: 0.0,
    total_commission_earnings: 0.0,
    pending_commission_payable: 0.0,
    total_paid_out: 0.0
  });

  // Partner Console State
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [partnerConversions, setPartnerConversions] = useState([]);
  const [loadingPartner, setLoadingPartner] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [trackTesting, setTrackTesting] = useState(false);
  const [trackFeedback, setTrackFeedback] = useState('');

  // Backend Verification Sandbox State
  const [simCategory, setSimCategory] = useState('album_sale');
  const [simAmount, setSimAmount] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  // Linked Network & Onboarding State
  const [networkUsers, setNetworkUsers] = useState([]);
  const [networkStats, setNetworkStats] = useState({
    total_linked_users: 0,
    total_roster_gmv: 0.0,
    total_roster_commission: 0.0,
    role_breakdown: { creator: 0, label: 0, supervisor: 0, corporate: 0, affiliate: 0 }
  });
  const [networkRoleFilter, setNetworkRoleFilter] = useState('all');
  const [networkSearchQuery, setNetworkSearchQuery] = useState('');
  const [loadingNetwork, setLoadingNetwork] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    email: '',
    role: 'creator',
    handle: '',
    region: 'Nairobi, Kenya',
    split_incentive: 'Standard Matrix (3% - 12%)',
    notes: ''
  });
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const [onboardSuccessData, setOnboardSuccessData] = useState(null);
  const [copiedInviteUrl, setCopiedInviteUrl] = useState(false);

  // Affiliate Academy & Required Reading State
  const [academyStatus, setAcademyStatus] = useState({
    total_required: 4,
    completed_count: 0,
    progress_percentage: 0,
    all_completed: false,
    completed_readings: []
  });
  const [activeReadingDocId, setActiveReadingDocId] = useState(null);
  const [acknowledgingId, setAcknowledgingId] = useState(null);

  // Roster State
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Ledger State
  const [ledger, setLedger] = useState([]);
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState('all');
  const [ledgerRefFilter, setLedgerRefFilter] = useState('');

  // Matrix Configuration State
  const [matrixConfig, setMatrixConfig] = useState([]);
  const [cookieDays, setCookieDays] = useState(90);
  const [minPayoutUsd, setMinPayoutUsd] = useState(20);
  const [savingMatrix, setSavingMatrix] = useState(false);
  const [matrixSavedFeedback, setMatrixSavedFeedback] = useState(false);

  // Batch Payout Modal State
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutNotes, setPayoutNotes] = useState('Weekly affiliate earnings settlement');
  const [payoutMethod, setPayoutMethod] = useState('auto');
  const [processingPayout, setProcessingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  const currentRef = partnerProfile?.ref_code || sessionUser?.ref_code || 'TM-KENYA-254';
  const currentTier = partnerProfile?.tier || sessionUser?.tier || 'partner';
  const currentRail = partnerProfile?.payout_method || sessionUser?.payout_method || 'mpesa';
  const currentAccount = partnerProfile?.payout_details?.phone || sessionUser?.payout_account || '+254712345678';
  const partnerName = partnerProfile?.name || sessionUser?.name || 'Zawadi Kiprop';

  // Load Partner specific data
  const loadPartnerData = async () => {
    setLoadingPartner(true);
    try {
      const res = await affiliatesApi.getMe(currentRef);
      if (res?.has_affiliate_account && res.affiliate) {
        setPartnerProfile(res.affiliate);
        if (res.recent_conversions) {
          setPartnerConversions(res.recent_conversions);
        }
      }
    } catch (err) {
      console.warn('Failed to load affiliate partner telemetry:', err);
    } finally {
      setLoadingPartner(false);
    }
  };

  // Load Linked Network Data
  const loadNetworkData = async () => {
    setLoadingNetwork(true);
    try {
      const res = await affiliatesApi.getNetwork(currentRef);
      if (res?.status === 'success') {
        setNetworkUsers(res.users || []);
        setNetworkStats({
          total_linked_users: res.total_linked_users || 0,
          total_roster_gmv: res.total_roster_gmv || 0.0,
          total_roster_commission: res.total_roster_commission || 0.0,
          role_breakdown: res.role_breakdown || {}
        });
      }
    } catch (err) {
      console.warn('Failed to load affiliate network:', err);
    } finally {
      setLoadingNetwork(false);
    }
  };

  // Load Academy Compliance Status
  const loadAcademyData = async () => {
    try {
      const res = await affiliatesApi.getAcademy(currentRef);
      if (res?.status === 'success') {
        setAcademyStatus({
          total_required: res.total_required || 4,
          completed_count: res.completed_count || 0,
          progress_percentage: res.progress_percentage || 0,
          all_completed: res.all_completed || false,
          completed_readings: res.completed_readings || []
        });
      }
    } catch (err) {
      console.warn('Failed to load academy status:', err);
    }
  };

  // Load all admin data
  const loadAdminData = async () => {
    setRefreshing(true);
    try {
      const [overviewRes, rosterRes, ledgerRes, matrixRes] = await Promise.all([
        affiliatesApi.admin.getOverview(),
        affiliatesApi.admin.getRoster({ search: searchQuery, tier: tierFilter, status_filter: statusFilter }),
        affiliatesApi.admin.getLedger({ ref: ledgerRefFilter, type_filter: ledgerTypeFilter }),
        affiliatesApi.getMatrix()
      ]);

      if (overviewRes?.metrics) setMetrics(overviewRes.metrics);
      if (rosterRes?.affiliates) setRoster(rosterRes.affiliates);
      if (ledgerRes?.ledger) setLedger(ledgerRes.ledger);
      if (matrixRes?.matrix) {
        setMatrixConfig(matrixRes.matrix);
        if (matrixRes.cookie_days) setCookieDays(matrixRes.cookie_days);
        if (matrixRes.min_payout_usd) setMinPayoutUsd(matrixRes.min_payout_usd);
      }
    } catch (err) {
      console.warn('Failed to load affiliate admin telemetry:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPartnerData();
    loadNetworkData();
    loadAcademyData();
    loadAdminData();
  }, [tierFilter, statusFilter, ledgerTypeFilter]);

  // Handle global action events from OnboardingStripe and Topbar notifications
  useEffect(() => {
    const onSwitchSubTab = (e) => {
      if (e?.detail?.subTab) {
        setActiveSubTab(e.detail.subTab);
      }
    };

    const onOpenAddTalent = () => {
      setActiveSubTab('network');
      setShowOnboardModal(true);
    };

    const onOpenReferralLink = () => {
      setActiveSubTab('portal');
      setTimeout(() => {
        const el = document.getElementById('affiliate-referral-link-card');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.outline = '2px solid #22d3ee';
          el.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.5)';
          setTimeout(() => {
            el.style.outline = 'none';
            el.style.boxShadow = '';
          }, 2500);
        }
      }, 100);
    };

    const onPayoutUpdated = () => {
      loadPartnerData();
    };

    window.addEventListener('tunemavens:switch-subtab', onSwitchSubTab);
    window.addEventListener('tunemavens:open-direct-talent', onOpenAddTalent);
    window.addEventListener('tunemavens:open-referral-link', onOpenReferralLink);
    window.addEventListener('tunemavens:payout-updated', onPayoutUpdated);

    return () => {
      window.removeEventListener('tunemavens:switch-subtab', onSwitchSubTab);
      window.removeEventListener('tunemavens:open-direct-talent', onOpenAddTalent);
      window.removeEventListener('tunemavens:open-referral-link', onOpenReferralLink);
      window.removeEventListener('tunemavens:payout-updated', onPayoutUpdated);
    };
  }, []);

  // Copy referral link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/?ref=${currentRef}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    }
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2500);
  };

  // Live test click tracking endpoint
  const handleTestClick = async () => {
    setTrackTesting(true);
    setTrackFeedback('');
    try {
      const res = await affiliatesApi.track(currentRef);
      if (res?.tracked) {
        setTrackFeedback(`Tracking verified! 90-day cookie active for ${res.ref_code}. Click counter recorded.`);
        await loadPartnerData();
        await loadAdminData();
      }
    } catch (err) {
      setTrackFeedback(`Tracking test error: ${err.message}`);
    } finally {
      setTrackTesting(false);
      setTimeout(() => setTrackFeedback(''), 4500);
    }
  };

  // Live backend conversion simulation verification
  const handleTriggerSimulation = async (e) => {
    if (e) e.preventDefault();
    setSimulating(true);
    setSimResult(null);
    try {
      const payload = {
        ref_code: currentRef,
        conversion_type: simCategory,
        gross_amount: simAmount ? parseFloat(simAmount) : undefined
      };
      const res = await affiliatesApi.simulateConversion(payload);
      if (res?.status === 'success') {
        setSimResult(res);
        await loadPartnerData();
        await loadNetworkData();
        await loadAdminData();
      }
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  // Direct User / Creator Onboarding Handler
  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!onboardForm.name || !onboardForm.email) {
      alert('Please provide a name and valid email address.');
      return;
    }
    setOnboardingSubmitting(true);
    setOnboardSuccessData(null);
    try {
      const payload = {
        ref_code: currentRef,
        name: onboardForm.name,
        email: onboardForm.email,
        role: onboardForm.role,
        handle: onboardForm.handle,
        region: onboardForm.region,
        split_incentive: onboardForm.split_incentive,
        notes: onboardForm.notes
      };
      const res = await affiliatesApi.onboardUser(payload);
      if (res?.status === 'success') {
        setOnboardSuccessData(res);
        await loadNetworkData();
        await loadPartnerData();
        await loadAdminData();
        setOnboardForm({
          name: '',
          email: '',
          role: 'creator',
          handle: '',
          region: 'Nairobi, Kenya',
          split_incentive: 'Standard Matrix (3% - 12%)',
          notes: ''
        });
      }
    } catch (err) {
      alert(`Onboarding failed: ${err.message}`);
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  // Acknowledge Required Reading Article
  const handleAcknowledgeArticle = async (articleId) => {
    setAcknowledgingId(articleId);
    try {
      const res = await affiliatesApi.acknowledgeReading({
        ref_code: currentRef,
        article_id: articleId,
        acknowledged: true
      });
      if (res?.status === 'success') {
        await loadAcademyData();
      }
    } catch (err) {
      alert(`Failed to acknowledge: ${err.message}`);
    } finally {
      setAcknowledgingId(null);
    }
  };

  // Copy Onboard Invite URL
  const handleCopyInviteUrl = (url) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedInviteUrl(true);
    setTimeout(() => setCopiedInviteUrl(false), 2500);
  };

  // Handle Search on Roster
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    affiliatesApi.admin.getRoster({ search: searchQuery, tier: tierFilter, status_filter: statusFilter })
      .then(res => { if (res?.affiliates) setRoster(res.affiliates); })
      .catch(() => {});
  };

  // Toggle Affiliate Status
  const handleToggleStatus = async (affiliateId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await affiliatesApi.admin.updateStatus(affiliateId, { status_val: nextStatus });
      setRoster(prev => prev.map(a => a.id === affiliateId ? { ...a, status: nextStatus } : a));
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Change Tier Level
  const handleChangeTier = async (affiliateId, newTier) => {
    try {
      await affiliatesApi.admin.updateStatus(affiliateId, { tier_val: newTier });
      setRoster(prev => prev.map(a => a.id === affiliateId ? { ...a, tier: newTier } : a));
    } catch (err) {
      alert(`Failed to update tier: ${err.message}`);
    }
  };

  // Save Matrix Configuration
  const handleSaveMatrix = async (e) => {
    e.preventDefault();
    setSavingMatrix(true);
    try {
      await affiliatesApi.admin.updateMatrix({
        matrix: matrixConfig,
        cookie_days: Number(cookieDays),
        min_payout_usd: Number(minPayoutUsd)
      });
      setMatrixSavedFeedback(true);
      setTimeout(() => setMatrixSavedFeedback(false), 3000);
    } catch (err) {
      alert(`Failed to save matrix: ${err.message}`);
    } finally {
      setSavingMatrix(false);
    }
  };

  // Handle Matrix Rate Change in state
  const handleRateChange = (index, newRate) => {
    setMatrixConfig(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], rate_percent: parseFloat(newRate) || 0 };
      return copy;
    });
  };

  // Execute Batch Payout
  const handleExecutePayout = async () => {
    setProcessingPayout(true);
    setPayoutSuccessMsg('');
    try {
      const res = await affiliatesApi.admin.executePayout({
        method: payoutMethod,
        notes: payoutNotes
      });

      if (res.status === 'success') {
        setPayoutSuccessMsg(`Successfully disbursed $${res.total_disbursed_usd} to ${res.affiliates_paid} affiliates.`);
        setTimeout(() => {
          setShowPayoutModal(false);
          setPayoutSuccessMsg('');
          loadAdminData();
          loadPartnerData();
        }, 2200);
      } else {
        alert(res.message || 'No pending balances to settle.');
      }
    } catch (err) {
      alert(`Payout failed: ${err.message}`);
    } finally {
      setProcessingPayout(false);
    }
  };

  // Filter linked network users
  const filteredNetworkUsers = networkUsers.filter(u => {
    if (networkRoleFilter !== 'all' && u.role !== networkRoleFilter) return false;
    if (networkSearchQuery.trim()) {
      const q = networkSearchQuery.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.handle && u.handle.toLowerCase().includes(q)) ||
        (u.region && u.region.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="affiliate-admin-panel">
      
      {/* Header Bar */}
      <div className="aff-admin-header">
        <div>
          <div className="header-badge">Ecosystem Affiliate Operations</div>
          <h2>Affiliate Scheme &amp; Commission Hub</h2>
          <p>
            Track referral clicks, monitor multi-stream attributions across the 3%–12% matrix, onboard creators and labels, and review academy compliance.
          </p>
        </div>
        <div className="aff-header-actions">
          <button 
            className="btn-secondary aff-refresh-btn"
            onClick={() => { loadAdminData(); loadPartnerData(); loadNetworkData(); loadAcademyData(); }} 
            disabled={refreshing || loadingPartner || loadingNetwork}
            title="Refresh Telemetry"
          >
            <RiRefreshLine className={refreshing || loadingPartner || loadingNetwork ? 'spin' : ''} /> Refresh Telemetry
          </button>
          {isAdminUser && (
            <button 
              className="btn-primary aff-payout-btn"
              onClick={() => setShowPayoutModal(true)}
              disabled={metrics.pending_commission_payable <= 0}
            >
              <RiCoinsFill /> Batch Payout (${metrics.pending_commission_payable.toFixed(2)})
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="aff-subnav-bar">
        <button 
          className={`aff-subnav-btn ${activeSubTab === 'portal' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('portal')}
          data-testid="subnav-affiliate-portal"
        >
          <RiCoinsFill /> Partner Console &amp; Verification
        </button>
        <button 
          className={`aff-subnav-btn ${activeSubTab === 'network' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('network')}
          data-testid="subnav-affiliate-network"
        >
          <RiTeamFill /> Linked Network &amp; Onboarding ({networkUsers.length})
        </button>
        <button 
          className={`aff-subnav-btn ${activeSubTab === 'academy' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('academy')}
          data-testid="subnav-affiliate-academy"
        >
          <RiGraduationCapFill /> Academy &amp; Recommended Reading
          <span className={`academy-subnav-pill ${academyStatus.all_completed ? 'completed' : 'pending'}`}>
            {academyStatus.completed_count}/{academyStatus.total_required} Read
          </span>
        </button>
        {isAdminUser && (
          <>
            <button 
              className={`aff-subnav-btn ${activeSubTab === 'roster' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('roster')}
              data-testid="subnav-affiliates-roster"
            >
              <RiUserSharedFill /> Affiliates Directory ({roster.length})
            </button>
            <button 
              className={`aff-subnav-btn ${activeSubTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('ledger')}
              data-testid="subnav-affiliates-ledger"
            >
              <RiFileList3Line /> Attribution Ledger ({ledger.length})
            </button>
            <button 
              className={`aff-subnav-btn ${activeSubTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('matrix')}
              data-testid="subnav-affiliates-matrix"
            >
              <RiSettings4Line /> 3%–12% Matrix Config
            </button>
          </>
        )}
      </div>

      {/* ================= SubTab 1: Partner Console & Verification ================= */}
      {activeSubTab === 'portal' && (
        <div className="aff-partner-portal-section">
          
          {/* Zero Credits Affiliate Assurance Banner */}
          <div className="aff-credit-assurance-banner">
            <div className="assurance-icon-box">
              <RiShieldCheckFill size={22} color="#22d3ee" />
            </div>
            <div className="assurance-content">
              <div className="assurance-headline">
                <strong>Zero Platform Credits Required for Affiliate Management</strong>
                <span className="assurance-pill">100% Free Forever</span>
              </div>
              <p>
                Navigating your Affiliate Console, generating tracking links, tracking attributed sales, and onboarding talent cost <strong>0 platform credits</strong>. Unified Platform Credits only apply should you voluntarily choose to use creative tools (such as MasterLab AI audio mastering, SyncMavens pitching, or custom domain hosting).
              </p>
            </div>
          </div>

          {/* Partner Identity & Link Card */}
          <div className="aff-partner-card">
            <div className="aff-partner-top">
              <div className="aff-partner-info">
                <div className="aff-partner-avatar">
                  <RiCoinsFill size={24} color="#22d3ee" />
                </div>
                <div>
                  <div className="aff-partner-name-row">
                    <h3>{partnerName}</h3>
                    <span className="badge-ref-code">{currentRef}</span>
                    <span className="badge-tier-level">{currentTier.toUpperCase()} TIER (+1.0% Matrix Bonus)</span>
                    <span className="badge-status-active">Active Partner</span>
                  </div>
                  <div className="aff-partner-details-sub">
                    <span>
                      Payout Rail: <strong>{currentRail.toUpperCase()} STK Push ({currentAccount})</strong>
                      <button 
                        type="button" 
                        onClick={() => window.dispatchEvent(new CustomEvent('tunemavens:open-payout-settings'))}
                        style={{ marginLeft: '8px', padding: '2px 7px', fontSize: '10px', fontWeight: 800, background: 'rgba(34, 211, 238, 0.15)', border: '1px solid rgba(34, 211, 238, 0.4)', color: '#22d3ee', borderRadius: '2px', cursor: 'pointer' }}
                        title="Configure M-Pesa STK or Bank Rails"
                      >
                        Edit Rails
                      </button>
                    </span>
                    <span className="dot-sep">•</span>
                    <span>Tracking Window: <strong>90 Days Cookie</strong></span>
                    <span className="dot-sep">•</span>
                    <span>Region: <strong>Kenya / East Africa (KES / USD)</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link & Verification Bar */}
            <div className="aff-link-toolbar" id="affiliate-referral-link-card">
              <div className="aff-link-box">
                <span className="aff-link-label">Your Live Referral Link:</span>
                <input 
                  type="text" 
                  readOnly 
                  value={`${window.location.origin}/?ref=${currentRef}`} 
                  className="aff-link-input"
                />
                <button 
                  type="button" 
                  className="btn-primary aff-copy-btn"
                  onClick={handleCopyLink}
                >
                  <RiFileCopyLine /> {copyFeedback ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <div className="aff-test-actions">
                <button 
                  type="button" 
                  className="btn-secondary aff-test-click-btn"
                  onClick={handleTestClick}
                  disabled={trackTesting}
                  title="Ping backend /api/affiliates/track to verify 90-day cookie & click counter"
                >
                  <RiFlashlightLine /> {trackTesting ? 'Verifying Click...' : 'Test Track Click'}
                </button>
              </div>
            </div>

            {trackFeedback && (
              <div className="feedback-banner success" style={{ marginTop: '14px' }}>
                <RiCheckboxCircleFill /> {trackFeedback}
              </div>
            )}
          </div>

          {/* Partner Metrics KPI Grid */}
          <div className="aff-kpi-grid">
            <div className="aff-kpi-card">
              <span className="kpi-label">Total Referral Clicks</span>
              <div className="kpi-value-row">
                <span className="kpi-num">{partnerProfile?.clicks_count ?? 841}</span>
                <span className="kpi-sub">live hits tracked</span>
              </div>
            </div>

            <div className="aff-kpi-card">
              <span className="kpi-label">Referred Conversions</span>
              <div className="kpi-value-row">
                <span className="kpi-num">{partnerProfile?.conversions_count ?? 50}</span>
                <span className="kpi-sub">
                  {partnerProfile?.clicks_count ? ((partnerProfile.conversions_count / partnerProfile.clicks_count) * 100).toFixed(1) : '5.9'}% conversion
                </span>
              </div>
            </div>

            <div className="aff-kpi-card">
              <span className="kpi-label">Attributed Gross GMV</span>
              <div className="kpi-value-row">
                <span className="kpi-num">${(partnerProfile?.total_gmv ?? 5259.98).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="kpi-sub">ecosystem volume</span>
              </div>
            </div>

            <div className="aff-kpi-card highlight-payable">
              <span className="kpi-label">Pending Payout Balance</span>
              <div className="kpi-value-row">
                <span className="kpi-num cyan">${(partnerProfile?.pending_payout ?? 114.10).toFixed(2)}</span>
                <span className="kpi-sub amber">M-Pesa STK ready</span>
              </div>
            </div>

            <div className="aff-kpi-card">
              <span className="kpi-label">Total Lifetime Paid Out</span>
              <div className="kpi-value-row">
                <span className="kpi-num green">${(partnerProfile?.paid_payout ?? 376.00).toFixed(2)}</span>
                <span className="kpi-sub">settled to wallet</span>
              </div>
            </div>
          </div>

          {/* Interactive Backend Verification Sandbox */}
          <div className="aff-verification-sandbox-card">
            <div className="sandbox-card-header">
              <div className="sandbox-badge">Backend Verification Sandbox</div>
              <h3>Simulate Ecosystem Purchase &amp; Test Live Attribution</h3>
              <p>
                Verify real-time backend ledger attribution across the 3%–12% matrix. Select a transaction type below and click <strong>Simulate Conversion</strong> to call <code>/api/affiliates/simulate-conversion</code>.
              </p>
            </div>

            <form onSubmit={handleTriggerSimulation} className="sandbox-form">
              <div className="sandbox-categories-grid">
                {[
                  { id: 'stream_pool', label: 'TuneStream 100k Plays', basis: '$400 basis', rate: '4.0%', amt: '400.00', icon: RiHeadphoneFill },
                  { id: 'single_lossless', label: 'Lossless Track Download', basis: '$1.99', rate: '6.0%', amt: '1.99', icon: RiMusicFill },
                  { id: 'album_sale', label: 'Full Album & Stems', basis: '$9.99', rate: '8.0%', amt: '9.99', icon: RiDiscFill },
                  { id: 'stems_pack', label: 'Producer Stems Kit', basis: '$49.00', rate: '9.5%', amt: '49.00', icon: RiEqualizerFill },
                  { id: 'ticket_pass', label: 'VIP Tour Pass (M-Pesa)', basis: '$50.00', rate: '11.0%', amt: '50.00', icon: RiTicket2Fill },
                  { id: 'sync_placement', label: 'Commercial Sync License', basis: '$2,500.00', rate: '12.0% ($300 cap)', amt: '2500.00', icon: RiGlobalFill },
                  { id: 'creator_onboarding', label: '1,000 Unified Credits Top-Up', basis: '$100.00', rate: '12.0%', amt: '100.00', icon: RiCoinsFill }
                ].map(cat => {
                  const Icon = cat.icon;
                  const isSelected = simCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`sandbox-cat-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => { setSimCategory(cat.id); setSimAmount(cat.amt); }}
                    >
                      <span className="cat-icon"><Icon /></span>
                      <div className="cat-info">
                        <span className="cat-label">{cat.label}</span>
                        <span className="cat-meta">{cat.basis} • <strong>{cat.rate}</strong></span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="sandbox-submit-row">
                <div className="sandbox-custom-amt">
                  <label>Override Transaction Amount ($):</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.5" 
                    placeholder="Auto from category"
                    value={simAmount}
                    onChange={(e) => setSimAmount(e.target.value)}
                    className="aff-form-input"
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary sandbox-exec-btn"
                  disabled={simulating}
                >
                  <RiCoinsFill /> {simulating ? 'Processing Backend Attribution...' : 'Simulate Attributed Conversion'}
                </button>
              </div>
            </form>

            {simResult && (
              <div className="sandbox-result-box">
                <div className="result-header">
                  <RiCheckboxCircleFill color="#10b981" size={20} />
                  <strong>Backend Verified: {simResult.message}</strong>
                </div>
                <div className="result-grid">
                  <div><strong>Transaction ID:</strong> <code>{simResult.conversion?.tx_id}</code></div>
                  <div><strong>Attributed Ref:</strong> <code>{simResult.conversion?.ref_code}</code></div>
                  <div><strong>Product:</strong> {simResult.conversion?.type_label} ({simResult.conversion?.item_title})</div>
                  <div><strong>Gross GMV:</strong> ${simResult.conversion?.gross_amount?.toFixed(2)}</div>
                  <div><strong>Effective Rate:</strong> {simResult.conversion?.commission_rate}%</div>
                  <div><strong>Commission Earned:</strong> <span className="cyan font-bold">${simResult.conversion?.commission_amount?.toFixed(2)}</span></div>
                  <div><strong>New Pending Payout:</strong> <span className="green font-bold">${simResult.affiliate?.pending_payout?.toFixed(2)}</span></div>
                  <div><strong>Buyer Info:</strong> {simResult.conversion?.buyer_info}</div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Attributed Conversions Table */}
          <div className="aff-partner-conversions-card">
            <div className="conversions-header-row">
              <h3>My Recent Attributed Conversions ({partnerConversions.length})</h3>
              <span className="conversions-hint">Instant real-time ledger entries from TuneStream, SyncMavens, and EPKs</span>
            </div>

            <div className="aff-table-wrapper">
              <table className="aff-admin-table">
                <thead>
                  <tr>
                    <th>Date / Time</th>
                    <th>Transaction ID</th>
                    <th>Category &amp; Item</th>
                    <th>Buyer / Region</th>
                    <th>Gross Sale</th>
                    <th>Commission Rate</th>
                    <th>Net Commission</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerConversions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="empty-table-cell">No conversions recorded yet. Use the sandbox above to simulate one!</td>
                    </tr>
                  ) : (
                    partnerConversions.map(conv => (
                      <tr key={conv.id || conv.tx_id}>
                        <td className="time-cell">
                          {new Date(conv.created_at || Date.now()).toLocaleDateString()} {new Date(conv.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td><code className="tx-code">{conv.tx_id}</code></td>
                        <td>
                          <strong>{conv.type_label}</strong>
                          <span className="item-title-sub">{conv.item_title}</span>
                        </td>
                        <td><span className="user-email">{conv.buyer_info}</span></td>
                        <td><strong>${conv.gross_amount?.toFixed(2)}</strong></td>
                        <td><span className="rate-badge">{conv.commission_rate}%</span></td>
                        <td><span className="comm-amt cyan">+${conv.commission_amount?.toFixed(2)}</span></td>
                        <td><span className="status-badge active"><RiCheckboxCircleFill size={11} /> Cleared</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3%–12% Compensation Matrix Table Reference */}
          <div className="aff-matrix-reference-card">
            <div className="matrix-ref-header">
              <h3>TuneMavens Multi-Stream 3%–12% Compensation Matrix</h3>
              <p>Transparent commission tiers modeled around Ditto Music, adapted for East African creator economics.</p>
            </div>

            <div className="aff-table-wrapper">
              <table className="aff-admin-table">
                <thead>
                  <tr>
                    <th>Revenue Stream</th>
                    <th>Channel</th>
                    <th>Base Commission</th>
                    <th>Partner Tier Bonus</th>
                    <th>Example Attribution</th>
                  </tr>
                </thead>
                <tbody>
                  {(matrixConfig.length > 0 ? matrixConfig : [
                    { category: 'Streaming & Micro-Tipping', channel: 'TuneStream', rate_percent: 3.0, bonus: '4.0%', example: '100k Streams ($400 net royalty) → $16.00 Affiliate Commission' },
                    { category: 'Lossless Track Downloads', channel: 'Creator EPK & Storefront', rate_percent: 5.0, bonus: '6.0%', example: 'Single track purchase ($1.99) → $0.12 Affiliate Commission' },
                    { category: 'Full Album Showcase', channel: 'TuneStream & EPK', rate_percent: 7.0, bonus: '8.0%', example: 'Full album purchase ($9.99) → $0.80 Affiliate Commission' },
                    { category: 'Multitrack Stems & Producer Kits', channel: 'SyncMavens & Industry Hub', rate_percent: 8.5, bonus: '9.5%', example: 'Producer stems kit ($49.00) → $4.66 Affiliate Commission' },
                    { category: 'Digital QR Passes & Tours', channel: 'TuneTours & M-Pesa Live Push', rate_percent: 10.0, bonus: '11.0%', example: 'VIP Tour Pass ($50.00) → $5.50 Affiliate Commission' },
                    { category: 'Commercial Sync Licensing', channel: 'SyncMavens Brief Matching Hub', rate_percent: 12.0, bonus: '12.0%', example: 'Commercial sync license ($2,500 fee) → $300.00 Max Cap' },
                    { category: 'Creator Onboarding & Credits', channel: 'Intermaven Network', rate_percent: 12.0, bonus: '12.0%', example: '1,000 Credits Reload ($100 pack) → $12.00 Commission' }
                  ]).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td><strong>{item.category}</strong></td>
                      <td><span className="item-type-label">{item.channel}</span></td>
                      <td><span className="rate-badge">{item.rate_percent}% Base</span></td>
                      <td><span className="rate-badge cyan">{item.tier_bonuses?.partner ? `${item.tier_bonuses.partner}%` : (item.bonus || `${(item.rate_percent + 1.0).toFixed(1)}%`)}</span></td>
                      <td className="desc-preview">{item.example_calc || item.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}


      {/* ================= SubTab 2: Linked Network & Direct Onboarding ================= */}
      {activeSubTab === 'network' && (
        <div className="aff-network-section">
          
          {/* Network Summary Bar */}
          <div className="network-summary-grid">
            <div className="network-stat-card">
              <span className="network-stat-label">Total Linked Users</span>
              <div className="network-stat-val">{networkStats.total_linked_users}</div>
              <span className="network-stat-sub">active creators &amp; labels</span>
            </div>
            <div className="network-stat-card">
              <span className="network-stat-label">Roster Catalog GMV</span>
              <div className="network-stat-val">${networkStats.total_roster_gmv.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <span className="network-stat-sub">ecosystem volume driven</span>
            </div>
            <div className="network-stat-card">
              <span className="network-stat-label">Affiliate Commission Earned</span>
              <div className="network-stat-val cyan">${networkStats.total_roster_commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <span className="network-stat-sub">lifetime yield from roster</span>
            </div>
            <div className="network-stat-card action-card">
              <button 
                type="button" 
                className="btn-primary aff-open-onboard-btn"
                onClick={() => { setShowOnboardModal(true); setOnboardSuccessData(null); }}
              >
                <RiUserAddFill size={16} /> Direct Onboard Creator / Label
              </button>
            </div>
          </div>

          {/* Controls & Filter Bar */}
          <div className="aff-controls-bar">
            <div className="aff-search-box">
              <RiSearchLine className="search-icon" />
              <input 
                type="text" 
                placeholder="Search linked creators by name, handle, email, or town..."
                value={networkSearchQuery}
                onChange={(e) => setNetworkSearchQuery(e.target.value)}
                className="aff-search-input"
              />
            </div>

            <div className="network-role-pills">
              {[
                { id: 'all', label: 'All Users', count: networkUsers.length },
                { id: 'creator', label: 'Artists & Creators', count: networkStats.role_breakdown.creator || 0 },
                { id: 'label', label: 'Record Labels', count: networkStats.role_breakdown.label || 0 },
                { id: 'supervisor', label: 'Music Supervisors', count: networkStats.role_breakdown.supervisor || 0 },
                { id: 'corporate', label: 'Brands & Sponsors', count: networkStats.role_breakdown.corporate || 0 },
                { id: 'affiliate', label: 'Sub-Affiliates', count: networkStats.role_breakdown.affiliate || 0 }
              ].map(pill => (
                <button
                  key={pill.id}
                  type="button"
                  className={`network-filter-pill ${networkRoleFilter === pill.id ? 'active' : ''}`}
                  onClick={() => setNetworkRoleFilter(pill.id)}
                >
                  {pill.label} ({pill.count})
                </button>
              ))}
            </div>
          </div>

          {/* Linked Users Table */}
          <div className="aff-table-wrapper">
            <table className="aff-admin-table">
              <thead>
                <tr>
                  <th>User &amp; Brand</th>
                  <th>Account Type / Role</th>
                  <th>Region &amp; Origin</th>
                  <th>Catalog &amp; Streams</th>
                  <th>Attributed GMV</th>
                  <th>Affiliate Yield</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNetworkUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty-table-cell">No linked users found matching filter criteria. Click "Direct Onboard Creator / Label" to add your first talent!</td>
                  </tr>
                ) : (
                  filteredNetworkUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="aff-user-info">
                          <div className="network-user-avatar" style={{ background: `${user.avatar_color || '#22d3ee'}22`, borderColor: user.avatar_color || '#22d3ee' }}>
                            {user.role === 'label' ? <RiBuilding4Fill color={user.avatar_color} /> : <RiMicFill color={user.avatar_color} />}
                          </div>
                          <div>
                            <strong>{user.name}</strong>
                            <span className="user-email">{user.email}</span>
                            {user.handle && <span className="user-handle">{user.handle}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`network-role-badge role-${user.role}`}>
                          {user.role_label || user.role}
                        </span>
                        <span className="network-incentive-sub">{user.split_incentive}</span>
                      </td>
                      <td>
                        <span className="network-region-text"><RiGlobalFill size={12} /> {user.region}</span>
                      </td>
                      <td>
                        <div className="catalog-streams-cell">
                          <strong>{user.releases_count ?? 0} Releases</strong>
                          <span className="streams-count-sub">{(user.streams_count ?? 0).toLocaleString()} Streams</span>
                        </div>
                      </td>
                      <td>
                        <strong className="network-gmv-val">${(user.gross_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                      </td>
                      <td>
                        <span className="comm-amt cyan font-bold">+${(user.commission_generated ?? 0).toFixed(2)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status === 'catalog_live' ? 'active' : user.status}`}>
                          {user.status === 'catalog_live' ? 'Catalog Live' : user.status}
                        </span>
                      </td>
                      <td>
                        <span className="last-active-sub">{user.last_active || 'Recent'}</span>
                      </td>
                      <td>
                        <button 
                          type="button" 
                          className="btn-secondary btn-copy-invite-row"
                          onClick={() => handleCopyInviteUrl(`https://tunemavens.com/#/join?ref=${currentRef}&invite=${user.invitation_token || 'DIRECT'}&role=${user.role}`)}
                          title="Copy Direct Invitation Link for this Creator"
                        >
                          <RiShareLine size={13} /> Invite Link
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Onboarding Modal Overlay */}
          {showOnboardModal && (
            <div className="aff-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowOnboardModal(false); }}>
              <div className="aff-modal-card onboard-modal-card">
                <div className="aff-modal-header">
                  <div className="aff-modal-title-box">
                    <span className="modal-eyebrow">Roster Expansion Protocol</span>
                    <h3>Directly Onboard Creator, Label, or Partner</h3>
                  </div>
                  <button className="aff-modal-close" onClick={() => setShowOnboardModal(false)}>
                    <RiCloseLine size={20} />
                  </button>
                </div>

                <div className="aff-modal-body">
                  {onboardSuccessData ? (
                    <div className="onboard-success-box">
                      <RiCheckboxCircleFill size={48} color="#10b981" />
                      <h4>Talent Successfully Linked!</h4>
                      <p>{onboardSuccessData.message}</p>
                      
                      <div className="invite-url-box">
                        <label>One-Click Onboarding Invitation URL:</label>
                        <div className="url-copy-row">
                          <input type="text" readOnly value={onboardSuccessData.invite_url} className="aff-link-input" />
                          <button 
                            type="button" 
                            className="btn-primary aff-copy-btn"
                            onClick={() => handleCopyInviteUrl(onboardSuccessData.invite_url)}
                          >
                            <RiFileCopyLine /> {copiedInviteUrl ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <span className="invite-url-hint">
                          Send this direct link via WhatsApp, email, or SMS. When clicked, their account claims with your referral pre-bound!
                        </span>
                      </div>

                      <div className="modal-actions-row" style={{ marginTop: '20px' }}>
                        <button 
                          type="button" 
                          className="btn-primary" 
                          onClick={() => { setOnboardSuccessData(null); setShowOnboardModal(false); }}
                        >
                          Done &amp; View in Network
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleOnboardSubmit} className="onboard-form">
                      <div className="onboard-credit-notice">
                        <RiShieldCheckLine size={16} color="#22d3ee" />
                        <span>Direct talent onboarding is completely free and deducts <strong>0 platform credits</strong> from your balance.</span>
                      </div>

                      <div className="form-group-2">
                        <div className="form-group">
                          <label>Full Name / Stage Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Maya Wendo"
                            value={onboardForm.name}
                            onChange={(e) => setOnboardForm({ ...onboardForm, name: e.target.value })}
                            className="aff-form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Contact Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="e.g. maya@music.co.ke"
                            value={onboardForm.email}
                            onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                            className="aff-form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group-2" style={{ marginTop: '14px' }}>
                        <div className="form-group">
                          <label>Account Type / Industry Role</label>
                          <select 
                            value={onboardForm.role}
                            onChange={(e) => setOnboardForm({ ...onboardForm, role: e.target.value })}
                            className="aff-form-select"
                          >
                            <option value="creator">Recording Artist &amp; Producer</option>
                            <option value="label">Independent Record Label</option>
                            <option value="supervisor">Music Supervisor / Post House</option>
                            <option value="corporate">Corporate Brand Sponsor</option>
                            <option value="affiliate">Sub-Affiliate / Campus Scout</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Social Handle / Brand</label>
                          <input 
                            type="text" 
                            placeholder="e.g. @mayawendo"
                            value={onboardForm.handle}
                            onChange={(e) => setOnboardForm({ ...onboardForm, handle: e.target.value })}
                            className="aff-form-input"
                          />
                        </div>
                      </div>

                      {/* Role-Specific Recommended Reading Guidance */}
                      <div className="onboard-recommended-doc-hint">
                        <RiBookOpenLine size={15} color="#22d3ee" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong>Recommended Onboarding Reading for this Role (Not Required):</strong>{' '}
                          {onboardForm.role === 'creator' && <span>"The Two Halves of Music Copyright: Master Rights vs. Composition Rights"</span>}
                          {onboardForm.role === 'label' && <span>"TuneLedger & Split Cascade: Automated Multi-Currency Royalty Payouts"</span>}
                          {onboardForm.role === 'supervisor' && <span>"Sync Licensing Masterclass: Securing Placements in Film & TV"</span>}
                          {onboardForm.role === 'corporate' && <span>"Corporate Ads & Brand Flight Sponsorships"</span>}
                          {onboardForm.role === 'affiliate' && <span>"The TuneMavens Affiliate Scheme: 3% to 12% Multi-Stream Commissions"</span>}
                          <span className="doc-hint-sub"> · Included as optional reading in their one-click invite URL with zero required gates.</span>
                        </div>
                      </div>

                      <div className="form-group-2" style={{ marginTop: '14px' }}>
                        <div className="form-group">
                          <label>City &amp; Region</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Nairobi, Kenya"
                            value={onboardForm.region}
                            onChange={(e) => setOnboardForm({ ...onboardForm, region: e.target.value })}
                            className="aff-form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label>Split / Incentive Program</label>
                          <select 
                            value={onboardForm.split_incentive}
                            onChange={(e) => setOnboardForm({ ...onboardForm, split_incentive: e.target.value })}
                            className="aff-form-select"
                          >
                            <option value="Standard Matrix (3% - 12%)">Standard Matrix (3% - 12%)</option>
                            <option value="Partner Label Tier (+1% Bonus)">Partner Label Tier (+1% Bonus)</option>
                            <option value="12% Corporate Ad Placement">12% Corporate Ad Placement</option>
                            <option value="Special 10% Onboarding Bonus">Special 10% Onboarding Bonus</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '14px' }}>
                        <label>Onboarding Notes / Background</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Met at Nairobi Live Jam session; releasing 10-track Afro-House album."
                          value={onboardForm.notes}
                          onChange={(e) => setOnboardForm({ ...onboardForm, notes: e.target.value })}
                          className="aff-form-input"
                        />
                      </div>

                      <div className="modal-form-actions" style={{ marginTop: '20px' }}>
                        <button 
                          type="submit" 
                          className="btn-primary aff-execute-payout-btn"
                          disabled={onboardingSubmitting}
                        >
                          <RiUserAddFill /> {onboardingSubmitting ? 'Registering & Generating Link...' : 'Register User & Generate Instant Link'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}


      {/* ================= SubTab 3: Affiliate Academy & Recommended Reading ================= */}
      {activeSubTab === 'academy' && (
        <div className="aff-academy-section">
          
          {/* Academy Progress Banner */}
          <div className="academy-progress-card">
            <div className="academy-progress-top">
              <div>
                <span className="academy-badge">Official Partner Playbook · Not Required to Start Earning</span>
                <h3>Affiliate Academy &amp; Recommended Reading Standards</h3>
                <p>
                  To empower your partner growth and safeguard creator rights under CAK and FTC regulations, reviewing these four core operational modules is strongly recommended (not required) as part of your onboarding. All affiliate tools, referral links, and payouts remain 100% unlocked from Day 1.
                </p>
              </div>
              <div className="academy-status-box">
                <span className="academy-pct-number">{academyStatus.progress_percentage}%</span>
                <span className={`academy-compliance-pill ${academyStatus.all_completed ? 'certified' : 'pending'}`}>
                  {academyStatus.all_completed ? 'Certified Partner' : 'Recommended (Optional)'}
                </span>
                <span className="academy-counts-sub">
                  {academyStatus.completed_count} of {academyStatus.total_required} Modules Completed
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="academy-progress-track">
              <div 
                className="academy-progress-fill" 
                style={{ width: `${academyStatus.progress_percentage}%` }}
              />
            </div>
          </div>

          {/* Required Reading Cards Grid */}
          <div className="academy-cards-grid">
            {[
              {
                id: 'affiliate-program-guide',
                title: 'The TuneMavens Affiliate Scheme: 3% to 12% Multi-Stream Commissions',
                time: '7 min read',
                tag: 'Ditto-Modeled Matrix',
                summary: 'Comprehensive breakdown of how multi-stream commissions operate across TuneStream playback, lossless track sales, multitrack producer stems, VIP tour passes, sync deals, and credit reloads.',
                highlights: [
                  'Full 3% to 12% compensation matrix breakdown by channel',
                  'Zero credits required for affiliate console & link management',
                  'Persistent 90-day cross-subdomain cookie attribution protocol',
                  'Scout, Partner (+1%), and Ambassador (+2%) tier milestones'
                ]
              },
              {
                id: 'onboarding-creators-and-labels',
                title: 'Onboarding Creators, Labels & Partners: The Affiliate Roster Playbook',
                time: '8 min read',
                tag: 'Roster & Direct Linking',
                summary: 'Operational guide on how affiliates directly onboard recording artists and independent record labels from their backend console, configure Split Cascades, and track catalog commerce.',
                highlights: [
                  'Direct backend onboarding vs. public referral URL workflows',
                  '100% free talent onboarding (0 credits deducted from balance)',
                  'Pitching zero subscription distribution and MasterLab AI mastering',
                  'Managing and monitoring linked creator and label accounts'
                ]
              },
              {
                id: 'affiliate-payouts-mpesa-settlement',
                title: 'Affiliate Payout Rails & M-Pesa STK Settlement Guide (Kenya & East Africa)',
                time: '6 min read',
                tag: 'M-Pesa STK & Settlement',
                summary: 'Deep-dive into payout rails, automated M-Pesa B2C STK pushes for Kenyan mobile numbers, $20 USD minimum threshold, currency conversion, and TuneLedger audit records.',
                highlights: [
                  'Direct M-Pesa STK push integration with Safaricom B2C rails',
                  'Instant zero-hold clearance on streaming royalties vs. 7-day card hold',
                  'Minimum $20 payout threshold and automated weekly disbursements'
                ]
              },
              {
                id: 'affiliate-compliance-promotional-ethics',
                title: 'Affiliate Compliance, Disclosures & Ethical Promotional Standards',
                time: '5 min read',
                tag: 'Compliance & CAK Rules',
                summary: 'Regulatory disclosure standards under the Competition Authority of Kenya (CAK) and FTC, strict prohibitions against spam and deceptive claims, and copyright integrity guidelines.',
                highlights: [
                  'Mandatory #ad / #affiliate transparency guidelines across social media',
                  'Strict prohibitions on unsolicited spam and false streaming promises',
                  'Intellectual property safety, brand protection, and audit protocols'
                ]
              }
            ].map(module => {
              const isAcknowledged = academyStatus.completed_readings.includes(module.id);
              const isAcknowledging = acknowledgingId === module.id;

              return (
                <div key={module.id} className={`academy-module-card ${isAcknowledged ? 'acknowledged' : ''}`}>
                  <div className="module-card-top">
                    <div className="module-badge-row">
                      <span className="module-tag">{module.tag}</span>
                      <span className="module-time"><RiTimeLine size={12} /> {module.time}</span>
                      {isAcknowledged ? (
                        <span className="module-status-badge acknowledged"><RiCheckboxCircleFill size={12} /> Verified</span>
                      ) : (
                        <span className="module-status-badge recommended">Recommended Reading</span>
                      )}
                    </div>
                    <h4>{module.title}</h4>
                    <p className="module-summary">{module.summary}</p>
                  </div>

                  <div className="module-highlights-box">
                    <span className="highlights-label">Key Competencies:</span>
                    <ul>
                      {module.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="module-actions-row">
                    <button 
                      type="button" 
                      className="btn-secondary module-read-btn"
                      onClick={() => setActiveReadingDocId(module.id)}
                    >
                      <RiBookOpenFill /> Read Full Guide
                    </button>
                    
                    <button 
                      type="button" 
                      className={`module-ack-btn ${isAcknowledged ? 'is-acked' : ''}`}
                      onClick={() => handleAcknowledgeArticle(module.id)}
                      disabled={isAcknowledged || isAcknowledging}
                    >
                      {isAcknowledged ? (
                        <><RiCheckboxCircleFill color="#10b981" /> Completed</>
                      ) : (
                        <><RiCheckLine /> {isAcknowledging ? 'Confirming...' : 'Mark as Read (Optional)'}</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}


      {/* ================= Tab 4: Affiliates Directory (Admin Only) ================= */}
      {activeSubTab === 'roster' && isAdminUser && (
        <div className="aff-admin-section">
          {/* Controls Bar */}
          <div className="aff-controls-bar">
            <form onSubmit={handleSearchSubmit} className="aff-search-box">
              <RiSearchLine className="search-icon" />
              <input 
                type="text" 
                placeholder="Search by affiliate name, ref code, email, or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aff-search-input"
              />
              <button type="submit" className="btn-secondary aff-search-submit">Search</button>
            </form>

            <div className="aff-filters-row">
              <select 
                value={tierFilter} 
                onChange={(e) => setTierFilter(e.target.value)}
                className="aff-filter-select"
              >
                <option value="all">All Tiers</option>
                <option value="scout">Scout Tier</option>
                <option value="partner">Partner Tier (+1.0%)</option>
                <option value="ambassador">Ambassador Tier (Top)</option>
              </select>

              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="aff-filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="pending">Pending Approval</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="aff-table-wrapper">
            <table className="aff-admin-table">
              <thead>
                <tr>
                  <th>Affiliate</th>
                  <th>Ref Code</th>
                  <th>Tier &amp; Rail</th>
                  <th>Clicks / Conv.</th>
                  <th>Attributed GMV</th>
                  <th>Pending Bal.</th>
                  <th>Paid Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roster.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty-table-cell">No affiliates found matching filter criteria.</td>
                  </tr>
                ) : (
                  roster.map(aff => (
                    <tr key={aff.id}>
                      <td>
                        <div className="aff-user-info">
                          <strong>{aff.name}</strong>
                          <span className="user-email">{aff.email}</span>
                          {aff.handle && <span className="user-handle">{aff.handle}</span>}
                        </div>
                      </td>
                      <td><code className="ref-code-badge">{aff.ref_code}</code></td>
                      <td>
                        <div className="tier-rail-cell">
                          <select 
                            value={aff.tier} 
                            onChange={(e) => handleChangeTier(aff.id, e.target.value)}
                            className="tier-select-badge"
                          >
                            <option value="scout">Scout (Base)</option>
                            <option value="partner">Partner (+1%)</option>
                            <option value="ambassador">Ambassador (+2%)</option>
                          </select>
                          <span className="rail-sub">{aff.payout_method?.toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <div className="metrics-cell">
                          <span>{aff.clicks_count ?? 0} clicks</span>
                          <span className="conv-sub">{aff.conversions_count ?? 0} conv.</span>
                        </div>
                      </td>
                      <td><strong>${(aff.total_gmv ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></td>
                      <td><span className="pending-bal cyan">${(aff.pending_payout ?? 0).toFixed(2)}</span></td>
                      <td><span className="paid-bal green">${(aff.paid_payout ?? 0).toFixed(2)}</span></td>
                      <td>
                        <span className={`status-badge ${aff.status}`}>
                          {aff.status === 'active' && <RiCheckboxCircleFill size={12} />}
                          {aff.status === 'suspended' && <RiErrorWarningLine size={12} />}
                          {aff.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className={`btn-action-status ${aff.status === 'active' ? 'suspend' : 'activate'}`}
                            onClick={() => handleToggleStatus(aff.id, aff.status)}
                          >
                            {aff.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ================= Tab 5: Attribution Ledger (Admin Only) ================= */}
      {activeSubTab === 'ledger' && isAdminUser && (
        <div className="aff-admin-section">
          {/* Controls Bar */}
          <div className="aff-controls-bar">
            <div className="aff-search-box">
              <RiSearchLine className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter by ref code (e.g. TM-KENYA-254)..."
                value={ledgerRefFilter}
                onChange={(e) => setLedgerRefFilter(e.target.value)}
                className="aff-search-input"
              />
            </div>

            <div className="aff-filters-row">
              <select 
                value={ledgerTypeFilter} 
                onChange={(e) => setLedgerTypeFilter(e.target.value)}
                className="aff-filter-select"
              >
                <option value="all">All Conversion Types</option>
                <option value="stream_pool">Streaming Pool</option>
                <option value="single_lossless">Single Lossless Track</option>
                <option value="album_sale">Full Album Sale</option>
                <option value="stems_pack">Producer Stems Kit</option>
                <option value="ticket_pass">VIP Tour Pass</option>
                <option value="sync_placement">Commercial Sync</option>
                <option value="creator_onboarding">Creator Credits Top-Up</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="aff-table-wrapper">
            <table className="aff-admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Transaction ID</th>
                  <th>Affiliate Ref</th>
                  <th>Conversion Category</th>
                  <th>Item / Release</th>
                  <th>Gross Amount</th>
                  <th>Commission Rate</th>
                  <th>Affiliate Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="empty-table-cell">No conversion ledger records found.</td>
                  </tr>
                ) : (
                  ledger.map(entry => (
                    <tr key={entry.id || entry.tx_id}>
                      <td className="time-cell">{new Date(entry.created_at).toLocaleDateString()} {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td><code className="tx-code">{entry.tx_id}</code></td>
                      <td><code className="ref-code-badge">{entry.ref_code}</code></td>
                      <td><strong>{entry.type_label}</strong></td>
                      <td><span className="item-title">{entry.item_title}</span></td>
                      <td>${entry.gross_amount.toFixed(2)}</td>
                      <td><span className="rate-badge">{entry.commission_rate}%</span></td>
                      <td><span className="comm-amt cyan">+${entry.commission_amount.toFixed(2)}</span></td>
                      <td><span className="status-badge active"><RiCheckboxCircleFill size={11} /> {entry.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ================= Tab 6: Matrix Configuration (Admin Only) ================= */}
      {activeSubTab === 'matrix' && isAdminUser && (
        <div className="aff-admin-section">
          <form onSubmit={handleSaveMatrix} className="matrix-config-form">
            <div className="config-header-row">
              <div>
                <h3>Dynamic 3% to 12% Compensation Matrix Rules</h3>
                <p>Adjust base commission percentages per content channel across the TuneMavens ecosystem.</p>
              </div>
              <button type="submit" className="btn-primary" disabled={savingMatrix}>
                {savingMatrix ? 'Deploying Changes...' : 'Save & Deploy Matrix'}
              </button>
            </div>

            {matrixSavedFeedback && (
              <div className="feedback-banner success">
                <RiCheckboxCircleFill /> Commission matrix rules deployed successfully across all portals.
              </div>
            )}

            <div className="config-grid-2">
              <div className="config-card">
                <label>Tracking Cookie Duration (Days)</label>
                <input 
                  type="number" 
                  min="30" 
                  max="365" 
                  value={cookieDays}
                  onChange={(e) => setCookieDays(e.target.value)}
                  className="aff-form-input"
                />
                <span className="input-hint">Standard Ditto model is 90 days. Attribution persists across subdomains.</span>
              </div>

              <div className="config-card">
                <label>Minimum Payout Threshold ($ USD)</label>
                <input 
                  type="number" 
                  min="5" 
                  max="100" 
                  value={minPayoutUsd}
                  onChange={(e) => setMinPayoutUsd(e.target.value)}
                  className="aff-form-input"
                />
                <span className="input-hint">Affiliates can disburse once their cleared balance reaches this minimum.</span>
              </div>
            </div>

            <div className="matrix-edit-table-card">
              <table className="aff-admin-table">
                <thead>
                  <tr>
                    <th>Channel &amp; Category</th>
                    <th>Calculation Basis</th>
                    <th>Commission Rate (%)</th>
                    <th>Current Description</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixConfig.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>
                        <strong>{item.category}</strong>
                        <span className="item-type-label">{item.channel}</span>
                      </td>
                      <td>{item.calculation_basis}</td>
                      <td style={{ width: '140px' }}>
                        <div className="rate-input-wrap">
                          <input 
                            type="number" 
                            step="0.5" 
                            min="1" 
                            max="30"
                            value={item.rate_percent}
                            onChange={(e) => handleRateChange(idx, e.target.value)}
                            className="rate-num-input"
                          />
                          <span>%</span>
                        </div>
                      </td>
                      <td className="desc-preview">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      )}


      {/* ================= Batch Payout Modal ================= */}
      {showPayoutModal && (
        <div className="aff-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setShowPayoutModal(false); }}>
          <div className="aff-modal-card">
            <div className="aff-modal-header">
              <div className="aff-modal-title-box">
                <span className="modal-eyebrow">Settlement Protocol</span>
                <h3>Execute Batch Affiliate Payout</h3>
              </div>
              <button className="aff-modal-close" onClick={() => setShowPayoutModal(false)}>
                <RiCloseLine size={20} />
              </button>
            </div>

            <div className="aff-modal-body">
              {payoutSuccessMsg ? (
                <div className="payout-success-state">
                  <RiCheckboxCircleFill size={44} color="#10b981" />
                  <h4>Payout Completed!</h4>
                  <p>{payoutSuccessMsg}</p>
                </div>
              ) : (
                <div className="payout-form">
                  <div className="payout-summary-card">
                    <span className="summary-label">Total Outstanding Commissions</span>
                    <div className="summary-amount">${metrics.pending_commission_payable.toFixed(2)}</div>
                    <span className="summary-count">
                      Across {roster.filter(a => a.pending_payout > 0).length} affiliate(s) with cleared balances
                    </span>
                  </div>

                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Disbursement Rail</label>
                    <select 
                      value={payoutMethod} 
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      className="aff-form-select"
                    >
                      <option value="auto">Auto (Use Affiliate Preferred Rail)</option>
                      <option value="mpesa">Force M-Pesa STK (Kenya/East Africa)</option>
                      <option value="stripe">Force Stripe Direct Deposit</option>
                      <option value="paypal">Force PayPal</option>
                      <option value="credits">Deposit as Unified Platform Credits (+5% Bonus)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginTop: '14px' }}>
                    <label>Payout Audit Notes</label>
                    <input 
                      type="text" 
                      value={payoutNotes}
                      onChange={(e) => setPayoutNotes(e.target.value)}
                      className="aff-form-input"
                    />
                  </div>

                  <div className="payout-escrow-reminder">
                    <RiShieldCheckLine size={16} />
                    <span>Disbursements write an immutable record to TuneLedger and reset affiliate pending balances.</span>
                  </div>

                  <div className="modal-form-actions" style={{ marginTop: '20px' }}>
                    <button 
                      type="button" 
                      className="btn-primary aff-execute-payout-btn"
                      onClick={handleExecutePayout}
                      disabled={processingPayout}
                    >
                      {processingPayout ? 'Disbursing via Payment Rails...' : `Disburse $${metrics.pending_commission_payable.toFixed(2)} Now`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= In-App Article Reading Overlay ================= */}
      <InAppDocModal
        isOpen={Boolean(activeReadingDocId)}
        onClose={() => setActiveReadingDocId(null)}
        initialArticleId={activeReadingDocId}
        contextTitle="Affiliate Academy & Required Reading"
        sessionUser={sessionUser}
      />

    </div>
  );
}
