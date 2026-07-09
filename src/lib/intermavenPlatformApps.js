// Shared catalogue of the apps available on the intermaven.io platform.
// Source of truth for the App Marketplace's "Intermaven Platform" tab — every
// activation persists locally to `users.apps[]` so the dashboard can show a
// quick-launch tile, and "Open" navigates to the canonical app URL on
// intermaven.io (the user's shared Intermaven session is honoured there via
// the cross-subdomain JWT cookie, per the §1.2 SSO design note).
import { RiSparklesFill, RiPaletteFill, RiUsersFill, RiSlideshowFill, RiShoppingCartFill, RiReceiptFill, RiFileSignatureFill } from 'react-icons/ri';

export const INTERMAVEN_PLATFORM_APPS = [
  {
    slug: 'intermaven-social-ai',
    name: 'Social AI',
    desc: 'Multi-account social management with AI-drafted captions, schedules, and analytics insights.',
    icon: RiSparklesFill,
    accent: '#22d3ee', // cyan
    launchUrl: 'https://intermaven.io/social',
    status: 'live',
  },
  {
    slug: 'intermaven-brandkit-ai',
    name: 'Brand Kit AI',
    desc: 'Build your brand foundation — identity, voice, palette, and visuals — in minutes.',
    icon: RiPaletteFill,
    accent: '#a78bfa', // purple
    launchUrl: 'https://intermaven.io/brandkit',
    status: 'live',
  },
  {
    slug: 'intermaven-smart-crm',
    name: 'Smart CRM',
    desc: 'Manage bookings, contacts, and revenue across your roster in one dashboard.',
    icon: RiUsersFill,
    accent: '#10b981', // emerald
    launchUrl: 'https://intermaven.io/smartcrm',
    status: 'live',
  },
  {
    slug: 'intermaven-pitch-deck-ai',
    name: 'Pitch Deck AI',
    desc: 'AI-generated investor & label pitch decks with brand-matched visuals and one-click export.',
    icon: RiSlideshowFill,
    accent: '#f59e0b', // amber
    launchUrl: 'https://intermaven.io/pitchdeck',
    status: 'live',
  },
  {
    slug: 'intermaven-pos-system',
    name: 'POS System',
    desc: 'Web companion to the tunepay native app — inventory, settlement, and staff terminals.',
    icon: RiShoppingCartFill,
    accent: '#10b981',
    launchUrl: 'https://intermaven.io/pos',
    status: 'live',
  },
  {
    slug: 'intermaven-invoicing-payments',
    name: 'Invoicing & Payments',
    desc: 'Send tunepay invoices, accept cards, automate billing and reminders.',
    icon: RiReceiptFill,
    accent: '#22d3ee',
    launchUrl: 'https://intermaven.io/invoicing',
    status: 'beta',
  },
  {
    slug: 'intermaven-contracts',
    name: 'Contract Templates',
    desc: 'Kenya-law-compliant contract templates for SMEs, with e-sign and version history.',
    icon: RiFileSignatureFill,
    accent: '#a78bfa',
    launchUrl: 'https://intermaven.io/contracts',
    status: 'soon',
  },
];
