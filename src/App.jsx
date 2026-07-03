import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PerfectForSidebar from './components/PerfectForSidebar.jsx';

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
          <h2 style={{ marginBottom: '24px' }}>Welcome to TuneMavens</h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
            The music industry community and marketplace. The left sidebar continuously scrolls upward (pauses on hover).
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '32px', marginBottom: '24px' }}>
            <h3>Flagship Apps & Features</h3>
            <p style={{ color: '#94a3b8' }}>Your existing flagship previews, persona carousel, pain points, architecture, pricing, and other sections go here.</p>
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