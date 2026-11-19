import React from 'react';

/**
 * Checks whether a track or item is marked as containing explicit lyrics.
 */
export function isExplicit(item) {
  if (!item) return false;
  if (item.isExplicit === true || item.isExplicit === 'true') return true;
  const advisory = (item.contentAdvisory || item.advisory || item.explicit || '').toString().toLowerCase().trim();
  return advisory === 'explicit' || advisory === 'explicit lyrics' || advisory.includes('explicit');
}

/**
 * Checks whether a release (album, EP, single, collection) contains explicit lyrics.
 * A release is explicit if explicitly flagged, or if any of its tracks are explicit.
 */
export function isReleaseExplicit(release) {
  if (!release) return false;
  if (isExplicit(release)) return true;
  if (Array.isArray(release.tracks) && release.tracks.some(isExplicit)) return true;
  return false;
}

/**
 * Standard Explicit Badge Component
 * Renders the music industry standard explicit lyrics badge.
 * 
 * Supports:
 * - 'standard': Digital streaming [ E ] icon (Apple Music / Spotify standard)
 * - 'cover': Authentic Parental Advisory Explicit Content sticker for album cover artwork
 * - 'cover-icon': High-contrast [ E ] icon with white border on dark background
 * - 'pill': [ E ] EXPLICIT badge
 * 
 * @param {'xs'|'sm'|'md'|'lg'} size - Badge dimensions
 * @param {'standard'|'cover'|'parental-advisory'|'cover-icon'|'pill'} variant - Visual design style
 * @param {boolean} showLabel - Whether to display "Explicit" text alongside the mark
 * @param {object} style - Optional CSS overrides
 * @param {string} title - Tooltip string
 */
export default function ExplicitBadge({
  size = 'md',
  variant = 'standard',
  showLabel = false,
  style = {},
  title = 'Explicit Content: Contains explicit lyrics'
}) {
  const sizeMap = {
    xs: { width: 13, height: 13, fontSize: '8.5px', radius: 2 },
    sm: { width: 15, height: 15, fontSize: '9.5px', radius: 2.5 },
    md: { width: 17, height: 17, fontSize: '11px', radius: 3 },
    lg: { width: 22, height: 22, fontSize: '13px', radius: 3.5 }
  };

  const s = sizeMap[size] || sizeMap.md;

  // 1. INDUSTRY STANDARD ALBUM COVER STICKER (PARENTAL ADVISORY EXPLICIT CONTENT)
  if (variant === 'cover' || variant === 'parental-advisory') {
    const isSmall = size === 'xs' || size === 'sm';
    return (
      <div
        title={title}
        aria-label="Parental Advisory Explicit Content"
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #ffffff',
          borderRadius: '2px',
          padding: isSmall ? '2px 5px' : '3px 7px',
          lineHeight: 1,
          fontFamily: 'Impact, "Arial Black", "Helvetica Neue", sans-serif',
          boxShadow: '0 2px 8px rgba(0,0,0,0.85)',
          userSelect: 'none',
          flexShrink: 0,
          ...style
        }}
      >
        <div style={{
          fontSize: isSmall ? '6px' : '7.5px',
          fontWeight: 900,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          lineHeight: 1.05
        }}>
          PARENTAL
        </div>
        <div style={{
          fontSize: isSmall ? '7.5px' : '9px',
          fontWeight: 900,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          lineHeight: 1.05
        }}>
          ADVISORY
        </div>
        <div style={{
          width: '100%',
          height: '0.8px',
          background: '#ffffff',
          margin: '1.5px 0'
        }} />
        <div style={{
          fontSize: isSmall ? '4.5px' : '5.5px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          lineHeight: 1,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          EXPLICIT CONTENT
        </div>
      </div>
    );
  }

  // 2. ALBUM COVER DIGITAL [ E ] BADGE (High-contrast box with white border)
  if (variant === 'cover-icon') {
    return (
      <span
        title={title}
        aria-label="Explicit Lyrics"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          color: '#ffffff',
          border: '1px solid #ffffff',
          fontWeight: 900,
          fontSize: s.fontSize,
          lineHeight: 1,
          width: `${s.width + 1}px`,
          height: `${s.height + 1}px`,
          borderRadius: `${s.radius}px`,
          userSelect: 'none',
          flexShrink: 0,
          letterSpacing: 0,
          verticalAlign: 'middle',
          boxShadow: '0 2px 6px rgba(0,0,0,0.85)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          ...style
        }}
      >
        E
      </span>
    );
  }

  // 3. PILL VARIANT WITH LABEL
  if (showLabel || variant === 'pill') {
    return (
      <span
        title={title}
        aria-label="Explicit Lyrics Advisory"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 6px',
          background: 'rgba(239, 68, 68, 0.14)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '3px',
          color: '#fca5a5',
          fontSize: size === 'xs' ? '9px' : '10px',
          fontWeight: 800,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          userSelect: 'none',
          lineHeight: 1,
          flexShrink: 0,
          ...style
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ef4444',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: s.fontSize,
            lineHeight: 1,
            width: `${s.width - 2}px`,
            height: `${s.height - 2}px`,
            borderRadius: `${s.radius}px`,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        >
          E
        </span>
        <span style={{ fontWeight: 800 }}>Explicit</span>
      </span>
    );
  }

  // 4. STANDARD STREAMING [ E ] MARK
  return (
    <span
      title={title}
      aria-label="Explicit Lyrics"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e2e8f0',
        color: '#090d16',
        fontWeight: 900,
        fontSize: s.fontSize,
        lineHeight: 1,
        width: `${s.width}px`,
        height: `${s.height}px`,
        borderRadius: `${s.radius}px`,
        userSelect: 'none',
        flexShrink: 0,
        letterSpacing: 0,
        verticalAlign: 'middle',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style
      }}
    >
      E
    </span>
  );
}
