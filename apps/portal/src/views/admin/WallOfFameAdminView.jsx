import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiAwardFill,
  RiUserAddLine,
  RiMailSendLine,
  RiWhatsappLine,
  RiDatabase2Line,
  RiEyeLine,
  RiEyeOffLine,
  RiRefreshLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiCloseLine,
  RiCheckLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiExternalLinkLine,
  RiArrowRightLine
} from 'react-icons/ri';
import './WallOfFameAdminView.css';

const ROLES = [
  { id: 'all', label: 'All Roles' },
  { id: 'creator', label: 'Creators' },
  { id: 'producer', label: 'Producers' },
  { id: 'supervisor', label: 'Supervisors' },
  { id: 'label', label: 'Record Labels' },
  { id: 'dj', label: 'DJs' },
  { id: 'exec', label: 'Executives' },
  { id: 'vc', label: 'Investors & VCs' },
];

export default function WallOfFameAdminView({ sessionUser }) {
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({ total: 0, claimed: 0, invited: 0, pending: 0 });
  const [crmLeads, setCrmLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'claimed' | 'invited' | 'pending' | 'crm'
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success' | 'error', text: '' }

  // Invite / Nominate Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [ytFetching, setYtFetching] = useState(false);
  const [ytPreview, setYtPreview] = useState(null);
  const [inviteSuccessData, setInviteSuccessData] = useState(null);

  const [form, setForm] = useState({
    subject_name: '',
    role: 'creator',
    subject_email: '',
    phone: '',
    youtube_url: '',
    bio: '',
    tags: '',
    custom_note: '',
    send_email_invite: true,
    send_whatsapp_invite: true,
    sync_crm: true,
    pre_claim: false,
  });

  // Re-invite quick modal
  const [reinviteTarget, setReinviteTarget] = useState(null);

  useEffect(() => {
    fetchAdminData();
    fetchCrmLeads();
  }, []);

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/wall-of-fame');
      if (!res.ok) throw new Error('Failed to load Wall of Fame records');
      const data = await res.json();
      setProfiles(data.profiles || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error(err);
      showAlert('error', err.message || 'Error fetching admin records');
    } finally {
      setLoading(false);
    }
  };

  const fetchCrmLeads = async () => {
    try {
      const res = await fetch('/api/admin/wall-of-fame/crm-leads');
      if (res.ok) {
        const data = await res.json();
        setCrmLeads(data.leads || []);
      }
    } catch (e) {
      console.warn('Could not load CRM leads', e);
    }
  };

  // Preview YouTube metadata
  const handleFetchYtMetadata = async () => {
    if (!form.youtube_url.trim()) return;
    try {
      setYtFetching(true);
      const res = await fetch(`/api/community/wall-of-fame/youtube/metadata?url=${encodeURIComponent(form.youtube_url)}`);
      if (res.ok) {
        const data = await res.json();
        setYtPreview(data);
      } else {
        showAlert('error', 'Could not locate YouTube channel or video.');
      }
    } catch (err) {
      showAlert('error', 'Error querying YouTube API.');
    } finally {
      setYtFetching(false);
    }
  };

  // Create nominee & dispatch protocol
  const handleSubmitNomination = async (e) => {
    e.preventDefault();
    if (!form.subject_name.trim()) {
      showAlert('error', 'Personality name is required.');
      return;
    }

    try {
      setModalSubmitting(true);
      const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);

      // 1. Create featured profile record
      const createRes = await fetch('/api/admin/wall-of-fame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_name: form.subject_name.trim(),
          role: form.role,
          subject_email: form.subject_email.trim() || null,
          phone: form.phone.trim() || null,
          youtube_channel_handle: form.youtube_url.startsWith('@') ? form.youtube_url : null,
          youtube_video_id: (!form.youtube_url.startsWith('@') && form.youtube_url) ? form.youtube_url : null,
          bio: form.bio.trim() || `Recognized industry leader and ${form.role.toUpperCase()} inductee on the TuneMavens Wall of Fame.`,
          tags: tagsArray,
          pre_claim: form.pre_claim,
        }),
      });

      if (!createRes.ok) {
        const errJson = await createRes.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to create profile.');
      }

      const createdProfile = await createRes.json();

      // 2. If not pre-claimed, dispatch invitation across Communication Protocols & Smart CRM
      if (!form.pre_claim && (form.subject_email || form.phone)) {
        const inviteRes = await fetch(`/api/admin/wall-of-fame/${createdProfile.id}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject_email: form.subject_email.trim() || null,
            phone: form.phone.trim() || null,
            custom_note: form.custom_note.trim() || null,
            send_email_invite: form.send_email_invite,
            send_whatsapp_invite: form.send_whatsapp_invite,
            sync_crm: form.sync_crm,
          }),
        });

        if (inviteRes.ok) {
          const inviteData = await inviteRes.json();
          setInviteSuccessData(inviteData);
          showAlert('success', `Induction invitation dispatched to ${form.subject_name}!`);
        }
      } else {
        showAlert('success', `Wall of Fame entry created for ${form.subject_name}.`);
        setModalOpen(false);
      }

      fetchAdminData();
      fetchCrmLeads();
    } catch (err) {
      console.error(err);
      showAlert('error', err.message || 'Failed to complete nomination.');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (profile) => {
    try {
      const nextVisible = !profile.visible;
      const res = await fetch(`/api/admin/wall-of-fame/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: nextVisible }),
      });
      if (!res.ok) throw new Error('Failed to update visibility');
      showAlert('success', `${profile.subject_name} is now ${nextVisible ? 'Visible on Wall of Fame' : 'Hidden from public grid'}.`);
      fetchAdminData();
    } catch (e) {
      showAlert('error', e.message);
    }
  };

  // Re-send / Send Invite
  const handleSendInvite = async (profile) => {
    try {
      const res = await fetch(`/api/admin/wall-of-fame/${profile.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_email: profile.subject_email || null,
          phone: profile.phone || null,
          send_email_invite: true,
          send_whatsapp_invite: true,
          sync_crm: true,
        }),
      });
      if (!res.ok) throw new Error('Failed to dispatch invite');
      const data = await res.json();
      showAlert('success', `Invitation re-dispatched to ${profile.subject_name}! Claim link copied.`);
      if (data.claim_url) {
        navigator.clipboard?.writeText(data.claim_url);
      }
      fetchAdminData();
      fetchCrmLeads();
    } catch (e) {
      showAlert('error', e.message);
    }
  };

  // Revoke Invite
  const handleRevokeInvite = async (profile) => {
    if (!window.confirm(`Revoke pending invitation for ${profile.subject_name}?`)) return;
    try {
      const res = await fetch(`/api/admin/wall-of-fame/${profile.id}/revoke-invite`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to revoke invite');
      showAlert('success', `Invitation token revoked for ${profile.subject_name}.`);
      fetchAdminData();
      fetchCrmLeads();
    } catch (e) {
      showAlert('error', e.message);
    }
  };

  // Refresh YouTube Metrics
  const handleRefreshYt = async (profile) => {
    try {
      const res = await fetch(`/api/admin/wall-of-fame/${profile.id}/refresh-youtube`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to sync YouTube metrics');
      showAlert('success', `Updated live YouTube metrics for ${profile.subject_name}.`);
      fetchAdminData();
    } catch (e) {
      showAlert('error', e.message);
    }
  };

  // Delete Profile
  const handleDeleteProfile = async (profile) => {
    if (!window.confirm(`Permanently remove ${profile.subject_name} from the Wall of Fame?`)) return;
    try {
      const res = await fetch(`/api/admin/wall-of-fame/${profile.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete profile');
      showAlert('success', `Profile for ${profile.subject_name} removed.`);
      fetchAdminData();
      fetchCrmLeads();
    } catch (e) {
      showAlert('error', e.message);
    }
  };

  // Copy Claim Link
  const handleCopyLink = (token) => {
    const link = `https://tunemavens.com/#/wall-of-fame/claim/${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      showAlert('success', 'Claim link copied to clipboard!');
    }
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    if (activeTab === 'claimed' && p.state !== 'claimed') return false;
    if (activeTab === 'invited' && p.state !== 'invited') return false;
    if (activeTab === 'pending' && p.state !== 'pending') return false;

    if (roleFilter !== 'all' && p.role !== roleFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (p.subject_name || '').toLowerCase().includes(q);
      const matchBio = (p.bio || '').toLowerCase().includes(q);
      const matchEmail = (p.subject_email || '').toLowerCase().includes(q);
      const matchTag = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchEmail && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="wof-admin-container">
      <div className="wof-admin-inner">
        {/* Breadcrumbs */}
        <div className="wof-admin-breadcrumbs">
          <Link to="/">Dashboard</Link>
          <span>/</span>
          <Link to="/community">Support &amp; Community</Link>
          <span>/</span>
          <span>Wall of Fame Management</span>
        </div>

        {/* Header */}
        <div className="wof-admin-header">
          <div className="wof-admin-header-main">
            <div>
              <div className="wof-admin-title-badge">
                <RiShieldCheckLine /> Administrative Curation Suite &bull; Phase 5.5
              </div>
              <h1>Wall of Fame Admin Console</h1>
              <p className="wof-admin-subtitle">
                Curate industry luminaries, dispatch official induction invitations across Communication Protocols &amp; Smart CRM, and manage live public visibility.
              </p>
            </div>

            <div className="wof-admin-header-actions">
              <Link to="/community/wall-of-fame" className="wof-btn wof-btn-outline" target="_blank" rel="noreferrer">
                <RiExternalLinkLine /> Public Wall of Fame
              </Link>
              <button
                className="wof-btn wof-btn-primary"
                onClick={() => {
                  setInviteSuccessData(null);
                  setYtPreview(null);
                  setForm({
                    subject_name: '',
                    role: 'creator',
                    subject_email: '',
                    phone: '',
                    youtube_url: '',
                    bio: '',
                    tags: '',
                    custom_note: '',
                    send_email_invite: true,
                    send_whatsapp_invite: true,
                    sync_crm: true,
                    pre_claim: false,
                  });
                  setModalOpen(true);
                }}
              >
                <RiUserAddLine /> Nominate &amp; Invite Personality
              </button>
            </div>
          </div>
        </div>

        {/* Alert message */}
        {alertMsg && (
          <div className={`wof-alert wof-alert-${alertMsg.type}`}>
            <span>{alertMsg.text}</span>
            <button className="wof-modal-close" onClick={() => setAlertMsg(null)}>
              <RiCloseLine />
            </button>
          </div>
        )}

        {/* KPI Grid */}
        <div className="wof-kpi-grid">
          <div className="wof-kpi-card">
            <div className="wof-kpi-icon purple">
              <RiAwardFill />
            </div>
            <div className="wof-kpi-info">
              <span className="wof-kpi-val">{stats.total || profiles.length}</span>
              <span className="wof-kpi-lbl">Total Inductees</span>
            </div>
          </div>

          <div className="wof-kpi-card">
            <div className="wof-kpi-icon green">
              <RiCheckLine />
            </div>
            <div className="wof-kpi-info">
              <span className="wof-kpi-val">{stats.claimed || 0}</span>
              <span className="wof-kpi-lbl">Live &amp; Inducted</span>
            </div>
          </div>

          <div className="wof-kpi-card">
            <div className="wof-kpi-icon amber">
              <RiMailSendLine />
            </div>
            <div className="wof-kpi-info">
              <span className="wof-kpi-val">{stats.invited || 0}</span>
              <span className="wof-kpi-lbl">Invited (Pending)</span>
            </div>
          </div>

          <div className="wof-kpi-card">
            <div className="wof-kpi-icon blue">
              <RiUserAddLine />
            </div>
            <div className="wof-kpi-info">
              <span className="wof-kpi-val">{stats.pending || 0}</span>
              <span className="wof-kpi-lbl">Draft Nominations</span>
            </div>
          </div>

          <div className="wof-kpi-card">
            <div className="wof-kpi-icon cyan">
              <RiDatabase2Line />
            </div>
            <div className="wof-kpi-info">
              <span className="wof-kpi-val">{crmLeads.length}</span>
              <span className="wof-kpi-lbl">Smart CRM Leads</span>
            </div>
          </div>
        </div>

        {/* Controls Bar: Tabs, Search & Filters */}
        <div className="wof-controls-card">
          <div className="wof-tabs">
            <button
              className={`wof-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Profiles <span className="wof-tab-badge">{profiles.length}</span>
            </button>
            <button
              className={`wof-tab-btn ${activeTab === 'claimed' ? 'active' : ''}`}
              onClick={() => setActiveTab('claimed')}
            >
              Inducted &bull; Live <span className="wof-tab-badge">{stats.claimed || 0}</span>
            </button>
            <button
              className={`wof-tab-btn ${activeTab === 'invited' ? 'active' : ''}`}
              onClick={() => setActiveTab('invited')}
            >
              Invited (Awaiting Claim) <span className="wof-tab-badge">{stats.invited || 0}</span>
            </button>
            <button
              className={`wof-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Drafts <span className="wof-tab-badge">{stats.pending || 0}</span>
            </button>
            <button
              className={`wof-tab-btn ${activeTab === 'crm' ? 'active' : ''}`}
              onClick={() => setActiveTab('crm')}
            >
              Smart CRM Pipeline <span className="wof-tab-badge">{crmLeads.length}</span>
            </button>
          </div>

          {activeTab !== 'crm' && (
            <div className="wof-filters-group">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="wof-search-input"
                  placeholder="Search name, tag, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="wof-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Active Tab Content */}
        {activeTab === 'crm' ? (
          /* Smart CRM Leads Table */
          <div className="wof-table-wrapper">
            <table className="wof-table">
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Contact Info</th>
                  <th>Role &amp; Tags</th>
                  <th>CRM Status</th>
                  <th>Claim Token / URL</th>
                  <th>Last Outreach</th>
                </tr>
              </thead>
              <tbody>
                {crmLeads.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="wof-empty">
                        <RiDatabase2Line className="wof-empty-icon" />
                        <h4>No Smart CRM Leads Found</h4>
                        <p>Dispatching an induction invite registers the personality as a tracked lead.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  crmLeads.map((lead) => (
                    <tr key={lead.id || lead._id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{lead.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Source: {lead.source || 'wall_of_fame_curator'}
                        </div>
                      </td>
                      <td>
                        <div className="wof-email">{lead.email || 'No email registered'}</div>
                        {lead.phone && <div className="wof-phone">{lead.phone}</div>}
                      </td>
                      <td>
                        <span className={`wof-role-badge ${lead.role || 'creator'}`}>
                          {lead.role || 'creator'}
                        </span>
                        <div style={{ marginTop: '4px' }}>
                          {(lead.tags || []).map((t, i) => (
                            <span key={i} className="wof-crm-chip">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`wof-status-badge ${lead.status === 'inducted' ? 'claimed' : lead.status === 'invited' ? 'invited' : 'pending'}`}>
                          {lead.status?.toUpperCase() || 'NEW'}
                        </span>
                      </td>
                      <td>
                        {lead.claim_token ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <code style={{ fontSize: '11px', color: '#38bdf8' }}>
                              {lead.claim_token.substring(0, 12)}...
                            </code>
                            <button
                              className="wof-btn wof-btn-secondary wof-btn-sm"
                              onClick={() => handleCopyLink(lead.claim_token)}
                              title="Copy Claim Link"
                            >
                              <RiFileCopyLine /> Copy
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '11px' }}>Not yet invited</span>
                        )}
                      </td>
                      <td style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        {lead.last_outreach_at
                          ? new Date(lead.last_outreach_at).toLocaleDateString()
                          : lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Inductees Master Table */
          <div className="wof-table-wrapper">
            <table className="wof-table">
              <thead>
                <tr>
                  <th>Personality</th>
                  <th>Canonical Role</th>
                  <th>YouTube Showcase</th>
                  <th>State &amp; Pipeline</th>
                  <th>Live Visibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="wof-empty">
                        <RiAwardFill className="wof-empty-icon" />
                        <h4>No personalities match the current filters</h4>
                        <p>Try clearing your search query or nominate a new figure.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => (
                    <tr key={p.id}>
                      {/* Personality */}
                      <td>
                        <div className="wof-profile-cell">
                          <img
                            src={
                              p.youtube_thumbnail_url ||
                              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&q=80'
                            }
                            alt={p.subject_name}
                            className="wof-thumb"
                          />
                          <div className="wof-profile-meta">
                            <span className="wof-name">{p.subject_name}</span>
                            {p.subject_email && <span className="wof-email">{p.subject_email}</span>}
                            {p.phone && <span className="wof-phone">{p.phone}</span>}
                            <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
                              {(p.tags || []).slice(0, 3).map((t, idx) => (
                                <span key={idx} className="wof-crm-chip">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Canonical Role */}
                      <td>
                        <span className={`wof-role-badge ${p.role || 'creator'}`}>
                          {p.role || 'creator'}
                        </span>
                      </td>

                      {/* YouTube Metrics */}
                      <td>
                        <div style={{ maxWidth: '240px' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={p.youtube_video_title || p.youtube_channel_handle}
                          >
                            {p.youtube_video_title || p.youtube_channel_handle || 'No video linked'}
                          </div>
                          {p.youtube_views_formatted && (
                            <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                              {p.youtube_views_formatted}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* State */}
                      <td>
                        <span
                          className={`wof-status-badge ${
                            p.state === 'claimed' ? 'claimed' : p.state === 'invited' ? 'invited' : 'pending'
                          }`}
                        >
                          {p.state === 'claimed' && <RiCheckLine />}
                          {p.state === 'invited' && <RiMailSendLine />}
                          {p.state === 'pending' && <RiUserAddLine />}
                          {p.state?.toUpperCase() || 'PENDING'}
                        </span>
                        {p.claim_token && p.state === 'invited' && (
                          <div style={{ marginTop: '4px' }}>
                            <button
                              className="wof-btn wof-btn-outline wof-btn-sm"
                              onClick={() => handleCopyLink(p.claim_token)}
                              title="Copy induction claim URL"
                            >
                              <RiFileCopyLine /> Copy Link
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td>
                        <button
                          className={`wof-toggle-btn ${p.visible ? 'visible' : 'hidden'}`}
                          onClick={() => handleToggleVisibility(p)}
                          title="Toggle live visibility on Wall of Fame"
                        >
                          {p.visible ? <RiEyeLine /> : <RiEyeOffLine />}
                          {p.visible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="wof-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          {p.state !== 'claimed' && (
                            <button
                              className="wof-btn wof-btn-primary wof-btn-sm"
                              onClick={() => handleSendInvite(p)}
                              title="Send / Re-send official induction invitation via Resend & WhatsApp"
                            >
                              <RiMailSendLine /> Invite
                            </button>
                          )}

                          {p.claim_token && p.state === 'invited' && (
                            <button
                              className="wof-btn wof-btn-outline wof-btn-sm"
                              onClick={() => handleRevokeInvite(p)}
                              title="Revoke active invitation token"
                            >
                              Revoke
                            </button>
                          )}

                          <button
                            className="wof-btn wof-btn-secondary wof-btn-sm"
                            onClick={() => handleRefreshYt(p)}
                            title="Refresh YouTube metadata & views"
                          >
                            <RiRefreshLine />
                          </button>

                          <button
                            className="wof-btn wof-btn-danger wof-btn-sm"
                            onClick={() => handleDeleteProfile(p)}
                            title="Remove profile"
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Nominate & Invite Personality Modal */}
        {modalOpen && (
          <div className="wof-modal-overlay" onClick={() => !modalSubmitting && setModalOpen(false)}>
            <div className="wof-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="wof-modal-header">
                <h3>🏆 Nominate &amp; Invite Industry Luminary</h3>
                <button
                  className="wof-modal-close"
                  onClick={() => setModalOpen(false)}
                  disabled={modalSubmitting}
                >
                  <RiCloseLine />
                </button>
              </div>

              {inviteSuccessData ? (
                /* Success Screen with Copy Link */
                <div className="wof-modal-body">
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ade80',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        margin: '0 auto 16px auto',
                      }}
                    >
                      <RiCheckLine />
                    </div>
                    <h3 style={{ margin: '0 0 6px 0', color: '#ffffff' }}>Invitation Successfully Dispatched!</h3>
                    <p style={{ color: '#94a3b8', fontSize: '13.5px', margin: '0 0 20px 0' }}>
                      Official induction record generated across Communication Protocols and registered in Smart CRM.
                    </p>

                    <div
                      style={{
                        background: '#090d16',
                        border: '1px solid #1e293b',
                        borderRadius: '3px',
                        padding: '16px',
                        textAlign: 'left',
                        marginBottom: '20px',
                      }}
                    >
                      <label style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Direct Claim Verification URL
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <input
                          type="text"
                          readOnly
                          value={inviteSuccessData.claim_url}
                          className="wof-form-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          className="wof-btn wof-btn-primary"
                          onClick={() => {
                            navigator.clipboard?.writeText(inviteSuccessData.claim_url);
                            showAlert('success', 'Claim link copied to clipboard!');
                          }}
                        >
                          <RiFileCopyLine /> Copy
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button
                        className="wof-btn wof-btn-secondary"
                        onClick={() => {
                          setModalOpen(false);
                          setInviteSuccessData(null);
                        }}
                      >
                        Done &amp; Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Nomination Form */
                <form onSubmit={handleSubmitNomination}>
                  <div className="wof-modal-body">
                    {/* Personality & Role */}
                    <div className="wof-form-row">
                      <div className="wof-form-group">
                        <label>Personality / Subject Name *</label>
                        <input
                          type="text"
                          className="wof-form-input"
                          placeholder="e.g. Quincy Jones, Max Martin"
                          value={form.subject_name}
                          onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="wof-form-group">
                        <label>Canonical Industry Role</label>
                        <select
                          className="wof-form-select"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                          <option value="creator">Creator / Artist</option>
                          <option value="producer">Producer / Sound Engineer</option>
                          <option value="supervisor">Music Supervisor / Sync Exec</option>
                          <option value="label">Record Label / A&amp;R</option>
                          <option value="dj">DJ / Curator</option>
                          <option value="exec">Industry Executive</option>
                          <option value="vc">Music Tech Investor &bull; VC</option>
                        </select>
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="wof-form-row">
                      <div className="wof-form-group">
                        <label>Contact Email (for Official Induction Dispatch)</label>
                        <input
                          type="email"
                          className="wof-form-input"
                          placeholder="management@artist.com"
                          value={form.subject_email}
                          onChange={(e) => setForm({ ...form, subject_email: e.target.value })}
                        />
                      </div>

                      <div className="wof-form-group">
                        <label>Phone / WhatsApp Number (with Country Code)</label>
                        <input
                          type="tel"
                          className="wof-form-input"
                          placeholder="+1 (555) 019-2834 or +254..."
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* YouTube Video / Channel */}
                    <div className="wof-form-group">
                      <label>YouTube Channel Handle or Showcase Video URL</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="wof-form-input"
                          placeholder="https://youtube.com/watch?v=... or @ChannelHandle"
                          value={form.youtube_url}
                          onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="wof-btn wof-btn-secondary"
                          onClick={handleFetchYtMetadata}
                          disabled={ytFetching}
                        >
                          {ytFetching ? <RiRefreshLine className="spin" /> : 'Fetch Preview'}
                        </button>
                      </div>

                      {ytPreview && (
                        <div className="wof-yt-preview-box">
                          {ytPreview.thumbnail_url && (
                            <img src={ytPreview.thumbnail_url} alt="preview" className="wof-yt-preview-thumb" />
                          )}
                          <div className="wof-yt-preview-info">
                            <span className="wof-yt-preview-title">{ytPreview.title}</span>
                            <span className="wof-yt-preview-views">{ytPreview.views_formatted}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bio & Accolades */}
                    <div className="wof-form-group">
                      <label>Biography &amp; Induction Accolades</label>
                      <textarea
                        className="wof-form-textarea"
                        placeholder="Highlight seminal achievements, Grammy wins, global catalog streams, or ecosystem innovations..."
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      />
                    </div>

                    {/* Custom Induction Note */}
                    <div className="wof-form-group">
                      <label>Personal Curatorial Note (Included in Official Invitation)</label>
                      <input
                        type="text"
                        className="wof-form-input"
                        placeholder="e.g. In recognition of your seminal contributions to continental music export..."
                        value={form.custom_note}
                        onChange={(e) => setForm({ ...form, custom_note: e.target.value })}
                      />
                    </div>

                    {/* Tags */}
                    <div className="wof-form-group">
                      <label>Tags (Comma-separated)</label>
                      <input
                        type="text"
                        className="wof-form-input"
                        placeholder="Grammy Winner, Production Pioneer, Songwriter, Afrobeat..."
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      />
                    </div>

                    {/* Communication Protocols & CRM Switches */}
                    <div className="wof-protocol-switches">
                      <div className="wof-protocol-title">
                        <RiShieldCheckLine /> Communication Protocols &amp; Smart CRM Automation
                      </div>

                      <label className="wof-switch-label">
                        <input
                          type="checkbox"
                          checked={form.send_email_invite}
                          onChange={(e) => setForm({ ...form, send_email_invite: e.target.checked })}
                        />
                        <span>
                          <strong>Dispatch Branded Induction Email</strong> via Ecosystem Protocol (Resend &amp; Communications Vault)
                        </span>
                      </label>

                      <label className="wof-switch-label">
                        <input
                          type="checkbox"
                          checked={form.send_whatsapp_invite}
                          onChange={(e) => setForm({ ...form, send_whatsapp_invite: e.target.checked })}
                        />
                        <span>
                          <strong>Dispatch WhatsApp Induction Notification</strong> (if phone number is supplied)
                        </span>
                      </label>

                      <label className="wof-switch-label">
                        <input
                          type="checkbox"
                          checked={form.sync_crm}
                          onChange={(e) => setForm({ ...form, sync_crm: e.target.checked })}
                        />
                        <span>
                          <strong>Synchronize with Intermaven Smart CRM</strong> (Tag candidate &amp; register in lead pipeline)
                        </span>
                      </label>

                      <label className="wof-switch-label" style={{ marginTop: '4px', borderTop: '1px solid rgba(134, 59, 255, 0.15)', paddingTop: '8px' }}>
                        <input
                          type="checkbox"
                          checked={form.pre_claim}
                          onChange={(e) => setForm({ ...form, pre_claim: e.target.checked })}
                        />
                        <span style={{ color: '#cbd5e1' }}>
                          <strong>Pre-claim &amp; Publish Immediately</strong> (Bypasses verification gating; marks profile live)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="wof-modal-footer">
                    <button
                      type="button"
                      className="wof-btn wof-btn-secondary"
                      onClick={() => setModalOpen(false)}
                      disabled={modalSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="wof-btn wof-btn-primary"
                      disabled={modalSubmitting}
                    >
                      {modalSubmitting ? <RiRefreshLine className="spin" /> : <RiMailSendLine />}
                      {modalSubmitting ? 'Dispatching...' : 'Dispatch Induction & Save'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
