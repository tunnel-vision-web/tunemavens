import React, { useState, useEffect } from 'react';
import {
  RiShieldCheckFill, RiTeamFill, RiUserAddFill, RiDeleteBin6Line,
  RiCloseLine, RiMailLine, RiCheckLine, RiCoinsFill, RiLockFill,
  RiKey2Fill, RiTerminalFill, RiRadioFill, RiFileTextFill, RiSearchLine,
  RiGlobalFill, RiFlashlightFill, RiEqualizerFill, RiPriceTag3Fill,
  RiDatabase2Fill, RiAlertFill, RiEditLine, RiFilter3Line,
  RiBookOpenFill, RiBookOpenLine
} from 'react-icons/ri';
import CreditReloadModal from '../common/CreditReloadModal.jsx';
import InAppDocModal from '../common/InAppDocModal.jsx';

// Site Admin Seat Allocation Quotas  -  100% Unified Credits Model (Zero Monthly Fees)
export const ADMIN_TIERS = {
  core: {
    id: 'core',
    name: 'Foundation Node Allocation',
    price: '2,500 Credits',
    priceUsd: '$199 one-time',
    creditsAmount: 2500,
    maxSeats: 5,
    description: 'Foundation operations allocation. Up to 5 authorized platform administrator seats with granular clearance levels. Zero monthly charges.',
    features: ['5 Administrative Seats', 'Tier 1-4 Clearance Controls', 'Statutory Audit Logging', 'Escrow Settlement Authorization', 'Zero Monthly Charges']
  },
  scale: {
    id: 'scale',
    name: 'Operational Fleet Allocation',
    price: '6,000 Credits',
    priceUsd: '$499 one-time',
    creditsAmount: 6000,
    maxSeats: 15,
    description: 'Full-spectrum administrative allocation. Up to 15 platform operator seats across catalog, royalties, escrow, sync, and security. Zero monthly charges.',
    features: ['15 Administrative Seats', 'Full DDEX Ingestion QA Desk', 'Automated Split Cascade Governance', 'Corporate Ads Flight Dispatcher', 'Zero Monthly Charges']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Global Grid Allocation',
    price: '15,000 Credits',
    priceUsd: '$1,199 one-time',
    creditsAmount: 15000,
    maxSeats: 9999,
    description: 'Unlimited capacity for multi-region platform clusters, worldwide rights organizations, and distributed network operations centers.',
    features: ['Unlimited Administrative Seats', 'Multi-Region High Availability', 'Master Root Killswitch Access', 'Dedicated Hardware Security Module (HSM)', 'Zero Monthly Charges']
  }
};

