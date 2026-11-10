/**
 * Tiny fetch wrapper for the TuneMavens backend (Phase 1).
 *
 * - Uses VITE_API_BASE_URL when set (production / deployed sandbox).
 * - Falls back to same-origin (works when the SPA is served behind the same
 *   ingress as the FastAPI app — i.e. via the Phase 1 nginx config in
 *   `backend/README.md`).
 * - `credentials: 'include'` so the HttpOnly access_token cookie is sent
 *   automatically once cross-subdomain cookies are configured in production.
 */
export const getApiBase = () => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '';
  if (envUrl) return envUrl.replace(/\/$/, '');

  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host.includes('tunemavens.com') || host.includes('onrender.com')) {
      return 'https://tunemavens-backend.onrender.com';
    }
  }
  return '';
};

export const BASE = getApiBase();
export const API_BASE = BASE;

// Token persistence helpers (for the Bearer-token fallback path when the
// cross-subdomain cookie isn't reachable, e.g. local dev across ports).
const TOKEN_KEY = 'tunemavens_token';
export const tokenStore = {
  get: () => 
    sessionStorage.getItem(TOKEN_KEY) || 
    localStorage.getItem(TOKEN_KEY) || 
    localStorage.getItem('token') || 
    sessionStorage.getItem('token') || '',
  set: (t) => {
    if (!t) return;
    sessionStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(TOKEN_KEY, t);
  },
  clear: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  },
};

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  // Auto-attach the Bearer token from sessionStorage if caller didn't pass one
  // explicitly. Keeps the cookie path working (production) while letting
  // local dev across ports authenticate via the stored token.
  const effectiveToken = token || tokenStore.get();
  if (effectiveToken) headers.Authorization = `Bearer ${effectiveToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (effectiveToken && path !== '/api/auth/login' && path !== '/api/auth/register') {
      tokenStore.clear();
      sessionStorage.removeItem('tunemavens_session');
    }
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    // Non-JSON body (e.g. an HTML page from a host with no API behind it)
    data = null;
  }
  if (!res.ok) {
    let msg = res.statusText;
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        msg = data.detail.map(e => {
          const locStr = e.loc ? e.loc.filter(x => x !== 'body').join('.') : '';
          return (locStr ? `${locStr}: ` : '') + e.msg;
        }).join('; ');
      } else if (typeof data.detail === 'string') {
        msg = data.detail;
      }
    }
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// --- Auth ---
export const authApi = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  demo: (role) => request(`/api/auth/demo${role ? `?role=${encodeURIComponent(role)}` : ''}`, { method: 'POST' }),
  me: (token) => request('/api/auth/me', { token }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  verifyEmail: (token) => request('/api/auth/verify-email', { method: 'POST', body: { token } }),
  setPassword: (payload) => request('/api/auth/set-password', { method: 'POST', body: payload }),
  requestSetupLink: (email) => request('/api/auth/request-setup-link', { method: 'POST', body: { email } }),
};

// --- Dashboard layout (§9.6) ---
export const dashboardApi = {
  getLayout: () => request('/api/dashboard/layout'),
  putLayout: (layout) =>
    request('/api/dashboard/layout', { method: 'PUT', body: { dashboard_layout: layout } }),
};

// --- Deals (§9.7) ---
export const dealsApi = {
  publishing: {
    list: (params = {}) => {
      const q = params.active_only ? '?active_only=true' : '';
      return request(`/api/deals/publishing${q}`);
    },
    create: (deal) => request('/api/deals/publishing', { method: 'POST', body: deal }),
  },
  distribution: {
    list: (params = {}) => {
      const q = params.active_only ? '?active_only=true' : '';
      return request(`/api/deals/distribution${q}`);
    },
    create: (deal) => request('/api/deals/distribution', { method: 'POST', body: deal }),
    negotiate: (proposal) => request('/api/deals/distribution/negotiate', { method: 'POST', body: proposal }),
  },
  catalogueAcquisitions: {
    list: () => request('/api/deals/catalogue-acquisitions'),
    create: (entry) =>
      request('/api/deals/catalogue-acquisitions', { method: 'POST', body: entry }),
    recoup: (id, payload) =>
      request(`/api/deals/catalogue-acquisitions/${encodeURIComponent(id)}/recoup`, { method: 'POST', body: payload }),
  },
};

// --- Contracts (negotiation + e-sign) ---
export const contractsApi = {
  list: () => request('/api/contracts'),
  get: (id) => request(`/api/contracts/${id}`),
  create: (payload) => request('/api/contracts', { method: 'POST', body: payload }),
  invite: (id, invite) => request(`/api/contracts/${id}/invite`, { method: 'POST', body: invite }),
  propose: (id, proposal) => request(`/api/contracts/${id}/propose`, { method: 'POST', body: proposal }),
  resolveProposal: (id, res) => request(`/api/contracts/${id}/resolve-proposal`, { method: 'POST', body: res }),
  sign: (id) => request(`/api/contracts/${id}/sign`, { method: 'POST' }),
  cancel: (id) => request(`/api/contracts/${id}/cancel`, { method: 'POST' }),
};

// --- Users (self-service: app activation, onboarding, recommendations) ---
export const usersApi = {
  listMyApps: () => request('/api/users/me/apps'),
  activateApp: (slug) => request('/api/users/me/apps', { method: 'POST', body: { slug } }),
  deactivateApp: (slug) => request(`/api/users/me/apps/${encodeURIComponent(slug)}`, { method: 'DELETE' }),
  syncApps: (apps) => request('/api/users/me/apps', { method: 'PUT', body: { apps } }),
  getOnboarding: () => request('/api/users/me/onboarding'),
  saveOnboarding: (payload) => request('/api/users/me/onboarding', { method: 'POST', body: payload }),
  logActivity: (event) => request('/api/users/me/activity', { method: 'POST', body: event }).catch(() => null),
  getRecommendations: (limit = 6) => request(`/api/users/me/recommendations?limit=${limit}`),
};

// --- Admin (admin role only) ---
export const adminApi = {
  becomeAdmin: () => request('/api/admin/become-admin', { method: 'POST' }),
  domainMappings: {
    list: () => request('/api/admin/domain-mappings'),
    create: (mapping) =>
      request('/api/admin/domain-mappings', { method: 'POST', body: mapping }),
    update: (id, patch) =>
      request(`/api/admin/domain-mappings/${id}`, { method: 'PUT', body: patch }),
    remove: (id) =>
      request(`/api/admin/domain-mappings/${id}`, { method: 'DELETE' }),
  },
};

// --- Social AI (creators & admins) ---
export const socialAiApi = {
  generateArt: (prompt, aspect_ratio = "1:1") =>
    request('/api/social-ai/generate-art', { method: 'POST', body: { prompt, aspect_ratio } }),
  generateVideo: (prompt, duration_seconds = 5) =>
    request('/api/social-ai/generate-video', { method: 'POST', body: { prompt, duration_seconds } }),
  listAssets: () =>
    request('/api/social-ai/assets'),
  updateAsset: (id, prompt) =>
    request(`/api/social-ai/assets/${id}`, { method: 'PUT', body: { prompt } }),
  deleteAsset: (id) =>
    request(`/api/social-ai/assets/${id}`, { method: 'DELETE' }),
};

// --- CRM (admins only) ---
export const crmApi = {
  createCampaign: (campaign) => request('/api/crm/campaigns', { method: 'POST', body: campaign }),
  listCampaigns: () => request('/api/crm/campaigns'),
  dispatchCampaign: (id) => request(`/api/crm/dispatch/${id}`, { method: 'POST' }),
};

// --- CMS Layouts & Rollbacks ---
export const cmsApi = {
  getLayout: (id) => request(`/api/cms/layouts/${id}`),
  updateLayout: (id, data) => request('/api/cms/layouts', { method: 'POST', body: { layout_id: id, data } }),
  getHistory: (id) => request(`/api/cms/layouts/${id}/history`),
  rollback: (id, version) => request(`/api/cms/layouts/${id}/rollback/${version}`, { method: 'POST' }),
};

// --- DJ Pool MVP & Clearance Hub ---
export const djPoolApi = {
  listTracks: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.genre) qs.append('genre', params.genre);
    if (params.bpm_min) qs.append('bpm_min', params.bpm_min);
    if (params.bpm_max) qs.append('bpm_max', params.bpm_max);
    if (params.key) qs.append('key', params.key);
    if (params.q) qs.append('q', params.q);
    const queryStr = qs.toString();
    return request(`/api/djpool/tracks${queryStr ? `?${queryStr}` : ''}`);
  },
  addTrack: (payload) => request('/api/djpool/tracks', { method: 'POST', body: payload }),
  submitFeedback: (payload) => request('/api/djpool/feedback', { method: 'POST', body: payload }),
  downloadTrack: (id) => request(`/api/djpool/download/${id}`, { method: 'POST' }),
  submitClearance: (payload) => request('/api/djpool/clearance', { method: 'POST', body: payload }),
  listClearances: () => request('/api/djpool/clearance'),
  approveClearance: (requestId, status) => request(`/api/djpool/clearance/${requestId}/approve`, { method: 'POST', body: { status } }),
};

// --- DJ Mixes, Track Extraction, Clearance & Split Cascade ---
export const djMixesApi = {
  listMixes: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.mine_only) qs.append('mine_only', 'true');
    if (params.genre) qs.append('genre', params.genre);
    if (params.q) qs.append('q', params.q);
    const qStr = qs.toString();
    return request(`/api/dj/mixes${qStr ? `?${qStr}` : ''}`);
  },
  getMix: (id) => request(`/api/dj/mixes/${id}`),
  createMix: (payload) => request('/api/dj/mixes', { method: 'POST', body: payload }),
  extractTracks: (payload) => request('/api/dj/mixes/extract-tracks', { method: 'POST', body: payload }),
  updateTracklist: (id, payload) => request(`/api/dj/mixes/${id}/tracklist`, { method: 'PUT', body: payload }),
  publishOriginal: (id, payload) => request(`/api/dj/mixes/${id}/publish-original`, { method: 'POST', body: payload }),
  requestClearance: (id) => request(`/api/dj/mixes/${id}/request-clearance`, { method: 'POST' }),
  signClearance: (mixId, trackId, payload) => request(`/api/dj/mixes/${mixId}/sign-clearance/${trackId}`, { method: 'POST', body: payload }),
  purchaseMix: (id, payload = {}) => request(`/api/dj/mixes/${id}/purchase`, { method: 'POST', body: payload }),
  sendMessage: (id, payload) => request(`/api/dj/mixes/${id}/messages`, { method: 'POST', body: payload }),
  getCommunication: (id) => request(`/api/dj/mixes/${id}/communication`),
  resendReminder: (id, trackId) => request(`/api/dj/mixes/${id}/resend-reminder/${trackId}`, { method: 'POST' }),
  updateTrackContact: (id, trackId, payload) => request(`/api/dj/mixes/${id}/tracks/${trackId}/contact`, { method: 'PUT', body: payload }),
};

// --- Sync Marketplace & Brief Matching (Phase 6) ---
export const syncApi = {
  listBriefs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/match/briefs${qs ? `?${qs}` : ''}`);
  },
  createBrief: (payload) => request('/api/match/briefs', { method: 'POST', body: payload }),
  listPitches: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/match/pitches${qs ? `?${qs}` : ''}`);
  },
  submitPitch: (payload) => request('/api/match/pitch', { method: 'POST', body: payload }),
  updatePitchStatus: (pitchId, statusVal, note = '') =>
    request(`/api/match/pitches/${pitchId}/status`, { method: 'POST', body: { status: statusVal, note } }),
  simulateMatch: (briefId, metadata) =>
    request('/api/match/simulate', { method: 'POST', body: { brief_id: briefId, track_metadata: metadata } }),
  getWaterfall: (syncFee, mode = 'administrator') =>
    request(`/api/match/waterfall?sync_fee=${syncFee}&mode=${mode}`),
  listCatalog: () => request('/api/match/catalog'),
  addCatalogTrack: (payload) => request('/api/match/catalog', { method: 'POST', body: payload }),
};

// --- Storage & Media Vault ---
export const storageApi = {
  uploadFile: async (file, mediaType = 'audio') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);
    const token = tokenStore.get();
    const res = await fetch(`${BASE}/api/storage/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || 'Upload failed');
    }
    return res.json();
  },
  listAssets: (mediaType = '') => request(`/api/storage/assets${mediaType ? `?media_type=${mediaType}` : ''}`),
  deleteAsset: (id) => request(`/api/storage/assets/${id}`, { method: 'DELETE' }),
};

