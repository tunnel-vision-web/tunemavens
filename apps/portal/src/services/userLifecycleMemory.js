/**
 * TuneMavens User Lifecycle Memory Service
 * 
 * Persistently tracks and manages all user actions, activities, milestones,
 * and workspace interactions across the complete user lifecycle.
 * Provides rich memory context to the AI Prompt Assistant.
 */

const LIFECYCLE_STORAGE_KEY_PREFIX = 'tunemavens_lifecycle_memory_';
const CHAT_HISTORY_STORAGE_KEY_PREFIX = 'tunemavens_ai_chat_';

// Map workspace tabs/apps to contextual Help Knowledge Base article IDs
export const APP_DOC_MAPPINGS = {
  // Overview Dashboard
  'home': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'Overview Dashboard'
  },
  // Splits & Royalty Accounting
  'splits': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Split Sheets & Royalty Waterfall Guide',
    appTitle: 'TuneLedger / Split Cascade'
  },
  // Publishing Administration
  'publishing-election': {
    articleId: 'publishing-deals-admin-vs-copub-vs-buyout',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Publishing Deals & Global Rights Guide',
    appTitle: 'TuneMavens Publishing'
  },
  'publishing': {
    articleId: 'master-vs-composition-copyright',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Master vs. Composition Rights Guide',
    appTitle: 'Publishing Administration'
  },
  // AI Mastering
  'mastering': {
    articleId: 'masterlab-ai-mastering',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'MasterLab AI & Streaming LUFS Standards',
    appTitle: 'MasterLab AI Studio'
  },
  // Sync Placements & Clearances
  'sync': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'syncmavens-licensing-platform',
    label: 'Sync Placement & Supervisor Pitching Masterclass',
    appTitle: 'SyncMavens Licensing Marketplace'
  },
  'sync-placement': {
    articleId: 'sync-licensing-masterclass',
    fallbackArticleId: 'syncmavens-licensing-platform',
    label: 'Sync Briefs & Clearances Guide',
    appTitle: 'Sync Placement Hub'
  },
  // EPK & Web Worlds
  'epk': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK Studio & Custom Domain Setup',
    appTitle: 'TuneCreators EPK Studio'
  },
  'epk-builder': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK Studio & Custom Domain Setup',
    appTitle: 'EPK Builder'
  },
  // Corporate Ads & Sponsorships
  'corporate-ads': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'Corporate Ad Rates & Brand Flights Guide',
    appTitle: 'Corporate Advertising Console'
  },
  // Record Label Administration & Team Seats
  'label-team': {
    articleId: 'account-security-and-team-roles',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Team Roles & Label Roster Management',
    appTitle: 'Roster & Team Seats'
  },
  // Distribution
  'distribution': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Metadata, ISRC & DSP Distribution Guide',
    appTitle: 'Music Distribution Hub'
  },
  'distribution-election': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'mechanical-royalties-and-mlc',
    label: 'Metadata, ISRC & DSP Distribution Guide',
    appTitle: 'Distribution Portal'
  },
  // Tours & Live Bookings
  'tours': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Live Touring, Riders & Settlements Guide',
    appTitle: 'TuneBookings & Tour Manager'
  },
  'booking': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Tour Booking & Escrow Guide',
    appTitle: 'TuneBookings'
  },
  // Smart Contracts & Escrow
  'contracts': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'publishing-deals-admin-vs-copub-vs-buyout',
    label: 'Smart Contracts & Negotiation Guide',
    appTitle: 'Contracting & Deal Console'
  },
  'escrow': {
    articleId: 'studio-split-sheets-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Escrow Contracts & Deal Waterfall Guide',
    appTitle: 'Escrow Contracts'
  },
  // Catalog Management
  'catalog': {
    articleId: 'music-metadata-isrc-iswc-ipi-upc',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'Catalog Identifiers & Black Box Prevention',
    appTitle: 'Catalogue Manager'
  },
  // TuneStream & DJ Pool
  'tunestream': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'TuneStream Lossless Audio & Payouts',
    appTitle: 'TuneStream Lossless Player'
  },
  'companion': {
    articleId: 'tunecompanion-creator-operating-system',
    fallbackArticleId: 'tunestream-audiophile-streaming',
    label: 'TuneCompanion Creator Copilot & Telemetry Guide',
    appTitle: 'TuneCompanion Operating System'
  },
  'tunecompanion': {
    articleId: 'tunecompanion-creator-operating-system',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'TuneCompanion Creator Copilot Guide',
    appTitle: 'TuneCompanion Operating System'
  },
  'djpool': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'sync-licensing-masterclass',
    label: 'DJ Pool & Track Streaming Guide',
    appTitle: 'DJ Pool MVP'
  },
  'library': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'Lossless Streaming & Personal Library',
    appTitle: 'TuneStream Library'
  },
  'stream-controls': {
    articleId: 'tunestream-audiophile-streaming',
    fallbackArticleId: 'masterlab-ai-mastering',
    label: 'Streaming Controls & Audio Fidelity',
    appTitle: 'TuneStream Audio Controls'
  },
  // Profile, Account & Tax
  'profile': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Account Security & W-8BEN Tax Guide',
    appTitle: 'Profile & Settings'
  },
  'settings': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Account Security & Permissions Guide',
    appTitle: 'Profile & Settings'
  },
  'account': {
    articleId: 'account-security-2fa-and-roles',
    fallbackArticleId: 'legal-foundations-llc-trademark-tax-w8ben',
    label: 'Security, 2FA & Permissions',
    appTitle: 'Account Management'
  },
  // CRM, CMS & Social AI
  'crm': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Smart CRM & Inbound Leads Guide',
    appTitle: 'Intermaven Smart CRM'
  },
  'cms': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'music-metadata-isrc-iswc-ipi-upc',
    label: 'EPK & Web World CMS Guide',
    appTitle: 'TuneCreators CMS'
  },
  'social-ai': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'sync-licensing-masterclass',
    label: 'Social Media AI Strategy Guide',
    appTitle: 'Social Media AI Copilot'
  },
  // POS & Touring Merch
  'pos-inventory': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Tour Merch & Settlement Guide',
    appTitle: 'POS Tour Merch Inventory'
  },
  'pos-settlement': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'Nightly Settlement & Accounting Guide',
    appTitle: 'POS Nightly Settlements'
  },
  'pos-devices': {
    articleId: 'live-touring-guarantees-riders-settlements',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'Card Readers & Hardware Setup',
    appTitle: 'POS Terminal Devices'
  },
  // Domain Mappings & Promoted Acts
  'domain-mappings': {
    articleId: 'epk-studio-and-custom-domains',
    fallbackArticleId: 'account-security-2fa-and-roles',
    label: 'DNS & Custom Domain Verification',
    appTitle: 'Domain Mappings'
  },
  'promoted-acts': {
    articleId: 'corporate-ads-and-brand-flights',
    fallbackArticleId: 'universal-credits-system-guide',
    label: 'Promoted Acts & Featured Sponsorships',
    appTitle: 'Promoted Acts Admin'
  },
  // Credits, Pricing & Marketplace
  'pricing': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'corporate-ads-and-brand-flights',
    label: 'Universal Credits & App Billing Guide',
    appTitle: 'Credits & Pricing'
  },
  'tips': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'tuneledger-and-split-cascade',
    label: 'Fan Tips & Universal Credits Guide',
    appTitle: 'Consumer Tips & Payouts'
  },
  'app-marketplace': {
    articleId: 'universal-credits-system-guide',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'App Subscriptions & Credits Guide',
    appTitle: 'App Marketplace'
  },
  // Support, Claims, Disputes & Audits
  'support': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Support Claims & Dispute Resolutions Guide',
    appTitle: 'Support & AI Claims Desk'
  },
  'claims': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Filing Claims & Warranty Clearances',
    appTitle: 'Support & AI Claims Desk'
  },
  'tickets': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Support Ticketing & Resolution Guide',
    appTitle: 'Support & AI Claims Desk'
  },
  'audit': {
    articleId: 'tuneledger-escrow-dispute-locks',
    fallbackArticleId: 'studio-split-sheets-guide',
    label: 'TuneLedger Audit Locks & Dispute Escrow',
    appTitle: 'TuneLedger Audit Console'
  },
  'diagnostics': {
    articleId: 'tunesupport-ai-diagnosis-and-resolution',
    fallbackArticleId: 'unified-credits-support-and-refunds',
    label: 'DDEX & Stems Health Diagnostics',
    appTitle: 'DDEX Health & Diagnostics'
  },
  'disputes': {
    articleId: 'tuneledger-escrow-dispute-locks',
    fallbackArticleId: 'how-support-ticketing-works',
    label: 'TuneLedger Escrow Dispute Locks',
    appTitle: 'Dispute Resolution Console'
  },
  'community': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'tuneledger-escrow-dispute-locks',
    label: 'Community & Support Claims Desk',
    appTitle: 'TuneMavens Community'
  },
  'help': {
    articleId: 'how-support-ticketing-works',
    fallbackArticleId: 'master-vs-composition-copyright',
    label: 'TuneMavens Help & Industry Knowledge Base',
    appTitle: 'Help Center'
  }
};

