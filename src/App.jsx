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

import React, { useState, useEffect, useRef } from 'react'
import { 
  HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams
} from 'react-router-dom'
import { 
  Music, Globe, Activity, Check, Zap, Shield, ArrowRight, ArrowLeft, 
  Lock, Database, Layers, Settings, Terminal, Radio, FileText, 
  Key, RefreshCw, Cpu, HelpCircle, ChevronDown, ChevronLeft, ChevronRight, Menu, X, MessageSquare, BookOpen, Coins,
  Bell, User, LogOut, ExternalLink, CheckCircle2,
  Smartphone, Download, Home, Apple, CreditCard, Headphones, TrendingUp,
  RotateCcw, Send, Users as UsersIcon, PenTool, Link2, Mail, Play
} from 'lucide-react'

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
import { authApi, tokenStore, adminApi, dealsApi, usersApi } from './lib/api.js'
import { INTERMAVEN_NATIVE_APPS } from './lib/nativeApps.js'
import { INTERMAVEN_PLATFORM_APPS } from './lib/intermavenPlatformApps.js'
import { lookupApp } from './lib/appCatalog.js'

import './App.css'

// // ================= Navbar Component =================
function Navbar({ sessionUser }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const appsDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const libraryDropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const getRoleLogoForPath = (pathname) => {
    const roleMatch = pathname.match(/^\/for\/([^/]+)/);
    if (roleMatch) {
      const roleKey = roleMatch[1];
      const logo = ROLE_LOGOS[roleKey];
      if (logo) return { logo, roleKey };
    }
    if (pathname === '/native-apps/creator-companion') {
      return { logo: ROLE_LOGOS['companion'], roleKey: 'companion' };
    }
    if (pathname === '/native-apps/tunestreams' || pathname === '/native-apps/tunestream') {
      return { logo: ROLE_LOGOS['consumer'], roleKey: 'consumer' };
    }
    if (pathname === '/native-apps/tunepay') {
      return { logo: ROLE_LOGOS['tunepay'], roleKey: 'tunepay' };
    }
    return null;
  };

  const activeRoleLogo = getRoleLogoForPath(currentPath);

  const isActive = (path) => currentPath === path;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (appsDropdownRef.current && !appsDropdownRef.current.contains(e.target)) {
        setAppsDropdownOpen(false);
      }
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(e.target)) {
        setAboutDropdownOpen(false);
      }
      if (libraryDropdownRef.current && !libraryDropdownRef.current.contains(e.target)) {
        setLibraryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Conditional Menu rendering
  const renderNavLinks = () => {
    if (currentPath === '/native-apps/tunestreams' || currentPath === '/native-apps/tunestream') {
      return (
        <>
          <li>
            <Link to="/native-apps/tunestreams?view=listen" className="nav-link" onClick={() => setMobileOpen(false)}>
              Listen
            </Link>
          </li>
          <li>
            <Link to="/native-apps/tunestreams?view=explore" className="nav-link" onClick={() => setMobileOpen(false)}>
              Explore
            </Link>
          </li>
          <li className="dropdown-container" ref={libraryDropdownRef}>
            <button
              className="nav-link dropdown-trigger"
              onClick={() => {
                setAppsDropdownOpen(false);
                setAboutDropdownOpen(false);
                setDropdownOpen(false);
                setLibraryDropdownOpen(!libraryDropdownOpen);
              }}
            >
              My Library
              <ChevronDown size={14} />
            </button>
            <ul className={`dropdown-menu ${libraryDropdownOpen ? 'open' : ''}`}>
              <li>
                <Link to="/native-apps/tunestreams?view=playlists" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Playlists
                </Link>
              </li>
              <li>
                <Link to="/native-apps/tunestreams?view=create-playlist" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Create Playlist
                </Link>
              </li>
              <li>
                <Link to="/native-apps/tunestreams?view=browse-podcasts" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Browse Podcasts
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/native-apps/tunestreams?view=apps" className="nav-link" onClick={() => setMobileOpen(false)}>
              Apps
            </Link>
          </li>
          <li>
            <Link to="/native-apps/tunestreams?view=help" className="nav-link" onClick={() => setMobileOpen(false)}>
              Support & Community
            </Link>
          </li>
        </>
      );
    }
    
    if (currentPath === '/native-apps/creator-companion') {
      return (
        <>
          <li>
            <a href="#companion-features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('companion-features'); }}>
              Capabilities
            </a>
          </li>
          <li>
            <a href="#live-splits" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('live-splits'); }}>
              Live Splits
            </a>
          </li>
          <li>
            <Link to="/dashboard" className="nav-link" onClick={() => setMobileOpen(false)}>
              Web Console
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link" onClick={() => setMobileOpen(false)}>
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/" className="nav-link" style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '4px', color: '#a78bfa' }} onClick={() => setMobileOpen(false)}>
              Return to TuneMavens
            </Link>
          </li>
        </>
      );
    }

    // Default corporate links
    return (
      <>
        <li>
          <Link 
            to="/tools" 
            className={`nav-link ${isActive('/tools') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            AI Tools
          </Link>
        </li>
        <li className="dropdown-container" ref={appsDropdownRef}>
          <button
            className={`nav-link dropdown-trigger ${isActive('/apps') || isActive('/native-apps') ? 'active' : ''}`}
            onClick={() => setAppsDropdownOpen(!appsDropdownOpen)}
            data-testid="nav-apps-dropdown-trigger"
          >
            Apps
            <ChevronDown size={14} />
          </button>
          <ul className={`dropdown-menu ${appsDropdownOpen ? 'open' : ''}`}>
            <li>
              <Link
                to="/apps"
                className="dropdown-link"
                onClick={() => { setAppsDropdownOpen(false); setMobileOpen(false); }}
                data-testid="nav-apps-dashboard-link"
              >
                <Layers size={16} /> Dashboard Apps
              </Link>
            </li>
            <li>
              <Link
                to="/native-apps"
                className="dropdown-link"
                onClick={() => { setAppsDropdownOpen(false); setMobileOpen(false); }}
                data-testid="nav-apps-native-link"
              >
                <Smartphone size={16} /> Native Apps
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link 
            to="/pricing" 
            className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </Link>
        </li>
        <li className="dropdown-container" ref={aboutDropdownRef}>
          <button 
            className={`nav-link dropdown-trigger ${isActive('/about') || isActive('/for') ? 'active' : ''}`} 
            onClick={() => { setDropdownOpen(false); setAppsDropdownOpen(false); setAboutDropdownOpen(!aboutDropdownOpen); }}
          >
            About
            <ChevronDown size={14} />
          </button>
          <ul className={`dropdown-menu ${aboutDropdownOpen ? 'open' : ''}`}>
            <li>
              <Link to="/about" className="dropdown-link" onClick={() => { setAboutDropdownOpen(false); setMobileOpen(false); }}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/for" className="dropdown-link" onClick={() => { setAboutDropdownOpen(false); setMobileOpen(false); }}>
                Perfect For
              </Link>
            </li>
          </ul>
        </li>
        <li className="dropdown-container" ref={dropdownRef}>
          <button 
            className="nav-link dropdown-trigger" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Support & Community
            <ChevronDown size={14} />
          </button>
          <ul className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
            <li>
              <Link to="/help" className="dropdown-link" onClick={() => { setDropdownOpen(false); setMobileOpen(false); }}>
                <HelpCircle size={16} /> Help Center
              </Link>
            </li>
            <li>
              <a href="#forum" className="dropdown-link" onClick={() => { alert('TuneMavens Community Forum shares the Intermaven account profile and will launch in Phase 2.'); setDropdownOpen(false); setMobileOpen(false); }}>
                <MessageSquare size={16} /> Creator Forum
              </a>
            </li>
            <li>
              <a href="#blog" className="dropdown-link" onClick={() => { alert('Creator stories and news blog coming soon.'); setDropdownOpen(false); setMobileOpen(false); }}>
                <BookOpen size={16} /> Blog & Articles
              </a>
            </li>
          </ul>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-inner-container">
        {activeRoleLogo ? (
          <div className="nav-logo-container-role" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', padding: '6px 0' }}>
            <img 
              src={activeRoleLogo.logo} 
              alt={`${activeRoleLogo.roleKey} Logo`} 
              className="logo-image-role logo-image"
              style={{ display: 'block' }}
            />
            <Link 
              to="/" 
              onClick={(e) => {
                setMobileOpen(false);
                if (document.referrer && document.referrer.includes(window.location.host)) {
                  e.preventDefault();
                  window.history.back();
                } else if (window.history.state && window.history.state.idx > 0) {
                  e.preventDefault();
                  window.history.back();
                }
              }} 
              style={{ fontSize: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', textAlign: 'center', marginTop: '-12px' }}
            >
              {"<< a tunemavens utility"}
            </Link>
          </div>
        ) : (
          <Link to="/" className="nav-logo-container" onClick={() => setMobileOpen(false)}>
            <img 
              src={scrolled ? "/tunemavens-logo-teal.png" : "/tunemavens-logo-white.png"} 
              alt="TuneMavens Logo" 
              className="logo-image" 
            />
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Links */}
        <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          {renderNavLinks()}
          
          {/* Mobile Region Switcher & CTAs inside scroll flow */}
          {mobileOpen && (
            <li style={{ padding: '8px 0', width: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <RegionSwitcher />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                {sessionUser ? (
                  <Link to="/dashboard" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Log In</Link>
                    <Link to="/register" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }} onClick={() => setMobileOpen(false)}>Start Free</Link>
                  </>
                )}
              </div>
            </li>
          )}
        </ul>

        {/* Desktop Region Switcher & CTAs */}
        <div className="nav-desktop-actions-box">
          <div className="desktop-switcher">
            <RegionSwitcher />
          </div>
          <div className="nav-ctas">
            {sessionUser ? (
              <Link to="/dashboard" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} /> Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Log In</Link>
                <Link to="/register" className="btn-primary">Start Free</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// ================= Reusable Page Header Banner =================
function PageHeader({ title, bgImage, bgImageWestern, breadcrumb }) {
  const { country } = useRegion();
  const isWestern = ['US', 'GB'].includes(country);
  const selectedBg = isWestern && bgImageWestern ? bgImageWestern : bgImage;

  return (
    <div 
      className="page-header-banner" 
      style={{ backgroundImage: `url(${selectedBg})` }}
    >
      <div className="page-header-overlay" />
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>
        <div className="page-header-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">{breadcrumb}</span>
        </div>
      </div>
    </div>
  );
}

// ================= Interactive Flagship Product Demos =================
function SyncBriefDemo() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        bpm: '118',
        mood: 'Driving, Late-Night, Confident',
        genre: 'Electro-Pop / Synthwave',
        tags: 'Automobile Commercial, Urban Night, Retro-Futuristic'
      });
    }, 800);
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Energetic urban skate video in Atlanta" 
          className="form-control" 
          style={{ padding: '6px 12px', fontSize: '11px', flex: '1', height: '32px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
          required
        />
        <button type="submit" className="btn-primary" style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
          {loading ? 'Analyzing...' : 'Generate Sync Brief'}
        </button>
      </form>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--cyan)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>BPM:</strong> {result.bpm} | <strong>Genre:</strong> {result.genre}</div>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>Mood:</strong> {result.mood}</div>
          <div style={{ color: 'var(--cyan)' }}><strong>Generated Placements:</strong> {result.tags}</div>
        </div>
      )}
    </div>
  );
}

function MasteringDemo() {
  const [fileChosen, setFileChosen] = useState(false);
  const [target, setTarget] = useState('Spotify');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        lufs: target === 'Spotify' ? '-14.1 LUFS' : target === 'Apple' ? '-16.2 LUFS' : '-23.0 LUFS',
        peak: '-1.0 dBFS',
        status: 'Optimal dynamic range matched successfully'
      });
    }, 900);
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={() => setFileChosen(true)} 
          className="plan-btn outline" 
          style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
        >
          📁 {fileChosen ? 'reference_mix.wav loaded' : 'Load Audio File'}
        </button>
        <select 
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ padding: '6px', fontSize: '11px', height: '32px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
        >
          <option value="Spotify">Spotify Target (-14 LUFS)</option>
          <option value="Apple">Apple Music Target (-16 LUFS)</option>
          <option value="Broadcast">Broadcast TV Target (-23 LUFS)</option>
        </select>
        <button 
          onClick={handleRun} 
          disabled={!fileChosen}
          className="btn-primary" 
          style={{ padding: '0 12px', fontSize: '11px', height: '32px', borderRadius: '4px', opacity: fileChosen ? 1 : 0.5, cursor: 'pointer' }}
        >
          {loading ? 'Measuring LUFS...' : 'Analyze Audio'}
        </button>
      </div>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--purple)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '4px' }}><strong>Measured Loudness:</strong> {result.lufs} | <strong>True Peak:</strong> {result.peak}</div>
          <div style={{ color: 'var(--purple)' }}><strong>Status:</strong> {result.status}</div>
        </div>
      )}
    </div>
  );
}

function SplitCalculatorDemo() {
  const [amount, setAmount] = useState('1000');
  const [artist, setArtist] = useState('50');
  const [producer, setProducer] = useState('30');
  const [label, setLabel] = useState('20');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const amt = parseFloat(amount) || 0;
    const art = (parseFloat(artist) / 100) * amt;
    const prod = (parseFloat(producer) / 100) * amt;
    const lbl = (parseFloat(label) / 100) * amt;
    setResult({ art, prod, lbl });
  };

  return (
    <div className="interactive-demo glass-panel" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '80px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Bulk Amount ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Artist %</label>
            <input 
              type="number" 
              value={artist} 
              onChange={(e) => setArtist(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Producer %</label>
            <input 
              type="number" 
              value={producer} 
              onChange={(e) => setProducer(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
          <div style={{ flex: '1', minWidth: '50px' }}>
            <label style={{ fontSize: '10px', color: 'var(--mu)', display: 'block', marginBottom: '2px' }}>Label %</label>
            <input 
              type="number" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              className="form-control" 
              style={{ padding: '4px 8px', fontSize: '11px', height: '28px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', width: '100%' }} 
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '11px', height: '28px', borderRadius: '4px', alignSelf: 'flex-end', cursor: 'pointer' }}>
          Run Cascade Allocation
        </button>
      </form>

      {result && (
        <div className="demo-result" style={{ marginTop: '12px', fontSize: '12px', borderLeft: '2px solid var(--green)', paddingLeft: '12px', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ color: 'var(--mu)', marginBottom: '2px' }}><strong>Artist Payout:</strong> ${result.art.toFixed(2)}</div>
          <div style={{ color: 'var(--mu)', marginBottom: '2px' }}><strong>Producer Payout:</strong> ${result.prod.toFixed(2)}</div>
          <div style={{ color: 'var(--green)' }}><strong>Label Payout:</strong> ${result.lbl.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

function SyncBriefCarousel({ step, setStep }) {
  const steps = [
    {
      title: "Step 1: Input Narrative Description or Scene Brief",
      desc: "Input raw movie scene storyboards, narrative directions, or visual descriptors directly. The parser handles complex screenplays.",
      icon: "🎬",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', fontSize: '11px', color: 'var(--mu)', textAlign: 'left' }}>
          <strong>Scene Descriptor:</strong> "High-energy cyberpunk motorcycle chase, driving industrial synthesizer chords, aggressive heavy electronic beats..."
        </div>
      )
    },
    {
      title: "Step 2: Generate Sync Metadata Tags",
      desc: "Our AI translates descriptors into standard music metadata tags (BPM, Mood, Instrumentation) instantly.",
      icon: "🏷️",
      visual: <SyncBriefDemo />
    },
    {
      title: "Step 3: Match Search Criteria of Supervisors",
      desc: "Instantly compare generated keywords with specifications requested by global music supervisors.",
      icon: "🔍",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span>Netflix Cyberpunk Brief</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>98% Match</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <span>EA Games Racing Brief</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>94% Match</span>
          </div>
        </div>
      )
    },
    {
      title: "Step 4: Deliver Direct Brief Submissions",
      desc: "Package and transmit your tagged audio directly to TV & Film briefs with zero middleman publisher fees.",
      icon: "📬",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', textAlign: 'center' }}>
          <div style={{ color: 'var(--green)', fontSize: '11px', fontWeight: '700' }}>✓ Brief Submission Transmitted</div>
          <div style={{ color: 'var(--mu)', fontSize: '10px', marginTop: '4px' }}>Metadata and WAV master delivered to buyer inbox.</div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="split-cascade-carousel-widget glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r)', width: '100%', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{current.icon}</span>
        <h4 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: '700' }}>{current.title}</h4>
      </div>
      
      <p style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45', margin: '0 0 12px' }}>{current.desc}</p>
      
      <div className="step-visualization" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {current.visual}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setStep(idx)}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === step ? 'var(--cyan)' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}
            className="plan-btn outline"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            Prev
          </button>
          <button 
            onClick={() => setStep((s) => (s + 1) % steps.length)}
            className="btn-primary"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function SplitCascadeCarousel({ step, setStep }) {
  const steps = [
    {
      title: "Step 1: Set Your Roster Shares",
      desc: "Define split allocations for artists, producers, and labels once. The ledger stores these rules permanently.",
      icon: "📋",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
            <span>Artist Share</span> <span style={{ color: 'var(--green)', fontWeight: '700' }}>50%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
            <span>Producer Share</span> <span style={{ color: 'var(--cyan)', fontWeight: '700' }}>30%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span>Label Share</span> <span style={{ color: 'var(--purple)', fontWeight: '700' }}>20%</span>
          </div>
        </div>
      )
    },
    {
      title: "Step 2: Upload Sales Statements",
      desc: "Drop raw transaction CSV exports from DistroKid or Spotify directly. The engine parses them instantly.",
      icon: "📁",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
          <div style={{ fontSize: '13px', color: 'var(--mu)' }}>raw_sales_report.csv</div>
          <div style={{ fontSize: '12px', color: 'var(--green)', marginTop: '4px', fontWeight: '500' }}>✓ 15,240 rows parsed successfully</div>
        </div>
      )
    },
    {
      title: "Step 3: Run the Split Cascade",
      desc: "The cascade engine divides the bulk receipts into respective collaborator balances.",
      icon: "⚡",
      visual: <SplitCalculatorDemo />
    },
    {
      title: "Step 4: Dispatch Digital Payouts",
      desc: "Direct wallet payouts map to digital currencies and local mobile payment terminals (such as M-Pesa).",
      icon: "💸",
      visual: (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', margin: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Artist Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$500.00 (M-Pesa)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Producer Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$300.00 (Paypal)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
            <span style={{ color: 'var(--green)' }}>🟢</span> <strong>Label Share:</strong> <span style={{ marginLeft: 'auto', color: '#fff' }}>+$200.00 (Wire)</span>
          </div>
        </div>
      )
    }
  ];

  const current = steps[step];

  return (
    <div className="split-cascade-carousel-widget glass-panel" style={{ padding: '20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r)', width: '100%', marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{current.icon}</span>
        <h4 style={{ margin: 0, fontSize: '17px', color: '#fff', fontWeight: '700' }}>{current.title}</h4>
      </div>
      
      <p style={{ fontSize: '14.5px', color: 'var(--mu)', lineHeight: '1.45', margin: '0 0 12px' }}>{current.desc}</p>
      
      <div className="step-visualization" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {current.visual}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setStep(idx)}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === step ? 'var(--green)' : 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}
            className="plan-btn outline"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            Prev
          </button>
          <button 
            onClick={() => setStep((s) => (s + 1) % steps.length)}
            className="btn-primary"
            style={{ padding: '4px 8px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UserPersonaCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const slides = [
    {
      title: "Drowning in Publishing Split Sheet Cuts?",
      subtitle: "Keep 100% of your licensing revenues. TuneMavens AI matches, pitches, and delivers audio catalogs directly to game developers and film music supervisors without a middleman.",
      persona: "Independent Songwriter",
      image: userSongwriterImg,
      cta: "Start Free Pitching",
      link: "/register",
      painpoint: "Publishing Middlemen take 50% of revenue",
      solution: "Self-Publish & Pitch directly with Sync Brief AI"
    },
    {
      title: "Struggling to Find Pre-Cleared Music Content?",
      subtitle: "Search and license high-fidelity tracks instantly. TuneMavens connects you directly to self-published songwriters with pre-cleared, AI-tagged audio assets ready for synchronization.",
      persona: "Music Supervisor",
      image: userSupervisorImg,
      cta: "Browse Pre-Cleared Music",
      link: "/tools",
      painpoint: "Unclear split rights and untagged catalogs stall clearances",
      solution: "Instant search of verified, 100% pre-cleared sync tags"
    },
    {
      title: "Losing Catalog Margins on Inefficient Royalty Tools?",
      subtitle: "Automate splits and catalog accounting in seconds. Our Split Cascade Ledger is built for modern record labels to ingest distributor statement CSV files, calculate cascading shares, and pay roster artists seamlessly.",
      persona: "Record Label Executive",
      image: userManagerImg,
      cta: "Start Seamless Operations",
      link: "/register",
      painpoint: "Manual spreadsheets cause payout errors and ingestion delays",
      solution: "Seamless CSV ledger ingestion and instant roster payouts"
    },
    {
      title: "Paying $150 per Track Just for Mastering?",
      subtitle: "Run unlimited mastering passes on our unified credits pool. Match loudness parameters (LUFS) for Apple Music and Spotify instantly without hiring studio engineers.",
      persona: "DIY Recording Artist",
      image: userProducerImg,
      cta: "Start Free Mastering",
      link: "/register",
      painpoint: "High studio engineering costs per track",
      solution: "Unlimited reference mastering runs in seconds"
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [slides.length, isHovered]);

  const current = slides[activeSlide];

  return (
    <section className="section-wrapper persona-carousel-section">
      <div className="section-header text-center">
        <span className="section-label">Target Audience Solutions</span>
        <h2 className="section-title">Who is TuneMavens Built For?</h2>
        <p className="section-desc">
          Compare your current music business roadblocks with our direct operational solutions built for your specific role.
        </p>
      </div>

      <div 
        className="persona-carousel glass-panel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="persona-carousel-content">
          <div className="persona-carousel-image-container">
            <img src={current.image} alt={current.persona} className="persona-carousel-image" />
          </div>
          <div className="persona-carousel-info">
            <span className="persona-badge">{current.persona}</span>
            <h3 className="persona-title">{current.title}</h3>
            <p className="persona-text">{current.subtitle}</p>
            
            <div className="persona-comparison">
              <div className="comparison-item pain">
                <strong>Roadblock:</strong> {current.painpoint}
              </div>
              <div className="comparison-item solution">
                <strong>TuneMavens Fix:</strong> {current.solution}
              </div>
            </div>

            <Link to={current.link} className="btn-primary" style={{ padding: '12px 28px', display: 'inline-flex', alignSelf: 'flex-start', marginTop: '16px' }}>
              {current.cta}
            </Link>
          </div>
        </div>

        <div className="persona-dots">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              type="button"
              className={`persona-dot ${idx === activeSlide ? 'active' : ''}`}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ================= Home / Landing View =================
function HomeView({ sessionUser }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const { country } = useRegion();

  const resolveLink = (link) => {
    if (sessionUser && (link === '/register' || link === '/login' || link === '/apps')) {
      return '/dashboard';
    }
    return link;
  };

  const isWestern = ['US', 'GB'].includes(country);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const [ledgerStep, setLedgerStep] = useState(0);
  const ledgerImages = [ledgerStep1Img, ledgerStep2Img, ledgerStep3Img, ledgerStep4Img];
  const [syncStep, setSyncStep] = useState(0);
  const syncImages = [syncStep1Img, syncStep2Img, syncStep3Img, syncStep4Img];

  // Shortened second titles split for cascading entry
  const slides = [
    { 
      dot: '#22d3ee', 
      badge: 'Music Operations & AI Suite',
      hLine1: 'You make the art.',
      hLine2: 'We handle the rest.',
      hLine2Color: '#22d3ee',
      s: "Coordinate splits, mastering LUFS, and sync pitches under a single unified console.",
      b1: 'Explore AI Tools',
      b1link: '/tools',
      b2: 'See Dashboard Apps',
      b2link: '/apps'
    },
    { 
      dot: '#8b5cf6', 
      badge: 'Automated Split Calculations',
      hLine1: 'Spreadsheet split sheets?',
      hLine2: 'Never again.',
      hLine2Color: '#8b5cf6',
      s: isWestern 
        ? "Define percentage rules once, ingest statement CSVs, and route digital payouts automatically via ACH, PayPal, and wire."
        : "Define percentage rules once, ingest statement CSVs, and route digital payouts automatically to local banks and M-Pesa.",
      b1: 'Learn Split Ledgers',
      b1link: '/apps',
      b2: 'Explore Pricing',
      b2link: '/pricing'
    },
    { 
      dot: '#22d3ee', 
      badge: 'Automated Sync Curation',
      hLine1: 'Pitches that hit.',
      hLine2: 'Get licensed.',
      hLine2Color: '#22d3ee',
      s: "Translate creative scene descriptors into search-friendly tags for TV & film music supervisors.",
      b1: 'Optimize Sync Briefs',
      b1link: '/tools',
      b2: 'Submit Ticket',
      b2link: '/help'
    },
    { 
      dot: '#10b981', 
      badge: 'Global Rights & Sync',
      hLine1: 'Distribute, sync, publish.',
      hLine2: 'Own your rights.',
      hLine2Color: '#10b981',
      s: isWestern
        ? "Pitch to TV networks, distribute to 150+ stores, and collect mechanical royalties globally in USD/GBP."
        : "Pitch to TV networks, distribute globally, and collect mechanical royalties into local mobile accounts.",
      b1: 'Start Publishing Now',
      b1link: '/register',
      b2: 'Learn Split Ledgers',
      b2link: '/apps'
    },
    {
      dot: '#c084fc',
      badge: 'Consumer Music Experience',
      hLine1: 'Listen and purchase.',
      hLine2: 'Support artists directly.',
      hLine2Color: '#c084fc',
      s: isWestern
        ? "Stream high-fidelity music ad-free, buy vinyl, and purchase merchandise in USD or GBP."
        : "Stream high-fidelity music ad-free, purchase direct downloads, and support creators with mobile money.",
      b1: 'Start Free Streaming',
      b1link: '/stream',
      b2: 'Browse Music Store',
      b2link: '/tools'
    },
    {
      dot: '#f59e0b',
      badge: 'Catalog Operations & Ingest',
      hLine1: 'Scale your catalog.',
      hLine2: 'Ingest bulk releases.',
      hLine2Color: '#f59e0b',
      s: "Upload bulk statements, parse CSV roster ledgers instantly, and optimize catalog splits seamlessly.",
      b1: 'Start Bulk Ingest',
      b1link: '/register',
      b2: 'Roster Operations',
      b2link: '/apps'
    }
  ];

  const SLIDE_DURATION = 36000; // Slowed down by half for easier reading
  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide];

  // Specific backgrounds for slides (conditional on active region / country)
  const backgrounds = [
    `url(${isWestern ? heroMusic1WesternImg : heroMusic1Img})`,
    `url(${isWestern ? heroMusic2WesternImg : heroMusic2Img})`,
    `url(${isWestern ? heroMusic3WesternImg : heroMusic3Img})`,
    `url(${distributeHeroImg})`, // Clean minimal digital abstract image
    `url(${listenHeroImg})`,      // Clean human-based music listener image
    `url(${isWestern ? heroMusic3WesternImg : heroMusic3Img})`
  ];

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
    }, 400);
  };

  const goToPrevSlide = () => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
  };

  const goToNextSlide = () => {
    goToSlide((currentSlide + 1) % slideCount);
  };

  useEffect(() => {
    const startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      setSlideState('out');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setProgress(0);
        setSlideState('in');
      }, 400);
    }, SLIDE_DURATION);

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, slideCount]);

  return (
    <>
      {/* Hero Section Carousel */}
      <div className="hw">
        <div className="bgs">
          {backgrounds.map((bg, idx) => (
            <div 
              key={idx}
              className={`bg ${currentSlide === idx ? 'on' : ''}`}
              style={{
                backgroundImage: bg,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentSlide === idx 
                  ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.7) blur(1.5px)')
                  : 'none',
                transform: currentSlide === idx && titleHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          ))}
          <div 
            className="bgo" 
            style={{
              opacity: titleHovered ? 0.3 : 0.8,
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </div>

        <div className="hs">
          <div 
            className="hcont"
            key={currentSlide} /* Force complete unmount/remount on cycle to trigger entry animations */
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`he hbadge ${slideState}`}>
              <span 
                className="bdot" 
                style={{ 
                  background: currentSlideData.dot,
                  animation: 'pulseGlow 2s infinite'
                }} 
              />
              <span>{currentSlideData.badge}</span>
            </div>
            
            <h1 className="ht htitle">
              <span className={`ht-line ht-line-1 ${slideState}`}>{currentSlideData.hLine1}</span>
              <span 
                className={`ht-line ht-line-2 ${slideState}`}
                style={{ color: currentSlideData.hLine2Color }}
              >
                {currentSlideData.hLine2}
              </span>
            </h1>
            
            <p className={`hp hsub ${slideState}`}>
              {currentSlideData.s}
            </p>

            <div className={`hb hbtns ${slideState}`}>
              <Link to={resolveLink(currentSlideData.b1link)} className="hbp">
                {currentSlideData.b1}
              </Link>
              <Link to={resolveLink(currentSlideData.b2link)} className="hbg">
                {currentSlideData.b2}
              </Link>
            </div>
          </div>
        </div>

        {/* Slide navigation controls */}
        <div className={`sui-arrows ${slideState}`}>
          <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide">‹</button>
          <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide">›</button>
        </div>

        {/* Progress bar and dot selectors */}
        <div className={`sui-bottom ${slideState}`}>
          <div className="spr">
            <div className="spb" style={{ width: `${progress}%` }} />
          </div>
          <div className="sdots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`sd ${index === currentSlide ? 'on' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content area below hero: 1/4 sidebar + 3/4 main content.
          Hero, header, and footer are all outside this split. */}
      <div className="landing-content-split">
        <PerfectForSidebar />

        <div className="landing-content-main container">
        {/* Flagship App Previews */}
        <section className="section-wrapper">
          <div className="flagship-previews">
            {/* Consumer Streaming & Marketplace Row */}
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={consumerAppImg} alt="TuneMavens Consumer Streaming App" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Consumer Experience</div>
                <h3 className="flagship-title">Music Streaming & Purchase Marketplace</h3>
                <p className="flagship-text">
                  <strong>Ad-Free High-Fidelity Playback & Digital Store.</strong> Fans stream catalog releases and purchase vinyl, merchandise, and digital collectibles directly from independent artists. Powered by non-expiring Unified Network Credits shared across tunemavens.com, watchtube.tv, and intermaven.io.
                </p>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Start Free Streaming</Link>
              </div>
            </div>

            {/* Creator Backend Dashboard Row */}
            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={creatorDashboardImg} alt="Backend Creator Dashboard and Analytics AI" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Creator Analytics</div>
                <h3 className="flagship-title">Backend Unified Dashboard & Real-Time Analytics AI</h3>
                <p className="flagship-text">
                  <strong>Data-Rich Console with a Self-Learning Neural Engine.</strong> Monitor live listening metrics, track cross-platform network credits earnings, and coordinate metadata. Our AI learns from directory trends and reference parameters in real-time, refining splits and tag recommendations every single second.
                </p>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>Explore Creator Console</Link>
              </div>
            </div>
            {/* Box 1 */}
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={syncImages[syncStep]} alt="Sync Brief AI workflow" className="flagship-image fade-in-animation" key={syncStep} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Sync Licensing</div>
                <h3 className="flagship-title">Sync Brief AI</h3>
                <p className="flagship-text">
                  <strong>Ideal for Independent Songwriters & Sync Composers.</strong> Stop wasting hours trying to guess how a music supervisor will search for your track. Our AI parses script notes and video briefs to output tags like BPM, mood, and genre instantly. Catalog your songs so media buyers find them first.
                </p>
                <SyncBriefCarousel step={syncStep} setStep={setSyncStep} />
                <Link to="/tools" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Try Sync Pitch Tool &rarr;</Link>
              </div>
            </div>

            {/* Box 2 */}
            <div className="flagship-card glass-panel reverse">
              <div className="flagship-visual-container">
                <img src={appsMasteringImg} alt="Mastering Brief AI" className="flagship-image" />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Audio Engineering</div>
                <h3 className="flagship-title">Mastering Brief AI</h3>
                <p className="flagship-text">
                  <strong>Ideal for Bedroom Producers & DIY Recording Artists.</strong> Skip the expensive mastering sessions just to hear your mix in the car. Set target loudness targets (LUFS) for streaming networks, upload references, and let the engine optimize your audio for immediate playback in seconds.
                </p>
                <MasteringDemo />
                <Link to="/tools" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Try Mastering Tool &rarr;</Link>
              </div>
            </div>

            {/* Box 3 */}
            <div className="flagship-card glass-panel">
              <div className="flagship-visual-container">
                <img src={ledgerImages[ledgerStep]} alt="Split Cascade Ledger workflow" className="flagship-image fade-in-animation" key={ledgerStep} />
              </div>
              <div className="flagship-info">
                <div className="flagship-badge">Accounting & Revenue</div>
                <h3 className="flagship-title">Split Cascade Ledger</h3>
                <p className="flagship-text" style={{ fontSize: '17px', lineHeight: '1.6' }}>
                  <strong>Ideal for Indie Label Managers & Music Collectives.</strong> Stop fighting with Excel sheets and manual payouts. Set clean percentages for authors, producers, and labels once. Load your distributor's statement CSV, and let the cascade engine calculate everyone's share in seconds.
                </p>
                <SplitCascadeCarousel step={ledgerStep} setStep={setLedgerStep} />
                <Link to="/apps" className="flagship-link" style={{ marginTop: '16px', display: 'inline-block' }}>Manage Roster Splits &rarr;</Link>
              </div>
            </div>
          </div>
        </section>

        {/* User Persona Solutions Section */}
        <UserPersonaCarousel />

        {/* Pain Points Section */}
        <section className="section-wrapper text-center">
          <div className="section-header">
            <span className="section-label">Frustrations Resolved</span>
            <h2 className="section-title">Built for the Real Realities of Music</h2>
          </div>
          <div className="pain-points-grid">
            <div className="pain-card glass-panel">
              <div className="pain-icon"><Layers size={24} /></div>
              <h4>Spreadsheet Fatigue</h4>
              <p><strong>Ideal for DIY Managers.</strong> We replace complex spreadsheets with automated cascade splitting rules that map directly to payment terminals.</p>
            </div>
            <div className="pain-card glass-panel">
              <div className="pain-icon"><Cpu size={24} /></div>
              <h4>Engineering Costs</h4>
              <p><strong>Ideal for Touring Artists.</strong> Get mastering and compliance checks instantly without having to hire expensive studio engineers for simple reference adjustments.</p>
            </div>
            <div className="pain-card glass-panel">
              <div className="pain-icon"><Globe size={24} /></div>
              <h4>Pitching Hurdles</h4>
              <p><strong>Ideal for Sync Catalog Owners.</strong> Translate your tracks into structured metadata briefs so television networks and game publishers can find your songs in catalogs.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Funnel Banner */}
        <section className="section-wrapper text-center cta-banner-section" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <div className="glass-panel cta-banner-panel" style={{ padding: '32px 24px', borderRadius: 'var(--r)', border: '1px solid rgba(34, 211, 238, 0.15)', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03), rgba(139, 92, 246, 0.03))' }}>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 38px)', marginBottom: '12px', fontFamily: 'Sansation, sans-serif' }}>Ready to automate your music business operations?</h2>
            <p className="section-desc" style={{ maxWidth: '600px', margin: '0 auto 30px', color: 'var(--mu)' }}>
              Get 150 free signup credits instantly. No credit card required. Use credits across TuneMavens and the Intermaven network.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>Start Free</Link>
              <Link to="/pricing" className="btn-secondary" style={{ padding: '12px 28px', fontSize: '15px' }}>See Credit Packages</Link>
            </div>
          </div>
        </section>
        </div>
      </div>

    </>
  )
}

