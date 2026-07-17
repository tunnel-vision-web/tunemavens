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
import { RiMusicFill, RiGlobalFill, RiBarChartFill, RiCheckboxCircleFill, RiFlashlightFill, RiShieldFill, RiArrowRightFill, RiArrowLeftFill, RiLockFill, RiDatabase2Fill, RiStackFill, RiSettings3Fill, RiTerminalFill, RiRadioFill, RiFileTextFill, RiKey2Fill, RiRefreshFill, RiCpuFill, RiQuestionFill, RiArrowDownSFill, RiArrowLeftSFill, RiArrowRightSFill, RiMenuFill, RiCloseFill, RiMessage2Fill, RiBookOpenFill, RiCoinsFill, RiBellFill, RiUserFill, RiLogoutBoxRFill, RiExternalLinkFill, RiSmartphoneFill, RiDownloadFill, RiHomeFill, RiAppleFill, RiBankCardFill, RiHeadphoneFill, RiLineChartFill, RiResetLeftFill, RiSendPlaneFill, RiGroupFill as UsersIcon, RiPenNibFill, RiLinksFill, RiMailFill, RiPlayFill, RiDiscFill, RiMicFill, RiEqualizerFill, RiWifiFill, RiFolderAddFill, RiTicket2Fill, RiStarFill, RiPauseFill } from 'react-icons/ri'

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
  const [activeTab, setActiveTab] = useState('home');
  const [userCredits, setUserCredits] = useState(sessionUser?.credits || 600);
  const [payoutBalance, setPayoutBalance] = useState(4235.80);
  const [collapsed, setCollapsed] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState(null);
  const [activeModalApp, setActiveModalApp] = useState(null);

  // Fetch onboarding on mount so the OnboardingStripe knows whether the wizard
  // has been completed.
  useEffect(() => {
    if (!sessionUser) return;
    usersApi.getOnboarding()
      .then((o) => setWizardAnswers(o))
      .catch(() => setWizardAnswers(null));
  }, [sessionUser?.id]);

  // Log tab-visit activity signals  -  the recommendation engine uses them.
  useEffect(() => {
    if (!sessionUser || !activeTab) return;
    usersApi.logActivity({ kind: 'tab_visit', ref: activeTab });
  }, [activeTab, sessionUser?.id]);

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
            userCredits={userCredits} 
            payoutBalance={payoutBalance}
            setUserCredits={setUserCredits}
            setActiveTab={setActiveTab}
          />
        );
      case 'catalog':
        return (
          <CatalogPortingPanel 
            setActiveTab={setActiveTab} 
            tracks={catalogTracks} 
            setTracks={setCatalogTracks} 
          />
        );
      case 'epk-builder':
        return (
          <EPKBuilderPanel 
            tracks={catalogTracks} 
            epk={creatorEpk} 
            setEpk={setCreatorEpk} 
          />
        );
      case 'splits':
        return (
          <SplitCascadePanel 
            payoutBalance={payoutBalance} 
            setPayoutBalance={setPayoutBalance} 
            ledgerRows={ledgerRows}
            setLedgerRows={setLedgerRows}
          />
        );
      case 'djpool':
        return <DjPoolPanel />;
      case 'sync':
        return <SyncLicensingPanel />;
      case 'escrow':
        return (
          <EscrowContractsPanel 
            payoutBalance={payoutBalance} 
            setPayoutBalance={setPayoutBalance} 
          />
        );
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
        return <SocialAiPanel setActiveTab={setActiveTab} />;
      case 'crm':
        return <CrmPanel />;
      case 'cms':
        return <CmsPanel />;
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
      catalog: { id: 'catalog', label: 'Catalog Porting', icon: RiDatabase2Fill, category: 'Catalog & IP' },
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
      'app-marketplace': { id: 'app-marketplace', label: 'App Marketplace', icon: RiFlashlightFill, category: 'Apps & Marketplace' },
      'social-ai': { id: 'social-ai', label: 'Social AI Studio', icon: RiCpuFill, category: 'Creator Tools' },
      crm: { id: 'crm', label: 'CRM Campaigns', icon: RiMessage2Fill, category: 'Admin' },
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
      // Check if this tab is a marketplace app, and if so, only show if activated.
      if (APP_SLUGS[k]) {
        const activeApps = sessionUser?.apps || [];
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
        <div className="dashboard-sidebar-scroll" data-testid="dashboard-sidebar-scroll">
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
            onClick={() => setCollapsed(!collapsed)} 
            className="dashboard-nav-item collapse-toggle-btn"
            style={{ border: 'none', background: 'transparent', padding: '6px', justifyContent: 'center', width: '100%', marginBottom: '16px', color: '#94a3b8' }}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
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
                          const isInterApp = ['crm', 'cms'].includes(item.id);
                          if (isInterApp) {
                            const targetUrl = getIntermavenUrl(item.id === 'crm' ? 'intermaven-smart-crm' : 'cms');
                            setActiveModalApp({ url: targetUrl, title: item.label });
                          } else {
                            setActiveTab(item.id);
                          }
                        }} 
                        className={`dashboard-nav-item ${activeTab === item.id && !['crm', 'cms'].includes(item.id) ? 'active' : ''}`}
                        title={item.label}
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
                title="Back to Home Site"
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
                  ⚙️ {sessionUser.role || 'creator'}
                </span>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout} 
            className="dashboard-nav-item" 
            style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
            title="Log Out"
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
              animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              background: 'rgba(15, 23, 42, 0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: 'var(--cyan)',
                  boxShadow: '0 0 8px var(--cyan)'
                }} />
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.5px' }}>
                  {activeModalApp.title}
                </h3>
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
            
            {/* Modal Body / Iframe */}
            <div style={{ flex: 1, position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
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
    </div>
  );
}

