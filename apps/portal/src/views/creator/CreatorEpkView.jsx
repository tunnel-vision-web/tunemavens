import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  RiHomeFill, RiUserFill, RiCalendarEventFill, RiVideoFill,
  RiShoppingBagFill, RiFileTextFill, RiMailFill, RiHeartFill,
  RiPlayFill, RiPauseFill, RiDownloadFill,
  RiTicket2Fill, RiInstagramFill, RiYoutubeFill,
  RiSpotifyFill, RiAppleFill, RiTwitterXFill, RiDiscordFill, RiCheckFill,
  RiShoppingBasket2Fill, RiUserAddFill, RiShieldCheckFill,
  RiMusic2Fill, RiFileCopyFill, RiSearchLine, RiImageFill, RiArrowDownSLine
} from 'react-icons/ri'

import heroBannerImg from '../../assets/creator_hero_banner.jpg'

// 20 Pre-populated Theme Templates Specification
export const EPK_THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon Grid', bg: 'linear-gradient(135deg, #0f0c20 0%, #1a0826 100%)', cardBg: 'rgba(25, 15, 45, 0.75)', accent: '#00f0ff', secondary: '#ff007f', font: 'Sansation, sans-serif' },
  { id: 'afrobeat', name: 'Afrobeat Gold & Bronze', bg: 'linear-gradient(135deg, #1f1406 0%, #2e1d09 100%)', cardBg: 'rgba(45, 30, 10, 0.8)', accent: '#ffb703', secondary: '#fb8500', font: 'Sansation, sans-serif' },
  { id: 'indie_mono', name: 'Indie Minimalist Mono', bg: '#121212', cardBg: 'rgba(30, 30, 30, 0.85)', accent: '#ffffff', secondary: '#a0a0a0', font: 'Sansation, sans-serif' },
  { id: 'dark_synth', name: 'Dark Synthwave Reel', bg: 'linear-gradient(135deg, #080811 0%, #141428 100%)', cardBg: 'rgba(20, 20, 45, 0.8)', accent: '#bd00ff', secondary: '#00e5ff', font: 'Sansation, sans-serif' },
  { id: 'pop_vibrant', name: 'Pop Vibrant Gradient', bg: 'linear-gradient(135deg, #18002e 0%, #3a0057 100%)', cardBg: 'rgba(60, 10, 90, 0.75)', accent: '#ff00aa', secondary: '#00fff0', font: 'Sansation, sans-serif' },
  { id: 'acoustic_wood', name: 'Acoustic Studio Wood', bg: 'linear-gradient(135deg, #1a1410 0%, #291c14 100%)', cardBg: 'rgba(40, 28, 20, 0.85)', accent: '#d4a373', secondary: '#faedcd', font: 'Sansation, sans-serif' },
  { id: 'hiphop_dark', name: 'Hip-Hop Studio Dark', bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)', cardBg: 'rgba(35, 35, 35, 0.9)', accent: '#e63946', secondary: '#f1faee', font: 'Sansation, sans-serif' },
  { id: 'electronic', name: 'Electronic Festival Lights', bg: 'linear-gradient(135deg, #051923 0%, #003554 100%)', cardBg: 'rgba(0, 50, 80, 0.75)', accent: '#00a6fb', secondary: '#0582ca', font: 'Sansation, sans-serif' },
  { id: 'retro_vinyl', name: 'Retro Vinyl Warmth', bg: 'linear-gradient(135deg, #2b1e1a 0%, #3d2720 100%)', cardBg: 'rgba(60, 40, 32, 0.85)', accent: '#e07a5f', secondary: '#f4f1de', font: 'Sansation, sans-serif' },
  { id: 'metal_crimson', name: 'Metal Crimson Steel', bg: 'linear-gradient(135deg, #140505 0%, #260a0a 100%)', cardBg: 'rgba(40, 15, 15, 0.88)', accent: '#ff1e1e', secondary: '#808080', font: 'Sansation, sans-serif' },
  { id: 'ambient_glass', name: 'Ambient Glassmorphic', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', cardBg: 'rgba(30, 41, 59, 0.75)', accent: '#38bdf8', secondary: '#818cf8', font: 'Sansation, sans-serif' },
  { id: 'lofi_chill', name: 'Lo-Fi Chill Sunset', bg: 'linear-gradient(135deg, #2a1b3d 0%, #44318d 100%)', cardBg: 'rgba(68, 49, 141, 0.75)', accent: '#e8a87c', secondary: '#c38d9e', font: 'Sansation, sans-serif' },
  { id: 'classical', name: 'Classical Elegance Gold', bg: 'linear-gradient(135deg, #111115 0%, #22222a 100%)', cardBg: 'rgba(35, 35, 45, 0.85)', accent: '#d4af37', secondary: '#f8f9fa', font: 'Sansation, sans-serif' },
  { id: 'rnb_velvet', name: 'R&B Velvet Midnight', bg: 'linear-gradient(135deg, #190a28 0%, #2c1347 100%)', cardBg: 'rgba(44, 19, 71, 0.8)', accent: '#c084fc', secondary: '#f472b6', font: 'Sansation, sans-serif' },
  { id: 'gospel_light', name: 'Gospel Light Sanctuary', bg: 'linear-gradient(135deg, #172554 0%, #1e3a8a 100%)', cardBg: 'rgba(30, 58, 138, 0.75)', accent: '#60a5fa', secondary: '#fef08a', font: 'Sansation, sans-serif' },
  { id: 'reggae_roots', name: 'Reggae Roots Emerald', bg: 'linear-gradient(135deg, #062c19 0%, #0d472a 100%)', cardBg: 'rgba(13, 71, 42, 0.85)', accent: '#22c55e', secondary: '#eab308', font: 'Sansation, sans-serif' },
  { id: 'punk_disrupt', name: 'Punk Disrupt Neon', bg: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)', cardBg: 'rgba(41, 37, 36, 0.88)', accent: '#ccff00', secondary: '#ff0055', font: 'Sansation, sans-serif' },
  { id: 'jazz_lounge', name: 'Jazz Lounge Smoked', bg: 'linear-gradient(135deg, #1c140e 0%, #2e2017 100%)', cardBg: 'rgba(46, 32, 23, 0.85)', accent: '#fbbf24', secondary: '#d97706', font: 'Sansation, sans-serif' },
  { id: 'experimental', name: 'Experimental Glitch', bg: 'linear-gradient(135deg, #030712 0%, #111827 100%)', cardBg: 'rgba(17, 24, 39, 0.88)', accent: '#a855f7', secondary: '#06b6d4', font: 'Sansation, sans-serif' },
  { id: 'future_bass', name: 'Future Bass Spectrum', bg: 'linear-gradient(135deg, #0f172a 0%, #311b92 100%)', cardBg: 'rgba(49, 27, 146, 0.75)', accent: '#ec4899', secondary: '#3b82f6', font: 'Sansation, sans-serif' },
]

export default function CreatorEpkView() {
  const { username } = useParams()
  const rawArtistName = username ? username.replace(/[-_]/g, ' ') : 'Kip & The Mavens'
  const artistName = rawArtistName.charAt(0).toUpperCase() + rawArtistName.slice(1)
  const artistSlug = (username || 'kip').toLowerCase().replace(/[^a-z0-9]/g, '')

  // Active navigation tab & theme
  const [activeTab, setActiveTab] = useState('home')
  const [mediaFilter, setMediaFilter] = useState('all') // 'all' | 'gallery' | 'videos'
  const [selectedTheme] = useState(EPK_THEMES[0]) // Frontend template info hidden per request
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', duration: '3:45' })

  // Media Dropdown Toggle
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false)

  // Fan Session State
  const [fanUser, setFanUser] = useState(() => {
    try {
      const saved = localStorage.getItem(`fan_session_${artistSlug}`)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authEmail, setAuthEmail] = useState('')
  const [authName, setAuthName] = useState('')
  const [fanInterests, setFanInterests] = useState({
    unreleasedAudio: true,
    presaleCodes: true,
    merchDrops: true,
    meetAndGreet: false
  })

  // Commerce & Cart State
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productSize, setProductSize] = useState('M')
  const [storeCategory, setStoreCategory] = useState('all') // 'all' | 'vinyl' | 'apparel' | 'stems' | 'collectors'
  const [storeSearch, setStoreSearch] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  // Shows Search & Pagination
  const [showsSearch, setShowsSearch] = useState('')
  const [showsPage, setShowsPage] = useState(1)
  const [selectedShow, setSelectedShow] = useState(null)
  const [ticketQty, setTicketQty] = useState(1)
  const [ticketSuccess, setTicketSuccess] = useState(null)

  // Media Search & Pagination
  const [mediaSearch, setMediaSearch] = useState('')
  const [mediaPage, setMediaPage] = useState(1)

  // Data Collections
  const tracks = [
    { id: 1, title: 'Nairobi Cyberwave (Master)', isrc: 'KE-TM1-26-00042', streams: '3.4M', duration: '3:45', release: 'Single 2026' },
    { id: 2, title: 'Sunset over Rift Valley', isrc: 'KE-TM1-26-00043', streams: '1.8M', duration: '4:12', release: 'Album 2026' },
    { id: 3, title: 'Afro-Synth Cascade', isrc: 'KE-TM1-26-00044', streams: '940K', duration: '3:18', release: 'Single 2025' },
    { id: 4, title: 'Midnight Mara Starlight', isrc: 'KE-TM1-26-00045', streams: '2.1M', duration: '5:02', release: 'EP 2025' }
  ]

  const shows = [
    { id: 101, date: 'SEP 18, 2026', venue: 'Nairobi Cyberdome', city: 'Nairobi, Kenya', price: '$25.00', numPrice: 25, status: 'On Sale' },
    { id: 102, date: 'OCT 04, 2026', venue: 'London O2 Academy', city: 'London, UK', price: '$38.00', numPrice: 38, status: 'Selling Fast' },
    { id: 103, date: 'OCT 22, 2026', venue: 'Brooklyn Steel', city: 'New York, US', price: '$35.00', numPrice: 35, status: 'On Sale' },
    { id: 104, date: 'NOV 12, 2026', venue: 'Tokyo Shibuya Club Quattro', city: 'Tokyo, Japan', price: '$45.00', numPrice: 45, status: 'Limited VIP' },
    { id: 105, date: 'DEC 01, 2026', venue: 'Berlin Watergate Club', city: 'Berlin, Germany', price: '€32.00', numPrice: 35, status: 'On Sale' },
    { id: 106, date: 'DEC 15, 2026', venue: 'Paris Le Bataclan', city: 'Paris, France', price: '€30.00', numPrice: 33, status: 'Selling Fast' }
  ]

  const products = [
    { id: 201, title: 'Nairobi Cyberwave Limited 180g Vinyl LP', price: '$34.99', numPrice: 34.99, img: 'https://picsum.photos/seed/vinyl_epk/400', category: 'vinyl', hasSizes: false },
    { id: 202, title: 'Intermaven Tour Heavyweight Hoodie (Black)', price: '$59.99', numPrice: 59.99, img: 'https://picsum.photos/seed/hoodie_epk/400', category: 'apparel', hasSizes: true },
    { id: 203, title: 'Lossless 24-Bit WAV Multitrack Stems Pack', price: '$19.99', numPrice: 19.99, img: 'https://picsum.photos/seed/stems_epk/400', category: 'stems', hasSizes: false },
    { id: 204, title: 'Official World Tour Poster (Signed Edition)', price: '$24.99', numPrice: 24.99, img: 'https://picsum.photos/seed/poster_epk/400', category: 'collectors', hasSizes: false },
    { id: 205, title: 'Cyberwave Embroidered Studio Cap', price: '$29.99', numPrice: 29.99, img: 'https://picsum.photos/seed/cap_epk/400', category: 'apparel', hasSizes: false },
    { id: 206, title: 'Afro-Synth Sample Crate & Presets', price: '$14.99', numPrice: 14.99, img: 'https://picsum.photos/seed/sample_epk/400', category: 'stems', hasSizes: false }
  ]

  const mediaItems = [
    { id: 301, type: 'video', title: `${artistName} — Nairobi Cyberwave (Official 4K Video)`, thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340', views: '1.2M views' },
    { id: 302, type: 'gallery', title: 'Live at Nairobi Cyberdome Stage Highlight', thumbnail: 'https://picsum.photos/seed/gal1/600/340', views: 'Photo Gallery' },
    { id: 303, type: 'video', title: 'Live at SyncMavens Vault (Full Concert 4K)', thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340', views: '840K views' },
    { id: 304, type: 'gallery', title: 'Behind the Scenes: Recording Stems at Intermaven Studio', thumbnail: 'https://picsum.photos/seed/gal2/600/340', views: 'Photo Gallery' },
    { id: 305, type: 'video', title: 'Inside the Synthesizer Soundscapes', thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340', views: '320K views' },
    { id: 306, type: 'gallery', title: 'London O2 Backstage Session', thumbnail: 'https://picsum.photos/seed/gal3/600/340', views: 'Photo Gallery' }
  ]

  // Handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault()
    const user = {
      name: authName || authEmail.split('@')[0],
      email: authEmail,
      interests: fanInterests,
      crmId: `CRM-${Math.floor(100000 + Math.random() * 900000)}`
    }
    setFanUser(user)
    localStorage.setItem(`fan_session_${artistSlug}`, JSON.stringify(user))
    setAuthModalOpen(false)
  }

  const handleLogout = () => {
    setFanUser(null)
    localStorage.removeItem(`fan_session_${artistSlug}`)
  }

  const addToCart = (product) => {
    const item = { ...product, selectedSize: product.hasSizes ? productSize : 'N/A' }
    setCart([...cart, item])
    setCartOpen(true)
    setSelectedProduct(null)
  }

  const handleCheckoutCart = (e) => {
    e.preventDefault()
    setOrderSuccess(true)
    setTimeout(() => {
      setCart([])
      setOrderSuccess(false)
      setCartOpen(false)
    }, 2500)
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

  // Filtered Shows & Media
  const filteredShows = shows.filter(s => 
    s.venue.toLowerCase().includes(showsSearch.toLowerCase()) || 
    s.city.toLowerCase().includes(showsSearch.toLowerCase())
  )
  const showsPerPage = 3
  const paginatedShows = filteredShows.slice((showsPage - 1) * showsPerPage, showsPage * showsPerPage)

  const filteredMedia = mediaItems.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(mediaSearch.toLowerCase())
    if (mediaFilter === 'gallery') return matchesSearch && m.type === 'gallery'
    if (mediaFilter === 'videos') return matchesSearch && m.type === 'video'
    return matchesSearch
  })

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(storeSearch.toLowerCase())
    if (storeCategory === 'all') return matchesSearch
    return matchesSearch && p.category === storeCategory
  })

  return (
    <div style={{
      background: selectedTheme.bg,
      color: '#ffffff',
      fontFamily: "'Sansation', sans-serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>

      {/* ================= 1. TOP NAVBAR HEADER ================= */}
      <header style={{
        background: 'rgba(6, 8, 18, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${selectedTheme.accent}33`,
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
      }}>
        
        {/* Left Creator Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '3px',
            background: selectedTheme.accent,
            color: '#000',
            fontWeight: 900,
            fontSize: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 10px ${selectedTheme.accent}66`
          }}>
            {artistName.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.3px', fontFamily: "'Sansation', sans-serif" }}>
              {artistName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {artistSlug}.tunemavens.com
            </div>
          </div>
        </div>

        {/* Spaced Top Bar Navigation Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          
          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: activeTab === 'home' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'home' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
          >
            <RiHomeFill /> Home
          </button>

          <button
            onClick={() => setActiveTab('bio')}
            style={{
              background: activeTab === 'bio' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'bio' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <RiUserFill /> Bio
          </button>

          <button
            onClick={() => setActiveTab('shows')}
            style={{
              background: activeTab === 'shows' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'shows' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <RiCalendarEventFill /> Shows
          </button>

          {/* Media Menu Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMediaDropdownOpen(!mediaDropdownOpen)}
              style={{
                background: activeTab === 'media' ? selectedTheme.accent : 'transparent',
                color: activeTab === 'media' ? '#000' : '#cbd5e1',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '3px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem'
              }}
            >
              <RiVideoFill /> Media <RiArrowDownSLine />
            </button>

            {mediaDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                background: '#0a0d18',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '3px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                minWidth: '160px',
                zIndex: 1100,
                overflow: 'hidden'
              }}>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('all'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiVideoFill /> All Media
                </div>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('gallery'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiImageFill /> Photo Gallery
                </div>
                <div 
                  onClick={() => { setActiveTab('media'); setMediaFilter('videos'); setMediaDropdownOpen(false); }}
                  style={{ padding: '10px 14px', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RiVideoFill /> 4K Videos
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('store')}
            style={{
              background: activeTab === 'store' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'store' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <RiShoppingBagFill /> Store
          </button>

          <button
            onClick={() => setActiveTab('press')}
            style={{
              background: activeTab === 'press' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'press' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <RiFileTextFill /> Press Kit
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            style={{
              background: activeTab === 'contact' ? selectedTheme.accent : 'transparent',
              color: activeTab === 'contact' ? '#000' : '#cbd5e1',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem'
            }}
          >
            <RiMailFill /> Contact
          </button>
        </nav>

        {/* Right-Hand Platform-Style Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: '3px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiShoppingBasket2Fill /> Cart ({cart.length})
          </button>

          {/* Fan Protocol Login / VIP Account */}
          {fanUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '6px 12px', borderRadius: '3px' }}>
              <RiShieldCheckFill style={{ color: selectedTheme.accent }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{fanUser.name}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', marginLeft: '4px' }}>Log out</button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: selectedTheme.accent,
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RiUserAddFill /> Join Fan Club / VIP Sign In
            </button>
          )}

        </div>
      </header>

      {/* ================= 2. ARTIST HERO BANNER IMAGE ================= */}
      {activeTab === 'home' && (
        <section style={{
          position: 'relative',
          height: '440px',
          backgroundImage: `url(${heroBannerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '48px 32px'
        }}>
          {/* Dark Overlay Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,7,15,0.95) 0%, rgba(5,7,15,0.4) 60%, rgba(5,7,15,0.7) 100%)' }} />
          
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '4.2rem', margin: 0, fontWeight: 900, fontFamily: "'Sansation', sans-serif", letterSpacing: '-1px', color: '#fff', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                {artistName}
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '8px 0 0', lineHeight: 1.5 }}>
                Official Standalone Creator Web World • Lossless Audio & Intermaven Direct Split Network
              </p>
            </div>

            {/* Hero Player Card */}
            <div style={{
              background: selectedTheme.cardBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${selectedTheme.accent}44`,
              borderRadius: '3px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              minWidth: '320px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
            }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ width: '48px', height: '48px', borderRadius: '3px', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{activeTrack.title}</div>
                <div style={{ fontSize: '0.75rem', color: selectedTheme.accent, marginTop: '2px' }}>ISRC: {activeTrack.isrc} • Lossless 24-Bit</div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ================= 3. MAIN BODY CONTENT ================= */}
      <main style={{ flex: 1, padding: '40px 32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {/* ================= TAB 1: HOME ================= */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }}>
            
            {/* Catalog Grid */}
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: selectedTheme.accent, margin: '0 0 18px 0', fontFamily: "'Sansation', sans-serif" }}>
                Discography & Lossless Audio Catalog
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {tracks.map(t => (
                  <div key={t.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.08)', padding: '20px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: selectedTheme.accent, fontWeight: 700 }}>{t.release}</div>
                      <h4 style={{ margin: '6px 0 4px', fontSize: '1.05rem', fontWeight: 800 }}>{t.title}</h4>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ISRC: {t.isrc} • {t.streams} Streams</div>
                    </div>
                    <button 
                      onClick={() => { setActiveTrack(t); setIsPlaying(true); }}
                      style={{ marginTop: '16px', background: activeTrack.id === t.id && isPlaying ? selectedTheme.accent : 'rgba(255,255,255,0.08)', color: activeTrack.id === t.id && isPlaying ? '#000' : '#fff', border: `1px solid ${selectedTheme.accent}44`, padding: '10px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
                    >
                      {activeTrack.id === t.id && isPlaying ? <><RiPauseFill /> Playing...</> : <><RiPlayFill /> Stream Master</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Tour Spotlight */}
            <div style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '28px', borderRadius: '3px' }}>
              <h3 style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: 900, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Featured World Tour Dates</h3>
              {shows.slice(0, 3).map(s => (
                <div key={s.id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.venue}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.city} • {s.date}</div>
                  </div>
                  <button 
                    onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                    style={{ background: selectedTheme.accent, border: 'none', color: '#000', padding: '8px 18px', borderRadius: '3px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Buy Ticket ({s.price})
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 2: BIO ================= */}
        {activeTab === 'bio' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Biography & Heritage Lineage
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0' }}>
              <b>{artistName}</b> is a pioneering force within the modern electronic and global fusion scene. Synthesizing traditional East African acoustic arrangements with cutting-edge cyber-synth soundscapes, {artistName} has captivated international audiences across Nairobi, London, Berlin, and New York.
            </p>
            <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#cbd5e1' }}>
              With over 8 million cumulative streams on <b>TuneStream</b> and verified splits registered on the <b>Intermaven Shared Ledger</b>, {artistName} represents a new generation of independent creators controlling their master recordings, sync placements, and direct fan CRM relationships.
            </p>
          </div>
        )}

        {/* ================= TAB 3: SHOWS (PAGINATED & SEARCHABLE) ================= */}
        {activeTab === 'shows' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                  World Tour Dates
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>QR Entry Passes generated with instant validation</p>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search venue or city..."
                  value={showsSearch}
                  onChange={(e) => { setShowsSearch(e.target.value); setShowsPage(1); }}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Paginated Shows List */}
            {paginatedShows.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>{s.venue}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '2px' }}>{s.city} • {s.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: selectedTheme.accent }}>{s.price}</span>
                  <button 
                    onClick={() => { setSelectedShow(s); setTicketSuccess(null); }}
                    style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 22px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '28px' }}>
              {Array.from({ length: Math.ceil(filteredShows.length / showsPerPage) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setShowsPage(idx + 1)}
                  style={{
                    background: showsPage === idx + 1 ? selectedTheme.accent : 'rgba(255,255,255,0.08)',
                    color: showsPage === idx + 1 ? '#000' : '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '3px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

          </div>
        )}

        {/* ================= TAB 4: MEDIA (PAGINATED & SEARCHABLE GRID) ================= */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                Media Gallery & 4K Videos
              </h2>

              {/* Media Filter & Search */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '240px' }}>
                  <RiSearchLine style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    placeholder="Search media..."
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredMedia.map(m => (
                <div key={m.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '3px' }}>
                  <div style={{ position: 'relative', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={m.thumbnail} alt={m.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '3px' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button 
                        onClick={() => alert(`Opening Media Item: ${m.title}`)}
                        style={{ width: '48px', height: '48px', borderRadius: '3px', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {m.type === 'video' ? '▶' : <RiImageFill />}
                      </button>
                    </div>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800 }}>{m.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{m.views}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: INDUSTRY-STANDARD E-COMMERCE STORE ================= */}
        {activeTab === 'store' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ color: selectedTheme.accent, margin: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
                  Official Creator E-Commerce Store
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>Direct Order Fulfillment & Lossless Audio Multitracks</p>
              </div>

              {/* Store Category Tabs */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
                {['all', 'vinyl', 'apparel', 'stems', 'collectors'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setStoreCategory(cat)}
                    style={{
                      background: storeCategory === cat ? selectedTheme.accent : 'transparent',
                      color: storeCategory === cat ? '#000' : '#cbd5e1',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '3px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textTransform: 'uppercase'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ background: selectedTheme.cardBg, border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '3px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '3px', marginBottom: '14px' }} />
                    <span style={{ fontSize: '0.7rem', color: selectedTheme.accent, textTransform: 'uppercase', fontWeight: 700 }}>{p.category}</span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '1rem', fontWeight: 800 }}>{p.title}</h4>
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: selectedTheme.accent, fontSize: '1.2rem', marginBottom: '14px' }}>{p.price}</div>
                    <button 
                      onClick={() => setSelectedProduct(p)}
                      style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      Configure & Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: PRESS KIT ================= */}
        {activeTab === 'press' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Electronic Press Kit (EPK) Assets
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading Official 1-Sheet PDF...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Official 1-Sheet PDF</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (2.4 MB)</div>
                </div>
              </a>
              <a href="#download" onClick={(e) => { e.preventDefault(); alert('Downloading High-Res Press Photos (ZIP)...'); }} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', fontWeight: 700 }}>
                <RiDownloadFill style={{ fontSize: '1.5rem', color: selectedTheme.accent }} />
                <div>
                  <div>Hi-Res Photos (ZIP)</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Download (48 MB)</div>
                </div>
              </a>
            </div>
          </div>
        )}

        {/* ================= TAB 7: CONTACT ================= */}
        {activeTab === 'contact' && (
          <div style={{ background: selectedTheme.cardBg, padding: '36px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0, fontSize: '2rem', fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Management & Booking Inquiries
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry message dispatched to creator management inbox!'); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Your Name / Agency</label>
                <input type="text" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontSize: '0.95rem' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Email Address</label>
                <input type="email" required style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '3px', fontSize: '0.95rem' }} />
              </div>
              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px 28px', borderRadius: '3px', fontWeight: 900, width: '100%', cursor: 'pointer', fontSize: '1rem' }}>
                Send Inquiry
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ================= 4. 4-COLUMN BRANDED FOOTER WITH POWERED BY INTERMAVEN ONLY AT BOTTOM ================= */}
      <footer style={{
        background: 'rgba(3, 5, 12, 0.96)',
        borderTop: `1px solid ${selectedTheme.accent}33`,
        padding: '48px 32px 24px',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '40px' }}>
          
          {/* Column 1: Brand & Creator Bio */}
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#fff', marginBottom: '10px', fontFamily: "'Sansation', sans-serif" }}>
              {artistName}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              Official Standalone Creator Web World. Lossless Audio Catalog & Direct Intermaven Split Engine.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Site Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('home')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Home</span>
              <span onClick={() => setActiveTab('bio')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Biography</span>
              <span onClick={() => setActiveTab('shows')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Tour Dates</span>
              <span onClick={() => setActiveTab('media')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Media & Gallery</span>
            </div>
          </div>

          {/* Column 3: E-Commerce & Licensing */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Store & Sync</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Limited Vinyl LPs</span>
              <span onClick={() => setActiveTab('store')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Lossless WAV Stems</span>
              <span onClick={() => setActiveTab('contact')} style={{ color: '#cbd5e1', cursor: 'pointer' }}>Sync Licensing Pitching</span>
            </div>
          </div>

          {/* Column 4: Fan Club & Social Connections */}
          <div>
            <h4 style={{ color: selectedTheme.accent, margin: '0 0 14px 0', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800 }}>Connect</h4>
            <div style={{ display: 'flex', gap: '14px', fontSize: '1.4rem', marginBottom: '14px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiInstagramFill /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiYoutubeFill /></a>
              <a href="https://spotify.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiSpotifyFill /></a>
              <a href="https://apple.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiAppleFill /></a>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Direct fanbase synchronization via Smart CRM.
            </div>
          </div>

        </div>

        {/* Powered by Intermaven Badge - ONLY AT VERY BOTTOM */}
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

      {/* Fan Protocol Sign Up Modal Tailored to Fan Interests */}
      {authModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setAuthModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontWeight: 900, fontFamily: "'Sansation', sans-serif" }}>
              Join {artistName}'s VIP Fan Vault
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px' }}>
              Tailored to your music & tour interests. Directly synchronized to Creator Smart CRM.
            </p>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={authName} 
                onChange={(e) => setAuthName(e.target.value)} 
                required 
                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={authEmail} 
                onChange={(e) => setAuthEmail(e.target.value)} 
                required 
                style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }} 
              />

              {/* Fan Interest Options */}
              <div style={{ margin: '8px 0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: selectedTheme.accent }}>Select Your Fan Interests:</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={fanInterests.unreleasedAudio} onChange={(e) => setFanInterests({ ...fanInterests, unreleasedAudio: e.target.checked })} />
                  🎵 Unreleased Audio Demos & Stems
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={fanInterests.presaleCodes} onChange={(e) => setFanInterests({ ...fanInterests, presaleCodes: e.target.checked })} />
                  🎟️ Concert Presale Codes & Tour Alerts
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={fanInterests.merchDrops} onChange={(e) => setFanInterests({ ...fanInterests, merchDrops: e.target.checked })} />
                  👕 Limited Vinyl & Merch Drops
                </label>
              </div>

              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer', marginTop: '6px' }}>
                Join VIP Fan Club
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Product Configure Modal */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Configure Product</h3>
            <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{selectedProduct.title}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: selectedTheme.accent, marginBottom: '16px' }}>{selectedProduct.price}</div>

            {selectedProduct.hasSizes && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: 700 }}>Select Size</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['S', 'M', 'L', 'XL'].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setProductSize(sz)}
                      style={{
                        background: productSize === sz ? selectedTheme.accent : 'rgba(255,255,255,0.05)',
                        color: productSize === sz ? '#000' : '#fff',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '3px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => addToCart(selectedProduct)}
              style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}
            >
              Add to Shopping Cart
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#0a0d18', borderLeft: `1px solid ${selectedTheme.accent}44`, width: '100%', maxWidth: '420px', height: '100%', padding: '28px', color: '#fff', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button onClick={() => setCartOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Your Shopping Cart</h3>
            
            <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.length === 0 ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>Your cart is empty.</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Size: {item.selectedSize}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: selectedTheme.accent }}>{item.price}</div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <form onSubmit={handleCheckoutCart}>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total:</span>
                  <span style={{ color: selectedTheme.accent }}>
                    ${cart.reduce((acc, curr) => acc + curr.numPrice, 0).toFixed(2)} USD
                  </span>
                </div>
                <button type="submit" style={{ width: '100%', background: selectedTheme.accent, color: '#000', border: 'none', padding: '14px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>
                  Process Checkout
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedShow && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d18', border: `1px solid ${selectedTheme.accent}44`, borderRadius: '3px', width: '100%', maxWidth: '440px', padding: '28px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setSelectedShow(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            
            {ticketSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <RiCheckFill style={{ fontSize: '3rem', color: '#00ff80' }} />
                <h3 style={{ margin: '8px 0', color: '#00ff80', fontFamily: "'Sansation', sans-serif" }}>Ticket Order Confirmed!</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '3px', margin: '16px 0', textAlign: 'left', fontSize: '0.85rem' }}>
                  <div><strong>Venue:</strong> {ticketSuccess.show.venue} ({ticketSuccess.show.city})</div>
                  <div><strong>Date:</strong> {ticketSuccess.show.date}</div>
                  <div><strong>Pass Code:</strong> <span style={{ color: selectedTheme.accent, fontFamily: 'monospace' }}>{ticketSuccess.qr}</span></div>
                  <div><strong>Total Paid:</strong> ${ticketSuccess.total} USD</div>
                </div>
                <button onClick={() => setSelectedShow(null)} style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <div>
                <h3 style={{ marginTop: 0, color: selectedTheme.accent, fontFamily: "'Sansation', sans-serif" }}>Buy Tour Tickets</h3>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px' }}>
                  <strong>{selectedShow.venue}</strong> • {selectedShow.city} ({selectedShow.date})
                </div>
                <form onSubmit={handleTicketBuy} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <select value={ticketQty} onChange={(e) => setTicketQty(Number(e.target.value))} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '3px' }}>
                    <option value={1}>1 Ticket (${(selectedShow.numPrice * 1).toFixed(2)})</option>
                    <option value={2}>2 Tickets (${(selectedShow.numPrice * 2).toFixed(2)})</option>
                    <option value={4}>4 VIP Bundle (${(selectedShow.numPrice * 4).toFixed(2)})</option>
                  </select>
                  <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '3px', fontWeight: 800, cursor: 'pointer' }}>
                    Pay ${(selectedShow.numPrice * ticketQty).toFixed(2)}
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
