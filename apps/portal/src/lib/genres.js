// Authoritative Genre Management System for TuneMavens Platform
// Synchronizes African and World genres across Catalogue, EPK Builder, CMS, and Admin panels.

export const DEFAULT_CANONICAL_GENRES = [
  'Afro-fusion',
  'Afrobeats',
  'Afro-House',
  'Amapiano',
  'Gengetone',
  'Bongo Flava',
  'Highlife',
  'Soukous',
  'Benga',
  'Kizomba',
  'Coupe Decale',
  'Mbalax',
  'Fuji',
  'Juju',
  'Taarab',
  'Afro-Pop',
  'Afro-Soul',
  'Dancehall',
  'Reggae',
  'Soca',
  'Deep-House',
  'Tech-House',
  'Electronic',
  'Synthwave',
  'Hip-Hop',
  'R&B / Soul',
  'Jazz Fusion',
  'Pop',
  'Gospel',
  'Ambient',
  'Latin / Reggaeton',
  'Neo-Soul',
  'Drill',
  'Afro-Tech',
  'Gqom'
];

let cachedGenres = [...DEFAULT_CANONICAL_GENRES];

export async function fetchGenres() {
  try {
    const res = await fetch('/api/catalog/genres');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.genres) && data.genres.length > 0) {
        cachedGenres = data.genres;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tunemavens-genres-updated', { detail: cachedGenres }));
        }
        return cachedGenres;
      }
    }
  } catch (err) {
    console.warn('Fallback to local cached genres:', err);
  }
  return cachedGenres;
}

export const loadAuthoritativeGenres = fetchGenres;

export function getCachedGenres() {
  return cachedGenres;
}

export async function addGenre(name, category = 'African & World') {
  const clean = name.trim();
  if (!clean) return { error: 'Genre name cannot be empty' };
  try {
    const res = await fetch('/api/catalog/genres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: clean, category })
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.genres)) {
        cachedGenres = data.genres;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tunemavens-genres-updated', { detail: cachedGenres }));
        }
      }
      return data;
    }
    const errData = await res.json();
    return { error: errData.detail || 'Failed to add genre' };
  } catch (err) {
    return { error: err.message };
  }
}

export async function updateGenre(oldName, newName, category = 'African & World') {
  const cleanNew = newName.trim();
  if (!cleanNew) return { error: 'New genre name cannot be empty' };
  try {
    const res = await fetch(`/api/catalog/genres/${encodeURIComponent(oldName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_name: cleanNew, category })
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.genres)) {
        cachedGenres = data.genres;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tunemavens-genres-updated', { detail: cachedGenres }));
        }
      }
      return data;
    }
    const errData = await res.json();
    return { error: errData.detail || 'Failed to update genre' };
  } catch (err) {
    return { error: err.message };
  }
}

export async function deleteGenre(name) {
  try {
    const res = await fetch(`/api/catalog/genres/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.genres)) {
        cachedGenres = data.genres;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tunemavens-genres-updated', { detail: cachedGenres }));
        }
      }
      return data;
    }
    const errData = await res.json();
    return { error: errData.detail || 'Failed to delete genre' };
  } catch (err) {
    return { error: err.message };
  }
}
