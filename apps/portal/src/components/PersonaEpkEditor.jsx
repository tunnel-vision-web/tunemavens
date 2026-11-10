import React, { useState } from 'react'
import { RiAddLine, RiDeleteBin6Line, RiArrowUpSLine, RiArrowDownSLine, RiRefreshLine } from 'react-icons/ri'
import {
  CANONICAL_DJ_RATE_CARD,
  CANONICAL_PODCAST_AD_RATES,
  CANONICAL_DJ_TECH_RIDER,
  CANONICAL_PRODUCER_BEATS,
  CANONICAL_LABEL_ROSTER,
  DEFAULT_DJ_EPK_MIXES
} from '../views/creator/PersonaEpkSections.jsx'

/**
 * PersonaEpkEditor
 * ----------------
 * Backend editor for every persona-specific section rendered on the public EPK
 * (CreatorEpkView + PersonaEpkSections). Each list writes to a snake_case key on
 * the EPK document; when a list is empty the public EPK falls back to the
 * canonical defaults exported by PersonaEpkSections.jsx.
 *
 * Keys written: creator_type, bookingEmail, dj_mixes, rate_card, tech_rider,
 * episodes, ad_rates, demographics, beats, roster.
 */

const PERSONAS = [
  { id: 'artist', label: 'Recording Artist', audience: 'Fans, promoters, music supervisors & press' },
  { id: 'dj', label: 'DJ / Turntablist', audience: 'Club promoters, festival buyers, brand directors & mix listeners' },
  { id: 'podcaster', label: 'Podcaster / Show Host', audience: 'Sponsors, media buyers, PR & listeners' },
  { id: 'producer', label: 'Producer / Beatmaker', audience: 'Recording artists, labels, supervisors & vocalists' },
  { id: 'label', label: 'Record Label / Publisher', audience: 'Supervisors, DSP curators, festival buyers & A&R prospects' }
]

