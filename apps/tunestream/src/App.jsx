import OnboardingTasteModal, { AUTHORITATIVE_CREATORS_FOR_TASTE, GENRES_LIST } from './components/common/OnboardingTasteModal.jsx';
import { initPlaybackSync, broadcastPlaybackStart, broadcastPlaybackStop } from './lib/playbackSync.js';
import ConsumerSupportCommunityView from './components/community/ConsumerSupportCommunityView.jsx';
import HiFiAudioPlayer from './components/player/HiFiAudioPlayer.jsx';
import PodcastStreamingHub, { AUTHORITATIVE_PODCAST_SHOWS, PodcasterEpkModal } from './components/podcasts/PodcastStreamingHub.jsx';
import PodcasterStudioWorkspace from './components/podcasts/PodcasterStudioWorkspace.jsx';
import VcDiscoverCreatorsApp from './components/vc/VcDiscoverCreatorsApp.jsx';
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import LoginView from './views/auth/LoginView';
import RegisterView from './views/auth/RegisterView';
import { RegionProvider, useRegion } from './RegionContext';
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
  RiLineChartFill, RiFileTextFill,
  RiHeadphoneFill, RiEqualizerFill, RiSmartphoneFill, RiMicFill, RiFundsBoxFill, RiDiscFill, RiShieldCheckFill
} from 'react-icons/ri';
import tsLogo from './assets/tunestream-logo.png';
import tcLogo from './assets/tunecompanion-logo.png';
import tpLogo from './assets/tunepay-logo.png';
import './App.css';

// Import newly copied header assets
import listenHero from './assets/images/listen_hero.png';

import TuneStreamNativeApp from './components/native/TuneStreamNativeApp.jsx';
import NativeAppLandingView, { LandingNavbar, LandingFooter } from './NativeAppLandingView';
import TourCapitalView from './views/landing/TourCapitalView.jsx';
import ToursView from './views/landing/ToursView.jsx';
import CreatorEpkView from './views/creator/CreatorEpkView.jsx';
import CreatorProfileView from './components/creator/CreatorProfileView.jsx';
import SyncMarketplacePanel from './components/sync/SyncMarketplacePanel.jsx';
import CreditReloadModal from './components/common/CreditReloadModal.jsx';
import LiveEventsSection from './components/events/LiveEventsSection.jsx';
import { RiTicket2Fill } from 'react-icons/ri';
import AppHelpAiControls, { GetHelpAskAiButtons } from './components/common/AppHelpAiControls.jsx';
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
import { catalogApi, streamApi, normalizeMediaUrl, resolveAudioStreamUrl, getApiBase } from './lib/api';

export const PERSONA_ROLES = [
  { id: 'admin', label: 'Administrator', shortLabel: 'Admin', shortDesc: 'All 14 apps & admin panels', icon: RiShieldFill, color: '#38bdf8' },
  { id: 'affiliate', label: 'Affiliate Partner', shortLabel: 'Affiliate', shortDesc: 'Links, Matrix & Payouts', icon: RiExchangeDollarLine, color: '#22d3ee' },
  { id: 'creator', label: 'Creator / Artist', shortLabel: 'Creator', shortDesc: 'EPK, Catalog, Splits', icon: RiMusicLine, color: '#22d3ee' },
  { id: 'podcaster', label: 'Podcaster / Show Host', shortLabel: 'Podcaster', shortDesc: 'Shows, Episodes, EPK & Ads', icon: RiMicFill, color: '#ec4899' },
  { id: 'vc', label: 'Tour Venture Capital (VC)', shortLabel: 'VC / Investor', shortDesc: 'Tour Vault, Syndicates & Telemetry', icon: RiFundsBoxFill, color: '#00f2fe' },
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


function TourCapitalWrapper({ sessionUser, onLogout }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#060813' }}>
      <LandingNavbar 
        view="tours" 
        setView={(v) => navigate(`/?view=${v}`)} 
        sessionUser={sessionUser} 
        onLogout={onLogout} 
      />
      <div style={{ flex: 1 }}>
        <TourCapitalView sessionUser={sessionUser} />
      </div>
      <LandingFooter view="tours" />
    </div>
  );
}

function TuneStreamNativeWrapper({ sessionUser, onLogout }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: '#060813' }}>
      <LandingNavbar 
        view="native-app" 
        setView={(v) => navigate(`/?view=${v}`)} 
        sessionUser={sessionUser} 
        onLogout={onLogout} 
      />
      <div style={{ flex: 1, padding: '24px 16px 80px' }}>
        <TuneStreamNativeApp
          sessionUser={sessionUser}
          onLogout={onLogout}
          onClose={() => navigate('/stream')}
        />
      </div>
      <LandingFooter view="native-app" />
    </div>
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

  // Global TuneStream Lossless Audio Player States (Ready for gesture-unlocked playback)
  const [globalTrack, setGlobalTrack] = useState(() => AUTHORITATIVE_CATALOG_TRACKS[0] || null);
  const [globalPlaying, setGlobalPlaying] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [isUndocked, setIsUndocked] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 40, y: 120 });
  const [playlistQueue, setPlaylistQueue] = useState(() => AUTHORITATIVE_CATALOG_TRACKS);
  const [userCredits, setUserCredits] = useState(() => sessionUser?.credits ?? 150);
  const [playbackContextTitle, setPlaybackContextTitle] = useState('Featured Playlist: Global Afrobeat & Amapiano Masters');
  const [catalogTracks, setCatalogTracks] = useState(AUTHORITATIVE_CATALOG_TRACKS);
  const [streamConfig, setStreamConfig] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showCreditReloadModal, setShowCreditReloadModal] = useState(false);
  const [reloadPackageInfo, setReloadPackageInfo] = useState(null);
  const [introTrackIndex, setIntroTrackIndex] = useState(0);
  const [showIntroPill, setShowIntroPill] = useState(false);

  // Play a track globally and update queue
  const handlePlayGlobalTrack = (track, queue = null) => {
    if (!track) return;
    setGlobalTrack(track);
    setGlobalPlaying(true);
    const isBackend = Boolean(
      window.location.hash.includes('/dashboard') ||
      window.location.pathname.includes('/dashboard') ||
      window.location.hash.includes('/tour-capital')
    );
    broadcastPlaybackStart(isBackend ? 'backend' : 'frontend', track);
    setGlobalProgress(0);
    if (Array.isArray(queue) && queue.length > 0) {
      setPlaylistQueue(queue);
    } else if (playlistQueue.length === 0 && catalogTracks && catalogTracks.length > 0) {
      setPlaylistQueue(catalogTracks);
    }
  };

  // Establish different introductory background music for first time visitors
  const handleCycleIntroTrack = () => {
    if (!streamConfig || !streamConfig.alternative_intro_tracks || streamConfig.alternative_intro_tracks.length === 0) return;
    const nextIdx = (introTrackIndex + 1) % streamConfig.alternative_intro_tracks.length;
    setIntroTrackIndex(nextIdx);
    const chosen = streamConfig.alternative_intro_tracks[nextIdx];
    setGlobalTrack(chosen);
    setGlobalPlaying(true);
    setGlobalProgress(0);
    setPlaybackContextTitle(`Intro BGM: ${chosen.title}`);
  };

  // Handle listener onboarding completion with 100% total personalization
  const handleSaveOnboardingPreferences = (interests) => {
    const genresParam = (interests.genres || []).join(',');
    const apiBase = getApiBase();
    fetch(`${apiBase}/api/stream/personalized-playlist?genres=${encodeURIComponent(genresParam)}`)
      .then(res => res.json())
      .then(data => {
        if (data.tracks && data.tracks.length > 0) {
          setPlaylistQueue(data.tracks);
          setGlobalTrack(data.tracks[0]);
          setPlaybackContextTitle(data.title || 'Your Daily Personalized Mix');
          setGlobalPlaying(true);
        }
      })
      .catch(() => {});
  };

  // Cross-Tab & Cross-Origin Playback Intelligence Synchronization
  useEffect(() => {
    const isBackend = Boolean(
      window.location.hash.includes('/dashboard') ||
      window.location.pathname.includes('/dashboard') ||
      window.location.hash.includes('/tour-capital')
    );
    const cleanup = initPlaybackSync({
      isBackend,
      onStopRemotePlayback: ({ callerSource }) => {
        setGlobalPlaying(false);
      }
    });
    return cleanup;
  }, []);

  // Global event listener for playback from any component
  useEffect(() => {
    const handlePlayReq = (e) => {
      if (e.detail?.track) {
        setGlobalTrack(e.detail.track);
        if (Array.isArray(e.detail.queue) && e.detail.queue.length > 0) {
          setPlaylistQueue(e.detail.queue);
        }
        setGlobalPlaying(true);
        setShowIntroPill(false);
      }
    };
    window.addEventListener('tunestreamPlayTrack', handlePlayReq);
    return () => window.removeEventListener('tunestreamPlayTrack', handlePlayReq);
  }, []);

  // Listen for Quick Reload modal triggers from Pricing section
  useEffect(() => {
    const handleOpenReload = (e) => {
      setReloadPackageInfo(e.detail || null);
      setShowCreditReloadModal(true);
    };
    window.addEventListener('tunestreamOpenReload', handleOpenReload);
    return () => window.removeEventListener('tunestreamOpenReload', handleOpenReload);
  }, []);

  // Sync sessionUser credits
  useEffect(() => {
    if (sessionUser?.credits !== undefined) {
      setUserCredits(sessionUser.credits);
    }
  }, [sessionUser?.credits]);

  // Initial playback engine: First-time visitor BGM vs Logged-in Featured / Personalized mix
  useEffect(() => {
    const handleConfigPlayback = (config) => {
      setStreamConfig(config);

      // Media Player Intelligence: Autoplay only runs on the frontend tab.
      // Backend tabs (Dashboard, Tour Capital, Studio) NEVER autoplay unprompted on load.
      const isBackendView = Boolean(
        window.location.hash.includes('/dashboard') ||
        window.location.pathname.includes('/dashboard') ||
        window.location.hash.includes('/tour-capital') ||
        window.location.pathname.includes('/tour-capital') ||
        (window.location.search && window.location.search.includes('role=') && !window.location.search.includes('role=consumer'))
      );

      if (isBackendView) {
        if (config.featured_playlist?.tracks?.length > 0) {
          setPlaylistQueue(config.featured_playlist.tracks);
          setGlobalTrack(config.featured_playlist.tracks[0]);
          setPlaybackContextTitle(config.featured_playlist.title || 'Featured Playlist');
          setGlobalPlaying(false); // DO NOT AUTOPLAY ON LOAD IN BACKEND
        }
        return;
      }

      const isFirstVisit = !localStorage.getItem('tunestream_visited');
      const hasSavedInterests = localStorage.getItem('tunestream_user_interests');

      if (sessionUser) {
        // Logged-in Listener flow
        if (hasSavedInterests) {
          // Returning listener with preferences: Play their personalized mix
          try {
            const interests = JSON.parse(hasSavedInterests);
            const genresParam = (interests.genres || []).join(',');
            const apiBase = getApiBase();
            fetch(`${apiBase}/api/stream/personalized-playlist?genres=${encodeURIComponent(genresParam)}`)
              .then(res => res.json())
              .then(data => {
                if (data.tracks && data.tracks.length > 0) {
                  setPlaylistQueue(data.tracks);
                  setGlobalTrack(data.tracks[0]);
                  setPlaybackContextTitle(data.title || 'Your Daily Personalized Mix');
                  setGlobalPlaying(false);
                }
              })
              .catch(() => {
                if (config.featured_playlist?.tracks?.length > 0) {
                  setPlaylistQueue(config.featured_playlist.tracks);
                  setGlobalTrack(config.featured_playlist.tracks[0]);
                  setPlaybackContextTitle(config.featured_playlist.title);
                  setGlobalPlaying(false);
                }
              });
          } catch {
            if (config.featured_playlist?.tracks?.length > 0) {
              setPlaylistQueue(config.featured_playlist.tracks);
              setGlobalTrack(config.featured_playlist.tracks[0]);
              setPlaybackContextTitle(config.featured_playlist.title);
              setGlobalPlaying(false);
            }
          }
        } else {
          // First time listener logs in: Play backend admin featured playlist
          if (config.featured_playlist?.tracks?.length > 0) {
            setPlaylistQueue(config.featured_playlist.tracks);
            setGlobalTrack(config.featured_playlist.tracks[0]);
            setPlaybackContextTitle(config.featured_playlist.title);
            setGlobalPlaying(false);
          }
        }
      } else {
        // First time visitor flow (Non-logged in)
        if (isFirstVisit) {
          localStorage.setItem('tunestream_visited', 'true');
          const introTrk = config.introductory_track || (config.alternative_intro_tracks && config.alternative_intro_tracks[0]);
          if (introTrk) {
            setGlobalTrack(introTrk);
            if (config.alternative_intro_tracks) {
              setPlaylistQueue(config.alternative_intro_tracks);
            }
            setPlaybackContextTitle('Introductory Background Audio');
            setShowIntroPill(true);
            setGlobalPlaying(false);
          }
        } else if (config.featured_playlist?.tracks?.length > 0) {
          setPlaylistQueue(config.featured_playlist.tracks);
          setGlobalTrack(config.featured_playlist.tracks[0]);
          setPlaybackContextTitle(config.featured_playlist.title || 'Featured Playlist: Global Afrobeat & Amapiano Masters');
          setGlobalPlaying(false);
        }
      }
    };

    const apiBase = getApiBase();
    fetch(`${apiBase}/api/stream/config`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(handleConfigPlayback)
      .catch(err => {
        console.warn('Using client fallback stream config:', err);
        const fallbackConfig = {
          introductory_track: {
            isrc: "KE-TM1-24-INTRO",
            title: "Welcome to TuneStream (Ambient Intro)",
            artist: "TuneStream Curators",
            genre: "Ambient / Afro-Chill",
            duration: "2:45",
            coverArt: "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
            audioUrl: "/uploads/audio/african_ambient_intro.mp3",
            priceCredits: 0,
            isIntro: true
          },
          alternative_intro_tracks: [
            {
              isrc: "KE-TM1-24-INTRO",
              title: "Welcome to TuneStream (Ambient Intro)",
              artist: "TuneStream Curators",
              genre: "Ambient / Afro-Chill",
              duration: "2:45",
              coverArt: "/uploads/artwork/674a412e-1be4-44ba-8125-e7aa4190b437.jpg",
              audioUrl: "/uploads/audio/african_ambient_intro.mp3",
              priceCredits: 0,
              isIntro: true
            }
          ],
          featured_playlist: {
            id: "admin-featured-default",
            title: "Global Afrobeat & Amapiano Masters",
            tracks: catalogTracks || AUTHORITATIVE_CATALOG_TRACKS
          }
        };
        handleConfigPlayback(fallbackConfig);
      });
  }, [sessionUser?.id]);

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
          <Route path="/" element={<NativeAppLandingView sessionUser={sessionUser} onLogout={handleLogout} onPlayTrack={handlePlayGlobalTrack} onOpenPersonalization={() => setShowOnboardingModal(true)} />} />
          <Route path="/explore" element={<Navigate to="/?view=explore" replace />} />
          <Route path="/concerts" element={<Navigate to="/?view=tours" replace />} />
          <Route path="/events" element={<Navigate to="/?view=tours" replace />} />
          <Route path="/tours" element={<Navigate to="/?view=tours" replace />} />
          <Route path="/tour-capital" element={<TourCapitalWrapper sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/vc-capital" element={<Navigate to="/tour-capital" replace />} />
          <Route path="/stream" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="home" onLogout={handleLogout} />} />
          <Route path="/dj-mixes" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="dj-mixes" onLogout={handleLogout} />} />
          <Route path="/singles" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="singles" onLogout={handleLogout} />} />
          <Route path="/artists" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="artists" onLogout={handleLogout} />} />
          <Route path="/catalog" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="my-catalog" onLogout={handleLogout} />} />
          <Route path="/sync" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/sync-marketplace" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="sync-marketplace" onLogout={handleLogout} />} />
          <Route path="/apps" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="apps" onLogout={handleLogout} />} />
          <Route path="/native" element={<TuneStreamNativeWrapper sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/native-app" element={<TuneStreamNativeWrapper sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/mobile" element={<TuneStreamNativeWrapper sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/app" element={<TuneStreamNativeWrapper sessionUser={sessionUser} onLogout={handleLogout} />} />
          <Route path="/companion" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="companion" onLogout={handleLogout} />} />
          <Route path="/tunecompanion" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="companion" onLogout={handleLogout} />} />
          <Route path="/login" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/register" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/dashboard" element={<PlayerDashboard sessionUser={sessionUser} onPlayGlobalTrack={handlePlayGlobalTrack} initialTab="home" onLogout={handleLogout} />} />
          <Route path="/epk/:username" element={<CreatorEpkView sessionUser={sessionUser} />} />
          <Route path="/epk" element={<CreatorEpkView sessionUser={sessionUser} />} />
          <Route path="/help" element={<Navigate to="/?view=help" replace />} />
          <Route path="/docs" element={<Navigate to="/?view=help" replace />} />
          <Route path="/support" element={<Navigate to="/?view=support" replace />} />
          <Route path="/tickets" element={<Navigate to="/?view=support" replace />} />
          <Route path="/blog" element={<Navigate to="/?view=blog" replace />} />
          <Route path="/forum" element={<Navigate to="/?view=forum" replace />} />
          <Route path="/community/blog" element={<Navigate to="/?view=blog" replace />} />
          <Route path="/community/forum" element={<Navigate to="/?view=forum" replace />} />
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

      {/* First-Time Visitor Background Music Controller Pill */}
            {/* Interactive Taste Profile & Preferred Creators Onboarding Modal */}
      {showOnboardingModal && (
        <OnboardingTasteModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          onSavePreferences={handleSaveOnboardingPreferences}
        />
      )}

