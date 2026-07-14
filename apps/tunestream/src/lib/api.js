export const tokenStore = {
  get: () => sessionStorage.getItem('tunestream_token'),
  set: (token) => sessionStorage.setItem('tunestream_token', token),
  clear: () => sessionStorage.removeItem('tunestream_token'),
};

export const authApi = {
  login: async (payload) => {
    const user = {
      id: 'mock-user-id',
      email: payload.email,
      name: payload.email.split('@')[0],
      role: 'consumer',
      plan: 'free',
      credits: 100,
    };
    sessionStorage.setItem('tunestream_session', JSON.stringify(user));
    return { user, access_token: 'mock-jwt-token' };
  },
  register: async (payload) => {
    const user = {
      id: 'mock-user-id',
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      role: payload.role || 'consumer',
      plan: 'free',
      credits: 100,
      brand_name: payload.brand_name,
      country: payload.country,
    };
    sessionStorage.setItem('tunestream_session', JSON.stringify(user));
    return { user, access_token: 'mock-jwt-token' };
  },
  me: async () => {
    const saved = sessionStorage.getItem('tunestream_session');
    return saved ? JSON.parse(saved) : null;
  },
};

export const usersApi = {
  getOnboarding: async () => {
    const saved = sessionStorage.getItem('tunestream_onboarding');
    return saved ? JSON.parse(saved) : null;
  },
  saveOnboarding: async (payload) => {
    sessionStorage.setItem('tunestream_onboarding', JSON.stringify(payload));
    return payload;
  },
};