/**
 * Get the relevant Help Knowledge Base URL for the current active app or tab
 */
export function getRelevantDocLink(activeContext) {
  const mapping = APP_DOC_MAPPINGS[activeContext] || {
    articleId: 'master-vs-composition-copyright',
    label: 'Help & Industry Knowledge Base',
    appTitle: 'TuneMavens Ecosystem'
  };
  return {
    url: `/help?article=${mapping.articleId}`,
    articleId: mapping.articleId,
    label: mapping.label,
    appTitle: mapping.appTitle
  };
}

/**
 * Get user identifier for lifecycle storage
 */
function getStorageKey(userId) {
  return `${LIFECYCLE_STORAGE_KEY_PREFIX}${userId || 'guest_user'}`;
}

/**
 * Load complete user lifecycle memory from persistent storage
 */
export function loadUserLifecycleMemory(user) {
  const userId = user?.id || user?._id || user?.email || 'guest';
  const key = getStorageKey(userId);

  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch (err) {
    console.warn('Error reading lifecycle memory from storage:', err);
  }

  // Initial seed lifecycle memory for new or uninitialized users
  const defaultMemory = {
    userId: userId,
    userEmail: user?.email || 'user@tunemavens.com',
    userName: user?.name || user?.brand_name || 'Creator',
    primaryRole: user?.role || 'creator',
    creditsBalance: user?.credits ?? 600,
    lifecycleStage: 'Active Creator / Pro Tier',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // ~30 days ago
    lastActiveAt: new Date().toISOString(),
    milestones: [
      { id: 'm1', title: 'Joined TuneMavens Network', date: '30 days ago', icon: 'check' },
      { id: 'm2', title: 'Provisioned Intermaven Universal Wallet (600 Credits)', date: '30 days ago', icon: 'wallet' },
      { id: 'm3', title: 'Configured Primary Creator Workspace', date: '25 days ago', icon: 'settings' }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'splits',
        action: 'Configured Split Sheet',
        app: 'TuneLedger',
        summary: 'Created 50/50 songwriter & producer split for upcoming single release.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      },
      {
        id: 'act-2',
        type: 'mastering',
        action: 'MasterLab AI Audio Analysis',
        app: 'MasterLab',
        summary: 'Mastered 24-bit WAV track to -14 LUFS integrated target with -1.0 dBFS true peak ceiling.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'act-3',
        type: 'epk',
        action: 'Updated Press Kit & Custom Domain',
        app: 'TuneCreators',
        summary: 'Linked custom domain DNS and uploaded high-res artist press photography.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
      },
      {
        id: 'act-4',
        type: 'publishing',
        action: 'Selected Publishing Administrator Mode',
        app: 'TuneMavens Publishing',
        summary: 'Elected 10% Administrator Mode to retain 100% copyright ownership for global mechanical collection.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
      }
    ],
    catalogStats: {
      registeredTracks: 4,
      isrcCodesAllocated: 4,
      iswcCodesMatched: 3,
      oneStopVerified: true
    },
    activeWorkflows: {
      currentDraft: 'Single Release Campaign 2026',
      targetDSPs: ['Spotify', 'Apple Music', 'TuneStream Lossless', 'Tidal'],
      syncReadiness: 'High (Instrumentals & Stems Exported)'
    }
  };

  saveUserLifecycleMemory(userId, defaultMemory);
  return defaultMemory;
}

