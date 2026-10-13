import React from 'react'
import { useParams, Link } from 'react-router-dom'

import CreatorLandingPage from './role-pages/CreatorLandingPage.jsx'
import LabelLandingPage from './role-pages/LabelLandingPage.jsx'
import DjLandingPage from './role-pages/DjLandingPage.jsx'
import SupervisorLandingPage from './role-pages/SupervisorLandingPage.jsx'
import ConsumerLandingPage from './role-pages/ConsumerLandingPage.jsx'
import MediaHouseLandingPage from './role-pages/MediaHouseLandingPage.jsx'
import CorporateLandingPage from './role-pages/CorporateLandingPage.jsx'

export default function RoleLandingView() {
  const { role } = useParams();
  const normalized = (role || '').toLowerCase().trim();

  // Route to the corresponding dedicated persona landing page
  switch (normalized) {
    case 'creator':
    case 'artist':
    case 'producer':
      return <CreatorLandingPage />;

    case 'label':
    case 'exec':
    case 'manager':
      return <LabelLandingPage />;

    case 'dj':
    case 'booking-agent':
    case 'booking':
      return <DjLandingPage />;

    case 'supervisor':
    case 'studio':
      return <SupervisorLandingPage />;

    case 'consumer':
    case 'listener':
    case 'listeners':
      return <ConsumerLandingPage />;

    case 'media-house':
    case 'media_house':
    case 'media':
    case 'broadcaster':
      return <MediaHouseLandingPage />;

    case 'corporate':
    case 'brand':
    case 'brands':
      return <CorporateLandingPage />;

    default:
      return (
        <div className="landing-section landing-section-alt" data-testid="role-landing-not-found" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ textAlign: 'center', padding: '80px 24px', maxWidth: '640px', margin: '0 auto' }}>
            <span className="landing-section-eyebrow" style={{ color: 'var(--cyan)', fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
              Persona Not Found
            </span>
            <h1 className="landing-section-title" style={{ fontFamily: 'Sansation', fontSize: '32px', marginTop: 12, color: '#fff' }}>
              We don't have a dedicated landing page for "{role}".
            </h1>
            <p className="landing-lede" style={{ margin: '16px auto 32px', color: 'var(--mu)', fontSize: '16px', lineHeight: 1.6 }}>
              Explore our complete suite of 7 specialized industry seats to discover the tools built for your specific role.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/for" className="btn btn-primary" style={{ padding: '10px 24px', background: 'var(--cyan)', color: '#060813', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}>
                Browse All Seats
              </Link>
              <Link to="/" className="btn btn-secondary" style={{ padding: '10px 24px', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontWeight: 600 }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
  }
}
