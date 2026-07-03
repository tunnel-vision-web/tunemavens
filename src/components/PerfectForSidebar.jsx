import { Link, useLocation } from 'react-router-dom';
import { Headphones, Mic2, Briefcase, Film, Users, UserCheck } from 'lucide-react';

export const PERFECT_FOR_ROLES = [
  { key: 'creator', label: 'Creators', sub: 'Artists · Podcasters · DJs', href: '/for/creator', Icon: Mic2, accent: 'var(--cyan)' },
  { key: 'exec', label: 'Execs', sub: 'Label · A&R · Industry', href: '/for/exec', Icon: Briefcase, accent: 'var(--purple)' },
  { key: 'supervisor', label: 'Music Supervisors', sub: 'Sync licensing for film & TV', href: '/for/supervisor', Icon: Film, accent: 'var(--am)' },
  { key: 'consumer', label: 'Consumers', sub: 'Everyday listeners', href: '/native-apps/tunemavens', Icon: Headphones, accent: 'var(--gr)' },
  { key: 'booking-agent', label: 'Booking Agents', sub: 'Book & represent live acts', href: '/for/booking-agent', Icon: Users, accent: 'var(--blue)' },
  { key: 'manager', label: 'Managers', sub: 'Day-to-day artist teams', href: '/for/manager', Icon: UserCheck, accent: '#ef4444' },
];

const LANDING_ROUTE_PREFIXES = [
  { exact: '/' }, { exact: '/pricing' }, { exact: '/about' }, { exact: '/help' }, { exact: '/tools' }, { exact: '/apps' }, { exact: '/native-apps' },
  { prefix: '/native-apps/' }, { prefix: '/for/' },
];

function shouldRenderOnPath(pathname) {
  return LANDING_ROUTE_PREFIXES.some(({ exact, prefix }) => (exact && pathname === exact) || (prefix && pathname.startsWith(prefix)));
}

export function PerfectForSidebar() {
  const { pathname } = useLocation();
  if (!shouldRenderOnPath(pathname)) return null;

  return (
    <aside className="pf-sidebar" aria-label="Perfect for">
      <div className="pf-sidebar-header">Perfect for</div>
      <div className="pf-scroll-container">
        <div className="pf-scroll-content">
          {PERFECT_FOR_ROLES.map((role) => {
            const active = pathname === role.href;
            return (
              <Link key={role.key} to={role.href} className={`pf-tile ${active ? 'pf-tile-active' : ''}`} style={{ '--pf-accent': role.accent }}>
                <span className="pf-tile-logo"><role.Icon size={22} strokeWidth={1.8} /></span>
                <span className="pf-tile-label">{role.label}</span>
                <span className="pf-tile-sub">{role.sub}</span>
              </Link>
            );
          })}
          {/* Duplicate for seamless continuous upward scroll */}
          {PERFECT_FOR_ROLES.map((role) => {
            const active = pathname === role.href;
            return (
              <Link key={`${role.key}-dup`} to={role.href} className={`pf-tile ${active ? 'pf-tile-active' : ''}`} style={{ '--pf-accent': role.accent }}>
                <span className="pf-tile-logo"><role.Icon size={22} strokeWidth={1.8} /></span>
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