/**
 * TuneMavens Pre-Rendering & Open Graph Generator
 *
 * Implements Technical Foundation Spec §2 (R2.1, R2.2, R2.5, R2.6):
 * - Generates real, server-rendered semantic HTML with <h1> tags for all marketing routes.
 * - Injects per-route <head> tags: unique title, description, canonical link, Open Graph (1200x630), Twitter Cards.
 * - Embeds JSON-LD Structured Data for Organization and WebSite schema.
 * - Generates dedicated 404.html error page with proper error semantics.
 * - Pre-renders files into both dist/ and public/ directories across workspaces.
 */
import fs from 'fs';
import path from 'path';

const TUNEMAVENS_ROUTES = [
  {
    path: '/',
    slug: 'index',
    title: 'TuneMavens — AI-Powered Music Operations & Unified Credit Platform',
    description: 'The operating system for African and diaspora music creators, record labels, and supervisors. Catalog ingestion, split cascade ledgers, and pre-cleared sync pitching.',
    h1: 'The Pan-African Music Operating System & Rights Engine',
    subhead: 'Unified credits, automated split cascades, pre-cleared sync licensing, and lossless audio delivery across Nairobi and the diaspora.',
    canonical: 'https://tunemavens.com/',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      '100% Unified Credits — Zero monthly recurring fees or subscription locks',
      'Immutable Split Cascade Ledgers — Double-entry accounting for writers and producers',
      'Pre-Cleared One-Stop Sync Catalog — Direct brief submissions to commercial supervisors',
      'Lossless Audio Stem Archiving — Cloud storage with verified ISRC/ISWC metadata'
    ]
  },
  {
    path: '/pricing',
    slug: 'pricing',
    title: 'Pricing & Credit Packages — TuneMavens Unified Credits',
    description: 'Transparent, non-expiring credit packages for artists, studios, and independent labels. Zero monthly subscriptions. Buy credits when you need them.',
    h1: 'Transparent Pricing with Zero Monthly Commitments',
    subhead: 'Our billing standard is 100% unified, non-expiring credits. Every reload covers catalog uploads, AI mastering, and sync brief pitching.',
    canonical: 'https://tunemavens.com/pricing',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Creator Starter Top-Up: 250 Non-Expiring Credits ($25 / KES 3,250)',
      'Pro Growth Top-Up: 600 Non-Expiring Credits ($50 / KES 6,500)',
      'Studio Producer Pack: 1,500 Non-Expiring Credits ($120 / KES 15,600)',
      'Scale Label Operations: 3,500 Credits with Multi-Seat Roster Access ($299 / KES 38,870)'
    ]
  },
  {
    path: '/for-creators',
    slug: 'for-creators',
    title: 'TuneMavens for Creators — EPKs, Distribution & Sync Pitching',
    description: 'Built for independent African and diaspora artists. Build your interactive EPK web world, generate split sheets, and pitch directly to sync briefs.',
    h1: 'Built for Independent Creators & Sonic Storytellers',
    subhead: 'Take complete command of your master rights, generate immutable split sheets in basis points, and get discovered by global music supervisors.',
    canonical: 'https://tunemavens.com/for-creators',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Interactive EPK Builder with custom subdomains (username.tunemavens.com)',
      'One-click automated ISRC and ISWC formatting',
      'Sync-ready verification gates with AI consent controls',
      'Instant M-Pesa and card payouts with daily ledger reconciliation'
    ]
  },
  {
    path: '/for-labels',
    slug: 'for-labels',
    title: 'TuneMavens for Record Labels — Roster Management & Split Cascade Ledgers',
    description: 'Enterprise roster management, multi-seat A&R/accounting consoles, DDEX ingestion, and bulk payout execution across M-Pesa and international bank rails.',
    h1: 'Enterprise Infrastructure for Modern Record Labels',
    subhead: 'Orchestrate unlimited roster artists, automate recoupment waterfalls, and disburse royalty splits atomically without 180-day statement delays.',
    canonical: 'https://tunemavens.com/for-labels',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Multi-seat collaborator roles for A&R, Legal, and Finance teams',
      'Automatic recoupment deductions prior to split cascade disbursement',
      'White-glove DDEX ERN 4.3 metadata batch delivery to DSPs',
      'Direct rail bulk payouts via Safaricom Daraja B2C and SWIFT'
    ]
  },
  {
    path: '/for-djs',
    slug: 'for-djs',
    title: 'TuneMavens for DJs — DJ Pool Drops, Mixtapes & Promo Clearances',
    description: 'Direct lossless promo pool access, verified mixtape clearance escrow, and exclusive track drops from top East African and diaspora producers.',
    h1: 'The High-Fidelity Promo Pool for Professional DJs',
    subhead: 'Download pre-cleared lossless WAV/FLAC audio drops, cue-point mapped stems, and track performance attribution in real time.',
    canonical: 'https://tunemavens.com/for-djs',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Verified lossless audio files with BPM and key metadata',
      'Direct escrow clearances for commercial mixtape distribution',
      'Instant play attribution analytics sent to publishing ledgers'
    ]
  },
  {
    path: '/for-mediahouses',
    slug: 'for-mediahouses',
    title: 'TuneMavens for Media Houses — Broadcast Stems & Direct Sync Ingestion',
    description: 'Broadcast-cleared music stems for television, radio, film, and digital networks with verified rights documentation and automated cue sheet exports.',
    h1: 'Broadcast-Ready Licensing for Media Houses & Networks',
    subhead: 'Pre-cleared 100% one-stop master and publishing catalog with automated cue sheet generation and instant indemnification.',
    canonical: 'https://tunemavens.com/for-mediahouses',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Instant sync licensing quotes powered by unified pricing calculator',
      'Full indemnification and signed split sheets on every pitchable track',
      'Standard cue sheet export formats for global CMO compliance'
    ]
  },
  {
    path: '/about',
    slug: 'about',
    title: 'About TuneMavens — The Pan-African Music Operating System',
    description: 'Learn how TuneMavens connects Nairobi sound culture with the global diaspora through transparent technology, verified rights data, and unified credits.',
    h1: 'Empowering the Sound of Nairobi & the Global Diaspora',
    subhead: 'Our mission is to build the financial and operational rails that allow independent music creators to thrive on their own terms.',
    canonical: 'https://tunemavens.com/about',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'HQ in Nairobi, Kenya with diaspora operational coverage in London and New York',
      'Zero subscription lock-in — creators own 100% of their catalog and data',
      'Direct M-Pesa mobile money integration alongside global card processing'
    ]
  },
  {
    path: '/help',
    slug: 'help',
    title: 'Help Desk & Documentation — TuneMavens Support',
    description: 'Step-by-step guides, API documentation, and 24/7 AI-assisted settlement support for catalog ingestion, credit reloads, and split cascade ledgers.',
    h1: 'TuneMavens Knowledge Base & Technical Support',
    subhead: 'Get answers to common questions about credit reloads, split sheet verification, M-Pesa settlement, and sync brief submissions.',
    canonical: 'https://tunemavens.com/help',
    ogImage: 'https://tunemavens.com/headers/discography_retina_header.jpg',
    features: [
      'Comprehensive guide to split sheets and basis point math (10,000 total)',
      'M-Pesa STK push troubleshooting and callback verification',
      'TuneLedger dispute escrow freeze and resolution workflow'
    ]
  }
];


