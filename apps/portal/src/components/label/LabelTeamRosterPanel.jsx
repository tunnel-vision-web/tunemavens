import React, { useState, useEffect } from 'react';
import {
  RiTeamFill, RiUserAddFill, RiDiscFill, RiShieldCheckFill,
  RiCheckLine, RiDeleteBin6Line, RiCloseLine, RiMailLine,
  RiExternalLinkFill, RiArrowRightLine, RiFolderMusicFill,
  RiEqualizerFill, RiGlobalFill, RiCoinsFill, RiPriceTag3Fill,
  RiFlashlightFill
} from 'react-icons/ri';
import CreditReloadModal from '../common/CreditReloadModal.jsx';

// Label Package Specifications  -  100% Unified Credits Model (Zero Monthly Charges)
export const LABEL_TIERS = {
  indie: {
    id: 'indie',
    name: 'Indie Imprint Load',
    price: '1,000 Credits',
    priceUsd: '$99 one-time',
    creditsAmount: 1000,
    maxSeats: 3,
    maxRoster: 5,
    description: '1,000 unified credits load. Covers up to 5 signed artist rosters with 3 collaborator seats. Zero monthly fees.',
    features: ['5 Artist Rosters', '3 Team Collaborator Seats', 'Automated Split Cascades', 'One-Stop Pre-Cleared Sync', 'Zero Monthly Charges']
  },
  scale: {
    id: 'scale',
    name: 'Scale Operations Load',
    price: '3,500 Credits',
    priceUsd: '$299 one-time',
    creditsAmount: 3500,
    maxSeats: 10,
    maxRoster: 25,
    description: '3,500 unified credits load. Designed for scaling independent labels with up to 25 artist rosters and 10 collaborator seats. Zero monthly fees.',
    features: ['25 Artist Rosters', '10 Team Collaborator Seats', 'Accounting & ERP Webhooks', 'Priority Sync Placement', 'Zero Monthly Charges']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Conglomerate Load',
    price: '10,000 Credits',
    priceUsd: '$799 one-time',
    creditsAmount: 10000,
    maxSeats: 9999,
    maxRoster: 9999,
    description: '10,000 unified credits load. Unlimited capacity for major catalogs, worldwide distributor imprints, and large multi-team operations.',
    features: ['Unlimited Artist Rosters', 'Unlimited Team Seats', 'White-Glove DDEX Ingestion', 'Dedicated Sync Director', 'Zero Monthly Charges']
  }
};

const DEFAULT_TEAM_MEMBERS = [
  {
    id: 'mem_1',
    name: 'Marcus Vance',
    email: 'marcus@soundwavestudios.com',
    role: 'A&R Director',
    scope: 'All Label Roster',
    status: 'Active',
    addedDate: '2026-02-15'
  },
  {
    id: 'mem_2',
    name: 'Elena Rostova',
    email: 'elena@soundwavestudios.com',
    role: 'Royalty & Split Accountant',
    scope: 'All Label Roster',
    status: 'Active',
    addedDate: '2026-03-01'
  }
];

export const DEFAULT_LABEL_ROSTER_ARTISTS = [
  {
    id: 'art_ndufo',
    subdomain: 'ndufo',
    name: 'Ndufo',
    role: 'Primary Roster Artist',
    genre: 'Afro-House',
    bio: 'Pioneering Kenyan Afro-futurist soundscapes and deep Afro-House beats.',
    avatar: '/heroes/ndufo_hero_slide1_retina.jpg',
    tracksCount: 4,
    status: 'Active / Signed'
  },
  {
    id: 'art_aisha',
    subdomain: 'aisha',
    name: 'Aisha Wanjiku',
    role: 'Singer-Songwriter',
    genre: 'Afro-fusion',
    bio: 'Soulful Nairobi acoustic melodies blended with traditional Swahili poetry.',
    avatar: 'https://picsum.photos/seed/aisha_avatar/400/400',
    tracksCount: 2,
    status: 'Active / Signed'
  },
  {
    id: 'art_brian',
    subdomain: 'brian-omondi',
    name: 'Brian Omondi',
    role: 'Producer / Multi-instrumentalist',
    genre: 'Amapiano',
    bio: 'High-energy Amapiano log drum architect and live sync composition specialist.',
    avatar: 'https://picsum.photos/seed/brian_avatar/400/400',
    tracksCount: 1,
    status: 'Active / Signed'
  }
];

