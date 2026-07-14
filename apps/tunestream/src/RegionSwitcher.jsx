import React, { useState, useRef, useEffect } from 'react';
import { RiGlobalFill, RiArrowDownSFill } from 'react-icons/ri';
import { useRegion } from './RegionContext';

function RegionSwitcher() {
  const { 
    country, 
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

  return (
    <div className="region-switcher" ref={ref}>
      <button
        className="region-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Region and currency Selection"
      >
        <RiGlobalFill size={15} />
        <span>{currencyInfo?.symbol || '$'} {currency}</span>
        <RiArrowDownSFill size={13} className={`region-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="region-panel">
          <label className="region-field">
            <span>Country / Region</span>
            <select
              value={country}
              onChange={(e) => changeCountry(e.target.value)}
            >
              {(options.countries || []).map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </label>

          <label className="region-field">
            <span>Currency</span>
            <select
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
            >
              {(options.currencies || []).map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </label>

          <label className="region-field">
            <span>Language</span>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              {(languages || []).map((l) => (
                <option key={l.code} value={l.code}>{l.native} ({l.name})</option>
              ))}
            </select>
          </label>

          <p className="region-note">Prices and plans update live to your local currency.</p>
        </div>
      )}
    </div>
  );
}

export default RegionSwitcher;
