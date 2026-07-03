import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PerfectForSidebar from './components/PerfectForSidebar';

function HomeView() {
  return (
    <div className="app-landing-wrapper">
      <div className="landing-content-split" style={{ display: 'flex', gap: '24px', maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 1/4 width left sidebar - continuous upward scroll, hover pause, slow speed, gradients */}
        <div style={{ flex: '0 0 25%', minWidth: '280px' }}>
          <PerfectForSidebar />
        </div>

        {/* 3/4 width main content area */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '24px' }}>Welcome to TuneMavens</h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px' }}>
            Music industry community & marketplace. The left sidebar continuously scrolls upward (pauses on hover, slow readable speed).
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '32px', marginBottom: '24px' }}>
            <h3>Existing Sections Preserved</h3>
            <p style={{ color: '#94a3b8' }}>Flagship previews, persona carousel, pain points, architecture, pricing, FAQ, contact — all stay in the main 3/4 area.</p>
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
        <Route path="*" element={<div style={{ paddingTop: '120px', textAlign: 'center' }}>Other pages</div>} />
      </Routes>
    </Router>
  );
}

export default App;