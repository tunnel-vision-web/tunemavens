/**
 * TuneStream Consumer Documentation & Help Guides
 * 
 * Exhaustive user guides, step-by-step walkthroughs, and FAQs targeting
 * listeners, music fans, and audiophiles using TuneStream across Web and Mobile.
 */

export const CONSUMER_DOC_CATEGORIES = [
  { id: 'all', label: 'All Guides' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'audio-quality', label: 'Audio Quality & HiFi' },
  { id: 'offline-storage', label: 'Offline & Downloads' },
  { id: 'credits-tipping', label: 'Credits & Tipping' },
  { id: 'playlists-crates', label: 'Playlists & Library' },
  { id: 'plans-billing', label: 'Plans & Billing' },
  { id: 'devices-sync', label: 'Devices & In-Car' },
  { id: 'privacy-security', label: 'Privacy & Account' },
];

export const CONSUMER_DOC_ARTICLES = [
  {
    id: 'doc-get-started',
    slug: 'getting-started-quickstart-guide',
    categoryId: 'getting-started',
    category: 'Getting Started',
    title: 'Getting Started with TuneStream: The Listener\'s Quickstart Guide',
    updatedAt: 'October 2026',
    readTime: '4 min read',
    summary: 'A complete overview of navigating TuneStream, setting up your audio preferences, finding signed creators, and playing your first lossless master.',
    steps: [
      {
        title: 'Step 1: Create Your Account & Claim Bonus Credits',
        detail: 'Sign up with your email or Google account. Every new registration instantly receives 150 shared Intermaven Network credits deposited into your vault.'
      },
      {
        title: 'Step 2: Choose Your Listening Quality',
        detail: 'Click on the HiFi Audio Player settings icon in the bottom playback bar. Select between Standard (160kbps), High (320kbps), or Lossless Studio FLAC (24-bit / 48kHz).'
      },
      {
        title: 'Step 3: Explore Roster Artists & Web Worlds',
        detail: 'Visit the Explore page to discover signed creators like Ndufo, Aisha, and Brian Omondi. Clicking any creator opens their bespoke web world, discography, and direct tipping portal.'
      },
      {
        title: 'Step 4: Build Your First Playlist Crate',
        detail: 'Tap "+ Create Playlist" from the top navigation or click the "..." menu on any song to add it to your personal library.'
      }
    ],
    faqs: [
      {
        q: 'Do I need a credit card to sign up?',
        a: 'No. TuneStream Free requires no payment method. You can listen ad-supported with 150 bonus credits immediately upon signup.'
      },
      {
        q: 'Can I access TuneStream on both computer and smartphone?',
        a: 'Yes. TuneStream runs natively in modern web browsers and as a progressive native app for iOS and Android with automatic sync.'
      }
    ]
  },
  {
    id: 'doc-audio-quality',
    slug: 'audio-quality-hifi-lossless-settings',
    categoryId: 'audio-quality',
    category: 'Audio Quality & HiFi',
    title: 'Audio Quality & HiFi Playback: Configuring 24-Bit Lossless FLAC',
    updatedAt: 'October 2026',
    readTime: '6 min read',
    summary: 'Everything you need to know about streaming uncompressed 24-bit master audio, hardware DAC compatibility, volume normalization, and mobile data usage.',
    steps: [
      {
        title: 'Step 1: Selecting Lossless FLAC in Playback Bar',
        detail: 'Open the HiFi Audio Player at the bottom of the screen. Look for the "Lossless 24-Bit" badge. Ensure streaming tier is set to FLAC for master clarity.'
      },
      {
        title: 'Step 2: Connecting an External USB DAC',
        detail: 'Plug a supported USB-C DAC (such as Apple Adapter, Moondrop Dawn Pro, or AudioQuest DragonFly) into your device. TuneStream auto-detects hardware sample rates up to 96kHz.'
      },
      {
        title: 'Step 3: Configuring Dynamic Range Normalization',
        detail: 'In Audio Preferences, toggle "Studio Bit-Perfect Output" ON to disable all artificial compression and experience the exact mastering engineer loudness curves.'
      }
    ],
    faqs: [
      {
        q: 'How much cellular data does Lossless streaming use?',
        a: 'Lossless FLAC consumes approximately 15MB to 25MB per 4-minute song, or around 1GB per hour. Standard streaming uses only 4MB per song (150MB per hour).'
      },
      {
        q: 'Does Bluetooth support true 24-bit lossless audio?',
        a: 'Standard Bluetooth (SBC/AAC) re-encodes audio lossily. To hear true bit-perfect lossless, use wired headphones or Bluetooth with LDAC / aptX Lossless codecs.'
      }
    ]
  },
  {
    id: 'doc-offline-storage',
    slug: 'offline-downloads-8gb-storage-management',
    categoryId: 'offline-storage',
    category: 'Offline & Downloads',
    title: 'Offline Downloads: Managing Your 8GB Smart Local Storage',
    updatedAt: 'October 2026',
    readTime: '5 min read',
    summary: 'Learn how to download full albums, configure your device cache allocation (up to 8GB), and listen off-grid without mobile connectivity.',
    steps: [
      {
        title: 'Step 1: Downloading an Album or Single',
        detail: 'On any album card or single detail view, click the "Download Offline" icon (downward arrow). A progress ring will indicate caching completion.'
      },
      {
        title: 'Step 2: Accessing Offline Mode',
        detail: 'When your device loses Wi-Fi or cellular signal, TuneStream automatically switches into Offline Mode, displaying all cached tracks with a green checkmark badge.'
      },
      {
        title: 'Step 3: Configuring Storage Limits',
        detail: 'Go to Settings > Storage & Cache. Use the slider to set your device allocation between 2GB and 8GB. The auto-prune feature removes tracks unplayed for over 30 days.'
      }
    ],
    faqs: [
      {
        q: 'Do offline downloads expire?',
        a: 'Downloads remain cached indefinitely as long as your account connects to the internet at least once every 30 days to verify licensing tokens.'
      },
      {
        q: 'Can I export downloaded songs to MP3 files on my drive?',
        a: 'No. Downloads are stored in an encrypted sandboxed cache specifically optimized for instant playback within the TuneStream player.'
      }
    ]
  },
  {
    id: 'doc-credits-tipping',
    slug: 'shared-credits-direct-artist-tipping',
    categoryId: 'credits-tipping',
    category: 'Credits & Tipping',
    title: 'Intermaven Shared Credits: Mid-Listen Artist Tipping & Wallet Top-Ups',
    updatedAt: 'October 2026',
    readTime: '5 min read',
    summary: 'Discover how shared network credits empower you to directly tip independent creators, reload your vault via M-Pesa or Card, and trace your support impact.',
    steps: [
      {
        title: 'Step 1: Checking Your Credit Balance',
        detail: 'Your credit balance is always visible in the top navigation bar with the gold coin icon. Click it to view recent consumption, bonuses, and tip receipts.'
      },
      {
        title: 'Step 2: Sending a Mid-Listen Tip',
        detail: 'While streaming any song, tap the "Tip Creator" button in the HiFi Player. Choose 10, 25, 50, or 100 credits. Optionally attach a short congratulatory message.'
      },
      {
        title: 'Step 3: Reloading Credits with Mobile Money or Card',
        detail: 'Click "Top Up Credits" to choose a reload pack ($4.99 for 500 credits, $9.99 for 1,200 credits, or $19.99 for 2,800 credits). Pay instantly via M-Pesa STK push, Apple Pay, Visa, or Mastercard.'
      }
    ],
    faqs: [
      {
        q: 'Do credits expire if I do not use them?',
        a: 'Never. Intermaven Network Credits are non-expiring and remain in your vault until consumed.'
      },
      {
        q: 'Can I use the same credits on other TuneMavens platforms?',
        a: 'Yes! Your credits are shared across TuneStream, SyncMavens, and all other Intermaven Network applications.'
      }
    ]
  },
  {
    id: 'doc-playlists-crates',
    slug: 'playlists-crates-collaborative-curation',
    categoryId: 'playlists-crates',
    category: 'Playlists & Library',
    title: 'Playlists & Crates: Organizing Tracks & Collaborative Mixes',
    updatedAt: 'October 2026',
    readTime: '4 min read',
    summary: 'Create custom color-coded crates, re-order your listening queues, and invite friends to curate shared collaborative playlists in real time.',
    steps: [
      {
        title: 'Step 1: Create a Custom Crate',
        detail: 'Click "My Library > Create Playlist" in the top menu. Enter a title, choose a vibrant background gradient, and write a mood descriptor.'
      },
      {
        title: 'Step 2: Add Songs While Listening',
        detail: 'Whenever you hear a track you love, tap the "+" button in the player bar and select the playlist you want to store it in.'
      },
      {
        title: 'Step 3: Invite Friends to Collaborate',
        detail: 'Open your playlist, click "Share & Collaborate", and copy your secret crate invite link. Anyone with the link can add their favorite tracks to your mix.'
      }
    ],
    faqs: [
      {
        q: 'Is there a limit on how many songs a playlist can hold?',
        a: 'Each playlist can store up to 5,000 tracks with instant search and filtering.'
      },
      {
        q: 'Can I make my playlist private so only I can see it?',
        a: 'Yes. Toggle "Private Crate" in playlist settings to prevent it from appearing on your public profile or in community searches.'
      }
    ]
  },
  {
    id: 'doc-plans-billing',
    slug: 'plans-billing-subscriptions-family-sharing',
    categoryId: 'plans-billing',
    category: 'Plans & Billing',
    title: 'Plans & Billing: Free vs Individual, Duo & Family Sharing',
    updatedAt: 'October 2026',
    readTime: '5 min read',
    summary: 'Compare features across TuneStream tiers, manage your monthly or annual subscription, and invite family members to shared accounts.',
    steps: [
      {
        title: 'Step 1: Compare Plan Tiers',
        detail: 'Visit the Plans section on the landing page or in your Account Dashboard to compare Free, HiFi Individual ($4.99/mo), Duo ($7.99/mo), and Family ($9.99/mo).'
      },
      {
        title: 'Step 2: Upgrading to Premium',
        detail: 'Select your preferred tier, choose Monthly or Annual billing (saving 20%), and complete checkout. Your account upgrades immediately without restarting playback.'
      },
      {
        title: 'Step 3: Inviting Members to Duo or Family',
        detail: 'In Settings > Family Management, click "Invite Member" and enter their email address. They receive an instant link to activate their standalone profile.'
      }
    ],
    faqs: [
      {
        q: 'Can I cancel or pause my subscription anytime?',
        a: 'Yes. There are no lock-in contracts. You can cancel with 1 click in your Billing settings and keep premium perks until the end of your billing cycle.'
      },
      {
        q: 'Do Family members share listening history or playlists?',
        a: 'No. Every member gets their own private account, password, favorites, and recommendations, plus access to the shared Family Mix playlist.'
      }
    ]
  },
  {
    id: 'doc-devices-sync',
    slug: 'devices-sync-carplay-android-auto-bluetooth',
    categoryId: 'devices-sync',
    category: 'Devices & In-Car',
    title: 'Devices & In-Car Playback: Bluetooth, CarPlay & Android Auto',
    updatedAt: 'October 2026',
    readTime: '4 min read',
    summary: 'How to stream seamlessly in your car, connect to Bluetooth receivers, and sync your queue between computer, mobile, and tablet.',
    steps: [
      {
        title: 'Step 1: Bluetooth In-Car Pairing',
        detail: 'Turn on your vehicle\'s Bluetooth, pair your smartphone, and open TuneStream. Playback controls (Play, Pause, Skip, Track Title) appear automatically on your dashboard screen.'
      },
      {
        title: 'Step 2: Apple CarPlay & Android Auto',
        detail: 'Connect your device via USB or wireless CarPlay. Launch the TuneStream icon on your vehicle console to browse your cached playlists safely while driving.'
      },
      {
        title: 'Step 3: Cross-Device Remote Hand-Off',
        detail: 'Start listening on your desktop web player at home, then pick up your phone when leaving. Your active track and queue sync seamlessly.'
      }
    ],
    faqs: [
      {
        q: 'Does TuneStream support steering wheel media buttons?',
        a: 'Yes. TuneStream integrates natively with the Media Session API, supporting steering wheel skip, volume, and playback toggle keys.'
      }
    ]
  },
  {
    id: 'doc-privacy-security',
    slug: 'privacy-security-private-listening-sessions',
    categoryId: 'privacy-security',
    category: 'Privacy & Account',
    title: 'Privacy & Security: Private Sessions, Data Controls & Account Safety',
    updatedAt: 'October 2026',
    readTime: '3 min read',
    summary: 'Protect your listening privacy, turn on stealth private sessions, manage connected devices, and secure your account credentials.',
    steps: [
      {
        title: 'Step 1: Enabling Private Listening Session',
        detail: 'In the player menu, click "Start Private Session". Your listening activity during this session will not affect your public profile, recommendations, or friend feeds.'
      },
      {
        title: 'Step 2: Reviewing Connected Devices',
        detail: 'Go to Settings > Authorized Devices to view all browsers, phones, and tablets logged into your account. Click "Revoke" on any unrecognized session.'
      },
      {
        title: 'Step 3: Two-Factor Authentication',
        detail: 'Enable 2FA via SMS or Authenticator App in Account Security to protect your credit vault and personal playlists.'
      }
    ],
    faqs: [
      {
        q: 'Does TuneStream sell my personal listening data to advertisers?',
        a: 'Never. We respect listener privacy. Your listening history and tastes are never sold or shared with third-party tracking brokers.'
      }
    ]
  }
];

export const FREQUENT_CONSUMER_FAQS = [
  {
    q: 'How does TuneStream differ from Spotify, Apple Music, or Tidal?',
    a: 'TuneStream is built on ethical music architecture: we stream 24-bit studio FLAC master audio, provide mid-listen direct artist tipping through TuneLedger split cascades, and share network credits across our entire creator and live event ecosystem.'
  },
  {
    q: 'What audio formats are supported for playback?',
    a: 'TuneStream natively streams Lossless FLAC (up to 24-bit / 48kHz), high-bitrate AAC (320kbps), and standard MP3 (160kbps). Offline caching downloads master files.'
  },
  {
    q: 'How do my credits get deducted when listening?',
    a: 'On TuneStream Free, streaming is 100% free with occasional visual sponsorships. On TuneStream Premium, standard listening deducts 1 credit per stream (or 0.1 credits in selected emerging regions). Tipping creators deducts credits equivalent to the tip amount.'
  },
  {
    q: 'Can I request a refund if I experience streaming problems?',
    a: 'Yes. If you experience technical defects, failed downloads, or billing discrepancies, you can file a ticket in our Support Desk for immediate review and credit reimbursement.'
  }
];
