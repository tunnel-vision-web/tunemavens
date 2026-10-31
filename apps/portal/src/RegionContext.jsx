import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export const LANGUAGES_LIST = [
  { code: 'en', short: 'EN', name: 'English', native: 'English', flag: '🇬🇧', market: 'US', accent: '#22d3ee', textDark: '#060813' },
  { code: 'sw', short: 'SW', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', market: 'KE', accent: '#10b981', textDark: '#042f2e' },
  { code: 'ki', short: 'KI', name: 'Kikuyu', native: 'Gĩkũyũ', flag: '🇰🇪', market: 'KE', accent: '#f59e0b', textDark: '#1c1917' },
  { code: 'es', short: 'ES', name: 'Spanish', native: 'Español', flag: '🇺🇸', market: 'US', accent: '#a855f7', textDark: '#ffffff' }
];

export const REGIONAL_MESSAGING = {
  KE: {
    badge: 'African Artists · Global Reach',
    headline1: 'Feel the crowd.',
    headline2: 'Anywhere on earth.',
    painPointQuestion: 'Exhausted by unfair royalties, expensive data, and delayed foreign payouts?',
    painPointAnswer: 'TuneStream brings 8GB offline caching so you never burn metered data on commutes. Instant M-Pesa mobile money tipping flows directly to creators with zero monthly subscription traps.',
    sub: 'From Lagos to London, Nairobi to New York — stream the full depth of African music culture with built-in creator tipping and direct support.',
    localCurrencyText: 'Micro-top ups via instant M-Pesa STK Push. Zero monthly fee.',
    regionLabel: 'Africa & Diaspora'
  },
  NG: {
    badge: 'African Artists · Global Reach',
    headline1: 'Feel the crowd.',
    headline2: 'Sovereign African Sound.',
    painPointQuestion: 'Tired of dollar cards failing and foreign platforms paying fractions of a kobo?',
    painPointAnswer: 'Direct creator payouts into local accounts. Zero monthly subscription fees, 8GB offline caching, and instant mid-track tipping for Naija and global creators.',
    sub: 'From Lagos to London, Accra to Atlanta — stream pure African and diaspora master tracks with direct-to-wallet tipping.',
    localCurrencyText: 'Non-expiring credits in NGN. No subscriptions ever.',
    regionLabel: 'West Africa'
  },
  ZA: {
    badge: 'African Artists · Global Reach',
    headline1: 'Feel the crowd.',
    headline2: 'Amapiano to the World.',
    painPointQuestion: 'Paying high monthly subscription rates for crushed audio quality?',
    painPointAnswer: 'Stream uncompressed 24-bit studio FLAC. 8GB offline caching for metered loadshedding hours, zero monthly fees, and transparent creator splits.',
    sub: 'From Johannesburg to the world — stream the deepest Amapiano and Afro-House rhythms with direct artist support.',
    localCurrencyText: 'Top up with ZAR. Zero subscriptions ever.',
    regionLabel: 'Southern Africa'
  },
  US: {
    badge: 'Global Sound · Zero Subscriptions',
    headline1: 'Skip the monthly drain.',
    headline2: 'Direct creator streaming.',
    painPointQuestion: 'Tired of paying $11–$17 every month for subscriptions where 80% goes to corporate middlemen?',
    painPointAnswer: 'TuneStream has no subscriptions ever. Top up non-expiring credits only when you want them. Stream lossless 24-bit FLAC audio, and send tips mid-listen where 100% of your support reaches independent creators within 24 hours.',
    sub: 'Discover authentic independent global sounds and African music culture directly from the artists who make it. No contracts, no subscription lock-in.',
    localCurrencyText: 'Pay-as-you-go TM Credits from $4.99. Never expires.',
    regionLabel: 'North America'
  },
  ES: {
    badge: 'Música Global · Cero Suscripciones',
    headline1: 'Siente la música.',
    headline2: 'Sin ataduras mensuales.',
    painPointQuestion: '¿Cansado de tarifas mensuales en dólares y plataformas que pagan centavos a los artistas?',
    painPointAnswer: 'En TuneStream no hay suscripciones mensuales jamás. Recargas micro-créditos sin vencimiento, disfrutas audio FLAC de 24 bits y apoyas directamente a los creadores de todo el sur global y la diáspora.',
    sub: 'Desde el Caribe hasta los Andes, ritmos afro-latinos y sonidos auténticos sin intermediarios ni cobros recurrentes sorpresa.',
    localCurrencyText: 'Micro-recargas sin suscripción fija. Calidad de estudio.',
    regionLabel: 'Latinoamérica y España'
  },
  GB: {
    badge: 'Ethical Audio · Sovereign Splits',
    headline1: 'Fair creator payouts.',
    headline2: 'Zero monthly lock-in.',
    painPointQuestion: 'Frustrated by opaque corporate streaming monopolies and exploitative streaming royalty cuts?',
    painPointAnswer: 'TuneStream operates on transparent Split Cascade ledgers. Support independent UK and African diaspora artists directly with non-expiring credits and zero monthly subscriptions.',
    sub: 'From London to Lagos — explore high-fidelity lossless masters with verified split sheets and transparent creator compensation.',
    localCurrencyText: 'Non-expiring TM Credits in GBP. No monthly contracts.',
    regionLabel: 'United Kingdom'
  },
  EU: {
    badge: 'Independent Sound · Transparent Rights',
    headline1: 'Pure studio audio.',
    headline2: 'No recurring bills.',
    painPointQuestion: 'Looking for an ethical streaming platform with true independent artist equity?',
    painPointAnswer: 'No monthly subscriptions ever. Purchase non-expiring TM Credits, stream lossless FLAC studio masters, and know exactly how much reaches each creator on every track.',
    sub: 'European and global music enthusiasts connecting directly with sovereign creators across continents.',
    localCurrencyText: 'Non-expiring TM Credits in EUR. Zero subscription traps.',
    regionLabel: 'European Union'
  }
};

export function getRegionalMessaging(countryCode = 'KE', langCode = 'en') {
  if (langCode === 'es') return REGIONAL_MESSAGING.ES;
  const match = REGIONAL_MESSAGING[countryCode] || REGIONAL_MESSAGING.KE;
  return match;
}

const RegionContext = createContext(null);
export const useRegion = () => useContext(RegionContext) || {
  country: 'KE',
  countryName: 'Kenya',
  countryFlag: '🇰🇪',
  region: 'east-africa',
  currency: 'KES',
  currencyInfo: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  language: 'sw',
  languages: LANGUAGES_LIST,
  regionalMessaging: REGIONAL_MESSAGING.KE,
  getRegionalMessaging,
  options: { countries: [], currencies: [], languages: LANGUAGES_LIST },
  changeCountry: () => {},
  changeCurrency: () => {},
  changeLanguage: () => {},
  setRegionDefaultLanguage: () => {},
  getRegionDefaultLanguage: () => 'en',
  formatPrice: (v) => `KSh ${Math.round((v || 0) * 130).toLocaleString()}`,
  convertPrice: (v) => Math.round((v || 0) * 130),
  t: (s) => s
};

const STORAGE_KEY = 'tunemaven_region';

export const COUNTRIES_LIST = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', lang: 'sw', supportedLangs: ['en', 'sw', 'ki'] },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', lang: 'en', supportedLangs: ['en', 'es'] },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', lang: 'sw', supportedLangs: ['en', 'sw'] },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', lang: 'sw', supportedLangs: ['en', 'sw'] },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', lang: 'en', supportedLangs: ['en'] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', lang: 'en', supportedLangs: ['en'] },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', lang: 'en', supportedLangs: ['en'] },
  { code: 'EU', name: 'European Union', flag: '🇪🇺', currency: 'EUR', lang: 'en', supportedLangs: ['en', 'es'] }
];

