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

export const ROLE_LOGOS = {
  creator: createLogo,
  exec: syncLogo,
  supervisor: distributeLogo,
  consumer: listenLogo,
  'booking-agent': bookingLogo,
  manager: managementLogo,
  companion: companionLogo,
  tunepay: tunepayLogo,
};

export const PERFECT_FOR_ROLES = [
  { key: 'creator', label: 'Creators', sub: 'Artists · Podcasters · DJs', href: '/for/creator', accent: 'var(--cyan)' },
  { key: 'exec', label: 'Execs', sub: 'Label · A&R · Industry', href: '/for/exec', accent: 'var(--purple)' },
  { key: 'supervisor', label: 'Music Supervisors', sub: 'Sync licensing for film & TV', href: '/for/supervisor', accent: 'var(--am)' },
  { key: 'consumer', label: 'tunestream', sub: 'Everyday listeners', href: '/native-apps/tunemavens', accent: 'var(--gr)' },
  { key: 'booking-agent', label: 'Booking Agents', sub: 'Book & represent live acts', href: '/for/booking-agent', accent: 'var(--blue)' },
  { key: 'manager', label: 'Managers', sub: 'Day-to-day artist teams', href: '/for/manager', accent: '#ef4444' },
  { key: 'companion', label: 'tunecompanion', sub: 'Artists & Managers', href: '/native-apps/creator-companion', accent: 'var(--purple)' },
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
    <aside className="pf-sidebar" aria-label="Perfect for" data-testid="perfect-for-sidebar">
      <h3 className="pf-sidebar-header" data-testid="perfect-for-header">Perfect for</h3>
      <div 
        className="pf-scroll-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`pf-scroll-content ${isPaused ? 'paused' : ''}`}>
          {PERFECT_FOR_ROLES.map((role) => {
            const active = pathname === role.href;
            return (
              <Link 
                key={role.key} 
                to={role.href} 
                className={`pf-tile ${active ? 'pf-tile-active' : ''}`} 
                style={{ '--pf-accent': role.accent }}
                data-testid={`perfect-for-tile-${role.key}`}
              >
                <span className="pf-tile-logo">
                  <img src={ROLE_LOGOS[role.key]} alt={role.label} />
                </span>
                <span className="pf-tile-label">{role.label}</span>
                <span className="pf-tile-sub">{role.sub}</span>
              </Link>
            );
          })}
          {/* Duplicate for seamless continuous upward scroll */}
          {PERFECT_FOR_ROLES.map((role) => {
            const active = pathname === role.href;
            return (
              <Link 
                key={`${role.key}-dup`} 
                to={role.href} 
                className={`pf-tile ${active ? 'pf-tile-active' : ''}`} 
                style={{ '--pf-accent': role.accent }}
                data-testid={`perfect-for-tile-${role.key}-dup`}
              >
                <span className="pf-tile-logo">
                  <img src={ROLE_LOGOS[role.key]} alt={role.label} />
                </span>
                <span className="pf-tile-label">{role.label}</span>
                <span className="pf-tile-sub">{role.sub}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
export default PerfectForSidebar;