{showIntroPill && globalTrack?.isIntro && (
        <div style={{
          position: 'fixed',
          top: '72px',
          right: '20px',
          background: 'rgba(7, 14, 27, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          borderRadius: '24px',
          padding: '6px 14px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '12px'
        }}>
          <span style={{ color: '#00f0ff', fontWeight: 'bold' }}>🎵 Ambient Intro BGM</span>
          <button
            onClick={handleCycleIntroTrack}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              color: '#00f0ff',
              padding: '2px 8px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Switch introductory background track"
          >
            Change Intro Track &rarr;
          </button>
          <button
            onClick={() => setShowIntroPill(false)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Authoritative TuneMavens Hi-Fi Audio Player (suppressed on /epk to ensure single EPK overlay player) */}
      {globalTrack && !location.pathname.startsWith('/epk') && (
        <HiFiAudioPlayer
          track={globalTrack}
          tracks={playlistQueue && playlistQueue.length > 0 ? playlistQueue : catalogTracks}
          playlistName={playbackContextTitle}
          isPlaying={globalPlaying}
          onTogglePlay={setGlobalPlaying}
          onTrackSelect={(t) => {
            setGlobalTrack(t);
            setGlobalPlaying(true);
          }}
          sessionUser={sessionUser}
          onClose={() => {
            setGlobalPlaying(false);
            setGlobalTrack(null);
            setShowIntroPill(false);
          }}
        />
      )}

      {/* Zero Subscription Credit Reload Modal */}
      <CreditReloadModal
        isOpen={showCreditReloadModal}
        onClose={() => setShowCreditReloadModal(false)}
        sessionUser={sessionUser}
        suggestedPackageId={reloadPackageInfo ? reloadPackageInfo.packName : null}
        reason={reloadPackageInfo ? `Top-Up ${reloadPackageInfo.packName}` : 'TuneStream Non-Expiring Credits'}
      />
    </div>
  );
}

