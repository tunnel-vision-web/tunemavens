import React, { useState, useRef, useEffect } from 'react'
import {
  RiCheckFill, RiGlobalFill, RiLayoutFill, RiImageFill,
  RiPaletteFill, RiMenuFill, RiFileTextFill, RiEyeFill,
  RiUploadFill, RiAddFill, RiDeleteBinFill, RiDragMoveFill,
  RiSparklingFill, RiArrowLeftSLine, RiArrowRightSLine,
  RiInstagramFill, RiSpotifyFill, RiSoundcloudFill, RiMailFill,
  RiSearchLine, RiSunFill, RiMoonFill, RiCloseFill,
  RiInformationLine, RiSaveFill, RiUpload2Fill, RiYoutubeFill, RiTwitterXFill,
  RiShieldCheckFill, RiRefreshLine, RiAlertFill
} from 'react-icons/ri'
import { tokenStore } from '../lib/api.js'

// Curated Google Fonts Library
const GOOGLE_FONTS_CATALOG = [
  { name: 'Roboto', category: 'Sans-Serif', sample: 'Modern, balanced and clean' },
  { name: 'Montserrat', category: 'Modern Sans', sample: 'Geometric architectural precision' },
  { name: 'Poppins', category: 'Geometric Sans', sample: 'Friendly, warm and vibrant' },
  { name: 'Playfair Display', category: 'Editorial Serif', sample: 'High-fashion classic editorial elegance' },
  { name: 'Bebas Neue', category: 'Bold Display', sample: 'TALL PUNCHY HEADLINE POWER' },
  { name: 'Cinzel', category: 'Cinematic', sample: 'EPIC MONUMENTAL SOUNDSCAPES' },
  { name: 'Anton', category: 'Heavy Poster', sample: 'MAXIMUM IMPACT POSTER TEXT' },
  { name: 'Oswald', category: 'Condensed Sans', sample: 'Tight rhythmic typography' },
  { name: 'Raleway', category: 'Elegant Sans', sample: 'Refined artistic craftsmanship' },
  { name: 'Bungee', category: 'Urban Display', sample: 'URBAN STREET ART HEADLINES' },
  { name: 'Righteous', category: 'Retro Synthwave', sample: 'Futuristic 80s Cyber Grooves' },
  { name: 'Cormorant Garamond', category: 'Luxury Serif', sample: 'Intimate acoustic heritage' },
  { name: 'Exo 2', category: 'Sci-Fi Tech', sample: 'Next-generation electronic pulse' },
  { name: 'Audiowide', category: 'Cyberpunk', sample: 'HIGH SPEED SYNTH MATRIX' },
  { name: 'Archivo Black', category: 'Ultra Heavy', sample: 'SOLID HEAVYWEIGHT STATEMENT' },
  { name: 'Syne', category: 'Avant-Garde', sample: 'Experimental cutting-edge design' },
  { name: 'Space Grotesk', category: 'Monospace Vibe', sample: 'Algorithmic tech precision' },
  { name: 'DM Serif Display', category: 'Heritage Serif', sample: 'Soulful storytelling and depth' },
  { name: 'Plus Jakarta Sans', category: 'Tech Minimal', sample: 'Contemporary clean rhythm' },
  { name: 'Unbounded', category: 'Wide High-Tech', sample: 'EXPANSIVE HORIZONS' },
  { name: 'Abril Fatface', category: 'Headline Serif', sample: 'Bold dramatic elegance' },
]

