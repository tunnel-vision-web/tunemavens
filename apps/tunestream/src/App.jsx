import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import { RegionProvider } from './RegionContext';
import { 
  RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill, 
  RiVolumeUpFill, RiHeadphoneLine, RiCompass3Line, RiHeart3Fill, 
  RiPlayListLine, RiUserLine, RiGlobalLine, RiRadioLine, RiSearchLine,
  RiArrowLeftSFill, RiArrowRightSFill, RiUpload2Line, RiDatabase2Line,
  RiCoinsLine, RiBarChartLine, RiCloseFill, RiMusicLine, RiUserFill,
  RiDownloadLine, RiBellFill, RiShieldFill, RiSettings3Fill, RiLogoutBoxRFill,
  RiCheckLine, RiSparklingLine, RiCoinsFill, RiExchangeDollarLine,
  RiFolderMusicLine, RiQuestionLine, RiBriefcaseLine, RiArrowDownSFill
} from 'react-icons/ri';
import tsLogo from './assets/tunestream-logo.png';
import './App.css';

// Import newly copied header assets
import listenHero from './assets/images/listen_hero.png';

import NativeAppLandingView from './NativeAppLandingView';
import SyncMarketplacePanel from './components/sync/SyncMarketplacePanel.jsx';
import CreditReloadModal from './components/common/CreditReloadModal.jsx';
import AppHelpAiControls from './components/common/AppHelpAiControls.jsx';
import {
  AffiliatePayoutSettingsModal,
  AffiliateReferralLinkModal,
  AffiliateDirectTalentModal
} from './components/affiliates/AffiliateActionModals.jsx';
import AffiliateAdminPanel from './components/affiliates/AffiliateAdminPanel.jsx';
import AdminTeamRosterPanel from './components/admin/AdminTeamRosterPanel.jsx';
import LabelTeamRosterPanel from './components/label/LabelTeamRosterPanel.jsx';
import TuneLedgerSplitCascadePanel from './components/splits/TuneLedgerSplitCascadePanel.jsx';
import SupportTicketsPanel from './components/community/SupportTicketsPanel.jsx';

export const PERSONA_ROLES = [
  { id: 'admin', label: 'Administrator', shortLabel: 'Admin', shortDesc: 'All 14 apps & admin panels', icon: RiShieldFill, color: '#38bdf8' },
  { id: 'affiliate', label: 'Affiliate Partner', shortLabel: 'Affiliate', shortDesc: 'Links, Matrix & Payouts', icon: RiExchangeDollarLine, color: '#22d3ee' },
  { id: 'creator', label: 'Creator / Artist', shortLabel: 'Creator', shortDesc: 'EPK, Catalog, Splits', icon: RiMusicLine, color: '#22d3ee' },
  { id: 'label', label: 'Record Label', shortLabel: 'Label', shortDesc: 'Roster, Rights, Splits & Sync', icon: RiFolderMusicLine, color: '#a855f7' },
  { id: 'supervisor', label: 'Music Supervisor', shortLabel: 'Supervisor', shortDesc: 'Sync Briefs & Escrow', icon: RiCompass3Line, color: '#ec4899' },
  { id: 'dj', label: 'DJ / Curator', shortLabel: 'DJ', shortDesc: 'DJ Pool & Library', icon: RiVolumeUpFill, color: '#f59e0b' },
  { id: 'media_house', label: 'Media House', shortLabel: 'Media House', shortDesc: 'Sync, Broadcast & Ads', icon: RiGlobalLine, color: '#10b981' },
  { id: 'corporate', label: 'Corporate Brand', shortLabel: 'Corporate', shortDesc: 'Ad flights & Sponsorships', icon: RiBriefcaseLine, color: '#f97316' },
  { id: 'consumer', label: 'Consumer / Fan', shortLabel: 'Consumer', shortDesc: 'Player, Library & Tips', icon: RiUserFill, color: '#6366f1' },
];

