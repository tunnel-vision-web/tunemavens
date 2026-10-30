import React from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'

import CreatorLandingPage from './role-pages/CreatorLandingPage.jsx'
import LabelLandingPage from './role-pages/LabelLandingPage.jsx'
import DjLandingPage from './role-pages/DjLandingPage.jsx'
import SupervisorLandingPage from './role-pages/SupervisorLandingPage.jsx'
import ConsumerLandingPage from './role-pages/ConsumerLandingPage.jsx'
import MediaHouseLandingPage from './role-pages/MediaHouseLandingPage.jsx'
import CorporateLandingPage from './role-pages/CorporateLandingPage.jsx'
import VcLandingPage from './role-pages/VcLandingPage.jsx'
import { CANONICAL_ROLES } from '../../data/landingPageRegistry.js'

function PersonaSwitcherToolbar({ activeRole, search, isScrolled }) {
  return (
    <nav 
      className="role-switcher-bar" 
      aria-label="Audience persona switcher" 
      data-testid="role-switcher-toolbar" 
      style={{
        position: 'sticky',
        top: isScrolled ? '70px' : '80px',
        zIndex: 99,
        background: 'rgba(6, 8, 19, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 24px',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        scrollbarWidth: 'none',
        transition: 'top 0.25s ease',
      }}
    >
      <span style={{ color: 'var(--mu, #8b949e)', fontWeight: 600, marginRight: '4px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}>
        Seat:
      </span>
      {CANONICAL_ROLES.map((r) => {
        const isActive = activeRole === r.key;
        return (
          <Link
            key={r.key}
            to={`${r.href}${search || ''}`}
            data-testid={`role-switch-${r.key}`}
            style={{
              padding: '6px 12px',
              borderRadius: '3px',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#060813' : '#e6edf3',
              background: isActive ? (r.color || 'var(--cyan, #00f0ff)') : 'rgba(255, 255, 255, 0.05)',
              border: isActive ? `1px solid ${r.color || 'var(--cyan, #00f0ff)'}` : '1px solid rgba(255, 255, 255, 0.12)',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>{r.label}</span>
          </Link>
        );
      })}
      <Link
        to={`/for${search || ''}`}
        style={{
          marginLeft: 'auto',
          padding: '5px 12px',
          borderRadius: '3px',
          color: 'var(--cyan, #00f0ff)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          background: 'rgba(34, 211, 238, 0.06)',
          textDecoration: 'none',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.15s ease'
        }}
      >
        All Seats →
      </Link>
    </nav>
  );
}

export default function RoleLandingView() {
  const { role } = useParams();
  const location = useLocation();
  const normalized = (role || '').toLowerCase().trim();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Normalize aliases to canonical role keys
  let canonicalKey = normalized;
  if (['artist', 'producer'].includes(normalized)) canonicalKey = 'creator';
  if (['exec', 'manager'].includes(normalized)) canonicalKey = 'label';
  if (['booking-agent', 'booking'].includes(normalized)) canonicalKey = 'dj';
  if (['studio'].includes(normalized)) canonicalKey = 'supervisor';
  if (['listener', 'listeners'].includes(normalized)) canonicalKey = 'consumer';
  if (['media_house', 'media', 'broadcaster'].includes(normalized)) canonicalKey = 'media-house';
  if (['brand', 'brands'].includes(normalized)) canonicalKey = 'corporate';
  if (['vc', 'investor', 'venture', 'syndicate'].includes(normalized)) canonicalKey = 'vc';

  const switcher = (
    <PersonaSwitcherToolbar
      activeRole={canonicalKey}
      search={location.search}
      isScrolled={isScrolled}
    />
  );

  const renderContent = () => {
    switch (canonicalKey) {
      case 'creator':
        return <CreatorLandingPage switcher={switcher} />;

      case 'label':
        return <LabelLandingPage switcher={switcher} />;

      case 'dj':
        return <DjLandingPage switcher={switcher} />;

      case 'supervisor':
        return <SupervisorLandingPage switcher={switcher} />;

      case 'consumer':
        return <ConsumerLandingPage switcher={switcher} />;

      case 'media-house':
        return <MediaHouseLandingPage switcher={switcher} />;

      case 'corporate':
        return <CorporateLandingPage switcher={switcher} />;

      case 'vc':
        return <VcLandingPage switcher={switcher} />;

      default:
        return (
          <div className="landing-section landing-section-alt" data-testid="role-landing-not-found" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ textAlign: 'center', padding: '80px 24px', maxWidth: '640px', margin: '0 auto' }}>
              <span className="landing-section-eyebrow" style={{ color: 'var(--cyan)', fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                Persona Not Found
              </span>
              <h1 className="landing-section-title" style={{ fontFamily: 'Sansation', fontSize: '32px', marginTop: 12, color: '#fff' }}>
                We don't have a dedicated landing page for "{role}".
              </h1>
              <p className="landing-lede" style={{ margin: '16px auto 32px', color: 'var(--mu)', fontSize: '16px', lineHeight: 1.6 }}>
                Explore our complete suite of 7 specialized industry seats to discover the tools built for your specific role.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link to={`/for${location.search}`} className="btn btn-primary" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#060813', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}>
                  Browse All Seats
                </Link>
                <Link to={`/${location.search}`} className="btn btn-secondary" style={{ padding: '10px 24px', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="role-landing-container">
      {renderContent()}
    </div>
  );
}
