/**
 * PerfectForSidebar
 *
 * Persistent left rail on every landing page (1/4 width on desktop,
 * hidden on mobile — a horizontal picker will replace it there in a
 * later pass).
 *
 * Behaviour spec (from PRD §Landing Pages + Sidebar):
 *   - Header: "Perfect for"
 *   - One square tile per user role, linking to that role's landing page
 *   - Tiles slide down from the top with a staggered delay (80ms per tile)
 *   - 3px border radius, flat theme colours, hover swaps to the tile's
 *     accent colour (no gradients — per design guidelines)
 *   - Logo placeholder on top, short description underneath, both
 *     horizontally centred
 *
 * Real logos will replace the placeholder squares later. The `logo`
 * prop on each entry is where they'll plug in.
 */

import { Link, useLocation } from 'react-router-dom';
import {
  Headphones,   // Consumers (listeners)
  Mic2,         // Creators (artists / podcasters / DJs)
  Briefcase,    // Execs
  Film,         // Music Supervisors (sync)
  Users,        // Booking Agents
  UserCheck,    // Managers
} from 'lucide-react';

/**
 * Ordered so the slide-down cascade lands the primary audience
 * (Creators) first, then rotates through the roles as they were
 * requested in the PRD.
 */
export const PERFECT_FOR_ROLES = [
  {
    key: 'creator',
    label: 'Creators',
    sub: 'Artists · Podcasters · DJs',
    href: '/for/creator',
    Icon: Mic2,
    accent: 'var(--cyan)',
  },
  {
    key: 'exec',
    label: 'Execs',
    sub: 'Label · A&R · Industry',
    href: '/for/exec',
    Icon: Briefcase,
    accent: 'var(--purple)',
  },
  {
    key: 'supervisor',
    label: 'Music Supervisors',
    sub: 'Sync licensing for film & TV',
    href: '/for/supervisor',
    Icon: Film,
    accent: 'var(--am)',
  },
  {
    key: 'consumer',
    label: 'Consumers',
    sub: 'Everyday listeners',
    // Consumer landing == TuneMavens listeners app landing (PRD).
    href: '/native-apps/tunemavens',
    Icon: Headphones,
    accent: 'var(--gr)',
  },
  {
    key: 'booking-agent',
    label: 'Booking Agents',
    sub: 'Book & represent live acts',
    href: '/for/booking-agent',
    Icon: Users,
    accent: 'var(--blue)',
  },
  {
    key: 'manager',
    label: 'Managers',
    sub: 'Day-to-day artist teams',
    href: '/for/manager',
    Icon: UserCheck,
    accent: '#ef4444',
  },
];

/**
 * Routes where the sidebar should render. Kept explicit so we don't
 * leak the rail into the dashboard, login pages, etc.
 */
const LANDING_ROUTE_PREFIXES = [
  { exact: '/' },
  { exact: '/pricing' },
  { exact: '/about' },
  { exact: '/help' },
  { exact: '/tools' },
  { exact: '/apps' },
  { exact: '/native-apps' },
  { prefix: '/native-apps/' },
  { prefix: '/for/' },
];

function shouldRenderOnPath(pathname) {
  return LANDING_ROUTE_PREFIXES.some(({ exact, prefix }) => {
    if (exact && pathname === exact) return true;
    if (prefix && pathname.startsWith(prefix)) return true;
    return false;
  });
}

export function PerfectForSidebar() {
  const { pathname } = useLocation();
  if (!shouldRenderOnPath(pathname)) return null;

  return (
    <aside className="pf-sidebar" data-testid="perfect-for-sidebar" aria-label="Perfect for">
      <div className="pf-sidebar-inner">
        <h3 className="pf-sidebar-header" data-testid="perfect-for-header">
          Perfect for
        </h3>
        <div className="pf-sidebar-grid">
          {PERFECT_FOR_ROLES.map(({ key, label, sub, href, Icon, accent }, i) => {
            const active = pathname === href;
            return (
              <Link
                key={key}
                to={href}
                className={`pf-tile${active ? ' pf-tile-active' : ''}`}
                style={{
                  // Custom property drives hover + active state colour.
                  '--pf-accent': accent,
                  // Staggered slide-down: 80ms per tile after a short
                  // opening beat so the whole rail reads as a wave.
                  animationDelay: `${120 + i * 80}ms`,
                }}
                data-testid={`perfect-for-tile-${key}`}
              >
                <span className="pf-tile-logo" aria-hidden="true">
                  {/* Placeholder — swap for real logo later. */}
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="pf-tile-label">{label}</span>
                <span className="pf-tile-sub">{sub}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default PerfectForSidebar;
