# TuneMavens — Localization & Market Adaptation Architecture Guide

## 1. Executive Overview

TuneMavens uses the **Synergy Client-Side DOM Localization & Multi-Currency Adaptation Engine** (`window.SynergyLocalization`, version `v=47`) across all three standalone web applications in the monorepo:
- **Portal (`apps/portal`, port 3000)**: Landing pages, Blog & Help Center articles, In-App Documentation Modal (`InAppDocModal.jsx`), Creator EPK Web Worlds, Label Roster, Mother-CMS Studio, Smart CRM, Affiliates, MyContracts, and TuneLedger Split Cascade Studio (`ROYALTY_GUIDES`).
- **TuneStream (`apps/tunestream`, port 3001)**: Consumer lossless streaming portal, 5-slide auto-advancing hero carousel (synchronized with the main Portal landing page), fan tipping, stem unlocking, and artist discovery.
- **SyncMavens (`apps/syncmavens`, port 3002)**: Pre-cleared audiovisual sync licensing marketplace, supervisor brief management, and dynamic waterfall quote calculator.

### Kenya Launch Defaults
- **Default Market (`synergy_market`)**: `KE` (Kenya 🇰🇪)
- **Default Currency (`synergy_currency`)**: `KES` (`KSh`, rate `130.0` per `1 USD`)
- **Supported Languages (`synergy_lang`)**:
  - `en` — English (`EN`)
  - `sw` — Kiswahili (`SW`)

---

## 2. Core Design Principles & 3-Tier Translation Pipeline

1. **Single Source of Truth in HTML/JSX (English + USD Base)**
   - All React components, landing pages, sidebars, articles, modals, and dashboard applications are authored in canonical English (`en`) and base US Dollars (`$`) or Kenyan Shillings (`KES`).
   - There are no duplicated `/sw/` route trees or separate per-component language JSON files to maintain.

2. **3-Tier Kiswahili Translation Architecture (`translateStringToSwahili` / `translateSingleLineToSwahili`)**
   - **Multiline Decomposition**: Strings containing `\n` are automatically split line-by-line when not matched as a full block, ensuring multi-paragraph strings and tooltip descriptions translate cleanly.
   - **Tier 1A — Exact Phrase Dictionary (`T`)**: Over 1,600 curated full-sentence, heading, button, sidebar, tooltip, and article paragraph translations.
   - **Tier 1B — Punctuation, List-Numbering & Hashtag Stripping**: Automatically strips leading list markers (`1. `, `• `, `— `, `☐ `, `#`), translates the core phrase via `T`, and restores the exact leading/trailing punctuation or `#` tag prefix (e.g., `#Recoupment` → `#Urejeshaji Gharama`).
   - **Tier 2 — Longest-First Multi-Word Phrase Matching (`MULTI_WORD_KEYS`)**: Replaces multi-word domain phrases (sorted by descending length so longer phrases always take precedence over shorter substrings).
   - **Pre-Tier 3 — Contraction & English Article Normalization**: Normalizes English contractions (`don't`, `doesn't`, `can't`, `haven't`, `it's`, `you're`, etc.), possessives (`'s`), and standalone English articles (`the`, `a`, `an`) while preserving sentence-initial capitalization.
   - **Tier 3 — Case-Preserving Word-Boundary Lexicon (`WORD_LEXICON` & `WORD_REGEX`)**: Over 2,800 domain and general vocabulary words applied with strict `\b` word boundaries and `matchCase()` (`UPPERCASE`, `Title Case`, `lowercase`) so single words never corrupt Kiswahili substrings.

3. **Structured Markdown Article Rendering (`ArticleContentRenderer.jsx`)**
   - Used across `HelpView.jsx`, `InAppDocModal.jsx`, `BlogPageView.jsx`, and `TuneLedgerSplitCascadePanel.jsx` (`ROYALTY_GUIDES`).
   - Parses Markdown tables (`| ... |`), callout blockquotes (`> `), subheadings (`### `), numbered lists (`1. `), bulleted checklists (`* [ ] `), and inline `**bold**` (`<strong>`) and `*italic*` (`<em>`) spans into clean, discrete React DOM text nodes so every segment is individually captured and translated by `window.SynergyLocalization`.

4. **Lossless Bidirectional Switching (`EN` ↔ `SW` & Multi-Currency)**
   - Before any DOM text node or attribute (`placeholder`, `title`, `aria-label`) is translated or currency-converted, its original English string is cached in `DOM_ENGLISH_NODES` (`WeakMap`).
   - A companion `DOM_LAST_APPLIED` (`WeakMap`) tracks the exact string last written by the localization engine. When React updates a text node in-place (e.g., hero carousel slide changes, tab switches, or dynamic counters), the engine detects `node.nodeValue !== DOM_LAST_APPLIED.get(node)`, refreshes the cached English baseline (using `T_REVERSE` if needed), and immediately applies Kiswahili translation and currency conversion.
   - Switching back to English (`EN`) or `USD ($)` restores the exact original strings instantaneously without a page reload.

