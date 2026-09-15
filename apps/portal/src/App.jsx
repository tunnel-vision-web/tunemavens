// Global self-healing storage recovery to resolve stale state crashes
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (e.message && (
      e.message.includes('roles') || 
      e.message.includes('genres') || 
      e.message.includes('chatLog') || 
      e.message.includes('JSON.parse')
    )) {
      console.warn('Recovering from storage corruption:', e.message);
      sessionStorage.clear();
      window.location.reload();
    }
  });
}

import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import { 
  HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams
} from 'react-router-dom'
import { 
  RiMusicFill, RiGlobalFill, RiBarChartFill, RiCheckboxCircleFill, RiApps2Fill, RiShieldFill, RiArrowRightFill, RiArrowLeftFill, RiLockFill, RiDatabase2Fill, RiStackFill, RiSettings3Fill, RiTerminalFill, RiRadioFill, RiFileTextFill, RiKey2Fill, RiRefreshFill, RiCpuFill, RiQuestionFill, RiArrowDownSFill, RiArrowLeftSFill, RiArrowRightSFill, RiMenuFill, RiCloseFill, RiMessage2Fill, RiBookOpenFill, RiCoinsFill, RiBellFill, RiUserFill, RiLogoutBoxRFill, RiExternalLinkFill, RiSmartphoneFill, RiDownloadFill, RiHomeFill, RiAppleFill, RiBankCardFill, RiHeadphoneFill, RiLineChartFill, RiResetLeftFill, RiSendPlaneFill, RiGroupFill as UsersIcon, RiPenNibFill, RiLinksFill, RiMailFill, RiPlayFill, RiDiscFill, RiMicFill, RiEqualizerFill, RiWifiFill, RiFolderAddFill, RiTicket2Fill, RiStarFill, RiPauseFill,
  RiSkipBackFill, RiSkipForwardFill, RiShuffleLine, RiRepeat2Line, RiRepeatOneLine, RiPlayList2Line, RiFolderMusicLine, RiTableLine, RiFileList3Line, RiMagicLine, RiUploadCloud2Line, RiDiscLine, RiEditLine, RiCloseLine, RiMenuFoldLine, RiMenuUnfoldLine, RiVolumeUpFill, RiVolumeMuteFill, RiArrowLeftLine, RiSaveLine, RiAddLine, RiDeleteBin6Line,
  RiSubtractLine, RiExternalLinkLine, RiSparklingLine, RiPaletteLine, RiImageAddLine, RiArrowUpSLine, RiArrowDownSLine, RiStarLine, RiMusic2Line, RiSearchLine,
  RiPriceTag3Fill
} from 'react-icons/ri'

// Local assets
import logoImg from './assets/logo.png'
import heroMusic1Img from './assets/images/hero_music_1.png'
import heroMusic2Img from './assets/images/hero_music_2.png'
import heroMusic3Img from './assets/images/hero_music_3.png'
import heroMusic4Img from './assets/images/hero_music_4.png'
import heroMusic1WesternImg from './assets/images/hero_music_1_western.png'
import heroMusic2WesternImg from './assets/images/hero_music_2_western.png'
import heroMusic3WesternImg from './assets/images/hero_music_3_western.png'
import appsSyncImg from './assets/images/apps_sync.png'
import appsMasteringImg from './assets/images/apps_mastering.png'
import appsLedgerImg from './assets/images/apps_ledger.png'
import distributeHeroImg from './assets/images/distribute_hero.png'
import listenHeroImg from './assets/images/listen_hero.png'
import tunestreamHeaderImg from './assets/images/tunestream_header.png'
import tunestreamHeader2Img from './assets/images/tunestream_header_2.png'
import tunestreamHeader3Img from './assets/images/tunestream_header_3.png'

import headerToolsImg from './assets/images/header_tools.png'
import headerAppsImg from './assets/images/header_apps.png'
import headerPricingImg from './assets/images/header_pricing.png'
import headerAboutImg from './assets/images/header_about.png'
import headerHelpImg from './assets/images/header_help.png'
import headerToolsWesternImg from './assets/images/header_tools_western.png'
import headerAppsWesternImg from './assets/images/header_apps_western.png'
import headerPricingWesternImg from './assets/images/header_pricing_western.png'
import headerAboutWesternImg from './assets/images/header_about_western.png'
import headerHelpWesternImg from './assets/images/header_help_western.png'
import perfectForHeaderImg from './assets/images/perfect_for_header.png'

import userSongwriterImg from './assets/images/user_songwriter.png'
import userProducerImg from './assets/images/user_producer.png'
import userManagerImg from './assets/images/user_manager.png'
import userSupervisorImg from './assets/images/user_supervisor.png'

import consumerAppImg from './assets/images/consumer_app.png'
import creatorDashboardImg from './assets/images/creator_dashboard.png'

import ledgerStep1Img from './assets/images/ledger_step_1.png'
import ledgerStep2Img from './assets/images/ledger_step_2.png'
import ledgerStep3Img from './assets/images/ledger_step_3.png'
import ledgerStep4Img from './assets/images/ledger_step_4.png'

import syncStep1Img from './assets/images/sync_step_1.png'
import syncStep2Img from './assets/images/sync_step_2.png'
import syncStep3Img from './assets/images/sync_step_3.png'
import syncStep4Img from './assets/images/sync_step_4.png'

import RegionSwitcher from './RegionSwitcher.jsx'
import { useRegion } from './RegionContext.jsx'
import { authApi, tokenStore, adminApi, dealsApi, usersApi, socialAiApi, crmApi, cmsApi } from './lib/api.js'
import { reconcileUserApps, persistAppActivation, getStoredActivatedApps } from './lib/activatedApps.js'
import { INTERMAVEN_NATIVE_APPS } from './lib/nativeApps.js'
import { INTERMAVEN_PLATFORM_APPS } from './lib/intermavenPlatformApps.js'
import { PerfectForSidebar, PERFECT_FOR_ROLES, ROLE_LOGOS, getIntermavenUrl } from './components/PerfectForSidebar.jsx'

import Navbar from './components/common/Navbar.jsx'
import PageHeader from './components/common/PageHeader.jsx'
import Footer from './components/common/Footer.jsx'

import HomeView from './views/landing/HomeView.jsx'
import ToolsView from './views/landing/ToolsView.jsx'
import AppsView from './views/landing/AppsView.jsx'
import NativeAppsView from './views/landing/NativeAppsView.jsx'
import NativeAppLandingView from './views/landing/NativeAppLandingView.jsx'
import PerfectForPageView from './views/landing/PerfectForPageView.jsx'
import RoleLandingView from './views/landing/RoleLandingView.jsx'
import PricingView from './views/landing/PricingView.jsx'
import AboutView from './views/landing/AboutView.jsx'
import HelpView from './views/landing/HelpView.jsx'
import PublishingView from './views/landing/PublishingView.jsx'
import DistributionView from './views/landing/DistributionView.jsx'
import ToursView from './views/landing/ToursView.jsx'
import SyncPlacementView from './views/landing/SyncPlacementView.jsx'
import StreamView from './views/consumer/StreamView.jsx'
import {
  TuneStreamAboutView,
  TuneStreamFeaturesView,
  TuneStreamCreatorsView,
  TuneStreamHelpView
} from './views/consumer/TuneStreamViews.jsx'
import LoginView from './views/auth/LoginView.jsx'
import RegisterView from './views/auth/RegisterView.jsx'
import CreatorEpkView, { EPK_THEMES } from './views/creator/CreatorEpkView.jsx'
import EpkWizard from './components/EpkWizard.jsx'
import DashboardCmsStudio from './components/DashboardCmsStudio.jsx'
import SmartCrmStudioPanel from './components/SmartCrmStudioPanel.jsx'
import CatalogueWizard from './components/CatalogueWizard.jsx'
import ArtistRosterSelector from './components/ArtistRosterSelector.jsx'
import GenreManagerModal from './components/GenreManagerModal.jsx'
import { loadAuthoritativeGenres, DEFAULT_CANONICAL_GENRES } from './lib/genres.js'
import {
  OnboardingStripe, OnboardingWizardModal, RecommendationHero,
  PublishingElectionPanel, DistributionElectionPanel, ContractDrawer,
  AppMarketplacePanel, PanelHeader,
} from './components/phase3.jsx'

// ================= Dashboard Apps View =================
// ================= Dashboard Apps Sub-Components =================




// ================= Native Apps View (3 flagship mobile apps) =================
// TuneMavens Consumer App · Creator Companion App · M-Pesa POS App.
// App definitions live in src/lib/nativeApps.js so the dashboard App
// Marketplace can render the same exact entries inside its "Native Apps" tab.


// ================= Dashboard Apps View =================


// ================= Pricing View =================



// ================= Role landing (/for/:role)  -  placeholder =================
// Phase 2.5 (Identity & Roles) will replace this with hand-crafted marketing
// pages per role. For now, we resolve the role from the URL against the
// Perfect For catalogue and render a minimal hero so the sidebar links
// don't 404 and the routing/graph is testable end-to-end.

// ================= Perfect For Page View =================







// ================= Help Center & FAQ View =================




// ================= Consumer Streaming Platform View =================



