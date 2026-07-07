import React from 'react'
import { Link } from 'react-router-dom'

export default function ComingSoonApp({ name, goBack, sessionUser }) {
  return (
    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'rgba(6, 8, 19, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r)', maxWidth: '600px', margin: '0 auto' }}>
      <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>🚀</span>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>{name}</h2>
      <p style={{ fontSize: '12px', color: 'var(--mu)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
        This standalone module is currently locked in preview. Secure early access credentials to launch custom instances in production.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={goBack} className="plan-btn outline" style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Go Back
        </button>
        <Link to={sessionUser ? "/dashboard" : "/register"} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', cursor: 'pointer' }}>
          {sessionUser ? "Go to Dashboard" : "Get Sandbox Key"}
        </Link>
      </div>
    </div>
  );
}