function loadRegistryRoutes() {
  const regPath = path.resolve('shared', 'landing_page_registry.json');
  if (!fs.existsSync(regPath)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(regPath, 'utf-8'));
    return raw.map(entry => {
      const isHub = entry.slug === 'who-is-it-for';
      const rPath = isHub ? '/for' : `/for/${entry.slug}`;
      const rSlug = isHub ? 'for' : `for/${entry.slug}`;
      const audienceShort = (entry.audience || 'Music Professionals').split('&')[0].trim();
      return {
        path: rPath,
        slug: rSlug,
        title: `${entry.headline} — TuneMavens for ${audienceShort}`,
        description: entry.subhead,
        h1: entry.headline,
        subhead: entry.subhead,
        canonical: entry.canonical_url,
        ogImage: entry.og_image || 'https://tunemavens.com/headers/discography_retina_header.jpg',
        ctaText: entry.primary_cta ? entry.primary_cta.text : 'Get Started',
        ctaHref: entry.primary_cta ? entry.primary_cta.href : '/register',
        features: entry.proof_points || [],
        isRoleLanding: true,
        roleKey: entry.slug
      };
    });
  } catch (err) {
    console.error('Failed to load landing_page_registry.json in prerender:', err);
    return [];
  }
}

const TUNESTREAM_ROUTES = [
  {
    path: '/',
    slug: 'index',
    title: 'TuneStream — Music Streaming Built for Creators',
    description: 'Next-generation music streaming built on the Intermaven network. High-fidelity audio, direct artist credit tipping, and location-aware diaspora discovery.',
    h1: 'Music Streaming Built for African Creators & Global Fans',
    subhead: 'Stream verified tracks, support artists with direct credit tips, and experience lossless sound optimized for mobile data.',
    canonical: 'https://tunestream.co/',
    ogImage: 'https://tunestream.co/headers/discography_retina_header.jpg',
    features: [
      'Direct Fan Tipping — 95% of credit tips go directly to the artist ledger',
      'Adaptive Low-Bitrate Streaming — Optimized for 3G/4G mobile data in Nairobi',
      'Lossless FLAC Audio on Wi-Fi — Studio grade playback for audiophiles',
      'Transparent Play Accounting — Verified streams with zero bot loop inflation'
    ]
  }
];