// ================= AI Tools Catalog View =================
function ToolsView() {
  const tools = [
    { name: 'Sync Brief AI', icon: Radio, desc: 'Translates video descriptions and creative scripts into specific sync descriptors.', cost: '10 credits' },
    { name: 'Mastering Brief AI', icon: Cpu, desc: 'Optimizes output loudness targets (LUFS) and peaks based on reference tracks.', cost: '15 credits' },
    { name: 'Artist One-Sheet AI', icon: FileText, desc: 'Compiles your brand and catalog details into a clean PDF one-sheet pitch document.', cost: '5 credits' },
    { name: 'Remix License Generator', icon: Key, desc: 'Generates stem clearance and royalty share contracts for collaborative remixes.', cost: 'Free' },
    { name: 'Broadcast Report Formatter', icon: Settings, desc: 'Formats and compiles broadcast playlogs to fit compliance reporting sheets.', cost: 'Free' },
    { name: 'Royalty Statement AI', icon: Activity, desc: 'Audits bulk royalty statement payouts and exports split ledgers.', cost: '20 credits' },
    { name: 'Release Planner', icon: FileText, desc: 'Coordinates store distribution deadlines and media campaign dates.', cost: 'Free' },
    { name: 'Music NFT Brief', icon: Lock, desc: 'Designs metadata token structures for web3 releases and catalog registration.', cost: '25 credits' },
    { name: 'ISRC Generator', icon: Terminal, desc: 'Allocates and registers validated track tracking codes.', cost: 'Free' },
    { name: 'Playlist Pitch AI', icon: Globe, desc: 'Automates curator pitching emails based on your genre tags and references.', cost: '10 credits' },
  ];

  return (
    <>
      <PageHeader title="Music Operations Engine" bgImage={headerToolsImg} bgImageWestern={headerToolsWesternImg} breadcrumb="AI Tools" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Standalone, precise AI modules designed to automate formatting, contracts, mastering compliance, and catalog pitching.
        </p>
        <div className="apps-grid">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="app-card glass-panel glass-panel-hover">
                <div className="app-icon-box" style={{ background: 'rgba(34, 211, 238, 0.08)', color: 'var(--cyan)' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{t.name}</h3>
                <p className="app-desc">{t.desc}</p>
                <span className="app-tag">{t.cost}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
}

// ================= Dashboard Apps View =================
// ================= Dashboard Apps Sub-Components =================
function ComingSoonApp({ name, goBack, sessionUser }) {
  return (
    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', maxWidth: '600px', margin: '0 auto' }}>
      <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>🚀</span>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{name}</h2>
      <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
        This standalone module is currently locked in preview. Secure early access credentials to launch custom instances in production.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={goBack} className="plan-btn outline" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Go Back
        </button>
        <Link to={sessionUser ? "/dashboard" : "/register"} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', cursor: 'pointer' }}>
          {sessionUser ? "Go to Dashboard" : "Get Sandbox Key"}
        </Link>
      </div>
    </div>
  );
}

function SplitCascadeLedgerApp({ goBack }) {
  const [step, setStep] = useState(0);
  return (
    <div className="ledger-app-widget" style={{ padding: '24px', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>Split Cascade Ledger</h2>
            <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Manage revenue distributions, metadata rules, and statements</p>
          </div>
        </div>
        <button 
          onClick={goBack} 
          className="plan-btn outline"
          style={{ padding: '6px 14px', fontSize: '11px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
        >
          &larr; Back to Apps
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <SplitCascadeCarousel step={step} setStep={setStep} />
      </div>
    </div>
  );
}

function MpesaPosTerminal({ goBack }) {
  const { country, currencyInfo, formatPrice } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const defaultPhone = country === 'KE' ? '254700000000' 
                     : (country === 'NG' ? '2348000000000' 
                     : (country === 'UG' ? '256700000000' 
                     : (country === 'TZ' ? '255700000000' 
                     : (country === 'US' ? '14045550199' 
                     : (country === 'GB' ? '447911123456' : '27110000000')))));

  const gatewayName = country === 'KE' ? 'M-Pesa Paybill' 
                    : (country === 'NG' ? 'Flutterwave Pay ID' 
                    : (isEastAfrica ? 'Mobile Money Merchant ID' 
                    : 'Stripe Terminal ID'));

  const gatewayVal = country === 'KE' ? 'Paybill 522900'
                   : (country === 'NG' ? 'FLW-9021-NG'
                   : (isEastAfrica ? 'MM-Merchant-8092'
                   : 'Stripe-POS-Live'));

  const typeName = ['KE', 'UG', 'TZ'].includes(country) ? 'M-Pesa' 
                 : (country === 'NG' ? 'Flutterwave' : 'Stripe Card');

  const defaultAmount = ['US', 'GB'].includes(country) ? '15' : '1500';

  const [phone, setPhone] = useState(defaultPhone);
  const [amount, setAmount] = useState(defaultAmount);
  const [item, setItem] = useState('General Album Merch');
  const [paybill, setPaybill] = useState(gatewayVal);
  const [status, setStatus] = useState('idle'); // 'idle', 'initiating', 'pending', 'completed', 'failed'
  const [checkoutId, setCheckoutId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [transactions, setTransactions] = useState([
    { id: 'TX-1', time: 'Just now', amount: ['US', 'GB'].includes(country) ? 25 : 2500, item: 'Concert Entry Ticket', status: 'completed', type: typeName },
    { id: 'TX-2', time: '10 mins ago', amount: ['US', 'GB'].includes(country) ? 5 : 500, item: 'Digital Track download', status: 'completed', type: typeName },
    { id: 'TX-3', time: '1 hr ago', amount: ['US', 'GB'].includes(country) ? 15 : 1500, item: 'Custom T-Shirt', status: 'completed', type: 'Card' }
  ]);

  const handleInitiate = async (e) => {
    e.preventDefault();
    setStatus('initiating');
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/payments/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, amount: parseInt(amount), item })
      });
      
      const data = await response.json();
      if (data.success) {
        setCheckoutId(data.checkout_request_id);
        setStatus('pending');
        pollStatus(data.checkout_request_id);
      } else {
        setStatus('failed');
        setErrorMsg(data.message || 'Failed to initiate POS prompt.');
      }
    } catch (err) {
      console.log('Simulating POS push local flow...');
      setTimeout(() => {
        const mockCheckoutId = `ws_CO_${Math.random().toString(36).substring(2, 10)}`;
        setCheckoutId(mockCheckoutId);
        setStatus('pending');
        
        setTimeout(() => {
          setStatus('completed');
          setTransactions(prev => [
            { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: typeName },
            ...prev
          ]);
        }, 6000);
      }, 1000);
    }
  };

  const pollStatus = async (chkId) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 12) {
        clearInterval(interval);
        setStatus('failed');
        setErrorMsg('Transaction timed out. Please try again.');
        return;
      }
      
      try {
        const res = await fetch(`/api/payments/mpesa/status/${chkId}`);
        const data = await res.json();
        if (data.status === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          setTransactions(prev => [
            { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: 'M-Pesa' },
            ...prev
          ]);
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          setErrorMsg('Transaction was cancelled or rejected by customer.');
        }
      } catch (err) {
      }
    }, 2000);
  };

  const handleSimulateCallback = async () => {
    if (!checkoutId) return;
    setStatus('initiating');
    try {
      await fetch('/api/payments/mpesa/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Body: {
            stkCallback: {
              CheckoutRequestID: checkoutId,
              ResultCode: 0,
              ResultDesc: "The service request is processed successfully.",
              CallbackMetadata: {
                Item: [
                  { Name: "Amount", Value: parseInt(amount) },
                  { Name: "MpesaReceiptNumber", Value: `QG${Math.random().toString(36).substring(2, 10).toUpperCase()}` },
                  { Name: "PhoneNumber", Value: phone }
                ]
              }
            }
          }
        })
      });
      setStatus('completed');
      setTransactions(prev => [
        { id: `TX-${Math.floor(Math.random() * 1000)}`, time: 'Just now', amount: parseInt(amount), item, status: 'completed', type: 'M-Pesa' },
        ...prev
      ]);
    } catch (err) {
      setStatus('completed');
    }
  };

  return (
    <div className="pos-terminal-widget" style={{ padding: '24px', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>📱</span>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', margin: 0 }}>tunepay POS Terminal</h2>
            <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Collect client payments directly to your local wallet</p>
          </div>
        </div>
        <button 
          onClick={goBack} 
          className="plan-btn outline"
          style={{ padding: '6px 14px', fontSize: '11px', height: '30px', borderRadius: '4px', cursor: 'pointer' }}
        >
          &larr; Back to Apps
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        
        {/* Terminal Controls */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', textAlign: 'left' }}>Collect New Payment</h3>
          
          <form onSubmit={handleInitiate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Customer Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="form-control"
                placeholder={defaultPhone}
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Amount to Collect ({currencyInfo?.code || 'USD'})</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="form-control"
                placeholder={"Amount in " + (currencyInfo?.code || "USD")}
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Item / Service Tag</label>
              <input 
                type="text" 
                value={item} 
                onChange={(e) => setItem(e.target.value)} 
                className="form-control"
                placeholder="VIP Concert Ticket"
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff' }}
                required 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--mu)' }}>Merchant Channel ({gatewayName})</label>
              <select 
                value={paybill} 
                onChange={(e) => setPaybill(e.target.value)} 
                style={{ padding: '8px 12px', fontSize: '12px', background: 'rgba(6, 8, 19, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#fff', outline: 'none' }}
              >
                {country === 'KE' ? (
                  <>
                    <option value="Paybill 522900">Paybill 522900 (Main Account)</option>
                    <option value="Till 999999">Buy Goods Till 999999</option>
                  </>
                ) : country === 'NG' ? (
                  <>
                    <option value="FLW-9021-NG">FLW-9021-NG (Lagos Office)</option>
                    <option value="FLW-Merchant">Flutterwave Till FLW-Merchant</option>
                  </>
                ) : (
                  <>
                    <option value="Stripe-POS-Live">Stripe Reader (Live Account)</option>
                    <option value="Stripe-POS-Backup">Stripe Reader (Backup Terminal)</option>
                  </>
                )}
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={status === 'initiating' || status === 'pending'}
              style={{ marginTop: '12px', padding: '10px', fontSize: '12px', borderRadius: '4px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              {(status === 'initiating' || status === 'pending') ? (
                <>
                  <RefreshCw size={14} className="spin-animation" />
                  Initiating Push...
                </>
              ) : `Push ${typeName} Prompt`}
            </button>
          </form>
        </div>

        {/* Status Screen & Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Panel */}
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '180px' }}>
            {status === 'idle' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', animation: 'bounce 2s infinite' }}>⚡</div>
                <h4 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>Terminal Idle</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>Ready to receive. Enter details and click push to prompt target device.</p>
              </>
            )}
            
            {(status === 'initiating' || status === 'pending') && (
              <>
                <div style={{ display: 'inline-block', position: 'relative', width: '40px', height: '40px', marginBottom: '12px' }}>
                  <div className="loader-ring spin-animation" style={{ width: '40px', height: '40px', border: '3px solid rgba(34,211,238,0.1)', borderTopColor: 'var(--cyan)', borderRadius: '50%' }} />
                </div>
                <h4 style={{ fontSize: '13px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{typeName} Prompt Active</h4>
                <p style={{ fontSize: '11px', color: 'var(--cyan)', margin: '0 0 8px', fontWeight: '500' }}>Awaiting user PIN confirmation on device...</p>
                <p style={{ fontSize: '10px', color: 'var(--mu)', margin: '0 0 14px' }}>Request ID: {checkoutId || 'Generating...'}</p>
                
                {/* Dev Mock Complete */}
                <button 
                  onClick={handleSimulateCallback}
                  className="btn-primary"
                  style={{ padding: '4px 10px', fontSize: '9px', height: '22px', borderRadius: '3px', background: 'rgba(16,185,129,0.2)', border: '1px solid var(--green)', color: 'var(--green)', cursor: 'pointer' }}
                >
                  ✓ Simulate PIN Input (Sandbox)
                </button>
              </>
            )}

            {status === 'completed' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', color: 'var(--green)' }}>🟢</div>
                <h4 style={{ fontSize: '13px', color: 'var(--green)', margin: '0 0 4px', fontWeight: '700' }}>Collection Completed!</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: '0 0 12px' }}>Successfully collected {currencyInfo?.symbol || '$'}{amount} from {phone}. Credits updated.</p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="plan-btn outline"
                  style={{ padding: '4px 10px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Clear Status
                </button>
              </>
            )}

            {status === 'failed' && (
              <>
                <div style={{ fontSize: '36px', marginBottom: '8px', color: '#f43f5e' }}>🔴</div>
                <h4 style={{ fontSize: '13px', color: '#f43f5e', margin: '0 0 4px', fontWeight: '700' }}>Payment Cancelled</h4>
                <p style={{ fontSize: '11px', color: 'var(--mu)', margin: '0 0 12px' }}>{errorMsg || 'Customer rejected prompt or input timed out.'}</p>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="plan-btn outline"
                  style={{ padding: '4px 10px', fontSize: '10px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Retry Push
                </button>
              </>
            )}
          </div>

          {/* Transactions Log */}
          <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--r)', flex: 1 }}>
            <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Recent POS Collections</span>
              <span style={{ fontSize: '10px', color: 'var(--mu)' }}>Last 3 entries</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.map((tx, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(6, 8, 19, 0.4)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>{tx.item}</div>
                    <div style={{ fontSize: '9px', color: 'var(--mu)' }}>{tx.id} • {tx.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--green)' }}>+{currencyInfo?.symbol || '$'}{tx.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '9px', color: 'var(--cyan)', fontWeight: '500' }}>{tx.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// ================= Native App Landing Pages (per-app marketing) =================
// Each app gets a 3-slide hero carousel (same pattern as HomeView), with
// targeting + CTAs specific to that app's user. `bgKey` resolves to one of
// the image imports at the top of this file via the HERO_IMAGE_MAP below.
const NATIVE_APP_LANDING_DATA = {
  tunestreams: {
    slug: 'tunestreams',
    name: 'tunestream',
    target: 'For listeners',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    icon: 'Headphones',
    heroSlides: [
      {
        dot: '#10b981',
        badge: 'Streaming & Library · iOS / Android',
        hLine1: 'Carry the catalogue.',
        hLine2: 'Even off-grid.',
        hLine2Color: '#10b981',
        s: 'Cache 8GB of HQ FLAC locally. Stream cellular-aware. Your library follows you between Wi-Fi, 4G, and no-signal subways.',
        b1: 'Download on App Store',
        b1action: 'appstore',
        b2: 'Use the Web Player',
        b2link: '/stream',
        bgKey: 'listenHero',
      },
      {
        dot: '#10b981',
        badge: 'Direct Creator Support',
        hLine1: 'Skip the middleman.',
        hLine2: 'Tip mid-track.',
        hLine2Color: '#10b981',
        s: 'One tap mid-listen sends value through the Compensation Engine straight to the creator\u2019s wallet within 24 hours.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'How tipping works',
        b2link: '/help',
        bgKey: 'heroMusic1',
      },
      {
        dot: '#c084fc',
        badge: 'Shared Credits Vault',
        hLine1: 'One account,',
        hLine2: 'every surface.',
        hLine2Color: '#c084fc',
        s: 'Your credits, follow list and tip history sync between web, iOS, Android, and the wider intermaven.io toolset.',
        b1: 'Start Listening Free',
        b1link: '/register',
        b2: 'Browse Pricing',
        b2link: '/pricing',
        bgKey: 'distributeHero',
      },
    ],
    lede: 'A consumer music app built around the African catalogue  -  offline HQ audio, region-aware editorial playlists, and a tip jar that pays the creator directly through the shared tunestream / Intermaven split ledger.',
    webEquivalent: { label: 'Use the web player', to: '/stream' },
    adminLink: { label: 'Manage your library', to: '/dashboard' },
    features: [
      { title: 'HQ offline cache', desc: 'Up to 8GB of FLAC / 320 kbps audio stored locally for low-bandwidth listening.' },
      { title: 'One-tap creator tipping', desc: 'Send a tip mid-track  -  it flows through the Compensation Engine and lands in the creator\u2019s wallet within 24h.' },
      { title: 'Region-aware playlists', desc: 'Editorial picks tailored to your detected market: Naija, EA, SA, US/UK and beyond.' },
      { title: 'Smart discovery', desc: 'AI surfaces tracks that pair with what you already love, weighted by your follow list.' },
      { title: 'Shared credits vault', desc: 'Your tunestream credits work on intermaven.io tools too  -  one account, one balance.' },
      { title: 'Live event drops', desc: 'Get notified when an artist you follow lists tickets or merch on the tunepay network.' },
    ],
    howItWorks: [
      { step: '01', title: 'Sign in once', body: 'Use your existing tunestream / Intermaven account  -  no separate native-app credentials.' },
      { step: '02', title: 'Pick three creators', body: 'During onboarding you follow 3 creators; your home feed seeds from their catalogue and collaborators.' },
      { step: '03', title: 'Stream or download', body: 'Tap to stream, long-press to cache offline. Toggle data-saver in regions where bandwidth is metered.' },
      { step: '04', title: 'Support directly', body: 'Tip, buy, or pre-save. Every interaction is logged in the creator\u2019s ledger you can verify in their EPK.' },
    ],
    testimonials: [
      { quote: 'I tipped my favourite producer mid-listen and it showed up in their split ledger the same day. That\u2019s the future.', author: 'Lerato, Johannesburg', role: 'Listener · 2026' },
      { quote: 'Offline mode survived my whole 6-hour matatu ride. Bandwidth-aware caching actually works.', author: 'Brian, Nairobi', role: 'Daily commuter' },
    ],
    faq: [
      { q: 'Is tunestream free to use?', a: 'Yes  -  listening and tipping are free. The free tier includes 150 signup credits used across the wider Intermaven network.' },
      { q: 'How are creators paid when I tip?', a: 'Tips enter the Compensation Engine cascade (Commission \u2192 Label \u2192 Artist \u2192 Manager \u2192 Investor). The split is governed by the creator\u2019s signed contract on file.' },
      { q: 'Can I switch between web and native?', a: 'Yes  -  the web player lives at /stream and shares the same session, library, and tip history.' },
      { q: 'Which devices are supported?', a: 'iOS 15+ and Android 9+. The native shells are Capacitor-wrapped, so the same engine runs on both platforms.' },
      { q: 'Does it work without reliable internet?', a: 'Yes  -  cache up to 8GB locally. Tips queue offline and settle when you reconnect.' },
    ],
    pricingLine: 'Free tier · 150 credits at signup · unlimited streaming',
  },
  'creator-companion': {
    slug: 'creator-companion',
    name: 'tunecompanion',
    target: 'For artists & managers',
    accent: 'var(--purple)',
    accentGlow: 'rgba(139, 92, 246, 0.18)',
    icon: 'TrendingUp',
    heroSlides: [
      {
        dot: '#8b5cf6',
        badge: 'Split Cascade · Live',
        hLine1: 'Watch every cent settle.',
        hLine2: 'From green room to wire.',
        hLine2Color: '#8b5cf6',
        s: 'See Commission \u2192 Label \u2192 Artist \u2192 Manager \u2192 Investor resolve in real time, on the phone in your pocket.',
        b1: 'Download Companion',
        b1action: 'appstore',
        b2: 'Open the Web Admin',
        b2link: '/dashboard',
        bgKey: 'heroMusic2',
      },
      {
        dot: '#22d3ee',
        badge: 'Sync Brief Alerts',
        hLine1: 'Close placements',
        hLine2: 'before soundcheck.',
        hLine2Color: '#22d3ee',
        s: 'Push notifications the moment a film, ad, or playlist brief matches your catalogue. Approve, counter, or pitch  -  in two taps.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'See Sync Marketplace',
        b2link: '/tools',
        bgKey: 'heroMusic3',
      },
      {
        dot: '#f59e0b',
        badge: 'Manager Mode',
        hLine1: 'Every artist you rep.',
        hLine2: 'One switcher.',
        hLine2Color: '#f59e0b',
        s: 'Toggle between every artist on your roster  -  no separate logins. Approve cascade settlements while they\u2019re on stage.',
        b1: 'Start 14-Day Trial',
        b1link: '/register',
        b2: 'View Pricing',
        b2link: '/pricing',
        bgKey: 'distributeHero',
      },
    ],
    lede: 'A mobile-first admin for the people who make the music: split-cascade ledger live on your phone, sync-brief alerts, AI release playbooks, and payout balances you can verify the moment a stream pays out.',
    webEquivalent: { label: 'Open the web dashboard', to: '/dashboard' },
    adminLink: { label: 'Full admin console', to: '/dashboard' },
    features: [
      { title: 'Live split cascade', desc: 'Watch a transaction resolve through Commission \u2192 Label \u2192 Artist \u2192 Manager \u2192 Investor in real time.' },
      { title: 'Payout balance ticker', desc: 'Net to wallet, recoupment runoff and pending escrow, refreshed every minute.' },
      { title: 'Sync brief alerts', desc: 'Push notification the moment a film or ad-house brief matches your catalogue.' },
      { title: 'AI release playbook', desc: 'Drafts a 6-week rollout: pre-save windows, pitch targets, sync openings, content calendar.' },
      { title: 'Catalogue overview', desc: 'ISRC status, DSP ingestion checks, and per-track stream counts  -  all on one screen.' },
      { title: 'Manager mode', desc: 'Managers see every artist they represent in a single switcher  -  no separate logins.' },
    ],
    howItWorks: [
      { step: '01', title: 'Sign in', body: 'Same JWT as your TuneMavens.com profile. No separate native credentials.' },
      { step: '02', title: 'Pin your dashboard', body: 'Re-order panels  -  payout, splits, sync alerts, contacts  -  to match how you actually work.' },
      { step: '03', title: 'Act on alerts', body: 'Accept a sync brief, approve a split, or e-sign a contract amendment in two taps.' },
      { step: '04', title: 'Settle in the field', body: 'Approve M-Pesa POS settlements from the same app  -  no laptop required.' },
    ],
    testimonials: [
      { quote: 'I approved a sync brief from a green room ten minutes before stage time. Closed a placement that would have died in email.', author: 'Caleb, Lagos', role: 'Producer' },
      { quote: 'My manager and I watch the same split cascade resolve, on two phones, at the same time. No more spreadsheets.', author: 'Aisha Okoro', role: 'Artist · Okoro Sounds' },
    ],
    faq: [
      { q: 'Is Creator Companion separate from the web dashboard?', a: 'No  -  it\u2019s the same admin, sized for mobile. Every action you take in either surface mirrors instantly.' },
      { q: 'Can I sign contracts on mobile?', a: 'Yes. E-signature works on any phone, tap-optimised, and every party gets their own signed copy.' },
      { q: 'Does it support multi-artist managers?', a: 'Yes  -  see "Manager mode" above. One switcher, every artist you represent.' },
      { q: 'How are notifications delivered?', a: 'Pick a primary channel (push, email, WhatsApp, SMS). If it fails, we\u2019ll try the next one automatically so you never miss anything.' },
      { q: 'Will my data sync if I switch phones?', a: 'Your data lives in the cloud, not on the device. Sign in on a new phone and everything is right where you left it.' },
    ],
    pricingLine: 'Bundled with Creator Package · 1,200 credits · $29.99 one-time',
  },
  tunepay: {
    slug: 'tunepay',
    name: 'tunepay',
    target: 'For labels & venues',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    icon: 'CreditCard',
    heroSlides: [
      {
        dot: '#10b981',
        badge: 'tunepay STK · Daraja',
        hLine1: 'Sell at the show.',
        hLine2: 'Settle by morning.',
        hLine2Color: '#10b981',
        s: 'tunepay STK Push closes in under 10 seconds. Settlement runs the Compensation Engine cascade overnight  -  artist payouts hit by 7am.',
        b1: 'Provision POS App',
        b1action: 'appstore',
        b2: 'Open the Web POS',
        b2link: '/apps',
        bgKey: 'heroMusic3',
      },
      {
        dot: '#22d3ee',
        badge: 'Multi-Rail · Geo-Routed',
        hLine1: 'Tap, scan, or text.',
        hLine2: 'Every payment rail.',
        hLine2Color: '#22d3ee',
        s: 'Stripe Terminal in US/UK. Flutterwave in Nigeria. tunepay in Kenya. The app picks the rail by detected country  -  zero config.',
        b1: 'Get on Google Play',
        b1action: 'googleplay',
        b2: 'See Bulk Label Pricing',
        b2link: '/pricing',
        bgKey: 'heroMusic4',
      },
      {
        dot: '#f59e0b',
        badge: 'Per-Event Settlement',
        hLine1: '240 t-shirts. 60 vinyls.',
        hLine2: 'Cleared by 7am.',
        hLine2Color: '#f59e0b',
        s: 'Close an event session and the cascade fires automatically. Per-SKU, per-method, per-artist commissions settled within 24h.',
        b1: 'Book a Demo',
        b1link: '/help',
        b2: 'Manage From Admin',
        b2link: '/dashboard',
        bgKey: 'heroMusic2',
      },
    ],
    lede: 'A portable point-of-sale for live events: merch, ticket scans, CD/vinyl. tunepay STK Push, card-present, and digital-wallet acceptance  -  all geo-routed to the right settlement rail per region.',
    webEquivalent: { label: 'Open the web POS', to: '/apps' },
    adminLink: { label: 'Manage inventory & settlements', to: '/dashboard' },
    features: [
      { title: 'tunepay STK Push', desc: 'Live Daraja integration. Customers enter PIN on their phone  -  checkout completes in under 10 seconds.' },
      { title: 'Card present + wallet', desc: 'Tap-to-pay via Stripe Terminal for Western markets; Flutterwave for Nigeria; mobile money for EA.' },
      { title: 'Merch & ticket modes', desc: 'Switch between SKU-based merch sales and barcode/QR ticket validation per event session.' },
      { title: 'Per-event settlement', desc: 'Daily settlement reports broken down by SKU, payment method, and per-artist commission cascade.' },
      { title: 'Offline queue', desc: 'Lose signal mid-show? Sales queue locally and settle the instant connectivity returns.' },
      { title: 'Geo-gated routing', desc: 'The app picks the right settlement rail by detected country  -  no manual configuration.' },
    ],
    howItWorks: [
      { step: '01', title: 'Provision a device', body: 'Issue a POS profile per device from the admin console. Lost devices can be remote-wiped.' },
      { step: '02', title: 'Pick an event', body: 'Tap to open the event session: merch SKUs, ticket lists, and price tier are auto-loaded.' },
      { step: '03', title: 'Take payment', body: 'STK push, card tap, or wallet QR. Receipt prints via the connected thermal printer or emails to the buyer.' },
      { step: '04', title: 'Close out', body: 'Close the event session to trigger the settlement cascade. Artist payouts settle within 24h.' },
    ],
    testimonials: [
      { quote: 'We sold 240 t-shirts and 60 vinyls in one night with two phones. The settlement report was in my inbox by 7am.', author: 'DJ Afro\u2019s tour ops', role: 'Live event · Nairobi' },
      { quote: 'Switched from a clunky Square terminal. The tunepay flow alone closed the gap on every cash-only segment of our crowd.', author: 'Lagos label ops', role: 'Independent label' },
    ],
    faq: [
      { q: 'Do I need special hardware?', a: 'No  -  runs on any iOS 15+ or Android 9+ device. Optional thermal printer, barcode scanner, and Stripe BBPOS reader if you want them.' },
      { q: 'Which countries are supported today?', a: 'Kenya (tunepay Daraja), Nigeria (Flutterwave), and US/UK (Stripe Terminal) at launch. ZA / UG / TZ ship in the next sprint.' },
      { q: 'How does the artist get paid?', a: 'Every sale fires the Compensation Engine cascade. Artist + manager + label shares are settled per the signed contracts on file.' },
      { q: 'Can I manage POS devices from the web?', a: 'Yes  -  the admin console has a dedicated POS Devices panel for provisioning, monitoring, and remote-wipe.' },
      { q: 'What happens if the device goes offline?', a: 'Payments queue locally with cryptographic receipts. They settle the instant the device reconnects.' },
    ],
    pricingLine: 'Included in Label Bulk Package · 10,000 credits · $149.99 one-time',
  },
};

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`landing-faq-item ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="landing-faq-q"
        onClick={() => setOpen(o => !o)}
        data-testid="landing-faq-toggle"
      >
        <span>{q}</span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>
      {open && <p className="landing-faq-a">{a}</p>}
    </div>
  );
}

function NativeAppLandingView() {
  const { slug } = useParams();
  const normalizedSlug = (slug === 'tunestream' || slug === 'tunemavens') ? 'tunestreams' : slug;
  const data = NATIVE_APP_LANDING_DATA[normalizedSlug];
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get('view') || 'listen';

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('tunestream_playlists');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, name: 'Afrobeat Essentials', desc: 'The hottest tracks from Lagos and Accra.', tracks: 12, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
      { id: 2, name: 'Acoustic Chill Africa', desc: 'Unplugged guitar and soul vibes.', tracks: 8, bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
      { id: 3, name: 'Amapiano Heat', desc: 'Pretoria and Johannesburg club starters.', tracks: 15, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    ];
  });

  const savePlaylists = (newList) => {
    setPlaylists(newList);
    try {
      localStorage.setItem('tunestream_playlists', JSON.stringify(newList));
    } catch (e) {}
  };

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [newPlaylistBg, setNewPlaylistBg] = useState('linear-gradient(135deg, #10b981 0%, #059669 100%)');

  const [promotedActs, setPromotedActs] = useState(() => getPromotedActs());

  useEffect(() => {
    const handleStorage = () => {
      setPromotedActs(getPromotedActs());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Icon lookup table  -  kept simple to avoid dynamic import gymnastics.
  const ICONS = { Headphones, TrendingUp, CreditCard };
  // bgKey -> image asset (re-uses HomeView's hero imagery for visual cohesion)
  const HERO_IMAGE_MAP = {
    listenHero: listenHeroImg,
    heroMusic1: heroMusic1Img,
    heroMusic2: heroMusic2Img,
    heroMusic3: heroMusic3Img,
    heroMusic4: heroMusic4Img,
    distributeHero: distributeHeroImg,
  };

  // --- Hero carousel state (same shape as HomeView) ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideState, setSlideState] = useState('in');
  const [progress, setProgress] = useState(0);
  const [titleHovered, setTitleHovered] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  // Slower than HomeView so the dense product copy has time to land.
  const SLIDE_DURATION = 48000; // Slowed down by half
  const TRANSITION_OUT_MS = 700;

  const slides = data?.heroSlides || [];
  const slideCount = slides.length;
  const currentSlideData = slides[currentSlide] || null;

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setSlideState('out');
    setTimeout(() => {
      setCurrentSlide(index);
      setProgress(0);
      setSlideState('in');
    }, TRANSITION_OUT_MS);
  };
  const goToPrevSlide = () => goToSlide((currentSlide - 1 + slideCount) % slideCount);
  const goToNextSlide = () => goToSlide((currentSlide + 1) % slideCount);

  useEffect(() => {
    if (!slideCount) return undefined;
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };
    progressRef.current = requestAnimationFrame(updateProgress);
    timerRef.current = setTimeout(() => {
      setSlideState('out');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setProgress(0);
        setSlideState('in');
      }, TRANSITION_OUT_MS);
    }, SLIDE_DURATION);
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, slideCount]);

  if (!data) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#f1f5f9' }}>App not found</h2>
        <Link to="/native-apps" className="btn-primary" style={{ display: 'inline-block', marginTop: '20px' }}>
          See all native apps
        </Link>
      </div>
    );
  }

  const HeroIcon = ICONS[data.icon];

  const renderHeroCta = (slide, which) => {
    const label = which === 'b1' ? slide.b1 : slide.b2;
    const link = which === 'b1' ? slide.b1link : slide.b2link;
    const action = which === 'b1' ? slide.b1action : slide.b2action;
    const cls = which === 'b1' ? 'hbp' : 'hbg';
    const testId = `landing-hero-${which}-${normalizedSlug}`;
    if (action === 'appstore' || action === 'googleplay') {
      const storeName = action === 'appstore' ? 'App Store' : 'Google Play';
      return (
        <button
          type="button"
          className={cls}
          onClick={() => alert(`${storeName} listing for ${data.name} coming soon.`)}
          data-testid={testId}
          style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {label}
        </button>
      );
    }
    return (
      <Link to={link} className={cls} data-testid={testId}>{label}</Link>
    );
  };

  if (normalizedSlug === 'tunestreams') {

    const renderHeader = (title, breadcrumb) => {
      return (
        <div 
          className="page-header-banner" 
          style={{ 
            backgroundImage: `url(${tunestreamHeaderImg})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            borderRadius: '3px',
            overflow: 'hidden', 
            marginBottom: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            position: 'relative',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="page-header-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(7, 14, 27, 0.8)', zIndex: 1 }} />
          <div className="page-header-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '40px 24px' }}>
            <h1 className="page-header-title" style={{ fontSize: '32px', fontWeight: '800', color: '#fff', margin: 0 }}>{title}</h1>
            <div className="page-header-breadcrumb" style={{ marginTop: '12px', fontSize: '13px', color: 'var(--mu)', display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'center' }}>
              <Link to="/native-apps/tunestreams?view=listen" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>TuneStreams</Link>
              <span>/</span>
              <span style={{ color: '#fff' }}>{breadcrumb}</span>
            </div>
          </div>
        </div>
      );
    };

    const renderListen = () => {
      return (
        <>
          {/* HEADER IMAGE with human elements, multicultural, clean */}
          <div 
            className="tunestream-app-header" 
            style={{ 
              position: 'relative', 
              padding: '80px 24px', 
              backgroundImage: `url(${tunestreamHeaderImg})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              borderRadius: '3px', 
              overflow: 'hidden', 
              marginBottom: '40px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              textAlign: 'center'
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(7, 14, 27, 0.7) 0%, rgba(7, 14, 27, 0.95) 100%)', zIndex: 1 }} />
            
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px', margin: '0 auto' }}>
              <div className="he hbadge" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 12px', borderRadius: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                <span className="bdot" style={{ background: '#10b981', animation: 'pulseGlow 2s infinite' }} />
                <span>streams.tunemavens.com · Subdomain Active</span>
              </div>
              <h1 className="ht htitle" style={{ fontSize: '38px', fontWeight: '800', color: '#fff', lineHeight: '1.2', marginBottom: '16px' }}>
                Carry the catalogue.<br />
                <span style={{ color: '#10b981' }}>Even off-grid.</span>
              </h1>
              <p className="hp hsub" style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px' }}>
                High-fidelity FLAC audio and direct creator support. Stream cellular-aware, tip mid-track, and share your credits vault across all devices.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to="/stream" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={16} fill="currentColor" /> Stream Web Player
                </Link>
                <a href="#plans-section" className="plan-btn outline" onClick={(e) => { e.preventDefault(); scrollToSection('plans-section'); }} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', padding: '12px 24px', borderRadius: '4px', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease' }}>
                  View Plans
                </a>
              </div>
            </div>
          </div>

          {/* Subdomain Mapping Notification Banner */}
          <div style={{ background: 'rgba(34, 211, 238, 0.08)', borderBottom: '1px solid rgba(34, 211, 238, 0.15)', padding: '12px 24px', borderRadius: '8px', textAlign: 'center', fontSize: '13px', color: '#cbd5e1', marginBottom: '40px' }}>
            🌐 TuneStream platform resolves natively to: <strong style={{ color: '#fff' }}>streams.tunemavens.com</strong>. Map containers securely in the <Link to="/dashboard" onClick={() => { setActiveTab('domain-mappings'); }} style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>Domain Mappings Admin Console</Link>.
          </div>

          {/* Spotify-like Content Grid (3px border radius) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            
            {/* Trending Songs */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Trending Songs</h2>
                <Link to="/native-apps/tunestreams?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { id: 't1', title: 'Midnight Cruise', artist: 'Alex Rivera', streams: '1.2M streams', bg: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)' },
                  { id: 't2', title: 'Lagos Vibe', artist: 'Tunde & Friends', streams: '890K streams', bg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' },
                  { id: 't3', title: 'Sunset in Nairobi', artist: 'Mercy Wangari', streams: '620K streams', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                  { id: 't4', title: 'Desert Wind', artist: 'Youssef Bilal', streams: '450K streams', bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
                  { id: 't5', title: 'Table Mountain Sunrise', artist: 'Zola K.', streams: '310K streams', bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
                ].map(song => (
                  <div key={song.id} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Playing: ${song.title} by ${song.artist}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: song.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '32px' }}>🎵</div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px' }}>{song.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{song.streams}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Artists */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Artists</h2>
                <Link to="/native-apps/tunestreams?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Alex Rivera', listeners: '1.5M listeners', avatar: '🎙️', bg: '#8b5cf6' },
                  { name: 'Tunde & Friends', listeners: '1.1M listeners', avatar: '🥁', bg: '#ec4899' },
                  { name: 'Mercy Wangari', listeners: '900K listeners', avatar: '🎤', bg: '#10b981' },
                  { name: 'Youssef Bilal', listeners: '800K listeners', avatar: '🎸', bg: '#f59e0b' },
                  { name: 'Zola K.', listeners: '500K listeners', avatar: '🎷', bg: '#3b82f6' },
                ].map((artist, idx) => (
                  <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', textAlign: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Opening ${artist.name}'s Profile`)}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '3px', background: artist.bg, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>{artist.avatar}</div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold' }}>{artist.name}</h3>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{artist.listeners}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Singles */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Singles</h2>
                <Link to="/native-apps/tunestreams?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'City Lights', artist: 'Alex Rivera', dls: '400K downloads', bg: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' },
                  { title: 'Amapiano Bounce', artist: 'Zola K.', dls: '320K downloads', bg: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)' },
                  { title: 'Zilizopendwa Remix', artist: 'Mercy Wangari', dls: '280K downloads', bg: 'linear-gradient(135deg, #6d28d9 0%, #10b981 100%)' },
                  { title: 'Highlife High', artist: 'Tunde & Friends', dls: '210K downloads', bg: 'linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)' },
                  { title: 'Bongo Flava Anthem', artist: 'Zola K.', dls: '190K downloads', bg: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)' },
                ].map((single, idx) => (
                  <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Playing: ${single.title}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: single.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '32px' }}>💿</div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold' }}>{single.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px' }}>{single.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{single.dls}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Albums */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Popular Albums</h2>
                <Link to="/native-apps/tunestreams?view=explore" style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold' }}>See all</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { title: 'Afro-Futurism Vol. 1', artist: 'Alex Rivera', year: '2026', bg: 'linear-gradient(135deg, #2563eb 0%, #ec4899 100%)' },
                  { title: 'Nairobi Nights', artist: 'Mercy Wangari', year: '2025', bg: 'linear-gradient(135deg, #059669 0%, #d97706 100%)' },
                  { title: 'Lagos to London', artist: 'Tunde & Friends', year: '2026', bg: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' },
                  { title: 'Sahara Groove', artist: 'Youssef Bilal', year: '2024', bg: 'linear-gradient(135deg, #b91c1c 0%, #d97706 100%)' },
                  { title: 'Cape Town Chill', artist: 'Zola K.', year: '2026', bg: 'linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)' },
                ].map((album, idx) => (
                  <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Opening Album: ${album.title}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: album.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '32px' }}>🎚️</div>
                    <h3 style={{ fontSize: '15px', color: '#fff', margin: '0 0 4px', fontWeight: 'bold' }}>{album.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '0 0 8px' }}>{album.artist}</p>
                    <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{album.year} · Album</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Charts */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0 }}>Featured Charts</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                {[
                  { name: 'Top 50 Global', desc: 'The most streamed tracks globally on TuneStream.', bg: 'linear-gradient(135deg, #f43f5e 0%, #10b981 100%)' },
                  { name: 'Naija Hot 20', desc: 'The biggest tracks out of Nigeria this week.', bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                  { name: 'East Africa Hits', desc: 'Top charting tracks from Kenya, Uganda, Tanzania.', bg: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' },
                  { name: 'Amapiano Kings', desc: 'Curated mix of the hottest South African sounds.', bg: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)' },
                  { name: 'Alternative Africa', desc: 'Discover the best indie and electronic talent.', bg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
                ].map((chart, idx) => (
                  <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Opening Chart: ${chart.name}`)}>
                    <div style={{ width: '100%', paddingBottom: '100%', borderRadius: '3px', background: chart.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', padding: '12px', boxSizing: 'border-box' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{chart.name}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--mu)', margin: 0 }}>{chart.desc}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* PLANS SECTION (CTA with plans) */}
          <section id="plans-section" style={{ padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="landing-section-eyebrow" style={{ color: 'var(--green)' }}>Choose Your Vibe</span>
              <h2 className="landing-section-title" style={{ color: '#fff', fontSize: '32px', fontWeight: '800' }}>TuneStream Listening Plans</h2>
              <p style={{ color: 'var(--mu)', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>Flexible plans built around the shared Intermaven Network ecosystem.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
              
              {/* Free Plan Card */}
              <div className="glass-panel" style={{ padding: '32px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                <div>
                  <span style={{ color: 'var(--green)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>Free Tier</span>
                  <h3 style={{ fontSize: '24px', color: '#fff', margin: '8px 0 16px', fontWeight: '800' }}>TuneStream Free</h3>
                  <p style={{ fontSize: '14px', color: 'var(--mu)', marginBottom: '24px' }}>Ad-supported music streaming. No commitment, completely free, no credit card required.</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <li>✓ 150 shared Intermaven credits at signup</li>
                    <li>✓ Unlimited music streaming (web and mobile)</li>
                    <li>✓ Basic quality audio</li>
                    <li>✓ Ad-supported</li>
                  </ul>
                </div>
                
                <Link to="/native-apps/tunestreams?view=free" className="btn-primary" style={{ textAlign: 'center', width: '100%', padding: '12px' }}>
                  Learn More
                </Link>
              </div>

              {/* Premium Plan Card */}
              <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--green)', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(16,185,129,0.02)', boxShadow: '0 8px 30px rgba(16,185,129,0.08)' }}>
                <div>
                  <span style={{ color: 'var(--cyan)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>Premium Tier</span>
                  <h3 style={{ fontSize: '24px', color: '#fff', margin: '8px 0 16px', fontWeight: '800' }}>TuneStream Premium</h3>
                  <p style={{ fontSize: '14px', color: 'var(--mu)', marginBottom: '24px' }}>Ad-free listening. High-fidelity lossless audio and offline caching. Paid via credits.</p>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0' }} />
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <li>✓ Zero Ads for uninterrupted listening</li>
                    <li>✓ Lossless FLAC audio (24-bit / 96kHz)</li>
                    <li>✓ Offline downloads up to 8GB cache</li>
                    <li>✓ One-tap tipping to independent artists</li>
                    <li>✓ Deducts credits automatically per listen</li>
                  </ul>
                </div>
                
                <Link to="/native-apps/tunestreams?view=premium" className="btn-primary" style={{ textAlign: 'center', width: '100%', padding: '12px', background: 'var(--green)', border: 'none' }}>
                  Go Premium
                </Link>
              </div>

            </div>
          </section>

        </>
      );
    };

    const renderExplore = () => {
      const creators = [
        { name: 'Alex Rivera', genre: 'Afrobeats', location: 'Lagos, Nigeria', streams: '1.2M', avatar: '🎙️', bg: '#8b5cf6' },
        { name: 'Tunde & Friends', genre: 'Highlife', location: 'Accra, Ghana', streams: '890K', avatar: '🥁', bg: '#ec4899' },
        { name: 'Mercy Wangari', genre: 'Afrosoul', location: 'Nairobi, Kenya', streams: '620K', avatar: '🎤', bg: '#10b981' },
        { name: 'Youssef Bilal', genre: 'Desert Blues', location: 'Marrakech, Morocco', streams: '450K', avatar: '🎸', bg: '#f59e0b' },
        { name: 'Zola K.', genre: 'Amapiano', location: 'Soweto, South Africa', streams: '310K', avatar: '🎷', bg: '#3b82f6' },
        { name: 'Fatoumata D.', genre: 'Wassoulou', location: 'Bamako, Mali', streams: '280K', avatar: '🎻', bg: '#06b6d4' },
        { name: 'Sauti Band', genre: 'Afropop', location: 'Dar es Salaam', streams: '190K', avatar: '🎺', bg: '#f43f5e' },
        { name: 'Kidest G.', genre: 'Ethio-Jazz', location: 'Addis Ababa', streams: '150K', avatar: '🎹', bg: '#10b981' },
      ];

      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('Explore Creators', 'Explore')}
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: '24px' }}>Discover new talent and verify their splits on the Intermaven shared ledger.</p>
          
          <div style={{ marginBottom: '30px', position: 'relative', maxWidth: '400px' }}>
            <input 
              type="text" 
              placeholder="Search creators, genres, or locations..." 
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', outline: 'none' }}
              onChange={(e) => console.log('Searching:', e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {creators.map((c, idx) => (
              <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Opening EPK dashboard for ${c.name}`)}>
                <div style={{ width: '100%', height: '140px', borderRadius: '3px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '16px' }}>{c.avatar}</div>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{c.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--mu)', margin: '0 0 8px' }}>{c.genre} · {c.location}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                  <span style={{ color: 'var(--mu)' }}>{c.streams} streams</span>
                  <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>View EPK →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderPlaylists = () => {
      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('My Playlists', 'Library / Playlists')}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '14px', margin: 0 }}>Access your personalized streams and custom crates.</p>
            <Link to="/native-apps/tunestreams?view=create-playlist" className="btn-primary" style={{ padding: '10px 16px', textDecoration: 'none' }}>
              + Create Playlist
            </Link>
          </div>

          {playlists.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.01)', borderRadius: '3px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📭</span>
              <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>No playlists yet</h3>
              <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: '20px' }}>Create your first custom listening collection.</p>
              <Link to="/native-apps/tunestreams?view=create-playlist" className="btn-primary">Create Now</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {playlists.map(p => (
                <div key={p.id} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Streaming playlist: ${p.name}`)}>
                  <div style={{ width: '100%', height: '140px', borderRadius: '3px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '16px', color: '#fff', fontWeight: 'bold' }}>🎧</div>
                  <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700' }}>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--mu)', margin: '0 0 12px', minHeight: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineBreak: 'after-white-space', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--mu)' }}>{p.tracks} tracks</span>
                    <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>▶ Play</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderCreatePlaylist = () => {
      const handleCreate = (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) {
          alert('Please enter a playlist name.');
          return;
        }
        const newPlaylist = {
          id: Date.now(),
          name: newPlaylistName,
          desc: newPlaylistDesc || 'Custom listening collection.',
          tracks: 0,
          bg: newPlaylistBg,
        };
        const newList = [...playlists, newPlaylist];
        savePlaylists(newList);
        
        // Reset fields
        setNewPlaylistName('');
        setNewPlaylistDesc('');
        
        alert('Playlist created successfully!');
        navigate('/native-apps/tunestreams?view=playlists');
      };

      const bgOptions = [
        { label: 'Teal/Green', val: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { label: 'Purple/Indigo', val: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
        { label: 'Amber/Orange', val: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { label: 'Cyan/Blue', val: 'linear-gradient(135deg, #22d3ee 0%, #1d4ed8 100%)' },
        { label: 'Pink/Rose', val: 'linear-gradient(135deg, #ec4899 0%, #e11d48 100%)' },
      ];

      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('Create Playlist', 'Library / Create')}
          <div style={{ maxWidth: '500px', margin: '0 auto' }} className="glass-panel">
            <p style={{ color: 'var(--mu)', fontSize: '13px', marginBottom: '24px' }}>Set up a new mix to organize your favorite lossless studio tracks.</p>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>Playlist Name *</label>
                <input 
                  type="text" 
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. Acoustic Chill, Roadtrip Vibes" 
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' }}>Description</label>
                <textarea 
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="Describe your playlist..." 
                  rows="3"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Select Theme Art Color</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {bgOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewPlaylistBg(opt.val)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '3px',
                        background: opt.val,
                        border: newPlaylistBg === opt.val ? '2px solid #fff' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: newPlaylistBg === opt.val ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      title={opt.label}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer' }}>
                  Create Playlist
                </button>
                <Link to="/native-apps/tunestreams?view=playlists" className="plan-btn outline" style={{ flex: 1, padding: '12px', textAlign: 'center', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff' }}>
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      );
    };

    const renderBrowsePodcasts = () => {
      const podcasts = [
        { title: 'The Independent Artist Podcast', host: 'Intermaven Audio', desc: 'Survival tips, split cascade tutorials, and industry insights for creators.', bg: 'linear-gradient(135deg, #10b981 0%, #1e1b4b 100%)', emoji: '🎙️' },
        { title: 'Intermaven Tech & Music', host: 'Intermaven Engineering', desc: 'Deep dives into decentralized compensation models and audio compression standards.', bg: 'linear-gradient(135deg, #8b5cf6 0%, #1e1b4b 100%)', emoji: '💻' },
        { title: 'African Soundscapes', host: 'Mercy Wangari', desc: 'High-fidelity field recordings and interviews with traditional instrument masters.', bg: 'linear-gradient(135deg, #f59e0b 0%, #1e1b4b 100%)', emoji: '🌍' },
        { title: 'Backstage Pass', host: 'Label Ops Network', desc: 'merch POS provisioning, live tickets setups, and regional settlement guides.', bg: 'linear-gradient(135deg, #3b82f6 0%, #1e1b4b 100%)', emoji: '🎟️' },
      ];

      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('Browse Podcasts', 'Library / Podcasts')}
          <p style={{ color: 'var(--mu)', fontSize: '14px', marginBottom: '24px' }}>Listen to tech talks, artist masterclasses, and field recordings from around the network.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {podcasts.map((pod, idx) => (
              <div key={idx} className="landing-feature-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '24px', borderRadius: '3px', transition: 'all 0.2s ease', cursor: 'pointer' }} onClick={() => alert(`Streaming podcast episode: ${pod.title}`)}>
                <div style={{ width: '60px', height: '60px', borderRadius: '3px', background: pod.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', marginBottom: '16px' }}>{pod.emoji}</div>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: '0 0 4px', fontWeight: '700', lineHeight: '1.3' }}>{pod.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', display: 'block', marginBottom: '12px' }}>By {pod.host}</span>
                <p style={{ fontSize: '12px', color: 'var(--mu)', margin: 0, lineHeight: '1.5' }}>{pod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

    const renderApps = () => {
      const appListing = [
        { title: 'TuneStream Mobile', desc: 'The consumer streaming client with high-fidelity FLAC audio and 8GB offline caching.', platforms: 'iOS & Android (Capacitor)', icon: Headphones, accent: '#10b981' },
        { title: 'Creator Companion', desc: 'Real-time metrics, split cascade ledger tracking, and instant payout status.', platforms: 'iOS & Android', icon: TrendingUp, accent: '#8b5cf6' },
        { title: 'TunePay POS', desc: 'Live event ticketing, point-of-sale merch tools, and geo-gated settlement rails.', platforms: 'iOS & Android tablet', icon: CreditCard, accent: '#0ea5e9' },
      ];

      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('TuneStreams Apps', 'Apps')}

          {/* Description Content Box */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>Ecosystem App Distribution</h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
              TuneStreams distributes native experiences across the shared Intermaven Network. Whether you are a listener caching music offline, an artist tracking split cascades, or a label managing merch sales, our apps keep your session and credits synchronized.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {appListing.map((ap, idx) => {
              const Icon = ap.icon;
              return (
                <div key={idx} className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                  <div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '3px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ap.accent, marginBottom: '16px' }}>
                      <Icon size={24} />
                    </div>
                    <span style={{ color: 'var(--mu)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.05em' }}>{ap.platforms}</span>
                    <h3 style={{ fontSize: '20px', color: '#fff', margin: '8px 0 12px', fontWeight: '800' }}>{ap.title}</h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '24px', lineHeight: '1.5' }}>{ap.desc}</p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`App Store listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '3px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none' }}
                    >
                      <Apple size={20} />
                      <div>
                        <div style={{ fontSize: '8px', opacity: 0.6 }}>Download on the</div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>App Store</div>
                      </div>
                    </button>
                    <button 
                      type="button" 
                      className="store-cta" 
                      onClick={() => alert(`Google Play listing for ${ap.title} coming in Phase 5+.`)}
                      style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '3px', color: '#fff', textAlign: 'left', width: '100%', outline: 'none' }}
                    >
                      <Download size={20} />
                      <div>
                        <div style={{ fontSize: '8px', opacity: 0.6 }}>Get it on</div>
                        <div style={{ fontSize: '11px', fontWeight: 'bold' }}>Google Play</div>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const renderFreePlan = () => {
      const handleRegisterFree = () => {
        alert('Free registration initiated! Please complete your sign up on the next screen.');
        navigate('/register');
      };

      return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          {renderHeader('TuneStream Free', 'Plans / Free')}
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(7, 14, 27, 0.5) 100%)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '8px', marginBottom: '40px' }}>
            <span style={{ color: 'var(--green)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.1em' }}>TuneStream Free</span>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>Music for everyone.</h2>
            <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>Play your favorite songs, create playlists, and explore independent African creators. Completely free, no credit card required.</p>
            <button onClick={handleRegisterFree} className="btn-primary" style={{ padding: '12px 32px', fontSize: '15px', border: 'none', cursor: 'pointer' }}>
              GET TUNESTREAM FREE
            </button>
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Why go with TuneStream Free?</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {[
              { title: 'Play your way', desc: 'Listen to any song, album, or playlist on demand. Find new tracks tailored to your taste.', icon: '🎵' },
              { title: 'Shared credit bonus', desc: 'Receive 150 shared Intermaven Network credits upon register, usable on any platform tools.', icon: '🪙' },
              { title: 'Create collections', desc: 'Build and share playlists of independent acts. Sync your crates across web and mobile.', icon: '🎧' },
              { title: 'Support independent creators', desc: 'Free streams still log plays in creator splits, backed by shared sponsorship pools.', icon: '🤝' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '3px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>{item.title}</h4>
                <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '3px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0 }}>
              Ad-supported listening. Data rates apply when streaming on mobile networks. Shared credits vault requires a verified email register. See <Link to="/help" style={{ color: 'var(--cyan)' }}>Help Center</Link> for credit policy details.
            </p>
          </div>
        </div>
      );
    };

    const renderPremiumPlan = () => {
      const handleGetPremium = () => {
        alert('Premium package selected! Proceeding to register / credits activation.');
        navigate('/register');
      };

      return (
        <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
          {renderHeader('TuneStream Premium', 'Plans / Premium')}
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.05) 0%, rgba(7, 14, 27, 0.5) 100%)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '8px', marginBottom: '40px' }}>
            <span style={{ color: 'var(--cyan)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', tracking: '0.1em' }}>TuneStream Premium</span>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', margin: '12px 0' }}>Go Premium. Stream without limits.</h2>
            <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>Ad-free listening, lossless FLAC quality, offline caching, and direct creator support. Pay-as-you-go using our credit system.</p>
            <button onClick={handleGetPremium} className="btn-primary" style={{ padding: '12px 32px', fontSize: '15px', background: 'var(--green)', border: 'none', cursor: 'pointer' }}>
              GET PREMIUM
            </button>
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Experience premium features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '50px' }}>
            {[
              { title: 'Zero Ads', desc: 'Stream your music without any audio or visual advertisements. Total focus on the tunes.', icon: '🚫' },
              { title: 'Lossless Studio Audio', desc: 'Enjoy high-fidelity 24-bit / 96kHz FLAC audio, preserving every detail from the mix studio.', icon: '🎚️' },
              { title: 'Offline Caching', desc: 'Save up to 8GB of music files directly to your mobile storage. Perfect for flights or remote zones.', icon: '📥' },
              { title: 'Direct Tipping', desc: 'Unlock mid-listen tipping. Your support enters the cascade split directly to creator wallets.', icon: '🪙' },
            ].map((item, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '3px', background: 'rgba(16,185,129,0.01)', border: '1px solid rgba(16,185,129,0.06)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '12px' }}>{item.icon}</span>
                <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px' }}>{item.title}</h4>
                <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>Choose your Premium option</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '50px' }}>
            {[
              { name: 'Individual', price: 'Deducts 1 credit / stream', desc: 'For single listeners. 1 active device offline caching. Lossless streaming.', buttonText: 'Get Individual' },
              { name: 'Duo', price: 'Deducts 1.8 credits / stream', desc: '2 Premium accounts. Shared playlist mix. 2 devices offline caching.', buttonText: 'Get Duo' },
              { name: 'Family', price: 'Deducts 2.5 credits / stream', desc: 'Up to 6 Premium accounts. Kids player portal. Family mix playlist.', buttonText: 'Get Family' },
            ].map((plan, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '28px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px' }}>{plan.name}</h4>
                  <span style={{ color: 'var(--cyan)', fontSize: '13px', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>{plan.price}</span>
                  <p style={{ color: 'var(--mu)', fontSize: '12px', margin: '0 0 20px', lineHeight: '1.5' }}>{plan.desc}</p>
                </div>
                <button onClick={handleGetPremium} className="btn-primary" style={{ padding: '10px', width: '100%', fontSize: '13px', background: 'transparent', border: '1px solid var(--green)', color: '#fff', cursor: 'pointer' }}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '3px' }}>
            <p style={{ color: 'var(--mu)', fontSize: '12px', margin: 0 }}>
              Premium consumption is billed directly to your shared Intermaven Network Credit balance. Credits are non-expiring. You can purchase credit top-up packages starting from $4.99 at any time in the <Link to="/pricing" style={{ color: 'var(--cyan)' }}>Pricing Panel</Link>.
            </p>
          </div>
        </div>
      );
    };

    const renderHelp = () => {
      const musicFaqs = [
        { q: "How are my TuneStream credits deducted?", a: "Credits are shared across the Intermaven network. For Premium accounts, standard listening deducts 1 credit per stream in Western regions and 0.1 credits in other regions. Tipping creators deducts credits equivalent to the tip amount." },
        { q: "How do I download music for offline listening?", a: "Long-press any album or playlist, then tap 'Download'. You can configure your local cache limit (up to 8GB) in the Player & Devices settings menu." },
        { q: "Does tipping really go directly to the artist?", a: "Yes. Mid-listen tips bypass traditional streaming distributors. They enter the Compensation Engine split cascade instantly, and funds are settled directly to creator wallets within 24 hours." },
        { q: "Can I use my account on multiple devices?", a: "Yes. Your shared credits vault, library, and settings sync automatically across web players and our native iOS/Android applications." }
      ];

      const forumTopics = [
        { title: "Audio Quality: FLAC vs. AAC on cellular data", replies: "24 replies", category: "General Discussion" },
        { title: "Tip jar suggestions for independent labels", replies: "15 replies", category: "Creator Support" },
        { title: "Off-grid performance in remote regions", replies: "38 replies", category: "Technical Help" }
      ];

      return (
        <div style={{ textAlign: 'left' }}>
          {renderHeader('Support & Community', 'Support')}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            {/* Help FAQs */}
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {musicFaqs.map((faq, idx) => (
                  <div key={idx} className="faq-item glass-panel" style={{ padding: '20px', borderRadius: '3px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>{faq.q}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.5', margin: 0 }}>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Forum & Blog */}
            <div>
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px' }}>Community Forum Discussions</h3>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '3px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {forumTopics.map((topic, idx) => (
                    <div key={idx} style={{ borderBottom: idx < forumTopics.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', paddingBottom: idx < forumTopics.length - 1 ? '12px' : 0 }}>
                      <span style={{ fontSize: '10px', color: 'var(--cyan)', textTransform: 'uppercase', fontWeight: 'bold' }}>{topic.category}</span>
                      <h4 style={{ fontSize: '13px', color: '#fff', margin: '4px 0', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => alert(`Opening topic: ${topic.title}`)}>{topic.title}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--mu)' }}>{topic.replies}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit a ticket */}
              <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: '800', marginBottom: '20px' }}>Submit a Support Ticket</h3>
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '3px' }}>
                <form onSubmit={(e) => { e.preventDefault(); alert('TuneStream support ticket submitted successfully!'); }}>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Subject</label>
                    <input type="text" placeholder="E.g. Offline download issue" className="form-control" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff' }} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Description</label>
                    <textarea rows="3" placeholder="Explain the problem..." className="form-control" style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', color: '#fff', resize: 'none' }} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', border: 'none', cursor: 'pointer', background: 'var(--green)' }}>
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    };

    const renderContent = () => {
      switch (view) {
        case 'explore':
          return renderExplore();
        case 'playlists':
          return renderPlaylists();
        case 'create-playlist':
          return renderCreatePlaylist();
        case 'browse-podcasts':
          return renderBrowsePodcasts();
        case 'apps':
          return renderApps();
        case 'free':
          return renderFreePlan();
        case 'premium':
          return renderPremiumPlan();
        case 'help':
          return renderHelp();
        case 'listen':
        default:
          return renderListen();
      }
    };

    return (
      <div 
        className="native-app-landing tunestream-landing" 
        style={{ background: getLandingBackground('tunestreams'), color: '#f1f5f9', minHeight: '100vh', padding: '60px 0 100px' }}
      >
        <div className="container">
          {renderContent()}
        </div>
      </div>
    );
  }

  // Fallback to default rendering for other native apps
  return (
    <div
      className="native-app-landing"
      style={{ '--app-accent': data.accent, '--app-accent-glow': data.accentGlow, background: getLandingBackground(normalizedSlug) }}
      data-testid={`native-app-landing-${data.slug}`}
    >
      {/* HERO CAROUSEL  -  same pattern as HomeView */}
      <div className="hw">
        <div className="bgs">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`bg ${currentSlide === idx ? 'on' : ''}`}
              style={{
                backgroundImage: `url(${HERO_IMAGE_MAP[s.bgKey] || listenHeroImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: currentSlide === idx
                  ? (titleHovered ? 'brightness(1.05) blur(0px)' : 'brightness(0.7) blur(1.5px)')
                  : 'none',
                transform: currentSlide === idx && titleHovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'filter 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            />
          ))}
          <div
            className="bgo"
            style={{
              opacity: titleHovered ? 0.3 : 0.8,
              transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          />
        </div>

        <div className="hs">

          <div
            className="hcont"
            key={currentSlide}
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`he hbadge ${slideState}`}>
              <span
                className="bdot"
                style={{
                  background: currentSlideData.dot,
                  animation: 'pulseGlow 2s infinite',
                }}
              />
              <span>{data.target} · {currentSlideData.badge}</span>
            </div>

            <h1 className="ht htitle">
              <span className={`ht-line ht-line-1 ${slideState}`}>{currentSlideData.hLine1}</span>
              <span
                className={`ht-line ht-line-2 ${slideState}`}
                style={{ color: currentSlideData.hLine2Color }}
              >
                {currentSlideData.hLine2}
              </span>
            </h1>

            <p className={`hp hsub ${slideState}`}>
              {currentSlideData.s}
            </p>

            <div className={`hb hbtns ${slideState}`}>
              {renderHeroCta(currentSlideData, 'b1')}
              {renderHeroCta(currentSlideData, 'b2')}
            </div>
          </div>
        </div>

        <div className={`sui-arrows ${slideState}`}>
          <button type="button" className="slide-nav prev" onClick={goToPrevSlide} aria-label="Previous slide" data-testid="landing-hero-prev">‹</button>
          <button type="button" className="slide-nav next" onClick={goToNextSlide} aria-label="Next slide" data-testid="landing-hero-next">›</button>
        </div>

        <div className={`sui-bottom ${slideState}`}>
          <div className="spr">
            <div className="spb" style={{ width: `${progress}%` }} />
          </div>
          <div className="sdots">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`sd ${index === currentSlide ? 'on' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`landing-hero-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* APP AT A GLANCE  -  1/4 logo column + 3/4 content column */}
      <section className="landing-section landing-glance-section">
        <div className="container landing-glance">
          <div className="landing-glance-logo" aria-hidden="true">
            <div className="landing-app-tile">
              <div className="landing-app-tile-icon">{HeroIcon && <HeroIcon size={48} />}</div>
              <div className="landing-app-tile-label">{data.name}</div>
              <div className="landing-app-tile-pill">{data.target}</div>
            </div>
          </div>
          <div className="landing-glance-text">
            <span className="landing-section-eyebrow">{data.target}</span>
            <h2 className="landing-section-title" style={{ marginBottom: '20px' }}>{data.name}</h2>
            <p className="landing-lede" style={{ maxWidth: 'none', marginBottom: '24px' }}>{data.lede}</p>
            <div className="landing-cross-links">
              <Link to={data.webEquivalent.to} className="landing-cross-link" data-testid="landing-web-link">
                <ExternalLink size={13} /> {data.webEquivalent.label}
              </Link>
              <Link to={data.adminLink.to} className="landing-cross-link" data-testid="landing-admin-link">
                <Settings size={13} /> {data.adminLink.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section landing-section-alt">
        <div className="container">
          <span className="landing-section-eyebrow">Capabilities</span>
          <h2 className="landing-section-title">Everything {data.target.toLowerCase().replace('for ', '')} actually need</h2>
          <div className="landing-features-grid">
            {data.features.map((f, i) => (
              <div key={i} className="landing-feature-card" data-testid={`landing-feature-${i}`}>
                <div className="landing-feature-num">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section">
        <div className="container">
          <span className="landing-section-eyebrow">How it works</span>
          <h2 className="landing-section-title">Four steps from sign-in to settlement</h2>
          <div className="landing-steps">
            {data.howItWorks.map((s, i) => (
              <div key={i} className="landing-step">
                <div className="landing-step-num">{s.step}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="landing-section landing-section-alt">
        <div className="container">
          <span className="landing-section-eyebrow">In the field</span>
          <h2 className="landing-section-title">What people say</h2>
          <div className="landing-testimonials">
            {data.testimonials.map((t, i) => (
              <blockquote key={i} className="landing-testimonial" data-testid={`landing-testimonial-${i}`}>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section">
        <div className="container">
          <span className="landing-section-eyebrow">FAQ</span>
          <h2 className="landing-section-title">Common questions</h2>
          <div className="landing-faq">
            {data.faq.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* CLOSE CTA */}
      <section className="landing-section landing-cta-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="landing-section-eyebrow">Get it</span>
          <h2 className="landing-section-title" style={{ margin: '0 auto 12px' }}>{data.heroSlides[0].hLine1} {data.heroSlides[0].hLine2}</h2>
          <p className="landing-pricing-line">{data.pricingLine}</p>
          <div className="landing-hero-ctas" style={{ justifyContent: 'center', marginTop: '24px' }}>
            <button
              type="button"
              className="store-cta landing-cta"
              onClick={() => alert(`App Store listing for ${data.name} coming in Phase 5+`)}
              data-testid="landing-close-appstore"
            >
              <div className="store-cta-icon"><Apple size={22} /></div>
              <div className="store-cta-text">
                <span className="store-cta-sub">Download on the</span>
                <span className="store-cta-label">App Store</span>
              </div>
            </button>
            <button
              type="button"
              className="store-cta landing-cta"
              onClick={() => alert(`Google Play listing for ${data.name} coming in Phase 5+`)}
              data-testid="landing-close-googleplay"
            >
              <div className="store-cta-icon"><Download size={22} /></div>
              <div className="store-cta-text">
                <span className="store-cta-sub">Get it on</span>
                <span className="store-cta-label">Google Play</span>
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ================= Native Apps View (3 flagship mobile apps) =================
// TuneMavens Consumer App · Creator Companion App · M-Pesa POS App.
// App definitions live in src/lib/nativeApps.js so the dashboard App
// Marketplace can render the same exact entries inside its "Native Apps" tab.
function NativeAppsView() {
  const apps = INTERMAVEN_NATIVE_APPS;

  const StoreButton = ({ kind, label, sublabel }) => (
    <button
      type="button"
      className="store-cta"
      onClick={() => alert(`${label} listing for the ${kind} build coming soon.`)}
      data-testid={`store-cta-${kind}`}
    >
      <div className="store-cta-icon">
        {kind === 'ios' ? <Apple size={22} /> : <Download size={22} />}
      </div>
      <div className="store-cta-text">
        <span className="store-cta-sub">{sublabel}</span>
        <span className="store-cta-label">{label}</span>
      </div>
    </button>
  );

  return (
    <>
      <PageHeader
        title="Native Apps"
        bgImage={headerAppsImg}
        bgImageWestern={headerAppsWesternImg}
        breadcrumb="Native Apps"
      />
      <div className="container" style={{ paddingBottom: '96px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '12px', maxWidth: '720px', margin: '0 auto 8px' }}>
          Three flagship native experiences. One shared TuneMavens / Intermaven account.
        </p>
        <p style={{ textAlign: 'center', color: 'var(--mu)', fontSize: '12px', marginBottom: '56px', maxWidth: '640px', margin: '0 auto 56px' }}>
          Sign in once on the web and every native app picks up your same session, credits, and split ledger  -  no separate accounts to juggle.
        </p>

        <div className="native-apps-grid" data-testid="native-apps-grid">
          {apps.map((a) => {
            const Icon = a.icon;
            return (
              <article
                key={a.id}
                className="native-app-card glass-panel"
                style={{ '--app-accent': a.accent, '--app-accent-glow': a.accentGlow }}
                data-testid={`native-app-card-${a.id}`}
              >
                <div className="native-app-card-header">
                  <div className="native-app-icon" aria-hidden="true">
                    <Icon size={26} />
                  </div>
                  <div>
                    <span className="native-app-target">{a.target}</span>
                    <h3 className="native-app-name">{a.name}</h3>
                  </div>
                </div>

                <p className="native-app-tagline">{a.tagline}</p>
                <p className="native-app-desc">{a.desc}</p>

                <ul className="native-app-features">
                  {a.features.map((f, k) => (
                    <li key={k}><Check size={13} /> {f}</li>
                  ))}
                </ul>

                <div className="native-app-store-row">
                  <StoreButton kind="ios" label="App Store" sublabel="Download on the" />
                  <StoreButton kind="android" label="Google Play" sublabel="Get it on" />
                </div>

                <Link
                  to={a.landingPath}
                  className="native-app-more-info"
                  data-testid={`native-app-more-info-${a.id}`}
                >
                  More info <ArrowRight size={14} />
                </Link>

                <div className="native-app-meta">
                  <span className="native-app-meta-pill">
                    <Smartphone size={11} /> Capacitor-wrapped · iOS &amp; Android
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', marginTop: '56px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Phase 5+ rollout · See <Link to="/help" style={{ color: 'var(--cyan)' }}>release roadmap</Link>
        </p>
      </div>
    </>
  );
}

// ================= Dashboard Apps View =================
function AppsView({ sessionUser }) {
  const [activeApp, setActiveApp] = useState(null); // null, 'tracker', 'hosting', 'ledger', 'pos'
  const { country } = useRegion();

  const isEastAfrica = ['KE', 'UG', 'TZ'].includes(country);
  const posName = country === 'KE' ? 'M-Pesa POS Terminal' 
                 : (country === 'NG' ? 'Flutterwave POS Terminal' 
                 : (isEastAfrica ? 'Mobile Money POS Terminal' : 'Stripe POS Terminal'));
                 
  const posDesc = isEastAfrica 
    ? 'Collect on-site merchant card, cardless, and mobile money payments during venues and tours.'
    : 'Collect on-site merchant card, contactless, and digital wallet payments during venues and tours.';

  const apps = [
    { id: 'tracker', name: 'Distribution Tracker', icon: Activity, desc: 'Monitor ingest status and scheduled releases across Spotify, Apple, and Amazon Music.', live: true },
    { id: 'hosting', name: 'Hosting Manager', icon: Globe, desc: 'Register custom domain names, configure DNS zone settings, and deploy modular web containers.', live: true },
    { id: 'ledger', name: 'Split Cascade Ledger', icon: Layers, desc: 'Configure collaborators splits, load bulk statement spreadsheets, and automate payout accounting.', live: true },
    { id: 'pos', name: posName, icon: Zap, desc: posDesc, live: true },
  ];

  if (activeApp === 'pos') {
    return (
      <>
        <PageHeader title={posName} bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="POS Terminal" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <MpesaPosTerminal goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  if (activeApp === 'ledger') {
    return (
      <>
        <PageHeader title="Split Cascade Ledger" bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="Ledger App" />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <SplitCascadeLedgerApp goBack={() => setActiveApp(null)} />
        </div>
      </>
    );
  }

  if (activeApp === 'tracker' || activeApp === 'hosting') {
    const appName = apps.find(a => a.id === activeApp)?.name || 'Application';
    return (
      <>
        <PageHeader title={appName} bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb={appName} />
        <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
          <ComingSoonApp name={appName} goBack={() => setActiveApp(null)} sessionUser={sessionUser} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Standalone Apps Pool" bgImage={headerAppsImg} bgImageWestern={headerAppsWesternImg} breadcrumb="Dashboard Apps" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Integrated dashboard managers that communicate directly with your unified Intermaven profile and credits vault.
        </p>
        <div className="apps-grid">
          {apps.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div 
                key={idx} 
                className="app-card glass-panel glass-panel-hover"
                onClick={() => setActiveApp(a.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="app-icon-box" style={{ background: 'rgba(139, 92, 246, 0.08)', color: 'var(--purple)' }}>
                  <Icon size={20} />
                </div>
                <h3 className="app-title">{a.name}</h3>
                <p className="app-desc">{a.desc}</p>
                <span className="app-tag" style={{ color: 'var(--gr)' }}>● Live App</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ================= Pricing View =================
function PricingView() {
  const { formatPrice } = useRegion();

  return (
    <>
      <PageHeader title="Unified Credit Packages" bgImage={headerPricingImg} bgImageWestern={headerPricingWesternImg} breadcrumb="Pricing" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Load credits as you need them. All credits are non-expiring and shared across the Intermaven network (tunemavens.com, watchtube.tv, intermaven.io). No subscriptions required.
        </p>
        <div className="pricing-grid">
          {/* Tier 1 */}
          <div className="pricing-card glass-panel">
            <h3 className="plan-name">Free Starter</h3>
            <div className="plan-price">{formatPrice(0)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>150 Free Signup Credits to test standard audio and sync tools.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> 150 Free Signup Credits</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Standard sync brief generation</li>
              <li className="plan-feature-item"><Check size={12} color="var(--mu2)" /> No custom domain setup</li>
              <li className="plan-feature-item"><Check size={12} color="var(--mu2)" /> Standard soundwave mastering</li>
            </ul>
            <button className="plan-btn outline">Start Free</button>
          </div>

          {/* Tier 2 */}
          <div className="pricing-card glass-panel premium">
            <span className="pricing-badge">Recommended</span>
            <h3 className="plan-name">Creator Package</h3>
            <div className="plan-price">{formatPrice(29)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>1,200 Non-Expiring Credits. Pay-as-you-go, shared across network.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> 1,200 Unified Network Credits</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Custom domain & container mapping</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> High-speed AI mastering engine</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Escrow contract protection</li>
            </ul>
            <button className="plan-btn cyan">Buy Creator Package</button>
          </div>

          {/* Tier 3 */}
          <div className="pricing-card glass-panel">
            <h3 className="plan-name">Label Bulk Package</h3>
            <div className="plan-price">{formatPrice(149)}<span>/one-time</span></div>
            <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px' }}>10,000 Non-Expiring Credits. Bulk pool for multi-artist catalogs.</p>
            <ul className="plan-features">
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> 10,000 Unified Network Credits</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Split Cascade ledger engines</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Multi-app dashboard sharing</li>
              <li className="plan-feature-item check"><Check size={12} color="var(--cyan)" /> Priority catalog curation support</li>
            </ul>
            <button className="plan-btn outline">Buy Label Package</button>
          </div>
        </div>
      </div>
    </>
  )
}


// ================= Role landing (/for/:role)  -  placeholder =================
// Phase 2.5 (Identity & Roles) will replace this with hand-crafted marketing
// pages per role. For now, we resolve the role from the URL against the
// Perfect For catalogue and render a minimal hero so the sidebar links
// don't 404 and the routing/graph is testable end-to-end.
function RoleLandingView() {
  const { role } = useParams();
  const meta = PERFECT_FOR_ROLES.find(r => r.key === role);

  if (!meta) {
    return (
      <div className="landing-section landing-section-alt" data-testid="role-landing-not-found">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <span className="landing-section-eyebrow">Not found</span>
          <h1 className="landing-section-title" style={{ marginTop: 12 }}>
            We don't have a landing page for "{role}" yet.
          </h1>
          <p className="landing-lede" style={{ margin: '16px auto 24px', maxWidth: 560 }}>
            Pick a role from the "Perfect for" sidebar to see what TuneMavens
            looks like from that seat.
          </p>
          <Link to="/" className="btn btn-primary" data-testid="role-landing-home-link">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { label, sub, accent } = meta;

  const BACKGROUNDS = {
    creator: creatorDashboardImg,
    exec: distributeHeroImg,
    supervisor: userSupervisorImg,
    consumer: consumerAppImg,
    'booking-agent': appsLedgerImg,
    manager: userManagerImg,
    companion: appsSyncImg,
  };

  const bgImage = BACKGROUNDS[role] || listenHeroImg;

  return (
    <div className="role-landing-wrap hw" data-testid={`role-landing-${role}`} style={{ position: 'relative', overflow: 'hidden', background: getRoleLandingBackground(role) }}>
      <div className="bgs">
        <div 
          className="bg on"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6) blur(1.5px)',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        <div className="bgo" style={{ opacity: 0.6 }} />
      </div>

      <div className="hs">
        <div className="hcont">
          <div className="he hbadge" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <span className="bdot" style={{ background: accent }} />
            <span>Perfect for {label}</span>
          </div>

          <h1 className="ht htitle">
            <span className="ht-line ht-line-1">TuneMavens for</span>
            <span className="ht-line ht-line-2" style={{ color: accent }}>{label}</span>
          </h1>

          <p className="hp hsub">
            {sub}
          </p>

          <div className="hb hbtns">
            <Link to="/register" className="hbp">
              Create Free Account
            </Link>
            <Link to="/apps" className="hbg">
              Browse App Catalogue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// ================= Perfect For Page View =================
function PerfectForPageView() {
  const [previewImage, setPreviewImage] = useState(null);

  const metaRoles = [
    {
      key: 'creator',
      label: 'Creators',
      sub: 'Artists · Podcasters · DJs',
      href: '/for/creator',
      logo: ROLE_LOGOS['creator'],
      accent: 'var(--cyan)',
      desc: 'Designed for artists, DJs, and podcasters. Effortlessly calculate split sheets, manage your music library, and pitch your tracks to filmmakers and sync agents - all from one single console.',
      preview: creatorDashboardImg
    },
    {
      key: 'exec',
      label: 'Execs',
      sub: 'Label · A&R · Industry',
      href: '/for/exec',
      logo: ROLE_LOGOS['exec'],
      accent: 'var(--purple)',
      desc: 'For record labels, A&R managers, and industry leaders. Manage your entire artist catalog, track royalty splits, ingest statement CSV files, and automate payouts to artists and managers.',
      preview: distributeHeroImg
    },
    {
      key: 'supervisor',
      label: 'Music Supervisors',
      sub: 'Sync licensing for film & TV',
      href: '/for/supervisor',
      logo: ROLE_LOGOS['supervisor'],
      accent: 'var(--am)',
      desc: 'Sync licensing and AI scene-tagging made simple. Search our curated catalog of watermarked tracks, find the perfect vibe for your film or TV project, and secure sync rights instantly.',
      preview: appsSyncImg
    },
    {
      key: 'consumer',
      label: 'tunestreams',
      sub: 'Everyday listeners',
      href: '/native-apps/tunestreams',
      logo: ROLE_LOGOS['consumer'],
      accent: '#10b981',
      desc: 'Our consumer streaming app. Listen to your favorite tracks, support creators directly with direct-tipping, and sync your music collection offline across all your mobile devices.',
      preview: consumerAppImg
    },
    {
      key: 'booking-agent',
      label: 'Booking Agents',
      sub: 'Book & represent live acts',
      href: '/for/booking-agent',
      logo: ROLE_LOGOS['booking-agent'],
      accent: 'var(--blue)',
      desc: 'Represent and book your live acts. Route gig contracts, coordinate agent commission payouts, and view tour routing maps all integrated with local payment rails.',
      preview: appsLedgerImg
    },
    {
      key: 'manager',
      label: 'Managers',
      sub: 'Day-to-day artist teams',
      href: '/for/manager',
      logo: ROLE_LOGOS['manager'],
      accent: '#ef4444',
      desc: 'Manage the day-to-day operations of your artist roster. Real-time split visibility, contract drafting tools, and automated payouts to keep your management business running smoothly.',
      preview: userManagerImg
    },
    {
      key: 'companion',
      label: 'tunecompanion',
      sub: 'Artists & Managers',
      href: '/native-apps/creator-companion',
      logo: ROLE_LOGOS['companion'],
      accent: 'var(--purple)',
      desc: 'The essential mobile companion app for artists and managers. Monitor splits on the fly, track live earnings, and receive real-time sync brief alerts right on your phone.',
      preview: appsSyncImg
    }
  ];

  return (
    <>
      <PageHeader 
        title="Perfect For Every Seat in the Industry" 
        bgImage={perfectForHeaderImg} 
        bgImageWestern={perfectForHeaderImg} 
        breadcrumb="Perfect For" 
      />
      <div className="container" style={{ padding: '60px 20px 80px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '60px', maxWidth: '700px', margin: '0 auto 60px', fontSize: '16px', color: 'var(--mu)', lineHeight: 1.6 }}>
          TuneMavens coordinates the entire music ecosystem. Choose your role below to explore the custom dashboard and tools we build for your seat.
        </p>

        <div className="pf-grid-page">
          {metaRoles.map((role) => (
            <div key={role.key} className="pf-card-page glass-panel" style={{ '--pf-accent': role.accent }}>
              <div className="pf-card-logo-container">
                <img src={role.logo} alt={role.label} className="pf-card-logo-img" />
              </div>
              <h3 className="pf-card-title">{role.label}</h3>
              <span className="pf-card-eyebrow" style={{ color: role.accent }}>{role.sub}</span>
              <p className="pf-card-desc">{role.desc}</p>
              
              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to={role.href} className="btn pf-card-cta" style={{ '--pf-accent': role.accent }}>
                  Explore Seat
                </Link>
                <button 
                  onClick={() => setPreviewImage(role.preview)} 
                  className="btn pf-card-cta outline"
                  style={{ '--pf-accent': role.accent, cursor: 'pointer', background: 'transparent' }}
                >
                  Dash Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewImage && (
        <div className="pf-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="pf-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="pf-modal-close" onClick={() => setPreviewImage(null)}>×</button>
            <img src={previewImage} alt="Dashboard Preview" className="pf-modal-img" />
          </div>
        </div>
      )}
    </>
  );
}




// ================= About & Contact View =================
function AboutView() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <>
      <PageHeader title="Bridging Music & High Tech" bgImage={headerAboutImg} bgImageWestern={headerAboutWesternImg} breadcrumb="About Us" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          TuneMavens was founded to build modern technology infrastructure for independent global artists, record labels, and publishers.
        </p>

      <div className="arch-card glass-panel" style={{ marginBottom: '80px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>Consolidating Creative Workflows</h3>
          <p style={{ fontSize: '14px', color: 'var(--mu)', lineHeight: '1.6', marginBottom: '24px' }}>
            All operations are designed to be seamless. In partnership with Intermaven.io, TuneMavens connects your payment records, custom domains, and AI tasks to a single, secure central profile database, avoiding the hassle of managing disjointed web tools.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="var(--cyan)" /> Shared M-Pesa & Stripe checkout integrations</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="var(--cyan)" /> Automatic EPK sync to public DNS records</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={14} color="var(--cyan)" /> Instant cross-subdomain authentication</li>
          </ul>
        </div>
        <div className="arch-visual">
          <div className="arch-node active">
            <div className="arch-node-icon"><Lock size={18} /></div>
            <div className="arch-node-info">
              <h4 className="arch-node-title">Secure Subdomain Auth</h4>
              <p className="arch-node-desc">Unified JWT session tokens shared across all portal environments.</p>
            </div>
          </div>
          <div className="arch-node">
            <div className="arch-node-icon"><Database size={18} /></div>
            <div className="arch-node-info">
              <h4 className="arch-node-title">Consolidated Database</h4>
              <p className="arch-node-desc">Profiles and notification registries remain synchronized in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <span className="section-label">Contact Us</span>
        <h2 className="section-title">Send a Message</h2>
      </div>

      <div className="contact-card glass-panel">
        {submitted ? (
          <div className="text-center" style={{ padding: '20px 0' }}>
            <Check size={48} color="var(--cyan)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Thank you!</h3>
            <p style={{ fontSize: '14px', color: 'var(--mu)' }}>We have received your message and will respond shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="form-control" 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                rows="4" 
                placeholder="Enter your message details..." 
                className="form-control" 
                style={{ resize: 'none' }}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  </>
);
}

// ================= Help Center & FAQ View =================
function HelpView() {
  const faqs = [
    { q: "How do credit deductions work?", a: "Credits are shared. Buying a package grants credits that can be spent on TuneMavens tools (like mastering or sync briefing) and Intermaven apps." },
    { q: "Can I use my own custom domain name?", a: "Yes. Using the Hosting Manager app, you can search, register, and link custom domains to your EPK and artist websites." },
    { q: "How do Split Cascade ledgers process payments?", a: "After uploading your statement CSV file and defining splits, the engine calculates the net payout for each collaborator and transfers it using your linked Stripe or M-Pesa merchant account." },
    { q: "Is registration free?", a: "Yes. Signing up grants 150 free starter credits to test out standard tools." }
  ];

  return (
    <>
      <PageHeader title="Frequently Asked Questions" bgImage={headerHelpImg} bgImageWestern={headerHelpWesternImg} breadcrumb="Help Desk" />
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto 60px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--tx)' }}>{faq.q}</h4>
              <p style={{ fontSize: '13px', color: 'var(--mu)', lineHeight: '1.6' }}>{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="section-header" style={{ marginBottom: '40px' }}>
          <span className="section-label">Support Ticket</span>
          <h2 className="section-title">Submit a Ticket</h2>
        </div>

        <div className="contact-card glass-panel">
          <form onSubmit={(e) => { e.preventDefault(); alert('Support ticket logged successfully!'); }}>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input type="text" placeholder="E.g. Domain mapping assistance" className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea rows="4" placeholder="Explain the problem in detail..." className="form-control" style={{ resize: 'none' }} required></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="name@example.com" className="form-control" required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Submit Ticket
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

// ================= Auth Views =================
function LoginView({ onLogin }) {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    // Phase 1 leaves Google SSO as a stub. Cross-portal Google login is wired
    // through intermaven.io's `/api/sso` bridge in a follow-up task.
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      onLogin({
        email: 'googleuser@tunemavens.com',
        name: 'Aisha Okoro',
        role: 'creator',
        credits: 600,
        plan: 'creator',
        brand_name: 'Okoro Sounds',
        country: 'KE'
      });
      navigate('/dashboard');
    }, 1200);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    // Sandbox mode: skip real authentication. Any email/password is accepted
    // and a local session is created. Real auth re-enables in a later phase.
    try {
      // Best-effort backend call so a Mongo user is created if it doesn't
      // already exist, but a failure does NOT block sandbox login.
      try {
        const { user, access_token } = await authApi.login({ email: emailVal, password: passwordVal });
        tokenStore.set(access_token);
        onLogin(user);
      } catch {
        try {
          const { user, access_token } = await authApi.register({
            email: emailVal,
            password: passwordVal && passwordVal.length >= 8 ? passwordVal : passwordVal + 'xxxxxxxx',
            name: (emailVal.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase()),
            role: 'creator',
          });
          tokenStore.set(access_token);
          onLogin(user);
        } catch {
          // Final fallback: pure client-side stub session.
          const stubName = (emailVal.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase());
          onLogin({
            email: emailVal || 'sandbox@tunemavens.com',
            name: stubName,
            role: 'creator',
            credits: 600,
            plan: 'creator',
            brand_name: `${stubName} Music`,
            country: 'KE',
          });
        }
      }
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="container view-padding" 
      style={{ display: 'flex', justifyContent: 'center', minHeight: '70vh', alignItems: 'center', cursor: 'pointer' }}
      onClick={handleBackdropClick}
    >
      <div className="auth-modal-card" style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
        </div>
        <div className="auth-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 4px', color: '#fff', textAlign: 'center' }}>Log In to TuneMavens</h3>
          <p style={{ fontSize: '12px', color: 'var(--mu)', textAlign: 'center', margin: 0 }}>Access your unified creator profile</p>
        </div>

        {/* Google SSO */}
        <button 
          onClick={handleGoogleLogin} 
          className="google-sso-btn" 
          disabled={googleLoading}
        >
          {googleLoading ? (
            <>
              <RefreshCw size={14} className="spin-animation" />
              Connecting to Google...
            </>
          ) : (
            <>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
              Continue with Google
            </>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '11px', color: 'var(--mu)' }}>or login with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <form onSubmit={handleEmailSubmit}>
          <div className="form-group" style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={emailVal} 
              onChange={(e) => setEmailVal(e.target.value)} 
              className="form-control" 
              style={{ fontSize: '13px', padding: '8px 12px' }} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordVal}
              onChange={(e) => setPasswordVal(e.target.value)}
              className="form-control"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              required
              data-testid="login-password-input"
            />
          </div>
          {errorMsg && (
            <p data-testid="login-error" style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '12px' }}>{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}
            data-testid="login-submit-button"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <p style={{ fontSize: '12px', color: 'var(--mu)', marginTop: '16px', textAlign: 'center', margin: '16px 0 0' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

// ================= Consumer Streaming Platform View =================
function StreamView() {
  const { country, currencyInfo, formatPrice } = useRegion();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(12); // start at 12s
  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayerProgress(prev => (prev >= 180 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isWestern = ['US', 'GB'].includes(country);

  return (
    <>
      <PageHeader 
        title="TuneMavens Stream" 
        bgImage={headerHelpImg} 
        bgImageWestern={headerHelpWesternImg} 
        breadcrumb="Stream & Listen" 
      />
      
      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px' }}>
        <p className="section-desc" style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          Welcome to the next-generation consumer music app. Stream ad-free, download high-quality files, and support creators directly using your shared credits vault.
        </p>

        {/* Web ⇄ native parity banner  -  link to the TuneMavens landing page for app store CTAs */}
        <div className="stream-app-banner" data-testid="stream-app-banner">
          <div className="stream-app-banner-text">
            <span className="stream-app-banner-eyebrow">Prefer mobile?</span>
            <span className="stream-app-banner-title">This is the web build of the TuneStreams listener app.</span>
            <span className="stream-app-banner-sub">Same library, same tips, same account  -  just sized for your pocket.</span>
          </div>
          <Link to="/native-apps/tunestreams" className="stream-app-banner-cta" data-testid="stream-app-banner-cta">
            <Smartphone size={14} /> Get the native app
          </Link>
        </div>

        {/* Dynamic Music Player Widget Mockup */}
        <div className="arch-card glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center', maxWidth: '850px', margin: '0 auto 60px', padding: '30px' }}>
          
          {/* Cover Art Visual */}
          <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 100%)', borderRadius: 'var(--r)', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', padding: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '64px', marginBottom: '12px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>💿</span>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>Midnight Cruise</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Alex Rivera</p>
            </div>
            {isPlaying && (
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '16px' }}>
                {[1, 2, 3, 4, 5].map(bar => (
                  <div 
                    key={bar} 
                    style={{ 
                      width: '3px', 
                      background: 'var(--cyan)', 
                      borderRadius: '1px',
                      animation: `bounce 1s ease-in-out infinite alternate`,
                      animationDelay: `${bar * 0.15}s`,
                      height: '100%'
                    }} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Player controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div>
              <span className="app-tag" style={{ color: 'var(--cyan)', background: 'rgba(34,211,238,0.08)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Lossless FLAC • 24-bit / 96kHz
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginTop: '10px', marginBottom: '4px' }}>Midnight Cruise</h2>
              <p style={{ fontSize: '13px', color: 'var(--mu)', margin: 0 }}>Alex Rivera • Afrobeat Mix</p>
            </div>

            {/* Slider bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--mu)', marginBottom: '6px' }}>
                <span>{formatTime(playerProgress)}</span>
                <span>3:00</span>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', position: 'relative', cursor: 'pointer' }} onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                setPlayerProgress(Math.floor(percentage * 180));
              }}>
                <div style={{ width: `${(playerProgress / 180) * 100}%`, height: '100%', background: 'var(--cyan)', borderRadius: '2px', boxShadow: '0 0 6px var(--cyan)' }} />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary"
                style={{ width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', outline: 'none' }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                  {isPlaying ? 'Now Streaming Lossless' : 'Stream Preview'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--mu)' }}>
                  {isWestern ? '1 credit per full listen' : '0.1 credits per listen'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Value Proposition Cards */}
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h2 className="section-title">Why Stream on TuneMavens?</h2>
          <p className="section-desc">Designed to solve streaming royalty inequalities for creators while delivering premium listening features.</p>
        </div>

        <div className="apps-grid" style={{ marginBottom: '60px' }}>
          
          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(34,211,238,0.08)', color: 'var(--cyan)' }}>🎛️</div>
            <h3 className="app-title">Lossless Studio Masters</h3>
            <p className="app-desc">Stream direct 24-bit FLAC audio. No lossy compression, no degraded soundstages. Experience music the way the producer intended.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)' }}>🛡️</div>
            <h3 className="app-title">100% Ad-Free Experience</h3>
            <p className="app-desc">Zero audio ads, zero pop-up banners. We protect your attention. Your subscription credits route payments entirely to songs you play.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(139,92,246,0.08)', color: 'var(--purple)' }}>🤝</div>
            <h3 className="app-title">Direct Creator Support</h3>
            <p className="app-desc">TuneMavens routes 90% of listen credits straight to the artist's wallet. Zero middleman distribution delays, direct payments via M-Pesa or Stripe.</p>
          </div>

          <div className="app-card glass-panel">
            <div className="app-icon-box" style={{ background: 'rgba(245,158,11,0.08)', color: 'var(--orange)' }}>🛍️</div>
            <h3 className="app-title">Linked Artist Stores</h3>
            <p className="app-desc">Buy downloads, exclusive vinyl, digital stems, and merch directly inside the player console. One unified credits vault across all platforms.</p>
          </div>

        </div>

        {/* CTA Onboard Area */}
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--r)', maxWidth: '700px', margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>Start Listening Today</h3>
          <p style={{ fontSize: '13px', color: 'var(--mu)', marginBottom: '24px' }}>
            Register as a Consumer to configure your genre settings and follow your first creators. Sign up grants 150 free credits!
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register?role=consumer')} className="btn-primary" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
              Create Listener Account
            </button>
            <button onClick={() => navigate('/register')} className="plan-btn outline" style={{ padding: '12px 24px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
              Select Other Role
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

function RegisterView({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  const roleLabels = {
    consumer: 'Consumer',
    creator: 'Creator',
    label: 'Record Label',
    dj: 'DJ',
    studio: 'Music Supervisor',
    corporate: 'Corporate',
    media: 'Media House',
  };

  const safeParse = (str, fallback) => {
    try {
      return str ? JSON.parse(str) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const safeParseArray = (str, fallback = []) => {
    try {
      const parsed = str ? JSON.parse(str) : fallback;
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };
  
  // Load initial state from sessionStorage for memory retention
  const [roles, setRoles] = useState(() => {
    const saved = sessionStorage.getItem('signup_roles');
    if (saved) {
      const parsed = safeParseArray(saved, null);
      if (parsed) return parsed;
    }
    const legacy = sessionStorage.getItem('signup_role');
    return legacy ? [legacy] : [];
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState(() => sessionStorage.getItem('signup_name') || '');
  const [email, setEmail] = useState(() => sessionStorage.getItem('signup_email') || '');
  const [password, setPassword] = useState(() => sessionStorage.getItem('signup_password') || '');
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem('signup_step');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [isAiMode, setIsAiMode] = useState(() => sessionStorage.getItem('signup_is_ai') === 'true');
  const [aiStep, setAiStep] = useState(() => {
    const saved = sessionStorage.getItem('signup_ai_step');
    return saved !== null ? parseInt(saved) : 0;
  });
  const [chatLog, setChatLog] = useState(() => {
    const saved = sessionStorage.getItem('signup_chat_log');
    const parsed = safeParseArray(saved, null);
    if (parsed) return parsed;
    return [
      { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
    ];
  });

  // Google Sign-up State
  const [googleLoading, setGoogleLoading] = useState(false);

  // Catalog Porting States
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success'
  const [syncPlatform, setSyncPlatform] = useState('');
  const [syncedCount, setSyncedCount] = useState(0);

  // Detailed dynamic states for the 7 onboarding wizards
  const [genres, setGenres] = useState(() => safeParseArray(sessionStorage.getItem('signup_genres'), []));
  const [followedCreators, setFollowedCreators] = useState(() => safeParseArray(sessionStorage.getItem('signup_followed_creators'), []));
  const [selectedPricing, setSelectedPricing] = useState(() => sessionStorage.getItem('signup_selected_pricing') || 'free');
  const [creativeType, setCreativeType] = useState(() => sessionStorage.getItem('signup_creative_type') || 'Artist');
  const [payoutWallet, setPayoutWallet] = useState(() => sessionStorage.getItem('signup_payout_wallet') || '');
  const [biography, setBiography] = useState(() => sessionStorage.getItem('signup_biography') || '');
  const [contractSigned, setContractSigned] = useState(() => sessionStorage.getItem('signup_contract_signed') === 'true');
  const [labelName, setLabelName] = useState(() => sessionStorage.getItem('signup_label_name') || '');
  const [labelHq, setLabelHq] = useState(() => sessionStorage.getItem('signup_label_hq') || 'Nairobi, Kenya');
  const [defaultSplitSlider, setDefaultSplitSlider] = useState(() => parseInt(sessionStorage.getItem('signup_default_split_slider') || '50'));
  const [djStyle, setDjStyle] = useState(() => sessionStorage.getItem('signup_dj_style') || 'Afro-House');
  const [syncBriefQuery, setSyncBriefQuery] = useState(() => sessionStorage.getItem('signup_sync_brief_query') || '');
  const [corpBrand, setCorpBrand] = useState(() => sessionStorage.getItem('signup_corp_brand') || '');
  const [corpBudget, setCorpBudget] = useState(() => sessionStorage.getItem('signup_corp_budget') || 'Medium');
  const [mediaNetwork, setMediaNetwork] = useState(() => sessionStorage.getItem('signup_media_network') || '');

  // Payout Setup States
  const [payoutReceiverType, setPayoutReceiverType] = useState(() => {
    const saved = sessionStorage.getItem('signup_payout_receiver_type');
    if (saved) return saved;
    return roles.includes('label') ? 'label' : 'individual';
  });
  const [payoutMethod, setPayoutMethod] = useState(() => sessionStorage.getItem('signup_payout_method') || 'direct_deposit');
  const [payoutBankName, setPayoutBankName] = useState(() => sessionStorage.getItem('signup_payout_bank_name') || '');
  const [payoutAccountNum, setPayoutAccountNum] = useState(() => sessionStorage.getItem('signup_payout_account_num') || '');
  const [payoutRoutingNum, setPayoutRoutingNum] = useState(() => sessionStorage.getItem('signup_payout_routing_num') || '');
  const [payoutCardNum, setPayoutCardNum] = useState(() => sessionStorage.getItem('signup_payout_card_num') || '');
  const [payoutMobilePhone, setPayoutMobilePhone] = useState(() => sessionStorage.getItem('signup_payout_mobile_phone') || '');
  const [payoutMobileProvider, setPayoutMobileProvider] = useState(() => sessionStorage.getItem('signup_payout_mobile_provider') || 'M-Pesa');
  const [payoutPaypalEmail, setPayoutPaypalEmail] = useState(() => sessionStorage.getItem('signup_payout_paypal_email') || '');

  // Loading indicator for scan
  const [scanningDevices, setScanningDevices] = useState(false);

  const [currentInput, setCurrentInput] = useState('');
  const chatEndRef = useRef(null);

  // Parse URL query parameter pre-selection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    const getPreselectedRolesForPath = (path) => {
      if (!path) return [];
      if (path.includes('/for/creator')) return ['creator'];
      if (path.includes('/for/exec')) return ['label'];
      if (path.includes('/for/supervisor')) return ['studio'];
      if (path.includes('/for/booking-agent')) return ['label'];
      if (path.includes('/for/manager')) return ['creator', 'label'];
      if (path.includes('/native-apps/tunestreams') || path.includes('/native-apps/tunestream') || path.includes('/native-apps/tunemavens')) return ['consumer'];
      if (path.includes('/native-apps/creator-companion')) return ['creator'];
      if (path.includes('/native-apps/tunepay')) return ['label'];
      return [];
    };

    let preselected = [];
    if (roleParam && ['consumer', 'creator', 'label', 'dj', 'studio', 'corporate', 'media'].includes(roleParam)) {
      preselected = [roleParam];
    } else {
      const fromPath = location.state?.from || '';
      preselected = getPreselectedRolesForPath(fromPath);
      
      if (preselected.length === 0 && document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          preselected = getPreselectedRolesForPath(refUrl.pathname);
        } catch (e) {}
      }
    }

    if (preselected.length > 0) {
      setRoles(prev => {
        const merged = [...prev];
        preselected.forEach(r => {
          if (!merged.includes(r)) merged.push(r);
        });
        return merged;
      });
      setStep(prev => prev === 0 ? 1 : prev);
    }
  }, [location]);

  // Sync states to sessionStorage on changes
  useEffect(() => { sessionStorage.setItem('signup_roles', JSON.stringify(roles)); }, [roles]);
  useEffect(() => { sessionStorage.setItem('signup_name', name); }, [name]);
  useEffect(() => { sessionStorage.setItem('signup_email', email); }, [email]);
  useEffect(() => { sessionStorage.setItem('signup_password', password); }, [password]);
  useEffect(() => { sessionStorage.setItem('signup_step', step.toString()); }, [step]);
  useEffect(() => { sessionStorage.setItem('signup_is_ai', isAiMode.toString()); }, [isAiMode]);
  useEffect(() => { sessionStorage.setItem('signup_ai_step', aiStep.toString()); }, [aiStep]);
  useEffect(() => { sessionStorage.setItem('signup_chat_log', JSON.stringify(chatLog)); }, [chatLog]);
  
  useEffect(() => { sessionStorage.setItem('signup_genres', JSON.stringify(genres)); }, [genres]);
  useEffect(() => { sessionStorage.setItem('signup_followed_creators', JSON.stringify(followedCreators)); }, [followedCreators]);
  useEffect(() => { sessionStorage.setItem('signup_selected_pricing', selectedPricing); }, [selectedPricing]);
  useEffect(() => { sessionStorage.setItem('signup_creative_type', creativeType); }, [creativeType]);
  useEffect(() => { sessionStorage.setItem('signup_payout_wallet', payoutWallet); }, [payoutWallet]);
  useEffect(() => { sessionStorage.setItem('signup_biography', biography); }, [biography]);
  useEffect(() => { sessionStorage.setItem('signup_contract_signed', contractSigned.toString()); }, [contractSigned]);
  useEffect(() => { sessionStorage.setItem('signup_label_name', labelName); }, [labelName]);
  useEffect(() => { sessionStorage.setItem('signup_label_hq', labelHq); }, [labelHq]);
  useEffect(() => { sessionStorage.setItem('signup_default_split_slider', defaultSplitSlider.toString()); }, [defaultSplitSlider]);
  useEffect(() => { sessionStorage.setItem('signup_dj_style', djStyle); }, [djStyle]);
  useEffect(() => { sessionStorage.setItem('signup_sync_brief_query', syncBriefQuery); }, [syncBriefQuery]);
  useEffect(() => { sessionStorage.setItem('signup_corp_brand', corpBrand); }, [corpBrand]);
  useEffect(() => { sessionStorage.setItem('signup_corp_budget', corpBudget); }, [corpBudget]);
  useEffect(() => { sessionStorage.setItem('signup_media_network', mediaNetwork); }, [mediaNetwork]);

  useEffect(() => { sessionStorage.setItem('signup_payout_receiver_type', payoutReceiverType); }, [payoutReceiverType]);
  useEffect(() => { sessionStorage.setItem('signup_payout_method', payoutMethod); }, [payoutMethod]);
  useEffect(() => { sessionStorage.setItem('signup_payout_bank_name', payoutBankName); }, [payoutBankName]);
  useEffect(() => { sessionStorage.setItem('signup_payout_account_num', payoutAccountNum); }, [payoutAccountNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_routing_num', payoutRoutingNum); }, [payoutRoutingNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_card_num', payoutCardNum); }, [payoutCardNum]);
  useEffect(() => { sessionStorage.setItem('signup_payout_mobile_phone', payoutMobilePhone); }, [payoutMobilePhone]);
  useEffect(() => { sessionStorage.setItem('signup_payout_mobile_provider', payoutMobileProvider); }, [payoutMobileProvider]);
  useEffect(() => { sessionStorage.setItem('signup_payout_paypal_email', payoutPaypalEmail); }, [payoutPaypalEmail]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  // Steps Configuration Map per Documentation Section 9.2
  const stepsMap = {
    consumer: ['Genre Prefs', 'Creator Discovery', 'Device Detection', 'Pricing & Payout'],
    creator: ['Creative Style', 'Bio & Gallery', 'Discography Ingest', 'Compensation & E-Sign'],
    label: ['Company Info', 'Roster Ingest', 'Default Splits'],
    dj: ['DJ Profile', 'HQ Music Pool', 'IP Clearance Engine'],
    studio: ['Supervisor Details', 'Sync Brief AI Search'],
    corporate: ['Brand Campaign', 'Budget Options'],
    media: ['Broadcaster Info', 'Playlist Compliance'],
  };

  const getStepsForRoles = (selectedRoles) => {
    const list = ['Role'];
    if (Array.isArray(selectedRoles)) {
      selectedRoles.forEach(r => {
        if (stepsMap[r]) {
          list.push(...stepsMap[r]);
        }
      });
      const isPayee = selectedRoles.some(r => ['creator', 'label', 'dj'].includes(r));
      if (isPayee) {
        list.push('Payout Setup');
      }
    }
    list.push('Security'); // Unified final security credentials setup
    return list;
  };

  const steps = getStepsForRoles(roles);
  const currentStepName = steps[step];

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 0 && roles.length === 0) {
      alert('Please select at least one primary role.');
      return;
    }

    const currentStepName = steps[step];

    // Onboarding step-name conditional validators
    if (currentStepName === 'Payout Setup') {
      if (payoutMethod === 'direct_deposit' && (!payoutBankName || !payoutAccountNum)) {
        alert('Please enter your Bank Name and Account Number.');
        return;
      }
      if (payoutMethod === 'debit_card' && !payoutCardNum) {
        alert('Please enter your Debit Card number.');
        return;
      }
      if (payoutMethod === 'mobile_money' && !payoutMobilePhone) {
        alert('Please enter your Mobile Money phone number.');
        return;
      }
      if (payoutMethod === 'paypal' && !payoutPaypalEmail) {
        alert('Please enter your PayPal email address.');
        return;
      }
    }
    if (currentStepName === 'Bio & Gallery' && !biography) {
      alert('Please write a short biography summary.');
      return;
    }
    if (currentStepName === 'Compensation & E-Sign' && !contractSigned) {
      alert('Please sign the cascade compensation agreement.');
      return;
    }
    if (currentStepName === 'Company Info' && !labelName) {
      alert('Please enter your Record Label name.');
      return;
    }
    if (currentStepName === 'DJ Profile' && !djStyle) {
      alert('Please specify your primary DJ mixing style.');
      return;
    }
    if (currentStepName === 'Supervisor Details' && !name) {
      alert('Please specify your production or company name.');
      return;
    }
    if (currentStepName === 'Brand Campaign' && !corpBrand) {
      alert('Please specify your brand or organization name.');
      return;
    }
    if (currentStepName === 'Broadcaster Info' && !mediaNetwork) {
      alert('Please specify your broadcasting media network name.');
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      submitRegister();
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setName('Alex Rivera');
      setEmail('alex.rivera@gmail.com');
      alert('Google credentials fetched! Account details auto-populated.');
      setStep(1);
    }, 1200);
  };

  const handleCatalogSync = (platform) => {
    setSyncPlatform(platform);
    setSyncStatus('syncing');
    
    setTimeout(() => {
      setSyncStatus('success');
      const count = platform === 'ASCAP / BMI' ? 18 : 24;
      setSyncedCount(count);
      if (!name) setName('Alex Rivera');
      if (!email) setEmail(`alex.rivera@${platform.toLowerCase().replace(/\s/g, '')}.com`);
      alert(`Successfully synced with ${platform}! Imported ${count} releases and metadata.`);
    }, 2000);
  };

  const handleSendAiMessage = (e) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const userText = currentInput.trim();
    setChatLog(prev => [...prev, { sender: 'user', text: userText }]);
    setCurrentInput('');

    setTimeout(() => {
      if (aiStep === 0) {
        setName(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: `Nice to meet you, ${userText}! What email address should we register for your account?` 
        }]);
        setAiStep(1);
      } else if (aiStep === 1) {
        setEmail(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: "Type the roles you want to register for, separated by commas (e.g. Creator, DJ):" 
        }]);
        setAiStep(2);
      } else if (aiStep === 2) {
        const text = userText.toLowerCase();
        const selected = [];
        if (text.includes('consumer') || text.includes('listen') || text.includes('stream')) selected.push('consumer');
        if (text.includes('create') || text.includes('art') || text.includes('prod')) selected.push('creator');
        if (text.includes('label') || text.includes('record')) selected.push('label');
        if (text.includes('dj')) selected.push('dj');
        if (text.includes('film') || text.includes('studio')) selected.push('studio');
        if (text.includes('corp') || text.includes('brand')) selected.push('corporate');
        if (text.includes('media') || text.includes('house')) selected.push('media');

        if (selected.length === 0) selected.push('consumer'); // fallback

        setRoles(selected);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: `Selected objectives: ${selected.map(r => r.toUpperCase()).join(' & ')}. Let's secure your account. Type a password to finalize setup:` 
        }]);
        setAiStep(3);
      } else if (aiStep === 3) {
        setPassword(userText);
        setChatLog(prev => [...prev, { 
          sender: 'ai', 
          text: "All set! Click the complete button below to create your account." 
        }]);
        setAiStep(4);
      }
    }, 800);
  };

  const toggleAiMode = () => {
    const nextMode = !isAiMode;
    setIsAiMode(nextMode);
    // Reset state sequences
    setStep(0);
    setAiStep(0);
    setChatLog([
      { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
    ]);
    setName('');
    setEmail('');
    setRoles([]);
    setPassword('');
    setSyncStatus('idle');
    setSyncedCount(0);
  };

  const clearSignupMemory = () => {
    sessionStorage.removeItem('signup_roles');
    sessionStorage.removeItem('signup_role');
    sessionStorage.removeItem('signup_name');
    sessionStorage.removeItem('signup_email');
    sessionStorage.removeItem('signup_password');
    sessionStorage.removeItem('signup_step');
    sessionStorage.removeItem('signup_is_ai');
    sessionStorage.removeItem('signup_ai_step');
    sessionStorage.removeItem('signup_chat_log');
    
    sessionStorage.removeItem('signup_genres');
    sessionStorage.removeItem('signup_followed_creators');
    sessionStorage.removeItem('signup_selected_pricing');
    sessionStorage.removeItem('signup_creative_type');
    sessionStorage.removeItem('signup_payout_wallet');
    sessionStorage.removeItem('signup_biography');
    sessionStorage.removeItem('signup_contract_signed');
    sessionStorage.removeItem('signup_label_name');
    sessionStorage.removeItem('signup_label_hq');
    sessionStorage.removeItem('signup_default_split_slider');
    sessionStorage.removeItem('signup_dj_style');
    sessionStorage.removeItem('signup_sync_brief_query');
    sessionStorage.removeItem('signup_corp_brand');
    sessionStorage.removeItem('signup_corp_budget');
    sessionStorage.removeItem('signup_media_network');
  };

  const handleResetRegistration = () => {
    if (window.confirm("Are you sure you want to reset and restart your sign-up process?")) {
      clearSignupMemory();
      setRoles([]);
      setName('');
      setEmail('');
      setPassword('');
      setStep(0);
      setAiStep(0);
      setSyncStatus('idle');
      setSyncedCount(0);
      setGenres([]);
      setFollowedCreators([]);
      setCreativeType('Artist');
      setPayoutWallet('');
      setBiography('');
      setContractSigned(false);
      setLabelName('');
      setDefaultSplitSlider(50);
      setDjStyle('Afro-House');
      setChatLog([
        { sender: 'ai', text: "Hi! I'm Ayo, your onboarding assistant. What should I call you?" }
      ]);
    }
  };

  const submitRegister = async () => {
    if (!name || !email || !password) {
      alert('Please fill out name, email, and password on the Security credentials step.');
      return;
    }
    const userRole = roles[0] || 'creator';
    try {
      const { user, access_token } = await authApi.register({
        email,
        password,
        name,
        role: userRole,
        brand_name: name + ' Productions',
        country: 'KE',
      });
      tokenStore.set(access_token);
      onLogin(user);
      alert(`SSO registration successfully complete! Welcome, ${name}!`);
      clearSignupMemory();
      navigate('/dashboard');
    } catch (err) {
      alert(err.data?.detail || err.message || 'Registration failed');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate('/');
    }
  };

  return (
    <div 
      className="container view-padding" 
      style={{ display: 'flex', justifyContent: 'center', minHeight: '75vh', alignItems: 'center', cursor: 'pointer' }}
      onClick={handleBackdropClick}
    >
      <div className="auth-modal-card" style={{ cursor: 'default' }}>
        <button 
          onClick={handleResetRegistration}
          className="auth-reset-btn"
        >
          Reset
        </button>
        <button 
          onClick={toggleAiMode}
          className={`ai-toggle-btn ${isAiMode ? 'active' : ''}`}
          style={{ border: '1px solid rgba(139, 92, 246, 0.4)' }}
        >
          ✨ {isAiMode ? 'Standard Mode' : 'AI Onboarding'}
        </button>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
        </div>

        {/* Modal Header & AI toggle */}
        <div className="auth-header" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#fff', margin: '0 0 4px', textAlign: 'left' }}>
            {isAiMode ? 'AI Assisted Setup' : 'Register Account'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--mu)', textAlign: 'left', margin: 0 }}>
            {isAiMode ? 'Talk with Ayo to onboard' : `Step ${step + 1} of ${steps.length}: ${steps[step] || ''}`}
          </p>
        </div>

        {/* Wizard Steps Indicators (Standard Mode) */}
        {!isAiMode && (
          <div className="wizard-steps-indicator" style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`wizard-step-dot ${step >= idx ? 'active' : ''}`}
                style={{ 
                  flex: 1, 
                  height: '4px', 
                  background: step >= idx ? 'var(--cyan)' : 'rgba(255,255,255,0.08)', 
                  borderRadius: '2px', 
                  transition: 'all 0.2s ease', 
                  boxShadow: step >= idx ? '0 0 4px var(--cyan)' : 'none' 
                }}
              />
            ))}
          </div>
        )}

        {/* Google SSO (Show on Role step) */}
        {!isAiMode && step === 0 && (
          <>
            <button 
              onClick={handleGoogleSignup} 
              className="google-sso-btn" 
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <RefreshCw size={14} className="spin-animation" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
                  Sign up with Google
                </>
              )}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontSize: '11px', color: 'var(--mu)' }}>or fill manually</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            </div>
          </>
        )}

        {/* CONVERSATIONAL AI MODE */}
        {isAiMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div className="ai-chat-container">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`ai-chat-bubble ${chat.sender}`}>
                  {chat.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {aiStep < 5 ? (
              <form onSubmit={handleSendAiMessage} className="ai-input-row">
                <input 
                  type={aiStep === 4 ? "password" : "text"} 
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder={aiStep === 0 ? "Type your name..." : aiStep === 1 ? "email@example.com" : aiStep === 2 ? "e.g. Creator" : aiStep === 3 ? "e.g. DistroKid" : "Type password..."}
                  className="form-control"
                  style={{ fontSize: '13px', padding: '8px 12px', flex: 1 }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}>
                  Send
                </button>
              </form>
            ) : (
              <button 
                onClick={submitRegister} 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px', marginTop: '16px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}
              >
                Complete Registration
              </button>
            )}
          </div>
        ) : (
          /* STANDARD STEP WIZARD */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '380px' }}>
            
            {/* Step 0: Universal Role Selection (Multi-select Custom Dropdown) */}
            {currentStepName === 'Role' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Select your primary account objectives (choose one or more):</p>
                
                <div className="multiselect-container" style={{ marginBottom: '16px' }}>
                  <div 
                    className="multiselect-trigger" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>
                      {roles.length === 0 
                        ? 'Select account objectives...' 
                        : roles.map(r => roleLabels[r] || r).join(', ')}
                    </span>
                    <span>{dropdownOpen ? '▲' : '▼'}</span>
                  </div>

                  {dropdownOpen && (
                    <div className="multiselect-dropdown">
                      {[
                        { id: 'consumer', emoji: '🎧', title: 'Consumer', desc: 'Stream ad-free, downloads & merch' },
                        { id: 'creator', emoji: '🎸', title: 'Creator', desc: 'Artist, producer, sync & splits' },
                        { id: 'label', emoji: '🏢', title: 'Record Label', desc: 'Roster & bulk catalogue splits' },
                        { id: 'dj', emoji: '🎚️', title: 'DJ', desc: 'HQ lossless pools & stem clearances' },
                        { id: 'studio', emoji: '🎬', title: 'Music Supervisor', desc: 'Browse syncs & AI music briefs' },
                        { id: 'corporate', emoji: '📈', title: 'Corporate', desc: 'Audio ads, sponsorships & partnerships' },
                        { id: 'media', emoji: '📺', title: 'Media House', desc: 'Broadcast licensing & compliance' }
                      ].map(opt => {
                        const isChecked = roles.includes(opt.id);
                        return (
                          <div 
                            key={opt.id} 
                            className="multiselect-option"
                            onClick={() => {
                              setRoles(prev => prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id]);
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {}}
                              className="multiselect-checkbox"
                            />
                            <div style={{ fontSize: '20px' }}>{opt.emoji}</div>
                            <div style={{ textAlign: 'left' }}>
                              <div className="multiselect-option-label">{opt.title}</div>
                              <div className="multiselect-option-desc">{opt.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {roles.map(r => (
                    <span key={r} className="role-badge">
                      {roleLabels[r] || r}
                      <span 
                        className="role-badge-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoles(prev => prev.filter(x => x !== r));
                        }}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Consumer: Genre Prefs */}
            {currentStepName === 'Genre Prefs' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '10px' }}>Select genres you enjoy listening to (minimum 1):</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {['Afrobeat', 'Amapiano', 'Hip-Hop', 'R&B', 'Gengetone', 'Bongo Flava', 'Dancehall', 'Afro-Jazz'].map(g => {
                    const isSel = genres.includes(g);
                    return (
                      <div 
                        key={g} 
                        onClick={() => {
                          setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
                        }}
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '20px', border: `1px solid ${isSel ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}`, background: isSel ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: isSel ? 'var(--cyan)' : 'var(--mu)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                      >
                        {g} {isSel ? '✓' : '+'}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consumer: Creator Discovery */}
            {currentStepName === 'Creator Discovery' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Pick creators to follow (minimum 1 to finish onboarding):</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {['Alex Rivera (Producer)', 'Burna Boy (Artist)', 'Tems (Vocalist)', 'Sauti Sol (Band)'].map(c => {
                    const isF = followedCreators.includes(c);
                    return (
                      <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(34,211,238,0.08)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>
                            {c.charAt(0)}
                          </div>
                          <span style={{ fontSize: '12px', color: '#fff' }}>{c}</span>
                        </div>
                        <button 
                          onClick={() => setFollowedCreators(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                          className={`plan-btn ${isF ? 'outline' : ''}`}
                          style={{ padding: '4px 10px', height: '24px', fontSize: '10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {isF ? '✓ Following' : '+ Follow'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Consumer: Device Detection */}
            {currentStepName === 'Device Detection' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Hardware Device Sync Detection:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: 'var(--mu)' }}>Chrome Web Player</span>
                    <span style={{ color: 'var(--green)', fontWeight: 'bold' }}>🟢 Connected</span>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: 'var(--mu)' }}>iOS / Android App</span>
                    <span style={{ color: scanningDevices ? 'var(--cyan)' : 'var(--orange)', fontWeight: 'bold' }}>
                      {scanningDevices ? '🔄 Ingesting...' : '🟡 Awaiting sync'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setScanningDevices(true);
                    setTimeout(() => setScanningDevices(false), 2000);
                  }}
                  className="plan-btn outline"
                  style={{ width: '100%', fontSize: '11px', padding: '8px', cursor: 'pointer' }}
                  disabled={scanningDevices}
                >
                  {scanningDevices ? 'Scanning network...' : 'Scan local network for devices'}
                </button>
              </div>
            )}

            {/* Consumer: Pricing & Payout */}
            {currentStepName === 'Pricing & Payout' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Choose your listening plan subscription:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div 
                    onClick={() => setSelectedPricing('free')}
                    style={{ padding: '12px', borderRadius: '4px', border: `1px solid ${selectedPricing === 'free' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`, background: selectedPricing === 'free' ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <h4 style={{ fontSize: '12px', color: '#fff', margin: '0 0 2px' }}>Free Listener</h4>
                    <p style={{ fontSize: '9px', color: 'var(--mu)', margin: 0 }}>150 free credits</p>
                  </div>
                  <div 
                    onClick={() => setSelectedPricing('pro')}
                    style={{ padding: '12px', borderRadius: '4px', border: `1px solid ${selectedPricing === 'pro' ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`, background: selectedPricing === 'pro' ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)', cursor: 'pointer', textAlign: 'center' }}
                  >
                    <h4 style={{ fontSize: '12px', color: '#fff', margin: '0 0 2px' }}>Pro Streamer</h4>
                    <p style={{ fontSize: '9px', color: 'var(--mu)', margin: 0 }}>500 credits / month</p>
                  </div>
                </div>
              </div>
            )}

            {/* Creator: Creative Style */}
            {currentStepName === 'Creative Style' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Select creative identity and payment receiver:</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {['Artist', 'Producer', 'Engineer', 'Podcaster'].map(t => (
                    <div 
                      key={t}
                      onClick={() => setCreativeType(t)}
                      style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', border: `1px solid ${creativeType === t ? 'var(--cyan)' : 'rgba(255,255,255,0.08)'}`, background: creativeType === t ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: '#fff', cursor: 'pointer', flex: 1, textAlign: 'center' }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--mu)', marginTop: '12px', textAlign: 'center' }}>
                  ℹ️ Detailed payout preferences (Direct Deposit, Mobile Money, PayPal, Stripe) will be configured in the dedicated Payout step.
                </p>
              </div>
            )}

            {/* Creator: Bio & Gallery */}
            {currentStepName === 'Bio & Gallery' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Provide artist details for sync catalog matching:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Creator Biography</label>
                  <textarea placeholder="Write a short summary..." value={biography} onChange={(e) => setBiography(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', height: '60px', resize: 'none' }} required />
                </div>
                <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '10px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '10px', color: 'var(--mu)' }}>
                  📁 Click to mock upload press photo kit gallery
                </div>
              </div>
            )}

            {/* Creator: Discography Ingest */}
            {currentStepName === 'Discography Ingest' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Port releases and split metadata seamlessly:</p>
                {syncStatus === 'syncing' ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                    <RefreshCw size={24} className="spin-animation" style={{ color: 'var(--purple)', marginBottom: '12px' }} />
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: '600' }}>Fetching catalog from {syncPlatform}...</div>
                  </div>
                ) : syncStatus === 'success' ? (
                  <div style={{ padding: '20px', textAlign: 'center', background: 'rgba(16,185,129,0.04)', border: '1px solid var(--green)', borderRadius: '4px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>Catalog Ported Successfully!</div>
                    <p style={{ fontSize: '10px', color: 'var(--mu)', marginTop: '4px' }}>Imported {syncedCount} tracks from {syncPlatform}. Profile details auto-filled.</p>
                  </div>
                ) : (
                  <>
                    <div className="porting-platform-grid">
                      {['DistroKid', 'TuneCore', 'CD Baby', 'ASCAP / BMI'].map((platform) => (
                        <div key={platform} className="porting-card" onClick={() => handleCatalogSync(platform)}>
                          <div className="porting-card-title">{platform}</div>
                          <div className="porting-card-desc">Port splits & releases</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Creator: Compensation & E-Sign */}
            {currentStepName === 'Compensation & E-Sign' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Review shared cascade compensation splits terms:</p>
                <div style={{ padding: '12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: 'var(--mu)', marginBottom: '14px' }}>
                  <strong>Cascade splits resolution contract:</strong><br />
                  - 80% direct net payouts to Creator.<br />
                  - 15% distributor/publishing vault node.<br />
                  - 5% network maintenance fee.
                </div>
                <button 
                  onClick={() => setContractSigned(!contractSigned)}
                  className={`plan-btn ${contractSigned ? 'outline' : ''}`}
                  style={{ width: '100%', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  {contractSigned ? '✓ Cascading Splits Signed' : 'Sign Compensation E-Agreement'}
                </button>
              </div>
            )}

            {/* Label: Company Info */}
            {currentStepName === 'Company Info' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Record Label general metadata setup:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Record Label Title</label>
                  <input type="text" placeholder="e.g. Maven Records" value={labelName} onChange={(e) => setLabelName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Headquarters Territory</label>
                  <select value={labelHq} onChange={(e) => setLabelHq(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(6,8,19,0.8)', color: '#fff', outline: 'none' }}>
                    <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                    <option value="Atlanta, USA">Atlanta, USA</option>
                    <option value="London, UK">London, UK</option>
                    <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  </select>
                </div>
              </div>
            )}

            {/* Label: Roster Ingest */}
            {currentStepName === 'Roster Ingest' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Roster management & catalogue bulk upload:</p>
                <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '24px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', cursor: 'pointer', marginBottom: '12px' }} onClick={() => handleCatalogSync('Bulk Label CSV')}>
                  {syncStatus === 'syncing' ? (
                    <RefreshCw size={20} className="spin-animation" style={{ color: 'var(--purple)' }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>Drag & Drop Label Roster CSV file</span>
                      <span style={{ fontSize: '9px', color: 'var(--mu)' }}>Parses and validates track splits instantly</span>
                    </>
                  )}
                </div>
                {syncStatus === 'success' && (
                  <div style={{ padding: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--green)', borderRadius: '4px', fontSize: '10px', color: '#fff', textAlign: 'center' }}>
                    ✓ CSV parsed! Loaded {syncedCount} tracks under roster.
                  </div>
                )}
              </div>
            )}

            {/* Label: Default Splits */}
            {currentStepName === 'Default Splits' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Default Gross/Net Split splits settings:</p>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '12px', color: '#fff', fontWeight: '700', marginBottom: '10px' }}>
                    <span>Label Share</span>
                    <span>{defaultSplitSlider}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={defaultSplitSlider} 
                    onChange={(e) => setDefaultSplitSlider(parseInt(e.target.value))} 
                    style={{ width: '100%', accentColor: 'var(--cyan)' }} 
                  />
                  <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '10px', color: 'var(--mu)', marginTop: '6px' }}>
                    <span>10% (Artist Friendly)</span>
                    <span>90% (Label Recoupment)</span>
                  </div>
                </div>
              </div>
            )}

            {/* DJ: DJ Profile */}
            {currentStepName === 'DJ Profile' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>DJ Profile details:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Primary Mixing Style</label>
                  <input type="text" placeholder="e.g. Afro-House, Techno" value={djStyle} onChange={(e) => setDjStyle(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Resident Venue / Club</label>
                  <input type="text" placeholder="e.g. Alchemist, Nairobi" className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} />
                </div>
              </div>
            )}

            {/* DJ: HQ Music Pool */}
            {currentStepName === 'HQ Music Pool' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Select lossless record pools to synchronize:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['TuneMavens HQ Lossless Pool', 'Franchise Record Pool Sync', 'BPM Supreme DJ link'].map(p => (
                    <div key={p} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', fontSize: '11px', color: '#fff' }}>
                      📻 {p}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DJ: IP Clearance Engine */}
            {currentStepName === 'IP Clearance Engine' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Clear stem remix permissions (IP Clearance Engine):</p>
                <div style={{ padding: '12px', background: 'rgba(6,8,19,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '11px', color: 'var(--mu)', marginBottom: '12px' }}>
                  Request drops, clearance hashes, and extended edits from copyright holders instantly. Remixed uploads are routed automatically.
                </div>
                <button className="plan-btn outline" style={{ width: '100%', fontSize: '11px', cursor: 'pointer' }} onClick={() => alert(' clearance simulator initiated!')}>
                  Clear Stem Test Clearance
                </button>
              </div>
            )}

            {/* Studio: Supervisor Details */}
            {currentStepName === 'Supervisor Details' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Music supervisor / production details:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Company or Organization Name</label>
                  <input type="text" placeholder="e.g. Apex Cinema Group" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
              </div>
            )}

            {/* Studio: Sync Brief AI Search */}
            {currentStepName === 'Sync Brief AI Search' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>AI Sync Brief search catalog testing:</p>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. Energetic upbeat Afrobeat for car scene..." 
                    value={syncBriefQuery}
                    onChange={(e) => setSyncBriefQuery(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '12px', padding: '8px 12px' }}
                  />
                </div>
                <button 
                  onClick={() => {
                    setScanningDevices(true);
                    setTimeout(() => {
                      setScanningDevices(false);
                      setSyncPlatform('Alex Rivera - Midnight Chase (Afrobeat mix) [94% match]');
                    }, 1500);
                  }}
                  className="plan-btn"
                  style={{ fontSize: '11px', width: '100%', cursor: 'pointer', marginBottom: '10px' }}
                >
                  {scanningDevices ? 'AI matching catalogue...' : 'Test AI Sync Matching'}
                </button>
                {syncPlatform && (
                  <div style={{ padding: '8px 12px', background: 'rgba(34,211,238,0.06)', border: '1px solid var(--cyan)', borderRadius: '4px', fontSize: '11px', color: 'var(--cyan)' }}>
                    Matched: {syncPlatform}
                  </div>
                )}
              </div>
            )}

            {/* Corporate: Brand Campaign */}
            {currentStepName === 'Brand Campaign' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Brand campaign details:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Organization / Brand Name</label>
                  <input type="text" placeholder="e.g. High-Tech Ads Inc." value={corpBrand} onChange={(e) => setCorpBrand(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
              </div>
            )}

            {/* Corporate: Budget Options */}
            {currentStepName === 'Budget Options' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Campaign objectives & credit budget options:</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {['Audio Ads', 'Playlists', 'Sponsorships'].map(b => (
                    <div 
                      key={b}
                      onClick={() => setCorpBudget(b)}
                      style={{ padding: '8px', border: `1px solid ${corpBudget === b ? 'var(--cyan)' : 'rgba(255,255,255,0.06)'}`, background: corpBudget === b ? 'rgba(34,211,238,0.06)' : 'rgba(255,255,255,0.02)', color: '#fff', fontSize: '11px', flex: 1, borderRadius: '4px', cursor: 'pointer', textAlign: 'center' }}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media: Broadcaster Info */}
            {currentStepName === 'Broadcaster Info' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Broadcaster details:</p>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Broadcasting Network / Station Name</label>
                  <input type="text" placeholder="e.g. Metro TV FM" value={mediaNetwork} onChange={(e) => setMediaNetwork(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
              </div>
            )}

            {/* Media: Playlist Compliance */}
            {currentStepName === 'Playlist Compliance' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '12px' }}>Playlist compliance reporting (AI Discrepancy detector):</p>
                <div style={{ border: '1px dashed rgba(255,255,255,0.08)', padding: '20px', borderRadius: '4px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', fontSize: '11px', color: 'var(--mu)' }}>
                  Drag & Drop playlist logs. The AI detector checks licensing discrepancies automatically.
                </div>
              </div>
            )}

            {/* Payee Setup: Payout Setup */}
            {currentStepName === 'Payout Setup' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '11px', color: 'var(--mu)', marginBottom: '8px' }}>Who is receiving payments?</p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {[
                    { id: 'individual', label: 'Individual Creator', desc: 'Artist, DJ, or Producer' },
                    { id: 'label', label: 'Record Label', desc: 'Catalog Owner' },
                    { id: 'entrepreneur', label: 'Entrepreneur', desc: 'Music Agency / Executive' }
                  ].map(r => (
                    <div
                      key={r.id}
                      onClick={() => setPayoutReceiverType(r.id)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${payoutReceiverType === r.id ? 'var(--cyan)' : 'rgba(255,255,255,0.06)'}`,
                        background: payoutReceiverType === r.id ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: payoutReceiverType === r.id ? 'var(--cyan)' : '#fff' }}>{r.label}</div>
                      <div style={{ fontSize: '8px', color: 'var(--mu)', marginTop: '2px' }}>{r.desc}</div>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: '11px', color: 'var(--mu)', marginBottom: '8px' }}>Select preferred payout method:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '16px' }}>
                  {[
                    { id: 'direct_deposit', label: 'Bank', icon: '🏦' },
                    { id: 'debit_card', label: 'Card', icon: '💳' },
                    { id: 'mobile_money', label: 'Mobile', icon: '📱' },
                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { id: 'stripe', label: 'Stripe', icon: '⚡' }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setPayoutMethod(m.id)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${payoutMethod === m.id ? 'var(--cyan)' : 'rgba(255,255,255,0.05)'}`,
                        background: payoutMethod === m.id ? 'rgba(34,211,238,0.04)' : 'rgba(255,255,255,0.01)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{m.icon}</div>
                      <div style={{ fontSize: '10px', color: payoutMethod === m.id ? 'var(--cyan)' : '#fff', fontWeight: '500' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Method Details Form */}
                {payoutMethod === 'direct_deposit' && (
                  <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Bank Name</label>
                      <input type="text" placeholder="e.g. Chase Bank, Equity Bank" value={payoutBankName} onChange={(e) => setPayoutBankName(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Account Number</label>
                        <input type="text" placeholder="e.g. 100293028" value={payoutAccountNum} onChange={(e) => setPayoutAccountNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Routing / SWIFT Code</label>
                        <input type="text" placeholder="e.g. 021000021" value={payoutRoutingNum} onChange={(e) => setPayoutRoutingNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {payoutMethod === 'debit_card' && (
                  <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Debit Card Number</label>
                      <input type="text" placeholder="e.g. 4111 2222 3333 4444" value={payoutCardNum} onChange={(e) => setPayoutCardNum(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className="form-group" style={{ flex: 2 }}>
                        <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Cardholder Name</label>
                        <input type="text" placeholder="e.g. Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>CVV</label>
                        <input type="password" placeholder="•••" maxLength="3" className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {payoutMethod === 'mobile_money' && (
                  <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Mobile Money Provider</label>
                      <select value={payoutMobileProvider} onChange={(e) => setPayoutMobileProvider(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px', background: 'rgba(6,8,19,0.8)', color: '#fff' }}>
                        <option value="M-Pesa">M-Pesa (Kenya / East Africa)</option>
                        <option value="MTN MoMo">MTN Mobile Money (Nigeria / West Africa)</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Orange Money">Orange Money</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>Phone Number</label>
                      <input type="tel" placeholder="e.g. +254 700 000 000" value={payoutMobilePhone} onChange={(e) => setPayoutMobilePhone(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                  </div>
                )}

                {payoutMethod === 'paypal' && (
                  <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '10px', color: 'var(--mu)' }}>PayPal Email Address</label>
                      <input type="email" placeholder="paypal@example.com" value={payoutPaypalEmail} onChange={(e) => setPayoutPaypalEmail(e.target.value)} className="form-control" style={{ fontSize: '12px', padding: '8px 12px' }} />
                    </div>
                    <p style={{ fontSize: '9px', color: 'var(--mu)', marginTop: '8px' }}>Payments are processed securely via PayPal Mass Pay nodes.</p>
                  </div>
                )}

                {payoutMethod === 'stripe' && (
                  <div style={{ animation: 'fadeIn 0.2s ease', textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💳</div>
                    <h5 style={{ fontSize: '12px', color: '#fff', margin: '0 0 4px' }}>Stripe Connect Onboarding</h5>
                    <p style={{ fontSize: '10px', color: 'var(--mu)', margin: '0 0 12px' }}>Link your bank account via Stripe Connect securely.</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Stripe Connect onboarding modal simulated! Your merchant account is now linked.');
                      }}
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Link Stripe Account
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Universal: Security Credentials (Final Step) */}
            {currentStepName === 'Security' && (
              <div style={{ animation: 'fadeIn 0.3s ease', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '14px' }}>Configure your account access credentials:</p>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Full Name</label>
                  <input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Email Address</label>
                  <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontSize: '11px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Choose Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" style={{ fontSize: '13px', padding: '8px 12px' }} required />
                </div>
              </div>
            )}

            {/* Wizard Controls */}
            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {step > 0 && (
                <button 
                  onClick={handlePrevStep} 
                  className="plan-btn outline"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleNextStep} 
                className="btn-primary" 
                style={{ flex: 2, padding: '10px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: 'pointer' }}
              >
                {step === steps.length - 1 ? 'Complete Register' 
                  : (currentStepName === 'Discography Ingest' ? 'Skip Catalog Porting' 
                  : (currentStepName === 'Roster Ingest' ? 'Skip Roster Ingest' : 'Next Step'))}
              </button>
            </div>
          </div>
        )}

        <p style={{ fontSize: '12px', color: 'var(--mu)', marginTop: '16px', textAlign: 'center', margin: '16px 0 0' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
}

// ================= Dashboard Topbar (notifications + account dropdown) =================
function DashboardTopbar({ sessionUser, onLogout, setActiveTab }) {
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
          <Home size={14} />
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
            <Bell size={18} />
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
            <ChevronDown size={14} />
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
                onClick={() => { setActiveTab('profile'); setAccountOpen(false); }}
                data-testid="topbar-menu-account-settings"
              >
                <Settings size={14} />
                <span>Account Settings</span>
              </button>
              <Link
                to="/"
                className="topbar-menu-item"
                onClick={() => setAccountOpen(false)}
                data-testid="topbar-menu-visit-site"
              >
                <ExternalLink size={14} />
                <span>Visit Public Site</span>
              </Link>
              <div className="topbar-dropdown-divider" />
              <button
                className="topbar-menu-item topbar-menu-item-danger"
                onClick={() => { setAccountOpen(false); onLogout(); }}
                data-testid="topbar-menu-logout"
              >
                <LogOut size={14} />
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
function DashboardView({ sessionUser, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [userCredits, setUserCredits] = useState(sessionUser?.credits || 600);
  const [payoutBalance, setPayoutBalance] = useState(4235.80);
  const [collapsed, setCollapsed] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardAnswers, setWizardAnswers] = useState(null);

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
        return <CatalogPortingPanel setActiveTab={setActiveTab} />;
      case 'splits':
        return (
          <SplitCascadePanel 
            payoutBalance={payoutBalance} 
            setPayoutBalance={setPayoutBalance} 
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
      case 'app-marketplace':
        return <AppMarketplacePanel sessionUser={sessionUser} onUpdateUser={onUpdateUser} setActiveTab={setActiveTab} onOpenWizard={() => setWizardOpen(true)} wizardAnswers={wizardAnswers} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  const getCategorizedMenu = () => {
    const role = sessionUser?.role || 'creator';
    
    const allItems = {
      home: { id: 'home', label: 'Overview', icon: Activity, category: 'Dashboard' },
      catalog: { id: 'catalog', label: 'Catalog Porting', icon: Database, category: 'Catalog & IP' },
      splits: { id: 'splits', label: 'Split Cascade', icon: Coins, category: 'Royalty Ledgers' },
      djpool: { id: 'djpool', label: 'DJ Pool MVP', icon: Radio, category: 'Pools & Sync' },
      sync: { id: 'sync', label: 'Sync Marketplace', icon: Globe, category: 'Pools & Sync' },
      escrow: { id: 'escrow', label: 'Escrow Contracts', icon: Shield, category: 'Royalty Ledgers' },
      profile: { id: 'profile', label: 'Profile Settings', icon: Settings, category: 'Account' },
      // Native-app user controls (full editing parity with the apps)
      library: { id: 'library', label: 'My Library', icon: Music, category: 'tunestream' },
      tips: { id: 'tips', label: 'Tips & Purchases', icon: Coins, category: 'tunestream' },
      'stream-controls': { id: 'stream-controls', label: 'Player & Devices', icon: Headphones, category: 'tunestream' },
      'pos-inventory': { id: 'pos-inventory', label: 'POS Inventory', icon: Database, category: 'tunepay' },
      'pos-settlement': { id: 'pos-settlement', label: 'POS Settlement', icon: Coins, category: 'tunepay' },
      'pos-devices': { id: 'pos-devices', label: 'POS Devices', icon: Smartphone, category: 'tunepay' },
      'publishing-election': { id: 'publishing-election', label: 'Publishing Election', icon: BookOpen, category: 'Royalty Ledgers' },
      'distribution-election': { id: 'distribution-election', label: 'Distribution Election', icon: Globe, category: 'Royalty Ledgers' },
      'app-marketplace': { id: 'app-marketplace', label: 'App Marketplace', icon: Zap, category: 'Apps & Marketplace' },
      'domain-mappings': { id: 'domain-mappings', label: 'Domain Mappings', icon: Globe, category: 'Admin' },
      'promoted-acts': { id: 'promoted-acts', label: 'Promoted Acts', icon: Star, category: 'Admin' },
    };

    let visibleKeys = [];
    switch (role) {
      case 'admin':
        visibleKeys = ['home', 'app-marketplace', 'catalog', 'splits', 'publishing-election', 'distribution-election', 'djpool', 'sync', 'escrow', 'library', 'tips', 'pos-inventory', 'pos-settlement', 'pos-devices', 'domain-mappings', 'promoted-acts', 'profile'];
        break;
      case 'label':
        visibleKeys = ['home', 'app-marketplace', 'catalog', 'splits', 'publishing-election', 'distribution-election', 'sync', 'pos-inventory', 'pos-settlement', 'pos-devices', 'profile'];
        break;
      case 'dj':
        visibleKeys = ['home', 'app-marketplace', 'djpool', 'library', 'tips', 'profile'];
        break;
      case 'studio':
      case 'supervisor':
        visibleKeys = ['home', 'app-marketplace', 'sync', 'escrow', 'profile'];
        break;
      case 'consumer':
        visibleKeys = ['home', 'library', 'tips', 'stream-controls', 'profile'];
        break;
      case 'creator':
      default:
        visibleKeys = ['home', 'app-marketplace', 'catalog', 'splits', 'publishing-election', 'distribution-election', 'djpool', 'sync', 'escrow', 'library', 'tips', 'pos-inventory', 'pos-settlement', 'profile'];
        break;
    }

    const categories = {};
    visibleKeys.forEach(k => {
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
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                        onClick={() => setActiveTab(item.id)} 
                        className={`dashboard-nav-item ${activeTab === item.id ? 'active' : ''}`}
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
                <ArrowLeft size={16} />
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
                <span>{sessionUser.role || 'Creator'}</span>
              </div>
            )}
          </div>
          <button 
            onClick={onLogout} 
            className="dashboard-nav-item" 
            style={{ width: '100%', border: 'none', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', justifyContent: 'center', marginTop: '8px', padding: collapsed ? '10px 0' : '10px 14px' }}
            title="Log Out"
          >
            <X size={14} />
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
        />
        <div className="dashboard-main-scroll" data-testid="dashboard-main-scroll">
          <OnboardingStripe sessionUser={sessionUser} setActiveTab={setActiveTab} onOpenWizard={() => setWizardOpen(true)} wizardAnswers={wizardAnswers} />
          {renderActivePanel()}
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

// "Perfect for" sidebar  -  rendered on all landing/marketing routes.
import { PerfectForSidebar, PERFECT_FOR_ROLES, ROLE_LOGOS } from './components/PerfectForSidebar.jsx'

// Landing page customized solid background colors (dark theme)
function getLandingBackground(slug) {
  switch (slug) {
    case 'tunestreams':
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
          <Lock size={28} style={{ color: '#475569', marginBottom: '10px' }} />
          <p>You need the <strong style={{ color: '#f1f5f9' }}>admin</strong> role to manage domain mappings.</p>
          <button
            className="btn-primary"
            style={{ marginTop: '12px', padding: '10px 18px', fontSize: '12px', fontWeight: 700 }}
            data-testid="become-admin-btn"
            onClick={async () => {
              try {
                await adminApi.becomeAdmin();
                const merged = { ...sessionUser, role: 'admin' };
                if (onUpdateUser) onUpdateUser(merged);
                sessionStorage.setItem('tunemavens_session', JSON.stringify(merged));
                window.location.reload();
              } catch (e) {
                alert(e.data?.detail || e.message || 'Could not elevate to admin');
              }
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
function CatalogPortingPanel({ setActiveTab }) {
  const [selectedPreset, setSelectedPreset] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [errors, setErrors] = useState([]);
  
  // Catalog tracks state with realistic seed data
  const [tracks, setTracks] = useState([
    { isrc: 'US-123-45678', title: 'Midnight Grooves', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (30%) / Label (20%)', genre: 'Afro-House', status: 'valid' },
    { isrc: 'US-123-45679', title: 'Neon Shadows', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Deep-House', status: 'valid' },
    { isrc: 'US-123-45680', title: 'Nairobi Sunset', artist: 'Aisha Okoro', split: 'Artist (40%) / Label (60%)', genre: 'Amapiano', status: 'valid' },
    { isrc: 'US-123-45681', title: 'Kilimanjaro Vibe', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Afrobeats', status: 'valid' }
  ]);

  // Search and Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Single Track Uploader Form States
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGenre, setNewGenre] = useState('Afro-House');
  const [newIsrc, setNewIsrc] = useState('');
  const [newArtistSplit, setNewArtistSplit] = useState(50);
  const [newProducerSplit, setNewProducerSplit] = useState(30);
  const [newLabelSplit, setNewLabelSplit] = useState(20);

  // File drag & drop states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
        return {
          isrc: `US-123-${isrcNum}`,
          title: title || 'Ingested Audio Track',
          artist: 'Aisha Okoro',
          split: 'Artist (60%) / Producer (40%)',
          genre: 'Amapiano',
          status: 'valid'
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
          { isrc: 'US-123-45678', title: 'Midnight Grooves', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (30%) / Label (20%)', genre: 'Afro-House', status: 'valid' },
          { isrc: 'US-123-45679', title: 'Neon Shadows', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Deep-House', status: 'valid' },
          { isrc: 'US-123-45680', title: 'Nairobi Sunset', artist: 'Aisha Okoro', split: 'Artist (40%) / Label (60%)', genre: 'Amapiano', status: 'valid' },
          { isrc: 'US-123-45681', title: 'Kilimanjaro Vibe', artist: 'Aisha Okoro', split: 'Artist (50%) / Producer (50%)', genre: 'Afrobeats', status: 'valid' }
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
      status: 'valid'
    };

    setTracks(prev => [newTrack, ...prev]);
    setNewTitle('');
    setNewArtist('');
    setNewIsrc('');
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
              <Database size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '13px' }}>No matching tracks found in your catalogue.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table" style={{ fontSize: '12.5px' }}>
                <thead>
                  <tr>
                    <th>ISRC</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Genre</th>
                    <th>Split Structures</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTracks.map((tr, idx) => (
                    <tr key={idx}>
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
                          {/* Visual split bar illustration */}
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
                          <button 
                            className="plan-btn outline" 
                            style={{ padding: '2px 6px', fontSize: '10px', height: '22px', borderRadius: '3px', cursor: 'pointer' }}
                            onClick={() => setActiveTab('domain-mappings')}
                            title="Go to Domain hosting mapping"
                          >
                            🌐 DNS
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
  );
}

// ================= SUB-PANEL: Split Cascade Ledger (Phase 7) =================
function SplitCascadePanel({ payoutBalance, setPayoutBalance }) {
  const [grossInput, setGrossInput] = useState(1500);
  const [sliderVal, setSliderVal] = useState(50); // Artist Split Slider
  const [ledgerRows, setLedgerRows] = useState([
    { id: 'tx_821', title: 'Midnight Grooves', gross: 2500.00, comm: 250.00, label: 675.00, artist: 787.50, manager: 157.50, net: 630.00, status: 'processed' },
    { id: 'tx_822', title: 'Neon Shadows', gross: 1800.00, comm: 180.00, label: 486.00, artist: 567.00, manager: 113.40, net: 453.60, status: 'processed' },
    { id: 'tx_823', title: 'Nairobi Sunset Sync', gross: 5000.00, comm: 500.00, label: 1350.00, artist: 1575.00, manager: 315.00, net: 1260.00, status: 'processed' },
    { id: 'tx_824', title: 'Kilimanjaro Vibe', gross: 1200.00, comm: 120.00, label: 324.00, artist: 378.00, manager: 75.60, net: 302.40, status: 'processed' },
    { id: 'tx_825', title: 'Sauti Live', gross: 3000.00, comm: 300.00, label: 810.00, artist: 945.00, manager: 189.00, net: 756.00, status: 'processed' },
    { id: 'tx_826', title: 'Amapiano Wave', gross: 4000.00, comm: 400.00, label: 1080.00, artist: 1260.00, manager: 252.00, net: 1008.00, status: 'processed' }
  ]);
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
  const [downloadingId, setDownloadingId] = useState(null);
  const [tracks, setTracks] = useState([
    { id: 1, title: "Midnight Grooves (Intro Edit)", bpm: 120, format: "MP3-320", size: "8.4 MB", count: 128 },
    { id: 2, title: "Neon Shadows (DJ Quick Hitter)", bpm: 124, format: "WAV", size: "38.2 MB", count: 94 },
    { id: 3, title: "Nairobi Sunset (Extended Mix)", bpm: 118, format: "MP3-320", size: "11.1 MB", count: 245 }
  ]);

  const [clearanceRequests, setClearanceRequests] = useState([
    { id: 101, title: "Midnight Grooves (Acapella Bootleg)", dj: "DJ AfroBeat", venue: "Golden Gates Lounge", status: "approved" }
  ]);

  const [reqTitle, setReqTitle] = useState('');
  const [reqDj, setReqDj] = useState('');
  const [reqVenue, setReqVenue] = useState('');
  const [reqMsg, setReqMsg] = useState('');

  const handleDownload = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      setTracks(prev => prev.map(tr => tr.id === id ? { ...tr, count: tr.count + 1 } : tr));
      alert('Mock track downloaded successfully. Injected 8s intro/outro tags for DJ mixing compliance.');
    }, 1500);
  };

  const handleRequestClearance = (e) => {
    e.preventDefault();
    if (!reqTitle || !reqDj || !reqVenue) {
      alert('Please fill out remix title, DJ Name, and Target Venue.');
      return;
    }
    const newReqId = Date.now();
    const newReq = {
      id: newReqId,
      title: reqTitle,
      dj: reqDj,
      venue: reqVenue,
      status: 'pending'
    };
    setClearanceRequests(prev => [newReq, ...prev]);
    setReqTitle('');
    setReqDj('');
    setReqVenue('');
    setReqMsg('');

    // Simulated Auto-approval after 5s
    setTimeout(() => {
      setClearanceRequests(prev => prev.map(req => req.id === newReqId ? { ...req, status: 'approved' } : req));
    }, 5000);
  };

  return (
    <div>
      <div className="dashboard-panel-header">
        <h2>DJ Pool &amp; IP Clearance Drops</h2>
        <p>Download intro/outro DJ edits and log remix drops clearances in compliance with IP regulations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {/* Track Download List */}
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>DJ Pool MVP Download Center</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Track Title</th>
                  <th>BPM</th>
                  <th>Quality</th>
                  <th>Size</th>
                  <th>Downloads</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map(tr => (
                  <tr key={tr.id}>
                    <td style={{ fontWeight: 'bold' }}>{tr.title}</td>
                    <td>{tr.bpm} BPM</td>
                    <td><span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{tr.format}</span></td>
                    <td>{tr.size}</td>
                    <td>{tr.count} downloads</td>
                    <td>
                      <button 
                        onClick={() => handleDownload(tr.id)} 
                        disabled={downloadingId !== null}
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {downloadingId === tr.id ? (
                          <>
                            <RefreshCw size={10} className="spin-animation" style={{ marginRight: '4px' }} />
                            Preparing WAV...
                          </>
                        ) : 'Download'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clearance Ledger */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Active IP Drops Clearances</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Remix Title</th>
                  <th>DJ / Artist</th>
                  <th>Target Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {clearanceRequests.map(req => (
                  <tr key={req.id}>
                    <td>{req.title}</td>
                    <td style={{ fontWeight: 'bold' }}>{req.dj}</td>
                    <td>{req.venue}</td>
                    <td>
                      <span className={`badge-status ${req.status === 'approved' ? 'success' : 'warning'}`}>
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* IP Clearance Request Form */}
        <div className="dashboard-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '16px', color: '#fff' }}>Submit DJ Drop Clearance</h3>
          <form onSubmit={handleRequestClearance} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Remix / Track Title</label>
              <input 
                type="text" 
                placeholder="e.g. Neon Shadows (DJ Afro Remix)" 
                value={reqTitle} 
                onChange={(e) => setReqTitle(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', padding: '6px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>DJ / Remix Artist Name</label>
              <input 
                type="text" 
                placeholder="e.g. DJ Kalonje" 
                value={reqDj} 
                onChange={(e) => setReqDj(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', padding: '6px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Venue / Festival</label>
              <input 
                type="text" 
                placeholder="e.g. Blankets &amp; Wine Festival" 
                value={reqVenue} 
                onChange={(e) => setReqVenue(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', padding: '6px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Request Details (Optional)</label>
              <textarea 
                placeholder="Message for automated IP check..." 
                value={reqMsg} 
                onChange={(e) => setReqMsg(e.target.value)}
                className="form-control"
                style={{ width: '100%', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', padding: '6px', height: '60px', resize: 'none' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', padding: '10px', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', marginTop: '6px' }}
            >
              Verify IP &amp; Grant Drop License
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ================= SUB-PANEL: Sync Licensing Marketplace (Phase 6) =================
function SyncLicensingPanel() {
  const [activeMood, setActiveMood] = useState('all');
  const [playingTrack, setPlayingTrack] = useState(null);
  
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
      <div className="dashboard-panel-header">
        <h2>Sync Licensing &amp; Scene-tag Hub</h2>
        <p>Pitch tracks for films, games, and commercials using AI scene tagging and 30-second watermarked streams.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
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

        {/* Tracks display */}
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
                          <RefreshCw size={10} className="spin-animation" style={{ marginRight: '4px' }} />
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

// ================= Main App Content Component =================
function AppContent({ sessionUser, handleLogin, handleLogout, getFooterLocation }) {
  const [scrolled, setScrolled] = useState(false);
  const { country } = useRegion();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastNonAuthPath, setLastNonAuthPath] = useState('/');

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
          <Route path="/native-apps/:slug" element={<NativeAppLandingView />} />
          <Route path="/for" element={<PerfectForPageView />} />
          <Route path="/for/:role" element={<RoleLandingView />} />
          <Route path="/pricing" element={<PricingView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/help" element={<HelpView />} />
          <Route path="/stream" element={<StreamView />} />
          <Route path="/login" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/register" element={<div style={{ minHeight: '80vh' }} />} />
          <Route path="/dashboard/*" element={<DashboardView sessionUser={sessionUser} onLogout={handleLogout} onUpdateUser={handleLogin} />} />
        </Routes>

        {/* Detailed Footer similar to Intermaven - with second instance of Logo */}
        <footer className="landing-footer">
          <div className="footer-inner-container">
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
                  <h4>Product</h4>
                  <div className="footer-links">
                    <Link to="/tools" className="footer-link">AI Tools</Link>
                    <Link to="/apps" className="footer-link">Dashboard Apps</Link>
                    <Link to="/native-apps" className="footer-link">Native Apps</Link>
                    <Link to="/pricing" className="footer-link">Credit Packages</Link>
                    <a href="#dev" className="footer-link" onClick={() => alert('API developers portal coming in Phase 3.')}>API &amp; Developers</a>
                  </div>
                </div>
              </div>

              {/* Company links */}
              <div className="footer-col">
                <div style={{ display: 'inline-block', textAlign: 'left' }}>
                  <h4>Company</h4>
                  <div className="footer-links">
                    <Link to="/about" className="footer-link">About Us</Link>
                    <Link to="/for" className="footer-link">Perfect For</Link>
                    <a href="#blog" className="footer-link" onClick={() => alert('Blog coming soon')}>Blog</a>
                    <a href="#careers" className="footer-link" onClick={() => alert('Careers coming soon')}>Careers</a>
                    <Link to="/about" className="footer-link">Contact</Link>
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
      />
    </Router>
  );
}

export default App;