const SAMPLE_TRACKS = [
  { id: 1, title: "After Hours", artist: "Lumina Wave", album: "Electric Dreams", duration: "3:45", plays: "1.2M", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "70/30" },
  { id: 2, title: "Midnight Sun", artist: "Hologram Club", album: "Neon Horizon", duration: "4:12", plays: "982K", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "50/50" },
  { id: 3, title: "Resonance", artist: "Aether Echo", album: "Silent Grid", duration: "3:28", plays: "450K", cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "80/20" },
  { id: 4, title: "Stardust", artist: "Solaris", album: "Nebula Core", duration: "5:01", plays: "2.3M", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", splits: "100/0" },
];

export default function App() {
  return (
    <RegionProvider>
      <Router>
        <AppContent />
      </Router>
    </RegionProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tunestream_session') || sessionStorage.getItem('tunemavens_session') || localStorage.getItem('tunemavens_saved_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [lastNonAuthPath, setLastNonAuthPath] = useState('/');

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      setLastNonAuthPath(location.pathname);
    }
  }, [location.pathname]);

  const handleLogin = (user) => {
    setSessionUser(user);
    sessionStorage.setItem('tunestream_session', JSON.stringify(user));
    sessionStorage.setItem('tunemavens_session', JSON.stringify(user));
    localStorage.setItem('tunemavens_saved_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setSessionUser(null);
    sessionStorage.removeItem('tunestream_session');
  };

  const isAuthModalActive = location.pathname === '/login' || location.pathname === '/register';
  const backgroundLocation = isAuthModalActive ? { pathname: lastNonAuthPath } : location;

  const handleBackdropClose = (e) => {
    if (e.target.className && e.target.className.includes('auth-modal-overlay-wrapper')) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate(lastNonAuthPath || '/');
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div 
        style={{ 
          opacity: isAuthModalActive ? 0.8 : 1, 
          transition: 'opacity 0.3s ease',
          pointerEvents: isAuthModalActive ? 'none' : 'auto'
        }}
      >
        <Routes location={backgroundLocation}>
          <Route path="/" element={<NativeAppLandingView sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/stream" element={<PlayerDashboard sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/sync" element={<PlayerDashboard sessionUser={sessionUser} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/sync-marketplace" element={<PlayerDashboard sessionUser={sessionUser} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/login" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/register" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/dashboard" element={<Navigate to="/stream" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {isAuthModalActive && (
        <div className="auth-modal-overlay-wrapper" onClick={handleBackdropClose}>
          <Routes>
            <Route path="/login" element={<LoginView onLogin={handleLogin} onClose={() => navigate(lastNonAuthPath || '/')} />} />
            <Route path="/register" element={<RegisterView onLogin={handleLogin} onClose={() => navigate(lastNonAuthPath || '/')} />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

function PlayerDashboard({ sessionUser, initialTab, onLogout }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(SAMPLE_TRACKS[0]);
  const [likes, setLikes] = useState([1, 3]);
  const [volume, setVolume] = useState(80);
  
  // Unified Dashboard States
  const [currentView, setCurrentView] = useState('listener'); // 'listener' | 'creator'
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'explore'); // 'explore' | 'favorites' | 'radio' for listener, 'my-catalog' | 'upload' for creator

  const [userRole, setUserRole] = useState(() => localStorage.getItem('tunestream_user_role') || (sessionUser?.role || 'creator'));
  const [userCredits, setUserCredits] = useState(() => {
    const saved = localStorage.getItem('tunemavens_user_credits');
    return saved ? parseInt(saved, 10) : 600;
  });
  const [isCreditReloadOpen, setIsCreditReloadOpen] = useState(false);
  const [isPayoutSettingsModalOpen, setIsPayoutSettingsModalOpen] = useState(false);
  const [isReferralLinkModalOpen, setIsReferralLinkModalOpen] = useState(false);
  const [isDirectTalentModalOpen, setIsDirectTalentModalOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notifRef = useRef(null);
  const accountRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'aff_payout',
      title: 'Partner Payout Rails & Mobile STK',
      body: 'Connect M-Pesa STK or Bank to receive weekly automatic payouts.',
      actionText: 'Settings',
      actionType: 'payout',
      read: false,
      at: '1m ago'
    },
    {
      id: 'aff_link',
      title: '90-Day Referral Link & Share Suite',
      body: 'Earn 3%–12% commission on music sales, sync licensing, and EPKs.',
      actionText: 'Get Link',
      actionType: 'link',
      read: false,
      at: '5m ago'
    },
    {
      id: 'aff_talent',
      title: 'Directly Onboard Creators & Labels',
      body: 'Add talent directly to your network with 0 credit deduction.',
      actionText: 'Add Talent',
      actionType: 'talent',
      read: false,
      at: '15m ago'
    },
    {
      id: 'aff_guide',
      title: 'Recommended Reading: Partner Playbook',
      body: 'Commission matrix and promotional standards (Optional reading).',
      actionText: 'Read Guide',
      actionType: 'guide',
      read: false,
      at: '30m ago'
    }
  ]);

  const activeUser = {
    id: sessionUser?.id || 'user_tunestream_01',
    name: sessionUser?.name || 'TuneStream User',
    email: sessionUser?.email || 'user@tunemavens.com',
    role: userRole,
    credits: userCredits,
    phone: '254712345678',
    is_admin: userRole === 'admin' || (typeof localStorage !== 'undefined' && localStorage.getItem('tunemavens_admin_verified') === 'true'),
    tier: 'pro'
  };

  const currentRoleObj = PERSONA_ROLES.find(r => r.id === userRole) || PERSONA_ROLES[0];
  const isAdminSimulated = (activeUser.is_admin && userRole !== 'admin') || (typeof localStorage !== 'undefined' && localStorage.getItem('tunemavens_admin_verified') === 'true' && userRole !== 'admin');

  const handleSwitchRole = (targetRole) => {
    try {
      localStorage.setItem('tunemavens_admin_verified', 'true');
      localStorage.setItem('tunestream_user_role', targetRole);
      setUserRole(targetRole);

      if (targetRole === 'affiliate') {
        setActiveTab('affiliates');
      } else if (targetRole === 'admin') {
        setActiveTab('admin-team');
      } else if (targetRole === 'label') {
        setActiveTab('label-team');
      } else if (targetRole === 'supervisor') {
        setActiveTab('sync-marketplace');
      }
      setAccountOpen(false);
    } catch (err) {
      console.error('Failed to switch role:', err);
    }
  };

  useEffect(() => {
    const handleTopbarClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handleTopbarClick);
    return () => document.removeEventListener('mousedown', handleTopbarClick);
  }, []);

  useEffect(() => {
    const handlePayout = () => setIsPayoutSettingsModalOpen(true);
    const handleLink = () => setIsReferralLinkModalOpen(true);
    const handleTalent = () => setIsDirectTalentModalOpen(true);
    window.addEventListener('tunemavens:open-payout-settings', handlePayout);
    window.addEventListener('tunemavens:open-referral-link', handleLink);
    window.addEventListener('tunemavens:open-direct-talent', handleTalent);
    return () => {
      window.removeEventListener('tunemavens:open-payout-settings', handlePayout);
      window.removeEventListener('tunemavens:open-referral-link', handleLink);
      window.removeEventListener('tunemavens:open-direct-talent', handleTalent);
    };
  }, []);
  
  // Creator states
  const [catalogTracks, setCatalogTracks] = useState(SAMPLE_TRACKS);
  const [uploadForm, setUploadForm] = useState({ title: '', artist: '', genre: 'Electronic', splits: '100/0' });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleLike = (id) => {
    if (likes.includes(id)) {
      setLikes(likes.filter(item => item !== id));
    } else {
      setLikes([...likes, id]);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setActiveTab(view === 'listener' ? 'explore' : 'my-catalog');
    setUploadSuccess(false);
    setUploadError('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadSuccess(false);

    if (!uploadForm.title.trim()) {
      setUploadError('Track title is required.');
      return;
    }
    if (!uploadForm.artist.trim()) {
      setUploadError('Artist name is required.');
      return;
    }
    if (!fileName) {
      setUploadError('Please select or drag an audio file to ingest.');
      return;
    }

    // Add track to catalog mockup
    const newTrack = {
      id: catalogTracks.length + 1,
      title: uploadForm.title,
      artist: uploadForm.artist,
      album: "Single",
      duration: "3:30",
      plays: "0",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&auto=format&fit=crop&q=60",
      splits: uploadForm.splits
    };

    setCatalogTracks([newTrack, ...catalogTracks]);
    setUploadSuccess(true);
    setFileName('');
    setUploadForm({ title: '', artist: '', genre: 'Electronic', splits: '100/0' });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/')) {
        setFileName(file.name);
      } else {
        setUploadError('Invalid file type. Only audio files (MP3, WAV, FLAC) are supported.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-sidebar-scroll">
          <div className="dashboard-sidebar-header" style={{ flexDirection: collapsed ? 'column' : 'row', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
            <Link to="/" title="Back to landing page" style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', textDecoration: 'none' }}>
              {collapsed ? (
                <img src="/favicon.png" alt="TuneStream Icon" style={{ height: '32px', width: 'auto', display: 'block' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                  <img src={tsLogo} alt="TuneStream Logo" style={{ height: '28px', width: 'auto', display: 'block' }} />
                  <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '18px', color: '#00f2fe' }}>TUNE<span style={{ color: '#fff' }}>STREAM</span></span>
                </div>
              )}
            </Link>
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="dashboard-nav-item collapse-toggle-btn"
            style={{ border: 'none', background: 'transparent', padding: '6px', justifyContent: 'center', width: '100%', marginBottom: '16px', color: '#94a3b8' }}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <RiArrowRightSFill size={16} /> : <RiArrowLeftSFill size={16} />}
          </button>

          {currentView === 'listener' ? (
            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Discover
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                <li>
                  <button 
                    onClick={() => setActiveTab('explore')} 
                    className={`dashboard-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
                    title="Explore"
                  >
                    <RiCompass3Line size={16} />
                    {!collapsed && "Explore"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('favorites')} 
                    className={`dashboard-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                    title="Favorites"
                  >
                    <RiHeart3Fill size={16} className="fav-icon" />
                    {!collapsed && "Favorites"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('radio')} 
                    className={`dashboard-nav-item ${activeTab === 'radio' ? 'active' : ''}`}
                    title="Live Radio"
                  >
                    <RiRadioLine size={16} />
                    {!collapsed && "Live Radio"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('sync-marketplace')} 
                    className={`dashboard-nav-item ${activeTab === 'sync-marketplace' ? 'active' : ''}`}
                    title="Sync Marketplace"
                  >
                    <RiSparklingLine size={16} style={{ color: '#22d3ee' }} />
                    {!collapsed && "Sync Marketplace"}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  Catalog & IP
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                <li>
                  <button 
                    onClick={() => setActiveTab('my-catalog')} 
                    className={`dashboard-nav-item ${activeTab === 'my-catalog' ? 'active' : ''}`}
                    title="My Catalog"
                  >
                    <RiDatabase2Line size={16} />
                    {!collapsed && "My Catalog"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('upload')} 
                    className={`dashboard-nav-item ${activeTab === 'upload' ? 'active' : ''}`}
                    title="Upload Track"
                  >
                    <RiUpload2Line size={16} />
                    {!collapsed && "Upload Track"}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('sync-marketplace')} 
                    className={`dashboard-nav-item ${activeTab === 'sync-marketplace' ? 'active' : ''}`}
                    title="Sync Marketplace"
                  >
                    <RiSparklingLine size={16} style={{ color: '#22d3ee' }} />
                    {!collapsed && "Sync Marketplace"}
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div className="sidebar-category-group" style={{ marginBottom: '12px' }}>
            {!collapsed && (
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                Governance & Splits
              </div>
            )}
            <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('splits')} 
                  className={`dashboard-nav-item ${activeTab === 'splits' ? 'active' : ''}`}
                  title="TuneLedger Split Cascade"
                >
                  <RiExchangeDollarLine size={16} style={{ color: '#22d3ee' }} />
                  {!collapsed && "TuneLedger Splits"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('affiliates')} 
                  className={`dashboard-nav-item ${activeTab === 'affiliates' ? 'active' : ''}`}
                  title="Affiliate Scheme"
                >
                  <RiSparklingLine size={16} style={{ color: '#22d3ee' }} />
                  {!collapsed && "Affiliate Hub"}
                </button>
              </li>
              {(userRole === 'admin' || userRole === 'label') && (
                <li>
                  <button 
                    onClick={() => setActiveTab('label-team')} 
                    className={`dashboard-nav-item ${activeTab === 'label-team' ? 'active' : ''}`}
                    title="Label Signed Roster"
                  >
                    <RiFolderMusicLine size={16} style={{ color: '#a855f7' }} />
                    {!collapsed && "Label Roster"}
                  </button>
                </li>
              )}
              {userRole === 'admin' && (
                <li>
                  <button 
                    onClick={() => setActiveTab('admin-team')} 
                    className={`dashboard-nav-item ${activeTab === 'admin-team' ? 'active' : ''}`}
                    title="Site Admin Team"
                  >
                    <RiShieldFill size={16} style={{ color: '#ec4899' }} />
                    {!collapsed && "Admin Team Seats"}
                  </button>
                </li>
              )}
              <li>
                <button 
                  onClick={() => setActiveTab('support')} 
                  className={`dashboard-nav-item ${activeTab === 'support' ? 'active' : ''}`}
                  title="Support & Claims Desk"
                >
                  <RiQuestionLine size={16} />
                  {!collapsed && "Support Desk"}
                </button>
              </li>
            </ul>
          </div>

          <ul className="dashboard-nav-list" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
            <li>
              <a 
                href="/" 
                className="dashboard-nav-item"
                style={{ textDecoration: 'none' }}
                title="Back to Home Site"
              >
                <RiSkipBackFill size={16} style={{ transform: 'rotate(180deg)' }} />
                {!collapsed && "Back to Home Site"}
              </a>
            </li>
          </ul>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-profile-card">
            <div className="dashboard-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'T'}
            </div>
            {!collapsed && (
              <div className="dashboard-profile-info">
                <h5>{activeUser.name}</h5>
                <span 
                  onClick={() => setAccountOpen(true)}
                  title="Click to switch persona role"
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', marginTop: '2px', color: '#00f2fe' }}
                >
                  ⚙️ {userRole}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              if (onLogout) onLogout();
            }} 
            className="dashboard-nav-item" 
            style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
            title="Log Out"
          >
            <RiLogoutBoxRFill size={14} style={{ marginRight: collapsed ? 0 : 8 }} />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-main-content" style={{ height: 'calc(100% - 90px)' }}>
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiGlobalLine style={{ color: '#00f2fe' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                SERVING FROM: <strong>tunestream.co</strong> | ALIAS: <strong>tunestream.tunemavens.com</strong>
              </span>
            </div>
          </div>
          <div className="dashboard-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="search-bar" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <RiSearchLine />
              <input type="text" placeholder="Search track, catalog, splits..." style={{ fontSize: '13px' }} />
            </div>

            {/* Persona Simulation Badge */}
            {isAdminSimulated && (
              <div
                className="topbar-simulation-badge"
                onClick={() => setAccountOpen(true)}
                title="Simulating persona for admin verification. Click account dropdown to switch or reset."
              >
                <span className="topbar-simulation-dot" />
                <span className="topbar-simulation-text">
                  Verifying: <strong>{currentRoleObj.shortLabel}</strong>
                </span>
                <button
                  type="button"
                  className="topbar-quick-reset-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwitchRole('admin');
                  }}
                  title="Reset to Administrator view"
                >
                  <RiShieldFill size={11} />
                  <span>Reset</span>
                </button>
              </div>
            )}

            {/* Unified Credits Badge & Reload Trigger on Topbar */}
            {(() => {
              const isAffiliate = userRole === 'affiliate' || activeTab === 'affiliates';
              const creditsCount = userCredits ?? 0;
              return (
                <button
                  type="button"
                  onClick={() => setIsCreditReloadOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isAffiliate
                      ? 'rgba(34, 211, 238, 0.1)'
                      : (creditsCount < 50 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)'),
                    border: isAffiliate
                      ? '1px solid rgba(34, 211, 238, 0.35)'
                      : (creditsCount < 50 ? '1px solid #ef4444' : '1px solid rgba(16, 185, 129, 0.35)'),
                    color: isAffiliate
                      ? '#22d3ee'
                      : (creditsCount < 50 ? '#ef4444' : '#10b981'),
                    padding: '5px 11px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={isAffiliate 
                    ? "Unified Credits: Applies only if you use creator tools (MasterLab AI, Sync briefs, etc.). The Affiliate Dashboard requires 0 credits." 
                    : "Click to reload unified platform credits (Zero monthly charges)"}
                >
                  <RiCoinsFill size={15} style={{ color: isAffiliate ? '#22d3ee' : (creditsCount < 50 ? '#ef4444' : '#10b981') }} />
                  <span>{creditsCount.toLocaleString()} Credits</span>
                  <span style={{
                    fontSize: '10px',
                    background: isAffiliate ? 'rgba(34, 211, 238, 0.25)' : (creditsCount < 50 ? '#ef4444' : '#10b981'),
                    color: isAffiliate ? '#22d3ee' : '#ffffff',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {isAffiliate ? 'Studio Tools' : 'Top Up'}
                  </span>
                </button>
              );
            })()}

            {/* Back to public site button */}
            <Link
              to="/"
              className="topbar-back-to-site"
              title="Back to public site"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                background: 'rgba(0, 242, 254, 0.06)',
                color: '#00f2fe',
                fontSize: '12px',
                fontWeight: '700',
                textDecoration: 'none',
                letterSpacing: '0.3px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Back to Site</span>
            </Link>

            {/* Notifications */}
            <div className="dashboard-topbar-item" ref={notifRef}>
              <button
                className="topbar-icon-btn"
                onClick={() => { setNotifOpen(o => !o); setAccountOpen(false); }}
                title="Notifications"
              >
                <RiBellFill size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="topbar-badge">{notifications.filter(n => !n.read).length}</span>
                )}
              </button>
              {notifOpen && (
                <div className="topbar-dropdown" style={{ top: 'calc(100% + 8px)' }}>
                  <div className="topbar-dropdown-header">
                    <strong>Notifications</strong>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button className="topbar-link-btn" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <ul className="topbar-notif-list">
                    {notifications.length === 0 && (
                      <li className="topbar-notif-empty">You're all caught up.</li>
                    )}
                    {notifications.map(n => (
                      <li key={n.id} className={`topbar-notif-item ${n.read ? 'read' : 'unread'}`} style={{ display: 'flex', gap: '8px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="topbar-notif-dot" />
                        <div className="topbar-notif-body">
                          <div className="topbar-notif-title" style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>{n.title}</div>
                          <div className="topbar-notif-text" style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>{n.body}</div>
                          <div className="topbar-notif-time" style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{n.at}</div>
                          {n.actionText && (
                            <div style={{ marginTop: '6px' }}>
                              <button
                                type="button"
                                className="topbar-notif-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifOpen(false);
                                  if (n.actionType === 'payout') {
                                    setIsPayoutSettingsModalOpen(true);
                                  } else if (n.actionType === 'link') {
                                    setIsReferralLinkModalOpen(true);
                                  } else if (n.actionType === 'talent') {
                                    setIsDirectTalentModalOpen(true);
                                  } else if (n.actionType === 'guide') {
                                    setActiveTab('affiliates');
                                  }
                                  setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                                }}
                                style={{
                                  background: 'rgba(34, 211, 238, 0.15)',
                                  border: '1px solid rgba(34, 211, 238, 0.4)',
                                  color: '#22d3ee',
                                  padding: '3px 8px',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {n.actionText} <RiArrowRightSFill size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="topbar-dropdown-footer">
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Live notifications coming soon.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
            <div className="dashboard-topbar-item" ref={accountRef}>
              <button
                className="topbar-account-btn"
                onClick={() => { setAccountOpen(o => !o); setNotifOpen(false); }}
                title="Account"
              >
                <span className="topbar-avatar">{activeUser.name.charAt(0).toUpperCase()}</span>
                <span className="topbar-account-name">{activeUser.name}</span>
                <RiArrowDownSFill size={14} />
              </button>
              {accountOpen && (
                <div className="topbar-dropdown topbar-dropdown-account" style={{ top: 'calc(100% + 8px)' }}>
                  <div className="topbar-account-summary">
                    <div className="topbar-avatar large">{activeUser.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{activeUser.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{activeUser.email}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                        {userRole} · verified
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 16px 12px 16px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setIsCreditReloadOpen(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '7px 12px',
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <RiCoinsFill size={14} />
                      <span>Reload Unified Credits</span>
                    </button>
                  </div>

                  <div className="topbar-dropdown-divider" />

                  {/* Admin Persona Role Switcher Section */}
                  {activeUser.is_admin ? (
                    <div className="topbar-persona-section" data-testid="topbar-persona-switcher">
                      <div className="topbar-persona-header">
                        <div className="topbar-persona-title">
                          <RiShieldFill size={13} style={{ color: '#0ea5e9' }} />
                          <span>Switch Persona View</span>
                        </div>
                        {userRole !== 'admin' && (
                          <button
                            type="button"
                            className="topbar-reset-link"
                            onClick={() => handleSwitchRole('admin')}
                            title="Return to full Administrator role"
                          >
                            Reset to Admin
                          </button>
                        )}
                      </div>
                      <div className="topbar-persona-sub">
                        Verify visible apps, tools &amp; permissions for each user role:
                      </div>

                      <div className="topbar-role-grid">
                        {PERSONA_ROLES.map((roleItem) => {
                          const isActive = userRole === roleItem.id;
                          const RoleIcon = roleItem.icon;
                          return (
                            <button
                              key={roleItem.id}
                              type="button"
                              className={`topbar-role-tile ${isActive ? 'active' : ''}`}
                              onClick={() => handleSwitchRole(roleItem.id)}
                              title={`${roleItem.label}: ${roleItem.shortDesc}`}
                            >
                              <div className="topbar-role-tile-top">
                                <span className="topbar-role-icon" style={{ color: roleItem.color }}>
                                  <RoleIcon size={14} />
                                </span>
                                {isActive && <RiCheckLine size={13} style={{ color: '#10b981', marginLeft: 'auto' }} />}
                              </div>
                              <div className="topbar-role-tile-name">{roleItem.shortLabel}</div>
                              <div className="topbar-role-tile-desc">{roleItem.shortDesc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <button
                      className="topbar-menu-item"
                      style={{ color: '#0ea5e9' }}
                      onClick={() => handleSwitchRole('admin')}
                    >
                      <RiShieldFill size={14} />
                      <span>Sandbox: Elevate to Admin (Unlock Role Switcher)</span>
                    </button>
                  )}

                  <div className="topbar-dropdown-divider" />

                  <button
                    className="topbar-menu-item topbar-menu-item-danger"
                    onClick={() => {
                      setAccountOpen(false);
                      if (onLogout) onLogout();
                    }}
                  >
                    <RiLogoutBoxRFill size={14} style={{ color: '#f87171' }} />
                    <span style={{ color: '#f87171' }}>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="dashboard-main-scroll" style={{ padding: (activeTab === 'sync-marketplace' || activeTab === 'sync') ? '16px 20px' : '24px 32px' }}>
          {activeTab === 'splits' ? (
            <TuneLedgerSplitCascadePanel sessionUser={activeUser} />
          ) : activeTab === 'affiliates' ? (
            <AffiliateAdminPanel sessionUser={activeUser} />
          ) : activeTab === 'label-team' ? (
            <LabelTeamRosterPanel sessionUser={activeUser} />
          ) : activeTab === 'admin-team' ? (
            <AdminTeamRosterPanel sessionUser={activeUser} />
          ) : activeTab === 'support' ? (
            <SupportTicketsPanel sessionUser={activeUser} />
          ) : (activeTab === 'sync-marketplace' || activeTab === 'sync') ? (
            <SyncMarketplacePanel sessionUser={activeUser} />
          ) : currentView === 'listener' ? (
            /* ================= LISTENER VIEW ================= */
            <div>
              {activeTab === 'explore' && (
                <>
                  <section className="ts-hero" style={{ height: '220px', marginBottom: '24px' }}>
                    <div className="hero-overlay"></div>
                    <div className="hero-text" style={{ padding: '20px' }}>
                      <span className="hero-badge">SPOTLIGHT CREATOR</span>
                      <h1 style={{ fontSize: '28px', margin: '8px 0' }}>Lumina Wave</h1>
                      <p style={{ fontSize: '13px', marginBottom: '12px', maxWidth: '500px' }}>
                        Experience the latest high-fidelity ambient electronic tracks from Lumina Wave's latest release "Electric Dreams". Now streaming in Lossless Audio.
                      </p>
                      <button className="btn-play-hero" onClick={() => handleTrackSelect(SAMPLE_TRACKS[0])} style={{ padding: '8px 20px' }}>
                        <RiPlayFill /> Play Album
                      </button>
                    </div>
                  </section>

                  <section className="ts-music-section">
                    <div className="section-header" style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px' }}>Trending Right Now</h3>
                    </div>
                    
                    <div className="tracks-list">
                      {catalogTracks.map((track, idx) => (
                        <div 
                          key={track.id} 
                          className={`track-row ${currentTrack.id === track.id ? 'active' : ''}`}
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="track-number">{idx + 1}</div>
                          <img src={track.cover} alt={track.title} className="track-cover" />
                          <div className="track-details" style={{ width: '220px' }}>
                            <span className="track-title">{track.title}</span>
                            <span className="track-artist">{track.artist}</span>
                          </div>
                          <div className="track-album" style={{ color: '#64748b' }}>{track.album}</div>
                          <div className="track-plays" style={{ color: '#64748b' }}>{track.plays} plays</div>
                          <div className="track-duration" style={{ color: '#64748b' }}>{track.duration}</div>
                          <button 
                            className={`btn-like ${likes.includes(track.id) ? 'liked' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(track.id);
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                          >
                            <RiHeart3Fill />
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'favorites' && (
                <section className="ts-music-section">
                  <div className="section-header" style={{ marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px' }}>My Favorites</h3>
                  </div>
                  <div className="tracks-list">
                    {catalogTracks.filter(t => likes.includes(t.id)).length === 0 ? (
                      <div style={{ color: '#64748b', padding: '24px', textAlign: 'center' }}>No liked tracks yet. Explore and tap the heart icon to save!</div>
                    ) : (
                      catalogTracks.filter(t => likes.includes(t.id)).map((track, idx) => (
                        <div 
                          key={track.id} 
                          className={`track-row ${currentTrack.id === track.id ? 'active' : ''}`}
                          onClick={() => handleTrackSelect(track)}
                        >
                          <div className="track-number">{idx + 1}</div>
                          <img src={track.cover} alt={track.title} className="track-cover" />
                          <div className="track-details" style={{ width: '220px' }}>
                            <span className="track-title">{track.title}</span>
                            <span className="track-artist">{track.artist}</span>
                          </div>
                          <div className="track-album">{track.album}</div>
                          <div className="track-plays">{track.plays} plays</div>
                          <div className="track-duration">{track.duration}</div>
                          <button 
                            className="btn-like liked"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(track.id);
                            }}
                            style={{ background: 'transparent', border: 'none' }}
                          >
                            <RiHeart3Fill />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'radio' && (
                <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <RiRadioLine size={48} style={{ color: '#00f2fe', marginBottom: '16px', animation: 'pulse 2s infinite' }} />
                  <h4>TuneStream Live Radio</h4>
                  <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', maxWidth: '400px', margin: '8px auto' }}>
                    Lossless stream broadcasts curated daily by the community. Connecting to stream node...
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* ================= CREATOR VIEW ================= */
            <div>
              {/* Creator Overview Panel */}
              <div className="dashboard-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Catalog Size</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>{catalogTracks.length} Tracks</h3>
                </div>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Plays</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>4.9M Streams</h3>
                </div>
                <div className="dashboard-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Accrued Balance</span>
                  <h3 style={{ fontSize: '24px', margin: '8px 0 0', color: '#00f2fe' }}>$12,450.00</h3>
                </div>
              </div>

              {activeTab === 'my-catalog' && (
                <section className="ts-music-section">
                  <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px' }}>My Uploaded Catalog</h3>
                    <button className="btn-play-hero" onClick={() => setActiveTab('upload')} style={{ padding: '6px 12px', fontSize: '11px' }}>
                      <RiUpload2Line /> Ingest New Track
                    </button>
                  </div>
                  
                  <div className="tracks-list">
                    {catalogTracks.map((track, idx) => (
                      <div key={track.id} className="track-row" style={{ cursor: 'default' }}>
                        <div className="track-number">{idx + 1}</div>
                        <img src={track.cover} alt={track.title} className="track-cover" />
                        <div className="track-details" style={{ width: '220px' }}>
                          <span className="track-title">{track.title}</span>
                          <span className="track-artist">{track.artist}</span>
                        </div>
                        <div className="track-album" style={{ color: '#64748b' }}>{track.album}</div>
                        <div className="track-plays" style={{ color: '#64748b' }}>{track.plays} plays</div>
                        <div style={{ color: '#00f2fe', width: '100px', fontSize: '12px', fontWeight: 'bold' }}>
                          Splits: {track.splits || "100/0"}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn-play-hero" 
                            onClick={() => handleTrackSelect(track)}
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                          >
                            Listen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeTab === 'upload' && (
                <div className="dashboard-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <RiUpload2Line style={{ color: '#00f2fe' }} /> Lossless Catalogue Audio Ingestion
                  </h4>
                  
                  {uploadSuccess && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '6px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>
                      ✓ Track successfully ingested and transcoded into Lossless cache system!
                    </div>
                  )}

                  {uploadError && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '6px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
                      ⚠ {uploadError}
                    </div>
                  )}

                  <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Track Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dream Escape" 
                          value={uploadForm.title} 
                          onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Primary Artist Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lumina Wave" 
                          value={uploadForm.artist} 
                          onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Genre</label>
                        <select 
                          value={uploadForm.genre}
                          onChange={e => setUploadForm({ ...uploadForm, genre: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        >
                          <option value="Electronic">Electronic / Ambient</option>
                          <option value="Hip Hop">Hip Hop / Beats</option>
                          <option value="Pop">Indie Pop</option>
                          <option value="Classical">Neo-Classical</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Royalty Split Cascade Setup (Creator/Label)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 70/30" 
                          value={uploadForm.splits}
                          onChange={e => setUploadForm({ ...uploadForm, splits: e.target.value })}
                          style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Drag and Drop Ingestion Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Audio File Ingestion</label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        style={{ 
                          border: `2px dashed ${dragActive ? '#00f2fe' : 'rgba(255, 255, 255, 0.15)'}`, 
                          borderRadius: '8px', 
                          padding: '30px', 
                          textAlign: 'center', 
                          background: dragActive ? 'rgba(0, 242, 254, 0.04)' : 'rgba(0,0,0,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <RiUpload2Line size={32} style={{ color: '#00f2fe', marginBottom: '8px' }} />
                        {fileName ? (
                          <div>
                            <strong style={{ color: '#00f2fe' }}>File Loaded:</strong> {fileName}
                            <button 
                              type="button" 
                              onClick={() => setFileName('')} 
                              style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <RiCloseFill />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: '13px' }}>Drag & drop your WAV, FLAC, or MP3 file here, or click to browse</p>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Supports Lossless FLAC/WAV up to 150MB</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="audio/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setFileName(e.target.files[0].name);
                            }
                          }}
                          style={{ display: 'none' }}
                          id="file-upload-input"
                        />
                        <label htmlFor="file-upload-input" style={{ display: 'inline-block', marginTop: '12px', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                          Browse Local Storage
                        </label>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-play-hero" 
                      style={{ marginTop: '10px', justifyContent: 'center' }}
                    >
                      <RiUpload2Line /> Ingest & Publish Track
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Unified Dashboard Footer Copyright Strip */}
        <div className="dashboard-copyright-strip" style={{ background: 'rgba(11, 15, 30, 0.95)' }}>
          <span>© {new Date().getFullYear()} TuneMavens Ltd. All rights reserved.</span>
          <span className="dashboard-copyright-divider">·</span>
          <span>Operating on the shared Intermaven network.</span>
        </div>
      </main>

      {/* Persistent Audio Player Bar */}
      <footer className="ts-player-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', borderTop: '1px solid rgba(0, 240, 255, 0.2)' }}>
        <div className="player-track-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={currentTrack.cover} alt={currentTrack.title} className="player-cover" />
          <div className="player-metadata">
            <span className="player-title">{currentTrack.title}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="player-artist">{currentTrack.artist}</span>
              <a 
                href={`http://localhost:3000/#/epk/${currentTrack.artist.toLowerCase().replace(/\s+/g, '')}`}
                target="_blank" 
                rel="noreferrer"
                style={{ fontSize: '10px', background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff', padding: '2px 6px', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}
              >
                🌐 Web World
              </a>
            </div>
          </div>
        </div>

        <div className="player-controls">
          <div className="control-buttons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-control"><RiSkipBackFill /></button>
            <button className="btn-control btn-play-pause" onClick={togglePlay}>
              {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
            </button>
            <button className="btn-control"><RiSkipForwardFill /></button>

            {/* Plan-Based Audio Stream Gating Tag */}
            <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(255,183,3,0.15)', color: '#ffb703', border: '1px solid #ffb70344', padding: '2px 8px', borderRadius: '12px' }}>
              🎧 45s Preview (Starter) • Upgrade for Full Stream
            </span>
          </div>

          <div className="playback-bar">
            <span className="time-stamp">1:24</span>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '40%' }}></div>
            </div>
            <span className="time-stamp">{currentTrack.duration}</span>
          </div>
        </div>

        <div className="player-volume" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Direct Artist Tip Button */}
          <button 
            onClick={() => alert(`Sent $5.00 tip to ${currentTrack.artist} via Intermaven Credit Bank!`)}
            style={{ background: 'linear-gradient(135deg, #ff007f 0%, #7928ca 100%)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RiCoinsLine /> Tip Artist $5
          </button>

          <RiVolumeUpFill className="volume-icon" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)} 
            className="volume-slider"
          />
        </div>
      </footer>

      <CreditReloadModal
        isOpen={isCreditReloadOpen}
        onClose={() => setIsCreditReloadOpen(false)}
        sessionUser={activeUser}
        onCreditsUpdated={(newCredits) => {
          setUserCredits(newCredits);
          localStorage.setItem('tunemavens_user_credits', newCredits.toString());
        }}
      />
      <AffiliatePayoutSettingsModal
        isOpen={isPayoutSettingsModalOpen}
        onClose={() => setIsPayoutSettingsModalOpen(false)}
        sessionUser={activeUser}
      />
      <AffiliateReferralLinkModal
        isOpen={isReferralLinkModalOpen}
        onClose={() => setIsReferralLinkModalOpen(false)}
        sessionUser={activeUser}
      />
      <AffiliateDirectTalentModal
        isOpen={isDirectTalentModalOpen}
        onClose={() => setIsDirectTalentModalOpen(false)}
        sessionUser={activeUser}
      />
      <AppHelpAiControls
        activeTab={activeTab}
        sessionUser={activeUser}
      />

    </div>
  );
}
