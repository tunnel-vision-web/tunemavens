import React, { useEffect, useState } from 'react'
import {
  RiMailSendFill,
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSendPlaneFill,
  RiRefreshLine,
  RiCalendarEventFill,
  RiCheckLine,
  RiCloseFill,
  RiUserAddLine,
  RiLinksLine,
} from 'react-icons/ri'
import { API_BASE } from '../lib/api.js'

export default function EmailReachoutManager({ sessionUser }) {
  const [groups, setGroups] = useState([])
  const [affiliates, setAffiliates] = useState([])
  const [events, setEvents] = useState([])
  const [activitySummary, setActivitySummary] = useState({
    clicks: 0,
    rsvps: 0,
    onboardings: 0,
    purchases: 0,
    total_spend_usd: 0,
    total_commission_usd: 0,
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // New Target Group form
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [tgName, setTgName] = useState('')
  const [tgDesc, setTgDesc] = useState('')
  const [tgAffiliateRef, setTgAffiliateRef] = useState('')
  const [tgBulkText, setTgBulkText] = useState('')
  const [savingGroup, setSavingGroup] = useState(false)

  // Manage Group Contacts modal/panel
  const [managingGroup, setManagingGroup] = useState(null)
  const [newEntryName, setNewEntryName] = useState('')
  const [newEntryEmail, setNewEntryEmail] = useState('')
  const [editingEntryId, setEditingEntryId] = useState(null)
  const [editEntryName, setEditEntryName] = useState('')
  const [editEntryEmail, setEditEntryEmail] = useState('')

  // Reachout Composer
  const [campTitle, setCampTitle] = useState('')
  const [campGroupId, setCampGroupId] = useState('')
  const [campAffiliateRef, setCampAffiliateRef] = useState('')
  const [campPromoType, setCampPromoType] = useState('event') // 'event' | 'product_service'
  const [campEventId, setCampEventId] = useState('')
  const [campProductName, setCampProductName] = useState('')
  const [campCtaRsvp, setCampCtaRsvp] = useState(true)
  const [campCtaTicket, setCampCtaTicket] = useState(true)
  const [campCtaLabel, setCampCtaLabel] = useState('Explore TuneMavens')
  const [campCtaUrl, setCampCtaUrl] = useState('/stream')
  const [campSubject, setCampSubject] = useState('')
  const [campBody, setCampBody] = useState('')
  const [dispatching, setDispatching] = useState(false)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4500)
  }

  const loadAll = async () => {
    setLoading(true)
    try {
      const [gRes, aRes, eRes, actRes] = await Promise.all([
        fetch(`${API_BASE}/api/crm/target-groups`, { credentials: 'include' }).then(r => r.json()).catch(() => ({ groups: [] })),
        fetch(`${API_BASE}/api/affiliates/admin/roster`, { credentials: 'include' }).then(r => r.json()).catch(() => ({ affiliates: [] })),
        fetch(`${API_BASE}/api/events`, { credentials: 'include' }).then(r => r.json()).catch(() => ({ events: [] })),
        fetch(`${API_BASE}/api/crm/reachout/activity`, { credentials: 'include' }).then(r => r.json()).catch(() => ({ summary: {}, activities: [] })),
      ])
      const loadedGroups = gRes.groups || []
      const loadedAffs = aRes.affiliates || []
      const loadedEvents = Array.isArray(eRes) ? eRes : (eRes.events || [])

      setGroups(loadedGroups)
      setAffiliates(loadedAffs)
      setEvents(loadedEvents)
      setActivitySummary(actRes.summary || {})
      setActivities(actRes.activities || [])

      if (!campGroupId && loadedGroups.length > 0) setCampGroupId(loadedGroups[0].id)
      if (!campEventId && loadedEvents.length > 0) setCampEventId(loadedEvents[0].id)
      if (!campAffiliateRef && loadedAffs.length > 0) setCampAffiliateRef(loadedAffs[0].ref_code)
      if (!tgAffiliateRef && loadedAffs.length > 0) setTgAffiliateRef(loadedAffs[0].ref_code)
    } catch (err) {
      console.error('Error loading Email Reachout Manager:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!tgName.trim()) {
      notify('Please enter a Target Group name.', 'error')
      return
    }
    const entries = []
    tgBulkText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .forEach(line => {
        const parts = line.split(',').map(p => p.trim())
        if (parts.length >= 2) {
          entries.push({ name: parts[0], email: parts[1] })
        } else if (line.includes('@')) {
          entries.push({ name: line.split('@')[0], email: line })
        }
      })

    setSavingGroup(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: tgName.trim(),
          description: tgDesc.trim(),
          affiliate_ref_code: tgAffiliateRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          entries,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not create target group')
      notify(`Email-only Target Group "${data.name}" created with ${data.member_count} contact(s).`)
      setTgName('')
      setTgDesc('')
      setTgBulkText('')
      setShowNewGroup(false)
      setCampGroupId(data.id)
      await loadAll()
    } catch (err) {
      notify(err.message || 'Failed to create group', 'error')
    } finally {
      setSavingGroup(false)
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Delete this Target Group and all its email entries?')) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete group')
      if (managingGroup?.id === groupId) setManagingGroup(null)
      notify('Target group deleted.')
      await loadAll()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const openManageContacts = async (groupId) => {
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load group contacts')
      const data = await res.json()
      setManagingGroup(data)
      setEditingEntryId(null)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleAddEntry = async (e) => {
    e.preventDefault()
    if (!managingGroup || !newEntryName.trim() || !newEntryEmail.trim()) {
      notify('Contact Name and Email address are required.', 'error')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newEntryName.trim(), email: newEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not add contact')
      setManagingGroup(data.group)
      setNewEntryName('')
      setNewEntryEmail('')
      notify('Contact added to target group.')
      loadAll()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleSaveEditEntry = async (entryId) => {
    if (!managingGroup || !editEntryName.trim() || !editEntryEmail.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editEntryName.trim(), email: editEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not update contact')
      setManagingGroup(data.group)
      setEditingEntryId(null)
      notify('Contact updated.')
      loadAll()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!managingGroup) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not remove contact')
      setManagingGroup(data.group)
      notify('Contact removed.')
      loadAll()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleLaunchReachout = async (e) => {
    e.preventDefault()
    if (!campGroupId) {
      notify('Please create and select an Email-Only Target Group first.', 'error')
      return
    }
    if (!campTitle.trim() || !campSubject.trim() || !campBody.trim()) {
      notify('Campaign Title, Subject, and Message Body are required.', 'error')
      return
    }
    const event_ctas = []
    if (campPromoType === 'event') {
      if (!campEventId) {
        notify('Please select a Live Event.', 'error')
        return
      }
      if (campCtaRsvp) event_ctas.push('rsvp')
      if (campCtaTicket) event_ctas.push('ticket')
      if (event_ctas.length === 0) {
        notify('Select at least one Event CTA (RSVP or Buy Ticket).', 'error')
        return
      }
    }

    setDispatching(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: campTitle.trim(),
          target_group_id: campGroupId,
          affiliate_ref_code: campAffiliateRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          promotion_type: campPromoType,
          event_id: campPromoType === 'event' ? campEventId : undefined,
          event_ctas,
          product_name: campPromoType === 'product_service' ? campProductName.trim() : undefined,
          cta_label: campCtaLabel.trim() || undefined,
          cta_url: campCtaUrl.trim() || undefined,
          subject: campSubject.trim(),
          body: campBody.trim(),
          channels: ['email'],
          dispatch_now: true,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to dispatch email reachout')
      notify(`Email reachout dispatched to ${data.recipient_count || 0} recipient(s) under affiliate ${data.affiliate_ref_code || 'account'}!`)
      setCampTitle('')
      setCampSubject('')
      setCampBody('')
      await loadAll()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setDispatching(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Toast banner */}
      {toast && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '4px',
            background: toast.type === 'error' ? 'rgba(239,68,68,0.14)' : 'rgba(16,185,129,0.14)',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : '#10b981'}`,
            color: toast.type === 'error' ? '#fca5a5' : '#34d399',
            fontSize: '0.84rem',
            fontWeight: 700,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Email-Only Policy Banner */}
      <div
        style={{
          background: '#080e1c',
          border: '1px solid rgba(0,240,255,0.28)',
          borderLeft: '4px solid #00f0ff',
          borderRadius: '4px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ fontWeight: 900, color: '#00f0ff', fontSize: '0.92rem' }}>
            📧 Email-Only Target Groups &amp; Affiliate-Tracked Reachout Engine
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
            Contacts use <strong>Names &amp; Email addresses only</strong> (no phone numbers, SMS, or WhatsApp to avoid texting costs and WhatsApp flagging). Every link tracks clicks, event RSVPs, user onboarding, and platform spend under the initiating affiliate with dual <strong>In-App Inbox + Registered Email</strong> alerts.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={loadAll}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '7px 12px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RiRefreshLine size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowNewGroup(v => !v)}
            style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '7px 14px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RiAddLine size={16} /> {showNewGroup ? 'Close Form' : 'New Target Group'}
          </button>
        </div>
      </div>

      {/* Create Target Group Form */}
      {showNewGroup && (
        <form
          onSubmit={handleCreateGroup}
          style={{ background: '#09101f', border: '1px solid rgba(0,240,255,0.35)', borderRadius: '6px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>Create Email-Only Target Group</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Group Name *</label>
              <input value={tgName} onChange={e => setTgName(e.target.value)} required placeholder="e.g. Nairobi VIP Music Lovers Q4" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Description</label>
              <input value={tgDesc} onChange={e => setTgDesc(e.target.value)} placeholder="e.g. Live event RSVP & ticket outreach list" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Owner / Affiliate Account</label>
              <select value={tgAffiliateRef} onChange={e => setTgAffiliateRef(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
                <option value="TM-ADMIN">TuneMavens Admin (House Account · TM-ADMIN)</option>
                {affiliates.map(a => (
                  <option key={a.ref_code} value={a.ref_code}>{a.name} ({a.ref_code})</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              Initial Contacts — One per line as <code>Name, email@domain.com</code> (Email-only, no phone numbers)
            </label>
            <textarea
              rows={4}
              value={tgBulkText}
              onChange={e => setTgBulkText(e.target.value)}
              placeholder={'Wanjiku Mwangi, wanjiku@example.com\nBrian Otieno, brian@example.com'}
              style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setShowNewGroup(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={savingGroup} style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' }}>
              {savingGroup ? 'Saving...' : 'Save Target Group'}
            </button>
          </div>
        </form>
      )}

      {/* Target Groups Table */}
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 800, fontSize: '0.86rem', color: '#fff' }}>
          Email-Only Target Groups ({groups.length})
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Group Name</th>
                <th style={{ padding: '10px 14px' }}>Email Contacts</th>
                <th style={{ padding: '10px 14px' }}>Initiating Affiliate</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>Loading target groups...</td></tr>
              ) : groups.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>No target groups yet. Click "New Target Group" above to create one with Names &amp; Emails.</td></tr>
              ) : (
                groups.map(g => (
                  <tr key={g.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#fff' }}>{g.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{g.description || 'Email-only reachout list'}</div>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ background: 'rgba(0,240,255,0.14)', color: '#00f0ff', padding: '2px 8px', borderRadius: '10px', fontWeight: 800, fontSize: '0.72rem' }}>
                        {g.member_count || 0} emails
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#34d399', fontSize: '0.76rem' }}>
                      {g.affiliate_ref_code || 'Account Default'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => openManageContacts(g.id)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <RiEditLine size={13} /> Manage Contacts
                        </button>
                        <button type="button" onClick={() => { setCampGroupId(g.id); if (g.affiliate_ref_code) setCampAffiliateRef(g.affiliate_ref_code); notify(`Selected "${g.name}" in Reachout Composer below.`) }} style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}>
                          Use in Reachout
                        </button>
                        <button type="button" onClick={() => handleDeleteGroup(g.id)} style={{ background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '4px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer' }}>
                          <RiDeleteBinLine size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline Manage Contacts Panel (Add / Edit / Delete Entries) */}
      {managingGroup && (
        <div style={{ background: '#09101f', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '6px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.9rem' }}>
              <RiUserAddLine style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Manage Contacts: {managingGroup.name} ({managingGroup.member_count || 0} Email-Only)
            </div>
            <button type="button" onClick={() => setManagingGroup(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <RiCloseFill size={20} />
            </button>
          </div>
          <form onSubmit={handleAddEntry} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '14px' }}>
            <input value={newEntryName} onChange={e => setNewEntryName(e.target.value)} placeholder="Contact Full Name" required style={{ padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }} />
            <input type="email" value={newEntryEmail} onChange={e => setNewEntryEmail(e.target.value)} placeholder="email@domain.com (no phone numbers)" required style={{ padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }} />
            <button type="submit" style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 14px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' }}>+ Add Contact</button>
          </form>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Email Address</th>
                <th style={{ padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(managingGroup.entries || []).length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '14px', textAlign: 'center', color: '#64748b' }}>No contacts yet. Add a Name &amp; Email above.</td></tr>
              ) : (
                (managingGroup.entries || []).map(ent => (
                  <tr key={ent.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px', color: '#fff', fontWeight: 700 }}>
                      {editingEntryId === ent.id ? (
                        <input value={editEntryName} onChange={e => setEditEntryName(e.target.value)} style={{ padding: '4px 8px', background: '#04070f', border: '1px solid #00f0ff', color: '#fff', borderRadius: '3px', width: '90%' }} />
                      ) : ent.name}
                    </td>
                    <td style={{ padding: '8px', color: '#00f0ff' }}>
                      {editingEntryId === ent.id ? (
                        <input type="email" value={editEntryEmail} onChange={e => setEditEntryEmail(e.target.value)} style={{ padding: '4px 8px', background: '#04070f', border: '1px solid #00f0ff', color: '#fff', borderRadius: '3px', width: '95%' }} />
                      ) : ent.email}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {editingEntryId === ent.id ? (
                          <>
                            <button type="button" onClick={() => handleSaveEditEntry(ent.id)} style={{ background: '#10b981', border: 'none', color: '#000', padding: '4px 8px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}><RiCheckLine size={13} /></button>
                            <button type="button" onClick={() => setEditingEntryId(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer' }}><RiCloseFill size={13} /></button>
                          </>
                        ) : (
                          <>
                            <button type="button" onClick={() => { setEditingEntryId(ent.id); setEditEntryName(ent.name); setEditEntryEmail(ent.email) }} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem' }}>Edit</button>
                            <button type="button" onClick={() => handleDeleteEntry(ent.id)} style={{ background: 'rgba(239,68,68,0.16)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.72rem' }}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Email Reachout Composer */}
      <form
        onSubmit={handleLaunchReachout}
        style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <div style={{ fontWeight: 900, fontSize: '0.92rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RiMailSendFill color="#00f0ff" size={18} />
          Compose &amp; Dispatch Email Reachout (Products/Services or Live Events)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Email Group *</label>
            <select value={campGroupId} onChange={e => setCampGroupId(e.target.value)} required style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
              <option value="">-- Select Target Group --</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.member_count || 0} emails)</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Initiating Affiliate Account *</label>
            <select value={campAffiliateRef} onChange={e => setCampAffiliateRef(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
              <option value="TM-ADMIN">TuneMavens Admin (House Account · TM-ADMIN)</option>
              {affiliates.map(a => (
                <option key={a.ref_code} value={a.ref_code}>{a.name} ({a.ref_code})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Promotion Type *</label>
            <select value={campPromoType} onChange={e => setCampPromoType(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
              <option value="event">Live Event (Direct RSVP &amp; Ticket Email CTAs)</option>
              <option value="product_service">Product / Service Promotion</option>
            </select>
          </div>
        </div>

        {campPromoType === 'event' ? (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '4px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                <RiCalendarEventFill style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Select Live Event *
              </label>
              <select value={campEventId} onChange={e => setCampEventId(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
                <option value="">-- Select Event --</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.title} — {ev.artist} ({ev.payment_mode || 'paid'})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={campCtaRsvp} onChange={e => setCampCtaRsvp(e.target.checked)} /> Direct "RSVP Now" Email CTA
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={campCtaTicket} onChange={e => setCampCtaTicket(e.target.checked)} /> Direct "Buy Ticket Now" Email CTA
              </label>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Product / Service Name</label>
              <input value={campProductName} onChange={e => setCampProductName(e.target.value)} placeholder="e.g. TuneStream Lossless, SyncMavens" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>CTA Button Label</label>
              <input value={campCtaLabel} onChange={e => setCampCtaLabel(e.target.value)} placeholder="Explore Now" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Destination Route</label>
              <input value={campCtaUrl} onChange={e => setCampCtaUrl(e.target.value)} placeholder="/stream" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Campaign Title *</label>
            <input value={campTitle} onChange={e => setCampTitle(e.target.value)} required placeholder="e.g. Nairobi Live Showcase VIP Reachout" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Email Subject * (Placeholders: {'{{name}}'}, {'{{event_title}}'})</label>
            <input value={campSubject} onChange={e => setCampSubject(e.target.value)} required placeholder="You're Invited {{name}} — Exclusive Access" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
            Message Body * (Placeholders: {'{{name}}'}, {'{{event_title}}'}, {'{{event_date}}'}, {'{{event_venue}}'})
          </label>
          <textarea rows={4} value={campBody} onChange={e => setCampBody(e.target.value)} required placeholder="Hi {{name}}, we would love to welcome you to TuneMavens..." style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Every recipient email automatically includes a personalized link introducing TuneMavens &amp; prompting onboarding to save preferences.
          </span>
          <button type="submit" disabled={dispatching} style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '10px 18px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RiSendPlaneFill size={15} /> {dispatching ? 'Dispatching...' : 'Dispatch Email Reachout'}
          </button>
        </div>
      </form>

      {/* Affiliate Reachout Funnel & Attribution Telemetry */}
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px' }}>
        <div style={{ fontWeight: 900, fontSize: '0.88rem', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RiLinksLine color="#34d399" size={16} /> Affiliate Reachout Funnel &amp; Attribution Telemetry
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: 'Link Clicks', val: activitySummary.clicks || 0, color: '#00f0ff' },
            { label: 'Event RSVPs', val: activitySummary.rsvps || 0, color: '#10b981' },
            { label: 'Onboarded Users', val: activitySummary.onboardings || 0, color: '#a855f7' },
            { label: 'Attributed Spend', val: `$${Number(activitySummary.total_spend_usd || 0).toFixed(2)}`, color: '#f59e0b' },
            { label: 'Commissions', val: `$${Number(activitySummary.total_commission_usd || 0).toFixed(2)}`, color: '#34d399' },
          ].map(card => (
            <div key={card.label} style={{ background: '#04070f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{card.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: card.color, marginTop: '3px' }}>{card.val}</div>
            </div>
          ))}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '8px' }}>Action</th>
              <th style={{ padding: '8px' }}>Affiliate Ref</th>
              <th style={{ padding: '8px' }}>Recipient / User</th>
              <th style={{ padding: '8px' }}>Spend &amp; Commission</th>
              <th style={{ padding: '8px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '14px', textAlign: 'center', color: '#64748b' }}>No reachout activity recorded yet.</td></tr>
            ) : (
              activities.slice(0, 15).map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px' }}>
                    <span style={{ background: 'rgba(0,240,255,0.14)', color: '#00f0ff', padding: '2px 7px', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 800 }}>
                      {(a.action_type || '').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '8px', fontFamily: 'monospace', color: '#34d399' }}>{a.affiliate_ref_code || '--'}</td>
                  <td style={{ padding: '8px', color: '#fff' }}>{a.actor_name || a.actor_email || 'Guest'}</td>
                  <td style={{ padding: '8px', color: '#cbd5e1' }}>
                    {a.amount_usd > 0 ? `$${Number(a.amount_usd).toFixed(2)} (+$${Number(a.commission_usd || 0).toFixed(2)})` : '--'}
                  </td>
                  <td style={{ padding: '8px', color: '#64748b', fontSize: '0.72rem' }}>
                    {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
