# TuneMavens — Localization & Market Adaptation Architecture Guide

## 1. Executive Overview

TuneMavens uses the **Synergy Client-Side DOM Localization & Multi-Currency Adaptation Engine** (`window.SynergyLocalization`, version `v=50`) across all three standalone web applications in the monorepo:
- **Portal (`apps/portal`, port 3000)**: Landing pages, Blog & Help Center articles, In-App Documentation Modal (`InAppDocModal.jsx`), Creator EPK Web Worlds, Label Roster, Mother-CMS Studio, Smart CRM, Affiliates, MyContracts, and TuneLedger Split Cascade Studio (`ROYALTY_GUIDES`).
- **TuneStream (`apps/tunestream`, port 3001)**: Consumer lossless streaming portal, 5-slide auto-advancing hero carousel (synchronized with the main Portal landing page), fan tipping, stem unlocking, and artist discovery.
- **SyncMavens (`apps/syncmavens`, port 3002)**: Pre-cleared audiovisual sync licensing marketplace, supervisor brief management, and dynamic waterfall quote calculator.

### Simultaneous Kenya & USA Launch Defaults
- **Primary Launch Markets**:
  - `KE` (Kenya 🇰🇪) — Base Currency `KES` (`KSh`), Default Language `sw` (Kiswahili, configurable by Admin to `ki` or `en`)
  - `US` (United States 🇺🇸) — Base Currency `USD` (`$`), Default Language `en` (English, configurable by Admin to `es`)
- **Supported Languages (`synergy_lang`)**:
  - `en` — English (`EN`, 🇬🇧)
  - `sw` — Kiswahili (`SW`, 🇰🇪)
  - `ki` — Gĩkũyũ / Kikuyu (`KI`, 🇰🇪)
  - `es` — Español / Spanish (`ES`, 🇺🇸)
- **Extensible Language Architecture**: Runtime registration of new language packs via `window.SynergyLocalization.registerLanguage()`.

---

## 2. Core Design Principles & Multi-Language Translation Pipeline

1. **Single Source of Truth in HTML/JSX (English + Multi-Currency Base)**
   - All React components, landing pages, sidebars, articles, modals, and dashboard applications are authored in canonical English (`en`) and base US Dollars (`$`) or Kenyan Shillings (`KES`).
   - There are no duplicated route trees or separate per-component JSON files.

2. **3-Tier Multi-Language Translation Architecture (`translateStringToLang` / `translateSingleLineToLang`)**
   - **Multiline Decomposition**: Strings containing `\n` are automatically split line-by-line when not matched as a full block, ensuring multi-paragraph strings, list items, and tooltip descriptions translate cleanly.
   - **Tier 1A — Exact Phrase Dictionary (`pack.T`)**: Over 1,400 curated full-sentence, heading, button, sidebar, tooltip, and article paragraph translations per language pack (including dynamic button verbs like `+ Add Admin Team Member`, `+ Spin Up New Contract`, `+ Invite Admin`, `+ Register New Split Sheet`).
   - **Tier 1B — Punctuation, List-Numbering & Symbol Stripping**: Automatically strips leading list markers (`1. `, `• `, `— `, `☐ `, `#`), translates the core phrase via `pack.T`, and restores the exact leading/trailing punctuation or `#` tag prefix (e.g., `#Recoupment` → `#Urejeshaji Gharama` in Swahili, `#Ũrihi wa Mbere` in Kikuyu, `#Recuperación` in Spanish).
   - **Tier 2 — Bounded Multi-Word Phrase Matching with Protected Output (`pack.MULTI_WORD_KEYS`)**: Replaces multi-word domain phrases on word boundaries (sorted by descending length) and protects translated text with internal tokens (`\uE000...\uE001`) to prevent subsequent Tier 3 passes from re-translating translated target words.
   - **Pre-Tier 3 — Contraction & Language-Specific Normalization**:
     - *English/Swahili*: Normalizes contractions (`don't` → `usifanye`, `doesn't` → `haifanyi`, `can't` → `haiwezi`, etc.) and removes English standalone articles (`the`, `a`, `an`).
     - *English/Kikuyu*: Normalizes contractions (`don't` → `ndũgathe`, `doesn't` → `ndĩrĩkaga`, `can't` → `ndĩngĩhota`, etc.) and strips English articles.
     - *English/Spanish*: Normalizes contractions (`don't` → `no`, `can't` → `no puede`, possessive `'s` → `de $1`).
   - **Tier 3 — Unicode-Aware Lexicon Tokenizer with Morphological Fallback (`pack.WORD_LEXICON`)**: Applies 4,800+ vocabulary words using O(1) dictionary lookups with morphological candidate derivation for English plurals (`-s`, `-es`, `-ies`, `-ves`), past tenses (`-ed`, `-ied`), participles (`-ing`), adverbs (`-ly`, `-ally`), and nominalizations (`-ment`, `-tion`).
   - **Form & Attribute Coverage**: Translates `<input type="button|submit|reset">` values, `placeholder`, `title`, and `aria-label` attributes with real-time DOM mutation tracking.

