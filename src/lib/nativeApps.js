// Shared catalogue of the 3 flagship Intermaven Network native apps.
// Source of truth — consumed by both:
//   • NativeAppsView (marketing page at /native-apps)
//   • AppMarketplacePanel "Intermaven Network" tab (in-dashboard activation)
// Keeping a single definition prevents the two surfaces from drifting apart.
import { Headphones, TrendingUp, CreditCard } from 'lucide-react';

export const INTERMAVEN_NATIVE_APPS = [
  {
    id: 'consumer',
    slug: 'intermaven-tunemavens',
    landingPath: '/native-apps/tunestreams',
    name: 'tunestream',
    tagline: 'Stream. Tip. Carry the catalogue.',
    icon: Headphones,
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    desc: 'The consumer-facing wrapper: offline-cached HQ audio, region-aware playlists, and one-tap tipping that lands directly in the creator\u2019s payout split.',
    features: ['Offline-cached HQ audio', 'One-tap tipping to creators', 'Region-aware editorial playlists', 'Shared credits vault with intermaven.io'],
    target: 'For listeners',
  },
  {
    id: 'creator',
    slug: 'intermaven-creator-companion',
    landingPath: '/native-apps/creator-companion',
    name: 'tunecompanion',
    tagline: 'Your split ledger in your pocket.',
    icon: TrendingUp,
    accent: 'var(--purple)',
    accentGlow: 'rgba(139, 92, 246, 0.18)',
    desc: 'Mobile metrics dashboard for artists and managers: real-time split ledger, payout balance, sync alerts, and AI-drafted release strategy plays on the go.',
    features: ['Real-time split cascade ledger', 'Payout balance + tip stream', 'Sync brief alerts', 'AI release playbook drafts'],
    target: 'For artists & managers',
  },
  {
    id: 'pos',
    slug: 'intermaven-tunepay',
    landingPath: '/native-apps/tunepay',
    name: 'tunepay',
    tagline: 'Sell at the show. Settle by morning.',
    icon: CreditCard,
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.18)',
    desc: 'Portable point-of-sale for live events: merch, ticket scans, and CD/vinyl on a phone or tablet, with tunepay, card, and digital-wallet acceptance.',
    features: ['tunepay STK + card + wallet', 'Merch & ticket-scan modes', 'Per-event settlement reports', 'Geo-gated payout routing'],
    target: 'For labels & venues',
  },
];