export default function LabelTeamRosterPanel({
  sessionUser,
  onUpdateUser,
  setActiveTab,
  activeArtist,
  onSelectArtist
}) {
  // Current tier state
  const [currentTierKey, setCurrentTierKey] = useState(() => {
    return localStorage.getItem('tunemavens_label_tier') || sessionUser?.label_tier || 'scale';
  });

  // Team members state
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const stored = localStorage.getItem('tunemavens_label_team_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_TEAM_MEMBERS;
  });

  // Signed roster artists state
  const [rosterArtists, setRosterArtists] = useState(() => {
    try {
      const stored = localStorage.getItem('tunemavens_label_roster');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return DEFAULT_LABEL_ROSTER_ARTISTS;
  });

  // Modal dialog states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showReloadModal, setShowReloadModal] = useState(false);
  const [reloadReason, setReloadReason] = useState('Record Label Unified Credits Top-Up');
  const userCredits = Number(sessionUser?.credits ?? 1000);

  // Invite member form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('A&R Director');
  const [inviteScope, setInviteScope] = useState('All Label Roster');
  const [inviteError, setInviteError] = useState('');

  // Sign artist form state
  const [newArtistName, setNewArtistName] = useState('');
  const [newArtistSubdomain, setNewArtistSubdomain] = useState('');
  const [newArtistGenre, setNewArtistGenre] = useState('Afro-fusion');
  const [newArtistBio, setNewArtistBio] = useState('');
  const [artistError, setArtistError] = useState('');

  const currentTier = LABEL_TIERS[currentTierKey] || LABEL_TIERS.scale;
  const isEnterprise = currentTierKey === 'enterprise';

  // Persist team members
  useEffect(() => {
    try {
      localStorage.setItem('tunemavens_label_team_members', JSON.stringify(teamMembers));
    } catch (_) {}
  }, [teamMembers]);

  // Persist roster artists
  useEffect(() => {
    try {
      localStorage.setItem('tunemavens_label_roster', JSON.stringify(rosterArtists));
      window.dispatchEvent(new CustomEvent('tunemavens-artists-updated'));
    } catch (_) {}
  }, [rosterArtists]);

  // Handle tier switch
  const handleSwitchTier = (tierKey) => {
    setCurrentTierKey(tierKey);
    localStorage.setItem('tunemavens_label_tier', tierKey);
    if (onUpdateUser && sessionUser) {
      onUpdateUser({ ...sessionUser, label_tier: tierKey });
    }
  };

  // Add new team member
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      setInviteError('Please provide both full name and email address.');
      return;
    }

    if (!isEnterprise && teamMembers.length >= currentTier.maxSeats) {
      setInviteError(
        `Seat limit reached (${currentTier.maxSeats}/${currentTier.maxSeats}). Reload unified credits to upgrade your label package capacity.`
      );
      setReloadReason(`Seat capacity reached (${currentTier.maxSeats}/${currentTier.maxSeats}). Reload unified credits to expand your team collaborator capacity.`);
      setShowInviteModal(false);
      setShowReloadModal(true);
      return;
    }

    const newMember = {
      id: `mem_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      scope: inviteScope,
      status: 'Active',
      addedDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers(prev => [...prev, newMember]);
    setInviteName('');
    setInviteEmail('');
    setInviteError('');
    setShowInviteModal(false);
  };

  // Remove team member
  const handleRemoveMember = (memberId) => {
    if (window.confirm('Remove this collaborator from your record label team? Their seat will be freed immediately.')) {
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  // Sign new artist to roster
  const handleSignArtistSubmit = async (e) => {
    e.preventDefault();
    if (!newArtistName.trim()) {
      setArtistError('Artist name is required.');
      return;
    }

    if (!isEnterprise && rosterArtists.length >= currentTier.maxRoster) {
      setArtistError(
        `Artist roster capacity reached (${currentTier.maxRoster}/${currentTier.maxRoster}). Reload unified credits to expand your signed artist roster.`
      );
      setReloadReason(`Roster limit reached (${currentTier.maxRoster}/${currentTier.maxRoster}). Reload unified credits to expand signed artist capacity.`);
      setShowArtistModal(false);
      setShowReloadModal(true);
      return;
    }

    const cleanSub = (newArtistSubdomain.trim() || newArtistName.toLowerCase().replace(/[^a-z0-9]/g, '-')).toLowerCase();

    const newArtist = {
      id: `art_${cleanSub}`,
      subdomain: cleanSub,
      name: newArtistName.trim(),
      role: 'Signed Roster Artist',
      genre: newArtistGenre,
      bio: newArtistBio.trim() || `Signed roster artist on ${sessionUser?.brand_name || 'Record Label'}.`,
      avatar: `https://picsum.photos/seed/${cleanSub}/400/400`,
      tracksCount: 0,
      status: 'Active / Signed'
    };

    // Save to backend catalog API if available
    try {
      await fetch('/api/catalog/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArtist)
      });
    } catch (_) {}

    setRosterArtists(prev => [...prev, newArtist]);
    setNewArtistName('');
    setNewArtistSubdomain('');
    setNewArtistBio('');
    setArtistError('');
    setShowArtistModal(false);

    if (typeof onSelectArtist === 'function') {
      onSelectArtist(newArtist);
    }
  };

  // Remove artist from roster
  const handleRemoveArtist = (artistSubdomain) => {
    if (window.confirm('Remove this artist from your label roster? All catalog, EPK, and split mappings will remain intact in archive.')) {
      setRosterArtists(prev => prev.filter(a => a.subdomain !== artistSubdomain));
    }
  };

  // Jump directly to an app scoped to this roster artist
  const handleJumpToApp = (artist, targetTab) => {
    if (typeof onSelectArtist === 'function') {
      onSelectArtist(artist);
    }
    if (typeof setActiveTab === 'function') {
      setActiveTab(targetTab);
    }
  };

  const seatsUsed = teamMembers.length;
  const maxSeats = currentTier.maxSeats;
  const seatsPct = isEnterprise ? 20 : Math.min(100, Math.round((seatsUsed / maxSeats) * 100));

  const rosterUsed = rosterArtists.length;
  const maxRoster = currentTier.maxRoster;
  const rosterPct = isEnterprise ? 15 : Math.min(100, Math.round((rosterUsed / maxRoster) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} data-testid="label-team-roster-panel">
      {/* Workspace Header */}
      <div className="dashboard-panel-header" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: '#a855f7',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '3px'
          }}>
            Record Label Workspace
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>•</span>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>
            {sessionUser?.brand_name || 'Independent Record Label'}
          </span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
          Roster &amp; Team Management
        </h2>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Manage your label package tier, invite team collaborators according to seat limits, and curate your exclusive signed artist roster.
        </p>
      </div>

      {/* Package Tier & Capacity Overview Card */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090e24', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Package Tier
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
              <span>{currentTier.name}</span>
              <span style={{ fontSize: '14px', color: '#22d3ee', fontWeight: 700 }}>({currentTier.price})</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {currentTier.description}
            </div>
          </div>

          {/* Quick Plan Actions: Reload Unified Credits & Plan Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setReloadReason('Record label unified credits reload for team seats and roster allocation');
                setShowReloadModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              data-testid="reload-credits-btn"
            >
              <RiCoinsFill size={15} />
              <span>Reload Unified Credits</span>
            </button>

            {/* Quick Plan Switcher Simulator for Sandbox/Admin */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0b1126', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, padding: '0 6px' }}>PLAN:</span>
              {Object.keys(LABEL_TIERS).map(key => {
                const tier = LABEL_TIERS[key];
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
                    data-testid={`plan-switch-${key}`}
                  >
                    {tier.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Capacity Gauges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Team Seats Gauge */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiTeamFill size={16} style={{ color: '#0ea5e9' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Team Collaborator Seats</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: seatsPct >= 100 ? '#ef4444' : '#0ea5e9' }}>
                {isEnterprise ? `${seatsUsed} Seats Used (Unlimited)` : `${seatsUsed} of ${maxSeats} Seats Used`}
              </span>
            </div>
            {/* Flat Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                width: `${seatsPct}%`,
                height: '100%',
                background: seatsPct >= 100 ? '#ef4444' : '#0ea5e9',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {isEnterprise ? 'Unlimited team seats enabled' : `${maxSeats - seatsUsed} available seats remain`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!isEnterprise && seatsUsed >= maxSeats) {
                    setReloadReason(`Seat capacity reached (${seatsUsed}/${maxSeats}). Reload unified credits to expand team seats.`);
                    setShowReloadModal(true);
                  } else {
                    setInviteError('');
                    setShowInviteModal(true);
                  }
                }}
                style={{
                  background: (!isEnterprise && seatsUsed >= maxSeats) ? '#f59e0b' : '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                data-testid="invite-team-member-btn"
              >
                {(!isEnterprise && seatsUsed >= maxSeats) ? (
                  <>
                    <RiCoinsFill size={13} />
                    <span>Reload for More Seats</span>
                  </>
                ) : (
                  <>
                    <RiUserAddFill size={13} />
                    <span>+ Invite Team Member</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Signed Artist Roster Gauge */}
          <div style={{ background: '#0f172a', padding: '16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiDiscFill size={16} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>Signed Artist Roster</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: rosterPct >= 100 ? '#ef4444' : '#a855f7' }}>
                {isEnterprise ? `${rosterUsed} Artists (Unlimited)` : `${rosterUsed} of ${maxRoster} Artists Signed`}
              </span>
            </div>
            {/* Flat Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                width: `${rosterPct}%`,
                height: '100%',
                background: rosterPct >= 100 ? '#ef4444' : '#a855f7',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {isEnterprise ? 'Unlimited artist capacity active' : `${maxRoster - rosterUsed} roster slots remain`}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!isEnterprise && rosterUsed >= maxRoster) {
                    setReloadReason(`Artist roster capacity reached (${rosterUsed}/${maxRoster}). Reload unified credits to expand artist slots.`);
                    setShowReloadModal(true);
                  } else {
                    setArtistError('');
                    setShowArtistModal(true);
                  }
                }}
                style={{
                  background: (!isEnterprise && rosterUsed >= maxRoster) ? '#f59e0b' : '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '3px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                data-testid="sign-new-artist-btn"
              >
                {(!isEnterprise && rosterUsed >= maxRoster) ? (
                  <>
                    <RiCoinsFill size={13} />
                    <span>Reload for More Slots</span>
                  </>
                ) : (
                  <>
                    <RiDiscFill size={13} />
                    <span>+ Sign Artist to Roster</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Collaboration Table */}
      <div className="dashboard-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Team Members &amp; Collaborator Seats
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
              Assign roles for A&amp;R directors, catalog managers, and royalty split accountants across your label catalog.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setReloadReason('Label team seat and operations unified credits reload');
                setShowReloadModal(true);
              }}
              style={{
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RiCoinsFill size={14} />
              <span>Reload Credits</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isEnterprise && seatsUsed >= maxSeats) {
                  setReloadReason(`Seat capacity reached (${seatsUsed}/${maxSeats}). Reload credits to expand team seats.`);
                  setShowReloadModal(true);
                } else {
                  setShowInviteModal(true);
                }
              }}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 700,
                background: (!isEnterprise && seatsUsed >= maxSeats) ? '#f59e0b' : '#0284c7',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {(!isEnterprise && seatsUsed >= maxSeats) ? 'Reload for Seats' : '+ Invite Team Member'}
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#0a0f1d', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Team Member</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Email Address</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Assigned Role</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Roster Scope</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => {
                const initial = (member.name || 'U').charAt(0).toUpperCase();
                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#0284c7',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '13px'
                        }}>
                          {initial}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{member.name}</div>
                          <div style={{ fontSize: '10.5px', color: '#64748b' }}>Joined {member.addedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#94a3b8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RiMailLine size={13} />
                        <span>{member.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: '#1e293b',
                        color: '#38bdf8',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: 700,
                        border: '1px solid rgba(56, 189, 248, 0.25)'
                      }}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#cbd5e1' }}>
                      {member.scope}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#10b981',
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        {member.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        title="Remove collaborator"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <RiDeleteBin6Line size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signed Artist Roster Section */}
      <div className="dashboard-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Exclusive Signed Artist Roster
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>
              Artists signed to your label. EPK Builder, Catalogue Machine, and Sync Marketplace tools are strictly filtered to this roster.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowArtistModal(true)}
            disabled={!isEnterprise && rosterUsed >= maxRoster}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#7c3aed',
              border: 'none'
            }}
          >
            + Sign New Artist
          </button>
        </div>

        {/* Artists Roster Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
          {rosterArtists.map(artist => {
            const isCurrentlyActive = (activeArtist?.subdomain || '').toLowerCase() === (artist.subdomain || '').toLowerCase();
            return (
              <div
                key={artist.subdomain}
                style={{
                  background: '#0a0f1d',
                  border: isCurrentlyActive ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: '#1e293b', flexShrink: 0 }}>
                    <img
                      src={artist.avatar || '/heroes/ndufo_hero_slide1_retina.jpg'}
                      alt={artist.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/heroes/ndufo_hero_slide1_retina.jpg'; }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff' }}>
                        {artist.name}
                      </span>
                      {isCurrentlyActive && (
                        <span style={{ fontSize: '10px', background: 'rgba(168,85,247,0.2)', color: '#c084fc', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#22d3ee', marginTop: '2px' }}>
                      {artist.subdomain}.tunemavens.com
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {artist.genre || 'Afro-fusion'} • {artist.role || 'Signed Artist'}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {artist.bio}
                </p>

                {/* Quick App Jump Controls for this Roster Artist */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleJumpToApp(artist, 'epk-builder')}
                    style={{
                      background: '#1e293b',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      padding: '6px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title={`Open ${artist.name} in EPK Builder`}
                  >
                    EPK Builder
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJumpToApp(artist, 'catalog')}
                    style={{
                      background: '#1e293b',
                      color: '#a855f7',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      padding: '6px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title={`Manage ${artist.name} Catalogue`}
                  >
                    Catalogue
                  </button>
                  <button
                    type="button"
                    onClick={() => handleJumpToApp(artist, 'sync')}
                    style={{
                      background: '#1e293b',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '6px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title={`Pitch ${artist.name} tracks to Sync Briefs`}
                  >
                    Sync Hub
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Invite Team Member */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100005,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '8px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiUserAddFill size={18} style={{ color: '#0ea5e9' }} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>Invite Team Collaborator</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Add a team member to your record label seat pool. They will receive access credentials to collaborate on artist catalog ingestion and splits.
            </p>

            {inviteError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '4px', fontSize: '12px', marginBottom: '14px' }}>
                {inviteError}
              </div>
            )}

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="marcus@labelname.com"
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Label Operational Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="A&R Director">A&amp;R Director (Artist Scouting &amp; Development)</option>
                  <option value="Catalog & Metadata Manager">Catalog &amp; Metadata Manager (ISRC / DSP Delivery)</option>
                  <option value="Royalty & Split Accountant">Royalty &amp; Split Accountant (Ledgers &amp; Recoupment)</option>
                  <option value="Sync Licensing Coordinator">Sync Licensing Coordinator (Briefs &amp; Pitches)</option>
                  <option value="Label General Manager">Label General Manager (Full Access)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Roster Artist Scope
                </label>
                <select
                  value={inviteScope}
                  onChange={(e) => setInviteScope(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="All Label Roster">All Label Roster Artists (Full Catalog Access)</option>
                  {rosterArtists.map(a => (
                    <option key={a.subdomain} value={`Exclusive: ${a.name}`}>
                      Assigned Exclusively: {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '4px', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm &amp; Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sign New Artist */}
      {showArtistModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100005,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#090e24',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '8px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiDiscFill size={18} style={{ color: '#a855f7' }} />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>Sign Artist to Roster</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowArtistModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Register a signed artist under your record label imprint. This provisions their dedicated EPK world and sets up multi-split waterfall accounting.
            </p>

            {artistError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '4px', fontSize: '12px', marginBottom: '14px' }}>
                {artistError}
              </div>
            )}

            <form onSubmit={handleSignArtistSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Artist Stage Name
                </label>
                <input
                  type="text"
                  value={newArtistName}
                  onChange={(e) => {
                    setNewArtistName(e.target.value);
                    if (!newArtistSubdomain) {
                      setNewArtistSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Sauti Wave"
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Subdomain Slug ({newArtistSubdomain || 'artist'}.tunemavens.com)
                </label>
                <input
                  type="text"
                  value={newArtistSubdomain}
                  onChange={(e) => setNewArtistSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="sauti-wave"
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Primary Genre
                </label>
                <select
                  value={newArtistGenre}
                  onChange={(e) => setNewArtistGenre(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <option value="Afro-fusion">Afro-fusion</option>
                  <option value="Afro-House">Afro-House</option>
                  <option value="Afrobeats">Afrobeats</option>
                  <option value="Amapiano">Amapiano</option>
                  <option value="Deep-House">Deep-House</option>
                  <option value="Gengetone">Gengetone</option>
                  <option value="Bongo Flava">Bongo Flava</option>
                  <option value="Hip-Hop">Hip-Hop / Drill</option>
                  <option value="R&B / Soul">R&amp;B / Soul</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Artist Biography &amp; Signing Brief
                </label>
                <textarea
                  value={newArtistBio}
                  onChange={(e) => setNewArtistBio(e.target.value)}
                  placeholder="Describe the artist, vocal style, signing term, and sonic direction..."
                  className="form-control"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '13px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', height: '80px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowArtistModal(false)}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '4px', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '4px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign &amp; Add to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Reload Modal */}
      <CreditReloadModal
        isOpen={showReloadModal}
        onClose={() => setShowReloadModal(false)}
        sessionUser={sessionUser}
        onUpdateUser={onUpdateUser}
        reason={reloadReason}
        suggestedPackageId={currentTierKey === 'enterprise' ? 'enterprise-label-load' : currentTierKey === 'indie' ? 'indie-label-load' : 'scale-label-load'}
        onSuccess={(result) => {
          if (onUpdateUser && sessionUser) {
            onUpdateUser({
              ...sessionUser,
              credits: result?.balance ?? ((sessionUser?.credits || 0) + (result?.creditsAdded || 0))
            });
          }
        }}
      />
    </div>
  );
}
