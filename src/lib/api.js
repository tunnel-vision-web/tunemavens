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
    const err = new Error(data?.detail || res.statusText);
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