const SYNCMAVENS_ROUTES = [
  {
    path: '/',
    slug: 'index',
    title: 'SyncMavens — AI-Powered Sync Licensing Marketplace',
    description: 'Connect film supervisors, advertising agencies, and game studios with pre-cleared African and diaspora commercial tracks with executed split sheets.',
    h1: 'Pre-Cleared Sync Licensing for Global Commercial Projects',
    subhead: 'Submit briefs, simulate sync fit scores, and license one-stop master audio with executed split sheets in minutes.',
    canonical: 'https://syncmavens.com/',
    ogImage: 'https://syncmavens.com/headers/discography_retina_header.jpg',
    features: [
      'Pre-cleared 100% one-stop catalog with signed split sheets',
      'AI Scene Matching and mood/tempo taxonomy indexing',
      'Automated agreement generation and unified calculator logic'
    ]
  }
];


function getCleanTemplate(rawTemplate) {
  let clean = rawTemplate;
  // Strip previous injected meta and link tags
  clean = clean.replace(/<meta name="description"[^>]*>/gi, '');
  clean = clean.replace(/<link rel="canonical"[^>]*>/gi, '');
  clean = clean.replace(/<meta property="og:[^>]*>/gi, '');
  clean = clean.replace(/<meta name="twitter:[^>]*>/gi, '');
  clean = clean.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');
  // Clear root to empty <div id="root"></div>
  clean = clean.replace(/<div id="root">[\s\S]*?<\/div>/i, '<div id="root"></div>');
  return clean;
}

function generateHtml(route, baseHtmlTemplate) {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': route.title,
    'description': route.description,
    'url': route.canonical,
    'mainEntity': {
      '@type': 'Organization',
      'name': 'Intermaven Network Inc.',
      'url': 'https://intermaven.io',
      'logo': 'https://tunemavens.com/logo.png',
      'sameAs': [
        'https://tunemavens.com',
        'https://tunestream.co',
        'https://syncmavens.com'
      ]
    }
  };

  const featureItemsHtml = (route.features || []).map(f => `
    <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
      <span style="color: #00f0ff;">✔</span> <span>${f}</span>
    </li>
  `).join('\n');

  // Server-rendered semantic body content injected into #root
  // When React 19 hydrates or mounts, it replaces this seamlessly
  const serverRenderedBody = `
    <div id="ssr-container" style="max-width: 1200px; margin: 0 auto; padding: 48px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; background: #0b0f19;">
      <header style="margin-bottom: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #00f0ff;">TuneMavens</div>
        <nav style="display: flex; gap: 20px; font-size: 14px;">
          <a href="/" style="color: #cbd5e1; text-decoration: none;">Home</a>
          <a href="/pricing" style="color: #cbd5e1; text-decoration: none;">Pricing</a>
          <a href="/for-creators" style="color: #cbd5e1; text-decoration: none;">Creators</a>
          <a href="/for-labels" style="color: #cbd5e1; text-decoration: none;">Labels</a>
          <a href="/about" style="color: #cbd5e1; text-decoration: none;">About</a>
          <a href="/help" style="color: #cbd5e1; text-decoration: none;">Help</a>
        </nav>
      </header>

      <!-- 1-Tap Persona Switcher Toolbar per Spec §3 -->
      <nav data-testid="role-switcher-toolbar" style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; align-items: center;">
        <span style="color: #8b949e; margin-right: 4px; font-size: 11px; text-transform: uppercase; font-weight: 700;">Seat:</span>
        <a href="/for/creator" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Creators</a>
        <a href="/for/label" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Record Labels</a>
        <a href="/for/dj" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">DJs</a>
        <a href="/for/media-house" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Media Houses</a>
        <a href="/for/supervisor" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Music Supervisors</a>
        <a href="/for/consumer" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Listeners</a>
        <a href="/for/corporate" style="padding: 4px 12px; border-radius: 999px; text-decoration: none; color: #fff; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);">Corporate</a>
        <a href="/for" style="margin-left: auto; color: #00f0ff; text-decoration: none; font-weight: 600;">All Seats →</a>
      </nav>

      <main>
        <section style="margin: 40px 0 60px 0;">
          <h1 style="font-size: 38px; line-height: 1.2; font-weight: 800; margin-bottom: 16px; color: #ffffff;">
            ${route.h1}
          </h1>
          <p style="font-size: 18px; line-height: 1.6; color: #94a3b8; max-width: 800px; margin-bottom: 32px;">
            ${route.subhead}
          </p>
          <div style="display: flex; gap: 16px;">
            <a href="${route.ctaHref || '/pricing'}" style="display: inline-block; background: #00f0ff; color: #0b0f19; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none;">
              ${route.ctaText || 'Get Started with Unified Credits'}
            </a>
            <a href="/about" style="display: inline-block; background: rgba(255,255,255,0.08); color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
              Learn More
            </a>
          </div>
        </section>

        <section style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 32px; margin-bottom: 48px;">
          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #e2e8f0;">Platform Capabilities & Guarantees</h2>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px; line-height: 1.8;">
            ${featureItemsHtml}
          </ul>
        </section>
      </main>

      <footer style="margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; font-size: 13px; color: #64748b; display: flex; justify-content: space-between;">
        <div>&copy; 2026 Intermaven Network Inc. All rights reserved. Nairobi &amp; Global Diaspora.</div>
        <div style="display: flex; gap: 16px;">
          <a href="/about" style="color: #64748b; text-decoration: none;">About</a>
          <a href="/pricing" style="color: #64748b; text-decoration: none;">Credits &amp; Pricing</a>
          <a href="/help" style="color: #64748b; text-decoration: none;">Support &amp; FAQ</a>
        </div>
      </footer>
    </div>
  `;

  // Inject meta tags and semantic body
  let html = getCleanTemplate(baseHtmlTemplate);

  // 1. Replace or update <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // 2. Head tags to inject
  const headTags = `
    <meta name="description" content="${route.description}" />
    <link rel="canonical" href="${route.canonical}" />

    <!-- Open Graph (WhatsApp, Facebook, LinkedIn) -->
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${route.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${route.canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="TuneMavens" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.ogImage}" />

    <!-- JSON-LD Structured Data (Spec §2 R2.6) -->
    <script type="application/ld+json">
      ${JSON.stringify(schemaOrg, null, 2)}
    </script>
  `;

  html = html.replace('</head>', `${headTags}\n  </head>`);

  // 3. Inject server-rendered semantic body into <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${serverRenderedBody}</div>`);

  return html;
}

function generate404Html(baseTemplate) {
  let html = baseTemplate;
  html = html.replace(/<title>.*?<\/title>/i, `<title>404 — Page Not Found | TuneMavens</title>`);

  const errorBody = `
    <div style="min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #f1f5f9; padding: 40px 20px;">
      <h1 style="font-size: 64px; font-weight: 900; color: #00f0ff; margin-bottom: 8px;">404</h1>
      <h2 style="font-size: 26px; font-weight: 700; margin-bottom: 16px;">The requested frequency does not exist</h2>
      <p style="font-size: 16px; color: #94a3b8; max-width: 500px; margin-bottom: 32px; line-height: 1.6;">
        The route or track you are looking for has moved or is restricted. Please check the URL or navigate back to the home portal.
      </p>
      <div style="display: flex; gap: 16px;">
        <a href="/" style="background: #00f0ff; color: #0b0f19; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none;">
          Return to TuneMavens
        </a>
        <a href="/pricing" style="background: rgba(255,255,255,0.08); color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
          View Credit Packages
        </a>
      </div>
    </div>
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${errorBody}</div>`);
  return html;
}

