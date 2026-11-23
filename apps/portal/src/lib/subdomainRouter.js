/**
 * Subdomain Routing and Ingress Engine for TuneMavens Ecosystem
 *
 * Maps subdomains (e.g. djs.tunemavens.com, labels.tunemavens.com, ndufo.tunemavens.com)
 * directly to their authoritative portals, roles, applications, or creator EPK Web Worlds.
 */

export const SUBDOMAIN_TARGETS = {
  // 1. Branded Role Portals
  djs: { role: 'dj', path: '/dashboard?role=dj', tab: 'home', label: 'DJ Pool Engine & Console' },
  dj: { role: 'dj', path: '/dashboard?role=dj', tab: 'home', label: 'DJ Pool Engine & Console' },

  labels: { role: 'label', path: '/dashboard?role=label', tab: 'home', label: 'Record Label Console' },
  label: { role: 'label', path: '/dashboard?role=label', tab: 'home', label: 'Record Label Console' },

  producers: { role: 'creator', path: '/dashboard?role=creator', tab: 'home', label: 'Producer Pipeline' },
  producer: { role: 'creator', path: '/dashboard?role=creator', tab: 'home', label: 'Producer Pipeline' },
  creators: { role: 'creator', path: '/dashboard?role=creator', tab: 'home', label: 'Creator Hub' },
  creator: { role: 'creator', path: '/dashboard?role=creator', tab: 'home', label: 'Creator Hub' },

  mediahouses: { role: 'media_house', path: '/dashboard?role=media_house', tab: 'home', label: 'Media House Routing' },
  mediahouse: { role: 'media_house', path: '/dashboard?role=media_house', tab: 'home', label: 'Media House Routing' },
  media: { role: 'media_house', path: '/dashboard?role=media_house', tab: 'home', label: 'Media House Routing' },

  podcasters: { role: 'podcaster', path: '/dashboard?role=podcaster', tab: 'home', label: 'Podcaster Studio' },
  podcaster: { role: 'podcaster', path: '/dashboard?role=podcaster', tab: 'home', label: 'Podcaster Studio' },

  supervisors: { role: 'supervisor', path: '/dashboard?role=supervisor', tab: 'home', label: 'Sync Licensing Supervisor' },
  supervisor: { role: 'supervisor', path: '/dashboard?role=supervisor', tab: 'home', label: 'Sync Licensing Supervisor' },

  corporate: { role: 'corporate', path: '/dashboard?role=corporate', tab: 'home', label: 'Corporate Brand Partner' },

  capital: { role: 'vc', path: '/dashboard?role=vc', tab: 'home', label: 'Tour Venture Capital Desk' },
  vc: { role: 'vc', path: '/dashboard?role=vc', tab: 'home', label: 'Tour Venture Capital Desk' },
  investors: { role: 'vc', path: '/dashboard?role=vc', tab: 'home', label: 'Tour Venture Capital Desk' },
  investor: { role: 'vc', path: '/dashboard?role=vc', tab: 'home', label: 'Tour Venture Capital Desk' },

  affiliates: { role: 'affiliate', path: '/affiliates', tab: 'affiliates', label: 'Affiliates Partner Network' },
  affiliate: { role: 'affiliate', path: '/affiliates', tab: 'affiliates', label: 'Affiliates Partner Network' },

  // 2. Audio Streaming & Sync Marketplaces
  stream: { role: 'consumer', path: '/stream', label: 'TuneStream Hi-Fi Web Player' },
  tunestream: { role: 'consumer', path: '/stream', external: 'https://tunestream.co', label: 'TuneStream Hub' },
  sync: { path: '/apps#sync-pitch', external: 'https://syncmavens.com', label: 'Sync Placement Briefs' },
  syncmavens: { path: '/apps#sync-pitch', external: 'https://syncmavens.com', label: 'Sync Placement Briefs' },

  // 3. Native & In-Product Apps
  app: { path: '/native-apps/tunemavens', label: 'TuneMavens Listener App' },
  companion: { path: '/native-apps/creator-companion', label: 'Creator Companion App' },
  pos: { path: '/native-apps/mpesa-pos', label: 'M-Pesa POS Terminal' },
  apps: { path: '/apps', label: 'Dashboard Apps Marketplace' },
  tools: { path: '/tools', label: 'AI Tools Suite' },
  deck: { path: '/apps#pitch-deck', label: 'Pitch Deck AI' },
  brand: { path: '/apps#brand-kit', label: 'Brand Kit AI' },
  epk: { path: '/epk', label: 'EPK Studio' },

  // 4. Admin Management
  admin: { role: 'admin', path: '/admin', label: 'Platform Administration' }
};

export const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'admin', 'mail', 'smtp', 'pop', 'imap', 'ftp', 'cname', 'dev', 'staging', 'test',
  'localhost', 'status', 'cdn', 'static', 'assets', 'ws', 'wss',
  ...Object.keys(SUBDOMAIN_TARGETS)
]);

/**
 * Extracts normalized subdomain from hostname or URLSearchParams.
 *
 * @param {string} [hostname] Optional hostname (defaults to window.location.hostname)
 * @param {string} [search] Optional search string (defaults to window.location.search)
 * @returns {string|null} The clean subdomain or null
 */
export function getSubdomain(hostname, search) {
  let host = hostname;
  let s = search;

  if (typeof window !== 'undefined') {
    if (!host) host = window.location.hostname;
    if (s === undefined) s = window.location.search || '';
  }

  if (s) {
    try {
      const params = new URLSearchParams(s);
      const subParam = params.get('subdomain');
      if (subParam) {
        return subParam.toLowerCase().trim();
      }
    } catch (_) {}
  }

  if (!host) return null;
  host = host.toLowerCase().trim();
  if (host === 'localhost' || host === '127.0.0.1') return null;

  // Ignore apex ecosystem domains
  if (
    host === 'tunemavens.com' ||
    host === 'intermaven.io' ||
    host === 'tunestream.co' ||
    host === 'syncmavens.com'
  ) {
    return null;
  }

  const parts = host.split('.');
  if (parts.length >= 2) {
    if (parts[0] === 'www') {
      return parts.length > 3 ? parts[1] : null;
    }
    return parts[0];
  }

  return null;
}

/**
 * Resolves a subdomain to its target route configuration.
 *
 * @param {string|null} subdomain The subdomain string
 * @returns {object|null} Target route configuration or null
 */
export function resolveSubdomainRoute(subdomain) {
  if (!subdomain) return null;
  const clean = subdomain.toLowerCase().trim();

  // 1. Direct matched target
  if (SUBDOMAIN_TARGETS[clean]) {
    return SUBDOMAIN_TARGETS[clean];
  }

  // 2. Creator EPK Web Worlds (any unreserved subdomain)
  if (!RESERVED_SUBDOMAINS.has(clean)) {
    return {
      isCreatorEpk: true,
      creatorSubdomain: clean,
      path: `/epk/${clean}`,
      label: `${clean.charAt(0).toUpperCase() + clean.slice(1)} Web World`
    };
  }

  return null;
}

/**
 * Convenience helper to determine the persona role implied by a subdomain.
 *
 * @param {string|null} [subdomain]
 * @returns {string|null}
 */
export function getSubdomainRole(subdomain) {
  const sub = subdomain || getSubdomain();
  const route = resolveSubdomainRoute(sub);
  return route?.role || null;
}
