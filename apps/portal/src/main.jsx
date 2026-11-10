import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RegionProvider } from './RegionContext.jsx'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[TuneMavens Root Crash Caught]:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('tunemavens_saved_user');
      sessionStorage.removeItem('tunemavens_session');
      localStorage.removeItem('tunemavens_active_persona');
      localStorage.removeItem('preferred_dashboard_tab');
    } catch (_) {}
    window.location.hash = '#/dashboard';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#060813',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Sansation', 'Outfit', sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(34, 211, 238, 0.4)',
            borderRadius: '12px',
            padding: '36px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚡</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              TuneMavens Workspace Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred during rendering.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #0284c7 100%)',
                  color: '#060813',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '10px 22px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reset Session &amp; Launch Dashboard
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("TuneStream Client Booting - v1.0.4");

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <GlobalErrorBoundary>
      <RegionProvider>
        <App />
      </RegionProvider>
    </GlobalErrorBoundary>,
  );
}
