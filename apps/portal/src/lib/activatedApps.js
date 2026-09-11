import { usersApi, tokenStore } from './api.js';

const STORAGE_KEY_ACTIVE = 'tunemavens_activated_apps';
const STORAGE_KEY_DEACTIVATED = 'tunemavens_deactivated_apps';
const STORAGE_KEY_USER = 'tunemavens_saved_user';

export const DEFAULT_ACTIVE_APPS = ['epk-builder', 'catalog-porting'];

function getUserKey(user) {
  if (!user) return 'default';
  const id = user.id || user._id || user.email || 'default';
  return String(id).toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

/**
 * Retrieve user's stored active app slugs from localStorage.
 */
export function getStoredActivatedApps(user = null) {
  try {
    const userKey = getUserKey(user);
    if (userKey !== 'default') {
      const perUser = localStorage.getItem(`${STORAGE_KEY_ACTIVE}_${userKey}`);
      if (perUser) {
        const parsed = JSON.parse(perUser);
        if (Array.isArray(parsed)) return parsed;
      }
    }
    const globalVal = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (globalVal) {
      const parsed = JSON.parse(globalVal);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return null;
}

/**
 * Retrieve user's explicitly deactivated app slugs from localStorage.
 */
export function getStoredDeactivatedApps(user = null) {
  try {
    const userKey = getUserKey(user);
    if (userKey !== 'default') {
      const perUser = localStorage.getItem(`${STORAGE_KEY_DEACTIVATED}_${userKey}`);
      if (perUser) {
        const parsed = JSON.parse(perUser);
        if (Array.isArray(parsed)) return parsed;
      }
    }
    const globalVal = localStorage.getItem(STORAGE_KEY_DEACTIVATED);
    if (globalVal) {
      const parsed = JSON.parse(globalVal);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (_) {}
  return [];
}

/**
 * Save active app slugs to localStorage.
 */
export function saveStoredActivatedApps(user = null, apps = []) {
  try {
    const userKey = getUserKey(user);
    const json = JSON.stringify(apps);
    if (userKey !== 'default') {
      localStorage.setItem(`${STORAGE_KEY_ACTIVE}_${userKey}`, json);
    }
    localStorage.setItem(STORAGE_KEY_ACTIVE, json);
  } catch (_) {}
}

/**
 * Save explicitly deactivated app slugs to localStorage.
 */
export function saveStoredDeactivatedApps(user = null, deactivated = []) {
  try {
    const userKey = getUserKey(user);
    const json = JSON.stringify(deactivated);
    if (userKey !== 'default') {
      localStorage.setItem(`${STORAGE_KEY_DEACTIVATED}_${userKey}`, json);
    }
    localStorage.setItem(STORAGE_KEY_DEACTIVATED, json);
  } catch (_) {}
}

/**
 * Reconciles user's active apps by combining server state with remembered local choices.
 * Ensures previously chosen apps (like EPK Builder) persist on subsequent logins until deactivated.
 */
export function reconcileUserApps(user) {
  if (!user) return null;
  const role = user.role || 'creator';
  const isCreatorOrAdmin = ['creator', 'label', 'admin'].includes(role);
  const storedActive = getStoredActivatedApps(user);
  const storedDeactivated = getStoredDeactivatedApps(user);
  const backendApps = Array.isArray(user.apps) ? user.apps : [];

  const mergedSet = new Set();

  if (storedActive && storedActive.length > 0) {
    storedActive.forEach(a => mergedSet.add(a));
  } else if (backendApps.length > 0) {
    backendApps.forEach(a => mergedSet.add(a));
  } else if (isCreatorOrAdmin) {
    DEFAULT_ACTIVE_APPS.forEach(a => mergedSet.add(a));
  }

  // Include any backend apps as long as they weren't explicitly deactivated
  backendApps.forEach(a => {
    if (!storedDeactivated.includes(a)) {
      mergedSet.add(a);
    }
  });

  // Always enforce removal of explicitly deactivated apps
  storedDeactivated.forEach(d => mergedSet.delete(d));

  const finalApps = Array.from(mergedSet);
  saveStoredActivatedApps(user, finalApps);

  const updatedUser = { ...user, apps: finalApps };
  try {
    sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedUser));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
  } catch (_) {}

  return updatedUser;
}

/**
 * Activates an app choice, persisting to localStorage, React state, and backend.
 */
export async function persistAppActivation(slug, user, onUpdateUser) {
  if (!slug) return [];
  const currentActive = getStoredActivatedApps(user) || user?.apps || [...DEFAULT_ACTIVE_APPS];
  const deactivated = getStoredDeactivatedApps(user).filter(s => s !== slug);
  saveStoredDeactivatedApps(user, deactivated);

  const updatedApps = Array.from(new Set([...currentActive, slug]));
  saveStoredActivatedApps(user, updatedApps);

  if (user) {
    const updatedUser = { ...user, apps: updatedApps };
    try {
      sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedUser));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (_) {}
    if (typeof onUpdateUser === 'function') {
      onUpdateUser(updatedUser);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tunemavens-apps-updated', { detail: { apps: updatedApps, activated: slug } }));
  }

  if (tokenStore.get()) {
    try {
      await usersApi.activateApp(slug);
    } catch (err) {
      console.warn('Backend activation sync delayed:', err);
    }
  }

  return updatedApps;
}

/**
 * Deactivates an app choice, persisting the deactivation choice until user activates again.
 */
export async function persistAppDeactivation(slug, user, onUpdateUser) {
  if (!slug) return [];
  const currentActive = getStoredActivatedApps(user) || user?.apps || [];
  const updatedApps = currentActive.filter(s => s !== slug);
  saveStoredActivatedApps(user, updatedApps);

  const deactivated = Array.from(new Set([...getStoredDeactivatedApps(user), slug]));
  saveStoredDeactivatedApps(user, deactivated);

  if (user) {
    const updatedUser = { ...user, apps: updatedApps };
    try {
      sessionStorage.setItem('tunemavens_session', JSON.stringify(updatedUser));
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    } catch (_) {}
    if (typeof onUpdateUser === 'function') {
      onUpdateUser(updatedUser);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tunemavens-apps-updated', { detail: { apps: updatedApps, deactivated: slug } }));
  }

  if (tokenStore.get()) {
    try {
      await usersApi.deactivateApp(slug);
    } catch (err) {
      console.warn('Backend deactivation sync delayed:', err);
    }
  }

  return updatedApps;
}
