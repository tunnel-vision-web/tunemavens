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
  const [archiveFilter, setArchiveFilter] = useState('false'); // 'false' = active, 'true' = archived, 'all' = all
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal inspection state
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [inspectedMessage, setInspectedMessage] = useState(null);
  const [inspectTab, setInspectTab] = useState('preview'); // 'preview', 'text', 'telemetry', 'json'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [debouncedSearch, selectedRole, selectedEventType, selectedStatus, archiveFilter, currentPage]);

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
              Provider Rail
            </span>
            <span style={{
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
            }}>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#22d3ee' }}>
            Resend REST API
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Automatic fallback + sandbox outbox
          </div>
        </div>
      </div>

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

                      {/* Rail / Provider */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                          Resend API
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                          {item.resend_id ? item.resend_id.slice(0, 14) + '...' : (item.from_addr ? item.from_addr.split('<')[0] : 'onboarding')}
                        </div>
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

                          {/* Re-send Button */}
                          <button
                            disabled={actionLoadingId === item.id}
                            onClick={() => handleResend(item)}
                            style={{
                              background: '#131c2d',
                              color: '#10b981',
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
                            title="Re-send email via Resend API"
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
        <div style={{
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
        }}>
          <div style={{
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
                <button
                  disabled={actionLoadingId === inspectedMessage.id}
                  onClick={() => handleResend(inspectedMessage)}
                  style={{
                    background: '#10b981',
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
                  Re-send Email Now
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
    </div>
  );
}
