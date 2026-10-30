import React from 'react'
import { Link } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'

export default function PageHeader({ 
  title, 
  bgImage, 
  bgImageWestern, 
  breadcrumb, 
  titleStyle, 
  titleClassName,
  subtitle 
}) {
  const { country } = useRegion();
  const isWestern = ['US', 'GB'].includes(country);
  const selectedBg = isWestern && bgImageWestern ? bgImageWestern : bgImage;

  return (
    <div 
      className="page-header-banner" 
      style={{ backgroundImage: selectedBg ? `url(${selectedBg})` : undefined }}
    >
      <div className="page-header-overlay" />
      <div className="page-header-content">
        <h1 
          className={`page-header-title ${titleClassName || ''}`}
          style={titleStyle}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="page-header-subtitle" style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '800px', margin: '0 auto 12px auto' }}>
            {subtitle}
          </p>
        )}
        <div className="page-header-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">{breadcrumb}</span>
        </div>
      </div>
    </div>
  );
}