// Platform-Relevant Job Roles and Responsibilities across TuneMavens/Intermaven
export const PLATFORM_ADMIN_ROLES = [
  {
    id: 'role_net_ops',
    title: 'Network Operations Director / Super Admin',
    department: 'Infrastructure & Core Ops',
    clearance: 'Tier 1 - Super Admin',
    description: 'Full platform sovereignty: master killswitches, database integrity, domain routing, and root role elevation.',
    defaultScopes: ['Platform Clusters', 'Master Killswitch', 'Database Migrations', 'Root Audit Trail'],
    recommendedReadings: [
      { id: 'universal-credits-system-guide', title: 'Universal Credits Engine' },
      { id: 'account-security-2fa-and-roles', title: 'Account Security, 2FA & Roles' }
    ]
  },
  {
    id: 'role_catalog_ddex',
    title: 'Head of Catalog Ingestion & DDEX QA',
    department: 'Catalog & IP Architecture',
    clearance: 'Tier 2 - Operational Director',
    description: 'Authoritative validation of sound recordings, lossless stems, bulk DDEX XML/CSV feeds, and ISRC/ISWC uniqueness.',
    defaultScopes: ['DDEX Ingestion QA', 'ISRC/ISWC Registry', 'Lossless Audio QA', 'Stem Archive Storage'],
    recommendedReadings: [
      { id: 'music-metadata-isrc-iswc-ipi-upc', title: 'ISRC, ISWC & UPC Identifiers' },
      { id: 'masterlab-ai-mastering', title: 'MasterLab AI & Loudness Standards' }
    ]
  },
  {
    id: 'role_statutory_auditor',
    title: 'Global Rights & Statutory Royalty Auditor',
    department: 'Royalties & Financial Compliance',
    clearance: 'Tier 2 - Operational Director',
    description: 'Reconciles statutory mechanical pools, PRO compliance exports (ASCAP/BMI/MCSK), and automated split cascade math.',
    defaultScopes: ['Statutory Ledgers', 'PRO Compliance (ASCAP/BMI/MCSK)', 'Mechanical Splits', 'Audit Trails'],
    recommendedReadings: [
      { id: 'mechanical-royalties-and-mlc', title: 'Mechanical Royalties & The MLC' },
      { id: 'pros-cmos-ascap-bmi-sesac-prs', title: 'PROs & CMOs (ASCAP, BMI, MCSK)' }
    ]
  },
  {
    id: 'role_escrow_officer',
    title: 'Split Cascades & Escrow Settlement Officer',
    department: 'Treasury & Payout Gateway',
    clearance: 'Tier 2 - Operational Director',
    description: 'Approves payout batches, monitors M-Pesa B2C and bank wire gateways, and mediates milestone escrow release contracts.',
    defaultScopes: ['Escrow Dispute Arbitration', 'Payout Batch Approvals', 'M-Pesa B2C Releases', 'ACH & Wire Gateway'],
    recommendedReadings: [
      { id: 'tuneledger-and-split-cascade', title: 'TuneLedger & Split Cascade' },
      { id: 'tuneledger-escrow-dispute-locks', title: 'TuneLedger Escrow Dispute Locks' }
    ]
  },
  {
    id: 'role_sync_curator',
    title: 'Chief Music Curation & Sync Placement Director',
    department: 'Sync & Editorial Media',
    clearance: 'Tier 2 - Operational Director',
    description: 'Curates TuneStream algorithmic and editorial stations, reviews sync placement briefs, and vets unreleased dubplate pools.',
    defaultScopes: ['TuneStream Editorial Playlists', 'Sync Marketplace RFP Review', 'Dubplate Vetting', 'Supervisor Matching'],
    recommendedReadings: [
      { id: 'sync-licensing-masterclass', title: 'Sync Licensing Masterclass' },
      { id: 'syncmavens-licensing-platform', title: 'SyncMavens Licensing Marketplace' }
    ]
  },
  {
    id: 'role_ad_traffic',
    title: 'Corporate Ads & Brand Traffic Manager',
    department: 'Advertising & Sponsorships',
    clearance: 'Tier 3 - Platform Specialist',
    description: 'Schedules 15s/30s audio flight campaigns, verifies impression delivery, and governs media house monetization rates.',
    defaultScopes: ['Audio Ad Flight Approvals', 'CPM Rate Card Engine', 'Banner Impression QA', 'Media House Payouts'],
    recommendedReadings: [
      { id: 'corporate-ads-and-brand-flights', title: 'Corporate Ads & Brand Flights' },
      { id: 'tunestream-audiophile-streaming', title: 'TuneStream Lossless Streaming' }
    ]
  },
  {
    id: 'role_security_compliance',
    title: 'Platform Security & Compliance Lead',
    department: 'InfoSec & Legal Governance',
    clearance: 'Tier 1 - Super Admin',
    description: 'Enforces DMCA takedown orders, verifies custom subdomains and SSL certificates, and audits SSO session health.',
    defaultScopes: ['DMCA Enforcement', 'Domain & SSL Provisioning', 'SSO Session Invalidation', 'Jurisdiction Compliance'],
    recommendedReadings: [
      { id: 'account-security-2fa-and-roles', title: 'Account Security & Roles' },
      { id: 'affiliate-compliance-promotional-ethics', title: 'Compliance & Ethical Standards' }
    ]
  },
  {
    id: 'role_onboarding_director',
    title: 'Creator & Label Onboarding Director',
    department: 'Ecosystem Growth',
    clearance: 'Tier 2 - Operational Director',
    description: 'Reviews VIP EPK submissions, coordinates white-glove record label imprints, and handles artist roster verifications.',
    defaultScopes: ['EPK Verification', 'Label Imprint Provisioning', 'Artist Roster Whitelist', 'Ecosystem Support'],
    recommendedReadings: [
      { id: 'onboarding-creators-and-labels', title: 'Onboarding Creators & Labels Playbook' },
      { id: 'affiliate-program-guide', title: 'Affiliate Scheme & 3%–12% Matrix' }
    ]
  },
  {
    id: 'role_infra_telemetry',
    title: 'Infrastructure & Telemetry Engineer',
    department: 'Infrastructure & Core Ops',
    clearance: 'Tier 3 - Platform Specialist',
    description: 'Supervises audio CDN edge latencies, WebSocket real-time telemetry, database pools, and POS terminal device heartbeats.',
    defaultScopes: ['Audio CDN Edge Caching', 'WebSocket Telemetry', 'POS Device Heartbeats', 'Latency Optimization'],
    recommendedReadings: [
      { id: 'universal-credits-system-guide', title: 'Universal Credits Engine' },
      { id: 'tunesupport-ai-diagnosis-and-resolution', title: 'TuneSupport AI Diagnosis' }
    ]
  }
];