/**
 * Save updated user lifecycle memory
 */
export function saveUserLifecycleMemory(userId, memory) {
  try {
    if (typeof localStorage !== 'undefined') {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(memory));
    }
  } catch (err) {
    console.warn('Error saving lifecycle memory to storage:', err);
  }
}

/**
 * Record a new user action into the persistent lifecycle memory
 */
export function logUserActivity(user, { type, action, app, summary, metadata = {} }) {
  if (!user) return;
  const userId = user?.id || user?._id || user?.email || 'guest';
  const memory = loadUserLifecycleMemory(user);

  const newActivity = {
    id: `act-${Date.now()}`,
    type: type || 'general',
    action: action || 'User Interaction',
    app: app || 'Workspace',
    summary: summary || 'User updated project workspace.',
    metadata,
    timestamp: new Date().toISOString()
  };

  // Prepend new activity and cap at 100 most recent items
  memory.activities = [newActivity, ...(memory.activities || [])].slice(0, 100);
  memory.lastActiveAt = new Date().toISOString();
  if (user.credits !== undefined) {
    memory.creditsBalance = user.credits;
  }
  if (user.role) {
    memory.primaryRole = user.role;
  }

  saveUserLifecycleMemory(userId, memory);
  return newActivity;
}

/**
 * Generate a comprehensive prompt context summary for the AI Assistant
 */
