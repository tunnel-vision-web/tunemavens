/**
 * PerfectForSidebar
 *
 * Left rail that sits beside the main content column on landing routes
 * (1/4 width on desktop, hidden on mobile — a horizontal picker will
 * replace it there in a later pass).
 *
 * Behaviour spec (updated per PRD — continuous auto-scroll):
 *   - Header: "Perfect for"
 *   - One card per user role, linking to that role's landing page
 *   - Cards scroll upward in a smooth, continuous, seamless loop —
 *     slow enough to read each card as it passes
 *   - Scroll pauses on hover, resumes automatically on mouse-out
 *   - Top and bottom edges fade the cards into the sidebar's dark
 *     background via gradient masks
 *   - 3px border radius, flat theme colours, hover swaps to the tile's
 *     accent colour (no gradients on the tiles themselves — per design
 *     guidelines)
 *
 * Real logos will replace the placeholder icons later. The `logo`
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
 * Order the primary audience (Creators) first, then rotates through
 * the roles as they were requested in the PRD.
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

/**
 * Single card. `duplicate` marks the second (visual-only) copy used
 * to make the scroll loop seamless — it's hidden from assistive tech
 * and removed from tab order so keyboard/screen-reader users only
 * ever encounter each role once.
 */
function PfTile({ role, active, duplicate }) {
  const { key, label, sub, href, Icon, accent } = role;
  return (
    <Link
      to={href}
      className={`pf-tile${active ? ' pf-tile-active' : ''}`}
      style={{ '--pf-accent': accent }}
      data-testid={duplicate ? undefined : `perfect-for-tile-${key}`}
      aria-hidden={duplicate ? 'true' : undefined}
      tabIndex={duplicate ? -1 : undefined}
    >
      <span className="pf-tile-logo" aria-hidden="true">
        {/* Placeholder — swap for real logo later. */}
        <Icon size={20} strokeWidth={1.8} />
      </span>
      <span className="pf-tile-copy">
        <span className="pf-tile-label">{label}</span>
        <span className="pf-tile-sub">{sub}</span>
      </span>
    </Link>
  );
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

        {/* Viewport clips the track and hosts the top/bottom fade
            masks. The track itself is twice the role list, animated
            upward by exactly 50% of its own height so the loop reads
            as one continuous, seamless scroll. */}
        <div className="pf-sidebar-viewport">
          <div className="pf-sidebar-track">
            {PERFECT_FOR_ROLES.map((role) => (
              <PfTile key={role.key} role={role} active={pathname === role.href} />
            ))}
            {PERFECT_FOR_ROLES.map((role) => (
              <PfTile key={`${role.key}-dup`} role={role} active={pathname === role.href} duplicate />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default PerfectForSidebar;
