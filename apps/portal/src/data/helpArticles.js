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
];

export const HELP_ARTICLES = [
  // =========================================================================
  // CATEGORY 1: MUSIC PUBLISHING & COPYRIGHT
  // =========================================================================
  {
    id: 'master-vs-composition-copyright',
    category: 'publishing',
    title: 'The Two Halves of Music Copyright: Master Rights vs. Composition Rights',
    readingTime: '5 min read',
    excerpt: 'Every recorded song possesses two distinct copyrights: the Sound Recording (Master) and the Musical Work (Composition). Learn how each generates revenue and why owning both gives you a massive advantage.',
    tags: ['Copyright', 'Master Rights', 'Publishing', 'One-Stop', 'Royalties'],
    popular: true,
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
    tags: ['Sync Licensing', 'Music Supervisors', 'Cue Sheets', 'Film & TV', 'Stems'],
    popular: true,
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
    tags: ['TuneStream', 'Lossless Audio', 'FLAC', 'Streaming', 'Tipping'],
    popular: true,
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
    tags: ['TuneLedger', 'Split Cascade', 'Royalties', 'Stripe', 'M-Pesa', 'Accounting'],
    popular: true,
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
    tags: ['Corporate Ads', 'Brand Sponsorships', 'Ad Rates', 'CPM', 'Flights'],
    popular: false,
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
  }
];

export const FREQUENT_FAQS = [
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
