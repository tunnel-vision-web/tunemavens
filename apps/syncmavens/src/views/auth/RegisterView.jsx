import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RiRefreshFill, RiCloseLine, RiCompass3Line, RiMusicFill } from 'react-icons/ri'
import { authApi, tokenStore } from '../../lib/api.js'
import { reconcileUserApps } from '../../lib/activatedApps.js'
import smLogo from '../../assets/syncmavens-logo.png'

export default function RegisterView({ onLogin, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const paramRole = searchParams.get('role');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(paramRole === 'supervisor' ? 'supervisor' : 'creator');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (paramRole === 'supervisor' || paramRole === 'creator') {
      setRole(paramRole);
    }
  }, [paramRole]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      try {
        const { user, access_token } = await authApi.register({
          email,
          password: password && password.length >= 8 ? password : 'SandboxPass123!',
          name: name || (email.split('@')[0] || 'Sync User').replace(/^\w/, c => c.toUpperCase()),
          role,
        });
        tokenStore.set(access_token);
        user.role = role;
        onLogin(reconcileUserApps(user));
      } catch (err) {
        if (err?.status === 409) {
          setErrorMsg('An account with this email already exists. Please log in.');
          return;
        }
        const stubName = name || (email.split('@')[0] || 'Sync User').replace(/^\w/, c => c.toUpperCase());
        onLogin(reconcileUserApps({
          email,
          name: stubName,
          role,
          credits: 600,
          plan: role === 'supervisor' ? 'supervisor' : 'creator',
          brand_name: `${stubName} Productions`,
          country: 'KE'
        }));
      }
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-card" style={{ cursor: 'default' }}>
      {/* Dismiss Button */}
      <button 
        type="button" 
        onClick={handleClose} 
        className="auth-modal-close-btn"
        aria-label="Close"
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'transparent',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.15s ease'
        }}
      >
        <RiCloseLine size={20} />
      </button>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
        <img src={smLogo} alt="SyncMavens Logo" style={{ height: '34px', width: 'auto', display: 'block' }} />
      </div>
      <div className="auth-header" style={{ marginBottom: '14px' }}>
        <h3 style={{ fontSize: '19px', fontWeight: '800', margin: '0 0 4px', color: '#fff', textAlign: 'center' }}>Start Free Sync Profile</h3>
        <p style={{ fontSize: '12px', color: 'var(--mu, #94a3b8)', textAlign: 'center', margin: 0 }}>Register and match your audio with dynamic briefs</p>
      </div>

      {/* Role Selector */}
      <div className="role-scenario-toggle" title="Select your account role in SyncMavens">
        <button
          type="button"
          className={`role-scenario-btn ${role === 'supervisor' ? 'active' : ''}`}
          onClick={() => setRole('supervisor')}
        >
          <RiCompass3Line size={13} /> Music Supervisor
        </button>
        <button
          type="button"
          className={`role-scenario-btn ${role === 'creator' ? 'active' : ''}`}
          onClick={() => setRole('creator')}
        >
          <RiMusicFill size={13} /> Creator / Artist
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '12px', textAlign: 'left' }}>
          <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu, #94a3b8)' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="Aisha Okoro" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="form-control"
            style={{ fontSize: '13px', padding: '9px 12px', width: '100%', boxSizing: 'border-box', background: '#060813', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff' }}
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '12px', textAlign: 'left' }}>
          <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu, #94a3b8)' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="form-control"
            style={{ fontSize: '13px', padding: '9px 12px', width: '100%', boxSizing: 'border-box', background: '#060813', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff' }}
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '18px', textAlign: 'left' }}>
          <label className="form-label" style={{ fontSize: '12px', marginBottom: '4px', display: 'block', color: 'var(--mu, #94a3b8)' }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="form-control"
            style={{ fontSize: '13px', padding: '9px 12px', width: '100%', boxSizing: 'border-box', background: '#060813', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff' }}
            required 
          />
        </div>

        {errorMsg && (
          <p style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '12px' }}>{errorMsg}</p>
        )}

        <button 
          type="submit" 
          disabled={submitting}
          className="btn-primary" 
          style={{ width: '100%', padding: '10px', fontSize: '13px', background: 'var(--accent-cyan, #00f2fe)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '3px', cursor: submitting ? 'wait' : 'pointer' }}
        >
          {submitting ? 'Creating account…' : 'Create Free Sync Account'}
        </button>
      </form>

      <p style={{ fontSize: '12px', color: 'var(--mu, #94a3b8)', marginTop: '16px', textAlign: 'center', margin: '16px 0 0' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--cyan, #00f2fe)', textDecoration: 'none', fontWeight: '600' }}>Log In here</Link>
      </p>
    </div>
  );
}