export function generateAiLifecycleContext(user, activeTab) {
  const memory = loadUserLifecycleMemory(user);
  const currentAppMapping = APP_DOC_MAPPINGS[activeTab] || { appTitle: activeTab || 'General Workspace' };

  const recentActivitiesText = (memory.activities || [])
    .slice(0, 8)
    .map(a => `- [${new Date(a.timestamp).toLocaleDateString()}] ${a.app}: ${a.action} (${a.summary})`)
    .join('\n');

  return `
USER LIFECYCLE MEMORY CONTEXT:
* User: ${memory.userName} (${memory.userEmail})
* Active Role: ${memory.primaryRole}
* Current Active App/Tool: ${currentAppMapping.appTitle} (tab: "${activeTab}")
* Credits Balance: ${memory.creditsBalance} Universal Credits
* Lifecycle Stage: ${memory.lifecycleStage}
* Catalog Stats: ${memory.catalogStats.registeredTracks} registered tracks, ${memory.catalogStats.isrcCodesAllocated} ISRCs, One-Stop Verified: ${memory.catalogStats.oneStopVerified}
* Active Workflows: Draft "${memory.activeWorkflows.currentDraft}", Sync Readiness: ${memory.activeWorkflows.syncReadiness}

RECENT USER LIFECYCLE ACTIVITIES & ACTIONS:
${recentActivitiesText || 'No recent activities recorded.'}
`.trim();
}

/**
 * Load AI conversation history for the user
 */
export function loadAiChatHistory(userId) {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(`${CHAT_HISTORY_STORAGE_KEY_PREFIX}${userId || 'guest'}`);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading chat history:', err);
  }
  return [];
}

/**
 * Save AI conversation history for the user
 */
export function saveAiChatHistory(userId, history) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${CHAT_HISTORY_STORAGE_KEY_PREFIX}${userId || 'guest'}`, JSON.stringify(history));
    }
  } catch (err) {
    console.warn('Error saving chat history:', err);
  }
}

/**
 * Generate an intelligent, context-aware AI response utilizing full lifecycle memory
 */
export function generateAiAssistantResponse(query, user, activeTab, conversationHistory) {
  const memory = loadUserLifecycleMemory(user);
  const q = query.toLowerCase().trim();
  const currentApp = APP_DOC_MAPPINGS[activeTab] || { appTitle: activeTab || 'Workspace' };

  // Contextual intelligence based on lifecycle query & active tool
  if (q.includes('companion') || q.includes('tunecompanion') || activeTab === 'companion' || activeTab === 'tunecompanion') {
    return {
      reply: `Welcome to **TuneCompanion**—your real-time creator business operating system and live copilot across the TuneMavens ecosystem.

