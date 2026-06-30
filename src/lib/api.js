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

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

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

// --- Deals (§9.7 stubs — full logic in Phase 7) ---
export const dealsApi = {
  publishing: {
    list: () => request('/api/deals/publishing'),
    create: (deal) => request('/api/deals/publishing', { method: 'POST', body: deal }),
  },
  distribution: {
    list: () => request('/api/deals/distribution'),
    create: (deal) => request('/api/deals/distribution', { method: 'POST', body: deal }),
  },
  catalogueAcquisitions: {
    list: () => request('/api/deals/catalogue-acquisitions'),
    create: (entry) =>
      request('/api/deals/catalogue-acquisitions', { method: 'POST', body: entry }),
  },
};

// Token persistence helpers (for the Bearer-token fallback path when the
// cross-subdomain cookie isn't reachable, e.g. local dev across ports).
const TOKEN_KEY = 'tunemavens_token';
export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};
