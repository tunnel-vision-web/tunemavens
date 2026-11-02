import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { authApi } from '../../lib/api.js'

export default function VerifyEmailView() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token') || '';
  const [state, setState] = useState(token ? 'working' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This link is missing its security code.');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authApi.verifyEmail(token)
      .then(() => { if (!cancelled) { setState('ok'); setMessage('Your email is confirmed. Thank you!'); } })
      .catch((err) => { if (!cancelled) { setState('error'); setMessage(err?.message || 'We could not confirm your email. Please try again.'); } });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="auth-modal-card" style={{ cursor: 'default', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <img src="/favicon.png" alt="TuneMavens Icon" style={{ width: '42px', height: '42px', display: 'block' }} />
      </div>
      <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 8px', color: '#fff' }}>
        {state === 'ok' ? 'Email confirmed' : state === 'working' ? 'Confirming your email…' : 'Link problem'}
      </h3>
      {message && (
        <p style={{ fontSize: '13px', color: state === 'ok' ? 'var(--cyan)' : '#ff6b6b', margin: '0 0 18px' }}>{message}</p>
      )}
      <Link to={state === 'ok' ? '/dashboard' : '/login'} className="btn-primary"
        style={{ display: 'block', padding: '10px', fontSize: '13px', fontWeight: 700, borderRadius: '3px', textDecoration: 'none' }}>
        {state === 'ok' ? 'Go to my dashboard' : 'Log in'}
      </Link>
    </div>
  );
}
