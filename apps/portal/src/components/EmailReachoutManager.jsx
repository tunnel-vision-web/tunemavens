import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  RiUpload2Line,
  RiDownload2Line,
  RiSparkling2Fill,
  RiBrainLine,
  RiShieldUserFill,
} from 'react-icons/ri'
import { API_BASE, tokenStore } from '../lib/api.js'
import { AUTHORITATIVE_EVENTS } from '../data/authoritativeEvents.js'

const BUILTIN_PERSONA_PLAYBOOKS = {
  creator: {
    persona: 'creator',
    label: 'Recording Artist, Songwriter & Producer',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Launch Your Official TuneMavens EPK & Ingest Your Catalogue (90% Sync Payouts)',
    subject_variants: [
      '{{name}}, Claim Your Official EPK Web World & Pre-Clear Your Stems for Global Sync',
      'Welcome {{name}} — Keep 100% Publishing & Stream in 24-Bit Lossless on TuneMavens',
    ],
    default_body:
      "Hi {{name}},\n\nWe'd love to welcome you to TuneMavens — the unified operating system built for African and diaspora artists, songwriters, and producers.\n\nIn minutes you can:\n• Build your official Creator EPK Web World with custom subdomain, press kit, and tour calendar\n• Ingest your singles, albums, and multitrack stems with automated TuneLedger split cascades\n• Pitch pre-cleared cues on SyncMavens (90% direct creator payout, 100% publishing retained) and sell lossless masters on TuneStream",
    cta_label: 'Onboard, Build EPK & Ingest Catalogue',
    cta_url: '/for/creator',
  },
  dj: {
    persona: 'dj',
    label: 'DJ & Mix Curator',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Monetize Your DJ Mixes Legally & Launch Your Official DJ EPK',
    subject_variants: [
      '{{name}}, Unlock the 24-Bit DJ Pool & Sell Cleared Mixes on TuneStream',
    ],
    default_body:
      "Hi {{name}},\n\nYou're invited to join TuneMavens as an Official DJ & Curator.\n\nHere's what unlocks immediately when you onboard:\n• Launch your DJ Press Kit (EPK) for festival, club, and corporate bookings\n• Ingest your DJ mixes with automated tracklist rights clearance so you can legally sell lossless downloads\n• Download club-ready 24-bit WAV/FLAC promos and stems from the TuneMavens DJ Pool",
    cta_label: 'Onboard, Launch DJ EPK & Upload Mixes',
    cta_url: '/for/dj',
  },
  label: {
    persona: 'label',
    label: 'Record Label & Distributor',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Bulk-Ingest Your Label Roster Catalogue & Automate Split Cascades',
    subject_variants: ['{{name}}, Modernize Your Label Operations: Bulk CSV/ZIP Ingest & Roster EPKs'],
    default_body:
      'Hello {{name}},\n\nTuneMavens gives independent record labels and distributors enterprise-grade catalogue, sync, and royalty infrastructure:\n\n• Bulk-ingest your entire back catalogue & stems via CSV/ZIP wizard in minutes\n• Provision official EPK Web Worlds for every artist on your roster\n• Automate transparent recoupment waterfalls and multi-party TuneLedger split cascades',
    cta_label: 'Onboard Label & Bulk-Ingest Catalogue',
    cta_url: '/for/label',
  },
  podcaster: {
    persona: 'podcaster',
    label: 'Podcaster & Show Host',
    supports_epk: true,
    supports_catalog: true,
    default_subject: '{{name}}, Launch Your Show EPK, Ingest Episodes & Unlock Brand Audio Sponsorships',
    subject_variants: ['{{name}}, Monetize Your Podcast with Direct Corporate Ad Flights on TuneMavens'],
    default_body:
      'Hi {{name}},\n\nBring your podcast into the TuneMavens audio ecosystem:\n\n• Create an official Show EPK to attract guests, syndicators, and corporate sponsors\n• Ingest episodes with broadcast-ready -16 LUFS mastering\n• Opt into automated Corporate Brand Ad Flights and listener micro-tipping',
    cta_label: 'Launch Show EPK & Ingest Episodes',
    cta_url: '/for/podcaster',
  },
  supervisor: {
    persona: 'supervisor',
    label: 'Music Supervisor, Film/TV & Sync Buyer',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Complimentary VIP Supervisor Access: One-Stop Pre-Cleared Stems',
    subject_variants: ['{{name}}, Clear Broadcast & Film Cues in Minutes on SyncMavens (Zero Fees)'],
    default_body:
      'Dear {{name}},\n\nAs a Music Supervisor or Licensing Executive, your TuneMavens account is permanently credit-exempt.\n\n• Post confidential sync briefs and receive AI-matched, one-stop pre-cleared masters & isolated stems\n• Download 24-bit WAV stems with verified chain-of-title and instant SHA-256 license execution',
    cta_label: 'Activate VIP Supervisor Desk',
    cta_url: '/for/supervisor',
  },
  corporate: {
    persona: 'corporate',
    label: 'Corporate Brand & Ad Agency',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Reach Engaged Music & Podcast Audiences with TuneMavens Brand Audio Flights',
    subject_variants: [],
    default_body:
      'Hello {{name}},\n\nConnect your brand with high-intent listeners across East Africa and the global diaspora on TuneMavens:\n\n• Launch targeted audio ad flights across TuneStream music channels and top regional podcasts\n• License pre-cleared commercial sync tracks directly from verified creators',
    cta_label: 'Onboard Brand & View Ad Rates',
    cta_url: '/for/corporate',
  },
  media_house: {
    persona: 'media_house',
    label: 'Radio, TV & Broadcast Media House',
    supports_epk: false,
    supports_catalog: true,
    default_subject: '{{name}}, Automate Broadcast Music Servicing & PRO Cue Sheets on TuneMavens',
    subject_variants: [],
    default_body:
      'Hello {{name}},\n\nStreamline broadcast music acquisition and compliance with TuneMavens Media House Operations:\n\n• Receive broadcast-ready clean masters and syndicated shows directly into your station crate\n• Automate PRO cue sheet logging and commercial ad traffic scheduling',
    cta_label: 'Activate Broadcast Media Desk',
    cta_url: '/for/media-house',
  },
  vc: {
    persona: 'vc',
    label: 'Tour Venture Capital & Catalogue Investor',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Institutional LP Invitation: Tour Capital Vault & Catalogue Royalty Yields',
    subject_variants: [],
    default_body:
      'Dear {{name}},\n\nYou are invited to access the TuneMavens Tour Capital & Catalogue Acquisition Vault (permanently credit-exempt for Institutional LPs):\n\n• Review live streaming, ticketing, and superfan geo-demand telemetry before underwriting tours or catalogue acquisitions\n• Automated priority recoupment via TuneLedger smart split cascades',
    cta_label: 'Activate Institutional LP Access',
    cta_url: '/for/vc',
  },
  affiliate: {
    persona: 'affiliate',
    label: 'Affiliate Partner, Curator & Influencer',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Earn 3%–12% Recurring Ecosystem Commissions as a TuneMavens Partner',
    subject_variants: [],
    default_body:
      'Hi {{name}},\n\nTurn your cultural influence and industry network into recurring revenue with the TuneMavens Partner Programme:\n\n• Claim your unique 90-day tracking code and Smart CRM email reachout suite\n• Earn 3% to 12% across ticket sales, creator credit reloads, lossless albums, stems, and sync placements',
    cta_label: 'Join Partner Programme & Claim Code',
    cta_url: '/affiliates',
  },
  consumer: {
    persona: 'consumer',
    label: 'Audiophile Listener & Live Music Fan',
    supports_epk: false,
    supports_catalog: false,
    default_subject: '{{name}}, Stream 24-Bit Lossless African Music & Unlock Priority Concert Passes',
    subject_variants: [],
    default_body:
      'Hey {{name}},\n\nExperience music the way artists intended on TuneStream & TuneMavens:\n\n• Stream authentic African & diaspora singles, albums, and DJ mixes in crystal-clear audio\n• Save your favorite genres, artists, and city for priority concert RSVPs and digital QR passes',
    cta_label: 'Join Free & Save Music Preferences',
    cta_url: '/for/consumer',
  },
}