3. **Structured Markdown Article Rendering (`ArticleContentRenderer.jsx`)**
   - Used across `HelpView.jsx`, `InAppDocModal.jsx`, `BlogPageView.jsx`, and `TuneLedgerSplitCascadePanel.jsx` (`ROYALTY_GUIDES`).
   - Parses Markdown tables (`| ... |`), callout blockquotes (`> `), subheadings (`### `), numbered lists (`1. `), bulleted checklists (`* [ ] `), and inline `**bold**` (`<strong>`) and `*italic*` (`<em>`) spans into clean, discrete React DOM text nodes so every segment is individually captured and translated by `window.SynergyLocalization`.

4. **Lossless Multi-Way Language Switching (`EN` ↔ `SW` ↔ `KI` ↔ `ES`)**
   - Before any DOM text node or attribute (`placeholder`, `title`) is translated or currency-converted, its original English string is cached in `DOM_ENGLISH_NODES` (`WeakMap`).
   - A companion `DOM_LAST_APPLIED` (`WeakMap`) tracks the exact string last written by the localization engine. When React updates a text node in-place (e.g., hero carousel slide changes, tab switches, dynamic counters), the engine detects `node.nodeValue !== DOM_LAST_APPLIED.get(node)`, refreshes the cached English baseline (using `T_REVERSE` across all language packs if needed), and immediately applies target language translation and currency conversion.
   - Switching back to English (`EN`) or between any languages (`SW` ↔ `ES`, `KI` ↔ `EN`) restores exact strings instantaneously without a page reload.

5. **Zero-Latency Persistence & Cross-Component Synchronization**
   - Preferences are persisted in `localStorage` under both Synergy and TuneMavens keys:
     - `synergy_market`
     - `synergy_currency`
     - `synergy_lang`
     - `tunemaven_region` (`{ country, currency, language }`)
   - Every change dispatches a global `CustomEvent('synergyLocalizationChanged', { detail: { market, currency, language } })` so React contexts (`RegionContext.jsx`), header switchers (`RegionSwitcher.jsx`), and financial calculators (`TuneLedgerSplitCascadePanel.jsx`) stay synchronized in real time.

---

## 3. Supported Markets, Currencies & Languages

### Markets (`MARKETS`)
| ISO Code | Country | Flag | Default Currency | Supported Languages | Primary Launch Region |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `KE` | Kenya | 🇰🇪 | `KES` (`KSh`) | `en`, `sw`, `ki` | **Kenya Launch** |
| `US` | United States | 🇺🇸 | `USD` (`$`) | `en`, `es` | **USA Launch** |
| `TZ` | Tanzania | 🇹🇿 | `TZS` (`TSh`) | `sw`, `en` | East Africa |
| `UG` | Uganda | 🇺🇬 | `UGX` (`USh`) | `sw`, `en` | East Africa |
| `NG` | Nigeria | 🇳🇬 | `NGN` (`₦`) | `en` | West Africa |
| `ZA` | South Africa | 🇿🇦 | `ZAR` (`R`) | `en` | Southern Africa |
| `GB` | United Kingdom | 🇬🇧 | `GBP` (`£`) | `en` | Europe |
| `EU` | European Union | 🇪🇺 | `EUR` (`€`) | `en`, `es` | Europe |

