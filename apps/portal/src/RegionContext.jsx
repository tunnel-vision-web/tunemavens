import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const RegionContext = createContext(null);
export const useRegion = () => useContext(RegionContext);

const STORAGE_KEY = 'tunemaven_region';

const COUNTRIES_LIST = [
  { code: 'KE', name: 'Kenya', currency: 'KES', lang: 'en' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', lang: 'en' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', lang: 'en' },
  { code: 'US', name: 'United States', currency: 'USD', lang: 'en' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', lang: 'en' },
  { code: 'UG', name: 'Uganda', currency: 'UGX', lang: 'en' },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', lang: 'sw' }
];

const CURRENCIES_MAP = {
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  UGX: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
  TZS: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' }
};

const EXCHANGE_RATES = {
  USD: 1,
  KES: 130,
  NGN: 1500,
  ZAR: 18,
  GBP: 0.8,
  UGX: 3700,
  TZS: 2600
};

const LANGUAGES_LIST = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'fr', name: 'French', native: 'Français' }
];

export function RegionProvider({ children }) {
  const [country, setCountry] = useState('US');
  const [countryName, setCountryName] = useState('United States');
  const [currency, setCurrency] = useState('USD');
  const [currencyInfo, setCurrencyInfo] = useState({ code: 'USD', symbol: '$', name: 'US Dollar' });
  const [language, setLanguage] = useState('en');

  // Load initial settings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.country) {
          setCountry(parsed.country);
          const cObj = COUNTRIES_LIST.find(c => c.code === parsed.country);
          if (cObj) setCountryName(cObj.name);
        }
        if (parsed.currency) {
          setCurrency(parsed.currency);
          setCurrencyInfo(CURRENCIES_MAP[parsed.currency] || CURRENCIES_MAP['USD']);
        }
        if (parsed.language) {
          setLanguage(parsed.language);
        }
        return;
      } catch (e) {
        // Fallback to detection
      }
    }

    // IP Geolocation or timezone lookup
    const detectLocation = async () => {
      let detectedCC = 'US';
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data && data.country_code) {
            const cc = data.country_code.toUpperCase();
            if (COUNTRIES_LIST.some(c => c.code === cc)) {
              detectedCC = cc;
            }
          }
        }
      } catch (err) {
        // Fallback to timezone
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz) {
            const tzL = tz.toLowerCase();
            if (tzL.includes('nairobi')) detectedCC = 'KE';
            else if (tzL.includes('lagos')) detectedCC = 'NG';
            else if (tzL.includes('johannesburg')) detectedCC = 'ZA';
            else if (tzL.includes('london')) detectedCC = 'GB';
            else if (tzL.includes('kampala')) detectedCC = 'UG';
            else if (tzL.includes('dar_es_salaam')) detectedCC = 'TZ';
          }
        } catch (e) { /* ignore */ }
      }

      const cObj = COUNTRIES_LIST.find(c => c.code === detectedCC) || COUNTRIES_LIST[0];
      setCountry(cObj.code);
      setCountryName(cObj.name);
      setCurrency(cObj.currency);
      setCurrencyInfo(CURRENCIES_MAP[cObj.currency]);
      setLanguage(cObj.lang);
    };

    detectLocation();
  }, []);

  const changeCountry = useCallback((code) => {
    const cObj = COUNTRIES_LIST.find(c => c.code === code);
    if (cObj) {
      setCountry(cObj.code);
      setCountryName(cObj.name);
      setCurrency(cObj.currency);
      setCurrencyInfo(CURRENCIES_MAP[cObj.currency]);
      setLanguage(cObj.lang);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        country: cObj.code,
        currency: cObj.currency,
        language: cObj.lang
      }));
    }
  }, []);

  const changeCurrency = useCallback((code) => {
    const curInfo = CURRENCIES_MAP[code];
    if (curInfo) {
      setCurrency(code);
      setCurrencyInfo(curInfo);
      const saved = localStorage.getItem(STORAGE_KEY);
      let parsed = {};
      if (saved) {
        try { parsed = JSON.parse(saved); } catch(e) {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...parsed,
        currency: code
      }));
    }
  }, []);

  const changeLanguage = useCallback((code) => {
    setLanguage(code);
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch(e) {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...parsed,
      language: code
    }));
  }, []);

  const formatPrice = useCallback((usdAmount) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const rawValue = usdAmount * rate;
    
    let finalValue;
    if (currency === 'USD' || currency === 'GBP') {
      finalValue = Math.round(rawValue);
    } else if (currency === 'ZAR') {
      finalValue = Math.round(rawValue / 10) * 10;
    } else {
      finalValue = Math.round(rawValue / 100) * 100;
    }
    
    const symbol = currencyInfo?.symbol || '$';
    // Free tier stays clean; everything paid gets the .99 charm-price suffix.
    const suffix = usdAmount > 0 ? '.99' : '';
    return `${symbol}${finalValue.toLocaleString()}${suffix}`;
  }, [currency, currencyInfo]);

  return (
    <RegionContext.Provider value={{
      country,
      countryName,
      currency,
      currencyInfo,
      language,
      languages: LANGUAGES_LIST,
      options: {
        countries: COUNTRIES_LIST,
        currencies: Object.values(CURRENCIES_MAP),
        languages: LANGUAGES_LIST
      },
      changeCountry,
      changeCurrency,
      changeLanguage,
      formatPrice
    }}>
      {children}
    </RegionContext.Provider>
  );
}