// ================= Dashboard Topbar (notifications + account dropdown) =================
function DashboardTopbar({ sessionUser, onLogout, setActiveTab, onUpdateUser }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notifRef = useRef(null);
  const accountRef = useRef(null);

  // Placeholder notification feed  -  real live updates are on the roadmap.
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to TuneMavens', body: 'You\u2019re signed in across the whole network. Credits: 600.', read: false, at: '2m ago' },
    { id: 2, title: 'Your workspace is ready', body: 'Publishing, distribution and split panels are wired up and waiting.', read: false, at: '12m ago' },
    { id: 3, title: 'Tip: complete your profile', body: 'Add a brand bio so labels can find you in Sync Marketplace.', read: true, at: '1h ago' },
  ]);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  useEffect(() => {
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const initial = (sessionUser?.name || sessionUser?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="dashboard-topbar" data-testid="dashboard-topbar">
      <div className="dashboard-topbar-title">
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Console</span>
        <h1 style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', margin: '2px 0 0' }}>
          {sessionUser?.brand_name || sessionUser?.name || 'TuneMavens'}
        </h1>
      </div>

      <div className="dashboard-topbar-actions">
        {/* Task 3: prominent back-to-public-site button */}
        <Link
          to="/"
          className="topbar-back-to-site"
          title="Back to public site"
          data-testid="topbar-back-to-site"
        >
          <RiHomeFill size={14} />
          <span>Back to Site</span>
        </Link>

        {/* Notifications */}
        <div className="dashboard-topbar-item" ref={notifRef}>
          <button
            className="topbar-icon-btn"
            onClick={() => { setNotifOpen(o => !o); setAccountOpen(false); }}
            title="Notifications"
            data-testid="topbar-notifications-button"
          >
            <RiBellFill size={18} />
            {unread > 0 && <span className="topbar-badge" data-testid="topbar-notifications-badge">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="topbar-dropdown" data-testid="topbar-notifications-dropdown">
              <div className="topbar-dropdown-header">
                <strong>Notifications</strong>
                {unread > 0 && (
                  <button className="topbar-link-btn" onClick={markAllRead} data-testid="topbar-mark-all-read">
                    Mark all read
                  </button>
                )}
              </div>
              <ul className="topbar-notif-list">
                {notifications.length === 0 && (
                  <li className="topbar-notif-empty">You&apos;re all caught up.</li>
                )}
                {notifications.map(n => (
                  <li key={n.id} className={`topbar-notif-item ${n.read ? 'read' : 'unread'}`}>
                    <div className="topbar-notif-dot" />
                    <div className="topbar-notif-body">
                      <div className="topbar-notif-title">{n.title}</div>
                      <div className="topbar-notif-text">{n.body}</div>
                      <div className="topbar-notif-time">{n.at}</div>
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

        {/* Account dropdown */}
        <div className="dashboard-topbar-item" ref={accountRef}>
          <button
            className="topbar-account-btn"
            onClick={() => { setAccountOpen(o => !o); setNotifOpen(false); }}
            title="Account"
            data-testid="topbar-account-button"
          >
            <span className="topbar-avatar">{initial}</span>
            <span className="topbar-account-name">{sessionUser?.name || 'Account'}</span>
            <RiArrowDownSFill size={14} />
          </button>
          {accountOpen && (
            <div className="topbar-dropdown topbar-dropdown-account" data-testid="topbar-account-dropdown">
              <div className="topbar-account-summary">
                <div className="topbar-avatar large">{initial}</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{sessionUser?.name || 'TuneMavens User'}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{sessionUser?.email}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
                    {sessionUser?.role || 'creator'} · {sessionUser?.credits ?? 0} credits
                  </div>
                </div>
              </div>
              <div className="topbar-dropdown-divider" />
              <button
                className="topbar-menu-item"
                style={{ color: 'var(--cyan)' }}
                onClick={async () => {
                  setAccountOpen(false);
                  const newRole = sessionUser?.role === 'admin' ? 'creator' : 'admin';
                  try {
                    if (newRole === 'admin') {
                      await adminApi.becomeAdmin();
                    }
                  } catch (e) {
                    console.warn('API elevation warning:', e);
                  }
                  const merged = { ...sessionUser, role: newRole };
                  if (onUpdateUser) onUpdateUser(merged);
                  sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
                  window.location.reload();
                }}
                data-testid="topbar-menu-become-admin"
              >
                <RiShieldFill size={14} />
                <span>{sessionUser?.role === 'admin' ? 'Sandbox: Demote to Creator' : 'Sandbox: Elevate to Admin'}</span>
              </button>
              <button
                className="topbar-menu-item"
                onClick={() => { setActiveTab('profile'); setAccountOpen(false); }}
                data-testid="topbar-menu-account-settings"
              >
                <RiSettings3Fill size={14} />
                <span>Account Settings</span>
              </button>
              <Link
                to="/"
                className="topbar-menu-item"
                onClick={() => setAccountOpen(false)}
                data-testid="topbar-menu-visit-site"
              >
                <RiExternalLinkFill size={14} />
                <span>Visit Public Site</span>
              </Link>
              <div className="topbar-dropdown-divider" />
              <button
                className="topbar-menu-item topbar-menu-item-danger"
                onClick={() => { setAccountOpen(false); onLogout(); }}
                data-testid="topbar-menu-logout"
              >
                <RiLogoutBoxRFill size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}



// Collapsed sidebar navigation items icon representations & descriptions
const NAV_ITEM_DESCRIPTIONS = {
  home: {
    title: 'Overview',
    desc: 'Platform analytics, stream counts, revenue summaries, and workspace stats',
    category: 'Dashboard'
  },
  catalog: {
    title: 'Catalogue',
    desc: 'Central track & album catalogue, metadata manager, ISRCs, audio previews & release ingestion',
    category: 'Catalog & IP'
  },
  'epk-builder': {
    title: 'EPK Builder',
    desc: 'Interactive Electronic Press Kit studio, theme visualizer, hero customizer & live player showcase',
    category: 'Catalog & IP'
  },
  splits: {
    title: 'Split Cascade',
    desc: 'Automated royalty splits ledger, collaborator percentages, and transparent payouts',
    category: 'Royalty Ledgers'
  },
  djpool: {
    title: 'DJ Pool MVP',
    desc: 'Promotional record pool for club and radio DJs, lossless downloads, and feedback tracking',
    category: 'Pools & Sync'
  },
  sync: {
    title: 'Sync Marketplace',
    desc: 'Pitch catalog tracks to TV shows, feature films, video games, and commercial sync briefs',
    category: 'Pools & Sync'
  },
  escrow: {
    title: 'Escrow Contracts',
    desc: 'Smart contract escrow agreements for milestone-based production, mixing & collab payments',
    category: 'Royalty Ledgers'
  },
  'publishing-election': {
    title: 'Publishing Election',
    desc: 'Global publishing administration election, PRO registration, and composition royalties',
    category: 'Royalty Ledgers'
  },
  'distribution-election': {
    title: 'Distribution Election',
    desc: 'Global digital distribution deals to Spotify, Apple Music, TikTok, and YouTube Music',
    category: 'Royalty Ledgers'
  },
  'app-marketplace': {
    title: 'App Marketplace',
    desc: 'Discover and activate Intermaven network apps, creator companion modules & monetization tools',
    category: 'Apps & Marketplace'
  },
  'social-ai': {
    title: 'Social AI Studio',
    desc: 'AI marketing suite for promotional copy, social captions, marketing strategy, and release artwork',
    category: 'Creator Tools'
  },
  crm: {
    title: 'Smart CRM',
    desc: 'Fan relationship management, VIP subscriber lists, direct email blasts & live engagement',
    category: 'Creator Tools'
  },
  cms: {
    title: 'CMS Layouts',
    desc: 'Mother-CMS visual website editor, banner customizer, typography, and version rollbacks',
    category: 'Admin'
  },
  'domain-mappings': {
    title: 'Domain Mappings',
    desc: 'Custom domains and subdomains routing across the Intermaven creator network',
    category: 'Admin'
  },
  'promoted-acts': {
    title: 'Promoted Acts',
    desc: 'Platform-wide artist spotlights, trending acts curation, and featured talent showcases',
    category: 'Admin'
  },
  profile: {
    title: 'Profile Settings',
    desc: 'Account security, artist brand identity, connected wallets, and workspace preferences',
    category: 'Account'
  },
  library: {
    title: 'My Library',
    desc: 'TuneStream personal saved collection, playlists, downloaded stems, and favorite releases',
    category: 'TuneStream'
  },
  tips: {
    title: 'Tips & Purchases',
    desc: 'Fan micropayments, direct tips ledger, digital merch purchases, and supporter badges',
    category: 'TuneStream'
  },
  'stream-controls': {
    title: 'Player & Devices',
    desc: 'TuneStream lossless audio player configuration, bit-depth controls & streaming device routing',
    category: 'TuneStream'
  },
  'pos-inventory': {
    title: 'POS Inventory',
    desc: 'TunePay physical merch inventory, vinyl & CD stock control, and tour sales management',
    category: 'TunePay'
  },
  'pos-settlement': {
    title: 'POS Settlement',
    desc: 'Real-time sales reconciliation, mobile cashouts, M-Pesa settlements, and digital receipts',
    category: 'TunePay'
  },
  'pos-devices': {
    title: 'POS Devices',
    desc: 'Manage connected mobile card readers, contactless terminals, and merchant hardware',
    category: 'TunePay'
  }
};

// ================= Creator / Admin Dashboard View =================
function DashboardView({ 
  sessionUser, 
  onLogout, 
  onUpdateUser,
  catalogTracks,
  setCatalogTracks,
  ledgerRows,
  setLedgerRows,
  creatorEpk,
  setCreatorEpk
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const target = sessionStorage.getItem('preferred_dashboard_tab');
    if (target) {
      sessionStorage.removeItem('preferred_dashboard_tab');
      return target;
    }
    return 'home';
  });
  const [userCredits, setUserCredits] = useState(sessionUser?.credits || 600);
  const [payoutBalance, setPayoutBalance] = useState(4235.80);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState(null);
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [cmsInitialTab, setCmsInitialTab] = useState('music');

  // Multi-Artist Roster Management State for Labels, Publishers, and Catalogue Owners
  const [activeArtist, setActiveArtist] = useState(() => {
    return {
      id: creatorEpk?.subdomain || 'ndufo',
      name: creatorEpk?.artist_name || 'Ndufo',
      subdomain: creatorEpk?.subdomain || 'ndufo',
      role: 'Primary Artist'
    };
  });

  const handleSwitchArtist = async (artist) => {
    if (!artist) return;
    setActiveArtist(artist);
    const sub = (artist.subdomain || artist.id || 'ndufo').toLowerCase();

    // 1. Fetch catalog tracks for this artist or all platform tracks
    try {
      const url = (sub === 'all') 
        ? '/api/catalog/tracks?all=true' 
        : `/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.tracks || []);
        if (list.length > 0) {
          setCatalogTracks(list);
        } else if (sub !== 'ndufo' && sub !== 'all') {
          setCatalogTracks([]);
        }
      }
    } catch (err) {
      console.warn('Failed to switch catalog tracks for artist:', err);
    }

    // 2. Fetch or update EPK layout for this artist
    if (sub !== 'all') {
      try {
        const epkRes = await fetch(`/api/epk/${encodeURIComponent(sub)}`);
        if (epkRes.ok) {
          const epkData = await epkRes.json();
          setCreatorEpk({ subdomain: sub, artist_name: artist.name, ...epkData });
        } else {
          setCreatorEpk(prev => ({
            ...prev,
            subdomain: sub,
            artist_name: artist.name,
            themeGenre: artist.genre || prev?.themeGenre
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch EPK for artist:', err);
      }
    }
  };

  // TuneStream Global Audio Player State
  const [globalTrack, setGlobalTrack] = useState(null);
  const [globalPlaying, setGlobalPlaying] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isUndocked, setIsUndocked] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 40, y: 120 });
  const [playlistQueue, setPlaylistQueue] = useState([]);

  const handlePlayGlobalTrack = (t, queue = null) => {
    if (!t) return;
    setGlobalTrack(t);
    setGlobalPlaying(true);
    setGlobalProgress(0);
    if (Array.isArray(queue) && queue.length > 0) {
      setPlaylistQueue(queue);
    } else if (playlistQueue.length === 0 && Array.isArray(catalogTracks) && catalogTracks.length > 0) {
      setPlaylistQueue(catalogTracks);
    }
    const audioEl = document.getElementById('tunestream-global-audio');
    if (audioEl) {
      const src = t.audioUrl || t.fileUrl || `/api/stream/track/${encodeURIComponent(t.isrc || t.title || 'preview')}`;
      if (audioEl.src !== src) {
        audioEl.src = src;
        audioEl.load();
      }
      audioEl.play().catch(e => console.warn('Direct audio play deferred:', e));
    }
  };

  // Automatically collapse sidebar when Catalogue or EPK Builder are clicked / active
  useEffect(() => {
    if (['catalog', 'epk-builder'].includes(activeTab)) {
      setCollapsed(true);
    }
  }, [activeTab]);

  // Fetch onboarding on mount so the OnboardingStripe knows whether the wizard
  // has been completed.
  useEffect(() => {
    if (!sessionUser || !tokenStore.get()) return;
    usersApi.getOnboarding()
      .then((o) => setWizardAnswers(o))
      .catch(() => setWizardAnswers(null));
  }, [sessionUser?.id]);

  // Log tab-visit activity signals  -  the recommendation engine uses them.
  useEffect(() => {
    if (!sessionUser || !activeTab || !tokenStore.get()) return;
    usersApi.logActivity({ kind: 'tab_visit', ref: activeTab }).catch(() => {});
  }, [activeTab, sessionUser?.id]);

  // Ensure activated app choice (like EPK Builder) is remembered whenever viewed or active
  useEffect(() => {
    if (activeTab === 'epk-builder') {
      const activeApps = sessionUser?.apps || getStoredActivatedApps(sessionUser) || [];
      if (!activeApps.includes('epk-builder')) {
        persistAppActivation('epk-builder', sessionUser, onUpdateUser);
      }
    }
  }, [activeTab, sessionUser]);

  // Reactive listener for app activations/deactivations across the system
  const [, setAppsUpdateTrigger] = useState(0);
  useEffect(() => {
    const handleAppsUpdated = () => setAppsUpdateTrigger(prev => prev + 1);
    window.addEventListener('tunemavens-apps-updated', handleAppsUpdated);
    return () => window.removeEventListener('tunemavens-apps-updated', handleAppsUpdated);
  }, []);

  useEffect(() => {
    if (!sessionUser) {
      navigate('/login');
    }
  }, [sessionUser, navigate]);

  if (!sessionUser) return null;

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardHome 
            sessionUser={sessionUser}
            tracks={catalogTracks}
            userCredits={userCredits}
            payoutBalance={payoutBalance}
            setUserCredits={setUserCredits}
            setActiveTab={setActiveTab}
          />
        );
      case 'catalog':
        return (
          <CataloguePanel 
            setActiveTab={setActiveTab} 
            tracks={catalogTracks} 
            setTracks={setCatalogTracks}
            sessionUser={sessionUser}
            creatorEpk={creatorEpk}
            collapsed={collapsed}
            onToggleSidebar={() => setCollapsed(!collapsed)}
            onPlayTrack={handlePlayGlobalTrack}
            activeArtist={activeArtist}
            onSelectArtist={handleSwitchArtist}
          />
        );
      case 'splits':
        return (
          <SplitCascadePanel 
            sessionUser={sessionUser} 
            tracks={catalogTracks}
            ledgerRows={ledgerRows}
            setLedgerRows={setLedgerRows}
            payoutBalance={payoutBalance}
            setPayoutBalance={setPayoutBalance}
          />
        );
      case 'djpool':
        return <DjPoolPanel sessionUser={sessionUser} />;
      case 'sync':
        return <SyncBriefMatchPanel sessionUser={sessionUser} tracks={catalogTracks} />;
      case 'mastering':
        return <MasteringUploadPanel sessionUser={sessionUser} />;
      case 'escrow':
        return (
          <EscrowContractsPanel 
            payoutBalance={payoutBalance} 
            setPayoutBalance={setPayoutBalance} 
          />
        );
      case 'settings':
      case 'profile':
        return (
          <ProfileSettingsPanel 
            sessionUser={sessionUser} 
            onUpdateUser={onUpdateUser} 
          />
        );
      case 'library':
        return <ConsumerLibraryPanel />;
      case 'tips':
        return <ConsumerTipsPanel />;
      case 'stream-controls':
        return <ConsumerStreamControlsPanel />;
      case 'pos-inventory':
        return <PosInventoryPanel />;
      case 'pos-settlement':
        return <PosSettlementPanel />;
      case 'pos-devices':
        return <PosDevicesPanel />;
      case 'domain-mappings':
        return <DomainMappingsPanel sessionUser={sessionUser} onUpdateUser={onUpdateUser} />;
      case 'promoted-acts':
        return <PromotedActsAdminPanel />;
      case 'publishing-election':
        return <PublishingElectionPanel sessionUser={sessionUser} />;
      case 'distribution-election':
        return <DistributionElectionPanel sessionUser={sessionUser} />;
      case 'social-ai':
        return (
          <SocialAiPanel 
            setActiveTab={setActiveTab} 
            sessionUser={sessionUser}
            onPlayTrack={handlePlayGlobalTrack}
          />
        );
      case 'crm':
        return <CrmPanel sessionUser={sessionUser} />;
      case 'cms':
        return <CmsPanel sessionUser={sessionUser} epk={creatorEpk} setEpk={setCreatorEpk} tracks={catalogTracks} initialTab={cmsInitialTab} onSwitchToWizard={() => setActiveTab('catalog')} />;
      case 'epk-builder':
        return (
          <EPKBuilderPanel
            tracks={catalogTracks}
            epk={creatorEpk}
            setEpk={setCreatorEpk}
            sessionUser={sessionUser}
            setActiveTab={setActiveTab}
            activeArtist={activeArtist}
            onSelectArtist={handleSwitchArtist}
          />
        );
      case 'app-marketplace':
        return <AppMarketplacePanel sessionUser={sessionUser} onUpdateUser={onUpdateUser} setActiveTab={setActiveTab} onOpenWizard={() => setWizardOpen(true)} wizardAnswers={wizardAnswers} onOpenAppModal={(url, title) => setActiveModalApp({ url, title })} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  const getCategorizedMenu = () => {
    const role = sessionUser?.role || 'creator';
    
    const allItems = {
      home: { id: 'home', label: 'Overview', icon: RiBarChartFill, category: 'Dashboard' },
      catalog: { id: 'catalog', label: 'Catalogue', icon: RiDatabase2Fill, category: 'Catalog & IP' },
      'epk-builder': { id: 'epk-builder', label: 'EPK Builder', icon: RiDiscFill, category: 'Catalog & IP' },
      splits: { id: 'splits', label: 'Split Cascade', icon: RiCoinsFill, category: 'Royalty Ledgers' },
      djpool: { id: 'djpool', label: 'DJ Pool MVP', icon: RiRadioFill, category: 'Pools & Sync' },
      sync: { id: 'sync', label: 'Sync Marketplace', icon: RiGlobalFill, category: 'Pools & Sync' },
      escrow: { id: 'escrow', label: 'Escrow Contracts', icon: RiShieldFill, category: 'Royalty Ledgers' },
      profile: { id: 'profile', label: 'Profile Settings', icon: RiSettings3Fill, category: 'Account' },
      // Native-app user controls (full editing parity with the apps)
      library: { id: 'library', label: 'My Library', icon: RiMusicFill, category: 'tunestream' },
      tips: { id: 'tips', label: 'Tips & Purchases', icon: RiCoinsFill, category: 'tunestream' },
      'stream-controls': { id: 'stream-controls', label: 'Player & Devices', icon: RiHeadphoneFill, category: 'tunestream' },
      'pos-inventory': { id: 'pos-inventory', label: 'POS Inventory', icon: RiDatabase2Fill, category: 'tunepay' },
      'pos-settlement': { id: 'pos-settlement', label: 'POS Settlement', icon: RiCoinsFill, category: 'tunepay' },
      'pos-devices': { id: 'pos-devices', label: 'POS Devices', icon: RiSmartphoneFill, category: 'tunepay' },
      'publishing-election': { id: 'publishing-election', label: 'Publishing Election', icon: RiBookOpenFill, category: 'Royalty Ledgers' },
      'distribution-election': { id: 'distribution-election', label: 'Distribution Election', icon: RiGlobalFill, category: 'Royalty Ledgers' },
      'app-marketplace': { id: 'app-marketplace', label: 'App Marketplace', icon: RiApps2Fill, category: 'Apps & Marketplace' },
      'social-ai': { id: 'social-ai', label: 'Social AI Studio', icon: RiCpuFill, category: 'Creator Tools' },
      crm: { id: 'crm', label: 'Smart CRM', icon: RiMessage2Fill, category: 'Creator Tools' },
      cms: { id: 'cms', label: 'CMS Layouts', icon: RiFileTextFill, category: 'Admin' },
      'domain-mappings': { id: 'domain-mappings', label: 'Domain Mappings', icon: RiGlobalFill, category: 'Admin' },
      'promoted-acts': { id: 'promoted-acts', label: 'Promoted Acts', icon: RiStarFill, category: 'Admin' },
    };

    let visibleKeys = [];
    switch (role) {
      case 'admin':
        visibleKeys = ['home', 'app-marketplace', 'social-ai', 'crm', 'cms', 'catalog', 'epk-builder', 'splits', 'publishing-election', 'distribution-election', 'djpool', 'sync', 'escrow', 'library', 'tips', 'pos-inventory', 'pos-settlement', 'pos-devices', 'domain-mappings', 'promoted-acts', 'profile'];
        break;
      case 'label':
        visibleKeys = ['home', 'app-marketplace', 'social-ai', 'crm', 'catalog', 'epk-builder', 'splits', 'publishing-election', 'distribution-election', 'sync', 'pos-inventory', 'pos-settlement', 'pos-devices', 'profile'];
        break;
      case 'dj':
        visibleKeys = ['home', 'app-marketplace', 'social-ai', 'crm', 'djpool', 'library', 'tips', 'profile'];
        break;
      case 'studio':
      case 'supervisor':
        visibleKeys = ['home', 'app-marketplace', 'social-ai', 'crm', 'sync', 'escrow', 'profile'];
        break;
      case 'consumer':
        visibleKeys = ['home', 'library', 'tips', 'stream-controls', 'profile'];
        break;
      case 'creator':
      default:
        visibleKeys = ['home', 'app-marketplace', 'social-ai', 'crm', 'catalog', 'epk-builder', 'splits', 'publishing-election', 'distribution-election', 'djpool', 'sync', 'escrow', 'library', 'tips', 'pos-inventory', 'pos-settlement', 'profile'];
        break;
    }

    const APP_SLUGS = {
      catalog: 'catalog-porting',
      splits: 'split-cascade',
      'publishing-election': 'publishing-election',
      'distribution-election': 'distribution-election',
      djpool: 'djpool',
      sync: 'sync-marketplace',
      escrow: 'escrow-contracts',
      library: 'tunemavens-library',
      tips: 'tunemavens-tips',
      'pos-inventory': 'tunepay-inventory',
      'pos-settlement': 'tunepay-settlement',
      'pos-devices': 'tunepay-devices',
      'epk-builder': 'epk-builder',
      'social-ai': 'intermaven-social-ai',
      crm: 'intermaven-smart-crm'
    };

    const categories = {};
    visibleKeys.forEach(k => {
      // Check if this tab is a marketplace app, and if so, only show if activated (CRM is always available).
      if (APP_SLUGS[k] && k !== 'crm') {
        const activeApps = sessionUser?.apps || getStoredActivatedApps(sessionUser) || [];
        if (!activeApps.includes(APP_SLUGS[k])) {
          return;
        }
      }
      const item = allItems[k];
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    return categories;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div 
          className="dashboard-sidebar-scroll" 
          data-testid="dashboard-sidebar-scroll"
          onScroll={() => setHoveredNavItem(null)}
        >
          <div className="dashboard-sidebar-header" style={{ flexDirection: collapsed ? 'column' : 'row', gap: '10px', alignItems: 'center' }}>
            <Link to="/" title="Back to TuneMavens public site" data-testid="sidebar-logo-link" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {collapsed ? (
                <img src="/favicon.png" alt="TuneMavens Icon" style={{ height: '32px', width: 'auto', display: 'block' }} />
              ) : (
                <img src="/tunemavens-logo-white.png" alt="TuneMavens Logo" style={{ height: '36px', width: 'auto', display: 'block', margin: '0 auto' }} />
              )}
            </Link>
          </div>

          <button 
            onClick={() => {
              setCollapsed(!collapsed);
              setHoveredNavItem(null);
            }} 
            onMouseEnter={(e) => {
              if (collapsed) {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredNavItem({
                  id: 'collapse-toggle',
                  title: 'Expand Sidebar',
                  category: 'Navigation',
                  desc: 'Expand sidebar to display full module names and labels',
                  rect
                });
              }
            }}
            onMouseLeave={() => setHoveredNavItem(null)}
            className="dashboard-nav-item collapse-toggle-btn"
            style={{ border: 'none', background: 'transparent', padding: '6px', justifyContent: 'center', width: '100%', marginBottom: '16px', color: '#94a3b8' }}
            title={!collapsed ? "Collapse Sidebar" : undefined}
          >
            {collapsed ? <RiArrowRightSFill size={16} /> : <RiArrowLeftSFill size={16} />}
          </button>

          {Object.entries(getCategorizedMenu()).map(([category, items]) => (
            <div key={category} className="sidebar-category-group" style={{ marginBottom: '12px' }}>
              {!collapsed && (
                <div style={{ fontSize: '10px', color: '#475569', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', padding: '6px 14px 4px' }}>
                  {category}
                </div>
              )}
              <ul className="dashboard-nav-list" style={{ gap: '4px' }}>
                {items.map(item => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button 
                        onClick={() => {
                          if (['catalog', 'epk-builder'].includes(item.id)) {
                            setCollapsed(true);
                          }
                          if (item.id === 'crm') {
                            const activeSub = localStorage.getItem('last_saved_epk_subdomain') || 'ndufo';
                            try {
                              const localFans = JSON.parse(localStorage.getItem(`creator_crm_fans_${activeSub}`) || '[]');
                              fetch(`/api/crm/contacts?creator_username=${activeSub}`)
                                .then(r => r.json())
                                .then(d => {
                                  const remoteContacts = d.contacts || [];
                                  const merged = [...remoteContacts, ...localFans.map((f, i) => ({
                                    id: `CRM-FAN-${i+1}`,
                                    first_name: (f.name || 'Fan').split(' ')[0],
                                    last_name: (f.name || '').split(' ').slice(1).join(' '),
                                    email: f.email,
                                    phone: f.phone || '+1 (555) 019-2834',
                                    company: activeSub.toUpperCase(),
                                    tags: ['fan', 'vip'],
                                    source: 'creator_fan_portal',
                                    status: 'active'
                                  }))];
                                  localStorage.setItem('intermaven_crm', JSON.stringify(merged));
                                })
                                .catch(() => {});
                            } catch (_) {}

                            const targetUrl = getIntermavenUrl('intermaven-smart-crm');
                            setActiveModalApp({ url: targetUrl, title: 'Intermaven Smart CRM' });
                          } else if (item.id === 'cms') {
                            setActiveTab('cms');
                          } else {
                            setActiveTab(item.id);
                          }
                        }} 
                        onMouseEnter={(e) => {
                          if (collapsed) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const descObj = NAV_ITEM_DESCRIPTIONS[item.id] || {};
                            setHoveredNavItem({
                              id: item.id,
                              title: descObj.title || item.label,
                              category: descObj.category || item.category,
                              desc: descObj.desc || `Manage ${item.label.toLowerCase()} in your workspace`,
                              isActive: activeTab === item.id,
                              rect
                            });
                          }
                        }}
                        onMouseLeave={() => setHoveredNavItem(null)}
                        className={`dashboard-nav-item ${activeTab === item.id && !['crm', 'cms'].includes(item.id) ? 'active' : ''}`}
                        title={!collapsed ? item.label : undefined}
                      >
                        <Icon size={16} />
                        {!collapsed && item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <ul className="dashboard-nav-list" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
            <li>
              <Link 
                to="/" 
                className="dashboard-nav-item"
                style={{ textDecoration: 'none' }}
                onMouseEnter={(e) => {
                  if (collapsed) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredNavItem({
                      id: 'back-to-site',
                      title: 'Back to Home Site',
                      category: 'Navigation',
                      desc: 'Exit dashboard and return to TuneMavens public landing page',
                      rect
                    });
                  }
                }}
                onMouseLeave={() => setHoveredNavItem(null)}
                title={!collapsed ? "Back to Home Site" : undefined}
              >
                <RiArrowLeftFill size={16} />
                {!collapsed && "Back to Home Site"}
              </Link>
            </li>
          </ul>
        </div>

        <div className="dashboard-sidebar-footer">
          <div className="dashboard-profile-card">
            <div className="dashboard-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 }}>
              {sessionUser.name ? sessionUser.name.charAt(0) : 'A'}
            </div>
            {!collapsed && (
              <div className="dashboard-profile-info">
                <h5>{sessionUser.name || 'Sandbox User'}</h5>
                <span 
                  onClick={async () => {
                    const newRole = sessionUser.role === 'admin' ? 'creator' : 'admin';
                    try {
                      if (newRole === 'admin') {
                        await adminApi.becomeAdmin();
                      }
                    } catch (e) {
                      console.warn('API elevation warning:', e);
                    }
                    const merged = { ...sessionUser, role: newRole };
                    if (onUpdateUser) onUpdateUser(merged);
                    sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
                    window.location.reload();
                  }}
                  title="Sandbox Toggle: Click to toggle Admin/Creator role"
                  style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block', marginTop: '2px' }}
                >
                  ⚙️  {sessionUser.role || 'creator'}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout} 
            className="dashboard-nav-item" 
            style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
            onMouseEnter={(e) => {
              if (collapsed) {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoveredNavItem({
                  id: 'logout',
                  title: 'Log Out',
                  category: 'Account',
                  desc: 'Securely sign out of your TuneMavens account session',
                  rect
                });
              }
            }}
            onMouseLeave={() => setHoveredNavItem(null)}
            title={!collapsed ? "Log Out" : undefined}
          >
            <RiCloseFill size={14} />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main-content">
        <DashboardTopbar
          sessionUser={sessionUser}
          onLogout={onLogout}
          setActiveTab={setActiveTab}
          onUpdateUser={onUpdateUser}
        />
        <div className="dashboard-main-scroll" data-testid="dashboard-main-scroll">
          <OnboardingStripe sessionUser={sessionUser} setActiveTab={setActiveTab} onOpenWizard={() => setWizardOpen(true)} wizardAnswers={wizardAnswers} />
          <div className="admin-app-wrapper">
            {renderActivePanel()}
          </div>
        </div>
        {/* Task 4: thin copyright strip pinned at bottom of admin */}
        <div className="dashboard-copyright-strip" data-testid="dashboard-copyright-strip">
          <span>© {new Date().getFullYear()} TuneMavens Ltd. All rights reserved.</span>
          <span className="dashboard-copyright-divider">·</span>
          <span>Operating on the shared Intermaven network.</span>
        </div>
      </main>
      <OnboardingWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initial={wizardAnswers}
        onSaved={(answers) => setWizardAnswers(answers)}
      />

      {activeModalApp && (
        <div 
          onClick={() => setActiveModalApp(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(7, 10, 19, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1360px',
              height: '92vh',
              background: '#0a0d18',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#0d1122'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee' }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.5px' }}>
                  {activeModalApp.title}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '12px' }}>
                  Standalone App Window
                </span>
              </div>
              <button 
                onClick={() => setActiveModalApp(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#94a3b8',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'background 0.2s, color 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body / EPK Builder or Iframe */}
            <div style={{ flex: 1, position: 'relative', background: '#0f172a', overflowY: 'auto', padding: activeModalApp.title === 'EPK Builder' ? '20px' : 0 }}>
              {activeModalApp.title === 'EPK Builder' ? (
                <EPKBuilderPanel 
                  tracks={catalogTracks} 
                  epk={creatorEpk} 
                  setEpk={setCreatorEpk} 
                  sessionUser={sessionUser} 
                  setActiveTab={(tab) => {
                    setActiveModalApp(null);
                    setActiveTab(tab);
                  }} 
                />
              ) : activeModalApp.title === 'Intermaven Smart CRM' ? (
                <SmartCrmStudioPanel
                  sessionUser={sessionUser}
                  onClose={() => setActiveModalApp(null)}
                />
              ) : (
                <iframe 
                  src={activeModalApp.url}
                  title={activeModalApp.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    background: '#0f172a'
                  }}
                  allow="clipboard-write"
                />
              )}
            </div>
          </div>
          
          <style>{`
            @keyframes modalSlideIn {
              from { transform: translateY(20px) scale(0.97); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Collapsed Sidebar Hover Tooltip */}
      {collapsed && hoveredNavItem && (
        <div 
          className="sidebar-collapsed-tooltip"
          style={{
            top: `${hoveredNavItem.rect.top + hoveredNavItem.rect.height / 2}px`,
            left: `${hoveredNavItem.rect.right + 12}px`,
            transform: 'translateY(-50%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
            <span style={{ 
              fontSize: '9px', 
              fontWeight: 800, 
              letterSpacing: '0.8px', 
              textTransform: 'uppercase', 
              color: '#22d3ee', 
              background: 'rgba(34, 211, 238, 0.12)', 
              padding: '2px 6px', 
              borderRadius: '3px',
              border: '1px solid rgba(34, 211, 238, 0.25)'
            }}>
              {hoveredNavItem.category}
            </span>
            {hoveredNavItem.isActive && (
              <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                ACTIVE
              </span>
            )}
          </div>

          <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px', letterSpacing: '-0.2px' }}>
            {hoveredNavItem.title}
          </div>

          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.45, fontWeight: 400 }}>
            {hoveredNavItem.desc}
          </div>
        </div>
      )}

      {/* Global TuneStream Audio Player */}
      <GlobalAudioPlayer
        globalTrack={globalTrack}
        setGlobalTrack={setGlobalTrack}
        globalPlaying={globalPlaying}
        setGlobalPlaying={setGlobalPlaying}
        globalProgress={globalProgress}
        setGlobalProgress={setGlobalProgress}
        isUndocked={isUndocked}
        setIsUndocked={setIsUndocked}
        playerPos={playerPos}
        setPlayerPos={setPlayerPos}
        catalogTracks={catalogTracks}
        playlistQueue={playlistQueue}
        setPlaylistQueue={setPlaylistQueue}
        userCredits={userCredits}
        setUserCredits={setUserCredits}
      />
    </div>
  );
}

// ================= Onboarding Stripe  -  top-of-dashboard checklist =================
// Shows the user what's still missing in their setup. Status derives live from
// what's actually in Mongo (publishing_deals, distribution_deals, users.apps),
// so the stripe shrinks naturally as the user completes each step.
// Phase 3 dashboard components are imported at top of file.



// Landing page customized solid background colors (dark theme)
function getLandingBackground(slug) {
  switch (slug) {
    case 'tunestream':
    case 'tunemavens':
      return '#070e1b'; // dark midnight teal/blue
    case 'creator-companion':
      return '#0e071a'; // dark amethyst/purple
    case 'tunepay':
      return '#05120e'; // dark forest green
    case 'sync-master':
      return '#080816'; // dark navy
    default:
      return '#0b0f20';
  }
}

function getRoleLandingBackground(role) {
  switch (role) {
    case 'creator':
      return '#10051a';
    case 'supervisor':
      return '#05101a';
    case 'label':
      return '#140d04';
    case 'booking':
      return '#0b1404';
    case 'manager':
      return '#140410';
    case 'exec':
      return '#040e14';
    case 'dj':
      return '#120412';
    default:
      return '#060813';
  }
}

const getPromotedActs = () => {
  const stored = localStorage.getItem('tunemavens_promoted_acts');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    { 
      id: 1, 
      name: 'Aisha Okoro', 
      title: 'Nairobi Sunset', 
      genre: 'Amapiano / House', 
      imageKey: 'heroMusic1',
      featuredTrack: 'Nairobi Sunset (Extended Mix)'
    },
    { 
      id: 2, 
      name: 'Caleb', 
      title: 'Lagos Lights', 
      genre: 'Afrobeats / Afro-Fusion', 
      imageKey: 'heroMusic2',
      featuredTrack: 'Lagos Lights (Intro Edit)'
    },
    { 
      id: 3, 
      name: 'Lerato', 
      title: 'Midnight Grooves', 
      genre: 'Deep-House / Kwaito', 
      imageKey: 'heroMusic3',
      featuredTrack: 'Midnight Grooves (Extended Mix)'
    }
  ];
};

// Shared Dashboard UI utilities: Search and Pagination
function DashboardSearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '300px', marginBottom: '14px' }}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        style={{
          width: '100%',
          padding: '8px 12px 8px 32px',
          fontSize: '13px',
          background: '#0a0f1d',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#fff',
          borderRadius: '3px'
        }}
      />
      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
        <RiSearchLine size={14} color="var(--cyan)" />
      </span>
    </div>
  );
}

function DashboardPagination({ currentPage, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ fontSize: '12px', color: '#64748b' }}>
        Showing {startIdx} to {endIdx} of {totalItems} entries
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="plan-btn outline"
          style={{ padding: '4px 8px', fontSize: '11px', height: '26px', borderRadius: '3px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          Prev
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={p === currentPage ? 'btn-primary' : 'plan-btn outline'}
            style={{ padding: '4px 8px', fontSize: '11px', height: '26px', minWidth: '26px', borderRadius: '3px', cursor: 'pointer' }}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="plan-btn outline"
          style={{ padding: '4px 8px', fontSize: '11px', height: '26px', borderRadius: '3px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}



// ================= SUB-PANEL: Domain Mappings (admin-only) =================
// Per user request, every route/app/tool is mapped to a public subdomain;
// only `admin` users see this tab.
function DomainMappingsPanel({ sessionUser, onUpdateUser }) {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [edits, setEdits] = useState({});      // id → { subdomain, label }
  const [showAdd, setShowAdd] = useState(false);
  const [newMap, setNewMap] = useState({ key: '', label: '', category: 'dashboard-app', path: '', subdomain: '' });

  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const ROOT_DOMAIN = 'tunemavens.com';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await adminApi.domainMappings.list();
      setMappings(list);
    } catch (e) {
      setError(e.data?.detail || e.message || 'Failed to load mappings');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const categories = ['all', 'native-app', 'dashboard-app', 'ai-tool', 'subdomain-portal'];
  const filtered = (filter === 'all' ? mappings : mappings.filter(m => m.category === filter))
    .filter(m => 
      m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const paginatedMappings = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const stage = (id, field, value) => setEdits(e => ({ ...e, [id]: { ...e[id], [field]: value } }));

  const saveRow = async (m) => {
    const patch = edits[m.id];
    if (!patch) return;
    setSavingId(m.id);
    try {
      const updated = await adminApi.domainMappings.update(m.id, patch);
      setMappings(ms => ms.map(x => x.id === m.id ? updated : x));
      setEdits(e => { const c = { ...e }; delete c[m.id]; return c; });
    } catch (e) {
      setError(e.data?.detail || e.message || 'Save failed');
    } finally {
      setSavingId(null);
    }
  };

  const toggleEnabled = async (m) => {
    setSavingId(m.id);
    try {
      const updated = await adminApi.domainMappings.update(m.id, { enabled: !m.enabled });
      setMappings(ms => ms.map(x => x.id === m.id ? updated : x));
    } catch (e) {
      setError(e.data?.detail || e.message || 'Toggle failed');
    } finally {
      setSavingId(null);
    }
  };

  const deleteRow = async (m) => {
    if (!window.confirm(`Delete mapping for "${m.label}"?`)) return;
    try {
      await adminApi.domainMappings.remove(m.id);
      setMappings(ms => ms.filter(x => x.id !== m.id));
    } catch (e) {
      setError(e.data?.detail || e.message || 'Delete failed');
    }
  };

  const addRow = async () => {
    if (!newMap.key || !newMap.label || !newMap.path || !newMap.subdomain) {
      setError('Key, Label, Path, and Subdomain are required.');
      return;
    }
    try {
      const created = await adminApi.domainMappings.create(newMap);
      setMappings(ms => [...ms, created]);
      setNewMap({ key: '', label: '', category: 'dashboard-app', path: '', subdomain: '' });
      setShowAdd(false);
      setCurrentPage(1);
    } catch (e) {
      setError(e.data?.detail || e.message || 'Create failed');
    }
  };

  if (sessionUser?.role !== 'admin') {
    return (
      <div className="dashboard-card">
        <PanelHeader title="Domain Mappings" desc="Admin-only  -  your account does not have access." />
        <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
          <RiLockFill size={28} style={{ color: '#475569', marginBottom: '10px' }} />
          <p>You need the <strong style={{ color: '#f1f5f9' }}>admin</strong> role to manage domain mappings.</p>
          <button
            className="btn-primary"
            style={{ marginTop: '12px', padding: '10px 18px', fontSize: '12px', fontWeight: 700 }}
            data-testid="become-admin-btn"
            onClick={async () => {
              try {
                await adminApi.becomeAdmin();
              } catch (e) {
                console.warn('API elevation failed, applying local sandbox fallback:', e);
              }
              const merged = { ...sessionUser, role: 'admin' };
              if (onUpdateUser) onUpdateUser(merged);
              sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
              window.location.reload();
            }}
          >
            Sandbox: elevate me to admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card" data-testid="domain-mappings-panel">
      <PanelHeader
        title="Domain Mappings"
        desc={`Map every route, native app, dashboard app and AI tool to a public subdomain under *.${ROOT_DOMAIN}. Changes take effect once DNS + reverse proxy pick them up.`}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => { setFilter(c); setCurrentPage(1); }}
            className={filter === c ? 'btn-primary' : 'plan-btn outline'}
            style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3px', textTransform: 'uppercase' }}
            data-testid={`mapping-filter-${c}`}
          >
            {c.replace('-', ' ')}
          </button>
        ))}
        <span style={{ marginLeft: 'auto' }} />
        <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search mappings..." />
        <button
          className="btn-primary"
          style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 700, marginLeft: '10px' }}
          onClick={() => setShowAdd(s => !s)}
          data-testid="mapping-add-toggle"
        >
          {showAdd ? 'Cancel' : '+ Add Mapping'}
        </button>
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '10px' }} data-testid="mapping-error">{error}</p>}

      {showAdd && (
        <div className="dashboard-card" style={{ marginBottom: '14px', padding: '14px', background: 'rgba(34, 211, 238, 0.04)', border: '1px solid rgba(34, 211, 238, 0.15)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <input className="form-control" placeholder="key (e.g. dashboard-app-bio)" value={newMap.key} onChange={e => setNewMap({ ...newMap, key: e.target.value })} data-testid="mapping-new-key" />
            <input className="form-control" placeholder="Label" value={newMap.label} onChange={e => setNewMap({ ...newMap, label: e.target.value })} data-testid="mapping-new-label" />
            <select className="form-control" value={newMap.category} onChange={e => setNewMap({ ...newMap, category: e.target.value })} data-testid="mapping-new-category">
              <option value="native-app">native-app</option>
              <option value="dashboard-app">dashboard-app</option>
              <option value="ai-tool">ai-tool</option>
              <option value="subdomain-portal">subdomain-portal</option>
            </select>
            <input className="form-control" placeholder="/path" value={newMap.path} onChange={e => setNewMap({ ...newMap, path: e.target.value })} data-testid="mapping-new-path" />
            <input className="form-control" placeholder="subdomain" value={newMap.subdomain} onChange={e => setNewMap({ ...newMap, subdomain: e.target.value })} data-testid="mapping-new-subdomain" />
            <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 700 }} onClick={addRow} data-testid="mapping-new-save">Add</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px' }}>Loading mappings…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '10px 8px' }}>Label</th>
                <th style={{ padding: '10px 8px' }}>Category</th>
                <th style={{ padding: '10px 8px' }}>Path</th>
                <th style={{ padding: '10px 8px' }}>Subdomain</th>
                <th style={{ padding: '10px 8px' }}>Resolves to</th>
                <th style={{ padding: '10px 8px' }}>Enabled</th>
                <th style={{ padding: '10px 8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedMappings.map(m => {
                const stagedSubdomain = edits[m.id]?.subdomain ?? m.subdomain;
                const stagedLabel = edits[m.id]?.label ?? m.label;
                const dirty = edits[m.id] && Object.keys(edits[m.id]).length > 0;
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: m.enabled ? 1 : 0.55 }} data-testid={`mapping-row-${m.key}`}>
                    <td style={{ padding: '8px' }}>
                      <input
                        className="form-control"
                        value={stagedLabel}
                        onChange={(e) => stage(m.id, 'label', e.target.value)}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#f1f5f9', fontSize: '12px', padding: '6px 10px', width: '100%' }}
                        data-testid={`mapping-label-${m.key}`}
                      />
                    </td>
                    <td style={{ padding: '8px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px', fontWeight: 700 }}>{m.category}</td>
                    <td style={{ padding: '8px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '11px' }}>{m.path}</td>
                    <td style={{ padding: '8px' }}>
                      <input
                        className="form-control"
                        value={stagedSubdomain}
                        onChange={(e) => stage(m.id, 'subdomain', e.target.value)}
                        style={{ background: 'transparent', border: '1px solid rgba(34, 211, 238, 0.2)', color: 'var(--cyan)', fontSize: '12px', padding: '6px 10px', width: '100%', fontWeight: 700 }}
                        data-testid={`mapping-subdomain-${m.key}`}
                      />
                    </td>
                    <td style={{ padding: '8px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px' }}>
                      <span style={{ color: 'var(--cyan)' }}>{stagedSubdomain}</span>.{ROOT_DOMAIN}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => toggleEnabled(m)}
                        disabled={savingId === m.id}
                        className={m.enabled ? 'btn-primary' : 'plan-btn outline'}
                        style={{ padding: '5px 10px', fontSize: '10px', fontWeight: 700 }}
                        data-testid={`mapping-toggle-${m.key}`}
                      >
                        {m.enabled ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td style={{ padding: '8px', display: 'flex', gap: '6px' }}>
                      {dirty && (
                        <button
                          onClick={() => saveRow(m)}
                          disabled={savingId === m.id}
                          className="btn-primary"
                          style={{ padding: '5px 10px', fontSize: '10px', fontWeight: 700 }}
                          data-testid={`mapping-save-${m.key}`}
                        >
                          {savingId === m.id ? '…' : 'Save'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteRow(m)}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px' }}
                        data-testid={`mapping-delete-${m.key}`}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <DashboardPagination 
            currentPage={currentPage} 
            totalItems={filtered.length} 
            pageSize={pageSize} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px', lineHeight: '1.6' }}>
        Note: Updating a mapping rewrites the published DNS contract. The reverse-proxy (per <code>backend/README.md</code>) reads these mappings live  -  changes propagate within ~30 seconds. Until Phase 1.1 ships the DNS automation, the strings stored here are picked up at next deploy.
      </p>
    </div>
  );
}

function PromotedActsAdminPanel() {
  const [acts, setActs] = useState(() => getPromotedActs());
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [imageKey, setImageKey] = useState('heroMusic1');
  const [featuredTrack, setFeaturedTrack] = useState('');
  const [editingId, setEditingId] = useState(null);

  const saveActs = (updated) => {
    setActs(updated);
    localStorage.setItem('tunemavens_promoted_acts', JSON.stringify(updated));
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!name || !title || !genre || !featuredTrack) {
      alert('All fields are required.');
      return;
    }

    if (editingId) {
      const updated = acts.map(a => a.id === editingId ? { ...a, name, title, genre, imageKey, featuredTrack } : a);
      saveActs(updated);
      setEditingId(null);
      alert('Promoted act updated successfully!');
    } else {
      const newAct = {
        id: Date.now(),
        name,
        title,
        genre,
        imageKey,
        featuredTrack
      };
      saveActs([...acts, newAct]);
      alert('Promoted act added successfully!');
    }

    // Reset fields
    setName('');
    setTitle('');
    setGenre('');
    setImageKey('heroMusic1');
    setFeaturedTrack('');
  };

  const handleEdit = (act) => {
    setEditingId(act.id);
    setName(act.name);
    setTitle(act.title);
    setGenre(act.genre);
    setImageKey(act.imageKey);
    setFeaturedTrack(act.featuredTrack);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promoted act?')) {
      saveActs(acts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="dashboard-card" data-testid="promoted-acts-panel">
      <PanelHeader
        title="Promoted Acts Configurator"
        desc="Manage the featured acts promoted at first glance on the TuneStream consumer landing page."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Editor Form */}
        <div className="dashboard-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '14px', fontWeight: 'bold' }}>
            {editingId ? 'Edit Promoted Act' : 'Add New Promoted Act'}
          </h4>
          <form onSubmit={handleAddOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--mu)', display: 'block', marginBottom: '4px' }}>Artist Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--mu)', display: 'block', marginBottom: '4px' }}>Release Title (Album/EP/Single)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--mu)', display: 'block', marginBottom: '4px' }}>Genre Tag</label>
              <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} placeholder="e.g. Amapiano, Afrobeat" required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--mu)', display: 'block', marginBottom: '4px' }}>Hero Image Vibe</label>
              <select value={imageKey} onChange={e => setImageKey(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }}>
                <option value="heroMusic1">Vibe 1: Excitement Atlanta Beltline (Green)</option>
                <option value="heroMusic2">Vibe 2: Studio Production (Purple)</option>
                <option value="heroMusic3">Vibe 3: Live Performance (Teal)</option>
                <option value="heroMusic4">Vibe 4: Intimate Listening (Gold)</option>
                <option value="listenHero">Vibe 5: Consumer Audio Toggles (Teal)</option>
                <option value="distributeHero">Vibe 6: Distribution Vault (Blue)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--mu)', display: 'block', marginBottom: '4px' }}>Featured Track Title</label>
              <input type="text" value={featuredTrack} onChange={e => setFeaturedTrack(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>
                {editingId ? 'Update Promotion' : 'Promote Act'}
              </button>
              {editingId && (
                <button type="button" className="plan-btn outline" style={{ padding: '8px', fontSize: '12px' }} onClick={() => {
                  setEditingId(null);
                  setName('');
                  setTitle('');
                  setGenre('');
                  setImageKey('heroMusic1');
                  setFeaturedTrack('');
                }}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Acts Table List */}
        <div className="dashboard-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '14px', fontWeight: 'bold' }}>Current Live Promotions</h4>
          {acts.length === 0 ? (
            <p style={{ color: 'var(--mu)', fontSize: '12px', padding: '20px 0', textAlign: 'center' }}>No acts promoted yet.</p>
          ) : (
            <table className="dashboard-table" style={{ fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Release / Track</th>
                  <th>Genre</th>
                  <th>Vibe / BG</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {acts.map(act => (
                  <tr key={act.id}>
                    <td style={{ fontWeight: 'bold', color: '#fff' }}>{act.name}</td>
                    <td>
                      <div>{act.title}</div>
                      <div style={{ fontSize: '10px', color: 'var(--mu)' }}>fs: {act.featuredTrack}</div>
                    </td>
                    <td>{act.genre}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--cyan)' }}>{act.imageKey}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="plan-btn outline" style={{ padding: '2px 6px', fontSize: '10px', marginRight: '4px' }} onClick={() => handleEdit(act)}>Edit</button>
                      <button className="plan-btn outline" style={{ padding: '2px 6px', fontSize: '10px', color: '#f87171', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleDelete(act.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= SUB-PANEL: Native-App user control panels =================
// These give full editing parity with what the user does inside the native apps,
// so a TuneMavens listener or an M-Pesa POS operator can do everything from web too.
// (PanelHeader now lives in ./components/phase3.jsx alongside the panels that use it.)

function ConsumerLibraryPanel() {
  const [tracks, setTracks] = useState([
    { id: 1, title: 'Nairobi Sunset', artist: 'Aisha Okoro', source: 'purchased', cached: true },
    { id: 2, title: 'Nairobi Cyberwave (Master Multitracks)', artist: 'Kip & The Mavens', source: 'purchased', cached: true },
    { id: 3, title: 'Mombasa Midnight', artist: 'DJ Afro', source: 'streamed', cached: true },
    { id: 4, title: 'Jozi Underground', artist: 'Lerato', source: 'purchased', cached: false },
  ]);

  const [subscribedCreators] = useState([
    { id: 'kip', name: 'Kip & The Mavens', subdomain: 'kip', genre: 'Afro-Synth', url: 'http://localhost:3000/#/epk/kip' },
    { id: 'aisha', name: 'Aisha Okoro', subdomain: 'aisha', genre: 'Afrobeat & R&B', url: 'http://localhost:3000/#/epk/aisha' }
  ]);

  const [purchasedTickets] = useState([
    { id: 'tkt1', show: 'Nairobi Cyberdome', date: 'SEP 18, 2026', qr: 'TKT-849201', tier: 'VIP Pass' },
    { id: 'tkt2', show: 'London O2 Academy', date: 'OCT 04, 2026', qr: 'TKT-194028', tier: 'General Admission' }
  ]);

  const toggleCache = (id) => setTracks(ts => ts.map(t => t.id === id ? { ...t, cached: !t.cached } : t));
  const removeTrack = (id) => setTracks(ts => ts.filter(t => t.id !== id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Subscribed Creator Web Worlds Section */}
      <div className="dashboard-card">
        <PanelHeader title="My Subscribed Creator Web Worlds" desc="Creators you follow across the Intermaven Network with unified SSO access." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '12px' }}>
          {subscribedCreators.map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--cyan)' }}>{c.genre}</div>
              </div>
              <a href={c.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ background: 'var(--cyan)', color: '#000', padding: '4px 10px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 'bold', textDecoration: 'none' }}>
                Visit Web World 🌐
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Purchased Tickets & Digital Vault */}
      <div className="dashboard-card">
        <PanelHeader title="My Digital Artifacts & Tour Passes" desc="Verified ticket entry passes and multitrack WAV stem collections." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '12px' }}>
          {purchasedTickets.map(t => (
            <div key={t.id} style={{ background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '14px', borderRadius: '4px' }}>
              <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '13px' }}>🎟️ {t.show}</div>
              <div style={{ fontSize: '11px', color: 'var(--mu)', marginTop: '2px' }}>{t.date} • {t.tier}</div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--cyan)', fontWeight: 'bold', fontFamily: 'monospace' }}>Pass Code: {t.qr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TuneStream Playlists & Audio Tracks */}
      <div className="dashboard-card">
        <PanelHeader title="TuneStream Saved Playlists & Audio Vault" desc="Manage offline cached audio and TuneStream playlists." />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '12px' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '10px 8px' }}>Track</th>
              <th style={{ padding: '10px 8px' }}>Artist</th>
              <th style={{ padding: '10px 8px' }}>Source</th>
              <th style={{ padding: '10px 8px' }}>Offline cache</th>
              <th style={{ padding: '10px 8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} data-testid={`library-row-${t.id}`}>
                <td style={{ padding: '10px 8px', color: '#f1f5f9' }}>{t.title}</td>
                <td style={{ padding: '10px 8px', color: '#cbd5e1' }}>{t.artist}</td>
                <td style={{ padding: '10px 8px', color: '#94a3b8', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>{t.source}</td>
                <td style={{ padding: '10px 8px' }}>
                  <button onClick={() => toggleCache(t.id)} className="plan-btn outline" style={{ padding: '4px 10px', fontSize: '11px' }} data-testid={`library-cache-${t.id}`}>
                    {t.cached ? 'Cached ✓' : 'Cache'}
                  </button>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button onClick={() => removeTrack(t.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px' }} data-testid={`library-remove-${t.id}`}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '11px', color: '#64748b', marginTop: '14px' }}>Storage used: 1.4 GB / 8 GB</p>
      </div>

    </div>
  );
}

function ConsumerTipsPanel() {
  const [defaultTip, setDefaultTip] = useState(2);
  const history = [
    { id: 1, to: 'Aisha Okoro', amount: 5, date: '2026-06-28', kind: 'tip' },
    { id: 2, to: 'Caleb', amount: 2, date: '2026-06-26', kind: 'tip' },
    { id: 3, to: 'DJ Afro', amount: 12.99, date: '2026-06-20', kind: 'purchase' },
  ];
  return (
    <div className="dashboard-card">
      <PanelHeader title="Tips & Purchases" desc="Configure your default tip amount and review what you've sent through the Compensation Engine." />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '12px', color: '#94a3b8' }}>Default tip (USD)</label>
        {[1, 2, 5, 10].map(v => (
          <button key={v} onClick={() => setDefaultTip(v)} className={defaultTip === v ? 'btn-primary' : 'plan-btn outline'} style={{ padding: '6px 14px', fontSize: '12px' }} data-testid={`tip-default-${v}`}>${v}</button>
        ))}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {history.map(h => (
          <li key={h.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
            <span style={{ color: '#f1f5f9' }}>{h.kind === 'tip' ? '💸 Tip to' : '🛒 Purchase from'} <strong>{h.to}</strong></span>
            <span style={{ color: '#94a3b8' }}>${h.amount.toFixed(2)} · {h.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConsumerStreamControlsPanel() {
  const [quality, setQuality] = useState('hq');
  const [dataSaver, setDataSaver] = useState(false);
  const [crossfade, setCrossfade] = useState(4);
  const devices = [
    { id: 1, name: 'iPhone 15 · Aisha', last: '2 min ago', active: true },
    { id: 2, name: 'Pixel 9 · field unit', last: '3 days ago', active: false },
  ];
  return (
    <div className="dashboard-card">
      <PanelHeader title="Player & Devices" desc="Tune the streaming experience and review which devices are signed in to your account." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Default playback quality</label>
          <select value={quality} onChange={(e) => setQuality(e.target.value)} className="form-control" style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px' }} data-testid="stream-quality-select">
            <option value="standard">Standard · 128 kbps</option>
            <option value="hq">HQ · 320 kbps</option>
            <option value="lossless">Lossless · FLAC</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Crossfade (seconds)</label>
          <input type="range" min="0" max="12" value={crossfade} onChange={(e) => setCrossfade(Number(e.target.value))} style={{ width: '100%' }} data-testid="stream-crossfade-range" />
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{crossfade}s</span>
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1', marginBottom: '20px' }}>
        <input type="checkbox" checked={dataSaver} onChange={(e) => setDataSaver(e.target.checked)} data-testid="stream-data-saver" />
        Data-saver mode (cap streaming at 96 kbps on cellular)
      </label>
      <h4 style={{ fontSize: '13px', color: '#f1f5f9', margin: '20px 0 10px' }}>Signed-in devices</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {devices.map(d => (
          <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#f1f5f9' }}>{d.name}</span>
              <span style={{ color: '#64748b', fontSize: '11px', marginLeft: '10px' }}>{d.last}</span>
            </div>
            <button className="plan-btn outline" style={{ padding: '6px 12px', fontSize: '11px' }} data-testid={`stream-device-revoke-${d.id}`}>{d.active ? 'Sign out' : 'Removed'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PosInventoryPanel() {
  const [items, setItems] = useState([
    { id: 1, sku: 'TSH-BLK-M', name: 'Tour T-shirt (Black, M)', price: 24.99, stock: 42 },
    { id: 2, sku: 'VNL-NS-01', name: 'Nairobi Sunset Vinyl', price: 39.99, stock: 8 },
    { id: 3, sku: 'TKT-VIP', name: 'VIP Ticket', price: 89.99, stock: 16 },
    { id: 4, sku: 'TSH-WHT-L', name: 'Tour T-shirt (White, L)', price: 24.99, stock: 15 },
    { id: 5, sku: 'VNL-LL-02', name: 'Lagos Lights Vinyl', price: 34.99, stock: 3 },
    { id: 6, sku: 'TKT-GEN', name: 'General Admission Ticket', price: 29.99, stock: 150 },
    { id: 7, sku: 'CAP-BLK-OS', name: 'TuneMavens Black Cap', price: 19.99, stock: 25 }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const adjustStock = (id, delta) => setItems(its => its.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i));

  const filtered = items.filter(i => 
    i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <PanelHeader title="POS Inventory" desc="Manage SKUs, prices, and live stock counts for the M-Pesa POS app. Updates sync to every paired device." />
        <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search inventory..." />
      </div>
      
      {filtered.length === 0 ? (
        <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '24px' }}>No inventory items matched your search query.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={{ padding: '10px 8px' }}>SKU</th>
                <th style={{ padding: '10px 8px' }}>Item</th>
                <th style={{ padding: '10px 8px' }}>Price</th>
                <th style={{ padding: '10px 8px' }}>Stock</th>
                <th style={{ padding: '10px 8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(i => (
                <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }} data-testid={`pos-item-row-${i.id}`}>
                  <td style={{ padding: '10px 8px', color: '#cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}>{i.sku}</td>
                  <td style={{ padding: '10px 8px', color: '#f1f5f9' }}>{i.name}</td>
                  <td style={{ padding: '10px 8px', color: '#cbd5e1' }}>${i.price.toFixed(2)}</td>
                  <td style={{ padding: '10px 8px', color: i.stock < 10 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>{i.stock}</td>
                  <td style={{ padding: '10px 8px', display: 'flex', gap: '6px' }}>
                    <button className="plan-btn outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => adjustStock(i.id, -1)} data-testid={`pos-stock-dec-${i.id}`}>âˆ’</button>
                    <button className="plan-btn outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => adjustStock(i.id, +1)} data-testid={`pos-stock-inc-${i.id}`}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <DashboardPagination 
            currentPage={currentPage} 
            totalItems={filtered.length} 
            pageSize={pageSize} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      )}
    </div>
  );
}

function PosSettlementPanel() {
  const [reports, setReports] = useState([
    { id: 1, event: 'Nairobi Live · Carnivore', date: '2026-06-28', gross: 12450, net: 11205, method: 'M-Pesa STK' },
    { id: 2, event: 'Lagos Underground · Hard Rock', date: '2026-06-15', gross: 8910, net: 8019, method: 'Flutterwave' },
    { id: 3, event: 'Joburg Showcase · Carfax', date: '2026-06-08', gross: 5630, net: 5067, method: 'Stripe Terminal' },
    { id: 4, event: 'Kampala Groove · Wave Lounge', date: '2026-05-24', gross: 4200, net: 3780, method: 'M-Pesa STK' },
    { id: 5, event: 'Accra Session · Alliance Francaise', date: '2026-05-18', gross: 6150, net: 5535, method: 'Stripe Terminal' },
    { id: 6, event: 'London Showcase · O2 Academy', date: '2026-04-30', gross: 15400, net: 13860, method: 'Stripe Terminal' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = reports.filter(r => 
    r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedReports = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <PanelHeader title="POS Settlement Reports" desc="Per-event settlements fire the Compensation Engine cascade  -  artist + manager + label shares settle within 24h." />
        <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search reports..." />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '24px' }}>No settlement reports match your search query.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {paginatedReports.map(r => (
              <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: '3px solid var(--cyan)', marginBottom: '8px', background: 'rgba(255,255,255,0.02)' }} data-testid={`pos-report-${r.id}`}>
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>{r.event}</div>
                  <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{r.date} · {r.method}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#10b981', fontWeight: 800, fontSize: '15px' }}>${r.net.toLocaleString()}</div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>gross ${r.gross.toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
          <DashboardPagination 
            currentPage={currentPage} 
            totalItems={filtered.length} 
            pageSize={pageSize} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      )}
    </div>
  );
}

function PosDevicesPanel() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Tour Phone 01', country: 'KE', rail: 'M-Pesa STK', online: true, lastTx: '4 min ago' },
    { id: 2, name: 'Tour Phone 02', country: 'KE', rail: 'M-Pesa STK', online: true, lastTx: '12 min ago' },
    { id: 3, name: 'Lagos Tablet', country: 'NG', rail: 'Flutterwave', online: false, lastTx: '2 days ago' },
    { id: 4, name: 'Backup Phone 03', country: 'ZA', rail: 'Stripe Terminal', online: false, lastTx: '3 days ago' },
    { id: 5, name: 'Atlanta Register', country: 'US', rail: 'Stripe Terminal', online: true, lastTx: '1 hour ago' },
    { id: 6, name: 'London Tablet 02', country: 'GB', rail: 'Stripe Terminal', online: false, lastTx: '1 week ago' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const wipe = (id) => {
    if (window.confirm('Remote-wipe this device? It will be signed out and all cached data cleared.')) {
      setDevices(ds => ds.filter(d => d.id !== id));
      setCurrentPage(1);
    }
  };

  const filtered = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.rail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedDevices = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <PanelHeader title="POS Devices" desc="Provision new POS devices, monitor liveness, and remote-wipe lost units." />
        <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search devices..." />
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '24px' }}>No paired devices match your search query.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {paginatedDevices.map(d => (
              <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '6px', background: 'rgba(255,255,255,0.02)' }} data-testid={`pos-device-${d.id}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.online ? '#10b981' : '#475569', boxShadow: d.online ? '0 0 8px rgba(16,185,129,0.6)' : 'none' }} />
                  <div>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '13px' }}>{d.name}</div>
                    <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{d.country} · {d.rail} · last tx {d.lastTx}</div>
                  </div>
                </div>
                <button onClick={() => wipe(d.id)} className="plan-btn outline" style={{ padding: '6px 12px', fontSize: '11px', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} data-testid={`pos-device-wipe-${d.id}`}>Remote wipe</button>
              </li>
            ))}
          </ul>
          <DashboardPagination 
            currentPage={currentPage} 
            totalItems={filtered.length} 
            pageSize={pageSize} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      )}
      <button className="btn-primary" style={{ marginTop: '14px', padding: '10px 16px', fontSize: '12px', fontWeight: 700 }} onClick={() => alert('Device provisioning flow opens in a modal  -  Phase 2 deliverable.')} data-testid="pos-device-add">+ Provision new device</button>
    </div>
  );
}

// ================= SUB-PANEL: Admin / Creator Profile Settings =================
function ProfileSettingsPanel({ sessionUser, onUpdateUser }) {
  const [name, setName] = useState(sessionUser?.name || '');
  const [email, setEmail] = useState(sessionUser?.email || '');
  const [brandName, setBrandName] = useState(sessionUser?.brand_name || '');
  const [country, setCountry] = useState(sessionUser?.country || 'KE');
  const [bio, setBio] = useState(sessionUser?.bio || 'Independent creator on the TuneMavens and Intermaven network.');
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Sync inputs whenever sessionUser updates
  useEffect(() => {
    if (sessionUser) {
      if (sessionUser.name !== undefined) setName(sessionUser.name || '');
      if (sessionUser.email !== undefined) setEmail(sessionUser.email || '');
      if (sessionUser.brand_name !== undefined) setBrandName(sessionUser.brand_name || '');
      if (sessionUser.country !== undefined) setCountry(sessionUser.country || 'KE');
      if (sessionUser.bio !== undefined) setBio(sessionUser.bio || '');
    }
  }, [sessionUser?.name, sessionUser?.email, sessionUser?.brand_name, sessionUser?.country, sessionUser?.bio]);

  // Query latest user profile from MongoDB on mount
  useEffect(() => {
    let active = true;
    const fetchLatestProfile = async () => {
      setLoadingProfile(true);
      try {
        const token = tokenStore?.get() || localStorage.getItem('tunemavens_token');
        const res = await fetch('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (res.ok && active) {
          const data = await res.json();
          if (data && active) {
            if (data.name) setName(data.name);
            if (data.email) setEmail(data.email);
            if (data.brand_name) setBrandName(data.brand_name);
            if (data.country) setCountry(data.country);
            if (data.bio) setBio(data.bio);
            const merged = { ...(sessionUser || {}), ...data };
            sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
            localStorage.setItem('tunemavens_saved_user', JSON.stringify(merged));
            if (typeof onUpdateUser === 'function') onUpdateUser(merged);
          }
        }
      } catch (err) {
        console.warn('Could not refresh user profile from backend:', err);
      } finally {
        if (active) setLoadingProfile(false);
      }
    };
    fetchLatestProfile();
    return () => { active = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      brand_name: brandName.trim(),
      country,
      bio: bio.trim()
    };

    try {
      const token = tokenStore?.get() || localStorage.getItem('tunemavens_token');
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      let updatedUserData = { ...(sessionUser || {}), ...payload };
      if (res.ok) {
        const data = await res.json();
        updatedUserData = { ...(sessionUser || {}), ...data };
      }

      // Persist across sessions so settings survive logout/login
      sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedUserData));
      localStorage.setItem('tunemavens_saved_user', JSON.stringify(updatedUserData));
      localStorage.setItem('tunemavens_user', JSON.stringify(updatedUserData));

      if (typeof onUpdateUser === 'function') {
        onUpdateUser(updatedUserData);
      }
      alert('Profile settings saved and persisted successfully across sessions!');
    } catch (err) {
      console.warn('Backend user profile update error:', err);
      const fallbackData = { ...(sessionUser || {}), ...payload };
      sessionStorage.setItem('tunemavens_session', JSON.stringify(fallbackData));
      localStorage.setItem('tunemavens_saved_user', JSON.stringify(fallbackData));
      if (typeof onUpdateUser === 'function') {
        onUpdateUser(fallbackData);
      }
      alert('Profile settings saved locally.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>Profile &amp; Account Settings</h3>
      <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '20px' }}>Update your creator identity and public brand metadata.</p>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px' }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Brand / Label Name</label>
            <input 
              type="text" 
              value={brandName} 
              onChange={(e) => setBrandName(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Region / Country</label>
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px' }}
            >
              <option value="KE">Kenya (Nairobi)</option>
              <option value="US">United States (Atlanta)</option>
              <option value="GB">United Kingdom (London)</option>
              <option value="NG">Nigeria (Lagos)</option>
              <option value="ZA">South Africa (Johannesburg)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Creator Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            className="form-control"
            style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '10px', height: '100px', resize: 'none' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="btn-primary" 
          style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
        >
          {saving ? 'Saving changes...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

// ================= SUB-PANEL: EPK Builder (Wizard) =================
function EPKBuilderPanel({ tracks, epk, setEpk, sessionUser, setActiveTab, activeArtist, onSelectArtist }) {
  const [portedAsset, setPortedAsset] = useState(() => sessionStorage.getItem('ported_asset_url'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>
            Intermaven Creator Web World Builder
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--mu)', margin: '4px 0 0' }}>
            Build your full Electronic Press Kit &amp; standalone creator site, step by step.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <ArtistRosterSelector
            activeSubdomain={activeArtist?.subdomain || epk?.subdomain || 'ndufo'}
            onSelectArtist={(artist) => {
              if (typeof onSelectArtist === 'function') {
                onSelectArtist(artist);
              } else if (typeof setEpk === 'function') {
                setEpk(prev => ({
                  ...prev,
                  subdomain: artist.subdomain,
                  artist_name: artist.name,
                  themeGenre: artist.genre || prev?.themeGenre
                }));
              }
            }}
            compact={true}
          />
          <button
            type="button"
            onClick={() => {
              if (typeof setActiveTab === 'function') {
                setActiveTab('cms');
              } else {
                window.location.hash = '#/cms';
              }
            }}
            style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#0f172a',
              background: '#00f0ff',
              padding: '6px 12px',
              borderRadius: '3px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
            title="Access Mother CMS Studio"
          >
            <RiLayoutMasonryFill size={13} />
            <span>CMS Studio</span>
          </button>
          {(() => {
            const activeSub = (epk?.subdomain && epk.subdomain !== 'aisha' ? epk.subdomain : null) || (typeof localStorage !== 'undefined' ? localStorage.getItem('last_saved_epk_subdomain') : null) || 'ndufo';
            return (
              <a
                href={`/#/epk/${activeSub}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '10px', fontWeight: 'bold', color: '#00f0ff', background: 'rgba(0,240,255,0.1)', padding: '5px 10px', borderRadius: '3px', textDecoration: 'none', border: '1px solid rgba(0,240,255,0.3)' }}
              >
                Preview Live EPK
              </a>
            );
          })()}
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--cyan)', background: 'rgba(34,211,238,0.08)', padding: '4px 8px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Wizard v3.0
          </span>
        </div>
      </div>

      {/* Ported asset notice */}
      {portedAsset && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', padding: '12px 18px', borderRadius: '4px' }}>
          <div style={{ flex: 1, fontSize: '12.5px', color: '#cbd5e1' }}>
            <strong>Ported Asset Detected:</strong> You have generated artwork ready from Social AI Studio.
          </div>
          <button type="button" onClick={() => setPortedAsset(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer' }}>
            Dismiss
          </button>
        </div>
      )}

      {/* The wizard */}
      <EpkWizard tracks={tracks} epk={epk} setEpk={setEpk} sessionUser={sessionUser} activeArtist={activeArtist} />
    </div>
  );
}

// Backward-compatible hoisted panel aliases
function OverviewPanel(props) {
  return <DashboardHome {...props} />;
}
function SplitsCascadePanel(props) {
  return <SplitCascadePanel {...props} />;
}
function SyncMarketplacePanel(props) {
  return <SyncLicensingPanel {...props} />;
}

// ================= SUB-PANEL: Overview Home =================
function DashboardHome({ sessionUser, userCredits, payoutBalance, setUserCredits, setActiveTab }) {
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, text: "Catalog CSV Validation 'Release_Nairobi_Standard.csv' passed", time: "2 hours ago", icon: "✓", type: "success" },
    { id: 2, text: "Royalty split cascade processed for track 'Nairobi Sunset'", time: "4 hours ago", icon: "💰", type: "info" },
    { id: 3, text: "DJ Pool download recorded: 'Neon Shadows (Extended Mix)'", time: "1 day ago", icon: "🎵", type: "info" }
  ]);

  const handleBuyCredits = () => {
    setUserCredits(prev => prev + 250);
    alert('Mock credit package purchased successfully! Added 250 credits to your sandbox account.');
    setRecentActivities(prev => [
      { id: Date.now(), text: "Purchased 250 credit sandbox package", time: "Just now", icon: "💳", type: "success" },
      ...prev
    ]);
  };

  // Get data sets specific to each user role
  const getRoleSpecificData = () => {
    const role = sessionUser?.role || 'creator';
    switch (role) {
      case 'label':
        return {
          title: "Label Analytics Console",
          statLabel: "Gross Roster Earnings",
          statValue: "$12,450.00",
          statTrend: "↗ +$1,120.00 this month",
          stat2Label: "Active Roster Artists",
          stat2Value: "18 Creators",
          stat2Trend: "↗ 2 signed this week",
          chartTitle: "Monthly Roster Revenue Trend ($)",
          chartPoints: [2200, 3400, 5800, 7200, 9500, 12450],
          chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          detailsTitle: "Roster Share Breakdown",
          detailsItems: [
            { label: "Aisha Okoro", val: "60% ($7,470)", color: "var(--cyan)" },
            { label: "Caleb", val: "20% ($2,490)", color: "#8b5cf6" },
            { label: "DJ Afro", val: "20% ($2,490)", color: "#10b981" }
          ]
        };
      case 'dj':
        return {
          title: "DJ Ingest & Download Console",
          statLabel: "Total Track Downloads",
          statValue: "467 Mixes",
          statTrend: "↗ +120 downloads this week",
          stat2Label: "Cleared Drops",
          stat2Value: "42 Gigs",
          stat2Trend: "✨ 100% IP clearance compliance",
          chartTitle: "Monthly DJ Mix Downloads",
          chartPoints: [45, 90, 150, 220, 310, 467],
          chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          detailsTitle: "Audio Format Distribution",
          detailsItems: [
            { label: "MP3-320", val: "70%", color: "var(--cyan)" },
            { label: "WAV", val: "30%", color: "#8b5cf6" }
          ]
        };
      case 'studio':
      case 'supervisor':
        return {
          title: "Sync Licensing Supervisor Console",
          statLabel: "Licensing Budget Spent",
          statValue: "$24,500.00",
          statTrend: "↘ -$2,500.00 remaining",
          stat2Label: "Licensed Sync Tracks",
          stat2Value: "14 Syncs",
          stat2Trend: "↗ 3 licensed this month",
          chartTitle: "Monthly Sync Project spent ($)",
          chartPoints: [3000, 7000, 12000, 16000, 20000, 24500],
          chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          detailsTitle: "Active Sync Project Briefs",
          detailsItems: [
            { label: "Action Film Promo", val: "50% (5 syncs)", color: "var(--cyan)" },
            { label: "Beer Commercial", val: "30% (2 syncs)", color: "#8b5cf6" },
            { label: "Gaming Trailer", val: "20% (completed)", color: "#10b981" }
          ]
        };
      case 'consumer':
        return {
          title: "Listener Experience Dashboard",
          statLabel: "Listening Playtime",
          statValue: "72 Hours",
          statTrend: "↗ +14 hours this week",
          stat2Label: "Liked Tracks",
          stat2Value: "128 Songs",
          stat2Trend: "↗ 15 added this month",
          chartTitle: "Monthly Stream Hours Trend",
          chartPoints: [12, 24, 38, 48, 60, 72],
          chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          detailsTitle: "Genre Playtime Distribution",
          detailsItems: [
            { label: "Afro-House", val: "50%", color: "var(--cyan)" },
            { label: "Amapiano", val: "50%", color: "#8b5cf6" }
          ]
        };
      case 'creator':
      default:
        return {
          title: "Creator Analytics Dashboard",
          statLabel: "Royalty Split Payouts",
          statValue: `$${payoutBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          statTrend: "↗ +$340.20 this week",
          stat2Label: "Active Releases",
          stat2Value: "24 Releases",
          stat2Trend: "🗄️ Standard Schema Compliant",
          chartTitle: "Monthly Earnings Progress ($)",
          chartPoints: [1200, 1800, 2500, 3100, 3900, payoutBalance],
          chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          detailsTitle: "Catalog Genre Breakdown",
          detailsItems: [
            { label: "Afro-House", val: "40% (10 tracks)", color: "var(--cyan)" },
            { label: "Deep-House", val: "30% (7 tracks)", color: "#8b5cf6" },
            { label: "Amapiano", val: "20% (5 tracks)", color: "#10b981" },
            { label: "Afrobeats", val: "10% (2 tracks)", color: "#f59e0b" }
          ]
        };
    }
  };

  const data = getRoleSpecificData();

  // SVG Area Chart Calculations
  const points = data.chartPoints;
  const maxVal = Math.max(...points) || 100;
  const minVal = 0;
  const range = maxVal;
  
  const svgWidth = 500;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 20;
  
  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;
  
  const svgPoints = points.map((val, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (val / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${paddingX},${paddingY + chartHeight} ${svgPoints} ${paddingX + chartWidth},${paddingY + chartHeight}`;

  return (
    <div>
      <div className="dashboard-panel-header">
        <h2 style={{ fontSize: '20px', fontWeight: '800', textTransform: 'capitalize', letterSpacing: '0.5px' }}>Dashboard</h2>
        <p style={{ fontSize: '13px', color: 'var(--mu)', marginTop: '4px' }}>
          Welcome back, {sessionUser.name || 'Creator'}! Managing {data.title}.
        </p>
      </div>

      <div className="dashboard-grid-3">
        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="stat-label">AI Credit Balance</div>
            <div className="stat-value">{userCredits} Credits</div>
            <div className="stat-trend">✨ Sandbox Wallet Active</div>
          </div>
          <button 
            onClick={handleBuyCredits} 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '6px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Buy 250 Credits
          </button>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="stat-label">{data.statLabel}</div>
            <div className="stat-value">{data.statValue}</div>
            <div className="stat-trend">{data.statTrend}</div>
          </div>
          <button 
            onClick={() => {
              if (sessionUser?.role === 'dj') setActiveTab('djpool');
              else if (sessionUser?.role === 'studio' || sessionUser?.role === 'supervisor') setActiveTab('sync');
              else if (sessionUser?.role === 'consumer') setActiveTab('profile');
              else setActiveTab('splits');
            }} 
            className="plan-btn outline" 
            style={{ width: '100%', marginTop: '16px', padding: '6px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          >
            Manage Operations
          </button>
        </div>

        <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="stat-label">{data.stat2Label}</div>
            <div className="stat-value">{data.stat2Value}</div>
            <div className="stat-trend" style={{ color: 'var(--cyan)' }}>{data.stat2Trend}</div>
          </div>
          <button 
            onClick={() => {
              if (sessionUser?.role === 'dj') setActiveTab('djpool');
              else if (sessionUser?.role === 'studio' || sessionUser?.role === 'supervisor') setActiveTab('escrow');
              else if (sessionUser?.role === 'consumer') setActiveTab('profile');
              else setActiveTab('catalog');
            }} 
            className="plan-btn outline" 
            style={{ width: '100%', marginTop: '16px', padding: '6px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Charts and Details Segment */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '24px' }}>
        <div className="dashboard-card">
          <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff' }}>{data.chartTitle}</h3>
          
          <div style={{ position: 'relative', width: '100%', height: '180px' }}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
              <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={paddingX} y1={paddingY + chartHeight * 0.33} x2={svgWidth - paddingX} y2={paddingY + chartHeight * 0.33} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={paddingX} y1={paddingY + chartHeight * 0.66} x2={svgWidth - paddingX} y2={paddingY + chartHeight * 0.66} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1={paddingX} y1={paddingY + chartHeight} x2={svgWidth - paddingX} y2={paddingY + chartHeight} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              
              {/* Area filled path */}
              <polygon fill="url(#chartGrad)" points={areaPoints} />
              
              {/* Line path */}
              <polyline fill="none" stroke="var(--cyan)" strokeWidth="2.5" points={svgPoints} />
              
              {/* Data points dots */}
              {points.map((val, idx) => {
                const x = paddingX + (idx / (points.length - 1)) * chartWidth;
                const y = paddingY + chartHeight - (val / range) * chartHeight;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="4" fill="#060813" stroke="var(--cyan)" strokeWidth="2" />
                    <text x={x} y={y - 8} fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">
                      {val}
                    </text>
                  </g>
                );
              })}
              
              {/* X Axis Labels */}
              {data.chartLabels.map((lbl, idx) => {
                const x = paddingX + (idx / (points.length - 1)) * chartWidth;
                return (
                  <text key={idx} x={x} y={svgHeight - 4} fill="#64748b" fontSize="8" textAnchor="middle">
                    {lbl}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff' }}>{data.detailsTitle}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            {data.detailsItems.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>{item.label}</span>
                  <span style={{ fontWeight: 'bold', color: item.color }}>{item.val}</span>
                </div>
                {/* Horizontal progress bar segment */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: item.val.includes('%') ? item.val.split('%')[0] + '%' : '100%', 
                      height: '100%', 
                      background: item.color, 
                      borderRadius: '3px' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '24px' }}>
        <div className="dashboard-card">
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Ecosystem Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DJ POOL MVPs</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>WAV / MP3-320</div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Intro/Outro tag injection active.</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SYNC MARKETPLACE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>AI Mood Tagging</div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Scene tags &amp; 30s previews verified.</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ESCROW MODULE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>Appearance Booking</div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Venue checkpoint verification online.</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SPLIT CASCADE</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>Recoupment Ledger</div>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>Platform commission fixed at 10%.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Activity Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '4px', 
                  background: act.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)', 
                  color: act.type === 'success' ? '#10b981' : '#0ea5e9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '12px',
                  flexShrink: 0
                }}>
                  {act.icon}
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>{act.text}</p>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= SUB-PANEL: Catalogue Management & Ingestion Wizard =================
function CataloguePanel({ 
  setActiveTab, 
  tracks, 
  setTracks, 
  sessionUser, 
  creatorEpk, 
  collapsed, 
  onToggleSidebar, 
  onPlayTrack,
  activeArtist,
  onSelectArtist
}) {
  const [viewMode, setViewMode] = useState('manager'); // 'wizard' | 'manager'
  const [managerSubView, setManagerSubView] = useState('collections'); // 'collections' | 'table'
  const [releaseTypeFilter, setReleaseTypeFilter] = useState('all'); // 'all' | 'album' | 'ep' | 'single'
  const [expandedReleaseTitle, setExpandedReleaseTitle] = useState(null);
  
  const [selectedPreset, setSelectedPreset] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errors, setErrors] = useState([]);

  // Multi-Genre Registry Admin Modal and Cache
  const [showGenreManager, setShowGenreManager] = useState(false);
  const [genres, setGenres] = useState(DEFAULT_CANONICAL_GENRES);

  useEffect(() => {
    loadAuthoritativeGenres().then(g => {
      if (Array.isArray(g) && g.length > 0) setGenres(g);
    });
    const handleGenreUpdate = (e) => {
      if (e.detail?.genres) setGenres(e.detail.genres);
    };
    window.addEventListener('tunemavens-genres-updated', handleGenreUpdate);
    return () => window.removeEventListener('tunemavens-genres-updated', handleGenreUpdate);
  }, []);

  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [currentReleasesPage, setCurrentReleasesPage] = useState(1);
  const [releasesPageSize, setReleasesPageSize] = useState(6);

  // Single Track Uploader Form States
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState(activeArtist?.name || sessionUser?.artist_name || sessionUser?.name || 'Ndufo');
  const [newGenre, setNewGenre] = useState('Afro-fusion');
  const [newIsrc, setNewIsrc] = useState('');
  const [newArtistSplit, setNewArtistSplit] = useState(50);
  const [newProducerSplit, setNewProducerSplit] = useState(30);
  const [newLabelSplit, setNewLabelSplit] = useState(20);
  const [newCoverBg, setNewCoverBg] = useState('linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)');
  const [newCoverText, setNewCoverText] = useState('New Release');

  // File drag & drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Edit Track State
  const [editingTrack, setEditingTrack] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editRelease, setEditRelease] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editSplit, setEditSplit] = useState('');
  const [editCoverBg, setEditCoverBg] = useState('');
  const [editCoverText, setEditCoverText] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editConsumptionType, setEditConsumptionType] = useState('both'); // 'stream' | 'download' | 'both'
  const [editStreamPriceCredits, setEditStreamPriceCredits] = useState(50);
  const [editDownloadPriceCredits, setEditDownloadPriceCredits] = useState(150);

  // Entire Catalogue (All Creators) View & Sorting States
  const [viewAllCatalogue, setViewAllCatalogue] = useState(activeArtist?.subdomain === 'all');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'title_asc' | 'title_desc' | 'artist_asc' | 'artist_desc' | 'streams_desc' | 'year_desc'

  useEffect(() => {
    if (activeArtist?.subdomain === 'all') {
      setViewAllCatalogue(true);
      fetch('/api/catalog/tracks?all=true')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            const list = Array.isArray(data) ? data : (data.tracks || []);
            setTracks(list);
          }
        })
        .catch(() => {});
    }
  }, [activeArtist?.subdomain]);

  const handleToggleAllCatalogue = async () => {
    const next = !viewAllCatalogue;
    setViewAllCatalogue(next);
    setCurrentPage(1);
    setCurrentReleasesPage(1);
    try {
      if (next) {
        const res = await fetch('/api/catalog/tracks?all=true');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.tracks || []);
          setTracks(list);
        }
      } else {
        const sub = (activeArtist?.subdomain && activeArtist.subdomain !== 'all' ? activeArtist.subdomain : (sessionUser?.username || 'ndufo')).toLowerCase();
        const res = await fetch(`/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.tracks || []);
          setTracks(list);
        }
      }
    } catch (err) {
      console.warn('Failed to toggle entire catalogue:', err);
    }
  };

  // Delete Track Modal State
  const [deletingTrack, setDeletingTrack] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // EDIT ALBUM ARTWORK & TRACKS STATE
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editingAlbumTracks, setEditingAlbumTracks] = useState([]);
  const [ingestSidebarCollapsed, setIngestSidebarCollapsed] = useState(false);
  const [editingAlbumModal, setEditingAlbumModal] = useState(null);
  const [artworkModalTab, setArtworkModalTab] = useState('upload'); // 'upload' | 'ai' | 'gradient'
  const [previewArtworkUrl, setPreviewArtworkUrl] = useState('');
  const [previewCoverBg, setPreviewCoverBg] = useState('');
  const [previewCoverText, setPreviewCoverText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAiArt, setGeneratingAiArt] = useState(false);
  const [savingArtwork, setSavingArtwork] = useState(false);
  const artworkFileInputRef = useRef(null);

  // Group Tracks into Releases / Albums / EPs / Singles
  const getReleases = (trackList) => {
    const map = new Map();
    trackList.forEach(t => {
      const relName = (t.release && t.release.trim()) ? t.release.trim() : 'Standalone Singles';
      if (!map.has(relName)) {
        map.set(relName, {
          title: relName,
          artist: t.artist || sessionUser?.artist_name || 'Ndufo',
          tracks: [],
          genre: t.genre || 'Afro-House',
          year: t.year || '2024',
          coverArt: t.coverArt || t.album_art_url || '',
          coverBg: t.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          coverText: t.coverText || relName.slice(0, 10),
          releaseType: t.releaseType || ''
        });
      }
      const rel = map.get(relName);
      rel.tracks.push(t);
      if ((t.coverArt || t.album_art_url) && !rel.coverArt) {
        rel.coverArt = t.coverArt || t.album_art_url;
      }
      if (t.releaseType && !rel.releaseType) {
        rel.releaseType = t.releaseType;
      }
    });

    return Array.from(map.values()).map(r => {
      let deducedType = r.releaseType;
      if (!deducedType) {
        const lower = r.title.toLowerCase();
        if (r.tracks.length >= 7 || lower.includes('album') || lower.includes('dating')) {
          deducedType = 'Album';
        } else if (r.tracks.length >= 3 || lower.includes('ep')) {
          deducedType = 'EP';
        } else {
          deducedType = 'Single';
        }
      }
      return { ...r, releaseType: deducedType };
    });
  };

  const releases = getReleases(tracks);

  // Open Dedicated Album Editing Page (All Tracks & Artwork)
  const openAlbumEditor = (rel) => {
    setEditingAlbum({
      title: rel.title,
      artist: rel.artist || sessionUser?.artist_name || 'Ndufo',
      genre: rel.genre || 'Afro-House',
      year: rel.year || '2026',
      releaseType: rel.releaseType || 'Album',
      coverArt: rel.coverArt || rel.album_art_url || '',
      coverBg: rel.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
      coverText: rel.coverText || rel.title
    });
    setPreviewArtworkUrl(rel.coverArt || rel.album_art_url || '');
    setPreviewCoverBg(rel.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)');
    setPreviewCoverText(rel.coverText || rel.title || '');
    setAiPrompt(`Professional studio album artwork for "${rel.title}" by ${rel.artist || 'Ndufo'}, vivid, modern, high quality music cover art, 8k render`);
    setArtworkModalTab('upload');
    const relTracks = tracks.filter(t => {
      const tRel = (t.release && t.release.trim()) ? t.release.trim() : 'Standalone Singles';
      return tRel.toLowerCase() === rel.title.toLowerCase();
    });
    setEditingAlbumTracks(relTracks.length > 0 ? relTracks : [...rel.tracks]);
    setManagerSubView('album-edit');
  };

  const openArtworkModal = (rel) => {
    openAlbumEditor(rel);
  };

  // Upload Custom Artwork Handler
  const handleArtworkFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('media_type', 'image');
      formData.append('folder', 'artwork');
      const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('tunemavens_token') || '';
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        const uploadedUrl = data.url || data.asset?.media_url || '';
        if (uploadedUrl) {
          setPreviewArtworkUrl(uploadedUrl);
        } else {
          const reader = new FileReader();
          reader.onload = (ev) => setPreviewArtworkUrl(ev.target.result || '');
          reader.readAsDataURL(file);
        }
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => setPreviewArtworkUrl(ev.target.result || '');
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Upload API fallback to data URL:', err);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewArtworkUrl(ev.target.result || '');
      reader.readAsDataURL(file);
    }
  };

  // Generate AI Artwork Handler
  const handleGenerateAiArtwork = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAiArt(true);
    try {
      const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('tunemavens_token') || '';
      const res = await fetch('/api/social-ai/generate-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ prompt: aiPrompt.trim(), aspect_ratio: '1:1' })
      });
      const data = await res.json();
      if (res.ok && (data?.asset?.media_url || data?.url)) {
        setPreviewArtworkUrl(data.asset?.media_url || data.url);
      } else {
        alert(data.detail || 'AI artwork generation failed.');
      }
    } catch (err) {
      alert('AI artwork generation error: ' + (err.message || 'Unknown error'));
    } finally {
      setGeneratingAiArt(false);
    }
  };

  // Save Album Artwork Handler (updates backend releases, tracks, and local state)
  const handleSaveAlbumArtwork = async () => {
    if (!editingAlbumModal) return;
    setSavingArtwork(true);
    try {
      const sub = sessionUser?.username || 'ndufo';
      const effectiveArt = previewArtworkUrl || editingAlbumModal.coverArt || '';
      const payload = {
        albumTitle: editingAlbumModal.title,
        release_title: editingAlbumModal.title,
        artworkUrl: effectiveArt,
        artwork_url: effectiveArt,
        bg_gradient: previewCoverBg || '',
        cover_text: previewCoverText || editingAlbumModal.title || '',
        subdomain: sub
      };

      const res = await fetch('/api/catalog/albums/artwork', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server responded with status ${res.status}`);
      }

      // Update all matching tracks locally
      const updated = tracks.map(t => {
        const tRel = (t.release && t.release.trim()) ? t.release.trim() : 'Standalone Singles';
        if (tRel === editingAlbumModal.title) {
          return {
            ...t,
            coverArt: effectiveArt || t.coverArt,
            coverBg: previewCoverBg || t.coverBg,
            coverText: previewCoverText || t.coverText,
            album_art_url: effectiveArt || t.album_art_url
          };
        }
        return t;
      });

      setTracks(updated);
      try {
        localStorage.setItem('catalog_tracks', JSON.stringify(updated));
      } catch (_) {}

      setEditingAlbumModal(null);
      alert(`Artwork successfully updated for "${editingAlbumModal.title}"! All matching tracks and albums have been updated.`);
    } catch (err) {
      alert('Failed to save album artwork: ' + err.message);
    } finally {
      setSavingArtwork(false);
    }
  };

  // Full Album & Tracks Save Handler
  const handleSaveAlbumEditor = async () => {
    if (!editingAlbum) return;
    setSavingArtwork(true);
    try {
      const sub = sessionUser?.username || 'ndufo';
      const effectiveArt = previewArtworkUrl || editingAlbum.coverArt || '';
      
      // 1. Update album artwork in backend
      const payload = {
        albumTitle: editingAlbum.title,
        release_title: editingAlbum.title,
        artworkUrl: effectiveArt,
        artwork_url: effectiveArt,
        bg_gradient: previewCoverBg || '',
        cover_text: previewCoverText || editingAlbum.title || '',
        subdomain: sub
      };

      try {
        await fetch('/api/catalog/albums/artwork', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Backend artwork update warning:', err);
      }

      // 2. Map updated album tracks
      const updatedAlbumTracksMap = new Map();
      editingAlbumTracks.forEach(t => {
        updatedAlbumTracksMap.set(t.isrc, {
          ...t,
          release: editingAlbum.title,
          releaseType: editingAlbum.releaseType,
          year: editingAlbum.year,
          coverArt: effectiveArt || t.coverArt,
          coverBg: previewCoverBg || t.coverBg,
          coverText: previewCoverText || t.coverText,
          album_art_url: effectiveArt || t.album_art_url
        });
      });

      // Update full tracks list
      let updatedList = tracks.map(t => {
        if (updatedAlbumTracksMap.has(t.isrc)) {
          return updatedAlbumTracksMap.get(t.isrc);
        }
        const tRel = (t.release && t.release.trim()) ? t.release.trim() : 'Standalone Singles';
        if (tRel.toLowerCase() === editingAlbum.title.toLowerCase()) {
          return {
            ...t,
            release: editingAlbum.title,
            releaseType: editingAlbum.releaseType,
            coverArt: effectiveArt || t.coverArt,
            coverBg: previewCoverBg || t.coverBg,
            coverText: previewCoverText || t.coverText,
            album_art_url: effectiveArt || t.album_art_url
          };
        }
        return t;
      });

      // Add any newly created tracks that were added inside the editor
      editingAlbumTracks.forEach(t => {
        if (!updatedList.some(existing => existing.isrc === t.isrc)) {
          updatedList = [{
            ...t,
            release: editingAlbum.title,
            releaseType: editingAlbum.releaseType,
            year: editingAlbum.year,
            coverArt: effectiveArt,
            coverBg: previewCoverBg,
            coverText: previewCoverText,
            album_art_url: effectiveArt
          }, ...updatedList];
        }
      });

      setTracks(updatedList);
      try {
        localStorage.setItem('catalog_tracks', JSON.stringify(updatedList));
      } catch (_) {}

      // Push individual track updates to backend
      for (const t of editingAlbumTracks) {
        try {
          await fetch(`/api/catalog/tracks/${encodeURIComponent(t.isrc)}?subdomain=${encodeURIComponent(sub)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...t,
              release: editingAlbum.title,
              releaseType: editingAlbum.releaseType,
              coverArt: effectiveArt || t.coverArt,
              coverBg: previewCoverBg || t.coverBg,
              album_art_url: effectiveArt || t.album_art_url
            })
          });
        } catch (e) {
          console.warn('Track update warning:', e);
        }
      }

      alert(`Successfully saved all changes for "${editingAlbum.title}"! All tracks and artwork have been updated.`);
      setManagerSubView('collections');
    } catch (err) {
      alert('Failed to save album changes: ' + (err.message || 'Unknown error'));
    } finally {
      setSavingArtwork(false);
    }
  };

  const handleAddTrackToEditingAlbum = () => {
    if (!editingAlbum) return;
    const seq = 1000 + tracks.length + editingAlbumTracks.length + 1;
    const newTrk = {
      id: Date.now(),
      isrc: `KE-TM1-26-${String(seq).padStart(5, '0')}`,
      title: `Track ${editingAlbumTracks.length + 1}`,
      artist: editingAlbum.artist || sessionUser?.artist_name || 'Ndufo',
      release: editingAlbum.title,
      releaseType: editingAlbum.releaseType || 'Album',
      year: editingAlbum.year || '2026',
      genre: editingAlbum.genre || 'Afro-House',
      duration: '3:30',
      split: 'Artist (60%) / Producer (25%) / Label (15%)',
      status: 'valid',
      coverArt: previewArtworkUrl || editingAlbum.coverArt,
      coverBg: previewCoverBg || editingAlbum.coverBg,
      coverText: previewCoverText || editingAlbum.coverText,
      syncCleared: true,
      isFeatured: false
    };
    setEditingAlbumTracks(prev => [...prev, newTrk]);
  };

  const handleDeleteTrackFromAlbum = (indexToDelete) => {
    setEditingAlbumTracks(prev => prev.filter((_, idx) => idx !== indexToDelete));
  };

  const handleUpdateAlbumTrack = (index, field, value) => {
    setEditingAlbumTracks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };


  // Preset gradient choices
  const gradientPresets = [
    { name: 'Neon Cyber', bg: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)' },
    { name: 'Sunset Glow', bg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    { name: 'Emerald Wave', bg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' },
    { name: 'Hot Magenta', bg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
    { name: 'Midnight Onyx', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' },
    { name: 'Electric Royal', bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }
  ];

  // Filtering & Sorting Logic
  const filteredReleases = releases.filter(r => {
    const matchesType = releaseTypeFilter === 'all' || r.releaseType.toLowerCase() === releaseTypeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      r.title.toLowerCase().includes(q) ||
      r.artist.toLowerCase().includes(q) ||
      r.genre.toLowerCase().includes(q) ||
      r.tracks.some(t => t.title.toLowerCase().includes(q));
    return matchesType && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'title_desc') return (b.title || '').localeCompare(a.title || '');
    if (sortBy === 'artist_asc') return (a.artist || '').localeCompare(b.artist || '');
    if (sortBy === 'artist_desc') return (b.artist || '').localeCompare(a.artist || '');
    if (sortBy === 'year_desc') return String(b.year || '').localeCompare(String(a.year || ''));
    if (sortBy === 'streams_desc') {
      const aS = a.tracks.reduce((sum, t) => sum + (parseInt(String(t.streams || '').replace(/\D/g, '')) || 0), 0);
      const bS = b.tracks.reduce((sum, t) => sum + (parseInt(String(t.streams || '').replace(/\D/g, '')) || 0), 0);
      return bS - aS;
    }
    return 0;
  });

  const totalReleases = filteredReleases.length;
  const paginatedReleases = filteredReleases.slice((currentReleasesPage - 1) * releasesPageSize, currentReleasesPage * releasesPageSize);

  const filteredTracks = tracks.filter(t => {
    if (releaseTypeFilter !== 'all') {
      const relObj = releases.find(r => r.title === ((t.release && t.release.trim()) ? t.release.trim() : 'Standalone Singles'));
      const relType = (relObj ? relObj.releaseType : (t.releaseType || 'Single')).toLowerCase();
      if (relType !== releaseTypeFilter.toLowerCase()) return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.title || '').toLowerCase().includes(q) ||
      (t.artist || '').toLowerCase().includes(q) ||
      (t.isrc || '').toLowerCase().includes(q) ||
      (t.release || '').toLowerCase().includes(q) ||
      (t.genre || '').toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    if (sortBy === 'title_asc') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'title_desc') return (b.title || '').localeCompare(a.title || '');
    if (sortBy === 'artist_asc') return (a.artist || '').localeCompare(b.artist || '');
    if (sortBy === 'artist_desc') return (b.artist || '').localeCompare(a.artist || '');
    if (sortBy === 'year_desc') return String(b.year || '').localeCompare(String(a.year || ''));
    if (sortBy === 'streams_desc') {
      const aS = parseInt(String(a.streams || '').replace(/\D/g, '')) || 0;
      const bS = parseInt(String(b.streams || '').replace(/\D/g, '')) || 0;
      return bS - aS;
    }
    return 0;
  });

  const paginatedTracks = filteredTracks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalItems = filteredTracks.length;

  const startEdit = (tr) => {
    setEditingTrack(tr);
    setEditTitle(tr.title || '');
    setEditArtist(tr.artist || sessionUser?.artist_name || 'Ndufo');
    setEditRelease(tr.release || 'Standalone Master');
    setEditGenre(tr.genre || 'Afro-House');
    setEditSplit(tr.split || 'Artist (60%) / Producer (25%) / Label (15%)');
    setEditCoverBg(tr.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)');
    setEditCoverText(tr.coverText || tr.title?.slice(0, 8) || 'Art');
    setEditFeatured(tr.isFeatured || false);
    setEditConsumptionType(tr.consumptionType || 'both');
    setEditStreamPriceCredits(tr.streamPriceCredits ?? (tr.priceCredits || 50));
    setEditDownloadPriceCredits(tr.downloadPriceCredits ?? 150);
  };

  const saveEdit = async () => {
    if (!editingTrack) return;
    if (!editTitle.trim() || !editArtist.trim()) {
      alert('Title and Artist fields cannot be empty.');
      return;
    }

    const updatedTrack = {
      ...editingTrack,
      title: editTitle.trim(),
      artist: editArtist.trim(),
      release: editRelease.trim(),
      genre: editGenre,
      split: editSplit.trim(),
      coverBg: editCoverBg,
      coverText: editCoverText,
      isFeatured: editFeatured,
      consumptionType: editConsumptionType,
      streamPriceCredits: Number(editStreamPriceCredits) || 50,
      downloadPriceCredits: Number(editDownloadPriceCredits) || 150,
      priceCredits: Number(editStreamPriceCredits) || 50
    };

    const updatedList = tracks.map(t => t.isrc === editingTrack.isrc ? updatedTrack : t);
    setTracks(updatedList);
    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(updatedList));
    } catch (_) {}

    const sub = sessionUser?.username || 'ndufo';
    try {
      await fetch(`/api/catalog/tracks/${encodeURIComponent(editingTrack.isrc)}?subdomain=${encodeURIComponent(sub)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrack)
      });
    } catch (e) {
      console.warn('Backend track update warning:', e);
    }

    setEditingTrack(null);
  };

  const confirmDeleteTrack = async () => {
    if (!deletingTrack) return;
    setIsDeleting(true);
    const targetIsrc = deletingTrack.isrc;

    const updatedList = tracks.filter(t => t.isrc !== targetIsrc);
    setTracks(updatedList);
    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(updatedList));
    } catch (_) {}

    const sub = sessionUser?.username || 'ndufo';
    try {
      await fetch(`/api/catalog/tracks/${encodeURIComponent(targetIsrc)}?subdomain=${encodeURIComponent(sub)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Backend track delete warning:', e);
    } finally {
      setIsDeleting(false);
      setDeletingTrack(null);
    }
  };

  // Drag and Drop files
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files) => {
    setLoading(true);
    const grads = [
      'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
    ];

    const newTracksList = files.map((file, index) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const words = cleanName.split(" ").filter(Boolean);
      const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || 'Master Cue';
      const seq = 1000 + tracks.length + index + 1;
      const coverBg = grads[Math.floor(Math.random() * grads.length)];
      const coverText = title.split(' ')[0] || 'Single';

      return {
        id: Date.now() + index,
        isrc: `KE-TM1-26-${String(seq).padStart(5, '0')}`,
        title: title,
        artist: sessionUser?.artist_name || sessionUser?.name || 'Ndufo',
        release: 'Direct Master Ingest',
        releaseType: 'Single',
        year: '2026',
        split: 'Artist (60%) / Producer (25%) / Label (15%)',
        publishingSplit: 'Writer (50%) / Publisher (50%)',
        distributionSplit: 'Artist (60%) / Producer (25%) / Label (15%)',
        genre: 'Afro-House',
        duration: '3:30',
        status: 'valid',
        syncCleared: true,
        isFeatured: index === 0,
        coverBg,
        coverText
      };
    });

    const mergedTracks = [...newTracksList, ...tracks];
    setTracks(mergedTracks);
    setUploadedFiles(prev => [...files.map(f => f.name), ...prev]);
    setCurrentPage(1);

    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(mergedTracks));
    } catch (_) {}

    const sub = sessionUser?.username || 'ndufo';
    for (const tr of newTracksList) {
      try {
        await fetch(`/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tr)
        });
      } catch (err) {}
    }

    setLoading(false);
    alert(`Successfully ingested ${files.length} audio file(s) into your catalogue!`);
  };

  const handleValidate = async () => {
    setLoading(true);
    setValidationResult(null);
    setErrors([]);

    if (selectedPreset === 'standard') {
      setValidationResult('pass');
      const standardTracks = [
        { id: Date.now() + 1, isrc: 'US-123-45678', title: 'Midnight Grooves', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (30%) / Label (20%)', genre: 'Afro-House', status: 'valid', coverBg: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', coverText: 'Midnight', isFeatured: true },
        { id: Date.now() + 2, isrc: 'US-123-45679', title: 'Neon Shadows', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Deep-House', status: 'valid', coverBg: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)', coverText: 'Shadows', isFeatured: false },
        { id: Date.now() + 3, isrc: 'US-123-45680', title: 'Nairobi Sunset', artist: 'Aisha Okoro', split: 'Artist (40%) / Label (60%)', genre: 'Amapiano', status: 'valid', coverBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', coverText: 'Sunset', isFeatured: true },
        { id: Date.now() + 4, isrc: 'US-123-45681', title: 'Kilimanjaro Vibe', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Afrobeats', status: 'valid', coverBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', coverText: 'Vibe', isFeatured: false }
      ];
      const existingIsrcs = tracks.map(t => t.isrc);
      const filteredNew = standardTracks.filter(t => !existingIsrcs.includes(t.isrc));
      const updatedList = [...filteredNew, ...tracks];
      setTracks(updatedList);
      try {
        localStorage.setItem('catalog_tracks', JSON.stringify(updatedList));
      } catch (_) {}

      const sub = sessionUser?.username || 'ndufo';
      for (const tr of filteredNew) {
        try {
          await fetch(`/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tr)
          });
        } catch (_) {}
      }
      setCurrentPage(1);
    } else {
      setValidationResult('fail');
      setErrors([
        "Row 3: ISRC 'US- sunset-80' format invalid. Must match standard format (XX-XXX-XX-XXXXX).",
        "Row 2: Primary artist field cannot be blank for 'Neon Shadows'.",
        "Row 4: Split configuration total must sum to 100%. Currently sums to 80%."
      ]);
    }
    setLoading(false);
  };

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!newTitle || !newArtist || !newIsrc) {
      alert('Title, Artist, and ISRC are required.');
      return;
    }

    const newTrack = {
      id: Date.now(),
      isrc: newIsrc.trim(),
      title: newTitle.trim(),
      artist: newArtist.trim(),
      release: 'Standalone Master',
      split: `Artist (${newArtistSplit}%) / Producer (${newProducerSplit}%) / Label (${newLabelSplit}%)`,
      publishingSplit: 'Writer (50%) / Publisher (50%)',
      distributionSplit: `Artist (${newArtistSplit}%) / Producer (${newProducerSplit}%) / Label (${newLabelSplit}%)`,
      genre: newGenre,
      status: 'valid',
      coverBg: newCoverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
      coverText: newCoverText || 'Art',
      syncCleared: true,
      isFeatured: false
    };

    const updatedList = [newTrack, ...tracks];
    setTracks(updatedList);
    try {
      localStorage.setItem('catalog_tracks', JSON.stringify(updatedList));
    } catch (_) {}

    const sub = sessionUser?.username || 'ndufo';
    try {
      await fetch(`/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrack)
      });
    } catch (err) {}

    setNewTitle('');
    setNewIsrc('');
    setNewCoverText('New Release');
    setCurrentPage(1);
    alert('Track manually added to catalogue successfully!');
  };

  return (
    <div>
      {/* Top Header Bar with Mode Toggles and Sidebar Collapse */}
      <div style={{
        background: '#0a0f1d',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '6px',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Sidebar Collapse Toggle Button within Catalogue Manager */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                padding: '7px 12px',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              title={collapsed ? "Expand sidebar navigation" : "Collapse sidebar navigation"}
            >
              {collapsed ? <RiArrowRightSFill size={16} /> : <RiArrowLeftSFill size={16} />}
              <span>{collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
            </button>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiDiscLine size={20} color="var(--cyan)" />
              <h2
                onClick={() => { setManagerSubView('collections'); setEditingAlbum(null); setEditingTrack(null); setViewMode('manager'); }}
                title="Click to return to Catalogue Overview"
                style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0, cursor: 'pointer', transition: 'color 0.15s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#00f0ff'}
                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
              >
                Catalogue Manager
              </h2>
              <span style={{
                background: 'rgba(0, 240, 255, 0.15)',
                color: '#00f0ff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '3px'
              }}>
                {tracks.length} Tracks • {releases.length} Releases
              </span>
            </div>
            {/* Breadcrumb Navigation when inside track or album entry */}
            {(managerSubView === 'album-edit' || editingTrack) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', marginTop: '3px', color: '#94a3b8' }}>
                <span
                  onClick={() => { setManagerSubView('collections'); setEditingAlbum(null); setEditingTrack(null); setViewMode('manager'); }}
                  style={{ color: '#00f0ff', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                  title="Return to Catalogue Overview"
                >
                  Catalogue Overview
                </span>
                <span>/</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>
                  {editingAlbum ? editingAlbum.title : (editingTrack ? editingTrack.title : 'Entry Details')}
                </span>
              </div>
            ) : (
              <p style={{ margin: '3px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                Select between albums, EPs, and singles, manage cover artwork, and stream full releases.
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Multi-Artist Roster Selector for Labels, Publishers & Managers */}
          <ArtistRosterSelector
            activeSubdomain={activeArtist?.subdomain || creatorEpk?.subdomain || 'ndufo'}
            onSelectArtist={onSelectArtist}
            compact={true}
          />

          {/* All Platform Artists Cross-Catalogue Toggle */}
          <button
            type="button"
            onClick={handleToggleAllCatalogue}
            style={{
              background: viewAllCatalogue ? '#00f0ff' : 'rgba(255,255,255,0.06)',
              color: viewAllCatalogue ? '#000' : '#cbd5e1',
              border: viewAllCatalogue ? 'none' : '1px solid rgba(255,255,255,0.18)',
              padding: '7px 12px',
              borderRadius: '3px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title={viewAllCatalogue ? "Switch to single artist roster view" : "View all platform artists across entire catalogue"}
          >
            <RiDatabase2Fill size={14} />
            <span>{viewAllCatalogue ? 'Entire Catalogue (All Artists)' : 'View Entire Catalogue'}</span>
          </button>

          {/* Manage Genres Admin Action Button - Strictly Gated to Admin */}
          {sessionUser?.role === 'admin' && (
            <button
              type="button"
              onClick={() => setShowGenreManager(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#cbd5e1',
                padding: '7px 12px',
                borderRadius: '3px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Add, edit, and delete authoritative genres (Admin Only)"
            >
              <RiPriceTag3Fill size={14} style={{ color: '#00f0ff' }} />
              <span>Manage Genres</span>
            </button>
          )}

          {/* Wizard vs Manager Switcher */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => setViewMode('wizard')}
              style={{
                background: viewMode === 'wizard' ? '#00f0ff' : 'transparent',
                color: viewMode === 'wizard' ? '#000' : '#cbd5e1',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiMagicLine size={14} />
              <span>Ingestion Wizard</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('manager')}
              style={{
                background: viewMode === 'manager' ? '#00f0ff' : 'transparent',
                color: viewMode === 'manager' ? '#000' : '#cbd5e1',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiFileList3Line size={14} />
              <span>Catalogue ({tracks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* RENDER EITHER WIZARD OR MANAGER */}
      {viewMode === 'wizard' ? (
        <CatalogueWizard
          onSwitchToManager={() => setViewMode('manager')}
          onIngestComplete={(newTracks) => {
            setTracks(newTracks);
            setViewMode('manager');
          }}
          sessionUser={sessionUser}
          creatorEpk={creatorEpk}
          existingTracksCount={tracks.length}
        />
      ) : (
        /* MANAGER VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Release Type Filter Pills & Sub-View Switcher Bar */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Release Type Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>
                Filter By:
              </span>
              {[
                { id: 'all', label: `All Releases (${releases.length})` },
                { id: 'album', label: `Albums (${releases.filter(r => r.releaseType === 'Album').length})` },
                { id: 'ep', label: `EPs (${releases.filter(r => r.releaseType === 'EP').length})` },
                { id: 'single', label: `Singles (${releases.filter(r => r.releaseType === 'Single').length})` }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => { setReleaseTypeFilter(f.id); setCurrentPage(1); }}
                  style={{
                    background: releaseTypeFilter === f.id ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                    color: releaseTypeFilter === f.id ? '#000' : '#cbd5e1',
                    border: releaseTypeFilter === f.id ? 'none' : '1px solid rgba(255,255,255,0.12)',
                    padding: '5px 14px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sub-view switcher: Collections vs Table */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => setManagerSubView('collections')}
                  style={{
                    background: managerSubView === 'collections' ? 'rgba(0,240,255,0.2)' : 'transparent',
                    color: managerSubView === 'collections' ? '#00f0ff' : '#94a3b8',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiFolderMusicLine size={13} />
                  <span>Albums & Collections</span>
                </button>
                <button
                  type="button"
                  onClick={() => setManagerSubView('table')}
                  style={{
                    background: managerSubView === 'table' ? 'rgba(0,240,255,0.2)' : 'transparent',
                    color: managerSubView === 'table' ? '#00f0ff' : '#94a3b8',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <RiTableLine size={13} />
                  <span>All Tracks Table</span>
                </button>
              </div>

              {/* Top Sorting Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                  style={{
                    background: '#04060d',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#00f0ff',
                    padding: '6px 10px',
                    borderRadius: '3px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  title="Sort catalogue releases and tracks"
                >
                  <option value="default">Default Order</option>
                  <option value="title_asc">Title (A-Z)</option>
                  <option value="title_desc">Title (Z-A)</option>
                  <option value="artist_asc">Artist (A-Z)</option>
                  <option value="artist_desc">Artist (Z-A)</option>
                  <option value="streams_desc">Streams (Highest First)</option>
                  <option value="year_desc">Year (Newest First)</option>
                </select>
              </div>

              <DashboardSearchBar 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
                placeholder="Search releases & tracks..." 
              />
            </div>
          </div>

          {/* SUB-VIEW 0: DEDICATED ALBUM & TRACKS EDIT VIEW */}
          {managerSubView === 'album-edit' && editingAlbum ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Top Navigation & Action Bar */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                borderRadius: '6px',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setManagerSubView('collections')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#cbd5e1',
                      padding: '7px 14px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <RiArrowLeftLine size={14} />
                    <span>Back to Catalogue</span>
                  </button>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                        Editing Album: <span style={{ color: '#00f0ff' }}>{editingAlbum.title}</span>
                      </h3>
                      <span style={{
                        background: 'rgba(0, 240, 255, 0.15)',
                        color: '#00f0ff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '3px',
                        textTransform: 'uppercase'
                      }}>
                        {editingAlbum.releaseType || 'Album'}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                      Modify track titles, audio playback cues, ISRCs, artist credits, revenue splits, and 1:1 cover artwork.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Stream Album Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (editingAlbumTracks.length > 0 && typeof onPlayTrack === 'function') {
                        onPlayTrack(editingAlbumTracks[0], editingAlbumTracks);
                      }
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Stream this album from beginning to end"
                  >
                    <RiPlayFill size={14} color="var(--cyan)" />
                    <span>Stream Album</span>
                  </button>

                  {/* Save Changes Button */}
                  <button
                    type="button"
                    disabled={savingArtwork}
                    onClick={handleSaveAlbumEditor}
                    style={{
                      background: '#00f0ff',
                      color: '#000',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: '3px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: savingArtwork ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: savingArtwork ? 0.7 : 1,
                      boxShadow: '0 2px 10px rgba(0, 240, 255, 0.4)'
                    }}
                  >
                    <RiSaveLine size={14} />
                    <span>{savingArtwork ? 'Saving Changes...' : 'Save All Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Left Artwork & Release Details, Right Tracklist Editor */}
              <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
                
                {/* LEFT: Artwork & Album Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Artwork Preview Card */}
                  <div className="dashboard-card" style={{ padding: '18px', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '260px',
                      height: '260px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      background: previewCoverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {previewArtworkUrl ? (
                        <img
                          src={previewArtworkUrl}
                          alt="Album Artwork Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                          <RiDiscLine size={48} style={{ opacity: 0.8, marginBottom: '8px' }} />
                          <div style={{ fontSize: '18px', fontWeight: 900 }}>{previewCoverText || editingAlbum.title}</div>
                          <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>{editingAlbum.artist}</div>
                        </div>
                      )}

                      {/* Quick Play Overlay on Artwork */}
                      {editingAlbumTracks.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof onPlayTrack === 'function') {
                              onPlayTrack(editingAlbumTracks[0], editingAlbumTracks);
                            }
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            width: '42px',
                            height: '42px',
                            borderRadius: '3px',
                            background: '#00f0ff',
                            color: '#000',
                            border: 'none',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0,240,255,0.5)'
                          }}
                          title="Stream Album"
                        >
                          <RiPlayFill size={18} />
                        </button>
                      )}
                    </div>

                    {/* Artwork Tab Switcher */}
                    <div style={{ display: 'flex', width: '100%', marginTop: '14px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <button
                        type="button"
                        onClick={() => setArtworkModalTab('upload')}
                        style={{
                          flex: 1,
                          background: artworkModalTab === 'upload' ? 'rgba(0,240,255,0.2)' : 'transparent',
                          color: artworkModalTab === 'upload' ? '#00f0ff' : '#94a3b8',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiUploadCloud2Line size={13} />
                        <span>Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtworkModalTab('ai')}
                        style={{
                          flex: 1,
                          background: artworkModalTab === 'ai' ? 'rgba(0,240,255,0.2)' : 'transparent',
                          color: artworkModalTab === 'ai' ? '#00f0ff' : '#94a3b8',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiSparklingLine size={13} />
                        <span>Social AI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setArtworkModalTab('gradient')}
                        style={{
                          flex: 1,
                          background: artworkModalTab === 'gradient' ? 'rgba(0,240,255,0.2)' : 'transparent',
                          color: artworkModalTab === 'gradient' ? '#00f0ff' : '#94a3b8',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiPaletteLine size={13} />
                        <span>Themes</span>
                      </button>
                    </div>

                    {/* Tab 1: Upload File */}
                    {artworkModalTab === 'upload' && (
                      <div style={{ width: '100%', marginTop: '12px' }}>
                        <input
                          type="file"
                          ref={artworkFileInputRef}
                          onChange={handleArtworkFileUpload}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <button
                          type="button"
                          onClick={() => artworkFileInputRef.current?.click()}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px dashed rgba(0, 240, 255, 0.4)',
                            background: 'rgba(0, 240, 255, 0.05)',
                            borderRadius: '3px',
                            color: '#00f0ff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiImageAddLine size={15} />
                          <span>Choose Artwork File (PNG, JPG, WebP)</span>
                        </button>
                      </div>
                    )}

                    {/* Tab 2: Social AI Artwork Generator */}
                    {artworkModalTab === 'ai' && (
                      <div style={{ width: '100%', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          rows={2}
                          className="form-control"
                          placeholder="Describe your desired cover artwork style..."
                          style={{ fontSize: '11px', padding: '8px', borderRadius: '3px' }}
                        />
                        <button
                          type="button"
                          disabled={generatingAiArt}
                          onClick={handleGenerateAiArtwork}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            padding: '8px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: generatingAiArt ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            opacity: generatingAiArt ? 0.7 : 1
                          }}
                        >
                          <RiSparklingLine size={14} />
                          <span>{generatingAiArt ? 'Generating with AI...' : 'Generate AI Cover (1:1)'}</span>
                        </button>
                      </div>
                    )}

                    {/* Tab 3: Themes / Gradients */}
                    {artworkModalTab === 'gradient' && (
                      <div style={{ width: '100%', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          value={previewCoverText}
                          onChange={(e) => setPreviewCoverText(e.target.value)}
                          placeholder="Cover text label (e.g. Midnight)"
                          className="form-control"
                          style={{ fontSize: '11px', padding: '6px', borderRadius: '3px' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                          {gradientPresets.map(preset => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => {
                                setPreviewCoverBg(preset.bg);
                                setPreviewArtworkUrl('');
                              }}
                              style={{
                                background: preset.bg,
                                border: previewCoverBg === preset.bg ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '3px',
                                height: '28px',
                                color: '#fff',
                                fontSize: '9px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textShadow: '0 1px 4px rgba(0,0,0,0.8)'
                              }}
                            >
                              {preset.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Album Metadata Card */}
                  <div className="dashboard-card" style={{ padding: '16px', borderRadius: '6px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                      Release Information
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Album / Release Title</label>
                        <input
                          type="text"
                          value={editingAlbum.title}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                          className="form-control"
                          style={{ fontSize: '12px', padding: '7px', borderRadius: '3px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Primary Artist</label>
                        <input
                          type="text"
                          value={editingAlbum.artist}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, artist: e.target.value })}
                          className="form-control"
                          style={{ fontSize: '12px', padding: '7px', borderRadius: '3px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Release Type</label>
                          <select
                            value={editingAlbum.releaseType || 'Album'}
                            onChange={(e) => setEditingAlbum({ ...editingAlbum, releaseType: e.target.value })}
                            className="form-control"
                            style={{ fontSize: '12px', padding: '7px', borderRadius: '3px' }}
                          >
                            <option value="Album">Album</option>
                            <option value="EP">EP</option>
                            <option value="Single">Single</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Release Year</label>
                          <input
                            type="text"
                            value={editingAlbum.year || '2026'}
                            onChange={(e) => setEditingAlbum({ ...editingAlbum, year: e.target.value })}
                            className="form-control"
                            style={{ fontSize: '12px', padding: '7px', borderRadius: '3px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Primary Genre</label>
                        <input
                          type="text"
                          value={editingAlbum.genre || 'Afro-House'}
                          onChange={(e) => setEditingAlbum({ ...editingAlbum, genre: e.target.value })}
                          className="form-control"
                          style={{ fontSize: '12px', padding: '7px', borderRadius: '3px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Album Tracks Editor with Inline Audio Playback */}
                <div className="dashboard-card" style={{ padding: '20px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                        Album Tracklist ({editingAlbumTracks.length} Tracks)
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#94a3b8' }}>
                        Click the play button to preview any track directly. Edit titles, ISRCs, artists, and splits.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTrackToEditingAlbum}
                      style={{
                        background: 'rgba(0, 240, 255, 0.1)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        color: '#00f0ff',
                        padding: '7px 12px',
                        borderRadius: '3px',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <RiAddLine size={14} />
                      <span>Add Track to Album</span>
                    </button>
                  </div>

                  {/* Tracks List */}
                  {editingAlbumTracks.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
                      <RiMusic2Line size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
                      <p style={{ margin: 0, fontSize: '13px' }}>No tracks currently in this album.</p>
                      <button
                        type="button"
                        onClick={handleAddTrackToEditingAlbum}
                        className="btn-primary"
                        style={{ marginTop: '12px', padding: '6px 14px', fontSize: '11.5px', borderRadius: '3px' }}
                      >
                        Add First Track
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {editingAlbumTracks.map((trk, idx) => (
                        <div
                          key={trk.isrc || idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '3px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            transition: 'border-color 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                              {/* Inline Audio Play Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof onPlayTrack === 'function') {
                                    onPlayTrack(trk, editingAlbumTracks);
                                  }
                                }}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '3px',
                                  background: '#00f0ff',
                                  color: '#000',
                                  border: 'none',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 8px rgba(0, 240, 255, 0.3)',
                                  flexShrink: 0
                                }}
                                title={`Play "${trk.title}"`}
                              >
                                <RiPlayFill size={15} />
                              </button>

                              <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, width: '20px' }}>
                                {idx + 1}.
                              </span>

                              {/* Title Input */}
                              <div style={{ flex: 1, minWidth: '160px' }}>
                                <input
                                  type="text"
                                  value={trk.title}
                                  onChange={(e) => handleUpdateAlbumTrack(idx, 'title', e.target.value)}
                                  placeholder="Track Title"
                                  className="form-control"
                                  style={{ fontSize: '12.5px', fontWeight: 700, color: '#fff', padding: '6px 10px', borderRadius: '3px' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* ISRC Input */}
                              <input
                                type="text"
                                value={trk.isrc}
                                onChange={(e) => handleUpdateAlbumTrack(idx, 'isrc', e.target.value)}
                                placeholder="ISRC"
                                className="form-control"
                                style={{ width: '150px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--cyan)', padding: '6px 8px', borderRadius: '3px' }}
                                title="ISRC Code"
                              />

                              {/* Duration Input */}
                              <input
                                type="text"
                                value={trk.duration || '3:30'}
                                onChange={(e) => handleUpdateAlbumTrack(idx, 'duration', e.target.value)}
                                placeholder="Duration"
                                className="form-control"
                                style={{ width: '60px', fontSize: '11px', textAlign: 'center', padding: '6px 4px', borderRadius: '3px' }}
                                title="Track Duration"
                              />

                              {/* Delete Track Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteTrackFromAlbum(idx)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#ef4444',
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Remove track from this album"
                              >
                                <RiDeleteBin6Line size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Secondary Track Row: Artist, Genre, Splits */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr', gap: '8px' }}>
                            <input
                              type="text"
                              value={trk.artist}
                              onChange={(e) => handleUpdateAlbumTrack(idx, 'artist', e.target.value)}
                              placeholder="Artist / Feature"
                              className="form-control"
                              style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '3px' }}
                            />
                            <select
                              value={trk.genre || 'Afro-House'}
                              onChange={(e) => handleUpdateAlbumTrack(idx, 'genre', e.target.value)}
                              className="form-control"
                              style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '3px' }}
                            >
                              <option value="Afro-House">Afro-House</option>
                              <option value="Deep-House">Deep-House</option>
                              <option value="Amapiano">Amapiano</option>
                              <option value="Afrobeats">Afrobeats</option>
                            </select>
                            <input
                              type="text"
                              value={trk.split || 'Artist (60%) / Producer (25%) / Label (15%)'}
                              onChange={(e) => handleUpdateAlbumTrack(idx, 'split', e.target.value)}
                              placeholder="Publishing & Master Splits"
                              className="form-control"
                              style={{ fontSize: '11px', padding: '5px 8px', borderRadius: '3px' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : managerSubView === 'collections' ? (
            /* SUB-VIEW 1: ALBUMS & COLLECTIONS VIEW */
            <div>
              {filteredReleases.length === 0 ? (
                <div className="dashboard-card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                  <RiDatabase2Fill size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                  <h4 style={{ color: '#fff', margin: '0 0 6px' }}>No Releases Found</h4>
                  <p style={{ margin: 0, fontSize: '13px' }}>Try switching release filters or use the Ingestion Wizard to add your first album.</p>
                  <button 
                    type="button" 
                    onClick={() => setViewMode('wizard')} 
                    className="btn-primary" 
                    style={{ marginTop: '16px', padding: '8px 16px', fontSize: '12px', borderRadius: '3px' }}
                  >
                    Launch Ingestion Wizard
                  </button>
                </div>
              ) : (
                <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
                  {paginatedReleases.map((rel) => {
                    const isExpanded = expandedReleaseTitle === rel.title;
                    const typeColor = rel.releaseType === 'Album' ? '#00f0ff' : rel.releaseType === 'EP' ? '#a855f7' : '#f59e0b';

                    return (
                      <div
                        key={rel.title}
                        className="glass-panel"
                        style={{
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid rgba(255,255,255,0.08)',
                          background: 'rgba(15, 23, 42, 0.5)',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                      >
                        {/* Artwork Cover Surface - Clicking brings up dedicated Album & Track Editing Page */}
                        <div 
                          onClick={() => openAlbumEditor(rel)}
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '240px',
                            background: rel.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            cursor: 'pointer'
                          }}
                          title={`Click artwork to edit "${rel.title}" tracks & cover artwork`}
                        >
                          {rel.coverArt ? (
                            <img
                              src={rel.coverArt}
                              alt={rel.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              textAlign: 'center',
                              padding: '20px',
                              color: '#fff',
                              textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                            }}>
                              <RiDiscLine size={40} color="#00f0ff" style={{ marginBottom: '8px' }} />
                              <div style={{ fontSize: '18px', fontWeight: 900 }}>{rel.coverText || rel.title}</div>
                              <div style={{ fontSize: '11px', opacity: 0.8 }}>{rel.artist}</div>
                            </div>
                          )}

                          {/* Release Type Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(0,0,0,0.75)',
                            color: typeColor,
                            border: `1px solid ${typeColor}`,
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 900,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase'
                          }}>
                            {rel.releaseType}
                          </div>

                          {/* Track count badge */}
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.75)',
                            color: '#fff',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 700
                          }}>
                            {rel.tracks.length} Track{rel.tracks.length > 1 ? 's' : ''}
                          </div>

                          {/* Quick stream overlay button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rel.tracks.length > 0 && typeof onPlayTrack === 'function') {
                                onPlayTrack(rel.tracks[0], rel.tracks);
                              }
                            }}
                            style={{
                              position: 'absolute',
                              bottom: '12px',
                              right: '12px',
                              width: '44px',
                              height: '44px',
                              borderRadius: '3px',
                              background: '#00f0ff',
                              color: '#000',
                              border: 'none',
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 4px 15px rgba(0,240,255,0.4)',
                              transition: 'transform 0.15s ease'
                            }}
                            title={`Stream "${rel.title}"`}
                          >
                            <RiPlayFill size={20} />
                          </button>
                        </div>

                        {/* Release Metadata */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800, color: '#fff' }}>
                              {rel.title}
                            </h3>
                            <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#94a3b8' }}>
                              {rel.artist}
                            </p>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '10.5px', color: '#64748b' }}>
                              <span>{rel.genre}</span>
                              <span>•</span>
                              <span>{rel.year}</span>
                              <span>•</span>
                              <span style={{ color: 'var(--green)' }}>Sync Cleared</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                              {/* Edit Album & Tracks Button */}
                              <button
                                type="button"
                                onClick={() => openAlbumEditor(rel)}
                                style={{
                                  background: 'rgba(0, 240, 255, 0.1)',
                                  border: '1px solid rgba(0, 240, 255, 0.3)',
                                  color: '#00f0ff',
                                  padding: '7px 10px',
                                  borderRadius: '3px',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px'
                                }}
                                title="Edit album tracks, metadata, and custom artwork"
                              >
                                <RiEditLine size={13} />
                                <span>Edit</span>
                              </button>

                              {/* Stream Album Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (rel.tracks.length > 0 && typeof onPlayTrack === 'function') {
                                    onPlayTrack(rel.tracks[0], rel.tracks);
                                  }
                                }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                  color: '#fff',
                                  padding: '7px 10px',
                                  borderRadius: '3px',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '5px'
                                }}
                              >
                                <RiPlayFill size={13} color="var(--cyan)" />
                                <span>Stream Album</span>
                              </button>
                            </div>

                            {/* View Tracks Toggle Button */}
                            <button
                              type="button"
                              onClick={() => setExpandedReleaseTitle(isExpanded ? null : rel.title)}
                              style={{
                                background: isExpanded ? 'rgba(255,255,255,0.1)' : 'transparent',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#cbd5e1',
                                padding: '6px',
                                borderRadius: '3px',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              {isExpanded ? (
                                <>
                                  <RiArrowUpSLine size={14} />
                                  <span>Hide Tracklist</span>
                                </>
                              ) : (
                                <>
                                  <RiArrowDownSLine size={14} />
                                  <span>View Tracklist ({rel.tracks.length})</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Expanded Tracklist Preview Accordion */}
                          {isExpanded && (
                            <div style={{
                              marginTop: '8px',
                              background: 'rgba(0,0,0,0.3)',
                              borderRadius: '3px',
                              padding: '8px',
                              maxHeight: '180px',
                              overflowY: 'auto'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {rel.tracks.map((t, idx) => (
                                  <div
                                    key={t.isrc || idx}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '4px 6px',
                                      borderRadius: '3px',
                                      background: 'rgba(255,255,255,0.02)',
                                      fontSize: '11px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                      <span style={{ color: '#64748b', fontSize: '10px', width: '16px' }}>{idx + 1}.</span>
                                      <span style={{ color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {t.title}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ color: '#64748b', fontSize: '10px' }}>{t.duration || '3:30'}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (typeof onPlayTrack === 'function') onPlayTrack(t, rel.tracks);
                                        }}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          color: 'var(--cyan)',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          padding: '2px 4px',
                                          borderRadius: '3px',
                                          display: 'flex',
                                          alignItems: 'center'
                                        }}
                                        title={`Play "${t.title}"`}
                                      >
                                        <RiPlayFill size={13} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Collections / Releases Pagination Bar */}
                {totalReleases > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px 18px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                      <span>Showing {(currentReleasesPage - 1) * releasesPageSize + 1}–{Math.min(currentReleasesPage * releasesPageSize, totalReleases)} of {totalReleases} releases</span>
                      <span>•</span>
                      <span>Per page:</span>
                      <select
                        value={releasesPageSize}
                        onChange={e => { setReleasesPageSize(Number(e.target.value)); setCurrentReleasesPage(1); }}
                        style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '11px', padding: '3px 8px', cursor: 'pointer' }}
                      >
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                      </select>
                    </div>

                    <DashboardPagination 
                      currentPage={currentReleasesPage} 
                      totalItems={totalReleases} 
                      pageSize={releasesPageSize} 
                      onPageChange={(page) => setCurrentReleasesPage(page)} 
                    />
                  </div>
                )}
                </>
              )}
            </div>
          ) : (
            /* SUB-VIEW 2: FULL TRACKS TABLE VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Ingestion Sidebar Collapse/Expand Toggle Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIngestSidebarCollapsed(!ingestSidebarCollapsed)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#cbd5e1',
                    padding: '6px 12px',
                    borderRadius: '3px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                  title={ingestSidebarCollapsed ? "Show Ingestion Sidebar" : "Collapse Ingestion Sidebar"}
                >
                  {ingestSidebarCollapsed ? <RiMenuUnfoldLine size={14} color="var(--cyan)" /> : <RiMenuFoldLine size={14} color="var(--cyan)" />}
                  <span>{ingestSidebarCollapsed ? 'Show Ingestion Tools' : 'Collapse Ingestion Sidebar'}</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: ingestSidebarCollapsed ? '1fr' : '320px 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Collapsible Ingestion Sidebar */}
                {!ingestSidebarCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Quick Ingest Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(255, 0, 127, 0.08) 100%)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      borderRadius: '6px',
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <div style={{ marginBottom: '6px' }}>
                        <RiMagicLine size={26} color="var(--cyan)" />
                      </div>
                      <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 800, margin: '0 0 6px' }}>
                        Album & EP Ingestion Wizard
                      </h4>
                      <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 12px' }}>
                        Step-by-step assistant for full projects, publishing splits, and distribution.
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewMode('wizard')}
                        style={{
                          background: '#00f0ff',
                          color: '#000',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '3px',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        Launch Release Wizard
                      </button>
                    </div>

                    {/* Multiple File Drag & Drop */}
                    <div className="dashboard-card">
                      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>Audio Ingestion (Multi-file)</h3>
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                          border: isDragOver ? '2px dashed #00f0ff' : '1px dashed rgba(255,255,255,0.15)',
                          padding: '24px 14px', 
                          borderRadius: '6px', 
                          textAlign: 'center', 
                          background: isDragOver ? 'rgba(0, 240, 255, 0.04)' : 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input 
                          type="file" 
                          multiple 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept="audio/*,.wav,.mp3,.flac,.aiff"
                          style={{ display: 'none' }} 
                        />
                        <span style={{ display: 'block', marginBottom: '8px' }}>
                          <RiUploadCloud2Line size={28} color="var(--cyan)" />
                        </span>
                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>Drag & Drop Audio Files Here</span>
                        <span style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginTop: '4px' }}>WAV, MP3, or FLAC files (Stored in Asset Vault)</span>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div style={{ marginTop: '12px', maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '3px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--mu)', fontWeight: 'bold' }}>Uploaded Ingests:</span>
                          <ul style={{ listStyle: 'none', padding: 0, margin: '4px 0 0 0', fontSize: '10px', color: '#cbd5e1' }}>
                            {uploadedFiles.map((fn, idx) => (
                              <li key={idx} style={{ marginBottom: '2px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>✓ {fn}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Manual Single Track Ingest */}
                    <div className="dashboard-card">
                      <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff' }}>Add Track Manually</h3>
                      <form onSubmit={handleAddTrack} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="text" placeholder="Track Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px', borderRadius: '3px' }} required />
                        <input type="text" placeholder="Artist" value={newArtist} onChange={(e) => setNewArtist(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px', borderRadius: '3px' }} required />
                        <input type="text" placeholder="ISRC (e.g. KE-TM1-26-00049)" value={newIsrc} onChange={(e) => setNewIsrc(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px', borderRadius: '3px' }} required />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          <input type="text" placeholder="Art Label" value={newCoverText} onChange={(e) => setNewCoverText(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '5px', borderRadius: '3px' }} />
                          <input type="text" placeholder="Art Gradient CSS" value={newCoverBg} onChange={(e) => setNewCoverBg(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '5px', borderRadius: '3px' }} />
                        </div>

                        <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px', borderRadius: '3px' }}>
                          {genres.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>

                        <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '12px', marginTop: '6px', borderRadius: '3px' }}>Catalog Track</button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Roster Table */}
                <div className="dashboard-card" style={{ minHeight: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                      Roster Catalogue Overview ({filteredTracks.length})
                    </h3>
                    <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search catalogue tracks..." />
                  </div>

                  {filteredTracks.length === 0 ? (
                    <div style={{ padding: '80px 0', textAlign: 'center', color: '#64748b' }}>
                      <RiDatabase2Fill size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                      <p style={{ margin: 0, fontSize: '13px' }}>No matching tracks found in your catalogue.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="dashboard-table" style={{ fontSize: '12.5px' }}>
                        <thead>
                          <tr>
                            <th>Play / Art</th>
                            <th>Featured</th>
                            <th>ISRC</th>
                            <th>Title</th>
                            <th>Artist & Release</th>
                            <th>Genre</th>
                            <th>Splits</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedTracks.map((tr, idx) => (
                            <tr key={tr.isrc || idx}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (typeof onPlayTrack === 'function') onPlayTrack(tr, tracks);
                                    }}
                                    style={{
                                      width: '26px',
                                      height: '26px',
                                      borderRadius: '3px',
                                      background: '#00f0ff',
                                      color: '#000',
                                      border: 'none',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: '0 2px 8px rgba(0,240,255,0.3)'
                                    }}
                                    title={`Play ${tr.title}`}
                                  >
                                    <RiPlayFill size={13} />
                                  </button>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '3px',
                                    background: (tr.coverArt || tr.album_art_url) ? `url(${tr.coverArt || tr.album_art_url}) center/cover no-repeat` : (tr.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '8px',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    overflow: 'hidden'
                                  }}>
                                    {!tr.coverArt && !tr.album_art_url && (tr.coverText || 'Art')}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const updated = tracks.map(t => t.isrc === tr.isrc ? { ...t, isFeatured: !t.isFeatured } : t);
                                    setTracks(updated);
                                    try { localStorage.setItem('catalog_tracks', JSON.stringify(updated)); } catch (_) {}
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    opacity: tr.isFeatured ? 1 : 0.4,
                                    transition: 'opacity 0.2s ease',
                                    outline: 'none',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px'
                                  }}
                                  title={tr.isFeatured ? "Unmark as featured" : "Mark as featured"}
                                >
                                  {tr.isFeatured ? (
                                    <RiStarFill size={15} color="#f59e0b" />
                                  ) : (
                                    <RiStarLine size={15} color="#64748b" />
                                  )}
                                </button>
                              </td>
                              <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--cyan)' }}>{tr.isrc}</td>
                              <td style={{ fontWeight: '700', color: '#fff' }}>{tr.title}</td>
                              <td>
                                <div>{tr.artist}</div>
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{tr.release || 'Standalone Master'}</span>
                              </td>
                              <td>
                                <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                  {tr.genre}
                                </span>
                              </td>
                              <td style={{ fontSize: '11px', color: '#cbd5e1' }}>
                                <div>{tr.split || 'Artist (60%) / Producer (25%) / Label (15%)'}</div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                  {/* Edit Album Artwork & Tracks action directly on track */}
                                  <button
                                    type="button"
                                    className="plan-btn outline"
                                    style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer', color: '#00f0ff', borderColor: 'rgba(0, 240, 255, 0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}
                                    onClick={() => {
                                      const relName = (tr.release && tr.release.trim()) ? tr.release.trim() : 'Standalone Singles';
                                      const parentRel = releases.find(r => r.title.toLowerCase() === relName.toLowerCase()) || {
                                        title: relName,
                                        artist: tr.artist,
                                        coverArt: tr.coverArt || tr.album_art_url,
                                        coverBg: tr.coverBg,
                                        coverText: tr.coverText || tr.title,
                                        releaseType: tr.releaseType || 'Single',
                                        tracks: [tr]
                                      };
                                      openAlbumEditor(parentRel);
                                    }}
                                    title="Edit album, tracks, and artwork"
                                  >
                                    <RiEditLine size={11} />
                                    <span>Edit</span>
                                  </button>
                                  <button 
                                    type="button"
                                    className="plan-btn outline" 
                                    style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer', color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}
                                    onClick={() => startEdit(tr)}
                                    title="Edit track metadata"
                                  >
                                    <RiEditLine size={11} />
                                    <span>Track</span>
                                  </button>
                                  <button 
                                    type="button"
                                    className="plan-btn outline" 
                                    style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '3px' }}
                                    onClick={() => setDeletingTrack(tr)}
                                    title="Permanently delete track"
                                  >
                                    <RiDeleteBin6Line size={11} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <DashboardPagination 
                        currentPage={currentPage} 
                        totalItems={totalItems} 
                        pageSize={pageSize} 
                        onPageChange={(page) => setCurrentPage(page)} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= EDIT ALBUM ARTWORK MODAL ================= */}
      {editingAlbumModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1326',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRadius: '10px',
            padding: '28px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <RiPaletteLine size={20} color="var(--cyan)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: 0 }}>
                    Edit Album Artwork: <span style={{ color: '#00f0ff' }}>{editingAlbumModal.title}</span>
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                  Apply new high-resolution cover artwork across all {editingAlbumModal.tracks?.length || ''} tracks and stream players.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAlbumModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer', padding: '4px', borderRadius: '3px' }}
              >
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Modal Content: Preview on Left, Selector on Right */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '22px', alignItems: 'start' }}>
              {/* Artwork Preview Box */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '220px',
                  height: '220px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  background: previewCoverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {previewArtworkUrl ? (
                    <img
                      src={previewArtworkUrl}
                      alt="Album Artwork Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px', color: '#fff' }}>
                      <RiDiscLine size={36} color="var(--cyan)" style={{ marginBottom: '6px' }} />
                      <div style={{ fontSize: '14px', fontWeight: 900 }}>{previewCoverText || editingAlbumModal.title}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>{editingAlbumModal.artist}</div>
                    </div>
                  )}

                  <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#00f0ff',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    LIVE PREVIEW
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Square Aspect Ratio (1:1)</span>
              </div>

              {/* Artwork Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Mode Selector Tabs */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {[
                    { id: 'upload', label: 'Upload File', icon: RiUploadCloud2Line },
                    { id: 'ai', label: 'Social AI Studio', icon: RiSparklingLine },
                    { id: 'gradient', label: 'EPK & Themes', icon: RiPaletteLine }
                  ].map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setArtworkModalTab(tab.id)}
                        style={{
                          flex: 1,
                          background: artworkModalTab === tab.id ? '#00f0ff' : 'transparent',
                          color: artworkModalTab === tab.id ? '#000' : '#cbd5e1',
                          border: 'none',
                          padding: '6px 10px',
                          borderRadius: '3px',
                          fontWeight: 700,
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <TabIcon size={14} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: Upload File */}
                {artworkModalTab === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                      onClick={() => artworkFileInputRef.current?.click()}
                      style={{
                        border: '1.5px dashed rgba(0, 240, 255, 0.4)',
                        borderRadius: '3px',
                        padding: '24px 16px',
                        textAlign: 'center',
                        background: 'rgba(0, 240, 255, 0.03)',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="file"
                        ref={artworkFileInputRef}
                        onChange={handleArtworkFileUpload}
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        style={{ display: 'none' }}
                      />
                      <div style={{ marginBottom: '8px' }}>
                        <RiImageAddLine size={30} color="var(--cyan)" />
                      </div>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 700, display: 'block' }}>
                        Click to Choose Artwork Image
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                        High-res PNG, JPG, or WEBP (Saved to Asset Vault)
                      </span>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Or Paste Image URL directly:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.example.com/artwork.jpg"
                        value={previewArtworkUrl}
                        onChange={(e) => setPreviewArtworkUrl(e.target.value)}
                        className="form-control"
                        style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: AI Generation Studio */}
                {artworkModalTab === 'ai' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        AI Art Generation Prompt:
                      </label>
                      <textarea
                        rows={3}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#0a0f1d',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          padding: '8px',
                          fontSize: '12px',
                          borderRadius: '3px',
                          resize: 'none'
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiArtwork}
                      disabled={generatingAiArt || !aiPrompt.trim()}
                      className="btn-primary"
                      style={{
                        padding: '10px',
                        fontSize: '12px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <RiSparklingLine size={15} />
                      <span>{generatingAiArt ? 'Generating Artwork with AI...' : 'Generate Artwork with Social AI'}</span>
                    </button>
                    <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                      Generates 1:1 square master artwork and saves directly to your Creative Asset Vault.
                    </span>
                  </div>
                )}

                {/* Tab 3: EPK Colors & Gradients */}
                {artworkModalTab === 'gradient' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {creatorEpk && (
                      <button
                        type="button"
                        onClick={() => {
                          const c1 = creatorEpk.accentColor || '#00f0ff';
                          const c2 = creatorEpk.secondaryColor || '#8b5cf6';
                          setPreviewCoverBg(`linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`);
                          setPreviewArtworkUrl('');
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: '3px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <RiPaletteLine size={14} color="var(--cyan)" />
                        <span>Apply Artist EPK Theme Colors ({creatorEpk.accentColor || '#00f0ff'})</span>
                      </button>
                    )}

                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                      Or Pick a Dynamic Gradient Preset:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {gradientPresets.map(preset => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setPreviewCoverBg(preset.bg);
                            setPreviewArtworkUrl('');
                          }}
                          style={{
                            background: preset.bg,
                            border: previewCoverBg === preset.bg ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '3px',
                            height: '40px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <div style={{ marginTop: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Overlay Artwork Label:
                      </label>
                      <input
                        type="text"
                        value={previewCoverText}
                        onChange={(e) => setPreviewCoverText(e.target.value)}
                        className="form-control"
                        style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px', fontSize: '12px', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setEditingAlbumModal(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '9px 18px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAlbumArtwork}
                disabled={savingArtwork}
                style={{
                  background: '#00f0ff',
                  border: 'none',
                  color: '#000',
                  fontWeight: 800,
                  padding: '9px 24px',
                  borderRadius: '3px',
                  cursor: savingArtwork ? 'wait' : 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(0,240,255,0.4)'
                }}
              >
                <RiSaveLine size={15} />
                <span>{savingArtwork ? 'Saving Album Artwork...' : 'Save Album Artwork Across Catalogue'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TRACK MODAL */}
      {editingTrack && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#0d1326',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '6px',
            padding: '24px',
            width: '100%',
            maxWidth: '540px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
          }}>
            {/* Top Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '8px', color: '#94a3b8' }}>
              <span
                onClick={() => { setEditingTrack(null); setManagerSubView('collections'); setEditingAlbum(null); }}
                style={{ color: '#00f0ff', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                title="Return to Catalogue Overview"
              >
                Catalogue Overview
              </span>
              <span>/</span>
              <span style={{ color: '#fff' }}>Track Entry: {editingTrack.isrc}</span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>
              Edit Track Metadata: <span style={{ color: '#00f0ff' }}>{editingTrack.isrc}</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Track Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Artist</label>
                <input
                  type="text"
                  value={editArtist}
                  onChange={e => setEditArtist(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Release / Album</label>
                  <input
                    type="text"
                    value={editRelease}
                    onChange={e => setEditRelease(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Genre</label>
                  <select
                    value={editGenre || 'Afro-fusion'}
                    onChange={e => setEditGenre(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                  >
                    {genres.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Revenue Split Definition</label>
                <input
                  type="text"
                  value={editSplit}
                  onChange={e => setEditSplit(e.target.value)}
                  className="form-control"
                  style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                />
              </div>

              {/* Consumption Mode & Pricing Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Consumption Mode
                  </label>
                  <select
                    value={editConsumptionType}
                    onChange={e => setEditConsumptionType(e.target.value)}
                    className="form-control"
                    style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#00f0ff', padding: '8px', fontSize: '12px', borderRadius: '3px', fontWeight: 700 }}
                  >
                    <option value="both">Stream &amp; Download</option>
                    <option value="stream">Stream Only</option>
                    <option value="download">Download Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Stream Rate (Credits)
                  </label>
                  <input
                    type="number"
                    value={editStreamPriceCredits}
                    onChange={e => setEditStreamPriceCredits(e.target.value)}
                    min="0"
                    placeholder="50"
                    className="form-control"
                    style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                  />
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>
                    Baseline: 50 credits (~$0.99)
                  </span>
                </div>
              </div>

              {editConsumptionType !== 'stream' && (
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    Master Download Price (Credits)
                  </label>
                  <input
                    type="number"
                    value={editDownloadPriceCredits}
                    onChange={e => setEditDownloadPriceCredits(e.target.value)}
                    min="0"
                    placeholder="150"
                    className="form-control"
                    style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px', fontSize: '12px', borderRadius: '3px' }}
                  />
                  <span style={{ fontSize: '9.5px', color: '#64748b' }}>
                    Baseline: 150 credits (~$2.99) • Creator can customize freely
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editFeatured}
                  onChange={e => setEditFeatured(e.target.checked)}
                  style={{ accentColor: '#00f0ff' }}
                />
                <label htmlFor="editFeatured" style={{ fontSize: '12px', color: '#fff', cursor: 'pointer' }}>
                  Mark as Featured Track (Starred in TuneStream Player)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setEditingTrack(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                style={{
                  background: '#00f0ff',
                  border: 'none',
                  color: '#000',
                  fontWeight: 800,
                  padding: '8px 20px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTrack && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#1a0d13',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '24px',
            width: '100%',
            maxWidth: '440px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(239, 68, 68, 0.2)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '3px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1.5px solid #ef4444',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px'
            }}>
              <RiDeleteBin6Line size={24} color="#ef4444" />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
              Delete Audio Track?
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete <strong>"{deletingTrack.title}"</strong> ({deletingTrack.isrc})? This track will be removed from your catalogue and audio player.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setDeletingTrack(null)}
                disabled={isDeleting}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '10px 18px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTrack}
                disabled={isDeleting}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 22px',
                  borderRadius: '3px',
                  cursor: isDeleting ? 'wait' : 'pointer',
                  fontWeight: 800,
                  fontSize: '13px'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Track'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Genre Registry Management Modal - Strictly Gated to Admin */}
      <GenreManagerModal
        isOpen={showGenreManager && sessionUser?.role === 'admin'}
        onClose={() => setShowGenreManager(false)}
      />
    </div>
  );
}

// ================= SUB-PANEL: Split Cascade Ledger (Phase 7) =================
function SplitCascadePanel({ payoutBalance, setPayoutBalance, ledgerRows, setLedgerRows }) {
  const [grossInput, setGrossInput] = useState(1500);
  const [sliderVal, setSliderVal] = useState(50); // Artist Split Slider
  const [calculating, setCalculating] = useState(false);

  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const platformCommPercent = 10;
  const labelSharePercent = 30;
  const managerFeePercent = 10;

  const currentComm = grossInput * (platformCommPercent / 100);
  const remainingAfterComm = grossInput - currentComm;
  const currentLabel = remainingAfterComm * (labelSharePercent / 100);
  const remainingAfterLabel = remainingAfterComm - currentLabel;
  const currentArtist = remainingAfterLabel * (sliderVal / 100);
  const currentManager = remainingAfterLabel * (managerFeePercent / 100);
  const currentNet = remainingAfterLabel - currentArtist - currentManager;

  const handleCascade = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
      const newRow = {
        id: `tx_${Math.floor(100 + Math.random() * 900)}`,
        title: 'Nairobi Sunset Sync',
        gross: parseFloat(grossInput),
        comm: currentComm,
        label: currentLabel,
        artist: currentArtist,
        manager: currentManager,
        net: currentNet,
        status: 'processed'
      };
      setLedgerRows(prev => [newRow, ...prev]);
      setPayoutBalance(prev => prev + currentArtist);
      setCurrentPage(1);
      alert(`Split cascade run successfully! $${currentArtist.toFixed(2)} added to your payout balance.`);
    }, 1000);
  };

  const filtered = ledgerRows.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="dashboard-panel-header">
        <h2>Split Cascade Transaction Ledger</h2>
        <p>Interactive tool illustrating Multi-Tier revenue cascades: Platform Commission → Label Share → Artist Split → Manager Fee → Net Profit.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="dashboard-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Cascade Configurator</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Gross Track Revenue ($)</label>
            <input 
              type="number" 
              value={grossInput} 
              onChange={(e) => setGrossInput(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '13px', padding: '8px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
              <span>Artist Share</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{sliderVal}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderVal} 
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyan)' }}
            />
          </div>

          {/* Breakdown bars */}
          <div style={{ background: '#0a0f1d', padding: '12px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Platform Comm (10%):</span>
              <span style={{ color: '#ef4444' }}>-${currentComm.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Label Share (30%):</span>
              <span style={{ color: '#ef4444' }}>-${currentLabel.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Artist Share ({sliderVal}%):</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>+${currentArtist.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Manager Fee (10%):</span>
              <span style={{ color: '#ef4444' }}>-${currentManager.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontWeight: 'bold' }}>Label Net Profit:</span>
              <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>+${currentNet.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCascade} 
            disabled={calculating}
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {calculating ? 'Processing Cascade...' : 'Execute Royalty Split'}
          </button>
        </div>

        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>Processed Royalty Ledgers</h3>
            <DashboardSearchBar value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search transactions..." />
          </div>

          {filtered.length === 0 ? (
            <p style={{ color: '#cbd5e1', textAlign: 'center', padding: '24px' }}>No transaction ledger rows match your search query.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>TxID</th>
                    <th>Release</th>
                    <th>Gross</th>
                    <th>Comm (10%)</th>
                    <th>Label (30%)</th>
                    <th>Artist Split</th>
                    <th>Manager (10%)</th>
                    <th>Net Profit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map(row => (
                    <tr key={row.id}>
                      <td style={{ fontFamily: 'monospace' }}>{row.id}</td>
                      <td style={{ fontWeight: 'bold', color: '#fff' }}>{row.title}</td>
                      <td>${row.gross.toFixed(2)}</td>
                      <td style={{ color: '#ef4444' }}>-${row.comm.toFixed(2)}</td>
                      <td style={{ color: '#ef4444' }}>-${row.label.toFixed(2)}</td>
                      <td style={{ color: '#10b981', fontWeight: 'bold' }}>+${row.artist.toFixed(2)}</td>
                      <td style={{ color: '#ef4444' }}>-${row.manager.toFixed(2)}</td>
                      <td style={{ color: 'var(--cyan)' }}>+${row.net.toFixed(2)}</td>
                      <td>
                        <span className="badge-status success">{row.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <DashboardPagination 
                currentPage={currentPage} 
                totalItems={filtered.length} 
                pageSize={pageSize} 
                onPageChange={(page) => setCurrentPage(page)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= SUB-PANEL: DJ Pool MVP (Phase 5) =================
function DjPoolPanel() {
  const { sessionUser } = window.__tunemavens_context || {};
  const [activeTab, setActiveTab] = useState('pool'); // 'pool' | 'clearance' | 'upload'
  const [tracks, setTracks] = useState([]);
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState(null); // { track } | null
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackVibes, setFeedbackVibes] = useState('fill_dancefloor');
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Download state
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Clearance form state
  const [clearTrackId, setClearTrackId] = useState('');
  const [clearTitle, setClearTitle] = useState('');
  const [clearDj, setClearDj] = useState('');
  const [clearVenue, setClearVenue] = useState('');
  const [submittingClear, setSubmittingClear] = useState(false);

  // Upload form state
  const [upTitle, setUpTitle] = useState('');
  const [upArtist, setUpArtist] = useState('');
  const [upBpm, setUpBpm] = useState('120');
  const [upKey, setUpKey] = useState('1A');
  const [upGenre, setUpGenre] = useState('House');
  const [upRegions, setUpRegions] = useState('');
  const [submittingUpload, setSubmittingUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { djPoolApi: api } = window.__tunemavens_api || {};

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { djPoolApi } = await import('./lib/api.js');
      const [tracksData, clearancesData] = await Promise.all([
        djPoolApi.listTracks(),
        djPoolApi.listClearances()
      ]);
      setTracks(tracksData || []);
      setClearances(clearancesData || []);
    } catch (err) {
      // Graceful fallback with demo data if API unavailable
      setTracks([
        { id: 'demo1', title: 'Midnight Grooves (Intro Edit)', artist: 'Vibe Master', bpm: 120, key: '4A', genre: 'House', downloads_count: 128, allowed_regions: [], feedback_submitted: false },
        { id: 'demo2', title: 'Neon Shadows (Quick Hitter)', artist: 'DJ Static', bpm: 124, key: '5B', genre: 'Techno', downloads_count: 94, allowed_regions: ['US', 'UK'], feedback_submitted: true },
        { id: 'demo3', title: 'Nairobi Sunset (Extended)', artist: 'Aisha Okoro', bpm: 98, key: '2A', genre: 'Afrobeats', downloads_count: 245, allowed_regions: [], feedback_submitted: false },
      ]);
      setClearances([
        { id: 'c1', title: 'Midnight Grooves (Afro Remix)', dj_name: 'DJ Kalonje', venue: 'Blankets & Wine', status: 'approved', original_title: 'Midnight Grooves', is_owner: true },
        { id: 'c2', title: 'Nairobi Sunset (Club Edit)', dj_name: 'DJ Roja', venue: 'Ngoma Club', status: 'pending', original_title: 'Nairobi Sunset', is_owner: true },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDownloadAttempt = (track) => {
    if (track.feedback_submitted) {
      triggerDownload(track.id);
    } else {
      setFeedbackModal(track);
      setFeedbackRating(5);
      setFeedbackVibes('fill_dancefloor');
      setFeedbackText('');
    }
  };

  const triggerDownload = async (trackId) => {
    setDownloadingId(trackId);
    try {
      const { djPoolApi } = await import('./lib/api.js');
      const result = await djPoolApi.downloadTrack(trackId);
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, downloads_count: t.downloads_count + 1 } : t));
      setDownloadSuccess('Track downloaded. 8s intro/outro DJ tags injected for mixing compliance. ✓');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch {
      setDownloadSuccess('Feedback required before downloading this track.');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }
    setDownloadingId(null);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmittingFeedback(true);
    try {
      const { djPoolApi } = await import('./lib/api.js');
      await djPoolApi.submitFeedback({
        track_id: feedbackModal.id,
        rating: feedbackRating,
        dancefloor_response: feedbackVibes,
        review_text: feedbackText
      });
      setTracks(prev => prev.map(t => t.id === feedbackModal.id ? { ...t, feedback_submitted: true } : t));
      triggerDownload(feedbackModal.id);
      setFeedbackModal(null);
    } catch {
      alert('Could not submit feedback. Please try again.');
    }
    setSubmittingFeedback(false);
  };

  const handleClearanceSubmit = async (e) => {
    e.preventDefault();
    setSubmittingClear(true);
    try {
      const { djPoolApi } = await import('./lib/api.js');
      const result = await djPoolApi.submitClearance({ track_id: clearTrackId, title: clearTitle, dj_name: clearDj, venue: clearVenue });
      setClearances(prev => [{ ...result, status: 'pending' }, ...prev]);
      setClearTrackId(''); setClearTitle(''); setClearDj(''); setClearVenue('');
    } catch {
      alert('Clearance request failed. Please try again.');
    }
    setSubmittingClear(false);
  };

  const handleApproveClearance = async (requestId, newStatus) => {
    try {
      const { djPoolApi } = await import('./lib/api.js');
      await djPoolApi.approveClearance(requestId, newStatus);
      setClearances(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    } catch {
      alert('Could not update clearance status.');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setSubmittingUpload(true);
    try {
      const { djPoolApi } = await import('./lib/api.js');
      const regions = upRegions.split(',').map(r => r.trim()).filter(Boolean);
      const result = await djPoolApi.addTrack({
        title: upTitle, artist: upArtist, bpm: parseInt(upBpm), key: upKey, genre: upGenre, allowed_regions: regions
      });
      setTracks(prev => [{ ...result, downloads_count: 0, feedback_submitted: false }, ...prev]);
      setUpTitle(''); setUpArtist(''); setUpBpm('120'); setUpKey('1A'); setUpGenre('House'); setUpRegions('');
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      setActiveTab('pool');
    } catch {
      alert('Track upload failed. Please try again.');
    }
    setSubmittingUpload(false);
  };

  const statusColors = { approved: '#22c55e', pending: '#f59e0b', declined: '#ef4444' };
  const vibeOptions = [
    { value: 'fill_dancefloor', label: '🔍¥ Fills the Dancefloor' },
    { value: 'keep_crowd', label: '🎵 Keeps the Crowd Moving' },
    { value: 'room_cooler', label: 'â„ Too Slow for the Room' },
    { value: 'peak_moment', label: '🔥 Peak Hour Banger' },
  ];

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontSize: '13px',
    padding: '9px 12px',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
  };

  const tabBtn = (id, label, icon) => (
    <button
      key={id}
      onClick={() => setActiveTab(id)}
      style={{
        padding: '9px 20px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '700',
        fontFamily: 'Outfit, sans-serif',
        background: activeTab === id ? 'var(--cyan)' : 'rgba(255,255,255,0.06)',
        color: activeTab === id ? '#060813' : '#94a3b8',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Header */}
      <div className="dashboard-panel-header">
        <h2>🎧 DJ Pool & Drop Clearances</h2>
        <p>Browse promo cuts, leave dancefloor reviews, and manage remix licensing — all in one place.</p>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabBtn('pool', 'Promo Pool', '🎵')}
        {tabBtn('clearance', 'Clearance Hub', '📜‹')}
        {tabBtn('upload', 'Drop a Promo', 'â¬†')}
      </div>

      {/* Toast notification */}
      {downloadSuccess && (
        <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#86efac', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ✓ {downloadSuccess}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <RiRefreshFill size={32} className="spin-animation" style={{ marginBottom: '12px', color: 'var(--cyan)' }} />
          <p>Loading your promo pool…</p>
        </div>
      ) : (
        <>
          {/* â”€â”€ PROMO POOL TAB â”€â”€ */}
          {activeTab === 'pool' && (
            <div>
              {tracks.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                  <p style={{ fontSize: '15px', marginBottom: '8px' }}>No promo tracks available for your region yet.</p>
                  <p style={{ fontSize: '13px' }}>Switch to <strong style={{ color: 'var(--cyan)' }}>Drop a Promo</strong> to submit the first cut!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {tracks.map(track => (
                    <div key={track.id} className="dashboard-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '16px', padding: '18px 22px', transition: 'box-shadow 0.2s' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '800', fontSize: '15px', color: '#fff' }}>{track.title}</span>
                          <span style={{ fontSize: '11px', background: 'rgba(0,212,255,0.12)', color: 'var(--cyan)', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>{track.genre}</span>
                          {track.allowed_regions && track.allowed_regions.length > 0 && (
                            <span style={{ fontSize: '11px', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>
                              🌐 {track.allowed_regions.join(', ')} only
                            </span>
                          )}
                          {track.feedback_submitted && (
                            <span style={{ fontSize: '11px', background: 'rgba(34,197,94,0.12)', color: '#86efac', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>✓ Reviewed</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>By <strong style={{ color: '#94a3b8' }}>{track.artist}</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>â± <strong style={{ color: '#94a3b8' }}>{track.bpm} BPM</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>🎵 Key <strong style={{ color: '#94a3b8' }}>{track.key}</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>â¬‡ <strong style={{ color: '#94a3b8' }}>{track.downloads_count}</strong> downloads</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        <button
                          onClick={() => handleDownloadAttempt(track)}
                          disabled={downloadingId === track.id}
                          style={{
                            padding: '9px 20px',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: downloadingId === track.id ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            fontWeight: '700',
                            fontFamily: 'Outfit, sans-serif',
                            background: track.feedback_submitted ? 'var(--cyan)' : 'rgba(255,255,255,0.08)',
                            color: track.feedback_submitted ? '#060813' : '#e2e8f0',
                            minWidth: '130px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {downloadingId === track.id ? (
                            <><RiRefreshFill size={12} className="spin-animation" /> Preparing…</>
                          ) : track.feedback_submitted ? (
                            <><RiDownloadFill size={13} /> Download WAV</>
                          ) : (
                            <>â­ Review & Download</>
                          )}
                        </button>
                        {!track.feedback_submitted && (
                          <span style={{ fontSize: '10px', color: '#64748b', textAlign: 'right', maxWidth: '130px' }}>Leave a dancefloor review to unlock</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* â”€â”€ CLEARANCE HUB TAB â”€â”€ */}
          {activeTab === 'clearance' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              {/* Clearance Ledger */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>Active Remix Drop Clearances</h3>
                {clearances.length === 0 ? (
                  <div className="dashboard-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <p>No clearance requests yet. Submit a remix drop below.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {clearances.map(req => (
                      <div key={req.id} className="dashboard-card" style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff', marginBottom: '4px' }}>{req.title}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              By <strong style={{ color: '#94a3b8' }}>{req.dj_name}</strong> · Venue: <strong style={{ color: '#94a3b8' }}>{req.venue}</strong>
                              {req.original_title && <span> · Original: <strong style={{ color: '#94a3b8' }}>{req.original_title}</strong></span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            <span style={{
                              padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: '700',
                              background: `${statusColors[req.status] || '#64748b'}22`,
                              color: statusColors[req.status] || '#64748b',
                              border: `1px solid ${statusColors[req.status] || '#64748b'}44`
                            }}>
                              {req.status.toUpperCase()}
                            </span>
                            {req.is_owner && req.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleApproveClearance(req.id, 'approved')} style={{ padding: '5px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', background: 'rgba(34,197,94,0.15)', color: '#86efac' }}>Approve</button>
                                <button onClick={() => handleApproveClearance(req.id, 'declined')} style={{ padding: '5px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: '700', background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }}>Decline</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clearance Request Form */}
              <div className="dashboard-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>📜 Request Drop Clearance</h3>
                <form onSubmit={handleClearanceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { label: 'Original Track ID', value: clearTrackId, set: setClearTrackId, placeholder: 'Paste track ID from the pool' },
                    { label: 'Remix / Drop Title', value: clearTitle, set: setClearTitle, placeholder: 'e.g. Midnight Grooves (Afro Remix)' },
                    { label: 'Your DJ Name', value: clearDj, set: setClearDj, placeholder: 'e.g. DJ Kalonje' },
                    { label: 'Target Venue / Event', value: clearVenue, set: setClearVenue, placeholder: 'e.g. Blankets & Wine' },
                  ].map(({ label, value, set, placeholder }) => (
                    <div key={label}>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
                      <input type="text" value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inputStyle} required />
                    </div>
                  ))}
                  <button type="submit" disabled={submittingClear} style={{ padding: '11px', borderRadius: '6px', border: 'none', cursor: submittingClear ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', background: 'var(--cyan)', color: '#060813', width: '100%' }}>
                    {submittingClear ? 'Submitting…' : '🔍 Request IP Clearance'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* â”€â”€ UPLOAD TAB â”€â”€ */}
          {activeTab === 'upload' && (
            <div style={{ maxWidth: '640px' }}>
              {uploadSuccess && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#86efac', fontSize: '13px' }}>
                  ✓ Promo track uploaded and live in the pool!
                </div>
              )}
              <div className="dashboard-card">
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>Drop a New Promo Cut</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Upload DJ-ready intro/outro edits. Leave <em>Allowed Regions</em> empty to make it available worldwide.</p>
                <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {[
                      { label: 'Track Title', value: upTitle, set: setUpTitle, placeholder: 'Midnight Grooves (Intro Edit)', full: true },
                      { label: 'Artist Name', value: upArtist, set: setUpArtist, placeholder: 'Your artist name', full: true },
                      { label: 'BPM', value: upBpm, set: setUpBpm, placeholder: '120', type: 'number' },
                      { label: 'Key (Camelot)', value: upKey, set: setUpKey, placeholder: '4A' },
                    ].map(({ label, value, set, placeholder, full, type }) => (
                      <div key={label} style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
                        <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</label>
                        <input type={type || 'text'} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} style={inputStyle} required />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Genre</label>
                      <select value={upGenre} onChange={e => setUpGenre(e.target.value)} style={{ ...inputStyle }}>
                        {['House', 'Techno', 'Afrobeats', 'Gengetone', 'Hip-Hop', 'R&B', 'Dancehall', 'Amapiano', 'EDM', 'Pop'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Allowed Regions (optional)</label>
                      <input type="text" value={upRegions} onChange={e => setUpRegions(e.target.value)} placeholder="e.g. KE, NG, ZA (blank = global)" style={inputStyle} />
                    </div>
                  </div>
                  <button type="submit" disabled={submittingUpload} style={{ padding: '13px', borderRadius: '6px', border: 'none', cursor: submittingUpload ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', background: 'var(--cyan)', color: '#060813', border: 'none', width: '100%', marginTop: '8px' }}>
                    {submittingUpload ? 'Uploading…' : 'â¬† Publish Promo to DJ Pool'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* â”€â”€ FEEDBACK GATE MODAL â”€â”€ */}
      {feedbackModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setFeedbackModal(null); }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ background: '#0c0f20', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setFeedbackModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>Dancefloor Review Required</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '8px 0 4px' }}>{feedbackModal.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>Share your honest dancefloor response to unlock the full-quality WAV download. Your feedback helps artists understand how their music performs live.</p>
            </div>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Star Rating */}
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setFeedbackRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', opacity: star <= feedbackRating ? 1 : 0.3, transition: 'opacity 0.15s' }}>
                      â­
                    </button>
                  ))}
                </div>
              </div>
              {/* Vibe Selection */}
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Dancefloor Response</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vibeOptions.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', borderRadius: '8px', background: feedbackVibes === opt.value ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${feedbackVibes === opt.value ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.15s' }}>
                      <input type="radio" name="vibes" value={opt.value} checked={feedbackVibes === opt.value} onChange={() => setFeedbackVibes(opt.value)} style={{ display: 'none' }} />
                      <span style={{ fontSize: '13px', color: feedbackVibes === opt.value ? 'var(--cyan)' : '#94a3b8', fontWeight: '600' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Written Review */}
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Written Review</label>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tell the artist how this track performed in your set…"
                  required
                  style={{ ...inputStyle, height: '80px', resize: 'none' }}
                />
              </div>
              <button type="submit" disabled={submittingFeedback || !feedbackText.trim()} style={{ padding: '13px', borderRadius: '6px', border: 'none', cursor: (submittingFeedback || !feedbackText.trim()) ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', background: 'var(--cyan)', color: '#060813', border: 'none', opacity: (submittingFeedback || !feedbackText.trim()) ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {submittingFeedback ? 'Submitting…' : '🔍“ Submit Review & Download Track'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// ================= SUB-PANEL: Sync Licensing Marketplace (Phase 6) =================
function SyncLicensingPanel() {
  const [activeMood, setActiveMood] = useState('all');
  const [playingTrack, setPlayingTrack] = useState(null);
  
  // Ported Asset support
  const [portedAsset, setPortedAsset] = useState(() => sessionStorage.getItem('ported_asset_url'));
  const [coverUrl, setCoverUrl] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [briefTarget, setBriefTarget] = useState('Netflix Sci-Fi Series');
  const [submitting, setSubmitting] = useState(false);
  const [submittedPitches, setSubmittedPitches] = useState([]);

  const handleApplyPortedAsset = () => {
    setCoverUrl(portedAsset);
    sessionStorage.removeItem('ported_asset_url');
    setPortedAsset(null);
  };

  const handlePitchSubmit = (e) => {
    e.preventDefault();
    if (!trackTitle.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedPitches([
        ...submittedPitches,
        {
          id: Date.now(),
          title: trackTitle,
          target: briefTarget,
          coverUrl: coverUrl || 'https://picsum.photos/seed/default/80/80',
          date: new Date().toLocaleDateString()
        }
      ]);
      setTrackTitle('');
      setCoverUrl('');
      alert('Track pitched successfully to the Music Supervisor network!');
    }, 1200);
  };

  const tracks = [
    { id: 1, title: "Kilimanjaro Vibe", artist: "Aisha Okoro", moods: ["Afrobeats", "energetic", "sunset"] },
    { id: 2, title: "Nairobi Sunset", artist: "Aisha Okoro", moods: ["chill", "sunset", "Afrobeats"] },
    { id: 3, title: "Midnight Grooves", artist: "Aisha Okoro", moods: ["dark", "cinematic", "energetic"] },
    { id: 4, title: "Neon Shadows", artist: "Aisha Okoro", moods: ["dark", "chill", "cinematic"] }
  ];

  const filteredTracks = activeMood === 'all' 
    ? tracks 
    : tracks.filter(t => t.moods.includes(activeMood));

  return (
    <div>
      {portedAsset && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 211, 238, 0.06)', border: '1px solid rgba(34, 211, 238, 0.20)', padding: '12px 18px', borderRadius: '4px', marginBottom: '24px' }}>
          <div style={{ flex: 1, fontSize: '12.5px', color: '#cbd5e1' }}>
            🎨 <strong>Ported Asset Detected:</strong> You have a generated artwork from your Social AI Studio ready.
          </div>
          <button type="button" onClick={handleApplyPortedAsset} className="btn-secondary" style={{ background: 'var(--cyan)', color: '#000', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Apply as Pitch Cover Art
          </button>
          <button type="button" onClick={() => { sessionStorage.removeItem('ported_asset_url'); setPortedAsset(null); }} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', marginLeft: '6px' }}>
            Dismiss
          </button>
        </div>
      )}

      <div className="dashboard-panel-header">
        <h2>Sync Licensing &amp; Scene-tag Hub</h2>
        <p>Pitch tracks for films, games, and commercials using AI scene tagging and 30-second watermarked streams.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Side: Filters and Pitch Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Filters */}
          <div className="dashboard-card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>AI Scene Tags</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['all', 'Afrobeats', 'sunset', 'energetic', 'chill', 'dark', 'cinematic'].map(mood => (
                <button 
                  key={mood}
                  onClick={() => { setActiveMood(mood); setPlayingTrack(null); }}
                  className={`dashboard-nav-item ${activeMood === mood ? 'active' : ''}`}
                  style={{ width: '100%', border: 'none', background: activeMood === mood ? 'rgba(34,211,238,0.1)' : 'transparent', textTransform: 'capitalize' }}
                >
                  #{mood}
                </button>
              ))}
            </div>
          </div>

          {/* Pitch Form */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>New Sync Pitch</h3>
            <form onSubmit={handlePitchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Track Title</label>
                <input 
                  type="text" 
                  value={trackTitle} 
                  onChange={(e) => setTrackTitle(e.target.value)} 
                  placeholder="e.g. Neon Horizon" 
                  className="form-control"
                  style={{ width: '100%', fontSize: '12.5px', padding: '8px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Target Brief</label>
                <select 
                  value={briefTarget} 
                  onChange={(e) => setBriefTarget(e.target.value)} 
                  className="form-control"
                  style={{ width: '100%', background: '#0a0f1d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12.5px', padding: '8px' }}
                >
                  <option value="Netflix Sci-Fi Series">Netflix Sci-Fi Series Theme</option>
                  <option value="Nike Summer Campaign">Nike Summer Commercial</option>
                  <option value="EA Sports Football 2027">EA Sports Football 2027 In-game Radio</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11.5px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Cover Artwork URL</label>
                <input 
                  type="text" 
                  value={coverUrl} 
                  onChange={(e) => setCoverUrl(e.target.value)} 
                  placeholder="https://images..." 
                  className="form-control"
                  style={{ width: '100%', fontSize: '12.5px', padding: '8px' }}
                />
                {coverUrl && (
                  <div style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={coverUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                disabled={submitting} 
                className="btn-primary" 
                style={{ width: '100%', padding: '10px', fontSize: '12.5px', marginTop: '6px', fontWeight: 'bold' }}
              >
                {submitting ? 'Pitching...' : 'Pitch to Supervisor'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Grid and Active Pitches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Tracks grid */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Watermarked Tracks Grid</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTracks.map(tr => (
                <div 
                  key={tr.id}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '16px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.04)', 
                    borderRadius: '8px' 
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: '0 0 4px 0' }}>{tr.title}</h4>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px' }}>by {tr.artist}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {tr.moods.map((m, i) => (
                        <span key={i} style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(34,211,238,0.05)', color: 'var(--cyan)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: '20px' }}>
                          #{m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {playingTrack === tr.id ? (
                      /* Animated audio wave indicator */
                      <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '20px' }}>
                        <div className="wave-bar" style={{ width: '3px', height: '100%', background: 'var(--cyan)', animation: 'wave 0.6s infinite ease-in-out alternate' }} />
                        <div className="wave-bar" style={{ width: '3px', height: '60%', background: 'var(--cyan)', animation: 'wave 0.6s infinite ease-in-out alternate 0.2s' }} />
                        <div className="wave-bar" style={{ width: '3px', height: '80%', background: 'var(--cyan)', animation: 'wave 0.6s infinite ease-in-out alternate 0.4s' }} />
                      </div>
                    ) : null}

                    <button 
                      onClick={() => setPlayingTrack(playingTrack === tr.id ? null : tr.id)}
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {playingTrack === tr.id ? 'Pause Stream' : 'Preview 30s'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Pitches Ledger */}
          {submittedPitches.length > 0 && (
            <div className="dashboard-card">
              <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Active Sync Pitches Ledger</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {submittedPitches.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <img src={p.coverUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '13px', color: '#fff', display: 'block' }}>{p.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>Pitched to: {p.target}</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{p.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Wave animation styling */}
      <style>{`
        @keyframes wave {
          0% { height: 4px; }
          100% { height: 20px; }
        }
      `}</style>
    </div>
  );
}

// ================= SUB-PANEL: Escrow Contracts (Phase 8) =================
function EscrowContractsPanel({ payoutBalance, setPayoutBalance }) {
  const [contracts, setContracts] = useState([
    { id: 'cnt_801', title: 'Live at Blankets & Wine (Nairobi, KE)', deposit: 1500.00, status: 'held', date: 'Jul 15, 2026' },
    { id: 'cnt_802', title: 'AfroNation Concert (Lagos, NG)', deposit: 5000.00, status: 'released', date: 'Jun 22, 2026' },
    { id: 'cnt_803', title: 'Intermaven Showcase (London, UK)', deposit: 2500.00, status: 'pending_hold', date: 'Aug 05, 2026' }
  ]);
  const [releasingId, setReleasingId] = useState(null);

  const handleRelease = (id, amount) => {
    setReleasingId(id);
    setTimeout(() => {
      setReleasingId(null);
      setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'released' } : c));
      setPayoutBalance(prev => prev + amount);
      alert(`Escrow release authorized! $${amount.toFixed(2)} has been added to your payout balance.`);
    }, 2000);
  };

  return (
    <div>
      <div className="dashboard-panel-header">
        <h2>Appearance Escrow &amp; Gig Contracts</h2>
        <p>Secure gig booking payments in escrow. Deposits are automatically released once attendance milestones are verified.</p>
      </div>

      <div className="dashboard-card">
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Appearance Escrows List</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Gig / Performance</th>
              <th>Date</th>
              <th>Deposit (USD)</th>
              <th>Escrow Status</th>
              <th>Milestone Check</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(cnt => (
              <tr key={cnt.id}>
                <td style={{ fontFamily: 'monospace' }}>{cnt.id}</td>
                <td style={{ fontWeight: 'bold' }}>{cnt.title}</td>
                <td>{cnt.date}</td>
                <td>${cnt.deposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`badge-status ${
                    cnt.status === 'released' ? 'success' : (cnt.status === 'held' ? 'warning' : 'error')
                  }`}>
                    {cnt.status === 'released' ? 'RELEASED' : (cnt.status === 'held' ? 'HELD' : 'PENDING APPROVAL')}
                  </span>
                </td>
                <td>
                  {cnt.status === 'held' ? (
                    <button 
                      onClick={() => handleRelease(cnt.id, cnt.deposit)} 
                      disabled={releasingId !== null}
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {releasingId === cnt.id ? (
                        <>
                          <RiRefreshFill size={10} className="spin-animation" style={{ marginRight: '4px' }} />
                          Verifying GPS Check-In...
                        </>
                      ) : 'Release Escrow'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {cnt.status === 'released' ? '✓ Milestone Complete' : 'Waiting for gig deposit'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= Global Floating & Docked Audio Player =================
function GlobalAudioPlayer({
  globalTrack,
  setGlobalTrack,
  globalPlaying,
  setGlobalPlaying,
  globalProgress,
  setGlobalProgress,
  isUndocked,
  setIsUndocked,
  playerPos,
  setPlayerPos,
  catalogTracks = [],
  playlistQueue = [],
  setPlaylistQueue,
  userCredits = 600,
  setUserCredits
}) {
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState('off'); // 'off' | 'track' | 'queue'
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Unlocked tracks cache
  const [unlockedTracks, setUnlockedTracks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tm_unlocked_tracks') || '[]');
    } catch {
      return [];
    }
  });

  const isTrackUnlocked = Boolean(
    globalTrack && (
      unlockedTracks.includes(globalTrack.isrc) ||
      globalTrack.isPurchased ||
      globalTrack.unlocked ||
      globalTrack.isrc === 'KE-TM1-UNLOCKED'
    )
  );

  // Active Playlist Queue
  const effectiveQueue = (playlistQueue && playlistQueue.length > 0)
    ? playlistQueue
    : (catalogTracks && catalogTracks.length > 0 ? catalogTracks : (globalTrack ? [globalTrack] : []));

  const currentTrackIndex = effectiveQueue.findIndex(t => t.isrc === globalTrack?.isrc);

  // Dragging handlers for undocked player
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setDragging(true);
      setDragOffset({
        x: e.clientX - playerPos.x,
        y: e.clientY - playerPos.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      const x = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 350));
      const y = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 300));
      setPlayerPos({ x, y });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, dragOffset, setPlayerPos]);

  // Resolve streaming audio source URL
  const getAudioUrl = (track) => {
    if (!track) return '';
    if (track.audioUrl) return track.audioUrl;
    if (track.fileUrl) return track.fileUrl;
    const id = track.isrc || track.id || track._id || 'preview';
    return `/api/stream/track/${encodeURIComponent(id)}`;
  };

  // Sync audio element source when globalTrack changes
  useEffect(() => {
    if (!audioRef.current || !globalTrack) return;
    const targetSrc = getAudioUrl(globalTrack);
    if (audioRef.current.src !== targetSrc) {
      audioRef.current.src = targetSrc;
      audioRef.current.load();
      if (globalPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play deferred:', err));
      }
    }
  }, [globalTrack]);

  // Sync play / pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (globalPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [globalPlaying]);

  // Smooth 60fps time tracker using requestAnimationFrame for non-choppy progress
  useEffect(() => {
    let animId;
    const updateProgress = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const cur = audioRef.current.currentTime;
        setGlobalProgress(cur);
        // 30-Second Preview Limit for Unlocked/Non-Purchased Tracks
        if (!isTrackUnlocked && cur >= 30) {
          audioRef.current.pause();
          audioRef.current.currentTime = 30;
          setGlobalPlaying(false);
          setShowUnlockModal(true);
        }
      }
      animId = requestAnimationFrame(updateProgress);
    };
    if (globalPlaying) {
      animId = requestAnimationFrame(updateProgress);
    }
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [globalPlaying, isTrackUnlocked]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (globalPlaying) {
      audio.pause();
      setGlobalPlaying(false);
    } else {
      audio.play().catch(err => console.warn('Play error:', err));
      setGlobalPlaying(true);
    }
  };

  const handleNext = () => {
    if (!globalTrack || effectiveQueue.length === 0) return;
    if (isRepeat === 'track') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setGlobalProgress(0);
        audioRef.current.play().catch(() => {});
        setGlobalPlaying(true);
      }
      return;
    }
    if (effectiveQueue.length === 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setGlobalProgress(0);
        audioRef.current.play().catch(() => {});
      }
      return;
    }
    let nextIdx;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * effectiveQueue.length);
    } else {
      const currentIdx = effectiveQueue.findIndex(t => t.isrc === globalTrack.isrc);
      nextIdx = (currentIdx + 1) % effectiveQueue.length;
    }
    const nextTrk = effectiveQueue[nextIdx];
    setGlobalTrack(nextTrk);
    setGlobalProgress(0);
    setGlobalPlaying(true);
  };

  const handlePrev = () => {
    if (!globalTrack || effectiveQueue.length === 0) return;
    if (globalProgress > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setGlobalProgress(0);
      return;
    }
    const currentIdx = effectiveQueue.findIndex(t => t.isrc === globalTrack.isrc);
    const prevIdx = (currentIdx - 1 + effectiveQueue.length) % effectiveQueue.length;
    const prevTrk = effectiveQueue[prevIdx];
    setGlobalTrack(prevTrk);
    setGlobalProgress(0);
    setGlobalPlaying(true);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * (duration || 180);
    if (!isTrackUnlocked && newTime >= 30) {
      setGlobalProgress(30);
      if (audioRef.current) {
        audioRef.current.currentTime = 30;
        audioRef.current.pause();
      }
      setGlobalPlaying(false);
      setShowUnlockModal(true);
      return;
    }
    setGlobalProgress(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (secs) => {
    const sFloor = Math.floor(secs || 0);
    const m = Math.floor(sFloor / 60);
    const s = Math.floor(sFloor % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Credit Unlock Handlers
  const handleUnlockStream = () => {
    const cost = 5;
    if (userCredits < cost) {
      alert(`Insufficient credits! You need ${cost} credits (current balance: ${userCredits}). Please top up your credits.`);
      return;
    }
    if (typeof setUserCredits === 'function') {
      setUserCredits(prev => Math.max(0, prev - cost));
    }
    const updated = [...unlockedTracks, globalTrack.isrc];
    setUnlockedTracks(updated);
    try {
      localStorage.setItem('tm_unlocked_tracks', JSON.stringify(updated));
    } catch {}
    setShowUnlockModal(false);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Play error:', e));
      setGlobalPlaying(true);
    }
  };

  const handlePurchaseTrack = () => {
    const cost = globalTrack.priceCredits || 50;
    if (userCredits < cost) {
      alert(`Insufficient credits! You need ${cost} credits (current balance: ${userCredits}). Please top up your credits.`);
      return;
    }
    if (typeof setUserCredits === 'function') {
      setUserCredits(prev => Math.max(0, prev - cost));
    }
    const updated = [...unlockedTracks, globalTrack.isrc];
    setUnlockedTracks(updated);
    try {
      localStorage.setItem('tm_unlocked_tracks', JSON.stringify(updated));
    } catch {}
    setShowUnlockModal(false);
    alert(`Successfully purchased "${globalTrack.title}"! Master track audio unlocked.`);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Play error:', e));
      setGlobalPlaying(true);
    }
  };

  const handleTopUpCredits = () => {
    if (typeof setUserCredits === 'function') {
      setUserCredits(prev => prev + 250);
    }
    alert('Top-Up Successful! +250 Credits added to your sandbox account.');
  };

  const handleReplayPreview = () => {
    setShowUnlockModal(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setGlobalProgress(0);
      audioRef.current.play().catch(e => console.warn('Play error:', e));
      setGlobalPlaying(true);
    }
  };

  const audioTag = (
    <audio
      id="tunestream-global-audio"
      ref={audioRef}
      onTimeUpdate={() => {
        if (audioRef.current) {
          if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
            setDuration(Math.floor(audioRef.current.duration));
          }
          if (!isTrackUnlocked && audioRef.current.currentTime >= 30) {
            audioRef.current.pause();
            audioRef.current.currentTime = 30;
            setGlobalPlaying(false);
            setShowUnlockModal(true);
          }
        }
      }}
      onLoadedMetadata={() => {
        if (audioRef.current && audioRef.current.duration && !isNaN(audioRef.current.duration)) {
          setDuration(Math.floor(audioRef.current.duration));
        }
      }}
      onEnded={handleNext}
      style={{ display: 'none' }}
    />
  );

  if (!globalTrack) return audioTag;

  // Render Credit Unlock Modal
  const unlockModal = showUnlockModal && (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setShowUnlockModal(false)}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(13, 20, 36, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '3px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0,240,255,0.15)',
          padding: '28px',
          color: '#fff',
          textAlign: 'center',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={() => setShowUnlockModal(false)}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', borderRadius: '3px' }}
        >
          <RiCloseLine size={20} />
        </button>

        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '3px',
          margin: '0 auto 16px',
          background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.5)'
        }}>
          {(globalTrack.coverArt || globalTrack.album_art_url) ? (
            <img src={globalTrack.coverArt || globalTrack.album_art_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{globalTrack.coverText || 'Art'}</span>
          )}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.3)', padding: '4px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' }}>
          <RiDiscLine size={14} /> Full Master Track Access
        </div>

        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
          {globalTrack.title}
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--mu)' }}>
          {globalTrack.artist} • {globalTrack.release || 'Release'}
        </p>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '3px', padding: '12px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px' }}>Your Credit Balance</div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--cyan)' }}>
            {userCredits} Credits
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleUnlockStream}
            style={{
              background: '#00f0ff',
              color: '#000',
              border: 'none',
              borderRadius: '3px',
              padding: '12px',
              fontSize: '13.5px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Unlock Master Stream</span>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>5 Credits</span>
          </button>

          <button
            onClick={handlePurchaseTrack}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '3px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>Purchase Master Track (Download & Sync)</span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>{globalTrack.priceCredits || 50} Credits</span>
          </button>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button
              onClick={handleTopUpCredits}
              style={{
                flex: 1,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '3px',
                padding: '9px',
                fontSize: '11.5px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Top Up (+250)
            </button>
            <button
              onClick={handleReplayPreview}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                color: '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '3px',
                padding: '9px',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Replay Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Playlist Queue Slide-out Drawer
  const queueDrawer = showQueueDrawer && (
    <div
      style={{
        position: 'fixed',
        bottom: isUndocked ? `${playerPos.y + 300}px` : '80px',
        right: isUndocked ? 'auto' : '24px',
        left: isUndocked ? `${playerPos.x}px` : 'auto',
        width: '360px',
        maxHeight: '380px',
        background: 'rgba(9, 14, 28, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '3px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.8)',
        zIndex: 99998,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#fff'
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiPlayList2Line size={14} color="var(--cyan)" />
          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Up Next Queue</span>
          <span style={{ background: 'rgba(0,240,255,0.15)', color: 'var(--cyan)', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold' }}>
            {effectiveQueue.length} Tracks
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            style={{ background: 'none', border: 'none', color: isShuffle ? '#00f0ff' : '#64748b', fontSize: '14px', cursor: 'pointer', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '3px' }}
            title="Toggle Shuffle"
          >
            <RiShuffleLine size={14} />
          </button>
          <button
            onClick={() => setIsRepeat(isRepeat === 'off' ? 'queue' : isRepeat === 'queue' ? 'track' : 'off')}
            style={{ background: 'none', border: 'none', color: isRepeat !== 'off' ? '#00f0ff' : '#64748b', fontSize: '14px', cursor: 'pointer', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '3px' }}
            title={`Repeat: ${isRepeat}`}
          >
            {isRepeat === 'track' ? <RiRepeatOneLine size={14} /> : <RiRepeat2Line size={14} />}
          </button>
          <button
            onClick={() => setShowQueueDrawer(false)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', padding: '0 4px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
          >
            <RiCloseLine size={16} />
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        {effectiveQueue.map((trk, idx) => {
          const isPlayingThis = globalTrack?.isrc === trk.isrc;
          const trkUnlocked = unlockedTracks.includes(trk.isrc);
          return (
            <div
              key={trk.isrc || idx}
              onClick={() => {
                setGlobalTrack(trk);
                setGlobalProgress(0);
                setGlobalPlaying(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '3px',
                background: isPlayingThis ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                border: isPlayingThis ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'background 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span style={{ fontSize: '11px', color: isPlayingThis ? '#00f0ff' : '#64748b', width: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  {isPlayingThis ? <RiPlayFill size={12} /> : `${idx + 1}`}
                </span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '3px',
                  background: trk.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {(trk.coverArt || trk.album_art_url) && (
                    <img src={trk.coverArt || trk.album_art_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', fontWeight: isPlayingThis ? 'bold' : '500', color: isPlayingThis ? '#00f0ff' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                    {trk.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                    {trk.artist}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                  Stream
                </span>
                <span style={{ fontSize: '10px', color: '#64748b' }}>
                  {trk.duration || '3:30'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Minimized state rendering
  if (isMinimized) {
    if (isUndocked) {
      return (
        <>
          {audioTag}
          {unlockModal}
          {queueDrawer}
          <div 
            className="drag-handle"
            onMouseDown={handleMouseDown}
            style={{
              position: 'fixed',
              left: `${playerPos.x}px`,
              top: `${playerPos.y}px`,
              width: '260px',
              height: '46px',
              background: 'rgba(10, 15, 30, 0.88)',
              backdropFilter: 'blur(12px)',
              borderRadius: '3px',
              border: '1px solid rgba(0,240,255,0.3)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px 0 14px',
              color: '#fff',
              cursor: 'move',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
              <RiDiscLine size={16} color="var(--cyan)" style={{ animation: globalPlaying ? 'spin 4s linear infinite' : 'none', display: 'inline-block' }} />
              <span style={{ fontSize: '11px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                {globalTrack.title}
              </span>
              <span style={{ fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>
                HD
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                onClick={togglePlay}
                style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontSize: '14px', padding: '4px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
              >
                {globalPlaying ? <RiPauseFill size={15} /> : <RiPlayFill size={15} />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#fff',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Expand player"
              >
                <RiArrowUpSLine size={13} />
              </button>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          {audioTag}
          {unlockModal}
          {queueDrawer}
          <div 
            style={{
              position: 'fixed',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              height: '44px',
              padding: '0 12px 0 16px',
              background: 'rgba(7, 14, 27, 0.88)',
              backdropFilter: 'blur(12px)',
              borderRadius: '3px',
              border: '1px solid rgba(0,240,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#fff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px' }}>
              <RiDiscLine size={15} color="var(--cyan)" style={{ animation: globalPlaying ? 'spin 4s linear infinite' : 'none', display: 'inline-block' }} />
              <strong style={{ color: '#fff' }}>{globalTrack.title}</strong>
              <span style={{ color: 'var(--mu)' }}>•</span>
              <span style={{ color: 'var(--mu)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.artist}</span>
              <span style={{ fontSize: '9px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                Playing
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={togglePlay}
                style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', fontSize: '15px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
              >
                {globalPlaying ? <RiPauseFill size={15} /> : <RiPlayFill size={15} />}
              </button>
              <button 
                onClick={() => setIsMinimized(false)}
                style={{
                  background: '#00f0ff',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#000',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Expand player"
              >
                <span>Expand</span>
                <RiArrowUpSLine size={13} />
              </button>
            </div>
          </div>
        </>
      );
    }
  }

  // Expanded Floating Player
  if (isUndocked) {
    return (
      <>
        {audioTag}
        {unlockModal}
        {queueDrawer}
        <div 
          style={{
            position: 'fixed',
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
            width: '350px',
            height: '315px',
            background: 'rgba(10, 15, 30, 0.9)',
            backdropFilter: 'blur(16px)',
            borderRadius: '3px',
            border: '1px solid rgba(0,240,255,0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: dragging ? 'none' : 'box-shadow 0.2s ease',
            color: '#fff'
          }}
        >
          <div 
            className="drag-handle"
            onMouseDown={handleMouseDown}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RiDiscLine size={14} color="var(--cyan)" />
              <span>TuneStream Live Player</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setShowQueueDrawer(!showQueueDrawer)}
                style={{
                  background: showQueueDrawer ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '3px',
                  color: showQueueDrawer ? '#00f0ff' : '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle Queue"
              >
                <RiPlayList2Line size={12} />
                <span>Queue ({effectiveQueue.length})</span>
              </button>
              <button 
                onClick={() => setIsMinimized(true)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Minimize player"
              >
                <RiSubtractLine size={12} />
                <span>Min</span>
              </button>
              <button 
                onClick={() => setIsUndocked(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#fff',
                  fontSize: '10px',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Dock to bottom"
              >
                <RiArrowDownSLine size={12} />
                <span>Dock</span>
              </button>
            </div>
          </div>

          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '3px',
                background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 'bold',
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}>
                {(globalTrack.coverArt || globalTrack.album_art_url) ? (
                  <img src={globalTrack.coverArt || globalTrack.album_art_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{globalTrack.coverText || 'Art'}</span>
                )}
              </div>

              <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
                <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {globalTrack.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {globalTrack.artist}
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                    Full Stream
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--cyan)' }}>
                    Track {currentTrackIndex >= 0 ? currentTrackIndex + 1 : 1}/{effectiveQueue.length}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div 
                style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}
                onClick={handleSeek}
              >
                <div style={{ 
                  width: `${Math.min(100, ((globalProgress || 0) / (duration || 180)) * 100)}%`, 
                  height: '100%', 
                  background: '#00f0ff', 
                  borderRadius: '3px', 
                  boxShadow: '0 0 8px #00f0ff',
                  transition: 'width 0.05s linear'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--mu)', marginTop: '4px' }}>
                <span>{formatTime(globalProgress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{ background: 'none', border: 'none', color: isMuted ? '#ef4444' : '#00f0ff', cursor: 'pointer', fontSize: '14px', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '2px' }}
                >
                  {isMuted ? <RiVolumeMuteFill size={14} /> : <RiVolumeUpFill size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => { setVolume(parseFloat(e.target.value)); if (isMuted) setIsMuted(false); }}
                  style={{ width: '45px', height: '3px', accentColor: '#00f0ff', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button 
                  className="plan-btn outline"
                  onClick={handlePrev}
                  style={{ width: '30px', height: '30px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <RiSkipBackFill size={14} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="btn-primary"
                  style={{ width: '38px', height: '38px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', cursor: 'pointer', border: 'none', boxShadow: '0 4px 12px rgba(0,240,255,0.3)' }}
                >
                  {globalPlaying ? <RiPauseFill size={17} /> : <RiPlayFill size={17} />}
                </button>
                <button 
                  className="plan-btn outline"
                  onClick={handleNext}
                  style={{ width: '30px', height: '30px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <RiSkipForwardFill size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  style={{ background: 'none', border: 'none', color: isShuffle ? '#00f0ff' : '#64748b', fontSize: '14px', cursor: 'pointer', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '2px' }}
                  title="Shuffle"
                >
                  <RiShuffleLine size={14} />
                </button>
                <button
                  onClick={() => setIsRepeat(isRepeat === 'off' ? 'queue' : isRepeat === 'queue' ? 'track' : 'off')}
                  style={{ background: 'none', border: 'none', color: isRepeat !== 'off' ? '#00f0ff' : '#64748b', fontSize: '14px', cursor: 'pointer', borderRadius: '3px', display: 'flex', alignItems: 'center', padding: '2px' }}
                  title={`Repeat: ${isRepeat}`}
                >
                  {isRepeat === 'track' ? <RiRepeatOneLine size={14} /> : <RiRepeat2Line size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Docked Bottom Player
  return (
    <>
      {audioTag}
      {unlockModal}
      {queueDrawer}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '76px',
          background: 'rgba(7, 14, 27, 0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(0, 240, 255, 0.25)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          color: '#fff'
        }}
      >

      {/* Left: Track Information & Cover Art */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '28%', minWidth: '180px' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '3px',
          background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          flexShrink: 0
        }}>
          {(globalTrack.coverArt || globalTrack.album_art_url) ? (
            <img src={globalTrack.coverArt || globalTrack.album_art_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#fff', textAlign: 'center', padding: '2px' }}>
              {globalTrack.coverText || 'Art'}
            </span>
          )}
        </div>
        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {globalTrack.title}
            </h4>
            <span style={{ fontSize: '9px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
              Master Stream
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {globalTrack.artist} • {globalTrack.release || 'Catalogue'}
          </p>
        </div>
      </div>

      {/* Center: Controls, Scrubber & Playlist Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '44%', maxWidth: '520px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            style={{ background: 'none', border: 'none', color: isShuffle ? '#00f0ff' : 'var(--mu)', cursor: 'pointer', fontSize: '15px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
            title="Toggle Shuffle"
          >
            <RiShuffleLine size={15} />
          </button>
          <button 
            onClick={handlePrev}
            style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: '16px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
            title="Previous track"
          >
            <RiSkipBackFill size={16} />
          </button>
          <button 
            onClick={togglePlay}
            className="btn-primary"
            style={{ width: '38px', height: '38px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,240,255,0.4)' }}
          >
            {globalPlaying ? <RiPauseFill size={18} /> : <RiPlayFill size={18} />}
          </button>
          <button 
            onClick={handleNext}
            style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: '16px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
            title="Next track"
          >
            <RiSkipForwardFill size={16} />
          </button>
          <button
            onClick={() => setIsRepeat(isRepeat === 'off' ? 'queue' : isRepeat === 'queue' ? 'track' : 'off')}
            style={{ background: 'none', border: 'none', color: isRepeat !== 'off' ? '#00f0ff' : 'var(--mu)', cursor: 'pointer', fontSize: '15px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
            title={`Repeat: ${isRepeat}`}
          >
            {isRepeat === 'track' ? <RiRepeatOneLine size={15} /> : <RiRepeat2Line size={15} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '10px', color: 'var(--mu)', minWidth: '32px', textAlign: 'right' }}>
            {formatTime(globalProgress)}
          </span>
          <div 
            style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', position: 'relative', cursor: 'pointer' }}
            onClick={handleSeek}
          >
            <div style={{ 
              width: `${Math.min(100, ((globalProgress || 0) / (duration || 180)) * 100)}%`, 
              height: '100%', 
              background: '#00f0ff', 
              borderRadius: '3px', 
              boxShadow: '0 0 6px #00f0ff',
              transition: 'width 0.05s linear'
            }} />
          </div>
          <span style={{ fontSize: '10px', color: 'var(--mu)', minWidth: '32px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: Volume & Queue & Minimize / Undock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '28%', justifyContent: 'flex-end' }}>
        {/* Playlist Queue Button */}
        <button
          onClick={() => setShowQueueDrawer(!showQueueDrawer)}
          style={{
            background: showQueueDrawer ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${showQueueDrawer ? '#00f0ff' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '3px',
            color: showQueueDrawer ? '#00f0ff' : '#cbd5e1',
            padding: '5px 9px',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: '600'
          }}
          title="Open Playlist Queue"
        >
          <RiPlayList2Line size={13} />
          <span>Queue</span>
          <span style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: '3px', fontSize: '9px' }}>
            {effectiveQueue.length}
          </span>
        </button>

        {/* Volume controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: 'none', border: 'none', color: isMuted ? '#ef4444' : '#00f0ff', cursor: 'pointer', fontSize: '15px', borderRadius: '3px', display: 'flex', alignItems: 'center' }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <RiVolumeMuteFill size={15} /> : <RiVolumeUpFill size={15} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            style={{ width: '55px', height: '3px', accentColor: '#00f0ff', cursor: 'pointer' }}
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>

        <button 
          className="plan-btn outline"
          onClick={() => setIsMinimized(true)}
          style={{ padding: '4px 8px', fontSize: '11px', height: '28px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
          title="Minimize player"
        >
          <RiSubtractLine size={12} />
          <span>Min</span>
        </button>
        <button 
          className="plan-btn outline"
          onClick={() => setIsUndocked(true)}
          style={{ padding: '4px 8px', fontSize: '11px', height: '28px', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Undock into mini floating player"
        >
          <RiExternalLinkLine size={12} />
          <span>Undock</span>
        </button>
      </div>
    </div>
    </>
  );
}

// ================= Main App Content Component =================
function AppContent({ 
  sessionUser, 
  handleLogin, 
  handleLogout, 
  getFooterLocation,
  catalogTracks,
  setCatalogTracks,
  ledgerRows,
  setLedgerRows,
  deductCredits,
  addLedgerRow,
  globalTrack,
  setGlobalTrack,
  globalPlaying,
  setGlobalPlaying,
  globalProgress,
  setGlobalProgress,
  isUndocked,
  setIsUndocked,
  playerPos,
  setPlayerPos,
  creatorEpk,
  setCreatorEpk
}) {
  const [scrolled, setScrolled] = useState(false);
  const { country } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastNonAuthPath, setLastNonAuthPath] = useState('/');
  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleBackdropClose = (e) => {
    if (e.target === e.currentTarget) {
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/register') {
      setLastNonAuthPath(location.pathname);
    }
  }, [location.pathname]);

  const isAuthModalActive = location.pathname === '/login' || location.pathname === '/register';
  const backgroundLocation = isAuthModalActive ? { pathname: lastNonAuthPath } : location;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div 
        className={`app-landing-wrapper ${scrolled ? 'scrolled' : ''}`}
        style={{ 
          opacity: isAuthModalActive ? 0.8 : 1, 
          transition: 'opacity 0.3s ease',
          pointerEvents: isAuthModalActive ? 'none' : 'auto'
        }}
      >
        {!location.pathname.startsWith('/epk') && <Navbar sessionUser={sessionUser} />}


        <Routes location={backgroundLocation}>
          <Route path="/" element={<HomeView sessionUser={sessionUser} />} />
          <Route path="/tools" element={<ToolsView sessionUser={sessionUser} />} />
          <Route path="/apps" element={<AppsView sessionUser={sessionUser} />} />
          <Route path="/native-apps" element={<NativeAppsView />} />
          <Route path="/tunestream/about" element={<TuneStreamAboutView />} />
          <Route path="/tunestream/features" element={<TuneStreamFeaturesView />} />
          <Route path="/tunestream/creators" element={<TuneStreamCreatorsView />} />
          <Route path="/tunestream/help" element={<TuneStreamHelpView />} />
          <Route path="/native-apps/:slug" element={
            <NativeAppLandingView 
              creatorEpk={creatorEpk} 
              catalogTracks={catalogTracks} 
              sessionUser={sessionUser}
            />
          } />
          <Route path="/for" element={<PerfectForPageView />} />
          <Route path="/for/:role" element={<RoleLandingView />} />
          <Route path="/pricing" element={<PricingView />} />
          <Route path="/publishing" element={<PublishingView sessionUser={sessionUser} />} />
          <Route path="/distribution" element={<DistributionView sessionUser={sessionUser} />} />
          <Route path="/tours" element={<ToursView sessionUser={sessionUser} />} />
          <Route path="/sync-placement" element={<SyncPlacementView sessionUser={sessionUser} />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/help" element={<HelpView />} />
          <Route path="/epk" element={<CreatorEpkView sessionUser={sessionUser} />} />
          <Route path="/epk/:username" element={<CreatorEpkView sessionUser={sessionUser} />} />

          <Route path="/stream" element={
            <StreamView 
              catalogTracks={catalogTracks} 
              sessionUser={sessionUser} 
              deductCredits={deductCredits} 
              addLedgerRow={addLedgerRow}
              globalTrack={globalTrack}
              setGlobalTrack={setGlobalTrack}
              globalPlaying={globalPlaying}
              setGlobalPlaying={setGlobalPlaying}
              globalProgress={globalProgress}
              setGlobalProgress={setGlobalProgress}
            />
          } />
          <Route path="/login" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/register" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/dashboard/*" element={
            <DashboardView 
              sessionUser={sessionUser} 
              onLogout={handleLogout} 
              onUpdateUser={handleLogin} 
              catalogTracks={catalogTracks}
              setCatalogTracks={setCatalogTracks}
              ledgerRows={ledgerRows}
              setLedgerRows={setLedgerRows}
              creatorEpk={creatorEpk}
              setCreatorEpk={setCreatorEpk}
            />
          } />
        </Routes>

        {/* Detailed Footer - Hidden on EPK Web Worlds */}
        {!location.pathname.startsWith('/epk') && (
          <footer className="landing-footer">

          <div className="footer-inner-container">
            {location.pathname.startsWith('/native-apps/tunestream') ? (
              <div className="footer-grid">
                {/* Brand Column with TuneStream logo and tagline */}
                <div className="footer-brand">
                  <div className="footer-logo">
                    <img 
                      src={ROLE_LOGOS['consumer']} 
                      alt="TuneStream Footer Logo" 
                      className="footer-logo-image" 
                      style={{ height: '38px', width: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                  </div>
                  <div className="footer-desc">
                    Next-generation music streaming built on the shared Intermaven network.
                  </div>
                  <div className="footer-host-link" style={{ marginTop: '4px' }}>
                    streams.tunemavens.com
                  </div>
                  <div className="footer-host-link" style={{ marginTop: '0px' }}>
                    intermaven.io
                  </div>
                </div>

                {/* Product links */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>TuneStream</h4>
                    <div className="footer-links">
                      <Link to="/native-apps/tunestream?view=listen" className="footer-link">Listen Now</Link>
                      <Link to="/stream" className="footer-link">Web Player</Link>
                      <Link to="/tunestream/features" className="footer-link">Features</Link>
                      <Link to="/native-apps/tunestream?view=premium" className="footer-link">Premium</Link>
                      <Link to="/tunestream/about" className="footer-link">About</Link>
                    </div>
                  </div>
                </div>

                {/* Company links */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>Community</h4>
                    <div className="footer-links">
                      <Link to="/tunestream/creators" className="footer-link">For Creators</Link>
                      <Link to="/native-apps/tunestream?view=explore" className="footer-link">Discover Artists</Link>
                      <Link to="/native-apps/tunestream?view=playlists" className="footer-link">Playlists</Link>
                      <Link to="/tunestream/help" className="footer-link">Support &amp; Help</Link>
                      <Link to="/tunestream/help" className="footer-link">Contact</Link>
                    </div>
                  </div>
                </div>

                {/* Follow Us links with SVGs and Copyright copy */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>Follow us</h4>
                    <div className="footer-social">
                      <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      </a>
                      <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </a>
                      <a className="sico tiktok" onClick={() => alert('TikTok handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.83-.56 3.73-1.88 5.02-1.5 1.54-3.83 2.19-5.94 1.86-2.52-.39-4.71-2.45-5.14-4.96-.58-3.08 1.21-6.38 4.23-7.21.94-.27 1.95-.31 2.91-.18V12.18c-1.28-.21-2.65-.05-3.79.62-1.89 1.12-2.73 3.52-2.12 5.62.58 2.09 2.74 3.59 4.9 3.32 1.76-.2 3.27-1.53 3.65-3.26.17-.75.14-1.53.15-2.3V4.08C13.06 2.76 12.89 1.38 12.525.02z"></path></svg>
                      </a>
                    </div>
                    <div className="footer-copy">
                      © 2026 TuneStream.{' '}
                      <a
                        href="/"
                        onClick={(e) => { e.preventDefault(); navigate(sessionStorage.getItem('tunemavens_last_page') || '/'); }}
                        style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                        data-testid="footer-back-to-tunemavens-inline"
                      >
                        A TuneMavens Utility.
                      </a><br />{getFooterLocation(country)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="footer-grid">
                
                {/* Brand Column with second instance logo and tagline */}
                <div className="footer-brand">
                  <div className="footer-logo">
                    <img 
                      src="/tunemavens-logo-white.png" 
                      alt="TuneMavens Footer Logo" 
                      className="footer-logo-image" 
                      style={{ height: '38px', width: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                  </div>
                  <div className="footer-desc">
                    Next-generation tools built on the shared Intermaven network.
                  </div>
                  <div className="footer-host-link" style={{ marginTop: '4px' }}>
                    tunemavens.com
                  </div>
                  <div className="footer-host-link" style={{ marginTop: '0px' }}>
                    intermaven.io
                  </div>
                </div>

                {/* Product links */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>TuneStream</h4>
                    <div className="footer-links">
                      <Link to="/native-apps/tunestream?view=listen" className="footer-link">Listen Now</Link>
                      <Link to="/stream" className="footer-link">Web Player</Link>
                      <Link to="/tunestream/features" className="footer-link">Features</Link>
                      <Link to="/native-apps/tunestream?view=premium" className="footer-link">Premium</Link>
                      <Link to="/tunestream/about" className="footer-link">About</Link>
                    </div>
                  </div>
                </div>

                {/* Company links */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>Community</h4>
                    <div className="footer-links">
                      <Link to="/tunestream/creators" className="footer-link">For Creators</Link>
                      <Link to="/native-apps/tunestream?view=explore" className="footer-link">Discover Artists</Link>
                      <Link to="/native-apps/tunestream?view=playlists" className="footer-link">Playlists</Link>
                      <Link to="/tunestream/help" className="footer-link">Support &amp; Help</Link>
                      <Link to="/tunestream/help" className="footer-link">Contact</Link>
                    </div>
                  </div>
                </div>

                {/* Follow Us links with SVGs and Copyright copy */}
                <div className="footer-col">
                  <div style={{ display: 'inline-block', textAlign: 'left' }}>
                    <h4>Follow us</h4>
                    <div className="footer-social">
                      <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      </a>
                      <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      </a>
                      <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </a>
                      <a className="sico tiktok" onClick={() => alert('TikTok handle coming soon!')}>
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.83-.56 3.73-1.88 5.02-1.5 1.54-3.83 2.19-5.94 1.86-2.52-.39-4.71-2.45-5.14-4.96-.58-3.08 1.21-6.38 4.23-7.21.94-.27 1.95-.31 2.91-.18V12.18c-1.28-.21-2.65-.05-3.79.62-1.89 1.12-2.73 3.52-2.12 5.62.58 2.09 2.74 3.59 4.9 3.32 1.76-.2 3.27-1.53 3.65-3.26.17-.75.14-1.53.15-2.3V4.08C13.06 2.76 12.89 1.38 12.525.02z"></path></svg>
                      </a>
                    </div>
                    <div className="footer-copy">
                      © 2026 TuneMavens Ltd.<br />{getFooterLocation(country)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="footer-bottom">
              <div className="footer-bottom-links">
                <a href="#privacy" className="fbl" onClick={() => alert('Privacy policy is synchronized with Intermaven.')}>Privacy Policy</a>
                <a href="#terms" className="fbl" onClick={() => alert('Terms of service are synchronized with Intermaven.')}>Terms of Service</a>
                <a href="#cookies" className="fbl" onClick={() => alert('Cookie policy is synchronized.')}>Cookie Policy</a>
                <a href="#refund" className="fbl" onClick={() => alert('Refund policy is synchronized.')}>Refund Policy</a>
              </div>
              <a 
                href="https://intermaven.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="intermaven-badge"
              >
                powered by <span>intermaven</span>
                <span className="badge-dot"></span>
              </a>
            </div>
          </div>
        </footer>
        )}


        {/* Floating audio player removed — streaming handled by TuneStream app */}
      </div>

      {/* Render modals on top, outside the wrapper so they aren't affected by its opacity */}
      {isAuthModalActive && (
        <div className="auth-modal-overlay-wrapper" onClick={handleBackdropClose}>
          <Routes>
            <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterView onLogin={handleLogin} />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

// Platformwide Scroll-to-Top Component: Ensures all route navigations reset to the top of the viewport
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
}

// ================= Main App Component =================
function App() {
  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tunemavens_session') || localStorage.getItem('tunemavens_saved_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return reconcileUserApps(parsed);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [catalogTracks, setCatalogTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('catalog_tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      { id: 1, isrc: 'KE-TM1-26-00042', title: 'Nairobi Cyberwave (Master)', artist: 'Ndufo', release: 'Neon Safari EP', releaseType: 'EP', year: '2026', genre: 'Afro-House', duration: '3:45', streams: '3.4M', priceCredits: 50, coverArt: 'https://picsum.photos/seed/cyberwave_cover/600/600', coverText: 'Cyberwave', coverBg: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)', status: 'valid', isFeatured: true, split: 'Artist (60%) / Producer (25%) / Label (15%)' },
      { id: 2, isrc: 'KE-TM1-26-00043', title: 'Sunset over Rift Valley', artist: 'Ndufo', release: 'Singles 2026', releaseType: 'Single', year: '2026', genre: 'Amapiano', duration: '4:12', streams: '1.8M', priceCredits: 50, coverArt: 'https://picsum.photos/seed/riftvalley_cover/600/600', coverText: 'Sunset', coverBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', status: 'valid', isFeatured: false, split: 'Artist (60%) / Producer (25%) / Label (15%)' },
      { id: 3, isrc: 'KE-TM1-26-00044', title: 'Afro-Synth Cascade', artist: 'Ndufo', release: 'Mainstage Dubs', releaseType: 'Single', year: '2026', genre: 'Afro-House', duration: '3:18', streams: '940K', priceCredits: 40, coverArt: 'https://picsum.photos/seed/afrosynth_cover/600/600', coverText: 'Cascade', coverBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', status: 'valid', isFeatured: false, split: 'Artist (50%) / Producer (50%)' },
      { id: 4, isrc: 'KE-TM1-26-00045', title: 'Midnight Mara Starlight', artist: 'Ndufo', release: 'EP 2025', releaseType: 'EP', year: '2025', genre: 'Deep-House', duration: '5:02', streams: '2.1M', priceCredits: 60, coverArt: 'https://picsum.photos/seed/mara_cover/600/600', coverText: 'Midnight', coverBg: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', status: 'valid', isFeatured: true, split: 'Artist (70%) / Producer (30%)' }
    ];
  });

  // Persistent catalogue track synchronization from backend API
  useEffect(() => {
    const sub = sessionUser?.username || 'ndufo';
    fetch(`/api/catalog/tracks?subdomain=${encodeURIComponent(sub)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.tracks) && data.tracks.length > 0) {
          setCatalogTracks(data.tracks);
          localStorage.setItem('catalog_tracks', JSON.stringify(data.tracks));
        }
      })
      .catch(err => console.warn('Catalogue sync fallback to local cache:', err));
  }, [sessionUser?.username]);

  // Keep localStorage updated whenever catalogTracks changes
  useEffect(() => {
    if (Array.isArray(catalogTracks) && catalogTracks.length > 0) {
      localStorage.setItem('catalog_tracks', JSON.stringify(catalogTracks));
    }
  }, [catalogTracks]);

  const [creatorEpk, setCreatorEpk] = useState(() => {
    try {
      const activeSub = (typeof localStorage !== 'undefined' ? localStorage.getItem('last_saved_epk_subdomain') : null) || 'ndufo';
      const cached = localStorage.getItem(`epk_public_${activeSub}`) || localStorage.getItem(`epk_${activeSub}`) || localStorage.getItem('last_saved_epk_data');
      if (cached) {
        const parsed = JSON.parse(cached);
        return { subdomain: activeSub, artist_name: parsed.artist_name || (activeSub === 'ndufo' ? 'Ndufo' : activeSub), ...parsed };
      }
    } catch (_) {}
    return {
      subdomain: 'ndufo',
      artist_name: 'Ndufo',
      headline: 'Official Standalone Creator Web World',
      themeBg: 'linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)',
      featuredTrackIsrc: 'KE-TM1-26-00042',
      spotify: 'https://spotify.com/artist/ndufo',
      instagram: 'https://instagram.com/ndufo',
      soundcloud: 'https://soundcloud.com/ndufo',
      bookingEmail: 'booking@ndufo.com',
      pressOutlet: 'Billboard & SyncMavens',
      pressQuote: 'Redefining the sonic architecture of electronic soundscapes and rights ownership.',
      bio: 'Independent creator on the TuneMavens and Intermaven network.'
    };
  });

  const [ledgerRows, setLedgerRows] = useState([
    { id: 'tx_821', title: 'Midnight Grooves', gross: 2500.00, comm: 250.00, label: 675.00, artist: 787.50, manager: 157.50, net: 630.00, status: 'processed' },
    { id: 'tx_822', title: 'Neon Shadows', gross: 1800.00, comm: 180.00, label: 486.00, artist: 567.00, manager: 113.40, net: 453.60, status: 'processed' },
    { id: 'tx_823', title: 'Nairobi Sunset Sync', gross: 5000.00, comm: 500.00, label: 1350.00, artist: 1575.00, manager: 315.00, net: 1260.00, status: 'processed' },
    { id: 'tx_824', title: 'Kilimanjaro Vibe', gross: 1200.00, comm: 120.00, label: 324.00, artist: 378.00, manager: 75.60, net: 302.40, status: 'processed' },
    { id: 'tx_825', title: 'Sauti Live', gross: 3000.00, comm: 300.00, label: 810.00, artist: 945.00, manager: 189.00, net: 756.00, status: 'processed' },
    { id: 'tx_826', title: 'Amapiano Wave', gross: 4000.00, comm: 400.00, label: 1080.00, artist: 1260.00, manager: 252.00, net: 1008.00, status: 'processed' }
  ]);

  const deductCredits = (amount) => {
    if (!sessionUser) return false;
    const current = sessionUser.credits || 600;
    if (current < amount) return false;
    const updated = { ...sessionUser, credits: current - amount };
    setSessionUser(updated);
    sessionStorage.setItem('tunemavens_session', JSON.stringify(updated));
    localStorage.setItem('tunemavens_saved_user', JSON.stringify(updated));
    return true;
  };

  const addLedgerRow = (row) => {
    setLedgerRows(prev => [row, ...prev]);
  };

  const [globalTrack, setGlobalTrack] = useState(null);
  const [globalPlaying, setGlobalPlaying] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isUndocked, setIsUndocked] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 380 });

  useEffect(() => {
    if (catalogTracks.length > 0 && !globalTrack) {
      setGlobalTrack(catalogTracks[0]);
    }
  }, [catalogTracks, globalTrack]);

  const handleLogin = (user) => {
    const reconciled = reconcileUserApps(user);
    setSessionUser(reconciled);
    sessionStorage.setItem('tunemavens_session', JSON.stringify(reconciled));
    localStorage.setItem('tunemavens_saved_user', JSON.stringify(reconciled));
    if (tokenStore.get() && Array.isArray(reconciled.apps) && reconciled.apps.length > 0) {
      usersApi.syncApps?.(reconciled.apps).catch(() => {});
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore  -  clear local state regardless so the user is logged out client-side
    }
    tokenStore.clear();
    setSessionUser(null);
    sessionStorage.removeItem('tunemavens_session');
    localStorage.removeItem('tunemavens_saved_user');
  };

  // Recognises your Intermaven session when you land on the TuneMavens app.
  useEffect(() => {
    let cancelled = false;
    const token = tokenStore.get();
    if (token) {
      authApi.me(token).then((user) => {
        if (cancelled) return;
        const reconciled = reconcileUserApps(user);
        setSessionUser(reconciled);
        sessionStorage.setItem('tunemavens_session', JSON.stringify(reconciled));
        localStorage.setItem('tunemavens_saved_user', JSON.stringify(reconciled));
      }).catch((err) => {
        if (cancelled) return;
        if (err?.status === 401) {
          tokenStore.clear();
          authApi.demo().then(({ user: demoUser, access_token }) => {
            if (cancelled) return;
            if (access_token) {
              tokenStore.set(access_token);
              const reconciled = reconcileUserApps({ ...demoUser, ...(sessionUser || {}) });
              setSessionUser(reconciled);
              sessionStorage.setItem('tunemavens_session', JSON.stringify(reconciled));
              localStorage.setItem('tunemavens_saved_user', JSON.stringify(reconciled));
            } else {
              sessionStorage.removeItem('tunemavens_session');
              localStorage.removeItem('tunemavens_saved_user');
              setSessionUser(null);
            }
          }).catch(() => {
            sessionStorage.removeItem('tunemavens_session');
            localStorage.removeItem('tunemavens_saved_user');
            setSessionUser(null);
          });
        }
      });
    } else if (sessionUser) {
      authApi.demo().then(({ user, access_token }) => {
        if (cancelled) return;
        if (access_token) {
          tokenStore.set(access_token);
          const reconciled = reconcileUserApps({ ...user, ...sessionUser });
          setSessionUser(reconciled);
          sessionStorage.setItem('tunemavens_session', JSON.stringify(reconciled));
          localStorage.setItem('tunemavens_saved_user', JSON.stringify(reconciled));
        }
      }).catch(() => {});
    }
    return () => { cancelled = true; };
  }, []);

  const getFooterLocation = (code) => {
    switch(code) {
      case 'US': return 'Atlanta, USA';
      case 'GB': return 'London, UK';
      case 'NG': return 'Lagos, Nigeria';
      case 'ZA': return 'Johannesburg, South Africa';
      case 'UG': return 'Kampala, Uganda';
      case 'TZ': return 'Dar es Salaam, Tanzania';
      default: return 'Nairobi, Kenya';
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <AppContent 
        sessionUser={sessionUser}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        getFooterLocation={getFooterLocation}
        catalogTracks={catalogTracks}
        setCatalogTracks={setCatalogTracks}
        ledgerRows={ledgerRows}
        setLedgerRows={setLedgerRows}
        deductCredits={deductCredits}
        addLedgerRow={addLedgerRow}
        globalTrack={globalTrack}
        setGlobalTrack={setGlobalTrack}
        globalPlaying={globalPlaying}
        setGlobalPlaying={setGlobalPlaying}
        globalProgress={globalProgress}
        setGlobalProgress={setGlobalProgress}
        isUndocked={isUndocked}
        setIsUndocked={setIsUndocked}
        playerPos={playerPos}
        setPlayerPos={setPlayerPos}
        creatorEpk={creatorEpk}
        setCreatorEpk={setCreatorEpk}
      />
    </Router>
  );
}

// ================= Track D: Social AI Panel =================
function SocialAiPanel({ setActiveTab, sessionUser, onPlayTrack }) {
  const [prompt, setPrompt] = React.useState('');
  const [mediaType, setMediaType] = React.useState('image'); // 'image' | 'video'
  const [aspectRatio, setAspectRatio] = React.useState('1:1');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  
  // Asset Manager & Porting States
  const [assets, setAssets] = React.useState([]);
  const [assetFilter, setAssetFilter] = React.useState('all'); // 'all' | 'image' | 'video' | 'audio'
  const [editingAssetId, setEditingAssetId] = React.useState(null);
  const [editingPrompt, setEditingPrompt] = React.useState('');
  const [uploadingMedia, setUploadingMedia] = React.useState(false);
  const mediaFileInputRef = React.useRef(null);
  
  // Recommendations & Integration states
  const [onboarding, setOnboarding] = React.useState(null);
  const [manualGoal, setManualGoal] = React.useState('brand_awareness'); // 'brand_awareness' | 'viral_reach'
  const [isManual, setIsManual] = React.useState(false);
  const [selectedChannels, setSelectedChannels] = React.useState(['instagram', 'facebook']);

  const loadAssets = async () => {
    try {
      const list = await socialAiApi.listAssets();
      setAssets(list);
    } catch (err) {
      console.error('Failed to load assets', err);
    }
  };

  const handleMediaFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      let mType = 'image';
      const lower = file.name.toLowerCase();
      if (lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.flac') || lower.endsWith('.ogg') || lower.endsWith('.m4a') || lower.endsWith('.aac')) {
        mType = 'audio';
      } else if (lower.endsWith('.mp4') || lower.endsWith('.mov') || lower.endsWith('.webm')) {
        mType = 'video';
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('media_type', mType);
      const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('tunemavens_token') || '';
      const res = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        await loadAssets();
        setAssetFilter(mType);
        alert(`Media file "${file.name}" (${mType.toUpperCase()}) successfully uploaded and stored in your Creative Asset Vault!`);
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.detail || 'Media upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  };

  React.useEffect(() => {
    usersApi.getOnboarding()
      .then((o) => {
        setOnboarding(o);
        // Auto-configure channels based on onboarding primary goal
        if (o && o.primary_goal && o.primary_goal.some(g => g.toLowerCase().includes('social') || g.toLowerCase().includes('audience') || g.toLowerCase().includes('reach'))) {
          setSelectedChannels(['instagram', 'tiktok']);
        }
      })
      .catch(() => {});
    loadAssets();
  }, []);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setError('Please provide a prompt.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let res;
      if (mediaType === 'image') {
        res = await socialAiApi.generateArt(prompt, aspectRatio);
      } else {
        res = await socialAiApi.generateVideo(prompt, 5);
      }
      setResult(res.asset);
      loadAssets(); // Reload asset manager grid
    } catch (err) {
      setError(err.data?.detail || err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAsset = async (id) => {
    if (!editingPrompt.trim()) return;
    try {
      await socialAiApi.updateAsset(id, editingPrompt);
      setEditingAssetId(null);
      loadAssets();
    } catch (err) {
      alert(err.message || 'Failed to update asset');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!confirm('Are you sure you want to delete this asset from your manager?')) return;
    try {
      await socialAiApi.deleteAsset(id);
      loadAssets();
      if (result && result.id === id) {
        setResult(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete asset');
    }
  };

  const handlePortAsset = (asset, targetApp) => {
    sessionStorage.setItem('ported_asset_url', asset.media_url);
    sessionStorage.setItem('ported_asset_type', asset.media_type);
    
    if (targetApp === 'epk') {
      if (setActiveTab) setActiveTab('epk-builder');
      alert('Cover artwork ported! Switched to EPK Builder tab. Apply the new background in the banner.');
    } else if (targetApp === 'cms') {
      if (setActiveTab) setActiveTab('cms');
      alert('Cover artwork ported! Switched to CMS Layouts tab. Apply the new hero background in the banner.');
    } else if (targetApp === 'sync') {
      if (setActiveTab) setActiveTab('sync');
      alert('Cover artwork ported! Switched to Sync Licensing tab. Apply the artwork cover in the new track pitch.');
    }
  };

  const toggleChannel = (ch) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter(c => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  // Recommendations calculated based on selected channels and onboarding / goals
  const getAIRecommendations = () => {
    const isViral = isManual 
      ? manualGoal === 'viral_reach'
      : (onboarding && onboarding.primary_goal && onboarding.primary_goal.some(g => g.toLowerCase().includes('social') || g.toLowerCase().includes('reach')));

    const recommendations = [];
    
    if (selectedChannels.includes('instagram') || selectedChannels.includes('tiktok')) {
      recommendations.push({
        type: 'video',
        ratio: '9:16',
        label: 'Instagram Reels & TikTok Short',
        promptSuggestion: 'Vertical hyper-realistic promo teaser with neon particle streams, high energy vibe'
      });
    }
    if (selectedChannels.includes('facebook') || selectedChannels.includes('spotify') || selectedChannels.includes('instagram')) {
      recommendations.push({
        type: 'image',
        ratio: '1:1',
        label: 'Facebook Post & Spotify Cover',
        promptSuggestion: 'Synthwave vinyl cover art, retro-futuristic grid with glowing sun background'
      });
    }
    if (selectedChannels.includes('youtube')) {
      recommendations.push({
        type: 'video',
        ratio: '16:9',
        label: 'YouTube Widescreen Teaser',
        promptSuggestion: 'Cinematic music video opening shot, drone overview of a cybernetic stadium at dusk'
      });
    }

    return { isViral, recommendations };
  };

  const { isViral, recommendations } = getAIRecommendations();

  const applySuggestion = (rec) => {
    setMediaType(rec.type);
    setAspectRatio(rec.ratio);
    setPrompt(rec.promptSuggestion);
  };

  return (
    <div className="dashboard-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Intermaven Social AI Linkage Alert */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 211, 238, 0.06)', border: '1px solid rgba(34, 211, 238, 0.20)', padding: '12px 18px', borderRadius: '4px', marginBottom: '24px' }}>
        <RiCpuFill style={{ color: 'var(--cyan)', flexShrink: 0 }} size={20} />
        <div style={{ flex: 1, fontSize: '13px', color: '#cbd5e1' }}>
          <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>🔍— Linked to Intermaven Social AI:</span> Auto-scheduling is active. Created assets sync directly with your Intermaven visual post calendar and automatic publishing queues.
        </div>
      </div>

      <div className="dashboard-card-header" style={{ marginBottom: '24px' }}>
        <h3 className="dashboard-card-title">Social AI Creative Studio</h3>
        <p className="dashboard-card-desc">Generate visual assets tailored to your recommended marketing channels.</p>
      </div>

      {/* Path Recommendation System */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px', background: 'rgba(11,15,30,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>🎯 Recommended Path Suggestions</h4>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isManual} 
              onChange={() => setIsManual(!isManual)} 
              style={{ accentColor: 'var(--cyan)' }} 
            />
            Manual Goal Planner
          </label>
        </div>

        {isManual ? (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button 
              type="button" 
              className={`btn-secondary ${manualGoal === 'brand_awareness' ? 'active' : ''}`}
              onClick={() => setManualGoal('brand_awareness')}
              style={{ flex: 1, fontSize: '12.5px', background: manualGoal === 'brand_awareness' ? 'var(--cyan)' : 'transparent', color: manualGoal === 'brand_awareness' ? '#000' : '#fff' }}
            >
              Brand Awareness Focus
            </button>
            <button 
              type="button" 
              className={`btn-secondary ${manualGoal === 'viral_reach' ? 'active' : ''}`}
              onClick={() => setManualGoal('viral_reach')}
              style={{ flex: 1, fontSize: '12.5px', background: manualGoal === 'viral_reach' ? 'var(--cyan)' : 'transparent', color: manualGoal === 'viral_reach' ? '#000' : '#fff' }}
            >
              Viral Reach Focus
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '13px', color: '#94a3b8', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', marginBottom: '16px', borderLeft: '3px solid var(--purple)' }}>
            {isViral ? (
              <span>🚀 <strong style={{ color: '#fff' }}>Viral Audience Path Recommended:</strong> Your onboarding profile emphasizes social growth. Generating vertical clips (9:16) for TikTok/Reels is highly recommended.</span>
            ) : (
              <span>🎵 <strong style={{ color: '#fff' }}>Brand Awareness Path Recommended:</strong> Your profile emphasizes streaming/mechanical splits. Generating cover art (1:1) and widescreen teasers (16:9) is recommended.</span>
            )}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>Active Channel Targets</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {['instagram', 'facebook', 'tiktok', 'youtube', 'spotify'].map(ch => {
              const active = selectedChannels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11.5px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: active ? 'var(--cyan)' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
                    color: active ? 'var(--cyan)' : '#94a3b8',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: active ? 'bold' : 'normal'
                  }}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>Propose Visual Assets:</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', display: 'block' }}>{rec.label} ({rec.ratio} {rec.type})</span>
                  <span style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>Preset prompt: "{rec.promptSuggestion}"</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => applySuggestion(rec)}
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  Use Preset
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Creative Prompt</label>
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Describe what you want to generate (e.g. 'A retro vinyl spinning in a neon-lit cyber synthwave style')" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ width: '100%', resize: 'none', background: 'var(--bg2)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '12px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Asset Type</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className={`btn-secondary ${mediaType === 'image' ? 'active' : ''}`}
                onClick={() => setMediaType('image')}
                style={{ flex: 1, background: mediaType === 'image' ? 'var(--cyan)' : 'transparent', color: mediaType === 'image' ? '#000' : '#fff', fontWeight: 'bold' }}
              >
                Cover Art
              </button>
              <button 
                type="button" 
                className={`btn-secondary ${mediaType === 'video' ? 'active' : ''}`}
                onClick={() => setMediaType('video')}
                style={{ flex: 1, background: mediaType === 'video' ? 'var(--cyan)' : 'transparent', color: mediaType === 'video' ? '#000' : '#fff', fontWeight: 'bold' }}
              >
                Teaser Video
              </button>
            </div>
          </div>

          {mediaType === 'image' && (
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Aspect Ratio</label>
              <select 
                className="form-control"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{ width: '100%', background: 'var(--bg2)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '10px' }}
              >
                <option value="1:1">Square (1:1)</option>
                <option value="16:9">Widescreen (16:9)</option>
                <option value="9:16">Vertical Short (9:16)</option>
                <option value="profile">Facebook Profile Image (1:1 Circle Safe)</option>
              </select>
            </div>
          )}
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ alignSelf: 'flex-start', padding: '12px 32px' }}
        >
          {loading ? 'Generating Creative Assets...' : 'Generate Assets'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '14px' }}>✨ Generation Result</h4>
          <div style={{ maxWidth: '400px', margin: '0 auto', overflow: 'hidden', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)', background: '#000' }}>
            {result.media_type === 'image' ? (
              <img src={result.media_url} alt={result.prompt} style={{ width: '100%', display: 'block' }} />
            ) : (
              <video src={result.media_url} controls autoPlay loop style={{ width: '100%', display: 'block' }} />
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={() => handlePortAsset(result, 'epk')}
              className="btn-secondary" 
              style={{ fontSize: '11.5px', padding: '6px 14px' }}
            >
              🎨 Set as EPK Cover
            </button>
            <button 
              type="button" 
              onClick={() => handlePortAsset(result, 'cms')}
              className="btn-secondary" 
              style={{ fontSize: '11.5px', padding: '6px 14px' }}
            >
              🌐 Set as CMS Hero
            </button>
            {result.media_type === 'image' && (
              <button 
                type="button" 
                onClick={() => handlePortAsset(result, 'sync')}
                className="btn-secondary" 
                style={{ fontSize: '11.5px', padding: '6px 14px' }}
              >
                🎵 Send to Sync Pitch
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= SAVED CREATIVE ASSET MANAGER ================= */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '40px', paddingTop: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>
              📜 Saved Creative Asset Manager
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0' }}>
              Manage, stream, reference, and port your visual artwork, audio files, and promo videos.
            </p>
          </div>

          {/* Upload Media / Audio Button */}
          <div>
            <input
              type="file"
              ref={mediaFileInputRef}
              onChange={handleMediaFileUpload}
              accept="audio/*,image/*,video/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => mediaFileInputRef.current?.click()}
              disabled={uploadingMedia}
              style={{
                background: '#00f0ff',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(0,240,255,0.3)'
              }}
            >
              {uploadingMedia ? '⏳ Uploading Media...' : '🎵 Upload Audio / Media File'}
            </button>
          </div>
        </div>

        {/* Media Type Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Assets (${assets.length})` },
            { id: 'image', label: `Images (${assets.filter(a => a.media_type === 'image').length})` },
            { id: 'video', label: `Videos (${assets.filter(a => a.media_type === 'video').length})` },
            { id: 'audio', label: `Audio Stems & Files (${assets.filter(a => a.media_type === 'audio').length})` }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setAssetFilter(f.id)}
              style={{
                background: assetFilter === f.id ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                color: assetFilter === f.id ? '#000' : '#cbd5e1',
                border: assetFilter === f.id ? 'none' : '1px solid rgba(255,255,255,0.12)',
                padding: '5px 14px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredAssets.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
              No {assetFilter !== 'all' ? assetFilter : ''} assets found in cloud vault. Use the generator above or click "Upload Audio / Media File" to store content.
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="glass-panel" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: '6px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(15, 23, 42, 0.4)'
                }}
              >
                {/* Media Surface */}
                <div style={{ position: 'relative', width: '100%', height: '140px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {asset.media_type === 'image' ? (
                    <img 
                      src={asset.media_url} 
                      alt={asset.prompt} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : asset.media_type === 'video' ? (
                    <video 
                      src={asset.media_url} 
                      controls
                      muted
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    /* Audio file media surface */
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, #091224 0%, #1e1b4b 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      gap: '8px'
                    }}>
                      <div style={{ fontSize: '28px' }}>🎵</div>
                      <audio controls src={asset.media_url} style={{ width: '92%', height: '34px' }} />
                    </div>
                  )}

                  <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '9px', fontWeight: 'bold', background: 'rgba(0,0,0,0.7)', color: 'var(--cyan)', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>
                    {asset.media_type}
                  </span>
                </div>

                {/* Metadata & Actions */}
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    {editingAssetId === asset.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <textarea
                          value={editingPrompt}
                          onChange={(e) => setEditingPrompt(e.target.value)}
                          rows={2}
                          style={{ width: '100%', background: 'var(--bg)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', fontSize: '11.5px', padding: '6px', resize: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            type="button" 
                            onClick={() => handleUpdateAsset(asset.id)}
                            className="btn-primary" 
                            style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingAssetId(null)}
                            className="btn-secondary" 
                            style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ color: '#e2e8f0', fontSize: '12px', margin: '0 0 6px 0', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                          "{asset.original_filename || asset.prompt}"
                        </p>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '9.5px', color: '#64748b' }}>
                          <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                          {asset.duration && <span>• {Math.round(asset.duration)}s</span>}
                          {asset.file_size && <span>• {Math.round(asset.file_size / 1024)} KB</span>}
                        </div>
                      </>
                    )}
                  </div>

                  {editingAssetId !== asset.id && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                      {/* Port or Stream Actions */}
                      {asset.media_type === 'audio' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (typeof onPlayTrack === 'function') {
                                onPlayTrack({
                                  title: asset.original_filename || asset.prompt || 'Creator Audio Stem',
                                  artist: sessionUser?.artist_name || 'Ndufo',
                                  audioUrl: asset.media_url,
                                  coverBg: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                                  coverText: 'AUDIO'
                                });
                              }
                            }}
                            className="btn-primary"
                            style={{ fontSize: '9.5px', padding: '5px' }}
                          >
                            ▶ Stream
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(asset.media_url);
                              alert('Audio streaming URL copied to clipboard!');
                            }}
                            className="btn-secondary"
                            style={{ fontSize: '9.5px', padding: '5px' }}
                          >
                            📋 Copy Link
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                          <button 
                            type="button" 
                            onClick={() => handlePortAsset(asset, 'epk')}
                            className="btn-secondary" 
                            style={{ fontSize: '9.5px', padding: '4px' }}
                          >
                            EPK Cover
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handlePortAsset(asset, 'cms')}
                            className="btn-secondary" 
                            style={{ fontSize: '9.5px', padding: '4px' }}
                          >
                            CMS Hero
                          </button>
                        </div>
                      )}

                      {asset.media_type === 'image' && (
                        <button 
                          type="button" 
                          onClick={() => handlePortAsset(asset, 'sync')}
                          className="btn-secondary" 
                          style={{ fontSize: '9.5px', padding: '4px', width: '100%' }}
                        >
                          🎵 Send to Sync Pitch
                        </button>
                      )}

                      {/* CRUD Actions */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        <button 
                          type="button" 
                          onClick={() => { setEditingAssetId(asset.id); setEditingPrompt(asset.prompt); }}
                          style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#cbd5e1', fontSize: '10px', padding: '4px', cursor: 'pointer' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDeleteAsset(asset.id)}
                          style={{ flex: 1, background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '3px', color: '#ef4444', fontSize: '10px', padding: '4px', cursor: 'pointer' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ================= Track D: CRM Campaigns Panel =================
function CrmPanel({ sessionUser }) {
  return (
    <div className="dashboard-card" style={{ width: '100%', height: 'calc(100vh - 180px)', padding: 0, overflow: 'hidden', background: '#070a13', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
      <SmartCrmStudioPanel sessionUser={sessionUser} />
    </div>
  );
}

// ================= Track D: CMS Layouts & Rollbacks Panel =================
function CmsPanel({ sessionUser, epk, setEpk, tracks, initialTab = 'music', onSwitchToWizard }) {
  return (
    <DashboardCmsStudio 
      sessionUser={sessionUser}
      epk={epk}
      setEpk={setEpk}
      tracks={tracks}
      initialTab={initialTab}
      onSwitchToWizard={onSwitchToWizard}
    />
  );
}

// ================= Track D: EPK Builder Panel (Dual Mode & Intermaven Protocol) =================
function EpkBuilderIframePanel({ tracks, epk, setEpk, sessionUser, setActiveTab }) {
  const [viewMode, setViewMode] = useState('native');
  const targetUrl = getIntermavenUrl('epk-builder');

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Protocol Control Header Bar */}
      <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 18px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
          <strong style={{ color: '#fff', fontSize: '13px' }}>Intermaven EPK Builder Engine</strong>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Syncing with intermaven.io</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button 
            type="button"
            onClick={() => setViewMode('native')}
            style={{ background: viewMode === 'native' ? '#00f0ff' : 'transparent', color: viewMode === 'native' ? '#000' : '#cbd5e1', border: 'none', padding: '6px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}
          >
            Native Builder
          </button>
          <button 
            type="button"
            onClick={() => setViewMode('cloud')}
            style={{ background: viewMode === 'cloud' ? '#00f0ff' : 'transparent', color: viewMode === 'cloud' ? '#000' : '#cbd5e1', border: 'none', padding: '6px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}
          >
            🌎 intermaven.io Embed
          </button>
        </div>
      </div>

      {viewMode === 'native' ? (
        <EPKBuilderPanel tracks={tracks} epk={epk} setEpk={setEpk} sessionUser={sessionUser} setActiveTab={setActiveTab} />
      ) : (
        <div className="dashboard-card" style={{ width: '100%', height: 'calc(100vh - 230px)', padding: 0, overflow: 'hidden', background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
          <iframe
            src={targetUrl}
            title="Intermaven EPK Builder Cloud Embed"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#0f172a'
            }}
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
}

export default App;
