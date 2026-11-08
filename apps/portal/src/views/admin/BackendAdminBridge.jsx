import React, { useEffect } from 'react';
import { RiShieldFill, RiExternalLinkLine, RiLockPasswordLine, RiArrowRightLine } from 'react-icons/ri';

export default function BackendAdminBridge() {
  const backendAdminUrl = 'http://localhost:8001/admin';

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--bg-dark, #060813)'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#0b1120',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1, margin: '0 auto 20px auto' }}>
          <img src="/tunemavens-logo-white.png" alt="TuneMavens Logo" style={{ height: '36px', width: 'auto', display: 'block' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#00f0ff', marginTop: '-3px', alignSelf: 'flex-end' }}>admin</span>
        </div>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '3px',
          background: 'rgba(0, 240, 255, 0.1)',
          border: '1px solid #00f0ff',
          color: '#00f0ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          fontSize: '28px'
        }}>
          <RiShieldFill />
        </div>

        <div style={{
          display: 'inline-block',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '3px 8px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          Dedicated Backend Operations Engine
        </div>

        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '10px'
        }}>
          TuneMavens Operations & RBAC Admin Console
        </h2>

        <p style={{
          color: '#94a3b8',
          fontSize: '13px',
          lineHeight: '1.6',
          marginBottom: '24px'
        }}>
          In accordance with security architecture standards, the administration console is hosted completely in the backend operations environment (<code style={{ color: '#00f0ff' }}>http://localhost:8001/admin</code>) with persona-based permissions and security isolation.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a
            href={backendAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#00f0ff',
              color: '#060813',
              border: 'none',
              borderRadius: '3px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            Launch Backend Admin App <RiExternalLinkLine />
          </a>
          <a
            href="/#/community"
            style={{
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '3px',
              padding: '10px 18px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Return to Community
          </a>
        </div>
      </div>
    </div>
  );
}
