import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROLE_LOGOS } from '../PerfectForSidebar.jsx'
import { useRegion } from '../../RegionContext.jsx'

const SUB_APP_PATHS = [
  '/native-apps/tunestream',
  '/native-apps/creator-companion',
  '/native-apps/tunepay',
  '/native-apps/sync-master',
];
const isSubAppPath = (path) =>
  SUB_APP_PATHS.some((p) => path.startsWith(p)) ||
  /^\/for\/[^/]+/.test(path);

const LAST_TM_PAGE_KEY = 'tunemavens_last_page';


export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { country } = useRegion();

  const handleBackToTuneMavens = (e) => {
    e.preventDefault();
    const saved = sessionStorage.getItem(LAST_TM_PAGE_KEY);
    navigate(saved || '/');
  };

  const getFooterLocation = (code) => {
    switch (code) {
      case 'US': return 'Atlanta, USA';
      case 'GB': return 'London, UK';
      case 'NG': return 'Lagos, Nigeria';
      case 'ZA': return 'Johannesburg, South Africa';
      case 'UG': return 'Kampala, Uganda';
      case 'TZ': return 'Dar es Salaam, Tanzania';
      default: return 'Nairobi, Kenya';
    }
  };

  return (
    <footer className="landing-footer">
      <div className="footer-inner-container">
        {location.pathname.startsWith('/native-apps/tunestream') ? (
          <div className="footer-grid">
            {/* Brand Column with TuneStream logo and tagline */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src={ROLE_LOGOS['consumer']} 
                  alt="TuneStream Footer Logo" 
                  className="footer-logo-image" 
                  style={{ height: '38px', width: 'auto', display: 'block', margin: '0 auto' }} 
                />
              </div>
              <div className="footer-desc">
                Next-generation music streaming built on the shared Intermaven network.
              </div>
              <div className="footer-host-link" style={{ marginTop: '4px' }}>
                streams.tunemavens.com
              </div>
              <div className="footer-host-link" style={{ marginTop: '0px' }}>
                intermaven.io
              </div>
            </div>

            {/* Product links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>TuneStream</h4>
                <div className="footer-links">
                  <Link to="/native-apps/tunestream?view=listen" className="footer-link">Listen Now</Link>
                  <Link to="/stream" className="footer-link">Web Player</Link>
                  <Link to="/tunestream/features" className="footer-link">Features</Link>
                  <Link to="/native-apps/tunestream?view=premium" className="footer-link">Premium</Link>
                  <Link to="/tunestream/about" className="footer-link">About</Link>
                </div>
              </div>
            </div>

            {/* Company links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Community</h4>
                <div className="footer-links">
                  <Link to="/tunestream/creators" className="footer-link">For Creators</Link>
                  <Link to="/native-apps/tunestream?view=explore" className="footer-link">Discover Artists</Link>
                  <Link to="/native-apps/tunestream?view=playlists" className="footer-link">Playlists</Link>
                  <Link to="/tunestream/help" className="footer-link">Support &amp; Help</Link>
                  <Link to="/tunestream/help" className="footer-link">Contact</Link>
                </div>
              </div>
            </div>

            {/* Follow Us links with SVGs and Copyright copy */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Follow us</h4>
                <div className="footer-social">
                  <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </a>
                  <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a className="sico tiktok" onClick={() => alert('TikTok handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.83-.56 3.73-1.88 5.02-1.5 1.54-3.83 2.19-5.94 1.86-2.52-.39-4.71-2.45-5.14-4.96-.58-3.08 1.21-6.38 4.23-7.21.94-.27 1.95-.31 2.91-.18V12.18c-1.28-.21-2.65-.05-3.79.62-1.89 1.12-2.73 3.52-2.12 5.62.58 2.09 2.74 3.59 4.9 3.32 1.76-.2 3.27-1.53 3.65-3.26.17-.75.14-1.53.15-2.3V4.08C13.06 2.76 12.89 1.38 12.525.02z"></path></svg>
                  </a>
                </div>
                <div className="footer-copy">
                  © 2026 TuneStream.{' '}
                  <a
                    href="/"
                    onClick={handleBackToTuneMavens}
                    style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                    data-testid="footer-back-to-tunemavens"
                  >
                    A TuneMavens Utility.
                  </a><br />{getFooterLocation(country)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="footer-grid">
            {/* Brand Column with second instance logo and tagline */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img 
                  src="/tunemavens-logo-white.png" 
                  alt="TuneMavens Footer Logo" 
                  className="footer-logo-image" 
                  style={{ height: '38px', width: 'auto', display: 'block', margin: '0 auto' }} 
                />
              </div>
              <div className="footer-desc">
                Next-generation tools built on the shared Intermaven network.
              </div>
              <div className="footer-host-link" style={{ marginTop: '4px' }}>
                tunemavens.com
              </div>
              <div className="footer-host-link" style={{ marginTop: '0px' }}>
                intermaven.io
              </div>
            </div>

            {/* Product links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>TuneStream</h4>
                <div className="footer-links">
                  <Link to="/native-apps/tunestream?view=listen" className="footer-link">Listen Now</Link>
                  <Link to="/stream" className="footer-link">Web Player</Link>
                  <Link to="/tunestream/features" className="footer-link">Features</Link>
                  <Link to="/native-apps/tunestream?view=premium" className="footer-link">Premium</Link>
                  <Link to="/tunestream/about" className="footer-link">About</Link>
                </div>
              </div>
            </div>

            {/* Company links */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Community</h4>
                <div className="footer-links">
                  <Link to="/tunestream/creators" className="footer-link">For Creators</Link>
                  <Link to="/native-apps/tunestream?view=explore" className="footer-link">Discover Artists</Link>
                  <Link to="/native-apps/tunestream?view=playlists" className="footer-link">Playlists</Link>
                  <Link to="/tunestream/help" className="footer-link">Support &amp; Help</Link>
                  <Link to="/tunestream/help" className="footer-link">Contact</Link>
                </div>
              </div>
            </div>

            {/* Follow Us links with SVGs and Copyright copy */}
            <div className="footer-col">
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <h4>Follow us</h4>
                <div className="footer-social">
                  <a className="sico instagram" onClick={() => alert('Instagram handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a className="sico x" onClick={() => alert('X handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  </a>
                  <a className="sico linkedin" onClick={() => alert('LinkedIn handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a className="sico tiktok" onClick={() => alert('TikTok handle coming soon!')}>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.43-.64-.67-.07 3.26-.03 6.52-.05 9.77-.04 1.83-.56 3.73-1.88 5.02-1.5 1.54-3.83 2.19-5.94 1.86-2.52-.39-4.71-2.45-5.14-4.96-.58-3.08 1.21-6.38 4.23-7.21.94-.27 1.95-.31 2.91-.18V12.18c-1.28-.21-2.65-.05-3.79.62-1.89 1.12-2.73 3.52-2.12 5.62.58 2.09 2.74 3.59 4.9 3.32 1.76-.2 3.27-1.53 3.65-3.26.17-.75.14-1.53.15-2.3V4.08C13.06 2.76 12.89 1.38 12.525.02z"></path></svg>
                  </a>
                </div>
                <div className="footer-copy">
                  © 2026 TuneMavens Ltd.<br />{getFooterLocation(country)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <a href="#privacy" className="fbl" onClick={() => alert('Privacy policy is synchronized with Intermaven.')}>Privacy Policy</a>
            <a href="#terms" className="fbl" onClick={() => alert('Terms of service are synchronized with Intermaven.')}>Terms of Service</a>
            <a href="#cookies" className="fbl" onClick={() => alert('Cookie policy is synchronized.')}>Cookie Policy</a>
            <a href="#refund" className="fbl" onClick={() => alert('Refund policy is synchronized.')}>Refund Policy</a>
          </div>
          <a 
            href="https://intermaven.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="intermaven-badge"
          >
            powered by <span>intermaven</span>
            <span className="badge-dot"></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
