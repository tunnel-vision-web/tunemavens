import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  RiHomeFill, RiUserFill, RiCalendarEventFill, RiVideoFill,
  RiShoppingBagFill, RiFileTextFill, RiMailFill, RiHeartFill,
  RiFlashlightFill, RiPlayFill, RiPauseFill, RiDownloadFill,
  RiTicket2Fill, RiExternalLinkFill, RiInstagramFill, RiYoutubeFill,
  RiSpotifyFill, RiAppleFill, RiTwitterXFill, RiDiscordFill, RiCheckFill,
  RiShoppingBasket2Fill, RiLockPasswordFill, RiUserAddFill, RiShieldCheckFill,
  RiLayoutGridFill, RiMusic2Fill, RiInformationFill, RiStarFill, RiCloseFill,
  RiFileCopyFill, RiArrowRightSFill
} from 'react-icons/ri'

// 20 Pre-populated Theme Templates Specification
export const EPK_THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon Grid', bg: 'linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)', cardBg: 'rgba(25, 15, 45, 0.7)', accent: '#00f0ff', secondary: '#ff007f', font: 'Orbitron, sans-serif', genre: 'Synthwave / Cyberpunk' },
  { id: 'afrobeat', name: 'Afrobeat Gold & Bronze', bg: 'linear-gradient(135deg, #1f1406 0%, #2e1d09 100%)', cardBg: 'rgba(45, 30, 10, 0.75)', accent: '#ffb703', secondary: '#fb8500', font: 'Outfit, sans-serif', genre: 'Afrobeats / Amapiano' },
  { id: 'indie_mono', name: 'Indie Minimalist Mono', bg: '#121212', cardBg: 'rgba(30, 30, 30, 0.8)', accent: '#ffffff', secondary: '#a0a0a0', font: 'Inter, sans-serif', genre: 'Indie Rock / Singer-Songwriter' },
  { id: 'dark_synth', name: 'Dark Synthwave Reel', bg: 'linear-gradient(135deg, #080811 0%, #141428 100%)', cardBg: 'rgba(20, 20, 45, 0.75)', accent: '#bd00ff', secondary: '#00e5ff', font: 'Rajdhani, sans-serif', genre: 'Industrial / Darkwave' },
  { id: 'pop_vibrant', name: 'Pop Vibrant Gradient', bg: 'linear-gradient(135deg, #18002e 0%, #3a0057 100%)', cardBg: 'rgba(60, 10, 90, 0.7)', accent: '#ff00aa', secondary: '#00fff0', font: 'Poppins, sans-serif', genre: 'Mainstream Pop / Dance' },
  { id: 'acoustic_wood', name: 'Acoustic Studio Wood', bg: 'linear-gradient(135deg, #1a1410 0%, #291c14 100%)', cardBg: 'rgba(40, 28, 20, 0.8)', accent: '#d4a373', secondary: '#faedcd', font: 'Lora, serif', genre: 'Folk / Country' },
  { id: 'hiphop_dark', name: 'Hip-Hop Studio Dark', bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)', cardBg: 'rgba(35, 35, 35, 0.85)', accent: '#e63946', secondary: '#f1faee', font: 'Montserrat, sans-serif', genre: 'Trap / Drill / Boom Bap' },
  { id: 'electronic', name: 'Electronic Festival Lights', bg: 'linear-gradient(135deg, #051923 0%, #003554 100%)', cardBg: 'rgba(0, 50, 80, 0.7)', accent: '#00a6fb', secondary: '#0582ca', font: 'Chakra Petch, sans-serif', genre: 'EDM / Techno' },
  { id: 'retro_vinyl', name: 'Retro Vinyl Warmth', bg: 'linear-gradient(135deg, #2b1e1a 0%, #3d2720 100%)', cardBg: 'rgba(60, 40, 32, 0.8)', accent: '#e07a5f', secondary: '#f4f1de', font: 'Playfair Display, serif', genre: 'Soul / Funk / Retro R&B' },
  { id: 'metal_crimson', name: 'Metal Crimson Steel', bg: 'linear-gradient(135deg, #140505 0%, #260a0a 100%)', cardBg: 'rgba(40, 15, 15, 0.85)', accent: '#ff1e1e', secondary: '#808080', font: 'Cinzel, serif', genre: 'Heavy Metal / Hardcore' },
  { id: 'ambient_glass', name: 'Ambient Glassmorphic', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', cardBg: 'rgba(30, 41, 59, 0.6)', accent: '#38bdf8', secondary: '#818cf8', font: 'Plus Jakarta Sans, sans-serif', genre: 'Ambient / Film Score' },
  { id: 'lofi_chill', name: 'Lo-Fi Chill Sunset', bg: 'linear-gradient(135deg, #2a1b3d 0%, #44318d 100%)', cardBg: 'rgba(68, 49, 141, 0.65)', accent: '#e8a87c', secondary: '#c38d9e', font: 'Space Grotesk, sans-serif', genre: 'Lo-Fi / Chillhop' },
  { id: 'classical', name: 'Classical Elegance Gold', bg: 'linear-gradient(135deg, #111115 0%, #22222a 100%)', cardBg: 'rgba(35, 35, 45, 0.8)', accent: '#d4af37', secondary: '#f8f9fa', font: 'Cormorant Garamond, serif', genre: 'Neoclassical / Orchestral' },
  { id: 'rnb_velvet', name: 'R&B Velvet Midnight', bg: 'linear-gradient(135deg, #190a28 0%, #2c1347 100%)', cardBg: 'rgba(44, 19, 71, 0.75)', accent: '#c084fc', secondary: '#f472b6', font: 'Syne, sans-serif', genre: 'Contemporary R&B / Neo-Soul' },
  { id: 'gospel_light', name: 'Gospel Light Sanctuary', bg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)', cardBg: 'rgba(30, 58, 138, 0.7)', accent: '#60a5fa', secondary: '#fef08a', font: 'Manrope, sans-serif', genre: 'Gospel / Contemporary Christian' },
  { id: 'reggae_roots', name: 'Reggae Roots Emerald', bg: 'linear-gradient(135deg, #062c19 0%, #0d472a 100%)', cardBg: 'rgba(13, 71, 42, 0.8)', accent: '#22c55e', secondary: '#eab308', font: 'Cabinet Grotesk, sans-serif', genre: 'Reggae / Dancehall / Dub' },
  { id: 'punk_disrupt', name: 'Punk Disrupt Neon', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', cardBg: 'rgba(41, 37, 36, 0.85)', accent: '#ccff00', secondary: '#ff0055', font: 'Rubik Glitch, sans-serif', genre: 'Pop-Punk / Post-Hardcore' },
  { id: 'jazz_lounge', name: 'Jazz Lounge Smoked', bg: 'linear-gradient(135deg, #1c140e 0%, #2e2017 100%)', cardBg: 'rgba(46, 32, 23, 0.8)', accent: '#fbbf24', secondary: '#d97706', font: 'DM Serif Display, serif', genre: 'Contemporary Jazz / Fusion' },
  { id: 'experimental', name: 'Experimental Glitch', bg: 'linear-gradient(135deg, #030712 0%, #111827 100%)', cardBg: 'rgba(17, 24, 39, 0.85)', accent: '#a855f7', secondary: '#06b6d4', font: 'Fira Code, monospace', genre: 'Experimental / Hyperpop' },
  { id: 'future_bass', name: 'Future Bass Spectrum', bg: 'linear-gradient(135deg, #0f172a 0%, #311b92 100%)', cardBg: 'rgba(49, 27, 146, 0.7)', accent: '#ec4899', secondary: '#3b82f6', font: 'Outfit, sans-serif', genre: 'Future Bass / Melodic Dubstep' },
]

export default function CreatorEpkView() {
  const { username } = useParams()
  const rawArtistName = username ? username.replace(/[-_]/g, ' ') : 'Kip & The Mavens'
  const artistName = rawArtistName.charAt(0).toUpperCase() + rawArtistName.slice(1)
  const artistSlug = (username || 'kip').toLowerCase().replace(/[^a-z0-9]/g, '')

  // State Management
  const [activeTab, setActiveTab] = useState('home')
  const [selectedTheme, setSelectedTheme] = useState(EPK_THEMES[0])
  const [layoutMode, setLayoutMode] = useState('hero') // 'hero' | 'split' | 'glass' | 'cyber'
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState({ title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', duration: '3:45' })
  
  // Auth / Fan Protocol State (Isolated to Creator Admin CRM + Intermaven Global)
  const [fanUser, setFanUser] = useState(() => {
    try {
      const saved = localStorage.getItem(`fan_session_${artistSlug}`)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signup') // 'signup' | 'login'
  const [authEmail, setAuthEmail] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPassword, setAuthPassword] = useState('')

  // Commerce & Ticket Modals
  const [selectedShow, setSelectedShow] = useState(null)
  const [ticketQty, setTicketQty] = useState(1)
  const [ticketSuccess, setTicketSuccess] = useState(null)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Fan Club CRM
  const [fanJoined, setFanJoined] = useState(false)
  const [fanPosts, setFanPosts] = useState([
    { id: 1, author: 'Sarafina M.', date: '2 hours ago', text: 'Can wait for the London O2 show! Pre-ordered the vinyl!' },
    { id: 2, author: 'David K.', date: '1 day ago', text: 'The stems on track 3 are incredible for my DJ sets.' }
  ])
  const [newPostText, setNewPostText] = useState('')

  // AI Assistant Drawer
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false)

  // Discography Catalog
  const tracks = [
    { id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', streams: '3.4M', duration: '3:45', release: 'Single 2026' },
    { id: 2, title: 'Sunset over Rift Valley', isrc: 'KE-TM1-26-00043', streams: '1.8M', duration: '4:12', release: 'Album 2026' },
    { id: 3, title: 'Afro-Synth Cascade', isrc: 'KE-TM1-26-00044', streams: '940K', duration: '3:18', release: 'Single 2025' },
    { id: 4, title: 'Midnight Mara Starlight', isrc: 'KE-TM1-26-00045', streams: '2.1M', duration: '5:02', release: 'EP 2025' }
  ]

  // Shows Data
  const shows = [
    { id: 101, date: 'SEP 18, 2026', venue: 'Nairobi Cyberdome', city: 'Nairobi, Kenya', price: '$25.00', numPrice: 25, status: 'On Sale' },
    { id: 102, date: 'OCT 04, 2026', venue: 'London O2 Academy', city: 'London, UK', price: '$38.00', numPrice: 38, status: 'Selling Fast' },
    { id: 103, date: 'OCT 22, 2026', venue: 'Brooklyn Steel', city: 'New York, US', price: '$35.00', numPrice: 35, status: 'On Sale' },
    { id: 104, date: 'NOV 12, 2026', venue: 'Tokyo Shibuya Club Quattro', city: 'Tokyo, Japan', price: '$45.00', numPrice: 45, status: 'Limited VIP' }
  ]

  // Store Merchandise Data
  const products = [
    { id: 201, title: 'Nairobi Cyberwave Limited 180g Vinyl LP', price: '$34.99', numPrice: 34.99, img: 'https://picsum.photos/seed/vinyl_epk/400', category: 'Physical Vinyl' },
    { id: 202, title: 'Intermaven Tour Heavyweight Hoodie (Black)', price: '$59.99', numPrice: 59.99, img: 'https://picsum.photos/seed/hoodie_epk/400', category: 'Apparel' },
    { id: 203, title: 'Lossless 24-Bit WAV Multitrack Stems Pack', price: '$19.99', numPrice: 19.99, img: 'https://picsum.photos/seed/stems_epk/400', category: 'Digital Stems' },
    { id: 204, title: 'Official World Tour Poster (Signed Edition)', price: '$24.99', numPrice: 24.99, img: 'https://picsum.photos/seed/poster_epk/400', category: 'Collector Item' }
  ]

  // Videos Data
  const videos = [
    { id: 301, title: `${artistName} — Nairobi Cyberwave (Official 4K Music Video)`, views: '1.2M views', duration: '3:50', thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340' },
    { id: 302, title: 'Live at SyncMavens Vault (Full Concert 4K)', views: '840K views', duration: '45:10', thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340' },
    { id: 303, title: 'Inside the Studio: Synthesizing Afro-House Soundscapes', views: '320K views', duration: '14:22', thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340' }
  ]

  // Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault()
    const user = { name: authName || authEmail.split('@')[0], email: authEmail, crmId: `CRM-${Math.floor(100000 + Math.random() * 900000)}` }
    setFanUser(user)
    localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(user))
    setAuthModalOpen(false)
  }

  const handleLogout = () => {
    setFanUser(null)
    localStorage.removeItem(`fan_session_${artistSlug}`)
  }

  const handleTicketBuy = (e) => {
    e.preventDefault()
    setTicketSuccess({
      qr: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      show: selectedShow,
      qty: ticketQty,
      total: (selectedShow.numPrice * ticketQty).toFixed(2)
    })
  }

  const handleOrderBuy = (e) => {
    e.preventDefault()
    setOrderSuccess(true)
    setTimeout(() => {
      setOrderSuccess(false)
      setSelectedProduct(null)
    }, 3000)
  }

  const handlePostSubmit = (e) => {
    e.preventDefault()
    if (newPostText) {
      setFanPosts([{ id: Date.now(), author: fanUser ? fanUser.name : 'Anonymous Fan', date: 'Just now', text: newPostText }, ...fanPosts])
      setNewPostText('')
    }
  }

  return (
    <div style={{
      background: selectedTheme.bg,
      color: '#ffffff',
      fontFamily: selectedTheme.font,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.4s ease',
      position: 'relative'
    }}>

      {/* ================= 1. MAIN TOP HEADER (NAVBAR AT VERY TOP) ================= */}
      <header style={{
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${selectedTheme.accent}33`,
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {/* Brand & Creator Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: selectedTheme.accent,
            color: '#000',
            fontWeight: 900,
            fontSize: '1.3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 12px ${selectedTheme.accent}`
          }}>
            {artistName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {artistName}
              <span style={{ fontSize: '0.65rem', background: `${selectedTheme.accent}22`, color: selectedTheme.accent, border: `1px solid ${selectedTheme.accent}55`, padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {selectedTheme.genre}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {artistSlug}.tunemavens.com • Official Site
            </div>
          </div>
        </div>

        {/* Header Menu Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'home', label: 'Home', icon: <RiHomeFill /> },
            { id: 'bio', label: 'Bio', icon: <RiUserFill /> },
            { id: 'shows', label: 'Shows', icon: <RiCalendarEventFill /> },
            { id: 'videos', label: 'Videos', icon: <RiVideoFill /> },
            { id: 'store', label: 'Store', icon: <RiShoppingBagFill /> },
            { id: 'press', label: 'Press Kit', icon: <RiFileTextFill /> },
            { id: 'contact', label: 'Contact', icon: <RiMailFill /> },
            { id: 'fanclub', label: 'Fan Club', icon: <RiHeartFill /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? selectedTheme.accent : 'transparent',
                color: activeTab === tab.id ? '#000' : '#cbd5e1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Action Tools: Fan VIP Auth Protocol & Layout Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Layout Mode Selector */}
          <select
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <option value="hero">Layout: Full Hero Banner</option>
            <option value="split">Layout: Split Screen</option>
            <option value="glass">Layout: Glassmorphic</option>
            <option value="cyber">Layout: Cyber Matrix</option>
          </select>

          {/* AI Assistant */}
          <button
            onClick={() => setAiDrawerOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${selectedTheme.accent}66`,
              color: selectedTheme.accent,
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiFlashlightFill /> AI Studio
          </button>

          {/* Fan Protocol Login / VIP Account */}
          {fanUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '4px 10px', borderRadius: '20px' }}>
              <RiShieldCheckFill style={{ color: selectedTheme.accent }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{fanUser.name}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '4px' }}>Log out</button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: selectedTheme.accent,
                color: '#000',
                border: 'none',
                padding: '7px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 0 10px ${selectedTheme.accent}44`
              }}
            >
              <RiUserAddFill /> VIP Access / Login
            </button>
          )}

        </div>
      </header>

      {/* ================= 2. HERO SECTION / LAYOUT MODES ================= */}
      {activeTab === 'home' && (
        <section style={{
          padding: layoutMode === 'split' ? '40px 48px' : '60px 24px',
          textAlign: layoutMode === 'split' ? 'left' : 'center',
          background: layoutMode === 'cyber' 
            ? `radial-gradient(circle at top left, ${selectedTheme.secondary}33 0%, #000 80%)`
            : `radial-gradient(circle at center, ${selectedTheme.secondary}25 0%, transparent 70%)`,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: layoutMode === 'split' ? 'grid' : 'block', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: selectedTheme.accent, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                STANDALONE CREATOR WEB WORLD
              </span>
              <h1 style={{ fontSize: layoutMode === 'split' ? '3.8rem' : '4.2rem', margin: '8px 0 12px', letterSpacing: '-1px', fontWeight: 900, lineHeight: 1.1 }}>
                {artistName}
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', maxWidth: '650px', margin: layoutMode === 'split' ? '0 0 24px' : '0 auto 24px', lineHeight: 1.6 }}>
                Nairobi Electronic Sunset Pioneer • Lossless Master Audio Catalog & Direct Intermaven Split Engine.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: layoutMode === 'split' ? 'flex-start' : 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setActiveTab('shows')}
                  style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiTicket2Fill /> Get Tour Tickets
                </button>
                <button 
                  onClick={() => setActiveTab('store')}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiShoppingBagFill /> Order Merch & Stems
                </button>
              </div>
            </div>

            {/* Audio Player Card */}
            <div style={{
              background: selectedTheme.cardBg,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${selectedTheme.accent}44`,
              borderRadius: '20px',
              padding: '24px',
              marginTop: layoutMode === 'split' ? 0 : '36px',
              maxWidth: '520px',
              margin: layoutMode === 'split' ? 0 : '36px auto 0',
              boxShadow: `0 12px 40px ${selectedTheme.accent}22`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 16px ${selectedTheme.accent}66` }}
                >
                  {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
                </button>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{activeTrack.title}</div>
                  <div style={{ fontSize: '0.8rem', color: selectedTheme.accent, marginTop: '2px' }}>
                    ISRC: {activeTrack.isrc} • Lossless 24-bit 96kHz
                  </div>
                </div>
              </div>

              {/* Audio Waveform progress line */}
              <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: isPlaying ? '65%' : '30%', height: '100%', background: selectedTheme.accent, transition: 'width 0.3s ease' }} />
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ================= 3. MAIN CONTENT BODY ================= */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Catalog Tracks Grid */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: selectedTheme.accent, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiMusic2Fill /> Discography & Lossless Master Tracks
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>4 Verified Tracks • Shared Ledger Verified</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {tracks.map(t => (
                  <div 
                    key={t.id} 
                    style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: selectedTheme.accent, fontWeight: 700 }}>{t.release}</div>
                      <h4 style={{ margin: '6px 0 4px', fontSize: '1rem', fontWeight: 800 }}>{t.title}</h4>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ISRC: {t.isrc} • {t.streams} Streams</div>
                    </div>
                    <button 
                      onClick={() => { setActiveTrack(t); setIsPlaying(true); }}
                      style={{ marginTop: '14px', background: activeTrack.id === t.id && isPlaying ? selectedTheme.accent : 'rgba(255,255,255,0.08)', color: activeTrack.id === t.id && isPlaying ? '#000' : '#fff', border: `1px solid ${selectedTheme.accent}44`, padding: '8px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                      {activeTrack.id === t.id && isPlaying ? <><RiPauseFill /> Playing...</> : <><RiPlayFill /> Stream Master</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Tour Dates & Store Spotlight */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
              
              {/* Shows Quick Card */}
              <div style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: selectedTheme.accent }}>Upcoming Live Dates</h3>
                {shows.slice(0, 3).map((s) => (
                  <div key={s.id} style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{s.venue}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.city} • {s.date}</div>
                    </div>
                    <button 
                      onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                      style={{ background: selectedTheme.accent, border: 'none', color: '#000', padding: '6px 14px', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Buy {s.price}
                    </button>
                  </div>
                ))}
              </div>

              {/* Merch Spotlight Card */}
              <div style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
                <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: selectedTheme.accent }}>Merchandise Spotlight</h3>
                <img src={products[0].img} alt={products[0].title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }} />
                <h4 style={{ margin: '4px 0', fontSize: '0.95rem' }}>{products[0].title}</h4>
                <div style={{ fontWeight: 800, color: selectedTheme.accent, fontSize: '1.1rem', marginBottom: '12px' }}>{products[0].price}</div>
                <button 
                  onClick={() => setSelectedProduct(products[0])}
                  style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Order Vinyl LP
                </button>
              </div>

            </div>

            {/* Social Media Photo Stream */}
            <div>
              <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: selectedTheme.accent, marginBottom: '16px' }}>
                Instagram & Live Tour Photo Stream
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <div key={num} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '160px', background: 'rgba(255,255,255,0.04)' }}>
                    <img src={`https://picsum.photos/seed/epk_feed_${num}/300/300`} alt="Feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: BIO ================= */}
        {activeTab === 'bio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900 }}>
                Biography & Artistic Lineage
              </h2>
              <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0' }}>
                <b>{artistName}</b> is a pioneering force within the modern electronic and global fusion scene. Synthesizing traditional East African acoustic arrangements with cutting-edge cyber-synth soundscapes, {artistName} has captivated international audiences across Nairobi, London, Berlin, and New York.
              </p>
              <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#cbd5e1' }}>
                With over 8 million cumulative streams on <b>TuneStream</b> and verified splits registered on the <b>Intermaven Shared Ledger</b>, {artistName} represents a new generation of independent creators controlling their master recordings, sync placements, and direct fan CRM relationships.
              </p>
              
              <blockquote style={{ borderLeft: `4px solid ${selectedTheme.accent}`, paddingLeft: '20px', margin: '28px 0', fontStyle: 'italic', fontSize: '1.15rem', color: '#f8fafc' }}>
                "A breathtaking fusion of heritage soundscapes and forward-thinking electronic production." — <i>Pitchfork / Intermaven Music Journal</i>
              </blockquote>
            </div>

            {/* Production Credits Table */}
            <div style={{ background: selectedTheme.cardBg, padding: '28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 800 }}>Key Discography & Metadata Credits</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '10px' }}>Release Title</th>
                    <th style={{ padding: '10px' }}>Year</th>
                    <th style={{ padding: '10px' }}>ISRC Code</th>
                    <th style={{ padding: '10px' }}>Label / Network</th>
                  </tr>
                </thead>
                <tbody>
                  {tracks.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>{t.title}</td>
                      <td style={{ padding: '12px 10px' }}>2026</td>
                      <td style={{ padding: '12px 10px', color: selectedTheme.accent, fontFamily: 'monospace' }}>{t.isrc}</td>
                      <td style={{ padding: '12px 10px' }}>TuneMavens / Intermaven Record Network</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SHOWS ================= */}
        {activeTab === 'shows' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2rem', fontWeight: 900 }}>Tour Dates & Live Experiences</h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>QR Entry Passes generated with instant Stripe validation</p>
              </div>
              <span style={{ background: 'rgba(34, 211, 238, 0.1)', color: selectedTheme.accent, border: `1px solid ${selectedTheme.accent}44`, padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                World Tour 2026
              </span>
            </div>

            {shows.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>{s.venue}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '2px' }}>{s.city} • {s.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: selectedTheme.accent }}>{s.price}</span>
                  <button 
                    onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                    style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', boxShadow: `0 0 12px ${selectedTheme.accent}44` }}
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 4: VIDEOS ================= */}
        {activeTab === 'videos' && (
          <div>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900, marginBottom: '24px' }}>
              4K Music Videos & Live Performances
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
              {videos.map(v => (
                <div key={v.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
                  <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button 
                        onClick={() => alert(`Playing 4K Video Stream: ${v.title}`)}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{v.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{v.views} • Duration: {v.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: STORE ================= */}
        {activeTab === 'store' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2rem', fontWeight: 900 }}>Official Creator Storefront</h2>
              <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Direct Order Fulfillment • Lossless Digital Stems</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {products.map(p => (
                <div key={p.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.7rem', color: selectedTheme.accent, textTransform: 'uppercase', fontWeight: 700 }}>{p.category}</span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '1rem', fontWeight: 800 }}>{p.title}</h4>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: selectedTheme.accent, fontSize: '1.2rem', marginBottom: '14px' }}>{p.price}</div>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: PRESS KIT ================= */}
        {activeTab === 'press' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900 }}>
              Electronic Press Kit (EPK) Assets & Technical Rider
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '28px' }}>Approved high-resolution press assets, stage plots, and official one-sheets for festival bookers and media outlets.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading Official 1-Sheet PDF...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Official 1-Sheet PDF</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (2.4 MB)</div>
                </div>
              </a>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading High-Res Press Photos (ZIP)...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Hi-Res Photos (ZIP)</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (48 MB)</div>
                </div>
              </a>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading Technical Stage Plot Rider...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Stage Plot & Rider</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (1.1 MB)</div>
                </div>
              </a>
            </div>

            {/* Approved Short Bio */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: selectedTheme.accent, fontWeight: 800 }}>Approved Press Bio (Short 100-Word Copy)</h4>
                <button onClick={() => alert('Press bio copied to clipboard!')} style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RiFileCopyFill /> Copy Text
                </button>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                "{artistName} is an East African electronic fusion artist blending organic acoustic percussion with cutting-edge synth basslines. With over 8 million cumulative streams and headlining performances across Europe and Kenya, {artistName} delivers unforgettable live experiences."
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: CONTACT ================= */}
        {activeTab === 'contact' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900 }}>
              Management & Booking Inquiries
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Direct portal to {artistName}'s authorized representative and management team.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry message dispatched to creator management inbox!'); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Your Name / Agency</label>
                <input type="text" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Email Address</label>
                <input type="email" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Inquiry Category</label>
                <select style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem' }}>
                  <option>Sync Licensing (Film / TV / Gaming)</option>
                  <option>Live Festival & Tour Booking</option>
                  <option>Brand Sponsorship & Press Inquiry</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Message Details</label>
                <textarea required rows={4} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem', resize: 'none' }} />
              </div>
              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: 900, width: '100%', cursor: 'pointer', fontSize: '1rem' }}>
                Send Inquiry
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 8: FAN CLUB / VIP VAULT ================= */}
        {activeTab === 'fanclub' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '20px', border: `1px solid ${selectedTheme.accent}66`, textAlign: 'center', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
              <RiHeartFill style={{ fontSize: '3.5rem', color: selectedTheme.accent }} />
              <h2 style={{ marginTop: '12px', fontSize: '2rem', fontWeight: 900 }}>
                Join {artistName}'s Official VIP Fan Vault
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Get exclusive access to unreleased master demos, presale tour ticket codes, and direct messaging with {artistName}. Synchronized directly into <b>Intermaven Smart CRM</b>.
              </p>

              {fanUser || fanJoined ? (
                <div style={{ padding: '20px', background: 'rgba(0, 255, 128, 0.15)', borderRadius: '12px', border: '1px solid #00ff80', color: '#00ff80', marginTop: '20px' }}>
                  <RiCheckFill style={{ fontSize: '1.8rem' }} />
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '6px' }}>VIP Membership Active!</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>Member ID: {fanUser ? fanUser.crmId : 'CRM-884029'}</div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setFanJoined(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    required
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    required
                    style={{ padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontSize: '0.95rem' }}
                  />
                  <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', fontSize: '1rem' }}>
                    Join VIP Fan Club
                  </button>
                </form>
              )}
            </div>

            {/* Fan Message Wall */}
            <div style={{ background: selectedTheme.cardBg, padding: '28px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 800 }}>Fan Community Message Wall</h3>
              
              <form onSubmit={handlePostSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Post a message to the fan wall..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px' }}
                />
                <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                  Post
                </button>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {fanPosts.map(post => (
                  <div key={post.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: selectedTheme.accent }}>{post.author}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{post.date}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>{post.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= 4. COMPREHENSIVE FOOTER & POWERED BY INTERMAVEN ONLY AT BOTTOM ================= */}
      <footer style={{
        background: 'rgba(3, 5, 12, 0.95)',
        borderTop: `1px solid ${selectedTheme.accent}33`,
        padding: '48px 32px 24px',
        textAlign: 'center',
        marginTop: 'auto',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', textAlign: 'left', marginBottom: '40px' }}>
          
          {/* Creator Brand Column */}
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>
              {artistName}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6' }}>
              Official Standalone Creator Web World. All rights reserved. Registered on the Intermaven Shared Network.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Site Sections</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('home')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Home</span>
              <span onClick={() => setActiveTab('bio')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Bio</span>
              <span onClick={() => setActiveTab('shows')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Tour Dates</span>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Storefront</span>
            </div>
          </div>

          {/* Social Icons */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '14px', fontSize: '1.4rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiInstagramFill /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiYoutubeFill /></a>
              <a href="https://spotify.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiSpotifyFill /></a>
              <a href="https://apple.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiAppleFill /></a>
            </div>
          </div>

        </div>

        {/* Powered by Intermaven Badge - ONLY AT THE BOTTOM */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>© 2026 {artistName}. All rights reserved.</div>
          <a 
            href="https://intermaven.io" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            powered by <strong style={{ color: selectedTheme.accent }}>intermaven</strong>
          </a>
        </div>
      </footer>

      {/* ================= MODALS ================= */}

      {/* Auth VIP Modal */}
      {authModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setAuthModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 900 }}>
              {authMode === 'signup' ? `Join ${artistName}'s VIP Portal` : `VIP Fan Login`}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '18px' }}>
              Credentials saved to creator's admin database. Intermaven master access active.
            </p>
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {authMode === 'signup' && (
                <input type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }} />
              )}
              <input type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }} />
              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                {authMode === 'signup' ? 'Create VIP Account' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Purchase Modal */}
      {selectedShow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedShow(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            
            {ticketSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <RiCheckFill style={{ fontSize: '3rem', color: '#00ff80' }} />
                <h3 style={{ margin: '8px 0', color: '#00ff80' }}>Ticket Order Confirmed!</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '10px', margin: '16px 0', textAlign: 'left', fontSize: '0.85rem' }}>
                  <div><strong>Show:</strong> {ticketSuccess.show.venue} ({ticketSuccess.show.city})</div>
                  <div><strong>Date:</strong> {ticketSuccess.show.date}</div>
                  <div><strong>Pass Code:</strong> <span style={{ color: selectedTheme.accent, fontFamily: 'monospace' }}>{ticketSuccess.qr}</span></div>
                  <div><strong>Total Paid:</strong> ${ticketSuccess.total} USD</div>
                </div>
                <button onClick={() => setSelectedShow(null)} style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0, color: selectedTheme.accent }}>Buy Concert Tickets</h3>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px' }}>
                  <strong>{selectedShow.venue}</strong> • {selectedShow.city} ({selectedShow.date})
                </div>
                <form onSubmit={handleTicketBuy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#94a3b8' }}>Ticket Quantity</label>
                    <select value={ticketQty} onChange={(e) => setTicketQty(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }}>
                      <option value={1}>1 Ticket (${(selectedShow.numPrice * 1).toFixed(2)})</option>
                      <option value={2}>2 Tickets (${(selectedShow.numPrice * 2).toFixed(2)})</option>
                      <option value={4}>4 VIP Bundle (${(selectedShow.numPrice * 4).toFixed(2)})</option>
                    </select>
                  </div>
                  <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
                    Process Payment (${(selectedShow.numPrice * ticketQty).toFixed(2)})
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Order Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            
            {orderSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <RiCheckFill style={{ fontSize: '3rem', color: '#00ff80' }} />
                <h3 style={{ margin: '8px 0', color: '#00ff80' }}>Order Dispatched!</h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Fulfillment confirmation sent to your email.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0, color: selectedTheme.accent }}>Order Merchandise</h3>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '6px' }}>{selectedProduct.title}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: selectedTheme.accent, marginBottom: '16px' }}>{selectedProduct.price}</div>
                <form onSubmit={handleOrderBuy} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Shipping Full Name" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }} />
                  <input type="text" placeholder="Delivery Shipping Address" required style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '6px' }} />
                  <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>
                    Confirm & Pay {selectedProduct.price}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
