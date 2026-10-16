/**
 * TuneMavens Comprehensive Help & Industry Knowledge Base Data
 * 
 * In-depth articles covering Music Publishing, Global Copyright, Industry Business,
 * Contracts, Licensing, and the complete TuneMavens Service Ecosystem.
 */

export const HELP_CATEGORIES = [
  { id: 'all', label: 'All Articles', icon: 'RiBookOpenLine' },
  { id: 'publishing', label: 'Publishing & Copyright', icon: 'RiGlobalLine' },
  { id: 'business', label: 'Music Business & Contracts', icon: 'RiFileList3Line' },
  { id: 'services', label: 'TuneMavens Service Offering', icon: 'RiSparklingLine' },
  { id: 'royalties', label: 'Royalties & Payouts', icon: 'RiExchangeDollarLine' },
  { id: 'account', label: 'Credits & Security', icon: 'RiShieldCheckLine' },
  { id: 'affiliates', label: 'Affiliates & Creator Onboarding', icon: 'RiUserSharedFill' },
  { id: 'support', label: 'Support & AI Claims Desk', icon: 'RiCustomerService2Fill' },
];

export const HELP_ARTICLES = [
  // =========================================================================
  // CATEGORY: AFFILIATES & CREATOR ONBOARDING (RECOMMENDED READING)
  // =========================================================================
  {
    id: 'affiliate-program-guide',
    category: 'affiliates',
    title: 'The TuneMavens Affiliate Scheme: 3% to 12% Multi-Stream Commissions',
    readingTime: '7 min read',
    excerpt: 'Complete guide to the Ditto Music-modeled TuneMavens affiliate scheme. Learn how 3% to 12% multi-stream compensation operates across streaming, lossless sales, multitrack stems, VIP tour passes, sync placements, and creator reloads with persistent 90-day cookie tracking.',
    tags: ['Affiliate Scheme', 'Ditto Model', 'Commission Matrix', '90-Day Cookies', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    requiredReading: false,
    assignedRoles: ['affiliate'],
    toolLink: { label: 'Open Affiliate Partner Console', path: '/affiliates' },
    sections: [
      {
        heading: 'The Ditto-Modeled Ecosystem Framework',
        content: `TuneMavens operates an industry-grade affiliate and creator ambassador scheme closely modeled around **Ditto Music's global partner framework**, but specifically optimized for the high-velocity East African and global creator economies.

Unlike legacy affiliate programs that pay a one-time flat bounty on software signups, TuneMavens ties affiliate rewards directly to **multi-stream consumption and ongoing creator commerce**. When an affiliate brings a creator, record label, music supervisor, or corporate brand into the ecosystem, the affiliate earns recurring commissions every single time content is consumed, streamed, licensed, or purchased.

Every verified partner receives:
* An official referral link (e.g. \`https://tunemavens.com/?ref=YOURCODE\`)
* Persistent **90-day cross-subdomain tracking cookies** (attributing activity across TuneMavens, TuneStream, and SyncMavens)
* Real-time ledger entries on **TuneLedger** with immutable transaction timestamps
* Tier-based bonus accelerators ranging from **Scout** (Base) to **Ambassador** (+2.0% across all streams).`
      },
      {
        heading: 'The 3% to 12% Multi-Stream Compensation Matrix',
        content: `Affiliate earnings are calculated against gross net transaction receipts across seven distinct ecosystem monetization channels:

| Monetization Stream | Ecosystem Channel | Base Rate | Partner Tier (+1%) | Ambassador Tier (+2%) | Calculation Basis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Streaming & Micro-Tipping** | TuneStream Web World | **3.0%** | **4.0%** | **5.0%** | Creator Net Stream Pool Royalty + Tips |
| **Lossless Track Downloads** | Creator EPK & Storefront | **5.0%** | **6.0%** | **7.0%** | Gross Single Track Sale ($0.99 - $1.99) |
| **Full Album Showcase** | TuneStream & EPK Web Worlds | **7.0%** | **8.0%** | **9.0%** | Gross Album Package Sale ($9.99 / 50 Credits) |
| **Multitrack Stems & Producer Kits** | SyncMavens & Industry Hub | **8.5%** | **9.5%** | **10.5%** | Gross Stems Package ($29 - $99) |
| **Digital QR Passes & Live Tours** | TuneTours & M-Pesa Live Push | **10.0%** | **11.0%** | **12.0%** | Net Live Event Ticket Proceeds ($20 - $100) |
| **Commercial Sync Licensing** | SyncMavens Brief Matching Hub | **12.0%** | **12.0%** | **12.0%** | Net Sync Placement Fee (Capped at $300/deal) |
| **Creator Onboarding & Credits** | Intermaven Unified Network | **12.0%** | **12.0%** | **12.0%** | First Unified Credit Top-Up Pack ($100 pack) |`
      },
      {
        heading: 'Persistent 90-Day Cross-Domain Cookie Attribution',
        content: `Attribution tracking follows strict, fraud-resilient technical rules:
1. **90-Day Persistence**: When a prospective user clicks your referral link, an encrypted HTTP cookie (\`tm_aff_ref\`) is set with a \`max-age\` of 7,776,000 seconds (90 days).
2. **Cross-Subdomain Coverage**: The cookie applies to all ecosystem domains—including the main portal, \`tunestream.com\`, and \`syncmavens.com\`.
3. **First Touch & Account Binding**: If the prospective user browses today, listens to tracks on TuneStream next week, and registers their creator account on Day 45, your referral code is permanently bound to their user account record in MongoDB.
4. **Self-Healing Referral Protection**: If an affiliate user clears their cookies after clicking, but registers through your link query parameter or enters your custom code during onboarding, the link takes immediate precedence.`
      },
      {
        heading: 'Tier Milestones & Automatic Promotion',
        content: `* **Scout Tier (Entry Level)**: Base matrix rates (3.0% - 12.0%). Assigned immediately upon registration.
* **Partner Tier (+1.0% Bonus)**: Automatically unlocked once your referred creators generate over **$2,500 in cumulative GMV** or you onboard **25 active creators**. Increases streaming commissions to 4.0%, album sales to 8.0%, and stem sales to 9.5%.
* **Ambassador Tier (+2.0% Bonus)**: Reserved for premier curators, artist managers, and major industry figures generating over **$10,000 in GMV**. Unlocks maximum rates up to 12.0% across all content streams and priority weekly payout settlement.`
      },
      {
        heading: 'Zero Platform Credits Required for Affiliate Operations',
        content: `A central architectural principle of TuneMavens is that **partner influence should never be gated by platform credit balances**:
* **Affiliate Console Access (0 Credits)**: Viewing analytics, metrics, conversion feeds, tracking matrices, and revenue charts is 100% free forever.
* **Link Generation & Attribution (0 Credits)**: Generating referral links, setting up custom tracking codes, and utilizing the 90-day cookie protocol cost zero credits.
* **Direct Creator & Label Onboarding (0 Credits)**: Pre-registering recording artists, indie record labels, and music supervisors from your Linked Network tab deducts zero credits.
* **When Do Platform Credits Apply?**: Unified Platform Credits **only** apply to affiliate accounts if an affiliate voluntarily elects to use production tools or services—such as mastering tracks in MasterLab AI, pitching songs to commercial television sync briefs on SyncMavens, registering custom domains, or purchasing POS hardware. If you are operating strictly as an affiliate or curator, you never need to purchase or maintain platform credits.`
      }
    ]
  },

  {
    id: 'onboarding-creators-and-labels',
    category: 'affiliates',
    title: 'Onboarding Creators, Labels & Partners: The Affiliate Roster Playbook',
    readingTime: '8 min read',
    excerpt: 'How affiliates act as ecosystem ambassadors to onboard recording artists, record labels, and music supervisors. Step-by-step instructions on direct user linking, invitation protocols, split incentives, and tracking roster revenue.',
    tags: ['Creator Onboarding', 'Record Labels', 'Direct Linking', 'Roster Management', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    requiredReading: false,
    assignedRoles: ['affiliate', 'label'],
    toolLink: { label: 'Manage Linked Network', path: '/affiliates' },
    sections: [
      {
        heading: 'Direct Backend Onboarding vs. Public Referral Links',
        content: `As an authorized TuneMavens Affiliate Partner, you possess two distinct superpowers to expand your network:
1. **Public Referral Links**: Ideal for sharing on social media (TikTok, Instagram, YouTube, X), podcast descriptions, and blog reviews. Prospective users self-register via \`?ref=YOURCODE\`.
2. **Direct Backend Onboarding**: Modeled after how record labels add artists to their rosters. You can directly onboard creators, indie record labels, music supervisors, and sub-affiliates from your **Linked Network & Onboarding** console.

When you onboard a user directly from your backend:
* The user's account is instantly pre-created in MongoDB and bound to your affiliate ID.
* An instant personal invitation link with an embedded security token (\`INV-TOKEN\`) is generated.
* You can send this invitation link via WhatsApp, email, or SMS, allowing the creator to claim their workspace with one click without having to enter payment details.
* Direct backend onboarding is 100% free and consumes **0 platform credits** from your affiliate balance.`
      },
      {
        heading: 'Onboarding Recording Artists & Producers (Step-by-Step)',
        content: `When pitching TuneMavens to independent music artists and producers, focus on our three primary value propositions:
* **Zero Monthly Subscriptions**: Unlike legacy distributors who charge $20-$40 every year per artist, TuneMavens operates on Unified Credits with zero recurring annual renewal fees.
* **MasterLab AI Mastering**: 24-bit lossless mastering calibrated specifically for streaming DSPs and Kenyan radio broadcast standards.
* **Automated Split Cascade**: Creators can set percentage splits with collaborators, beatmakers, and feature vocalists. Collaborators are paid directly via M-Pesa STK or Stripe with zero manual accounting overhead.

**Affiliate Onboarding Checklist for Artists:**
1. Collect their official artist name, primary genre, and contact email.
2. Enter their details in your **Linked Network** modal under the **Creator** role.
3. Share the generated invitation link.
4. Guide them through uploading their first track or porting an existing catalog CSV into the Catalogue Wizard.`
      },
      {
        heading: 'Onboarding Independent Record Labels',
        content: `Independent record labels represent your highest-earning affiliate opportunity because a single label can bring 10 to 50 active artists into your linked roster.

Key features to highlight for label executives:
* **Multi-Artist Roster Management**: Labels manage all signed artists under a single unified dashboard with seat-based permission access.
* **Publishing & Distribution Elections**: Instant worldwide DDEX distribution coupled with publishing administration that registers mechanicals with The MLC and global PROs.
* **Escrow Contract Protection**: Automated contract generation with digital signature locks for recording agreements, master licensing, and exclusive distribution deals.

When onboarding a label, select the **Record Label** role in your management console. The label's entire catalog GMV and streaming royalty flow will attribute commissions to your affiliate account.`
      },
      {
        heading: 'Monitoring Your Linked Network & Account Types',
        content: `Your **Linked Network Directory** provides real-time telemetry for every connected account:
* **Account Type & Role Badge**: Distinguishes between Creators, Labels, Music Supervisors, Corporate Brands, and Campus Sub-Affiliates.
* **Releases & Catalog Velocity**: Displays how many singles, EPs, and albums each creator has deployed.
* **Gross Attributed Revenue**: Tracks the total commerce volume generated by that specific creator's releases.
* **Net Commission Yield**: Your personal earnings derived from that user's catalog.
* **Last Active Telemetry**: Helps you identify creators who may need assistance finishing their release uploads or activating their EPK Web World.`
      }
    ]
  },

  {
    id: 'affiliate-payouts-mpesa-settlement',
    category: 'affiliates',
    title: 'Affiliate Payout Rails & M-Pesa STK Settlement Guide (Kenya & East Africa)',
    readingTime: '6 min read',
    excerpt: 'Deep-dive into affiliate commission settlement workflows. How M-Pesa instant STK pushes operate for Kenyan and East African partners, minimum payout thresholds, conversion clearance periods, and currency conversion.',
    tags: ['Payout Rails', 'M-Pesa STK', 'Kenya Settlement', 'TuneLedger', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    requiredReading: false,
    assignedRoles: ['affiliate'],
    toolLink: { label: 'View Payout Rails & Ledger', path: '/affiliates' },
    sections: [
      {
        heading: 'Supported Payout Rails Across East Africa & Globally',
        content: `TuneMavens supports multiple disbursement rails to ensure partners receive their earnings swiftly, securely, and without predatory cross-border banking fees:

* **M-Pesa STK Automated B2C Push (Kenya & East Africa)**: Direct mobile wallet disbursement to Safaricom / Airtel numbers in Kenya. Funds arrive within seconds of batch execution.
* **Stripe Direct Deposit**: Direct bank transfer for partners residing in the US, UK, EU, and supported international territories.
* **PayPal Global**: Worldwide electronic wallet settlement in USD, EUR, or GBP.
* **Unified Platform Credits (+5% Bonus)**: Partners can elect to convert their pending commission balance directly into platform credits with an added **+5% bonus**, which can be used to fund mastering, sync pitching, or creator tools.`
      },
      {
        heading: 'M-Pesa STK Settlement Protocol in Detail',
        content: `For partners in Kenya, TuneMavens integrates directly with Safaricom Daraja B2C APIs:
1. **Verification**: Enter your Kenyan mobile number in the format \`+2547XXXXXXXX\` during registration or in your Partner Console.
2. **Currency Conversion**: While platform transactions are accounted in USD on TuneLedger, M-Pesa disbursements are automatically converted to Kenya Shillings (KES) using real-time interbank foreign exchange rates updated hourly.
3. **Zero Fee Deductions**: TuneMavens absorbs the standard carrier B2C transfer charges so you receive 100% of your earned commission.`
      },
      {
        heading: 'Minimum Payout Threshold & Clearing Periods',
        content: `* **Minimum Threshold**: **$20.00 USD** (approximately KES 2,600). Once your cleared pending balance reaches $20, it is automatically marked eligible for the next scheduled settlement batch.
* **Instant Clearance vs. Fraud Hold**:
  * *Stream Pool & Credit Top-Ups*: Clear **instantly** (0-hour hold).
  * *Digital Downloads & Stems Purchases*: Clear within **48 hours**.
  * *Credit Card / Stripe Transactions*: Subject to a standard **7-day rolling hold** to guard against chargebacks or credit card disputes before final disbursement.`
      },
      {
        heading: 'Immutable Audit Logging on TuneLedger',
        content: `Every payout batch executed generates a unique **Batch ID** (e.g. \`batch_8921a4f\`) recorded permanently on the platform's audit ledger. You can inspect your historical payout statements, download tax invoices, and reconcile every transaction right from your **Attribution Ledger** tab.`
      }
    ]
  },

  {
    id: 'affiliate-compliance-promotional-ethics',
    category: 'affiliates',
    title: 'Affiliate Compliance, Disclosures & Ethical Promotional Standards',
    readingTime: '5 min read',
    excerpt: 'Standards of conduct, FTC and Kenyan CAK disclosure compliance, prohibited spam practices, brand safety guidelines, and copyright integrity for TuneMavens ambassadors.',
    tags: ['Compliance', 'Disclosures', 'Ethical Standards', 'CAK Guidelines', 'Recommended Reading'],
    popular: false,
    recommendedReading: true,
    requiredReading: false,
    assignedRoles: ['affiliate'],
    toolLink: { label: 'Affiliate Scheme Terms', path: '/affiliates' },
    sections: [
      {
        heading: 'Mandatory Regulatory Disclosures (#ad, #affiliate)',
        content: `In accordance with guidelines from the **Competition Authority of Kenya (CAK)**, the US **Federal Trade Commission (FTC)**, and international advertising standards, all affiliate partners must clearly and conspicuously disclose their financial relationship with TuneMavens.

**Standard Disclosure Guidelines:**
* When posting video walkthroughs on YouTube or TikTok, include prominent verbal or on-screen disclosure: *"This video contains affiliate links. If you sign up or purchase music through these links, I earn a commission at no additional cost to you."*
* Social media posts, tweets, and descriptions must include clear tags such as \`#ad\`, \`#affiliate\`, or \`#TuneMavensPartner\` before the fold.
* Never conceal affiliate disclosures inside buried comment sections or obscure link shorteners.`
      },
      {
        heading: 'Strictly Prohibited Promotional Practices',
        content: `To safeguard creator trust and platform reputation, the following practices result in **immediate account suspension and forfeiture of unpaid balances**:

1. **Unsolicited Spam**: Bulk emailing, automated direct-messaging (DM bots), WhatsApp group spamming, or spamming artist social media comments.
2. **Misleading Income Claims**: Never promise artists guaranteed streaming counts, algorithmic playlist placements, or false revenue claims (e.g. *"Get 1 million Spotify streams overnight with TuneMavens"*).
3. **Trademark Bidding (PPC)**: You may not bid on Google Ads, Bing Ads, or search engine pay-per-click keywords containing *"TuneMavens"*, *"TuneStream"*, *"SyncMavens"*, or confusingly similar misspellings.
4. **Cookie Stuffing**: Using hidden iframes, popup scripts, or automated redirect chains to artificially force tracking cookies without genuine user clicks.`
      },
      {
        heading: 'Brand Safety & Copyright Integrity',
        content: `TuneMavens is built on absolute respect for music copyright and fair creator remuneration:
* Never promote TuneMavens links on sites hosting pirated music, unauthorized torrents, or copyright-infringing content.
* When showcasing catalog releases, only use music for which you have verified permission or which is available through public preview players on TuneStream.
* Represent the East African and global creative community with professionalism, cultural authenticity, and integrity.`
      },
      {
        heading: 'Account Audits & Dispute Resolutions',
        content: `TuneLedger runs continuous automated heuristic scans to detect abnormal click-to-conversion anomalies. If an affiliate account is flagged for review, pending payouts are frozen for up to 14 days while compliance officers examine attribution logs. Partners in good standing have access to direct human review via the **Support & Claims Desk**.`
      }
    ]
  },

  // =========================================================================
  // CATEGORY 1: MUSIC PUBLISHING & COPYRIGHT
  // =========================================================================
  {
    id: 'master-vs-composition-copyright',
    category: 'publishing',
    title: 'The Two Halves of Music Copyright: Master Rights vs. Composition Rights',
    readingTime: '5 min read',
    excerpt: 'Every recorded song possesses two distinct copyrights: the Sound Recording (Master) and the Musical Work (Composition). Learn how each generates revenue and why owning both gives you a massive advantage.',
    tags: ['Copyright', 'Master Rights', 'Publishing', 'One-Stop', 'Royalties', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    assignedRoles: ['creator', 'songwriter'],
    toolLink: { label: 'Explore TuneMavens Publishing', path: '/for/songwriters' },
    sections: [
      {
        heading: 'The Fundamental Duality of Music Law',
        content: `Under global copyright law (anchored by the Berne Convention and US Copyright Act of 1976), whenever a piece of music is created and recorded, two entirely distinct legal properties come into existence at that precise second:

1. **The Musical Work (Composition & Lyrics)**: The underlying music, melody, harmony, chords, and written lyrics. This copyright is originally owned by the **Songwriters and Composers**, and is traditionally administered or owned by **Music Publishers**.
2. **The Sound Recording (The Master)**: The specific audio fixation and master recording of a performance of that underlying composition. This copyright is originally owned by the **Recording Artists and Producers**, and is traditionally owned or licensed by **Record Labels** or indie creators.

Understanding this division is the single most important concept in music business, because **every royalty stream, sync deal, and streaming payout splits according to these two distinct halves**.`
      },
      {
        heading: 'How Royalties Flow for Each Copyright',
        content: `When your track is streamed on Spotify, played on Apple Music, or performed on the radio, two separate royalty streams are generated:

| Royalty Category | Copyright Half | Collected & Paid By | Recipients |
| :--- | :--- | :--- | :--- |
| **Master Streaming Royalty** | Sound Recording (Master) | Digital Distributors (TuneMavens, DistroKid, Labels) | Master Rights Holder (Artist/Label) |
| **Mechanical Royalty** | Composition (Musical Work) | The MLC, MCPS, AMRA, Mechanical Societies | Songwriters & Music Publishers |
| **Performance Royalty** | Composition (Musical Work) | PROs (ASCAP, BMI, SESAC, PRS, SAMRO, MCSK) | 50% Songwriter / 50% Publisher |
| **Neighboring Rights** | Sound Recording (Master) | SoundExchange, PPL, GVL | Performing Artists & Master Owners |
| **Synchronization Fee** | Both Master & Composition | Paid directly by Production Studio / Ad Agency | 50% Master Owner / 50% Publisher |`
      },
      {
        heading: 'The "One-Stop" Licensing Advantage',
        content: `In the television, film, advertising, and video game sync industries, music supervisors work under frantic deadlines. If they wish to place a song, they must clear **both** the Master Rights and the Publishing Rights.

If a song has 4 songwriters signed to 3 different publishing houses and 2 different labels, clearing the song can take weeks or months. 

When you own or control **100% of both the master and composition rights** (or represent all collaborators through a single entity like TuneMavens Sync), your catalog is considered **"One-Stop"**. Music supervisors prioritize One-Stop music because they can execute a single contract and license the track in hours.`
      },
      {
        heading: 'Key Takeaways for Creators',
        content: `* Never confuse your digital distributor with your music publisher. Distributors collect master streaming income; they do **not** collect global mechanical or performance royalties.
* Always track both your **ISRC** (for the master recording) and your **ISWC** (for the underlying composition).
* With TuneMavens Publishing, you can administer your catalog to ensure mechanicals and performance revenues are captured globally without giving away your master ownership.`
      }
    ]
  },

  {
    id: 'mechanical-royalties-and-mlc',
    category: 'publishing',
    title: 'Demystifying Mechanical Royalties: Digital Streaming, Physical & The MLC',
    readingTime: '6 min read',
    excerpt: 'What are mechanical royalties, who pays them, and how are they calculated on streaming platforms? A deep dive into The MLC, international mechanical collection, and statutory rates.',
    tags: ['Mechanicals', 'The MLC', 'Streaming Royalties', 'Publishing Administration'],
    popular: true,
    toolLink: { label: 'Publishing Election Console', path: '/publishing' },
    sections: [
      {
        heading: 'What is a Mechanical Royalty?',
        content: `A mechanical royalty is a royalty paid to songwriters and publishers whenever a musical composition is **reproduced and distributed** in physical or digital formats. 

Historically, this term originated with mechanical player piano rolls and vinyl pressings. Today, it applies to:
* **Interactive Streaming**: Spotify, Apple Music, Tidal, Amazon Music, Deezer.
* **Digital Downloads**: iTunes, Bandcamp, Amazon MP3.
* **Physical Sales**: Vinyl, CD, cassette tapes.

Every time a user presses play on an on-demand streaming service, a mechanical reproduction occurs in that platform's server buffer and local client device cache, legally triggering a mechanical royalty obligation.`
      },
      {
        heading: 'The Mechanical Licensing Collective (The MLC)',
        content: `Established under the US **Music Modernization Act (MMA)** of 2018, **The MLC** is the designated non-profit collective that administers blanket mechanical licenses to digital streaming services (DSPs) in the United States.

Before The MLC, digital streaming services had to seek mechanical licenses from individual publishers or notice-of-intent (NOI) filings with the US Copyright Office. Because millions of songs had incomplete metadata, hundreds of millions of dollars were trapped in **"black box" pools**.

Today, DSPs pay blanket mechanical royalties to The MLC every month. The MLC matches stream logs with song registrations and distributes the mechanical royalties directly to registered self-published songwriters and publishing administrators.`
      },
      {
        heading: 'Statutory Rates & Streaming Mechanical Calculation',
        content: `* **Physical & Digital Downloads**: Set by the US Copyright Royalty Board (CRB). As of 2024–2026, the statutory rate for physical copies and permanent digital downloads is **12.4 cents per track** (or 2.39 cents per minute of playing time, whichever is greater).
* **Interactive Streaming**: Governed by the CRB "Phonorecords IV" rate determinations. DSPs allocate approximately **15.1% to 15.35% of their service revenue** to the combined pool for public performance and mechanical publishing rights. After deducting PRO performance royalties, the remainder is paid out as mechanicals.

> **Crucial Warning:** Your distributor (e.g. DistroKid, CD Baby, TuneCore standard tiers) does **not** collect mechanical royalties from interactive streaming in the United States and abroad. Unless you are registered with The MLC or represented by an administrator like TuneMavens Publishing, those royalties remain uncollected.`
      },
      {
        heading: 'International Mechanical Collection (AMRA, MCPS, SACEM)',
        content: `Outside the United States, mechanical collection is administered by national mechanical rights organizations:
* **UK**: MCPS (Mechanical-Copyright Protection Society)
* **France**: SACEM / SDRM
* **Germany**: GEMA
* **Global Digital Hubs**: AMRA (international digital licensing hub)

TuneMavens Publishing connects directly with global mechanical hubs, ensuring that whether your track is streamed in London, Paris, Tokyo, or Nairobi, all mechanical micro-cents flow back into your TuneLedger balance.`
      }
    ]
  },

  {
    id: 'pros-cmos-ascap-bmi-sesac-prs',
    category: 'publishing',
    title: 'PROs & CMOs Explained: ASCAP, BMI, SESAC, PRS, SAMRO & MCSK',
    readingTime: '6 min read',
    excerpt: 'How Performing Rights Organizations track public performance, split the 50/50 Writer and Publisher share, and how to register your live concert setlists for touring royalties.',
    tags: ['PROs', 'ASCAP', 'BMI', 'PRS', 'SAMRO', 'Public Performance'],
    popular: true,
    toolLink: { label: 'Publishing Admin Setup', path: '/publishing' },
    sections: [
      {
        heading: 'What is a Performing Rights Organization (PRO)?',
        content: `A **Performing Rights Organization (PRO)** (often referred to globally as a **Collective Management Organization, or CMO**) licenses the public performance of musical works on behalf of songwriters, composers, and music publishers.

A "public performance" occurs whenever music is:
* Broadcast on television or AM/FM terrestrial radio.
* Streamed over digital platforms (Spotify, Apple Music, YouTube).
* Played in public commercial venues (restaurants, clubs, retail stores, gyms).
* Performed live at concerts, festivals, or music halls.`
      },
      {
        heading: 'The 50/50 Statutory Split Rule',
        content: `All PROs divide performance royalties into two equal parts:

1. **The Writer\'s Share (50%)**: This portion is **always paid directly to the individual songwriter/composer**. By legal covenant, a publishing administrator or record label cannot take or intercept the Writer\'s Share directly from the PRO.
2. **The Publisher\'s Share (50%)**: This portion is paid to the registered music publisher or publishing administrator.

If you are an independent creator who has not registered a publishing entity or appointed a publishing administrator, the 50% Publisher\'s Share is frequently left sitting in escrow at your PRO, or worse, reallocated to foreign collection societies after the claims window expires.`
      },
      {
        heading: 'Major PROs & Global CMOs Comparison',
        content: `| PRO / CMO | Territory | Membership Type | Notes |
| :--- | :--- | :--- | :--- |
| **ASCAP** | United States | Non-Profit Board of Songwriters & Publishers | Open to all creators; standard global reciprocal treaties |
| **BMI** | United States | Private Entity | Open to all creators; extensive live concert setlist program |
| **SESAC** | United States | For-Profit / Invitation Only | Curated roster; fast quarterly digital tracking |
| **PRS for Music** | United Kingdom | Non-Profit CMO | Administers both PRS (performance) and MCPS (mechanical) |
| **SAMRO** | South Africa & Southern Africa | CMO | Leading rights administrator across Southern Africa |
| **MCSK** | Kenya | CMO | Music Copyright Society of Kenya |
| **COSON / MCSN** | Nigeria | CMO | Broadcast and live performance tracking across West Africa |`
      },
      {
        heading: 'Collecting Live Performance Royalties on Tour',
        content: `Did you know that playing your own songs at a live venue entitles you to public performance royalties? 

Venues pay annual blanket licensing fees to PROs. Through programs like **ASCAP OnStage** or **BMI Live**, you can submit your concert dates, venue names, and setlists. Your PRO will calculate your performance royalty based on the venue's licensing tier and capacity, paying you for your own live performances on stage!`
      }
    ]
  },

  {
    id: 'music-metadata-isrc-iswc-ipi-upc',
    category: 'publishing',
    title: 'Essential Industry Identifiers: ISRC, ISWC, UPC, and IPI/CAE Numbers',
    readingTime: '5 min read',
    excerpt: 'The missing link behind billions in lost royalties. How to manage your master and composition identifiers properly so your revenue never drops into the black box.',
    tags: ['Metadata', 'ISRC', 'ISWC', 'IPI', 'UPC', 'Black Box'],
    popular: false,
    toolLink: { label: 'Audit Catalog Identifiers', path: '/dashboard?tab=catalog' },
    sections: [
      {
        heading: 'Why Metadata Governs Your Money',
        content: `In the modern streaming era, over 120,000 new tracks are uploaded to DSPs every day. Algorithms and automated royalty accounting engines rely entirely on standardized digital identifier codes to match who is owed what.

When an artist uploads a track with spelling discrepancies, missing songwriter credits, or omitted identifier codes, payment systems fail to pair the master stream with the underlying composition. The revenue then sits in an unclaimed holding account known in the industry as the **"Black Box"**.`
      },
      {
        heading: 'The 4 Essential Music Identifiers',
        content: `### 1. ISRC (International Standard Recording Code)
* **What it identifies:** A specific Sound Recording (the Master audio).
* **Format:** 12 alphanumeric characters, e.g., \`US-TM1-26-00104\`.
* **Issued by:** Your distributor, label, or national ISRC agency.
* **Rule:** If you remix, remaster, or re-record a track, the new version requires a brand-new ISRC.

### 2. ISWC (International Standard Musical Work Code)
* **What it identifies:** The underlying Musical Work (Composition & Lyrics).
* **Format:** 11 alphanumeric characters, e.g., \`T-123456789-C\`.
* **Issued by:** CISAC via your PRO (ASCAP, BMI, PRS).
* **Rule:** An ISWC stays the same regardless of how many artists record covers or remasters of that song.

### 3. IPI / CAE (Interested Party Information)
* **What it identifies:** You as a unique Songwriter, Composer, or Publisher.
* **Format:** 9 to 11-digit number assigned by your PRO (e.g., \`00789456123\`).
* **Rule:** Never confuse your IPI number with your PRO account login number. Your IPI is the global unique code that links your name to split sheets and publishing registrations.

### 4. UPC / EAN (Universal Product Code)
* **What it identifies:** The commercial release package (Single, EP, or Album).
* **Format:** 12 or 13-digit barcode.`
      },
      {
        heading: 'TuneMavens Metadata Checkpoint',
        content: `Inside TuneMavens Catalog Manager, every track is verified against automated checksums to ensure that the ISRC, ISWC, and Songwriter IPIs match across the global CISAC and SoundExchange databases before distribution or sync pitching.`
      }
    ]
  },

  {
    id: 'publishing-deals-admin-vs-copub-vs-buyout',
    category: 'publishing',
    title: 'Publishing Deals: Administrator Mode vs. Co-Publishing vs. Buyouts',
    readingTime: '7 min read',
    excerpt: 'Compare the 3 primary publishing models: from 10% administration fees where you keep 100% of your copyright, to traditional 50/50 co-publishing and full work-for-hire buyouts.',
    tags: ['Publishing Deals', 'Co-Publishing', 'Admin Deals', 'Contracts'],
    popular: true,
    toolLink: { label: 'Review Publishing Options', path: '/publishing' },
    sections: [
      {
        heading: 'Understanding Publishing Contract Archetypes',
        content: `When a songwriter signs a publishing agreement, they are negotiating who collects their royalties, who shops their songs for sync and cover opportunities, and who retains legal ownership of the underlying copyrights.`
      },
      {
        heading: '1. Publishing Administration Agreement',
        content: `* **Ownership:** You retain **100% copyright ownership** of your musical works.
* **Commission Fee:** The administrator takes **10% to 15%** of gross royalties collected as an administrative fee.
* **Advance:** Typically modest or none, as the administrator does not purchase copyright equity.
* **Term:** Usually 1 to 3 years with standard collection run-off periods.
* **Best For:** Self-sufficient independent artists, producers with existing momentum, and creators who want complete autonomy.`
      },
      {
        heading: '2. Co-Publishing Agreement',
        content: `* **Ownership:** You assign **50% of your Publisher\'s Share** to the publishing house. You retain 100% of your Writer\'s Share and 50% of the Publisher\'s Share (effectively keeping 75% of total income).
* **Advance:** Substantial upfront advance against future publishing royalties.
* **A&R Services:** The publisher actively pitches your songs to major artists, sync agents, and producers.
* **Term:** Usually tied to an album delivery requirement (e.g. 10–12 wholly written qualifying songs) plus option periods.`
      },
      {
        heading: '3. Full Buyout / Work-for-Hire',
        content: `* **Ownership:** The commissioner or buyer owns **100% of the copyright in perpetuity**.
* **Payment:** One-time lump sum flat fee.
* **Warning:** In a pure work-for-hire, you surrender all backend mechanicals, sync fees, and performance royalties forever. This should only be accepted if the upfront fee adequately compensates for lifetime lost royalties.`
      },
      {
        heading: 'TuneMavens Flexible Election Model',
        content: `On TuneMavens, songwriters have total flexibility:
* **Option A: Administrator Mode (10% Fee)**: TuneMavens manages global registrations and collects your mechanical and foreign royalties for a flat 10% fee. You keep 90% of all gross revenues and 100% of your copyright.
* **Option B: Publishing House Mode (50/50 Split)**: TuneMavens acts as active publishing partner, dedicating sync pitch reps, catalog pitching, and advance financing.`
      }
    ]
  },

  // =========================================================================
  // CATEGORY 2: MUSIC BUSINESS & CONTRACTS
  // =========================================================================
  {
    id: 'studio-split-sheets-guide',
    category: 'business',
    title: 'Producer & Songwriter Split Sheets: Rules, Best Practices & Traps',
    readingTime: '5 min read',
    excerpt: 'Why split sheets must be executed before leaving the studio. How to calculate songwriter vs. producer shares, avoid sample clearance nightmares, and handle disputes.',
    tags: ['Split Sheets', 'Producers', 'Songwriters', 'Contracts', 'Legal'],
    popular: true,
    toolLink: { label: 'Open TuneLedger Splits', path: '/dashboard?tab=splits' },
    sections: [
      {
        heading: 'What is a Split Sheet and When is it Signed?',
        content: `A **Split Sheet** is a written agreement between all contributors to a song that defines who wrote what percentage of the underlying composition (lyrics and music).

> **Golden Rule of the Studio:** Always agree on and sign your split sheet **before everyone leaves the room**. Once a song is recorded, uploaded, or goes viral, memories fade, egos inflate, and disagreements multiply tenfold.`
      },
      {
        heading: 'Standard Split Formulas in Modern Music',
        content: `In hip-hop, R&B, pop, and electronic genres, songs are often collaborative efforts between beatmakers, topliners, and vocalists:

* **Equal Division ("Split Everything Equally")**: If 3 people are in the room writing and producing together, each receives 33.33%. This promotes collaborative harmony and is favored by many top songwriting camps.
* **Track vs. Topline Split (50/50)**:
  * 50% allocated to the Music/Beat Producer(s)
  * 50% allocated to the Lyricists/Melody Topliners
* **Producer Master Royalty (Points)**: Distinct from publishing, producers also typically negotiate **3 to 5 producer points (percent)** on the Master recording revenue, payable after recoupment of recording costs.`
      },
      {
        heading: 'Sample Clearance Clauses & Indemnities',
        content: `Every standard split sheet must include an **Indemnification & Warranty Clause**. 

This states that each contributor warrants their contribution consists of original material and does not infringe on third-party copyrights. If a collaborator uses an uncleared loop, YouTube rip, or sample pack requiring commercial clearance without disclosing it, they are legally liable for damages and clearance fees.`
      },
      {
        heading: 'TuneLedger Automated Split Sheets',
        content: `With TuneMavens\' **TuneLedger / Split Cascade**, you can send digital split sheets directly to collaborators\' email or phone. Collaborators confirm with a single click, and all splits lock into the automated payout engine.`
      }
    ]
  },

  {
    id: 'record-deal-advances-and-recoupment',
    category: 'business',
    title: 'The Real Math of Record Deals: Advances, Recoupment & Royalty Deductions',
    readingTime: '7 min read',
    excerpt: 'An advance is an uncollateralized loan against your future royalties. Understand how recoupment formulas, cross-collateralization, and packaging deductions work.',
    tags: ['Record Deals', 'Advances', 'Recoupment', 'Label Math', 'Indie vs Major'],
    popular: true,
    toolLink: { label: 'Calculate Your Royalties', path: '/dashboard?tab=splits' },
    sections: [
      {
        heading: 'The Anatomy of a Record Label Advance',
        content: `A record label advance is **not free money or a bonus**. An advance is a pre-payment of your future royalties.

If a label signs you and gives you a **$100,000 advance**, you will not receive a single cent of master streaming royalties until that entire $100,000 has been repaid ("recouped") from your contractual royalty share.`
      },
      {
        heading: 'How Recoupment Actually Works (The 18% Trap)',
        content: `Consider a traditional major label contract where an artist receives an **18% royalty rate** on master recordings:

* Say your track generates **$100,000 in gross master revenue** on Spotify and Apple Music.
* The label receives the full $100,000.
* Your 18% contractual share is **$18,000**. The label\'s 82% share is **$82,000**.
* That $18,000 is applied toward your unrecouped advance.
* Therefore, to recoup a **$100,000 advance**, your music must generate more than **$555,000 in gross streaming revenue**!

Meanwhile, the record label has already retained **$455,000 in profit** while you remain technically "in the red".`
      },
      {
        heading: 'What Else is Recoupable?',
        content: `Standard record contracts don\'t just recoup the cash advance given to the artist. They also recoup:
* **Recording Costs:** Studio time, mix engineers, mastering engineers, session musicians (100% recoupable).
* **Music Videos:** Typically 50% to 100% recoupable against artist royalties.
* **Independent Radio Promotion & PR:** 50% to 100% recoupable.
* **Tour Support Advances:** 100% recoupable.`
      },
      {
        heading: 'Cross-Collateralization Explained',
        content: `**Cross-collateralization** is a contractual provision where the label links debt across multiple albums or projects. 

If Album 1 fails and is $50,000 in the red, and Album 2 becomes a breakout hit generating $80,000 in artist royalties, the label applies your earnings from Album 2 to pay off the unrecouped debt of Album 1 before you receive a payout.

**The Independent Alternative on TuneMavens:** By utilizing TuneMavens distribution and self-publishing, artists retain **85% to 100% of master and publishing revenues**, paying out collaborators transparently via Split Cascade with zero cross-collateralization.`
      }
    ]
  },

  {
    id: 'sync-licensing-masterclass',
    category: 'business',
    title: 'Sync Licensing Masterclass: Securing Placements in Film, TV, Games & Ads',
    readingTime: '6 min read',
    excerpt: 'How music supervisors pick music, the two licenses needed for every placement, deliverable stems, and how to format metadata for high-paying sync opportunities.',
    tags: ['Sync Licensing', 'Music Supervisors', 'Cue Sheets', 'Film & TV', 'Stems', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    assignedRoles: ['supervisor', 'studio'],
    toolLink: { label: 'Explore SyncMavens', path: '/sync-placement' },
    sections: [
      {
        heading: 'What is a Synchronization License?',
        content: `A **Synchronization ("Sync") License** grants permission to synchronize a copyrighted piece of music with visual media: a motion picture, television show, commercial advertisement, video game, or streaming series.

Every sync placement requires two permissions:
1. **The Sync License:** Granted by the Publisher/Songwriters for the composition.
2. **The Master Use License:** Granted by the Record Label/Artist for the master sound recording.`
      },
      {
        heading: 'The Two Revenue Streams of Sync',
        content: `A successful sync placement pays you twice:

1. **Upfront Sync Fee:** A one-time fee paid by the production company or brand to license the track for a specific term, media, and territory (e.g. $5,000 for an indie film, $25,000 for a cable TV episode, or $150,000+ for a national automobile commercial).
2. **Backend Performance Royalties:** Whenever the film or TV show is broadcast on television or streamed globally (Netflix, Hulu, HBO, terrestrial TV), the broadcaster files a **Cue Sheet** with the PROs, generating ongoing performance royalties.`
      },
      {
        heading: 'What Music Supervisors Require in Deliverables',
        content: `When a supervisor licenses your track, they need professional deliverables delivered within hours:

* **High-Res WAV:** 24-bit, 48kHz (broadcast standard) or 96kHz.
* **Instrumental Mix:** Exactly matches the master mix with lead vocals muted (essential for dialogue scenes).
* **TV Clean Mix:** With any explicit profanity or brand references muted.
* **Stems:** Isolated stereo submixes: Drums Stem, Bass Stem, Guitars/Synths Stem, Background Vocals Stem, Lead Vocal Stem.`
      },
      {
        heading: 'How SyncMavens Accelerates Placements',
        content: `SyncMavens connects pre-cleared, one-stop independent catalogs directly with vetted music supervisors in Hollywood, London, Berlin, and Lagos, allowing supervisors to audition, license, and generate cue sheets instantly.`
      }
    ]
  },

  {
    id: 'live-touring-guarantees-riders-settlements',
    category: 'business',
    title: 'Live Touring & Booking: Guarantees, Door Splits, Riders & Settlements',
    readingTime: '6 min read',
    excerpt: 'Navigate live concert contracts: Flat Guarantees vs. Door Percentages, Technical and Hospitality Riders, venue merch cuts, and night-of settlements.',
    tags: ['Touring', 'Booking', 'Riders', 'Guarantees', 'Live Concerts'],
    popular: false,
    toolLink: { label: 'Manage Tours & Gigs', path: '/tours' },
    sections: [
      {
        heading: 'Live Performance Contract Deal Types',
        content: `When booking a club, theatre, or festival show, live contracts typically follow one of three deal structures:

1. **Flat Guarantee:** The promoter pays a fixed, guaranteed sum regardless of ticket sales (e.g. $2,500). Ideal for minimizing risk in new markets.
2. **Door Deal (Percentage Split):** The artist receives a percentage of net ticket sales (e.g. 70% of door receipts after documented venue expenses).
3. **Versus Deal ("Guarantee Versus Percentage"):** The artist receives whichever is greater: the agreed guarantee (e.g. $3,000) OR a percentage of net door receipts (e.g. 80% after break-even). This is the gold standard for established touring acts.`
      },
      {
        heading: 'The Two Parts of an Artist Rider',
        content: `The **Rider** is an attachment to the performance contract that outlines your technical and personal requirements:

* **Technical Rider:** Detailed stage plot, input list (microphones, DIs, channels), monitor mix requirements, backline equipment (drum kit specs, amp heads), and lighting preferences.
* **Hospitality Rider:** Dressing room catering, dietary restrictions, bottled water, towels, security escort protocols, and guest list allocations.`
      },
      {
        heading: 'Beware of the Venue Merch Cut',
        content: `Many mid-sized and large concert venues charge artists a **Merchandise Concession Fee** (often 15% to 20% on apparel and 10% on recorded media). 

Always attempt to negotiate **"0% merch fee"** in your booking contract, particularly in clubs under 1,000 capacity where the artist provides their own merchandise seller.`
      },
      {
        heading: 'Night-of Settlement Protocols',
        content: `At the conclusion of the concert, the tour manager or artist meets with the venue promoter for the **Settlement**. 

They review:
* Verified ticket gross (box office audit).
* Itemized and capped production expenses.
* Final cash/wire balance payout.
Using **TuneBookings**, artists can store digital contracts, track deposit escrows, and log settlement audits directly from their mobile device.`
      }
    ]
  },

  {
    id: 'legal-foundations-llc-trademark-tax-w8ben',
    category: 'business',
    title: 'Legal Entity Setup, Trademarks & International Tax Withholding',
    readingTime: '5 min read',
    excerpt: 'Protect your assets: forming an LLC for bands and producer collectives, trademarking your stage name, and filing Form W-8BEN to prevent 30% IRS tax withholdings.',
    tags: ['Legal', 'LLC', 'Trademarks', 'Tax', 'W-8BEN', 'International'],
    popular: false,
    toolLink: { label: 'Account Tax Profile', path: '/dashboard?tab=account' },
    sections: [
      {
        heading: 'Why Every Serious Music Creator Needs an LLC',
        content: `Operating as an individual ("Sole Proprietorship") exposes your personal assets (home, car, personal bank accounts) to liability in the event of copyright infringement lawsuits, venue accidents, or contractual disputes.

Forming a **Limited Liability Company (LLC)**:
* Creates a legal shield separating your personal assets from business liabilities.
* Allows you to deduct legitimate music business expenses (equipment, studio rentals, travel, software, marketing).
* Serves as the contracting party for split sheets, publishing contracts, and distribution agreements.`
      },
      {
        heading: 'Protecting Your Stage Name with Trademarks',
        content: `Owning a domain name or having an Instagram handle **does not give you legal trademark rights** to your artist name. 

To legally safeguard your artist brand from copycats or cease-and-desist orders:
* Register your trademark with your national intellectual property office (such as the USPTO in the US).
* Key trademark classes for musicians:
  * **Class 9:** Musical sound recordings, downloadable music files, podcasts.
  * **Class 25:** Clothing, hats, merchandise.
  * **Class 41:** Live musical performances and entertainment services.`
      },
      {
        heading: 'Form W-8BEN: Slashing the 30% US IRS Withholding Tax',
        content: `If you reside outside the United States and earn streaming or sync royalties originating from US listeners or companies, US tax law requires a default **30% statutory withholding tax** on your earnings.

By completing **IRS Form W-8BEN** (Certificate of Foreign Status of Beneficial Owner) through your TuneMavens account:
* You claim the benefits of the bilateral tax treaty between your country of residence and the United States.
* For most treaty countries (e.g. UK, South Africa, Canada, Germany, Kenya), the withholding rate drops from **30% down to 0% to 10%**, immediately saving you thousands of dollars annually.`
      }
    ]
  },

  // =========================================================================
  // CATEGORY 3: TUNEMAVENS SERVICE OFFERING
  // =========================================================================
  {
    id: 'tunestream-audiophile-streaming',
    category: 'services',
    title: 'TuneStream: Audiophile Lossless Streaming & Direct Artist Monetization',
    readingTime: '4 min read',
    excerpt: 'Experience high-fidelity 24-bit FLAC audio streaming with direct listener tipping, custom radio channels, and fair creator compensation.',
    tags: ['TuneStream', 'Lossless Audio', 'FLAC', 'Streaming', 'Tipping', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    assignedRoles: ['dj', 'curator'],
    toolLink: { label: 'Launch TuneStream', path: '/tunestream' },
    sections: [
      {
        heading: 'High-Fidelity Lossless Audio Architecture',
        content: `Traditional streaming platforms compress audio using lossy codecs (like 128kbps to 320kbps MP3 or AAC), stripping away delicate acoustic nuances, spatial depth, and high-frequency sparkle.

**TuneStream** streams pristine **24-bit / 48kHz and 96kHz Lossless FLAC**, delivering master-studio fidelity directly to audiophiles, tastemakers, and creators without digital degradation.`
      },
      {
        heading: 'Direct-to-Artist Monetization Model',
        content: `TuneStream shifts away from the fragmented "pro-rata stream pool" where artist payouts can fall to fractions of a penny.

* **User-Centric Tipping:** Listeners can tip artists directly using TuneMavens Credits or card.
* **Creator Subscriptions:** Superfans can subscribe directly to their favorite artists\' private channels, unreleased demos, and VIP broadcasts.
* **Higher Payout Floor:** Verified lossless streams carry a significantly higher baseline royalty share disbursed automatically through TuneLedger.`
      },
      {
        heading: 'Thematic Stations & Algorithmic Discovery',
        content: `TuneStream features curated editorial radio stations (Afrobeats Global, Deep Electronic, Acoustic Intimate, Neo-Soul Sessions) and dynamic personalized discovery stations that showcase emerging independent artists alongside established acts.`
      }
    ]
  },

  {
    id: 'syncmavens-licensing-platform',
    category: 'services',
    title: 'SyncMavens: Sync Placement Briefs & Licensing Marketplace',
    readingTime: '5 min read',
    excerpt: 'Connect your songs with vetted music supervisors for Netflix, HBO, Apple TV, gaming studios, and global brand advertisements.',
    tags: ['SyncMavens', 'Briefs', 'Licensing', 'Music Supervisors', 'Placements'],
    popular: true,
    toolLink: { label: 'View Sync Opportunities', path: '/sync-placement' },
    sections: [
      {
        heading: 'How the SyncMavens Marketplace Works',
        content: `SyncMavens bridges the gap between independent musicians and accredited media executives looking for broadcast-ready tracks:

1. **Active Brief Board:** Music supervisors post specific briefs outlining required mood, genre, tempo, budget, and scene context (e.g. *"Upbeat funk-pop track with swagger for coming-of-age comedy trailer, budget $15,000, 100% one-stop only"*).
2. **Targeted Pitching:** Creators can submit matching tracks from their catalog with one click.
3. **Automated Contracts & Clearances:** Both Master and Sync licenses are generated and digitally signed within the platform.`
      },
      {
        heading: 'Vetting & Pre-Cleared Status',
        content: `Tracks designated as **"Pre-Cleared One-Stop"** in SyncMavens receive priority placement in supervisor search results, leading to an average 4x higher licensing rate.`
      }
    ]
  },

  {
    id: 'tuneledger-and-split-cascade',
    category: 'services',
    title: 'TuneLedger & Split Cascade: Automated Multi-Currency Royalty Payouts',
    readingTime: '5 min read',
    excerpt: 'Ingest raw royalty CSV statements from any distributor or DSP, apply automatic split sheets, deduct recoupable costs, and disburse instant payouts.',
    tags: ['TuneLedger', 'Split Cascade', 'Royalties', 'Stripe', 'M-Pesa', 'Accounting', 'Recommended Reading'],
    popular: true,
    recommendedReading: true,
    assignedRoles: ['label', 'manager'],
    toolLink: { label: 'Open TuneLedger', path: '/dashboard?tab=splits' },
    sections: [
      {
        heading: 'The Challenge of Royalty Accounting',
        content: `Managing royalty disbursements manually is one of the most tedious headaches in music business: downloading complex CSV files with hundreds of thousands of micro-transactions, calculating percentages, deducting recording debts, and manually wiring money to 5 different collaborators every quarter.`
      },
      {
        heading: 'The Split Cascade Engine',
        content: `**Split Cascade** automates the entire distribution lifecycle:

1. **Statement Ingestion:** Drag and drop your royalty CSV statements from DistroKid, TuneCore, Spotify for Artists, Apple Music, or custom label spreadsheets.
2. **Rule Execution:** The engine matches ISRCs and applies your contractual split rules.
3. **Recoupment Deductions:** If a producer or artist has an outstanding recording advance, the engine deducts revenue up to the recoupment threshold before distributing profits.
4. **Instant Disbursements:** Net payouts disburse automatically to each collaborator\'s linked **Stripe account** or **M-Pesa mobile wallet** with full audit receipts.`
      }
    ]
  },

  {
    id: 'epk-studio-and-custom-domains',
    category: 'services',
    title: 'EPK Studio & Custom Domain Hosting (TuneCreators)',
    readingTime: '4 min read',
    excerpt: 'Design an Electronic Press Kit with embedded lossless audio, bio, high-res press photos, tour itinerary, and link your own custom domain with free SSL.',
    tags: ['EPK', 'Electronic Press Kit', 'Custom Domains', 'TuneCreators', 'PR'],
    popular: false,
    toolLink: { label: 'Build Your EPK', path: '/dashboard?tab=epk' },
    sections: [
      {
        heading: 'What Every Press & Booking Agent Expects',
        content: `When pitching to festivals, promoters, label A&Rs, and music journalists, sending raw MP3 attachments or messy Google Drive links hurts your professionalism.

An **Electronic Press Kit (EPK)** provides a cohesive, interactive media kit showcasing:
* High-resolution downloadable press photos (print & web ready).
* Concise artist biography and career achievements.
* Embedded audio player with lead singles and unreleased demos.
* Embedded music videos and live performance footage.
* Technical & Hospitality Rider downloads.
* Press quotes and media accolades.`
      },
      {
        heading: 'Custom Domain Mapping with Zero-Config SSL',
        content: `With TuneMavens Hosting Manager, you can connect your own domain (e.g., \`artistname.com\`) directly to your EPK or fan portal. 

Simply add the provided CNAME record in your domain registrar (GoDaddy, Namecheap, Cloudflare), and TuneMavens automatically provisions and renews your **SSL security certificate** at zero extra cost.`
      }
    ]
  },

  {
    id: 'masterlab-ai-mastering',
    category: 'services',
    title: 'MasterLab AI: Intelligent Mastering & Streaming Loudness Targets',
    readingTime: '5 min read',
    excerpt: 'Achieve commercial-grade studio masters tailored to -14 LUFS Spotify and -16 LUFS Apple Music standards with true peak ceiling protection.',
    tags: ['MasterLab', 'AI Mastering', 'LUFS', 'Loudness', 'Audio Engineering'],
    popular: false,
    toolLink: { label: 'Open MasterLab', path: '/dashboard?tab=mastering' },
    sections: [
      {
        heading: 'Why Mastering Matters for Modern Release',
        content: `Mastering is the crucial final stage in audio production. It ensures your mix translates consistently across smartphones, AirPods, studio monitors, car stereos, and massive club sound systems.`
      },
      {
        heading: 'Understanding Streaming Loudness Standards (LUFS)',
        content: `Streaming services utilize automatic loudness normalization to ensure listeners don\'t experience jarring volume shifts between tracks.

* **Spotify & YouTube:** Standard normalization target is **-14 LUFS integrated**.
* **Apple Music & TIDAL:** Standard target is **-16 LUFS integrated**.
* **Club / DJ Masters:** Typically mastered louder at **-8 to -10 LUFS integrated**.

If you upload a track mastered too loudly (e.g. -6 LUFS), the streaming platform will automatically turn your track down digitally, flattening your punch and transient dynamics without making it louder.

**MasterLab AI** automatically optimizes your audio to the exact target standard, keeping your True Peak ceiling at **-1.0 dBFS** to prevent lossy encoding distortion.`
      }
    ]
  },

  {
    id: 'corporate-ads-and-brand-flights',
    category: 'services',
    title: 'Corporate Ads & Brand Flight Sponsorships',
    readingTime: '5 min read',
    excerpt: 'Learn how corporate advertisers sponsor curated playlists, podcasts, and audio prerolls across the TuneMavens ecosystem at established rate tiers.',
    tags: ['Corporate Ads', 'Brand Sponsorships', 'Ad Rates', 'CPM', 'Flights', 'Recommended Reading'],
    popular: false,
    recommendedReading: true,
    assignedRoles: ['corporate', 'media', 'media_house'],
    toolLink: { label: 'Review Ad Rates', path: '/for/corporate#business-ad-rates' },
    sections: [
      {
        heading: 'The TuneMavens Advertising & Flight Network',
        content: `TuneMavens connects forward-thinking consumer brands and corporate enterprises with an engaged demographic of music enthusiasts, creators, and entertainment professionals through high-impact, non-intrusive brand placements.`
      },
      {
        heading: 'Established Business Ad Rate Tiers',
        content: `Corporate flights are booked across 4 established rate packages:

| Flight Tier | Budget | Verified Listens | Effective CPM | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Pulse** | $499 | 25,000 | $19.96 | Audio prerolls, companion banner, standard geo-targeting |
| **Amplified** | $1,499 | 100,000 | $14.99 | Midroll audio, playlist takeover, frequency capping (Most Popular) |
| **Culture Lead** | $3,999 | 350,000 | $11.43 | High share of voice, branded curated station, newsletter spotlight |
| **Titan** | $9,999 | 1,000,000 | $10.00 | Complete ecosystem roadblock, category exclusivity, direct API telemetry |`
      },
      {
        heading: 'Real-Time Flight Telemetry',
        content: `Advertisers access a dedicated Corporate Ads console in the backend to monitor live impressions, listen completions, click-through rates (CTR), and conversion telemetry.`
      }
    ]
  },

  // =========================================================================
  // CATEGORY 4: CREDITS, BILLING & ACCOUNT
  // =========================================================================
  {
    id: 'universal-credits-system-guide',
    category: 'account',
    title: 'How TuneMavens Universal Credits Work',
    readingTime: '4 min read',
    excerpt: 'Your universal credit balance is shared across all native and inter-maven apps. Learn how credits are deducted, volume packs, and auto-reload options.',
    tags: ['Credits', 'Billing', 'Pricing', 'Wallet', 'Intermaven'],
    popular: false,
    toolLink: { label: 'Manage Credits', path: '/pricing' },
    sections: [
      {
        heading: 'One Shared Credit Pool',
        content: `Instead of maintaining separate billing subscriptions for every single tool, TuneMavens utilizes a **Universal Credit Balance**. 

When you purchase credits, that balance is instantly accessible across all platform applications:
* **MasterLab:** 15 credits per track master.
* **SyncMavens Brief Pitching:** 5 credits per submission.
* **Hosting Manager (Custom Domain Link):** 50 credits / year.
* **Smart Contract Generation:** 10 credits per legal contract execution.`
      },
      {
        heading: 'Free Starter Credits',
        content: `Every new account receives **150 free starter credits** upon email verification, allowing you to master tracks, build your EPK, and test the platform before committing.`
      }
    ]
  },

  {
    id: 'account-security-2fa-and-roles',
    category: 'account',
    title: 'Account Security, Two-Factor Authentication & Team Roles',
    readingTime: '4 min read',
    excerpt: 'Safeguard your royalty payouts with two-factor authentication (2FA) and manage multi-seat role permissions for artists, managers, and legal counsel.',
    tags: ['Security', '2FA', 'Team Roles', 'Permissions', 'Royalty Safety'],
    popular: false,
    toolLink: { label: 'Security Settings', path: '/dashboard?tab=account' },
    sections: [
      {
        heading: 'Securing Your Financial Catalog',
        content: `Because TuneMavens handles financial transactions, split payouts, and intellectual property registrations, maintaining ironclad security is paramount.

We strongly encourage all users to enable **Two-Factor Authentication (2FA)** via authenticator apps (Google Authenticator, Authy, or 1Password). 2FA is required before modifying linked bank accounts or M-Pesa phone numbers.`
      },
      {
        heading: 'Multi-Role Team Permissions',
        content: `Collaboration often involves managers, attorneys, and team members. TuneMavens supports granular user roles:
* **Creator / Artist:** Full access to upload audio, view statements, and manage EPKs.
* **Band Member / Collaborator:** Read-only access to split ledgers and payout statements.
* **Manager / Label Exec:** Administrative access across multiple artist rosters.
* **Corporate Brand Advertiser:** Access limited to advertising flights and campaign analytics.`
      }
    ]
  },

  // =========================================================================
  // CATEGORY 6: SUPPORT & AI CLAIMS DESK (ATLANTA TV MOUNT PRO PARITY)
  // =========================================================================
  {
    id: 'how-support-ticketing-works',
    category: 'support',
    title: 'How the TuneMavens Support & AI Claims Ticketing System Works',
    readingTime: '5 min read',
    excerpt: 'Complete walkthrough of filing claims, linking catalog ISRCs or Split Cascade TxIDs, auto-diagnostics, and tracking ticket lifecycles from submission to settlement.',
    tags: ['Support Desk', 'Claims', 'Tickets', 'TuneSupport AI', 'TuneLedger', 'Escrow'],
    popular: true,
    toolLink: { label: 'Launch AI Claims Desk', path: '/community/support' },
    sections: [
      {
        heading: 'Introduction: The Next-Gen Claims Infrastructure',
        content: `Adapted from the rigorous service-guarantee and claims architecture of Atlanta TV Mount Pro, TuneMavens operates a dedicated **Support & Claims Desk** under Community. 

Whether you are facing an unallocated co-producer split, a DSP DDEX ingestion rejection, a broadcast sync cue dispute, or a credit reload issue, the ticketing system provides **instant automated diagnosis, TuneLedger escrow dispute locks, and continuous real-time AI communication** from submission through full settlement.`
      },
      {
        heading: 'Filing a Claim: Step-by-Step Protocol',
        content: `Submitting a support ticket or claim requires only a few structured fields:
1. **Your Name, Email, and Phone Number:** Used to authenticate your account and synchronize contact history across the Intermaven Partner CRM.
2. **Reference ID (Auto-Matched):** Enter an **ISRC** (e.g. \`US-TM1-24-00109\`), a **Split Cascade Transaction ID** (e.g. \`SC-89241\`), a **Sync Brief ID** (e.g. \`SB-7721\`), or an **Invoice ID**. The intake engine automatically cross-references your active catalog and ledger records.
3. **Category Selection:** Choose from six operational disciplines tailored to music production, distribution, and monetization.
4. **Detailed Description:** Explain the discrepancy, unrecouped offset error, or missing stem issue.
5. **Photo & Document Attachments (Max 3):** Upload signed split sheets, PRO cue sheets, DSP error logs, or payment receipts (up to 5MB each).`
      },
      {
        heading: 'The Six Core Support Categories',
        content: `| Category | Description | Automated Safeguard |
| :--- | :--- | :--- |
| **Royalty & Split Cascade Dispute** | Streaming allocation discrepancies, unrecouped deductions | **Instant TuneLedger Escrow Freeze:** Halts disbursements on the disputed cascade |
| **DDEX Ingestion & Distribution Error** | DSP ingestion rejections, duration mismatches, missing stems | **Free Re-Dispatch:** Re-encodes container at zero credit charge |
| **Sync Licensing & Placement Claim** | Broadcaster cue sheet duration offsets, stem delivery delays | **Sync Escrow Protection:** Holds supervisor funds until cue alignment |
| **Unified Credits & Billing Issue** | POS merchant latency, duplicate Stripe charges, reload delay | **Instant Credit Deposit:** Authorizes 1-click credit rebates |
| **Copyright & DMCA Notice** | Sample clearance claims, statutory safe harbor counter-notices | **Statutory Hold:** 14-day cure window with digital fingerprint audit |
| **Account Access & Technical Error** | Studio tool anomalies, team seat permissions, API webhooks | **Concierge Triage:** Immediate supervisor priority queue routing |`
      },
      {
        heading: 'Ticket Status Lifecycle',
        content: `Every ticket progresses through transparent, verifiable lifecycle states:
* **Pending Review:** Ticket created and logged in the CRM; automated TuneLedger dispute lock engaged if a split issue was reported.
* **AI Diagnosed:** TuneSupport AI has completed forensic analysis, identified the root cause, and generated an executable settlement plan.
* **Scheduled Repair:** Audio containers or metadata payloads have been flagged for free DSP re-delivery.
* **Resolved:** Collaborator agreements verified, splits rebalanced, and dispute locks released.
* **Refunded:** Unified credits credited directly to your platform wallet with full audit receipt.`
      }
    ]
  },

  {
    id: 'tunesupport-ai-diagnosis-and-resolution',
    category: 'support',
    title: 'TuneSupport AI: Automated Diagnosis, Live Resolution & Real-Time Communication',
    readingTime: '6 min read',
    excerpt: 'Discover how TuneSupport AI powers instant root-cause analysis, 98%+ confidence scoring, continuous interactive chat, and 1-click automated dispute settlement.',
    tags: ['TuneSupport AI', 'AI Diagnosis', 'Live Chat', 'Automated Settlement', 'Unified Credits'],
    popular: true,
    toolLink: { label: 'Open AI Live Chat Desk', path: '/community/support' },
    sections: [
      {
        heading: 'Autonomous Diagnosis Upon Submission',
        content: `Traditional support desks require waiting 48 to 72 hours for an agent to open a spreadsheet. **TuneSupport AI** eliminates this delay by running an **instant forensic diagnosis within milliseconds** of ticket creation.

The AI engine analyzes:
* The natural language description and sentiment of the complaint.
* The matched ISRC metadata from the central catalog machine.
* Transaction rules and participant percentages in the TuneLedger split database.
* DSP error responses from the DDEX delivery log.

It immediately returns an **AI Confidence Score (typically 92% to 99%)**, a concise **Root Cause Analysis**, and a **Recommended Settlement Action** visible to both creator and administrator.`
      },
      {
        heading: 'The Interactive AI Live Chat Thread',
        content: `Every ticket includes a dedicated, real-time conversational thread between the user and TuneSupport AI:
* **Context-Aware Dialogue:** You can ask questions such as *"Why are my payouts frozen?"*, *"When will Spotify receive my corrected audio?"*, or *"How many credits am I owed for this delay?"*
* **Policy-Grounded Reasoning:** TuneSupport AI understands the TuneMavens ecosystem rules: zero monthly fees, unified credits mechanics, DDEX ERN 4.3 standards, and TuneLedger escrow safeguards.
* **Complete Audit Trail:** Every message, status change, and system action is permanently preserved as a verifiable audit record.`
      },
      {
        heading: 'Executing 1-Click Automated AI Settlements',
        content: `When TuneSupport AI identifies a confirmed discrepancy (such as a 10% unallocated producer split or a payment gateway delay), it generates an actionable settlement plan.

With a single click on **"Accept AI Resolution & Release Holds"**:
1. **Instant Wallet Credit:** Required compensation credits (e.g. +75 or +250 Unified Credits) are deposited directly into your balance in real time.
2. **Escrow Dispute Lock Released:** The freeze on your Split Cascade in TuneLedger is safely lifted, and transactions update to \`✓ SETTLED\`.
3. **Official Audit Certificate:** An itemized resolution receipt is generated with timestamp, settlement hash, and administrator sign-off.`
      }
    ]
  },

  {
    id: 'tuneledger-escrow-dispute-locks',
    category: 'support',
    title: 'TuneLedger Escrow Dispute Locks: Protecting Royalties from Unlawful Payouts',
    readingTime: '5 min read',
    excerpt: 'Why and how TuneLedger automatically freezes split disbursements upon dispute filing, preventing revenue leakage while collaborator agreements are audited.',
    tags: ['TuneLedger', 'Escrow', 'Dispute Locks', 'Split Cascade', 'Royalties'],
    popular: true,
    toolLink: { label: 'View Split Cascade Studio', path: '/dashboard?tab=splits' },
    sections: [
      {
        heading: 'The Critical Need for Automated Payout Freezes',
        content: `In legacy music distribution, when a producer or co-writer disputes their split percentage, platforms often continue disbursing payouts. By the time the dispute is reviewed months later, the money has already left the bank and is virtually impossible to claw back.

Replicating Atlanta TV Mount Pro's escrow protection, **TuneLedger solves this permanently**:
* The moment a ticket is filed categorized under **Royalty & Split Cascade Dispute**, the linked transaction is placed into an immediate **Dispute Lock**.
* Outbound disbursements via **M-Pesa B2C** or **Stripe Express** are paused in escrow.
* Neither party can withdraw the funds until split percentages are reconciled and verified.`
      },
      {
        heading: 'Zero Cross-Collateralization: Isolated Track Protection',
        content: `A fundamental pillar of TuneMavens is **Zero Cross-Collateralization**:
* If track *A* has a split dispute and is locked in escrow, **tracks B, C, and D in your catalog continue generating and disbursing royalties normally**.
* Legacy major label contracts frequently freeze an entire artist catalog over a single disputed song. TuneLedger isolates disputes strictly at the specific ISRC level.`
      },
      {
        heading: 'Reconciling Splits and Releasing Funds',
        content: `Once collaborators upload their signed split sheet or accept TuneSupport AI's reconciliation proposal:
1. The participant percentages are updated in the Split Cascade Studio.
2. The transaction status transitions from \`🔒 Frozen / Disputed\` to \`✓ SETTLED\`.
3. The escrow balance is instantly disbursed according to the verified shares, and an immutable audit hash is appended to the ledger.`
      }
    ]
  },

  {
    id: 'unified-credits-support-and-refunds',
    category: 'support',
    title: 'Unified Credits Engine: Zero Monthly Fees, Reload Safeguards & Instant Refunds',
    readingTime: '4 min read',
    excerpt: 'How the TuneMavens unified credits system operates without monthly charges, provides reload safeguards, and handles instant credit rebates for platform claims.',
    tags: ['Unified Credits', 'Zero Monthly Fees', 'Refunds', 'Billing', 'POS Merch'],
    popular: false,
    toolLink: { label: 'Top-up Unified Credits', path: '/dashboard' },
    sections: [
      {
        heading: 'The Zero-Monthly-Fee Platform Guarantee',
        content: `Unlike traditional SaaS music platforms that trap creators in recurring \$20–\$100 monthly subscriptions whether they release music or not, TuneMavens operates on **100% Unified Credits with Zero Recurring Monthly Fees**.

You load credits when you need them across all tools:
* MasterLab AI audio mastering.
* SyncMavens television & film brief pitching.
* DDEX digital distribution to 150+ DSPs.
* TunePay physical merch point-of-sale inventory.

Because there are no recurring subscriptions, support claims regarding billing are never entangled in monthly renewal disputes.`
      },
      {
        heading: 'Warranty Deliveries & Free DDEX Re-Ingestion',
        content: `If a distribution delivery fails due to a partner DSP metadata format rejection, container checksum error, or audio frame discrepancy:
* **You are never charged credits a second time.**
* TuneSupport AI authorizes an immediate **Warranty Re-Dispatch at 0 credits**.
* The corrected ERN 4.3 XML package and lossless FLAC stems are pushed directly to Spotify and Apple Music ingestion pipelines at platform expense.`
      },
      {
        heading: 'Instant Live Wallet Refunds',
        content: `When a refund or compensation is authorized (for example, a duplicate POS merchant terminal swipe or processing latency):
* Credits are deposited into your wallet instantly via the platform's \`tunemavens-credits-reloaded\` event.
* Your topbar credit counter updates immediately without requiring a browser refresh.
* Full itemized transaction records appear in your Dashboard Settings ledger.`
      }
    ]
  }
];

export const FREQUENT_FAQS = [
  {
    q: 'Do I need platform credits to use the Affiliate Dashboard or onboard creators?',
    a: 'No, absolutely not. The Affiliate Dashboard, referral link generator, conversion tracking, attribution ledger, and direct creator/label onboarding are 100% free and require zero credits. Platform Unified Credits only apply if you personally choose to use creator tools (such as MasterLab AI audio mastering, SyncMavens sync pitching, or custom domain hosting).'
  },
  {
    q: 'How does the TuneMavens 3% to 12% affiliate compensation matrix work?',
    a: 'Modeled after Ditto Music, TuneMavens pays recurring multi-stream commissions ranging from 3% on streaming royalties to 12% on sync clearances and creator credit reloads. Every time someone you refer streams, buys, or licenses music, your commission is recorded automatically on TuneLedger.'
  },
  {
    q: 'Can affiliates directly onboard creators and record labels?',
    a: 'Yes! From your Linked Network & Onboarding console, you can onboard recording artists, beatmakers, indie record labels, and music supervisors just like a label adds roster talent. Entering their details generates an instant pre-bound invitation link that attaches 100% of their future ecosystem activity to your referral ID.'
  },
  {
    q: 'How do M-Pesa STK affiliate payouts work in Kenya and East Africa?',
    a: 'Kenyan and East African partners can receive cleared earnings directly to their Safaricom or Airtel mobile money numbers via automated M-Pesa B2C pushes. Payouts are converted from USD to KES at real-time interbank rates with zero transfer fee deductions.'
  },
  {
    q: 'What is the tracking cookie duration for affiliate links?',
    a: 'Every referral link click sets a persistent 90-day tracking cookie across all TuneMavens subdomains (including TuneStream and SyncMavens). If a creator or fan registers within 90 days of clicking your link, their account is permanently bound to your affiliate profile.'
  },
  {
    q: 'Why are certain articles marked as Recommended Reading during onboarding?',
    a: 'During onboarding, TuneMavens highlights recommended reading tailored to each user\'s assigned role (creators, record labels, music supervisors, or affiliate partners). These guides are 100% optional and never required to access your dashboard, port tracks, or earn commissions, but provide industry best practices on copyright splits, sync pitching, and multi-stream earnings.'
  },
  {
    q: 'How does the Support & AI Claims Desk resolve disputes?',
    a: 'When you submit a claim with an ISRC or Split Cascade TxID, TuneSupport AI performs an instant automated diagnosis, validates metadata against catalog records, and places an escrow freeze on disputed split payouts. You can chat with the AI in real time and execute automated settlements with 1 click.'
  },
  {
    q: 'What happens to my royalties when a Split Cascade dispute is filed?',
    a: 'Disputed payouts are automatically held in TuneLedger escrow to prevent unrecoverable distributions to third parties. Crucially, TuneMavens enforces zero cross-collateralization, meaning undisputed tracks in your catalog continue disbursing revenues normally.'
  },
  {
    q: 'Are DDEX distribution corrections or re-dispatches charged credits?',
    a: 'Never. If a digital service provider (DSP) rejects a delivery due to metadata duration offsets or container checksum errors, TuneSupport AI authorizes an automated warranty re-dispatch at zero credit cost.'
  },
  {
    q: 'How do credit deductions work across different apps?',
    a: 'Credits are universally shared across your TuneMavens account. When you purchase a credit pack or receive monthly credits, they can be spent on any tool—including MasterLab AI mastering, SyncMavens brief pitching, domain renewals, or contract generation.'
  },
  {
    q: 'Can I link my own custom domain to my artist EPK?',
    a: 'Yes! Using the Hosting Manager in your creator dashboard, you can map any custom domain (e.g. yourname.com) to your EPK and fan web world. TuneMavens handles SSL certificate generation automatically at no additional hosting fee.'
  },
  {
    q: 'How does Split Cascade disburse royalty payments?',
    a: 'After you upload your distributor CSV statements and configure split percentages, the Split Cascade calculation engine computes net shares for each collaborator, applies any recoupment offsets, and transfers funds directly to linked Stripe or M-Pesa accounts.'
  },
  {
    q: 'Do I lose ownership of my music when using TuneMavens Publishing?',
    a: 'Never. Under Administrator Mode (our standard 10% fee option), you retain 100% of your copyright ownership. TuneMavens simply registers your works and collects mechanical and international performance royalties on your behalf.'
  },
  {
    q: 'What is the difference between an ISRC and an ISWC?',
    a: 'An ISRC identifies the sound recording (the Master audio), whereas an ISWC identifies the underlying musical work (the lyrics and composition). You need both to collect all master and publishing streaming revenues.'
  },
  {
    q: 'Is registration free, and do I get starter credits?',
    a: 'Yes! Registering an account is 100% free and includes 150 starter credits to test MasterLab mastering, explore the sync marketplace, and build your digital press kit.'
  }
];

