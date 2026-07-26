import React, { useState, useEffect } from 'react';

export default function CmsAdminView() {
  const [layoutId, setLayoutId] = useState('home_hero');
  const [layoutData, setLayoutData] = useState({
    hero_title: 'Intermaven Network',
    hero_subtitle: 'The Premier Music Business Ecosystem',
    primary_accent: '#863bff',
    localized_keys: {
      us: { hero_title: 'Intermaven Network US' },
      uk: { hero_title: 'Intermaven Network UK' }
    }
  });
  const [currentVersion, setCurrentVersion] = useState(1);
  const [history, setHistory] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLayout(layoutId);
  }, [layoutId]);

  const fetchLayout = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/layouts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLayoutData(data.data || {});
        setCurrentVersion(data.version || 1);
        fetchHistory(id);
      }
    } catch (err) {
      console.error('Failed to fetch layout:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const res = await fetch(`/api/cms/layouts/${id}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch('/api/cms/layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          layout_id: layoutId,
          data: layoutData
        })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentVersion(data.version);
        setStatusMsg(`Successfully saved layout v${data.version}`);
        fetchHistory(layoutId);
      } else {
        setStatusMsg('Error saving layout.');
      }
    } catch (err) {
      setStatusMsg('Network error saving layout.');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version) => {
    if (!window.confirm(`Are you sure you want to rollback to v${version}?`)) return;
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await fetch(`/api/cms/layouts/${layoutId}/rollback/${version}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setLayoutData(data.data || {});
        setCurrentVersion(data.version);
        setStatusMsg(`Successfully rolled back to snapshot v${version} (New v${data.version})`);
        fetchHistory(layoutId);
      } else {
        setStatusMsg('Error executing rollback.');
      }
    } catch (err) {
      setStatusMsg('Network error executing rollback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#0b0f19', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#ffffff' }}>Mother-CMS Layout Management & Version Rollback</h1>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Configure multi-tenant UI grids, localized key overlays, and audit version history.</p>
        </div>
        <div style={{ background: '#1e1b4b', border: '1px solid #7c3aed', padding: '6px 14px', borderRadius: '20px', color: '#c084fc', fontWeight: 'bold' }}>
          Active v{currentVersion}
        </div>
      </div>

      {statusMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
          {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Layout Data Editor */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Select Layout Target:</label>
            <select 
              value={layoutId} 
              onChange={(e) => setLayoutId(e.target.value)}
              style={{ background: '#0a0e1a', color: '#fff', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', width: '100%' }}
            >
              <option value="home_hero">Home Hero Section (`home_hero`)</option>
              <option value="marketplace_grid">Marketplace Grid (`marketplace_grid`)</option>
              <option value="tunestream_player">TuneStream Audio Player (`tunestream_player`)</option>
              <option value="sync_gallery">Sync Ready Gallery (`sync_gallery`)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Layout JSON Config & Localized Overlays:</label>
            <textarea
              rows={14}
              value={JSON.stringify(layoutData, null, 2)}
              onChange={(e) => {
                try {
                  setLayoutData(JSON.parse(e.target.value));
                } catch (err) {
                  // Keep raw text editing
                }
              }}
              style={{ background: '#0a0e1a', color: '#38bdf8', fontFamily: 'monospace', border: '1px solid #334155', padding: '12px', borderRadius: '6px', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{ background: '#863bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Saving...' : `Save & Publish v${currentVersion + 1}`}
          </button>
        </div>

        {/* Version History Sidebar */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f8fafc' }}>Snapshot History Ledger</h3>

          {history.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px' }}>No historic snapshot versions recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((item) => (
                <div key={item.version} style={{ background: '#0a0e1a', border: '1px solid #1e293b', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#a855f7', fontSize: '14px' }}>Version v{item.version}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(item.created_at || Date.now()).toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>By: {item.updated_by}</div>
                  </div>
                  {item.version !== currentVersion && (
                    <button
                      onClick={() => handleRollback(item.version)}
                      style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Rollback
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