// --- Catalogue & Artwork Management ---
export const catalogApi = {
  updateAlbumArtwork: (payload) => request('/api/catalog/albums/artwork', { method: 'POST', body: payload }),
  updateTrackAudio: (identifier, audioUrl, durationSeconds) => request(`/api/catalog/tracks/${encodeURIComponent(identifier)}/audio`, {
    method: 'PUT',
    body: { audio_url: audioUrl, duration_seconds: durationSeconds },
  }),
};

// --- Blog & Editorial Management ---
export const blogApi = {
  listArticles: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);
    if (params.tag) searchParams.append('tag', params.tag);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.skip) searchParams.append('skip', params.skip);
    const qs = searchParams.toString();
    return request(`/api/blog/articles${qs ? `?${qs}` : ''}`);
  },
  getArticle: (slug) => request(`/api/blog/articles/${encodeURIComponent(slug)}`),
  addComment: (slug, payload) => request(`/api/blog/articles/${encodeURIComponent(slug)}/comments`, {
    method: 'POST',
    body: payload,
  }),
  likeComment: (commentId) => request(`/api/blog/comments/${encodeURIComponent(commentId)}/like`, {
    method: 'POST',
  }),
  clapArticle: (slug) => request(`/api/blog/articles/${encodeURIComponent(slug)}/clap`, {
    method: 'POST',
  }),
};

