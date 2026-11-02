import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authApi, tokenStore } from '../../lib/api.js'
import { reconcileUserApps } from '../../lib/activatedApps.js'

export default function SetPasswordView({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendMsg, setResendMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 8) { setErrorMsg('Your password needs at least 8 characters.'); return; }
    if (password !== confirm) { setErrorMsg('The two passwords do not match.'); return; }
    setSubmitting(true);
    try {
      const res = await authApi.setPassword({ token, password });
      if (!res?.access_token || !res?.user) throw new Error('We could not finish setting your password. Please try again.');
      tokenStore.set(res.access_token);
      onLogin(reconcileUserApps(res.user));
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setResendMsg('');
    try {
      const res = await authApi.requestSetupLink(resendEmail.trim());
      setResendMsg(res?.message || 'If that email has an account, a new link is on its way.');
    } catch {
      setResendMsg('We could not send a new link right now. Please try again shortly.');
    }
  };

  const label = { fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu)' };
  const input = { fontSize: '13px', padding: '8px 12px' };

  return (
    <div className="auth-modal-card" style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
      </div>
      <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 4px', color: '#fff', textAlign: 'center' }}>Choose your password</h3>
      <p style={{ fontSize: '12px', color: 'var(--mu)', textAlign: 'center', margin: '0 0 16px' }}>
        One last step to open your dashboard.
      </p>

      {token ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '12px', textAlign: 'left' }}>
            <label className="form-label" style={label}>New password</label>
            <input type="password" className="form-control" style={input} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" required />
          </div>
          <div className="form-group" style={{ marginBottom: '16px', textAlign: 'left' }}>
            <label className="form-label" style={label}>Confirm password</label>
            <input type="password" className="form-control" style={input} value={confirm}
              onChange={(e) => setConfirm(e.target.value)} placeholder="Type it again" autoComplete="new-password" required />
          </div>
          {errorMsg && <p style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '12px' }}>{errorMsg}</p>}
          <button type="submit" disabled={submitting} className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '13px', fontWeight: 700, borderRadius: '3px', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Saving…' : 'Save password & open dashboard'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#ff6b6b', fontSize: '12px', textAlign: 'center' }}>This link is missing its security code. Request a new one below.</p>
      )}

      <form onSubmit={handleResend} style={{ marginTop: '18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
        <label className="form-label" style={label}>Link expired? Get a new one by email</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="email" className="form-control" style={{ ...input, flex: 1 }} value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)} placeholder="name@example.com" required />
          <button type="submit" className="btn-secondary" style={{ borderRadius: '3px', padding: '8px 12px', fontSize: '12px' }}>Send</button>
        </div>
        {resendMsg && <p style={{ color: 'var(--cyan)', fontSize: '12px', marginTop: '8px' }}>{resendMsg}</p>}
      </form>
      <p style={{ fontSize: '12px', color: 'var(--mu)', margin: '14px 0 0', textAlign: 'center' }}>
        Already set a password? <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
      </p>
    </div>
  );
}
