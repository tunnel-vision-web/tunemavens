import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  RiHomeFill, RiUserFill, RiCalendarEventFill, RiVideoFill,
  RiShoppingBagFill, RiFileTextFill, RiMailFill, RiHeartFill,
  RiFlashlightFill, RiPlayFill, RiPauseFill, RiDownloadFill,
  RiTicket2Fill, RiExternalLinkFill, RiInstagramFill, RiYoutubeFill,
  RiSpotifyFill, RiAppleFill, RiTwitterXFill, RiDiscordFill, RiCheckFill
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
  const artistName = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Kip & The Mavens'

  const [activeTab, setActiveTab] = useState('home')
  const [selectedTheme, setSelectedTheme] = useState(EPK_THEMES[0])
  const [layoutMode, setLayoutMode] = useState('parallax') // 'parallax' | 'split' | 'floating' | 'mono' | 'cyber'
  const [isPlaying, setIsPlaying] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)

  // Fan Club CRM Form State
  const [fanEmail, setFanEmail] = useState('')
  const [fanName, setFanName] = useState('')
  const [fanJoined, setFanJoined] = useState(false)

  // Demo Shows Data
  const shows = [
    { date: 'SEP 18, 2026', venue: 'Nairobi Cyberdome', city: 'Nairobi, Kenya', price: '$25.00', status: 'On Sale' },
    { date: 'OCT 04, 2026', venue: 'London O2 Academy', city: 'London, UK', price: '£30.00', status: 'Selling Fast' },
    { date: 'OCT 22, 2026', venue: 'Brooklyn Steel', city: 'New York, US', price: '$35.00', status: 'On Sale' },
  ]

  // Demo Merch Data
  const products = [
    { title: 'Nairobi Cyberwave Vinyl LP (Limited Edition)', price: '$34.99', img: 'https://picsum.photos/seed/vinyl_epk/300' },
    { title: 'TuneMavens Heavyweight Tour Hoodie', price: '$59.99', img: 'https://picsum.photos/seed/hoodie_epk/300' },
    { title: 'Lossless Stems & Studio Multitracks (WAV)', price: '$19.99', img: 'https://picsum.photos/seed/stems_epk/300' },
  ]

  const handleFanJoin = (e) => {
    e.preventDefault()
    if (fanEmail) {
      setFanJoined(true)
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
      transition: 'all 0.4s ease'
    }}>
      
      {/* Top Network Sub-Navigation Header */}
      <header style={{
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>INTERMAVEN WEB WORLD 🌐</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: selectedTheme.accent }}>{artistName}</span>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            {selectedTheme.genre}
          </span>
        </div>

        {/* Studio Control Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={selectedTheme.id}
            onChange={(e) => setSelectedTheme(EPK_THEMES.find(t => t.id === e.target.value))}
            style={{ background: '#1e1e24', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
          >
            {EPK_THEMES.map(t => <option key={t.id} value={t.id}>Theme: {t.name}</option>)}
          </select>

          <button
            onClick={() => setAiModalOpen(true)}
            style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RiFlashlightFill /> AI Studio Assistant
          </button>

        </div>
      </header>

      {/* Main EPK World Hero Header */}
      <section style={{
        padding: '80px 24px 40px',
        textAlign: 'center',
        background: `radial-gradient(circle at center, ${selectedTheme.secondary}22 0%, transparent 70%)`
      }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0, letterSpacing: '-1px' }}>{artistName}</h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '12px auto' }}>
          Official Standalone Artist Web World & Intermaven EPK
        </p>

        {/* Audio Player Bar */}
        <div style={{
          maxHeight: '400px',
          maxWidth: '500px',
          margin: '24px auto',
          background: selectedTheme.cardBg,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${selectedTheme.accent}44`,
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: `0 8px 32px ${selectedTheme.accent}22`
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ width: '48px', height: '48px', borderRadius: '50%', background: selectedTheme.accent, border: 'none', color: '#000', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isPlaying ? <RiPauseFill /> : <RiPlayFill />}
          </button>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Nairobi Cyberwave (Official Master)</div>
            <div style={{ fontSize: '0.8rem', color: selectedTheme.accent }}>TuneStream Lossless Audio • 24-bit 96kHz</div>
          </div>
        </div>
      </section>

      {/* 8 Customizable Navigation Menu Tabs */}
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '16px 24px',
        background: 'rgba(0,0,0,0.4)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
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
              color: activeTab === tab.id ? '#000' : '#fff',
              border: `1px solid ${activeTab === tab.id ? selectedTheme.accent : 'rgba(255,255,255,0.15)'}`,
              padding: '8px 18px',
              borderRadius: '24px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Tab View Contents */}
      <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ background: selectedTheme.cardBg, padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginTop: 0, color: selectedTheme.accent }}>Featured Release</h3>
              <img src="https://picsum.photos/seed/epk_release/500/300" alt="Release Cover" style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
              <p>Stream the brand new album on <b>TuneStream</b> or acquire licensing rights via <b>SyncMavens</b>.</p>
            </div>

            <div style={{ background: selectedTheme.cardBg, padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 style={{ marginTop: 0, color: selectedTheme.accent }}>Upcoming Tour Highlights</h3>
              {shows.slice(0, 2).map((s, idx) => (
                <div key={idx} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.venue}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{s.city} • {s.date}</div>
                  </div>
                  <button style={{ background: selectedTheme.accent, border: 'none', color: '#000', padding: '4px 12px', borderRadius: '6px', fontWeight: 600 }}>Get Tickets</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BIO */}
        {activeTab === 'bio' && (
          <div style={{ background: selectedTheme.cardBg, padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0 }}>Artist Biography & Lineage</h2>
            <p style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
              <b>{artistName}</b> is a pioneering force within the modern electronic and global fusion scene. Synthesizing traditional acoustic arrangements with cutting-edge cyber-synth soundscapes, {artistName} has captivated audiences across East Africa, Europe, and North America.
            </p>
            <blockquote style={{ borderLeft: `4px solid ${selectedTheme.accent}`, paddingLeft: '16px', margin: '24px 0', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>
              "A breathtaking fusion of heritage soundscapes and forward-thinking electronic production." — <i>Intermaven Music Journal</i>
            </blockquote>
          </div>
        )}

        {/* TAB 3: SHOWS */}
        {activeTab === 'shows' && (
          <div style={{ background: selectedTheme.cardBg, padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0 }}>Tour Dates & Live Experiences</h2>
            {shows.map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{s.venue}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)' }}>{s.city} | {s.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontWeight: 600 }}>{s.price}</span>
                  <button style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Buy Ticket</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: VIDEOS */}
        {activeTab === 'videos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: selectedTheme.cardBg, padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="https://picsum.photos/seed/yt_vid1/450/250" alt="Video 1" style={{ width: '100%', borderRadius: '12px' }} />
              <h4>Nairobi Cyberwave (Official 4K Music Video)</h4>
            </div>
            <div style={{ background: selectedTheme.cardBg, padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src="https://picsum.photos/seed/yt_vid2/450/250" alt="Video 2" style={{ width: '100%', borderRadius: '12px' }} />
              <h4>Live Studio Session at SyncMavens Vault</h4>
            </div>
          </div>
        )}

        {/* TAB 5: STORE */}
        {activeTab === 'store' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {products.map((p, idx) => (
              <div key={idx} style={{ background: selectedTheme.cardBg, padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '12px' }} />
                <h4 style={{ margin: '8px 0' }}>{p.title}</h4>
                <div style={{ fontWeight: 700, color: selectedTheme.accent, marginBottom: '12px' }}>{p.price}</div>
                <button style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Order Now</button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: PRESS KIT */}
        {activeTab === 'press' && (
          <div style={{ background: selectedTheme.cardBg, padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0 }}>Press Assets & Technical Rider</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '24px' }}>
              <a href="#download" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiDownloadFill style={{ color: selectedTheme.accent }} /> Official One-Sheet PDF
              </a>
              <a href="#download" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiDownloadFill style={{ color: selectedTheme.accent }} /> High-Res Press Photos (ZIP)
              </a>
              <a href="#download" style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RiDownloadFill style={{ color: selectedTheme.accent }} /> Stage Plot & Tech Rider
              </a>
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT */}
        {activeTab === 'contact' && (
          <div style={{ background: selectedTheme.cardBg, padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ color: selectedTheme.accent, marginTop: 0 }}>Management & Sync Contact</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message dispatched to creator management!'); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Your Name</label>
                <input type="text" required style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input type="email" required style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px' }}>Inquiry Type</label>
                <select style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}>
                  <option>Sync Licensing (Film / TV / Game)</option>
                  <option>Booking & Live Shows</option>
                  <option>Press & Interviews</option>
                </select>
              </div>
              <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, width: '100%', cursor: 'pointer' }}>Send Inquiry</button>
            </form>
          </div>
        )}

        {/* TAB 8: FAN CLUB (SMART CRM SYNCHRONIZATION) */}
        {activeTab === 'fanclub' && (
          <div style={{ background: selectedTheme.cardBg, padding: '32px', borderRadius: '16px', border: `1px solid ${selectedTheme.accent}66`, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <RiHeartFill style={{ fontSize: '3rem', color: selectedTheme.accent }} />
            <h2 style={{ marginTop: '12px' }}>Join {artistName}'s Official Fan Club</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Get direct email updates, unreleased audio snippets, and presale tour ticket codes. Powered by <b>Intermaven Smart CRM</b>.
            </p>

            {fanJoined ? (
              <div style={{ padding: '20px', background: 'rgba(0, 255, 128, 0.15)', borderRadius: '12px', border: '1px solid #00ff80', color: '#00ff80' }}>
                <RiCheckFill style={{ fontSize: '1.5rem' }} /> You are officially subscribed to {artistName}'s Smart CRM Fanbase!
              </div>
            ) : (
              <form onSubmit={handleFanJoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={fanName}
                  onChange={(e) => setFanName(e.target.value)}
                  required
                  style={{ padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                />
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={fanEmail}
                  onChange={(e) => setFanEmail(e.target.value)}
                  required
                  style={{ padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                />
                <button type="submit" style={{ background: selectedTheme.accent, color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Join Fan Club</button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* Sleek Social Media Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.8)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '32px 24px',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '1.5rem', marginBottom: '16px' }}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiInstagramFill /></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiYoutubeFill /></a>
          <a href="https://spotify.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiSpotifyFill /></a>
          <a href="https://apple.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiAppleFill /></a>
          <a href="https://x.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiTwitterXFill /></a>
          <a href="https://discord.com" target="_blank" rel="noreferrer" style={{ color: selectedTheme.accent }}><RiDiscordFill /></a>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          © 2026 {artistName} • Powered by Intermaven Network Inc. (`intermaven.io`)
        </div>
      </footer>
    </div>
  )
}