export const CURRENCIES_MAP = {
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' }
};

export const EXCHANGE_RATES = {
  USD: 1,
  KES: 130,
  TZS: 2600,
  UGX: 3700,
  NGN: 1500,
  ZAR: 18,
  GBP: 0.8,
  EUR: 0.92
};



function getMergedLanguages() {
  const dynList = (typeof window !== 'undefined' && window.SynergyLocalization && typeof window.SynergyLocalization.getLanguagesList === 'function')
    ? window.SynergyLocalization.getLanguagesList()
    : null;
  if (!Array.isArray(dynList) || dynList.length === 0) return LANGUAGES_LIST;
  const map = new Map();
  LANGUAGES_LIST.forEach(l => map.set(l.code, l));
  dynList.forEach(l => {
    if (l && l.code) {
      map.set(l.code, { ...(map.get(l.code) || {}), ...l });
    }
  });
  return Array.from(map.values());
}

function isSupportedLanguageCode(code) {
  if (!code) return false;
  return getMergedLanguages().some(l => l.code === code);
}

function getInitialLocaleState() {
  let country = 'KE';
  let currency = 'KES';
  let language = 'sw';

  try {
    const synMarket = localStorage.getItem('synergy_market');
    const synLang = localStorage.getItem('synergy_lang');
    const synCurr = localStorage.getItem('synergy_currency');
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.country && COUNTRIES_LIST.some(c => c.code === parsed.country)) {
        country = parsed.country;
      }
      if (parsed.currency && CURRENCIES_MAP[parsed.currency]) {
        currency = parsed.currency;
      }
      if (parsed.language && isSupportedLanguageCode(parsed.language)) {
        language = parsed.language;
      }
    }

    if (synMarket && COUNTRIES_LIST.some(c => c.code === synMarket)) {
      country = synMarket;
    }
    if (synCurr && CURRENCIES_MAP[synCurr]) {
      currency = synCurr;
    }
    if (isSupportedLanguageCode(synLang)) {
      language = synLang;
    } else if (typeof window !== 'undefined' && window.SynergyLocalization && typeof window.SynergyLocalization.getRegionDefaultLanguage === 'function') {
      language = window.SynergyLocalization.getRegionDefaultLanguage(country) || language;
    }
  } catch (_) {}

  const cObj = COUNTRIES_LIST.find(c => c.code === country) || COUNTRIES_LIST[0];
  const curObj = CURRENCIES_MAP[currency] || CURRENCIES_MAP.KES;

  return {
    country: cObj.code,
    countryName: cObj.name,
    countryFlag: cObj.flag,
    currency: curObj.code,
    currencyInfo: curObj,
    language
  };
}

