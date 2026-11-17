/**
 * legalPolicies.js
 * Comprehensive, industry-standard legal documentation for TuneMavens & Intermaven Network.
 * Covers: Privacy Policy, Terms of Service, Cookie Policy, and Refund Policy.
 */

export const LEGAL_POLICIES = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy',
    badge: 'Legal & Compliance',
    lastUpdated: 'November 17, 2026',
    effectiveDate: 'November 17, 2026',
    summary: 'How TuneMavens, TuneStream, and the Intermaven Network collect, process, protect, and respect your personal data, audio catalog assets, and payment information.',
    plainEnglishSummary: 'We respect your creative sovereignty and personal privacy. We never sell your personal data. We collect only what is necessary to operate our streaming, mastering, split waterfall, and ticketing services. Your financial transactions through Safaricom M-Pesa and Stripe are protected by bank-grade encryption, and your master audio files remain 100% your property.',
    sections: [
      {
        id: 'overview',
        title: '1. Overview & Data Controller',
        inPlainEnglish: 'TuneMavens Ltd is the official data controller for TuneMavens, TuneStream, and SyncMavens under the Intermaven Network umbrella.',
        content: `TuneMavens Ltd ("TuneMavens", "we", "us", or "our"), incorporated under the laws of Kenya and operating across East Africa, the United States, and globally through the Intermaven Network, operates the platforms accessible at tunemavens.com, tunestream.co, syncmavens.com, and related mobile applications.

This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our websites, utilize our creator EPK web worlds, upload catalog tracks, stream audio, reload network credits, participate in split cascade payouts, or engage with our CRM and ticketing services.

If you have questions regarding this Privacy Policy or our data protection practices, you may contact our Data Protection Officer (DPO) at **privacy@intermaven.io** or **legal@tunemavens.com**.`
      },
      {
        id: 'information-collected',
        title: '2. Information We Collect',
        inPlainEnglish: 'We collect account details you provide, audio and metadata you upload, and payment info needed to process reloads and payouts.',
        content: `We collect information in three primary categories:

### A. Information You Provide to Us
- **Account Identification:** Full legal name, stage name/moniker, email address, phone number, password hash, country of residence, and primary creator persona (e.g. Artist, DJ, Record Label, Music Supervisor, Podcaster, Everyday Listener).
- **Creator Catalog & Intellectual Property Assets:** Master audio recordings (WAV, FLAC, MP3), stems, cover artwork, album liner notes, ISRC (International Standard Recording Code), ISWC (International Standard Musical Work Code), DDEX metadata feeds, lyric transcriptions, and split sheets.
- **Biographical & Web World Content:** Artist bios, press quotes, tech riders, tour dates, social media links (Spotify, Apple Music, YouTube, Instagram, TikTok), and custom subdomain preferences.
- **Tax & Payout Information:** M-Pesa registered mobile phone numbers, bank transfer details (SWIFT/IBAN), Mobile Money IDs, and applicable tax identification for royalty disbursement.

### B. Information Automatically Collected
- **Streaming & Listening Telemetry:** Track plays, duration listened, scrubbing points, skips, volume preferences, playlists created, and download logs.
- **Technical & Device Data:** IP address, browser type and version, device operating system, network connection speed, screen resolution, and time zone setting.
- **Audio Processing Telemetry:** Integrated LUFS mastering measurements, peak decibels (dBTP), sample rate conversions, and audio transcoding job logs.

### C. Financial & Transactional Data
- **Credit Reloads & Purchases:** Transaction timestamp, package purchased, currency (USD or KES), receipt numbers (e.g. \`TM-CR-...\`), and payment method used.
- **M-Pesa Daraja Transactions:** Safaricom Merchant Request IDs, Checkout Request IDs, and Safaricom M-Pesa receipt codes (e.g. \`QG...\`). Note: **We never store or have access to your private M-Pesa PIN.**
- **Card Payment Records:** Last 4 digits of card number, card brand, expiration month/year, and tokenized payment gateway reference from Stripe. We never store full card numbers or CVV/CVC codes.`
      },
      {
        id: 'how-we-use-information',
        title: '3. How We Use Your Information',
        inPlainEnglish: 'We use your data to power your audio playback, calculate your royalties, process payments, and recommend music you love.',
        content: `We process your personal information for lawful and specified purposes:

1. **Service Delivery & Audio Streaming:** To deliver uncapped continuous audio streaming, provide high-fidelity audio playback, render custom Creator EPK Web Worlds, and store master stems.
2. **TuneLedger Split Waterfall & Accounting:** To compute mathematically verified revenue cascade splits across writers, producers, DJs, and labels, and provide immutable cryptographic transaction records in TuneLedger.
3. **Payment Processing & Credit Settlement:** To initiate real-time Safaricom Daraja STK Push prompts to your mobile device, process card authorizations, credit your network balance, and disburse creator royalties.
4. **Creator & Fan CRM Communications:** To facilitate direct booking requests, process event ticket QR codes, and deliver opt-in artist broadcasts via WhatsApp, SMS, or rich email.
5. **Personalized Taste Recommendations:** To generate algorithmic playlists, suggest relevant sync licensing briefs to creators, and curate personalized crates for DJs.
6. **Platform Security & Fraud Prevention:** To prevent simulated credit injection, detect bot listening loops, verify genuine play counts, and prevent copyright infringement.`
      },
      {
        id: 'legal-basis',
        title: '4. Legal Bases for Processing',
        inPlainEnglish: 'We process your data strictly under valid legal grounds: contract fulfillment, your consent, legal duties, and our legitimate interests.',
        content: `Under the Kenya Data Protection Act (KDPA) 2019, the European Union General Data Protection Regulation (GDPR), and applicable international frameworks, we rely on the following legal bases:

- **Performance of a Contract:** Fulfilling our service agreements, hosting your audio, managing your EPK, and executing split sheets signed by collaborating rights holders.
- **Legitimate Interests:** Protecting platform security, combating streaming fraud, improving audio encoding algorithms, and maintaining ledger audit integrity.
- **Consent:** Delivering promotional marketing broadcasts, enabling optional third-party social integrations, and utilizing non-essential analytics cookies. You may revoke consent at any time.
- **Compliance with Legal Obligations:** Maintaining financial records for statutory tax authorities, adhering to anti-money laundering regulations, and responding to lawful court orders.`
      },
      {
        id: 'data-sharing',
        title: '5. Information Sharing & Third-Party Service Providers',
        inPlainEnglish: 'We do not sell your personal data. We share data only with verified infrastructure providers like payment processors, cloud storage, and telecom gateways.',
        content: `**TuneMavens does not sell, rent, or trade your personal data to data brokers or third-party advertisers.** We share data solely with trusted sub-processors under strict confidentiality and data protection agreements:

- **Payment Gateways:** Safaricom PLC (Daraja API for M-Pesa payments in East Africa) and Stripe, Inc. (global card processing and PCI-DSS Level 1 compliance).
- **Cloud Infrastructure & Audio Storage:** Amazon Web Services (AWS) and Wasabi Technologies for encrypted master audio asset and stem storage; MongoDB Atlas for encrypted database persistence.
- **Communication Gateways:** Africa's Talking and Twilio for authenticated SMS, OTP dispatch, and verified CRM broadcasts.
- **Collaborating Rights Holders:** In accordance with signed split cascade sheets, collaborator names and share percentages are visible to fellow rights holders on that recording's TuneLedger statement.
- **Music Supervisors (Sync Placement):** If you opt into the SyncMavens marketplace, your track metadata, preview audio, and contact information are made available to verified music supervisors and broadcast editors.`
      },
      {
        id: 'international-transfers',
        title: '6. International Data Transfers',
        inPlainEnglish: 'Because TuneMavens operates globally across Kenya, the USA, and worldwide, your data may be transferred securely across borders using approved safeguards.',
        content: `TuneMavens operates servers and facilities across Kenya, the United States, and the European Union. When transferring data across borders:

- We implement standard contractual clauses (SCCs) and data transfer agreements adhering to Kenya Data Protection Act Section 48 and GDPR Chapter V.
- All cross-border data transmissions are encrypted using Transport Layer Security (TLS 1.3).
- Master audio recordings and encrypted database records stored in AWS/Wasabi are encrypted at rest using AES-256.`
      },
      {
        id: 'retention-and-deletion',
        title: '7. Data Retention & Account Deletion',
        inPlainEnglish: 'We keep your account data while active. You can request deletion anytime, but financial transaction records must be kept for 7 years by law.',
        content: `We retain personal data only as long as necessary to fulfill the purposes for which it was collected:

- **Active User Accounts:** Retained for the duration of your active account plus 90 days following account closure to allow for data export.
- **Master Audio Files & Stems:** Retained in your storage vault until deleted by you or upon verified account termination.
- **TuneLedger Financial Records:** Transaction receipts, payout logs, and split cascade disbursements are retained for a minimum of seven (7) years to comply with statutory accounting and anti-money laundering requirements.
- **Right to Erasure (Right to be Forgotten):** You may request full account and data erasure by navigating to your Account Settings or emailing **privacy@intermaven.io**. We will process verified requests within 30 days, subject to mandatory legal record retention.`
      },
      {
        id: 'user-rights',
        title: '8. Your Rights & Privacy Choices',
        inPlainEnglish: 'You have full rights to access your data, correct errors, export your audio/metadata, opt out of marketing, and lodge inquiries.',
        content: `Depending on your jurisdiction, you have the following enforceable rights regarding your personal information:

1. **Right of Access:** You can request a copy of the personal data we hold about you.
2. **Right to Rectification:** You can update or correct inaccurate profile, catalogue, or payout information directly in your dashboard or by contacting support.
3. **Right to Data Portability:** You can export your catalog metadata, split sheets, and TuneLedger statements in structured CSV/JSON formats.
4. **Right to Restrict or Object to Processing:** You can object to algorithmic profiling or direct marketing broadcasts at any time.
5. **Right to Withdraw Consent:** Where processing is based on consent, you may withdraw it without affecting the lawfulness of prior processing.
6. **Regulatory Complaints:** You have the right to lodge a complaint with your local data authority, including the Office of the Data Protection Commissioner (ODPC) in Kenya (odpc.go.ke) or your state/national authority.`
      },
      {
        id: 'security',
        title: '9. Data Security Safeguards',
        inPlainEnglish: 'We use modern encryption, append-only ledgers, tokenized cards, and isolated access controls to protect your creative and financial assets.',
        content: `We employ enterprise-grade administrative, technical, and physical safeguards:

- **End-to-End Encryption:** All web traffic is enforced over HTTPS with TLS 1.3 encryption. Data at rest is encrypted with AES-256.
- **Cryptographic TuneLedger Audit Trail:** Financial transactions and credit balance changes are recorded in an append-only ledger architecture, preventing unauthorized balance tampering.
- **Zero Raw Secret Storage:** User passwords are encrypted using high-work-factor bcrypt hashing. M-Pesa PINs and full credit card details are never received or stored on our servers.
- **Strict Role-Based Access Control:** Production infrastructure access is restricted to authorized personnel via hardware MFA and audited jump hosts.`
      },
      {
        id: 'contact',
        title: '10. Contacting Our Privacy Team',
        inPlainEnglish: 'Got questions or privacy requests? Email our Data Protection Officer directly.',
        content: `If you have questions, comments, or data subject requests regarding this Privacy Policy:

**TuneMavens Ltd / Intermaven Network**  
Data Protection Officer  
Email: **privacy@intermaven.io** / **legal@tunemavens.com**  
Headquarters: Nairobi, Kenya | Regional: Atlanta, GA, USA  
Response SLA: Within 48 hours for general inquiries, within 30 days for statutory rights requests.`
      }
    ]
  },

  terms: {
    id: 'terms',
    title: 'Terms of Service',
    shortTitle: 'Terms',
    badge: 'Legal Agreement',
    lastUpdated: 'November 17, 2026',
    effectiveDate: 'November 17, 2026',
    summary: 'The binding contract governing your use of TuneMavens, TuneStream, SyncMavens, Creator EPKs, split cascades, credit purchases, and live events.',
    plainEnglishSummary: 'By using TuneMavens, you agree to these terms. You keep 100% ownership of your music. Split agreements you sign with collaborators are binding and enforced via TuneLedger. You pay for what you use with non-expiring credits (no hidden monthly subscriptions). Be respectful, do not upload music you do not own, and do not game stream counts.',
    sections: [
      {
        id: 'acceptance',
        title: '1. Acceptance of Terms & Eligibility',
        inPlainEnglish: 'By creating an account or using TuneMavens, you agree to this contract. You must be at least 18 years old or have legal guardian representation.',
        content: `Welcome to TuneMavens. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Creator", "You") and TuneMavens Ltd ("TuneMavens", "we", "us", or "our"), governing your access to and use of our ecosystem platforms (tunemavens.com, tunestream.co, syncmavens.com), APIs, mobile applications, and creator tools.

By creating an account, reloading credits, uploading master tracks, or accessing any service, you affirm that:
1. You are at least 18 years of age or the age of legal majority in your jurisdiction. If you are under 18, you may only use our services through an authorized parent or legal guardian who accepts these Terms.
2. You have the full legal right, power, and authority to enter into these Terms and perform your obligations hereunder.
3. If you represent an entity (such as a record label, publishing house, or media company), you are an authorized representative with authority to bind that entity.`
      },
      {
        id: 'accounts-and-sso',
        title: '2. User Accounts & Intermaven Single Sign-On (SSO)',
        inPlainEnglish: 'One account works across the entire Intermaven network. Keep your login secure; you are responsible for actions under your account.',
        content: `TuneMavens operates on the Intermaven Single Sign-On (SSO) architecture. Your verified credentials grant you synchronized access across:
- **TuneMavens Portal:** Creator EPK Web Worlds, Mother-CMS, catalog machine, split cascade ledger, and CRM.
- **TuneStream:** Consumer streaming player, lossless audio purchases, and playlist crates.
- **SyncMavens:** Music supervisor brief pitching, synchronization agreements, and cue sheet exports.

You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. You agree to notify us immediately at **security@tunemavens.com** upon suspecting unauthorized account access.`
      },
      {
        id: 'creator-ownership',
        title: '3. 100% Creator Ownership & License Grant',
        inPlainEnglish: 'You keep 100% of your copyright. We do not take your publishing, masters, or rights. You give us permission only to host and stream your audio.',
        content: `### A. You Retain Complete Ownership
**TuneMavens makes no claim to the copyright or underlying intellectual property of any audio recordings, compositions, stems, artwork, or lyrics you upload.** You retain 100% of your master rights, publishing, and creative control. We do not impose involuntary 360-degree deals or restrictive publishing liens.

### B. Limited Non-Exclusive License to TuneMavens
In order to operate the platform on your behalf, you grant TuneMavens a worldwide, non-exclusive, royalty-free, revocable license solely to:
- Host, store, transcode, and cache your audio masters and stems on high-speed distribution nodes.
- Stream and preview your audio according to the access permissions you configure (e.g. public streaming, gated fan vault, industry supervisor preview, or stem purchase).
- Display your artist moniker, artwork, and metadata on your Creator EPK Web World and search directories.
- Generate digital QR event passes and ticket vouchers linked to your verified live dates.

You may revoke this license at any time by unpublishing or deleting your tracks from the platform.`
      },
      {
        id: 'split-cascade-and-ledger',
        title: '4. TuneLedger & Split Cascade Legal Waterfall',
        inPlainEnglish: 'Split sheets signed on TuneMavens are legally binding contracts. All revenue splits are executed automatically and logged in the immutable TuneLedger.',
        content: `TuneMavens provides the **TuneLedger & Split Cascade Studio** for automated revenue distribution:

1. **Binding Signatures:** Any split sheet, cascading waterfall agreement, or cue sheet signed electronically via the platform (using verified timestamp, user ID, and e-signature) is a legally binding contract among the signatories.
2. **Automated Settlement:** Revenues generated from stem purchases, full album downloads, and sync buyouts are automatically split according to the active waterfall ratios and credited to each collaborator's TuneLedger account.
3. **Dispute Escrow Holds:** In the event of a dispute filed by a rights holder regarding track authorship or split percentages, TuneMavens reserves the right to place an immediate automated escrow hold on disputed disbursements until resolved by mutual consent or formal legal adjudication.
4. **Creator Warranties:** You warrant that all tracks and stems uploaded are either wholly original or that you have secured all required licenses, mechanical permissions, and sample clearances. You agree to indemnify TuneMavens from any damages, fees, or legal expenses arising from copyright infringement claims against your content.`
      },
      {
        id: 'unified-credits',
        title: '5. Unified Network Credits & Server-Authoritative Pricing',
        inPlainEnglish: 'Credits do not expire. Prices are set on the server and cannot be manipulated. There are no surprise monthly subscription fees.',
        content: `Our ecosystem operates primarily on a sovereign **Unified Credits Model**:

- **No Expiring Credits:** Credits purchased or earned on TuneMavens do not expire and remain active on your account balance across TuneMavens, TuneStream, and SyncMavens.
- **Server-Authoritative Pricing:** All credit package costs, stem prices, and mastering fees are calculated and enforced strictly by server-side rate tables. Any attempt to tamper with client-side amounts, fake checkout sessions, or inject simulated credits constitutes fraud and will result in immediate termination.
- **Credit Redemption:** Credits may be redeemed for audio mastering, multitrack stem downloads, EPK custom domain routing, promotional broadcasts, and partner tools. Credits have no cash surrender value outside the platform except as officially settled creator royalty payouts.`
      },
      {
        id: 'payment-rails',
        title: '6. Payment Rails & Handset Authorization',
        inPlainEnglish: 'You can pay via Safaricom M-Pesa or Card. M-Pesa prompts your phone for your PIN. Never share your PIN. Fraudulent chargebacks are strictly banned.',
        content: `Transactions are processed via two primary rails:

- **Safaricom M-Pesa (East Africa):** Reloads initiated via M-Pesa trigger an instant Daraja STK Push prompt to your mobile handset. You must authorize the transaction by entering your private PIN on your phone. Credits are minted to your TuneLedger only upon receipt of a validated callback from Safaricom (\`ResultCode == 0\`).
- **Credit / Debit Cards (Global):** Card transactions are authorized through PCI-DSS certified payment processors.
- **Reversals & Fraud:** Unauthorized chargebacks, fraudulent transaction disputes, or falsified M-Pesa reversal requests will result in an immediate freeze on the user account and forfeiture of any unearned balances.`
      },
      {
        id: 'acceptable-use',
        title: '7. Acceptable Use Policy',
        inPlainEnglish: 'Do not upload stolen music, do not run stream bots or fake plays, and do not abuse or hack the platform.',
        content: `You agree not to engage in any of the following prohibited behaviors:

1. **Streaming Fraud & Bot Activity:** Generating artificial plays through bots, scripts, automated loops, click farms, or deceptive replay loops.
2. **Infringing Content:** Uploading audio, lyrics, or visuals that violate copyright, trademark, patent, or privacy rights of third parties.
3. **Platform Abuse:** Scraping, crawling, reverse engineering, or exploiting platform APIs, or bypassing security rate limits and access controls.
4. **Harassment & Defamation:** Transmitting defamatory, abusive, threatening, or unlawful content through the CRM, public comment threads, or EPKs.
5. **Unauthorized Resale:** Reselling unencrypted master stems without rights holder authorization.`
      },
      {
        id: 'termination',
        title: '8. Account Suspension & Termination',
        inPlainEnglish: 'You can close your account whenever you want. We may suspend or terminate accounts that violate copyright or commit payment fraud.',
        content: `You may terminate your account at any time via Account Settings or by notifying **support@tunemavens.com**.

TuneMavens may suspend or terminate your account immediately without prior notice if:
- You materially breach these Terms or our Acceptable Use Policy.
- We receive multiple verified DMCA or copyright infringement takedown notices regarding your uploads.
- You commit payment fraud, simulate STK push callbacks, or initiate bad-faith payment reversals.
- Required to do so by court order, law enforcement, or statutory regulatory mandates.`
      },
      {
        id: 'disclaimer-and-liability',
        title: '9. Disclaimers & Limitation of Liability',
        inPlainEnglish: 'The platform is provided "as is". Our maximum liability to you is limited to the fees you paid us in the last 12 months.',
        content: `**A. "As Is" Disclaimer:** TuneMavens is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 99.9% uptime, lossless audio fidelity, and immediate STK push dispatch, we disclaim all warranties of any kind, whether express, implied, or statutory.

**B. Limitation of Liability:** To the maximum extent permitted by applicable law, TuneMavens Ltd, its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, revenue, data, or goodwill). In no event shall our total aggregate liability exceed the total amount paid by you to TuneMavens in the twelve (12) months preceding the claim.`
      },
      {
        id: 'governing-law',
        title: '10. Governing Law & Dispute Resolution',
        inPlainEnglish: 'Disputes are resolved first through good-faith negotiation, then binding arbitration under the laws of Kenya or Delaware.',
        content: `These Terms shall be governed by and construed in accordance with the laws of Kenya for African regional operations, and the laws of the State of Delaware (United States) for international North American operations, without regard to conflict of law principles.

Any dispute, controversy, or claim arising out of or relating to these Terms shall first be submitted to informal, good-faith negotiation for thirty (30) days. If unresolved, the dispute shall be settled by binding arbitration in Nairobi, Kenya under the Arbitration Act 1995, or in Wilmington, Delaware under the American Arbitration Association (AAA) rules.`
      }
    ]
  },

  cookies: {
    id: 'cookies',
    title: 'Cookie Policy',
    shortTitle: 'Cookies',
    badge: 'Tracking & Storage',
    lastUpdated: 'November 17, 2026',
    effectiveDate: 'November 17, 2026',
    summary: 'How TuneMavens uses browser cookies, local storage, and session tokens to keep you logged in, save your audio volume, and remember your currency preferences.',
    plainEnglishSummary: 'We use cookies and local storage tokens to keep you signed in, remember your volume and playback state, show prices in your preferred currency (KES or USD), and track affiliate referrals. We do not use third-party tracking cookies to stalk you across the internet.',
    sections: [
      {
        id: 'what-are-cookies',
        title: '1. What Are Cookies and Web Storage?',
        inPlainEnglish: 'Cookies and local storage are small text snippets stored in your browser so websites remember who you are and what settings you prefer.',
        content: `Cookies are small data files placed on your computer or mobile device when you visit a website. In addition to HTTP cookies, modern web applications utilize **Web Storage** (specifically \`localStorage\` and \`sessionStorage\`) to store configuration state and secure authentication tokens.

On TuneMavens, we use both cookies and Web Storage to provide a seamless, secure, and personalized creator and listener experience.`
      },
      {
        id: 'categories-of-cookies',
        title: '2. Categories of Cookies We Use',
        inPlainEnglish: 'We use four kinds of cookies: essential security tokens, playback & language preferences, audio performance telemetry, and affiliate tracking.',
        content: `We categorize the cookies and storage mechanisms used across TuneMavens into four groups:

### 1. Strictly Necessary (Essential)
These tokens are indispensable for the core security and functionality of the platform. Without them, you cannot log in, access your dashboard, or reload credits.
- \`tunemavens_token\`: Secure JWT session token for authenticated REST API calls.
- \`tunemavens_session\`: Active user identity, role, and verified permissions.
- \`csrf_token\`: Cryptographic token preventing cross-site request forgery attacks.

### 2. Functional & Preference Settings
These store your customizations so you do not have to reconfigure them on every page reload:
- \`tunemavens_region\`: Country code and regional currency selection (USD vs. KES).
- \`tunemavens_lang\`: Preferred language localization (English, Kiswahili, Spanish).
- \`tunestream_player_volume\`: Audio playback volume level (0.0 to 1.0) and mute status.
- \`tunemavens_active_persona\`: Creator vs. listener dashboard preference.
- \`tunemavens_sidebar_collapsed\`: UI layout state.

### 3. Performance & Audio Telemetry
These help us monitor streaming health and ensure 60fps audio waveform scrubber rendering:
- Telemetry tokens for tracking audio buffer underruns, LUFS mastering progress, and API latency.
- Aggregated error logging to detect browser playback incompatibilities.

### 4. Commercial & Affiliate Attribution
- \`tunemavens_affiliate_ref\`: Stores referral partner IDs for 90 days to ensure affiliates receive accurate commission on creator and listener sign-ups.
- Corporate sponsorship ad impression metrics (anonymous counts of 15s/30s audio spots played).`
      },
      {
        id: 'third-party-cookies',
        title: '3. Third-Party Cookies & Integrations',
        inPlainEnglish: 'We use trusted partners like Stripe for payment security. We do not allow third-party ad networks to track you across other websites.',
        content: `When you interact with certain features on our platform, third-party services may set cookies:
- **Stripe:** Used for fraud detection and tokenized credit card processing on checkout forms.
- **Safaricom Daraja API:** Uses secure server-to-server endpoints and does not place tracking cookies on user devices.
- **Embedded Media:** If a creator embeds a YouTube video or Spotify widget in their EPK bio, those services may deploy their own cookies subject to their respective privacy policies.`
      },
      {
        id: 'managing-cookies',
        title: '4. How to Manage & Disable Cookies',
        inPlainEnglish: 'You can disable or delete cookies anytime through your web browser settings, but some features like staying signed in will stop working.',
        content: `You have the right to accept or decline non-essential cookies. You can manage your preferences through:

1. **Browser Controls:** Most browsers allow you to view, delete, or block cookies. For guidance:
   - Google Chrome: Settings > Privacy and Security > Cookies and other site data
   - Apple Safari: Preferences > Privacy > Block all cookies
   - Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data
   - Microsoft Edge: Settings > Privacy, search, and services > Cookies

2. **Local Storage Clearing:** You can clear cached local storage items anytime in your browser developer tools or by logging out via the profile menu.

*Please note: Disabling strictly necessary cookies will prevent you from logging in, maintaining an active session, or streaming audio.*`
      }
    ]
  },

  refund: {
    id: 'refund',
    title: 'Refund Policy',
    shortTitle: 'Refunds',
    badge: 'Payments & Guarantees',
    lastUpdated: 'November 17, 2026',
    effectiveDate: 'November 17, 2026',
    summary: 'Our fair, transparent policy regarding credit reload refunds, master stem downloads, live event ticketing, and dispute escrow resolutions.',
    plainEnglishSummary: 'Unused credits can be refunded within 14 days. Once you download audio stems or mastering files, they are non-refundable because you have the unencrypted files. Concert tickets can be refunded up to 48 hours before the show, or transferred to a friend for free anytime. Cancelled concerts are 100% refunded automatically.',
    sections: [
      {
        id: 'philosophy',
        title: '1. Our Refund Philosophy',
        inPlainEnglish: 'We treat creators and fans fairly: we guarantee quality, support genuine errors, and protect rights holders against bad-faith chargebacks.',
        content: `At TuneMavens, we operate an equitable, transparent music economy. Because our services span digital software, instant audio processing, live event ticketing, and irreversible multitrack asset delivery, we maintain a clear refund policy that protects both consumers and creative rights holders.`
      },
      {
        id: 'credit-reloads',
        title: '2. Unified Credits Reloads',
        inPlainEnglish: 'Bought credits by mistake? You can request a full refund on unused credits within 14 days of purchase.',
        content: `### A. Unused Credit Balances (14-Day Guarantee)
If you purchased a credit package (via card or M-Pesa) and have not spent those credits, you are eligible for a **100% refund of the unused balance within fourteen (14) days** of the purchase timestamp.

### B. Partially Used Credit Packages
If you have spent a portion of a purchased credit package, refunds are issued strictly on the remaining unspent credits pro-rated at the package purchase rate, less applicable third-party payment processing fees (e.g. standard Safaricom or Stripe transaction levies).

### C. Promotional or Complimentary Credits
Credits granted as promotional beta gifts, affiliate bonuses, or customer support goodwill have zero cash surrender value and are strictly non-refundable.`
      },
      {
        id: 'digital-stems-and-audio',
        title: '3. Digital Audio Stems & Lossless Masters',
        inPlainEnglish: 'Stem packs and master audio downloads are non-refundable once unlocked and downloaded, unless the file was corrupted or defective.',
        content: `Due to the nature of digital goods and the immediate, irreversible delivery of unencrypted 24-bit WAV/AIFF master recordings and isolated multitrack stems:

- **All completed downloads of stems, full album files, and mastering renders are non-refundable once the file download has initiated.**
- **Defective File Guarantee:** If a downloaded audio file is demonstrably corrupted, missing channels, or fails LUFS compliance due to a system error on our platform, report the issue to **support@tunemavens.com** within forty-eight (48) hours. Our audio engineering team will re-render and re-deliver the correct master asset or issue a full credit refund.`
      },
      {
        id: 'event-tickets',
        title: '4. Live Event & Concert Tickets',
        inPlainEnglish: 'Tickets are refundable up to 48 hours before the show. Transfers to friends are always free. Cancelled shows are refunded 100% automatically.',
        content: `For tickets purchased for live shows, club nights, and tour dates hosted on TuneMavens:

- **Up to 48 Hours Before Event Kickoff:** You may cancel your ticket for a full refund back to your original payment method or a 100% credit refund.
- **Within 48 Hours of Event Kickoff:** Ticket purchases are final and non-refundable due to promoter venue guarantees and door quotas. However, **1-click ticket transfer to any verified TuneMavens user is 100% free of charge.**
- **Event Cancellation or Rescheduling:** If an event is cancelled by the artist or promoter, or indefinitely postponed, all ticket holders will automatically receive a 100% cash refund to their original payment method, or the option to receive 110% value in TuneMavens network credits.`
      },
      {
        id: 'escrow-disputes',
        title: '5. TuneLedger Escrow Holds & Payout Disputes',
        inPlainEnglish: 'Disputed royalty splits are held safely in escrow. Once collaborators resolve the dispute, funds are released according to the agreement.',
        content: `If a track's cascading splits or licensing royalties are subject to an active rights dispute:
- Disputed funds are securely frozen in **TuneLedger Escrow** and cannot be withdrawn by any party.
- Once the dispute is resolved (via amended bilateral split sheet or arbitration resolution), funds are released to the verified accounts within twenty-four (24) hours.
- Escrow holds do not constitute forfeitures and accrue zero administrative holding penalties.`
      },
      {
        id: 'request-procedure',
        title: '6. How to Request a Refund',
        inPlainEnglish: 'Request a refund through the Support Desk or email billing@tunemavens.com with your receipt number. We respond within 24-48 hours.',
        content: `To request a refund:

1. **Via Support Desk:** Navigate to **Support & Community > Support Desk** (\`/community/support\` or \`/support\`) and select category "Billing & Payments".
2. **Via Direct Email:** Send an email to **billing@tunemavens.com** or **support@tunemavens.com**.
3. **Required Information:**
   - Your account email and stage name.
   - The transaction receipt number (e.g. \`TM-CR-...\` or Safaricom M-Pesa transaction reference).
   - A brief explanation of the refund request.

Our billing department processes verified refund requests within **2 to 3 business days**. Funds returned via M-Pesa typically reflect within minutes of approval; card refunds reflect within 5 to 10 banking days depending on your issuing bank.`
      }
    ]
  }
};
