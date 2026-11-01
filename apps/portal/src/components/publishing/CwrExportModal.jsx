import React, { useState, useEffect } from 'react';
import { 
  RiCloseLine, RiFileCodeLine, RiDownloadLine, 
  RiCheckLine, RiShieldCheckFill, RiFileCopyLine 
} from 'react-icons/ri';
import { publishingApi } from '../../lib/api';

export default function CwrExportModal({ isOpen, onClose, works = [] }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(true);
  const [cwrData, setCwrData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    publishingApi.exportCwr({ work_ids: works.map(w => w.work_code || w.id) })
      .then(res => {
        if (isMounted) setCwrData(res);
      })
      .catch(err => {
        if (isMounted) setError(err?.message || 'Failed to generate CWR manifest');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [works]);

  const handleCopy = () => {
    if (cwrData?.cwr_text_preview) {
      navigator.clipboard.writeText(cwrData.cwr_text_preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!cwrData?.cwr_text_preview) return;
    const blob = new Blob([cwrData.cwr_text_preview], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = cwrData.file_name || 'CWR_BATCH_EXPORT.v21';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0d111c',
        border: '1px solid #1e293b',
        borderRadius: '3px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#f8fafc',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '3px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <RiFileCodeLine size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
                CISAC CWR 2.1 Electronic Manifest
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Common Works Registration standard batch for ASCAP, BMI, The MLC, and PRS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Generating CISAC CWR 2.1 electronic transmission manifest...
            </div>
          ) : error ? (
            <div style={{ color: '#ef4444', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '3px' }}>
              {error}
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <div style={{ background: '#161e2e', padding: '12px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>File Name</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#22d3ee', marginTop: '2px', fontFamily: 'monospace' }}>
                    {cwrData?.file_name}
                  </div>
                </div>
                <div style={{ background: '#161e2e', padding: '12px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Standard</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                    CISAC CWR 2.1 Rev 8
                  </div>
                </div>
                <div style={{ background: '#161e2e', padding: '12px', borderRadius: '3px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Targeted Hubs</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                    6 Global Societies
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <pre style={{
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '3px',
                  padding: '16px',
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  lineHeight: '1.6',
                  overflowX: 'auto',
                  maxHeight: '260px'
                }}>
                  {cwrData?.cwr_text_preview}
                </pre>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <RiCheckLine color="#10b981" /> : <RiFileCopyLine />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: '#94a3b8',
                    padding: '10px 18px',
                    borderRadius: '3px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  style={{
                    background: '#10b981',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '3px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <RiDownloadLine size={16} /> Download .V21 Manifest
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