export function RegionProvider({ children }) {
  const initial = getInitialLocaleState();
  const [country, setCountry] = useState(initial.country);
  const [countryName, setCountryName] = useState(initial.countryName);
  const [countryFlag, setCountryFlag] = useState(initial.countryFlag);
  const [currency, setCurrency] = useState(initial.currency);
  const [currencyInfo, setCurrencyInfo] = useState(initial.currencyInfo);
  const [language, setLanguage] = useState(initial.language);

  const availableLanguages = useMemo(() => getMergedLanguages(), [language]);

  // Sync with SynergyLocalization custom events
  useEffect(() => {
    const handleSynergyChange = (e) => {
      const detail = e.detail || {};
      if (detail.market && detail.market.code) {
        const cObj = COUNTRIES_LIST.find(c => c.code === detail.market.code);
        if (cObj) {
          setCountry(cObj.code);
          setCountryName(cObj.name);
          setCountryFlag(cObj.flag);
        }
      }
      if (detail.currency && CURRENCIES_MAP[detail.currency]) {
        setCurrency(detail.currency);
        setCurrencyInfo(CURRENCIES_MAP[detail.currency]);
      }
      if (isSupportedLanguageCode(detail.lang)) {
        setLanguage(detail.lang);
      }
    };

    const handleDefaultChange = (e) => {
      const detail = e.detail || {};
      if (detail.marketCode === country && detail.defaultLang && isSupportedLanguageCode(detail.defaultLang)) {
        setLanguage(detail.defaultLang);
      }
    };

    window.addEventListener('synergyLocalizationChanged', handleSynergyChange);
    window.addEventListener('synergyMarketDefaultChanged', handleDefaultChange);
    return () => {
      window.removeEventListener('synergyLocalizationChanged', handleSynergyChange);
      window.removeEventListener('synergyMarketDefaultChanged', handleDefaultChange);
    };
  }, [country]);

  // Trigger DOM localization pass whenever country, currency, or language updates
  useEffect(() => {
    if (window.SynergyLocalization && typeof window.SynergyLocalization.applyLocalization === 'function') {
      requestAnimationFrame(() => {
        window.SynergyLocalization.applyLocalization();
      });
    }
  }, [country, currency, language]);

  const changeCountry = useCallback((code, preserveLang = false) => {
    const cObj = COUNTRIES_LIST.find(c => c.code === code);
    if (cObj) {
      setCountry(cObj.code);
      setCountryName(cObj.name);
      setCountryFlag(cObj.flag);
      setCurrency(cObj.currency);
      setCurrencyInfo(CURRENCIES_MAP[cObj.currency]);

      let targetLang = language;
      if (!preserveLang) {
        const adminDefault = (window.SynergyLocalization && typeof window.SynergyLocalization.getRegionDefaultLanguage === 'function')
          ? window.SynergyLocalization.getRegionDefaultLanguage(cObj.code)
          : cObj.lang;
        if (adminDefault && isSupportedLanguageCode(adminDefault)) {
          targetLang = adminDefault;
          setLanguage(targetLang);
        }
      }

      try {
        localStorage.setItem('synergy_market', cObj.code);
        localStorage.setItem('synergy_currency', cObj.currency);
        localStorage.setItem('synergy_lang', targetLang);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          country: cObj.code,
          currency: cObj.currency,
          language: targetLang
        }));
      } catch (_) {}

      if (window.SynergyLocalization && typeof window.SynergyLocalization.setMarket === 'function') {
        window.SynergyLocalization.setMarket(cObj.code, preserveLang);
      }
    }
  }, [language]);

  const changeCurrency = useCallback((code) => {
    const curInfo = CURRENCIES_MAP[code];
    if (curInfo) {
      setCurrency(code);
      setCurrencyInfo(curInfo);
      try {
        localStorage.setItem('synergy_currency', code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          country,
          currency: code,
          language
        }));
      } catch (_) {}

      if (window.SynergyLocalization && typeof window.SynergyLocalization.setCurrency === 'function') {
        window.SynergyLocalization.setCurrency(code);
      }
    }
  }, [country, language]);

  const changeLanguage = useCallback((code) => {
    if (!isSupportedLanguageCode(code)) return;
    setLanguage(code);
    try {
      localStorage.setItem('synergy_lang', code);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        country,
        currency,
        language: code
      }));
    } catch (_) {}

    if (window.SynergyLocalization && typeof window.SynergyLocalization.setLanguage === 'function') {
      window.SynergyLocalization.setLanguage(code);
    }
  }, [country, currency]);

  const setRegionDefaultLanguage = useCallback((marketCode, langCode) => {
    if (window.SynergyLocalization && typeof window.SynergyLocalization.setRegionDefaultLanguage === 'function') {
      window.SynergyLocalization.setRegionDefaultLanguage(marketCode, langCode);
      if (country === marketCode) {
        setLanguage(langCode);
      }
    }
  }, [country]);

  const getRegionDefaultLanguage = useCallback((marketCode) => {
    if (window.SynergyLocalization && typeof window.SynergyLocalization.getRegionDefaultLanguage === 'function') {
      return window.SynergyLocalization.getRegionDefaultLanguage(marketCode);
    }
    const cObj = COUNTRIES_LIST.find(c => c.code === marketCode);
    return cObj ? cObj.lang : 'en';
  }, []);

  const convertPrice = useCallback((usdAmount) => {
    const rate = EXCHANGE_RATES[currency] || 130;
    return Math.round(usdAmount * rate);
  }, [currency]);

  const formatPrice = useCallback((usdAmount) => {
    const converted = convertPrice(usdAmount);
    const sym = currencyInfo?.symbol || '$';
    return `${sym} ${converted.toLocaleString()}`;
  }, [convertPrice, currencyInfo]);

  const t = useCallback((text) => {
    if (window.SynergyLocalization && typeof window.SynergyLocalization.translateString === 'function') {
      return window.SynergyLocalization.translateString(text, language);
    }
    return text;
  }, [language]);

  const region = (country === 'KE' || country === 'TZ' || country === 'UG') ? 'east-africa' : 'west';
  const regionalMessaging = useMemo(() => getRegionalMessaging(country, language), [country, language]);

  return (
    <RegionContext.Provider value={{
      country,
      countryName,
      countryFlag,
      region,
      currency,
      currencyInfo,
      language,
      languages: availableLanguages,
      regionalMessaging,
      getRegionalMessaging,
      options: {
        countries: COUNTRIES_LIST,
        currencies: Object.values(CURRENCIES_MAP),
        languages: availableLanguages
      },
      changeCountry,
      changeCurrency,
      changeLanguage,
      setRegionDefaultLanguage,
      getRegionDefaultLanguage,
      formatPrice,
      convertPrice,
      t
    }}>
      {children}
    </RegionContext.Provider>
  );
}