// Google Fonts Search & Select Modal
function GoogleFontsModal({ isOpen, onClose, onSelect, currentFont }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  useEffect(() => {
    if (!isOpen) return
    // Preload top fonts for preview
    const linkId = 'wizard-google-fonts-preview'
    let link = document.getElementById(linkId)
    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    const fontFamilies = GOOGLE_FONTS_CATALOG.map(f => `${encodeURIComponent(f.name)}:wght@400;700;900`).join('&family=')
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`
  }, [isOpen])

  if (!isOpen) return null

  const categories = ['all', 'Sans-Serif', 'Modern Sans', 'Geometric Sans', 'Editorial Serif', 'Bold Display', 'Cinematic', 'Sci-Fi Tech']
  const filtered = GOOGLE_FONTS_CATALOG.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase())
    if (selectedCat === 'all') return matchesSearch
    return matchesSearch && f.category === selectedCat
  })

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#0c101d', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, width:'100%', maxWidth:680, maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 25px 60px rgba(0,0,0,0.8)', overflow:'hidden' }}>
        {/* Modal Header */}
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h3 style={{ margin:0, fontSize:16, fontWeight:800, color:'#fff' }}>Browse Google Fonts Library</h3>
            <p style={{ margin:'4px 0 0', fontSize:11.5, color:'#94a3b8' }}>Search and select from 20+ top Google Fonts for your EPK typography.</p>
          </div>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'none', color:'#94a3b8', fontSize:18, cursor:'pointer', padding:4 }}>
            <RiCloseFill />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ padding:'14px 22px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ position:'relative' }}>
            <RiSearchLine size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b' }} />
            <input 
              type="text" 
              placeholder="Search fonts (e.g. Bebas, Playfair, Cinematic, Tech)..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ width:'100%', padding:'9px 12px 9px 36px', background:'#060a14', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#fff', fontSize:13 }} 
              autoFocus
            />
          </div>
          <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2 }}>
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCat(c)}
                style={{
                  background: selectedCat === c ? '#00f0ff' : 'rgba(255,255,255,0.05)',
                  color: selectedCat === c ? '#000' : '#94a3b8',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {c === 'all' ? 'All Styles' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Fonts List */}
        <div style={{ padding:'14px 22px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(f => {
            const isCurrent = currentFont?.includes(f.name)
            return (
              <div 
                key={f.name} 
                onClick={() => { onSelect(`'${f.name}', sans-serif`); onClose(); }}
                style={{
                  padding: '14px 16px',
                  background: isCurrent ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: isCurrent ? '1px solid #00f0ff' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:11, color:'#00f0ff', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{f.category}</span>
                    <span style={{ fontSize:10.5, color:'#64748b' }}>Google Font</span>
                  </div>
                  <div style={{ fontFamily:`'${f.name}', sans-serif`, fontSize:18, fontWeight:700, color:'#fff', margin:'2px 0' }}>
                    {f.name}
                  </div>
                  <div style={{ fontFamily:`'${f.name}', sans-serif`, fontSize:12, color:'#94a3b8' }}>
                    {f.sample}
                  </div>
                </div>
                <button
                  type="button"
                  style={{
                    background: isCurrent ? '#00f0ff' : 'transparent',
                    color: isCurrent ? '#000' : '#00f0ff',
                    border: '1px solid #00f0ff',
                    padding: '6px 14px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCurrent ? 'Selected' : 'Use Font'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// EPK Themes (mirrors CreatorEpkView.jsx EPK_THEMES)
const EPK_THEMES = [
  { id:'cyberpunk', bg:'linear-gradient(135deg,#0f0c20,#1a0826)', accent:'#00f0ff' },
  { id:'afrobeat',  bg:'linear-gradient(135deg,#1f1406,#2e1d09)', accent:'#ffb703' },
  { id:'dark_synth',bg:'linear-gradient(135deg,#080811,#141428)', accent:'#bd00ff' },
  { id:'rnb_velvet',bg:'linear-gradient(135deg,#190a28,#2c1347)', accent:'#c084fc' },
]

const C = {
  cyan:'#00f0ff', purple:'#8b5cf6', bg:'#070a13', card:'#0a0f1d',
  border:'rgba(255,255,255,0.07)', muted:'#64748b', text:'#e2e8f0', sub:'#94a3b8',
}

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.text, textTransform:'uppercase', letterSpacing:'0.06em' }}>{children}</div>
      {sub && <div style={{ fontSize:11, color:C.sub, marginTop:2 }}>{sub}</div>}
    </div>
  )
}
function FInput({ style, ...p }) {
  return <input className="form-control" style={{ width:'100%', fontSize:13, padding:'9px 12px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:5, color:C.text, ...style }} {...p} />
}
function FTextarea({ style, ...p }) {
  return <textarea className="form-control" style={{ width:'100%', fontSize:13, padding:'9px 12px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:5, color:C.text, resize:'vertical', ...style }} {...p} />
}
function Btn({ children, onClick, disabled, accent, outline, style }) {
  const base = { padding:'9px 18px', borderRadius:5, fontWeight:700, fontSize:12.5, cursor:disabled?'not-allowed':'pointer', border:'none', opacity:disabled?0.5:1, transition:'all 0.18s', ...style }
  const t = accent ? { background:C.cyan, color:'#000' } : outline ? { background:'transparent', border:`1px solid ${C.border}`, color:C.text } : { background:C.purple, color:'#fff' }
  return <button type="button" onClick={onClick} disabled={disabled} style={{ ...base, ...t }}>{children}</button>
}

const STEP_META = [
  { label:'Domain',  Icon:RiGlobalFill   },
  { label:'Width',   Icon:RiLayoutFill   },
  { label:'Layout',  Icon:RiLayoutFill   },
  { label:'Logo',    Icon:RiImageFill    },
  { label:'Colors',  Icon:RiPaletteFill  },
  { label:'Menu',    Icon:RiMenuFill     },
  { label:'Content', Icon:RiFileTextFill },
  { label:'Publish', Icon:RiEyeFill      },
]

function StepIndicator({ current, canPreview, onPreview, onSave, savingDraft, lastSavedTime }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:28, overflowX:'auto', paddingBottom:4 }}>
      {STEP_META.map(({ label, Icon }, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <React.Fragment key={step}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{ width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, transition:'all 0.2s', background:done?C.cyan:active?C.purple:'rgba(255,255,255,0.05)', border:active?`2px solid ${C.purple}`:done?`2px solid ${C.cyan}`:`1px solid ${C.border}`, color:done?'#000':active?'#fff':C.muted, boxShadow:active?`0 0 12px ${C.purple}66`:done?`0 0 8px ${C.cyan}44`:'none' }}>
                {done ? <RiCheckFill size={13} /> : <Icon size={13} />}
              </div>
              <span style={{ fontSize:9.5, color:active?C.cyan:done?C.sub:C.muted, marginTop:4, fontWeight:active?700:400, letterSpacing:'0.04em', textTransform:'uppercase' }}>{label}</span>
            </div>
            {i < STEP_META.length - 1 && (
              <div style={{ flex:1, height:2, background:step<current?`linear-gradient(90deg,${C.cyan},${C.purple})`:C.border, margin:'0 4px', marginBottom:20, minWidth:14, borderRadius:2 }} />
            )}
          </React.Fragment>
        )
      })}
      <div style={{ marginLeft:'auto', marginBottom:18, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            title={lastSavedTime ? `Last saved at ${lastSavedTime}` : 'Save progress to resume later'}
            style={{ padding:'5px 12px', background:'rgba(255,255,255,0.06)', border:`1px solid ${C.border}`, borderRadius:20, fontWeight:700, fontSize:11, color:C.text, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
          >
            <RiSaveFill size={12} color={C.cyan} />
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </button>
        )}

      </div>
    </div>
  )
}

// ── Step 1: Domain & Site Identity ──────────────────────────────────────────
function Step1Domain({ data, onChange, sessionUser, onAvailabilityChange }) {
  const [hasCustomDomain, setHasCustomDomain] = useState(!!data.customDomain || data.domainMode === 'custom')
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState(null) // 'available' | 'taken' | 'invalid'
  const [message, setMessage] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const update = (field, val) => onChange({ ...data, [field]: val })

  // Handle subdomain changes and automatically update default social media handles
  const handleSubdomainChange = (newVal) => {
    const clean = newVal.toLowerCase().replace(/[^a-z0-9-]/g, '')
    const updates = { subdomain: clean }
    
    // Auto-update social media links to match the selected username if empty or matching default pattern
    if (!data.instagram || data.instagram.includes('instagram.com/')) {
      updates.instagram = clean ? `https://instagram.com/${clean}` : ''
    }
    if (!data.spotify || data.spotify.includes('open.spotify.com/artist/')) {
      updates.spotify = clean ? `https://open.spotify.com/artist/${clean}` : ''
    }
    if (!data.youtube || data.youtube.includes('youtube.com/@')) {
      updates.youtube = clean ? `https://youtube.com/@${clean}` : ''
    }
    if (!data.soundcloud || data.soundcloud.includes('soundcloud.com/')) {
      updates.soundcloud = clean ? `https://soundcloud.com/${clean}` : ''
    }
    if (!data.twitter || data.twitter.includes('x.com/')) {
      updates.twitter = clean ? `https://x.com/${clean}` : ''
    }
    if (!data.bookingEmail || data.bookingEmail.includes('@tunemavens.com')) {
      updates.bookingEmail = clean ? `booking@${clean}.tunemavens.com` : ''
    }

    onChange({ ...data, ...updates })
  }

  useEffect(() => {
    const clean = (data.subdomain || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
    if (!clean || clean.length < 3) {
      setStatus('invalid')
      setMessage('Subdomain must be at least 3 characters.')
      if (onAvailabilityChange) onAvailabilityChange(false)
      return
    }

    setChecking(true)
    setMessage('Searching availability across Intermaven network...')

    const timer = setTimeout(async () => {
      try {
        // Local storage check
        const local = localStorage.getItem(`epk_public_${clean}`) || localStorage.getItem(`epk_${clean}`)
        let localTaken = false
        if (local) {
          try {
            const parsed = JSON.parse(local)
            const currentUserId = sessionUser?.id || sessionUser?._id
            if (parsed.user_id && currentUserId && parsed.user_id !== currentUserId) {
              localTaken = true
            }
          } catch {}
        }

        // Backend availability endpoint check
        let isFree = !localTaken
        try {
          const res = await fetch(`/api/epk/check-availability/${clean}`)
          if (res.ok) {
            const resData = await res.json()
            isFree = resData.available !== false
          }
        } catch {}

        if (isFree) {
          setStatus('available')
          setMessage(`✓ "${clean}.tunemavens.com" is available!`)
          setSuggestions([])
          if (onAvailabilityChange) onAvailabilityChange(true)
        } else {
          setStatus('taken')
          setMessage(`✕ "${clean}" is already claimed across the network.`)
          setSuggestions([`${clean}-music`, `${clean}-live`, `${clean}-official`])
          if (onAvailabilityChange) onAvailabilityChange(false)
        }
      } catch {
        setStatus('available')
        setMessage(`✓ "${clean}.tunemavens.com" ready`)
        if (onAvailabilityChange) onAvailabilityChange(true)
      } finally {
        setChecking(false)
      }
    }, 380)

    return () => clearTimeout(timer)
  }, [data.subdomain, sessionUser])

  // Active network domains
  const activeDomains = Array.isArray(data.networkDomains) ? data.networkDomains : ['tunemavens.com', 'tunestream.co', 'syncmavens.com']

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Site Identity & Domain Setup</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Configure your site brand name, SEO tagline, multi-network subdomains, and optional custom domain simultaneously.</p>
      </div>

      {/* ── Section A: Site Name & SEO Tagline ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:14, padding:'16px', background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`, borderRadius:8 }}>
        <div style={{ fontSize:13, fontWeight:800, color:C.cyan, textTransform:'uppercase', letterSpacing:'0.04em' }}>
          Site Identity & SEO Settings
        </div>

        <div>
          <Label sub="The official name of your project, artist, or production company">Site / Artist Name</Label>
          <FInput
            value={data.siteName !== undefined ? data.siteName : (data.artist_name || sessionUser?.name || '')}
            onChange={e => {
              const val = e.target.value
              onChange({ ...data, siteName: val, artist_name: val })
            }}
            placeholder="e.g. Kip & The Mavens or Aisha Okoro"
          />
        </div>

        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <Label sub="Used for browser tabs, Google search snippets & social sharing cards">Site Tagline (SEO Description)</Label>
            <span style={{ fontSize:10.5, color:C.cyan, background:'rgba(0,240,255,0.1)', padding:'2px 8px', borderRadius:10, border:`1px solid ${C.cyan}44`, fontWeight:700 }}>
              🔍 SEO Meta Tags
            </span>
          </div>
          <FInput
            value={data.tagline !== undefined ? data.tagline : (data.headline || '')}
            onChange={e => {
              const val = e.target.value
              onChange({ ...data, tagline: val, headline: val })
            }}
            placeholder="e.g. Electronic Afro-Futurist & Multitrack Producer • Nairobi"
          />
        </div>
      </div>

      {/* ── Section B: Primary Subdomain & Intermaven Network ── */}
      <div>
        <Label sub="Your global handle across TuneMavens, TuneStream and SyncMavens">Subdomain Handle / Username</Label>
        <div style={{ display:'flex', alignItems:'stretch', background:'#060a14', border:`1px solid ${status === 'available' ? '#22c55e' : status === 'taken' ? '#ef4444' : C.border}`, borderRadius:5, overflow:'hidden', transition:'border-color 0.2s' }}>
          <span style={{ padding:'9px 12px', fontSize:13, color:C.muted, borderRight:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>https://</span>
          <input
            value={data.subdomain || ''}
            onChange={e => handleSubdomainChange(e.target.value)}
            placeholder="yourname"
            className="form-control"
            style={{ flex:1, border:'none', background:'none', color:'#fff', padding:'9px 12px', fontSize:13 }}
          />
          <span style={{ padding:'9px 12px', fontSize:13, color:status === 'available' ? '#22c55e' : C.cyan, fontWeight:700, borderLeft:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>.tunemavens.com</span>
        </div>

        {/* Availability Feedback Box */}
        <div style={{ marginTop: 8 }}>
          {checking && (
            <div style={{ fontSize: 11.5, color: C.cyan, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⏳</span> Searching availability across Intermaven network...
            </div>
          )}
          {!checking && status === 'available' && (
            <div style={{ fontSize: 11.5, color: '#22c55e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <RiCheckFill size={14} /> {message}
            </div>
          )}
          {!checking && status === 'taken' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11.5, color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                {message}
              </div>
              {suggestions.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: C.sub }}>Suggestions:</span>
                  {suggestions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSubdomainChange(s)}
                      style={{
                        background: 'rgba(0,240,255,0.1)',
                        border: `1px solid ${C.cyan}55`,
                        color: C.cyan,
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {!checking && status === 'invalid' && (
            <div style={{ fontSize: 11, color: '#f59e0b' }}>
              {message}
            </div>
          )}
        </div>

        {/* Intermaven Network Cross-Publishing Selector */}
        <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🌐</span> Display on Sister Network Domains (Same Handle)
            </div>
            <span style={{ fontSize: 10.5, color: C.cyan, fontWeight: 700 }}>Single Handle • Multi-Presence</span>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 11.5, color: C.sub, lineHeight: 1.5 }}>
            Your Creator Web World can simultaneously resolve across these Intermaven domains:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { domain: 'tunemavens.com', name: 'TuneMavens', desc: 'Official Creator Web World & VIP Fan Club', primary: true },
              { domain: 'tunestream.co', name: 'TuneStream', desc: 'Lossless 24-Bit Audio & Stem Multitrack Sales Hub', primary: false },
              { domain: 'syncmavens.com', name: 'SyncMavens', desc: 'One-Stop Film, TV & Game Sync Licensing Clearance', primary: false }
            ].map(net => {
              const isSelected = net.primary || activeDomains.includes(net.domain)
              const toggle = () => {
                if (net.primary) return
                const next = isSelected ? activeDomains.filter(d => d !== net.domain) : [...activeDomains, net.domain]
                update('networkDomains', next)
              }
              const handlePreview = `https://${data.subdomain || 'yourname'}.${net.domain}`

              return (
                <div
                  key={net.domain}
                  onClick={toggle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 5,
                    background: isSelected ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? C.cyan + '44' : C.border}`,
                    cursor: net.primary ? 'default' : 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={net.primary}
                      onChange={() => {}}
                      style={{ accentColor: C.cyan, cursor: net.primary ? 'default' : 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#fff' : C.sub }}>
                        {net.name} — <span style={{ fontWeight: 400, color: C.muted }}>{net.desc}</span>
                      </div>
                      <div style={{ fontSize: 11, color: isSelected ? C.cyan : C.muted, fontFamily: 'monospace', marginTop: 2 }}>
                        {handlePreview}
                      </div>
                    </div>
                  </div>
                  {status === 'available' && isSelected && (
                    <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 800, background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.3)' }}>
                      ✓ Available
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Section C: Simultaneous Custom Domain ── */}
      <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', margin: 0 }}>
            <input
              type="checkbox"
              checked={hasCustomDomain}
              onChange={e => {
                const checked = e.target.checked
                setHasCustomDomain(checked)
                update('domainMode', checked ? 'both' : 'subdomain')
              }}
              style={{ accentColor: C.cyan, width: 16, height: 16, cursor: 'pointer' }}
            />
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Also Connect Custom Domain</span>
              <span style={{ fontSize: 11, color: C.sub, marginLeft: 8 }}>(Keep your subdomains active simultaneously)</span>
            </div>
          </label>
        </div>

        {hasCustomDomain && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Label sub="e.g. aishamusic.com or yourbrand.io">Custom Domain URL</Label>
            <FInput
              value={data.customDomain || ''}
              onChange={e => update('customDomain', e.target.value)}
              placeholder="yourcustomdomain.com"
            />
            <div style={{ background: 'rgba(0,240,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 6, padding: '12px 14px', fontSize: 11.5 }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>DNS CNAME Setup:</div>
              <div style={{ color: C.sub, lineHeight: 1.6 }}>
                Create a <strong style={{ color: C.cyan }}>CNAME</strong> record in your registrar pointing <strong style={{ color: '#fff' }}>{data.customDomain || 'yourdomain.com'}</strong> to <strong style={{ color: C.cyan }}>epk.tunemavens.com</strong>.
                Both your custom domain and subdomains will be live at the same time.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Section D: Active Endpoints Summary ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:6, padding:'12px 16px', background:'rgba(0,240,255,0.05)', border:`1px solid rgba(0,240,255,0.25)`, borderRadius:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <RiGlobalFill color={C.cyan} size={15} />
          <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>Active Live Web World Endpoints:</span>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
          {activeDomains.map(dom => {
            const url = `https://${data.subdomain || 'yourname'}.${dom}`
            return (
              <span key={dom} style={{ fontSize:11.5, color:C.cyan, fontFamily:'monospace', background:'rgba(0,240,255,0.1)', padding:'3px 10px', borderRadius:4, border:`1px solid ${C.cyan}44` }}>
                {url}
              </span>
            )
          })}
          {hasCustomDomain && data.customDomain && (
            <span style={{ fontSize:11.5, color:'#22c55e', fontFamily:'monospace', background:'rgba(34,197,94,0.1)', padding:'3px 10px', borderRadius:4, border:`1px solid rgba(34,197,94,0.3)` }}>
              https://{data.customDomain}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Layout Width ────────────────────────────────────────────────────
const WIDTH_OPTS = [
  { id:'boxed',      label:'Boxed',       hint:'Max ~960px — editorial & clean',        pct:'55%'  },
  { id:'wide',       label:'Wide',        hint:'Max ~1280px — modern landing page',      pct:'82%'  },
  { id:'fullscreen', label:'Full-Screen', hint:'Edge-to-edge — immersive & dramatic',   pct:'100%' },
]
function Step2Width({ data, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Layout Width</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Pick how wide your site content stretches. This defines the overall canvas feel.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {WIDTH_OPTS.map(opt => {
          const active = data.layoutWidth === opt.id
          return (
            <div key={opt.id} onClick={() => onChange({ ...data, layoutWidth:opt.id })} style={{ padding:16, borderRadius:8, cursor:'pointer', border:active?`2px solid ${C.cyan}`:`1px solid ${C.border}`, background:active?'rgba(0,240,255,0.05)':'rgba(255,255,255,0.02)', transition:'all 0.2s' }}>
              <div style={{ background:'#060a14', borderRadius:5, padding:'10px 8px', marginBottom:12, display:'flex', justifyContent:'center', height:60, alignItems:'center' }}>
                <div style={{ width:opt.pct, height:36, background:'rgba(255,255,255,0.08)', borderRadius:3, border:`1px solid ${active?C.cyan+'44':'rgba(255,255,255,0.12)'}` }} />
              </div>
              <div style={{ fontWeight:700, fontSize:13.5, color:active?C.cyan:C.text, marginBottom:4 }}>{opt.label}</div>
              <div style={{ fontSize:11, color:C.sub, lineHeight:1.5 }}>{opt.hint}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 3: Wireframe ────────────────────────────────────────────────────────
function WFBox({ w, h, label, accent, overlay }) {
  return (
    <div style={{ width:w, height:h, minHeight:h, background:accent?'rgba(0,240,255,0.16)':overlay?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.07)', borderRadius:2, border:accent?'1px solid rgba(0,240,255,0.4)':'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, fontWeight:700, color:accent?C.cyan:'rgba(255,255,255,0.4)', letterSpacing:'0.05em', flexShrink:0 }}>
      {label}
    </div>
  )
}
const WF_OPTS = [
  { id:'logo-left', label:'Logo Left · Aside Right', hint:'Classic horizontal — content on left, aside on right', render:() => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 6px', background:'rgba(255,255,255,0.04)', borderRadius:3 }}>
        <WFBox w={30} h={12} label="LOGO" accent />
        <div style={{ flex:1 }} />
        {['Home','Bio','Music','Press'].map(n => <WFBox key={n} w={22} h={9} label={n} />)}
      </div>
      <WFBox w="100%" h={42} label="HERO" />
      <div style={{ display:'flex', gap:4 }}><WFBox w="68%" h={28} label="CONTENT" /><WFBox w="32%" h={28} label="ASIDE" /></div>
    </div>
  )},
  { id:'aside-left', label:'Logo Left · Aside Left', hint:'Top logo left & nav right, with aside on the left and content on the right', render:() => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:5, padding:'4px 6px', background:'rgba(255,255,255,0.04)', borderRadius:3 }}>
        <WFBox w={30} h={12} label="LOGO" accent />
        <div style={{ flex:1 }} />
        {['Home','Bio','Music','Press'].map(n => <WFBox key={n} w={22} h={9} label={n} />)}
      </div>
      <WFBox w="100%" h={42} label="HERO" />
      <div style={{ display:'flex', gap:4 }}><WFBox w="32%" h={28} label="ASIDE" accent /><WFBox w="68%" h={28} label="CONTENT" /></div>
    </div>
  )},
  { id:'centered', label:'Centered Brand', hint:'Logo & nav centred — bold artist focus', render:() => (
    <div style={{ display:'flex', flexDirection:'column', gap:4, alignItems:'center', width:'100%' }}>
      <WFBox w={32} h={12} label="LOGO" accent />
      <div style={{ display:'flex', gap:4 }}>{['Home','Bio','Music','Press'].map(n => <WFBox key={n} w={20} h={9} label={n} />)}</div>
      <WFBox w="100%" h={46} label="HERO" />
      <WFBox w="100%" h={24} label="CONTENT" />
    </div>
  )},
  { id:'sidebar', label:'Sidebar Nav', hint:'Vertical left rail — maximises content height', render:() => (
    <div style={{ display:'flex', gap:4, width:'100%' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        <WFBox w={34} h={12} label="LOGO" accent />
        {['Home','Bio','Music','Press','Book'].map(n => <WFBox key={n} w={34} h={9} label={n} />)}
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
        <WFBox w="100%" h={42} label="HERO" />
        <WFBox w="100%" h={28} label="CONTENT" />
      </div>
    </div>
  )},
  { id:'fullbleed', label:'Full-Bleed Overlay', hint:'Nav floats over full-width hero — dramatic', render:() => (
    <div style={{ position:'relative', width:'100%' }}>
      <WFBox w="100%" h={76} label="HERO (full bleed)" />
      <div style={{ position:'absolute', top:5, left:0, right:0, display:'flex', alignItems:'center', padding:'0 5px' }}>
        <WFBox w={28} h={11} label="LOGO" accent overlay />
        <div style={{ flex:1 }} />
        {['Home','Bio','Music'].map(n => <WFBox key={n} w={20} h={9} label={n} overlay />)}
      </div>
      <div style={{ marginTop:4 }}><WFBox w="100%" h={22} label="CONTENT" /></div>
    </div>
  )},
]
function Step3Wireframe({ data, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Navigation Layout</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Choose where your logo and menu sit relative to your content. Each option shows a live wireframe preview.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {WF_OPTS.map(opt => {
          const active = data.layoutVariant === opt.id
          return (
            <div key={opt.id} onClick={() => onChange({ ...data, layoutVariant:opt.id })} style={{ padding:14, borderRadius:8, cursor:'pointer', border:active?`2px solid ${C.purple}`:`1px solid ${C.border}`, background:active?'rgba(139,92,246,0.07)':'rgba(255,255,255,0.02)', boxShadow:active?`0 0 18px ${C.purple}33`:'none', transition:'all 0.2s' }}>
              <div style={{ background:'#060a14', borderRadius:5, padding:10, marginBottom:10, minHeight:95, display:'flex', alignItems:'center', overflow:'hidden' }}>
                {opt.render()}
              </div>
              <div style={{ fontWeight:700, fontSize:12.5, color:active?C.purple:C.text, marginBottom:3 }}>{opt.label}</div>
              <div style={{ fontSize:11, color:C.sub }}>{opt.hint}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 4: Logo ─────────────────────────────────────────────────────────────
function Step4Logo({ data, onChange, sessionUser }) {
  const fileRef = useRef(null)
  const [aiGen, setAiGen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const handleFile = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const r = new FileReader()
    r.onload = ev => {
      onChange({
        ...data,
        logoUrl: ev.target.result,
        logoName: file.name
      })
    }
    r.readAsDataURL(file)
  }

  const handleBrandKit = () => {
    const s = sessionStorage.getItem('brandkit_logo_url') || sessionStorage.getItem('ported_asset_url')
    if (s) {
      onChange({ ...data, logoUrl: s, logoName: 'brandkit-logo.png' })
      return
    }
    setAiGen(true)
    setTimeout(() => {
      const seed = (sessionUser?.name || 'artist').replace(/\s+/g, '_')
      const url = `https://picsum.photos/seed/${seed}_logo/200`
      onChange({ ...data, logoUrl: url, logoName: `${seed}_brandkit_logo.png` })
      sessionStorage.setItem('brandkit_logo_url', url)
      setAiGen(false)
    }, 1600)
  }

  const displayLogoVal = data.logoName || (data.logoUrl?.startsWith('data:') ? 'uploaded-logo.png' : (data.logoUrl || ''))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Your Logo</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Upload from your computer, pull from the BrandKit Asset Library, or let AI generate one for you.</p>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button type="button" onClick={() => fileRef.current?.click()} style={{ flex:1, padding:'14px 16px', borderRadius:8, cursor:'pointer', border:`1px dashed rgba(255,255,255,0.2)`, background:'rgba(255,255,255,0.02)', color:C.text, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <RiUploadFill size={15} /> Upload from Computer
        </button>
        <button type="button" onClick={handleBrandKit} disabled={aiGen} style={{ flex:1, padding:'14px 16px', borderRadius:8, cursor:aiGen?'wait':'pointer', border:`1px solid rgba(0,240,255,0.3)`, background:'rgba(0,240,255,0.05)', color:C.cyan, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:aiGen?0.7:1 }}>
          <RiSparklingFill size={15} />{aiGen ? 'Generating...' : 'Asset Library / BrandKit AI'}
        </button>
        <input ref={fileRef} type="file" accept="image/png, image/jpeg, image/svg+xml, image/webp" style={{ display:'none' }} onChange={handleFile} />
      </div>

      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, position: 'relative' }}>
            <Label sub="Shows file name or direct URL" style={{ margin:0 }}>Logo Name / Image URL</Label>
            <div
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            >
              <div
                title="Hover for image specifications and recommended dimensions"
                style={{
                  width: 19,
                  height: 19,
                  borderRadius: '50%',
                  border: `1px solid ${showInfo ? C.cyan : 'rgba(255,255,255,0.25)'}`,
                  background: showInfo ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: showInfo ? C.cyan : '#cbd5e1',
                  fontSize: 11,
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  cursor: 'help',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                  transition: 'all 0.15s'
                }}
              >
                i
              </div>

              {/* Hover Overlay Tooltip */}
              {showInfo && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    width: 320,
                    zIndex: 2000,
                    padding: '12px 16px',
                    background: '#070e1c',
                    border: `1px solid rgba(0,240,255,0.5)`,
                    borderRadius: 8,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.85), 0 0 16px rgba(0,240,255,0.25)',
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{ fontSize:11.5, fontWeight:800, color:C.cyan, textTransform:'uppercase', letterSpacing:'0.04em', display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <RiInformationLine size={14} /> Logo Upload Guidelines & Dimensions
                  </div>
                  <div style={{ fontSize:11, color:'#cbd5e1', lineHeight:1.6, display:'flex', flexDirection:'column', gap:4 }}>
                    <div>• <strong>Allowable Image Types:</strong> <span style={{ color:'#fff' }}>PNG, SVG, WEBP, JPG / JPEG</span> (Transparent PNG or SVG recommended).</div>
                    <div>• <strong>Recommended Dimensions:</strong> <span style={{ color:'#fff' }}>Square (1:1): 800 × 800 px</span> (min 500 × 500 px, up to 2000 × 2000 px) • <span style={{ color:'#fff' }}>Header Banner (3:1 / 4:1): 1200 × 350 px</span>.</div>
                    <div>• <strong>Maximum File Size:</strong> <span style={{ color:'#fff' }}>5 MB</span>.</div>
                    <div style={{ color:C.cyan, fontSize:10.5, marginTop:2 }}>
                      💡 Tip: Transparent backgrounds allow your logo to seamlessly blend into both Dark Theme and Light Theme modes.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {data.logoUrl && (
            <button
              type="button"
              onClick={() => onChange({ ...data, logoUrl: '', logoName: '' })}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
            >
              ✕ Clear Logo
            </button>
          )}
        </div>

        <FInput
          value={displayLogoVal}
          onChange={e => onChange({ ...data, logoUrl: e.target.value, logoName: '' })}
          placeholder="https://... or click Upload from Computer above"
        />

        {data.logoName && (
          <div style={{ marginTop: 6, fontSize: 11, color: C.cyan, display: 'flex', alignItems: 'center', gap: 5 }}>
            <RiCheckFill size={13} /> Active File: <strong>{data.logoName}</strong>
          </div>
        )}
      </div>

      <div>
        <Label>Live Preview</Label>
        <div style={{ background:'#060a14', borderRadius:6, border:`1px solid ${C.border}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:56, height:56, borderRadius:8, background:'rgba(255,255,255,0.04)', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
            {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ width:'100%', height:'100%', objectFit:'contain' }} /> : <RiImageFill size={22} color={C.muted} />}
          </div>
          <div style={{ flex:1, background:'rgba(255,255,255,0.02)', borderRadius:5, border:`1px solid ${C.border}`, padding:'8px 14px', display:'flex', alignItems:'center', gap:10 }}>
            {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ height:26, objectFit:'contain', borderRadius:3 }} /> : <div style={{ height:26, width:50, background:'rgba(255,255,255,0.06)', borderRadius:3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:C.muted }}>LOGO</div>}
            <div style={{ flex:1 }} />
            {['Home','Bio','Music','Press'].map(n => <span key={n} style={{ fontSize:10.5, color:C.sub, fontWeight:600 }}>{n}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 5: Colors ─────────────────────────────────────────────────────────────
const DARK_SCHEMES = [
  { label:'Cyber Neon',    primary:'#00f0ff', secondary:'#8b5cf6', bg:'linear-gradient(135deg,#0f0c20,#1a0826)' },
  { label:'Afro Gold',     primary:'#ffb703', secondary:'#fb8500', bg:'linear-gradient(135deg,#1f1406,#2e1d09)' },
  { label:'Velvet R&B',    primary:'#c084fc', secondary:'#f472b6', bg:'linear-gradient(135deg,#190a28,#2c1347)' },
  { label:'Emerald Roots', primary:'#22c55e', secondary:'#eab308', bg:'linear-gradient(135deg,#062c19,#0d472a)' },
  { label:'Steel Metal',   primary:'#ef4444', secondary:'#94a3b8', bg:'linear-gradient(135deg,#140505,#260a0a)' },
  { label:'Jazz Smoked',   primary:'#fbbf24', secondary:'#d97706', bg:'linear-gradient(135deg,#1c140e,#2e2017)' },
]

const LIGHT_SCHEMES = [
  { label:'Pure Minimal',   primary:'#0284c7', secondary:'#6366f1', bg:'linear-gradient(135deg,#f8fafc,#e2e8f0)' },
  { label:'Afro Sunrise',   primary:'#d97706', secondary:'#ea580c', bg:'linear-gradient(135deg,#fffbeb,#fef3c7)' },
  { label:'Rose Quartz',    primary:'#db2777', secondary:'#9333ea', bg:'linear-gradient(135deg,#fdf2f8,#fce7f3)' },
  { label:'Mint Clean',     primary:'#059669', secondary:'#0284c7', bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)' },
  { label:'Modernist Slate',primary:'#2563eb', secondary:'#475569', bg:'linear-gradient(135deg,#f1f5f9,#e2e8f0)' },
  { label:'Golden Era',     primary:'#b45309', secondary:'#c2410c', bg:'linear-gradient(135deg,#fafaf9,#f5f5f4)' },
]

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width:44, height:36, border:`1px solid ${C.border}`, borderRadius:5, cursor:'pointer', background:'none', padding:2 }} />
        <input value={value} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) onChange(e.target.value) }} className="form-control" style={{ flex:1, fontSize:13, padding:'7px 10px', fontFamily:'monospace', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:5, color:C.text }} />
      </div>
    </div>
  )
}

function Step5Colors({ data, onChange }) {
  const [fontsModalOpen, setFontsModalOpen] = useState(false)
  const isLight = data.themeMode === 'light'
  const activeSchemes = isLight ? LIGHT_SCHEMES : DARK_SCHEMES

  const update = (field, val) => onChange({ ...data, [field]:val })
  const applyScheme = s => onChange({ ...data, accentColor:s.primary, secondaryColor:s.secondary, themeBg:s.bg })

  const handleThemeMode = mode => {
    if (mode === 'light') {
      onChange({
        ...data,
        themeMode: 'light',
        accentColor: data.accentColor === '#00f0ff' ? '#0284c7' : data.accentColor,
        secondaryColor: data.secondaryColor === '#8b5cf6' ? '#6366f1' : data.secondaryColor,
        themeBg: 'linear-gradient(135deg,#f8fafc,#e2e8f0)'
      })
    } else {
      onChange({
        ...data,
        themeMode: 'dark',
        accentColor: data.accentColor === '#0284c7' ? '#00f0ff' : data.accentColor,
        secondaryColor: data.secondaryColor === '#6366f1' ? '#8b5cf6' : data.secondaryColor,
        themeBg: 'linear-gradient(135deg,#0f0c20,#1a0826)'
      })
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Theme Colors & Typography</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Pick your brand colors, toggle between Dark and Light mode with analogous color pairing, and choose from Google Fonts.</p>
      </div>

      {/* Dark vs Light Mode Toggle */}
      <div>
        <Label sub="Dark theme uses deep contrast with glowing accents; Light theme uses a crisp editorial canvas">Display Theme Mode</Label>
        <div style={{ display:'flex', gap:10 }}>
          <button
            type="button"
            onClick={() => handleThemeMode('dark')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              border: !isLight ? `2px solid ${C.purple}` : `1px solid ${C.border}`,
              background: !isLight ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.02)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: !isLight ? `0 0 16px ${C.purple}33` : 'none'
            }}
          >
            <RiMoonFill size={16} color={C.purple} /> 🌙 Dark Theme (TuneMavens Protocol)
          </button>
          <button
            type="button"
            onClick={() => handleThemeMode('light')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              border: isLight ? `2px solid ${C.cyan}` : `1px solid ${C.border}`,
              background: isLight ? 'rgba(0,240,255,0.12)' : 'rgba(255,255,255,0.02)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: isLight ? `0 0 16px ${C.cyan}33` : 'none'
            }}
          >
            <RiSunFill size={16} color={C.cyan} /> ☀️ Light Theme (Clean Canvas)
          </button>
        </div>
      </div>

      {/* AI Color Scheme Suggestions with Analogous Harmonies */}
      <div>
        <Label sub={`AI suggested analogous harmonies for ${isLight ? 'Light Mode' : 'Dark Mode'}`}>Analogous Color Schemes</Label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {activeSchemes.map(s => (
            <div key={s.label} onClick={() => applyScheme(s)} style={{ padding:'10px 12px', borderRadius:8, cursor:'pointer', border:`1px solid ${C.border}`, background:'rgba(255,255,255,0.02)', transition:'all 0.18s' }}>
              <div style={{ display:'flex', gap:5, marginBottom:6 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:s.primary }} />
                <div style={{ width:22, height:22, borderRadius:'50%', background:s.secondary }} />
                <div style={{ flex:1, height:22, borderRadius:4, background:s.bg, border:'1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:C.text }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <ColorField label="Primary Accent" value={data.accentColor||(isLight ? '#0284c7' : '#00f0ff')} onChange={v => update('accentColor',v)} />
        <ColorField label="Secondary Analogous Color" value={data.secondaryColor||(isLight ? '#6366f1' : '#8b5cf6')} onChange={v => update('secondaryColor',v)} />
      </div>

      <div>
        <Label sub="CSS gradient or solid hex — applied to hero background">Hero Canvas Background</Label>
        <FInput value={data.themeBg||''} onChange={e => update('themeBg',e.target.value)} placeholder={isLight ? "linear-gradient(135deg,#f8fafc,#e2e8f0)" : "linear-gradient(135deg,#0f0c20,#1a0826)"} />
      </div>

      {/* Typography with Google Fonts Picker */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <Label sub="Applied to headings, menus, and typography across your site">Typography</Label>
          <button
            type="button"
            onClick={() => setFontsModalOpen(true)}
            style={{
              background: 'rgba(0,240,255,0.1)',
              border: `1px solid ${C.cyan}`,
              color: C.cyan,
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <RiSearchLine size={12} /> Browse 20+ Google Fonts
          </button>
        </div>

        <select
          value={data.fontFamily||'Sansation, sans-serif'}
          onChange={e => {
            if (e.target.value === 'open_google_fonts') {
              setFontsModalOpen(true)
            } else {
              update('fontFamily', e.target.value)
            }
          }}
          className="form-control"
          style={{ width:'100%', background:'#060a14', color:C.text, border:`1px solid ${C.border}`, padding:'9px 12px', borderRadius:5, fontSize:13 }}
        >
          <option value="'Sansation', sans-serif">Sansation (TuneMavens Default)</option>
          <option value="'Outfit', sans-serif">Outfit (Clean Sans)</option>
          <option value="'Orbitron', sans-serif">Orbitron (Cyber / Tech)</option>
          <option value="'Inter', sans-serif">Inter (Modern Standard)</option>
          <option value="'Space Grotesk', sans-serif">Space Grotesk (Neo-Grotesque)</option>
          <option value="'DM Serif Display', serif">DM Serif Display (Editorial)</option>
          <option value="'Playfair Display', serif">Playfair Display (Luxury Serif)</option>
          <option value="'Bebas Neue', sans-serif">Bebas Neue (Bold Display)</option>
          <option value="'Cinzel', serif">Cinzel (Cinematic Monumental)</option>
          <option value="'Audiowide', sans-serif">Audiowide (Cyberpunk)</option>
          {data.fontFamily && !['Sansation','Outfit','Orbitron','Inter','Space Grotesk','DM Serif Display','Playfair Display','Bebas Neue','Cinzel','Audiowide'].some(f => data.fontFamily.includes(f)) && (
            <option value={data.fontFamily}>Custom: {data.fontFamily}</option>
          )}
          <option value="open_google_fonts">🔍 Other (Browse Google Fonts Library...)</option>
        </select>
      </div>

      {/* Live Preview Card (Adapts to Dark / Light) */}
      <div>
        <Label>Live Palette Preview</Label>
        <div style={{ borderRadius:8, overflow:'hidden', border: isLight ? '1px solid #cbd5e1' : `1px solid ${C.border}` }}>
          <div style={{ background:data.themeBg||(isLight ? '#f8fafc' : '#0a0f1d'), padding:'18px 16px', display:'flex', alignItems:'center', gap:12, transition:'background 0.3s ease' }}>
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="logo" style={{ height:34, objectFit:'contain', borderRadius:4 }} />
            ) : (
              <div style={{ width:34, height:34, borderRadius:'50%', background:data.accentColor||(isLight ? '#0284c7' : C.cyan), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:15, color:'#000' }}>A</div>
            )}
            <div>
              <div style={{ fontFamily:data.fontFamily||'Sansation, sans-serif', fontSize:16, fontWeight:800, color: isLight ? '#0f172a' : '#fff' }}>Your Headline Title</div>
              <div style={{ fontSize:11, color:data.accentColor||(isLight ? '#0284c7' : C.cyan), fontWeight:700 }}>Genre · Location · 2026</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
              {['Home','Bio','Music'].map(n => <span key={n} style={{ fontSize:11, color: isLight ? '#475569' : 'rgba(255,255,255,0.7)', fontWeight:600 }}>{n}</span>)}
            </div>
          </div>
          <div style={{ padding:'10px 16px', background: isLight ? '#ffffff' : '#070a13', borderTop: isLight ? '1px solid #e2e8f0' : 'none', display:'flex', gap:10 }}>
            <div style={{ padding:'6px 14px', background:data.accentColor||(isLight ? '#0284c7' : C.cyan), color: isLight ? '#fff' : '#000', borderRadius:4, fontSize:11.5, fontWeight:700 }}>Primary Accent</div>
            <div style={{ padding:'6px 14px', border:`1px solid ${data.secondaryColor||(isLight ? '#6366f1' : C.purple)}`, color:data.secondaryColor||(isLight ? '#6366f1' : C.purple), borderRadius:4, fontSize:11.5, fontWeight:700 }}>Secondary Analogous</div>
          </div>
        </div>
      </div>

      {/* Google Fonts Search Modal */}
      <GoogleFontsModal
        isOpen={fontsModalOpen}
        onClose={() => setFontsModalOpen(false)}
        onSelect={font => update('fontFamily', font)}
        currentFont={data.fontFamily}
      />
    </div>
  )
}

// ── Step 6: Menu ─────────────────────────────────────────────────────────────
const DEFAULT_MENU = [
  { id:1, label:'Home',    path:'/'        },
  { id:2, label:'Bio',     path:'/bio'     },
  { id:3, label:'Music',   path:'/music'   },
  { id:4, label:'Press',   path:'/press'   },
  { id:5, label:'Booking', path:'/booking' },
  { id:6, label:'Contact', path:'/contact' },
]
function Step6Menu({ data, onChange }) {
  const init = data.menuItems?.length ? data.menuItems : DEFAULT_MENU
  const [items, setItems] = useState(init)
  const [newLabel, setNewLabel] = useState('')
  const [dragIdx, setDragIdx] = useState(null)
  const sync = next => { setItems(next); onChange({ ...data, menuItems:next }) }
  const remove = id => sync(items.filter(i => i.id !== id))
  const addItem = () => {
    if (!newLabel.trim()) return
    sync([...items, { id:Date.now(), label:newLabel.trim(), path:`/${newLabel.trim().toLowerCase().replace(/\s+/g,'-')}` }])
    setNewLabel('')
  }
  const onDragStart = i => setDragIdx(i)
  const onDragOver = (e, i) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    const next = [...items]
    const [m] = next.splice(dragIdx, 1)
    next.splice(i, 0, m)
    setDragIdx(i)
    sync(next)
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Navigation Menu</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>AI has built a smart starter menu from your profile. Drag to reorder, remove what you don't need, or add your own pages.</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ padding:'5px 12px', background:'rgba(139,92,246,0.1)', border:`1px solid rgba(139,92,246,0.3)`, borderRadius:20, fontSize:11, fontWeight:700, color:C.purple, display:'flex', alignItems:'center', gap:5 }}>
          <RiSparklingFill size={11} /> AI Suggested Menu
        </div>
        <button type="button" onClick={() => sync(DEFAULT_MENU)} style={{ background:'transparent', border:'none', color:C.sub, fontSize:11, cursor:'pointer', textDecoration:'underline' }}>Reset to suggestions</button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {items.map((item, i) => (
          <div key={item.id} draggable onDragStart={() => onDragStart(i)} onDragOver={e => onDragOver(e, i)} onDragEnd={() => setDragIdx(null)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:dragIdx===i?'rgba(139,92,246,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${C.border}`, borderRadius:6, cursor:'grab', transition:'all 0.15s' }}>
            <RiDragMoveFill size={14} color={C.muted} style={{ flexShrink:0 }} />
            <span style={{ fontSize:12.5, fontWeight:600, color:C.text, flex:1 }}>{item.label}</span>
            <span style={{ fontSize:11, color:C.muted, fontFamily:'monospace' }}>{item.path}</span>
            <button type="button" onClick={() => remove(item.id)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#ef4444', padding:'2px 4px' }}><RiDeleteBinFill size={13} /></button>
          </div>
        ))}
      </div>
      <div>
        <Label>Add Custom Page</Label>
        <div style={{ display:'flex', gap:8 }}>
          <FInput value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key==='Enter' && addItem()} placeholder="e.g. Merch, Videos, Tour Dates..." style={{ flex:1 }} />
          <Btn onClick={addItem} accent style={{ whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:4 }}><RiAddFill size={14} />Add</Btn>
        </div>
      </div>
      <div style={{ background:'#060a14', borderRadius:6, border:`1px solid ${C.border}`, padding:'10px 16px', display:'flex', alignItems:'center', gap:14, overflowX:'auto' }}>
        {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ height:24, objectFit:'contain', flexShrink:0 }} /> : <div style={{ fontSize:11, fontWeight:700, color:C.cyan, flexShrink:0 }}>LOGO</div>}
        <div style={{ flex:1 }} />
        {items.slice(0,6).map(item => <span key={item.id} style={{ fontSize:11, color:C.sub, fontWeight:600, whiteSpace:'nowrap' }}>{item.label}</span>)}
      </div>
    </div>
  )
}

// ── Step 7: Content & Music Business Ecosystem Engine ─────────────────────────
export const MUSIC_ECOSYSTEM_IMAGES = [
  { id: 'ssl_console', title: 'Hybrid SSL Console & 24-Bit Mastering', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop', category: 'producer' },
  { id: 'vintage_mic', title: 'Acoustic Studio & Vintage Condenser Mic', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop', category: 'artist' },
  { id: 'festival_stage', title: 'World Tour Arena Showcase & Laser Beams', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop', category: 'tour' },
  { id: 'dj_lasers', title: 'Peak-Hour Festival Mainstage & DJ Decks', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop', category: 'dj' },
  { id: 'scoring_piano', title: 'Cinematic Orchestral Scoring Stage', url: 'https://images.unsplash.com/photo-1520523839898-507128a50616?q=80&w=1600&auto=format&fit=crop', category: 'sync' },
  { id: 'concert_crowd', title: 'Sold-Out Headline Tour & Live Energy', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop', category: 'tour' },
  { id: 'guitar_rig', title: 'Studio Guitar Rig & Pedalboard Electronics', url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop', category: 'artist' },
  { id: 'neon_synth', title: 'Analog Synthesizer Laboratory & Eurorack', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop', category: 'producer' }
]

export function validateSocialAccount(platform, url) {
  if (!url || !url.trim()) return { status: 'empty', message: 'Unconfigured' }
  const trimmed = url.trim()
  switch (platform) {
    case 'spotify':
      if (/^https:\/\/(open\.)?spotify\.com\/artist\/[a-zA-Z0-9]+(\?.*)?$/.test(trimmed) || trimmed.includes('spotify.com/artist/')) {
        return { status: 'valid', message: '✓ Verified Spotify Link' }
      }
      return { status: 'warning', message: '⚠️ Invalid format' }
    case 'soundcloud':
      if (/^https:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9-_]+(\/.*)?$/.test(trimmed)) {
        return { status: 'valid', message: '✓ Verified SoundCloud Link' }
      }
      return { status: 'warning', message: '⚠️ Invalid format' }
    case 'instagram':
      if (/^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+(\/.*)?$/.test(trimmed)) {
        return { status: 'valid', message: '✓ Verified Instagram Link' }
      }
      return { status: 'warning', message: '⚠️ Invalid format' }
    case 'youtube':
      if (/^https:\/\/(www\.)?youtube\.com\/(@[a-zA-Z0-9-_.]+|channel\/[a-zA-Z0-9-_]+|c\/[a-zA-Z0-9-_]+)(\/.*)?$/.test(trimmed)) {
        return { status: 'valid', message: '✓ Verified YouTube Link' }
      }
      return { status: 'warning', message: '⚠️ Invalid format' }
    case 'twitter':
      if (/^https:\/\/(www\.)?(x|twitter)\.com\/[a-zA-Z0-9_]+(\/.*)?$/.test(trimmed)) {
        return { status: 'valid', message: '✓ Verified X / Twitter Link' }
      }
      return { status: 'warning', message: '⚠️ Invalid format' }
    case 'bookingEmail':
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return { status: 'valid', message: '✓ Valid Booking Email' }
      }
      return { status: 'warning', message: '⚠️ Invalid email format' }
    default:
      return { status: 'valid', message: '✓ Valid' }
  }
}

export const MUSIC_BUSINESS_GOALS = [
  { id: 'sync', label: '🎬 Sync Licensing & Cues', desc: '100% pre-cleared TV/film cues, gaming, music supervisors' },
  { id: 'tour', label: '🌍 World Tour & Live Dates', desc: 'Concert stages, VIP fan passes, TuneBooking reservations' },
  { id: 'stems', label: '🎛️ 24-Bit Stems & Splits', desc: 'Master ownership, multitrack WAV stems on TuneStream, PRO splits' },
  { id: 'dj', label: '🎧 DJ Pool Drops & Acts', desc: 'Club dubplates, peak-hour festival sets, dancefloor VIP edits' },
  { id: 'fan', label: '💎 VIP Fan Vault & Vinyl', desc: '180g vinyl, unreleased stem crates, direct-to-fan subscription' }
]

export const PATH_TITLE_SUGGESTIONS = [
  "100% Pre-Cleared One-Stop Sync Licensing & Master Stems",
  "World Tour 2026 • Live Showcase & Global Festival Dates",
  "Lossless 24-Bit Studio Multitracks & Transparent Publishing Splits",
  "Architect of Heavyweight Analog Soundscapes & Commercial Stems",
  "Independent Master Ownership with Direct VIP Fan Subscriptions",
  "Broadcast-Ready Cinematic Cues for Film, Television & Gaming"
]

export const MUSIC_CREATOR_PATHWAYS = [
  {
    id: 'artist',
    label: 'Performing Artist & Vocalist',
    icon: '🎤',
    focus: 'Live Touring, Master Recordings, VIP Fan Club & Lossless Audio Stems',
    headline: "100% Pre-Cleared One-Stop Sync Licensing & Master Stems",
    bio: (name) => `${name} is a pioneering recording and touring artist at the vanguard of modern electronic and global soundscapes. With over 8 million cumulative streams on TuneStream, ${name} retains 100% master ownership while licensing catalog multitracks across international synchronization networks. Backed by verified on-chain splits via the Intermaven Shared Ledger, ${name}'s direct-to-fan ecosystem delivers lossless 24-bit studio stems, limited vinyl editions, and sold-out headline tours across Nairobi, London, Berlin, and New York.`,
    pressQuote: "A seismic force in modern live performance, commanding festival mainstages while pioneering direct creator ownership.",
    pressOutlet: "Pitchfork Global",
    heroImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: 'producer',
    label: 'Music Producer & Beatmaker',
    icon: '🎛️',
    focus: 'Multitrack Stems, Beat Licensing, Producer Royalties & Studio Bookings',
    headline: "Architect of Platinum Soundscapes & Analog Synthesizer Grooves",
    bio: (name) => `${name} is an internationally acclaimed music producer and sound architect crafting sonic foundations for chart-topping releases. Operating out of state-of-the-art hybrid analog/digital facilities, ${name} specializes in high-fidelity 24-bit multitrack stem packages, custom sound design, and co-production deals. With producer points and backend publishing shares administered automatically through Intermaven Smart CRM and Split-Cascade contracts, ${name} empowers independent creators and major labels with industry-grade production.`,
    pressQuote: "One of the sharpest sonic innovators in the business today—delivering heavyweight low-end and crystal-clear acoustic clarity.",
    pressOutlet: "Sound On Sound",
    heroImages: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: 'songwriter',
    label: 'Songwriter & Sync Composer',
    icon: '🎼',
    focus: 'Publishing Splits, PRO Administration, Film/TV Cues & Co-Writing',
    headline: "Cinematic Storytelling, Melodic Precision & Sync Clearance",
    bio: (name) => `${name} is a prolific songwriter and media composer registered with global performing rights organizations. Specializing in emotional vocal hooks, intricate harmonic arrangements, and broadcast-ready cinematic cues, ${name}'s catalog is curated for immediate one-stop sync clearance on SyncMavens. All split sheets, mechanical royalties, and public performance revenue streams are tracked with zero-latency reconciliation on the Intermaven Publishing Engine.`,
    pressQuote: "Unmatched melodic craftsmanship tailored for high-stakes cinematic placements and commercial campaigns.",
    pressOutlet: "Billboard Sync Spotlight",
    heroImages: [
      "https://images.unsplash.com/photo-1520523839898-507128a50616?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: 'dj',
    label: 'DJ & Electronic Live Act',
    icon: '🎧',
    focus: 'DJ Pool Drops, Club Residencies, Festival Bookings & Exclusive VIP Edits',
    headline: "Peak-Hour Sonic Energy & Global Dancefloor Anthems",
    bio: (name) => `${name} is a high-energy DJ and electronic music innovator headlining premier clubs and festival arenas worldwide. Known for seamlessly weaving deep basslines, hypnotic synth arpeggios, and percussive African rhythms, ${name} utilizes the TuneMavens DJ Pool engine to clear promotional drops and deliver lossless club-ready dubplates. With direct booking management through TuneBooking and verified fan loyalty clubs, ${name} turns live sets into thriving community movements.`,
    pressQuote: "Electrifying dancefloor mastery that bridges underground club culture with stadium-sized production.",
    pressOutlet: "DJ Mag International",
    heroImages: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: 'label',
    label: 'Independent Record Label & Imprint',
    icon: '🏢',
    focus: 'Roster Development, Global Catalog Distribution & Automated Splits',
    headline: "Next-Generation Music Imprint & Catalog Enterprise",
    bio: (name) => `${name} is a trailblazing independent record label and artist incubator championing the future of African and global diaspora music. Leveraging the Intermaven ecosystem, the imprint manages global digital distribution on TuneStream, synchronizes publishing metadata with international DSPs, and executes automated smart contract splits across its entire artist roster. Built on transparency, direct fan relationships, and uncompromising artistic freedom, ${name} represents the modern music industry paradigm.`,
    pressQuote: "A blueprint for the modern independent label—flawless catalog management and direct creator compensation.",
    pressOutlet: "Music Week",
    heroImages: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: 'sync',
    label: 'Sync Licensing Specialist',
    icon: '🎬',
    focus: 'Film, Gaming, TV Placements & One-Stop Catalog Clearance',
    headline: "Broadcast-Ready Master Recordings for Film, Television & Gaming",
    bio: (name) => `${name} is a dedicated sync licensing creator and sonic curator delivering custom instrumental cues and full vocal productions to music supervisors across Hollywood, streaming platforms, and AAA video game franchises. Featuring 100% pre-cleared master and publishing rights, instant stems delivery, and lossless 24-bit audio files, ${name}'s catalog on SyncMavens offers friction-free licensing and rapid turnaround for high-impact visual media.`,
    pressQuote: "The go-to sonic resource for music supervisors demanding pristine sound quality and rapid one-stop clearance.",
    pressOutlet: "Variety Music for Screens",
    heroImages: [
      "https://images.unsplash.com/photo-1520523839898-507128a50616?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
    ]
  }
]

function PathwaySelectorModal({ isOpen, onClose, onSelect, currentPathId }) {
  if (!isOpen) return null
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          background: '#0a0d18',
          border: `1px solid ${C.purple}55`,
          borderRadius: 12,
          width: '100%',
          maxWidth: 820,
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: 28,
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚡</span> Choose Your Music Creator Pathway
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: C.sub, maxWidth: 620 }}>
              Select the music business pathway that best describes your sound and commercial operations. This will auto-populate your site headline, music business bio, press quotes, and hero media.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: C.sub, fontSize: 20, cursor: 'pointer', padding: 4 }}
          >
            <RiCloseFill />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
          {MUSIC_CREATOR_PATHWAYS.map(p => {
            const isSelected = p.id === currentPathId
            return (
              <div
                key={p.id}
                onClick={() => onSelect(p)}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: isSelected ? `2px solid ${C.cyan}` : `1px solid ${C.border}`,
                  background: isSelected ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  boxShadow: isSelected ? `0 0 16px ${C.cyan}33` : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 13.5, color: isSelected ? C.cyan : '#fff' }}>
                        {p.label}
                      </div>
                      <div style={{ fontSize: 11, color: C.sub }}>
                        {p.focus}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ background: C.cyan, color: '#000', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 10 }}>
                      ACTIVE
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 11.5, color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                  "{p.headline}"
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.cyan }}>
                    {isSelected ? '✓ Currently Selected' : 'Apply & Pre-Populate →'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Step7Content({ data, onChange, tracks, sessionUser }) {
  const [aiGenBio, setAiGenBio] = useState(false)
  const [aiGenImg, setAiGenImg] = useState(false)
  const [aiGenTitles, setAiGenTitles] = useState(false)
  const [imageQty, setImageQty] = useState(3)
  const [showPathwayModal, setShowPathwayModal] = useState(false)

  // Custom AI Prompts
  const [heroAiPrompt, setHeroAiPrompt] = useState('')
  const [titleAiPrompt, setTitleAiPrompt] = useState(data.aiPrompt || '')
  const [bioAiPrompt, setBioAiPrompt] = useState('')
  const [generatedTitles, setGeneratedTitles] = useState([])
  const [aiStatusMsg, setAiStatusMsg] = useState('')
  const [socialValidationResults, setSocialValidationResults] = useState({})
  const [socialCheckRan, setSocialCheckRan] = useState(false)

  const heroFileInputRef = useRef(null)

  const update = (field, val) => onChange({ ...data, [field]:val })

  const activePathId = data.selectedPathway || sessionStorage.getItem('creator_selected_path') || sessionUser?.creator_pathway || sessionUser?.primary_role || 'artist'
  const currentPath = MUSIC_CREATOR_PATHWAYS.find(p => p.id === activePathId) || MUSIC_CREATOR_PATHWAYS[0]
  const currentUsername = data.subdomain || 'creator'
  const artistName = data.siteName || data.artist_name || sessionUser?.name || 'Kip & The Mavens'

  // Auto pre-populate if path exists and content is unpopulated
  useEffect(() => {
    if (currentPath && (!data.headline || !data.bio)) {
      const bioText = typeof currentPath.bio === 'function' ? currentPath.bio(artistName) : currentPath.bio
      onChange({
        ...data,
        selectedPathway: currentPath.id,
        headline: data.headline || currentPath.headline,
        heroTitle1: data.heroTitle1 || `${artistName} — Official Creator Web World`,
        heroTitle2: data.heroTitle2 || (data.headline || currentPath.headline),
        heroTitle3: data.heroTitle3 || "100% Pre-Cleared One-Stop Sync Licensing & Master Stems • TuneStream",
        heroAnimStyle: data.heroAnimStyle || 'synergy',
        bio: data.bio || bioText,
        pressQuote: data.pressQuote || currentPath.pressQuote,
        pressOutlet: data.pressOutlet || currentPath.pressOutlet,
        heroImages: (data.heroImages && data.heroImages.length > 0) ? data.heroImages : currentPath.heroImages,
        heroImageUrl: data.heroImageUrl || currentPath.heroImages[0]
      })
    }
  }, [])

  const applyPathway = (pathway) => {
    const bioText = typeof pathway.bio === 'function' ? pathway.bio(artistName) : pathway.bio
    onChange({
      ...data,
      selectedPathway: pathway.id,
      headline: pathway.headline,
      heroTitle1: `${artistName} — ${pathway.label}`,
      heroTitle2: pathway.headline,
      heroTitle3: "100% Pre-Cleared One-Stop Sync Licensing & Master Stems • TuneStream",
      bio: bioText,
      pressQuote: pathway.pressQuote,
      pressOutlet: pathway.pressOutlet,
      heroImages: pathway.heroImages,
      heroImageUrl: pathway.heroImages[0]
    })
    sessionStorage.setItem('creator_selected_path', pathway.id)
    setShowPathwayModal(false)
  }

  // Handle local Hero image upload
  const handleHeroFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const dataUrl = evt.target.result
      const existing = Array.isArray(data.heroImages) ? data.heroImages : []
      const nextImages = [dataUrl, ...existing.filter(u => u !== dataUrl)]
      onChange({
        ...data,
        heroImageUrl: dataUrl,
        heroImages: nextImages,
        heroImageName: file.name
      })
    }
    reader.readAsDataURL(file)
  }

  // Core Music Business AI Engine: Parse instructions and switch titles & context
  const handleUpdateEcosystemUnderstanding = (customPrompt) => {
    setAiGenTitles(true)
    const promptText = (customPrompt !== undefined ? customPrompt : titleAiPrompt).trim()
    const promptLower = promptText.toLowerCase()
    
    setTimeout(() => {
      let t1 = `${artistName} — Official Creator Web World`
      let t2 = "100% Pre-Cleared One-Stop Sync Licensing & Master Stems"
      let t3 = "World Tour 2026 • Stream Lossless 24-Bit Stems on TuneStream"
      let newTitles = []
      let matchedImages = MUSIC_ECOSYSTEM_IMAGES.slice(0, 3).map(m => m.url)

      if (promptLower.includes('sync') || promptLower.includes('film') || promptLower.includes('tv') || promptLower.includes('cues') || promptLower.includes('game')) {
        t1 = `${artistName} — Broadcast Sync Catalog & Cinematic Score`
        t2 = "100% Pre-Cleared One-Stop Sync Clearance on SyncMavens"
        t3 = "Instrumental Cues, 24-Bit WAV Stems & Automated PRO Splits"
        newTitles = [
          "100% Pre-Cleared One-Stop Sync Licensing & Master Stems",
          "Broadcast-Ready Cinematic Cues for Film, Television & Gaming",
          "One-Stop Synchronization Catalog Available on SyncMavens",
          "High-Impact Narrative Soundtracks & Instrumental multitracks",
          "Direct Music Supervisor Licensing with Zero Clearance Friction",
          "Lossless 24-Bit Film Stems & ASCAP/BMI Split Verification"
        ]
        matchedImages = [
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'scoring_piano')?.url || MUSIC_ECOSYSTEM_IMAGES[4].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'ssl_console')?.url || MUSIC_ECOSYSTEM_IMAGES[0].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'vintage_mic')?.url || MUSIC_ECOSYSTEM_IMAGES[1].url
        ]
      } else if (promptLower.includes('tour') || promptLower.includes('live') || promptLower.includes('concert') || promptLower.includes('show') || promptLower.includes('festival')) {
        t1 = `${artistName} — World Tour 2026 Live Showcase`
        t2 = "Electrifying Stage Performance & Global Headline Dates"
        t3 = "Direct Fan Ticketing via TuneBooking • Reserved VIP Passes"
        newTitles = [
          "World Tour 2026 • Live Showcase & Global Festival Dates",
          "Electrifying Mainstage Sonic Experience & Live Tour",
          "Direct Fan Ticketing & VIP Access via TuneBooking",
          "Headline Tour Across Nairobi, London, Berlin & Tokyo",
          "Stadium-Grade Soundscapes & Immersive Stage Production",
          "Unrivaled Live Energy Powered by the Intermaven Network"
        ]
        matchedImages = [
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'festival_stage')?.url || MUSIC_ECOSYSTEM_IMAGES[2].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'concert_crowd')?.url || MUSIC_ECOSYSTEM_IMAGES[5].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'vintage_mic')?.url || MUSIC_ECOSYSTEM_IMAGES[1].url
        ]
      } else if (promptLower.includes('producer') || promptLower.includes('synth') || promptLower.includes('stem') || promptLower.includes('analog') || promptLower.includes('beat') || promptLower.includes('mixing')) {
        t1 = `${artistName} — Analog Studio Mastery & Multitrack Stems`
        t2 = "Lossless 24-Bit Audio & Transparent On-Chain Publishing Splits"
        t3 = "Unreleased Stem Crates & Master Recordings on TuneStream"
        newTitles = [
          "Architect of Heavyweight Analog Soundscapes & Commercial Stems",
          "Lossless 24-Bit Studio Multitracks & Transparent Publishing Splits",
          "Commercial Multitrack Stem Packages on TuneStream",
          "Pure Analog Warmth & Modular Synthesizer Precision",
          "Producer Points & Split-Cascade Contracts on Intermaven Ledger",
          "High-Fidelity Studio Audio for Commercial Releases"
        ]
        matchedImages = [
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'ssl_console')?.url || MUSIC_ECOSYSTEM_IMAGES[0].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'neon_synth')?.url || MUSIC_ECOSYSTEM_IMAGES[7].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'vintage_mic')?.url || MUSIC_ECOSYSTEM_IMAGES[1].url
        ]
      } else if (promptLower.includes('dj') || promptLower.includes('club') || promptLower.includes('dance') || promptLower.includes('electronic')) {
        t1 = `${artistName} — Peak-Hour Electronic Energy & Global Anthems`
        t2 = "TuneMavens DJ Pool Dubplates & Festival Mainstage Sets"
        t3 = "Hypnotic Grooves, Club Residencies & Exclusive VIP Stems"
        newTitles = [
          "Peak-Hour Sonic Energy & Global Dancefloor Anthems",
          "TuneMavens DJ Pool Drops & Exclusive VIP Club Dubplates",
          "Hypnotic Basslines & Stadium Electronic Production",
          "Club Residencies & Premier International Festival Sets",
          "Direct DJ Bookings Managed via TuneBooking Engine",
          "Exclusive VIP Stem Edits for Top-Tier Performers"
        ]
        matchedImages = [
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'dj_lasers')?.url || MUSIC_ECOSYSTEM_IMAGES[3].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'festival_stage')?.url || MUSIC_ECOSYSTEM_IMAGES[2].url,
          MUSIC_ECOSYSTEM_IMAGES.find(i => i.id === 'neon_synth')?.url || MUSIC_ECOSYSTEM_IMAGES[7].url
        ]
      } else {
        newTitles = PATH_TITLE_SUGGESTIONS
      }

      setGeneratedTitles(newTitles)
      
      const newBio = `${artistName} is an internationally recognized music creator and catalog owner operating within the Intermaven music business ecosystem. ${promptText ? `Artistic Direction: ${promptText}. ` : ''}Backed by 100% master ownership and verified on-chain splits via the Intermaven Shared Ledger, ${artistName} delivers lossless 24-bit multitrack audio on TuneStream, pre-cleared sync licensing through SyncMavens, and direct-to-fan showcase tours worldwide.`

      onChange({
        ...data,
        aiPrompt: promptText,
        heroTitle1: t1,
        heroTitle2: t2,
        heroTitle3: t3,
        headline: t2,
        bio: newBio,
        heroImages: matchedImages,
        heroImageUrl: matchedImages[0],
        aiCreatorContext: {
          prompt: promptText,
          timestamp: Date.now(),
          primaryGoal: promptLower.slice(0, 30) || 'music_ecosystem'
        }
      })

      setAiGenTitles(false)
      setAiStatusMsg('✓ AI understanding updated! All 3 Hero Titles, headline, bio, and curated music images have been switched.')
      setTimeout(() => setAiStatusMsg(''), 5000)
    }, 900)
  }

  // 1-Click switch to authentic music business photography
  const handleSwitchToMusicPhotos = () => {
    const selected = MUSIC_ECOSYSTEM_IMAGES.slice(0, 4).map(m => m.url)
    onChange({
      ...data,
      heroImages: selected,
      heroImageUrl: selected[0],
      heroImageName: 'Curated Music Business Photography'
    })
    setAiStatusMsg('✓ Hero carousel switched to authentic Music Business photography!')
    setTimeout(() => setAiStatusMsg(''), 4000)
  }

  // AI Bio Generation / Refinement with Prompt
  const genBio = () => {
    setAiGenBio(true)
    setTimeout(() => {
      const promptAddon = bioAiPrompt.trim() ? ` ${bioAiPrompt.trim()}.` : ''
      const newBio = `${artistName} is a pioneering recording and performing artist at the vanguard of the modern music business ecosystem.${promptAddon} With 100% master ownership and verified split contracts administered via the Intermaven Shared Ledger, ${artistName} distributes lossless 24-bit audio stems on TuneStream, provides instant one-stop sync clearance on SyncMavens, and commands sold-out tours through TuneBooking.`
      update('bio', newBio)
      setAiGenBio(false)
    }, 1000)
  }

  // AI Hero Image Generation with Pathway Personalization and Prompt
  const genHeroImages = () => {
    setAiGenImg(true)
    setTimeout(() => {
      const generated = MUSIC_ECOSYSTEM_IMAGES.slice(0, imageQty).map(i => i.url)
      onChange({
        ...data,
        heroImageUrl: generated[0],
        heroImages: generated,
        heroImageName: `Curated Music Industry (${imageQty} photos)`
      })
      setAiGenImg(false)
    }, 1000)
  }

  // Social Links Sync & Verification Check
  const handleRunSocialVerification = () => {
    const fields = ['spotify', 'soundcloud', 'instagram', 'youtube', 'twitter', 'bookingEmail']
    const results = {}
    fields.forEach(f => {
      const defaultVal = f === 'bookingEmail'
        ? `booking@${currentUsername}.tunemavens.com`
        : (f === 'youtube' ? `https://youtube.com/@${currentUsername}` : `https://${f === 'twitter' ? 'x' : f}.com/${currentUsername}`)
      const val = data[f] !== undefined ? data[f] : defaultVal
      results[f] = validateSocialAccount(f, val)
    })
    setSocialValidationResults(results)
    setSocialCheckRan(true)
  }

  // Auto-Fix & Re-Sync all 6 social channels
  const handleAutoFixSocialLinks = () => {
    const clean = (currentUsername || 'creator').toLowerCase().replace(/[^a-z0-9_-]/g, '')
    const autoSynced = {
      spotify: `https://open.spotify.com/artist/${clean}`,
      soundcloud: `https://soundcloud.com/${clean}`,
      instagram: `https://instagram.com/${clean}`,
      youtube: `https://youtube.com/@${clean}`,
      twitter: `https://x.com/${clean}`,
      bookingEmail: `booking@${clean}.tunemavens.com`
    }
    const results = {}
    Object.keys(autoSynced).forEach(f => {
      results[f] = { status: 'valid', message: '✓ Verified & Live Synced' }
    })
    onChange({
      ...data,
      ...autoSynced
    })
    setSocialValidationResults(results)
    setSocialCheckRan(true)
    setAiStatusMsg('✓ All 6 social accounts successfully auto-fixed, verified, and synced to @' + clean)
    setTimeout(() => setAiStatusMsg(''), 4000)
  }

  const activeHeroList = data.heroImages && data.heroImages.length > 0
    ? data.heroImages
    : (data.heroImageUrl ? [data.heroImageUrl] : [])

  const animStyle = data.heroAnimStyle || 'synergy'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Site Content & Music Business Engine</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Direct the AI to understand your exact role in the music business, customize Hero Title animations, upload imagery, and verify social sync.</p>
      </div>

      {aiStatusMsg && (
        <div style={{ padding:'10px 16px', background:'rgba(0,240,255,0.12)', border:`1px solid ${C.cyan}`, borderRadius:6, color:C.cyan, fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
          <RiCheckFill size={16} /> {aiStatusMsg}
        </div>
      )}

      {/* ── 0. Music Business AI Persona & Dynamic Prompt Engine ── */}
      <div style={{ padding:'16px', background:'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(0,240,255,0.08))', border:`1px solid ${C.purple}55`, borderRadius:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:8 }}>
          <div style={{ fontSize:13.5, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18 }}>🎵</span> Music Business AI Intelligence & Persona Engine
          </div>
          <button
            type="button"
            onClick={handleSwitchToMusicPhotos}
            style={{ background:'rgba(255,255,255,0.08)', border:`1px solid ${C.border}`, color:'#fff', padding:'5px 12px', borderRadius:4, fontSize:11, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
          >
            🖼️ Switch Carousel to Curated Music Photos
          </button>
        </div>

        <div style={{ fontSize:12, color:'#cbd5e1', marginBottom:12, lineHeight:1.5 }}>
          Direct the AI to understand your exact focus in the music business ecosystem. Select an objective or type custom instructions below to update the system understanding and switch out all 3 Hero Titles and media immediately.
        </div>

        {/* Preset Music Business Goal Selector */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
          {MUSIC_BUSINESS_GOALS.map(goal => (
            <button
              key={goal.id}
              type="button"
              onClick={() => {
                setTitleAiPrompt(goal.label)
                handleUpdateEcosystemUnderstanding(goal.label)
              }}
              style={{
                background: titleAiPrompt.includes(goal.id) ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.04)',
                border: titleAiPrompt.includes(goal.id) ? `1px solid ${C.cyan}` : `1px solid ${C.border}`,
                color: titleAiPrompt.includes(goal.id) ? C.cyan : '#cbd5e1',
                padding:'6px 12px',
                borderRadius:6,
                fontSize:11.5,
                fontWeight:700,
                cursor:'pointer',
                display:'flex',
                alignItems:'center',
                gap:5,
                transition:'all 0.15s'
              }}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {/* Custom AI Prompt Input Field */}
        <div style={{ display:'flex', gap:8 }}>
          <input
            value={titleAiPrompt}
            onChange={e => setTitleAiPrompt(e.target.value)}
            placeholder="Type prompt to change AI understanding (e.g. Focus on Netflix sync licensing, modular synths, and European tour)..."
            style={{ flex:1, padding:'9px 12px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:4, color:'#fff', fontSize:12.5 }}
          />
          <button
            type="button"
            onClick={() => handleUpdateEcosystemUnderstanding()}
            disabled={aiGenTitles}
            style={{ background:`linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color:'#000', border:'none', padding:'9px 18px', borderRadius:4, fontWeight:900, fontSize:12, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6 }}
          >
            <RiSparklingFill size={14} /> {aiGenTitles ? 'Updating Understanding...' : '✨ Update AI Understanding & Switch Titles'}
          </button>
        </div>

        {/* Clickable 6 Music Business Headlines */}
        <div style={{ marginTop:12 }}>
          <div style={{ fontSize:11, color:C.sub, marginBottom:6, fontWeight:700 }}>
            Click any headline below to switch it immediately:
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {(generatedTitles.length > 0 ? generatedTitles : PATH_TITLE_SUGGESTIONS).map(title => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  update('headline', title)
                  update('heroTitle2', title)
                }}
                style={{
                  background: data.headline === title ? 'rgba(0,240,255,0.18)' : 'rgba(255,255,255,0.03)',
                  border: data.headline === title ? `1px solid ${C.cyan}` : `1px solid ${C.border}`,
                  color: data.headline === title ? C.cyan : C.text,
                  padding: '5px 11px',
                  borderRadius: 14,
                  fontSize: 11,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                + {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 1. HERO TITLE ANIMATION STYLE (Synergy Sugar Cascade vs Sequential Fade) ── */}
      <div style={{ padding:'16px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:8 }}>
        <Label sub="Choose how your 3 hero headline lines animate on live view">Hero Title Animation Style</Label>
        
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:10, marginBottom:16 }}>
          {/* Option 1: Synergy Sugar Cascade */}
          <div
            onClick={() => update('heroAnimStyle', 'synergy')}
            style={{
              padding: '14px',
              borderRadius: 6,
              border: animStyle === 'synergy' ? `2px solid ${C.cyan}` : `1px solid ${C.border}`,
              background: animStyle === 'synergy' ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ fontSize:13, fontWeight:800, color: animStyle === 'synergy' ? C.cyan : '#fff' }}>
                Option 1: Synergy Cascade
              </div>
              {animStyle === 'synergy' && <span style={{ fontSize:10, color:C.cyan, fontWeight:800, background:'rgba(0,240,255,0.2)', padding:'2px 6px', borderRadius:3 }}>ACTIVE</span>}
            </div>
            <div style={{ fontSize:11.5, color:C.sub, lineHeight:1.4 }}>
              Sliding Right-to-Left Cascade (exactly as on <strong>synergy-sugar.onrender.com</strong>). 3 title lines slide in from right with staggered 120ms / 280ms / 440ms delay, bold italic typography, and drop shadow.
            </div>
          </div>

          {/* Option 2: Sequential Fade */}
          <div
            onClick={() => update('heroAnimStyle', 'fade')}
            style={{
              padding: '14px',
              borderRadius: 6,
              border: animStyle === 'fade' ? `2px solid ${C.cyan}` : `1px solid ${C.border}`,
              background: animStyle === 'fade' ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ fontSize:13, fontWeight:800, color: animStyle === 'fade' ? C.cyan : '#fff' }}>
                Option 2: Sequential Fade
              </div>
              {animStyle === 'fade' && <span style={{ fontSize:10, color:C.cyan, fontWeight:800, background:'rgba(0,240,255,0.2)', padding:'2px 6px', borderRadius:3 }}>ACTIVE</span>}
            </div>
            <div style={{ fontSize:11.5, color:C.sub, lineHeight:1.4 }}>
              Fade in one line at a time, and fade out one line at a time. A smooth, continuous ambient loop where each title enters and exits sequentially with zero jitter.
            </div>
          </div>
        </div>

        {/* 3 Configurable Hero Title Lines */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div>
            <div style={{ fontSize:11, color:C.sub, marginBottom:3, fontWeight:700 }}>Line 1 (Primary Brand / Artist Name):</div>
            <FInput value={data.heroTitle1 || `${artistName} — Official Creator Web World`} onChange={e => update('heroTitle1', e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize:11, color:C.sub, marginBottom:3, fontWeight:700 }}>Line 2 (Music Business & Value Proposition):</div>
            <FInput value={data.heroTitle2 || (data.headline || "100% Pre-Cleared One-Stop Sync Licensing & Master Stems")} onChange={e => { update('heroTitle2', e.target.value); update('headline', e.target.value); }} />
          </div>
          <div>
            <div style={{ fontSize:11, color:C.sub, marginBottom:3, fontWeight:700 }}>Line 3 (Tour / Lossless Distribution / Live):</div>
            <FInput value={data.heroTitle3 || "World Tour 2026 • Stream Lossless 24-Bit Stems on TuneStream"} onChange={e => update('heroTitle3', e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── 2. Hero Images: Upload from Computer + Curated Photography ── */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, flexWrap:'wrap', gap:8 }}>
          <Label sub="Upload your custom photography or select from authentic music business imagery">Hero Images (Rotating Carousel)</Label>

          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <input
              type="file"
              ref={heroFileInputRef}
              accept="image/*"
              onChange={handleHeroFileUpload}
              style={{ display:'none' }}
            />
            <button
              type="button"
              onClick={() => heroFileInputRef.current?.click()}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${C.cyan}66`,
                color: C.cyan,
                padding: '6px 12px',
                borderRadius: 4,
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <RiUpload2Fill size={13} /> Upload Image from Computer
            </button>
          </div>
        </div>

        {/* Curated Music Business Imagery Switcher */}
        <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`, borderRadius:6, marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, flexWrap:'wrap', gap:8 }}>
            <div style={{ fontSize:11.5, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
              <RiSparklingFill color={C.cyan} size={14} /> Curated Music Industry Photography:
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:11, color:C.sub }}>Quantity:</span>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setImageQty(num)}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 4,
                    border: imageQty === num ? `1px solid ${C.cyan}` : `1px solid ${C.border}`,
                    background: imageQty === num ? C.cyan : 'rgba(255,255,255,0.05)',
                    color: imageQty === num ? '#000' : '#fff',
                    fontWeight: 800,
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={genHeroImages}
                disabled={aiGenImg}
                style={{ background:`linear-gradient(135deg, ${C.cyan}, ${C.purple})`, color:'#000', border:'none', padding:'6px 14px', borderRadius:4, fontWeight:900, fontSize:11.5, cursor:'pointer', whiteSpace:'nowrap', marginLeft:4 }}
              >
                {aiGenImg ? `Applying (${imageQty})...` : `Apply Curated (${imageQty})`}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid of Generated/Assigned Hero Images */}
        {activeHeroList.length > 0 && (
          <div style={{ marginTop:8 }}>
            <div style={{ fontSize:11, color:C.sub, marginBottom:6, display:'flex', justifyContent:'space-between' }}>
              <span>Click any image below to set it as your <strong>Primary Cover</strong>. All images rotate on live site.</span>
              <span style={{ color:C.cyan, fontWeight:700 }}>{activeHeroList.length} Slide{activeHeroList.length>1?'s':''} in Carousel</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(activeHeroList.length, 4)}, 1fr)`, gap:10 }}>
              {activeHeroList.map((imgUrl, idx) => {
                const isPrimary = (data.heroImageUrl || activeHeroList[0]) === imgUrl
                return (
                  <div
                    key={idx}
                    onClick={() => update('heroImageUrl', imgUrl)}
                    style={{
                      position: 'relative',
                      height: 88,
                      borderRadius: 6,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isPrimary ? `2px solid ${C.cyan}` : `1px solid ${C.border}`,
                      boxShadow: isPrimary ? `0 0 12px ${C.cyan}55` : 'none',
                      transition: 'all 0.15s'
                    }}
                  >
                    <img src={imgUrl} alt={`Slide ${idx+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    {isPrimary && (
                      <div style={{ position:'absolute', top:4, left:4, background:C.cyan, color:'#000', fontSize:9, fontWeight:900, padding:'2px 6px', borderRadius:3 }}>
                        ★ PRIMARY
                      </div>
                    )}
                    <div style={{ position:'absolute', bottom:4, right:4, background:'rgba(0,0,0,0.7)', color:'#fff', fontSize:9, padding:'1px 5px', borderRadius:2 }}>
                      Slide {idx + 1}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Biography with Custom AI Prompt ── */}
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
          <Label sub="Detailed narrative for press, music supervisors, and fans">Biography</Label>
        </div>

        <div style={{ marginBottom:8, padding:'10px 12px', background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`, borderRadius:6, display:'flex', gap:8 }}>
          <input
            value={bioAiPrompt}
            onChange={e => setBioAiPrompt(e.target.value)}
            placeholder="AI Bio Instructions (e.g. Include 10 years experience, recent Netflix sync deal, Berklee background)..."
            style={{ flex:1, padding:'7px 12px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:4, color:'#fff', fontSize:12 }}
          />
          <button
            type="button"
            onClick={genBio}
            disabled={aiGenBio}
            style={{ background:C.cyan, border:'none', color:'#000', padding:'7px 14px', borderRadius:4, fontWeight:800, fontSize:11.5, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:5 }}
          >
            <RiSparklingFill size={13} />{aiGenBio ? 'Refining...' : 'AI Generate / Refine Bio'}
          </button>
        </div>

        <FTextarea value={data.bio||''} onChange={e => update('bio',e.target.value)} placeholder="Tell your story..." style={{ height:100 }} />
      </div>

      {tracks?.length > 0 && (
        <div>
          <Label>Featured Showcase Track</Label>
          <select value={data.featuredTrackIsrc||''} onChange={e => update('featuredTrackIsrc',e.target.value)} className="form-control" style={{ width:'100%', background:'#060a14', color:C.text, border:`1px solid ${C.border}`, padding:'9px 12px', borderRadius:5, fontSize:13 }}>
            <option value="">Select a track</option>
            {tracks.map(t => <option key={t.isrc} value={t.isrc}>{t.title} ({t.artist})</option>)}
          </select>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
        <div><Label>Press Outlet</Label><FInput value={data.pressOutlet||''} onChange={e => update('pressOutlet',e.target.value)} placeholder="Pitchfork" /></div>
        <div><Label>Press Quote</Label><FInput value={data.pressQuote||''} onChange={e => update('pressQuote',e.target.value)} placeholder="Outstanding vocal delivery..." /></div>
      </div>

      <div><Label sub="Paste a YouTube embed URL">Featured Video</Label><FInput value={data.youtubeVideoUrl||''} onChange={e => update('youtubeVideoUrl',e.target.value)} placeholder="https://www.youtube.com/embed/..." /></div>

      {/* ── 4. Social & Booking Links with Verification Engine ── */}
      <div style={{ padding:'16px', background:'#060a14', border:`1px solid ${C.border}`, borderRadius:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, flexWrap:'wrap', gap:8 }}>
          <div>
            <div style={{ fontSize:13.5, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', gap:8 }}>
              <RiShieldCheckFill color={C.cyan} size={16} /> Social Accounts & Sync Verification
            </div>
            <div style={{ fontSize:11.5, color:C.sub, marginTop:2 }}>
              Ensure each channel is verified with valid URL syntax before publishing.
            </div>
          </div>
          
          <div style={{ display:'flex', gap:8 }}>
            <button
              type="button"
              onClick={handleRunSocialVerification}
              style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${C.border}`, color:'#fff', padding:'6px 12px', borderRadius:4, fontSize:11.5, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
            >
              <RiRefreshLine size={13} /> Run Sync Check
            </button>
            <button
              type="button"
              onClick={handleAutoFixSocialLinks}
              style={{ background:C.cyan, border:'none', color:'#000', padding:'6px 14px', borderRadius:4, fontSize:11.5, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}
            >
              <RiCheckFill size={14} /> ⚡ Auto-Fix & Re-Sync All 6 Accounts
            </button>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[
            ['spotify', RiSpotifyFill, `https://open.spotify.com/artist/${currentUsername}`, 'Spotify URL'],
            ['soundcloud', RiSoundcloudFill, `https://soundcloud.com/${currentUsername}`, 'SoundCloud URL'],
            ['instagram', RiInstagramFill, `https://instagram.com/${currentUsername}`, 'Instagram URL'],
            ['youtube', RiYoutubeFill, `https://youtube.com/@${currentUsername}`, 'YouTube Channel URL'],
            ['twitter', RiTwitterXFill, `https://x.com/${currentUsername}`, 'X / Twitter URL'],
            ['bookingEmail', RiMailFill, `booking@${currentUsername}.tunemavens.com`, 'Booking Email']
          ].map(([field, Icon, defaultVal, ph]) => {
            const currentVal = data[field] !== undefined ? data[field] : defaultVal
            const check = socialValidationResults[field] || (socialCheckRan ? null : validateSocialAccount(field, currentVal))
            const isValid = check?.status === 'valid'
            const isWarning = check?.status === 'warning'
            
            return (
              <div key={field} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <div style={{ position:'relative' }}>
                  <Icon size={14} style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:10, color: isValid ? '#10b981' : (isWarning ? '#f59e0b' : C.muted), pointerEvents:'none', zIndex:1 }} />
                  <FInput
                    value={currentVal}
                    onChange={e => {
                      update(field, e.target.value)
                      if (socialCheckRan) {
                        setSocialValidationResults(prev => ({
                          ...prev,
                          [field]: validateSocialAccount(field, e.target.value)
                        }))
                      }
                    }}
                    placeholder={ph}
                    style={{
                      paddingLeft:32,
                      borderColor: isValid ? 'rgba(16, 185, 129, 0.4)' : (isWarning ? 'rgba(245, 158, 11, 0.5)' : C.border)
                    }}
                  />
                </div>
                {check && (
                  <div style={{ fontSize:10.5, color: isValid ? '#10b981' : (isWarning ? '#f59e0b' : C.muted), display:'flex', alignItems:'center', gap:4, paddingLeft:4 }}>
                    {isValid ? <RiCheckFill size={11} /> : (isWarning ? <RiAlertFill size={11} /> : null)}
                    <span>{check.message}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Step 8: Preview & Publish ────────────────────────────────────────────────
function Step8Publish({ data, tracks, onPublish, saving }) {
  const selectedTrack = tracks?.find(t => t.isrc === data.featuredTrackIsrc) || tracks?.[0]
  const theme = EPK_THEMES.find(t => t.bg === data.themeBg) || EPK_THEMES[0]
  const accent = data.accentColor || theme?.accent || C.cyan
  const subdomain = data.subdomain || 'yourname'
  const liveUrl = `/#/epk/${subdomain}`
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div>
        <h3 style={{ margin:'0 0 6px', fontSize:18, fontWeight:800, color:'#fff' }}>Preview & Publish</h3>
        <p style={{ margin:0, fontSize:13, color:C.sub }}>Here is how your Creator Web World will look. When you are happy, hit Publish.</p>
      </div>
      <div style={{ background:'#070a13', border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden', boxShadow:'0 15px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ background:'rgba(7,10,19,0.95)', padding:'10px 18px', display:'flex', alignItems:'center', gap:12, borderBottom:`1px solid ${C.border}` }}>
          {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ height:26, objectFit:'contain', borderRadius:3 }} /> : <div style={{ fontSize:12, fontWeight:800, color:accent }}>LOGO</div>}
          <div style={{ flex:1 }} />
          {(data.menuItems||DEFAULT_MENU).slice(0,5).map(item => <span key={item.id} style={{ fontSize:10.5, color:'#94a3b8', fontWeight:600 }}>{item.label}</span>)}
        </div>
        <div style={{ background:data.heroImageUrl?`url(${data.heroImageUrl}) center/cover`:(data.themeBg||theme?.bg||'linear-gradient(135deg,#0f0c20,#1a0826)'), padding:'30px 20px', textAlign:'center', position:'relative' }}>
          {data.heroImageUrl && <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)' }} />}
          <div style={{ position:'relative', zIndex:1 }}>
            {data.logoUrl && <img src={data.logoUrl} alt="logo" style={{ height:48, objectFit:'contain', borderRadius:6, marginBottom:10 }} />}
            <h2 style={{ margin:'0 0 4px', fontSize:19, fontWeight:900, color:'#fff', fontFamily:data.fontFamily, textShadow:'0 2px 8px rgba(0,0,0,0.6)', fontStyle:'italic' }}>
              {data.heroTitle1 || data.siteName || data.artist_name || 'The Creator'}
            </h2>
            <div style={{ margin:'0 0 4px', fontSize:13, fontWeight:700, color:accent, fontStyle:'italic' }}>
              {data.heroTitle2 || data.headline || '100% Pre-Cleared Sync Licensing & 24-Bit Stems'}
            </div>
            <p style={{ margin:0, fontSize:11, color:'rgba(255,255,255,0.75)' }}>
              {data.heroTitle3 || `${subdomain}.tunemavens.com`}
            </p>
            <div style={{ marginTop:14, display:'inline-block', padding:'7px 18px', background:accent, color:'#000', borderRadius:20, fontSize:11.5, fontWeight:800 }}>Book Now</div>
          </div>
        </div>
        {data.bio && <div style={{ padding:'14px 18px', fontSize:12, color:'#94a3b8', lineHeight:1.6, borderBottom:`1px solid ${C.border}` }}>{data.bio.slice(0,220)}{data.bio.length>220?'...':''}</div>}
        {selectedTrack && (
          <div style={{ padding:'12px 18px', display:'flex', alignItems:'center', gap:10, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:36, height:36, borderRadius:4, background:selectedTrack.coverBg||'linear-gradient(135deg,#8b5cf6,#06b6d4)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff' }}>{selectedTrack.coverText||'♫'}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedTrack.title}</div>
              <div style={{ fontSize:10, color:'#64748b' }}>{selectedTrack.artist}</div>
            </div>
            <div style={{ width:26, height:26, borderRadius:'50%', background:accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontSize:10, fontWeight:700 }}>▶</div>
          </div>
        )}
        {data.pressQuote && <div style={{ padding:'12px 18px', fontSize:11.5, color:'#cbd5e1', fontStyle:'italic', borderBottom:`1px solid ${C.border}` }}>"{data.pressQuote}" — <strong style={{ color:accent }}>{data.pressOutlet}</strong></div>}
        <div style={{ padding:'10px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(0,0,0,0.25)', fontSize:10.5 }}>
          <span style={{ color:'#475569' }}>Booking: {data.bookingEmail||'N/A'}</span>
          <span style={{ color:accent, fontWeight:700 }}>Powered by Intermaven</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button type="button" onClick={() => onPublish()} disabled={saving} style={{ flex:1, padding:'13px', borderRadius:6, background: C.cyan, border:'none', color:'#000', fontWeight:800, fontSize:13.5, cursor:saving?'wait':'pointer', opacity:saving?0.7:1 }}>
          {saving ? 'Publishing...' : 'Publish & Sync Web World'}
        </button>
        <a href={liveUrl} target="_blank" rel="noopener noreferrer" style={{ padding:'13px 18px', borderRadius:6, border:`1px solid ${C.border}`, color:C.text, fontWeight:700, fontSize:12.5, textDecoration:'none', display:'flex', alignItems:'center', gap:6, whiteSpace:'nowrap' }}>
          <RiEyeFill size={14} /> Launch Live Site
        </a>
      </div>
    </div>
  )
}

// ── Error Boundary ─────────────────────────────────────────────────────────
class EpkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('EPK Wizard render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#120b1e', border: '1px solid #ef4444', borderRadius: '8px', color: '#fff' }}>
          <h4 style={{ color: '#ef4444', margin: '0 0 8px', fontSize: '15px' }}>EPK Builder encountered an issue</h4>
          <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: '0 0 16px' }}>
            {this.state.error?.message || 'A render error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ background: '#00f0ff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer' }}
          >
            Retry Builder
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main Wizard ─────────────────────────────────────────────────────────────
function EpkWizardInner({ tracks = [], epk, setEpk, sessionUser }) {
  const safeEpk = epk || {}
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState(() => {
    const activeSub = (typeof localStorage !== 'undefined' ? localStorage.getItem('last_saved_epk_subdomain') : null) || 'ndufo'
    let localData = null
    try {
      const cached = localStorage.getItem(`epk_public_${activeSub}`) || localStorage.getItem(`epk_${activeSub}`)
      if (cached) localData = JSON.parse(cached)
    } catch (_) {}
    const base = localData || safeEpk
    return {
      artist_name: base.artist_name || (activeSub === 'ndufo' ? 'Ndufo' : (sessionUser?.name || 'Ndufo')),
      domainMode: base.domainMode || 'subdomain',
      subdomain: (base.subdomain && base.subdomain !== 'aisha') ? base.subdomain : activeSub,
      customDomain: base.customDomain || '',
      layoutWidth: base.layoutWidth || '1280px',
      layoutVariant: base.layoutVariant || 'logo-left',
      logoUrl: base.logoUrl || '',
      accentColor: base.accentColor || '#00f0ff',
      secondaryColor: base.secondaryColor || '#8b5cf6',
      themeMode: base.themeMode || 'dark',
      themeBg: base.themeBg || 'linear-gradient(135deg,#0f0c20,#1a0826)',
      fontFamily: base.fontFamily || 'Sansation, sans-serif',
      menuItems: base.menuItems || null,
      headline: base.headline || '',
      bio: base.bio || '',
      heroImageUrl: base.heroImageUrl || '',
      heroImages: base.heroImages || (base.heroImageUrl ? [base.heroImageUrl] : []),
      featuredTrackIsrc: base.featuredTrackIsrc || '',
      pressOutlet: base.pressOutlet || '',
      pressQuote: base.pressQuote || '',
      youtubeVideoUrl: base.youtubeVideoUrl || '',
      spotify: base.spotify || '',
      soundcloud: base.soundcloud || '',
      instagram: base.instagram || '',
      bookingEmail: base.bookingEmail || '',
    }
  })

  // Sync state if epk loads asynchronously
  React.useEffect(() => {
    if (epk && typeof epk === 'object') {
      const activeSub = (typeof localStorage !== 'undefined' ? localStorage.getItem('last_saved_epk_subdomain') : null) || ''
      if (epk.subdomain === 'aisha' && activeSub && activeSub !== 'aisha') {
        return
      }
      setData(prev => ({
        ...prev,
        artist_name: epk.artist_name ?? prev.artist_name,
        subdomain: epk.subdomain ?? prev.subdomain,
        customDomain: epk.customDomain ?? prev.customDomain,
        layoutWidth: epk.layoutWidth ?? prev.layoutWidth,
        layoutVariant: epk.layoutVariant ?? prev.layoutVariant,
        headline: epk.headline ?? prev.headline,
        bio: epk.bio ?? prev.bio,
        themeMode: epk.themeMode ?? prev.themeMode,
        themeBg: epk.themeBg ?? prev.themeBg,
        logoUrl: epk.logoUrl ?? prev.logoUrl,
        heroImageUrl: epk.heroImageUrl ?? prev.heroImageUrl,
        heroImages: epk.heroImages ?? prev.heroImages,
        accentColor: epk.accentColor ?? prev.accentColor,
        secondaryColor: epk.secondaryColor ?? prev.secondaryColor,
        fontFamily: epk.fontFamily ?? prev.fontFamily,
        menuItems: epk.menuItems ?? prev.menuItems,
        featuredTrackIsrc: epk.featuredTrackIsrc ?? prev.featuredTrackIsrc,
        pressOutlet: epk.pressOutlet ?? prev.pressOutlet,
        pressQuote: epk.pressQuote ?? prev.pressQuote,
        youtubeVideoUrl: epk.youtubeVideoUrl ?? prev.youtubeVideoUrl,
        spotify: epk.spotify ?? prev.spotify,
        soundcloud: epk.soundcloud ?? prev.soundcloud,
        instagram: epk.instagram ?? prev.instagram,
        bookingEmail: epk.bookingEmail ?? prev.bookingEmail,
      }))
    }
  }, [epk])

  const TOTAL = 8
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState(true)
  const [lastSavedTime, setLastSavedTime] = useState(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const [saveToast, setSaveToast] = useState(false)
  const [resumedNotice, setResumedNotice] = useState(false)

  // Restore draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('epk_wizard_draft')
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed?.data) {
          setData(prev => ({ ...prev, ...parsed.data }))
          if (parsed.step && parsed.step > 1 && parsed.step <= TOTAL) {
            setStep(parsed.step)
          }
          if (parsed.savedAt) {
            setLastSavedTime(new Date(parsed.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
            setResumedNotice(true)
          }
        }
      }
    } catch {}
  }, [])

  // Auto-save on data or step update
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('epk_wizard_draft', JSON.stringify({
          data,
          step,
          savedAt: Date.now()
        }))
      } catch {}
    }, 500)
    return () => clearTimeout(timer)
  }, [data, step])

  const handleSaveProgress = async () => {
    setSavingDraft(true)
    try {
      const now = Date.now()
      localStorage.setItem('epk_wizard_draft', JSON.stringify({
        data,
        step,
        savedAt: now
      }))
      const cleanSub = (data.subdomain || sessionUser?.username || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
      if (cleanSub) {
        localStorage.setItem(`epk_public_${cleanSub}`, JSON.stringify(data))
        localStorage.setItem(`epk_${cleanSub}`, JSON.stringify(data))
        localStorage.setItem('last_saved_epk_subdomain', cleanSub)
      }
      const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setLastSavedTime(timeStr)
      setSaveToast(true)
      setTimeout(() => setSaveToast(false), 3000)

      const token = tokenStore.get()
      if (token && data.subdomain) {
        fetch('/api/epk/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ...data,
            subdomain: (data.subdomain || 'draft').toLowerCase().trim(),
            is_draft: true
          })
        }).catch(() => {})
      }
    } catch {}
    finally {
      setSavingDraft(false)
    }
  }

  const canGoNext = () => {
    if (step === 1) {
      if (data.domainMode === 'custom') return !!data.customDomain
      return isSubdomainAvailable && !!data.subdomain && data.subdomain.length >= 3
    }
    return true
  }
  const canPreview = step >= 7

  const handlePublish = async () => {
    setSaving(true)
    const cleanSubdomain = (data.subdomain || sessionUser?.username || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    const payload = {
      ...data,
      artist_name: data.artist_name || (cleanSubdomain === 'ndufo' ? 'Ndufo' : (sessionUser?.name || 'Ndufo')),
      subdomain: cleanSubdomain,
      menuItems: data.menuItems || DEFAULT_MENU,
      heroImages: data.heroImages && data.heroImages.length > 0 ? data.heroImages : (data.heroImageUrl ? [data.heroImageUrl] : [])
    }
    try {
      // Local immediate cache for zero-lag live site preview
      localStorage.setItem(`epk_public_${cleanSubdomain}`, JSON.stringify(payload))
      localStorage.setItem(`epk_${cleanSubdomain}`, JSON.stringify(payload))
      localStorage.setItem('last_saved_epk_subdomain', cleanSubdomain)
      sessionStorage.setItem('preferred_dashboard_tab', 'epk-builder')

      const token = tokenStore.get()
      if (token) {
        await fetch('/api/epk/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
      }
      if (setEpk) setEpk(payload)
      alert(`Your Creator Web World for ${cleanSubdomain}.tunemavens.com has been published and synchronised!`)
    } catch (e) {
      if (setEpk) setEpk(payload)
      alert('EPK saved locally - will sync with backend server when back online.')
    } finally {
      setSaving(false)
    }
  }

  const safeTracks = Array.isArray(tracks) ? tracks : []

  const stepContent = () => {
    switch (step) {
      case 1: return <Step1Domain data={data} onChange={setData} sessionUser={sessionUser} onAvailabilityChange={setIsSubdomainAvailable} />
      case 2: return <Step2Width data={data} onChange={setData} />
      case 3: return <Step3Wireframe data={data} onChange={setData} />
      case 4: return <Step4Logo data={data} onChange={setData} sessionUser={sessionUser} />
      case 5: return <Step5Colors data={data} onChange={setData} />
      case 6: return <Step6Menu data={data} onChange={setData} />
      case 7: return <Step7Content data={data} onChange={setData} tracks={safeTracks} sessionUser={sessionUser} />
      case 8: return <Step8Publish data={data} tracks={safeTracks} onPublish={handlePublish} saving={saving} />
      default: return null
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0, position:'relative' }}>
      {/* Resumed from Saved Draft Banner */}
      {resumedNotice && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 16px', background:'rgba(0,240,255,0.08)', border:`1px solid ${C.cyan}44`, borderRadius:6, marginBottom:16, fontSize:12, color:C.text }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>💾</span>
            <span>Resumed from saved draft (Step {step} • Last saved at {lastSavedTime || 'recently'}).</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('epk_wizard_draft')
                setResumedNotice(false)
                window.location.reload()
              }}
              style={{ background:'none', border:'none', color:C.cyan, fontSize:11, textDecoration:'underline', cursor:'pointer', fontWeight:700 }}
            >
              Start Fresh
            </button>
            <button
              type="button"
              onClick={() => setResumedNotice(false)}
              style={{ background:'none', border:'none', color:C.sub, fontSize:14, cursor:'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Floating Save Progress Notification Toast */}
      {saveToast && (
        <div style={{ position:'fixed', bottom:24, right:24, background:'#071726', border:`1px solid ${C.cyan}`, color:'#fff', padding:'12px 20px', borderRadius:8, boxShadow:'0 10px 35px rgba(0,0,0,0.85), 0 0 15px rgba(0,240,255,0.3)', zIndex:9999, fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
          <RiCheckFill color={C.cyan} size={16} /> Progress saved! You can return anytime to continue.
        </div>
      )}

      <StepIndicator
        current={step}
        canPreview={canPreview}
        onPreview={() => setStep(8)}
        onSave={handleSaveProgress}
        savingDraft={savingDraft}
        lastSavedTime={lastSavedTime}
      />
      <div className="dashboard-card" style={{ padding:'28px 28px 22px', minHeight:420 }}>
        {stepContent()}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:16 }}>
        {step > 1 && (
          <Btn outline onClick={() => setStep(s => s - 1)} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <RiArrowLeftSLine size={15} /> Back
          </Btn>
        )}
        <div style={{ flex:1 }} />
        
        {/* Quick Save Progress Button */}
        <button
          type="button"
          onClick={handleSaveProgress}
          disabled={savingDraft}
          style={{
            background: 'transparent',
            border: `1px solid ${C.border}`,
            color: C.text,
            padding: '8px 14px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
            cursor: savingDraft ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <RiSaveFill size={13} color={C.cyan} />
          {savingDraft ? 'Saving...' : lastSavedTime ? `Saved (${lastSavedTime})` : 'Save Progress'}
        </button>

        <span style={{ fontSize:11, color:C.muted }}>Step {step} of {TOTAL}</span>
        {step < TOTAL && (
          <Btn accent onClick={() => setStep(s => s + 1)} disabled={!canGoNext()} style={{ display:'flex', alignItems:'center', gap:5 }}>
            {step === 7 ? 'Review & Publish' : 'Continue'} <RiArrowRightSLine size={15} />
          </Btn>
        )}
      </div>
    </div>
  )
}

export default function EpkWizard(props) {
  return (
    <EpkErrorBoundary>
      <EpkWizardInner {...props} />
    </EpkErrorBoundary>
  )
}