// --- Affiliate Program Management ---
export const affiliatesApi = {
  getMatrix: () => request('/api/affiliates/matrix'),
  apply: (payload) => request('/api/affiliates/apply', { method: 'POST', body: payload }),
  track: (refCode) => request(`/api/affiliates/track/${encodeURIComponent(refCode)}`),
  getMe: (ref = '') => request(`/api/affiliates/me${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`),
  simulateConversion: (payload) => request('/api/affiliates/simulate-conversion', { method: 'POST', body: payload }),
  getNetwork: (refCode) => request(`/api/affiliates/network/${encodeURIComponent(refCode)}`),
  onboardUser: (payload) => request('/api/affiliates/onboard-user', { method: 'POST', body: payload }),
  getAcademy: (refCode) => request(`/api/affiliates/academy/${encodeURIComponent(refCode)}`),
  acknowledgeReading: (payload) => request('/api/affiliates/academy/acknowledge', { method: 'POST', body: payload }),
  admin: {
    getOverview: () => request('/api/affiliates/admin/overview'),
    getRoster: (params = {}) => {
      const q = new URLSearchParams();
      if (params.search) q.append('search', params.search);
      if (params.tier && params.tier !== 'all') q.append('tier', params.tier);
      if (params.status_filter && params.status_filter !== 'all') q.append('status_filter', params.status_filter);
      if (params.limit) q.append('limit', params.limit);
      const qs = q.toString();
      return request(`/api/affiliates/admin/roster${qs ? `?${qs}` : ''}`);
    },
    getLedger: (params = {}) => {
      const q = new URLSearchParams();
      if (params.ref) q.append('ref', params.ref);
      if (params.type_filter && params.type_filter !== 'all') q.append('type_filter', params.type_filter);
      if (params.limit) q.append('limit', params.limit);
      const qs = q.toString();
      return request(`/api/affiliates/admin/ledger${qs ? `?${qs}` : ''}`);
    },
    executePayout: (payload) => request('/api/affiliates/admin/payout', { method: 'POST', body: payload }),
    updateMatrix: (payload) => request('/api/affiliates/admin/matrix', { method: 'PUT', body: payload }),
    updateStatus: (affiliateId, params = {}) => {
      const q = new URLSearchParams();
      if (params.status_val) q.append('status_val', params.status_val);
      if (params.tier_val) q.append('tier_val', params.tier_val);
      return request(`/api/affiliates/admin/affiliate/${encodeURIComponent(affiliateId)}/status?${q.toString()}`, {
        method: 'PATCH'
      });
    }
  }
};

