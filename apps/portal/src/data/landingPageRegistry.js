/**
 * Authoritative Landing Page Registry (Spec §3)
 *
 * One configuration entry per role page:
 * slug, product, audience, headline, proof points, primary CTA, signup role,
 * default currency and locale, Open Graph image, canonical URL, sitemap flag.
 */
import rawRegistry from '../../../../shared/landing_page_registry.json';

export const LANDING_PAGE_REGISTRY = rawRegistry;

export function getLandingPage(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
  return (
    LANDING_PAGE_REGISTRY.find(p => p.slug === clean) ||
    LANDING_PAGE_REGISTRY.find(p => (p.aliases || []).map(a => a.toLowerCase().replace(/^\/+|\/+$/g, '')).includes(clean)) ||
    null
  );
}

export const CANONICAL_ROLES = [
  { key: 'creator', label: 'Creators', sub: 'Artists & Producers', href: '/for/creator', color: '#00f0ff' },
  { key: 'podcaster', label: 'Podcasters', sub: 'Shows & Sponsorships', href: '/for/podcaster', color: '#00f2fe' },
  { key: 'label', label: 'Record Labels', sub: 'Roster & Recoupment', href: '/for/label', color: '#a855f7' },
  { key: 'dj', label: 'DJs', sub: 'Promo Pool Engine', href: '/for/dj', color: '#14b8a6' },
  { key: 'media-house', label: 'Media Houses', sub: 'Broadcast & Sync', href: '/for/media-house', color: '#0ea5e9' },
  { key: 'supervisor', label: 'Music Supervisors', sub: 'Pre-Cleared Sync', href: '/for/supervisor', color: '#f59e0b' },
  { key: 'consumer', label: 'Listeners', sub: 'TuneStream Fan Tipping', href: '/for/consumer', color: '#10b981' },
  { key: 'corporate', label: 'Corporate Brands', sub: 'Audio Sponsorships', href: '/for/corporate', color: '#ef4444' },
  { key: 'vc', label: 'Venture Capitalists', sub: 'Tour & Career Financing', href: '/for/vc', color: '#10b981' },
];
