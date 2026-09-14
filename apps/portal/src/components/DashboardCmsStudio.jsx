import React, { useState, useEffect, useRef } from 'react'
import {
  RiPaletteFill, RiLayoutMasonryFill, RiFileTextFill, RiMusic2Fill,
  RiMovieFill, RiCalendarEventFill, RiShoppingBag3Fill, RiMailFill,
  RiHistoryLine, RiSparklingFill, RiSave3Fill, RiExternalLinkLine,
  RiAddLine, RiDeleteBin6Line, RiImageAddFill, RiCodeBoxFill,
  RiBold, RiItalic, RiUnderline, RiStrikethrough, RiH2, RiH3,
  RiListUnordered, RiListOrdered, RiDoubleQuotesL, RiLink, RiCheckFill,
  RiUploadFill, RiRefreshLine, RiPlayFill, RiDiscFill, RiArrowRightSLine, RiPriceTag3Fill, RiArrowLeftSLine, RiCheckLine, RiFolderUploadFill, RiImageFill, RiVideoAddFill, RiDatabase2Fill
} from 'react-icons/ri'
import { EPK_THEMES } from '../views/creator/CreatorEpkView'
import CmsAssetsStudio from './CmsAssetsStudio.jsx'
import MediaAssetPickerModal from './MediaAssetPickerModal.jsx'
import AiArtPromptModal from './AiArtPromptModal.jsx'
import { loadAuthoritativeGenres, DEFAULT_CANONICAL_GENRES } from '../lib/genres.js'

const CMS_TABS = [
  { id: 'brand',   label: 'Brand & Identity', icon: RiPaletteFill },
  { id: 'hero',    label: 'Hero Carousel',   icon: RiLayoutMasonryFill },
  { id: 'banners', label: 'Page Header Banners', icon: RiImageAddFill },
  { id: 'assets',  label: 'Assets',          icon: RiFolderUploadFill },
  { id: 'bio',     label: 'Rich Bio',         icon: RiFileTextFill },
  { id: 'music',   label: 'Discography', icon: RiDiscFill },
  { id: 'media',   label: 'Videos & Reel',   icon: RiMovieFill },
  { id: 'shows',   label: 'Tour & Shows',    icon: RiCalendarEventFill },
  { id: 'store',   label: 'Store & Merch',   icon: RiShoppingBag3Fill },
  { id: 'press',   label: 'Press & EPK',     icon: RiFileTextFill },
  { id: 'contact', label: 'Contact & CRM',   icon: RiMailFill },
  { id: 'history', label: 'Version History', icon: RiHistoryLine }
]

const BANNER_PAGES = [
  { key: 'discography', label: 'Music & Discography', defaultPrompt: 'Cinematic atmospheric music studio with analog mixing console, neon glow, 16:9 stage banner', defaultImg: '/headers/discography_retina_header.jpg' },
  { key: 'bio', label: 'Biography & Story', defaultPrompt: 'Editorial artist portrait in moody acoustic venue, cinematic shadows, high fashion lighting, 16:9 banner', defaultImg: 'https://picsum.photos/seed/bio_banner/1920/640' },
  { key: 'shows', label: 'Tour & Live Shows', defaultPrompt: 'Massive festival crowd cheering at dusk with laser lights and pyrotechnics, 16:9 concert banner', defaultImg: 'https://picsum.photos/seed/shows_banner/1920/640' },
  { key: 'store', label: 'Store & Merchandise', defaultPrompt: 'Minimalist high-end streetwear and vinyl boutique showroom, cybernetic lighting, 16:9 store banner', defaultImg: 'https://picsum.photos/seed/store_banner/1920/640' },
  { key: 'media', label: 'Videos & 4K Reel', defaultPrompt: 'Cinema film production stage with 4k cameras and anamorphic lens flares, 16:9 wide banner', defaultImg: 'https://picsum.photos/seed/media_banner/1920/640' },
  { key: 'press', label: 'Press Kit & EPK', defaultPrompt: 'Monochrome architectural studio loft with Billboard magazine aesthetics, 16:9 executive banner', defaultImg: 'https://picsum.photos/seed/press_banner/1920/640' },
  { key: 'contact', label: 'Booking & Inquiries', defaultPrompt: 'Luxury executive artist management lounge with world tour skyline view, 16:9 contact banner', defaultImg: 'https://picsum.photos/seed/contact_banner/1920/640' },
  { key: 'pricing', label: 'Fan VIP & Top-Ups', defaultPrompt: 'Futuristic glowing VIP lounge with golden particle streams, 16:9 VIP experience banner', defaultImg: 'https://picsum.photos/seed/pricing_banner/1920/640' }
]

const DEFAULT_TRACKS = [
  {
    id: 1,
    title: 'Nairobi Cyberwave (Master)',
    release: 'Neon Safari EP',
    isrc: 'KE-TM1-26-00042',
    streams: '3.4M',
    duration: '3:45',
    priceCredits: 50,
    coverArt: 'https://picsum.photos/seed/cyberwave_cover/600/600'
  },
  {
    id: 2,
    title: 'Sunset over Rift Valley',
    release: 'Singles 2026',
    isrc: 'KE-TM1-26-00043',
    streams: '1.8M',
    duration: '4:12',
    priceCredits: 50,
    coverArt: 'https://picsum.photos/seed/riftvalley_cover/600/600'
  },
  {
    id: 3,
    title: 'Afro-Synth Cascade',
    release: 'Mainstage Dubs',
    isrc: 'KE-TM1-26-00044',
    streams: '940K',
    duration: '3:18',
    priceCredits: 40,
    coverArt: 'https://picsum.photos/seed/afrosynth_cover/600/600'
  },
  {
    id: 4,
    title: 'Midnight Mara Starlight',
    release: 'EP 2025',
    isrc: 'KE-TM1-26-00045',
    streams: '2.1M',
    duration: '5:02',
    priceCredits: 60,
    coverArt: 'https://picsum.photos/seed/mara_cover/600/600'
  }
]

const DEFAULT_VIDEOS_CMS = [
  {
    id: 300,
    type: 'video',
    title: 'Machero',
    url: 'https://www.youtube.com/watch?v=2y3NvAVU2xE',
    youtubeUrl: 'https://www.youtube.com/embed/2y3NvAVU2xE',
    thumbnail: 'https://img.youtube.com/vi/2y3NvAVU2xE/hqdefault.jpg',
    views: '850K views',
    category: 'Official Video'
  },
  {
    id: 301,
    type: 'video',
    title: 'Ndufo — Nairobi Cyberwave (Official 4K Music Video)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid1/600/340',
    views: '1.2M views',
    category: 'Official Video'
  },
  {
    id: 303,
    type: 'video',
    title: 'Live at SyncMavens Vault (Full Concert 4K)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid2/600/340',
    views: '840K views',
    category: 'Live Concert'
  },
  {
    id: 305,
    type: 'video',
    title: 'Inside the Synthesizer Soundscapes',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid3/600/340',
    views: '320K views',
    category: 'Behind the Scenes'
  },
  {
    id: 307,
    type: 'video',
    title: 'Ndufo — Rift Valley Sunset (Acoustic Session 4K)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid4/600/340',
    views: '620K views',
    category: 'Studio Session'
  },
  {
    id: 309,
    type: 'video',
    title: 'Ndufo — Afro-Synth Cascade (Live at O2)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yt_vid5/600/340',
    views: '490K views',
    category: 'Live Concert'
  }
]

export const mergeWithCanonicalVideos = (videosList, artistName = 'Ndufo') => {
  const list = Array.isArray(videosList) ? [...videosList] : []
  if (list.length === 0) return DEFAULT_VIDEOS_CMS

  const existingTitles = new Set(list.map(v => (v.title || '').toLowerCase().trim()))
  const existingIds = new Set(list.map(v => v.id))

  const missingCanonicals = DEFAULT_VIDEOS_CMS.filter(cfv => {
    const titleLower = cfv.title.toLowerCase()
    const hasTitle = Array.from(existingTitles).some(et => 
      (et.includes('machero') && titleLower.includes('machero')) ||
      (et.includes('cyberwave') && titleLower.includes('cyberwave')) ||
      (et.includes('syncmavens vault') && titleLower.includes('syncmavens vault')) ||
      (et.includes('synthesizer soundscapes') && titleLower.includes('synthesizer soundscapes')) ||
      (et.includes('rift valley sunset') && titleLower.includes('rift valley sunset')) ||
      (et.includes('afro-synth') && titleLower.includes('afro-synth'))
    )
    return !existingIds.has(cfv.id) && !hasTitle
  })

  return [...list, ...missingCanonicals]
}