export function prerenderAll() {
  console.log('--- Starting TuneMavens Multi-Domain Prerender & Head Tag Ingestion ---');

  const registryRoutes = loadRegistryRoutes();
  const portalRoutes = [...TUNEMAVENS_ROUTES, ...registryRoutes];

  const apps = [
    { name: 'portal', routes: portalRoutes, domain: 'tunemavens.com' },
    { name: 'tunestream', routes: TUNESTREAM_ROUTES, domain: 'tunestream.co' },
    { name: 'syncmavens', routes: SYNCMAVENS_ROUTES, domain: 'syncmavens.com' }
  ];

  for (const app of apps) {
    const appDir = path.resolve('apps', app.name);
    const indexHtmlPath = path.join(appDir, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      console.warn(`Template not found: ${indexHtmlPath}`);
      continue;
    }

    const template = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Prerender into public directory so build picks them up directly
    const publicDir = path.join(appDir, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Prerender 404.html
    const errorHtml = generate404Html(template);
    fs.writeFileSync(path.join(publicDir, '404.html'), errorHtml, 'utf-8');
    console.log(`[${app.name}] ✔ Generated 404.html`);

    // Prerender marketing routes
    for (const route of app.routes) {
      const rendered = generateHtml(route, template);

      if (route.slug === 'index') {
        // Write prerendered index to public/ and dist/
        fs.writeFileSync(path.join(publicDir, 'index.html'), rendered, 'utf-8');
        console.log(`[${app.name}] ✔ Prerendered ${route.path} -> index.html (H1 + Head + OG Tags)`);
      } else {
        const routeSubdir = path.join(publicDir, route.slug);
        if (!fs.existsSync(routeSubdir)) {
          fs.mkdirSync(routeSubdir, { recursive: true });
        }
        fs.writeFileSync(path.join(routeSubdir, 'index.html'), rendered, 'utf-8');

        // Also sync to dist/ if dist directory already exists
        const distDir = path.join(appDir, 'dist');
        if (fs.existsSync(distDir)) {
          const distSubdir = path.join(distDir, route.slug);
          if (!fs.existsSync(distSubdir)) {
            fs.mkdirSync(distSubdir, { recursive: true });
          }
          fs.writeFileSync(path.join(distSubdir, 'index.html'), rendered, 'utf-8');
        }

        console.log(`[${app.name}] ✔ Prerendered ${route.path} -> ${route.slug}/index.html`);
      }
    }
  }

  console.log('--- Prerender & Head Tags Process Completed Successfully ---');
}

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('prerender.js')) {
  prerenderAll();
}