Here is what TuneCompanion coordinates for your catalog:
1. **Interactive Split Ledger & 7-Tier Waterfall**: Recoups recording advances first, then producer performance bonuses and sample escrow reserves, before perpetual writer/master equity distributes.
2. **Instant Multi-Rail Payouts**: Automated M-Pesa STK mobile wallet pushes (Kenya & East Africa) and Stripe direct bank deposits (global) with 0% platform extraction on tips.
3. **Sync Placement Radar**: Live algorithmic matching against active SyncMavens briefs for Hollywood films, Netflix series, gaming, and brand commercials with one-tap stem and cue sheet dispatch.
4. **MasterLab AI Playbook**: Calibrates your streaming audio (-14 LUFS integrated / -1.0 dBFS true peak ceiling) and schedules your 6-week release timeline.
5. **Catalog Telemetry & Hotspots**: Real-time cross-platform listener metrics and streaming hotspot heatmaps (Nairobi, London, Lagos, New York).

*Dual Viewport Tip:* You can toggle between the **Desktop Studio Console** and the **Pocket Phone Frame** using the responsive switcher in the top bar.`,
      suggestedActions: [
        { label: 'TuneCompanion Guide', link: '/#/help#tunecompanion-creator-operating-system' },
        { label: 'Open Split Ledger', tab: 'splits' },
        { label: 'Sync Placement Radar', tab: 'sync' },
        { label: 'MasterLab AI Audio', tab: 'mastering' }
      ]
    };
  }

  if (q.includes('split') || q.includes('ledger') || activeTab === 'splits') {
    return {
      reply: `I see from your lifecycle history that you recently configured a **50/50 songwriter & producer split** in TuneLedger for your upcoming single release.

Here is how your current setup functions:
1. **Gross Distribution Ingestion**: When statements import from DSPs, gross revenues land in your TuneLedger cascade.
2. **Recoupment First**: Any designated advance or recording costs are deducted before collaborator payouts.
3. **Automated Payouts**: The remaining 50/50 net splits disburse automatically to your collaborators' Stripe or M-Pesa accounts.

