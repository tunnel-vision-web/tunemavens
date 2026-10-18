import React, { useState, useRef, useEffect } from 'react';
import { RiGlobalFill, RiArrowDownSFill } from 'react-icons/ri';
import { useRegion } from './RegionContext';

function RegionSwitcher() {
  const {
    country,
    countryFlag,
    currency,
    currencyInfo,
    language,
    languages,
    options,
    changeCountry,
    changeCurrency,
    changeLanguage
  } = useRegion();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const langList = Array.isArray(languages) && languages.length > 0 ? languages : [
    { code: 'en', short: 'EN', name: 'English', native: 'English', flag: '🇬🇧', accent: '#22d3ee', textDark: '#060813' },
    { code: 'sw', short: 'SW', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', accent: '#10b981', textDark: '#042f2e' },
    { code: 'ki', short: 'KI', name: 'Kikuyu', native: 'Gĩkũyũ', flag: '🇰🇪', accent: '#f59e0b', textDark: '#1c1917' },
    { code: 'es', short: 'ES', name: 'Spanish', native: 'Español', flag: '🇺🇸', accent: '#a855f7', textDark: '#ffffff' }
  ];

  const activeLangIndex = Math.max(0, langList.findIndex(l => l.code === language));
  const activeLangObj = langList[activeLangIndex] || langList[0];
  const nextLangObj = langList[(activeLangIndex + 1) % langList.length] || langList[0];

  const toggleLanguageQuick = (e) => {
    e.stopPropagation();
    changeLanguage(nextLangObj.code);
  };

  return (
    <div
      id="synergyLocalizationBar"
      data-prerendered="true"
      className="region-switcher"
      ref={ref}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', position: 'relative' }}
    >
      <div
        className="region-trigger"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px' }}
      >
        <button
          type="button"
          id="marketSelectorBtn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Region and currency Selection"
          data-testid="region-switcher-trigger"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          <RiGlobalFill size={14} style={{ color: '#22d3ee' }} />
          <span id="selectedMarketText" data-no-i18n="true" style={{ fontWeight: 700 }}>
            {countryFlag || '🇰🇪'} {currencyInfo?.symbol || 'KSh'} {currency}
          </span>
          <RiArrowDownSFill size={13} className={`region-chevron ${open ? 'open' : ''}`} />
        </button>

        <span data-no-i18n="true" style={{ opacity: 0.3, padding: '0 2px', userSelect: 'none' }}>|</span>

        <button
          type="button"
          id="langSelectorBtn"
          onClick={toggleLanguageQuick}
          title={`Switch language to ${nextLangObj.native} (${nextLangObj.name})`}
          data-testid="lang-quick-toggle"
          data-no-i18n="true"
          style={{
            background: language === 'en' ? 'rgba(34, 211, 238, 0.14)' : (activeLangObj.accent || '#10b981'),
            color: language === 'en' ? '#22d3ee' : (activeLangObj.textDark || '#042f2e'),
            border: language === 'en' ? '1px solid rgba(34, 211, 238, 0.35)' : `1px solid ${activeLangObj.accent || '#10b981'}`,
            borderRadius: '3px',
            padding: '2px 7px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.4px',
            lineHeight: 1.3
          }}
        >
          <span id="selectedLangText">
            {activeLangObj.flag || '🌐'} {activeLangObj.short || activeLangObj.code.toUpperCase()}
          </span>
        </button>
      </div>

      {open && (
        <div className="region-panel" data-testid="region-switcher-panel" style={{ zIndex: 99999, minWidth: '250px' }}>
          <label className="region-field">
            <span>Country / Region</span>
            <select
              value={country}
              onChange={(e) => changeCountry(e.target.value)}
              data-testid="region-country-select"
            >
              {(options.countries || []).map((c) => (
                <option key={c.code} value={c.code} data-no-i18n="true">
                  {c.flag ? `${c.flag} ` : ''}{c.name} ({c.currency})
                </option>
              ))}
            </select>
          </label>

          <label className="region-field">
            <span>Currency</span>
            <select
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              data-testid="region-currency-select"
            >
              {(options.currencies || []).map((c) => (
                <option key={c.code} value={c.code} data-no-i18n="true">
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="region-field">
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              data-testid="region-language-select"
            >
              {langList.map((l) => (
                <option key={l.code} value={l.code} data-no-i18n="true">
                  {l.flag ? `${l.flag} ` : ''}{l.native} ({l.name})
                </option>
              ))}
            </select>
          </label>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              marginTop: '6px'
            }}
            data-no-i18n="true"
          >
            {langList.map((l) => {
              const isSelected = language === l.code;
              const accentColor = l.accent || '#22d3ee';
              const darkText = l.textDark || '#060813';
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => changeLanguage(l.code)}
                  data-testid={`lang-btn-${l.code}`}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '3px',
                    border: isSelected ? `1px solid ${accentColor}` : '1px solid #1e293b',
                    background: isSelected ? accentColor : '#0f172a',
                    color: isSelected ? darkText : '#94a3b8',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{l.flag}</span>
                  <span>{l.native}</span>
                </button>
              );
            })}
          </div>

          <p className="region-note">Prices and plans update live to your local currency.</p>
        </div>
      )}
    </div>
  );
}

export default RegionSwitcher;