// Field schemas per editable list. type: text | number | textarea | checkbox | select
const SCHEMAS = {
  dj_mixes: {
    title: 'DJ Mixes (Stream & Buy)',
    hint: 'Shown on the Mixes tab and DJ home. Add mixes to override the network mix feed.',
    defaults: DEFAULT_DJ_EPK_MIXES,
    blank: () => ({ id: `mix_${Date.now()}`, title: 'New Mix', dj_name: '', genre: 'Afro-House', bpm_avg: 122, duration: '60:00', commercial_price: 4.99, price_credits: 50, is_original_ip_only: false, status: 'published_for_sale', artwork_url: '', audio_url: '', description: '', streams: '0', tracklist: [] }),
    fields: [
      { key: 'title', label: 'Mix Title', wide: true },
      { key: 'dj_name', label: 'Mixed By' },
      { key: 'genre', label: 'Genre', type: 'select', options: ['Afro-House', 'Amapiano', 'Deep-House', 'Afrobeats', 'Electronic', 'Afro-Tech'] },
      { key: 'bpm_avg', label: 'Avg BPM', type: 'number' },
      { key: 'duration', label: 'Duration' },
      { key: 'commercial_price', label: 'Price (USD base)', type: 'number' },
      { key: 'price_credits', label: 'Price (Credits)', type: 'number' },
      { key: 'artwork_url', label: 'Artwork URL', wide: true },
      { key: 'audio_url', label: 'Audio URL', wide: true },
      { key: 'description', label: 'Description', type: 'textarea', wide: true },
      { key: 'is_original_ip_only', label: '100% original IP (90% DJ payout)', type: 'checkbox' }
    ]
  },
  rate_card: {
    title: 'DJ Rate Card Tiers',
    hint: 'Drives the Rate Card tab, the Book-a-Gig package selector and the downloadable one-sheet.',
    defaults: CANONICAL_DJ_RATE_CARD,
    blank: () => ({ id: `tier_${Date.now()}`, tier: 'New Package', badge: '', duration: '2 Hours', price_usd: 500, deposit_pct: 50, credits: 5000, is_popular: false, audience: '', deliverables: '', hospitality: '' }),
    fields: [
      { key: 'tier', label: 'Package Name', wide: true },
      { key: 'badge', label: 'Badge' },
      { key: 'duration', label: 'Set Duration' },
      { key: 'price_usd', label: 'Fee (USD base)', type: 'number' },
      { key: 'deposit_pct', label: 'Escrow Deposit %', type: 'number' },
      { key: 'credits', label: 'Fee (Credits)', type: 'number' },
      { key: 'audience', label: 'Ideal For', wide: true },
      { key: 'deliverables', label: 'Deliverables', type: 'textarea', wide: true },
      { key: 'hospitality', label: 'Hospitality & Travel', type: 'textarea', wide: true },
      { key: 'is_popular', label: 'Highlight as "Most Booked"', type: 'checkbox' }
    ]
  },
  tech_rider_console: {
    title: 'Tech Rider — Console & Players',
    defaults: CANONICAL_DJ_TECH_RIDER.console,
    blank: () => ({ label: 'Item', value: '' }),
    fields: [{ key: 'label', label: 'Label' }, { key: 'value', label: 'Specification', wide: true }]
  },
  tech_rider_monitoring: {
    title: 'Tech Rider — Monitoring & Stage Sound',
    defaults: CANONICAL_DJ_TECH_RIDER.monitoring,
    blank: () => ({ label: 'Item', value: '' }),
    fields: [{ key: 'label', label: 'Label' }, { key: 'value', label: 'Specification', wide: true }]
  },
  episodes: {
    title: 'Podcast Episodes',
    hint: 'Episodes with chapters (one per line as "MM:SS Title") and transcript.',
    defaults: [],
    blank: () => ({ id: `ep_${Date.now()}`, title: 'New Episode', seasonNumber: 1, episodeNumber: 1, duration: '40:00', publishedAt: 'Today', streams: '0', summary: '', transcript: '', audioUrl: '', chapters: [] }),
    fields: [
      { key: 'title', label: 'Episode Title', wide: true },
      { key: 'seasonNumber', label: 'Season', type: 'number' },
      { key: 'episodeNumber', label: 'Episode #', type: 'number' },
      { key: 'duration', label: 'Duration' },
      { key: 'publishedAt', label: 'Published' },
      { key: 'audioUrl', label: 'Audio URL', wide: true },
      { key: 'summary', label: 'Summary', type: 'textarea', wide: true },
      { key: 'chapters', label: 'Chapters (MM:SS Title per line)', type: 'chapters', wide: true },
      { key: 'transcript', label: 'Transcript', type: 'textarea', wide: true }
    ]
  },
  ad_rates: {
    title: 'Podcast Sponsorship Rate Card',
    defaults: CANONICAL_PODCAST_AD_RATES,
    blank: () => ({ tier: `tier_${Date.now()}`, name: 'New Flight', badge: '', price_usd: 500, credits: 5000, cpm_usd: 10, impressions: '', deliverables: '', is_popular: false }),
    fields: [
      { key: 'name', label: 'Flight Name', wide: true },
      { key: 'badge', label: 'Badge' },
      { key: 'price_usd', label: 'Price (USD base)', type: 'number' },
      { key: 'credits', label: 'Price (Credits)', type: 'number' },
      { key: 'cpm_usd', label: 'CPM (USD base)', type: 'number' },
      { key: 'impressions', label: 'Guaranteed Impressions', wide: true },
      { key: 'deliverables', label: 'Deliverables', type: 'textarea', wide: true },
      { key: 'is_popular', label: 'Mark as Recommended', type: 'checkbox' }
    ]
  },
  beats: {
    title: 'Producer Beat Store',
    defaults: CANONICAL_PRODUCER_BEATS,
    blank: () => ({ id: `beat_${Date.now()}`, title: 'New Beat', bpm: 120, key: 'C Minor', leaseUsd: 40, stemsUsd: 160, buyoutUsd: 650, audioUrl: '' }),
    fields: [
      { key: 'title', label: 'Beat Title', wide: true },
      { key: 'bpm', label: 'BPM', type: 'number' },
      { key: 'key', label: 'Key' },
      { key: 'leaseUsd', label: 'MP3 Lease (USD base)', type: 'number' },
      { key: 'stemsUsd', label: 'WAV Stems (USD base)', type: 'number' },
      { key: 'buyoutUsd', label: 'Exclusive Buyout (USD base)', type: 'number' },
      { key: 'audioUrl', label: 'Preview Audio URL', wide: true }
    ]
  },
  roster: {
    title: 'Label Roster',
    defaults: CANONICAL_LABEL_ROSTER,
    blank: () => ({ name: 'New Artist', slug: '', persona: 'artist', genre: '', listeners: '', avatar: '' }),
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'EPK Slug' },
      { key: 'persona', label: 'Persona', type: 'select', options: ['artist', 'dj', 'producer', 'podcaster'] },
      { key: 'genre', label: 'Genre / Role' },
      { key: 'listeners', label: 'Listeners' },
      { key: 'avatar', label: 'Photo URL', wide: true }
    ]
  }
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.14)',
  color: '#fff', padding: '7px 9px', fontSize: '12px', borderRadius: '3px'
}
const labelStyle = { fontSize: '10.5px', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }

function chaptersToText(ch) {
  return (Array.isArray(ch) ? ch : []).map(c => `${c.time} ${c.title}`).join('\n')
}
function textToChapters(txt) {
  return String(txt || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+(.*)$/)
    return m ? { time: m[1], title: m[2] } : { time: '00:00', title: l }
  })
}

function RowListEditor({ schemaKey, value, onChange, accent }) {
  const schema = SCHEMAS[schemaKey]
  const isCustom = Array.isArray(value) && value.length > 0
  const rows = isCustom ? value : []
  const [open, setOpen] = useState(0)

  const updateRow = (idx, key, val) => onChange(rows.map((r, i) => (i === idx ? { ...r, [key]: val } : r)))
  const move = (idx, dir) => {
    const next = [...rows]
    const j = idx + dir
    if (j < 0 || j >= next.length) return
    ;[next[idx], next[j]] = [next[j], next[idx]]
    onChange(next)
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>{schema.title}</div>
          <div style={{ color: isCustom ? '#10b981' : '#f59e0b', fontSize: '11px', fontWeight: 700 }}>
            {isCustom ? `✓ Custom — ${rows.length} item(s) published` : 'Using canonical defaults on the public EPK'}
          </div>
          {schema.hint && <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{schema.hint}</div>}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {!isCustom && schema.defaults.length > 0 && (
            <button type="button" onClick={() => onChange(JSON.parse(JSON.stringify(schema.defaults)))}
              style={{ ...inputStyle, width: 'auto', cursor: 'pointer', fontWeight: 800 }}>
              Customise defaults
            </button>
          )}
          {isCustom && (
            <button type="button" onClick={() => onChange([])} title="Revert to canonical defaults"
              style={{ ...inputStyle, width: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RiRefreshLine size={13} /> Reset
            </button>
          )}
          <button type="button" onClick={() => { onChange([...rows, schema.blank()]); setOpen(rows.length) }}
            style={{ background: accent, color: '#060813', border: 'none', borderRadius: '3px', padding: '7px 12px', fontSize: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RiAddLine size={14} /> Add
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row, idx) => (
          <div key={row.id || row.tier || idx} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '3px', background: '#070b18' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', cursor: 'pointer' }}
              onClick={() => setOpen(open === idx ? -1 : idx)}>
              <span style={{ color: '#e2e8f0', fontSize: '12.5px', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {idx + 1}. {row[schema.fields[0].key] || 'Untitled'}
              </span>
              <span style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => move(idx, -1)} style={{ ...inputStyle, width: 'auto', padding: '3px 6px', cursor: 'pointer' }} title="Move up"><RiArrowUpSLine /></button>
                <button type="button" onClick={() => move(idx, 1)} style={{ ...inputStyle, width: 'auto', padding: '3px 6px', cursor: 'pointer' }} title="Move down"><RiArrowDownSLine /></button>
                <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== idx))} style={{ ...inputStyle, width: 'auto', padding: '3px 6px', cursor: 'pointer', color: '#ef4444' }} title="Delete"><RiDeleteBin6Line /></button>
              </span>
            </div>
            {open === idx && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', padding: '0 10px 12px' }}>
                {schema.fields.map(f => (
                  <div key={f.key} style={{ gridColumn: f.wide ? '1 / -1' : 'auto' }}>
                    {f.type === 'checkbox' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0', fontSize: '12px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={Boolean(row[f.key])} onChange={e => updateRow(idx, f.key, e.target.checked)} />
                        {f.label}
                      </label>
                    ) : (
                      <>
                        <label style={labelStyle}>{f.label}</label>
                        {f.type === 'textarea' ? (
                          <textarea rows={3} value={row[f.key] || ''} onChange={e => updateRow(idx, f.key, e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
                        ) : f.type === 'chapters' ? (
                          <textarea rows={3} value={chaptersToText(row[f.key])} onChange={e => updateRow(idx, f.key, textToChapters(e.target.value))} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }} />
                        ) : f.type === 'select' ? (
                          <select value={row[f.key] || f.options[0]} onChange={e => updateRow(idx, f.key, e.target.value)} style={inputStyle}>
                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input type={f.type === 'number' ? 'number' : 'text'} value={row[f.key] ?? ''}
                            onChange={e => updateRow(idx, f.key, f.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
                            style={inputStyle} />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PersonaEpkEditor({ formData = {}, updateField, accent = '#00f0ff' }) {
  const persona = String(formData.creator_type || 'artist').toLowerCase()
  const techRider = formData.tech_rider || {}
  const demographics = formData.demographics || {}
  const setTechRider = (part, list) => updateField('tech_rider', { ...techRider, [part]: list })
  const setDemo = (key, val) => updateField('demographics', { ...demographics, [key]: val })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '920px' }} data-testid="cms-persona-editor">
      <div>
        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 900, margin: '0 0 4px' }}>Persona & Pro Tools</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
          Pick the EPK persona and edit every persona-specific section shown on the public EPK. Prices are entered in the USD base
          and localized automatically for each visitor. Click <strong>Save &amp; Sync</strong> to publish.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))', gap: '10px' }}>
        {PERSONAS.map(p => (
          <button key={p.id} type="button" onClick={() => updateField('creator_type', p.id)}
            style={{
              textAlign: 'left', padding: '12px', borderRadius: '4px', cursor: 'pointer',
              background: persona === p.id ? `${accent}22` : 'rgba(255,255,255,0.03)',
              border: persona === p.id ? `1.5px solid ${accent}` : '1px solid rgba(255,255,255,0.1)', color: '#fff'
            }}>
            <div style={{ fontWeight: 900, fontSize: '13px' }}>{persona === p.id ? '✓ ' : ''}{p.label}</div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>{p.audience}</div>
          </button>
        ))}
      </div>

      <div>
        <label style={labelStyle}>Booking / Business Email (rate card one-sheet & booking desk)</label>
        <input type="email" value={formData.bookingEmail || ''} placeholder="booking@yourdomain.com"
          onChange={e => updateField('bookingEmail', e.target.value)} style={{ ...inputStyle, maxWidth: '420px' }} />
      </div>

      {persona === 'dj' && (
        <>
          <RowListEditor schemaKey="dj_mixes" value={formData.dj_mixes} onChange={v => updateField('dj_mixes', v)} accent={accent} />
          <RowListEditor schemaKey="rate_card" value={formData.rate_card} onChange={v => updateField('rate_card', v)} accent={accent} />
          <RowListEditor schemaKey="tech_rider_console" value={techRider.console} onChange={v => setTechRider('console', v)} accent={accent} />
          <RowListEditor schemaKey="tech_rider_monitoring" value={techRider.monitoring} onChange={v => setTechRider('monitoring', v)} accent={accent} />
          <div>
            <label style={labelStyle}>Tech Rider Intro Note</label>
            <textarea rows={2} value={techRider.notes || ''} onChange={e => updateField('tech_rider', { ...techRider, notes: e.target.value })} style={inputStyle} />
          </div>
        </>
      )}

      {persona === 'podcaster' && (
        <>
          <RowListEditor schemaKey="episodes" value={formData.episodes} onChange={v => updateField('episodes', v)} accent={accent} />
          <RowListEditor schemaKey="ad_rates" value={formData.ad_rates} onChange={v => updateField('ad_rates', v)} accent={accent} />
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ gridColumn: '1 / -1', color: '#fff', fontWeight: 900, fontSize: '14px' }}>Audience Demographics</div>
            <div><label style={labelStyle}>Core Age Brackets</label><input value={demographics.ageGroups || ''} placeholder="18–34 (72%), 35–49 (24%)" onChange={e => setDemo('ageGroups', e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Completion Rate</label><input value={demographics.completionRate || ''} placeholder="89.4%" onChange={e => setDemo('completionRate', e.target.value)} style={inputStyle} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Listener Profile</label><textarea rows={2} value={demographics.listenerProfile || ''} onChange={e => setDemo('listenerProfile', e.target.value)} style={inputStyle} /></div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Top Regions (one per line: Region | Share%)</label>
              <textarea rows={4} style={{ ...inputStyle, fontFamily: 'monospace' }}
                value={(demographics.topRegions || []).map(r => `${r.region} | ${r.share}`).join('\n')}
                onChange={e => setDemo('topRegions', e.target.value.split('\n').map(l => l.split('|')).filter(p => p[0] && p[0].trim()).map(p => ({ region: p[0].trim(), share: Number(String(p[1] || '0').replace(/[^0-9.]/g, '')) || 0 })))} />
            </div>
          </div>
        </>
      )}

      {persona === 'producer' && (
        <RowListEditor schemaKey="beats" value={formData.beats} onChange={v => updateField('beats', v)} accent={accent} />
      )}

      {(persona === 'label' || persona === 'publisher') && (
        <RowListEditor schemaKey="roster" value={formData.roster} onChange={v => updateField('roster', v)} accent={accent} />
      )}

      {persona === 'artist' && (
        <div style={{ color: '#94a3b8', fontSize: '12.5px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '14px' }}>
          The Recording Artist EPK is fully driven by the Discography, Videos &amp; Reel, Tour &amp; Shows, Store &amp; Merch, Press &amp; EPK and Contact tabs.
        </div>
      )}
    </div>
  )
}