*Tip for your current session:* You can review our [Split Sheets & Royalty Waterfall Guide](/#/help#studio-split-sheets-guide) to ensure you have proper sample clearance warranties locked in.`,
      suggestedActions: [
        { label: 'View Split Sheet Docs', link: '/#/help#studio-split-sheets-guide' },
        { label: 'Open TuneLedger Console', tab: 'splits' }
      ]
    };
  }

  if (q.includes('publishing') || q.includes('copyright') || q.includes('mechanical') || activeTab === 'publishing-election') {
    return {
      reply: `Based on your lifecycle records, you elected **Option A: Administrator Mode (10% Fee)** with TuneMavens Publishing.

Here is why this is advantageous for your catalog:
* **100% Ownership Retained**: You did not assign your copyrights away.
* **Global Mechanicals Captured**: The MLC in the US and mechanical CMOs in Europe/Africa are tracking interactive streams that standard distributors miss.
* **Writer's Share Safeguarded**: Your 50% Writer's Share performance royalties flow direct to your PRO (ASCAP/BMI/PRS), while we collect the 50% Publisher's Share and mechanicals for you.

Would you like me to inspect your ISRC/ISWC mapping to make sure no royalties are caught in the black box?`,
      suggestedActions: [
        { label: 'Publishing Deals Guide', link: '/#/help#publishing-deals-admin-vs-copub-vs-buyout' },
        { label: 'Mechanicals & The MLC Guide', link: '/#/help#mechanical-royalties-and-mlc' }
      ]
    };
  }

  if (q.includes('credit') || q.includes('balance') || q.includes('wallet')) {
    return {
      reply: `Your universal balance currently stands at **${memory.creditsBalance} Universal Credits**.

You can spend these credits seamlessly across the network:
* **MasterLab AI Mastering**: 15 credits per track master (you have enough for ${(memory.creditsBalance / 15).toFixed(0)} more masters).
* **SyncMavens Brief Submission**: 5 credits per supervisor pitch.
* **Custom Domain Link**: 50 credits/year for zero-config SSL.
* **Smart Contract Execution**: 10 credits per contract.

All credits are shared universally between TuneMavens native utilities and Intermaven partner apps.`,
      suggestedActions: [
        { label: 'Credits Guide', link: '/#/help#universal-credits-system-guide' },
        { label: 'Manage Universal Wallet', link: '/pricing' }
      ]
    };
  }

  if (q.includes('master') || q.includes('lufs') || activeTab === 'mastering') {
    return {
      reply: `Looking at your lifecycle logs, you recently analyzed a 24-bit WAV file in **MasterLab** targeting **-14 LUFS integrated** with a **-1.0 dBFS true peak ceiling**.

For optimal streaming distribution:
* **Spotify & YouTube**: Target -14 LUFS. Going louder causes their normalization algorithm to turn down the digital fader, reducing dynamic punch.
* **Apple Music & TIDAL**: Target -16 LUFS for maximum preservation of transient acoustic detail.
* **True Peak Protection**: Keeping your ceiling at -1.0 dBFS ensures no inter-sample distortion occurs during lossy transcoding to AAC/Ogg Vorbis.`,
      suggestedActions: [
        { label: 'MasterLab AI Docs', link: '/#/help#masterlab-ai-mastering' },
        { label: 'Open MasterLab Studio', tab: 'mastering' }
      ]
    };
  }

  if (q.includes('sync') || q.includes('placement') || q.includes('supervisor') || activeTab === 'sync' || activeTab === 'sync-placement') {
    return {
      reply: `Your catalog currently has **${memory.catalogStats.registeredTracks} tracks**, and is marked as **One-Stop Verified** (${memory.activeWorkflows.syncReadiness}).

Because you control 100% of both the Master and Publishing rights, music supervisors on SyncMavens can license your catalog in hours with zero clearance delays. 

I recommend ensuring you have your **Instrumental mixes** and **clean TV edits** uploaded for all 4 tracks so supervisors can audition dialogue-ready cuts immediately.`,
      suggestedActions: [
        { label: 'Sync Licensing Masterclass', link: '/#/help#sync-licensing-masterclass' },
        { label: 'Browse Active Briefs', link: '/sync-placement' }
      ]
    };
  }

  if (q.includes('corporate') || q.includes('ad') || q.includes('flight') || activeTab === 'corporate-ads') {
    return {
      reply: `In the Corporate Advertising & Flights Console, brands book across 4 established rate tiers:
* **Pulse (\$499)**: 25,000 verified listens (\$19.96 CPM) with audio prerolls.
* **Amplified (\$1,499)**: 100,000 verified listens (\$14.99 CPM) with midrolls and playlist takeover (Most Popular).
* **Culture Lead (\$3,999)**: 350,000 verified listens (\$11.43 CPM) with branded curated station.
* **Titan (\$9,999)**: 1,000,000 verified listens (\$10.00 CPM) with roadblock & category exclusivity.

All campaigns feature live impression telemetry, click-through tracking, and automatic lead injection into the Smart CRM.`,
      suggestedActions: [
        { label: 'Review Ad Rates Guide', link: '/#/help#corporate-ads-and-brand-flights' },
        { label: 'Open Corporate Console', tab: 'corporate-ads' }
      ]
    };
  }

  if (q.includes('history') || q.includes('what did i do') || q.includes('activity') || q.includes('memory')) {
    const list = memory.activities.slice(0, 5).map(a => `• **${a.action}** (${a.app}): ${a.summary}`).join('\n');
    return {
      reply: `Here is a summary of your recent lifecycle activities tracked across TuneMavens:

${list}

I retain persistent memory of your catalog (${memory.catalogStats.registeredTracks} tracks), your 10% Publishing Administrator election, your 50/50 split configs, and your current balance of ${memory.creditsBalance} Universal Credits. How can I assist you with your current work in **${currentApp.appTitle}**?`,
      suggestedActions: [
        { label: 'View Knowledge Base', link: '/#/help' }
      ]
    };
  }

  // Default context-aware response
  return {
    reply: `Hello ${memory.userName}! I am your **TuneMavens AI Copilot**, equipped with full memory of your creator lifecycle, recent actions, and catalog assets.

You are currently working in **${currentApp.appTitle}**. Based on your profile (${memory.primaryRole} with ${memory.creditsBalance} credits and ${memory.catalogStats.registeredTracks} registered tracks), I can help you with:
* Verifying split sheets and collaborator payout cascades.
* Reviewing global mechanical & performance royalty collection status.
* Analyzing loudness targets for streaming and sync deliverables.
* Preparing one-stop metadata for music supervisor briefs.

How would you like to proceed with your current project?`,
    suggestedActions: [
      { label: `Read Docs for ${currentApp.appTitle}`, link: getRelevantDocLink(activeTab).url },
      { label: 'Explore Knowledge Base', link: '/#/help' }
    ]
  };
}
