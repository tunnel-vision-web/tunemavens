import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import "./PerfectForSidebar.css";

// Import custom logos
import createLogo from '../assets/logos/tunecreators-logo.png';
import listenLogo from '../assets/logos/tunestream-logo.png';
import distributeLogo from '../assets/logos/tuneexecs-logo.png';
import syncLogo from '../assets/logos/syncmavens-logo.png';
import bookingLogo from '../assets/logos/tunebooking-logo.png';
import managementLogo from '../assets/logos/tunemanagement-logo.png';
import companionLogo from '../assets/logos/tunecompanion-logo.png';
import tunepayLogo from '../assets/logos/tunepay-logo.png';

export const getServiceUrl = (service, path = '/') => {
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const ports = {
      portal: '3000',
      tunestream: '3001',
      syncmavens: '3002',
    };
    return `${protocol}//${hostname}:${ports[service]}${path}`;
  }
  const domains = {
    portal: 'tunemavens.com',
    tunestream: 'tunestream.co',
    syncmavens: 'syncmavens.com',
  };
  return `${protocol}//${domains[service]}${path}`;
};

export const getIntermavenUrl = (appId, path = '') => {
  const { hostname, protocol } = window.location;
  const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('token') || localStorage.getItem('tunemavens_token') || sessionStorage.getItem('token') || '';
  const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : '';
  
  const appMapping = {
    'social-ai': 'social',
    'intermaven-social-ai': 'social',
    'brandkit-ai': 'brandkit',
    'intermaven-brandkit-ai': 'brandkit',
    'smart-crm': 'crm',
    'intermaven-smart-crm': 'crm',
    'pitch-deck-ai': 'bizpitch',
    'intermaven-pitch-deck-ai': 'bizpitch',
    'pos-system': 'pos',
    'intermaven-pos-system': 'pos',
    'invoicing-payments': 'invoicing',
    'intermaven-invoicing-payments': 'invoicing',
    'contracts': 'contracts',
    'intermaven-contracts': 'contracts'
  };
  
  const mappedAppId = appMapping[appId] || appId;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:3004/embed/${mappedAppId}${tokenQuery}`;
  }
  return `https://intermaven.io/embed/${mappedAppId}${tokenQuery}`;
};

export const ROLE_LOGOS = {
  creator: createLogo,
  label: distributeLogo,
  dj: bookingLogo,
  media_house: managementLogo,
  supervisor: syncLogo,
  consumer: listenLogo,
  corporate: tunepayLogo,
  // Legacy stubs for compatibility
  exec: syncLogo,
  'booking-agent': bookingLogo,
  manager: managementLogo,
  companion: companionLogo,
  tunepay: tunepayLogo,
};

export const PERFECT_FOR_ROLES = [
  { key: 'creator', label: 'Creators', sub: 'Artists & Producers', href: '/for/creator', accent: 'var(--cyan)' },
  { key: 'label', label: 'Record Labels', sub: 'Catalog Management', href: '/for/label', accent: 'var(--purple)' },
  { key: 'dj', label: 'DJs', sub: 'DJ Pool Engine', href: '/for/dj', accent: 'var(--cyan)' },
  { key: 'media_house', label: 'Media Houses', sub: 'Broadcast & Playlisting', href: '/for/media-house', accent: 'var(--blue)' },
  { key: 'supervisor', label: 'Music Supervisors', sub: 'SyncMavens Licensing', href: getServiceUrl('syncmavens'), isExternal: true, accent: 'var(--am)' },
  { key: 'consumer', label: 'tunestream', sub: 'Everyday Listeners', href: '/native-apps/tunestream', accent: 'var(--gr)' },
  { key: 'corporate', label: 'Corporate', sub: 'Sponsorships & Ads', href: '/for/corporate', accent: '#ef4444' },
];

const LANDING_ROUTE_PREFIXES = [
  { exact: '/' }, { exact: '/pricing' }, { exact: '/help' }, { exact: '/tools' }, { exact: '/apps' }, { exact: '/native-apps' },
  { prefix: '/native-apps/' }, { prefix: '/for/' },
];

function shouldRenderOnPath(pathname) {
  return LANDING_ROUTE_PREFIXES.some(({ exact, prefix }) => (exact && pathname === exact) || (prefix && pathname.startsWith(prefix)));
}

export function PerfectForSidebar() {
  const { pathname } = useLocation();
  if (!shouldRenderOnPath(pathname)) return null;

  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="pf-carousel-section" aria-label="Perfect for" data-testid="perfect-for-sidebar">
      <div className="container">
        <h3 className="pf-carousel-header" data-testid="perfect-for-header">Perfect for</h3>
        <div 
          className="pf-carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`pf-carousel-track ${isPaused ? 'paused' : ''}`}>
            {PERFECT_FOR_ROLES.map((role) => {
              const active = pathname === role.href;
              const content = (
                <>
                  <span className="pf-tile-logo">
                    <img src={ROLE_LOGOS[role.key]} alt={role.label} />
                  </span>
                  <span className="pf-tile-label">{role.label}</span>
                  <span className="pf-tile-sub">{role.sub}</span>
                </>
              );

              if (role.isExternal) {
                return (
                  <a 
                    key={role.key} 
                    href={role.href} 
                    className={`pf-carousel-tile ${active ? 'pf-tile-active' : ''}`} 
                    style={{ '--pf-accent': role.accent }}
                    data-testid={`perfect-for-tile-${role.key}`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link 
                  key={role.key} 
                  to={role.href} 
                  className={`pf-carousel-tile ${active ? 'pf-tile-active' : ''}`} 
                  style={{ '--pf-accent': role.accent }}
                  data-testid={`perfect-for-tile-${role.key}`}
                >
                  {content}
                </Link>
              );
            })}
            {/* Duplicate for seamless continuous horizontal scroll */}
            {PERFECT_FOR_ROLES.map((role) => {
              const active = pathname === role.href;
              const content = (
                <>
                  <span className="pf-tile-logo">
                    <img src={ROLE_LOGOS[role.key]} alt={role.label} />
                  </span>
                  <span className="pf-tile-label">{role.label}</span>
                  <span className="pf-tile-sub">{role.sub}</span>
                </>
              );

              if (role.isExternal) {
                return (
                  <a 
                    key={`${role.key}-dup`} 
                    href={role.href} 
                    className={`pf-carousel-tile ${active ? 'pf-tile-active' : ''}`} 
                    style={{ '--pf-accent': role.accent }}
                    data-testid={`perfect-for-tile-${role.key}-dup`}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link 
                  key={`${role.key}-dup`} 
                  to={role.href} 
                  className={`pf-carousel-tile ${active ? 'pf-tile-active' : ''}`} 
                  style={{ '--pf-accent': role.accent }}
                  data-testid={`perfect-for-tile-${role.key}-dup`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
export default PerfectForSidebar;