### Currencies (`CURRENCIES`)
| Code | Symbol | Rate (per 1 USD) | Format Example |
| :--- | :---: | :---: | :--- |
| `KES` | `KSh` | `130.0` | `KSh 3,250` |
| `TZS` | `TSh` | `2600.0` | `TSh 65,000` |
| `UGX` | `USh` | `3700.0` | `USh 92,500` |
| `NGN` | `₦` | `1500.0` | `₦ 37,500` |
| `ZAR` | `R` | `18.0` | `R 450` |
| `USD` | `$` | `1.0` | `$25` |
| `GBP` | `£` | `0.80` | `£20.00` |
| `EUR` | `€` | `0.92` | `€23.00` |

### Supported Languages (`SUPPORTED_LANGUAGES`)
| Code | Name | Native Name | Flag | Accent Color | Quick Toggle Badge |
| :---: | :--- | :--- | :---: | :---: | :---: |
| `en` | English | English | 🇬🇧 | `#22d3ee` | `🇬🇧 EN` |
| `sw` | Kiswahili | Kiswahili | 🇰🇪 | `#10b981` | `🇰🇪 SW` |
| `ki` | Kikuyu | Gĩkũyũ | 🇰🇪 | `#f59e0b` | `🇰🇪 KI` |
| `es` | Spanish | Español | 🇺🇸 | `#a855f7` | `🇺🇸 ES` |

---

## 4. Architecture & File Map

| File | Purpose |
| :--- | :--- |
| `apps/portal/public/js/localization.js` | Master Synergy Localization Engine for Portal (Landing, Sidebars, Blog, Help, In-App Docs, EPK, Dashboard Apps) |
| `apps/tunestream/public/js/localization.js` | Master Synergy Localization Engine for TuneStream (5-Slide Hero Carousel, Sidebars, Streaming Console) |
| `apps/syncmavens/public/js/localization.js` | Master Synergy Localization Engine for SyncMavens (Sync Marketplace, Sidebars, Briefs & Quotes) |
| `apps/syncmavens/public/js/localization.js` | Master Synergy Localization Engine for SyncMavens (Sync Marketplace, Sidebars, Briefs & Quotes) |
| `apps/*/index.html` | Loads `/js/localization.js?v=49` prior to `/src/main.jsx` |
| `apps/*/src/RegionContext.jsx` | React Context bridging `window.SynergyLocalization` state (`country`, `currency`, `language`, `changeCountry`, `changeCurrency`, `changeLanguage`, `formatPrice`, `getMergedLanguages()`, `setRegionDefaultLanguage()`, `getRegionDefaultLanguage()`, `getAllRegionDefaults()`) |
| `apps/*/src/RegionSwitcher.jsx` | Unified header selector (Quick 4-way language toggle cycling `EN` → `SW` → `KI` → `ES`, 2x2 modal quick-select grid, Admin Region Default Language manager, and listener for `synergyOpenRegionSwitcher`) |
| `apps/*/src/components/common/LocaleWelcomeBanner.jsx` | First-time visitor onboarding notification: communicates active region, currency, and language, explains customization options, provides 1-click trigger to open `RegionSwitcher`, and persists dismissal to `synergy_locale_welcomed` |
| `apps/portal/src/views/admin/CmsAdminView.jsx` | Multi-market Launch Engine card: GUI for viewing and configuring default platform language per market/country |
| `apps/portal/src/components/common/ArticleContentRenderer.jsx` | Structured Markdown-to-JSX renderer for Help, Blog, In-App Doc Modal, and Royalty Guide articles |
| `apps/portal/src/components/common/InAppDocModal.jsx` | Contextual documentation reader modal with exact article title translation |
| `apps/*/src/components/splits/TuneLedgerSplitCascadePanel.jsx` | Multi-currency Split Cascade Waterfall calculator & `ROYALTY_GUIDES` reader synced with `window.SynergyLocalization` |

---

## 5. Public JavaScript API (`window.SynergyLocalization`)

