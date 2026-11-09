import React, { useState, useEffect } from 'react';
import {
  RiCoinsFill,
  RiShieldCheckFill,
  RiCheckDoubleFill,
  RiAddFill,
  RiRefreshLine,
  RiFileTextFill,
  RiFilter3Line,
  RiSearchLine,
  RiPercentLine,
  RiTimeLine,
  RiCloseLine,
  RiSparklingFill
} from 'react-icons/ri';
import { dealsApi } from '../../lib/api.js';

export default function CatalogueAcquisitionLedger({ sessionUser }) {
  const [acquisitions, setAcquisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAcqForRecoup, setSelectedAcqForRecoup] = useState(null);
  const [recoupAmount, setRecoupAmount] = useState(1500);
  const [recoupSource, setRecoupSource] = useState('Q4 DSP Streaming Split Cascade');
  const [recoupSuccess, setRecoupSuccess] = useState('');
  const [recoupSubmitting, setRecoupSubmitting] = useState(false);

  // New Acquisition form
  const [newArtist, setNewArtist] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDealType, setNewDealType] = useState('publishing_advance');
  const [newAmount, setNewAmount] = useState(10000);
  const [newRate, setNewRate] = useState(50);
  const [newTracks, setNewTracks] = useState(12);
  const [newCrossCollateral, setNewCrossCollateral] = useState(true);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Inspection modal
  const [inspectAcq, setInspectAcq] = useState(null);

  const loadAcquisitions = async () => {
    setLoading(true);
    try {
      const data = await dealsApi.catalogueAcquisitions.list();
      if (Array.isArray(data)) {
        setAcquisitions(data);
      }
    } catch (err) {
      console.warn('Could not load catalogue acquisitions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcquisitions();
  }, []);

  const handleApplyRecoupment = async (e) => {
    e.preventDefault();
    if (!selectedAcqForRecoup || recoupAmount <= 0) return;
    setRecoupSubmitting(true);
    setRecoupSuccess('');
    try {
      const res = await dealsApi.catalogueAcquisitions.recoup(selectedAcqForRecoup.id || selectedAcqForRecoup._id, {
        amount: Number(recoupAmount),
        source: recoupSource
      });
      setRecoupSuccess(res.message || `Successfully applied $${Number(recoupAmount).toLocaleString()} recoupment!`);
      loadAcquisitions();
      setTimeout(() => {
        setSelectedAcqForRecoup(null);
        setRecoupSuccess('');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Recoupment failed');
    } finally {
      setRecoupSubmitting(false);
    }
  };

  const handleCreateAcquisition = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || newAmount <= 0) return;
    setCreateSubmitting(true);
    try {
      await dealsApi.catalogueAcquisitions.create({
        creator_id: sessionUser?.id || 'self',
        deal_type: newDealType,
        original_amount: Number(newAmount),
        recouped_to_date: 0,
        remaining_balance: Number(newAmount),
        cross_collateralized: newCrossCollateral,
        artist_name: newArtist.trim() || 'Roster Creator',
        catalogue_title: newTitle.trim(),
        track_count: Number(newTracks),
        recoupment_rate_pct: Number(newRate)
      });
      loadAcquisitions();
      setShowAddModal(false);
      setNewTitle('');
      setNewArtist('');
    } catch (err) {
      alert(err.message || 'Creation failed');
    } finally {
      setCreateSubmitting(false);
    }
  };

  // Metrics
  const totalDeployed = acquisitions.reduce((acc, a) => acc + (a.original_amount || 0), 0);
  const totalRecouped = acquisitions.reduce((acc, a) => acc + (a.recouped_to_date || 0), 0);
  const totalRemaining = acquisitions.reduce((acc, a) => acc + (a.remaining_balance || 0), 0);
  const percentRecouped = totalDeployed > 0 ? ((totalRecouped / totalDeployed) * 100).toFixed(1) : 0;
  const clearedCount = acquisitions.filter(a => (a.status === 'recouped' || (a.remaining_balance || 0) <= 0)).length;

  const filtered = acquisitions.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || (
      (a.catalogue_title && a.catalogue_title.toLowerCase().includes(q)) ||
      (a.artist_name && a.artist_name.toLowerCase().includes(q)) ||
      (a.passport_id && a.passport_id.toLowerCase().includes(q)) ||
      (a.deal_type && a.deal_type.toLowerCase().includes(q))
    );
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && (a.remaining_balance || 0) > 0) ||
      (statusFilter === 'recouped' && (a.status === 'recouped' || (a.remaining_balance || 0) <= 0));
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Advance Capital Deployed</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginTop: '4px' }}>
            ${totalDeployed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>{acquisitions.length} Active Catalogue Facilities</span>
        </div>

        <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Recouped via Split Cascade</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#00f2fe', marginTop: '4px' }}>
            ${totalRecouped.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '11px', color: '#00f2fe' }}>{percentRecouped}% Recoupment Velocity</span>
        </div>

        <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Encumbered Balance</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b', marginTop: '4px' }}>
            ${totalRemaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span style={{ fontSize: '11px', color: '#f59e0b' }}>Pending Liquidation</span>
        </div>

        <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Unencumbered Catalogues</span>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#10b981', marginTop: '4px' }}>
            {clearedCount} / {acquisitions.length}
          </div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>100% Cleared Sovereign Titles</span>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <RiSearchLine size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search acquisitions, artists, passport IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 12px 7px 30px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '7px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '3px', color: '#fff', fontSize: '12px' }}
          >
            <option value="all">All Facilities</option>
            <option value="active">Active Recoupment</option>
            <option value="recouped">100% Cleared</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={loadAcquisitions}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', padding: '7px 12px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RiRefreshLine /> Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '7px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RiAddFill /> Record New Advance / Purchase
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div style={{ background: '#090d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px', color: '#fff' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>PASSPORT / FACILITY</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>ARTIST / ROSTER ACT</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>DEAL TYPE</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>ORIGINAL ADVANCE</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>RECOUPMENT VELOCITY</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>REMAINING BALANCE</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold' }}>STATUS</th>
              <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: 'bold', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  Loading catalogue acquisitions ledger...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                  No catalogue acquisitions match your filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map(acq => {
                const orig = acq.original_amount || 0;
                const recouped = acq.recouped_to_date || 0;
                const rem = acq.remaining_balance || 0;
                const pct = orig > 0 ? Math.min(100, Math.round((recouped / orig) * 100)) : 100;
                const isCleared = acq.status === 'recouped' || rem <= 0;

                return (
                  <tr key={acq.id || acq._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{acq.catalogue_title || 'Master Catalogue'}</div>
                      <div style={{ fontSize: '11px', color: '#a855f7', fontFamily: 'monospace' }}>
                        {acq.passport_id || `TM-ACQ-2026-${(acq.id || acq._id || '').slice(-4).toUpperCase()}`}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: '600' }}>{acq.artist_name || 'Roster Creator'}</span>
                      {acq.track_count && (
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>{acq.track_count} Tracks Mastered</div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '3px', fontSize: '11px', textTransform: 'capitalize' }}>
                        {(acq.deal_type || 'advance').replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>
                      ${orig.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 16px', width: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', marginBottom: '4px' }}>
                        <span style={{ color: '#00f2fe' }}>${recouped.toLocaleString()}</span>
                        <span style={{ color: '#94a3b8' }}>{pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: isCleared ? '#10b981' : 'linear-gradient(90deg, #00f2fe, #a855f7)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold', color: isCleared ? '#10b981' : '#f59e0b' }}>
                      {isCleared ? '$0.00 (Cleared)' : `$${rem.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: isCleared ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isCleared ? '#10b981' : '#f59e0b'
                      }}>
                        {isCleared ? '✓ 100% Cleared' : '● Recouping'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {!isCleared && (
                          <button
                            type="button"
                            onClick={() => setSelectedAcqForRecoup(acq)}
                            style={{ background: '#10b981', color: '#060813', border: 'none', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            + Recoup
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setInspectAcq(acq)}
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '5px 10px', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Passport
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Recoupment Modal */}
      {selectedAcqForRecoup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#090d1a', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '4px', padding: '24px', maxWidth: '440px', width: '100%', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>Apply Recoupment Revenue</h3>
              <button type="button" onClick={() => setSelectedAcqForRecoup(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            {recoupSuccess && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '3px', color: '#10b981', fontSize: '12px', marginBottom: '12px' }}>
                ✓ {recoupSuccess}
              </div>
            )}

            <form onSubmit={handleApplyRecoupment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>TARGET FACILITY</span>
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{selectedAcqForRecoup.catalogue_title}</div>
                <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>
                  Current Encumbered Balance: ${selectedAcqForRecoup.remaining_balance?.toLocaleString()}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>RECOUPMENT AMOUNT ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  max={selectedAcqForRecoup.remaining_balance || 100000}
                  value={recoupAmount}
                  onChange={(e) => setRecoupAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '6px' }}>REVENUE SETTLEMENT SOURCE</label>
                <select
                  value={recoupSource}
                  onChange={(e) => setRecoupSource(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                >
                  <option value="Q4 DSP Streaming Split Cascade">Q4 DSP Streaming Split Cascade</option>
                  <option value="Sync Placement Escrow Clearance">Sync Placement Escrow Clearance</option>
                  <option value="Direct Distributor Statement Statement Payout">Direct Distributor Statement Payout</option>
                  <option value="TuneStream Superfan Tipping Allocation">TuneStream Superfan Tipping Allocation</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedAcqForRecoup(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '7px 14px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={recoupSubmitting} style={{ background: '#10b981', color: '#060813', border: 'none', padding: '7px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {recoupSubmitting ? 'Applying...' : `Execute $${Number(recoupAmount).toLocaleString()} Recoupment`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record New Acquisition Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#090d1a', border: '1px solid rgba(0,242,254,0.3)', borderRadius: '4px', padding: '24px', maxWidth: '520px', width: '100%', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#00f2fe' }}>Record New Advance / Catalogue Acquisition</h3>
              <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateAcquisition} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>CATALOGUE FACILITY TITLE</label>
                <input
                  type="text"
                  placeholder="e.g. West African Afrobeats Master Acquisition (Tranche 1)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>ARTIST / ROSTER ACT</label>
                  <input
                    type="text"
                    placeholder="e.g. Ndufo Victoria"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>DEAL TYPE</label>
                  <select
                    value={newDealType}
                    onChange={(e) => setNewDealType(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  >
                    <option value="publishing_advance">Publishing Advance</option>
                    <option value="distribution_advance">Distribution Advance</option>
                    <option value="catalogue_purchase">Catalogue Purchase / Buyout</option>
                    <option value="sync_advance">Sync Placement Advance</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>ADVANCE AMOUNT ($ USD)</label>
                  <input
                    type="number"
                    min="100"
                    value={newAmount}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>RECOUPMENT RATE (%)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={newRate}
                    onChange={(e) => setNewRate(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newCrossCollateral}
                  onChange={(e) => setNewCrossCollateral(e.target.checked)}
                />
                <span>Cross-collateralize across all releases on this artist roster</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', padding: '7px 14px', borderRadius: '3px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={createSubmitting} style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '7px 16px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {createSubmitting ? 'Recording...' : 'Register Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Passport Inspection Modal */}
      {inspectAcq && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#090d1a', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px', padding: '28px', maxWidth: '480px', width: '100%', color: '#fff', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168,85,247,0.15)', border: '1px solid #a855f7', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <RiShieldCheckFill size={24} />
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: '900' }}>Catalogue Acquisition Passport</h3>
            <span style={{ fontSize: '12px', color: '#c084fc', fontFamily: 'monospace', fontWeight: 'bold' }}>
              {inspectAcq.passport_id || 'TM-ACQ-2026-VERIFIED'}
            </span>

            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.08)', margin: '18px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Catalogue:</span>
                <strong style={{ color: '#fff' }}>{inspectAcq.catalogue_title}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Roster Act:</span>
                <strong style={{ color: '#fff' }}>{inspectAcq.artist_name || 'Roster Creator'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Original Facility:</span>
                <strong style={{ color: '#fff' }}>${inspectAcq.original_amount?.toLocaleString()} USD</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Recouped via Splits:</span>
                <strong style={{ color: '#10b981' }}>${inspectAcq.recouped_to_date?.toLocaleString()} USD</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Remaining Encumbrance:</span>
                <strong style={{ color: inspectAcq.remaining_balance > 0 ? '#f59e0b' : '#10b981' }}>
                  {inspectAcq.remaining_balance > 0 ? `$${inspectAcq.remaining_balance?.toLocaleString()} USD` : '$0.00 (Unencumbered Freedom)'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                <span style={{ color: '#94a3b8' }}>Statutory Clearance:</span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>Section 9.7 Verified Non-Reversion</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInspectAcq(null)}
              style={{ background: '#00f2fe', color: '#060813', border: 'none', padding: '8px 22px', borderRadius: '3px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Close Passport
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