export const CLEARANCE_LEVELS = [
  { level: 'Tier 1 - Super Admin', color: '#a855f7', badgeBg: 'rgba(168,85,247,0.15)', desc: 'Unrestricted root access, platform killswitches, role elevation' },
  { level: 'Tier 2 - Operational Director', color: '#0ea5e9', badgeBg: 'rgba(14,165,233,0.15)', desc: 'Department write, payout approvals, catalog publishing' },
  { level: 'Tier 3 - Platform Specialist', color: '#10b981', badgeBg: 'rgba(16,185,129,0.15)', desc: 'Operational workflows, flight scheduling, ticket resolution' },
  { level: 'Tier 4 - Read-Only Auditor', color: '#f59e0b', badgeBg: 'rgba(245,158,11,0.15)', desc: 'Compliance observation, ledger inspection, and reporting exports' }
];

export const ALL_PERMISSIONS_SCOPES = [
  'Platform Clusters',
  'Master Killswitch',
  'Database Migrations',
  'Root Audit Trail',
  'DDEX Ingestion QA',
  'ISRC/ISWC Registry',
  'Lossless Audio QA',
  'Stem Archive Storage',
  'Statutory Ledgers',
  'PRO Compliance (ASCAP/BMI/MCSK)',
  'Mechanical Splits',
  'Audit Trails',
  'Escrow Dispute Arbitration',
  'Payout Batch Approvals',
  'M-Pesa B2C Releases',
  'ACH & Wire Gateway',
  'TuneStream Editorial Playlists',
  'Sync Marketplace RFP Review',
  'Dubplate Vetting',
  'Supervisor Matching',
  'Audio Ad Flight Approvals',
  'CPM Rate Card Engine',
  'Banner Impression QA',
  'Media House Payouts',
  'DMCA Enforcement',
  'Domain & SSL Provisioning',
  'SSO Session Invalidation',
  'Jurisdiction Compliance',
  'EPK Verification',
  'Label Imprint Provisioning',
  'Artist Roster Whitelist',
  'Ecosystem Support',
  'Audio CDN Edge Caching',
  'WebSocket Telemetry',
  'POS Device Heartbeats',
  'Latency Optimization'
];

const DEFAULT_ADMIN_MEMBERS = [
  {
    id: 'adm_1',
    name: 'Elena Rostova',
    email: 'elena.security@tunemavens.com',
    role: 'Platform Security & Compliance Lead',
    department: 'InfoSec & Legal Governance',
    clearance: 'Tier 1 - Super Admin',
    scopes: ['DMCA Enforcement', 'Domain & SSL Provisioning', 'SSO Session Invalidation', 'Jurisdiction Compliance'],
    status: 'Active',
    lastActive: '4 mins ago',
    addedDate: '2026-01-10'
  },
  {
    id: 'adm_2',
    name: 'Marcus Vance',
    email: 'marcus.curation@tunemavens.com',
    role: 'Chief Music Curation & Sync Placement Director',
    department: 'Sync & Editorial Media',
    clearance: 'Tier 2 - Operational Director',
    scopes: ['TuneStream Editorial Playlists', 'Sync Marketplace RFP Review', 'Dubplate Vetting', 'Supervisor Matching'],
    status: 'Active',
    lastActive: '12 mins ago',
    addedDate: '2026-01-15'
  },
  {
    id: 'adm_3',
    name: 'Kavita Patel',
    email: 'kavita.royalties@tunemavens.com',
    role: 'Global Rights & Statutory Royalty Auditor',
    department: 'Royalties & Financial Compliance',
    clearance: 'Tier 2 - Operational Director',
    scopes: ['Statutory Ledgers', 'PRO Compliance (ASCAP/BMI/MCSK)', 'Mechanical Splits', 'Audit Trails'],
    status: 'Active',
    lastActive: '1 hour ago',
    addedDate: '2026-01-20'
  },
  {
    id: 'adm_4',
    name: 'David Ochieng',
    email: 'david.settlements@tunemavens.com',
    role: 'Split Cascades & Escrow Settlement Officer',
    department: 'Treasury & Payout Gateway',
    clearance: 'Tier 2 - Operational Director',
    scopes: ['Escrow Dispute Arbitration', 'Payout Batch Approvals', 'M-Pesa B2C Releases', 'ACH & Wire Gateway'],
    status: 'Active',
    lastActive: '25 mins ago',
    addedDate: '2026-02-01'
  },
  {
    id: 'adm_5',
    name: 'Sophie Bernard',
    email: 'sophie.ddex@tunemavens.com',
    role: 'Head of Catalog Ingestion & DDEX QA',
    department: 'Catalog & IP Architecture',
    clearance: 'Tier 2 - Operational Director',
    scopes: ['DDEX Ingestion QA', 'ISRC/ISWC Registry', 'Lossless Audio QA', 'Stem Archive Storage'],
    status: 'Active',
    lastActive: '35 mins ago',
    addedDate: '2026-02-10'
  },
  {
    id: 'adm_6',
    name: 'Tariq Mansoor',
    email: 'tariq.traffic@tunemavens.com',
    role: 'Corporate Ads & Brand Traffic Manager',
    department: 'Advertising & Sponsorships',
    clearance: 'Tier 3 - Platform Specialist',
    scopes: ['Audio Ad Flight Approvals', 'CPM Rate Card Engine', 'Banner Impression QA', 'Media House Payouts'],
    status: 'Active',
    lastActive: '2 hours ago',
    addedDate: '2026-02-28'
  },
  {
    id: 'adm_7',
    name: 'Amara Ndebele',
    email: 'amara.onboarding@tunemavens.com',
    role: 'Creator & Label Onboarding Director',
    department: 'Ecosystem Growth',
    clearance: 'Tier 2 - Operational Director',
    scopes: ['EPK Verification', 'Label Imprint Provisioning', 'Artist Roster Whitelist', 'Ecosystem Support'],
    status: 'Active',
    lastActive: '15 mins ago',
    addedDate: '2026-03-05'
  },
  {
    id: 'adm_8',
    name: 'Kenji Sato',
    email: 'kenji.infra@tunemavens.com',
    role: 'Infrastructure & Telemetry Engineer',
    department: 'Infrastructure & Core Ops',
    clearance: 'Tier 3 - Platform Specialist',
    scopes: ['Audio CDN Edge Caching', 'WebSocket Telemetry', 'POS Device Heartbeats', 'Latency Optimization'],
    status: 'Active',
    lastActive: 'Just now',
    addedDate: '2026-03-12'
  }
];

