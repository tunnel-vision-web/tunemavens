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
const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Token persistence helpers (for the Bearer-token fallback path when the
// cross-subdomain cookie isn't reachable, e.g. local dev across ports).
const TOKEN_KEY = 'tunemavens_token';
export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
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
