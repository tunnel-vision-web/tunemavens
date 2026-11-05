import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  RiMailLine,
  RiMailSendLine,
  RiShieldCheckLine,
  RiInboxArchiveLine,
  RiRefreshLine,
  RiSearchLine,
  RiFilter3Line,
  RiEyeLine,
  RiDownload2Line,
  RiCheckLine,
  RiCloseLine,
  RiCoinsLine,
  RiKeyLine,
  RiFileTextLine,
  RiExternalLinkLine,
  RiCodeBoxLine,
  RiArrowRightLine,
  RiTimeLine,
  RiUserSharedLine,
  RiSendPlaneLine,
  RiWhatsappFill,
  RiWhatsappLine,
  RiCheckboxCircleFill,
  RiAlertFill,
  RiQrCodeLine,
  RiVipCrownLine,
} from 'react-icons/ri';
import { communicationsApi } from '../../lib/api';

const ROLE_COLOR_MAP = {
  creator: '#22d3ee', // Cyan
  podcaster: '#38bdf8', // Sky
  label: '#a855f7', // Purple
  dj: '#ec4899', // Pink
  supervisor: '#f43f5e', // Rose
  media_house: '#f97316', // Orange
  corporate: '#eab308', // Amber/Yellow
  consumer: '#10b981', // Emerald
  vc: '#6366f1', // Indigo
  affiliate: '#06b6d4', // Teal/Cyan
  security: '#ef4444', // Red
  admin: '#8b5cf6', // Violet
  general: '#94a3b8', // Gray
};

const EVENT_TYPE_LABELS = {
  welcome_onboarding: 'Welcome / Onboarding',
  affiliate_welcome: 'Affiliate Welcome',
  credit_balance: 'Credit Balance Update',
  password_change: 'Password Changed (Security)',
  password_reset_request: 'Password Reset Link',
  payout_dispatched: 'Payout Disbursement',
  affiliate_conversion: 'Affiliate Commission',
  contract_executed: 'Contract Executed',
  contract_invitation: 'Contract Invitation',
  general: 'System Notification',
};

