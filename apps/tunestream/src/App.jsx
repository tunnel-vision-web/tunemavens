import ConsumerSupportCommunityView from './components/community/ConsumerSupportCommunityView.jsx';
import HiFiAudioPlayer from './components/player/HiFiAudioPlayer.jsx';
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import { RegionProvider } from './RegionContext';
import RegionSwitcher from './RegionSwitcher';
import { 
  RiPlayFill, RiPauseFill, RiSkipForwardFill, RiSkipBackFill, 
  RiVolumeUpFill, RiHeadphoneLine, RiCompass3Line, RiHeart3Fill, 
  RiPlayListLine, RiUserLine, RiGlobalLine, RiRadioLine, RiSearchLine,
  RiArrowLeftSFill, RiArrowRightSFill, RiUpload2Line, RiDatabase2Line,
  RiCoinsLine, RiBarChartLine, RiCloseFill, RiMusicLine, RiUserFill,
  RiDownloadLine, RiBellFill, RiShieldFill, RiSettings3Fill, RiLogoutBoxRFill,
  RiCheckLine, RiSparklingLine, RiCoinsFill, RiExchangeDollarLine,
  RiFolderMusicLine, RiQuestionLine, RiBriefcaseLine, RiArrowDownSFill,
  RiApps2Fill, RiAppleFill, RiHomeFill, RiBarChartFill, RiGlobalFill, RiArrowLeftFill, RiCloseLine,
  RiLineChartFill, RiFileTextFill
} from 'react-icons/ri';
import tsLogo from './assets/tunestream-logo.png';
import tcLogo from './assets/tunecompanion-logo.png';
import tpLogo from './assets/tunepay-logo.png';
import './App.css';

// Import newly copied header assets
import listenHero from './assets/images/listen_hero.png';

import NativeAppLandingView from './NativeAppLandingView';
import CreatorEpkView from './views/creator/CreatorEpkView.jsx';
import CreatorProfileView from './components/creator/CreatorProfileView.jsx';
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
import TuneCompanionApp from './components/companion/TuneCompanionApp.jsx';
import MyContractsPanel from './components/contracts/MyContractsPanel.jsx';
import { 
  getUnifiedCatalog, 
  saveUnifiedCatalog, 
  AUTHORITATIVE_CATALOG_TRACKS,
  AUTHORITATIVE_CATALOG_ARTISTS,
  AUTHORITATIVE_CATALOG_ALBUMS
} from './data/authoritativeCatalog';
import { catalogApi, streamApi, normalizeMediaUrl } from './lib/api';

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

const SAMPLE_TRACKS = AUTHORITATIVE_CATALOG_TRACKS;

import LocaleWelcomeBanner from './components/common/LocaleWelcomeBanner.jsx';

