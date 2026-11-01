import React, { useState } from 'react';
import {
  RiCloseLine,
  RiCheckDoubleLine,
  RiUploadCloud2Line,
  RiMusic2Fill,
} from 'react-icons/ri';
import { distroApi } from '../../lib/api.js';

export default function BulkDeliverModal({
  isOpen,
  onClose,
  onSuccess,
  releases = [],
  supportedOutlets = [],
}) {
  const [selectedReleaseIds, setSelectedReleaseIds] = useState(() =>
    releases.slice(0, 5).map((r) => r._id)
  );
  const [selectedOutlets, setSelectedOutlets] = useState(() =>
    supportedOutlets.map((o) => o.id)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleRelease = (id) => {
    setSelectedReleaseIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const toggleOutlet = (oid) => {
    setSelectedOutlets((prev) =>
      prev.includes(oid) ? prev.filter((id) => id !== oid) : [...prev, oid]
    );
  };

  const selectAllReleases = () => {
    setSelectedReleaseIds(releases.map((r) => r._id));
  };

  const handleBulkSubmit = async () => {
    if (selectedReleaseIds.length === 0) {
      setError('Please select at least one release.');
      return;
    }
    if (selectedOutlets.length === 0) {
      setError('Please select at least one target outlet.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await distroApi.bulkDeliver({
        release_ids: selectedReleaseIds,
        target_outlets: selectedOutlets,
      });
      setSubmitting(false);
      if (onSuccess) onSuccess(res);
      onClose();
    } catch (err) {
      setSubmitting(false);
      setError(err?.message || 'Failed to execute bulk delivery.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0b0f1e',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '3px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(168,85,247,0.1) 0%, rgba(0,242,254,0.05) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '3px',
                background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <RiCheckDoubleLine size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                Bulk Catalog Distribution Dispatch
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Batch deliver multiple roster tracks to selected outlets in one operation
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
            }}
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                borderRadius: '3px',
                color: '#fca5a5',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {/* Releases Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                Select Catalog Releases ({selectedReleaseIds.length} of {releases.length} selected)
              </label>
              <button
                type="button"
                onClick={selectAllReleases}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Select All
              </button>
            </div>

            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                padding: '8px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              {releases.map((r) => {
                const isSelected = selectedReleaseIds.includes(r._id);
                return (
                  <label
                    key={r._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                      border: isSelected ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRelease(r._id)}
                        style={{ accentColor: '#a855f7' }}
                      />
                      <div>
                        <strong style={{ fontSize: '13px', color: '#fff' }}>{r.title}</strong>
                        <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>
                          {r.artist} • {r.genre} • ISRC: {r.isrc}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.06)',
                        color: r.status === 'LIVE' ? '#10b981' : '#f59e0b',
                        fontWeight: 700,
                      }}
                    >
                      {r.status}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Outlets Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              Target Outlets ({selectedOutlets.length} of {supportedOutlets.length} selected)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {supportedOutlets.map((o) => {
                const isChecked = selectedOutlets.includes(o.id);
                return (
                  <label
                    key={o.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: isChecked ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isChecked ? '1px solid var(--cyan)' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: isChecked ? '#fff' : '#94a3b8',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOutlet(o.id)}
                      style={{ accentColor: 'var(--cyan)' }}
                    />
                    <span>{o.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleBulkSubmit}
            disabled={submitting}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '3px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: submitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {submitting ? 'Executing Bulk Delivery...' : `Deliver ${selectedReleaseIds.length} Releases to Outlets`}
          </button>
        </div>
      </div>
    </div>
  );
}
