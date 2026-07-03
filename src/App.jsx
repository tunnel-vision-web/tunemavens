import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PerfectForSidebar from './components/PerfectForSidebar';

function HomeView() {
  return (
    <div className="app-landing-wrapper">
      <div className="hw">
        <div className="hs">
          <div className="hcont">
            <div className="he hbadge in">The Music Industry Operating System</div>
            <h1 className="ht">
              <span className="ht-line ht-line-1 in">Build. Distribute. Monetize.</span>
              <span className="ht-line ht-line-2 in">Your music career, simplified.</span>
            </h1>
            <p className="hp in">TuneMavens is the all-in-one platform for creators, labels, supervisors and industry professionals.</p>
            <div className="hb in">
              <Link to="/apps" className="hbp">Explore Apps</Link>
              <Link to="/pricing" className="hbg">See Pricing</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-content-split" style={{ display: 'flex', gap: '32px', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ flex: '0 0 25%', minWidth: '280px' }}>
          <PerfectForSidebar />
        </div>
        <div style={{ flex: 1 }}>
          <div className="section-wrapper">
            <div className="section-header">
              <span className="section-label">POWERFUL TOOLS</span>
              <h2 className="section-title">Flagship Apps</h2>
              <p className="section-desc">Everything you need to manage your music career in one place.</p>
            </div>
            <div className="flagship-previews">
              <div className="flagship-card">
                <div className="flagship-info">
                  <div className="flagship-badge">Creator Suite</div>
                  <h3 className="flagship-title">TuneMavens Creator</h3>
                  <p className="flagship-text">Release, distribute and monetize your music with powerful analytics and AI recommendations.</p>
                  <Link to="/native-apps/tunemavens" className="flagship-link">Learn more →</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="section-wrapper">
            <div className="section-header">
              <span className="section-label">FOR EVERYONE IN MUSIC</span>
              <h2 className="section-title">Built for the entire ecosystem</h2>
            </div>
            <div className="pain-points-grid">
              <div className="pain-card"><h4>Creators</h4><p>Release music, track performance, and connect with industry professionals.</p></div>
              <div className="pain-card"><h4>Labels & Execs</h4><p>Discover talent, manage rosters, and streamline A&R workflows.</p></div>
              <div className="pain-card"><h4>Supervisors & Agents</h4><p>Find the perfect music for sync, manage deals, and collaborate efficiently.</p></div>
            </div>
          </div>

          <div className="section-wrapper">
            <div className="section-header">
              <h2 className="section-title">Modern Architecture</h2>
              <p className="section-desc">Built with modern tech for speed, security and scale.</p>
            </div>
          </div>

          <div className="section-wrapper">
            <div className="section-header">
              <h2 className="section-title">Simple, Transparent Pricing</h2>
            </div>
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="plan-name">Starter</div>
                <div className="plan-price">Free</div>
                <Link to="/pricing" className="plan-btn outline">Get Started</Link>
              </div>
              <div className="pricing-card premium">
                <div className="pricing-badge">Most Popular</div>
                <div className="plan-name">Pro</div>
                <div className="plan-price">$29</div>
                <Link to="/pricing" className="plan-btn cyan">Choose Pro</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/pricing" element={<div style={{ padding: '120px 24px', textAlign: 'center' }}><h1>Pricing</h1></div>} />
        <Route path="/apps" element={<div style={{ padding: '120px 24px', textAlign: 'center' }}><h1>Apps</h1></div>} />
        <Route path="*" element={<div style={{ paddingTop: '120px', textAlign: 'center' }}>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;