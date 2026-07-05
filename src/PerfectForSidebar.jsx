/**
 * PerfectForSidebar - Simplified JS Scroll
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Headphones, Mic2, Briefcase, Film, Users, UserCheck,
} from 'lucide-react';

export const PERFECT_FOR_ROLES = [ /* same array as before */ ];

const LANDING_ROUTE_PREFIXES = [ /* same as before */ ];

function shouldRenderOnPath(pathname) {
  return LANDING_ROUTE_PREFIXES.some(({ exact, prefix }) => exact && pathname === exact || prefix && pathname.startsWith(prefix));
}

function PfTile({ role, active, duplicate }) {
  const { key, label, sub, href, Icon, accent } = role;
  return (
    <Link to={href} className={`pf-tile${active ? ' pf-tile-active' : ''}`} style={{ '--pf-accent': accent }} aria-hidden={duplicate}>
      <span className="pf-tile-logo"><Icon size={22} strokeWidth={1.8} /></span>
      <span className="pf-tile-label">{label}</span>
      <span className="pf-tile-sub">{sub}</span>
    </Link>
  );
}

export function PerfectForSidebar() {
  const { pathname } = useLocation();
  if (!shouldRenderOnPath(pathname)) return null;

  return (
    <aside className="pf-sidebar">
      <div className="pf-sidebar-inner">
        <h3 className="pf-sidebar-header">Perfect for</h3>
        <div className="pf-sidebar-viewport">
          <PerfectForTrack roles={PERFECT_FOR_ROLES} pathname={pathname} />
        </div>
      </div>
    </aside>
  );
}

function PerfectForTrack({ roles, pathname }) {
  const trackRef = React.useRef(null);
  const positionRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalHeight = track.scrollHeight / 2 || 800;
    let lastTimestamp = 0;

    const animate = (timestamp) => {
      if (lastTimestamp === 0) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!paused) {
        positionRef.current += 0.5; // smooth speed — adjust
        if (positionRef.current >= totalHeight) positionRef.current = 0;
        track.style.transform = `translateY(-${positionRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  return (
    <div
      ref={trackRef}
      className="pf-sidebar-track"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ willChange: 'transform' }}
    >
      {roles.map(r => <PfTile key={r.key} role={r} active={pathname === r.href} />)}
      {roles.map(r => <PfTile key={`${r.key}-dup`} role={r} active={pathname === r.href} duplicate />)}
    </div>
  );
}

export default PerfectForSidebar;