function EcosystemAppsPanel({ setActiveTab }) {
  const apps = [
    {
      id: 'consumer',
      title: 'TuneStream Mobile',
      tagline: 'Stream. Tip. Carry the catalogue.',
      target: 'Mobile & Offline Sync',
      desc: 'The flagship listener streaming app with high-fidelity 24-bit / 96kHz FLAC audio, 8GB smart offline crate caching, and 1-tap direct creator tipping.',
      platforms: 'iOS & Android (Capacitor)',
      logo: tsLogo,
      accent: '#00f2fe',
      actionLabel: 'Launch Mobile Native App',
      actionTab: 'native-app',
      features: [
        'Lossless 24-bit / 96kHz FLAC audio & low-latency streaming',
        '8GB smart offline crate caching for flights & commutes',
        '1-tap direct creator tipping with zero middlemen',
        'Region-aware editorial feeds and 24/7 community live radio'
      ]
    },
    {
      id: 'dac-desktop',
      title: 'TuneStream Desktop & DAC Bridge',
      tagline: 'Bit-perfect studio reference sound.',
      target: 'For HiFi Audiophiles',
      desc: 'Desktop audiophile engine engineered for bit-perfect hardware USB DAC passthrough, OS sound-mixer bypass, and 10-band studio equalizer calibration.',
      platforms: 'macOS (CoreAudio) & Windows (ASIO)',
      logo: tsLogo,
      accent: '#10b981',
      actionLabel: 'Configure Studio EQ & DAC',
      actionTab: 'stream-controls',
      features: [
        'Bit-perfect USB DAC hardware passthrough',
        'Exclusive CoreAudio & ASIO mixer bypass mode',
        '10-band parametric equalizer with Afrobeat & Amapiano sub presets',
        'Zero-compression 24-bit / 96kHz master playback'
      ]
    },
    {
      id: 'live-pass',
      title: 'TuneStream Live Pass & CarPlay',
      tagline: 'From the highway to the front row.',
      target: 'Live Shows & In-Car',
      desc: 'Your digital concert pass wallet and in-car lossless companion: store offline QR VIP tour passes, get local show alerts, and stream hands-free in your car.',
      platforms: 'Apple CarPlay, Android Auto & Watch',
      logo: tsLogo,
      accent: '#f59e0b',
      actionLabel: 'Browse Live Shows & Passes',
      actionTab: 'concerts',
      features: [
        'Offline QR concert pass & VIP tour ticket wallet',
        'Instant local tour & festival alerts for artists you follow',
        'Native Apple CarPlay & Android Auto lossless dashboard',
        'Seamless handoff between phone, car & home Hi-Fi speakers'
      ]
    }
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Header Banner */}
      <div style={{ 
        padding: '36px 32px', 
        borderRadius: '3px', 
        border: '1px solid rgba(0, 242, 254, 0.25)', 
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.06) 0%, rgba(15, 23, 42, 0.7) 100%)', 
        marginBottom: '28px', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <RiApps2Fill size={22} style={{ color: '#00f2fe' }} />
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0 }}>TuneStream Listener Apps &amp; HiFi Device Suite</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '840px' }}>
          Built 100% for listeners, concertgoers, and audiophiles. Every TuneStream app synchronizes your custom playlist crates, 8GB offline cache, live show passes, and non-expiring TM Credits in real time.
        </p>

        <div className="ts-ecosystem-summary-grid">
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mobile &amp; Offline</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>8GB Smart Crate Caching</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Carry lossless FLAC playlists offline anywhere.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Studio HiFi &amp; DAC</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>24-Bit / 96kHz Bit-Perfect</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Hardware DAC passthrough &amp; 10-band studio EQ.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Shows &amp; CarPlay</span>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>VIP Concert Pass Wallet</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>QR festival tickets &amp; hands-free in-car audio.</div>
          </div>
        </div>
      </div>

      {/* Expansive Full-Width Listener Apps Grid */}
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

            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab(app.actionTab)}
              style={{
                marginBottom: '10px',
                width: '100%',
                padding: '10px 14px',
                background: app.accent,
                border: 'none',
                borderRadius: '3px',
                color: '#060813',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {app.actionLabel} &rarr;
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
              <button 
                type="button" 
                onClick={() => setActiveTab && setActiveTab(app.actionTab)}
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
                onClick={() => setActiveTab && setActiveTab(app.actionTab)}
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

function TuneStreamDeviceSyncPanel({ tracks = [], onPlayTrack, setActiveTab }) {
  const [wifiAutoSync, setWifiAutoSync] = useState(true);
  const [losslessOffline, setLosslessOffline] = useState(true);
  const [offlineStats, setOfflineStats] = useState({
    totalAllocation: '8.0 GB',
    usedAllocation: '1.8 GB',
    usedPercent: 22.5,
    maxDays: 30,
    targetLufs: -12.0
  });
  const [devices, setDevices] = useState([
    { id: 'dev_1', name: 'iPhone 16 Pro · TuneStream iOS', type: 'Mobile Client', cacheUsed: '1.4 GB / 8.0 GB', status: 'Synced & Active', active: true },
    { id: 'dev_2', name: 'MacBook Pro · Studio DAC Bridge', type: '24-Bit / 96kHz CoreAudio', cacheUsed: '0.4 GB / 8.0 GB', status: 'Bit-Perfect Ready', active: true },
    { id: 'dev_3', name: 'Apple CarPlay · In-Car Receiver', type: 'Vehicle Audio Node', cacheUsed: 'Streaming Cache', status: 'Paired via iPhone', active: false }
  ]);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  useEffect(() => {
    streamApi.getOfflineCache()
      .then(res => {
        if (res && res.ok) {
          setOfflineStats({
            totalAllocation: res.total_allocation_human || '8.0 GB',
            usedAllocation: res.used_allocation_human || '1.8 GB',
            usedPercent: res.used_percent || 22.5,
            maxDays: res.max_offline_days || 30,
            targetLufs: res.target_lufs || -12.0
          });
          if (res.devices && res.devices.length > 0) {
            setDevices(res.devices);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleTriggerSync = () => {
    setSyncStatusMsg('Synchronizing offline cache metadata across 3 devices...');
    setTimeout(() => {
      setSyncStatusMsg('All 8GB offline crates verified and bit-perfect with -12 LUFS calibration!');
      setTimeout(() => setSyncStatusMsg(''), 4000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Banner */}
      <div className="dashboard-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(9, 15, 30, 0.95) 0%, rgba(16, 28, 56, 0.85) 100%)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase' }}>Mobile &amp; Device Sync</span>
            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '4px 0' }}>8GB Smart Offline Cache &amp; Paired Devices</h3>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: 0, maxWidth: '640px' }}>
              Synchronize your custom playlist crates and liked 24-bit FLAC tracks across your phone, desktop DAC, and CarPlay receiver for zero-buffering offline playback with {offlineStats.maxDays}-day cryptographic license leases.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleTriggerSync}
              style={{ background: 'rgba(0, 242, 254, 0.12)', border: '1px solid #00f2fe', color: '#00f2fe', padding: '10px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              ↻ Refresh Device Sync
            </button>
            <button
              type="button"
              onClick={() => setActiveTab && setActiveTab('library')}
              style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '10px 20px', borderRadius: '3px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
            >
              Manage Cached Crates &rarr;
            </button>
          </div>
        </div>
        {syncStatusMsg && (
          <div style={{ marginTop: '14px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '3px', color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>
            ✓ {syncStatusMsg}
          </div>
        )}
      </div>

      {/* Storage Meter & Sync Toggles */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>Offline Smart Cache Allocation</h4>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#00f2fe' }}>
            {offlineStats.usedAllocation} / {offlineStats.totalAllocation} Used ({offlineStats.usedPercent}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ width: `${offlineStats.usedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #10b981)', borderRadius: '3px' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}>
            <input type="checkbox" checked={wifiAutoSync} onChange={(e) => setWifiAutoSync(e.target.checked)} />
            <span>Auto-Sync Custom Playlist Crates &amp; Liked Songs over Wi-Fi</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}>
            <input type="checkbox" checked={losslessOffline} onChange={(e) => setLosslessOffline(e.target.checked)} />
            <span>Cache Uncompressed 24-Bit FLAC Masters (-12 LUFS Target, {offlineStats.maxDays}-day Cryptographic Lease)</span>
          </label>
        </div>
      </div>

      {/* Paired Listener Devices */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: '0 0 16px' }}>Signed-In Listener Devices</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {devices.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <RiSmartphoneFill size={22} style={{ color: d.active ? '#00f2fe' : '#64748b' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#fff' }}>{d.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{d.type} • Cache: {d.cacheUsed}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: d.active ? '#10b981' : '#94a3b8', background: d.active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '3px', fontWeight: '600' }}>
                  ● {d.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TuneStreamHomePanel({ sessionUser, tracks = [], artists = [], userCredits, setActiveTab, onPlayTrack }) {
  const [listenerInterests, setListenerInterests] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_user_interests');
      return saved ? JSON.parse(saved) : { genres: ['Afrobeat', 'Amapiano', 'Highlife'], vibe: 'chill' };
    } catch {
      return { genres: ['Afrobeat', 'Amapiano', 'Highlife'], vibe: 'chill' };
    }
  });

  const [recentTips] = useState([
    { id: 1, artist: 'Ndufo', track: 'Enenda', credits: 50, amount: '$5.00', date: 'Just now', badge: 'Superfan' },
    { id: 2, artist: 'Burna Boy', track: 'City Boys', credits: 50, amount: '$5.00', date: '2 days ago', badge: 'Patron' },
    { id: 3, artist: 'Tems', track: 'Me & U', credits: 50, amount: '$5.00', date: '5 days ago', badge: 'Early Supporter' }
  ]);

  const handlePlayPersonalizedMix = () => {
    const genresParam = (listenerInterests.genres || ['Afrobeat']).join(',');
    const apiBase = getApiBase();
    fetch(`${apiBase}/api/stream/personalized-playlist?genres=${encodeURIComponent(genresParam)}`)
      .then(r => r.json())
      .then(data => {
        if (data.tracks && data.tracks.length > 0) {
          window.dispatchEvent(new CustomEvent('tunestreamPlayTrack', {
            detail: { track: data.tracks[0], queue: data.tracks, contextTitle: data.title || 'Your Daily Personalized Mix' }
          }));
        }
      })
      .catch(() => {
        if (tracks.length > 0) {
          window.dispatchEvent(new CustomEvent('tunestreamPlayTrack', {
            detail: { track: tracks[0], queue: tracks, contextTitle: 'Global Afrobeat & Amapiano Masters' }
          }));
        }
      });
  };

  return (
    <div className="tunestream-home-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Listener KPI Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(0, 240, 255, 0.25)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>TM Credits Balance</span>
            <RiCoinsFill size={18} style={{ color: '#00f2fe' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#00f2fe' }}>{(userCredits ?? 150).toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#94a3b8' }}>Credits</span></div>
          <div style={{ fontSize: '11px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Non-Expiring • 0 Subscriptions</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('tunestreamOpenReload'))}
              style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f2fe', color: '#00f2fe', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', cursor: 'pointer' }}
            >
              + Top-Up
            </button>
          </div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Listening Fidelity</span>
            <RiEqualizerFill size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>24-bit / 96kHz</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>Master FLAC • DAC Bit-Perfect</div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Direct Artist Support</span>
            <RiHeart3Fill size={18} style={{ color: '#ec4899' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{recentTips.length} Creators</div>
          <div style={{ fontSize: '12px', color: '#ec4899', marginTop: '6px' }}>100% Direct Tips via Split Cascade</div>
        </div>

        <div className="dashboard-card" style={{ padding: '20px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Offline Smart Cache</span>
            <RiSmartphoneFill size={18} style={{ color: '#a855f7' }} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>1.8 GB <span style={{ fontSize: '14px', color: '#64748b' }}>/ 8 GB</span></div>
          <div style={{ fontSize: '12px', color: '#a855f7', marginTop: '6px' }}>TuneCompanion Sync Active</div>
        </div>
      </div>

      {/* Personalized Stream Hero Banner */}
      <div className="dashboard-card" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(9, 15, 30, 0.95) 0%, rgba(13, 24, 48, 0.85) 100%)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '3px', padding: '3px 8px', fontSize: '10px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✦ Daily Tailored Crate
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 6px' }}>
              Your Daily Personalized Mix
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, maxWidth: '600px' }}>
              Engineered exclusively from your onboarding taste preferences. Seamlessly streaming high-res 24-bit lossless masters.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePlayPersonalizedMix}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#00f2fe',
              color: '#060813',
              border: 'none',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 242, 254, 0.35)'
            }}
          >
            <RiPlayFill size={18} /> Play Personalized Mix
          </button>
        </div>

        {/* Selected Preferences Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Tuned For:</span>
          {(listenerInterests.genres || ['Afrobeat', 'Amapiano']).map(g => (
            <span key={g} style={{ fontSize: '11px', color: '#00f2fe', background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
              {g}
            </span>
          ))}
          <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '3px', fontWeight: '600' }}>
            ● Vibe: {listenerInterests.vibe || 'Chill & Relax'}
          </span>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Refine Taste &rarr;
          </button>
        </div>
      </div>

      {/* Quick Listener Launchpad */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '800', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiApps2Fill style={{ color: '#00f2fe' }} /> Listener Quick Actions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiCompass3Line size={20} style={{ color: '#00f2fe' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Explore Streams</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Lossless catalog stream</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('podcasts')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiMicFill size={20} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Podcasts &amp; Shows</span>
            <span style={{ fontSize: '11px', color: '#10b981' }}>Episodes, chapters &amp; EPKs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dj-mixes')}
            data-testid="home-quick-dj-mixes"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(0,242,254,0.06)', border: '1px solid rgba(0,242,254,0.25)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiDiscFill size={20} style={{ color: '#00f2fe' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>DJ Mixes &amp; Sets</span>
            <span style={{ fontSize: '11px', color: '#00f2fe' }}>Continuous cleared club sets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('library')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiFolderMusicLine size={20} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>My Playlist Crates</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Manage custom crates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('concerts')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiTicket2Fill size={20} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Live Shows &amp; Passes</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Tour tickets &amp; RSVP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stream-controls')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiEqualizerFill size={20} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Lossless Sound &amp; EQ</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>24-bit studio equalizer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('companion')}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiSmartphoneFill size={20} style={{ color: '#c084fc' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>TuneCompanion App</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>8GB offline mobile sync</span>
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('tunestreamOpenReload'))}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
          >
            <RiCoinsFill size={20} style={{ color: '#00f2fe' }} />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Top-Up TM Credits</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Zero subscriptions ever</span>
          </button>
        </div>
      </div>

      {/* Recommended Lossless Streams */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '800', margin: 0 }}>Trending African Masters</h4>
          <button
            type="button"
            onClick={() => setActiveTab('explore')}
            style={{ background: 'transparent', border: 'none', color: '#00f2fe', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Browse All &rarr;
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tracks.slice(0, 5).map((track, idx) => (
            <div
              key={track.id || track.isrc}
              onClick={() => onPlayTrack && onPlayTrack(track)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', width: '16px', textAlign: 'center' }}>{idx + 1}</span>
                <img src={normalizeMediaUrl(track.cover || track.coverArt)} alt={track.title} onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }} style={{ width: '40px', height: '40px', borderRadius: '3px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{track.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{track.artist} • {track.genre || 'Afrobeats'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                  24-BIT FLAC
                </span>
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

function TuneStreamLibraryPanel({ tracks = [], onPlayTrack }) {
  const [crates, setCrates] = useState([
    { id: 'crate_1', name: 'Nairobi Cyberwave Crate', count: 14, genre: 'Afro-Synth', cover: '/uploads/artwork/ndufo_cover.jpg' },
    { id: 'crate_2', name: 'Sunset Chill & Drive', count: 22, genre: 'Amapiano', cover: '/heroes/ndufo_hero_slide1_retina.jpg' },
    { id: 'crate_3', name: 'High-Energy Lagos Beats', count: 18, genre: 'Afrobeat', cover: '/heroes/ndufo_hero_slide2_retina.jpg' }
  ]);
  const [savedTracks, setSavedTracks] = useState(tracks);
  const [newCrateName, setNewCrateName] = useState('');
  const [newCrateGenre, setNewCrateGenre] = useState('Afro-Fusion');
  const [showCreateCrate, setShowCreateCrate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    streamApi.getLibrary()
      .then(res => {
        if (res && res.library) {
          if (res.library.crates && res.library.crates.length > 0) {
            setCrates(res.library.crates);
          }
          if (res.library.liked_tracks && res.library.liked_tracks.length > 0) {
            setSavedTracks(res.library.liked_tracks);
          }
        }
      })
      .catch(() => {});
  }, [tracks]);

  const handleCreateCrate = (e) => {
    e.preventDefault();
    if (!newCrateName.trim()) return;
    setLoading(true);
    streamApi.createCrate({
      name: newCrateName.trim(),
      genre: newCrateGenre,
      cover: '/uploads/artwork/ndufo_cover.jpg'
    })
      .then(res => {
        if (res && res.crate) {
          setCrates(prev => [...prev, res.crate]);
        } else {
          setCrates(prev => [
            ...prev,
            { id: `crate_${Date.now()}`, name: newCrateName.trim(), count: 0, genre: newCrateGenre, cover: '/uploads/artwork/ndufo_cover.jpg' }
          ]);
        }
        setNewCrateName('');
        setShowCreateCrate(false);
      })
      .catch(() => {
        setCrates(prev => [
          ...prev,
          { id: `crate_${Date.now()}`, name: newCrateName.trim(), count: 0, genre: newCrateGenre, cover: '/uploads/artwork/ndufo_cover.jpg' }
        ]);
        setNewCrateName('');
        setShowCreateCrate(false);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteCrate = (crateId) => {
    if (confirm('Delete this offline crate from your library?')) {
      streamApi.deleteCrate(crateId).catch(() => {});
      setCrates(prev => prev.filter(c => c.id !== crateId));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Crate Actions */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 4px' }}>My Playlist Crates</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Organize your offline music crates and curated lossless playlists (Persisted in TuneStream Vault).</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateCrate(!showCreateCrate)}
            style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}
          >
            + Create New Crate
          </button>
        </div>

        {showCreateCrate && (
          <form onSubmit={handleCreateCrate} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter crate name (e.g. Accra Midnight Grooves)..."
              value={newCrateName}
              onChange={(e) => setNewCrateName(e.target.value)}
              style={{ flex: 2, minWidth: '220px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
            />
            <input
              type="text"
              placeholder="Genre (e.g. Afro-Fusion)..."
              value={newCrateGenre}
              onChange={(e) => setNewCrateGenre(e.target.value)}
              style={{ flex: 1, minWidth: '140px', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
            />
            <button type="submit" disabled={loading} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              {loading ? 'Saving...' : 'Save Crate'}
            </button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {crates.map(c => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img src={c.cover} alt={c.name} onError={(e) => { e.currentTarget.src = '/uploads/artwork/ndufo_cover.jpg'; }} style={{ width: '50px', height: '50px', borderRadius: '3px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.count} tracks • {c.genre}</div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>● 8GB Cache Enabled</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteCrate(c.id)}
                title="Delete Crate"
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '4px' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Tracks in Library */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 16px' }}>Saved Tracks &amp; Offline Downloads</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(savedTracks.length > 0 ? savedTracks : tracks).map((t, idx) => (
            <div key={t.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{idx + 1}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{t.title}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t.artist}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '3px' }}>24-Bit FLAC Cached</span>
                <button
                  type="button"
                  onClick={() => onPlayTrack && onPlayTrack(t)}
                  style={{ background: '#00f2fe', border: 'none', color: '#000', padding: '5px 12px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TuneStreamTipsPanel({ userCredits, sessionUser }) {
  const [tipsHistory, setTipsHistory] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState('Ndufo');
  const [tipCredits, setTipCredits] = useState(50);
  const [tipMessage, setTipMessage] = useState('');
  const [tipSuccessNotice, setTipSuccessNotice] = useState(null);
  const [tipSubmitting, setTipSubmitting] = useState(false);

  useEffect(() => {
    streamApi.getTipsHistory()
      .then(res => {
        if (res && res.tips) {
          setTipsHistory(res.tips);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendDirectTip = (e) => {
    e.preventDefault();
    if (tipCredits <= 0) return;
    setTipSubmitting(true);
    setTipSuccessNotice(null);

    streamApi.tipCreator({
      creator_id: selectedCreator.toLowerCase().replace(/\s+/g, '_'),
      amount_credits: tipCredits,
      message: tipMessage.trim() || `Supporting ${selectedCreator} directly!`,
      payment_method: 'credits'
    })
      .then(res => {
        const receipt = res.receipt_token || `TM-TIP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTipItem = {
          id: `tip_${Date.now()}`,
          artist: selectedCreator,
          creator_name: selectedCreator,
          track: 'Studio Master Stream',
          credits: tipCredits,
          amount: `$${(tipCredits / 10).toFixed(2)}`,
          date: 'Just now',
          status: 'Settled 100% Direct via Split Cascade',
          receipt_token: receipt
        };
        setTipsHistory(prev => [newTipItem, ...prev]);
        setTipSuccessNotice(`Tip of ${tipCredits} TM ($${(tipCredits / 10).toFixed(2)}) sent to ${selectedCreator}! Receipt: ${receipt}`);
        setTipMessage('');
      })
      .catch(err => {
        // Fallback simulation if offline
        const receipt = `TM-TIP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTipItem = {
          id: `tip_${Date.now()}`,
          artist: selectedCreator,
          creator_name: selectedCreator,
          track: 'Studio Master Stream',
          credits: tipCredits,
          amount: `$${(tipCredits / 10).toFixed(2)}`,
          date: 'Just now',
          status: 'Settled 100% Direct via Split Cascade',
          receipt_token: receipt
        };
        setTipsHistory(prev => [newTipItem, ...prev]);
        setTipSuccessNotice(`Tip of ${tipCredits} TM ($${(tipCredits / 10).toFixed(2)}) sent to ${selectedCreator}! Receipt: ${receipt}`);
        setTipMessage('');
      })
      .finally(() => setTipSubmitting(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Balance & Top-Up Card */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 'bold', textTransform: 'uppercase' }}>Superfan Wallet</span>
            <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '4px 0' }}>
              {(userCredits ?? 150).toLocaleString()} <span style={{ fontSize: '16px', color: '#94a3b8' }}>TM Credits</span>
            </h3>
            <p style={{ fontSize: '12px', color: '#10b981', margin: 0 }}>
              100% Non-expiring TM credits • Zero monthly subscriptions • Instant micro-royalties
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('tunestreamOpenReload'))}
            style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '12px 24px', borderRadius: '3px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0, 242, 254, 0.3)' }}
          >
            + Top-Up Credits Now
          </button>
        </div>
      </div>

      {/* 1-Tap Direct Creator Tip Box */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 12px' }}>1-Tap Direct Creator Tipping Flow</h4>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
          Tip favorite creators directly from your wallet with 95% to 100% net payout via sovereign Split Cascade routing.
        </p>

        {tipSuccessNotice && (
          <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '3px', color: '#10b981', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
            ✓ {tipSuccessNotice}
          </div>
        )}

        <form onSubmit={handleSendDirectTip} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>CHOOSE CREATOR</label>
              <select
                value={selectedCreator}
                onChange={(e) => setSelectedCreator(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
              >
                <option value="Ndufo">Ndufo (Afrobeats &amp; Cyberwave)</option>
                <option value="Khalid Waves">Khalid Waves (Deep-House)</option>
                <option value="Burna Boy">Burna Boy (Afro-Fusion)</option>
                <option value="Tems">Tems (R&amp;B / Soul)</option>
                <option value="Intermaven Collective">Intermaven Collective (Producer Node)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>TIP AMOUNT</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[50, 100, 250].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipCredits(amt)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: tipCredits === amt ? '#00f2fe' : 'rgba(255,255,255,0.05)',
                      color: tipCredits === amt ? '#060813' : '#fff',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {amt} TM (${(amt / 10).toFixed(0)})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>MESSAGE OF SUPPORT (OPTIONAL)</label>
            <input
              type="text"
              placeholder="e.g. Masterful production on the percussion stems!"
              value={tipMessage}
              onChange={(e) => setTipMessage(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={tipSubmitting}
            style={{
              padding: '10px 20px',
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            {tipSubmitting ? 'Processing Sovereign Split...' : `⚡ Send ${tipCredits} TM ($${(tipCredits / 10).toFixed(2)}) Directly to ${selectedCreator}`}
          </button>
        </form>
      </div>

      {/* Direct Tipping Ledger */}
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '0 0 16px' }}>Direct Creator Tipping Ledger</h4>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px' }}>
          Every credit you tip goes 95% to 100% directly to the creator's Split Cascade wallet without corporate intermediaries pocketing royalties.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tipsHistory.map(tip => (
            <div key={tip.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '3px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                  Tipped <strong>{tip.artist || tip.creator_name}</strong> • <span style={{ color: '#00f2fe' }}>{tip.credits || tip.gross_credits} Credits ({tip.amount || `$${((tip.credits || tip.gross_credits || 50) / 10).toFixed(2)}`})</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  {tip.track || 'Lossless FLAC Stream'} • {tip.date || 'Settled'} {tip.receipt_token && `• Receipt: ${tip.receipt_token}`}
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '3px', fontWeight: '600' }}>
                ✓ {tip.status || 'Settled 100% Direct via Split Cascade'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TuneStreamControlsPanel() {
  const [quality, setQuality] = useState('flac_master');
  const [dacPassthrough, setDacPassthrough] = useState(true);
  const [eqPreset, setEqPreset] = useState('afro_dance');
  const [dataSaver, setDataSaver] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#fff', margin: '0 0 6px' }}>Lossless Sound &amp; Equalizer Engine</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px' }}>Configure studio bit-depth calibration, DAC routing, and 10-band equalizer settings.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Streaming Bit-Depth</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}
            >
              <option value="flac_master">Studio 24-Bit / 96kHz FLAC Master</option>
              <option value="cd_quality">Lossless 16-Bit / 44.1kHz (CD Quality)</option>
              <option value="high">HQ 320kbps AAC</option>
              <option value="saver">Data-Saver 128kbps</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>Studio EQ Preset</label>
            <select
              value={eqPreset}
              onChange={(e) => setEqPreset(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: '#050811', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px', color: '#fff', fontSize: '13px' }}
            >
              <option value="afro_dance">Afro-Beat Club &amp; Bass Punch</option>
              <option value="amapiano_sub">Amapiano Deep Log Drum Sub</option>
              <option value="vocal_air">Acoustic &amp; Vocal Clarity</option>
              <option value="flat">Studio Flat Reference</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}>
            <input type="checkbox" checked={dacPassthrough} onChange={(e) => setDacPassthrough(e.target.checked)} />
            <span>Enable Bit-Perfect DAC Hardware Passthrough (Bypasses OS sound mixers)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}>
            <input type="checkbox" checked={dataSaver} onChange={(e) => setDataSaver(e.target.checked)} />
            <span>Smart Cellular Data Saver (Downgrade to 160kbps when streaming on metered mobile data)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export const AUTHORITATIVE_DJ_MIXES = [
  {
    id: 'djmix_kilifi_sunrise',
    title: 'Kilifi New Year Sunrise Ritual (Afro-Tech Set)',
    dj_name: 'DJ K-Souldier',
    genre: 'Afro-House',
    bpm_avg: 122,
    duration_seconds: 2700,
    duration: '45:00',
    plays_count: 1540,
    commercial_price: 5.99,
    is_original_ip_only: false,
    sale_locked: false,
    artwork_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    audio_url: '/api/stream/track/KE-TM1-DJ-001',
    description: 'Hypnotic 45-minute sunrise Afro-Tech journey recorded live on the Indian Ocean coast with full artist and label clearance.',
    tracklist: [
      { id: 'k1', title: 'Bahari Breeze (Coastal Dub)', artist: 'Ndufo', start_time: 0, clearance_status: 'signed' },
      { id: 'k2', title: 'Diani Horizon (Tribal Mix)', artist: 'Zara Chen', start_time: 900, clearance_status: 'signed' },
      { id: 'k3', title: 'Mombasa Express (VIP Percussion)', artist: 'Marcus Vance', start_time: 1800, clearance_status: 'signed' },
    ],
  },
  {
    id: 'djmix_jozi_lagos_amapiano',
    title: 'Jozi to Lagos Private School Amapiano Vol. 4',
    dj_name: 'DJ Zinhle Vibes',
    genre: 'Amapiano',
    bpm_avg: 113,
    duration_seconds: 2400,
    duration: '40:00',
    plays_count: 2120,
    commercial_price: 4.99,
    is_original_ip_only: false,
    sale_locked: false,
    artwork_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    audio_url: '/api/stream/track/KE-TM1-DJ-002',
    description: 'Soulful keys, deep log drums, and vocal Amapiano exclusives bridging Johannesburg and Lagos club floors.',
    tracklist: [
      { id: 'jz1', title: 'Sandton Rooftop Chords', artist: 'DJ Maphoria', start_time: 0, clearance_status: 'signed' },
      { id: 'jz2', title: 'Victoria Island Velvet', artist: 'Aisha Okoro', start_time: 1200, clearance_status: 'signed' },
    ],
  },
  {
    id: 'djmix_maphoria_techno',
    title: 'All-Original High-Voltage Techno Experience',
    dj_name: 'DJ Maphoria',
    genre: 'Electronic',
    bpm_avg: 130,
    duration_seconds: 1800,
    duration: '30:00',
    plays_count: 890,
    commercial_price: 7.99,
    is_original_ip_only: true,
    sale_locked: false,
    artwork_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    audio_url: '/api/stream/track/KE-TM1-DJ-003',
    description: '100% self-composed hardware synth modular set performed exclusively with custom analog hardware.',
    tracklist: [
      { id: 'og1', title: 'Subterranean Voltage (Original Mix)', artist: 'DJ Maphoria', start_time: 0, clearance_status: 'self_owned' },
      { id: 'og2', title: 'Kinetic Oscillation (Original Mix)', artist: 'DJ Maphoria', start_time: 600, clearance_status: 'self_owned' },
      { id: 'og3', title: 'Nairobi Circuit Breakdown (Original Mix)', artist: 'DJ Maphoria', start_time: 1200, clearance_status: 'self_owned' },
    ],
  },
  {
    id: 'djmix_accra_highlife',
    title: 'Accra Highlife & Afrobeats Golden Hour Mix',
    dj_name: 'Selector Kofi',
    genre: 'Afrobeats',
    bpm_avg: 106,
    duration_seconds: 2100,
    duration: '35:00',
    plays_count: 1180,
    commercial_price: 4.49,
    is_original_ip_only: false,
    sale_locked: false,
    artwork_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    audio_url: '/api/stream/track/KE-TM1-DJ-004',
    description: 'Warm brass-driven Highlife classics blended seamlessly into modern West African Afrobeats anthems.',
    tracklist: [
      { id: 'ac1', title: 'Labadi Beach Horns', artist: 'Kofi Mensah', start_time: 0, clearance_status: 'signed' },
      { id: 'ac2', title: 'Osu Night Market Groove', artist: 'Aisha Okoro', start_time: 1050, clearance_status: 'signed' },
    ],
  },
];

function resolveDjSlug(djName) {
  const raw = String(djName || '').toLowerCase().trim();
  if (raw.includes('khalid')) return 'khalid';
  if (raw.includes('souldier')) return 'djksouldier';
  if (raw.includes('zinhle')) return 'djzinhlevibes';
  if (raw.includes('maphoria')) return 'djmaphoria';
  if (raw.includes('kofi')) return 'selectorkofi';
  if (raw.includes('kalonje')) return 'djkalonje';
  return raw.replace(/[^a-z0-9]/g, '') || 'khalid';
}

function resolveArtistPersona(artist) {
  if (!artist) return 'artist';
  const ct = String(artist.creator_type || artist.persona || '').toLowerCase();
  if (ct === 'dj' || ct === 'producer' || ct === 'podcaster' || ct === 'label' || ct === 'publisher') {
    return ct === 'publisher' ? 'label' : ct;
  }
  const roleStr = String(artist.role || '').toLowerCase();
  const nameStr = String(artist.name || artist.subdomain || '').toLowerCase();
  if (roleStr.includes('dj') || roleStr.includes('turntablist') || roleStr.includes('selector') || nameStr.startsWith('dj') || nameStr.includes('khalid') || nameStr.includes('selector')) return 'dj';
  if (roleStr.includes('producer') || nameStr.includes('brian')) return 'producer';
  if (roleStr.includes('label') || roleStr.includes('publisher') || nameStr.includes('cyber') || nameStr.includes('intermaven')) return 'label';
  if (roleStr.includes('pod')) return 'podcaster';
  return 'artist';
}

function TuneStreamDjMixesPanel({ onPlayTrack }) {
  const { formatPrice } = useRegion();
  const [mixes, setMixes] = useState(AUTHORITATIVE_DJ_MIXES);
  const [genreFilter, setGenreFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const apiBase = getApiBase();
    fetch(`${apiBase}/api/dj-mixes`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(arr) && arr.length > 0) {
          setMixes(arr);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const genres = ['All', 'Afro-House', 'Afro House', 'Amapiano', 'Afrobeats', 'Electronic', 'Hip-Hop'];
  const filtered = mixes.filter((m) => {
    if (genreFilter !== 'All' && !(m.genre || '').toLowerCase().includes(genreFilter.toLowerCase().replace('-', ' '))) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.dj_name && m.dj_name.toLowerCase().includes(q)) ||
        (m.genre && m.genre.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handlePlayMix = (mix) => {
    if (!onPlayTrack) return;
    onPlayTrack({
      id: mix.id || `mix_${mix.title}`,
      title: mix.title,
      artist: mix.dj_name || 'Verified DJ',
      album: `DJ Mix · ${mix.bpm_avg || 120} BPM`,
      releaseType: 'DJ Mix',
      genre: mix.genre || 'Afro-House',
      duration: mix.duration || `${Math.round((mix.duration_seconds || 2400) / 60)}:00`,
      cover: mix.artwork_url,
      coverArt: mix.artwork_url,
      audioUrl: mix.audio_url || `/api/stream/track/${encodeURIComponent(mix.id || mix.title || 'preview')}`,
    });
  };

  const featuredDjs = [
    { name: 'Khalid Waves', slug: 'khalid', genre: 'Deep-House & Sunset Sets', city: 'Mombasa & Zanzibar', rateUsd: 1200 },
    { name: 'DJ K-Souldier', slug: 'djksouldier', genre: 'Afro-Tech & Amapiano', city: 'Nairobi, Kenya', rateUsd: 1500 },
    { name: 'DJ Zinhle Vibes', slug: 'djzinhlevibes', genre: 'Afro-House & Festival Mainstage', city: 'Johannesburg & Nairobi', rateUsd: 3500 },
    { name: 'DJ Maphoria', slug: 'djmaphoria', genre: 'Private School Amapiano', city: 'Pretoria, South Africa', rateUsd: 3500 },
    { name: 'Selector Kofi', slug: 'selectorkofi', genre: 'Afrobeats & Highlife Sound System', city: 'Accra, Ghana', rateUsd: 1200 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} data-testid="tunestream-dj-mixes-panel">
      <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(9,12,22,0.95) 100%)', border: '1px solid rgba(34,211,238,0.28)', borderRadius: '3px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34,211,238,0.15)', color: '#22d3ee', padding: '3px 9px', borderRadius: '3px', fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          <RiDiscFill size={13} /> Sovereign Rights-Cleared DJ Mixes
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
          Curated DJ Mixes, Official DJ EPKs &amp; Direct Gig Booking
        </h2>
        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, maxWidth: '760px', lineHeight: 1.55 }}>
          Stream or purchase continuous lossless DJ sets with 100% cleared IP splits (40% DJ / 50% Featured Track Rights Holders / 10% Platform), or open any DJ&apos;s Official EPK to view their rate card, download their tech rider, and book them for a gig.
        </p>
      </div>

      {/* Featured Roster DJs Strip with Direct DJ EPK Links */}
      <div style={{ background: '#090c16', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '3px', padding: '16px 18px' }} data-testid="featured-djs-epk-strip">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🎧 Official Roster DJs — Click to Open DJ EPK, Rate Card &amp; Gig Booking
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>All DJ EPKs include Mixes Store, Rate Card Download &amp; Escrow Gig Booking</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {featuredDjs.map((dj) => (
            <a
              key={dj.slug}
              href={`#/epk/${dj.slug}?persona=dj`}
              data-testid={`featured-dj-epk-card-${dj.slug}`}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(34,211,238,0.22)',
                borderRadius: '3px',
                padding: '10px 12px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '6px'
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#fff' }}>{dj.name}</div>
                <div style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 700 }}>{dj.genre}</div>
                <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{dj.city} · From {formatPrice ? formatPrice(dj.rateUsd) : `$${dj.rateUsd}`}</div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#060813', background: '#22d3ee', padding: '5px 8px', borderRadius: '3px', textAlign: 'center', marginTop: '4px' }}>
                🌐 Open DJ EPK &amp; Book →
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', background: '#090c16', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenreFilter(g)}
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: genreFilter === g ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.1)',
                background: genreFilter === g ? '#22d3ee' : 'rgba(255,255,255,0.03)',
                color: genreFilter === g ? '#060813' : '#fff',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {g}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search DJ mixes, DJ name, genre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: '240px', padding: '7px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
        {filtered.map((mix) => {
          const djSlug = resolveDjSlug(mix.dj_name);
          return (
            <div
              key={mix.id || mix.title}
              style={{ background: '#090c16', border: '1px solid rgba(34,211,238,0.22)', borderRadius: '3px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ position: 'relative', height: '170px', overflow: 'hidden', background: '#0e1424' }}>
                  <img
                    src={mix.artwork_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'}
                    alt={mix.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(6,8,19,0.85)', color: '#22d3ee', padding: '3px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                    {mix.genre} · {mix.bpm_avg || 120} BPM
                  </span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: mix.is_original_ip_only ? 'rgba(168,85,247,0.9)' : 'rgba(16,185,129,0.9)', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 800 }}>
                    {mix.is_original_ip_only ? '100% Original IP' : '✓ 100% Rights Cleared'}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#fff', fontWeight: 800 }}>{mix.title}</h4>
                  <div style={{ fontSize: '12px', color: '#22d3ee', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a
                      href={`#/epk/${djSlug}?persona=dj`}
                      style={{ color: '#22d3ee', textDecoration: 'underline', fontWeight: 800 }}
                      title={`Open ${mix.dj_name} Official DJ EPK`}
                    >
                      Curated by {mix.dj_name} ↗
                    </a>
                    <span style={{ fontSize: '10.5px', color: '#10b981' }}>DJ EPK Ready</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 12px' }}>{mix.description}</p>
                  {Array.isArray(mix.tracklist) && mix.tracklist.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', padding: '8px 10px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                        Extracted Tracklist ({mix.tracklist.length} Tracks · 40% DJ / 50% IP)
                      </div>
                      {mix.tracklist.slice(0, 3).map((t, i) => (
                        <div key={t.id || i} style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                          <span>{t.artist} — {t.title}</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                  {formatPrice ? formatPrice(mix.commercial_price || 4.99) : `$${mix.commercial_price || 4.99}`}
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>{Math.round((mix.commercial_price || 4.99) * 100)} TM Credits</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a
                    href={`#/epk/${djSlug}?persona=dj`}
                    data-testid="dj-mix-epk-link"
                    style={{ padding: '8px 11px', background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.4)', borderRadius: '3px', fontSize: '11.5px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    🌐 DJ EPK &amp; Book
                  </a>
                  <button
                    type="button"
                    onClick={() => handlePlayMix(mix)}
                    style={{ padding: '8px 14px', background: '#22d3ee', color: '#060813', border: 'none', borderRadius: '3px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <RiPlayFill size={15} /> Stream Mix
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
  const [sortBy, setSortBy] = useState('newest');
  const [genreFilter, setGenreFilter] = useState('all');
  const [activePodcasterEpkShow, setActivePodcasterEpkShow] = useState(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = onSearchChange || setInternalSearchQuery;
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [djMixesList, setDjMixesList] = useState(AUTHORITATIVE_DJ_MIXES);

  useEffect(() => {
    let cancelled = false;
    const apiBase = getApiBase();
    fetch(`${apiBase}/api/dj-mixes`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(arr) && arr.length > 0) setDjMixesList(arr);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const isDjArtist = (a) => a.creator_type === 'dj' ||
    (a.role && (a.role.toLowerCase().includes('dj') || a.role.toLowerCase().includes('turntablist') || a.role.toLowerCase().includes('selector'))) ||
    (a.subdomain && (a.subdomain.includes('dj') || a.subdomain.includes('khalid') || a.subdomain.includes('selector'))) ||
    (a.name && (a.name.toLowerCase().startsWith('dj') || a.name.toLowerCase().includes('khalid') || a.name.toLowerCase().includes('selector')));

  const djsList = artists.filter(isDjArtist);

  const singles = tracks.filter(t => t.releaseType === 'Single' || (t.release && t.release.toLowerCase().includes('single')));
  const albums = tracks.filter(t => t.releaseType !== 'Single' && !(t.release && t.release.toLowerCase().includes('single')));
  const podcastShows = AUTHORITATIVE_PODCAST_SHOWS || [];
  const podcastEpisodes = podcastShows.flatMap(show =>
    (show.episodes || []).map(ep => ({
      ...ep,
      podcastTitle: show.title,
      host: show.host,
      category: show.category,
      cover: ep.coverArt || show.coverArt,
      show
    }))
  );

  const availableGenres = Array.from(new Set([
    '🎧 DJ Mixes & Resident Sets',
    '🎧 Resident DJs & Turntablists',
    'Afrobeats', 'Amapiano', 'Afro-House', 'Afro-fusion', 'Electronic', 'Hip-Hop', 'Deep-House & Club', 'Afro-Tech & Amapiano',
    ...tracks.map(t => t.genre).filter(Boolean),
    ...artists.map(a => a.genre).filter(Boolean),
    ...podcastShows.map(s => `Podcast • ${s.category}`).filter(Boolean)
  ]));

  // Filter computation
  let displayedTracks = [...tracks];
  if (filterMode === 'singles') displayedTracks = [...singles];
  else if (filterMode === 'albums') displayedTracks = [...albums];

  if (selectedArtist) {
    displayedTracks = displayedTracks.filter(t => t.artist && t.artist.toLowerCase() === selectedArtist.toLowerCase());
  }

  let displayedArtists = filterMode === 'djs' ? [...djsList] : [...artists];
  let displayedPodcasts = [...podcastEpisodes];
  let displayedPodcasters = [...podcastShows];
  let displayedDjMixes = [...djMixesList];
  const displayedDjs = (filterMode === 'djs' ? djsList : artists).filter(isDjArtist);

  if (genreFilter !== 'all') {
    const targetG = genreFilter.toLowerCase();
    if (targetG.includes('dj') || targetG.includes('mix')) {
      displayedTracks = [];
      displayedPodcasts = [];
      displayedPodcasters = [];
      displayedArtists = displayedArtists.filter(isDjArtist);
      // Keep DJ mixes active
    } else {
      displayedTracks = displayedTracks.filter(t => t.genre && t.genre.toLowerCase().includes(targetG));
      displayedPodcasts = displayedPodcasts.filter(ep =>
        (ep.genre && ep.genre.toLowerCase().includes(targetG)) ||
        (ep.category && `podcast • ${ep.category}`.toLowerCase().includes(targetG))
      );
      displayedPodcasters = displayedPodcasters.filter(s =>
        s.category && `podcast • ${s.category}`.toLowerCase().includes(targetG)
      );
      displayedDjMixes = displayedDjMixes.filter(m =>
        m.genre && m.genre.toLowerCase().replace('-', ' ').includes(targetG.replace('-', ' '))
      );
      displayedArtists = displayedArtists.filter(a =>
        a.genre && a.genre.toLowerCase().includes(targetG)
      );
    }
  }

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
    displayedArtists = displayedArtists.filter(a =>
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.genre && a.genre.toLowerCase().includes(q)) ||
      (a.bio && a.bio.toLowerCase().includes(q)) ||
      (a.role && a.role.toLowerCase().includes(q))
    );
    displayedPodcasts = displayedPodcasts.filter(ep =>
      (ep.title && ep.title.toLowerCase().includes(q)) ||
      (ep.podcastTitle && ep.podcastTitle.toLowerCase().includes(q)) ||
      (ep.host && ep.host.toLowerCase().includes(q)) ||
      (ep.category && ep.category.toLowerCase().includes(q))
    );
    displayedPodcasters = displayedPodcasters.filter(s =>
      (s.host && s.host.toLowerCase().includes(q)) ||
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.bio && s.bio.toLowerCase().includes(q))
    );
    displayedDjMixes = displayedDjMixes.filter(m =>
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.dj_name && m.dj_name.toLowerCase().includes(q)) ||
      (m.genre && m.genre.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  }

  const sortSorter = (a, b, keyTitle = 'title', keyGenre = 'genre') => {
    if (sortBy === 'djs-first') {
      const isDjA = isDjArtist(a) || a.releaseType === 'DJ Mix' || String(a[keyTitle] || '').toLowerCase().includes('dj') ? 1 : 0;
      const isDjB = isDjArtist(b) || b.releaseType === 'DJ Mix' || String(b[keyTitle] || '').toLowerCase().includes('dj') ? 1 : 0;
      return isDjB - isDjA || String(a[keyTitle] || a.name || '').localeCompare(String(b[keyTitle] || b.name || ''));
    }
    if (sortBy === 'title') return String(a[keyTitle] || a.name || '').localeCompare(String(b[keyTitle] || b.name || ''));
    if (sortBy === 'genre') return String(a[keyGenre] || a.category || '').localeCompare(String(b[keyGenre] || b.category || ''));
    if (sortBy === 'oldest') return 1;
    return -1;
  };

  displayedTracks.sort((a, b) => sortSorter(a, b, 'title', 'genre'));
  displayedPodcasts.sort((a, b) => sortSorter(a, b, 'title', 'category'));
  displayedPodcasters.sort((a, b) => sortSorter(a, b, 'host', 'category'));
  displayedDjMixes.sort((a, b) => sortSorter(a, b, 'title', 'genre'));
  displayedArtists.sort((a, b) => sortSorter(a, b, 'name', 'genre'));

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
              ✓ Lossless 24-bit / 96kHz FLAC &amp; Podcasts
            </span>
          </div>
          <h1 style={{ fontSize: '26px', margin: '4px 0 6px', fontWeight: '800' }}>
            {spotlightTrack.title}
          </h1>
          <p style={{ fontSize: '13px', marginBottom: '14px', maxWidth: '580px', color: '#cbd5e1', lineHeight: '1.5' }}>
            By <strong style={{ color: '#fff' }}>{spotlightTrack.artist}</strong> · From "{spotlightTrack.album || spotlightTrack.release}". Stream music masters, original podcasts, and verified Podcaster EPKs.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn-play-hero" 
              onClick={() => onPlayTrack(spotlightTrack)} 
              style={{ padding: '8px 20px', borderRadius: '3px', background: '#00f2fe', color: '#000', fontWeight: '800', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RiPlayFill size={16} /> Play Master
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('podcasts')}
              style={{ padding: '8px 16px', borderRadius: '3px', background: 'rgba(16,185,129,0.16)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.35)', cursor: 'pointer', fontSize: '12px', fontWeight: '800' }}
            >
              🎙️ Explore Podcasts &amp; EPKs
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Sort Toolbar (Design Standards §14: 3px border-radius, flat colors) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#090c16', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => { setFilterMode('all'); setSelectedArtist(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'all' && !selectedArtist ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'all' && !selectedArtist ? '#00f2fe' : 'rgba(255,255,255,0.03)',
                color: filterMode === 'all' && !selectedArtist ? '#000' : '#fff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              All Results ({tracks.length + podcastEpisodes.length + podcastShows.length})
            </button>

            <button
              type="button"
              onClick={() => { setFilterMode('singles'); setSelectedArtist(null); }}
              style={{
                padding: '6px 12px',
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
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'albums' ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'albums' ? '#a855f7' : 'rgba(255,255,255,0.03)',
                color: '#fff',
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
                padding: '6px 12px',
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

            <button
              type="button"
              onClick={() => { setFilterMode('djs'); setSelectedArtist(null); }}
              data-testid="explore-filter-djs"
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'djs' ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'djs' ? '#c084fc' : 'rgba(255,255,255,0.03)',
                color: filterMode === 'djs' ? '#060813' : '#fff',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🎧 Resident DJs ({djsList.length})
            </button>

            <button
              type="button"
              onClick={() => { setFilterMode('podcasts'); setSelectedArtist(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'podcasts' ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'podcasts' ? '#22d3ee' : 'rgba(255,255,255,0.03)',
                color: filterMode === 'podcasts' ? '#000' : '#fff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Podcasts &amp; Episodes ({podcastEpisodes.length})
            </button>

            <button
              type="button"
              onClick={() => { setFilterMode('podcasters'); setSelectedArtist(null); }}
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'podcasters' ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'podcasters' ? '#ec4899' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Podcasters &amp; EPKs ({podcastShows.length})
            </button>

            <button
              type="button"
              onClick={() => { setFilterMode('dj-mixes'); setSelectedArtist(null); }}
              data-testid="explore-filter-dj-mixes"
              style={{
                padding: '6px 12px',
                borderRadius: '3px',
                border: filterMode === 'dj-mixes' ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                background: filterMode === 'dj-mixes' ? '#00f2fe' : 'rgba(255,255,255,0.03)',
                color: filterMode === 'dj-mixes' ? '#060813' : '#fff',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              🎧 DJ Mixes ({djMixesList.length})
            </button>
          </div>

          {/* Live Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
            <RiSearchLine size={16} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search tracks, podcasts, podcasters, ISRC..."
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

        {/* Genre & Sort Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Genre / Category:</span>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              style={{ background: '#050811', color: '#fff', border: '1px solid rgba(0,242,254,0.35)', borderRadius: '3px', padding: '5px 10px', fontSize: '11.5px', fontWeight: 700 }}
            >
              <option value="all">All Genres &amp; Podcast Categories</option>
              {availableGenres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: '#050811', color: '#fff', border: '1px solid rgba(0,242,254,0.35)', borderRadius: '3px', padding: '5px 10px', fontSize: '11.5px', fontWeight: 700 }}
            >
              <option value="newest">Newest Releases</option>
              <option value="oldest">Oldest Releases</option>
              <option value="djs-first">🎧 Resident DJs &amp; Mixes First</option>
              <option value="title">Title / Name (A – Z)</option>
              <option value="genre">Genre / Category (A – Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Podcasters & EPKs Section (Shown when filterMode is 'podcasters' or 'all') */}
      {(filterMode === 'podcasters' || filterMode === 'all') && displayedPodcasters.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', margin: 0, color: '#fff' }}>
              🎙️ Featured Podcasters &amp; Verified Host EPKs
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>
                ({displayedPodcasters.length} shows)
              </span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
            {displayedPodcasters.map((show) => (
              <div
                key={show.id}
                style={{ background: '#090c16', border: '1px solid rgba(236,72,153,0.28)', borderRadius: '3px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                      src={normalizeMediaUrl(show.coverArt)}
                      alt={show.title}
                      style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                    <div>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#ec4899', background: 'rgba(236,72,153,0.14)', padding: '2px 6px', borderRadius: '3px' }}>
                        PODCASTER EPK • {show.category}
                      </span>
                      <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#fff', fontWeight: 800 }}>{show.host}</h4>
                      <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{show.title}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px' }}>
                    {show.description}
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginBottom: '10px' }}>
                    <span>{show.subscribers} Subscribers</span>
                    <span>{show.avgCompletionRate} Avg. Completion</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => show.episodes?.[0] && onPlayTrack(show.episodes[0])}
                      style={{ flex: 1, padding: '8px', background: '#00f2fe', color: '#000', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <RiPlayFill size={14} /> Stream Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePodcasterEpkShow(show)}
                      style={{ flex: 1, padding: '8px', background: 'rgba(236,72,153,0.16)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.4)', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      🌐 Podcaster EPK
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Podcasts & Episodes Section (Shown when filterMode is 'podcasts' or 'all') */}
      {(filterMode === 'podcasts' || filterMode === 'all') && displayedPodcasts.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', margin: 0, color: '#fff' }}>
              🎧 Podcast Episodes (-16 LUFS Broadcast Masters)
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', marginLeft: '8px' }}>
                ({displayedPodcasts.length} episodes)
              </span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
            {displayedPodcasts.map((ep) => (
              <div
                key={ep.id}
                style={{ background: '#090c16', border: '1px solid rgba(34,211,238,0.22)', borderRadius: '3px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#22d3ee', background: 'rgba(34,211,238,0.12)', padding: '2px 6px', borderRadius: '3px' }}>
                      {ep.genre || `Podcast • ${ep.category}`}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{ep.duration}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14.5px', color: '#fff', fontWeight: 800 }}>{ep.title}</h4>
                  <div style={{ fontSize: '11.5px', color: '#00f2fe', fontWeight: 700, marginBottom: '8px' }}>
                    {ep.podcastTitle} · {ep.host}
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.45, margin: '0 0 12px' }}>
                    {ep.summary}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => onPlayTrack(ep)}
                    style={{ flex: 1, padding: '8px', background: '#22d3ee', color: '#000', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <RiPlayFill size={14} /> Play Episode
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePodcasterEpkShow(ep.show)}
                    style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '3px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Host EPK 🌐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Curated DJ Mixes Section (Shown when filterMode is 'dj-mixes', 'all', or genreFilter === 'DJ Mixes') */}
      {(filterMode === 'dj-mixes' || filterMode === 'all' || genreFilter === 'DJ Mixes') && displayedDjMixes.length > 0 && (
        <section data-testid="explore-dj-mixes-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiDiscFill style={{ color: '#00f2fe' }} /> Curated DJ Mixes &amp; Sovereign Sets
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>
                ({displayedDjMixes.length} mixes · 40% DJ / 50% IP Cleared)
              </span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '16px' }}>
            {displayedDjMixes.map((mix) => {
              const djSlug = resolveDjSlug(mix.dj_name);
              return (
                <div
                  key={mix.id || mix.title}
                  style={{ background: '#090c16', border: '1px solid rgba(0,242,254,0.25)', borderRadius: '3px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <img
                        src={mix.artwork_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80'}
                        alt={mix.title}
                        style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                      <div>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#00f2fe', background: 'rgba(0,242,254,0.12)', padding: '2px 6px', borderRadius: '3px' }}>
                          DJ MIX • {mix.genre} • {mix.bpm_avg || 120} BPM
                        </span>
                        <h4 style={{ margin: '4px 0 2px', fontSize: '14.5px', color: '#fff', fontWeight: 800 }}>{mix.title}</h4>
                        <a
                          href={`#/epk/${djSlug}?persona=dj`}
                          style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 800, textDecoration: 'underline' }}
                        >
                          By {mix.dj_name} (DJ EPK ↗)
                        </a>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.45, margin: 0 }}>{mix.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                      {mix.is_original_ip_only ? '✓ 100% Sovereign IP' : `✓ ${mix.tracklist?.length || 3} Tracks Cleared`}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`#/epk/${djSlug}?persona=dj`}
                        data-testid="explore-dj-epk-link"
                        style={{ padding: '7px 10px', background: 'rgba(0,242,254,0.12)', color: '#00f2fe', border: '1px solid rgba(0,242,254,0.4)', borderRadius: '3px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        🌐 DJ EPK
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          onPlayTrack({
                            id: mix.id || `mix_${mix.title}`,
                            title: mix.title,
                            artist: mix.dj_name || 'Verified DJ',
                            album: `DJ Mix · ${mix.bpm_avg || 120} BPM`,
                            releaseType: 'DJ Mix',
                            genre: mix.genre || 'Afro-House',
                            duration: mix.duration || `${Math.round((mix.duration_seconds || 2400) / 60)}:00`,
                            cover: mix.artwork_url,
                            coverArt: mix.artwork_url,
                            audioUrl: mix.audio_url || `/api/stream/track/${encodeURIComponent(mix.id || mix.title || 'preview')}`,
                          })
                        }
                        style={{ padding: '7px 12px', background: '#00f2fe', color: '#060813', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <RiPlayFill size={14} /> Stream Mix
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Dedicated Resident DJs & Turntablists Section */}
      {(filterMode === 'djs' || filterMode === 'all' || (genreFilter !== 'all' && genreFilter.toLowerCase().includes('dj'))) && displayedDjs.length > 0 && (
        <section data-testid="explore-resident-djs-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiDiscFill style={{ color: '#c084fc' }} /> 🎧 Resident DJs &amp; Turntablists
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>
                ({displayedDjs.length} resident DJs · Verified EPK, Rate Card &amp; Gig Escrow)
              </span>
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {displayedDjs.map((dj) => {
              const djSlug = dj.subdomain || resolveDjSlug(dj.name);
              const djTracks = tracks.filter(t => t.artist && t.artist.toLowerCase() === dj.name.toLowerCase());
              return (
                <div
                  key={dj.id || dj.name}
                  style={{
                    background: '#090c16',
                    border: '1px solid rgba(192,132,252,0.28)',
                    borderRadius: '3px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img
                        src={normalizeMediaUrl(dj.avatar) || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'}
                        alt={dj.name}
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'; }}
                        style={{ width: '56px', height: '56px', borderRadius: '3px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                      <div>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#c084fc', background: 'rgba(192,132,252,0.14)', padding: '2px 6px', borderRadius: '3px' }}>
                          RESIDENT DJ • {dj.genre || 'Deep-House & Club'}
                        </span>
                        <h4 style={{ margin: '4px 0 2px', fontSize: '15px', color: '#fff', fontWeight: 800 }}>{dj.name}</h4>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{dj.role || 'Resident Club & Radio DJ'} · {dj.listeners || '1.2M listeners'}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
                      {dj.bio || 'Verified Intermaven Resident DJ with active club sets, live stems, and gig booking.'}
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700 }}>
                        {dj.followers_count ? `${Math.round(dj.followers_count / 1000)}K followers` : 'Verified Resident'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`#/epk/${djSlug}?persona=dj`}
                          data-testid="explore-resident-dj-epk-link"
                          style={{ padding: '7px 10px', background: 'rgba(192,132,252,0.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.4)', borderRadius: '3px', fontSize: '11px', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          🌐 DJ EPK &amp; Rates
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (djTracks.length > 0) onPlayTrack(djTracks[0]);
                            else if (displayedDjMixes.length > 0) {
                              const matchMix = displayedDjMixes.find(m => (m.dj_name && m.dj_name.toLowerCase().includes(dj.name.toLowerCase())) || (m.artist && m.artist.toLowerCase().includes(dj.name.toLowerCase())));
                              if (matchMix) {
                                onPlayTrack({
                                  id: matchMix.id || `mix_${matchMix.title}`,
                                  title: matchMix.title,
                                  artist: matchMix.dj_name || dj.name,
                                  album: 'DJ Mix',
                                  releaseType: 'DJ Mix',
                                  genre: matchMix.genre || dj.genre,
                                  cover: matchMix.artwork_url || dj.avatar,
                                  audioUrl: matchMix.audio_url || `/api/stream/track/${encodeURIComponent(matchMix.id || matchMix.title || 'preview')}`
                                });
                                return;
                              }
                              onPlayTrack(tracks[0]);
                            } else {
                              onPlayTrack(tracks[0]);
                            }
                          }}
                          style={{ padding: '7px 12px', background: '#00f2fe', color: '#060813', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <RiPlayFill size={14} /> Listen
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Music Content Area */}
      {(filterMode === 'artists') ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {displayedArtists.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', color: '#64748b', padding: '36px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '3px' }}>
              No signed artists match your search query "{searchQuery}".
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
                        style={{ margin: '0 0 4px', fontSize: '16px', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
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
                      href={`#/epk/${artist.subdomain || artist.name.toLowerCase().replace(/\s+/g, '')}?persona=${resolveArtistPersona(artist)}`}
                      rel="noreferrer"
                      style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: '700' }}
                    >
                      🌐 {resolveArtistPersona(artist) === 'dj' ? 'DJ EPK & Rate Card' : resolveArtistPersona(artist) === 'producer' ? 'Producer EPK' : resolveArtistPersona(artist) === 'label' ? 'Label EPK' : 'Web World'} &rarr;
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
      ) : (filterMode !== 'podcasts' && filterMode !== 'podcasters' && filterMode !== 'dj-mixes') ? (
        <section className="ts-music-section">
          <div className="section-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px' }}>
              {filterMode === 'singles' ? 'Singles Showcase' : (filterMode === 'albums' ? 'Albums & EPs' : 'Authoritative Music Catalogue')} 
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
      ) : null}

      {activePodcasterEpkShow && (
        <PodcasterEpkModal
          show={activePodcasterEpkShow}
          onClose={() => setActivePodcasterEpkShow(null)}
          onPlayEpisode={(ep) => onPlayTrack(ep)}
        />
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
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>Artists</h3>
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
                  {artist.role || 'Artist'}
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
                  href={`#/epk/${artist.subdomain || artist.name.toLowerCase().replace(/\s+/g, '')}?persona=${resolveArtistPersona(artist)}`}
                  rel="noreferrer"
                  style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', fontSize: '11px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                >
                  🌐 {resolveArtistPersona(artist) === 'dj' ? 'DJ EPK' : resolveArtistPersona(artist) === 'producer' ? 'Producer EPK' : resolveArtistPersona(artist) === 'label' ? 'Label EPK' : 'EPK'}
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

function TuneStreamSettingsPanel({ sessionUser }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_user_interests');
      return saved ? JSON.parse(saved) : {
        genres: ['Afrobeat', 'Amapiano', 'Highlife'],
        creators: ['ndufo', 'zawadi_kofi', 'dj_kalonje'],
        vibe: 'chill'
      };
    } catch {
      return {
        genres: ['Afrobeat', 'Amapiano', 'Highlife'],
        creators: ['ndufo', 'zawadi_kofi', 'dj_kalonje'],
        vibe: 'chill'
      };
    }
  });

  const [savedMsg, setSavedMsg] = useState('');

  const genresList = GENRES_LIST || ['Afrobeat', 'Amapiano', 'Highlife', 'Bongo Flava', 'Gengetone', 'Afro-Fusion', 'Afro-House', 'Kizomba'];

  const toggleCreator = (creatorId) => {
    const current = preferences.creators || ['ndufo'];
    let updated;
    if (current.includes(creatorId)) {
      if (current.length === 1) return;
      updated = current.filter(id => id !== creatorId);
    } else {
      updated = [...current, creatorId];
    }
    const newPrefs = { ...preferences, creators: updated };
    setPreferences(newPrefs);
    localStorage.setItem('tunestream_user_interests', JSON.stringify(newPrefs));
    setSavedMsg('Preferred Creators updated!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const toggleGenre = (genre) => {
    const current = preferences.genres || [];
    let updated;
    if (current.includes(genre)) {
      if (current.length === 1) return;
      updated = current.filter(g => g !== genre);
    } else {
      updated = [...current, genre];
    }
    const newPrefs = { ...preferences, genres: updated };
    setPreferences(newPrefs);
    localStorage.setItem('tunestream_user_interests', JSON.stringify(newPrefs));
    setSavedMsg('Genre Preferences updated!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dashboard-card" style={{ padding: '24px', background: '#090c16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '0 0 8px' }}>
          Listener Account &amp; Playback Taste Profile
        </h4>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px' }}>
          TuneStream dynamically tailors your daily personal mixes, introductory background audio, and lossless queues to these preferences.
        </p>

        {savedMsg && (
          <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', borderRadius: '3px', fontSize: '12px', marginBottom: '16px' }}>
            ✓ {savedMsg}
          </div>
        )}

        {/* Preferred Creators & Artists Section */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Preferred Creators, Artists &amp; Show Hosts ({preferences.creators?.length || 0})
            </label>
            <span style={{ fontSize: '11px', color: '#00f2fe' }}>
              ● Shapes Daily Mix &amp; Tour Pacing
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
            {AUTHORITATIVE_CREATORS_FOR_TASTE.map(c => {
              const selected = (preferences.creators || []).includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCreator(c.id)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '3px',
                    background: selected ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: selected ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    onError={(e) => { e.currentTarget.src = '/heroes/hero_music_1.png'; }}
                    style={{ width: '32px', height: '32px', borderRadius: '3px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '10px', color: selected ? '#00f2fe' : '#64748b' }}>
                      {c.role}
                    </div>
                  </div>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '3px',
                    background: selected ? '#00f2fe' : 'rgba(255,255,255,0.08)',
                    color: '#060813',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 900
                  }}>
                    {selected ? '✓' : '+'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
            Favorite Genres &amp; Rhythms
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {genresList.map(g => {
              const selected = (preferences.genres || []).includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: selected ? '700' : '500',
                    background: selected ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.03)',
                    border: selected ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.1)',
                    color: selected ? '#00f2fe' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {selected ? '✓ ' : '+ '}{g}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Active Fidelity Node</label>
            <div style={{ color: '#10b981', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>
              24-Bit / 96kHz Lossless Studio Master (DAC Passthrough Enabled)
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Pricing &amp; Account Model</label>
            <div style={{ color: '#00f2fe', fontWeight: '700', fontSize: '14px', marginTop: '2px' }}>
              100% Non-Expiring TM Credits • Zero Recurring Subscriptions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerDashboard({ sessionUser, initialTab, onLogout, onPlayGlobalTrack }) {
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
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);
  const [globalSearch, setGlobalSearch] = useState('');

  const [userRole, setUserRole] = useState(() => localStorage.getItem('tunestream_user_role') || (sessionUser?.role || 'consumer'));
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

  useEffect(() => {
    if (userRole === 'vc' || userRole === 'investor') {
      setNotifications([
        {
          id: 'vc_notif_1',
          title: 'Tour Telemetry Update · 24% Target IRR',
          body: 'Nairobi City Arena Tour pacing at 104% box office velocity. Automated Split Cascade recoupment online.',
          actionText: 'Inspect Vault',
          actionType: 'tours-vault',
          read: false,
          at: '2m ago'
        },
        {
          id: 'vc_notif_2',
          title: 'New Senior-Secured Tour Facility Open',
          body: 'West African Afrobeats Incubation Tour tranche open for institutional co-investment ($25,000 – $100,000 ticket).',
          actionText: 'View Tranche',
          actionType: 'tours-vault',
          read: false,
          at: '18m ago'
        },
        {
          id: 'vc_notif_3',
          title: 'Creator Discovery & AI Growth Projections',
          body: '5 high-velocity creators flagged for senior tour advance financing based on 30-day stream acceleration.',
          actionText: 'Discover',
          actionType: 'vc-discover',
          read: false,
          at: '45m ago'
        },
        {
          id: 'vc_notif_4',
          title: 'Recommended Reading: Tour Debt Playbook',
          body: 'Senior-Secured Live Tour Advance Structuring & Split Cascade Liquidation Waterfall (Institutional LP Guide).',
          actionText: 'Read Playbook',
          actionType: 'vc-guide',
          read: false,
          at: '1h ago'
        }
      ]);
    }
  }, [userRole]);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif_tour',
      title: 'Ndufo Africa Tour VIP Pass',
      body: 'Your live showcase pass for Nairobi Cyberwave is secured in Live Shows & Passes.',
      actionText: 'View Passes',
      actionType: 'concerts',
      read: false,
      at: '10m ago'
    },
    {
      id: 'notif_tip',
      title: 'Direct Creator Tip Settled',
      body: 'Your tip of 50 credits to Ndufo reached their wallet via Split Cascade.',
      actionText: 'Ledger',
      actionType: 'tips',
      read: false,
      at: '1h ago'
    },
    {
      id: 'notif_lossless',
      title: 'Lossless 24-bit Stream Ready',
      body: '3 new studio masters added to your daily personalized playlist crate.',
      actionText: 'Play Mix',
      actionType: 'home',
      read: true,
      at: '5h ago'
    }
  ]);

  const activeUser = {
    id: sessionUser?.id || 'user_tunestream_01',
    name: sessionUser?.name || 'Verified Listener',
    email: sessionUser?.email || 'listener@tunestream.com',
    role: 'consumer',
    credits: userCredits,
    phone: '254712345678',
    is_admin: false,
    tier: 'audiophile'
  };

  const currentRoleObj = {
    id: 'consumer',
    label: 'Verified Listener',
    shortLabel: 'Listener',
    shortDesc: '24-Bit / 96kHz Lossless',
    icon: RiHeadphoneFill,
    color: '#00f2fe'
  };
  const isAdminSimulated = Boolean(activeUser.is_admin && userRole !== 'admin');

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
      } else if (targetRole === 'vc') {
        setActiveTab('tours-vault');
      } else if (targetRole === 'podcaster') {
        setActiveTab('podcaster-studio');
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
    const apiBase = getApiBase();
    // 1. Fetch live tracks from /api/catalog/tracks?all=true
    fetch(`${apiBase}/api/catalog/tracks?all=true`)
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
    fetch(`${apiBase}/api/catalog/artists`)
      .then(res => res.json())
      .then(data => {
        if (data && data.artists && Array.isArray(data.artists) && data.artists.length > 0) {
          const incoming = data.artists.map(a => {
            const isDj = a.creator_type === 'dj' ||
              (a.role && (a.role.toLowerCase().includes('dj') || a.role.toLowerCase().includes('turntablist') || a.role.toLowerCase().includes('selector'))) ||
              (a.subdomain && (a.subdomain.includes('dj') || a.subdomain.includes('khalid') || a.subdomain.includes('selector'))) ||
              (a.name && (a.name.toLowerCase().startsWith('dj') || a.name.toLowerCase().includes('khalid') || a.name.toLowerCase().includes('selector')));
            return {
              ...a,
              creator_type: isDj ? 'dj' : (a.creator_type || 'artist'),
              avatar: normalizeMediaUrl(a.avatar || a.image)
            };
          });
          const merged = [...incoming];
          for (const authArtist of AUTHORITATIVE_CATALOG_ARTISTS) {
            if (!merged.some(m => (m.id && m.id === authArtist.id) || (m.subdomain && m.subdomain.toLowerCase() === authArtist.subdomain?.toLowerCase()))) {
              merged.push({
                ...authArtist,
                avatar: normalizeMediaUrl(authArtist.avatar)
              });
            }
          }
          setArtists(merged);
        }
      })
      .catch(err => console.warn('Could not fetch backend artists:', err));

    // 3. Fetch live albums from /api/catalog/albums
    fetch(`${apiBase}/api/catalog/albums`)
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

    if (typeof onPlayGlobalTrack === 'function') {
      onPlayGlobalTrack(track, catalogTracks);
    }

    // Record listening history to TuneStream backend
    streamApi.recordHistory({
      track_id: track.id || track.isrc,
      title: track.title,
      artist: track.artist,
      duration_sec: track.durationSeconds || 210
    }).catch(() => {});
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
        const apiBase = getApiBase();
        fetch(`${apiBase}/api/stream/event`, {
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
    const isCreditExempt = userRole === 'vc' || userRole === 'investor' || userRole === 'admin';
    if (!isCreditExempt && userCredits < tipAmount) {
      setIsCreditReloadOpen(true);
      return;
    }

    if (!isCreditExempt) {
      const newCredits = userCredits - tipAmount;
      setUserCredits(newCredits);
      localStorage.setItem('tunemavens_user_credits', newCredits.toString());
    }

    try {
      const apiBase = getApiBase();
      await fetch(`${apiBase}/api/stream/tip`, {
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

  // Hydrate likes and library from backend on mount
  useEffect(() => {
    streamApi.getLibrary()
      .then(res => {
        if (res && res.library && Array.isArray(res.library.liked_tracks)) {
          const ids = res.library.liked_tracks.map(t => t.id || t.isrc);
          if (ids.length > 0) {
            setLikes(ids);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleLike = (id, trackObj) => {
    const targetTrack = trackObj || catalogTracks.find(t => (t.id || t.isrc) === id) || { id };
    setLikes(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem('tunestream_likes', JSON.stringify(updated)); } catch (_) {}
      return updated;
    });
    // Persist to MongoDB backend
    streamApi.toggleLike(id, targetTrack).catch(() => {});
  };

  const getCategorizedMenu = () => {
    const categories = {};
    const add = (cat, item) => {
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    };

    // Discover & Stream
    if (userRole === 'vc' || userRole === 'investor') {
      add('Tour Capital & Underwriting', { id: 'vc-discover', label: 'Discover Creators & Catalog', icon: RiSearchLine, color: '#00f2fe', badge: 'DEALS' });
      add('Tour Capital & Underwriting', { id: 'tours-vault', label: 'Tour Underwriting Vault', icon: RiFundsBoxFill, color: '#00f2fe', badge: 'IRR 24%' });
      add('Tour Capital & Underwriting', { id: 'vc-portfolio', label: 'Syndicate Portfolio', icon: RiLineChartFill, color: '#10b981' });
    }
    if (userRole === 'podcaster') {
      add('Podcaster Studio', { id: 'podcaster-studio', label: 'Podcaster Studio & EPK', icon: RiMicFill, color: '#ec4899', badge: 'STUDIO' });
    }
    add('Discover & Stream', { id: 'home', label: 'For You & Mixes', icon: RiHomeFill });
    add('Discover & Stream', { id: 'explore', label: 'Explore & Stream', icon: RiCompass3Line });
    add('Discover & Stream', { id: 'dj-mixes', label: 'DJ Mixes & Sets', icon: RiDiscFill, color: '#00f2fe', badge: 'MIXES' });
    add('Discover & Stream', { id: 'podcasts', label: 'Podcasts & Shows', icon: RiMicFill, color: '#10b981', badge: 'PODCASTS' });
    add('Discover & Stream', { id: 'radio', label: 'Live Radio Node', icon: RiRadioLine });
    add('Discover & Stream', { id: 'singles', label: 'Singles Showcase', icon: RiMusicLine });
    add('Discover & Stream', { id: 'artists', label: 'Roster Creators', icon: RiUserLine });

    // My Collection
    add('My Collection', { id: 'library', label: 'My Playlist Crates', icon: RiFolderMusicLine, color: '#a855f7', badge: 'CRATES' });
    add('My Collection', { id: 'favorites', label: 'Liked Tracks', icon: RiHeart3Fill, color: '#ec4899' });
    add('My Collection', { id: 'concerts', label: 'Live Shows & Passes', icon: RiTicket2Fill, color: '#f59e0b', badge: 'TICKETS' });

    // Sound & Devices
    add('Sound & Devices', { id: 'stream-controls', label: 'Lossless Sound & EQ', icon: RiEqualizerFill, color: '#10b981', badge: '24-BIT' });

    // Superfan Wallet
    add('Superfan Wallet', { id: 'tips', label: 'Creator Tipping', icon: RiCoinsFill, color: '#00f2fe', badge: 'TIPS' });

    // Apps & Support
    add('Sound & Devices', { id: 'companion', label: 'Mobile & Device Sync', icon: RiSmartphoneFill, color: '#a855f7', badge: '8GB SYNC' });
    add('Apps & Support', { id: 'native-app', label: 'TuneStream Mobile App', icon: RiSmartphoneFill, color: '#10b981', badge: 'NATIVE' });
    add('Apps & Support', { id: 'apps', label: 'Listener Apps', icon: RiApps2Fill, color: '#00f2fe', badge: 'APPS' });
    add('Apps & Support', { id: 'support', label: 'Support Desk', icon: RiQuestionLine });
    add('Apps & Support', { id: 'settings', label: 'Preferences & Audio', icon: RiSettings3Fill });

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
      const apiBase = getApiBase();
      await fetch(`${apiBase}/api/catalog/tracks?subdomain=ndufo`, {
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
      case 'library':
        return (
          <TuneStreamLibraryPanel
            tracks={catalogTracks}
            onPlayTrack={handleTrackSelect}
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
      case 'podcasts':
        return (
          <PodcastStreamingHub
            userCredits={userCredits}
            setUserCredits={setUserCredits}
            onOpenCreditReload={() => setIsCreditReloadOpen(true)}
          />
        );
      case 'dj-mixes':
        return <TuneStreamDjMixesPanel onPlayTrack={handleTrackSelect} />;
      case 'vc-discover':
        return <VcDiscoverCreatorsApp sessionUser={activeUser} onNavigateTab={setActiveTab} />;
      case 'podcaster-studio':
        return <PodcasterStudioWorkspace sessionUser={activeUser} />;
      case 'tours-vault':
      case 'vc-portfolio':
      case 'vc-sponsorship':
        return (
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 20px 40px' }}>
            <TourCapitalView sessionUser={activeUser} />
          </div>
        );
      case 'radio':
        return <TuneStreamRadioPanel />;
      case 'concerts':
      case 'events':
        return (
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 20px 40px' }}>
            <LiveEventsSection sessionUser={activeUser} />
          </div>
        );
      case 'stream-controls':
        return <TuneStreamControlsPanel />;
      case 'tips':
        return <TuneStreamTipsPanel userCredits={userCredits} sessionUser={activeUser} />;
      case 'companion':
        return (
          <TuneStreamDeviceSyncPanel
            tracks={catalogTracks}
            onPlayTrack={handleTrackSelect}
            setActiveTab={setActiveTab}
          />
        );
      case 'apps':
        return <EcosystemAppsPanel setActiveTab={setActiveTab} />;
      case 'native-app':
      case 'mobile':
        return <TuneStreamNativeApp sessionUser={activeUser} onLogout={onLogout} />;
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
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1 }}>
              <img src={tsLogo} alt="TuneStream" className="sidebar-logo-img" />
              <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#00f0ff', marginTop: '-3px', alignSelf: 'flex-end' }}>beta</span>
            </div>
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
            <h2 className="topbar-page-title">
              {{
                home: 'For You & Personalized Mixes',
                explore: 'Explore & Lossless Stream',
                radio: 'Live 24-Bit Radio Node',
                singles: 'Lossless Singles Showcase',
                artists: 'Featured Artists & Web Worlds',
                library: 'My Playlist Crates & Vault',
                favorites: 'Liked Tracks Collection',
                concerts: 'Live Shows & VIP Tour Passes',
                'stream-controls': '24-Bit / 96kHz Studio EQ & DAC',
                companion: 'Mobile & 8GB Offline Crate Sync',
                tips: 'Direct Artist Tipping & Wallet',
                apps: 'TuneStream Listener Apps Suite',
                support: 'Listener Support & Community',
                settings: 'Listener Taste & Audio Preferences'
              }[activeTab] || 'TuneStream Listener Hub'}
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
            {/* 24-Bit Lossless DAC Indicator Pill */}
            <button
              type="button"
              className="topbar-dac-pill"
              onClick={() => setActiveTab('stream-controls')}
              title="Configure 24-Bit / 96kHz FLAC & 10-Band Studio EQ"
            >
              <span className="topbar-dac-dot" />
              <RiEqualizerFill size={13} />
              <span>24-Bit / 96kHz FLAC</span>
            </button>

            {/* Unified Listener Credits Vault / Institutional LP Exemption */}
            {userRole === 'vc' || userRole === 'investor' ? (
              <div 
                className="topbar-credits-btn"
                style={{ cursor: 'default', background: 'rgba(0, 242, 254, 0.08)', borderColor: 'rgba(0, 242, 254, 0.35)', color: '#00f2fe' }}
                title="Institutional LP Syndicate Account: VCs & Investors are 100% exempt from platform credit fees."
              >
                <RiShieldCheckFill size={15} color="#00f2fe" />
                <span className="credits-amount">Institutional LP</span>
                <span className="credits-reload-action" style={{ background: 'rgba(0, 242, 254, 0.2)', color: '#00f2fe' }}>Exempt</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="topbar-credits-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('tunestreamOpenReload'))}
                title="Click to top up non-expiring listener credits (Zero monthly subscriptions)"
              >
                <RiCoinsFill size={15} color="#00f2fe" />
                <span className="credits-amount">{(userCredits ?? 150).toLocaleString()} Credits</span>
                <span className="credits-reload-action">+ Top Up</span>
              </button>
            )}

            {/* Quick Return to Web Player */}
            <Link
              to="/"
              className="topbar-back-player-btn"
              title="Return to TuneStream Web Player"
            >
              <RiHeadphoneFill size={14} />
              <span>Web Player</span>
            </Link>

            {/* Universal Get Help & Ask AI Action Buttons */}
            <GetHelpAskAiButtons />

            {/* Notification Dropdown */}
            <div className="topbar-popover-container" ref={notifRef}>
              <button 
                type="button" 
                className={`topbar-icon-btn ${notifOpen ? 'active' : ''}`}
                onClick={() => { setNotifOpen(!notifOpen); setAccountOpen(false); }}
                title="Listener Notifications"
              >
                <RiBellFill size={17} />
                {notifications.some(n => !n.read) && (
                  <span className="topbar-notif-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
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
                <div className="topbar-dropdown account-dropdown" style={{ minWidth: '280px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '3px', background: 'rgba(0,240,255,0.15)', border: '1px solid #00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2fe', fontWeight: '900', fontSize: '18px' }}>
                      {activeUser.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{activeUser.name}</div>
                      <div style={{ fontSize: '11px', color: '#00f2fe', fontWeight: '600' }}>Verified Listener • HiFi Audiophile</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{activeUser.email}</div>
                    </div>
                  </div>

                  {/* TM Credits Balance & Top-Up */}
                  <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>TM Credits Balance</span>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#00f2fe' }}>{(userCredits ?? 150).toLocaleString()} TM</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        window.dispatchEvent(new CustomEvent('tunestreamOpenReload'));
                      }}
                      style={{ width: '100%', padding: '8px', background: '#00f2fe', color: '#060813', border: 'none', borderRadius: '3px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <RiCoinsFill size={14} /> + Top-Up Non-Expiring Credits
                    </button>
                  </div>

                  {/* Sound Fidelity & Quick Links */}
                  <div style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setActiveTab('stream-controls');
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiEqualizerFill size={15} style={{ color: '#10b981' }} />
                        <span>Lossless Sound & EQ</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '3px' }}>24-Bit / 96kHz</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setActiveTab('settings');
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiSettings3Fill size={15} style={{ color: '#94a3b8' }} />
                        <span>Taste Preferences</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>Personalized</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountOpen(false);
                        setActiveTab('companion');
                      }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '3px', color: '#c084fc', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiSmartphoneFill size={15} style={{ color: '#c084fc' }} />
                        <span>Mobile & 8GB Offline Sync</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#c084fc' }}>Synced ✓</span>
                    </button>
                  </div>

                  <div style={{ paddingTop: '12px' }}>
                    <button
                      type="button"
                      className="dropdown-logout-btn"
                      onClick={() => onLogout && onLogout()}
                      style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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

      {/* EPK-Style Floating Hi-Fi Audio Player Overlay */}
      {isPlayerOpen && currentTrack && (
        <HiFiAudioPlayer
          track={currentTrack}
          tracks={catalogTracks}
          playlistName="Featured Playlist: Global Afrobeat & Amapiano Masters"
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