function authHeaders(json = false) {
  const h = {}
  if (json) h['Content-Type'] = 'application/json'
  const tok = tokenStore?.get?.()
  if (tok) h['Authorization'] = `Bearer ${tok}`
  return h
}

export default function EmailReachoutManager({ sessionUser }) {
  const isAdmin = Boolean(
    !sessionUser ||
      sessionUser.role === 'admin' ||
      sessionUser.is_admin === true ||
      sessionUser.original_role === 'admin' ||
      (Array.isArray(sessionUser.roles) && sessionUser.roles.includes('admin'))
  )

  const [affiliates, setAffiliates] = useState([])
  const [selectedAffiliateFilter, setSelectedAffiliateFilter] = useState(isAdmin ? 'ALL' : '')
  const [groups, setGroups] = useState([])
  const [events, setEvents] = useState(() => AUTHORITATIVE_EVENTS || [])
  const [playbooks, setPlaybooks] = useState(BUILTIN_PERSONA_PLAYBOOKS)
  const [intelligence, setIntelligence] = useState(null)
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

  // Create Target Group state
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [tgName, setTgName] = useState('')
  const [tgDesc, setTgDesc] = useState('')
  const [tgBulkText, setTgBulkText] = useState('')
  const [savingGroup, setSavingGroup] = useState(false)

  // Import Target Group Modal/Drawer state
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [importMode, setImportMode] = useState('new') // 'new' | 'append'
  const [importGroupName, setImportGroupName] = useState('')
  const [importTargetGroupId, setImportTargetGroupId] = useState('')
  const [importRawText, setImportRawText] = useState('')
  const [importFileName, setImportFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  // Manage Group Contacts state
  const [managingGroup, setManagingGroup] = useState(null)
  const [newEntryName, setNewEntryName] = useState('')
  const [newEntryEmail, setNewEntryEmail] = useState('')
  const [editingEntryId, setEditingEntryId] = useState(null)
  const [editEntryName, setEditEntryName] = useState('')
  const [editEntryEmail, setEditEntryEmail] = useState('')

  // Reachout Composer state
  const [campTitle, setCampTitle] = useState('')
  const [campGroupId, setCampGroupId] = useState('')
  const [campPromoType, setCampPromoType] = useState('persona_intro') // 'persona_intro' | 'event' | 'product_service'
  const [campPersona, setCampPersona] = useState('creator')
  const [campIncludeEpk, setCampIncludeEpk] = useState(true)
  const [campIncludeCatalog, setCampIncludeCatalog] = useState(true)
  const [campEventId, setCampEventId] = useState(AUTHORITATIVE_EVENTS?.[0]?.id || '')
  const [campProductName, setCampProductName] = useState('')
  const [campCtaRsvp, setCampCtaRsvp] = useState(true)
  const [campCtaTicket, setCampCtaTicket] = useState(true)
  const [campCtaLabel, setCampCtaLabel] = useState(BUILTIN_PERSONA_PLAYBOOKS.creator.cta_label)
  const [campCtaUrl, setCampCtaUrl] = useState(BUILTIN_PERSONA_PLAYBOOKS.creator.cta_url)
  const [campSubject, setCampSubject] = useState(BUILTIN_PERSONA_PLAYBOOKS.creator.default_subject)
  const [campBody, setCampBody] = useState(BUILTIN_PERSONA_PLAYBOOKS.creator.default_body)
  const [dispatching, setDispatching] = useState(false)
  const [optimizing, setOptimizing] = useState(false)

  const notify = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 5000)
  }

  // Merge authoritative site events with live backend events
  const mergeSiteEvents = (apiEvents) => {
    const byId = new Map()
    ;(Array.isArray(apiEvents) ? apiEvents : []).forEach(ev => {
      if (ev?.id) byId.set(ev.id, ev)
    })
    ;(AUTHORITATIVE_EVENTS || []).forEach(ev => {
      if (ev?.id && !byId.has(ev.id)) byId.set(ev.id, ev)
    })
    return Array.from(byId.values())
  }

  // Effective initiating affiliate ref for creating groups & dispatching campaigns
  const effectiveInitiatorRef = useMemo(() => {
    if (!isAdmin) {
      return affiliates[0]?.ref_code || ''
    }
    if (!selectedAffiliateFilter || selectedAffiliateFilter === 'ALL') {
      return 'TM-ADMIN'
    }
    return selectedAffiliateFilter
  }, [isAdmin, selectedAffiliateFilter, affiliates])

  // Load initial roster, events, playbooks
  const loadBootstrap = async () => {
    try {
      const [affRes, evRes, pbRes] = await Promise.all([
        fetch(`${API_BASE}/api/affiliates/admin/roster`, { headers: authHeaders(), credentials: 'include' })
          .then(r => (r.ok ? r.json() : { affiliates: [] }))
          .catch(() => ({ affiliates: [] })),
        fetch(`${API_BASE}/api/events`, { credentials: 'include' })
          .then(r => (r.ok ? r.json() : { events: [] }))
          .catch(() => ({ events: [] })),
        fetch(`${API_BASE}/api/crm/smart-playbooks`, { credentials: 'include' })
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null),
      ])

      const loadedAffs = affRes.affiliates || []
      setAffiliates(loadedAffs)
      if (!isAdmin && loadedAffs.length > 0) {
        setSelectedAffiliateFilter(loadedAffs[0].ref_code)
      }

      const apiEvents = Array.isArray(evRes) ? evRes : (evRes.events || [])
      const mergedEvents = mergeSiteEvents(apiEvents)
      setEvents(mergedEvents)
      if (!campEventId && mergedEvents.length > 0) {
        setCampEventId(mergedEvents[0].id)
      }

      if (pbRes?.playbooks) {
        const pbMap = { ...BUILTIN_PERSONA_PLAYBOOKS }
        pbRes.playbooks.forEach(p => {
          pbMap[p.persona] = p
        })
        setPlaybooks(pbMap)
      }
    } catch (err) {
      console.warn('Bootstrap fetch warning:', err)
    }
  }

  // Load scoped Target Groups, Funnel Activity & Smart Intelligence whenever selectedAffiliateFilter or campPersona changes
  const loadScopedData = async (affFilter = selectedAffiliateFilter, personaFilter = campPersona) => {
    setLoading(true)
    try {
      const refParam = affFilter && affFilter !== 'ALL' ? `affiliate_ref_code=${encodeURIComponent(affFilter)}` : ''
      const [gRes, actRes, intelRes] = await Promise.all([
        fetch(`${API_BASE}/api/crm/target-groups${refParam ? `?${refParam}` : ''}`, {
          headers: authHeaders(),
          credentials: 'include',
        })
          .then(r => (r.ok ? r.json() : { groups: [] }))
          .catch(() => ({ groups: [] })),
        fetch(`${API_BASE}/api/crm/reachout/activity${refParam ? `?${refParam}` : ''}`, {
          headers: authHeaders(),
          credentials: 'include',
        })
          .then(r => (r.ok ? r.json() : { summary: {}, activities: [] }))
          .catch(() => ({ summary: {}, activities: [] })),
        fetch(
          `${API_BASE}/api/crm/intelligence?persona=${encodeURIComponent(personaFilter)}${refParam ? `&${refParam}` : ''}`,
          { headers: authHeaders(), credentials: 'include' }
        )
          .then(r => (r.ok ? r.json() : null))
          .catch(() => null),
      ])

      const loadedGroups = gRes.groups || []
      setGroups(loadedGroups)
      setActivitySummary(actRes.summary || {})
      setActivities(actRes.activities || [])
      if (intelRes) setIntelligence(intelRes)

      if (loadedGroups.length > 0 && !loadedGroups.some(g => g.id === campGroupId)) {
        setCampGroupId(loadedGroups[0].id)
      } else if (loadedGroups.length === 0) {
        setCampGroupId('')
      }
    } catch (err) {
      console.error('Error loading scoped CRM data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBootstrap()
  }, [])

  useEffect(() => {
    loadScopedData(selectedAffiliateFilter, campPersona)
  }, [selectedAffiliateFilter, campPersona])

  // Apply persona playbook automatically when persona or promoType changes
  const applyPersonaPlaybook = (personaKey) => {
    setCampPersona(personaKey)
    const pb = playbooks[personaKey] || BUILTIN_PERSONA_PLAYBOOKS.creator
    setCampIncludeEpk(Boolean(pb.supports_epk))
    setCampIncludeCatalog(Boolean(pb.supports_catalog))
    if (campPromoType === 'persona_intro') {
      setCampSubject(pb.default_subject)
      setCampBody(pb.default_body)
      setCampCtaLabel(pb.cta_label)
      setCampCtaUrl(pb.cta_url)
      if (!campTitle) setCampTitle(`${pb.label} Onboarding Reachout`)
    }
  }

  const handlePromoTypeChange = (nextType) => {
    setCampPromoType(nextType)
    if (nextType === 'persona_intro') {
      const pb = playbooks[campPersona] || BUILTIN_PERSONA_PLAYBOOKS.creator
      setCampSubject(pb.default_subject)
      setCampBody(pb.default_body)
      setCampCtaLabel(pb.cta_label)
      setCampCtaUrl(pb.cta_url)
    } else if (nextType === 'event') {
      const ev = events.find(x => x.id === campEventId) || events[0]
      if (ev) {
        setCampEventId(ev.id)
        setCampSubject(`{{name}}, You're Invited: ${ev.title}`)
        setCampBody(
          `Hi {{name}},\n\nJoin us live for ${ev.title} featuring ${ev.artist} at ${ev.venue}${ev.city ? `, ${ev.city}` : ''} (${ev.date_display || ev.date || 'Upcoming'}).\n\nUse the direct buttons below to confirm your RSVP or purchase your digital QR ticket pass immediately!`
        )
      }
    } else {
      setCampSubject('{{name}}, Discover TuneMavens Lossless Streaming & Sync Licensing')
      setCampBody(
        'Hi {{name}},\n\nExplore our latest tools across TuneStream lossless audio, SyncMavens licensing, and live concert passes. Save your preferences when you visit for instant 1-tap access next time!'
      )
      setCampCtaLabel('Explore TuneMavens')
      setCampCtaUrl('/stream')
    }
  }

  const handleSmartOptimize = async () => {
    setOptimizing(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/smart-recommend`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          promotion_type: campPromoType,
          persona: campPersona,
          event_id: campPromoType === 'event' ? campEventId : undefined,
          product_name: campPromoType === 'product_service' ? campProductName : undefined,
        }),
      })
      if (res.ok) {
        const rec = await res.json()
        if (rec.subject) setCampSubject(rec.subject)
        if (rec.body) setCampBody(rec.body)
        if (rec.cta_label) setCampCtaLabel(rec.cta_label)
        if (rec.cta_url) setCampCtaUrl(rec.cta_url)
        notify(
          rec.learned_boost_applied
            ? 'Applied highest-converting Subject & CTA learned from historical campaign performance!'
            : 'Applied Smart CRM persona-optimized copy & CTAs!'
        )
      }
    } catch (err) {
      notify('Applied built-in Smart CRM template.', 'success')
    } finally {
      setOptimizing(false)
    }
  }

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
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: tgName.trim(),
          description: tgDesc.trim(),
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          entries,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not create target group')
      notify(`Target Group "${data.name}" created under ${data.affiliate_ref_code || 'your account'} (${data.member_count} contacts).`)
      setTgName('')
      setTgDesc('')
      setTgBulkText('')
      setShowNewGroup(false)
      setCampGroupId(data.id)
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message || 'Failed to create group', 'error')
    } finally {
      setSavingGroup(false)
    }
  }

  const handleFileUploadSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportFileName(file.name)
    if (!importGroupName) {
      setImportGroupName(file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '))
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImportRawText(String(ev.target?.result || ''))
    }
    reader.readAsText(file)
  }

  const handleDownloadSampleCsv = () => {
    const sample = 'Name,Email,Notes\nWanjiku Mwangi,wanjiku@example.com,Creator Lead\nBrian Otieno,brian@example.com,VIP Event Guest\nAisha Kamau,aisha@example.com,DJ Curator\n'
    const blob = new Blob([sample], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tunemavens_target_group_template.csv'
    a.click()
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importRawText.trim()) {
      notify('Please select a CSV/TSV/JSON file or paste contact rows to import.', 'error')
      return
    }
    if (importMode === 'append' && !importTargetGroupId) {
      notify('Please choose an existing Target Group to append into.', 'error')
      return
    }
    setImporting(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/import`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: importMode === 'new' ? (importGroupName.trim() || 'Imported Target Group') : undefined,
          target_group_id: importMode === 'append' ? importTargetGroupId : undefined,
          raw_content: importRawText,
          format_hint: importFileName.endsWith('.json') ? 'json' : 'auto',
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Import failed')
      const r = data.report || {}
      const strippedMsg = r.stripped_phone_fields > 0 ? ` (${r.stripped_phone_fields} phone column(s) stripped per Email-Only policy)` : ''
      notify(`Imported ${r.imported || 0} email contact(s) into "${data.group?.name}"${strippedMsg}!`)
      setImportRawText('')
      setImportFileName('')
      setImportGroupName('')
      setShowImportPanel(false)
      if (data.group?.id) setCampGroupId(data.group.id)
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message || 'Failed to import contacts', 'error')
    } finally {
      setImporting(false)
    }
  }

  const handleCreateWarmFollowupGroup = async () => {
    const warm = intelligence?.warm_unconverted_leads || []
    if (!warm.length) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          name: `Smart Warm Clickers Follow-Up (${new Date().toLocaleDateString()})`,
          description: 'Auto-segmented recipients who clicked a reachout link without completing onboarding yet',
          affiliate_ref_code: effectiveInitiatorRef || undefined,
          entries: warm.map(w => ({ name: w.name || 'Guest', email: w.email })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not create warm follow-up group')
      setCampGroupId(data.id)
      notify(`Created Warm Follow-Up Group with ${data.member_count} high-intent contact(s)!`)
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Delete this Target Group and all its email entries?')) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to delete group')
      if (managingGroup?.id === groupId) setManagingGroup(null)
      notify('Target group deleted.')
      await loadBootstrap()
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const openManageContacts = async (groupId) => {
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${groupId}`, {
        headers: authHeaders(),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load group contacts')
      setManagingGroup(data)
      setEditingEntryId(null)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleAddEntry = async (e) => {
    e.preventDefault()
    if (!managingGroup || !newEntryName.trim() || !newEntryEmail.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ name: newEntryName.trim(), email: newEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not add contact')
      setManagingGroup(data.group)
      setNewEntryName('')
      setNewEntryEmail('')
      notify('Contact added.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleSaveEditEntry = async (entryId) => {
    if (!managingGroup || !editEntryName.trim() || !editEntryEmail.trim()) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'PUT',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({ name: editEntryName.trim(), email: editEntryEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not update contact')
      setManagingGroup(data.group)
      setEditingEntryId(null)
      notify('Contact updated.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!managingGroup) return
    try {
      const res = await fetch(`${API_BASE}/api/crm/target-groups/${managingGroup.id}/entries/${entryId}`, {
        method: 'DELETE',
        headers: authHeaders(),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Could not remove contact')
      setManagingGroup(data.group)
      notify('Contact removed.')
      loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleLaunchReachout = async (e) => {
    e.preventDefault()
    if (!campGroupId) {
      notify('Please select or import an Email-Only Target Group first.', 'error')
      return
    }
    if (!campSubject.trim() || !campBody.trim()) {
      notify('Subject and Message Body are required.', 'error')
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

    const activeGroup = groups.find(g => g.id === campGroupId)
    const dispatchAffiliateRef =
      isAdmin && selectedAffiliateFilter === 'ALL'
        ? activeGroup?.affiliate_ref_code || 'TM-ADMIN'
        : effectiveInitiatorRef

    setDispatching(true)
    try {
      const res = await fetch(`${API_BASE}/api/crm/campaigns`, {
        method: 'POST',
        headers: authHeaders(true),
        credentials: 'include',
        body: JSON.stringify({
          title: campTitle.trim() || `${campPromoType.toUpperCase()} Reachout — ${activeGroup?.name || 'Group'}`,
          target_group_id: campGroupId,
          affiliate_ref_code: dispatchAffiliateRef || undefined,
          initiator_email: sessionUser?.email || undefined,
          initiator_name: sessionUser?.name || undefined,
          promotion_type: campPromoType,
          target_persona: campPromoType === 'persona_intro' ? campPersona : undefined,
          include_epk_cta: campIncludeEpk,
          include_catalog_cta: campIncludeCatalog,
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
      notify(
        `Dispatched to ${data.recipient_count || 0} recipient(s) under affiliate ${data.affiliate_ref_code || 'account'}! Learning engine armed.`
      )
      setCampTitle('')
      await loadScopedData()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setDispatching(false)
    }
  }

  const currentPlaybook = playbooks[campPersona] || BUILTIN_PERSONA_PLAYBOOKS.creator
  const selectedEventObj = events.find(ev => ev.id === campEventId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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

      {/* TOP BAR: Initiating Affiliate Account Workspace Scope (Admin sees ALL affiliates; Affiliates see only their own) */}
      <div
        style={{
          background: '#080e1c',
          border: '1px solid rgba(0,240,255,0.32)',
          borderLeft: '4px solid #00f0ff',
          borderRadius: '4px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ flex: '1 1 340px' }}>
          <div style={{ fontWeight: 900, color: '#00f0ff', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiShieldUserFill size={17} />
            {isAdmin
              ? 'Admin Global Affiliate & Target Group Scope'
              : 'Affiliate Partner Reachout Workspace (Isolated to Your Account)'}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '3px' }}>
            {isAdmin
              ? 'Select any registered affiliate below to inspect and manage their Target Groups & Reachouts, or choose Admin House Account (TM-ADMIN).'
              : 'Your Target Groups, imported contacts, and conversion commissions are strictly private to your affiliate account.'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '290px' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#00f0ff', fontWeight: 800, marginBottom: '3px', textTransform: 'uppercase' }}>
              Initiating Affiliate Account *
            </label>
            {isAdmin ? (
              <select
                value={selectedAffiliateFilter}
                onChange={e => setSelectedAffiliateFilter(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid #00f0ff', color: '#fff', fontWeight: 700, borderRadius: '4px', fontSize: '0.8rem' }}
              >
                <option value="ALL">🌐 All Registered Affiliates &amp; Admin Groups ({affiliates.length + 1} accounts)</option>
                <option value="TM-ADMIN">🏛️ TuneMavens Admin — Official House Account (TM-ADMIN)</option>
                {affiliates.map(a => (
                  <option key={a.ref_code} value={a.ref_code}>
                    🤝 {a.name} ({a.ref_code} · {a.email || 'partner'}{typeof a.target_groups_count === 'number' ? ` · ${a.target_groups_count} grp` : ''})
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ padding: '8px 12px', background: '#04070f', border: '1px solid #10b981', borderRadius: '4px', color: '#34d399', fontWeight: 800, fontSize: '0.8rem' }}>
                {affiliates[0] ? `${affiliates[0].name} (${affiliates[0].ref_code})` : sessionUser?.email || 'My Affiliate Account'}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
            <button
              type="button"
              onClick={() => { setShowImportPanel(v => !v); setShowNewGroup(false) }}
              style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 13px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiUpload2Line size={15} /> Import CSV / JSON
            </button>
            <button
              type="button"
              onClick={() => { setShowNewGroup(v => !v); setShowImportPanel(false) }}
              style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '8px 13px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RiAddLine size={16} /> New Target Group
            </button>
            <button
              type="button"
              onClick={() => { loadBootstrap(); loadScopedData() }}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 10px', borderRadius: '4px', cursor: 'pointer' }}
              title="Refresh CRM Data"
            >
              <RiRefreshLine size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* SELF-LEARNING SMART CRM INTELLIGENCE BAR */}
      {intelligence && (
        <div style={{ background: '#071322', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '6px', padding: '14px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '0.86rem', color: '#e9d5ff' }}>
              <RiBrainLine color="#c084fc" size={18} />
              Smart CRM Adaptive Learning Engine (Continuously Learns Subject, Persona, EPK &amp; Catalogue Outcomes)
            </div>
            {(intelligence.warm_unconverted_leads || []).length > 0 && (
              <button
                type="button"
                onClick={handleCreateWarmFollowupGroup}
                style={{ background: '#a855f7', border: 'none', color: '#fff', padding: '5px 12px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}
              >
                ⚡ Segment {intelligence.warm_unconverted_leads.length} Warm Unconverted Clicker(s) into Follow-Up Group
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px', marginBottom: '10px' }}>
            {[
              { label: 'Click-Through Rate', val: `${intelligence.metrics?.click_through_rate_pct || 0}%`, color: '#00f0ff' },
              { label: 'Click → Onboard', val: `${intelligence.metrics?.click_to_onboard_rate_pct || 0}%`, color: '#10b981' },
              { label: 'EPKs Activated', val: intelligence.metrics?.epks_activated || 0, color: '#c084fc' },
              { label: 'Catalogue Ingested', val: intelligence.metrics?.catalog_items_ingested || 0, color: '#f59e0b' },
              { label: 'Warm Unconverted', val: intelligence.metrics?.warm_unconverted_leads_count || 0, color: '#fb7185' },
            ].map(m => (
              <div key={m.label} style={{ background: '#040812', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px', padding: '8px 10px' }}>
                <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: m.color, marginTop: '2px' }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
            {(intelligence.recommendations || []).map((rec, i) => (
              <div key={i} style={{ marginTop: i > 0 ? '4px' : 0 }}>💡 {rec}</div>
            ))}
          </div>
        </div>
      )}

      {/* IMPORT TARGET GROUP PANEL (CSV / TSV / JSON File Upload + Paste) */}
      {showImportPanel && (
        <form
          onSubmit={handleImportSubmit}
          style={{ background: '#09101f', border: '1px solid #10b981', borderRadius: '6px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontWeight: 900, color: '#34d399', fontSize: '0.92rem' }}>
              📥 Import Target Group Contacts (CSV, TSV, TXT, or JSON — Email-Only Auto-Sanitized)
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCsv}
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', color: '#00f0ff', padding: '5px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RiDownload2Line size={14} /> Download Sample CSV
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Import Destination</label>
              <select value={importMode} onChange={e => setImportMode(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
                <option value="new">Create a New Target Group</option>
                <option value="append">Append into an Existing Target Group</option>
              </select>
            </div>
            {importMode === 'new' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>New Target Group Name *</label>
                <input value={importGroupName} onChange={e => setImportGroupName(e.target.value)} placeholder="e.g. Imported East Africa Creators" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Select Existing Target Group *</label>
                <select value={importTargetGroupId} onChange={e => setImportTargetGroupId(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
                  <option value="">-- Select Group --</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name} ({g.member_count || 0} emails)</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Upload File (.csv, .tsv, .txt, .json)</label>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt,.json" onChange={handleFileUploadSelect} style={{ width: '100%', padding: '6px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#cbd5e1', borderRadius: '4px', fontSize: '0.76rem', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              File Preview / Paste CSV or JSON Rows (Any phone/WhatsApp columns are automatically stripped)
            </label>
            <textarea
              rows={5}
              value={importRawText}
              onChange={e => setImportRawText(e.target.value)}
              placeholder={'Name,Email,Notes\nWanjiku Mwangi,wanjiku@example.com,Creator\nBrian Otieno,brian@example.com,DJ'}
              style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.78rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Assigning to affiliate: <strong style={{ color: '#34d399' }}>{effectiveInitiatorRef || 'Account Default'}</strong>
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => setShowImportPanel(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '4px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" disabled={importing} style={{ background: '#10b981', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' }}>
                {importing ? 'Importing...' : 'Import Email Contacts'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* CREATE NEW TARGET GROUP FORM */}
      {showNewGroup && (
        <form
          onSubmit={handleCreateGroup}
          style={{ background: '#09101f', border: '1px solid rgba(0,240,255,0.35)', borderRadius: '6px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.92rem' }}>
            Create Email-Only Target Group (Owner: <span style={{ color: '#00f0ff' }}>{effectiveInitiatorRef}</span>)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Group Name *</label>
              <input value={tgName} onChange={e => setTgName(e.target.value)} required placeholder="e.g. Nairobi Creators & Labels Q4" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Description</label>
              <input value={tgDesc} onChange={e => setTgDesc(e.target.value)} placeholder="e.g. Persona onboarding & EPK launch list" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
              Contacts — One per line as <code>Name, email@domain.com</code> (Email-only, no phone numbers)
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
            <button type="submit" disabled={savingGroup} style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '8px 16px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer' }}>
              {savingGroup ? 'Saving...' : 'Save Target Group'}
            </button>
          </div>
        </form>
      )}

      {/* TARGET GROUPS TABLE */}
      <div style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: 800, fontSize: '0.86rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>
            Email-Only Target Groups ({groups.length})
            {isAdmin && selectedAffiliateFilter !== 'ALL' ? ` · Filtered to ${selectedAffiliateFilter}` : ''}
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', color: '#94a3b8', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Group Name</th>
                <th style={{ padding: '10px 14px' }}>Email Contacts</th>
                <th style={{ padding: '10px 14px' }}>Affiliate Owner</th>
                <th style={{ padding: '10px 14px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>Loading target groups...</td></tr>
              ) : groups.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '18px', textAlign: 'center', color: '#64748b' }}>No target groups found for this affiliate scope. Click "New Target Group" or "Import CSV / JSON" above.</td></tr>
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
                      {g.affiliate_ref_code || 'TM-ADMIN'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => openManageContacts(g.id)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <RiEditLine size={13} /> Contacts
                        </button>
                        <button type="button" onClick={() => { setCampGroupId(g.id); notify(`Selected "${g.name}" in Reachout Composer below.`) }} style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}>
                          Select for Reachout
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

      {/* INLINE MANAGE CONTACTS DRAWER */}
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
              {(managingGroup.entries || []).map(ent => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SMART REACHOUT COMPOSER (Persona Playbooks + Live Site Events + Products/Services) */}
      <form
        onSubmit={handleLaunchReachout}
        style={{ background: '#080c18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontWeight: 900, fontSize: '0.94rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiMailSendFill color="#00f0ff" size={18} />
            Intelligent Email Reachout Composer
          </div>
          <button
            type="button"
            onClick={handleSmartOptimize}
            disabled={optimizing}
            style={{ background: '#a855f7', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <RiSparkling2Fill size={14} />
            {optimizing ? 'Optimizing...' : 'Smart Auto-Optimize Copy (Learned Weights)'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Target Email Group *</label>
            <select value={campGroupId} onChange={e => setCampGroupId(e.target.value)} required style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px' }}>
              <option value="">-- Select Target Group --</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.member_count || 0} emails · {g.affiliate_ref_code || 'TM-ADMIN'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Promotion Type *</label>
            <select value={campPromoType} onChange={e => handlePromoTypeChange(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid #00f0ff', color: '#fff', fontWeight: 700, borderRadius: '4px' }}>
              <option value="persona_intro">🎯 Persona Introductory &amp; Onboarding Email (EPK / Catalogue / Role)</option>
              <option value="event">🎟️ Live Event Invitation (Direct RSVP &amp; Ticket Email CTAs)</option>
              <option value="product_service">🚀 Ecosystem Product / Service Promotion</option>
            </select>
          </div>
        </div>

        {/* MODE 1: PERSONA INTRODUCTORY PLAYBOOK */}
        {campPromoType === 'persona_intro' && (
          <div style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.25)', borderRadius: '4px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#00f0ff', fontWeight: 800, marginBottom: '4px' }}>
                  Select Target Persona Playbook *
                </label>
                <select value={campPersona} onChange={e => applyPersonaPlaybook(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}>
                  {Object.values(playbooks).map(pb => (
                    <option key={pb.persona} value={pb.persona}>
                      {pb.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Primary Onboarding CTA Label</label>
                <input value={campCtaLabel} onChange={e => setCampCtaLabel(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            </div>

            {(currentPlaybook.supports_epk || currentPlaybook.supports_catalog) && (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '4px', fontSize: '0.8rem', color: '#e2e8f0' }}>
                {currentPlaybook.supports_epk && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={campIncludeEpk} onChange={e => setCampIncludeEpk(e.target.checked)} />
                    Include Direct <strong>"Launch Official EPK"</strong> Button in Email
                  </label>
                )}
                {currentPlaybook.supports_catalog && (
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={campIncludeCatalog} onChange={e => setCampIncludeCatalog(e.target.checked)} />
                    Include Direct <strong>"Ingest Catalogue &amp; Stems"</strong> Button in Email
                  </label>
                )}
              </div>
            )}

            {(currentPlaybook.subject_variants || []).length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Alternate Subject Hooks:</span>
                {currentPlaybook.subject_variants.map((sv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCampSubject(sv)}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '3px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Use Hook #{idx + 2}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: LIVE SITE EVENT */}
        {campPromoType === 'event' && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: '4px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#34d399', fontWeight: 800, marginBottom: '4px' }}>
                <RiCalendarEventFill style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Select Live Site Event ({events.length} Active Events) *
              </label>
              <select
                value={campEventId}
                onChange={e => {
                  const nextId = e.target.value
                  setCampEventId(nextId)
                  const ev = events.find(x => x.id === nextId)
                  if (ev) {
                    setCampSubject(`{{name}}, You're Invited: ${ev.title}`)
                    setCampBody(
                      `Hi {{name}},\n\nJoin us live for ${ev.title} featuring ${ev.artist} at ${ev.venue}${ev.city ? `, ${ev.city}` : ''} (${ev.date_display || ev.date || 'Upcoming'}).\n\nUse the direct buttons below to confirm your RSVP or purchase your digital QR ticket pass immediately!`
                    )
                  }
                }}
                style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: '4px', fontWeight: 700 }}
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} — {ev.artist} · {ev.city || ev.venue} [{ev.payment_mode === 'free_rsvp' ? 'FREE RSVP' : 'PAID TICKETS'}]
                  </option>
                ))}
              </select>
            </div>
            {selectedEventObj && (
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', background: '#040812', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <strong style={{ color: '#fff' }}>{selectedEventObj.title}</strong> · {selectedEventObj.venue}{selectedEventObj.city ? `, ${selectedEventObj.city}` : ''} · {selectedEventObj.date_display || selectedEventObj.date}
              </div>
            )}
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#e2e8f0' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={campCtaRsvp} onChange={e => setCampCtaRsvp(e.target.checked)} /> Direct "RSVP Now" Email Button
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input type="checkbox" checked={campCtaTicket} onChange={e => setCampCtaTicket(e.target.checked)} /> Direct "Buy Ticket Now" Email Button
              </label>
            </div>
          </div>
        )}

        {/* MODE 3: PRODUCT / SERVICE */}
        {campPromoType === 'product_service' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Product / Service Name</label>
              <input value={campProductName} onChange={e => setCampProductName(e.target.value)} placeholder="e.g. TuneStream Hi-Fi, SyncMavens, DJ Pool" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
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
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Campaign Title (Internal Reference)</label>
            <input value={campTitle} onChange={e => setCampTitle(e.target.value)} placeholder="e.g. Q4 East Africa Creator EPK & Catalogue Onboarding" style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>Email Subject * (Placeholders: {'{{name}}'}, {'{{event_title}}'})</label>
            <input value={campSubject} onChange={e => setCampSubject(e.target.value)} required style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '4px' }}>
            Personalized Message Body * (Placeholders: {'{{name}}'}, {'{{event_title}}'}, {'{{event_date}}'}, {'{{event_venue}}'})
          </label>
          <textarea rows={5} value={campBody} onChange={e => setCampBody(e.target.value)} required style={{ width: '100%', padding: '8px 10px', background: '#04070f', border: '1px solid rgba(255,255,255,0.14)', color: '#fff', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Tracking under affiliate: <strong style={{ color: '#00f0ff' }}>{effectiveInitiatorRef || 'Account Default'}</strong> · Dual alerts sent to In-App Inbox + Registered Email.
          </span>
          <button type="submit" disabled={dispatching} style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '10px 18px', borderRadius: '4px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RiSendPlaneFill size={15} /> {dispatching ? 'Dispatching...' : 'Dispatch Intelligent Email Reachout'}
          </button>
        </div>
      </form>

      {/* AFFILIATE REACHOUT FUNNEL TELEMETRY */}
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
              <tr><td colSpan={5} style={{ padding: '14px', textAlign: 'center', color: '#64748b' }}>No reachout activity recorded yet for this scope.</td></tr>
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