export default function App() {
  return (
    <RegionProvider>
      <Router>
        <LocaleWelcomeBanner />
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
          <Route path="/explore" element={<Navigate to="/?view=explore" replace />} />
          <Route path="/stream" element={<PlayerDashboard sessionUser={sessionUser} initialTab="explore" onLogout={handleLogout} />} />
          <Route path="/singles" element={<PlayerDashboard sessionUser={sessionUser} initialTab="singles" onLogout={handleLogout} />} />
          <Route path="/artists" element={<PlayerDashboard sessionUser={sessionUser} initialTab="artists" onLogout={handleLogout} />} />
          <Route path="/catalog" element={<PlayerDashboard sessionUser={sessionUser} initialTab="my-catalog" onLogout={handleLogout} />} />
          <Route path="/sync" element={<PlayerDashboard sessionUser={sessionUser} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/sync-marketplace" element={<PlayerDashboard sessionUser={sessionUser} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/apps" element={<PlayerDashboard sessionUser={sessionUser} initialTab="apps" onLogout={handleLogout} />} />
          <Route path="/companion" element={<PlayerDashboard sessionUser={sessionUser} initialTab="companion" onLogout={handleLogout} />} />
          <Route path="/tunecompanion" element={<PlayerDashboard sessionUser={sessionUser} initialTab="companion" onLogout={handleLogout} />} />
          <Route path="/login" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/register" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/dashboard" element={<PlayerDashboard sessionUser={sessionUser} initialTab="home" onLogout={handleLogout} />} />
          <Route path="/epk/:username" element={<CreatorEpkView sessionUser={sessionUser} />} />
          <Route path="/epk" element={<CreatorEpkView sessionUser={sessionUser} />} />
          <Route path="/help" element={<Navigate to="/?view=help" replace />} />
          <Route path="/docs" element={<Navigate to="/?view=help" replace />} />
          <Route path="/support" element={<Navigate to="/?view=support" replace />} />
          <Route path="/blog" element={<Navigate to="/?view=blog" replace />} />
          <Route path="/community/blog" element={<Navigate to="/?view=blog" replace />} />
          <Route path="/plans" element={<Navigate to="/?view=plans" replace />} />
          <Route path="/pricing" element={<Navigate to="/?view=plans" replace />} />
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

function EcosystemAppsPanel({ setActiveTab }) {
  const apps = [
    {
      id: 'consumer',
      title: 'TuneStream Mobile',
      tagline: 'Stream. Tip. Carry the catalogue.',
      target: 'For Listeners & Fans',
      desc: 'The consumer streaming client with high-fidelity 24-bit FLAC audio, 8GB offline caching, and direct creator micro-tipping that settles automatically into creator splits.',
      platforms: 'iOS & Android (Capacitor)',
      logo: tsLogo,
      accent: '#00f2fe',
      features: [
        'Lossless 24-bit FLAC audio & low-latency streaming',
        '8GB smart offline library caching for travel & commutes',
        'Direct creator tipping into unified split ledgers',
        'Region-aware editorial feeds and community live radio'
      ]
    },
    {
      id: 'companion',
      title: 'Creator Companion',
      tagline: 'Your split ledger in your pocket.',
      target: 'For Artists & Managers',
      desc: 'Mobile command center for creators and artist managers: real-time split cascade waterfall, accrued payout balances, sync brief alerts, and instant release analytics.',
      platforms: 'iOS & Android',
      logo: tcLogo,
      accent: '#a855f7',
      features: [
        'Live split cascade revenue waterfall visualization',
        'Instant royalty payout balances and micro-tip notifications',
        'Push notifications for incoming TV/film sync brief pitches',
        'AI-assisted release scheduling and EPK sharing tools'
      ]
    },
    {
      id: 'tunepay',
      title: 'TunePay POS',
      tagline: 'Sell at the show. Settle by morning.',
      target: 'For Labels & Venues',
      desc: 'Portable point-of-sale for concerts, festivals, and merch booths: process card and M-Pesa STK mobile money checkout, scan gate tickets, and settle splits automatically.',
      platforms: 'iOS & Android Tablet',
      logo: tpLogo,
      accent: '#10b981',
      features: [
        'Contactless card, Apple Pay & M-Pesa STK mobile rails',
        'Real-time merch inventory management (vinyl, apparel, CDs)',
        'Barcode / QR door ticket scanner with fast credential pass',
        'Automated event settlement run with instant ledger cascade'
      ]
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Header Banner */}
      <div style={{ 
        padding: '36px 32px', 
        borderRadius: '3px', 
        border: '1px solid rgba(255,255,255,0.08)', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.05) 0%, rgba(15, 23, 42, 0.6) 100%)', 
        marginBottom: '28px', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RiApps2Fill size={22} style={{ color: '#00f2fe' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>Ecosystem App Distribution & Native Suites</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '840px' }}>
          Every native app in the Intermaven Network synchronizes with your unified credentials, shared credits vault, and TuneLedger splits waterfall.
        </p>

        <div className="ts-ecosystem-summary-grid">
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consumers</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>Listen & Tip On the Go</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>High-fidelity streaming with offline mode.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Creators</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>Pocket Split Ledger</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Real-time earnings, splits and sync brief alerts.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Labels & Venues</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>Tour & Event Settlement</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Hardware POS, ticket scanning, and instant payout runs.</div>
          </div>
        </div>
      </div>

      {/* Expansive Full-Width Apps Grid */}
      <div className="ts-ecosystem-apps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
        {apps.map((app) => (
          <div 
            key={app.id} 
            style={{ 
              background: 'rgba(15, 23, 42, 0.75)', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '3px', 
              padding: '36px 30px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: app.accent }}></div>
            
            <div style={{ width: '100%' }}>
              <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <img src={app.logo} alt={app.title} style={{ height: '42px', width: 'auto', display: 'block', maxWidth: '240px', objectFit: 'contain' }} />
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span style={{ 
                  background: 'rgba(255,255,255,0.06)', 
                  color: app.accent, 
                  padding: '4px 12px', 
                  borderRadius: '3px', 
                  fontSize: '11px', 
                  fontWeight: 'bold', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px' 
                }}>
                  {app.target}
                </span>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', textAlign: 'center', margin: '0 0 6px 0' }}>{app.title}</h3>
              <div style={{ color: app.accent, fontSize: '13px', fontWeight: '600', textAlign: 'center', marginBottom: '8px' }}>{app.tagline}</div>
              <div style={{ color: '#94a3b8', fontSize: '11.5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'center', marginBottom: '18px' }}>{app.platforms}</div>

              <p style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px', minHeight: '65px' }}>{app.desc}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {app.features.map((feat, fIdx) => (
                  <li key={fIdx} style={{ fontSize: '12.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: app.accent, fontSize: '14px', lineHeight: 1 }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {app.id === 'companion' && (
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab('companion')}
                style={{
                  marginBottom: '10px',
                  width: '100%',
                  padding: '10px 14px',
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RiLineChartFill size={16} /> Open TuneCompanion Dashboard
              </button>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: app.id === 'companion' ? '0' : 'auto' }}>
              <button 
                type="button" 
                onClick={() => alert(`App Store build for ${app.title} coming in Phase 5+.`)}
                style={{ 
                  cursor: 'pointer', 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 14px', 
                  borderRadius: '3px', 
                  color: '#fff', 
                  textAlign: 'left', 
                  width: '100%', 
                  outline: 'none', 
                  justifyContent: 'center' 
                }}
              >
                <RiAppleFill size={22} style={{ color: '#fff', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>Download on</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>App Store</div>
                </div>
              </button>
              <button 
                type="button" 
                onClick={() => alert(`Google Play build for ${app.title} coming in Phase 5+.`)}
                style={{ 
                  cursor: 'pointer', 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 14px', 
                  borderRadius: '3px', 
                  color: '#fff', 
                  textAlign: 'left', 
                  width: '100%', 
                  outline: 'none', 
                  justifyContent: 'center' 
                }}
              >
                <RiDownloadLine size={22} style={{ color: '#00f2fe', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '9px', opacity: 0.7 }}>Get it on</div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Google Play</div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const APP_TITLES = {
  home: 'Streaming Overview & Royalty Dashboard',
  explore: 'Explore Lossless Audio Streams',
  favorites: 'My Favorite Audio Streams',
  radio: 'Community Live Radio Node',
  'my-catalog': 'Lossless Audio Catalog Repository',
  upload: 'Lossless Audio Ingestion & Transcoding',
  'sync-marketplace': 'Sync Licensing Marketplace',
  splits: 'TuneLedger Split Cascade Waterfall',
  affiliates: 'Affiliate Programme & Partner Hub',
  'label-team': 'Label Signed Roster & Permissions',
  'admin-team': 'Site Administration & Team Seats',
  apps: 'Ecosystem Native Apps & Mobile Distribution',
  companion: 'TuneCompanion Pocket Split Ledger & Command Center',
  support: 'Support & AI Claims Desk',
  settings: 'Profile & Security Settings'
};

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function TuneStreamHomePanel({ sessionUser, tracks = [], artists = [], userCredits, setActiveTab, onPlayTrack }) {
  const singles = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
  return (
    <div className="tunestream-home-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Catalog Repository</span>
            <RiDatabase2Line size={18} style={{ color: '#00f2fe' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{tracks.length} Releases</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>✓ 100% Lossless FLAC Transcoded</span>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Singles & EPs</span>
            <RiMusicLine size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{singles.length} Singles</div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px' }}>Pre-Cleared One-Stop Masters</div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Signed Artists</span>
            <RiUserLine size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{artists.length || 5} Creators</div>
          <div style={{ fontSize: '12px', color: '#a855f7', marginTop: '6px' }}>Authoritative Roster Roster</div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Unified Credits</span>
            <RiSparklingLine size={18} style={{ color: '#22d3ee' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#22d3ee' }}>{(userCredits ?? 600).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Intermaven Shared Vault</div>
        </div>
      </div>

      {/* Quick Launchpad Action Grid */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '800', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiApps2Fill style={{ color: '#00f2fe' }} /> Quick Actions &amp; Workflow Launchpad
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiCompass3Line size={20} style={{ color: '#00f2fe' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Explore Streams</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Lossless catalogue stream</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('singles')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiMusicLine size={20} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Singles Showcase</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Individual master releases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artists')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiUserLine size={20} style={{ color: '#22d3ee' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Signed Artists</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Roster bios &amp; releases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiUpload2Line size={20} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Ingest Audio</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Lossless FLAC/WAV upload</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sync-marketplace')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiGlobalFill size={20} style={{ color: '#ec4899' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Sync Marketplace</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Pitch to TV/Film supervisors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('splits')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiCoinsFill size={20} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>TuneLedger Splits</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Automated waterfall ledgers</span>
          </button>
        </div>
      </div>

      {/* Trending Streams Row */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '800', margin: 0 }}>Spotlight &amp; Trending Releases</h4>
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{ background: 'transparent', border: 'none', color: '#00f2fe', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            View All Streams &rarr;
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tracks.slice(0, 5).map((track, idx) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack && onPlayTrack(track)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', width: '16px', textAlign: 'center' }}>{idx + 1}</span>
                <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'; }} style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{track.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{track.artist} · {track.album || track.release}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 8px', borderRadius: '3px' }}>
                  {track.releaseType || 'Single'}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{track.plays}</span>
                <button
                  type="button"
                  style={{ background: '#00f2fe', border: 'none', color: '#000', padding: '6px 14px', borderRadius: '3px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RiPlayFill size={14} /> Listen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TuneStreamExplorePanel({ 
  tracks = [], 
  artists = [], 
  currentTrack, 
  isPlaying, 
  likes = [], 
  onLike, 
  onPlayTrack,
  initialFilter = 'all',
  searchQuery: externalSearchQuery,
  onSearchChange
}) {
  const [filterMode, setFilterMode] = useState(initialFilter);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  const [selectedArtist, setSelectedArtist] = useState(null);

  const singles = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
  const albums = tracks.filter(t => t.releaseType !== 'Single' && !(t.release && t.release.toLowerCase().includes('single')));

  // Filter computation
  let displayedTracks = tracks;
  if (filterMode === 'singles') displayedTracks = singles;
  else if (filterMode === 'albums') displayedTracks = albums;

  if (selectedArtist) {
    displayedTracks = displayedTracks.filter(t => t.artist && t.artist.toLowerCase() === selectedArtist.toLowerCase());
  }

  let displayedArtists = artists;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedTracks = displayedTracks.filter(t => 
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.artist && t.artist.toLowerCase().includes(q)) ||
      (t.release && t.release.toLowerCase().includes(q)) ||
      (t.album && t.album.toLowerCase().includes(q)) ||
      (t.genre && t.genre.toLowerCase().includes(q)) ||
      (t.isrc && t.isrc.toLowerCase().includes(q))
    );
    displayedArtists = artists.filter(a =>
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.genre && a.genre.toLowerCase().includes(q)) ||
      (a.bio && a.bio.toLowerCase().includes(q)) ||
      (a.role && a.role.toLowerCase().includes(q))
    );
  }

  const spotlightTrack = tracks[0] || {
    title: 'Nairobi Cyberwave (Master)',
    artist: 'Ndufo',
    release: 'Neon Safari EP',
    genre: 'Afro-House',
    duration: '3:45'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Authoritative Spotlight Hero */}
      <section className="ts-hero" style={{ height: '220px', marginBottom: '4px', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div className="hero-overlay"></div>
        <div className="hero-text" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="hero-badge" style={{ background: '#00f2fe', color: '#000', fontWeight: '800', borderRadius: '3px', padding: '2px 8px', fontSize: '11px' }}>
              SPOTLIGHT RELEASE
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
              ✓ Lossless 24-bit / 96kHz FLAC
            </span>
          </div>
          <h1 style={{ fontSize: '26px', margin: '4px 0 6px', fontWeight: '800' }}>
            {spotlightTrack.title}
          </h1>
          <p style={{ fontSize: '13px', marginBottom: '14px', maxWidth: '540px', color: '#cbd5e1', lineHeight: '1.5' }}>
            By <strong style={{ color: '#fff' }}>{spotlightTrack.artist}</strong> · From "{spotlightTrack.album || spotlightTrack.release}". Authoritative Master streaming directly from the TuneMavens lossless cluster.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn-play-hero" 
              onClick={() => onPlayTrack(spotlightTrack)} 
              style={{ padding: '8px 20px', borderRadius: '3px', background: '#00f2fe', color: '#000', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiPlayFill size={16} /> Play Master
            </button>
            <button
              type="button"
              onClick={() => setSelectedArtist(spotlightTrack.artist)}
              style={{ padding: '8px 16px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
            >
              View Artist Releases
            </button>
          </div>
        </div>
      </section>

      {/* Filter Toolbar (Design Standards §14: 3px border-radius, flat colors) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#090c16', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => { setFilterMode('all'); setSelectedArtist(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: filterMode === 'all' && !selectedArtist ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
              background: filterMode === 'all' && !selectedArtist ? '#00f2fe' : 'rgba(255,255,255,0.03)',
              color: filterMode === 'all' && !selectedArtist ? '#000' : '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            All Catalogue ({tracks.length})
          </button>

          <button
            type="button"
            onClick={() => { setFilterMode('singles'); setSelectedArtist(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: filterMode === 'singles' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              background: filterMode === 'singles' ? '#f59e0b' : 'rgba(255,255,255,0.03)',
              color: filterMode === 'singles' ? '#000' : '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Singles ({singles.length})
          </button>

          <button
            type="button"
            onClick={() => { setFilterMode('albums'); setSelectedArtist(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: filterMode === 'albums' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
              background: filterMode === 'albums' ? '#a855f7' : 'rgba(255,255,255,0.03)',
              color: filterMode === 'albums' ? '#fff' : '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Albums &amp; EPs ({albums.length})
          </button>

          <button
            type="button"
            onClick={() => { setFilterMode('artists'); setSelectedArtist(null); }}
            style={{
              padding: '6px 14px',
              borderRadius: '3px',
              border: filterMode === 'artists' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              background: filterMode === 'artists' ? '#10b981' : 'rgba(255,255,255,0.03)',
              color: filterMode === 'artists' ? '#000' : '#fff',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Signed Artists ({artists.length || 5})
          </button>
        </div>

        {/* Live Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
          <RiSearchLine size={16} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search tracks, artists, ISRC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {selectedArtist && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '3px' }}>
          <span style={{ fontSize: '13px', color: '#00f2fe', fontWeight: '700' }}>
            Filtering catalogue for artist: <strong>{selectedArtist}</strong>
          </span>
          <button
            type="button"
            onClick={() => setSelectedArtist(null)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
          >
            ✕ Clear Filter
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {filterMode === 'artists' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {displayedArtists.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
              No artists match your search query "{searchQuery}".
            </div>
          ) : (
            displayedArtists.map((artist) => {
            const artistTracks = tracks.filter(t => t.artist && t.artist.toLowerCase() === artist.name.toLowerCase());
            return (
              <div 
                key={artist.id}
                style={{ 
                  background: '#090c16', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '3px', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                    <img 
                      src={normalizeMediaUrl(artist.avatar) || `https://picsum.photos/seed/${artist.id}/400/400`} 
                      alt={artist.name} 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'; }}
                      style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                    />
                    <div>
                      <h4 
                        data-no-i18n="true" 
                        style={{ margin: '0 0 4px', fontSize: '16px', color: '#fff', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline text-decoration-color: rgba(34, 211, 238, 0.4)' }}
                        onClick={() => setViewingCreatorProfile(artist)}
                        title="View Creator Profile"
                      >
                        {artist.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 'bold' }}>
                        {artist.genre || 'Afro-fusion'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: '600', marginBottom: '8px' }}>
                    {artist.role || 'Signed Roster Creator'}
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 16px', minHeight: '36px' }}>
                    {artist.bio || 'Verified Intermaven Creator with active sync representation and losslessly transcoded masters.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                    <span>Catalogue: {artistTracks.length} tracks</span>
                    <a 
                      href={`#/epk/${artist.subdomain || artist.name.toLowerCase().replace(/\s+/g, '')}`}
                       
                      rel="noreferrer"
                      style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '700' }}
                    >
                      🌐 Web World &rarr;
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (artistTracks.length > 0) onPlayTrack(artistTracks[0]);
                        else onPlayTrack(tracks[0]);
                      }}
                      style={{ flex: 1, padding: '8px', background: '#00f2fe', color: '#000', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <RiPlayFill size={14} /> Listen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedArtist(artist.name);
                        setFilterMode('all');
                      }}
                      style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Releases ({artistTracks.length})
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
      ) : (
        <section className="ts-music-section">
          <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px' }}>
              {filterMode === 'singles' ? 'Singles Showcase' : (filterMode === 'albums' ? 'Albums & EPs' : 'Authoritative Catalogue')} 
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>
                ({displayedTracks.length} entries)
              </span>
            </h3>
          </div>
          
          <div className="tracks-list">
            {displayedTracks.length === 0 ? (
              <div style={{ color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
                No releases match your active filter or search query.
              </div>
            ) : (
              displayedTracks.map((track, idx) => (
                <div 
                  key={track.id} 
                  className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
                  onClick={() => onPlayTrack(track)}
                >
                  <div className="track-number">{idx + 1}</div>
                  <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} className="track-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'; }} />
                  <div data-no-i18n="true" className="track-details" style={{ width: '220px' }}>
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <div data-no-i18n="true" className="track-album" style={{ color: '#64748b' }}>{track.album || track.release}</div>
                  <div style={{ width: '90px' }}>
                    <span style={{ fontSize: '10px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                      {track.releaseType || 'Single'}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '11px', width: '130px', fontFamily: 'monospace' }}>
                    {track.isrc || 'KE-TM1-26-00000'}
                  </div>
                  <div className="track-plays" style={{ color: '#64748b' }}>{track.plays}</div>
                  <div className="track-duration" style={{ color: '#64748b' }}>{track.duration}</div>
                  <button 
                    className={`btn-like ${likes.includes(track.id) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(track.id);
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    title={likes.includes(track.id) ? "Remove from favorites" : "Save to favorites"}
                  >
                    <RiHeart3Fill />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function TuneStreamSinglesPanel({ tracks = [], currentTrack, isPlaying, likes = [], onLike, onPlayTrack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const allSingles = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
  
  const displayedSingles = searchQuery.trim()
    ? allSingles.filter(t => {
        const q = searchQuery.toLowerCase();
        return (t.title && t.title.toLowerCase().includes(q)) ||
               (t.artist && t.artist.toLowerCase().includes(q)) ||
               (t.genre && t.genre.toLowerCase().includes(q)) ||
               (t.isrc && t.isrc.toLowerCase().includes(q));
      })
    : allSingles;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Authoritative Singles Showcase</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
              All {allSingles.length} standalone master releases entered in the TuneMavens backend, transcoded to Lossless 24-bit FLAC.
            </p>
          </div>
          <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '3px', fontWeight: 'bold' }}>
            ✓ 100% One-Stop Pre-Cleared
          </span>
        </div>

        {/* Live Filter Search Bar */}
        <div style={{ marginTop: '14px', position: 'relative', maxWidth: '360px' }}>
          <RiSearchLine size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search singles, artists, ISRC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <section className="ts-music-section">
        <div className="tracks-list">
          {displayedSingles.length === 0 ? (
            <div style={{ color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
              No singles match "{searchQuery}".
            </div>
          ) : (
            displayedSingles.map((track, idx) => (
            <div 
              key={track.id} 
              className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
              onClick={() => onPlayTrack(track)}
            >
              <div className="track-number">{idx + 1}</div>
              <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} className="track-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'; }} />
              <div data-no-i18n="true" className="track-details" style={{ width: '220px' }}>
                <span className="track-title">{track.title}</span>
                <span className="track-artist">{track.artist}</span>
              </div>
              <div data-no-i18n="true" className="track-album" style={{ color: '#64748b' }}>{track.album || track.release}</div>
              <div style={{ color: '#00f2fe', width: '120px', fontSize: '11px', fontWeight: 'bold' }}>
                Splits: {track.splits || '100/0'}
              </div>
              <div style={{ color: '#64748b', fontSize: '11px', width: '130px', fontFamily: 'monospace' }}>
                {track.isrc}
              </div>
              <div className="track-plays" style={{ color: '#64748b' }}>{track.plays}</div>
              <div className="track-duration" style={{ color: '#64748b' }}>{track.duration}</div>
              <button 
                className={`btn-like ${likes.includes(track.id) ? 'liked' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(track.id);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <RiHeart3Fill />
              </button>
            </div>
          ))
          )}
        </div>
      </section>
    </div>
  );
}

function TuneStreamArtistsPanel({ artists = [], tracks = [], currentTrack, onPlayTrack, onLike, likes = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const displayedArtists = searchQuery.trim()
    ? artists.filter(a => {
        const q = searchQuery.toLowerCase();
        return (a.name && a.name.toLowerCase().includes(q)) ||
               (a.genre && a.genre.toLowerCase().includes(q)) ||
               (a.bio && a.bio.toLowerCase().includes(q)) ||
               (a.role && a.role.toLowerCase().includes(q));
      })
    : artists;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Signed Roster Artists</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
              Exact {artists.length} signed creator roster entries registered in TuneMavens backend with automated split cascades and lossless streaming.
            </p>
          </div>
        </div>

        {/* Live Filter Search Bar */}
        <div style={{ marginTop: '14px', position: 'relative', maxWidth: '360px' }}>
          <RiSearchLine size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search artists, genres, roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {displayedArtists.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
            No signed artists match "{searchQuery}".
          </div>
        ) : (
          displayedArtists.map((artist) => {
          const artistTracks = tracks.filter(t => t.artist && t.artist.toLowerCase() === artist.name.toLowerCase());
          return (
            <div 
              key={artist.id} 
              style={{ 
                background: '#090c16', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '3px', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                  <img 
                    src={artist.avatar || `https://picsum.photos/seed/${artist.id}/400/400`} 
                    alt={artist.name} 
                    style={{ width: '64px', height: '64px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} 
                  />
                  <div>
                    <h4 data-no-i18n="true" style={{ margin: '0 0 4px', fontSize: '18px', color: '#fff', fontWeight: '800' }}>{artist.name}</h4>
                    <span style={{ fontSize: '11px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 'bold' }}>
                      {artist.genre || 'Afro-fusion'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: '700', marginBottom: '8px' }}>
                  {artist.role || 'Signed Roster Artist'}
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 16px' }}>
                  {artist.bio || 'Authoritative Intermaven creator.'}
                </p>

                {artistTracks.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Releases ({artistTracks.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {artistTracks.slice(0, 3).map(tr => (
                        <div 
                          key={tr.id}
                          onClick={() => onPlayTrack(tr)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <span data-no-i18n="true" style={{ color: '#fff', fontWeight: '600' }}>{tr.title}</span>
                          <span style={{ color: '#00f2fe', fontSize: '11px' }}>▶ Listen</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (artistTracks.length > 0) onPlayTrack(artistTracks[0]);
                    else onPlayTrack(tracks[0]);
                  }}
                  style={{ flex: 1, padding: '8px 12px', background: '#00f2fe', color: '#000', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <RiPlayFill size={16} /> Listen to Artist
                </button>
                <a
                  href={`#/epk/${artist.subdomain || artist.name.toLowerCase().replace(/\s+/g, '')}`}
                  
                  rel="noreferrer"
                  style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '11px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  🌐 EPK
                </a>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}

function TuneStreamFavoritesPanel({ tracks = [], currentTrack, likes = [], onLike, onPlayTrack }) {
  const favoriteTracks = tracks.filter(t => likes.includes(t.id));
  return (
    <section className="ts-music-section">
      <div className="section-header" style={{ marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px' }}>My Favorites</h3>
      </div>
      <div className="tracks-list">
        {favoriteTracks.length === 0 ? (
          <div style={{ color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
            No liked tracks yet. Explore releases and tap the heart icon to save!
          </div>
        ) : (
          favoriteTracks.map((track, idx) => (
            <div 
              key={track.id} 
              className={`track-row ${currentTrack?.id === track.id ? 'active' : ''}`}
              onClick={() => onPlayTrack(track)}
            >
              <div className="track-number">{idx + 1}</div>
              <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} className="track-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'; }} />
              <div data-no-i18n="true" className="track-details" style={{ width: '220px' }}>
                <span className="track-title">{track.title}</span>
                <span className="track-artist">{track.artist}</span>
              </div>
              <div data-no-i18n="true" className="track-album">{track.album || track.release}</div>
              <div className="track-plays">{track.plays}</div>
              <div className="track-duration">{track.duration}</div>
              <button 
                className="btn-like liked"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(track.id);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <RiHeart3Fill />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function TuneStreamRadioPanel() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <RiRadioLine size={56} style={{ color: '#00f2fe', marginBottom: '20px', animation: 'pulse 2s infinite' }} />
      <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800' }}>TuneStream Live Radio Node</h3>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '10px', maxWidth: '480px', margin: '10px auto 20px', lineHeight: '1.6' }}>
        Lossless stream broadcasts curated daily by the community and vetted curators. Connected to regional low-latency edge node.
      </p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '6px 14px', borderRadius: '3px', fontSize: '12px', fontWeight: '700' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
        Live Broadcast Active · 24-bit / 96kHz FLAC
      </div>
    </div>
  );
}

function TuneStreamCatalogPanel({ tracks = [], onPlayTrack, setActiveTab }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  let filtered = filter === 'singles' 
    ? tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')))
    : (filter === 'albums' ? tracks.filter(t => t.releaseType !== 'Single') : tracks);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.artist && t.artist.toLowerCase().includes(q)) ||
      (t.release && t.release.toLowerCase().includes(q)) ||
      (t.genre && t.genre.toLowerCase().includes(q)) ||
      (t.isrc && t.isrc.toLowerCase().includes(q))
    );
  }

  return (
    <section className="ts-music-section">
      <div className="section-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', margin: 0 }}>My Lossless Catalog Repository</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>({filtered.length} of {tracks.length} releases)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            onClick={() => setFilter('all')}
            style={{ padding: '4px 10px', borderRadius: '3px', border: filter === 'all' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)', background: filter === 'all' ? '#00f2fe' : 'transparent', color: filter === 'all' ? '#000' : '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            All
          </button>
          <button 
            type="button" 
            onClick={() => setFilter('singles')}
            style={{ padding: '4px 10px', borderRadius: '3px', border: filter === 'singles' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)', background: filter === 'singles' ? '#f59e0b' : 'transparent', color: filter === 'singles' ? '#000' : '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            Singles
          </button>
          <button 
            type="button" 
            onClick={() => setFilter('albums')}
            style={{ padding: '4px 10px', borderRadius: '3px', border: filter === 'albums' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)', background: filter === 'albums' ? '#a855f7' : 'transparent', color: filter === 'albums' ? '#fff' : '#fff', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            Albums
          </button>
          <button 
            className="btn-play-hero" 
            onClick={() => setActiveTab('upload')} 
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '3px', background: '#00f2fe', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RiUpload2Line /> Ingest New Track
          </button>
        </div>
      </div>
      
      <div className="tracks-list">
        {filtered.map((track, idx) => (
          <div key={track.id} className="track-row" style={{ cursor: 'default' }}>
            <div className="track-number">{idx + 1}</div>
            <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} className="track-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'; }} />
            <div data-no-i18n="true" className="track-details" style={{ width: '220px' }}>
              <span className="track-title">{track.title}</span>
              <span className="track-artist">{track.artist}</span>
            </div>
            <div data-no-i18n="true" className="track-album" style={{ color: '#64748b' }}>{track.album || track.release}</div>
            <div style={{ color: '#64748b', fontSize: '11px', width: '130px', fontFamily: 'monospace' }}>
              {track.isrc}
            </div>
            <div className="track-plays" style={{ color: '#64748b' }}>{track.plays}</div>
            <div style={{ color: '#00f2fe', width: '100px', fontSize: '11px', fontWeight: 'bold' }}>
              Splits: {track.splits || "100/0"}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-play-hero" 
                onClick={() => onPlayTrack(track)}
                style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '3px', background: '#00f2fe', color: '#000', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                Listen
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TuneStreamUploadPanel({
  uploadForm,
  setUploadForm,
  uploadSuccess,
  uploadError,
  handleUploadSubmit,
  dragActive,
  handleDrag,
  handleDrop,
  fileName,
  setFileName
}) {
  return (
    <div className="dashboard-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px' }}>
      <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800', color: '#fff' }}>
        <RiUpload2Line style={{ color: '#00f2fe' }} /> Lossless Catalogue Audio Ingestion
      </h4>
      
      {uploadSuccess && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '3px', color: '#10b981', fontSize: '13px', marginBottom: '16px' }}>
          ✓ Track successfully ingested and synced to TuneMavens backend repository!
        </div>
      )}

      {uploadError && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: '3px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
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
              style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Primary Artist Name</label>
            <input 
              type="text" 
              placeholder="e.g. Ndufo" 
              value={uploadForm.artist} 
              onChange={e => setUploadForm({ ...uploadForm, artist: e.target.value })}
              style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Genre</label>
            <select 
              value={uploadForm.genre} 
              onChange={e => setUploadForm({ ...uploadForm, genre: e.target.value })}
              style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none' }}
            >
              <option value="Afro-House">Afro-House</option>
              <option value="Amapiano">Amapiano</option>
              <option value="Afrobeats">Afrobeats</option>
              <option value="Deep-House">Deep-House</option>
              <option value="Afro-fusion">Afro-fusion</option>
              <option value="Synthwave">Synthwave</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Royalty Split Cascade Setup (Creator/Label)</label>
            <input 
              type="text" 
              placeholder="e.g. 70/30" 
              value={uploadForm.splits} 
              onChange={e => setUploadForm({ ...uploadForm, splits: e.target.value })}
              style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        {/* Drag and Drop Ingestion Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>Audio File Ingestion</label>
          <div 
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? '#00f2fe' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '3px',
              padding: '28px',
              textAlign: 'center',
              background: dragActive ? 'rgba(0,242,254,0.05)' : 'rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {fileName ? (
              <div style={{ color: '#00f2fe', fontWeight: 'bold', fontSize: '14px' }}>
                📁 Ready for Ingestion: {fileName}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <RiUpload2Line size={32} style={{ color: '#94a3b8' }} />
                <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Drag &amp; drop audio files here, or browse local device</span>
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
            <label htmlFor="file-upload-input" style={{ display: 'inline-block', marginTop: '12px', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', color: '#fff' }}>
              Browse Local Storage
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-play-hero" 
          style={{ marginTop: '10px', justifyContent: 'center', padding: '10px', borderRadius: '3px', background: '#00f2fe', color: '#000', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RiUpload2Line /> Ingest &amp; Publish Track
        </button>
      </form>
    </div>
  );
}

function TuneStreamSettingsPanel({ sessionUser, onSwitchRole }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 16px' }}>
          Platform Session &amp; Identity Settings
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Current Role Persona</label>
            <div style={{ color: '#00f2fe', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>
              {sessionUser?.role || 'Creator'}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Unified Credits Balance</label>
            <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>
              {(sessionUser?.credits ?? 600).toLocaleString()} Credits
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerDashboard({ sessionUser, initialTab, onLogout }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(() => SAMPLE_TRACKS[0]);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);
  const [tipToast, setTipToast] = useState('');
  const audioRef = useRef(null);
  const eventLoggedRef = useRef(false);

  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_likes');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  // Unified Dashboard States
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'home');
  const [globalSearch, setGlobalSearch] = useState('');

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
  
  // Creator & Catalog states (unified across TuneMavens, TuneStream, and SyncMavens)
  const [catalogTracks, setCatalogTracks] = useState(getUnifiedCatalog);
  const [artists, setArtists] = useState(AUTHORITATIVE_CATALOG_ARTISTS);
  const [albums, setAlbums] = useState(AUTHORITATIVE_CATALOG_ALBUMS);

  const [uploadForm, setUploadForm] = useState({ title: '', artist: 'Ndufo', genre: 'Afro-House', splits: '100/0' });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  // Live fetch from backend API endpoints on mount
  useEffect(() => {
    // 1. Fetch live tracks from /api/catalog/tracks?all=true
    fetch('/api/catalog/tracks?all=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
          const mapped = data.tracks.map(t => ({
            ...t,
            cover: normalizeMediaUrl(t.coverArt || t.cover) || `https://picsum.photos/seed/${t.id}/500/500`,
            coverArt: normalizeMediaUrl(t.coverArt || t.cover) || `https://picsum.photos/seed/${t.id}/500/500`,
            album: t.release || t.album || 'Singles 2026',
            release: t.release || t.album || 'Singles 2026',
            releaseType: t.releaseType || (t.release && t.release.toLowerCase().includes('single') ? 'Single' : 'Album'),
            plays: t.streams || t.plays || '1.2M',
            streams: t.streams || t.plays || '1.2M',
            splits: t.splits || t.split || t.publishingSplit || 'Artist (60%) / Producer (25%) / Label (15%)',
            audioUrl: t.audioUrl || t.fileUrl || `/api/stream/track/${t.isrc || t.id}`
          }));
          setCatalogTracks(mapped);
          saveUnifiedCatalog(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch backend tracks:', err));

    // 2. Fetch live artists from /api/catalog/artists
    fetch('/api/catalog/artists')
      .then(res => res.json())
      .then(data => {
        if (data && data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
          const mapped = data.artists.map(a => ({
            ...a,
            avatar: normalizeMediaUrl(a.avatar || a.image)
          }));
          setArtists(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch backend artists:', err));

    // 3. Fetch live albums from /api/catalog/albums
    fetch('/api/catalog/albums')
      .then(res => res.json())
      .then(data => {
        if (data && data.albums && Array.isArray(data.albums) && data.albums.length > 0) {
          const mapped = data.albums.map(a => ({
            ...a,
            cover: normalizeMediaUrl(a.cover || a.coverArt)
          }));
          setAlbums(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch backend albums:', err));
  }, []);

  // Cross-app catalog synchronization listener
  useEffect(() => {
    const handleCatUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCatalogTracks(e.detail);
      }
    };
    window.addEventListener('tunemavens:catalog_updated', handleCatUpdate);
    return () => window.removeEventListener('tunemavens:catalog_updated', handleCatUpdate);
  }, []);

  const [activeArtist, setActiveArtist] = useState(() => {
    try {
      const saved = localStorage.getItem('tunemavens_active_artist');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const handleSwitchArtist = (artist) => {
    if (!artist) return;
    setActiveArtist(artist);
    try {
      localStorage.setItem('tunemavens_active_artist', JSON.stringify(artist));
    } catch (_) {}
  };

  // Real Audio Playback Methods
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  };
  
  const handleTrackSelect = (track) => {
    if (!track) return;
    setCurrentTrack(track);
    setIsPlayerOpen(true);
    setIsPlaying(true);
    eventLoggedRef.current = false;
    setCurrentTime(0);

    const streamSrc = track.audioUrl || track.audio_url || `/api/stream/track/${track.isrc || track.id}`;
    if (audioRef.current) {
      audioRef.current.src = streamSrc;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn('Autoplay error:', err);
      });
    }
  };

  const handleNextTrack = () => {
    if (!catalogTracks || catalogTracks.length === 0) return;
    const currentIdx = catalogTracks.findIndex(t => t.id === currentTrack?.id || t.isrc === currentTrack?.isrc);
    const nextIdx = (currentIdx + 1) % catalogTracks.length;
    handleTrackSelect(catalogTracks[nextIdx]);
  };

  const handlePrevTrack = () => {
    if (!catalogTracks || catalogTracks.length === 0) return;
    const currentIdx = catalogTracks.findIndex(t => t.id === currentTrack?.id || t.isrc === currentTrack?.isrc);
    const prevIdx = (currentIdx - 1 + catalogTracks.length) % catalogTracks.length;
    handleTrackSelect(catalogTracks[prevIdx]);
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = clickRatio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const ct = audioRef.current.currentTime;
    setCurrentTime(ct);
    
    // Anti-fraud stream event logging after 30 seconds of listening
    if (ct >= 30 && !eventLoggedRef.current && currentTrack) {
      eventLoggedRef.current = true;
      try {
        fetch('/api/stream/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track_id: String(currentTrack.isrc || currentTrack.id),
            duration_listened_sec: Math.floor(ct)
          })
        }).catch(() => {});
      } catch (_) {}
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = (volume || 80) / 100;
    }
  }, [volume]);

  const handleTipArtist = async () => {
    if (!currentTrack) return;
    const tipAmount = 50; // 50 credits = $5.00
    if (userCredits < tipAmount) {
      setIsCreditReloadOpen(true);
      return;
    }

    const newCredits = userCredits - tipAmount;
    setUserCredits(newCredits);
    localStorage.setItem('tunemavens_user_credits', newCredits.toString());

    try {
      await fetch('/api/stream/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_id: currentTrack.artist || 'Ndufo',
          amount_credits: tipAmount,
          track_id: String(currentTrack.isrc || currentTrack.id)
        })
      });
    } catch (err) {
      console.warn('Tip API note:', err);
    }

    setTipToast(`Tipped 50 credits ($5.00) to ${currentTrack.artist} — settled into TuneLedger splits!`);
    setTimeout(() => setTipToast(''), 4500);
  };

  const handleLike = (id) => {
    setLikes(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('tunestream_likes', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
  };

  const getCategorizedMenu = () => {
    const categories = {};
    const add = (cat, item) => {
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    };

    // Dashboard Overview & Copilot
    add('Dashboard', { id: 'home', label: 'Overview', icon: RiHomeFill });
    add('Dashboard', { 
      id: 'companion', 
      label: 'TuneCompanion', 
      icon: RiLineChartFill, 
      iconImg: tcLogo,
      color: '#c084fc', 
      badge: 'COPILOT' 
    });

    // Discover & Audio (Catalogue, Singles, Artists, Favorites, Radio)
    add('Discover & Audio', { id: 'explore', label: 'Explore & Stream', icon: RiCompass3Line });
    add('Discover & Audio', { id: 'singles', label: 'Singles Showcase', icon: RiMusicLine });
    add('Discover & Audio', { id: 'artists', label: 'Roster Artists', icon: RiUserLine });
    add('Discover & Audio', { id: 'favorites', label: 'Favorites', icon: RiHeart3Fill });
    add('Discover & Audio', { id: 'radio', label: 'Live Radio Node', icon: RiRadioLine });

    // Catalog & Upload
    if (['creator', 'label', 'admin'].includes(userRole)) {
      add('Catalog & Ingestion', { id: 'my-catalog', label: 'Lossless Catalog', icon: RiDatabase2Line });
      add('Catalog & Ingestion', { id: 'upload', label: 'Ingest Audio', icon: RiUpload2Line });
    }

    // Sync Marketplace
    add('Sync & Licensing', { id: 'sync-marketplace', label: 'Sync Marketplace', icon: RiSparklingLine, color: '#22d3ee' });

    // Splits & Ledgers
    if (['creator', 'label', 'admin', 'affiliate'].includes(userRole)) {
      add('Splits & Ledgers', { id: 'splits', label: 'TuneLedger Splits', icon: RiExchangeDollarLine, color: '#22d3ee' });
      add('Splits & Ledgers', { id: 'contracts', label: 'MyContracts', icon: RiFileTextFill, color: '#38bdf8', badge: 'LEGAL' });
      add('Splits & Ledgers', { id: 'companion', label: 'TuneCompanion Ledger', icon: RiLineChartFill, iconImg: tcLogo, color: '#c084fc', badge: 'MOBILE' });
      add('Splits & Ledgers', { id: 'affiliates', label: 'Affiliate Hub', icon: RiSparklingLine, color: '#22d3ee' });
    }

    // Label Roster
    if (['label', 'admin'].includes(userRole)) {
      add('Label Roster', { id: 'label-team', label: 'Signed Roster', icon: RiFolderMusicLine, color: '#a855f7' });
    }

    // Admin Governance
    if (userRole === 'admin') {
      add('Governance & Admin', { id: 'admin-team', label: 'Admin Team Seats', icon: RiShieldFill, color: '#ec4899' });
    }

    // Platform & Ecosystem
    add('Ecosystem & Apps', { id: 'companion', label: 'TuneCompanion', icon: RiLineChartFill, iconImg: tcLogo, color: '#a855f7', badge: 'APP' });
    add('Ecosystem & Apps', { id: 'apps', label: 'Ecosystem Apps', icon: RiApps2Fill, color: '#00f2fe' });
    add('Support & Config', { id: 'support', label: 'Support Desk', icon: RiQuestionLine });
    add('Support & Config', { id: 'settings', label: 'Settings', icon: RiSettings3Fill });

    return categories;
  };

  const handleUploadSubmit = async (e) => {
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

    const newIsrc = `KE-TM1-26-${Math.floor(10000 + Math.random() * 89999)}`;
    const newTrack = {
      id: Date.now(),
      isrc: newIsrc,
      iswc: `T-${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.001-1`,
      title: uploadForm.title,
      artist: uploadForm.artist,
      album: uploadForm.title,
      release: uploadForm.title,
      releaseType: 'Single',
      year: '2026',
      genre: uploadForm.genre || 'Afro-House',
      duration: '3:30',
      plays: '1 play',
      streams: '1 play',
      priceCredits: 50,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      coverText: uploadForm.title.slice(0, 10),
      coverBg: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
      splits: uploadForm.splits || '100/0',
      split: uploadForm.splits || '100/0',
      status: 'Approved',
      audioUrl: `/api/stream/track/${newIsrc}`
    };

    try {
      await fetch('/api/catalog/tracks?subdomain=ndufo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrack)
      });
    } catch (err) {
      console.warn('Backend sync note:', err);
    }

    const updated = [newTrack, ...catalogTracks];
    setCatalogTracks(updated);
    saveUnifiedCatalog(updated);
    setUploadSuccess(true);
    setFileName('');
    setUploadForm({ title: '', artist: 'Ndufo', genre: 'Afro-House', splits: '100/0' });
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

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'home':
        return (
          <TuneStreamHomePanel
            sessionUser={activeUser}
            tracks={catalogTracks}
            artists={artists}
            userCredits={userCredits}
            setActiveTab={setActiveTab}
            onPlayTrack={handleTrackSelect}
          />
        );
      case 'explore':
        return (
          <TuneStreamExplorePanel
            tracks={catalogTracks}
            artists={artists}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            likes={likes}
            onPlayTrack={handleTrackSelect}
            onToggleLike={handleLike}
            onLike={handleLike}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
          />
        );
      case 'singles':
        return (
          <TuneStreamSinglesPanel
            tracks={catalogTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            likes={likes}
            onPlayTrack={handleTrackSelect}
            onLike={handleLike}
          />
        );
      case 'artists':
        return (
          <TuneStreamArtistsPanel
            artists={artists}
            tracks={catalogTracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            likes={likes}
            onPlayTrack={handleTrackSelect}
            onLike={handleLike}
          />
        );
      case 'favorites':
        return (
          <TuneStreamFavoritesPanel
            tracks={catalogTracks}
            currentTrack={currentTrack}
            likes={likes}
            onPlayTrack={handleTrackSelect}
            onLike={handleLike}
          />
        );
      case 'radio':
        return <TuneStreamRadioPanel />;
      case 'catalog':
      case 'my-catalog':
        return (
          <TuneStreamCatalogPanel
            tracks={catalogTracks}
            onPlayTrack={handleTrackSelect}
            setActiveTab={setActiveTab}
          />
        );
      case 'upload':
        return (
          <TuneStreamUploadPanel
            uploadForm={uploadForm}
            setUploadForm={setUploadForm}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            dragActive={dragActive}
            fileName={fileName}
            setFileName={setFileName}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleUploadSubmit={handleUploadSubmit}
          />
        );
      case 'sync-marketplace':
      case 'sync':
        return <SyncMarketplacePanel sessionUser={activeUser} />;
      case 'splits':
        return <TuneLedgerSplitCascadePanel sessionUser={activeUser} />;
      case 'contracts':
      case 'mycontracts':
      case 'escrow':
        return <MyContractsPanel sessionUser={activeUser} setActiveTab={setActiveTab} />;
      case 'affiliates':
        return <AffiliateAdminPanel sessionUser={activeUser} />;
      case 'label-team':
        return (
          <LabelTeamRosterPanel
            sessionUser={activeUser}
            setActiveTab={setActiveTab}
            activeArtist={activeArtist}
            onSelectArtist={handleSwitchArtist}
          />
        );
      case 'admin-team':
        return (
          <AdminTeamRosterPanel
            sessionUser={activeUser}
            setActiveTab={setActiveTab}
          />
        );
      case 'companion':
        return (
          <TuneCompanionApp
            sessionUser={activeUser}
            onPlayTrack={handleTrackSelect}
            setActiveTab={setActiveTab}
          />
        );
      case 'apps':
        return <EcosystemAppsPanel setActiveTab={setActiveTab} />;
      case 'support':
        return <ConsumerSupportCommunityView sessionUser={activeUser} catalogTracks={catalogTracks} initialSection="tickets" />;
      case 'help':
      case 'docs':
        return <ConsumerSupportCommunityView sessionUser={activeUser} catalogTracks={catalogTracks} initialSection="docs" />;
      case 'blog':
        return <ConsumerSupportCommunityView sessionUser={activeUser} catalogTracks={catalogTracks} initialSection="blog" />;
      case 'settings':
        return <TuneStreamSettingsPanel sessionUser={activeUser} onSwitchRole={handleSwitchRole} />;
      default:
        return (
          <TuneStreamHomePanel
            sessionUser={activeUser}
            tracks={catalogTracks}
            artists={artists}
            userCredits={userCredits}
            setActiveTab={setActiveTab}
            onPlayTrack={handleTrackSelect}
          />
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Tip Toast Notification */}
      {tipToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '3px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '700'
        }}>
          <RiCoinsFill size={18} />
          <span>{tipToast}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand-wrapper">
          <Link to="/" className="sidebar-logo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <img src={tsLogo} alt="TuneStream" className="sidebar-logo-img" />
            {!collapsed && (
              <span data-no-i18n="true" style={{ fontSize: '10px', color: '#00f2fe', letterSpacing: '0.4px', fontWeight: 700, textTransform: 'lowercase', marginTop: '2px' }}>
                a tunemavens utility
              </span>
            )}
          </Link>
          <button 
            type="button" 
            className="sidebar-collapse-btn" 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <RiArrowRightSFill /> : <RiArrowLeftSFill />}
          </button>
        </div>

        {/* User Role Card */}
        <div className="sidebar-persona-badge-card" style={{ borderColor: currentRoleObj.color }}>
          <div className="persona-badge-icon" style={{ background: currentRoleObj.color }}>
            <currentRoleObj.icon size={16} color="#060813" />
          </div>
          <div className="persona-badge-text">
            <span className="persona-badge-name">{currentRoleObj.shortLabel}</span>
            <span className="persona-badge-desc">{currentRoleObj.shortDesc}</span>
          </div>
        </div>

        {/* Categorized Navigation */}
        <div className="sidebar-categorized-menu">
          {Object.entries(getCategorizedMenu()).map(([category, items]) => (
            <div key={category} className="sidebar-menu-category">
              <div className="sidebar-category-header">{category}</div>
              <nav className="sidebar-nav">
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.iconImg ? (
                        <img src={item.iconImg} alt="" className="sidebar-nav-custom-img" style={{ height: '16px', width: 'auto' }} />
                      ) : (
                        <Icon size={18} className="sidebar-nav-icon" style={{ color: isActive ? '#00f2fe' : item.color || 'inherit' }} />
                      )}
                      <span className="sidebar-nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="sidebar-nav-badge" style={{ background: item.color || '#00f2fe' }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Back to Home CTA */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'rgba(0, 240, 255, 0.06)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '3px',
              color: '#00f2fe',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <RiCompass3Line size={14} />
            <span>TuneStream Explore</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="dashboard-main-content">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <h2 className="topbar-page-title" style={{ textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="topbar-status-chip">
              <span className="chip-indicator"></span>
              Lossless Edge Active
            </div>
          </div>

          {/* Global Search Bar */}
          <div style={{ flex: 1, maxWidth: '440px', margin: '0 20px', position: 'relative' }}>
            <RiSearchLine size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
            <input 
              type="text"
              placeholder="Search tracks, artists, albums, ISRC..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (activeTab !== 'explore' && activeTab !== 'singles' && activeTab !== 'artists') {
                  setActiveTab('explore');
                }
              }}
              style={{
                width: '100%',
                padding: '7px 32px 7px 34px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="topbar-right">
            {/* Unified Credits Vault */}
            <button 
              type="button" 
              className="topbar-credits-btn"
              onClick={() => setIsCreditReloadOpen(true)}
              title="Click to reload unified credits"
            >
              <RiSparklingLine size={16} color="#00f2fe" />
              <span className="credits-amount">{(userCredits ?? 600).toLocaleString()} Credits</span>
              <span className="credits-reload-action">+</span>
            </button>

            {/* Notification Dropdown */}
            <div className="topbar-popover-container" ref={notifRef}>
              <button 
                type="button" 
                className="topbar-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                title="Notifications"
              >
                <RiBellFill size={18} />
                {notifications.some(n => !n.read) && <span className="topbar-notif-dot"></span>}
              </button>

              {notifOpen && (
                <div className="topbar-dropdown notif-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-header-title">Notifications</span>
                    <button 
                      type="button" 
                      className="dropdown-header-action"
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="dropdown-body">
                    {notifications.map(n => (
                      <div key={n.id} className={`dropdown-item ${!n.read ? 'unread' : ''}`}>
                        <div className="dropdown-item-content">
                          <div className="dropdown-item-title">{n.title}</div>
                          <div className="dropdown-item-sub">{n.body}</div>
                        </div>
                        <span className="dropdown-item-time">{n.at}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="topbar-popover-container" ref={accountRef}>
              <button 
                type="button" 
                className="topbar-user-profile-btn"
                onClick={() => setAccountOpen(!accountOpen)}
              >
                <div className="dashboard-avatar" style={{ background: currentRoleObj.color }}>
                  {activeUser.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="topbar-user-meta">
                  <span className="topbar-user-name">{activeUser.name}</span>
                  <span className="topbar-user-role" style={{ color: currentRoleObj.color }}>
                    {currentRoleObj.shortLabel}
                  </span>
                </div>
                <RiArrowDownSFill size={14} className="topbar-dropdown-caret" />
              </button>

              {accountOpen && (
                <div className="topbar-dropdown account-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-header-title">Switch Persona Mode</span>
                  </div>
                  <div className="dropdown-body">
                    {PERSONA_ROLES.map(role => (
                      <button
                        key={role.id}
                        type="button"
                        className={`dropdown-persona-row ${userRole === role.id ? 'active' : ''}`}
                        onClick={() => handleSwitchRole(role.id)}
                      >
                        <div className="persona-row-icon" style={{ background: role.color }}>
                          <role.icon size={14} color="#060813" />
                        </div>
                        <div className="persona-row-meta">
                          <span className="persona-row-label">{role.label}</span>
                          <span className="persona-row-desc">{role.shortDesc}</span>
                        </div>
                        {userRole === role.id && <RiCheckLine size={16} style={{ color: '#00f2fe' }} />}
                      </button>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="dropdown-logout-btn"
                      onClick={() => onLogout && onLogout()}
                    >
                      <RiLogoutBoxRFill size={15} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Area */}
        <div className="dashboard-main-scroll">
          <div className="dashboard-inner-wrap">
            {renderActivePanel()}
          </div>
          <div className="dashboard-footer-badge" style={{ padding: '24px 32px', textAlign: 'center', color: '#64748b', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span>TuneStream Lossless Audio Network · 100% Unified Credits Model · Zero Monthly Subscriptions</span>
          </div>
        </div>
      </main>

      {/* Real HTML5 Audio Element for live stream decoding */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNextTrack}
        onError={() => setPlaybackError('Stream fallback active')}
      />

      {/* EPK-Style Floating Hi-Fi Audio Player Overlay */}
      {isPlayerOpen && currentTrack && (
        <HiFiAudioPlayer
          track={currentTrack}
          tracks={catalogTracks}
          isPlaying={isPlaying}
          sessionUser={sessionUser}
          onTogglePlay={(p) => setIsPlaying(typeof p === 'boolean' ? p : !isPlaying)}
          onTrackSelect={(t) => handleTrackSelect(t)}
          onClose={() => {
            setIsPlaying(false);
            setIsPlayerOpen(false);
            setActivePlayerTrack(null);
          }}
        />
      )}
      {/* Old Docked Audio Player Bar */}
      {false && isPlayerOpen && currentTrack && (
        <footer className="ts-player-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', borderTop: '1px solid rgba(0, 240, 255, 0.2)', zIndex: 1000, background: '#070a14' }}>
          <div className="player-track-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={normalizeMediaUrl(currentTrack.cover || currentTrack.coverArt)} alt={currentTrack.title} className="player-cover" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200'; }} style={{ width: '48px', height: '48px', borderRadius: '3px', objectFit: 'cover' }} />
            <div data-no-i18n="true" className="player-metadata">
              <span className="player-title" style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{currentTrack.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="player-artist" style={{ fontSize: '11px', color: '#94a3b8' }}>{currentTrack.artist}</span>
                <span style={{ fontSize: '10px', color: '#00f2fe', background: 'rgba(0, 242, 254, 0.1)', padding: '1px 6px', borderRadius: '3px' }}>
                  {currentTrack.releaseType || 'Single'}
                </span>
                <a 
                  href={`#/epk/${currentTrack.artist ? currentTrack.artist.toLowerCase().replace(/\s+/g, '') : 'ndufo'}`}
                   
                  rel="noreferrer"
                  style={{ fontSize: '10px', background: 'rgba(0, 240, 255, 0.15)', color: '#00f2fe', padding: '2px 6px', borderRadius: '3px', textDecoration: 'none', fontWeight: 600 }}
                >
                  🌐 Web World
                </a>
              </div>
            </div>
          </div>

          <div className="player-controls" style={{ flex: 1, maxWidth: '640px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div className="control-buttons" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button className="btn-control" onClick={handlePrevTrack} title="Previous Track" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>
                <RiSkipBackFill />
              </button>
              <button className="btn-control btn-play-pause" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"} style={{ width: '36px', height: '36px', background: '#00f2fe', color: '#000', border: 'none', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px' }}>
                {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
              </button>
              <button className="btn-control" onClick={handleNextTrack} title="Next Track" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>
                <RiSkipForwardFill />
              </button>

              <span style={{ fontSize: '10px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '3px' }}>
                🎧 Lossless FLAC Stream • Intermaven Shared Pool
              </span>
            </div>

            <div className="playback-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              <span className="time-stamp" style={{ fontSize: '11px', color: '#94a3b8', minWidth: '32px' }}>
                {formatTime(currentTime)}
              </span>
              <div 
                className="progress-bar-container" 
                onClick={handleSeek} 
                title="Click to seek timeline"
                style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', cursor: 'pointer', position: 'relative' }}
              >
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, height: '100%', background: '#00f2fe', borderRadius: '3px', transition: 'width 0.1s linear' }}
                />
              </div>
              <span className="time-stamp" style={{ fontSize: '11px', color: '#94a3b8', minWidth: '32px' }}>
                {duration > 0 ? formatTime(duration) : (currentTrack.duration || '3:30')}
              </span>
            </div>
          </div>

          <div className="player-volume" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              type="button"
              onClick={handleTipArtist}
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Send 1-tap tip using unified credits"
            >
              <RiCoinsLine /> Tip Artist $5
            </button>

            <RiVolumeUpFill className="volume-icon" style={{ color: '#94a3b8', fontSize: '18px' }} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))} 
              className="volume-slider"
              style={{ width: '80px', accentColor: '#00f2fe', cursor: 'pointer' }}
            />

            <button
              type="button"
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
                setIsPlayerOpen(false);
              }}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
              title="Close Player"
            >
              <RiCloseLine size={18} />
            </button>
          </div>
        </footer>
      )}

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
    </div>
  );
}
