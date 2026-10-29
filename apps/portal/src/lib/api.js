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
const BASE = ((typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || '').replace(/\/$/, '');

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
  const data = text ? JSON.parse(text) : null;
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
  demo: () => request('/api/auth/demo', { method: 'POST' }),
  me: (token) => request('/api/auth/me', { token }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
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
  },
  catalogueAcquisitions: {
    list: () => request('/api/deals/catalogue-acquisitions'),
    create: (entry) =>
      request('/api/deals/catalogue-acquisitions', { method: 'POST', body: entry }),
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
  listTracks: () => request('/api/djpool/tracks'),
  addTrack: (payload) => request('/api/djpool/tracks', { method: 'POST', body: payload }),
  submitFeedback: (payload) => request('/api/djpool/feedback', { method: 'POST', body: payload }),
  downloadTrack: (id) => request(`/api/djpool/download/${id}`, { method: 'POST' }),
  submitClearance: (payload) => request('/api/djpool/clearance', { method: 'POST', body: payload }),
  listClearances: () => request('/api/djpool/clearance'),
  approveClearance: (requestId, status) => request(`/api/djpool/clearance/${requestId}/approve`, { method: 'POST', body: { status } }),
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
