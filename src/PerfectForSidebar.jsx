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

export const PERFECT_FOR_ROLES = [
  {
    key: 'creator',
    label: 'Creators',
    sub: 'Artists, DJs, Podcasters',
    href: '/for/creator',
    Icon: Mic2,
    accent: 'var(--cyan)',
  },
  {
    key: 'exec',
    label: 'Execs',
    sub: 'Label, A&R, Industry',
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
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span className="pf-tile-label">{label}</span>
      <span className="pf-tile-sub">{sub}</span>
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

        <div className="pf-sidebar-viewport">
          <PerfectForTrack roles={PERFECT_FOR_ROLES} pathname={pathname} />
        </div>
      </div>
    </aside>
  );
}

function PerfectForTrack({ roles, pathname }) {
  const trackRef = React.useRef(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const positionRef = React.useRef(0);
  const animationRef = React.useRef(null);
  const lastTimeRef = React.useRef(0);

  const scrollSpeed = 28; // px per second — tune as needed (slower = higher number)

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalHeight = track.scrollHeight / 2; // since duplicated

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused) {
        positionRef.current += (scrollSpeed * delta) / 1000;

        // Seamless loop
        if (positionRef.current >= totalHeight) {
          positionRef.current = 0;
        }

        track.style.transform = `translateY(-${positionRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => {
    setIsPaused(false);
    lastTimeRef.current = 0; // smooth resume
  };

  return (
    <div
      className="pf-sidebar-track"
      ref={trackRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
    >
      {roles.map((role) => (
        <PfTile key={role.key} role={role} active={pathname === role.href} />
      ))}
      {roles.map((role) => (
        <PfTile key={`${role.key}-dup`} role={role} active={pathname === role.href} duplicate />
      ))}
    </div>
  );
}

export default PerfectForSidebar;