export default function CommunicationsVaultPanel({ currentUser }) {
  // State
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all'); // 'all', 'email', 'whatsapp'
  const [archiveFilter, setArchiveFilter] = useState('false'); // 'false' = active, 'true' = archived, 'all' = all
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Test Protocol Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testTab, setTestTab] = useState('whatsapp'); // 'email' | 'whatsapp'
  const [testEmailTo, setTestEmailTo] = useState('mavenmusicorum@gmail.com');
  const [testEmailSubject, setTestEmailSubject] = useState('TuneMavens Protocol Diagnostic Test');
  const [testEmailMsg, setTestEmailMsg] = useState('Verifying transactional email deliverability via contact.tunemavens.com (Resend).');
  const [testWaPhone, setTestWaPhone] = useState('+254722520040');
  const [testWaName, setTestWaName] = useState('Maven Admin');
  const [testWaMsg, setTestWaMsg] = useState('TuneMavens Omnichannel Protocol Alert: WhatsApp communications verified and active.');
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testFeedback, setTestFeedback] = useState(null);
  const [testConfirmation, setTestConfirmation] = useState(null);

  // Modal inspection state
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectedMessage, setInspectedMessage] = useState(null);
  const [inspectTab, setInspectTab] = useState('preview'); // 'preview', 'text', 'telemetry', 'json'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // WhatsApp Opt-in & Quota Governance State
  const [waStatus, setWaStatus] = useState(null);
  const [waStatusLoading, setWaStatusLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle ESC key to dismiss any open modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (testModalOpen) setTestModalOpen(false);
        if (inspectModalOpen) setInspectModalOpen(false);
        if (showQrModal) setShowQrModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [testModalOpen, inspectModalOpen, showQrModal]);

  // Load stats
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await communicationsApi.getStats();
      if (res && res.status === 'success') {
        setStats(res);
      }
    } catch (err) {
      console.error('Failed to load communication stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load WhatsApp Eligibility & Inbound Opt-in Status
  const fetchWaStatus = async () => {
    try {
      setWaStatusLoading(true);
      const res = await communicationsApi.getWhatsappStatus();
      if (res && res.status === 'success') {
        setWaStatus(res);
      }
    } catch (err) {
      console.warn('Failed to load WhatsApp status:', err);
    } finally {
      setWaStatusLoading(false);
    }
  };

  // Load logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communicationsApi.getLogs({
        q: debouncedSearch,
        role: selectedRole,
        event_type: selectedEventType,
        status: selectedStatus,
        channel: selectedChannel,
        archived: archiveFilter,
        page: currentPage,
        limit: 20,
      });
      if (res && res.status === 'success') {
        setLogs(res.logs || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.total_pages || 1);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Failed to load communication logs:', err);
      setError(err?.message || 'Could not load communications vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchWaStatus();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [debouncedSearch, selectedRole, selectedEventType, selectedStatus, selectedChannel, archiveFilter, currentPage]);

  // Handle Archive / Unarchive
  const handleToggleArchive = async (msg) => {
    try {
      setActionLoadingId(msg.id);
      if (msg.archived) {
        await communicationsApi.unarchiveMessage(msg.id);
        setActionNotice({ type: 'success', text: `Message ${msg.id} unarchived to active vault.` });
      } else {
        await communicationsApi.archiveMessage(msg.id);
        setActionNotice({ type: 'success', text: `Message ${msg.id} archived successfully.` });
      }
      // Refresh current data & inspected modal if open
      await Promise.all([fetchLogs(), fetchStats()]);
      if (inspectedMessage && inspectedMessage.id === msg.id) {
        setInspectedMessage(prev => ({ ...prev, archived: !prev.archived }));
      }
    } catch (err) {
      setActionNotice({ type: 'error', text: err?.message || 'Archive operation failed.' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setActionNotice(null), 4000);
    }
  };

  // Handle 1-Click Re-send
  const handleResend = async (msg) => {
    try {
      setActionLoadingId(msg.id);
      const res = await communicationsApi.resendMessage(msg.id);
      setActionNotice({
        type: res?.resend_result === 'sent' ? 'success' : 'warning',
        text: res?.message || `Re-send attempt completed for ${msg.to}.`,
      });
      await Promise.all([fetchLogs(), fetchStats()]);
    } catch (err) {
      setActionNotice({ type: 'error', text: err?.message || 'Re-send failed.' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  // Open Message Detail Modal
  const openInspector = (msg) => {
    setInspectedMessage(msg);
    setInspectTab('preview');
    setInspectModalOpen(true);
  };

  // Download CSV
  const handleExportCsv = () => {
    window.open(communicationsApi.getExportUrl(), '_blank');
  };

  // Dispatch Test Email
  const handleSendTestEmail = async () => {
    if (!testEmailTo.trim()) {
      setTestFeedback({ type: 'error', text: 'Recipient email address is required.' });
      return;
    }
    try {
      setTestSubmitting(true);
      setTestFeedback(null);
      const res = await communicationsApi.testEmail({
        to: testEmailTo.trim(),
        subject: testEmailSubject.trim() || 'TuneMavens Protocol Test',
        message: testEmailMsg.trim() || 'Diagnostic verification of Resend delivery protocol.',
        role: 'admin',
      });
      setTestConfirmation({
        channel: 'email',
        delivery_status: res?.delivery_status || 'sent',
        recipient: res?.recipient || testEmailTo.trim(),
        recipient_name: testEmailTo.trim(),
        subject: testEmailSubject.trim() || 'TuneMavens Protocol Test',
        provider: 'resend',
        provider_status: res?.provider_status || 200,
        message: testEmailMsg.trim(),
        timestamp: res?.created_at || new Date().toISOString(),
      });
      await Promise.all([fetchLogs(), fetchStats()]);
    } catch (err) {
      setTestFeedback({ type: 'error', text: err?.message || 'Failed to dispatch test email.' });
    } finally {
      setTestSubmitting(false);
    }
  };

  // Dispatch Test WhatsApp
  const handleSendTestWhatsapp = async () => {
    if (!testWaPhone.trim()) {
      setTestFeedback({ type: 'error', text: 'Recipient phone number is required.' });
      return;
    }
    try {
      setTestSubmitting(true);
      setTestFeedback(null);
      const res = await communicationsApi.testWhatsapp({
        to: testWaPhone.trim(),
        message: testWaMsg.trim() || 'TuneMavens Omnichannel Protocol Alert: WhatsApp communication channel verified.',
        recipient_name: testWaName.trim() || 'Maven Admin',
        role: 'admin',
      });
      setTestConfirmation({
        channel: 'whatsapp',
        delivery_status: res?.delivery_status || 'sent',
        comm_id: res?.comm_id,
        recipient: res?.recipient || testWaPhone.trim(),
        recipient_name: res?.recipient_name || testWaName.trim(),
        provider: res?.provider || 'meta_whatsapp_cloud',
        provider_status: res?.provider_status || 200,
        provider_msg_id: res?.provider_msg_id,
        message_status: res?.message_status || 'accepted',
        direct_url: res?.direct_url,
        error_details: res?.error_details,
        message: testWaMsg.trim(),
        timestamp: res?.created_at || new Date().toISOString(),
      });
      await Promise.all([fetchLogs(), fetchStats()]);
    } catch (err) {
      setTestFeedback({ type: 'error', text: err?.message || 'Failed to dispatch test WhatsApp.' });
    } finally {
      setTestSubmitting(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (isoStr) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="comm-vault-container" style={{
      color: '#e2e8f0',
      fontFamily: 'inherit',
      padding: '24px 20px',
      maxWidth: '1440px',
      margin: '0 auto',
    }}>
      {/* Top Banner / Breadcrumb */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'rgba(34,211,238,0.12)',
              color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.25)',
              borderRadius: '3px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Core Infrastructure
            </span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>/</span>
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Outbound Telemetry & Audit</span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#f8fafc',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}>
            Communications Hub & Audit Vault
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', maxWidth: '780px' }}>
            Comprehensive records of all outbound notifications across all 9 canonical personas and affiliates,
            with real-time Resend deliverability telemetry, full message inspection, single-click re-sending, and compliance archiving.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => { setTestTab('whatsapp'); setTestFeedback(null); setTestConfirmation(null); setTestModalOpen(true); }}
            style={{
              background: 'rgba(37,211,102,0.14)',
              color: '#25d366',
              border: '1px solid rgba(37,211,102,0.35)',
              borderRadius: '3px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Compose and dispatch outbound message via WhatsApp Protocol"
          >
            <RiWhatsappFill size={15} />
            Send WhatsApp
          </button>

          <button
            onClick={() => { setTestTab('email'); setTestFeedback(null); setTestConfirmation(null); setTestModalOpen(true); }}
            style={{
              background: 'rgba(34,211,238,0.12)',
              color: '#22d3ee',
              border: '1px solid rgba(34,211,238,0.3)',
              borderRadius: '3px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Send real-time diagnostic test via Resend Email Protocol"
          >
            <RiMailSendLine size={15} />
            Test Email
          </button>

          <button
            onClick={() => { fetchLogs(); fetchStats(); }}
            style={{
              background: '#131c2d',
              color: '#cbd5e1',
              border: '1px solid #1e293b',
              borderRadius: '3px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            title="Refresh logs & statistics"
          >
            <RiRefreshLine style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>

          <button
            onClick={handleExportCsv}
            style={{
              background: '#22d3ee',
              color: '#04141a',
              border: 'none',
              borderRadius: '3px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RiDownload2Line />
            Export CSV Audit
          </button>
        </div>
      </div>

      {/* Floating Action Notice / Toast */}
      {actionNotice && (
        <div style={{
          background: actionNotice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${actionNotice.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          color: actionNotice.type === 'error' ? '#fca5a5' : '#6ee7b7',
          borderRadius: '3px',
          padding: '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
        }}>
          <span>{actionNotice.text}</span>
          <button
            onClick={() => setActionNotice(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      )}

      {/* Metrics & Deliverability KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        {/* KPI 1: Total Records */}
        <div style={{
          background: '#0d1522',
          border: '1px solid #1e293b',
          borderRadius: '3px',
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Communications
            </span>
            <RiMailLine size={18} style={{ color: '#22d3ee' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#f8fafc', fontFamily: 'monospace' }}>
            {statsLoading ? '...' : (stats?.total_count ?? 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {statsLoading ? 'Loading' : `${stats?.active_count ?? 0} active, ${stats?.archived_count ?? 0} archived`}
          </div>
        </div>

        {/* KPI 2: Live Deliverability Rate */}
        <div style={{
          background: '#0d1522',
          border: '1px solid #1e293b',
          borderRadius: '3px',
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Deliverability Rate
            </span>
            <RiShieldCheckLine size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', fontFamily: 'monospace' }}>
            {statsLoading ? '...' : `${stats?.deliverability_rate ?? 100}%`}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {statsLoading ? 'Loading' : `${stats?.sent_count ?? 0} sent via Resend API`}
          </div>
        </div>

        {/* KPI 3: Key Persona Activities */}
        <div style={{
          background: '#0d1522',
          border: '1px solid #1e293b',
          borderRadius: '3px',
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Credit & Activity Logs
            </span>
            <RiCoinsLine size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#f59e0b', fontFamily: 'monospace' }}>
            {statsLoading ? '...' : (stats?.by_event_type?.credit_balance ?? 0) + (stats?.by_event_type?.password_change ?? 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Ledger adjustments & security alerts
          </div>
        </div>

        {/* KPI 4: Infrastructure Rail */}
        <div style={{
          background: '#0d1522',
          border: '1px solid #1e293b',
          borderRadius: '3px',
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Omnichannel Rails
            </span>
            <span style={{
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
            }}>
              ACTIVE
            </span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#22d3ee' }}>Resend</span>
            <span style={{ color: '#64748b' }}>&amp;</span>
            <span style={{ color: '#25d366' }}>WhatsApp</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            {stats?.by_channel?.email ?? 0} Email • {stats?.by_channel?.whatsapp ?? 0} WhatsApp
          </div>
        </div>
      </div>

      {/* WhatsApp Activation, Handshake & Quota Governance Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(11,20,26,0.95) 0%, rgba(13,21,34,0.98) 100%)',
        border: '1px solid rgba(37,211,102,0.3)',
        borderRadius: '6px',
        padding: '20px 22px',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(37,211,102,0.12) 0%, rgba(37,211,102,0) 70%)',
          pointerEvents: 'none',
        }} />

        {/* Card Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '14px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(37,211,102,0.15)',
              padding: '8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <RiWhatsappFill size={24} style={{ color: '#25d366' }} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Meta WhatsApp Inbound Handshake &amp; Real-Time Alerts Rail</span>
                <span style={{
                  fontSize: '10px',
                  background: 'rgba(37,211,102,0.2)',
                  color: '#25d366',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}>
                  CLOUD API v20.0
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Meta grants an unrestricted 24-hour free message window when you initiate contact. Send a quick handshake to activate instant notifications.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: '#0d1522',
              border: '1px solid #1e293b',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11px',
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}>
              Monthly Free Conversations: <span style={{ color: '#22d3ee', fontWeight: '700' }}>1,000 / mo</span>
            </div>
            <button
              onClick={fetchWaStatus}
              title="Refresh WhatsApp Status"
              style={{
                background: '#1e293b',
                border: 'none',
                color: '#cbd5e1',
                padding: '7px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
              }}
            >
              <RiRefreshLine size={14} className={waStatusLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* 3-Column Policy & Action Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}>
          {/* Tile 1: Access Tier & Eligibility Policy */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Access Policy &amp; Monetization Tier
            </div>
            {waStatus?.eligibility?.tier === 'complimentary_vip' ? (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(244,63,94,0.15)',
                  border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f43f5e',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  marginBottom: '8px',
                }}>
                  <RiVipCrownLine size={13} />
                  COMPLIMENTARY VIP ACCESS
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Music Supervisors, Record Labels, and Corporates receive <strong>complimentary, unlimited WhatsApp access</strong> with no wallet reload requirement.
                </div>
              </div>
            ) : waStatus?.is_eligible ? (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(37,211,102,0.15)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25d366',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  marginBottom: '8px',
                }}>
                  <RiCheckboxCircleFill size={13} />
                  QUALIFIED CREATOR (FUNDED WALLET)
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Your account has met the qualifying deposit threshold (KES 500+ / $5.00+). Real-time WhatsApp notifications are unlocked!
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  marginBottom: '8px',
                }}>
                  <RiAlertFill size={13} />
                  RELOAD REQUIRED (MIN KES 500 / $5.00)
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  To protect our 1,000 free monthly conversations, creators must load at least <strong>KES 500 ($5.00)</strong> to activate automated WhatsApp delivery.
                </div>
              </div>
            )}
          </div>

          {/* Tile 2: 24-Hour Customer-Service Window */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '6px',
            padding: '14px 16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              24-Hour Customer-Service Window
            </div>
            {waStatus?.in_24h_window ? (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(37,211,102,0.15)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25d366',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  marginBottom: '8px',
                }}>
                  🟢 WINDOW ACTIVE (FREE MESSAGING OPEN)
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Your 24-hour service window is active for approximately <strong>{waStatus.window_expires_in_hours} hours</strong>. Our backend can send custom real-time alerts without template limits.
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(148,163,184,0.15)',
                  border: '1px solid rgba(148,163,184,0.3)',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  marginBottom: '8px',
                }}>
                  ⚪ WINDOW AWAITING INBOUND MESSAGE
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  No inbound handshake in the last 24 hours. Tap <strong>Send Inbound Handshake</strong> to message our verified number and open the free 24-hour window!
                </div>
              </div>
            )}
          </div>

          {/* Tile 3: Initiation Actions */}
          <div style={{
            background: 'rgba(37,211,102,0.04)',
            border: '1px solid rgba(37,211,102,0.2)',
            borderRadius: '6px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#25d366', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Official WhatsApp Sender
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', fontFamily: 'monospace' }}>
                {waStatus?.business_phone || '+1 555-160-6136'}
              </div>
              <div style={{ fontSize: '11px', color: '#8696a0', marginTop: '2px' }}>
                Pre-coded verification keyword: <code>START TM-{(currentUser?.username || 'creator')}</code>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => window.open(waStatus?.initiate_url || 'https://wa.me/15551606136?text=START', '_blank')}
                style={{
                  flex: 1,
                  background: '#25d366',
                  color: '#0b141a',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                }}
              >
                <RiWhatsappFill size={16} />
                Send Handshake
              </button>
              <button
                onClick={() => setShowQrModal(true)}
                title="Scan QR Code with your smartphone camera"
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RiQrCodeLine size={16} />
                QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Handshake Modal */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d1522',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              maxWidth: '380px',
              width: '100%',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiWhatsappFill size={20} style={{ color: '#25d366' }} />
                <span>Scan with Camera</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              display: 'inline-block',
              margin: '8px auto 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(waStatus?.initiate_url || 'https://wa.me/15551606136?text=START')}&margin=4&color=0b141a&bgcolor=ffffff`}
                alt="Scan to open TuneMavens WhatsApp"
                style={{ width: '220px', height: '220px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>
              Point your smartphone camera at this QR code to instantly launch WhatsApp with the pre-coded verification handshake.
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', marginBottom: '16px' }}>
              Receiver: {waStatus?.business_phone || '+1 555-160-6136'}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              style={{
                background: '#1e293b',
                color: '#cbd5e1',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        background: '#0d1522',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        padding: '16px 18px',
        marginBottom: '20px',
      }}>
        {/* Sub-Tabs: Active vs Archived vs All */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}>
          <button
            onClick={() => { setArchiveFilter('false'); setCurrentPage(1); }}
            style={{
              background: archiveFilter === 'false' ? 'rgba(34,211,238,0.12)' : 'transparent',
              color: archiveFilter === 'false' ? '#22d3ee' : '#94a3b8',
              border: `1px solid ${archiveFilter === 'false' ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
              borderRadius: '3px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RiMailLine size={15} />
            Active Vault ({stats?.active_count ?? 0})
          </button>

          <button
            onClick={() => { setArchiveFilter('true'); setCurrentPage(1); }}
            style={{
              background: archiveFilter === 'true' ? 'rgba(168,85,247,0.12)' : 'transparent',
              color: archiveFilter === 'true' ? '#c084fc' : '#94a3b8',
              border: `1px solid ${archiveFilter === 'true' ? 'rgba(168,85,247,0.3)' : 'transparent'}`,
              borderRadius: '3px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RiInboxArchiveLine size={15} />
            Archived ({stats?.archived_count ?? 0})
          </button>

          <button
            onClick={() => { setArchiveFilter('all'); setCurrentPage(1); }}
            style={{
              background: archiveFilter === 'all' ? '#1e293b' : 'transparent',
              color: archiveFilter === 'all' ? '#f8fafc' : '#94a3b8',
              border: '1px solid transparent',
              borderRadius: '3px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            All Logs ({stats?.total_count ?? 0})
          </button>
        </div>

        {/* Filter Controls Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <RiSearchLine style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }} />
            <input
              type="text"
              placeholder="Search recipient, subject, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                color: '#f8fafc',
                padding: '9px 12px 9px 36px',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <RiCloseLine size={16} />
              </button>
            )}
          </div>

          {/* Persona Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                color: '#f8fafc',
                padding: '9px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Personas & Roles</option>
              <option value="creator">Creator / Artist</option>
              <option value="podcaster">Podcaster</option>
              <option value="label">Record Label</option>
              <option value="dj">DJ</option>
              <option value="supervisor">Music Supervisor</option>
              <option value="media_house">Media House</option>
              <option value="corporate">Corporate / Brand</option>
              <option value="consumer">Listener / Fan</option>
              <option value="vc">VC / Financier</option>
              <option value="affiliate">Affiliate Partner</option>
              <option value="security">Security & Auth</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div>
            <select
              value={selectedEventType}
              onChange={(e) => { setSelectedEventType(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                color: '#f8fafc',
                padding: '9px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Event Types</option>
              <option value="welcome_onboarding">Welcome / Onboarding</option>
              <option value="affiliate_welcome">Affiliate Welcome</option>
              <option value="credit_balance">Credit Balance Update</option>
              <option value="password_change">Password Changed (Security)</option>
              <option value="password_reset_request">Password Reset Request</option>
              <option value="payout_dispatched">Payout Dispatched</option>
              <option value="affiliate_conversion">Affiliate Commission</option>
              <option value="contract_executed">Contract Executed</option>
              <option value="contract_invitation">Contract Invitation</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                color: '#f8fafc',
                padding: '9px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Statuses</option>
              <option value="sent">Delivered / Sent</option>
              <option value="not_configured">Staged (Sandbox / Outbox)</option>
              <option value="failed">Failed Delivery</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={selectedChannel}
              onChange={(e) => { setSelectedChannel(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                color: '#f8fafc',
                padding: '9px 12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Channels (Omnichannel)</option>
              <option value="email">Email (Resend)</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Communications Table */}
      <div style={{
        background: '#0d1522',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
            <RiRefreshLine size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <div>Loading communications vault records...</div>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
            <RiMailLine size={32} style={{ color: '#475569', marginBottom: '12px' }} />
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#cbd5e1' }}>No communications match your filters</div>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Try clearing search terms or selecting a different persona/status.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '13px',
            }}>
              <thead>
                <tr style={{
                  background: '#090d16',
                  borderBottom: '1px solid #1e293b',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Recipient & Persona</th>
                  <th style={{ padding: '12px 16px' }}>Event & Subject</th>
                  <th style={{ padding: '12px 16px' }}>Rail</th>
                  <th style={{ padding: '12px 16px' }}>Dispatched (UTC)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((item) => {
                  const roleColor = ROLE_COLOR_MAP[item.role] || '#94a3b8';
                  const isSent = item.status === 'sent';
                  const isStaged = item.status === 'not_configured';
                  const isFailed = item.status === 'failed';
                  const statusBg = isSent ? 'rgba(16,185,129,0.12)' : isStaged ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)';
                  const statusColor = isSent ? '#10b981' : isStaged ? '#f59e0b' : '#ef4444';
                  const statusLabel = isSent ? 'Delivered' : isStaged ? 'Staged' : 'Failed';

                  return (
                    <tr
                      key={item.id || item.mongo_id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        background: item.archived ? 'rgba(15,23,42,0.4)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Status */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            background: statusBg,
                            color: statusColor,
                            border: `1px solid ${statusColor}33`,
                            borderRadius: '3px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                          }}>
                            {statusLabel}
                          </span>
                          {item.archived && (
                            <span style={{
                              background: '#1e293b',
                              color: '#94a3b8',
                              borderRadius: '3px',
                              padding: '2px 5px',
                              fontSize: '10px',
                            }}>
                              Archived
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Recipient & Persona */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: '600', color: '#f8fafc' }}>
                          {item.to}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                          <span style={{
                            color: roleColor,
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                          }}>
                            {item.role || 'general'}
                          </span>
                          {item.recipient_name && (
                            <span style={{ color: '#64748b', fontSize: '11px' }}>
                              • {item.recipient_name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Event & Subject */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', maxWidth: '380px' }}>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#22d3ee',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          marginBottom: '2px',
                        }}>
                          {EVENT_TYPE_LABELS[item.event_type] || item.event_type || 'System Event'}
                        </div>
                        <div style={{
                          color: '#e2e8f0',
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.subject}
                        </div>
                      </td>

                      {/* Rail / Channel / Provider */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        {item.channel === 'whatsapp' ? (
                          <>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#25d366', fontWeight: '700' }}>
                              <RiWhatsappFill size={14} /> WhatsApp
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                              {item.provider || 'direct_gateway'}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#22d3ee', fontWeight: '700' }}>
                              <RiMailLine size={14} /> Resend Email
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>
                              {item.resend_id ? item.resend_id.slice(0, 14) + '...' : (item.from_addr ? item.from_addr.split('<')[0] : 'contact')}
                            </div>
                          </>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', whiteSpace: 'nowrap', color: '#94a3b8' }}>
                        {formatTimestamp(item.created_at)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Inspect / Preview */}
                          <button
                            onClick={() => openInspector(item)}
                            style={{
                              background: '#131c2d',
                              color: '#22d3ee',
                              border: '1px solid #1e293b',
                              borderRadius: '3px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title="Inspect message content & headers"
                          >
                            <RiEyeLine size={14} />
                            Inspect
                          </button>

                          {/* Direct WhatsApp Open */}
                          {item.channel === 'whatsapp' && item.metadata?.direct_wa_url && (
                            <a
                              href={item.metadata.direct_wa_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                background: 'rgba(37,211,102,0.15)',
                                color: '#25d366',
                                border: '1px solid rgba(37,211,102,0.4)',
                                borderRadius: '3px',
                                padding: '6px 10px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title="Open pre-composed message directly in WhatsApp Web or App"
                            >
                              <RiWhatsappFill size={14} />
                              Open WhatsApp
                            </a>
                          )}

                          {/* Re-send Button */}
                          <button
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleResend(item)}
                            style={{
                              background: '#131c2d',
                              color: item.channel === 'whatsapp' ? '#25d366' : '#10b981',
                              border: '1px solid #1e293b',
                              borderRadius: '3px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: actionLoadingId === item.id ? 'not-allowed' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              opacity: actionLoadingId === item.id ? 0.6 : 1,
                            }}
                            title={item.channel === 'whatsapp' ? 'Re-dispatch WhatsApp message' : 'Re-send email via Resend API'}
                          >
                            <RiSendPlaneLine size={14} />
                            Re-send
                          </button>

                          {/* Archive / Unarchive */}
                          <button
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleToggleArchive(item)}
                            style={{
                              background: '#131c2d',
                              color: item.archived ? '#c084fc' : '#94a3b8',
                              border: '1px solid #1e293b',
                              borderRadius: '3px',
                              padding: '6px 8px',
                              fontSize: '12px',
                              cursor: actionLoadingId === item.id ? 'not-allowed' : 'pointer',
                            }}
                            title={item.archived ? 'Restore to active vault' : 'Archive message'}
                          >
                            <RiInboxArchiveLine size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          borderTop: '1px solid #1e293b',
          background: '#090d16',
          fontSize: '12px',
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div>
            Showing <strong>{logs.length}</strong> of <strong>{totalCount}</strong> messages (Page {currentPage} of {totalPages})
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                background: '#131c2d',
                color: currentPage <= 1 ? '#475569' : '#cbd5e1',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                padding: '5px 12px',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{
                background: '#131c2d',
                color: currentPage >= totalPages ? '#475569' : '#cbd5e1',
                border: '1px solid #1e293b',
                borderRadius: '3px',
                padding: '5px 12px',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Deep Message Inspection Modal */}
      {inspectModalOpen && inspectedMessage && (
        <div 
          onClick={() => setInspectModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d1522',
              border: '1px solid #1e293b',
              borderRadius: '3px',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              margin: 'auto',
            }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #1e293b',
              background: '#090d16',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    background: 'rgba(34,211,238,0.12)',
                    color: '#22d3ee',
                    borderRadius: '3px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}>
                    {inspectedMessage.role?.toUpperCase() || 'GENERAL'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '12px', fontFamily: 'monospace' }}>
                    ID: {inspectedMessage.id}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                  {inspectedMessage.subject}
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  To: <strong style={{ color: '#e2e8f0' }}>{inspectedMessage.to}</strong> {inspectedMessage.recipient_name ? `(${inspectedMessage.recipient_name})` : ''} • Dispatched: {formatTimestamp(inspectedMessage.created_at)}
                </div>
              </div>
              <button
                onClick={() => setInspectModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            {/* Modal Sub-Navigation Tabs */}
            <div style={{
              display: 'flex',
              gap: '6px',
              padding: '10px 24px',
              background: '#0d1522',
              borderBottom: '1px solid #1e293b',
            }}>
              <button
                onClick={() => setInspectTab('preview')}
                style={{
                  background: inspectTab === 'preview' ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: inspectTab === 'preview' ? '#22d3ee' : '#94a3b8',
                  border: `1px solid ${inspectTab === 'preview' ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RiEyeLine size={14} />
                HTML Rendered Preview
              </button>
              <button
                onClick={() => setInspectTab('text')}
                style={{
                  background: inspectTab === 'text' ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: inspectTab === 'text' ? '#22d3ee' : '#94a3b8',
                  border: `1px solid ${inspectTab === 'text' ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RiFileTextLine size={14} />
                Plain Text
              </button>
              <button
                onClick={() => setInspectTab('telemetry')}
                style={{
                  background: inspectTab === 'telemetry' ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: inspectTab === 'telemetry' ? '#22d3ee' : '#94a3b8',
                  border: `1px solid ${inspectTab === 'telemetry' ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RiShieldCheckLine size={14} />
                Audit & Telemetry
              </button>
              <button
                onClick={() => setInspectTab('json')}
                style={{
                  background: inspectTab === 'json' ? 'rgba(34,211,238,0.12)' : 'transparent',
                  color: inspectTab === 'json' ? '#22d3ee' : '#94a3b8',
                  border: `1px solid ${inspectTab === 'json' ? 'rgba(34,211,238,0.3)' : 'transparent'}`,
                  borderRadius: '3px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <RiCodeBoxLine size={14} />
                Raw JSON
              </button>
            </div>

            {/* Modal Tab Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {inspectTab === 'preview' && (
                <div style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '3px',
                  padding: '16px',
                  minHeight: '380px',
                }}>
                  {inspectedMessage.html ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: inspectedMessage.html }}
                      style={{ color: '#e2e8f0' }}
                    />
                  ) : (
                    <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '40px' }}>
                      No HTML payload saved for this communication. View plain text.
                    </div>
                  )}
                </div>
              )}

              {inspectTab === 'text' && (
                <pre style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '3px',
                  padding: '18px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  lineHeight: '1.6',
                }}>
                  {inspectedMessage.text || inspectedMessage.subject}
                </pre>
              )}

              {inspectTab === 'telemetry' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '3px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Delivery Status</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: inspectedMessage.status === 'sent' ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                      {inspectedMessage.status?.toUpperCase()} (HTTP {inspectedMessage.provider_status || '200'})
                    </div>
                  </div>

                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '3px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Sender Address</div>
                    <div style={{ fontSize: '14px', color: '#f8fafc', marginTop: '4px', wordBreak: 'break-all' }}>
                      {inspectedMessage.from_addr || 'TuneMavens <hello@tunemavens.com>'}
                    </div>
                  </div>

                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '3px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Resend Provider ID</div>
                    <div style={{ fontSize: '13px', color: '#22d3ee', fontFamily: 'monospace', marginTop: '4px' }}>
                      {inspectedMessage.resend_id || 'Not returned (sandbox stage)'}
                    </div>
                  </div>

                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '3px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Archive Status</div>
                    <div style={{ fontSize: '14px', color: inspectedMessage.archived ? '#c084fc' : '#10b981', marginTop: '4px' }}>
                      {inspectedMessage.archived ? 'Archived Record' : 'Active In Vault'}
                    </div>
                  </div>

                  {inspectedMessage.metadata && Object.keys(inspectedMessage.metadata).length > 0 && (
                    <div style={{ gridColumn: '1 / -1', background: '#090d16', border: '1px solid #1e293b', borderRadius: '3px', padding: '14px 16px' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Contextual Metadata Payload
                      </div>
                      <pre style={{ margin: 0, fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(inspectedMessage.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {inspectTab === 'json' && (
                <pre style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '3px',
                  padding: '18px',
                  color: '#38bdf8',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                }}>
                  {JSON.stringify(inspectedMessage, null, 2)}
                </pre>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #1e293b',
              background: '#090d16',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <button
                  disabled={actionLoadingId === inspectedMessage.id}
                  onClick={() => handleToggleArchive(inspectedMessage)}
                  style={{
                    background: '#131c2d',
                    color: inspectedMessage.archived ? '#c084fc' : '#cbd5e1',
                    border: '1px solid #1e293b',
                    borderRadius: '3px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RiInboxArchiveLine size={15} />
                  {inspectedMessage.archived ? 'Restore to Active Vault' : 'Archive Record'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {inspectedMessage.channel === 'whatsapp' && inspectedMessage.metadata?.direct_wa_url && (
                  <a
                    href={inspectedMessage.metadata.direct_wa_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25d366',
                      color: '#0b141a',
                      textDecoration: 'none',
                      borderRadius: '3px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <RiWhatsappFill size={16} />
                    Open in WhatsApp
                  </a>
                )}
                <button
                  disabled={actionLoadingId === inspectedMessage.id}
                  onClick={() => handleResend(inspectedMessage)}
                  style={{
                    background: inspectedMessage.channel === 'whatsapp' ? '#10b981' : '#22d3ee',
                    color: '#04141a',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RiSendPlaneLine size={15} />
                  {inspectedMessage.channel === 'whatsapp' ? 'Re-dispatch WhatsApp' : 'Re-send Email Now'}
                </button>
                <button
                  onClick={() => setInspectModalOpen(false)}
                  style={{
                    background: '#1e293b',
                    color: '#f8fafc',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Protocols Modal (Email & WhatsApp) */}
      {testModalOpen && (
        <div 
          onClick={() => setTestModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto',
          }}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0d1522',
              border: '1px solid #1e293b',
              borderRadius: '3px',
              width: '100%',
              maxWidth: '580px',
              maxHeight: 'min(90vh, 760px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
              overflow: 'hidden',
              margin: 'auto',
            }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #1e293b',
              background: '#090d16',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {testConfirmation ? (
                  testConfirmation.channel === 'whatsapp' ? (
                    <RiWhatsappFill size={18} style={{ color: '#25d366' }} />
                  ) : (
                    <RiMailLine size={18} style={{ color: '#22d3ee' }} />
                  )
                ) : (
                  testTab === 'whatsapp' ? (
                    <RiWhatsappFill size={18} style={{ color: '#25d366' }} />
                  ) : (
                    <RiMailLine size={18} style={{ color: '#22d3ee' }} />
                  )
                )}
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                  {testConfirmation
                    ? (testConfirmation.channel === 'whatsapp' ? 'WhatsApp Delivery Confirmation' : 'Email Delivery Confirmation')
                    : (testTab === 'whatsapp' ? 'Send WhatsApp Message' : 'Send Test Email')}
                </h3>
              </div>
              <button
                onClick={() => { setTestModalOpen(false); setTestConfirmation(null); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                title="Close modal (Esc)"
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Protocol Tabs (Hidden when showing confirmation) */}
            {!testConfirmation && (
              <div style={{ display: 'flex', borderBottom: '1px solid #1e293b', background: '#090d16', flexShrink: 0 }}>
                <button
                  onClick={() => { setTestTab('whatsapp'); setTestFeedback(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: testTab === 'whatsapp' ? 'rgba(37,211,102,0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${testTab === 'whatsapp' ? '#25d366' : 'transparent'}`,
                    color: testTab === 'whatsapp' ? '#25d366' : '#94a3b8',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <RiWhatsappFill size={15} />
                  WhatsApp Protocol
                </button>
                <button
                  onClick={() => { setTestTab('email'); setTestFeedback(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: testTab === 'email' ? 'rgba(34,211,238,0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${testTab === 'email' ? '#22d3ee' : 'transparent'}`,
                    color: testTab === 'email' ? '#22d3ee' : '#94a3b8',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <RiMailLine size={15} />
                  Resend Email Protocol
                </button>
              </div>
            )}

            {/* Modal Body */}
            <div style={{
              padding: '20px',
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              scrollbarWidth: 'thin',
              scrollbarColor: '#334155 #090d16',
            }}>
              {testConfirmation ? (
                /* ================= CONFIRMATION SCREEN ================= */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Status Banner */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 18px',
                    background: testConfirmation.delivery_status === 'sent'
                      ? (testConfirmation.channel === 'whatsapp' ? 'rgba(37,211,102,0.12)' : 'rgba(34,211,238,0.12)')
                      : 'rgba(239,68,68,0.12)',
                    border: `1px solid ${
                      testConfirmation.delivery_status === 'sent'
                        ? (testConfirmation.channel === 'whatsapp' ? 'rgba(37,211,102,0.35)' : 'rgba(34,211,238,0.35)')
                        : 'rgba(239,68,68,0.35)'
                    }`,
                    borderRadius: '4px',
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: testConfirmation.delivery_status === 'sent'
                        ? (testConfirmation.channel === 'whatsapp' ? '#25d366' : '#22d3ee')
                        : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#04141a',
                      flexShrink: 0,
                    }}>
                      {testConfirmation.delivery_status === 'sent' ? (
                        <RiCheckboxCircleFill size={26} />
                      ) : (
                        <RiAlertFill size={24} />
                      )}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: testConfirmation.delivery_status === 'sent'
                          ? (testConfirmation.channel === 'whatsapp' ? '#25d366' : '#22d3ee')
                          : '#f87171',
                      }}>
                        {testConfirmation.channel === 'whatsapp'
                          ? (testConfirmation.delivery_status === 'sent' ? 'WhatsApp Message Dispatched & Accepted' : 'WhatsApp Delivery Failed')
                          : (testConfirmation.delivery_status === 'sent' ? 'Email Dispatched Successfully' : 'Email Delivery Failed')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '3px' }}>
                        {testConfirmation.channel === 'whatsapp'
                          ? `Meta WhatsApp Cloud API returned HTTP ${testConfirmation.provider_status} (${testConfirmation.message_status || 'accepted'}).`
                          : `Resend transactional gateway returned HTTP ${testConfirmation.provider_status}.`}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click WhatsApp Direct Chat Protocol (wa.me) */}
                  {testConfirmation.channel === 'whatsapp' && testConfirmation.direct_url && (
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(37,211,102,0.16) 0%, rgba(9,13,22,0.95) 100%)',
                      border: '1px solid rgba(37,211,102,0.45)',
                      borderRadius: '4px',
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}>
                      <div style={{ flex: '1 1 260px' }}>
                        <div style={{ color: '#25d366', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <RiWhatsappFill size={16} />
                          INSTANT DIRECT CHAT PROTOCOL (wa.me)
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '3px', lineHeight: '1.4' }}>
                          Click below to open the conversation directly in WhatsApp Web or Mobile with recipient &amp; text pre-filled.
                        </div>
                      </div>
                      <a
                        href={testConfirmation.direct_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#25d366',
                          color: '#04141a',
                          padding: '10px 18px',
                          borderRadius: '3px',
                          fontWeight: '800',
                          fontSize: '13px',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
                        }}
                      >
                        <RiWhatsappFill size={18} />
                        Open in WhatsApp Web / App
                      </a>
                    </div>
                  )}

                  {/* Telemetry and Audit Grid */}
                  <div style={{
                    background: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '4px',
                    padding: '16px',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                      Transmission Telemetry &amp; Ledger Record
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Recipient:</span>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
                          {testConfirmation.recipient}
                          {testConfirmation.recipient_name && (
                            <span style={{ color: '#94a3b8', fontWeight: '400', marginLeft: '6px' }}>
                              ({testConfirmation.recipient_name})
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Channel &amp; Rail:</span>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: testConfirmation.channel === 'whatsapp' ? '#25d366' : '#22d3ee', marginTop: '2px' }}>
                          {testConfirmation.channel === 'whatsapp' ? 'WhatsApp (Meta Cloud API v20.0)' : 'Resend Email (contact.tunemavens.com)'}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Delivery Status:</span>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: testConfirmation.delivery_status === 'sent' ? '#10b981' : '#ef4444', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: testConfirmation.delivery_status === 'sent' ? '#10b981' : '#ef4444' }} />
                          {testConfirmation.delivery_status?.toUpperCase()} ({testConfirmation.provider_status})
                        </div>
                      </div>

                      {testConfirmation.comm_id && (
                        <div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Vault Audit ID:</span>
                          <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1', marginTop: '2px' }}>
                            {testConfirmation.comm_id}
                          </div>
                        </div>
                      )}

                      {testConfirmation.provider_msg_id && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Provider Message ID:</span>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                            {testConfirmation.provider_msg_id}
                          </div>
                        </div>
                      )}

                      {testConfirmation.error_details && (
                        <div style={{ gridColumn: '1 / -1', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '10px 12px', borderRadius: '3px' }}>
                          <span style={{ fontSize: '11px', color: '#f87171', fontWeight: '700' }}>Provider Notice:</span>
                          <div style={{ fontSize: '12px', color: '#fca5a5', marginTop: '2px' }}>
                            {testConfirmation.error_details}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Bubble Preview */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      Dispatched Message Content
                    </div>
                    <div style={{
                      background: testConfirmation.channel === 'whatsapp' ? '#0b141a' : '#090d16',
                      border: '1px solid #1e293b',
                      borderRadius: '4px',
                      padding: '14px 16px',
                    }}>
                      {testConfirmation.subject && (
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#22d3ee', marginBottom: '6px' }}>
                          Subject: {testConfirmation.subject}
                        </div>
                      )}
                      <div style={{
                        background: testConfirmation.channel === 'whatsapp' ? '#202c33' : '#131c2d',
                        padding: '12px 14px',
                        borderRadius: '4px',
                        color: '#e9edef',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        borderLeft: testConfirmation.channel === 'whatsapp' ? '3px solid #25d366' : '3px solid #22d3ee',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}>
                        {testConfirmation.message}
                        {testConfirmation.channel === 'whatsapp' && (
                          <div style={{ textAlign: 'right', fontSize: '10px', color: '#8696a0', marginTop: '6px' }}>
                            ✓✓ Delivered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta Sandbox Developer Notice */}
                  {testConfirmation.channel === 'whatsapp' && (
                    <div style={{
                      background: 'rgba(59,130,246,0.08)',
                      border: '1px solid rgba(59,130,246,0.25)',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      fontSize: '11px',
                      color: '#93c5fd',
                      lineHeight: '1.5',
                    }}>
                      <strong>💡 Meta Developer Sandbox Note:</strong> In development mode, Meta only delivers automated server pushes to phone numbers explicitly added to your <em>Allowed Recipients</em> list in the Meta App Dashboard. For unverified numbers, clicking <strong>"Open in WhatsApp Web / App"</strong> above will deliver the message directly to the recipient with zero restrictions!
                    </div>
                  )}

                  {/* Confirmation Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <button
                      onClick={() => { setTestConfirmation(null); setTestFeedback(null); }}
                      style={{
                        flex: 1,
                        background: '#131c2d',
                        color: '#cbd5e1',
                        border: '1px solid #1e293b',
                        borderRadius: '3px',
                        padding: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Send Another Message
                    </button>

                    <button
                      onClick={() => { setTestModalOpen(false); setTestConfirmation(null); }}
                      style={{
                        flex: 1,
                        background: testConfirmation.channel === 'whatsapp' ? '#25d366' : '#22d3ee',
                        color: '#04141a',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '10px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Done &amp; View in Vault
                    </button>
                  </div>
                </div>
              ) : (
                /* ================= COMPOSE FORM ================= */
                <div>
                  {testFeedback && (
                    <div style={{
                      padding: '12px 14px',
                      marginBottom: '16px',
                      borderRadius: '3px',
                      fontSize: '13px',
                      background: testFeedback.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                      border: `1px solid ${testFeedback.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
                      color: testFeedback.type === 'error' ? '#fca5a5' : '#6ee7b7',
                      wordBreak: 'break-word',
                    }}>
                      <div>{testFeedback.text}</div>
                      {testFeedback.direct_url && (
                        <div style={{ marginTop: '10px' }}>
                          <a
                            href={testFeedback.direct_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#25d366',
                              color: '#0b141a',
                              padding: '6px 12px',
                              borderRadius: '3px',
                              fontWeight: '700',
                              fontSize: '12px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <RiWhatsappFill size={14} />
                            Open Direct Chat (wa.me)
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {testTab === 'email' ? (
                    <div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          Recipient Email Address
                        </label>
                        <input
                          type="email"
                          value={testEmailTo}
                          onChange={(e) => setTestEmailTo(e.target.value)}
                          placeholder="e.g. yourname@domain.com"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '9px 12px',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          Sender Identity: <code>hello@contact.tunemavens.com</code> (Verified)
                        </div>
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={testEmailSubject}
                          onChange={(e) => setTestEmailSubject(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '9px 12px',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          Message Content
                        </label>
                        <textarea
                          rows={4}
                          value={testEmailMsg}
                          onChange={(e) => setTestEmailMsg(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '10px 12px',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '80px',
                            maxHeight: '260px',
                            fontFamily: 'inherit',
                            lineHeight: '1.5',
                          }}
                        />
                      </div>
                      <button
                        disabled={testSubmitting}
                        onClick={handleSendTestEmail}
                        style={{
                          width: '100%',
                          background: '#22d3ee',
                          color: '#04141a',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <RiMailSendLine size={16} />
                        {testSubmitting ? 'Dispatching via Resend...' : 'Send Test Email Now'}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        background: 'rgba(37,211,102,0.08)',
                        border: '1px solid rgba(37,211,102,0.25)',
                        borderRadius: '3px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        fontSize: '12px',
                        color: '#cbd5e1',
                        lineHeight: '1.5',
                      }}>
                        <strong style={{ color: '#25d366' }}>Omnichannel WhatsApp Rail:</strong>
                        {' '}Dispatches automated WhatsApp push messages to registered mobile phones and generates direct <strong>wa.me Click-to-Chat URLs</strong>.
                        <div style={{ marginTop: '4px', color: '#94a3b8', fontSize: '11px' }}>
                          Meta WhatsApp Cloud API active. Recipient phone numbers must include country code (e.g. <code>+254 722 520 040</code>).
                        </div>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          Recipient Phone Number (International E.164)
                        </label>
                        <input
                          type="tel"
                          value={testWaPhone}
                          onChange={(e) => setTestWaPhone(e.target.value)}
                          placeholder="e.g. +254 722 520 040 or +1 (555) 019-2834"
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '9px 12px',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                          Supports international E.164 format and automated server push + click-to-chat dispatch
                        </div>
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          value={testWaName}
                          onChange={(e) => setTestWaName(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '9px 12px',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
                          WhatsApp Message Body
                        </label>
                        <textarea
                          rows={4}
                          value={testWaMsg}
                          onChange={(e) => setTestWaMsg(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: '#090d16',
                            border: '1px solid #1e293b',
                            borderRadius: '3px',
                            color: '#f8fafc',
                            padding: '10px 12px',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '80px',
                            maxHeight: '260px',
                            fontFamily: 'inherit',
                            lineHeight: '1.5',
                          }}
                        />
                      </div>
                      <button
                        disabled={testSubmitting}
                        onClick={handleSendTestWhatsapp}
                        style={{
                          width: '100%',
                          background: '#25d366',
                          color: '#04141a',
                          border: 'none',
                          borderRadius: '3px',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <RiWhatsappFill size={16} />
                        {testSubmitting ? 'Dispatching...' : 'Dispatch WhatsApp Message'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