5. **Zero-Latency Persistence & Cross-Component Synchronization**
   - Preferences are persisted in `localStorage` under both Synergy and TuneMavens keys:
     - `synergy_market`
     - `synergy_currency`
     - `synergy_lang`
     - `tunemaven_region` (`{ country, currency, language }`)
   - Every change dispatches a global `CustomEvent('synergyLocalizationChanged', { detail: { market, currency, language } })` so React contexts (`RegionContext.jsx`), header switchers (`RegionSwitcher.jsx`), and financial calculators (`TuneLedgerSplitCascadePanel.jsx`) stay synchronized in real time.

---

## 3. Supported Markets & Currencies

### Markets (`MARKETS`)
| ISO Code | Country | Flag | Default Currency | Supported Languages |
| :--- | :--- | :---: | :---: | :---: |
| `KE` | Kenya *(Launch Default)* | 🇰🇪 | `KES` (`KSh`) | `en`, `sw` |
| `TZ` | Tanzania | 🇹🇿 | `TZS` (`TSh`) | `sw`, `en` |
| `UG` | Uganda | 🇺🇬 | `UGX` (`USh`) | `en`, `sw` |
| `NG` | Nigeria | 🇳🇬 | `NGN` (`₦`) | `en` |
| `ZA` | South Africa | 🇿🇦 | `ZAR` (`R`) | `en` |
| `US` | United States | 🇺🇸 | `USD` (`$`) | `en` |
| `GB` | United Kingdom | 🇬🇧 | `GBP` (`£`) | `en` |
| `EU` | European Union | 🇪🇺 | `EUR` (`€`) | `en` |

### Currencies (`CURRENCIES`)
| Code | Symbol | Rate (per 1 USD) | Format Example |
| :--- | :---: | :---: | :--- |
| `KES` | `KSh` | `130.0` | `KSh 3,250` |
| `TZS` | `TSh` | `2550.0` | `TSh 63,750` |
| `UGX` | `USh` | `3700.0` | `USh 92,500` |
| `NGN` | `₦` | `1550.0` | `₦ 38,750` |
| `ZAR` | `R` | `18.5` | `R 463` |
| `USD` | `$` | `1.0` | `$25` |
| `GBP` | `£` | `0.79` | `£19.75` |
| `EUR` | `€` | `0.92` | `€23` |

---

## 4. Architecture & File Map

| File | Purpose |
| :--- | :--- |
| `apps/portal/public/js/localization.js` | Master Synergy Localization Engine for Portal (Landing, Sidebars, Blog, Help, In-App Docs, EPK, Dashboard Apps) |
| `apps/tunestream/public/js/localization.js` | Master Synergy Localization Engine for TuneStream (5-Slide Hero Carousel, Sidebars, Streaming Console) |
| `apps/syncmavens/public/js/localization.js` | Master Synergy Localization Engine for SyncMavens (Sync Marketplace, Sidebars, Briefs & Quotes) |
| `apps/*/index.html` | Loads `/js/localization.js?v=47` prior to `/src/main.jsx` |
| `apps/*/src/RegionContext.jsx` | React Context bridging `window.SynergyLocalization` state (`country`, `currency`, `language`, `setCountry`, `setCurrency`, `setLanguage`, `formatPrice`) |
| `apps/*/src/RegionSwitcher.jsx` | Unified header selector (`Market/Country`, `Currency`, and `EN \| SW` language toggle) |
| `apps/portal/src/components/common/ArticleContentRenderer.jsx` | Structured Markdown-to-JSX renderer for Help, Blog, In-App Doc Modal, and Royalty Guide articles |
| `apps/portal/src/components/common/InAppDocModal.jsx` | Contextual documentation reader modal with CSS-truncated article pills for exact title translation |
| `apps/*/src/components/splits/TuneLedgerSplitCascadePanel.jsx` | Multi-currency Split Cascade Waterfall calculator & `ROYALTY_GUIDES` reader synced with `window.SynergyLocalization` |

---

## 5. Public JavaScript API (`window.SynergyLocalization`)

```javascript
// Get current state
window.SynergyLocalization.getMarket();     // Returns market object, e.g. { code: 'KE', name: 'Kenya', currency: 'KES', ... }
window.SynergyLocalization.getCurrency();   // e.g. 'KES'
window.SynergyLocalization.getLanguage();   // e.g. 'en' or 'sw'

// Programmatically switch language ('en' | 'sw')
window.SynergyLocalization.setLanguage('sw');

// Programmatically switch market or currency
window.SynergyLocalization.setMarket('KE'); // Automatically sets currency to 'KES'
window.SynergyLocalization.setCurrency('KES');

// Translate a string or format currency amounts
window.SynergyLocalization.translateString('Command Center', 'sw'); // -> 'Kituo cha Uongozi'
window.SynergyLocalization.formatCurrency(3250);                    // Converts KES 3,250 to active currency
window.SynergyLocalization.formatUsdPrice(25);                      // Converts $25 USD to active currency
```

---

## 6. Maintenance & Validation Protocol

Whenever adding new phrases to `T` or words to `WORD_LEXICON` in `localization.js`:
1. Ensure all three application copies (`apps/portal/public/js/localization.js`, `apps/tunestream/public/js/localization.js`, and `apps/syncmavens/public/js/localization.js`) remain identical and bump the `?v=` cache-buster in `apps/*/index.html`.
2. Run syntax validation before committing:
   ```powershell
   node --check apps/portal/public/js/localization.js
   node --check apps/tunestream/public/js/localization.js
   node --check apps/syncmavens/public/js/localization.js
   ```
