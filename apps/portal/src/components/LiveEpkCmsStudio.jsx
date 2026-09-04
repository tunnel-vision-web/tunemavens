import React, { useState, useEffect, useRef } from 'react'
import {
  RiCloseFill, RiSave3Fill, RiHistoryLine, RiSparklingFill,
  RiBold, RiItalic, RiUnderline, RiStrikethrough, RiH2, RiH3,
  RiListUnordered, RiListOrdered, RiDoubleQuotesL, RiLink,
  RiImageAddFill, RiCodeBoxFill, RiEyeFill, RiAddLine,
  RiDeleteBin6Line, RiCheckFill, RiAlertFill, RiRefreshLine,
  RiLayoutMasonryFill, RiMusic2Fill, RiMovieFill, RiCalendarEventFill,
  RiShoppingBag3Fill, RiFileTextFill, RiMailFill, RiPaletteFill, RiArrowRightSLine
} from 'react-icons/ri'

const CMS_TABS = [
  { id: 'brand',    label: 'Brand & Header', icon: RiPaletteFill },
  { id: 'hero',     label: 'Hero & Titles',  icon: RiLayoutMasonryFill },
  { id: 'bio',      label: 'Rich Bio Editor',icon: RiFileTextFill },
  { id: 'music',    label: 'Singles & Stems',icon: RiMusic2Fill },
  { id: 'media',    label: 'Videos & Photos',icon: RiMovieFill },
  { id: 'shows',    label: 'Tour & Shows',   icon: RiCalendarEventFill },
  { id: 'store',    label: 'Store & Merch',  icon: RiShoppingBag3Fill },
  { id: 'press',    label: 'Press & EPK',    icon: RiFileTextFill },
  { id: 'contact',  label: 'Contact & CRM',  icon: RiMailFill },
]

