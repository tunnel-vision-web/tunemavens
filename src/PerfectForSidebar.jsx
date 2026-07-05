import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Headphones, Mic2, Briefcase, Film, Users, UserCheck } from 'lucide-react';

export const PERFECT_FOR_ROLES = [ /* your full array */ ];

const LANDING_ROUTE_PREFIXES = [ /* your prefixes */ ];

function shouldRenderOnPath(pathname) {
  return LANDING_ROUTE_PREFIXES.some(({ exact, prefix }) => (exact && pathname === exact) || (prefix && pathname.startsWith(prefix)));
}

function PfTile({ role, active, duplicate }) {
  const { key, label, sub, href, Icon, accent } = role;
  return (
    <Link
      to={href}
      className={`pf-tile${active ? ' pf-tile-active' : ''}`}
      style={{ '--pf-accent': accent }}
      aria-hidden={duplicate}
    >
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
          <div className="pf-sidebar-track">
            {PERFECT_FOR_ROLES.map((role) => <PfTile key={role.key} role={role} active={pathname === role.href} />)}
            {PERFECT_FOR_ROLES.map((role) => <PfTile key={`${role.key}-dup`} role={role} active={pathname === role.href} duplicate />)}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default PerfectForSidebar;