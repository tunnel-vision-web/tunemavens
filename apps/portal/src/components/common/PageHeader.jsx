import React from 'react'
import { Link } from 'react-router-dom'
import { useRegion } from '../../RegionContext.jsx'

export default function PageHeader({ title, bgImage, bgImageWestern, breadcrumb }) {
  const { country } = useRegion();
  const isWestern = ['US', 'GB'].includes(country);
  const selectedBg = isWestern && bgImageWestern ? bgImageWestern : bgImage;

  return (
    <div 
      className="page-header-banner" 
      style={{ backgroundImage: `url(${selectedBg})` }}
    >
      <div className="page-header-overlay" />
      <div className="page-header-content">
        <h1 className="page-header-title">{title}</h1>
        <div className="page-header-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">{breadcrumb}</span>
        </div>
      </div>
    </div>
  );
}