/**
 * Normalizes backend media and artwork URLs to support relative same-origin reverse-proxying.
 * Converts absolute http://localhost:8001/uploads/... or http://127.0.0.1:8001/... to /uploads/...
 */


export const publishingApi = {
  getSocieties: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.append('search', params.search);
    if (params.region && params.region !== 'all') q.append('region', params.region);
    if (params.type && params.type !== 'all') q.append('type', params.type);
    if (params.direct_only) q.append('direct_only', 'true');
    const qs = q.toString();
    return request('/api/publishing/societies' + (qs ? '?' + qs : ''));
  },
  getSociety: (id) => request('/api/publishing/societies/' + encodeURIComponent(id)),
  getStats: () => request('/api/publishing/stats'),
  getWorks: () => request('/api/publishing/works'),
  registerWork: (payload) => request('/api/publishing/works', { method: 'POST', body: payload }),
  exportCwr: (payload = {}) => request('/api/publishing/cwr-export', { method: 'POST', body: payload }),
  getAdminQueue: () => request('/api/publishing/admin/queue'),
  verifyAdminWork: (workCode) => request('/api/publishing/admin/queue/' + encodeURIComponent(workCode) + '/verify', { method: 'POST' }),
};

export const distroApi = {
  getOutlets: () => request('/api/distro/outlets'),
  getReleases: (params = {}) => {
    const q = new URLSearchParams();
    if (params.persona) q.append('persona', params.persona);
    if (params.artist) q.append('artist', params.artist);
    if (params.status && params.status !== 'all') q.append('status', params.status);
    if (params.search) q.append('search', params.search);
    const qs = q.toString();
    return request('/api/distro/releases' + (qs ? '?' + qs : ''));
  },
  createRelease: (payload) => request('/api/distro/releases', { method: 'POST', body: payload }),
  getRelease: (id) => request('/api/distro/releases/' + encodeURIComponent(id)),
  updateRelease: (id, payload) => request('/api/distro/releases/' + encodeURIComponent(id), { method: 'PUT', body: payload }),
  deliverRelease: (id, payload = {}) => request('/api/distro/releases/' + encodeURIComponent(id) + '/deliver', { method: 'POST', body: payload }),
  takedownRelease: (id, payload = {}) => request('/api/distro/releases/' + encodeURIComponent(id) + '/takedown', { method: 'POST', body: payload }),
  bulkDeliver: (payload) => request('/api/distro/bulk-deliver', { method: 'POST', body: payload }),
  getSheet: (id) => request('/api/distro/releases/' + encodeURIComponent(id) + '/sheet'),
  getStats: (params = {}) => {
    const q = new URLSearchParams();
    if (params.persona) q.append('persona', params.persona);
    if (params.outlet && params.outlet !== 'all') q.append('outlet', params.outlet);
    if (params.period) q.append('period', params.period);
    if (params.release_id) q.append('release_id', params.release_id);
    if (params.artist_id) q.append('artist_id', params.artist_id);
    const qs = q.toString();
    return request('/api/distro/stats' + (qs ? '?' + qs : ''));
  },
  simulateSync: () => request('/api/distro/stats/simulate-sync', { method: 'POST' }),
  getRoster: () => request('/api/distro/roster'),
  getAdminPipeline: () => request('/api/distro/admin/pipeline'),
  adminOverrideStatus: (payload) => request('/api/distro/admin/override-status', { method: 'POST', body: payload }),
  generateIsrc: () => request('/api/distro/generate-isrc', { method: 'POST' }),
  generateUpc: () => request('/api/distro/generate-upc', { method: 'POST' }),
};