const getYouTubeThumbnail = (rawUrl) => {
  if (!rawUrl) return null
  const ytMatch = String(rawUrl).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`
  }
  return null
}

export default function DashboardCmsStudio({ sessionUser, epk, setEpk, tracks: initialTracks, initialTab = 'music', onSwitchToWizard }) {
  const [activeSubdomain, setActiveSubdomain] = useState(() => {
    return (epk?.subdomain && epk.subdomain !== 'aisha' ? epk.subdomain : null) || localStorage.getItem('last_saved_epk_subdomain') || 'ndufo'
  })
  const [activeTab, setActiveTab] = useState(initialTab || 'music')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [statusType, setStatusType] = useState('success')

  // AI Prompt Dialogue Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiModalConfig, setAiModalConfig] = useState({
    title: 'Generate AI Artwork',
    defaultPrompt: '',
    aspectRatio: '1:1',
    onSuccess: null
  })

  // Universal Media Asset Picker Modal State
  const [pickerModalOpen, setPickerModalOpen] = useState(false)
  const [pickerModalConfig, setPickerModalConfig] = useState({
    title: 'Select Media Asset',
    filterType: 'all',
    onSelect: null
  })

  // Canonical Authoritative Genres
  const [canonicalGenres, setCanonicalGenres] = useState(DEFAULT_CANONICAL_GENRES)
  useEffect(() => {
    loadAuthoritativeGenres().then(g => {
      if (Array.isArray(g) && g.length > 0) setCanonicalGenres(g)
    })
    const handleGenreUpdate = (e) => {
      if (e.detail?.genres) setCanonicalGenres(e.detail.genres)
    }
    window.addEventListener('tunemavens-genres-updated', handleGenreUpdate)
    return () => window.removeEventListener('tunemavens-genres-updated', handleGenreUpdate)
  }, [])

  const activeVideos = React.useMemo(() => {
    return mergeWithCanonicalVideos(formData.videos, formData.artist_name || activeSubdomain)
  }, [formData.videos, formData.artist_name, activeSubdomain])

  const showStatus = (msg, type = 'success') => {
    setStatusMsg(msg)
    setStatusType(type)
    setTimeout(() => {
      setStatusMsg('')
    }, 5000)
  }

  const autoSaveEpk = (updatedData) => {
    const cleanSub = (activeSubdomain || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    const payload = {
      ...updatedData,
      subdomain: cleanSub,
      artist_name: updatedData.artist_name || updatedData.siteName || cleanSub.toUpperCase(),
      updated_at: new Date().toISOString()
    }
    try {
      localStorage.setItem(`epk_public_${cleanSub}`, JSON.stringify(payload))
      localStorage.setItem(`epk_${cleanSub}`, JSON.stringify(payload))
      localStorage.setItem('last_saved_epk_subdomain', cleanSub)
      if (typeof setEpk === 'function') setEpk(payload)
      window.dispatchEvent(new Event('epk_updated'))
      window.dispatchEvent(new CustomEvent('epk_storage_sync', { detail: payload }))
    } catch (_) {}
    fetch(`/api/cms/epk/${cleanSub}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload, note: `Auto-saved asset update for ${cleanSub}` })
    }).catch(() => {})
  }
  const [historyList, setHistoryList] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [htmlMode, setHtmlMode] = useState(false)
  const [aiGeneratingCoverId, setAiGeneratingCoverId] = useState(null)
  const [aiBioGenerating, setAiBioGenerating] = useState(false)
  const [aiGeneratingHeaderKey, setAiGeneratingHeaderKey] = useState(null)

  // AI Prompting State across all modules
  const [heroAiPrompt, setHeroAiPrompt] = useState('Cinematic futuristic live stage with modular synthesizers, neon cyan glow, crowd silhouettes, 16:9 banner')
  const [heroAiGenerating, setHeroAiGenerating] = useState(false)
  const [selectedHeroSlideIndex, setSelectedHeroSlideIndex] = useState(0)
  const [bioProfilePrompt, setBioProfilePrompt] = useState('Editorial high-fashion studio portrait of an electronic music producer, dramatic rim lighting, cinematic 8k')
  const [bioProfileGenerating, setBioProfileGenerating] = useState(false)
  const [bioAiPrompt, setBioAiPrompt] = useState('Internationally acclaimed electronic and modular synthesizer producer with Billboard charting sync placements and world tour achievements')
  const [bannerPrompts, setBannerPrompts] = useState({
    discography: 'Cinematic atmospheric music studio with analog mixing console, neon glow, 16:9 stage banner',
    bio: 'Editorial artist portrait in moody acoustic venue, cinematic shadows, high fashion lighting, 16:9 banner',
    shows: 'Massive festival crowd cheering at dusk with laser lights and pyrotechnics, 16:9 concert banner',
    store: 'Minimalist high-end streetwear and vinyl boutique showroom, cybernetic lighting, 16:9 store banner',
    media: 'Cinema film production stage with 4k cameras and anamorphic lens flares, 16:9 wide banner',
    press: 'Monochrome architectural studio loft with Billboard magazine aesthetics, 16:9 executive banner',
    contact: 'Luxury executive artist management lounge with world tour skyline view, 16:9 contact banner',
    pricing: 'Futuristic glowing VIP lounge with golden particle streams, 16:9 VIP experience banner'
  })

  // Rich Text Editor Media Insertion State
  const [mediaInsertModal, setMediaInsertModal] = useState(null) // null | { type: 'image' | 'video', url: '', caption: '' }

  // Discography & Bulk Ingestion State
  const [discographySubTab, setDiscographySubTab] = useState('tracks') // 'tracks' | 'albums' | 'bulk'
  const [bulkCsvText, setBulkCsvText] = useState('')
  const [bulkIngestResult, setBulkIngestResult] = useState(null)

  // Wizards State for Shows, Store & Press
  const [discographyWizardOpen, setDiscographyWizardOpen] = useState(false)
  const [discographyWizardStep, setDiscographyWizardStep] = useState(1)
  const [discographyWizardData, setDiscographyWizardData] = useState({
    title: '',
    releaseType: 'single',
    year: '2026',
    genre: 'Afro-Futurism / Electronic',
    bpm: '124',
    key: 'F Minor',
    isrc: `KE-TM1-26-88219`,
    masterAudioUrl: 'https://audio.intermaven.io/masters/ndufo_master_01.wav',
    stemsZipUrl: 'https://audio.intermaven.io/stems/ndufo_multitracks_01.zip',
    duration: '3:45',
    coverArt: 'https://picsum.photos/seed/discography_new/800/800',
    coverPrompt: 'Afro-futurist modular synthesizer console with neon cyan lighting and tribal geometry',
    songwriters: 'Ndufo (BMI)',
    producers: 'Ndufo, Aura Labs',
    publisher: 'Intermaven Songs / ASCAP (IPI 00892182)',
    priceCredits: 50,
    priceUsd: '$1.99',
    stemsPriceUsd: '$24.99',
    practitionerOnlyStems: true
  })

  // Discography Wizard Save Handler
  const handleSaveDiscographyWizard = () => {
    if (!discographyWizardData.title.trim()) {
      showStatus('Release Title is required.', 'error')
      return
    }
    const newRelease = {
      id: Date.now(),
      title: discographyWizardData.title,
      release: `${discographyWizardData.releaseType.toUpperCase()} · ${discographyWizardData.year}`,
      releaseType: discographyWizardData.releaseType,
      year: discographyWizardData.year,
      genre: discographyWizardData.genre,
      bpm: discographyWizardData.bpm,
      key: discographyWizardData.key,
      isrc: discographyWizardData.isrc,
      duration: discographyWizardData.duration,
      streams: '10K',
      priceCredits: parseInt(discographyWizardData.priceCredits) || 50,
      coverArt: discographyWizardData.coverArt || `https://picsum.photos/seed/${encodeURIComponent(discographyWizardData.title)}/600/600`,
      masterAudioUrl: discographyWizardData.masterAudioUrl,
      stemsZipUrl: discographyWizardData.stemsZipUrl,
      songwriters: discographyWizardData.songwriters,
      producers: discographyWizardData.producers,
      publisher: discographyWizardData.publisher,
      practitionerOnlyStems: discographyWizardData.practitionerOnlyStems
    }
    const current = Array.isArray(formData.tracks) ? [...formData.tracks] : DEFAULT_TRACKS
    updateField('tracks', [newRelease, ...current])
    setDiscographyWizardOpen(false)
    setDiscographyWizardStep(1)
    showStatus(`Release "${newRelease.title}" successfully added to Discography!`, 'success')
  }

  const [showsWizardOpen, setShowsWizardOpen] = useState(false)
  const [showsWizardStep, setShowsWizardStep] = useState(1)
  const [showsWizardData, setShowsWizardData] = useState({
    venue: '', city: '', date: '', doors: '7:00 PM', age: '18+',
    priceGA: 25, priceVIP: 50, priceMeet: 99,
    description: '', flyer: 'https://picsum.photos/seed/tour_new/600/900'
  })

  const [storeWizardOpen, setStoreWizardOpen] = useState(false)
  const [storeWizardStep, setStoreWizardStep] = useState(1)
  const [storeWizardData, setStoreWizardData] = useState({
    title: '', category: 'vinyl', price: '$34.99', stock: '25 copies remaining',
    desc: 'Limited edition 180g heavyweight vinyl pressing.',
    images: ['https://picsum.photos/seed/merch_prod1/800/800', 'https://picsum.photos/seed/merch_prod2/800/800']
  })

  const [pressWizardOpen, setPressWizardOpen] = useState(false)
  const [pressWizardStep, setPressWizardStep] = useState(1)
  const [pressWizardData, setPressWizardData] = useState({
    headline: '', pressQuote: '', pressOutlet: '',
    techRiderSpec: 'Front of House: DiGiCo SD12. In-Ear Monitors: 4x Sennheiser G4.',
    bookingAgency: 'United Talent Agency / Intermaven Global'
  })

  // Hero AI Art Generator Handler
  const handleGenerateHeroArt = async () => {
    setHeroAiGenerating(true)
    const prompt = (heroAiPrompt || 'Futuristic live concert stage with neon lighting, 16:9 banner').trim()
    try {
      let generatedUrl = ''
      try {
        const res = await fetch('/api/social-ai/generate-art', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt,
            aspect_ratio: '16:9'
          })
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.asset?.media_url) generatedUrl = data.asset.media_url
        }
      } catch (_) {}

      if (!generatedUrl) {
        const cleanPrompt = encodeURIComponent(`${prompt}, 16:9 widescreen, cinematic lighting, photorealistic, 4k master composition`)
        generatedUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1920&height=1080&nologo=true&seed=${Date.now()}`
      }
      const currentImages = Array.isArray(formData.heroImages) ? [...formData.heroImages] : []
      const newImages = [generatedUrl, ...currentImages]
      const updated = {
        ...formData,
        heroImages: newImages,
        heroImageUrl: generatedUrl
      }
      setFormData(updated)
      autoSaveEpk(updated)
      showStatus('Hero slide artwork generated with AI and synced!', 'success')
    } catch {
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ', 16:9 widescreen') }?width=1920&height=1080&nologo=true&seed=${Date.now()}`
      const currentImages = Array.isArray(formData.heroImages) ? [...formData.heroImages] : []
      const updated = {
        ...formData,
        heroImages: [fallbackUrl, ...currentImages],
        heroImageUrl: fallbackUrl
      }
      setFormData(updated)
      autoSaveEpk(updated)
      showStatus('Hero slide artwork generated and synced!', 'success')
    } finally {
      setHeroAiGenerating(false)
    }
  }

  // Get or construct initial hero slides
  const getInitialHeroSlides = () => {
    if (Array.isArray(formData.heroSlides) && formData.heroSlides.length > 0) {
      return formData.heroSlides
    }
    const imgs = Array.isArray(formData.heroImages) && formData.heroImages.length > 0
      ? formData.heroImages
      : [formData.heroImageUrl || 'https://picsum.photos/seed/producer_studio_gear_1/1200/600']
    return imgs.map((img, i) => ({
      id: i + 1,
      img,
      title1: i === 0 ? (formData.heroTitle1 || formData.artist_name || 'Creator') : (i === 1 ? 'World Tour 2026 Live Showcase' : `${formData.artist_name || 'Creator'} — Master Audio`),
      title2: i === 0 ? (formData.heroTitle2 || formData.headline || 'Electronic & Modular Synthesizer Producer') : (i === 1 ? 'Headline Dates: Tokyo, London & Nairobi' : 'Lossless Audio & Direct Fan Passes'),
      title3: i === 0 ? (formData.heroTitle3 || 'High-Quality Digital Singles • Collector Vinyl & CDs • Direct Fan Ticketing') : (i === 1 ? 'VIP Fan Pass & Direct Ticketing via TuneBooking' : 'Exclusive VIP Vault Access')
    }))
  }

  // Slide-Specific AI Art Generator
  const handleGenerateHeroArtForSlide = async (slideIndex, promptText) => {
    setHeroAiGenerating(true)
    const effectivePrompt = (promptText || heroAiPrompt || 'Futuristic electronic music stage with neon cyan lasers and holographic visuals, 16:9 banner').trim()
    try {
      let generatedUrl = ''
      try {
        const res = await fetch('/api/social-ai/generate-art', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: effectivePrompt,
            aspect_ratio: '16:9'
          })
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.asset?.media_url) generatedUrl = data.asset.media_url
        }
      } catch (_) {}

      if (!generatedUrl) {
        const cleanPrompt = encodeURIComponent(`${effectivePrompt}, 16:9 widescreen, cinematic lighting, photorealistic, 4k master composition`)
        generatedUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1920&height=1080&nologo=true&seed=${Date.now()}`
      }

      const slides = getInitialHeroSlides().map(s => ({ ...s }))
      if (slides[slideIndex]) {
        slides[slideIndex] = { ...slides[slideIndex], img: generatedUrl }
      } else {
        slides.push({
          id: slideIndex + 1,
          img: generatedUrl,
          title1: formData.artist_name || 'Creator',
          title2: formData.headline || '',
          title3: ''
        })
      }
      const updated = {
        ...formData,
        heroSlides: slides,
        heroImages: slides.map(s => s.img),
        ...(slideIndex === 0 ? { heroImageUrl: generatedUrl } : {})
      }
      setFormData(updated)
      autoSaveEpk(updated)
      showStatus(`Slide ${slideIndex + 1} artwork generated from prompt: "${effectivePrompt.slice(0, 40)}..."!`, 'success')
    } catch {
      const cleanPrompt = encodeURIComponent(`${effectivePrompt || 'music stage neon'}, 16:9 widescreen`)
      const fallbackUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1920&height=1080&nologo=true&seed=${Date.now()}`
      const slides = getInitialHeroSlides().map(s => ({ ...s }))
      if (slides[slideIndex]) {
        slides[slideIndex] = { ...slides[slideIndex], img: fallbackUrl }
      }
      const updated = {
        ...formData,
        heroSlides: slides,
        heroImages: slides.map(s => s.img),
        ...(slideIndex === 0 ? { heroImageUrl: fallbackUrl } : {})
      }
      setFormData(updated)
      autoSaveEpk(updated)
      showStatus(`Slide ${slideIndex + 1} artwork generated!`, 'success')
    } finally {
      setHeroAiGenerating(false)
    }
  }

  // Bio Profile AI Portrait Generator
  const handleGenerateBioProfileArt = async (promptText) => {
    setBioProfileGenerating(true)
    try {
      const res = await fetch('/api/social-ai/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText || bioProfilePrompt || 'Editorial studio portrait of an electronic artist, cinematic lighting',
          aspect_ratio: '1:1'
        })
      })
      let generatedUrl = ''
      if (res.ok) {
        const data = await res.json()
        generatedUrl = data?.asset?.media_url
      }
      if (!generatedUrl) {
        const seedStr = encodeURIComponent((promptText || bioProfilePrompt).slice(0, 20).toLowerCase().replace(/[^a-z0-9]/g, '_'))
        generatedUrl = `https://picsum.photos/seed/${seedStr}_bio_${Date.now()}/800/800`
      }
      updateField('profilePhoto', generatedUrl)
      showStatus('Bio profile portrait generated with AI!', 'success')
    } catch {
      const fallbackUrl = `https://picsum.photos/seed/bio_ai_${Date.now()}/800/800`
      updateField('profilePhoto', fallbackUrl)
      showStatus('Bio profile portrait generated (Sample Seed)!', 'success')
    } finally {
      setBioProfileGenerating(false)
    }
  }

  // Insert Rich Media into Bio Content
  const handleInsertMediaToBio = () => {
    if (!mediaInsertModal?.url) return
    let htmlSnippet = ''
    if (mediaInsertModal.type === 'image') {
      htmlSnippet = `<figure style="margin: 24px 0; text-align: center;"><img src="${mediaInsertModal.url}" alt="${mediaInsertModal.caption || 'Media'}" style="max-width: 100%; height: auto; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 30px rgba(0,0,0,0.5);" />${mediaInsertModal.caption ? `<figcaption style="font-size: 0.82rem; color: #94a3b8; margin-top: 8px;">${mediaInsertModal.caption}</figcaption>` : ''}</figure>`
    } else {
      let embedUrl = mediaInsertModal.url
      if (embedUrl.includes('watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/')
      } else if (embedUrl.includes('youtu.be/')) {
        embedUrl = embedUrl.replace('youtu.be/', 'www.youtube.com/embed/')
      }
      htmlSnippet = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin: 24px 0; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15);"><iframe src="${embedUrl}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe></div>`
    }

    if (htmlMode) {
      updateField('bio', (formData.bio || '') + '\n' + htmlSnippet)
    } else {
      document.execCommand('insertHTML', false, htmlSnippet)
      if (editorRef.current) {
        updateField('bio', editorRef.current.innerHTML)
      }
    }
    setMediaInsertModal(null)
    showStatus(`${mediaInsertModal.type === 'image' ? 'Image' : 'Video'} inserted into Bio narrative!`, 'success')
  }

  // Bulk Catalog Ingestion Parser for Labels & Publishers
  const handleIngestCatalogBatch = () => {
    if (!bulkCsvText.trim()) return
    const lines = bulkCsvText.trim().split('\n')
    const ingested = []
    lines.forEach((line, idx) => {
      const parts = line.split(',').map(p => p.trim())
      if (parts.length >= 2 && !line.toLowerCase().startsWith('title')) {
        ingested.push({
          id: Date.now() + idx,
          title: parts[0] || `Master Cue ${idx + 1}`,
          year: parts[1] || '2026',
          type: parts[2] || 'Single',
          isrc: parts[3] || `KE-TM1-26-${String(idx + 100).padStart(5, '0')}`,
          streams: parts[4] || '100K',
          duration: parts[5] || '3:30',
          priceCredits: parseInt(parts[6]) || 40,
          coverArt: `https://picsum.photos/seed/catalog_${idx + 10}/600/600`
        })
      }
    })

    if (ingested.length > 0) {
      const currentTracks = Array.isArray(formData.tracks) ? [...formData.tracks] : DEFAULT_TRACKS
      updateField('tracks', [...ingested, ...currentTracks])
      setBulkIngestResult({ count: ingested.length })
      setBulkCsvText('')
      showStatus(`Successfully ingested ${ingested.length} releases into Discography!`, 'success')
    } else {
      showStatus('No valid CSV rows parsed. Check format: Title, Year, Type, ISRC, Streams, Duration, Credits', 'error')
    }
  }

  // Save Tour Date from Wizard
  const handleSaveShowsWizard = () => {
    if (!showsWizardData.venue || !showsWizardData.city) {
      showStatus('Venue and City are required.', 'error')
      return
    }
    const newShow = {
      id: Date.now(),
      venue: showsWizardData.venue,
      city: showsWizardData.city,
      date: showsWizardData.date || 'OCT 15, 2026',
      doors: showsWizardData.doors,
      age: showsWizardData.age,
      priceGA: parseFloat(showsWizardData.priceGA) || 25,
      priceVIP: parseFloat(showsWizardData.priceVIP) || 50,
      priceMeet: parseFloat(showsWizardData.priceMeet) || 99,
      status: 'On Sale',
      flyer: showsWizardData.flyer,
      description: showsWizardData.description || 'Live concert tour performance.'
    }
    const current = Array.isArray(formData.shows) ? [...formData.shows] : []
    updateField('shows', [newShow, ...current])
    setShowsWizardOpen(false)
    setShowsWizardStep(1)
    showStatus(`Tour date at ${newShow.venue} added!`, 'success')
  }

  // Save Product from Wizard
  const handleSaveStoreWizard = () => {
    if (!storeWizardData.title) {
      showStatus('Product title is required.', 'error')
      return
    }
    const newProd = {
      id: Date.now(),
      title: storeWizardData.title,
      category: storeWizardData.category,
      price: storeWizardData.price || '$29.99',
      numPrice: parseFloat(String(storeWizardData.price).replace(/[^0-9.]/g, '')) || 29.99,
      img: storeWizardData.images[0] || 'https://picsum.photos/seed/merch/800/800',
      images: storeWizardData.images,
      stock: storeWizardData.stock || 'In Stock',
      desc: storeWizardData.desc || 'Official merchandise item.'
    }
    const current = Array.isArray(formData.products) ? [...formData.products] : []
    updateField('products', [newProd, ...current])
    setStoreWizardOpen(false)
    setStoreWizardStep(1)
    showStatus(`Product "${newProd.title}" added to store!`, 'success')
  }

  const logoFileRef = useRef(null)
  const editorRef = useRef(null)

  useEffect(() => {
    const clean = (activeSubdomain || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    if (!clean) return

    setLoading(true)
    const loadProfile = async () => {
      try {
        let profileData = null
        const cached = localStorage.getItem(`epk_public_${clean}`) || localStorage.getItem(`epk_${clean}`)
        if (cached) {
          try { profileData = JSON.parse(cached) } catch (_) {}
        }

        const res = await fetch(`/api/epk/public/${clean}`)
        if (res.ok) {
          const remote = await res.json()
          profileData = { ...(profileData || {}), ...remote }
        }

        try {
          const cmsRes = await fetch(`/api/cms/epk/${clean}`)
          if (cmsRes.ok) {
            const cmsLayout = await cmsRes.json()
            if (cmsLayout.data) {
              profileData = { ...(profileData || {}), ...cmsLayout.data }
            }
          }
        } catch (_) {}

        // Authoritative Catalogue Data Fetch (Tracks & Ingested Albums)
        try {
          const catRes = await fetch(`/api/catalog/tracks?subdomain=${clean}`)
          if (catRes.ok) {
            const catData = await catRes.json()
            if (Array.isArray(catData.tracks) && catData.tracks.length > 0) {
              profileData.tracks = catData.tracks
            }
          }
        } catch (_) {}

        try {
          const albRes = await fetch(`/api/catalog/albums?subdomain=${clean}`)
          if (albRes.ok) {
            const albData = await albRes.json()
            if (Array.isArray(albData.albums) && albData.albums.length > 0) {
              profileData.albums = albData.albums
            }
          }
        } catch (_) {}

        if (profileData) {
          const rawTracks = (Array.isArray(profileData.tracks) && profileData.tracks.length > 0)
            ? profileData.tracks
            : (Array.isArray(initialTracks) && initialTracks.length > 0 ? initialTracks : DEFAULT_TRACKS)

          const tracksWithCovers = rawTracks.map((t, idx) => ({
            ...t,
            coverArt: t.coverArt || `https://picsum.photos/seed/${encodeURIComponent(t.title || 'track_' + idx)}/600/600`
          }))

          const fullVideos = mergeWithCanonicalVideos(profileData.videos, profileData.artist_name || clean)

          const merged = {
            ...profileData,
            tracks: tracksWithCovers,
            albums: Array.isArray(profileData.albums) ? profileData.albums : [],
            videos: fullVideos
          }
          setFormData(merged)
          if (typeof setEpk === 'function') {
            setEpk(merged)
          }
          try {
            localStorage.setItem(`epk_public_${clean}`, JSON.stringify(merged))
            localStorage.setItem(`epk_${clean}`, JSON.stringify(merged))
          } catch (_) {}
        }
      } catch (err) {
        console.warn('Failed to load profile for CMS studio:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
    loadHistory(clean)
  }, [activeSubdomain])

  const loadHistory = async (subdomain) => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/cms/epk/${subdomain}/history`)
      if (res.ok) {
        const history = await res.json()
        setHistoryList(Array.isArray(history) ? history : [])
      }
    } catch (_) {
      setHistoryList([])
    } finally {
      setHistoryLoading(false)
    }
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      updateField('bio', editorRef.current.innerHTML)
    }
  }

  useEffect(() => {
    if (activeTab === 'bio' && editorRef.current && !htmlMode) {
      editorRef.current.innerHTML = formData.bio || ''
    }
  }, [activeTab, htmlMode])

  const handleLogoFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateField('logoUrl', ev.target.result)
      updateField('logoName', file.name)
      setStatusMsg('Logo uploaded successfully. Remember to click "Save & Sync" to persist.')
      setStatusType('success')
    }
    reader.readAsDataURL(file)
  }

  const handleGenerateTrackCover = async (trackId, trackTitle) => {
    setAiGeneratingCoverId(trackId)
    try {
      const promptText = `Modern high-resolution streaming album cover for music single "${trackTitle}" by ${formData.artist_name || 'artist'}, ${formData.selectedPathway || 'afro-synth'} genre, cinematic studio art, 1:1 vinyl sleeve design`
      
      const res = await fetch('/api/social-ai/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText, aspect_ratio: '1:1' })
      })

      let coverUrl = ''
      if (res.ok) {
        const data = await res.json()
        coverUrl = data?.asset?.media_url
      }
      
      if (!coverUrl) {
        const seedStr = encodeURIComponent((trackTitle || 'cover').toLowerCase().replace(/\s+/g, '_'))
        coverUrl = `https://picsum.photos/seed/${seedStr}_art/600/600`
      }

      const updatedTracks = (formData.tracks || DEFAULT_TRACKS).map(t => {
        if (t.id === trackId) {
          return { ...t, coverArt: coverUrl }
        }
        return t
      })

      updateField('tracks', updatedTracks)
      setStatusMsg(`✨ Generated new AI album cover for "${trackTitle}"!`)
      setStatusType('success')
    } catch (err) {
      const fallbackUrl = `https://picsum.photos/seed/${encodeURIComponent(trackTitle)}/600/600`
      const updatedTracks = (formData.tracks || DEFAULT_TRACKS).map(t => {
        if (t.id === trackId) return { ...t, coverArt: fallbackUrl }
        return t
      })
      updateField('tracks', updatedTracks)
      setStatusMsg(`AI generation fallback applied for "${trackTitle}".`)
      setStatusType('success')
    } finally {
      setAiGeneratingCoverId(null)
    }
  }

  const handleGenerateAiBio = async () => {
    setAiBioGenerating(true)
    try {
      const res = await fetch('/api/cms/epk/bio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_name: formData.artist_name || formData.siteName || activeSubdomain,
          genre: formData.selectedPathway || 'Producer & Creator',
          theme_mood: bioAiPrompt || formData.headline || 'Independent Music Master',
          prompt_notes: bioAiPrompt,
          stems_info: '24-Bit / 96kHz Lossless multitracks pre-cleared for one-stop television & gaming sync placement on SyncMavens.'
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.bio) {
          updateField('bio', data.bio)
          if (editorRef.current) {
            editorRef.current.innerHTML = data.bio
          }
          setStatusMsg('✨ AI Sync Bio generated and updated!')
          setStatusType('success')
        }
      } else {
        const name = formData.artist_name || formData.siteName || activeSubdomain
        const fallbackBio = `<h2>About ${name}</h2>\n<p>${name} is an internationally recognized music creator, producer, and sonic pioneer operating across the global music business ecosystem. Known for genre-blurring productions, ${name} merges hypnotic sonic textures with cutting-edge studio engineering.</p>\n<blockquote>"A singular sonic architect redefining modern sync placement and master rights ownership." — <em>Billboard & SyncMavens Review</em></blockquote>\n<h3>One-Stop Sync Clearance & Broadcast Catalog</h3>\n<p>Holding 100% master rights ownership with lossless multitrack stems distributed through <strong>TuneStream</strong>. All commercial recordings and cues are pre-cleared for one-stop television, gaming, and film sync licensing with automated split distribution managed via Intermaven.</p>`
        updateField('bio', fallbackBio)
        if (editorRef.current) editorRef.current.innerHTML = fallbackBio
        setStatusMsg('AI Bio template applied!')
        setStatusType('success')
      }
    } catch (_) {
      setStatusMsg('Could not reach AI Bio generator; please try again.')
      setStatusType('error')
    } finally {
      setAiBioGenerating(false)
    }
  }

  const handlePageHeaderFile = (pageKey, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const currentHeaders = { ...(formData.pageHeaders || {}) }
      currentHeaders[pageKey] = ev.target.result
      updateField('pageHeaders', currentHeaders)
      setStatusMsg(`Header banner for ${pageKey} updated! Click "Save & Sync" to persist.`)
      setStatusType('success')
    }
    reader.readAsDataURL(file)
  }

  const handleGeneratePageHeader = async (pageKey, pageLabel, promptHint) => {
    setAiGeneratingHeaderKey(pageKey)
    const effectivePrompt = (promptHint || bannerPrompts[pageKey] || `Cinematic widescreen banner for ${pageLabel} of music creator ${formData.artist_name || activeSubdomain}`).trim()
    try {
      let bannerUrl = ''
      try {
        const promptText = `High-resolution widescreen cinematic banner for ${pageLabel} of music creator ${formData.artist_name || activeSubdomain}. ${effectivePrompt}, neon aesthetics, 16:9 aspect ratio, 4K quality`
        const res = await fetch('/api/social-ai/generate-art', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText, aspect_ratio: '3:1' })
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.asset?.media_url) bannerUrl = data.asset.media_url
        }
      } catch (_) {}

      // Prompt-driven AI engine so image accurately reflects user prompt
      if (!bannerUrl) {
        const cleanPrompt = encodeURIComponent(`${effectivePrompt}, ultrawide cinematic banner, stage lighting, 4k ultra detailed`)
        bannerUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1920&height=640&nologo=true&seed=${Date.now()}`
      }

      const updated = {
        ...formData,
        pageHeaders: {
          ...(formData.pageHeaders || {}),
          [pageKey]: bannerUrl
        }
      }
      setFormData(updated)
      autoSaveEpk(updated)
      setStatusMsg(`✨ Generated new AI header banner matching: "${effectivePrompt.slice(0, 45)}..."!`)
      setStatusType('success')
    } catch (err) {
      const cleanPrompt = encodeURIComponent(`${effectivePrompt || pageLabel} banner, ultrawide cinematic 4k`)
      const fallbackUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1920&height=640&nologo=true&seed=${Date.now()}`
      const updated = {
        ...formData,
        pageHeaders: {
          ...(formData.pageHeaders || {}),
          [pageKey]: fallbackUrl
        }
      }
      setFormData(updated)
      autoSaveEpk(updated)
      setStatusMsg(`AI banner applied for ${pageLabel}.`)
      setStatusType('success')
    } finally {
      setAiGeneratingHeaderKey(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setStatusMsg('')
    const cleanSub = (activeSubdomain || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')

    try {
      const payload = {
        ...formData,
        subdomain: cleanSub,
        artist_name: formData.artist_name || formData.siteName || cleanSub.toUpperCase(),
        updated_at: new Date().toISOString()
      }

      localStorage.setItem(`epk_public_${cleanSub}`, JSON.stringify(payload))
      localStorage.setItem(`epk_${cleanSub}`, JSON.stringify(payload))
      localStorage.setItem('last_saved_epk_subdomain', cleanSub)
      if (typeof setEpk === 'function') {
        setEpk(payload)
      }

      await fetch(`/api/cms/epk/${cleanSub}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: payload,
          note: `CMS Studio update for ${cleanSub}`
        })
      })

      try {
        const token = sessionStorage.getItem('tunemavens_token') || localStorage.getItem('token') || ''
        await fetch('/api/epk/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        })
      } catch (_) {}

      setStatusMsg(`✓ Successfully saved & synced Mother-CMS for ${cleanSub}.tunemavens.com!`)
      setStatusType('success')
      loadHistory(cleanSub)
    } catch (err) {
      console.error('Save failed:', err)
      setStatusMsg('Failed to save to backend server. Cached locally.')
      setStatusType('error')
    } finally {
      setSaving(false)
    }
  }

  const handleRollback = async (version) => {
    if (!window.confirm(`Are you sure you want to rollback to Version ${version}? Current unsaved edits will be replaced.`)) return
    
    setLoading(true)
    const cleanSub = (activeSubdomain || 'ndufo').toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    try {
      const res = await fetch(`/api/cms/epk/${cleanSub}/rollback/${version}`, {
        method: 'POST'
      })
      if (res.ok) {
        const restored = await res.json()
        if (restored.data) {
          setFormData(restored.data)
          localStorage.setItem(`epk_public_${cleanSub}`, JSON.stringify(restored.data))
          localStorage.setItem(`epk_${cleanSub}`, JSON.stringify(restored.data))
          setStatusMsg(`✓ Successfully rolled back ${cleanSub} to Version ${version}!`)
          setStatusType('success')
        }
      }
    } catch (err) {
      setStatusMsg(`Rollback to version ${version} failed: ${err.message}`)
      setStatusType('error')
    } finally {
      setLoading(false)
    }
  }

  const currentTheme = EPK_THEMES.find(t => t.bg === formData.themeBg) || EPK_THEMES[0]
  const accent = formData.accentColor || currentTheme?.accent || '#00f0ff'
  const liveUrl = `/#/epk/${activeSubdomain}`

  const tbBtn = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#cbd5e1',
    padding: '6px 10px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 170px)',
      background: '#070a14',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '6px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        background: '#0a0d1d',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: accent,
            boxShadow: `0 0 10px ${accent}`
          }} />
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
              Mother-CMS Studio • Creator Web Worlds
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.15rem' }}>
                Editing Profile:
              </span>
              {(() => {
                const role = sessionUser?.role || 'creator';
                const isAdmin = role === 'admin';
                const isManagerOrLabel = ['label', 'publisher', 'manager'].includes(role);
                const roster = sessionUser?.roster && Array.isArray(sessionUser.roster) && sessionUser.roster.length > 0 
                  ? sessionUser.roster 
                  : ['ndufo', 'kip'];

                const handleSelectCreator = (val) => {
                  setActiveSubdomain(val);
                  try {
                    localStorage.setItem('last_saved_epk_subdomain', val);
                    const cached = localStorage.getItem(`epk_public_${val}`) || localStorage.getItem(`epk_${val}`);
                    if (cached) {
                      const parsed = JSON.parse(cached);
                      if (typeof setEpk === 'function') setEpk(parsed);
                    } else {
                      if (typeof setEpk === 'function') setEpk({ subdomain: val, artist_name: val.toUpperCase() });
                    }
                  } catch (_) {}
                };

                if (isAdmin) {
                  return (
                    <select
                      value={activeSubdomain}
                      onChange={e => handleSelectCreator(e.target.value)}
                      style={{
                        background: '#12182c',
                        border: `1px solid ${accent}66`,
                        borderRadius: '3px',
                        color: accent,
                        padding: '4px 10px',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      title="Admin: Full Network Creator Switcher"
                    >
                      <option value="ndufo">ndufo (Creator EPK)</option>
                      <option value="kip">kip (Kip & The Mavens)</option>
                      <option value="aisha">aisha (Aisha Okoro)</option>
                      {sessionUser?.username && sessionUser.username !== 'ndufo' && sessionUser.username !== 'kip' && (
                        <option value={sessionUser.username}>{sessionUser.username} (Your Profile)</option>
                      )}
                    </select>
                  );
                }

                if (isManagerOrLabel) {
                  return (
                    <select
                      value={activeSubdomain}
                      onChange={e => handleSelectCreator(e.target.value)}
                      style={{
                        background: '#12182c',
                        border: `1px solid ${accent}66`,
                        borderRadius: '3px',
                        color: accent,
                        padding: '4px 10px',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                      title="Roster Artist Switcher"
                    >
                      {roster.map(artist => (
                        <option key={artist} value={artist}>{artist} (Roster Artist)</option>
                      ))}
                    </select>
                  );
                }

                // Default creator: strictly locked to own profile
                return (
                  <span 
                    style={{
                      background: '#12182c',
                      border: `1px solid ${accent}44`,
                      borderRadius: '3px',
                      color: accent,
                      padding: '4px 12px',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      letterSpacing: '0.02em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="Creator: Single Profile Access"
                  >
                    🔒 {activeSubdomain}
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              if (typeof onSwitchToWizard === 'function') {
                onSwitchToWizard();
              } else {
                window.location.hash = '#/epk-builder';
              }
            }}
            style={{
              background: 'rgba(34, 211, 238, 0.12)',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              color: '#00f0ff',
              padding: '10px 16px',
              borderRadius: '3px',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            title="Launch EPK Wizard"
          >
            <span>🧙‍♂️</span> Wizard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              background: accent,
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '3px',
              fontWeight: 900,
              fontSize: '0.88rem',
              cursor: saving ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 4px 14px rgba(0,240,255,0.35)`,
              opacity: saving ? 0.7 : 1
            }}
          >
            <RiSave3Fill /> {saving ? 'Syncing...' : 'Save & Sync Mother-CMS'}
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '3px',
              fontWeight: 800,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RiExternalLinkLine /> Launch Live Site
          </a>
        </div>
      </div>

      {statusMsg && (
        <div style={{
          margin: '12px 24px 0',
          padding: '12px 20px',
          background: statusType === 'error' ? '#1c0e14' : '#071d2c',
          border: `1.5px solid ${statusType === 'error' ? '#f43f5e' : '#00f0ff'}`,
          borderLeft: `5px solid ${statusType === 'error' ? '#f43f5e' : '#00f0ff'}`,
          borderRadius: '4px',
          color: '#ffffff',
          fontSize: '0.86rem',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: statusType === 'error'
            ? '0 8px 26px rgba(244, 63, 94, 0.3), 0 2px 8px rgba(0,0,0,0.85)'
            : '0 8px 28px rgba(0, 240, 255, 0.32), 0 2px 8px rgba(0,0,0,0.85)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: statusType === 'error' ? '#f43f5e' : '#00f0ff',
              color: '#000',
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '3px',
              letterSpacing: '0.04em'
            }}>
              {statusType === 'error' ? 'ALERT' : 'SUCCESS'}
            </span>
            <span style={{ color: '#ffffff' }}>{statusMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg('')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 900,
              width: '24px',
              height: '24px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{
          width: '230px',
          background: '#090d1a',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px 10px',
          gap: '4px',
          flexShrink: 0
        }}>
          {CMS_TABS.map(tab => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isSelected ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                  border: isSelected ? `1px solid ${accent}` : '1px solid transparent',
                  color: isSelected ? accent : '#94a3b8',
                  padding: '10px 14px',
                  borderRadius: '3px',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div style={{
          flex: 1,
          padding: '28px 36px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 240px)'
        }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
              Loading profile for {activeSubdomain}...
            </div>
          ) : (
            <>
              {activeTab === 'brand' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '820px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                    Brand & Header Architecture
                  </h3>

                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: accent, marginBottom: '6px', textTransform: 'uppercase' }}>
                      Brand Logo
                    </label>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '120px',
                        height: '70px',
                        background: '#04060d',
                        border: '1px dashed rgba(255,255,255,0.2)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px'
                      }}>
                        {formData.logoUrl ? (
                          <img src={formData.logoUrl} alt="Brand Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>No Logo</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="file"
                          ref={logoFileRef}
                          onChange={handleLogoFile}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => logoFileRef.current?.click()}
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <RiUploadFill /> Upload New Logo
                          </button>
                          {formData.logoUrl && (
                            <button
                              type="button"
                              onClick={() => { updateField('logoUrl', ''); updateField('logoName', ''); }}
                              style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '8px 12px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {formData.logoName || (formData.logoUrl?.startsWith('data:') ? 'Custom Uploaded Image' : 'No custom logo uploaded yet.')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                        Site Title / Artist Name
                      </label>
                      <input
                        type="text"
                        value={formData.artist_name || formData.siteName || ''}
                        onChange={e => {
                          updateField('artist_name', e.target.value)
                          updateField('siteName', e.target.value)
                        }}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                        Tagline / Sub-Headline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline || formData.headline || ''}
                        onChange={e => {
                          updateField('tagline', e.target.value)
                          updateField('headline', e.target.value)
                        }}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: accent, marginBottom: '8px', textTransform: 'uppercase' }}>
                      Visual Theme Palette
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {EPK_THEMES.slice(0, 8).map(theme => {
                        const isSelected = formData.themeBg === theme.bg
                        return (
                          <div
                            key={theme.id}
                            onClick={() => {
                              updateField('themeBg', theme.bg)
                              updateField('accentColor', theme.accent)
                              updateField('secondaryColor', theme.secondary)
                            }}
                            style={{
                              background: theme.bg,
                              border: isSelected ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                              padding: '12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              boxShadow: isSelected ? `0 0 14px ${accent}44` : 'none'
                            }}
                          >
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>{theme.name}</div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.accent }} />
                              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.secondary }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                        Typography Font
                      </label>
                      <select
                        value={formData.fontFamily || 'Sansation, sans-serif'}
                        onChange={e => updateField('fontFamily', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                      >
                        <option value="Sansation, sans-serif">Sansation (TuneMavens Ecosystem Standard)</option>
                        <option value="'Inter', sans-serif">Inter Clean Modern</option>
                        <option value="'Outfit', sans-serif">Outfit Geometric Tech</option>
                        <option value="'Syne', sans-serif">Syne Contemporary Art</option>
                        <option value="'Space Grotesk', sans-serif">Space Grotesk High-Contrast</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                        Header Layout Alignment
                      </label>
                      <select
                        value={formData.layoutVariant || 'logo-left'}
                        onChange={e => updateField('layoutVariant', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                      >
                        <option value="logo-left">Brand Logo Left / Navigation Center / Actions Right</option>
                        <option value="aside-left">Creator Aside Left / Multitrack Feed Right</option>
                        <option value="centered">Centered Brand Universe</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'hero' && (() => {
                const currentSlides = getInitialHeroSlides()
                const activeSlideIdx = Math.min(selectedHeroSlideIndex, Math.max(0, currentSlides.length - 1))
                const activeSlide = currentSlides[activeSlideIdx] || {
                  id: 1,
                  img: 'https://picsum.photos/seed/producer_studio_gear_1/1200/600',
                  title1: formData.artist_name || 'Creator',
                  title2: formData.headline || 'Producer & Artist',
                  title3: 'High-Quality Digital Singles • Collector Vinyl & CDs'
                }

                const updateActiveSlide = (field, val) => {
                  const updated = [...currentSlides]
                  updated[activeSlideIdx] = { ...updated[activeSlideIdx], [field]: val }
                  updateField('heroSlides', updated)
                  updateField('heroImages', updated.map(s => s.img))
                  if (activeSlideIdx === 0) {
                    if (field === 'title1') updateField('heroTitle1', val)
                    if (field === 'title2') updateField('heroTitle2', val)
                    if (field === 'title3') updateField('heroTitle3', val)
                  }
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '840px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                          Hero Banner Carousel & Slides
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                          Select any slide to edit its visual artwork, 3-tier headline hierarchy, and call-to-action button.
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newSlide = {
                              id: Date.now(),
                              img: `https://picsum.photos/seed/stage_hero_${Date.now()}/1200/600`,
                              title1: formData.artist_name || 'Creator',
                              title2: 'New Featured Showcase 2026',
                              title3: 'Exclusive Fan Access & Collector Physical Editions'
                            }
                            const next = [...currentSlides, newSlide]
                            updateField('heroSlides', next)
                            updateField('heroImages', next.map(s => s.img))
                            setSelectedHeroSlideIndex(next.length - 1)
                            showStatus(`Slide ${next.length} added to Hero Carousel!`, 'success')
                          }}
                          style={{
                            background: accent,
                            color: '#000',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '3px',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiAddLine size={16} /> Add New Slide
                        </button>

                        {currentSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = currentSlides.filter((_, i) => i !== activeSlideIdx)
                              updateField('heroSlides', next)
                              updateField('heroImages', next.map(s => s.img))
                              setSelectedHeroSlideIndex(Math.max(0, activeSlideIdx - 1))
                              showStatus('Slide removed from Hero Carousel.', 'info')
                            }}
                            style={{
                              background: 'rgba(239,68,68,0.15)',
                              border: '1px solid rgba(239,68,68,0.4)',
                              color: '#ef4444',
                              padding: '8px 12px',
                              borderRadius: '3px',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            <RiDeleteBin6Line size={14} /> Remove Slide
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Top Slide Selector Dropdown */}
                    <div style={{ background: '#0a0d1a', border: `1px solid ${accent}44`, padding: '16px 20px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#cbd5e1' }}>Select Slide to Edit:</span>
                        <select
                          value={activeSlideIdx}
                          onChange={e => setSelectedHeroSlideIndex(Number(e.target.value))}
                          style={{
                            padding: '8px 14px',
                            background: '#04060d',
                            border: `1px solid ${accent}66`,
                            borderRadius: '3px',
                            color: '#fff',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {currentSlides.map((slide, idx) => (
                            <option key={idx} value={idx}>
                              Slide {idx + 1}: {slide.title1 || `Slide ${idx + 1}`} ({slide.title2?.slice(0, 24) || 'Visual'})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: accent, fontWeight: 700 }}>
                        Currently Editing Slide {activeSlideIdx + 1} of {currentSlides.length}
                      </div>
                    </div>

                    {/* Slide Headline & Copy Fields */}
                    <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#fff', fontSize: '0.98rem', fontWeight: 800 }}>
                          Slide {activeSlideIdx + 1} Typography & Hierarchy
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Live on Carousel Rotation</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '4px' }}>
                          Line 1: Primary Headline / Artist Identity
                        </label>
                        <input
                          type="text"
                          value={activeSlide.title1 || ''}
                          onChange={e => updateActiveSlide('title1', e.target.value)}
                          placeholder="e.g. Ndufo / World Tour Showcase"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '4px' }}>
                          Line 2: Sub-Headline / Value Proposition / Tour Headline
                        </label>
                        <input
                          type="text"
                          value={activeSlide.title2 || ''}
                          onChange={e => updateActiveSlide('title2', e.target.value)}
                          placeholder="e.g. Electronic & Modular Live Synthesizer Performance"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: '4px' }}>
                          Line 3: Lossless Audio & Direct Commerce Feature Hook
                        </label>
                        <input
                          type="text"
                          value={activeSlide.title3 || ''}
                          onChange={e => updateActiveSlide('title3', e.target.value)}
                          placeholder="e.g. High-Quality Digital Singles • Collector Vinyl & CDs • Direct Fan Ticketing"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                        />
                      </div>
                    </div>

                    {/* Slide 16:9 Image & Dedicated AI Studio */}
                    <div style={{ background: '#0a0d1a', border: `1px solid ${accent}55`, borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <RiSparklingFill color={accent} size={18} />
                          <span style={{ fontWeight: 900, color: '#fff', fontSize: '0.95rem' }}>Slide {activeSlideIdx + 1} Artwork & Visual Prompt Studio</span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>16:9 Cinematic Widescreen</span>
                      </div>

                      {/* Live Image Preview with true 16:9 proportion */}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '440px', minHeight: '260px', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', background: '#02040a' }}>
                        <img
                          src={activeSlide.img || 'https://picsum.photos/seed/slide_ph/1600/900'}
                          alt={`Slide ${activeSlideIdx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%', imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />
                        <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <span style={{ background: accent, color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                              Slide {activeSlideIdx + 1}
                            </span>
                            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', marginTop: '4px' }}>
                              {activeSlide.title1 || 'Hero Title'}
                            </div>
                            <div style={{ color: accent, fontSize: '0.8rem' }}>
                              {activeSlide.title2 || 'Sub-headline'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image URL & Upload controls */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={activeSlide.img || ''}
                          onChange={e => updateActiveSlide('img', e.target.value)}
                          placeholder="Image URL (https://...)"
                          style={{ padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                        />
                        <div>
                          <input
                            id={`slide-file-upload-${activeSlideIdx}`}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = ev => {
                                  updateActiveSlide('img', ev.target.result)
                                  showStatus(`Slide ${activeSlideIdx + 1} custom image loaded!`, 'success')
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                          <label
                            htmlFor={`slide-file-upload-${activeSlideIdx}`}
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff',
                              padding: '9px 14px',
                              borderRadius: '3px',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <RiUploadFill size={14} /> Upload Custom
                          </label>
                        </div>
                      </div>

                      {/* AI Prompting specifically for this slide */}
                      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px', borderRadius: '3px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                          Custom AI Visual Prompt for Slide {activeSlideIdx + 1}
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={heroAiPrompt}
                            onChange={e => setHeroAiPrompt(e.target.value)}
                            placeholder="e.g. Massive festival stage at dusk with neon cyan lasers and holographic visuals, 16:9 banner"
                            style={{ flex: 1, padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                          />
                          <button
                            type="button"
                            disabled={heroAiGenerating}
                            onClick={() => handleGenerateHeroArtForSlide(activeSlideIdx, heroAiPrompt)}
                            style={{
                              background: heroAiGenerating ? 'rgba(34,211,238,0.2)' : accent,
                              color: '#000',
                              border: 'none',
                              padding: '9px 16px',
                              borderRadius: '3px',
                              fontWeight: 900,
                              fontSize: '0.82rem',
                              cursor: heroAiGenerating ? 'wait' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <RiSparklingFill size={14} />
                            {heroAiGenerating ? 'Generating...' : '✨ Generate AI Artwork'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {activeTab === 'banners' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '860px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                      Page Header Banners & Key Visuals
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      Customize distinct high-resolution header images for each page of your Creator Web World. Upload artwork or generate cinematic banners with Social AI.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {BANNER_PAGES.map(bp => {
                      const currentBanner = (formData.pageHeaders && formData.pageHeaders[bp.key]) || bp.defaultImg;
                      const isGenerating = aiGeneratingHeaderKey === bp.key;
                      const fileInputId = `banner-upload-${bp.key}`;

                      return (
                        <div
                          key={bp.key}
                          style={{
                            background: '#0d1326',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '4px',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <strong style={{ color: '#fff', fontSize: '0.98rem' }}>{bp.label}</strong>
                              <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: '8px' }}>
                                (Page Key: <code style={{ color: accent }}>{bp.key}</code>)
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input
                                id={fileInputId}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handlePageHeaderFile(bp.key, e)}
                              />
                              <label
                                htmlFor={fileInputId}
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#cbd5e1',
                                  padding: '6px 12px',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <RiUploadFill size={14} /> Upload Custom
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  setPickerModalConfig({
                                    title: `Select Header Banner: ${bp.label}`,
                                    filterType: 'image',
                                    onSelect: (asset) => {
                                      const next = { ...(formData.pageHeaders || {}) };
                                      next[bp.key] = asset.media_url;
                                      updateField('pageHeaders', next);
                                      showStatus(`Header banner selected for ${bp.label}!`, 'success');
                                    }
                                  });
                                  setPickerModalOpen(true);
                                }}
                                style={{
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  color: '#cbd5e1',
                                  padding: '6px 12px',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <RiFolderUploadFill size={14} /> Assets Library
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setAiModalConfig({
                                    title: `Generate AI Header Banner: ${bp.label}`,
                                    defaultPrompt: bannerPrompts[bp.key] || bp.defaultPrompt,
                                    aspectRatio: '16:9',
                                    onSuccess: (url) => {
                                      const next = { ...(formData.pageHeaders || {}) };
                                      next[bp.key] = url;
                                      updateField('pageHeaders', next);
                                      showStatus(`AI Banner generated for ${bp.label}!`, 'success');
                                    }
                                  });
                                  setAiModalOpen(true);
                                }}
                                disabled={isGenerating}
                                style={{
                                  background: isGenerating ? 'rgba(34,211,238,0.2)' : `linear-gradient(135deg, ${accent}, #8b5cf6)`,
                                  color: '#000',
                                  border: 'none',
                                  padding: '6px 14px',
                                  borderRadius: '3px',
                                  fontSize: '0.8rem',
                                  fontWeight: 900,
                                  cursor: isGenerating ? 'wait' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: `0 0 10px ${accent}44`
                                }}
                              >
                                <RiSparklingFill size={14} /> {isGenerating ? 'Generating AI...' : '✨ Generate AI Banner'}
                              </button>

                              {formData.pageHeaders?.[bp.key] && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = { ...(formData.pageHeaders || {}) };
                                    delete next[bp.key];
                                    updateField('pageHeaders', next);
                                    setStatusMsg(`Reset ${bp.label} banner to default template.`);
                                    setStatusType('success');
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    color: '#f87171',
                                    padding: '6px 10px',
                                    borderRadius: '3px',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                  title="Reset to default banner"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Custom Visual Prompt for this Page Banner */}
                          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '3px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>
                              Custom AI Prompt for {bp.label} Banner
                            </label>
                            <input
                              type="text"
                              value={bannerPrompts[bp.key] !== undefined ? bannerPrompts[bp.key] : bp.defaultPrompt}
                              onChange={e => {
                                const val = e.target.value
                                setBannerPrompts(prev => ({ ...prev, [bp.key]: val }))
                              }}
                              placeholder="Enter custom visual prompt for this banner..."
                              style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                            />
                          </div>

                          {/* Banner Image Preview */}
                          <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '3px', overflow: 'hidden', border: `1px solid ${accent}33` }}>
                            <img
                              src={currentBanner}
                              alt={`${bp.label} Banner`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.4)' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                            <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ background: accent, color: '#000', fontSize: '0.68rem', fontWeight: 900, padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>
                                Live Header
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 800 }}>
                                {bp.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <CmsAssetsStudio
                    subdomain={activeSubdomain}
                    sessionUser={sessionUser}
                  />
                </div>
              )}

              {activeTab === 'bio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '840px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                        Biography, Heritage & Studio Specs
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Customize your profile portrait, rich narrative story, press reviews, and technical studio credentials.
                      </div>
                    </div>
                  </div>

                  {/* 1. Artist Profile Photo & AI Portrait Studio */}
                  <div style={{ background: '#0a0d1a', border: `1px solid ${accent}44`, borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>1. Official Artist Profile Portrait</strong>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Featured in Bio Header & EPK PDF</span>
                    </div>

                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <img
                        src={formData.profilePhoto || formData.heroImageUrl || 'https://picsum.photos/seed/producer_portrait/600/800'}
                        alt="Profile Preview"
                        style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '3px', border: `1px solid ${accent}66`, boxShadow: '0 4px 14px rgba(0,0,0,0.5)' }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={formData.profilePhoto || ''}
                            onChange={e => updateField('profilePhoto', e.target.value)}
                            placeholder="Profile image URL (https://...)"
                            style={{ flex: 1, padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                          />
                          <div>
                            <input
                              id="bio-profile-upload"
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const reader = new FileReader()
                                  reader.onload = ev => {
                                    updateField('profilePhoto', ev.target.result)
                                    showStatus('Custom bio portrait uploaded!', 'success')
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }}
                            />
                            <label
                              htmlFor="bio-profile-upload"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '9px 14px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                              <RiUploadFill size={14} /> Upload
                            </label>
                          </div>
                        </div>

                        {/* AI Portrait Prompting */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={bioProfilePrompt}
                            onChange={e => setBioProfilePrompt(e.target.value)}
                            placeholder="AI Portrait prompt: e.g. High fashion cinematic studio portrait of music producer..."
                            style={{ flex: 1, padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.8rem' }}
                          />
                          <button
                            type="button"
                            disabled={bioProfileGenerating}
                            onClick={() => handleGenerateBioProfileArt(bioProfilePrompt)}
                            style={{ background: bioProfileGenerating ? 'rgba(34,211,238,0.2)' : accent, color: '#000', border: 'none', padding: '7px 14px', borderRadius: '3px', fontWeight: 900, fontSize: '0.78rem', cursor: bioProfileGenerating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                          >
                            <RiSparklingFill size={12} /> {bioProfileGenerating ? 'Generating...' : '✨ AI Portrait'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Main Narrative Biography */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>2. Narrative Artist Biography</strong>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={handleGenerateAiBio}
                          disabled={aiBioGenerating}
                          style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8b5cf6', color: '#c084fc', padding: '6px 12px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: aiBioGenerating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <RiSparklingFill /> {aiBioGenerating ? 'Generating...' : '✨ Generate AI Sync Bio'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setHtmlMode(!htmlMode)}
                          style={{ background: htmlMode ? accent : 'rgba(255,255,255,0.06)', color: htmlMode ? '#000' : '#cbd5e1', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <RiCodeBoxFill /> {htmlMode ? 'Visual Mode' : 'HTML Code'}
                        </button>
                      </div>
                    </div>

                    {!htmlMode && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '8px 10px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px 3px 0 0', borderBottom: 'none' }}>
                        <button type="button" onClick={() => execCmd('bold')} style={tbBtn}><RiBold /></button>
                        <button type="button" onClick={() => execCmd('italic')} style={tbBtn}><RiItalic /></button>
                        <button type="button" onClick={() => execCmd('underline')} style={tbBtn}><RiUnderline /></button>
                        <button type="button" onClick={() => execCmd('strikeThrough')} style={tbBtn}><RiStrikethrough /></button>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
                        <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} style={tbBtn}><RiH2 /></button>
                        <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} style={tbBtn}><RiH3 /></button>
                        <button type="button" onClick={() => execCmd('formatBlock', '<p>')} style={tbBtn}>P</button>
                        <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} style={tbBtn}><RiDoubleQuotesL /></button>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
                        <button type="button" onClick={() => execCmd('insertUnorderedList')} style={tbBtn}><RiListUnordered /></button>
                        <button type="button" onClick={() => execCmd('insertOrderedList')} style={tbBtn}><RiListOrdered /></button>
                        <button type="button" onClick={() => {
                          const url = prompt('Enter link URL (e.g. https://open.spotify.com):')
                          if (url) execCmd('createLink', url)
                        }} style={tbBtn}><RiLink /></button>
                      </div>
                    )}

                    {htmlMode ? (
                      <textarea
                        value={formData.bio || ''}
                        onChange={e => updateField('bio', e.target.value)}
                        style={{ width: '100%', height: '280px', padding: '14px', background: '#05070e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#34d399', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}
                      />
                    ) : (
                      <div
                        ref={editorRef}
                        contentEditable
                        onInput={() => {
                          if (editorRef.current) updateField('bio', editorRef.current.innerHTML)
                        }}
                        style={{ minHeight: '280px', padding: '18px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0 0 3px 3px', color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.7, outline: 'none' }}
                      />
                    )}
                  </div>

                  {/* 3. Featured Press Review Quote & Outlet */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>3. Featured Press Review & Editorial Quote</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Press Quote Excerpt
                        </label>
                        <input
                          type="text"
                          value={formData.pressQuote || ''}
                          onChange={e => updateField('pressQuote', e.target.value)}
                          placeholder='e.g. "A singular sonic architect redefining modern electronic master ownership."'
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Publication / Outlet Name
                        </label>
                        <input
                          type="text"
                          value={formData.pressOutlet || ''}
                          onChange={e => updateField('pressOutlet', e.target.value)}
                          placeholder="e.g. Billboard Magazine / Pitchfork"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Accolades & Studio Protocol Specifications */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>4. Accolades & Studio Protocol Specifications</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Primary Creative Pathway
                        </label>
                        <input
                          type="text"
                          value={formData.creatorPathway || 'Performing Artist & Multitrack Producer'}
                          onChange={e => updateField('creatorPathway', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Verified Intermaven Creator ID
                        </label>
                        <input
                          type="text"
                          value={formData.creatorId || 'IMC-2026-904'}
                          onChange={e => updateField('creatorId', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Studio & Audio Specifications
                        </label>
                        <input
                          type="text"
                          value={formData.studioSpecs || '24-Bit / 96kHz Lossless Broadcast Masters'}
                          onChange={e => updateField('studioSpecs', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Studio Subtext
                        </label>
                        <input
                          type="text"
                          value={formData.studioSubtext || 'High-resolution audio for streaming & physical editions'}
                          onChange={e => updateField('studioSubtext', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Direct Representation & Worldwide Touring Booking */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>5. Direct Representation & Booking Contacts</strong>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Direct Booking Email
                        </label>
                        <input
                          type="email"
                          value={formData.bookingEmail || 'booking@tunemavens.com'}
                          onChange={e => updateField('bookingEmail', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: '4px' }}>
                          Booking & Tour Inquiries Subtext
                        </label>
                        <input
                          type="text"
                          value={formData.bookingSubtext || 'Worldwide touring & festival inquiries'}
                          onChange={e => updateField('bookingSubtext', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'music' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '920px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                        Discography, Master Audio & Stems
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Upload master tracks, studio albums, uncompressed stems, or batch-ingest label catalog releases.
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof onSwitchToWizard === 'function') {
                            onSwitchToWizard();
                          } else {
                            setDiscographyWizardOpen(true)
                            setDiscographyWizardStep(1)
                          }
                        }}
                        style={{
                          background: accent,
                          color: '#000',
                          border: 'none',
                          padding: '9px 16px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiSparklingFill /> Open Catalogue Ingestion Wizard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentTracks = Array.isArray(formData.tracks) ? [...formData.tracks] : DEFAULT_TRACKS
                          const newTrack = {
                            id: Date.now(),
                            title: 'New Master Cue',
                            release: 'Original Studio Master 2026',
                            releaseType: 'single',
                            genre: 'Afro-Futurism',
                            isrc: `KE-TM1-26-${Math.floor(10000 + Math.random() * 90000)}`,
                            streams: '25K',
                            priceCredits: 50,
                            duration: '3:30',
                            coverArt: `https://picsum.photos/seed/single_${Date.now()}/600/600`,
                            masterAudioUrl: 'https://audio.intermaven.io/masters/cue_sample.wav',
                            stemsZipUrl: 'https://audio.intermaven.io/stems/multitrack_sample.zip'
                          }
                          updateField('tracks', [newTrack, ...currentTracks])
                          showStatus('New release added to Discography roster!', 'success')
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '9px 14px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiAddLine /> Quick Add Track
                      </button>
                    </div>
                  </div>

                  {/* Discography Sub-Navigation */}
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                    {[
                      { id: 'tracks', label: 'Singles & Master Tracks', icon: RiMusic2Fill },
                      { id: 'albums', label: 'Studio Albums & Collections', icon: RiDiscFill },
                      { id: 'bulk', label: 'Bulk Catalog Ingestion (CSV)', icon: RiDatabase2Fill }
                    ].map(sub => {
                      const Icon = sub.icon
                      const isSubActive = discographySubTab === sub.id
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setDiscographySubTab(sub.id)}
                          style={{
                            background: isSubActive ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isSubActive ? accent : 'rgba(255,255,255,0.1)'}`,
                            color: isSubActive ? '#fff' : '#94a3b8',
                            padding: '7px 14px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: isSubActive ? 800 : 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Icon size={14} color={isSubActive ? accent : '#64748b'} />
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* Sub-Tab 1: Tracks & Singles */}
                  {discographySubTab === 'tracks' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(Array.isArray(formData.tracks) && formData.tracks.length > 0 ? formData.tracks : DEFAULT_TRACKS).map((track, idx) => {
                        const isGeneratingThis = aiGeneratingCoverId === track.id
                        return (
                          <div
                            key={track.id || idx}
                            style={{
                              background: '#0a0d1a',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              padding: '18px',
                              display: 'flex',
                              gap: '20px',
                              alignItems: 'center',
                              flexWrap: 'wrap'
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '110px',
                                height: '110px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                background: '#03050c',
                                border: `1px solid ${accent}44`,
                                position: 'relative',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                              }}>
                                <img
                                  src={track.coverArt || `https://picsum.photos/seed/${encodeURIComponent(track.title)}/600/600`}
                                  alt={track.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {isGeneratingThis && (
                                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: '0.75rem', fontWeight: 800 }}>
                                    Generating...
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '4px', width: '110px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAiModalConfig({
                                      title: `Generate AI Cover: ${track.title}`,
                                      defaultPrompt: `Afro-futuristic electronic album cover art for track "${track.title}", vivid neon holographic lighting, studio mastering aesthetic, vinyl sleeve texture, 8k crisp resolution`,
                                      aspectRatio: '1:1',
                                      onSuccess: (url) => {
                                        const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                        next[idx].coverArt = url
                                        updateField('tracks', next)
                                        showStatus(`AI Cover applied for ${track.title}!`, 'success')
                                      }
                                    })
                                    setAiModalOpen(true)
                                  }}
                                  disabled={isGeneratingThis}
                                  title="Prompt AI for custom cover artwork"
                                  style={{
                                    flex: 1,
                                    background: '#8b5cf6',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '5px 6px',
                                    borderRadius: '3px',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    cursor: isGeneratingThis ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <RiSparklingFill /> AI
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickerModalConfig({
                                      title: `Select Artwork for ${track.title}`,
                                      filterType: 'image',
                                      onSelect: (asset) => {
                                        const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                        next[idx].coverArt = asset.media_url
                                        updateField('tracks', next)
                                        showStatus(`Selected asset for ${track.title}`, 'success')
                                      }
                                    })
                                    setPickerModalOpen(true)
                                  }}
                                  title="Browse Media Library Assets or Upload"
                                  style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#cbd5e1',
                                    padding: '5px 6px',
                                    borderRadius: '3px',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <RiFolderUploadFill /> Assets
                                </button>
                              </div>
                            </div>

                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', gap: '12px', minWidth: '320px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>Track Title</label>
                                <input
                                  type="text"
                                  value={track.title || ''}
                                  onChange={e => {
                                    const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                    next[idx].title = e.target.value
                                    updateField('tracks', next)
                                  }}
                                  style={{ width: '100%', padding: '8px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>Release / Album Tag</label>
                                <input
                                  type="text"
                                  value={track.release || ''}
                                  onChange={e => {
                                    const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                    next[idx].release = e.target.value
                                    updateField('tracks', next)
                                  }}
                                  style={{ width: '100%', padding: '8px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>ISRC Code</label>
                                <input
                                  type="text"
                                  value={track.isrc || ''}
                                  onChange={e => {
                                    const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                    next[idx].isrc = e.target.value
                                    updateField('tracks', next)
                                  }}
                                  style={{ width: '100%', padding: '8px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>Stems Credits</label>
                                <input
                                  type="number"
                                  value={track.priceCredits || 50}
                                  onChange={e => {
                                    const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                    next[idx].priceCredits = Number(e.target.value)
                                    updateField('tracks', next)
                                  }}
                                  style={{ width: '100%', padding: '8px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                                />
                              </div>

                              <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>Cover Image URL (Direct Override)</label>
                                <input
                                  type="text"
                                  value={track.coverArt || ''}
                                  onChange={e => {
                                    const next = [...(formData.tracks || DEFAULT_TRACKS)]
                                    next[idx].coverArt = e.target.value
                                    updateField('tracks', next)
                                  }}
                                  placeholder="https://..."
                                  style={{ width: '100%', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const next = (formData.tracks || DEFAULT_TRACKS).filter((_, i) => i !== idx)
                                updateField('tracks', next)
                              }}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                              title="Remove Track"
                            >
                              <RiDeleteBin6Line size={18} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Sub-Tab 2: Studio Albums & Collections */}
                  {discographySubTab === 'albums' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(() => {
                        const albumList = (Array.isArray(formData.albums) && formData.albums.length > 0)
                          ? formData.albums
                          : [
                              {
                                id: 'def-1',
                                title: 'Echoes from the Future (Deluxe Edition)',
                                type: 'Album',
                                year: '2026',
                                genre: 'Afro-Futurism / Electronic',
                                tracksCount: 8,
                                cover: formData.heroImages?.[0] || 'https://picsum.photos/seed/album_deluxe/400/400',
                                priceCredits: 50
                              }
                            ];

                        return albumList.map((alb, aIdx) => {
                          const matchingTracks = (formData.tracks || []).filter(t => 
                            (t.release && alb.title && t.release.toLowerCase().trim() === alb.title.toLowerCase().trim()) ||
                            (alb.isrcs && alb.isrcs.includes(t.isrc))
                          );
                          const count = alb.tracksCount || matchingTracks.length || 1;

                          return (
                            <div key={alb.id || aIdx} style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '18px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <img
                                src={alb.cover || alb.coverArt || `https://picsum.photos/seed/${encodeURIComponent(alb.title)}/400/400`}
                                alt={alb.title}
                                style={{ width: '130px', height: '130px', borderRadius: '4px', objectFit: 'cover', border: `1px solid ${accent}40`, flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                  <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{alb.title}</strong>
                                  <span style={{ fontSize: '0.72rem', background: 'rgba(0,240,255,0.15)', color: accent, padding: '3px 10px', borderRadius: '3px', fontWeight: 900, textTransform: 'uppercase' }}>
                                    ● {alb.type || 'ALBUM'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                                  Release Year: <strong style={{ color: '#cbd5e1' }}>{alb.year || '2026'}</strong> · <strong style={{ color: accent }}>{count} Full Master Track(s)</strong> · Genre: <strong style={{ color: '#cbd5e1' }}>{alb.genre || 'Afro-House'}</strong> · 24-Bit / 96kHz Lossless Masters
                                </div>
                                {matchingTracks.length > 0 && (
                                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                                    Tracks: {matchingTracks.map(t => t.title).slice(0, 5).join(', ')}{matchingTracks.length > 5 ? ` +${matchingTracks.length - 5} more` : ''}
                                  </div>
                                )}
                                <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '0.82rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                  <span>Digital Price: <strong style={{ color: '#00f0ff' }}>${((alb.priceCredits || 50) * 0.199).toFixed(2)} / {alb.priceCredits || 50} Credits</strong></span>
                                  <span>Primary ISRC: <strong style={{ color: '#cbd5e1' }}>{alb.isrc || 'KE-TM1-26-00042'}</strong></span>
                                  <button
                                    type="button"
                                    onClick={() => setDiscographySubTab('tracks')}
                                    style={{
                                      background: 'rgba(255,255,255,0.06)',
                                      border: `1px solid ${accent}44`,
                                      color: accent,
                                      fontSize: '0.75rem',
                                      padding: '3px 10px',
                                      borderRadius: '3px',
                                      cursor: 'pointer',
                                      fontWeight: 800
                                    }}
                                  >
                                    View Tracks in Manager
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}

                  {/* Sub-Tab 3: Bulk CSV Catalog Ingestion */}
                  {discographySubTab === 'bulk' && (
                    <div style={{ background: '#0a0f1d', border: `1px solid ${accent}40`, borderRadius: '6px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.95rem' }}>Bulk Catalog Ingestion for Labels & Publishers</strong>
                          <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Paste CSV rows formatted as: <code style={{ color: accent, background: '#03050c', padding: '2px 6px' }}>Title, Year, Type, ISRC, Streams, Duration, Credits</code>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBulkCsvText(
                              "Rift Valley Odyssey, 2026, Single, KE-TM1-26-00101, 140K, 3:45, 50\n" +
                              "Ancestral Synthesizer, 2026, EP, KE-TM1-26-00102, 95K, 4:12, 40\n" +
                              "Solar Flare Stems Pack, 2026, Stems, KE-TM1-26-00103, 60K, 3:20, 60\n" +
                              "Equator Nightclub Dub, 2026, Club Mix, KE-TM1-26-00104, 210K, 5:10, 45"
                            )
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: '3px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Load Sample CSV Template
                        </button>
                      </div>

                      <textarea
                        rows="6"
                        value={bulkCsvText}
                        onChange={e => setBulkCsvText(e.target.value)}
                        placeholder="Title, Year, Type, ISRC, Streams, Duration, Credits"
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: '#04060d',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '4px',
                          color: '#34d399',
                          fontFamily: 'monospace',
                          fontSize: '0.82rem',
                          lineHeight: 1.5
                        }}
                      />

                      {bulkIngestResult && (
                        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '10px 14px', borderRadius: '4px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <RiCheckLine size={16} /> Successfully ingested {bulkIngestResult.count} releases into creator discography!
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Automatic metadata indexing with MongoDB · Instant Sync Licensing clearance
                        </span>
                        <button
                          type="button"
                          onClick={handleIngestCatalogBatch}
                          style={{
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '9px 18px',
                            borderRadius: '3px',
                            fontWeight: 900,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <RiDatabase2Fill size={16} /> Ingest Catalog Batch
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '900px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                          Multi-Video Reel & 4K Streaming Catalog
                        </h3>
                        <span style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent, padding: '2px 8px', borderRadius: '3px', fontSize: '0.72rem', fontWeight: 800 }}>
                          {activeVideos.length} Active Videos
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                        Configure YouTube, Vimeo, and direct MP4 video streams displayed on your live EPK reel and media gallery.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newId = Date.now()
                        const newVideo = {
                          id: newId,
                          type: 'video',
                          title: `New Video #${activeVideos.length + 1}`,
                          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                          youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                          thumbnail: `https://picsum.photos/seed/video_${newId}/600/340`,
                          views: '100K views',
                          category: 'Official Video'
                        }
                        const next = [...activeVideos, newVideo]
                        updateField('videos', next)
                        showStatus('New video slot added to media reel! Click "Publish Live EPK" to push live.', 'success')
                      }}
                      style={{ background: accent, color: '#000', border: 'none', padding: '9px 18px', borderRadius: '3px', fontWeight: 900, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <RiAddLine size={16} /> Add Video Stream
                    </button>
                  </div>

                  {/* Multi-Video Collection List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeVideos.map((vItem, vIdx) => {
                      const displayThumb = vItem.thumbnail || getYouTubeThumbnail(vItem.url) || 'https://picsum.photos/seed/vid/600/340'
                      return (
                        <div 
                          key={vItem.id || vIdx} 
                          style={{ 
                            background: '#0a0d1a', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            padding: '18px', 
                            borderRadius: '4px', 
                            display: 'grid', 
                            gridTemplateColumns: '140px 1fr auto', 
                            gap: '18px', 
                            alignItems: 'start' 
                          }}
                        >
                          {/* Thumbnail preview with category & order tag */}
                          <div style={{ position: 'relative', width: '140px' }}>
                            <img 
                              src={displayThumb} 
                              alt={vItem.title} 
                              style={{ width: '140px', height: '80px', objectFit: 'cover', borderRadius: '3px', border: `1px solid ${accent}44`, display: 'block' }} 
                            />
                            <div style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.8)', color: accent, fontSize: '0.68rem', fontWeight: 900, padding: '2px 6px', borderRadius: '2px', border: `1px solid ${accent}33` }}>
                              #{vIdx + 1}
                            </div>
                            {vItem.category && (
                              <div style={{ position: 'absolute', bottom: '4px', left: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', color: '#cbd5e1', fontSize: '0.62rem', fontWeight: 700, padding: '2px 4px', borderRadius: '2px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {vItem.category}
                              </div>
                            )}
                          </div>

                          {/* Video Form Fields */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* Title */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Video Title
                              </label>
                              <input
                                type="text"
                                value={vItem.title || ''}
                                onChange={e => {
                                  const next = [...activeVideos]
                                  next[vIdx] = { ...vItem, title: e.target.value }
                                  updateField('videos', next)
                                }}
                                placeholder="Video Title (e.g. Artist — Official 4K Music Video)"
                                style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem', fontWeight: 800 }}
                              />
                            </div>

                            {/* Stream URL */}
                            <div>
                              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Video Stream URL (YouTube, Vimeo, or MP4)
                              </label>
                              <input
                                type="text"
                                value={vItem.url || vItem.youtubeUrl || ''}
                                onChange={e => {
                                  const newUrl = e.target.value
                                  const autoThumb = getYouTubeThumbnail(newUrl)
                                  const next = [...activeVideos]
                                  next[vIdx] = { 
                                    ...vItem, 
                                    url: newUrl,
                                    thumbnail: autoThumb || vItem.thumbnail || ''
                                  }
                                  updateField('videos', next)
                                }}
                                placeholder="https://www.youtube.com/watch?v=..."
                                style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#cbd5e1', fontSize: '0.8rem', fontFamily: 'monospace' }}
                              />
                            </div>

                            {/* Two Columns: Category & Views Badge */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Category / Type
                                </label>
                                <select
                                  value={vItem.category || 'Official Video'}
                                  onChange={e => {
                                    const next = [...activeVideos]
                                    next[vIdx] = { ...vItem, category: e.target.value }
                                    updateField('videos', next)
                                  }}
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}
                                >
                                  <option value="Official Video">Official Video</option>
                                  <option value="Live Concert">Live Concert</option>
                                  <option value="Behind the Scenes">Behind the Scenes</option>
                                  <option value="Studio Session">Studio Session</option>
                                  <option value="Acoustic Session">Acoustic Session</option>
                                  <option value="Teaser / Trailer">Teaser / Trailer</option>
                                  <option value="Interview">Interview</option>
                                </select>
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                    Views / Badge Label
                                  </label>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const vidUrl = vItem.url || vItem.youtubeUrl;
                                      if (!vidUrl) return;
                                      try {
                                        const res = await fetch(`/api/social-ai/video-stats?url=${encodeURIComponent(vidUrl)}`);
                                        if (res.ok) {
                                          const stats = await res.json();
                                          if (stats.views_formatted) {
                                            const next = [...activeVideos];
                                            next[vIdx] = { ...vItem, views: stats.views_formatted, youtube_stats: stats };
                                            updateField('videos', next);
                                            showStatus(`Live YouTube views fetched: ${stats.views_formatted}!`, 'success');
                                          }
                                        }
                                      } catch (err) {
                                        console.warn('Failed to fetch live YouTube stats:', err);
                                      }
                                    }}
                                    title="Fetch actual live view count directly from YouTube"
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.15)',
                                      border: '1px solid rgba(239, 68, 68, 0.4)',
                                      color: '#f87171',
                                      padding: '2px 7px',
                                      borderRadius: '2px',
                                      fontSize: '0.66rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    <RiRefreshLine size={11} /> Live YouTube Views
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={vItem.views || ''}
                                  onChange={e => {
                                    const next = [...activeVideos]
                                    next[vIdx] = { ...vItem, views: e.target.value }
                                    updateField('videos', next)
                                  }}
                                  placeholder="e.g. 1.2M views, 4K Concert"
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.8rem' }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Preview & Delete */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                            {(vItem.url || vItem.youtubeUrl) && (
                              <a
                                href={vItem.url || vItem.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: accent, padding: '6px 10px', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                                title="Open video in new tab"
                              >
                                <RiExternalLinkLine size={14} /> Preview
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const next = activeVideos.filter((_, i) => i !== vIdx)
                                updateField('videos', next)
                                showStatus('Video removed from reel.', 'success')
                              }}
                              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer', padding: '6px 10px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                              title="Delete this video"
                            >
                              <RiDeleteBin6Line size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'shows' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                        Live Tour Dates & VIP Ticketing
                      </h3>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                        Manage tour stops, doors, age limits, multi-tier tickets (GA, VIP, Meet & Greet), and show descriptions.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowsWizardOpen(!showsWizardOpen)
                          setShowsWizardStep(1)
                        }}
                        style={{
                          background: showsWizardOpen ? 'rgba(0,240,255,0.15)' : accent,
                          color: showsWizardOpen ? accent : '#000',
                          border: `1px solid ${accent}`,
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiSparklingFill /> {showsWizardOpen ? 'Close Tour Wizard' : 'Launch Tour Date Wizard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(formData.shows) ? [...formData.shows] : []
                          const newShow = {
                            id: Date.now(),
                            date: 'NOV 20, 2026',
                            venue: 'New Music Hall',
                            city: 'Atlanta, US',
                            doors: '7:00 PM',
                            age: '18+',
                            priceGA: 30,
                            priceVIP: 65,
                            priceMeet: 110,
                            status: 'On Sale',
                            description: 'Headline live performance with immersive audio-visual showcase.',
                            flyer: 'https://picsum.photos/seed/tour_flyer_atl/600/800'
                          }
                          updateField('shows', [newShow, ...current])
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiAddLine /> Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Shows List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(Array.isArray(formData.shows) && formData.shows.length > 0 ? formData.shows : [
                      { id: 101, date: 'SEP 18, 2026', venue: 'Nairobi Cyberdome', city: 'Nairobi, Kenya', priceGA: 25, priceVIP: 50, priceMeet: 99, status: 'On Sale', description: 'Headline album release concert featuring guest vocalists and live percussion.' },
                      { id: 102, date: 'OCT 04, 2026', venue: 'London O2 Academy', city: 'London, UK', priceGA: 38, priceVIP: 75, priceMeet: 140, status: 'Selling Fast', description: 'European tour launch stop with special guest electronic modular duo.' }
                    ]).map((show, idx) => (
                      <div key={show.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.4fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={show.date || ''}
                            onChange={e => {
                              const next = [...(formData.shows || [])]
                              if (next[idx]) next[idx].date = e.target.value
                              updateField('shows', next)
                            }}
                            placeholder="Date"
                            style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            value={show.venue || ''}
                            onChange={e => {
                              const next = [...(formData.shows || [])]
                              if (next[idx]) next[idx].venue = e.target.value
                              updateField('shows', next)
                            }}
                            placeholder="Venue"
                            style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            value={show.city || ''}
                            onChange={e => {
                              const next = [...(formData.shows || [])]
                              if (next[idx]) next[idx].city = e.target.value
                              updateField('shows', next)
                            }}
                            placeholder="City"
                            style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                          />
                          <input
                            type="text"
                            value={show.status || ''}
                            onChange={e => {
                              const next = [...(formData.shows || [])]
                              if (next[idx]) next[idx].status = e.target.value
                              updateField('shows', next)
                            }}
                            placeholder="Status"
                            style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (formData.shows || []).filter((_, i) => i !== idx)
                              updateField('shows', next)
                            }}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                            title="Delete Show"
                          >
                            <RiDeleteBin6Line size={16} />
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '10px', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>GA: $</span>
                            <input
                              type="number"
                              value={show.priceGA ?? 25}
                              onChange={e => {
                                const next = [...(formData.shows || [])]
                                if (next[idx]) next[idx].priceGA = parseFloat(e.target.value) || 0
                                updateField('shows', next)
                              }}
                              style={{ width: '100%', padding: '6px 8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '0.78rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VIP: $</span>
                            <input
                              type="number"
                              value={show.priceVIP ?? 50}
                              onChange={e => {
                                const next = [...(formData.shows || [])]
                                if (next[idx]) next[idx].priceVIP = parseFloat(e.target.value) || 0
                                updateField('shows', next)
                              }}
                              style={{ width: '100%', padding: '6px 8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '0.78rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Meet: $</span>
                            <input
                              type="number"
                              value={show.priceMeet ?? 99}
                              onChange={e => {
                                const next = [...(formData.shows || [])]
                                if (next[idx]) next[idx].priceMeet = parseFloat(e.target.value) || 0
                                updateField('shows', next)
                              }}
                              style={{ width: '100%', padding: '6px 8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#fff', fontSize: '0.78rem' }}
                            />
                          </div>
                          <input
                            type="text"
                            value={show.description || ''}
                            onChange={e => {
                              const next = [...(formData.shows || [])]
                              if (next[idx]) next[idx].description = e.target.value
                              updateField('shows', next)
                            }}
                            placeholder="Event description / guest lineup note"
                            style={{ width: '100%', padding: '6px 8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px', color: '#94a3b8', fontSize: '0.78rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'store' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                        Creator Merch, Vinyl & Stems Catalog
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Fans can purchase limited vinyl, signed apparel, and multitracks with card or TM Credits.
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setStoreWizardOpen(!storeWizardOpen)
                          setStoreWizardStep(1)
                        }}
                        style={{
                          background: storeWizardOpen ? 'rgba(0,240,255,0.15)' : accent,
                          color: storeWizardOpen ? accent : '#000',
                          border: `1px solid ${accent}`,
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiSparklingFill /> {storeWizardOpen ? 'Close Merch Wizard' : 'Launch Merch Wizard'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(formData.products) ? [...formData.products] : []
                          const newProd = {
                            id: Date.now(),
                            title: 'Signed Limited Tour Lithograph',
                            price: '$29.99',
                            category: 'merch',
                            stock: 'In Stock',
                            img: 'https://picsum.photos/seed/merch_litho/800/800',
                            images: ['https://picsum.photos/seed/merch_litho/800/800']
                          }
                          updateField('products', [newProd, ...current])
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RiAddLine /> Quick Add
                      </button>
                    </div>
                  </div>

                  {/* Store Products List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(Array.isArray(formData.products) && formData.products.length > 0 ? formData.products : [
                      { id: 201, title: 'Limited 180g Vinyl LP', price: '$34.99', stock: '25 copies left' },
                      { id: 202, title: 'Tour Heavyweight Hoodie', price: '$59.99', stock: 'In Stock' },
                      { id: 203, title: 'Lossless 24-Bit WAV Multitracks Pack', price: '$19.99', stock: 'Instant Digital' }
                    ]).map((prod, idx) => (
                      <div key={prod.id || idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'center', background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '4px' }}>
                        <input
                          type="text"
                          value={prod.title || ''}
                          onChange={e => {
                            const next = [...(formData.products || [])]
                            if (next[idx]) next[idx].title = e.target.value
                            updateField('products', next)
                          }}
                          placeholder="Title"
                          style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          value={prod.price || ''}
                          onChange={e => {
                            const next = [...(formData.products || [])]
                            if (next[idx]) next[idx].price = e.target.value
                            updateField('products', next)
                          }}
                          placeholder="Price"
                          style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          value={prod.stock || ''}
                          onChange={e => {
                            const next = [...(formData.products || [])]
                            if (next[idx]) next[idx].stock = e.target.value
                            updateField('products', next)
                          }}
                          placeholder="Stock"
                          style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#94a3b8', fontSize: '0.82rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (formData.products || []).filter((_, i) => i !== idx)
                            updateField('products', next)
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                          title="Delete Product"
                        >
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'press' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '840px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                        Press Kit, EPK Downloads & Industry Testimonials
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                        Manage editorial quotes, high-res photo assets, stage plots, and downloadable PDF press kits.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setPressWizardOpen(!pressWizardOpen)
                          setPressWizardStep(1)
                        }}
                        style={{
                          background: pressWizardOpen ? 'rgba(0,240,255,0.15)' : accent,
                          color: pressWizardOpen ? accent : '#000',
                          border: `1px solid ${accent}`,
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <RiSparklingFill /> {pressWizardOpen ? 'Close Press Wizard' : 'Launch EPK Press Wizard'}
                      </button>
                    </div>
                  </div>

                  {/* Standard Press Fields */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                      Primary Press Quote
                    </label>
                    <textarea
                      rows="3"
                      value={formData.pressQuote || ''}
                      onChange={e => updateField('pressQuote', e.target.value)}
                      placeholder="One of the sharpest sonic innovators in the business today..."
                      style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                      Press Outlet Name
                    </label>
                    <input
                      type="text"
                      value={formData.pressOutlet || ''}
                      onChange={e => updateField('pressOutlet', e.target.value)}
                      placeholder="Sound On Sound, Pitchfork, Rolling Stone..."
                      style={{ width: '100%', padding: '10px 12px', background: '#0a0d18', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.88rem' }}
                    />
                  </div>

                  {/* Accolades & Quotes List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1' }}>
                        Critical Accolades & Testimonials Roster
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const current = Array.isArray(formData.accolades) ? [...formData.accolades] : []
                          updateField('accolades', [...current, { quote: 'Astonishing live performance.', outlet: 'Mixmag', year: '2026' }])
                        }}
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <RiAddLine /> Add Accolade
                      </button>
                    </div>

                    {(Array.isArray(formData.accolades) && formData.accolades.length > 0 ? formData.accolades : [
                      { quote: 'A monumental sonic leap forward in African modular electronic production.', outlet: 'Rolling Stone Africa', year: '2026' },
                      { quote: 'Unquestionably one of the most exciting live electronic performers of this decade.', outlet: 'Resident Advisor', year: '2026' }
                    ]).map((acc, idx) => (
                      <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '10px', alignItems: 'center', background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '4px' }}>
                        <input
                          type="text"
                          value={acc.quote}
                          onChange={e => {
                            const next = [...(formData.accolades || [])]
                            if (next[idx]) next[idx].quote = e.target.value
                            updateField('accolades', next)
                          }}
                          placeholder="Quote"
                          style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                        />
                        <input
                          type="text"
                          value={acc.outlet}
                          onChange={e => {
                            const next = [...(formData.accolades || [])]
                            if (next[idx]) next[idx].outlet = e.target.value
                            updateField('accolades', next)
                          }}
                          placeholder="Outlet / Publication"
                          style={{ padding: '8px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (formData.accolades || []).filter((_, i) => i !== idx)
                            updateField('accolades', next)
                          }}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '840px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                      Representation, Bookings & Smart CRM Lead Routing
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                      Define executive representation contacts for booking, management, PR, legal, and tech riders with automatic routing to Intermaven Smart CRM.
                    </p>
                  </div>

                  {/* 1. Booking Agency */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>1. Booking Agency & Responsible Agent</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Booking Agency</label>
                        <input
                          type="text"
                          value={formData.bookingAgency || 'United Talent Agency / Intermaven Global'}
                          onChange={e => updateField('bookingAgency', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Responsible Agent Name</label>
                        <input
                          type="text"
                          value={formData.bookingAgentName || 'Marcus Vance'}
                          onChange={e => updateField('bookingAgentName', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Official Booking Email *</label>
                        <input
                          type="email"
                          value={formData.bookingEmail || 'booking@ndufo.com'}
                          onChange={e => updateField('bookingEmail', e.target.value)}
                          placeholder="booking@creator.com"
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Territory Coverage</label>
                        <input
                          type="text"
                          value={formData.bookingTerritory || 'Worldwide (Excluding Japan)'}
                          onChange={e => updateField('bookingTerritory', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Artist Management */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>2. Artist Management</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Management Company</label>
                        <input
                          type="text"
                          value={formData.mgmtCompany || 'Aura Sound Management'}
                          onChange={e => updateField('mgmtCompany', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Manager Name</label>
                        <input
                          type="text"
                          value={formData.managerName || 'Elena Rostova'}
                          onChange={e => updateField('managerName', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Manager Direct Email</label>
                        <input
                          type="email"
                          value={formData.mgmtEmail || 'mgmt@ndufo.com'}
                          onChange={e => updateField('mgmtEmail', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Press & PR Publicist */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>3. Press & Public Relations (PR)</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>PR Firm / Publicist</label>
                        <input
                          type="text"
                          value={formData.prFirm || 'Stereo Public Relations'}
                          onChange={e => updateField('prFirm', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>PR Inquiries Email</label>
                        <input
                          type="email"
                          value={formData.prEmail || 'press@ndufo.com'}
                          onChange={e => updateField('prEmail', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Legal & Publishing Administration */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>4. Legal & Publishing Administration</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Entertainment Attorney / Counsel</label>
                        <input
                          type="text"
                          value={formData.legalCounsel || 'Sterling & Cross LLP (attn: J. Sterling)'}
                          onChange={e => updateField('legalCounsel', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Publishing Administrator & PRO</label>
                        <input
                          type="text"
                          value={formData.publishingAdmin || 'Intermaven Songs / ASCAP (IPI 00892182)'}
                          onChange={e => updateField('publishingAdmin', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Production & Technical Rider Contact */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>5. Production & Technical Rider Contact</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>FOH / Production Engineer</label>
                        <input
                          type="text"
                          value={formData.techEngineer || 'David K. Ochieng (Sound Engineer)'}
                          onChange={e => updateField('techEngineer', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Production Email</label>
                        <input
                          type="email"
                          value={formData.techEmail || 'production@ndufo.com'}
                          onChange={e => updateField('techEmail', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Social Media URLs */}
                  <div style={{ background: '#0a0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      <strong style={{ color: '#fff', fontSize: '0.9rem' }}>6. Streaming & Social Media Channels</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Spotify Artist URL</label>
                        <input
                          type="text"
                          value={formData.spotify || ''}
                          onChange={e => updateField('spotify', e.target.value)}
                          placeholder="https://open.spotify.com/artist/..."
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Instagram Profile URL</label>
                        <input
                          type="text"
                          value={formData.instagram || ''}
                          onChange={e => updateField('instagram', e.target.value)}
                          placeholder="https://instagram.com/..."
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. Smart CRM Inbound Routing */}
                  <div style={{ background: 'rgba(0,240,255,0.03)', border: `1px solid ${accent}30`, borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RiSparklingFill color={accent} />
                        <strong style={{ color: '#fff', fontSize: '0.9rem' }}>Smart CRM Inbound Lead Routing</strong>
                      </div>
                      <span style={{ fontSize: '0.72rem', background: '#10b98120', color: '#10b981', padding: '2px 8px', borderRadius: '10px', border: '1px solid #10b98140', fontWeight: 800 }}>
                        ● Intermaven Engine Linked
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Inbound Fan Signups Route To</label>
                        <select
                          value={formData.crmFanRoute || 'fan_portal_vip'}
                          onChange={e => updateField('crmFanRoute', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        >
                          <option value="fan_portal_vip">Creator CRM (VIP Fan Pipeline)</option>
                          <option value="newsletter">Email Newsletter Broadcast</option>
                          <option value="tour_announcement">Tour Pre-Sale Alert List</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Industry Inquiries Default Stage</label>
                        <select
                          value={formData.crmIndustryStage || 'qualified'}
                          onChange={e => updateField('crmIndustryStage', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                        >
                          <option value="qualified">Qualified Lead (Booking/Sync)</option>
                          <option value="inquiry">General Inquiry</option>
                          <option value="contract_sent">Contract Under Review</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '820px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                        Version Snapshots & One-Click Rollbacks
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        Every save writes an immutable snapshot to MongoDB (`cms_layout_history`).
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadHistory(activeSubdomain)}
                      disabled={historyLoading}
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: '3px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RiRefreshLine /> Refresh History
                    </button>
                  </div>

                  {historyLoading ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading snapshot history...</div>
                  ) : historyList.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', background: '#0a0d1a', borderRadius: '4px' }}>
                      No previous snapshots recorded yet for {activeSubdomain}. Click "Save & Sync" to create Version 1.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {historyList.map(item => (
                        <div
                          key={item.version}
                          style={{
                            background: '#0a0d1a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '14px 18px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ background: accent, color: '#000', padding: '2px 8px', borderRadius: '3px', fontWeight: 900, fontSize: '0.75rem' }}>
                                v{item.version}
                              </span>
                              <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{item.data?.headline || item.data?.artist_name || 'Snapshot'}</strong>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                              Saved {item.created_at ? new Date(item.created_at).toLocaleString() : 'recently'}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRollback(item.version)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#f87171',
                              padding: '6px 14px',
                              borderRadius: '3px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              cursor: 'pointer'
                            }}
                          >
                            Rollback to v{item.version}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* ================= RICH TEXT MEDIA INSERTION MODAL ================= */}
      {mediaInsertModal && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setMediaInsertModal(null); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0a0d1a', border: `2px solid ${accent}`, borderRadius: '4px', width: '100%', maxWidth: '460px', padding: '24px', color: '#fff', position: 'relative' }}>
            <button onClick={() => setMediaInsertModal(null)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>

            <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem', fontWeight: 900, color: accent }}>
              Insert {mediaInsertModal.type === 'image' ? 'Image' : 'Video Embed'} into Narrative
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  {mediaInsertModal.type === 'image' ? 'Image URL' : 'YouTube / Vimeo / Video URL'}
                </label>
                <input
                  type="text"
                  placeholder={mediaInsertModal.type === 'image' ? 'https://example.com/photo.jpg' : 'https://www.youtube.com/watch?v=...'}
                  value={mediaInsertModal.url}
                  onChange={e => setMediaInsertModal(prev => ({ ...prev, url: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Studio session recording live modular synth lines"
                  value={mediaInsertModal.caption}
                  onChange={e => setMediaInsertModal(prev => ({ ...prev, caption: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setMediaInsertModal(null)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.06)', color: '#fff', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertMediaToBio}
                  style={{ flex: 1, background: accent, color: '#000', border: 'none', padding: '10px', borderRadius: '3px', fontWeight: 900, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Insert into Bio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    
      {/* ================= MODAL 1: DISCOGRAPHY RELEASE SETUP WIZARD ================= */}
      {discographyWizardOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 16, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#090d1a',
            border: `1.5px solid ${accent}70`,
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: accent, color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '3px' }}>
                  STEP {discographyWizardStep} OF 5
                </span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>
                  {discographyWizardStep === 1 && 'Release Details & Musical Metadata'}
                  {discographyWizardStep === 2 && 'Master Audio & Multitrack Stems Asset'}
                  {discographyWizardStep === 3 && 'Cover Artwork & AI Generator'}
                  {discographyWizardStep === 4 && 'Publishing, Credits & Commercial Tiers'}
                  {discographyWizardStep === 5 && 'Review & Ingest into Discography'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDiscographyWizardStep(s)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: discographyWizardStep === s ? accent : 'rgba(255,255,255,0.1)',
                        color: discographyWizardStep === s ? '#000' : '#fff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDiscographyWizardOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', marginLeft: '6px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {discographyWizardStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Release Title *</label>
                  <input
                    type="text"
                    value={discographyWizardData.title || ''}
                    onChange={e => setDiscographyWizardData({ ...discographyWizardData, title: e.target.value })}
                    placeholder="e.g. Echoes of the Savannah"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Release Type</label>
                  <select
                    value={discographyWizardData.releaseType || 'single'}
                    onChange={e => setDiscographyWizardData({ ...discographyWizardData, releaseType: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="single">Single</option>
                    <option value="ep">EP (Extended Play)</option>
                    <option value="album">Full Studio Album (LP)</option>
                    <option value="stems">Lossless Multitrack Stems Pack</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Primary Genre / Style</label>
                  <select
                    value={discographyWizardData.genre || 'Afro-fusion'}
                    onChange={e => setDiscographyWizardData({ ...discographyWizardData, genre: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  >
                    {canonicalGenres.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Tempo (BPM)</label>
                    <input
                      type="text"
                      value={discographyWizardData.bpm || '124'}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, bpm: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Musical Key</label>
                    <input
                      type="text"
                      value={discographyWizardData.key || 'F Minor'}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, key: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {discographyWizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Master Audio WAV / FLAC URL</label>
                  <input
                    type="text"
                    value={discographyWizardData.masterAudioUrl || ''}
                    onChange={e => setDiscographyWizardData({ ...discographyWizardData, masterAudioUrl: e.target.value })}
                    placeholder="https://audio.intermaven.io/masters/..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Uncompressed Multitrack Stems ZIP URL</label>
                  <input
                    type="text"
                    value={discographyWizardData.stemsZipUrl || ''}
                    onChange={e => setDiscographyWizardData({ ...discographyWizardData, stemsZipUrl: e.target.value })}
                    placeholder="https://audio.intermaven.io/stems/..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>ISRC Code</label>
                    <input
                      type="text"
                      value={discographyWizardData.isrc || ''}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, isrc: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Track Duration</label>
                    <input
                      type="text"
                      value={discographyWizardData.duration || '3:45'}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, duration: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {discographyWizardStep === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '18px', alignItems: 'center' }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${accent}50`, background: '#04060d' }}>
                  <img
                    src={discographyWizardData.coverArt || 'https://picsum.photos/seed/discography_new/800/800'}
                    alt="Cover Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Cover Image URL</label>
                    <input
                      type="text"
                      value={discographyWizardData.coverArt || ''}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, coverArt: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>AI Cover Art Prompt</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={discographyWizardData.coverPrompt || ''}
                        onChange={e => setDiscographyWizardData({ ...discographyWizardData, coverPrompt: e.target.value })}
                        placeholder="Prompt for generating high-res album cover..."
                        style={{ flex: 1, padding: '8px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const seed = encodeURIComponent((discographyWizardData.coverPrompt || 'release').slice(0, 15).replace(/[^a-z0-9]/gi, '_'))
                          setDiscographyWizardData({ ...discographyWizardData, coverArt: `https://picsum.photos/seed/${seed}_${Date.now()}/800/800` })
                          showStatus('AI Cover Artwork generated for release!', 'success')
                        }}
                        style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '3px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        ✨ Generate AI
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {discographyWizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Songwriters / Composers</label>
                    <input
                      type="text"
                      value={discographyWizardData.songwriters || ''}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, songwriters: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Publishing Administrator & PRO</label>
                    <input
                      type="text"
                      value={discographyWizardData.publisher || ''}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, publisher: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Full Track (Credits)</label>
                    <input
                      type="number"
                      value={discographyWizardData.priceCredits || 50}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, priceCredits: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Single Download ($ USD)</label>
                    <input
                      type="text"
                      value={discographyWizardData.priceUsd || '$1.99'}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, priceUsd: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Multitrack Stems Pack ($)</label>
                    <input
                      type="text"
                      value={discographyWizardData.stemsPriceUsd || '$24.99'}
                      onChange={e => setDiscographyWizardData({ ...discographyWizardData, stemsPriceUsd: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {discographyWizardStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                  Ready to ingest release into creator Discography and synchronize across TuneMavens public EPK:
                </p>
                <div style={{ background: '#050711', border: '1px solid rgba(0,240,255,0.25)', padding: '16px', borderRadius: '6px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={discographyWizardData.coverArt}
                    alt="Review Cover"
                    style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, fontSize: '0.82rem', lineHeight: 1.5 }}>
                    <strong style={{ color: '#fff', fontSize: '1rem', display: 'block' }}>{discographyWizardData.title || 'Untitled Release'}</strong>
                    <span style={{ color: '#00f0ff' }}>{discographyWizardData.releaseType?.toUpperCase()}</span> · <span style={{ color: '#94a3b8' }}>{discographyWizardData.genre}</span> · <span>ISRC: {discographyWizardData.isrc}</span><br />
                    <span>Publisher: {discographyWizardData.publisher}</span> · <span>Price: {discographyWizardData.priceCredits} TM Credits</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                disabled={discographyWizardStep === 1}
                onClick={() => setDiscographyWizardStep(s => Math.max(1, s - 1))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: discographyWizardStep === 1 ? '#475569' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '7px 16px',
                  borderRadius: '3px',
                  cursor: discographyWizardStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Back
              </button>

              {discographyWizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setDiscographyWizardStep(s => Math.min(5, s + 1))}
                  style={{
                    background: accent,
                    color: '#000',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveDiscographyWizard}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiCheckLine size={16} /> Save Release to Discography
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: TOURS & SHOWS SETUP WIZARD ================= */}
      {showsWizardOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 16, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#090d1a',
            border: `1.5px solid ${accent}70`,
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: accent, color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '3px' }}>
                  STEP {showsWizardStep} OF 4
                </span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>
                  {showsWizardStep === 1 && 'Venue, City & Market'}
                  {showsWizardStep === 2 && 'Dates, Doors & Age Limits'}
                  {showsWizardStep === 3 && 'Ticket Tiers & On-Sale Pricing'}
                  {showsWizardStep === 4 && 'Flyer Artwork & Event Narrative'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShowsWizardStep(s)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: showsWizardStep === s ? accent : 'rgba(255,255,255,0.1)',
                        color: showsWizardStep === s ? '#000' : '#fff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowsWizardOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', marginLeft: '6px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {showsWizardStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Venue Name *</label>
                  <input
                    type="text"
                    value={showsWizardData.venue || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, venue: e.target.value })}
                    placeholder="e.g. O2 Academy Brixton, Madison Square Garden"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>City & Country / State *</label>
                  <input
                    type="text"
                    value={showsWizardData.city || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, city: e.target.value })}
                    placeholder="e.g. London, UK or New York, NY"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            )}

            {showsWizardStep === 2 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Performance Date</label>
                  <input
                    type="text"
                    value={showsWizardData.date || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, date: e.target.value })}
                    placeholder="e.g. OCT 28, 2026"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Doors Open</label>
                  <input
                    type="text"
                    value={showsWizardData.doors || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, doors: e.target.value })}
                    placeholder="e.g. 7:00 PM"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Age Limit</label>
                  <select
                    value={showsWizardData.age || 'All Ages'}
                    onChange={e => setShowsWizardData({ ...showsWizardData, age: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="All Ages">All Ages</option>
                    <option value="16+">16+ (Valid ID Required)</option>
                    <option value="18+">18+ (Adults Only)</option>
                    <option value="21+">21+ (Bar Access)</option>
                  </select>
                </div>
              </div>
            )}

            {showsWizardStep === 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>General Admission ($)</label>
                  <input
                    type="number"
                    value={showsWizardData.priceGA ?? 25}
                    onChange={e => setShowsWizardData({ ...showsWizardData, priceGA: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>VIP Balcony ($)</label>
                  <input
                    type="number"
                    value={showsWizardData.priceVIP ?? 50}
                    onChange={e => setShowsWizardData({ ...showsWizardData, priceVIP: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Meet & Greet Pass ($)</label>
                  <input
                    type="number"
                    value={showsWizardData.priceMeet ?? 99}
                    onChange={e => setShowsWizardData({ ...showsWizardData, priceMeet: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Ticket Status</label>
                  <select
                    value={showsWizardData.status || 'On Sale'}
                    onChange={e => setShowsWizardData({ ...showsWizardData, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="On Sale">On Sale</option>
                    <option value="Selling Fast">Selling Fast</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="RSVP Only">RSVP Only</option>
                  </select>
                </div>
              </div>
            )}

            {showsWizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Tour Flyer Artwork URL</label>
                  <input
                    type="text"
                    value={showsWizardData.flyer || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, flyer: e.target.value })}
                    placeholder="https://images.unsplash.com/... or picsum seed"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Show Description & Guest Lineup</label>
                  <textarea
                    rows="3"
                    value={showsWizardData.description || ''}
                    onChange={e => setShowsWizardData({ ...showsWizardData, description: e.target.value })}
                    placeholder="Special guests, staging setup, VIP perks, or age guidelines..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            )}

            {/* Modal Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                disabled={showsWizardStep === 1}
                onClick={() => setShowsWizardStep(s => Math.max(1, s - 1))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: showsWizardStep === 1 ? '#475569' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '7px 16px',
                  borderRadius: '3px',
                  cursor: showsWizardStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Back
              </button>

              {showsWizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setShowsWizardStep(s => Math.min(4, s + 1))}
                  style={{
                    background: accent,
                    color: '#000',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveShowsWizard}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiCheckLine size={16} /> Add Show to Roster
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: STORE & MERCH SETUP WIZARD ================= */}
      {storeWizardOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 16, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#090d1a',
            border: `1.5px solid ${accent}70`,
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: accent, color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '3px' }}>
                  STEP {storeWizardStep} OF 4
                </span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>
                  {storeWizardStep === 1 && 'Product Basics & Category'}
                  {storeWizardStep === 2 && 'Multi-Image Gallery Carousel'}
                  {storeWizardStep === 3 && 'Product Variants & Delivery Specs'}
                  {storeWizardStep === 4 && 'Pricing, Credits & Stock Level'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStoreWizardStep(s)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: storeWizardStep === s ? accent : 'rgba(255,255,255,0.1)',
                        color: storeWizardStep === s ? '#000' : '#fff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setStoreWizardOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', marginLeft: '6px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {storeWizardStep === 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Product Title *</label>
                  <input
                    type="text"
                    value={storeWizardData.title || ''}
                    onChange={e => setStoreWizardData({ ...storeWizardData, title: e.target.value })}
                    placeholder="e.g. Official Tour Heavyweight Hoodie"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Category</label>
                  <select
                    value={storeWizardData.category || 'apparel'}
                    onChange={e => setStoreWizardData({ ...storeWizardData, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="vinyl">Vinyl & Physical Media</option>
                    <option value="apparel">Apparel & Merch</option>
                    <option value="stems">Audio Stems & Multitracks</option>
                    <option value="digital">Digital Masters & Lossless</option>
                    <option value="vip">Exclusive Fan VIP Bundle</option>
                  </select>
                </div>
              </div>
            )}

            {storeWizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Carousel Product Images (Primary & Angles)</label>
                {(storeWizardData.images || []).map((imgUrl, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: accent, width: '65px', fontWeight: 800 }}>Angle #{i + 1}</span>
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={e => {
                        const nextImgs = [...(storeWizardData.images || [])]
                        nextImgs[i] = e.target.value
                        setStoreWizardData({ ...storeWizardData, images: nextImgs })
                      }}
                      style={{ flex: 1, padding: '8px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.82rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextImgs = (storeWizardData.images || []).filter((_, idx) => idx !== i)
                        setStoreWizardData({ ...storeWizardData, images: nextImgs.length ? nextImgs : [''] })
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const nextImgs = [...(storeWizardData.images || []), `https://picsum.photos/seed/merch_${Date.now()}/800/800`]
                    setStoreWizardData({ ...storeWizardData, images: nextImgs })
                  }}
                  style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '6px 12px', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <RiAddLine /> Add Another Carousel Angle
                </button>
              </div>
            )}

            {storeWizardStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Item Description & Materials</label>
                  <textarea
                    rows="3"
                    value={storeWizardData.desc || ''}
                    onChange={e => setStoreWizardData({ ...storeWizardData, desc: e.target.value })}
                    placeholder="e.g. 100% heavyweight organic cotton, screen-printed tour dates on back..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            )}

            {storeWizardStep === 4 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Retail Price ($ USD)</label>
                  <input
                    type="text"
                    value={storeWizardData.price || '$29.99'}
                    onChange={e => setStoreWizardData({ ...storeWizardData, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Stock Level</label>
                  <select
                    value={storeWizardData.stock || 'In Stock'}
                    onChange={e => setStoreWizardData({ ...storeWizardData, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Edition (Only 25 Left)">Limited Edition</option>
                    <option value="Pre-Order">Pre-Order</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Delivery Mode</label>
                  <input
                    type="text"
                    value="Global Courier / Instant FLAC"
                    readOnly
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#64748b', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            )}

            {/* Modal Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                disabled={storeWizardStep === 1}
                onClick={() => setStoreWizardStep(s => Math.max(1, s - 1))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: storeWizardStep === 1 ? '#475569' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '7px 16px',
                  borderRadius: '3px',
                  cursor: storeWizardStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Back
              </button>

              {storeWizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setStoreWizardStep(s => Math.min(4, s + 1))}
                  style={{
                    background: accent,
                    color: '#000',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveStoreWizard}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiCheckLine size={16} /> Save Product to Store
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PRESS & EPK SETUP WIZARD ================= */}
      {pressWizardOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 16, 0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#090d1a',
            border: `1.5px solid ${accent}70`,
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: accent, color: '#000', fontWeight: 900, fontSize: '0.72rem', padding: '3px 8px', borderRadius: '3px' }}>
                  STEP {pressWizardStep} OF 4
                </span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>
                  {pressWizardStep === 1 && 'Headline Hook & Press Angle'}
                  {pressWizardStep === 2 && 'Lead Press Accolade & Publication'}
                  {pressWizardStep === 3 && 'Technical Rider & Stage Specifications'}
                  {pressWizardStep === 4 && 'High-Res Assets & Direct PDF Export'}
                </strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPressWizardStep(s)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: pressWizardStep === s ? accent : 'rgba(255,255,255,0.1)',
                        color: pressWizardStep === s ? '#000' : '#fff',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPressWizardOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', marginLeft: '6px' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {pressWizardStep === 1 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>EPK Headline Hook</label>
                <input
                  type="text"
                  value={pressWizardData.headline || ''}
                  onChange={e => setPressWizardData({ ...pressWizardData, headline: e.target.value })}
                  placeholder="e.g. Sonic Futurist Pioneering Modular Electronic Soundscapes"
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
            )}

            {pressWizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Featured Editorial Quote</label>
                  <textarea
                    rows="3"
                    value={pressWizardData.pressQuote || ''}
                    onChange={e => setPressWizardData({ ...pressWizardData, pressQuote: e.target.value })}
                    placeholder="e.g. A virtuoso synthesis of traditional percussion and modular analog synthesis..."
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>Publication Outlet</label>
                  <input
                    type="text"
                    value={pressWizardData.pressOutlet || ''}
                    onChange={e => setPressWizardData({ ...pressWizardData, pressOutlet: e.target.value })}
                    placeholder="e.g. Sound On Sound, Pitchfork, Rolling Stone"
                    style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                  />
                </div>
              </div>
            )}

            {pressWizardStep === 3 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 700 }}>FOH Console & Technical Rider Summary</label>
                <textarea
                  rows="4"
                  value={pressWizardData.techRiderSpec || ''}
                  onChange={e => setPressWizardData({ ...pressWizardData, techRiderSpec: e.target.value })}
                  placeholder="Console requirements, in-ear monitor channels, stage plot dimensions..."
                  style={{ width: '100%', padding: '9px 12px', background: '#04060d', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '3px', color: '#fff', fontSize: '0.84rem' }}
                />
              </div>
            )}

            {pressWizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  Ready to apply Press Kit updates to public EPK layout and PDF generator:
                </p>
                <div style={{ background: '#050711', border: '1px solid rgba(0,240,255,0.25)', padding: '14px', borderRadius: '4px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  Headline: <strong style={{ color: '#fff' }}>{pressWizardData.headline || 'Afro-Futurist Sonic Architect'}</strong><br />
                  Quote: <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>"{pressWizardData.pressQuote || 'Sharpest sonic innovators in the business today.'}"</span><br />
                  Outlet: <strong style={{ color: accent }}>{pressWizardData.pressOutlet || 'Pitchfork'}</strong>
                </div>
              </div>
            )}

            {/* Modal Navigation Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                type="button"
                disabled={pressWizardStep === 1}
                onClick={() => setPressWizardStep(s => Math.max(1, s - 1))}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: pressWizardStep === 1 ? '#475569' : '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '7px 16px',
                  borderRadius: '3px',
                  cursor: pressWizardStep === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
              >
                Back
              </button>

              {pressWizardStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setPressWizardStep(s => Math.min(4, s + 1))}
                  style={{
                    background: accent,
                    color: '#000',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (pressWizardData.pressQuote) updateField('pressQuote', pressWizardData.pressQuote)
                    if (pressWizardData.pressOutlet) updateField('pressOutlet', pressWizardData.pressOutlet)
                    if (pressWizardData.headline) updateField('pressHeadline', pressWizardData.headline)
                    if (pressWizardData.techRiderSpec) updateField('techRiderSummary', pressWizardData.techRiderSpec)
                    setPressWizardOpen(false)
                    showStatus('Press Kit & EPK Specifications successfully updated!', 'success')
                  }}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RiCheckLine size={16} /> Apply Press Kit Updates
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Art Prompt Dialogue Modal */}
      <AiArtPromptModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiModalConfig.title}
        defaultPrompt={aiModalConfig.defaultPrompt}
        aspectRatio={aiModalConfig.aspectRatio}
        subdomain={activeSubdomain}
        onSuccess={(mediaUrl, prompt) => {
          if (typeof aiModalConfig.onSuccess === 'function') {
            aiModalConfig.onSuccess(mediaUrl, prompt)
          }
          setAiModalOpen(false)
        }}
      />

      {/* Universal Media Asset Picker Modal */}
      <MediaAssetPickerModal
        isOpen={pickerModalOpen}
        onClose={() => setPickerModalOpen(false)}
        title={pickerModalConfig.title}
        subdomain={activeSubdomain}
        filterType={pickerModalConfig.filterType}
        onSelect={(asset) => {
          if (typeof pickerModalConfig.onSelect === 'function') {
            pickerModalConfig.onSelect(asset)
          }
          setPickerModalOpen(false)
        }}
      />

    </div>
  )
}
