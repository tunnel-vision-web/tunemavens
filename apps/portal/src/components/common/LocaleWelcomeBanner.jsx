import React, { useState, useEffect } from 'react';
import { RiGlobalFill, RiCloseLine, RiSettings3Line } from 'react-icons/ri';
import { useRegion } from '../../RegionContext';

export default function LocaleWelcomeBanner() {
  const { countryName, countryFlag, currency, currencyInfo, language } = useRegion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const alreadyWelcomed = localStorage.getItem('tunemavens_locale_welcomed');
      if (!alreadyWelcomed) {
        // Show after a brief delay so the page loads smoothly
        const timer = setTimeout(() => {
          setVisible(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem('tunemavens_locale_welcomed', 'true');
    } catch (_) {}
  };

  const handleOpenSwitcher = () => {
    window.dispatchEvent(new CustomEvent('synergyOpenRegionSwitcher'));
    handleDismiss();
  };

  if (!visible) return null;

  // Multi-lingual copy
  const getBannerContent = () => {
    const sym = currencyInfo?.symbol || '$';
    const flag = countryFlag || '🇰🇪';
    const cName = countryName || 'Kenya';

    if (language === 'sw') {
      return {
        badge: 'Eneo na Sarafu ya Awali',
        title: 'Karibu TuneMavens!',
        desc: `Eneo lako limewekwa kuwa ${flag} ${cName} (${sym} ${currency}) na lugha ya Kiswahili. Unaweza kubadilisha nchi, sarafu, au lugha yako wakati wowote ukitumia Kiteuzi cha Eneo na Sarafu (${flag} ${sym} ${currency} | SW) kwenye upau wa juu wa menyu.`,
        dismissBtn: 'Nimeelewa',
        customizeBtn: 'Badilisha Eneo na Lugha'
      };
    } else if (language === 'ki') {
      return {
        badge: 'Mũbango wa Mbere wa Bũrũri na Mbeca',
        title: 'Ũhoro Waku TuneMavens!',
        desc: `Gĩcunjĩ gĩaku kĩigĩtwo ta ${flag} ${cName} (${sym} ${currency}) na rũthiomi rwa Gĩkũyũ. Nĩ ũngĩgarũra bũrũri, mbeca, kana rũthiomi rwaku hĩndĩ o yothe kũgerera Kĩgarũri kĩa Bũrũri na Mbeca (${flag} ${sym} ${currency} | KI) rũkũrĩ rwa igũrũ.`,
        dismissBtn: 'Nĩ Ndamenya',
        customizeBtn: 'Garũra Bũrũri na Rũthiomi'
      };
    } else if (language === 'es') {
      return {
        badge: 'Región y Moneda Detectada',
        title: '¡Bienvenido a TuneMavens!',
        desc: `Tu región está configurada en ${flag} ${cName} (${sym} ${currency}) con idioma en Español. Puedes cambiar tu país, moneda o idioma en cualquier momento usando el Selector de Región y Moneda (${flag} ${sym} ${currency} | ES) en la barra de navegación superior.`,
        dismissBtn: 'Entendido',
        customizeBtn: 'Personalizar Región e Idioma'
      };
    }

    // Default English
    return {
      badge: 'Region & Currency Auto-Detected',
      title: 'Welcome to TuneMavens!',
      desc: `Your region is set to ${flag} ${cName} (${sym} ${currency}) with language in English. You can change your country, currency, or language anytime using the Region & Currency Switcher (${flag} ${sym} ${currency} | EN) in the top navigation bar.`,
      dismissBtn: 'Got it',
      customizeBtn: 'Customize Region & Language'
    };
  };

  const content = getBannerContent();

  return (
    <aside
      aria-label="Region & Currency Notification"
      data-testid="locale-welcome-banner"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '440px',
        width: 'calc(100vw - 48px)',
        zIndex: 99998,
        background: 'rgba(11, 15, 25, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(34, 211, 238, 0.35)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(34, 211, 238, 0.15)',
        borderRadius: '12px',
        padding: '16px 18px',
        color: '#f1f5f9',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        animation: 'localeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <style>{`
        @keyframes localeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RiGlobalFill size={16} style={{ color: '#22d3ee' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: '#22d3ee',
              background: 'rgba(34, 211, 238, 0.12)',
              padding: '2px 8px',
              borderRadius: '20px'
            }}
          >
            {content.badge}
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      {/* Title */}
      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
        {content.title}
      </h4>

      {/* Body */}
      <p style={{ margin: '0 0 14px 0', fontSize: '12px', lineHeight: 1.5, color: '#94a3b8' }}>
        {content.desc}
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleOpenSwitcher}
          style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '7px 12px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
          }}
        >
          <RiSettings3Line size={13} />
          <span>{content.customizeBtn}</span>
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '7px 14px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {content.dismissBtn}
        </button>
      </div>
    </aside>
  );
}