export const communicationsApi = {
  getLogs: (params = {}) => {
    const q = new URLSearchParams();
    if (params.q) q.append('q', params.q);
    if (params.role && params.role !== 'all') q.append('role', params.role);
    if (params.event_type && params.event_type !== 'all') q.append('event_type', params.event_type);
    if (params.status && params.status !== 'all') q.append('status', params.status);
    if (params.channel && params.channel !== 'all') q.append('channel', params.channel);
    if (params.archived !== undefined) q.append('archived', String(params.archived));
    if (params.page) q.append('page', String(params.page));
    if (params.limit) q.append('limit', String(params.limit));
    const qs = q.toString();
    return request('/api/communications/logs' + (qs ? '?' + qs : ''));
  },
  getStats: () => request('/api/communications/stats'),
  getWhatsappStatus: () => request('/api/communications/whatsapp-status'),
  getDetail: (msgId) => request('/api/communications/detail/' + encodeURIComponent(msgId)),
  archiveMessage: (msgId) => request('/api/communications/archive/' + encodeURIComponent(msgId), { method: 'POST' }),
  unarchiveMessage: (msgId) => request('/api/communications/unarchive/' + encodeURIComponent(msgId), { method: 'POST' }),
  resendMessage: (msgId) => request('/api/communications/resend/' + encodeURIComponent(msgId), { method: 'POST' }),
  testEmail: (payload) => request('/api/communications/test-email', { method: 'POST', body: payload }),
  testWhatsapp: (payload) => request('/api/communications/test-whatsapp', { method: 'POST', body: payload }),
  sendMessage: (payload) => request('/api/communications/send', { method: 'POST', body: payload }),
  getExportUrl: () => `${BASE}/api/communications/export`,
};

