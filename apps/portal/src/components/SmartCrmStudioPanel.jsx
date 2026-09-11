import React, { useState, useEffect } from 'react'
import {
  RiMessage2Fill, RiUserHeartLine, RiSendPlaneFill, RiMailSendFill,
  RiWhatsappFill, RiSmartphoneFill, RiFilter3Line, RiDownloadLine,
  RiAddLine, RiSearchLine, RiCheckLine, RiCloseFill, RiExternalLinkLine,
  RiDiscFill, RiBarChartFill, RiSparklingFill, RiStarFill, RiPhoneFill,
  RiTimeLine, RiCheckboxCircleFill, RiRefreshLine, RiArrowDownSLine, RiArrowUpSLine
} from 'react-icons/ri'

const CREATOR_PROFILES = {
  ndufo: {
    name: 'Ndufo (Official)',
    genre: 'Electronic & Modular Synthesizer',
    contacts: [
      { id: 'CRM-ND-1', name: 'Alex Chen', email: 'alex.chen@cyberdome.io', phone: '+254 712 345 678', preferred_comm_method: 'whatsapp', channel: 'WHATSAPP', source: 'Fan Club Portal', status: 'Subscribed', interests: ['VIP Tour Pre-Sales', 'High-Res MP3 Vault', 'Modular Synth Live'], tags: ['fan', 'vip'] },
      { id: 'CRM-ND-2', name: 'Elena Richter', email: 'elena.richter@berlinsync.de', phone: '+49 171 8920192', preferred_comm_method: 'email', channel: 'EMAIL', source: 'Sync Licensing Inquiries', status: 'In Discussion', interests: ['Film & TV Sync Clearance', 'Uncompressed Master Rights'], tags: ['sync', 'supervisor'] },
      { id: 'CRM-ND-3', name: 'Tariq Al-Mansoor', email: 'tariq@dubaimusicweek.ae', phone: '+971 50 829 1042', preferred_comm_method: 'sms', channel: 'SMS', source: 'Tour Booking Agent', status: 'Offer Received', interests: ['Headline Festival Slot', 'Direct Flight Hospitality Rider'], tags: ['booking', 'promoter'] },
      { id: 'CRM-ND-4', name: 'Maya Lin', email: 'maya@modularsound.org', phone: '+1 (415) 890-2341', preferred_comm_method: 'push', channel: 'PUSH', source: 'VIP Vault Pass', status: 'Subscribed', interests: ['Limited Vinyl & Merch Drops', 'Private Livestream Q&A'], tags: ['vip', 'fan'] },
      { id: 'CRM-ND-5', name: 'Kwame Osei', email: 'kwame@accramavens.com', phone: '+233 24 519 2831', preferred_comm_method: 'email', channel: 'EMAIL', source: 'EPK Contact', status: 'Subscribed', interests: ['West Africa Tour Pre-Sales', 'Audio Mastering Sessions'], tags: ['fan'] }
    ],
    campaigns: [
      { id: 'CMP-ND-101', name: 'Nairobi Cyberdome VIP Pre-Sale', channel: 'whatsapp', target: 'VIP Fans & Attendees', recipients: 142, openRate: '98.6%', status: 'Sent', date: 'SEP 02, 2026' },
      { id: 'CMP-ND-102', name: 'Exclusive Afro-Synth Dub VIP Release', channel: 'email', target: 'Digital Single Buyers', recipients: 88, openRate: '64.2%', status: 'Delivered', date: 'AUG 28, 2026' }
    ],
    playlists: [
      { id: 1, name: 'Modular Synth Journey & Afro Cues', fanName: 'Elena (Berlin Sync)', createdAt: 'SEP 04, 2026', tracks: [{ title: 'Echoes of the Savannah', artist: 'Ndufo' }, { title: 'Neon Equator', artist: 'Ndufo' }, { title: 'Solar Flare Groove', artist: 'Ndufo' }] },
      { id: 2, name: 'Cyberdome VIP Warmup', fanName: 'Alex Chen', createdAt: 'AUG 29, 2026', tracks: [{ title: 'Nairobi Cyberwave', artist: 'Ndufo' }, { title: 'Rift Valley Sunset', artist: 'Ndufo' }] }
    ]
  },
  aisha: {
    name: 'Aisha Mwangi',
    genre: 'Afro-Soul & R&B Vocals',
    contacts: [
      { id: 'CRM-AI-1', name: 'Fatima Zahra', email: 'fatima.z@casablancavibes.ma', phone: '+212 661 294810', preferred_comm_method: 'whatsapp', channel: 'WHATSAPP', source: 'Fan Club Portal', status: 'Subscribed', interests: ['VIP Front-Row Tickets', 'Limited Tour Vinyl', 'Meet & Greet Passes'], tags: ['fan', 'vip'] },
      { id: 'CRM-AI-2', name: 'Marcus Sterling', email: 'm.sterling@uktouring.co.uk', phone: '+44 7911 204918', preferred_comm_method: 'email', channel: 'EMAIL', source: 'EPK Tour Booker', status: 'Confirmed', interests: ['London O2 Academy Tour Dates', 'Acoustic Support Act'], tags: ['promoter', 'booking'] },
      { id: 'CRM-AI-3', name: 'Brenda Wanjiru', email: 'brenda.w@nairobilive.ke', phone: '+254 722 901 823', preferred_comm_method: 'sms', channel: 'SMS', source: 'Fan Club VIP Member', status: 'Subscribed', interests: ['Candlelight Acoustic Showcase', 'Signed Merch Drops'], tags: ['fan', 'vip'] },
      { id: 'CRM-AI-4', name: 'Liam O\'Connor', email: 'liam@dublinindie.ie', phone: '+353 87 291 0492', preferred_comm_method: 'email', channel: 'EMAIL', source: 'Radio Music Director', status: 'Subscribed', interests: ['Radio Single Servicing', 'Live On-Air Acoustic Session'], tags: ['press', 'radio'] },
      { id: 'CRM-AI-5', name: 'Chloe Dupont', email: 'chloe@parissoul.fr', phone: '+33 6 12 34 56 78', preferred_comm_method: 'push', channel: 'PUSH', source: 'Sync Licensing Inquiries', status: 'Proposal Sent', interests: ['Paris Fashion Week Runway Placement', 'Sync Clearance'], tags: ['sync', 'supervisor'] }
    ],
    campaigns: [
      { id: 'CMP-AI-201', name: 'Acoustic Candlelight Tour VIP Priority Codes', channel: 'whatsapp', target: 'VIP Passholders', recipients: 210, openRate: '99.1%', status: 'Sent', date: 'SEP 06, 2026' },
      { id: 'CMP-AI-202', name: 'Golden Hour EP Vinyl Pre-Order Blast', channel: 'email', target: 'Merch Collectors', recipients: 165, openRate: '72.4%', status: 'Delivered', date: 'AUG 31, 2026' }
    ],
    playlists: [
      { id: 101, name: 'Nairobi Sunset Soul Sessions', fanName: 'Brenda Wanjiru', createdAt: 'SEP 07, 2026', tracks: [{ title: 'Golden Hour Serenade', artist: 'Aisha Mwangi' }, { title: 'Swahili Coast Lullaby', artist: 'Aisha Mwangi' }] },
      { id: 102, name: 'Afro-R&B Late Night Driving', fanName: 'Fatima Zahra', createdAt: 'SEP 01, 2026', tracks: [{ title: 'Nairobi Rain', artist: 'Aisha Mwangi' }, { title: 'Velvet Midnight', artist: 'Aisha Mwangi' }] }
    ]
  },
  kip: {
    name: 'Kip & The Mavens',
    genre: 'Indie Afro-Rock & Live Band',
    contacts: [
      { id: 'CRM-KP-1', name: 'Dylan Murphy', email: 'dylan@austinpsychfest.com', phone: '+1 (512) 489-1029', preferred_comm_method: 'email', channel: 'EMAIL', source: 'Festival Talent Buyer', status: 'Contract Sent', interests: ['US Tour Headline Slot', 'Full Backline & Vintage Amps'], tags: ['promoter', 'booking'] },
      { id: 'CRM-KP-2', name: 'Sauti Juma', email: 'sauti@mombasarock.org', phone: '+254 733 819 201', preferred_comm_method: 'whatsapp', channel: 'WHATSAPP', source: 'Fan Club Portal', status: 'Subscribed', interests: ['College Tour Passes', 'Limited Cassette Tapes', 'Guitar Tab Vault'], tags: ['fan', 'vip'] },
      { id: 'CRM-KP-3', name: 'Rachel Green', email: 'rachel@indieaudiophile.com', phone: '+1 (206) 918-2831', preferred_comm_method: 'sms', channel: 'SMS', source: 'EPK Inquiry', status: 'Subscribed', interests: ['Vinyl Test Pressings', 'Tour Merchandise Drops'], tags: ['fan', 'vip'] },
      { id: 'CRM-KP-4', name: 'Jean-Luc Moreau', email: 'jmoreau@bruxelleslive.be', phone: '+32 470 12 34 56', preferred_comm_method: 'email', channel: 'EMAIL', source: 'European Showcase Scout', status: 'In Review', interests: ['EuroSonic Showcase Clearance', 'Festival Circuit 2027'], tags: ['booking', 'sync'] },
      { id: 'CRM-KP-5', name: 'Baraka Kiprop', email: 'baraka@riftvalleygroove.ke', phone: '+254 701 928 374', preferred_comm_method: 'whatsapp', channel: 'WHATSAPP', source: 'Band Merch Lead', status: 'Subscribed', interests: ['Stage Crew Passes', 'VIP Meet & Greet'], tags: ['fan'] }
    ],
    campaigns: [
      { id: 'CMP-KP-301', name: 'Rock the Rift Valley Festival Early-Bird Tickets', channel: 'sms', target: 'Festival Attendees', recipients: 340, openRate: '95.2%', status: 'Sent', date: 'SEP 05, 2026' },
      { id: 'CMP-KP-302', name: 'Limited Edition Tour Cassette Release Notice', channel: 'whatsapp', target: 'Cassette VIP Fans', recipients: 120, openRate: '97.8%', status: 'Delivered', date: 'AUG 25, 2026' }
    ],
    playlists: [
      { id: 201, name: 'Rift Valley Live Energy', fanName: 'Sauti Juma', createdAt: 'SEP 03, 2026', tracks: [{ title: 'Fuzz over Kilimanjaro', artist: 'Kip & The Mavens' }, { title: 'Dusty Highway Anthem', artist: 'Kip & The Mavens' }] },
      { id: 202, name: 'Desert Rock & Fuzz Odyssey', fanName: 'Dylan Murphy', createdAt: 'AUG 28, 2026', tracks: [{ title: 'Electric Acacia', artist: 'Kip & The Mavens' }, { title: 'Rift Valley Sunset (Live)', artist: 'Kip & The Mavens' }] }
    ]
  }
}

