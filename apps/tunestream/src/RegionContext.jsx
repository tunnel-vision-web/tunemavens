import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export const LANGUAGES_LIST = [
  { code: 'en', short: 'EN', name: 'English', native: 'English', flag: '🇬🇧', market: 'US', accent: '#22d3ee', textDark: '#060813' },
  { code: 'sw', short: 'SW', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', market: 'KE', accent: '#10b981', textDark: '#042f2e' },
  { code: 'ki', short: 'KI', name: 'Kikuyu', native: 'Gĩkũyũ', flag: '🇰🇪', market: 'KE', accent: '#f59e0b', textDark: '#1c1917' },
  { code: 'es', short: 'ES', name: 'Spanish', native: 'Español', flag: '🇺🇸', market: 'US', accent: '#a855f7', textDark: '#ffffff' }
];

const RegionContext = createContext(null);
export const useRegion = () => useContext(RegionContext) || {
  country: 'KE',
  countryName: 'Kenya',
  countryFlag: '🇰🇪',
  region: 'east-africa',
  currency: 'KES',
  currencyInfo: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  language: 'en',
  languages: LANGUAGES_LIST,
  options: { countries: [], currencies: [], languages: LANGUAGES_LIST },
  changeCountry: () => {},
  changeCurrency: () => {},
  changeLanguage: () => {},
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
  let language = 'en';

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

    window.addEventListener('synergyLocalizationChanged', handleSynergyChange);
    return () => window.removeEventListener('synergyLocalizationChanged', handleSynergyChange);
  }, []);

  useEffect(() => {
    if (window.SynergyLocalization && typeof window.SynergyLocalization.applyLocalization === 'function') {
      requestAnimationFrame(() => {
        window.SynergyLocalization.applyLocalization();
      });
    }
  }, [country, currency, language]);

  const changeCountry = useCallback((code) => {
    const cObj = COUNTRIES_LIST.find(c => c.code === code);
    if (cObj) {
      setCountry(cObj.code);
      setCountryName(cObj.name);
      setCountryFlag(cObj.flag);
      setCurrency(cObj.currency);
      setCurrencyInfo(CURRENCIES_MAP[cObj.currency]);

      try {
        localStorage.setItem('synergy_market', cObj.code);
        localStorage.setItem('synergy_currency', cObj.currency);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          country: cObj.code,
          currency: cObj.currency,
          language
        }));
      } catch (_) {}

      if (window.SynergyLocalization && typeof window.SynergyLocalization.setMarket === 'function') {
        window.SynergyLocalization.setMarket(cObj.code);
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

  const convertPrice = useCallback((usdAmount) => {
    const rate = EXCHANGE_RATES[currency] || 130;
    const rawValue = (usdAmount || 0) * rate;
    if (currency === 'USD' || currency === 'GBP' || currency === 'EUR') {
      return Math.round(rawValue * 100) / 100;
    }
    if (currency === 'ZAR') return Math.round(rawValue / 10) * 10;
    if (rawValue > 0 && rawValue < 100) return Math.round(rawValue);
    return Math.round(rawValue / 100) * 100;
  }, [currency]);

  const formatPrice = useCallback((usdAmount) => {
    const finalValue = convertPrice(usdAmount);
    const symbol = currencyInfo?.symbol || 'KSh';
    if (currency === 'USD' || currency === 'GBP' || currency === 'EUR') {
      const suffix = usdAmount > 0 && Number.isInteger(finalValue) ? '.99' : '';
      return `${symbol}${finalValue.toLocaleString()}${suffix}`;
    }
    return `${symbol} ${finalValue.toLocaleString()}`;
  }, [convertPrice, currency, currencyInfo]);

  const t = useCallback((str) => {
    if (!str) return str;
    if (window.SynergyLocalization && typeof window.SynergyLocalization.translateString === 'function') {
      return window.SynergyLocalization.translateString(str, language);
    }
    return str;
  }, [language]);

  const region = ['US', 'GB', 'EU'].includes(country) ? 'western' : 'east-africa';

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
      options: {
        countries: COUNTRIES_LIST,
        currencies: Object.values(CURRENCIES_MAP),
        languages: availableLanguages
      },
      changeCountry,
      changeCurrency,
      changeLanguage,
      formatPrice,
      convertPrice,
      t
    }}>
      {children}
    </RegionContext.Provider>
  );
}