export default function AdminTeamRosterPanel({
  sessionUser,
  onUpdateUser,
  setActiveTab
}) {
  // Current admin tier allocation
  const [currentTierKey, setCurrentTierKey] = useState(() => {
    return localStorage.getItem('tunemavens_admin_tier') || 'scale';
  });

  // Admin team members state
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const stored = localStorage.getItem('tunemavens_admin_team_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_ADMIN_MEMBERS;
  });

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadReason, setReloadReason] = useState('Site Administration Unified Credits Seat Expansion');
  const [activeReadingDocId, setActiveReadingDocId] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Invite Form State
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRoleId, setInviteRoleId] = useState(PLATFORM_ADMIN_ROLES[0].id);
  const [inviteClearance, setInviteClearance] = useState(PLATFORM_ADMIN_ROLES[0].clearance);
  const [inviteScopes, setInviteScopes] = useState(PLATFORM_ADMIN_ROLES[0].defaultScopes);
  const [inviteError, setInviteError] = useState('');

  // Authorization: Only authorized site administrators can manage, edit, suspend, or revoke admin team seats
  const isAuthorizedAdmin = sessionUser?.role === 'admin' || sessionUser?.is_admin === true || !sessionUser;

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editClearance, setEditClearance] = useState('');
  const [editScopes, setEditScopes] = useState([]);
  const [editStatus, setEditStatus] = useState('Active');
  const [editError, setEditError] = useState('');

  const currentTier = ADMIN_TIERS[currentTierKey] || ADMIN_TIERS.scale;
  const isEnterprise = currentTierKey === 'enterprise';

  // Persist admin team members
  useEffect(() => {
    try {
      localStorage.setItem('tunemavens_admin_team_members', JSON.stringify(teamMembers));
    } catch (_) {}
  }, [teamMembers]);

  // Handle tier change
  const handleSwitchTier = (tierKey) => {
    setCurrentTierKey(tierKey);
    localStorage.setItem('tunemavens_admin_tier', tierKey);
  };

  // Sync role selection when role dropdown changes in Invite Modal
  const handleRoleSelectionChange = (roleId) => {
    setInviteRoleId(roleId);
    const matched = PLATFORM_ADMIN_ROLES.find(r => r.id === roleId);
    if (matched) {
      setInviteClearance(matched.clearance);
      setInviteScopes(matched.defaultScopes);
    }
  };

  // Toggle scope in invite form
  const handleToggleInviteScope = (scope) => {
    if (inviteScopes.includes(scope)) {
      setInviteScopes(prev => prev.filter(s => s !== scope));
    } else {
      setInviteScopes(prev => [...prev, scope]);
    }
  };

  // Toggle scope in edit form
  const handleToggleEditScope = (scope) => {
    if (editScopes.includes(scope)) {
      setEditScopes(prev => prev.filter(s => s !== scope));
    } else {
      setEditScopes(prev => [...prev, scope]);
    }
  };

  // Submit new admin team member
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!isAuthorizedAdmin) {
      setInviteError('Unauthorized: You must have Site Administrator authorization to invite new administrative operators.');
      return;
    }
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please provide both full legal name and platform email address.');
      return;
    }

    if (!isEnterprise && teamMembers.length >= currentTier.maxSeats) {
      setInviteError(
        `Seat capacity reached (${currentTier.maxSeats}/${currentTier.maxSeats}). Reload unified credits to expand your site administration seats.`
      );
      setReloadReason(`Admin seat capacity reached (${currentTier.maxSeats}/${currentTier.maxSeats}). Reload unified credits to expand site administration seats.`);
      setShowInviteModal(false);
      setShowReloadModal(true);
      return;
    }

    const matchedRole = PLATFORM_ADMIN_ROLES.find(r => r.id === inviteRoleId) || PLATFORM_ADMIN_ROLES[0];

    const newMember = {
      id: `adm_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: matchedRole.title,
      department: matchedRole.department,
      clearance: inviteClearance,
      scopes: inviteScopes.length > 0 ? inviteScopes : matchedRole.defaultScopes,
      status: 'Active',
      lastActive: 'Just added',
      addedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers(prev => [newMember, ...prev]);
    setInviteName('');
    setInviteEmail('');
    setInviteError('');
    setShowInviteModal(false);
  };

  // Open edit modal
  const handleOpenEdit = (member) => {
    if (!isAuthorizedAdmin) {
      alert('Unauthorized: You must have authorized Site Administrator clearance to edit administrative operators.');
      return;
    }
    setSelectedMember(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditRole(member.role);
    setEditDepartment(member.department || 'Infrastructure & Core Ops');
    setEditClearance(member.clearance);
    setEditScopes(member.scopes || []);
    setEditStatus(member.status || 'Active');
    setEditError('');
    setShowEditModal(true);
  };

  // Save edit changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!isAuthorizedAdmin) {
      setEditError('Unauthorized: You do not have permissions to modify administrative operators.');
      return;
    }
    if (!editName.trim() || !editEmail.trim()) {
      setEditError('Please provide both full legal name and platform email address.');
      return;
    }
    if (!selectedMember) return;

    setTeamMembers(prev => prev.map(m => {
      if (m.id === selectedMember.id) {
        return {
          ...m,
          name: editName.trim(),
          email: editEmail.trim(),
          role: editRole,
          department: editDepartment,
          clearance: editClearance,
          scopes: editScopes,
          status: editStatus
        };
      }
      return m;
    }));

    setShowEditModal(false);
    setSelectedMember(null);
  };

  // Toggle member active/suspended status directly
  const handleToggleMemberStatus = (memberId, memberName) => {
    if (!isAuthorizedAdmin) {
      alert('Unauthorized: You must have authorized Site Administrator clearance to suspend or activate platform operators.');
      return;
    }
    setTeamMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextStatus = m.status === 'Active' ? 'Suspended' : 'Active';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Remove admin member
  const handleRemoveMember = (memberId, memberName) => {
    if (!isAuthorizedAdmin) {
      alert('Unauthorized: You must have authorized Site Administrator clearance to revoke administrative seats.');
      return;
    }
    if (window.confirm(`Revoke administrative seat and platform credentials for ${memberName}? Their seat will be freed immediately.`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  // Filtered members list
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.scopes || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDeptFilter === 'ALL' || member.department === selectedDeptFilter;
    const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Unique departments for filter tabs
  const allDepartments = Array.from(new Set(PLATFORM_ADMIN_ROLES.map(r => r.department)));

  const seatsUsed = teamMembers.length;
  const maxSeats = currentTier.maxSeats;
  const seatsPct = isEnterprise ? 10 : Math.min(100, Math.round((seatsUsed / maxSeats) * 100));
  const activeCount = teamMembers.filter(m => m.status === 'Active').length;
  const superAdminCount = teamMembers.filter(m => m.clearance.includes('Super Admin')).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', color: '#f8fafc', fontFamily: 'inherit' }}>
      {/* Header Banner */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                background: '#0ea5e9',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RiShieldCheckFill size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
                  Site Admin Team Roster & Seats
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                  Manage authorized TuneMavens platform staff, assign task-specific functional roles, and govern seat capacity allocations.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions: Reload Credits & Tier Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setReloadReason('Site administration seat capacity reload and operator credential provisioning');
                setShowReloadModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              data-testid="admin-reload-credits-btn"
            >
              <RiCoinsFill size={16} />
              <span>Reload Unified Credits</span>
            </button>

            {/* Allocation Tier Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0b1126',
              padding: '6px',
              borderRadius: '3px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, padding: '0 6px' }}>ALLOCATION:</span>
              {Object.keys(ADMIN_TIERS).map(key => {
                const tier = ADMIN_TIERS[key];
                const isSelected = currentTierKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSwitchTier(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '3px',
                      border: 'none',
                      background: isSelected ? '#a855f7' : 'transparent',
                      color: isSelected ? '#ffffff' : '#94a3b8',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    data-testid={`admin-tier-switch-${key}`}
                  >
                    {tier.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Capacity Gauges Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Seat Capacity Gauge */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiTeamFill size={16} style={{ color: '#0ea5e9' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Admin Seat Allocation</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: seatsPct >= 100 ? '#ef4444' : '#0ea5e9' }}>
                {isEnterprise ? `${seatsUsed} Seats (Unlimited)` : `${seatsUsed} of ${maxSeats} Seats Used`}
              </span>
            </div>
            {/* Flat Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                width: `${seatsPct}%`,
                height: '100%',
                background: seatsPct >= 100 ? '#ef4444' : '#0ea5e9',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {isEnterprise ? 'Unlimited multi-cluster seat pool' : `${Math.max(0, maxSeats - seatsUsed)} available operator seats remain`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!isEnterprise && seatsUsed >= maxSeats) {
                    setReloadReason(`Admin seat limit reached (${seatsUsed}/${maxSeats}). Reload unified credits to expand seat capacity.`);
                    setShowReloadModal(true);
                  } else {
                    setInviteError('');
                    setShowInviteModal(true);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#0ea5e9',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                data-testid="add-admin-seat-btn"
              >
                <RiUserAddFill size={13} />
                <span>+ Invite Admin</span>
              </button>
            </div>
          </div>

          {/* Active Operators Online */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <RiFlashlightFill size={16} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Active Operators Status</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {activeCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>/ {teamMembers.length} Active</span>
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              {teamMembers.length - activeCount === 0 ? 'All seats currently online' : `${teamMembers.length - activeCount} seats currently suspended/idle`}
            </div>
          </div>

          {/* Super Admin Clearance Metric */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <RiLockFill size={16} style={{ color: '#a855f7' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Tier 1 Root Governance</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {superAdminCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8' }}>Super Admins</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              Multi-signature killswitch authorization quorum ready
            </div>
          </div>

          {/* Unified Credit Pricing Standard */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <RiPriceTag3Fill size={16} style={{ color: '#f59e0b' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Zero Monthly Overhead</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
              {currentTier.price}
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
              ✓ 100% Unified Credits Model · No Recurring Subscriptions
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <RiSearchLine size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by name, email, task title, or scope..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '3px',
                padding: '8px 12px 8px 36px',
                color: '#ffffff',
                fontSize: '12.5px',
                outline: 'none'
              }}
              data-testid="admin-roster-search"
            />
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '3px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '12.5px',
              outline: 'none'
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isAuthorizedAdmin ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${isAuthorizedAdmin ? '#10b981' : '#ef4444'}`,
            color: isAuthorizedAdmin ? '#10b981' : '#ef4444',
            padding: '7px 12px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            {isAuthorizedAdmin ? <RiShieldCheckFill size={13} /> : <RiLockFill size={13} />}
            <span>{isAuthorizedAdmin ? 'Authorized Site Administrator (Full Clearance)' : 'Read-Only Observability Mode'}</span>
          </span>

          {/* Invite New Admin Button */}
          <button
            type="button"
            onClick={() => {
              if (!isEnterprise && seatsUsed >= maxSeats) {
                setReloadReason(`Admin seat capacity reached (${seatsUsed}/${maxSeats}). Reload unified credits to expand seat capacity.`);
                setShowReloadModal(true);
              } else {
                setInviteError('');
                setShowInviteModal(true);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0ea5e9',
              color: '#ffffff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease'
            }}
            data-testid="invite-admin-modal-open"
          >
            <RiUserAddFill size={16} />
            <span>+ Add Admin Team Member</span>
          </button>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setSelectedDeptFilter('ALL')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid',
            borderColor: selectedDeptFilter === 'ALL' ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
            background: selectedDeptFilter === 'ALL' ? '#0ea5e9' : '#090e24',
            color: selectedDeptFilter === 'ALL' ? '#ffffff' : '#94a3b8',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Departments ({teamMembers.length})
        </button>
        {allDepartments.map(dept => {
          const count = teamMembers.filter(m => m.department === dept).length;
          const isSelected = selectedDeptFilter === dept;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDeptFilter(dept)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: isSelected ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                background: isSelected ? '#0ea5e9' : '#090e24',
                color: isSelected ? '#ffffff' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      {/* Admin Team Members Table */}
      <div style={{
        background: '#090e24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0b1126', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operator</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Job Title & Department</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clearance Tier</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational Scopes</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status & Heartbeat</th>
                <th style={{ padding: '14px 20px', fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>No site admin operators matched your criteria.</div>
                    <div style={{ fontSize: '12px' }}>Try adjusting your search terms or department filters.</div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const clearanceInfo = CLEARANCE_LEVELS.find(c => c.level === member.clearance) || CLEARANCE_LEVELS[1];
                  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                  return (
                    <tr
                      key={member.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.1s ease'
                      }}
                    >
                      {/* Operator Profile */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '3px',
                            background: clearanceInfo.badgeBg,
                            border: `1px solid ${clearanceInfo.color}`,
                            color: clearanceInfo.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '13px'
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#ffffff' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <RiMailLine size={12} />
                              <span>{member.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Job Title & Department */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '3px' }}>
                          {member.role}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                          {member.department}
                        </div>
                      </td>

                      {/* Clearance Tier Badge */}
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          background: clearanceInfo.badgeBg,
                          border: `1px solid ${clearanceInfo.color}`,
                          color: clearanceInfo.color,
                          fontSize: '11.5px',
                          fontWeight: 700
                        }}>
                          <RiLockFill size={11} />
                          {member.clearance}
                        </span>
                      </td>

                      {/* Operational Permissions Scopes */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '320px' }}>
                          {(member.scopes || []).slice(0, 3).map((scope, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#1e293b',
                                color: '#94a3b8',
                                padding: '2px 8px',
                                borderRadius: '3px',
                                fontSize: '10.5px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {scope}
                            </span>
                          ))}
                          {(member.scopes || []).length > 3 && (
                            <span style={{ background: '#0f172a', color: '#64748b', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>
                              +{(member.scopes || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status & Heartbeat */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: member.status === 'Active' ? '#10b981' : '#64748b',
                            display: 'inline-block'
                          }} />
                          <span style={{ fontSize: '12px', fontWeight: 700, color: member.status === 'Active' ? '#10b981' : '#94a3b8' }}>
                            {member.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                          Active {member.lastActive}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(member)}
                            title="Edit Permissions & Clearance"
                            style={{
                              background: '#1e293b',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#94a3b8',
                              padding: '6px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <RiEditLine size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleMemberStatus(member.id, member.name)}
                            title={member.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                            style={{
                              background: member.status === 'Active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                              border: `1px solid ${member.status === 'Active' ? '#ef4444' : '#10b981'}`,
                              color: member.status === 'Active' ? '#ef4444' : '#10b981',
                              padding: '5px 10px',
                              borderRadius: '3px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {member.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member.id, member.name)}
                            title="Revoke Admin Seat"
                            style={{
                              background: '#1e293b',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#ef4444',
                              padding: '6px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <RiDeleteBin6Line size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLATFORM ROLES & RESPONSIBILITIES TAXONOMY REFERENCE */}
      <div style={{
        marginTop: '28px',
        background: '#090e24',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '3px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <RiFileTextFill size={20} style={{ color: '#0ea5e9' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
              Platform Functional Roles & Governance Scopes
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Standard operational roles designed specifically for TuneMavens & Intermaven infrastructure.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
          {PLATFORM_ADMIN_ROLES.map((roleDef) => (
            <div
              key={roleDef.id}
              style={{
                background: '#0b1126',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#f1f5f9' }}>{roleDef.title}</span>
                <span style={{ fontSize: '10.5px', color: '#0ea5e9', fontWeight: 700, background: 'rgba(14,165,233,0.1)', padding: '2px 8px', borderRadius: '3px' }}>
                  {roleDef.department}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.4 }}>
                {roleDef.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {roleDef.defaultScopes.map((scope, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10px',
                      background: '#1e293b',
                      color: '#cbd5e1',
                      padding: '2px 6px',
                      borderRadius: '3px'
                    }}
                  >
                    ✓ {scope}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: INVITE NEW SITE ADMIN OPERATOR */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '3px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#0ea5e9', color: '#ffffff', padding: '6px', borderRadius: '3px' }}>
                  <RiUserAddFill size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                    Invite Site Admin Operator
                  </h3>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Assign platform-specific administrative credentials and operational permissions
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            {inviteError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '3px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <RiAlertFill size={16} />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInviteSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Operator Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Alexandra Chen"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Platform Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g., alexandra.chen@tunemavens.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Platform Job Title Selector */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Platform Operational Job Role *
                </label>
                <select
                  value={inviteRoleId}
                  onChange={(e) => handleRoleSelectionChange(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  {PLATFORM_ADMIN_ROLES.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.title} ({role.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recommended Reading for this Assigned Role (Not Required) */}
              {(() => {
                const selectedRoleObj = PLATFORM_ADMIN_ROLES.find(r => r.id === inviteRoleId);
                const roleReadings = selectedRoleObj?.recommendedReadings || [];
                if (roleReadings.length === 0) return null;
                return (
                  <div style={{
                    background: '#0b1126',
                    border: '1px solid rgba(34, 211, 238, 0.25)',
                    borderRadius: '3px',
                    padding: '12px 14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                      <RiBookOpenLine size={15} />
                      <span>Recommended Reading for this Role (Not Required):</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {roleReadings.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveReadingDocId(item.id)}
                          style={{
                            background: 'rgba(34, 211, 238, 0.1)',
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            borderRadius: '3px',
                            color: '#e0f2fe',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            padding: '4px 10px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                          title="Click to preview this recommended reading guide"
                        >
                          <RiBookOpenFill size={12} color="#22d3ee" />
                          <span>{item.title}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>(Optional)</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                      * Attached to user onboarding invite as recommended reading. Reading is 100% optional and does not restrict seat activation.
                    </div>
                  </div>
                );
              })()}

              {/* Clearance Tier */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Security Clearance Tier *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {CLEARANCE_LEVELS.map(tier => {
                    const isSelected = inviteClearance === tier.level;
                    return (
                      <div
                        key={tier.level}
                        onClick={() => setInviteClearance(tier.level)}
                        style={{
                          border: `1px solid ${isSelected ? tier.color : 'rgba(255,255,255,0.08)'}`,
                          background: isSelected ? tier.badgeBg : '#0f172a',
                          padding: '10px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? tier.color : '#f1f5f9' }}>
                          {tier.level}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.3 }}>
                          {tier.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scopes Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Assigned Operational Permission Scopes ({inviteScopes.length} selected)
                </label>
                <div style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  background: '#0b1126',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  padding: '8px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {ALL_PERMISSIONS_SCOPES.map(scope => {
                      const isChecked = inviteScopes.includes(scope);
                      return (
                        <div
                          key={scope}
                          onClick={() => handleToggleInviteScope(scope)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 6px',
                            borderRadius: '3px',
                            background: isChecked ? 'rgba(14,165,233,0.15)' : 'transparent',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: isChecked ? '#0ea5e9' : '#94a3b8'
                          }}
                        >
                          <span style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '2px',
                            border: `1px solid ${isChecked ? '#0ea5e9' : '#64748b'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isChecked ? '#0ea5e9' : 'transparent',
                            color: '#ffffff',
                            fontSize: '10px'
                          }}>
                            {isChecked && <RiCheckLine />}
                          </span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {scope}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '3px',
                    border: 'none',
                    background: '#0ea5e9',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  data-testid="submit-admin-invite"
                >
                  Dispatch Administrator Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ADMIN OPERATOR PERMISSIONS */}
      {showEditModal && selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '3px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  Edit Permissions: {selectedMember.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  {selectedMember.email} · {selectedMember.department}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            {editError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #ef4444',
                color: '#ef4444',
                padding: '10px 14px',
                borderRadius: '3px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <RiAlertFill size={16} />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit}>
              {/* Full Name */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Operator Full Legal Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Platform Email Address *
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Job Title */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Operational Job Title *
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Department */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Functional Department *
                </label>
                <select
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  {allDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Clearance Level */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Security Clearance Tier
                </label>
                <select
                  value={editClearance}
                  onChange={(e) => setEditClearance(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  {CLEARANCE_LEVELS.map(c => (
                    <option key={c.level} value={c.level}>{c.level}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Operational Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '3px',
                    padding: '9px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              {/* Scopes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Active Permission Scopes ({editScopes.length} enabled)
                </label>
                <div style={{
                  maxHeight: '140px',
                  overflowY: 'auto',
                  background: '#0b1126',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '3px',
                  padding: '8px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {ALL_PERMISSIONS_SCOPES.map(scope => {
                      const isChecked = editScopes.includes(scope);
                      return (
                        <div
                          key={scope}
                          onClick={() => handleToggleEditScope(scope)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 6px',
                            borderRadius: '3px',
                            background: isChecked ? 'rgba(14,165,233,0.15)' : 'transparent',
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: isChecked ? '#0ea5e9' : '#94a3b8'
                          }}
                        >
                          <span style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '2px',
                            border: `1px solid ${isChecked ? '#0ea5e9' : '#64748b'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isChecked ? '#0ea5e9' : 'transparent',
                            color: '#ffffff',
                            fontSize: '10px'
                          }}>
                            {isChecked && <RiCheckLine />}
                          </span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {scope}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '3px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 20px',
                    borderRadius: '3px',
                    border: 'none',
                    background: '#0ea5e9',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Save Permission Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Reload Modal */}
      {showReloadModal && (
        <CreditReloadModal
          isOpen={showReloadModal}
          onClose={() => setShowReloadModal(false)}
          currentBalance={sessionUser?.credits ?? 5000}
          requiredCredits={currentTier.creditsAmount}
          reason={reloadReason}
          onSuccess={(newBalance) => {
            if (onUpdateUser && sessionUser) {
              onUpdateUser({ ...sessionUser, credits: newBalance });
            }
            setShowReloadModal(false);
          }}
        />
      )}

      {/* Role Onboarding Recommended Reading Modal */}
      <InAppDocModal
        isOpen={Boolean(activeReadingDocId)}
        onClose={() => setActiveReadingDocId(null)}
        initialArticleId={activeReadingDocId}
        contextTitle="Staff Role Onboarding & Recommended Reading"
        sessionUser={sessionUser}
      />
    </div>
  );
}
