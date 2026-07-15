import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RiArrowDownSFill, RiStackFill, RiSmartphoneFill, RiQuestionFill, RiMessage2Fill, RiBookOpenFill, RiCloseFill, RiMenuFill, RiCpuFill, RiCalendarEventFill, RiVolumeUpFill } from 'react-icons/ri'
import { ROLE_LOGOS, getServiceUrl } from '../PerfectForSidebar.jsx'
import RegionSwitcher from '../../RegionSwitcher.jsx'
import { useRegion } from '../../RegionContext.jsx'

// Sub-app paths that should NOT be stored as a "last tunemavens page"
const SUB_APP_PATHS = [
  '/native-apps/tunestream',
  '/native-apps/creator-companion',
  '/native-apps/tunepay',
  '/native-apps/sync-master',
];
const isSubAppPath = (path) =>
  SUB_APP_PATHS.some((p) => path.startsWith(p)) ||
  /^\/for\/[^/]+/.test(path);

const LAST_TM_PAGE_KEY = 'tunemavens_last_page';

export default function Navbar({ sessionUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const appsDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const libraryDropdownRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  // Track last visited TuneMavens page so sub-app utility links can navigate back
  useEffect(() => {
    if (!isSubAppPath(currentPath)) {
      sessionStorage.setItem(LAST_TM_PAGE_KEY, currentPath + location.search);
    }
  }, [currentPath, location.search]);

  const handleBackToTuneMavens = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const saved = sessionStorage.getItem(LAST_TM_PAGE_KEY);
    navigate(saved || '/');
  };

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
    if (pathname === '/native-apps/tunestream') {
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
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(e.target)) {
        setServicesDropdownOpen(false);
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
    if (currentPath === '/native-apps/tunestream') {
      return (
        <>
          <li>
            <Link to="/native-apps/tunestream?view=listen" className="nav-link" onClick={() => setMobileOpen(false)}>
              Listen
            </Link>
          </li>
          <li>
            <Link to="/native-apps/tunestream?view=explore" className="nav-link" onClick={() => setMobileOpen(false)}>
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
              <RiArrowDownSFill size={14} />
            </button>
            <ul className={`dropdown-menu ${libraryDropdownOpen ? 'open' : ''}`}>
              <li>
                <Link to="/native-apps/tunestream?view=playlists" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Playlists
                </Link>
              </li>
              <li>
                <Link to="/native-apps/tunestream?view=create-playlist" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Create Playlist
                </Link>
              </li>
              <li>
                <Link to="/native-apps/tunestream?view=browse-podcasts" className="dropdown-link" onClick={() => { setLibraryDropdownOpen(false); setMobileOpen(false); }}>
                  Browse Podcasts
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/native-apps/tunestream?view=apps" className="nav-link" onClick={() => setMobileOpen(false)}>
              Apps
            </Link>
          </li>
          <li>
            <Link to="/native-apps/tunestream?view=help" className="nav-link" onClick={() => setMobileOpen(false)}>
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
            <Link to={sessionUser ? "/dashboard" : "/apps"} className="nav-link" onClick={() => setMobileOpen(false)}>
              Web Console
            </Link>
          </li>
          <li>
            <Link to="/register" className="nav-link" onClick={() => setMobileOpen(false)}>
              Sign Up
            </Link>
          </li>
          <li>
            <a
              href="/"
              className="nav-link"
              style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '4px', color: '#a78bfa' }}
              onClick={handleBackToTuneMavens}
            >
              Return to TuneMavens
            </a>
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
            onClick={() => { setDropdownOpen(false); setAboutDropdownOpen(false); setServicesDropdownOpen(false); setAppsDropdownOpen(!appsDropdownOpen); }}
            data-testid="nav-apps-dropdown-trigger"
          >
            Apps
            <RiArrowDownSFill size={14} />
          </button>
          <ul className={`dropdown-menu ${appsDropdownOpen ? 'open' : ''}`}>
            <li>
              <Link
                to="/apps"
                className="dropdown-link"
                onClick={() => { setAppsDropdownOpen(false); setMobileOpen(false); }}
                data-testid="nav-apps-dashboard-link"
              >
                <RiStackFill size={16} /> Dashboard Apps
              </Link>
            </li>
            <li>
              <Link
                to="/native-apps"
                className="dropdown-link"
                onClick={() => { setAppsDropdownOpen(false); setMobileOpen(false); }}
                data-testid="nav-apps-native-link"
              >
                <RiSmartphoneFill size={16} /> Native Apps
              </Link>
            </li>
          </ul>
        </li>
        <li className="dropdown-container" ref={servicesDropdownRef}>
          <button
            className={`nav-link dropdown-trigger ${isActive('/publishing') || isActive('/tours') || isActive('/distribution') ? 'active' : ''}`}
            onClick={() => { setDropdownOpen(false); setAboutDropdownOpen(false); setAppsDropdownOpen(false); setServicesDropdownOpen(!servicesDropdownOpen); }}
            data-testid="nav-services-dropdown-trigger"
          >
            Services
            <RiArrowDownSFill size={14} />
          </button>
          <ul className={`dropdown-menu ${servicesDropdownOpen ? 'open' : ''}`}>
            <li>
              <Link
                to="/publishing"
                className="dropdown-link"
                onClick={() => { setServicesDropdownOpen(false); setMobileOpen(false); }}
              >
                <RiBookOpenFill size={16} /> Publishing
              </Link>
            </li>
            <li>
              <Link
                to="/tours"
                className="dropdown-link"
                onClick={() => { setServicesDropdownOpen(false); setMobileOpen(false); }}
              >
                <RiCalendarEventFill size={16} /> Tours
              </Link>
            </li>
            <li>
              <Link
                to="/distribution"
                className="dropdown-link"
                onClick={() => { setServicesDropdownOpen(false); setMobileOpen(false); }}
              >
                <RiVolumeUpFill size={16} /> Distribution
              </Link>
            </li>
            <li>
              <a
                href={getServiceUrl('syncmavens')}
                className="dropdown-link"
                onClick={() => { setServicesDropdownOpen(false); setMobileOpen(false); }}
              >
                <RiVolumeUpFill size={16} /> Sync Placement
              </a>
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
            onClick={() => { setDropdownOpen(false); setAppsDropdownOpen(false); setServicesDropdownOpen(false); setAboutDropdownOpen(!aboutDropdownOpen); }}
          >
            About
            <RiArrowDownSFill size={14} />
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
            onClick={() => { setAppsDropdownOpen(false); setAboutDropdownOpen(false); setServicesDropdownOpen(false); setDropdownOpen(!dropdownOpen); }}
          >
            Support & Community
            <RiArrowDownSFill size={14} />
          </button>
          <ul className={`dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
            <li>
              <Link to="/help" className="dropdown-link" onClick={() => { setDropdownOpen(false); setMobileOpen(false); }}>
                <RiQuestionFill size={16} /> Help Center
              </Link>
            </li>
            <li>
              <a href="#forum" className="dropdown-link" onClick={() => { alert('TuneMavens Community Forum shares the Intermaven account profile and will launch in Phase 2.'); setDropdownOpen(false); setMobileOpen(false); }}>
                <RiMessage2Fill size={16} /> Creator Forum
              </a>
            </li>
            <li>
              <a href="#blog" className="dropdown-link" onClick={() => { alert('Creator stories and news blog coming soon.'); setDropdownOpen(false); setMobileOpen(false); }}>
                <RiBookOpenFill size={16} /> Blog & Articles
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
            <a
              href="/"
              onClick={handleBackToTuneMavens}
              style={{ fontSize: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', textAlign: 'center', marginTop: '-12px' }}
              data-testid="navbar-back-to-tunemavens"
            >
              {"<< a tunemavens utility"}
            </a>
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
          {mobileOpen ? <RiCloseFill size={24} /> : <RiMenuFill size={24} />}
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
                <RiCpuFill size={14} /> Dashboard
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