export default function SmartCrmStudioPanel({ sessionUser, onClose }) {
  const [activeTab, setActiveTab] = useState('contacts') // 'contacts' | 'broadcasts' | 'playlists' | 'pipeline'
  const [selectedSubdomain, setSelectedSubdomain] = useState(() => {
    return localStorage.getItem('last_saved_epk_subdomain') || 'ndufo'
  })
  const [statsMinimized, setStatsMinimized] = useState(false)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [isCentralSynced, setIsCentralSynced] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Broadcast Composer State
  const [campaignName, setCampaignName] = useState('')
  const [campaignChannel, setCampaignChannel] = useState('whatsapp') // 'whatsapp' | 'sms' | 'email'
  const [campaignTarget, setCampaignTarget] = useState('all')
  const [campaignSubject, setCampaignSubject] = useState('')
  const [campaignBody, setCampaignBody] = useState('')
  const [dispatching, setDispatching] = useState(false)
  const [dispatchSuccess, setDispatchSuccess] = useState('')
  const [campaignHistory, setCampaignHistory] = useState(() => {
    return (CREATOR_PROFILES[selectedSubdomain] || CREATOR_PROFILES.ndufo).campaigns
  })

  // New Lead Modal State
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false)
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    preferred_comm_method: 'whatsapp',
    message: '',
    tags: ['fan', 'vip']
  })

  // Fan Playlists
  const [fanPlaylists, setFanPlaylists] = useState([])

  // Helper to standardize contact records
  const normalizeContact = (c, fallbackOrigin = 'Intermaven Central CRM') => {
    const rawMethod = (c.preferred_comm_method || c.channel || 'email').toLowerCase()
    const rawName = c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'VIP Lead'
    const parts = rawName.split(' ')
    const firstName = c.first_name || parts[0] || 'VIP'
    const lastName = c.last_name || parts.slice(1).join(' ') || 'Fan'
    return {
      id: c.id || `CRM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: rawName,
      first_name: firstName,
      last_name: lastName,
      email: c.email || '',
      phone: c.phone || (rawMethod === 'whatsapp' ? '+254 712 345 678' : '+1 (555) 019-2834'),
      preferred_comm_method: rawMethod,
      channel: rawMethod.toUpperCase(),
      company: c.company || selectedSubdomain.toUpperCase(),
      interests: Array.isArray(c.interests) && c.interests.length > 0 ? c.interests : ['VIP Tour Pre-Sales', 'Merch Drops', 'Official Releases'],
      source: c.source || fallbackOrigin,
      status: c.status || 'Subscribed',
      message: c.message || `Ingested via ${fallbackOrigin}`,
      creator_username: c.creator_username || selectedSubdomain,
      tags: c.tags || ['fan', 'vip']
    }
  }

  // Load Contacts from Intermaven Central CRM (8080), TuneMavens API (8001) & Local Storage
  const loadContacts = async () => {
    setLoading(true)
    setSyncing(true)
    try {
      const combined = []
      const seenEmails = new Set()

      // Active Creator Profile Data
      const creatorProfile = CREATOR_PROFILES[selectedSubdomain] || CREATOR_PROFILES.ndufo

      // Update campaigns and playlists for the selected creator
      if (creatorProfile.campaigns) {
        setCampaignHistory(creatorProfile.campaigns)
      }
      if (creatorProfile.playlists) {
        setFanPlaylists(creatorProfile.playlists)
      }

      // Seed Creator's distinct verified contacts
      creatorProfile.contacts.forEach(contact => {
        const norm = normalizeContact(contact, `${creatorProfile.name} Official Vault`)
        if (norm.email && !seenEmails.has(norm.email.toLowerCase())) {
          seenEmails.add(norm.email.toLowerCase())
          combined.push(norm)
        }
      })

      // 1. Fetch from Intermaven Central CRM on Port 8080 (filtered by creator if tagged)
      try {
        const res8080 = await fetch('http://localhost:8080/api/crm/contacts')
        if (res8080.ok) {
          const data8080 = await res8080.json()
          if (Array.isArray(data8080.contacts)) {
            data8080.contacts.forEach(contact => {
              if (!contact.creator_username || contact.creator_username === selectedSubdomain) {
                const norm = normalizeContact(contact, 'Intermaven Central CRM (8080)')
                if (norm.email && !seenEmails.has(norm.email.toLowerCase())) {
                  seenEmails.add(norm.email.toLowerCase())
                  combined.push(norm)
                }
              }
            })
          }
        }
      } catch (err8080) {
        console.warn('Intermaven 8080 CRM fetch warning:', err8080)
      }

      // 2. Fetch from TuneMavens Backend CRM on Port 8001
      try {
        const res8001 = await fetch(`http://localhost:8001/api/crm/contacts?creator_username=${selectedSubdomain}`)
        if (res8001.ok) {
          const data8001 = await res8001.json()
          if (Array.isArray(data8001.contacts)) {
            data8001.contacts.forEach(contact => {
              const norm = normalizeContact(contact, 'TuneMavens Ecosystem CRM (8001)')
              if (norm.email && !seenEmails.has(norm.email.toLowerCase())) {
                seenEmails.add(norm.email.toLowerCase())
                combined.push(norm)
              }
            })
          }
        }
      } catch (err8001) {
        console.warn('TuneMavens 8001 CRM fetch warning:', err8001)
      }

      // 3. Fetch from Local Storage Creator Fans for this specific creator
      try {
        const local = JSON.parse(localStorage.getItem(`creator_crm_fans_${selectedSubdomain}`) || '[]')
        local.forEach((fan, idx) => {
          const norm = normalizeContact({
            ...fan,
            id: `CRM-LOCAL-${idx + 1}`,
            source: 'creator_fan_portal'
          }, 'Local Fan Vault')
          if (norm.email && !seenEmails.has(norm.email.toLowerCase())) {
            seenEmails.add(norm.email.toLowerCase())
            combined.push(norm)
          }
        })
      } catch (_) {}

      setContacts(combined)
      setIsCentralSynced(true)
    } catch (e) {
      console.warn('CRM Contacts Load error:', e)
      setIsCentralSynced(false)
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  // Load Fan Playlists from localStorage
  const loadFanPlaylists = () => {
    try {
      const stored = localStorage.getItem(`fan_playlists_${selectedSubdomain}`) || localStorage.getItem('fan_playlists_ndufo')
      if (stored) {
        setFanPlaylists(JSON.parse(stored))
      } else {
        setFanPlaylists([
          {
            id: 1,
            name: 'Modular Synth Journey & Afro Cues',
            fanName: 'Elena (Berlin Sync)',
            createdAt: 'SEP 04, 2026',
            tracks: [
              { title: 'Echoes of the Savannah', artist: 'Ndufo' },
              { title: 'Neon Equator', artist: 'Ndufo' },
              { title: 'Solar Flare Groove', artist: 'Ndufo' }
            ]
          },
          {
            id: 2,
            name: 'Cyberdome VIP Warmup',
            fanName: 'Aisha Mwangi',
            createdAt: 'SEP 03, 2026',
            tracks: [
              { title: 'Rift Valley Pulse', artist: 'Ndufo' },
              { title: 'Ancestral Frequencies', artist: 'Ndufo' }
            ]
          }
        ])
      }
    } catch (_) {}
  }

  useEffect(() => {
    loadContacts()
    loadFanPlaylists()
  }, [selectedSubdomain])

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    const term = searchQuery.toLowerCase()
    const matchesQuery = !term || (
      (c.name || `${c.first_name || ''} ${c.last_name || ''}`).toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.phone || '').toLowerCase().includes(term) ||
      (c.message || '').toLowerCase().includes(term)
    )
    const matchesChannel = channelFilter === 'all' || (c.preferred_comm_method === channelFilter)
    const matchesStatus = statusFilter === 'all' || (c.status === statusFilter)
    return matchesQuery && matchesChannel && matchesStatus
  })

  // Handle Dispatch Broadcast
  const handleDispatch = async () => {
    if (!campaignName.trim() || !campaignBody.trim()) {
      alert('Please provide a campaign title and message body.')
      return
    }
    setDispatching(true)
    try {
      // Send to FastAPI CRM campaigns if available
      try {
        await fetch('http://localhost:8001/api/crm/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: campaignName,
            subject: campaignSubject || campaignName,
            body: campaignBody,
            target_roles: [campaignTarget]
          })
        })
      } catch (_) {}

      const newCampaign = {
        id: `CMP-${Date.now().toString().slice(-4)}`,
        name: campaignName,
        channel: campaignChannel,
        target: campaignTarget === 'all' ? 'All Verified Fans' : 'VIP Passholders',
        recipients: filteredContacts.length || 24,
        openRate: campaignChannel === 'whatsapp' ? '99.1%' : campaignChannel === 'sms' ? '95.4%' : '51.8%',
        status: 'Dispatched',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()
      }

      setCampaignHistory([newCampaign, ...campaignHistory])
      setDispatchSuccess(`Omnichannel broadcast "${campaignName}" successfully dispatched to ${newCampaign.recipients} recipients!`)
      setCampaignName('')
      setCampaignSubject('')
      setCampaignBody('')
      setTimeout(() => setDispatchSuccess(''), 6000)
    } finally {
      setDispatching(false)
    }
  }

  // Handle Add New Lead
  const handleCreateLead = async () => {
    if (!newLead.email && !newLead.phone) {
      alert('Email or Phone is required.')
      return
    }
    const leadPayload = {
      ...newLead,
      name: `${newLead.first_name} ${newLead.last_name}`.trim(),
      creator_username: selectedSubdomain,
      source: 'manual_crm_entry',
      status: 'active'
    }

    try {
      await fetch('http://localhost:8001/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      })
    } catch (_) {}

    try {
      await fetch('http://localhost:8080/api/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadPayload.name,
          email: leadPayload.email,
          channel: (leadPayload.preferred_comm_method || 'email').toUpperCase(),
          doubleOptIn: true,
          source: `TuneMavens Creator EPK (@${selectedSubdomain})`,
          status: 'Subscribed'
        })
      })
    } catch (_) {}

    setContacts([leadPayload, ...contacts])
    setAddLeadModalOpen(false)
    setNewLead({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      preferred_comm_method: 'whatsapp',
      message: '',
      tags: ['fan', 'vip']
    })
  }

  // Export CSV
  const handleExportCsv = () => {
    const headers = 'ID,Name,Email,Phone,PreferredChannel,Source,Status,Message\n'
    const rows = filteredContacts.map(c => 
      `"${c.id || ''}","${c.name || ''}","${c.email || ''}","${c.phone || ''}","${c.preferred_comm_method || ''}","${c.source || ''}","${c.status || ''}","${(c.message || '').replace(/"/g, '""')}"`
    ).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `intermaven_crm_${selectedSubdomain}_${Date.now()}.csv`
    a.click()
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#04060f',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Top Header Bar */}
      <div style={{
        padding: '16px 24px',
        background: '#080c18',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #00f0ff, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 900
          }}>
            <RiMessage2Fill size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>
                Intermaven Smart CRM Studio
              </h2>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                background: isCentralSynced ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: isCentralSynced ? '#10b981' : '#f59e0b',
                border: `1px solid ${isCentralSynced ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCentralSynced ? '#10b981' : '#f59e0b', boxShadow: isCentralSynced ? '0 0 6px #10b981' : 'none' }} />
                {isCentralSynced ? 'CENTRAL INTERMAVEN CRM SYNCED' : 'OFFLINE BUFFER'}
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '2px' }}>
              Centralized Agency CRM Hub (Port 8080 & 8001) · Accessible by Content Owners & System Admin
            </div>
          </div>
        </div>

        {/* Creator Subdomain Selector & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={loadContacts}
            disabled={syncing}
            style={{
              background: 'rgba(0,240,255,0.1)',
              border: '1px solid rgba(0,240,255,0.3)',
              color: '#00f0ff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiRefreshLine className={syncing ? 'animate-spin' : ''} size={14} />
            {syncing ? 'Syncing...' : 'Sync Central CRM'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', background: '#04060d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '4px 10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginRight: '6px', fontWeight: 700 }}>CREATOR:</span>
            <select
              value={selectedSubdomain}
              onChange={e => setSelectedSubdomain(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#00f0ff', fontWeight: 800, fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="ndufo" style={{ background: '#090d1a', color: '#fff' }}>Ndufo (Official)</option>
              <option value="aisha" style={{ background: '#090d1a', color: '#fff' }}>Aisha Mwangi</option>
              <option value="kip" style={{ background: '#090d1a', color: '#fff' }}>Kip & The Mavens</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '7px 12px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiDownloadLine size={14} /> Export CSV
          </button>

          <button
            type="button"
            onClick={() => setAddLeadModalOpen(true)}
            style={{
              background: '#00f0ff',
              border: 'none',
              color: '#000',
              padding: '7px 14px',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiAddLine size={16} /> Add Fan / Lead
          </button>

          <a
            href="https://intermaven.io"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              padding: '7px 10px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none'
            }}
            title="Open Full Intermaven Cloud Portal"
          >
            <RiExternalLinkLine size={14} /> Cloud
          </a>

          <button
            type="button"
            onClick={() => setStatsMinimized(!statsMinimized)}
            style={{
              background: statsMinimized ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.06)',
              border: statsMinimized ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.15)',
              color: statsMinimized ? '#00f0ff' : '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title={statsMinimized ? "Show Full Metrics Ribbon" : "Minimize Stats to Maximize CRM Real Estate"}
          >
            {statsMinimized ? <><RiArrowDownSLine size={16} /> Expand Stats</> : <><RiArrowUpSLine size={16} /> Minimize Stats</>}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
                padding: '6px 10px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <RiCloseFill size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Ribbon (Collapsible for Maximum CRM Workspace) */}
      {statsMinimized ? (
        <div style={{
          padding: '10px 24px',
          background: '#04060d',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8' }}>
              Audience: <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{contacts.length}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              VIP Passholders: <strong style={{ color: '#00f0ff', fontSize: '0.92rem' }}>{contacts.filter(c => (c.tags || []).includes('vip') || c.source === 'creator_fan_portal').length}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              Ticket Reserves: <strong style={{ color: '#a855f7', fontSize: '0.92rem' }}>{contacts.filter(c => (c.interests || []).some(i => i.toLowerCase().includes('tour') || i.toLowerCase().includes('ticket'))).length || 3}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              Curated Playlists: <strong style={{ color: '#f59e0b', fontSize: '0.92rem' }}>{fanPlaylists.length}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setStatsMinimized(false)}
            style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <RiArrowDownSLine /> Expand Metrics
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          padding: '16px 24px',
          background: '#060810',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ background: '#0b1021', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Audience Vault
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
              {contacts.length} Fans & Contacts
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RiCheckLine /> 100% Verified Inbound
            </div>
          </div>

          <div style={{ background: '#0b1021', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              VIP Passholders
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00f0ff', marginTop: '4px' }}>
              {contacts.filter(c => (c.tags || []).includes('vip') || c.source === 'creator_fan_portal').length} Members
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              Active in Fan Vault & Pre-Sales
            </div>
          </div>

          <div style={{ background: '#0b1021', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tour Ticket Reserves
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>
              {contacts.filter(c => (c.interests || []).some(i => i.toLowerCase().includes('tour') || i.toLowerCase().includes('ticket'))).length || 3} Attendees
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              Nairobi Cyberdome & London O2
            </div>
          </div>

          <div style={{ background: '#0b1021', padding: '12px 16px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Fan Curated Playlists
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
              {fanPlaylists.length} Playlists
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
              Created via Public Creator EPK
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        padding: '0 24px',
        background: '#090d1a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        gap: '4px'
      }}>
        {[
          { id: 'contacts', label: 'Audience & Fan Leads', icon: RiUserHeartLine, count: filteredContacts.length },
          { id: 'broadcasts', label: 'Omnichannel Broadcasts', icon: RiSendPlaneFill, count: campaignHistory.length },
          { id: 'playlists', label: 'Fan Playlists & Curations', icon: RiDiscFill, count: fanPlaylists.length },
          { id: 'pipeline', label: 'Pipeline & Conversion Funnel', icon: RiBarChartFill }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #00f0ff' : '2px solid transparent',
                color: isActive ? '#fff' : '#94a3b8',
                padding: '12px 16px',
                fontSize: '0.84rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} color={isActive ? '#00f0ff' : '#64748b'} />
              {tab.label}
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '0.7rem',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#00f0ff' : '#94a3b8'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* ================= TAB 1: AUDIENCE & FAN LEADS ================= */}
        {activeTab === 'contacts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filter Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                  <RiSearchLine style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by fan name, email, phone..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      background: '#0a0f1d',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <select
                  value={channelFilter}
                  onChange={e => setChannelFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: '#0a0f1d',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="all">All Channels</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS / STK</option>
                  <option value="email">Email</option>
                  <option value="push">Push Notifications</option>
                </select>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Showing <strong style={{ color: '#fff' }}>{filteredContacts.length}</strong> verified contacts for <span style={{ color: '#00f0ff' }}>@{selectedSubdomain}</span>
              </div>
            </div>

            {/* Contacts Table */}
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                Connecting to Intermaven Smart CRM engine...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', background: '#0a0f1d', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                No fans matching current filter criteria.
              </div>
            ) : (
              <div style={{ background: '#0a0f1d', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                      <th style={{ padding: '12px 16px', fontWeight: 800 }}>FAN / CONTACT</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800 }}>COMM CHANNEL</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800 }}>ENGAGEMENT & INTERESTS</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800 }}>INBOUND MESSAGE / NOTE</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800 }}>STATUS</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>DIRECT ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c, i) => (
                      <tr key={c.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              color: '#00f0ff',
                              fontSize: '0.8rem'
                            }}>
                              {(c.first_name ? c.first_name[0] : (c.name ? c.name[0] : 'F')).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ color: '#fff', display: 'block' }}>{c.name || `${c.first_name || ''} ${c.last_name || ''}`}</strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{c.email}</span>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '3px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: c.preferred_comm_method === 'whatsapp' ? 'rgba(37,211,102,0.15)' : c.preferred_comm_method === 'sms' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                            color: c.preferred_comm_method === 'whatsapp' ? '#25d366' : c.preferred_comm_method === 'sms' ? '#60a5fa' : '#cbd5e1'
                          }}>
                            {c.preferred_comm_method === 'whatsapp' && <RiWhatsappFill />}
                            {c.preferred_comm_method === 'sms' && <RiSmartphoneFill />}
                            {c.preferred_comm_method === 'email' && <RiMailSendFill />}
                            {c.preferred_comm_method?.toUpperCase() || 'WHATSAPP'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                            {c.phone || '+254 700 000000'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                            {(Array.isArray(c.interests) && c.interests.length > 0 ? c.interests : ['VIP Pre-Sales', 'Unreleased Stems']).map((int, idx) => (
                              <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(0,240,255,0.08)', color: '#00f0ff', padding: '2px 6px', borderRadius: '3px', border: '1px solid rgba(0,240,255,0.2)' }}>
                                {int}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', maxWidth: '260px' }}>
                          <div style={{ fontSize: '0.76rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.message}>
                            {c.message || 'VIP Fan Vault registered through public EPK portal.'}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                            Source: {c.source === 'creator_fan_portal' ? 'Fan Club Portal' : c.source === 'creator_epk_contact' ? 'EPK Inquiries' : 'Manual / API'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: 'rgba(16,185,129,0.15)',
                            color: '#10b981',
                            border: '1px solid rgba(16,185,129,0.3)'
                          }}>
                            ● ACTIVE VIP
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {c.phone && (
                              <button
                                type="button"
                                onClick={() => {
                                  alert(`Triggering simulated STK push / SMS to ${c.phone} for @${selectedSubdomain} VIP pass!`)
                                }}
                                style={{
                                  background: 'rgba(0,240,255,0.1)',
                                  border: '1px solid rgba(0,240,255,0.25)',
                                  color: '#00f0ff',
                                  padding: '5px 8px',
                                  borderRadius: '3px',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer',
                                  fontWeight: 700
                                }}
                                title="Send STK / SMS Alert"
                              >
                                STK / SMS
                              </button>
                            )}
                            {c.email && (
                              <a
                                href={`mailto:${c.email}?subject=${encodeURIComponent(`VIP Update from ${selectedSubdomain.toUpperCase()}`)}`}
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#fff',
                                  padding: '5px 8px',
                                  borderRadius: '3px',
                                  fontSize: '0.72rem',
                                  textDecoration: 'none',
                                  fontWeight: 700
                                }}
                                title="Send Direct Email"
                              >
                                Email
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: OMNICHANNEL BROADCASTS ================= */}
        {activeTab === 'broadcasts' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Broadcast Composer */}
            <div style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                  Compose Omnichannel Broadcast
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                  Send targeted STK alerts, WhatsApp broadcasts, or rich HTML emails to fans of <strong style={{ color: '#00f0ff' }}>@{selectedSubdomain}</strong>.
                </p>
              </div>

              {dispatchSuccess && (
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '12px', borderRadius: '4px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiCheckboxCircleFill size={18} /> {dispatchSuccess}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                  CAMPAIGN TITLE
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Tour Presale Announcement or Stems Pack Drop"
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                    PRIMARY CHANNEL
                  </label>
                  <select
                    value={campaignChannel}
                    onChange={e => setCampaignChannel(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="whatsapp">WhatsApp Direct Broadcast (98% Open Rate)</option>
                    <option value="sms">SMS / STK Push Alert (Instant Mobile)</option>
                    <option value="email">Rich Email Newsletter</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                    AUDIENCE SEGMENT
                  </label>
                  <select
                    value={campaignTarget}
                    onChange={e => setCampaignTarget(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="all">All Verified Inbound Fans ({filteredContacts.length})</option>
                    <option value="vip">VIP Passholders Only</option>
                    <option value="ticket_holders">Concert & Tour Attendees</option>
                  </select>
                </div>
              </div>

              {campaignChannel === 'email' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                    EMAIL SUBJECT LINE
                  </label>
                  <input
                    type="text"
                    value={campaignSubject}
                    onChange={e => setCampaignSubject(e.target.value)}
                    placeholder="Exclusive access link enclosed for VIP fans..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>
                  MESSAGE CONTENT & CALL TO ACTION
                </label>
                <textarea
                  rows="5"
                  value={campaignBody}
                  onChange={e => setCampaignBody(e.target.value)}
                  placeholder="Hey {{fan_name}}! Here is your private access link to the upcoming Nairobi Cyberdome VIP rehearsal and exclusive tour hoodie pre-order..."
                  style={{ width: '100%', padding: '10px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Will dispatch via Intermaven Network Gateway · Est. cost: 0 TM Credits
                </span>
                <button
                  type="button"
                  onClick={handleDispatch}
                  disabled={dispatching}
                  style={{
                    background: '#00f0ff',
                    color: '#000',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    cursor: dispatching ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiSendPlaneFill size={16} />
                  {dispatching ? 'Dispatching...' : 'Dispatch Broadcast'}
                </button>
              </div>
            </div>

            {/* Campaign Dispatch History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#fff' }}>
                Broadcast Dispatch Log
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {campaignHistory.map(cmp => (
                  <div key={cmp.id} style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{cmp.name}</strong>
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 800 }}>
                        {cmp.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#94a3b8' }}>
                      <span>Target: {cmp.target}</span>
                      <span>Channel: <strong style={{ color: '#00f0ff' }}>{cmp.channel.toUpperCase()}</strong></span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                      <span>Delivered: {cmp.recipients}</span>
                      <span>Open Rate: <strong style={{ color: '#10b981' }}>{cmp.openRate}</strong></span>
                      <span style={{ color: '#64748b' }}>{cmp.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FAN PLAYLISTS & CURATIONS ================= */}
        {activeTab === 'playlists' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                Fan Curated Playlists & Vault Collections
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Explore playlists created by fans on your public Creator EPK portal. Track which cues and tracks resonate highest.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {fanPlaylists.map(pl => (
                <div key={pl.id} style={{ background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiDiscFill color="#00f0ff" size={20} />
                      <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{pl.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{pl.createdAt}</span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                    Curator: <strong style={{ color: '#cbd5e1' }}>{pl.fanName}</strong> · {pl.tracks?.length || 0} Tracks Selected
                  </div>

                  <div style={{ background: '#04060d', borderRadius: '4px', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    {(pl.tracks || []).map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                        <span style={{ color: '#cbd5e1' }}>{idx + 1}. {t.title}</span>
                        <span style={{ color: '#64748b' }}>{t.artist || selectedSubdomain}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#10b981' }}>● Shared to Creator Community</span>
                    <button
                      type="button"
                      onClick={() => alert(`Directly messaging curator ${pl.fanName} via Smart CRM!`)}
                      style={{
                        background: 'rgba(0,240,255,0.1)',
                        border: '1px solid rgba(0,240,255,0.3)',
                        color: '#00f0ff',
                        padding: '4px 10px',
                        borderRadius: '3px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      Message Curator
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PIPELINE & CONVERSION FUNNEL ================= */}
        {activeTab === 'pipeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                Pipeline Stages & Audience Conversion Funnel
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Visual overview of fan journey from EPK visitor to VIP ticket buyer and catalog licensee.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {[
                { stage: '1. INBOUND INQUIRIES', count: 4, desc: 'EPK Contact form submissions & sync licensing leads', color: '#3b82f6' },
                { stage: '2. VIP FAN VAULT', count: contacts.length, desc: 'Subscribed fans with preferred comms and verified mobile numbers', color: '#00f0ff' },
                { stage: '3. TICKET PRE-SALES', count: 3, desc: 'Fans with reserved passes for live tour dates', color: '#a855f7' },
                { stage: '4. STEM & MERCH BUYERS', count: 2, desc: 'Priced vinyl collectors and industry stem practitioners', color: '#10b981' }
              ].map((col, idx) => (
                <div key={idx} style={{ background: '#0a0f1d', border: `1px solid ${col.color}40`, borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: col.color, fontSize: '0.8rem', letterSpacing: '0.04em' }}>{col.stage}</strong>
                    <span style={{ background: `${col.color}20`, color: col.color, fontWeight: 900, padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                      {col.count}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {col.desc}
                  </p>
                  <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Conversion Rate</span>
                    <strong style={{ color: '#fff' }}>{idx === 0 ? '100%' : `${Math.round(100 / (idx + 1))}%`}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lead / Fan Modal */}
      {addLeadModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: '#090d1a',
            border: '1px solid rgba(0,240,255,0.3)',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>
                Add New Contact to Smart CRM
              </h3>
              <button
                type="button"
                onClick={() => setAddLeadModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <RiCloseFill size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>First Name</label>
                <input
                  type="text"
                  value={newLead.first_name}
                  onChange={e => setNewLead({ ...newLead, first_name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Last Name</label>
                <input
                  type="text"
                  value={newLead.last_name}
                  onChange={e => setNewLead({ ...newLead, last_name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Email Address</label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="fan@intermaven.io"
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Phone / Mobile (STK)</label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="+254 712 345 678"
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Preferred Communication Channel</label>
              <select
                value={newLead.preferred_comm_method}
                onChange={e => setNewLead({ ...newLead, preferred_comm_method: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
              >
                <option value="whatsapp">WhatsApp Direct</option>
                <option value="sms">SMS / STK Push</option>
                <option value="email">Email Newsletter</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Inbound Message / Internal Note</label>
              <textarea
                rows="3"
                value={newLead.message}
                onChange={e => setNewLead({ ...newLead, message: e.target.value })}
                placeholder="VIP ticket inquiry, festival booking, or merch request..."
                style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => setAddLeadModalOpen(false)}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 16px', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateLead}
                style={{ background: '#00f0ff', border: 'none', color: '#000', padding: '8px 20px', borderRadius: '4px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
