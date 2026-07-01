// Unified lookup for every slug the App Marketplace can recommend.
// The recommendation engine returns slugs + rationale; this helper resolves
// them to the visual fields (icon, accent, name, open target).
import { Database, Coins, BookOpen, Globe, Radio, Shield, Music, Smartphone } from 'lucide-react';
import { INTERMAVEN_NATIVE_APPS } from './nativeApps.js';
import { INTERMAVEN_PLATFORM_APPS } from './intermavenPlatformApps.js';

// TuneMavens dashboard apps — mirrors the local catalogue inside
// AppMarketplacePanel. Kept short here; the marketplace itself owns the
// long descriptions.
const TUNEMAVENS_APPS = [
  { slug: 'catalog-porting', name: 'Catalog Porting', icon: Database, accent: '#22d3ee', tab: 'catalog' },
  { slug: 'split-cascade', name: 'Split Cascade', icon: Coins, accent: '#a78bfa', tab: 'splits' },
  { slug: 'publishing-election', name: 'Publishing Election', icon: BookOpen, accent: '#22d3ee', tab: 'publishing-election' },
  { slug: 'distribution-election', name: 'Distribution Election', icon: Globe, accent: '#a78bfa', tab: 'distribution-election' },
  { slug: 'djpool', name: 'DJ Pool MVP', icon: Radio, accent: '#10b981', tab: 'djpool' },
  { slug: 'sync-marketplace', name: 'Sync Marketplace', icon: Globe, accent: '#22d3ee', tab: 'sync' },
  { slug: 'escrow-contracts', name: 'Escrow Contracts', icon: Shield, accent: '#a78bfa', tab: 'escrow' },
  { slug: 'tunemavens-library', name: 'My Library', icon: Music, accent: '#22d3ee', tab: 'library' },
  { slug: 'tunemavens-tips', name: 'Tips & Purchases', icon: Coins, accent: '#10b981', tab: 'tips' },
  { slug: 'mpesa-pos-inventory', name: 'POS Inventory', icon: Database, accent: '#10b981', tab: 'pos-inventory' },
  { slug: 'mpesa-pos-settlement', name: 'POS Settlement', icon: Coins, accent: '#10b981', tab: 'pos-settlement' },
  { slug: 'mpesa-pos-devices', name: 'POS Devices', icon: Smartphone, accent: '#10b981', tab: 'pos-devices' },
];

const NATIVE_LOOKUP = INTERMAVEN_NATIVE_APPS.map((a) => ({
  slug: a.slug,
  name: a.name,
  icon: a.icon,
  accent: a.accent,
  landingPath: a.landingPath,
}));

const PLATFORM_LOOKUP = INTERMAVEN_PLATFORM_APPS.map((a) => ({
  slug: a.slug,
  name: a.name,
  icon: a.icon,
  accent: a.accent,
  launchUrl: a.launchUrl,
}));

const ALL_MAP = new Map(
  [...TUNEMAVENS_APPS, ...NATIVE_LOOKUP, ...PLATFORM_LOOKUP].map((a) => [a.slug, a])
);

export function lookupApp(slug) {
  return ALL_MAP.get(slug) || null;
}