export function normalizeMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.includes(':8001/uploads/')) {
    return trimmed.substring(trimmed.indexOf('/uploads/'));
  }
  if (trimmed.includes(':8001/heroes/')) {
    return trimmed.substring(trimmed.indexOf('/heroes/'));
  }
  if (trimmed.includes(':8001/headers/')) {
    return trimmed.substring(trimmed.indexOf('/headers/'));
  }
  return trimmed;
}

// --- Streaming, Consumer Audio & Tipping Engine (Phase 2) ---
export const streamApi = {
  tipArtist: (payload) => request('/api/stream/tip', { method: 'POST', body: payload }),
  tipCreator: (payload) => request('/api/stream/tip', { method: 'POST', body: payload }),
  getTipsHistory: () => request('/api/stream/tips/history'),
  logEvent: (payload) => request('/api/stream/event', { method: 'POST', body: payload }),
  getManifest: (identifier) => request(`/api/stream/manifest/${encodeURIComponent(identifier)}`),
  getLibrary: () => request('/api/stream/library'),
  getLiked: () => request('/api/stream/library/liked'),
  toggleLike: (trackId, trackData) => request('/api/stream/library/liked', { method: 'POST', body: { track_id: trackId, track_data: trackData } }),
  removeLiked: (trackId) => request(`/api/stream/library/liked/${encodeURIComponent(trackId)}`, { method: 'DELETE' }),
  getCrates: () => request('/api/stream/library/crates'),
  createCrate: (payload) => request('/api/stream/library/crates', { method: 'POST', body: payload }),
  deleteCrate: (crateId) => request(`/api/stream/library/crates/${encodeURIComponent(crateId)}`, { method: 'DELETE' }),
  addTrackToCrate: (crateId, trackId, trackData) => request(`/api/stream/library/crates/${encodeURIComponent(crateId)}/tracks`, { method: 'POST', body: { track_id: trackId, track_data: trackData } }),
  removeTrackFromCrate: (crateId, trackId) => request(`/api/stream/library/crates/${encodeURIComponent(crateId)}/tracks/${encodeURIComponent(trackId)}`, { method: 'DELETE' }),
  getHistory: () => request('/api/stream/library/history'),
  recordHistory: (payload) => request('/api/stream/library/history', { method: 'POST', body: payload }),
  getOfflineCache: () => request('/api/stream/offline-cache'),
  getOfflineManifest: (identifier) => request(`/api/stream/offline-cache/${encodeURIComponent(identifier)}`),
};

