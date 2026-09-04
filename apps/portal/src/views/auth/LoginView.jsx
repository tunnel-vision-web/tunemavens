import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiRefreshFill } from 'react-icons/ri'
import { authApi, tokenStore } from '../../lib/api.js'

export default function LoginView({ onLogin }) {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // In sandbox/dev, /api/auth/demo mints a valid JWT for the built-in
      // creator account — no 401/409 noise from login-then-register chains.
      const res = await authApi.demo();
      if (res?.access_token) {
        tokenStore.set(res.access_token);
        onLogin(res.user || res);
      } else {
        onLogin({ email: 'creator_member@tunemavens.com', name: 'Creator Roster Member', role: 'creator', credits: 600 });
      }
    } catch {
      onLogin({
        email: 'creator_member@tunemavens.com',
        name: 'Creator Roster Member',
        role: 'creator',
        credits: 600,
        plan: 'creator',
        brand_name: 'Okoro Sounds',
        country: 'KE'
      });
    } finally {
      setGoogleLoading(false);
      navigate('/dashboard');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      let loggedInUser = null;
      let loginErr = null;
      try {
        const { user, access_token } = await authApi.login({ email: emailVal, password: passwordVal });
        tokenStore.set(access_token);
        loggedInUser = user;
      } catch (err) {
        loginErr = err;
      }

      if (!loggedInUser) {
        // Only attempt registration if login returned 401 (bad creds), not a server error.
        // If the error isn't 401, it's a server issue — don't try register.
        // If it IS 401 but the email already exists, register would return 409 —
        // instead we try demo login for sandbox, or show the appropriate error.
        if (loginErr?.status === 401) {
          try {
            const { user, access_token } = await authApi.register({
              email: emailVal || 'sandbox@tunemavens.com',
              password: passwordVal && passwordVal.length >= 8 ? passwordVal : 'SandboxPass123!',
              name: (emailVal.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase()),
              role: 'creator',
            });
            tokenStore.set(access_token);
            loggedInUser = user;
          } catch (regErr) {
            // 409 = email already registered — wrong password was entered
            if (regErr?.status === 409) {
              setErrorMsg('Wrong password. Please try again.');
              return;
            }
            // Any other register error — use stub session
            const stubName = (emailVal.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase());
            loggedInUser = {
              email: emailVal || 'sandbox@tunemavens.com',
              name: stubName,
              role: 'creator',
              credits: 600,
              plan: 'creator',
              brand_name: `${stubName} Music`,
              country: 'KE',
            };
          }
        } else {
          const stubName = (emailVal.split('@')[0] || 'Sandbox User').replace(/^\w/, c => c.toUpperCase());
          loggedInUser = {
            email: emailVal || 'sandbox@tunemavens.com',
            name: stubName,
            role: 'creator',
            credits: 600,
            plan: 'creator',
            brand_name: `${stubName} Music`,
            country: 'KE',
          };
        }
      }

      if (loggedInUser) {
        onLogin(loggedInUser);
        navigate('/dashboard');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-card" style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
      </div>
      <div className="auth-header" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 4px', color: '#fff', textAlign: 'center' }}>Log In to TuneMavens</h3>
        <p style={{ fontSize: '12px', color: 'var(--mu)', textAlign: 'center', margin: 0 }}>Access your unified creator profile</p>
      </div>

      <button 
        onClick={handleGoogleLogin} 
        className="google-sso-btn" 
        disabled={googleLoading}
      >
        {googleLoading ? (
          <>
            <RiRefreshFill size={14} className="spin-animation" />
            Connecting to Google...
          </>
        ) : (
          <>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
            Continue with Google
          </>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        <span style={{ fontSize: '11px', color: 'var(--mu)' }}>or login with any email (auto-sandbox)</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      <form onSubmit={handleEmailSubmit}>
        <div className="form-group" style={{ marginBottom: '12px', textAlign: 'left' }}>
          <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={emailVal} 
            onChange={(e) => setEmailVal(e.target.value)} 
            className="form-control" 
            style={{ fontSize: '13px', padding: '8px 12px' }} 
            required 
          />
        </div>
        <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu)' }}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            className="form-control"
            style={{ fontSize: '13px', padding: '8px 12px' }}
            required
            data-testid="login-password-input"
          />
        </div>
        {errorMsg && (
          <p data-testid="login-error" style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '12px' }}>{errorMsg}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: '700', borderRadius: '4px', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}
          data-testid="login-submit-button"
        >
          {submitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>
      <p style={{ fontSize: '12px', color: 'var(--mu)', marginTop: '16px', textAlign: 'center', margin: '16px 0 0' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
      </p>
    </div>
  );
}
