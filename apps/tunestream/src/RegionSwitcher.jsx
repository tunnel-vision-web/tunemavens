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

  const toggleLanguageQuick = (e) => {
    e.stopPropagation();
    const nextLang = language === 'sw' ? 'en' : 'sw';
    changeLanguage(nextLang);
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
          title={language === 'sw' ? 'Switch to English' : 'Badilisha kwenda Kiswahili'}
          data-testid="lang-quick-toggle"
          data-no-i18n="true"
          style={{
            background: language === 'sw' ? '#10b981' : 'rgba(34, 211, 238, 0.14)',
            color: language === 'sw' ? '#042f2e' : '#22d3ee',
            border: language === 'sw' ? '1px solid #10b981' : '1px solid rgba(34, 211, 238, 0.35)',
            borderRadius: '3px',
            padding: '2px 7px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.4px',
            lineHeight: 1.3
          }}
        >
          <span id="selectedLangText">{language === 'sw' ? '🇰🇪 SW' : '🇬🇧 EN'}</span>
        </button>
      </div>

      {open && (
        <div className="region-panel" data-testid="region-switcher-panel" style={{ zIndex: 99999 }}>
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
              {(languages || []).map((l) => (
                <option key={l.code} value={l.code} data-no-i18n="true">
                  {l.flag ? `${l.flag} ` : ''}{l.native} ({l.name})
                </option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }} data-no-i18n="true">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '3px',
                border: language === 'en' ? '1px solid #22d3ee' : '1px solid #1e293b',
                background: language === 'en' ? '#22d3ee' : '#0f172a',
                color: language === 'en' ? '#060813' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => changeLanguage('sw')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '3px',
                border: language === 'sw' ? '1px solid #10b981' : '1px solid #1e293b',
                background: language === 'sw' ? '#10b981' : '#0f172a',
                color: language === 'sw' ? '#042f2e' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🇰🇪 Kiswahili
            </button>
          </div>

          <p className="region-note">Prices and plans update live to your local currency.</p>
        </div>
      )}
    </div>
  );
}

export default RegionSwitcher;