// ================= Onboarding Stripe  -  top-of-dashboard checklist =================
// Shows the user what's still missing in their setup. Status derives live from
// what's actually in Mongo (publishing_deals, distribution_deals, users.apps),
// so the stripe shrinks naturally as the user completes each step.
// Phase 3 dashboard components (extracted for maintainability).
import {
  OnboardingStripe, OnboardingWizardModal, RecommendationHero,
  PublishingElectionPanel, DistributionElectionPanel, ContractDrawer,
  AppMarketplacePanel, PanelHeader,
} from './components/phase3.jsx'



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
          borderRadius: '4px'
        }}
      />
      <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '13px', pointerEvents: 'none' }}>
        🔍
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
          style={{ padding: '4px 8px', fontSize: '11px', height: '26px', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          Prev
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={p === currentPage ? 'btn-primary' : 'plan-btn outline'}
            style={{ padding: '4px 8px', fontSize: '11px', height: '26px', minWidth: '26px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="plan-btn outline"
          style={{ padding: '4px 8px', fontSize: '11px', height: '26px', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
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
    { id: 2, title: 'Lagos Lights', artist: 'Caleb', source: 'tipped', cached: false },
    { id: 3, title: 'Mombasa Midnight', artist: 'DJ Afro', source: 'streamed', cached: true },
    { id: 4, title: 'Jozi Underground', artist: 'Lerato', source: 'purchased', cached: false },
  ]);
  const toggleCache = (id) => setTracks(ts => ts.map(t => t.id === id ? { ...t, cached: !t.cached } : t));
  const removeTrack = (id) => setTracks(ts => ts.filter(t => t.id !== id));
  return (
    <div className="dashboard-card">
      <PanelHeader title="My Library" desc="Manage what's saved on this account. Cache toggles propagate to your phone within 30 seconds." />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
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
                    <button className="plan-btn outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => adjustStock(i.id, -1)} data-testid={`pos-stock-dec-${i.id}`}>−</button>
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

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onUpdateUser({
        ...sessionUser,
        name,
        email,
        brand_name: brandName,
        country,
        bio
      });
      alert('Profile settings updated successfully!');
    }, 1000);
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

// ================= SUB-PANEL: EPK Builder =================
function EPKBuilderPanel({ tracks, epk, setEpk }) {
  const [subdomain, setSubdomain] = useState(epk.subdomain || '');
  const [headline, setHeadline] = useState(epk.headline || '');
  const [themeBg, setThemeBg] = useState(epk.themeBg || '');
  const [featuredTrackIsrc, setFeaturedTrackIsrc] = useState(epk.featuredTrackIsrc || '');
  const [spotify, setSpotify] = useState(epk.spotify || '');
  const [instagram, setInstagram] = useState(epk.instagram || '');
  const [soundcloud, setSoundcloud] = useState(epk.soundcloud || '');
  const [bookingEmail, setBookingEmail] = useState(epk.bookingEmail || '');
  const [pressOutlet, setPressOutlet] = useState(epk.pressOutlet || '');
  const [pressQuote, setPressQuote] = useState(epk.pressQuote || '');
  const [bio, setBio] = useState(epk.bio || '');
  const [saving, setSaving] = useState(false);

  const [portedAsset, setPortedAsset] = useState(() => sessionStorage.getItem('ported_asset_url'));

  const handleApplyPortedAsset = () => {
    setThemeBg(`url("${portedAsset}") center/cover`);
    sessionStorage.removeItem('ported_asset_url');
    setPortedAsset(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEpk({
        subdomain,
        headline,
        themeBg,
        featuredTrackIsrc,
        spotify,
        instagram,
        soundcloud,
        bookingEmail,
        pressOutlet,
        pressQuote,
        bio
      });
      alert('Intermaven Standard EPK published & synchronized successfully!');
    }, 1200);
  };

  const selectedTrack = tracks.find(t => t.isrc === featuredTrackIsrc) || tracks[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', textAlign: 'left' }}>
      
      {/* Form column */}
      <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>Intermaven Standard EPK Builder</h3>
            <p style={{ fontSize: '11.5px', color: 'var(--mu)', margin: '4px 0 0' }}>Configure your Electronic Press Kit profile & subdomain portal.</p>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--cyan)', background: 'rgba(34,211,238,0.08)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Core EPK v2.1
          </span>
        </div>

        {portedAsset && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(34, 211, 238, 0.06)', border: '1px solid rgba(34, 211, 238, 0.20)', padding: '12px 18px', borderRadius: '4px', marginBottom: '8px' }}>
            <div style={{ flex: 1, fontSize: '12.5px', color: '#cbd5e1' }}>
              🎨 <strong>Ported Asset Detected:</strong> You have a generated artwork from your Social AI Studio ready.
            </div>
            <button type="button" onClick={handleApplyPortedAsset} className="btn-secondary" style={{ background: 'var(--cyan)', color: '#000', padding: '6px 12px', fontSize: '11px', fontWeight: 'bold', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
              Apply as EPK Cover
            </button>
            <button type="button" onClick={() => { sessionStorage.removeItem('ported_asset_url'); setPortedAsset(null); }} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', marginLeft: '6px' }}>
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Subdomain */}
          <div>
            <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>EPK Subdomain Mapping</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <span style={{ fontSize: '12px', color: 'var(--mu)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>https://</span>
              <input 
                type="text" 
                value={subdomain} 
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="form-control"
                style={{ flex: 1, border: 'none', background: 'none', color: '#fff', padding: '8px 12px', fontSize: '13px' }}
                placeholder="subdomain"
                required
              />
              <span style={{ fontSize: '12px', color: 'var(--cyan)', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderLeft: '1px solid rgba(255,255,255,0.06)', fontWeight: 'bold' }}>.tunemavens.com</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--mu)', marginTop: '4px', display: 'block' }}>
              Also resolves to <strong>{subdomain || 'yoursubdomain'}.intermaven.io</strong> via shared network profile.
            </span>
          </div>

          {/* Headline & Background */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Headline / Punchline</label>
              <input 
                type="text" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)} 
                className="form-control" 
                style={{ width: '100%', fontSize: '12.5px', padding: '8px' }} 
                required 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>EPK Cover Background CSS</label>
              <input 
                type="text" 
                value={themeBg} 
                onChange={(e) => setThemeBg(e.target.value)} 
                className="form-control" 
                style={{ width: '100%', fontSize: '12.5px', padding: '8px' }} 
                required 
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Biography</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="form-control" 
              style={{ width: '100%', fontSize: '12.5px', padding: '8px', height: '60px', resize: 'none' }}
              required
            />
          </div>

          {/* Featured Showcase Track selection */}
          <div>
            <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Featured Showcase Track</label>
            <select 
              value={featuredTrackIsrc} 
              onChange={(e) => setFeaturedTrackIsrc(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: '#0a0f1d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12.5px', padding: '8px' }}
            >
              {tracks.map(t => (
                <option key={t.isrc} value={t.isrc}>{t.title} ({t.artist})</option>
              ))}
            </select>
          </div>

          {/* Press Review Quote */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Press Outlet</label>
              <input 
                type="text" 
                value={pressOutlet} 
                onChange={(e) => setPressOutlet(e.target.value)} 
                className="form-control" 
                style={{ width: '100%', fontSize: '12.5px', padding: '8px' }} 
                placeholder="Pitchfork" 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Review / Press Quote</label>
              <input 
                type="text" 
                value={pressQuote} 
                onChange={(e) => setPressQuote(e.target.value)} 
                className="form-control" 
                style={{ width: '100%', fontSize: '12.5px', padding: '8px' }} 
                placeholder="Outstanding track delivery..." 
              />
            </div>
          </div>

          {/* Social Links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
            <span style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Social Networks & Contact</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="text" placeholder="Spotify URL" value={spotify} onChange={(e) => setSpotify(e.target.value)} className="form-control" style={{ fontSize: '11.5px', padding: '6px' }} />
              <input type="text" placeholder="Soundcloud URL" value={soundcloud} onChange={(e) => setSoundcloud(e.target.value)} className="form-control" style={{ fontSize: '11.5px', padding: '6px' }} />
              <input type="text" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="form-control" style={{ fontSize: '11.5px', padding: '6px' }} />
              <input type="email" placeholder="Booking Contact Email" value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="form-control" style={{ fontSize: '11.5px', padding: '6px' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary" 
            style={{ width: '100%', padding: '10px', fontSize: '12.5px', marginTop: '6px', fontWeight: 'bold' }}
          >
            {saving ? 'Publishing EPK to DNS...' : 'Publish & Sync EPK'}
          </button>
        </form>
      </div>

      {/* Live Preview column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '12px', color: 'var(--mu)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Live EPK Resolving Preview
        </h4>

        {/* Replica EPK Portal */}
        <div style={{
          background: '#070a13',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '420px',
          color: '#fff'
        }}>
          {/* Header Banner */}
          <div style={{ background: themeBg, padding: '24px 16px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '8px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '2px' }}>
              {subdomain || 'aisha'}.tunemavens.com
            </div>
            
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid #fff',
              margin: '0 auto 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '900',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              A
            </div>
            <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>Aisha Okoro</h3>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{headline || 'Headline Statement'}</span>
          </div>

          {/* Bio block */}
          <div style={{ padding: '16px', fontSize: '11.5px', color: 'var(--mu)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ margin: 0, lineHeight: '1.4' }}>{bio || 'Biography content...'}</p>
          </div>

          {/* Featured Showcase Item */}
          {selectedTrack && (
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                Featured Audio Master
              </span>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '3px',
                  background: selectedTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '7px',
                  color: '#fff',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {selectedTrack.coverText || 'Art'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: '11.5px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedTrack.title}</strong>
                  <span style={{ fontSize: '9.5px', color: 'var(--mu)' }}>{selectedTrack.artist} • {selectedTrack.genre}</span>
                </div>
                <button 
                  onClick={() => alert(`Play featured master track from EPK Showcase`)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--cyan)',
                    color: '#000',
                    cursor: 'pointer',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ▶
                </button>
              </div>
            </div>
          )}

          {/* Press Review Quote */}
          {pressQuote && (
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '11px', color: '#cbd5e1' }}>
              <p style={{ margin: '0 0 4px', fontStyle: 'italic' }}>"{pressQuote}"</p>
              <strong style={{ color: 'var(--cyan)', fontSize: '9.5px' }}>— {pressOutlet || 'Press Outlet'}</strong>
            </div>
          )}

          {/* Footer & Social Badge */}
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', background: 'rgba(0,0,0,0.2)', fontSize: '11px' }}>
            <span style={{ color: 'var(--mu)', fontSize: '9.5px' }}>Booking: {bookingEmail || 'N/A'}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {spotify && <span style={{ opacity: 0.6, fontSize: '12px' }}>🟢</span>}
              {soundcloud && <span style={{ opacity: 0.6, fontSize: '12px' }}>🟠</span>}
              {instagram && <span style={{ opacity: 0.6, fontSize: '12px' }}>📸</span>}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
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
          stat2Trend: "🗄️ Standard Schema Compliant",
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

// ================= SUB-PANEL: Catalog & Porting (Phase 4) =================
function CatalogPortingPanel({ setActiveTab, tracks, setTracks }) {
  const [selectedPreset, setSelectedPreset] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errors, setErrors] = useState([]);

  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Single Track Uploader Form States
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGenre, setNewGenre] = useState('Afro-House');
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

  // Inline editing states
  const [editingIsrc, setEditingIsrc] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editSplit, setEditSplit] = useState('');
  const [editCoverBg, setEditCoverBg] = useState('');
  const [editCoverText, setEditCoverText] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  const startEdit = (tr) => {
    setEditingIsrc(tr.isrc);
    setEditTitle(tr.title);
    setEditArtist(tr.artist);
    setEditGenre(tr.genre);
    setEditSplit(tr.split);
    setEditCoverBg(tr.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)');
    setEditCoverText(tr.coverText || 'Art');
    setEditFeatured(tr.isFeatured || false);
  };

  const saveEdit = (isrc) => {
    if (!editTitle.trim() || !editArtist.trim()) {
      alert('Title and Artist fields cannot be empty.');
      return;
    }
    setTracks(prev => prev.map(t => {
      if (t.isrc === isrc) {
        return {
          ...t,
          title: editTitle,
          artist: editArtist,
          genre: editGenre,
          split: editSplit,
          coverBg: editCoverBg,
          coverText: editCoverText,
          isFeatured: editFeatured
        };
      }
      return t;
    }));
    setEditingIsrc(null);
  };

  const cancelEdit = () => {
    setEditingIsrc(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    setLoading(true);
    setValidationResult(null);
    setErrors([]);
    
    // Simulate parsing metadata files
    setTimeout(() => {
      setLoading(false);
      setValidationResult('pass');
      const newTracksList = files.map((file, index) => {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        const words = cleanName.split(" ");
        const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const isrcNum = 45682 + index + tracks.length;
        // Generate random gradients for new ingested files
        const grads = [
          'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)',
          'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
        ];
        const coverBg = grads[Math.floor(Math.random() * grads.length)];
        const coverText = title.split(' ')[0] || 'Single';
        return {
          isrc: `US-123-${isrcNum}`,
          title: title || 'Ingested Audio Track',
          artist: 'Aisha Okoro',
          split: 'Artist (60%) / Producer (40%)',
          genre: 'Amapiano',
          status: 'valid',
          coverBg,
          coverText
        };
      });
      
      setTracks(prev => [...newTracksList, ...prev]);
      setUploadedFiles(prev => [...files.map(f => f.name), ...prev]);
      setCurrentPage(1);
      alert(`Successfully ingested ${files.length} audio file(s) into your catalog!`);
    }, 1200);
  };

  const handleValidate = () => {
    setLoading(true);
    setValidationResult(null);
    setErrors([]);

    setTimeout(() => {
      setLoading(false);
      if (selectedPreset === 'standard') {
        setValidationResult('pass');
        const standardTracks = [
          { isrc: 'US-123-45678', title: 'Midnight Grooves', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (30%) / Label (20%)', genre: 'Afro-House', status: 'valid', coverBg: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', coverText: 'Midnight' },
          { isrc: 'US-123-45679', title: 'Neon Shadows', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Deep-House', status: 'valid', coverBg: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)', coverText: 'Shadows' },
          { isrc: 'US-123-45680', title: 'Nairobi Sunset', artist: 'Aisha Okoro', split: 'Artist (40%) / Label (60%)', genre: 'Amapiano', status: 'valid', coverBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', coverText: 'Sunset' },
          { isrc: 'US-123-45681', title: 'Kilimanjaro Vibe', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Afrobeats', status: 'valid', coverBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', coverText: 'Vibe' }
        ];
        // Merge without duplicate ISRCs
        setTracks(prev => {
          const existingIsrcs = prev.map(t => t.isrc);
          const filteredNew = standardTracks.filter(t => !existingIsrcs.includes(t.isrc));
          return [...filteredNew, ...prev];
        });
        setCurrentPage(1);
      } else {
        setValidationResult('fail');
        setErrors([
          "Row 3: ISRC 'US- sunset-80' format invalid. Must match standard format (XX-XXX-XX-XXXXX).",
          "Row 2: Primary artist field cannot be blank for 'Neon Shadows'.",
          "Row 4: Split configuration total must sum to 100%. Currently sums to 80%."
        ]);
      }
    }, 1200);
  };

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!newTitle || !newArtist || !newIsrc) {
      alert('Title, Artist, and ISRC are required.');
      return;
    }
    
    const sum = Number(newArtistSplit) + Number(newProducerSplit) + Number(newLabelSplit);
    if (sum !== 100) {
      alert(`Split configuration total must sum to 100%. Currently sums to ${sum}%.`);
      return;
    }

    const newTrack = {
      isrc: newIsrc,
      title: newTitle,
      artist: newArtist,
      split: `Artist (${newArtistSplit}%) / Producer (${newProducerSplit}%) / Label (${newLabelSplit}%)`,
      genre: newGenre,
      status: 'valid',
      coverBg: newCoverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
      coverText: newCoverText || 'Art'
    };

    setTracks(prev => [newTrack, ...prev]);
    setNewTitle('');
    setNewArtist('');
    setNewIsrc('');
    setNewCoverBg('linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)');
    setNewCoverText('New Release');
    setCurrentPage(1);
    alert('Track manually added to catalog successfully!');
  };

  // Search filter
  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.isrc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination slice
  const paginatedTracks = filteredTracks.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalItems = filteredTracks.length;

  return (
    <div>
      <div className="dashboard-panel-header">
        <h2>Catalogue & Ingestion Center</h2>
        <p>Upload audio files, import CSV release sheets, or manually catalog tracks with split ownership definitions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CSV Bulk Ingest */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '14px', color: '#fff' }}>CSV Metadata Ingestion</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Select Preset Metadata CSV</label>
              <select 
                value={selectedPreset} 
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', padding: '6px' }}
              >
                <option value="standard">Release_Metadata_Standard.csv (Correct)</option>
                <option value="corrupted">Release_Metadata_Invalid.csv (Has Errors)</option>
              </select>
            </div>

            <button 
              onClick={handleValidate} 
              disabled={loading}
              className="btn-primary" 
              style={{ width: '100%', padding: '8px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {loading ? 'Running Schema Checks...' : 'Validate and Ingest CSV'}
            </button>

            {validationResult && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Schema Status:</span>
                  <span className={`badge-status ${validationResult === 'pass' ? 'success' : 'error'}`}>
                    {validationResult === 'pass' ? 'SCHEMA PASSED' : 'SCHEMA FAILED'}
                  </span>
                </div>
                {errors.length > 0 && (
                  <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '4px' }}>
                    <h5 style={{ fontSize: '10px', color: '#ef4444', margin: '0 0 4px 0', fontWeight: 'bold' }}>Errors:</h5>
                    <ul style={{ paddingLeft: '12px', margin: 0 }}>
                      {errors.map((err, i) => (
                        <li key={i} style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '2px' }}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
                border: isDragOver ? '2px dashed var(--green)' : '1px dashed rgba(255,255,255,0.15)',
                padding: '24px 14px', 
                borderRadius: '6px', 
                textAlign: 'center', 
                background: isDragOver ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.01)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input 
                type="file" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📁</span>
              <span style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>Drag & Drop Audio Files Here</span>
              <span style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginTop: '4px' }}>Or click to select multiple WAV, MP3, or FLAC files</span>
            </div>

            {uploadedFiles.length > 0 && (
              <div style={{ marginTop: '12px', maxHeight: '100px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
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
              <input type="text" placeholder="Track Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
              <input type="text" placeholder="Artist" value={newArtist} onChange={(e) => setNewArtist(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
              <input type="text" placeholder="ISRC (e.g. US-123-45688)" value={newIsrc} onChange={(e) => setNewIsrc(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }} required />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <input type="text" placeholder="Art Label (e.g. Midnight)" value={newCoverText} onChange={(e) => setNewCoverText(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '5px' }} />
                <input type="text" placeholder="Art Background CSS" value={newCoverBg} onChange={(e) => setNewCoverBg(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '5px' }} />
              </div>

              <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '6px' }}>
                <option value="Afro-House">Afro-House</option>
                <option value="Deep-House">Deep-House</option>
                <option value="Amapiano">Amapiano</option>
                <option value="Afrobeats">Afrobeats</option>
              </select>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Revenue Split Allocations (%)</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '9px', color: 'var(--mu)' }}>Artist</label>
                    <input type="number" min="0" max="100" value={newArtistSplit} onChange={(e) => setNewArtistSplit(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: 'var(--mu)' }}>Producer</label>
                    <input type="number" min="0" max="100" value={newProducerSplit} onChange={(e) => setNewProducerSplit(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '4px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '9px', color: 'var(--mu)' }}>Label</label>
                    <input type="number" min="0" max="100" value={newLabelSplit} onChange={(e) => setNewLabelSplit(e.target.value)} className="form-control" style={{ fontSize: '11px', padding: '4px' }} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '12px', marginTop: '6px' }}>Catalog Track</button>
            </form>
          </div>
        </div>

        {/* Catalog previews */}
        <div className="dashboard-card" style={{ minHeight: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>Roster Catalogue Overview</h3>
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
                    <th>Art</th>
                    <th>Featured</th>
                    <th>ISRC</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Genre</th>
                    <th>Split Structures</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTracks.map((tr, idx) => {
                    const isEditing = editingIsrc === tr.isrc;
                    return (
                      <tr key={idx}>
                        {isEditing ? (
                          <>
                            <td>
                              <input 
                                type="text" 
                                value={editCoverText} 
                                onChange={(e) => setEditCoverText(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '10px', padding: '2px', width: '56px', marginBottom: '2px' }} 
                                placeholder="Text"
                              />
                              <input 
                                type="text" 
                                value={editCoverBg} 
                                onChange={(e) => setEditCoverBg(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '10px', padding: '2px', width: '56px' }} 
                                placeholder="Bg CSS"
                              />
                            </td>
                            <td>
                              <input 
                                type="checkbox" 
                                checked={editFeatured} 
                                onChange={(e) => setEditFeatured(e.target.checked)} 
                                style={{ cursor: 'pointer' }}
                              />
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--cyan)' }}>{tr.isrc}</td>
                            <td>
                              <input 
                                type="text" 
                                value={editTitle} 
                                onChange={(e) => setEditTitle(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '12px', padding: '4px', width: '100%' }} 
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={editArtist} 
                                onChange={(e) => setEditArtist(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '12px', padding: '4px', width: '100%' }} 
                              />
                            </td>
                            <td>
                              <select 
                                value={editGenre} 
                                onChange={(e) => setEditGenre(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '11px', padding: '4px', width: '100%', background: '#0a0f1d', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }}
                              >
                                <option value="Afro-House">Afro-House</option>
                                <option value="Deep-House">Deep-House</option>
                                <option value="Amapiano">Amapiano</option>
                                <option value="Afrobeats">Afrobeats</option>
                              </select>
                            </td>
                            <td>
                              <input 
                                type="text" 
                                value={editSplit} 
                                onChange={(e) => setEditSplit(e.target.value)} 
                                className="form-control" 
                                style={{ fontSize: '12px', padding: '4px', width: '100%' }} 
                              />
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                <button 
                                  className="plan-btn cyan" 
                                  style={{ padding: '2px 8px', fontSize: '11px', height: '26px', borderRadius: '3px', cursor: 'pointer', border: 'none', background: 'var(--cyan)', color: '#000', fontWeight: 'bold' }}
                                  onClick={() => saveEdit(tr.isrc)}
                                >
                                  Save
                                </button>
                                <button 
                                  className="plan-btn outline" 
                                  style={{ padding: '2px 8px', fontSize: '11px', height: '26px', borderRadius: '3px', cursor: 'pointer' }}
                                  onClick={cancelEdit}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '4px',
                                background: tr.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px',
                                color: '#fff',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textAlign: 'center',
                                padding: '2px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {tr.coverText || 'Art'}
                              </div>
                            </td>
                            <td>
                              <button 
                                onClick={() => {
                                  setTracks(prev => prev.map(t => t.isrc === tr.isrc ? { ...t, isFeatured: !t.isFeatured } : t))
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  opacity: tr.isFeatured ? 1 : 0.25,
                                  transition: 'opacity 0.2s ease',
                                  outline: 'none'
                                }}
                                title={tr.isFeatured ? "Unmark as featured" : "Mark as featured"}
                              >
                                ⭐
                              </button>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--cyan)' }}>{tr.isrc}</td>
                            <td style={{ fontWeight: '700', color: '#fff' }}>{tr.title}</td>
                            <td>{tr.artist}</td>
                            <td>
                              <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {tr.genre}
                              </span>
                            </td>
                            <td style={{ fontSize: '11px', color: '#cbd5e1' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <div>{tr.split}</div>
                                <div style={{ width: '100px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)', display: 'flex', overflow: 'hidden' }}>
                                  <div style={{ width: '50%', background: 'var(--green)' }} />
                                  <div style={{ width: '30%', background: 'var(--cyan)' }} />
                                  <div style={{ width: '20%', background: 'var(--purple)' }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                <button 
                                  className="plan-btn outline" 
                                  style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer', color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.3)' }}
                                  onClick={() => startEdit(tr)}
                                  title="Edit track metadata inline"
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="plan-btn outline" 
                                  style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer' }}
                                  onClick={() => setActiveTab('splits')}
                                  title="Go to Royalty splits ledger"
                                >
                                  💸 Splits
                                </button>
                                <button 
                                  className="plan-btn outline" 
                                  style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer' }}
                                  onClick={() => setActiveTab('sync')}
                                  title="Go to Sync brief matching"
                                >
                                  🎬 Sync
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
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
    { value: 'fill_dancefloor', label: '🔥 Fills the Dancefloor' },
    { value: 'keep_crowd', label: '🎵 Keeps the Crowd Moving' },
    { value: 'room_cooler', label: '❄️ Too Slow for the Room' },
    { value: 'peak_moment', label: '⚡ Peak Hour Banger' },
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
        {tabBtn('clearance', 'Clearance Hub', '📋')}
        {tabBtn('upload', 'Drop a Promo', '⬆️')}
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
          {/* ── PROMO POOL TAB ── */}
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
                              🌍 {track.allowed_regions.join(', ')} only
                            </span>
                          )}
                          {track.feedback_submitted && (
                            <span style={{ fontSize: '11px', background: 'rgba(34,197,94,0.12)', color: '#86efac', padding: '2px 8px', borderRadius: '99px', fontWeight: '700' }}>✓ Reviewed</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>By <strong style={{ color: '#94a3b8' }}>{track.artist}</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>⏱ <strong style={{ color: '#94a3b8' }}>{track.bpm} BPM</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>🎵 Key <strong style={{ color: '#94a3b8' }}>{track.key}</strong></span>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>⬇️ <strong style={{ color: '#94a3b8' }}>{track.downloads_count}</strong> downloads</span>
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
                            <>⭐ Review & Download</>
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

          {/* ── CLEARANCE HUB TAB ── */}
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
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>📝 Request Drop Clearance</h3>
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
                    {submittingClear ? 'Submitting…' : '🔐 Request IP Clearance'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── UPLOAD TAB ── */}
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
                  <button type="submit" disabled={submittingUpload} style={{ padding: '13px', borderRadius: '6px', border: 'none', cursor: submittingUpload ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, var(--cyan), #4f46e5)', color: '#fff', width: '100%', marginTop: '8px' }}>
                    {submittingUpload ? 'Uploading…' : '⬆️ Publish Promo to DJ Pool'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── FEEDBACK GATE MODAL ── */}
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
                      ⭐
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
              <button type="submit" disabled={submittingFeedback || !feedbackText.trim()} style={{ padding: '13px', borderRadius: '6px', border: 'none', cursor: (submittingFeedback || !feedbackText.trim()) ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', background: 'linear-gradient(135deg, var(--cyan), #4f46e5)', color: '#fff', opacity: (submittingFeedback || !feedbackText.trim()) ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                {submittingFeedback ? 'Submitting…' : '🔓 Submit Review & Download Track'}
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
  catalogTracks
}) {
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);

  // Dragging handlers
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

  if (!globalTrack) return null;

  // Filter featured tracks
  const featuredTracks = catalogTracks.filter(t => t.isFeatured);
  const playPool = featuredTracks.length > 0 ? featuredTracks : catalogTracks;

  const handleNext = () => {
    if (playPool.length <= 1) return;
    const currentIdx = playPool.findIndex(t => t.isrc === globalTrack.isrc);
    const nextIdx = (currentIdx + 1) % playPool.length;
    setGlobalTrack(playPool[nextIdx]);
    setGlobalProgress(0);
  };

  const handlePrev = () => {
    if (playPool.length <= 1) return;
    const currentIdx = playPool.findIndex(t => t.isrc === globalTrack.isrc);
    const prevIdx = (currentIdx - 1 + playPool.length) % playPool.length;
    setGlobalTrack(playPool[prevIdx]);
    setGlobalProgress(0);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Minimized state rendering
  if (isMinimized) {
    if (isUndocked) {
      // Minimized Floating player
      return (
        <div 
          className="drag-handle"
          onMouseDown={handleMouseDown}
          style={{
            position: 'fixed',
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
            width: '230px',
            height: '46px',
            background: 'rgba(10, 15, 30, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '23px',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px 0 16px',
            color: '#fff',
            cursor: 'move',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '12px', animation: globalPlaying ? 'spin 4s linear infinite' : 'none', display: 'inline-block' }}>💿</span>
            <span style={{ fontSize: '11px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>
              {globalTrack.title}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setGlobalPlaying(!globalPlaying); }}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '11px', padding: '4px' }}
            >
              {globalPlaying ? '⏸' : '▶'}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '8px',
                cursor: 'pointer',
                padding: '2px 6px',
                fontWeight: 'bold'
              }}
              title="Expand player"
            >
              Expand ▲
            </button>
          </div>
        </div>
      );
    } else {
      // Minimized Bottom player (centered pill overlay)
      return (
        <div 
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '42px',
            padding: '0 10px 0 16px',
            background: 'rgba(7, 14, 27, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: '21px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
            <span style={{ animation: globalPlaying ? 'spin 4s linear infinite' : 'none', display: 'inline-block' }}>💿</span>
            <strong style={{ color: '#fff' }}>{globalTrack.title}</strong>
            <span style={{ color: 'var(--mu)' }}>•</span>
            <span style={{ color: 'var(--mu)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.artist}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button 
              onClick={() => setGlobalPlaying(!globalPlaying)}
              style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontSize: '11px' }}
            >
              {globalPlaying ? '⏸' : '▶'}
            </button>
            <button 
              onClick={() => setIsMinimized(false)}
              style={{
                background: 'var(--cyan)',
                border: 'none',
                borderRadius: '11px',
                color: '#000',
                fontSize: '8px',
                cursor: 'pointer',
                padding: '3px 8px',
                fontWeight: 'bold'
              }}
              title="Expand player"
            >
              Expand ▲
            </button>
          </div>
        </div>
      );
    }
  }

  // Expanded views
  if (isUndocked) {
    return (
      <div 
        style={{
          position: 'fixed',
          left: `${playerPos.x}px`,
          top: `${playerPos.y}px`,
          width: '330px',
          height: '280px',
          background: 'rgba(10, 15, 30, 0.7)',
          backdropFilter: 'blur(16px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
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
          <span>🎵 TuneStream Mini Player</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => setIsMinimized(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '10px',
                cursor: 'pointer',
                padding: '2px 6px'
              }}
              title="Minimize player"
            >
              ➖ Min
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
                padding: '2px 6px'
              }}
              title="Dock to bottom"
            >
              ⬇ Dock
            </button>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '4px',
              background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              fontWeight: 'bold',
              color: '#fff',
              flexShrink: 0,
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              textAlign: 'center',
              overflow: 'hidden',
              padding: '4px'
            }}>
              {globalTrack.coverText || 'Art'}
            </div>
            <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
              <h4 style={{ margin: '0 0 2px 0', fontSize: '13.5px', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.title}</h4>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.artist}</p>
              <span style={{ fontSize: '9px', color: 'var(--cyan)', background: 'rgba(34,211,238,0.06)', padding: '2px 4px', borderRadius: '3px', display: 'inline-block', marginTop: '4px' }}>
                {featuredTracks.length > 0 ? '★ Featured Playlist' : 'All Catalogue'}
              </span>
            </div>
          </div>

          <div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }} onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              setGlobalProgress(Math.floor(percentage * 180));
            }}>
              <div style={{ width: `${(globalProgress / 180) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px', boxShadow: '0 0 6px var(--cyan)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--mu)', marginTop: '4px' }}>
              <span>{formatTime(globalProgress)}</span>
              <span>3:00</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '4px' }}>
            <button 
              className="plan-btn outline"
              onClick={handlePrev}
              style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ⏮
            </button>
            <button 
              onClick={() => setGlobalPlaying(!globalPlaying)}
              className="btn-primary"
              style={{ width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer', border: 'none' }}
            >
              {globalPlaying ? '⏸' : '▶'}
            </button>
            <button 
              className="plan-btn outline"
              onClick={handleNext}
              style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '76px',
        background: 'rgba(7, 14, 27, 0.7)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        color: '#fff'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '30%', minWidth: '180px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '4px',
          background: globalTrack.coverBg || 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8px',
          fontWeight: 'bold',
          color: '#fff',
          overflow: 'hidden',
          padding: '2px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {globalTrack.coverText || 'Art'}
        </div>
        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
          <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.title}</h4>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{globalTrack.artist}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '40%', maxWidth: '500px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={handlePrev}
            style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: '15px' }}
            title="Previous track"
          >
            ⏮
          </button>
          <button 
            onClick={() => setGlobalPlaying(!globalPlaying)}
            className="btn-primary"
            style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', border: 'none', cursor: 'pointer' }}
          >
            {globalPlaying ? '⏸' : '▶'}
          </button>
          <button 
            onClick={handleNext}
            style={{ background: 'none', border: 'none', color: 'var(--mu)', cursor: 'pointer', fontSize: '15px' }}
            title="Next track"
          >
            ⏭
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '9px', color: 'var(--mu)' }}>{formatTime(globalProgress)}</span>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }} onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            setGlobalProgress(Math.floor(percentage * 180));
          }}>
            <div style={{ width: `${(globalProgress / 180) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px' }} />
          </div>
          <span style={{ fontSize: '9px', color: 'var(--mu)' }}>3:00</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%', justifyContent: 'flex-end' }}>
        {featuredTracks.length > 0 && (
          <span style={{ fontSize: '9px', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.3)', padding: '2px 6px', borderRadius: '10px', background: 'rgba(16,185,129,0.05)', fontWeight: 'bold' }}>
            ★ Featured List ({featuredTracks.length})
          </span>
        )}
        <button 
          className="plan-btn outline"
          onClick={() => setIsMinimized(true)}
          style={{ padding: '4px 10px', fontSize: '11px', height: '28px', borderRadius: '4px', cursor: 'pointer' }}
          title="Minimize player"
        >
          ➖ Minimize
        </button>
        <button 
          className="plan-btn outline"
          onClick={() => setIsUndocked(true)}
          style={{ padding: '4px 10px', fontSize: '11px', height: '28px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          title="Undock into mini floating player"
        >
          ↗ Undock
        </button>
      </div>
    </div>
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
        <Navbar sessionUser={sessionUser} />

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

        {/* Detailed Footer similar to Intermaven - with second instance of Logo */}
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

// ================= Main App Component =================
function App() {
  const [sessionUser, setSessionUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('tunemavens_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [catalogTracks, setCatalogTracks] = useState([
    { isrc: 'US-123-45678', title: 'Midnight Grooves', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (30%) / Label (20%)', genre: 'Afro-House', status: 'valid', coverBg: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)', coverText: 'Midnight', isFeatured: true },
    { isrc: 'US-123-45679', title: 'Neon Shadows', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Deep-House', status: 'valid', coverBg: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)', coverText: 'Shadows', isFeatured: false },
    { isrc: 'US-123-45680', title: 'Nairobi Sunset', artist: 'Aisha Okoro', split: 'Artist (40%) / Label (60%)', genre: 'Amapiano', status: 'valid', coverBg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', coverText: 'Sunset', isFeatured: true },
    { isrc: 'US-123-45681', title: 'Kilimanjaro Vibe', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Afrobeats', status: 'valid', coverBg: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', coverText: 'Vibe', isFeatured: false }
  ]);

  const [creatorEpk, setCreatorEpk] = useState({
    subdomain: 'aisha',
    headline: 'Nairobi Electronic Sunset Pioneer',
    themeBg: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
    featuredTrackIsrc: 'US-123-45678',
    spotify: 'https://spotify.com/artist/aisha',
    instagram: 'https://instagram.com/aisha_okoro',
    soundcloud: 'https://soundcloud.com/aisha',
    bookingEmail: 'booking@aishaokoro.com',
    pressOutlet: 'Pitchfork',
    pressQuote: 'Okoro is redefining the contours of Afro-House on a global scale.',
    bio: 'Independent creator on the TuneMavens and Intermaven network.'
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
    return true;
  };

  const addLedgerRow = (row) => {
    setLedgerRows(prev => [row, ...prev]);
  };

  const [globalTrack, setGlobalTrack] = useState(null);
  const [globalPlaying, setGlobalPlaying] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(12);
  const [isUndocked, setIsUndocked] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: window.innerWidth - 380, y: window.innerHeight - 380 });

  useEffect(() => {
    if (catalogTracks.length > 0 && !globalTrack) {
      setGlobalTrack(catalogTracks[0]);
    }
  }, [catalogTracks, globalTrack]);

  useEffect(() => {
    let interval;
    if (globalPlaying) {
      interval = setInterval(() => {
        setGlobalProgress(prev => (prev >= 180 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [globalPlaying]);

  const handleLogin = (user) => {
    setSessionUser(user);
    sessionStorage.setItem('tunemavens_session', JSON.stringify(user));
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
  };

  // Recognises your Intermaven session when you land on the TuneMavens app.
  useEffect(() => {
    let cancelled = false;
    const token = tokenStore.get();
    authApi.me(token).then((user) => {
      if (cancelled) return;
      const merged = { ...user };
      setSessionUser(merged);
      sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
    }).catch(() => {});
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
function SocialAiPanel({ setActiveTab }) {
  const [prompt, setPrompt] = React.useState('');
  const [mediaType, setMediaType] = React.useState('image'); // 'image' | 'video'
  const [aspectRatio, setAspectRatio] = React.useState('1:1');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [result, setResult] = React.useState(null);
  
  // Asset Manager & Porting States
  const [assets, setAssets] = React.useState([]);
  const [editingAssetId, setEditingAssetId] = React.useState(null);
  const [editingPrompt, setEditingPrompt] = React.useState('');
  
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
          <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>🔗 Linked to Intermaven Social AI:</span> Auto-scheduling is active. Created assets sync directly with your Intermaven visual post calendar and automatic publishing queues.
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
        <div className="glass-panel" style={{ marginTop: '32px', padding: '24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <h4 style={{ color: '#fff', marginBottom: '16px', fontWeight: 'bold' }}>Generation Output</h4>
          {result.media_type === 'image' ? (
            <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
              <img 
                src={result.media_url} 
                alt={result.prompt} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '400px', 
                  borderRadius: result.aspect_ratio === 'profile' ? '50%' : '4px', 
                  border: result.aspect_ratio === 'profile' ? '4px solid var(--cyan)' : 'none',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)', 
                  display: 'block', 
                  margin: '0 auto' 
                }} 
              />
              {result.aspect_ratio === 'profile' && (
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  borderRadius: '50%', 
                  border: '2px dashed rgba(255,255,255,0.6)', 
                  pointerEvents: 'none' 
                }} />
              )}
            </div>
          ) : (
            <video 
              src={result.media_url} 
              controls 
              autoPlay 
              loop
              style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'block', margin: '0 auto' }} 
            />
          )}
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px', fontStyle: 'italic' }}>
            Prompt: "{result.prompt}"
          </p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button 
              type="button" 
              onClick={() => handlePortAsset(result, 'epk')}
              className="btn-secondary" 
              style={{ fontSize: '11.5px', padding: '6px 14px', background: 'rgba(139, 92, 246, 0.2)', color: '#fff', border: '1px solid var(--purple)' }}
            >
              🚀 Send to EPK Builder
            </button>
            <button 
              type="button" 
              onClick={() => handlePortAsset(result, 'cms')}
              className="btn-secondary" 
              style={{ fontSize: '11.5px', padding: '6px 14px', background: 'rgba(6, 182, 212, 0.2)', color: '#fff', border: '1px solid var(--cyan)' }}
            >
              💻 Send to CMS Layouts
            </button>
            {result.media_type === 'image' && (
              <button 
                type="button" 
                onClick={() => handlePortAsset(result, 'sync')}
                className="btn-secondary" 
                style={{ fontSize: '11.5px', padding: '6px 14px', background: 'rgba(16, 185, 129, 0.2)', color: '#fff', border: '1px solid #10b981' }}
              >
                🎵 Send to Sync Pitch
              </button>
            )}
          </div>
        </div>
      )}

      {/* Asset Manager Grid */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '40px', paddingTop: '32px' }}>
        <div className="dashboard-card-header" style={{ marginBottom: '20px', padding: 0 }}>
          <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>📦 Saved Creative Asset Manager</h4>
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0' }}>Manage, reference, edit captions, delete, or port previously generated visual assets.</p>
        </div>

        {assets.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>No previously generated assets found in cloud vault. Describe your vision above to generate assets.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {assets.map((asset) => (
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
                  ) : (
                    <video 
                      src={asset.media_url} 
                      controls
                      muted
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
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
                          "{asset.prompt}"
                        </p>
                        <span style={{ color: '#64748b', fontSize: '9.5px' }}>
                          {new Date(asset.created_at).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  {editingAssetId !== asset.id && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                      {/* Port Actions */}
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
function CrmPanel() {
  const targetUrl = getIntermavenUrl('intermaven-smart-crm');

  return (
    <div className="dashboard-card" style={{ width: '100%', height: 'calc(100vh - 180px)', padding: 0, overflow: 'hidden', background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
      <iframe
        src={targetUrl}
        title="Intermaven Smart CRM"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#0f172a'
        }}
        allow="clipboard-write"
      />
    </div>
  );
}

// ================= Track D: CMS Layouts & Rollbacks Panel =================
function CmsPanel() {
  const targetUrl = getIntermavenUrl('cms');

  return (
    <div className="dashboard-card" style={{ width: '100%', height: 'calc(100vh - 180px)', padding: 0, overflow: 'hidden', background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
      <iframe
        src={targetUrl}
        title="Intermaven Mother CMS"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: '#0f172a'
        }}
        allow="clipboard-write"
      />
    </div>
  );
}

export default App;
