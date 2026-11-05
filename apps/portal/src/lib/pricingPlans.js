/**
 * Single Source of Truth for Platformwide Credit Pricing and Packages.
 *
 * Strict 1:1 Conversion Ratio:
 * - 1 Credit = 1 KES
 * - $1.00 USD = 100 Credits ($0.01 USD per Credit)
 * - 100 KES = $1.00 USD
 *
 * Tier Structure:
 * - Floor: KSH 250 / $2.50 (250 Credits)
 * - Growth: KSH 500 / $5.00 (500 Credits)
 * - Pro: KSH 1,000 / $10.00 (1,000 Credits)
 * - Studio: KSH 5,000 / $50.00 (5,000 Credits)
 * - Label Starter Floor: KSH 5,000 / $50.00 (5,000 Credits)
 * - Label Scale Operations: KSH 10,000 / $100.00 (10,000 Credits)
 * - Label Enterprise: KSH 20,000 / $200.00 (20,000 Credits)
 */

export const CREDIT_EXCHANGE_RATE = {
  KES_PER_CREDIT: 1.0,
  USD_PER_CREDIT: 0.01,
  CREDITS_PER_USD: 100,
  CREDITS_PER_KES: 1,
};

export const CREDIT_LOAD_PACKAGES = [
  {
    id: 'starter-floor',
    name: 'Starter Floor',
    targetRole: 'all',
    credits: 250,
    priceUsd: 2.50,
    priceKes: 250,
    badge: 'Starter Floor',
    badgeColor: '#06b6d4',
    desc: 'Accessible entry-level top-up for EPK customisation, single track mastering, or listener tipping.',
    features: ['250 Non-Expiring Credits', 'Single Track AI Master', 'EPK Builder Customisation', 'Direct Artist Tipping']
  },
  {
    id: 'growth-pack',
    name: 'Growth Pack',
    targetRole: 'creator',
    credits: 500,
    priceUsd: 5.00,
    priceKes: 500,
    badge: 'Popular',
    badgeColor: '#22d3ee',
    desc: 'Ample credits for regular music uploads, WhatsApp phone alerts, and sync briefs.',
    features: ['500 Non-Expiring Credits', 'WhatsApp Phone Alerts Enabled', 'Sync Brief Submissions', 'Multi-Track AI Mastering']
  },
  {
    id: 'pro-maven',
    name: 'Pro Maven',
    targetRole: 'creator',
    credits: 1000,
    priceUsd: 10.00,
    priceKes: 1000,
    badge: 'Best Value',
    badgeColor: '#f59e0b',
    desc: 'High-volume credits for active creators, EPK custom domains, and lossless stem archiving.',
    features: ['1,000 Non-Expiring Credits', 'Custom Domain Routing', 'Social AI Copywriter', 'Lossless Audio Stems Storage']
  },
  {
    id: 'studio-master',
    name: 'Studio Master',
    targetRole: 'studio',
    credits: 5000,
    priceUsd: 50.00,
    priceKes: 5000,
    badge: 'Studio Grade',
    badgeColor: '#ec4899',
    desc: 'Heavy-duty volume for producers, multitrack storage, escrow deals, and DJ pool drops.',
    features: ['5,000 Non-Expiring Credits', 'Unlimited AI Mastering', 'Escrow Contract Protection', 'DJ Record Pool Clearances']
  },
  {
    id: 'label-team-starter',
    name: 'Label Starter Floor',
    targetRole: 'label',
    credits: 5000,
    priceUsd: 50.00,
    priceKes: 5000,
    badge: 'Label Floor',
    badgeColor: '#a855f7',
    desc: 'Accessible entry-level label reload for up to 10 signed artists, CSV statement parsing, and split cascades.',
    features: ['5,000 Non-Expiring Credits (KSh 5,000 / $50.00)', 'Up to 10 Signed Artists', 'Statement CSV Parser', 'Split Cascade Net Ledgers']
  },
  {
    id: 'label-growth',
    name: 'Scale Label Operations',
    targetRole: 'label',
    credits: 10000,
    priceUsd: 100.00,
    priceKes: 10000,
    badge: 'Most Popular',
    badgeColor: '#22d3ee',
    desc: 'Designed for scaling independent labels with up to 50 artist rosters and automated recoupment cascades.',
    features: ['10,000 Non-Expiring Credits (KSh 10,000 / $100.00)', 'Up to 50 Artist Rosters', 'Automated Advance Recoupment', 'Role-Based Staff Permissions']
  },
  {
    id: 'label-enterprise',
    name: 'Major Label Enterprise',
    targetRole: 'label',
    credits: 20000,
    priceUsd: 200.00,
    priceKes: 20000,
    badge: 'Enterprise Scale',
    badgeColor: '#00f2fe',
    desc: 'Maximum enterprise package for major catalogs, worldwide imprints, and white-label portals.',
    features: ['20,000 Non-Expiring Credits (KSh 20,000 / $200.00)', 'Unlimited Catalog Ingestion', 'White-Label Artist Portal', 'Bulk M-Pesa & Bank Payouts']
  }
];

/**
 * Format credit cost to local currency or USD
 */
export function formatCreditPrice(credits, currency = 'USD') {
  if (currency === 'KES') {
    return `KSh ${(credits * CREDIT_EXCHANGE_RATE.KES_PER_CREDIT).toLocaleString()}`;
  }
  return `$${(credits * CREDIT_EXCHANGE_RATE.USD_PER_CREDIT).toFixed(2)}`;
}