// --- Corporate Brand Advertising & Ad Injection Platform (Phase 9) ---
export const corporateAdsApi = {
  getRates: () => request('/api/corporate/ad-rates'),
  getInquiries: () => request('/api/corporate/inquiries'),
  createInquiry: (payload) => request('/api/corporate/inquiries', { method: 'POST', body: payload }),
  getCampaigns: () => request('/api/corporate/campaigns'),
  getCampaign: (id) => request(`/api/corporate/campaigns/${encodeURIComponent(id)}`),
  createCampaign: (payload) => request('/api/corporate/campaigns', { method: 'POST', body: payload }),
  updateCampaignStatus: (id, status) => request(`/api/corporate/campaigns/${encodeURIComponent(id)}/status`, { method: 'POST', body: { status } }),
  getCampaignCertificate: (id) => request(`/api/corporate/campaigns/${encodeURIComponent(id)}/certificate`),
  getStats: () => request('/api/corporate/stats'),
  getNextAudioAd: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/corporate/next-audio-ad${q ? `?${q}` : ''}`);
  },
  getActiveFlights: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/corporate/active-flights${q ? `?${q}` : ''}`);
  },
  getInjectionConfig: () => request('/api/corporate/injection-config'),
  updateInjectionConfig: (payload) => request('/api/corporate/injection-config', { method: 'POST', body: payload }),
  trackTelemetry: (payload) => request('/api/corporate/telemetry', { method: 'POST', body: payload }),
  getTelemetryOverview: () => request('/api/corporate/telemetry/overview'),
};


// --- Media House Routing & Broadcast Syndication (Phase 10) ---
export const mediaHouseApi = {
  getChannels: () => request('/api/media-house/channels'),
  getChannel: (id) => request(`/api/media-house/channels/${encodeURIComponent(id)}`),
  createChannel: (payload) => request('/api/media-house/channels', { method: 'POST', body: payload }),
  getQueue: (channelId) => request(`/api/media-house/queue${channelId ? `?channel_id=${encodeURIComponent(channelId)}` : ''}`),
  enqueueTrack: (payload) => request('/api/media-house/queue', { method: 'POST', body: payload }),
  dequeueTrack: (id) => request(`/api/media-house/queue/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  triggerPlayout: (payload) => request('/api/media-house/trigger-playout', { method: 'POST', body: payload }),
  getLogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/api/media-house/logs${q ? `?${q}` : ''}`);
  },
  generateCueSheet: (payload) => request('/api/media-house/cue-sheets/generate', { method: 'POST', body: payload }),
  getCueSheets: (channelId) => request(`/api/media-house/cue-sheets${channelId ? `?channel_id=${encodeURIComponent(channelId)}` : ''}`),
  getStats: () => request('/api/media-house/stats'),
  getStemsCatalog: () => request('/api/media-house/stems-catalog'),
};

// --- Splits & Elections Fallbacks ---
export const splitsApi = {
  getSplits: (trackId) => request(`/api/splits${trackId ? `/${encodeURIComponent(trackId)}` : ''}`),
  saveSplits: (payload) => request('/api/splits', { method: 'POST', body: payload }),
};
export const publishingElectionApi = publishingApi;
export const distributionElectionApi = distroApi;

if (typeof window !== 'undefined') {
  window.mediaHouseApi = mediaHouseApi;
  window.djMixesApi = djMixesApi;
  window.splitsApi = splitsApi;
}

export default {
  authApi,
  tokenStore,
  usersApi,
  dashboardApi,
  dealsApi,
  adminApi,
  cmsApi,
  socialAiApi,
  crmApi,
  splitsApi,
  publishingElectionApi,
  distributionElectionApi,
  publishingApi,
  distroApi,
  contractsApi,
  djPoolApi,
  djMixesApi,
  syncApi,
  storageApi,
  catalogApi,
  blogApi,
  affiliatesApi,
  communicationsApi,
  streamApi,
  corporateAdsApi,
  mediaHouseApi,
};