```javascript
// Query current state
window.SynergyLocalization.getMarket();            // { code: 'KE', name: 'Kenya', currency: 'KES', ... }
window.SynergyLocalization.getCurrency();          // 'KES' or 'USD'
window.SynergyLocalization.getLanguage();          // 'en', 'sw', 'ki', or 'es'
window.SynergyLocalization.getLanguagesList();      // Array of supported language objects
window.SynergyLocalization.getSupportedLanguages(); // Object dictionary of supported languages

// Admin Regional Default Language Engine
window.SynergyLocalization.getRegionDefaultLanguage('KE'); // returns 'sw' (or custom configured default like 'ki')
window.SynergyLocalization.setRegionDefaultLanguage('KE', 'ki'); // persists to 'synergy_market_defaults'
window.SynergyLocalization.getAllRegionDefaults(); // { KE: 'ki', US: 'es', ... }

// Programmatically switch language
window.SynergyLocalization.setLanguage('ki');      // Switch to Gĩkũyũ
window.SynergyLocalization.setLanguage('es');      // Switch to Spanish
window.SynergyLocalization.setLanguage('sw');      // Switch to Kiswahili
window.SynergyLocalization.setLanguage('en');      // Switch to English

// Programmatically switch market or currency
window.SynergyLocalization.setMarket('US');        // Automatically sets default currency to 'USD' and market default language
window.SynergyLocalization.setMarket('KE');        // Automatically sets default currency to 'KES' and market default language
window.SynergyLocalization.setCurrency('USD');

// Open Region & Language Switcher via Global DOM Event
window.dispatchEvent(new CustomEvent('synergyOpenRegionSwitcher'));

// Dynamic Language Registration (Extensibility for future languages)
window.SynergyLocalization.registerLanguage(
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  {
    T: { "Dashboard": "Tableau de bord", "Pricing": "Tarification" },
    WORD_LEXICON: { "music": "musique", "artist": "artiste" }
  }
);

// Translate a string or format currency amounts
window.SynergyLocalization.translateString('Command Center', 'sw'); // -> 'Kituo cha Uongozi'
window.SynergyLocalization.translateString('Pricing', 'ki');        // -> 'Thogora na Mĩbango'
window.SynergyLocalization.translateString('Pricing', 'es');        // -> 'Precios'
window.SynergyLocalization.formatCurrency(3250);                    // Converts KES 3,250 to active currency
window.SynergyLocalization.formatUsdPrice(25);                      // Converts $25 USD to active currency
```

---

## 6. First-Time Visitor Onboarding Notification (`LocaleWelcomeBanner`)

When a new user visits any of the ecosystem applications (`portal`, `tunestream`, `syncmavens`):
1. **Detection & Greeting**:
   - Reads active market, currency, and language (e.g. Kenya 🇰🇪 · `KSh` / `KES` · Kiswahili `SW`).
   - If the user has not dismissed the notice (`localStorage.getItem('synergy_locale_welcomed') !== 'true'`), the floating glassmorphism banner slides in above the bottom navigation or content viewport.
2. **Contextual Explanation**:
   - Explains that the platform has automatically set regional defaults for optimum pricing, payment methods (such as M-Pesa), and local language.
   - Points the user to the header globe badge where currency and language can be customized at any time.
   - Text is natively translated across English, Kiswahili, Kikuyu, and Spanish.
3. **Actions**:
   - **"Customize Region & Language"**: Immediately triggers `window.dispatchEvent(new CustomEvent('synergyOpenRegionSwitcher'))`, opening the modal switcher without requiring page navigation.
   - **"Got it / Dismiss"**: Marks `synergy_locale_welcomed` in `localStorage` so the banner never intrudes again on future visits.

---

## 7. Maintenance & Validation Protocol

Whenever updating language dictionaries in `localization.js`:
1. Ensure all three application copies (`apps/portal/public/js/localization.js`, `apps/tunestream/public/js/localization.js`, and `apps/syncmavens/public/js/localization.js`) remain identical and bump the `?v=` cache-buster in `apps/*/index.html`.
2. Run syntax validation before committing:
   ```powershell
   node --check apps/portal/public/js/localization.js
   node --check apps/tunestream/public/js/localization.js
   node --check apps/syncmavens/public/js/localization.js
   ```

