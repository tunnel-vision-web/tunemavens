import React from 'react';

/**
 * Checks whether a track or item is marked as containing explicit lyrics.
 */
export function isExplicit(item) {
  if (!item) return false;
  if (item.isExplicit === true || item.isExplicit === 'true') return true;
  const advisory = (item.contentAdvisory || item.advisory || item.explicit || item.lyricsAdvisory || '').toString().toLowerCase().trim();
  if (advisory === 'explicit' || advisory === 'explicit lyrics' || advisory.includes('explicit')) return true;
  const title = (item.title || item.name || '').toString().toLowerCase();
  if (title.includes('[explicit]') || title.includes('(explicit)')) return true;
  return false;
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
 * TuneStream Explicit Badge Component
 * Renders the explicit lyrics badge over album/single artwork.
 * 
 * Supports:
 * - 'badge' / 'cover-pill': Small black-background badge labelled 'explicit' matching the 'album' badge width and design.
 * - 'cover' / 'parental-advisory': Authentic RIAA Parental Advisory Explicit Content box.
 * - 'standard': Streaming [ E ] square mark.
 * 
 * @param {'xs'|'sm'|'md'|'lg'} size - Dimensions
 * @param {'badge'|'cover'|'parental-advisory'|'standard'|'cover-icon'} variant - Style variant
 * @param {string} label - Text label (defaults to 'explicit')
 * @param {object} style - Inline CSS overrides
 * @param {string} title - Tooltip
 */
export default function ExplicitBadge({
  size = 'sm',
  variant = 'badge',
  label = 'explicit',
  style = {},
  title = 'Explicit Content: Contains explicit lyrics'
}) {
  const sizeMap = {
    xs: { fontSize: '8.5px', padding: '1px 5px', height: '16px', iconSize: '9px', radius: 2.5 },
    sm: { fontSize: '9px', padding: '2px 6px', height: '18px', iconSize: '10px', radius: 3 },
    md: { fontSize: '10px', padding: '3px 8px', height: '22px', iconSize: '12px', radius: 3 },
    lg: { fontSize: '12px', padding: '4px 10px', height: '26px', iconSize: '14px', radius: 4 }
  };

  const s = sizeMap[size] || sizeMap.sm;

  // 1. SMALL BLACK-BACKGROUND BADGE LABELLED 'EXPLICIT' OVER THE 'ALBUM' BADGE
  if (variant === 'badge' || variant === 'cover-pill') {
    return (
      <span
        title={title}
        aria-label="Explicit Lyrics Advisory"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          background: '#000000',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          borderRadius: `${s.radius}px`,
          padding: s.padding,
          fontSize: s.fontSize,
          fontWeight: 800,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          lineHeight: 1,
          userSelect: 'none',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.85)',
          width: 'fit-content',
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          ...style
        }}
      >
        <span
          style={{
            background: '#ffffff',
            color: '#000000',
            fontWeight: 900,
            fontSize: '7.5px',
            width: '10px',
            height: '10px',
            borderRadius: '1.5px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            marginRight: '1px'
          }}
        >
          E
        </span>
        <span>{label}</span>
      </span>
    );
  }

  // 2. PARENTAL ADVISORY EXPLICIT CONTENT BOX
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
          boxSizing: 'border-box',
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

  // 3. STANDARD DIGITAL [ E ] MARK
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
        border: '1px solid rgba(255, 255, 255, 0.85)',
        fontWeight: 900,
        fontSize: s.fontSize,
        lineHeight: 1,
        width: s.height,
        height: s.height,
        borderRadius: `${s.radius}px`,
        userSelect: 'none',
        flexShrink: 0,
        letterSpacing: 0,
        verticalAlign: 'middle',
        boxShadow: '0 2px 5px rgba(0,0,0,0.7)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...style
      }}
    >
      E
    </span>
  );
}