export default function LiveEpkCmsStudio({
  isOpen,
  onClose,
  epkData,
  onUpdateEpk,
  artistSlug
}) {
  const [activeTab, setActiveTab] = useState('brand')
  const [formData, setFormData] = useState({ ...(epkData || {}) })
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Rich Text Editor State
  const [htmlMode, setHtmlMode] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (epkData) {
      setFormData({ ...(epkData || {}) })
    }
  }, [epkData])

  // Sync editor content when bio changes or tab opens
  useEffect(() => {
    if (activeTab === 'bio' && editorRef.current && !htmlMode) {
      editorRef.current.innerHTML = formData.bio || ''
    }
  }, [activeTab, htmlMode])

  if (!isOpen) return null

  const updateField = (field, value) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    // Live update parent view so creator immediately sees changes
    if (onUpdateEpk) {
      onUpdateEpk(updated)
    }
  }

  // Execute Rich Text Command
  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      updateField('bio', html)
    }
  }

  // Fetch Initial CMS Layout from Backend Mother-CMS
  useEffect(() => {
    if (artistSlug && isOpen) {
      const loadCmsLayout = async () => {
        try {
          const res = await fetch(`/api/cms/epk/${artistSlug}`)
          if (res.ok) {
            const layout = await res.json()
            if (layout.data) {
              setFormData(prev => ({ ...prev, ...layout.data }))
              if (onUpdateEpk) onUpdateEpk({ ...(epkData || {}), ...layout.data })
            }
          }
        } catch (err) {
          console.warn('Backend CMS fetch error:', err)
        }
      }
      loadCmsLayout()
    }
  }, [artistSlug, isOpen])

  const handlePromptAiBio = async () => {
    try {
      const res = await fetch('/api/cms/epk/bio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_name: formData.artist_name || artistSlug,
          focus: 'sync',
          custom_prompt: formData.headline || 'Afro-Synth Pioneer & Multitrack Producer'
        })
      })
      if (res.ok) {
        const result = await res.json()
        if (result.html_bio) {
          updateField('bio', result.html_bio)
          if (editorRef.current) editorRef.current.innerHTML = result.html_bio
          return
        }
      }
    } catch (err) {
      console.warn('Backend AI Bio error, falling back:', err)
    }
    const aiNarrative = `<h2>About ${formData.artist_name || 'The Creator'}</h2>
<p>${formData.artist_name || 'The Artist'} is an innovative recording artist, music producer, and sync composer pioneering modern sound design across the global music business ecosystem.</p>
<blockquote>"A singular sonic architect redefining modern sync placement and master rights ownership." — <em>Billboard & SyncMavens</em></blockquote>
<h3>Master Rights & Lossless Catalog</h3>
<p>Holding 100% master ownership with 24-Bit / 96kHz lossless multitrack stems streaming exclusively via <strong>TuneStream</strong>. All commercial releases are pre-cleared for one-stop television, gaming, and cinematic sync clearance with automated split distributions through Intermaven.</p>
<ul>
  <li>Over 8.4M+ Global Catalog Streams</li>
  <li>14 Pre-Cleared Sync Placements in Film, TV & Streaming</li>
  <li>World Tour Dates & VIP Fan Club Direct Access</li>
</ul>`
    updateField('bio', aiNarrative)
    if (editorRef.current) {
      editorRef.current.innerHTML = aiNarrative
    }
  }

  // Save to backend Mother-CMS
  const handleSaveAndPublish = async () => {
    setSaving(true)
    setStatusMsg('')
    try {
      const res = await fetch(`/api/cms/epk/${artistSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData })
      })
      if (res.ok) {
        const saved = await res.json()
        const savedData = saved.data || formData
        localStorage.setItem(`epk_public_${artistSlug}`, JSON.stringify(savedData))
        localStorage.setItem(`epk_${artistSlug}`, JSON.stringify(savedData))
        setStatusMsg(`✓ Published to Mother-CMS snapshot v${saved.version || 1}!`)
        if (onUpdateEpk) onUpdateEpk(savedData)
        setTimeout(() => setStatusMsg(''), 4000)
      } else {
        setStatusMsg('⚠️ Error saving to backend. Local changes active.')
      }
    } catch (err) {
      console.warn('Backend save error:', err)
      localStorage.setItem(`epk_public_${artistSlug}`, JSON.stringify(formData))
      setStatusMsg('✓ Local layout updated (Network offline).')
      setTimeout(() => setStatusMsg(''), 4000)
    } finally {
      setSaving(false)
    }
  }

  // Fetch Snapshot History from Mother-CMS
  const fetchSnapshots = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/cms/epk/${artistSlug}/history`)
      if (res.ok) {
        const list = await res.json()
        setHistoryList(list || [])
      }
    } catch (err) {
      console.warn('History fetch error:', err)
    } finally {
      setHistoryLoading(false)
      setShowHistory(true)
    }
  }

  const handleRollbackSnapshot = async (version) => {
    if (!window.confirm(`Rollback to snapshot v${version}? Any unsaved changes will be replaced.`)) return
    setSaving(true)
    try {
      const res = await fetch(`/api/cms/epk/${artistSlug}/rollback/${version}`, { method: 'POST' })
      if (res.ok) {
        const restored = await res.json()
        const restoredData = restored.data || restored
        setFormData(restoredData)
        if (onUpdateEpk) onUpdateEpk(restoredData)
        localStorage.setItem(`epk_public_${artistSlug}`, JSON.stringify(restoredData))
        setShowHistory(false)
        setStatusMsg(`✓ Successfully rolled back to Mother-CMS snapshot v${version}`)
        setTimeout(() => setStatusMsg(''), 4000)
      }
    } catch (err) {
      console.error('Rollback error:', err)
      setStatusMsg('⚠️ Failed to roll back snapshot.')
    } finally {
      setSaving(false)
    }
  }

  const accent = formData.accentColor || '#00f0ff'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '680px',
      background: 'rgba(6, 9, 20, 0.98)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(0, 240, 255, 0.3)',
      boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.8)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* ── Studio Header ── */}
      <div style={{
        padding: '16px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(3, 5, 12, 0.95)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: `linear-gradient(135deg, ${accent}, #8b5cf6)`,
            color: '#000',
            fontWeight: 900,
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '3px',
            letterSpacing: '0.5px'
          }}>
            ⚡ MOTHER-CMS
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
            Live EPK Studio: <span style={{ color: accent }}>{formData.artist_name || artistSlug}</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={fetchSnapshots}
            title="View Snapshot History & Rollbacks"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <RiHistoryLine /> Rollback
          </button>
          <button
            type="button"
            onClick={handleSaveAndPublish}
            disabled={saving}
            style={{ background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, border: 'none', color: '#000', padding: '7px 15px', borderRadius: '3px', fontWeight: 900, fontSize: '0.82rem', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 0 12px ${accent}66` }}
          >
            <RiSave3Fill /> {saving ? 'Publishing...' : 'Save & Publish'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <RiCloseFill />
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '8px 20px', background: statusMsg.includes('✓') ? 'rgba(0,255,128,0.15)' : 'rgba(255,180,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: statusMsg.includes('✓') ? '#00ff80' : '#fbbf24', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          {statusMsg}
        </div>
      )}

      {/* ── Tabs Navigation ── */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        background: '#04060d',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        scrollbarWidth: 'none',
        flexShrink: 0
      }}>
        {CMS_TABS.map(tab => {
          const Icon = tab.icon
          const isSelected = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isSelected ? 'rgba(0,240,255,0.08)' : 'transparent',
                border: 'none',
                borderBottom: isSelected ? `2px solid ${accent}` : '2px solid transparent',
                color: isSelected ? accent : '#94a3b8',
                padding: '10px 14px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={14} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Studio Body ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '22px' }}>
        
        {/* TAB: BRAND & HEADER */}
        {activeTab === 'brand' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Artist / Brand Name
              </label>
              <input
                type="text"
                value={formData.artist_name || ''}
                onChange={e => updateField('artist_name', e.target.value)}
                placeholder="e.g. Kip & The Mavens"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Site Tagline (SEO & Page Headers)
              </label>
              <input
                type="text"
                value={formData.headline || ''}
                onChange={e => updateField('headline', e.target.value)}
                placeholder="e.g. Official Standalone Creator Web World • 24-Bit Stems"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Brand Logo Image URL
              </label>
              <input
                type="text"
                value={formData.logoUrl || ''}
                onChange={e => updateField('logoUrl', e.target.value)}
                placeholder="https://... or upload in builder"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                When logo is set, it replaces the text name in the top navigation header.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Primary Accent Color
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.accentColor || '#00f0ff'}
                    onChange={e => updateField('accentColor', e.target.value)}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '3px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={formData.accentColor || '#00f0ff'}
                    onChange={e => updateField('accentColor', e.target.value)}
                    style={{ flex: 1, padding: '8px 10px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Secondary Accent Color
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.secondaryColor || '#ff007f'}
                    onChange={e => updateField('secondaryColor', e.target.value)}
                    style={{ width: '40px', height: '38px', border: 'none', borderRadius: '3px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || '#ff007f'}
                    onChange={e => updateField('secondaryColor', e.target.value)}
                    style={{ flex: 1, padding: '8px 10px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Layout Width
                </label>
                <select
                  value={formData.layoutWidth || 'wide'}
                  onChange={e => updateField('layoutWidth', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                >
                  <option value="wide">Wide (1280px Constrained)</option>
                  <option value="boxed">Boxed (960px)</option>
                  <option value="full">Fluid Full Viewport</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Layout Variant
                </label>
                <select
                  value={formData.layoutVariant || 'logo-left'}
                  onChange={e => updateField('layoutVariant', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.88rem' }}
                >
                  <option value="logo-left">Standard Wide Layout</option>
                  <option value="aside-left">Aside Column on Left</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HERO & TITLES */}
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(0, 240, 255, 0.05)', border: `1px solid ${accent}33`, borderRadius: '4px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: accent, marginBottom: '4px' }}>
                Music Business 3-Line Hero Titles
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                These 3 lines cascade on the live hero banner using the selected animation engine.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Line 1: Artist / Brand Identity
              </label>
              <input
                type="text"
                value={formData.heroTitle1 || ''}
                onChange={e => updateField('heroTitle1', e.target.value)}
                placeholder="e.g. Kip & The Mavens — Broadcast Sync & Master Catalog"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Line 2: Value Proposition / Punchline
              </label>
              <input
                type="text"
                value={formData.heroTitle2 || ''}
                onChange={e => updateField('heroTitle2', e.target.value)}
                placeholder="e.g. 100% Pre-Cleared One-Stop Sync Licensing on SyncMavens"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Line 3: Lossless Catalog & Stems
              </label>
              <input
                type="text"
                value={formData.heroTitle3 || ''}
                onChange={e => updateField('heroTitle3', e.target.value)}
                placeholder="e.g. Instrumental Cues, 24-Bit WAV Stems & Automated PRO Splits"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Title Animation Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  onClick={() => updateField('heroAnimStyle', 'synergy')}
                  style={{
                    padding: '14px',
                    borderRadius: '4px',
                    border: formData.heroAnimStyle !== 'fade' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.15)',
                    background: formData.heroAnimStyle !== 'fade' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>⚡ Option 1: Synergy Cascade</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Staggered right-to-left entrance with drop shadows matching Synergy Sugar.</div>
                </div>

                <div
                  onClick={() => updateField('heroAnimStyle', 'fade')}
                  style={{
                    padding: '14px',
                    borderRadius: '4px',
                    border: formData.heroAnimStyle === 'fade' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.15)',
                    background: formData.heroAnimStyle === 'fade' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginBottom: '4px' }}>🌊 Option 2: Sequential Fade</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Lines fade in one at a time and fade out smoothly in ambient loop.</div>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Primary Hero Banner Image URL
              </label>
              <input
                type="text"
                value={formData.heroImageUrl || ''}
                onChange={e => updateField('heroImageUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}

        {/* TAB: RICH MEDIA TEXT EDITOR (BIO) */}
        {activeTab === 'bio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
                  Rich Media Biography & Press Narrative
                </label>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  WYSIWYG editor with live HTML formatting and AI sync generation.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handlePromptAiBio}
                  style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#c084fc', padding: '5px 10px', borderRadius: '3px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RiSparklingFill /> AI Sync Bio
                </button>
                <button
                  type="button"
                  onClick={() => setHtmlMode(!htmlMode)}
                  style={{ background: htmlMode ? accent : 'rgba(255,255,255,0.06)', color: htmlMode ? '#000' : '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: '3px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RiCodeBoxFill /> {htmlMode ? 'Visual Mode' : 'HTML Code'}
                </button>
              </div>
            </div>

            {/* Rich Text Toolbar */}
            {!htmlMode && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                padding: '8px 10px',
                background: '#070a14',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px 4px 0 0',
                borderBottom: 'none'
              }}>
                <button type="button" onClick={() => execCmd('bold')} title="Bold" style={tbBtn}><RiBold /></button>
                <button type="button" onClick={() => execCmd('italic')} title="Italic" style={tbBtn}><RiItalic /></button>
                <button type="button" onClick={() => execCmd('underline')} title="Underline" style={tbBtn}><RiUnderline /></button>
                <button type="button" onClick={() => execCmd('strikeThrough')} title="Strikethrough" style={tbBtn}><RiStrikethrough /></button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
                <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} title="Heading 2" style={tbBtn}><RiH2 /></button>
                <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} title="Heading 3" style={tbBtn}><RiH3 /></button>
                <button type="button" onClick={() => execCmd('formatBlock', '<p>')} title="Paragraph" style={tbBtn}>P</button>
                <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} title="Quote" style={tbBtn}><RiDoubleQuotesL /></button>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
                <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Bullet List" style={tbBtn}><RiListUnordered /></button>
                <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numbered List" style={tbBtn}><RiListOrdered /></button>
                <button type="button" onClick={() => {
                  const url = prompt('Enter link URL (e.g. https://open.spotify.com):')
                  if (url) execCmd('createLink', url)
                }} title="Insert Link" style={tbBtn}><RiLink /></button>
                <button type="button" onClick={() => {
                  const imgUrl = prompt('Enter image URL:')
                  if (imgUrl) execCmd('insertImage', imgUrl)
                }} title="Insert Media Image" style={tbBtn}><RiImageAddFill /></button>
              </div>
            )}

            {/* Editable Content Surface */}
            {htmlMode ? (
              <textarea
                value={formData.bio || ''}
                onChange={e => updateField('bio', e.target.value)}
                style={{
                  width: '100%',
                  height: '320px',
                  padding: '14px',
                  background: '#0a0d18',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.6
                }}
              />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                onInput={() => {
                  if (editorRef.current) updateField('bio', editorRef.current.innerHTML)
                }}
                style={{
                  minHeight: '300px',
                  padding: '16px',
                  background: '#0a0d18',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0 0 4px 4px',
                  color: '#e2e8f0',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  outline: 'none',
                  overflowY: 'auto'
                }}
              />
            )}
          </div>
        )}

        {/* TAB: MUSIC & STEMS */}
        {activeTab === 'music' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
                  Catalog Singles & Multitrack Stems
                </label>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Featured tracks available for streaming and stem purchase with Intermaven Credits.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentTracks = Array.isArray(formData.tracks) ? [...formData.tracks] : []
                  const newTrack = {
                    id: Date.now(),
                    title: 'New Master Cue',
                    release: 'Original Master (2026)',
                    isrc: `US-TM1-26-${Math.floor(10000 + Math.random() * 90000)}`,
                    streams: '12.4K',
                    priceCredits: 50,
                    duration: '3:30'
                  }
                  updateField('tracks', [newTrack, ...currentTracks])
                }}
                style={{ background: accent, color: '#000', border: 'none', padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RiAddLine /> Add Single
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(Array.isArray(formData.tracks) && formData.tracks.length > 0 ? formData.tracks : [
                { id: 1, title: 'Nairobi Cyberwave (Master)', release: 'Neon Safari EP', isrc: 'KE-TM1-26-00042', streams: '1.2M', priceCredits: 50 },
                { id: 2, title: 'Kilimanjaro Sunset (Ambient Cue)', release: 'Singles 2026', isrc: 'KE-TM1-26-00043', streams: '840K', priceCredits: 50 },
                { id: 3, title: 'Savanna Pulse (Club VIP)', release: 'Mainstage Dubs', isrc: 'KE-TM1-26-00044', streams: '620K', priceCredits: 50 }
              ]).map((track, idx) => (
                <div key={track.id || idx} style={{ padding: '14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={track.title}
                      onChange={e => {
                        const next = [...(formData.tracks || [])]
                        if (next[idx]) next[idx].title = e.target.value
                        updateField('tracks', next)
                      }}
                      placeholder="Track Title"
                      style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      value={track.isrc}
                      onChange={e => {
                        const next = [...(formData.tracks || [])]
                        if (next[idx]) next[idx].isrc = e.target.value
                        updateField('tracks', next)
                      }}
                      placeholder="ISRC Code"
                      style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <input
                      type="number"
                      value={track.priceCredits || 50}
                      onChange={e => {
                        const next = [...(formData.tracks || [])]
                        if (next[idx]) next[idx].priceCredits = Number(e.target.value)
                        updateField('tracks', next)
                      }}
                      placeholder="Credits"
                      style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (formData.tracks || []).filter((_, i) => i !== idx)
                        updateField('tracks', next)
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MEDIA & 4K REEL */}
        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Primary YouTube Video Embed URL
              </label>
              <input
                type="text"
                value={formData.youtubeVideoUrl || ''}
                onChange={e => updateField('youtubeVideoUrl', e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Photo Gallery Image Links (One per line)
              </label>
              <textarea
                rows="5"
                value={(formData.galleryImages || []).join('\n')}
                onChange={e => {
                  const links = e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                  updateField('galleryImages', links)
                }}
                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        )}

        {/* TAB: SHOWS & TOUR DATES */}
        {activeTab === 'shows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
                  Live Shows & Festival Tour Dates
                </label>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Synced live with TuneBooking and direct VIP ticketing.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentShows = Array.isArray(formData.shows) ? [...formData.shows] : []
                  const newShow = {
                    id: Date.now(),
                    date: 'OCT 24',
                    year: '2026',
                    venue: 'Red Rocks Amphitheatre',
                    city: 'Morrison, CO, USA',
                    status: 'Tickets Available',
                    ticketUrl: '#'
                  }
                  updateField('shows', [newShow, ...currentShows])
                }}
                style={{ background: accent, color: '#000', border: 'none', padding: '6px 12px', borderRadius: '3px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RiAddLine /> Add Tour Date
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(Array.isArray(formData.shows) && formData.shows.length > 0 ? formData.shows : [
                { id: 1, date: 'NOV 12', year: '2026', venue: 'KICC Concert Arena', city: 'Nairobi, Kenya', status: 'Tickets Available' },
                { id: 2, date: 'NOV 28', year: '2026', venue: 'Printworks Nightclub', city: 'London, UK', status: 'Few VIP Passes Left' },
                { id: 3, date: 'DEC 05', year: '2026', venue: 'Berghain Panorama Bar', city: 'Berlin, Germany', status: 'Sold Out' }
              ]).map((show, idx) => (
                <div key={show.id || idx} style={{ padding: '12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={show.date}
                    onChange={e => {
                      const next = [...(formData.shows || [])]
                      if (next[idx]) next[idx].date = e.target.value
                      updateField('shows', next)
                    }}
                    placeholder="Date (e.g. NOV 12)"
                    style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    value={show.venue}
                    onChange={e => {
                      const next = [...(formData.shows || [])]
                      if (next[idx]) next[idx].venue = e.target.value
                      updateField('shows', next)
                    }}
                    placeholder="Venue"
                    style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <input
                    type="text"
                    value={show.city}
                    onChange={e => {
                      const next = [...(formData.shows || [])]
                      if (next[idx]) next[idx].city = e.target.value
                      updateField('shows', next)
                    }}
                    placeholder="City, Country"
                    style={{ padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = (formData.shows || []).filter((_, i) => i !== idx)
                      updateField('shows', next)
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                  >
                    <RiDeleteBin6Line size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STORE & MERCH */}
        {activeTab === 'store' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
              VIP Direct-to-Fan Store & Physical Vinyl
            </label>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Configure merchandise items, 180g limited vinyl, and unreleased stems bundles.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Neon Safari EP — 180g Heavyweight Vinyl (Signed)', price: '$45.00', category: 'Physical Media' },
                { title: 'Full 24-Bit Multitrack Stem Vault (10 Stems)', price: '120 Credits', category: 'Lossless Audio' },
                { title: 'Official Cyberwave Tour Hoodie', price: '$65.00', category: 'Merchandise' },
                { title: 'VIP Soundcheck & Artist Meet Pass', price: '$150.00', category: 'Experience' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.category} • In Stock</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: accent }}>{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PRESS & EPK */}
        {activeTab === 'press' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Featured Press Quote
              </label>
              <textarea
                rows="3"
                value={formData.pressQuote || ''}
                onChange={e => updateField('pressQuote', e.target.value)}
                placeholder="A breathtaking sonic expedition blending African sync rhythms with modular synth mastery."
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Press Outlet Name
              </label>
              <input
                type="text"
                value={formData.pressOutlet || ''}
                onChange={e => updateField('pressOutlet', e.target.value)}
                placeholder="e.g. Rolling Stone / Pitchfork"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}

        {/* TAB: CONTACT & SMART CRM */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Worldwide Booking Representation Email
              </label>
              <input
                type="email"
                value={formData.bookingEmail || ''}
                onChange={e => updateField('bookingEmail', e.target.value)}
                placeholder="booking@yourdomain.com"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                Inquiries submitted on the live contact form are logged as leads into the Intermaven Smart CRM and forwarded to this email.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
                Sync & Master Clearance Email
              </label>
              <input
                type="email"
                value={formData.syncEmail || 'sync@syncmavens.com'}
                onChange={e => updateField('syncEmail', e.target.value)}
                placeholder="sync@syncmavens.com"
                style={{ width: '100%', padding: '10px 14px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        )}

      </div>

      {/* ── Snapshot Rollback Modal (Mother-CMS Style) ── */}
      {showHistory && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(3, 5, 12, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 10000,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: accent, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RiHistoryLine /> Mother-CMS Snapshot Rollback
            </h3>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }}
            >
              <RiCloseFill />
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '16px' }}>
            Select any previously published version snapshot to restore the EPK layout instantly:
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyLoading ? (
              <div style={{ color: '#94a3b8', padding: '20px', textAlign: 'center' }}>Loading snapshots...</div>
            ) : historyList.length === 0 ? (
              <div style={{ color: '#64748b', padding: '20px', textAlign: 'center' }}>
                No prior snapshots found. Hit "Save & Publish" to create your first version snapshot.
              </div>
            ) : (
              historyList.map((entry, idx) => {
                const dateStr = entry.saved_at ? new Date(entry.saved_at).toLocaleString() : `Version ${entry.version}`
                return (
                  <div
                    key={entry._id || idx}
                    style={{
                      padding: '14px 18px',
                      background: '#0a0d18',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
                        Snapshot v{entry.version}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        Published {dateStr}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRollbackSnapshot(entry.version)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${accent}`,
                        color: accent,
                        padding: '6px 14px',
                        borderRadius: '3px',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Rollback to this
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const tbBtn = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e2e8f0',
  width: '32px',
  height: '30px',
  borderRadius: '3px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.9rem'
}
