import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[TuneStream Root Crash Caught]:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('tunestream_session');
      sessionStorage.removeItem('tunestream_session');
      localStorage.removeItem('tunemavens_saved_user');
      sessionStorage.removeItem('tunemavens_session');
      localStorage.removeItem('tunestream_visited');
    } catch (_) {}
    window.location.href = '/';
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
          fontFamily: "'Sansation', system-ui, -apple-system, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '36px',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎵</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              TuneStream Player Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
              {this.state.error?.message || 'An unexpected error occurred during rendering.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  background: '#10b981',
                  color: '#060813',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '10px 22px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reload TuneStream
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontSize: '13px',
                  padding: '10px 18px',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer'
                }}
              >
                Clear Cache &amp; Reset
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </StrictMode>,
  );
}
